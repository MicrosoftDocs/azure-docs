---
title: Plan Defender for Servers agents and extensions deployment
description: Plan for agent deployment to protect Azure, AWS, GCP, and on-premises servers with Microsoft Defender for Servers.
ms.topic: conceptual
ms.author: dacurwin
author: dcurwin
ms.date: 11/06/2022
---
# Plan agents, extensions, and Azure Arc for Defender for Servers

This article helps you plan your agents, extensions, and Azure Arc resources for your Microsoft Defender for Servers deployment.

Defender for Servers is one of the paid plans provided by [Microsoft Defender for Cloud](defender-for-cloud-introduction.md).

## Before you begin

This article is the *fifth* article in the Defender for Servers planning guide. Before you begin, review the earlier articles:

1. [Start planning your deployment](plan-defender-for-servers.md)
1. [Understand where your data is stored and Log Analytics workspace requirements](plan-defender-for-servers-data-workspace.md)
1. [Review Defender for Servers access roles](plan-defender-for-servers-roles.md)
1. [Select a Defender for Servers plan](plan-defender-for-servers-select-plan.md)

## Review Azure Arc requirements

Azure Arc helps you onboard Amazon Web Services (AWS), Google Cloud Platform (GCP), and on-premises machines to Azure. Defender for Cloud uses Azure Arc to protect non-Azure machines.

### Foundational cloud security posture management

The free foundational cloud security posture management (CSPM) features for AWS and GCP machines don't require Azure Arc. For full functionality, we recommend that you *do* have Azure Arc running on AWS or GCP machines.

Azure Arc onboarding is required for on-premises machines.

### Defender for Servers plan

To use Defender for Servers, all AWS, GCP, and on-premises machines should be Azure Arc-enabled.

You can onboard the Azure Arc agent to your AWS or GCP servers automatically with the AWS or GCP multicloud connector.

### Plan for Azure Arc deployment

To plan for Azure Arc deployment:

1. Review the Azure Arc [planning recommendations](../azure-arc/servers/plan-at-scale-deployment.md) and [deployment prerequisites](../azure-arc/servers/prerequisites.md).
1. Open the [network ports for Azure Arc](support-matrix-defender-for-servers.md#network-requirements) in your firewall.
1. Azure Arc installs the Connected Machine agent to connect to and manage machines that are hosted outside of Azure. Review the following information:

    - The [agent components and data collected from machines](../azure-arc/servers/agent-overview.md#agent-resources).
    - [Network and internet access ](../azure-arc/servers/network-requirements.md) for the agent.
    - [Connection options](../azure-arc/servers/deployment-options.md) for the agent.

## Log Analytics agent and Azure Monitor agent

Defender for Cloud uses the Log Analytics agent and the Azure Monitor agent to collect information from compute resources. Then, it sends the data to a Log Analytics workspace for more analysis. Review the [differences and recommendations for both agents](../azure-monitor/agents/agents-overview.md).

The following table describes the agents that are used in Defender for Servers:

Feature | Log Analytics agent | Azure Monitor agent
--- | --- | ---
Foundational CSPM recommendations (free) that depend on the agent: [OS baseline recommendation](apply-security-baseline.md) (Azure VMs) | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported by the Log Analytics agent.":::| :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported by the Azure Monitor agent.":::<br/><br/> With the Azure Monitor agent, the Azure Policy [guest configuration extension](../virtual-machines/extensions/guest-configuration.md) is used.
Foundational CSPM: [System updates recommendations](recommendations-reference.md#compute-recommendations) (Azure VMs) | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported by the Log Analytics agent"::: | Not yet available.
Foundational CSPM: [Antimalware/endpoint protection recommendations](endpoint-protection-recommendations-technical.md) (Azure VMs) | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported by the Log Analytics agent."::: | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported by the Azure Monitor agent.":::
Attack detection at the OS level and network layer, including fileless attack detection<br/><br/> Plan 1 relies on Defender for Endpoint capabilities for attack detection. | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported by the Log Analytics agent. Plan 1 relies on Defender for Endpoint.":::<br/><br/> Plan 2| :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported by the Azure Monitor agent. Plan 1 relies on Defender for Endpoint.":::<br/><br/> Plan 2
File integrity monitoring (Plan 2 only)  | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported by the Log Analytics agent."::: | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported by the Azure Monitor agent."::: 
[Adaptive application controls](adaptive-application-controls.md) (Plan 2 only) | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported by the Log Analytics agent."::: | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported by the Azure Monitor agent.":::

## Qualys extension

The Qualys extension is available in Defender for Servers Plan 2. The extension is deployed if you want to use Qualys for vulnerability assessment.

Here's more information:

- The Qualys extension sends metadata for analysis to one of two Qualys datacenter regions, depending on your Azure region.

  - If you're in a European Azure geography, data is processed in the Qualys European datacenter.
  - For other regions, data is processed in the US datacenter.

- To use Qualys on a machine, the extension must be installed and the machine must be able to communicate with the relevant network endpoint:
  - Europe datacenter: `https://qagpublic.qg2.apps.qualys.eu`
  - US datacenter: `https://qagpublic.qg3.apps.qualys.com`

## Guest configuration extension

The extension performs audit and configuration operations inside VMs.

- If you're using the Azure Monitor Agent, Defender for Cloud uses this extension to analyze operating system security baseline settings on Windows and Linux machines.
- Although Azure Arc-enabled servers and the guest configuration extension are free, more costs might apply if you use guest configuration policies on Azure Arc servers outside the scope of Defender for Cloud.

Learn more about the Azure Policy [guest configuration extension](../virtual-machines/extensions/guest-configuration.md).

## Defender for Endpoint extensions

When you enable Defender for Servers, Defender for Cloud automatically deploys a Defender for Endpoint extension. The extension is a management interface that runs a script inside the operating system to deploy and integrate the Defender for Endpoint sensor on the machine.

- Windows machines extension: `MDE.Windows`
- Linux machines extension: `MDE.Linux`
- Machines must meet [minimum requirements](/microsoft-365/security/defender-endpoint/minimum-requirements).
- Some Windows Server versions have [specific requirements](/microsoft-365/security/defender-endpoint/configure-server-endpoints).

## Verify operating system support

Before you deploy Defender for Servers, verify operating system support for agents and extensions:

- Verify that your [operating systems are supported](/microsoft-365/security/defender-endpoint/minimum-requirements) by Defender for Endpoint.
- [Check requirements](../azure-arc/servers/prerequisites.md) for the Azure Arc Connect Machine agent.
- Check operating system support for the [Log Analytics agent](../azure-monitor/agents/log-analytics-agent.md#supported-operating-systems) and [Azure Monitor agent](../azure-monitor/agents/agents-overview.md).

## Review agent provisioning

When you enable Defender for Cloud plans, including Defender for Servers, you can choose to automatically provision some agents that are relevant for Defender for Servers:

- Log Analytics agent and Azure Monitor agent for Azure VMs
- Log Analytics agent and Azure Monitor agent for Azure Arc VMs
- Qualys agent
- Guest configuration agent

When you enable Defender for Servers Plan 1 or Plan 2, the Defender for Endpoint extension is automatically provisioned on all supported machines in the subscription.

## Provisioning considerations

The following table describes provisioning considerations to be aware of:

Provisioning | Details
--- | ---
Defender for Endpoint sensor |  If machines are running Microsoft Antimalware, also known as System Center Endpoint Protection (SCEP), the Windows extension automatically removes it from the machine.<br/><br/> If you deploy on a machine that already has the legacy Microsoft Monitoring agent (MMA) Defender for Endpoint sensor running, after the Defender for Cloud and Defender for Endpoint unified solution is successfully installed, the extension stops and it disables the legacy sensor. The change is transparent and the machine’s protection history is preserved.
AWS and GCP machines | Configure automatic provisioning when you set up the AWS or GCP connector.
Manual installation | If you don't want Defender for Cloud to provision the Log Analytics agent and Azure Monitor agent, you can install agents manually.<br/><br/> You can connect the agent to the default Defender for Cloud workspace or to a custom workspace.<br/><br/> The workspace must have the *SecurityCenterFree* (for free foundational CSPM) or *Security* solution enabled (Defender for Servers Plan 2).
[Log Analytics agent running directly](faq-data-collection-agents.yml#what-if-a-log-analytics-agent-is-directly-installed-on-the-machine-but-not-as-an-extension--direct-agent--) | If a Windows VM has the Log Analytics agent running but not as a VM extension, Defender for Cloud installs the extension. The agent reports to the Defender for Cloud workspace and to the existing agent workspace. <br/><br/> On Linux VMs, multi-homing isn't supported. If an existing agent exists, the Log Analytics agent isn't automatically provisioned.
[Operations Manager agent](faq-data-collection-agents.yml#what-if-a-system-center-operations-manager-agent-is-already-installed-on-my-vm-) | The Log Analytics agent can work side by side with the Operations Manager agent. The agents share common runtime libraries that are updated when the Log Analytics agent is deployed.
Removing the Log Analytics extension | If you remove the Log Analytics extension, Defender for Cloud can't collect security data and recommendations, and alerts will be missing. Within 24 hours, Defender for Cloud determines that the extension is missing and reinstalls it.

## When to opt out of auto provisioning

You might want to opt out of automatic provisioning in the circumstances that are described in the following table:

Situation | Relevant agent | Details
--- | --- | ---
You have critical VMs that shouldn't have agents installed | Log Analytics agent, Azure Monitor agent | Automatic provisioning is for an entire subscription. You can't opt out for specific machines.
You're running the System Center Operations Manager agent version 2012 with Operations Manager 2012 | Log Analytics agent | With this configuration, don't turn on automatic provisioning. Management capabilities might be lost.
You want to configure a custom workspace | Log Analytics agent, Azure Monitor agent | You have two options with a custom workspace:<br/><br/> - Opt out of automatic provisioning when you first set up Defender for Cloud. Then, configure provisioning on your custom workspace.<br/><br/>- Let automatic provisioning run to install the Log Analytics agents on machines. Set a custom workspace, and then reconfigure existing VMs with the new workspace setting.

## Next steps

After working through these planning steps, you can start deployment:

- [Enable Defender for Servers](enable-enhanced-security.md) plans
- [Connect on-premises machines](quickstart-onboard-machines.md) to Azure.
- [Connect AWS accounts](quickstart-onboard-aws.md) to Defender for Cloud.
- [Connect GCP projects](quickstart-onboard-gcp.md) to Defender for Cloud.
- Learn about [scaling your Defender for Server deployment](plan-defender-for-servers-scale.md).
