---
title: What's new in Azure Stack | Microsoft Docs
description: What's new in Azure Stack
services: azure-stack
documentationcenter: ''
author: HeathL17
manager: byronr
editor: ''

ms.assetid: 872b0651-0a92-4d28-b2e6-07d0a4a9a25a
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 4/13/2017
ms.author: helaw

---
# What's new in Azure Stack
This release provides new features for both tenants and administrators.

## Content, services, and tools
* [Active Directory Federation Services (AD FS)](azure-stack-key-features.md#identity) support provides identity options for scenarios where network connectivity is limited or intermittent.
* You can use Azure Virtual Machine Scale Sets to provide managed scale-out and scale-in of IaaS VM-based workloads. 
* Use Azure D-Series VM sizes for increased performance and consistency.
* Deploy and create templates with Temp Disks that are consistent with Azure.
* [Marketplace Syndication](azure-stack-download-azure-marketplace-item.md) allows you to use content from the Azure Marketplace and make available in Azure Stack.

## Infrastructure and operations
* Isolated administrator and user [portals](azure-stack-manage-portals.md) and APIs provide enhanced security.
* Use enhanced infrastructure management functionality, such as improved alerting.
* Using the [Windows Azure Pack Connector](azure-stack-manage-windows-azure-pack.md), you can view and manage IaaS virtual machines that are hosted on Windows Azure Pack. For this preview release, try this scenario only in test environments (both Windows Azure Pack and Azure Stack). Additional configuration is required.
* Azure Stack now supports [multi-tenancy](azure-stack-enable-multitenancy.md) for scenarios where you need to provide IaaS and PaaS services to users outside of your Azure Active Directory domain.  For example, you may want to provide Azure Stack services to a partner company using their identities. You can configure Azure Stack to trust the other organization's identities, and enable users from that organization to sign up for subscriptions and consume services.  

## Next steps
* [Understand Azure Stack POC architecture](azure-stack-architecture.md)      
* [Understand deployment prerequisites](azure-stack-deploy.md)
* [Deploy Azure Stack](azure-stack-run-powershell-script.md)

