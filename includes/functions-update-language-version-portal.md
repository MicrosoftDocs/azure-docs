::: zone pivot="programming-language-java"  
Use the following steps to update the Java version:
 
1. In the [Azure portal](https://portal.azure.com), locate your function app and select **Configuration** on the left-hand side. When using a staging slot, make sure to first select the specific slot.

1. In the **General settings** tab, update **Java version** to the desired version. 

    :::image type="content" source="../articles/azure-functions/media/update-language-versions/update-java-version-portal.png" alt-text="Screenshot of how to set the desired Java version for a function app in the Azure portal."::: 

1. Select **Save** and when notified about a restart select **Continue**. 
::: zone-end  
::: zone pivot="programming-language-csharp" 
Use the following steps to update the .NET version:

1. In the [Azure portal](https://portal.azure.com), locate your function app and select **Configuration** on the left-hand side. When using a staging slot, make sure to first select the specific slot.

1. In the **General settings** tab, update **.NET version** to the desired version. 

    :::image type="content" source="../articles/azure-functions/media/update-language-versions/update-dotnet-version-portal.png" alt-text="Screenshot of how to set the desired .NET version for a function app in the Azure portal."::: 

1. Select **Save** and when notified about a restart select **Continue**.  
::: zone-end  
::: zone pivot="programming-language-javascript"  
Use the following steps to update the Node.js version:

1. In the [Azure portal](https://portal.azure.com), locate your function app and select **Configuration** on the left-hand side. When using a staging slot, make sure to first select the specific slot.

1. In the **General settings** tab, update **Node.js version** to the desired version. 

    :::image type="content" source="../articles/azure-functions/media/update-language-versions/update-nodejs-version-portal.png" alt-text="Screenshot of how to set the desired Node.js version for a function app in the Azure portal."::: 

1. Select **Save** and when notified about a restart select **Continue**. This change updates the [`WEBSITE_NODE_DEFAULT_VERSION`](../articles/azure-functions/functions-app-settings.md#website_node_default_version) application setting.  
::: zone-end  
::: zone pivot="programming-language-powershell" 
Use the following steps to update the PowerShell version:

1. In the [Azure portal](https://portal.azure.com), locate your function app and select **Configuration** on the left-hand side. When using a staging slot, make sure to first select the specific slot.

1. In the **General settings** tab, update **.NET version** to the desired version. 

    :::image type="content" source="../articles/azure-functions/media/update-language-versions/update-powershell-version-portal.png" alt-text="Screenshot of how to set the desired PowerShell version for a function app in the Azure portal."::: 

1. Select **Save** and when notified about a restart select **Continue**. 
::: zone-end 
::: zone pivot="programming-language-python" 
Python apps aren't supported on Windows. Select the **Linux** tab instead.
::: zone-end 