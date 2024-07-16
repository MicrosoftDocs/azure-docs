---
title: Deploy with Azure Pipelines
description: Learn how to use Azure Pipelines to deploy your custom Windows container to App Service from a CI/CD pipeline.
ms.topic: article
ms.date: 6/10/2024
author: jefmarti
ms.author: jefmarti
---

# Deploy a custom container to App Service using Azure Pipelines

Azure DevOps enables you to host, build, plan, and test your code with complimentary workflows. Using Azure Pipelines as one of these workflows allows you to deploy your application with CI/CD that works with any platform and cloud. A pipeline is defined as a YAML file in the root directory of your repository.

In this article, we use Azure Pipelines to deploy a Windows container application to App Service from a Git repository in Azure DevOps. It assumes you already have a .NET application with a supporting dockerfile in Azure DevOps.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure DevOps organization. [Create one for free](/azure/devops/pipelines/get-started/pipelines-sign-up). 
- A working Windows app with Dockerfile hosted on [Azure Repos](https://docs.github.com/get-started/quickstart/create-a-repo). 

## Add a Service Connection
Before you create your pipeline, you should first create your Service Connection since you'll be asked to choose and verify your connection when creating your template. A Service Connection allows you to connect to your registry of choice (ACR or Docker Hub) when using the task templates. When adding a new service connection, choose the Docker Registry option. The following form asks you to choose Docker Hub or Azure Container Registry along with pertaining information. To follow along with this tutorial, use Azure Container Registry. You can create a new Service Connection following the directions [here](/azure/devops/pipelines/library/service-endpoints).

## Secure your secrets
Since we're using sensitive information that you don't want others to access, we use variables to protect our information. Create a variable by following the directions [here](/azure/devops/pipelines/process/variables).

To add a Variable, you click the **Variables** button next to the Save button in the top-right of the editing view for your pipeline. Select the **New Variable** button and enter your information. Add the variables below with your own secrets appropriate from each resource.

- vmImageName: 'windows-latest'
- imageRepository: 'your-image-repo-name'
- dockerfilePath: '$(Build.SourcesDirectory)/path/to/Dockerfile'
- dockerRegistryServiceConnection: 'your-service-connection-number'

## Create a new pipeline
Once your repository is created with your .NET application and supporting dockerfile, you can create your pipeline following these steps.

1. Navigate to **Pipelines** on the left menu bar and click on the **Create pipeline** button
1. On the next screen, select **Azure Repos Git** as your repository option and select the repository where your code is
1. Under the Configure tab, choose the **Starter Pipeline** option
1. Under the next Review tab, click the **Save** button

## Build and push image to Azure container registry
After your pipeline is created and saved, you'll need to edit the pipeline to run the steps for building the container, pushing to a registry, and deploying the image to App Service. To start, navigate to the **Pipelines** menu, choose your pipeline that you created and click the **Edit** button.

First, you need to add the docker task so you can build the image. Add the following code and replace the Dockerfile: app/Dockerfile with the path to your Dockerfile.

```yaml
trigger:
 - main

 pool:
   vmImage: 'windows-latest' 

 variables:
   vmImageName: 'windows-latest'
   imageRepository: 'your-image-repo-name'
   dockerfilePath: '$(Build.SourcesDirectory)/path/to/Dockerfile'
   dockerRegistryServiceConnection: 'your-service-connection-number'

- stage: Build
  displayName: Build and push stage
  jobs:  
  - job: Build
    displayName: Build job
    pool:
      vmImage: $(vmImageName)
    steps:
    - task: Docker@2
      displayName: Build and push an image to container registry
      inputs:
        command: buildAndPush
        repository: $(imageRepository)
        dockerfile: $(dockerfilePath)
        containerRegistry: $(dockerRegistryServiceConnection)
        tags: |
          $(tag)
```

## Add the App Service deploy task
Next, you need to set up the deploy task. This requires your subscription name, application name, and container registry. Add a new stage to the yaml file by pasting the code below.

```yaml
- stage: Deploy
  displayName: Deploy to App Service
  jobs:
  - job: Deploy
    displayName: Deploy
    pool:
      vmImage: $(vmImageName)
    steps:
```

Next, navigate to the **Show assistant** tab in the upper right hand corner and find the **Azure App Service deploy** task and fill out the following form:

- Connection type: Azure Resource Manager
- Azure subscription: your-subscription-name
- App Service type: Web App for Containers (Windows)
- App Service name: your-app-name
- Registry or Namespace: your-azure-container-registry-namespace
- Image: your-azure-container-registry-image-name

Once you have those filled out, click the **Add** button to add the task below:

```yaml
- task: AzureRmWebAppDeployment@4
  inputs:
    ConnectionType: 'AzureRM'
    azureSubscription: 'my-subscription-name'
    appType: 'webAppHyperVContainer'
    WebAppName: 'my-app-name'
    DockerNamespace: 'myregsitry.azurecr.io'
    DockerRepository: 'dotnetframework:12'
```

After you've added the task the pipeline is ready to run. Click the **Validate and save** button and run the pipeline. The pipeline goes through the steps to build and push the Windows container image to Azure Container Registry and deploy the image to App Service.

Below is the example of the full yaml file:

```yaml
trigger:
 - main

 pool:
   vmImage: 'windows-latest' 

 variables:
   vmImageName: 'windows-latest'
   imageRepository: 'your-image-repo-name'
   dockerfilePath: '$(Build.SourcesDirectory)/path/to/Dockerfile'
   dockerRegistryServiceConnection: 'your-service-connection-number'

- stage: Build
  displayName: Build and push stage
  jobs:  
  - job: Build
    displayName: Build job
    pool:
      vmImage: $(vmImageName)
    steps:
    - task: Docker@2
      displayName: Build and push an image to container registry
      inputs:
        command: buildAndPush
        repository: $(imageRepository)
        dockerfile: $(dockerfilePath)
        containerRegistry: $(dockerRegistryServiceConnection)
        tags: |
          $(tag)

- stage: Deploy
  displayName: Deploy to App Service
  jobs:
  - job: Deploy
    displayName: Deploy
    pool:
      vmImage: $(vmImageName)
    steps:
    - task: AzureRmWebAppDeployment@4
		  inputs:
		    ConnectionType: 'AzureRM'
		    azureSubscription: 'my-subscription-name'
		    appType: 'webAppHyperVContainer'
		    WebAppName: 'my-app-name'
		    DockerNamespace: 'myregsitry.azurecr.io'
		    DockerRepository: 'dotnetframework:12'
```
