---
title: 'Quickstart: Use Terraform to configure Azure Web Application Firewall v2 on Azure Application Gateway'
description: In this quickstart, you use Terraform to create an Azure Application Gateway with an Azure Web Application Firewall (WAF) v2 policy. A virtual network with a subnet, a static public IP address, a WAF policy with custom rules, and Azure Application Gateway with autoscaling work together to block specific IP addresses.
ms.topic: quickstart
ms.date: 04/08/2025
ms.custom: devx-track-terraform
ms.service: azure-web-application-firewall
author: halkazwini
ms.author: halkazwini
#customer intent: As a Terraform user, I want to learn how to configure Azure Web Application Firewall v2 on Azure Application Gateway.
content_well_notification: 
  - AI-contribution
# Customer intent: As a cloud engineer using infrastructure as code, I want to configure an Azure Application Gateway with WAF policies using Terraform, so that I can ensure secure and efficient management of web traffic for my applications.
---

# Quickstart: Use Terraform to configure Azure Web Application Firewall v2 on Azure Application Gateway

In this quickstart, you use Terraform to create an Azure Application Gateway with an Azure Web Application Firewall (WAF) v2 policy. A key component of creating scalable, reliable, and secure web front ends in Azure, Application Gateway is a web traffic load balancer that helps you to manage traffic to your web applications. Application Gateway bases how it routes traffic on factors that include round-robin, cookie-based sessions, and more. In addition to an Application Gateway, this code also creates a resource group, virtual network, subnet within the virtual network, public IP address, and a WAF policy with custom rules to block traffic from a specific IP address.

[!INCLUDE [About Terraform](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

> [!div class="checklist"]
> * Define the IP address that the WAF custom rule should block.
> * Create an Azure resource group with a unique name.
> * Establish a virtual network with a specific name and address.
> * Generate a random name for the subnet, and create a subnet in the virtual network.
> * Generate a public IP address.
> * Create a WAF policy.
> * Configure settings and define managed rules for the WAF policy.
> * Create a custom rule to block traffic from a specific IP address.
> * Set up the Application Gateway.
> * Configure the SKU and capacity of the Application Gateway.
> * Enable autoscaling for the Application Gateway.
> * Configure the gateway's IP settings.
> * Set up the front-end IP configuration, and define the front-end port.
> * Define the back-end address pool with IP addresses, and configure back-end HTTP settings.
> * Define the HTTP listener.
> * Define the request routing rule.
> * Associate the WAF policy with the Application Gateway.
> * Output the resource group name, public IP address, Application Gateway ID, WAF policy ID, and Application Gateway.

## Prerequisites

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Terraform. For more information, see [Install and configure Terraform](/azure/developer/terraform/quickstart-configure).

## Implement the Terraform code

The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-web-application-firewall). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-web-application-firewall/TestRecord.md). See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform).

1. Create a directory in which to test and run the sample Terraform code, and make it the current directory.

1. Create a file named `main.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-web-application-firewall/main.tf":::

1. Create a file named `outputs.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-web-application-firewall/outputs.tf":::

1. Create a file named `providers.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-web-application-firewall/providers.tf":::

1. Create a file named `variables.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-web-application-firewall/variables.tf":::

> [!IMPORTANT]
> If you're using the 4.x azurerm provider, you must [explicitly specify the Azure subscription ID](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/4.0-upgrade-guide#specifying-subscription-id-is-now-mandatory) to authenticate to Azure before running the Terraform commands.
>
> One way to specify the Azure subscription ID without putting it in the `providers` block is to specify the subscription ID in an environment variable named `ARM_SUBSCRIPTION_ID`.
>
> For more information, see the [Azure provider reference documentation](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs#argument-reference).

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

1. Get the public IP address.

    ```console
    public_ip_address=$(terraform output -raw public_ip_address)
    ```

1. Get the WAF policy ID.

    ```console
    web_application_firewall_policy_id=$(terraform output -raw web_application_firewall_policy_id)
    ```

1. Get the Application Gateway ID.

    ```console
    application_gateway_id=$(terraform output -raw application_gateway_id)
    ```

1. Run `az network application-gateway show` to view the Application Gateway.

    ```azurecli
    az appservice ase show --name $application_gateway_name --resource-group $resource_group_name  
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Get the Azure resource group name.

    ```console
    $resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the public IP address.

    ```console
    $public_ip_address=$(terraform output -public_ip_address)
    ```

1. Get the WAF policy ID.

    ```console
    $web_application_firewall_policy_id=$(terraform output -web_application_firewall_policy_id)
    ```

1. Get the Application Gateway ID.

    ```console
    $application_gateway_id=$(terraform output -application_gateway_id)
    ```

1. Run `Get-AzAppServiceEnvironment` to view the Application Gateway.

    ```azurepowershell
    Get-AzApplicationGateway -Name $application_gateway_name -ResourceGroupName $resource_group_name 
    ```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot).

## Related content

- [Create Web Application Firewall policies for Application Gateway](/azure/web-application-firewall/ag/create-waf-policy-ag)
- [Associate a WAF policy with an existing Application Gateway](/azure/web-application-firewall/ag/associate-waf-policy-existing-gateway)
- [Customize Web Application Firewall rules](/azure/web-application-firewall/ag/application-gateway-customize-waf-rules-portal)
