import chalk from 'chalk'

export const repoOption = {
  alias: 'r',
  demandOption: true,
  type: 'string',
  describe: chalk.bold('Github / GitLab repository URL'),
} as const
export const projectNameOption = {
  type: 'string',
  describe: chalk.bold('Checkmarx project name (when scanning with Checkmarx)'),
} as const

export const yesOption = {
  alias: 'yes',
  type: 'boolean',
  describe: chalk.bold('Skip prompts and use default values'),
} as const

export const refOption = {
  describe: chalk.bold('reference of the repository (branch, tag, commit)'),
  type: 'string',
  demandOption: false,
} as const

export const ciOption = {
  describe: chalk.bold(
    'Run in CI mode, prompts and browser will not be opened'
  ),
  type: 'boolean',
  default: false,
} as const

export const apiKeyOption = {
  type: 'string',
  describe: chalk.bold('Mobb authentication api-key'),
} as const

export const commitHashOption = {
  alias: 'ch',
  describe: chalk.bold('Hash of the commit'),
  type: 'string',
} as const
