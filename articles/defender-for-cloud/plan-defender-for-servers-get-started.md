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
- Which Defender for Servers plan should I choose?
- Where will my data be stored?
- What do I need to deploy?
- What permissions do I need?
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
1. Review the table below to understand where Defender for Cloud/Defender for Server stores data.

### Storage locations

**Data** | **Location** 
--- | ---  
**Security alerts and recommendations** | Stored in the Defender for Cloud backend.<br/><br/> For example, if you create an Azure VM in West Europe region, all alert and recommendation information will also be stored in West Europe.
**Machine information** | Stored in a Log Analytics workspace.<br/><br/> Either the Defender for Cloud default workspace, or a custom workspace that you specify.


## Determine access and ownership

In complex enterprises, different teams manage different [security functions](/cloud-adoption-framework/organize/cloud-security).

Figuring out ownership for server and endpoint security is critical. Ownership that's undefined, or hidden within organization silos typically causes friction that can lead to delays, insecure deployments, and difficulties in identifying, analyzing, and following threats across the enterprise.

Security leadership should pinpoint who which teams, roles, and individuals are responsible for making server security decisions.

- Typically, a [central IT team](/cloud-adoption-framework/organize/central-it) and a [cloud infrastructure and endpoint security team](/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint) share responsibility.
- Individuals in these teams will need Azure access rights to manage and use Defender for Cloud. Figure out the right level of access, based on Defender for Cloud's role-base access control (RBAC) model. 

In addition to the built-in Owner, Contributor, Reader roles for an Azure subscription/resource group, Defender for Cloud provides a couple of built-in roles that control access to Defender for Cloud only.

- **Security Reader**: Viewing rights to Defender for Cloud for recommendations, alerts, a security policy, and security states. This role can't make changes.
- **Security Admin**: Provide the same rights as the Security Reader and can also update the security policy, dismiss alerts and recommendations, and apply recommendations.

[Learn more](permissions.md#roles-and-allowed-actions) about allow actions for roles.


## Select a Defender for Servers plan

Defender for Servers provides two plans you can choose from.

- **Defender for Servers Plan 1** is entry-level. It must be enabled at the subscription level. Features include:
    -  Defender for Cloud's free [foundational cloud security posture management](concept-cloud-security-posture-management.md#defender-cspm-plan-options).
    - EDR features provided by [Microsoft Defender for Endpoint Plan 2](/microsoft-365/security/defender-endpoint/defender-endpoint-plan-1-2)
- **Defender for Servers Plan 2** can be enabled at the subscription level, or turned on for a specific Log Analytics workspace. 
    - At the workspace level, any machine connected to the workspace will incur a charge when Defender for Servers Plan 2 is enabled.
    - Features include:
        - All the functionality included in Defender for Servers Plan 1.
        - Additional XDR capabilities.
  

In addition to features provided in plans, servers are protected with Defender for Cloud's free [foundational cloud security posture management (CSPM) capabilities](concept-cloud-security-posture-management.md#defender-cspm-plan-options)

### Plan features.

| Feature | Details | Plan 1 | Plan 2 |
|:---|:---|:---:|:---:|
| **Defender for Endpoint integration** | Defender for Servers integrates with Defender for Endpoint Plan 2 and protects servers with all the Plan 2 features, including:<br/>- [Attack surface reduction](/microsoft-365/security/defender-endpoint/overview-attack-surface-reduction) to lower the risk of attack.<br/>- [Next-generation protection](/microsoft-365/security/defender-endpoint/next-generation-protection), including real-time scanning/protection and [Microsoft Defender Antivirus](/microsoft-365/security/defender-endpoint/next-generation-protection).<br> - EDR including [threat analytics](/microsoft-365/security/defender-endpoint/threat-analytics), [automated investigation and response](/microsoft-365/security/defender-endpoint/automated-investigations), [advanced hunting](/microsoft-365/security/defender-endpoint/advanced-hunting-overview), and [Microsoft Defender Experts](/microsoft-365/security/defender-endpoint/microsoft-threat-experts).<br/>- Vulnerability assessment/mitigation, provided by Defender for Endpoint's integration with [Microsoft Defender Vulnerability Management](/microsoft-365/security/defender-vulnerability-management/defender-vulnerability-management-capabilities) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: |
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

## Select a vulnerability assessment solution

Choose between the available vulnerability assessment/mitigation options:

- [Microsoft Defender Vulnerability Management](/microsoft-365/security/defender-vulnerability-management/defender-vulnerability-management-capabilities): Integrated with Defender for Endpoint.
    - It's available in both Defender for Server Plan 1 and Plan 2.
    - It's enabled by default on machines onboarded to Defender for Endpoint.
    - It comes with the same [Windows](/microsoft-365/security/defender-endpoint/configure-server-endpoints#prerequisites), [Linux](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint-linux#prerequisites), and [network](/microsoft-365/security/defender-endpoint/configure-proxy-internet#enable-access-to-microsoft-defender-for-endpoint-service-urls-in-the-proxy-server) prerequisites as Defender for Endpoint.
    - It doesn't require any additional software installation.
- Qualys: Provided by Defender for Cloud's Qualys integration.
    - Available in Defender for Servers Plan 2 only.
    - It's a great fit if you're using a third-party EDR solution, or a 'fanotify'-based solution, where you might not be able to deploy Defender for Endpoint for vulnerability assessment.
    - The integrated Defender for Cloud Qualys solution doesn't support a proxy configuration and can't connect to an existing Qualys deployment. Vulnerability findings are only available in Defender for Cloud.



## Understand workspace considerations

In your Defender for Server deployment, you can use the default Defender or Cloud log analytics workspace, or a custom workspace.

### Default workspace

- By default, when you onboard for the first time Defender for Cloud creates a new resource group and default workspace for the region in each subscription where it is enabled.
- When you're using only free foundational CSPM features, Defender for Cloud sets up the default workspace with the **SecurityCenterFree*solution enabled and you won't be billed.
- When you turn on Defender for Servers (or any other plan), it's enabled on the default workspace, and the *Security* solution is installed on the workspace.
- If you have VMs in multiple locations, Defender for Cloud creates multiple workspaces to ensure data compliance. 
- Default workspace naming is in the format: [subscription-id]-[geo].

#### Default workspace location

**Server location** | **Workspace location**
--- | ---
United States, Canada, Europe, UK, Korea, India, Japan, China, Australia | The workspace is created in the matching location.
Brazil | United States
East Asia, Southeast Asia | Asia

### Custom workspaces

You can use a custom workspace instead of the default workspace.

- You must switch on Defender for Servers in the custom workspace.
- The custom workspace must be associated with the Azure subscription on which you're enabling Defender for Cloud.
- You need at minimum read permissions for the workspace.
- If Defender for Cloud identifies that a VM is connected to a custom workspace, it enables solutions on the workspace, in accordance with your Defender for Cloud configuration.
- The VM is protected as long at the *Security* or *SecurityCenterFree* solution is installed on the workspace.
- If the Security & Audit solution is installed on a workspace, Defender for Cloud uses the existing solution.
- Learn more about [design strategy and criteria](../azure-monitor/logs/workspace-design.md) for workspaces.



## Review Azure Arc requirements

Azure Arc is used to onboard AWS, GCP, and on-premises machines to Azure. It's used by Defender for Cloud to provide full protection to non-Azure machines. Note the following:

- **Foundational CSPM**: For free foundational CSPM features, you don't need Azure Arc running on AWS/GCP machines. For on-premises machines you do. 
    - Note that although  you can monitor machines without Azure Arc, running them as Azure Arc-enabled allows you to easily and automatically detect and manage agents in the Azure Arc VMs.
- **AWS/GCP**:
    - For Defender for Servers, AWS/GCP machines must be Azure Arc-enabled.
    - Azure Arc servers have full access to machine extensions so that agents can be automatically deployed.
    - When you set up the AWS/GCP connector, Defender for Cloud can automatically deploy agents to AWS/GCP servers, including automatic deployment of the Azure Arc agent.
- On-premises machines
    - For Defender for Server protection of on-premises servers, we recommend you deploy the machines as Azure Arc-enabled.
    - As an alternative to Azure Arc, you can manually add the machines to a Log Analytics workspace, and manually install the Log Analytics agent.
    
### Plan for Azure Arc deployment

- Review [planning recommendations](../azure-arc/servers/plan-at-scale-deployment.md), and [deployment prerequisites](../azure-arc/servers/prerequisites.md).
1. Azure Arc installs the Connected Machine agent to connect to and manage machines hosted outside Azure.
    - Review the [agent components and data collected from machines](./azure-arc/servers/agent-overview#agent-resources.md).
    - [Review](../azure-arc/servers/network-requirements.md) network and internet access requirements.
    - Review [connection options](../azure-arc/servers/deployment-options.md).

## Review agents and extensions


### Log Analytics agent/Azure Monitor agent

Defender for Cloud uses the Log Analytics agent/Azure Monitor agent to collect information from compute resources, and copy it to a Log Analytics workspace for further analysis. It's used in Defender for Server as follows.

Feature |  Plan 1 | Plan 2 | Details
--- | --- | --- | ---
Fundamental CSPM assesses your resources, and provides recommendations and Secure Score.<br/><br/> -   | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | There are a couple of foundational CSPM recommendations that rely on agents, including:<br/><br/> - [Endpoint protection recommendations](endpoint-protection-recommendations-technical.md) use the Azure Monitor agent<br/> - [System updates recommendations](recommendations-reference.md#compute-recommendations) use the built-in Azure policy definition or the Azure Arc agent. <br/><br/> - [Operating system baseline recommendations](apply-security-baseline.md) use the Azure Policy [guest configuration extension](../virtual-machines/extensions/guest-configuration.md). 
Attack detection at the OS level and network layer (including fileless attack detection)** | :::image type="icon" source="./media/icons/yes-icon.png":::<br/> Provided by Defender for Endpoint | :::image type="icon" source="./media/icons/yes-icon.png":::<br/> Provided by Defender for Endpoint/Defender for Server capabilities.
File integrity monitoring** |  | :::image type="icon" source="./media/icons/yes-icon.png":::<br/> Provided by Defender for Endpoint/Defender for Server capabilities.
[Adaptive application controls](adaptive-application-controls.md) | | :::image type="icon" source="./media/icons/yes-icon.png":::

## Qualys extension

Qualys vulnerability assessment/mitigation is available in Defender for Servers Plan 2, and is used if you want to use Qualys for vulnerability assessment and mitigation.

- The Qualys extension sends metadata for analysis to one of two Qualys datacenter regions, depending on your Azure region.
       - If you're in an European Azure geography data is processed in Qualys' European data center. 
       - For other regions data is proessed in the US data center.
- To use Qualys, the extension must be installed on a machine, and the machine must be able to communicate with the relevant network endpoint:
    - Europe datacenter: https://qagpublic.qg3.apps.qualys.com
    - US datacenter: https://qagpublic.qg3.apps.qualys.com


### Guest configuration extension

The extension performs audit and configuration operations inside VMs.

Defender for Cloud leverages this component to analyze operating system security baseline settings on Windows and Linux machines.

While Azure Arc-enabled servers and the guest configuration extension are free, additional costs might apply when using guest configuration policies outside Defender for Cloud scope.

Learn more about the Azure Policy [guest configuration extension](../virtual-machines/extensions/guest-configuration.md)

### Defender for Endpoint extensions

When you enable Defender for Servers, Defender for Cloud automatically deploys a Defender for Endpoint extension on Windows and Linux machines. The extension is a management interface that runs a script instead the operating system to deploy and integrate the Defender for Endpoint sensor on a machine.

- Windows machines extension: MDE.Windows
- Linux machines extension: MDE.Linux
- Machines must meet [minimum requirements](/microsoft-365/security/defender-endpoint/minimum-requirements). There are some [specific requirements](/microsoft-365/security/defender-endpoint/configure-server-endpoints) for some Windows Server versions.

## Agent provisioning

When you enable Defender for Cloud plans, including Defender for Server, you can select to automatically provision these agents:

- Log Analytics agent/Azure Monitor agent for Azure VMs**
- Log Analytics agent/Azure Monitor agent for Azure Arc VMs
- Qualys agent 
- Guest configuration agent 

In addition, when you enable Defender for Servers Plan 1 or Plan 2, the **Defender for Endpoint extension** is automatically provisioned on all supported machines in the subscription.

### Things to note

**Provisioning** | **Details**
--- | ---
Defender for Endpoint sensor |  If machines are running Microsoft Antimalware, also known as System Center Endpoint Protection (SCEP), the Windows extension automatically removes it from the machine.<br/><br/> If you deploy on a machine that already has the Defender for Endpoint sensor running, after successful installing the sensor from Defender for Server, the extension will stop and disable the legacy sensor. The change is transparent and the machine’s protection history is preserved.
AWS/GCP machines | For these machines, you configure automatic provisioning when you set up the AWS or GCP connector.
Manual installation | If you don't want Defender for Cloud to provision the Log Analytics agent/Azure Monitor agent, you can install agents manually.<br/><br/> You can connect the agent to the default Defender for Cloud workspace, or to a custom workspace.<br/><br/> The workspace must have the *SecurityCenterFree* or *Security* solution enabled.<br/><br/>If Defender for Cloud identifies that a VM is connected to a custom workspace, it enables solutions on the workspace, in accordance with your Defender for Cloud configuration.
Log Analytics running directly | If a Windows VM has the Log Analytics agent running, but not as a VM extension, Defender for Cloud will install the extension. The agent will report to the Defender for Cloud workspace in addition to the existing agent workspace. <br/><br/> On Linux VMs, multi-homing isn't supported, and if an existing agent is detected then the agent won't be automatically provisioned.
Operations Manager agent | The Log Analytics agent can ride side-by-side with the Operations manager agent. The agents share common runtime libraries which will be updated.
Removing the Log Analytics agent | If you remove the Log Analytics agent, Defender for Cloud won't be able to collect security data and recommendations/alerts will be missing. Within 24 hours, Defender for Cloud will determine that the extension is missing and reinstall it.


### When shouldn't I use auto provisioning?

You might want to opt out of automatic provisioning in the following circumstances:

- You have critical VMs that shouldn't have the Log Analytics agent installed. Automatic provisioning is for an entire subscription. You can't opt out for specific machines.
- If you're running the System Center Operations Manager agent version 2012 with Operations Manager 2012 don't turn on automatic provisioning, otherwise management capabilities might be lost.
- If you want to use a custom workspace, you have two options:
    - Opt out of automatic provisioning. Then, configure provisioning on your custom workspace.
    - Let automatic provisioning run to install the Log Analytic agents on machines, and then set a custom workspace. Then, when asked, reconfigure existing VMs with the new workspace setting. 

## Verify operating system support

Before deployment, verify operating system support:

- Verify that your [operating systems are supported](/microsoft-365/security/defender-endpoint/minimum-requirements) by Defender for Endpoint.
- [Check requirements](../azure-arc/servers/prerequisites.md) for Azure Arc Connect Machine agent.
- Check operating system support for the [Log Analytics agent](../azure-monitor/agents/log-analytics-agent.md#supported-operating-systems)/[Azure Monitor agent](../azure-monitor/agents/agents-overview.md)


## Scale your deployment 

When you enable Defender for Cloud subscription, the following occurs:

1. The microsoft.security resource provider is automatically registered on the subscription when you open Defender for Cloud in the subscription.
1. At the same time, Cloud Security Benchmark initiative that's responsible for creating security recommendations and calculation secure score is assigned to the subscription.
1. You then enable Defender for Servers Plan 1 or 2, and enable auto-provisioning.


There are some considerations around these steps as you scale your deployment.

### Scaling Cloud Security Benchmark deployment

- In a scaled deployment you might want the Cloud Security Benchmark (formerly the Azure Security Benchmark) to be automatically assigned.
    - You can do this manually assigning the policy initiative to your (root) management group, instead of each subscription individually.
    - You can find the **Azure Security Benchmark** policy definition in [github](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Security%20Center/AzureSecurityCenter.json).
    - Then, the assignment is inherited for every existing and future subscription underneath the management group.
    - [Learn more](onboard-management-group.md) about using a built-in policy definition to register register a resource provider.


### Scaling plans

The same policy definition you used to register a resource provider can be used to  enable Defender for Server plans at scale. Note that:

- You can find the **Configure Defender for Servers to be enabled** policy definition in the Azure Policy > Policy Definitions, in the Azure portal.
- You can only enable two Defender for Server plans on each subscription, and not both at the same time.
- If you do want to use two plans at the same time, you need to divide your subscription into management groups. On each management group, you assign a policy to enable the plan on each underlying subscription.


### Scaling agent auto-provisioning 

Auto-provisioning can be configured by assigning the built-in policy definitions to an Azure management group, so that underlying subscriptions are covered. The following table summarizes the definitions. 

Policy definitions can be found in the Azure portal > **Policy** > **Definitions**.

Agent | Policy
---  | ---
Log Analytics agent (default workspace) | **Enable Security Center's autoprovisioning of the Log Analytics agent on your subscriptions with default workspaces**.
Log Analytics agent (custom workspace) | **Enable Security Center's autoprovisioning of the Log Analytics agent on your subscriptions with custom workspaces**.
Azure Monitor agent (default data collection rule) | \\[Preview\\]: Configure Arc machines to create the default Microsoft Defender for Cloud pipeline using Azure Monitor Agent<br/><br/> \\[Preview\\]: Configure virtual machines to create the default Microsoft Defender for Cloud pipeline using Azure Monitor Agent
Azure Monitor agent (custom data collection rule) | \\[Preview\\]: Configure Arc machines to create the Microsoft Defender for Cloud user-defined pipeline using Azure Monitor Agent<br/><br/> \\[Preview\\]: Configure machines to create the Microsoft Defender for Cloud user-defined pipeline using Azure Monitor Agent
Defender for Endpoint extension | \\[Preview\\]: Deploy Microsoft Defender for Endpoint agent on Windows virtual machines<br/><br/> \[Preview\\]: Deploy Microsoft Defender for Endpoint agent on Windows Azure Arc machines<br/><br/> \[Preview\\]: Deploy Microsoft Defender for Endpoint agent on Linux hybrid machines<br/><br/> \[Preview\\]: Deploy Microsoft Defender for Endpoint agent on Linux virtual machines<br/><br/>
Qualys vulnerability assessment | **Configure machines to receive a vulnerability assessment provider** 
Guest configuration extension | [Overview and prerequisites](../virtual-machines/extensions/guest-configuration)




## Common billing questions

These common questions around Defender for Servers billing might be useful as you plan your deployment

## Can I enabled Defender for Servers on a subset of machines in a subscription?

No. When you enable Microsoft Defender for Servers on an Azure subscription or a connected AWS account/GCP project, all of the connected machines are protected by Defender for Servers. This includes servers that don't have the Log Analytics/Azure Monitor agent installed.

### What servers do I pay for in a subscription?
When you enable Defender for Servers on a subscription, you're charged for all machines, in accordance with their power state.

**State** | **Billing**
--- | --- 
Starting | VM starting up | Not billed
Running | Normal working state | Billed
Stopping | Transitional, will move to Stopped state when complete. | Billed
Stopped | VM shut down from within guest OS or using PowerOff APIs. Hardware is still allocated and the machine remains on the host. | Billed
Deallocating | Transitional, will move to Deallocated state when complete. | Not billed
Deallocated | VM stopped and removed from the host. | Not billed

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

- [Connect non-Azure machines](quickstart-onboard-aws) to Azure.
- [Connect AWS accounts](quickstart-onboard-aws.md) to Defender for Cloud.
- [Connect GCP projects](quickstart-onboard-gcp.md) to Defender for Cloud.
- [Enable Defender for Servers](enable-enhanced-security.md).
- When you move from the default workspace to a custom workspace, monitored machines can be automatically reconfigured.
        - When you move between custom workspaces, or from custom to default, the change isn't applied to existing machines.