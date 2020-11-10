---
title: Auto-deploy agents for Azure Security Center | Microsoft Docs
description: This article describes how to setup auto provisioning of the Log Analytics agent and other agents used by Azure Security Center.
services: security-center
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: quickstart
ms.date: 11/02/2020
ms.author: memildin

---
# Auto provisioning agents and extensions from Azure Security Center

Security Center collects data from your Azure virtual machines (VMs), virtual machine scale sets, IaaS containers, and non-Azure (including on-premises) machines to monitor for security vulnerabilities and threats. 

Data collection is required to provide visibility into missing updates, misconfigured OS security settings, endpoint protection status, and health and threat protection. Data collection is only needed for compute resources (VMs, virtual machine scale sets, IaaS containers, and non-Azure computers). You can benefit from Azure Security Center even if you don’t provision agents; however, you will have limited security and the capabilities listed above are not supported.  

Data is collected using:

- The **Log Analytics agent**, which reads various security-related configurations and event logs from the machine and copies the data to your workspace for analysis. Examples of such data are: operating system type and version, operating system logs (Windows event logs), running processes, machine name, IP addresses, and logged in user.
- **Virtual machine extensions**, such as the [Azure Policy Add-on for Kubernetes](../governance/policy/concepts/policy-for-kubernetes.md), can also provide data to Security Center regarding specialized resource types.

> [!TIP]
> As Security Center has grown, the types of resources that can be monitored has also grown. The number of agents and extensions has also grown. Auto provisioning has expanded to support additional agents and resource types by leveraging the capabilities of Azure Policy.

:::image type="content" source="./media/security-center-enable-data-collection/auto-provisioning-options.png" alt-text="Security Center's auto provisioning settings page":::


## Why use auto provisioning?
Any of the agents and extensions described on this page *can* be installed manually (see [Manual installation of the Log Analytics agent](#manual-agent)). However, auto provisioning** reduces management overhead by installing all required agents on existing - and new machines - to ensure faster security coverage for all supported resources. 

We recommend enabling auto provisioning but it's disabled by default.

## How does auto provisioning work?
Security Center's auto provisioning settings have a toggle for each type of supported agent. When you enable the auto provisioning of an agent, you assign the appropriate **Deploy if not exists** policy to make sure that the agent is provisioned according to the configuration on all existing and future resources of that type.

Learn more about Azure Policy effects including deploy if not exists in [Understand Azure Policy effects](../governance/policy/concepts/effects.md).

## Enable auto provisioning of the Log Analytics agent <a name="auto-provision-mma"></a>
When automatic provisioning is on, Security Center deploys the Log Analytics agent on all supported Azure VMs and any new ones that are created. For the list of supported platforms, see [Supported platforms in Azure Security Center](security-center-os-coverage.md).

To enable auto provisioning of the Log Analytics agent:

1. From Security Center's menu, select **Pricing & settings**.
1. Select the relevant subscription.
1. In the **Auto provisioning** page, set the agent's status to **On**.
1. Set the relevant configuration options 
    :::image type="content" source="./media/security-center-enable-data-collection/log-analytics-agent-deploy-options.png" alt-text="Configuration options for auto provisioning Log Analytics agents to VMs" lightbox="./media/security-center-enable-data-collection/log-analytics-agent-deploy-options.png":::

    - **Connect Azure VMs to the default workspace(s) created by Security Center** - Security Center creates a new resource group and default workspace in the same geolocation, and connects the agent to that workspace. If a subscription contains VMs from multiple geolocations, Security Center creates multiple workspaces to ensure compliance with data privacy requirements.

        The naming convention for the workspace and resource group is: 
        - Workspace: DefaultWorkspace-[subscription-ID]-[geo] 
        - Resource Group: DefaultResourceGroup-[geo] 

        Security Center automatically enables a Security Center solution on the workspace per the pricing tier set for the subscription. 

        > [!TIP]
        > For questions regarding default workspaces, see:
        >
        > - [Am I billed for Azure Monitor logs on the workspaces created by Security Center?](faq-data-collection-agents.md#am-i-billed-for-azure-monitor-logs-on-the-workspaces-created-by-security-center)
        > - [Where is the default Log Analytics workspace created?](faq-data-collection-agents.md#where-is-the-default-log-analytics-workspace-created)
        > - [Can I delete the default workspaces created by Security Center?](faq-data-collection-agents.md#can-i-delete-the-default-workspaces-created-by-security-center)


    - **Connect Azure VMs to a different workspace** - From the dropdown list, select the workspace to store collected data. The dropdown list includes all workspaces across all of your subscriptions. You can use this option to collect data from virtual machines running in different subscriptions and store it all in your selected workspace.  

        If you already have an existing Log Analytics workspace, you might want to use the same workspace (requires read and write permissions on the workspace). This is useful if you're using a centralized workspace in your organization and want to use it for security data collection. Learn more in [Manage access to log data and workspaces in Azure Monitor](../azure-monitor/platform/manage-access.md).

        If your selected workspace already has a Security or SecurityCenterFree solution enabled, the pricing will be set automatically. If not, install a Security Center solution on the workspace:

        1. From Security Center's menu, open **Pricing & settings**.
        1. Select the workspace to which you'll be connecting the agents.
        1. Select **Azure Defender on** or **Azure Defender off**.

1. Select **Apply** in the configuration pane.

1. Select **Save**. If a workspace needs to be provisioned, agent installation might take up to 25 minutes.

1. You'll be asked if you want to reconfigure monitored VMs that were previously connected to a default workspace:

    :::image type="content" source="./media/security-center-enable-data-collection/reconfigure-monitored-vm.png" alt-text="Review options to reconfigure monitored VMs":::

    - **No** - your new workspace settings will only be applied to newly discovered VMs that don't have the Log Analytics agent installed.
    - **Yes** - your new workspace settings will apply to all VMs and every VM currently connected to a Security Center created workspace will be reconnected to the new target workspace.

   > [!NOTE]
   > If you select Yes, you must not delete the workspace(s) created by Security Center until all VMs have been reconnected to the new target workspace. This operation fails if a workspace is deleted too early.



## Enable auto provisioning of the Policy Add-on for Kubernetes

To enable automatic provisioning of the Policy Add-on for Kubernetes: 

1. From Security Center's menu in the portal, select **Pricing & settings**.
1. Select the relevant subscription.
1. Select **Auto provisioning**.
1. Toggle the status to **On** for the **Policy Add-on for Kubernetes** .
    :::image type="content" source="./media/security-center-enable-data-collection/toggle-kubernetes-add-on.png" alt-text="Toggle to enable auto provisioning for K8s policy add-on":::
1. Select **Save**. The Azure policy, [Deploy Azure Policy Add-on to Azure Kubernetes Service clusters](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fa8eff44f-8c92-45c3-a3fb-9880802d67a7), is assigned and a remediation tasks is created.

## Data collection tier

> [!NOTE]
> Users of Azure Sentinel: note that security events collection within the context of a single workspace can be configured from either Azure Security Center or Azure Sentinel, but not both. If you're planning to add Azure Sentinel to a workspace that is already getting Azure Defender alerts from Azure Security Center, and is set to collect Security Events, you have two options:
> - Leave the Security Events collection in Azure Security Center as is. You will be able to query and analyze these events in Azure Sentinel as well as in Azure Defender. You will not, however, be able to monitor the connector's connectivity status or change its configuration in Azure Sentinel. If this is important to you, consider the second option.
>
> - [Disable Security Events collection](#data-collection-tier) in Azure Security Center, and only then add the Security Events connector in Azure Sentinel. As with the first option, you will be able to query and analyze events in both Azure Sentinel and Azure Defender/ASC, but you will now be able to monitor the connector's connectivity status or change its configuration in - and only in - Azure Sentinel.

Selecting a data collection tier in Azure Security Center will only affect the storage of security events in your Log Analytics workspace. The Log Analytics agent will still collect and analyze the security events required for Azure Security Center’s threat protection, regardless of which tier of security events you choose to store in your Log Analytics workspace (if any). Choosing to store security events in your workspace will enable investigation, search, and auditing of those events in your workspace. 
> [!NOTE]
> Storing data in log analytics might incur additional charges for data storage. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/security-center/).

You can choose the right filtering policy for your subscriptions and workspaces from four sets of events to be stored in your workspace: 
- **None** – Disable security event storage. This is the default setting.
- **Minimal** – A smaller set of events for customers who want to minimize the event volume.
- **Common** – This is a set of events that satisfies most customers and allows them a full audit trail.
- **All events** – For customers who want to make sure all events are stored.

These security events sets are available only with Azure Defender. See [Pricing](security-center-pricing.md) to learn more about Security Center's pricing tiers.

These sets were designed to address typical scenarios. Make sure to evaluate which one fits your needs before implementing it.

To determine the events that will belong to the **Common** and **Minimal** event sets, we worked with customers and industry standards to learn about the unfiltered frequency of each event and their usage. We used the following guidelines in this process:

- **Minimal** - Make sure that this set covers only events that might indicate a successful breach and important events that have a very low volume. For example, this set contains user successful and failed login (event IDs 4624, 4625), but it doesn’t contain sign out which is important for auditing but not meaningful for detection and has relatively high volume. Most of the data volume of this set is the login events and process creation event (event ID 4688).
- **Common** - Provide a full user audit trail in this set. For example, this set contains both user logins and user sign outs (event ID 4634). We include auditing actions like security group changes, key domain controller Kerberos operations, and other events that are recommended by industry organizations.

Events that have very low volume were included in the Common set as the main motivation to choose it over all the events is to reduce the volume and not to filter out specific events.

Here is a complete breakdown of the Security and App Locker event IDs for each set:

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
> - If you are using Group Policy Object (GPO), it is recommended that you enable audit policies Process Creation Event 4688 and the *CommandLine* field inside event 4688. For more information about Process Creation Event 4688, see Security Center's [FAQ](faq-data-collection-agents.md#what-happens-when-data-collection-is-enabled). For more information about these audit policies, see [Audit Policy Recommendations](/windows-server/identity/ad-ds/plan/security-best-practices/audit-policy-recommendations).
> -  To enable data collection for [Adaptive Application Controls](security-center-adaptive-application.md), Security Center configures a local AppLocker policy in Audit mode to allow all applications. This will cause AppLocker to generate events which are then collected and leveraged by Security Center. It is important to note that this policy will not be configured on any machines on which there is already a configured AppLocker policy. 
> - To collect Windows Filtering Platform [Event ID 5156](https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventID=5156), you need to enable [Audit Filtering Platform Connection](/windows/security/threat-protection/auditing/audit-filtering-platform-connection) (Auditpol /set /subcategory:"Filtering Platform Connection" /Success:Enable)
>

To choose your filtering policy:
1. On the **Data Collection** page, select your filtering policy under **Store additional raw data - Windows security events**.
 
1. Select **Save**.
    :::image type="content" source="./media/security-center-enable-data-collection/data-collection-tiers.png" alt-text="Select the Windows security events to collect":::


## Manual agent provisioning <a name="manual-agent"></a>
 
There are several ways to install the Log Analytics agent manually. When installing manually, make sure you disable auto provisioning.

### Operations Management Suite VM extension deployment 

You can manually install the Log Analytics agent, so Security Center can collect security data from your VMs and provide recommendations and alerts.

1. Disable auto provisioning.

1. Optionally, create a workspace.

1. Enable Azure Defender on the workspace on which you're installing the Log Analytics agent:

    1. From Security Center's menu, select **Pricing & settings**.

    1. Set the workspace on which you're installing the agent. Make sure the workspace is in the same subscription you use in Security Center and that you have read/write permissions on the workspace.

    1. Set Azure Defender to on, and select **Save**.

       >[!NOTE]
       >If the workspace already has a **Security** or **SecurityCenterFree** solution enabled, the pricing will be set automatically. 

1. If  you want to deploy the agents on new VMs using a Resource Manager template, install the Log Analytics agent:

   - [Install the Log Analytics agent for Windows](../virtual-machines/extensions/oms-windows.md)
   - [Install the Log Analytics agent for Linux](../virtual-machines/extensions/oms-linux.md)

1. To deploy the extensions on existing VMs, follow the instructions in [Collect data about Azure Virtual Machines](../azure-monitor/learn/quick-collect-azurevm.md).

   > [!NOTE]
   > The section **Collect event and performance data** is optional.
   >

1. To use PowerShell to deploy the extension, use the instructions from the virtual machines documentation:

    - [For Windows machines](../virtual-machines/extensions/oms-windows.md?toc=%252fazure%252fazure-monitor%252ftoc.json#powershell-deployment)
    - [For Linux machines](../virtual-machines/extensions/oms-linux.md?toc=%252fazure%252fazure-monitor%252ftoc.json#azure-cli-deployment)

> [!NOTE]
> For instructions on how to onboard Security Center using PowerShell, see [Automate onboarding of Azure Security Center using PowerShell](security-center-powershell-onboarding.md).


## Automatic provisioning in cases of a pre-existing agent installation <a name="preexisting"></a> 

The following use cases specify how automatic provision works in cases when there is already an agent or extension installed. 

- Log Analytics agent is installed on the machine, but not as an extension (Direct agent)<br>
If the Log Analytics agent is installed directly on the VM (not as an Azure extension), Security Center will install the Log Analytics agent extension, and may upgrade the Log Analytics agent to the latest version.
The agent installed will continue to report to its already configured workspace(s), and additionally will report to the workspace configured in Security Center (Multi-homing is supported on Windows machines).
If the configured workspace is a user workspace (not Security Center's default workspace), then you will need to install the "security/"securityFree" solution on it for Security Center to start processing events from VMs and computers reporting to that workspace.<br>
<br>
For Linux machines, Agent multi-homing is not yet supported - hence, if an existing agent installation is detected, automatic provisioning will not occur and the machine's configuration will not be altered.
<br>
For existing machines on subscriptions onboarded to Security Center before 17th March 2019, when an existing agent will be detected, the Log Analytics agent extension will not be installed and the machine will not be affected. For these machines, see to the "Resolve monitoring agent health issues on your machines" recommendation to resolve the agent installation issues on these machines.

  
- System Center Operations Manager agent is installed on the machine<br>
Security center will install the Log Analytics agent extension side by side to the existing Operations Manager. The existing Operations Manager agent will continue to report to the Operations Manager server normally. The Operations Manager agent and Log Analytics agent share common run-time libraries, which will be updated to the latest version during this process. If Operations Manager agent version 2012 is installed, **do not** enable automatic provisioning.<br>

- A pre-existing VM extension is present<br>
    - When the Monitoring Agent is installed as an extension, the extension configuration allows reporting to only a single workspace. Security Center does not override existing connections to user workspaces. Security Center will store security data from the VM in the workspace already connected, provided that the "security" or "securityFree" solution has been installed on it. Security Center may upgrade the extension version to the latest version in this process.  
    - To see to which workspace the existing extension is sending data to, run the test to [Validate connectivity with Azure Security Center](/archive/blogs/yuridiogenes/validating-connectivity-with-azure-security-center). Alternatively, you can open Log Analytics workspaces, select a workspace, select the VM, and look at the Log Analytics agent connection. 
    - If you have an environment where the Log Analytics agent is installed on client workstations and reporting to an existing Log Analytics workspace, review the list of [operating systems supported by Azure Security Center](security-center-os-coverage.md) to make sure your operating system is supported. For more information, see [Existing log analytics customers](./faq-azure-monitor-logs.md).
 
## Disable auto provisioning <a name="offprovisioning"></a>

When you disable auto provisioning, agents will not be provisioned on new VMs.

To turn off automatic provisioning of an agent:

1. From Security Center's menu in the portal, select **Pricing & settings**.
1. Select the relevant subscription.
1. Select **Auto provisioning**.
1. Toggle the status to **Off** for the relevant agent.
    :::image type="content" source="./media/security-center-enable-data-collection/agent-toggles.png" alt-text="Toggles to disable auto provisioning per agent type":::
1. Select **Save**. When auto provisioning is disabled, the default workspace configuration section is not displayed:
    :::image type="content" source="./media/security-center-enable-data-collection/empty-configuration-column.png" alt-text="Toggles to disable auto provisioning per agent type":::


> [!NOTE]
>  Disabling automatic provisioning does not remove the Log Analytics agent from Azure VMs where the agent was provisioned. For information on removing the OMS extension, see [How do I remove OMS extensions installed by Security Center](faq-data-collection-agents.md#remove-oms).
>


## Troubleshooting

-	To identify automatic provision installation issues, see [Monitoring agent health issues](security-center-troubleshooting-guide.md#mon-agent).

-  To identify monitoring agent network requirements, see [Troubleshooting monitoring agent network requirements](security-center-troubleshooting-guide.md#mon-network-req).
-	To identify manual onboarding issues, see [How to troubleshoot Operations Management Suite onboarding issues](https://support.microsoft.com/help/3126513/how-to-troubleshoot-operations-management-suite-onboarding-issues).

- To identify Unmonitored VMs and computers issues:

    A VM or computer is unmonitored by Security Center if the machine is not running the Log Analytics agent extension. A machine may have a local agent already installed, for example the OMS direct agent or the System Center Operations Manager agent. Machines with these agents are identified as unmonitored because these agents are not fully supported in Security Center. To fully benefit from all of Security Center’s capabilities, the Log Analytics agent extension is required.

    For more information about the reasons Security Center is unable to successfully monitor VMs and computers initialized for automatic provisioning, see [Monitoring agent health issues](security-center-troubleshooting-guide.md#mon-agent).




## Next steps
This article showed you how data collection and automatic provisioning in Security Center works. To learn more about Security Center, see the following pages:

- [Azure Security Center FAQ](faq-general.md)--Find frequently asked questions about using the service.
- [Security health monitoring in Azure Security Center](security-center-monitoring.md)--Learn how to monitor the health of your Azure resources.

This article describes how to install a Log Analytics agent and set a Log Analytics workspace in which to store the collected data. Both operations are required to enable data collection. Storing data in Log Analytics, whether you use a new or existing workspace, might incur additional charges for data storage. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/security-center/).

