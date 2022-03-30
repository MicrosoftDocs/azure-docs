---
title: Best practices for using Azure Key Vault  | Microsoft Docs
description: Learn about best practices for Azure Key Vault, including controlling access, when to use separate key vaults, backing up, logging, and recovery options.
services: key-vault
author: msmbaldwin
tags: azure-key-vault

ms.service: key-vault
ms.subservice: general
ms.topic: conceptual
ms.date: 01/29/2021
ms.author: mbaldwin
# Customer intent: As a developer who's using Key Vault, I want to know the best practices so I can implement them.
---
# Best practices for using Azure Key Vault

Azure Key Vault safeguards encryption keys and secrets like certificates, connection strings, and passwords. This article helps you optimize your use of key vaults.

## Use separate key vaults

Our recommendation is to use a vault per application per environment (development, pre-production, and production), per region. This helps you not share secrets across environments and regions. It will also reduce the threat in case of a breach.

### Why we recommend separate key vaults

Key vaults define security boundaries for stored secrets. Grouping secrets into the same vault increases the *blast radius* of a security event because attacks might be able to access secrets across concerns. To mitigate access across concerns, consider what secrets a specific application *should* have access to, and then separate your key vaults based on this delineation. Separating key vaults by application is the most common boundary. Security boundaries, however, can be more granular for large applications, for example, per group of related services.

## Control access to your vault

Encryption keys and secrets like certificates, connection strings, and passwords are sensitive and business critical. You need to secure access to your key vaults by allowing only authorized applications and users. [Azure Key Vault security features](security-features.md) provides an overview of the Key Vault access model. It explains authentication and authorization. It also describes how to secure access to your key vaults.

Suggestions for controlling access to your vault are as follows:
- Lock down access to your subscription, resource group, and key vaults (role-based access control (RBAC)).
- Create access policies for every vault.
- Use the principle of least privilege access to grant access.
- Turn on firewall and [virtual network service endpoints](overview-vnet-service-endpoints.md).

## Backup

Make sure you take regular backups of your vault. Backups should be performed when you update, delete, or create objects in your vault. 

### Azure PowerShell backup commands

* [Backup certificate](/powershell/module/azurerm.keyvault/Backup-AzureKeyVaultCertificate)
* [Backup key](/powershell/module/azurerm.keyvault/Backup-AzureKeyVaultKey)
* [Backup secret](/powershell/module/azurerm.keyvault/Backup-AzureKeyVaultSecret)

### Azure CLI backup commands

* [Backup certificate](/cli/azure/keyvault/certificate#az-keyvault-certificate-backup)
* [Backup key](/cli/azure/keyvault/key#az-keyvault-key-backup)
* [Backup secret](/cli/azure/keyvault/secret#az-keyvault-secret-backup)


## Turn on logging

[Turn on logging](logging.md) for your vault. Also, [set up alerts](alert.md).

## Turn on recovery options

- Turn on [soft-delete](soft-delete-overview.md).
- Turn on purge protection if you want to guard against force deletion of the secrets and key vault even after soft-delete is turned on.

## Learn more
- [Best practices for secrets management in Key Vault](../secrets/secrets-best-practices.md)
