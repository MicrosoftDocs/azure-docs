---
title: Terraform quickstart for Azure
description: An introduction to using Terraform on Azure.
services: terraform
author: neilpeterson
ms.service: terraform
ms.topic: article
ms.date: 01/28/2019
ms.author: nepeters
---

# Create a simple Terraform configuration for Azure

HashiCorp Terraform is an open source tool for composing and deploying compute infrastructure. Terraform infrastructure deployments are written using the Hashicorp Configuration Language and can be generalized for reuse, stored in source control, and integrated with DevOps pipelines. When deploying infrastructure with Terraform, configuration state is tracked and can be used to actualize deployments which helps with upgrading or changing the configuration of infrastructure.

In this quick start you will gain experience in creating a Terraform configuration and deploying this configuration to Azure. When completed, you will have deployed an Azure Cosmos DB, and Azure Container Instances, and an application that works across these to resources. The quick start will assume that all work is completed in Azure Cloud Shell.

## Create first configuration

In this step, you will create the configuration for an Azure Cosmos DB instance. Click the try it now button to open up the Azure Cloud Shell code editor. Once open, type in `code .` to open the cloud shell code editor.

```azurecli-interactive
code .
```

Copy and paste in the following Terraform configuration. Save the file when done. This can be completed using the ellipses in the upper right hand portion of the code editor.

```azurecli-interactive
resource "azurerm_resource_group" "vote-resource-group" {
  name     = "vote-resource-group"
  location = "westus"
}

resource "random_integer" "ri" {
  min = 10000
  max = 99999
}

resource "azurerm_cosmosdb_account" "vote-cosmos-db" {
  name                = "tfex-cosmos-db-${random_integer.ri.result}"
  location            = "${azurerm_resource_group.vote-resource-group.location}"
  resource_group_name = "${azurerm_resource_group.vote-resource-group.name}"
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  enable_automatic_failover = true

  consistency_policy {
    consistency_level       = "BoundedStaleness"
    max_interval_in_seconds = 10
    max_staleness_prefix    = 200
  }

  geo_location {
    location          = "westus"
    failover_priority = 0
  }
}
```

The `terraform plan` command can be used to validate that the configuration is properly formatted and to visualize what resources will be created, updated, or destroyed. Run `terraform plan` to test the new Terraform configuration.

```azurecli-interactive
teraform plan
```

Now, run the configuration using `terraform apply`, this creates the resources in your Azure subscription.

```azurecli-interactive
teraform apply
```

## Update Configuration

## Test application
