---
title: Collect data from your workloads with the Log Analytics agent
description: Learn about how the Log Analytics agent collects data from your workloads to let you protect your workloads with Microsoft Defender for Cloud.
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.custom: ignite-2022
ms.date: 07/31/2023
---

# Collect data from your workloads with the Log Analytics agent

## Configure the Log Analytics agent and workspaces

When the Log Analytics agent is on, Defender for Cloud deploys the agent on all supported Azure VMs and any new ones created. For the list of supported platforms, see [Supported platforms in Microsoft Defender for Cloud](security-center-os-coverage.md).

To configure integration with the Log Analytics agent:

1. From Defender for Cloud's menu, open **Environment settings**.
1. Select the relevant subscription.
1. In the Monitoring Coverage column of the Defender plans, select **Settings**.
1. From the configuration options pane, define the workspace to use.

    :::image type="content" source="./media/enable-data-collection/log-analytics-agent-deploy-options.png" alt-text="Screenshot of configuration options for Log Analytics agents for VMs." lightbox="./media/enable-data-collection/log-analytics-agent-deploy-options.png":::

    - **Connect Azure VMs to the default workspaces created by Defender for Cloud** - Defender for Cloud creates a new resource group and default workspace in the same geolocation, and connects the agent to that workspace. If a subscription contains VMs from multiple geolocations, Defender for Cloud creates multiple workspaces to ensure compliance with data privacy requirements.

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

- **Minimal** - This set is intended to cover only events that might indicate a successful breach and important events with low volume. Most of the data volume of this set is successful user logon (event ID 4624), failed user logon events (event ID 4625), and process creation events (event ID 4688). Sign out events are important for auditing only and have relatively high volume, so they aren't included in this event set.
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
>
> - If you are using Group Policy Object (GPO), it is recommended that you enable audit policies Process Creation Event 4688 and the *CommandLine* field inside event 4688. For more information about Process Creation Event 4688, see Defender for Cloud's [common questions](./faq-data-collection-agents.yml#what-happens-when-data-collection-is-enabled-). For more information about these audit policies, see [Audit Policy Recommendations](/windows-server/identity/ad-ds/plan/security-best-practices/audit-policy-recommendations).
> - To enable data collection for [Adaptive application controls](adaptive-application-controls.md), Defender for Cloud configures a local AppLocker policy in Audit mode to allow all applications. This will cause AppLocker to generate events which are then collected and leveraged by Defender for Cloud. It is important to note that this policy will not be configured on any machines on which there is already a configured AppLocker policy.
> - To collect Windows Filtering Platform [Event ID 5156](https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventID=5156), you need to enable [Audit Filtering Platform Connection](/windows/security/threat-protection/auditing/audit-filtering-platform-connection) (Auditpol /set /subcategory:"Filtering Platform Connection" /Success:Enable)
>

### Setting the security event option at the workspace level

You can define the level of security event data to store at the workspace level.

1. From Defender for Cloud's menu in the Azure portal, select **Environment settings**.
1. Select the relevant workspace. The only data collection events for a workspace are the Windows security events described on this page.

    :::image type="content" source="media/enable-data-collection/event-collection-workspace.png" alt-text="Screenshot of setting the security event data to store in a workspace." lightbox="media/enable-data-collection/event-collection-workspace.png":::

1. Select the amount of raw event data to store and select **Save**.

<a name="manual-agent"></a>

## Manual agent provisioning

To manually install the Log Analytics agent:

1. In the Azure portal, navigate to the Defender for Cloud's **Environment Settings** page.
1. Select the relevant subscription and then select **Settings & monitoring**.
1. Turn Log Analytics agent/Azure Monitor Agent **Off**.

    :::image type="content" source="media/working-with-log-analytics-agent/manual-provision.png" alt-text="Screenshot of turning off the Log Analytics setting." lightbox="media/working-with-log-analytics-agent/manual-provision.png":::

1. Optionally, create a workspace.
1. Enable Microsoft Defender for Cloud on the workspace on which you're installing the Log Analytics agent:

    1. From Defender for Cloud's menu, open **Environment settings**.

    1. Set the workspace on which you're installing the agent. Make sure the workspace is in the same subscription you use in Defender for Cloud and that you have read/write permissions for the workspace.

    1. Select one or both "Servers" or "SQL servers on machines"(Foundational CSPM is the free default), and then select **Save**.
    
        :::image type="content" source="media/working-with-log-analytics-agent/apply-plan-to-workspace.png" alt-text="Screenshot that shows where to set the workspace on which you're installing the agent." lightbox="media/working-with-log-analytics-agent/apply-plan-to-workspace.png":::

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

<a name="offprovisioning"></a>

To turn off monitoring components:

- Go to the Defender plans and turn off the plan that uses the extension and select **Save**.
- For Defender plans that have monitoring settings, go to the settings of the Defender plan, turn off the extension, and select **Save**.

> [!NOTE]
>
> - Disabling extensions does not remove the extensions from the effected workloads.
> - For information on removing the OMS extension, see [How do I remove OMS extensions installed by Defender for Cloud](./faq-data-collection-agents.yml#how-do-i-remove-oms-extensions-installed-by-defender-for-cloud-).
