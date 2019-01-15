---
title: Azure and AppSource Marketplace Offers  | Microsoft Docs
description: Creating and managing offers of the Azure and AppSource Marketplaces
services: Azure, AppSource, Marketplace, Cloud Partner Portal, 
documentationcenter:
author: v-miclar
manager: Patrick.Butler  
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: conceptual
ms.date: 01/09/2019
ms.author: pbutlerm
---

# Azure and AppSource Marketplace Offers

This first part of this section introduces the general operations used to create and manage offers for the Azure and AppSource Marketplaces.  This part provides the background you need to understand to manage specific offer types, as well as technical information that is common to all offer types.  The majority of this section contains detailed instructions on how to create and manage specific offer types.  

The following video introduces the various capabilities and different offers types available in Azure Marketplace or AppSource.  It also covers important technical and business aspects of publishing an application or service in these marketplaces.

> [!VIDEO https://channel9.msdn.com/Events/Build/2018/BRK2513/player]

**Building Apps and Services for Azure Marketplace and AppSource - Build 2018**

For more information about these marketplaces, see [Azure Marketplace and AppSource publishing guide](../marketplace-publishers-guide.md).


## Azure Marketplace and AppSource offer types

The following table lists the current offer types supported by the [Cloud Partner Portal](https://cloudpartner.azure.com).  For each offer type, it lists the marketplace(s) where the offer can be listed, as well as a general description of the offer solution technology.

|                Offer Type                |  Marketplace  |   Description                                                           |
|                ----------                |  -----------  |   -----------                                                           |
| [Azure application](./azure-applications/cpp-azure-app-offer.md) | Azure | Solution is composed of one or more virtual machines (VMs), optional custom Azure code, deployed through an Azure Resource Manger template.  Deployment can be either by the customer through a solution template or managed by the publisher. This type is used to provide more flexibility than provided virtual machine offer type.  |
| [Consulting service](./consulting-services/cloud-partner-portal-consulting-services-publishing-offer.md) | both | Microsoft-qualified consultants can list their domain-specific services on either Azure Marketplace or AppSource.  Their expertise assists customers assessing their problems and creating and deploying  the right solutions to meet their business objectives.  |
| [Container](./containers/cpp-containers-offer.md)  | Azure | Solution is a Docker container image provisioned as either a Kubernetes-based service or Azure Container instances. |
| [Dynamics 365 Business Central](../cloud-partner-portal-orig/cpp-business-central-offer.md) | AppSource | A package that extends this enterprise resource planning (ERP) and business management system. |
| [Dynamics 365 for Customer Engagement](./dyn365ce/cpp-customer-engagement-offer.md) | AppSource | A package that extends this customer resource management (CRM) system, through its sales, service, project service, and field service modules.  |
| [Dynamics 365 for Finance and Operations](../cloud-partner-portal-orig/cpp-dynamics-365-operations-offer.md) | AppSource | A package that extends this enterprise resource planning (ERP) service that supports advanced finance, operations, manufacturing, and supply chain management. |
| [IoT Edge module](./iot-edge-module/cpp-offer-process-parts.md) | Azure | A Docker-compatible container that runs on an IoT Edge device.  It contains of    Small computational modules that use a combination of custom code, other Azure services, and 3rd-party services. |
| [SaaS app](./saas-app/cpp-saas-offer.md) | Azure | Solution is a software-as-a-service subscription, managed by the publisher, which users log on through a customized interface that leverages Azure Active Directory. |
| [Virtual machine](./virtual-machine/cpp-virtual-machine-offer.md)  | Azure  | Solution is contained within a single virtual machine deployed to the customer's subscription.  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |   |   |

For more information, see [Publishing guide by offer type](../publisher-guide-by-offer-type.md).


## Next steps

You will learn about the general operations you can perform on marketplace offers and their common technical attributes and assets in the topic [Manage offers](./manage-offers/cpp-manage-offers.md).
