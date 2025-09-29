---
title: Continuously update function app code using Azure Pipelines
description: Learn how to use Azure Pipelines to set up a pipeline that builds and deploys apps to Azure Functions.
author: juliakm
ms.topic: conceptual
ms.date: 09/27/2025
ms.author: jukullam
ms.custom: devx-track-csharp, devx-track-azurecli, devops-pipelines-deploy
ms.devlang: azurecli
zone_pivot_groups: functions-task-versions
---

# Continuous delivery with Azure Pipelines

Use [Azure Pipelines](/azure/devops/pipelines/) to automatically deploy your code project to a function app in Azure. Azure Pipelines lets you build, test, and deploy with continuous integration (CI) and continuous delivery (CD) using [Azure DevOps](/azure/devops/). 

YAML pipelines are defined using a YAML file in your repository. A step is the smallest building block of a pipeline and can be a script or task (prepackaged script). [Learn about the key concepts and components that make up a pipeline](/azure/devops/pipelines/get-started/key-pipelines-concepts).

You use the `AzureFunctionApp` task to deploy your code. There are now two versions of `AzureFunctionApp`, which are compared in this table:

|Comparison/version  | [AzureFunctionApp@2](/azure/devops/pipelines/tasks/reference/azure-function-app-v2) | [AzureFunctionApp@1](/azure/devops/pipelines/tasks/reference/azure-function-app-v1) |
| ---- | ---- | ---- |
| Supports the [Flex Consumption plan](./flex-consumption-plan.md) | ✔ | ❌ |
| Includes enhanced validation support<sup>*</sup>| ✔ | ❌ | 
| When to use... | Recommended for new app deployments | Maintained for legacy deployments |

<sup>*</sup> Enhanced validation support makes pipelines less likely to fail because of errors. 

Choose your task version at the top of the article. 

> [!NOTE]
> Upgrade from `AzureFunctionApp@1` to `AzureFunctionApp@2` for access to new features and long-term support.

## Prerequisites

* An Azure DevOps organization. If you don't have one, you can [create one for free](/azure/devops/pipelines/get-started/pipelines-sign-up). If your team already has one, then make sure you're an administrator of the Azure DevOps project that you want to use.

* An ability to run pipelines on Microsoft-hosted agents. You can either purchase a [parallel job](/azure/devops/pipelines/licensing/concurrent-jobs) or you can request a free tier. 

* If you plan to use GitHub instead of Azure Repos, you also need a GitHub repository. If you don't have a GitHub account, you can [create one for free](https://github.com). 

* An existing function app in Azure that has its source code in a supported repository. If you don't yet have an Azure Functions code project, you can create one by completing the following language-specific article:
    ### [C\#](#tab/csharp)

    [Quickstart: Create a C# function in Azure using Visual Studio Code](how-to-create-function-vs-code.md?pivot=programming-language-csharp)

    ### [JavaScript](#tab/javascript)

    [Quickstart: Create a JavaScript function in Azure using Visual Studio Code](how-to-create-function-vs-code.md?pivot=programming-language-javascript)

    ### [Python](#tab/python)

    [Quickstart: Create a function in Azure with Python using Visual Studio Code](how-to-create-function-vs-code.md?pivot=programming-language-python)

    ### [PowerShell](#tab/powershell)

    [Quickstart: Create a PowerShell function in Azure using Visual Studio Code](how-to-create-function-vs-code.md?pivot=programming-language-powershell)

    ---
    
    Remember to upload the local code project to your GitHub or Azure Repos repository after you publish it to your function app. 

## Build your app

::: zone pivot="v2"
1. Sign in to your Azure DevOps organization and navigate to your project.
1. In your project, navigate to the **Pipelines** page. Then choose the action to create a new pipeline.
1. Walk through the steps of the wizard by first selecting **GitHub** as the location of your source code.
1. You might be redirected to GitHub to sign in. If so, enter your GitHub credentials.
1. When the list of repositories appears, select your sample app repository.
1. Azure Pipelines will analyze your repository and recommend a template. Select **Save and run**, then select **Commit directly to the main branch**, and then choose **Save and run** again.
1. A new run is started. Wait for the run to finish.

### Example YAML build pipelines

The following language-specific pipelines can be used for building apps. 
#### [C\#](#tab/csharp)

You can use the following sample to create a YAML file to build a .NET app:

```yaml
pool:
  vmImage: 'windows-latest'
steps:
  - task: UseDotNet@2
    displayName: 'Install .NET 8.0 SDK'
    inputs:
      packageType: 'sdk'
      version: '8.0.x'
      installationPath: $(Agent.ToolsDirectory)/dotnet
  - script: |
      dotnet restore
      dotnet build --configuration Release
  - task: DotNetCoreCLI@2
    displayName: 'dotnet publish'
    inputs:
      command: publish
      arguments: '--configuration Release --output $(System.DefaultWorkingDirectory)/publish_output'
      projects: 'csharp/*.csproj'
      publishWebProjects: false
      modifyOutputPath: false
      zipAfterPublish: false
  - task: ArchiveFiles@2
    displayName: "Archive files"
    inputs:
      rootFolderOrFile: "$(System.DefaultWorkingDirectory)/publish_output"
      includeRootFolder: false
      archiveFile: "$(System.DefaultWorkingDirectory)/build$(Build.BuildId).zip"
  - task: PublishBuildArtifacts@1
    inputs:
      PathtoPublish: '$(System.DefaultWorkingDirectory)/build$(Build.BuildId).zip'
      artifactName: 'drop'
```

#### [JavaScript](#tab/javascript)

You can use the following sample to create a YAML file to build a JavaScript app:

```yaml
pool:
  vmImage: ubuntu-latest # Use 'windows-latest' if you have Windows native +Node modules
steps:
- bash: |
    npm install 
    npm run build --if-present
    npm prune --omit=dev
- task: ArchiveFiles@2
  displayName: "Archive files"
  inputs:
    rootFolderOrFile: "$(System.DefaultWorkingDirectory)"
    includeRootFolder: false
    archiveFile: "$(System.DefaultWorkingDirectory)/build$(Build.BuildId).zip"
- task: PublishBuildArtifacts@1
  inputs:
    PathtoPublish: '$(System.DefaultWorkingDirectory)/build$(Build.BuildId).zip'
    artifactName: 'drop'
```

#### [Python](#tab/python)

Use one of the following samples to create a YAML file to build an app for a specific Python version. Python is only supported for function apps running on Linux.


```yaml
pool:
  vmImage: ubuntu-latest
steps:
- task: UsePythonVersion@0
  displayName: "Set Python version to 3.11"
  inputs:
    versionSpec: '3.11'
    architecture: 'x64'
- bash: |
    if [ -f extensions.csproj ]
    then
        dotnet build extensions.csproj --output ./bin
    fi
    pip install --target="./.python_packages/lib/site-packages" -r ./requirements.txt
- task: ArchiveFiles@2
  displayName: "Archive files"
  inputs:
    rootFolderOrFile: "$(System.DefaultWorkingDirectory)"
    includeRootFolder: false
    archiveFile: "$(System.DefaultWorkingDirectory)/build$(Build.BuildId).zip"
- task: PublishBuildArtifacts@1
  inputs:
    PathtoPublish: '$(System.DefaultWorkingDirectory)/build$(Build.BuildId).zip'
    artifactName: 'drop'
```

Check the generated archive to ensure that the deployed file has the right format. 
To learn about potential issues with these pipeline tasks, see [Functions not found after deployment](recover-python-functions.md#functions-not-found-after-deployment). 

#### [PowerShell](#tab/powershell)

You can use the following sample to create a YAML file to package a PowerShell app.

```yaml
pool:
  vmImage: 'windows-latest'
steps:
- task: ArchiveFiles@2
  displayName: "Archive files"
  inputs:
    rootFolderOrFile: "$(System.DefaultWorkingDirectory)"
    includeRootFolder: false
    archiveFile: "$(System.DefaultWorkingDirectory)/build$(Build.BuildId).zip"
- task: PublishBuildArtifacts@1
  inputs:
    PathtoPublish: '$(System.DefaultWorkingDirectory)/build$(Build.BuildId).zip'
    artifactName: 'drop'
```
---

::: zone-end  
::: zone pivot="v1"  
1. Sign in to your Azure DevOps organization and navigate to your project.
1. In your project, navigate to the **Pipelines** page. Then select **New pipeline**.
1. Select one of these options for **Where is your code?**:
    + **GitHub**: You might be redirected to GitHub to sign in. If so, enter your GitHub credentials. When this connection is your first GitHub connection, the wizard also walks you through the process of connecting DevOps to your GitHub accounts.
    + **Azure Repos Git**: You're immediately able to choose a repository in your current DevOps project. 
1. When the list of repositories appears, select your sample app repository.
1. Azure Pipelines analyzes your repository and in **Configure your pipeline** provides a list of potential templates. Choose the appropriate **function app** template for your language. If you don't see the correct template select **Show more**.  
1. Select **Save and run**, then select **Commit directly to the main branch**, and then choose **Save and run** again.
1. A new run is started. Wait for the run to finish.

### Example YAML build pipelines

The following language-specific pipelines can be used for building apps. 

#### [C\#](#tab/csharp)

You can use the following sample to create a YAML file to build a .NET app. 

If you see errors when building your app, verify that the version of .NET that you use matches your Azure Functions version. For more information, see [Azure Functions runtime versions overview](functions-versions.md). 

```yaml
pool:
  vmImage: 'windows-latest'
steps:
  - task: UseDotNet@2
    displayName: 'Install .NET 8.0 SDK'
    inputs:
      packageType: 'sdk'
      version: '8.0.x'
      installationPath: $(Agent.ToolsDirectory)/dotnet
  - script: |
      dotnet restore
      dotnet build --configuration Release
  - task: DotNetCoreCLI@2
    displayName: 'dotnet publish'
    inputs:
      command: publish
      arguments: '--configuration Release --output $(System.DefaultWorkingDirectory)/publish_output'
      projects: 'csharp/*.csproj'
      publishWebProjects: false
      modifyOutputPath: false
      zipAfterPublish: false
  - task: ArchiveFiles@2
    displayName: "Archive files"
    inputs:
      rootFolderOrFile: "$(System.DefaultWorkingDirectory)/publish_output"
      includeRootFolder: false
      archiveFile: "$(System.DefaultWorkingDirectory)/build$(Build.BuildId).zip"
  - task: PublishBuildArtifacts@1
    inputs:
      PathtoPublish: '$(System.DefaultWorkingDirectory)/build$(Build.BuildId).zip'
      artifactName: 'drop'
  ```

#### [JavaScript](#tab/javascript)

You can use the following sample to create a YAML file to build a JavaScript app:

```yaml
pool:
  vmImage: ubuntu-latest # Use 'windows-latest' if you have Windows native +Node modules
steps:
- bash: |
    npm install 
    npm run build --if-present
    npm prune --omit=dev
- task: ArchiveFiles@2
  displayName: "Archive files"
  inputs:
    rootFolderOrFile: "$(System.DefaultWorkingDirectory)"
    includeRootFolder: false
    archiveFile: "$(System.DefaultWorkingDirectory)/build$(Build.BuildId).zip"
- task: PublishBuildArtifacts@1
  inputs:
    PathtoPublish: '$(System.DefaultWorkingDirectory)/build$(Build.BuildId).zip'
    artifactName: 'drop'
```

#### [Python](#tab/python)

Use one of the following samples to create a YAML file to build an app for a specific Python version. Python is only supported for function apps running on Linux.

```yaml
pool:
  vmImage: ubuntu-latest
steps:
- task: UsePythonVersion@0
  displayName: "Set Python version to 3.11"
  inputs:
    versionSpec: '3.11'
    architecture: 'x64'
- bash: |
    if [ -f extensions.csproj ]
    then
        dotnet build extensions.csproj --output ./bin
    fi
    pip install --target="./.python_packages/lib/site-packages" -r ./requirements.txt
- task: ArchiveFiles@2
  displayName: "Archive files"
  inputs:
    rootFolderOrFile: "$(System.DefaultWorkingDirectory)"
    includeRootFolder: false
    archiveFile: "$(System.DefaultWorkingDirectory)/build$(Build.BuildId).zip"
- task: PublishBuildArtifacts@1
  inputs:
    PathtoPublish: '$(System.DefaultWorkingDirectory)/build$(Build.BuildId).zip'
    artifactName: 'drop'
```

To learn about potential issues with these pipeline tasks, see [Functions not found after deployment](recover-python-functions.md#functions-not-found-after-deployment). 

#### [PowerShell](#tab/powershell)

You can use the following sample to create a YAML file to package a PowerShell app. 

```yaml
pool:
  vmImage: 'windows-latest'
steps:
- task: ArchiveFiles@2
  displayName: "Archive files"
  inputs:
    rootFolderOrFile: "$(System.DefaultWorkingDirectory)"
    includeRootFolder: false
    archiveFile: "$(System.DefaultWorkingDirectory)/build$(Build.BuildId).zip"
- task: PublishBuildArtifacts@1
  inputs:
    PathtoPublish: '$(System.DefaultWorkingDirectory)/build$(Build.BuildId).zip'
    artifactName: 'drop'
```
---

::: zone-end

## Deploy your app

::: zone pivot="v2"
You'll deploy with the [Azure Function App Deploy v2](/azure/devops/pipelines/tasks/reference/azure-function-app-v2) task. This task requires an [Azure service connection](/azure/devops/pipelines/library/service-endpoints) as an input. An Azure service connection stores the credentials to connect from Azure Pipelines to Azure. You should create a connection that uses [workload identity federation](/azure/devops/pipelines/library/connect-to-azure#create-an-azure-resource-manager-service-connection-that-uses-workload-identity-federation).

To deploy to Azure Functions, add this snippet at the end of your `azure-pipelines.yml` file, depending on whether your app runs on Linux or Windows: 

### [Windows App](#tab/windows)
```yaml
trigger:
- main

variables:
  # Azure service connection established during pipeline creation
  azureSubscription: <Name of your Azure subscription>
  appName: <Name of the function app>
  # Agent VM image name
  vmImageName: 'windows-latest'

- task: AzureFunctionApp@2 # Add this at the end of your file
  inputs:
    azureSubscription: <Name of your Azure subscription>
    appType: functionApp # this specifies a Windows-based function app
    appName: $(appName)
    package: $(System.DefaultWorkingDirectory)/build$(Build.BuildId).zip
    deploymentMethod: 'auto' # 'auto' | 'zipDeploy' | 'runFromPackage'. Required. Deployment method. Default: auto.
    #Uncomment the next lines to deploy to a deployment slot
    #Note that deployment slots is not supported for Linux Dynamic SKU
    #deployToSlotOrASE: true
    #resourceGroupName: '<RESOURCE_GROUP>'
    #slotName: '<SLOT_NAME>'
```

### [Linux App](#tab/linux)
```yaml
trigger:
- main

variables:
  # Azure service connection established during pipeline creation
  azureSubscription: <Name of your Azure subscription>
  appName: <Name of the function app>
  # Agent VM image name
  vmImageName: 'ubuntu-latest'

- task: AzureFunctionApp@2 # Add this at the end of your file
  inputs:
    azureSubscription: <Name of your Azure subscription>
    appType: functionAppLinux # This specifies a Linux-based function app
    #isFlexConsumption: true # Uncomment this line if you are deploying to a Flex Consumption app
    appName: $(appName)
    package: $(System.DefaultWorkingDirectory)/build$(Build.BuildId).zip
    deploymentMethod: 'auto' # 'auto' | 'zipDeploy' | 'runFromPackage'. Required. Deployment method. Default: auto.
```

---

The default `appType` is Windows (`functionApp`). You can specify Linux by setting the `appType` to `functionAppLinux`. A [Flex Consumption](/azure/azure-functions/flex-consumption-plan) app runs on Linux, and you to must set both `appType: functionAppLinux` and `isFlexConsumption: true`. 

The snippet assumes that the build steps in your YAML file produce the zip archive in the `$(System.ArtifactsDirectory)` folder on your agent.
::: zone-end  
::: zone pivot="v1"
You deploy using the [Azure Function App Deploy](/azure/devops/pipelines/tasks/deploy/azure-function-app) task. This task requires an [Azure service connection](/azure/devops/pipelines/library/service-endpoints) as an input. An Azure service connection stores the credentials to connect from Azure Pipelines to Azure.

>[!IMPORTANT]  
>Deploying to a Flex Consumption app isn't supported using @v1 of the `AzureFunctionApp` task.

To deploy to Azure Functions, add this snippet at the end of your `azure-pipelines.yml` file: 

```yaml
trigger:
- main

variables:
  # Azure service connection established during pipeline creation
  azureSubscription: <Name of your Azure subscription>
  appName: <Name of the function app>
  # Agent VM image name
  vmImageName: 'ubuntu-latest'

- task: DownloadBuildArtifacts@1 # Add this at the end of your file
  inputs:
    buildType: 'current'
    downloadType: 'single'
    artifactName: 'drop'
    itemPattern: '**/*.zip'
    downloadPath: '$(System.ArtifactsDirectory)'
- task: AzureFunctionApp@1
  inputs:
    azureSubscription: $(azureSubscription)
    appType: functionAppLinux # default is functionApp
    appName: $(appName)
    package: $(System.ArtifactsDirectory)/**/*.zip
```

This snippet sets the `appType` to `functionAppLinux`, which is required when deploying to an app that runs on Linux. The default `appType` is Windows (`functionApp`).

The example assumes that the build steps in your YAML file produce the zip archive in the `$(System.ArtifactsDirectory)` folder on your agent.
::: zone-end 

## Deploy a container

>[!TIP]
>We recommend using the Azure Functions support in Azure Container Apps for hosting your function app in a custom Linux container. For more information, see [Azure Functions on Azure Container Apps overview](../container-apps/functions-overview.md).   

When deploying a containerized function app, the deployment task you use depends on the specific hosting environment. 

### [Azure Container Apps hosting](#tab/container-apps)

You can use the [Azure Container Apps Deploy](/azure/devops/pipelines/tasks/reference/azure-container-apps-v1) task (`AzureContainerApps`) to deploy a function app image to an Azure Container App instance that is optimized for Azure Functions. 

This code deploys the base image for a .NET 8 isolated process model function app:

```yaml
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: AzureContainerApps@1
  inputs:
    azureSubscription: <Name of your Azure subscription>
    imageToDeploy: 'mcr.microsoft.com/azure-functions/dotnet-isolated:4-dotnet-isolated8.0'
    containerAppName: <Name of your container app>
    resourceGroup: <Name of the resource group>
```

Ideally, you would build your own custom container in the pipeline instead of using a base image, as shown in this example. For more information, see [Deploy to Azure Container Apps from Azure Pipelines](../container-apps/azure-pipelines.md).

### [Azure Functions hosting](#tab/azure-functions)

While Azure Container Apps is the recommended host for containerized function apps, you can also deploy to a Functions-hosted container on Linux by using the [Azure Function App on Container Deploy](/azure/devops/pipelines/tasks/deploy/azure-rm-functionapp-containers) task (`AzureFunctionAppContainer`).

To deploy, add the following snippet at the end of your YAML file:

```yaml
trigger:
- main

variables:
  # Container registry service connection established during pipeline creation
  dockerRegistryServiceConnection: <Docker registry service connection>
  imageRepository: <Name of your image repository>
  containerRegistry: <Name of the Azure Container Registry>
  dockerfilePath: '$(Build.SourcesDirectory)/Dockerfile'
  tag: '$(Build.BuildId)'
  
  # Agent VM image name
  vmImageName: 'ubuntu-latest'

- task: AzureFunctionAppContainer@1 # Add this at the end of your file
  inputs:
    azureSubscription: '<Azure service connection>'
    appName: '<Name of the function app>'
    imageName: $(containerRegistry)/$(imageRepository):$(tag)
```

This snippet pushes the Docker image to your Azure Container Registry. The **Azure Function App on Container Deploy** task pulls the appropriate Docker image corresponding to the `BuildId` from the repository specified, and then deploys the image. 

For a complete end-to-end pipeline example, including building the container and publishing to the container registry, see [this Azure Pipelines container deployment example](https://github.com/Azure/azure-functions-on-container-apps/blob/main/samples/AzurePipelineTasks/Func_on_ACA_DevOps_deployment.yml).

---

## Deploy to a slot
:::zone pivot="v2"
>[!IMPORTANT]  
>The Flex Consumption plan doesn't currently support slots. 
>Linux apps also don't support slots when running in a Consumption plan, and [support for these apps is being retired in the future](./consumption-plan.md). 

### [Windows App](#tab/windows)
```yaml
trigger:
- main

variables:
  # Azure service connection established during pipeline creation
  azureSubscription: <Name of your Azure subscription>
  appName: <Name of the function app>
  # Agent VM image name
  vmImageName: 'windows-latest'

- task: AzureFunctionApp@2 # Add this at the end of your file
  inputs:
    azureSubscription: <Name of your Azure subscription>
    appType: functionApp # this specifies a Windows-based function app
    appName: $(appName)
    package: $(System.DefaultWorkingDirectory)/build$(Build.BuildId).zip
    deploymentMethod: 'auto' # 'auto' | 'zipDeploy' | 'runFromPackage'. Required. Deployment method. Default: auto.
    deployToSlotOrASE: true
    resourceGroupName: '<RESOURCE_GROUP>'
    slotName: '<SLOT_NAME>'
```

### [Linux App](#tab/linux)
```yaml
trigger:
- main

variables:
  # Azure service connection established during pipeline creation
  azureSubscription: <Name of your Azure subscription>
  appName: <Name of the function app>
  # Agent VM image name
  vmImageName: 'ubuntu-latest'

- task: AzureFunctionApp@2 # Add this at the end of your file
  inputs:
    azureSubscription: <Name of your Azure subscription>
    appType: functionAppLinux # This specifies a Linux-based function app
    #isFlexConsumption: true # Uncomment this line if you are deploying to a Flex Consumption app
    appName: $(appName)
    package: $(System.DefaultWorkingDirectory)/build$(Build.BuildId).zip
    deploymentMethod: 'auto' # 'auto' | 'zipDeploy' | 'runFromPackage'. Required. Deployment method. Default: auto.
    deployToSlotOrASE: true
    resourceGroupName: '<RESOURCE_GROUP>'
    slotName: '<SLOT_NAME>'
```

---

:::zone-end
::: zone pivot="v1"
You can configure your function app to have multiple slots. Slots allow you to safely deploy your app and test it before making it available to your customers.

The following YAML snippet shows how to deploy to a staging slot, and then swap to a production slot:

```yaml
- task: AzureFunctionApp@1
  inputs:
    azureSubscription: <Azure service connection>
    appType: functionAppLinux
    appName: <Name of the function app>
    package: $(System.ArtifactsDirectory)/**/*.zip
    deployToSlotOrASE: true
    resourceGroupName: <Name of the resource group>
    slotName: staging

- task: AzureAppServiceManage@0
  inputs:
    azureSubscription: <Azure service connection>
    WebAppName: <name of the function app>
    ResourceGroupName: <name of resource group>
    SourceSlot: staging
    SwapWithProduction: true
```
::: zone-end

When using [deployment slots](functions-deployment-slots.md), you can also add the following task to perform a slot swap as part of your deployment. 

```yaml
- task: AzureAppServiceManage@0
  inputs:
    azureSubscription: <AZURE_SERVICE_CONNECTION>
    WebAppName: <APP_NAME>
    ResourceGroupName: <RESOURCE_GROUP>
    SourceSlot: <SLOT_NAME>
    SwapWithProduction: true
```

## Create a pipeline with Azure CLI

To create a build pipeline in Azure, use the `az functionapp devops-pipeline create` [command](/cli/azure/functionapp/devops-pipeline#az-functionapp-devops-pipeline-create). The build pipeline is created to build and release any code changes that are made in your repo. The command generates a new YAML file that defines the build and release pipeline and then commits it to your repo. The prerequisites for this command depend on the location of your code.

- If your code is in GitHub:

    - You must have **write** permissions for your subscription.

    - You must be the project administrator in Azure DevOps.

    - You must have permissions to create a GitHub personal access token (PAT) that has sufficient permissions. For more information, see [GitHub PAT permission requirements.](/azure/devops/pipelines/repos/github#repository-permissions-for-personal-access-token-pat-authentication)

    - You must have permissions to commit to the main branch in your GitHub repository so you can commit the autogenerated YAML file.

- If your code is in Azure Repos:

    - You must have **write** permissions for your subscription.

    - You must be the project administrator in Azure DevOps.

## Next steps

- Review the [Azure Functions overview](functions-overview.md).
- Review the [Azure DevOps overview](/azure/devops/pipelines/).
