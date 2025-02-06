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
---
# Microsoft Teams shared line appearance

[!INCLUDE [Public Preview Notice](../../../../includes/public-preview-include.md)]
Microsoft Teams shared line appearance lets a user choose a delegate to answer or handle calls on their behalf. This feature is helpful if a user has an administrative assistant who regularly handles the user's calls. In the context of Teams shared line appearance, a manager is someone who authorizes a delegate to make or receive calls on their behalf. A delegate can make or receive calls on behalf of the delegator.
## Use Cases

**Business Enterprises**: Team leads can delegate their call responsibilities during meetings or vacations to their assistants or colleagues, ensuring uninterrupted communication with stakeholders.

**Contact Centers:** Supervisors can allocate their call flows to other available agents during breaks, making certain that no client query goes unanswered.

**Healthcare:** Doctors or nurses can delegate their call flows to peers or assistants during surgeries or when attending critical cases, ensuring patient queries are addressed promptly.

## Platform capabilities
The following Azure Communication Services and Graph platforms currently support shared line appearance:
| Capability                                                 | Calling SDK JS | Graph SDK |
|------------------------------------------------------------|----------------|-----------|
| Set up delegation (add/remove/update delegate permissions) | ❌             | ✔️       |
| Receive calls on behalf of another                         | ✔️            | ❌        |
| Call a phone number on behalf of another                   | ✔️            | ❌        |
| Call a Teams user on behalf of another                     | ✔️            | ❌        |
| Receive an ACS user call on behalf of another Teams user   | ✔️            | ❌        |
| Get the delegate view of shared lines                      | ❌             | ✔️       |
| Get the delegate view of manager’s call activities         | ❌             | ❌       |
| Get the manager view of delegates                          | ❌             | ✔️       |
| Delegate or manager can hold or resume                     | ✔️            | ❌        |

>Note: Calling SDK for iOS, Android, and Windows do not currently support shared line appearance.

For more information on the capabilities available during a shared line appearance call, see [Calling capabilities for Teams users](https://learn.microsoft.com/en-us/azure/communication-services/concepts/interop/teams-user-calling).

## Next steps

> [!div class="nextstepaction"]
> For more information, see the following articles:
- Get started developing shared line appearance with the [how to](articles/communication-services/how-tos/calling-sdk/shared-line-appearance.md).