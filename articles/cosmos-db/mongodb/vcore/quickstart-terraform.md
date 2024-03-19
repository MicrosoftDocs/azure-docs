---
title: |
  Quickstart: Create a cluster with Terraform
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: In this quickstart, create a new Azure Cosmos DB for MongoDB vCore cluster to store databases, collections, and documents by using Terraform.
author: gahl-levy
ms.author: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: quickstart
ms.date: 03/18/2024
---

# Azure Cosmos DB for MongoDB (vCore) with Terraform
This document provides instructions on using Terraform to deploy Azure Cosmos DB for MongoDB vCore resources. This involves directly calling the ARM API through Terraform. Full support for Terraform is targetted for the second half of 2024.

## Prerequisites
- Terraform installed on your machine.
- An Azure subscription.

## Terraform Configuration
Create a main.tf file and include the following configuration. Replace the resource group placeholder values (and region if needed) with your own:

```hcl
terraform {
  required_providers {
    azurerm = { # <--- Note that it is azurerm
      source = "hashicorp/azurerm"
      version = "3.94.0"
    }
  }
}
provider "azurerm" {
  features {}
}
resource "azurerm_resource_group" "example" { # replace if needed
  name     = "RESOURCE_GROUP" # replace
  location = "West Europe" # replace if needed
}
resource "azurerm_resource_group_template_deployment" "terraform-arm" {
  name                = "terraform-arm-01"
  resource_group_name = azurerm_resource_group.example.name
  deployment_mode     = "Incremental"
  template_content    = file("template.json") 
}
```

Create a template.json file and populate it with the following JSON content, making sure to replace placeholder values (CLUSTER_NAME, TEMPLATE_NAME, region, node specs, administratorLogin, administratorLoginPassword), with your specific configurations:

```json
{
    "$schema": https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#,
    "contentVersion": "1.0.0.0",
    "parameters": {
        "CLUSTER_NAME": { // replace
            "defaultValue": "TEMPLATE_NAME", // replace
            "type": "String"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.DocumentDB/mongoClusters",
            "apiVersion": "2023-11-15-preview",
            "name": "[parameters('CLUSTER_NAME')]", // replace
            "location": "westeurope", // replace if needed
            "properties": {
                "clusterStatus": "Ready",
                "administratorLogin": "", // replace
                "administratorLoginPassword" : "", // replace
                "serverVersion": "6.0",
                "nodeGroupSpecs": [
                    {
                        "kind": "Shard",
                        "sku": "M40", // replace if needed
                        "diskSizeGB": 128,
                        "enableHa": false, // replace if needed
                        "nodeCount": 1
                    }
                ]
            }
        },
        {
            "type": "Microsoft.DocumentDB/mongoClusters/firewallRules",
            "apiVersion": "2023-11-15-preview",
            "name": "[concat(parameters('CLUSTER_NAME'), '/allowAll')]", // replace
            "dependsOn": [
                "[resourceId('Microsoft.DocumentDB/mongoClusters', parameters('CLUSTER_NAME'))]" // replace
            ],
            "properties": {
                "startIpAddress": "0.0.0.0",
                "endIpAddress": "255.255.255.255"
            }
        },
        {
            "type": "Microsoft.DocumentDB/mongoClusters/firewallRules",
            "apiVersion": "2023-11-15-preview",
            "name": "[concat(parameters('CLUSTER_NAME'), '/AllowAllAzureServicesAndResourcesWithinAzureIps_2023-12-6_17-3-22')]", // replace
            "dependsOn": [
                "[resourceId('Microsoft.DocumentDB/mongoClusters', parameters('CLUSTER_NAME'))]" // replace
            ],
            "properties": {
                "startIpAddress": "0.0.0.0",
                "endIpAddress": "0.0.0.0"
            }
        },
        {
            "type": "Microsoft.DocumentDB/mongoClusters/firewallRules",
            "apiVersion": "2023-11-15-preview",
            "name": "[concat(parameters('CLUSTER_NAME'), '/allowAzure')]", // replace
            "dependsOn": [
                "[resourceId('Microsoft.DocumentDB/mongoClusters', parameters('CLUSTER_NAME'))]" // replace
            ],
            "properties": {
                "startIpAddress": "0.0.0.0",
                "endIpAddress": "0.0.0.0"
            }
        }
    ]
}
```

## Deployment
Execute the following commands to initialize your Terraform workspace, create an execution plan, and apply the plan to deploy your resources:

```bash
terraform init -upgrade
terraform plan -out main.tfplan
terraform apply "main.tfplan"
```


## Next steps

> [!div class="nextstepaction"]
> [Migration options for Azure Cosmos DB for MongoDB vCore](migration-options.md)
