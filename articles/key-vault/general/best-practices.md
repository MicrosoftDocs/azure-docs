---
title: Best Practices to use Key Vault - Azure Key Vault | Microsoft Docs
description: Learn about best practices for Azure Key Vault, including controlling access, when to use separate key vaults, backing up, logging, and recovery options.
services: key-vault
author: msmbaldwin
manager: rkarlin
tags: azure-key-vault

ms.service: key-vault
ms.subservice: general
ms.topic: conceptual
ms.date: 03/07/2019
ms.author: mbaldwin
# Customer intent: As a developer using Key Vault I want to know the best practices so I can implement them.
---
# Best practices to use Key Vault

## Control Access to your vault

Azure Key Vault is a cloud service that safeguards encryption keys and secrets like certificates, connection strings, and passwords. Because this data is sensitive and business critical, you need to secure access to your key vaults by allowing only authorized applications and users. This [article](secure-your-key-vault.md) provides an overview of the Key Vault access model. It explains authentication and authorization, and describes how to secure access to your key vaults.

Suggestions while controlling access to your vault are as follows:
1. Lock down access to your subscription, resource group and Key Vaults (RBAC)
2. Create Access policies for every vault
3. Use least privilege access principal to grant access
4. Turn on Firewall and [VNET Service Endpoints](overview-vnet-service-endpoints.md)

## Use separate Key Vault

Our recommendation is to use a vault per application per environment (Development, Pre-Production and Production). This helps you not share secrets across environments and also reduces the threat in case of a breach.

## Backup

Make sure you take regular back ups of your vault on update/delete/create of objects within a Vault.

### Azure PowerShell Backup Commands

* [Backup Certificate](/powershell/module/azurerm.keyvault/Backup-AzureKeyVaultCertificate?view=azurermps-6.13.0)
* [Backup Key](/powershell/module/azurerm.keyvault/Backup-AzureKeyVaultKey?view=azurermps-6.13.0)
* [Backup Secret](/powershell/module/azurerm.keyvault/Backup-AzureKeyVaultSecret?view=azurermps-6.13.0)

### Azure CLI Backup Commands

* [Backup Certificate](/cli/azure/keyvault/certificate?view=azure-cli-latest#az-keyvault-certificate-backup)
* [Backup Key](/cli/azure/keyvault/key?view=azure-cli-latest#az-keyvault-key-backup)
* [Backup Secret](/cli/azure/keyvault/secret?view=azure-cli-latest#az-keyvault-secret-backup)


## Turn on Logging

[Turn on logging](logging.md) for your Vault. Also set up alerts.

## Turn on recovery options

1. Turn on [Soft Delete](soft-delete-overview.md).
2. Turn on purge protection if you want to guard against force deletion of the secret / vault even after soft-delete is turned on.