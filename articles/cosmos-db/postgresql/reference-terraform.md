---
title: Terraform support – Azure Cosmos DB for PostgreSQL
description: Terraform supports all management operations in Azure Cosmos DB for PostgreSQL
ms.author: nlarin
author: niklarin
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: devx-track-terraform
ms.topic: conceptual
ms.date: 01/02/2024
---

# Terraform support for Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

[Terraform](https://www.terraform.io/) enables the definition, preview, and deployment of cloud infrastructure. Using Terraform, you create configuration files using [HCL syntax](https://www.terraform.io/docs/configuration/syntax.html). The HCL syntax allows you to specify the cloud provider - such as Azure - and the elements that make up your cloud infrastructure. After you create your configuration files, you create an execution plan that allows you to preview your infrastructure changes before they're deployed. Once you verify the changes, you apply the execution plan to deploy the infrastructure.

## Managing Azure Cosmos DB for PostgreSQL using Terraform

Terraform supports all management operations for Azure Cosmos DB for PostgreSQL clusters such as cluster create or update and adding worker nodes to cluster. Specifically, Terraform supports all management operations implemented in [the REST APIs](/rest/api/postgresqlhsc/).

Terraform provides documentation for all supported Azure Cosmos DB for PostgreSQL management operations.

* Cluster and node operations
    * [Cluster management](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cosmosdb_postgresql_cluster)
    * [Worker node configuration](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cosmosdb_postgresql_node_configuration)
    * [Coordinator and single node configuration](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cosmosdb_postgresql_coordinator_configuration)
* [Native PostgreSQL user role management](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cosmosdb_postgresql_role)
* Networking settings
    * [Public access - firewall rule management](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cosmosdb_postgresql_firewall_rule)
    * [Private access - private endpoint management](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/private_endpoint)
    * [Private access - Private Link service management](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/private_link_service)

## Next steps

* See [the latest documentation for Terraform's Azure provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs).
* Learn to [use Azure CLI authentication in Terraform](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/azure_cli).
