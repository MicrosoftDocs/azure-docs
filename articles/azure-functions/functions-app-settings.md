---
title: App settings reference for Azure Functions
description: Reference documentation for the Azure Functions app settings or environment variables.
services: functions
author: ggailey777
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 09/22/2018
ms.author: glenga
---

# App settings reference for Azure Functions

App settings in a function app contain global configuration options that affect all functions for that function app. When you run locally, these settings are in environment variables. This article lists the app settings that are available in function apps.

[!INCLUDE [Function app settings](../../includes/functions-app-settings.md)]

There are other global configuration options in the [host.json](functions-host-json.md) file and in the [local.settings.json](functions-run-local.md#local-settings-file) file.

## APPINSIGHTS_INSTRUMENTATIONKEY

The Application Insights instrumentation key if you're using Application Insights. See [Monitor Azure Functions](functions-monitoring.md).

|Key|Sample value|
|---|------------|
|APPINSIGHTS_INSTRUMENTATIONKEY|5dbdd5e9-af77-484b-9032-64f83bb83bb|

## AzureWebJobsDashboard

Optional storage account connection string for storing logs and displaying them in the **Monitor** tab in the portal. The storage account must be a general-purpose one that supports blobs, queues, and tables. See [Storage account](functions-infrastructure-as-code.md#storage-account) and [Storage account requirements](functions-create-function-app-portal.md#storage-account-requirements).

|Key|Sample value|
|---|------------|
|AzureWebJobsDashboard|DefaultEndpointsProtocol=https;AccountName=[name];AccountKey=[key]|

> [!TIP]
> For performance and experience, it is recommended to use APPINSIGHTS_INSTRUMENTATIONKEY and App Insights for monitoring instead of AzureWebJobsDashboard

## AzureWebJobsDisableHomepage

`true` means disable the default landing page that is shown for the root URL of a function app. Default is `false`.

|Key|Sample value|
|---|------------|
|AzureWebJobsDisableHomepage|true|

When this app setting is omitted or set to `false`, a page similar to the following example is displayed in response to the URL `<functionappname>.azurewebsites.net`.

![Function app landing page](media/functions-app-settings/function-app-landing-page.png)

## AzureWebJobsDotNetReleaseCompilation

`true` means use Release mode when compiling .NET code; `false` means use Debug mode. Default is `true`.

|Key|Sample value|
|---|------------|
|AzureWebJobsDotNetReleaseCompilation|true|

## AzureWebJobsFeatureFlags

A comma-delimited list of beta features to enable. Beta features enabled by these flags are not production ready, but can be enabled for experimental use before they go live.

|Key|Sample value|
|---|------------|
|AzureWebJobsFeatureFlags|feature1,feature2|

## AzureWebJobsScriptRoot

The path to the root directory where the *host.json* file and function folders are located. In a function app, the default is `%HOME%\site\wwwroot`.

|Key|Sample value|
|---|------------|
|AzureWebJobsScriptRoot|%HOME%\site\wwwroot|

## AzureWebJobsSecretStorageType

Specifies the repository or provider to use for key storage. Currently, the supported repositories are blob ("Blob") and file system ("disabled"). The default is file system ("disabled").

|Key|Sample value|
|---|------------|
|AzureWebJobsSecretStorageType|disabled|

## AzureWebJobsStorage

The Azure Functions runtime uses this storage account connection string for all functions except for HTTP triggered functions. The storage account must be a general-purpose one that supports blobs, queues, and tables. See [Storage account](functions-infrastructure-as-code.md#storage-account) and [Storage account requirements](functions-create-function-app-portal.md#storage-account-requirements).

|Key|Sample value|
|---|------------|
|AzureWebJobsStorage|DefaultEndpointsProtocol=https;AccountName=[name];AccountKey=[key]|

## AzureWebJobs_TypeScriptPath

Path to the compiler used for TypeScript. Allows you to override the default if you need to.

|Key|Sample value|
|---|------------|
|AzureWebJobs_TypeScriptPath|%HOME%\typescript|

## FUNCTION\_APP\_EDIT\_MODE

Valid values are "readwrite" and "readonly".

|Key|Sample value|
|---|------------|
|FUNCTION\_APP\_EDIT\_MODE|readonly|

## FUNCTIONS\_EXTENSION\_VERSION

The version of the Functions runtime to use in this function app. A tilde with major version means use the latest version of that major version (for example, "~2"). When new versions for the same major version are available, they are automatically installed in the function app. To pin the app to a specific version, use the full version number (for example, "2.0.12345"). Default is "~2". A value of `~1` pins your app to version 1.x of the runtime.

|Key|Sample value|
|---|------------|
|FUNCTIONS\_EXTENSION\_VERSION|~2|

## FUNCTIONS\_WORKER\_RUNTIME

The language worker runtime to load in the function app.  This will correspond to the language being used in your application (for example, "dotnet"). For functions in multiple languages you will need to publish them to multiple apps, each with a corresponding worker runtime value.  Valid values are `dotnet` (C#/F#), `node` (JavaScript), and `java` (Java).

|Key|Sample value|
|---|------------|
|FUNCTIONS\_WORKER\_RUNTIME|dotnet|

## WEBSITE_CONTENTAZUREFILECONNECTIONSTRING

For consumption plans only. Connection string for storage account where the function app code and configuration are stored. See [Create a function app](functions-infrastructure-as-code.md#create-a-function-app).

|Key|Sample value|
|---|------------|
|WEBSITE_CONTENTAZUREFILECONNECTIONSTRING|DefaultEndpointsProtocol=https;AccountName=[name];AccountKey=[key]|

## WEBSITE\_CONTENTSHARE

For consumption plans only. The file path to the function app code and configuration. Used with WEBSITE_CONTENTAZUREFILECONNECTIONSTRING. Default is a unique string that begins with the function app name. See [Create a function app](functions-infrastructure-as-code.md#create-a-function-app).

|Key|Sample value|
|---|------------|
|WEBSITE_CONTENTSHARE|functionapp091999e2|

## WEBSITE\_MAX\_DYNAMIC\_APPLICATION\_SCALE\_OUT

The maximum number of instances that the function app can scale out to. Default is no limit.

> [!NOTE]
> This setting is a preview feature - and only reliable if set to a value <= 5

|Key|Sample value|
|---|------------|
|WEBSITE\_MAX\_DYNAMIC\_APPLICATION\_SCALE\_OUT|5|

## WEBSITE\_NODE\_DEFAULT_VERSION

Default is "8.11.1".

|Key|Sample value|
|---|------------|
|WEBSITE\_NODE\_DEFAULT_VERSION|8.11.1|

## WEBSITE\_RUN\_FROM\_PACKAGE

Enables your function app to run from a mounted package file.

|Key|Sample value|
|---|------------|
|WEBSITE\_RUN\_FROM\_PACKAGE|1|

Valid values are either a URL that resolves to the location of a deployment package file, or `1`. When set to `1`, the package must be in the `d:\home\data\SitePackages` folder. When using zip deployment with this setting, the package is automatically uploaded to this location. In preview, this setting was named `WEBSITE_RUN_FROM_ZIP`. For more information, see [Run your functions from a package file](run-functions-from-deployment-package.md).

## Next steps

[Learn how to update app settings](functions-how-to-use-azure-function-app-settings.md#manage-app-service-settings)

[See global settings in the host.json file](functions-host-json.md)

[See other app settings for App Service apps](https://github.com/projectkudu/kudu/wiki/Configurable-settings)
