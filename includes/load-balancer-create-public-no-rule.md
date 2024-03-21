---
 title: include file
 description: include file
 services: load-balancer
 author: mbender-ms
 ms.service: load-balancer
 ms.topic: include
 ms.date: 01/24/2024
 ms.author: mbender
 ms.custom: include file
---
## Create load balancer

In this section, you create a load balancer in this section. The frontend IP and backend pool are configured as part of the creation.

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.
1. In the **Load balancer** page, select **Create** or the **Create load balancer** button.
1. In the **Basics** tab of the **Create load balancer** page, enter, or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Project details** |   |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **lb-resource-group**. |
    | **Instance details** |   |
    | Name                   | Enter **load-balancer**                                   |
    | Region         | Select **(US) East US**.  |
    | SKU           | Leave the default **Standard**. |
    | Type          | Select **Public**.                                        |
    | Tier          | Leave the default **Regional**. |

1. Select the **Frontend IP configuration** tab, or select the **Next: Frontend IP configuration** button at the bottom of the page.
1. In **Frontend IP configuration**, select **+ Add a frontend IP configuration**.
1. Enter **lb-frontend-IP** in **Name**.
1. Select **IPv4** or **IPv6** for the **IP version**.

    > [!NOTE]
    > IPv6 isn't currently supported with Routing Preference or Cross-region load-balancing (Global Tier).

1. Select **IP address** for the **IP type**.

    > [!NOTE]
    > For more information on IP prefixes, see [Azure Public IP address prefix](../articles/virtual-network/ip-services/public-ip-address-prefix.md).
    
1. Select **Create new** in **Public IP address**.
1. In **Add a public IP address**, enter **lb-public-IP** for **Name**.
1. Select **Zone-redundant** in **Availability zone**.

    > [!NOTE]
    > In regions with [Availability Zones](/azure/reliability/availability-zones-overview?toc=%2Fazure%2Fvirtual-network%2Ftoc.json&tabs=azure-cli#availability-zones), you have the option to select no zone (default option), a specific zone, or zone-redundant. The choice will depend on your specific domain failure requirements. In regions without Availability Zones, this field won't appear. </br> For more information on availability zones, see [Availability zones overview](/azure/reliability/availability-zones-overview?tabs=azure-cli).

1. Select **OK**.
1. Select **Add**.
1. Select the **Next: Backend pools>** button at the bottom of the page.
1. In the **Backend pools** tab, select **+ Add a backend pool**.
1. Enter **lb-backend-pool** for **Name** in **Add backend pool**.
1. Select **lb-VNet** in **Virtual network**.
1. Select **IP Address** for **Backend Pool Configuration** and select **Save**.
1. Select the blue **Review + create** button at the bottom of the page.
1. Select **Create**.

    > [!NOTE]
    > In this example we created a NAT gateway to provide outbound Internet access. The outbound rules tab in the configuration is bypassed as it's optional and isn't needed with the NAT gateway. For more information on Azure NAT gateway, see [What is Azure Virtual Network NAT?](/azure/nat-gateway/nat-overview)
    > For more information about outbound connections in Azure, see [Source Network Address Translation (SNAT) for outbound connections](/azure/load-balancer/load-balancer-outbound-connections).