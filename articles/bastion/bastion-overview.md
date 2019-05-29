---
title: 'Azure Bastion | Microsoft Docs'
description: Learn about Azure Bastion
services: bastion
author: cherylmc
# Customer intent: As someone with a basic network background, but is new to Azure, I want to understand the capabilities of Azure Bastion so that I can securely connect to my Azure virtual machines.

ms.service: bastion
ms.topic: overview
ms.date: 05/29/2019
ms.author: cherylmc

---
# What is Azure Bastion? (preview)

Azure Bastion lets you to securely and seamlessly RDP & SSH directly to your VMs in an Azure virtual network without using a VM public IP. You connect to the VM directly from the Azure portal, without the need of any additional client, agent, or any piece of software.

> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.
>

## How does it work?

Once you provision an Azure Bastion service in your virtual network, the seamless RDP/SSH experience is available to all your VMs in the same virtual network. The deployment is per virtual network, not per subscription/account or virtual machine.

[!INCLUDE [Bastion FAQ](../../includes/bastion-faq-include.md)]

## Next steps

- [Create an Azure Bastion host resource](bastion-create-host-portal.md).
- View the [Subscription and service limits](../azure-subscription-service-limits.md#networking-limits).
- Learn about some of the other key [networking capabilities](../networking/networking-overview.md) of Azure.