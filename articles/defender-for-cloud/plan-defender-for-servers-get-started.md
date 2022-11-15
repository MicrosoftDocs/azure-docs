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

Defender for Servers 

Defender for Servers provides asset-level server protection.

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

In addition to plan features, Defender for Servers leverages Defender for Cloud's  free[foundational cloud security posture management (CSPM)] (concept-cloud-security-posture-management#defender-cspm-plan-options) capabilities, to continually, assess, score, and remediate your security posture.

### Plan features

| Feature | Details | Plan 1 | Plan 2 |
|:---|:---|:---:|:---:|
| **Defender for Endpoint integration** | Defender for Servers integrates with Defender for Endpoint Plan 2 and protects servers with all the Plan 2 features, including:<br/><br/>- [Attack surface reduction](/microsoft-365/security/defender-endpoint/overview-attack-surface-reduction) to lower the risk of attack.<br/>- [Next-generation protection](/microsoft-365/security/defender-endpoint/next-generation-protection?view=o365-worldwide), including real-time scanning/protection and [Microsoft Defender Antivirus](/microsoft-365/security/defender-endpoint/next-generation-protection).<br> - EDR including [threat analytics](/microsoft-365/security/defender-endpoint/threat-analytics), [automated investigation and response](/microsoft-365/security/defender-endpoint/automated-investigations), [advanced hunting](/microsoft-365/security/defender-endpoint/advanced-hunting-overview), and [Microsoft Defender Experts](/microsoft-365/security/defender-endpoint/microsoft-threat-experts).<br/>- Vulnerability assessment/mitigation with [Microsoft Defender Vulnerability Management](/microsoft-365/security/defender-vulnerability-management/defender-vulnerability-management-capabilities?view=o365-worldwide) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Licensing** | Defender for Server charges Defender for Endpoint licenses per hour instead of per seat, lowering costs by protecting virtual machines only when they're in use.| :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Defender for Endpoint provisioning** | Defender for Servers automatically provisions the Defender for Endpoint sensor on every supported machine that's connected to Defender for Cloud.| :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | 
| **Unified view** | Defender for Endpoint alerts display in the Defender for Cloud portal. You can drill down into the Defender for Endpoint portal for more information.| :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Integrated vulnerability assessment** | In addition to vulnerability management provided by Defender for Endpoint, you can use the Qualys scanner to identify vulnerabilities in real-time. It's integrated with Defender for Cloud, you don't need a Qualys license or account. [Learn more](deploy-vulnerability-assessment-vm.md). | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
**Adaptive application controls (AAC)** | [AACs](adaptive-application-controls.md) in Defender for Cloud define allowlists of known safe applications for machines. Defender for Cloud must be enabled on a subscription to use this feature. | |:::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Log Analytics 500 MB free data ingestion** | Defender for Cloud leverages Azure Monitor to collect data from Azure VMs and servers, using the Log Analytics agent. | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Just-in-time VM access** | Defender for Cloud provides [JIT access](just-in-time-access-overview.md), locking down machine ports to reduce the machine's attack surface. Defender for Cloud must be enabled on a subscription to use this feature. | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Adaptive network hardening** | Filtering traffic to and from resources with network security groups (NSG) improves your network security posture. You can further improve security by [hardening the NSG rules](adaptive-network-hardening.md) based on actual traffic patterns. Defender for Cloud must be enabled on a subscription to use this feature. | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **File Integrity Monitoring (FIM)** | [FIM](file-integrity-monitoring-overview.md) (change monitoring) examines files and registries for changes that might indicate an attack. A comparison method is used to determine whether suspicious modifications have been made to files. | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Docker host hardening** | Defender for Cloud assesses containers hosted on Linux machines running Docker containers, and compares them with the Center for Internet Security (CIS) Docker Benchmark. [Learn more](harden-docker-hosts.md). | | :::image type="icon" source="./media/icons/yes-icon.png"::: |



> [!NOTE]
> If you only enable Defender for Cloud at the workspace level, Defender for Cloud won't enable just-in-time VM access, adaptive application controls, and network detections for Azure resources.

Want to learn more? Watch an overview of enhanced workload protection features in Defender for Servers in our [Defender for Cloud in the Field](episode-twelve.md) series.

## Verify operating system support

Before deployment, verify that your [operating systems are supported](/microsoft-365/security/defender-endpoint/minimum-requirements) by Defender for Endpoint.


## Consider data residency requirements

When designing business solutions, data residency (the physical or geographic location of an organization’s data) is often top of mind due to compliance requirements. For example, the European Union’s General Data Protection Regulation (GDPR) requires all data collected on citizens to be stored in the EU, for it to be subject to European privacy laws. Before you begin your Defender for Servers deployment, learn more about [general Azure data residency considerations](https://azure.microsoft.com/blog/making-your-data-residency-choices-easier-with-azure/).

Note the following for your Defender for Servers deployment:

- Security alerts and recommendations for servers are stored in the Defender for Cloud backend, as follows:
- For Azure VMs, and Azure Arc VMs used for on-premises server protection, the data is stored in the region in which the server machine is located.
Anything in the EU is stored in the EU region. Anything else is stored in the US region.
- For AWS and GCP machines, Defender for Cloud looks at the region in which the data is stored in the AWS/GCP cloud and matches that. 

When you create connectors to protect multicloud resources, the connector resource is hosted in an Azure resource group that you choose when you set up the connector. Select this resource group in accordance with your data residency requirements.
When data is retrieved from AWS/GCP, it’s stored in either GDPR-EU, or US:


## Plan Log Analytics integration

When you enable Defender for Servers or Defender for Containers, Defender for Cloud leverages Azure Monitor Log Analytics.
Data collection agents (Log Analytics Agent or Azure Monitor Agent) collect security information from VMs, and stored the data in a Log Analytics workspace. When you enable auto-provisioning for agents, you can specify that you want to use the default workspace created by Defender for Cloud, or a custom workspace.

- **Custom workspace**: 
    - A custom workspace must be associated with the Azure subscription on which you're enabling Defender for Cloud.
    - You need at minimum read permissions for the workspace.
    - You need to manually enable Defender for Cloud's security posture management feature, and the Defender for Server plan on the custom workspace. 
- **Default workspace**:
    - If you use the default workspace, Defender for Cloud creates a new resource group and default workspace, placed in the same location as the VMs.
    - If you have VMs in multiple locations, Defender for Cloud creates multiple workspaces to ensure data compliance. 
    - On the default workspace, Defender for Cloud automatically turns on security posture management, and Defender for Servers (if it's enabled on the subscription).
    - Default workspace naming is in the format: [subscription-id]-[geo].

**VM location** | **Workspace location**
--- | ---
United States, Canada, Europe, UK, Korea, India, Japan, China, Australia | The workspace is created in the matching location.
Brazil | United States
East Asia, Southeast Asia | Asia

### Design your Log Analytics deployment

There are a number of considerations around designing and deploying multiple Log Analytics workspaces. Learn more about [design strategy and criteria](https://learn.microsoft.com/azure/azure-monitor/logs/workspace-design). 

## Plan agent provisioning

When you enable Defender for Servers Plan 1 or Plan 2 and then enable Defender for Endpoint unified integration, the Defender for Endpoint agent is automatically provisioned on all supported machines in the subscription.

- Azure Windows machines: Defender for Cloud deploys the MDE.Windows extension. The extension provisions Defender for Endpoint and connects it to the Defender for Endpoint backend.
- Azure Linux machines: Defender for Cloud collects audit records from Linux machines by using auditd, one of the most common Linux auditing frameworks. For a list of the Linux alerts, see the [Reference table of alerts](alerts-reference.md#alerts-linux).
- On-premises: Defender for Cloud integrates with [Azure Arc](../azure-arc/index.yml) using the Azure Connected Machine agent. Learn how to [connect your on-premises machines](quickstart-onboard-machines.md) to Microsoft Defender for Cloud.
- Multicloud: Defender for Cloud uses [Azure Arc](../azure-arc/index.yml) to ensure these non-Azure machines are seen as Azure resources. Learn how to [connect your AWS accounts](quickstart-onboard-aws.md) and your [GCP accounts](quickstart-onboard-gcp.md) to Microsoft Defender for Cloud.

> [!TIP]
> For details of which Defender for Servers features are relevant for machines running on other cloud environments, see [Supported features for virtual machines and servers](supported-machines-endpoint-solutions-clouds-servers.md?tabs=features-windows#supported-features-for-virtual-machines-and-servers).


## Agent provisioning

Agents used in the Defender for Servers plan as follows.

## Provisioning agents (on-premises machines/non-Azure VMs)

You can connect on-premises machines and AWS/GCP VMs to Azure by leveraging the Azure Arc service, allowing you to take advantage of Azure cloud services and benefits.

Azure Connected Machine agent


 **Agent** | **Details**
--- | --- | ---
 | Azure Arc installs the Azure Connected Machine agent on physical servers and VMs outside Azure.<br/><br/> Machines must run a supported operating system and comply with other prerequisites for the agent. [Learn more](https://learn.microsoft.com/en-us/azure/azure-arc/servers/prerequisites).<br/><br/> If machines don't run a supported agent, you can install the Log Analytics agent directly on the machine.



Non-Azure public clouds connect to Azure by leveraging the Azure Arc service.
The Azure Connected Machine agent is installed on multicloud machines that onboard as Azure Arc machines. Defender for Cloud should be enabled in the subscription in which the Azure Arc machines are located.
Defender for Cloud leverages the Connected Machine agent to install extensions (such as Microsoft Defender for Endpoint) that are needed for Defender for Servers functionality.
Log analytics agent/Azure Monitor Agent (AMA) is needed for some Defender for Service Plan 2 functionality.
The agents can be provisioned automatically by Defender for Cloud.
When you enable auto-provisioning, you specify where to store collected data. Either in the default Log Analytics workspace created by Defender for Cloud, or in any other workspace in your subscription. Learn more.
If you select to continuously export data, you can drill into and configure the types of events and alerts that are saved. Learn more.
Log Analytics workspace:
You define the Log Analytics workspace you use at the subscription level. It can be either a default workspace, or a custom-created workspace.
There are several reasons to select the default workspace rather than the custom workspace.
The location of the default workspace depends on your Azure Arc machine region. Learn more.
The location of the custom-created workspace is set by your organization. Learn more about using a custom workspace.


## Determine access and ownership

In complex enterprises, different teams manage different [security functions](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/organize/cloud-security). 

- **Team access**: Figuring out ownership for server and endpoint security and protection is critical. Ownership that's undefined, or hidden within organization silos typically causes friction that can lead to delays, insecure deployments, and difficulties in identifying, analyzing, and following threats across the enterprise. -     - Security leadership should pinpoint who which teams, roles, and individuals are responsible for making server security decisions.
    - Typically, a [central IT team](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/organize/central-it) and a [cloud infrastructure and endpoint security team](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint) share responsibility.
    - Team members will need Azure access rights to manage and use Defender for Cloud.
- **Agent access**: For automatic provisioning of agents used by Defender for Server, the following permissions are required:
    - **Azure ARC agent (used for on-premises machines, AWS and GCP machines)**: Owner permissions on the subscription.
    - **Defender for Endpoint agent**: 
    - 
    - Deploying the Connected Machine agent on a machine requires that you have administrator permissions to install and configure the agent. On Linux this is done by using the root account, and on Windows, with an account that is a member of the Local Administrators group.
    - 
    - 
Agent | Action

## Next steps

In this article, you have been provided an introduction to begin your path to designing a multicloud security solution. Continue with the next step to [determine business needs](plan-multicloud-security-determine-business-needs.md).
- [Enable Defender for Servers on your subscriptions](enable-enhanced-security.md).
