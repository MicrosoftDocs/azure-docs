---
title: IT Service Management Connector in Log Analytics
description: This article provides an overview of IT Service Management Connector (ITSMC) and information about using it to monitor and manage ITSM work items in Log Analytics and resolve problems quickly.
ms.subservice: logs
ms.topic: conceptual
author: nolavime
ms.author: v-jysur
ms.date: 05/24/2018
ms.custom: references_regions

---

# Connect Azure to ITSM tools by using IT Service Management Connector

:::image type="icon" source="media/itsmc-overview/itsmc-symbol.png":::

IT Service Management Connector (ITSMC) allows you to connect Azure to a supported IT Service Management (ITSM) product or service.

Azure services like Azure Log Analytics and Azure Monitor provide tools to detect, analyze, and troubleshoot problems with your Azure and non-Azure resources. But the work items related to an issue typically reside in an ITSM product or service. ITSM connector provides a bi-directional connection between Azure and ITSM tools to help you resolve issues faster.

ITSMC supports connections with the following ITSM tools:

-	ServiceNow
-	System Center Service Manager
-	Provance
-	Cherwell

With ITSMC, you can:

-  Create work items in your ITSM tool, based on your Azure alerts (metric alerts, activity log alerts, and Log Analytics alerts).
-  Optionally, you can sync your incident and change request data from your ITSM tool to an Azure Log Analytics workspace.

For information about legal terms and the privacy policy, see [Microsoft Privacy Statement](https://go.microsoft.com/fwLink/?LinkID=522330&clcid=0x9).

You can start using ITSMC by completing the following steps:

1.	[Add ITSMC.](#add-the-it-service-management-connector-solution)
2.	[Create an ITSM connection.](#create-an-itsm-connection)
3.	[Use the connection.](#using-the-solution)


##  Add IT Service Management Connector

Before you can create a connection, you need to add ITSMC.

1. In the Azure portal, select **Create a resource**:

   ![Screenshot that shows the Create a resource menu item.](media/itsmc-overview/azure-add-new-resource.png)

2. Search for **IT Service Management Connector** in Azure Marketplace. Select **Create**:

   ![Screenshot that shows the Create button in Azure Marketplace.](media/itsmc-overview/add-itsmc-solution.png)

3. In the **OMS Workspace** section, select the Azure Log Analytics workspace where you want to install the solution.
   >[!NOTE]
   > * As part of the ongoing transition from Microsoft Operations Management Suite (OMS) to Azure Monitor, OMS workspaces are now referred to as *Log Analytics workspaces*.
   > * ITSMC can be installed only in Log Analytics workspaces in the following regions: East US, West US 2, South Central US, West Central US, Fairfax, Canada Central, West Europe, UK South, Southeast Asia, Japan East, Central India, and Australia Southeast.

4. In the **Log Analytics workspace** section, select the resource group where you want to create the solution resource:

   ![Screenshot that shows the Log Analytics workspace section.](media/itsmc-overview/itsmc-solution-workspace.png)
   >[!NOTE]
   >As part of the ongoing transition from Microsoft Operations Management Suite (OMS) to Azure Monitor, OMS workspaces are now referred to as *Log Analytics workspaces*.

5. Select **OK**.

When the solution resource is deployed, a notification appears at the upper right corner of the window.


## Create an ITSM  connection

After you've installed the solution, you can create a connection.

To create a connection, you'll need to prep your ITSM tool to allow the connection from ITSMC.  

Based on the ITSM product you're connecting to, select one of the following links for instructions:

- [System Center Service Manager](./itsmc-connections.md#connect-system-center-service-manager-to-it-service-management-connector-in-azure)
- [ServiceNow](./itsmc-connections.md#connect-servicenow-to-it-service-management-connector-in-azure)
- [Provance](./itsmc-connections.md#connect-provance-to-it-service-management-connector-in-azure)  
- [Cherwell](./itsmc-connections.md#connect-cherwell-to-it-service-management-connector-in-azure)

After you've prepped your ITSM tools, complete these steps to create a connection:

1. In **All resources**, look for **ServiceDesk(*your workspace name*)**:

   ![Screenshot that shows recent resources in the Azure portal.](media/itsmc-overview/itsm-connections.png)
1. Under **Workspace Data Sources** in the left pane, select **ITSM Connections**:
   ![Screenshot that shows the ITSM Connections menu item.](media/itsmc-overview/add-new-itsm-connection.png)
   This page displays the list of connections.
3. Select **Add Connection**.

4. Specify the connection settings as described in [Configuring the ITSMC connection with your ITSM products/services](./itsmc-connections.md).

   > [!NOTE]
   >
   > By default, ITSMC refreshes the connection's configuration data once every 24 hours. To refresh your connection's data instantly to reflect any edits or template updates that you make, select the **Sync** button on your connection's blade:
   >
   > ![Screenshot that shows the Sync button on the connection blade.](media/itsmc-overview/itsmc-connections-refresh.png)


## Use ITSMC
   By using ITSMC, you can create work items from Azure alerts, Log Analytics alerts, and Log Analytics log records.

## Template definitions
   There are work item types that can use templates that are defined by the ITSM tool.
   By using templates, you can define fields that will be automatically populated according to fixed values that are defined as part of the action group. You define templates in the ITSM tool.
      
## Create ITSM work items from Azure alerts

After you create your ITSM connection, you can create work items in your ITSM tool based on Azure alerts. To create the work items, you'll use the ITSM action in action groups.

Action groups provide a modular and reusable way to trigger actions for your Azure alerts. You can use action groups with metric alerts, activity log alerts, and Azure Log Analytics alerts in the Azure portal.

> [!NOTE]
> After you create the ITSM connection, you need to wait for 30 minutes for the sync process to finish.
> 

Use the following procedure to create work items:

1. In the Azure portal, select  **Alerts**.
2. In the menu at the top of the screen, select **Manage actions**:

    ![Screenshot that shows the Manage actions menu item.](media/itsmc-overview/action-groups-selection-big.png)

   The **Create action group** window appears.

3. Select the **Subscription** and **Resource group** where you want to create your action group. Provide an **Action group name** and **Display name** for your action group. Select **Next: Notifications**.

    ![Screenshot that shows the Create action group window.](media/itsmc-overview/action-groups-details.png)

4. In the notification list, select **Next: Actions**.
5. In the actions list, select **ITSM** in the **Action Type** list. Provide a **Name** for the action. Select the pen button that represents **Edit details**.
6. In the **Subscription** list, select the subscription in which your Log Analytics workspace is located. In the **Connection** list, select your ITSM connector name. It will be followed by your workspace name. For example, MyITSMMConnector(MyWorkspace).

7. Select a **Work Item** type.

8. If you want to fill out-of-the-box fields with fixed values, select **Use Custom Template**. Otherwise, choose an existing [template](https://docs.microsoft.com/azure/azure-monitor/platform/itsmc-overview#template-definitions) in the **Template** list and enter the fixed values in the template fields.

9. If you select **Create individual work items for each Configuration Item**, every configuration item will have its own work item. There will be one work item per configuration item. It will be updated according to the alerts that will be created.

   If you clear  the **Create individual work items for each Configuration Item** check box, every alert will create a new work item. There can be more than one alert per configuration item.

   ![Screenshot that shows the ITSM Ticket window.](media/itsmc-overview/itsm-action-configuration.png)

10. Select **OK**.

When creating/editing an Azure alert rule, use an Action group, which has an ITSM Action. When the alert triggers, work item is created/updated in the ITSM tool.

> [!NOTE]
>
> For information on pricing of ITSM Action, see the [pricing page](https://azure.microsoft.com/pricing/details/monitor/) for Action Groups.

> [!NOTE]
>
> Short description field in the alert rule definition is limited to 40 characters when it is sent using ITSM action.


## Visualize and analyze the incident and change request data

Based on your configuration when setting up a connection, ITSM connector can sync up to 120 days of Incident and Change request data. The log record schema for this data is provided in the [next section](#additional-information).

The incident and change request data can be visualized using the ITSM Connector dashboard in the solution.

![Screenshot that shows the ITSM Connector dashboard.](media/itsmc-overview/itsmc-overview-sample-log-analytics.png)

The dashboard also provides information on connector status which can be used as a starting point to analyze any issues with the connections.

You can also visualize the incidents synced against the impacted computers, within the Service Map solution.

Service Map automatically discovers the application components on Windows and Linux systems and maps the communication between services. It allows you to view your servers as you think of them – as interconnected systems that deliver critical services. Service Map shows connections between servers, processes, and ports across any TCP-connected architecture with no configuration required other than installation of an agent. [Learn more](../insights/service-map.md).

If you are using the Service Map solution, you can view the service desk items created in the ITSM solutions as shown in the following example:

![Log Analytics screen](media/itsmc-overview/itsmc-overview-integrated-solutions.png)

More information: [Service Map](../insights/service-map.md)


## Additional information

### Data synced from ITSM product
Incidents and change requests are synced from your ITSM product to your Log Analytics workspace based on the connection's configuration.

The following information shows examples of data gathered by ITSMC:

> [!NOTE]
>
> Depending on the work item type imported into Log Analytics, **ServiceDesk_CL** contains the following fields:

**Work item:** **Incidents**  
ServiceDeskWorkItemType_s="Incident"

**Fields**

- ServiceDeskConnectionName
- Service Desk ID
- State
- Urgency
- Impact
- Priority
- Escalation
- Created By
- Resolved By
- Closed By
- Source
- Assigned To
- Category
- Title
- Description
- Created Date
- Closed Date
- Resolved Date
- Last Modified Date
- Computer


**Work item:** **Change Requests**

ServiceDeskWorkItemType_s="ChangeRequest"

**Fields**
- ServiceDeskConnectionName
- Service Desk ID
- Created By
- Closed By
- Source
- Assigned To
- Title
- Type
- Category
- State
- Escalation
- Conflict Status
- Urgency
- Priority
- Risk
- Impact
- Assigned To
- Created Date
- Closed Date
- Last Modified Date
- Requested Date
- Planned Start Date
- Planned End Date
- Work Start Date
- Work End Date
- Description
- Computer

## Output data for a ServiceNow incident

| Log Analytics field | ServiceNow field |
|:--- |:--- |
| ServiceDeskId_s| Number |
| IncidentState_s | State |
| Urgency_s |Urgency |
| Impact_s |Impact|
| Priority_s | Priority |
| CreatedBy_s | Opened by |
| ResolvedBy_s | Resolved by|
| ClosedBy_s  | Closed by |
| Source_s| Contact type |
| AssignedTo_s | Assigned to  |
| Category_s | Category |
| Title_s|  Short description |
| Description_s|  Notes |
| CreatedDate_t|  Opened |
| ClosedDate_t| closed|
| ResolvedDate_t|Resolved|
| Computer  | Configuration item |

## Output data for a ServiceNow change request

| Log Analytics | ServiceNow field |
|:--- |:--- |
| ServiceDeskId_s| Number |
| CreatedBy_s | Requested by |
| ClosedBy_s | Closed by |
| AssignedTo_s | Assigned to  |
| Title_s|  Short description |
| Type_s|  Type |
| Category_s|  Category |
| CRState_s|  State|
| Urgency_s|  Urgency |
| Priority_s| Priority|
| Risk_s| Risk|
| Impact_s| Impact|
| RequestedDate_t  | Requested by date |
| ClosedDate_t | Closed date |
| PlannedStartDate_t  | 	Planned start date |
| PlannedEndDate_t  | 	Planned end date |
| WorkStartDate_t  | Actual start date |
| WorkEndDate_t | Actual end date|
| Description_s | Description |
| Computer  | Configuration Item |


## Troubleshoot ITSM connections
1. If connection fails from connected source's UI with an **Error in saving connection** message, take the following steps:
   - For ServiceNow, Cherwell and Provance connections,  
   - ensure you correctly entered  the username, password, client ID, and client secret  for each of the connections.  
   - check if you have sufficient privileges in the corresponding ITSM product to make the connection.  
   - For Service Manager connections,  
   - ensure that the Web app is successfully deployed and hybrid connection is created. To verify the connection is successfully established with the on premises Service Manager machine, visit the  Web app URL as detailed in the documentation for making the [hybrid connection](./itsmc-connections.md#configure-the-hybrid-connection).  

2. If data from ServiceNow is not getting synced to Log Analytics, ensure that the ServiceNow instance is not sleeping. ServiceNow Dev Instances sometimes go to sleep when idle for a long period. Else, report the issue.
3. If Log Analytics alerts fire but work items are not created in ITSM product or configuration items are not created/linked to work items or for any other generic information, look in the following places:
   -  ITSMC: The solution shows a summary of connections/work items/computers etc. Click the tile showing **Connector Status**, which takes you to **Log Search**  with the relevant query. Look at the log records with LogType_S as ERROR for more information.
   - **Log Search** page: view the errors/related information directly using the query `*`ServiceDeskLog_CL`*`.

## Troubleshoot Service Manager Web App deployment
1.	In case of any issues with web app deployment, ensure you have sufficient permissions in the subscription mentioned to create/deploy resources.
2.	If you get an **"Object reference not set to instance of an object"** error when you run the [script](itsmc-service-manager-script.md), ensure that you entered valid values  under **User Configuration** section.
3.	If you fail to create service bus relay namespace, ensure that the required resource provider is registered in the subscription. If not registered, manually create service bus relay namespace from the Azure portal. You can also create it while [creating the hybrid connection](./itsmc-connections.md#configure-the-hybrid-connection) from the Azure portal.


## Contact us

For any queries or feedback on the IT Service Management Connector, contact us at [omsitsmfeedback@microsoft.com](mailto:omsitsmfeedback@microsoft.com).

## Next steps
[Add ITSM products/services to IT Service Management Connector](./itsmc-connections.md).

