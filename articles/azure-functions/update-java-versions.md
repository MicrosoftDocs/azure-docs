---
title: Update Java versions in Azure Functions
description: Learn how to update an existing function app in Azure Functions to run on a new version of Java.
ms.topic: how-to
ms.date: 09/14/2023
zone_pivot_groups: app-service-platform-windows-linux
---

# Update Java versions in Azure Functions 

The Azure Functions supports specific versions of Java. This support changes based on the support or Java versions. As these supported versions change, you need to update your Java function apps. You may also want to update your apps to take advantage of features in newer supported version of Java. For more information, see [Supported versions](functions-reference-java.md#supported-versions) in the Java developer guide.   

:::zone pivot="platform-windows"  
The way that you update your function app depends on whether you run on Windows or Linux. This version is for Windows. Choose your OS at the [top](#top) of the article.  
:::zone-end  
:::zone pivot="platform-linux"  
The way that you update your function app depends on whether you run on Windows or Linux. This version is for Linux. Choose your OS at the [top](#top) of the article.  
:::zone-end  

## Prepare to update

Before you update the Java version in Azure, you should complete these tasks:

### 1. Verify your functions locally

Before upgrading the Java version used by your function app in Azure, make sure that you have fully tested and verified your function code locally on the new target version of Java. Examples in this article assume you're updating to Java 17. 

### 2. Move to the latest Functions runtime
 
Before updating your Java version, make sure your function app is running on the latest version of the Functions runtime (version 4.x). 

### [Azure portal](#tab/azure-portal)

Use these steps to determine your Functions runtime version:

1. In the [Azure portal](https://portal.azure.com), locate your function app and select **Configuration** on the left-hand side under **Settings**. 

1. Select the **Function runtime settings** tab and check the **Runtime version** value to see if your function app is running on version 4.x of the Functions runtime (`~4`). 

    :::image type="content" source="media/update-java-versions/update-functions-version-portal.png" alt-text="Screenshot of how to view the Functions runtime version for your app in the Azure portal."::: 

### [Azure CLI](#tab/azure-cli)

Use this [`az functionapp config appsettings list`](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-list) command to check your runtime version: 

```azurecli
az functionapp config appsettings list --name "<FUNCTION_APP_NAME>" --resource-group "<RESOURCE_GROUP_NAME>"  
```
The `FUNCTIONS_EXTENSION_VERSION` setting sets the runtime version. A value of `~4` means that your function app is already running on the latest minor version of the latest major version (4.x). 

---

If you need to first update your function app to version 4.x, see [Migrate apps from Azure Functions version 3.x to version 4.x](./migrate-version-3-version-4.md). You should follow the instructions in this article rather than just manually changing the `FUNCTIONS_EXTENSION_VERSION` setting.

## Update the Java version
:::zone pivot="platform-windows"  
You can use the Azure portal, Azure CLI, or Azure PowerShell to update the Java version for your function app. 
These procedures apply to all [Functions hosting options](./functions-scale.md). 
:::zone-end  
:::zone pivot="platform-linux"  
>[!NOTE] 
> You can't change the Java version in the Azure portal when your function app is running on Linux in a [Consumption plan](./consumption-plan.md). Instead use the Azure CLI. 
:::zone-end  
### [Azure portal](#tab/azure-portal)
:::zone pivot="platform-linux" 
You can only use these steps for function apps hosted in a [Premium plan](./functions-premium-plan.md) or a [Dedicated (App Service) plan](./dedicated-plan.md). For a [Consumption plan](./consumption-plan.md), you must instead use the Azure CLI.
::: zone-end  
Use the following steps to update the Java version: 

1. In the [Azure portal](https://portal.azure.com), locate your function app and select **Configuration** on the left-hand side. 

1. In the **General settings** tab, update the **Java version** to `Java 17`. 

    :::image type="content" source="media/update-java-versions/update-java-version-portal.png" alt-text="Screenshot of how to set the desired Java version for a function app in the Azure portal."::: 

1. When notified about a restart, select **Continue**, and then **Save**. 

### [Azure CLI](#tab/azure-cli)

You can use the Azure CLI to update the Java version for any hosting plan.

:::zone pivot="platform-windows"  
Run the [`az functionapp config set`](/cli/azure/functionapp/config#az-functionapp-config-set) command to update the Java version site setting to `17`: 

```azurecli
az functionapp config set --java-version "17" --name "<APP_NAME>" --resource-group "<RESOURCE_GROUP>" 
```
:::zone-end  
:::zone pivot="platform-linux"   
Run the [`az functionapp config set`](/cli/azure/functionapp/config#az-functionapp-config-set) command to update the Linux site setting with the new Java version for your function app. 

```azurecli
az functionapp config set --linux-fx-version "java|17" --name "<APP_NAME>" --resource-group "<RESOURCE_GROUP>" 
```
:::zone-end  

In this example, replace `<APP_NAME>` and `<RESOURCE_GROUP>` with the name of your function app and resource group, respectively.  

---

Your function app restarts after you update the Java version. To learn more about Functions support for Java, see [Language runtime support policy](language-support-policy.md). 

## Next steps

> [!div class="nextstepaction"]
> [Java developer guide](./functions-reference-java.md)
 
