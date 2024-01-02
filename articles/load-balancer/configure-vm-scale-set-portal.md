---
title: Configure Virtual Machine Scale Set with an existing Azure Load Balancer - Azure portal
description: Learn how to configure a Virtual Machine Scale Set with an existing Azure Load Balancer using the Azure portal.
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: how-to
ms.date: 12/15/2022
ms.custom: template-quickstart, engagement-fy23
---

# Configure a Virtual Machine Scale Set with an existing Azure Load Balancer using the Azure portal

In this article, you'll learn how to configure a Virtual Machine Scale Set with an existing Azure Load Balancer. 

## Prerequisites

- An Azure subscription.
- An existing standard sku load balancer in the subscription where the Virtual Machine Scale Set will be deployed.
- An Azure Virtual Network for the Virtual Machine Scale Set.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com).



## Deploy Virtual Machine Scale Set with existing load balancer

In this section, you'll create a Virtual Machine Scale Set in the Azure portal with an existing Azure load balancer.

> [!NOTE]
> The following steps assume a virtual network named **myVNet** and a Azure load balancer named **myLoadBalancer** has been previously deployed.

1. On the top left-hand side of the screen, select **Create a resource** and search for **Virtual Machine Scale Set** in the marketplace search.

1. Select **Virtual machine scale set** and Select **Create**.

1. In **Create a virtual machine scale set**, enter, or select this information in the **Basics** tab:

    | Setting                        | Value                                                                                                 |
    |--------------------------------|-------------------------------------------------------------------------------------------------------|
    | **Project details**            |                                                                                                       |
    | Subscription                   | Select your Azure subscription                                                                        |
    | Resource Group                 | Select  Create new, enter **myResourceGroup**, then select OK, or select an existing  resource group. |
    | **Scale set details**          |                                                                                                       |
    | Virtual Machine Scale Set name | Enter **myVMSS**                                                                                      |
    | Region                         | Select **East US 2**                                                                                  |
    | Availability zone              | Select **None**                                                                                       |
    | **Orchestration** |                    |
    | Orchestration mode | Select **Uniform** |
    | Security type | Select **Standard** |
    | **Instance details**           |                                                                                                       |
    | Image                          | Select **Ubuntu Server 18.04 LTS**                                                                    |
    | Azure Spot instance            | Select **No**                                                                                         |
    | Size                           | Leave at default                                                                                      |
    | **Administrator account**      |                                                                                                       |
    | Authentication type            | Select **Password**                                                                                   |
    | Username                       | Enter your admin username        |
    | Password                       | Enter your admin password    |
    | Confirm password               | Reenter your admin password |

    :::image type="content" source="media/vm-scale-sets/create-virtual-machine-scale-set-thumb.png" alt-text="Screenshot of Create a Virtual Machine Scale Set page." lightbox="media/vm-scale-sets/create-virtual-machine-scale-set.png":::

4. Select the **Networking** tab.

5. Enter or select this information in the **Networking** tab:

    | Setting                           | Value                                                    |
    |-----------------------------------|----------------------------------------------------------|
    | **Virtual Network Configuration** |                                                          |
    | Virtual network                   | Select **myVNet** or your existing virtual network.      |
    | **Load balancing**                |                                                          |
    | Use a load balancer               | Select **Yes**                                           |
    | **Load balancing settings**       |                                                          |
    | Load balancing options            | Select **Azure load balancer**                           |
    | Select a load balancer            | Select **myLoadBalancer** or your existing load balancer |
    | Select a backend pool             | Select **myBackendPool** or your existing backend pool.  |

    :::image type="content" source="media/vm-scale-sets/create-virtual-machine-scale-set-network-thumb.png" alt-text="Screenshot shows the Create Virtual Machine Scale Set Networking tab." lightbox="media/vm-scale-sets/create-virtual-machine-scale-set-network.png":::

6. Select the **Management** tab.

7. In the **Management** tab, set **Boot diagnostics** to **Off**.

8. Select the blue **Review + create** button.

9. Review the settings and select the **Create** button.

## Next steps

In this article, you deployed a Virtual Machine Scale Set with an existing Azure Load Balancer.  To learn more about Virtual Machine Scale Sets and load balancer, see:

- [What is Azure Load Balancer?](load-balancer-overview.md)
- [What are Virtual Machine Scale Sets?](../virtual-machine-scale-sets/overview.md)
