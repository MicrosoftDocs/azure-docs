---
title: 'Quickstart: Create an Azure Firewall with Availability Zones - Terraform'
description: In this quickstart, you deploy Azure Firewall using Terraform. The virtual network has one virtual network with three subnets. Two Windows Server virtual machines, a jump box, and a server are deployed.
author: duongau
ms.author: duau
ms.service: azure-firewall
ms.topic: quickstart
ms.date: 03/28/2026
ms.custom: devx-track-terraform
content_well_notification:
  - AI-contribution
ai-usage: ai-assisted
# Customer intent: "As a cloud engineer, I want to deploy Azure Firewall using Terraform, so that I can create a secure network environment with high availability across multiple zones."
---

# Quickstart: Deploy Azure Firewall with Availability Zones - Terraform

In this quickstart, use Terraform to deploy an Azure Firewall in three Availability Zones.

[!INCLUDE [About Terraform](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

The Terraform configuration creates a test network environment with a firewall. The network has one virtual network with three subnets: *AzureFirewallSubnet*, *subnet-server*, and *subnet-jump*. The *subnet-server* and *subnet-jump* subnets each have a single two-core Windows Server virtual machine.

The firewall is in the *AzureFirewallSubnet* subnet and has an application rule collection with a single rule that allows access to `www.microsoft.com`.

A user-defined route points network traffic from the *subnet-server* subnet through the firewall where the firewall rules are applied.

For more information about Azure Firewall, see [Deploy and configure Azure Firewall using the Azure portal](tutorial-firewall-deploy-portal.md).

In this article, you learn how to:

> [!div class="checklist"]
> * Create a random value (to use in the resource group name) by using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet)
> * Create an Azure resource group by using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group)
> * Create an Azure Virtual Network by using [azurerm_virtual_network](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_network)
> * Create three Azure subnets by using [azurerm_subnet](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/subnet)
> * Create an Azure public IP by using [azurerm_public_ip](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/public_ip)
> * Create an Azure Firewall Policy by using [azurerm_firewall_policy](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/firewall_policy)
> * Create an Azure Firewall Policy Rule Collection Group by using [azurerm_firewall_policy_rule_collection_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/firewall_policy_rule_collection_group)
> * Create an Azure Firewall by using [azurerm_firewall](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/firewall)
> * Create a network interface by using [azurerm_network_interface](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/network_interface)
> * Create a network security group (to contain a list of network security rules) by using [azurerm_network_security_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/network_security_group)
> * Create an association between the network interface and the network security group by using [azurerm_network_interface_security_group_association](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/network_interface_security_group_association)
> * Create a route table by using [azurerm_route_table](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/route_table)
> * Create an association between the route table and the subnet by using [azurerm_subnet_route_table_association](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/subnet_route_table_association)
> * Create a random value (to use as the storage name) by using [random_string](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/string)
> * Create a storage account by using [azurerm_storage_account](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_account)
> * Create a random password for the Windows VM by using [random_password](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password)
> * Create an Azure Windows Virtual Machine by using [azurerm_windows_virtual_machine](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/windows_virtual_machine)

## Prerequisites

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code


> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/201-azfw-with-avzones). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/201-azfw-with-avzones/TestRecord.md).
>
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)


1. Create a directory to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/201-azfw-with-avzones/providers.tf":::

1. Create a file named `main.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/201-azfw-with-avzones/main.tf":::

1. Create a file named `variables.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/201-azfw-with-avzones/variables.tf":::

1. Create a file named `outputs.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/201-azfw-with-avzones/outputs.tf":::

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

1. Get the firewall name.

    ```console
    firewall_name=$(terraform output -raw firewall_name)
    ```

1. Run [az network firewall show](/cli/azure/network/firewall#az-network-firewall-show) with a [JMESPath](/cli/azure/query-azure-cli) query to display the availability zones for the firewall.

    ```azurecli
    az network firewall show --name $firewall_name --resource-group $resource_group_name --query "{Zones:zones"}
    ```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

Next, you can monitor the Azure Firewall logs.

> [!div class="nextstepaction"]
> [Tutorial: Monitor Azure Firewall logs](./monitor-firewall.md)
