---
title: How to target Azure Functions runtime versions
description: Azure Functions supports multiple versions of the runtime. Learn how to specify the runtime version of an Azure hosted function app.
services: functions
documentationcenter: 
author: ggailey777
manager: cfowler
editor: ''

ms.service: functions
ms.workload: na
ms.devlang: na
ms.topic: article
ms.date: 11/07/2017
ms.author: glenga

---
# How to target Azure Functions runtime versions

A function app runs on a specific version of the Azure Functions runtime. There are two major versions: 1.x and 2.x. This article explains how to choose which major version to use and how to configure a function app to run on the version you choose.

This article doesn't cover setting the runtime version on your development computer. For information about how to do that, see [Code and test Azure Functions locally](functions-run-local.md).

## Differences between runtime 1.x and 2.x

> [!NOTE] 
> Runtime 1.x is the only version approved for production use. Runtime 2.x is in preview. 

### Languages

The following table indicates which programming languages are supported in each runtime version.

[!INCLUDE [functions-supported-languages](../../includes/functions-supported-languages.md)]

For more information, see [Supported languages](supported-languages.md).

### Bindings 

The experimental bindings that runtime 1.x supports are not available in 2.x. For information about bindings support and other functional gaps in 2.x, see [Runtime 2.0 known issues](https://github.com/Azure/azure-webjobs-sdk-script/wiki/Azure-Functions-runtime-2.0-known-issues).

Runtime 2.x lets you create custom [binding extensions](https://github.com/Azure/azure-webjobs-sdk-extensions/wiki/Binding-Extensions-Overview). Built-in bindings that use this extensibility model are only available in 2.x; among the first of these is the [Microsoft Graph bindings](functions-bindings-microsoft-graph.md).

### Cross-platform development

Runtime 1.x supports function development only in the portal or on Windows; with 2.x you can develop and run Azure Functions on Linux or macOS.

## Automatic and manual version updates

Functions lets you target a specific version of the runtime by using the `FUNCTIONS_EXTENSION_VERSION` application setting in a function app. The function app is kept on the specified major version until you explicitly choose to move to a new version.

If you specify only the major version ("~1" for 1.x or "beta" for 2.x), the function app is automatically updated to new minor versions of the runtime when they become available. New minor versions do not introduce breaking changes. If you specify a minor version (for example, "1.0.11360"), the function app is kept on that version until you explicitly change it. 

When a new version is publicly available, a prompt in the portal gives you the chance to move up to that version. After moving to a new version, you can always use the `FUNCTIONS_EXTENSION_VERSION` application setting to move back to a previous version.

A change to the runtime version causes a function app to restart.

The values you can set in the `FUNCTIONS_EXTENSION_VERSION` app setting to enable automatic updates are currently "~1" for the 1.x runtime and "beta" for 2.x.

## View the current runtime version

Use the following procedure to view the runtime version currently used by a function app. 

1. In the [Azure portal](https://portal.azure.com), navigate to the function app, and under **Configured Features**, choose **Function app settings**. 

    ![Select function app settings](./media/functions-versions/add-update-app-setting.png)

2. In the **Function app settings** tab, locate the **Runtime version**. Note the specific runtime version and the requested major version. In the example below, the FUNCTIONS\_EXTENSION\_VERSION app setting is set to `~1`.
 
   ![Select function app settings](./media/functions-versions/function-app-view-version.png)

## Target the version 2.0 runtime

>[!IMPORTANT]   
> Azure Functions runtime 2.0 is in preview and currently not all features of Azure Functions are supported. For more information, see [Differences between runtime 1.x and 2.x](#differences-between-runtime-1x-and-2x) earlier in this article.

You can move a function app to the runtime version 2.0 preview in the Azure portal. In the **Function app settings** tab,  choose **beta** under **Runtime version**.  

![Select function app settings](./media/functions-versions/function-app-view-version.png)

This setting is equivalent to setting the `FUNCTIONS_EXTENSION_VERSION` application setting to `beta`. Choose the **~1** button to move back to the current publicly supported major version. You can also use the Azure CLI to update this application setting. 

## Target a version using the portal

When you need to target a version other than the current major version or version 2.0, you must set the `FUNCTIONS_EXTENSION_VERSION` application setting.

1. In the [Azure portal](https://portal.azure.com), navigate to your function app, and under **Configured Features**, choose **Application settings**.

    ![Select function app settings](./media/functions-versions/add-update-app-setting1a.png)

2. In the **Application settings** tab, find the `FUNCTIONS_EXTENSION_VERSION` setting and change the value to a valid version of the 1.x runtime or `beta` for version 2.0. 

    ![Set the function app setting](./media/functions-versions/add-update-app-setting2.png)

3. Click **Save** to save the application setting update. 

## Target a version using Azure CLI

 You can also set the `FUNCTIONS_EXTENSION_VERSION` from the Azure CLI. Using the Azure CLI, update the application setting in the function app with the [az functionapp config appsettings set](/cli/azure/functionapp/config/appsettings#set) command.

```azurecli-interactive
az functionapp config appsettings set --name <function_app> \
--resource-group <my_resource_group> \
--settings FUNCTIONS_EXTENSION_VERSION=<version>
```
In this code, replace `<function_app>` with the name of your function app. Also replace `<my_resource_group>` with the name of the resource group for your function app. Replace `<version>` with a valid version of the 1.x runtime or `beta` for version 2.0. 

You can run this command from the [Azure Cloud Shell](../cloud-shell/overview.md) by choosing **Try it** in the preceding code sample. You can also use the [Azure CLI locally](/cli/azure/install-azure-cli) to execute this command after executing [az login](/cli/azure#az_login) to sign in.

## Next steps

> [!div class="nextstepaction"]
> [Target the 2.0 runtime in your local development environment](functions-run-local.md)

> [!div class="nextstepaction"]
> [See Release notes for runtime versions](https://github.com/Azure/azure-webjobs-sdk-script/releases)