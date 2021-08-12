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

**Operating system:** All Windows and Linux operating systems can be assessed for migration.

**Permissions:**

Set up an account that the appliance can use to access the physical servers.

**Windows servers**

- For Windows servers, use a domain account for domain-joined servers, and a local account for servers that are not domain-joined. 
- The user account should be added to these groups: Remote Management Users, Performance Monitor Users, and Performance Log Users. 
- If Remote management Users group isn't present, then add user account to the group: **WinRMRemoteWMIUsers_**.
- The account needs these permissions for appliance to create a CIM connection with the server and pull the required configuration and performance metadata from the WMI classes listed [here.](migrate-appliance.md#collected-data---physical)
- In some cases, adding the account to these groups may not return the required data from WMI classes as the account might be filtered by [UAC](/windows/win32/wmisdk/user-account-control-and-wmi). To overcome the UAC filtering, user account needs to have necessary permissions on CIMV2 Namespace and sub-namespaces on the target server. You can follow the steps [here](troubleshoot-appliance.md#access-is-denied-when-connecting-to-physical-servers-during-validation) to enable the required permissions.

    > [!Note]
    > For Windows Server 2008 and 2008 R2, ensure that WMF 3.0 is installed on the servers.

**Linux servers**

- You need a root account on the servers that you want to discover. Alternately, you can provide a user account with sudo permissions.
- The support to add a user account with sudo access is provided by default with the new appliance installer script downloaded from portal after July 20,2021.
- For older appliances, you can enable the capability by following these steps:
    1. On the server running the appliance, open the Registry Editor.
    1. Navigate to HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\AzureAppliance.
    1. Create a registry key ‘isSudo’ with DWORD value of 1.

    :::image type="content" source="./media/tutorial-discover-physical/issudo-reg-key.png" alt-text="Screenshot that shows how to enable sudo support.":::

- To discover the configuration and performance metadata from target server, you need to enable sudo access for the commands listed [here](migrate-appliance.md#linux-server-metadata). Make sure that you have enabled 'NOPASSWD' for the account to run the required commands without prompting for a password every time sudo command is invoked.
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

- If you cannot provide root account or user account with sudo access, then you can set 'isSudo' registry key to value '0' in HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\AzureAppliance registry and provide a non-root account with the required capabilities using the following commands:

**Command** | **Purpose**
--- | --- |
setcap CAP_DAC_READ_SEARCH+eip /usr/sbin/fdisk <br></br> setcap CAP_DAC_READ_SEARCH+eip /sbin/fdisk _(if /usr/sbin/fdisk is not present)_ | To collect disk configuration data
setcap "cap_dac_override,cap_dac_read_search,cap_fowner,cap_fsetid,cap_setuid,<br>cap_setpcap,cap_net_bind_service,cap_net_admin,cap_sys_chroot,cap_sys_admin,<br>cap_sys_resource,cap_audit_control,cap_setfcap=+eip" /sbin/lvm | To collect disk performance data
setcap CAP_DAC_READ_SEARCH+eip /usr/sbin/dmidecode | To collect BIOS serial number
chmod a+r /sys/class/dmi/id/product_uuid | To collect BIOS GUID

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

## Agent-based dependency analysis requirements

[Dependency analysis](concepts-dependency-visualization.md) helps you to identify dependencies between on-premises servers that you want to assess and migrate to Azure. The table summarizes the requirements for setting up agent-based dependency analysis. Currently only agent-based dependency analysis is supported for physical servers.

**Requirement** | **Details**
--- | ---
**Before deployment** | You should have a project in place, with the Azure Migrate: Discovery and assessment tool added to the project.<br/><br/>  You deploy dependency visualization after setting up an Azure Migrate appliance to discover your on-premises servers<br/><br/> [Learn how](create-manage-projects.md) to create a project for the first time.<br/> [Learn how](how-to-assess.md) to add an assessment tool to an existing project.<br/> Learn how to set up the Azure Migrate appliance for assessment of [Hyper-V](how-to-set-up-appliance-hyper-v.md), [VMware](how-to-set-up-appliance-vmware.md), or physical servers.
**Azure Government** | Dependency visualization isn't available in Azure Government.
**Log Analytics** | Azure Migrate uses the [Service Map](../azure-monitor/vm/service-map.md) solution in [Azure Monitor logs](../azure-monitor/logs/log-query-overview.md) for dependency visualization.<br/><br/> You associate a new or existing Log Analytics workspace with a project. The workspace for a project can't be modified after it's added. <br/><br/> The workspace must be in the same subscription as the project.<br/><br/> The workspace must reside in the East US, Southeast Asia, or West Europe regions. Workspaces in other regions can't be associated with a project.<br/><br/> The workspace must be in a region in which [Service Map is supported](../azure-monitor/vm/vminsights-configure-workspace.md#supported-regions).<br/><br/> In Log Analytics, the workspace associated with Azure Migrate is tagged with the Migration Project key, and the project name.
**Required agents** | On each server you want to analyze, install the following agents:<br/><br/> The [Microsoft Monitoring agent (MMA)](../azure-monitor/agents/agent-windows.md).<br/> The [Dependency agent](../azure-monitor/agents/agents-overview.md#dependency-agent).<br/><br/> If on-premises servers aren't connected to the internet, you need to download and install Log Analytics gateway on them.<br/><br/> Learn more about installing the [Dependency agent](how-to-create-group-machine-dependencies.md#install-the-dependency-agent) and [MMA](how-to-create-group-machine-dependencies.md#install-the-mma).
**Log Analytics workspace** | The workspace must be in the same subscription a project.<br/><br/> Azure Migrate supports workspaces residing in the East US, Southeast Asia, and West Europe regions.<br/><br/>  The workspace must be in a region in which [Service Map is supported](../azure-monitor/vm/vminsights-configure-workspace.md#supported-regions).<br/><br/> The workspace for a project can't be modified after it's added.
**Costs** | The Service Map solution doesn't incur any charges for the first 180 days (from the day that you associate the Log Analytics workspace with the project)/<br/><br/> After 180 days, standard Log Analytics charges will apply.<br/><br/> Using any solution other than Service Map in the associated Log Analytics workspace will incur [standard charges](https://azure.microsoft.com/pricing/details/log-analytics/) for Log Analytics.<br/><br/> When the project is deleted, the workspace is not deleted along with it. After deleting the project, Service Map usage isn't free, and each node will be charged as per the paid tier of Log Analytics workspace/<br/><br/>If you have projects that you created before Azure Migrate general availability (GA- 28 February 2018), you might have incurred additional Service Map charges. To ensure payment after 180 days only, we recommend that you create a new project, since existing workspaces before GA are still chargeable.
**Management** | When you register agents to the workspace, you use the ID and key provided by the project.<br/><br/> You can use the Log Analytics workspace outside Azure Migrate.<br/><br/> If you delete the associated project, the workspace isn't deleted automatically. [Delete it manually](../azure-monitor/logs/manage-access.md).<br/><br/> Don't delete the workspace created by Azure Migrate, unless you delete the project. If you do, the dependency visualization functionality will not work as expected.
**Internet connectivity** | If servers aren't connected to the internet, you need to install the Log Analytics gateway on them.
**Azure Government** | Agent-based dependency analysis isn't supported.

## Next steps

[Prepare for physical Discovery and assessment](./tutorial-discover-physical.md).