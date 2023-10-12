---
title: 'Quickstart: Create a Windows VM cluster in Azure using Terraform'
description: In this article, you learn how to create a Windows VM cluster in Azure using Terraform
author: tomarchermsft
ms.service: virtual-machines
ms.collection: windows
ms.topic: quickstart
ms.workload: infrastructure
ms.date: 07/24/2023
ms.author: tarcher
ms.custom: devx-track-terraform
content_well_notification: 
  - AI-contribution
---

# Quickstart: Create a Windows VM cluster in Azure using Terraform

**Applies to:** :heavy_check_mark: Windows VMs 

This article shows you how to create a Windows VM cluster (containing three Windows VM instances) in Azure using Terraform.

> [!div class="checklist"]
> * Create a random value for the Azure resource group name using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet).
> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group).
> * Create a random value for the Windows VM host name [random_string](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/string).
> * Create a random password for the Windows VMs using [random_password](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password).
> * Create a Windows VM using the [compute module](https://registry.terraform.io/modules/Azure/compute/azurerm).
> * Create a virtual network along with subnet using the [network module](https://registry.terraform.io/modules/Azure/network/azurerm).

## Prerequisites

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-vm-cluster-windows). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-vm-cluster-windows/TestRecord.md).
>
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-vm-cluster-windows/providers.tf":::

1. Create a file named `main.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-vm-cluster-windows/main.tf":::

1. Create a file named `variables.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-vm-cluster-windows/variables.tf":::

1. Create a file named `outputs.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-vm-cluster-windows/outputs.tf":::

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

#### [Azure CLI](#tab/azure-cli)

1. Get the Azure resource group name.

    ```console
    resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Run [az vm list](/cli/azure/vm#az-vm-list) with a [JMESPath](/cli/azure/query-azure-cli) query to display the names of the virtual machines created in the resource group.

    ```azurecli
    az vm list \
      --resource-group $resource_group_name \
      --query "[].{\"VM Name\":name}" -o table
    ```

#### [Azure PowerShell](#tab/azure-powershell)

1. Get the Azure resource group name.

    ```console
    $resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Run [Get-AzVm](/powershell/module/az.compute/get-azvm)  to display the names of all the virtual machines in the resource group.

    ```azurepowershell
    Get-AzVm -ResourceGroupName $resource_group_name
    ```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

> [!div class="nextstepaction"]
> [Azure Linux virtual machine tutorials](./tutorial-manage-vm.md)
