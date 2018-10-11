---
title: App Service on Azure Stack update 2 release notes | Microsoft Docs
description: Learn about what's in update two for App Service on Azure Stack, the known issues, and where to download the update.
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
ms.date: 05/18/2018
ms.author: anwestg
ms.reviewer: sethm

---
# App Service on Azure Stack update 2 release notes

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

These release notes describe the improvements and fixes in Azure App Service on Azure Stack Update 2 and any known issues. Known issues are divided into issues directly related to the deployment, update process, and issues with the build     (post-installation).

> [!IMPORTANT]
> Apply the 1804 update to your Azure Stack integrated system or deploy the latest Azure Stack development kit before deploying Azure App Service 1.2.
>
>

## Build reference

The App Service on Azure Stack Update 2 build number is **72.0.13698.10**

### Prerequisites

> [!IMPORTANT]
> New deployments of Azure App Service on Azure Stack now require a [three-subject wildcard certificate](azure-stack-app-service-before-you-get-started.md#get-certificates) due to improvements in the way in which SSO for Kudu is now handled in Azure App Service. The new subject is **\*.sso.appservice.\<region\>.\<domainname\>.\<extension\>**
>
>

Refer to the [Before You Get Started documentation](azure-stack-app-service-before-you-get-started.md) before beginning deployment.

### New features and fixes

Azure App Service on Azure Stack Update 2 includes the following improvements and fixes:

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

- Auto Swap of deployment slots feature enabled - [Configuring Auto Swap](https://docs.microsoft.com/azure/app-service/web-sites-staged-publishing#configure-auto-swap)

- Testing in Production feature enabled - [Introduction to Testing in Production](https://azure.microsoft.com/resources/videos/introduction-to-azure-websites-testing-in-production-with-galin-iliev/)

- Azure Functions Proxies enabled - [Work with Azure Functions Proxies](https://docs.microsoft.com/azure/azure-functions/functions-proxies)

- App Service Admin extension UX support added for:
  - Secret rotation
  - Certificate rotation
  - System credential rotation
  - Connection string rotation

### Known issues (post-installation)

- Workers are unable to reach file server when App Service is deployed in an existing virtual network and the file server is only available on the private network.

If you chose to deploy into an existing virtual network and an internal IP address to connect to your file server, you must add an outbound security rule, enabling SMB traffic between the worker subnet and the file server. To do this, go to the WorkersNsg in the Admin Portal and add an outbound security rule with the following properties:
 * Source: Any
 * Source port range: *
 * Destination: IP Addresses
 * Destination IP address range: Range of IPs for your file server
 * Destination port range: 445
 * Protocol: TCP
 * Action: Allow
 * Priority: 700
 * Name: Outbound_Allow_SMB445

### Known issues for Cloud Admins operating Azure App Service on Azure Stack

Refer to the documentation in the [Azure Stack 1804 Release Notes](azure-stack-update-1804.md)

## Next steps

- For an overview of Azure App Service, see [Azure App Service on Azure Stack overview](azure-stack-app-service-overview.md).
- For more information about how to prepare to deploy App Service on Azure Stack, see [Before you get started with App Service on Azure Stack](azure-stack-app-service-before-you-get-started.md).
