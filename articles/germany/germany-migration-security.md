---
title: Migration from Azure Germany compute resources to public Azure
description: Provides help for migrating security resources
author: gitralf
ms.author: ralfwi 
ms.date: 7/20/2018
ms.topic: article
ms.custom: bfmigrate
---

# Security

## Azure Active Directory

This service is already covered under [Identity](./germany-migration-identity.md#azure-active-directory)

## Key Vault

### Encryption Keys

Encryption keys can't be migrated. Create new keys in the target region and use them to protect the target resource (Storage, SQL DB, etc.). Then securely migrate the data from the old region to the new region.

### Application secrets

Application secrets are Certs, storage account keys and other application-related secrets.

Create new application secrets in the new target region.

### Links

- [Get started with KeyVault](../key-vault/key-vault-get-started.md)

## VPN Gateway

This service is already covered under [Networking](./germany-migration-networking.md#vpn-gateway)

## Application Gateway

This service is already covered under [Networking](./germany-migration-networking.md#application-gateway)
