---
title: Azure container registry skus | Microsoft Docs
description: Comparisons between the different ACR SKUs
services: container-registry
documentationcenter: ''
author: stevelas
manager: balans
editor: mmacy


ms.service: container-registry
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/05/2017
ms.author: stevelas

---
# Azure container registry SKUs

Azure Container Registry is available in multiple tiers. ACR SKUs provide predictable pricing and options for how you wish to use a Private Registry. Choosing a higher SKU will provide more performance and scale. However, all SKUs provide the same programmatic capabilities, enabling a developer to get started with Basic and convert to Standard and Premium as their usage increases. 

## Basic
A cost-optimized entry point for developers learning about Azure Container Registry. Basic registries have the same programmatic capabilities as Standard and Premium (Azure Active Directory authentication integration, image deletion, and web hooks), however, there are size and usage constraints.

## Standard 
Offers the same capabilities as Basic, with increased storage limits and image throughput. Standard registries should satisfy the needs of most production scenarios.

## Premium
Offer higher limits on constraints, such as storage and concurrent operations enabling  high-volume scenarios. In addition to higher image throughput capacity, Premium adds features like [geo-replication](container-registry-geo-replication.md) for managing a single registry across multiple regions, maintaining a network-close registry to each deployment.

## Classic 
Classic provides minimal functionality, enabling an initial release of ACR. Classic registries required a storage account in the customers subscription, limiting the ability for ACR to provide higher level capabilities, such as increased performance throughput and geo-replication. 
> [!NOTE]
> Classic registries will be deprecated in the near future. Please see Basic, Standard or Premium registries for newly created registries. For existing Classic registries, please see Changing SKUs
>
| Feature | Basic | Standard | Premium |
|---|---|---|---|---|
| Storage | 10 gib | 100 gib| 500 gib |
| ReadOps/Min | 1k | 100k | 5,000k | 
| WriteOps/Min | 100 | 1k | 500k | 
| WebHooks | 2 | 10 | 100| 
| Geo-replication | N/A | N/A | Supported *(Preview)* |

### ReadOps
Docker pull translates to multiple read operations based on the number of layers, plus the manifest retrieval. 

Docker Reference: [Pulling An Image](https://docs.docker.com/registry/spec/api/#pulling-an-image)


### WriteOps
Docker push translates to multiple write operations, based on the number of layers that must be pushed. A docker push includes ReadOps to retrieve a manifest for an existing image. 

Docker Reference: [Pushing An Image](https://docs.docker.com/registry/spec/api/#pushing-an-image)

## Maintaining registry sizes
SKU storage constraints are intended to be aligned with the typical scenario. Basic for getting started, standard for the majority of production apps, while premium provides hyper-scale performance and [geo-replication](container-registry-geo-replication.md). 

Repository sizes can be maintained with the [az acr repository delete](/cli/azure/acr/repository?view=azure-cli-latest#az_acr_repository_delete) API.


# Changing SKUs
Changing between SKUs can be completed through the Azure Portal or the az CLI.
## Changing from Classic
Changing from classic registries requires copying images from the associated storage account in the subscription. This process will take some time. While conversion, `docker pull` will continue to function, however `docker push` will be blocked until conversion is complete. 
Once completed, the subscription storage account is no longer used by ACR. 

## Changing SKUs with the Azure Portal
From **Overview** in the Azure Portal, choose **Update** to configure the desired SKU.
![SKU Update](media/container-registry-skus\update-registry-sku.png)


## Changing SKUs with the az cli
Change between SKUs using the [az acr update](/cli/azure/acr?view=azure-cli-latest#az_acr_update) api

Example: `ac acr update -n MyRegistry --sku premium`

