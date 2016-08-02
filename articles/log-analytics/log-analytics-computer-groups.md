<properties
	pageTitle="Computer groups in Log Analytics log searches | Microsoft Azure"
	description="Computer groups in Log Analytics allow you to scope log searches to a particular set of computers.  This article describes the different methods you can use to create computer groups and how to use them in a log search."
	services="log-analytics"
	documentationCenter=""
	authors="bwren"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="log-analytics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/01/2016"
	ms.author="bwren"/>

# Computer groups in Log Analytics log searches
Computer groups in Log Analytics allow you to scope [log searches](log-analytics-log-searches.md) to a particular set of computers.  Each group is populated with computers either using a query that you define or by importing groups from different sources.  When the group is included in a log search, the results are limited to records that match the computers in the group.

## Creating a computer group
You can create a computer group in Log Analytics using any of the methods in the following table.  Details on each method are provided in the sections below. 

| Method | Description |
|:---|:---|
| Log search       | Create a log search that returns a list of computers and save the results as a computer group. |
| Log Search API   | Use the Log Search API to programmatically create a computer group based on the results of a log search. |
| Active Directory | Automatically scan the group membership of any agent computers that are members of an Active Directory domain and create a group in Log Analytics for each security group.
| WSUS              | Automatically scan WSUS servers or clients for targeting groups and create a group in Log Analytics for each. |


### Log search

Computer groups created from a Log Search will contain all of the computers returned by a search query that you define.  This query is run every time the computer group is used so that any changes since the group was created will be reflected.

Use the following procedure to create a computer group from a log search.

1. [Create a log search](log-analytics-log-searches.md) that returns a list of computers.  The search must return a distinct set of computers by using something like **Distinct Computer** or **measure count() by Computer** in the query.  
2. Click the **Save** button at the top of the screen.
3. Select **Yes** to **Save this query as a computer group:**.
4. Type in a **Name** and a **Category** for the group.  If a search with the same name and category already exists, then you will be prompted to overwrite it.  You can have multiple searches with the same name in different categories. 

Following are example searches that you can save as a computer group.

	Computer="Computer1" OR Computer="Computer2" | distinct Computer 
	Computer=*srv* | measure count() by Computer

### Log search API

Computer groups created with the Log Search API are the same as searches created with a Log Search.

For details on creating a computer group using the Log Search API see [Computer Groups in Log Analytics log search REST API](log-analytics-log-search-api.md#computer-groups).

### Active Directory

When you configure Log Analytics to import Active Directory group memberships, it will analyze the group membership of any domain joined computers with the OMS agent.  A computer group is created in Log Analytics for each security group in Active Directory, and each computer is added to the computer groups corresponding to the security groups they are members of.  This membership is continuously updated every 4 hours.  

You configure Log Analytics to import Active Directory security groups from the **Computer Groups** menu in Log Analytics **Settings**.  Select **Automation** and then **Import Active Directory group memberships from computers**.  There is no further configuration required.

![Computer groups from Active Directory](media/log-analytics-computer-groups/configure-activedirectory.png)

When groups have been imported, the menu will list the number of computers with group membership detected and the number of groups imported.  You can click on either of these links to return the **ComputerGroup** records with this information.

### Windows Server Update Service

When you configure Log Analytics to import WSUS group memberships, it will analyze the targeting group membership of any computers with the OMS agent.  If you are using client-side targeting, any computer that is connected to OMS and is part of any WSUS targeting groups will have its group membership imported to Log Analytics. If you are using server-side targeting, the OMS agent should be installed on the WSUS server in order for the group membership information to be imported to OMS.  This membership is continuously updated every 4 hours. 

You configure Log Analytics to import Active Directory security groups from the **Computer Groups** menu in Log Analytics **Settings**.  Select **Active Directory** and then **Import Active Directory group memberships from computers**.  There is no further configuration required.

![Computer groups from Active Directory](media/log-analytics-computer-groups/configure-wsus.png)

When groups have been imported, the menu will list the number of computers with group membership detected and the number of groups imported.  You can click on either of these links to return the **ComputerGroup** records with this information.

## Managing computer groups

You can view computer groups that were created from a log search or the Log Search API from the **Computer Groups** menu in Log Analytics **Settings**.  Click the **x** in the **Remove** column to delete the computer group.  Click the **View members** icon for a group to run the group's log search that returns its members. 

![Saved computer groups](media/log-analytics-computer-groups/configure-saved.png)

To modify the group, create a new group with the same **Category** and **Name** to overwrite the original group.

## Using a computer group in a log search
You use the following syntax to refer to a computer group in a log search.  Specifying the **Category** is optional and only required if you have computer groups with the same name in different categories. 

	$ComputerGroups[Category: Name]

When a search is run, the members of any computer groups included in the search are first resolved.  If the group is based on a log search, then that search is run to return the members of the group before performing the top level log search.

Computer groups are typically used with the **IN** clause in the log search as in the following example.

	Type=UpdateSummary Computer IN $ComputerGroups[My Computer Group]

## Computer group records

A record is created in the OMS repository for each computer group membership created from Active Directory or WSUS.  These records have a type of **ComputerGroup** and have the properties in the following table.  Records are not created for computer groups based on log searches.

| Property | Description |
|:--|:--|
| Type                | *ComputerGroup* |
| SourceSystem        | *SourceSystem*  |
| Computer            | Name of the member computer. |
| Group               | Name of the group. |
| GroupFullName       | Full path to the group including the source and source name.
| GroupSource         | Source that group was collected from. <br><br>ActiveDirectory<br>WSUS<br>WSUSClientTargeting |
| GroupSourceName     | Name of the source that the groups was collected from.  For Active Directory, this is the domain name. |
| ManagementGroupName | Name of the management group for SCOM agents.  For other agents, this is AOI-\<workspace ID\> |
| TimeGenerated       | Date and time the computer group was created or updated. |



## Next steps

- Learn about [log searches](log-analytics-log-searches.md) to analyze the data collected from data sources and solutions.  