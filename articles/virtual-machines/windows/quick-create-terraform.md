---
title: 'Quickstart: Use Terraform to create a Windows VM'
description: In this quickstart, you learn how to use Terraform to create a Windows virtual machine
author: ericd-mst-github
ms.service: virtual-machines
ms.collection: windows
ms.topic: quickstart
ms.workload: infrastructure
ms.date: 01/13/2023
ms.author: erd
ms.custom: devx-track-terraform
---

# Quickstart: Use Terraform to create a Windows VM

**Applies to:** :heavy_check_mark: Windows VMs 

Article tested with the following Terraform and Terraform provider versions:

- [Terraform v1.2.7](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.3.20.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

This article shows you how to create a complete Windows environment and supporting resources with Terraform. Those resources include a virtual network, subnet, public IP address, and more.

[!INCLUDE [Terraform abstract](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

In this article, you learn how to:
> [!div class="checklist"]

> * Create a virtual network
> * Create a subnet
> * Create a public IP address
> * Create a network security group and SSH inbound rule
> * Create a virtual network interface card
> * Connect the network security group to the network interface
> * Create a storage account for boot diagnostics
> * Create a virtual machine with an IIS web server
> * View the web server page

> [!NOTE]
> The example code in this article is located in the [Microsoft Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-vm-with-infrastructure). See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](~/azure-dev-docs-pr/articles/includes/open-source-devops-prereqs-azure-subscription.md)]

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-windows-vm-with-iis-server/providers.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-windows-vm-with-iis-server/main.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-windows-vm-with-iis-server/variables.tf)]

1. Create a file named `outputs.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-windows-vm-with-iis-server/outputs.tf)]

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

2. With IIS installed and port 80 now open on your VM from the Internet, use a web browser of your choice to view the default IIS welcome page. Use the public IP address of your VM obtained from the previous command. The following example shows the default IIS web site:

    ![Screenshot showing the IIS default site.](./media/quick-create-powershell/default-iis-website.png)

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

In this quickstart, you deployed a simple virtual machine using Terraform. To learn more about Azure virtual machines, continue to the tutorial for Linux VMs.

> [!div class="nextstepaction"]
> [Azure Linux virtual machine tutorials](./tutorial-manage-vm.md)
