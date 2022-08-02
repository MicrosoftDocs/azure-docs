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

To use Azure Communication Services support for Teams users, you need an Azure Active Directory instance with users that have a valid Teams license. Furthermore, license must be assigned to the administrators or relevant users. This article describes the Teams license requirements to use Azure Communication Services support for Teams users.

### Eligible Teams licenses

Ensure that your Azure Active Directory users have at least one of the following eligible Teams licenses:

| Service Plan (friendly names)   |  Service Plan ID  |
|:--- |:--- |
| TEAMS1 | 57ff2da0-773e-42df-b2af-ffb7a2317929 |
| TEAMS_FREE | 4fa4026d-ce74-4962-a151-8e96d57ea8e4 |
| TEAMS_GOV | 304767db-7d23-49e8-a945-4a7eb65f9f28 |
| TEAMS_GCCHIGH | 495922d5-f138-498b-8967-4acdcdfb2a74 |
| TEAMS_AR_GCCHIGH | 9953b155-8aef-4c56-92f3-72b0487fce41 |
| TEAMS_DOD | ec0dd2de-a877-4059-a9b8-5838b5629b2a |
| TEAMS_AR_DOD | fd500458-c24c-478e-856c-a6067a8376cd |

For more information, see [Azure AD Product names and service plan identifiers](../../active-directory/enterprise-users/licensing-service-plan-reference.md).

### How to find current Teams license

You can find your current Teams license using [licenseDetails](/graph/api/resources/licensedetails) Microsoft Graph API that returns licenses assigned to a user.

For more information on verification for eligibility, see [Verification of Teams license eligibility](../concepts/troubleshooting-info.md#verification-of-teams-license-eligibility-to-use-azure-communication-services-support-for-teams-users).

## Next steps

The following articles might be of interest to you:

- Try [quickstart for authentication of Teams users](./manage-teams-identity.md).
- Try [quickstart for calling to a Teams user](./voice-video-calling/get-started-with-voice-video-calling-custom-teams-client.md).
- Learn more about [Azure Communication Services support Teams identities](../concepts/teams-endpoint.md)
- Learn more about [Teams interoperability](../concepts/teams-interop.md)