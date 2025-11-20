---
title: 'Tutorial: Integrate NAT gateway with a public load balancer - Azure portal'
titleSuffix: Azure NAT Gateway
description: In this tutorial, learn how to integrate a NAT gateway with a public load Balancer using the Azure portal.
author: asudbring
ms.author: allensu
ms.service: azure-nat-gateway
ms.topic: tutorial
ms.date: 09/11/2025
ms.custom: template-tutorial, linux-related-content
# Customer intent: "As a cloud architect, I want to integrate a NAT gateway with a public load balancer, so that I can ensure secure and efficient outbound connectivity for my backend resources."
---

# Tutorial: Integrate a NAT gateway with a public load balancer using the Azure portal

In this tutorial, you learn how to integrate a NAT gateway with a public load balancer.

By default, an Azure Standard Load Balancer is secure. Outbound connectivity is explicitly defined by enabling outbound SNAT (Source Network Address Translation). SNAT is enabled in a load-balancing rule or outbound rules. 

The NAT gateway integration replaces the need for outbound rules for backend pool outbound SNAT. 

:::image type="content" source="./media/tutorial-nat-gateway-load-balancer-public-portal/resources-diagram.png" alt-text="Diagram of Azure resources created in tutorial." lightbox="./media/tutorial-nat-gateway-load-balancer-public-portal/resources-diagram.png":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a NAT gateway
> * Create an Azure Load Balancer
> * Create two virtual machines for the backend pool of the Azure Load Balancer
> * Validate outbound connectivity of the virtual machines in the load balancer backend pool

## Prerequisites

An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

## Create a resource group

Create a resource group to contain all resources for this quickstart.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal enter **Resource group**. Select **Resource groups** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create a resource group**, enter, or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select your subscription|
    | Resource group | test-rg |
    | Region | **East US 2** |

1. Select **Review + create**.

1. Select **Create**.

## Create the virtual network

1. In the search box at the top of the Azure portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **Create**.

1. Enter or select the following information in the **Basics** tab of **Create virtual network**.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg** or your resource group. |
    | **Instance details** |  |
    | Name | Enter **vnet-1**. |
    | Region | Select your region. This example uses **East US 2**. |

1. Select the **IP Addresses** tab, or select **Next: Security**, then **Next: IP Addresses**.

1. In **Subnets** select the **default** subnet.

1. Enter or select the following information in **Edit subnet**.

    | Setting | Value |
    | ------- | ----- |
    | Subnet purpose | Leave the default. |
    | Name | Enter **subnet-1**. |

1. Leave the rest of the settings as default, then select **Save**.

1. Select **+ Add a subnet**.

1. In **Add a subnet** enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Subnet purpose | Select **Azure Bastion**. |

1. Leave the rest of the settings as default, then select **Add**.

1. Select **Review + create**, then select **Create**.

## Create Azure Bastion host

Create an Azure Bastion host to securely connect to the virtual machine.

1. In the search box at the top of the Azure portal, enter **Bastion**. Select **Bastions** in the search results.

1. Select **Create**.

1. Enter or select the following information in the **Basics** tab of **Create a Bastion**.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg** or your resource group. |
    | **Instance details** |  |
    | Name | Enter **bastion**. |
    | Region | Select your region. This example uses **East US 2**. |
    | Tier | Select **Developer**. |
    | Virtual network | Select **vnet-1**. |
    | Subnet | Select **AzureBastionSubnet**. |

1. Select **Review + create**, then select **Create**.

## Create a NAT gateway

1. In the search box at the top of the Azure portal, enter **Public IP address**. Select **Public IP addresses** in the search results.

1. Select **Create**.

1. Enter the following information in **Create public IP address**.

   | Setting | Value |
   | ------- | ----- |
   | Subscription | Select your subscription. |
   | Resource group | Select your resource group. The example uses **test-rg**. |
   | Region | Select a region. This example uses **East US 2**. |
   | Name | Enter **public-ip-nat**. |
   | IP version | Select **IPv4**. |
   | SKU | Select **Standard**. |
   | Availability zone | Select **Zone-redundant**. |
   | Tier | Select **Regional**. |

1. Select **Review + create** and then select **Create**.

1. In the search box at the top of the Azure portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **Create**.

1. Enter or select the following information in the **Basics** tab of **Create network address translation (NAT) gateway**.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg** or your resource group. |
    | **Instance details** |  |
    | NAT gateway name | Enter **nat-gateway**. |
    | Region | Select your region. This example uses **East US 2**. |
    | SKU | Select **Standard**. |
    | TCP idle timeout (minutes) | Leave the default of **4**. |

1. Select **Next**.

1. In the **Outbound IP** tab, select **+ Add public IP addresses or prefixes**.

1. In **Add public IP addresses or prefixes**, select **Public IP addresses**. Select the public IP address you created earlier, **public-ip-nat**.

1. Select **Next**.

1. In the **Networking** tab, in **Virtual network**, select **vnet-1**.

1. Leave the checkbox for **Default to all subnets** unchecked.

1. In **Select specific subnets**, select **subnet-1**.

1. Select **Review + create**, then select **Create**.

[!INCLUDE [load-balancer-public-create-http.md](../../includes/load-balancer-public-create-http.md)]

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
    203.0.113.25
    ```

1. Close the bastion connection to **vm-1**.

[!INCLUDE [portal-clean-up.md](~/reusable-content/ce-skilling/azure/includes/portal-clean-up.md)]

## Next steps

For more information on Azure NAT Gateway, see:
> [!div class="nextstepaction"]
> [Azure NAT Gateway overview](nat-overview.md)
