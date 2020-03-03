---
title: Quickstart - Resource Manager template VM Backup
description: Learn how to back up your virtual machines with Azure Resource Manager template
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 05/14/2019
ms.custom: mvc
---

# Back up a virtual machine in Azure with Resource Manager template

[Azure Backup](backup-overview.md) backs up on-premises machines and apps, and Azure VMs. This article shows you how to back up an Azure VM with Resource Manager template and Azure PowerShell. This quickstart focuses on the process of deploying a Resource Manager template to create a Recover Services vault. For more information on developing Resource Manager templates, see [Resource Manager documentation](/azure/azure-resource-manager/) and the [template reference](/azure/templates/microsoft.recoveryservices/allversions).

Alternatively, you can back up a VM using [Azure PowerShell](./quick-backup-vm-powershell.md), the [Azure CLI](quick-backup-vm-cli.md), or in the [Azure portal](quick-backup-vm-portal.md).

## Create a VM and Recovery Services vault

A [Recovery Services vault](backup-azure-recovery-services-vault-overview.md) is a logical container that stores backup data for protected resources, such as Azure VMs. When a backup job runs, it creates a recovery point inside the Recovery Services vault. You can then use one of these recovery points to restore data to a given point in time.

The template used in this quickstart is from [Azure quickstart templates](https://azure.microsoft.com/resources/templates/101-recovery-services-create-vm-and-configure-backup/). This template allows you to deploy simple Windows VM and Recovery Services Vault configured with the DefaultPolicy for Protection.

To deploy the template, select **Try it** to open the Azure Cloud shell, and then paste the following PowerShell script into the shell window. To paste the code, right-click the shell window and then select **Paste**.

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter a project name (limited to eight characters) that is used to generate Azure resource names"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"
$adminUsername = Read-Host -Prompt "Enter the administrator username for the virtual machine"
$adminPassword = Read-Host -Prompt "Enter the administrator password for the virtual machine" -AsSecureString
$dnsPrefix = Read-Host -Prompt "Enter the unique DNS Name for the Public IP used to access the virtual machine"

$resourceGroupName = "${projectName}rg"
$templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-recovery-services-create-vm-and-configure-backup/azuredeploy.json"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -projectName $projectName -adminUsername $adminUsername -adminPassword $adminPassword -dnsLabelPrefix $dnsPrefix
```

Azure PowerShell is used to deploy the Resource Manager template in this quickstart. The [Azure portal](../azure-resource-manager/templates/deploy-portal.md), [Azure CLI](../azure-resource-manager/templates/deploy-cli.md), and [Rest API](../azure-resource-manager/templates/deploy-rest.md) can also be used to deploy templates.

## Start a backup job

The template creates a VM and enables back on the VM. After you deploy the template, you need to start a backup job. For more information, see [Start a backup job](./quick-backup-vm-powershell.md#start-a-backup-job).

## Monitor the backup job

To monitor the backup job, see [Monitor the backup job](./quick-backup-vm-powershell.md#monitor-the-backup-job).

## Clean up the deployment

If you no longer need to back up the VM, you can clean it up.

- If you want to try out restoring the VM, skip the cleanup.
- If you used an existing VM, you can skip the final [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) cmdlet to leave the resource group and VM in place.

Disable protection, remove the restore points and vault. Then delete the resource group and associated VM resources, as follows:

```powershell
Disable-AzRecoveryServicesBackupProtection -Item $item -RemoveRecoveryPoints
$vault = Get-AzRecoveryServicesVault -Name "myRecoveryServicesVault"
Remove-AzRecoveryServicesVault -Vault $vault
Remove-AzResourceGroup -Name "myResourceGroup"
```

## Next steps

In this quickstart, you created a Recovery Services vault, enabled protection on a VM, and created the initial recovery point.

- [Learn how](tutorial-backup-vm-at-scale.md) to back up VMs in the Azure portal.
- [Learn how](tutorial-restore-disk.md) to quickly restore a VM
