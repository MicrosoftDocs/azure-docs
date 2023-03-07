---
title: Plan Defender for Servers agents and extensions deployment
description: Plan for agent deployment to protect Azure, AWS, GCP, and on-premises servers with Defender for Servers 
ms.topic: conceptual
ms.author: benmansheim
author: bmansheim
ms.date: 11/06/2022
---
# Plan Defender for Servers agents/extensions and Azure Arc

This article helps you to scale your Microsoft Defender for Servers deployment. Defender for Servers is one of the paid plans provided by [Microsoft Defender for Cloud](defender-for-cloud-introduction.md).

## Before you start 

This article is the fifth part of the Defender for Servers planning guide. Before you begin, review:

1. [Start planning your deployment](plan-defender-for-servers.md)
1. [Understand where your data is stored and Log Analytics workspace requirements](plan-defender-for-servers-data-workspace.md)
1. [Review Defender for Servers access roles](plan-defender-for-servers-roles.md)
1. [Select a Defender for Servers plan](plan-defender-for-servers-select-plan.md)

## Review agents and extensions

Defender for Servers plans use a number of agents/extensions.

## Review Azure Arc requirements

Azure Arc is used to onboard AWS, GCP, and on-premises machines to Azure, and is used by Defender for Cloud to protect non-Azure machines. 

- **Foundational CSPM**:
    - For free foundational CSPM features, you don't need Azure Arc running on AWS/GCP machines, but it's recommended for full functionality.
    - You do need Azure Arc onboarding for on-premises machines.
- **Defender for Servers plan**:
    - To use the Defender for Servers, all AWS/GCP and on-premises machines should be Azure Arc-enabled.
    - After setting up AWS/GCP connectors, Defender for Cloud can automatically deploy agents to AWS/GCP servers. This includes automatic deployment of the Azure Arc agent.

### Plan for Azure Arc deployment

1. Review [planning recommendations](../azure-arc/servers/plan-at-scale-deployment.md), and [deployment prerequisites](../azure-arc/servers/prerequisites.md).
1. Azure Arc installs the Connected Machine agent to connect to and manage machines hosted outside Azure. Review the following:
    - The [agent components and data collected from machines](../azure-arc/servers/agent-overview.md#agent-resources).
    - [Network and internet access ](../azure-arc/servers/network-requirements.md) for the agent.
    - [Connection options](../azure-arc/servers/deployment-options.md) for the agent.


## Log Analytics agent/Azure Monitor agent

Defender for Cloud uses the Log Analytics agent/Azure Monitor agent to collect information from compute resources, and then sends it to a Log Analytics workspace for further analysis. Review the [differences and recommendations regarding both agents](../azure-monitor/agents/agents-overview.md). Agents are used in Defender for Servers as follows.


Feature | Log Analytics agent | Azure Monitor agent
--- | --- | --- 
Foundational CSPM recommendations (free) that depend on agent: [OS baseline recommendation](apply-security-baseline.md) (Azure VMs) | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported by the Log Analytics agent.":::| :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported by the Azure Monitor agent.":::<br/><br/> With the Azure Monitor agent, the Azure Policy [guest configuration extension](../virtual-machines/extensions/guest-configuration.md) is used.
Foundational CSPM: [System updates recommendations](recommendations-reference.md#compute-recommendations) (Azure VMs) | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported by the Log Analytics agent"::: | Not yet available.
Foundational CSPM: [Antimalware/Endpoint protection recommendations](endpoint-protection-recommendations-technical.md) (Azure VMs) | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported by the Log Analytics agent."::: | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported by the Azure Monitor agent.":::
Attack detection at the OS level and network layer, including fileless attack detection).<br/><br/> Plan 1 relies on Defender for Endpoint capabilities for attack detection. | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported by the Log Analytics agent. Plan 1 relies on Defender for Endpoint.":::<br/><br/> Plan 2| :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported by the Azure Monitor agent. Plan 1 relies on Defender for Endpoint.":::<br/><br/> Plan 2
File integrity monitoring (Plan 2 only)  | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported by the Log Analytics agent."::: | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported by the Azure Monitor agent."::: 
[Adaptive application controls](adaptive-application-controls.md) (Plan 2 only) | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported by the Log Analytics agent."::: | :::image type="icon" source="./media/icons/yes-icon.png" alt-text="Icon that shows it's supported by the Azure Monitor agent.":::


## Qualys extension

The Qualys extension is available in Defender for Servers Plan 2, and is deployed if you want to use Qualys for vulnerability assessment.

- The Qualys extension sends metadata for analysis to one of two Qualys datacenter regions, depending on your Azure region.
    - If you're in a European Azure geography data is processed in Qualys' European data center. 
    - For other regions data is processed in the US data center.
- To use Qualys on a machine, the extension must be installed, and the machine must be able to communicate with the relevant network endpoint:
    - Europe datacenter: `https://qagpublic.qg2.apps.qualys.eu`
    - US datacenter: `https://qagpublic.qg3.apps.qualys.com`


## Guest configuration extension

The extension performs audit and configuration operations inside VMs.

- If you're using the Azure Monitor Agent, Defender for Cloud leverages this extension to analyze operating system security baseline settings on Windows and Linux machines.
- While Azure Arc-enabled servers and the guest configuration extension are free, additional costs might apply when using guest configuration policies on Azure Arc servers outside Defender for Cloud scope.

Learn more about the Azure Policy [guest configuration extension](../virtual-machines/extensions/guest-configuration.md)

## Defender for Endpoint extensions

When you enable Defender for Servers, Defender for Cloud automatically deploys a Defender for Endpoint extension. The extension is a management interface that runs a script inside the operating system to deploy and integrate the Defender for Endpoint sensor on the machine.

- Windows machines extension: MDE.Windows
- Linux machines extension: MDE.Linux
- Machines must meet [minimum requirements](/microsoft-365/security/defender-endpoint/minimum-requirements).
- There are some [specific requirements](/microsoft-365/security/defender-endpoint/configure-server-endpoints) for some Windows Server versions.

## Verify operating system support

Before deployment, verify operating system support for agents and extensions.

- Verify that your [operating systems are supported](/microsoft-365/security/defender-endpoint/minimum-requirements) by Defender for Endpoint.
- [Check requirements](../azure-arc/servers/prerequisites.md) for Azure Arc Connect Machine agent.
- Check operating system support for the [Log Analytics agent](../azure-monitor/agents/log-analytics-agent.md#supported-operating-systems) and [Azure Monitor agent](../azure-monitor/agents/agents-overview.md)

## Review agent provisioning

When you enable Defender for Cloud plans, including Defender for Servers, you can select to automatically provision a number of agents. These are the agents that are relevant for Defender for Servers:

- Log Analytics agent/Azure Monitor agent for Azure VMs
- Log Analytics agent/Azure Monitor agent for Azure Arc VMs
- Qualys agent 
- Guest configuration agent 

In addition, when you enable Defender for Servers Plan 1 or Plan 2, the Defender for Endpoint extension is automatically provisioned on all supported machines in the subscription.

## Points to note

**Provisioning** | **Details**
--- | ---
Defender for Endpoint sensor |  If machines are running Microsoft Antimalware, also known as System Center Endpoint Protection (SCEP), the Windows extension automatically removes it from the machine.<br/><br/> If you deploy on a machine that already has the legacy Microsoft Monitoring agent (MMA) Defender for Endpoint sensor running, after successfully installing the Defender for Cloud/Defender for Endpoint unified solution, the extension will stop and disable the legacy sensor. The change is transparent and the machine’s protection history is preserved.
AWS/GCP machines | For these machines, you configure automatic provisioning when you set up the AWS or GCP connector.
Manual installation | If you don't want Defender for Cloud to provision the Log Analytics agent/Azure Monitor agent, you can install agents manually.<br/><br/> You can connect the agent to the default Defender for Cloud workspace, or to a custom workspace.<br/><br/> The workspace must have the *SecurityCenterFree* (providing free foundational CSPM) or *Security* solution enabled (Defender for Servers Plan 2).
[Log Analytics agent running directly](faq-data-collection-agents.yml#what-if-a-log-analytics-agent-is-directly-installed-on-the-machine-but-not-as-an-extension--direct-agent--) | If a Windows VM has the Log Analytics agent running, but not as a VM extension, Defender for Cloud will install the extension. The agent will report to the Defender for Cloud workspace in addition to the existing agent workspace. <br/><br/> On Linux VMs, multi-homing isn't supported, and if an existing agent is detected then the agent won't be automatically provisioned.
[Operations Manager agent](faq-data-collection-agents.yml#what-if-a-system-center-operations-manager-agent-is-already-installed-on-my-vm-) | The Log Analytics agent can work side-by-side with the Operations Manager agent. The agents share common runtime libraries which will be updated when the Log Analytics agent is deployed.
Removing the Log Analytics extension | If you remove the Log Analytics extension, Defender for Cloud won't be able to collect security data and recommendations/alerts will be missing. Within 24 hours, Defender for Cloud will determine that the extension is missing and reinstalls it.

## When shouldn't I use auto provisioning?

You might want to opt out of automatic provisioning in the following circumstances.

Situation | Relevant agent | Details
--- | --- | ---
You have critical VMs that shouldn't have agents installed. | Log Analytics agent, Azure Monitor agent. | Automatic provisioning is for an entire subscription. You can't opt out for specific machines.
If you're running the System Center Operations Manager agent version 2012 with Operations Manager 2012  | Log Analytics agent | With this configuration, don't turn on automatic provisioning, otherwise management capabilities might be lost.
You want to configure a custom workspace | Log Analytics agent, Azure Monitor agent | You have two options with a custom workspace:<br/><br/> - Opt out of automatic provisioning when you first set up Defender for Cloud. Then, configure provisioning on your custom workspace.<br/><br/>- Let automatic provisioning run to install the Log Analytic agents on machines. Set a custom workspace, and then when asked, reconfigure existing VMs with the new workspace setting.

## Next steps

After working through these planning steps, you can start deployment:

- [Enable Defender for Servers](enable-enhanced-security.md) plans
- [Connect on-premises machines](quickstart-onboard-machines.md) to Azure.
- [Connect AWS accounts](quickstart-onboard-aws.md) to Defender for Cloud.
- [Connect GCP projects](quickstart-onboard-gcp.md) to Defender for Cloud.
- Learn about [scaling your Defender for Server deployment](plan-defender-for-servers-scale.md).
