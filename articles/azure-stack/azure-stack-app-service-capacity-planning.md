---
title: Capacity planning for Azure App Service server roles in Azure Stack | Microsoft Docs
description: Capacity planning for Azure App Service server roles in Azure Stack
services: azure-stack
documentationcenter: ''
author: apwestgarth
manager: stefsch
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: app-service
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 9/25/2017
ms.author: anwestg

---
# Capacity planning for Azure App Service server roles in Azure Stack

To provision a production ready deployment of Azure App Service on Azure Stack, you must plan for the capacity you expect the system to support.  Here is guidance on the minimum number of instances and compute SKUs you should use for any production deployment.

You can plan your App Service capacity strategy using these guidelines. Future versions of Azure Stack will provide high availability options for App Service.

| App Service server role | Minimum recommended number of instances | Recommended compute SKU|
| --- | --- | --- |
| Controller | 2 | A1 |
| Front End | 2 | A1 |
| Management | 2 | A3 |
| Publisher | 2 | A1 |
| Web Workers - shared | 2 | A1 |
| Web Workers - dedicated | 2 per tier | A1 |

## Controller role

**Recommended minimum**: 2 instances of A1 standard

The Azure App Service Controller typically experiences low consumption of CPU, memory, and network resources. However, for high availability, you must have two controllers. Two controllers is also the maximum number of controllers permitted. You can create the second Web Sites Controller direct from the installer during deployment.

## Front End role

**Recommended minimum**: 2 instances of A1 standard

The Front End routes requests to Web Workers depending on Web Worker availability. For high availability, you should have more than one Front End, and you can have more than two. For capacity planning purposes, consider that each core can handle approximately 100 requests per second. 

## Management role

**Recommended minimum**: 2 instances of A3

The Azure App Service Management Role is responsible for the App Service Azure Resource Manager and API Endpoints, portal extensions (admin, tenant, Functions portal), and the data service. The Management Server role typically requires only about 4 GB RAM in a production environment. However, it may experience high CPU levels when many management tasks (such as web site creation) are performed. For high availability, you should have more than one server assigned to this role, and at least two cores per server.

## Publisher role

**Recommended minimum**: 2 instances of A1

The Publisher role may experience heavy CPU utilization if many tenants are publishing simultaneously. For high availability, make more than one Publisher role available.  The Publisher only handles FTP/FTPS traffic.

## Web worker role

**Recommended minimum**: 2 instances of A1

For high availability, you should have at least four Web Worker Roles, two for Shared web site mode and two for each Dedicated worker tier you plan to offer. The Shared and dedicated compute modes provide different levels of service to tenants. Of course, if you have many customers using dedicated compute mode worker tiers (which are resource intensive), or many customers running in shared compute mode, more Web Workers will be required.

When considering the number of Web Worker roles to provision, remember that after a user has created an App Service Plan for a dedicated compute mode SKU, that the number of Web Worker(s) specified in that App Service Plan will no longer be available to users.

In order to provide Azure Functions to users who want to use the consumption plan model, you must deploy Shared Web Workers.

When deciding on the number of shared Web Worker roles to use, consider the following:

- **Memory**: Memory is the most critical resource for a Web Worker role. Insufficient memory impacts web site performance when virtual memory is swapped from disk. Each server requires approximately 1.2 GB of RAM for the operating system; the RAM available above this threshold can be used to run web sites.
- **Percentage of active web sites**: Based on observed production workloads, approximately 5 percent of applications in an Azure App Service on Azure Stack deployment are typically active. However, the percentage of applications that are active at any given moment can be significantly higher or lower. Assuming an "active application" rate of 5 percent, the maximum number of applications to place in an Azure App Service on Azure Stack deployment should be no more than 20 times the number of active web sites (5 x 20 = 100).
- **Average memory footprint**: The average memory footprint for applications observed in production environments is about 70 MB. Based on this number, the amount of memory that should be allocated across all Web Worker role computers or VMs installed on an Azure App Service on Azure Stack deployment may be calculated as follows:
    
    *Number of Provisioned applications * 70MB * 5% - (Number of Web Worker Roles * 1044 MB)*

   For example, if 5,000 applications are provisioned on a Azure App Service on Azure Stack that is running 10 Web Worker roles, then each Web Worker role computer or VM should be allocated 7060 MB of RAM determined as follows:
   
   5,000 * 70 * .05 – (10 * 1044) = 7060 (=about 7 GB)
   
   For information on adding more worker instances see [Adding more worker roles](azure-stack-app-service-add-worker-roles.md).
   
** File server role

For the File Server role, you can use the Standalone file server for development and testing. For production purposes, you should use a pre-configured Windows File Server, or a pre-configured non-Windows file server.

The Standalone file server is included as part of the default Windows Azure Pack: Web Sites installation. The Standalone installation provisions the File Server role on a single machine, places ACLs for the appropriate accounts, and creates the necessary network shares.

In production environments, the File Server role experiences intensive disk I/O. Because it houses all of the content and application files for tenant web sites, you should pre-configure a Windows File Server, File Server Cluster, or a non-Windows file server, file server cluster, or NAS (Network Attached Storage) device for this role. For more information, see [provision a file server]().

## Next steps

[Before you get started with App Service on Azure Stack](azure-stack-app-service-before-you-get-started.md)
