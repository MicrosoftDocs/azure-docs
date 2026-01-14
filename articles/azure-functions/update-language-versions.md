---
title: Update Language Versions in Azure Functions
description: Find out how to update the version of the native language used by a function app in Azure Functions, including configurations with multiple slots.
ms.topic: how-to
ms.custom: devx-track-extended-java, devx-track-azurecli, devx-track-js, devx-track-python, devx-track-ts
ms.date: 08/21/2025
zone_pivot_groups: programming-languages-set-functions
#customer intent: As a developer who supports function apps in Azure Functions, I want to update the language stack of my function apps so that I can take advantage of new language features.
---

# Update language stack versions in Azure Functions 

In Azure Functions, support for a language stack is limited to [specific versions](functions-versions.md#languages). As new versions become available, you might want to update your function apps to take advantage of new features. Support in Functions can also end for older versions and is typically aligned to community end-of-support timelines. For more information, see the [language runtime support policy](./language-support-policy.md). For supported versions of various languages, see [Languages by runtime version](supported-languages.md#languages-by-runtime-version).

To help ensure your function apps continue to receive support, follow the instructions in this article to update them to the latest available versions. The way that you update your function app depends on several factors:

- The language you use to develop your function apps. Make sure to select your programming language at the top of this article. 
- The operating system on which your function app runs in Azure: Windows or Linux. 
- The [hosting plan](./functions-scale.md).

::: zone pivot="programming-language-csharp"   

> [!NOTE]
> This article shows you how to update the .NET version of a function app that uses the [isolated worker model](dotnet-isolated-process-guide.md). If your function app runs on an older version of .NET and uses the [in-process model](functions-dotnet-class-library.md), consider the following options:
>
> - [Update to target .NET 8](./functions-dotnet-class-library.md#updating-to-target-net-8).
> - [Migrate from the in-process model to the isolated worker model](migrate-dotnet-to-isolated-model.md).

::: zone-end  

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A function app that's hosted in one of the following Functions plans:
  - Premium
  - Dedicated
  - Consumption

## Prepare your function app

Before you update the stack configuration for your function app in Azure, complete the tasks in the following sections.

### Verify your function app locally

Test and verify your function app code locally on the new target version.

::: zone pivot="programming-language-csharp"
Use these steps to update the project on your local computer:

1. Ensure that the [target version of the .NET SDK is installed](https://dotnet.microsoft.com/download/dotnet).

   If you're targeting a preview version, see [Functions guidance for preview .NET versions](./dotnet-isolated-process-guide.md#preview-net-versions) to ensure that the version is supported. Using .NET previews might require more steps.

1. Update your references to the latest versions of [Microsoft.Azure.Functions.Worker](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker/) and [Microsoft.Azure.Functions.Worker.Sdk](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk/).

1. Update your project's target framework to the new version. For C# projects, you must update the `<TargetFramework>` element in the *.csproj* file. For more information about your version, see [Target frameworks](/dotnet/standard/frameworks).

   Changing your project's target framework might also require changes to parts of your toolchain, outside project code. For example, in Visual Studio Code, you might need to update the `azureFunctions.deploySubpath` extension setting in your user settings or your project's *.vscode/settings.json* file. Check for any dependencies on the framework version that exist outside your project code, as part of build steps or a continuous integration and continuous delivery (CI/CD) pipeline.

1. Make any updates to your project code that the new .NET version requires. Check the version's release notes for specific information. You can also use the [.NET Upgrade Assistant](/dotnet/core/porting/upgrade-assistant-overview) to help update your code in response to changes across major versions.

After you make those changes, rebuild your project and test it to confirm your function app runs as expected.

::: zone-end  

### Move to the latest Functions runtime

Make sure that your function app runs on the latest version of the Functions runtime (version 4.x). You can determine the runtime version either in the Azure portal or by using the Azure CLI.

### [Azure portal](#tab/azure-portal)

Use these steps to determine your Functions runtime version:

1. In the [Azure portal](https://portal.azure.com), locate and select your function app. On the side menu, select **Settings** > **Configuration**.

1. Go to the **Function runtime settings** tab and check the **Runtime version** value. Your function app should run on version 4.x of the Functions runtime (`~4`).

### [Azure CLI](#tab/azure-cli)

Use the [az functionapp config appsettings list](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-list) command to check your runtime version: 

```azurecli
az functionapp config appsettings list --name "<FUNCTION_APP_NAME>" --resource-group "<RESOURCE_GROUP_NAME>"  
```

The `FUNCTIONS_EXTENSION_VERSION` setting sets the runtime version. A value of `~4` means that your function app is already running on the latest minor version of the latest major version (4.x). 

---

If you need to update your function app to version 4.x, see [Migrate apps from Azure Functions version 1.x to version 4.x](./migrate-version-1-version-4.md) or [Migrate apps from Azure Functions version 3.x to version 4.x](./migrate-version-3-version-4.md). Follow the instructions in those articles rather than just changing the `FUNCTIONS_EXTENSION_VERSION` setting.

### Publish function app updates

If you updated your function app to run correctly on the new version, publish the function app updates before you update the stack configuration for your function app. 

> [!TIP]  
> To streamline the update process, minimize downtime for your function apps, and provide a potential version for rollback, you should publish your updated function app to a staging slot. For more information, see [Azure Functions deployment slots](functions-deployment-slots.md#add-a-slot). 

When you publish your updated function app to a staging slot, make sure to follow the slot-specific update instructions in the rest of this article. You later swap the updated staging slot into production.

## Update the stack configuration

The way that you update the stack configuration depends on whether your function app runs on Windows or on Linux in Azure.

When you use a [staging slot](functions-deployment-slots.md), make sure to target your updates to the correct slot.

### [Windows](#tab/windows/azure-portal)

[!INCLUDE [functions-update-language-version-portal](../../includes/functions-update-language-version-portal.md)]

::: zone pivot="programming-language-python" 
Python apps aren't supported on Windows. Go to the **Linux** tab instead.
::: zone-end

### [Linux](#tab/linux/azure-portal)

> [!NOTE]  
> If you have a function app on Linux that's hosted in a [Flex Consumption](./flex-consumption-plan.md), [Premium](./functions-premium-plan.md) or a [Dedicated (App Service)](./dedicated-plan.md) plan, you can use the Azure portal to update your function app. But if you have a function app on Linux that's hosted in a [Consumption plan](./consumption-plan.md), use the [Azure CLI](update-language-versions.md?tabs=azure-cli#update-the-stack-configuration). 
>
> The ability to run your apps on Linux in a Consumption plan is planned for retirement. For more information, see [Azure Functions Consumption plan hosting](consumption-plan.md).
 
[!INCLUDE [functions-update-language-version-portal](../../includes/functions-update-language-version-portal.md)]

::: zone pivot="programming-language-python" 
1. In the [Azure portal](https://portal.azure.com), locate and select your function app. On the side menu, select **Settings** > **Configuration**. If you have a staging slot, select the specific slot.

1. On the **General settings** tab, update **Python Version** to the desired version.

   > [!NOTE]   
   > You can't change the Python version when your function app runs in a Consumption plan.  

1. Select **Save**. When you're notified about a restart, select **Continue**. 
::: zone-end 

### [Windows](#tab/windows/azure-cli)

::: zone pivot="programming-language-python"  

Python function apps aren't supported on Windows. Go to the **Linux** tab instead.

::: zone-end  

::: zone pivot="programming-language-java,programming-language-powershell"

Run the [az functionapp list-runtimes](/cli/azure/functionapp#az-functionapp-list-runtimes) command to view the supported version values for your language. Then, run the [az functionapp config set](/cli/azure/functionapp/config#az-functionapp-config-set) command to update the language version of your function app:

::: zone-end

::: zone pivot="programming-language-csharp" 

Run the [az functionapp list-runtimes](/cli/azure/functionapp#az-functionapp-list-runtimes) command to view the supported version values for .NET on the isolated worker model:

::: zone-end

::: zone pivot="programming-language-java"

```azurecli
az functionapp list-runtimes --os "windows" --query "[?runtime == 'java'].{Version:version}" --output table

az functionapp config set --java-version "<VERSION>" --name "<FUNCTION_APP_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --slot "staging"  
```

::: zone-end

::: zone pivot="programming-language-csharp"

```azurecli
az functionapp list-runtimes --os "windows" --query "[?runtime == 'dotnet-isolated'].{Version:version}" --output table
```

Run the [az functionapp config set](/cli/azure/functionapp/config#az-functionapp-config-set) command to update the .NET version of your function app:

```azurecli
az functionapp config set --net-framework-version "v<VERSION>.0" --name "<FUNCTION_APP_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --slot "staging"  
```

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript" 

Use the [az functionapp list-runtimes](/cli/azure/functionapp#az-functionapp-list-runtimes) command to view the supported version values for your language stack (Node.js). Then, run the [az functionapp config set](/cli/azure/functionapp/config#az-functionapp-config-set) command to update the Node.js version of your function app:

```azurecli
az functionapp list-runtimes --os "windows" --query "[?runtime == 'node'].{Version:version}" --output table

az functionapp config appsettings set --name "<FUNCTION_APP_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --settings "WEBSITE_NODE_DEFAULT_VERSION=~<VERSION>" --slot "staging"  
```

::: zone-end

::: zone pivot="programming-language-powershell"

```azurecli
az functionapp list-runtimes --os "windows" --query "[?runtime == 'powershell'].{Version:version}" --output table

az functionapp config set --powershell-version "<VERSION>" --name "<FUNCTION_APP_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --slot "staging"  
```

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-powershell"

In the preceding command, replace `<FUNCTION_APP_NAME>` and `<RESOURCE_GROUP_NAME>` with the name of your function app and resource group, respectively. Also replace `<VERSION>` with the supported language version to which you're updating. If you aren't using a staging slot, remove the `--slot` parameter.

::: zone-end   
### [Linux](#tab/linux/azure-cli)
::: zone pivot="programming-language-python"

> [!NOTE]   
> You can't change the Python version when your function app runs in a Consumption plan. 

::: zone-end

::: zone pivot="programming-language-java,programming-language-python,programming-language-powershell"

Run the [az functionapp list-runtimes](/cli/azure/functionapp#az-functionapp-list-runtimes) command to view the supported [linuxFxVersion](functions-app-settings.md#linuxfxversion) site setting for your language version:

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript"

Run the [az functionapp list-runtimes](/cli/azure/functionapp#az-functionapp-list-runtimes) command to view the supported [linuxFxVersion](functions-app-settings.md#linuxfxversion) site setting for your language stack version:

::: zone-end

::: zone pivot="programming-language-java"

```azurecli
az functionapp list-runtimes --os linux --query "[?runtime == 'java'].{Version:version, linuxFxVersion:linux_fx_version}" --output table
```

::: zone-end

::: zone pivot="programming-language-csharp"  

```azurecli
az functionapp list-runtimes --os linux --query "[?runtime == 'dotnet-isolated'].{Version:version, linuxFxVersion:linux_fx_version}" --output table
```

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

```azurecli
az functionapp list-runtimes --os linux --query "[?runtime == 'node'].{Version:version, linuxFxVersion:linux_fx_version}" --output table
```

::: zone-end

::: zone pivot="programming-language-python"

```azurecli
az functionapp list-runtimes --os linux --query "[?runtime == 'python'].{Version:version, linuxFxVersion:linux_fx_version}" --output table
```

::: zone-end

::: zone pivot="programming-language-powershell"

```azurecli
az functionapp list-runtimes --os linux --query "[?runtime == 'powershell'].{Version:version, linuxFxVersion:linux_fx_version}" --output table
```

::: zone-end

::: zone pivot="programming-language-java,programming-language-python,programming-language-powershell"

Run the [az functionapp config set](/cli/azure/functionapp/config#az-functionapp-config-set) command to update the site setting for the new language version of your function app: 

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript"

Run the [az functionapp config set](/cli/azure/functionapp/config#az-functionapp-config-set) command to update the site setting for the new stack version of your function app:

::: zone-end

```azurecli
az functionapp config set --linux-fx-version "<LANGUAGE|VERSION>" --name "<FUNCTION_APP_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --slot "staging"  
```

In the preceding command, replace `<FUNCTION_APP_NAME>` and `<RESOURCE_GROUP_NAME>` with the name of your function app and resource group, respectively. Also replace `<LANGUAGE|VERSION>` with the `linuxFxVersion` value for your update. If you aren't using a staging slot, remove the `--slot` parameter.

---

Your function app restarts after you update the version.

## Swap slots

If you're using a staging slot to deploy your code project and update your settings, swap the staging slot into production. For more information, see [Swap slots](functions-deployment-slots.md#swap-slots). 

## Related content

::: zone pivot="programming-language-java"

> [!div class="nextstepaction"]
> [Java developer guide](./functions-reference-java.md)

::: zone-end

::: zone pivot="programming-language-csharp"

> [!div class="nextstepaction"]
> [C# isolated worker process guide](./dotnet-isolated-process-guide.md)

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

> [!div class="nextstepaction"]
> [Node.js developer guide](./functions-reference-node.md)

::: zone-end

::: zone pivot="programming-language-python"

> [!div class="nextstepaction"]
> [Python developer guide](./functions-reference-python.md)

::: zone-end

::: zone pivot="programming-language-powershell"

> [!div class="nextstepaction"]
> [PowerShell developer guide](./functions-reference-powershell.md)

::: zone-end
