---
title: 'Quickstart: Use Terraform to deploy Azure Bastion'
description: In this quickstart, you learn how to use Terraform to create Azure resources for an Azure Bastion deployment.'
ms.topic: quickstart
ms.date: 01/22/2025
ms.custom: devx-track-terraform
ms.service: azure-bastion
author: abell
ms.author: abell
#customer intent: As a Terraform user, I want to learn how to use Terraform to create Azure resources that set up Azure Bastion host. The Azure resources in an Azure Bastion deployment include an Azure resource group, a virtual network, an Azure Bastion subnet, a public IP, and an Azure Bastion host.
content_well_notification: 
  - AI-contribution
# Customer intent: As a Terraform user, I want to automate the deployment of Azure Bastion and its associated resources, so that I can securely access my virtual machines without exposing them to public networks.
---

# Quickstart: Use Terraform to deploy Azure Bastion

In this Quickstart, you learn how to use Terraform to deploy [Azure Bastion](bastion-overview.md) automatically in the Azure portal. To do this, you create an Azure Bastion host and its corresponding Azure resources, which include a resource group, virtual network, Azure Bastion subnet, and a public IP. This setup ensures a secure, private network environment for your Azure services. The following diagram provides an overview of Azure Bastion deployments:

:::image type="content" source="./media/create-host/host-architecture.png" alt-text="Diagram that shows the Azure Bastion architecture." lightbox="./media/create-host/host-architecture.png":::

Deploying Azure Bastion allows you to use RDP and SSH to access to your virtual machines within the Azure portal. This service is provisioned directly in your virtual network and supports all virtual machines there, reducing exposure to public network connections. When you deploy Bastion automatically, Bastion is deployed with the Standard SKU. To deploy with Bastion Developer instead, see [Quickstart: Connect with Azure Bastion Developer](quickstart-developer.md). See the [Azure Bastion deployment guidance](design-architecture.md) for more information about how to customize your Azure Bastion deployment.

[!INCLUDE [About Terraform](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

> [!div class="checklist"]
> * Create an Azure resource group with a unique name.
> * Establish a virtual network with a specified name and address.
> * Set up a subnet specifically for Azure Bastion within the created virtual network.
> * Allocate a static, standard public IP for Azure Bastion within the resource group.
> * Construct an Azure Bastion host with a specified IP configuration within the resource group.
> * Output the names and IP address of the resource group, plus the Azure Bastion host.

## Prerequisites

- Create an Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure).

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-azure-bastion-host). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-azure-bastion-host/TestRecord.md).
> 
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform).

1. Create a directory in which to test and run the sample Terraform code, and make it the current directory.

1. Create a file named `main.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-azure-bastion-host/main.tf":::

1. Create a file named `outputs.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-azure-bastion-host/outputs.tf":::

1. Create a file named `providers.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-azure-bastion-host/providers.tf":::

1. Create a file named `variables.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-azure-bastion-host/variables.tf":::

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

1. Get the Azure Bastion host name.

    ```console
    bastion_host_name=$(terraform output -raw bastion_host_name)
    ```

1. Get the Azure Bastion host ip address.

    ```console
    bastion_host_ip=$(terraform output -raw bastion_host_ip)
    ```

1. Run [`az network bastion show`](/cli/azure/network/bastion#az-network-bastion-show) to view the Azure Bastion host.

    ```azurecli
    az network bastion show --name $bastion_host_name --resource-group $resource_group_name
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Get the Azure resource group name.

    ```console
    $resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the Azure Bastion host name.

    ```console
    $bastion_host_name=$(terraform output -raw bastion_host_name)
    ```

1. Get the Azure Bastion host ip address.

    ```console
    $bastion_host_ip=$(terraform output -raw bastion_host_ip)
    ```

1. Run [`Get-AzBastionHost`](/powershell/module/az.network/get-azbastion) to view the Azure Bastion host.

    ```azurepowershell
    Get-AzBastionHost -ResourceGroupName $resource_group_name -Name $bastion_host_name
    ```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot).

## Next steps

In this quickstart, you used Terraform to create an Azure resource group and other complimentary Azure resources to set up an Azure Bastion host. Next, you can explore the following resources to learn more about Azure Bastion and Terraform.

> [!div class="nextstepaction"]
> [Azure Bastion and Terraform articles](/search/?terms=Azure%20bastion%20host%20and%20terraform)
