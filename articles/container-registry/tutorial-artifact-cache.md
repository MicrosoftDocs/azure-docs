---
title: Artifact Cache - Overview
description: An overview on Artifact Cache feature, its limitations and benefits of enabling the feature in your Registry.
ms.topic: tutorial
ms.date: 04/19/2022
ms.author: tejaswikolli
---

# Artifact Cache - Overview 

Artifact Cache feature allows users to cache container images in a private container registry. Artifact Cache is available in *Basic*, *Standard*, and *Premium* [service tiers](container-registry-skus.md).

This article is part one in a six-part tutorial series. The tutorial covers:

> [!div class="checklist"]
1. [Artifact Cache](tutorial-artifact-cache.md) 
2. [Enable Artifact Cache - Azure portal](tutorial-enable-artifact-cache.md)
3. [Enable Artifact Cache with authentication - Azure portal](tutorial-enable-artifact-cache-auth.md)
4. [Enable Artifact Cache - Azure CLI](tutorial-enable-artifact-cache-cli.md)
5. [Enable Artifact Cache with authentication - Azure CLI](tutorial-enable-artifact-cache-auth-cli.md)
6. [Troubleshooting guide for Artifact Cache](tutorial-troubleshoot-artifact-cache.md)

## Artifact Cache 

Artifact Cache enables you to cache container images from public and private repositories. 

Implementing Artifact Cache provides the following benefits:

***More Reliable pull operations:*** Faster pulls of container images are achievable by caching the container images in ACR. Since Microsoft manages the Azure network, pull operations are faster by providing Geo-Replication and Availability Zone support to the customers.

***Private networks:*** Cached registries are available on private networks. Therefore, users can configure their firewall to meet compliance standards. 

***Ensuring upstream content is delivered***: All registries, especially public ones like Docker Hub and others, have anonymous pull limits in order to ensure they can provide services to everyone. Artifact Cache allows users to pull images from the local ACR instead of the upstream registry. Artifact Cache ensures the content delivery from upstream and users gets the benefit of pulling the container images from the cache without counting to the pull limits.
 
## Terminology 

- Cache Rule - A Cache Rule is a rule you can create to pull artifacts from a supported repository into your cache.
    -   A cache rule contains four parts:
        
        1. Rule Name - The name of your cache rule. For example, `Hello-World-Cache`.

        2. Source - The name of the Source Registry. 

        3. Repository Path - The source path of the repository to find and retrieve artifacts you want to cache. For example, `docker.io/library/hello-world`.

        4. New ACR Repository Namespace - The name of the new repository path to store artifacts. For example, `hello-world`. The Repository can't already exist inside the ACR instance. 

- Credentials
    - Credentials are a set of username and password for the source registry. You require Credentials to authenticate with a public or private repository. Credentials contain four parts

        1. Credentials  - The name of your credentials.

        2. Source registry Login Server - The login server of your source registry. 

        3. Source Authentication - The key vault locations to store credentials. 
        
        4. Username and Password secrets- The secrets containing the username and password. 

## Limitations

- Cache will only occur after at least one image pull is complete on the available container image. For every new image available, a new image pull must be complete. Artifact Cache doesn't automatically pull new tags of images when a new tag is available. It is on the roadmap but not supported in this release. 

- Artifact Cache only supports 1000 cache rules.

## Upstream support 

Artifact Cache currently supports the following upstream registries:

| Upstream registries         | Support                                                      | Availability            |
| --------------------------- | ------------------------------------------------------------ | ----------------------- |
| Docker Hub                   | Supports both authenticated pulls and unauthenticated pulls. | Azure CLI, Azure portal |
| Microsoft Artifact Registry | Supports unauthenticated pulls only.                         | Azure CLI, Azure portal |
| ECR Public                  | Supports unauthenticated pulls only.                         | Azure CLI, Azure portal |
| GitHub Container Registry   | Supports both authenticated pulls and unauthenticated pulls. | Azure CLI, Azure portal |
| Nvidia                   | Supports both authenticated pulls and unauthenticated pulls. | Azure CLI               |
| Quay                        | Supports both authenticated pulls and unauthenticated pulls. | Azure CLI, Azure portal |
| registry.k8s.io             | Supports both authenticated pulls and unauthenticated pulls. | Azure CLI               |
|Google Container Registry|Supports both authenticated pulls and unauthenticated pulls.|Azure CLI|

## Wildcards

Wildcard use asterisks (*) to match multiple paths within the container image registry. Artifact Cache currently supports the following wildcards:

> [!NOTE] 
> The cache rules map from Target Repository => Source Repository.

### Registry Level Wildcard 

The registry level wildcard allows you to cache all repositories from an upstream registry.


| Cache Rule                                  | Mapping                                  | Example                                                                                                                                |
| ------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| contoso.azurecr.io/* => mcr.microsoft.com/* | Mapping for all images under ACR to MCR. | contoso.azurecr.io/myapp/image1 => mcr.microsoft.com/myapp/image1<br>contoso.azurecr.io/myapp/image2 => mcr.microsoft.com/myapp/image2 |

### Repository Level Wildcard

The repository level wildcard allows you to cache all repositories from an upstream registry mapping to the repository prefix.

| Cache Rule                                                                                                                              | Mapping                                                                                     | Example                                                                                                                                            |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| contoso.azurecr.io/dotnet/* => mcr.microsoft.com/dotnet/*                                                                               | Mapping specific repositories under ACR to corresponding repositories in MCR.               | contoso.azurecr.io/dotnet/sdk => mcr.microsoft.com/dotnet/sdk<br>contoso.azurecr.io/dotnet/runtime => mcr.microsoft.com/dotnet/runtime             |
| contoso.azurecr.io/library/dotnet/* => mcr.microsoft.com/dotnet/* <br>contoso.azurecr.io/library/python/* => docker.io/library/python/* | Mapping specific repositories under ACR to repositories from different upstream registries. | contoso.azurecr.io/library/dotnet/app1 => mcr.microsoft.com/dotnet/app1<br>contoso.azurecr.io/library/python/app3 => docker.io/library/python/app3 |

### Limitations for Wildcard based cache rules

Wildcard cache rules use asterisks (*) to match multiple paths within the container image registry. These rules cannot overlap with other wildcard cache rules. In other words, if you have a wildcard cache rule for a certain registry path, you cannot add another wildcard rule that overlaps with it. 

Here are some examples of overlapping rules:

**Example 1**:

Existing cache rule: `contoso.azurecr.io/* => mcr.microsoft.com/*`<br>
New cache being added: `contoso.azurecr.io/library/* => docker.io/library/*`<br>

The addition of the new cache rule is blocked because the target repository path `contoso.azurecr.io/library/*` overlaps with the existing wildcard rule `contoso.azurecr.io/*`.

**Example 2:**

Existing cache rule: `contoso.azurecr.io/library/*` => `mcr.microsoft.com/library/*`<br>
New cache being added: `contoso.azurecr.io/library/dotnet/*` => `docker.io/library/dotnet/*`<br>

The addition of the new cache rule is blocked because the target repository path `contoso.azurecr.io/library/dotnet/*` overlaps with the existing wildcard rule  `contoso.azurecr.io/library/*`.

### Limitations for Static/fixed cache rules

Static or fixed cache rules are more specific and do not use wildcards. They can overlap with wildcard-based cache rules. If a cache rule specifies a fixed repository path, then it's allowed to overlap with a wildcard-based cache rule.

**Example 1**:

Existing cache rule: `contoso.azurecr.io/*` => `mcr.microsoft.com/*`<br>
New cache being added: `contoso.azurecr.io/library/dotnet` => `docker.io/library/dotnet`<br>

The addition of the new cache rule is allowed because `contoso.azurecr.io/library/dotnet` is a static path and can overlap with the wildcard cache rule `contoso.azurecr.io/*`.

## Next steps

* To enable Artifact Cache using the Azure portal advance to the next article: [Enable Artifact Cache](tutorial-enable-artifact-cache.md).

<!-- LINKS - External -->

[docker-rate-limit]:https://aka.ms/docker-rate-limit

