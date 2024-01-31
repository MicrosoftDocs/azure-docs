---
title: Overview of Security for Azure Programmable Connectivity
description: Azure Programmable Connectivity is a cloud service that provides a simple and uniform way for developers to access programmable networks, regardless of substrate or location.
author: anzaman
ms.author: alzam
ms.service: azure-operator-nexus
ms.topic: overview
ms.date: 01/08/2024
ms.custom: template-overview
---
 
# Overview of Security for Azure Programmable Connectivity

This article provides an overview of how encryption is used in Azure Programmable Connectivity. It covers the major areas of encryption, including encryption at rest and encryption in transit.
 
## Encryption at rest
 
Azure Programmable Connectivity stores all data at rest securely, including any temporary customer data. Azure Programmable Connectivity uses standard Azure infrastructure, with platform-managed encryption keys, to provide server-side encryption compliant with a range of security standards. For more information, see [encryption of data at rest.](../security/fundamentals/encryption-overview.md)
 
## Encryption in transit
 
All traffic handled by Azure Programmable Connectivity is encrypted. This encryption covers all internal communication and calls made to Operator premises.
 
HTTP traffic is encrypted using TLS, minimum version 1.2.