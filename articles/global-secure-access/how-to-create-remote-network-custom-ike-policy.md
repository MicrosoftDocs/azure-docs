---
title: How to create a remote network with a customer IKE policy for Global Secure Access (preview)
description: Learn how to create a remote network with a customer IKE policy for Global Secure Access (preview).
author: shlipsey3
ms.author: sarahlipsey
manager: amycolannino
ms.topic: how-to
ms.date: 06/08/2023
ms.service: network-access
ms.custom: 

---
# Create a remote network with a customer IKE policy for Global Secure Access (preview)

IPSec tunnel is a bidirectional communication. One side of the communication is established when [adding a device link to a remote network](how-to-manage-remote-network-device-links.md). During that process you enter your public IP address and BGP addresses. This article provides the steps to set up the other side of the communication channel.

## Prerequisites

To create a remote network with a custom IKE policy, you must have:

- A **Global Secure Access Administrator** role in Microsoft Entra ID.
- Sent an email to Global Secure Access onboarding according to the onboarding process in the **Remote network** area of Global Secure Access.
- Received the connectivity information from Global Secure Access onboarding.

## How to use Microsoft Graph to create a remote network with a custom IKE policy

Remote networks with a custom IKE policy can be created using Microsoft Graph on the `/beta` endpoint.

To get started, follow these instructions to work with remote networks using Microsoft Graph in Graph Explorer. 

1. Sign in to [Graph Explorer](https://aka.ms/ge).
1. Select **POST** as the HTTP method from the dropdown.
1. Set the API version to **beta**.
1. Add the following query to retrieve recommendations, then select the **Run query** button.

```http
    POST https://graph.microsoft.com/beta/networkaccess/connectivity/branches
```

[!INCLUDE [Public preview important note](./includes/public-preview-important-note.md)]

## Next steps

- [How to manage remote networks](how-to-manage-remote-networks.md)
- [How to manage remote network device links](how-to-manage-remote-network-device-links.md)