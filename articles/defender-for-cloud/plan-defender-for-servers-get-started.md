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
- If you're deploying on AWS/GCP machines, we suggest reviewing the [multicloud planning guide](plan-multicloud-security-get-started.md) before you start.

## How deployment works

Here's a quick overview of the deployment process

### Start protecting resources

When you open Defender for Cloud in the Azure portal, it's automatically turned on for your Azure subscriptions. At this stage:

1. Defender for Cloud starts protecting resources in the subscription with [foundational cloud security posture management (CSPM)](concept-cloud-security-posture-management.md#defender-cspm-plan-options) features, including security assessment and recommendations, and Secure Score.
1. Defender for Cloud creates a default Log Analytics workspace with the *SecurityCenterFree* solution enabled.
1. Recommendations based on security posture assessments start appearing in the Defender for Cloud console.

Note that:

- There are no charges when you use foundational CSPM with no Defender for Cloud plans enabled.
- Foundational CSPM provides assessment and recommendations for Azure VMs, AWS/GCP machines, and on-premises machines.
- AWS and GCP machines don't need to be set up with Azure Arc to get foundational CSPM features. 
- On-premises machines must be deployed as Azure Arc machines to get assessments and recommendation.
- Most of the foundational CSPM capabilities don't rely on an agent to collect data.
- There are a couple of recommendations that do rely on the Log Analytics agent/Azure Monitoring agent, system updates recommendations, OS baseline recommendations, and antimalware/endpoint protection recommendations.

### Deploy Defender for Servers

With Defender for Cloud working, you can then turn on paid Defender for Cloud plans, including Defender for Server.

- When you enable a paid plan, Defender for Cloud enables the *Security* solution on its default Log Analytics workspace.
- You can enable Defender for Servers Plan 1 for a subscription only. Defender for Servers Plan 2 can be enabled at the subscription and workspace level, or at the workspace level only.
- After enabling, Defender for Cloud starts pushing out agents and extensions to supported Azure VMs in the subscription/workgroup.

### Deploy on AWS

1. AWS machines must be connected to Azure with Azure Arc.
1. You set up a connector to connect to a single AWS account or to a management account.
1. All Defender for Cloud plans are on by default. You can turn off any plans you don't need.
1. You can configure auto provisioning settings to specify how agents needed by Defender for Server are installed on AWS machines.
1. You configure and download a CloudFormation template containing the resources needed for Defender for Cloud to connect to AWS.
1. After authentication to AWS, you deploy the template to the AWS account.

### Deploy on GCP

1. GCP machines must be connected to Azure with Azure Arc.
1. You set up a connector to connect to a single GCP project or organization.
1. All Defender for Cloud plans are on by default. You can turn off any plans you don't need.
1. You can configure auto provisioning settings to specify how agents needed by Defender for Server are installed on GCP machines. 
1. You configure a Cloud Shell template, and run the script in the GCP Cloud Shell.


### Protect on-premises machines

You can protect on-premises machines with Defender for Servers in a couple of ways:

- Option 1: Onboard them as Azure Arc machines, and deploy the Log Analytics agent.
- Option 2: Onboard on-premises machines connected to a Log Analytics workspace by manually installing the Log Analytics agent. 



1. To protect on-premises servers, 
1. 
1. When you 
1. If you enable a subscription, all servers in the subscription are 
    - If you enable for a subscription, all servers in the subscription are protected. You can't exclude servers.
    - When you enable for a subscription, Defender for Servers is enabled on the default Defender for Cloud workspace.
    - If you want to use a custom workspace instead of the default workspace, you need to enable Defender for Servers on all custom workspaces that don't have it enabled. 
        - You can only select a custom workspace that you have access too, and that's associated with the subscription.
        - You need at least read permissions to access the workspace.     
1. You can also enable Defender for Servers for an AWS account or GCP project.
    - 
1. 
1. 
1. 

Agent provisioning
   
1. When you enable Defender for Servers, Defender for Cloud starts automatically provisioning the agents and extensions needed for Defender for Server, to servers (Azure VMs, Azure Arc VMs, non-Azure machines) in the selected subscription/workspace.
1. 
1. required agents and extensions to compute resources it pr Defender for Cloud starts protecting compute resources .
    - .
1. 



to start discovering and protecting Azure and Azure Arc resources in the subscription. 
1. If you want to protect additional on-premises servers or AWS/GCP machines, there are a couple of ways to do that.
    **Method** | **Details**
    --- | ---
    Onboard machines using Defender for Cloud connectors | You can use the native Defender for Cloud connectors to onboard AWS accounts and GCP projects.<br/><br/> 
    Onboard machines using Azure Arc | 
    Onboard machines into Azure without Azure Arc | 


    - **Connect AWS or GCP accounts to Defender for Cloud**: You can use Defender for Cloud's native AWS or GCP connectors to connect to AWS or GCP. 
        - 
       
        - To protect GCP/AWS machines and on-premises servers, they must be onboarded to Azure using [Azure Arc](../azure-arc/index.yml).- 
        - ​

AWS:​

Enable AWS Connector​

Configure Auto-Provisioning to deploy Azure ARC Agent, Enable additional Extensions as needed​


GCP:​

Enable GCP Connector​

Configure Auto-Provisioning to deploy Azure ARC Agent, Enable additional Extensions as needed - 
        - AWS/GCP the AWS account or GCP project, . You  Non-Azure machines that are onboarded to an Azure subscription with Azure Arc are automatically detected by Defender for Server. We recommend using this method.
    - **Onboard servers manually**: If you don't onboard the machines to Azure using Azure Arc some manual work is required. You connect the machines to a Log Analytics workspace by installing the Log Analytics agent manually so that machines they appear in the Azure portal and can be discovered by Defender for Server.
1. With all servers discovered, 
1. 
1. - Optionally watch a quick video, [Defender for Servers introduction](episode-five.md) in our Defender for Cloud in the Field series.
### Discovering and protecting servers.


## Common billing questions

- You're charged for all machines in the subscription, even if you don't enable Defender for Servers at the workspace level.
- If you turn on Defender for Servers for a subscription and for a connected custom workspace, you aren't charged for both. The system identifies unique VMs.
- If you enable Defender for Servers on cross-subscription workspaces, connected machines from all subscriptions are billed, including subscriptions that don't have the servers plan enabled.
- As explained in the pricing and billing FAQ, there is a 500-MB free data ingestion for each workspace. It's calculated per node, per reported workspace, per day, and available for every workspace that has a 'Security' or 'AntiMalware' solution installed. You'll be charged for any data ingested over the 500-MB limit.


### What machines do I pay for?      - 

Protected machines are billed according to state as follows.

**State** | **Billing**
--- | --- 
Starting | VM starting up | Not billed
Running | Normal working state | Billed
Stopping | Transitional, will move to Stopped state when complete. | Billed
Stopped | VM shut down from within guest OS or using PowerOff APIs. Hardware is still allocated and the machine remains on the host. | Billed
Deallocating | Transitional, will move to Deallocated state when complete. | Not billed
Deallocated | VM stopped and removed from the host. | Not billed


### Plan for Azure Arc deployment

1. Review [planning recommendations](../azure-arc/servers/plan-at-scale-deployment.md), and [deployment prerequisites](../azure-arc/servers/prerequisites.md).
1. Azure Arc installs the Connected Machine agent to connect to and manage machines hosted outside Azure.
    - Review the [agent components and data collected from machines](./azure-arc/servers/agent-overview#agent-resources.md).
    - [Review](../azure-arc/servers/network-requirements.md) network and internet access requirements.
    - Review [connection options](../azure-arc/servers/deployment-options.md).
1. After a machine appears in the Azure portal, you can view and manage it like any other Azure resource.
1. 
1. 
1. 
1. 
1

### Prepare 


With 

 

and you must manually install the in the guest operating system.  



enable Defender for Cloud plans, including Defender for Server. D
As a first 



With Defender for Cloud working on the subscription.

As a first step, verify what servers you want to protect. If you want to protect on-premises machines 

Onboard these machines to Azure with Azure Arc. Machines onboarded with Azure Arc a You can automatically provision all agents and extensions.
If you don't want to use Azure Arc, you can manually onboard 

If machines aren't onboarded with Azure Arc 

 Although today it is possible to monitor non-Azure VMs even without Azure Arc, the use of this extension allows you to automatically detect and manage agents in VMs. Once integrated, Azure Arc-enabled servers will fit perfectly into existing Azure portal views along with virtual machines in Azure and Azure scale sets.

 

- Defender for Servers integrates with Microsoft Defender for Endpoint to leverage its [endpoint detection and response (EDR) capabilities](/microsoft-365/security/defender-endpoint/overview-endpoint-detection-response), and provides additional security features. The exact features you get depend on which Defender for Server plan you turn on.
- After turning on a plan, 


- 
- 
- After turning on a plan,ect GCP/AWS machines, and on-premises servers, you onboard them to Azure using [Azure Arc](../azure-arc/index.yml).- Defender for Cloud integrates with Azure Arc's Azure Connected Machine agent.
- Defender for Servers integrates with Microsoft Defender for Endpoint to leverage its [endpoint detection and response (EDR) capabilities](/microsoft-365/security/defender-endpoint/overview-endpoint-detection-response).
- In addition to these endpoint protection capabilities, Defender for Servers provides additional, extended detection and response (XDR) features to protect servers, apps, and networks.

Note that: 

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

By default Defender for Cloud creates a workspace per region in each subscription where it is enabled. If you have multiple subscriptions or need a different policy, you can override this behavior and deploy centralized workspaces per region.

Data from the Log Analytics agent streams events into a Log Analytics workspace.

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


## Review agent requirements

Defender for Server uses a number of agents.

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

Note that:

- If machines are running Microsoft Antimalware, also known as System Center Endpoint Protection (SCEP), the Windows extension automatically removes it from the machine.
- If you deploy on a machine that already has the Defender for Endpoint sensor running, after successful installing the sensor from Defender for Server, the extension will stop and disable the legacy sensor. The change is transparent and the machine’s protection history is preserved.

### Log Analytics agent/Azure Monitor agent

Defender for Cloud uses the Log Analytics agent/Azure Monitor agent to collect information from compute resources. It's used in Defender for Server as follows.

Feature |  Plan 1 | Plan 2 | Details
--- | --- | --- | ---
Fundamental CSPM capabilities:<br/><br/> - [Endpoint protection recommendations] (endpoint-protection-recommendations-technical.md)<br/> - [System updates recommendations](recommendations-reference.md#compute-recommendations)<br/> - [Operating system baseline recommendations](apply-security-baseline.md)  | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | If you're only using fundamental CSPM capabilities, without a plan, these features are available for Azure VMs only.<br/><br/> If you're using the Log Analytics agent, these capabilities rely on the agent.<br/><br/> The Azure Monitor Agent is used for endpoint protection recommendations. System updates use the built-in Azure policy definition or Azure Arc agent. OS baselines recommendation use the Azure Policy [guest configuration extension](../virtual-machines/extensions/guest-configuration.md)
Attack detection at the OS level and network layer (including fileless attack detection)** | :::image type="icon" source="./media/icons/yes-icon.png":::<br/> Provided by Defender for Endpoint | :::image type="icon" source="./media/icons/yes-icon.png":::<br/> Provided by Defender for Endpoint/Defender for Server capabilities.
File integrity monitoring** |  | :::image type="icon" source="./media/icons/yes-icon.png":::<br/> Provided by Defender for Endpoint/Defender for Server capabilities.
[Adaptive application controls](adaptive-application-controls.md) | | :::image type="icon" source="./media/icons/yes-icon.png":::


A few things to note:

- Qualys vulnerability assessment has its own extension. It can be automatically be deployed by Defender for Cloud to all Azure VMs and non-Azure machines connected via Azure Arc. 
- The Azure Policy Guest Configuration extension performs audit and configuration operations inside VMs.    - Defender for Cloud leverages this component to analyze operating system security baseline settings on Windows and Linux machines.
    - While Azure Arc-enabled servers and the guest configuration extension are free, additional costs might apply when using guest configuration policies outside Defender for Cloud scope.

## Agent provisioning


When you enable Defender for Servers Plan 1 or Plan 2 and then enable Defender for Endpoint unified integration, the Defender for Endpoint agent is automatically provisioned on all supported machines in the subscription.

- Data collected by the agent is stored in the Log Analytics workspace.
- You select the workspace (either default or customer) when you set up automatic provisioning of the agent. [Learn more](#plan-log-analytics-workspaces) about setting up a workspace.
- The Log Analytics agent/Azure Monitor agent is supported on Azure VMs/Azure Arc-enabled VMs
- [Supported Windows operating systems](agents-overview.md#supported-operating-systems) for the Log Analytics agent/Azure Monitor agent.
- [Supported Linux operating systems](agents-overview.md#linux) for the Log Analytics agent/Azure Monitor agent.

Note that if a VM already has the Log Analytics agent/Azure Monitoring agent installed as an Azure extension, Defender for Cloud uses the existing workspace connection, and doesn't override it.

## Permissions
To enable enhanced security features on a subscription, you must be assigned the role of Subscription Owner, Subscription Contributor, or Security Admin.


## Determine access and ownership

In complex enterprises, different teams manage different [security functions](/cloud-adoption-framework/organize/cloud-security). 

- **Team access**: Figuring out ownership for server and endpoint security and protection is critical. Ownership that's undefined, or hidden within organization silos typically causes friction that can lead to delays, insecure deployments, and difficulties in identifying, analyzing, and following threats across the enterprise. -     - Security leadership should pinpoint who which teams, roles, and individuals are responsible for making server security decisions.
    - Typically, a [central IT team](/cloud-adoption-framework/organize/central-it) and a [cloud infrastructure and endpoint security team](/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint) share responsibility.
    - Team members will need Azure access rights to manage and use Defender for Cloud.

## Scale your deployment 

When you enable Defender for Cloud subscription, the following occurs:

1. The microsoft.security resource provider is automatically registered on the subscription when you open Defender for Cloud in the subscription.
1. At the same time, Cloud Security Benchmark initiative that's responsible for creating security recommendations and calculation secure score is assigned to the subscription.

You then enable Defender for Servers Plan 1 or 2, and enable autoprovisioning.

## Scale considerations

There are some considerations around these steps as you scale your deployment

### Cloud Security Benchmark deployment

- In a scaled deployment you might want the Cloud Security Benchmark (formerly the Azure Security Benchmark) to be automatically assigned.
    - You can do this manually assigning the policy initiative to your (root) management group, instead of each subscription individually.
    - You can find the **Azure Security Benchmark** policy definition in [github](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Security%20Center/AzureSecurityCenter.json).
    - Then, the assignment is inherited for every existing and future subscription underneath the management group.
    - [Learn more](onboard-management-group.md) about using a built-in policy definition to register register a resource provider.


### Enable plans at scale

The same policy definition you used to register a resource provider can be used to  enable Defender for Server plans at scale. Note that:

- You can find the **Configure Defender for Servers to be enabled** policy definition in the Azure Policy > Policy Definitions, in the Azure portal.
- You can only enable two Defender for Server plans on each subscription, and not both at the same time.
- If you do want to use two plans at the same time, you need to divide your subscription into management groups. On each management group, you assign a policy to enable the plan on each underlying subscription.


### Agent autoprovisioning at scale

Autoprovisioning can be configured by assigning the built-in policy definitions to an Azure management group, so that underlying subscriptions are covered. The following table summarizes the definitions. 

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


## Next steps

After working through these planning steps, you can start deployment:

- [Connect non-Azure machines](quickstart-onboard-aws) to Azure.
- [Connect AWS accounts](quickstart-onboard-aws.md) to Defender for Cloud.
- [Connect GCP projects](quickstart-onboard-gcp.md) to Defender for Cloud.
- [Enable Defender for Servers](enable-enhanced-security.md).
- When you move from the default workspace to a custom workspace, monitored machines can be automatically reconfigured.
        - When you move between custom workspaces, or from custom to default, the change isn't applied to existing machines.