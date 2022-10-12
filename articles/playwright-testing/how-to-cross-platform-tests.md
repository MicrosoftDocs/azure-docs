---
title: Run Playwright tests across operating systems
titleSuffix: Microsoft Playwright Testing
description: Learn how to run Playwright tests across multiple operating systems with Microsoft Playwright Testing.
services: playwright-testing
ms.service: playwright-testing
ms.topic: how-to
ms.author: nicktrog
author: ntrogh
ms.date: 10/12/2022
---

# Run tests across multiple operating systems with Microsoft Playwright Testing Preview

In this article, you'll learn how to run cross-platform Playwright tests with Microsoft Playwright Testing Preview. The service abstracts the complexity and infrastructure for running Playwright tests across multiple operating systems and browsers.

Update the Playwright configuration file to set the target operating system (OS) and browser. You can configure a default operating system, or use [Playwright test projects](https://playwright.dev/docs/test-advanced#projects) to specify multiple configurations.

Learn more about the [operating systems and browsers that Microsoft Playwright Testing supports](./resource-supported-operating-systems-browsers.md).

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites  

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A Playwright test suite. [Get started with Playwright](https://playwright.dev/docs/intro).

## Specify a target operating system

You specify the target operating system for your Playwright tests in the `playwright.config.ts` (or `playwright.config.js`) configuration file.

The `connectOptions` property contains service-related configuration settings, such as the target operating system. You can configure the `connectOptions` setting at two levels: 

- At the test project level, to define one or multiple browser-OS configurations.
- At the `PlaywrightTestConfig` level, to configure a default operating system for all test projects.

Use the `PlaywrightService.connectOptions()` function to configure the target operating system. The function takes two input parameters and returns a `ConnectOptions` object:

| Parameter | Type | Default | Description |
|-----|-----|-----|-----|
| *os*         | string | `linux`         | Operating system name. See the list of [supported operating systems](./resource-supported-operating-systems-browsers.md#supported-browsers). |
| *os_version* | string | `ubuntu-latest` | Operating system version name. See the list of [supported operating systems](./resource-supported-operating-systems-browsers.md#supported-operating-systems). |

> [!NOTE]
>  If you don't specify an operating system, Microsoft Playwright Testing uses the latest Ubuntu version to run your tests.

### Specify the operating system for a test project

To specify the operating system for a Playwright test project, set the `connectOptions` property within the project configuration. You can configure multiple test projects within your Playwright test suite. Each test project might have a different browser-OS configuration.

The test project configuration settings override the global operating system and version settings.

The following code snippet gives an example of a Playwright test project that uses the Chrome desktop browser on the latest Windows version:

```typescript
// playwright.config.ts
import { os, os_version, PlaywrightService } from "@microsoft/playwright-service";
import { devices, PlaywrightTestConfig } from "@playwright/test";

var playwrightServiceConfig = new PlaywrightService({
  accessKey: process.env.ACCESS_KEY, 
  dashboard: process.env.DASHBOARD
});

const config: PlaywrightTestConfig = {
    projects: [
        {
            name: 'chromium-on-windows',
            use: { 
                ...devices['Desktop Chrome'] ,
                connectOptions: playwrightServiceConfig.connectOptions({os: os.WINDOWS, os_version: os_version.WINDOWS_LATEST}),
            }
        }
    ],
    ...
}
```

By default, Playwright runs all tests for each of the test project configurations. To run specific tests with different options, you can configure this in the test project.

The following code snippet shows how to use `testMatch` to run certain tests on Windows and others on Ubuntu:

```typescript
const config: PlaywrightTestConfig = {
    projects: [
        {
            name: 'chromium-on-linux',
            testMatch: /.*linux.spec.ts/,
            use: { 
                ...devices['Desktop Chrome'] ,
                connectOptions: playwrightServiceConfig.connectOptions({os: os.LINUX, os_version: os_version.UBUNTU_LATEST}),
            }
        },
        {
            name: 'chromium-on-windows',
            testMatch: /.*windows.spec.ts/,
            use: { 
                ...devices['Desktop Chrome'] ,
                connectOptions: playwrightServiceConfig.connectOptions({os: os.WINDOWS, os_version: os_version.WINDOWS_LATEST}),
            }
        }
    ],
    ...
}
```

### Specify the default operating system

To specify the default operating system across all test projects in a Playwright test suite, you can set the `connectOptions` property at the `PlaywrightTestConfig` level.

For example, to run all tests across all browser configurations on Ubuntu version 18.04:

```typescript
// playwright.config.ts
import { os, os_version, PlaywrightService } from "@microsoft/playwright-service";
import { devices, PlaywrightTestConfig } from "@playwright/test";

var playwrightServiceConfig = new PlaywrightService({
  accessKey: process.env.ACCESS_KEY, 
  dashboard: process.env.DASHBOARD
});

const config: PlaywrightTestConfig = {
    use: {
        connectOptions = playwrightServiceConfig.connectOptions({os: os.LINUX, os_version: os_version.UBUNTU_18_04});
    },

    projects: [
        {
            name: 'chromium',
            use: { 
                ...devices['Desktop Chrome'] ,
            }
        },
        {
          name: 'firefox',
          use: {
            ...devices['Desktop Firefox'],
          },
        }
    ],
    ...
}
```

## View test results

In the [Playwright dashboard](https://17157345.playwright-int.io/), you can filter the test results by using the search interface. The search functionality also takes the test project name into account and enables you to filter for specific configurations.

The following screenshot shows an example of how to filter for tests that ran on Windows:

:::image type="content" source="./media/how-to-cross-platform-tests/playwright-testing-dashboard-filtered-operating-system.png" alt-text="Screenshot that shows the Microsoft Playwright Testing dashboard with the test results filtered for the Windows operating system.":::

## Next steps

- Learn more about [running existing tests with Microsoft Playwright Testing](./how-to-run-with-playwright-testing.md).
- Learn more about [automating end-to-end tests with GitHub Actions](./tutorial-automate-end-to-end-testing-with-github-actions.md).
- Learn more about [testing privately hosted application endpoints](./how-to-test-private-endpoints.md).
