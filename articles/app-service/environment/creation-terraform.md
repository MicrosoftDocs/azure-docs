---
title: 'Quickstart: Use Terraform to configure an Azure App Service Environment v3'
description: In this quickstart, you learn how to configure an Azure App Service Environment v3. 
ms.topic: quickstart
ms.date: 04/08/2025
ms.custom: devx-track-terraform
ms.service: azure-app-service
author: cephalin
ms.author: cephalin
#customer intent: As a Terraform user, I want to learn how to configure an Azure App Service Environment v3.
content_well_notification: 
  - AI-contribution
---

# Quickstart: Use Terraform to configure an Azure App Service Environment v3

In this quickstart, you use [Terraform](/azure/developer/terraform) to create an App Service Environment, single-tenant deployment of Azure App Service. You use it with an Azure virtual network. You need one subnet for a deployment of App Service Environment, and this subnet can't be used for anything else. You create a resource group, virtual network, and a subnet to configure an Azure App Service Environment v3.

In this article, you learn how to:

> [!div class="checklist"]
> * Create an Azure resource group with a unique name.
> * Establish a virtual network with a specified name and address.
> * Generate a random name for the subnet, and create a subnet in the virtual network.
> * Delegate the subnet to the Microsoft.Web/hostingEnvironments service.
> * Generate a random name for the App Service Environment v3, and create an App Service Environment v3 in the subnet.
> * Set the internal load-balancing mode for the App Service Environment v3.
> * Set cluster settings for the App Service Environment v3.
> * Tag the App Service Environment v3.
> * Output the names of the resource group, virtual network, subnet, and App Service Environment v3.

## Prerequisites

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Terraform. For more information, see [Install and configure Terraform](/azure/developer/terraform/quickstart-configure).

> [!IMPORTANT]
> If you're using the 4.x azurerm provider, you must [explicitly specify the Azure subscription ID](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/4.0-upgrade-guide#specifying-subscription-id-is-now-mandatory) to authenticate to Azure before running the Terraform commands.
>
> One way to specify the Azure subscription ID without putting it in the `providers` block is to specify the subscription ID in an environment variable named `ARM_SUBSCRIPTION_ID`.
>
> For more information, see the [Azure provider reference documentation](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs#argument-reference).

## Implement the Terraform code

The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-app-service-environment). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-app-service-environment/TestRecord.md). See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform).

1. Create a directory in which to test and run the sample Terraform code, and make it the current directory.

1. Create a file named `main.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-app-service-environment/main.tf":::

1. Create a file named `outputs.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-app-service-environment/outputs.tf":::

1. Create a file named `providers.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-app-service-environment/providers.tf":::

1. Create a file named `variables.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-app-service-environment/variables.tf":::

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

1. Get the virtual network name.

    ```console
    virtual_network_name=$(terraform output -raw virtual_network_name)
    ```

1. Get the subnet name.

    ```console
    subnet_name=$(terraform output -raw subnet_name)
    ```

1. Run `az appservice ase show` to view the App Service Environment v3.

    ```azurecli
    az appservice ase show --name $app_service_environment_v3_name --resource-group $resource_group_name  
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Get the Azure resource group name.

    ```console
    $resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the virtual network name.

    ```console
    $virtual_network_name=$(terraform output -virtual_network_name)
    ```

1. Get the subnet name.

    ```console
    $subnet_name=$(terraform output -subnet_name)
    ```

1. Run `Get-AzAppServiceEnvironment` to view the AKS cluster within the Azure Extended Zone.

    ```azurepowershell
    Get-AzAppServiceEnvironment -Name $app_service_environment_v3_name -ResourceGroupName $resource_group_name 
    ```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot).

## Next steps

> [!div class="nextstepaction"]
> [See more articles about Azure app service environment v3.](/search/?terms=Azure%20app%20service%20environment%20v3%20and%20terraform)
