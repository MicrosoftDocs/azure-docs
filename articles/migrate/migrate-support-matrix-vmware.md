---
title: VMware server discovery support in Azure Migrate
description: Learn about Azure Migrate discovery and assessment support for servers in a VMware environment.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: conceptual
ms.date: 03/17/2021
---

# Support matrix for VMware discovery 

This article summarizes prerequisites and support requirements for using the [Azure Migrate: Discovery and assessment](migrate-services-overview.md#azure-migrate-discovery-and-assessment-tool) tool to discover and assess servers in a VMware environment for migration to Azure.

To assess servers, first, create an Azure Migrate project. The Azure Migrate: Discovery and assessment tool is automatically added to the project. Then, deploy the Azure Migrate appliance. The appliance continuously discovers on-premises servers and sends configuration and performance metadata to Azure. When discovery is finished, gather discovered servers into groups and run assessments per group.

As you plan your migration of VMware servers to Azure, review the [migration support matrix](migrate-support-matrix-vmware-migration.md).

## Limitations

Requirement | Details
--- | ---
**Project limits** | You can create multiple Azure Migrate projects in an Azure subscription.<br /><br /> You can discover and assess up to 50,000 servers in a VMware environment in a single [project](migrate-support-matrix.md#project). A project can include physical servers and servers from a Hyper-V environment, up to the assessment limits.
**Discovery** | The Azure Migrate appliance can discover up to 10,000 servers on a server running vCenter Server.
**Assessment** | You can add up to 35,000 servers in a single group.<br /><br /> You can assess up to 35,000 servers in a single assessment.

Learn more about [assessments](concepts-assessment-calculation.md).

## VMware requirements

VMware | Details
--- | ---
**vCenter Server** | Servers that you want to discover and assess must be managed by vCenter Server version 7.0, 6.7, 6.5, 6.0, or 5.5.<br /><br /> Discovering servers by providing ESXi host details in the appliance currently isn't supported. <br /><br /> IPv6 addresses are not supported for vCenter Server (for discovery and assessment of servers) and ESXi hosts (for replication of servers).
**Permissions** | The Azure Migrate: Discovery and assessment tool requires a vCenter Server read-only account.<br /><br /> If you want to use the tool for software inventory and agentless dependency analysis, the account must have privileges for guest operations on VMware VMs.

## Server requirements

VMware | Details
--- | ---
**Operating systems** | All Windows and Linux operating systems can be assessed for migration.
**Storage** | Disks attached to SCSI, IDE, and SATA-based controllers are supported.

## Azure Migrate appliance requirements

Azure Migrate uses the [Azure Migrate appliance](migrate-appliance.md) for discovery and assessment. You can deploy the appliance as a server in your VMware environment by using a VMware Open Virtualization Appliance (OVA) template that's imported into vCenter Server or by using a [PowerShell script](deploy-appliance-script.md). Learn about [appliance requirements for VMware](migrate-appliance.md#appliance---vmware).

Here are more requirements for the appliance:

- In Azure Government, you must deploy the appliance by using a [script](deploy-appliance-script-government.md).
- The appliance must be able to access specific URLs in [public clouds](migrate-appliance.md#public-cloud-urls) and [government clouds](migrate-appliance.md#government-cloud-urls).

## Port access requirements

Device | Connection
--- | ---
**Azure Migrate Appliance** | Inbound connections on TCP port 3389 to allow remote desktop connections to the appliance.<br /><br /> Inbound connections on port 44368 to remotely access the appliance management app by using the URL `https://<appliance-ip-or-name>:44368`. <br /><br />Outbound connections on port 443 (HTTPS) to send discovery and performance metadata to Azure Migrate.
**vCenter Server** | Inbound connections on TCP port 443 to allow the appliance to collect configuration and performance metadata for assessments. <br /><br /> The appliance connects to vCenter on port 443 by default. If vCenter Server listens on a different port, you can modify the port when you set up discovery.
**ESXi hosts** | For [discovery of software inventory](how-to-discover-applications.md) or [agentless dependency analysis](concepts-dependency-visualization.md#agentless-analysis), the appliance connects to ESXi hosts on TCP port 443 to discover software inventory and dependencies on the servers.

## Software inventory requirements

In addition to discovering servers, Azure Migrate: Discovery and assessment can perform software inventory on servers. Software inventory allows you to identify and plan a migration path tailored for your on-premises workloads.

Support | Details
--- | ---
**Supported servers** | Currently supported only for servers in your VMware environment. You can perform software inventory on up to 10,000 servers from each Azure Migrate appliance.
**Operating systems** | Servers running all Windows and Linux versions are supported.
**VM requirements** | For software inventory, VMware Tools must be installed and running on your servers. <br /><br /> The VMware Tools version must be version 10.2.1 or later.<br /><br /> Windows servers must have PowerShell version 2.0 or later installed.
**Discovery** | Software inventory is performed from vCenter Server by using VMware Tools installed on the servers. The appliance gathers the information about the software inventory from the server running  vCenter Server through vSphere APIs. Software inventory is agentless. No agent is installed on the server, and the appliance doesn't connect directly to the servers. WMI must be enabled and available on Windows servers to gather the details of the roles and features installed on the servers.
**vCenter Server user account** | To interact with the servers for software inventory, the vCenter Server read-only account that's used for assessment must have privileges for guest operations on VMware VMs.
**Server access** | You can add multiple domain and non-domain (Windows/Linux) credentials in the appliance configuration manager for software inventory.<br /><br /> You must have a guest user account for Windows servers and a standard user account (non-`sudo` access) for all Linux servers.
**Port access** | The Azure Migrate appliance must be able to connect to TCP port 443 on ESXi hosts running servers on which you want to perform software inventory. The server running vCenter Server returns an ESXi host connection to download the file that contains the details of the software inventory.

## SQL Server instance and database discovery requirements

[Software inventory](how-to-discover-applications.md) identifies SQL Server instances. Using this information, the appliance attempts to connect to respective SQL Server instances through the Windows authentication or SQL Server authentication credentials that are provided in the appliance configuration manager. Appliance can connect to only those SQL Server instances to which it has network line of sight, whereas software inventory by itself may not need network line of sight.

After the appliance is connected, it gathers configuration and performance data for SQL Server instances and databases. SQL Server configuration data is updated once every 24 hours. Performance data is captured every 30 seconds.

Support | Details
--- | ---
**Supported servers** | Currently supported only for servers running SQL Server in your VMware environment. You can discover up to 300 SQL Server instances or 6,000 SQL databases, whichever is less.
**Windows servers** | Windows Server 2008 and later are supported.
**Linux servers** | Currently not supported.
**Authentication mechanism** | Both Windows and SQL Server authentication are supported. You can provide credentials of both authentication types in the appliance configuration manager.
**SQL Server access** | Azure Migrate requires a Windows user account that is a member of the sysadmin server role.
**SQL Server versions** | SQL Server 2008 and later are supported.
**SQL Server editions** | Enterprise, Standard, Developer, and Express editions are supported.
**Supported SQL configuration** | Currently, only discovery for standalone SQL Server instances and corresponding databases is supported.<br /><br /> Identification of Failover Cluster and Always On availability groups is not supported.
**Supported SQL services** | Only SQL Server Database Engine is supported. <br /><br /> Discovery of SQL Server Reporting Services (SSRS), SQL Server Integration Services (SSIS), and SQL Server Analysis Services (SSAS) is not supported.

> [!NOTE]
> By default, Azure Migrate uses the most secure way of connecting to SQL instances i.e. Azure Migrate encrypts communication between the Azure Migrate appliance and the source SQL Server instances by setting the TrustServerCertificate property to `true`. Additionally, the transport layer uses SSL to encrypt the channel and bypass the certificate chain to validate trust. Hence, the appliance server must be set up to trust the certificate's root authority. 
>
> However, you can modify the connection settings, by selecting **Edit SQL Server connection properties** on the appliance.[Learn more](/sql/database-engine/configure-windows/enable-encrypted-connections-to-the-database-engine) to understand what to choose.

## ASP.NET web apps discovery requirements

[Software inventory](how-to-discover-applications.md) identifies web server role existing on discovered servers. If a server is found to have web server role enabled, Azure Migrate will perform web apps discovery on the server.
User can add both domain and non-domain credentials on appliance. Please make sure that the account used has local admin privileges on source servers. Azure Migrate automatically maps credentials to the respective servers, so one doesn’t have to map them manually. Most importantly, these credentials are never sent to Microsoft and remain on the appliance running in source environment.
After the appliance is connected, it gathers configuration data for IIS web server and ASP.NET web apps. Web apps configuration data is updated once every 24 hours.

Support | Details
--- | ---
**Supported servers** | Currently supported only for windows servers running IIS in your VMware environment.
**Windows servers** | Windows Server 2008 R2 and later are supported.
**Linux servers** | Currently not supported.
**IIS access** | Web apps discovery requires a local admin user account.
**IIS versions** | IIS 7.5 and later are supported.

> [!NOTE]
> Data is always encrypted at rest and during transit.

## Dependency analysis requirements (agentless)

[Dependency analysis](concepts-dependency-visualization.md) helps you identify dependencies between on-premises servers that you want to assess and migrate to Azure. The following table summarizes the requirements for setting up agentless dependency analysis:

Support | Details
--- | ---
**Supported servers** | Currently supported only for servers in your VMware environment.
**Windows servers** | Windows Server 2019<br />Windows Server 2016<br /> Windows Server 2012 R2<br /> Windows Server 2012<br /> Windows Server 2008 R2 (64-bit)<br />Microsoft Windows Server 2008 (32-bit)
**Linux servers** | Red Hat Enterprise Linux 7, 6, 5<br /> Ubuntu Linux 16.04, 14.04<br /> Debian 8, 7<br /> Oracle Linux 7, 6<br /> CentOS 7, 6, 5<br /> SUSE Linux Enterprise Server 11 and later
**Server requirements** | VMware Tools (10.2.1 and later) must be installed and running on servers you want to analyze.<br /><br /> Servers must have PowerShell version 2.0 or later installed.
**Discovery method** |  Dependency information between servers is gathered by using VMware Tools installed on the server running vCenter Server. The appliance gathers the information from the server by using vSphere APIs. No agent is installed on the server, and the appliance doesn’t connect directly to servers. WMI should be enabled and available on Windows servers.
**vCenter account** | The read-only account used by Azure Migrate for assessment must have privileges for guest operations on VMware VMs.
**Windows server permissions** |  A user account (local or domain) with administrator permissions on servers.
**Linux account** | A root user account, or an account that has these permissions on /bin/netstat and /bin/ls files: <br />CAP_DAC_READ_SEARCH<br /> CAP_SYS_PTRACE<br /><br /> Set these capabilities by using the following commands:<br /><code>sudo setcap CAP_DAC_READ_SEARCH,CAP_SYS_PTRACE=ep /bin/ls<br /> sudo setcap CAP_DAC_READ_SEARCH,CAP_SYS_PTRACE=ep /bin/netstat</code>
**Port access** | The Azure Migrate appliance must be able to connect to TCP port 443 on ESXi hosts running the servers that have dependencies you want to discover. The server running vCenter Server returns an ESXi host connection to download the file containing the dependency data.

## Dependency analysis requirements (agent-based)

[Dependency analysis](concepts-dependency-visualization.md) helps you identify dependencies between on-premises servers that you want to assess and migrate to Azure. The following table summarizes the requirements for setting up agent-based dependency analysis:

Requirement | Details
--- | ---
**Before deployment** | You should have a project in place, with the Azure Migrate: Discovery and assessment tool added to the project.<br /><br />Deploy dependency visualization after setting up an Azure Migrate appliance to discover your on-premises servers.<br /><br />Learn how to [create a project for the first time](create-manage-projects.md).<br /> Learn how to [add a discovery and  assessment tool to an existing project](how-to-assess.md).<br /> Learn how to set up the Azure Migrate appliance for assessment of [Hyper-V](how-to-set-up-appliance-hyper-v.md), [VMware](how-to-set-up-appliance-vmware.md), or physical servers.
**Supported servers** | Supported for all servers in your on-premises environment.
**Log Analytics** | Azure Migrate uses the [Service Map](../azure-monitor/vm/service-map.md) solution in [Azure Monitor logs](../azure-monitor/logs/log-query-overview.md) for dependency visualization.<br /><br /> You associate a new or existing Log Analytics workspace with a project. The workspace for a project can't be modified after the workspace is added. <br /><br /> The workspace must be in the same subscription as the project.<br /><br /> The workspace must be located in the East US, Southeast Asia, or West Europe regions. Workspaces in other regions can't be associated with a project.<br /><br /> The workspace must be in a [region in which Service Map is supported](../azure-monitor/vm/vminsights-configure-workspace.md#supported-regions).<br /><br /> In Log Analytics, the workspace that's associated with Azure Migrate is tagged with the project key and project name.
**Required agents** | On each server that you want to analyze, install the following agents:<br />- [Microsoft Monitoring Agent (MMA)](../azure-monitor/agents/agent-windows.md)<br />- [Dependency agent](../azure-monitor/agents/agents-overview.md#dependency-agent)<br /><br /> If on-premises servers aren't connected to the internet, download and install the Log Analytics gateway on them.<br /><br /> Learn more about installing the [Dependency agent](how-to-create-group-machine-dependencies.md#install-the-dependency-agent) and the [MMA](how-to-create-group-machine-dependencies.md#install-the-mma).
**Log Analytics workspace** | The workspace must be in the same subscription as the project.<br /><br /> Azure Migrate supports workspaces that are located in the East US, Southeast Asia, and West Europe regions.<br /><br />  The workspace must be in a region in which [Service Map is supported](../azure-monitor/vm/vminsights-configure-workspace.md#supported-regions).<br /><br /> The workspace for a project can't be modified after the workspace is added.
**Cost** | The Service Map solution doesn't incur any charges for the first 180 days (from the day you associate the Log Analytics workspace with the project).<br /><br /> After 180 days, standard Log Analytics charges apply.<br /><br /> Using any solution other than Service Map in the associated Log Analytics workspace will incur [standard charges](https://azure.microsoft.com/pricing/details/log-analytics/) for Log Analytics.<br /><br /> When the project is deleted, the workspace is not automatically deleted. After deleting the project, Service Map usage isn't free, and each node will be charged per the paid tier of Log Analytics workspace.<br /><br />If you have projects that you created before Azure Migrate general availability (February 28, 2018), you might have incurred additional Service Map charges. To ensure that you are charged only after 180 days, we recommend that you create a new project. Workspaces that were created before GA are still chargeable.
**Management** | When you register agents to the workspace, use the ID and key provided by the project.<br /><br /> You can use the Log Analytics workspace outside Azure Migrate.<br /><br /> If you delete the associated project, the workspace isn't deleted automatically. [Delete it manually](../azure-monitor/logs/manage-access.md).<br /><br /> Don't delete the workspace created by Azure Migrate, unless you delete the project. If you do, the dependency visualization functionality won't work as expected.
**Internet connectivity** | If servers aren't connected to the internet, install the Log Analytics gateway on the servers.
**Azure Government** | Agent-based dependency analysis isn't supported.

## Next steps

- Review [assessment best practices](best-practices-assessment.md).
- Learn how to [prepare for a VMware assessment](./tutorial-discover-vmware.md).