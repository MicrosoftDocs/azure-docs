---
title: 'Tutorial: Run end-to-end tests with Playwright Testing'
description: 'In this tutorial, you learn how to integrate Microsoft Playwright Testing with a Playwright test suite, run Playwright tests on cloud hosted browsers and troubleshoot failed tests using reports.'
author: vvs11
ms.author: vanshsingh
ms.service: playwright-testing
ms.topic: tutorial
ms.date: 12/18/2024

#customer intent: As a Playwright user, I want to learn how to integrate my Playwright test suite with Microsoft Playwright Testing service so that I can run my test suite faster using the cloud-hosted browsers and troubleshoot easily using service reporting. 

---

# Tutorial: Run end-to-end Playwright tests with Microsoft Playwright Testing service

In this tutorial, you learn how to integrate your Playwright test suite with Microsoft Playwright Testing, run tests faster using cloud-hosted browsers, and troubleshoot efficiently using the service's reporting features. You simulate a Playwright test suite, connect it to the service for faster execution, and use reporting tools for streamlined troubleshooting.

In this tutorial, you:

> [!div class="checklist"]
> * Set up a Playwright test suite.
> * Integrate the Playwright test suite with Microsoft Playwright Testing service.
> * Run the test suite with the service for faster execution and efficient troubleshooting. 

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* The [Azure CLI](/cli/azure/install-azure-cli) installed on your local computer.
* Azure CLI version 2.2.0 or later. Run `az --version` to check the installed version on your computer. If you need to install or upgrade the Azure CLI, see [How to install the Azure CLI](/cli/azure/install-azure-cli).
* Visual Studio Code. If you don't have it, [download and install it](https://code.visualstudio.com/Download).
* Git. If you don't have it, [download and install it](https://git-scm.com/download).

### Prerequisites check

Before you start, validate your environment:

* Sign in to the Azure portal and check that your subscription is active.

* Check your version of the Azure CLI in a terminal or command window by running `az --version`. For the latest version, see the [latest release notes](/cli/azure/release-notes-azure-cli?tabs=azure-cli).

  If you don't have the latest version, update your installation by following the [installation guide for your operating system or platform](/cli/azure/install-azure-cli).


## Set up Playwright test suite

In this step, you are creating a Playwright test suite which is integrated with the service. 

1. Clone the sample repository and navigate to test folder. 

```powershell
git clone https://github.com/microsoft/playwright-testing-service
cd playwright-testing-service/samples/get-started
```

2. Install dependencies.

```powershell
npm install
```
3. Run Playwright tests.

Run this command to execute tests locally, outside of the service, to identify any problems before integrating with the service. This project is used in the next steps to integrate with the service. 

```powershell
npx playwright test
```

## Integrate Playwright test suite with Microsoft Playwright Testing service

Integrate the Playwright test suite you created in the previous tutorial with Playwright Testing service. 

Follow these steps to set up the service and integrate the test suite. 

### Create a Playwright Testing workspace

To get started with running your Playwright tests at scale on cloud browsers, you first create a Microsoft Playwright Testing workspace in the Playwright portal.

[!INCLUDE [Create workspace in Playwright portal](./includes/include-playwright-portal-create-workspace.md)]

When the workspace creation finishes, you're redirected to the setup guide.


### Install Microsoft Playwright Testing package

To install service package, navigate to the location of your test suite you created in the previous tutorial and run this command:

```npm
npm init @azure/microsoft-playwright-testing@latest
```

This command generates `playwright.service.config.ts` file which serves to:

- Direct and authenticate Playwright to the Microsoft Playwright Testing service.
- Adds a reporter to publish test results and artifacts.

### Configure the service region endpoint

In your setup, you have to provide the region-specific service endpoint. The endpoint depends on the Azure region you selected when creating the workspace.

To get the service endpoint URL, perform the following steps:

1. In **Add region endpoint in your setup**, copy the region endpoint for your workspace.

    The endpoint URL matches the Azure region that you selected when creating the workspace. Ensure this URL is available in `PLAYWRIGHT_SERVICE_URL` environment variable.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/playwright-testing-region-endpoint.png" alt-text="Screenshot that shows how to copy the workspace region endpoint in the Playwright Testing portal." lightbox="./media/quickstart-run-end-to-end-tests/playwright-testing-region-endpoint.png":::


### Set up your environment

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


### Set up authentication

To run your Playwright tests in your Microsoft Playwright Testing workspace, you need to authenticate the Playwright client where you're running the tests with the service. Authenticate with the dev workstation where you are running the Playwright tests.  

Microsoft Entra ID is the default and recommended authentication for the service. Use [Azure CLI](/cli/azure/install-azure-cli) to sign-in

```CLI
az login
```

> [!NOTE]
> If you're a part of multiple Microsoft Entra tenants, make sure you sign in to the tenant where your workspace belongs. You can get the tenant ID from Azure portal. See [Find your Microsoft Entra Tenant](/azure/azure-portal/get-subscription-tenant-id#find-your-microsoft-entra-tenant). Once you get the ID, sign-in using the command `az login --tenant <TenantID>`


### Enable artifacts in your Playwright setup

In the `playwright.config.ts` file of your project, ensure you are collecting all the required artifacts.
```typescript
  use: {
    trace: 'on-first-retry',
    video:'retain-on-failure',
    screenshot:'on'
  }
```

## Run your tests at scale and troubleshoot easily with Microsoft Playwright Testing

You've now prepared the configuration for running your Playwright tests in the cloud with Microsoft Playwright Testing.

### Run Playwright tests with the service

With Microsoft Playwright Testing, you get charged based on the number of total test minutes and number of test results published. If you're a first-time user or [getting started with a free trial](./how-to-try-playwright-testing-free.md), you may run a single test at scale instead of your full test suite to avoid exhausting your free trial limits.

Follow these steps to run Playwright tests with Microsoft Playwright Testing:

1. Open a terminal window.

1. Enter the following command to run your Playwright test suite on remote browsers and publish test results to your workspace.

    ```bash
    npx playwright test --config=playwright.service.config.ts --workers=20
    ```

    After the test completes, you can view the test status in the terminal.

    ```output
    Running 600 tests using 20 workers
        600 passed (3m)
    
    Test report: https://playwright.microsoft.com/workspaces/<workspace-id>/runs/<run-id>
    ```

### View test runs and results in the Playwright portal

You can now troubleshoot the failed test cases in the Playwright portal.


[!INCLUDE [View test runs and results in the Playwright portal](./includes/include-playwright-portal-view-test-results.md)]


> [!TIP]
> You can use Microsoft Playwright Testing service features independently. You can publish test results to the portal without using the cloud-hosted browsers feature and you can also use only cloud-hosted browsers to expedite your test suite without publishing test results. 

> [!NOTE]
> The test results and artifacts that you publish are retained on the service for 90 days. After that, they are automatically deleted.  



## Next steps

> [!div class="nextstepaction"]

- [Set up continuous end-to-end testing in CI/CD](./quickstart-automate-end-to-end-testing.md)
- [Explore service configuration options](./how-to-use-service-config-file.md)
- [Determine the optimal test suite configuration](./concept-determine-optimal-configuration.md)