---
title: Azure Security Center FAQ - data collection and agents
description: Frequently asked questions about data collection, agents, and workspaces for Azure Security Center, a product that helps you prevent, detect, and respond to threats
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: be2ab6d5-72a8-411f-878e-98dac21bc5cb
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/25/2020
ms.author: memildin

---

# FAQ - Questions about data collection, agents, and workspaces

Security Center collects data from your Azure virtual machines (VMs), Virtual machine scale sets, IaaS containers, and non-Azure computers (including on-premises machines) to monitor for security vulnerabilities and threats. Data is collected using the Log Analytics agent, which reads various security-related configurations and event logs from the machine and copies the data to your workspace for analysis.


## Am I billed for Azure Monitor logs on the workspaces created by Security Center?

No. Workspaces created by Security Center, while configured for Azure Monitor logs per node billing, don't incur Azure Monitor logs charges. Security Center billing is always based on your Security Center security policy and the solutions installed on a workspace:

- **Free tier** – Security Center enables the 'SecurityCenterFree' solution on the default workspace. You won't be billed for the Free tier.

- **Standard tier** – Security Center enables the 'Security' solution on the default workspace.

For more information on pricing, see [Security Center pricing](https://azure.microsoft.com/pricing/details/security-center/).

> [!NOTE]
> The log analytics pricing tier of workspaces created by Security Center does not affect Security Center billing.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../includes/azure-monitor-log-analytics-rebrand.md)]


## What qualifies a VM for automatic provisioning of the Log Analytics agent installation?

Windows or Linux IaaS VMs qualify if:

- The Log Analytics agent extension is not currently installed on the VM.
- The VM is in running state.
- The Windows or Linux [Azure Virtual Machine Agent](https://docs.microsoft.com/azure/virtual-machines/extensions/agent-windows) is installed.
- The VM is not used as an appliance such as web application firewall or next generation firewall.


## Where is the default Log Analytics workspace created?

The location of the default workspace depends on your Azure region:

- For VMs in the United States and Brazil the workspace location is the United States
- For VMs in Canada, the workspace location is Canada
- For VMs in Europe the workspace location is Europe
- For VMs in the UK the workspace location is the UK
- For VMs in East Asia and Southeast Asia the workspace location is Asia
- For VMs in Korea, the workspace location is Korea
- For VMs in India, the workspace location is India
- For VMs in Japan, the workspace location is Japan
- For VMs in China, the workspace location is China
- For VMs in Australia, the workspace location is Australia


## What data is collected by the Log Analytics agent?

For a full list of the applications and services monitored by the agent, see [What is monitored by Azure Monitor?](https://docs.microsoft.com/azure/azure-monitor/monitor-reference#azure-services).

> [!IMPORTANT]
> Note that for some services, such as Azure Firewall, if you have enabled logging and chosen a chatty resource to log (for example, setting the log to *verbose*) you may see significant impacts on your Log Analytics workspace storage needs. 


## Can I delete the default workspaces created by Security Center?

**Deleting the default workspace is not recommended.** Security Center uses the default workspaces to store security data from your VMs. If you delete a workspace, Security Center is unable to collect this data and some security recommendations and alerts are unavailable.

To recover, remove the Log Analytics agent on the VMs connected to the deleted workspace. Security Center reinstalls the agent and creates new default workspaces.

## How can I use my existing Log Analytics workspace?

You can select an existing Log Analytics workspace to store data collected by Security Center. To use your existing Log Analytics workspace:

- The workspace must be associated with your selected Azure subscription.
- At a minimum, you must have read permissions to access the workspace.

To select an existing Log Analytics workspace:

1. Under **Security policy – Data Collection**, select **Use another workspace**.

    ![Use another workspace][4]

1. From the pull-down menu, select a workspace to store collected data.

    > [!NOTE]
    > In the pull down menu, only workspaces that you have access to and are in your Azure subscription are shown.

1. Select **Save**. You will be asked if you would like to reconfigure monitored VMs.

    - Select **No** if you want the new workspace settings to **apply on new VMs only**. The new workspace settings only apply to new agent installations; newly discovered VMs that do not have the Log Analytics agent installed.
    - Select **Yes** if you want the new workspace settings to **apply on all VMs**. In addition, every VM connected to a Security Center created workspace is reconnected to the new target workspace.

    > [!NOTE]
    > If you select **Yes**, don't delete any workspaces created by Security Center until all VMs have been reconnected to the new target workspace. This operation fails if a workspace is deleted too early.

    - To cancel the operation, select **Cancel**.

## What if the Log Analytics agent was already installed as an extension on the VM?<a name="mmaextensioninstalled"></a>

When the Monitoring Agent is installed as an extension, the extension configuration allows reporting to only a single workspace. Security Center does not override existing connections to user workspaces. Security Center will store security data from a VM in a workspace that is already connected, provided that the "Security" or "SecurityCenterFree" solution has been installed on it. Security Center may upgrade the extension version to the latest version in this process.

For more information, see [Automatic provisioning in cases of a pre-existing agent installation](security-center-enable-data-collection.md#preexisting).



## What if a Log Analytics agent is directly installed on the machine but not as an extension (Direct Agent)?<a name="directagentinstalled"></a>

If the Log Analytics agent is installed directly on the VM (not as an Azure extension), Security Center will install the Log Analytics agent extension, and may upgrade the Log Analytics agent to the latest version.

The agent installed will continue to report to its already configured workspace(s), and in addition will report to the workspace configured in Security Center (Multi-homing is supported on Windows machines).

If the configured workspace is a user workspace (not Security Center's default workspace), you will need to install the "Security/"SecurityCenterFree" solution on it for Security Center to start processing events from VMs and computers reporting to that workspace.

For Linux machines, Agent multi-homing is not yet supported - hence, if an existing agent installation is detected, automatic provisioning will not occur and the machine's configuration will not be altered.

For existing machines on subscriptions onboarded to Security Center before March 17 2019, when an existing agent will be detected, the Log Analytics agent extension will not be installed and the machine will not be affected. For these machines, see the "Resolve monitoring agent health issues on your machines" recommendation to resolve the agent installation issues on these machines

For more information, see the next section [What happens if a System Center Operations Manager or OMS direct agent is already installed on my VM?](#scomomsinstalled)

## What if a System Center Operations Manager agent is already installed on my VM?<a name="scomomsinstalled"></a>

Security center will install the Log Analytics agent extension side by side to the existing System Center Operations Manager agent. The existing agent will continue to report to the System Center Operations Manager server normally. Note that the Operations Manager agent and Log Analytics agent share common run-time libraries, which will be updated to the latest version during this process. Note - If version 2012 of the Operations Manager agent is installed, do not turn on automatic provisioning (manageability capabilities can be lost when the Operations Manager server is also version 2012).


## What is the impact of removing these extensions?

If you remove the Microsoft Monitoring Extension, Security Center is not able to collect security data from the VM and some security recommendations and alerts are unavailable. Within 24 hours, Security Center determines that the VM is missing the extension and reinstalls the extension.


## How do I stop the automatic agent installation and workspace creation?

You can turn off automatic provisioning for your subscriptions in the security policy but this is not recommended. Turning off automatic provisioning limits Security Center recommendations and alerts. To disable automatic provisioning:

1. If your subscription is configured for the Standard tier, open the security policy for that subscription and select the **Free** tier.

   ![Pricing tier][1]

1. Next, turn off automatic provisioning by selecting **Off** on the **Security policy – Data collection** page.
   ![Data collection][2]


## Should I opt out of the automatic agent installation and workspace creation?

> [!NOTE]
> Be sure to review sections [What are the implications of opting out?](#what-are-the-implications-of-opting-out-of-automatic-provisioning) and [recommended steps when opting out](#what-are-the-recommended-steps-when-opting-out-of-automatic-provisioning) if you choose to opt out of automatic provisioning.

You may want to opt out of automatic provisioning if the following applies to you:

- Automatic agent installation by Security Center applies to the entire subscription. You cannot apply automatic installation to a subset of VMs. If there are critical VMs that cannot be installed with the Log Analytics agent, then you should opt out of automatic provisioning.
- Installation of the Log Analytics agent extension updates the agent's version. This applies to a direct agent and a System Center Operations Manager agent (in the latter, the Operations Manager and Log Analytics agent share common runtime libraries - which will be updated in the process). If the installed Operations Manager agent is version 2012 and is upgraded, manageability capabilities can be lost when the Operations Manager server is also version 2012. Consider opting out of automatic provisioning if the installed Operations Manager agent is version 2012.
- If you have a custom workspace external to the subscription (a centralized workspace), then you should opt out of automatic provisioning. You can manually install the Log Analytics agent extension and connect it your workspace without Security Center overriding the connection.
- If you want to avoid creation of multiple workspaces per subscription and you have your own custom workspace within the subscription, then you have two options:

   1. You can opt out of automatic provisioning. After migration, set the default workspace settings as described in [How can I use my existing Log Analytics workspace?](#how-can-i-use-my-existing-log-analytics-workspace)

   1. Or, you can allow the migration to complete, the Log Analytics agent to be installed on the VMs, and the VMs connected to the created workspace. Then, select your own custom workspace by setting the default workspace setting with opting in to reconfiguring the already installed agents. For more information, see [How can I use my existing Log Analytics workspace?](#how-can-i-use-my-existing-log-analytics-workspace)


## What are the implications of opting out of automatic provisioning?

When migration is complete, Security Center can't collect security data from the VM and some security recommendations and alerts are unavailable. If you opt out, install the Log Analytics agent manually. See [recommended steps when opting out](#what-are-the-recommended-steps-when-opting-out-of-automatic-provisioning).


## What are the recommended steps when opting out of automatic provisioning?

Manually install the Log Analytics agent extension so Security Center can collect security data from your VMs and provide recommendations and alerts. See [agent installation for Windows VM](../virtual-machines/extensions/oms-windows.md) or [agent installation for Linux VM](../virtual-machines/extensions/oms-linux.md) for guidance on installation.

You can connect the agent to any existing custom workspace or Security Center created workspace. If a custom workspace does not have the 'Security' or 'SecurityCenterFree' solutions enabled, then you will need to apply a solution. To apply, select the custom workspace or subscription and apply a pricing tier via the **Security policy – Pricing tier** page.

   ![Pricing tier][1]

Security Center will enable the correct solution on the workspace based on the selected pricing tier.


## How do I remove OMS extensions installed by Security Center?<a name="remove-oms"></a>

You can manually remove the Log Analytics agent. This is not recommended as it limits Security Center recommendations and alerts.

> [!NOTE]
> If data collection is enabled, Security Center will reinstall the agent after you remove it.  You need to disable data collection before manually removing the agent. See How do I stop the automatic agent installation and workspace creation? for instructions on disabling data collection.

To manually remove the agent:

1.    In the portal, open **Log Analytics**.

1.    On the Log Analytics page, select a workspace:

1.    Select the VMs that you don't want to monitor and select **Disconnect**.

   ![Remove the agent][3]

> [!NOTE]
> If a Linux VM already has a non-extension OMS agent, removing the extension removes the agent as well and you'll have to reinstall it.


## How do I disable data collection?

Automatic provisioning is highly recommended in order to get security alerts and recommendations about system updates, OS vulnerabilities, and endpoint protection. By default, auto-provisioning is disabled.

If you've enabled it but now want to disable it:

1. From [the Azure portal](https://portal.azure.com), open **Security Center** and select **Security policy**.

1. Select the subscription on which you want to disable automatic provisioning.

    **Security policy - Data collection** opens.

1. Under **Auto provisioning**, select **Off**.


## How do I enable data collection?

You can enable data collection for your Azure subscription in the Security policy. To enable data collection. [Sign in to the Azure portal](https://portal.azure.com), select **Browse**, select **Security Center**, and select **Security policy**. Select the subscription that you wish to enable automatic provisioning. When you select a subscription **Security policy - Data collection** opens. Under **Auto provisioning**, select **On**.


## What happens when data collection is enabled?

When automatic provisioning is enabled, Security Center provisions the Log Analytics agent on all supported Azure VMs and any new ones that are created. Automatic provisioning is recommended but manual agent installation is also available. [Learn how to install the Log Analytics agent extension](../azure-monitor/learn/quick-collect-azurevm.md#enable-the-log-analytics-vm-extension). 

The agent enables the process creation event 4688 and the *CommandLine* field inside event 4688. New processes created on the VM are recorded by EventLog and monitored by Security Center's detection services. For more information on the details recorded for each new process, see [description fields in 4688](https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventID=4688#fields). The agent also collects the 4688 events created on the VM and stores them in search.

The agent also enables data collection for [Adaptive Application Controls](security-center-adaptive-application.md), Security Center configures a local AppLocker policy in Audit mode to allow all applications. This policy will cause AppLocker to generate events, which are then collected and leveraged by Security Center. It is important to note that this policy will not be configured on any machines on which there is already a configured AppLocker policy. 

When Security Center detects suspicious activity on the VM, the customer is notified by email if [security contact information](security-center-provide-security-contact-details.md) has been provided. An alert is also visible in Security Center's security alerts dashboard.


## Will Security Center work using an OMS gateway?

Yes. Azure Security Center leverages Azure Monitor to collect data from Azure VMs and servers, using the Log Analytics agent.
To collect the data, each VM and server must connect to the Internet using HTTPS. The connection can be direct, using a proxy, or through the [OMS Gateway](../azure-monitor/platform/gateway.md).


## Does the Monitoring Agent impact the performance of my servers?

The agent consumes a nominal amount of system resources and should have little impact on the performance. For more information on performance impact and the agent and extension, see the [planning and operations guide](security-center-planning-and-operations-guide.md#data-collection-and-storage).




<!--Image references-->
[1]: ./media/security-center-platform-migration-faq/pricing-tier.png
[2]: ./media/security-center-platform-migration-faq/data-collection.png
[3]: ./media/security-center-platform-migration-faq/remove-the-agent.png
[4]: ./media/security-center-platform-migration-faq/use-another-workspace.png
