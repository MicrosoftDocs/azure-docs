---
title: 'Quickstart: Continuous end-to-end testing'
titleSuffix: Playwright Workspaces
description: In this quickstart, you learn how to run your Playwright tests at scale in your CI pipeline with Playwright Workspaces. Continuously validate that your web app runs correctly across browsers and operating systems.
ms.topic: quickstart
ms.date: 08/07/2025
ms.service: azure-app-testing
ms.subservice: playwright-workspaces
author: johnsta
ms.author: johnsta
ms.custom: playwright-workspaces
zone_pivot_group_filename: app-testing/playwright-workspaces/zone-pivots-groups.json
zone_pivot_groups: playwright-workspaces
---

# Quickstart: Set up continuous end-to-end testing with Playwright Workspaces

In this quickstart, you set up continuous end-to-end testing with Playwright Workspaces to validate that your web app runs correctly across different browsers and operating systems with every code commit and troubleshoot tests easily using the service dashboard. Learn how to add your Playwright tests to a continuous integration (CI) workflow, such as GitHub Actions, Azure Pipelines, or other CI platforms.

After you complete this quickstart, you have a CI workflow that runs your Playwright test suite at scale and helps you troubleshoot tests easily with Playwright Workspaces.

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

* A Playwright workspace. Complete the [quickstart: run Playwright tests at scale](./quickstart-run-end-to-end-tests.md) and create a workspace.

# [GitHub Actions](#tab/github)
- A GitHub account. If you don't have a GitHub account, you can [create one for free](https://github.com/).
- A GitHub repository that contains your Playwright test specifications and GitHub Actions workflow. To create a repository, see [Creating a new repository](https://docs.github.com/github/creating-cloning-and-archiving-repositories/creating-a-new-repository).
- A GitHub Actions workflow. If you need help with getting started with GitHub Actions, see [create your first workflow](https://docs.github.com/en/actions/quickstart)
- Set up authentication from GitHub Actions to Azure. See [Use GitHub Actions to connect to Azure](/azure/developer/github/connect-from-azure).

# [Azure Pipelines](#tab/pipelines)
- An Azure DevOps organization and project. If you don't have an Azure DevOps organization, you can [create one for free](/azure/devops/organizations/projects/create-project).
- A pipeline definition. If you need help with getting started with Azure Pipelines, see [create your first pipeline](/azure/devops/pipelines/create-first-pipeline).
- Azure Resource Manager Service connection to securely authenticate to the service from Azure Pipelines, see [Azure Resource Manager service connection](/azure/devops/pipelines/library/connect-to-azure)

---

## Get the service region endpoint URL

In the service configuration, you have to provide the region-specific service endpoint. The endpoint depends on the Azure region you selected when creating the workspace.

To get the service endpoint URL and store it as a CI workflow secret, perform the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com) with your Azure account and navigate to your workspace.

1. Select the **Get Started** page.

    :::image type="content" source="./media/quickstart-automate-end-to-end-testing/navigate-to-get-started.png" alt-text="Screenshot that shows how to navigate to the Get Started page." lightbox="./media/quickstart-automate-end-to-end-testing/navigate-to-get-started.png":::

1. In **Add region endpoint in your setup**, copy the service endpoint URL.

    The endpoint URL matches the Azure region that you selected when creating the workspace.

1. Store the service endpoint URL in a CI workflow secret:

    | Secret name | Value |
    | ----------- | ------------ |
    | *PLAYWRIGHT_SERVICE_URL* | Paste the endpoint URL you copied previously. |

::: zone pivot="playwright-test-runner"

## Add service configuration file

If you don't have Playwright tests configured to run with the service, add a service configuration file to your repository. In the next step, you then specify this service configuration file on the Playwright CLI.

1. Create a new file `playwright.service.config.ts` alongside the `playwright.config.ts` file.

    Optionally, use the `playwright.service.config.ts` file in the [sample repository](https://github.com/Azure/playwright-workspaces/blob/main/samples/playwright-tests/playwright.service.config.ts).

2. Add the following content to it:

    :::code language="typescript" source="~/playwright-workspaces/samples/playwright-tests/playwright.service.config.ts":::

   By default, the service configuration enables you to accelerate build pipelines by running tests in parallel using cloud-hosted browsers.

3. Save and commit the file to your source code repository.

## Update package.json file 

Update the `package.json` file in your repository to add details about Playwright Workspaces package in `devDependencies` section.

```typescript
"devDependencies": {
    "@azure/playwright": "latest"
}
```

::: zone-end

::: zone pivot="nunit-test-runner"

## Install service package

In your project, install Playwright Workspaces package. 

```PowerShell
dotnet add package Azure.Developer.Playwright.NUnit
```

This command updates your project's `csproj` file by adding the service package details to the `ItemGroup` section. Remember to commit these changes.

```xml
  <ItemGroup>
    <PackageReference Include="Azure.Developer.Playwright.NUnit" Version="1.0.0" />
  </ItemGroup>
```

## Set up service configuration 

1. Create a new file `PlaywrightServiceNUnitSetup.cs` in the root directory of your project. This file facilitates authentication of your client with the service. 
2. Add the following content to it:

```c#
using Azure.Developer.Playwright.NUnit;
using Azure.Identity;
using System.Runtime.InteropServices;
using System;

namespace PlaywrightService.SampleTests; // Remember to change this as per your project namespace

[SetUpFixture]
public class PlaywrightServiceNUnitSetup : PlaywrightServiceBrowserNUnit
{
    public PlaywrightServiceNUnitSetup() : base(
        credential: new DefaultAzureCredential(),
    )
    {
        // no-op
    }
}
```

3. Save and commit the file to your source code repository.

::: zone-end

## Set up authentication
    
The CI machine running Playwright tests must authenticate with Playwright Workspaces service to get the browsers to run the tests. 

The service offers two authentication methods: Microsoft Entra ID and Access Tokens. We strongly recommend using Microsoft Entra ID to authenticate your pipelines. 

#### Set up authentication using Microsoft Entra ID
    
  # [GitHub Actions](#tab/github)

  If you're using GitHub Actions, you can connect to the service using GitHub OpenID Connect. Follow the steps to set up the integration:

  ##### Prerequisites

  **Option 1: Microsoft Entra application**

  - Create a Microsoft Entra application with a service principal by [Azure portal](/entra/identity-platform/howto-create-service-principal-portal#register-an-application-with-microsoft-entra-id-and-create-a-service-principal), [Azure CLI](/cli/azure/azure-cli-sp-tutorial-1#create-a-service-principal), or [Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps#create-a-service-principal).

  - Copy the values for **Client ID**, **Subscription ID**, and **Directory (tenant) ID** to use later in your GitHub Actions workflow.

  - Assign the `Owner` or `Contributor` role to the service principal created in the previous step. These roles must be assigned on the Playwright workspace. For more details, see [how to manage access](./how-to-manage-access-tokens.md).

  - [Configure a federated identity credential on a Microsoft Entra application](/entra/workload-id/workload-identity-federation-create-trust) to trust tokens issued by GitHub Actions to your GitHub repository. 

  **Option 2: User-assigned managed identity**

  - [Create a user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#create-a-user-assigned-managed-identity).

  - Copy the values for **Client ID**, **Subscription ID**, and **Directory (tenant) ID** to use later in your GitHub Actions workflow.

  - Assign the `Owner` or `Contributor` role to the user-assigned managed identity created in the previous step. These roles must be assigned on the Playwright workspace. For more details, see [how to manage access](./how-to-manage-access-tokens.md).

  - [Configure a federated identity credential on a user-assigned managed identity](/entra/workload-id/workload-identity-federation-create-trust-user-assigned-managed-identity) to trust tokens issued by GitHub Actions to your GitHub repository.

  ##### Create GitHub secrets

  -  Add the values you got in the previous step as secrets to your GitHub repository. See [set up GitHub Action Secret](/azure/developer/github/connect-from-azure-openid-connect?branch=main#create-github-secrets). These variables are used in the GitHub Action workflow in subsequent steps.

  | GitHub Secret       | Source (Microsoft Entra Application or Managed Identity) |
  |---------------------|----------------------------------------------------------|
  | `AZURE_CLIENT_ID`    | Client ID                                                |
  | `AZURE_SUBSCRIPTION_ID` | Subscription ID                                       |
  | `AZURE_TENANT_ID`    | Directory (Tenant) ID                                    |

  > [!NOTE] 
  > For enhanced security, it is strongly recommended to use GitHub Secrets to store sensitive values rather than including them directly in your workflow file.

  # [Azure Pipelines](#tab/pipelines)

  If you're using Azure Pipelines, you can connect to the service using Service Connections. Follow the steps to set up the integration:

  - [Create an app registration with workload identity federation](/azure/devops/pipelines/library/connect-to-azure#create-an-app-registration-with-workload-identity-federation-automatic). Select the subscription and resource group associated with your Playwright workspace. Typically, the resource group has the same name as the Playwright workspace.

  - Use this service connection in Azure Pipeline yaml file as shown in subsequent steps.  

---

#### Set up authentication using access tokens

> [!CAUTION]
> We strongly recommend using Microsoft Entra ID for authentication to the service. If you're using access tokens, see [How to manage access tokens](./how-to-manage-access-tokens.md)

You can generate an access token from your Playwright workspace and use it in your setup. However, we strongly recommend Microsoft Entra ID for authentication due to its enhanced security. Access tokens, while convenient, function like long-lived passwords and are more susceptible to being compromised.

1. Authentication using access tokens is disabled by default. To use, [Enable access-token based authentication](./how-to-manage-authentication.md#enable-authentication-using-access-tokens).

2. [Set up authentication using access tokens](./how-to-manage-authentication.md#set-up-authentication-using-access-tokens).

3. Store the access token in a CI workflow secret and use it in the GitHub Actions workflow or Azure Pipeline yaml file. 

| Secret name | Value |
| ----------- | ------------ |
| *PLAYWRIGHT_SERVICE_ACCESS_TOKEN* | Paste the value of Access Token you created previously. | 


## Update the workflow definition

::: zone pivot="playwright-test-runner"

Update the CI workflow definition to run your Playwright tests with the Playwright CLI. Pass the [service configuration file](#add-service-configuration-file) as an input parameter for the Playwright CLI. You configure your environment by specifying environment variables.

1. Open the CI workflow definition.

1. Add the following steps to run your Playwright tests in Playwright Workspaces.

    The following steps describe the workflow changes for GitHub Actions or Azure Pipelines. Similarly, you can run your Playwright tests by using the Playwright CLI in other CI platforms.

    # [GitHub Actions](#tab/github)

    ```yml
    
      # This step is to sign-in to Azure to run tests from GitHub Action workflow. 
      # Choose how to set up authentication to Azure from GitHub Actions. This is one example. 
      name: Playwright Tests (Playwright Workspaces)
      on:
        push:
          branches: [main, master]
        pull_request:
          branches: [main, master]

      permissions: # Required when using Microsoft Entra ID to authenticate
        id-token: write
        contents: read

      jobs:
        test:
          timeout-minutes: 60
          runs-on: ubuntu-latest
          steps:
            - uses: actions/checkout@v4

            - name: Login to Azure with AzPowershell (enableAzPSSession true)
              uses: azure/login@v2
              with:
                client-id: ${{ secrets.AZURE_CLIENT_ID }} # GitHub Open ID connect values copied in previous steps
                tenant-id: ${{ secrets.AZURE_TENANT_ID }}
                subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
                enable-AzPSSession: true

            - name: Install dependencies
              working-directory: path/to/playwright/folder # update accordingly
              run: npm ci

            - name: Run Playwright tests
              working-directory: path/to/playwright/folder # update accordingly
              env:
                # Regional endpoint for Playwright Workspaces
                PLAYWRIGHT_SERVICE_URL: ${{ secrets.PLAYWRIGHT_SERVICE_URL }}
                # PLAYWRIGHT_SERVICE_ACCESS_TOKEN: ${{ secrets.PLAYWRIGHT_SERVICE_ACCESS_TOKEN }} # Not recommended, use Microsoft Entra ID authentication. 
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
          
    - task: AzureCLI@2
      displayName: Run Playwright Test  
        env:
        PLAYWRIGHT_SERVICE_URL: $(PLAYWRIGHT_SERVICE_URL)
        # PLAYWRIGHT_SERVICE_ACCESS_TOKEN: $(PLAYWRIGHT_SERVICE_ACCESS_TOKEN) # Not recommended, use Microsoft Entra ID authentication. 

      inputs:
        azureSubscription: My_Service_Connection # Service connection used to authenticate this pipeline with Azure to use the service
        scriptType: 'pscore'
        scriptLocation: 'inlineScript'
        inlineScript: |
          npx playwright test -c playwright.service.config.ts --workers=20
      addSpnToEnvironment: true
      workingDirectory: path/to/playwright/folder # update accordingly

    - task: PublishPipelineArtifact@1
      displayName: Upload Playwright report
      inputs:
        targetPath: path/to/playwright/folder/playwright-report/ # update accordingly
        artifact: 'Playwright tests'
        publishLocation: 'pipeline'
    ```

    ---
::: zone-end

::: zone pivot="nunit-test-runner"

Update the CI workflow definition to run your Playwright tests with the Playwright NUnit CLI. You configure your environment by specifying environment variables.

1. Open the CI workflow definition.

1. Add the following steps to run your Playwright tests in Playwright Workspaces.

    The following steps describe the workflow changes for GitHub Actions or Azure Pipelines. Similarly, you can run your Playwright tests by using the Playwright CLI in other CI platforms.

    # [GitHub Actions](#tab/github)

    ```yml
    on:
      push:
        branches: [ main, master ]
      pull_request:
        branches: [ main, master ]
    permissions: # Required when using AuthType as EntraId
      id-token: write
      contents: read
    jobs:
      test:
        timeout-minutes: 60
        runs-on: ubuntu-latest
          steps:
          - uses: actions/checkout@v4
        # This step is to sign-in to Azure to run tests from GitHub Action workflow. 
        # Choose how to set up authentication to Azure from GitHub Actions. This is one example. 
          
          - name: Login to Azure with AzPowershell (enableAzPSSession true) 
            uses: azure/login@v2 
            with: 
              client-id: ${{ secrets.AZURE_CLIENT_ID }} # GitHub Open ID connect values copied in previous steps
              tenant-id: ${{ secrets.AZURE_TENANT_ID }}  
              subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}  
              enable-AzPSSession: true 
          
          - name: Setup .NET
            uses: actions/setup-dotnet@v4
            with:
              dotnet-version: 8.0.x
          
          - name: Restore dependencies
            run: dotnet restore
            working-directory: path/to/playwright/folder # update accordingly
          
          - name: Build
            run: dotnet build --no-restore
            working-directory: path/to/playwright/folder # update accordingly

          - name: Run Playwright tests
              working-directory: path/to/playwright/folder # update accordingly
            env:
              # Regional endpoint for Playwright Workspaces
              PLAYWRIGHT_SERVICE_URL: ${{ secrets.PLAYWRIGHT_SERVICE_URL }}
              # PLAYWRIGHT_SERVICE_ACCESS_TOKEN: ${{ secrets.PLAYWRIGHT_SERVICE_ACCESS_TOKEN }} # Not recommended, use Microsoft Entra ID authentication. 
            run: dotnet test -- NUnit.NumberOfTestWorkers=20

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
    - task: UseDotNet@2
      inputs:
        packageType: 'sdk'
        version: '8.x'
        installationPath: $(Agent.ToolsDirectory)/dotnet

    - checkout: self

    - script: dotnet restore
      displayName: 'Restore dependencies'
      workingDirectory: path/to/playwright/folder # update accordingly

    - script: dotnet build --no-restore
      displayName: 'Build'
      workingDirectory: path/to/playwright/folder # update accordingly

    - task: AzureCLI@2
      displayName: Run Playwright Test  
        env:
        PLAYWRIGHT_SERVICE_URL: $(PLAYWRIGHT_SERVICE_URL)
        # PLAYWRIGHT_SERVICE_ACCESS_TOKEN: $(PLAYWRIGHT_SERVICE_ACCESS_TOKEN) # Not recommended, use Microsoft Entra ID authentication. 

      inputs:
        azureSubscription: My_Service_Connection # Service connection used to authenticate this pipeline with Azure to use the service using Microsoft Entra ID.
        scriptType: 'pscore'
        scriptLocation: 'inlineScript'
        inlineScript: |
          dotnet test -- NUnit.NumberOfTestWorkers=20
      addSpnToEnvironment: true
      workingDirectory: path/to/playwright/folder # update accordingly

    - task: PublishPipelineArtifact@1
      displayName: Upload Playwright report
      inputs:
        targetPath: path/to/playwright/folder/playwright-report/ # update accordingly
        artifact: 'Playwright tests'
        publishLocation: 'pipeline'
    ```

    ---

::: zone-end

3. Save and commit your changes.

    When the CI workflow is triggered, your Playwright tests run in your Playwright workspace on cloud-hosted browsers, across 20 parallel workers. The results are published to the service and can be viewed in the Azure portal.


> [!CAUTION]
> With Playwright Workspaces, you get charged based on the number of total test minutes consumed. If you're a first-time user or [getting started with a free trial](./how-to-try-playwright-workspaces-free.md), you might start with running a single test at scale instead of your full test suite to avoid exhausting your free test minutes.

After you validate that the test runs successfully, you can gradually increase the test load by running more tests with the service.

::: zone pivot="playwright-test-runner"

You can run a single test with the service by using the following command-line:

```powershell
npx playwright test {name-of-file.spec.ts} --config=playwright.service.config.ts
```

::: zone-end
## View test runs and results

Playwright can collect rich test artifacts like logs, traces, and screenshots on every test run. To learn how to view test artifacts within your CI pipeline, see [Playwright documentation](https://playwright.dev/docs/ci-intro).

## Related content

You've successfully set up a continuous end-to-end testing workflow to run your Playwright tests at scale on cloud-hosted browsers.

- [Grant users access to the workspace](./how-to-manage-workspace-access.md)

- [Manage your workspaces](./how-to-manage-playwright-workspace.md)
