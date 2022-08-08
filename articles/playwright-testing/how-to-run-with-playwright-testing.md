---
title: Run Playwright tests in the cloud
titleSuffix: Microsoft Playwright Testing
description: Learn how to run an existing Playwright test suite at cloud scale with Microsoft Playwright Testing.
services: playwright-testing
ms.service: playwright-testing
ms.topic: how-to
ms.author: nicktrog
author: ntrogh
ms.date: 07/05/2022
---

# Run existing Playwright tests at cloud scale with Microsoft Playwright Testing Preview

Learn how to run an existing Playwright test suite with Microsoft Playwright Testing Preview. Microsoft Playwright Testing abstracts the infrastructure needed for running Playwright tests at scale and on [multiple operating systems](./how-to-cross-platform-tests.md).

To run your existing Playwright tests and report their results in Microsoft Playwright Testing, install the `@microsoft/playwright-service` npm package and update the Playwright configuration file. You don't have to make changes to your test specifications.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites  

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A Microsoft Playwright Testing account.
- A Playwright test suite.
- [Node](https://nodejs.org/en/download)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

## Install project dependencies

Install the `@microsoft/playwright-service` npm package to connect to Microsoft Playwright Testing.

1. Open your favorite terminal.
1. Go to the directory that contains your Playwright project.
1. Run this command to install the npm package and add it to your `package.json` file:

    ```bash
    npm install @microsoft/playwright-service --save
    ```

## Update Playwright configuration

To run your Playwright tests with Microsoft Playwright Testing, update the `playwright.config.ts` configuration file.

1. Import the objects from the `@microsoft/playwright-service` npm package:

    ```typescript
    import { PlaywrightService, os, os_version } from "@microsoft/playwright-service";
    ```
    
1. Create a `PlaywrightService` object: 

    Specify the `accessKey` property and paste your Microsoft Playwright Testing access token. For more information, see [create an access token](./tutorial-identify-issues-with-end-to-end-web-tests.md#create-an-access-token) . Set the property directly in the configuration or create an environment variable.

    Optionally, set the `dashboard` property to the name of the dashboard in the Microsoft Playwright Testing portal. A dashboard is a logical group under which the test results will appear in the portal.

    ```typescript
    // playwright.config.ts
    var playwrightServiceConfig = new PlaywrightService({
    {
        accessKey: process.env.ACCESS_KEY || "", // Add access Key,
        dashboard:  process.env.GROUP_ID || "Default Group" // Change this to specify a dashboard name of your choice
        }
    })
    ```

1. Configure the `connectOptions` property of the Playwright configuration object to run the tests in the cloud:

    Add the following line just before the `export default config;` line in the configuration file.

    ```typescript
    // playwright.config.ts
    const config: PlaywrightTestConfig = {
        ...
    }

    config.use.connectOptions = playwrightServiceConfig.connectOptions();
    ```

    By default, Microsoft Playwright Testing runs your tests on Ubuntu. For running on other operating systems, see [running cross-platform tests](./how-to-cross-platform-tests.md).

1. Configure the `reporter` property of the Playwright configuration object to ensure that test results are uploaded in the Microsoft Playwright Testing portal.

    Add the following line just before the `export default config;` line in the configuration file.

    ```typescript
    // playwright.config.ts
    config.reporter = [["list"], ["@microsoft/playwright-service/reporter", PlaywrightServiceConfig.getReporterOptions()]];
    ```

1. Optionally, set the `workers` property to scale out your tests across multiple parallel workers, and speed up your tests:

    ```typescript
    const config: PlaywrightTestConfig = {
        workers: process.env.WORKERS ? +process.env.WORKERS : 10,
        ...
    }
    ```

1. Optionally, configure the `trace`, `screenshot`, and `video` [test options](https://playwright.dev/docs/api/class-testoptions).

    For example, use the following code snippet to keep the test trace file, screenshots, and video recording after a failed test. Microsoft Playwright Testing stores these test artifacts together with the test results. You can use these artifacts for diagnosing test failures.

    ```typescript
    const config: PlaywrightTestConfig = {
        use: {
            trace: 'retain-on-failure',
            video:'retain-on-failure',
            screenshot:'only-on-failure',
          },
        ...
    }
    ```

You can now start your Playwright tests and they'll run in Microsoft Playwright Testing. After the tests finish, you'll get a direct link to the test results in the portal.

```bash
npx playwright test
```

## Next steps

- Learn more about [running cross-platform tests](./how-to-cross-platform-tests.md).
- Learn more about [automating end-to-end tests with GitHub Actions](./tutorial-automate-end-to-end-testing-with-github-actions.md).
- Learn more about [managing workspaces in the Azure portal](./how-to-manage-workspace-in-azure-portal.md).
