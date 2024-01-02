---
title: Configure CI/CD with Azure Pipelines
description: Learn how to deploy your code to Azure App Service from a CI/CD pipeline with Azure Pipelines.
ms.topic: article
ms.date: 12/13/2023
ms.author: jukullam
ms.manager: mijacobs
ms.custom: "devops-pipelines-deploy"
author: cephalin

---

# Deploy to App Service using Azure Pipelines

**Azure DevOps Services | Azure DevOps Server 2020 | Azure DevOps Server 2019**

Use [Azure Pipelines](/azure/devops/pipelines/) to automatically deploy your web app to [Azure App Service](./overview.md) on every successful build. Azure Pipelines lets you build, test, and deploy with continuous integration (CI) and continuous delivery (CD) using [Azure DevOps](/azure/devops/). 

YAML pipelines are defined using a YAML file in your repository. A step is the smallest building block of a pipeline and can be a script or task (prepackaged script). [Learn about the key concepts and components that make up a pipeline](/azure/devops/pipelines/get-started/key-pipelines-concepts).

You'll use the [Azure Web App task (`AzureWebApp`)](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app) to deploy to Azure App Service in your pipeline. For more complicated scenarios such as needing to use XML parameters in your deploy, you can use the [Azure App Service deploy task (AzureRmWebAppDeployment)](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app-deployment).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure DevOps organization. [Create one for free](/azure/devops/pipelines/get-started/pipelines-sign-up). 
- An ability to run pipelines on Microsoft-hosted agents. You can either purchase a [parallel job](/azure/devops/pipelines/licensing/concurrent-jobs) or you can request a free tier. 
- A working Azure App Service app with code hosted on [GitHub](https://docs.github.com/en/get-started/quickstart/create-a-repo) or [Azure Repos](https://docs.github.com/en/get-started/quickstart/create-a-repo). 
    - .NET: [Create an ASP.NET Core web app in Azure](quickstart-dotnetcore.md)
    - ASP.NET: [Create an ASP.NET Framework web app in Azure](./quickstart-dotnetcore.md?tabs=netframework48)
    - JavaScript: [Create a Node.js web app in Azure App Service](quickstart-nodejs.md)  
    - Java: [Create a Java app on Azure App Service](quickstart-java.md)
    - Python: [Create a Python app in Azure App Service](quickstart-python.md)

## 1. Create a pipeline for your stack

The code examples in this section assume you're deploying an ASP.NET web app. You can adapt the instructions for other frameworks. 

Learn more about [Azure Pipelines ecosystem support](/azure/devops/pipelines/ecosystems/ecosystems).

# [YAML](#tab/yaml/)

1. Sign in to your Azure DevOps organization and navigate to your project.

1. Go to **Pipelines**, and then select **New Pipeline**.

1. When prompted, select the location of your source code: either **Azure Repos Git** or **GitHub**.

   You might be redirected to GitHub to sign in. If so, enter your GitHub credentials.

1. When the list of repositories appears, select your repository.

1. You might be redirected to GitHub to install the Azure Pipelines app. If so, select **Approve & install**.

1. When the **Configure** tab appears, select **ASP.NET Core**.

1. When your new pipeline appears, take a look at the YAML to see what it does. When you're ready, select **Save and run**.

# [Classic](#tab/classic/)

To get started: 

1. Create a pipeline and select the **ASP.NET Core** template. This selection automatically adds the tasks required to build the code in the sample repository.

2. Save the pipeline and queue a build to see it in action.

    The **ASP.NET Core** pipeline template publishes the deployment ZIP file as an Azure artifact for the deployment task later.

-----

## 2. Add the deployment task

# [YAML](#tab/yaml/)

1. Click the end of the YAML file, then select **Show assistant**.'

1. Use the Task assistant to add the [Azure Web App](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app) task. 

    :::image type="content" source="media/deploy-azure-pipelines/azure-web-app-task.png" alt-text="Screenshot of Azure web app task.":::

    Alternatively, you can add the [Azure App Service deploy (AzureRmWebAppDeployment)](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app-deployment) task.

1. Choose your **Azure subscription**. Make sure to **Authorize** your connection. The authorization creates the required service connection.

1. Select the **App type**, **App name**, and **Runtime stack** based on your App Service app. Your complete YAML should look similar to the following code. 

    ```yaml
    variables:
      buildConfiguration: 'Release'
    
    steps:
    - script: dotnet build --configuration $(buildConfiguration)
      displayName: 'dotnet build $(buildConfiguration)'
    - task: DotNetCoreCLI@2
      inputs:
        command: 'publish'
        publishWebProjects: true
    - task: AzureWebApp@1
      inputs:
        azureSubscription: '<service-connection-name>'
        appType: 'webAppLinux'
        appName: '<app-name>'
        package: '$(System.DefaultWorkingDirectory)/**/*.zip'
    ```

    * **azureSubscription**: Name of the authorized service connection to your Azure subscription.
    * **appName**: Name of your existing app.
    * **package**: Fike path to the package or a folder containing your app service contents. Wildcards are supported.

# [Classic](#tab/classic/)

To get started: 

1. Create a [release pipeline](/azure/devops/pipelines/release/) by selecting **Releases** from the left menu and select **New pipeline**. 

1. Select the **Azure App Service deployment** template for your stage. This automatically adds the necessary tasks. 

    > [!NOTE]
    > If you're deploying a Node.js app to App Service on Windows, select the **Deploy Node.js App to Azure App Service** template. The only difference between these templates is that Node.js template configures the task to generate a **web.config** file containing a parameter that starts the **iisnode** service.

1. To link this release pipeline to the Azure artifact from the previous step, select **Add an artifact** > **Build**. 

1. In **Source (build pipeline)**, select the build pipeline you created in the previous section, then select **Add**.

1. Save the release pipeline and create a release to see it in action.

---

### Example: Deploy a .NET app

# [YAML](#tab/yaml/)

To deploy a .zip web package (for example, from an ASP.NET web app) to an Azure Web App, use the following snippet to deploy the build to an app. 


```yaml
variables:
  buildConfiguration: 'Release'

steps:
- script: dotnet build --configuration $(buildConfiguration)
  displayName: 'dotnet build $(buildConfiguration)'
- task: DotNetCoreCLI@2
  inputs:
    command: 'publish'
    publishWebProjects: true
- task: AzureWebApp@1
  inputs:
    azureSubscription: '<service-connection-name>'
    appType: 'webAppLinux'
    appName: '<app-name>'
    package: '$(System.DefaultWorkingDirectory)/**/*.zip'
```

* **azureSubscription**: your Azure subscription.
* **appType**: your Web App type.
* **appName**: the name of your existing app service.
* **package**: the file path to the package or a folder containing your app service contents. Wildcards are supported.

# [Classic](#tab/classic/)

For classic pipelines, it's the easiest to define build and release stages in separate pages (**Pipelines** and **Releases**, respectively). In general, you:

- In the **Pipelines** page, build and test your app by using the template of your choice, such as **ASP.NET Core**, **Node.js with Grunt**, **Maven**, or others, and publish an artifact.
- In the **Release** page, use the generic **Azure App Service deployment** template to deploy the artifact. 

There may be templates for specific programming languages to choose from.

---

## Example: deploy to a virtual application

# [YAML](#tab/yaml/)

By default, your deployment happens to the root application in the Azure Web App. You can deploy to a specific virtual application by using the `VirtualApplication` property of the Azure App Service deploy (`AzureRmWebAppDeployment`) task:

```yaml
- task: AzureRmWebAppDeployment@4
  inputs:
    VirtualApplication: '<name of virtual application>'
```

* **VirtualApplication**: the name of the Virtual Application that's configured in the Azure portal. For more information, see [Configure an App Service app in the Azure portal
](./configure-common.md).

# [Classic](#tab/classic/)

By default, your deployment happens to the root application in the Azure Web App. If you want to deploy to a specific virtual application, enter its name in the **Virtual Application** property of the **Azure App Service deploy** task.

---

## Example: Deploy to a slot

# [YAML](#tab/yaml/)

The following example shows how to deploy to a staging slot, and then swap to a production slot:

```yaml
- task: AzureWebApp@1
  inputs:
    azureSubscription: '<service-connection-name>'
    appType: webAppLinux
    appName: '<app-name>'
    deployToSlotOrASE: true
    resourceGroupName: '<name of resource group>'
    slotName: staging
    package: '$(Build.ArtifactStagingDirectory)/**/*.zip'

- task: AzureAppServiceManage@0
  inputs:
    azureSubscription: '<service-connection-name>'
    appType: webAppLinux
    WebAppName: '<app-name>'
    ResourceGroupName: '<name of resource group>'
    SourceSlot: staging
    SwapWithProduction: true
```

* **azureSubscription**: your Azure subscription.
* **appType**: (optional) Use `webAppLinux` to deploy to a Web App on Linux.
* **appName**: the name of your existing app service.
* **deployToSlotOrASE**: Boolean. Deploy to an existing deployment slot or Azure App Service Environment.
* **resourceGroupName**: Name of the resource group. Required if `deployToSlotOrASE` is true. 
* **slotName**: Name of the slot, which defaults to `production`. Required if `deployToSlotOrASE` is true.
* **package**: the file path to the package or a folder containing your app service contents. Wildcards are supported.
* **SourceSlot**: Slot sent to production when `SwapWithProduction` is true. 
* **SwapWithProduction**: Boolean. Swap the traffic of source slot with production. 

# [Classic](#tab/classic/)

Use the option **Deploy to Slot or App Service Environment** in the **Azure Web App** task to specify the slot to deploy to. To swap the slots, use the **Azure App Service manage** task.

---

## Example: Deploy to multiple web apps

# [YAML](#tab/yaml/)

You can use [jobs](/azure/devops/pipelines/process/phases) in your YAML file to set up a pipeline of deployments. By using jobs, you can control the order of deployment to multiple web apps.

```yaml
jobs:
- job: buildandtest
  pool:
    vmImage: ubuntu-latest
 
  steps:
  # publish an artifact called drop
  - task: PublishPipelineArtifact@1
    inputs:
      targetPath: '$(Build.ArtifactStagingDirectory)' 
      artifactName: drop
  
  # deploy to Azure Web App staging
  - task: AzureWebApp@1
    inputs:
      azureSubscription: '<service-connection-name>'
      appType: <app type>
      appName: '<staging-app-name>'
      deployToSlotOrASE: true
      resourceGroupName: <group-name>
      slotName: 'staging'
      package: '$(Build.ArtifactStagingDirectory)/**/*.zip'

- job: deploy
  dependsOn: buildandtest
  condition: succeeded()

  pool: 
    vmImage: ubuntu-latest  
  
  steps:
    # download the artifact drop from the previous job
  - task: DownloadPipelineArtifact@2
    inputs:
      source: 'current'
      artifact: 'drop'
      path: '$(Pipeline.Workspace)'

  - task: AzureWebApp@1
    inputs:
      azureSubscription: '<service-connection-name>'
      appType: <app type>
      appName: '<production-app-name>'
      resourceGroupName: <group-name>
      package: '$(Pipeline.Workspace)/**/*.zip'
```

# [Classic](#tab/classic/)

If you want to deploy to multiple web apps, add stages to your release pipeline. You can control the order of deployment. To learn more, see [Stages](/azure/devops/pipelines/process/stages).

---

## Example: Make variable substitutions

For most language stacks, [app settings](./configure-common.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#configure-app-settings) and [connection strings](./configure-common.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#configure-connection-strings) can be set as environment variables at runtime.

But there are other reasons you would want to make variable substitutions to your *Web.config*. In this example, your Web.config file contains a connection string named `connectionString`. You can change its value before deploying to each web app. You can do this either by applying a Web.config transformation or by substituting variables in your Web.config file. 

# [YAML](#tab/yaml/)

The following snippet shows an example of variable substitution by using the Azure App Service Deploy (`AzureRmWebAppDeployment`) task:

```yaml
jobs:
- job: test
  variables:
    connectionString: <test-stage connection string>
  steps:
  - task: AzureRmWebAppDeployment@4
    inputs:
      azureSubscription: '<Test stage Azure service connection>'
      WebAppName: '<name of test stage web app>'
      enableXmlVariableSubstitution: true

- job: prod
  dependsOn: test
  variables:
    connectionString: <prod-stage connection string>
  steps:
  - task: AzureRmWebAppDeployment@4
    inputs:
      azureSubscription: '<Prod stage Azure service connection>'
      WebAppName: '<name of prod stage web app>'
      enableXmlVariableSubstitution: true
```

# [Classic](#tab/classic/)

To change `connectionString` by using variable substitution:

1. Create a release pipeline with two stages.
1. Link the artifact of the release to the build that produces the web package.
1. Define `connectionString` as a variable in each of the stages. Set the appropriate value.
1. Select the **XML variable substitution** option under **File Transforms and Variable Substitution Options** for the **Azure App Service Deploy** task.

---

## Example: Deploy conditionally

# [YAML](#tab/yaml/)

To do this in YAML, you can use one of the following techniques:

* Isolate the deployment steps into a separate job, and add a condition to that job.
* Add a condition to the step.

The following example shows how to use step conditions to deploy only builds that originate from the main branch:

```yaml
- task: AzureWebApp@1
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
  inputs:
    azureSubscription: '<service-connection-name>'
    appName: '<app-name>'
```

To learn more about conditions, see [Specify conditions](/azure/devops/pipelines/process/conditions).

# [Classic](#tab/classic/)

In your release pipeline, you can implement various checks and conditions to control the deployment:

* Set *branch filters* to configure the *continuous deployment trigger* on the artifact of the release pipeline.
* Set *pre-deployment approvals* as a precondition for deployment to a stage.
* Configure *gates* as a precondition for deployment to a stage.
* Specify conditions for a task to run.

To learn more, see [Release, branch, and stage triggers](/azure/devops/pipelines/release/triggers), [Release deployment control using approvals](/azure/devops/pipelines/release/approvals/approvals), [Release deployment control using gates](/azure/devops/pipelines/release/approvals/gates), and [Specify conditions for running a task](/azure/devops/pipelines/process/conditions).

---

## Example: deploy using Web Deploy

The Azure App Service deploy (`AzureRmWebAppDeployment`) task can deploy to App Service using Web Deploy.

# [YAML](#tab/yaml/)

```yml
trigger:
- main

pool:
  vmImage: windows-latest

variables:
  buildConfiguration: 'Release'

steps:
- script: dotnet build --configuration $(buildConfiguration)
  displayName: 'dotnet build $(buildConfiguration)'
- task: DotNetCoreCLI@2
  inputs:
    command: 'publish'
    publishWebProjects: true
    arguments: '--configuration $(buildConfiguration)'
    zipAfterPublish: true
- task: AzureRmWebAppDeployment@4
  inputs:
    ConnectionType: 'AzureRM'
    azureSubscription: '<service-connection-name>'
    appType: 'webApp'
    WebAppName: '<app-name>'
    packageForLinux: '$(System.DefaultWorkingDirectory)/**/*.zip'
    enableCustomDeployment: true
    DeploymentType: 'webDeploy'
```

# [Classic](#tab/classic/)

In the release pipeline, assuming you're using the **Azure App Service deployment** template:

1. Select the **Tasks** tab, then select **Deploy Azure App Service**. This is the `AzureRmWebAppDeployment` task.

1. In the dialog, make sure that **Connection type** is set to **Azure Resource Manager**.

1. In the dialog, expand **Additional Deployment Options** and select **Select deployment method**. Make sure that **Web Deploy** is selected as the deployment method.

1. Save the release pipeline.

> [!NOTE] 
> With the [`AzureRmWebAppDeployment@3`](/azure/devops/pipelines/tasks/reference/azure-rm-web-app-deployment-v3) and [`AzureRmWebAppDeployment@4`](/azure/devops/pipelines/tasks/reference/azure-rm-web-app-deployment-v4) tasks, you should use the **Azure Resource Manager** connection type, or `AzureRM`, when deploying with Web Deploy. It uses publishing profiles for deployment when basic authentication is enabled for your app, but it uses the more secure Entra ID authentication when [basic authentication is disabled](configure-basic-auth-disable.md).

---

## Frequently asked questions

#### What's the difference between the `AzureWebApp` and `AzureRmWebAppDeployment` tasks?

The Azure Web App task (`AzureWebApp`) is the simplest way to deploy to an Azure Web App. By default, your deployment happens to the root application in the Azure Web App.

The [Azure App Service Deploy task (`AzureRmWebAppDeployment`)](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app-deployment) can handle more custom scenarios, such as:

- [Modify configuration settings](#example-make-variable-substitutions) inside web packages and XML parameters files. 
- [Deploy with Web Deploy](#example-deploy-using-web-deploy), if you're used to the IIS deployment process.
- [Deploy to virtual applications](#example-deploy-to-a-virtual-application).
- Deploy to other app types, like Container apps, Function apps, WebJobs, or API and Mobile apps.

> [!NOTE]  
> File transforms and variable substitution are also supported by the separate [File Transform task](/azure/devops/pipelines/tasks/utility/file-transform) for use in Azure Pipelines. You can use the File Transform task to apply file transformations and variable substitutions on any configuration and parameters files.

#### I get the message "Invalid App Service package or folder path provided."

In YAML pipelines, depending on your pipeline, there may be a mismatch between where your built web package is saved and where the deploy task is looking for it. For example, the `AzureWebApp` task picks up the web package for deployment. For example, the AzureWebApp task looks in `$(System.DefaultWorkingDirectory)/**/*.zip`. If the web package is deposited elsewhere, modify the value of `package`.

#### I get the message "Publish using webdeploy options are supported only when using Windows agent."

This error occurs in the **AzureRmWebAppDeployment** task when you configure the task to deploy using Web Deploy, but your agent isn't running Windows. Verify that your YAML has something similar to the following code:

```yml
pool:
  vmImage: windows-latest
```

#### Web Deploy doesn't work when I disable basic authentication

For troubleshooting information on getting Microsoft Entra ID authentication to work with the `AzureRmWebAppDeployment` task, see [I can't Web Deploy to my Azure App Service using Microsoft Entra ID authentication from my Windows agent](/azure/devops/pipelines/tasks/reference/azure-rm-web-app-deployment-v4#i-cant-web-deploy-to-my-azure-app-service-using-microsoft-entra-id-authentication-from-my-windows-agent)

## Next steps

- Customize your [Azure DevOps pipeline](/azure/devops/pipelines/customize-pipeline).
