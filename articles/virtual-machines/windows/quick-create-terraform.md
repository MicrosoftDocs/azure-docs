---
title: 'Quickstart: Use Terraform to create a Windows VM'
description: In this quickstart, you learn how to use Terraform to create a Windows virtual machine
author: ericd-mst-github
ms.service: virtual-machines
ms.collection: windows
ms.topic: quickstart
ms.workload: infrastructure
ms.date: 07/17/2023
ms.author: erd
ms.custom: devx-track-terraform
content_well_notification: 
  - AI-contribution
---

# Quickstart: Use Terraform to create a Windows VM

**Applies to:** :heavy_check_mark: Windows VMs 

This article shows you how to create a complete Windows environment and supporting resources with Terraform. Those resources include a virtual network, subnet, public IP address, and more.

[!INCLUDE [Terraform abstract](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

In this article, you learn how to:
> [!div class="checklist"]
> * Create a random value for the Azure resource group name using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet).
> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group).
> * Create a virtual network (VNET) using [azurerm_virtual_network](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_network).
> * Create a subnet using [azurerm_subnet](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/subnet).
> * Create a public IP using [azurerm_public_ip](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/public_ip).
> * Create a network security group using [azurerm_network_security_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/network_security_group).
> * Create a network interface using [azurerm_network_interface](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/network_interface).
> * Create an association between the network security group and the network interface using [azurerm_network_interface_security_group_association](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/network_interface_security_group_association).
> * Generate a random value for a unique storage account name using [random_id](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/id).
> * Create a storage account for boot diagnostics using [azurerm_storage_account](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_account).
> * Create a Windows VM with an IIS web server using [azurerm_windows_virtual_machine](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/linux_virtual_machine).
> * Create a Windows VM extension using [azurerm_virtual_machine_extension](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_machine_extension).

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](~/azure-dev-docs-pr/articles/includes/open-source-devops-prereqs-azure-subscription.md)]

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-windows-vm-with-iis-server). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-windows-vm-with-iis-server/TestRecord.md).
>
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-windows-vm-with-iis-server/providers.tf":::

1. Create a file named `main.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-windows-vm-with-iis-server/main.tf":::

1. Create a file named `variables.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-windows-vm-with-iis-server/variables.tf":::

1. Create a file named `outputs.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-windows-vm-with-iis-server/outputs.tf":::

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

1. Run the following command to get the VM's public IP address and make note of it:
    ```azurecli-interactive
    echo $(terraform output -raw public_ip_address)
    ```

1. With IIS installed and port 80 now open on your VM from the Internet, use a web browser of your choice to view the default IIS welcome page. Use the public IP address of your VM obtained from the previous command. The following example shows the default IIS web site:

    :::image type="content" source="./media/quick-create-powershell/default-iis-website.png" alt-text="Screenshot showing the IIS default site.":::

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

In this quickstart, you deployed a simple virtual machine using Terraform. To learn more about Azure virtual machines, continue to the tutorial for Linux VMs.

> [!div class="nextstepaction"]
> [Azure Linux virtual machine tutorials](./tutorial-manage-vm.md)
