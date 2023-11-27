---
title: Update language versions in Azure Functions
description: Learn how to update the version of the native language used by a function app in Azure Functions.
ms.topic: how-to
ms.custom: devx-track-extended-java
ms.date: 11/20/2023
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Update language versions in Azure Functions 

The Azure Functions supports specific versions of each native language. This support changes based on the support of specific versions of each language or language stack. As these supported versions change, you need to update your function app to stay on a supported version. You can also want to update your apps to take advantage of features in newer supported versions of your language. For more information, see [Languages](functions-versions.md#languages).   

The way that you update your function app depends on: 

+ The language of your functions; make sure to choose your function language at the [top](#top) of the article. 
+ The operating system on which your app runs in Azure: Windows or Linux. 
+ The [hosting plan](./functions-scale.md).

::: zone pivot="programming-language-csharp"   
This article shows you have to update your version of .NET when your app runs in an [isolated worker process](dotnet-isolated-process-guide.md). Apps that run [on .NET 6 in-process](functions-dotnet-class-library.md) can't yet be updated to .NET 8. To migrate your app from in-process to the isolated worker process model, see [Migrate .NET apps from the in-process model to the isolated worker model](migrate-dotnet-to-isolated-model.md).
::: zone-end  
 

## Prepare to update

Before you update the language version in Azure, you should complete these tasks:

### 1. Verify your functions locally

Before upgrading the language version used by your function app in Azure, make sure that you test and verify your function code locally on the new target language version.  

### 2. Move to the latest Functions runtime
 
Before updating your language version, make sure your function app is running on the latest version of the Functions runtime (version 4.x). You can determine the runtime version either in the Azure portal or by using the Azure CLI.

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

If you need to first update your function app to version 4.x, see [Migrate apps from Azure Functions version 3.x to version 4.x](./migrate-version-3-version-4.md). You should follow the instructions in that article rather than just changing the `FUNCTIONS_EXTENSION_VERSION` setting.

## Publish app updates

If you updated your app to run correctly on the new language version, publish the app updates before you update the language version in your function app. 

> [!TIP]  
> To simplify the update process, minimize downtime for your functions, and provide a potential for rollback, you should publish your updated app to a staging slot. For more information, see [Azure Functions deployment slots](functions-deployment-slots.md#add-a-slot). 

When publishing your updated app to a staging slot, make sure to follow the slot-specific update instructions in the rest of this article. You later swap the updated staging slot into production.

## Update the language version

The way that you update the language or language-stack version depends on whether you're running on Windows or on Linux in Azure.  

When using a [staging slot](functions-deployment-slots.md), make sure to target your updates to the correct slot.  

### [Windows](#tab/windows/azure-portal)

[!INCLUDE [functions-update-language-version-portal](../../includes/functions-update-language-version-portal.md)]

### [Linux](#tab/linux/azure-portal)

> [!NOTE]  
> You can only use the Azure portal to update function apps on Linux hosted in a [Premium plan](./functions-premium-plan.md) or a [Dedicated (App Service) plan](./dedicated-plan.md). For apps on Linux hosted in a [Consumption plan](./consumption-plan.md), you must instead use the [Azure CLI](update-language-versions.md?tabs=azure-cli#update-the-language-version).
 
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
::: zone pivot="programming-language-java,programming-language-python,programming-language-powershell" 
First, use the [`az functionapp list-runtimes`](/cli/azure/functionapp#az-functionapp-list-runtimes) command to view the supported version values for your language. Then, run the [`az functionapp config set`](/cli/azure/functionapp/config#az-functionapp-config-set) command to update the language version of your function app:  
::: zone-end  
::: zone pivot="programming-language-csharp" 
First, use the [`az functionapp list-runtimes`](/cli/azure/functionapp#az-functionapp-list-runtimes) command to view the supported version values for your language stack (.NET). Then, run the [`az functionapp config set`](/cli/azure/functionapp/config#az-functionapp-config-set) command to update the .NET version of your function app:  
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

az functionapp config set --net-framework-version "<VERSION>" --name "<APP_NAME>" --resource-group "<RESOURCE_GROUP>" --slot "staging"  
```
::: zone-end  
::: zone pivot="programming-language-javascript" 
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
In this example, replace `<APP_NAME>` and `<RESOURCE_GROUP>` with the name of your function app and resource group, respectively. Also replace `<VERSION>` with the supported language version to which you're updating. If you aren't using a staging slot, remove the `--slot` parameter.

### [Linux](#tab/linux/azure-cli)
::: zone pivot="programming-language-python"  
> [!NOTE]   
> You can't change the Python version when running in a Consumption plan. 
::: zone-end  
::: zone pivot="programming-language-java,programming-language-python,programming-language-powershell"
Run the [`az functionapp list-runtimes`](/cli/azure/functionapp#az-functionapp-list-runtimes) command to view the supported [`linuxFxVersion`](functions-app-settings.md#linuxfxversion) site setting for your language version:
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-javascript"
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
::: zone pivot="programming-language-javascript"  
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
::: zone pivot="programming-language-csharp,programming-language-javascript" 
Run the [`az functionapp config set`](/cli/azure/functionapp/config#az-functionapp-config-set) command to update the site setting for the new stack version of your function app: 
::: zone-end  
```azurecli
az functionapp config set --linux-fx-version "<LANGUAGE|VERSION>" --name "<APP_NAME>" --resource-group "<RESOURCE_GROUP>" --slot "staging"  
```

In this example, replace `<APP_NAME>` and `<RESOURCE_GROUP>` with the name of your function app and resource group, respectively. Also replace `<LANGUAGE|VERSION>` with the `linuxFxVersion` for your update. If you aren't using a staging slot, remove the `--slot` parameter.

---

Your function app restarts after you update the version. To learn more about Functions support policies for native languages, see [Language runtime support policy](language-support-policy.md). 

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
::: zone pivot="programming-language-javascript"   
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
