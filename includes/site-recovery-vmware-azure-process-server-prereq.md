---
author: ankitaduttaMSFT
ms.service: site-recovery
ms.topic: include
ms.date: 11/28/2019
ms.author: ankitadutta
---
This article assumes that

1. A **Site to Site VPN** or an **Express Route** connection between your on-premises network and the Azure Virtual Network has already been established.
2. Your user account has permissions to create a new virtual machine in the Azure Subscription that the virtual machines have been failed over into.
3. Your subscription has a minimum of 8 Cores available to spin up a new Process Server virtual machine.
4. You have the **Configuration Server Passphrase** available.

> [!TIP]
> Ensure that you are able to connect port 443 of the Configuration Server (running on-premises) from the Azure Virtual Network that the virtual machines have been failed over into.
