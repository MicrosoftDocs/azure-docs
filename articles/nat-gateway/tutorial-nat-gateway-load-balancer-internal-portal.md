---
title: 'Tutorial: Integrate NAT gateway with an internal load balancer - Azure portal'
titleSuffix: Azure NAT Gateway
description: In this tutorial, learn how to integrate a NAT gateway with an internal load Balancer using the Azure portal.
author: asudbring
ms.author: allensu
ms.service: nat-gateway
ms.topic: tutorial
ms.date: 05/24/2022
ms.custom: template-tutorial
---

# Tutorial: Integrate a NAT gateway with an internal load balancer using the Azure portal

In this tutorial, you learn how to integrate a NAT gateway with an internal load balancer.

By default, an Azure Standard Load Balancer is secure. Outbound connectivity is explicitly defined by enabling outbound SNAT (Source Network Address Translation). 

SNAT is enabled for an internal backend pool via another public load balancer, network routing, or a public IP defined on a virtual machine.

The NAT gateway integration replaces the need for the deployment of a public load balancer, network routing, or a public IP defined on a virtual machine in the backend pool.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Azure Load Balancer
> * Create two virtual machines for the backend pool of the Azure Load Balancer
> * Create a NAT gateway
> * Validate outbound connectivity of the virtual machines in the load balancer backend pool

## Prerequisites

An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

[!INCLUDE [virtual-network-create-with-nat-bastion.md](../../includes/virtual-network-create-with-nat-bastion.md)]

[!INCLUDE [load-balancer-internal-create-http.md](../../includes/load-balancer-internal-create-http.md)]

[!INCLUDE [create-two-virtual-machines-linux-load-balancer.md](../../includes/create-two-virtual-machines-linux-load-balancer.md)]

## Test NAT gateway

In this section, you test the NAT gateway. You first discover the public IP of the NAT gateway. You then connect to the test virtual machine and verify the outbound connection through the NAT gateway.
    
1. In the search box at the top of the portal, enter **Public IP**. Select **Public IP addresses** in the search results.

1. Select **public-ip-nat**.

1. Make note of the public IP address:

    :::image type="content" source="./media/quickstart-create-nat-gateway-portal/find-public-ip.png" alt-text="Screenshot of public IP address of NAT gateway." border="true":::

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-1**.

1. On the **Overview** page, select **Connect**, then select the **Bastion** tab.

1. Select **Use Bastion**.

1. Enter the username and password entered during VM creation. Select **Connect**.

1. In the bash prompt, enter the following command:

    ```bash
    curl ifconfig.me
    ```

1. Verify the IP address returned by the command matches the public IP address of the NAT gateway.

    ```output
    azureuser@vm-1:~$ curl ifconfig.me
    20.7.200.36
    ```

1. Close the bastion connection to **vm-1**.

[!INCLUDE [portal-clean-up.md](../../includes/portal-clean-up.md)]

## Next steps

For more information on Azure NAT Gateway, see:
> [!div class="nextstepaction"]
> [Azure NAT Gateway overview](nat-overview.md)
