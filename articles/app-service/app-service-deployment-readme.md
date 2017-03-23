---
title: Deploying Applications to Azure App Service
description: Learn how to Deploy applications to App Service work
keywords: app service, azure app service, deploying, deployment
services: app-service
documentationcenter: ''
author: dariagrigoriu
manager: erikre
editor: ''

ms.assetid: de12cd6e-e124-4e48-90bc-c3a3801305da
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/09/2016
ms.author: dariagrigoriu

---
# Azure App Service Deployment Overview
Azure App Service provides a rich and integrated feature set to support creating powerful and flexible deployment workflows. App deployment can leverage options that include continuous integration or local source control publishing, WebDeploy, and FTP. The recommended method for production app deployment is deployment slot swap. Deployment slots represent staging and integration environments associated with production apps. Deployment slots can be configured and targeted with web traffic for validation, and traffic can be swapped on demand for deployment to production with no down time and automated warm-up. The steps of a deployment workflow can be easily automated via release management products such as Visual Studio Release Management. This is useful for coordination with other solution resources (e.g. data store), recurrence, and replication across multiple units of deployment. 

[!INCLUDE [app-service-blueprint-deployment](../../includes/app-service-blueprint-deployment.md)]

