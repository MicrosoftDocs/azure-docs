---
title: 'Tutorial: Set up continuous end-to-end testing'
titleSuffix: Microsoft Playwright Testing
description: In this tutorial, you learn how to set up continuous end-to-end testing with GitHub Actions and Microsoft Playwright Testing.
services: playwright-testing
ms.service: playwright-testing
ms.author: nicktrog
author: ntrogh
ms.date: 06/27/2022
ms.topic: tutorial
---

# Tutorial: Set up continuous end-to-end testing with GitHub Actions and Microsoft Playwright Testing Preview

In this tutorial, you'll learn how to set up continuous end-to-end testing with GitHub Actions and Microsoft Playwright Testing Preview. Create a CI/CD pipeline to trigger Playwright tests with every code push. You'll then use the CI/CD logs and the Microsoft Playwright Testing portal to diagnose failing tests.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Create an access token in Microsoft Playwright Testing.
> * Create a GitHub Actions workflow.
> * Trigger tests from CI/CD on every code push.
> * Analyze test results using GitHub Actions logs.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Set up the sample repository

The sample repository contains Playwright tests and the configuration settings to run these tests with Microsoft Playwright Testing.

1. Open a browser and go to the [sample GitHub repository](https://github.com/microsoft/playwright-service-preview).

1. Select **Fork** to fork the sample application's repository to your GitHub account.

    :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/fork-github-repo.png" alt-text="Screenshot that shows the button to fork the sample application's GitHub repo.":::

## Authenticate with private npm repository

To run tests with Microsoft Playwright Testing, you use the `@microsoft/playwright-service` npm package. This package resides in a private package registry.

To authenticate your GitHub user account with the private repository, follow these steps:

1. Create a [GitHub personal access token (PAT)](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) for your account.

    The token should have the `read:packages` permission.

    :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/access-token-permissions.png" alt-text="Screenshot that shows the access token permissions.":::

    > [!IMPORTANT]
    > After generating the token, make sure to copy the token value, as you won't see it again.

1. If your organization requires SAML SSO for GitHub, authorize your personal access token to use SSO.

    1. Go to your [Personal access tokens](https://github.com/settings/tokens) page.
    1. Select **[Configure SSO](https://docs.github.com/en/enterprise-cloud@latest/authentication/authenticating-with-saml-single-sign-on/authorizing-a-personal-access-token-for-use-with-saml-single-sign-on)** to the right of the token.
    1. Select your organization from the list to authorize SSO.

1. Create a GitHub secret *PLAYWRIGHT_SERVICE_PACKAGE_GITHUB_TOKEN* in the sample repository, and set its value to the access token you copied previously.
    
    The CI/CD workflow uses the secret to authenticate with the private npm repository.

    1. In your forked repository, select **Settings > Secrets > Actions > New repository secret**.
    1. Enter *PLAYWRIGHT_SERVICE_PACKAGE_GITHUB_TOKEN* for the **Name**, and paste the access token value that you copied previously, for the **Value**. Then, select **Add secret**.

        :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/create-secret-npm-repository.png" alt-text="Screenshot that shows the page to add a GitHub secret for the private npm repository access token.":::

## Authenticate with Microsoft Playwright Testing

Set up an access key to authenticate with Microsoft Playwright Testing.

1. Open the [Playwright portal](https://dashboard.playwright-ppe.io/) and sign in with your GitHub username and password.

1. Access the **Settings > Access Token** menu in the top-right of the screen.

    :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/access-token-menu.png" alt-text="Screenshot that shows the Access Token menu in the Playwright portal.":::

1. Select **Generate a new token**.

1. Enter a **Token name**, select an **Expiration** duration, and then select **Generate Token**.

    :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/create-access-token.png" alt-text="Screenshot that shows the New access token page in the Playwright portal.":::

1. In the list of access tokens, select **Copy** to copy the generated token value.

    :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/copy-access-token-value.png" alt-text="Screenshot that shows how to copy the access token functionality in the Playwright portal.":::
    
    > [!IMPORTANT]
    > After generating the token, make sure to copy the token value, as you won't see it again.

1. Create a GitHub secret *ACCESS_KEY* in the sample repository, and set its value to the Microsoft Playwright Testing access token you copied previously.
    
    The CI/CD workflow uses the secret to authenticate with the Microsoft Playwright Testing for running the tests.

    1. In your forked repository, select **Settings > Secrets > Actions > New repository secret**.
    1. Enter *ACCESS_KEY* for the **Name**, and paste the access token value that you copied previously, for the **Value**. Then, select **Add secret**.

        :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/create-secret-playwright-testing.png" alt-text="Screenshot that shows the page to add a GitHub secret for Microsoft Playwright Testing access token.":::

## Create a GitHub Actions workflow

To run your end-to-end tests with every source code change in the repository, create a GitHub Actions workflow that triggers on every push. This workflow performs the following steps:

1. Check out the source code onto the CI/CD agent, and set up Node.js.
1. Install all dependencies for running the tests. This step uses the `PLAYWRIGHT_SERVICE_PACKAGE_GITHUB_TOKEN` secret to authenticate with the private npm repository.
1. Run the Playwright tests with Microsoft Playwright Testing. This step uses the `ACCESS_KEY` secret to authenticate with the service.

Perform to following steps to create the GitHub Actions workflow:

1. In your forked repository, select **Actions**, and then select **New workflow**.

      :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/create-github-actions-workflow.png" alt-text="Screenshot that shows Actions page in GitHub, highlighting the New workflow button.":::

1. Select **set up a workflow yourself**, to create a new workflow.

1. Replace the default workflow code with below code snippet:

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
          # Checks-out your repository
          - uses: actions/checkout@v3
    
          - name: Setup Node.js environment
            uses: actions/setup-node@v3.3.0
    
          - name: Install Dependencies
            run: |
              npm set //npm.pkg.github.com/:_authToken ${{ secrets.PLAYWRIGHT_SERVICE_PACKAGE_GITHUB_TOKEN }}
              npm i
            
          - name: Run Playwright Tests
            run: |
             npm run test
            env:
                # Access Key for Playwright Service
                 ACCESS_KEY: ${{secrets.ACCESS_KEY}}
                 # Group Id for Playwright Test. Please change it to reflect the dashboard name
                 DASHBOARD: '<my-dashboard-name>'
                 WORKERS: 10
    ```

1. Replace the text placeholder `<my-dashboard-name>` with your dashboard name. 

    You can use dashboards to group test results in the Microsoft Playwright Testing portal.

    ```yml
    DASHBOARD: '<my-dashboard-name>'
    ```

1. Select **Start commit** to commit the GitHub Actions workflow to your repository.

    After you commit the changes, the workflow starts and runs the Playwright tests with Microsoft Playwright Testing.
    
    :::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/new-workflow-commit.png" alt-text="Screenshot that shows how to commit the new GitHub Actions workflow file on the GitHub page.":::

## Analyze results

After the tests finish, the GitHub Actions log enables you to analyze the test run. The log provides the following information:

- The number of tests that passed or failed.
- The list of tests that failed.
- Detailed error information to diagnose failing tests.
- The list of tests that ran slowly, that you might optimize.
- A direct link to the test run results in the Microsoft Playwright Testing portal.

:::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/github-actions-playwright-log.png" alt-text="Screenshot that shows the GitHub Actions log output for running tests with Microsoft Playwright Testing.":::

### Diagnose failing tests

You notice that some tests failed. Microsoft Playwright Testing provides rich error information in the CI/CD output log to help diagnose failing tests:

- Browser configuration and line number in the test specification file.
- Error message with the received and expected values.
- Playwright call log.
- Extract of the test source code.

:::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/github-actions-playwright-log-error-details.png" alt-text="Screenshot that shows Playwright test error details in the GitHub Actions log output.":::

Optionally, you can select the link to go the Microsoft Playwright Testing portal for further analysis of the test run. For more information, see [Tutorial: Identify app issues with end-to-end tests](./tutorial-identify-issues-with-end-to-end-web-tests.md).

:::image type="content" source="./media/tutorial-automate-end-to-end-testing-with-github-actions/playwright-testing-dashboard-failed-tests.png" alt-text="Screenshot that shows the list of failing tests in the Microsoft Playwright Testing portal.":::

In log output, you can see that the `Should persist its data` test expected a value of *Something* as the second item in the todo list after the page reload. However, the application contains *feed the cat*.

## Update failing test and rerun tests

Now that you've identified the root cause of the failed tests, you'll update the test specification file.

1. Go to your forked repository.
1. Open the `todo-persistence.spec.ts` file in the `samples/PlaywrightTestRunner/tests` folder.
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

As you continue to make application code changes or update your test specifications, the tests will trigger automatically and give you continuous feedback about your application quality.

<!-- ## Clean up resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)] -->

## Next steps

You've successfully set up a continuous end-to-end testing workflow with GitHub Actions and Microsoft Playwright Testing. 

- Learn more about [running cross-platform tests](./how-to-cross-platform-tests.md).
- Learn more about [managing workspaces in the Azure portal](./how-to-manage-workspace-in-azure-portal.md).
