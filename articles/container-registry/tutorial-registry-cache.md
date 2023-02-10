---
title: Caching for ACR - Overview
description: An overview on Caching for ACR feature, its preview limitations and benefits of enabling the feature in your Registry.
ms.topic: tutorial
ms.date: 04/19/2022
ms.author: tejaswikolli
---
# Caching for Azure Container Registry

Azure Container Registry (ACR) introduces its new feature Caching for ACR. This feature allows users to cache container images in a private container registry. Caching for ACR, is a preview feature available in *Basic*, *Standard*, and *Premium* [service tiers](container-registry-skus.md).

This article is part one in a four-part tutorial series. The tutorial covers:

> [!div class="checklist"]
> * Caching for ACR - Overview
> * Enable Caching for ACR - Azure portal
> * Enable Caching for ACR with authentication - Azure portal
> * Troubleshooting guide for Caching for ACR

## Caching for ACR

Caching for ACR enables you to cache container images from public registries. 

Implementing Caching for ACR provides the following benefits:

***High-speed pull operations:*** Faster pulls of container images are achievable by caching the container images in ACR. Since Microsoft manages the Azure network, pull operations are faster by providing Geo-Replication and Availability Zone support to the customers.

***Private networks:*** Cached registries are available on private networks. Therefore, users can configure their firewall to meet compliance standards. 

***Docker Rate Limit:***  Docker has updated their terms of services. The new limits allow anonymous users to 100 pull operations every six hours. Free Docker account users have 200 pull operations limit for every six hours. The Docker subscription users have 5000 pull operations limit for every 24 hours. Caching for ACR allows users to pull images from the cache. Container images pulled from the cache ***do not*** count toward Docker's pull limit. Learn more docker hub rate limit [here][docker-rate-limit]. 

## Preview Limitations

- Quarantine functions like signing, scanning, and manual compliance approval are on the roadmap but aren't included in this release.

- Caching will only occur after the container image is requested at least once. For every new image available, a new pull request must be made. Caching for ACR doesn't automatically pull new version of images when a new version is available. This is on the roadmap but isn't supported in this release. 

-  Caching for ACR only supports Docker Hub and Microsoft Artifact Registry. Multiple other registries  including self-hosted registries are on the roadmap but aren't included in this release.

- Caching for ACR is only available by using the Azure portal. The Azure CLI is released in the coming weeks.   

## Terminology 

- Cache Rule
    - Cache Rules are a set of rules you can create to pull artifacts from a supported registry into your cache. A cache rule contains four parts:
        
        1. A Rule Name - The name of your cache rule. For example, `Hello-World-Cache`.

        2. A Source - The name of the Source Registry. Currently, we only support **Docker Hub** and **Microsoft Artifact Registry**. 

        3. A Repository Path - The source path of the repository to find and retrieve artifacts you want to cache. For example, `docker.io/library/hello-world`.

        4. An ACR Repository Path - The name of the new repository path to store artifacts. For example, `hello-world`. The Repository can't already exist inside the ACR instance. 

- Credential Set
    - A credential set is a username and password for the source registry. A credential set is needed if you wish to authenticate with a public or private repository. A credential set contains four parts

        1. A Credential Set Name - The name of your credential set.

        2. A Source registry Login Server - The login server of your source registry. Only `docker.io` is supported. 

        3. A Source Authentication - The key vault locations to store credentials. 
        
        4. Username and Password secrets: The secrets containing the username and password. 

## Next steps

* To enable Caching for ACR using the Azure portal advance to the next article: [Enable Caching for ACR](tutorial-enable-registry-cache.md).

<!-- LINKS - External -->

[docker-rate-limit]:aka.ms/docker-rate-limit