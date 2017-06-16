---
title: Azure Active Directory conditional access device policies for Office 365 services | Microsoft Docs
description: Learn about how to provision conditional access device policies to help make corporate resources more secure, while maintaining user compliance and access to services.
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
# Active Directory conditional access device policies for Office 365 services

Conditional access requires multiple pieces to work. It involves a multi-factor authenticated user, an authenticated device, and a compliant device, among other factors. In this article, we primarily focus on device-based conditions that your organization can use to help you control access to Office 365 services. 

Corporate users want to access Office 365 services like Exchange and SharePoint Online at work or school from their personal devices. You want the access to be secure. You can provision conditional access device policies to help make corporate resources more secure, while granting access to services for users who are using compliant devices. You can set conditional access policies to Office 365 in the Microsoft Intune conditional access portal.

Azure Active Directory (Azure AD) enforces conditional access policies to help secure access to Office 365 services. You can create a conditional access policy that blocks a user who is using a noncompliant device from accessing an Office 365 service. The user must conform to the company’s device policies before access to the service is granted. Alternately, you can create a policy that requires users to enroll their devices to gain access to an Office 365 service. Policies can be applied to all users in an organization, or limited to a few target groups. You can add more target groups to a policy over time.

A prerequisite for enforcing device policies is that users must register their devices with the Azure AD device registration service. You can opt to turn on multi-factor authentication for devices that register with the Azure AD device registration service. Multi-factor authentication is recommended for the Azure Active Directory device registration service. When multi-factor authentication is turned on, users who register their devices with the Azure AD device registration service are challenged for second-factor authentication.

## How does a conditional access policy work?

When a user requests access to an Office 365 service from a supported device platform, Azure AD authenticates the user and the device. Azure AD grants access to the service only if the user conforms to the policy set for the service. Users on devices that are not enrolled are given instructions on how to enroll and become compliant to access corporate Office 365 services. Users on iOS and Android devices are required to enroll their devices by using the Intune Company Portal application. When a user enrolls a device, the device is registered with Azure AD and it's enrolled for device management and compliance. You must use the Azure AD device registration service with Microsoft Intune for mobile device management for Office 365 services. Device enrollment is required for users to access Office 365 services when device policies are enforced.

When a user successfully enrolls a device, the device becomes trusted. Azure AD gives the authenticated user single sign-on access to company applications. Azure AD enforces a conditional access policy to grant access to a service not only the first time the user requests access, but every time the user renews a request for access. The user is denied access to services when sign-in credentials are changed, the device is lost or stolen, or the conditions of the policy are not met at the time of request for renewal.

## Deployment considerations

You must use the Azure AD device registration service to register devices.

When on-premises users are about to be authenticated, Active Directory Federation Services (AD FS) (version 1.0 and later versions) is required. Multi-factor authentication for Workplace Join fails when the identity provider is not capable of multi-factor authentication. For example, you can't use multi-factor authentication with AD FS 2.0. Ensure that the on-premises AD FS works with multi-factor authentication, and that a valid multi-factor authentication method is in place before you turn on multi-factor authentication for the Azure AD device registration service. For example, AD FS on Windows Server 2012 R2 has multi-factor authentication capabilities. You also must set an additional valid authentication (multi-factor authentication) method on the AD FS server before you turn on multi-factor authentication for the Azure AD device registration service. For more information about supported multi-factor authentication methods in AD FS, see [Configure additional authentication methods for AD FS](/windows-server/identity/ad-fs/operations/configure-additional-authentication-methods-for-ad-fs).

## Next steps

*   For answers to common questions, see [Azure Active Directory conditional access FAQs](active-directory-conditional-faqs.md).
