---
title: 'Quickstart: Perform advanced diagnostics with Playwright Workspaces reporting'
titleSuffix: Playwright Workspaces
description: 'Perform advanced diagnostics on your Playwright tests by saving your test reports to Azure storage and viewing them on Azure portal using the Playwright Workspaces reporter.'
ms.topic: quickstart
ms.date: 01/06/2026
ms.service: azure-app-testing
ms.subservice: playwright-workspaces
author: Abhinav-Premsekhar
ms.author: apremsekhar
ms.custom: playwright-workspaces
---

# Quickstart: Perform advanced diagnostics with Playwright Workspaces reporting

In this quickstart, you learn how to debug your Playwright tests by using the reporting feature in Playwright Workspaces. Perform advanced diagnostics on your Playwright tests by saving your test reports to Azure storage and viewing them in Azure portal by using the Playwright Workspaces reporter.

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.
* Your Azure account needs the [Owner](/azure/role-based-access-control/built-in-roles#owner), [Contributor](/azure/role-based-access-control/built-in-roles#contributor), or one of the [classic administrator roles](/azure/role-based-access-control/rbac-and-directory-admin-roles#classic-subscription-administrator-roles).
* A Playwright project that uses Playwright runner and JavaScript SDK (NUnit and other runners aren't currently supported). If you don't have a project, create one by using the [Playwright getting started documentation](https://playwright.dev/docs/intro) or use the [Playwright Workspaces sample project](https://github.com/Azure/playwright-workspaces/blob/main/samples/playwright-tests).
* The Playwright project must use Playwright package (@plawright/test) version 1.57 or later.
* Azure CLI. If you don't have Azure CLI, see [Install Azure CLI](/cli/azure/install-azure-cli).
* The Playwright Workspace must use Microsoft Entra ID authentication. Authentication using an access token isn't supported for reporting.

## Enable reporting and link a storage account to a workspace

To get started with Playwright Workspaces reporting, the first step is to enable reporting in your workspace and link a storage account to store your reporting artifacts. You can get started with a new workspace or use your existing workspace.

# [New workspace](#tab/newworkspace)

1. Sign in to the [Azure portal](https://portal.azure.com/) by using the credentials for your Azure subscription.

1. From the portal Home page, search for and select **Azure App Testing**.

    :::image type="content" source="./media/quickstart-advanced-diagnostic-with-playwright-reporting/azure-portal-search.png" alt-text="Screenshot that shows how to open azure app testing." lightbox="./media/quickstart-advanced-diagnostic-with-playwright-reporting/azure-portal-search.png":::

1. On the **Azure App Testing** hub, select **Create** under **Playwright Workspaces**

    :::image type="content" source="./media/quickstart-advanced-diagnostic-with-playwright-reporting/app-testing-hub.png" alt-text="Screenshot that shows azure app testing home page." lightbox="./media/quickstart-advanced-diagnostic-with-playwright-reporting/app-testing-hub.png":::

1. On the **Create a Playwright workspace resource** page, enter the following information:
    
    |Field  |Description  |
    |---------|---------|
    |**Subscription**     | Select the Azure subscription that you want to use for this Playwright workspace. |
    |**Resource group**     | Select an existing resource group. Or select **Create new**, and then enter a unique name for the new resource group.        |
    |**Name**     | Enter a unique name for your workspace.<BR>The name can only consist of alphanumerical characters and hyphens, and have a length between 3 and 24 characters. |
    |**Location**     | Select a geographic location for your workspace. <BR>This location also determines where the test execution results are stored. |
    |**Reporting**     | Toggle is set to Enabled by default to enable users to save and view their test run reports from Playwright Workspace. If you want to turn off reporting, toggle the setting to Disabled. |
    |**Storage account**     | Toggle is set to Enabled by default to enable users to save and view their test run reports from Playwright Workspace. If you want to turn off reporting, toggle the setting to Disabled. |

    > [!NOTE]
    > Playwright Workspaces reporting uses Azure Storage to store your test reports and other artifacts. Storage costs are determined based on your storage account's data-retention settings.

    > [!NOTE]
    > Optionally, you can configure more details on the **Tags** tab. Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups.

1. After you finish configuring the resource, select **Review + Create**.

1. Review the settings you provide, and then select **Create**. It takes a few minutes to create the workspace. Wait for the portal page to display **Your deployment is complete** before moving on.

    :::image type="content" source="./media/how-to-manage-playwright-workspace/create-resource-deployment-complete.png" alt-text="Screenshot that shows the deployment completion information in the Azure portal." lightbox="./media/how-to-manage-playwright-workspace/create-resource-deployment-complete.png":::

# [Existing workspace](#tab/existingworkspace)

1. Sign in to the [Azure portal](https://portal.azure.com/) by using the credentials for your Azure subscription.

1. From the portal Home page, search for and select **Azure App Testing**.

    :::image type="content" source="./media/quickstart-advanced-diagnostic-with-playwright-reporting/azure-portal-search.png" alt-text="Screenshot that shows how to open azure app testing." lightbox="./media/quickstart-advanced-diagnostic-with-playwright-reporting/azure-portal-search.png":::

1. On the **Azure App Testing** hub, select **View resources**.

    :::image type="content" source="./media/quickstart-advanced-diagnostic-with-playwright-reporting/app-testing-hub-view-resources.png" alt-text="Screenshot that shows azure app testing home page." lightbox="./media/quickstart-advanced-diagnostic-with-playwright-reporting/app-testing-hub-view-resources.png":::

1. Search for and open your Playwright workspace.

1. In the left nav, select **Settings -> Storage configuration**.

1. Set the Reporting toggle to **Enabled** and select a storage account to link to your Playwright Workspace.

    :::image type="content" source="./media/quickstart-advanced-diagnostic-with-playwright-reporting/storage-configuration.png" alt-text="Screenshot that shows azure app testing storage configuration page." lightbox="./media/quickstart-advanced-diagnostic-with-playwright-reporting/storage-configuration.png":::

    > [!NOTE]
    > Playwright Workspaces reporting uses Azure Storage to store your test reports and other artifacts. Storage costs are determined based on your storage account's data-retention settings.

1. Select **Save**.

---

## Add Role Based Access Control (RBAC) roles for the linked storage account

1. Open the linked storage account in [Azure portal](https://portal.azure.com/).

1. Go to the **Access Control (IAM)** tab.

    :::image type="content" source="./media/quickstart-advanced-diagnostic-with-playwright-reporting/storage-account-access.png" alt-text="Screenshot that shows storage account home page." lightbox="./media/quickstart-advanced-diagnostic-with-playwright-reporting/storage-account-access.png":::

1. Select **Add role assignment**.

    :::image type="content" source="./media/quickstart-advanced-diagnostic-with-playwright-reporting/storage-account-add-role.png" alt-text="Screenshot that shows storage account add role page." lightbox="./media/quickstart-advanced-diagnostic-with-playwright-reporting/storage-account-add-role.png":::

1. Under **Job function roles**, search for and select **Storage Blob Data Contributor** role and click **Next**.

    :::image type="content" source="./media/quickstart-advanced-diagnostic-with-playwright-reporting/storage-account-blob-contributor.png" alt-text="Screenshot that shows storage account job function role page." lightbox="./media/quickstart-advanced-diagnostic-with-playwright-reporting/storage-account-blob-contributor.png":::

1. Select and add all members who run tests.

    :::image type="content" source="./media/quickstart-advanced-diagnostic-with-playwright-reporting/storage-account-blob-contributor-add-members.png" alt-text="Screenshot that shows storage account job function role add members page." lightbox="./media/quickstart-advanced-diagnostic-with-playwright-reporting/storage-account-blob-contributor-add-members.png":::

1. Click **Review + assign**.

## Install Playwright Workspaces package 

To use Playwright Workspaces, install the Playwright Workspaces package. 

```npm
npm init @azure/playwright@latest
```

This command generates a `playwright.service.config.ts` file, which directs and authenticates Playwright to Playwright Workspaces.

If you already have this file, the package asks you to overwrite it.

## Enable HTML and Playwright Workspaces reporter

To use the Playwright Workspaces reporting feature, enable the html and Playwright Workspaces reporter by adding the following setting in the playwright.service.config.ts file –

```playwright.service.config.ts
reporter: [
    ["html", { open: "never" }], // HTML reporter must come first
    ["@azure/playwright/reporter"], // Azure reporter uploads HTML report
]
```

## Enable artifacts in your Playwright setup

In the playwright.config.ts file of your project, make sure you are collecting all the required artifacts.

```playwright.config.ts
use: 
{
    trace: 'on-first-retry',
    video:'retain-on-failure',
    screenshot:'on'
}
```

## Configure the browser endpoint

In your setup, you have to provide the region-specific browser endpoint. The endpoint depends on the Azure region you selected when creating the workspace.

To get the browser endpoint URL, perform the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com) with your Azure account and navigate to your workspace.

1. Select the **Get Started** page.

    :::image type="content" source="./media/quickstart-advanced-diagnostic-with-playwright-reporting/get-started.png" alt-text="Screenshot that shows how to navigate to the Get Started page." lightbox="./media/quickstart-advanced-diagnostic-with-playwright-reporting/get-started.png":::

1. In **Add the browser endpoint to your setup**, copy the endpoint URL.

    Make sure this URL is available in the `PLAYWRIGHT_SERVICE_URL` environment variable.

    :::image type="content" source="./media/quickstart-advanced-diagnostic-with-playwright-reporting/browser-endpoint.png" alt-text="Screenshot that shows how to copy the service endpoint URL." lightbox="./media/quickstart-advanced-diagnostic-with-playwright-reporting/browser-endpoint.png":::

## Set up your environment

To set up your environment, you have to configure the `PLAYWRIGHT_SERVICE_URL` environment variable with the value you obtained in the previous steps.

Use the `dotenv` module to manage your environment. Using the `dotenv`, you can define your environment variables in the `.env` file.

1. Add the `dotenv` module to your project:

    ```shell
    npm i --save-dev dotenv
    ```

1. Add the following code snippet in `playwright.service.config.ts`:

    ```js
    require('dotenv').config();
    ```
    
1. Create a `.env` file alongside the `playwright.config.ts` file in your Playwright project:

    ```
    PLAYWRIGHT_SERVICE_URL={MY-REGION-ENDPOINT}
    ```

    Make sure to replace the `{MY-REGION-ENDPOINT}` text placeholder with the value you copied earlier.

## Set up authentication

To run your Playwright tests in your Playwright workspace, you need to authenticate the Playwright client where you're running the tests with the service. Authenticate from either your local dev machine or CI machine. 

> [!NOTE]
> Playwright Workspaces reporter supports only Microsoft Entra ID based authentication. If you're using access tokens for authentication, you can't use reporting.

##### Set up authentication using Microsoft Entra ID 

Microsoft Entra ID is the only supported authentication for using reporting feature in Playwright Workspace. From your local dev machine, you can use [Azure CLI](/cli/azure/install-azure-cli) to sign in

```CLI
az login
```
> [!NOTE]
> If you're a part of multiple Microsoft Entra tenants, make sure you sign in to the tenant where your workspace belongs. You can get the tenant ID from Azure portal. See [Find your Microsoft Entra Tenant](/azure/azure-portal/get-subscription-tenant-id#find-your-microsoft-entra-tenant). Once you get the ID, sign in using the command `az login --tenant <TenantID>`

## Run your tests with Playwright Workspaces

You completed the configuration for running your Playwright tests in the cloud with Playwright Workspaces. You can either use the Playwright CLI to run your tests, or use the [Playwright Test Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright).

# [Playwright CLI](#tab/playwrightcli)

1. Open a terminal window.

1. Enter the following command to run your Playwright test suite on remote browsers in your workspace:

    ```bash
    npx playwright test --config=playwright.service.config.ts --workers=20
    ```

    Depending on the size of your test suite, this command runs your tests on up to 20 parallel workers.

# [Visual Studio Code](#tab/vscode)

To run your Playwright test suite in Visual Studio Code with Playwright Workspaces:

1. Open the **Test Explorer** view in the activity bar.

1. Select the **Run tests** button to run all tests with Playwright Workspaces.

    When you run all tests, the default profile is used. In the previous step, you configured the default profile to use projects from the service configuration.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/visual-studio-code-run-all-tests.png" alt-text="Screenshot of how to run all tests from Test Explorer Visual Studio Code." lightbox="./media/quickstart-run-end-to-end-tests/visual-studio-code-run-all-tests.png":::

    > [!TIP]
    > Use the **Debug tests** button to debug your test code when you run your tests on remote browsers.

1. Alternately, you can select a specific service configuration from the list to only run the tests for a specific browser configuration.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/visual-studio-code-run-all-tests-select-project.png" alt-text="Screenshot of how to select a specific project to run tests against in Visual Studio Code." lightbox="./media/quickstart-run-end-to-end-tests/visual-studio-code-run-all-tests-select-project.png":::

1. View all test results in the **Test results** tab.

---

## Debug test runs and results in the Azure portal

#### Add Role Based Access Control (RBAC) roles for the linked storage account

1. Open the linked storage account in [Azure portal](https://portal.azure.com/).

1. Go to the **Access Control (IAM)** tab.

    :::image type="content" source="./media/quickstart-advanced-diagnostic-with-playwright-reporting/storage-account-access.png" alt-text="Screenshot that shows storage account home page for RBAC." lightbox="./media/quickstart-advanced-diagnostic-with-playwright-reporting/storage-account-access.png":::

1. Select **Add role assignment**.

    :::image type="content" source="./media/quickstart-advanced-diagnostic-with-playwright-reporting/storage-account-add-role.png" alt-text="Screenshot that shows storage account add role page." lightbox="./media/quickstart-advanced-diagnostic-with-playwright-reporting/storage-account-add-role.png":::

1. Under **Privileged administrator roles**, search for and select **Contributor*** role and click **Next**.

    :::image type="content" source="./media/quickstart-advanced-diagnostic-with-playwright-reporting/storage-account-contributor.png" alt-text="Screenshot that shows storage account administrative role page." lightbox="./media/quickstart-advanced-diagnostic-with-playwright-reporting/storage-account-contributor.png":::

1. Select and add all members who can view the test reports.

    :::image type="content" source="./media/quickstart-advanced-diagnostic-with-playwright-reporting/storage-account-contributor-add-members.png" alt-text="Screenshot that shows storage account administrative role add members page." lightbox="./media/quickstart-advanced-diagnostic-with-playwright-reporting/storage-account-contributor-add-members.png":::

1. Click **Review + assign**.

#### (Only if trace is enabled) Allow list public trace viewer in the linked storage account

1. Open the linked storage account in [Azure portal](https://portal.azure.com/).

1. Go to **Settings -> Resource sharing (CORS)**.

    :::image type="content" source="./media/quickstart-advanced-diagnostic-with-playwright-reporting/storage-account-cors.png" alt-text="Screenshot that shows storage account home page for CORS." lightbox="./media/quickstart-advanced-diagnostic-with-playwright-reporting/storage-account-cors.png":::

1. Under **Blob service**, add a new record:
    * Allowed origins: `https://trace.playwright.dev`
    * Allowed methods: `GET`, `OPTIONS`
    * Max age: Enter a value between 0 and 2147483647.

    :::image type="content" source="./media/quickstart-advanced-diagnostic-with-playwright-reporting/storage-account-cors-blob-service.png" alt-text="Screenshot that shows storage account cors page." lightbox="./media/quickstart-advanced-diagnostic-with-playwright-reporting/storage-account-cors-blob-service.png":::

1. Select **Save**.

#### View saved test reports in Azure portal

You can now troubleshoot the failed test cases in the Azure portal.

1. After your test run completes, the reporter generates a link to the **Test runs page** in **Azure portal**. Open this link to view detailed test results and associated artifacts.

    :::image type="content" source="./media/quickstart-advanced-diagnostic-with-playwright-reporting/test-runs.png" alt-text="Screenshot that shows test runs page." lightbox="./media/quickstart-advanced-diagnostic-with-playwright-reporting/test-runs.png":::

1. The **Test runs page** provides all the necessary information for troubleshooting. You can:
    * View **detailed error logs**, **test steps**, and attached artifacts such as **screenshots** or **videos**.
    * Navigate directly to the **Trace Viewer** for deeper analysis.

    :::image type="content" source="./media/quickstart-advanced-diagnostic-with-playwright-reporting/test-report.png" alt-text="Screenshot that shows test report page." lightbox="./media/quickstart-advanced-diagnostic-with-playwright-reporting/test-report.png":::

1. The **Trace Viewer** allows you to step through your test execution visually. You can:
    * Use the timeline to hover over individual steps, revealing the page state before and after each action.
    * Inspect **detailed logs**, **DOM snapshots**, **network activity**, **errors**, and **console output** for each step.

    :::image type="content" source="./media/quickstart-advanced-diagnostic-with-playwright-reporting/trace-report.png" alt-text="Screenshot that shows trace page." lightbox="./media/quickstart-advanced-diagnostic-with-playwright-reporting/test-report.png":::

> [!TIP]
> For a better experience, open the trace viewer in a new browser tab by pressing the **Ctrl** button and selecting **View trace**.
