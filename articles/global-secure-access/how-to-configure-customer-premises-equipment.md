---
title: How to configure customer premises equipment for Global Secure Access (preview)
description: Learn how to configure customer premises equipment for Global Secure Access (preview).
author: shlipsey3
ms.author: sarahlipsey
manager: amycolannino
ms.topic: how-to
ms.date: 06/08/2023
ms.service: network-access
ms.custom: 

---
# Configure customer premises equipment for Global Secure Access (preview)

IPSec tunnel is a bidirectional communication. One side of the communication is established when [adding a device link to a remote network](how-to-manage-remote-network-device-links.md). During that process you enter your public IP address and BGP addresses. This article provides the steps to set up the other side of the communication channel.

## Prerequisites

To configure your customer premises equipment (CPE), you must have:

- A **Global Secure Access Administrator** role in Microsoft Entra ID.
- Sent an email to Global Secure Access onboarding according to the onboarding process in the **Remote network** area of Global Secure Access.
- Received the connectivity information from Global Secure Access onboarding.

## How to configure your customer premises equipment

To onboard to Global Secure Access remote network connectivity, you must have completed the onboarding process. In order to configure your CPE, you need the connectivity information provided by the Global Secure Access onboarding team.

Once you have the details you need, go to the preferred interface of your CPE (UX or API), and enter the information you received to set up the IPSec tunnel.

> [!IMPORTANT]
>The crypto profile you specified for the device link should match with what you specify on your CPE. If you chose the "default" IKE policy when configuring the device link, use the configurations described in the [Remote network configurations](reference-remote-network-configurations.md) article.


## Next steps

- [How to manage remote networks](how-to-manage-remote-networks.md)
- [How to manage remote network device links](how-to-manage-remote-network-device-links.md)