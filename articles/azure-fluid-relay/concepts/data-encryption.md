---
title: Data encryption in Azure Fluid Relay
description: Better understand the data encryption in Fluid Relay Server
ms.date: 10/08/2021
ms.service: app-service
ms.topic: reference
---

# Data encryption in Azure Fluid Relay

Azure Fluid Relay leverages the encryption-at-rest capability of [Azure Kubernetes Service](../../aks/enable-host-encryption.md), [Azure Cosmos DB](../../cosmos-db/database-encryption-at-rest.md) and [Azure Blob Storage](../../storage/common/storage-service-encryption.md). The service-to-service communication between Azure Fluid Relay and these resources is TLS encrypted and is enclosed in with the Azure Virtual Network boundary, protected from external interference by Network Security Rules.

The diagram below shows at a high level how Azure Fluid Relay is implemented and how it handles data storage.

:::image type="content" source="../images/data-encryption.png" alt-text="A diagram of data storage in Azure Fluid Relay":::

## Frequently asked questions

### How much more does Azure Fluid Relay cost if encryption is enabled?

Encryption-at-rest is enabled by default. There's no additional cost.

### Who manages the encryption keys?

The keys are managed by Microsoft.

### How often are encryption keys rotated?

Microsoft has a set of internal guidelines for encryption key rotation which Azure Fluid Relay follows. The specific guidelines aren't published. Microsoft does publish the [Security Development Lifecycle (SDL)](https://www.microsoft.com/sdl/default.aspx), which is seen as a subset of internal guidance and has useful best practices for developers.

### Can I use my own encryption keys?

Yes. For more information, see [Customer-managed keys for Azure Fluid Relay encryption](../concepts/customer-managed-keys.md).

### What regions have encryption turned on?

All Azure Fluid Relay regions have encryption turned on for all user data.

### Does encryption affect the performance latency and throughput?

A: There's no impact or changes to performance with encryption at rest enabled.

## See also

- [Overview of Azure Fluid Relay architecture](architecture.md)
- [Azure Fluid Relay token contract](../how-tos/fluid-json-web-token.md)
- [Authentication and authorization in your app](authentication-authorization.md)
