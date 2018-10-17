---
title: Computer groups in Azure Log Analytics log searches | Microsoft Docs
description: Computer groups in Log Analytics allow you to scope log searches to a particular set of computers.  This article describes the different methods you can use to create computer groups and how to use them in a log search.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''

ms.assetid: a28b9e8a-6761-4ead-aa61-c8451ca90125
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/03/2018
ms.author: bwren
ms.component: 
---

# Computer groups in Log Analytics log searches

Computer groups in Log Analytics allow you to scope [log searches](log-analytics-log-search-new.md) to a particular set of computers.  Each group is populated with computers either using a query that you define or by importing groups from different sources.  When the group is included in a log search, the results are limited to records that match the computers in the group.

## Creating a computer group
You can create a computer group in Log Analytics using any of the methods in the following table.  Details on each method are provided in the sections below. 

| Method | Description |
|:--- |:--- |
| Log search |Create a log search that returns a list of computers. |
| Log Search API |Use the Log Search API to programmatically create a computer group based on the results of a log search. |
| Active Directory |Automatically scan the group membership of any agent computers that are members of an Active Directory domain and create a group in Log Analytics for each security group. |
| Configuration Manager | Import collections from System Center Configuration Manager  and create a group in Log Analytics for each. |
| Windows Server Update Services |Automatically scan WSUS servers or clients for targeting groups and create a group in Log Analytics for each. |

### Log search
Computer groups created from a Log Search contain all of the computers returned by a query that you define.  This query is run every time the computer group is used so that any changes since the group was created is reflected.  

You can use any query for a computer group, but it must return a distinct set of computers by using `distinct Computer`.  Following is a typical example search that you could use for as a computer group.

    Heartbeat | where Computer contains "srv" | distinct Computer

The following table describes the properties that define a computer group.

| Property | Description |
|:---|:---|
| Display Name   | Name of the search  to display in the portal. |
| Category       | Category to organize the searches in the portal. |
| Query          | The query for the computer group. |
| Function alias | A unique alias used to identify the computer group in a query. |

Use the following procedure to create a computer group from a log search in the Azure portal.

2. Open **Log Search** and then click **Saved Searches** at the top of the screen.
3. Click **Add** and provide values for each property for the computer group.
4. Select **Save this query as a computer group** and click **OK**.



### Active Directory
When you configure Log Analytics to import Active Directory group memberships, it analyzes the group membership of any domain joined computers with the OMS agent.  A computer group is created in Log Analytics for each security group in Active Directory, and each computer is added to the computer groups corresponding to the security groups they are members of.  This membership is continuously updated every 4 hours.  

You configure Log Analytics to import Active Directory security groups from Log Analytics **Advanced settings** in the Azure portal.  Select **Computer Groups**, **Active Directory**, and then **Import Active Directory group memberships from computers**.  There is no further configuration required.

![Computer groups from Active Directory](media/log-analytics-computer-groups/configure-activedirectory.png)

When groups have been imported, the menu lists the number of computers with group membership detected and the number of groups imported.  You can click on either of these links to return the **ComputerGroup** records with this information.

### Windows Server Update Service
When you configure Log Analytics to import WSUS group memberships, it analyzes the targeting group membership of any computers with the OMS agent.  If you are using client-side targeting, any computer that is connected to Log Analytics and is part of any WSUS targeting groups has its group membership imported to Log Analytics. If you are using server-side targeting, the OMS agent should be installed on the WSUS server in order for the group membership information to be imported to Log Analytics.  This membership is continuously updated every 4 hours. 

You configure Log Analytics to import WSUS groups from Log Analytics **Advanced settings** in the Azure portal.  Select **Computer Groups**, **WSUS**, and then **Import WSUS group memberships**.  There is no further configuration required.

![Computer groups from WSUS](media/log-analytics-computer-groups/configure-wsus.png)

When groups have been imported, the menu lists the number of computers with group membership detected and the number of groups imported.  You can click on either of these links to return the **ComputerGroup** records with this information.

### System Center Configuration Manager
When you configure Log Analytics to import Configuration Manager collection memberships, it creates a computer group for each collection.  The collection membership information is retrieved every 3 hours to keep the  computer groups current. 

Before you can import Configuration Manager collections, you must [connect Configuration Manager to Log Analytics](log-analytics-sccm.md).  You can then configure the import from Log Analytics **Advanced settings** in the Azure portal.  Select **Computer Groups**, **SCCM**, and then **Import Configuration Manager collection memberships**.  There is no further configuration required.

![Computer groups from SCCM](media/log-analytics-computer-groups/configure-sccm.png)

When collections have been imported, the menu lists the number of computers with group membership detected and the number of groups imported.  You can click on either of these links to return the **ComputerGroup** records with this information.

## Managing computer groups
You can view computer groups that were created from a log search or the Log Search API from Log Analytics **Advanced settings** in the Azure portal.  Select **Computer Groups** and then **Saved Groups**.  

Click the **x** in the **Remove** column to delete the computer group.  Click the **View members** icon for a group to run the group's log search that returns its members.  You can't modify a computer group but instead must delete and then recreate it with the modified settings.

![Saved computer groups](media/log-analytics-computer-groups/configure-saved.png)


## Using a computer group in a log search
You use a Computer group created from a log search in a query by treating its alias as a function, typically with the following syntax:

  `Table | where Computer in (ComputerGroup)`

For example, you could use the following to return UpdateSummary records for only computers in a computer group called mycomputergroup.
 
  `UpdateSummary | where Computer in (mycomputergroup)`


Imported computer groups and their included computers are stored in the **ComputerGroup** table.  For example, the following query would return a list of computers in the Domain Computers group from Active Directory. 

  `ComputerGroup | where GroupSource == "ActiveDirectory" and Group == "Domain Computers" | distinct Computer`

The following query would return UpdateSummary records for only computers in Domain Computers.

  ```
  let ADComputers = ComputerGroup | where GroupSource == "ActiveDirectory" and Group == "Domain Computers" | distinct Computer;
  UpdateSummary | where Computer in (ADComputers)
  ```




## Computer group records
A record is created in the Log Analytics workspace for each computer group membership created from Active Directory or WSUS.  These records have a type of **ComputerGroup** and have the properties in the following table.  Records are not created for computer groups based on log searches.

| Property | Description |
|:--- |:--- |
| Type |*ComputerGroup* |
| SourceSystem |*SourceSystem* |
| Computer |Name of the member computer. |
| Group |Name of the group. |
| GroupFullName |Full path to the group including the source and source name. |
| GroupSource |Source that group was collected from. <br><br>ActiveDirectory<br>WSUS<br>WSUSClientTargeting |
| GroupSourceName |Name of the source that the group was collected from.  For Active Directory, this is the domain name. |
| ManagementGroupName |Name of the management group for SCOM agents.  For other agents, this is AOI-\<workspace ID\> |
| TimeGenerated |Date and time the computer group was created or updated. |

## Next steps
* Learn about [log searches](log-analytics-log-searches.md) to analyze the data collected from data sources and solutions.  

