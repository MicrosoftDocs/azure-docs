---
title: License self-service password reset - Azure Active Directory
description: Learn about the difference Azure Active Directory self-service password reset licensing requirements

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 06/02/2020

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: rhicock

ms.collection: M365-identity-device-management
---
# Licensing requirements for Azure Active Directory self-service password reset

To reduce help desk calls and loss of productivity when a user can't sign in to their device or an application, user accounts in Azure Active Directory (Azure AD) can be enabled for self-service password reset (SSPR). Features that make up SSPR include password change, reset, unlock, and writeback to an on-premises directory. Basic SSPR features are available in Microsoft 365 Business Standard or higher and all Azure AD Premium SKUs at no cost.

This article details the different ways that self-service password reset can be licensed and used. For specific details about pricing and billing, see the [Azure AD pricing page](https://azure.microsoft.com/pricing/details/active-directory/).

## Compare editions and features

SSPR is licensed per user. To maintain compliance, organizations are required to assign the appropriate license to their users.

The following table outlines the different SSPR scenarios for password change, reset, or on-premises writeback, and which SKUs provide the feature.

| Feature | Azure AD Free | Microsoft 365 Business Standard | Microsoft 365 Business Premium | Azure AD Premium P1 or P2 |
| --- |:---:|:---:|:---:|:---:|
| **Cloud-only user password change**<br />When a user in Azure AD knows their password and wants to change it to something new. | ● | ● | ● | ● |
| **Cloud-only user password reset**<br />When a user in Azure AD has forgotten their password and needs to reset it. | | ● | ● | ● |
| **Hybrid user password change or reset with on-prem writeback**<br />When a user in Azure AD that's synchronized from an on-premises directory using Azure AD Connect wants to change or reset their password and also write the new password back to on-prem. | | | ● | ● |

> [!WARNING]
> Standalone Microsoft 365 Basic and Standard licensing plans don't support SSPR with on-premises writeback. The on-premises writeback feature requires Azure AD Premium P1, Premium P2, or Microsoft 365 Business Premium.

For additional licensing information, including costs, see the following pages:

* [Azure Active Directory pricing](https://azure.microsoft.com/pricing/details/active-directory/)
* [Azure Active Directory features and capabilities](https://www.microsoft.com/cloud-platform/azure-active-directory-features)
* [Enterprise Mobility + Security](https://www.microsoft.com/cloud-platform/enterprise-mobility-security)
* [Microsoft 365 Enterprise](https://www.microsoft.com/microsoft-365/enterprise)
* [Microsoft 365 Business](https://docs.microsoft.com/office365/servicedescriptions/microsoft-365-service-descriptions/microsoft-365-business-service-description)

## Enable group or user-based licensing

Azure AD supports group-based licensing. Administrators can assign licenses in bulk to a group of users, rather than assigning them one at a time. For more information, see [Assign, verify, and resolve problems with licenses](../users-groups-roles/licensing-groups-assign.md#step-1-assign-the-required-licenses).

Some Microsoft services aren't available in all locations. Before a license can be assigned to a user, the administrator must specify the **Usage location** property on the user. Assignment of licenses can be done under the **User** > **Profile** > **Settings** section in the Azure portal. *When you use group license assignment, any users without a usage location specified inherit the location of the directory.*

## Next steps

To get started with SSPR, complete the following tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Enable self-service password reset (SSPR)](tutorial-enable-sspr.md)
