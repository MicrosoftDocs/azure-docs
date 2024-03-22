---
title: Update language versions in Azure Functions
description: Learn how to update the version of the native language used by a function app in Azure Functions.
ms.topic: how-to
ms.custom: devx-track-extended-java, devx-track-azurecli, devx-track-js, devx-track-python
ms.date: 12/06/2023
zone_pivot_groups: programming-languages-set-functions
---

# Update language stack versions in Azure Functions 

The support for any given language stack in Azure Functions is limited to [specific versions](functions-versions.md#languages). As new versions become available, you might want to update your apps to take advantage of their features. Support in Functions may also end for older versions, typically aligned to the community end-of-support timelines. See the [Language runtime support policy](./language-support-policy.md) for details. To ensure your apps continue to receive support, you should follow the instructions outlined in this article to update them to the latest available versions.

The way that you update your function app depends on: 

+ The language you use to author your functions; make sure to choose your programming language at the [top](#top) of the article. 
+ The operating system on which your app runs in Azure: Windows or Linux. 
+ The [hosting plan](./functions-scale.md).

::: zone pivot="programming-language-csharp"   
This article shows you how to update the .NET version of an app using the [isolated worker model](dotnet-isolated-process-guide.md). Apps that run on [the in-process model](functions-dotnet-class-library.md) can't yet be updated to .NET 8 without switching to the isolated worker model. To migrate to the isolated worker model, see [Migrate .NET apps from the in-process model to the isolated worker model](migrate-dotnet-to-isolated-model.md). For information about .NET 8 plans, including future options for the in-process model, see the [Azure Functions Roadmap Update post](https://aka.ms/azure-functions-dotnet-roadmap). 
::: zone-end  

## Prepare to update

Before you update the stack configuration for your function app in Azure, you should complete these tasks:

### 1. Verify your functions locally

Make sure that you test and verify your function code locally on the new target version.

::: zone pivot="programming-language-csharp"
Use these steps to update the project on your local computer:

1. Ensure you have [installed the target version of the .NET SDK](https://dotnet.microsoft.com/download/dotnet).

1. Update your references to the latest stable versions of: [Microsoft.Azure.Functions.Worker](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker/) and [Microsoft.Azure.Functions.Worker.Sdk](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk/).

1. Update your project's target framework to the new version. For C# projects, you must update the `<TargetFramework>` element in the `.csproj` file. See [Target frameworks](/dotnet/standard/frameworks) for specifics related to the chosen version.

1. Make any updates to your project code that are required by the new .NET version. Check the version's release notes for specifics. You can also use the [.NET Upgrade Assistant](/dotnet/core/porting/upgrade-assistant-overview) to help you update your code in response to changes across major versions.

After you've made those changes, rebuild your project and test it to confirm your app runs as expected. 
::: zone-end  

### 2. Move to the latest Functions runtime
 
Make sure your function app is running on the latest version of the Functions runtime (version 4.x). You can determine the runtime version either in the Azure portal or by using the Azure CLI.

### [Azure portal](#tab/azure-portal)

Use these steps to determine your Functions runtime version:

1. In the [Azure portal](https://portal.azure.com), locate your function app and select **Configuration** on the left-hand side under **Settings**. 

1. Select the **Function runtime settings** tab and check the **Runtime version** value to see if your function app is running on version 4.x of the Functions runtime (`~4`). 

    :::image type="content" source="media/update-language-versions/update-functions-version-portal.png" alt-text="Screenshot of how to view the Functions runtime version for your app in the Azure portal."::: 

### [Azure CLI](#tab/azure-cli)

Use this [`az functionapp config appsettings list`](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-list) command to check your runtime version: 

```azurecli
az functionapp config appsettings list --name "<FUNCTION_APP_NAME>" --resource-group "<RESOURCE_GROUP_NAME>"  
```
The `FUNCTIONS_EXTENSION_VERSION` setting sets the runtime version. A value of `~4` means that your function app is already running on the latest minor version of the latest major version (4.x). 

---

If you need to first update your function app to version 4.x, see [Migrate apps from Azure Functions version 1.x to version 4.x](./migrate-version-1-version-4.md) or  [Migrate apps from Azure Functions version 3.x to version 4.x](./migrate-version-3-version-4.md). You should follow the instructions in those articles rather than just changing the `FUNCTIONS_EXTENSION_VERSION` setting.

## Publish app updates

If you updated your app to run correctly on the new version, publish the app updates before you update the stack configuration for your function app. 

> [!TIP]  
> To simplify the update process, minimize downtime for your functions, and provide a potential for rollback, you should publish your updated app to a staging slot. For more information, see [Azure Functions deployment slots](functions-deployment-slots.md#add-a-slot). 

When publishing your updated app to a staging slot, make sure to follow the slot-specific update instructions in the rest of this article. You later swap the updated staging slot into production.

## Update the stack configuration

The way that you update the stack configuration depends on whether you're running on Windows or on Linux in Azure.

When using a [staging slot](functions-deployment-slots.md), make sure to target your updates to the correct slot.

### [Windows](#tab/windows/azure-portal)

[!INCLUDE [functions-update-language-version-portal](../../includes/functions-update-language-version-portal.md)]

### [Linux](#tab/linux/azure-portal)

> [!NOTE]  
> You can only use the Azure portal to update function apps on Linux hosted in a [Premium plan](./functions-premium-plan.md) or a [Dedicated (App Service) plan](./dedicated-plan.md). For apps on Linux hosted in a [Consumption plan](./consumption-plan.md), you must instead use the [Azure CLI](update-language-versions.md?tabs=azure-cli#update-the-stack-configuration).
 
[!INCLUDE [functions-update-language-version-portal](../../includes/functions-update-language-version-portal.md)]

::: zone pivot="programming-language-python" 
1. In the [Azure portal](https://portal.azure.com), locate your function app and select **Configuration** on the left-hand side. When using a staging slot, make sure to first select the specific slot.

1. In the **General settings** tab, update **Python version** to the desired version. 

    :::image type="content" source="media/update-language-versions/update-python-version-portal.png" alt-text="Screenshot of how to set the desired Python version for a function app in the Azure portal."::: 

    > [!NOTE]   
    > You can't change the Python version when running in a Consumption plan.  

1. Select **Save** and when notified about a restart select **Continue**. 
::: zone-end 

### [Windows](#tab/windows/azure-cli)
::: zone pivot="programming-language-python"  
Python apps aren't supported on Windows. Select the **Linux** tab instead.
::: zone-end  
::: zone pivot="programming-language-java,programming-language-powershell" 
First, use the [`az functionapp list-runtimes`](/cli/azure/functionapp#az-functionapp-list-runtimes) command to view the supported version values for your language. Then, run the [`az functionapp config set`](/cli/azure/functionapp/config#az-functionapp-config-set) command to update the language version of your function app:  
::: zone-end  
::: zone pivot="programming-language-csharp" 
Run the [`az functionapp list-runtimes`](/cli/azure/functionapp#az-functionapp-list-runtimes) command to view the supported version values for .NET on the isolated worker model:
::: zone-end  
::: zone pivot="programming-language-java"  
```azurecli
az functionapp list-runtimes --os "windows" --query "[?runtime == 'java'].{Version:version}" --output table

az functionapp config set --java-version "<VERSION>" --name "<APP_NAME>" --resource-group "<RESOURCE_GROUP>" --slot "staging"  
```
::: zone-end  
::: zone pivot="programming-language-csharp"

```azurecli
az functionapp list-runtimes --os "windows" --query "[?runtime == 'dotnet-isolated'].{Version:version}" --output table
```

Run the [`az functionapp config set`](/cli/azure/functionapp/config#az-functionapp-config-set) command to update the .NET version of your function app:

```azurecli
az functionapp config set --net-framework-version "v<VERSION>.0" --name "<APP_NAME>" --resource-group "<RESOURCE_GROUP>" --slot "staging"  
```

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript" 
First, use the [`az functionapp list-runtimes`](/cli/azure/functionapp#az-functionapp-list-runtimes) command to view the supported version values for your language stack (Node.js). Then, run the [`az functionapp config set`](/cli/azure/functionapp/config#az-functionapp-config-set) command to update the Node.js version of your function app:

```azurecli
az functionapp list-runtimes --os "windows" --query "[?runtime == 'node'].{Version:version}" --output table

az functionapp config appsettings set --name "<APP_NAME>" --resource-group "<RESOURCE_GROUP>" --settings "WEBSITE_NODE_DEFAULT_VERSION=~<VERSION>" --slot "staging"  
```
::: zone-end  
::: zone pivot="programming-language-powershell" 
```azurecli
az functionapp list-runtimes --os "windows" --query "[?runtime == 'powershell'].{Version:version}" --output table

az functionapp config set --powershell-version "<VERSION>" --name "<APP_NAME>" --resource-group "<RESOURCE_GROUP>" --slot "staging"  
```  
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-powershell"  
In this example, replace `<APP_NAME>` and `<RESOURCE_GROUP>` with the name of your function app and resource group, respectively. Also replace `<VERSION>` with the supported language version to which you're updating. If you aren't using a staging slot, remove the `--slot` parameter.
::: zone-end   
### [Linux](#tab/linux/azure-cli)
::: zone pivot="programming-language-python"  
> [!NOTE]   
> You can't change the Python version when running in a Consumption plan. 
::: zone-end  
::: zone pivot="programming-language-java,programming-language-python,programming-language-powershell"
Run the [`az functionapp list-runtimes`](/cli/azure/functionapp#az-functionapp-list-runtimes) command to view the supported [`linuxFxVersion`](functions-app-settings.md#linuxfxversion) site setting for your language version:
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript"
Run the [`az functionapp list-runtimes`](/cli/azure/functionapp#az-functionapp-list-runtimes) command to view the supported [`linuxFxVersion`](functions-app-settings.md#linuxfxversion) site setting for your language stack version:
::: zone-end  
::: zone pivot="programming-language-java"  
```azurecli
az functionapp list-runtimes --os linux --query "[?runtime == 'python'].{Version:version, linuxFxVersion:linux_fx_version}" --output table
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
Run the [`az functionapp config set`](/cli/azure/functionapp/config#az-functionapp-config-set) command to update the site setting for the new language version of your function app: 
::: zone-end 
::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript" 
Run the [`az functionapp config set`](/cli/azure/functionapp/config#az-functionapp-config-set) command to update the site setting for the new stack version of your function app: 
::: zone-end  
```azurecli
az functionapp config set --linux-fx-version "<LANGUAGE|VERSION>" --name "<APP_NAME>" --resource-group "<RESOURCE_GROUP>" --slot "staging"  
```

In this example, replace `<APP_NAME>` and `<RESOURCE_GROUP>` with the name of your function app and resource group, respectively. Also replace `<LANGUAGE|VERSION>` with the `linuxFxVersion` for your update. If you aren't using a staging slot, remove the `--slot` parameter.

---

Your function app restarts after you update the version.

## Swap slots

If you have been performing your code project deployment and updating settings in a staging slot, you finally need to swap the staging slot into production. For more information, see [Swap slots](functions-deployment-slots.md#swap-slots). 

## Next steps

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
