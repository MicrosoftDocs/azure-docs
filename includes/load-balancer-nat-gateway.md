---
 title: include file
 description: include file
 services: virtual-network
 author: mbender-ms
 ms.service: virtual-network
 ms.topic: include
 ms.date: 10/19/2023
 ms.author: mbender
 ms.custom: include file
---

## Create NAT gateway

All outbound internet traffic traverses the NAT gateway to the internet. Use the following example to create a NAT gateway for the hub and spoke network. For other options for outbound rules, check out [Network Address Translation (SNAT) for outbound connections](/azure/load-balancer/load-balancer-outbound-connections)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create network address translation (NAT) gateway** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **load-balancer-rg** in Name. </br> Select **OK**. |
    | **Instance details** |    |
    | NAT gateway name | Enter **lb-nat-gateway**. |
    | Region | Select **East US**. |
    | Availability zone | Select **None**. |
    | Idle timeout (minutes) | Enter **15**. |

    :::image type="content" source="./media/load-balancer-internal-create-bastion-include/create-nat-gateway.png" alt-text="Screenshot of Create network address translation gateway window in the Azure portal.":::

1. Select the **Outbound IP** tab or select the **Next: Outbound IP** button at the bottom of the page.

1. Select **Create a new public IP address** under **Public IP addresses**.

1. Enter **nat-gw-public-ip** in **Name** in **Add a public IP address**.

1. Select **OK**.

    :::image type="content" source="./media/load-balancer-internal-create-bastion-include/create-virtual-network-basics.png" alt-text="Screenshot of Add a public IP address window in the Azure portal":::

1. Select the blue **Review + create** button at the bottom of the page, or select the **Review + create** tab.

1. Select **Create**.