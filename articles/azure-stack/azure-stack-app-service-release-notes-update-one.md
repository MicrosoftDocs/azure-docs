---
title: App Service on Azure Stack Update One | Microsoft Docs
description: Learn about what's in update one for App Service on Azure Stack, the known issues, and where to download the update.
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
ms.date: 03/08/2018
ms.author: anwestg
ms.reviewer: brenduns

---
# App Service on Azure Stack Update One Release Notes

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

These release notes describe the improvements and fixes in Azure App Service on Azure Stack Update 1 and any known issues. Known issues are divided into issues directly related to the deployment, update process, and issues with the build     (post-installation).

> [!IMPORTANT]
> Apply the 1802 update to your Azure Stack integrated system or deploy the latest Azure Stack development kit before deploying Azure App Service.
>
>

## Build reference

The App Service on Azure Stack Update 1 build number is **69.0.13698.9**

### Prerequisites

> [!IMPORTANT]
> Azure App Service on Azure Stack now requires a [three-subject wildcard certificate](azure-stack-app-service-before-you-get-started.md#get-certificates) due to improvements in the way in which SSO for Kudu is now handled in Azure App Service.  The new subject is ** *.sso.appservice.<region>.<domainname>.<extension>**
>
>

Refer to the [Before You Get Started documentation](azure-stack-app-service-before-you-get-started.md) before beginning deployment.

### New features and fixes

Azure App Service on Azure Stack Update 1 includes the following improvements and fixes:

- **High Availability of Azure App Service** - The Azure Stack 1802 update enabled workloads to be deployed across fault domains.  Therefore App Service infrastructure is able to be fault tolerant as it will be deployed across fault domains.  By default all new deployments of Azure App Service will have this capability however for deployments completed prior to Azure Stack 1802 update being applied refer to the [App Service Fault Domain documentation](azure-stack-app-service-fault-domain-update.md)

- **Deploy in existing virtual network** - Customers can now deploy App Service on Azure Stack within an existing virtual network.  Deploying in an existing virtual network enables customers to connect to the SQL Server and File Server, required for Azure App Service, over private ports.  During deployment customers can select to deploy in an existing virtual network, however [must create subnets for use by App Service](azure-stack-app-service-before-you-get-started.md#virtual-network) prior to deployment.

- Updates to **App Service Tenant, Admin, Functions portals and Kudu tools**.  Consistent with Azure Stack Portal SDK version.

- **Updates to the following application frameworks and tools**:
    - Added **.Net Core 2.0** support
    - Added **Node.JS** versions:
        - 6.11.2
        - 6.11.5
        - 7.10.1
        - 8.0.0
        - 8.1.4
        - 8.4.0
        - 8.5.0
        - 8.7.0
        - 8.8.1
        - 8.9.0
    - Added **NPM** versions:
        - 3.10.10
        - 4.2.0
        - 5.0.0
        - 5.0.3
        - 5.3.0
        - 5.4.2
        - 5.5.1
    - Added **PHP** Updates:
        - 5.6.32
        - 7.0.26 (x86 and x64)
        - 7.1.12 (x86 and x64)
    - Updated **Git for Windows** to v 2.14.1
    - Updated **Mercurial** to v4.5.0

  - Added support for **HTTPS Only** feature within Custom Domain feature in the App Service Tenant Portal. 

  - Added validation of storage connection in the custom storage picker for Azure Functions 

#### Fixes

- When creating an offline deployment package, customers will no longer receive an access denied error message when opening the folder from the App Service installer

- Resolved issues when working in the Custom Domains feature in the App Service Tenant Portal.

- Prevent customers using reserved administrator names during setup

- Enabled App Service deployment with **domain joined** file server

- Improved retrieval of Azure Stack root certificate in script and now validate the root cert in the App Service installer.

- Fixed incorrect status being returned to Azure Resource Manager when a subscription is deleted that contained resources in the Microsoft.Web namespace.

### Known issues with the deployment process

- There are no known issues for the deployment of Azure App Service on Azure Stack Update 1.

### Known issues with the update process

- There are no known issues for the update of Azure App Service on Azure Stack Update 1.

### Known issues (post-installation)

- There are no known issues for the installation of Azure App Service on Azure Stack Update 1.

### Known issues for Cloud Admins operating Azure App Service on Azure Stack

Refer to the documentation in the [Azure Stack 1802 Release Notes](azure-stack-update-1802.md)

## See also

- For an overview of Azure App Service, see [Azure App Service on Azure Stack overview](azure-stack-app-service-overview.md).
- For more information about how to prepare to deploy App Service on Azure Stack, see [Before you get started with App Service on Azure Stack](azure-stack-app-service-before-you-get-started.md).
