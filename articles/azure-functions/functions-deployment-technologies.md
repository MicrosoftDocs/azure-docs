---
title: Deployment Technologies in Azure Functions  | Microsoft Docs
description: Learn the ins and outs of the different ways you can deploy code to Azure Functions.
services: functions
documentationcenter: .net
author: ColbyTresness
manager: dariac

ms.service: azure-functions
ms.custom: vs-azure
ms.topic: conceptual
ms.date: 04/25/2019
ms.author: cotresne

---

# Deployment technologies in Azure Functions

There are a few different technologies you can use to deploy your Azure Functions project code to Azure. This article provides an exhaustive list of those technologies, informs which technologies are available for which flavors of Functions, explains what's actually happening when each method is used, and provides recommendations for the best method to use in various scenarios. The various tools that support deploying to Azure Functions are tuned to the right technology based on their context.

## Deployment technology availability

> [!IMPORTANT]
> Azure Functions supports cross platform local development, and hosting on two operating systems: Windows and Linux. There are three hosting plans currently available, each with different behaviors - [Consumption](functions-scale.md#consumption-plan),  [Premium](functions-scale.md#premium-plan), and [dedicated (App Service)](functions-scale.md#app-service-plan). Not all deployment technologies are available for each flavor of Azure Functions.

| Deployment technology | Windows consumption | Windows premium (preview) | Windows dedicated  | Linux consumption (preview) | Linux dedicated |
|-----------------------|:-------------------:|:-------------------------:|:-----------------:|:---------------------------:|:---------------:|
| External package URL<sup>1</sup> |✔|✔|✔|✔|✔|
| Zip deploy |✔|✔|✔| |✔|
| Docker container | | | | |✔|
| Web Deploy |✔|✔|✔| | |
| Source control |✔|✔|✔| |✔|
| Local Git<sup>1</sup> |✔|✔|✔| |✔|
| Cloud sync<sup>1</sup> |✔|✔|✔| |✔|
| FTP<sup>1</sup> |✔|✔|✔| |✔|
| Portal editing |✔|✔|✔| |✔<sup>2</sup>|

<sup>1</sup> Deployment technology that requires [manual trigger syncing](#trigger-syncing).
<sup>2</sup> Portal editing is enabled for only HTTP and Timer triggers for Functions on Linux using the Dedicated Plan.

## Key concepts

Before continuing, it's important to learn some key concepts that will be critical to understanding how deployments work in Azure Functions.

### Trigger syncing

When you change any of your triggers, the Functions infrastructure needs to be aware of these changes. This synchronization happens automatically for many deployment technologies. However, in some cases you must manually synchronize your triggers. When you deploy your updates using an external package URL, local Git, cloud sync, or FTP, you must be sure to manually synchronize your triggers. You can synchronize triggers in one of three ways:

* Restart your function app in the Azure portal
* Send an HTTP POST request to `https://www.{functionappname}.azurewebsites.net/admin/host/synctriggers?code=<API_KEY>` using the [master key](functions-bindings-http-webhook.md#authorization-keys).
* Send an HTTP POST request to `https://management.azure.com/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP_NAME>/providers/Microsoft.Web/sites/<FUNCTION_APP_NAME>/syncfunctiontriggers?api-version=2016-08-01`. Replace the placeholders with your subscription ID, resource group name, and the name of your function app.

## Deployment technology details  

These following deployment methods are supported by Azure Functions.

### External package URL

Allows you to reference a remote package (.zip) file that contains your function app. The file is downloaded from the provided URL, and the app runs in [Run-From-Package](run-functions-from-deployment-package.md) mode.

>__How to use it:__ Add `WEBSITE_RUN_FROM_PACKAGE` to your application settings. The value of this setting should be a URL - the location of the specific package file you want to run. You can add settings either [in the portal](functions-how-to-use-azure-function-app-settings.md#settings) or [by using the Azure CLI](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-set). 
If using Azure blob storage, you should use a private container with a [Shared Access Signature (SAS)](../vs-azure-tools-storage-manage-with-storage-explorer.md#generate-a-sas-in-storage-explorer) to give Functions access to the package. Anytime the application restarts it will fetch a copy of the content, which means that your reference must be valid for the lifetime of the application.

>__When to use it:__ This is the only deployment method supported for Azure Functions running on Linux in the Consumption plan (Preview). When updating the package file a function app is referencing, you must [manually sync triggers](#trigger-syncing) to tell Azure that your application has changed.

### Zip deploy

Allows you to push a zip file containing your function app to Azure. Optionally, you can also specify to have your app start in [Run-From-Package](run-functions-from-deployment-package.md) mode.

>__How to use it:__ Deploy using your favorite client tool - [VS Code](functions-create-first-function-vs-code.md#publish-the-project-to-azure), [Visual Studio](functions-develop-vs.md#publish-to-azure), or the [Azure CLI](functions-create-first-azure-function-azure-cli.md#deploy-the-function-app-project-to-azure). To manually deploy a zip file to your function app, follow the instructions found at [Deploying from a zip file or url](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file-or-url).
>
>Additionally, when deploying through zip deploy, users can specify to run their app from in [Run-From-Package](run-functions-from-deployment-package.md) mode by setting the `WEBSITE_RUN_FROM_PACKAGE` application setting value as `1`. This option is suggested and yields faster loading times for your applications. This is done by default for the above client tools.

>__When to use it:__ This is the recommended deployment technology for Azure Functions running on Windows, and Azure Functions running on Linux in the Dedicated plan.

### Docker container

Deploy a Linux container image that contains your function app.

>__How to use it:__ Create a Linux function app in the Dedicated plan, and specify which container image to run from. You can do this in two ways:
>
>* Create a Linux function app on an App Service plan in the Azure portal. Select **Docker Image** for **Publish**, and configure the container, providing the location where the image is hosted.
>* Create a Linux function app on an App Service plan through the Azure CLI. Learn how by reviewing [Create a function on Linux using a custom image](functions-create-function-linux-custom-image.md#create-and-deploy-the-custom-image).
>
>To deploy to an existing app using a custom container, use the [`func deploy`](functions-run-local.md#publish) command of the [Azure Functions Core Tools](functions-run-local.md).

>__When to use it:__ Use this option when you need more control over the Linux environment where your function app runs. This deployment mechanism is only available for Functions running on Linux in an App Service plan.

### Web deploy (MSDeploy)

Packages and deploys your Windows applications to any IIS server, including your function apps running on Windows in Azure.

>__How to use it:__ Use the [Visual Studio tools for Azure Functions](functions-create-your-first-function-visual-studio.md), and uncheck the `Run from package file (recommended)` box.
>
> You can also download [Web Deploy 3.6](https://www.iis.net/downloads/microsoft/web-deploy) and call `MSDeploy.exe` directly.

>__When to use it:__ This deployment technology is supported and has no issues, but the preferred mechanism is now [Zip Deploy with Run From Package enabled](#zip-deploy). To learn more, visit the [Visual Studio development guide](functions-develop-vs.md#publish-to-azure).

### Source control

Allows you to connect your function app to a git repository such that any updates to code in that repository triggers deployment. For more information, take a look at the [Kudu Wiki](https://github.com/projectkudu/kudu/wiki/VSTS-vs-Kudu-deployments).

>__How to use it:__ Use the Deployment Center in the Azure Functions portal to set up publishing from source control. For more information, see [Continuous deployment for Azure Functions](functions-continuous-deployment.md).

>__When to use it:__ Using source control is the best practice for teams collaborating on their function apps, and this is a great option that enables more sophisticated deployment pipelines.

### Local git

Lets you push code from your local machine to Azure Functions using Git.

>__How to use it:__ Follow the instructions at [Local Git Deployment to Azure App Service](../app-service/deploy-local-git.md).

>__When to use it:__ In general, other deployment methods are recommended. When publishing from local git, you must [manually sync triggers](#trigger-syncing).

### Cloud sync

Allows you to sync your content from Dropbox and OneDrive to Azure Functions.

>__How to use it:__ Follow the instructions in [Sync content from a cloud folder](../app-service/deploy-content-sync.md).

>__When to use it:__ In general, other deployment methods are recommended. When publishing with cloud sync, you must [manually sync triggers](#trigger-syncing).

### FTP

Lets you directly transfer files to Azure Functions.

>__How to use it:__ Follow the instructions in [Deploy content using FTP/s](../app-service/deploy-ftp.md).

>__When to use it:__ In general, other deployment methods are recommended. When publishing with FTP, you must [manually sync triggers](#trigger-syncing).

### Portal Editing

Using the portal-based editor allows you to directly edit files on your function app (essentially deploying anytime you click **Save**).

>__How to use it:__ To be able to edit your functions in the Azure portal, you must have [created your functions in the portal](functions-create-first-azure-function.md). Using any other deployment method makes your function read only and prevents continued portal editing, to preserve a single source of truth. To return to a state in which you can edit your files using the Azure portal, you can manually turn the edit mode back to `Read/Write` and remove any deployment-related application settings (like `WEBSITE_RUN_FROM_PACKAGE`). 

>__When to use it:__ The portal is a great way to get started with Azure Functions, but for any more intense development work using the client tooling is recommended:
>
>* [Get started using VS Code](functions-create-first-function-vs-code.md)
>* [Get started using the Azure Functions Core Tools](functions-run-local.md)
>* [Get started using Visual Studio](functions-create-your-first-function-visual-studio.md)

The following table shows the operating systems and languages for which portal editing is supported:

| | Windows Consumption | Windows Premium (Preview) | Windows Dedicated | Linux Consumption (Preview) | Linux Dedicated |
|-|:-----------------: |:-------------------------:|:-----------------:|:---------------------------:|:---------------:|
| C# | | | | | |
| C# Script |✔|✔|✔| |✔<sup>*</sup>|
| F# | | | | | |
| Java | | | | | |
| JavaScript (Node.js) |✔|✔|✔| |✔<sup>*</sup>|
| Python (Preview) | | | | | |
| PowerShell (Preview) |✔|✔|✔| | |
| TypeScript (Node.js) | | | | | |

<sup>*</sup> Portal editing is enabled for only HTTP and Timer triggers for Functions on Linux using the Dedicated Plan.

## Deployment slots

When you deploy your function app to Azure, you can deploy to a separate deployment slot instead of directly to production. For more information on deployment slots, see [the Azure App Service Slots documentation](../app-service/deploy-staging-slots.md).

### Deployment slots levels of support

There are two levels of support:

* _Generally available (GA)_ - Fully supported and approved for production use.
* _Preview_ - Not yet supported but is expected to reach GA status in the future.

| OS/Hosting Plan | Level of Support |
| --------------- | ------ |
| Windows Consumption | Preview |
| Windows Premium (Preview) | Preview |
| Windows Dedicated | Generally available |
| Linux Consumption | Unsupported |
| Linux Dedicated | Generally available |

## Next steps

Learn more about deploying your function apps in the following articles: 

+ [Continuous deployment for Azure Functions](functions-continuous-deployment.md)
+ [Continuous delivery using Azure DevOps](functions-how-to-azure-devops.md)
+ [Zip deployments for Azure Functions](deployment-zip-push.md)
+ [Run your Azure Functions from a package file](run-functions-from-deployment-package.md)
+ [Automate resource deployment for your function app in Azure Functions](functions-infrastructure-as-code.md)
