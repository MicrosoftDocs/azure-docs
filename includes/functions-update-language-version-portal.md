---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 08/21/2025
ms.author: glenga
---

::: zone pivot="programming-language-java"  
Use the following steps to update the Java version:

1. In the [Azure portal](https://portal.azure.com), locate and select your function app. On the side menu, select **Settings** > **Configuration**. If you have a staging slot, select the specific slot.
 
1. On the **General settings** tab, update **Java Version** to the desired version. 

   :::image type="content" source="../articles/azure-functions/media/update-language-versions/update-java-version-portal.png" alt-text="Screenshot of a function app Configuration page in the Azure portal. On the General settings tab, several Java versions are available for selection."::: 

1. Select **Save**. When you're notified about a restart, select **Continue**. 
::: zone-end  
::: zone pivot="programming-language-csharp" 
Use the following steps to update the .NET version:

1. In the [Azure portal](https://portal.azure.com), locate and select your function app. On the side menu, select **Settings** > **Configuration**. If you have a staging slot, select the specific slot.

1. On the **General settings** tab, update **.NET Version** to the desired version. 

   :::image type="content" source="../articles/azure-functions/media/update-language-versions/update-dotnet-version-portal.png" alt-text="Screenshot of a function app Configuration page in the Azure portal. On the General settings tab, several .NET versions are available for selection."::: 

1. Select **Save**. When you're notified about a restart, select **Continue**.  
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
Use the following steps to update the Node.js version:

1. In the [Azure portal](https://portal.azure.com), locate and select your function app. On the side menu, select **Settings** > **Configuration**. If you have a staging slot, select the specific slot.

1. On the **General settings** tab, update **Node.js Version** to the desired version. 

   :::image type="content" source="../articles/azure-functions/media/update-language-versions/update-nodejs-version-portal.png" alt-text="Screenshot of the Azure portal function app Configuration page. On the General settings tab, several Node.js versions are available for selection."::: 

1. Select **Save**. When you're notified about a restart, select **Continue**. This change updates the [`WEBSITE_NODE_DEFAULT_VERSION`](../articles/azure-functions/functions-app-settings.md#website_node_default_version) application setting.  
::: zone-end  
::: zone pivot="programming-language-powershell" 
Use the following steps to update the PowerShell version:

1. In the [Azure portal](https://portal.azure.com), locate and select your function app. On the side menu, select **Settings** > **Configuration**. If you have a staging slot, select the specific slot.

1. On the **General settings** tab, update **PowerShell Core Version** to the desired version. 

   :::image type="content" source="../articles/azure-functions/media/update-language-versions/update-powershell-version-portal.png" alt-text="Screenshot of the Azure portal function app Configuration page. On the General settings tab, several PowerShell versions are available for selection."::: 

1. Select **Save**. When you're notified about a restart, select **Continue**. 
::: zone-end 
::: zone pivot="programming-language-python" 
Python apps aren't supported on Windows. Go to the **Linux** tab instead.
::: zone-end 
