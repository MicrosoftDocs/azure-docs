---
title: 'Tutorial: Identify app issues with end-to-end tests'
titleSuffix: Microsoft Playwright Testing
description: In this tutorial, you learn how to identify issues in your web app with cross-platform, cross-browser web UI tests in Microsoft Playwright Testing. Troubleshoot problems by using rich traces, screenshots, and test result artifacts.
services: playwright-testing
ms.service: playwright-testing
ms.author: nicktrog
author: ntrogh
ms.date: 08/16/2022
ms.topic: tutorial
---

# Tutorial: Identify app issues with web UI tests in Microsoft Playwright Testing Preview

Learn how to identify app issues by running web UI tests and using the Microsoft Playwright Testing Preview dashboard to diagnose failing tests. Lower the overall time to complete the tests by scaling out across multiple parallel workers.

Playwright is an open-source framework for end-to-end web UI tests to validate your app across multiple browsers and devices. With Microsoft Playwright Testing you can run Playwrights tests at scale. Use the dashboard to view trends across multiple test runs and use the detailed traces and other artifacts to analyze test results.

In this tutorial, you'll use the sample repository of Playwrights tests. You'll learn how to do the following tasks:

> [!div class="checklist"]
> * Run the sample Playwright tests in the cloud.
> * Explore test results in the Microsoft Playwright Testing portal.
> * Diagnose test failures using test artifacts.
> * Speed up tests by scaling across multiple workers.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- Complete [Quickstart: Run end-to-end web UI tests at scale with Microsoft Playwright Testing](./quickstart-run-end-to-end-tests.md) to create a workspace, download the sample repository, and configure the workspace to use in this tutorial series.
- Visual Studio Code. If you don't have it, [download and install it](https://code.visualstudio.com/Download).

## Run tests

This tutorial will use the Playwright tests from the sample repository, that you configured to run in your Microsoft Playwright Testing workspace. You can use the existing tools and commands to run and debug Playwright tests.

You can run the tests in either of two ways:

- Use Visual Studio Code and the Playwright Test extension.
- Use the Playwright command-line interface (CLI).

Learn more about [running Playwright tests](https://playwright.dev/docs/intro).

### Run tests in Visual Studio Code

To use Visual Studio Code for running Playwright tests in an interactive way:

1. Start Visual Studio Code and open the `playwright-service-preview/samples/PlaywrightTestRunner` folder.
1. Install the [Playwright Test for VSCode extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) from the Visual Studio Code marketplace.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/playwright-extension-install.png" alt-text="Screenshot that shows how to install the Playwright Visual Studio Code extension.":::

1. Open the command palette (press F1 or Ctrl+Shift+P), enter *Playwright*, and then select **Test: Refresh Playwright tests**.

    The **Testing** view now lists all Playwright tests and enables you to run all tests or specify individual tests.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/refresh-playwright-tests.png" alt-text="Screenshot that shows how to refresh Playwright tests using the command palette in Visual Studio Code.":::

    > [!NOTE]
    > If the tests are not showing up, verify that you have set the `accessKey` property in the `playwright.config.ts` file. For more information, see [Configure playwright for Microsoft Playwright Testing](./quickstart-run-end-to-end-tests.md#configure-playwright-for-microsoft-playwright-testing).

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
    Test report: https://dashboard.playwright-ppe.io/playwright-service/Default/987351621824417792    
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
    Test report: https://dashboard.playwright-ppe.io/playwright-service/Default/987351621824417792
    ```

## Explore test results in the portal

After the tests finish, explore the test results in the Microsoft Playwright Testing dashboard. The dashboard shows the historical results of your test runs, and displays the detailed results for each browser-project combination.

You can find a direct link to the test run results in the output log of the test run in Visual Studio Code or the command-line.

1. Open the link to the Microsoft Playwright Testing dashboard in the test output.

1. Sign in with your GitHub credentials.

1. View the test run details.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/playwright-testing-run-details.png" alt-text="Screenshot that shows test run details in the Microsoft Playwright Testing dashboard.":::

    The dashboard shows the results for each test, for each browser configuration, grouped by the test specification file. 

    > [!TIP]
    > You can quickly filter tests based on their test description or the browser configuration. For example, to show only tests that ran on Firefox, enter *Firefox* in the search field.

Notice that not all tests have completed successfully. You'll now use the detailed diagnostics information in the portal to diagnose the failed tests.

## Diagnose failed tests

Microsoft Playwright Testing provides rich diagnostics information as part of the test results.

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

    There's one failing test, which fails across all browser configurations: `should persist its data`.

1. Select one of the failed tests in `todo-persistence.spec.ts` to view the test details and analyze what caused the failure.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/dashboard-failed-test-details.png" alt-text="Screenshot that shows the details of a failed test in the Microsoft Playwright Testing dashboard.":::

    In the example, you notice that there was an unexpected `something` value when running line 32.

1. Select the trace file image in the **Traces** section, to open the web-based Trace Viewer.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/dashboard-view-traces.png" alt-text="Screenshot that shows test run details in the Microsoft Playwright Testing dashboard, highlighting the traces image.":::

    Optionally, you can select the **trace** link to download the trace file, and then use the [Playwright Test Viewer](https://playwright.dev/docs/trace-viewer) application on your local machine.

1. Hover over the timeline at the top to evaluate the application state over time.

    The trace viewer uses the Playwright trace log to enable you to interactively step through the test run timeline and view how the application state changes over time.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/dashboard-web-trace-viewer.png" alt-text="Screenshot that shows the web-based Playwright Trace Viewer in the Microsoft Playwright Testing dashboard.":::

    In the **Calls** pane on the right, you can see the details of why the test failed. The test expected a value of `Something` in the second list item after the page reload. However, the application contains `feed the cat`, as you can see from the application visualization in the center of the screen.

## Fix the test specification and rerun tests

You've identified the root cause of the failing test, namely a bug in the `todo.persistence.spec.ts` Playwright test specification.

1. Open the `todo.persistence.spec.ts` file in your editor to fix the failing test specification.

1. Replace lines 32 and 33 with the following text:

    ```typescript
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
    await expect(todoItems).toHaveClass(['completed', '']);
    ```

1. Rerun the Playwright tests and notice that all tests now complete successfully.

## Scale out your tests

The sample test repository contains 30 tests, which run across five different browser and device configurations. You can speed up your test by running more tests in parallel. In Playwright, the number of workers determines the maximum number of tests that can run in parallel. Microsoft Playwright Testing abstracts the infrastructure to scale out your tests.

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

1. To view all previous test runs, select the dashboard name from the breadcrumb.

    :::image type="content" source="./media/tutorial-identify-issues-with-end-to-end-web-tests/dashboard-test-result-list.png" alt-text="Screenshot that shows the list of test results in the Microsoft Playwright Testing dashboard.":::

    You notice that the test run completes much faster because of the increased number of parallel workers.

<!-- ## Clean up resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)] -->

## Next steps

You've successfully ran Playwright tests with Microsoft Playwright Testing at high scale. You used the dashboard to view how test results evolve over time, and analyzed the detailed test run diagnostics information to diagnose application issues.

Advance to the next tutorial to learn how to set up continuous end-to-end testing.

> [!div class="nextstepaction"]
> [Set up continuous end-to-end testing with GitHub Actions](./tutorial-automate-end-to-end-testing-with-github-actions.md)
