---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 02/24/2025
ms.author: danlep
ms.custom:
  - build-2025
---


To configure a diagnostic setting for collection of resource logs:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **Monitoring**, select **Diagnostic settings** > **+ Add diagnostic setting**.

   :::image type="content" source="media/api-management-diagnostic-settings/monitoring-menu.png" alt-text="Screenshot of adding a diagnostic setting in the portal.":::

1. On the **Diagnostic setting** page, enter or select details for the setting:

    1. **Diagnostic setting name**: Enter a descriptive name.
    1. **Category groups**: Optionally make a selection for your scenario.
    1. Under **Categories**: Select one or more categories. For example, select **Logs related to ApiManagement Gateway** to collect logs for most requests to the API Management gateway. 
    1. Under **Destination details**, select one or more options and specify details for the destination. For example, send logs to an Azure Log Analytics workspace, archive logs to a storage account, or stream them to an event hub. For more information, see [Diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/diagnostic-settings).
    1. Select **Save**.


   > [!TIP]
   > If you select a Log Analytics workspace, you can choose to store the data in a resource-specific table (for example, an ApiManagementGatewayLogs table) or store in the general AzureDiagnostics table. We recommend using the resource-specific table for log destinations that support it. [Learn more](/azure/azure-monitor/essentials/resource-logs#send-to-log-analytics-workspace)
1. After configuring details for the log destination or destinations, select **Save**. 

> [!NOTE]
> Adding a diagnostic setting object might result in a failure if the [MinApiVersion property](/dotnet/api/microsoft.azure.management.apimanagement.models.apiversionconstraint.minapiversion) of your API Management service is set to any API version higher than 2022-09-01-preview. 

> [!NOTE]
> To enable diagnostic settings for API Management workspaces, see [Create and manage a workspace](../articles/api-management/how-to-create-workspace.md#enable-diagnostic-settings-for-monitoring-workspace-apis).

