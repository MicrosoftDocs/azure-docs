---
title: Capacity planning for Azure App Service server roles in Azure Stack | Microsoft Docs
description: Capacity planning for Azure App Service server roles in Azure Stack
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: app-service
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/15/2018
ms.author: sethm
ms.reviewer: anwestg

---
# Capacity planning for Azure App Service server roles in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

To set up a production ready deployment of Azure App Service on Azure Stack, you must plan for the capacity you expect the system to support.  

This article provides guidance for the minimum number of compute instances and compute SKUs you should use for any production deployment.

You can plan your App Service capacity strategy using these guidelines.

| App Service server role | Minimum recommended number of instances | Recommended compute SKU|
| --- | --- | --- |
| Controller | 2 | A1 |
| Front End | 2 | A1 |
| Management | 2 | A3 |
| Publisher | 2 | A1 |
| Web Workers - shared | 2 | A1 |
| Web Workers - dedicated | 2 per tier | A1 |

## Controller role

**Recommended minimum**: Two instances of A1 Standard

The Azure App Service controller typically experiences low consumption of CPU, memory, and network resources. However, for high availability, you must have two controllers. Two controllers are also the maximum number of controllers permitted. You can create the second web sites controller direct from the installer during deployment.

## Front-end role

**Recommended minimum**: Two instances of A1 Standard

The front end routes requests to web workers depending on web worker availability. For high availability, you should have more than one front end, and you can have more than two. For capacity planning purposes, consider that each core can handle approximately 100 requests per second.

## Management role

**Recommended minimum**: Two instances of A3 Standard

The Azure App Service management role is responsible for the App Service Azure Resource Manager and API endpoints, portal extensions (admin, tenant, Functions portal), and the data service. The management server role typically requires only about 4-GB RAM in a production environment. However, it may experience high CPU levels when many management tasks (such as web site creation) are performed. For high availability, you should have more than one server assigned to this role, and at least two cores per server.

## Publisher role

**Recommended minimum**: Two instances of A1 Standard

If many users are publishing simultaneously, the publisher role may experience heavy CPU usage. For high availability, make sure more than one publisher role is available. The publisher only handles FTP/FTPS traffic.

## Web worker role

**Recommended minimum**: Two instances of A1 Standard

For high availability, you should have at least four web worker roles, two for shared web site mode and two for each dedicated worker tier you plan to offer. The shared and dedicated compute modes provide different levels of service to tenants. You might need more web workers if many of your customers are:

- Using dedicated compute mode worker tiers (which are resource-intensive).
- Running in shared compute mode.

After a user has created an App Service plan for a dedicated compute mode SKU, the number of web worker(s) specified in that App Service plan is no longer available to users.

To provide Azure Functions to users in the consumption plan model, you must deploy shared web workers.

When deciding on the number of shared web worker roles to use, review these considerations:

- **Memory**: Memory is the most critical resource for a web worker role. Insufficient memory impacts web site performance when virtual memory is swapped from disk. Each server requires about 1.2 GB of RAM for the operating system. RAM above this threshold can be used to run web sites.
- **Percentage of active web sites**: Typically, about 5 percent of applications in an Azure App Service on Azure Stack deployment are active. However, the percentage of applications that are active at any given moment can be higher or lower. With an active application rate of 5 percent, the maximum number of applications to place in an Azure App Service on Azure Stack deployment should be less than 20 times the number of active web sites (5 x 20 = 100).
- **Average memory footprint**: The average memory footprint for applications observed in production environments is about 70 MB. Using this footprint, the memory allocated across all web worker role computers or VMs can be calculated as follows:

   `Number of provisioned applications * 70 MB * 5% - (number of web worker roles * 1044 MB)`

   For example, if there are 5,000 applications on environment that is running 10 web worker roles, each web worker role VM should have 7060-MB RAM:

   `5,000 * 70 * 0.05 – (10 * 1044) = 7060 (= about 7 GB)`

   For information about adding more worker instances, see [Adding more worker roles](azure-stack-app-service-add-worker-roles.md).

## File server role

For the file server role, you can use a standalone file server for development and testing; for example, when deploying Azure App Service on the Azure Stack Development Kit (ASDK) you can use this template: https://aka.ms/appsvconmasdkfstemplate. For production purposes, you should use a pre-configured Windows file server, or a pre-configured non-Windows file server.

In production environments, the file server role experiences intensive disk I/O. Because it houses all of the content and application files for user web sites, you should pre-configure one of the following resources for this role:

- Windows file server
- Windows file server cluster
- Non-Windows file server
- Non-Windows file server cluster
- NAS (Network Attached Storage) device

For more information, see [Provision a file server](azure-stack-app-service-before-you-get-started.md#prepare-the-file-server).

## Next steps

See the following article for more information:

[Before you get started with App Service on Azure Stack](azure-stack-app-service-before-you-get-started.md)
