---
title: Best practices for secrets management - Azure Key Vault | Microsoft Docs
description: Learn about best practices for Azure Key Vault secrets management.
author: msmbaldwin
tags: azure-key-vault
ms.service: key-vault
ms.subservice: secrets
ms.topic: conceptual
ms.date: 09/21/2021
ms.author: mbaldwin

# Customer intent: As a developer interested in using Key Vault secrets, I want to implement the best practices.
---
# Best practices for secrets management in Key Vault

Azure Key Vault allows you to securely store service or application credentials like passwords and access keys as secrets. All secrets in your key vault are encrypted with a software key. When you use key vault, you no longer need to store security information in your applications. Not having to store security information in applications eliminates the need to make this information part of the code.

Examples of secrets that should be stored in key vault:

- Client application secrets
- Connection strings
- Passwords
- Access keys (Redis Cache, Azure Event Hub, Azure Cosmos DB)
- SSH keys

Other sensitive information like IP addresses, service names, and other configuration settings should be stored in [Azure App Configuration](../../azure-app-configuration/overview.md) rather than in key vault.

Each individual key vault defines security boundaries for secrets. A single key vault per application, per region, per environment is recommended to provide granular isolation of secrets for an application.

For more information about best practices for key vault, see [Best practices to use Key Vault](../general/best-practices.md)

## Configuration and storing 

Store the dynamic parts of credentials, which are generated during rotation, as values. Some examples include, client application secrets, passwords, and access keys. Any related static attributes and identifiers like usernames, AppIds, service urls should be stored as secret tags and copied to the new version of a secret during rotation.

For more information about secrets, see [About Azure Key Vault secrets](about-secrets.md)

## Secrets rotation
Secrets many times are stored in application memory as environment variables or configuration settings for entire application lifecycle, which makes them sensitive to unwanted exposure. Because of secrets being sensitive to leakage or exposure, it is important to rotate secrets often, at least every 60 days. 

For more information about the secret rotation process, see [Automate the rotation of a secret for resources that have two sets of authentication credentials](tutorial-rotation-dual.md). 

## Access and network isolation

You can reduce the exposure of your vaults by specifying which IP addresses have access to them. Configure your firewall to only allow applications and related services to access secrets in the vault to reduce the ability of attackers to access secrets.

For more information about network security, see [Configure Azure Key Vault networking settings](../general/how-to-azure-key-vault-network-security.md).

Additionally, applications should follow least privileged access by only having access to read secrets. Access to secrets can be control either with access policies or with Azure role-based access control. 

For more information about access control in Azure Key Vault, see
- [Provide access to Key Vault keys, certificates, and secrets with Azure role-based access control](../general/rbac-guide.md)
- [Assign a Key Vault access policy](../general/assign-access-policy.md)
 
## Service limits and caching
Key Vault was originally created with throttling limits specified in [Azure Key Vault service limits](../general/service-limits.md). To maximize your Key Vault throughput rates, here are two recommended best practices for maximizing your throughput:
- Cache secrets in your application for at least eight hours
- Implement exponential back-off retry logic to handle scenarios when service limits are exceeded

For more information about throttling guidance, see [Azure Key Vault throttling guidance](../general/overview-throttling.md).

## Monitoring
To monitor access to your secrets and their lifecycle, turn on Key Vault logging. Use [Azure Monitor](../../azure-monitor/overview.md) to monitor all secrets activities in all your vaults in one place or [Azure Event Grid](../../event-grid/overview.md) to monitor the secret lifecycle, which has easy integration with Azure Logic Apps and Azure Functions.

For more information, see
- [Azure Key Vault as Event Grid source](../../event-grid/event-schema-key-vault.md?tabs=event-grid-event-schema.md)
- [Azure Key Vault logging](../general/logging.md)
- [Monitoring and alerting for Azure Key Vault](../general/alert.md)

## Backup and purge protection
Turn on [purge protection](../general/soft-delete-overview.md#purge-protection) to guard against force deletion of the secret. Take regular backups of your vault when you update, delete, or create secrets within a vault.

### Azure PowerShell backup commands

* [Backup secret](/powershell/module/azurerm.keyvault/Backup-AzureKeyVaultSecret)

### Azure CLI backup commands

* [Backup secret](/cli/azure/keyvault/secret#az_keyvault_secret_backup)

## Learn more
- [About Azure Key Vault secrets](about-secrets.md)
- [Best practices to use Key Vault](../general/best-practices.md)
