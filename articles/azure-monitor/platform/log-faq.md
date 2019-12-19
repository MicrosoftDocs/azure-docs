---
title: Log Analytics FAQ | Microsoft Docs
description: Answers to frequently asked questions about the Azure Monitor Logs Analytics service.
ms.service:  azure-monitor
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 11/01/2019

---

# Log Analytics FAQ

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

This Microsoft FAQ is a list of commonly asked questions about the Azure Monitor Log Analytics workspace. If you have any additional questions about Log Analytics, go to the [discussion forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=opinsights) and post your questions. When a question is frequently asked, we add it to this article so that it can be found quickly and easily.


## New Logs experience

### Q: What's the difference between the new Logs experience and Log Analytics?

A: They are the same thing. [Log Analytics is being integrated as a feature in Azure Monitor](../../azure-monitor/azure-monitor-rebrand.md) to provide a more unified monitoring experience. The new Logs experience in Azure Monitor is exactly the same as the Log Analytics queries that many customers have already been using.

### Q: Can I still use Log Search? 

A: Log Search is currently still available in the OMS portal and in the Azure portal under the name **Logs (classic)**. The OMS portal will be officially retired on January 15, 2019. The classic Logs experience in Azure portal will be gradually retired and replaced the new Logs experience. 

### Q. Can I still use Advanced Analytics Portal? 
The new Logs experience in the Azure portal is based on the Advanced Analytics Portal, but it still can be accessed outside of the Azure portal. The roadmap for retiring this external portal will be announced soon.

### Q. Why can't I see Query Explorer and Save buttons in the new Logs experience?

**Query Explorer**, **Save** and **Set Alert** buttons are not available when exploring Logs in the context of a specific resource. To create alerts, save or load a query, Logs must be scoped to a workspace. To open Logs in workspace context, select **All services** > **Monitor** > **Logs**. The last used workspace is selected, but you can select any other workspace. See [Viewing and analyzing data in Log Analytics](../log-query/portals.md) for more information.

### Q. How do I extract Custom Fields in the new Logs experience? 

A: Custom Fields extraction are currently supported in the classic Logs experience. 

### Q. Where do I find List view in the new Logs? 

A: List view is not available in the new Logs. There is an arrow to the left of each record in the results table. Click this arrow to open the details for a specific record. 

### Q. After running a query, a list of suggested filters are available. How can I see filters? 

A: Click ‘Filters’ on the left pane to see a preview of the new Filters implementation. This is now based on your full result set instead of being limited by the 10,000 record limit of the UI. This is currently a list of the most popular filters and the 10 most common values for each filter. 

### Q. Why am I getting the error: "Register resource provider 'Microsoft.Insights' for this subscription to enable this query" in Logs, after drilling-in from VM? 

A: By default, many resource providers are automatically registered, however, you may need to manually register some resource providers. This configures your subscription to work with the resource provider. The scope for registration is always the subscription. See [Resource providers and types](../../azure-resource-manager/resource-manager-supported-services.md#azure-portal) for more information.

### Q. Why am I am getting no access error message when accessing Logs from a VM page? 

A: To view VM Logs, you need to be granted with read permission to the workspaces that stores the VM logs. In these cases, your administrator must grant you with to permissions in Azure.

### Q. Why can I can access my workspace in OMS portal, but I get the error “You have no access” in the Azure portal?  

A: To access a workspace in Azure, you must have Azure permissions assigned. There are some cases where you may not have appropriate access permissions. In these cases, your administrator must grant you with permissions in Azure.See [OMS portal moving to Azure](oms-portal-transition.md) for more information.

### Q. Why can't I can’t see View Designer entry in Logs?

A: View Designer is only available in Logs for users assigned with Contributor permissions or higher.

### Q. Can I still use the Analytics portal outside of Azure?

A. Yes, the Logs page in Azure and the Advanced Analytics portal are based on the same code. Log Analytics is being integrated as a feature in Azure Monitor to provide a more unified monitoring experience. You can still access Analytics portal using the URL: https:\/\/portal.loganalytics.io/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/workspaces/{workspaceName}.



## General

### Q. How can I see my views and solutions in Azure portal? 

A: The list of views and installed solutions are available in Azure portal. Click **All services**. In the list of resources, select **Monitor**, then click **...More**. The last used workspace is selected, but you can select any other workspace. 

### Q. Does Log Analytics use the same agent as Azure Security Center?

A: In early June 2017, Azure Security Center began using the Microsoft Monitoring Agent to collect and store data. To learn more, see [Azure Security Center Platform Migration FAQ](../../security-center/security-center-enable-data-collection.md).

### Q. What checks are performed by the AD and SQL Assessment solutions?

A: The following query shows a description of all checks currently performed:

```
(Type=SQLAssessmentRecommendation OR Type=ADAssessmentRecommendation) | dedup RecommendationId | select FocusArea, ActionArea, Recommendation, Description | sort Type, FocusArea,ActionArea, Recommendation
```

The results can then be exported to Excel for further review.

### Q. Why do I see something different than OMS in the System Center Operations Manager console?

A: Depending on what Update Rollup of Operations Manager you are on, you may see a node for *System Center Advisor*, *Operational Insights*, or *Log Analytics*.

The text string update to *OMS* is included in a management pack, which needs to be imported manually. To see the current text and functionality, follow the instructions on the latest System Center Operations Manager Update Rollup KB article and refresh the console.

### Q: Is there an on-premises version of Log Analytics?

A: No. Log Analytics is a scalable cloud service that processes and stores large amounts of data. 

### Q. How can I be notified when data collection stops?

A: Use the steps described in [create a new log alert](../../azure-monitor/platform/alerts-metric.md) to be notified when data collection stops.

When creating the alert for when data collection stops, set the:

- **Define alert condition** specify your Log Analytics workspace as the resource target.
- **Alert criteria** specify the following:
   - **Signal Name** select **Custom log search**.
   - **Search query** to `Heartbeat | summarize LastCall = max(TimeGenerated) by Computer | where LastCall < ago(15m)`
   - **Alert logic** is **Based on** *number of results* and **Condition** is *Greater than* a **Threshold** of *0*
   - **Time period** of *30* minutes and **Alert frequency** to every *10* minutes
- **Define alert details** specify the following:
   - **Name** to *Data collection stopped*
   - **Severity** to *Warning*

Specify an existing or create a new [Action Group](../../azure-monitor/platform/action-groups.md) so that when the log alert matches criteria, you are notified if you have a heartbeat missing for more than 15 minutes.

## Configuration

### Q. Can I change the name of the table/blob container used to read from Azure Diagnostics (WAD)?

A. No, it is not currently possible to read from arbitrary tables or containers in Azure storage.

### Q. What IP addresses does the Log Analytics service use? How do I ensure that my firewall only allows traffic to the Log Analytics service?

A. The Log Analytics service is built on top of Azure. Log Analytics IP addresses are in the [Microsoft Azure Datacenter IP Ranges](https://www.microsoft.com/download/details.aspx?id=41653).

As service deployments are made, the actual IP addresses of the Log Analytics service change. The DNS names to allow through your firewall are documented in [network requirements](../../azure-monitor/platform/log-analytics-agent.md#network-firewall-requirements).

### Q. I use ExpressRoute for connecting to Azure. Does my Log Analytics traffic use my ExpressRoute connection?

A. The different types of ExpressRoute traffic are described in the [ExpressRoute documentation](../../expressroute/expressroute-faqs.md#supported-services).

Traffic to Log Analytics uses the public-peering ExpressRoute circuit.

### Q. Is there a simple and easy way to move an existing Log Analytics workspace to another Log Analytics workspace/Azure subscription?

A. The `Move-AzResource` cmdlet lets you move a Log Analytics workspace, and also an Automation account from one Azure subscription to another. For more information, see [Move-AzResource](https://msdn.microsoft.com/library/mt652516.aspx).

This change can also be made in the Azure portal.

You can’t move data from one Log Analytics workspace to another, or change the region that Log Analytics data is stored in.

### Q: How do I add Log Analytics to System Center Operations Manager?

A:  Updating to the latest update rollup and importing management packs enables you to connect Operations Manager to Log Analytics.

>[!NOTE]
>The Operations Manager connection to Log Analytics is only available for System Center Operations Manager 2012 SP1 and later.

### Q: How can I confirm that an agent is able to communicate with Log Analytics?

A: To ensure that the agent can communicate with the Log Analytics workspace, go to: Control Panel, Security & Settings, **Microsoft Monitoring Agent**.

Under the **Azure Log Analytics (OMS)** tab, look for a green check mark. A green check mark icon confirms that the agent is able to communicate with the Azure service.

A yellow warning icon means the agent is having issues communication with Log Analytics. One common reason is the Microsoft Monitoring Agent service has stopped. Use service control manager to restart the service.

### Q: How do I stop an agent from communicating with Log Analytics?

A: In System Center Operations Manager, remove the computer from the Log Analytics managed computers list. Operations Manager updates the configuration of the agent to no longer report to Log Analytics. For agents connected to Log Analytics directly, you can stop them from communicating through: Control Panel, Security & Settings, **Microsoft Monitoring Agent**.
Under **Azure Log Analytics (OMS)**, remove all workspaces listed.

### Q: Why am I getting an error when I try to move my workspace from one Azure subscription to another?

A: To move a workspace to a different subscription or resource group, you must first unlink the Automation account in the workspace. Unlinking an Automation account requires the removal of these solutions if they are installed in the workspace: Update Management, Change Tracking, or Start/Stop VMs during off-hours are removed. After these solutions are removed, unlink the Automation account by selecting **Linked workspaces** on the left pane in the Automation account resource and click **Unlink workspace** on the ribbon.
 > Removed solutions need to be reinstalled in the workspace, and the Automation link to the workspace needs to be restated after the move.

Ensure you have permission in both Azure subscriptions.

### Q: Why am I getting an error when I try to update a SavedSearch?

A: You need to add 'etag' in the body of the API, or the Azure Resource Manager template properties:
```
"properties": {
   "etag": "*",
   "query": "SecurityEvent | where TimeGenerated > ago(1h) | where EventID == 4625 | count",
   "displayName": "An account failed to log on",
   "category": "Security"
}
```

## Agent data
### Q. How much data can I send through the agent to Log Analytics? Is there a maximum amount of data per customer?
A. There is no limit on the amount of data that is uploaded, it is based on the pricing option you select - Capacity Reservation or Pay-As-You-Go. A Log Analytics workspace is designed to automatically scale up to handle the volume coming from a customer – even if it is terabytes per day. For further information, see [pricing details](https://azure.microsoft.com/pricing/details/monitor/).

The Log Analytics agent was designed to ensure it has a small footprint. The data volume varies based on the solutions you enable. You can find detailed information on the data volume and see the breakdown by solution in the [Usage](../../azure-monitor/platform/data-usage.md) page.

For more information, you can read a [customer blog](https://thoughtsonopsmgr.blogspot.com/2015/09/one-small-footprint-for-server-one.html) showing their results after evaluating the resource utilization (footprint) of the Log Analytics agent.

### Q. How much network bandwidth is used by the Microsoft Management Agent (MMA) when sending data to Log Analytics?

A. Bandwidth is a function on the amount of data sent. Data is compressed as it is sent over the network.

### Q. How much data is sent per agent?

A. The amount of data sent per agent depends on:

* The solutions you have enabled
* The number of logs and performance counters being collected
* The volume of data in the logs

Overall usage is shown on the [Usage](../../azure-monitor/platform/data-usage.md) page.

For computers that are able to run the WireData agent, use the following query to see how much data is being sent:

```
Type=WireData (ProcessName="C:\\Program Files\\Microsoft Monitoring Agent\\Agent\\MonitoringHost.exe") (Direction=Outbound) | measure Sum(TotalBytes) by Computer
```

## Next steps

[Get started with Azure Monitor](../../azure-monitor/overview.md) to learn more about Log Analytics and get up and running in minutes.
