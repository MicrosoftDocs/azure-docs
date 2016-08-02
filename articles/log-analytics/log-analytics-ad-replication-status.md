<properties
	pageTitle="Active Directory Replication Status solution in Log Analytics | Microsoft Azure"
	description="The Active Directory Replication Status solution pack regularly monitors your Active Directory environment for any replication failures and reports the results on your OMS dashboard."
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
	ms.date="06/01/2016"
	ms.author="banders"/>

# Active Directory Replication Status solution in Log Analytics

Active Directory is a key component of an enterprise IT environment. To ensure high availability and high performance, each domain controller has its own copy of the Active Directory database. Domain controllers replicate with each other in order to propagate changes across the enterprise. Failures in this replication process can cause a variety of problems across the enterprise.

The AD Replication Status solution pack regularly monitors your Active Directory environment for any replication failures and reports the results on your OMS dashboard.

## Installing and configuring the solution
Use the following information to install and configure the solution.

- Agents must be installed on domain controllers that are members of the domain to be evaluated, or on member servers configured to send AD replication data to OMS. To understand how to connect Windows computers to OMS, see [Connect Windows computers to Log Analytics](log-analytics-windows-agents.md). If your domain controller is already part of an existing System Center Operations Manager environment that you’d like to connect to OMS, see [Connect Operations Manager to Log Analytics](log-analytics-om-agents.md).
- Add the Active Directory Replication Status solution to your OMS workspace using the process described in [Add Log Analytics solutions from the Solutions Gallery](log-analytics-add-solutions.md).  There is no further configuration required.


## AD Replication Status data collection details

The following table shows data collection methods and other details about how data is collected for AD Replication Status.

| platform | Direct Agent | SCOM agent | Azure Storage | SCOM required? | SCOM agent data sent via management group | collection frequency |
|---|---|---|---|---|---|---|
|Windows|![Yes](./media/log-analytics-ad-replication-status/oms-bullet-green.png)|![Yes](./media/log-analytics-ad-replication-status/oms-bullet-green.png)|![No](./media/log-analytics-ad-replication-status/oms-bullet-red.png)|![No](./media/log-analytics-ad-replication-status/oms-bullet-red.png)|![Yes](./media/log-analytics-ad-replication-status/oms-bullet-green.png)| every 5 days|


## Optionally, enable a non-domain controller to send AD data to OMS
If you don’t want to connect any of your domain controllers directly to OMS, you can use any other OMS-connected computer in your domain to collect data for the AD Replication Status solution pack and have it send the data.

### To enable a non-domain controller to send AD data to OMS
1.	Verify that the computer is a member of the domain that you wish to monitor using the AD Replication Status solution.
2.	[Connect the Windows computer to OMS](log-analytics-windows-agents.md) or [connect it using your existing Operations Manager environment to OMS](log-analytics-om-agents.md), if it is not already connected.
3.	On that computer, set the following registry key:
    - Key: **HKLM\SOFTWARE\Microsoft\AzureOperationalInsights\Assessments_Targets**
    - Value: **ADReplication**

    >[AZURE.NOTE]These changes will not take effect until your restart the Microsoft Monitoring Agent service (HealthService.exe).

## Understanding replication errors
Once you have AD replication status data sent to OMS, you’ll see a tile similar to the following on the OMS dashboard indicating how many replication errors you currently have.  
![AD Replication Status tile](./media/log-analytics-ad-replication-status/oms-ad-replication-tile.png)

**Critical Replication Errors** are those that are at or above 75% of the [tombstone lifetime](https://technet.microsoft.com/library/cc784932%28v=ws.10%29.aspx) for your Active Directory forest.

When you click the tile, you’ll see more information about the errors.
![AD Replication Status dashboard](./media/log-analytics-ad-replication-status/oms-ad-replication-dash.png)


### Destination Server Status and Source Server Status
These blades show the status of destination servers and source servers that are experiencing replication errors. The number after each domain controller name indicates the number of replication errors on that domain controller.

The errors for both destination servers and source servers are shown because some problems are easier to troubleshoot from the source server perspective and others from the destination server perspective.

In this example, you can see that many destination servers have roughly the same number of errors, but there’s one source server (ADDC35) that has many more errors than all the others. It’s likely that there is some problem on ADDC35 that is causing it to fail to send data to its replication partners. Fixing the problems on ADDC35 will likely resolve many of the errors that appear in the destination server blade.

### Replication Error Types
This blade gives you information about the types of errors detected throughout your enterprise. Each error has a unique numerical code and a message that can help you determine the root cause of the error.

The donut at the top gives you an idea of which errors appear more and less frequently in your environment.

This can show you when multiple domain controllers experience the same replication error. In this case, you may be able to discover identify a solution on one domain controller, then repeat it on other domain controllers affected by the same error.

### Tombstone Lifetime
The tombstone lifetime determines how long a deleted object, referred to as a tombstone, is retained in the Active Directory database. When a deleted object passes the tombstone lifetime, a garbage collection process automatically removes it from the Active Directory database.

The default tombstone lifetime is 180 days for most recent versions of Windows, but it was 60 days on older versions, and it can be changed explicitly by an Active Directory administrator.

It’s important to know if you’re having replication errors that are approaching or are past the tombstone lifetime. If two domain controllers experience a replication error that persists past the tombstone lifetime, replication will be disabled between those two domain controllers, even if the underlying replication error is fixed.

The Tombstone Lifetime blade helps you identify places where this is in danger of happening. Each error in the **Over 100% TSL** category represents a partition that has not replicated between its source and destination server for at least the tombstone lifetime for the forest.

In this situation, simply fixing the replication error will not be enough. At a minimum, you’ll need to manually investigate to identify and clean-up lingering objects before you can restart replication. You may even need to decommission a domain controller.

In addition to identifying any replication errors that have persisted past the tombstone lifetime, you’ll also want to pay attention to any errors falling into the **50-75% TSL** or **75-100% TSL** categories.

These are errors that are clearly lingering, not transient, so they likely need your intervention to resolve. The good news is that they have not yet reached the tombstone lifetime. If you fix these problems promptly and *before* they reach the tombstone lifetime, replication can restart with minimal manual intervention.

As noted earlier, the dashboard tile for the AD Replication Status solution shows the number of *critical* replication errors in your environment, which is defined as errors that are over 75% of tombstone lifetime (including errors that are over 100% of TSL). Strive to keep this number at 0.

>[AZURE.NOTE] All the tombstone lifetime percentage calculations are based on the actual tombstone lifetime for your Active Directory forest, so you can trust that those percentages are accurate, even if you have a custom tombstone lifetime value set.

### AD Replication status details
When you click any item in one of the lists, you’ll see additional details about it using Log Search. The results are filtered to show only the errors related to that item. For example, if you click on the first domain controller listed under **Destination Server Status (ADDC02)**, you’ll see search results filtered to show errors with that domain controller listed as the destination server:

![AD replication status errors in search results](./media/log-analytics-ad-replication-status/oms-ad-replication-search-details.png)

From here, you can filter further, modify the search query, and so on. For more information about using the Log Search, see [Log searches](log-analytics-log-searches.md).

The **HelpLink** field shows the URL of a TechNet page with additional details about that specific error. You can copy and paste this link into your browser window to see information about troubleshooting and fixing the error.

You can also click **Export** to export the results to Excel. This allows you to visualize replication error data in any way you’d like.

![exported AD replication status errors in Excel](./media/log-analytics-ad-replication-status/oms-ad-replication-export.png)

## AD Replication Status FAQ
**Q: How often is AD replication status data updated?**
A: The information is updated every 5 days.

**Q: Is there a way to configure how often this data is updated?**
A: Not at this time.

**Q: Do I need to add all of my domain controllers to my OMS workspace in order to see replication status?**
A: No, only a single domain controller must be added. If you have multiple domain controllers in your OMS workspace, data from all of them is sent to OMS.

**Q: I don’t want to add any domain controllers to my OMS workspace. Can I still use the AD Replication Status solution?**
A: Yes. You can set the value of a registry key to enable this. See [To enable a non-domain controller to send AD data to OMS](#to-enable-a-non-domain-controller-to-send-ad-data-to-oms).

**Q: What is the name of the process that does the data collection?**
A: AdvisorAssessment.exe

**Q: How long does it take for data to be collected?**
A: Data collection time depends on the size of the Active Directory environment, but usually takes less than 15 minutes.

**Q: What type of data is collected?**
A: Replication information is collected via LDAP.

**Q: Is there a way to configure when data is collected?**
A: Not at this time.

**Q: What permissions do I need to collect data?**
A: Normal user permissions to Active Directory are usually sufficient.

## Troubleshoot data collection problems
In order to collect data, the AD Replication Status solution pack requires at least one domain controller to be connected to your OMS workspace. Until you do this, you will see a message indicating that **data is still being collected**.

If you need assistance connecting one of your domain controllers, you can view documentation at [Connect Windows computers to Log Analytics](log-analytics-windows-agents.md). Alternatively, if your domain controller is already connected to an existing System Center Operations Manager environment, you can view documentation at [Connect System Center Operations Manager to Log Analytics](log-analytics-om-agents.md).

If you don’t want to connect any of your domain controllers directly to OMS or to SCOM, see [To enable a non-domain controller to send AD data to OMS](#to-enable-a-non-domain-controller-to-send-ad-data-to-oms).


## Next steps

- Use [Log searches in Log Analytics](log-analytics-log-searches.md) to view detailed Active Directory Replication status data.
