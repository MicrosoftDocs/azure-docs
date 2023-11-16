---
title: Configure CI/CD with Azure Pipelines
description: Learn how to deploy your code to Azure App Service from a CI/CD pipeline with Azure Pipelines.
ms.topic: article
ms.date: 09/13/2022
ms.author: jukullam
ms.manager: mijacobs
ms.custom: "devops-pipelines-deploy"
author: cephalin

---

# Deploy to App Service using Azure Pipelines

**Azure DevOps Services | Azure DevOps Server 2020 | Azure DevOps Server 2019**

Use [Azure Pipelines](/azure/devops/pipelines/) to automatically deploy your web app to [Azure App Service](./overview.md) on every successful build. Azure Pipelines lets you build, test, and deploy with continuous integration (CI) and continuous delivery (CD) using [Azure DevOps](/azure/devops/). 

YAML pipelines are defined using a YAML file in your repository. A step is the smallest building block of a pipeline and can be a script or task (prepackaged script). [Learn about the key concepts and components that make up a pipeline](/azure/devops/pipelines/get-started/key-pipelines-concepts).

You'll use the [Azure Web App task](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app) to deploy to Azure App Service in your pipeline. For more complicated scenarios such as needing to use XML parameters in your deploy, you can use the [Azure App Service Deploy task](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app-deployment).  

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


### Create your pipeline

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

###  Add the Azure Web App task

1. Use the Task assistant to add the [Azure Web App](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app) task. 

    :::image type="content" source="media/deploy-azure-pipelines/azure-web-app-task.png" alt-text="Screenshot of Azure web app task.":::

1. Select **Azure Resource Manager** for the **Connection type** and choose your **Azure subscription**. Make sure to **Authorize** your connection.  

1. Select  **Web App on Linux** and enter your `azureSubscription`, `appName`, and `package`. Your complete YAML should look like this. 

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
        azureSubscription: '<Azure service connection>'
        appType: 'webAppLinux'
        appName: '<Name of web app>'
        package: '$(System.DefaultWorkingDirectory)/**/*.zip'
    ```

    * **azureSubscription**: your Azure subscription.
    * **appName**: the name of your existing app service.
    * **package**: the file path to the package or a folder containing your app service contents. Wildcards are supported.

# [Classic](#tab/classic/)

To get started: 

1. Create a pipeline and select the **ASP.NET Core** template. This selection automatically adds the tasks required to build the code in the sample repository.

2. Save the pipeline and queue a build to see it in action.

3. Create a release pipeline and select the **Azure App Service Deployment** template for your stage.
   This automatically adds the necessary tasks. 

4. Link the build pipeline as an artifact for this release pipeline. Save the release pipeline and create a release to see it in action.

---

Now you're ready to read through the rest of this article to learn some of the more common changes that people make to customize an Azure Web App deployment.

## Use the Azure Web App task

# [YAML](#tab/yaml/)

The Azure Web App Deploy task is the simplest way to deploy to an Azure Web App. By default, your deployment happens to the root application in the Azure Web App.

The [Azure App Service Deploy task](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app-deployment) allows you to modify configuration settings inside web packages and XML parameters files. 

### Deploy a Web Deploy package

To deploy a .zip Web Deploy package (for example, from an ASP.NET web app) to an Azure Web App,
add the following snippet to your *azure-pipelines.yml* file:

```yaml
- task: AzureWebApp@1
  inputs:
    azureSubscription: '<Azure service connection>'
    appName: '<Name of web app>'
    package: $(System.DefaultWorkingDirectory)/**/*.zip    
```

* **azureSubscription**: your Azure subscription.
* **appName**: the name of your existing app service.
* **package**: the file path to the package or a folder containing your app service contents. Wildcards are supported.

The snippet assumes that the build steps in your YAML file produce the zip archive in the `$(System.DefaultWorkingDirectory)` folder on your agent.

For information on Azure service connections, see the [following section](#endpoint).

### Deploy a .NET app

if you're building a [.NET Core app](/azure/devops/pipelines/ecosystems/dotnet-core), use the following snipped to deploy the build to an app. 

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
    azureSubscription: '<Azure service connection>'
    appType: 'webAppLinux'
    appName: '<Name of web app>'
    package: '$(System.DefaultWorkingDirectory)/**/*.zip'
```

* **azureSubscription**: your Azure subscription.
* **appType**: your Web App type.
* **appName**: the name of your existing app service.
* **package**: the file path to the package or a folder containing your app service contents. Wildcards are supported.


# [Classic](#tab/classic/)

The simplest way to deploy to an Azure Web App is to use the **Azure Web App** task.
To deploy to any Azure App service (Web app for Windows, Linux, container, Function app or web jobs), use the **Azure App Service Deploy** task.
This task is automatically added to the release pipeline when you select one of the prebuilt deployment templates for Azure App Service deployment.
Templates exist for apps developed in various programming languages. If you can't find a template for your language, select the generic **Azure App Service Deployment** template.

When you link the artifact in your release pipeline to a build that compiles and publishes the web package,
it's automatically downloaded and placed into the `$(System.DefaultWorkingDirectory)` folder on the agent as part of the release.
This is where the task picks up the web package for deployment.

---

<a name="endpoint"></a>

## Use a service connection

To deploy to Azure App Service, you'll need to use an Azure Resource Manager [service connection](/azure/devops/pipelines/library/service-endpoints). The Azure service connection stores the credentials to connect from Azure Pipelines or Azure DevOps Server to Azure.

Learn more about [Azure Resource Manager service connections](/azure/devops/pipelines/library/connect-to-azure). If your service connection isn't working as expected, see [Troubleshooting service connections](/azure/devops/pipelines/release/azure-rm-endpoint). 

# [YAML](#tab/yaml/)

You'll need an Azure service connection for the `AzureWebApp` task. The Azure service connection stores the credentials to connect from Azure Pipelines to Azure. See [Create an Azure service connection](/azure/devops/pipelines/library/connect-to-azure).

# [Classic](#tab/classic/)

For Azure DevOps Services, the easiest way to get started with this task is to be signed in as a user who owns both the Azure DevOps Services organization and the Azure subscription. In this case, you won't have to manually create the service connection.

Otherwise, to learn how to create an Azure service connection, see [Create an Azure service connection](/azure/devops/pipelines/library/connect-to-azure).

---

## Deploy to a virtual application

# [YAML](#tab/yaml/)

By default, your deployment happens to the root application in the Azure Web App. You can deploy to a specific virtual application by using the `VirtualApplication` property of the `AzureRmWebAppDeployment` task:

```yaml
- task: AzureRmWebAppDeployment@4
  inputs:
    VirtualApplication: '<name of virtual application>'
```

* **VirtualApplication**: the name of the Virtual Application that has been configured in the Azure portal. For more information, see [Configure an App Service app in the Azure portal
](./configure-common.md).

# [Classic](#tab/classic/)

By default, your deployment happens to the root application in the Azure Web App. If you want to deploy to a specific virtual application,
enter its name in the **Virtual Application** property of the **Azure App Service Deploy** task.

---

## Deploy to a slot

# [YAML](#tab/yaml/)

You can configure the Azure Web App to have multiple slots. Slots allow you to safely deploy your app and test it before making it available to your customers.

The following example shows how to deploy to a staging slot, and then swap to a production slot:

```yaml
- task: AzureWebApp@1
  inputs:
    azureSubscription: '<Azure service connection>'
    appType: webAppLinux
    appName: '<name of web app>'
    deployToSlotOrASE: true
    resourceGroupName: '<name of resource group>'
    slotName: staging
    package: '$(Build.ArtifactStagingDirectory)/**/*.zip'

- task: AzureAppServiceManage@0
  inputs:
    azureSubscription: '<Azure service connection>'
    appType: webAppLinux
    WebAppName: '<name of web app>'
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

You can configure the Azure Web App to have multiple slots. Slots allow you to safely deploy your app and test it before making it available to your customers.

Use the option **Deploy to Slot or App Service Environment** in the **Azure Web App** task to specify the slot to deploy to.

---

## Deploy to multiple web apps

# [YAML](#tab/yaml/)

You can use [jobs](/azure/devops/pipelines/process/phases) in your YAML file to set up a pipeline of deployments.
By using jobs, you can control the order of deployment to multiple web apps.

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
      azureSubscription: '<Azure service connection>'
      appType: <app type>
      appName: '<name of test stage web app>'
      deployToSlotOrASE: true
      resourceGroupName: <resource group name>
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
      azureSubscription: '<Azure service connection>'
      appType: <app type>
      appName: '<name of test stage web app>'
      resourceGroupName: <resource group name>
      package: '$(Pipeline.Workspace)/**/*.zip'
```

# [Classic](#tab/classic/)

If you want to deploy to multiple web apps, add stages to your release pipeline.
You can control the order of deployment. To learn more, see [Stages](/azure/devops/pipelines/process/stages).

---

## Make configuration changes

For most language stacks, [app settings](./configure-common.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#configure-app-settings) and [connection strings](./configure-common.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#configure-connection-strings) can be set as environment variables at runtime. 

App settings can also be resolved from Key Vault using [Key Vault references](./app-service-key-vault-references.md).

For ASP.NET and ASP.NET Core developers, setting app settings in App Service are like setting them in `<appSettings>` in Web.config.
You might want to apply a specific configuration for your web app target before deploying to it. 
This is useful when you deploy the same build to multiple web apps in a pipeline.
For example, if your Web.config file contains a connection string named `connectionString`,
you can change its value before deploying to each web app. You can do this either by applying
a Web.config transformation or by substituting variables in your Web.config file. 

**Azure App Service Deploy task** allows users to modify configuration settings in configuration files (*.config files) inside web packages and XML parameters files (parameters.xml), based on the stage name specified.

> [!NOTE]  
> File transforms and variable substitution are also supported by the separate [File Transform task](/azure/devops/pipelines/tasks/utility/file-transform) for use in Azure Pipelines.
You can use the File Transform task to apply file transformations and variable substitutions on any configuration and parameters files.


### Variable substitution

# [YAML](#tab/yaml/)

The following snippet shows an example of variable substitution:

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

## Deploying conditionally

# [YAML](#tab/yaml/)

To do this in YAML, you can use one of these techniques:

* Isolate the deployment steps into a separate job, and add a condition to that job.
* Add a condition to the step.

The following example shows how to use step conditions to deploy only builds that originate from the main branch:

```yaml
- task: AzureWebApp@1
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
  inputs:
    azureSubscription: '<Azure service connection>'
    appName: '<name of web app>'
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

## (Classic) Deploy a release pipeline

You can use a release pipeline to pick up the artifacts published by your build and then deploy them to your Azure web site.

1. Do one of the following to start creating a release pipeline:

   * If you've just completed a CI build, choose the link (for example, _Build 20170815.1_)
     to open the build summary. Then choose **Release** to start a new release pipeline that's automatically linked to the build pipeline.

   * Open the **Releases** tab in **Azure Pipelines**, open the **+** dropdown
     in the list of release pipelines, and choose **Create release pipeline**.

1. The easiest way to create a release pipeline is to use a template. If you're deploying a Node.js app, select the **Deploy Node.js App to Azure App Service** template.
   Otherwise, select the **Azure App Service Deployment** template. Then choose **Apply**.

   > [!NOTE]
   > The only difference between these templates is that Node.js template configures the task to generate a **web.config** file containing a parameter that starts the **iisnode** service.

1. If you created your new release pipeline from a build summary, check that the build pipeline and artifact
   is shown in the **Artifacts** section on the **Pipeline** tab. If you created a new release pipeline from
   the **Releases** tab, choose the **+ Add** link and select your build artifact.

1. Choose the **Continuous deployment** icon in the **Artifacts** section, check that the
   continuous deployment trigger is enabled, and add a filter to include the **main** branch.

   > [!NOTE]
   > Continuous deployment isn't enabled by default when you create a new release pipeline from the **Releases** tab.

1. Open the **Tasks** tab and, with **Stage 1** selected, configure the task property variables as follows:

   * **Azure Subscription:** Select a connection from the list under **Available Azure Service Connections** or create a more restricted permissions connection to your Azure subscription.
     If you're using Azure Pipelines and if you see an **Authorize** button next to the input, select it to authorize Azure Pipelines to connect to your Azure subscription. If you're using TFS or if you don't see the desired Azure subscription in the list of subscriptions, see [Azure Resource Manager service connection](/azure/devops/pipelines/library/connect-to-azure) to manually set up the connection.

   * **App Service Name**: Select the name of the web app from your subscription.

    > [!NOTE]
    > Some settings for the tasks may have been automatically defined as
    > [stage variables](/azure/devops/pipelines/release/variables#custom-variables)
    > when you created a release pipeline from a template.
    > These settings cannot be modified in the task settings; instead you must
    > select the parent stage item in order to edit these settings.
    

1. Save the release pipeline.

### Create a release to deploy your app

You're now ready to create a release, which means to run the release pipeline with the artifacts produced by a specific build. This will result in deploying the build:

1. Choose **+ Release** and select **Create a release**.

1. In the **Create a new release** panel, check that the artifact version you want to use is selected and choose **Create**.

1. Choose the release link in the information bar message. For example: "Release **Release-1** has been created".

1. In the pipeline view, choose the status link in the stages of the pipeline to see the logs and agent output.

1. After the release is complete, navigate to your site running in Azure using the Web App URL `http://{web_app_name}.azurewebsites.net`, and verify its contents.

## Next steps

- Customize your [Azure DevOps pipeline](/azure/devops/pipelines/customize-pipeline).
