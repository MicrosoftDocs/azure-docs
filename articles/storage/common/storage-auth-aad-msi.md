---
title: Authenticate with Azure AD from an Azure VM Managed Service Identity (Preview) (Preview) | Microsoft Docs
description: Authenticate with Azure AD from an Azure VM Managed Service Identity (Preview) (Preview).  
services: storage
author: tamram
manager: jeconnoc

ms.service: storage
ms.topic: article
ms.date: 05/18/2018
ms.author: tamram
---

# Authenticate with Azure AD from an Azure VM Managed Service Identity (Preview)

Azure Storage supports Azure Active Directory (Azure AD) authentication with a [Managed Service Identity](../../active-directory/managed-service-identity/overview.md). A Managed Service Identity (MSI) is an automatically managed identity in Azure Active Directory (Azure AD). You can use an MSI to authenticate to Azure Storage from applications running in Azure virtual machines, function apps, virtual machine scale sets, and others. By using an MSI and leveraging the power of Azure AD authentication, you can avoid storing credentials with your applications that run in the cloud.  

To grant permissions to an MSI for storage resources, you assign an RBAC role encompassing storage permissions to the MSI. For more information about RBAC roles in storage, see [Manage access rights to storage data with RBAC (Preview)](storage-auth-aad-rbac.md). 

> [!IMPORTANT]
> Azure AD integration with Azure Storage is in preview, and is intended for non-production use only. Production service-level agreements (SLAs) will not be available until Azure AD integration for Azure Storage is declared generally available. If Azure AD integration is not yet supported for your scenario, continue to use Shared Key authorization or SAS tokens in your applications. 

