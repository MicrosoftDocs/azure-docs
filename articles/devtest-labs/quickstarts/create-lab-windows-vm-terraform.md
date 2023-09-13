---
title: 'Quickstart: Create a lab in Azure DevTest Labs using Terraform'
description: 'In this article, you create a Windows virtual machine in a lab within Azure DevTest Labs using Terraform'
ms.topic: quickstart
ms.date: 4/14/2023
ms.custom: devx-track-terraform, UpdateFrequency2
author: TomArcherMsft
ms.author: tarcher
content_well_notification: 
  - AI-contribution
---

# Quickstart: Create a lab in Azure DevTest Labs using Terraform

This article shows how to use Terraform to create a Windows Server 2019 Datacenter virtual machine in a lab within [Azure DevTest Labs](../devtest-lab-overview.md) using [Terraform](/azure/developer/terraform).

In this article, you learn how to:

> [!div class="checklist"]
> * Create a random pet name for the Azure resource group name using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet)
> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group)
> * Create a random password using [random_password](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password)
> * Create a lab within Azure DevTest Labs using [azurerm_dev_test_lab](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/dev_test_lab)
> * Create a virtual network within Azure DevTest Labs using [azurerm_dev_test_virtual_network](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/dev_test_virtual_network)
> * Create a Windows virtual machine within Azure DevTest Labs using [azurerm_dev_test_windows_virtual_machine](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/dev_test_windows_virtual_machine)

## Prerequisites

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-devtest-labs). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-devtest-labs/TestRecord.md).
> 
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-devtest-labs/main.tf)]

1. Create a file named `outputs.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-devtest-labs/outputs.tf)]

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-devtest-labs/providers.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-devtest-labs/variables.tf)]

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

1. Get the Azure resource name in which the lab was created.

    ```console
    resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the lab name.

    ```console
    lab_name=$(terraform output -raw lab_name)
    ```

1. Run [az lab vm list](/cli/azure/lab/vm#az-lab-vm-list) to list the virtual machines for the lab you created in this article.

    ```azurecli
    az lab vm list --resource-group $resource_group_name \
                   --lab-name $lab_name
    ```

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

> [!div class="nextstepaction"] 
> [Tutorial: Work with lab VMs](../tutorial-use-custom-lab.md)