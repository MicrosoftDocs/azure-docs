---
title: Firewall configuration and custom Teams endpoints
titleSuffix: An Azure Communication Services concept document
description: Learn how firewall configuration requirements can enable custom Teams endpoints.
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

# Firewall configuration

Azure Communication Services permits you to build custom Teams calling experiences. You can use Communication Services calling *Software development kit* (SDK) to configure calling customization. With an Administrator account, configure your firewall according to guidance provided by Communication Services and Microsoft Teams. Communication Services requirements allow control plane, and Teams requirements allow calling experience. If you use an *independent software vendor* (ISV) for authentication, follow their configuration guidance and not Communication Services configuration.

The following articles may be of interest to you:

- Learn more about [Azure Communication Services firewall configuration](../voice-video-calling/network-requirements.md).
- Learn about [Microsoft Teams firewall configuration](/microsoft-365/enterprise/urls-and-ip-address-ranges?view=o365-worldwide&preserve-view=true#skype-for-business-online-and-microsoft-teams).