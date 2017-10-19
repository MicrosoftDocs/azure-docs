---
title: How to target Azure Functions runtime versions | Microsoft Docs
description: Functions supports multiple versions of the runtime. Learn how to specify the runtime version of an Azure hosted function app.
services: functions
documentationcenter: 
author: ggailey777
manager: cfowler
editor: ''

ms.service: functions
ms.workload: na
ms.devlang: na
ms.topic: article
ms.date: 10/04/2017
ms.author: glenga

---
# How to target Azure Functions runtime versions

The Azure Functions runtime implements the serverless execution of your code in Azure. You find this runtime in various environments other than hosted in Azure. The [Azure Functions Core Tools](functions-run-local.md) implements this runtime on your development computer. [Azure Functions Runtime](functions-runtime-overview.md) lets you use Functions in on-premise environments. 

Functions supports multiple major versions of the runtime. A major version update can introduce breaking changes. This topic describes how you can target your function apps to a specific runtime version when hosted in Azure. 

Functions lets you target a specific major version of the runtime by using the `FUNCTIONS_EXTENSION_VERSION` application setting in your function app. This applies to both public and preview versions. Your function app is kept on the specified major runtime version until you explicitly choose to move to a new version. You function app is updated to new minor versions of the runtime when they become available. Minor version updates do not introduce breaking changes.  

When a new major version is publicly available, you are given the chance to move up to that version when you view your function app in the portal. After moving to a new version, you can always use the `FUNCTIONS_EXTENSION_VERSION` application setting to move back to a previous runtime version.

Each change to the runtime version causes your function app to restart. Release notes for all runtime releases (both major and minor) are published in the [GitHub repository](https://github.com/Azure/azure-webjobs-sdk-script/releases).   
## View the current runtime version

Use the following procedure to view the specific runtime version currently used by your function app. 

1. In the [Azure portal](https://portal.azure.com), navigate to your function app, and under **Configured Features**, choose **Function app settings**. 

    ![Select function app settings](./media/functions-versions/add-update-app-setting.png)

2. In the **Function app settings** tab, locate the **Runtime version**. Note the specific runtime version and the requested major version. In the example below, the major version is set to `~1.0`.
 
   ![Select function app settings](./media/functions-versions/function-app-view-version.png)

## Target the Functions version 2.0 runtime

>[!IMPORTANT]   
> Azure Functions runtime 2.0 is in preview, and currently not all features of Azure Functions are supported. For more information, see [Azure Functions runtime 2.0 known issues](https://github.com/Azure/azure-webjobs-sdk-script/wiki/Azure-Functions-runtime-2.0-known-issues)  

<!-- Add a table comparing the 1.x and 2.x runtime features-->

[!INCLUDE [functions-set-runtime-version](../../includes/functions-set-runtime-version.md)]

You can move your function app to the runtime version 2.0 preview in the Azure portal. In the **Function app settings** tab,  choose **beta** under **Runtime version**.  

   ![Select function app settings](./media/functions-versions/function-app-view-version.png)

This setting is equivalent to setting the `FUNCTIONS_EXTENSION_VERSION` application setting to `beta`. Choose the **~1** button to move back to the current publicly supported major version. You can also use the Azure CLI to update this application setting. 

## Target a specific runtime version from the portal

When you need to target a major version other than the current major version or version 2.0, you must set the `FUNCTIONS_EXTENSION_VERSION` application setting.

1. In the [Azure portal](https://portal.azure.com), navigate to your function app, and under **Configured Features**, choose **Application settings**.

    ![Select function app settings](./media/functions-versions/add-update-app-setting1a.png)

2. In the **Application settings** tab, find the `FUNCTIONS_EXTENSION_VERSION` setting and change the value to a valid major version of the 1.x runtime or `beta` for version 2.0. 

    ![Set the function app setting](./media/functions-versions/add-update-app-setting2.png)

3. Click **Save** to save the application setting update. 

## Target a specific version using Azure CLI

 You can also set the `FUNCTIONS_EXTENSION_VERSION` from the Azure CLI. Using the Azure CLI, update the application setting in the function app with the [az functionapp config appsettings set](/cli/azure/functionapp/config/appsettings#set) command.

```azurecli-interactive
az functionapp config appsettings set --name <function_app> \
--resource-group <my_resource_group> \
--settings FUNCTIONS_EXTENSION_VERSION=<version>
```
In this code, replace `<function_app>` with the name of your function app. Also replace `<my_resource_group>` with the name of the resource group for your function app. Replace `<version>` with a valid major version of the 1.x runtime or `beta` for version 2.0. 

You can run this command from the [Azure Cloud Shell](../cloud-shell/overview.md) by choosing **Try it** in the preceding code sample. You can also use the [Azure CLI locally](/cli/azure/install-azure-cli) to execute this command after executing [az login](/cli/azure#az_login) to sign in.
