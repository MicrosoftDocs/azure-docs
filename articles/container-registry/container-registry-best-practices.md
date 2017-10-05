---
title: Best Practices when using the Azure Container Registry | Microsoft Docs
description: Some best practices for utilizing the Azure Container Registry.
services: container-registry
documentationcenter: ''
author: stevelas
manager: balans
editor: ''
tags: ''
keywords: ''

ms.assetid: 1dsa937a-76da-405b-b9ec-25a6c2f27417
ms.service: container-registry
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/04/2017
ms.author: stevelas
ms.custom: ''
---
# Network-Close to Container Hosts
One of the main reasons for deploying a private registry is to have it network-close to your container hosts.
Docker images have a great layering construct that allows for incremental deployments. However, new nodes will need to pull all layers required for a given image. This initial docker pull can quickly add up to multiple gigabytes. Having a private registry close to your deployment will minimize the network latency. 
Further, all public clouds implement network egress fees. Pulling images from one data center to anther will add network egress fees, in addition to the latency. 

## Multiple Regions
When working with a single region, simply create ACR in the same region as your deployments. However, if you're utilizing multiple regions, either for serving customers from a local data center, or your development team is in different locations, you can utilize the [geo-replication features](container-registry-overview-geo-replication.md) of ACR. 

# Registry Name
Registries can be shared across multiple deployments and multiple teams. Azure Container Registry supports nested namesapces, enabling group isolation:
`
contsoso.azurecr.io/products/widget/web:1
contsoso.azurecr.io/products/bettermousetrap/refundapi:12.3
contsoso.azurecr.io/marketing/2017-fall/concertpromotions/campaign:218.42
`

You may put corporate images in the root of the registry:
```contoso.azurecr.io/aspnetcore:2.0```

By leveraging namespaces, you can share a single registry across multiple groups.

# Unique Resource Group
As registries are resources used across multiple container hosts, a registry should default to its own resource group. Although you may experiment with a specific host type, such as Azure Container Instances, you'll likely want to delete the ACI instance once done. However, you may want to keep the collection of images you pushed to ACR. By placing ACR in its own resource group, you minimize the risk of accidentally deleting the collection of images you may want to use with other container hosts. 

# Authentication
When authenticating with ACR, there are two basic scenarios:
| Type | Description | Recommendation |
|---|---|---|
| Individual Identity | A developer pulling or pushing images from their development machine | az acr login |
|Headless/Service Identity | Build and deployment pipelines where the user isn't directly involved | Service Principals |

For more information, see [Authenticating with ACR](container-registry-authentication.md)

