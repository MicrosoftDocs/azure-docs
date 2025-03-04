---
title: Azure Bastion session monitoring and management
description: Learn how to select an ongoing session and force-disconnect or delete it.
services: bastion
author: cherylmc
ms.service: azure-bastion
ms.topic: how-to
ms.date: 12/09/2024
ms.author: cherylmc

---

# Session monitoring and management for Azure Bastion

Once the Bastion service is provisioned and deployed in your virtual network, you can use it to seamlessly connect to any virtual machine in this virtual network. As users connect to workloads, Azure Bastion can be used to monitor the remote sessions and take quick management actions. Azure Bastion session monitoring lets you view which users are connected to which virtual machines. It shows the IP that the user connected from, how long the user has been connected, and when they connected. The session management experience lets you select an ongoing session and force-disconnect or delete a session in order to disconnect the user from the ongoing session.

## <a name="monitor"></a>Monitor remote sessions

1. In the [Azure portal](https://portal.azure.com), go to your Azure Bastion resource and select **Sessions** from the Azure Bastion page.
1. On the **Sessions** page, you can see the ongoing remote sessions on the right side.
1. Select **Refresh** to see the updated list of remote sessions. When you select **Refresh**, Azure Bastion fetches the latest monitoring information and refreshes it in the portal.

## <a name="view"></a>Delete or force-disconnect an ongoing remote session

You can select a set of sessions and force-disconnect them. The following steps show you how to delete remote sessions:

1. Navigate to your Azure Bastion resource and select **Sessions** from the Azure Bastion page.
1. After you select Sessions, you see a list of remote sessions.
1. Select a specific remote session, then select the three ellipses on the right-side end of the session row, and then select **Delete**.
1. When you select **Delete**, the remote session is disconnected and the user is shown a "You have been disconnected" message in the remote session.

## Next steps

Read the [Bastion FAQ](bastion-faq.md).
