---
title: Support for physical discovery and assessment in Azure Migrate
description: Learn about support for physical discovery and assessment with Azure Migrate Discovery and assessment
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: conceptual
ms.date: 03/18/2021
---

# Support matrix for physical server discovery and assessment 

This article summarizes prerequisites and support requirements when you assess physical servers for migration to Azure, using the [Azure Migrate: Discovery and assessment](migrate-services-overview.md#azure-migrate-discovery-and-assessment-tool) tool. If you want to migrate physical servers to Azure, review the [migration support matrix](migrate-support-matrix-physical-migration.md).

To assess physical servers, you create a project, and add the Azure Migrate: Discovery and assessment tool to the project. After the tool is added, you deploy the [Azure Migrate appliance](migrate-appliance.md). The appliance continuously discovers on-premises servers, and sends servers metadata and performance data to Azure. After discovery is complete, you gather discovered servers into groups, and run an assessment for a group.

## Limitations

**Support** | **Details**
--- | ---
**Assessment limits** | You can discover and assess up to 35,000 physical servers in a single [project](migrate-support-matrix.md#project).
**Project limits** | You can create multiple projects in an Azure subscription. In addition to physical servers, a project can include servers on VMware and on Hyper-V, up to the assessment limits for each.
**Discovery** | The Azure Migrate appliance can discover up to 1000 physical servers.
**Assessment** | You can add up to 35,000 servers in a single group.<br/><br/> You can assess up to 35,000 servers in a single assessment.

[Learn more](concepts-assessment-calculation.md) about assessments.

## Physical server requirements

**Physical server deployment:** The physical server can be standalone, or deployed in a cluster.

**Type of servers:** Bare metal servers, virtualized servers running on-premises or other clouds like AWS, GCP, Xen etc.
>[!Note]
> Currently, Azure Migrate does not support the discovery of para-virtualized servers.

**Operating system:** All Windows and Linux operating systems can be assessed for migration.

**Permissions:**

Set up an account that the appliance can use to access the physical servers.

**Windows servers**

For Windows servers, use a domain account for domain-joined servers, and a local account for servers that aren't domain-joined. The user account can be created in one of the two ways:

### Option 1

- Create an account that has administrator privileges on the servers. This account can be used to pull configuration and performance data through CIM connection and perform software inventory (discovery of installed applications) and enable agentless dependency analysis using PowerShell remoting.

> [!Note]
> If you want to perform software inventory (discovery of installed applications) and enable agentless dependency analysis on Windows servers, it recommended to use Option 1.

### Option 2
- The user account should be added to these groups: Remote Management Users, Performance Monitor Users, and Performance Log Users.
- If Remote management Users group isn't present, then add user account to the group: **WinRMRemoteWMIUsers_**.
- The account needs these permissions for appliance to create a CIM connection with the server and pull the required configuration and performance metadata from the WMI classes listed here.
- In some cases, adding the account to these groups may not return the required data from WMI classes as the account might be filtered by [UAC](/windows/win32/wmisdk/user-account-control-and-wmi). To overcome the UAC filtering, user account needs to have necessary permissions on CIMV2 Namespace and sub-namespaces on the target server. You can follow the steps [here](troubleshoot-appliance.md) to enable the required permissions.

    > [!Note]
    > For Windows Server 2008 and 2008 R2, ensure that WMF 3.0 is installed on the servers.

**Linux servers**

For Linux servers, based on the features you want to perform, you can create a user account in one of three ways:

### Option 1
- You need a root account on the servers that you want to discover. This account can be used to pull configuration and performance metadata, perform software inventory (discovery of installed applications) and enable agentless dependency analysis.

> [!Note]
> If you want to perform software inventory (discovery of installed applications) and enable agentless dependency analysis on Linux servers, it recommended to use Option 1.

### Option 2
- To discover the configuration and performance metadata from Linux servers, you can provide a user account with sudo permissions.
- The support to add a user account with sudo access is provided by default with the new appliance installer script downloaded from portal after July 20, 2021.
- For older appliances, you can enable the capability by following these steps:
    1. On the server running the appliance, open the Registry Editor.
    1. Navigate to HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\AzureAppliance.
    1. Create a registry key ‘isSudo’ with DWORD value of 1.

    :::image type="content" source="./media/tutorial-discover-physical/issudo-reg-key.png" alt-text="Screenshot that shows how to enable sudo support.":::

- For the sudo user, you need to provide the bin/bash NOPASSWD permission in the sudoers file in addition to the commands mentioned in the table [here](discovered-metadata.md#linux-server-metadata).
- The following Linux OS distributions are supported for discovery by Azure Migrate using an account with sudo access:

    Operating system | Versions 
    --- | ---
    Red Hat Enterprise Linux | 6,7,8
    Cent OS | 6.6, 8.2
    Ubuntu | 14.04,16.04,18.04
    SUSE Linux | 11.4, 12.4
    Debian | 7, 10
    Amazon Linux | 2.0.2021
    CoreOS Container | 2345.3.0
    > [!Note]
    > 'Sudo' account is currently not supported to perform software inventory (discovery of installed applications) and enable agentless dependency analysis.

### Option 3
- If you can't provide root account or user account with sudo access, then you can set 'isSudo' registry key to value '0' in HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\AzureAppliance registry and provide a non-root account with the required capabilities using the following commands:

    **Command** | **Purpose**
    --- | --- |
    setcap CAP_DAC_READ_SEARCH+eip /usr/sbin/fdisk <br></br> setcap CAP_DAC_READ_SEARCH+eip /sbin/fdisk _(if /usr/sbin/fdisk is not present)_ | To collect disk configuration data
    setcap "cap_dac_override,cap_dac_read_search,cap_fowner,cap_fsetid,cap_setuid,<br> cap_setpcap,cap_net_bind_service,cap_net_admin,cap_sys_chroot,cap_sys_admin,<br> cap_sys_resource,cap_audit_control,cap_setfcap=+eip" /sbin/lvm | To collect disk performance data
    setcap CAP_DAC_READ_SEARCH+eip /usr/sbin/dmidecode | To collect BIOS serial number
    chmod a+r /sys/class/dmi/id/product_uuid | To collect BIOS GUID

    To perform agentless dependency analysis on the server, ensure that you also set the required permissions on /bin/netstat and /bin/ls files by using the following commands:<br /><code>sudo setcap CAP_DAC_READ_SEARCH,CAP_SYS_PTRACE=ep /bin/ls<br /> sudo setcap CAP_DAC_READ_SEARCH,CAP_SYS_PTRACE=ep /bin/netstat</code>

## Azure Migrate appliance requirements

Azure Migrate uses the [Azure Migrate appliance](migrate-appliance.md) for discovery and assessment. The appliance for physical servers can run on a VM or a physical server.

- Learn about [appliance requirements](migrate-appliance.md#appliance---physical) for physical servers.
- Learn about URLs that the appliance needs to access in [public](migrate-appliance.md#public-cloud-urls) and [government](migrate-appliance.md#government-cloud-urls) clouds.
- You set up the appliance using a [PowerShell script](how-to-set-up-appliance-physical.md) that you download from the Azure portal.
In Azure Government, deploy the appliance [using this script](deploy-appliance-script-government.md).

## Port access

The following table summarizes port requirements for assessment.

**Device** | **Connection**
--- | ---
**Appliance** | Inbound connections on TCP port 3389, to allow remote desktop connections to the appliance.<br/><br/> Inbound connections on port 44368, to remotely access the appliance management app using the URL: ``` https://<appliance-ip-or-name>:44368 ```<br/><br/> Outbound connections on ports 443 (HTTPS), to send discovery and performance metadata to Azure Migrate.
**Physical servers** | **Windows:** Inbound connection on WinRM port 5985 (HTTP) to pull configuration and performance metadata from Windows servers. <br/><br/> **Linux:**  Inbound connections on port 22 (TCP), to pull configuration and performance metadata from Linux servers. |

## Software inventory requirements

In addition to discovering servers, Azure Migrate: Discovery and assessment can perform software inventory on servers. Software inventory provides the list of applications, roles and features running on Windows and Linux servers, discovered using Azure Migrate. It helps you to identify and plan a migration path tailored for your on-premises workloads.

Support | Details
--- | ---
**Supported servers** | You can perform software inventory on up to 1,000 servers discovered from each Azure Migrate appliance.
**Operating systems** | Servers running all Windows and Linux versions that meet the server requirements and have the required access permissions are supported.
**Server requirements** | Windows servers must have PowerShell remoting enabled and PowerShell version 2.0 or later installed. <br/><br/> WMI must be enabled and available on Windows servers to gather the details of the roles and features installed on the servers.<br/><br/> Linux servers must have SSH connectivity enabled and ensure that the following commands can be executed on the Linux servers to pull the application data: list, tail, awk, grep, locate, head, sed, ps, print, sort, uniq. Based on OS type and the type of package manager being used, here are some additional commands: rpm/snap/dpkg, yum/apt-cache, mssql-server.
**Windows server access** | A guest user account for Windows servers
**Linux server access** | A standard user account (non-`sudo` access) for all Linux servers
**Port access** | For Windows server, need access on port 5985 (HTTP) and for Linux servers, need access on port 22(TCP).
**Discovery** | Software inventory is performed by directly connecting to the servers using the server credentials added on the appliance. <br/><br/> The appliance gathers the information about the software inventory from Windows servers using PowerShell remoting and from Linux servers using SSH connection. <br/><br/> Software inventory is agentless. No agent is installed on the servers.

## SQL Server instance and database discovery requirements

[Software inventory](how-to-discover-applications.md) identifies SQL Server instances. Using this information, the appliance attempts to connect to respective SQL Server instances through the Windows authentication or SQL Server authentication credentials that are provided in the appliance configuration manager. Appliance can connect to only those SQL Server instances to which it has network line of sight, whereas software inventory by itself may not need network line of sight.

After the appliance is connected, it gathers configuration and performance data for SQL Server instances and databases. SQL Server configuration data is updated once every 24 hours. Performance data is captured every 30 seconds.

Support | Details
--- | ---
**Supported servers** | supported only for servers running SQL Server in your VMware, Microsoft Hyper-V, and Physical/ Baremetal environments as well as IaaS Servers of other public clouds such as AWS, GCP, etc. You can discover up to 300 SQL Server instances or 6,000 SQL databases, whichever is less.
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

## Dependency analysis requirements (agentless)

[Dependency analysis](concepts-dependency-visualization.md) helps you analyze the dependencies between the discovered servers, which can be easily visualized with a map view in Azure Migrate project and can be used to group related servers for migration to Azure. The following table summarizes the requirements for setting up agentless dependency analysis:

Support | Details
--- | ---
**Supported servers** | You can enable agentless dependency analysis on up to 1000 servers, discovered per appliance.
**Operating systems** | Servers running all Windows and Linux versions that meet the server requirements and have the required access permissions are supported.
**Server requirements** | Windows servers must have PowerShell remoting enabled and PowerShell version 2.0 or later installed. <br/><br/> Linux servers must have SSH connectivity enabled and ensure that the following commands can be executed on the Linux servers: touch, chmod, cat, ps, grep, echo, sha256sum, awk, netstat, ls, sudo, dpkg, rpm, sed, getcap, which, date
**Windows server access** | A user account (local or domain) with administrator permissions on servers.
**Linux server access** | A root user account, or an account that has these permissions on /bin/netstat and /bin/ls files: <br />CAP_DAC_READ_SEARCH<br /> CAP_SYS_PTRACE<br /><br /> Set these capabilities by using the following commands:<br /><code>sudo setcap CAP_DAC_READ_SEARCH,CAP_SYS_PTRACE=ep usr/bin/ls</code><br /><code>sudo setcap CAP_DAC_READ_SEARCH,CAP_SYS_PTRACE=ep usr/bin/netstat</code>
**Port access** | For Windows server, need access on port 5985 (HTTP) and for Linux servers, need access on port 22(TCP).
**Discovery method** |  Agentless dependency analysis is performed by directly connecting to the servers using the server credentials added on the appliance. <br/><br/> The appliance gathers the dependency information from Windows servers using PowerShell remoting and from Linux servers using SSH connection. <br/><br/> No agent is installed on the servers to pull dependency data.


## Agent-based dependency analysis requirements

[Dependency analysis](concepts-dependency-visualization.md) helps you to identify dependencies between on-premises servers that you want to assess and migrate to Azure. The table summarizes the requirements for setting up agent-based dependency analysis. Currently only agent-based dependency analysis is supported for physical servers.

**Requirement** | **Details**
--- | ---
**Before deployment** | You should have a project in place, with the Azure Migrate: Discovery and assessment tool added to the project.<br/><br/>  You deploy dependency visualization after setting up an Azure Migrate appliance to discover your on-premises servers<br/><br/> [Learn how](create-manage-projects.md) to create a project for the first time.<br/> [Learn how](how-to-assess.md) to add an assessment tool to an existing project.<br/> Learn how to set up the Azure Migrate appliance for assessment of [Hyper-V](how-to-set-up-appliance-hyper-v.md), [VMware](how-to-set-up-appliance-vmware.md), or physical servers.
**Azure Government** | Dependency visualization isn't available in Azure Government.
**Log Analytics** | Azure Migrate uses the [Service Map](../azure-monitor/vm/service-map.md) solution in [Azure Monitor logs](../azure-monitor/logs/log-query-overview.md) for dependency visualization.<br/><br/> You associate a new or existing Log Analytics workspace with a project. The workspace for a project can't be modified after it's added. <br/><br/> The workspace must be in the same subscription as the project.<br/><br/> The workspace must reside in the East US, Southeast Asia, or West Europe regions. Workspaces in other regions can't be associated with a project.<br/><br/> The workspace must be in a region in which [Service Map is supported](../azure-monitor/vm/vminsights-configure-workspace.md#supported-regions).<br/><br/> In Log Analytics, the workspace associated with Azure Migrate is tagged with the Migration Project key, and the project name.
**Required agents** | On each server you want to analyze, install the following agents:<br/><br/> The [Microsoft Monitoring agent (MMA)](../azure-monitor/agents/agent-windows.md).<br/> The [Dependency agent](../azure-monitor/vm/vminsights-dependency-agent-maintenance.md).<br/><br/> If on-premises servers aren't connected to the internet, you need to download and install Log Analytics gateway on them.<br/><br/> Learn more about installing the [Dependency agent](how-to-create-group-machine-dependencies.md#install-the-dependency-agent) and [MMA](how-to-create-group-machine-dependencies.md#install-the-mma).
**Log Analytics workspace** | The workspace must be in the same subscription a project.<br/><br/> Azure Migrate supports workspaces residing in the East US, Southeast Asia, and West Europe regions.<br/><br/>  The workspace must be in a region in which [Service Map is supported](../azure-monitor/vm/vminsights-configure-workspace.md#supported-regions).<br/><br/> The workspace for a project can't be modified after it's added.
**Costs** | The Service Map solution doesn't incur any charges for the first 180 days (from the day that you associate the Log Analytics workspace with the project)/<br/><br/> After 180 days, standard Log Analytics charges will apply.<br/><br/> Using any solution other than Service Map in the associated Log Analytics workspace will incur [standard charges](https://azure.microsoft.com/pricing/details/log-analytics/) for Log Analytics.<br/><br/> When the project is deleted, the workspace isn't deleted along with it. After deleting the project, Service Map usage isn't free, and each node will be charged as per the paid tier of Log Analytics workspace/<br/><br/>If you have projects that you created before Azure Migrate general availability (GA- 28 February 2018), you might have incurred additional Service Map charges. To ensure payment after 180 days only, we recommend that you create a new project, since existing workspaces before GA are still chargeable.
**Management** | When you register agents to the workspace, you use the ID and key provided by the project.<br/><br/> You can use the Log Analytics workspace outside Azure Migrate.<br/><br/> If you delete the associated project, the workspace isn't deleted automatically. [Delete it manually](../azure-monitor/logs/manage-access.md).<br/><br/> Don't delete the workspace created by Azure Migrate, unless you delete the project. If you do, the dependency visualization functionality won't work as expected.
**Internet connectivity** | If servers aren't connected to the internet, you need to install the Log Analytics gateway on them.
**Azure Government** | Agent-based dependency analysis isn't supported.

## Next steps

[Prepare for physical Discovery and assessment](./tutorial-discover-physical.md).
