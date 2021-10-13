---
title: Data encryption in Azure Fluid Relay
description: Better understand the data encryption in Fluid Relay Server
author: hickeys
ms.author: hickeys
ms.date: 10/08/2021
ms.service: app-service
ms.topic: reference
---

# Data encryption in Azure Fluid Relay

> [!NOTE]
> This preview version is provided without a service-level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.

Microsoft Azure Fluid Relay Server leverages the encryption-at-rest capability of [Azure Kubernetes](/azure/aks/enable-host-encryption), [Microsoft Azure Cosmos DB]/azure/cosmos-db/database-encryption-at-rest) and [Azure Blob Storage](/azure/storage/common/storage-service-encryption). The service-to-service communication between AFRS and these resources is TLS encrypted and is enclosed in with the Azure Virtual Network Boundary, protected from external interference by Network Security Rules.

The diagram below shows at a high level how Azure Fluid Relay Server is implemented and how it handles data storage.

:::image type="content" source="../images/data-encryption.png" alt-text="A diagram of data storage in Azure Fluid Relay":::

## Frequently asked questions

### How much more does Azure Fluid Relay Server cost if Encryption is enabled?

Encryption-at-rest is enabled by default. There is no additional cost.

### Who manages the encryption keys?

The keys are managed by Microsoft.

### How often are encryption keys rotated?

Microsoft has a set of internal guidelines for encryption key rotation, which Azure Fluid Relay Server follows. The specific guidelines are not published. Microsoft does publish the [Security Development Lifecycle (SDL)](https://www.microsoft.com/sdl/default.aspx), which is seen as a subset of internal guidance and has useful best practices for developers.

### Can I use my own encryption keys?

No, this feature is not available yet. Keep an eye out for more updates on this. 

### What regions have encryption turned on?

All Azure Fluid Relay Server regions have encryption turned on for all user data.

### Does encryption affect the performance latency and throughput SLAs?

A: There is no impact or changes to the performance SLAs with encryption at rest enabled.

## See also

- [Overview of Azure Fluid Relay architecture](architecture.md)
- [Azure Fluid Relay token contract](../how-tos/fluid-json-web-token.md)
- [Authentication and authorization in your app](authentication-authorization.md)
