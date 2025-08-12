---
title: 'Connect to a virtual machine scale set using Azure Bastion'
description: Learn how to connect to an Azure virtual machine scale set using Azure Bastion.
author: abell
ms.service: azure-bastion
ms.topic: how-to
ms.date: 01/23/2025
ms.author: abell

# Customer intent: "As an IT administrator, I want to connect to a virtual machine scale set using a secure gateway, so that I can manage instances without needing additional clients or software."
---

# Connect to a virtual machine scale set using Azure Bastion

This article shows you how to securely and seamlessly connect to your virtual machine scale set instance in an Azure virtual network directly from the Azure portal using Azure Bastion. When you use Azure Bastion, VMs don't require a client, agent, or additional software. For more information about Azure Bastion, see the [Overview](bastion-overview.md). For more information about virtual machine scale sets, see [What are virtual machine scale sets?](/azure/virtual-machine-scale-sets/overview)

## Prerequisites

Make sure that you have set up an Azure Bastion host for the virtual network in which the virtual machine scale set resides. For more information, see [Create an Azure Bastion host](tutorial-create-host-portal.md). Once the Bastion service is provisioned and deployed in your virtual network, you can use it to connect to a virtual machine scale set instance in this virtual network.

## <a name="rdp"></a>Connect

This section helps you connect to your virtual machine scale set.

1. Open the [Azure portal](https://portal.azure.com) and go to **Virtual machine scale sets**. To open the scale sets instances page, click the scale set that contains the instance that you want to connect to.
1. On the **Scale set instance** page, click the instance that you want to connect to. This opens the page for the instance.
1. On the instance page, select **Connect** at the top of the page, then choose **Bastion** from the dropdown.
1. On the **Bastion** page, fill in the required settings. The settings you can select depend on the virtual machine to which you're connecting, and the [Bastion SKU](configuration-settings.md#skus) tier that you're using. For more information about settings and SKUs, see [Bastion configuration settings](configuration-settings.md).

1. After filling in the values on the Bastion page, select **Connect** to connect to the instance.

## Next steps

Read the [Bastion FAQ](bastion-faq.md).
