---
title: Troubleshoot Registry Cache
description: Learn how to troubleshoot the most common problems for a registry enabled with the Cache for ACR feature.
ms.topic: tutorial
ms.date: 04/19/2022
ms.author: tejaswikolli
---

# Troubleshoot guide for Cache for ACR (Preview)

This article is part six in a six-part tutorial series. [Part one](tutorial-registry-cache.md) provides an overview of Cache for ACR, its features, benefits, and preview limitations. In [part two](tutorial-enable-registry-cache.md), you learn how to enable Cache for ACR feature by using the Azure portal. In [part three](tutorial-enable-registry-cache-cli.md), you learn how to enable Cache for ACR feature by using the Azure CLI. In [part four](tutorial-enable-registry-cache-auth.md), you learn how to enable Cache for ACR feature with authentication by using Azure portal. In [part five](tutorial-enable-registry-cache-auth-cli.md), you learn how to enable Cache for ACR feature with authentication by using Azure CLI. 

This article helps you troubleshoot problems you might encounter when attempting to use Cache for ACR (preview).

## Symptoms and Causes

May include one or more of the following issues: 

- Cached images don't appear in a real repository 
  - [Cached images don't appear in a live repository](tutorial-troubleshoot-registry-cache.md#cached-images-dont-appear-in-a-live-repository) 

- Credential set has an unhealthy status
  - [Unhealthy Credential Set](tutorial-troubleshoot-registry-cache.md#unhealthy-credential-set)

- Unable to create a cache rule
  - [Cache rule Limit](tutorial-troubleshoot-registry-cache.md#cache-rule-limit)

## Potential Solutions

## Cached images don't appear in a live repository 

If you're having an issue with cached images not showing up in your repository in ACR, we recommend verifying the repository path. Incorrect repository paths lead the cached images to not show up in your repository in ACR.  

- The Login server for Docker Hub is `docker.io`.
- The Login server for Microsoft Artifact Registry is `mcr.microsoft.com`.

The Azure portal autofills these fields for you. However, many Docker repositories begin with `library/` in their path. For example, in-order to cache the `hello-world` repository, the correct Repository Path is `docker.io/library/hello-world`. 

## Unhealthy Credential Set

Credential sets are a set of Key Vault secrets that operate as a Username and Password for private repositories. Unhealthy Credential sets are often a result of these secrets no longer being valid. In the Azure portal, you can select the credential set, to edit and apply changes.

- Verify the secrets in Azure Key Vault haven't expired. 
- Verify the secrets in Azure Key Vault are valid.
- Verify the access to the Azure Key Vault is assigned.

To assign the access to Azure Key Vault:

```azurecli-interactive
az keyvault set-policy --name myKeyVaultName --object-id myObjID --secret-permissions get
```

Learn more about [Key Vaults][create-and-store-keyvault-credentials].
Learn more about [Assigning the access to Azure Key Vault][az-keyvault-set-policy].

## Unable to create a Cache rule

### Cache rule Limit

If you're facing issues while creating a Cache rule, we recommend verifying if you have more than 50 cache rules created. 

We recommend deleting any unwanted cache rules to avoid hitting the limit. 

Learn more about the [Cache Terminology](tutorial-registry-cache.md#terminology)

## Upstream support 

Cache for ACR currently supports the following upstream registries:

| Upstream registries         | Support                                                      | Availability            |
| --------------------------- | ------------------------------------------------------------ | ----------------------- |
| Docker                      | Supports both authenticated pulls and unauthenticated pulls. | Azure CLI, Azure portal |
| Microsoft Artifact Registry | Supports unauthenticated pulls only.                         | Azure CLI, Azure portal |
| ECR Public                  | Supports unauthenticated pulls only.                         | Azure CLI               |
| GitHub Container Registry   | Supports both authenticated pulls and unauthenticated pulls. | Azure CLI               |


<!-- LINKS - External -->
[create-and-store-keyvault-credentials]:../key-vault/secrets/quick-create-portal.md
[az-keyvault-set-policy]: ../key-vault/general/assign-access-policy.md#assign-an-access-policy