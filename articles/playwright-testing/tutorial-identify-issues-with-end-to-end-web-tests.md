---
title: 'Tutorial: Identify app issues with end-to-end tests'
titleSuffix: Microsoft Playwright Testing
description: In this tutorial, you learn how to identify issues in your web app with cross-platform, cross-browser end-to-end tests in Microsoft Playwright Testing. Troubleshoot problems by using rich traces, screenshots, and test result artifacts.
services: playwright-testing
ms.service: playwright-testing
ms.author: nicktrog
author: ntrogh
ms.date: 06/21/2022
ms.topic: tutorial
---

# Tutorial: Identify app issues with end-to-end tests in Microsoft Playwright Testing Preview

In this tutorial, learn how to identify application issues by running end-to-end tests at scale with Microsoft Playwright Testing Preview. You'll use the Playwright Visual Studio Code extension to run your tests.

You'll run a series of Playwright end-to-end tests in the cloud to validate the correctness of your application across multiple browsers and devices. Use the Microsoft Playwright Testing dashboard to diagnose failing tests using traces and other test artifacts. Finally, speed up the test execution by scaling out the number of workers.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Create an access token.
> * Connect tests to Microsoft Playwright Testing.
> * Run cross-browser & cross-device tests.
> * Diagnose test failures in the portal.
> * Speed up tests by scaling out.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* Access to Microsoft Playwright Testing preview.
* Visual Studio Code. If you don't have it, [download and install it](https://code.visualstudio.com/Download).
* Git. If you don't have it, [download and install it](https://git-scm.com/download).

## Download the sample repository

In this tutorial, you'll use a sample Playwright end-to-end test suite that is configured to connect to Microsoft Playwright Testing. The test suite validates a sample React web application.

Clone the sample repository to your workstation:

1. Open your favorite terminal.
1. Navigate to the directory in which you'd like to download the sample repository.
1. Clone the sample repository:

    ```bash
    git clone https://github.com/microsoft/playwright-service-preview
    ```

1. Navigate to the sample directory:

    ```bash
    cd playwright-service-preview/samples/PlaywrightTestRunner
    ```

## Authenticate with private npm repository

To run tests with Microsoft Playwright Testing, you use the `@microsoft/playwright-service` npm package. This package resides in a private package registry.

To authenticate your GitHub user account with the private repository, follow these steps:

1. Create a [GitHub personal access token (PAT)](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) for your account.

    The token should have the `read:packages` permission.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/access-token-permissions.png" alt-text="Screenshot that shows the access token permissions.":::

    > [!IMPORTANT]
    > After generating the token, make sure to copy the token value, as you won't see it again.

1. If your organization requires SAML SSO for GitHub, authorize your personal access token to use SSO.

    1. Go to your [Personal access tokens](https://github.com/settings/tokens) page.
    1. Select **[Configure SSO](https://docs.github.com/en/enterprise-cloud@latest/authentication/authenticating-with-saml-single-sign-on/authorizing-a-personal-access-token-for-use-with-saml-single-sign-on)** to the right of the token.
    1. Select your organization from the list to authorize SSO.

1. Authenticate with the private npm registry to enable you to download the latest `@microsoft/playwright-service` package when you run `npm install`:

   ```bash
   npm login --scope=@microsoft --registry=https://npm.pkg.github.com
   ```

   Provide your GitHub username, password and email address. For the password, paste the value of the token you created in the earlier step.

You can now install all the package dependencies in your local directory:

  ```bash
  npm install
  ```

> [!NOTE]
> If you get an **E403 Forbidden** error, this means that the token is not authorized or has expired.
> Verify that your [personal access token](https://github.com/settings/tokens) has not expired. Validate also that you have authorized SSO, as described earlier.

## Create an access token

Set up an access key to authenticate with Playwright Service.

1. Open the [Playwright portal](https://dashboard.playwright-ppe.io/) and sign in with your GitHub username and password.

    1. Access the **Settings > Access Token** menu in the top-right of the screen.

        :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/access-token-menu.png" alt-text="Screenshot that shows the Access Token menu in the Playwright portal.":::
        
    1. Select **Generate a new token**.

    1. Enter a **Token name**, select an **Expiration** duration, and then select **Generate Token**.

        :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/create-access-token.png" alt-text="Screenshot that shows the New access token page in the Playwright portal.":::

1. In the list of access tokens, select **Copy** to copy the generated token value.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/copy-access-token-value.png" alt-text="Screenshot that shows how to copy the access token functionality in the Playwright portal.":::
    
    > [!NOTE]
    > You can't retrieve the token value afterwards. If you didn't copy the value after the token was created, you'll have to create a new token.

## Configure Playwright for Microsoft Playwright Testing

The `playwright.config.ts` file contains the Playwright configuration settings. The `@microsoft/playwright-service` npm package contains the `PlaywrightService` class to connect Playwright to Microsoft Playwright Testing. The tests in the sample repository are already preconfigured to use Microsoft Playwright Testing.

Microsoft Playwright Testing uses an access token as an authorization mechanism. Specify the access token you created earlier to connect to your account.

Optionally, you can also set a dashboard name to group your test runs in the Microsoft Playwright Testing portal. By default, all test runs are grouped in the `Default Group` dashboard.

If you run your tests from the command-line, create environment variables on your machine to set the access token and dashboard name.

* Bash:

    ```bash
    export ACCESS_KEY='<my-token-value>'
    export DASHBOARD='<my-dashboard-name>'
    ```

* PowerShell:

    ```Powershell
    $env:ACCESS_KEY = '<my-token-value>'
    $env:DASHBOARD = '<my-dashboard-name>'
    ```

Alternately, you can set the values of the `accessKey` and `dashboard` properties directly in `playwright.config.ts`:

```typescript
var playwrightServiceConfig = new PlaywrightService({
  accessKey: "<my-token-value>"
  dashboard: "<my-dashboard-name>"
});
```

## Run tests across multiple browsers

In the Playwright configuration file, you can specify the different [browser configurations](https://playwright.dev/docs/test-configuration#multiple-browsers) and operating systems to run your tests for. Microsoft Playwright Testing enables you to run your tests across multiple browsers, device configurations, and operating systems. 

Use the `projects` node in the Playwright configuration file to provide the list of browser configurations. The following code snippet shows the browser configurations in the sample tests.

```typescript
// playwright.config.ts

const config: PlaywrightTestConfig = {
  ...

  projects: [
    {
      name: 'chromium-on-ubuntu',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    {
      name: 'firefox-on-ubuntu',
      use: {
        ...devices['Desktop Firefox'],
      },
    },

    {
      name: 'webkit-on-ubuntu',
      use: {
        ...devices['Desktop Safari'],
      },
    },
    {
      name: "iPhone 13 Pro Max landscape",
      use: {
        ...devices['iPhone 13 Pro Max landscape'],
        browserName: "chromium",
      },
    },
    {
      name: "Galaxy S9+",
      use: {
        ...devices["Galaxy S9+"],
      },
    },
  ],
};
```

## Run tests

Now that you've configured your Playwright tests to connect to Microsoft Playwright Testing, you can run the tests. You can start the test in either of two ways:

- Use Visual Studio Code and the Playwright Test extension.
- Use the Playwright command-line interface (CLI).

### Run tests in Visual Studio Code

To use Visual Studio Code for running Playwright tests in an interactive way:

1. Start Visual Studio Code and open the `playwright-service-preview/samples/PlaywrightTestRunner` folder.
1. Install the [Playwright Test for VSCode extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) from the Visual Studio Code marketplace.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/playwright-extension-install.png" alt-text="Screenshot that shows how to install the Playwright Visual Studio Code extension.":::

1. Open the command palette (press F1 or Ctrl+Shift+P), enter *Playwright*, and then select **Test: Refresh Playwright tests**.

    The **Testing** view now lists all Playwright tests and enables you to run all tests or specify individual tests.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/refresh-playwright-tests.png" alt-text="Screenshot that shows how to refresh Playwright tests using the command palette in Visual Studio Code.":::

    > [!NOTE]
    > If the tests are not showing up, verify that you have set the `accessKey` property in the `playwright.config.ts` file. For more information, see [Configure playwright for Microsoft Playwright Testing](#configure-playwright-for-microsoft-playwright-testing).

1. Open the **Testing** view from the side bar, and then select **Run Tests** to run all tests.

    Playwright will now connect to Microsoft Playwright Testing to run the tests across all browser configurations.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/playwright-run-all-tests.png" alt-text="Screenshot that shows the Playwrights tests in the Testing view in Visual Studio Code and how to run all tests.":::

    When the tests finish, you'll see a checkmark or cross next to indicate whether the test passed or failed.

1. Select **Show Output** to view the test output log.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/show-test-output.png" alt-text="Screenshot that shows the test management buttons in the Testing view in Visual Studio Code, highlighting the Show output button.":::

    At the end of the output, there's a link to the Microsoft Playwright Testing dashboard for this test run.

    ```bash
    ...
    5 failed
      [chromium-on-ubuntu] › todo-persistence.spec.ts:16:3 › Persistence › should persist its data ===
      [firefox-on-ubuntu] › todo-persistence.spec.ts:16:3 › Persistence › should persist its data ====
      [webkit-on-ubuntu] › todo-persistence.spec.ts:16:3 › Persistence › should persist its data =====
      [iPhone 13 Pro Max landscape] › todo-persistence.spec.ts:16:3 › Persistence › should persist its data 
      [Galaxy S9+] › todo-persistence.spec.ts:16:3 › Persistence › should persist its data ===========
  
      145 passed (2m)
    Test report: https://dashboard.playwright-ppe.io/playwright-service/Default%20Group/987351621824417792    
    ```

### Run tests in the CLI

To run your tests from the command-line with [Playwright Test](https://playwright.dev/docs/intro#command-line):

1. Open a terminal window of your choice.

1. Navigate to the sample directory, and then run all tests with Playwright Test:

    ```bash
    cd playwright-service-preview/samples/PlaywrightTestRunner
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

## Analyze test results and diagnose failures

After the tests finish, you can analyze the test results in the Microsoft Playwright Testing dashboard. The dashboard enables you to view the historical results of your test runs. For each test run, you have the results for each test and project combination. For tests that failed, diagnose the root cause by using the trace viewer, screenshots, and test recording videos.

You can find a direct link to the test run results in the output log of the test run in Visual Studio Code or the command-line. Alternately, you can navigate to the dashboard home page and select your test run.

1. Open the Microsoft Playwright Testing dashboard link in the test output.

1. Sign in with your GitHub credentials.

1. View the test run details.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/playwright-testing-run-details.png" alt-text="Screenshot that shows test run details in the Microsoft Playwright Testing dashboard.":::

    The dashboard shows the results for each test, for each browser configuration, grouped by the test specification file. 

1. Optionally, filter the test list by using the search field.

    You can quickly filter tests based on their test description or the browser configuration. For example, to show only tests that ran on Firefox, enter *Firefox* in the search field.

### Diagnose failed tests

You notice that some tests failed. Microsoft Playwright Testing provides rich information as part of the test results.

| Artifact | Description |
| -------- | ----------- |
| Errors | Information about where in the source code the test failed and what the actual and expected values are. |
| Test steps | Sequence of Playwright test steps and their status. |
| Screenshots | Screenshot of the application at the end of the test. |
| Videos | End-to-end video of the application user interface during the test. |
| Traces | Interactive historical log of the application state and visual representation over time. Allows you to step through the timeline of the test run and view the application state. |

To diagnose the failing tests in the Microsoft Playwright Testing dashboard, perform the following steps:

1. Select the **Failed** filter to view only the failed tests.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/dashboard-filter-failed-tests.png" alt-text="Screenshot that shows how to filter the test list to only show failed tests in the Microsoft Playwright Testing dashboard.":::

1. Select one of the failed tests in `todo-persistence.spec.ts` to view the test details.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/dashboard-failed-test-details.png" alt-text="Screenshot that shows the details of a failed test in the Microsoft Playwright Testing dashboard.":::

    In the example, you notice that there was an unexpected `something` value when running line 32.

1. Select the trace file image in the **Traces** section, to open the web-based Trace Viewer. 

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/dashboard-view-traces.png" alt-text="Screenshot that shows test run details in the Microsoft Playwright Testing dashboard, highlighting the traces image.":::

    > [!NOTE]
    > Optionally, select the download link to download the trace file, and then use the [Playwright Test Viewer](https://playwright.dev/docs/trace-viewer) application on your local machine.

    The trace viewer uses the test traces to enable you to step through the test run timeline. Hover over the timeline at the top to evaluate the application state over time.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/dashboard-web-trace-viewer.png" alt-text="Screenshot that shows the web-based Playwright Trace Viewer in the Microsoft Playwright Testing dashboard.":::

    In the **Calls** pane on the right, you can see the details of why the test failed. The test expected a value of *Something* as the second item in the todo list after the page reload. However, the application contains *feed the cat*, as you can see from the application visualization in the center of the screen.

1. Open the `todo.persistence.spec.ts` file in your editor to fix the failing test specification.

1. Replace lines 32 and 33 with the following text:

    ```typescript
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
    await expect(todoItems).toHaveClass(['completed', '']);
    ```

    The test now correctly validates that the values in the todo list before and after the page reload match.

## Scale out your tests

Microsoft Playwright Testing abstracts the infrastructure to scale out your tests. Previously, you ran your tests across different browsers and devices. You'll now speed up your test run by using the scale of the cloud.

Playwright enables you to run your tests in parallel. In Playwright, the number of workers determines the maximum number of tests that can run in parallel.

1. Increase the number of workers to speed up your test in Microsoft Playwright Testing using either of two ways:

    - Update the `workers` property in the `playwright.config.ts` file to 20, and then rerun your tests.

        ```typescript
        // playwright.config.ts
        
        const config: PlaywrightTestConfig = {
          ...
          workers: 20,
          ...
        };
        ```
        
    - If you run your tests from the command-line, specify the number of workers with the `workers` command-line parameter:

        ```bash
        npx playwright test --workers=20
        ```

1. After the test finishes, open the Microsoft Playwright Testing dashboard link in the test output.

1. To view all your tests, select your dashboard name, or **Default Group** if you didn't override the name, from the breadcrumb.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/dashboard-breadcrumb.png" alt-text="Screenshot that shows breadcrumb navigation in the Microsoft Playwright Testing dashboard.":::

1. View the full history of tests.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/dashboard-test-result-list.png" alt-text="Screenshot that shows the list of test results in the Microsoft Playwright Testing dashboard.":::

    You notice that the test run completes much faster in Microsoft Playwright Testing, because of the increased parallelism and number of workers.

<!-- ## Clean up resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)] -->

## Next steps

You've now created a Microsoft Playwright Testing account and configured your Playwright tests to run at high scale. You used the dashboard to view test runs over time and analyze individual results by using the rich test artifacts.

Advance to the next tutorial to learn how to set up automated end-to-end testing.

> [!div class="nextstepaction"]
> [Automate tests with GitHub Actions](./tutorial-automate-end-to-end-testing-with-github-actions.md)
