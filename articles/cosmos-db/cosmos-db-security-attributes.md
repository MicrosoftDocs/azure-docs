---
title: Security attributes for Azure Cosmos DB
description: A checklist of security attributes for evaluating Azure Cosmos DB
services: cosmos-db
documentationcenter: ''
author: msmbaldwin
manager: barbkess
ms.service: cosmos-db

ms.topic: conceptual
ms.date: 05/08/2019
ms.author: mbaldwin

---
# Security attributes for Azure Cosmos DB

This article documents the common security attributes built into Azure Cosmos DB.

[!INCLUDE [Security Attributes Header](../../includes/security-attributes-header.md)]

## Preventative

| Security attribute | Yes/no | Notes |
|---|---|--|
| Encryption at rest (such as server-side encryption, server-side encryption with customer-managed keys, and other encryption features) | Yes | All Cosmos DB databases and backups are encrypted by default; see [Data encryption in Azure Cosmos DB](database-encryption-at-rest.md). Server-side encryption with customer-managed keys is not supported. |
| Encryption in Transit (such as ExpressRoute encryption, in Vnet encryption, and VNet-VNet encryption )| Yes | All Azure Cosmos DB data is encrypted at transit. |
| Encryption Key Handling (CMK, BYOK, etc.)| No |  |
| Column Level Encryption (Azure Data Services)| Yes | Only in the Tables API Premium. Not all APIs support this feature. See [Introduction to Azure Cosmos DB: Table API](table-introduction.md). |
| API calls encrypted| Yes | All connections to Azure Cosmos DB support HTTPS. Azure Cosmos DB also supports TLS 1.2 connections, but this is not yet enforced. If customers turn off lower level TLS on their end, they can ensure to connect to Cosmos DB.  |

## Network segmentation

| Security attribute | Yes/no | Notes |
|---|---|--|
| Service Endpoint support| Yes |  |
| vNET Injection support| Yes | With VNet service endpoint, you can configure an Azure Cosmos DB account to allow access only from a specific subnet of a virtual network (VNet). You can also combine VNet access with firewall rules.  See [Access Azure Cosmos DB from virtual networks](vnet-service-endpoint.md). |
| Network Isolation and Firewalling support| Yes | With firewall support, you can configure your Azure Cosmos account to allow access only from an approved set of IP addresses, a range of IP addresses and/or cloud services. See [Configure IP firewall in Azure Cosmos DB](how-to-configure-firewall.md).|
| Support for forced tunneling | Yes | Can be configured at the client side on the VNET where the virtual machines are located.   |

## Detection

| Security attribute | Yes/no | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | All requests that are sent to Azure Cosmos DB are logged. [Azure Monitoring](../azure-monitor/overview.md), Azure Metrics, Azure Audit Logging are supported.  You can log information corresponding to data plane requests, query runtime statistics, query text, MongoDB requests. You can also setup alerts. |

## Identity and access management

| Security attribute | Yes/no | Notes|
|---|---|--|
| Authentication| Yes | Yes at the Database Account Level; at the data plane level, Cosmos DB uses resource tokens and key access. |
| Authorization| Yes | Supported at the Azure Cosmos account with Master keys (primary and secondary) and Resource tokens. You can get read/write or read only access to data with master keys. Resource tokens allow limited time access to resources such as documents and containers. |


## Audit trail

| Security attribute | Yes/no | Notes|
|---|---|--|
| Control/Management Plan Logging and Audit| Yes | Azure Activity log for account level operations such as Firewalls, VNets, Keys access, and IAM. |
| Data plane Logging and Audit | Yes | Diagnostics monitoring logging for container level operations such as create container, provision throughput, indexing policies, and CRUD operations on documents. |

## Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| No  | | 

## Additional security attributes for Cosmos DB

| Security attribute | Yes/no | Notes|
|---|---|--|
| Cross Origin Resource Sharing (CORS) | Yes | See [Configure Cross-Origin Resource Sharing (CORS)](how-to-configure-cross-origin-resource-sharing.md). |
