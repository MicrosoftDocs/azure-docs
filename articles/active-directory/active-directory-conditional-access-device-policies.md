---
title: Conditional access device policies for Office 365 services | Microsoft Docs
description: Details on how device-based conditions control access to Office 365 services. While Information Workers (IWs) want to access Office 365 services like Exchange and SharePoint Online at work or school from their personal devices, their IT admin wants the access to be secure.IT admins can provision conditional access device policies to secure corporate resources, while at the same time allowing IWs on compliant devices to access the services.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila
editor: ''

ms.assetid: 8664c0bb-bba1-4012-b321-e9c8363080a0
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/18/2017
ms.author: markvi

---
# Conditional access device policies for Office 365 services

The term, “conditional access” has many conditions associated with it such as multi-factor authenticated user, authenticated device, compliant device etc. This topic primarily focusses on device-based conditions to control access to Office 365 services. While Information Workers (IWs) want to access Office 365 services like Exchange and SharePoint Online at work or school from their personal devices, their IT admin wants the access to be secure. IT admins can provision conditional access device policies to secure corporate resources, while at the same time allowing IWs on compliant devices to access the services. Conditional access policies to Office 365 may be configured from Microsoft Intune conditional access portal.

Azure Active Directory enforces conditional access policies to secure access to Office 365 services. An administrator can create a conditional access policy that blocks a user on a non-compliant device from accessing an O365 service. The user must conform to company’s device policies before access can be granted to the service. Alternately, the admin can also create a policy that requires users to just enroll their devices to gain access to an O365 service. Policies may be applied to all users of an organization, or limited to a few target groups and enhanced over time to include additional target groups.

A prerequisite for enforcing device policies is for users to register their devices with Azure Active Directory Device Registration service. You can opt to enable Multi-factor authentication (MFA) for registering devices with Azure Active Directory Device Registration service. MFA is recommended for Azure Active Directory Device Registration service. When MFA is enabled, users registering their devices with Azure Active Directory Device Registration service are challenged for second factor authentication.

## How does conditional access policy work?
When a user requests access to O365 service from a supported device platform, Azure Active Directory authenticates the user and device from which the user launches the request; and grants access to the service only when the user conforms to the policy set for the service. Users that do not have their device enrolled are given remedial instructions on how to enroll and become compliant to access corporate O365 services. Users on iOS and Android devices will be required to enroll their devices using Company Portal application. When a user enrolls his/her device, the device is registered with Azure Active Directory, and enrolled for device management and compliance. Customers must use the Azure Active Directory Device Registration service in conjunction with Microsoft Intune to enable mobile device management for Office 365 service. Device enrollment is a pre-requisite for users to access Office 365 services when device policies are enforced.

When a user enrolls his/her device successfully, the device becomes trusted. Azure Active Directory provides Single-Sign-On to access company applications and enforces conditional access policy to grant access to a service not only the first time the user requests access, but every time the user requests to renew access. The user will be denied access to services when sign-in credentials are changed, device is lost/stolen, or the policy is not met at the time of request for renewal.

## Deployment considerations:

You must use Azure Active Directory device registration service to register devices.

When users are about to be authenticated on premises, Active Directory Federation Services (AD FS) (1.0 and above) is required. Multi-factor authentication (MFA) for Workplace Join fails when the identity provider is not capable of MFA. For example, AD FS 2.0 is not MFA capable. Your administrator must ensure that the on-premises AD FS is MFA capable and a valid MFA method is enabled, before enabling MFA on the Azure Active Directory device registration service. For example, AD FS on Windows Server 2012 R2 has MFA capabilities. You must also enable an additional valid authentication (MFA) method on the AD FS server before enabling MFA on the Azure Active Directory device registration service. For more information on supported MFA methods in AD FS, see Configure Additional Authentication Methods for AD FS.

## Next steps

See the [Azure Active Directory Conditional Access FAQ](active-directory-conditional-faqs.md) for more answers to common questions.
