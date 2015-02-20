<properties 
	pageTitle="Operational Insights Intelligence Packs" 
	description="Operational Insights is an analysis service that enables IT administrators to gain deep insight across on-premises and cloud environments. It enables you to interact with real-time and historical machine data to rapidly develop custom insights, and provides Microsoft and community-developed patterns for analyzing data." 
	services="operational-insights" 
	documentationCenter="n/a" 
	authors="bandersmsft" 
	manager="jwhit" 
	editor=""/>

<tags 
	ms.service="operational-insights" 
	ms.workload="operational-insights" 
	ms.tgt_pltfrm="NA" 
	ms.devlang="NA" 
	ms.topic="article" 
	ms.date="02/20/2015" 
	ms.author="alfran"/>

# Intelligence Packs

Intelligence Packs are a collection of **logic**, **visualization** and **data acquisition rules** that address key customer challenges today. They allow deeper insights to help investigate and resolve operational issues faster, collect and correlate various types of machine data and helps you be proactive with activities such as capacity planning, patch status reporting and security auditing.

This guide walks you through the various Intelligence Packs available and what they are used for.

>[AZURE.INFO] For more information on *adding* intelligence packs, see [Adding Intelligence Packs](../operational-insights-add-intelligence-pack.md)

## SQL Assessment

SQL Assessment Intelligence Pack assesses the risk and health of your SQL Server environments on a regular interval. By default it will scan the SQL systems weekly, and information is presented as a monthly rollup. It provides a prioritized list of recommendations tailored to your deployments. These recommendations are categorized across six focus areas which allows you and your team to:

- **quickly** understand the **risk and health** of your environments
- easily take **action** to decrease risk and improve health
- **prioritize** your work and become more **productive**
## Configuration Assessment

Configuration assessment provides you with detailed information about the current state of your server infrastructure. Unlike intelligence packs, configuration assessment is available when you first start using Operational Insights.

Configuration data is gathered from monitored servers and then sent to the Operational Insights service in the cloud for processing. Logic is applied to the received data and the cloud service records the data. Processed data for the servers is shown for the following areas:

- **Alerts:** Shows the alerts that affect your monitored servers
- **Knowledge Recommendations:** Shows the Microsoft Knowledge Base articles that are recommended for workloads that are found in your infrastructure
- **Servers and Workloads Analyzed:** Shows the servers and workloads that are being monitored by Operational Insights
- **Current Snapshot:** Shows the most recent information about servers that reported data to the Operational Insights service
- **Change History:** Shows a list of configuration changes made to your monitored servers

> [AZURE.IMPORTANT] Configuration Assessment can only be enabled for computers managed by **Operations Manager**.  For additional information, see [Connect Operations Manager](../operational-insights-connect-scom.md)
## Malware Assessment

If insufficient protection is found, servers with active threats and servers with insufficient protection are shown in the **Malware**  page. By using the information on the **Malware** page, you can develop a plan to apply protection to the servers that need it.

## Alert Management

With the Alert Management Intelligence Pack, you can view your **Operations Manager** Alerts across all your servers. This tool can help you to easily triage alerts, and identify root causes in your environment in a very fast and fluid way.

You can get insights into key scenarios, including:

- How many alerts have been raised within a specified time frame?
- Top sources with the most number of active alerts raised within a specified time frame.
- Top active critical and warning alerts that are raised within a specified time frame.
- Ability to search through all alerts and view every alert in detail

> [AZURE.IMPORTANT] Alert Management can only be enabled for computers managed by **Operations Manager**.  For additional information, see [Connect Operations Manager](../operational-insights-connect-scom)
## Capacity Planning

You can use the Capacity Management intelligence pack in Microsoft Azure Operational Insights to help you understand the capacity of your server infrastructure. The intelligence pack reads performance counters on the monitored server and sends usage data to the Operational Insights service in the cloud for processing. Logic is applied to the usage data, and the cloud service records the data. Over time, usage patterns are identified and capacity is projected, based on current consumption.

For example, a projection might identify when additional processor cores or additional memory will be needed for an individual server. In this example, the projection might indicate that in 30 days the server will need additional memory. This can help you plan for a memory upgrade during the server’s next maintenance window, which might occur once every two weeks.

>[AZURE.IMPORTANT] To view capacity management data, you must enable Operations Manager connectivity with Virtual Machine Manager (VMM). For additional information about connecting the systems, see [How to connect VMM with Operations Manager](https://technet.microsoft.com/library/hh882396.aspx).

For more information on using the Capacity Management Intelligence Pack, see:

- [How to use the Compute page](https://msdn.microsoft.com/library/azure/dn873965.aspx)
- [How to use the Direct Attached Storage page](https://msdn.microsoft.com/library/azure/dn873954.aspx) 
## Change Tracking

You can use the Configuration Change Tracking intelligence pack to help you easily identify software and Windows Services changes that occur in your environment — identifying these configuration changes can help you pinpoint operational issues. By using the information on the Change Tracking page, you can easily see the changes that were made in your server infrastructure. You can view changes to your infrastructure and then drill-into details for the following categories:

- Changes by configuration type for software and windows services
- Software changes to applications and updates for individual servers
- Total number of software changes for each application
- Windows service changes for individual servers
## System Update Assessment

You can use the System Updates intelligence pack in Microsoft Azure Operational Insights to help you apply missing updates to servers in your infrastructure. If missing updates are found, they are shown on the **Updates** page. You can use the **Updates** page to work with missing updates and develop a plan to apply them to the servers that need them.

The Updates page details the following categories:

- Servers that are missing security updates
- Servers that haven't been updated recently
- Updates that should be applied to specific servers
- Type of updates that are missing

You can click any tile or item to view its details in the **Search** page to get more information about the missing update.  Search results include:

- Server
- Update title
- Knowledge Base ID
- Product the update is for
- Update severity
- Publication date

Server search results include:

- Server name
- Operating system version name
- Automatic update enabling method
- Days since last update
- Windows Update agent version






