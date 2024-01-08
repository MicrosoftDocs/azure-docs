---
title: 'Quickstart: Continuous end-to-end testing'
description: In this quickstart, you learn how to run your Playwright tests at scale in your CI pipeline with Microsoft Playwright Testing. Continuously validate that your web app runs correctly across browsers and operating systems.
ms.topic: quickstart
ms.date: 10/04/2023
ms.custom: playwright-testing-preview
---

# Quickstart: Set up continuous end-to-end testing with Microsoft Playwright Testing Preview

In this quickstart, you set up continuous end-to-end testing with Microsoft Playwright Testing Preview to validate that your web app runs correctly across different browsers and operating systems with every code commit. Learn how to add your Playwright tests to a continuous integration (CI) workflow, such as GitHub Actions, Azure Pipelines, or other CI platforms.

After you complete this quickstart, you have a CI workflow that runs your Playwright test suite at scale with Microsoft Playwright Testing.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* A Microsoft Playwright Testing workspace. Complete the [quickstart: run Playwright tests at scale](./quickstart-run-end-to-end-tests.md) to create a workspace.

# [GitHub Actions](#tab/github)
- A GitHub account. If you don't have a GitHub account, you can [create one for free](https://github.com/).
- A GitHub repository that contains your Playwright test specifications and GitHub Actions workflow. To create a repository, see [Creating a new repository](https://docs.github.com/github/creating-cloning-and-archiving-repositories/creating-a-new-repository).
- A GitHub Actions workflow. If you need help with getting started with GitHub Actions, see [create your first workflow](https://docs.github.com/en/actions/quickstart)

# [Azure Pipelines](#tab/pipelines)
- An Azure DevOps organization and project. If you don't have an Azure DevOps organization, you can [create one for free](/azure/devops/organizations/projects/create-project).
- A pipeline definition. If you need help with getting started with Azure Pipelines, see [create your first pipeline](/azure/devops/pipelines/create-first-pipeline).

---

## Configure a service access token

Microsoft Playwright Testing uses access tokens to authorize users to run Playwright tests with the service. You can generate a service access token in the Playwright portal, and then specify the access token in the service configuration file.

To generate an access token and store it as a CI workflow secret, perform the following steps:

1. Sign in to the [Playwright portal](https://aka.ms/mpt/portal) with your Azure account.

1. Select the workspace settings icon, and then go to the **Access tokens** page.

    :::image type="content" source="./media/quickstart-automate-end-to-end-testing/playwright-testing-generate-new-access-token.png" alt-text="Screenshot that shows the access tokens settings page in the Playwright Testing portal." lightbox="./media/quickstart-automate-end-to-end-testing/playwright-testing-generate-new-access-token.png":::

1. Select **Generate new token** to create a new access token for your CI workflow.

1. Enter the access token details, and then select **Generate token**.

    :::image type="content" source="./media/quickstart-automate-end-to-end-testing/playwright-testing-generate-token.png" alt-text="Screenshot that shows setup guide in the Playwright Testing portal, highlighting the 'Generate token' button." lightbox="./media/quickstart-automate-end-to-end-testing/playwright-testing-generate-token.png":::

    :::image type="content" source="./media/quickstart-automate-end-to-end-testing/playwright-testing-copy-access-token.png" alt-text="Screenshot that shows how to copy the generated access token in the Playwright Testing portal." lightbox="./media/quickstart-automate-end-to-end-testing/playwright-testing-copy-access-token.png":::

1. Store the access token in a CI workflow secret to avoid specifying the token in clear text in the workflow definition:

    # [GitHub Actions](#tab/github)
    
    1. Go to your GitHub repository, and select **Settings** > **Secrets and variables** > **Actions**.
    1. Select **New repository secret**.
    1. Enter the secret details, and then select **Add secret** to create the CI/CD secret.
    
        | Parameter | Value |
        | ----------- | ------------ |
        | **Name** | *PLAYWRIGHT_SERVICE_ACCESS_TOKEN* |  
        | **Value** | Paste the workspace access token you copied previously. |
    
    1. Select **OK** to create the workflow secret.

    # [Azure Pipelines](#tab/pipelines)
    
    1. Go to your Azure DevOps project.
    1. Go to the **Pipelines** page, select the appropriate pipeline, and then select **Edit**.
    1. Locate the **Variables** for this pipeline.
    1. Add a new variable.
    1. Enter the variable details, and then select **Add secret** to create the CI/CD secret.
    
        | Parameter | Value |
        | ----------- | ------------ |
        | **Name** | *PLAYWRIGHT_SERVICE_ACCESS_TOKEN* |
        | **Value** | Paste the workspace access token you copied previously. |
        | **Keep this value secret** | Check this value |
    
    1. Select **OK**, and then **Save** to create the workflow secret.
    
    ---

## Get the service region endpoint URL

In the service configuration, you have to provide the region-specific service endpoint. The endpoint depends on the Azure region you selected when creating the workspace.

To get the service endpoint URL and store it as a CI workflow secret, perform the following steps:

1. Sign in to the [Playwright portal](https://aka.ms/mpt/portal) with your Azure account.

1. On the workspace home page, select **View setup guide**.

    > [!TIP]
    > If you have multiple workspaces, you can switch to another workspace by selecting the workspace name at the top of the page, and then select **Manage all workspaces**.

1. In **Add region endpoint in your setup**, copy the service endpoint URL.

    The endpoint URL matches the Azure region that you selected when creating the workspace.

1. Store the service endpoint URL in a CI workflow secret:

    | Secret name | Value |
    | ----------- | ------------ |
    | *PLAYWRIGHT_SERVICE_URL* | Paste the endpoint URL you copied previously. |

## Add service configuration file

If you haven't configured your Playwright tests yet for running them on cloud-hosted browsers, add a service configuration file to your repository. In the next step, you then specify this service configuration file on the Playwright CLI.

1. Create a new file `playwright.service.config.ts` alongside the `playwright.config.ts` file.

    Optionally, use the `playwright.service.config.ts` file in the [sample repository](https://github.com/microsoft/playwright-testing-service/blob/main/samples/get-started/playwright.service.config.ts).

1. Add the following content to it:

    :::code language="typescript" source="~/playwright-testing-service/samples/get-started/playwright.service.config.ts":::

1. Save and commit the file to your source code repository.

## Update the workflow definition

Update the CI workflow definition to run your Playwright tests with the Playwright CLI. Pass the [service configuration file](#add-service-configuration-file) as an input parameter for the Playwright CLI. You configure your environment by specifying environment variables.

1. Open the CI workflow definition

1. Add the following steps to run your Playwright tests in Microsoft Playwright Testing.

    The following steps describe the workflow changes for GitHub Actions or Azure Pipelines. Similarly, you can run your Playwright tests by using the Playwright CLI in other CI platforms.

    # [GitHub Actions](#tab/github)

    ```yml
    - name: Install dependencies
      working-directory: path/to/playwright/folder # update accordingly
      run: npm ci

    - name: Run Playwright tests
      working-directory: path/to/playwright/folder # update accordingly
      env:
        # Access token and regional endpoint for Microsoft Playwright Testing
        PLAYWRIGHT_SERVICE_ACCESS_TOKEN: ${{ secrets.PLAYWRIGHT_SERVICE_ACCESS_TOKEN }}
        PLAYWRIGHT_SERVICE_URL: ${{ secrets.PLAYWRIGHT_SERVICE_URL }}
        PLAYWRIGHT_SERVICE_RUN_ID: ${{ github.run_id }}-${{ github.run_attempt }}-${{ github.sha }}
      run: npx playwright test -c playwright.service.config.ts --workers=20

    - name: Upload Playwright report
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: path/to/playwright/folder/playwright-report/ # update accordingly
        retention-days: 10
    ```

    # [Azure Pipelines](#tab/pipelines)

    ```yml
    - task: PowerShell@2
      enabled: true
      displayName: "Install dependencies"
      inputs:
        targetType: 'inline'
        script: 'npm ci'
        workingDirectory: path/to/playwright/folder # update accordingly
    
    - task: PowerShell@2
      enabled: true
      displayName: "Run Playwright tests"
      env:
        PLAYWRIGHT_SERVICE_ACCESS_TOKEN: $(PLAYWRIGHT_SERVICE_ACCESS_TOKEN)
        PLAYWRIGHT_SERVICE_URL: $(PLAYWRIGHT_SERVICE_URL)
      inputs:
        targetType: 'inline'
        script: 'npx playwright test -c playwright.service.config.ts --workers=20'
        workingDirectory: path/to/playwright/folder # update accordingly

    - task: PublishPipelineArtifact@1
      displayName: Upload Playwright report
      inputs:
        targetPath: path/to/playwright/folder/playwright-report/ # update accordingly
        artifact: 'Playwright tests'
        publishLocation: 'pipeline'
    ```

    ---

1. Save and commit your changes.

    When the CI workflow is triggered, your Playwright tests will run in your Microsoft Playwright Testing workspace on cloud-hosted browsers, across 20 parallel workers.

> [!CAUTION]
> With Microsoft Playwright Testing, you get charged based on the number of total test minutes. If you're a first-time user or [getting started with a free trial](./how-to-try-playwright-testing-free.md), you might start with running a single test at scale instead of your full test suite to avoid exhausting your free test minutes.
>
> After you validate that the test runs successfully, you can gradually increase the test load by running more tests with the service.
>
> You can run a single test with the service by using the following command-line:
>
> ```npx playwright test {name-of-file.spec.ts} --config=playwright.service.config.ts```

## Related content

You've successfully set up a continuous end-to-end testing workflow to run your Playwright tests at scale on cloud-hosted browsers.

- [Grant users access to the workspace](./how-to-manage-workspace-access.md)

- [Manage your workspaces](./how-to-manage-playwright-workspace.md)
