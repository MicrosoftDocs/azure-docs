---
title: 'Tutorial: Set up continuous end-to-end testing'
titleSuffix: Microsoft Playwright Testing
description: In this tutorial, you learn how to set up continuous end-to-end testing with GitHub Actions and Microsoft Playwright Testing.
services: playwright-testing
ms.service: playwright-testing
ms.author: nicktrog
author: ntrogh
ms.date: 08/17/2022
ms.topic: tutorial
---

# Tutorial: Set up continuous end-to-end testing with GitHub Actions and Microsoft Playwright Testing Preview

In this tutorial, you'll learn how to set up continuous end-to-end testing with GitHub Actions and Microsoft Playwright Testing Preview. Analyze failing tests by using the test diagnostics information directly within GitHub Actions.

In this tutorial, you won't be writing Playwright test specifications and fork a sample repository. You'll learn how to do the following tasks:

> [!div class="checklist"]
> * Set up the sample repository.
> * Create a GitHub secret to authenticate with Microsoft Playwright Testing.
> * Create a GitHub Actions workflow.
> * Trigger tests from CI/CD on every code push.
> * Explore test results in GitHub Actions.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* A GitHub account where you can create a repository. If you don't have one, you can [create one for free](https://github.com/).

## Set up the sample repository

The sample repository contains Playwright tests and the configuration settings to run these tests with Microsoft Playwright Testing.

1. Open a browser and go to the [sample GitHub repository](https://github.com/microsoft/playwright-service-preview).

1. Select **Fork** to fork the sample application's repository to your GitHub account.

    :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/fork-github-repo.png" alt-text="Screenshot that shows the button to fork the sample application's GitHub repo.":::

## Configure GitHub secret

To securely use the Microsoft Playwright Testing access key in your GitHub Actions workflow, create a GitHub secret.

1. In your forked GitHub repository, select **Settings > Secrets > Actions > New repository secret**.

1. Enter the secret details, and then select **Add secret** to create the CI/CD secret.

    | Parameter | Value |
    | ----------- | ------------ |
    | **Name** | *ACCESS_KEY* |  
    | **Value** | Paste the workspace access key. Follow these steps to [create an access key](./how-to-manage-access-keys.md#create-an-access-key). |

    :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/create-secret-playwright-testing.png" alt-text="Screenshot that shows the page to add a GitHub secret for Microsoft Playwright Testing access key.":::

## Create a GitHub Actions workflow

You'll now create a GitHub Actions workflow that runs your Playwright tests with every code change. This workflow performs the following steps:

1. Check out the source code onto the CI/CD agent, and set up Node.js.
1. Install all dependencies for running the tests.
1. Run the Playwright tests with Microsoft Playwright Testing. This step uses the `ACCESS_KEY` CI/CD secret to authenticate with the service.

1. In your forked repository, select **Actions**, and then select **New workflow**.

      :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/create-github-actions-workflow.png" alt-text="Screenshot that shows Actions page in GitHub, highlighting the New workflow button.":::

1. Select **set up a workflow yourself**, to create a new workflow.

1. Replace the default workflow code with below code snippet:

    * Trigger on every code push to the `main` branch, or when started manually.
    * Check out the source code onto the CI/CD agent, and set up Node.js.
    * Install all npm package dependencies for running the Playwright tests.
    * Use the CLI to run the Playwright tests with Microsoft Playwright Testing. This step uses the `ACCESS_KEY` secret to authenticate with the service.

    ```yml
    name: Run end-to-end tests with Microsoft Playwright Testing
    
    # Controls when the workflow will run
    on:
      # Triggers the workflow on push events but only for the "main" branch
      push:
        branches: [ "main" ]
    
      # Allows you to run this workflow manually from the Actions tab
      workflow_dispatch:
    
    jobs:
      test:
        defaults:
          run:
            working-directory: samples/PlaywrightTestRunner
        name: Run e2e tests
        runs-on: ubuntu-latest
    
        # Steps represent a sequence of tasks that will be executed as part of the job
        steps:
          - uses: actions/checkout@v3
    
          - name: Setup Node.js environment
            uses: actions/setup-node@v3.3.0
    
          - name: Install Dependencies
            run: |
              npm i
            
          - name: Run Playwright Tests
            run: |
             npm run test
            env:
                # Access key for Microsoft Playwright Testing
                ACCESS_KEY: ${{secrets.ACCESS_KEY}}
    ```

1. Optionally, configure the `DASHBOARD` environment variable with your dashboard name.

    You can use dashboards to group test results in the Microsoft Playwright Testing portal.

    ```yml
    - name: Run Playwright tests
      run: |
        npm run test
      env:
          # Access Key for Microsoft Playwright Testing
          ACCESS_KEY: ${{secrets.ACCESS_KEY}}
          # Dashboard name used for grouping test results in the portal
          DASHBOARD: '<my-dashboard-name>'
    ```

1. Select **Start commit** to commit the GitHub Actions workflow to your repository.

    After you commit the changes, the workflow starts and runs the Playwright tests with Microsoft Playwright Testing.
    
    :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/new-workflow-commit.png" alt-text="Screenshot that shows how to commit the new GitHub Actions workflow file on the GitHub page.":::

## Explore test results in GitHub Actions

Microsoft Playwright Testing provides rich error information to enable you to diagnose failing tests straight from your CI/CD pipeline. 

After the tests finish, you notice that the GitHub Actions workflow failed because multiple tests didn't pass.

1. Select **Actions** in your GitHub repository, and then select the Microsoft Playwright Testing workflow run.

    :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/github-actions-workflow.png" alt-text="Screenshot that shows the GitHub Actions tab in GitHub.":::

1. Use the GitHub Actions summary for an overview of all failing tests and error details.

    :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/github-actions-summary.png" alt-text="Screenshot that shows the Playwright test results in the GitHub Actions summary view.":::

1. Optionally, access the Microsoft Playwright Testing portal directly by using the links in the summary view.

    You can view the entire test run or access an individual test result.

    :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/github-actions-summary-portal-links.png" alt-text="Screenshot that shows Playwright portal links in the GitHub Actions summary.":::

    For more information about using the Microsoft Playwright Testing portal, see [Tutorial: Identify app issues with end-to-end tests](./tutorial-identify-issues-with-end-to-end-web-tests.md).

1. To get detailed results of all tests, open the GitHub Actions log.

    :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/github-actions-playwright-log.png" alt-text="Screenshot that shows the Playwright test results in the GitHub Actions log view.":::

## Fix the test specification and rerun tests

Notice that some tests have failed. From the GitHub Actions summary view, you can identify which tests have failed. The error details provide more information about the root cause of the failure.

You'll now update the `todo-persistence.spec.ts` test specification file to correct a bug in the test:

1. Go to your forked repository on [GitHub](https://github.com).
1. Open the `todo-persistence.spec.ts` file in the `samples/PlaywrightTestRunner/tests` folder.

    :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/github-open-file.png" alt-text="Screenshot that shows the files in the forked GitHub repository, highlighting the failing test specification file.":::

1. Select the **Edit this file** icon.

    :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/github-edit-file.png" alt-text="Screenshot that shows the Edit this file functionality in GitHub.":::

1. Replace lines 32 and 33 with the following text:

    ```typescript
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
    await expect(todoItems).toHaveClass(['completed', '']);
    ```

1. Select **Commit changes** to commit the file changes to your repository.

    After you commit the changes, the GitHub Actions workflow starts automatically, and all tests are rerun. The CI/CD log now shows the tests are passing.

    :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/github-actions-trigger-by-commit.png" alt-text="Screenshot that shows the running workflow on the GitHub Actions page.":::

As you continue to make application code changes or update your test specifications, you'll get continuous feedback about your application quality.

<!-- ## Clean up resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)] -->

## Next steps

You've successfully set up a continuous end-to-end testing workflow with GitHub Actions and Microsoft Playwright Testing. You used the test diagnostics information in GitHub Actions to fix failing tests.

- Learn more about [running existing tests with Microsoft Playwright Testing](./how-to-run-with-playwright-testing.md).
- Learn more about [running cross-platform tests](./how-to-cross-platform-tests.md).
- Learn more about [testing privately hosted application endpoints](./how-to-test-private-endpoints.md).
- Learn more about [managing workspaces in the Azure portal](./how-to-manage-workspace-in-azure-portal.md).
