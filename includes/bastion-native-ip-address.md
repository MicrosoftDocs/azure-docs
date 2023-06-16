---
author: cherylmc
ms.service: bastion
ms.topic: include
ms.date: 06/12/2023
ms.author: cherylmc
---
This section helps you connect to your on-premises, non-Azure, and Azure virtual machines via Azure Bastion using a specified private IP address from the native client. You can replace `--target-resource-id` with `--target-ip-address` in any of the above commands with the specified IP address to connect to your VM.

> [!NOTE]
> This feature does not support support Azure AD authentication or custom port and protocol at the moment. For more information on IP-based connection, see [Connect to a VM - IP address](../articles/bastion/connect-ip-address.md).