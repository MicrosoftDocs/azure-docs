---
title: 'Quickstart: Generate rich reports for Playwright tests'
description: 'This quickstart shows how to troubleshoot your test runs using Microsoft Playwright Testing Preview.'
ms.topic: quickstart
ms.date: 09/23/2024
ms.custom: playwright-testing-preview, ignite-2024
zone_pivot_group_filename: playwright-testing/zone-pivots-groups.json
zone_pivot_groups: microsoft-playwright-testing
---

# Quickstart: Troubleshoot tests with Microsoft Playwright Testing Preview

In this quickstart, you learn how to troubleshoot your Playwright tests easily using reports and artifacts published on Microsoft Playwright Testing Preview. Additionally, this guide demonstrates how to utilize the reporting feature, regardless of whether you're running tests on the cloud-hosted browsers provided by the service.

After you complete this quickstart, you'll have a Microsoft Playwright Testing workspace to view test results and artifacts in the service portal.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Background

Microsoft Playwright Testing service enables you to:

- Accelerate build pipelines by running tests in parallel using cloud-hosted browsers.
- Simplify troubleshooting by publishing test results and artifacts to the service, making them accessible through the service portal.

These two features of the service can be used independently or together, and each has its own [pricing plan](https://aka.ms/mpt/pricing). You have the flexibility to:

- Expedite test runs and streamline troubleshooting by using both features: running tests in cloud-hosted browsers and publishing results to the service.
- Run tests only in cloud-hosted browsers to finish test runs faster.
- Publish test results to the service while continuing to run tests locally for efficient troubleshooting.

> [!NOTE]
> This article focuses on how you can publish test results to the service without using cloud-hosted browsers. If you want to learn how to also accelerate your test runs, see [quickstart: run Playwright tests at scale](./quickstart-run-end-to-end-tests.md)

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* Your Azure account needs the [Owner](/azure/role-based-access-control/built-in-roles#owner), [Contributor](/azure/role-based-access-control/built-in-roles#contributor), or one of the [classic administrator roles](/azure/role-based-access-control/rbac-and-directory-admin-roles#classic-subscription-administrator-roles).
* A Playwright project. If you don't have project, create one by using the [Playwright getting started documentation](https://playwright.dev/docs/intro) or use our [Microsoft Playwright Testing sample project](https://github.com/microsoft/playwright-testing-service/tree/main/samples/get-started).
* Azure CLI. If you don't have Azure CLI, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Create a workspace

To get started with publishing test results on Playwright Testing service, first create a Microsoft Playwright Testing workspace in the Playwright portal.

[!INCLUDE [Create workspace in Playwright portal](./includes/include-playwright-portal-create-workspace.md)]

When the workspace creation finishes, you're redirected to the setup guide.

## Install Microsoft Playwright Testing package 
::: zone pivot="playwright-test-runner"

To use the service, install the Microsoft Playwright Testing package. 

```npm
npm init @azure/microsoft-playwright-testing@latest
```
> [!NOTE]
> Make sure your project uses `@playwright/test` version 1.47 or above.

This command generates `playwright.service.config.ts` file which serves to:

- Direct and authenticate your Playwright client to the Microsoft Playwright Testing service.
- Adds a reporter to publish test results and artifacts.

If you already have this file, the prompt asks you to override it. 

To use only reporting feature for the test run, disable cloud-hosted browsers by setting `useCloudHostedBrowsers` as false. 

```typescript
export default defineConfig(
  config,
  getServiceConfig(config, {
    timeout: 30000,
    os: ServiceOS.LINUX,
	useCloudHostedBrowsers: false // Do not use cloud hosted browsers
  }),
  {
    reporter: [['list'], ['@azure/microsoft-playwright-testing/reporter']], // Reporter for Microsoft Playwright Testing service
  }
);
```
Setting the value as `false` ensures that cloud-hosted browsers aren't used to run the tests. The tests run on your local machine but the results and artifacts are published on the service. 

::: zone-end

::: zone pivot="nunit-test-runner"

To use the service, install Microsoft Playwright Testing package. 

```PowerShell
dotnet add package Azure.Developer.MicrosoftPlaywrightTesting.NUnit --prerelease
```

> [!NOTE]
> Make sure your project uses `Microsoft.Playwright.NUnit` version 1.47 or above.

To use only reporting feature, update the following in the `.runsettings` file of your project:
1. Disable cloud-hosted browsers by setting `useCloudHostedBrowsers` as false. 
2. Add Microsoft Playwright Testing logger in `Loggers' section. 

```xml
﻿<?xml version="1.0" encoding="utf-8"?>
<RunSettings>
    <TestRunParameters>        
        <!--Select if you want to use cloud-hosted browsers to run your Playwright tests.-->
        <Parameter name="UseCloudHostedBrowsers" value="true" />
        <!--Select the authentication method you want to use with Entra-->
    </TestRunParameters> 
 .
 .
 .
    <LoggerRunSettings>
        <Loggers>
            <!--Microsoft Playwright Testing service logger for reporting -->
            <Logger friendlyName="microsoft-playwright-testing" enabled="True" />
            <!--could enable any logger additionally -->
            <Logger friendlyName="trx" enabled="false" />
        </Loggers>
    </LoggerRunSettings>
</RunSettings>

```
::: zone-end

> [!TIP]
> If you wish to accelerate your test run using cloud-hosted browser, you can set `useCloudHostedBrowsers` as true. This will run your tests on the service managed browsers.

## Configure the service region endpoint

In your setup, you have to provide the region-specific service endpoint. The endpoint depends on the Azure region you selected when creating the workspace.

To get the service endpoint URL, perform the following steps:

1. In **Add region endpoint in your setup**, copy the region endpoint for your workspace.

    The endpoint URL matches the Azure region that you selected when creating the workspace. Make sure this URL is available in `PLAYWRIGHT_SERVICE_URL` environment variable.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/playwright-testing-region-endpoint.png" alt-text="Screenshot that shows how to copy the workspace region endpoint in the Playwright Testing portal." lightbox="./media/quickstart-run-end-to-end-tests/playwright-testing-region-endpoint.png":::

::: zone pivot="playwright-test-runner"

## Set up your environment

To set up your environment, you have to configure the `PLAYWRIGHT_SERVICE_URL` environment variable with the value you obtained in the previous steps.

We recommend that you use the `dotenv` module to manage your environment. With `dotenv`, you define your environment variables in the `.env` file.

1. Add the `dotenv` module to your project:

    ```shell
    npm i --save-dev dotenv
    ```

1. Create a `.env` file alongside the `playwright.config.ts` file in your Playwright project:

    ```
    PLAYWRIGHT_SERVICE_URL={MY-REGION-ENDPOINT}
    ```

    Make sure to replace the `{MY-REGION-ENDPOINT}` text placeholder with the value you copied earlier.

::: zone-end

::: zone pivot="nunit-test-runner"
## Set up service configuration 

Create a file `PlaywrightServiceSetup.cs` in the root directory with the following content. 

```csharp
using Azure.Developer.MicrosoftPlaywrightTesting.NUnit;

namespace PlaywrightTests; // Remember to change this as per your project namespace

[SetUpFixture]
public class PlaywrightServiceSetup : PlaywrightServiceNUnit {};
```

> [!NOTE]
> Make sure your project uses `Microsoft.Playwright.NUnit` version 1.47 or above.

::: zone-end

## Set up authentication

To publish test results and artifacts to your Microsoft Playwright Testing workspace, you need to authenticate the Playwright client where you're running the tests with the service. The client could be your local dev machine or CI machine. 

The service offers two authentication methods: Microsoft Entra ID and Access Tokens.

Microsoft Entra ID uses your Azure credentials, requiring a sign-in to your Azure account for secure access. Alternatively, you can generate an access token from your Playwright workspace and use it in your setup.

##### Set up authentication using Microsoft Entra ID 

Microsoft Entra ID is the default and recommended authentication for the service. From your local dev machine, you can use [Azure CLI](/cli/azure/install-azure-cli) to sign-in

```CLI
az login
```
> [!NOTE]
> If you're a part of multiple Microsoft Entra tenants, make sure you sign in to the tenant where your workspace belongs. You can get the tenant ID from Azure portal. For more information, see [Find your Microsoft Entra Tenant](/azure/azure-portal/get-subscription-tenant-id#find-your-microsoft-entra-tenant). Once you get the ID, sign-in using the command `az login --tenant <TenantID>`

##### Set up authentication using access tokens

You can generate an access token from your Playwright Testing workspace and use it in your setup. However, we strongly recommend Microsoft Entra ID for authentication due to its enhanced security. Access tokens, while convenient, function like long-lived passwords and are more susceptible to being compromised.

1. Authentication using access tokens is disabled by default. To use, [Enable access-token based authentication](./how-to-manage-authentication.md#enable-authentication-using-access-tokens)

2. [Set up authentication using access tokens](./how-to-manage-authentication.md#set-up-authentication-using-access-tokens)

> [!CAUTION]
> We strongly recommend using Microsoft Entra ID for authentication to the service. If you are using access tokens, see [How to Manage Access Tokens](./how-to-manage-access-tokens.md)

## Enable artifacts in your Playwright setup 
::: zone pivot="playwright-test-runner"

In the `playwright.config.ts` file of your project, make sure you are collecting all the required artifacts.
```typescript
  use: {
    trace: 'on-first-retry',
    video:'retain-on-failure',
    screenshot:'on'
  }
```
::: zone-end

::: zone pivot="nunit-test-runner"

Enable artifacts such as screenshot, videos and traces to be captured by Playwright. 
- For screenshots, see [capture screenshots](https://playwright.dev/dotnet/docs/screenshots#introduction)
- For videos, see [record videos for your tests](https://playwright.dev/dotnet/docs/videos#introduction)
- For traces, see [recording a trace](https://playwright.dev/dotnet/docs/trace-viewer-intro#recording-a-trace)

Once you collect these artifacts, attach them to the `TestContext` to ensure they are available in your test reports. For more information, see our [sample project for NUnit](https://aka.ms/mpt/nunit-sample)

::: zone-end

## Run your tests and publish results on Microsoft Playwright Testing

::: zone pivot="playwright-test-runner"
You've now prepared the configuration for publishing test results and artifacts with Microsoft Playwright Testing. Run tests using the newly created `playwright.service.config.ts` file and publish test results and artifacts to the service.

 ```bash
    npx playwright test --config=playwright.service.config.ts
```
> [!NOTE]
> For the Reporting feature of Microsoft Playwright Testing, you get charged based on the number test results published. If you're a first-time user or [getting started with a free trial](./how-to-try-playwright-testing-free.md), you might start with publishing single test result instead of your full test suite to avoid exhausting your free trial limits.

After the test completes, you can view the test status in the terminal.

```output
Running 6 test using 2 worker
    5 passed, 1 failed (20.2s)
    
Test report: https://playwright.microsoft.com/workspaces/<workspace-id>/runs/<run-id>
```
::: zone-end

::: zone pivot="nunit-test-runner"

You've now prepared the configuration for publishing test results and artifacts with Microsoft Playwright Testing. Run tests using the `.runsettings` file and publish test results and artifacts to the service.

```bash
dotnet test --settings:.runsettings
```

The settings for your test run are defined in `.runsettings` file. For more information, see [how to use service package options](./how-to-use-service-config-file.md#config-options-in-runsettings-file)

> [!NOTE]
> For the Reporting feature of Microsoft Playwright Testing, you get charged based on the number test results published. If you're a first-time user or [getting started with a free trial](./how-to-try-playwright-testing-free.md), you might start with publishing single test result instead of your full test suite to avoid exhausting your free trial limits.

After the test run completes, you can view the test status in the terminal.

```output
Starting test execution, please wait...

Initializing reporting for this test run. You can view the results at: https://playwright.microsoft.com/workspaces/<workspace-id>/runs/<run-id>

A total of 100 test files matched the specified pattern.

Test Report: https://playwright.microsoft.com/workspaces/<workspace-id>/runs/<run-id>

Passed!  - Failed:     0, Passed:     100, Skipped:     0, Total:     100, Duration: 10 m - PlaywrightTestsNUnit.dll (net7.0)

Workload updates are available. Run `dotnet workload list` for more information.
```
::: zone-end

> [!CAUTION]
> Depending on the size of your test suite, you might incur additional charges for the test results beyond your allotted free test results.

## View test runs and results in the Playwright portal

You can now troubleshoot the failed test cases in the Playwright portal.

::: zone pivot="playwright-test-runner"

[!INCLUDE [View test runs and results in the Playwright portal](./includes/include-playwright-portal-view-test-results.md)]

::: zone-end

::: zone pivot="nunit-test-runner"

[!INCLUDE [View test runs and results in the Playwright portal](./includes/include-playwright-portal-view-test-results-nunit.md)]

::: zone-end

> [!TIP]
> You can also use Microsoft Playwright Testing service to run tests in parallel using cloud-hosted browsers. Both Reporting and cloud-hosted browsers are independent features and are billed separately. You can use either of these or both. For details, see [How to use service features](./how-to-use-service-features.md)

> [!NOTE]
> The test results and artifacts that you publish are retained on the service for 90 days. After that, they are automatically deleted.  


## Next step

You've successfully created a Microsoft Playwright Testing workspace in the Playwright portal and run your Playwright tests on cloud browsers.

Advance to the next quickstart to set up continuous end-to-end testing by running your Playwright tests in your CI/CD workflow.

> [!div class="nextstepaction"]
> [Set up continuous end-to-end testing in CI/CD](./quickstart-automate-end-to-end-testing.md)
