---
title: 'Quickstart: Create a NAT gateway - Azure portal'
titlesuffix: Azure NAT Gateway
description: This quickstart shows how to create a NAT gateway by using the Azure portal.
author: asudbring
ms.author: allensu
ms.service: nat-gateway
ms.topic: quickstart 
ms.date: 06/20/2023
ms.custom: template-quickstart, FY23 content-maintenance
---

# Quickstart: Create a NAT gateway using the Azure portal

This quickstart shows you how to use the Azure NAT Gateway service. You'll create a NAT gateway to provide outbound connectivity for a virtual machine in Azure. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [virtual-network-create-with-nat-bastion.md](../../includes/virtual-network-create-with-nat-bastion.md)]

[!INCLUDE [create-test-virtual-machine-linux.md](../../includes/create-test-virtual-machine-linux.md)]

## Test NAT gateway

In this section, you'll test the NAT gateway. You'll first discover the public IP of the NAT gateway. You'll then connect to the test virtual machine and verify the outbound connection through the NAT gateway.
    
1. In the search box at the top of the portal, enter **Public IP**. Select **Public IP addresses** in the search results.

1. Select **public-ip**.

1. Make note of the public IP address:

    :::image type="content" source="./media/quickstart-create-nat-gateway-portal/find-public-ip.png" alt-text="Discover public IP address of NAT gateway" border="true":::

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-1**.

1. On the **Overview** page, select **Connect**, then **Bastion**.

1. Enter the username and password entered during VM creation. Select **Connect**.

1. In the command line prompt, enter the following command:

    ```bash
    curl ifconfig.me
    ```

1. Verify the IP address returned by the command matches the public IP address of the NAT gateway.

    ```output
    ```

[!INCLUDE [portal-clean-up.md](../../includes/portal-clean-up.md)]

## Next steps

For more information on Azure NAT Gateway, see:
> [!div class="nextstepaction"]
> [Azure NAT Gateway overview](nat-overview.md)
