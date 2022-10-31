---
title: 'Quickstart: Create an Azure Front Door (classic) using Terraform'
description: This quickstart describes how to create an Azure Front Door Service using Terraform.
services: front-door
documentationcenter: 
author: johndowns
ms.author: jodowns
ms.date: 10/25/2022
ms.topic: quickstart
ms.service: frontdoor
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
---

# Create a Front Door (classic) using Terraform

This quickstart describes how to use Terraform to create a Front Door (classic) profile to set up high availability for a web endpoint.

The steps in this article were tested with the following Terraform and Terraform provider versions:

- [Terraform v1.3.2](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.3.27.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](~/azure-dev-docs-pr/articles/includes/open-source-devops-prereqs-azure-subscription.md)]

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    ```terraform
    # Configure the Azure provider
    terraform {
      required_providers {
        azurerm = {
          source  = "hashicorp/azurerm"
          version = "~> 3.27.0"
        }
    
        random = {
          source = "hashicorp/random"
        }
      }
    
      required_version = ">= 1.1.0"
    }
    
    provider "azurerm" {
      features {}
    }
    ```

1. Create a file named `resource-group.tf` and insert the following code:

   ```terraform
    resource "azurerm_resource_group" "my_resource_group" {
      name     = var.resource_group_name
      location = var.location
    }
   ```

1. Create a file named `front-door.tf` and insert the following code:

    ```terraform
    locals {
      front_door_name = "afd-${lower(random_id.front_door_name.hex)}"
      front_door_frontend_endpoint_name = "frontEndEndpoint"
      front_door_load_balancing_settings_name = "loadBalancingSettings"
      front_door_health_probe_settings_name = "healthProbeSettings"
      front_door_routing_rule_name = "routingRule"
      front_door_backend_pool_name = "backendPool"
    }
    
    resource "azurerm_frontdoor" "my_front_door" {
      name                = local.front_door_name
      resource_group_name = azurerm_resource_group.my_resource_group.name
    
      frontend_endpoint {
        name      = local.front_door_frontend_endpoint_name
        host_name = "${local.front_door_name}.azurefd.net"
        session_affinity_enabled = false
      }
    
      backend_pool_load_balancing {
        name = local.front_door_load_balancing_settings_name
        sample_size = 4
        successful_samples_required = 2
      }
    
      backend_pool_health_probe {
        name = local.front_door_health_probe_settings_name
        path = "/"
        protocol = "Http"
        interval_in_seconds = 120
      }
    
      backend_pool {
        name = local.front_door_backend_pool_name
        backend {
          host_header = var.backend_address
          address     = var.backend_address
          http_port   = 80
          https_port  = 443
          weight      = 50
          priority    = 1
        }
    
        load_balancing_name = local.front_door_load_balancing_settings_name
        health_probe_name   = local.front_door_health_probe_settings_name
      }
    
      routing_rule {
        name               = local.front_door_routing_rule_name
        accepted_protocols = ["Http", "Https"]
        patterns_to_match  = ["/*"]
        frontend_endpoints = [local.front_door_frontend_endpoint_name]
        forwarding_configuration {
          forwarding_protocol = "MatchRequest"
          backend_pool_name   = local.front_door_backend_pool_name
        }
      }
    }
    ```

1. Create a file named `variables.tf` and insert the following code:

    ```terraform
    variable "location" {
      type = string
      default = "westus2"
    }
    
    variable "resource_group_name" {
      type = string
      default = "FrontDoor"
    }
    
    variable "backend_address" {
      type = string
    }
    
    resource "random_id" "front_door_name" {
      byte_length = 8
    }
    ```

1. Create a file named `terraform.tfvars` and insert the following code, being sure to update the value to your own backend hostname:

    ```terraform
    backend_address = "<your backend hostname>"
    ```

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [Portal](#tab/Portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Resource groups** from the left pane.

1. Select the FrontDoor resource group.

1. Select the Front Door you created and you'll be able to see the endpoint hostname. Copy the hostname and paste it on to the address bar of a browser. Press enter and your request will automatically get routed to the web app.

    :::image type="content" source="./media/create-front-door-bicep/front-door-bicep-web-app-origin-success.png" alt-text="Screenshot of the message: Your web app is running and waiting for your content.":::

# [Azure CLI](#tab/CLI)

Run the following command:

```azurecli-interactive
az resource list --resource-group FrontDoor
```

# [PowerShell](#tab/PowerShell)

Run the following command:

```azurepowershell-interactive
Get-AzResource -ResourceGroupName FrontDoor
```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

In this quickstart, you deployed a simple Front Door (classic) profile using Terraform. [Learn more about Azure Front Door.](front-door-overview.md)
