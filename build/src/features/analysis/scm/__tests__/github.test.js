'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const vitest_1 = require('vitest')
const github_1 = require('../github')

const OWNER = 'facebook'
const REPO = 'react'
const GITHUB_URL = `https://github.com/${OWNER}/${REPO}`
const NON_EXISTING_GITHUB_URL = 'https://github.com/facebook/react1111'
const INVALID_URL = 'https://invalid.com/facebook'
const EXISTING_COMMIT = 'c7967b194b41cb16907eed718b78d89120089f6a'
const EXISTING_BRANCH = 'portals'
const NON_EXISTING_BRANCH = 'non-existing-branch'
const EXISTING_TAG = 'v18.2.0'
;(0, vitest_1.describe)('github reference', () => {
  ;(0, vitest_1.it)('test non existing repo', async () => {
    await (0, vitest_1.expect)(() =>
      (0, github_1.getGithubRepoDefaultBranch)(NON_EXISTING_GITHUB_URL)
    ).rejects.toThrow()
  })
  ;(0, vitest_1.it)('test existing repo', async () => {
    ;(0, vitest_1.expect)(
      await (0, github_1.getGithubRepoDefaultBranch)(GITHUB_URL)
    ).toEqual('main')
  })
  ;(0, vitest_1.it)('test if date is correct for commit', async () => {
    ;(0, vitest_1.expect)(
      await (0, github_1.getGithubReferenceData)({
        gitHubUrl: GITHUB_URL,
        ref: EXISTING_COMMIT,
      })
    ).toMatchInlineSnapshot(`
      {
        "date": 2023-02-20T21:16:23.000Z,
        "sha": "c7967b194b41cb16907eed718b78d89120089f6a",
        "type": "COMMIT",
      }
    `)
  })
  ;(0, vitest_1.it)('test if date is correct for branch', async () => {
    ;(0, vitest_1.expect)(
      await (0, github_1.getGithubReferenceData)({
        gitHubUrl: GITHUB_URL,
        ref: EXISTING_BRANCH,
      })
    ).toMatchInlineSnapshot(`
      {
        "date": 2020-02-05T00:00:59.000Z,
        "sha": "628f6f50b514529101a142242846985f7b4be048",
        "type": "BRANCH",
      }
    `)
  })
  ;(0, vitest_1.it)('test if date is correct for tag', async () => {
    ;(0, vitest_1.expect)(
      await (0, github_1.getGithubReferenceData)({
        gitHubUrl: GITHUB_URL,
        ref: EXISTING_TAG,
      })
    ).toMatchInlineSnapshot(`
      {
        "date": 2022-06-14T19:51:27.000Z,
        "sha": "8cab1b4d64ca7f52e5e1b45c4e6a6a99cc1ed591",
        "type": "TAG",
      }
    `)
  })
  ;(0, vitest_1.it)('test we get an error for incorrect tag', async () => {
    await (0, vitest_1.expect)(
      (0, github_1.getGithubReferenceData)({
        gitHubUrl: GITHUB_URL,
        ref: NON_EXISTING_BRANCH,
      })
    ).rejects.toThrow()
  })
})
;(0, vitest_1.describe)('parsing github url', () => {
  ;(0, vitest_1.it)('should parse the url', () => {
    ;(0, vitest_1.expect)((0, github_1.parseOwnerAndRepo)(GITHUB_URL))
      .toMatchInlineSnapshot(`
      {
        "owner": "facebook",
        "repo": "react",
      }
    `)
  })
  ;(0, vitest_1.it)('should work with trailing slash', () => {
    ;(0, vitest_1.expect)((0, github_1.parseOwnerAndRepo)(`${GITHUB_URL}/`))
      .toMatchInlineSnapshot(`
      {
        "owner": "facebook",
        "repo": "react",
      }
    `)
  })
  ;(0, vitest_1.it)('fail if the url is invalid', () => {
    ;(0, vitest_1.expect)(() =>
      (0, github_1.parseOwnerAndRepo)(INVALID_URL)
    ).toThrow()
  })
})
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0aHViLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZmVhdHVyZXMvYW5hbHlzaXMvc2NtL19fdGVzdHNfXy9naXRodWIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUE2QztBQUU3QyxzQ0FJa0I7QUFFbEIsTUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFBO0FBQ3hCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQTtBQUNwQixNQUFNLFVBQVUsR0FBRyxzQkFBc0IsS0FBSyxJQUFJLElBQUksRUFBRSxDQUFBO0FBQ3hELE1BQU0sdUJBQXVCLEdBQUcsdUNBQXVDLENBQUE7QUFDdkUsTUFBTSxXQUFXLEdBQUcsOEJBQThCLENBQUE7QUFDbEQsTUFBTSxlQUFlLEdBQUcsMENBQTBDLENBQUE7QUFDbEUsTUFBTSxlQUFlLEdBQUcsU0FBUyxDQUFBO0FBQ2pDLE1BQU0sbUJBQW1CLEdBQUcscUJBQXFCLENBQUE7QUFDakQsTUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFBO0FBRTlCLElBQUEsaUJBQVEsRUFBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDaEMsSUFBQSxXQUFFLEVBQUMsd0JBQXdCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDdEMsTUFBTSxJQUFBLGVBQU0sRUFBQyxHQUFHLEVBQUUsQ0FDaEIsSUFBQSxtQ0FBMEIsRUFBQyx1QkFBdUIsQ0FBQyxDQUNwRCxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtJQUNyQixDQUFDLENBQUMsQ0FBQTtJQUNGLElBQUEsV0FBRSxFQUFDLG9CQUFvQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ2xDLElBQUEsZUFBTSxFQUFDLE1BQU0sSUFBQSxtQ0FBMEIsRUFBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUN0RSxDQUFDLENBQUMsQ0FBQTtJQUNGLElBQUEsV0FBRSxFQUFDLG9DQUFvQyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ2xELElBQUEsZUFBTSxFQUNKLE1BQU0sSUFBQSwrQkFBc0IsRUFBQztZQUMzQixTQUFTLEVBQUUsVUFBVTtZQUNyQixHQUFHLEVBQUUsZUFBZTtTQUNyQixDQUFDLENBQ0gsQ0FBQyxxQkFBcUIsQ0FBQzs7Ozs7O0tBTXZCLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0YsSUFBQSxXQUFFLEVBQUMsb0NBQW9DLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDbEQsSUFBQSxlQUFNLEVBQ0osTUFBTSxJQUFBLCtCQUFzQixFQUFDO1lBQzNCLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLEdBQUcsRUFBRSxlQUFlO1NBQ3JCLENBQUMsQ0FDSCxDQUFDLHFCQUFxQixDQUFDOzs7Ozs7S0FNdkIsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFDRixJQUFBLFdBQUUsRUFBQyxpQ0FBaUMsRUFBRSxLQUFLLElBQUksRUFBRTtRQUMvQyxJQUFBLGVBQU0sRUFDSixNQUFNLElBQUEsK0JBQXNCLEVBQUMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUMzRSxDQUFDLHFCQUFxQixDQUFDOzs7Ozs7S0FNdkIsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFDRixJQUFBLFdBQUUsRUFBQyx3Q0FBd0MsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN0RCxNQUFNLElBQUEsZUFBTSxFQUNWLElBQUEsK0JBQXNCLEVBQUM7WUFDckIsU0FBUyxFQUFFLFVBQVU7WUFDckIsR0FBRyxFQUFFLG1CQUFtQjtTQUN6QixDQUFDLENBQ0gsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7SUFDckIsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQTtBQUVGLElBQUEsaUJBQVEsRUFBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7SUFDbEMsSUFBQSxXQUFFLEVBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO1FBQzlCLElBQUEsZUFBTSxFQUFDLElBQUEsMEJBQWlCLEVBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQzs7Ozs7S0FLM0QsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFDRixJQUFBLFdBQUUsRUFBQyxpQ0FBaUMsRUFBRSxHQUFHLEVBQUU7UUFDekMsSUFBQSxlQUFNLEVBQUMsSUFBQSwwQkFBaUIsRUFBQyxHQUFHLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQzs7Ozs7S0FLakUsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFDRixJQUFBLFdBQUUsRUFBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7UUFDcEMsSUFBQSxlQUFNLEVBQUMsR0FBRyxFQUFFLENBQUMsSUFBQSwwQkFBaUIsRUFBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBO0lBQ3hELENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZXNjcmliZSwgZXhwZWN0LCBpdCB9IGZyb20gJ3ZpdGVzdCdcblxuaW1wb3J0IHtcbiAgZ2V0R2l0aHViUmVmZXJlbmNlRGF0YSxcbiAgZ2V0R2l0aHViUmVwb0RlZmF1bHRCcmFuY2gsXG4gIHBhcnNlT3duZXJBbmRSZXBvLFxufSBmcm9tICcuLi9naXRodWInXG5cbmNvbnN0IE9XTkVSID0gJ2ZhY2Vib29rJ1xuY29uc3QgUkVQTyA9ICdyZWFjdCdcbmNvbnN0IEdJVEhVQl9VUkwgPSBgaHR0cHM6Ly9naXRodWIuY29tLyR7T1dORVJ9LyR7UkVQT31gXG5jb25zdCBOT05fRVhJU1RJTkdfR0lUSFVCX1VSTCA9ICdodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QxMTExJ1xuY29uc3QgSU5WQUxJRF9VUkwgPSAnaHR0cHM6Ly9pbnZhbGlkLmNvbS9mYWNlYm9vaydcbmNvbnN0IEVYSVNUSU5HX0NPTU1JVCA9ICdjNzk2N2IxOTRiNDFjYjE2OTA3ZWVkNzE4Yjc4ZDg5MTIwMDg5ZjZhJ1xuY29uc3QgRVhJU1RJTkdfQlJBTkNIID0gJ3BvcnRhbHMnXG5jb25zdCBOT05fRVhJU1RJTkdfQlJBTkNIID0gJ25vbi1leGlzdGluZy1icmFuY2gnXG5jb25zdCBFWElTVElOR19UQUcgPSAndjE4LjIuMCdcblxuZGVzY3JpYmUoJ2dpdGh1YiByZWZlcmVuY2UnLCAoKSA9PiB7XG4gIGl0KCd0ZXN0IG5vbiBleGlzdGluZyByZXBvJywgYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IGV4cGVjdCgoKSA9PlxuICAgICAgZ2V0R2l0aHViUmVwb0RlZmF1bHRCcmFuY2goTk9OX0VYSVNUSU5HX0dJVEhVQl9VUkwpXG4gICAgKS5yZWplY3RzLnRvVGhyb3coKVxuICB9KVxuICBpdCgndGVzdCBleGlzdGluZyByZXBvJywgYXN5bmMgKCkgPT4ge1xuICAgIGV4cGVjdChhd2FpdCBnZXRHaXRodWJSZXBvRGVmYXVsdEJyYW5jaChHSVRIVUJfVVJMKSkudG9FcXVhbCgnbWFpbicpXG4gIH0pXG4gIGl0KCd0ZXN0IGlmIGRhdGUgaXMgY29ycmVjdCBmb3IgY29tbWl0JywgYXN5bmMgKCkgPT4ge1xuICAgIGV4cGVjdChcbiAgICAgIGF3YWl0IGdldEdpdGh1YlJlZmVyZW5jZURhdGEoe1xuICAgICAgICBnaXRIdWJVcmw6IEdJVEhVQl9VUkwsXG4gICAgICAgIHJlZjogRVhJU1RJTkdfQ09NTUlULFxuICAgICAgfSlcbiAgICApLnRvTWF0Y2hJbmxpbmVTbmFwc2hvdChgXG4gICAgICB7XG4gICAgICAgIFwiZGF0ZVwiOiAyMDIzLTAyLTIwVDIxOjE2OjIzLjAwMFosXG4gICAgICAgIFwic2hhXCI6IFwiYzc5NjdiMTk0YjQxY2IxNjkwN2VlZDcxOGI3OGQ4OTEyMDA4OWY2YVwiLFxuICAgICAgICBcInR5cGVcIjogXCJDT01NSVRcIixcbiAgICAgIH1cbiAgICBgKVxuICB9KVxuICBpdCgndGVzdCBpZiBkYXRlIGlzIGNvcnJlY3QgZm9yIGJyYW5jaCcsIGFzeW5jICgpID0+IHtcbiAgICBleHBlY3QoXG4gICAgICBhd2FpdCBnZXRHaXRodWJSZWZlcmVuY2VEYXRhKHtcbiAgICAgICAgZ2l0SHViVXJsOiBHSVRIVUJfVVJMLFxuICAgICAgICByZWY6IEVYSVNUSU5HX0JSQU5DSCxcbiAgICAgIH0pXG4gICAgKS50b01hdGNoSW5saW5lU25hcHNob3QoYFxuICAgICAge1xuICAgICAgICBcImRhdGVcIjogMjAyMC0wMi0wNVQwMDowMDo1OS4wMDBaLFxuICAgICAgICBcInNoYVwiOiBcIjYyOGY2ZjUwYjUxNDUyOTEwMWExNDIyNDI4NDY5ODVmN2I0YmUwNDhcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwiQlJBTkNIXCIsXG4gICAgICB9XG4gICAgYClcbiAgfSlcbiAgaXQoJ3Rlc3QgaWYgZGF0ZSBpcyBjb3JyZWN0IGZvciB0YWcnLCBhc3luYyAoKSA9PiB7XG4gICAgZXhwZWN0KFxuICAgICAgYXdhaXQgZ2V0R2l0aHViUmVmZXJlbmNlRGF0YSh7IGdpdEh1YlVybDogR0lUSFVCX1VSTCwgcmVmOiBFWElTVElOR19UQUcgfSlcbiAgICApLnRvTWF0Y2hJbmxpbmVTbmFwc2hvdChgXG4gICAgICB7XG4gICAgICAgIFwiZGF0ZVwiOiAyMDIyLTA2LTE0VDE5OjUxOjI3LjAwMFosXG4gICAgICAgIFwic2hhXCI6IFwiOGNhYjFiNGQ2NGNhN2Y1MmU1ZTFiNDVjNGU2YTZhOTljYzFlZDU5MVwiLFxuICAgICAgICBcInR5cGVcIjogXCJUQUdcIixcbiAgICAgIH1cbiAgICBgKVxuICB9KVxuICBpdCgndGVzdCB3ZSBnZXQgYW4gZXJyb3IgZm9yIGluY29ycmVjdCB0YWcnLCBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgZXhwZWN0KFxuICAgICAgZ2V0R2l0aHViUmVmZXJlbmNlRGF0YSh7XG4gICAgICAgIGdpdEh1YlVybDogR0lUSFVCX1VSTCxcbiAgICAgICAgcmVmOiBOT05fRVhJU1RJTkdfQlJBTkNILFxuICAgICAgfSlcbiAgICApLnJlamVjdHMudG9UaHJvdygpXG4gIH0pXG59KVxuXG5kZXNjcmliZSgncGFyc2luZyBnaXRodWIgdXJsJywgKCkgPT4ge1xuICBpdCgnc2hvdWxkIHBhcnNlIHRoZSB1cmwnLCAoKSA9PiB7XG4gICAgZXhwZWN0KHBhcnNlT3duZXJBbmRSZXBvKEdJVEhVQl9VUkwpKS50b01hdGNoSW5saW5lU25hcHNob3QoYFxuICAgICAge1xuICAgICAgICBcIm93bmVyXCI6IFwiZmFjZWJvb2tcIixcbiAgICAgICAgXCJyZXBvXCI6IFwicmVhY3RcIixcbiAgICAgIH1cbiAgICBgKVxuICB9KVxuICBpdCgnc2hvdWxkIHdvcmsgd2l0aCB0cmFpbGluZyBzbGFzaCcsICgpID0+IHtcbiAgICBleHBlY3QocGFyc2VPd25lckFuZFJlcG8oYCR7R0lUSFVCX1VSTH0vYCkpLnRvTWF0Y2hJbmxpbmVTbmFwc2hvdChgXG4gICAgICB7XG4gICAgICAgIFwib3duZXJcIjogXCJmYWNlYm9va1wiLFxuICAgICAgICBcInJlcG9cIjogXCJyZWFjdFwiLFxuICAgICAgfVxuICAgIGApXG4gIH0pXG4gIGl0KCdmYWlsIGlmIHRoZSB1cmwgaXMgaW52YWxpZCcsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gcGFyc2VPd25lckFuZFJlcG8oSU5WQUxJRF9VUkwpKS50b1Rocm93KClcbiAgfSlcbn0pXG4iXX0=
