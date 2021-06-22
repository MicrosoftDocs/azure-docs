---
title: How to plan and deploy Azure Arc enabled servers
description: Learn how to enable a large number of machines to Azure Arc enabled servers to simplify configuration of essential security, management, and monitoring capabilities in Azure.
ms.date: 04/21/2021
ms.topic: conceptual
---

# Plan and deploy Arc enabled servers

Deployment of an IT infrastructure service or business application is a challenge for any company. In order to execute it well and avoid any unwelcome surprises and unplanned costs, you need to thoroughly plan for it to ensure that you're as ready as possible. To plan for deploying Azure Arc enabled servers at any scale, it should cover the design and deployment criteria that needs to be met in order to successfully complete the tasks.

For the deployment to proceed smoothly, your plan should establish a clear understanding of:

* Roles and responsibilities.
* Inventory of physical servers or virtual machines to verify they meet network and system requirements.
* The skill set and training required to enable successful deployment and on-going management.
* Acceptance criteria and how you track its success.
* Tools or methods to be used to automate the deployments.
* Identified risks and mitigation plans to avoid delays, disruptions, etc.
* How to avoid disruption during deployment.
* What's the escalation path when a significant issue occurs?

The purpose of this article is to ensure you are prepared for a successful deployment of Azure Arc enabled servers across multiple production physical servers or virtual machines in your environment.

## Prerequisites

* Your machines run a [supported operating system](agent-overview.md#supported-operating-systems) for the Connected Machine agent.
* Your machines have connectivity from your on-premises network or other cloud environment to resources in Azure, either directly or through a proxy server.
* To install and configure the Arc enabled servers Connected Machine agent, an account with elevated (that is, an administrator or as root) privileges on the machines.
* To onboard machines, you are a member of the **Azure Connected Machine Onboarding** role.
* To read, modify, and delete a machine, you are a member of the **Azure Connected Machine Resource Administrator** role.

## Pilot

Before deploying to all production machines, start by evaluating this deployment process before adopting it broadly in your environment. For a pilot, identify a representative sampling of machines that aren't critical to your companies ability to conduct business. You'll want to be sure to allow enough time to run the pilot and assess its impact: we recommend a minimum of 30 days.

Establish a formal plan describing the scope and details of the pilot. The following is a sample of what a plan should include to help get you started.

* Objectives - Describes the business and technical drivers that led to the decision that a pilot is necessary.
* Selection criteria - Specifies the criteria used to select which aspects of the solution will be demonstrated via a pilot.
* Scope - Describes the scope of the pilot, which includes but not limited to solution components, anticipated schedule, duration of the pilot, and number of machines to target.
* Success criteria and metrics - Define the pilot's success criteria and specific measures used to determine level of success.
* Training plan - Describes the plan for training system engineers, administrators, etc. who are new to Azure and it services during the pilot.
* Transition plan - Describes the strategy and criteria used to guide transition from pilot to production.
* Rollback - Describes the procedures for rolling back a pilot to pre-deployment state.
* Risks - List all identified risks for conducting the pilot and associated with production deployment.

## Phase 1: Build a foundation

In this phase, system engineers or administrators enable the core features in their organizations Azure subscription to start the foundation before enabling your machines for management by Arc enabled servers and other Azure services.

|Task |Detail |Duration |
|-----|-------|---------|
| [Create a resource group](../../azure-resource-manager/management/manage-resource-groups-portal.md#create-resource-groups) | A dedicated resource group to include only Arc enabled servers and centralize management and monitoring of these resources. | One hour |
| Apply [Tags](../../azure-resource-manager/management/tag-resources.md) to help organize machines. | Evaluate and develop an IT-aligned [tagging strategy](/azure/cloud-adoption-framework/decision-guides/resource-tagging/) that can help reduce the complexity of managing your Arc enabled servers and simplify making management decisions. | One day |
| Design and deploy [Azure Monitor Logs](../../azure-monitor/logs/data-platform-logs.md) | Evaluate [design and deployment considerations](../../azure-monitor/logs/design-logs-deployment.md) to determine if your organization should use an existing or implement another Log Analytics workspace to store collected log data from hybrid servers and machines.<sup>1</sup> | One day |
| [Develop an Azure Policy](../../governance/policy/overview.md) governance plan | Determine how you will implement governance of hybrid servers and machines at the subscription or resource group scope with Azure Policy. | One day |
| Configure [Role based access control](../../role-based-access-control/overview.md) (RBAC) | Develop an access plan to control who has access to manage Arc enabled servers and ability to view their data from other Azure services and solutions. | One day |
| Identify machines with Log Analytics agent already installed | Run the following log query in [Log Analytics](../../azure-monitor/logs/log-analytics-overview.md) to support conversion of existing Log Analytics agent deployments to extension-managed agent:<br> Heartbeat <br> &#124; where TimeGenerated > ago(30d) <br> &#124; where ResourceType == "machines" and (ComputerEnvironment == "Non-Azure") <br> &#124; summarize by Computer, ResourceProvider, ResourceType, ComputerEnvironment | One hour |

<sup>1</sup> An important consideration as part of evaluating your Log Analytics workspace design, is integration with Azure Automation in support of its Update Management and Change Tracking and Inventory feature, as well as Azure Security Center and Azure Sentinel. If your organization already has an Automation account and enabled its management features linked with a Log Analytics workspace, evaluate whether you can centralize and streamline management operations, as well as minimize cost, by using those existing resources versus creating a duplicate account, workspace, etc.

## Phase 2: Deploy Arc enabled servers

Next, we add to the foundation laid in phase 1 by preparing for and deploying the Arc enabled servers Connected Machine agent.

|Task |Detail |Duration |
|-----|-------|---------|
| Download the pre-defined installation script | Review and customize the pre-defined installation script for at-scale deployment of the Connected Machine agent to support your automated deployment requirements.<br><br> Sample at-scale onboarding resources:<br><br> <ul><li> [At-scale basic deployment script](onboard-service-principal.md)</ul></li> <ul><li>[At-scale onboarding VMware vSphere Windows Server VMs](https://github.com/microsoft/azure_arc/blob/main/docs/azure_arc_jumpstart/azure_arc_servers/scaled_deployment/vmware_scaled_powercli_win/_index.md)</ul></li> <ul><li>[At-scale onboarding VMware vSphere Linux VMs](https://github.com/microsoft/azure_arc/blob/main/docs/azure_arc_jumpstart/azure_arc_servers/scaled_deployment/vmware_scaled_powercli_linux/_index.md)</ul></li> <ul><li>[At-scale onboarding AWS EC2 instances using Ansible](https://github.com/microsoft/azure_arc/blob/main/docs/azure_arc_jumpstart/azure_arc_servers/scaled_deployment/aws_scaled_ansible/_index.md)</ul></li> <ul><li>[At-scale deployment using PowerShell remoting](./onboard-powershell.md) (Windows only)</ul></li>| One or more days depending on requirements, organizational processes (for example, Change and Release Management), and automation method used. |
| [Create service principal](onboard-service-principal.md#create-a-service-principal-for-onboarding-at-scale) |Create a service principal to connect machines non-interactively using Azure PowerShell or from the portal.| One hour |
| Deploy the Connected Machine agent to your target servers and machines |Use your automation tool to deploy the scripts to your servers and connect them to Azure.| One or more days depending on your release plan and if following a phased rollout. |

## Phase 3: Manage and operate

Phase 3 sees administrators or system engineers enable automation of manual tasks to manage and operate the Connected Machine agent and the machine during their lifecycle.

|Task |Detail |Duration |
|-----|-------|---------|
|Create a Resource Health alert |If a server stops sending heartbeats to Azure for longer than 15 minutes, it can mean that it is offline, the network connection has been blocked, or the agent is not running. Develop a plan for how you’ll respond and investigate these incidents and use [Resource Health alerts](../..//service-health/resource-health-alert-monitor-guide.md) to get notified when they start.<br><br> Specify the following when configuring the alert:<br> **Resource type** = **Azure Arc enabled servers**<br> **Current resource status** = **Unavailable**<br> **Previous resource status** = **Available** | One hour |
|Create an Azure Advisor alert | For the best experience and most recent security and bug fixes, we recommend keeping the Azure Arc enabled servers agent up to date. Out-of-date agents will be identified with an [Azure Advisor alert](../../advisor/advisor-alerts-portal.md).<br><br> Specify the following when configuring the alert:<br> **Recommendation type** = **Upgrade to the latest version of the Azure Connected Machine Agent** | One hour |
|[Assign Azure policies](../../governance/policy/assign-policy-portal.md) to your subscription or resource group scope |Assign the **Enable Azure Monitor for VMs** [policy](../../azure-monitor/vm/vminsights-enable-policy.md) (and others that meet your needs) to the subscription or resource group scope. Azure Policy allows you to assign policy definitions that install the required agents for VM insights across your environment.| Varies |
|[Enable Update Management for your Arc enabled servers](../../automation/update-management/enable-from-automation-account.md) |Configure Update Management in Azure Automation to manage operating system updates for your Windows and Linux virtual machines registered with Arc enabled servers. | 15 minutes |

## Next steps

* Troubleshooting information can be found in the [Troubleshoot Connected Machine agent guide](troubleshoot-agent-onboard.md).

* Learn how to simplify deployment with other Azure services like Azure Automation [State Configuration](../../automation/automation-dsc-overview.md) and other supported [Azure VM extensions](manage-vm-extensions.md).