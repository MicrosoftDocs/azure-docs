---
title: Deployment technologies in Azure Functions
description: Learn the different ways you can deploy code to Azure Functions.
ms.custom: vs-azure, vscode-azure-extension-update-not-needed, build-2023, build-2024
ms.topic: conceptual
ms.date: 11/07/2024
---

# Deployment technologies in Azure Functions

You can use a few different technologies to deploy your Azure Functions project code to Azure. This article provides an overview of the deployment methods available to you and recommendations for the best method to use in various scenarios. It also provides an exhaustive list of and key details about the underlying deployment technologies.

## Deployment methods

The deployment technology you use to publish code to your function app in Azure depends on your specific needs and the point in the development cycle. For example, during development and testing you may deploy directly from your development tool, such as Visual Studio Code. When your app is in production, you're more likely to publish continuously from source control or by using an automated publishing pipeline, which can include validation and testing.  

The following table describes the available deployment methods for your code project.

| Deployment&nbsp;type | Methods | Best for... |
| --- | --- | --- |
| Tools-based |	&bull;&nbsp;[Azure CLI](/cli/azure/functionapp/deployment/source#az-functionapp-deployment-source-config-zip)<br/>&bull;&nbsp;[Visual&nbsp;Studio&nbsp;Code&nbsp;publish](functions-develop-vs-code.md#publish-to-azure)<br/>&bull;&nbsp;[Visual Studio publish](functions-develop-vs.md#publish-to-azure)<br/>&bull;&nbsp;[Core Tools publish](functions-run-local.md#publish) | Deployments during development and other improvised deployments. Deploying your code on-demand using [local development tools](functions-develop-local.md#local-development-environments). |
| App Service-managed| &bull;&nbsp;[Deployment&nbsp;Center&nbsp;(CI/CD)](functions-continuous-deployment.md)<br/>&bull;&nbsp;[Container&nbsp;deployments](./functions-how-to-custom-container.md#enable-continuous-deployment-to-azure) |  Continuous deployment (CI/CD) from source control or from a container registry. Deployments are managed by the App Service platform (Kudu).|
| External pipelines|&bull;&nbsp;[Azure Pipelines](functions-how-to-azure-devops.md)<br/>&bull;&nbsp;[GitHub Actions](functions-how-to-github-actions.md) | Production pipelines that include validation, testing, and other actions that must be run as part of an automated deployment. Deployments are managed by the pipeline. |

Specific deployments should use the best technology based on the specific scenario. Many of the deployment methods are based on [zip deployment](#zip-deploy), which is recommended for deployment.

## Deployment technology availability

The deployment method also depends on the hosting plan and operating system on which you run your function app.  

Currently, Functions offers five options for hosting your function apps:

+ [Flex Consumption plan](flex-consumption-plan.md)
+ [Consumption](consumption-plan.md)
+ [Elastic Premium plan](functions-premium-plan.md)
+ [Dedicated (App Service) plan](dedicated-plan.md)
+ [Azure Container Apps](functions-container-apps-hosting.md)

Each plan has different behaviors. Not all deployment technologies are available for each hosting plan and operating system. This chart provides information on the supported deployment technologies:

| Deployment technology | Flex Consumption| Consumption | Elastic Premium | Dedicated | Container Apps |
|-----------------------|:-------------------:|:-------------------------:|:------------------:|:---------------------------:|:-------------:|
| [One deploy](#one-deploy) |✔| | | | |
| [Zip deploy](#zip-deploy) | |✔|✔|✔| |
| [External package URL](#external-package-url)<sup>1</sup> | |✔|✔|✔| |
| [Docker container](#docker-container) | | Linux-only | Linux-only | Linux-only |✔|
| [Source control](#source-control) | | Windows-only |✔|✔| |
| [Local Git](#local-git)<sup>1</sup> | |Windows-only |✔|✔| |
| [FTPS](#ftps)<sup>1</sup> | |Windows-only |✔|✔| |
| [In-portal editing](#portal-editing)<sup>2</sup> | |✔|✔|✔| |

<sup>1</sup> Deployment technologies that require you to [manually sync triggers](#trigger-syncing) aren't recommended.   
<sup>2</sup> In-portal editing is disabled when code is deployed to your function app from outside the portal. For more information, including language support details for in-portal editing, see [Language support details](supported-languages.md#language-support-details).    

## Key concepts

Some key concepts are critical to understanding how deployments work in Azure Functions.

### Trigger syncing

When you change any of your triggers, the Functions infrastructure must be aware of the changes. Synchronization happens automatically for many deployment technologies. However, in some cases, you must manually sync your triggers. 

You must manually sync triggers when using these deployment options:

+ [External package URL](#external-package-url)
+ [Local Git](#local-git)
+ [FTPS](#ftps) 

You can sync triggers in one of these ways:

+ Restart your function app in the Azure portal.

+ Use the [`az rest`](/cli/azure/reference-index#az-rest) command to send an HTTP POST request that calls the `syncfunctiontriggers` API, as in this example: 

    ```azurecli
    az rest --method post --url https://management.azure.com/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Web/sites/<APP_NAME>/syncfunctiontriggers?api-version=2016-08-01
    ```
When you deploy an updated version of the deployment package and maintain the same external package URL, you need to manually restart your function app. This indicates to the host that it should synchronize and redeploy your updates from the same package URL.
The Functions host also performs a background trigger sync after the application has started. However, for the Consumption and Elastic Premium hosting plans you should also [manually sync triggers](#trigger-syncing) in these scenarios:

+ Deployments using an external package URL with either ARM Templates or Terraform.
+ When updating the deployment package at the same external package URL.

### Remote build

You can request Azure Functions to perform a remote build of your code project during deployment. In these scenarios, you should request a remote build instead of building locally:

+ You're deploying an app to a Linux-based function app that was developed on a Windows computer. This is commonly the case for Python app development. You can end up with in incorrect libraries being used when building the deployment package locally on Windows.
+ Your project has dependencies on a [custom package index](functions-reference-python.md#remote-build-with-extra-index-url).
+ You want to reduce the size of your deployment package.

How you request a remote build depends on whether your app runs in Azure on Windows or Linux.

#### [Windows](#tab/windows)

All function apps running on Windows have a small management app, the `scm` site provided by [Kudu](https://github.com/projectkudu/kudu). This site handles much of the deployment and build logic for Azure Functions.

When an app is deployed to Windows, language-specific commands, like `dotnet restore` (C#) or `npm install` (JavaScript) are run.

#### [Linux](#tab/linux)

To enable remote build on Linux Consumption, Elastic Premium, and App Service plans, you must set these application settings:

+ [`ENABLE_ORYX_BUILD=true`](functions-app-settings.md#enable_oryx_build)
+ [`SCM_DO_BUILD_DURING_DEPLOYMENT=true`](functions-app-settings.md#scm_do_build_during_deployment)

By default, both [Azure Functions Core Tools](functions-run-local.md) and the [Azure Functions Extension for Visual Studio Code](./create-first-function-vs-code-csharp.md#publish-the-project-to-azure) perform remote builds when deploying to Linux. Because of this, both tools automatically create these settings for you in Azure.

When apps are built remotely on Linux, they [run from the deployment package](run-functions-from-deployment-package.md).

When deploying to the Flex Consumption plan, you don't need to set any application settings to request a remote build. You instead pass a remote build parameter when you start deployment. How you pass this parameter depends on the deployment tool you are using. For Core Tools and Visual Studio Code, a remote build is always requested when deploying a Python app.

---

The following considerations apply when using remote builds during deployment:

+ Remote builds are supported for function apps running on Linux in the Consumption plan. However, deployment options are limited for these apps because they don't have an `scm` (Kudu) site. 
+ Function apps running on Linux in a [Premium plan](functions-premium-plan.md) or in a [Dedicated (App Service) plan](dedicated-plan.md) do have an `scm` (Kudu) site, but it's limited compared to Windows.
+ Remote builds aren't performed when an app is using [run-from-package](run-functions-from-deployment-package.md). To learn how to use remote build in these cases, see [Zip deploy](#zip-deploy).
+ You may have issues with remote build when your app was created before the feature was made available (August 1, 2019). For older apps, either create a new function app or run `az functionapp update --resource-group <RESOURCE_GROUP_NAME> --name <APP_NAME>` to update your function app. This command might take two tries to succeed.

### App content storage

Package-based deployment methods store the package in the storage account associated with the function app, which is defined in the [AzureWebJobsStorage](functions-app-settings.md#azurewebjobsstorage) setting. When available, Consumption and Elastic Premium plan apps try to use the Azure Files content share from this account, but you can also maintain the package in another location. Flex Consumption plan apps instead use a storage container in default storage account, unless you [configure a different storage account to use for deployment](flex-consumption-how-to.md#configure-deployment-settings). For more information, review the details in **Where app content is stored** in each deployment technology covered in the next section.

[!INCLUDE [functions-storage-access-note](../../includes/functions-storage-access-note.md)]

## Deployment technology details

The following deployment methods are available in Azure Functions. Refer to the [deployment technology availability](#deployment-technology-availability) table to determine which technologies each hosting plan supports.

### One deploy
One deploy is the only deployment technology supported for apps on the Flex Consumption plan. The end result is a ready-to-run .zip package that your function app runs on.

>__How to use it:__ Deploy with the [Visual Studio Code](functions-develop-vs-code.md#publish-to-azure) publish feature, or from the command line using [Azure Functions Core Tools](functions-run-local.md#project-file-deployment) or the [Azure CLI](/cli/azure/functionapp/deployment/source#az-functionapp-deployment-source-config-zip). Our [Azure Dev Ops Task](functions-how-to-azure-devops.md#deploy-your-app-1) and [GitHub Action](functions-how-to-github-actions.md) similarly leverage one deploy when they detect that a Flex Consumption app is being deployed to.
>
> When you create a Flex Consumption app, you will need to specify a deployment storage (blob) container as well as an authentication method to it. By default the same storage account as the `AzureWebJobsStorage` connection is used, with a connection string as the authentication method. Thus, your [deployment settings](flex-consumption-how-to.md#configure-deployment-settings) are configured during app create time without any need of application settings.

>__When to use it:__ One deploy is the only deployment technology available for function apps running on the Flex Consumption plan. 

>__Where app content is stored:__ When you create a Flex Consumption function app, you specify a [deployment storage container](functions-infrastructure-as-code.md?pivots=flex-consumption-plan#deployment-sources). This is a blob container where the platform will upload the app content you deployed. To change the location, you can visit the Deployment Settings blade in the Azure portal or use the [Azure CLI](flex-consumption-how-to.md#configure-deployment-settings).

### Zip deploy

Zip deploy is the default and recommended deployment technology for function apps on the Consumption, Elastic Premium, and App Service (Dedicated) plans. The end result a ready-to-run .zip package that your function app runs on. It differs from [external package URL](#external-package-url) in that our platform is responsible for remote building and storing your app content.

>__How to use it:__ Deploy by using your favorite client tool: [Visual Studio Code](functions-develop-vs-code.md#publish-to-azure), [Visual Studio](functions-develop-vs.md#publish-to-azure), or from the command line using [Azure Functions Core Tools](functions-run-local.md#project-file-deployment) or the [Azure CLI](/cli/azure/functionapp/deployment/source#az-functionapp-deployment-source-config-zip). Our [Azure Dev Ops Task](functions-how-to-azure-devops.md#deploy-your-app-1) and [GitHub Action](functions-how-to-github-actions.md) similarly leverage zip deploy. 
>
>When you deploy by using zip deploy, you can set your app to [run from package](run-functions-from-deployment-package.md). To run from package, set the [`WEBSITE_RUN_FROM_PACKAGE`](functions-app-settings.md#website_run_from_package) application setting value to `1`. We recommend zip deployment. It yields faster loading times for your applications, and it's the default for VS Code, Visual Studio, and the Azure CLI.

>__When to use it:__ Zip deploy is the default and recommended deployment technology for function apps on the Windows Consumption, Windows and Linux Elastic Premium, and Windows and Linux App Service (Dedicated) plans.

>__Where app content is stored:__ App content from a zip deploy by default is stored on the file system, which may be backed by Azure Files from the storage account specified when the function app was created. In Linux Consumption, the app content is instead persisted on a blob in the storage account specified by the `AzureWebJobsStorage` app setting, and the app setting `WEBSITE_RUN_FROM_PACKAGE` will take on the value of the blob URL.

### External package URL

External package URL is an option if you want to manually control how deployments are performed. You take responsibility for uploading a ready-to-run .zip package containing your built app content to blob storage and referencing this external URL as an application setting on your function app. Whenever your app restarts, it fetches the package, mounts it, and runs in [Run From Package](run-functions-from-deployment-package.md) mode.

>__How to use it:__ Add [`WEBSITE_RUN_FROM_PACKAGE`](functions-app-settings.md#website_run_from_package) to your application settings. The value of this setting should be a blob URL pointing to the location of the specific package you want your app to run. You can add settings either [in the portal](functions-how-to-use-azure-function-app-settings.md#settings) or [by using the Azure CLI](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-set).
>
>If you use Azure Blob Storage, your Function app can access the container either by using a managed identity-based connection or with a [shared access signature (SAS)](../vs-azure-tools-storage-manage-with-storage-explorer.md#generate-a-sas-in-storage-explorer). The option you choose affects what kind of URL you use as the value for WEBSITE_RUN_FROM_PACKAGE. Managed identity is recommended for overall security and because SAS tokens expire and must be manually maintained.
>
>Whenever you deploy the package file that a function app references, you must [manually sync triggers](#trigger-syncing), including the initial deployment. When you change the contents of the package file and not the URL itself, you must also restart your function app to sync triggers. Refer to our [how-to guide](run-functions-from-deployment-package.md#use-website_run_from_package--url) on configuring this deployment technology.

>__When to use it:__ External package URL is the only supported deployment method for apps running on the Linux Consumption plan when you don't want a [remote build](#remote-build) to occur. This method is also the recommended deployment technology when you [create your app without Azure Files](storage-considerations.md#create-an-app-without-azure-files). For scalable apps running on Linux, you should instead consider [Flex Consumption plan](flex-consumption-plan.md) hosting.

>__Where app content is stored:__ You are responsible for uploading your app content to blob storage. You may use any blob storage account, though Azure Blob Storage is recommended. 

### Docker container

You can deploy a function app running in a Linux container.

>__How to use it:__ [Create your functions in a Linux container](functions-create-container-registry.md) then deploy the container to a Premium or Dedicated plan in Azure Functions or another container host. Use the [Azure Functions Core Tools](functions-run-local.md#) to create a customized Dockerfile for your project that you use to build a containerized function app. You can use the container in the following deployments: 
>
>+ Deploy to Azure Functions resources you create in the Azure portal. For more information, see [Azure portal create using containers](functions-how-to-custom-container.md#azure-portal-create-using-containers). 
>+ Deploy to Azure Functions resources you create from the command line. Requires either a Premium or Dedicated (App Service) plan. To learn how, see [Create your first containerized Azure Functions](functions-deploy-container.md). 
>+ Deploy to Azure Container Apps. To learn how, see [Create your first containerized Azure Functions on Azure Container Apps](functions-deploy-container-apps.md).
>+ Deploy to Azure Arc (preview). To learn how, see [Working with containers and Azure Functions](functions-how-to-custom-container.md?pivots=azure-arc).
>+ Deploy to a Kubernetes cluster. You can deploy to a cluster using [Azure Functions Core Tools](functions-run-local.md). Use the [`func kubernetes deploy`](functions-core-tools-reference.md#func-kubernetes-deploy) command. 

>__When to use it:__ Use the Docker container option when you need more control over the Linux environment where your function app runs and where the container is hosted. This deployment mechanism is available only for functions running on Linux.

>__Where app content is stored:__ App content is stored in the specified container registry as a part of the image.

### Source control

You can enable continuous integration between your function app and a source code repository. With source control enabled, an update to code in the connected source repository triggers deployment of the latest code from the repository. For more information, see the [Continuous deployment for Azure Functions](functions-continuous-deployment.md).

>__How to use it:__ The easiest way to set up publishing from source control is from the Deployment Center in the Functions area of the portal. For more information, see [Continuous deployment for Azure Functions](functions-continuous-deployment.md).  

>__When to use it:__ Using source control is the best practice for teams that collaborate on their function apps. Source control is a good deployment option that enables more sophisticated deployment pipelines. Source control is usually enabled on a staging slot, which can be swapped into production after validation of updates from the repository. For more information, see [Azure Functions deployment slots](functions-deployment-slots.md). 

>__Where app content is stored:__ The app content is in the source control system, but a locally cloned and built app content from is stored on the app file system, which may be backed by Azure Files from the storage account specified when the function app was created.

### Local Git

You can use local Git to push code from your local machine to Azure Functions by using Git.

>__How to use it:__ Follow the instructions in [Local Git deployment to Azure App Service](../app-service/deploy-local-git.md).

>__When to use it:__ To reduce the chance of errors, you should avoid using deployment methods that require the additional step of [manually syncing triggers](#trigger-syncing). Use [zip deployment](run-functions-from-deployment-package.md) when possible.

>__Where app content is stored:__ App content is stored on the file system, which may be backed by Azure Files from the storage account specified when the function app was created.

### FTP/S

You can use FTP/S to directly transfer files to Azure Functions, although this deployment method isn't recommended. When you're not planning on using FTP, you should disable it. If you do choose to use FTP, you should enforce FTPS. To learn how in the Azure portal, see [Enforce FTPS](../app-service/deploy-ftp.md#enforce-ftps). 

>__How to use it:__ Follow the instructions in [FTPS deployment settings](functions-how-to-use-azure-function-app-settings.md#ftps-deployment-settings) to get the URL and credentials you can use to deploy to your function app using FTPS. 

>__When to use it:__ To reduce the chance of errors, you should avoid using deployment methods that require the additional step of [manually syncing triggers](#trigger-syncing). Use [zip deployment](run-functions-from-deployment-package.md) when possible.

>__Where app content is stored:__ App content is stored on the file system, which may be backed by Azure Files from the storage account specified when the function app was created.

### Portal editing

In the portal-based editor, you can directly edit the files that are in your function app (essentially deploying every time you save your changes).

>__How to use it:__ To be able to edit your functions in the [Azure portal](https://portal.azure.com), you must have [created your functions in the portal](./functions-get-started.md). To preserve a single source of truth, using any other deployment method makes your function read-only and prevents continued portal editing. To return to a state in which you can edit your files in the Azure portal, you can manually turn the edit mode back to `Read/Write` and remove any deployment-related application settings (like [`WEBSITE_RUN_FROM_PACKAGE`](functions-app-settings.md#website_run_from_package)).

>__When to use it:__ The portal is a good way to get started with Azure Functions. Because of [development limitations in the Azure portal](functions-how-to-use-azure-function-app-settings.md#development-limitations-in-the-azure-portal), you should use one of the following client tools more advanced development work:
>
>+ [Visual Studio Code](./create-first-function-vs-code-csharp.md)
>+ [Azure Functions Core Tools (command line)](functions-run-local.md)
>+ [Visual Studio](functions-create-your-first-function-visual-studio.md)

>__Where app content is stored:__ App content is stored on the file system, which may be backed by Azure Files from the storage account specified when the function app was created.

## Deployment behaviors

When you deploy updates to your function app code, currently executing functions are terminated. After deployment completes, the new code is loaded to begin processing requests. Review [Improve the performance and reliability of Azure Functions](performance-reliability.md#write-functions-to-be-stateless) to learn how to write stateless and defensive functions.

If you need more control over this transition, you should use deployment slots.

## Deployment slots

When you deploy your function app to Azure, you can deploy to a separate deployment slot instead of directly to production. Deploying to a deployment slot and then swapping into production after verification is the recommended way to configure [continuous deployment](./functions-continuous-deployment.md). 

The way that you deploy to a slot depends on the specific deployment tool you use. For example, when using Azure Functions Core Tools, you include the`--slot` option to indicate the name of a specific slot for the [`func azure functionapp publish`](./functions-core-tools-reference.md#func-azure-functionapp-publish) command. 

For more information on deployment slots, see the [Azure Functions Deployment Slots](functions-deployment-slots.md) documentation for details.

## Next steps

Read these articles to learn more about deploying your function apps:

+ [Continuous deployment for Azure Functions](functions-continuous-deployment.md)
+ [Continuous delivery by using Azure Pipelines](functions-how-to-azure-devops.md)
+ [Zip deployments for Azure Functions](deployment-zip-push.md)
+ [Run your Azure Functions from a package file](run-functions-from-deployment-package.md)
+ [Automate resource deployment for your function app in Azure Functions](functions-infrastructure-as-code.md)
