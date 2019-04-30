---
title: Deployment Technologies in Azure Functions  | Microsoft Docs
description: Learn the ins and outs of the different ways you can deploy code to Azure Functions.
services: functions
documentationcenter: .net
author: cotresne
manager: dariac

ms.service: azure-functions
ms.custom: vs-azure
ms.topic: conceptual
ms.date: 04/25/2019
ms.author: cotresne

---

# Deployment Technologies in Azure Functions

There are a few different technologies capable of deploying to Azure Functions. This article provides an exhaustive list of those technologies, informs which technologies are available for which flavors of Functions, explains what's actually happening when each method is used, and provides recommendations for the best method to use in various scenarios.

## Deployment Technology Availability for Azure Functions

> [!IMPORTANT]
> Azure Functions supports cross platform local development, and hosting on two operating systems: Windows and Linux. There are three hosting plans currently available, each with different behaviors - [consumption, premium, and dedicated](functions-scale.md). Not all deployment technologies are available for each flavor of Azure Functions.

| Deployment Technology | Windows Consumption | Windows Premium (Preview) | Windows Dedicated | Linux Consumption (Preview) | Linux Dedicated |
|-----------------------|:-------------------:|:-------------------------:|:-----------------:|:---------------------------:|:---------------:|
| External Package URL |✔|✔|✔|✔|✔|
| Zip Deploy |✔|✔|✔| |✔|
| Web Deploy |✔|✔|✔| | |
| Docker Container | | | | |✔|
| Source Control |✔|✔|✔| |✔|
| Local Git |✔|✔|✔| |✔|
| Cloud Sync |✔|✔|✔| |✔|
| FTP |✔|✔|✔| |✔|
| Portal Editing |✔|✔|✔| |✔<sup>1</sup>|

<sup>1</sup> Portal editing is enabled for only HTTP and Timer triggers for Functions on Linux using the Dedicated Plan.

## Key concepts

Before continuing, it's important to understand some key concepts that will be critical to understanding how deployments work in Azure Functions.

### Trigger Syncing

When a user of Azure Functions modifies the trigger information for of their functions, it must be communicated to Azure Functions infrastructure to ensure proper invocation. This happens automatically for many deployment technologies, but for others, the user must manually synchronize their triggers with Azure Functions. Specifically, when a user deploys via _External Package URL_, _Local Git_, _Cloud Sync_, or _FTP_, they must ensure synchronization manually. This can be accomplished in one of three ways:

1. Refreshing your function app in the Azure portal
2. Sending an HTTP POST request to `https://www.{functionappname}.azurewebsites.net/admin/host/synctriggers?code=<API_KEY>` using the [master key](functions-bindings-http-webhook.md#authorization-keys).
3. Sending an HTTP POST request to `POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/sites/{name}/syncfunctiontriggers?api-version=2016-08-01`

## Deployment Technology Details

### External Package URL

#### What it does

This deployment technology allows you to point your function app towards a package (zip) file which is hosted elsewhere. Azure Functions will grab the file from the provided URL, and will start your app in [Run-From-Package](run-functions-from-deployment-package.md) mode.

#### How to use it

To instruct the functions runtime to grab your zip file from wherever you're hosting it, you must add `WEBSITE_RUN_FROM_PACKAGE` to your app settings. The value of this setting should be a URL - the location of the specific package file you want to run. If using Azure blob storage, you should use a private container with a [Shared Access Signature (SAS)](../vs-azure-tools-storage-manage-with-storage-explorer.md#attach-a-storage-account-by-using-a-shared-access-signature-sas) to give Functions access to the package.

#### When to use it

This is the only deployment method supported for Azure Functions running on Linux in the Consumption plan (Preview). As such it's the recommended version for this scenario. Note that when updating the package file a function app is pointing to, you must manually tell Azure Functions to pick up the latest changes. For more information, see [Trigger Syncing](#trigger-syncing).

### Zip Deploy

#### What it does

This deployment technology allows you to push a zip from one location to your function app in Azure. You can also optionally specify to have your app start in your app in [Run-From-Package](run-functions-from-deployment-package.md) mode.

#### How to use it

To deploy a zip to your function app, send an HTTP request to the `https://{functionappname}.scm.azurewebsites.net/api/zipdeploy` endpoint. This can either include zip contents directly, or point to the URL where a zip file is hosted. The expected request structure is as follows:

| Verb | Arguments |
| ---- | --------- |
| POST | -T \<zipfile\> |
| PUT  | -H "Content-Type: application/json" -d "{'packageUri':'\<zipURL\>}'}" |

For example, using curl:

```bash
curl -X POST -u <user> https://{sitename}.scm.azurewebsites.net/api/zipdeploy -T <zipfile>
curl -X PUT -u <user> https://{sitename}.scm.azurewebsites.net/api/zipdeploy -H "Content-Type: application/json" -d "{'packageUri':'<zipUrl>'}"
```

Additionally, when deploying through zip deploy, users can specify to run their app from in [Run-From-Package](run-functions-from-deployment-package.md) mode by setting the `WEBSITE_RUN_FROM_PACKAGE` application setting value as `1`. This option will yield faster loading times for your applications, since unzipping all files is no longer necessary.

#### When to use it

This is the recommended deployment technology for Azure Functions running on Windows, and Azure Functions running on Linux in the Dedicated plan.

### Web Deploy (MSDeploy)

#### What it does

This deployment technology packages and deploys your Windows applications to any IIS server - including your Azure function apps running on Windows.

#### How to use it

To deploy your application using Web Deploy, use the [Visual Studio tools for Azure Functions](functions-create-your-first-function-visual-studio.md), and don't tick the `Run from package file (recommended)` check box.

Alternatively, call the MSDeploy.exe directly after downloading [Web Deploy 3.6](https://www.iis.net/downloads/microsoft/web-deploy).

#### When to use it

This deployment technology is supported and has no issues, but the preferred mechanism is now [Zip Deploy & Run From Package](#zip-deploy). To learn more, visit the [Visual Studio development guide](functions-develop-vs.md#publish-to-azure).

### Docker Container

#### What it does

This deployment technology allows you to specify a container image which Azure Functions will pull and run.

#### How to use it

To use this deployment technique, specify which container to use on creation of a function app. There are two ways to do this:

1. Create a Linux Dedicated function app in the Azure portal. Select `Docker Image` for Publish, and configure the container, providing the location where the image is hosted.
2. Create a Linux Dedicated function app through the Azure CLI. Learn more about this [here](functions-create-function-linux-custom-image.md#create-and-deploy-the-custom-image).

Alternatively, to deploy to an existing app using a custom container, use the [`func deploy`](functions-run-local.md#publish) command of the [Azure Functions Core Tools](functions-run-local.md).

#### When to use it

If you want to run Functions from a custom container, this is the way to do it. This deployment mechanism is only available for Functions running on Linux in the Dedicated plan.

### Source Control

#### What it does

This deployment technology allows you to hook up your function app with a git repository, such that any pushes to that repository will trigger a publish. For more information, take a look at the [Kudu Wiki](https://github.com/projectkudu/kudu/wiki/Deploying-from-GitHub).

#### How to use it

To set up source control for your function app, use the Deployment Center in the Azure Functions portal. Read more about how to set this up [here](functions-continuous-deployment.md).

#### When to use it

Using source control is the best practice for teams collaborating on their function apps, and this is a great option which enables more sophisticated deployment pipelines.

### Local Git

#### What it does

This deployment technology allows you to push code from your local machine to Azure Functions using Git.

#### How to use it

Follow the instructions [here](../app-service/deploy-local-git.md).

#### When to use it

In general, other deployment methods are recommended. Note that when using this deployment technology, you must manually tell Azure Functions to pick up the latest changes. For more information, see [Trigger Syncing](#trigger-syncing).

### Cloud Sync

#### What it does

This deployment technology allows you to sync your content from Dropbox and OneDrive to Azure Functions.

#### How to use it

Follow the instructions [here](../app-service/deploy-content-sync.md).

#### When to use it

In general, other deployment methods are recommended. Note that when using this deployment technology, you must manually tell Azure Functions to pick up the latest changes. For more information, see [Trigger Syncing](#trigger-syncing).

### FTP

#### What it does

This deployment technology allows you to directly transfer files to Azure Functions.

#### How to use it

Follow the instructions [here](../app-service/deploy-ftp.md).

#### When to use it

In general, other deployment methods are recommended. Note that when using this deployment technology, you must manually tell Azure Functions to pick up the latest changes. For more information, see [Trigger Syncing](#trigger-syncing).

### Portal Editing

#### What it does

This deployment technology consists of using the portal based editor to directly edit files on your function app.

#### How to use it

Navigate to the Azure Functions section of the Azure portal, create a new function app, and create a function. If you pick a language, hosting plan, and operating system which supports portal editing, you will be able to author your functions in the Azure portal, directly touching your production resources.

> [!Note]
> If you've deployed to your function app with any of these technologies, your function app will become read only and the portal editing experience will be disabled. This is because the source of truth for your application is now the deployment source. To return to a state in which you can edit your files using the Azure portal, you can manually turn the edit mode back to `Read/Write` and remove any deployment related Application Settings (like `WEBSITE_RUN_FROM_PACKAGE`).

##### Portal Editing Availability

| | Windows Consumption | Windows Premium (Preview) | Windows Dedicated | Linux Consumption (Preview) | Linux Dedicated |
|-| :-----------------: |:-------------------------:|:-----------------:|:---------------------------:|:---------------:|
| JavaScript (Node.js) |✔|✔|✔| |✔<sup>1</sup>|
| TypeScript (Node.js) | | | | | |
| C# | | | | | |
| C# Script |✔|✔|✔| |✔<sup>1</sup>|
| F# | | | | | |
| Java | | | | | |
| Python (Preview) | | | | | |
| PowerShell (Preview) |✔|✔|✔| | |

<sup>1</sup> Portal editing is enabled for only HTTP and Timer triggers for Functions on Linux using the Dedicated Plan.

#### When to use it

The portal is a great way to get started with Azure Functions, but for any more intense development work using the client tooling is recommended:

* [Get started using VS Code](functions-create-first-function-vs-code.md)
* [Get started using the Azure Functions Core Tools](functions-run-local.md)
* [Get started using Visual Studio](functions-create-your-first-function-visual-studio.md)

## Other Relevant Information

### Deployment Slots

When you deploy your function app to Azure, you can deploy to a separate deployment slot instead of directly to production. For more information on deployment slots, see [the Azure App Service Slots documentation](../app-service/deploy-staging-slots.md).

#### Deployment Slots Levels of Support

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