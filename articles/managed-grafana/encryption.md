---
title: Encryption in Azure Managed Grafana
description: Learn how data is encrypted in Azure Managed Grafana.
author: maud-lv
ms.author: malev
ms.service: managed-grafana
ms.topic: conceptual
ms.date: 03/23/2023
ms.custom: concept, ignite-2022, engagement-fy23
---

# Encryption in Azure Managed Grafana

This article provides a short description of encryption within Azure Managed Grafana.

## Data storage

 Azure Managed Grafana stores data in the following services:

- Resource-provider related system metadata is stored in Azure Cosmos DB.
- Grafana instance user data is stored in a per instance Azure Database for PostgreSQL.

## Encryption in Azure Cosmos DB and Azure Database for PostgreSQL

Azure Managed Grafana leverages encryption offered by Azure Cosmos DB and Azure Database for PostgreSQL.

Data stored in Azure Cosmos DB and Azure Database for PostgreSQL is encrypted at rest on storage devices and in transport over the network.

For more information, go to [Encryption at rest in Azure Cosmos DB](../cosmos-db/database-encryption-at-rest.md) and [Security in Azure Database for PostgreSQL - Flexible Server](../postgresql/flexible-server/concepts-security.md).

## Server-side encryption

The encryption model used by Azure Managed Grafana is the server-side encryption model with Service-Managed keys.

In this model, all key management aspects such as key issuance, rotation, and backup are managed by Microsoft. The Azure resource providers create the keys, place them in secure storage, and retrieve them when needed. For more information, go to [Server-side encryption using service-managed keys](../security/fundamentals/encryption-models.md#server-side-encryption-using-service-managed-keys).

## Next steps

> [!div class="nextstepaction"]
> [Monitor your Azure Managed Grafana instance](how-to-monitor-managed-grafana-workspace.md)