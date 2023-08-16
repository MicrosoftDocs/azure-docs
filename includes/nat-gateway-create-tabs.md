---
 title: include file
 description: include file
 services: nat-gateway
 author: asudbring
 ms.service: nat-gateway
 ms.topic: include
 ms.date: 07/12/2023
 ms.author: allensu
 ms.custom: include file
---

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create network address translation (NAT) gateway**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | NAT gateway name | Enter **nat-gateway**. |
    | Region | Select **East US 2**. |
    | Availability zone | Select a zone or **No Zone**. |
    | TCP idle timeout (minutes) | Leave the default of **4**. |

1. Select **Next: Outbound IP**.

1. In **Public IP addresses**, select **Create a new public IP address**.

1. Enter **public-ip-nat** in **Name**. Select **OK**.

1. Select **Next: Subnet**.

1. In **Virtual network**, select **vnet-1**.

1. In the list of subnets, select the box for **subnet-1**.

1. Select **Review + create**.

1. Select **Create**.
