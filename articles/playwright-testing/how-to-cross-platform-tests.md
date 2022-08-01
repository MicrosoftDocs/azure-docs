---
title: Run cross-platform tests
titleSuffix: Microsoft Playwright Testing
description: Learn how to run cross-platform tests with Microsoft Playwright Testing.
services: playwright-testing
ms.service: playwright-testing
ms.topic: how-to
ms.author: nicktrog
author: ntrogh
ms.date: 07/01/2022
---

# Run tests in browsers across multiple operating systems with Microsoft Playwright Testing Preview

Microsoft Playwright Testing Preview enables you to run tests against browsers on multiple operating systems. Microsoft Playwright Testing abstracts the infrastructure needed for running Playwright tests at scale.

Extend the [Playwright project](https://playwright.dev/docs/test-advanced#projects) configuration to specify which tests to run, the browser configurations, and the operating systems to run on. You can run all tests on multiple operating systems, or selectively run tests on a specific operating system.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites  

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A Playwright test suite.

## Specify a target operating system

By default, Microsoft Playwright Testing runs tests on the latest Ubuntu version. You can override the operating system for a specific Playwright Project, or specify the default for all tests.

The `connectOptions` function in a project specifies service-related configuration. The `PlaywrightService.connectOptions()` function enables you to specify the target operating system. The function takes two input parameters:

| Parameter | Type | Default | Description |
|-----|-----|-----|-----|
|**os_name**| string | linux | Operating system name. See the list of [supported operating systems](#supported-operating-systems). |
|**os_version**| string | ubuntu-latest | Operating system version name. See the list of [supported operating systems](#supported-operating-systems). |

To specify the operating system for a specific Playwright project, set `connectOptions` within the project. You can define as many projects as you like with different OS-browser combinations.

The following example defines a project that uses the Chrome desktop browser on the latest Windows version:

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

To specify the default operating system for all projects in a Playwright test suite, you can set `connectOptions` for the entire configuration. 

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

In the [Microsoft Playwright Portal](https://dashboard.playwright-ppe.io/playwright-service), you can quickly filter the test results for a specific configuration. The following screenshot shows the test results for tests that were run on Windows:

:::image type="content" source="./media/how-to-cross-platform-tests/playwright-testing-dashboard-filtered-operating-system.png" alt-text="Screenshot that shows the Microsoft Playwright Testing dashboard with the test results filtered for the Windows operating system.":::
 
## Supported operating systems

| Operating System |Version|os_name|os_version| 
|----|-----|----|-----| 
|Windows | windows-11| windows| windows-latest or windows-11|
|Windows | windows-10| windows| windows-10|
|Ubuntu|Ubuntu 20.04 | linux |ubuntu-latest or ubuntu-20.04| 
|Ubuntu|Ubuntu 18.04 | linux |ubuntu-18.04|


## Next steps

- Learn more about [automating end-to-end tests with GitHub Actions](./tutorial-automate-end-to-end-testing-with-github-actions.md).
