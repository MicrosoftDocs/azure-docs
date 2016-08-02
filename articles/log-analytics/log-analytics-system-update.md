<properties
	pageTitle="System Update Assessment solution in Log Analytics | Microsoft Azure"
	description="You can use the System Updates solution in Log Analytics to help you apply missing updates to servers in your infrastructure."
	services="log-analytics"
	documentationCenter=""
	authors="bandersmsft"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="log-analytics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/26/2016"
	ms.author="banders"/>

# System Update Assessment solution in Log Analytics


You can use the System Updates solution in Log Analytics to help you apply missing updates to servers in your infrastructure. After you install the solution, you can view the updates that are missing from your monitored servers by using the **System Update Assessment** tile on the **Overview** page in OMS.

If missing updates are found, details are shown on the **Updates** dashboard. You can use the **Updates** dashboard to work with missing updates and develop a plan to apply them to the servers that need them.

## Installing and configuring the solution
Use the following information to install and configure the solution.

- Add the System Update Assessment solution to your OMS workspace using the process described in [Add Log Analytics solutions from the Solutions Gallery](log-analytics-add-solutions.md).  There is no further configuration required.

## System Update data collection details

System Update Assessment collects metadata and state data using the agents that you have enabled.

The following table shows data collection methods and other details about how data is collected for System Update Assessment.

| platform | Direct Agent | SCOM agent | Azure Storage | SCOM required? | SCOM agent data sent via management group | collection frequency |
|---|---|---|---|---|---|---|
|Windows|![Yes](./media/log-analytics-system-update/oms-bullet-green.png)|![Yes](./media/log-analytics-system-update/oms-bullet-green.png)|![No](./media/log-analytics-system-update/oms-bullet-red.png)|            ![No](./media/log-analytics-system-update/oms-bullet-red.png)|![Yes](./media/log-analytics-system-update/oms-bullet-green.png)| At least 2 times per day and 15 minutes after installing an update|

The following table shows examples of data types collected by System Update Assessment:

|**Data type**|**Fields**|
|---|---|
|Metadata|BaseManagedEntityId, ObjectStatus, OrganizationalUnit, ActiveDirectoryObjectSid, PhysicalProcessors, NetworkName, IPAddress, ForestDNSName, NetbiosComputerName, VirtualMachineName, LastInventoryDate, HostServerNameIsVirtualMachine, IP Address, NetbiosDomainName, LogicalProcessors, DNSName, DisplayName, DomainDnsName, ActiveDirectorySite, PrincipalName, OffsetInMinuteFromGreenwichTime|
|State|StateChangeEventId, StateId, NewHealthState, OldHealthState, Context, TimeGenerated, TimeAdded, StateId2, BaseManagedEntityId, MonitorId, HealthState, LastModified, LastGreenAlertGenerated, DatabaseTimeModified|


### To work with updates

1. On the **Overview** page, click the **System Update Assessment** tile.  
    ![image of the Overview page](./media/log-analytics-system-update/oms-updates01.png)
2. On the **Updates** dashboard, view the update categories.  
    ![image of the Updates page](./media/log-analytics-system-update/oms-updates02.png)
3. Scroll to the right of the page to view the **Type of Updates Missing** blade and then click **Security Updates**.  
    ![image of the Updates page](./media/log-analytics-system-update/oms-updates03.png)
4. On the Search page, a list of security updates that were found missing from servers in your infrastructure is shown. Click a Knowledge Base article ID (KBID) to view more information about the update that is missing. In this example, *KBID 3032323*.  
    ![image of the Updates page](./media/log-analytics-system-update/oms-updates04.png)
5. Your web browser opens the Knowledge Base article that describes the update.  
    ![image of the knowledge base article ](./media/log-analytics-system-update/oms-updates05.png)
6. Using the using the information you've found, you can create a plan to apply missing updates.

## Next steps

- [Search logs](log-analytics-log-searches.md) to view detailed system update data.
