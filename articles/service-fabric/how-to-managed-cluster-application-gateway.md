---
title: Use Application Gateway in a Service Fabric managed cluster
description: This article describes how to use Application Gateway in a Service Fabric managed cluster.
ms.topic: how-to
ms.author: ankurjain
author: ankurjain
ms.service: service-fabric
ms.custom: devx-track-azurecli, devx-track-azurepowershell, devx-track-arm-template
services: service-fabric
ms.date: 09/05/2023
---

# Use Azure Application Gateway in a Service Fabric managed cluster

[Azure Application Gateway](../application-gateway/overview.md) is a web traffic load balancer that enables you to manage traffic to your web applications. There are [several benefits to using Application Gateway](https://azure.microsoft.com/en-us/products/application-gateway/#overview). Service Fabric managed cluster supports Azure Application Gateway and allows you to connect your node types to an Application Gateway. You can [create an Azure Application Gateway](../application-gateway/quick-create-portal.md) and pass the resource id to the service fabric managed cluster ARM template. 


## How to use Application Gateway in a Service Fabric managed cluster

### Requirements 

  Use Service Fabric API version 2022-08-01-Preview (or newer).

## Steps 

The following section describes the steps that should be taken to use Azure Application Gateway in a Service Fabric managed cluster:

1. Follow the steps in the [Quickstart: Direct web traffic using the portal - Azure Application Gateway](../application-gateway/quick-create-portal.md). Note the resource ID for use in a later step. 

2. Link your Application Gateway to the node type of your Service Fabric managed cluster. To do this, you must grant SFMC permission to join the application gateway. This permission is granted by assigning SFMC the “Network Contributor” role on the application gateway resource as described in steps below: 
