---
title: 'Quickstart: Configure an Azure virtual network gateway with Terraform'
description: In this quickstart, you create a resource group, a virtual network, a subnet for the gateway, a public IP for the gateway, an Azure ExpressRoute gateway, an ExpressRoute circuit, and an ExpressRoute circuit peering in Azure.
ms.topic: quickstart
ms.date: 01/29/2025
ms.custom: devx-track-terraform
ms.service: azure-virtual-network
author: duongau
ms.author: duau
#customer intent: As a Terraform user, I want to see how to create a resource group, a virtual network, a subnet for the gateway, a public IP for the gateway, an Azure ExpressRoute gateway, an ExpressRoute circuit, and an ExpressRoute circuit peering in Azure.
content_well_notification: 
  - AI-contribution
---

# Quickstart: Configure an Azure virtual network gateway with Terraform

In this quickstart, you use Terraform to create an Azure ExpressRoute circuit with *Equinix* as the service provider. The circuit uses a *Standard SKU* with a bandwidth of *50 Mbps* and the peering location of *Washington, D.C.* Private peering is enabled with a primary and secondary subnet of *192.168.10.16/30* and *192.168.10.20/30*, respectively. The script also creates a virtual network and a *HighPerformance ExpressRoute gateway*.

:::image type="content" source="media/expressroute-howto-circuit-portal-resource-manager/environment-diagram.png" alt-text="Diagram of an Azure ExpressRoute circuit deployment environment using Bicep." lightbox="media/expressroute-howto-circuit-portal-resource-manager/environment-diagram.png":::

[!INCLUDE [About Terraform](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

In this article, you learn how to:

> [!div class="checklist"]
> * Create an Azure resource group with a unique name.
> * Create a virtual network with a subnet for the gateway.
> * Create a public IP for the gateway.
> * Create an ExpressRoute circuit and configure private peering.
> * Output the resource group name, ExpressRoute circuit ID, gateway name, gateway IP, and the service key.

## Prerequisites

- Create an Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure).

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-azure-expressroute). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-azure-expressroute/TestRecord.md).
> 
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform).

1. Create a directory in which to test and run the sample Terraform code, and make it the current directory.

1. Create a file named `main.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-azure-expressroute/main.tf":::

1. Create a file named `outputs.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-azure-expressroute/outputs.tf":::

1. Create a file named `providers.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-azure-expressroute/providers.tf":::

1. Create a file named `variables.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-azure-expressroute/variables.tf":::

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

### [Azure CLI](#tab/azure-cli)

1. Get the Azure resource group name.

   ```bash
   resource_group_name=$(terraform output -raw resource_group_name)
   ```

1. Get the gateway name.

   ```bash
   gateway_name=$(terraform output -raw gateway_name)
   ```

1. Run [`az network vnet-gateway show`](/cli/azure/network/vnet-gateway#az-network-vnet-gateway-show) to view the Azure virtual network gateway.

   ```azurecli
   az network vnet-gateway show --name $gateway_name --resource-group $resource_group_name
   ```

### [Azure PowerShell](#tab/azure-powershell)

1. Get the Azure resource group name.

   ```powershell
   $resource_group_name=$(terraform output -raw resource_group_name)
   ```

1. Get the gateway name.

   ```powershell
   $gateway_name=$(terraform output -raw gateway_name)
   ```

1. Run [`Get-AzVirtualNetworkGateway`](/powershell/module/az.network/get-azvirtualnetworkgateway#:~:text=Example%202:%20Get%20a%20Virtual%20Network%20Gateway) to view the Azure virtual network gateway.

   ```azurepowershell
   Get-AzVirtualNetworkGateway -Name $gateway_name -ResourceGroupName $resource_group_name
   ```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot).

## Next steps

> [!div class="nextstepaction"]
[See more articles about Azure virtual network gateway.](/search/?terms=Azure%20virtual%20network%20gateway%20and%20terraform)

To learn how to link a virtual network to a circuit, continue to the ExpressRoute tutorials.

> [!div class="nextstepaction"]
> [ExpressRoute tutorials](expressroute-howto-linkvnet-portal-resource-manager.md)
