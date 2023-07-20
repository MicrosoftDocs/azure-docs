---
title: Cache for ACR - Overview
description: An overview on Cache for ACR feature, its preview limitations and benefits of enabling the feature in your Registry.
ms.topic: tutorial
ms.date: 04/19/2022
ms.author: tejaswikolli
---
# Cache for Azure Container Registry (Preview)

Cache for Azure Container Registry (Preview) feature allows users to cache container images in a private container registry. Cache for ACR, is a preview feature available in *Basic*, *Standard*, and *Premium* [service tiers](container-registry-skus.md).

This article is part one in a six-part tutorial series. The tutorial covers:

> [!div class="checklist"]
1. [Cache for ACR (preview)](tutorial-registry-cache.md) 
2. [Enable Cache for ACR - Azure portal](tutorial-enable-registry-cache.md)
3. [Enable Cache for ACR with authentication - Azure portal](tutorial-enable-registry-cache-auth.md)
4. [Enable Cache for ACR - Azure CLI](tutorial-enable-registry-cache-cli.md)
5. [Enable Cache for ACR with authentication - Azure CLI](tutorial-enable-registry-cache-auth-cli.md)
6. [Troubleshooting guide for Cache for ACR](tutorial-troubleshoot-registry-cache.md)

## Cache for ACR (Preview)

Cache for ACR (preview) enables you to cache container images from public and private repositories. 

Implementing Cache for ACR provides the following benefits:

***High-speed pull operations:*** Faster pulls of container images are achievable by caching the container images in ACR. Since Microsoft manages the Azure network, pull operations are faster by providing Geo-Replication and Availability Zone support to the customers.

***Private networks:*** Cached registries are available on private networks. Therefore, users can configure their firewall to meet compliance standards. 

***Ensuring upstream content is delivered***: All registries, especially public ones like Docker Hub and others, have anonymous pull limits in order to ensure they can provide services to everyone. Cache for ACR allows users to pull images from the local ACR instead of the upstream registry. Cache for ACR ensures the content delivery from upstream and users gets the benefit of pulling the container images from the cache without counting to the pull limits.
 
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

## Upstream support 

Cache for ACR currently supports the following upstream registries:

| Upstream registries         | Support                                                      | Availability            |
| --------------------------- | ------------------------------------------------------------ | ----------------------- |
| Docker                      | Supports both authenticated pulls and unauthenticated pulls. | Azure CLI, Azure portal |
| Microsoft Artifact Registry | Supports unauthenticated pulls only.                         | Azure CLI, Azure portal |
| ECR Public                  | Supports unauthenticated pulls only.                         | Azure CLI               |
| GitHub Container Registry   | Supports both authenticated pulls and unauthenticated pulls. | Azure CLI               |

## Preview Limitations

- Cache for ACR feature doesn't support Customer managed key (CMK) enabled registries.

- Cache will only occur after at least one image pull is complete on the available container image. For every new image available, a new image pull must be complete. Cache for ACR doesn't automatically pull new tags of images when a new tag is available. It is on the roadmap but not supported in this release. 

- Cache for ACR only supports 50 cache rules.

## Next steps

* To enable Cache for ACR (preview) using the Azure portal advance to the next article: [Enable Cache for ACR](tutorial-enable-registry-cache.md).

<!-- LINKS - External -->

[docker-rate-limit]:https://aka.ms/docker-rate-limit
