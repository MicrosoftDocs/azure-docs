---
title: Firewall configuration and Teams customization
description: Learn the firewall configuration requirements of calling applications for Teams users.
author: tomaschladek
manager: nmurav
services: azure-communication-services

ms.author: tchladek
ms.date: 06/06/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.custom: kr2b-contr-experiment
---

# Firewall configuration of calling applications for Teams users

Azure Communication Services allows you to build custom Teams calling experiences.

You can use the Calling *Software development kit* (SDK) to customize experiences. Use your Administrator account to configure your firewall based on Communication Services and Microsoft Teams guidelines. Communication Services requirements are for the control plane, and Teams requirements are for Calling. If you'll use telephony, follow Communication Services and Teams' requirements.

If you use an *independent software vendor* (ISV) for authentication, use instructions from that vendor and not from Communication Services.

The following articles may be of interest to you:

- Learn more about [Azure Communication Services firewall configuration](../voice-video-calling/network-requirements.md).
- Learn about [Microsoft Teams firewall configuration](/microsoft-365/enterprise/urls-and-ip-address-ranges?view=o365-worldwide&preserve-view=true#skype-for-business-online-and-microsoft-teams).
- Learn about [Direct routing configuration](../telephony/direct-routing-infrastructure.md)
