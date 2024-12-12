---
title: 'Quickstart: Configure an Azure virtual network gateway with Terraform'
description: In this quickstart, you create a resource group, a virtual network, a subnet for the gateway, a public IP for the gateway, an Azure ExpressRoute gateway, an ExpressRoute circuit, and an ExpressRoute circuit peering in Azure.
ms.topic: quickstart
ms.date: 12/13/2024
ms.custom: devx-track-terraform
ms.service: virtual-network
author: duongau
ms.author: duau
#customer intent: As a Terraform user, I want to see how to create a resource group, a virtual network, a subnet for the gateway, a public IP for the gateway, an Azure ExpressRoute gateway, an ExpressRoute circuit, and an ExpressRoute circuit peering in Azure.
content_well_notification: 
  - AI-contribution
---

# Quickstart: Configure an Azure virtual network gateway with Terraform

This quickstart describes how to use Terraform to create an Azure virtual network gateway and several other resources.

An Azure virtual network gateway is a specific type of virtual network gateway that's used to send encrypted traffic between an Azure virtual network and an on-premises location over the public Internet. It can also be used to send encrypted traffic between Azure virtual networks. In addition to the Azure virtual network gateway, this code also creates a resource group, a virtual network, a subnet for the gateway, a public IP for the gateway, an Azure ExpressRoute gateway, an ExpressRoute circuit, and an ExpressRoute circuit peering. These resources work together to establish and manage the secure connection.

:::image type="content" source="media/expressroute-howto-circuit-portal-resource-manager/environment-diagram.png" alt-text="Diagram of ExpressRoute circuit deployment environment using bicep." lightbox="media/expressroute-howto-circuit-portal-resource-manager/environment-diagram.png":::

[!INCLUDE [About Terraform](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

> [!div class="checklist"]
> * Specify the required providers for Terraform.
> * Define the Azure provider.
> * Define the location of the resource group.
> * Define the prefix of the resource group name.
> * Create a resource group with a unique name.
> * Generate a random string for unique naming.
> * Create a virtual network with a unique name.
> * Create a subnet for the gateway.
> * Create a public IP for the gateway.
> * Create an ExpressRoute gateway.
> * Create an ExpressRoute circuit.
> * Create an ExpressRoute circuit peering.
> * Output the resource group name.
> * Output the ExpressRoute circuit ID.
> * Output the gateway IP.
> * Output the service key.

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

   ```console
   resource_group_name=$(terraform output -raw resource_group_name)
   ```

1. Confirm the ExpressRoute circuit ID.

   ```console
   express_route_circuit_id=$(terraform output -raw express_route_circuit_id)
   ```

1. Confirm the gateway IP.

   ```console
   gateway_ip=$(terraform output -raw gateway_ip)
   ```

1. Confirm the service key.

    ```console
   service_key=$(terraform output -raw service_key)
   ```

1. Run [`az network vnet-gateway show`](/cli/azure/network/vnet-gateway#az-network-vnet-gateway-show) to view the Azure virtual network gateway.

   ```azurecli
   az network vnet-gateway show --name $gateway_name --resource-group $resource_group_name
   ```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot).

## Next steps

> [!div class="nextstepaction"]
> [See more articles about Azure virtual network gateway](/search/?terms=Azure%20virtual%20network%20gateway%20and%20terraform).
