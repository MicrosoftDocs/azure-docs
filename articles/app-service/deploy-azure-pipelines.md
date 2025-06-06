---
title: Configure CI/CD with Pipelines
description: Learn how to deploy your code to Azure App Service from a CI/CD pipeline by using Azure Pipelines.
author: cephalin
ms.author: jukullam
ms.manager: mijacobs
ms.topic: how-to
ms.date: 06/04/2024
ms.custom: "devops-pipelines-deploy"

---

# Deploy to Azure App Service by using Azure Pipelines

**Azure DevOps Services | Azure DevOps Server 2020 | Azure DevOps Server 2019**

Use [Azure Pipelines](/azure/devops/pipelines/) to automatically deploy your web app to [Azure App Service](./overview.md) on every successful build. Azure Pipelines lets you build, test, and deploy with continuous integration and continuous delivery (CI/CD) by using [Azure DevOps](/azure/devops/).

YAML pipelines are defined by using a YAML file in your repository. A step is the smallest building block of a pipeline and can be a script or task (prepackaged script). [Learn about the key concepts and components that make up a pipeline](/azure/devops/pipelines/get-started/key-pipelines-concepts).

You use the [Azure Web App task (`AzureWebApp`)](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app) to deploy to Azure App Service in your pipeline. For more complicated scenarios, like when you need to use XML parameters in your deployment, you can use the [Azure App Service deploy task `AzureRmWebAppDeployment`](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app-deployment).

## Prerequisites:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure DevOps organization. [Create one for free](/azure/devops/pipelines/get-started/pipelines-sign-up).
- The ability to run pipelines on Microsoft-hosted agents. You can purchase a [parallel job](/azure/devops/pipelines/licensing/concurrent-jobs) or request a free tier.
- A working Azure App Service app with the code hosted on [GitHub](https://docs.github.com/en/get-started/quickstart/create-a-repo) or [Azure Repos](https://docs.github.com/en/get-started/quickstart/create-a-repo).
    - .NET: [Create an ASP.NET Core web app in Azure](quickstart-dotnetcore.md).
    - ASP.NET: [Create an ASP.NET Framework web app in Azure](./quickstart-dotnetcore.md?tabs=netframework48).
    - JavaScript: [Create a Node.js web app in Azure App Service](quickstart-nodejs.md).  
    - Java: [Create a Java app in Azure App Service](quickstart-java.md).
    - Python: [Create a Python app in Azure App Service](quickstart-python.md).

## 1. Create a pipeline for your stack

The code examples in this section assume that you're deploying an ASP.NET web app. You can adapt the instructions for other frameworks.

Learn more about [Azure Pipelines ecosystem support](/azure/devops/pipelines/ecosystems/ecosystems).

# [YAML](#tab/yaml/)

1. Sign in to your Azure DevOps organization and go to your project.

1. Go to **Pipelines** and select **New Pipeline**.

1. When prompted, select the location of your source code: either **Azure Repos Git** or **GitHub**.

   You might be redirected to GitHub to sign in. If so, enter your GitHub credentials.

1. When the list of repositories appears, select your repository.

1. You might be redirected to GitHub to install the Azure Pipelines app. If so, select **Approve & install**.

1. When the **Configure** tab appears, select **ASP.NET Core**.

1. When your new pipeline appears, take a look at the YAML to see what it does. When you're ready, select **Save and run**.

# [Classic](#tab/classic/)

To get started:

1. Create a pipeline and select the **ASP.NET Core** template. This selection automatically adds the tasks required to build the code in the sample repository.

1. To see it in action, save the pipeline and queue a build.

    The **ASP.NET Core** pipeline template publishes the deployment ZIP file as an Azure artifact for the deployment task in the next step.

-----

## 2. Add the deployment task

# [YAML](#tab/yaml/)

1. Select the end of the YAML file, and then select **Show assistant**.

1. Use the **Task assistant** to add the [Azure web app](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app) task.

    Alternatively, you can add the [Azure App Service deploy `AzureRmWebAppDeployment`](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app-deployment) task.

1. Choose your **Azure subscription**. Make sure to select **Authorize** to authorize your connection. The authorization creates the required service connection.

1. Select the **App type**, **App name**, and **Runtime stack** based on your App Service app. Your complete YAML should look similar to the following code.

    ```yaml
    variables:
      buildConfiguration: 'Release'
    
    steps:
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

    * `azureSubscription`: Name of the authorized service connection to your Azure subscription.
    * `appName`: Name of your existing app.
    * `package`: File path to the package or a folder containing your App Service contents. Wildcards are supported.

# [Classic](#tab/classic/)

To get started:

1. Create a [release pipeline](/azure/devops/pipelines/release/). Select **Releases** from the left menu and select **New pipeline**.

1. Select the **Azure App Service deployment** template for your stage. This step automatically adds the necessary tasks.

    > [!NOTE]
    > If you're deploying a Node.js app to App Service on Windows, select the **Deployed Node.js App to Azure App Service** template. The only difference between these templates is that the Node.js template configures the task to generate a `web.config` file that contains a parameter that starts the `iisnode` service.

1. To link this release pipeline to the Azure artifact from the previous step, select **Add an artifact** > **Build**.

1. In **Source (build pipeline)**, select the build pipeline you created in the previous section. Then select **Add**.

1. To see it in action, save the release pipeline and create a release.

---

### Example: Deploy a .NET app

# [YAML](#tab/yaml/)

To deploy a .zip web package (for example, from an ASP.NET web app) to an Azure web app, use the following snippet to deploy the build to an app.

```yaml
variables:
  buildConfiguration: 'Release'

steps:
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

* `azureSubscription`: Your Azure subscription.
* `appType`: Your web app type.
* `appName`: The name of your existing app service.
* `package`: File path to the package or a folder containing your App Service contents. Wildcards are supported.

# [Classic](#tab/classic/)

For classic pipelines, it's easier to define build and release stages in separate panes (**Pipelines** and **Releases**, respectively).

* On the **Pipelines** pane, build and test your app by using the template of your choice, such as **ASP.NET Core**, **Node.js with Grunt**, **Maven**, or others. Publish an artifact.
* On the **Release** pane, use the generic **Azure App Service deployment** template to deploy the artifact.

There might be templates for specific programming languages to choose from.

---

## Example: Deploy to a virtual application

# [YAML](#tab/yaml/)

By default, your deployment happens to the root application in the Azure web app. You can deploy to a specific virtual application by using the `VirtualApplication` property of the Azure App Service deploy task `AzureRmWebAppDeployment`:

```yaml
- task: AzureRmWebAppDeployment@4
  inputs:
    VirtualApplication: '<name of virtual application>'
```

* `VirtualApplication`: The name of the virtual application configured in the Azure portal. For more information, see [Configure an App Service app in the Azure portal
](./configure-common.md).

# [Classic](#tab/classic/)

By default, your deployment happens to the root application in the Azure web app. If you want to deploy to a specific virtual application, enter its name in the **Virtual Application** property of the **Azure App Service deploy** task.

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

* `azureSubscription`: Your Azure subscription.
* `appType`: (Optional) Use `webAppLinux` to deploy to a web app on Linux.
* `appName`: The name of your existing app service.
* `deployToSlotOrASE*`: Boolean. Deploy to an existing deployment slot or Azure App Service Environment.
* `resourceGroupName`: Name of the resource group. Required if `deployToSlotOrASE` is true.
* `slotName`: Name of the slot, which defaults to `production`. Required if `deployToSlotOrASE` is true.
* `package`: File path to the package or a folder containing your App Service contents. Wildcards are supported.
* `SourceSlot`: Slot sent to production when `SwapWithProduction` is true.
* `SwapWithProduction`: Boolean. Swap the traffic of source slot with production.

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

To deploy to multiple web apps, add stages to your release pipeline. You can control the order of deployment. To learn more, see [Stages](/azure/devops/pipelines/process/stages).

---

## Example: Deploy conditionally

# [YAML](#tab/yaml/)

To deploy conditionally in YAML, you can use one of the following techniques:

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

* Set **branch filters** to configure the continuous deployment trigger on the artifact of the release pipeline.
* Set **pre-deployment approvals** or configure **gates** as a precondition for deployment to a stage.
* Specify conditions for a task to run.

To learn more, see [Release, branch, and stage triggers](/azure/devops/pipelines/release/triggers), [Release deployment control using approvals](/azure/devops/pipelines/release/approvals/approvals), [Release deployment control using gates](/azure/devops/pipelines/release/approvals/gates), and [Specify conditions for running a task](/azure/devops/pipelines/process/conditions).

---

## Example: Deploy using Web Deploy

The Azure App Service deploy task `AzureRmWebAppDeployment` can deploy to App Service by using Web Deploy.

# [YAML](#tab/yaml/)

```yml
trigger:
- main

pool:
  vmImage: windows-latest

variables:
  buildConfiguration: 'Release'

steps:
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

If you're using the **Azure App Service deployment** template in the release pipeline:

1. Select the **Tasks** tab, and then select **Deploy Azure App Service** (the `AzureRmWebAppDeployment` task).

1. In the dialog, make sure that **Connection type** is set to **Azure Resource Manager**.

1. In the dialog, expand **Additional Deployment Options** and choose **Select deployment method**. Make sure that **Web Deploy** is selected as the deployment method.

1. Save the release pipeline.

> [!NOTE]
> With the [`AzureRmWebAppDeployment@3`](/azure/devops/pipelines/tasks/reference/azure-rm-web-app-deployment-v3) and [`AzureRmWebAppDeployment@4`](/azure/devops/pipelines/tasks/reference/azure-rm-web-app-deployment-v4) tasks, you should use the **Azure Resource Manager** connection type or `AzureRM` when you deploy with **Web Deploy**. It uses publishing profiles for deployment when basic authentication is enabled for your app. When [basic authentication is disabled](configure-basic-auth-disable.md), it uses the more secure Microsoft Entra ID authentication.

---

## Frequently asked questions

### What's the difference between the `AzureWebApp` and `AzureRmWebAppDeployment` tasks?

The **Azure Web App** task `AzureWebApp` is the simplest way to deploy to an Azure web app. By default, your deployment happens to the root application in the Azure web app.

The [Azure App Service Deploy task (`AzureRmWebAppDeployment`)](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app-deployment) can handle more custom scenarios, such as:

* [Deploy with Web Deploy](#example-deploy-using-web-deploy), if you usually use the Internet Information Services (IIS) deployment process.
* [Deploy to virtual applications](#example-deploy-to-a-virtual-application).
* Deploy to other app types, like container apps, function apps, WebJobs, or API and mobile apps.

> [!NOTE]  
> The separate [File Transform task](/azure/devops/pipelines/tasks/utility/file-transform) also supports file transforms and variable substitution for use in Azure Pipelines. You can use the **File Transform** task to apply file transformations and variable substitutions on any configuration and parameters files.

### Why do I get the message "Invalid App Service package or folder path provided"?

In YAML pipelines, depending on your pipeline, there might be a mismatch between where your built web package is saved and where the deploy task is looking for it. For example, the `AzureWebApp` task picks up the web package for deployment. The `AzureWebApp` task might look in `$(System.DefaultWorkingDirectory)/**/*.zip`. If the web package is deposited elsewhere, modify the value of `package`.

### Why do I get the message "Publish using webdeploy options are supported only when using Windows agent"?

This error occurs in the `AzureRmWebAppDeployment` task when you configure the task to deploy using **Web Deploy**, but your agent isn't running Windows. Verify that your YAML includes something similar to the following code:

```yml
pool:
  vmImage: windows-latest
```

### Why doesn't Web Deploy work when I disable basic authentication?

For troubleshooting information on getting Microsoft Entra ID authentication to work with the `AzureRmWebAppDeployment` task, see [I can't Web Deploy to my Azure App Service using Microsoft Entra ID authentication from my Windows agent](/azure/devops/pipelines/tasks/reference/azure-rm-web-app-deployment-v4#i-cant-web-deploy-to-my-azure-app-service-using-microsoft-entra-id-authentication-from-my-windows-agent).

## Related content

* Customize your [Azure DevOps pipeline](/azure/devops/pipelines/customize-pipeline).
