<properties
	pageTitle="Log Analytics FAQ | Microsoft Azure"
	description="Answers to frequently asked questions about the Log Analytics service."
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
	ms.date="08/08/2016"
	ms.author="banders"/>

# Log Analytics FAQ

This Microsoft FAQ is a list of commonly asked questions about Log Analytics in Microsoft Operations Management Suite (OMS). If you have any additional questions about Log Analytics, please go to the [discussion forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=opinsights) and post your questions. Someone from our community will help you get your answers. If a question is commonly asked, we will add it to this article so that it can be found quickly and easily.

## General

**Q. What checks are performed by the AD and SQL Assessment solutions?**

A. The following query shows a description of all checks currently performed:

```
(Type=SQLAssessmentRecommendation OR Type=ADAssessmentRecommendation) | dedup RecommendationId | select FocusArea, ActionArea, Recommendation, Description | sort Type, FocusArea,ActionArea, Recommendation
```

The results can then be exported to Excel for further review.

**Q: Why do I see something different than *OMS* in SCOM Administration?**

A: Depending on what Update Rollup of SCOM you are in, you may see a node for *System Center Advisor*, *Operational Insights*, or *Log Analytics*.

The text string update to *OMS* is included in a management pack, which needs to be imported manually. Follow the instructions on the latest SCOM Update Rollup KB article and refresh the OMS console to see the latest updates in the *OMS* node.

**Q: Is there an *on-premises* version of OMS?**

A: No. Log Analytics processes and stores very large amounts of data. As a cloud service, Log Analytics is able to scale-up if necessary and avoid any performance impact to your environment.

Also, being a cloud service means you don't need to keep the Log Analytics infrastructure up and running and can receive frequent feature updates and fixes.

## Configuration
**Q. Can I change the name of the table/blob container used to read from Azure Diagnostics (WAD)?**  

A.	No, this is not currently possible, but is planned for a future release.

**Q. What IP addresses do the OMS services use? How do I ensure that my firewall only allows traffic to the OMS Services?**  

A. The Log Analytics service is built on top of Azure and the endpoints receive IPs that are in the [Microsoft Azure Datacenter IP Ranges](http://www.microsoft.com/download/details.aspx?id=41653).

As service deployments are made, the actual IP addresses of the OMS services change. The DNS names to allow through your firewall are documented at [Configure proxy and firewall settings in Log Analytics](log-analytics-proxy-firewall.md).

**Q. I use ExpressRoute for connecting to Azure. Will my Log Analytics traffic use my ExpressRoute connection?**  

A. The different types of ExpressRoute traffic are described in the [ExpressRoute documentation](./expressroute/expressroute-faqs.md#supported-services).

Traffic to Log Analytics uses the public-peering ExpressRoute circuit.

**Q. Is there a simple and easy way to move an existing Log Analytics workspace to another Log Analytics workspace/Azure subscription?**  We have several customer's OMS workspaces that we were testing and trialing in our Azure subscription, and they are moving to production so we want to move them to their own Azure/OMS subscription.  

A. The `Move-AzureRmResource` cmdlet will let you move an Log Analytics workspace, and also an Automation account from one Azure subscription to another. For more information, see [Move-AzureRmResource](http://msdn.microsoft.com/library/mt652516.aspx).

This change can also be made in the Azure portal.

You can’t move data from one Log Analytics workspace to another, or change the region that Log Analytics data is stored in.

**Q: How do I add OMS to SCOM?**

A:  Updating to the latest update rollup and importing management packs will enable you to connect SCOM to Log Analytics.

Note that the SCOM connection to Log Analytics is only available for SCOM 2012 SP1 and higher.

**Q: How can I confirm that an agent is able to communicate with Log Analytics?**

A: To ensure that the agent can communicate with OMS, go to: Control Panel, Security & Settings, **Microsoft Monitoring Agent**.

Under the **Azure Log Analytics (OMS)** tab, look for a green check mark. A green check mark icon confirms that the agent is able to communicate with the OMS service.

A yellow warning icon means the agent is having issues communication with OMS. One common reason is the Microsoft Monitoring Agent service has been stopped and needs to be restarted.

**Q: How do I stop an agent from communicating with Log Analytics?**

A: In SCOM, remove the computer from the OMS managed list. This stops all communication through SCOM for that agent. For agents connected to OMS directly, you can stop them from communicating with OMS through: Control Panel, Security & Settings, **Microsoft Monitoring Agent**.
Under **Azure Log Analytics (OMS)**, remove all workspaces listed.

## Agent data

**Q. How much data can I send through the agent to Log Analytics? Is there a maximum amount of data per customer?**  
A. The free plan sets a daily cap of 500 MB per workspace. The standard and premium plans have no limit on the amount of data that is uploaded. As a cloud service, Log Analytics in OMS designed to automatically scale up to handle the volume coming from a customer – even if it is terabytes per day.

The Log Analytics agent was designed to ensure it has a small footprint and does some basic data compression. One of our customers actually wrote a blog on the tests they performed against our agent and how impressed they were. The data volume will vary based on the solutions your customers enables. You can find detailed information on the data volume and see the breakup by solution under the **Usage** tile in the OMS overview page.

For more information, you can read a [customer blog](http://thoughtsonopsmgr.blogspot.com/2015/09/one-small-footprint-for-server-one.html) about the low footprint of the OMS agent.

**Q. How much network bandwidth is used by the Microsoft Management Agent (MMA) when sending data to Log Analytics?**

A. Bandwidth is a function on the amount of data sent. Data is compressed as it is sent over the network.

**Q. How much data is sent per agent?**

A. This largely depends on:

- the solutions you have enabled
- the number of logs and performance counters being collected
- the volume of data in the logs

The free pricing tier is a good way to onboard several servers and gauge the typical data volume. Overall usage is shown on the **Usage** page.
For computers that are able to run the WireData agent, you can see how much data is being sent using the following query:

```
Type=WireData (ProcessName="C:\\Program Files\\Microsoft Monitoring Agent\\Agent\\MonitoringHost.exe") (Direction=Outbound) | measure Sum(TotalBytes) by Computer
```



## Next steps

- [Get started with Log Analytics](log-analytics-get-started.md) to learn more about Log Analytics and get up and running in minutes.
