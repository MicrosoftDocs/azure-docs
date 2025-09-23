---
title: Enable remote work by using Azure Bastion
description: Learn how to use Azure Bastion to enable remote access to virtual machines.
services: bastion
author: isamorris

ms.service: azure-bastion
ms.topic: concept-article
ms.date: 03/31/2025
ms.author: isamorris
# Customer intent: "As an IT administrator, I want to use Azure Bastion to securely access and manage virtual machines remotely, so that I can support remote work scenarios from any location around the globe."
---

# Enable remote work by using Azure Bastion

Azure Bastion supports remote work scenarios by allowing users with internet connectivity to access Azure virtual machines. In particular, it enables IT administrators to manage their applications running on Azure at any time and from anywhere around the globe.

## Securely access virtual machines

Azure Bastion provides RDP/SSH connectivity to virtual machines within an Azure virtual network, directly in the Azure portal, without the use of a public IP address. For more information about the Azure Bastion architecture and key features, check out [What is Azure Bastion?](bastion-overview.md).

Azure Bastion is deployed per virtual network. Companies can configure and manage one Azure Bastion to quickly support remote user access to virtual machines within an Azure virtual network. For guidance on how to create and manage Azure Bastion, see [Create an Azure Bastion host](./tutorial-create-host-portal.md).

## Next steps

* Configure Azure Bastion by using the [Azure portal](tutorial-create-host-portal.md), [PowerShell](bastion-create-host-powershell.md), or the [Azure CLI](create-host-cli.md).

* Read the [Azure Bastion FAQ](bastion-faq.md).
