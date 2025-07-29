---
title: Build excellent user experience with Azure Communication Services
description: Build excellent user experience with Azure Communication Services
author: tchladek
manager: chpalm
services: azure-communication-services

ms.author: tchladek
ms.date: 06/28/2025
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# User experience

Developers strive to bring the best user experience to their users. Azure Communication Services is integrating the best practices into the UI library, but if you're building your user interface, here are some tools to help you achieve the best user experience.

## Hide buttons that aren't enabled

Developers building their audio and video experience with Azure Communication Services calling SDK are facing issues that some actions available in the calling SDK are unavailable for a given call type, role, meeting, or tenant. This issue leads to undesired situations when users see a button to, for example, share screen. Still, this action fails because the user can't share the screen.

The Capability API helps you render just the actions that apply to the user in the current context. For more information, see [Capability APIs](../../how-tos/calling-sdk/capabilities.md).

## Next steps

- [Capability APIs](../../how-tos/calling-sdk/capabilities.md).
- [Troubleshooting VoIP call quality](./troubleshoot-web-voip-quality.md).
