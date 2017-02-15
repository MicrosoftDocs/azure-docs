---
title: Add Log Analytics management solutions | Microsoft Docs
description: Log Analytics management solutions are a collection of logic, visualization and data acquisition rules that provide metrics pivoted around a particular problem area.
services: log-analytics
documentationcenter: ''
author: bandersmsft
manager: carmonm
editor: ''
ms.assetid: f029dd6d-58ae-42c5-ad27-e6cc92352b3b
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/02/2017
ms.author: banders

---
# Add Log Analytics management solutions

Log Analytics management solutions are a collection of **logic**, **visualization** and **data acquisition rules** that provide metrics pivoted around a particular problem area. This article lists management solutions supported by Log Analytics and shows you how to add and remove for a workspace by using the Azure portal. You can also add solutions in the OMS portal using the Solutions Gallery.

Management solutions allow deeper insights to:

* help investigate and resolve operational issues faster
* collect and correlate various types of machine data
* help you be proactive with activities that the solution exposes.

> [!NOTE]
> Log Analytics includes Log Search functionality, so you don't need to install a management solution to enable it. However, you get data visualizations, suggested searches, and insights by adding management solutions to your workspace.

Using this article, you add management solutions to a workspace using the Azure portal Marketplace. After you've added a solution, data is collected from the servers in your infrastructure and sent to the OMS service. Processing by the OMS service typically takes a few minutes to an hour. After the service processes the data, you can view it in OMS.

You can easily remove a management solution when it is no longer needed. When you remove a management solution, its data is not sent to OMS, which can reduce the amount of data used by your daily quota, if you have one.

## Add a management solution
1. If you haven't already done so, sign in to the [Azure portal](https://portal.azure.com) using your Azure subscription.
2. In the **New** blade under **Marketplace**, select **Monitoring + management**.
3. In the **Monitoring + management** blade, click **See all**.  
    ![Monitoring + management blade](./media/log-analytics-add-solutions/monitoring-management-blade.png)  
4. To the right of **Management Solutions**, click **More**.
5. In the **Management Solutions** blade, select a management solution that you want to add to a workspace.  
    ![Monitoring + management blade](./media/log-analytics-add-solutions/management-solutions.png)  
6. In the management solution blade, review information about the management solution, and then click **Create**.
7. In the *management solution name* blade, select a workspace that you want to associate with the management solution.
8. Optionally, change workspace settings for the Azure subscription, resource group, and location. You can also choose **Automation options**. Click **Create**.  
    ![solution workspace](./media/log-analytics-add-solutions/solution-workspace.png)  
9. To start using the management solution that you've added to your workspace, navigate to **Log Analytics** > **Subscriptions** > ***workspace name*** > **Overview**. A new tile for your management solution is displayed. Click the tile to open it and start using the solution after data for the solution is gathered.

## Remove a management solution

1. In the [Azure portal](https://portal.azure.com), navigate to **Log Analytics** > **Subscriptions** > ***workspace name*** and then in the ***workspace name*** blade, click **Solutions**.
2. In the list of management solutions, select the solution that you want to remove.
3. In the solution blade for your workspace, click **Delete**.  
    ![delete solution](./media/log-analytics-add-solutions/solution-delete.png)  
4. In the confirmation dialog, click **Yes**.


## Data collection details
The following tables shows data collection methods and other details about how data is collected for Log Analytics management solutions and data sources. The tables are categorized by solution offers which equate to [subscription pricing tiers](https://go.microsoft.com/fwlink/?linkid=827926). The Activity Log Analytics solution is available to all pricing tiers free of charge.

Windows agents and SCOM agents are essentially the same, however the Windows agent includes additional functionality to allow it to connect to the OMS workspace and route through a proxy. If you use a SCOM agent, it must be targeted as an OMS agent to communicate with OMS. SCOM agents in this table are OMS agents that are connected to SCOM. See [Connect Operations Manager to Log Analytics](log-analytics-om-agents.md) for information about connecting your existing SCOM environment to OMS.

> [!NOTE]
> The type of agent that you use determines how data is sent to OMS, with the following conditions:
> - You either use the Windows agent or a SCOM-attached OMS agent.
> - When SCOM is required, SCOM agent data for the solution is always sent to OMS using the SCOM management group. Additionally, when SCOM is required, only the SCOM agent is used by the solution.
> - When SCOM is not required and the table shows that SCOM agent data is sent to OMS using the management group, then SCOM agent data is always sent to OMS using management groups. Windows agents bypass the management group and send their data directly to OMS.
> - When SCOM agent data is not sent using a management group, then the data is sent directly to OMS—bypassing the management group.

### Insight & Analytics or Log Analytics Standalone (per gigabyte)

| solution | platform | Windows Agent | SCOM agent | Azure Storage | SCOM required? | SCOM agent data sent via management group | collection frequency |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Activity Log Analytics | Azure | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | on notification |
| AD Assessment |Windows |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |7 days |
| AD Replication Status |Windows |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |5 days |
| Agent Health | Windows and Linux | ![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) | ![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) | 1 minute |
| Alert Management (Nagios) |Linux |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |on arrival |
| Alert Management (Zabbix) |Linux |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |1 minute |
| Alert Management (Operations Manager) |Windows |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |3 minutes |
| Application Insights Connector (Preview) | Azure | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | on notification |
| Azure Networking Analytics (Preview) | Azure | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | 10 minutes |
| Capacity Management<sup>1</sup> |Windows |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |hourly |
| Containers | Linux | ![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | 3 minutes |
| Key Vault Analytics (Preview) |Windows |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |10 minutes |
| Network Performance Monitor | Windows | ![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) | ![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | TCP handshakes every 5 seconds, data sent every 3 minutes |
| Office 365 Analytics (Preview) |Windows |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |on notification |
| Service Fabric Analytics |Windows |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |5 minutes |
| Service Map | Windows and Linux | ![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) | ![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) | 15 seconds |
| SQL Assessment |Windows |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |7 days |
| SurfaceHub |Windows |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |on arrival |
| System Center Operations Manager Assessment (Preview) | Windows | ![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) | ![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) | seven days |
| Upgrade Analytics (Preview) | Windows | ![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | 2 days |
| VMware Monitoring (Preview) | Linux | ![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | 3 minutes |
| Wire Data<sup>2</sup> |Windows (2012 R2 / 8.1 or later) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | 1 minute |


<sup>1</sup>The Capacity Management management solution is not available to be added to workspaces. Customers who have the capacity management solution installed can continue to use the solution.

<sup>2</sup>The Wire Data solution is not currently available to be added to workspaces. Customers who already have the Wire Data solution enabled can continue to use it.


### Automation & Control

| solution | platform | Windows Agent | SCOM agent | Azure Storage | SCOM required? | SCOM agent data sent via management group | collection frequency |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Activity Log Analytics | Azure | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | on notification |
| Automation Hybrid Worker | Windows | ![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) | ![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | n/a |
| Change Tracking |Windows |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |hourly |
| Change Tracking |Linux |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |hourly |
| Update Management | Windows |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |at least 2 times per day and 15 minutes after installing an update |

### Security & Compliance

| solution type | platform | Windows Agent | SCOM agent | Azure Storage | SCOM required? | SCOM agent data sent via management group | collection frequency |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Activity Log Analytics | Azure | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | on notification |
| Antimalware Assessment |Windows |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |hourly |
| Security and Audit<sup>1</sup> | Windows and Linux | ![Some](./media/log-analytics-add-solutions/oms-bullet-yellow.png) | ![Some](./media/log-analytics-add-solutions/oms-bullet-yellow.png) | ![Some](./media/log-analytics-add-solutions/oms-bullet-yellow.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![Some](./media/log-analytics-add-solutions/oms-bullet-yellow.png) | various |

<sup>1</sup>The Security and Audit solution can collect logs from Windows, SCOM, and Linux agents. See [Data sources](#data-sources) below for data collection information about:

- Syslog
- Windows security event logs
- Windows firewall logs
- Windows event logs



### Protection & Recovery

| solution | platform | Windows Agent | SCOM agent | Azure Storage | SCOM required? | SCOM agent data sent via management group | collection frequency |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Activity Log Analytics | Azure | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | on notification |
| Backup | Azure | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | n/a |
| Azure Site Recovery | Azure | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | ![No](./media/log-analytics-add-solutions/oms-bullet-red.png) | n/a |


### Data sources


| data source | platform | Windows Agent | SCOM agent | Azure Storage | SCOM required? | SCOM agent data sent via management group | collection frequency |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ETW |Windows |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |5 minutes |
| IIS Logs |Windows |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |5 minutes |
| Network Application Gateways |Windows |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |10 minutes |
| Network Security Groups |Windows |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |10 minutes |
| Performance Counters |Windows |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |as scheduled, minimum of 10 seconds |
| Performance Counters |Linux |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |as scheduled, minimum of 10 seconds |
| Syslog |Linux |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |from Azure storage: 10 minutes; from agent: on arrival |
| Windows security event logs |Windows |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |for Azure storage: 10 min; for the agent: on arrival |
| Windows firewall logs |Windows |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |on arrival |
| Windows event logs |Windows |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |![No](./media/log-analytics-add-solutions/oms-bullet-red.png) |![Yes](./media/log-analytics-add-solutions/oms-bullet-green.png) |for Azure storage: 1 min; for the agent: on arrival |



## Preview management solutions and features
By running a service and following devops practices we are able to partner with customers to develop features and solutions.

During private preview we give a small group of customers access to an early implementation of the feature or solution to gain feedback and make improvements. This early implementation has minimal features and operational capabilities.

Our goal is to try things quickly so we can find what works, and what doesn’t work. We iterate through this process until the feedback from the private preview customers informs us that we’re ready for a public preview.

During the public preview, we make the feature or solution available for all users to get more feedback and validate our scaling and efficiency. During this phase:

* Preview features will appear in the Settings tab and can be enabled by any user.
* Preview solutions can be added through the gallery or using a published script.

### What should I know about Preview features and solutions?
We’re excited about new features and management solutions and we love working with you to develop them.

Preview features and solutions aren’t right for everyone though, so before asking to join a private preview or enabling a public preview make sure you’re OK working with something that is under development.

When enabling a preview feature through the portal you will be see a warning reminding you that the feature is in preview.

#### For both *private* and *public* preview
The following applies to both public and private previews:

* Things may not always work correctly.
  * Issues range from being a minor annoyance through to something not working at all.
* There is potential for the preview to have a negative impact on your systems / environment.
  * We try to avoid negative things happening to the systems you’re using with OMS but sometimes unexpected things occur.
* Data loss / corruption may occur.
* We may ask you to collect diagnostic logs or other data to help troubleshoot issues.
* The feature or solution may be removed (either temporarily or permanently).
  * Based on our learnings during the preview we may decide to not release the feature or solution.
* Previews may not work or may not have been tested with all configurations, and we may limit:
  * The operating systems that can be used (e.g. a feature may only apply to Linux while in preview).
  * The type of agent (MMA, SCOM) that can be used (e.g. a feature may not work with SCOM while in preview).  
* Preview solutions and features are not covered by the Service Level Agreement.
* Usage of preview features will incur usage charges.
* Features or capabilities that you need for the feature / solution to be useful may be missing or incomplete.
* Features / solutions may not be available in all regions.
* Features / solutions may not be localized.
* Features / solutions may have a limit on the number of customers or devices that can use it.
* You may need to use scripts to perform configuration and to enable the solution/feature.
* The user interface (UI) will be incomplete and may change from day to day.
* Public previews may not be appropriate for your production / critical systems.

#### For *private* preview
In addition to the items above, the following is specific to private previews:

* We expect you to provide us with feedback on your experience so that we can make the feature/solution better.
* We may contact you for feedback using surveys, phone calls or e-mail.
* Things won't always work correctly.
* We may require a Non-Disclosure Agreement (NDA) for participation or may include confidential content.
  * Before blogging, tweeting, or otherwise communicating with third parties, please check with the Program Manager that is responsible for the preview to understand any restrictions on disclosure.
* Do not run on production / critical systems.

### How do I get access to private preview features and solutions?
We invite customers to private previews through several different ways depending on the preview.

* Answering the monthly customer survey and giving us permission to follow up with you improves your chances of being invited to a private preview.
* Your Microsoft account team can nominate you.
* You can sign up based on details posted on twitter [msopsmgmt](https://twitter.com/msopsmgmt).
* You can sign up based on details shared community events – look for us at meet ups, conferences and in online communities.

## Next steps
* [Search logs](log-analytics-log-searches.md) to view detailed information gathered by management solutions.
