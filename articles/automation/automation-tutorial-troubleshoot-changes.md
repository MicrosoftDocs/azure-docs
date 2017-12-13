---
title: Troubleshoot changes in your environment | Microsoft Docs 
description: Use Change Tracking to troubleshoot changes across the machines in your environment.
services: automation
keywords: change, tracking, automation
author: jennyhunter-msft
ms.author: jehunte
ms.date: 10/26/2017
ms.topic: hero-article
ms.custom: mvc
manager: carmonm
---

# Troubleshoot changes in your environment

By enabling Change tracking, you can track changes to software, files, Linux daemons, Windows Services, and Windows Registry keys on your computers. 
Identifying these configuration changes can help you pinpoint operational issues across your environment.

## Before you begin
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).

You also need to [create an Automation account](https://docs.microsoft.com/en-us/azure/automation/automation-offering-get-started) and [enable Change tracking](../automation/automation-quickstart-change.md) before you begin.


## Sign in to Azure
Sign in to the [Azure portal](https://portal.azure.com/).

## View Change tracking on an Automation account
1. In the left pane of the Azure portal, select **Automation accounts**. 
If it is not visible in the left pane, click **All services** and search for it in the resulting view.
2. In the list, select an Automation account. 
3. In the left pane of the Automation account, select **Change tracking**.

## Using the Change tracking views
The Change tracking experience is made up three main components: the swimlane visualization, the change list, and the change filters.
The three components work together to create a robust and interactive exploration experience.

![Creating an alert on OMS classic portal](./media/automation-tutorial-troubleshoot-changes/change-view.png)

### Swimlane visualization
On the **Change tracking** page, there is a large visualization consisting of multiple bar graphs and a line graph at the top. 
The swimlane visualization shows changes that have occurred over time. 
After you have added an Activity Log connection, the line graph at the top displays Azure Activity Log events. 
Each row of bar graphs represents a different trackable Change type. 
These types are Linux daemons, files, Windows Registry keys, software, and Windows services.

>[!NOTE] 
> To add an Activity Log connection, click the **Manage Activity Log Connection** button at the top of the page.
>
>


### Change list
Below the swimlane visualization, there are two tabs (**Changes** and **Events**) and a table. 
While on the **Changes** tab, the table displays the details for the changes shown in the visualization in descending order of time that the change occurred (most recent first).
While on the **Events** tab, the table displays the connected Activity Log events and their corresponding details with the most recent first. 

On both tabs, you can click on a row to drilldown and view additional details about the record.

### Change filters
There are two dropdowns on the top of the page that allow you to filter the data shown in the swimlane visualization and the change list. 
The **Change types** dropdown lets you filter which Change types are displayed in your results. 
The time range dropdown lets you filter the results to a specific time window.



## Using Change tracking in Log Analytics

Change tracking generates log data that is sent to Log Analytics. 
To search the logs by running queries, select **Log Analytics** at the top of the **Change tracking** window. 
Change tracking data is stored under the type **ConfigurationChange**. 
The following sample Log Analytics query returns all the Windows Services that have been stopped.

```
ConfigurationChange
| where ConfigChangeType == "WindowsServices" and SvcState == "Stopped"
```

To learn more about running and searching log files in Log Analytics, see [Azure Log Analytics](https://docs.loganalytics.io/index).

### Alerting on changes
Log Analytics provides the capability to alert based on a query. 

For the process of creating alert rules, see the following articles:

* Create alert rules using [OMS portal](../log-analytics/log-analytics-alerts-creating.md)
* Create alert rules using [Resource Manager template](../operations-management-suite/operations-management-suite-solutions-resources-searches-alerts.md)
* Create alert rules using [REST API](../log-analytics/log-analytics-api-alerts.md)


In the following example image, an alert is being created for services that are stopped and are of the startup type "Manual". 
On the alert page, you can configure what happens when an alert is triggered, such as an email notification, webhook, Azure Automation runbook, or an ITSM connection.

   ![Creating an alert on OMS classic portal](./media/automation-tutorial-troubleshoot-changes/alert.png)

To learn more about creating alerts based on Log Analytics queries, see [Understanding Alerts in Log Analytics](https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-alerts).


### Changes for a single machine
To see the changes for a single machine, you can access Change Tracking from the Azure VM resource page or use Log Analytics to filter down to the corresponding machine. 
The following sample Log Analytics query returns the list of software changes for a machine named `ContosoVM`.

```
ConfigurationChange
| where ConfigChangeType == "Software" 
| where Computer =="ContosoVM"
```

## Configure Change tracking
To choose which files and Registry keys to collect and track, select **Edit settings** at the top of the **Change tracking** page.

> [!NOTE]
> Inventory and Change tracking use the same collection settings, and settings are configured on a workspace level.
>
>

In the **Workspace Configuration** window, add the Windows Registry keys, Windows files, or Linux files to be tracked, as outlined in the next three sections.

### Add a Windows Registry key

1. On the **Windows Registry** tab, select **Add**.  
    The **Add Windows Registry for Change Tracking** window opens.

   ![Change Tracking add registry](./media/automation-vm-change-tracking/change-add-registry.png)

2. Under **Enabled**, select **True**.
3. In the **Item Name** box, enter a friendly name.
4. (Optional) In the **Group** box, enter a group name.
5. In the **Windows Registry Key** box, enter the name of the registry key you want to track.
6. Select **Save**.

### Add a Windows file

1. On the **Windows Files** tab, select **Add**.  
    The **Add Windows File for Change Tracking** window opens.

   ![Change Tracking add Windows file](./media/automation-vm-change-tracking/change-add-win-file.png)

2. Under **Enabled**, select **True**.
3. In the **Item Name** box, enter a friendly name.
4. (Optional) In the **Group** box, enter a group name.
5. In the **Enter Path** box, enter the full path and file name of the file you want to track.
6. Select **Save**.

### Add a Linux file

1. On the **Linux Files** tab, select **Add**.  
    The **Add Linux File for Change Tracking** window opens.

   ![Change Tracking add Linux file](./media/automation-vm-change-tracking/change-add-linux-file.png)

2. Under **Enabled**, select **True**.
3. In the **Item Name** box, enter a friendly name.
4. (Optional) In the **Group** box, enter a group name.
5. In the **Enter Path** box, enter the full path and file name of the file you want to track.
6. In the **Path Type** box, select either **File** or **Directory**.
7. Under **Recursion**, to track changes for the specified path and all files and paths under it, select **On**. To track only the selected path or file, select **Off**.
8. Under **Use Sudo**, to track files that require the `sudo` command to access, select **On**. Otherwise, select **Off**.
9. Select **Save**.


## Next steps

* To learn about Change tracking and how to configure your collection settings, see [Track changes in your environment with the Change tracking solution](https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-change-tracking).
* To learn about enabling Inventory for your Azure virtual machines, see [Enable Inventory](../automation/automation-vm-inventory.md).
* To learn about managing Windows and package updates on your virtual machines, see [The Update Management solution in OMS](../operations-management-suite/oms-solution-update-management.md).