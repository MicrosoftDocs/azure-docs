---
 title: include file
 description: include file
 services: load-balancer
 author: mbender-ms
 ms.service: azure-load-balancer
 ms.topic: include
 ms.date: 12/04/2023
 ms.author: mbender
 ms.custom: include file
---

## Create NAT gateway

In this section, you'll create a NAT gateway for outbound internet access for resources in the virtual network.  For other options for outbound rules, check out [Network Address Translation (SNAT) for outbound connections](/azure/load-balancer/load-balancer-outbound-connections)

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

1. Select the **Subnet** tab or select the **Next: Subnet** button at the bottom of the page.

1. On the **Subnet** page, for **Virtual network**, select **lb-vnet** from the dropdown.

1. For **Subnet name**, select **backend-subnet**.

1. Select the blue **Review + create** button at the bottom of the page, or select the **Review + create** tab.

1. Select **Create**.