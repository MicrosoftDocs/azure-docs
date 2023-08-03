---
title: 'Connect to a virtual machine scale set using Azure Bastion'
description: Learn how to connect to an Azure virtual machine scale set using Azure Bastion.
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 06/23/2023
ms.author: cherylmc

---

# Connect to a virtual machine scale set using Azure Bastion

This article shows you how to securely and seamlessly connect to your virtual machine scale set instance in an Azure virtual network directly from the Azure portal using Azure Bastion. When you use Azure Bastion, VMs don't require a client, agent, or additional software. For more information about Azure Bastion, see the [Overview](bastion-overview.md). For more information about virtual machine scale sets, see [What are virtual machine scale sets?](../virtual-machine-scale-sets/overview.md)

## Prerequisites

Make sure that you have set up an Azure Bastion host for the virtual network in which the virtual machine scale set resides. For more information, see [Create an Azure Bastion host](tutorial-create-host-portal.md). Once the Bastion service is provisioned and deployed in your virtual network, you can use it to connect to a virtual machine scale set instance in this virtual network.

## <a name="rdp"></a>Connect

This section shows you the basic steps to connect to your virtual machine scale set.

1. Open the [Azure portal](https://portal.azure.com). Go to the virtual machine scale set that you want to connect to.

   :::image type="content" source="./media/bastion-connect-vm-scale-set/select-scale-set.png" alt-text="Screenshot shows virtual machine scale sets." lightbox="./media/bastion-connect-vm-scale-set/select-scale-set.png":::

1. Go to the virtual machine scale set instance that you want to connect to.

   :::image type="content" source="./media/bastion-connect-vm-scale-set/select-instance.png" alt-text="Screenshot shows virtual machine scale set instances." lightbox="./media/bastion-connect-vm-scale-set/select-instance.png":::

1. Select **Connect** at the top of the page, then choose **Bastion** from the dropdown.

   :::image type="content" source="./media/bastion-connect-vm-scale-set/select-connect.png" alt-text="Screenshot shows select the connect button and choose Bastion from the dropdown." lightbox="./media/bastion-connect-vm-scale-set/select-connect.png":::

1. On the **Bastion** page, fill in the required settings. The settings you can select depend on the virtual machine to which you're connecting, and the [Bastion SKU](configuration-settings.md#skus) tier that you're using. The Standard SKU gives you more connection options than the Basic SKU. For more information about settings, see [Bastion configuration settings](configuration-settings.md).

1. After filling in the values on the Bastion page, select **Connect** to connect to the instance.

## Next steps

Read the [Bastion FAQ](bastion-faq.md).
