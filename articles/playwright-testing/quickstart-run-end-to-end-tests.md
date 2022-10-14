---
title: 'Quickstart: Run an end-to-end test with Microsoft Playwright Testing'
description: 'This quickstart shows how to run cross-browser, cross-platform end-to-end tests at scale with Microsoft Playwright Testing.'
services: playwright-testing
ms.service: playwright-testing
ms.topic: quickstart
author: ntrogh
ms.author: nicktrog
ms.date: 08/19/2022
---

# Quickstart: Run end-to-end tests at scale with Microsoft Playwright Testing Preview

In this quickstart, you'll set up end-to-end web tests and run them at cloud-scale with Microsoft Playwright Testing Preview. Use cloud infrastructure to validate your application across multiple browsers, devices, and operating systems.

You won't be writing Playwright test specifications, and instead use a sample repository of Playwrights tests. After you complete this quickstart, you'll have a test suite and a Microsoft Playwright Testing workspace that you can use for other tutorials.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- Access to Microsoft Playwright Testing Preview.
- Git. If you don't have it, [download and install it](https://git-scm.com/download).
- [Node](https://nodejs.org/en/download)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

## Download the sample repository

In this quickstart, you'll use a sample Playwright end-to-end test suite that is configured to connect to Microsoft Playwright Testing. The test suite validates a sample React web application.

Clone the sample repository to your workstation:

1. Open your favorite terminal.
1. Navigate to the directory in which you'd like to download the sample repository.
1. Clone the sample repository:

    ```bash
    git clone https://github.com/microsoft/playwright-service-preview
    cd playwright-service-preview/samples/PlaywrightTestRunner
    ```

## Install dependencies

To install the package dependencies in your local directory:

```bash
npm install
```

## Create a workspace

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select the menu button in the upper-left corner of the portal, and then select **Create a resource** a resource.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/azure-portal-create-resource.png" alt-text="Screenshot that shows the Azure portal menu to create a new resource.":::

1. Enter *Microsoft Playwright Testing* in the search box.
1. Select **Microsoft Playwright Testing (Preview)**.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/azure-portal-search-playwright-resource.png" alt-text="Screenshot that shows the Azure Marketplace search page with the Microsoft Playwright Testing search result.":::

1. On the Microsoft Playwright Testing page, select **Create**.
1. Provide the following information to configure a new Microsoft Playwright Testing workspace:

    |Field  |Description  |
    |---------|---------|
    |**Subscription**     | Select the Azure subscription that you want to use for this Microsoft Playwright Testing workspace. |
    |**Resource group**     | Select an existing resource group. Or select **Create new**, and then enter a unique name for the new resource group.        |
    |**Name**     | Enter a unique name to identify your workspace.<BR>The name can't contain special characters, such as \\/""[]:\|<>+=;,?*@&, or whitespace. |
    |**Location**     | Select a geographic location to host your workspace. <BR>This location also determines where the test execution results and related artifacts are stored. |

    >[!NOTE]
    > Optionally, you can configure more details on the **Tags** tab. Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups.

1. After you're finished configuring the resource, select **Review + Create**.

1. Review all the configuration settings and select **Create** to start the deployment of the Microsoft Playwright Testing workspace.

    When the process has finished, a deployment success message appears.

1. To view the new workspace, select **Go to resource**.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/create-resource-deployment-complete.png" alt-text="Screenshot that shows the deployment completion information in the Azure portal.":::

1. Select the dashboard URL on the **Overview** page to navigate directly to the Microsoft Playwright Testing dashboard for your workspace:

    Sign in with the credentials for your Azure subscription.

## Create an access key for service authentication

To authorize Playwright to run tests with Microsoft Playwright Testing, you need an access key.

To generate a new workspace access key:

1. Open the [Playwright portal](https://dashboard.playwright-ppe.io/) and sign in with your Azure credentials.

1. Access the **Menu > Manage Access keys** menu in the top-right of the screen.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/access-key-menu.png" alt-text="Screenshot that shows the Access Key menu in the Playwright portal.":::

1. Select **Generate a new key**.

1. Enter a **Key name**, select an **Expiration** duration, and then select **Generate key**.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/create-access-key.png" alt-text="Screenshot that shows the New access key page in the Playwright portal.":::

1. In the list of access keys, select **Copy** to copy the generated key value.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/copy-access-key-value.png" alt-text="Screenshot that shows how to copy the access key functionality in the Playwright portal.":::
    
    > [!IMPORTANT]
    > You can only access the key value immediately after you've created it. You can't access the key value anymore at a later time.

## Configure Playwright for Microsoft Playwright Testing

The `playwright.config.ts` file contains the Playwright configuration settings and is already preconfigured to use Microsoft Playwright Testing.

On your machine, create an environment variable `ACCESS_KEY`, and set its value to the access key you created earlier:

* Bash:

    ```bash
    export ACCESS_KEY='<my-key-value>'
    ```

* PowerShell:

    ```Powershell
    $env:ACCESS_KEY = '<my-key-value>'
    ```

## Run tests

You've now configured your Playwright tests to run in the cloud with Microsoft Playwright Testing. The tests in the sample repository run across multiple browser and device configurations.

To run the Playwright tests by using the command-line interface:

1. Navigate to the samples directory:

    ```bash
    cd samples/PlaywrightTestRunner
    ```

1. Run this command to run Playwright tests against browsers managed by the service:

    ```bash
    npx playwright test 
    ```

    You should see a similar output when the tests complete:

    ```bash
    Running in non CI mode
    
    Running 150 tests using 10 workers
    
      ✓  [chromium-on-ubuntu] › todo-new.spec.ts:16:3 › New Todo › should allow me to add todo items (7s)
      ✓  [firefox-on-ubuntu] › todo-item.spec.ts:17:3 › Item › should allow me to mark items as complete (8s)
      ✓  [firefox-on-ubuntu] › todo-new.spec.ts:39:3 › New Todo › should clear text input field when an item is added (5s)
      ✓  [webkit-on-ubuntu] › todo-clear.spec.ts:25:3 › Clear completed button › should remove completed items when clicked (7s)
    ...

      145 passed (2m)
    Test report: https://dashboard.playwright-ppe.io/playwright-service/Default%20Group/987351621824417792
    ```

    > [!NOTE]
    > You'll notice several tests failing - this is expected since some errors were intentionally introduced in the sample. Learn more about diagnosing test failures in the tutorial.

1. Select the URL in the test output to view the test results in the Microsoft Playwright Testing portal.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/playwright-testing-run-details.png" alt-text="Screenshot that shows test run details in the Microsoft Playwright Testing dashboard.":::
    
    The dashboard shows the results for each test, for each browser configuration, grouped by the test specification file. You can use the rich test artifacts to diagnose failing tests.

## Next steps

You've now successfully created a Microsoft Playwright Testing workspace, and have run Playwright tests in the cloud.

Advance to the next tutorial to learn how to identify app issues by using the information in the Microsoft Playwright Testing portal.

> [!div class="nextstepaction"]
> [Identify app issues with end-to-end tests](./tutorial-identify-issues-with-end-to-end-tests.md)
