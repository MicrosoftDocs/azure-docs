---
title: 'Quickstart: Use Terraform to configure a virtual network in Azure'
description: In this quickstart, you create a virtual network, subnets, private DNS zones, network interfaces, Windows virtual machines, a private DNS A record, network security groups, and a network security rule in Azure.
ms.topic: quickstart
ms.date: 12/09/2024
ms.custom: devx-track-terraform
ms.service: azure-virtual-network
author: greg-lindsay
ms.author: greglin
#customer intent: As a Terraform user, I want to see how to create a virtual network with a subnet, a private DNS zone, and Windows virtual machines in Azure.
content_well_notification: 
  - AI-contribution
---

# Quickstart: Use Terraform to configure a virtual network in Azure

In this quickstart, you use Terraform to create a virtual network, subnets, private DNS zones, network interfaces, Windows virtual machines, a private DNS A record, network security groups, and a network security rule in Azure.
An Azure virtual network is a fundamental component of the Azure networking model, providing isolation and protection for your virtual machines. It's used to control and manage traffic between resources such as virtual machines within a network.
In addition to the Azure virtual network, this code also creates:

* Subnets within the network.
* Private DNS zones for name resolution.
* Network interfaces for the virtual machines.
* Network security groups to control inbound and outbound traffic.
* Windows virtual machines with random passwords for administration.

[!INCLUDE [About Terraform](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

> [!div class="checklist"]
> * Specify the required version and providers for Terraform.
> * Define variables for the resource group location, name prefix, address space, address prefixes, private DNS zone name, and admin username.
> * Generate a random pet name for the resource group.
> * Create an Azure resource group with a unique name.
> * Generate a random string for unique naming.
> * Create a virtual network with a unique name.
> * Create a subnet within the virtual network.
> * Create a private DNS zone.
> * Link the private DNS zone to the virtual network.
> * Generate random passwords for the virtual machines.
> * Create two network interfaces.
> * Create two Windows virtual machines, and attach the network interfaces.
> * Create a private DNS A record.
> * Create a network security group.
> * Create a network security rule to allow ICMP traffic.
> * Output the names and admin credentials of the virtual machines.

## Prerequisites

- Create an Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure).

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-dns-private-zone). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-dns-private-zone/TestRecord.md).
> 
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform).

1. Create a directory in which to test and run the sample Terraform code, and make it the current directory.

1. Create a file named `main.tf`, and insert the following code.
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-dns-private-zone/main.tf":::

1. Create a file named `outputs.tf`, and insert the following code.
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-dns-private-zone/outputs.tf":::

1. Create a file named `providers.tf`, and insert the following code.
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-dns-private-zone/providers.tf":::

1. Create a file named `variables.tf`, and insert the following code.
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-dns-private-zone/variables.tf":::

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

### [Azure CLI](#tab/azure-cli)

1. Run `az network private-dns zone list` to view all DNS zones and find yours.

   ```azurecli
   az network private-dns zone list --output table
   ```

1. Run `az network private-dns zone show` to view the resource group associate with your DNS zone.

   ```azurecli
   az network private-dns zone show --name <dnsZoneName> --resource-group <resourceGroupName>
   ```

   Replace `<dnsZoneName>` with the name of your DNS zone and `<resourceGroupName>` with the name of your resource group.

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot).

## Next steps

> [!div class="nextstepaction"]
> [See more articles about Azure virtual network](/search/?terms=Azure%20virtual%20network%20and%20terraform).
