---
title: Configure auto provisioning of agents for Microsoft Defender for Cloud
description: This article describes how to set up auto provisioning of the Log Analytics agent and other agents and extensions used by Microsoft Defender for Cloud
author: bmansheim
ms.author: benmansheim
ms.topic: quickstart
ms.date: 08/14/2022
ms.custom: mode-other
---
# Quickstart: Configure auto provisioning for agents and extensions from Microsoft Defender for Cloud

Microsoft Defender for Cloud collects data from your resources using the relevant agent or extensions for that resource and the type of data collection you've enabled. Use the procedures below to auto-provision the necessary agents and extensions used by Defender for Cloud to your resources.

When you enable auto provisioning of any of the supported extensions, the extensions are installed on existing and future machines in the subscription. When you **disable** auto provisioning for an extension, the extension is not installed on future machines, but it is also not uninstalled from existing machines.

:::image type="content" source="media/enable-data-collection/auto-provisioning-list-of-extensions.png" alt-text="Screenshot of Microsoft Defender for Cloud's extensions that can be auto provisioned.":::

## Prerequisites

To get started with Defender for Cloud, you must have a subscription to Microsoft Azure. If you don't have a subscription, you can sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).

## Availability

### [**Auto provisioning**](#tab/autoprovision-feature)

This table shows the availability details for the auto provisioning **feature** itself.

| Aspect                          | Details                                                                                                                                                                             |
|---------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Release state:                  | Auto provisioning is generally available (GA)                                                                                                                                       |
| Pricing:                        | Auto provisioning is free to use                                                                                                                                                    |
| Required roles and permissions: | Depends on the specific extension - see relevant tab                                                                                                                                |
| Supported destinations:         | Depends on the specific extension - see relevant tab                                                                                                                                |
| Clouds:                         | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure Government, Azure China 21Vianet |


### [**Log Analytics agent**](#tab/autoprovision-loganalytic)

| Aspect                                               | Azure virtual machines                                                                                                                                                              | Azure Arc-enabled machines                                                                                                                                                         |
|------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Release state:                                       | Generally available (GA)                                                                                                                                                            | Preview                                                                                                                                                                            |
| Relevant Defender plan:                              | [Microsoft Defender for Servers](defender-for-servers-introduction.md)<br>[Microsoft Defender for SQL](defender-for-sql-introduction.md)                                            | [Microsoft Defender for Servers](defender-for-servers-introduction.md)<br>[Microsoft Defender for SQL](defender-for-sql-introduction.md)                                           |
| Required roles and permissions (subscription-level): | [Contributor](../role-based-access-control/built-in-roles.md#contributor) or [Security Admin](../role-based-access-control/built-in-roles.md#security-admin)                        | [Owner](../role-based-access-control/built-in-roles.md#owner)                                                                                                                      |
| Supported destinations:                              | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure virtual machines                                                                                                  | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure Arc-enabled machines                                                                                             |
| Policy-based:                                        | :::image type="icon" source="./media/icons/no-icon.png"::: No                                                                                                                       | :::image type="icon" source="./media/icons/yes-icon.png"::: Yes                                                                                                                    |
| Clouds:                                              | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure Government, Azure China 21Vianet | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure Government, Azure China 21Vianet |

### [**Azure Monitor Agent**](#tab/autoprovision-ama)

[!INCLUDE [azure-monitor-agent-availability](includes/azure-monitor-agent-availability.md)]

Learn more about [using the Azure Monitor Agent with Defender for Cloud](auto-deploy-azure-monitoring-agent.md).

### [**Vulnerability assessment**](#tab/autoprovision-va)

| Aspect                                               | Details                                                                                                                                                                            |
|------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Release state:                                       | Generally available (GA)                                                                                                                                                           |
| Relevant Defender plan:                              | [Microsoft Defender for Servers](defender-for-servers-introduction.md)                                                                                                             |
| Required roles and permissions (subscription-level): | [Owner](../role-based-access-control/built-in-roles.md#owner)                                                                                                                      |
| Supported destinations:                              | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure virtual machines<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure Arc-enabled machines       |
| Policy-based:                                        | :::image type="icon" source="./media/icons/yes-icon.png"::: Yes                                                                                                                    |
| Clouds:                                              | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure Government, Azure China 21Vianet |

### [**Defender for Endpoint**](#tab/autoprovision-defendpoint)

| Aspect                                               | Linux                                                                                                                                                                              | Windows                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Release state:                                       | Generally available (GA)                                                                                                                                                           | Generally available (GA)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Relevant Defender plan:                              | [Microsoft Defender for Servers](defender-for-servers-introduction.md)                                                                                                             | [Microsoft Defender for Servers](defender-for-servers-introduction.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Required roles and permissions (subscription-level): | [Contributor](../role-based-access-control/built-in-roles.md#contributor) or [Security Admin](../role-based-access-control/built-in-roles.md#security-admin)                       | [Contributor](../role-based-access-control/built-in-roles.md#contributor) or [Security Admin](../role-based-access-control/built-in-roles.md#security-admin)                                                                                                                                                                                                                                                                                                                                                                                                 |
| Supported destinations:                              | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure Arc-enabled machines<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure virtual machines       | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure Arc-enabled machines<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure VMs running Windows Server 2022, 2019, 2016, 2012 R2, 2008 R2 SP1, [Azure Virtual Desktop](../virtual-desktop/overview.md), [Windows 10 Enterprise multi-session](../virtual-desktop/windows-10-multisession-faq.yml)<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure VMs running Windows 10 |
| Policy-based:                                        | :::image type="icon" source="./media/icons/no-icon.png"::: No                                                                                                                      | :::image type="icon" source="./media/icons/no-icon.png"::: No                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Clouds:                                              | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure Government, Azure China 21Vianet | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure Government, Azure China 21Vianet                                                                                                                                                                                                                                                                                                                                                                          |


### [**Guest Configuration**](#tab/autoprovision-guestconfig)

| Aspect                                               | Details                                                                                                                                                                            |
|------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Release state:                                       | Preview                                                                                                                                                                            |
| Relevant Defender plan:                              | No plan required                                                                                                    |
| Required roles and permissions (subscription-level): | [Owner](../role-based-access-control/built-in-roles.md#owner)                                                                                                                      |
| Supported destinations:                              | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure virtual machines                                                                                                 |
| Clouds:                                              | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure Government, Azure China 21Vianet |

### [**Defender for Containers**](#tab/autoprovision-containers)

This table shows the availability details for the components that are required for auto provisioning to provide the protections offered by [Microsoft Defender for Containers](defender-for-containers-introduction.md).

By default, auto provisioning is enabled when you enable Defender for Containers from the Azure portal.

| Aspect                                               | Azure Kubernetes Service clusters                                                      | Azure Arc-enabled Kubernetes clusters                                                       |
|------------------------------------------------------|----------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| Release state:                                       | • Defender profile: GA<br> • Azure Policy add-on: Generally available (GA) | • Defender extension: Preview<br> • Azure Policy extension: Preview |
| Relevant Defender plan:                              | [Microsoft Defender for Containers](defender-for-containers-introduction.md)           | [Microsoft Defender for Containers](defender-for-containers-introduction.md)                |
| Required roles and permissions (subscription-level): | [Owner](../role-based-access-control/built-in-roles.md#owner) or [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator)                          | [Owner](../role-based-access-control/built-in-roles.md#owner) or [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator)                               |
| Supported destinations:                              | The AKS Defender profile only supports [AKS clusters that have RBAC enabled](../aks/concepts-identity.md#kubernetes-rbac).                                                                                   | [See Kubernetes distributions supported for Arc-enabled Kubernetes](supported-machines-endpoint-solutions-clouds-containers.md?tabs=azure-aks#kubernetes-distributions-and-configurations)             |
| Policy-based:                                        | :::image type="icon" source="./media/icons/yes-icon.png"::: Yes                        | :::image type="icon" source="./media/icons/yes-icon.png"::: Yes                             |
| Clouds:                                              | **Defender profile**:<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure Government, Azure China 21Vianet<br>**Azure Policy add-on**:<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure Government, Azure China 21Vianet|**Defender extension**:<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure Government, Azure China 21Vianet<br>**Azure Policy extension for Azure Arc**:<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure Government, Azure China 21Vianet|

---

[!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]

## How does Defender for Cloud collect data?

Defender for Cloud collects data from your Azure virtual machines (VMs), virtual machine scale sets, IaaS containers, and non-Azure (including on-premises) machines to monitor for security vulnerabilities and threats. 

Data collection is required to provide visibility into missing updates, misconfigured OS security settings, endpoint protection status, and health and threat protection. Data collection is only needed for compute resources such as VMs, virtual machine scale sets, IaaS containers, and non-Azure computers. 

You can benefit from Microsoft Defender for Cloud even if you don’t provision agents. However, you'll have limited security and the capabilities listed above aren't supported.  

Data is collected using:

- The **Log Analytics agent**, which reads various security-related configurations and event logs from the machine and copies the data to your workspace for analysis. Examples of such data are: operating system type and version, operating system logs (Windows event logs), running processes, machine name, IP addresses, and logged in user.
- **Security extensions**, such as the [Azure Policy Add-on for Kubernetes](../governance/policy/concepts/policy-for-kubernetes.md), which can also provide data to Defender for Cloud regarding specialized resource types.

## Why use auto provisioning?

Any of the agents and extensions described on this page *can* be installed manually (see [Manual installation of the Log Analytics agent](#manual-agent)). However, **auto provisioning** reduces management overhead by installing all required agents and extensions on existing - and new - machines to ensure faster security coverage for all supported resources. 

We recommend enabling auto provisioning, but it's disabled by default.

## How does auto provisioning work?

Defender for Cloud's auto provisioning settings page has a toggle for each type of supported extension. When you enable auto provisioning of an extension, you assign the appropriate **Deploy if not exists** policy. This policy type ensures the extension is provisioned on all existing and future resources of that type.

> [!TIP]
> Learn more about Azure Policy effects including **Deploy if not exists** in [Understand Azure Policy effects](../governance/policy/concepts/effects.md).


<a name="auto-provision-mma"></a>

## Enable auto provisioning of the Log Analytics agent and extensions

When auto provisioning is on for the Log Analytics agent, Defender for Cloud deploys the agent on all supported Azure VMs and any new ones created. For the list of supported platforms, see [Supported platforms in Microsoft Defender for Cloud](security-center-os-coverage.md).

To enable auto provisioning of the Log Analytics agent:

1. From Defender for Cloud's menu, open **Environment settings**.
1. Select the relevant subscription.
1. In the **Auto provisioning** page, set the status of auto provisioning for the Log Analytics agent to **On**.

    :::image type="content" source="./media/enable-data-collection/enable-automatic-provisioning.png" alt-text="Enabling auto provisioning of the Log Analytics agent." lightbox="./media/enable-data-collection/enable-automatic-provisioning.png":::

1. From the configuration options pane, define the workspace to use.

    :::image type="content" source="./media/enable-data-collection/log-analytics-agent-deploy-options.png" alt-text="Configuration options for auto provisioning Log Analytics agents to VMs." lightbox="./media/enable-data-collection/log-analytics-agent-deploy-options.png":::

    - **Connect Azure VMs to the default workspace(s) created by Defender for Cloud** - Defender for Cloud creates a new resource group and default workspace in the same geolocation, and connects the agent to that workspace. If a subscription contains VMs from multiple geolocations, Defender for Cloud creates multiple workspaces to ensure compliance with data privacy requirements.

        The naming convention for the workspace and resource group is: 
        - Workspace: DefaultWorkspace-[subscription-ID]-[geo] 
        - Resource Group: DefaultResourceGroup-[geo] 

        A Defender for Cloud solution is automatically enabled on the workspace per the pricing tier set for the subscription.

        > [!TIP]
        > For questions regarding default workspaces, see:
        >
        > - [Am I billed for Azure Monitor logs on the workspaces created by Defender for Cloud?](./faq-data-collection-agents.yml#am-i-billed-for-azure-monitor-logs-on-the-workspaces-created-by-defender-for-cloud-)
        > - [Where is the default Log Analytics workspace created?](./faq-data-collection-agents.yml#where-is-the-default-log-analytics-workspace-created-)
        > - [Can I delete the default workspaces created by Defender for Cloud?](./faq-data-collection-agents.yml#can-i-delete-the-default-workspaces-created-by-defender-for-cloud-)

    - **Connect Azure VMs to a different workspace** - From the dropdown list, select the workspace to store collected data. The dropdown list includes all workspaces across all of your subscriptions. You can use this option to collect data from virtual machines running in different subscriptions and store it all in your selected workspace.  

        If you already have an existing Log Analytics workspace, you might want to use the same workspace (requires read and write permissions on the workspace). This option is useful if you're using a centralized workspace in your organization and want to use it for security data collection. Learn more in [Manage access to log data and workspaces in Azure Monitor](../azure-monitor/logs/manage-access.md).

        If your selected workspace already has a "Security" or "SecurityCenterFree" solution enabled, the pricing will be set automatically. If not, install a Defender for Cloud solution on the workspace:

        1. From Defender for Cloud's menu, open **Environment settings**.
        1. Select the workspace to which you'll be connecting the agents.
        1. Set Security posture management to **on** or select **Enable all** to turn all Microsoft Defender plans on.

1. From the **Windows security events** configuration, select the amount of raw event data to store:
    - **None** – Disable security event storage. (Default)
    - **Minimal** – A small set of events for when you want to minimize the event volume.
    - **Common** – A set of events that satisfies most customers and provides a full audit trail.
    - **All events** – For customers who want to make sure all events are stored.

    > [!TIP]
    > To set these options at the workspace level, see [Setting the security event option at the workspace level](#setting-the-security-event-option-at-the-workspace-level).
    > 
    > For more information of these options, see [Windows security event options for the Log Analytics agent](#data-collection-tier).

1. Select **Apply** in the configuration pane.

1. To enable auto provisioning of an extension other than the Log Analytics agent: 

    1. Toggle the status to **On** for the relevant extension.

        :::image type="content" source="./media/enable-data-collection/toggle-kubernetes-add-on.png" alt-text="Toggle to enable auto provisioning for K8s policy add-on.":::

    1. Select **Save**. The Azure Policy definition is assigned and a remediation task is created.

        |Extension  |Policy  |
        |---------|---------|
        |Policy Add-on for Kubernetes                      |[Deploy Azure Policy Add-on to Azure Kubernetes Service clusters](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fa8eff44f-8c92-45c3-a3fb-9880802d67a7)|
        |Guest Configuration agent (preview)               |[Deploy prerequisites to enable Guest Configuration policies on virtual machines](https://github.com/Azure/azure-policy/blob/64dcfa3033a3ff231ec4e73d2c1dad4db4e3b5dd/built-in-policies/policySetDefinitions/Guest%20Configuration/GuestConfiguration_Prerequisites.json)|


1. Select **Save**. If a workspace needs to be provisioned, agent installation might take up to 25 minutes.

1. You'll be asked if you want to reconfigure monitored VMs that were previously connected to a default workspace:

    :::image type="content" source="./media/enable-data-collection/reconfigure-monitored-vm.png" alt-text="Review options to reconfigure monitored VMs.":::

    - **No** - your new workspace settings will only be applied to newly discovered VMs that don't have the Log Analytics agent installed.
    - **Yes** - your new workspace settings will apply to all VMs and every VM currently connected to a Defender for Cloud created workspace will be reconnected to the new target workspace.

   > [!NOTE]
   > If you select **Yes**, don't delete the workspace(s) created by Defender for Cloud until all VMs have been reconnected to the new target workspace. This operation fails if a workspace is deleted too early.


<a name="data-collection-tier"></a>

## Windows security event options for the Log Analytics agent 

When you select a data collection tier in Microsoft Defender for Cloud, the security events of the selected tier are stored in your Log Analytics workspace so that you can investigate, search, and audit the events in your workspace. The Log Analytics agent also collects and analyzes the security events required for Defender for Cloud’s threat protection.

### Requirements

The enhanced security protections of Defender for Cloud are required for storing Windows security event data. Learn more about [the enhanced protection plans](defender-for-cloud-introduction.md).

You may be charged for storing data in Log Analytics. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

### Information for Microsoft Sentinel users 

Security events collection within the context of a single workspace can be configured from either Microsoft Defender for Cloud or Microsoft Sentinel, but not both. If you want to add Microsoft Sentinel to a workspace that already gets alerts from Microsoft Defender for Cloud and to collect Security Events, you can either:

- Leave the Security Events collection in Microsoft Defender for Cloud as is. You'll be able to query and analyze these events in both Microsoft Sentinel and Defender for Cloud. If you want to monitor the connector's connectivity status or change its configuration in Microsoft Sentinel, consider the second option.
- Disable Security Events collection in Microsoft Defender for Cloud and then add the Security Events connector in Microsoft Sentinel. You'll be able to query and analyze events in both Microsoft Sentinel, and Defender for Cloud, but you'll also be able to monitor the connector's connectivity status or change its configuration in - and only in - Microsoft Sentinel. To disable Security Events collection in Defender for Cloud, set **Windows security events** to **None** in the configuration of your Log Analytics agent.

### What event types are stored for "Common" and "Minimal"?

The **Common** and **Minimal** event sets were designed to address typical scenarios based on customer and industry standards for the unfiltered frequency of each event and their usage.

- **Minimal** - This set is intended to cover only events that might indicate a successful breach and important events with low volume. Most of the data volume of this set is successful user logon (event ID 4625), failed user logon events (event ID 4624), and process creation events (event ID 4688). Sign out events are important for auditing only and have relatively high volume, so they aren't included in this event set.
- **Common** - This set is intended to provide a full user audit trail, including events with low volume. For example, this set contains both user logon events (event ID 4624) and user logoff events (event ID 4634). We include auditing actions like security group changes, key domain controller Kerberos operations, and other events that are recommended by industry organizations.

Here's a complete breakdown of the Security and App Locker event IDs for each set:

| Data tier | Collected event indicators |
| --- | --- |
| Minimal | 1102,4624,4625,4657,4663,4688,4700,4702,4719,4720,4722,4723,4724,4727,4728,4732,4735,4737,4739,4740,4754,4755, |
| | 4756,4767,4799,4825,4946,4948,4956,5024,5033,8001,8002,8003,8004,8005,8006,8007,8222 |
| Common | 1,299,300,324,340,403,404,410,411,412,413,431,500,501,1100,1102,1107,1108,4608,4610,4611,4614,4622, |
| |  4624,4625,4634,4647,4648,4649,4657,4661,4662,4663,4665,4666,4667,4688,4670,4672,4673,4674,4675,4689,4697, |
| | 4700,4702,4704,4705,4716,4717,4718,4719,4720,4722,4723,4724,4725,4726,4727,4728,4729,4733,4732,4735,4737, |
| | 4738,4739,4740,4742,4744,4745,4746,4750,4751,4752,4754,4755,4756,4757,4760,4761,4762,4764,4767,4768,4771, |
| | 4774,4778,4779,4781,4793,4797,4798,4799,4800,4801,4802,4803,4825,4826,4870,4886,4887,4888,4893,4898,4902, |
| | 4904,4905,4907,4931,4932,4933,4946,4948,4956,4985,5024,5033,5059,5136,5137,5140,5145,5632,6144,6145,6272, |
| | 6273,6278,6416,6423,6424,8001,8002,8003,8004,8005,8006,8007,8222,26401,30004 |

> [!NOTE]
> - If you are using Group Policy Object (GPO), it is recommended that you enable audit policies Process Creation Event 4688 and the *CommandLine* field inside event 4688. For more information about Process Creation Event 4688, see Defender for Cloud's [FAQ](./faq-data-collection-agents.yml#what-happens-when-data-collection-is-enabled-). For more information about these audit policies, see [Audit Policy Recommendations](/windows-server/identity/ad-ds/plan/security-best-practices/audit-policy-recommendations).
> -  To enable data collection for [Adaptive application controls](adaptive-application-controls.md), Defender for Cloud configures a local AppLocker policy in Audit mode to allow all applications. This will cause AppLocker to generate events which are then collected and leveraged by Defender for Cloud. It is important to note that this policy will not be configured on any machines on which there is already a configured AppLocker policy. 
> - To collect Windows Filtering Platform [Event ID 5156](https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventID=5156), you need to enable [Audit Filtering Platform Connection](/windows/security/threat-protection/auditing/audit-filtering-platform-connection) (Auditpol /set /subcategory:"Filtering Platform Connection" /Success:Enable)
>

### Setting the security event option at the workspace level

You can define the level of security event data to store at the workspace level.

1. From Defender for Cloud's menu in the Azure portal, select **Environment settings**.
1. Select the relevant workspace. The only data collection events for a workspace are the Windows security events described on this page.

    :::image type="content" source="media/enable-data-collection/event-collection-workspace.png" alt-text="Setting the security event data to store in a workspace.":::

1. Select the amount of raw event data to store and select **Save**.

<a name="manual-agent"></a>

## Manual agent provisioning
 
To manually install the Log Analytics agent:

1. Disable auto provisioning.

1. Optionally, create a workspace.

1. Enable Microsoft Defender for Cloud on the workspace on which you're installing the Log Analytics agent:

    1. From Defender for Cloud's menu, open **Environment settings**.

    1. Set the workspace on which you're installing the agent. Make sure the workspace is in the same subscription you use in Defender for Cloud and that you have read/write permissions for the workspace.

    1. Select **Microsoft Defender for Cloud on**, and **Save**.

       >[!NOTE]
       >If the workspace already has a **Security** or **SecurityCenterFree** solution enabled, the pricing will be set automatically. 

1. To deploy agents on new VMs using a Resource Manager template, install the Log Analytics agent:

   - [Install the Log Analytics agent for Windows](../virtual-machines/extensions/oms-windows.md)
   - [Install the Log Analytics agent for Linux](../virtual-machines/extensions/oms-linux.md)

1. To deploy agents on your existing VMs, follow the instructions in [Collect data about Azure Virtual Machines](../azure-monitor/vm/monitor-virtual-machine.md) (the section **Collect event and performance data** is optional).

1. To use PowerShell to deploy the agents, use the instructions from the virtual machines documentation:

    - [For Windows machines](../virtual-machines/extensions/oms-windows.md?toc=%2fazure%2fazure-monitor%2ftoc.json#powershell-deployment)
    - [For Linux machines](../virtual-machines/extensions/oms-linux.md?toc=%2fazure%2fazure-monitor%2ftoc.json#azure-cli-deployment)

> [!TIP]
> For more information about onboarding, see [Automate onboarding of Microsoft Defender for Cloud using PowerShell](powershell-onboarding.md).

<a name="preexisting"></a>

## Auto provisioning in cases of a pre-existing agent installation

The following use cases explain how auto provisioning works in cases when there's already an agent or extension installed.

- **Log Analytics agent is installed on the machine, but not as an extension (Direct agent)** - If the Log Analytics agent is installed directly on the VM (not as an Azure extension), Defender for Cloud will install the Log Analytics agent extension and might upgrade the Log Analytics agent to the latest version. The installed agent will continue to report to its already configured workspaces and to the workspace configured in Defender for Cloud. (Multi-homing is supported on Windows machines.)

  If the Log Analytics is configured with a user workspace and not Defender for Cloud's default workspace, you'll need to install the "Security" or "SecurityCenterFree" solution on it for Defender for Cloud to start processing events from VMs and computers reporting to that workspace.

  For Linux machines, Agent multi-homing isn't yet supported. If an existing agent installation is detected, the Log Analytics agent won't be auto provisioned.

  For existing machines on subscriptions onboarded to Defender for Cloud before 17 March 2019, when an existing agent will be detected, the Log Analytics agent extension won't be installed and the machine won't be affected. For these machines, see to the "Resolve monitoring agent health issues on your machines" recommendation to resolve the agent installation issues on these machines.
  
- **System Center Operations Manager agent is installed on the machine** - Defender for Cloud will install the Log Analytics agent extension side by side to the existing Operations Manager. The existing Operations Manager agent will continue to report to the Operations Manager server normally. The Operations Manager agent and Log Analytics agent share common run-time libraries, which will be updated to the latest version during this process. If Operations Manager agent version 2012 is installed, **do not** enable auto provisioning.

- **A pre-existing VM extension is present**:
    - When the Monitoring Agent is installed as an extension, the extension configuration allows reporting to only a single workspace. Defender for Cloud doesn't override existing connections to user workspaces. Defender for Cloud will store security data from the VM in the workspace already connected, if the "Security" or "SecurityCenterFree" solution has been installed on it. Defender for Cloud may upgrade the extension version to the latest version in this process.
    - To see to which workspace the existing extension is sending data to, run the test to [Validate connectivity with Microsoft Defender for Cloud](/archive/blogs/yuridiogenes/validating-connectivity-with-azure-security-center). Alternatively, you can open Log Analytics workspaces, select a workspace, select the VM, and look at the Log Analytics agent connection.
    - If you have an environment where the Log Analytics agent is installed on client workstations and reporting to an existing Log Analytics workspace, review the list of [operating systems supported by Microsoft Defender for Cloud](security-center-os-coverage.md) to make sure your operating system is supported. For more information, see [Existing log analytics customers](./faq-azure-monitor-logs.yml).
 

<a name="offprovisioning"></a>

## Disable auto provisioning

When you disable auto provisioning, agents won't be provisioned on new VMs.

To turn off auto provisioning of an agent:

1. From Defender for Cloud's menu in the portal, select **Environment settings**.
1. Select the relevant subscription.
1. Select **Auto provisioning**.
1. Toggle the status to **Off** for the relevant agent.

    :::image type="content" source="./media/enable-data-collection/agent-toggles.png" alt-text="Toggles to disable auto provisioning per agent type.":::

1. Select **Save**. When auto provisioning is disabled, the default workspace configuration section isn't displayed:

    :::image type="content" source="./media/enable-data-collection/empty-configuration-column.png" alt-text="When auto provisioning is disabled, the configuration cell is empty":::


> [!NOTE]
>  Disabling auto provisioning does not remove the Log Analytics agent from Azure VMs where the agent was provisioned. For information on removing the OMS extension, see [How do I remove OMS extensions installed by Defender for Cloud](./faq-data-collection-agents.yml#how-do-i-remove-oms-extensions-installed-by-defender-for-cloud-).
>


## Troubleshooting

-  To identify monitoring agent network requirements, see [Troubleshooting monitoring agent network requirements](troubleshooting-guide.md#mon-network-req).
-	To identify manual onboarding issues, see [How to troubleshoot Operations Management Suite onboarding issues](https://support.microsoft.com/help/3126513/how-to-troubleshoot-operations-management-suite-onboarding-issues).



## Next steps

This page explained how to enable auto provisioning for the Log Analytics agent and other Defender for Cloud extensions. It also described how to define a Log Analytics workspace in which to store the collected data. Both operations are required to enable data collection. Data storage in a new or existing Log Analytics workspace might incur more charges for data storage. For pricing details in your local currency or region, see the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).
