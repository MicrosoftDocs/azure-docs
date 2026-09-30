---
title: Deployment technologies in Azure Functions
description: Learn the different ways you can deploy code to Azure Functions.
ms.custom: vs-azure, vscode-azure-extension-update-not-needed, build-2023, build-2024
ms.topic: concept-article
ms.date: 08/28/2026
zone_pivot_groups: functions-hosting-plan
---

# Deployment technologies in Azure Functions

You can use several different technologies to deploy your Azure Functions project code to Azure. This article provides an overview of the deployment methods available to you and recommendations for the best method to use in various scenarios. It also provides a comprehensive list of and key details about the underlying deployment technologies.

## Deployment methods

The deployment technology you use to publish code to your function app in Azure depends on your specific needs and the point in the development cycle. For example, during development and testing, you can deploy directly from your development tool, such as Visual Studio Code. When your app is in production, you're more likely to publish continuously from source control or by using an automated publishing pipeline, which can include validation and testing.  

The following table describes the available deployment methods for your code project.

| Deployment type | Methods | Best for... |
| --- | --- | --- |
| Tools-based | [Azure CLI](/cli/azure/functionapp/deployment/source#az-functionapp-deployment-source-config-zip)<br>[Visual Studio Code publish](functions-develop-vs-code.md#publish-to-azure)<br>[Visual Studio publish](functions-develop-vs.md#publish-to-azure)<br>[Core Tools publish](functions-run-local.md#publish) | Deployments during development and other improvised deployments. Deploying your code on-demand by using [local development tools](functions-develop-local.md#local-development-environments). |
| Platform-managed | [Deployment Center (CI/CD)](functions-continuous-deployment.md)<br>[Container deployments](./functions-how-to-custom-container.md#enable-continuous-deployment-to-azure) | Continuous deployment (CI/CD) from source control or from a container registry. The hosting platform manages deployments. |
| External pipelines | [Azure Pipelines](functions-how-to-azure-devops.md)<br>[GitHub Actions](functions-how-to-github-actions.md) | Production pipelines that include validation, testing, and other actions that must run as part of an automated deployment. The pipeline manages deployments. |

Use the best technology for your specific scenario. For supported hosting plans, many of the deployment methods use zip deployment.

## Deployment technology availability

The deployment method also depends on the hosting plan and operating system on which you run your function app.  

Currently, Functions offers five options for hosting your function apps:

+ [Flex Consumption plan](flex-consumption-plan.md)
+ [Elastic Premium plan](functions-premium-plan.md)
+ [Dedicated (App Service) plan](dedicated-plan.md)
+ [Azure Container Apps](../container-apps/functions-overview.md)
+ [Consumption plan](consumption-plan.md) (legacy)

Each plan has different behaviors. Not all deployment technologies are available for each hosting plan and operating system. This chart provides information on the supported deployment technologies:

| Deployment technology | Flex Consumption | Consumption | Elastic Premium | Dedicated | Container Apps |
| --- | :---: | :---: | :---: | :---: | :---: |
| Flex Consumption package deployment | Supported | Not supported | Not supported | Not supported | Not supported |
| ZIP deployment | Not supported | Supported | Supported | Supported | Not supported |
| External package URL<sup>1</sup> | Not supported | Supported | Supported | Supported | Not supported |
| Container image (Docker) | Not supported | Linux-only | Linux-only | Linux-only | Supported |
| Source control | Not supported | Windows-only | Supported | Supported | Not supported |
| Local Git<sup>1</sup> | Not supported | Windows-only | Supported | Supported | Not supported |
| FTPS<sup>1</sup> | Not supported | Windows-only | Supported | Supported | Not supported |
| In-portal editing<sup>2</sup> | Not supported | Supported | Supported | Supported | Not supported |

1. Deployment technologies that require you to manually sync triggers aren't recommended.
2. In-portal editing is disabled when code is deployed to your function app from outside the portal. For more information, including language support details for in-portal editing, see [Language support details](supported-languages.md#language-support-details).

Select your hosting plan at the top of this article to view the deployment technologies and behaviors that apply to your function app.

## Key concepts

Some key concepts are critical to understanding how deployments work in Azure Functions.

### App content storage by hosting plan

The location of deployed app content depends on the hosting plan and deployment technology:

| Hosting plan | App content storage |
| --- | --- |
| Flex Consumption | A blob deployment container that you configure for the function app. |
| Consumption, Elastic Premium, and Dedicated | The app file system, an Azure Files content share, or an external package URL, depending on the deployment technology. |
| Azure Container Apps | A container image stored in a container registry. |

::: zone pivot="premium-plan,dedicated-plan,consumption-plan"

### Trigger syncing

When a deployment adds, removes, or changes a function or its trigger configuration, the Functions infrastructure must update the trigger metadata for the function app. This synchronization happens automatically for many deployment technologies. However, in some cases, you must manually sync your triggers.

You must always manually sync triggers when using these deployment options:

+ [External package URL](#external-package-url)
+ [Local Git](#local-git)
+ [FTPS](#ftps) 

You can manually sync triggers in one of these ways:

+ Restart your function app in the Azure portal. The Functions host performs a background trigger sync after the application starts. 

+ Use the [`az rest`](/cli/azure/reference-index#az-rest) command to send an HTTP POST request that calls the `syncfunctiontriggers` API, as in this example: 

    ```azurecli
    az rest --method post --url https://management.azure.com/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Web/sites/<APP_NAME>/syncfunctiontriggers?api-version=2016-08-01
    ```

Keep these considerations in mind for the sync triggers operation: 

+ You must manually restart your function app any time you deploy an updated version of the deployment package by using the same external package URL.
+ For apps running in a Consumption or Elastic Premium plan, you must also [manually sync triggers](#trigger-syncing) in these scenarios:
    + When deployments use an external package URL with a resource manager-based deployment by using ARM templates or Bicep or Terraform files.
    + When you update the deployment package _in-place_ by using the same external package URL.
+ When you add network restrictions to an existing function app, you must guarantee connectivity to the default host storage account set in the `AzureWebJobsStorage` app setting. For more information, see [How to use a secured storage account with Azure Functions](configure-networking-how-to.md).

::: zone-end

::: zone pivot="premium-plan,dedicated-plan,consumption-plan"

### Remote build

You can request Azure Functions to perform a remote build of your code project during deployment. In these scenarios, request a remote build instead of building locally:

+ You're deploying an app to a Linux-based function app that you developed on a Windows computer. This situation is commonly the case for Python app development. You can end up with incorrect libraries when you build the deployment package locally on Windows.
+ Your project has dependencies on a [custom package index](./python-build-options.md#remote-build-with-an-extra-index-url).
+ You want to reduce the size of your deployment package.

How you request a remote build depends on whether your app runs in Azure on Windows or Linux.

#### [Windows](#tab/windows)

All function apps running on Windows have a companion deployment site. This site handles much of the deployment and build logic for Azure Functions.

When you deploy an app to Windows, the deployment process runs language-specific commands, like `dotnet restore` (C#) or `npm install` (JavaScript).

#### [Linux](#tab/linux)

To enable remote build on Linux Consumption, Elastic Premium, and App Service plans, set these application settings:

+ [`ENABLE_ORYX_BUILD=true`](functions-app-settings.md#enable_oryx_build)
+ [`SCM_DO_BUILD_DURING_DEPLOYMENT=true`](functions-app-settings.md#scm_do_build_during_deployment)

By default, both [Azure Functions Core Tools](functions-run-local.md) and the [Azure Functions Extension for Visual Studio Code](./how-to-create-function-vs-code.md?pivot=programming-language-csharp#deploy-the-project-to-azure) perform remote builds when deploying to Linux. Because of this, both tools automatically create these settings for you in Azure.

When you build apps remotely on Linux, they [run from the deployment package](deployment-zip-push.md#run-functions-from-the-deployment-package).

---

The following considerations apply when using remote builds during deployment:

+ Remote builds are supported for function apps running on Linux in the Consumption plan. However, deployment options are limited for these apps because they don't have a companion deployment site.
+ Function apps running on Linux in an [Elastic Premium plan](functions-premium-plan.md) or in a [Dedicated (App Service) plan](dedicated-plan.md) do have a companion deployment site, but it's limited compared to Windows.
+ Don't set `WEBSITE_RUN_FROM_PACKAGE` when you request a remote build. For Linux Consumption, Elastic Premium, and Dedicated plan apps, instead enable remote build by using the deployment settings described in the **Linux** tab. The deployment process can package the build output and configure the app to run from that package.
+ You might have issues with remote build when your app was created before the feature was made available (August 1, 2019). For older apps, either create a new function app or run `az functionapp update --resource-group <RESOURCE_GROUP_NAME> --name <APP_NAME>` to update your function app. This command might take two tries to succeed.

::: zone-end

::: zone pivot="flex-consumption-plan"

### Remote build

For Flex Consumption, you request a remote build by passing a remote build parameter when you start deployment. You don't configure remote build by using application settings. For Core Tools and Visual Studio Code, a remote build is always requested when you deploy a Python app. For more information, see [Deployment](flex-consumption-plan.md#deployment).

::: zone-end

::: zone pivot="flex-consumption-plan"

### App content storage

Flex Consumption stores the current package in the configured deployment storage container. By default, this container is in the same account used by `AzureWebJobsStorage`, but you can [configure a different deployment storage account](flex-consumption-how-to.md#configure-deployment-settings).

[!INCLUDE [functions-storage-access-note](../../includes/functions-storage-access-note.md)]

::: zone-end

::: zone pivot="premium-plan,dedicated-plan,consumption-plan"

### App content storage

Depending on the deployment technology, your app content can be stored on the app file system, an Azure Files content share, or at an external package URL. Review **Where app content is stored** for each deployment technology in the next section.

[!INCLUDE [functions-storage-access-note](../../includes/functions-storage-access-note.md)]

::: zone-end

::: zone pivot="flex-consumption-plan,premium-plan,dedicated-plan,consumption-plan"

### Secured virtual networks

When your function app has [private endpoints](functions-networking-options.md#private-endpoints) enabled and public network access is disabled, the deployment endpoint isn't publicly reachable. Push deployment tools, including Core Tools, Visual Studio Code, Azure CLI, GitHub Actions, and Azure Pipelines, send packages to this endpoint. The machine, runner, or agent that performs the deployment must have both network connectivity and DNS resolution for the private deployment endpoint.

You can provide this connectivity in these ways:

+ For Azure Pipelines, use a [self-hosted agent](/azure/devops/pipelines/agents/docker) on a connected network or configure a [managed DevOps agent pool with networking](/azure/devops/managed-devops-pools/configure-networking).
+ For GitHub Actions, use a [self-hosted runner](https://docs.github.com/actions/concepts/runners/self-hosted-runners) on a connected network or configure a [GitHub-hosted runner with Azure private networking](https://docs.github.com/organizations/managing-organization-settings/about-azure-private-networking-for-github-hosted-runners-in-your-organization).
+ Connect your development machine by using a [point-to-site VPN](../vpn-gateway/point-to-site-about.md), site-to-site VPN, or [ExpressRoute](../expressroute/expressroute-introduction.md).

The deployment resource can be in the same virtual network or in a network that has routing and DNS connectivity to the private endpoint, such as a peered virtual network.

Resource Manager-based package deployments don't push the package from the initiating client to the deployment endpoint. Instead, the deployment service retrieves the package from the URL provided in the deployment resource. The package URL and the deployment storage must be accessible to the deployment service. For Flex Consumption, see [Deploy by using Bicep or an Azure Resource Manager template](deployment-zip-push.md#deploy-by-using-bicep-or-an-azure-resource-manager-template).

For more information about configuring your function app in a virtual network, see [How to configure Azure Functions with a virtual network](configure-networking-how-to.md).

::: zone-end

::: zone pivot="container-apps"

### App content storage and networking

Azure Functions on Azure Container Apps deploys your app as a container image. The image is stored in a container registry, and networking is managed by the Container Apps environment. For more information, see [Azure Functions on Azure Container Apps overview](../container-apps/functions-overview.md) and [Networking in Azure Container Apps](../container-apps/networking.md).

::: zone-end

## Deployment behavior by hosting plan

The following deployment methods apply to your selected hosting plan. To compare technologies across all plans, see the [deployment technology availability](#deployment-technology-availability) table.

::: zone pivot="flex-consumption-plan"

### Flex Consumption package deployment

Package deployment is the only code deployment technology supported for apps on a [Flex Consumption plan](./flex-consumption-plan.md). The deployment process stores a ready-to-run .zip package in the app's deployment container, and the function app runs directly from that package.

>**How to use it:** Deploy by using the [Visual Studio Code](functions-develop-vs-code.md#publish-to-azure) publish feature, or from the command line by using [Azure Functions Core Tools](functions-run-local.md#project-file-deployment) or the [Azure CLI](/cli/azure/functionapp/deployment/source#az-functionapp-deployment-source-config-zip). The [Azure DevOps task](functions-how-to-azure-devops.md#deploy-your-app) and [GitHub Action](functions-how-to-github-actions.md) similarly select the correct package deployment behavior when they detect a Flex Consumption app.
>
> When you create a Flex Consumption app, you must specify a deployment storage (blob) container as well as an authentication method to it. By default the same storage account as the `AzureWebJobsStorage` connection is used, with a connection string as the authentication method. Thus, your [deployment settings](flex-consumption-how-to.md#configure-deployment-settings) are configured during app create time without any need of application settings.

>**When to use it:** Use package deployment for all Flex Consumption code deployments. No other code deployment technology is supported.

>**Where app content is stored:** When you create a Flex Consumption function app, you specify a [deployment storage container](functions-infrastructure-as-code.md?pivots=flex-consumption-plan#deployment-sources). The deployment service stores the processed, ready-to-run package in this container. Push deployment tools first send the source package to the app's deployment endpoint; they don't upload directly to the deployment container. To change the storage location, open the **Deployment settings** page in the Azure portal or use the [Azure CLI](flex-consumption-how-to.md#configure-deployment-settings).

The underlying platform API is sometimes identified as `OneDeploy`. Infrastructure-as-code definitions expose this implementation through the literal `/onedeploy` resource name. You don't need to select or configure this API when you deploy by using supported development tools or CI/CD providers.

> [!TIP]
> A **Flex Consumption Deployment** diagnostic tool is available in the Azure portal. Open your Flex Consumption app, select **Diagnose and solve problems**, and search for `Flex Consumption Deployment`. This tool displays detailed information about your deployments, including deployment history, package status, and troubleshooting recommendations.

::: zone-end

::: zone pivot="premium-plan,dedicated-plan,consumption-plan"

### ZIP deployment

ZIP deployment is the default and recommended deployment technology for function apps on the Consumption, Elastic Premium, and Dedicated (App Service) plans. The end result is a ready-to-run .zip package that your function app runs on. It differs from [external package URL](#external-package-url) in that the platform is responsible for remote building and storing your app content.

>**How to use it:** Deploy by using your preferred client tool: [Visual Studio Code](functions-develop-vs-code.md#publish-to-azure), [Visual Studio](functions-develop-vs.md#publish-to-azure), or from the command line by using [Azure Functions Core Tools](functions-run-local.md#project-file-deployment) or the [Azure CLI](/cli/azure/functionapp/deployment/source#az-functionapp-deployment-source-config-zip). The [Azure DevOps task](functions-how-to-azure-devops.md#deploy-your-app) and [GitHub Action](functions-how-to-github-actions.md) similarly use ZIP deployment.
>
>When you use ZIP deployment, you can set your app to [run from package](deployment-zip-push.md#run-functions-from-the-deployment-package). To run from package, set the [`WEBSITE_RUN_FROM_PACKAGE`](functions-app-settings.md#website_run_from_package) application setting value to `1`. We recommend ZIP deployment. It yields faster loading times for your applications, and it's the default for Visual Studio Code, Visual Studio, and the Azure CLI.

>**When to use it:** ZIP deployment is the default and recommended deployment technology for function apps on the Windows Consumption, Windows and Linux Elastic Premium, and Windows and Linux App Service (Dedicated) plans.

>**Where app content is stored:** App content from a ZIP deployment is by default stored on the file system, which Azure might back by Azure Files from the storage account you specify when creating the function app. In Linux Consumption, the app content is instead persisted on a blob in the storage account specified by the `AzureWebJobsStorage` app setting, and the app setting `WEBSITE_RUN_FROM_PACKAGE` takes on the value of the blob URL.

### External package URL

Use an external package URL when you want to manually control how deployments happen. You're responsible for uploading a ready-to-run .zip package that contains your built app content to blob storage and referencing this external URL as an application setting on your function app. Whenever your app restarts, it fetches the package, mounts it, and [runs from the package](deployment-zip-push.md#run-from-an-external-package-url).

>**How to use it:** Add [`WEBSITE_RUN_FROM_PACKAGE`](functions-app-settings.md#website_run_from_package) to your application settings. The value of this setting should be a blob URL pointing to the location of the specific package you want your app to run. You can add settings either [in the portal](functions-how-to-use-azure-function-app-settings.md#settings) or [by using the Azure CLI](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-set).
>
>If you use Azure Blob Storage, your function app can access the container either by using a managed identity-based connection or with a [shared access signature (SAS)](../storage/storage-explorer/vs-azure-tools-storage-manage-with-storage-explorer.md#generate-a-sas-in-storage-explorer). The option you choose affects what kind of URL you use as the value for `WEBSITE_RUN_FROM_PACKAGE`. Managed identity is recommended for overall security and because SAS tokens expire and must be manually maintained.
>
>Whenever you deploy the package file that a function app references, you must [manually sync triggers](#trigger-syncing), including the initial deployment. When you change the contents of the package file and not the URL itself, you must also restart your function app to sync triggers. For configuration steps, see [Run from an external package URL](deployment-zip-push.md#run-from-an-external-package-url).

>**When to use it:** External package URL is the only supported deployment method for apps running on the Linux Consumption plan when you don't want a [remote build](#remote-build) to occur. This method is also the recommended deployment technology when you [create your app without Azure Files](storage-considerations.md#create-an-app-without-azure-files). For scalable apps running on Linux, you should instead consider [Flex Consumption plan](flex-consumption-plan.md) hosting.

>**Where app content is stored:** You are responsible for uploading your app content to blob storage. You can use any blob storage account, though Azure Blob Storage is recommended.

### Docker container

You can deploy a function app running in a Linux container.

>**How to use it:** [Create your functions in a Linux container](functions-create-container-registry.md) then deploy the container to a Premium or Dedicated plan in Azure Functions or another container host. Use the [Azure Functions Core Tools](functions-run-local.md#) to create a customized Dockerfile for your project that you use to build a containerized function app. You can use the container in the following deployments:
>
>+ Deploy to Azure Functions resources you create in the Azure portal. For more information, see [Azure portal create using containers](functions-how-to-custom-container.md#azure-portal-create-using-containers). 
>+ Deploy to Azure Functions resources you create from the command line. Requires either a Premium or Dedicated (App Service) plan. To learn how, see [Create your first containerized Azure Functions](functions-deploy-container.md). 
>+ Deploy to a Kubernetes cluster. You can deploy to a cluster using [Azure Functions Core Tools](functions-run-local.md). Use the [`func kubernetes deploy`](functions-core-tools-reference.md#func-kubernetes-deploy) command. 

>**When to use it:** Use the Docker container option when you need more control over the Linux environment where your function app runs and where the container is hosted. This deployment mechanism is available only for functions running on Linux.

>**Where app content is stored:** You store app content in the specified container registry as a part of the image.

### Source control

You can enable continuous integration between your function app and a source code repository. When you enable source control, an update to code in the connected source repository triggers deployment of the latest code from the repository. For more information, see the [Continuous deployment for Azure Functions](functions-continuous-deployment.md).

>**How to use it:** The easiest way to set up publishing from source control is from the Deployment Center in the Functions area of the portal. For more information, see [Continuous deployment for Azure Functions](functions-continuous-deployment.md).

>**When to use it:** Using source control is the best practice for teams that collaborate on their function apps. Source control is a good deployment option that enables more sophisticated deployment pipelines. Usually, you enable source control on a staging slot, which you can swap into production after validation of updates from the repository. For more information, see [Azure Functions deployment slots](functions-deployment-slots.md).

>**Where app content is stored:** The source control system stores the app content. The app file system stores a locally cloned and built app content form, which Azure Files from the storage account specified when the function app was created might back.

### Local Git

Use local Git to push code from your local machine to Azure Functions by using Git.

>**How to use it:** Follow the instructions in [Local Git deployment to Azure App Service](../app-service/deploy-local-git.md).

>**When to use it:** To reduce the chance of errors, avoid using deployment methods that require the additional step of [manually syncing triggers](#trigger-syncing). Use [zip deployment](deployment-zip-push.md) when possible.

>**Where app content is stored:** The file system stores app content. The file system might be backed by Azure Files from the storage account you specify when creating the function app.

### FTPS

You can use FTPS to directly transfer files to Azure Functions, but don't use this deployment method. When you aren't planning to use FTPS, disable it. To learn how in the Azure portal, see [Enforce FTPS](../app-service/deploy-ftp.md#enforce-ftps).

>**How to use it:** Follow the instructions in [FTPS deployment settings](functions-how-to-use-azure-function-app-settings.md#ftps-deployment-settings) to get the URL and credentials you can use to deploy to your function app by using FTPS.

>**When to use it:** To reduce the chance of errors, avoid using deployment methods that require the additional step of [manually syncing triggers](#trigger-syncing). Use [zip deployment](deployment-zip-push.md) when possible.

>**Where app content is stored:** App content is stored on the file system. FTP/FTPS deployments fail when your app's file system is backed by Azure Files in the default host storage account. FTP/FTPS fails with Azure Files as mounted storage because of [FTP limitations](../app-service/configure-connect-to-azure-storage.md#limitations).

### In-portal editing

In the portal-based editor, you can directly edit the files that are in your function app (essentially deploying every time you save your changes).

>**How to use it:** To edit your functions in the [Azure portal](https://portal.azure.com), you must [create your functions in the portal](./functions-get-started.md). To preserve a single source of truth, using any other deployment method makes your function read-only and prevents continued portal editing. To return to a state in which you can edit your files in the Azure portal, you can manually turn the edit mode back to `Read/Write` and remove any deployment-related application settings (like [`WEBSITE_RUN_FROM_PACKAGE`](functions-app-settings.md#website_run_from_package)).

>**When to use it:** The portal is a good way to get started with Azure Functions. Because of [development limitations in the Azure portal](functions-how-to-use-azure-function-app-settings.md#development-limitations-in-the-azure-portal), you should use one of the following client tools for more advanced development work:
>
>+ [Visual Studio Code](./how-to-create-function-vs-code.md?pivot=programming-language-csharp)
>+ [Azure Functions Core Tools (command line)](functions-run-local.md)
>+ [Visual Studio](functions-create-your-first-function-visual-studio.md)

>**Where app content is stored:** App content is stored on the file system, which might be backed by Azure Files from the storage account you specify when creating the function app.

::: zone-end

::: zone pivot="container-apps"

### Container image deployment

Azure Functions on Azure Container Apps deploys your code as a container image. You can deploy from a code project by using the managed Container Apps experience, or deploy a custom image when you need control over the image contents. For more information, see [Create a function app on Azure Container Apps using code](../container-apps/functions-container-apps.md) and [Azure Functions on Azure Container Apps overview](../container-apps/functions-overview.md).

::: zone-end

## Deployment behaviors

When you deploy updates to your function app code, the deployment behavior depends on your hosting plan.

::: zone pivot="premium-plan,dedicated-plan,consumption-plan"

Currently executing functions stop when you deploy new code. After deployment finishes, the new code loads and starts processing requests. This forceful termination behavior is known as a **recreate strategy**. For near zero-downtime deployments, use [deployment slots](#deployment-slots).

Review [Improve the performance and reliability of Azure Functions](performance-reliability.md#write-functions-to-be-stateless) to learn how to write stateless and defensive functions.

::: zone-end

::: zone pivot="flex-consumption-plan"

The default behavior uses the **recreate strategy**, which stops currently executing functions during deployment. Flex Consumption supports two site update strategies. You can [configure rolling updates](flex-consumption-site-updates.md) for zero-downtime deployments.

::: zone-end

::: zone pivot="container-apps"

Azure Container Apps manages application updates by using revisions. For more information about controlling how new revisions receive traffic, see [Update and deploy changes in Azure Container Apps](../container-apps/revisions.md).

::: zone-end

::: zone pivot="flex-consumption-plan"

## Deployment slots

Flex Consumption doesn't support deployment slots. For zero-downtime deployments, [configure rolling updates](flex-consumption-site-updates.md).

::: zone-end

::: zone pivot="premium-plan,dedicated-plan,consumption-plan"

## Deployment slots

When you deploy your function app to Azure, you can deploy to a separate deployment slot instead of directly to production. Deploying to a deployment slot and then swapping into production after verification is the recommended way to configure [continuous deployment](./functions-continuous-deployment.md).

The way that you deploy to a slot depends on the specific deployment tool you use. For example, when you use Azure Functions Core Tools, include the `--slot` option to indicate the name of a specific slot for the [`func azure functionapp publish`](./functions-core-tools-reference.md#func-azure-functionapp-publish) command.

For more information on deployment slots, see the [Azure Functions Deployment Slots](functions-deployment-slots.md) documentation.

::: zone-end

## Next steps

Read these articles to learn more about deploying your function apps:

+ [Continuous deployment for Azure Functions](functions-continuous-deployment.md)
+ [Continuous delivery by using Azure Pipelines](functions-how-to-azure-devops.md)
+ [Zip deployments for Azure Functions](deployment-zip-push.md)
+ [Automate resource deployment for your function app in Azure Functions](functions-infrastructure-as-code.md)
+ [Configure zero-downtime deployments in Flex Consumption](flex-consumption-site-updates.md)
