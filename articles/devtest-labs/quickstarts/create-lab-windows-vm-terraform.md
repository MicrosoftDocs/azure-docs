---
title: 'Quickstart: Create a lab and VM using Terraform'
description: Learn to use Terraform to create a lab and a Windows virtual machine (VM) in Azure DevTest Labs.
ms.topic: quickstart
ms.date: 04/02/2025
ms.custom: devx-track-terraform, UpdateFrequency2
author: TomArcherMsft
ms.author: tarcher
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted

#customer intent: As a lab administrator, I want to create labs and VMs by using Terraform so I can quickly define and manage labs in a consistent, declarative way.
---

# Quickstart: Create a lab and VM using Terraform

[Terraform](/azure/developer/terraform) is an infrastructure as code tool that helps you build and manage cloud resources. This article shows how to use Terraform to create a lab containing a Windows Server 2019 Datacenter virtual machine (VM) in Azure DevTest Labs.

## Prerequisites

- **Owner** or **Contributor**-level permissions in the Azure subscription where you want to create the lab.
- Terraform installed and configured, [locally](/azure/developer/terraform/quickstart-configure) or in [Azure Cloud Shell](/azure/developer/terraform/get-started-cloud-shell-bash).

## Create the lab and VM

The sample code this article references is located in the [Azure Terraform GitHub repository](https://github.com/Azure/terraform/tree/master/quickstart/101-devtest-labs). The Terraform code takes the following actions:

- Creates a random pet name for the Azure resource group using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet)
- Creates an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group)
- Creates a random password using [random_password](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password)
- Creates a lab using [azurerm_dev_test_lab](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/dev_test_lab)
- Creates a virtual network for the lab using [azurerm_dev_test_virtual_network](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/dev_test_virtual_network)
- Creates a Windows VM in the lab using [azurerm_dev_test_windows_virtual_machine](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/dev_test_windows_virtual_machine)

### Create the code files

Create the following files in your Terraform directory. Make sure the directory is added to your PATH.

- A file named *main.tf* that contains the following code. You can change the `gallery_image_reference` to create different types of VMs.
  [!code-terraform[master](~/terraform_samples/quickstart/101-devtest-labs/main.tf)]

- A file named *outputs.tf* that contains the following code:
  [!code-terraform[master](~/terraform_samples/quickstart/101-devtest-labs/outputs.tf)]

- A file named *providers.tf* that contains the following code:
  [!code-terraform[master](~/terraform_samples/quickstart/101-devtest-labs/providers.tf)]

- A file named *variables.tf* that contains the following code. You can change the `default` values for some variables like `resource_group_location` or `vm_size` if you need to use different values.
  [!code-terraform[master](~/terraform_samples/quickstart/101-devtest-labs/variables.tf)]

## Initialize Terraform

[!INCLUDE [terraform-init.md](../includes/terraform-init.md)]

## Create the Terraform execution plan

[!INCLUDE [terraform-plan.md](../includes/terraform-plan.md)]

## Apply the Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](../includes/terraform-apply-plan.md)]

## Verify the results

There are several ways to verify the results of the Terraform deployment. If you have Azure CLI available, you can use [az lab vm list](/cli/azure/lab/vm#az-lab-vm-list) to get the names of the resource group and lab that Terraform created.

```azurecli
resource_group_name=$(terraform output -raw resource_group_name)
lab_name=$(terraform output -raw lab_name)
az lab vm list --resource-group $resource_group_name --lab-name $lab_name
```

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](../includes/terraform-plan-destroy.md)]

## Next step

> [!div class="nextstepaction"] 
> [Access and connect to lab VMs](../tutorial-use-custom-lab.md)

## Related content

- [Terraform on Azure documentation](/azure/terraform)
- [Terraform on Azure troubleshooting](/azure/developer/terraform/troubleshoot)

