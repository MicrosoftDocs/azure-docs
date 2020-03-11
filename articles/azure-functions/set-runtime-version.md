---
title: How to target Azure Functions runtime versions
description: Azure Functions supports multiple versions of the runtime. Learn how to specify the runtime version of a function app hosted in Azure.

ms.topic: conceptual
ms.date: 11/26/2018
---

# How to target Azure Functions runtime versions

A function app runs on a specific version of the Azure Functions runtime. There are three major versions: [1.x, 2.x, and 3.x](functions-versions.md). By default, function apps are created in version 2.x of the runtime. This article explains how to configure a function app in Azure to run on the version you choose. For information about how to configure a local development environment for a specific version, see [Code and test Azure Functions locally](functions-run-local.md).

## Automatic and manual version updates

Azure Functions lets you target a specific version of the runtime by using the `FUNCTIONS_EXTENSION_VERSION` application setting in a function app. The function app is kept on the specified major version until you explicitly choose to move to a new version.

If you specify only the major version, the function app is automatically updated to new minor versions of the runtime when they become available. New minor versions shouldn't introduce breaking changes. If you specify a minor version (for example, "2.0.12345"), the function app is pinned to that specific version until you explicitly change it.

> [!NOTE]
> If you pin to a specific version of Azure Functions, and then try to publish to Azure using Visual Studio, a dialog window will pop up prompting you to update to the latest version or cancel the publish. To avoid this, add the `<DisableFunctionExtensionVersionUpdate>true</DisableFunctionExtensionVersionUpdate>` property in your `.csproj` file.

When a new version is publicly available, a prompt in the portal gives you the chance to move up to that version. After moving to a new version, you can always use the `FUNCTIONS_EXTENSION_VERSION` application setting to move back to a previous version.

The following table shows the `FUNCTIONS_EXTENSION_VERSION` values for each major version to enable automatic updates:

| Major version | `FUNCTIONS_EXTENSION_VERSION` value |
| ------------- | ----------------------------------- |
| 3.x  | `~3` |
| 2.x  | `~2` |
| 1.x  | `~1` |

A change to the runtime version causes a function app to restart.

## View and update the current runtime version

You can change the runtime version used by your function app. Because of the potential of breaking changes, you can only change the runtime version before you have created any functions in your function app. 

> [!IMPORTANT]
> Although the runtime version is determined by the `FUNCTIONS_EXTENSION_VERSION` setting, you should make this change in the Azure portal and not by changing the setting directly. This is because the portal validates your changes and makes other related changes as needed.

### From the Azure portal

[!INCLUDE [Set the runtime version in the portal](../../includes/functions-view-update-version-portal.md)]

> [!NOTE]
> Using the Azure portal, you can't change the runtime version for a function app that already contains functions.

### <a name="view-and-update-the-runtime-version-using-azure-cli"></a>From the Azure CLI

You can also view and set the `FUNCTIONS_EXTENSION_VERSION` from the Azure CLI.

>[!NOTE]
>Because other settings may be impacted by the runtime version, you should change the version in the portal. The portal automatically makes the other needed updates, such as Node.js version and runtime stack, when you change runtime versions.  

Using the Azure CLI, view the current runtime version with the [az functionapp config appsettings set](/cli/azure/functionapp/config/appsettings) command.

```azurecli-interactive
az functionapp config appsettings list --name <function_app> \
--resource-group <my_resource_group>
```

In this code, replace `<function_app>` with the name of your function app. Also replace `<my_resource_group>` with the name of the resource group for your function app. 

You see the `FUNCTIONS_EXTENSION_VERSION` in the following output, which has been truncated for clarity:

```output
[
  {
    "name": "FUNCTIONS_EXTENSION_VERSION",
    "slotSetting": false,
    "value": "~2"
  },
  {
    "name": "FUNCTIONS_WORKER_RUNTIME",
    "slotSetting": false,
    "value": "dotnet"
  },
  
  ...
  
  {
    "name": "WEBSITE_NODE_DEFAULT_VERSION",
    "slotSetting": false,
    "value": "8.11.1"
  }
]
```

You can update the `FUNCTIONS_EXTENSION_VERSION` setting in the function app with the [az functionapp config appsettings set](/cli/azure/functionapp/config/appsettings) command.

```azurecli-interactive
az functionapp config appsettings set --name <function_app> \
--resource-group <my_resource_group> \
--settings FUNCTIONS_EXTENSION_VERSION=<version>
```

Replace `<function_app>` with the name of your function app. Also replace `<my_resource_group>` with the name of the resource group for your function app. Also, replace `<version>` with a valid version of the 1.x runtime or `~2` for version 2.x.

You can run this command from the [Azure Cloud Shell](../cloud-shell/overview.md) by choosing **Try it** in the preceding code sample. You can also use the [Azure CLI locally](/cli/azure/install-azure-cli) to execute this command after executing [az login](/cli/azure/reference-index#az-login) to sign in.



## Next steps

> [!div class="nextstepaction"]
> [Target the 2.0 runtime in your local development environment](functions-run-local.md)

> [!div class="nextstepaction"]
> [See Release notes for runtime versions](https://github.com/Azure/azure-webjobs-sdk-script/releases)
