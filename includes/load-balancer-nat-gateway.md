---
 title: include file
 description: include file
 services: load-balancer
 author: mbender-ms
 ms.service: azure-load-balancer
 ms.topic: include
 ms.date: 01/28/2026
 ms.author: mbender
 ms.custom: include file
---

## Create NAT gateway

In this section, you create a NAT gateway for outbound internet access for resources in the virtual network. For other options for outbound rules, check out [Network Address Translation (SNAT) for outbound connections](/azure/load-balancer/load-balancer-outbound-connections)

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create network address translation (NAT) gateway** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create a new resource group**.</br>Enter **load-balancer-rg** in Name.</br>Select **OK**. |
    | **Instance details** |    |
    | NAT gateway name | Enter **lb-nat-gateway**. |
    | Region | Select **East US**. |
    | SKU | Select **Standard**. |
    | **Availability zone** | Select **None**. |
    | TCP idle timeout (minutes) | Enter **15**. |

1. Select the **Outbound IP** tab or select the **Next** button at the bottom of the page.
1. Select **Add public IP addresses or prefixes**.
1. On the **Manage public IP addresses and prefixes** page, select **Create a public IP address** and enter **nat-gw-public-ip** in **Name**.
1. Select **OK** and **Save**.
1. Select the blue **Review + create** button at the bottom of the page, or select the **Review + create** tab.
1. Select **Create**.