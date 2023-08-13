---
title: 'Quickstart: Continuous end-to-end testing'
titleSuffix: Microsoft Playwright Testing
description: In this quickstart, you learn how to run your Playwright tests at scale in your CI pipeline with Microsoft Playwright Testing. Continuously validate that your web app runs correctly across browsers and operating systems.
services: playwright-testing
ms.service: playwright-testing
ms.author: nicktrog
author: ntrogh
ms.topic: quickstart
ms.date: 08/10/2023
---

# Quickstart: Set up continuous end-to-end testing with Microsoft Playwright Testing Preview

In this quickstart, you set up continuous end-to-end testing with Microsoft Playwright Testing Preview to validate that your web app runs correctly across different browsers and operating systems with every code commit. Learn how to add your Playwright tests to a continuous integration (CI) workflow, such as GitHub Actions, Azure Pipelines, or other CI platforms.

After you complete this quickstart, you have a CI workflow that runs your Playwright test suite at scale with Microsoft Playwright Testing.

To run your Playwright tests in your CI/CD workflow, you perform the following tasks:

- Get an access key for Microsoft Playwright Testing
- Add the service configuration file
- Update the CI workflow definition to run your Playwright tests by using the Playwright CLI
- Save the Playwright test results

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* A Microsoft Playwright Testing workspace. Complete the [quickstart: run Playwright tests at scale](./quickstart-run-end-to-end-tests.md) to create a workspace.

# [GitHub Actions](#tab/github)
- A GitHub account. If you don't have a GitHub account, you can [create one for free](https://github.com/).
- A GitHub repository that contains your Playwright test specifications and GitHub Actions workflow. To create a repository, see [Creating a new repository](https://docs.github.com/github/creating-cloning-and-archiving-repositories/creating-a-new-repository).
- A GitHub Actions workflow. If you need help getting started with GitHub Actions, see [create your first workflow](https://docs.github.com/en/actions/quickstart)

# [Azure Pipelines](#tab/pipelines)
- An Azure DevOps organization and project. If you don't have an Azure DevOps organization, you can [create one for free](/azure/devops/organizations/projects/create-project?view=azure-devops&tabs=browser).
- A pipeline definition. If you need help with getting started with Azure Pipelines, see [create your first pipeline](/azure/devops/pipelines/create-first-pipeline?preserve-view=true&view=azure-devops&tabs=java%2Ctfs-2018-2%2Cbrowser).

---

## 1. Configure a service access key

Microsoft Playwright Testing uses access keys to authorize users to run Playwright tests with the service. You can generate an access key in the Microsoft Playwright Testing portal. Next, you specify the access key in the service configuration file by using an environment variable.

Perform the following steps to configure an access key in your CI workflow.

### Generate an access key

1. Sign in to the [Microsoft Playwright Testing portal](https://preview.playwright-int.io/) with your Azure account.
1. Select **Generate new access key**.

    :::image type="content" source="./media/quickstart-automate-end-to-end-testing/playwright-testing-generate-new-access-key.png" alt-text="Screenshot that shows Microsoft Playwright Testing portal, highlighting the 'Generate access key' button.":::

1. Select **Generate key** and then copy the access key value.

    :::image type="content" source="./media/quickstart-automate-end-to-end-testing/playwright-testing-generate-key.png" alt-text="Screenshot that shows setup guide in the Playwright Testing portal, highlighting the 'Generate key' button.":::

    :::image type="content" source="./media/quickstart-automate-end-to-end-testing/playwright-testing-copy-access-key.png" alt-text="Screenshot that shows how to copy the generated access key in the Playwright Testing portal.":::

### Store the access key as a CI workflow secret

The service configuration references the workspace access key by using an environment variable. To avoid passing the access key in clear text in the workflow definition, create a CI workflow secret `PLAYWRIGHT_SERVICE_ACCESS_KEY` to store the access key.

The following steps describe how to create a workflow secret in GitHub Actions or Azure Pipelines. Follow the specific instructions of your CI platform to create store the access key securely.

# [GitHub Actions](#tab/github)

1. Go to your GitHub repository, and select **Settings** > **Secrets and variables** > **Actions**.
1. Select **New repository secret**.
1. Enter the secret details, and then select **Add secret** to create the CI/CD secret.

    | Parameter | Value |
    | ----------- | ------------ |
    | **Name** | *PLAYWRIGHT_SERVICE_ACCESS_KEY* |  
    | **Value** | Paste the workspace access key you copied previously. |

1. Select **OK** to create the workflow secret.

# [Azure Pipelines](#tab/pipelines)

1. Go to your Azure DevOps project.
1. Go to the **Pipelines** page, select the appropriate pipeline, and then select **Edit**.
1. Locate the **Variables** for this pipeline.
1. Add a new variable.
1. Enter the variable details, and then select **Add secret** to create the CI/CD secret.

    | Parameter | Value |
    | ----------- | ------------ |
    | **Name** | *PLAYWRIGHT_SERVICE_ACCESS_KEY* |
    | **Value** | Paste the workspace access key you copied previously. |
    | **Keep this value secret** | Check this value |

1. Select **OK**, and then **Save** to create the workflow secret.

---

## 2. Add service configuration file

## 3. Update workflow definition

- use Playwright cmdline
    - use service config file 
    - specify workers
    - pass env parameters for access key

Mention region affinity here

## 4. Save test results

- Publish as CI workflow artifact
- Azure Pipelines: publish test results


## Create a GitHub Actions workflow

You'll now create a GitHub Actions workflow that runs your Playwright tests with every code change. This workflow performs the following steps:

1. Check out the source code onto the CI/CD agent, and set up Node.js.
1. Install all dependencies for running the tests.
1. Run the Playwright tests with Microsoft Playwright Testing. This step uses the `ACCESS_KEY` CI/CD secret to authenticate with the service.

1. In your forked repository, select **Actions**, and then select **New workflow**.

      :::image type="content" source="./media/quickstart-automate-end-to-end-testing/create-github-actions-workflow.png" alt-text="Screenshot that shows Actions page in GitHub, highlighting the New workflow button.":::

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
    
    :::image type="content" source="./media/quickstart-automate-end-to-end-testing/new-workflow-commit.png" alt-text="Screenshot that shows how to commit the new GitHub Actions workflow file on the GitHub page.":::

## Explore test results in GitHub Actions

Microsoft Playwright Testing provides rich error information to enable you to diagnose failing tests straight from your CI/CD pipeline. 

After the tests finish, you notice that the GitHub Actions workflow failed because multiple tests didn't pass.

1. Select **Actions** in your GitHub repository, and then select the Microsoft Playwright Testing workflow run.

    :::image type="content" source="./media/quickstart-automate-end-to-end-testing/github-actions-workflow.png" alt-text="Screenshot that shows the GitHub Actions tab in GitHub.":::

1. Use the GitHub Actions summary for an overview of all failing tests and error details.

    :::image type="content" source="./media/quickstart-automate-end-to-end-testing/github-actions-summary.png" alt-text="Screenshot that shows the Playwright test results in the GitHub Actions summary view.":::

1. Optionally, access the Microsoft Playwright Testing portal directly by using the links in the summary view.

    You can view the entire test run or access an individual test result.

    :::image type="content" source="./media/quickstart-automate-end-to-end-testing/github-actions-summary-portal-links.png" alt-text="Screenshot that shows Playwright portal links in the GitHub Actions summary.":::

    For more information about using the Microsoft Playwright Testing portal, see [Tutorial: Identify app issues with end-to-end tests](./tutorial-identify-issues-with-end-to-end-tests.md).

1. To get detailed results of all tests, open the GitHub Actions log.

    :::image type="content" source="./media/quickstart-automate-end-to-end-testing/github-actions-playwright-log.png" alt-text="Screenshot that shows the Playwright test results in the GitHub Actions log view.":::

## Fix the test specification and rerun tests

Notice that some tests have failed. From the GitHub Actions summary view, you can identify which tests have failed. The error details provide more information about the root cause of the failure.

You'll now update the `todo-persistence.spec.ts` test specification file to correct a bug in the test:

1. Go to your forked repository on [GitHub](https://github.com).
1. Open the `todo-persistence.spec.ts` file in the `samples/PlaywrightTestRunner/tests` folder.

    :::image type="content" source="./media/quickstart-automate-end-to-end-testing/github-open-file.png" alt-text="Screenshot that shows the files in the forked GitHub repository, highlighting the failing test specification file.":::

1. Select the **Edit this file** icon.

    :::image type="content" source="./media/quickstart-automate-end-to-end-testing/github-edit-file.png" alt-text="Screenshot that shows the Edit this file functionality in GitHub.":::

1. Replace lines 32 and 33 with the following text:

    ```typescript
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
    await expect(todoItems).toHaveClass(['completed', '']);
    ```

1. Select **Commit changes** to commit the file changes to your repository.

    After you commit the changes, the GitHub Actions workflow starts automatically, and all tests are rerun. The CI/CD log now shows the tests are passing.

    :::image type="content" source="./media/quickstart-automate-end-to-end-testing/github-actions-trigger-by-commit.png" alt-text="Screenshot that shows the running workflow on the GitHub Actions page.":::

As you continue to make application code changes or update your test specifications, you'll get continuous feedback about your application quality.

<!-- ## Clean up resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)] -->

## Next steps

You've successfully set up a continuous end-to-end testing workflow with GitHub Actions and Microsoft Playwright Testing. You used the test diagnostics information in GitHub Actions to fix failing tests.

- Learn more about [running existing tests with Microsoft Playwright Testing](./how-to-run-with-playwright-testing.md).
- Learn more about [running cross-platform tests](./how-to-cross-platform-tests.md).
- Learn more about [testing privately hosted application endpoints](./how-to-test-private-endpoints.md).
- Learn more about [managing workspaces in the Azure portal](./how-to-manage-workspace-in-azure-portal.md).
