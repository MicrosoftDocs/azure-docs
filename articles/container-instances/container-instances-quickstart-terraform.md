---
title: 'Quickstart: Create an Azure Container Instance with a public IP address using Terraform'
description: 'In this article, you create an Azure Container Instance with a public IP address using Terraform'
ms.topic: quickstart
ms.service: container-instances
ms.date: 2/16/2023
ms.custom: devx-track-terraform
author: TomArcherMsft
ms.author: tarcher
---

# Quickstart: Create an Azure Container Instance with a public IP address using Terraform

> [!NOTE]
> View the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-aci-linuxcontainer-public-ip/TestRecord.md).

[!INCLUDE [Terraform abstract](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

This article shows how to use [Terraform](/azure/terraform) to create an Azure Container Instance with a public IP address.

In this article, you learn how to:

> [!div class="checklist"]

> * Create a random pet name for the Azure resource group name using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/resource_group/pet)
> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group)
> * Create an Azure container group using [azurerm_container_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/container_group)

## Prerequisites

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

<!-- TODO: Add bullets for any article-specific includes or download/install URLs and commands. -->

## Implement the Terraform code

> [!NOTE]
> The example code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-aci-linuxcontainer-public-ip). See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-aci-linuxcontainer-public-ip/main.tf)]

1. Create a file named `outputs.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-aci-linuxcontainer-public-ip/outputs.tf)]

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-aci-linuxcontainer-public-ip/providers.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-aci-linuxcontainer-public-ip/variables.tf)]

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

1. Use [terraform state show](https://developer.hashicorp.com/terraform/cli/commands/state/show) to display the current state of the specified resource.

    ```console
    terraform state show azurerm_container_group.container
    ```

1. Enter the sample's public IP address to see the sample page. The public IP address displays when you apply the execution plan.

    :::image type="content" source="./media/container-instances-quickstart-terraform/azure-container-instances-demo.png" alt-text="Screenshot of the Azure Container Instances sample page":::

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

> [!div class="nextstepaction"] 
> [Tutorial: Create a container image for deployment to Azure Container Instances](./container-instances-tutorial-prepare-app.md)
