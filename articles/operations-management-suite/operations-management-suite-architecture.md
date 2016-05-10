<properties 
   pageTitle="Operations Management Suite (OMS) architecture | Microsoft Azure"
   description="Microsoft Operations Management Suite (OMS) is Microsoft's cloud based IT management solution that helps you manage and protect your on-premises and cloud infrastructure.  This article identifies the different services included in OMS and provides links to their detailed content."
   services="operations-management-suite"
   documentationCenter=""
   authors="bwren"
   manager="jwhit"
   editor="tysonn" />
<tags 
   ms.service="operations-management-suite"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="05/09/2016"
   ms.author="bwren" />

# OMS architecture

[Operations Management Suite (OMS)](https://azure.microsoft.com/documentation/services/operations-management-suite/) is a collection of cloud based services for managing your on-premise and cloud environments.  This article describes the different on-premise and cloud components of OMS and their high level cloud computing architecture.  You can refer to the documentation for each service for further details.

## Log Analytics

The following diagram shows the relationship between the different OMS components used by [Log Analytics](https://azure.microsoft.com/documentation/services/log-analytics/).  The following sections provide a description of each component in the diagram.

![Log Analytics high level architecture](media/operations-management-suite-architecture/log-analytics.png)

## OMS workspace

The data and resources managed by Log Analytics are organized in an OMS Workspace. You can think of the workspace as a unique OMS environment with its own data repository and its own set of data sources.  You may create multiple workspaces in your subscription to support multiple environments such as production and test.

## OMS repository

All data collected by Log Analytics is stored in the OMS repository which is hosted in Azure.  Each OMS workspace has its own OMS repository.  

## OMS portal

OMS has a web based portal that you can use to manage OMS resources, add and configure OMS solutions, and view and analyze data in the OMS repository.

## Connected sources

Connected Sources generate data collected into the OMS repository.  There are currently three types of connected sources supported as described below.

### Agents

An agent is a Windows or Linux computer connected directly to OMS.  Agents download configurations for data sources and solutions and deliver their data to Log Analytics to be stored in the OMS repository.  [Windows computers](../log-analytics/log-analytics-windows-agents.md) connect directly to Log Analytics by installing the Microsoft Management Agent (MMA) which is the same agent used to connect System Center Operations Manager (SCOM).  [Linux computers](../log-analytics/log-analytics-linux-agents.md) can connect with the Operations Management Suite Agent for Linux which is currently in public preview.

### System Center Operations Manager

A System Center Operations Manager (SCOM) management group can be [connected to Log Analytics](../log-analytics/log-analytics-om-agents.md) so that data can be collected from the SCOM agents.  Agents continue to communicate with SCOM management servers which forward events and performance data to OMS along with management group data such as alerts.  Some solutions send data directly to OMS from the SCOM agent.

### Azure storage account

[Azure Diagnostics](../cloud-services/cloud-services-dotnet-diagnostics.md) allows you to collect diagnostics data from a worker role, web role, or virtual machine in Azure.  This data is stored in an Azure storage account that can be [used as a data source by OMS](../log-analytics/log-analytics-azure-storage.md).

## Data sources and solutions

Data sources define the data that Log Analytics collects from connected sources including event logs and performance counters.  Solutions add functionality to OMS and can easily be added to your workspace from the [OMS Solutions Gallery](../log-analytics/log-analytics-add-solutions.md).  New solutions are continuously added to OMS which allows you to further increase the value of your investment.  Some solutions, such as [Alert Management](../log-analytics/log-analytics-solution-alert-management.md) and [Capacity Management](../log-analytics/log-analytics-solution-capacity-management.md), may require a connection to SCOM.  Other solutions may require an additional agent to be installed.

## Log searches

[Log Searches](../log-analytics/log-analytics-log-searches.md) allow you to build your own logic to retrieve and analyze data from the OMS repository.  This allows you to perform custom analysis and relate information across data sources and solutions.  Log queries also provide the basis of other functionality such as generating an alert or may be exported to other analysis tools such as Power BI.

Solutions will typically provide components in the OMS Dashboard for accessing and analyzing data that they collect.  For example, the [Security and Audit](../log-analytics/log-analytics-security-audit.md) solution provides several views that provide quick summaries of such information as the count of specific notable issues in the managed environment.  You can click on any of the summaries to view the detailed information behind them.

# Azure services

OMS includes some Azure services that do not currently write data to the OMS repository.  Each of these services has an OMS solution that provides some information through the OMS portal, but you must use the Azure portal to perform most management functions.  The following sections describes the high level implementation of these services.  You can refer to their documentation for further details.

## Azure Automation

[Azure Automation runbooks](http://azure.microsoft.com/documentation/services/automation) are executed in the Azure cloud and can access resources that are in Azure, in other cloud services, or accessible from the public Internet.  You can also designate on-premise machines in your local data center using [Hybrid Runbook Worker](../automation/automation-hybrid-runbook-worker.md) so that runbooks can access local resources.

[DSC configurations](http://azure.microsoft.com/documentation/articles/automation-dsc-overview) stored in Azure Automation can be directly applied to Azure virtual machines.  Other physical and virtual machines can request configurations from the Azure Automation DSC pull server.

Azure Automation has an OMS solution that displays statistics and links to launch the Azure portal for any operations.

![Azure Automation high level architecture](media/operations-management-suite-architecture/automation.png)

## Azure Backup

Protected data in [Azure Backup](http://azure.microsoft.com/documentation/services/backup) is stored in a backup vault located in a particular geographic region.  The data is replicated within the same region and, depending on the type of vault, may also be replicated to another region for further redundancy.

Azure Backup has three fundamental scenarios.

- Windows machine with Azure Backup agent.  This allows you to backup files and folders from any Windows server or client directly to your Azure backup vault.  
- System Center Data Protection Manager (DPM) or Microsoft Azure Backup Server.  Server. This allows you to leverage DPM or Microsoft Azure Backup Server to backup files and folders in addition to application workloads such as SQL and SharePoint to local storage and then replicate to your Azure backup vault.
- Azure Virtual Machine Extensions.  This allows you to backup Azure virtual machines to your Azure backup vault.

Azure Backup has an OMS solution that displays statistics and links to launch the Azure portal for any operations.

![Azure Backup high level architecture](media/operations-management-suite-architecture/backup.png)

## Azure Site Recovery

[Azure Site Recovery](http://azure.microsoft.com/documentation/services/site-recovery) orchestrates replication, failover, and failback of virtual machines and physical servers. Replication data is exchanged between Hyper-V hosts, VMware hypervisors, and physical servers in primary and secondary datacenters, or between the datacenter and Azure storage.  Site Recovery stores metadata in vaults located in a particular geographic Azure region. No replicated data is stored by the Site Recovery service.

Azure Site Recovery has three fundamental replication scenarios.

**Replication of Hyper-V virtual machines**
- If Hyper-V virtual machines are managed in VMM clouds, you can replicate to a secondary data center or to Azure storage.  Replication to Azure is over a secure internet connection.  Replication to a secondary datacenter is over the LAN.
- If Hyper-V virtual machines aren’t managed by VMM, you can replicate to Azure storage only.  Replication to Azure is over a secure internet connection.
 
**Replication of VMWare virtual machines**
- You can replicate VMware virtual machines to a secondary datacenter running VMware or to Azure storage.  Replication to Azure can occur over a site-to-site VPN or Azure ExpressRoute or over a secure Internet connection. Replication to a secondary datacenter occurs over the InMage Scout data channel.
 
**Replication of physical Windows and Linux servers** 
- You can replicate physical servers to a secondary datacenter or to Azure storage. Replication to Azure can occur over a site-to-site VPN or Azure ExpressRoute or over a secure Internet connection. Replication to a secondary datacenter occurs over the InMage Scout data channel.  Azure Site Recovery has an OMS solution that displays some statistics, but you must use the Azure portal for any operations.

![Azure Site Recovery high level architecture](media/operations-management-suite-architecture/site-recovery.png)


## Next steps

- Learn about [Log Analytics](http://azure.microsoft.com/documentation/services/log-analytics).
- Learn about [Azure Automation](https://azure.microsoft.com/documentation/services/automation).
- Learn about [Azure Backup](http://azure.microsoft.com/documentation/services/backup).
- Learn about [Azure Site Recovery](http://azure.microsoft.com/documentation/services/site-recovery).