---
title: IT Service Management Connector in Log Analytics
description: This article provides an overview of IT Service Management Connector (ITSMC) and information about using it to monitor and manage ITSM work items in Log Analytics and resolve problems quickly.
ms.topic: conceptual
ms.date: 10/03/2022
ms.custom: references_regions
ms.reviewer: nolavime

---

# Connect Azure to ITSM tools by using IT Service Management

:::image type="icon" source="media/itsmc-overview/itsmc-symbol.png":::

This article provides information about how to configure IT Service Management Connector (ITSMC) in Log Analytics to centrally manage your IT Service Management (ITSM) work items.

## Install IT Service Management Connector

Before you create a connection, install ITSMC.

1. In the Azure portal, select **Create a resource**.

   :::image type="content" source="media/itsmc-overview/azure-add-new-resource.png" lightbox="media/itsmc-overview/azure-add-new-resource.png" alt-text="Screenshot that shows the menu item for creating a resource.":::

1. Search for **IT Service Management Connector** in Azure Marketplace. Then select **Create**.

   :::image type="content" source="media/itsmc-overview/add-itsmc-solution.png" lightbox="media/itsmc-overview/add-itsmc-solution.png" alt-text="Screenshot that shows the Create button in Azure Marketplace.":::

1. In the **Azure Log Analytics Workspace** section, select the Log Analytics workspace where you want to install ITSMC.
   > [!NOTE]
   > You can install ITSMC in Log Analytics workspaces only in the following regions: East US, West US 2, South Central US, West Central US, US Gov Arizona, US Gov Virginia, Canada Central, West Europe, South UK, Southeast Asia, Japan East, Central India, and Australia Southeast.

1. In the **Azure Log Analytics Workspace** section, select the resource group where you want to create the ITSMC resource.

   :::image type="content" source="media/itsmc-overview/itsmc-solution-workspace.png" lightbox="media/itsmc-overview/itsmc-solution-workspace.png" alt-text="Screenshot that shows the Azure Log Analytics Workspace section.":::

   > [!NOTE]
   > As part of the ongoing transition from Microsoft Operations Management Suite to Azure Monitor, Operations Management workspaces are now called *Log Analytics workspaces*.

1. Select **OK**.

When the ITSMC resource is deployed, a notification appears in the upper-right corner of the screen.

## Create an ITSM connection

After you've installed ITSMC, and prepped your ITSM tool, create an ITSM connection.

1. [Configure ServiceNow](./itsmc-connections-servicenow.md) to allow the connection from ITSMC.
1. In **All resources**, look for **ServiceDesk(*your workspace name*)**.

   :::image type="content" source="media/itsmc-definition/create-new-connection-from-resource.png" lightbox="media/itsmc-definition/create-new-connection-from-resource.png" alt-text="Screenshot that shows recent resources in the Azure portal.":::

1. Under **Workspace Data Sources** on the left pane, select **ITSM Connections**.

   :::image type="content" source="media/itsmc-overview/add-new-itsm-connection.png" lightbox="media/itsmc-overview/add-new-itsm-connection.png" alt-text="Screenshot that shows the ITSM Connections menu item.":::

1. Select **Add Connection**.
1. Specify the ServiceNow connection settings.
1. By default, ITSMC refreshes the connection's configuration data once every 24 hours. To refresh your connection's data instantly to reflect any edits or template updates that you make, select the **Sync** button on your connection's pane.

    :::image type="content" source="media/itsmc-overview/itsmc-connections-refresh.png" lightbox="media/itsmc-overview/itsmc-connections-refresh.png" alt-text="Screenshot that shows the Sync button on the connection's pane.":::

## Create ITSM work items from Azure alerts

After you create your ITSM connection, use the ITSM action in action groups to create work items in your ITSM tool based on Azure alerts. Action groups provide a modular and reusable way to trigger actions for your Azure alerts. You can use action groups with metric alerts, activity log alerts, and Log Analytics alerts in the Azure portal.

> [!NOTE]
> Wait 30 minutes after you create the ITSM connection for the sync process to finish.
### Define a template

Certain work item types can use templates that you define in ServiceNow. When you use templates, you can define fields that will be automatically populated by using constant values defined in ServiceNow (not values from the payload). The templates are synced with Azure. You can define which template you want to use as a part of the definition of an action group. For information about how to create templates, see the [ServiceNow documentation](https://docs.servicenow.com/en-US/bundle/tokyo-platform-administration/page/administer/form-administration/task/t_CreateATemplateUsingTheTmplForm.html).

### Create ITSM work items

To create an action group:

1. In the Azure portal, select **Monitor** > **Alerts**.
1. On the menu at the top of the screen, select **Manage actions**.

    :::image type="content" source="media/itsmc-overview/action-groups-selection-big.png" lightbox="media/itsmc-overview/action-groups-selection-big.png" alt-text="Screenshot that shows selecting Action groups.":::

1. On the **Action groups** screen, select **+Create**.
   The **Create action group** screen appears.
1. Select the **Subscription** and **Resource group** where you want to create your action group. Enter values in **Action group name** and **Display name** for your action group. Then select **Next: Notifications**.

    :::image type="content" source="media/itsmc-overview/action-groups-details.png" lightbox="media/itsmc-overview/action-groups-details.png" alt-text="Screenshot that shows the Create an action group screen.":::

1. On the **Notifications** tab, select **Next: Actions**.
1. On the **Actions** tab, select **ITSM** in the **Action type** list. For **Name**, provide a name for the action. Then select the pen button that represents **Edit details**.

    :::image type="content" source="media/itsmc-definition/action-group-pen.png" lightbox="media/itsmc-definition/action-group-pen.png" alt-text="Screenshot that shows selections for creating an action group.":::

1. In the **Subscription** list, select the subscription that contains your Log Analytics workspace. In the **Connection** list, select your ITSM Connector name. It will be followed by your workspace name. An example is *MyITSMConnector(MyWorkspace)*.
1. In the **Work Item** type field, select the type of work item.

    > [!NOTE]
    > As of September 2022, we are starting the 3-year process of deprecating support for using ITSM actions to send alerts and events to ServiceNow.

1. In the last section of the interface for creating an ITSM action group, if the alert is a log alert, you can define how many work items will be created for each alert. For all other alert types, one work item is created per alert.

    - If the work item type is **Incident**:
      
      :::image type="content" source="media/itsmc-definition/itsm-action-incident.png" lightbox="media/itsmc-definition/itsm-action-incident.png" alt-text="Screenshot that shows the ITSM Ticket area with an incident work item type.":::

    - If the work item type is **Event**:

        If you select **Create a work item for each row in the search results**, every row in the search results creates a new work item. Because several alerts occur for the same affected configuration items, there is also more than one work item. For example, an alert that has three configuration items creates three work items. An alert that has one configuration item creates one work item.

        If you select the **Create a work item for configuration item in the search results**, ITSMC creates a single work item for each alert rule and adds all affected configuration items to that work item. A new work item is created if the previous one is closed. This means that some of the fired alerts won't generate new work items in the ITSM tool. For example, an alert that has three configuration items creates one work item. If an alert has one configuration item, that configuration item is attached to the list of affected configuration items in the created work item. An alert for a different alert rule that has one configuration item creates one work item.
        
        :::image type="content" source="media/itsmc-definition/itsm-action-event.png" lightbox="media/itsmc-definition/itsm-action-event.png" alt-text="Screenshot that shoes the ITSM Ticket section with an even work item type.":::

    - If the work item type is **Alert**:

        If you select **Create a work item for each row in the search results**, every row in the search results creates a new work item. Because several alerts occur for the same affected configuration items, there is also more than one work item. For example, an alert that has three configuration items creates three work items. An alert that has one configuration item creates one work item.

        If you do not select **Create a work item for each row in the search results**, ITSMC creates a single work item for each alert rule and adds all affected configuration items to that work item. A new work item is created if the previous one is closed. This means that some of the fired alerts won't generate new work items in the ITSM tool. For example, an alert that has three configuration items creates one work item. If an alert has one configuration item, that configuration item is attached to the list of affected configuration items in the created work item. An alert for a different alert rule that has one configuration item creates one work item. 
        
        :::image type="content" source="media/itsmc-definition/itsm-action-alert.png" lightbox="media/itsmc-definition/itsm-action-alert.png" alt-text="Screenshot that shows the ITSM Ticket area with an alert work item type.":::

1. You can configure predefined fields to contain constant values as a part of the payload. Based on the work item type, three options can be used as a part of the payload:
    * **None**: Use a regular payload to ServiceNow without any extra predefined fields and values.
    * **Use default fields**: Use a set of fields and values that will be sent automatically as a part of the payload to ServiceNow. Those fields aren't flexible, and the values are defined in ServiceNow lists.
    * **Use saved templates from ServiceNow**: Use a predefined set of fields and values that were defined as a part of a template definition in ServiceNow. If you already defined the template in ServiceNow, you can use it from the **Template** list. Otherwise, you can define it in ServiceNow. For more information, see [define a template](#define-a-template).

1. Select **OK**.

When you create or edit an Azure alert rule, use an action group, which has an ITSM action. When the alert triggers, the work item is created or updated in the ITSM tool.

> [!NOTE]
> * For information about the pricing of the ITSM action, see the [pricing page](https://azure.microsoft.com/pricing/details/monitor/) for action groups.
>
> * The short description field in the alert rule definition is limited to 40 characters when you send it using the ITSM action.
>
> * If you have policies for inbound traffic for your ServiceNow instances, add ActionGroup service tag to allowList.
> 
> * Notice that when you are defining a query in Log Search alerts you need to have in the query result the Configuration items names with one of the label names "Computer",  "Resource", "_ResourceId" or "ResourceId”. This mapping will enable to map the configuration items to the ITSM payload

## Next steps

[Troubleshoot problems in ITSMC](./itsmc-resync-servicenow.md)
