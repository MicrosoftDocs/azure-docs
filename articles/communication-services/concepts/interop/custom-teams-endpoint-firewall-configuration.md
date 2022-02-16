---
title: Firewall configuration
titleSuffix: An Azure Communication Services concept document
description: This article describes firewall configuration requirements to enable a custom Teams endpoint.
author: tomaschladek
manager: nmurav
services: azure-communication-services

ms.author: tchladek
ms.date: 06/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Firewall configuration

Azure Communication Services provides the ability to leverage Communication Services calling Software development kit (SDK) to build custom Teams calling experience. To enable this experience, Administrators need to configure the firewall according to Communication Services and Microsoft Teams guidance. Communication Services requirements allow control plane, and Teams requirements allow calling experience. If an independent software vendor (ISV) provides the authentication experience, then instead of Communication Services configuration, use configuration guidance of the vendor. 

The following articles might be of interest to you:

- Learn more about [Azure Communication Services firewall configuration](../voice-video-calling/network-requirements.md).
- Learn about [Microsoft Teams firewall configuration](/microsoft-365/enterprise/urls-and-ip-address-ranges?view=o365-worldwide#skype-for-business-online-and-microsoft-teams).