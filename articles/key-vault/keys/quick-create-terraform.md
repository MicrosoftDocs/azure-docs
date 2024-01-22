---
title: 'Quickstart: Create an Azure key vault and key using Terraform'
description: 'In this article, you create an Azure key vault and key using Terraform'
services: key-vault
author: msmbaldwin
ms.topic: quickstart
ms.custom: devx-track-terraform
ms.service: key-vault
ms.subservice: keys
ms.author: mbaldwin
ms.date: 10/3/2023
content_well_notification: 
  - AI-contribution
---

# Quickstart: Create an Azure key vault and key using Terraform

[Azure Key Vault](../general/overview.md) is a cloud service that provides a secure store for secrets, such as keys, passwords, and certificate. This article focuses on the process of deploying a Terraform file to create a key vault and a key.

[!INCLUDE [Terraform abstract](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

In this article, you learn how to:

> [!div class="checklist"]
> * Create a random value for the Azure resource group name using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet)
> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group)
> * Create a random value using [random_string](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/string)
> * Create an Azure key vault using [azurerm_key_vault](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault)
> * Create an Azure key vault key using [azurerm_key_vault_key](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault_key)

## Prerequisites

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-key-vault-key). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-key-vault-key/TestRecord.md).
> 
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-key-vault-key/providers.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-key-vault-key/main.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-key-vault-key/variables.tf)]

1. Create a file named `outputs.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-key-vault-key/outputs.tf)]

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

#### [Azure CLI](#tab/azure-cli)

1. Get the Azure key vault name.

    ```console
    azurerm_key_vault_name=$(terraform output -raw azurerm_key_vault_name)
    ```

1. Run [az keyvault key list](/cli/azure/keyvault/key#az-keyvault-key-list) to display information about the key vault's keys.

    ```azurecli
    az keyvault key list --vault-name $azurerm_key_vault_name
    ```

#### [Azure PowerShell](#tab/azure-powershell)

1. Get the Azure key vault name.

    ```console
    $azurerm_key_vault_name=$(terraform output -raw azurerm_key_vault_name)
    ```

1. Run [Get-AzKeyVault](/powershell/module/az.keyvault/get-azkeyvault) to display information about the new key vault.

    ```azurepowershell
    Get-AzKeyVaultKey -VaultName $azurerm_key_vault_name
    ```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

> [!div class="nextstepaction"] 
> [Key Vault security overview](../general/security-features.md)
