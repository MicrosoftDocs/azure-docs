---
title: Configure virtual machine scale set with an existing Azure Load Balancer - Azure portal
description: Learn how to configure a virtual machine scale set with an existing Azure Load Balancer.
author: asudbring
ms.author: allensu
ms.service: load-balancer
ms.topic: article
ms.date: 03/25/2020
---

# Configure a virtual machine scale set with an existing Azure Load Balancer using the Azure portal

In this article, you'll learn how to configure a virtual machine scale set with an existing Azure Load Balancer. 

## Prerequisites

- An Azure subscription.
- An existing standard sku load balancer in the subscription where the virtual machine scale set will be deployed.
- An Azure Virtual Network for the virtual machine scale set.

## Sign in to the Azure portal

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).



## Deploy virtual machine scale set with existing load balancer

In this section, you'll create a virtual machine scale set in the Azure portal with an existing Azure load balancer.

> [!NOTE]
> The following steps assume a virtual network named **myVNet** and a Azure load balancer named **myLoadBalancer** has been previously deployed.

1. On the top left-hand side of the screen, click **Create a resource** > **Compute** > **Virtual machine scale set** or search for **Virtual machine scale set** in the marketplace search.

2. Select **Create**.

3. In **Create a virtual machine scale set**, enter, or select this information in the **Basics** tab:

    | Setting                        | Value                                                                                                 |
    |--------------------------------|-------------------------------------------------------------------------------------------------------|
    | **Project details**            |                                                                                                       |
    | Subscription                   | Select your Azure subscription                                                                        |
    | Resource Group                 | Select  Create new, enter **myResourceGroup**, then select OK, or select an existing  resource group. |
    | **Scale set details**          |                                                                                                       |
    | Virtual machine scale set name | Enter **myVMSS**                                                                                      |
    | Region                         | Select **East US 2**                                                                                    |
    | Availability zone              | Select **None**                                                                                       |
    | **Instance details**           |                                                                                                       |
    | Image                          | Select **Ubuntu Server 18.04 LTS**                                                                    |
    | Azure Spot instance            | Select **No**                                                                                         |
    | Size                           | Leave at default                                                                                      |
    | **Administrator account**      |                                                                                                       |
    | Authentication type            | Select **Password**                                                                                   |
    | Username                       | Enter your admin username        |
    | Password                       | Enter your admin password    |
    | Confirm password               | Reenter your admin password |


    :::image type="content" source="./media/vm-scale-sets/create-vm-scale-set-01.png" alt-text="Create virtual machine scale set." border="true":::

4. Select the **Networking** tab.

5. Enter or select this information in the **Networking** tab:

     Setting                           | Value                                                    |
    |-----------------------------------|----------------------------------------------------------|
    | **Virtual Network Configuration** |                                                          |
    | Virtual network                   | Select **myVNet** or your existing virtual network.      |
    | **Load balancing**                |                                                          |
    | Use a load balancer               | Select **Yes**                                           |
    | **Load balancing settings**       |                                                          |
    | Load balancing options            | Select **Azure load balancer**                           |
    | Select a load balancer            | Select **myLoadBalancer** or your existing load balancer |
    | Select a backend pool             | Select **myBackendPool** or your existing backend pool.  |

    :::image type="content" source="./media/vm-scale-sets/create-vm-scale-set-02.png" alt-text="Create virtual machine scale set." border="true":::

6. Select the **Management** tab.

7. In the **Management** tab, set **Boot diagnostics** to **Off**.

8. Select the blue **Review + create** button.

9. Review the settings and select the **Create** button.

## Next steps

In this article, you deployed a virtual machine scale set with an existing Azure Load Balancer.  To learn more about virtual machine scale sets and load balancer, see:

- [What is Azure Load Balancer?](load-balancer-overview.md)
- [What are virtual machine scale sets?](../virtual-machine-scale-sets/overview.md)
