---
title: Teams license requirements to use Azure Communication Services support for Teams users
description: This article describes Teams License requirements and how users can find their current Teams license.
author: aigerimb
manager: anitharaju
services: azure-communication-services
ms.author: aigerimb
ms.date: 06/16/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.custom: kr2b-contr-experiment
---

# Teams License requirements to use Azure Communication Services support for Teams users

To use Azure Communication Services support for Teams users, you need an Azure Active Directory instance with users that have a valid Teams license. Furthermore, license must be assigned to the administrators or relevant users. Also, note that [MSA accounts (personal Microsoft accounts)](../../active-directory/external-identities/microsoft-account.md) are not supported. This article describes the service plans requirements to use Azure Communication Services support for Teams users.

## Eligible products and service plans

Ensure that your Azure Active Directory users have at least one of the following eligible service plans or products:

| Service Plan (friendly names)   |  Service Plan ID  | Product names|
|:--- |:--- | :--- |
| TEAMS1 | 57ff2da0-773e-42df-b2af-ffb7a2317929 | COMMON AREA PHONE |
|   |   | Dynamics 365 Remote Assist |
|   |   | Dynamics 365 Remote Assist HoloLens |
|   |   | Microsoft 365 A3 for Faculty |
|   |   | MICROSOFT 365 A3 FOR STUDENTS |
|   |   | Microsoft 365 A3 for students use benefit |
|   |   | Microsoft 365 A3 - Unattended License for students use benefit |
|   |   | Microsoft 365 A5 for Faculty |
|   |   | MICROSOFT 365 A5 FOR STUDENTS |
|   |   | Microsoft 365 A5 for students use benefit |
|   |   | Microsoft 365 A5 without Audio Conferencing for students use benefit |
|   |   | MICROSOFT 365 BUSINESS BASIC |
|   |   | MICROSOFT 365 BUSINESS BASIC |
|   |   | MICROSOFT 365 BUSINESS STANDARD |
|   |   | MICROSOFT 365 BUSINESS STANDARD - PREPAID LEGACY |
|   |   | MICROSOFT 365 BUSINESS PREMIUM |
|   |   | MICROSOFT 365 E3 |
|   |   | Microsoft 365 E3 - Unattended License |
|   |   | Microsoft 365 E5 |
|   |   | Microsoft 365 E5 Developer (without Windows and Audio Conferencing) |
|   |   | Microsoft 365 E5 without Audio Conferencing  |
|   |   | Microsoft 365 F1 |
|   |   | Microsoft 365 F3 |
|   |   | Microsoft 365 F1 |
|   |   | MICROSOFT TEAMS EXPLORATORY |
|   |   | Microsoft Teams Rooms Standard |
|   |   | Microsoft Teams Rooms Standard without Audio Conferencing |
|   |   | Microsoft Teams Trial |
|   |   | Office 365 A1 for faculty |
|   |   | Office 365 A1 Plus for faculty |
|   |   | Office 365 A1 for students  |
|   |   | Office 365 A1 Plus for students |
|   |   | Office 365 A3 for faculty |
|   |   | Office 365 A3 for students |
|   |   | Office 365 A5 for faculty |
|   |   | Office 365 A5 for students |
|   |   | Microsoft Teams Commercial Cloud |
|   |   | Office 365 E1 |
|   |   | OFFICE 365 E2 |
|   |   | Office 365 E3 |
|   |   | OFFICE 365 E3 DEVELOPER |
|   |   | OFFICE 365 E4 |
|   |   | Office 365 E5 |
|   |   | OFFICE 365 E5 WITHOUT AUDIO CONFERENCING |
|   |   | OFFICE 365 F3 |
|   |   | Teams Rooms Premium |
| TEAMS_FREE | 4fa4026d-ce74-4962-a151-8e96d57ea8e4 | MICROSOFT TEAMS (FREE) |
| TEAMS_GOV | 304767db-7d23-49e8-a945-4a7eb65f9f28 | Common Area Phone for GCC |
|   |   | Microsoft 365 F3 GCC |
|   |   | Microsoft 365 GCC G5 |
|   |   | MICROSOFT 365 G3 GCC |
|   |   | Office 365 G1 GCC |
|   |   | OFFICE 365 G3 GCC |
|   |   | Office 365 G5 GCC |
| TEAMS_AR_GCCHIGH | 9953b155-8aef-4c56-92f3-72b0487fce41 | Microsoft 365 E3_USGOV_GCCHIGH |
|   |   | Office 365 E3_USGOV_GCCHIGH |
| TEAMS_AR_DOD | fd500458-c24c-478e-856c-a6067a8376cd | Office 365 E3_USGOV_DOD |
|   |   | Microsoft 365 E3_USGOV_DOD |

For more information, see [Azure AD Product names and service plan identifiers](../../active-directory/enterprise-users/licensing-service-plan-reference.md).

### How to find assigned service plans and products?

You can find your current service plans and licenses using [licenseDetails](/graph/api/resources/licensedetails) Microsoft Graph API that returns licenses assigned to a user. Or you can find product names in [the Azure portal](https://portal.azure.com/#blade/Microsoft_AAD_IAM/LicensesMenuBlade/Products) or the [Microsoft 365 admin center](https://admin.microsoft.com).

For more information on verification for eligibility, see [Verification of Teams license eligibility](../concepts/troubleshooting-info.md#verification-of-teams-license-eligibility-to-use-azure-communication-services-support-for-teams-users).

## Next steps

The following articles might be of interest to you:

- Try [quickstart for authentication of Teams users](./manage-teams-identity.md).
- Try [quickstart for calling to a Teams user](./voice-video-calling/get-started-with-voice-video-calling-custom-teams-client.md).
- Learn more about [Azure Communication Services support Teams identities](../concepts/teams-endpoint.md)
- Learn more about [Teams interoperability](../concepts/teams-interop.md)
