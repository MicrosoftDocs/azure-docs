---
title: Security overview in Azure Container Apps
description: Learn about the security features and best practices for Azure Container Apps, including managed identities, secrets management, and token store.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 07/17/2025
ms.author: cshoe
---

# Security overview in Azure Container Apps

Azure Container Apps provides several built-in security features that help you build secure containerized applications. This guide explores key security principles, including managed identities, secrets management, and token store, while providing best practices to help you design secure and scalable applications.

## Managed identities

[Managed identities](managed-identity.md) eliminate the need to store credentials in your code or configuration by providing an automatically managed identity in Microsoft Entra ID. Container apps can use these identities to authenticate to any service that supports Microsoft Entra authentication, such as Azure Key Vault, Azure Storage, or Azure SQL Database.

### Types of managed identities

Azure Container Apps supports two types of managed identities:

- **System-assigned identity**: Created and managed automatically with your container app's lifecycle. The identity is deleted when your app is deleted.

- **User-assigned identity**: Created independently and can be assigned to multiple container apps, allowing identity sharing across resources.

### Security benefits of managed identities

- Eliminates the need to manage and rotate credentials in your application code
- Reduces risk of credential exposure in configuration files
- Provides fine-grained access control through Azure RBAC
- Supports the principle of least privilege by granting only necessary permissions

### When to use each identity type

- Use **system-assigned identities** for workloads that:
  - Are contained within a single resource
  - Need independent identities

- Use **user-assigned identities** for workloads that:
  - Run across multiple resources that share a single identity
  - Need preauthorization to secure resources

### Managed identity for image pulls

A common security pattern is using [managed identities to pull images](managed-identity-image-pull.md) from private repositories in Azure Container Registry. This approach:

- Avoids using administrative credentials for the registry
- Provides fine-grained access control through the ACRPull role
- Supports both system-assigned and user-assigned identities
- Can be controlled to limit access to specific containers

For more information, see [Managed identities](managed-identity.md) and [Image pull from Azure Container Registry with managed identity](managed-identity-image-pull.md) for more details on how to set up a managed identities for your application.

## Secrets management

Azure Container Apps provides built-in mechanisms to securely store and access sensitive configuration values like connection strings, API keys, and certificates.

### Key security features for secrets

- **Secret isolation**: Secrets are scoped to an application level, isolated from specific revisions
- **Environment variable references**: Expose secrets to containers as environment variables
- **Volume mounts**: Mount secrets as files within containers
- **Key Vault integration**: Reference secrets stored in Azure Key Vault

### Security best practices for secrets

- Avoid storing secrets directly in Container Apps for production environments
- Use Azure Key Vault integration for centralized secret management
- Implement least privilege when granting access to secrets
- Use secret references in environment variables instead of hard-coding values
- Use volume mounts to access secrets as files when appropriate
- Implement proper secret rotation practices

For more information, see [Import certificates from Azure Key Vault](key-vault-certificates-manage.md) for more details on how to set up secrets management for your application.

## Token store for secure authentication

The token store feature provides a secure way to manage authentication tokens independent of your application code.

### How token store works

- Tokens are stored in Azure Blob Storage, separate from your application code
- Cached tokens are only accessible to the associated user
- Container Apps handles token refresh automatically
- The feature reduces the attack surface by eliminating custom token management code

For more information, see [Enable an authentication token store](token-store.md) for more details on how to set up a token store for your application.

## Network security

Implementing proper network security measures helps safeguard your workloads from unauthorized access and potential threats while enabling secure communication between your apps and other services.

For more information on network security in Azure Container Apps, see the following articles:

- [Configure WAF Application Gateway](./waf-app-gateway.md)
- [Enable User Defined Routes (UDR)](user-defined-routes.md)
- Rule based routing
  - [Use rule-based routing](./rule-based-routing.md)
  - [Configure a custom domain](./rule-based-routing-custom-domain.md)
  - [Securing a custom VNET with an NSG](firewall-integration.md)
  - [Use a private endpoint](./how-to-use-private-endpoint.md)
  - [Use mTLS](./mtls.md)
  - [Integrate with Azure Front Door](./how-to-integrate-with-azure-front-door.md)
