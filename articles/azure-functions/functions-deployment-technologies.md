---
title: Deployment technologies in Azure Functions
description: Learn the different ways you can deploy code to Azure Functions.
ms.custom: vs-azure, vscode-azure-extension-update-not-needed, build-2023
ms.topic: conceptual
ms.date: 06/22/2023
---

# Deployment technologies in Azure Functions

You can use a few different technologies to deploy your Azure Functions project code to Azure. This article provides an overview of the deployment methods available to you and recommendations for the best method to use in various scenarios. It also provides an exhaustive list of and key details about the underlying deployment technologies.

## Deployment methods

The deployment technology you use to publish code to your function app in Azure depends on your specific needs and the point in the development cycle. For example, during development and testing you may deploy directly from your development tool, such as Visual Studio Code. When your app is in production, you're more likely to publish continuously from source control or by using an automated publishing pipeline, which can include validation and testing.  

The following table describes the available deployment methods for your code project.

| Deployment&nbsp;type | Methods | Best for... |
| --- | --- | --- |
| Tools-based |	&bull;&nbsp;[Visual&nbsp;Studio&nbsp;Code&nbsp;publish](functions-develop-vs-code.md#publish-to-azure)<br/>&bull;&nbsp;[Visual Studio publish](functions-develop-vs.md#publish-to-azure)<br/>&bull;&nbsp;[Core Tools publish](functions-run-local.md#publish) | Deployments during development and other improvised deployments. Deploying your code on-demand using [local development tools](functions-develop-local.md#local-development-environments). |
| App Service-managed| &bull;&nbsp;[Deployment&nbsp;Center&nbsp;(CI/CD)](functions-continuous-deployment.md)<br/>&bull;&nbsp;[Container&nbsp;deployments](./functions-how-to-custom-container.md#enable-continuous-deployment-to-azure) |  Continuous deployment (CI/CD) from source control or from a container registry. Deployments are managed by the App Service platform (Kudu).|
| External pipelines|&bull;&nbsp;[Azure Pipelines](functions-how-to-azure-devops.md)<br/>&bull;&nbsp;[GitHub Actions](functions-how-to-github-actions.md) | Production pipelines that include validation, testing, and other actions that must be run as part of an automated deployment. Deployments are managed by the pipeline. |

Specific deployments should use the best technology based on the specific scenario. Many of the deployment methods are based on [zip deployment](#zip-deploy), which is recommended for deployment.

## Deployment technology availability

The deployment method also depends on the hosting plan and operating system on which you run your function app.  
Currently, Functions offers three hosting plans:

+ [Consumption](consumption-plan.md)
+ [Premium](functions-premium-plan.md)
+ [Dedicated (App Service)](dedicated-plan.md)

Each plan has different behaviors. Not all deployment technologies are available for each hosting plan and operating system. This chart provides information on the supported deployment technologies:

| Deployment technology | Windows Consumption | Windows Premium | Windows Dedicated  | Linux Consumption | Linux Premium | Linux Dedicated |
|-----------------------|:-------------------:|:-------------------------:|:------------------:|:---------------------------:|:-------------:|:---------------:|
| [External package URL](#external-package-url)<sup>1</sup> |✔|✔|✔|✔|✔|✔|
| [Zip deploy](#zip-deploy) |✔|✔|✔|✔|✔|✔|
| [Docker container](#docker-container) | | | | |✔|✔|
| [Web Deploy](#web-deploy-msdeploy) |✔|✔|✔| | | |
| [Source control](#source-control) |✔|✔|✔| |✔|✔|
| [Local Git](#local-git)<sup>1</sup> |✔|✔|✔| |✔|✔|
| [Cloud sync](#cloud-sync)<sup>1</sup> |✔|✔|✔| |✔|✔|
| [FTPS](#ftps)<sup>1</sup> |✔|✔|✔| |✔|✔|
| [In-portal editing](#portal-editing)<sup>2</sup> |✔|✔|✔|✔|✔<sup>3</sup>|✔<sup>3</sup>|

<sup>1</sup> Deployment technologies that require you to [manually sync triggers](#trigger-syncing) aren't recommended.   
<sup>2</sup> In-portal editing is disabled when code is deployed to your function app from outside the portal. For more information, including language support details for in-portal editing, see [Language support details](supported-languages.md#language-support-details).  
<sup>3</sup> In-portal editing is enabled only for HTTP and Timer triggered functions running on Linux in Premium and Dedicated plans.  

## Key concepts

Some key concepts are critical to understanding how deployments work in Azure Functions.

### Trigger syncing

When you change any of your triggers, the Functions infrastructure must be aware of the changes. Synchronization happens automatically for many deployment technologies. However, in some cases, you must manually sync your triggers. When you deploy your updates by referencing an external package URL, local Git, cloud sync, or FTP, you must manually sync your triggers. You can sync triggers in one of three ways:

+ Restart your function app in the Azure portal.
+ Send an HTTP POST request to `https://{functionappname}.azurewebsites.net/admin/host/synctriggers?code=<API_KEY>` using the [master key](functions-bindings-http-webhook-trigger.md#authorization-keys).
+ Send an HTTP POST request to `https://management.azure.com/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP_NAME>/providers/Microsoft.Web/sites/<FUNCTION_APP_NAME>/syncfunctiontriggers?api-version=2016-08-01`. Replace the placeholders with your subscription ID, resource group name, and the name of your function app. This request requires an [access token](/rest/api/azure/#acquire-an-access-token) in the [`Authorization` request header](/rest/api/azure/#request-header). 

When you deploy using an external package URL, you need to manually restart your function app to fully sync your updates when the package changes without changing the URL.

### Remote build

Azure Functions can automatically perform builds on the code it receives after zip deployments. These builds behave slightly differently depending on whether your app is running on Windows or Linux. 

#### [Windows](#tab/windows)

All function apps running on Windows have a small management app, the SCM site provided by [Kudu](https://github.com/projectkudu/kudu). This site handles much of the deployment and build logic for Azure Functions.

When an app is deployed to Windows, language-specific commands, like `dotnet restore` (C#) or `npm install` (JavaScript) are run.

#### [Linux](#tab/linux)

To enable remote build on Linux, you must set these application settings:

+ [`ENABLE_ORYX_BUILD=true`](functions-app-settings.md#enable_oryx_build)
+ [`SCM_DO_BUILD_DURING_DEPLOYMENT=true`](functions-app-settings.md#scm_do_build_during_deployment)

By default, both [Azure Functions Core Tools](functions-run-local.md) and the [Azure Functions Extension for Visual Studio Code](./create-first-function-vs-code-csharp.md#publish-the-project-to-azure) perform remote builds when deploying to Linux. Because of this, both tools automatically create these settings for you in Azure.

When apps are built remotely on Linux, they [run from the deployment package](run-functions-from-deployment-package.md).

---

The following considerations apply when using remote builds during deployment:

+ Remote builds are supported for function apps running on Linux in the Consumption plan, however they don't have an SCM/Kudu site, which limits deployment options. 
+ Function apps running on Linux a [Premium plan](functions-premium-plan.md) or in a [Dedicated (App Service) plan](dedicated-plan.md) do have an SCM/Kudu site, but it's limited compared to Windows.
+ Remote builds aren't performed when an app has previously been set to run in [run-from-package](run-functions-from-deployment-package.md) mode. To learn how to use remote build in these cases, see [Zip deploy](#zip-deploy).
+ You may have issues with remote build when your app was created before the feature was made available (August 1, 2019). For older apps, either create a new function app or run `az functionapp update --resource-group <RESOURCE_GROUP_NAME> --name <APP_NAME>` to update your function app. This command might take two tries to succeed.

### App content storage

Several deployment methods store the deployed or built application payload on the storage account associated with the function app. Functions tries to use the Azure Files content share when configured, but some methods instead store the payload in the blob storage instance associated with the `AzureWebJobsStorage` connection. See the details in the _Where app content is stored_ paragraphs of each deployment technology covered in the next section.

[!INCLUDE [functions-storage-access-note](../../includes/functions-storage-access-note.md)]

## Deployment technology details

The following deployment methods are available in Azure Functions.

### External package URL

You can use an external package URL to reference a remote package (.zip) file that contains your function app. The file is downloaded from the provided URL, and the app runs in [Run From Package](run-functions-from-deployment-package.md) mode.

>__How to use it:__ Add [`WEBSITE_RUN_FROM_PACKAGE`](functions-app-settings.md#website_run_from_package) to your application settings. The value of this setting should be a URL (the location of the specific package file you want to run). You can add settings either [in the portal](functions-how-to-use-azure-function-app-settings.md#settings) or [by using the Azure CLI](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-set).
>
>If you use Azure Blob storage, use a private container with a [shared access signature (SAS)](../vs-azure-tools-storage-manage-with-storage-explorer.md#generate-a-sas-in-storage-explorer) to give Functions access to the package. Any time the application restarts, it fetches a copy of the content. Your reference must be valid for the lifetime of the application.

>__When to use it:__ External package URL is the only supported deployment method for Azure Functions running on Linux in the Consumption plan, if the user doesn't want a [remote build](#remote-build) to occur. When you update the package file that a function app references, you must [manually sync triggers](#trigger-syncing) to tell Azure that your application has changed. When you change the contents of the package file and not the URL itself, you must also restart your function app manually.

>__Where app content is stored:__ App content is stored at the URL specified. This could be on Azure Blobs, possibly in the storage account specified by the `AzureWebJobsStorage` connection. Some client tools may default to deploying to a blob in this account. For example, for Linux Consumption apps, the Azure CLI will attempt to deploy through a package stored in a blob on the account specified by `AzureWebJobsStorage`.

### Zip deploy

Use zip deploy to push a .zip file that contains your function app to Azure. Optionally, you can set your app to start [running from package](run-functions-from-deployment-package.md), or specify that a [remote build](#remote-build) occurs.

>__How to use it:__ Deploy by using your favorite client tool: [Visual Studio Code](functions-develop-vs-code.md#publish-to-azure), [Visual Studio](functions-develop-vs.md#publish-to-azure), or from the command line using the [Azure Functions Core Tools](functions-run-local.md#project-file-deployment). By default, these tools use zip deployment and [run from package](run-functions-from-deployment-package.md). Core Tools and the Visual Studio Code extension both enable [remote build](#remote-build) when deploying to Linux. To manually deploy a .zip file to your function app, follow the instructions in [Deploy from a .zip file or URL](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file-or-url).

>When you deploy by using zip deploy, you can set your app to [run from package](run-functions-from-deployment-package.md). To run from package, set the [`WEBSITE_RUN_FROM_PACKAGE`](functions-app-settings.md#website_run_from_package) application setting value to `1`. We recommend zip deployment. It yields faster loading times for your applications, and it's the default for VS Code, Visual Studio, and the Azure CLI.

>__When to use it:__ Zip deploy is the recommended deployment technology for Azure Functions.

>__Where app content is stored:__ App content from a zip deploy by default is stored on the file system, which may be backed by Azure Files from the storage account specified when the function app was created. In Linux Consumption, the app content instead is persisted on a blob in the storage account specified by the `AzureWebJobsStorage` connection.

### Docker container

You can deploy a function app running in a Linux container.

>__How to use it:__ [Create your functions in a Linux container](functions-create-container-registry.md) then deploy the container to a Premium or Dedicated plan in Azure Functions or another container host. Use the [Azure Functions Core Tools](functions-run-local.md#) to create a customized Dockerfile for your project that you use to build a containerized function app. You can use the container in the following deployments: 
>
>+ Deploy to Azure Functions resources you create in the Azure portal. For more information, see [Azure portal create using containers](functions-how-to-custom-container.md#azure-portal-create-using-containers). 
>+ Deploy to Azure Functions resources you create from the command line. Requires either a Premium or Dedicated (App Service) plan. To learn how, see [Create your first containerized Azure Functions](functions-deploy-container.md). 
>+ Deploy to Azure Container Apps (preview). To learn how, see [Create your first containerized Azure Functions on Azure Container Apps](functions-deploy-container-apps.md).
>+ Deploy to Azure Arc (preview). To learn how, see [Create your first containerized Azure Functions on Azure Arc (preview)](create-first-function-arc-custom-container.md).
>+ Deploy to a Kubernetes cluster. You can deploy to a cluster using [Azure Functions Core Tools](functions-run-local.md). Use the [`func kubernetes deploy`](functions-core-tools-reference.md#func-kubernetes-deploy) command. 

>__When to use it:__ Use the Docker container option when you need more control over the Linux environment where your function app runs and where the container is hosted. This deployment mechanism is available only for functions running on Linux.

>__Where app content is stored:__ App content is stored in the specified container registry as a part of the image.

### Web Deploy (MSDeploy)

Web Deploy packages and deploys your Windows applications to any IIS server, including your function apps running on Windows in Azure.

>__How to use it:__ Use [Visual Studio tools for Azure Functions](functions-create-your-first-function-visual-studio.md). Clear the **Run from package file (recommended)** check box.
>
>You can also download [Web Deploy 3.6](https://www.iis.net/downloads/microsoft/web-deploy) and call `MSDeploy.exe` directly.

>__When to use it:__ Web Deploy is supported and has no issues, but the preferred mechanism is [zip deploy with Run From Package enabled](#zip-deploy). To learn more, see the [Visual Studio development guide](functions-develop-vs.md#publish-to-azure).

>__Where app content is stored:__ App content is stored on the file system, which may be backed by Azure Files from the storage account specified when the function app was created.

### Source control

Use source control to connect your function app to a Git repository. An update to code in that repository triggers deployment. For more information, see the [Kudu Wiki](https://github.com/projectkudu/kudu/wiki/VSTS-vs-Kudu-deployments).

>__How to use it:__ Use Deployment Center in the Functions area of the portal to set up publishing from source control. For more information, see [Continuous deployment for Azure Functions](functions-continuous-deployment.md).

>__When to use it:__ Using source control is the best practice for teams that collaborate on their function apps. Source control is a good deployment option that enables more sophisticated deployment pipelines.

>__Where app content is stored:__ The app content is in the source control system, but a locally cloned and built app content from is stored on the app file system, which may be backed by Azure Files from the storage account specified when the function app was created.

### Local Git

You can use local Git to push code from your local machine to Azure Functions by using Git.

>__How to use it:__ Follow the instructions in [Local Git deployment to Azure App Service](../app-service/deploy-local-git.md).

>__When to use it:__ To reduce the chance of errors, you should avoid using deployment methods that require the additional step of [manually syncing triggers](#trigger-syncing). Use [zip deployment](run-functions-from-deployment-package.md) when possible.

>__Where app content is stored:__ App content is stored on the file system, which may be backed by Azure Files from the storage account specified when the function app was created.

### Cloud sync

Use cloud sync to sync your content from Dropbox and OneDrive to Azure Functions.

>__How to use it:__ Follow the instructions in [Sync content from a cloud folder](../app-service/deploy-content-sync.md).

>__When to use it:__ To reduce the chance of errors, you should avoid using deployment methods that require the additional step of [manually syncing triggers](#trigger-syncing). Use [zip deployment](run-functions-from-deployment-package.md) when possible.

>__Where app content is stored:__ The app content is in the cloud store, but a local copy is stored on the app file system, which may be backed by Azure Files from the storage account specified when the function app was created.

### FTP/S

You can use FTP/S to directly transfer files to Azure Functions, although this deployment method isn't recommended. When you're not planning on using FTP, you should disable it. If you do choose to use FTP, you should enforce FTPS. To learn how in the Azure portal, see [Enforce FTPS](../app-service/deploy-ftp.md#enforce-ftps). 

>__How to use it:__ Follow the instructions in [FTPS deployment settings](functions-how-to-use-azure-function-app-settings.md#ftps-deployment-settings) to get the URL and credentials you can use to deploy to your function app using FTPS. 

>__When to use it:__ To reduce the chance of errors, you should avoid using deployment methods that require the additional step of [manually syncing triggers](#trigger-syncing). Use [zip deployment](run-functions-from-deployment-package.md) when possible.

>__Where app content is stored:__ App content is stored on the file system, which may be backed by Azure Files from the storage account specified when the function app was created.

### Portal editing

In the portal-based editor, you can directly edit the files that are in your function app (essentially deploying every time you save your changes).

>__How to use it:__ To be able to edit your functions in the [Azure portal](https://portal.azure.com), you must have [created your functions in the portal](./functions-get-started.md). To preserve a single source of truth, using any other deployment method makes your function read-only and prevents continued portal editing. To return to a state in which you can edit your files in the Azure portal, you can manually turn the edit mode back to `Read/Write` and remove any deployment-related application settings (like [`WEBSITE_RUN_FROM_PACKAGE`](functions-app-settings.md#website_run_from_package)).

>__When to use it:__ The portal is a good way to get started with Azure Functions. For more advanced development work, we recommend that you use one of the following client tools:
>
>+ [Visual Studio Code](./create-first-function-vs-code-csharp.md)
>+ [Azure Functions Core Tools (command line)](functions-run-local.md)
>+ [Visual Studio](functions-create-your-first-function-visual-studio.md)

>__Where app content is stored:__ App content is stored on the file system, which may be backed by Azure Files from the storage account specified when the function app was created.

The following table shows the operating systems and languages that support in-portal editing:

| Language | Windows Consumption | Windows Premium | Windows Dedicated | Linux Consumption | Linux Premium | Linux Dedicated |
|-|:-----------------: |:----------------:|:-----------------:|:-----------------:|:-------------:|:---------------:|
| C# | | | | | |
| C# Script |✔|✔|✔| |✔<sup>\*</sup> |✔<sup>\*</sup>|
| F# | | | | | | |
| Java | | | | | | |
| JavaScript (Node.js) |✔|✔|✔| |✔<sup>1</sup>|✔<sup>1</sup>|
| Python<sup>2</sup> | | | |✔ |✔<sup>1</sup> |✔<sup>1</sup> |
| PowerShell |✔|✔|✔| | | |
| TypeScript (Node.js) | | | | | | |

<sup>1</sup> In-portal editing is enabled only for HTTP and Timer triggers for Functions on Linux using Premium and Dedicated plans.  
<sup>2</sup> In-portal editing is only supported for the [v1 Python programming model](functions-reference-python.md?pivots=python-mode-configuration).  

## Deployment behaviors

When you deploy updates to your function app code, currently executing functions are terminated. After deployment completes, the new code is loaded to begin processing requests. Review [Improve the performance and reliability of Azure Functions](performance-reliability.md#write-functions-to-be-stateless) to learn how to write stateless and defensive functions.

If you need more control over this transition, you should use deployment slots.

## Deployment slots

When you deploy your function app to Azure, you can deploy to a separate deployment slot instead of directly to production. For more information on deployment slots, see the [Azure Functions Deployment Slots](functions-deployment-slots.md) documentation for details.

## Next steps

Read these articles to learn more about deploying your function apps:

+ [Continuous deployment for Azure Functions](functions-continuous-deployment.md)
+ [Continuous delivery by using Azure Pipelines](functions-how-to-azure-devops.md)
+ [Zip deployments for Azure Functions](deployment-zip-push.md)
+ [Run your Azure Functions from a package file](run-functions-from-deployment-package.md)
+ [Automate resource deployment for your function app in Azure Functions](functions-infrastructure-as-code.md)
