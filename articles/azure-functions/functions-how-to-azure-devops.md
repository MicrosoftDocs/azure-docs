---
title: Continuously update function app code using Azure Pipelines
description: Learn how to set up an Azure DevOps pipeline that targets Azure Functions.
author: juliakm
ms.topic: conceptual
ms.date: 02/25/2022
ms.author: jukullam
ms.custom: "devx-track-csharp, devx-track-python, devx-track-azurecli, devops-pipelines-deploy"
ms.devlang: azurecli
---

# Continuous delivery with Azure Pipelines

Use [Azure Pipelines](/azure/devops/pipelines/) to automatically deploy to Azure Functions. Azure Pipelines lets you build, test, and deploy with continuous integration (CI) and continuous delivery (CD) using [Azure DevOps](/azure/devops/). 

YAML pipelines are defined using a YAML file in your repository. A step is the smallest building block of a pipeline and can be a script or task (pre-packaged script). [Learn about the key concepts and components that make up a pipeline](/azure/devops/pipelines/get-started/key-pipelines-concepts).

YAML pipelines aren't available for Azure DevOps 2019 and earlier.
## Prerequisites

* A GitHub account, where you can create a repository. If you don't have one, you can [create one for free](https://github.com).

* An Azure DevOps organization. If you don't have one, you can [create one for free](/azure/devops/pipelines/get-started/pipelines-sign-up). If your team already has one, then make sure you're an administrator of the Azure DevOps project that you want to use.

* An ability to run pipelines on Microsoft-hosted agents. You can either purchase a [parallel job](/azure/devops/pipelines/licensing/concurrent-jobs) or you can request a free tier. 

## Create your function app

This is a step-by-step guide to using Azure Pipelines with Azure Functions.
# [.NET Core](#tab/dotnet-core)

If you already have an app at GitHub that you want to deploy, you can try creating a pipeline for that code.

To use sample code instead, fork this GitHub repo:

```
    https://github.com/microsoft/devops-project-samples/tree/master/dotnet/aspnetcore/functionApp
```

# [Java](#tab/java)

If you already have an app at GitHub that you want to deploy, you can try creating a pipeline for that code.

To use sample code instead, fork this GitHub repo:
```
    https://github.com/MicrosoftDocs/pipelines-java-function
```

# [Nodejs](#tab/nodejs)

If you already have an app at GitHub that you want to deploy, you can try creating a pipeline for that code.

To use sample code instead, fork this GitHub repo:
```
    https://github.com/microsoft/devops-project-samples/tree/master/node/plain/functionApp
```
***

## Build your app

# [YAML](#tab/yaml)

1. Sign in to your Azure DevOps organization and navigate to your project.
1. In your project, navigate to the **Pipelines** page. Then choose the action to create a new pipeline.
1. Walk through the steps of the wizard by first selecting **GitHub** as the location of your source code.
1. You might be redirected to GitHub to sign in. If so, enter your GitHub credentials.
1. When the list of repositories appears, select your sample app repository.
1. Azure Pipelines will analyze your repository and recommend a template. Select **Save and run**, then select **Commit directly to the main branch**, and then choose **Save and run** again.
1. A new run is started. Wait for the run to finish.

# [Classic](#tab/classic)

To get started: 

How you build your app in Azure Pipelines depends on your app's programming language. Each language has specific build steps that create a deployment artifact. A deployment artifact is used to update your function app in Azure.

To use built-in build templates, when you create a new build pipeline, select **Use the classic editor** to create a pipeline by using designer templates.

![Select the Azure Pipelines classic editor](media/functions-how-to-azure-devops/classic-editor.png)

After you configure the source of your code, search for Azure Functions build templates. Select the template that matches your app language.

![Select an Azure Functions build template](media/functions-how-to-azure-devops/build-templates.png)

In some cases, build artifacts have a specific folder structure. You might need to select the **Prepend root folder name to archive paths** check box.

![The option to prepend the root folder name](media/functions-how-to-azure-devops/prepend-root-folder.png)

---

### Example YAML build pipelines

The following language-specific pipelines can be used for building apps. 
# [C\#](#tab/csharp)

You can use the following sample to create a YAML file to build a .NET app:

```yaml
pool:
  vmImage: 'windows-latest'
steps:
- script: |
    dotnet restore
    dotnet build --configuration Release
- task: DotNetCoreCLI@2
  inputs:
    command: publish
    arguments: '--configuration Release --output publish_output'
    projects: '*.csproj'
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

# [JavaScript](#tab/javascript)

You can use the following sample to create a YAML file to build a JavaScript app:

```yaml
pool:
  vmImage: ubuntu-latest # Use 'windows-latest' if you have Windows native +Node modules
steps:
- bash: |
    if [ -f extensions.csproj ]
    then
        dotnet build extensions.csproj --output ./bin
    fi
    npm install 
    npm run build --if-present
    npm prune --production
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

# [Python](#tab/python)

Use one of the following samples to create a YAML file to build an app for a specific Python version. Python is only supported for function apps running on Linux.

**Version 3.7**

```yaml
pool:
  vmImage: ubuntu-latest
steps:
- task: UsePythonVersion@0
  displayName: "Setting Python version to 3.7 as required by functions"
  inputs:
    versionSpec: '3.7'
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

**Version 3.6**

```yaml
pool:
  vmImage: ubuntu-latest
steps:
- task: UsePythonVersion@0
  displayName: "Setting Python version to 3.6 as required by functions"
  inputs:
    versionSpec: '3.6'
    architecture: 'x64'
- bash: |
    if [ -f extensions.csproj ]
    then
        dotnet build extensions.csproj --output ./bin
    fi
    pip install --target="./.python_packages/lib/python3.6/site-packages" -r ./requirements.txt
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

# [PowerShell](#tab/powershell)

You can use the following sample to create a YAML file to package a PowerShell app. PowerShell is supported only for Windows Azure Functions.

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

## Deploy your app

You'll deploy with the [Azure Function App Deploy](/azure/devops/pipelines/tasks/deploy/azure-function-app) task. This task requires an [Azure service connection](/azure/devops/pipelines/library/service-endpoints) as an input. An Azure service connection stores the credentials to connect from Azure Pipelines to Azure.

# [YAML](#tab/yaml)

To deploy to Azure Functions, add the following snippet at the end of your `azure-pipelines.yml` file. The default `appType` is Windows. You can specify Linux by setting the `appType` to `functionAppLinux`.

```yaml
trigger:
- main

variables:
  # Azure service connection established during pipeline creation
  azureSubscription: <Name of your Azure subscription>
  appName: <Name of the function app>
  # Agent VM image name
  vmImageName: 'ubuntu-latest'

- task: AzureFunctionApp@1 # Add this at the end of your file
  inputs:
    azureSubscription: <Azure service connection>
    appType: functionAppLinux # default is functionApp
    appName: $(appName)
    package: $(System.ArtifactsDirectory)/**/*.zip
    #Uncomment the next lines to deploy to a deployment slot
    #Note that deployment slots is not supported for Linux Dynamic SKU
    #deployToSlotOrASE: true
    #resourceGroupName: '<Resource Group Name>'
    #slotName: '<Slot name>'
```

The snippet assumes that the build steps in your YAML file produce the zip archive in the `$(System.ArtifactsDirectory)` folder on your agent.

# [Classic](#tab/classic)

You'll need to create a separate release pipeline to deploy to Azure Functions. When you create a new release pipeline, search for the Azure Functions release template.

![Search for the Azure Functions release template](media/functions-how-to-azure-devops/release-template.png)

---

## Deploy a container

You can automatically deploy your code to Azure Functions as a custom container after every successful build. To learn more about containers, see [Create a function on Linux using a custom container](functions-create-function-linux-custom-image.md). 
### Deploy with the Azure Function App for Container task

# [YAML](#tab/yaml/)

The simplest way to deploy to a container is to use the [Azure Function App on Container Deploy task](/azure/devops/pipelines/tasks/deploy/azure-rm-functionapp-containers).

To deploy, add the following snippet at the end of your YAML file:

```yaml
trigger:
- main

variables:
  # Container registry service connection established during pipeline creation
  dockerRegistryServiceConnection: <Docker registry service connection>
  imageRepository: <Name of your image repository>
  containerRegistry: <Name of the Azure container registry>
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

The snippet pushes the Docker image to your Azure Container Registry. The **Azure Function App on Container Deploy** task pulls the appropriate Docker image corresponding to the `BuildId` from the repository specified, and then deploys the image.

# [Classic](#tab/classic/)

The best way to deploy your function app as a container is to use the [Azure Function App on Container Deploy task](/azure/devops/pipelines/tasks/deploy/azure-rm-functionapp-containers) in your release pipeline.


How you deploy your app depends on your app's programming language. Each language has a template with specific deploy steps. If you can't find a template for your language, select the generic **Azure App Service Deployment** template.

---
## Deploy to a slot

# [YAML](#tab/yaml)

You can configure your function app to have multiple slots. Slots allow you to safely deploy your app and test it before making it available to your customers.

The following YAML snippet shows how to deploy to a staging slot, and then swap to a production slot:

```yaml
- task: AzureFunctionApp@1
  inputs:
    azureSubscription: <Azure service connection>
    appType: functionAppLinux
    appName: <Name of the Function app>
    package: $(System.ArtifactsDirectory)/**/*.zip
    deployToSlotOrASE: true
    resourceGroupName: <Name of the resource group>
    slotName: staging

- task: AzureAppServiceManage@0
  inputs:
    azureSubscription: <Azure service connection>
    WebAppName: <name of the Function app>
    ResourceGroupName: <name of resource group>
    SourceSlot: staging
    SwapWithProduction: true
```
# [Classic](#tab/classic)

You can configure your function app to have multiple slots. Slots allow you to safely deploy your app and test it before making it available to your customers.

Use the option **Deploy to Slot** in the **Azure Function App Deploy** task to specify the slot to deploy to. You can swap the slots by using the **Azure App Service Manage** task.

---
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
