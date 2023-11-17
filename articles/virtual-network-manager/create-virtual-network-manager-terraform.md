---
title: 'Quickstart: Create a mesh network topology with Azure Virtual Network Manager using Terraform'
description: 'In this article, you create a mesh network topology with Azure Virtual Network Manager using Terraform'
ms.service: virtual-network-manager
ms.topic: quickstart
ms.custom: devx-track-terraform
author: mbender-ms
ms.author: mbender
ms.date: 6/7/2023
content_well_notification: 
  - AI-contribution
zone_pivot_groups: azure-virtual-network-manager-quickstart-options

---

# Quickstart: Create a mesh network topology with Azure Virtual Network Manager using Terraform

Get started with Azure Virtual Network Manager by using Terraform to provision connectivity for all your virtual networks.

In this quickstart, you deploy three virtual networks and use Azure Virtual Network Manager to create a mesh network topology. Then, you verify that the connectivity configuration was applied. You can choose from a deployment with a Subscription scope or a management group scope. Learn more about [network manager scopes](concept-network-manager-scope.md).

[!INCLUDE [virtual-network-manager-preview](../../includes/virtual-network-manager-preview.md)]

[!INCLUDE [Terraform abstract](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

In this article, you learn how to:

> [!div class="checklist"]
> * Create a random value for the Azure resource group name using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet).
> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group).
> * Create an array of virtual networks using [azurerm_virtual_network](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_network).
> * Create an array of subnets using [azurerm_subnet](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/subnet).
> * Create a virtual network manager using [azurerm_virtual_network_manager](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/network_manager).
> * Create a network manager network group using [azurerm_network_manager_network_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/network_manager_network_group).
> * Create a network manager static member using [azurerm_network_manager_static_member](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/network_manager_static_member).
> * Create a network manager connectivity configuration using [azurerm_network_manager_connectivity_configuration](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/network_manager_connectivity_configuration).
> * Create a network manager deployment using [azurerm_network_manager_deployment](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/network_manager_deployment).

## Prerequisites

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)
- To modify dynamic network groups, you must be [granted access via Azure RBAC role](concept-network-groups.md#network-groups-and-azure-policy) assignment only. Classic Admin/legacy authorization is not supported

:::zone pivot="sub"

## Implement the Terraform code

This code sample will implement Azure Virtual Network Manager at the subscription scope.

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-virtual-network-manager-create-mesh). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-virtual-network-manager-create-mesh/TestRecord.md).
> 
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

2. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-virtual-network-manager-create-mesh/providers.tf)]

3. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-virtual-network-manager-create-mesh/main.tf)]

4. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-virtual-network-manager-create-mesh/variables.tf)]

5. Create a file named `outputs.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-virtual-network-manager-create-mesh/outputs.tf)]

:::zone-end

:::zone pivot="mgmt-grp"


## Implement the Terraform code

This code sample will implement Azure Virtual Network Manager at the management group scope.
 
> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-virtual-network-manager-create-mesh). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-virtual-network-manager-create-mesh/TestRecord.md).
> 
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-virtual-network-manager-create-mesh/providers.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-virtual-network-manager-create-mesh/main.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-virtual-network-manager-create-mesh/variables.tf)]

1. Create a file named `outputs.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-virtual-network-manager-create-mesh/outputs.tf)]

:::zone-end

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

1. Get the virtual network names.

    ```console
    terraform output virtual_network_names
    ``` 
  
1. For each virtual network name printed in the previous step, run [az network manager list-effective-connectivity-config](/cli/azure/network/manager#az-network-manager-list-effective-connectivity-config) to print the effective (applied) configurations. Replace the `<virtual_network_name>` placeholder with the vnet name.

    ```azurecli
    az network manager list-effective-connectivity-config \
      --resource-group $resource_group_name \
      --vnet-name <virtual_network_name>
    ```

#### [Azure PowerShell](#tab/azure-powershell)

1. Get the Azure resource group name.

    ```console
    $resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Run [Get-AzResourceGroup](/powershell/module/az.resources/Get-AzResourceGroup) to display the resource group.

    ```azurepowershell
    Get-AzResourceGroup -Name $resource_group_name
    ```

1. For each virtual network name printed in the previous step, run [Get-AzNetworkManagerEffectiveConnectivityConfiguration](/powershell/module/az.network/get-aznetworkmanagereffectiveconnectivityconfiguration) to print the effective (applied) configurations. Replace the `<virtual_network_name>` placeholder with the vnet name.

```azurepowershell
    Get-AzNetworkManagerEffectiveConnectivityConfiguration 
   -VirtualNetworkName <String>
   -VirtualNetworkResourceGroupName $resource_group_name
```
---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

> [!div class="nextstepaction"]
> [Block network traffic with Azure Virtual Network Manager](how-to-block-network-traffic-portal.md)
