---
title: Security controls for Azure Cosmos DB
description: A checklist of security controls for evaluating Azure Cosmos DB
services: cosmos-db
documentationcenter: ''
author: msmbaldwin
manager: rkarlin
ms.service: cosmos-db

ms.topic: conceptual
ms.date: 09/04/2019
ms.author: mbaldwin

---
# Security controls for Azure Cosmos DB

This article documents the security controls built into Azure Cosmos DB.

[!INCLUDE [Security controls Header](../../includes/security-controls-header.md)]

## Network

| Security control | Yes/no | Notes |
|---|---|--|
| Service endpoint support| Yes |  |
| VNet injection support| Yes | With VNet service endpoint, you can configure an Azure Cosmos DB account to allow access only from a specific subnet of a virtual network (VNet). You can also combine VNet access with firewall rules.  See [Access Azure Cosmos DB from virtual networks](VNet-service-endpoint.md). |
| Network Isolation and Firewalling support| Yes | With firewall support, you can configure your Azure Cosmos account to allow access only from an approved set of IP addresses, a range of IP addresses and/or cloud services. See [Configure IP firewall in Azure Cosmos DB](how-to-configure-firewall.md).|
| Forced tunneling support| Yes | Can be configured at the client side on the VNet where the virtual machines are located.   |

## Monitoring & logging

| Security control | Yes/no | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | All requests that are sent to Azure Cosmos DB are logged. [Azure Monitoring](../azure-monitor/overview.md), Azure Metrics, Azure Audit Logging are supported.  You can log information corresponding to data plane requests, query runtime statistics, query text, MongoDB requests. You can also set up alerts. |
| Control and management plane logging and audit| Yes | Azure Activity log for account level operations such as Firewalls, VNets, Keys access, and IAM. |
| Data plane logging and audit | Yes | Diagnostics monitoring logging for container level operations such as create container, provision throughput, indexing policies, and CRUD operations on documents. |

## Identity

| Security control | Yes/no | Notes|
|---|---|--|
| Authentication| Yes | Yes at the Database Account Level; at the data plane level, Cosmos DB uses resource tokens and key access. |
| Authorization| Yes | Supported at the Azure Cosmos account with Master keys (primary and secondary) and Resource tokens. You can get read/write or read only access to data with master keys. Resource tokens allow limited time access to resources such as documents and containers. |

## Data protection

| Security control | Yes/no | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft-managed keys | Yes | All Cosmos databases and backups are encrypted by default; see [Data encryption in Azure Cosmos DB](database-encryption-at-rest.md). Server-side encryption with customer-managed keys is not supported. |
| Server-side encryption at rest: customer-managed keys (BYOK) | No |  |
| Column level encryption (Azure Data Services)| Yes | Only in the Tables API Premium. Not all APIs support this feature. See [Introduction to Azure Cosmos DB: Table API](table-introduction.md). |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption )| Yes | All Azure Cosmos DB data is encrypted at transit. |
| API calls encrypted| Yes | All connections to Azure Cosmos DB support HTTPS. Azure Cosmos DB also supports TLS 1.2 connections, but this is not yet enforced. If customers turn off lower level TLS on their end, they can ensure to connect to Cosmos DB.  |

## Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| No  | | 

## Additional security controls for Cosmos DB

| Security control | Yes/no | Notes|
|---|---|--|
| Cross Origin Resource Sharing (CORS) | Yes | See [Configure Cross-Origin Resource Sharing (CORS)](how-to-configure-cross-origin-resource-sharing.md). |

## Next steps

- Learn more about the [built-in security controls across Azure services](../security/fundamentals/security-controls.md).