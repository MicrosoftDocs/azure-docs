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

This topic is already covered under [Identity](./germany-migration-identity#azure-active-directory)

## Key Vault

### Encryption Keys

Encryption keys cannot be migrated. Create new keys in the target region and use them to protect the target resource (Storage, SQL DB, etc.). Then securely migrate the data from the old region to the new region.

### Application secrets

Application secrets are Certs, Storage account keys and other application-related secrets

Create new application secrets in the new target region

### Links

- [Get started with KeyVault](../key-vault/key-vault-get-started.md)

## VPN Gateway

This topic is already covered under [Networking](./germany-migration-networking#vpn-gateway)

## Application Gateway

This topic is already covered under [Networking](./germany-migration-networking#application-gateway)
