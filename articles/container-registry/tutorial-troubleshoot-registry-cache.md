---
title: Troubleshoot Registry Cache
description: Learn how to troubleshoot the most common problems for a registry that's enabled with the Registry Cache feature.
ms.topic: tutorial
ms.date: 04/19/2022
ms.author: tejaswikolli
---

# Troubleshoot guide for Registry Cache

This article is part four in a four-part tutorial series. [Part one](tutorial-registry-cache.md) provides information about the Caching for ACR feature, its limitations, and benefits of the implementation in your registry. In [part two](tutorial-enable-registry-cache.md), you learn how to enable Caching for ACR feature by using the Azure portal. In [part three](tutorial-enable-registry-cache-auth.md), you learn how to enable Caching for ACR feature with authentication by using the Azure portal.

This article will help you troubleshoot problems you might encounter when attempting to use Caching for ACR.

## Symptoms

May include one or more of the following issues: 

- Cached images don't appear in a live repository 

- Unable to create a Credential set

- Credential set has an unhealthy status

- Unable to create a cache rule

## Causes 

- Cache rule doesn't point to a real repository

- URI of secrets is empty 

- Credential set secret is invalid

- The cache rule is trying to pull from an unsupported registry

- 50 cache rules have been created

## Potential Solutions

## Cached images don't appear in a live repository 

If you're having an issue with cached images not showing up in your repository in ACR, we recommend verifying the repository path. Incorrect repository paths lead the cached images to not show up in your repository in ACR. Caching for ACR currently supports **Docker Hub** and **Microsoft Artifact Registry**.  

- The Login server for Docker Hub is `docker.io`.
- The Login server for Microsoft Artifact Registry is `mcr.microsoft.com`.

The Azure portal autofills these fields for you. However, many Docker repositories begin with `library/` in their path. For example, in-order to cache the `hello-world` repository, the correct Repository Path is `docker.io/library/hello-world`. 

## Unable to create a Credential set

We recommend before creating a credential set inside the Azure portal, ensure both the Username and Password secrets are associated with a Key Vault or secret URIs.

- Credential sets can be stored using Azure Key Vault.
- When using Azure Key vault you must have a Key Vault name and Secret for both the Username and Password secrets. 

Caching for ACR allows you to cache images from private Docker Hub repositories. In-order to store the credentials needed to access the private repository. You must create a credential set. 

## Unhealthy Credential Set

Credential sets are a set of Key Vault secrets that operate as a Username and Password for private repositories. Unhealthy Credential sets are often a result of these secrets no longer being valid. Inside the Azure portal you can select the credential set, to edit and apply changes.

- Verify the secrets in Azure Key Vault have not expired. 
- Verify the secrets in Azure Key Vault are valid.

Learn more about [Key Vaults][create-and-store-keyvault-credentials].

## Unable to create a Cache rule

### Unsupported Registries 

If you're facing issues while creating a Cache rule, we recommend verifying if you're attempting to cache repositories from an unsupported registry. ACR currently supports **Docker Hub** and **Microsoft Artifact Registry** for Caching.

- The repository path for Docker is `docker.io/library`
- The repository path for Microsoft Artifact Registry is `mcr.microsoft.com/library`

Learn more about the [Cache Terminology](tutorial-registry-cache.md#Terminology)

### Cache rule Limit

If you're facing issues while creating a Cache rule, we recommend to verify if you have more than 50 cache rules created. 

We recommend deleting any unwanted cache rules to avoid hitting the limit. 

<!-- LINKS - External -->
[create-and-store-keyvault-credentials]:../key-vault/secrets/quick-create-portal.md