---
title: Use Azure Copilot Resiliency Agent (preview) in Infrastructure Resiliency Manager
description: Use Azure Copilot Resiliency Agent for application design, discovery, posture improvement, recovery readiness, and data resiliency with Azure Backup.
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
ms.date: 11/10/2026
ms.topic: how-to
ms.service: resiliency
#customer intent: As a cloud administrator, I want to use Azure Copilot Resiliency Agent to design resilient applications and improve the zone resilience of existing workloads.
---

# Use Azure Copilot Resiliency Agent (preview) in Infrastructure Resiliency Manager

Azure Copilot Resiliency Agent (preview) provides an AI-assisted interface to Infrastructure Resiliency Manager and data resiliency workflows in Azure Copilot. Use natural language to design resilient applications, discover application resources, understand resilience posture, remediate gaps, prepare for recovery, and manage backups.

Use the agent across three customer journeys:

- **Start Resilient** helps you build resilience into applications before deployment.
- **Get Resilient** helps you assess and improve workloads that are already running in Azure.
- **Stay Resilient** helps you reassess applications, prepare recovery orchestration plans, and configure drills to validate readiness.

For design and IaC tasks in a local repository, you can also use a focused set of capabilities in [GitHub Copilot (limited preview)](#use-resiliency-agent-in-github-copilot-limited-preview).

## Prerequisites

- An Azure subscription.
- Access to the Azure resources you want the agent to assess or manage.
- Access to Azure Copilot and its agents. Administrators can [manage access to Azure Copilot and agents](/azure/copilot/manage-access).

## Open the Resiliency Agent

You can open the agent from Azure Copilot or from the Resiliency experience. For backup tasks, you can also select contextual nudges on backup-related portal pages, such as vaults and backup jobs. These entry points open the Resiliency Agent with a relevant request. For details, see [Open the Resiliency Agent for backup tasks](tutorial-manage-data-using-copilot.md#open-the-resiliency-agent).

### Open from Azure Copilot

1. In the [Azure portal](https://portal.azure.com/), select the **Copilot** icon in the portal header.
2. In the agent selector at the top of the Copilot pane, select **Resiliency**.
3. Select a suggested prompt or enter your own question.

### Open from Resiliency

1. In **Resiliency**, select **Overview** in the left menu.
2. Choose an entry point:
   - On the **Get started** tab, use the right **Top Action** card. The top actions vary based on your current context and stage of your Resiliency journey.
   - On the **Resource resiliency** or **Service group resiliency** tab, use a card in **Top actions** for the workflow you want to start.
3. Select **Copilot Action** on the card. The Azure Copilot pane opens with the Resiliency Agent selected and a relevant prompt.

For an overview of these tabs, see [View resilience posture at scale](infrastructure-resiliency-manager-overview.md#view-resilience-posture-at-scale).

The agent maintains context across turns, so you can move from assessment to remediation without repeating the application context.

## Start Resilient for new applications

Provide application context in any of the following ways:

- Describe your proposed application in natural language.
- Upload an architecture diagram.
- Upload existing infrastructure-as-code (IaC) templates for review.

The agent analyzes the architecture, identifies relevant resilience practices, and generates recommendations tailored to your resources. Ask it to generate Bicep, Azure Resource Manager (ARM) JSON, or Terraform templates with recommended resilience configurations enabled. Review the proposed architecture and validate the generated templates before deployment.

Sample prompts include:

- *My app has a VM, a PostgreSQL database, and a load balancer. Help me start my resilient journey.*
- *I'm building an application with AKS, Redis, Storage, and Cosmos DB. What should I do to make it resilient?*
- *Generate a Bicep template for a zone-resilient VM setup.*
- *Create Bicep templates for a resilient architecture with VMs, AKS, and Storage.*
- *Review the uploaded architecture diagram and generate resilient Terraform for this application.*
- *Review my existing IaC templates and recommend zone resilience improvements.*

### Use Resiliency Agent in GitHub Copilot (limited preview)

Use the **Azure Resiliency Agent** plugin in GitHub Copilot in Visual Studio Code or GitHub Copilot CLI to work with architecture and IaC in your local repository. You can:

- Ask questions about Azure resiliency and assess a described architecture or approved local architecture files.
- Generate zone-resilient Bicep, ARM JSON, or Terraform.
- Review and correct existing IaC and related local files.

The plugin connects to the same hosted Azure Resiliency Agent used by Azure Copilot, but provides a focused design and IaC experience rather than all portal management capabilities. When a request needs local files, review and approve each file before you share it with the hosted agent.

For prerequisites, installation, and sample prompts, see [Use Azure Resiliency Agent in GitHub Copilot](/azure/copilot/resiliency-agent#use-azure-resiliency-agent-in-github-copilot-limited-preview).

## Get Resilient for existing applications

Use the agent to assess and improve the zone resilience of workloads that are already running in Azure.

### Discover application resources and dependencies (preview)

If you don't know which resources belong to an application, use automatic application discovery. The agent uses resource metadata and relationships to propose application boundaries, including shared resources and a catch-all boundary for resources it couldn't associate with an application. Review these suggestions before using them to define service groups; they might not match your organization's application boundaries.

To discover applications:

1. Provide the complete resource ID of a subscription or resource group, such as `/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>`.
2. Choose **Automatic application discovery**, and select an existing discovery agent or ask the agent to create one. A discovery agent is an Azure resource that reads the scope through a system-assigned managed identity.
3. Ensure that the discovery agent's managed identity has **Reader** access on the subscription or resource group. Assign the role manually, or ask the agent to assign it after confirmation if you have role-assignment permissions.
4. Review the proposed boundaries, grouping explanations, resource counts, shared resources, and catch-all resources.
5. Ask the agent to create service groups from the reviewed boundaries or add resources to existing service groups. Confirm the proposed changes before they're applied.

The discovery agent supports only system-assigned managed identities. Discovery scopes must be complete subscriptions or resource groups; management groups, individual resources, partial names, tags, resource types, and locations aren't supported as discovery scopes. You can alternatively identify service-group resources by Azure Resource Graph criteria or a list of resource IDs.

If you want the agent to assign **Reader**, you need permission to create role assignments, such as **User Access Administrator** or **Role Based Access Control Administrator**. Creating service groups and adding members also requires the [service-group permissions](goals-recommendations-support-matrix.md#rbac-requirements-for-goals-and-recommendations).

Sample prompts include:

- *Discover all application resources in /subscriptions/\<subscription-id\>.*
- *Discover all application resources in /subscriptions/\<subscription-id\>/resourceGroups/\<resource-group-name\>.*
- *Create service groups for the discovered applications.*

When you request the same scope in a new conversation, the agent can offer previous discovery results instead of rerunning discovery. Resource discovery doesn't determine the recovery order for a recovery plan; you must specify that order.

### Check resilience and prerequisites

Ask whether an individual resource or an entire service group is zone-resilient. The agent returns the current resilience status and relevant configuration details. It can also identify blockers such as regional limitations, permissions, and configuration dependencies.

Sample prompts include:

- *Is my VM zone-resilient?*
- *Get the zone resilience posture of my service group.*
- *What are the prerequisites to make my VM zone-resilient?*

### Enable resilience and generate scripts

For resource types that support in-place conversion, the agent can enable zone resilience after you confirm the change. For resources that require redeployment, such as virtual machines, the agent provides migration guidance and scripts instead of changing the resource.

The agent can generate enablement scripts in Azure PowerShell, Azure CLI, Bicep, Terraform, and Azure Resource Manager template formats.

Sample prompts include:

- *Enable zone resilience for my PostgreSQL server.*
- *How do I make my storage account zone-redundant?*
- *Give me scripts to enable zone resilience for my resources.*

> [!IMPORTANT]
> Review and validate all recommendations, scripts, templates, and proposed changes before you use them in a production environment. Resource-changing operations require your confirmation.

### Organize resources and track goals

The agent can create service groups, add resources to them, set zone resilience goals, check goal compliance, exclude resources, and refresh compliance after configuration changes.

For an end-to-end workflow, ask the agent to:

1. Create a service group for your application.
2. Set zone resilience goals.
3. Check the resilience posture.
4. Fix identified problems or generate scripts for remediation.

For more information about these workflows, see [Assign goals and view resilience posture](goals-recommendations-assign-goals-view-posture.md) and [Review recommendations](goals-recommendations-review-recommendations.md).

## Stay resilient for ongoing validation and recovery readiness

Use the agent to assess applications as they change, prepare recovery orchestration, and configure zone-down drills before an outage.

### Prerequisites for drills and recovery plans

- Enroll the service group in a [usage plan](infrastructure-resiliency-manager-pricing.md#enroll-a-service-group-in-a-usage-plan) before using drills or recovery plans.
- Ensure that you have the required [drill roles and permissions](availability-zone-down-drills-support-matrix.md#required-roles-and-permissions) and [recovery-plan roles](recovery-orchestration-plan-support-matrix.md#role-requirements).
- Before executing a drill, configure a service-level indicator (SLI) or an Azure Monitor health model. The agent can list existing options and attach your selection, but can't create them.
- If drill resources require manual failover, such as Azure Site Recovery-protected VMs, prepare a ready recovery plan.
- Use existing Azure Automation runbooks for custom drill faults and recovery group pre-scripts or post-scripts. The agent doesn't create runbooks.

### Reassess your application

Ask the agent to run a resilience assessment for a service group. The assessment summarizes resource counts and zone resilience, explains risks, and recommends actions for observability, drills, and recovery-plan gaps. Rerun it after application changes and after drills.

Sample prompts include:

- *Run a resilience assessment for my service group.*
- *What should I fix first?*
- *Download the assessment report.*

You can download the report as Markdown. The service doesn't save reports, and it doesn't support comparison with previous reports. Retain downloaded reports externally if you need a historical record.

### Prepare a recovery orchestration plan

Ask the agent to create a recovery plan, explain resource protection and inclusion states, and investigate resources that need attention. You can organize resources into groups, specify recovery order, add manual steps and pre-scripts or post-scripts from existing runbooks, and check readiness.

A recovery plan orchestrates recovery; it doesn't protect resources. In the recovery-plan workflow, the agent can direct you to the appropriate page to enable protection such as Azure Site Recovery, but it doesn't enable it for you. For Azure VM backup, use the separate [guided backup experience](tutorial-manage-data-using-copilot.md#configure-backup-for-azure-vms). The agent doesn't infer dependencies or choose the recovery order.

Sample prompts include:

- *Create a recovery plan for my service group.*
- *Which resources in my recovery plan need attention?*
- *Add a pre-script to the first group in my recovery plan.*
- *Is my recovery plan ready?*

For configuration details, see [Create and configure a recovery orchestration plan](recovery-orchestration-plan-create-configure.md). Perform [failover and reprotect operations](recovery-orchestration-plan-execute.md) from the portal, not through the agent.

### Prepare and validate a zone-down drill

Ask the agent to create a drill with suggested defaults, explain included and excluded resources, and configure native faults or custom faults from existing runbooks. The agent can help resolve onboarding and permission blockers, attach an existing SLI or health model that you select, and check readiness. If manual-failover resources need a recovery plan, it can offer to help create one.

Sample prompts include:

- *Create a zone down drill for my service group.*
- *Why are some resources excluded from my drill?*
- *Attach a health model to my drill.*
- *Why is my drill not ready?*

Review the proposed configuration and confirm resource-changing operations. When readiness checks pass, [execute the drill in the Azure portal](availability-zone-down-drill-execute.md). The agent doesn't execute drills. After execution, review the results and rerun the resilience assessment to identify further improvements.

## Manage data resiliency with Azure Backup

Use the Resiliency Agent to manage backups as well as infrastructure resilience. You can review your protection estate, configure backup for Azure VMs with guided vault and policy creation or selection, improve vault security, monitor recovery points and jobs, and troubleshoot backup failures.

Open the agent from Azure Copilot, or select a contextual nudge on a backup-related portal page. Try prompts such as *Help me configure backup for my VM*, *Show the security level of all my vaults*, or *Show job failures for this vault*.

For supported scenarios, sample prompts, and guided workflows, see [Manage data resiliency using Azure Copilot Resiliency Agent](tutorial-manage-data-using-copilot.md). Azure Backup capabilities are also available through [Azure MCP Server tools](/azure/developer/azure-mcp-server/tools/azure-backup?tabs=azure-mcp-cli) for MCP-compatible clients such as GitHub Copilot.

## Known limitations

- Infrastructure Resiliency Manager workflows in the agent are optimized for zone resilience. Those workflows don't currently support regional resilience and other infrastructure resilience dimensions. The [backup guide](tutorial-manage-data-using-copilot.md) describes data resiliency capabilities.
- The GitHub Copilot plugin provides focused design and IaC capabilities, not the full Azure portal management experience.
- Application discovery proposes boundaries from readable metadata and relationships; it doesn't establish recovery dependencies or recovery order.
- The agent doesn't execute drills, failover, or reprotect operations, enable Azure Site Recovery protection, or create SLIs, health models, or runbooks. You can configure Azure VM backup through the separate guided backup experience.
- Operations can take longer for large service groups or complex application architectures.
- Results depend on available resource metadata, the signed-in user's permissions, and, for automatic application discovery, the discovery agent's managed identity permissions.
- AI-generated output can be incomplete or inaccurate and isn't authoritative.

## Related content

- [Transparency frequently asked questions for Azure Copilot Resiliency Agent](resiliency-agent-transparency.md)
- [Assign goals and view resilience posture](goals-recommendations-assign-goals-view-posture.md)
- [Review recommendations](goals-recommendations-review-recommendations.md)
