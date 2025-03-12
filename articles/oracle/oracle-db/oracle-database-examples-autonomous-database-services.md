---
title: Terraform/OpenTofu examples for Oracle Database@Azure services
description: Learn about Terraform/OpenTofu examples for Oracle Database@Azure.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: concept-article
ms.service: oracle-on-azure
ms.date: 08/01/2024
---

# Terraform/OpenTofu examples for Oracle Database@Azure

You can use Terraform by HashiCorp to provision and manage resources for Oracle Database@Azure. Terraform offers the AzAPI provider as a tool to provision and manage infrastructure in Oracle Cloud Infrastructure (OCI).

For more information on reference implementations for Terraform or OpenTofu modules, see the following resources:

* [Quickstart Oracle Database@Azure by using Terraform or OpenTofu modules](https://docs.oracle.com/en/learn/dbazure-terraform/index.html)
* [OCI landing zones](https://github.com/oci-landing-zones/)
* [Azure Verified Modules](https://aka.ms/avm)

> [!NOTE]
> This article provides example code to demonstrate provisioning and managing Oracle Database@Azure resources by using the Terraform provider AzAPI. For detailed AzAPI provider resources and data sources documentation, see [AzAPI provider](https://registry.terraform.io/providers/Azure/azapi/latest/docs) in the Terraform registry.

The samples use example values for illustration. Replace the placeholder example values with values from your scenario.

The samples use [AzAPI dynamic properties](https://techcommunity.microsoft.com/t5/azure-tools-blog/announcing-azapi-dynamic-properties/ba-p/4121855) instead of JSONEncode for more native Terraform behavior.

## Create a delegated subnet for Oracle Database@Azure

```terraform
resource "azurerm_resource_group" "resource_group" {
  location = "eastus"
  name     = "ExampleRG"
}
 
module "avm_odbas_network" {
  source  = "Azure/avm-res-network-virtualnetwork/azurerm"
  version = "0.2.4"
 
  address_space       = ["10.1.0.0/16"]
  location            = "eastus"
  name                = "vnet"
  resource_group_name = azurerm_resource_group.resource_group.name
 
  subnets = {
    delegated = {
      name             = delegated
      address_prefixes = ["10.1.1.0/24"]
 
      delegation = [{
        name = "Oracle.Database/networkAttachments"
        service_delegation = {
          name    = "Oracle.Database/networkAttachments"
          actions = ["Microsoft.Network/networkinterfaces/*", "Microsoft.Network/virtualNetworks/subnets/join/action"]
 
        }
      }]
    }
  }
}
```

## Create an instance of Oracle Exadata Database@Azure

```terraform
{
  required_providers {
    azapi = {
      source = "Azure/azapi"
    }
    azurerm = {
      source = "hashicorp/azurerm"
    }
  }
}
 
data "azurerm_resource_group" "resource_group" {
  name = "ExampleRG"
}
 
data "azurerm_virtual_network" "virtual_network" {
  name                = "ExampleRG_vnet"
  resource_group_name = "ExampleRG"
}
 
data "azurerm_subnet" "subnet" {
  name                 = "delegated"
  virtual_network_name = "ExampleRG_vnet"
  resource_group_name  = "ExampleRG"
}
  
resource "azapi_resource" "autonomous_db" {
  type                      = "Oracle.Database/autonomousDatabases@2023-09-01"
  parent_id                 = data.azurerm_resource_group.resource_group.id
  name                      = "demodb"
  schema_validation_enabled = false
 
  timeouts {
    create = "3h"
    update = "2h"
    delete = "1h"
  }
 
  body = {
    "location" : "eastus",
    "properties" : {
      "displayName" : "demodb",
      "computeCount" : 2,
      "dataStorageSizeInTbs" : 1,
      "adminPassword" : "TestPass#2024#",
      "dbVersion" : "19c",
      "licenseModel" : "LicenseIncluded",
      "dataBaseType" : "Regular",
      "computeModel" : "ECPU",
      "dbWorkload" : "DW",
      "permissionLevel" : "Restricted",
 
      "characterSet" : "AL32UTF8",
      "ncharacterSet" : "AL16UTF16",
 
      "isAutoScalingEnabled" : true,
      "isAutoScalingForStorageEnabled" : false,
 
      "vnetId" : data.azurerm_virtual_network.virtual_network.id
      "subnetId" : data.azurerm_subnet.subnet.id
    }
  }
  response_export_values = ["id", "properties.ocid", "properties"]
}
```
