---
author: cherylmc
ms.service: bastion
ms.topic: include
ms.date: 06/21/2023
ms.author: cherylmc
---
This section helps you connect from your native client to your virtual machines (on-premises, non-Azure, and Azure VMs) via Azure Bastion using a specified private IP address.
Using the `az network bastion tunnel` command, replace `--target-resource-id` with `--target-ip-address` and the specified IP address to connect to your VM.

> [!NOTE]
> Azure AD authentication, and custom ports and protocols are not supported when using this type of connection. For more information about IP-based connections, see [Connect to a VM - IP address](../articles/bastion/connect-ip-address.md).
