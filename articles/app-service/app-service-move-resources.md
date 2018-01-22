---
title: Move an Azure Web App to another resource group | Microsoft Docs
description: Describes the scenarios where you can move Web Apps and App Services from one Resource Group to another.
services: app-service
documentationcenter: ''
author: ZainRizvi
manager: erikre
editor: ''

ms.assetid: 22f97607-072e-4d1f-a46f-8d500420c33c
ms.service: app-service
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/19/2017
ms.author: zarizvi

---
# Move an Azure Web App to another resource group
You can move a Web App and/or its related resources to another resource group in the same subscription, or to a resource group in a different subscription. This is done as part of standard resource management in Azure. For more information, see [Move Azure resources to new subscription or resource group](../azure-resource-manager/resource-group-move-resources.md).

## Limitations when moving within the same subscription

When moving a Web App _within the same subscription_, you cannot move the uploaded SSL certificates. However, you can move a Web App to the new resource group without moving its uploaded SSL certificate, and your app's SSL functionality still works. 

If you want to move the SSL certificate with the Web App, follow these steps:

1.	Delete the uploaded certificate from the Web App.
2.	Move the Web App.
3.	Upload the certificate to the moved Web App.

## Limitations when moving across subscriptions

When moving a Web App _across subscriptions_, the following limitations apply:

- The destination resource group must not have any existing App Service resources. App Service resources include:
    - Web Apps
    - App Service plans
    - Uploaded or imported SSL certificates
    - App Service Environments
- All App Service resources in the resource group must be moved together.
- App Service resources can only be moved from the resource group in which they were originally created. If an App Service resource is no longer in its original resource group, it must be moved back to that original resource group first, and then it can be moved across subscriptions. 
