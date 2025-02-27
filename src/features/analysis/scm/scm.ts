import {
  createPullRequest,
  getGithubBlameRanges,
  getGithubBranchList,
  getGithubIsRemoteBranch,
  getGithubIsUserCollaborator,
  getGithubPullRequestStatus,
  getGithubReferenceData,
  getGithubRepoDefaultBranch,
  getGithubRepoList,
  getGithubUsername,
  githubValidateParams,
} from './github'
import {
  createMergeRequest,
  getGitlabBlameRanges,
  getGitlabBranchList,
  getGitlabIsRemoteBranch,
  getGitlabIsUserCollaborator,
  getGitlabMergeRequestStatus,
  getGitlabReferenceData,
  getGitlabRepoDefaultBranch,
  getGitlabRepoList,
  getGitlabUsername,
  GitlabMergeRequestStatusEnum,
  gitlabValidateParams,
} from './gitlab'
import { isValidBranchName } from './scmSubmit'

export function getScmLibTypeFromUrl(url: string | undefined) {
  if (!url) {
    return undefined
  }
  if (url.toLowerCase().startsWith('https://gitlab.com/')) {
    return ScmLibScmType.GITLAB
  }
  if (url.toLowerCase().startsWith('https://github.com/')) {
    return ScmLibScmType.GITHUB
  }
  return undefined
}

export async function scmCanReachRepo({
  repoUrl,
  githubToken,
  gitlabToken,
}: {
  repoUrl: string
  githubToken: string | undefined
  gitlabToken: string | undefined
}) {
  try {
    const scmLibType = getScmLibTypeFromUrl(repoUrl)
    await SCMLib.init({
      url: repoUrl,
      accessToken:
        scmLibType === ScmLibScmType.GITHUB
          ? githubToken
          : scmLibType === ScmLibScmType.GITLAB
          ? gitlabToken
          : '',
      scmType: scmLibType,
    })
    return true
  } catch (e) {
    return false
  }
}

export enum ReferenceType {
  BRANCH = 'BRANCH',
  COMMIT = 'COMMIT',
  TAG = 'TAG',
}

export enum ScmSubmitRequestStatus {
  MERGED = 'MERGED',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  DRAFT = 'DRAFT',
}

export enum ScmLibScmType {
  GITHUB = 'GITHUB',
  GITLAB = 'GITLAB',
}

export type ScmRepoInfo = {
  repoName: string
  repoUrl: string
  repoOwner: string
  repoLanguages: string[]
  repoIsPublic: boolean
  repoUpdatedAt: string
}

export class InvalidRepoUrlError extends Error {
  constructor(m: string) {
    super(m)
  }
}

export class InvalidAccessTokenError extends Error {
  constructor(m: string) {
    super(m)
  }
}

export class InvalidUrlPatternError extends Error {
  constructor(m: string) {
    super(m)
  }
}

export class BadShaError extends Error {
  constructor(m: string) {
    super(m)
  }
}

export class RefNotFoundError extends Error {
  constructor(m: string) {
    super(m)
  }
}

export class RepoNoTokenAccessError extends Error {
  constructor(m: string) {
    super(m)
  }
}

export abstract class SCMLib {
  protected readonly url?: string
  protected readonly accessToken?: string

  protected constructor(url?: string, accessToken?: string) {
    this.accessToken = accessToken
    this.url = url
  }

  public async getUrlWithCredentials() {
    if (!this.url) {
      console.error('no url for getUrlWithCredentials()')
      throw new Error('no url')
    }
    const trimmedUrl = this.url.trim().replace(/\/$/, '')
    if (!this.accessToken) {
      return trimmedUrl
    }
    const username = await this._getUsernameForAuthUrl()
    const is_http = trimmedUrl.toLowerCase().startsWith('http://')
    const is_https = trimmedUrl.toLowerCase().startsWith('https://')
    if (is_http) {
      return `http://${username}:${this.accessToken}@${trimmedUrl
        .toLowerCase()
        .replace('http://', '')}`
    } else if (is_https) {
      return `https://${username}:${this.accessToken}@${trimmedUrl
        .toLowerCase()
        .replace('https://', '')}`
    } else {
      console.error(`invalid scm url ${trimmedUrl}`)
      throw new Error(`invalid scm url ${trimmedUrl}`)
    }
  }

  abstract getAuthHeaders(): Record<string, string>

  abstract getDownloadUrl(sha: string): string

  abstract _getUsernameForAuthUrl(): Promise<string>

  abstract getIsRemoteBranch(_branch: string): Promise<boolean>

  abstract validateParams(): Promise<void>

  abstract getRepoList(): Promise<ScmRepoInfo[]>

  abstract getBranchList(): Promise<string[]>

  abstract getUserHasAccessToRepo(): Promise<boolean>

  abstract getUsername(): Promise<string>

  abstract getSubmitRequestStatus(
    _scmSubmitRequestId: string
  ): Promise<ScmSubmitRequestStatus>

  abstract createSubmitRequest(
    targetBranchName: string,
    sourceBranchName: string,
    title: string,
    body: string
  ): Promise<string>

  abstract getRepoBlameRanges(
    ref: string,
    path: string
  ): Promise<
    {
      startingLine: number
      endingLine: number
      name: string
      login: string
      email: string
    }[]
  >

  abstract getReferenceData(ref: string): Promise<{
    type: ReferenceType
    sha: string
    date: Date | undefined
  }>

  abstract getRepoDefaultBranch(): Promise<string>

  public getAccessToken(): string {
    return this.accessToken || ''
  }

  public getUrl(): string | undefined {
    return this.url
  }

  public getName(): string {
    if (!this.url) {
      return ''
    }
    return this.url.split('/').at(-1) || ''
  }

  public static async getIsValidBranchName(
    branchName: string
  ): Promise<boolean> {
    return isValidBranchName(branchName)
  }

  public static async init({
    url,
    accessToken,
    scmType,
  }: {
    url: string | undefined
    accessToken: string | undefined
    scmType: ScmLibScmType | undefined
  }): Promise<SCMLib> {
    let trimmedUrl = undefined
    if (url) {
      trimmedUrl = url.trim().replace(/\/$/, '')
    }
    try {
      if (ScmLibScmType.GITHUB === scmType) {
        const scm = new GithubSCMLib(trimmedUrl, accessToken)
        await scm.validateParams()
        return scm
      }
      if (ScmLibScmType.GITLAB === scmType) {
        const scm = new GitlabSCMLib(trimmedUrl, accessToken)
        await scm.validateParams()
        return scm
      }
    } catch (e) {
      if (e instanceof InvalidRepoUrlError && url) {
        throw new RepoNoTokenAccessError('no access to repo')
      }
    }

    return new StubSCMLib(trimmedUrl)
  }
}

export class GitlabSCMLib extends SCMLib {
  async createSubmitRequest(
    targetBranchName: string,
    sourceBranchName: string,
    title: string,
    body: string
  ): Promise<string> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
    return String(
      await createMergeRequest({
        title,
        body,
        targetBranchName,
        sourceBranchName,
        repoUrl: this.url,
        accessToken: this.accessToken,
      })
    )
  }

  async validateParams() {
    return gitlabValidateParams({
      url: this.url,
      accessToken: this.accessToken,
    })
  }

  async getRepoList(): Promise<ScmRepoInfo[]> {
    if (!this.accessToken) {
      console.error('no access token')
      throw new Error('no access token')
    }
    return getGitlabRepoList(this.accessToken)
  }

  async getBranchList(): Promise<string[]> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
    return getGitlabBranchList({
      accessToken: this.accessToken,
      repoUrl: this.url,
    })
  }

  getAuthHeaders(): Record<string, string> {
    if (this?.accessToken?.startsWith('glpat-')) {
      return {
        'Private-Token': this.accessToken,
      }
    } else {
      return { authorization: `Bearer ${this.accessToken}` }
    }
  }

  getDownloadUrl(sha: string): string {
    const repoName = this.url?.split('/')[-1]
    return `${this.url}/-/archive/${sha}/${repoName}-${sha}.zip`
  }

  async _getUsernameForAuthUrl(): Promise<string> {
    if (this?.accessToken?.startsWith('glpat-')) {
      return this.getUsername()
    } else {
      return 'oauth2'
    }
  }

  async getIsRemoteBranch(branch: string): Promise<boolean> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
    return getGitlabIsRemoteBranch({
      accessToken: this.accessToken,
      repoUrl: this.url,
      branch,
    })
  }

  async getUserHasAccessToRepo(): Promise<boolean> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
    const username = await this.getUsername()
    return getGitlabIsUserCollaborator({
      username,
      accessToken: this.accessToken,
      repoUrl: this.url,
    })
  }

  async getUsername(): Promise<string> {
    if (!this.accessToken) {
      console.error('no access token')
      throw new Error('no access token')
    }
    return getGitlabUsername(this.accessToken)
  }

  async getSubmitRequestStatus(
    scmSubmitRequestId: string
  ): Promise<ScmSubmitRequestStatus> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
    const state = await getGitlabMergeRequestStatus({
      accessToken: this.accessToken,
      repoUrl: this.url,
      mrNumber: Number(scmSubmitRequestId),
    })
    switch (state) {
      case GitlabMergeRequestStatusEnum.merged:
        return ScmSubmitRequestStatus.MERGED
      case GitlabMergeRequestStatusEnum.opened:
        return ScmSubmitRequestStatus.OPEN
      case GitlabMergeRequestStatusEnum.closed:
        return ScmSubmitRequestStatus.CLOSED
      default:
        throw new Error(`unknown state ${state}`)
    }
  }

  async getRepoBlameRanges(
    ref: string,
    path: string
  ): Promise<
    {
      startingLine: number
      endingLine: number
      name: string
      login: string
      email: string
    }[]
  > {
    if (!this.url) {
      console.error('no url')
      throw new Error('no url')
    }
    return await getGitlabBlameRanges(
      { ref, path, gitlabUrl: this.url },
      {
        gitlabAuthToken: this.accessToken,
      }
    )
  }

  async getReferenceData(ref: string): Promise<{
    type: ReferenceType
    sha: string
    date: Date | undefined
  }> {
    if (!this.url) {
      console.error('no url')
      throw new Error('no url')
    }
    return await getGitlabReferenceData(
      { ref, gitlabUrl: this.url },
      {
        gitlabAuthToken: this.accessToken,
      }
    )
  }

  async getRepoDefaultBranch(): Promise<string> {
    if (!this.url) {
      console.error('no url')
      throw new Error('no url')
    }
    return await getGitlabRepoDefaultBranch(this.url, {
      gitlabAuthToken: this.accessToken,
    })
  }
}

export class GithubSCMLib extends SCMLib {
  async createSubmitRequest(
    targetBranchName: string,
    sourceBranchName: string,
    title: string,
    body: string
  ): Promise<string> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
    return String(
      await createPullRequest({
        title,
        body,
        targetBranchName,
        sourceBranchName,
        repoUrl: this.url,
        accessToken: this.accessToken,
      })
    )
  }

  async validateParams() {
    return githubValidateParams(this.url, this.accessToken)
  }

  async getRepoList(): Promise<ScmRepoInfo[]> {
    if (!this.accessToken) {
      console.error('no access token')
      throw new Error('no access token')
    }
    return getGithubRepoList(this.accessToken)
  }

  async getBranchList(): Promise<string[]> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
    return getGithubBranchList(this.accessToken, this.url)
  }

  getAuthHeaders(): Record<string, string> {
    if (this.accessToken) {
      return { authorization: `Bearer ${this.accessToken}` }
    }
    return {}
  }

  getDownloadUrl(sha: string): string {
    return `${this.url}/zipball/${sha}`
  }

  async _getUsernameForAuthUrl(): Promise<string> {
    return this.getUsername()
  }

  async getIsRemoteBranch(branch: string): Promise<boolean> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
    return getGithubIsRemoteBranch(this.accessToken, this.url, branch)
  }

  async getUserHasAccessToRepo(): Promise<boolean> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
    const username = await this.getUsername()
    return getGithubIsUserCollaborator(username, this.accessToken, this.url)
  }

  async getUsername(): Promise<string> {
    if (!this.accessToken) {
      console.error('no access token')
      throw new Error('no access token')
    }
    return getGithubUsername(this.accessToken)
  }

  async getSubmitRequestStatus(
    scmSubmitRequestId: string
  ): Promise<ScmSubmitRequestStatus> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
    const state = await getGithubPullRequestStatus(
      this.accessToken,
      this.url,
      Number(scmSubmitRequestId)
    )
    if (state === 'merged') {
      return ScmSubmitRequestStatus.MERGED
    }
    if (state === 'open') {
      return ScmSubmitRequestStatus.OPEN
    }
    if (state === 'draft') {
      return ScmSubmitRequestStatus.DRAFT
    }
    if (state === 'closed') {
      return ScmSubmitRequestStatus.CLOSED
    }
    throw new Error(`unknown state ${state}`)
  }

  async getRepoBlameRanges(
    ref: string,
    path: string
  ): Promise<
    {
      startingLine: number
      endingLine: number
      name: string
      login: string
      email: string
    }[]
  > {
    if (!this.url) {
      console.error('no url')
      throw new Error('no url')
    }
    return await getGithubBlameRanges(
      { ref, path, gitHubUrl: this.url },
      {
        githubAuthToken: this.accessToken,
      }
    )
  }

  async getReferenceData(ref: string): Promise<{
    type: ReferenceType
    sha: string
    date: Date | undefined
  }> {
    if (!this.url) {
      console.error('no url')
      throw new Error('no url')
    }
    return await getGithubReferenceData(
      { ref, gitHubUrl: this.url },
      {
        githubAuthToken: this.accessToken,
      }
    )
  }

  async getRepoDefaultBranch(): Promise<string> {
    if (!this.url) {
      console.error('no url')
      throw new Error('no url')
    }
    return await getGithubRepoDefaultBranch(this.url, {
      githubAuthToken: this.accessToken,
    })
  }
}

export class StubSCMLib extends SCMLib {
  async createSubmitRequest(
    _targetBranchName: string,
    _sourceBranchName: string,
    _title: string,
    _body: string
  ): Promise<string> {
    console.error('createSubmitRequest() not implemented')
    throw new Error('createSubmitRequest() not implemented')
  }

  getAuthHeaders(): Record<string, string> {
    console.error('getAuthHeaders() not implemented')
    throw new Error('getAuthHeaders() not implemented')
  }

  getDownloadUrl(_sha: string): string {
    console.error('getDownloadUrl() not implemented')
    throw new Error('getDownloadUrl() not implemented')
  }

  async _getUsernameForAuthUrl(): Promise<string> {
    console.error('_getUsernameForAuthUrl() not implemented')
    throw new Error('_getUsernameForAuthUrl() not implemented')
  }

  async getIsRemoteBranch(_branch: string): Promise<boolean> {
    console.error('getIsRemoteBranch() not implemented')
    throw new Error('getIsRemoteBranch() not implemented')
  }

  async validateParams() {
    console.error('validateParams() not implemented')
    throw new Error('validateParams() not implemented')
  }

  async getRepoList(): Promise<ScmRepoInfo[]> {
    console.error('getBranchList() not implemented')
    throw new Error('getBranchList() not implemented')
  }

  async getBranchList(): Promise<string[]> {
    console.error('getBranchList() not implemented')
    throw new Error('getBranchList() not implemented')
  }

  async getUsername(): Promise<string> {
    console.error('getUsername() not implemented')
    throw new Error('getUsername() not implemented')
  }

  async getSubmitRequestStatus(
    _scmSubmitRequestId: string
  ): Promise<ScmSubmitRequestStatus> {
    console.error('getSubmitRequestStatus() not implemented')
    throw new Error('getSubmitRequestStatus() not implemented')
  }

  async getUserHasAccessToRepo(): Promise<boolean> {
    console.error('getUserHasAccessToRepo() not implemented')
    throw new Error('getUserHasAccessToRepo() not implemented')
  }

  async getRepoBlameRanges(
    _ref: string,
    _path: string
  ): Promise<
    {
      startingLine: number
      endingLine: number
      name: string
      login: string
      email: string
    }[]
  > {
    console.error('getRepoBlameRanges() not implemented')
    throw new Error('getRepoBlameRanges() not implemented')
  }

  async getReferenceData(_ref: string): Promise<{
    type: ReferenceType
    sha: string
    date: Date | undefined
  }> {
    console.error('getReferenceData() not implemented')
    throw new Error('getReferenceData() not implemented')
  }

  async getRepoDefaultBranch(): Promise<string> {
    console.error('getRepoDefaultBranch() not implemented')
    throw new Error('getRepoDefaultBranch() not implemented')
  }
}
