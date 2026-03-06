---
title: Deploy a container app using Azure Pipelines
description: Learn how to deploy your custom Windows container app stored in Azure Repos to Azure App Service via an Azure Pipelines CI/CD pipeline.
ms.topic: how-to
ms.date: 03/02/2026
author: jefmarti
ms.author: jefmarti
ms.service: azure-app-service 
# As a developer, I want to use Azure Pipelines to deploy a Windows container app to App Service so that I can deploy my containerized apps stored in Azure Repos to App Service using CI/CD.
---

# Deploy a container app using Azure Pipelines

This article describes how to deploy a Windows container application to Azure App Service from an Azure Repos Git repository using Azure Pipelines continuous integration and continuous delivery (CI/CD). Azure Repos and Azure Pipelines are complimentary Azure DevOps services that enable you to host, build, plan, and test your code using any platform and cloud. The pipeline is defined as a YAML file in the root directory of your repository.

## Prerequisites

- An Azure account with an Azure Container Registry registry instance and a Web App created in Azure App Service. [Create an Azure account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure DevOps organization and project, with a Windows app that runs in a Docker container and a supporting Dockerfile checked into an [Azure Repos](https://docs.github.com/get-started/quickstart/create-a-repo) repository in your project.
- The appropriate user roles or permissions to create and manage Azure resources and Azure DevOps projects, pipelines, repos, and service connections. For more information, see [Manage security in Azure Pipelines](/azure/devops/pipelines/policies/permissions).

## Add a service connection

Before creating this pipeline, you must create an Azure service connection to Azure Container Registry. In Azure DevOps, select **Project Settings** for your project, and create the service connection by following the instructions at [Create a service connection](/azure/devops/pipelines/library/service-endpoints#create-a-service-connection).

To create the service connection for this project and pipeline, choose **Docker Registry** and then choose **Azure Container Registry** as the registry type. After you create the service connection, copy its **ID** to use in a later step.

## Create and configure the pipeline

Create and configure a pipeline to run the steps for building the container, pushing to the registry, and deploying the image to App Service.

Create the pipeline by following these steps:

1. In your project in Azure DevOps, select **Pipelines** from the left navigation menu and then select **Create** or **Create Pipeline**.
1. On the **Where is your code** screen, select **Azure Repos Git**.
1. On the **Choose a repository** screen, select the repository that contains your app.
1. On the **Configure your pipeline** screen, select **Starter pipeline**.
1. Select the dropdown arrow next to **Save and run** at upper right and select **Save**, and then select **Save** again. Don't run the pipeline yet.

### Create variables

You can create pipeline variables to reuse frequently used values or protect secure information you don't want others to access. For more information, see [Define variables](/azure/devops/pipelines/process/variables).

1. Select **Edit** at upper right on the pipeline page, and then select **Variables** at upper right on the editing page.
1. On the **Variables** screen, select **New variable**.
1. Add the following name/value pairs, using your own information for the placeholder values. Select **OK** after adding each variable and then select **+** to add the next variable. If the value is a secret, select the checkbox to **Keep this value secret**.

   - vmImageName: windows-latest
   - imageRepository: \<repository-name>
   - dockerfilePath: $(Build.SourcesDirectory)/\<folder-path>/Dockerfile
   - dockerRegistryServiceConnection: \<service-connection-ID>

1. After adding the variables, select **Save** on the **Variables** screen, and select **Save** again on the pipeline page.

### Add a task to build and push the image

Replace all of the existing code in the *azure-pipelines.yml* starter file with the following code. This code adds a Docker task that builds and pushes the image to Azure Container Registry. The code uses the `$(<variable-name>)` syntax to call the variables you set up earlier.

```yaml
trigger:
  - main

pool:
  vmImage: 
   $(vmImageName) 

stages:
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
```

### Add the App Service deploy task

Add the deployment task to Azure App Service. This task requires you to specify your Azure subscription name, web app name, and container registry name.

1. Add the deployment stage to the *azure-pipelines.yml* file by adding the following code to the end of the file.

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

1. Place your cursor on a new line at the end of the file, and if necessary, select the **Show assistant** icon at right to show the **Tasks** pane. In the **Tasks** pane, search for and select the **Azure App Service deploy** task.
1. On the **Azure App Service deploy** screen, complete the following information:

   - **Connection type**: Select **Azure Resource Manager**.
   - **Azure subscription**: Select  your Azure subscription name and ID. If necessary, select **Authorize**.
   - **App Service type**: Select **Web App for Containers (Windows)**.
   - **App Service name**: Select or enter your App Service web app name.
   - **Registry or Namespace**: Enter your Azure Container Registry instance name.
   - **Image**: Enter the repository name where your code is stored.

1. Select **Add**. The following code appends to the end of the file, with your values replacing the placeholders.

   ```yaml
    - task: AzureRmWebAppDeployment@4
      inputs:
        ConnectionType: 'AzureRM'
        azureSubscription: '<your subscription name (subscription ID)>'
        appType: 'webAppHyperVContainer'
        WebAppName: '<your App Service web app name>'
        DockerNamespace: '<your Azure Container Registry instance name>'
        DockerRepository: '<your repository name>'
   ```

## Run the pipeline

The pipeline is now ready to run.

1. Select **Validate and save**, and select **Save** again. 
1. Select **Run**, and select **Run** again.

The pipeline goes through the steps to build and push the Windows container image to Azure Container Registry and deploy the image to App Service.

The following code shows the full *azure-pipelines.yml* pipeline definition file with example values.

```yaml
trigger:
  - main

pool:
  vmImage: 
   $(vmImageName) 

stages:
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
        azureSubscription: 'mysubscription(00000000-0000-0000-0000-000000000000)'
        appType: 'webAppHyperVContainer'
        WebAppName: 'myWindowsDockerSample'
        DockerNamespace: 'mycontainerregistry'
        DockerRepository: 'myrepository'
```
