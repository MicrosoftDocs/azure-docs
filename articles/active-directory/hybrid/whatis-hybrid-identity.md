---
title: What is hybrid identity with Microsoft Entra ID?
description: Hybrid identity is having a common user identity for authentication and authorization both on-premises and in the cloud. 
keywords: introduction to Azure AD Connect, Azure AD Connect overview, what is Azure AD Connect, install active directory
services: active-directory
author: billmath
manager: amycolannino
ms.assetid: 59bd209e-30d7-4a89-ae7a-e415969825ea
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 01/19/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---
# What is hybrid identity with Microsoft Entra ID?

Today, businesses, and corporations are becoming more and more a mixture of on-premises and cloud applications.  Users require access to those applications both on-premises and in the cloud. Managing users both on-premises and in the cloud poses challenging scenarios. 

Microsoft’s identity solutions span on-premises and cloud-based capabilities.  These solutions create a common user identity for authentication and authorization to all resources, regardless of location. We call this **hybrid identity**.

 :::image type="content" source="media/common-scenarios/scenario-1.png" alt-text="Diagram of new hybrid scenario." lightbox="media/common-scenarios/scenario-1.png":::

Hybrid identity is accomplished through provisioning and synchronization.  Provisioning is the process of creating an object based on certain conditions, keeping the object up to date and deleting the object when conditions are no longer met. Synchronization is responsible for making sure identity information for your on-premises users and groups is matching the cloud. 

For more information see [What is provisioning?](what-is-provisioning.md) and [What is inter-directory provisioning?](what-is-inter-directory-provisioning.md).


<a name='license-requirements-for-using-azure-ad-connect'></a>

## License requirements for using Microsoft Entra Connect

[!INCLUDE [active-directory-free-license.md](../../../includes/active-directory-free-license.md)]

## Next Steps 

- [What is Microsoft Entra Connect and Connect Health?](connect/whatis-azure-ad-connect.md) 
- [What is password hash synchronization (PHS)?](connect/whatis-phs.md) 
- [What is pass-through authentication (PTA)?](connect/how-to-connect-pta.md) 
- [What is federation?](connect/whatis-fed.md) 
- [What is single-sign on?](connect/how-to-connect-sso.md)
