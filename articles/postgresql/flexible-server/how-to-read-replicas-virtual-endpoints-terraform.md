---
title: Creating Virtual Endpoints for Read Replicas using Terraform
description: This article describes the virtual endpoints for read replica feature using Terraform for Azure Database for PostgreSQL - Flexible Server.
author: akashraokm
ms.author: akashrao
ms.reviewer: maghan
ms.date: 08/08/2024 
ms.service: azure-database-postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

## Create Virtual Endpoints for Read Replicas with Terraform

Using Terraform, you can create and manage virtual endpoints for read replicas in Azure Database for PostgreSQL—Flexible Server. Terraform is an open-source infrastructure-as-code tool that allows you to define and provision infrastructure using a high-level configuration language.

## Prerequisites

Before you begin, ensure you have the following:

- An Azure account with the necessary permissions.
- Terraform installed on your local machine. You can download it from the [official Terraform website](https://www.terraform.io/downloads.html).
- Azure CLI installed and authenticated. Instructions are in the [Azure CLI documentation](/cli/azure/install-azure-cli).

Ensure you have a basic understanding of Terraform syntax and Azure resource provisioning.

Step-by-Step Terraform Configuration: Provide a step-by-step guide on configuring virtual endpoints for read replicas using Terraform.

## Configuring Virtual Endpoints

Follow these steps to create virtual endpoints for read replicas in Azure Database for PostgreSQL - Flexible Server:

1. **Initialize the Terraform Configuration**:

  Create a `main.tf` file and define the Azure provider.

  ```terraform
   provider "azurerm" {
     features {}
   }

   resource "azurerm_resource_group" "example" {
     name     = "example-resources"
     location = "East US"
   }
  ```

### Create the primary Azure Database for PostgreSQL

Define the primary PostgreSQL server resource.

```terraform
resource "azurerm_postgresql_flexible_server" "primary" {
  name                = "primary-server"
  resource_group_name = azurerm_resource_group.example.name
  location            = azurerm_resource_group.example.location
  version             = "12"
  administrator_login = "adminuser"
  administrator_password = "password"
  sku_name            = "Standard_D4s_v3"

  storage_mb = 32768
  backup_retention_days = 7
  geo_redundant_backup = "Disabled"
  high_availability {
    mode = "ZoneRedundant"
  }
}
```

### Create read replicas

Define the read replicas for the primary server.

```terraform
resource "azurerm_postgresql_flexible_server_replica" "replica" {
  name                = "replica-server"
  resource_group_name = azurerm_resource_group.example.name
  location            = azurerm_resource_group.example.location
  source_server_id    = azurerm_postgresql_flexible_server.primary.id
}
```

### Configure virtual endpoints

Define the necessary resources to configure virtual endpoints.

```terraform
resource "azurerm_private_endpoint" "example" {
  name                = "example-private-endpoint"
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name
  subnet_id           = azurerm_subnet.example.id

  private_service_connection {
    name                           = "example-privateserviceconnection"
    private_connection_resource_id = azurerm_postgresql_flexible_server.primary.id
    is_manual_connection           = false
    subresource_names              = ["postgresqlServer"]
  }
}
```

### Apply the configuration

Initialize Terraform and apply the configuration.

`terraform init`
`terraform apply`

Confirm the apply action when prompted. Terraform provisions the resources and configure the virtual endpoints as specified.

## Related content

- [create virtual endpoints](how-to-read-replicas-portal.md#create-virtual-endpoints)
- [Read replicas - overview](concepts-read-replicas.md)
- [Geo-replication](concepts-read-replicas-geo.md)
- [Promote read replicas](concepts-read-replicas-promote.md)
- [Create and manage read replicas in the Azure portal](how-to-read-replicas-portal.md)
- [Cross-region replication with virtual network](concepts-networking.md#replication-across-azure-regions-and-virtual-networks-with-private-networking)
- [Terraform Azure Provider Documentation](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
