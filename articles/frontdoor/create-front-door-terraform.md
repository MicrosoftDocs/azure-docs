---
title: 'Quickstart: Create a Azure Front Door Standard/Premium profile using Terraform'
description: This quickstart describes how to create an Azure Front Door Standard/Premium using Terraform.
services: front-door
author: johndowns
ms.author: jodowns
ms.date: 10/25/2022
ms.topic: quickstart
ms.service: frontdoor
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
---

# Create a Front Door Standard/Premium profile using Terraform

This quickstart describes how to use Terraform to create a Front Door profile to set up high availability for a web endpoint.

The steps in this article were tested with the following Terraform and Terraform provider versions:

- [Terraform v1.3.2](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.3.27.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](~/azure-dev-docs-pr/articles/includes/open-source-devops-prereqs-azure-subscription.md)]

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)
- IP address or FQDN of a website or web application.

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

1. Create a file named `app-service.tf` and insert the following code:

    ```terraform
    locals {
      app_name = "myapp-${lower(random_id.app_name.hex)}"
      app_service_plan_name = "AppServicePlan"
    }
    
    resource "azurerm_service_plan" "app_service_plan" {
      name                = local.app_service_plan_name
      location            = var.location
      resource_group_name = azurerm_resource_group.my_resource_group.name
    
      sku_name = var.app_service_plan_sku_name
      os_type = "Windows"
      worker_count = var.app_service_plan_capacity
    }
    
    resource "azurerm_windows_web_app" "app" {
      name                = local.app_name
      location            = var.location
      resource_group_name = azurerm_resource_group.my_resource_group.name
      service_plan_id = azurerm_service_plan.app_service_plan.id
    
      https_only = true
    
      site_config {
        ftps_state = "Disabled"
        minimum_tls_version = "1.2"
        ip_restriction = [ {
          service_tag = "AzureFrontDoor.Backend"
          ip_address = null
          virtual_network_subnet_id = null
          action = "Allow"
          priority = 100
          headers = [ {
            x_azure_fdid = [ azurerm_cdn_frontdoor_profile.my_front_door.resource_guid ]
            x_fd_health_probe = []
            x_forwarded_for   = []
            x_forwarded_host  = []
          } ]
          name = "Allow traffic from Front Door"  
        } ]
      }
    }
    ```

1. Create a file named `front-door.tf` and insert the following code:

    ```terraform
    locals {
      front_door_profile_name = "MyFrontDoor"
      front_door_endpoint_name = "afd-${lower(random_id.front_door_endpoint_name.hex)}"
      front_door_origin_group_name = "MyOriginGroup"
      front_door_origin_name = "MyAppServiceOrigin"
      front_door_route_name = "MyRoute"
    }
    
    resource "azurerm_cdn_frontdoor_profile" "my_front_door" {
      name                = local.front_door_profile_name
      resource_group_name = azurerm_resource_group.my_resource_group.name
      sku_name            = var.front_door_sku_name
    }
    
    resource "azurerm_cdn_frontdoor_endpoint" "my_endpoint" {
      name                     = local.front_door_endpoint_name
      cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.my_front_door.id
    }
    
    resource "azurerm_cdn_frontdoor_origin_group" "my_origin_group" {
      name                     = local.front_door_origin_group_name
      cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.my_front_door.id
      session_affinity_enabled = true
    
      load_balancing {
        sample_size                 = 4
        successful_samples_required = 3
      }
    
      health_probe {
        path                = "/"
        request_type        = "HEAD"
        protocol            = "Https"
        interval_in_seconds = 100
      }
    }
    
    resource "azurerm_cdn_frontdoor_origin" "my_app_service_origin" {
      name                          = local.front_door_origin_name
      cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.my_origin_group.id
    
      enabled            = true
      host_name          = azurerm_windows_web_app.app.default_hostname
      http_port          = 80
      https_port         = 443
      origin_host_header = azurerm_windows_web_app.app.default_hostname
      priority           = 1
      weight             = 1000
      certificate_name_check_enabled = true
    }
    
    resource "azurerm_cdn_frontdoor_route" "my_route" {
      name                          = local.front_door_route_name
      cdn_frontdoor_endpoint_id     = azurerm_cdn_frontdoor_endpoint.my_endpoint.id
      cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.my_origin_group.id
      cdn_frontdoor_origin_ids      = [azurerm_cdn_frontdoor_origin.my_app_service_origin.id]
    
      supported_protocols    = ["Http", "Https"]
      patterns_to_match      = ["/*"]
      forwarding_protocol    = "HttpsOnly"
      link_to_default_domain = true
      https_redirect_enabled = true
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
    
    variable "app_service_plan_sku_name" {
      type = string
      default = "S1"
    }
    
    variable "app_service_plan_capacity" {
      type = number
      default = 1
    }
    
    variable "app_service_plan_sku_tier_name" {
      type = string
      default = "Standard"
    }
    
    variable "front_door_sku_name" {
      type        = string
      default     = "Standard_AzureFrontDoor"
      validation {
        condition     = contains(["Standard_AzureFrontDoor", "Premium_AzureFrontDoor"], var.front_door_sku_name)
        error_message = "The SKU value must be Standard_AzureFrontDoor or Premium_AzureFrontDoor."
      }
    }
    
    resource "random_id" "app_name" {
      byte_length = 8
    }
    
    resource "random_id" "front_door_endpoint_name" {
      byte_length = 8
    }
    ```

1. Create a file named `outputs.tf` and insert the following code:

    ```terraform
    output "frontDoorEndpointHostName" {
      value = azurerm_cdn_frontdoor_endpoint.my_endpoint.host_name
    }
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

In this quickstart, you deployed a simple Front Door profile using Terraform. [Learn more about Azure Front Door.](front-door-overview.md)
