---
title: What is device identity in Azure Active Directory?
description: Device identities and their use cases

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: overview
ms.date: 06/07/2021

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sandeo

ms.collection: M365-identity-device-management
---
# What is a device identity?

A device identity is an object in Azure Active Directory (Azure AD). That object gives an organization information they can use when making access or configuration decisions.

There are three ways to get a device identity:

- Azure AD registration
- Azure AD join
- Hybrid Azure AD join

## Modern device scenario

The modern device scenario focuses on two of these methods: 

- Azure AD registration 
   - Bring your own device (BYOD)
   - Mobile device (cell phone and tablet)
- Azure AD join
   - Windows 10 devices owned by an organization
   - Windows Server 2019 and newer servers in an organization

Hybrid Azure AD join is seen as an interim step on the road to Azure AD join. Hybrid Azure AD join provides organizations support for downlevel Windows versions back to Windows 7 and Server 2008. All three scenarios can coexist in a single organization.

Device identities are a prerequisite for other scenarios like device-based Conditional Access policies and Mobile Device Management with Microsoft Endpoint Manager.

## Resource access

Registering and joining devices to Azure AD gives users Seamless Sign-on (SSO) to cloud-based resources.

Devices that are Azure AD joined or hybrid Azure AD joined benefit from SSO to your organization's on-premises resources and cloud resources.

## Provisioning

Getting devices in to Azure AD can be done in a self-service manner or a controlled process managed by administrators.

## License requirements

[!INCLUDE [Active Directory P1 license](../../../includes/active-directory-p1-license.md)]

## Next steps

- Learn more about [Azure AD registered devices](concept-azure-ad-register.md)
- Learn more about [Azure AD joined devices](concept-azure-ad-join.md)
- Learn more about [hybrid Azure AD joined devices](concept-azure-ad-join-hybrid.md)
- To get an overview of how to manage device identities in the Azure portal, see [Managing device identities using the Azure portal](device-management-azure-portal.md).
- To learn more about device-based Conditional Access, see [Configure Azure Active Directory device-based Conditional Access policies](../conditional-access/require-managed-devices.md).
