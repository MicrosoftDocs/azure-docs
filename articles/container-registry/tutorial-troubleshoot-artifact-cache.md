---
title: Troubleshoot Artifact Cache
description: Learn how to troubleshoot the most common problems for a registry enabled with the Artifact Cache feature.
ms.topic: tutorial
ms.date: 04/19/2022
ms.author: tejaswikolli
---

# Troubleshoot guide for Artifact Cache 

This article is part six in a six-part tutorial series. [Part one](tutorial-artifact-cache.md) provides an overview of Artifact Cache, its features, benefits, and limitations. In [part two](tutorial-enable-artifact-cache.md), you learn how to enable Artifact Cache feature by using the Azure portal. In [part three](tutorial-enable-artifact-cache-cli.md), you learn how to enable Artifact Cache feature by using the Azure CLI. In [part four](tutorial-enable-artifact-cache-auth.md), you learn how to enable Artifact Cache feature with authentication by using Azure portal. In [part five](tutorial-enable-artifact-cache-auth-cli.md), you learn how to enable Artifact Cache feature with authentication by using Azure CLI. 

This article helps you troubleshoot problems you might encounter when attempting to use Artifact Cache.

## Symptoms and Causes

May include one or more of the following issues: 

- Cached images don't appear in a real repository 
  - [Cached images don't appear in a live repository](tutorial-troubleshoot-artifact-cache.md#cached-images-dont-appear-in-a-live-repository) 

- Credentials has an unhealthy status
  - [Unhealthy Credentials](tutorial-troubleshoot-artifact-cache.md#unhealthy-credentials)

- Unable to create a cache rule
  - [Cache rule Limit](tutorial-troubleshoot-artifact-cache.md#cache-rule-limit)

## Potential Solutions

## Cached images don't appear in a live repository 

If you're having an issue with cached images not showing up in your repository in ACR, we recommend verifying the repository path. Incorrect repository paths lead the cached images to not show up in your repository in ACR.  

- The Login server for Docker Hub is `docker.io`.
- The Login server for Microsoft Artifact Registry is `mcr.microsoft.com`.

The Azure portal autofills these fields for you. However, many Docker repositories begin with `library/` in their path. For example, in-order to cache the `hello-world` repository, the correct Repository Path is `docker.io/library/hello-world`. 

## Unhealthy Credentials 

Credentials are a set of Key Vault secrets that operate as a Username and Password for private repositories. Unhealthy Credentials are often a result of these secrets no longer being valid. In the Azure portal, you can select the credentials, to edit and apply changes.

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

If you're facing issues while creating a Cache rule, we recommend verifying if you have more than 1000 cache rules created. 

We recommend deleting any unwanted cache rules to avoid hitting the limit. 

Learn more about the [Cache Terminology](tutorial-artifact-cache.md#terminology)

## Upstream support 

Artifact Cache currently supports the following upstream registries:

| Upstream registries         | Support                                                      | Availability            |
| --------------------------- | ------------------------------------------------------------ | ----------------------- |
| Docker Hub                     | Supports both authenticated pulls and unauthenticated pulls. | Azure CLI, Azure portal |
| Microsoft Artifact Registry | Supports unauthenticated pulls only.                         | Azure CLI, Azure portal |
| ECR Public                  | Supports unauthenticated pulls only.                         | Azure CLI, Azure portal |
| GitHub Container Registry   | Supports both authenticated pulls and unauthenticated pulls. | Azure CLI, Azure portal |
| Nvidia                      | Supports both authenticated pulls and unauthenticated pulls. | Azure CLI               |
| Quay                        | Supports both authenticated pulls and unauthenticated pulls. | Azure CLI, Azure portal |
| registry.k8s.io             | Supports both authenticated pulls and unauthenticated pulls. | Azure CLI               |


<!-- LINKS - External -->
[create-and-store-keyvault-credentials]:../key-vault/secrets/quick-create-portal.md
[az-keyvault-set-policy]: ../key-vault/general/assign-access-policy.md#assign-an-access-policy