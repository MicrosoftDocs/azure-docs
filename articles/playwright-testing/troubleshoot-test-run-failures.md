---
title: Troubleshoot test run issues
description: Learn how to troubleshoot issues when running Playwright tests with Microsoft Playwright Testing Preview.
ms.topic: troubleshooting-general 
ms.date: 10/04/2023
---

# Troubleshoot issues with running tests with Microsoft Playwright Testing preview

This article addresses issues that might arise when you run Playwright tests at scale with Microsoft Playwright Testing Preview.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Tests are failing with a `401 Unauthorized` error

Your access token may be invalid or expired. Make sure you're using the correct access token or [generate a new access token](./how-to-manage-access-tokens.md#generate-a-workspace-access-token).

## Tests run slow

Microsoft Playwright Testing hosts the remote browsers in specific Azure regions. If your client machine or target web application is outside these regions, you might experience increased network latency. Learn how you can [optimize regional latency for your workspace](./how-to-optimize-regional-latency.md).

## Tests seem to hang

Your tests might hang due to a piece of code that's unintentionally paused the test execution. For example, you might have added pause statements while debugging your test.

Search for any instances of `pause()` statements in your code and comment them out.

## Tests are failing because of a timeout

Your tests could be timing out because of the following reasons:

- Your client machine is in a different region than the browsers.

    Connecting to service-hosted browsers introduces network latency. You might need to increase your [timeout settings in the Playwright configuration](https://playwright.dev/docs/test-timeouts). Start with increasing the *test timeout* setting in `playwright.service.config.ts`.

- Trace files cause performance issues (currently a known problem).

    Sending the Playwright trace files from the service to the client machine can create congestion, which can cause tests to fail due to a timeout.You can [disable tracing in the Playwright configuration file](https://playwright.dev/docs/api/class-testoptions#test-options-trace).

## Unable to test web applications hosted behind firewall

Ensure that you set the `exposeNetwork` option in the `playwright.service.config.ts` file to make the network available on the client machine to the cloud browser. Example values for this option are: `<loopback>` for the localhost network, `*` to expose all networks, or the IP address/DNS of the application endpoint.

Learn how more about how to [test locally deployed applications](./how-to-test-local-applications.md).

## The time displayed in the browser is different from my local time

Web applications often display the time based on the user's location. When you run tests with Microsoft Playwright Testing, the client machine and the service browsers may be in different regions.

You can mitigate the issue by [specifying the time zone in the Playwright configuration file](https://playwright.dev/docs/emulation#locale--timezone).

## Test fails with `Path is not available when connecting remotely`

You might encounter the `Path is not available when connecting remotely` error when you run your Playwright tests on remote browsers with Microsoft Playwright Testing. For example, when you're testing the functionality to download a file in your test code.

The cause of this issue is that the `path()` function on the download file instance is not available when run on remote browsers.

To resolve this issue, you should use the `saveAs()` function to save a local copy of the file on your client machine. Learn more about [downloads in the Playwright documentation](https://playwright.dev/docs/downloads).

The following code snippet gives an example of how to use `saveAs()` instead of `path()` for reading the contents of a downloaded file:

```typescript
const downloadPromise = page.waitForEvent('download');
await page.getByText('Download file').click();

const download = await downloadPromise;

// FAILS: download.path() fails when connecting to a remote browser
// const result = fs.readFileSync(await download.path(), 'utf-8');

// FIX: use saveAs() to download the file, when connecting to a remote browser
await download.saveAs('/path/to/save/at/' + download.suggestedFilename());
```

## Related content

- [Manage workspace access](./how-to-manage-workspace-access.md)
- [Optimize regional latency a workspace](./how-to-optimize-regional-latency.md)
