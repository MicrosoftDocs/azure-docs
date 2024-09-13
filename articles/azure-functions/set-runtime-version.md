---
title: How to target Azure Functions runtime versions
description: Learn how to specify the runtime version of a function app hosted in Azure.
ms.service: azure-functions
ms.topic: how-to
ms.date: 07/03/2024
ms.custom: ignite-2023, linux-related-content
zone_pivot_groups: app-service-platform-windows-linux

#Customer intent: As a function developer, I want to learn how to view and edit the runtime version of my function app so that I can pin it to a specific minor version, if necessary.
---

# How to target Azure Functions runtime versions

A function app runs on a specific version of the Azure Functions runtime. By default, function apps are created in the latest 4.x version of the Functions runtime. Your function apps are supported only when they run on a [supported major version](functions-versions.md). This article explains how to configure a function app in Azure to target, or _pin_ to, a specific version when required.

::: zone pivot="platform-windows"
The way that you target a specific version depends on whether you're running Windows or Linux. This version of the article supports Windows. Choose your operating system at the top of the article.
::: zone-end
::: zone pivot="platform-linux"
The way that you target a specific version depends on whether you're running Windows or Linux. This version of the article supports Linux. Choose your operating system at the top of the article.
::: zone-end  
>[!IMPORTANT]
>When possible, always run your functions on the latest supported version of the Azure Functions runtime. You should only pin your app to a specific version if you're instructed to do so due to an issue with the latest version. Always move up to the latest runtime version as soon as your functions can run correctly.

During local development, your installed version of Azure Functions Core Tools must match the major runtime version used by the function app in Azure. For more information, see [Core Tools versions](functions-run-local.md#v2).

## Update your runtime version

When possible, you should always run your function apps on the latest supported version of the Azure Functions runtime. If your function app is currently running on an older version of the runtime, you should migrate your app to version 4.x

[!INCLUDE [functions-migrate-apps](../../includes/functions-migrate-apps.md)]

To determine your current runtime version, see [View the current runtime version](#view-the-current-runtime-version).

## View the current runtime version

You can view the current runtime version of your function app in one of these ways:

### [Azure portal](#tab/azure-portal)

[!INCLUDE [Set the runtime version in the portal](../../includes/functions-view-update-version-portal.md)]

### [Azure CLI](#tab/azure-cli)

You can view the `FUNCTIONS_EXTENSION_VERSION` app setting from the Azure CLI.  

Using the Azure CLI, view the current runtime version with the [`az functionapp config appsettings list`](/cli/azure/functionapp/config/appsettings) command:

```azurecli-interactive
az functionapp config appsettings list --name <function_app> \
--resource-group <my_resource_group>
```

In this code, replace `<function_app>` with the name of your function app. Also replace `<my_resource_group>` with the name of the resource group for your function app.

You see the `FUNCTIONS_EXTENSION_VERSION` in the following partial output:

```output
[
  {
    "name": "FUNCTIONS_EXTENSION_VERSION",
    "slotSetting": false,
    "value": "~4"
  },
  {
    "name": "FUNCTIONS_WORKER_RUNTIME",
    "slotSetting": false,
    "value": "dotnet"
  },
  
  ...
]
```

Choose **Open Cloud Shell** in the previous code example to run the command in [Azure Cloud Shell](../cloud-shell/overview.md). You can also run the [Azure CLI locally](/cli/azure/install-azure-cli) to execute this command. When running locally, you must first run [`az login`](/cli/azure/reference-index#az-login) to sign in.

### [Azure PowerShell](#tab/azure-powershell)

To check the Azure Functions runtime, use the following cmdlet:

```azurepowershell-interactive
Get-AzFunctionAppSetting -Name "<FUNCTION_APP>" -ResourceGroupName "<RESOURCE_GROUP>"
```

Replace `<FUNCTION_APP>` with the name of your function app and `<RESOURCE_GROUP>`. The current value of the `FUNCTIONS_EXTENSION_VERSION` setting is returned in the hash table.

---

## <a name="manual-version-updates-on-linux"></a>Pin to a specific version

Azure Functions lets you use the `FUNCTIONS_EXTENSION_VERSION` app setting to target the runtime version used by a given function app. If you specify only the major version (`~4`), the function app is automatically updated to new minor versions of the runtime as they become available. Minor version updates are done automatically because new minor versions aren't likely to introduce changes that would break your functions.
::: zone pivot="platform-linux"
Linux apps use the [`linuxFxVersion` site setting](./functions-app-settings.md#linuxfxversion) along with `FUNCTIONS_EXTENSION_VERSION` to determine the correct Linux base image in which to run your functions. When you create a new function app on Linux, the runtime automatically chooses the correct base image for you based on the runtime version of your language stack.
::: zone-end
Pinning to a specific runtime version causes your function app to restart.
::: zone pivot="platform-windows"
When you specify a specific minor version (such as `4.0.12345`) in `FUNCTIONS_EXTENSION_VERSION`, the function app is pinned to that specific version of the runtime until you explicitly choose to move back to automatic version updates. You should only pin to a specific minor version long enough to resolve any issues with your function app that prevent you from targeting the major version. Older minor versions are regularly removed from the production environment. When your function app is pinned to a minor version that is later removed, your function app is instead run on the closest existing version instead of the version set in `FUNCTIONS_EXTENSION_VERSION`. Minor version removals are announced in [App Service announcements](https://github.com/Azure/app-service-announcements/issues).

> [!NOTE]
> When you try to publish from Visual Studio to an app that is pinned to a specific minor version of the runtime, a dialog prompts you to update to the latest version or cancel the publish. To avoid this check when you must use a specific minor version, add the `<DisableFunctionExtensionVersionUpdate>true</DisableFunctionExtensionVersionUpdate>` property in your `.csproj` file.

Use one of these methods to temporarily pin your app to a specific version of the runtime:

### [Azure portal](#tab/azure-portal)

[!INCLUDE [Set the runtime version in the portal](../../includes/functions-view-update-version-portal.md)]

3. To pin your app to a specific minor version, in the left pane, expand **Settings**, and then select **Environment variables**.

4. From the **App settings** tab, select **FUNCTIONS_EXTENSION_VERSION**, change **Value** to your required minor version, and then select **Apply**.

5. Select **Apply**, and then select **Confirm** to apply the changes and restart the app.

### [Azure CLI](#tab/azure-cli)

You can update the `FUNCTIONS_EXTENSION_VERSION` app setting in the function app with the [az functionapp config appsettings set](/cli/azure/functionapp/config/appsettings) command.

```azurecli-interactive
az functionapp config appsettings set --name <FUNCTION_APP> \
--resource-group <RESOURCE_GROUP> \
--settings FUNCTIONS_EXTENSION_VERSION=<VERSION>
```

Replace `<FUNCTION_APP>` with the name of your function app and `<RESOURCE_GROUP>` with the name of the resource group for your function app. Also, replace `<VERSION>` with the specific minor version you temporarily need to target.

Choose **Open Cloud Shell** in the previous code example to run the command in [Azure Cloud Shell](../cloud-shell/overview.md). You can also run the [Azure CLI locally](/cli/azure/install-azure-cli) to execute this command. When running locally, you must first run [`az login`](/cli/azure/reference-index#az-login) to sign in.

### [Azure PowerShell](#tab/azure-powershell)

Use this script to pin the Functions runtime:

```azurepowershell-interactive
Update-AzFunctionAppSetting -Name "<FUNCTION_APP>" -ResourceGroupName "<RESOURCE_GROUP>" -AppSetting @{"FUNCTIONS_EXTENSION_VERSION" = "<VERSION>"} -Force
```

Replace `<FUNCTION_APP>` with the name of your function app and `<RESOURCE_GROUP>` with the name of the resource group for your function app. Also, replace `<VERSION>` with the specific minor version you temporarily need to target. You can verify the updated value of the `FUNCTIONS_EXTENSION_VERSION` setting in the returned hash table.

---

The function app restarts after the change is made to the application setting.
::: zone-end
::: zone pivot="platform-linux"
To pin your function app to a specific runtime version on Linux, you set a version-specific base image URL in the [`linuxFxVersion` site setting][`linuxFxVersion`] in the format `DOCKER|<PINNED_VERSION_IMAGE_URI>`.

> [!IMPORTANT]
> Pinned function apps on Linux don't receive regular security and host functionality updates. Unless recommended by a support professional, use the [`FUNCTIONS_EXTENSION_VERSION`](functions-app-settings.md#functions_extension_version) setting and a standard [`linuxFxVersion`] value for your language and version, such as `Python|3.9`. For valid values, see the [`linuxFxVersion` reference article][`linuxFxVersion`].
>
> Pinning to a specific runtime isn't currently supported for Linux function apps running in a Consumption plan.

The following example shows the [`linuxFxVersion`] value required to pin a Node.js 16 function app to a specific runtime version of 4.14.0.3:

`DOCKER|mcr.microsoft.com/azure-functions/node:4.14.0.3-node16`

When needed, a support professional can provide you with a valid base image URI for your application.

Use the following Azure CLI commands to view and set the [`linuxFxVersion`]. You can't currently set [`linuxFxVersion`] in the portal or by using Azure PowerShell:

+ To view the current runtime version, use the [az functionapp config show](/cli/azure/functionapp/config) command:

    ```azurecli-interactive
    az functionapp config show --name <function_app> \
    --resource-group <my_resource_group> --query 'linuxFxVersion' -o tsv
    ```

    In this code, replace `<function_app>` with the name of your function app. Also, replace `<my_resource_group>` with the name of the resource group for your function app. The current value of [`linuxFxVersion`] is returned.

+ To update the [`linuxFxVersion`] setting in the function app, use the [az functionapp config set](/cli/azure/functionapp/config) command:

    ```azurecli-interactive
    az functionapp config set --name <FUNCTION_APP> \
    --resource-group <RESOURCE_GROUP> \
    --linux-fx-version <LINUX_FX_VERSION>
    ```

    Replace `<FUNCTION_APP>` with the name of your function app. Also, replace `<RESOURCE_GROUP>` with the name of the resource group for your function app. Finally, replace `<LINUX_FX_VERSION>` with the value of a specific image provided to you by a support professional.

You can run these commands from the [Azure Cloud Shell](../cloud-shell/overview.md) by choosing **Open Cloud Shell** in the preceding code examples. You can also use the [Azure CLI locally](/cli/azure/install-azure-cli) to execute this command after executing [`az login`](/cli/azure/reference-index#az-login) to sign in.

The function app restarts after the change is made to the site config.
::: zone-end  

## Next steps

> [!div class="nextstepaction"]
> [Release notes for runtime versions](https://github.com/Azure/azure-webjobs-sdk-script/releases)

[`linuxFxVersion`]: functions-app-settings.md#linuxfxversion
