---
title: Configure CI/CD with Azure Pipelines
description: Learn how to use Azure Pipelines to deploy your app to Azure App Service with a YAML or Classic pipeline.
author: cephalin
ms.author: jukullam
ms.manager: mijacobs
ms.topic: how-to
ms.date: 09/04/2025
ms.custom: "devops-pipelines-deploy"
ms.service: azure-app-service
#customer intent: As a web app developer, I want to learn how to set up a pipeline using Azure Pipelines so I can deploy changes and updates to my web apps.
---

# Deploy to Azure App Service by using Azure Pipelines

**Azure DevOps Services** | **Azure DevOps Server 2022**

This article explains how to use [Azure Pipelines](/azure/devops/pipelines/) to automatically build, test, and deploy your web app to [Azure App Service](./overview.md). You can set up a continuous integration and continuous delivery (CI/CD) pipeline that runs whenever you check in a code change to a designated branch of your repository.

Pipelines consist of *stages*, *jobs*, and *steps*. A step is the smallest building block of a pipeline and can be a *script* or a *task*, which is a prepackaged script. For more information about the key concepts and components that make up a pipeline, see [Key Azure Pipelines concepts](/azure/devops/pipelines/get-started/key-pipelines-concepts).

You can use the [Azure Web App](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app) task in your pipeline to deploy to App Service. For more complex scenarios, like using XML parameters in deployments, you can use the [Azure App Service deploy](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app-deployment) task.

## Prerequisites

- A working Azure App Service app with code hosted on [GitHub](https://docs.github.com/get-started/quickstart/create-a-repo) or [Azure Repos](/azure/devops/repos/git/creatingrepo). You can use any of the following quickstart articles to create a sample app:

  - ASP.NET Core: [Create an ASP.NET Core web app in Azure](quickstart-dotnetcore.md)
  - ASP.NET: [Create an ASP.NET Framework web app in Azure](quickstart-dotnetcore.md?tabs=netframework48)
  - JavaScript: [Create a Node.js web app in Azure App Service](quickstart-nodejs.md)
  - Java: [Create a Java app in Azure App Service](quickstart-java.md)
  - Python: [Create a Python app in Azure App Service](quickstart-python.md)

- An Azure DevOps organization that has the ability to run pipelines on Microsoft-hosted agents. You need to request a free tier of parallel jobs or purchase parallel jobs. For more information, see [Configure and pay for parallel jobs](/azure/devops/pipelines/licensing/concurrent-jobs).

- A project created in the Azure DevOps organization where you have permission to create and authorize pipelines and Azure service connections. [Create a project in Azure DevOps](/azure/devops/organizations/projects/create-project).

>[!IMPORTANT]
>During GitHub procedures, you might be prompted to create a [GitHub service connection](/azure/devops/pipelines/library/service-endpoints#github-service-connection) or be redirected to GitHub to sign in, install the [Azure Pipelines](https://github.com/apps/azure-pipelines) GitHub app, authorize Azure Pipelines, or authenticate to GitHub organizations. Follow the onscreen instructions to complete the necessary processes. For more information, see [Access to GitHub repositories](/azure/devops/pipelines/repos/github#access-to-github-repositories).

## Create a pipeline

The code examples in this section are for an ASP.NET Core web app. You can adapt the instructions for other frameworks. For more information about Azure Pipelines ecosystem support, see [Azure Pipelines ecosystem examples](/azure/devops/pipelines/ecosystems/ecosystems).

# [YAML](#tab/yaml/)

Define a pipeline by creating an *azure-pipelines.yml* YAML file in your code repository.

1. On the left navigation menu for your Azure DevOps project, select **Pipelines**.
1. On the **Pipelines** page, select **New pipeline**, or **Create pipeline** if this pipeline is the first in the project.
1. On the **Where is your code** screen, select the location of your source code, either **Azure Repos Git** or **GitHub**. If necessary, sign in to GitHub.
1. On the **Select a repository** screen, select your code repository.
1. On the **Configure your pipeline** screen, select **Starter pipeline**.

Add the [.NET Core (DotNetCoreCLI@2)](/azure/devops/pipelines/tasks/reference/dotnet-core-cli-v2) task to the pipeline, and build and publish your app.

1. On the **Review your pipeline YAML** screen, delete all the code after the `steps:` line.
1. Select the end of the file, and then select **Show assistant** at right.
1. Under **Tasks**, select **.NET Core**.
1. On the **.NET Core** configuration screen, under **Azure Resource Manager connection**, select your Azure subscription, and then select **Authorize** to create the required service connection.
1. Under **Command**, select **publish**.
1. Ensure that the **Publish web projects** and **Zip published projects** check boxes are selected, and then select **Add**.
1. The task appears in your YAML pipeline. Review the YAML code to see what it does. When you're ready, select **Save and run**, and then select **Save and run** again.
1. On the build **Summary** screen, under **Jobs**, select the **Permission needed** link. On the **Checks** screen, select **Permit**, and then select **Permit** again. Granting permission here permits use of the service connection you authorized for all runs of this pipeline.

# [Classic](#tab/classic/)

1. On the left navigation menu for your Azure DevOps project, select **Pipelines**.
1. On the **Pipelines** page, select **New pipeline**, or **Create pipeline** if this pipeline is the first in the project.
1. On the **Where is your code** screen, select **Use the classic editor to create a pipeline without YAML**.
1. On the **Select a repository** screen, select the location of your source code, either **Azure Repos Git** or **GitHub**, and then select your code **Repository** and **Default branch**. Select **Continue**.
1. On the **Choose a template** screen, select **ASP.NET Core**, and then select **Apply**.
1. On the new pipeline screen, under **Agent Specification** at right, select an agent specification such as **ubuntu-latest** or **windows-latest** depending on your app platform and version.
1. Look at the pipeline to see what it does. When you're ready, select **Save & queue**.
1. Select **Save & queue** again, and on the **Run pipeline** screen, select **Save and run**.

---

The pipeline publishes the deployment ZIP file as an Azure artifact for the deployment task to use in the next step.

## Add the deployment task

After the pipeline runs successfully, add the deployment task.

# [YAML](#tab/yaml/)

1. On the pipeline run **Summary** screen, select the **More actions** icon at upper right, and then select **Edit pipeline**.
1. Select the end of the YAML file, and select **Show assistant** if the **Tasks** list isn't showing.
1. In the **Tasks** list, search for and select the [Azure Web App](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app) task. Alternatively, you can use the [Azure App Service deploy](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app-deployment) task.
1. On the **Azure Web App** configuration screen, under **Azure subscription**, select the same service connection you set up for the previous step. You don't need to reauthorize this connection.
1. For **App type**, select **Azure Web App on Linux** or **Azure Web App on Windows**, depending on your code.
1. For **App name**, select or enter your App Service app name.
1. Select **Add**.
1. Select **Validate and save**, and then select **Save**.
1. Select **Run**, and then select **Run** again.

The complete YAML pipeline should look like the following code:

```yaml
trigger:
- <branch-specification>

pool:
  vmImage: <agent-specification>

steps:
- task: DotNetCoreCLI@2
  inputs:
    azureSubscription: '<your-authorized-service-connection>'
    command: 'publish'
    publishWebProjects: true

- task: AzureWebApp@1
  inputs:
    azureSubscription: '<your-authorized-service-connection>'
    appType: 'webApp'
    appName: '<your-app-name>'
    package: '$(System.DefaultWorkingDirectory)/**/*.zip'
    deploymentMethod: 'auto'  
```

- `azureSubscription`: Name of the authorized service connection to your Azure subscription.
- `appName`: Name of your existing app.
- `package`: File path to the package or folder containing your App Service contents. Wildcards are supported.

# [Classic](#tab/classic/)

For classic pipelines, it's easiest to define build and release stages in separate pipelines.

1. On the left navigation menu for your project, select **Pipelines** > **Releases**, and then select **New pipeline** to create a [release pipeline](/azure/devops/pipelines/release/).
1. Under **Select a template**, select the **Azure App Service deployment** template, and select **Apply**. This template automatically adds the necessary tasks.

   > [!NOTE]
   > If you're deploying a Node.js app to App Service on Windows, select the **Deploy a Node.js app to Azure App Service** template. This template configures the task to generate a *web.config* file containing a parameter that starts the `iisnode` service.

1. On the **New release pipeline** page, select the **Tasks** tab, select **Stage 1**, and complete the following fields under **Parameters**:

   - **Azure subscription**: If you don't already have an Azure service connection, select your Azure subscription, and then select **Authorize** to create the required service connection.
   - **App type**: Select **Azure Web App on Linux** or **Azure Web App on Windows**, to match your code and agent specification.
   - **App service name**: Select your App Service app.

1. On the **Pipeline** tab of the **New release pipeline** screen, next to **Artifacts**, select **Add**.
1. On the **Add an artifact** screen, make sure **Build** is selected, and under **Source (build pipeline)**, select the pipeline you created in the previous section.
1. Select **Add**.
1. On the pipeline page, select **Save** at upper right, and then select **OK**.
1. To run the pipeline, on the pipeline page, select **Create release**, and then select **Create**.

---

## Examples

The following sections discuss creating different kinds of build and release pipelines.

### Deploy to a virtual application

# [YAML](#tab/yaml/)

The [Azure Web App](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app) task deploys to the root application in the Azure web app. You can deploy to a specific virtual application by using the `VirtualApplication` property of the [Azure App Service deploy](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app-deployment) task.

```yaml
- task: AzureRmWebAppDeployment@5
  inputs:
    VirtualApplication: '<name of virtual application>'
```

`VirtualApplication` is the name of the virtual application configured in the Azure portal. For more information, see [Configure an App Service app in the Azure portal](configure-common.md).

# [Classic](#tab/classic/)

The [Azure Web App](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app) task deploys to the root application in the Azure web app. To deploy to a specific virtual application, enter its name in the **Virtual Application** property of the [Azure App Service deploy](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app-deployment) task.

---

### Deploy to a slot

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
    WebAppName: '<app-name>'
    ResourceGroupName: '<name of resource group>'
    SourceSlot: staging
    SwapWithProduction: true
```

- `azureSubscription`: Your Azure service connection.
- `appType`: Optional app type such as `webAppLinux` to deploy to a web app on Linux.
- `appName`: The name of your existing app.
- `deployToSlotOrASE`: Boolean. Whether to deploy to an existing deployment slot or App Service environment.
- `resourceGroupName`: Name of the resource group to deploy to, required if `deployToSlotOrASE` is true.
- `slotName`: Name of the slot to deploy to, required if `deployToSlotOrASE` is true. Defaults to `production`.
- `package`: File path to the package or folder containing your app contents. Wildcards are supported.
- `SourceSlot`: Slot sent to production when `SwapWithProduction` is true.
- `SwapWithProduction`: Boolean. Whether to swap the traffic of source slot with production.

# [Classic](#tab/classic/)

Use the option **Deploy to Slot or App Service Environment** in the **Azure Web App** task to specify the slot to deploy to. To swap the slots, use the **Azure App Service manage** task.

---

### Deploy to multiple web apps

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

To deploy to multiple web apps, add stages to your release pipeline. You can control the order of deployment. For more information, see [Stages](/azure/devops/pipelines/process/stages).

---

### Deploy conditionally

# [YAML](#tab/yaml/)

To deploy conditionally in YAML, use one of the following techniques:

- Add a condition to the step.
- Isolate the deployment steps into a separate job, and add a condition to that job.

The following example shows how to use step conditions to deploy only successful builds that originate from the main branch:

```yaml
- task: AzureWebApp@1
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
  inputs:
    azureSubscription: '<service-connection-name>'
    appName: '<app-name>'
```

For more information about conditions, see [Specify conditions](/azure/devops/pipelines/process/conditions).

# [Classic](#tab/classic/)

In your release pipeline, you can implement various checks and conditions to control the deployment:

- Set **branch filters** to configure the continuous deployment trigger on the artifact of the release pipeline.
- Set **pre-deployment approvals** or configure **gates** as a precondition for deployment to a stage.
- Specify conditions for a task to run.

For more information, see the following articles:
- [Classic release triggers](/azure/devops/pipelines/release/triggers)
- [Deployment control using approvals](/azure/devops/pipelines/release/approvals/approvals)
- [Deployment gates concepts](/azure/devops/pipelines/release/approvals/gates)

---

### Deploy using Web Deploy

The [Azure App Service deploy](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app-deployment) task can deploy to App Service by using Web Deploy.

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

- task: AzureRmWebAppDeployment@5
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

If you're using the **Azure App Service deployment** template in a release pipeline, follow these steps to deploy to Web Deploy.

1. Select the **Tasks** tab, and then select **Deploy Azure App Service**, the [Azure App Service deploy](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app-deployment) task.
1. On the configuration screen, make sure that **Connection type** is set to **Azure Resource Manager**.
1. Expand **Additional Deployment Options** and choose **Select deployment method**. Make sure that **Web Deploy** is selected as the deployment method.
1. Save the release pipeline.

> [!NOTE]
> With the [Azure App Service deploy](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app-deployment) task, you should use the **Azure Resource Manager** connection type or `AzureRM` when you deploy with **Web Deploy**. This connection type uses publishing profiles for deployment when basic authentication is enabled for your app. When [basic authentication is disabled](configure-basic-auth-disable.md), the connection uses the more secure Microsoft Entra ID authentication.

---

## Frequently asked questions

### What's the difference between the AzureWebApp and AzureRmWebAppDeployment tasks?

The [Azure Web App](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app) task is the simplest way to deploy to an Azure web app. By default, you deploy the root application in the Azure web app.

The [Azure App Service deploy](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app-deployment) task can handle more custom scenarios, such as:

- [Deploy with Web Deploy](#deploy-using-web-deploy), if you usually use the Internet Information Services (IIS) deployment process.
- [Deploy to virtual applications](#deploy-to-a-virtual-application).
- Deploy to other app types, like container apps, function apps, WebJobs, or API and mobile apps.

> [!NOTE]  
> The separate [File Transform](/azure/devops/pipelines/tasks/utility/file-transform) task also supports file transforms and variable substitution to use in Azure Pipelines. You can use the **File Transform** task to apply file transformations and variable substitutions on any configuration and parameters files.

### Why do I get the message "Invalid App Service package or folder path provided"?

In YAML pipelines, there could be a mismatch between where your built web package is saved and where the deploy task is looking for it. The default **AzureWebApp** task picks up the web package for deployment from `$(System.DefaultWorkingDirectory)/**/*.zip`. If the web package is deposited elsewhere, modify the value of the `package` parameter.

### Why do I get the message "Publish using webdeploy options are supported only when using Windows agent"?

This error occurs in the **AzureRmWebAppDeployment** task when you configure the task to deploy using **Web Deploy**, but your agent isn't running Windows. Verify that your YAML `vmImage` parameter specifies Windows.

```yml
pool:
  vmImage: windows-latest
```

### Why doesn't Web Deploy work when I disable basic authentication?

For troubleshooting information on getting Microsoft Entra ID authentication to work with the [Azure App Service deploy](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app-deployment) task, see [I can't Web Deploy to my Azure App Service using Microsoft Entra ID authentication from my Windows agent](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app-deployment#i-cant-web-deploy-to-my-azure-app-service-using-microsoft-entra-id-authentication-from-my-windows-agent).

## Related content

- [Customize your pipeline](/azure/devops/pipelines/customize-pipeline)
- [Build and deploy Python web apps](/azure/devops/pipelines/ecosystems/python-webapp)
