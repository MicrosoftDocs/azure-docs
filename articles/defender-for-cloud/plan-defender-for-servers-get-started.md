---
title: Plan a Defender for Servers deployment to protect on-premises and multicloud servers
description: Design a solution to protect on-premises and multicloud servers with Defender for Servers 
ms.topic: conceptual
ms.date: 11/06/2022
---
# Plan Defender for Servers deployment

This guide helps you to design and plan an effective Microsoft Defender for Servers deployment to protect Windows and Linux machines in the cloud and on-premises. Defender for Servers is one of the paid plans provided by [Microsoft Defender for Cloud](defender-for-cloud-introduction.md).

## About this guide

This planning guide is aimed at cloud solution and infrastructure architects, security architects and analysts, and anyone else involved in protecting cloud/hybrid servers and workloads. The guide aims to answer these questions:

- What can Defender for Servers do?
- Where will my data be stored?
- Who needs access?
- Which Defender for Servers plan should I choose?
- What type of vulnerability assessment is available?
- What Log Analytics workspaces do I need?
- How do I protect AWS and GCP machines?
- What agents must be deployed?
- How do I scale a deployment?

## Before you begin

- Review pricing details for [Defender for Servers](https://azure.microsoft.com/pricing/details/defender-for-cloud/).
- If you're deploying for AWS/GCP machines, we suggest reviewing the [multicloud planning guide](plan-multicloud-security-get-started.md) before you start.

## Deployment overview

Here's a quick overview of the deployment process.

:::image type="content" source="media/defender-for-servers-introduction/deployment-overview.png" alt-text="Summary overview of the deployment steps for Defender for Servers.":::

- Get more information about [foundational cloud security posture management (CSPM)](concept-cloud-security-posture-management.md#defender-cspm-plan-options).
- Learn more about [Azure Arc](../azure-arc/index.yml) onboarding.


## Understand where data's stored

Data residency is the physical or geographic location of an organization’s data, and often requires planning due to compliance requirements.

1. Before you deploy Defender for Servers, review [general Azure data residency considerations](https://azure.microsoft.com/blog/making-your-data-residency-choices-easier-with-azure/).
1. Review the table below to understand where Defender for Cloud/Defender for Servers stores data.

### Storage locations

**Data** | **Location** 
--- | ---  
**Security alerts and recommendations** | Stored in the Defender for Cloud backend.<br/><br/> For example, if you create an Azure VM in West Europe region, all alert and recommendation information will also be stored in West Europe.
**Machine information** | Stored in a Log Analytics workspace.<br/><br/> Either the Defender for Cloud default workspace, or a custom workspace that you specify. Data is stored in accordance with the workspace location.


## Determine access and ownership

In complex enterprises, different teams manage different [security functions](/cloud-adoption-framework/organize/cloud-security).

Figuring out ownership for server and endpoint security is critical. Ownership that's undefined, or hidden within organizational silos causes friction that can lead to delays, insecure deployments, and difficulties in identifying and following threats across the enterprise.

Security leadership should identify the teams, roles, and individuals responsible for making and implementing decisions about server security. Typically, responsibility is shared between a [central IT team](/cloud-adoption-framework/organize/central-it) and a [cloud infrastructure and endpoint security team](/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint).

Individuals in these teams need Azure access rights to manage and use Defender for Cloud. As part of planning, figure out the right level of access for individuals, based on Defender for Cloud's role-base access control (RBAC) model. 

### RBAC model

In addition to the built-in Owner, Contributor, Reader roles for an Azure subscription/resource group, there are a couple of built-in roles that control Defender for Cloud access.

- **Security Reader**: Provides viewing rights to Defender for Cloud recommendations, alerts, security policy and states. This role can't make changes to Defender for Cloud settings.
- **Security Admin**: Provide Security Reader rights, and the ability to update security policy, dismiss alerts and recommendations, and apply recommendations.

[Get more details](permissions.md#roles-and-allowed-actions) about allowed actions.


## Select a Defender for Servers plan

Defender for Servers provides two plans you can choose from.

- **Defender for Servers Plan 1** is entry-level, and must be enabled at the subscription level. Features include:
    -  Defender for Cloud's free [foundational cloud security posture management (CSPM)](concept-cloud-security-posture-management.md#defender-cspm-plan-options) features. These are available for all machines, regardless of whether a Defender for Cloud plan is enabled. Note that on-premises machines must be Azure Arc-enabled
    - Endpoint detection and response (EDR) features provided by [Microsoft Defender for Endpoint Plan 2](/microsoft-365/security/defender-endpoint/defender-endpoint-plan-1-2).
- <p style="color:red">**Defender for Servers Plan 2** provides all features. It must be enabled at the subscription level, and at the workspace level to get full feature coverage. Features include:</p>
    - All the functionality provided by Defender for Servers Plan 1.
    - Additional extended detection and response (XDR) capabilities.
  
### Plan features.

| Feature | Details | Plan 1 | Plan 2 |
|:---|:---|:---:|:---:|
| **Defender for Endpoint integration** | Defender for Servers integrates with Defender for Endpoint and protects servers with all the features, including:<br/>- [Attack surface reduction](/microsoft-365/security/defender-endpoint/overview-attack-surface-reduction) to lower the risk of attack.<br/>- [Next-generation protection](/microsoft-365/security/defender-endpoint/next-generation-protection), including real-time scanning/protection and [Microsoft Defender Antivirus](/microsoft-365/security/defender-endpoint/next-generation-protection).<br> - EDR including [threat analytics](/microsoft-365/security/defender-endpoint/threat-analytics), [automated investigation and response](/microsoft-365/security/defender-endpoint/automated-investigations), [advanced hunting](/microsoft-365/security/defender-endpoint/advanced-hunting-overview), and [Microsoft Defender Experts](/microsoft-365/security/defender-endpoint/microsoft-threat-experts).<br/>- Vulnerability assessment/mitigation, provided by Defender for Endpoint's integration with [Microsoft Defender Vulnerability Management](/microsoft-365/security/defender-vulnerability-management/defender-vulnerability-management-capabilities) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Licensing** | Defender for Server charges Defender for Endpoint licenses per hour instead of per seat, lowering costs by protecting virtual machines only when they're in use.| :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Defender for Endpoint provisioning** | Defender for Servers automatically provisions the Defender for Endpoint sensor on every supported machine that's connected to Defender for Cloud.| :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | 
| **Unified view** | Defender for Endpoint alerts display in the Defender for Cloud portal. You can drill down into the Defender for Endpoint portal for more information.| :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Qualys vulnerability assess** | <p style="color:red">As an alternative to Defender Vulnerability Management, Defender for Cloud integrates with the Qualys scanner to [identify vulnerabilities](deploy-vulnerability-assessment-vm.md). You don't need a Qualys license or account.</p> | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
**Adaptive application controls** | [Adaptive application controls](adaptive-application-controls.md) define allowlists of known safe applications for machines. Defender for Cloud must be enabled on a subscription to use this feature. | |:::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Free data ingestion (500 MB) in workspaces** | <p style="color:red">It's available for [specific data types](#what-data-types-are-included-in-the-500-mb-data-daily-allowance), calculated per node, per reported workspace, per day, and available for every workspace that has a *Security* or *AntiMalware* solution installed.</p> | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Just-in-time (JIT) VM access** | <p style="color:red">[JIT access](just-in-time-access-overview.md) locks down machine ports to reduce the attack surface.</p> Defender for Cloud must be enabled on a subscription to use this feature. | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Adaptive network hardening** | Network hardening filters traffic to and from resources with network security groups (NSG) to improve your network security posture. Further improve security by [hardening the NSG rules](adaptive-network-hardening.md) based on actual traffic patterns. Defender for Cloud must be enabled on a subscription to use this feature. | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **File Integrity Monitoring** | [File integrity monitoring](file-integrity-monitoring-overview.md) examines files and registries for changes that might indicate an attack. A comparison method is used to determine whether suspicious modifications have been made to files. | | :::image type="icon" source="./media/icons/yes-icon.png"::: |
| **Threat detection at the OS level and network layer (including fileless attack detection)** | Detailed security alerts are issued as threats are detected. | :::image type="icon" source="./media/icons/yes-icon.png"::: <br/>Provided by Defender for Endpoint | :::image type="icon" source="./media/icons/yes-icon.png":::<br/> Provided by Defender for Endpoint/Defender for Servers |
| **Docker host hardening** | Assess containers hosted on Linux machines running Docker containers, and compares them with the Center for Internet Security (CIS) Docker Benchmark. [Learn more](harden-docker-hosts.md). | | :::image type="icon" source="./media/icons/yes-icon.png"::: 
[Network map](protect-network-resources.md) | Provides a geographical view of recommendations for hardening your network resources. | | :::image type="icon" source="./media/icons/yes-icon.png":::
[Agentless scanning](concept-agentless-data-collection.md) | Scans Azure VMs, using cloud APIs to collect data | | :::image type="icon" source="./media/icons/yes-icon.png":::

## Select a vulnerability assessment solution

There are a couple of vulnerability assessment options available in Defender for Servers.

- [Microsoft Defender Vulnerability Management](/microsoft-365/security/defender-vulnerability-management/defender-vulnerability-management-capabilities): Integrated with Defender for Endpoint.
    - Available in both Defender for Servers Plan 1 and Plan 2.
    - Enabled by default on machines onboarded to Defender for Endpoint, if[Defender for Endpoint has Defender Vulnerability Management enabled](/microsoft-365/security/defender-vulnerability-management/get-defender-vulnerability-management).
    - Has the same [Windows](/microsoft-365/security/defender-endpoint/configure-server-endpoints#prerequisites), [Linux](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint-linux#prerequisites), and [network](/microsoft-365/security/defender-endpoint/configure-proxy-internet#enable-access-to-microsoft-defender-for-endpoint-service-urls-in-the-proxy-server) prerequisites as Defender for Endpoint.
    - No additional software installation is needed.
- [Qualys vulnerability scanner](deploy-vulnerability-assessment-vm.md): Provided by Defender for Cloud's Qualys integration.
    - Available only in Defender for Servers Plan 2.
    - A great fit if you're using a third-party EDR solution, or a Fanotify-based solution, which might mean you can't deploy Defender for Endpoint for vulnerability assessment.
    - The integrated Defender for Cloud Qualys solution doesn't support a proxy configuration, and can't connect to an existing Qualys deployment. Vulnerability findings are only available in Defender for Cloud.



## Understand workspace considerations

In Defender for Cloud, you can use the default Defender for Cloud log analytics workspace, or a custom workspace.

### Default workspace

- By default, when you onboard for the first time Defender for Cloud creates a new resource group and default workspace in the region of each subscription with Defender for Cloud enabled.
- When you use only free foundational CSPM, Defender for Cloud sets up the default workspace with the *SecurityCenterFree* solution enabled.
- Defender for Cloud plans (including Defender for Servers) are enabled on default workspace, and the *Security* solution is installed.
- If you have VMs in multiple locations, Defender for Cloud creates multiple workspaces accordingly, to ensure data compliance. 
- Default workspace naming is in the format: [subscription-id]-[geo].

#### Default workspace location

Default workspaces are created in the following locations.

**Server location** | **Workspace location**
--- | ---
United States, Canada, Europe, UK, Korea, India, Japan, China, Australia | The workspace is created in the matching location.
Brazil | United States
East Asia, Southeast Asia | Asia

### Custom workspaces

You can use a custom workspace instead of the default workspace.

- You must enable the Defender for Servers plan on custom workspaces.
- The custom workspace must be associated with the Azure subscription on which Defender for Cloud is enabled.
- You need at minimum read permissions for the workspace.
- - If the *Security & Audit* solution is installed on a workspace, Defender for Cloud uses the existing solution.
- Learn more about [workspace design strategy and criteria](../azure-monitor/logs/workspace-design.md).



## Review Azure Arc requirements

Azure Arc is used to onboard AWS, GCP, and on-premises machines to Azure, and is used by Defender for Cloud to protect non-Azure machines. 

- **Foundational CSPM**:
    - <p style="color:red">For free foundational CSPM features, you don't need Azure Arc running on AWS/GCP machines, but it's recommended for full functionality.<br/><br/> You do need Azure Arc onboarding for on-premises machines.</p>
- **Defender for Server plan**:
    - <p style="color:red">To use the Defender for Servers, all AWS/GCP and on-premises machines should be Azure Arc-enabled.</p>
    - After setting up AWS/GCP connectors, Defender for Cloud can automatically deploy agents to AWS/GCP servers. This includes automatic deployment of the Azure Arc agent.


### Plan for Azure Arc deployment

1. Review [planning recommendations](../azure-arc/servers/plan-at-scale-deployment.md), and [deployment prerequisites](../azure-arc/servers/prerequisites.md).
1. Azure Arc installs the Connected Machine agent to connect to and manage machines hosted outside Azure.
    - Review the [agent components and data collected from machines](./azure-arc/servers/agent-overview#agent-resources.md).
    - [Review](../azure-arc/servers/network-requirements.md) network and internet access requirements for the agent.
    - Review [connection options](../azure-arc/servers/deployment-options.md) for the agent.

## Review agents and extensions


### Log Analytics agent/Azure Monitor agent

Defender for Cloud uses the Log Analytics agent/Azure Monitor agent to collect information from compute resources, and then sends it to a Log Analytics workspace for further analysis. Agents are used in Defender for Servers as follows.

<p style="color:red">

Feature | Log Analytics agent | Azure Monitor agent
--- | --- | --- 
Fundamental CSPM recommendations (free) that depend on agent: [OS baseline recommendation](apply-security-baseline.md) (Azure VMs) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png":::<br/><br/> When using Azure Monitor agent, the Azure Policy [guest configuration extension](../virtual-machines/extensions/guest-configuration.md) is used.
Fundamental CSPM: [System updates recommendations](recommendations-reference.md#compute-recommendations) (Azure VMs) | :::image type="icon" source="./media/icons/yes-icon.png"::: | Not yet available
Fundamental CSPM: [Antimalware/Endpoint protection recommendations](endpoint-protection-recommendations-technical.md) (Azure VMs) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png":::
Attack detection at the OS level and network layer (including fileless attack detection).<br/><br/> Plan 1 relies on Defender fro Endpoint capabilities | :::image type="icon" source="./media/icons/yes-icon.png":::<br/><br/> Plan 2| :::image type="icon" source="./media/icons/yes-icon.png":::<br/><br/> Plan 2
File integrity monitoring (Plan 2)  | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: 
[Adaptive application controls](adaptive-application-controls.md) (Plan 2) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png":::
</p>

### Qualys extension

<p style="color:red">The Qualys extension is available in Defender for Servers Plan 2, and is deployed if you want to use Qualys for vulnerability assessment.</p>

- The Qualys extension sends metadata for analysis to one of two Qualys datacenter regions, depending on your Azure region.
    - If you're in an European Azure geography data is processed in Qualys' European data center. 
    - For other regions data is processed in the US data center.
- To use Qualys on a machine, the extension must be installed, and the machine must be able to communicate with the relevant network endpoint:
    - Europe datacenter: https://qagpublic.qg3.apps.qualys.com
    - US datacenter: https://qagpublic.qg3.apps.qualys.com


### Guest configuration extension

The extension performs audit and configuration operations inside VMs.

- <p style="color:red">If you're using the Azure Monitor Agent, Defender for Cloud leverages this extension to analyze operating system security baseline settings on Windows and Linux machines.</p>
- <p style="color:red">While Azure Arc-enabled servers and the guest configuration extension are free, additional costs might apply when using guest configuration policies on Azure Arc servers outside Defender for Cloud scope.</p>

Learn more about the Azure Policy [guest configuration extension](../virtual-machines/extensions/guest-configuration.md)

### Defender for Endpoint extensions

When you enable Defender for Servers, Defender for Cloud automatically deploys a Defender for Endpoint extension. The extension is a management interface that runs a script inside the operating system to deploy and integrate the Defender for Endpoint sensor on the machine.

- Windows machines extension: MDE.Windows
- Linux machines extension: MDE.Linux
- Machines must meet [minimum requirements](/microsoft-365/security/defender-endpoint/minimum-requirements).
- There are some [specific requirements](/microsoft-365/security/defender-endpoint/configure-server-endpoints) for some Windows Server versions.

### Agent provisioning

<p style="color:red">
When you enable Defender for Cloud plans, including Defender for Servers, you can select to automatically provision a number of agents. These are the agents that are relevant for Defender for Servers:
</p>

- Log Analytics agent/Azure Monitor agent for Azure VMs
- Log Analytics agent/Azure Monitor agent for Azure Arc VMs
- Qualys agent 
- Guest configuration agent 

In addition, when you enable Defender for Servers Plan 1 or Plan 2, the Defender for Endpoint extension is automatically provisioned on all supported machines in the subscription.

### Things to note

**Provisioning** | **Details**
--- | ---
Defender for Endpoint sensor |  If machines are running Microsoft Antimalware, also known as System Center Endpoint Protection (SCEP), the Windows extension automatically removes it from the machine.<br/><br/> If you deploy on a machine that already has the Defender for Endpoint sensor running, after successful installing the sensor from Defender for Servers, the extension will stop and disable the legacy sensor. The change is transparent and the machine’s protection history is preserved.
AWS/GCP machines | For these machines, you configure automatic provisioning when you set up the AWS or GCP connector.
Manual installation | If you don't want Defender for Cloud to provision the Log Analytics agent/Azure Monitor agent, you can install agents manually.<br/><br/> You can connect the agent to the default Defender for Cloud workspace, or to a custom workspace.<br/><br/> <p style="color:red">The workspace must have the *SecurityCenterFree* (providing free foundational CSPM) or *Security* solution enabled (Defender for Servers Plan 2).<br/><br/></p>If Defender for Cloud identifies that a VM is connected to a custom workspace, it enables solutions on the workspace, in accordance with your Defender for Cloud configuration.
[Log Analytics agent running directly](faq-data-collection-agents.md#what-if-a-log-analytics-agent-is-directly-installed-on-the-machine-but-not-as-an-extension--direct-agent--) | If a Windows VM has the Log Analytics agent running, but not as a VM extension, Defender for Cloud will install the extension. The agent will report to the Defender for Cloud workspace in addition to the existing agent workspace. <br/><br/> On Linux VMs, multi-homing isn't supported, and if an existing agent is detected then the agent won't be automatically provisioned.
[Operations Manager agent](faq-data-collection-agents.md#what-if-a-system-center-operations-manager-agent-is-already-installed-on-my-vm-) | The Log Analytics agent can work side-by-side with the Operations manager agent. The agents share common runtime libraries which will be updated when the Log Analytics agent is deployed.
Removing the Log Analytics extension | <p style="color:red">If you remove the Log Analytics extension, Defender for Cloud won't be able to collect security data and recommendations/alerts will be missing. Within 24 hours, Defender for Cloud will determine that the extension is missing and reinstall it.</p>


### When shouldn't I use auto provisioning?

You might want to opt out of automatic provisioning in the following circumstances:

- You have critical VMs that shouldn't have the Log Analytics agent installed. Automatic provisioning is for an entire subscription. You can't opt out for specific machines.
- If you're running the System Center Operations Manager agent version 2012 with Operations Manager 2012 don't turn on automatic provisioning, otherwise management capabilities might be lost.
- If you want to configure a custom workspace, you have two options:
    - Opt out of automatic provisioning when you first set up Defender for Cloud. Then, configure provisioning on your custom workspace.
    - Let automatic provisioning run to install the Log Analytic agents on machines. Set a custom workspace, and then when asked, reconfigure existing VMs with the new workspace setting.

### Verify operating system support

Before deployment, verify operating system support for agents and extensions.

- Verify that your [operating systems are supported](/microsoft-365/security/defender-endpoint/minimum-requirements) by Defender for Endpoint.
- [Check requirements](../azure-arc/servers/prerequisites.md) for Azure Arc Connect Machine agent.
- Check operating system support for the [Log Analytics agent](../azure-monitor/agents/log-analytics-agent.md#supported-operating-systems) and [Azure Monitor agent](../azure-monitor/agents/agents-overview.md)


## Scale your deployment 

When you enable Defender for Cloud subscription, the following occurs:

1. The *microsoft.security* resource provider is automatically registered on the subscription.
1. At the same time, the Cloud Security Benchmark initiative that's responsible for creating security recommendations and calculating secure score is assigned to the subscription.
1. After enabling Defender for Cloud on the subscription, you turn on  Defender for Servers Plan 1 or 2, and enable auto-provisioning.


There are some considerations around these steps as you scale your deployment.

### Scaling Cloud Security Benchmark deployment

- In a scaled deployment you might want the Cloud Security Benchmark (formerly the Azure Security Benchmark) to be automatically assigned.
    - You can do this manually assigning the policy initiative to your (root) management group, instead of each subscription individually.
    - You can find the **Azure Security Benchmark** policy definition in [github](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Security%20Center/AzureSecurityCenter.json).
    - The assignment is inherited for every existing and future subscription underneath the management group.
    - [Learn more](onboard-management-group.md) about using a built-in policy definition to register register a resource provider.


### Scaling plans

<p style="color:red">You can use a policy definition to enable Defender for Servers at scale. Note that:</p>

- You can find the built-in **Configure Defender for Servers to be enabled** policy definition in the Azure Policy > Policy Definitions, in the Azure portal.
- <p style="color:red">Alternatively, there's a [custom policy in Github](https://github.com/Azure/Microsoft-Defender-for-Cloud/tree/main/Policy/Enable%20Defender%20for%20Servers%20plans) that allows you to enable Defender for Servers and select the plan at the same time.</p>
- You can only enable one Defender for Servers plan on each subscription, and not both at the same time.
- <p style="color:red">If you want to use both plans in your environment, divide your subscriptions into two management groups. On each management group you assign a policy to enable the respective plan on each underlying subscription.</p> 


### Scaling auto-provisioning 

Auto-provisioning can be configured by assigning the built-in policy definitions to an Azure management group, so that underlying subscriptions are covered. The following table summarizes the definitions. 


Agent | Policy
---  | ---
Log Analytics agent (default workspace) | **Enable Security Center's autoprovisioning of the Log Analytics agent on your subscriptions with default workspaces**.
Log Analytics agent (custom workspace) | **Enable Security Center's autoprovisioning of the Log Analytics agent on your subscriptions with custom workspaces**.
Azure Monitor agent (default data collection rule) | \\[Preview\\]: Configure Arc machines to create the default Microsoft Defender for Cloud pipeline using Azure Monitor Agent<br/><br/> \\[Preview\\]: Configure virtual machines to create the default Microsoft Defender for Cloud pipeline using Azure Monitor Agent
Azure Monitor agent (custom data collection rule) | \\[Preview\\]: Configure Arc machines to create the Microsoft Defender for Cloud user-defined pipeline using Azure Monitor Agent<br/><br/> \\[Preview\\]: Configure machines to create the Microsoft Defender for Cloud user-defined pipeline using Azure Monitor Agent
Defender for Endpoint extension | \\[Preview\\]: Deploy Microsoft Defender for Endpoint agent on Windows virtual machines<br/><br/> \[Preview\\]: Deploy Microsoft Defender for Endpoint agent on Windows Azure Arc machines<br/><br/> \[Preview\\]: Deploy Microsoft Defender for Endpoint agent on Linux hybrid machines<br/><br/> \[Preview\\]: Deploy Microsoft Defender for Endpoint agent on Linux virtual machines<br/><br/>
Qualys vulnerability assessment | **Configure machines to receive a vulnerability assessment provider** 
Guest configuration extension | [Overview and prerequisites](../virtual-machines/extensions/guest-configuration)

Policy definitions can be found in the Azure portal > **Policy** > **Definitions**.


## Common billing questions

These common questions that affect Defender for Servers billing might be useful as you plan your deployment.

### Can I enable Defender for Servers on a subset of machines in a subscription?

No. When you enable Microsoft Defender for Servers on an Azure subscription or a connected AWS account/GCP project, all of the connected machines are protected by Defender for Servers. This includes servers that don't have the Log Analytics/Azure Monitor agent installed.

### What servers do I pay for in a subscription?
When you enable Defender for Servers on a subscription, you're charged for all machines, in accordance with their power state.

#### Azure VMs

**State** | **Billing**
--- | --- 
Starting | VM starting up | Not billed
Running | Normal working state | Billed
Stopping | Transitional, will move to Stopped state when complete. | Billed
Stopped | VM shut down from within guest OS or using PowerOff APIs. Hardware is still allocated and the machine remains on the host. | Billed
Deallocating | Transitional, will move to Deallocated state when complete. | Not billed
Deallocated | VM stopped and removed from the host. | Not billed

#### Azure Arc machines
<p style="color:red">

**State** | **Billing**
--- | --- 
Connecting | Servers connected but heartbeat not yet received | Not billed
Connected | Receiving regular heartbeat from Connected Machine agent | Billed
Offline/Disconnected | No heartbeat received with 15-30 minutes | Not billed
Expired | If disconnected for 45 days status can change to Expired. | Not billed
</p>

### If I already have a license for Microsoft Defender for Endpoint, can I get a discount for Defender for Servers?

If you already have a license for Microsoft Defender for Endpoint for Servers Plan 2, you won't have to pay for that part of your Microsoft Defender for Servers license. [Learn more](/microsoft-365/security/defender-endpoint/minimum-requirements#licensing-requirements).

To request your discount, contact Defender for Cloud's support team. You'll need to provide the relevant workspace ID, region, and number of Microsoft Defender for Endpoint for servers licenses applied for machines in the given workspace.

The discount will be effective starting from the approval date, and won't take place retroactively.

### If I enable Defender for Clouds Servers plan on the subscription level, do I need to enable it on the workspace level?

When you enable the Servers plan on the subscription level, Defender for Cloud automatically enables the plan on your default workspaces automatically. If you're using a custom workspace, you need to select it to enable the plan on it.

Note that:

- If you turn on Defender for Servers for a subscription and for a connected custom workspace, you aren't charged for both. The system identifies unique VMs.
- If you enable Defender for Servers on cross-subscription workspaces, connected machines from all subscriptions are billed, including subscriptions that don't have the servers plan enabled.
- There's a 500-MB free data ingestion for each workspace. It's calculated per node, per reported workspace, per day, and available for every workspace that has a 'Security' or 'AntiMalware' solution installed. You'll be charged for any data ingested over the 500-MB limit.

### Is the 500-MB free data ingestion calculated for an entire workspace?

You get 500-MB free data ingestion per day, for every VM connected to the workspace. This is specifically for the security data types that are directly collected by Defender for Cloud.

This data is a daily rate averaged across all nodes. Your total daily free limit is equal to [number of machines] x 500 MB. So even if some machines send 100 MB and others send 800 MB, if the total doesn't exceed your total daily free limit, you won't be charged extra.

### What data types are included in the 500-MB data daily allowance?
Defender for Cloud's billing is closely tied to the billing for Log Analytics. [Microsoft Defender for Servers](defender-for-servers-introduction.md) provides a 500 MB/node/day allocation for machines against the following subset of [security data types](/azure/azure-monitor/reference/tables/tables-category#security):

- [SecurityAlert](/azure/azure-monitor/reference/tables/securityalert)
- [SecurityBaseline](/azure/azure-monitor/reference/tables/securitybaseline)
- [SecurityBaselineSummary](/azure/azure-monitor/reference/tables/securitybaselinesummary)
- [SecurityDetection](/azure/azure-monitor/reference/tables/securitydetection)
- [SecurityEvent](/azure/azure-monitor/reference/tables/securityevent)
- [WindowsFirewall](/azure/azure-monitor/reference/tables/windowsfirewall)
- [SysmonEvent](/azure/azure-monitor/reference/tables/sysmonevent)
- [ProtectionStatus](/azure/azure-monitor/reference/tables/protectionstatus)
- [Update](/azure/azure-monitor/reference/tables/update) and [UpdateSummary](/azure/azure-monitor/reference/tables/updatesummary) when the Update Management solution isn't running in the workspace or solution targeting is enabled.

If the workspace is in the legacy Per Node pricing tier, the Defender for Cloud and Log Analytics allocations are combined and applied jointly to all billable ingested data.


## Next steps

After working through these planning steps, you can start deployment:

- [Enable Defender for Servers](enable-enhanced-security.md) plans
- [Connect on-premises machines](quickstart-onboard-aws) to Azure.
- [Connect AWS accounts](quickstart-onboard-aws.md) to Defender for Cloud.
- [Connect GCP projects](quickstart-onboard-gcp.md) to Defender for Cloud.
