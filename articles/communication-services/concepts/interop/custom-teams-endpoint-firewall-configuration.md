---
title: Firewall configuration and Teams customization
description: Learn the firewall configuration requirements that enable customized Teams calling experiences.
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

# Firewall configuration for customized Teams calling experiences

Azure Communication Services allow you to build custom Teams calling experiences.

You can use the Calling *Software development kit* (SDK) to customize experiences. With an Administrator account, configure your firewall according to guidance provided by Communication Services and Microsoft Teams. Use Communication Services requirements for control plane and Teams requirements for Calling.

If you use an *independent software vendor* (ISV) for authentication, follow configuration guidance from that vendor, not from Communication Services.

The following articles may be of interest to you:

- Learn more about [Azure Communication Services firewall configuration](../voice-video-calling/network-requirements.md).
- Learn about [Microsoft Teams firewall configuration](/microsoft-365/enterprise/urls-and-ip-address-ranges?view=o365-worldwide&preserve-view=true#skype-for-business-online-and-microsoft-teams).