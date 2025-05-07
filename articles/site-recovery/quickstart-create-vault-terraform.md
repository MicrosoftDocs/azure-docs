---
title: 'Quickstart: Use Terraform to create an Azure Recovery Services vault'
description: In this quickstart, you learn how to create a resource group, an Azure Recovery Services vault, and a backup policy to share files in the Azure environment.
ms.topic: quickstart
ms.date: 02/4/2025
ms.custom: devx-track-terraform
ms.service: azure-site-recovery
author: ankitaduttaMSFT
ms.author: ankitadutta
#customer intent: As a Terraform user, I want to learn how to create a resource group, Azure Recovery Services vault, and a backup policy to share files in Azure.
content_well_notification: 
  - AI-contribution
---

# Quickstart: Use Terraform to create an Azure Recovery Services vault

In this quickstart, you learn how to use Terraform to create an Azure resource group, an Azure Recovery Services vault, and a backup policy to share files in Azure. The [Azure Site Recovery](site-recovery-overview.md) service can help your business applications to stay online during planned and unplanned outages. Specifically, Site Recovery uses replication, failover, and recovery to manage on-premises machines and Azure virtual machines during disaster recovery. These Site Recovery methods can contribute to your business continuity and disaster recovery strategy.

An Azure Recovery Services vault is a storage entity in Azure that houses data such as backups and recovery points that can protect and manage your data. You create the vault first and then the backup policy for sharing files, which specifies when and how often backups should occur, plus the retention period. This setup can help to ensure that your data is backed up consistently and can be easily restored if needed.

[!INCLUDE [About Terraform](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

> [!div class="checklist"]
> * Create an Azure resource group with a unique name.
> * Define local variables for the SKU name and tier.
> * Create an Azure Recovery Services vault in the resource group.
> * Create a backup policy to share files in the resource group.
> * Output the names of the Recovery Services Vault and the backup policy for sharing files.

## Prerequisites

- Create an Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure).

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-azure-recovery-services). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-azure-recovery-services/TestRecord.md).
> 
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform).

1. Create a directory in which to test and run the sample Terraform code, and make it the current directory.

1. Create a file named `main.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-azure-recovery-services/main.tf":::

1. Create a file named `outputs.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-azure-recovery-services/outputs.tf":::

1. Create a file named `providers.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-azure-recovery-services/providers.tf":::

1. Create a file named `variables.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-azure-recovery-services/variables.tf":::

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

### [Azure CLI](#tab/azure-cli)

1. Get the Azure resource group name.

    ```console
    resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the Azure Recovery Services vault name.

    ```console
    recovery_services_vault_name=$(terraform output -recovery_services_vault_name)
    ```

1. Get the Azure Recovery Services vault backup policy file share name.

    ```console
    backup_policy_file_share_name=$(terraform output -backup_policy_file_share_name)
    ```

1. Run [`az backup vault show`](/cli/azure/backup/vault#az-backup-vault-show) to view the Azure Recovery Services vault.

    ```azurecli
    az backup vault show --name $recovery_services_vault_name --resource group $resource_group_name
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Get the Azure resource group name.

    ```console
    $resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the Azure Recovery Services vault name.

    ```console
    $recovery_services_vault_name=$(terraform output -raw recovery_services_vault_name)
    ```

1. Get the Azure Recovery Services vault backup policy file share name.

    ```console
    $backup_policy_file_share_name=$(terraform output -raw backup_policy_file_share_name)
    ```

1. Run [`Get-AzRecoveryServicesVault`](/powershell/module/az.recoveryservices/get-azrecoveryservicesvault) to view the Azure Recovery Services vault.

    ```azurepowershell
    Get-AzRecoveryServicesVault -ResourceGroupName $resource_group_name -Name $recovery_services_vault_name
    ```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot).

## Next steps

> [!div class="nextstepaction"]
> [See more articles about Azure Recovery Services vault](/search/?terms=Azure%20recovery%20services%20vault%20and%20terraform).
