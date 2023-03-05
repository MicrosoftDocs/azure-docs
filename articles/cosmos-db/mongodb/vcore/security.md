---
title: Security overview
titleSuffix: Azure Cosmos DB for MongoDB (vCore)
description: Learn about security in Azure Cosmos DB for MongoDB vCore.
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: conceptual
author: gahl-levy
ms.author: gahllevy
ms.date: 02/07/2023
---

# Security in Azure Cosmos DB for MongoDB vCore

This page outlines the multiple layers of security available to protect the data in your cluster.

## In transit
Encryption (SSL/TLS) is always enforced, and attempts to connect to your cluster without encryption will fail. Only connections via a MongoDB client are accepted and encryption is always enforced.

Whenever data is written to Azure Cosmos DB for MongoDB vCore, your data is encrypted in-transit with Transport Layer Security 1.2.

## At rest
Azure Cosmos DB for MongoDB vCore uses the FIPS 140-2 validated cryptographic module for storage encryption of data at-rest. Data, including all backups, are encrypted on disk, including the temporary files. The service uses the AES 256-bit cipher included in Azure storage encryption, and the keys are system-managed. Storage encryption is always on, and can't be disabled.

## Network Security Options

### No Access
This is the default option for a newly created cluster if public or private access is not enabled. In this case, no computers, whether inside or outside of Azure, can connect to the database nodes.

### Public IP Access with firewall
In the public access option, a public IP address is assigned to the cluster, and access to the cluster is protected by a firewall.

## Firewall Overview
Azure Cosmos DB for MongoDB vCore uses a server-level firewall to prevent all access to your cluster until you specify which computers have permission. The firewall grants access to the cluster based on the originating IP address of each request. To configure your firewall, you create firewall rules that specify ranges of acceptable IP addresses.

Firewall rules enable clients to access your cluster and all the databases within it. Server-level firewall rules can be configured using the Azure portal or programmatically using Azure tools such as the Azure CLI.

All access to your cluster is blocked by the firewall by default. To begin using your cluster from another computer, you need to specify one or more server-level firewall rules to enable access to your cluster. Use the firewall rules to specify which IP address ranges from the Internet to allow. Access to the Azure portal website itself is not affected by the firewall rules. Connection attempts from the internet and Azure must first pass through the firewall before they can reach your databases.

## Next steps

> [!div class="nextstepaction"]
> [TODO: Link to another topic](about:blank)
