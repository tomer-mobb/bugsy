import Debug from 'debug'
import fetch, { File, fileFrom, FormData } from 'node-fetch'

import { ReportUploadInfo } from './graphql/types'

const debug = Debug('mobbdev:upload-file')

type UploadFileArgs = Omit<ReportUploadInfo, 'fixReportId'> & {
  file: string | Buffer
}
export async function uploadFile({
  file,
  url,
  uploadKey,
  uploadFields,
}: UploadFileArgs) {
  debug('upload file start %s', url)
  debug('upload fields %o', uploadFields)
  debug('upload key %s', uploadKey)
  const form = new FormData()
  Object.entries(uploadFields).forEach(([key, value]) => {
    form.append(key, value)
  })

  form.append('key', uploadKey)
  if (typeof file === 'string') {
    debug('upload file from path %s', file)
    form.append('file', await fileFrom(file))
  } else {
    debug('upload file from buffer')
    form.append('file', new File([file], 'file'))
  }
  const response = await fetch(url, {
    method: 'POST',
    body: form,
  })

  if (!response.ok) {
    debug('error from S3 %s %s', response.body, response.status)
    throw new Error(`Failed to upload the file: ${response.status}`)
  }
  debug('upload file done')
}
