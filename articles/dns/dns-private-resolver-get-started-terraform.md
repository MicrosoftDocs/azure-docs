---
title: 'Quickstart: Create an Azure DNS Private Resolver using Terraform'
description: In this quickstart, you learn how to use Terraform to create and manage an Azure DNS Private Resolver. 
ms.topic: quickstart
ms.date: 02/18/2025
ms.custom: devx-track-terraform
ms.service: azure-dns
author: asudbring
ms.author: allensu
#customer intent: As a Terraform user, I want to learn how to use Terraform to create and manage an Azure DNS Private Resolver.
content_well_notification: 
  - AI-contribution
# Customer intent: As a Terraform user, I want to create and manage an Azure DNS Private Resolver using Terraform, so that I can enable custom domain name resolution within my private Azure network efficiently.
---

# Quickstart: Create an Azure DNS Private Resolver using Terraform

This quickstart describes how to use Terraform to create an Azure DNS Private Resolver. Azure private DNS resolver is a service that provides custom domain name resolution for your private Azure network. It's used to resolve domain names in a virtual network without needing to add a custom DNS solution. The resources created include the Azure DNS Private Resolver, a virtual network, and a subnet. The DNS resolver is associated with the virtual network, and the subnet is configured with a delegation to the DNS Private Resolver service.

[!INCLUDE [About Terraform](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

The following figure summarizes the general setup used. Subnet address ranges used in templates are slightly different than those shown in the figure.

:::image type="content" source="./media/dns-resolver-getstarted-portal/resolver-components.png" alt-text="Conceptual figure displaying components of the private resolver." lightbox="./media/dns-resolver-getstarted-portal/resolver-components.png":::

> [!div class="checklist"]
> * Create an Azure resource group with a unique name.
> * Establish an Azure virtual network within the created resource group.
> * Define a subnet within the virtual network, and delegate DNS Private Resolver service to it.
> * Set up DNS Private Resolver within the resource group, and associate it with the virtual network.
> * View DNS Private Resolver within the resource group.

## Prerequisites

- If you don't have an Azure account, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure).

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-dns-private-resolver). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-dns-private-resolver/TestRecord.md).
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform).

1. Create a directory in which to test and run the sample Terraform code, and make it the current directory.

1. Create a file named `main.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-dns-private-resolver/main.tf":::

1. Create a file named `outputs.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-dns-private-resolver/outputs.tf":::

1. Create a file named `providers.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-dns-private-resolver/providers.tf":::

1. Create a file named `variables.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-dns-private-resolver/variables.tf":::

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

1. Run `az network dns record-set list` to view the DNS Private Resolver service.

   ```azurecli
   az network dns record-set list --output table
   ```

1. Run `az network private-dns zone show` to view the DNS Private Resolver service within the resource group.

    ```azurecli
    az network private-dns zone show --name $private_dns_zone_name --resource-group $resource_group_name 
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Get the Azure resource group name.

    ```console
    $resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Run `Get-AzDnsRecordSet` to view the DNS Private Resolver service.

    ```azurepowershell
    Get-AzDnsRecordSet -ZoneName $private_dns_zone_name -ResourceGroupName $resource_group_name | Format-Table
    ```

1. Run `Get-AzPrivateDnsZone` to view the DNS Private Resolver service within the resource group.

    ```azurepowershell
    Get-AzPrivateDnsZone -Name $private_dns_zone_name -ResourceGroupName $resource_group_name
    ```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot).

## Next steps

> [!div class="nextstepaction"]
> [See more articles about Azure DNS Private Resolver](/search/?terms=Azure%20private%20dns%20resolver%20and%20terraform).
