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

In addition to plan features, Defender for Servers leverages Defender for Cloud's  free [foundational cloud security posture management (CSPM)](concept-cloud-security-posture-management#defender-cspm-plan-options) capabilities, to continually, assess, score, and remediate your security posture.

### Plan features

| Feature | Details | Plan 1 | Plan 2 |
|:---|:---|:---:|:---:|
| **Defender for Endpoint integration** | Defender for Servers integrates with Defender for Endpoint Plan 2 and protects servers with all the Plan 2 features, including:<br/><br/>- [Attack surface reduction](/microsoft-365/security/defender-endpoint/overview-attack-surface-reduction) to lower the risk of attack.<br/>- [Next-generation protection](/microsoft-365/security/defender-endpoint/next-generation-protection?view=o365-worldwide), including real-time scanning/protection and [Microsoft Defender Antivirus](/microsoft-365/security/defender-endpoint/next-generation-protection).<br> - EDR including [threat analytics](/microsoft-365/security/defender-endpoint/threat-analytics), [automated investigation and response](/microsoft-365/security/defender-endpoint/automated-investigations), [advanced hunting](/microsoft-365/security/defender-endpoint/advanced-hunting-overview), and [Microsoft Defender Experts](/microsoft-365/security/defender-endpoint/microsoft-threat-experts).<br/>- Vulnerability assessment/mitigation with Defender for Endpoint's integration with [Microsoft Defender Vulnerability Management](/microsoft-365/security/defender-vulnerability-management/defender-vulnerability-management-capabilities?view=o365-worldwide) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Licensing** | Defender for Server charges Defender for Endpoint licenses per hour instead of per seat, lowering costs by protecting virtual machines only when they're in use.| :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Defender for Endpoint provisioning** | Defender for Servers automatically provisions the Defender for Endpoint sensor on every supported machine that's connected to Defender for Cloud.| :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | 
| **Unified view** | Defender for Endpoint alerts display in the Defender for Cloud portal. You can drill down into the Defender for Endpoint portal for more information.| :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Qualys vulnerability assessment** | In addition to vulnerability management provided by Defender for Endpoint, Defender for Cloud integrates with the Qualys scanner to identify vulnerabilities in real-time. You don't need a Qualys license or account. [Learn more](deploy-vulnerability-assessment-vm.md). | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
**Adaptive application controls (AAC)** | [AACs](adaptive-application-controls.md) in Defender for Cloud define allowlists of known safe applications for machines. Defender for Cloud must be enabled on a subscription to use this feature. | |:::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Log Analytics 500 MB free data ingestion** | Defender for Cloud leverages Azure Monitor to collect data from Azure VMs and servers, using the Log Analytics agent. | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Just-in-time VM access** | Defender for Cloud provides [JIT access](just-in-time-access-overview.md), locking down machine ports to reduce the machine's attack surface. Defender for Cloud must be enabled on a subscription to use this feature. | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Adaptive network hardening** | Filtering traffic to and from resources with network security groups (NSG) improves your network security posture. You can further improve security by [hardening the NSG rules](adaptive-network-hardening.md) based on actual traffic patterns. Defender for Cloud must be enabled on a subscription to use this feature. | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **File Integrity Monitoring (FIM)** | [FIM](file-integrity-monitoring-overview.md) (change monitoring) examines files and registries for changes that might indicate an attack. A comparison method is used to determine whether suspicious modifications have been made to files. | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Docker host hardening** | Defender for Cloud assesses containers hosted on Linux machines running Docker containers, and compares them with the Center for Internet Security (CIS) Docker Benchmark. [Learn more](harden-docker-hosts.md). | | :::image type="icon" source="./media/icons/yes-icon.png"::: |


## Verify operating system support

Before deployment, verify that your [operating systems are supported](/microsoft-365/security/defender-endpoint/minimum-requirements) by Defender for Endpoint.


## Understand data residency requirements

Data residency (the physical or geographic location of an organization’s data) considerations are often top of mind due to compliance requirements. For example, the European Union’s General Data Protection Regulation (GDPR) requires that all data collected on citizens be stored in the EU so that it's subject to European privacy laws.

1. Before you begin your Defender for Servers deployment, learn more about [general Azure data residency considerations](https://azure.microsoft.com/blog/making-your-data-residency-choices-easier-with-azure/).
1. Note how Defender for Cloud stores alerts and security recommendations for servers as you plan your Defender for Servers deployment:
    - For data stored in the Defender for Cloud's backend storage:
        - For Azure VMs, and Azure Arc VMs (used for on-premises servers), the data is stored in the region in which the server machine is located.
Anything in the EU is stored in the EU region. Anything else is stored in the US region.
- For AWS and GCP machines, Defender for Cloud looks at the region in which the data is stored in the AWS/GCP cloud and matches that. 

When you create connectors to protect multicloud resources, the connector resource is hosted in an Azure resource group that you choose when you set up the connector. Select this resource group in accordance with your data residency requirements.
When data is retrieved from AWS/GCP, it’s stored in either GDPR-EU, or US:


## Plan Log Analytics integration

Defender for Servers uses 


 you enable Defender for Servers, Defender for Cloud leverages Azure Monitor Log Analytics.
Data collection agents (Log Analytics Agent or Azure Monitor Agent) collect security information from VMs, and stored the data in a Log Analytics workspace. When you enable auto-provisioning for agents, you can specify that you want to use the default workspace created by Defender for Cloud, or a custom workspace.

### Planning Log Analytics workspaces

Defender for Servers uses the Log Analytics agent or Azure Monitoring agent to collect operating system telemetry, security configuration, and event logs from protected servers, and for agent-based features in Defender for Servers Plan 2, including File Integrity monitoring, Adaptive Application controls, and operating system attack detections outside of Defender for Endpoint.

When you enable auto-provisioning of the agent , you specify the Log Analytics workspace you want to use:

- **Default workspace**:
    - If you use the default workspace, Defender for Cloud creates a new resource group and default workspace, placed in the same location as the VMs.
    - If you have VMs in multiple locations, Defender for Cloud creates multiple workspaces to ensure data compliance. 
    - On the default workspace, Defender for Cloud automatically turns on security posture management, and Defender for Servers (if it's enabled on the subscription).
    - Default workspace naming is in the format: [subscription-id]-[geo].
- **Custom workspace**: 
    - If you want to use a custom workspace, it must be associated with the Azure subscription on which you're enabling Defender for Cloud.
    - You need at minimum read permissions for the workspace.
    - You need to manually enable Defender for Cloud, and turn on Defender for Server on the custom workspace. 
    - Learn more about [design strategy and criteria](https://learn.microsoft.com/azure/azure-monitor/logs/workspace-design) for workspaces.

### Default workspace locations

If you use the default option, workspaces are created in accordance with the server location.

**VM location** | **Workspace location**
--- | ---
United States, Canada, Europe, UK, Korea, India, Japan, China, Australia | The workspace is created in the matching location.
Brazil | United States
East Asia, Southeast Asia | Asia

 

## Plan agent provisioning

When you enable Defender for Servers Plan 1 or Plan 2 and then enable Defender for Endpoint unified integration, the Defender for Endpoint agent is automatically provisioned on all supported machines in the subscription.

- Azure Windows machines: Defender for Cloud deploys the MDE.Windows extension. The extension provisions Defender for Endpoint and connects it to the Defender for Endpoint backend.
- Azure Linux machines: Defender for Cloud collects audit records from Linux machines by using auditd, one of the most common Linux auditing frameworks. For a list of the Linux alerts, see the [Reference table of alerts](alerts-reference.md#alerts-linux).
- On-premises: Defender for Cloud integrates with [Azure Arc](../azure-arc/index.yml) using the Azure Connected Machine agent. Learn how to [connect your on-premises machines](quickstart-onboard-machines.md) to Microsoft Defender for Cloud.
- Multicloud: Defender for Cloud uses [Azure Arc](../azure-arc/index.yml) to ensure these non-Azure machines are seen as Azure resources. Learn how to [connect your AWS accounts](quickstart-onboard-aws.md) and your [GCP accounts](quickstart-onboard-gcp.md) to Microsoft Defender for Cloud.

> [!TIP]
> For details of which Defender for Servers features are relevant for machines running on other cloud environments, see [Supported features for virtual machines and servers](supported-machines-endpoint-solutions-clouds-servers.md?tabs=features-windows#supported-features-for-virtual-machines-and-servers).


## Agents and workspaces

Agents and extensions are used in the Defender for Servers plan as follows.


You can connect on-premises machines and AWS/GCP VMs to Azure by leveraging the Azure Arc service, allowing you to take advantage of Azure cloud services and benefits.




 **Agent** | **Function** | **Details**
--- | --- | ---
 **Azure Arc: Azure Connected Machine Agent** | For Defender for Servers to protect AWS. GCP, and on-premises servers, these servers must be deployed in Azure with [Azure Arc](../azure-arc/overview.md). Azure Arc installs the [Azure Connected Machine agent](../azure-arc/servers/agent-overview.md) as part of the deployment.<br/><br/> After the agent is installed the machine is seen as an Azure VM resources.<br/><br/> Machines should be located in a subscription that has Defender for Servers enabled. | Learn more about [onboarding requirements](../azure-arc/servers/prerequisites) and [agent details](../azure-arc/servers/security-overview.md#agent-security-and-permissions).
**Defender for Endpoint extension**<br/><br/> MDE.Windows, MDE.Linux | Install the Defender for Endpoint sensor on machines, and connect them to Defender for Endpoint. | After a machine is onboarded to Azure ARC, when you enable Defender for Servers, Defender for Cloud automatically deploys the Defender for Endpoint extension on Windows and Linux machines.<br/><br/>  Devices must meet [minimum requirements](/microsoft-365/security/defender-endpoint/minimum-requirements). There are some [specific requirements](/microsoft-365/security/defender-endpoint/configure-server-endpoints) for some Windows Server versions.
**Log Analytics agent/Azure Monitor agent** | The agent collects operating system telemetry, security configuration, and event logs from protected servers.<br/><br/> The agent also enables agent-based features in Defender for Servers Plan 2, including File Integrity monitoring, Adaptive Application controls, and operating system attack detections outside of Defender for Endpoint. | The agent can be automatically provisioned on servers.<br/><br/> Data collected by the agent is stored in the Log Analytics workspace. You select the workspace (either default or customer) when you set up automatic provisioning of the agent.



Note the following:

- Defender for Endpoint extensions:
    - If machines are running Microsoft Antimalware, also known as System Center Endpoint Protection (SCEP), the Windows extension automatically removes it from the machine.
    - If you deploy on a machine that already has the Defender for Endpoint sensor running, after successful installing the sensor from Defender for Server, the extension will stop and disable the legacy sensor. The change is transparent and the machine’s protection history is preserved.
- Log Analytics agent/Azure Monitor agent:
    - If a VM already has the agent installed as an Azure extension, Defender for Cloud doesn't override the existing workspace connection, and uses the existing workspace. 






If you select to continuously export data, you can drill into and configure the types of events and alerts that are saved. Learn more.
Log Analytics workspace:

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

## Scoping Defender for Servers deployment

- Defender for Servers Plan 1 must be enabled at the subscription level.
- Defender for Servers Plan 2 can be enabled at the subscription level, or turned on for a specific Log Analytics workspace.
    - At the workspace level, any machine connected to the workspace will incur a charge when Defender for Servers Plan 2 is enabled.






## Next steps

In this article, you have been provided an introduction to begin your path to designing a multicloud security solution. Continue with the next step to [determine business needs](plan-multicloud-security-determine-business-needs.md).
- [Enable Defender for Servers on your subscriptions](enable-enhanced-security.md).
