---
title: 'Working remotely using Bastion: Azure Bastion'
description: This page describes how you can leverage Azure Bastion to enable working remotely due to the COVID-19 pandemic.
services: bastion
author: mialdrid

ms.service: bastion
ms.topic: conceptual
ms.date: 03/25/2020
ms.author: mialdrid


---

# Working remotely using Azure Bastion

Azure Bastion plays a pivotal role in supporting remote work scenarios by allowing users with internet connectivity to access Azure virtual machines. In particular, it enables IT administrators to manage their applications running on Azure at anytime and from anywhere around the globe.

>[!NOTE]
>This article describes how you can leverage Azure Bastion, Azure, Microsoft network, and the Azure partner ecosystem to work remotely and  mitigate network issues that you are facing because of COVID-19 crisis.
>

## Securely access virtual machines

Specifically, Azure Bastion provides secure and seamless RDP/SSH connectivity to virtual machines within the Azure virtual network, directly in the Azure portal, without the use of a public IP address. For more information about the Azure Bastion architecture and key features, check out [What is Azure Bastion](bastion-overview.md).

Azure Bastion is deployed per virtual network, meaning companies can configure and manage one Azure Bastion to quickly support remote user access to virtual machines within an Azure virtual network. For guidance on how to create and manage Azure Bastion, refer to [Create a bastion host](bastion-create-host-portal.md).

## Next steps

* Configure Azure Bastion using the [Azure portal](bastion-create-host-portal.md), [PowerShell](bastion-create-host-powershell.md), or Azure CLI.

* Read the [Bastion FAQ](bastion-faq.md) for additional information.
