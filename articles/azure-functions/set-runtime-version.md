---
title: How to target Azure Functions runtime versions
description: Azure Functions supports multiple versions of the runtime. Learn how to specify the runtime version of a function app hosted in Azure.
ms.topic: conceptual
ms.date: 05/17/2023
---

# How to target Azure Functions runtime versions

A function app runs on a specific version of the Azure Functions runtime. There have been four major versions: [4.x, 3.x, 2.x, and 1.x](functions-versions.md). By default, function apps are created in version 4.x of the runtime. This article explains how to configure a function app in Azure to run on the version you choose. For information about how to configure a local development environment for a specific version, see [Code and test Azure Functions locally](functions-run-local.md).

The way that you manually target a specific version depends on whether you're running Windows or Linux.

## Automatic and manual version updates

_This section doesn't apply when running your function app [on Linux](#manual-version-updates-on-linux)._

Azure Functions lets you target a specific version of the runtime on Windows by using the `FUNCTIONS_EXTENSION_VERSION` application setting in a function app. The function app is kept on the specified major version until you explicitly choose to move to a new version. If you specify only the major version, the function app is automatically updated to new minor versions of the runtime when they become available. New minor versions shouldn't introduce breaking changes. 

If you specify a minor version (for example, "2.0.12345"), the function app is pinned to that specific version until you explicitly change it. Older minor versions are regularly removed from the production environment. If your minor version gets removed, your function app goes back to running on the latest version instead of the version set in `FUNCTIONS_EXTENSION_VERSION`. As such, you should quickly resolve any issues with your function app that require a specific minor version. Then, you can return to targeting the major version. Minor version removals are announced in [App Service announcements](https://github.com/Azure/app-service-announcements/issues).

> [!NOTE]
> If you pin to a specific major version of Azure Functions, and then try to publish to Azure using Visual Studio, a dialog window will pop up prompting you to update to the latest version or cancel the publish. To avoid this, add the `<DisableFunctionExtensionVersionUpdate>true</DisableFunctionExtensionVersionUpdate>` property in your `.csproj` file.

When a new version is publicly available, a prompt in the portal gives you the chance to move up to that version. After moving to a new version, you can always use the `FUNCTIONS_EXTENSION_VERSION` application setting to move back to a previous version.

The following table shows the `FUNCTIONS_EXTENSION_VERSION` values for each major version to enable automatic updates:

| Major version  | `FUNCTIONS_EXTENSION_VERSION` value | Additional configuration  |
| -------------  | ----------------------------------- | ------------------------- |
| 4.x            | `~4`                                | [On Windows, enable .NET 6](./migrate-version-3-version-4.md#upgrade-your-function-app-in-azure) |
| 3.x<sup>*</sup>| `~3`                                |                           |
| 2.x<sup>*</sup>| `~2`                                |                           |
| 1.x            | `~1`                                |                           |

<sup>*</sup>Reached the end of life (EOL) for extended support on December 13, 2022. For a detailed support statement about end-of-life versions, see [this migration article](migrate-version-3-version-4.md).

A change to the runtime version causes a function app to restart. 

## View and update the current runtime version

_This section doesn't apply when running your function app [on Linux](#manual-version-updates-on-linux)._

You can change the runtime version used by your function app. Because of the potential of breaking changes, you can only change the runtime version before you've created any functions in your function app. 

> [!IMPORTANT]
> Although the runtime version is determined by the `FUNCTIONS_EXTENSION_VERSION` setting, you should only make this change in the Azure portal and not by changing the setting directly. This is because the portal validates your changes and makes other related changes as needed.

# [Portal](#tab/portal)

[!INCLUDE [Set the runtime version in the portal](../../includes/functions-view-update-version-portal.md)]


# [Azure CLI](#tab/azurecli)

You can also view and set the `FUNCTIONS_EXTENSION_VERSION` from the Azure CLI.  

Using the Azure CLI, view the current runtime version with the [`az functionapp config appsettings list`](/cli/azure/functionapp/config/appsettings) command.

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
az functionapp config appsettings set --name <FUNCTION_APP> \
--resource-group <RESOURCE_GROUP> \
--settings FUNCTIONS_EXTENSION_VERSION=<VERSION>
```

Replace `<FUNCTION_APP>` with the name of your function app. Also replace `<RESOURCE_GROUP>` with the name of the resource group for your function app. Also, replace `<VERSION>` with either a specific version, or `~4`, `~3`, `~2`, or `~1`.

Choose **Try it** in the previous code example to run the command in [Azure Cloud Shell](../cloud-shell/overview.md). You can also run the [Azure CLI locally](/cli/azure/install-azure-cli) to execute this command. When running locally, you must first run [`az login`](/cli/azure/reference-index#az-login) to sign in.

# [PowerShell](#tab/powershell)

To check the Azure Functions runtime, use the following cmdlet: 

```powershell
Get-AzFunctionAppSetting -Name "<FUNCTION_APP>" -ResourceGroupName "<RESOURCE_GROUP>"
```

Replace `<FUNCTION_APP>` with the name of your function app and `<RESOURCE_GROUP>`. The current value of the `FUNCTIONS_EXTENSION_VERSION` setting is returned in the hash table.

Use the following script to change the Functions runtime:

```powershell
Update-AzFunctionAppSetting -Name "<FUNCTION_APP>" -ResourceGroupName "<RESOURCE_GROUP>" -AppSetting @{"FUNCTIONS_EXTENSION_VERSION" = "<VERSION>"} -Force
```

As before, replace `<FUNCTION_APP>` with the name of your function app and `<RESOURCE_GROUP>` with the name of the resource group. Also, replace `<VERSION>` with the specific version or major version, such as `~2` or `~3`. You can verify the updated value of the `FUNCTIONS_EXTENSION_VERSION` setting in the returned hash table. 

---

The function app restarts after the change is made to the application setting.

## <a name="manual-version-updates-on-linux"></a>Pin to a specific version on Linux

To pin a Linux function app to a specific host version, you set a version-specific base image URL in the [`linuxFxVersion` site setting][`linuxFxVersion`] in the format `DOCKER|<PINNED_VERSION_IMAGE_URI>`. 

> [!IMPORTANT]
> Pinned function apps on Linux don't receive regular security and host functionality updates. Unless recommended by a support professional, use the [`FUNCTIONS_EXTENSION_VERSION`](functions-app-settings.md#functions_extension_version) setting and a standard [`linuxFxVersion`] value for your language and version, such as `Python|3.9`. For valid values, see the [`linuxFxVersion` reference article][`linuxFxVersion`].   
>
> Pinning to a specific runtime isn't currently supported for Linux function apps running in a Consumption plan. 

The following is an example of the [`linuxFxVersion`] value required to pin a Node.js 18 function app to a specific runtime version of 4.11.2:

`DOCKER|mcr.microsoft.com/azure-functions/node:4.11.2-node18-appservice` 

When needed, a support professional can provide you with a valid base image URI for your application. 

Use the following Azure CLI commands to view and set the [`linuxFxVersion`]. You can't currently set [`linuxFxVersion`] in the portal or by using Azure PowerShell. 

To view the current runtime version, use with the [az functionapp config show](/cli/azure/functionapp/config) command.

```azurecli-interactive
az functionapp config show --name <function_app> \
--resource-group <my_resource_group> --query 'linuxFxVersion' -o tsv
```

In this code, replace `<function_app>` with the name of your function app. Also replace `<my_resource_group>` with the name of the resource group for your function app. The current value of [`linuxFxVersion`] is returned.

To update the [`linuxFxVersion`] setting in the function app, use the [az functionapp config set](/cli/azure/functionapp/config) command.

```azurecli-interactive
az functionapp config set --name <FUNCTION_APP> \
--resource-group <RESOURCE_GROUP> \
--linux-fx-version <LINUX_FX_VERSION>
```

Replace `<FUNCTION_APP>` with the name of your function app. Also replace `<RESOURCE_GROUP>` with the name of the resource group for your function app. Finally, replace `<LINUX_FX_VERSION>` with the value of a specific image provided to you by a support professional.

You can run this command from the [Azure Cloud Shell](../cloud-shell/overview.md) by choosing **Try it** in the preceding code sample. You can also use the [Azure CLI locally](/cli/azure/install-azure-cli) to execute this command after executing [`az login`](/cli/azure/reference-index#az-login) to sign in.

The function app restarts after the change is made to the site config.

## Next steps

> [!div class="nextstepaction"]
> [See Release notes for runtime versions](https://github.com/Azure/azure-webjobs-sdk-script/releases)

[`linuxFxVersion`]: functions-app-settings.md#linuxfxversion
