---
title: Microsoft Teams shared line appearance
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of Teams shared line appearance and delegate calling for Teams users in Azure Communication Services Calling SDK.
author: jamescadd
manager: chpalmer
services: azure-communication-services

ms.author: jacadd
ms.date: 2/6/2025
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.custom:
  - build-2025
---
# Microsoft Teams shared line appearance

Microsoft Teams shared line appearance lets a user choose a delegate to answer or handle calls on their behalf. This feature is helpful if a user has an administrative assistant who regularly handles the user's calls. In the context of Teams shared line appearance, a manager is someone who authorizes a delegate to make or receive calls on their behalf. A delegate can make or receive calls on behalf of the delegator.

## Prerequisites

- An Azure account with an active subscription. See [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. See [Create a Communication Services resource](../../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../../quickstarts/identity/access-tokens.md).
- Licensing requirements for delegator and delegates. See [Teams Phone license](/microsoftteams/shared-line-appearance#license-required).
- Enable delegation and shared line appearance. See [Enable delegation](/microsoftteams/shared-line-appearance#enable-delegation-and-shared-line-appearance)
- Assign delegates using [Microsoft Teams Client](https://support.microsoft.com/office/share-a-phone-line-with-a-delegate-in-microsoft-teams-16307929-a51f-43fc-8323-3b1bf115e5a8) or [Teams PowerShell](/microsoftteams/shared-line-appearance#use-powershell).
- Optional: Complete the quickstart to add voice calling to Microsoft Teams user. See [Quickstart: Add voice calling to Microsoft Teams user](../../../quickstarts/voice-video-calling/get-started-call-to-teams-user.md).

## Use Cases

**Business Enterprises**: Team leads can delegate their call responsibilities during meetings or vacations to their assistants or colleagues, ensuring uninterrupted communication with stakeholders.

**Contact Centers:** Supervisors can allocate their call flows to other available agents during breaks, making certain that no client query goes unanswered.

**Healthcare:** Doctors or nurses can delegate their call flows to peers or assistants during surgeries or when attending critical cases, ensuring patient queries are addressed promptly.

## Platform capabilities
The following Azure Communication Services and Graph platforms currently support shared line appearance:

| Capability                                                 | Calling SDK JS | Graph SDK |
|------------------------------------------------------------|----------------|-----------|
| Set up delegation (add/remove/update delegate permissions) | ❌             | ❌       |
| Receive calls on behalf of another                         | ✔️            | ❌        |
| Call a phone number on behalf of another                   | ✔️            | ❌        |
| Call a Teams user on behalf of another                     | ✔️            | ❌        |
| Receive an ACS user call on behalf of another Teams user   | ✔️            | ❌        |
| Get the delegate view of shared lines                      | ❌             | ✔️       |
| Get the delegate view of manager’s call activities         | ❌             | ❌       |
| Get the manager view of delegates                          | ❌             | ✔️       |
| Get shared call history                                    | ❌            | ❌        |
| Delegate or manager can hold or resume                     | ✔️            | ❌        |

> [!NOTE] 
> Calling SDK for iOS, Android, and Windows do not currently support shared line appearance.

For more information on the capabilities available during a shared line appearance call, see [Calling capabilities for Teams users](../teams-user-calling.md).

## Next steps

- [Get started with Teams Shared Line Appearance in Azure Communication Services](../../../how-tos/cte-calling-sdk/shared-line-appearance.md)