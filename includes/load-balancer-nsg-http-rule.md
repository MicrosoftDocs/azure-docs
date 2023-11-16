---
 title: include file
 description: include file
 services: load-balancer
 author: mbender-ms
 ms.service: load-balancer
 ms.topic: include
 ms.date: 10/19/2023
 ms.author: mbender
 ms.custom: include file
---

## Create a network security group

In this section, you'll create a network security group (NSG) for the virtual machines in the backend pool of the load balancer. The NSG will allow inbound traffic on port 80.

1. In the search box at the top of the portal, enter **Network security group**.
1. Select **Network security groups** in the search results.
1. Select **+ Create** or **Create network security group** button.
1. On the **Basics** tab, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **lb-resource-group**. |
    | **Instance details** |   |
    | Name | Enter **lb-NSG**. |
    | Region | Select **(US) East US**. |

1. Select *Review + create* tab, or select the blue **Review + create** button at the bottom of the page.
1. Select **Create**.
1. When deployment is complete, select **Go to resource**.
1. In the **Settings** section of the **lb-NSG** page, select **Inbound security rules**.
1. Select **+ Add**.
1. In the **Add inbound security rule** window, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Source | Select **Any**. |
    | Source port ranges | Enter **\***. |
    | Destination | Select **Any**. |
    | Service | Select **HTTP**. |
    | Action | Select **Allow**. |
    | Priority | Enter **100**. |
    | Name | Enter **lb-NSG-HTTP-rule**. |

1. Select **Add**.