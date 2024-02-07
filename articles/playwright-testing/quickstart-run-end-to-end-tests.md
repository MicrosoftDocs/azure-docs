---
title: 'Quickstart: Run Playwright tests at scale'
description: 'This quickstart shows how to run your Playwright tests with highly parallel cloud browsers using Microsoft Playwright Testing Preview. The cloud-hosted browsers support multiple operating systems and all modern browsers.'
ms.topic: quickstart
ms.date: 10/04/2023
ms.custom: playwright-testing-preview
---

# Quickstart: Run end-to-end tests at scale with Microsoft Playwright Testing Preview

In this quickstart, you learn how to run your Playwright tests with highly parallel cloud browsers using Microsoft Playwright Testing Preview. Use cloud infrastructure to validate your application across multiple browsers, devices, and operating systems.

After you complete this quickstart, you have a Microsoft Playwright Testing workspace to run your Playwright tests at scale.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* Your Azure account needs the [Owner](/azure/role-based-access-control/built-in-roles#owner), [Contributor](/azure/role-based-access-control/built-in-roles#contributor), or one of the [classic administrator roles](/azure/role-based-access-control/rbac-and-directory-admin-roles#classic-subscription-administrator-roles).
* A Playwright project. If you don't have project, create one by using the [Playwright getting started documentation](https://playwright.dev/docs/intro) or use our [Microsoft Playwright Testing sample project](https://github.com/microsoft/playwright-testing-service/tree/main/samples/get-started).

## Create a workspace

To get started with running your Playwright tests at scale on cloud browsers, you first create a Microsoft Playwright Testing workspace in the Playwright portal.

[!INCLUDE [Create workspace in Playwright portal](./includes/include-playwright-portal-create-workspace.md)]

When the workspace creation finishes, you're redirected to the setup guide.

## Create an access token for service authentication

Microsoft Playwright Testing uses access tokens to authorize users to run Playwright tests with the service. You first generate a service access token in the Playwright portal, and then store the value in an environment variable.

To generate the access token, perform the following steps:

1. In the workspace setup guide, in **Create an access token**, select **Generate token**.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/playwright-testing-generate-token.png" alt-text="Screenshot that shows setup guide in the Playwright Testing portal, highlighting the 'Generate token' button." lightbox="./media/quickstart-run-end-to-end-tests/playwright-testing-generate-token.png":::

1. Copy the access token for the workspace.

    You need the access token value for configuring your environment in a later step.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/playwright-testing-copy-access-token.png" alt-text="Screenshot that shows how to copy the generated access token in the Playwright Testing portal." lightbox="./media/quickstart-run-end-to-end-tests/playwright-testing-copy-access-token.png":::

## Configure the service region endpoint

In the service configuration, you have to provide the region-specific service endpoint. The endpoint depends on the Azure region you selected when creating the workspace.

To get the service endpoint URL, perform the following steps:

1. In **Add region endpoint in your setup**, copy the region endpoint for your workspace.

    The endpoint URL matches the Azure region that you selected when creating the workspace.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/playwright-testing-region-endpoint.png" alt-text="Screenshot that shows how to copy the workspace region endpoint in the Playwright Testing portal." lightbox="./media/quickstart-run-end-to-end-tests/playwright-testing-region-endpoint.png":::

## Set up your environment

To set up your environment, you have to configure the `PLAYWRIGHT_SERVICE_ACCESS_TOKEN` and `PLAYWRIGHT_SERVICE_URL` environment variables with the values you obtained in the previous steps.

We recommend that you use the `dotenv` module to manage your environment. With `dotenv`, you define your environment variables in the `.env` file.

1. Add the `dotenv` module to your project:

    ```shell
    npm i --save-dev dotenv
    ```

1. Create a `.env` file alongside the `playwright.config.ts` file in your Playwright project:

    ```
    PLAYWRIGHT_SERVICE_ACCESS_TOKEN={MY-ACCESS-TOKEN}
    PLAYWRIGHT_SERVICE_URL={MY-REGION-ENDPOINT}
    ```

    Make sure to replace the `{MY-ACCESS-TOKEN}` and `{MY-REGION-ENDPOINT}` text placeholders with the values you copied earlier.

> [!CAUTION]
> Make sure that you don't add the `.env` file to your source code repository to avoid leaking your access token value.

## Add a service configuration file

To run your Playwright tests in your Microsoft Playwright Testing workspace, you need to add a service configuration file alongside your Playwright configuration file. The service configuration file references the environment variables to get the workspace endpoint and your access token.

To add the service configuration to your project:

1. Create a new file `playwright.service.config.ts` alongside the `playwright.config.ts` file.

    Optionally, use the `playwright.service.config.ts` file in the [sample repository](https://github.com/microsoft/playwright-testing-service/blob/main/samples/get-started/playwright.service.config.ts).

1. Add the following content to it:

    :::code language="typescript" source="~/playwright-testing-service/samples/get-started/playwright.service.config.ts":::

1. Save the file.

## Run your tests at scale with Microsoft Playwright Testing

You've now prepared the configuration for running your Playwright tests in the cloud with Microsoft Playwright Testing. You can either use the Playwright CLI to run your tests, or use the [Playwright Test Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright).

### Run a single test at scale

With Microsoft Playwright Testing, you get charged based on the number of total test minutes. If you're a first-time user or [getting started with a free trial](./how-to-try-playwright-testing-free.md), you might start with running a single test at scale instead of your full test suite to avoid exhausting your free test minutes.

After you validate that the test runs successfully, you can gradually increase the test load by running more tests with the service.

Perform the following steps to run a single Playwright test with Microsoft Playwright Testing:

# [Playwright CLI](#tab/playwrightcli)

To use the Playwright CLI to run your tests with Microsoft Playwright Testing, pass the service configuration file as a command-line parameter.

1. Open a terminal window.

1. Enter the following command to run your Playwright test on remote browsers in your workspace:

    Replace the `{name-of-file.spec.ts}` text placeholder with the name of your test specification file.

    ```bash
    npx playwright test {name-of-file.spec.ts} --config=playwright.service.config.ts
    ```

    After the test completes, you can view the test status in the terminal.

    ```output
    Running 1 test using 1 worker
        1 passed (2.2s)
    
    To open last HTML report run:
    
    npx playwright show-report
    ```

# [Visual Studio Code](#tab/vscode)

To run a single Playwright test in Visual Studio Code with Microsoft Playwright Testing, select the service configuration file in the **Test Explorer** view. Then select and run the test from the list of tests.

1. Install the [Playwright Test Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright).

1. Open the **Test Explorer** view in the activity bar.

    The test explorer automatically detects your Playwright tests and the service configuration in your project.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/visual-studio-code-test-explorer.png" alt-text="Screenshot that shows the Test Explorer view in Visual Studio Code, which lists the Playwright tests." lightbox="./media/quickstart-run-end-to-end-tests/visual-studio-code-test-explorer.png":::

1. Select **Select Default Profile**, and then select your default projects from the service configuration file.

    Notice that the service run profiles are coming from the `playwright.service.config.ts` file you added previously.

    By setting a default profile, you can automatically run your tests with the service, or run multiple Playwright projects simultaneously.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/visual-studio-code-choose-run-profile.png" alt-text="Screenshot that shows the menu to choose a run profile for your tests, highlighting the projects from the service configuration file." lightbox="./media/quickstart-run-end-to-end-tests/visual-studio-code-choose-run-profile.png":::

1. From the list of tests, select the **Run test** button next to a test to run it.

    The test runs on the projects you selected in the default profile. If you selected one or more projects from the service configuration, the test runs on remote browsers in your workspace.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/visual-studio-code-run-test.png" alt-text="Screenshot that shows how to run a single test in Visual Studio Code." lightbox="./media/quickstart-run-end-to-end-tests/visual-studio-code-run-test.png":::

    > [!TIP]
    > You can still debug your test code when you run your tests on remote browsers by using the **Debug test** button.

1. You can view the test results directly in Visual Studio Code.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/visual-studio-code-test-results.png" alt-text="Screenshot that shows the Playwright test results in Visual Studio Code." lightbox="./media/quickstart-run-end-to-end-tests/visual-studio-code-test-results.png":::

---

You can now run multiple tests with the service, or run your entire test suite on remote browsers.

> [!CAUTION]
> Depending on the size of your test suite, you might incur additional charges for the test minutes beyond your allotted free test minutes.

### Run a full test suite at scale

Now that you've validated that you can run a single test with Microsoft Playwright Testing, you can run a full Playwright test suite at scale.

Perform the following steps to run a full Playwright test suite with Microsoft Playwright Testing:

# [Playwright CLI](#tab/playwrightcli)

When you run multiple Playwright tests or a full test suite with Microsoft Playwright Testing, you can optionally specify the number of parallel workers as a command-line parameter.

1. Open a terminal window.

1. Enter the following command to run your Playwright test suite on remote browsers in your workspace:

    ```bash
    npx playwright test --config=playwright.service.config.ts --workers=20
    ```

    Depending on the size of your test suite, this command runs your tests on up to 20 parallel workers.

    After the test completes, you can view the test status in the terminal.

    ```output
    Running 6 tests using 6 workers
        6 passed (18.2s)
    
    To open last HTML report run:
    
        npx playwright show-report
    ```

# [Visual Studio Code](#tab/vscode)

To run your Playwright test suite in Visual Studio Code with Microsoft Playwright Testing:

1. Open the **Test Explorer** view in the activity bar.

1. Select the **Run tests** button to run all tests with Microsoft Playwright Testing.

    When you run all tests, the default profile is used. In the previous step, you configured the default profile to use projects from the service configuration.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/visual-studio-code-run-all-tests.png" alt-text="Screenshot that shows how to run all tests in Visual Studio Code." lightbox="./media/quickstart-run-end-to-end-tests/visual-studio-code-run-all-tests.png":::

    > [!TIP]
    > You can still debug your test code when you run your tests on remote browsers by using the **Debug tests** button.

1. Alternately, you can select a specific service configuration from the list to only run the tests for a specific browser configuration.

    :::image type="content" source="./media/quickstart-run-end-to-end-tests/visual-studio-code-run-all-tests-select-project.png" alt-text="Screenshot that shows how to run all tests for a specific browser configuration, by selecting the project in Visual Studio Code." lightbox="./media/quickstart-run-end-to-end-tests/visual-studio-code-run-all-tests-select-project.png":::

1. You can view all test results in the **Test results** tab.

---

## View test runs in the Playwright portal

Go to the [Playwright portal](https://aka.ms/mpt/portal) to view the test run metadata and activity log for your workspace.

:::image type="content" source="./media/quickstart-run-end-to-end-tests/playwright-testing-activity-log.png" alt-text="Screenshot that shows the activity log for a workspace in the Playwright Testing portal." lightbox="./media/quickstart-run-end-to-end-tests/playwright-testing-activity-log.png":::

The activity log lists for each test run the following details: the total test completion time, the number of parallel workers, and the number of test minutes.

## Optimize parallel worker configuration

Once your tests are running smoothly with the service, experiment with varying the number of parallel workers to determine the optimal configuration that minimizes test completion time.

With Microsoft Playwright Testing, you can run with up to 50 parallel workers. Several factors influence the best configuration for your project, such as the CPU, memory, and network resources of your client machine, the target application's load-handling capacity, and the type of actions carried out in your tests.

You can specify the number of parallel workers on the Playwright CLI command-line, or configure the `workers` property in the Playwright service configuration file.

Learn more about how to [determine the optimal configuration for optimizing test suite completion](./concept-determine-optimal-configuration.md).

## Next step

You've successfully created a Microsoft Playwright Testing workspace in the Playwright portal and run your Playwright tests on cloud browsers.

Advance to the next quickstart to set up continuous end-to-end testing by running your Playwright tests in your CI/CD workflow.

> [!div class="nextstepaction"]
> [Set up continuous end-to-end testing in CI/CD](./quickstart-automate-end-to-end-testing.md)
