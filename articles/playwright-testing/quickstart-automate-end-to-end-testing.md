---
title: 'Quickstart: Continuous end-to-end testing'
description: In this quickstart, you learn how to run your Playwright tests at scale in your CI pipeline with Microsoft Playwright Testing. Continuously validate that your web app runs correctly across browsers and operating systems.
ms.topic: quickstart
ms.date: 10/04/2023
ms.custom: playwright-testing-preview, build-2024, ignite-2024
zone_pivot_group_filename: playwright-testing/zone-pivots-groups.json
zone_pivot_groups: microsoft-playwright-testing
---

# Quickstart: Set up continuous end-to-end testing with Microsoft Playwright Testing Preview

In this quickstart, you set up continuous end-to-end testing with Microsoft Playwright Testing Preview to validate that your web app runs correctly across different browsers and operating systems with every code commit and troubleshoot tests easily using the service dashboard. Learn how to add your Playwright tests to a continuous integration (CI) workflow, such as GitHub Actions, Azure Pipelines, or other CI platforms.

After you complete this quickstart, you have a CI workflow that runs your Playwright test suite at scale and helps you troubleshoot tests easily with Microsoft Playwright Testing.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* A Microsoft Playwright Testing workspace. Complete the [quickstart: run Playwright tests at scale](./quickstart-run-end-to-end-tests.md) and create a workspace.

# [GitHub Actions](#tab/github)
- A GitHub account. If you don't have a GitHub account, you can [create one for free](https://github.com/).
- A GitHub repository that contains your Playwright test specifications and GitHub Actions workflow. To create a repository, see [Creating a new repository](https://docs.github.com/github/creating-cloning-and-archiving-repositories/creating-a-new-repository).
- A GitHub Actions workflow. If you need help with getting started with GitHub Actions, see [create your first workflow](https://docs.github.com/en/actions/quickstart)
- Set up authentication from GitHub Actions to Azure. See [Use GitHub Actions to connect to Azure](/azure/developer/github/connect-from-azure)

# [Azure Pipelines](#tab/pipelines)
- An Azure DevOps organization and project. If you don't have an Azure DevOps organization, you can [create one for free](/azure/devops/organizations/projects/create-project).
- A pipeline definition. If you need help with getting started with Azure Pipelines, see [create your first pipeline](/azure/devops/pipelines/create-first-pipeline).
- Azure Resource Manager Service connection to securely authenticate to the service from Azure Pipelines, see [Azure Resource Manager service connection](/azure/devops/pipelines/library/connect-to-azure)

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

::: zone pivot="playwright-test-runner"
## Add service configuration file

If you don't have Playwright tests configured to run with the service, add a service configuration file to your repository. In the next step, you then specify this service configuration file on the Playwright CLI.

1. Create a new file `playwright.service.config.ts` alongside the `playwright.config.ts` file.

    Optionally, use the `playwright.service.config.ts` file in the [sample repository](https://github.com/microsoft/playwright-testing-service/blob/main/samples/get-started/playwright.service.config.ts).

2. Add the following content to it:

    :::code language="typescript" source="~/playwright-testing-service/samples/get-started/playwright.service.config.ts":::

   By default, the service configuration enables you to:
   - Accelerate build pipelines by running tests in parallel using cloud-hosted browsers.
   - Simplify troubleshooting with easy access to test results and artifacts published to the service.

   However, you can choose to use either of these features or both. See [How to use service features](./how-to-use-service-features.md#manage-features-while-running-tests) and update the service configuration file as per your requirements. 

3. Save and commit the file to your source code repository.

## Update package.json file 

Update the `package.json` file in your repository to add details about Microsoft Playwright Testing service package in `devDependencies` section.

```typescript
"devDependencies": {
    "@azure/microsoft-playwright-testing": "^1.0.0-beta.6"
}
```

## Enable artifacts in Playwright configuration 

In the `playwright.config.ts` file of your project, make sure you're collecting all the required artifacts.
```typescript
  use: {
    trace: 'on-first-retry',
    video:'retain-on-failure',
    screenshot:'on'
  },
  ```
::: zone-end

::: zone pivot="nunit-test-runner"
## Set up service configuration 

1. Create a new file `PlaywrightServiceSetup.cs` in the root directory of your project. This file facilitates authentication of your client with the service. 
2. Add the following content to it:

    :::code language="csharp" source="~/playwright-testing-service/samples/.NET/NUnit/PlaywrightServiceSetup.cs":::

3. Save and commit the file to your source code repository.

## Install service package

In your project, install Microsoft Playwright Testing package. 

```PowerShell
dotnet add package Azure.Developer.MicrosoftPlaywrightTesting.NUnit --prerelease
```

This command updates your project's `csproj` file by adding the service package details to the `ItemGroup` section. Remember to commit these changes.

```xml
  <ItemGroup>
    <PackageReference Include="Azure.Developer.MicrosoftPlaywrightTesting.NUnit" Version="1.0.0-beta.2" />
  </ItemGroup>
```

## Add or update `.runsettings` file for your project. 

If you haven't configured your Playwright tests yet for running them with service, add `.runsettings` file to your repository. In the next step, you then specify this service configuration file on the Playwright CLI.

1. Create a new `.runsettings` file.

    Optionally, use the `.runsettings` file in the [sample repository](https://aka.ms/mpt/nunit-runsettings).

2. Add the following content to it:

    :::code language="xml" source="~/playwright-testing-service/samples/.NET/NUnit/.runsettings":::

   The settings in this file enable you to:
   - Accelerate build pipelines by running tests in parallel using cloud-hosted browsers.
   - Publish test results and artifacts to the service for faster troubleshooting.

   However, you can choose to use either of these features or both. See [How to use service features](./how-to-use-service-features.md#manage-features-while-running-tests) and update the service configuration file as per your requirements. 

3. Save and commit the file to your source code repository.

## Enable artifacts in your Playwright setup 

Set up Playwright to capture artifacts such as screenshot, videos and traces. 
- For screenshots, see [capture screenshots](https://playwright.dev/dotnet/docs/screenshots#introduction)
- For videos, see [record videos for your tests](https://playwright.dev/dotnet/docs/videos#introduction)
- For traces, see [recording a trace](https://playwright.dev/dotnet/docs/trace-viewer-intro#recording-a-trace)

Once you collect these artifacts, attach them to the `TestContext` to ensure they're available in your test reports. For more information, see our [sample project for NUnit](https://aka.ms/mpt/nunit-sample).
::: zone-end

## Set up authentication
    
The CI machine running Playwright tests must authenticate with Playwright Testing service to get the browsers to run the tests and to publish the test results and artifacts. 

The service offers two authentication methods: Microsoft Entra ID and Access Tokens. We strongly recommend using Microsoft Entra ID to authenticate your pipelines. 

#### Set up authentication using Microsoft Entra ID
    
  # [GitHub Actions](#tab/github)

  If you're using GitHub Actions, you can connect to the service using GitHub OpenID Connect. Follow the steps to set up the integration:

  ##### Prerequisites

  **Option 1: Microsoft Entra application**

  - Create a Microsoft Entra application with a service principal by [Azure portal](/entra/identity-platform/howto-create-service-principal-portal#register-an-application-with-microsoft-entra-id-and-create-a-service-principal), [Azure CLI](/cli/azure/azure-cli-sp-tutorial-1#create-a-service-principal), or [Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps#create-a-service-principal).

  - Copy the values for **Client ID**, **Subscription ID**, and **Directory (tenant) ID** to use later in your GitHub Actions workflow.

  - Assign the `Owner` or `Contributor` role to the service principal created in the previous step. These roles must be assigned on the Playwright Testing workspace. For more details, see [how to manage access](./how-to-manage-access-tokens.md).

  - [Configure a federated identity credential on a Microsoft Entra application](/entra/workload-id/workload-identity-federation-create-trust) to trust tokens issued by GitHub Actions to your GitHub repository. 

  **Option 2: User-assigned managed identity**

  - [Create a user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#create-a-user-assigned-managed-identity).

  - Copy the values for **Client ID**, **Subscription ID**, and **Directory (tenant) ID** to use later in your GitHub Actions workflow.

  - Assign the `Owner` or `Contributor` role to the user-assigned managed identity created in the previous step. These roles must be assigned on the Playwright Testing workspace. For more details, see [how to manage access](./how-to-manage-access-tokens.md).

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

  - [Create an app registration with workload identity federation](https://learn.microsoft.com/azure/devops/pipelines/library/connect-to-azure#create-an-app-registration-with-workload-identity-federation-automatic). Select the subscription and resource group associated with your Playwright Testing workspace. Typically, the resource group has the same name as the Playwright Testing workspace.

  - Use this service connection in Azure Pipeline yaml file as shown in subsequent steps.  

---

#### Set up authentication using access tokens

> [!CAUTION]
> We strongly recommend using Microsoft Entra ID for authentication to the service. If you're using access tokens, see [How to manage access tokens](./how-to-manage-access-tokens.md)

You can generate an access token from your Playwright Testing workspace and use it in your setup. However, we strongly recommend Microsoft Entra ID for authentication due to its enhanced security. Access tokens, while convenient, function like long-lived passwords and are more susceptible to being compromised.

1. Authentication using access tokens is disabled by default. To use, [Enable access-token based authentication](./how-to-manage-authentication.md#enable-authentication-using-access-tokens).

2. [Set up authentication using access tokens](./how-to-manage-authentication.md#set-up-authentication-using-access-tokens).

3. Store the access token in a CI workflow secret and use it in the GitHub Actions workflow or Azure Pipeline yaml file. 

| Secret name | Value |
| ----------- | ------------ |
| *PLAYWRIGHT_SERVICE_ACCESS_TOKEN* | Paste the value of Access Token you created previously. | 


## Update the workflow definition

::: zone pivot="playwright-test-runner"
Update the CI workflow definition to run your Playwright tests with the Playwright CLI. Pass the [service configuration file](#add-service-configuration-file) as an input parameter for the Playwright CLI. You configure your environment by specifying environment variables.

1. Open the CI workflow definition

1. Add the following steps to run your Playwright tests in Microsoft Playwright Testing.

    The following steps describe the workflow changes for GitHub Actions or Azure Pipelines. Similarly, you can run your Playwright tests by using the Playwright CLI in other CI platforms.

    # [GitHub Actions](#tab/github)

    ```yml
    
      # This step is to sign-in to Azure to run tests from GitHub Action workflow. 
      # Choose how to set up authentication to Azure from GitHub Actions. This is one example. 
      name: Playwright Tests (Microsoft Playwright Testing)
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
                # Regional endpoint for Microsoft Playwright Testing
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

Update the CI workflow definition to run your Playwright tests with the Playwright NUnit CLI. Pass the `.runsettings` file as an input parameter for the Playwright CLI. You configure your environment by specifying environment variables.

1. Open the CI workflow definition.

1. Add the following steps to run your Playwright tests in Microsoft Playwright Testing.

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
              # Regional endpoint for Microsoft Playwright Testing
              PLAYWRIGHT_SERVICE_URL: ${{ secrets.PLAYWRIGHT_SERVICE_URL }}
              # PLAYWRIGHT_SERVICE_ACCESS_TOKEN: ${{ secrets.PLAYWRIGHT_SERVICE_ACCESS_TOKEN }} # Not recommended, use Microsoft Entra ID authentication. 
            run: dotnet test --settings:.runsettings --logger "microsoft-playwright-testing" -- NUnit.NumberOfTestWorkers=20

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
          dotnet test --settings:.runsettings --logger "microsoft-playwright-testing" -- NUnit.NumberOfTestWorkers=20
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

    When the CI workflow is triggered, your Playwright tests run in your Microsoft Playwright Testing workspace on cloud-hosted browsers, across 20 parallel workers. The results and artifacts collected are published to the service and can be viewed on service portal.


The settings for your test run can be defined in `.runsettings` file. For more information, see [how to use service package options](./how-to-use-service-config-file.md#config-options-in-runsettings-file)

> [!NOTE]
> Reporting feature is enabled by default for existing workspaces. This is being rolled out in stages and will take a few days. To avoid failures, confirm that `Rich diagnostics using reporting` setting is ON for your workspace before proceeding. For more information, see, [Enable reporting for workspace](./how-to-use-service-features.md#manage-feature-for-the-workspace).

> [!CAUTION]
> With Microsoft Playwright Testing, you get charged based on the number of total test minutes consumed and test results published. If you're a first-time user or [getting started with a free trial](./how-to-try-playwright-testing-free.md), you might start with running a single test at scale instead of your full test suite to avoid exhausting your free test minutes and test results.

After you validate that the test runs successfully, you can gradually increase the test load by running more tests with the service.

::: zone pivot="playwright-test-runner"

You can run a single test with the service by using the following command-line:

```powershell
npx playwright test {name-of-file.spec.ts} --config=playwright.service.config.ts
```

::: zone-end
## View test runs and results in the Playwright portal

You can now troubleshoot the CI pipeline in the Playwright portal,  

::: zone pivot="playwright-test-runner"

[!INCLUDE [View test runs and results in the Playwright portal](./includes/include-playwright-portal-view-test-results.md)]

::: zone-end

::: zone pivot="nunit-test-runner"

[!INCLUDE [View test runs and results in the Playwright portal](./includes/include-playwright-portal-view-test-results-nunit.md)]

::: zone-end


> [!TIP]
> You can use Microsoft Playwright Testing service features independently. You can publish test results to the portal without using the cloud-hosted browsers feature and you can also use only cloud-hosted browsers to expedite your test suite without publishing test results. For details, see [How to use service features](./how-to-use-service-features.md).

> [!NOTE]
> The test results and artifacts that you publish are retained on the service for 90 days. After that, they are automatically deleted.  


## Related content

You've successfully set up a continuous end-to-end testing workflow to run your Playwright tests at scale on cloud-hosted browsers.

- [Grant users access to the workspace](./how-to-manage-workspace-access.md)

- [Manage your workspaces](./how-to-manage-playwright-workspace.md)
