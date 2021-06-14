---
title: How to target Azure Functions language versions
description: Azure Functions supports multiple versions of programing languages. Learn how to specify the languages runtime of a function app hosted in Azure.

ms.topic: conceptual
ms.date: 06/14/2021
zone_pivot_groups: "programming-languages-set-functions-lang-workers"
---

# How to target Azure Functions language versions

A function app runs on a specific version of language runtime. By default, function apps are created in the latest programming language's major version that is supported. This article explains how to configure a function app in Azure to run on the version you choose. 

---

::: zone pivot="programming-language-javascript,programming-language-powershell, programming-language-java"

## Update functions app language version on Windows

_This section doesn't apply when running your function app [on Linux](#Update-functions-app-language-version-on-Linux)._

You can change the runtime version used by your function app. Because of the potential of breaking changes, you can only change the runtime version before you have created any functions in your function app. 


[!INCLUDE [Set the language runtime version in the portal](../../includes/functions-view-update-language-version-portal.md)]
::: zone-end

::: zone pivot="programming-language-csharp"
## Update functions app language version on Windows

For .NET, the language version is defined by the runtime version of your function apps. To learn, refer to the article on how to [set runtime version](./set-language-version). To learn on the .NET major versions that are supported, refer to [supported-languages article](./supported-languages)

::: zone-end



::: zone pivot="programming-language-python, programming-language-javascript,programming-language-powershell, programming-language-java,programming-language-csharp"
## Update functions app language version on Linux

To set a Linux function app to a specific language version, you specify the language as well as the version of the language in 'LinuxFxVersion' field in site config. For example: if we want to pin a node 10 function app with latest runtime version

Set `LinuxFxVersion` to `node|10`.

To see the full list of supported languages in Linux functions apps, please refer to this [article](./supported-languages.md)

> [!NOTE]
>To learn about setting a Linux function app to a specific language version __and__ runtime version (for example, node 10 with host runtime version of 2), please visit this [article](./set-runtime-version.md#manual-version-updates-on-linux) 
>


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
---
::: zone-end

## Next steps
> [!div class="nextstepaction"]
> [See Supported Languages in Azure Functions](./supported-languages.md)
