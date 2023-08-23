---
title: 'Quickstart: Use the Azure portal to create a virtual network'
titleSuffix: Azure Virtual Network
description: Learn how to use the Azure portal to create and connect through an Azure virtual network and virtual machines.
author: asudbring
ms.author: allensu
ms.date: 06/06/2023
ms.topic: quickstart
ms.service: virtual-network
ms.custom: 
#Customer intent: I want to use the Azure portal to create a virtual network so that virtual machines can communicate privately with each other and with the internet.
---

# Quickstart: Use the Azure portal to create a virtual network

This quickstart shows you how to create a virtual network by using the Azure portal. You then create two virtual machines (VMs) in the network, deploy Azure Bastion to securely connect to the VMs from the internet, and communicate privately between the VMs.

A virtual network is the fundamental building block for private networks in Azure. Azure Virtual Network enables Azure resources like VMs to securely communicate with each other and the internet.

:::image type="content" source="./media/quick-create-portal/virtual-network-qs-resources.png" alt-text="Diagram of resources created in virtual network quickstart.":::

## Prerequisites

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## <a name="create-a-virtual-network"></a> Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

[!INCLUDE [virtual-network-create-with-bastion.md](../../includes/virtual-network-create-with-bastion.md)]

[!INCLUDE [create-two-virtual-machines.md](../../includes/create-two-virtual-machines.md)]

## Connect to a virtual machine

1. In the portal, search for and select **Virtual machines**.

1. On the **Virtual machines** page, select **vm-1**.

1. In the **Overview** of **vm-1**, select **Connect**.

1. In the **Connect to virtual machine** page, select the **Bastion** tab.

1. Select **Use Bastion**.

1. Enter the username and password you created when you created the VM, and then select **Connect**.

## Communicate between VMs

1. At the bash prompt for **vm-1**, enter `ping -c 4 vm-2`.

   You get a reply similar to the following message:

    ```output
    azureuser@vm-1:~$ ping -c 4 vm-2
    PING vm-2.3bnkevn3313ujpr5l1kqop4n4d.cx.internal.cloudapp.net (10.0.0.5) 56(84) bytes of data.
    64 bytes from vm-2.internal.cloudapp.net (10.0.0.5): icmp_seq=1 ttl=64 time=1.83 ms
    64 bytes from vm-2.internal.cloudapp.net (10.0.0.5): icmp_seq=2 ttl=64 time=0.987 ms
    64 bytes from vm-2.internal.cloudapp.net (10.0.0.5): icmp_seq=3 ttl=64 time=0.864 ms
    64 bytes from vm-2.internal.cloudapp.net (10.0.0.5): icmp_seq=4 ttl=64 time=0.890 ms
    ```

1. Close the Bastion connection to VM1.

1. Repeat the steps in [Connect to a virtual machine](#connect-to-a-virtual-machine) to connect to VM2.

1. At the bash prompt for **vm-2**, enter `ping -c 4 vm-1`.

   You get a reply similar to the following message:

    ```output
    azureuser@vm-2:~$ ping -c 4 vm-1
    PING vm-1.3bnkevn3313ujpr5l1kqop4n4d.cx.internal.cloudapp.net (10.0.0.4) 56(84) bytes of data.
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=1 ttl=64 time=0.695 ms
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=2 ttl=64 time=0.896 ms
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=3 ttl=64 time=3.43 ms
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=4 ttl=64 time=0.780 ms
    ```

1. Close the Bastion connection to VM2.

[!INCLUDE [portal-clean-up.md](../../includes/portal-clean-up.md)]

## Next steps

In this quickstart, you created a virtual network with two subnets, one containing two VMs and the other for Azure Bastion. You deployed Azure Bastion and used it to connect to the VMs, and securely communicated between the VMs. To learn more about virtual network settings, see [Create, change, or delete a virtual network](manage-virtual-network.md).

Private communication between VMs is unrestricted in a virtual network. Continue to the next article to learn more about configuring different types of VM network communications.

> [!div class="nextstepaction"]
> [Filter network traffic](tutorial-filter-network-traffic.md)
