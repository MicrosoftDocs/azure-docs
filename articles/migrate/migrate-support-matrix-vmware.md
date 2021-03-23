---
title: VMware assessment support in Azure Migrate
description: Learn about assessment support for servers running in VMware environment with Azure Migrate Discovery and assessment
author: vineetvikram
ms.author: vivikram
ms.manager: abhemraj
ms.topic: conceptual
ms.date: 03/17/2021
---

# Support matrix for VMware assessment 

This article summarizes prerequisites and support requirements when you discover and assess servers running in VMware environment for migration to Azure, using the [Azure Migrate: Discovery and assessment](migrate-services-overview.md#azure-migrate-discovery-and-assessment-tool) tool. To assess servers, you create a project, which adds the Azure Migrate: Discovery and assessment tool to the project. After the tool is added, you deploy the Azure Migrate appliance. The appliance continuously discovers on-premises servers, and sends configuration and performance metadata to Azure. After discovery is complete, you gather discovered servers into groups, and run an assessment for a group.

If you want to migrate VMware servers to Azure, review the [migration support matrix](migrate-support-matrix-vmware-migration.md).



## Limitations

**Requirement** | **Details**
--- | ---
**Project limits** | You can create multiple projects in an Azure subscription.<br/><br/> You can discover and assess up to 50,000 servers from VMware environment in a single [project](migrate-support-matrix.md#azure-migrate-projects). A project can also include physical servers, and servers from Hyper-V environment, up to the assessment limits.
**Discovery** | The Azure Migrate appliance can discover up to 10,000 servers on a vCenter Server.
**Assessment** | You can add up to 35,000 servers in a single group.<br/><br/> You can assess up to 35,000 servers in a single assessment.

[Learn more](concepts-assessment-calculation.md) about assessments.


## VMware requirements

**VMware** | **Details**
--- | ---
**vCenter Server** | Servers you want to discover and assess must be managed by vCenter Server version 5.5, 6.0, 6.5, 6.7 or 7.0.<br/><br/> The discovery of servers by providing ESXi host details in the appliance is currently not supported.
**Permissions** | Azure Migrate: Discovery and assessment need a vCenter Server read-only account for discovery and assessment.<br/><br/> If you want to perform discovery of software inventory and agentless dependency analysis, the account needs privileges enabled for **Virtual Machines** > **Guest Operations**.

## Server requirements
**VMware** | **Details**
--- | ---
**OS supported** | All Windows and Linux operating systems can be assessed for migration.
**Storage** | Disks attached to SCSI, IDE, and SATA-based controllers are supported.


## Azure Migrate appliance requirements

Azure Migrate uses the [Azure Migrate appliance](migrate-appliance.md) for discovery and assessment. You can deploy the appliance as a server in your VMware environment using an OVA template, imported into vCenter Server, or using a [PowerShell script](deploy-appliance-script.md).

- Learn about [appliance requirements](migrate-appliance.md#appliance---vmware) for VMware.
- In Azure Government, you must deploy the appliance [using the script](deploy-appliance-script-government.md).
- Review the URLs that the appliance needs to access in [public](migrate-appliance.md#public-cloud-urls) and [government](migrate-appliance.md#government-cloud-urls) clouds.


## Port access requirements

**Device** | **Connection**
--- | ---
**Appliance** | Inbound connections on TCP port 3389 to allow remote desktop connections to the appliance.<br/><br/> Inbound connections on port 44368 to remotely access the appliance management app using the URL: ```https://<appliance-ip-or-name>:44368``` <br/><br/>Outbound connections on port 443 (HTTPS), to send discovery and performance metadata to Azure Migrate.
**vCenter server** | Inbound connections on TCP port 443 to allow the appliance to collect configuration and performance metadata for assessments. <br/><br/> The appliance connects to vCenter on port 443 by default. If the vCenter server listens on a different port, you can modify the port when you set up discovery.
**ESXi hosts** | If you want to perform [discovery of software inventory](how-to-discover-applications.md), or [agentless dependency analysis](concepts-dependency-visualization.md#agentless-analysis), then the appliance connects to ESXi hosts on TCP port 443, to discover software inventory and dependencies on the servers.

## Application discovery requirements

In addition to discovering Servers, Azure Migrate: Discovery and assessment can discover software inventory running on servers. Application discovery allows you to identify and plan a migration path tailored for your on-premises workloads.

**Support** | **Details**
--- | ---
**Supported servers** | Currently supported for servers in your VMware environment only. You can perform application discovery on up to 10000 servers, from each Azure Migrate appliance.
**Operating systems** | Servers running all Windows and Linux versions are supported.
**VM requirements** | To perform discovery of software inventory, VMware tools must be installed and running on servers. <br/><br/> The VMware tools version must be later than 10.2.0.<br/><br/> Windows servers must have PowerShell version 2.0 or later installed.
**Discovery** | Application discovery on servers is performed from the vCenter Server, using VMware Tools installed on the servers. The appliance gathers the information about the software inventory from the vCenter Server, using vSphere APIs. Application discovery is agentless. No agent is installed on server, and the appliance doesn't connect directly to the servers. WMI and SSH should be enabled and available on Windows and Linux servers respectively.
**vCenter Server user account** | The vCenter Server read-only account used for assessment, needs privileges enabled for **Virtual Machines** > **Guest Operations**, in order to interact with the servers for application discovery.
**Server access** | You can add multiple domain and non-domain (Windows/Linux) credentials on the appliance configuration manager for application discovery.<br/><br/> You need a guest user account for Windows servers, and a regular/normal user account (non-sudo access) for all Linux servers.
**Port access** | The Azure Migrate appliance must be able to connect to TCP port 443 on ESXi hosts running servers on which you want to perform application discovery. The vCenter Server returns an ESXi host connection, to download the file containing the details of software inventory.

## Requirements for discovery of SQL Server instances and databases

> [!Note]
> Discovery and assessment of SQL Server instances and databases running in your VMware environment is now in preview. To try out this feature, use [**this link**](https://aka.ms/AzureMigrate/SQL) to create a project in **Australia East** region. If you already have a project in Australia East and want to try out this feature, please ensure that you have completed these [**prerequisites**](how-to-discover-sql-existing-project.md) on the portal.

[Application discovery](how-to-discover-applications.md) identifies the SQL Server instances. Using this information, appliance attempts to connect to respective SQL Server instances through the Windows authentication or SQL Server authentication credentials provided on the appliance. Once connected, appliance gathers configuration and performance data of SQL Server instances and databases. The SQL Server configuration data is updated once every 24 hours and the performance data are captured every 30 seconds.

**Support** | **Details**
--- | ---
**Supported servers** | Currently supported for SQL Servers in your VMware environment only. You can discover up to 300 SQL Server instances or 6000 SQL databases, whichever is lower.
**Windows servers** | Windows Server 2008 and above are supported.
**Linux Servers** | Not supported currently.
**Authentication mechanism** | Both Windows and SQL Server authentication are supported. You can provide credentials of both authentication types on the appliance configuration manager.
**SQL Server access** | Azure Migrate requires a Windows user account that is member of the sysadmin server role.
**SQL Server versions** | SQL Server 2008 and above are supported.
**SQL Server editions** | Enterprise, Standard, Developer, and Express editions are supported.
**Supported SQL configuration** | Currently discovery of only standalone SQL Server instances and corresponding databases is supported.<br/> Identification of Failover Cluster and Always On availability groups is not supported.
**Supported SQL services** | Only SQL Server Database Engine is supported. <br/> Discovery of SQL Server Reporting Services (SSRS), SQL Server Integration Services (SSIS), and SQL Server Analysis Services (SSAS) is not supported.

> [!Note]
> Azure Migrate will encrypt the communication between Azure Migrate appliance and source SQL Server instances (with Encrypt connection property set to TRUE). These connections are encrypted with [**TrustServerCertificate**](https://docs.microsoft.com/dotnet/api/system.data.sqlclient.sqlconnectionstringbuilder.trustservercertificate) (set to TRUE); the transport layer will use SSL to encrypt the channel and bypass the certificate chain to validate trust. The appliance server must be set up to [**trust the certificate's root authority**](https://docs.microsoft.com/sql/database-engine/configure-windows/enable-encrypted-connections-to-the-database-engine).<br/>
If no certificate has been provisioned on the server when it starts up, SQL Server generates a self-signed certificate which is used to encrypt login packets. [**Learn more**](https://docs.microsoft.com/sql/database-engine/configure-windows/enable-encrypted-connections-to-the-database-engine).

## Dependency analysis requirements (agentless)

[Dependency analysis](concepts-dependency-visualization.md) helps you to identify dependencies between on-premises servers that you want to assess and migrate to Azure. The table summarizes the requirements for setting up agentless dependency analysis.

**Support** | **Details**
--- | --- 
**Supported servers** | Currently supported for servers in your VMware environment only.
**Windows servers** | Windows Server 2016<br/> Windows Server 2012 R2<br/> Windows Server 2012<br/> Windows Server 2008 R2 (64-bit).<br/>Microsoft Windows Server 2008 (32-bit).
**Linux servers** | Red Hat Enterprise Linux 7, 6, 5<br/> Ubuntu Linux 14.04, 16.04<br/> Debian 7, 8<br/> Oracle Linux 6, 7<br/> CentOS 5, 6, 7.<br/> SUSE Linux Enterprise Server 11 and later.
**Server requirements** | VMware Tools (later than 10.2.0) must be installed and running on servers you want to analyze.<br/><br/> Servers must have PowerShell version 2.0 or later installed.
**Discovery method** |  Dependency information between servers is gathered from the vCenter Server, using VMware tools installed on the server. The appliance gathers the information from the vCenter Server, using vSphere APIs. No agent is installed on the server, and the appliance doesn’t connect directly to servers. WMI and SSH should be enabled and available on Windows and Linux servers respectively.
**vCenter account** | The read-only account used by Azure Migrate for assessment needs privileges enabled for **Virtual Machines > Guest Operations**.
**Windows server permissions** |  A user account (local or domain) with administrative permissions on servers.
**Linux account** | Root user account, or an account with these permissions on /bin/netstat and /bin/ls files: CAP_DAC_READ_SEARCH and CAP_SYS_PTRACE.<br/><br/> Set these capabilities using the following commands: <br/><br/> sudo setcap CAP_DAC_READ_SEARCH,CAP_SYS_PTRACE=ep /bin/ls<br/><br/> sudo setcap CAP_DAC_READ_SEARCH,CAP_SYS_PTRACE=ep /bin/netstat
**Port access** | The Azure Migrate appliance must be able to connect to TCP port 443 on ESXi hosts running the servers whose dependencies you want to discover. The vCenter Server returns an ESXi host connection, to download the file containing the dependency data.


## Dependency analysis requirements (agent-based)

[Dependency analysis](concepts-dependency-visualization.md) helps you to identify dependencies between on-premises servers that you want to assess and migrate to Azure. The table summarizes the requirements for setting up agent-based dependency analysis.

**Requirement** | **Details** 
--- | --- 
**Before deployment** | You should have a project in place, with the Azure Migrate: Discovery and assessment tool added to the project.<br/><br/>  You deploy dependency visualization after setting up an Azure Migrate appliance to discover your on-premises servers.<br/><br/> [Learn how](create-manage-projects.md) to create a project for the first time.<br/> [Learn how](how-to-assess.md) to add a discovery and  assessment tool to an existing project.<br/> Learn how to set up the Azure Migrate appliance for assessment of [Hyper-V](how-to-set-up-appliance-hyper-v.md), [VMware](how-to-set-up-appliance-vmware.md), or physical servers.
**Supported servers** | Supported for all servers in your on-premises environment.
**Log Analytics** | Azure Migrate uses the [Service Map](../azure-monitor/insights/service-map.md) solution in [Azure Monitor logs](../azure-monitor/log-query/log-query-overview.md) for dependency visualization.<br/><br/> You associate a new or existing Log Analytics workspace with a project. The workspace for a project can't be modified after it's added. <br/><br/> The workspace must be in the same subscription as the project.<br/><br/> The workspace must reside in the East US, Southeast Asia, or West Europe regions. Workspaces in other regions can't be associated with a project.<br/><br/> The workspace must be in a region in which [Service Map is supported](../azure-monitor/insights/vminsights-configure-workspace.md#supported-regions).<br/><br/> In Log Analytics, the workspace associated with Azure Migrate is tagged with the Project key, and the project name.
**Required agents** | On each server you want to analyze, install the following agents:<br/><br/> The [Microsoft Monitoring agent (MMA)](../azure-monitor/platform/agent-windows.md).<br/> The [Dependency agent](../azure-monitor/platform/agents-overview.md#dependency-agent).<br/><br/> If on-premises servers aren't connected to the internet, you need to download and install Log Analytics gateway on them.<br/><br/> Learn more about installing the [Dependency agent](how-to-create-group-machine-dependencies.md#install-the-dependency-agent) and [MMA](how-to-create-group-machine-dependencies.md#install-the-mma).
**Log Analytics workspace** | The workspace must be in the same subscription as the project.<br/><br/> Azure Migrate supports workspaces residing in the East US, Southeast Asia, and West Europe regions.<br/><br/>  The workspace must be in a region in which [Service Map is supported](../azure-monitor/insights/vminsights-configure-workspace.md#supported-regions).<br/><br/> The workspace for a project can't be modified after it's added.
**Cost** | The Service Map solution doesn't incur any charges for the first 180 days (from the day that you associate the Log Analytics workspace with the project)/<br/><br/> After 180 days, standard Log Analytics charges will apply.<br/><br/> Using any solution other than Service Map in the associated Log Analytics workspace will incur [standard charges](https://azure.microsoft.com/pricing/details/log-analytics/) for Log Analytics.<br/><br/> When the project is deleted, the workspace is not deleted along with it. After deleting the project, Service Map usage isn't free, and each node will be charged as per the paid tier of Log Analytics workspace/<br/><br/>If you have projects that you created before Azure Migrate general availability (GA- 28 February 2018), you might have incurred additional Service Map charges. To ensure payment after 180 days only, we recommend that you create a new project, since existing workspaces before GA are still chargeable.
**Management** | When you register agents to the workspace, you use the ID and key provided by the project.<br/><br/> You can use the Log Analytics workspace outside Azure Migrate.<br/><br/> If you delete the associated project, the workspace isn't deleted automatically. [Delete it manually](../azure-monitor/platform/manage-access.md).<br/><br/> Don't delete the workspace created by Azure Migrate, unless you delete the project. If you do, the dependency visualization functionality will not work as expected.
**Internet connectivity** | If servers aren't connected to the internet, you need to install the Log Analytics gateway on them.
**Azure Government** | Agent-based dependency analysis isn't supported.


## Next steps

- [Review](best-practices-assessment.md) best practices for creating assessments.
- [Prepare for VMware](./tutorial-discover-vmware.md) assessment.