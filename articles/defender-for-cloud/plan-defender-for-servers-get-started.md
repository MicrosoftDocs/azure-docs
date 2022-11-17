---
title: Plan your Defender for Servers deployment
description: Design your Defender for Servers deployment
ms.topic: conceptual
ms.date: 11/06/2022
---
# Plan Defender for Servers deployment

This guide helps you to design and plan an effective Microsoft Defender for Servers deployment.

Defender for Servers protects your Windows and Linux machines in the cloud and on-premises. Defender for Servers is one of the paid plans provided by [Microsoft Defender for Cloud](defender-for-cloud-introduction.md). 

## About this guide

This planning guide can be used by cloud solution and infrastructure architects, security architects and analysts, and anyone else involved in protecting cloud/hybrid servers and workloads. The guide aims to answer these questions:

- What can Defender for Servers do for my organization?
- Which Defender for Servers plan is right for me?
- Where is my data stored?
- What agents must be deployed?
- What permissions are needed?
- How do I deploy at scale?

## Before you begin

- You should have a basic understanding of [Defender for Cloud](defender-for-cloud-introduction.md), and the servers you want to protect. For a quick video, watch a [Defender for Servers introduction](episode-five.md) in our Defender for Cloud in the Field series.
- Get pricing details for [Defender for Servers](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

## Overview

Defender for Servers provides server protection.

- Defender for Servers protects servers in Azure, AWS, and GCP clouds, and on-premises.
- Defender for Servers integrates with Microsoft Defender for Endpoint's [endpoint detection and response (EDR) capabilities](/microsoft-365/security/defender-endpoint/overview-endpoint-detection-response), to provide extended detection and response (XDR) for multicloud servers.
- In addition to the EDR features provided by the Defender for Endpoint integration, Defender for Server add cloud security controls to protect servers, apps, and networks.

## Select a Defender for Servers plan

Defender for Servers provides two plans you can choose from.

- **Defender for Servers Plan 1** is entry-level and provides:
    -  Defender for Cloud's free [foundational cloud security posture management](concept-cloud-security-posture-management.md#defender-cspm-plan-options).
    - EDR features provided by [Microsoft Defender for Endpoint Plan 2](/microsoft-365/security/defender-endpoint/defender-endpoint-plan-1-2)
- **Defender for Servers Plan 2** provides:
    - All the functionality included in Defender for Servers Plan 1.
    - Additional XDR capabilities.

In addition to features provided in plans, Defender for Servers leverages Defender for Cloud's free [foundational cloud security posture management (CSPM) capabilities](concept-cloud-security-posture-management.md#defender-cspm-plan-options), to continually, assess, score,remediate, and harden your security posture.

### Plan features

| Feature | Details | Plan 1 | Plan 2 |
|:---|:---|:---:|:---:|
| **Defender for Endpoint integration** | Defender for Servers integrates with Defender for Endpoint Plan 2 and protects servers with all the Plan 2 features, including:<br/>- [Attack surface reduction](/microsoft-365/security/defender-endpoint/overview-attack-surface-reduction) to lower the risk of attack.<br/>- [Next-generation protection](/microsoft-365/security/defender-endpoint/next-generation-protection), including real-time scanning/protection and [Microsoft Defender Antivirus](/microsoft-365/security/defender-endpoint/next-generation-protection).<br> - EDR including [threat analytics](/microsoft-365/security/defender-endpoint/threat-analytics), [automated investigation and response](/microsoft-365/security/defender-endpoint/automated-investigations), [advanced hunting](/microsoft-365/security/defender-endpoint/advanced-hunting-overview), and [Microsoft Defender Experts](/microsoft-365/security/defender-endpoint/microsoft-threat-experts).<br/>- Vulnerability assessment/mitigation, provided by Defender for Endpoint's integration with [Microsoft Defender Vulnerability Management](/microsoft-365/security/defender-vulnerability-management/defender-vulnerability-management-capabilities?view=o365-worldwide) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Licensing** | Defender for Server charges Defender for Endpoint licenses per hour instead of per seat, lowering costs by protecting virtual machines only when they're in use.| :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Defender for Endpoint provisioning** | Defender for Servers automatically provisions the Defender for Endpoint sensor on every supported machine that's connected to Defender for Cloud.| :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | 
| **Unified view** | Defender for Endpoint alerts display in the Defender for Cloud portal. You can drill down into the Defender for Endpoint portal for more information.| :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Qualys vulnerability assessment** | In addition to vulnerability management provided by Defender for Endpoint, Defender for Cloud integrates with the Qualys scanner to [identify vulnerabilities in real-time]deploy-vulnerability-assessment-vm.md). You don't need a Qualys license or account. | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
**Adaptive application controls (AAC)** | [AACs](adaptive-application-controls.md) define allowlists of known safe applications for machines. Defender for Cloud must be enabled on a subscription to use this feature. | |:::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Free data ingestion (500 MB) in Log Analytics** | Defender for Cloud leverages Azure Monitor to collect data from Azure VMs and servers, using the Log Analytics agent. | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Just-in-time (JIT) VM access** | [JIT access](just-in-time-access-overview.md) locks down machine ports to reduce the attack surface on Azure VMs/AWS Azure-Arc VMs. Defender for Cloud must be enabled on a subscription to use this feature. | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Adaptive network hardening** | Network hardening filters traffic to and from resources with network security groups (NSG) to improve your network security posture. Further improve security by [hardening the NSG rules](adaptive-network-hardening.md) based on actual traffic patterns. Defender for Cloud must be enabled on a subscription to use this feature. | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **File Integrity Monitoring (FIM)** | [FIM](file-integrity-monitoring-overview.md) examines files and registries for changes that might indicate an attack. A comparison method is used to determine whether suspicious modifications have been made to files. | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Threat detection at the OS level and network layer (including fileless attack detection)** | Detailed security alerts are issued as threats are detected. | :::image type="icon" source="./media/icons/yes-icon.png"::: <br/>Provided by Defender for Endpoint | :::image type="icon" source="./media/icons/yes-icon.png":::<br/> Provided by Defender for Endpoint/Defender for Server |
| **Docker host hardening** | Assess containers hosted on Linux machines running Docker containers, and compares them with the Center for Internet Security (CIS) Docker Benchmark. [Learn more](harden-docker-hosts.md). | | :::image type="icon" source="./media/icons/yes-icon.png"::: 
[Network map](protect-network-resources.md) | Provides a geographical view of recommendations for hardening your network resources. | | :::image type="icon" source="./media/icons/yes-icon.png":::
[Agentless scanning](concept-agentless-data-collection.md) | Scans Azure VMs, using cloud APIs to collect data | | :::image type="icon" source="./media/icons/yes-icon.png":::




## Verify operating system support

Before deployment, verify that your [operating systems are supported](/microsoft-365/security/defender-endpoint/minimum-requirements) by Defender for Endpoint.


## Understand data residency requirements

Data residency is the physical or geographic location of an organization’s data, and often requires planning due to compliance requirements.

1. Before you deploy Defender for Servers, review [general Azure data residency considerations](https://azure.microsoft.com/blog/making-your-data-residency-choices-easier-with-azure/).
1. Ensure you understand where alerts and security recommendations for servers will be stored:
    - For data stored in the Defender for Cloud's backend storage:
        - For Azure VMs, and Azure Arc VMs (used for on-premises servers), the data is stored in the region in which the server machine is located.
    - For data Anything in the EU is stored in the EU region. Anything else is stored in the US region.
    - For AWS and GCP machines, Defender for Cloud looks at the region in which the data is stored in the AWS/G cloud and matches that. 


## Plan Log Analytics workspaces

Defender for Servers uses the Log Analytics agent or Azure Monitoring agent to collect operating system telemetry, security configuration, and event logs from protected servers, and for agent-based features in Defender for Servers Plan 2, including File Integrity monitoring, Adaptive Application controls, and operating system attack detections outside of Defender for Endpoint.

When you enable auto-provisioning of the agent , you specify the Log Analytics workspace you want to use:

- **Default workspace**:
    - If you use the default option, Defender for Cloud creates a new resource group and the default workspace.
    - If you have VMs in multiple locations, Defender for Cloud creates multiple workspaces to ensure data compliance. 
    - The default workspace location depends on your Azure region.
    - On the default workspace, Defender for Cloud automatically turns on basic cloud security posture management (CSPM), and Defender for Servers (if it's enabled on the subscription).
    - Default workspace naming is in the format: [subscription-id]-[geo].
- **Custom workspace**: 
    - If you want to use a custom workspace, it must be associated with the Azure subscription on which you're enabling Defender for Cloud.
    - You need at minimum read permissions for the workspace.
    - You need to manually enable Defender for Cloud, and turn on Defenderfor Server on the custom workspace. 
    - Learn more about [design strategy and criteria](../azure-monitor/logs/workspace-design.md) for workspaces.

### Default location workspace

**Server location** | **Workspace location**
--- | ---
United States, Canada, Europe, UK, Korea, India, Japan, China, Australia | The workspace is created in the matching location.
Brazil | United States
East Asia, Southeast Asia | Asia


## Plan agent provisioning

Here are the agents used in a Defender for Servers deployment.

### Azure Arc: Azure Connected Machine Agent

For Defender for Servers to protect AWS. GCP, and on-premises servers, these servers must be deployed in Azure with [Azure Arc](../azure-arc/overview.md).

- Azure Arc installs the [Azure Connected Machine agent](../azure-arc/servers/agent-overview.md) as part of its deployment process.
- After the agent is installed the machine is seen as an Azure VM resource.
- After deployment, machines should be located in a subscription that has Defender for Servers enabled.

Learn more about [onboarding requirements](../azure-arc/servers/prerequisites.md) for Azure Arc, and the [agent](../azure-arc/servers/security-overview.md#agent-security-and-permissions).

### Defender for Endpoint extensions

When you enable Defender for Servers, Defender for Cloud automatically deploys a Defender for Endpoint extension on Windows and Linux machines:

- Windows machines extension: MDE.Windows
- Linux machines extension: MDE.Linux
- Machines must meet [minimum requirements](/microsoft-365/security/defender-endpoint/minimum-requirements). There are some [specific requirements](/microsoft-365/security/defender-endpoint/configure-server-endpoints) for some Windows Server versions.

### Log Analytics agent/Azure Monitor agent

Defender for Cloud uses the Log Analytics agent/Azure Monitor agent to collect information from compute resources. It's used in Defender for Server as follows.

Feature |  Plan 1 | Plan 2 | Details
--- | --- | --- | ---
Fundamental CSPM capabilities:<br/><br/> - [Endpoint protection recommendations] (endpoint-protection-recommendations-technical.md)<br/> - [System updates recommendations](recommendations-reference.md#compute-recommendations)<br/> - [Operating system baseline recommendations](apply-security-baseline.md)  | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | If you're only using fundamental CSPM capabilities, without a plan, these features are available for Azure VMs only.<br/><br/> If you're using the Log Analytics agent, these capabilities rely on the agent.<br/><br/> The Azure Monitor Agent is used for endpoint protection recommendations. System updates use the built-in Azure policy definition or Azure Arc agent. OS baselines recommendation use the Azure Policy [guest configuration extension](../virtual-machines/extensions/guest-configuration.md)
[Adaptive application controls](adaptive-application-controls.md) | | :::image type="icon" source="./media/icons/yes-icon.png":::
Threat detection at the OS level and network layer (including fileless attack detection)** | :::image type="icon" source="./media/icons/yes-icon.png":::<br/> Provided by Defender for Endpoint | :::image type="icon" source="./media/icons/yes-icon.png":::<br/> Provided by Defender for Endpoint/Defender for Server capabilities.

A few things to note:
- Qualys vulnerability assessment has its own extension. It can be automatically be deployed by Defender for Cloud to all Azure VMs and non-Azure machines connected via Azure Arc. 
- The Azure Policy Guest Configuration extension performs audit and configuration operations inside VMs. Defender for Cloud leverages this component to analyze operating system security baseline settings on Windows and Linux machines. While Azure Arc-enabled servers and the guest configuration extension are free, additional costs might apply when using guest configuration policies outside Defender for Cloud scope.

## Agent provisioning

When you enable Defender for Servers Plan 1 or Plan 2 and then enable Defender for Endpoint unified integration, the Defender for Endpoint agent is automatically provisioned on all supported machines in the subscription.

- The agent is supported on Azure VMs/Azure Arc-enabled VMs. Data collected by the agent is stored in the Log Analytics workspace.
- You select the workspace (either default or customer) when you set up automatic provisioning of the agent. [Learn more](#plan-log-analytics-workspaces) about setting up a workspace.
- 
- ## Scoping Defender for Servers deployment

- Defender for Servers Plan 1 must be enabled at the subscription level.
- Defender for Servers Plan 2 can be enabled at the subscription level, or turned on for a specific Log Analytics workspace.
    - At the workspace level, any machine connected to the workspace will incur a charge when Defender for Servers Plan 2 is enabled.






- On-premises: Defender for Cloud integrates with [Azure Arc](../azure-arc/index.yml) using the Azure Connected Machine agent. Learn how to [connect your on-premises machines](quickstart-onboard-machines.md) to Microsoft Defender for Cloud.
- Multicloud: Defender for Cloud uses [Azure Arc](../azure-arc/index.yml) to ensure these non-Azure machines are seen as Azure resources. Learn how to [connect your AWS accounts](quickstart-onboard-aws.md) and your [GCP accounts](quickstart-onboard-gcp.md) to Microsoft Defender for Cloud.

> [!TIP]
> For details of which Defender for Servers features are relevant for machines running on other cloud environments, see [Supported features for virtual machines and servers](supported-machines-endpoint-solutions-clouds-servers.md?tabs=features-windows#supported-features-for-virtual-machines-and-servers).

A few points to note:

- Defender for Endpoint extensions:
    - If machines are running Microsoft Antimalware, also known as System Center Endpoint Protection (SCEP), the Windows extension automatically removes it from the machine.
    - If you deploy on a machine that already has the Defender for Endpoint sensor running, after successful installing the sensor from Defender for Server, the extension will stop and disable the legacy sensor. The change is transparent and the machine’s protection history is preserved.
- Log Analytics agent/Azure Monitor agent:
    - If a VM already has the agent installed as an Azure extension, Defender for Cloud doesn't override the existing workspace connection, and uses the existing workspace. 

## Determine access and ownership

In complex enterprises, different teams manage different [security functions](/cloud-adoption-framework/organize/cloud-security). 

- **Team access**: Figuring out ownership for server and endpoint security and protection is critical. Ownership that's undefined, or hidden within organization silos typically causes friction that can lead to delays, insecure deployments, and difficulties in identifying, analyzing, and following threats across the enterprise. -     - Security leadership should pinpoint who which teams, roles, and individuals are responsible for making server security decisions.
    - Typically, a [central IT team](/cloud-adoption-framework/organize/central-it) and a [cloud infrastructure and endpoint security team](/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint) share responsibility.
    - Team members will need Azure access rights to manage and use Defender for Cloud.


















If you select to continuously export data, you can drill into and configure the types of events and alerts that are saved. Learn more.
Log Analytics workspace:

There are several reasons to select the default workspace rather than the custom workspace.
The location of the default workspace depends on your Azure Arc machine region. Learn more.
The location of the custom-created workspace is set by your organization. Learn more about using a custom workspace.


## Next steps

In this article, you have been provided an introduction to begin your path to designing a multicloud security solution. Continue with the next step to [determine business needs](plan-multicloud-security-determine-business-needs.md).
- [Enable Defender for Servers on your subscriptions](enable-enhanced-security.md).
