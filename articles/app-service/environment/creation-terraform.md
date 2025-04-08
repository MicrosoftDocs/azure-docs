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

In this quickstart, you use [Terraform](/azure/developer/terraform) to create an App Service Environment, single-tenant deployment of Azure App Service. You use it with an Azure virtual network. You need one subnet for a deployment of App Service Environment, and this subnet can't be used for anything else.  resource group, virtual network, and a subnet to configure an Azure App Service Environment v3.

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

## Before you create your App Service Environment

After you create your App Service Environment, you can't change any of the following:

- Location
- Subscription
- Resource group
- Azure virtual network
- Subnets
- Subnet size
- Name of your App Service Environment

Make your subnet large enough to hold the maximum size that you'll scale your App Service Environment. The recommended size is a **/24** with **256 addresses**.

## Deployment considerations

Before you deploy your App Service Environment, think about the virtual IP (VIP) type and the deployment type.

With an *internal VIP*, an address in your App Service Environment subnet reaches your apps. Your apps aren't on a public DNS. When you create your App Service Environment in the Azure portal, you have an option to create an Azure private DNS zone for your App Service Environment. With an *external VIP*, your apps are on an address facing the public internet, and they're in a public DNS.  For both *internal VIP* and *external VIP* you can specify *Inbound IP address*, you can select *Automatic* or *Manual* options. If you want to use the *Manual* option for an *external VIP*, you must first create a standard *Public IP address* in Azure. 

For the deployment type, you can choose *single zone*, *zone redundant*, or *host group*. The single zone is available in all regions where App Service Environment v3 is available. With the single zone deployment type, you have a minimum charge in your App Service plan of one instance of Windows Isolated v2. As soon as you use one or more instances, then that charge goes away. It isn't an additive charge.

In a zone redundant App Service Environment, your apps spread across three zones in the same region. Zone redundant is available in regions that support availability zones. With this deployment type, the smallest size for your App Service plan is three instances. That ensures that there's an instance in each availability zone. App Service plans can be scaled up one or more instances at a time. Scaling doesn't need to be in units of three, but the app is only balanced across all availability zones when the total instances are multiples of three.

A zone redundant deployment has triple the infrastructure, and ensures that even if two of the three zones go down, your workloads remain available. Due to the increased system need, the minimum charge for a zone redundant App Service Environment is 18 cores. If you've fewer than this number of cores across all App Service plans in your App Service Environment, the difference is charged as Windows I1v2. If you've 18 or more cores, there's no added charge to have a zone redundant App Service Environment. To learn more about zone redundancy, see [Regions and availability zones](./overview-zone-redundancy.md). For sample calculations for zone redundant App Service Environment, see [App Service Environment pricing](overview.md#pricing).

In a host group deployment, your apps are deployed onto a dedicated host group. The dedicated host group isn't zone redundant. With this type of deployment, you can install and use your App Service Environment on dedicated hardware. There's no minimum instance charge for using App Service Environment on a dedicated host group, but you do have to pay for the host group when you're provisioning the App Service Environment. You also pay a discounted App Service plan rate as you create your plans and scale out.

With a dedicated host group deployment, there are a finite number of cores available that are used by both the App Service plans and the infrastructure roles. This type of deployment can't reach the 200 total instance count normally available in App Service Environment. The number of total instances possible is related to the total number of App Service plan instances, plus the load-based number of infrastructure roles.

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-app-service-environment). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-app-service-environment/TestRecord.md).
> 
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform).

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
