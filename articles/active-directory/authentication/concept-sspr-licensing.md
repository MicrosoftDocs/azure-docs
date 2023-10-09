---
title: License self-service password reset
description: Learn about the difference Microsoft Entra self-service password reset licensing requirements

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 01/29/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: tilarso

ms.collection: M365-identity-device-management
---
# Licensing requirements for Microsoft Entra self-service password reset

To reduce help desk calls and loss of productivity when a user can't sign in to their device or an application, user accounts in Microsoft Entra ID can be enabled for self-service password reset (SSPR). Features that make up SSPR include password change, reset, unlock, and writeback to an on-premises directory. Basic SSPR features are available in Microsoft 365 Business Standard or higher and all Microsoft Entra ID P1 or P2 SKUs at no cost.

This article details the different ways that self-service password reset can be licensed and used. For specific details about pricing and billing, see the [Microsoft Entra pricing page](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).

Although some unlicensed users may technically be able to access SSPR, a license is required for any user that you intend to benefit from the service.

> [!NOTE] 
> Some tenant services are not currently capable of limiting benefits to specific users. Efforts should be taken to limit the service benefits to licensed users. This will help avoid potential service disruption to your organization once targeting capabilities are available.

## Compare editions and features

The following table outlines the different SSPR scenarios for password change, reset, or on-premises writeback, and which SKUs provide the feature.

| Feature | Microsoft Entra ID Free | Microsoft 365 Business Standard | Microsoft 365 Business Premium | Microsoft Entra ID P1 or P2 |
| --- |:---:|:---:|:---:|:---:|
| **Cloud-only user password change**<br />When a user in Microsoft Entra ID knows their password and wants to change it to something new. | ● | ● | ● | ● |
| **Cloud-only user password reset**<br />When a user in Microsoft Entra ID has forgotten their password and needs to reset it. | | ● | ● | ● |
| **Hybrid user password change or reset with on-prem writeback**<br />When a user in Microsoft Entra that's synchronized from an on-premises directory using Microsoft Entra Connect wants to change or reset their password and also write the new password back to on-prem. | | | ● | ● |

> [!WARNING]
> Standalone Microsoft 365 Basic and Standard licensing plans don't support SSPR with on-premises writeback. The on-premises writeback feature requires Microsoft Entra ID P1, Premium P2, or Microsoft 365 Business Premium. 

For additional licensing information, including costs, see the following pages:


* [Microsoft 365 licensing guidance for security & compliance](/office365/servicedescriptions/microsoft-365-service-descriptions/microsoft-365-tenantlevel-services-licensing-guidance/microsoft-365-security-compliance-licensing-guidance)
* [Microsoft Entra pricing](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing)
* [Microsoft Entra features and capabilities](https://www.microsoft.com/cloud-platform/azure-active-directory-features)
* [Enterprise Mobility + Security](https://www.microsoft.com/cloud-platform/enterprise-mobility-security)
* [Microsoft 365 Enterprise](https://www.microsoft.com/microsoft-365/enterprise)
* [Microsoft 365 Business](/office365/servicedescriptions/office-365-service-descriptions-technet-library)

## Next steps

To get started with SSPR, complete the following tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Enable self-service password reset (SSPR)](tutorial-enable-sspr.md)
