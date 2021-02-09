---
title: How to target Azure Functions language versions
description: Azure Functions supports multiple versions of programing languages. Learn how to specify the languages runtime of a function app hosted in Azure.

ms.topic: conceptual
ms.date: 02/9/2021
---

# How to target Azure Functions language versions

__INTRO_TODO__

## View and update the current runtime version

_This section doesn't apply when running your function app [on Linux](#manual-version-updates-on-linux)._

You can change the runtime version used by your function app. Because of the potential of breaking changes, you can only change the runtime version before you have created any functions in your function app. 

> [!IMPORTANT]
> Although the runtime version is determined by the `FUNCTIONS_EXTENSION_VERSION` setting, you should make this change in the Azure portal and not by changing the setting directly. This is because the portal validates your changes and makes other related changes as needed.

# [Portal](#tab/portal)

[!INCLUDE [Set the runtime version in the portal](../../includes/functions-view-update-language-version-portal.md)]

> [!NOTE]
> Using the Azure portal, you can't change the runtime version for a function app that already contains functions.

# [Azure CLI](#tab/azurecli)

__TODO__

# [PowerShell](#tab/powershell)
__TODO__


## Updating language version on Linux

To set a Linux function app to a specific language version, you specify the language as well as the version of the language in 'LinuxFxVersion' field in site config. For example: if we want to pin a node 10 function app with latest runtime version

Set `LinuxFxVersion` to `node|10`.

To see the full list of supported languages in Linux functions apps, please refer to this [article](./supported-languages.md)

> [!NOTE]
To learn about setting a Linux function app to a specific language version __and__ runtime version (for example, node 10 with host runtime version of 2), please visit this [article](./set-runtime-version.md#manual-version-updates-on-linux) 

# [Azure CLI](#tab/azurecli-linux)

You can view and set the `LinuxFxVersion` from the Azure CLI.  

Using the Azure CLI, view the current runtime version with the [az functionapp config show](/cli/azure/functionapp/config) command.

```azurecli-interactive
az functionapp config show --name <function_app> \
--resource-group <my_resource_group>
```

In this code, replace `<function_app>` with the name of your function app. Also replace `<my_resource_group>` with the name of the resource group for your function app. 

You see the `linuxFxVersion` in the following output, which has been truncated for clarity:

```output
{
  ...

  "kind": null,
  "limits": null,
  "linuxFxVersion": <LINUX_FX_VERSION>,
  "loadBalancing": "LeastRequests",
  "localMySqlEnabled": false,
  "location": "West US",
  "logsDirectorySizeLimit": 35,
   ...
}
```

You can update the `linuxFxVersion` setting in the function app with the [az functionapp config set](/cli/azure/functionapp/config) command.

```azurecli-interactive
az functionapp config set --name <FUNCTION_APP> \
--resource-group <RESOURCE_GROUP> \
--linux-fx-version <LINUX_FX_VERSION>
```

Replace `<FUNCTION_APP>` with the name of your function app. Also replace `<RESOURCE_GROUP>` with the name of the resource group for your function app. Also, replace `<LINUX_FX_VERSION>` with the values explained above.

You can run this command from the [Azure Cloud Shell](../cloud-shell/overview.md) by choosing **Try it** in the preceding code sample. You can also use the [Azure CLI locally](/cli/azure/install-azure-cli) to execute this command after executing [az login](/cli/azure/reference-index#az-login) to sign in.


Similarly, the function app restarts after the change is made to the site config.

> [!NOTE]
> Note that setting `LinuxFxVersion` to image url directly for consumption apps will opt them out of placeholders and other cold start optimizations.

---

## Next steps

> [!div class="nextstepaction"]
> [Target the 2.0 runtime in your local development environment](functions-run-local.md)

> [!div class="nextstepaction"]
> [See Release notes for runtime versions](https://github.com/Azure/azure-webjobs-sdk-script/releases)
