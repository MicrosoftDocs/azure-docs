---
title: 'Tutorial: Migrate outbound access to NAT gateway'
titlesuffix: Azure NAT Gateway
description: Use this tutorial to learn how to migrate outbound access in your virtual network to an Azure NAT gateway.
author: asudbring
ms.author: allensu
ms.service: azure-nat-gateway
ms.topic: tutorial
ms.date: 02/13/2024
ms.custom:
  - template-tutorial
  - sfi-image-nochange
# Customer intent: As a network engineer, I want to learn how to migrate my outbound access to a NAT gateway.
---

# Tutorial: Migrate outbound access to Azure NAT Gateway

In this tutorial, you learn how to migrate your outbound connectivity from [default outbound access](../virtual-network/ip-services/default-outbound-access.md) to a NAT gateway. 

You learn how to change your outbound connectivity from load balancer outbound rules to a NAT gateway. You reuse the IP address from the outbound rule configuration for the NAT gateway.

Azure NAT Gateway is the recommended method for outbound connectivity. A NAT gateway is a fully managed and highly resilient Network Address Translation (NAT) service. A NAT gateway doesn't have the same limitations of Source Network Address Translation (SNAT) port exhaustion as default outbound access. A NAT gateway replaces the need for outbound rules in a load balancer for outbound connectivity.

For more information about Azure NAT Gateway, see [What is Azure NAT Gateway?](nat-overview.md)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Migrate default outbound access to a NAT gateway.
> * Migrate load balancer outbound connectivity and IP address to a NAT gateway.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

* A standard public load balancer in your subscription. The load balancer must have a separate frontend IP address and outbound rules configured. For more information on creating an Azure Load Balancer, see [Quickstart: Create a public load balancer to load balance virtual machines using the Azure portal](../load-balancer/quickstart-load-balancer-standard-public-portal.md).
    
    * The load balancer name used in the examples is **load-balancer**.

> [!NOTE]
> Azure NAT Gateway provides outbound connectivity for standard internal load balancers. For more information on integrating a NAT gateway with your internal load balancers, see [Tutorial: Integrate a NAT gateway with an internal load balancer using Azure portal](tutorial-nat-gateway-load-balancer-internal-portal.md).

## Create a resource group

Create a resource group to contain all resources for this tutorial.

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

## Migrate default outbound access

In this section, you learn how to change your outbound connectivity method from default outbound access to a NAT gateway.

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

1. In the **Networking** tab, in **Virtual network**, select your virtual network. In this example, it's **test-rg**.

1. Leave the checkbox for **Default to all subnets** unchecked.

1. In **Select specific subnets**, select your subnet. In this example, it's **subnet-1**.

1. Select **Review + create**, then select **Create**.

## Migrate load balancer outbound connectivity

In this section, you learn how to change your outbound connectivity method from outbound rules to a NAT gateway. You keep the same frontend IP address used for the outbound rules. You remove the outbound rule’s frontend IP configuration then create a NAT gateway with the same frontend IP address. A public load balancer is used throughout this section.

### Remove outbound rule frontend IP configuration

You remove the outbound rule and the associated frontend IP configuration from your load balancer. The load balancer name used in this example is **load-balancer**.

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

1. Select **load-balancer** or your load balancer.

1. Expand **Settings**. Select **Frontend IP configuration**.

1. Note the **IP address** in **Frontend IP configuration** that you wish to migrate to a **NAT gateway**. You'll need this information in the next section. In this example, it's **frontend-ip-outbound**.

1. Select **Delete** next to the IP configuration you wish to remove. In this example, it's **frontend-ip-outbound**.

1. Select **Delete**.

1. In **Delete frontend-ip-outbound**, select the check box next to **I have read and understood that this frontend IP configuration as well as the associated resources listed above will be deleted**.

1. Select **Delete**. This procedure deletes the frontend IP configuration and the outbound rule associated with the frontend.

### Create NAT gateway

In this section, you create a NAT gateway with the IP address previously used for outbound rule and assign it to your precreated subnet within your virtual network. The subnet name for this example is **subnet-1**.

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

1. In **Add public IP addresses or prefixes**, select **Public IP addresses**. Select the public IP address you removed from the load balancer in the previous steps. In this example, it's **public-ip-outbound**.

1. Select **Next**.

1. In the **Networking** tab, in **Virtual network**, select your virtual network. In this example, it's **test-rg**.

1. Leave the checkbox for **Default to all subnets** unchecked.

1. In **Select specific subnets**, select your subnet. In this example, it's **subnet-1**.

1. Select **Review + create**, then select **Create**.

## Next steps

In this article, you learned how to:

* Migrate default outbound access to a NAT gateway.

* Migrate load balancer outbound connectivity and IP address to a NAT gateway.

For more information about NAT gateway and the connectivity benefits it provides, see [Design virtual networks with NAT gateway](nat-gateway-resource.md).

Advance to the next article to learn how to integrate a NAT gateway with a public load balancer:
> [!div class="nextstepaction"]
> [Integrate a NAT gateway with a public load balancer using the Azure portal](tutorial-nat-gateway-load-balancer-public-portal.md)
