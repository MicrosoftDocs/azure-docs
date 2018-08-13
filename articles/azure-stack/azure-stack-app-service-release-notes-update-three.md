---
title: App Service on Azure Stack update 3 release notes | Microsoft Docs
description: Learn about what's in update three for App Service on Azure Stack, the known issues, and where to download the update.
services: azure-stack
documentationcenter: ''
author: apwestgarth
manager: stefsch
editor: ''

ms.assetid:  
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/14/2018
ms.author: anwestg
ms.reviewer: brenduns

---
# App Service on Azure Stack update 2 release notes

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

These release notes describe the improvements and fixes in Azure App Service on Azure Stack Update 3 and any known issues. Known issues are divided into issues directly related to the deployment, update process, and issues with the build     (post-installation).

> [!IMPORTANT]
> Apply the 1807 update to your Azure Stack integrated system or deploy the latest Azure Stack development kit before deploying Azure App Service 1.3.
>
>

## Build reference

The App Service on Azure Stack Update 3 build number is **74.0.13698.10**

### Prerequisites

Refer to the [Before You Get Started documentation](azure-stack-app-service-before-you-get-started.md) before beginning deployment.

### New features and fixes

Azure App Service on Azure Stack Update 3 includes the following improvements and fixes:

- Updates to **App Service Tenant, Admin, Functions portals and Kudu tools**. Consistent with Azure Stack Portal SDK version.

- Updates to core service to improve reliability and error messaging enabling easier diagnosis of common issues.

- **Updates to the following application frameworks and tools**:
  - Added .Net Framework 4.7.1
  - Added **Node.JS** versions:
    - NodeJS 6.12.3
    - NodeJS 8.9.4
    - NodeJS 8.10.0
    - NodeJS 8.11.1
  - Added **NPM** versions:
    - 5.6.0
  - Updated .Net Core components to be consistent with Azure App Service in public cloud.
  - Updated Kudu

- App Service Admin extension UX support added for:
  - Secret rotation
  - Certificate rotation
  - System credential rotation
  - Connection string rotation

### Known issues (post-installation)

### Known issues for Cloud Admins operating Azure App Service on Azure Stack

Refer to the documentation in the [Azure Stack 1804 Release Notes](azure-stack-update-1807.md)

## Next steps

- For an overview of Azure App Service, see [Azure App Service on Azure Stack overview](azure-stack-app-service-overview.md).
- For more information about how to prepare to deploy App Service on Azure Stack, see [Before you get started with App Service on Azure Stack](azure-stack-app-service-before-you-get-started.md).
