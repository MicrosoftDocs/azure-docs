---
title: 'Terraform: Deploy frontend Web App and backend Web App securely connected with VNet Integration and Private Endpoint'
description: Learn how to use terraform provider for App Service to deploy two web apps connected securely with Private Endpoint and VNet Integration
author: ericgre
ms.assetid: 3e5d1bbd-5581-40cc-8f65-bc74f1802156
ms.topic: sample
ms.date: 12/06/2022
ms.author: ericg
ms.service: app-service
ms.workload: web
ms.custom: devx-track-terraform
---

# Create two web apps connected securely with Private Endpoint and VNet integration

This article illustrates an example use of [Private Endpoint](../networking/private-endpoint.md) and regional [VNet integration](../overview-vnet-integration.md) to connect two web apps (frontend and backend) securely with the following terraform configuration:
- Deploy a VNet
- Create the first subnet for the integration
- Create the second subnet for the private endpoint, you have to set a specific parameter to disable network policies
- Deploy one App Service plan of type PremiumV2 or PremiumV3, required for Private Endpoint feature
- Create the frontend web app with specific app settings to consume the private DNS zone, [more details](../overview-vnet-integration.md#azure-dns-private-zones)
- Connect the frontend web app to the integration subnet
- Create the backend web app
- Create the DNS private zone with the name of the private link zone for web app privatelink.azurewebsites.net
- Link this zone to the VNet
- Create the private endpoint for the backend web app in the endpoint subnet, and register DNS names (website and SCM) in the previously created DNS private zone

## How to use terraform in Azure

Browse to the [Azure documentation](/azure/developer/terraform/) to learn how to use terraform with Azure.

## The complete terraform file

To use this file, replace the placeholders _\<unique-frontend-app-name>_ and _\<unique-backend-app-name>_ (app name is used to form a unique DNS name worldwide). 

```hcl
terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
}
provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "appservice-rg"
  location = "francecentral"
}

resource "azurerm_virtual_network" "vnet" {
  name                = "vnet"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  address_space       = ["10.0.0.0/16"]
}

resource "azurerm_subnet" "integrationsubnet" {
  name                 = "integrationsubnet"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
  delegation {
    name = "delegation"
    service_delegation {
      name = "Microsoft.Web/serverFarms"
    }
  }
}

resource "azurerm_subnet" "endpointsubnet" {
  name                 = "endpointsubnet"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.2.0/24"]
  private_endpoint_network_policies_enabled = true
}

resource "azurerm_service_plan" "appserviceplan" {
  name                = "appserviceplan"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Windows"
  sku_name            = "P1v2"
}

resource "azurerm_windows_web_app" "frontwebapp" {
  name                = "<unique-frontend-app-name>"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id = azurerm_service_plan.appserviceplan.id

  site_config {}
  app_settings = {
    "WEBSITE_DNS_SERVER": "168.63.129.16",
    "WEBSITE_VNET_ROUTE_ALL": "1"
  }
}

resource "azurerm_app_service_virtual_network_swift_connection" "vnetintegrationconnection" {
  app_service_id  = azurerm_windows_web_app.frontwebapp.id
  subnet_id       = azurerm_subnet.integrationsubnet.id
}

resource "azurerm_windows_web_app" "backwebapp" {
  name                = "<unique-backend-app-name>"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id = azurerm_service_plan.appserviceplan.id

  site_config {}
}

resource "azurerm_private_dns_zone" "dnsprivatezone" {
  name                = "privatelink.azurewebsites.net"
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_private_dns_zone_virtual_network_link" "dnszonelink" {
  name = "dnszonelink"
  resource_group_name = azurerm_resource_group.rg.name
  private_dns_zone_name = azurerm_private_dns_zone.dnsprivatezone.name
  virtual_network_id = azurerm_virtual_network.vnet.id
}

resource "azurerm_private_endpoint" "privateendpoint" {
  name                = "backwebappprivateendpoint"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  subnet_id           = azurerm_subnet.endpointsubnet.id

  private_dns_zone_group {
    name = "privatednszonegroup"
    private_dns_zone_ids = [azurerm_private_dns_zone.dnsprivatezone.id]
  }

  private_service_connection {
    name = "privateendpointconnection"
    private_connection_resource_id = azurerm_windows_web_app.backwebapp.id
    subresource_names = ["sites"]
    is_manual_connection = false
  }
}
```

## Next steps


> [Learn more about using Terraform in Azure](/azure/developer/terraform/)
