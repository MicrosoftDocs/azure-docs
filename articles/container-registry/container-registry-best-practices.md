---
title: Best practices in Azure Container Registry
description: Learn how to use your Azure container registry effectively by following these best practices.
services: container-registry
documentationcenter: ''
author: mmacy
manager: timlt
editor: mmacy
tags: ''
keywords: ''

ms.assetid:
ms.service: container-registry
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/05/2017
ms.author: marsma
ms.custom:
---

# Best practices for Azure Container Registry

By following these best practices, you can help maximize the performance and cost-effective use of your private Docker registry in Azure.

## Network-close deployment

Create your container registry in the same Azure region in which you deploy containers. Placing your registry in a region that is network-close to your container hosts can help lower both latency and cost.

Network-close deployment is one of the primary reasons for using a private container registry. Docker images have a great [layering construct](https://docs.docker.com/engine/userguide/storagedriver/imagesandcontainers/) that allows for incremental deployments. However, new nodes need to pull all layers required for a given image. This initial `docker pull` can quickly add up to multiple gigabytes. Having a private registry close to your deployment minimizes the network latency.
Additionally, all public clouds, Azure included, implement network egress fees. Pulling images from one datacenter to another adds network egress fees, in addition to the latency.

## Geo-replicate multi-region deployments

Use Azure Container Registry's [geo-replication](container-registry-geo-replication.md) feature if you're deploying containers to multiple regions. Whether you're serving global customers from local data centers or your development team is in different locations, you can simplify registry management and minimize latency by geo-replicating your registry. Currently in preview, this feature is available with [Premium](container-registry-skus.md#premium) registries.

To learn how to use geo-replication, see the three-part tutorial, [Geo-replication in Azure Container Registry](container-registry-tutorial-prepare-registry.md).

## Repository namespaces

By leveraging repository namespaces, you can allow sharing a single registry across multiple groups within your organization. Registries can be shared across deployments and teams. Azure Container Registry supports nested namespaces, enabling group isolation.

For example, consider the following container image tags. Images that are used corporate-wide, like `aspnetcore`, are placed in the root namespace, while container images owned by the Production and Marketing groups each use their own namespaces.

```
contoso.azurecr.io/aspnetcore:2.0
contoso.azurecr.io/products/widget/web:1
contoso.azurecr.io/products/bettermousetrap/refundapi:12.3
contoso.azurecr.io/marketing/2017-fall/concertpromotions/campaign:218.42
```

## Dedicated resource group

Because container registries are resources that are used across multiple container hosts, a registry should reside its own resource group.

Although you might experiment with a specific host type, such as Azure Container Instances, you'll likely want to delete the container instance when you're done. However, you might also want to keep the collection of images you pushed to Azure Container Registry. By placing your registry in its own resource group, you minimize the risk of accidentally deleting the collection of images in the registry when you delete the container instance resource group.

## Authentication

When authenticating with an Azure container registry, there are two primary scenarios: individual authentication, and service (or "headless") authentication. The following table provides a brief overview of these scenarios, and the recommended method of authentication for each.

| Type | Example scenario | Recommended method |
|---|---|---|
| Individual identity | A developer pulling images to or pushing images from their development machine. | [az acr login](/cli/azure/acr?view=azure-cli-latest#az_acr_login) |
| Headless/service identity | Build and deployment pipelines where the user isn't directly involved. | [Service principal](container-registry-authentication.md#service-principal) |

For in-depth information about Azure Container Registry authentication, see [Authenticate with an Azure container registry](container-registry-authentication.md).

## Next steps

Azure Container Registry is available in several tiers, called SKUs, that each provide different capabilities. For details on the available SKUs, see [Azure Container Registry SKUs](container-registry-skus.md).