---
title: Troubleshoot Artifact cache
description: Learn how to troubleshoot the most common problems for a registry enabled with the Artifact cache feature.
ms.topic: article
ms.date: 10/31/2023
ms.author: tejaswikolli
ms.service: container-registry
# customer intent: As a user, I want to troubleshoot the most common problems for a registry enabled with the Artifact cache feature so that I can effectively use the feature.
---

# Troubleshoot guide for Artifact cache 

In this tutorial, you troubleshoot the most common problems for a registry enabled with the Artifact cache feature by identifying the Symptoms, causes, and potential solutions to effectively use the feature.

## Symptoms and Causes

May include one or more of the following issues: 

- Cached images don't appear in a real repository 
  - [Cached images don't appear in a live repository](troubleshoot-artifact-cache.md#cached-images-dont-appear-in-a-live-repository) 

- Credentials have an unhealthy status
  - [Unhealthy Credentials](troubleshoot-artifact-cache.md#unhealthy-credentials)

- Unable to create a cache rule
  - [Cache rule Limit](troubleshoot-artifact-cache.md#cache-rule-limit)

- Unable to create cache rule using a wildcard
  - [Unable to create cache rule using a wildcard](troubleshoot-artifact-cache.md#unable-to-create-cache-rule-using-a-wildcard)

## Potential Solutions

### Cached images don't appear in a live repository 

If you're having an issue with cached images not showing up in your repository in Azure Container Registry(ACR), we recommend verifying the repository path. Incorrect repository paths lead the cached images to not show up in your repository in ACR.  

- The Login server for Docker Hub is `docker.io`.
- The Login server for Microsoft Artifact Registry is `mcr.microsoft.com`.

The Azure portal autofills these fields for you. However, many Docker repositories begin with `library/` in their path. For example, in-order to cache the `hello-world` repository, the correct Repository Path is `docker.io/library/hello-world`. 

### Unhealthy Credentials 

Credentials are a set of Key Vault secrets that operate as a Username and Password for private repositories. Unhealthy Credentials are often a result of these secrets no longer being valid. In the Azure portal, you can select the credentials, to edit and apply changes.

- Verify the secrets in Azure Key Vault are expired. 
- Verify the secrets in Azure Key Vault are valid.
- Verify the access to the Azure Key Vault is assigned.

To assign the access to Azure Key Vault:

```azurecli-interactive
az keyvault set-policy --name myKeyVaultName --object-id myObjID --secret-permissions get
```

Learn more about [Key Vaults][create-and-store-keyvault-credentials].
Learn more about [Assigning the access to Azure Key Vault][az-keyvault-set-policy].

### Unable to create a Cache rule

#### Cache rule Limit

If you're facing issues while creating a Cache rule, we recommend verifying if you have more than 1,000 cache rules created. 

We recommend deleting any unwanted cache rules to avoid hitting the limit. 

Learn more about the [Cache Terminology.](container-registry-artifact-cache.md#terminology)


### Unable to create cache rule using a wildcard

If you're trying to create a cache rule, but there's a conflict with an existing rule. The error message suggests that there's already a cache rule with a wildcard for the specified target repository.

To resolve this issue, you need to follow these steps:

1. Identify Existing cache rule causing the conflict. Look for an existing rule that uses a wildcard (*) for the target repository.

1. Delete the conflicting cache rule that is overlapping source repository and wildcard. 

1. Create a new cache rule with the desired wildcard and target repository.

1. Double-check your cache configuration to ensure that the new rule is correctly applied and there are no other conflicting rules.

## Upstream support 

Artifact cache currently supports the following upstream registries:

| Upstream Registries                          | Support                                                  | Availability             |
|----------------------------------------------|----------------------------------------------------------|--------------------------|
| Docker Hub                                   | Supports both authenticated and unauthenticated pulls.   | Azure CLI, Azure portal  |
| Microsoft Artifact Registry                  | Supports unauthenticated pulls only.                     | Azure CLI, Azure portal  |
| AWS Elastic Container Registry (ECR) Public Gallery | Supports unauthenticated pulls only.              | Azure CLI, Azure portal  |
| GitHub Container Registry                    | Supports both authenticated and unauthenticated pulls.   | Azure CLI, Azure portal  |
| Nvidia                                       | Supports both authenticated and unauthenticated pulls.   | Azure CLI                |
| Quay                                         | Supports both authenticated and unauthenticated pulls.   | Azure CLI, Azure portal  |
| registry.k8s.io                              | Supports both authenticated and unauthenticated pulls.   | Azure CLI                |
| Google Container Registry                    | Supports both authenticated and unauthenticated pulls.   | Azure CLI                |

<!-- LINKS - External -->
[create-and-store-keyvault-credentials]:../key-vault/secrets/quick-create-portal.md

[az-keyvault-set-policy]: ../key-vault/general/assign-access-policy.md#assign-an-access-policy

