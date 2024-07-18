---
title: 'Quickstart: Use Terraform to create a virtual network'
titleSuffix: Azure Virtual Network
description: In this quickstart, you create an Azure virtual network and subnets by using Terraform. You use the Azure CLI to verify the resources.
ms.topic: quickstart
ms.date: 1/19/2024
ms.custom: devx-track-terraform, devx-track-azurecli
ms.service: virtual-network
author: asudbring
ms.author: allensu
content_well_notification: 
  - AI-contribution
# Customer intent: As a network administrator, I want to create a virtual network and subnets by using Terraform.
ai-usage: ai-assisted
---

# Quickstart: Use Terraform to create a virtual network

In this quickstart, you learn about a Terraform script that creates an Azure resource group and a virtual network with two subnets. The script generates the names of the resource group and the virtual network by using a random pet name with a prefix. The script also shows the names of the created resources in output.

The script uses the Azure Resource Manager (`azurerm`) provider to interact with Azure resources. It uses the  Random (`random`) provider to generate random pet names for the resources.

The script creates the following resources:

- A resource group: A container that holds related resources for an Azure solution.

- A virtual network: A fundamental building block for your private network in Azure.

- Two subnets: Segments of a virtual network's IP address range where you can place groups of isolated resources.

:::image type="content" source="./media/quick-create-bicep/virtual-network-bicep-resources.png" alt-text="Diagram of resources created in the virtual network quickstart." lightbox="./media/quick-create-bicep/virtual-network-bicep-resources.png":::

[!INCLUDE [About Terraform](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

## Prerequisites

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- [Installation and configuration of Terraform](/azure/developer/terraform/quickstart-configure).

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-virtual-network-create-two-subnets). You can view the log file that contains the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-virtual-network-create-two-subnets/TestRecord.md).
>
> For more articles and sample code that show how to use Terraform to manage Azure resources, see the [documentation page for Terraform on Azure](/azure/terraform).

1. Create a directory in which to test and run the sample Terraform code, and make it the current directory.

1. Create a file named *main.tf* and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-virtual-network-create-two-subnets/main.tf":::

1. Create a file named *outputs.tf* and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-virtual-network-create-two-subnets/outputs.tf":::

1. Create a file named *providers.tf* and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-virtual-network-create-two-subnets/providers.tf":::

1. Create a file named *variables.tf* and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-virtual-network-create-two-subnets/variables.tf":::

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

#### [Azure CLI](#tab/azure-cli)

1. Get the Azure resource group name:

    ```console
    resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the virtual network name:

    ```console
    virtual_network_name=$(terraform output -raw virtual_network_name)
    ```

1. Use [`az network vnet show`](/cli/azure/network/vnet#az-network-vnet-show) to display the details of your newly created virtual network:

    ```azurecli
    az network vnet show \
        --resource-group $resource_group_name \
        --name $virtual_network_name
    ```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

For information about troubleshooting Terraform, see [Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot).

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using Terraform on Azure](/azure/terraform)
