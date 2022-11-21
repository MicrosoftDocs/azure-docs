---
title: About Registry Cache
description: Learn about the Registry Cache feature, its preview limitations and benefits of enabling the feature in your Registry.
ms.topic: tutorial
ms.date: 04/19/2022
ms.author: tejaswikolli
---
# Registry Cache for Azure Container Registry

Azure Container Registry (ACR) introduces Registry Cache feature to cache container images in a private container registry. The Registry Cache, is a preview feature available in *Standard* and *Premium* [service tiers](container-registry-skus.md).

This article is part one in a three-part tutorial series. The tutorial covers:

> [!div class="checklist"]
> * About Registry Cache
> * Enable a Registry Cache
> * Troubleshoot guide for Registry Cache

## About Registry Cache

By enabling the Registry Cache, you can access, fetch, and cache the artifacts on demand. Registry Cache enables you to access content from authenticated public registries such as docker hub, GitHub registry, quay, nvidia, authenticated private registries, and on-perm registries such as harbor, JFrog, nexus. 

The cached artifacts are accessible from private VNETs using ACR [Private Link Support](/azure/container-registry/container-registry-private-link). All the cached artifacts will be delivered through ACR.  If the pull operations are not performed on the cached artifacts for x number of days, they will be automatically purged.

Registry Cache also allows you to enable Geo-Replication and Availability Zone support on the private registry. By enabling notification providers, Registry Caching supports existing registries ACR to periodically poll for updates, and send push based notifications from upstream registries.

Registry Cache implementation provides the following benefits:

*Cache container images* using ACR instances from a public repository of choice, customers can pull the container images directly from the cache and store them in the private container registry of their making.

*High-speed pull operations* of the container images are achievable by caching the container images in the internal registry. Microsoft manages the speed to achieve fast pull operations by providing Geo-Replication and Zone support to the customers.

*Private networks* provide image management for a cached registry behind customer configured firewall to increase security. 

*Docker throttling* updated the terms and services to limit 100 anonymous pulls every six hours, 200 pulls for free Docker accounts every six hours, and an option to pay for a Docker subscription to receive 5,000 pull operations per 24 hours. The Registry Caching feature solves this by allowing customers to pull from the private registry when required. Thereby avoid hitting the rate limit and increasing the reliability.

## Preview Limitations

>* Enabling Quarantine, Signing, or Scanning for the Cached Registry is in the plan through the Automated Cache capabilities.
>* Registry Cache doesn't support enabling original registry url's and changing references from nginx or docker.io/library/nginx to myregistry.azurecr.io/docker-hub/nginx:1.21.4
>* Registry Cache feature doesn't support enabling repository or tag renaming. Upstream repos, such as nginx, will be available as the same reponame:tag.
>* Registry Cache feature doesn't support requests from multiple registries to an ACR instance. While ACR may have optimized paths to fetch the content, once pulled through the ACR instance, the artifacts manifests, blobs and metadata are stored in the users ACR storage.

## Next steps

* To enable Registry Cache using the Azure CLI, and the Azure portal advance to the next article: [Enable Registry Cache](tutorial-enable-registry-cache.md).
