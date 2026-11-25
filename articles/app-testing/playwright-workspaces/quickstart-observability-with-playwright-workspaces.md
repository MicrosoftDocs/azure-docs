---
title: 'Quickstart: Perform advanced diagnostics with Playwright Workspaces observability'
titleSuffix: Playwright Workspaces
description: 'Perform advanced diagnostics on your browser sessions by saving your session recordings and test reports to Azure storage and viewing them on Azure portal using the Playwright Workspaces observability feature.'
ms.topic: quickstart
ms.date: 11/20/2026
ms.service: azure-app-testing
ms.subservice: playwright-workspaces
author: Abhinav-Premsekhar
ms.author: apremsekhar
ms.custom: playwright-workspaces
zone_pivot_group_filename: app-testing/playwright-workspaces/zone-pivots-groups.json
zone_pivot_groups: playwright-workspaces-automation
---

# Quickstart: Perform advanced diagnostics with Playwright Workspaces observability

In this quickstart, you learn how to debug your Playwright Workspaces browser sessions by using the observability feature in Playwright Workspaces. Perform advanced diagnostics on your browser automation runs and Playwright tests by saving session recordings or test reports to Azure storage and viewing them in Azure portal using the Playwright Workspaces observability.

::: zone pivot="testautomation"

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.
* Your Azure account needs the [Owner](/azure/role-based-access-control/built-in-roles#owner), [Contributor](/azure/role-based-access-control/built-in-roles#contributor), or one of the [classic administrator roles](/azure/role-based-access-control/rbac-and-directory-admin-roles#classic-subscription-administrator-roles).
* A Playwright project that uses Playwright runner and JavaScript SDK (NUnit and other runners aren't currently supported). If you don't have a project, create one by using the [Playwright getting started documentation](https://playwright.dev/docs/intro) or use the [Playwright Workspaces sample project](https://github.com/Azure/playwright-workspaces/blob/main/samples/playwright-tests).
* Azure CLI. If you don't have Azure CLI, see [Install Azure CLI](/cli/azure/install-azure-cli).
* The Playwright Workspace must use Microsoft Entra ID authentication. Authentication using an access token isn't supported for observability.

## Enable observability and link a storage account to a workspace

To get started with Playwright Workspaces observability, first enable it in your workspace and link a storage account to store your artifacts. You can get started with a new workspace or use your existing workspace.

### [New workspace](#tab/newworkspace)

1. Sign in to the [Azure portal](https://portal.azure.com/) by using the credentials for your Azure subscription.

1. From the portal Home page, search for and select **Azure App Testing**.

    :::image type="content" source="./media/quickstart-observability-with-playwright-workspaces/azure-portal-search.png" alt-text="Screenshot that shows how to open Azure App Testing." lightbox="./media/quickstart-observability-with-playwright-workspaces/azure-portal-search.png":::

1. On the **Azure App Testing** hub, select **Create** under **Playwright Workspaces**.

    :::image type="content" source="./media/quickstart-observability-with-playwright-workspaces/app-testing-hub.png" alt-text="Screenshot that shows Azure App Testing home page." lightbox="./media/quickstart-observability-with-playwright-workspaces/app-testing-hub.png":::

1. On the **Create a Playwright workspace resource** page, enter the following information in the **Basics** tab:
    
    |Field  |Description  |
    |---------|---------|
    |**Subscription**     | Select the Azure subscription that you want to use for this Playwright workspace. |
    |**Resource group**     | Select an existing resource group. Or select **Create new**, and then enter a unique name for the new resource group.        |
    |**Name**     | Enter a unique name for your workspace.<BR>The name can only consist of alphanumeric characters and hyphens, and have a length between 3 and 24 characters. |
    |**Location**     | Select a geographic location for your workspace. <BR>This location also determines where the test execution results are stored. |

1. Navigate to the **Capabilities** tab, and enter the following information:

    |Field  |Description  |
    |---------|---------|
    |**Observability**     | Toggle is set to Enabled by default to enable users to save and view their test run reports from Playwright Workspace. If you want to turn off observability, toggle the setting to Disabled. |
    |**Storage account**     | Toggle is set to Enabled by default to enable users to save and view their test run reports from Playwright Workspace. If you want to turn off observability, toggle the setting to Disabled. |

    > [!NOTE]
    > Playwright Workspaces observability uses Azure Storage to store your test reports and other artifacts. Storage costs are determined based on your storage account's data-retention settings.

    > [!NOTE]
    > Optionally, configure more details on the **Tags** tab. Tags are name/value pairs that you use to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups.
    
    > [!NOTE]
    > Saving observability artifacts to a customer-managed Azure Storage account currently requires network access to the storage account's public endpoint. Storage accounts configured for private-endpoint-only access aren't supported for artifact storing scenarios.

1. After you finish configuring the resource, select **Review + Create**.

1. Review the settings you provide, and then select **Create**. It takes a few minutes to create the workspace. Wait for the portal page to display **Your deployment is complete** before moving on.

    :::image type="content" source="./media/how-to-manage-playwright-workspace/create-resource-deployment-complete.png" alt-text="Screenshot that shows the deployment completion information in the Azure portal." lightbox="./media/how-to-manage-playwright-workspace/create-resource-deployment-complete.png":::

### [Existing workspace](#tab/existingworkspace)

1. Sign in to the [Azure portal](https://portal.azure.com/) by using the credentials for your Azure subscription.

1. From the portal Home page, search for and select **Azure App Testing**.

    :::image type="content" source="./media/quickstart-observability-with-playwright-workspaces/azure-portal-search.png" alt-text="Screenshot that shows how to open Azure App Testing." lightbox="./media/quickstart-observability-with-playwright-workspaces/azure-portal-search.png":::

1. On the **Azure App Testing** hub, select **View resources**.

    :::image type="content" source="./media/quickstart-observability-with-playwright-workspaces/app-testing-hub-view-resources.png" alt-text="Screenshot that shows Azure App Testing home page." lightbox="./media/quickstart-observability-with-playwright-workspaces/app-testing-hub-view-resources.png":::

1. Search for and open your Playwright workspace.

1. In the left nav, select **Settings** -> **Capabilities**.

1. Set the **Observability** toggle to **Enabled** and select a storage account to link to your Playwright Workspace.

    :::image type="content" source="./media/quickstart-observability-with-playwright-workspaces/storage-configuration.png" alt-text="Screenshot that shows Azure App Testing storage configuration page." lightbox="./media/quickstart-observability-with-playwright-workspaces/storage-configuration.png":::

    > [!NOTE]
    > Playwright Workspaces observability uses Azure Storage to store your test reports and other artifacts. Storage costs are determined based on your storage account's data-retention settings.
    
    > [!NOTE]
    > Saving observability artifacts to a customer-managed Azure Storage account currently requires network access to the storage account's public endpoint. Storage accounts configured for private-endpoint-only access aren't supported for artifact storing scenarios.

1. Select **Save**.

---

## Add role-based access control (RBAC) roles for the linked storage account

1. Open the linked storage account in [Azure portal](https://portal.azure.com/).

1. Go to the **Access Control (IAM)** tab.

    :::image type="content" source="./media/quickstart-observability-with-playwright-workspaces/storage-account-access.png" alt-text="Screenshot that shows storage account home page." lightbox="./media/quickstart-observability-with-playwright-workspaces/storage-account-access.png":::

1. Select **Add role assignment**.

    :::image type="content" source="./media/quickstart-observability-with-playwright-workspaces/storage-account-add-role.png" alt-text="Screenshot that shows storage account add role page." lightbox="./media/quickstart-observability-with-playwright-workspaces/storage-account-add-role.png":::

1. Under **Job function roles**, search for and select **Storage Blob Data Contributor** role and select **Next**.

    :::image type="content" source="./media/quickstart-observability-with-playwright-workspaces/storage-account-blob-contributor.png" alt-text="Screenshot that shows storage account job function role page." lightbox="./media/quickstart-observability-with-playwright-workspaces/storage-account-blob-contributor.png":::

1. Select and add all members who run tests.

    :::image type="content" source="./media/quickstart-observability-with-playwright-workspaces/storage-account-blob-contributor-add-members.png" alt-text="Screenshot that shows storage account job function role add members page." lightbox="./media/quickstart-observability-with-playwright-workspaces/storage-account-blob-contributor-add-members.png":::

1. Select **Review + assign**.

## Install Playwright Workspaces package 

To use Playwright Workspaces, install the Playwright Workspaces package. 

```npm
npm init @azure/playwright@latest
```

This command generates a `playwright.service.config.ts` file, which directs and authenticates Playwright to Playwright Workspaces.

If you already have this file, the package asks you to overwrite it.

## Enable HTML and Playwright Workspaces reporter

To use the Playwright Workspaces observability feature, enable the HTML and Playwright Workspaces reporter by adding the following setting in the `playwright.service.config.ts` file –

```playwright.service.config.ts
reporter: [
    ["html", { open: "never" }], // HTML reporter must come first
    ["@azure/playwright/reporter"], // Azure reporter uploads HTML report
]
```

## Enable artifacts in your Playwright setup

In the `playwright.config.ts` file of your project, make sure you are collecting all the required artifacts.

```playwright.config.ts
use: 
{
    trace: 'on-first-retry',
    video:'retain-on-failure',
    screenshot:'on'
}
```

## Configure the browser endpoint

In your setup, provide the region-specific browser endpoint. The endpoint depends on the Azure region you selected when creating the workspace.

To get the browser endpoint URL, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) with your Azure account and go to your workspace.

1. Select the **Get Started** page.

    :::image type="content" source="./media/quickstart-observability-with-playwright-workspaces/get-started.png" alt-text="Screenshot that shows how to navigate to the Get Started page." lightbox="./media/quickstart-observability-with-playwright-workspaces/get-started.png":::

1. In **Add the browser endpoint to your setup**, copy the endpoint URL.

    Ensure this URL is available in the `PLAYWRIGHT_SERVICE_URL` environment variable.

    :::image type="content" source="./media/quickstart-observability-with-playwright-workspaces/browser-endpoint.png" alt-text="Screenshot that shows how to copy the service endpoint URL." lightbox="./media/quickstart-observability-with-playwright-workspaces/browser-endpoint.png":::

## Set up your environment

To set up your environment, configure the `PLAYWRIGHT_SERVICE_URL` environment variable with the value you obtained in the previous steps.

Use the `dotenv` module to manage your environment. By using the `dotenv` module, you can define your environment variables in the `.env` file.

1. Add the `dotenv` module to your project.

    ```shell
    npm i --save-dev dotenv
    ```

1. Add the following code snippet in `playwright.service.config.ts`.

    ```js
    require('dotenv').config();
    ```
    
1. Create a `.env` file alongside the `playwright.config.ts` file in your Playwright project.

    ```
    PLAYWRIGHT_SERVICE_URL={MY-REGION-ENDPOINT}
    ```

    Ensure you replace the `{MY-REGION-ENDPOINT}` text placeholder with the value you copied earlier.

## Set up authentication

To run your Playwright tests in your Playwright workspace, you need to authenticate the Playwright client where you're running the tests with the service. Authenticate from either your local dev machine or CI machine. 

> [!NOTE]
> Playwright Workspaces observability for test automation supports only Microsoft Entra ID based authentication. If you're using access tokens for authentication, you can't use observability.

##### Set up authentication using Microsoft Entra ID 

Microsoft Entra ID is the only supported authentication for using observability feature in Playwright Workspace. From your local dev machine, you can use [Azure CLI](/cli/azure/install-azure-cli) to sign in

```CLI
az login
```
> [!NOTE]
> If you're a part of multiple Microsoft Entra tenants, make sure you sign in to the tenant where your workspace belongs. You can get the tenant ID from Azure portal. See [Find your Microsoft Entra Tenant](/azure/azure-portal/get-subscription-tenant-id#find-your-microsoft-entra-tenant). Once you get the ID, sign in using the command `az login --tenant <TenantID>`.

## Run your tests with Playwright Workspaces

You completed the configuration for running your Playwright tests in the cloud with Playwright Workspaces. You can either use the Playwright CLI to run your tests, or use the [Playwright Test Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright).

### [Playwright CLI](#tab/playwrightcli)

1. Open a terminal window.

1. Enter the following command to run your Playwright test suite on remote browsers in your workspace:

    ```bash
    npx playwright test --config=playwright.service.config.ts --workers=20
    ```

    Depending on the size of your test suite, this command runs your tests on up to 20 parallel workers.

### [Visual Studio Code](#tab/vscode)

To run your Playwright test suite in Visual Studio Code with Playwright Workspaces:

1. Open the **Test Explorer** view in the activity bar.

1. Select the **Run tests** button to run all tests with Playwright Workspaces.

    When you run all tests, the default profile is used. In the previous step, you configured the default profile to use projects from the service configuration.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/visual-studio-code-run-all-tests.png" alt-text="Screenshot of how to run all tests from Test Explorer Visual Studio Code." lightbox="./media/quickstart-run-end-to-end-tests/visual-studio-code-run-all-tests.png":::

    > [!TIP]
    > Use the **Debug tests** button to debug your test code when you run your tests on remote browsers.

1. Alternately, select a specific service configuration from the list to only run the tests for a specific browser configuration.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/visual-studio-code-run-all-tests-select-project.png" alt-text="Screenshot of how to select a specific project to run tests against in Visual Studio Code." lightbox="./media/quickstart-run-end-to-end-tests/visual-studio-code-run-all-tests-select-project.png":::

1. View all test results in the **Test results** tab.

---

## Debug test runs and results in the Azure portal

#### Add role-based access control (RBAC) roles for the linked storage account

1. Open the linked storage account in [Azure portal](https://portal.azure.com/).

1. Go to the **Access Control (IAM)** tab.

    :::image type="content" source="./media/quickstart-observability-with-playwright-workspaces/storage-account-access.png" alt-text="Screenshot that shows storage account home page for RBAC." lightbox="./media/quickstart-observability-with-playwright-workspaces/storage-account-access.png":::

1. Select **Add role assignment**.

    :::image type="content" source="./media/quickstart-observability-with-playwright-workspaces/storage-account-add-role.png" alt-text="Screenshot that shows storage account add role page." lightbox="./media/quickstart-observability-with-playwright-workspaces/storage-account-add-role.png":::

1. Under **Privileged administrator roles**, search for and select **Storage Blob Data Viewer** role and select **Next**.

    :::image type="content" source="./media/quickstart-observability-with-playwright-workspaces/storage-account-contributor.png" alt-text="Screenshot that shows storage account administrative role page." lightbox="./media/quickstart-observability-with-playwright-workspaces/storage-account-contributor.png":::

1. Select and add all members who can view the test reports.

    :::image type="content" source="./media/quickstart-observability-with-playwright-workspaces/storage-account-contributor-add-members.png" alt-text="Screenshot that shows storage account administrative role add members page." lightbox="./media/quickstart-observability-with-playwright-workspaces/storage-account-contributor-add-members.png":::

1. Select **Review + assign**.

#### (Only if trace is enabled) Allow list public trace viewer in the linked storage account

1. Open the linked storage account in [Azure portal](https://portal.azure.com/).

1. Go to **Settings** > **Resource sharing (CORS)**.

    :::image type="content" source="./media/quickstart-observability-with-playwright-workspaces/storage-account-cors.png" alt-text="Screenshot that shows storage account home page for CORS." lightbox="./media/quickstart-observability-with-playwright-workspaces/storage-account-cors.png":::

1. Under **Blob service**, add a new record:
    * Allowed origins: `https://trace.playwright.dev`
    * Allowed methods: `GET`, `OPTIONS`
    * Max age: Enter a value between 0 and 2147483647.

    :::image type="content" source="./media/quickstart-observability-with-playwright-workspaces/storage-account-cors-blob-service.png" alt-text="Screenshot that shows storage account CORS page." lightbox="./media/quickstart-observability-with-playwright-workspaces/storage-account-cors-blob-service.png":::

1. Select **Save**.

#### View saved test reports in Azure portal

You can now troubleshoot the failed test cases in the Azure portal.

1. After your test run completes, the reporter generates a link to the **Test runs page** in **Azure portal**. Open this link to view detailed test results and associated artifacts.

    :::image type="content" source="./media/quickstart-observability-with-playwright-workspaces/test-runs.png" alt-text="Screenshot that shows test runs page." lightbox="./media/quickstart-observability-with-playwright-workspaces/test-runs.png":::

1. The **Test runs page** provides all the necessary information for troubleshooting. You can:
    * View **detailed error logs**, **test steps**, and attached artifacts such as **screenshots** or **videos**.
    * Navigate directly to the **Trace Viewer** for deeper analysis.

    :::image type="content" source="./media/quickstart-observability-with-playwright-workspaces/test-report.png" alt-text="Screenshot that shows test report page." lightbox="./media/quickstart-observability-with-playwright-workspaces/test-report.png":::

1. The **Trace Viewer** allows you to step through your test execution visually. You can:
    * Use the timeline to hover over individual steps, revealing the page state before and after each action.
    * Inspect **detailed logs**, **DOM snapshots**, **network activity**, **errors**, and **console output** for each step.

    :::image type="content" source="./media/quickstart-observability-with-playwright-workspaces/trace-report.png" alt-text="Screenshot that shows trace page." lightbox="./media/quickstart-observability-with-playwright-workspaces/test-report.png":::

> [!TIP]
> For a better experience, open the trace viewer in a new browser tab by pressing the **Ctrl** button and selecting **View trace**.

::: zone-end

::: zone pivot="browserautomation"

## Prerequisites

Before you begin, ensure you have the following items:

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).
- The [Owner](/azure/role-based-access-control/built-in-roles#owner), [Contributor](/azure/role-based-access-control/built-in-roles#contributor), or one of the [classic administrator roles](/azure/role-based-access-control/rbac-and-directory-admin-roles#classic-subscription-administrator-roles) on your Azure account.
- To let the Azure portal assign storage permissions to the managed identity for you, a role that can assign roles on the storage account, such as [Owner](/azure/role-based-access-control/built-in-roles#owner), [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator), or [Role Based Access Control Administrator](/azure/role-based-access-control/built-in-roles#role-based-access-control-administrator). If you don't have one of these roles, ask someone who does to assign the permissions for you.
- An MCP client that's connected to the Playwright Workspaces remote MCP server, such as GitHub Copilot app, Visual Studio Code with GitHub Copilot, or GitHub Copilot CLI. To set one up, see [Quickstart: Automate browser tasks with the remote MCP server](../playwright-cloud-browsers/quickstart-automate-browser-tasks-remote-mcp.md).

## Turn on observability and configure storage

Session recordings are stored in an Azure storage account that's linked to your workspace. Playwright Workspaces uses a managed identity to write artifacts to that storage account. To set up this configuration, turn on observability, select a storage account, and choose the managed identity. You can create a new workspace or update an existing one.

# [New workspace](#tab/newworkspace)

1. Sign in to the [Azure portal](https://portal.azure.com) by using the credentials for your Azure subscription.

1. From the portal home page, search for and select **Azure App Testing**.

1. On the **Azure App Testing** hub, under **Playwright Workspaces**, select **Create**.

1. On the **Basics** tab of the **Create a Playwright workspace** page, enter the following information:

   | Field | Description |
   |---|---|
   | **Subscription** | Select the Azure subscription that you want to use for this Playwright workspace. |
   | **Resource group** | Select an existing resource group. Or select **Create new**, and then enter a unique name for the new resource group. |
   | **Name** | Enter a unique name for your workspace. The name can contain only alphanumeric characters and hyphens, and must be 3 to 24 characters long. |
   | **Location** | Select a geographic location for your workspace. |

1. Select the **Capabilities** tab, and then enter the following information:

   | Field | Description |
   |---|---|
   | **Observability** | Turn on to capture reports, traces, and session recordings. |
   | **Storage account** | Select an existing storage account, or select **Create new** to create one. Playwright Workspaces stores your session recordings and other artifacts in this storage account. |
   | **Identity type** | Select the managed identity that Playwright Workspaces uses to access the storage account: **System-assigned** or **User-assigned**. If you select **User-assigned**, choose the user-assigned managed identity. |
   | **Identity permissions** | Select **Assign permissions to the managed identities on my behalf** to have the Azure portal assign the **Storage Blob Data Contributor** role on the storage account to the managed identity. Select this option only if you have permission to assign roles on the storage account. Otherwise, clear it and [assign the role manually](#assign-storage-permissions-to-the-managed-identity). |

   :::image type="content" source="../playwright-cloud-browsers/capabilities/media/create-workspace-capabilities.png" alt-text="Screenshot that shows the Capabilities tab of the Create a Playwright workspace page, with Observability turned on, a storage account selected, the identity type set to System-assigned, and the option to assign permissions to the managed identities selected." lightbox="../playwright-cloud-browsers/capabilities/media/create-workspace-capabilities.png":::

1. Optionally, add tags on the **Tags** tab. Tags are name/value pairs that you use to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups.

1. Select **Review + create**. Review your settings, and then select **Create**.

   It takes a few minutes to create the workspace. Wait until the portal shows **Your deployment is complete** before you continue.

# [Existing workspace](#tab/existingworkspace)

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your Playwright workspace.

1. Select **Settings** > **Capabilities**.

1. Enter the following information:

   | Field | Description |
   |---|---|
   | **Observability** | Turn on to capture reports, traces, and session recordings. |
   | **Storage account** | Select an existing storage account, or select **Create new** to create one. To open the selected storage account, select **View storage account**. |
   | **Identity type** | Select the managed identity that Playwright Workspaces uses to access the storage account: **System assigned identity** or **User assigned identity**. If you select **User assigned identity**, choose the user-assigned managed identity. |
   | **Identity permissions** | Select **Assign permissions to the managed identities on my behalf** to have the Azure portal assign the **Storage Blob Data Contributor** role on the storage account to the managed identity. Select this option only if you have permission to assign roles on the storage account. Otherwise, clear it and [assign the role manually](#assign-storage-permissions-to-the-managed-identity). |

   :::image type="content" source="../playwright-cloud-browsers/capabilities/media/workspace-capabilities-settings.png" alt-text="Screenshot that shows the Capabilities page of a Playwright workspace in the Azure portal, with Observability turned on, a storage account selected, the identity type set to System assigned identity, and the option to assign permissions to the managed identities selected." lightbox="../playwright-cloud-browsers/capabilities/media/workspace-capabilities-settings.png":::

1. Save your changes.

> [!NOTE]
> Reporting is part of observability, together with session recording. If you already used reporting, your existing reporting settings remain unchanged.

---

> [!NOTE]
> All workspace features that need a storage account, such as session recording, reporting, and browser profiles, use the same storage account and managed identity that you configure on the **Capabilities** page.

> [!NOTE]
> Playwright Workspaces observability stores your session recordings and other artifacts in Azure Storage. Storage costs depend on your storage account's data-retention settings.

> [!NOTE]
> To save artifacts, the storage account must allow network access through its public endpoint. Storage accounts that allow access only through private endpoints aren't currently supported for storing artifacts.

### Assign storage permissions to the managed identity

If you cleared **Assign permissions to the managed identities on my behalf**, or if you don't have permission to assign roles on the storage account, assign the role manually. If you don't have the required permission, ask someone with the **Owner**, **User Access Administrator**, or **Role Based Access Control Administrator** role on the storage account to complete these steps.

1. In the [Azure portal](https://portal.azure.com), go to the storage account that's linked to your workspace.

1. Select **Access control (IAM)** > **Add** > **Add role assignment**.

1. On the **Role** tab, search for and select **Storage Blob Data Contributor**, and then select **Next**.

1. On the **Members** tab, for **Assign access to**, select **Managed identity**.

1. Select **Select members**, and then select the managed identity that you chose for the workspace:

   - For a system-assigned identity, select **Playwright Workspace** as the managed identity type, and then select your workspace. 
   - For a user-assigned identity, select **User-assigned managed identity**, and then select the identity.

1. Select **Select**, and then select **Review + assign**.

> [!TIP]
> Role assignments can take a few minutes to take effect. If recordings don't appear right away, wait a few minutes and run the session again.

## Turn on session recording in your MCP client

The remote MCP server records a browser session only when your MCP client asks for it. To turn on recording, add the following HTTP header to the remote MCP server configuration in your MCP client:

| Header | Value |
|---|---|
| `x-ms-enable-sessionartifacts` | `Enabled` |

Every browser session that the client creates through this MCP server connection is recorded. Sessions from clients that don't send the header aren't recorded. Keep your existing URL and authentication settings when you add the header.

# [GitHub Copilot app](#tab/mcp-githubapp)

1. In GitHub Copilot app, select **Customize** in the sidebar, and then select the **Installed** tab.

1. Under **MCP Servers**, find the Playwright Workspaces server, for example `playwright-cloud-browsers-<workspace-name>`, open its **More options** menu, and select **Edit configuration**.

1. Under **Headers**, select **Add header**, and then enter the following values:

   - **Name**: `x-ms-enable-sessionartifacts`
   - **Value**: `Enabled`

   :::image type="content" source="../playwright-cloud-browsers/capabilities/media/github-copilot-app-mcp-header.png" alt-text="Screenshot that shows the MCP server settings in GitHub Copilot app, with the header x-ms-enable-sessionartifacts set to Enabled." lightbox="../playwright-cloud-browsers/capabilities/media/github-copilot-app-mcp-header.png":::

1. Select **Save**.

# [Visual Studio Code](#tab/mcp-vscode)

1. In Visual Studio Code, open the MCP configuration file that contains your Playwright Workspaces remote MCP server. For a workspace configuration, use `.vscode/mcp.json`.

1. In the entry for the Playwright Workspaces remote MCP server, add the `x-ms-enable-sessionartifacts` header.

   ```json
   {
     "servers": {
       "playwright-workspaces": {
         "type": "http",
         "url": "<your-mcp-endpoint>",
         "headers": {
           "x-ms-enable-sessionartifacts": "Enabled"
         }
       }
     }
   }
   ```

1. Save the file, and then restart the MCP server by using the **MCP: List Servers** command so that the new header takes effect.

# [GitHub Copilot CLI](#tab/mcp-copilotcli)

1. Open the MCP configuration file `~/.copilot/mcp-config.json`.

1. In the entry for the Playwright Workspaces remote MCP server, add the `x-ms-enable-sessionartifacts` header.

   ```json
   {
     "mcpServers": {
       "playwright-workspaces": {
         "type": "http",
         "url": "<your-mcp-endpoint>",
         "headers": {
           "x-ms-enable-sessionartifacts": "Enabled"
         },
         "tools": ["*"]
       }
     }
   }
   ```

1. Save the file, and then restart GitHub Copilot CLI.

---

> [!TIP]
> If your server entry already has other Playwright Workspaces headers, such as `x-ms-browser-profile-id` or `x-ms-secret-store-id`, add `x-ms-enable-sessionartifacts` to the same set of headers.

## Run a browser session with your agent

Ask your agent to do a browser task. For example, enter the following prompt:

```text
Open https://playwright.dev, open the Docs page, and tell me the title of the page.
```

The agent opens a cloud browser in your workspace, completes the task, and closes the session. Because your MCP client sends the `x-ms-enable-sessionartifacts` header, the session's artifacts are saved to the linked storage account.
The agent returns a link to the saved browser session in Azure portal.

> [!CAUTION]
> Session recordings capture what the browser shows, including screenshots of each page, page content, and network traffic. If your agent works with sensitive data, limit who can read the linked storage account, and set a data-retention policy that meets your organization's requirements.

## View session recordings in the Azure portal

To view recordings in the Azure portal, you need read access to the linked storage account, and the storage account must allow Trace Viewer to load the trace files.

### Assign a storage role to people who view recordings

1. In the [Azure portal](https://portal.azure.com), go to the storage account that's linked to your workspace.

1. Select **Access control (IAM)** > **Add** > **Add role assignment**.

1. On the **Role** tab, search for and select **Storage Blob Data Reader**, and then select **Next**.

1. On the **Members** tab, select and add everyone who needs to view session recordings.

1. Select **Review + assign**.

### Allow Trace Viewer to read from the storage account

1. In the Azure portal, go to the linked storage account.

1. Select **Settings** > **Resource sharing (CORS)**.

1. On the **Blob service** tab, add a record with the following values:

   | Field | Value |
   |---|---|
   | **Allowed origins** | `https://trace.playwright.dev` |
   | **Allowed methods** | `GET`, `OPTIONS` |
   | **Max age** | A value between `0` and `2147483647`. |

1. Select **Save**.

### Review a recorded session

1. In the Azure portal, go to your Playwright workspace.

1. Select **Browser sessions** > **Browser activity log**.

   The **Browser activity log** lists the browser sessions in your workspace. Each session shows the name, session ID, creator, source type, start time, source ID, billable time, browser type, and status. To find a session, filter the list by **Time range**, **Source Type**, **Status**, or source ID. Your MCP client creates sessions with the source type **Mcp**.

   :::image type="content" source="../playwright-cloud-browsers/capabilities/media/browser-activity-log.png" alt-text="Screenshot that shows the Browser activity log page of a Playwright workspace in the Azure portal, with a list of browser sessions and their source type, start time, billable time, browser type, and status." lightbox="../playwright-cloud-browsers/capabilities/media/browser-activity-log.png":::

1. Select the name of the session that your agent ran.

   The session page shows the **Session details** and the **Session playback**. In the playback, you can:

   - Move along the timeline to see the page at any point in the session.
   - Select an action in the **Actions** list to see the page **Before** and **After** the action.
   - Use the **Locator**, **Call**, **Log**, **Errors**, **Console**, **Network**, **Source**, and **Attachments** tabs to inspect the details of each action.
   - Open the session in **Trace Viewer** for deeper analysis.

   :::image type="content" source="../playwright-cloud-browsers/capabilities/media/browser-session-playback.png" alt-text="Screenshot that shows a browser session in the Azure portal, with the session details at the top and the session playback below, including the timeline, the actions list, a page snapshot, and the console messages." lightbox="../playwright-cloud-browsers/capabilities/media/browser-session-playback.png":::

1. To go back to the list, select **View all sessions**.

## Stop recording sessions

To stop recording new sessions, remove the `x-ms-enable-sessionartifacts` header from your MCP client configuration. Existing recordings stay in your storage account until you delete them, or until your storage account's data-retention settings remove them.

## Data residency

All session recordings and other artifacts are stored in the Azure storage account that you link to your workspace. You own and control this storage account, including its region, access, network settings, and data retention.

Playwright Workspaces stores only the metadata that it needs to list and manage your sessions, such as the session name and ID, creator, status, start and end times, billable time, source type, and browser type. Playwright Workspaces doesn't store any client-side data from your browser sessions, such as page content, screenshots, videos, traces, console messages, or network traffic.

::: zone-end

## Related content

- [Troubleshoot the remote MCP server](troubleshoot-remote-mcp-server.md)
- [Trace Viewer in the Playwright documentation](https://playwright.dev/docs/trace-viewer)
- [What are managed identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview)
- [Assign Azure roles by using the Azure portal](/azure/role-based-access-control/role-assignments-portal)