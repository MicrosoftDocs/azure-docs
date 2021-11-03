---
title: Best practices for secrets management - Azure Key Vault | Microsoft Docs
description: Learn about best practices for Azure Key Vault secrets management
author: msmbaldwin
tags: azure-key-vault
ms.service: key-vault
ms.subservice: secrets
ms.topic: conceptual
ms.date: 09/21/2021
ms.author: mbaldwin

# Customer intent: As a developer using Key Vault secrets I want to know the best practices so I can implement them.
---
# Best practices for secrets management in Key Vault

Azure Key Vault allows securely store service or application credentials like passwords, access keys as secrets. All secrets in your Key Vault are stored encrypted with software key. When using Key Vault, application developers no longer need to store security information in their application. Not having to store security information in applications eliminates the need to make this information part of the code. 

Examples of secrets that should be stored in Key Vault:

- Client application secrets
- Connection strings
- Passwords
- Access keys (Redis Cache, Event Hub, Cosmos DB)
- SSH keys

Any other sensitive information like IP addresses, service names, and other configuration settings should be stored in [Azure App Configuration](../../azure-app-configuration/overview.md) instead.

Each individual key vault defines security boundary for secrets. Single key vault per application, per region, per environment is recommended to provide granular isolation of secrets for application. 

For more information about best practices for key vault, see:
- [Best practices to use Key Vault](../general/best-practices.md)

## Configuration and storing 

It's recommended to store dynamic parts of credentials, which are generated during rotation, like client application secrets, passwords, access keys in secret as value. Any related static attributes and identifiers like usernames, AppIds, service urls should be stored as secret tags and copied to new version of a secret during rotation.

For more information about secrets, see:
- [About Azure Key Vault secrets](about-secrets.md)

## Secrets rotation
Secrets many times are stored in application memory as environment variables or configuration settings for entire application lifecycle, which makes them sensitive to unwanted exposure. Because of secrets being sensitive to leakage or exposure, it is important to rotate secrets often, at least every 60 days. 

For more information about secret rotation process, see:
- [Automate the rotation of a secret for resources that have two sets of authentication credentials](tutorial-rotation-dual.md) 

## Access and network isolation

You can reduce the exposure of your vaults by specifying which IP addresses have access to them. Configure firewall to only allow application and related services to access secrets in vault to reduce ability for attacker to access secrets. 

For more information about network security, see:
- [Configure Azure Key Vault networking settings](../general/how-to-azure-key-vault-network-security.md)

Additionally, applications should follow least privileged access by only having access to read secrets. Secrets access can be control either with access policies or Azure role-based access control. 

For more information about access control in Azure Key Vault, see:
- [Provide access to Key Vault keys, certificates, and secrets with an Azure role-based access control](../general/rbac-guide.md)
- [Assign a Key Vault access policy](../general/assign-access-policy.md)
 
## Service limits and caching
Key Vault was originally created with the limits specified in [Azure Key Vault service limits](../general/service-limits.md). To maximize your Key Vault throughput rates, here are some recommended guidelines/best practices for maximizing your throughput:
- Cache secrets in application for at least 8 hours
- Implement exponential back-off retry logic to handle scenarios when service limits are exceeded

For more information about throttling guidance, see:
- [Azure Key Vault throttling guidance](../general/overview-throttling.md)

## Monitoring
Turn on logging for your Vault to monitor access to your secrets and their lifecycle. You can use [Azure Monitor](../../azure-monitor/overview.md) to monitor all secrets activities in all your vaults in one place or [Azure Event Grid](../../event-grid/overview.md) to monitor secret lifecycle with easy integration with Logic Apps and Azure Functions.

For more information, see:
- [Azure Key Vault as Event Grid source](../../event-grid/event-schema-key-vault.md?tabs=event-grid-event-schema.md)
- [Azure Key Vault logging](../general/logging.md)
- [Monitoring and alerting for Azure Key Vault](../general/alert.md)

## Backup and purge protection
Turn on [purge protection](../general/soft-delete-overview.md#purge-protection) to guard against force deletion of the secret. Take regular back ups of your vault on update/delete/create of secrets within a Vault.

### Azure PowerShell Backup Commands

* [Backup Secret](/powershell/module/azurerm.keyvault/Backup-AzureKeyVaultSecret)

### Azure CLI Backup Commands

* [Backup Secret](/cli/azure/keyvault/secret#az_keyvault_secret_backup)

## Learn more
- [About Azure Key Vault secrets](about-secrets.md)
- [Best practices to use Key Vault](../general/best-practices.md)
