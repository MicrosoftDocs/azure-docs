---
title: Deployment technologies in Azure Functions  
description: Learn the different ways you can deploy code to Azure Functions.
author: ColbyTresness
ms.custom: vs-azure
ms.topic: conceptual
ms.date: 04/25/2019
ms.author: cotresne

---

# Deployment technologies in Azure Functions

You can use a few different technologies to deploy your Azure Functions project code to Azure. This article provides an exhaustive list of those technologies, describes which technologies are available for which flavors of Functions, explains what happens when you use each method, and provides recommendations for the best method to use in various scenarios. The various tools that support deploying to Azure Functions are tuned to the right technology based on their context. In general, zip deployment is the recommended deployment technology for Azure Functions.

## Deployment technology availability

Azure Functions supports cross-platform local development and hosting on Windows and Linux. Currently, three hosting plans are available:

+ [Consumption](functions-scale.md#consumption-plan)
+ [Premium](functions-scale.md#premium-plan)
+ [Dedicated (App Service)](functions-scale.md#app-service-plan)

Each plan has different behaviors. Not all deployment technologies are available for each flavor of Azure Functions. The following chart shows which deployment technologies are supported for each combination of operating system and hosting plan:

| Deployment technology | Windows Consumption | Windows Premium | Windows Dedicated  | Linux Consumption | Linux Premium | Linux Dedicated |
|-----------------------|:-------------------:|:-------------------------:|:------------------:|:---------------------------:|:-------------:|:---------------:|
| External package URL<sup>1</sup> |✔|✔|✔|✔|✔|✔|
| Zip deploy |✔|✔|✔|✔|✔|✔|
| Docker container | | | | |✔|✔|
| Web Deploy |✔|✔|✔| | | |
| Source control |✔|✔|✔| |✔|✔|
| Local Git<sup>1</sup> |✔|✔|✔| |✔|✔|
| Cloud sync<sup>1</sup> |✔|✔|✔| |✔|✔|
| FTP<sup>1</sup> |✔|✔|✔| |✔|✔|
| Portal editing |✔|✔|✔| |✔<sup>2</sup>|✔<sup>2</sup>|

<sup>1</sup> Deployment technology that requires [manual trigger syncing](#trigger-syncing).  
<sup>2</sup> Portal editing is enabled only for HTTP and Timer triggers for Functions on Linux using Premium and Dedicated plans.

## Key concepts

Some key concepts are critical to understanding how deployments work in Azure Functions.

### Trigger syncing

When you change any of your triggers, the Functions infrastructure must be aware of the changes. Synchronization happens automatically for many deployment technologies. However, in some cases, you must manually sync your triggers. When you deploy your updates by referencing an external package URL, local Git, cloud sync, or FTP, you must manually sync your triggers. You can sync triggers in one of three ways:

* Restart your function app in the Azure portal
* Send an HTTP POST request to `https://{functionappname}.azurewebsites.net/admin/host/synctriggers?code=<API_KEY>` using the [master key](functions-bindings-http-webhook.md#authorization-keys).
* Send an HTTP POST request to `https://management.azure.com/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP_NAME>/providers/Microsoft.Web/sites/<FUNCTION_APP_NAME>/syncfunctiontriggers?api-version=2016-08-01`. Replace the placeholders with your subscription ID, resource group name, and the name of your function app.

### Remote build

Azure Functions can automatically perform builds on the code it receives after zip deployments. These builds behave slightly differently depending on whether your app is running on Windows or Linux. Remote builds are not performed when an app has previously been set to run in [Run From Package](run-functions-from-deployment-package.md) mode. To learn how to use remote build, navigate to [zip deploy](#zip-deploy).

> [!NOTE]
> If you're having issues with remote build, it might be because your app was created before the feature was made available (August 1, 2019). Try creating a new function app, or running `az functionapp update -g <RESOURCE_GROUP_NAME> -n <APP_NAME>` to update your function app. This command might take two tries to succeed.

#### Remote build on Windows

All function apps running on Windows have a small management app, the SCM (or [Kudu](https://github.com/projectkudu/kudu)) site. This site handles much of the deployment and build logic for Azure Functions.

When an app is deployed to Windows, language-specific commands, like `dotnet restore` (C#) or `npm install` (JavaScript) are run.

#### Remote build on Linux

To enable remote build on Linux, the following [application settings](functions-how-to-use-azure-function-app-settings.md#settings) must be set:

* `ENABLE_ORYX_BUILD=true`
* `SCM_DO_BUILD_DURING_DEPLOYMENT=true`

By default, both [Azure Functions Core Tools](functions-run-local.md) and the [Azure Functions Extension for Visual Studio Code](functions-create-first-function-vs-code.md#publish-the-project-to-azure) perform remote builds when deploying to Linux. Because of this, both tools automatically create these settings for you in Azure. 

When apps are built remotely on Linux, they [run from the deployment package](run-functions-from-deployment-package.md). 

##### Consumption plan

Linux function apps running in the Consumption plan don't have an SCM/Kudu site, which limits the deployment options. However, function apps on Linux running in the Consumption plan do support remote builds.

##### Dedicated and Premium plans

Function apps running on Linux in the [Dedicated (App Service) plan](functions-scale.md#app-service-plan) and the [Premium plan](functions-scale.md#premium-plan) also have a limited SCM/Kudu site.

## Deployment technology details

The following deployment methods are available in Azure Functions.

### External package URL

You can use an external package URL to reference a remote package (.zip) file that contains your function app. The file is downloaded from the provided URL, and the app runs in [Run From Package](run-functions-from-deployment-package.md) mode.

>__How to use it:__ Add `WEBSITE_RUN_FROM_PACKAGE` to your application settings. The value of this setting should be a URL (the location of the specific package file you want to run). You can add settings either [in the portal](functions-how-to-use-azure-function-app-settings.md#settings) or [by using the Azure CLI](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-set). 
>
>If you use Azure Blob storage, use a private container with a [shared access signature (SAS)](../vs-azure-tools-storage-manage-with-storage-explorer.md#generate-a-sas-in-storage-explorer) to give Functions access to the package. Any time the application restarts, it fetches a copy of the content. Your reference must be valid for the lifetime of the application.

>__When to use it:__ External package URL is the only supported deployment method for Azure Functions running on Linux in the Consumption plan, if the user doesn't want a [remote build](#remote-build) to occur. When you update the package file that a function app references, you must [manually sync triggers](#trigger-syncing) to tell Azure that your application has changed.

### Zip deploy

Use zip deploy to push a .zip file that contains your function app to Azure. Optionally, you can set your app to start [running from package](run-functions-from-deployment-package.md), or specify that a [remote build](#remote-build) occurs.

>__How to use it:__ Deploy by using your favorite client tool: [Visual Studio Code](functions-create-first-function-vs-code.md#publish-the-project-to-azure), [Visual Studio](functions-develop-vs.md#publish-to-azure), the [Azure Functions Core Tools](functions-run-local.md), or the [Azure CLI](functions-create-first-azure-function-azure-cli.md#deploy-the-function-app-project-to-azure). By default, these tools use zip deployment and [run from package](run-functions-from-deployment-package.md). Core Tools and the Visual Studio Code extension both enable [remote build](#remote-build) when deploying to Linux. To manually deploy a .zip file to your function app, follow the instructions in [Deploy from a .zip file or URL](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file-or-url).

>When you deploy by using zip deploy, you can set your app to [run from package](run-functions-from-deployment-package.md). To run from package, set the `WEBSITE_RUN_FROM_PACKAGE` application setting value to `1`. We recommend zip deployment. It yields faster loading times for your applications, and it's the default for VS Code, Visual Studio, and the Azure CLI. 

>__When to use it:__ Zip deploy is the recommended deployment technology for Azure Functions.

### Docker container

You can deploy a Linux container image that contains your function app.

>__How to use it:__ Create a Linux function app in the Premium or Dedicated plan and specify which container image to run from. You can do this in two ways:
>
>* Create a Linux function app on an Azure App Service plan in the Azure portal. For **Publish**, select **Docker Image**, and then configure the container. Enter the location where the image is hosted.
>* Create a Linux function app on an App Service plan by using the Azure CLI. To learn how, see [Create a function on Linux by using a custom image](functions-create-function-linux-custom-image.md#create-a-premium-plan).
>
>To deploy to an existing app by using a custom container, in [Azure Functions Core Tools](functions-run-local.md), use the [`func deploy`](functions-run-local.md#publish) command.

>__When to use it:__ Use the Docker container option when you need more control over the Linux environment where your function app runs. This deployment mechanism is available only for Functions running on Linux.

### Web Deploy (MSDeploy)

Web Deploy packages and deploys your Windows applications to any IIS server, including your function apps running on Windows in Azure.

>__How to use it:__ Use [Visual Studio tools for Azure Functions](functions-create-your-first-function-visual-studio.md). Clear the **Run from package file (recommended)** check box.
>
>You can also download [Web Deploy 3.6](https://www.iis.net/downloads/microsoft/web-deploy) and call `MSDeploy.exe` directly.

>__When to use it:__ Web Deploy is supported and has no issues, but the preferred mechanism is [zip deploy with Run From Package enabled](#zip-deploy). To learn more, see the [Visual Studio development guide](functions-develop-vs.md#publish-to-azure).

### Source control

Use source control to connect your function app to a Git repository. An update to code in that repository triggers deployment. For more information, see the [Kudu Wiki](https://github.com/projectkudu/kudu/wiki/VSTS-vs-Kudu-deployments).

>__How to use it:__ Use Deployment Center in the Functions area of the portal to set up publishing from source control. For more information, see [Continuous deployment for Azure Functions](functions-continuous-deployment.md).

>__When to use it:__ Using source control is the best practice for teams that collaborate on their function apps. Source control is a good deployment option that enables more sophisticated deployment pipelines.

### Local Git

You can use local Git to push code from your local machine to Azure Functions by using Git.

>__How to use it:__ Follow the instructions in [Local Git deployment to Azure App Service](../app-service/deploy-local-git.md).

>__When to use it:__ In general, we recommend that you use a different deployment method. When you publish from local Git, you must [manually sync triggers](#trigger-syncing).

### Cloud sync

Use cloud sync to sync your content from Dropbox and OneDrive to Azure Functions.

>__How to use it:__ Follow the instructions in [Sync content from a cloud folder](../app-service/deploy-content-sync.md).

>__When to use it:__ In general, we recommend other deployment methods. When you publish by using cloud sync, you must [manually sync triggers](#trigger-syncing).

### FTP

You can use FTP to directly transfer files to Azure Functions.

>__How to use it:__ Follow the instructions in [Deploy content by using FTP/s](../app-service/deploy-ftp.md).

>__When to use it:__ In general, we recommend other deployment methods. When you publish by using FTP, you must [manually sync triggers](#trigger-syncing).

### Portal editing

In the portal-based editor, you can directly edit the files that are in your function app (essentially deploying every time you save your changes).

>__How to use it:__ To be able to edit your functions in the Azure portal, you must have [created your functions in the portal](functions-create-first-azure-function.md). To preserve a single source of truth, using any other deployment method makes your function read-only and prevents continued portal editing. To return to a state in which you can edit your files in the Azure portal, you can manually turn the edit mode back to `Read/Write` and remove any deployment-related application settings (like `WEBSITE_RUN_FROM_PACKAGE`). 

>__When to use it:__ The portal is a good way to get started with Azure Functions. For more intense development work, we recommend that you use one of the following client tools:
>
>* [Visual Studio Code](functions-create-first-function-vs-code.md)
>* [Azure Functions Core Tools (command line)](functions-run-local.md)
>* [Visual Studio](functions-create-your-first-function-visual-studio.md)

The following table shows the operating systems and languages that support portal editing:

| | Windows Consumption | Windows Premium | Windows Dedicated | Linux Consumption | Linux Premium | Linux Dedicated |
|-|:-----------------: |:----------------:|:-----------------:|:-----------------:|:-------------:|:---------------:|
| C# | | | | | |
| C# Script |✔|✔|✔| |✔<sup>\*</sup> |✔<sup>\*</sup>|
| F# | | | | | | |
| Java | | | | | | |
| JavaScript (Node.js) |✔|✔|✔| |✔<sup>\*</sup>|✔<sup>\*</sup>|
| Python (Preview) | | | | | | |
| PowerShell (Preview) |✔|✔|✔| | | |
| TypeScript (Node.js) | | | | | | |

<sup>*</sup> Portal editing is enabled only for HTTP and Timer triggers for Functions on Linux using Premium and Dedicated plans.

## Deployment slots

When you deploy your function app to Azure, you can deploy to a separate deployment slot instead of directly to production. For more information on deployment slots, see the [Azure Functions Deployment Slots](../app-service/deploy-staging-slots.md) documentation for details.

## Next steps

Read these articles to learn more about deploying your function apps: 

+ [Continuous deployment for Azure Functions](functions-continuous-deployment.md)
+ [Continuous delivery by using Azure DevOps](functions-how-to-azure-devops.md)
+ [Zip deployments for Azure Functions](deployment-zip-push.md)
+ [Run your Azure Functions from a package file](run-functions-from-deployment-package.md)
+ [Automate resource deployment for your function app in Azure Functions](functions-infrastructure-as-code.md)
