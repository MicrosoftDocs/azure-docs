---
title: 'Quickstart: Create an Azure NAT Gateway using Terraform'
titleSuffix: Azure NAT Gateway
description: 'In this article, you create an Azure Virtual Machine with a NAT Gateway using Terraform.'
ms.topic: quickstart
ms.date: 02/21/2024
ms.custom: devx-track-terraform
ms.service: virtual-network
author: asudbring
ms.author: allensu
content_well_notification: 
  - AI-contribution
---

# Quickstart: Create an Azure NAT Gateway using Terraform

Get started with Azure NAT Gateway using Terraform. This Terraform file deploys a virtual network, a NAT gateway resource, and Ubuntu virtual machine. The Ubuntu virtual machine is deployed to a subnet that is associated with the NAT gateway resource.

The script also generates a random SSH public key and associates it with the virtual machine for secure access. The public key is outputted at the end of the script execution. 

The script uses the Random and AzAPI providers in addition to the AzureRM provider. The Random provider is used to generate a unique name for the resource group and the SSH key. The AzAPI provider is used to generate the SSH public key. 

As with the public key, the names of the created resource group, virtual network, subnet, and NAT gateway are printed when the script is run.

[!INCLUDE [About Terraform](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

:::image type="content" source="./media/quickstart-create-nat-gateway-portal/nat-gateway-qs-resources.png" alt-text="Diagram of resources created in nat gateway quickstart.":::

## Prerequisites

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure).

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-nat-gateway-create).
> 
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `main.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-nat-gateway-create/main.tf":::

1. Create a file named `outputs.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-nat-gateway-create/outputs.tf":::

1. Create a file named `providers.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-nat-gateway-create/providers.tf":::

1. Create a file named `ssh.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-nat-gateway-create/ssh.tf":::

1. Create a file named `variables.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-nat-gateway-create/variables.tf":::


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

1. Get the NAT gateway ID.

```console
    nat_gateway=$(terraform output -raw nat_gateway)
```

1. Run [az network nat gateway show](/cli/azure/network/nat/gateway#az-network-nat-gateway-show) to display the details about the NAT gateway.

```azurecli
az network nat gateway show \
    --resource-group $resource_group_name \
    --ids $nat_gateway
```

#### [Azure PowerShell](#tab/azure-powershell)

1. Get the Azure resource group name.

```console
$resource_group_name=$(terraform output -raw resource_group_name)
```

1. Get the NAT gateway ID.

```console
$nat_gateway=$(terraform output -raw nat_gateway)
```

1. Run [Get-AzNatGateway](/powershell/module/az.network/get-aznatgateway) to display the details about the NAT gateway.

```azurepowershell
$nat = @{
    Name = $nat_gateway
    ResourceGroupName = $resource_group_name
}
Get-AzNatGateway @nat
```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure.](/azure/developer/terraform/troubleshoot)

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about using Terraform in Azure](/azure/terraform)
