---
title: Manage data resiliency using Azure Copilot Resiliency Agent (preview)
description: Use Azure Copilot Resiliency Agent to configure VM backup, review protection and security posture, monitor backups, and manage vaults.
ms.topic: how-to
ms.date: 11/10/2026
ms.service: resiliency
ms.custom:
  - ignite-2024
author: AbhishekMallick-MS
ms.author: v-mallicka
#customer intent: As a backup administrator, I want to use Resiliency Agent to configure backups and manage data protection through guided experiences.
---

# Manage data resilience by using Azure Copilot Resiliency Agent (preview)

Azure Copilot Resiliency Agent (preview) helps you manage data protection with Azure Backup by using natural language and guided experiences. Use the agent to understand your protection estate, configure backup for Azure virtual machines (VMs), improve vault security, monitor backups, and troubleshoot failures.

The capabilities previously available through Resiliency in Azure Copilot chat are now available through the **Resiliency** agent. This article describes how to open the agent and use its data resiliency capabilities. For application design, infrastructure resilience, and recovery readiness, see [Use Azure Copilot Resiliency Agent in Infrastructure Resiliency Manager](goals-recommendations-use-agent.md).

[!INCLUDE [Resiliency rebranding announcement updates.](../../includes/resiliency-announcement.md)]

## Prerequisites

- An Azure subscription.
- Access to Azure Copilot and its agents. Administrators can [manage access to Azure Copilot and agents](/azure/copilot/manage-access).
- Permissions to view or manage the resources, vaults, and backup policies involved in your request. The agent doesn't replace Azure role-based access control (Azure RBAC). For backup permissions, see [Manage Azure Backup using Azure RBAC](../backup/backup-rbac-rs-vault.md).

## Open the Resiliency Agent

You can open the agent from Azure Copilot or from contextual entry points, also called nudges, on backup-related pages in the Azure portal.

### Open from Azure Copilot

1. In the [Azure portal](https://portal.azure.com/), select the **Copilot** icon in the portal header.
2. In the agent selector at the top of the Copilot pane, select **Resiliency**.
3. Select a suggested prompt or enter your own request. Include the subscription, resource group, vault, or resource that you want to work with.

### Open from a backup-related page

1. In the Azure portal, open a backup-related page, such as a vault, backup job, or vault creation page.
2. Select an available contextual nudge for the task you want to perform. Examples include **Increase security level of this vault**, **Show job failures for this vault**, **Help me create a vault**, and **Help me copy an existing vault settings**.
3. The Copilot pane opens with the **Resiliency** agent and a request relevant to the page. Review the resource context and continue the guided experience.

Available nudges depend on the page and resource context. If a nudge isn't available, open the agent from Azure Copilot and describe the task.

<a id="sample-prompts"></a>

## Scenarios and sample prompts

Use the following prompts as starting points. Replace resource names and scopes with your own values. The agent might ask you to select resources or provide more information before continuing.

| Scenario | Sample prompts |
| --- | --- |
| Understand the protection estate | *Show the resiliency estate across all my subscriptions.* <br> *Show the data sources that aren't protected in East US.* <br> *Show the data sources protected only by Azure Site Recovery.* |
| Configure VM backup | *Help me configure backup for my VM.* <br> *Enable backup for VM app-vm in resource group production-rg using an existing vault and policy.* <br> *Help me create a vault and a backup policy to protect my VM.* |
| Review and improve security posture | *Show the security level of all my vaults.* <br> *Which vaults have a Poor security level?* <br> *Help me increase the security level of vault production-vault.* |
| Monitor recovery points and backup jobs | *Which data sources don't have recovery points in the last seven days?* <br> *How many backup jobs failed in the last 12 hours?* <br> *Show job failures for this vault.* |
| Trigger or retry backups | *Help me trigger a backup for resources without recent recovery points.* <br> *Retrigger backup for failed backup jobs in the last 24 hours.* |
| Troubleshoot backup failures | *Help me troubleshoot this failed backup job.* <br> *Explain this backup error code and recommend next steps.* |
| Find resources to protect in a vault | *Show me the resources that can be protected in this vault.* |
| Create a Backup vault | *Help me create a Backup vault.* |
| Copy Backup vault settings | *Help me copy an existing Backup vault's settings to a new vault in another region.* |
| Delete a vault | *Help me delete this vault.* |
| Learn about backup capabilities | *How can I improve the security of my backups?* <br> *Explain soft delete, immutability, and multi-user authorization for backup vaults.* |

Review the agent's recommendations before applying changes. Depending on the scenario, the agent guides you through portal pages or provides commands or a downloadable script for you to review and run. A recommendation or generated script doesn't mean that a change has been applied.

<a id="view-the-resiliency-real-estate-across-all-the-subscriptions"></a>

## View the backup configuration status across all the subscriptions

Ask the agent to summarize protection across subscriptions, or narrow the request to a region or other scope. For example:

- *Show the backup configuration summary across all my subscriptions.*
- *Show the data sources that aren't protected in East US.*

The agent summarizes resource protection status and can provide an Azure Resource Graph (ARG) query for more detail. Run the query in Azure Resource Graph Explorer to inspect the results or export them as a CSV file.

## Configure backup for Azure VMs

Use the agent's guided experience to configure backup for an Azure VM, including selecting or creating the vault and backup policy.

1. [Open the Resiliency Agent](#open-the-resiliency-agent) and enter a request such as *Help me configure backup for my VM.*
2. Identify the VM to protect. Provide its resource context or select the VM when prompted, and review its current protection status.
3. Choose an existing **Recovery Services vault**, or follow the guided experience to create one. Review the proposed subscription, resource group, region, and vault settings.
4. Choose an existing backup policy, or follow the guided experience to create one. Review the backup schedule and retention settings to ensure that they meet your recovery requirements.
5. Review the selected VM, vault, and policy, and confirm the backup configuration through the guided experience.
6. Check the VM's backup status and the resulting backup job in the portal.

> [!NOTE]
> Azure VM backup uses a **Recovery Services vault**, not a **Backup vault**. The vault must meet the Azure VM backup requirements, including region compatibility. For supported configurations and limitations, see the [Azure VM backup support matrix](../backup/backup-support-matrix-iaas.md).

Sample prompts include:

- *Configure backup for VM app-vm in resource group production-rg.*
- *Use an existing Recovery Services vault and backup policy for this VM.*
- *Help me create a Recovery Services vault and a new backup policy for this VM.*

For the underlying portal workflow, see [Back up an Azure virtual machine](../backup/quick-backup-vm-portal.md).

## Enhance protection for the resources

For Azure VMs, ask the agent to review current protection and help you enhance it. Select the VM when prompted and review the solutions that already protect it.

To add backup, continue with the [guided VM backup experience](#configure-backup-for-azure-vms). For other protection solutions, follow the agent's guidance to the relevant configuration page and complete the required steps there.

<a id="view-the-security-level"></a>
<a id="increase-the-security-configuration"></a>
<a id="increase-security-level-of-recovery-service-vault-and-backup-vault"></a>

## Review and improve vault security

Ask the agent to summarize the security posture across vaults or to help improve a selected vault's security level.

Sample prompts include:

- *Show the security level of all my vaults.*
- *Which vaults have a Poor security level?*
- *Help me increase the security level of vault production-vault.*

To work from a vault page:

1. Open a **Recovery Services vault** or **Backup vault** and select **Increase security level of this vault**, if available. Alternatively, open the agent and identify the vault in your request.
2. Review the current security level, choose the target level, and review the recommended changes.
3. Follow the portal guidance or review the provided PowerShell or Azure CLI commands.
4. After applying the changes, check the vault properties to verify the updated settings.

Recommendations can include [soft delete](../backup/backup-azure-enhanced-soft-delete-configure-manage.md), [immutability](../backup/backup-azure-immutable-vault-concept.md), and [multi-user authorization](../backup/multi-user-authorization-concept.md). Some settings require additional manual steps or authorization.

> [!IMPORTANT]
> Review the effect of security changes before confirming them. For example, locking vault immutability is irreversible. For details about how settings affect a vault's rating, see [Security levels](security-levels-concept.md).

<a id="analyze-job-failures-for-recovery-service-vault-and-backup-vault"></a>

## Monitor recovery points and backup jobs

Ask the agent to identify gaps in recent recovery points or summarize failed jobs for a time range.

Sample prompts include:

- *Which data sources don't have recovery points in the last seven days?*
- *How many backup jobs failed in the last 12 hours?*
- *Show job failures for this vault.*

Review the affected resources and jobs, and use any provided ARG query to investigate further. You can also start from a vault's **Show job failures for this vault** nudge, select an affected resource, and open the backup item or job details.

### Trigger backup for resources

After identifying resources without recent recovery points or jobs that failed, ask the agent to help trigger an on-demand backup or retry the affected backups.

For example, enter *Retrigger backup for failed backup jobs in the last 24 hours.* Review the target resources and any generated PowerShell script before downloading and running it. Then check the resulting backup jobs in the portal to verify their status.

<a id="troubleshoot-error-codes-for-recovery-service-vaults-and-backup-vaults"></a>

## Troubleshoot error codes for Recovery Services vaults and Backup vaults

Use the agent to understand a failed backup job and get recommended remediation steps.

1. Open the vault and select **Backup jobs**.
2. Select the failed job to open its details and identify the error code.
3. Use the available troubleshooting nudge, or open the agent and provide the job context and error code.
4. Review the explanation and recommended actions. Follow the guided steps or open the affected backup item to resolve the issue.
5. If appropriate, retry the backup and check the new job's status.

## Configure protection for resources in Recovery Services vault and Backup vault

From a vault, select *Show me the resources that can be protected in this vault.* Select an unprotected resource and follow the guidance to configure backup with a supported policy.

The vault type, workload, and selected policy determine the configuration steps. For Azure VMs, use the [guided VM backup experience](#configure-backup-for-azure-vms). For other workloads, complete the workload-specific configuration on the relevant portal page. For more information, see [Configure protection for data sources](tutorial-configure-protection-datasource.md).

<a id="create-a--backup-vault-using-resiliency-copilot"></a>

## Create a Backup vault

Use the agent to guide you through Backup vault creation and review settings before deployment.

1. Go to **Resiliency** > **Manage** > **Vaults**, and select **+ Vault**.
2. Select **Backup vault** as the vault type and continue to the creation page.
3. Select **Help me create a vault** to open the agent.
4. Review the suggested subscription, resource group, name, and region. Change any values that don't meet your requirements.
5. Review storage redundancy and the applicable security, managed identity, encryption, and restore settings. Consider the recommendations for cross-region restore and immutability.
6. Review the configuration on **Review + create**, and select **Create** when you're ready.

This workflow creates a Backup vault for workloads that use that vault type. To protect an Azure VM, use a Recovery Services vault as described in [Configure backup for Azure VMs](#configure-backup-for-azure-vms).

<a id="copy-a-backup-vault-to-another-region-using-resiliency-copilot"></a>

## Copy a Backup vault to another region

Use the agent to copy an existing Backup vault's configuration when creating a new vault in another region.

1. Open the Backup vault creation page and select **Help me copy an existing vault settings**.
2. Select the source vault and review the settings to copy.
3. Specify the new vault name and target region, and review the proposed configuration.
4. On **Review + create**, review and create the new vault.
6. After creation, configure settings that aren't copied, such as monitoring settings and multi-user authorization.
Copying vault settings doesn't copy backup data or move protected resources to the new vault.

<a id="delete-recovery-services-vault-and-backup-vault-using-copilot"></a>

## Delete Recovery Services vault and Backup vault

Ask the agent *Help me delete this vault* from the vault context to review dependencies and the steps required for deletion.

The agent helps identify backup and replicated items, private endpoints, and security settings that affect deletion. Address the reported dependencies and review any generated PowerShell script before running it.

> [!WARNING]
> Deleting backup data can prevent recovery. Review retention requirements and the effects of disabling protection or changing security settings before proceeding. Some security settings can't be disabled, such as always-on soft delete or locked immutability.

For requirements and supported deletion procedures, see [Delete a Recovery Services vault](../backup/backup-azure-delete-vault.md) and [Delete a Backup vault](../backup/create-manage-backup-vault.md#delete-a-backup-vault).

## Use Azure Backup capabilities through Azure MCP Server

**Azure MCP Server** exposes Azure Backup capabilities as tools. You can invoke these tools from an MCP-compatible client, such as **GitHub Copilot** in Visual Studio Code, instead of using the portal's guided experience.

Available tools include checking backup status, finding resources without backup policies, retrieving backup job information, and configuring vault security settings. For setup instructions, the supported tool list, required parameters, and sample prompts, see [Azure MCP Server tools for Azure Backup](/azure/developer/azure-mcp-server/tools/azure-backup?tabs=azure-mcp-cli).

Example requests include:

- *Check the backup status of this VM resource ID in East US.*
- *List resources in my subscription that aren't protected by a backup policy.*
- *Get backup job information for this vault.*

The MCP tool surface and the portal agent's guided workflows aren't identical. Check the tool reference for supported operations and provide the required resource identifiers and scope. Review changes before allowing a client to invoke tools that modify resources.

## Related content

- [Use Azure Copilot Resiliency Agent in Infrastructure Resiliency Manager](goals-recommendations-use-agent.md)
- [Understand the protection estate](quick-understand-protection-estate.md)
- [Review security posture](tutorial-review-security-posture.md)
- [Monitor jobs](tutorial-monitor-operate.md)
