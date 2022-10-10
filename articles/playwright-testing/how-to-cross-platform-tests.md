---
title: Run Playwright tests on multiple OSes 
titleSuffix: Microsoft Playwright Testing
description: Learn how to run Playwright tests across multiple operating systems and browsers with Microsoft Playwright Testing.
services: playwright-testing
ms.service: playwright-testing
ms.topic: how-to
ms.author: nicktrog
author: ntrogh
ms.date: 10/10/2022
---

# Run tests across multiple operating systems and browsers with Microsoft Playwright Testing Preview

In this article, you'll learn how to configure your Playwright tests to run cross platform with Microsoft Playwright Testing Preview. With Microsoft Playwright Testing you can run your Playwright tests on hosted browsers across multiple operating systems, regardless of your local developer environment.

You can specify the target operating system and browser configuration for your existing Playwright tests by updating the Playwright configuration file. Microsoft Playwright Testing enables you to configure a default OS for all your tests, or to define multiple OS-browsers test project configurations.

Learn more about the [operating systems and browsers that Microsoft Playwright Testing supports](./resource-supported-operating-systems-browsers.md).

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites  

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A Playwright test suite.

## Specify a target operating system

You specify the target operating system for your Playwright tests in the `playwright.config.ts` (or `playwright.config.js`) file. If you don't specify an OS, Microsoft Playwright Testing by default uses the latest Ubuntu version to run your tests.

The `connectOptions` property contains the service-related configuration, such as the target OS. You can specify the `connectOptions` at the top-level `PlaywrightTestConfig` level, or specify it for a [test project](https://playwright.dev/docs/test-advanced#projects).

Use the `PlaywrightService.connectOptions()` function to configure the target OS. The function takes two input parameters:

| Parameter | Type | Default | Description |
|-----|-----|-----|-----|
| *os*         | string | linux         | Operating system name. See the list of [supported operating systems](./resource-supported-operating-systems-browsers.md#supported-browsers). |
| *os_version* | string | ubuntu-latest | Operating system version name. See the list of [supported operating systems](./resource-supported-operating-systems-browsers.md#supported-operating-systems). |

### Specify the OS for a test project 

To specify the operating system for a specific Playwright test project, set the `connectOptions` property within the project configuration. Playwright will run your tests for each of the test projects you define. You can use the `project` [Playwright command-line parameter](https://playwright.dev/docs/test-cli) to run a specific test project.

The following example defines a test project that uses the Chrome desktop browser on the latest Windows version:

```typescript
// playwright.config.ts
import { os, os_version, PlaywrightService } from "@microsoft/playwright-service";
import { devices, PlaywrightTestConfig } from "@playwright/test";

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

### Specify the default OS

To specify the default operating system for all test projects in a Playwright test suite, you can set the `connectOptions` property at the test configuration level.

For example, to run all tests across all browser configurations on Ubuntu version 18.04:

```typescript
// playwright.config.ts
import { os, os_version, PlaywrightService } from "@microsoft/playwright-service";
import { devices, PlaywrightTestConfig } from "@playwright/test";

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

In the [Playwright dashboard](https://dashboard.playwright-ppe.io/playwright-service), you can quickly filter the test results for a specific configuration by using the search interface. 

The following screenshot shows how to filter for tests that were run on Windows:

:::image type="content" source="./media/how-to-cross-platform-tests/playwright-testing-dashboard-filtered-operating-system.png" alt-text="Screenshot that shows the Microsoft Playwright Testing dashboard with the test results filtered for the Windows operating system.":::

## Next steps

- Learn more about [running existing tests with Microsoft Playwright Testing](./how-to-run-with-playwright-testing.md).
- Learn more about [automating end-to-end tests with GitHub Actions](./tutorial-automate-end-to-end-testing-with-github-actions.md).
- Learn more about [testing privately hosted application endpoints](./how-to-test-private-endpoints.md).
