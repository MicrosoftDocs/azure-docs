---
title: 'Quickstart: Create an Azure Firewall and IP Groups - Terraform'
description: In this quickstart, you learn how to use Terraform to create an Azure Firewall and IP Groups.
services: firewall
author: cshea15
ms.service: firewall
ms.topic: quickstart
ms.custom: devx-track-terraform
ms.author: victorh
ms.date: 10/17/2023
content_well_notification: 
  - AI-contribution
---

# Quickstart: Create an Azure Firewall and IP Groups - Terraform

In this quickstart, you use Terraform to deploy an Azure Firewall with sample IP Groups used in a network rule and application rule. An IP Group is a top-level resource that allows you to define and group IP addresses, ranges, and subnets into a single object. IP Group is useful for managing IP addresses in Azure Firewall rules. You can either manually enter IP addresses or import them from a file.

[!INCLUDE [About Terraform](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

In this article, you learn how to:

> [!div class="checklist"]
> * Create a random value (to be used in the resource group name) using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet)
> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group)
> * Create a random password for the Windows VM using [random_password](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password)
> * Create a random value (to be used as the storage name) using [random_string](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/string)
> * Create an Azure public IP using [azurerm_public_ip](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/public_ip)
> * Create a storage account using [azurerm_storage_account](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_account)
> * Create an Azure Firewall Policy using [azurerm_firewall_policy](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/firewall_policy)
> * Create an Azure Firewall Policy Rule Collection Group using [azurerm_firewall_policy_rule_collection_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/firewall_policy_rule_collection_group)
> * Create an Azure Firewall using [azurerm_firewall](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/firewall)
> * Create an Azure IP group using [azurerm_ip_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/ip_group)
> * Create an Azure Virtual Network using [azurerm_virtual_network](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_network)
> * Create three Azure subnets using [azurerm_subnet](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/subnet)
> * Create a network interface using [azurerm_network_interface](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/network_interface)
> * Create a network security group (to contain a list of network security rules) using [azurerm_network_security_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/network_security_group)
> * Create an association between the network interface and the network security group using - [azurerm_network_interface_security_group_association](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/network_interface_security_group_association)
> * Create an Azure Linux Virtual Machine using [azurerm_linux_virtual_machine](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/linux_virtual_machine)
> * Create a route table using [azurerm_route_table](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/route_table)
> * Create an association between the route table and the subnet using - [azurerm_subnet_route_table_association](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/subnet_route_table_association)
> * Create an AzAPI resource [azapi_resource](https://registry.terraform.io/providers/Azure/azapi/latest/docs/resources/azapi_resource).
> * Create an AzAPI resource to generate an SSH key pair using [azapi_resource_action](https://registry.terraform.io/providers/Azure/azapi/latest/docs/resources/azapi_resource_action).

## Prerequisites

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/201-azfw-with-ipgroups). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/201-azfw-with-ipgroups/TestRecord.md).
>
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/201-azfw-with-ipgroups/providers.tf":::

1. Create a file named `ssh.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/201-azfw-with-ipgroups/ssh.tf":::

1. Create a file named `main.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/201-azfw-with-ipgroups/main.tf":::

1. Create a file named `variables.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/201-azfw-with-ipgroups/variables.tf":::

1. Create a file named `outputs.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/201-azfw-with-ipgroups/outputs.tf":::

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

1. Run [az network ip-group list](/cli/azure/network/ip-group#az-network-ip-group-list) to display the two new IP Groups.

    ```azurecli
    az network ip-group list --resource-group $resource_group_name
    ```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Deploy and configure Azure Firewall in a hybrid network using the Azure portal](tutorial-hybrid-portal.md)
