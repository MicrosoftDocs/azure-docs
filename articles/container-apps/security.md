---
title: Security principles in Azure Container Apps
description: Learn about the security features and best practices for Azure Container Apps, including managed identities, secrets management, and token store.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 07/16/2025
ms.author: cshoe
---

# Security principles in Azure Container Apps

Azure Container Apps provides several built-in security features that help you build secure containerized applications. This article introduces the core security principles and capabilities available in Azure Container Apps.

## Managed identities

Managed identities eliminate the need to store credentials in your code or configuration by providing an automatically managed identity in Microsoft Entra ID. Container apps can use these identities to authenticate to any service that supports Microsoft Entra authentication, such as Azure Key Vault, Azure Storage, or Azure SQL Database.

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

A common security pattern is using managed identities to pull images from private repositories in Azure Container Registry. This approach:

- Avoids using administrative credentials for the registry
- Provides fine-grained access control through the ACRPull role
- Supports both system-assigned and user-assigned identities
- Can be controlled to limit access to specific containers

### Controlling managed identity access

Container Apps allows you to control which managed identities are available to different containers:

- **Init**: Available only to init containers
- **Main**: Available only to main containers
- **All**: Available to all containers (default)
- **None**: Not available to any containers

This granular control follows the principle of least privilege, limiting potential attack vectors if a container is compromised.

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

### Key Vault integration

For production workloads, store secrets in Azure Key Vault and reference them from your container app:

1. Enable managed identity for your container app
1. Grant the identity access to Key Vault secrets
1. Reference the Key Vault secret URI in your container app configuration

This approach provides:

- Centralized secret management
- Access control and audit logging
- Automatic secret rotation

## Token store for secure authentication

The token store feature provides a secure way to manage authentication tokens independent of your application code.

### How token store works

- Tokens are stored in Azure Blob Storage, separate from your application code
- Cached tokens are only accessible to the associated user
- Container Apps handles token refresh automatically
- The feature reduces the attack surface by eliminating custom token management code

### Setting up token store

To enable token store:

1. Create a private blob container in Azure Storage
1. Generate a SAS URL with read, write, and delete permissions
1. Store the SAS URL as a secret in your container app
1. Enable token store using the container app authentication configuration

## Security architecture considerations

When designing secure applications on Azure Container Apps, consider these architectural principles:

- **Defense in depth**: Implement multiple layers of security controls
- **Least privilege**: Grant only the minimum permissions necessary
- **Managed service advantages**: Use the security benefits of Azure's managed services
- **Secure defaults**: Start with secure configurations and only open what's necessary
- **Identity as the primary security perimeter**: Center your security architecture around identity controls

## Next steps

- Implement [managed identities](./managed-identity.md) for secure authentication
- Set up [secrets management](./manage-secrets.md) for sensitive configuration
- Configure [secure image pull](./managed-identity-image-pull.md) with managed identities
- Enable [token store](./token-store.md) for secure user authentication
