<properties 
   pageTitle="Operations Manager considerations with Operational Insights"
   description="If you use Microsoft Azure Operational Insights with Operations Manager, then your configuration relies on a distribution of Operations Manager agents and management groups to collect and send data to the Operational Insights service for analysis"
   services="operational-insights"
   documentationCenter=""
   authors="bandersmsft"
   manager="jwhit"
   editor="tysonn" />
<tags 
   ms.service="operational-insights"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="04/30/2015"
   ms.author="banders" />

# Operations Manager considerations with Operational Insights

[AZURE.INCLUDE [operational-insights-note-moms](../includes/operational-insights-note-moms.md)]

If you use Microsoft Azure Operational Insights with Operations Manager, then your configuration relies on a distribution of Operations Manager agents and management groups  to collect and send data to the Operational Insights service for analysis. However, if you use agents that connect directly to the web service, then you do not need Operations Manager. Consider the following issues when your use Operational Insights with Operations Manager.

## Operational Insights software functions and requirements

Operational Insights consists of a web service in the cloud, and either agents that connect directly to the web service or Operations Manager agents and Operations Manager management groups that are managing computers in your environment.

Before you select Operations Manager agents (to collect data) and management groups (to manage agents and send data to the Operational Insights service), ensure that you understand the following:

- The Operations Manager agent is installed on any server from which you want to collect and analyze data.

- The Operations Manager management group transfers data from agents to the Operational Insights web service. It does not analyze any of the data.

- The Operations Manager management group must have access to the Internet to upload data to the web service.

- For the best results, do not install the Operations Manager management server on a computer that is also a domain controller.

- An Operations Manager agent must have network connectivity to the Operations Manager management group so it can transfer data.

Operational Insights can use the System Center Health Service to collect and analyze data. Operations Manager depends on the System Center Health Service. When you view the programs that are installed on your server, you will see System Center Operations Manager agent software, particularly in Add/Remove Programs. Do not remove these because Operational Insights is dependent on them. If you remove the Operations Manager agent software, Operational Insights will no longer function.

## Coexistence with Operations Manager

When using Operations Manager, Operational Insights is only supported with the Operations Manager agent in System Center Operations Manager 2012 R2 or System Center Operations Manager 2012 SP1. It is not supported with previous versions of System Center Operations Manager. Because the Operations Manager agent is used to collect data, it uses specific credentials (action accounts or Run As accounts) to support some of the analyzed workloads, such as SharePoint 2012.

## Operational Insights and SQL Server 2012

When using Operations Manager, the System Center Health Service runs under the Local System account. In SQL Server versions earlier than SQL Server 2008 R2, the Local System account was enabled by default and was a member of the system administrator server role. In SQL Server 2012, the Local System login is not part of the system administrator server role. As a result, when you use Operational Insights, it cannot monitor the SQL Server 2012 instance completely, and not all rules can generate alerts.

## Internet and internal network connectivity

When using agents that connect directly with the web service, the agents need to access the Internet to send data to the web service and to receive updated configuration information from the web service.

When using Operations Manager, management server needs to access the Internet to send data to the web service and to receive updated configuration information from the web service. However, your agents do not need to access the Internet. If you have Operations Manager agents on servers that are not connected to the Internet, you can use the web service if they can communicate with an Internet-connected management server.

## Clustering support

The Operations Manager agent is supported on computers running Windows Server 2012, Windows Server 2008 R2, or Windows Server 2008 that is configured to be part of a Windows failover cluster. You can view the clusters in the Operational Insights portal. On the Servers page, clusters are identified as TYPE=CLUSTER (as opposed to TYPE=AGENT, which is how physical computers are identified).

The discovery and configuration rules run on the active and passive nodes of the cluster, but any alerts generated on the passive nodes are ignored. If a node shifts from passive to active, alerts for that node are displayed automatically, with no intervention required from you.

Some alerts might be generated twice, depending on the rule that generates the alert. For example, a rule that detects a bad driver by examining the operating system generates alerts for the physical server and for the cluster.

Configuration analysis of passive nodes is not supported.

Operational Insights does not support grouping or linking computers running Windows Server that are part of the same failover cluster.

## Scaling your Operational Insights environment

When you plan your Operational Insights deployment (particularly when you analyze the number of Operations Manager agents that you want to transfer data through a single management group), consider the capacity of that server in terms of file space.

Consider the following variables:

- Number of agents per management group

- The average size of the data transferred from the agent to the management group per day. By default, each agent uploads CAB files to the management group twice per day. The size of the CAB files depends on the configuration of the server (such as number of SQL Server engines and number databases) and the health of the server (such as the number of alerts generated). In most cases, the daily upload size is typically less than 100 KB.

- Archival period for keeping data in the management group (the default is 5 days)

As an example, if you assume a daily upload size of 100 KB per agent and the default archival period, you would need the following storage for the management group:

<table border="1" cellspacing="4" cellpadding="4">
    <tbody>
    <tr align="left" valign="top">
		<td><b>Number of agents</b></td>
		<td><b>Estimated space required for the management group</b></td>
    </tr>
    <tr align="left" valign="top">
		<td>5</td>
		<td>~2.5 MB (5 agents x 100 KB data/day x 5 days = 2,500 KB)</td>
    </tr>
    <tr align="left" valign="top">
		<td>50</td>
		<td>~25 MB (50 agents x 100 KB data/day x 5 days = 25,000 KB)</td>
    </tr>

    </tbody>
    </table>

## Geographic locations

If you want to analyze data from servers in diverse geographic locations, consider having one management group per location. This can improve the performance of data transfer from the agent to the management group.

