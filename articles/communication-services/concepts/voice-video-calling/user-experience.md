---
title: Build excellent user experience with Azure Communication Services
description: Build excellent user experience with Azure Communication Services
author: tchladek
manager: chpalm
services: azure-communication-services

ms.author: tchladek
ms.date: 07/13/2023
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# User experience
Developers strive to bring the best user experience to their users. Azure Communication Services is integrating the best practices into the UI library, but if you are building your user interface, here are some tools to help you achieve the best user experience.


## Hide buttons that are not enabled
Developers building their audio and video experience with Azure Communication Services calling SDK are facing issues that some actions available in the calling SDK are unavailable for a given call type, role, meeting, or tenant. This issue leads to undesired situations when users see a button to, for example, share screen. Still, this action fails because the user cannot share the screen. Capability API is the tool that helps you render just the actions that apply to the user in the current context. You can learn more about [Capability APIs here](../../how-tos/calling-sdk/capabilities.md).

## Next steps
- Learn more about [Capability APIs](../../how-tos/calling-sdk/capabilities.md).
