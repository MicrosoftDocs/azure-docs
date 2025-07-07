---
title: Display name changed
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDK to subscript events that participants' display name change
author: fuyan
ms.author: fuyan
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 05/06/2025
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android-windows

#Customer intent: As a developer, I want to learn how to send and receive Media access state using SDK.
---

# Display name changed

This article describes how you can subscribe the Teams participants' display name changed events showing the old, new values, and the reason of the name change.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the article [Add voice calling to your app](../../quickstarts/voice-video-calling/getting-started-with-calling.md).

## Support

The following tables define support for display name change during Teams interop call/meeting in Azure Communication Services.

### Identities and call types

The following table shows display name change support for specific call types and identities. 

|Identities                   | Teams meeting | Room | 1:1 call | Group call | 1:1 Teams interop call | Group Teams interop call |
|-----------------------------|---------------|------|----------|------------|------------------------|--------------------------|
|Communication Services user  | ✔️	          |      |          |     	     |	                      |	                       |
|Microsoft 365 user	          | ✔️	          |      |          |  	         |                        |                        |

### Operations

The following table shows support for individual APIs in the Calling SDK related to individual identity types. The media access feature only supports these operations in Teams meetings.

|Operations                     | Communication Services user | Microsoft 365 user | 
|-----------------------------|---------------|--------------------------|
| Check if Teams participant has display name changed                  | ✔️       | ✔️                       |
| Get notification that Teams participant display name changed    | ✔️           |    ✔️                      |


### SDK

The following tables show support for the display name change in individual Azure Communication Services SDK.

| Support status | Web | Web UI | iOS | iOS UI | Android | Android UI | Windows |
|----------------|-----|--------|--------|--------|----------|--------|---------|
| Is Supported   | ✔️  |        |        |        |          |        |         |		


[!INCLUDE [Display name changed Client-side JavaScript](./includes/displayname-changed/displayname-changed-web.md)]


## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)

## Related articles

To do, add Teams client doc here.
