---
title: Azure Service Fabric - Deploy application with User Managed Identity | Microsoft Docs
description: This article shows you how to deploy Service Fabric application with User Managed Identity
services: service-fabric
author: athinanthny

ms.service: service-fabric
ms.topic: article
ms.date: 07/25/2019
ms.author: atsenthi
---
# Deploy Service Fabric application with Managed Identity

To deploy a Service Fabric application with Managed Identity, the application needs to be deployed through Azure Resource Manager, typically with an Azure Resource Manager template. Applications created / deployed with the native Service Fabric API can not have Managed Identities. For more information on how to deploy Service Fabric application through Azure Resource Manager, please refer to [Manage applications and services as Azure Resource Manager resources](service-fabric-application-arm-resource.md).


[!NOTE] Service Fabric application deployment with Managed Identity is supported with API version "2019-06-01-preview". You can also use the same API version for application type, application type version and service resources.

## User Assigned identity

### Application template

### Application package

TODO: add link to full sample

## Next steps
