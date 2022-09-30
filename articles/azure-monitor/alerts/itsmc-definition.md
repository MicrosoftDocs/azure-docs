---
title: IT Service Management Connector in Log Analytics
description: This article provides an overview of IT Service Management Connector (ITSMC) and information about using it to monitor and manage ITSM work items in Log Analytics and resolve problems quickly.
ms.topic: conceptual
ms.date: 2/23/2022
ms.custom: references_regions
ms.reviewer: nolavime

---

# Connect Azure to ITSM tools by using IT Service Management solution

:::image type="icon" source="media/itsmc-overview/itsmc-symbol.png":::

This article provides information about how to configure IT Service Management Connector (ITSMC) in Log Analytics to centrally manage your IT Service Management (ITSM) work items.

## Add IT Service Management Connector

Before you can create a connection, install ITSMC.

1. In the Azure portal, select **Create a resource**.

   ![Screenshot that shows the menu item for creating a resource.](media/itsmc-overview/azure-add-new-resource.png)

1. Search for **IT Service Management Connector** in Azure Marketplace. Then select **Create**.

   ![Screenshot that shows the Create button in Azure Marketplace.](media/itsmc-overview/add-itsmc-solution.png)

1. In the **Azure Log Analytics Workspace** section, select the Log Analytics workspace where you want to install ITSMC.
   > [!NOTE]
   > You can install ITSMC in Log Analytics workspaces only in the following regions: East US, West US 2, South Central US, West Central US, US Gov Arizona, US Gov Virginia, Canada Central, West Europe, South UK, Southeast Asia, Japan East, Central India, and Australia Southeast.

1. In the **Azure Log Analytics Workspace** section, select the resource group where you want to create the ITSMC resource.

   ![Screenshot that shows the Azure Log Analytics Workspace section.](media/itsmc-overview/itsmc-solution-workspace.png)

   > [!NOTE]
   > As part of the ongoing transition from Microsoft Operations Management Suite to Azure Monitor, Operations Management workspaces are now called *Log Analytics workspaces*.

1. Select **OK**.

When the ITSMC resource is deployed, a notification appears in the upper-right corner of the screen.

## Create an ITSM connection

After you've installed ITSMC, create an ITSM connection.

After you've prepped your ITSM tool, follow these steps to create a connection.

1. [Configure ServiceNow](./itsmc-connections-servicenow.md) to allow the connection from ITSMC.
1. In **All resources**, look for **ServiceDesk(*your workspace name*)**.

   ![Screenshot that shows recent resources in the Azure portal.](media/itsmc-definition/create-new-connection-from-resource.png)

1. Under **Workspace Data Sources** on the left pane, select **ITSM Connections**.

   ![Screenshot that shows the ITSM Connections menu item.](media/itsmc-overview/add-new-itsm-connection.png)

1. Select **Add Connection**.

1. Specify the connection settings for the ITSM product that you're using:

    - [ServiceNow](./itsmc-connections-servicenow.md)
    - [System Center Service Manager](./itsmc-connections.md)

   > [!NOTE]
   > By default, ITSMC refreshes the connection's configuration data once every 24 hours. To refresh your connection's data instantly to reflect any edits or template updates that you make, select the **Sync** button on your connection's pane.
   >
   > ![Screenshot that shows the Sync button on the connection's pane.](media/itsmc-overview/itsmc-connections-refresh.png)

## Create ITSM work items from Azure alerts

After you create your ITSM connection, you can use ITSMC to create work items in your ITSM tool based on Azure alerts. To create the work items, you'll use the ITSM action in action groups.

Action groups provide a modular and reusable way to trigger actions for your Azure alerts. You can use action groups with metric alerts, activity log alerts, and Log Analytics alerts in the Azure portal.

> [!NOTE]
> After you create the ITSM connection, you must wait 30 minutes for the sync process to finish.

### Define a template

Certain work item types can use templates that you define in ServiceNow. When you use templates, you can define fields that will be automatically populated by using constant values defined in ServiceNow (not values from the payload). The templates are synced with Azure. You can define which template you want to use as a part of the definition of an action group. For information about how to create templates, see the [ServiceNow documentation](https://docs.servicenow.com/bundle/paris-platform-administration/page/administer/form-administration/task/t_CreateATemplateUsingTheTmplForm.html).

To create an action group:

1. In the Azure portal, select **Monitor** > **Alerts**.
1. On the menu at the top of the screen, select **Manage actions**.

    ![Screenshot that shows selecting Action groups.](media/itsmc-overview/action-groups-selection-big.png)

1. On the **Action groups** screen, select **+Create**.
   The **Create action group** screen appears.

1. Select the **Subscription** and **Resource group** where you want to create your action group. Enter values in **Action group name** and **Display name** for your action group. Then select **Next: Notifications**.

    ![Screenshot that shows the Create an action group screen.](media/itsmc-overview/action-groups-details.png)

1. On the **Notifications** tab, select **Next: Actions**.
1. On the **Actions** tab, select **ITSM** in the **Action type** list. For **Name**, provide a name for the action. Then select the pen button that represents **Edit details**.

    ![Screenshot that shows selections for creating an action group.](media/itsmc-definition/action-group-pen.png)

1. In the **Subscription** list, select the subscription that contains your Log Analytics workspace. In the **Connection** list, select your ITSM Connector name. It will be followed by your workspace name. An example is *MyITSMConnector(MyWorkspace)*.

1. Select a **Work Item** type.

1. In the last section of the interface for creating an ITSM action group, you can define how many work items will be created for each alert.

   > [!NOTE]
   > This section is relevant only for log search alerts. For all other alert types, you'll create one work item per alert.

   * **Incident** or **Alert**: If you select one of these options from the **Work Item** dropdown list, you can create individual work items for each configuration item.
    
     ![Screenshot that shows the I T S M Ticket area with Incident selected as a work item.](media/itsmc-overview/itsm-action-configuration.png)
    
     * **Create individual work items for each Configuration Item**: If you select this checkbox, every configuration item in every alert will create a new work item. Because several alerts will occur for the same affected configuration items, there will be more than one work item for each configuration item.

       For example, an alert that has three configuration items will create three work items. An alert that has one configuration item will create one work item.
        
     * **Create individual work items for each Configuration Item**: If you clear this checkbox, ITSMC will create a single work item for each alert rule and append to it all affected configuration items. A new work item will be created if the previous one is closed.

       >[!NOTE]
       > In this case, some of the fired alerts won't generate new work items in the ITSM tool.

       For example, an alert that has three configuration items will create one work item. If an alert for the same alert rule as the previous example has one configuration item, that configuration item will be attached to the list of affected configuration items in the created work item. An alert for a different alert rule that has one configuration item will create one work item.

   * **Event**: If you select this option in the **Work Item** dropdown list, you can create individual work items for each log entry or for each configuration item.
    
     ![Screenshot that shows the I T S M Ticket area with Event selected as a work item.](media/itsmc-overview/itsm-action-configuration-event.png)

     * **Create individual work items for each Log Entry (Configuration item field is not filled. Can result in large number of work items.)**: If you select this option, a work item will be created for each row in the search results of the log search alert query. The description property in the payload of the work item will contain the row from the search results.
      
     * **Create individual work items for each Configuration Item**: If you select this option, every configuration item in every alert will create a new work item. Each configuration item can have more than one work item in the ITSM system. This option is the same as selecting the checkbox that appears after you select **Incident** as the work item type.
1. As a part of the action definition, you can define predefined fields that will contain constant values as a part of the payload. According to the work item type, three options can be used as a part of the payload:
    * **None**: Use a regular payload to ServiceNow without any extra predefined fields and values.
    * **Use default fields**: Use a set of fields and values that will be sent automatically as a part of the payload to ServiceNow. Those fields aren't flexible, and the values are defined in ServiceNow lists.
    * **Use saved templates from ServiceNow**: Use a predefined set of fields and values that were defined as a part of a template definition in ServiceNow. If you already defined the template in ServiceNow, you can use it from the **Template** list. Otherwise, you can define it in ServiceNow. For more information, see the preceding section, [Define a template](#define-a-template).

1. Select **OK**.

When you create or edit an Azure alert rule, use an action group, which has an ITSM action. When the alert triggers, the work item is created or updated in the ITSM tool.

> [!NOTE]
> For information about the pricing of the ITSM action, see the [pricing page](https://azure.microsoft.com/pricing/details/monitor/) for action groups.
>
> The short description field in the alert rule definition is limited to 40 characters when you send it by using the ITSM action.

## Next steps

[Troubleshoot problems in ITSMC](./itsmc-resync-servicenow.md)