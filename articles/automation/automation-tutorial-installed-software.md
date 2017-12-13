---
title: Discover what software is installed on your machines | Microsoft Docs 
description: Use Inventory to discover what sofwared is installed on the machines across your environment.
services: automation
keywords: inventory, automation, change, tracking
author: jennyhunter-msft
ms.author: jehunte
ms.date: 11/13/2017
ms.topic: hero-article
ms.service: automation
ms.custom: mvc
manager: carmonm
---

# Discover what software is installed on your Azure and non-Azure machines

With Inventory, you can collect and view inventory for software, files, Linux daemons, Windows Services, and Windows Registry keys on your computers. 
Tracking the configurations of your machines can help you pinpoint operational issues across your environment and better understand the state of your machines.
This article delves into how to discover what software is installed on what machines in your environment.

## Before you begin
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).

You also need to [create an Automation account](https://docs.microsoft.com/en-us/azure/automation/automation-offering-get-started) and [enable Inventory](../automation/automation-quickstart-inventory.md) before you begin.


## Sign in to Azure
Sign in to the [Azure portal](https://portal.azure.com/).

## View inventory on an Automation account
1. In the left pane of the Azure portal, select **Automation accounts**. 
If it is not visible in the left pane, click **All services** and search for it in the resulting view.
2. In the list, select an Automation account. 
3. In the left pane of the Automation account, select **Inventory**.

On the **Inventory** page, click on the **Software** tab.

## Overview of the Software tab
On the **Software** tab, there is a grid containing software record, grouped by software name and version. 
The high-level details for each software record are viewable in the grid, 
including the software name, version, publisher, last refreshed time (the most recent refresh time reported by a machine in the group), and machines (the count of machines with that software).

 ![Software inventory](./media/automation-tutorial-sw-installed/inventory-software.png)

Click on a row to view the properties of the software record and the names of the machines with that software. 


### Search functionality
To look for a specific software or group of software, you can search in the text box directly above the software list. 
The filter allows you to search based off the software name, version, or publisher.

For instance, searching for "Contoso" returns all software with a name, publisher, or version containing "Contoso".


## Using Inventory in Log Analytics

Inventory generates log data that is sent to Log Analytics. 
To search the logs by running queries, select **Log Analytics** at the top of the **Inventory** window. 
Inventory data is stored under the type **ConfigurationData**. 
The following sample Log Analytics query returns the Publishers that contain "Ubuntu" and the number of Software records (grouped by SoftwareName and Computer) for each Publisher

```
ConfigurationData
| summarize arg_max(TimeGenerated, *) by SoftwareName, Computer
| where ConfigDataType == "Software"
| search Publisher:"Ubuntu"
| summarize count() by Publisher
```

To learn more about running and searching log files in Log Analytics, see [Azure Log Analytics](https://docs.loganalytics.io/index).

### Single machine inventory
To see the software inventory for a single machine, you can access Inventory from the Azure VM resource page or use Log Analytics to filter down to the corresponding machine. 
The following example Log Analytics query returns the list of software for a machine named ContosoVM.

```
ConfigurationData
| where ConfigDataType == "Software" 
| summarize arg_max(TimeGenerated, *) by SoftwareName, CurrentVersion
| where Computer =="ContosoVM"
| render table
```


## Next steps

* To learn about enabling Inventory for your Azure virtual machines, see [Manage an Azure virtual machine with inventory collection](../automation/automation-vm-inventory.md).
* To learn about managing changes on your machines, see [Track software changes in your environment with the Change Tracking solution](../log-analytics/log-analytics-change-tracking.md).
* To learn about managing Windows and package updates on your machines, see [The Update Management solution in OMS](../operations-management-suite/oms-solution-update-management.md).