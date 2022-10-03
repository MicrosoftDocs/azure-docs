---
title: Set up continuous tests with Azure Pipelines
titleSuffix: Microsoft Playwright Testing
description: Learn how to set up continuous end-to-end testing with Azure Pipelines and Microsoft Playwright Testing. Run Playwright tests with every code change from your CI/CD pipeline.
services: playwright-testing
ms.service: playwright-testing
ms.topic: how-to
ms.author: nicktrog
author: ntrogh
ms.date: 09/28/2022
---

# Set up continuous end-to-end testing with Azure Pipelines

In this article, you learn how to set up continuous end-to-end testing with Azure Pipelines and Microsoft Playwright Testing Preview. Run your Playwright tests with every code change from your CI/CD pipeline. View the test summary results and failed tests directly within the CI/CD output.

If you're using GitHub Actions for your CI/CD pipelines, see the tutorial [Automate end-to-end Playwright tests with GitHub Actions](./tutorial-automate-end-to-end-testing-with-github-actions.md).

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
* An Azure DevOps organization and project. If you don't have an Azure DevOps organization, you can [create one for free](/azure/devops/pipelines/get-started/pipelines-sign-up?view=azure-devops&preserve-view=true). If you need help with getting started with Azure Pipelines, see [Create your first pipeline](/azure/devops/pipelines/create-first-pipeline?preserve-view=true&view=azure-devops&tabs=java%2Ctfs-2018-2%2Cbrowser).
* A Microsoft Playwright Testing workspace. If you need to create a Microsoft Playwright Testing workspace, see [Manage Microsoft Playwright Testing workspaces in the Azure portal](./how-to-manage-workspace-in-azure-portal.md).

## Update Playwright configuration

To run Playwright tests with Microsoft Playwright Testing, you have to update the `playwright.config.ts` Playwright configuration file.

1. Follow the steps in [Run existing tests with Microsoft Playwright Testing](./how-to-run-with-playwright-testing.md#update-playwright-configuration) to update the Playwright configuration file.

    > [!NOTE]
    > You'll configure the workspace access key in later step by using an Azure Pipelines variable.

1. Update the `config.reporter` property to save the Playwright test output in JUnit file format to `results.xml`. 

    ```typescript
    //playwright.config.ts
    config.reporter = [["list"], ["@microsoft/playwright-service/reporter", playwrightServiceConfig.getReporterOptions()],  ["@microsoft/playwright-service/junit-reporter", {outputFile: './results.xml'}]];
    ```

    In the Azure Pipelines definition, you'll use the `PublishTestResults` task to publish the test results to Azure Pipelines. This enables you to view the Playwright test results directly in the Azure Pipelines portal.

## Configure service authentication

Microsoft Playwright Testing uses workspace access keys to authorize running tests. You'll first create a workspace access key in the Playwright dashboard. 

Next, you'll pass the access key securely to the Playwright command-line in the Azure Pipelines definition file by using a [secure variable](/azure/devops/pipelines/process/set-secret-variables).

1. Go to the [Playwright dashboard](https://17157345.playwright-int.io/), and follow these steps to [create a workspace access key](./how-to-manage-access-keys.md#create-an-access-key).

    After you create the access key, make to copy the generated key value.

1. Go to your Azure DevOps project portal `https://dev.azure.com/<my-project>`.

1. Select **Pipelines**, select your pipeline from the list, and then select **Edit**, to edit the pipeline definition.

1. Select **Variables** on the pipeline edit page.

    :::image type="content" source="./media/how-to-setup-continuous-testing-with-azure-pipelines/azure-pipelines-variables.png" alt-text="Screenshot that shows how to manage pipeline variables in the Azure Pipelines portal.":::

1. Create a new variable, **ACCESS_KEY**, and select the checkbox **Keep this value secret**. Set the value to the access key you generated and copied earlier.

1. Select **Save** to save your variable.

## Build your YAML pipeline

Update the pipeline definition to run the Playwright tests with Microsoft Playwright Testing. In this pipeline, you'll:

- Install the npm package dependencies, such as the Microsoft Playwright Testing npm package.
- Use the Playwright CLI to run the Playwright tests.
- Publish the Playwright test results to Azure Pipelines with the `PublishTestResults` task.

Specify the workspace access key in the `ACCESS_KEY` environment variable for the Playwright CLI. Optionally, you can override the dashboard name and number of parallel workers.

In the following code snippet, replace the `<my-tests-directory>` placeholder with the location of your Playwright tests.

```yml
variables:
  workingDirectory: <my-tests-directory>

steps:
- checkout: self
  displayName: Checkout Repository

- task: NodeTool@0
  inputs:
    versionSpec: '14.x'
    checkLatest: true
  displayName: Setup Node.js 14

- script: |
    npm i
  workingDirectory: $(workingDirectory)
  displayName: Install Dependencies

- script: |
    npx playwright test
  workingDirectory: $(workingDirectory)
  continueOnError: true
  env:
    ACCESS_KEY: $(ACCESS_KEY)
    DASHBOARD: 'azure-pipelines'
    WORKERS: 10
  displayName: Run Playwright Tests using ADO Registry

- task: PublishTestResults@2
  inputs:
    testResultsFormat: 'JUnit'
    testResultsFiles: '**/results.xml'
    testRunTitle: 'Playwright tests'
  displayName: Publish test results
```

## Verify your pipeline run

1. Open your completed pipeline run and check the task view to verify that the tests finished running.

    :::image type="content" source="./media/how-to-setup-continuous-testing-with-azure-pipelines/azure-pipelines-playwright-tests-log.png" alt-text="Screenshot that shows the output of the Playwright tests in the Azure Pipelines portal.":::

    The output log contains a direct link to the Playwright dashboard.

1. Verify that the **Tests** view in Azure Pipelines shows the Playwright test summary and details of failed tests.

    :::image type="content" source="./media/how-to-setup-continuous-testing-with-azure-pipelines/azure-pipelines-playwright-tests-overview.png" alt-text="Screenshot that shows the Playwright test results in the Tests view in the Azure Pipelines portal.":::

## Next steps

- Learn more about [identifying app issues with end-to-end tests](./tutorial-identify-issues-with-end-to-end-tests.md).
- Learn more about [running cross-platform tests](./how-to-cross-platform-tests.md).
- Learn more about [testing privately hosted applications](./how-to-test-private-endpoints.md).
- Learn more about [managing workspaces and permissions in the Azure portal](./how-to-manage-workspace-in-azure-portal.md).
