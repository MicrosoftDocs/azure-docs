---
title: Best Practices to use Key Vault - Azure Key Vault | Microsoft Docs
description: This document explains some of the best practices to use Key Vault
services: key-vault
author: msmbaldwin
manager: barbkess
tags: azure-key-vault

ms.service: key-vault
ms.topic: conceptual
ms.date: 03/07/2019
ms.author: mbaldwin
# Customer intent: As a developer using Key Vault I want to know the best practices so I can implement them.
---
# Best practices to use Key Vault

## Control Access to your vault

Azure Key Vault is a cloud service that safeguards encryption keys and secrets like certificates, connection strings, and passwords. Because this data is sensitive and business critical, you need to secure access to your key vaults by allowing only authorized applications and users. This [article](key-vault-secure-your-key-vault.md) provides an overview of the Key Vault access model. It explains authentication and authorization, and describes how to secure access to your key vaults.

Suggestions while controlling access to your vault are as follows:
1. Lock down access to your subscription, resource group and Key Vaults (RBAC)
2. Create Access policies for every vault
3. Use least privilege access principal to grant access
4. Turn on Firewall and [VNET Service Endpoints](key-vault-overview-vnet-service-endpoints.md)

## Use separate Key Vault

Our recommendation is to use a vault per application per environment (Development, Pre-Production and Production). This helps you not share secrets across environments and also reduces the threat in case of a breach.

## Backup

Make sure you take regular back ups of your [vault](https://blogs.technet.microsoft.com/kv/2018/07/20/announcing-backup-and-restore-of-keys-secrets-and-certificates/) on update/delete/create of objects within a Vault.

## Turn on Logging

[Turn on logging](key-vault-logging.md) for your Vault. Also set up alerts.

## Turn on recovery options

1. Turn on [Soft Delete](key-vault-ovw-soft-delete.md).
2. Turn on purge protection if you want to guard against force deletion of the secret / vault even after soft delete is turned on.
