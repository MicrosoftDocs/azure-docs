---
title: Migrate Azure Arc-enabled server to Azure
description: Learn how to migrate your Azure Arc-enabled servers running on-premises or other cloud environment to Azure.
ms.date: 07/16/2021
ms.topic: conceptual
---

# Migrate your on-premises or other cloud Arc-enabled server to Azure

This article is intended to help you plan and successfully migrate your on-premises server or virtual machine managed by Azure Arc-enabled servers to Azure. By following these steps, you are able to transition management from Arc-enabled servers based on the supported VM extensions installed and Azure services based on its Arc server resource identity.

Before performing these steps, review the Azure Migrate [Prepare on-premises machines for migration to Azure](../../migrate/prepare-for-migration.md) article to understand requirements how to prepare for using Azure Migrate.

In this article, you:

* Inventory Azure Arc-enabled servers supported VM extensions installed.
* Uninstall all VM extensions from the Arc-enabled server.
* Identify Azure services configured to authenticate with your Arc-enabled server-managed identity and prepare to update those services to use the Azure VM identity after migration.
* Review Azure role-based access control (Azure RBAC) access rights granted to the Arc-enabled server resource to maintain who has access to the resource after it has been migrated to an Azure VM. 
* Delete the Arc-enabled server resource identity from Azure and remove the Arc-enabled server agent.
* Install the Azure guest agent.
* Migrate the server or VM to Azure.

## Step 1: Inventory and remove VM extensions

To inventory the VM extensions installed on your Arc-enabled server, you can list them using the Azure CLI or with Azure PowerShell.

With Azure PowerShell, use the [Get-AzConnectedMachineExtension](/powershell/module/az.connectedmachine/get-azconnectedmachineextension) command with the `-MachineName` and `-ResourceGroupName` parameters.

With the Azure CLI, use the [az connectedmachine extension list](/cli/azure/ext/connectedmachine/connectedmachine/extension#ext_connectedmachine_az_connectedmachine_extension_list) command with the `--machine-name` and `--resource-group` parameters. By default, the output of Azure CLI commands is in JSON (JavaScript Object Notation). To change the default output to a list or table, for example, use [az configure --output](/cli/azure/reference-index). You can also add `--output` to any command for a one time change in output format.

After identifying which VM extensions are deployed, you can remove them using the [Azure portal](manage-vm-extensions-portal.md), using the [Azure PowerShell](manage-vm-extensions-powershell.md), or using the [Azure CLI](manage-vm-extensions-cli.md). If the Log Analytics VM extension or Dependency agent VM extension was deployed using Azure Policy and the [VM insights initiative](../../azure-monitor/vm/vminsights-enable-policy.md), it is necessary to [create an exclusion](../../governance/policy/tutorials/create-and-manage.md#remove-a-non-compliant-or-denied-resource-from-the-scope-with-an-exclusion) to prevent re-evaluation and deployment of the extensions on the Arc-enabled server before the migration is complete.

## Step 2: Review access rights 

List role assignments for the Arc-enabled servers resource, using [Azure PowerShell](../../role-based-access-control/role-assignments-list-powershell.md#list-role-assignments-for-a-resource) and with other PowerShell code, you can export the results to CSV or another format. 

If you're using a managed identity for an application or process running on an Arc-enabled server, you need to make sure the Azure VM has a managed identity assigned. To view the role assignment for a managed identity, you can use the Azure PowerShell `Get-AzADServicePrincipal` cmdlet. For more information, see [List role assignments for a managed identity](../../role-based-access-control/role-assignments-list-powershell.md#list-role-assignments-for-a-managed-identity). 

A system-managed identity is also used when Azure Policy is used to audit settings inside a machine or server. With Arc-enabled servers, the Guest Configuration agent is included, and performs validation of audit settings. After you migrate, see [Deploy requirements for Azure virtual machines](../../governance/policy/concepts/guest-configuration.md#deploy-requirements-for-azure-virtual-machines) for information on how to configure your Azure VM manually or with policy with the Guest Configuration extension.

Update role assignment with any resources accessed by the managed identity to allow the new Azure VM identity to authenticate to those services. See the following to learn [how managed identities for Azure resources work for an Azure Virtual Machine (VM)](../../active-directory/managed-identities-azure-resources/how-managed-identities-work-vm.md).

## Step 3: Disconnect from Azure Arc and uninstall agent

Delete the resource ID of the Arc-enabled server in Azure using one of the following methods:

   * Running `azcmagent disconnect` command on the machine or server.

   * From the selected registered Arc-enabled server in the Azure portal by selecting **Delete** from the top bar.

   * Using the [Azure CLI](../../azure-resource-manager/management/delete-resource-group.md?tabs=azure-cli#delete-resource) or [Azure PowerShell](../../azure-resource-manager/management/delete-resource-group.md?tabs=azure-powershell#delete-resource). For the`ResourceType` parameter use `Microsoft.HybridCompute/machines`.

Then, remove the Azure Arc-enabled servers Windows or Linux agent following the [Remove agent](manage-agent.md#remove-the-agent) steps.

## Step 4: Install the Azure Guest Agent

The VM that is migrated to Azure from on-premises doesn't have the Linux or Windows Azure Guest Agent installed. In these scenarios, you have to manually install the VM agent. For more information about how to install the VM Agent, see [Azure Virtual Machine Windows Agent Overview](../../virtual-machines/extensions/agent-windows.md) or [Azure Virtual Machine Linux Agent Overview](../../virtual-machines/extensions/agent-linux.md).

## Step 5: Migrate server or machine to Azure

Before proceeding with the migration with Azure Migration, review the [Prepare on-premises machines for migration to Azure](../../migrate/prepare-for-migration.md) article to learn about requirements necessary to use Azure Migrate. To complete the migration to Azure, review the Azure Migrate [migration options](../../migrate/prepare-for-migration.md#next-steps) based on your environment.

## Step 6: Deploy Azure VM extensions

After migration and completion of all post-migration configuration steps, you can now deploy the Azure VM extensions based on the VM extensions originally installed on your Arc-enabled server. Review [Azure virtual machine extensions and features](../../virtual-machines/extensions/overview.md) to help plan your extension deployment. 

To resume using audit settings inside a machine with Azure Policy Guest Configuration policy definitions, see [Enable Guest Configuration](../../governance/policy/concepts/guest-configuration.md#enable-guest-configuration).

If the Log Analytics VM extension or Dependency agent VM extension was deployed using Azure Policy and the [VM insights initiative](../../azure-monitor/vm/vminsights-enable-policy.md), remove the [exclusion](../../governance/policy/tutorials/create-and-manage.md#remove-a-non-compliant-or-denied-resource-from-the-scope-with-an-exclusion) you created earlier. To use Azure Policy to enable Azure virtual machines, see [Deploy Azure Monitor at scale using Azure Policy](../../azure-monitor/deploy-scale.md#vm-insights). 

## Next steps

Troubleshooting information can be found in the [Troubleshoot Connected Machine agent](troubleshoot-agent-onboard.md) guide.