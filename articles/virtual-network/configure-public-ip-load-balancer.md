---
title: Use a public IP address with a load balancer
titleSuffix: Azure Virtual Network
description: Learn about the ways a public IP address is used with an Azure Load Balancer and how to change the configuration.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to 
ms.date: 05/12/2021
ms.custom: template-how-to 
---

# Use a public IP address with a load balancer

A public IP address in Azure is available in standard and basic SKUs. The selection of SKU determines the features of the IP address. The SKU determines the resources that the IP address can be associated with. 

A basic SKU Azure Load Balancer supports the basic IP address SKU and is limited in availability options and feature sets. A standard SKU load balancer and IP address combination is the recommended deployment for production workloads. Standard SKU IP addresses support availability zones in supported regions. 

Examples of resources that support standard SKU public IPs exclusively:

* NAT gateway
* Cross-region load balancer
* Azure Bastion

Load balancer requires either a private or public IP address for the frontend configuration. The frontend of the load balancer is the connection point for clients internally and externally depending on the type of public IP address used. 

Standard load balancer and public IP support outbound rules for Source Network Address Translation (SNAT) of outbound connections from the backend pool of the load balancer. Public IP prefixes extend the scalability of SNAT by allowing multiple IP addresses for outbound connections. 

Examples of resources that support public IP prefixes:

* NAT gateway
* Azure Load Balancer

Cross-region load balancers support the global tier option of standard SKU public IP addresses. The global tier public IP is used by the cross-region load balancer to advertise a frontend IP address of a load balancer to multiple Azure regions.

Sometimes it's necessary within a deployment to update or change a public IP address associated with a resource. In this article, you'll learn how to create a load balancer with an existing public IP address in your subscription. You'll learn how to change the current public IP associated to a load balancer. Finally, you'll change the frontend configuration of an outbound backend pool to a public IP prefix.

Standard SKU load balancer and public IP are used for the examples in this article. For basic SKU load balancers, the procedures are the same except for the selection of SKU upon creation of the load balancer and public IP resource.

Basic load balancers don't support outbound rules or public IP prefixes.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- Two standard SKU public IP addresses in your subscription. The IP addresses can't be associated with any resources. For more information on creating a standard SKU public IP address, see [Create a public IP - Azure portal](create-public-ip-portal.md).
    - For the purposes of the examples in this article, name the new public IP addresses **myStandardPublicIP-1** and **myStandardPublicIP-2**.
- A public IP prefix in your subscription. For more information on creating a public IP prefix, see [Create a public IP address prefix using the Azure portal](create-public-ip-prefix-portal.md).
    - For the purposes of the example in this article, name the new public IP prefix **myPublicIPPrefixOutbound**.

## Create load balancer existing public IP

In this section, you'll create a standard SKU load balancer. You'll select the IP address you created in the prerequisites as the frontend IP of the load balancer.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**.

3. In the search results, select **Load balancers**.

4. Select **+ Create**.

5. In **Create Load balancer**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **myResourceGroupIP**. </br> Select **OK**. </br> Alternatively, select your resource group. |
    | **Instance details** |   |
    | Name | Enter **myLoadBalancer**. |
    | Region | Select **(US) West US 2**. |
    | Type | Leave the default of **Public**. |
    | SKU | Leave the default of **Standard**. |
    | Tier | Leave the default of **Regional**. |
    | **Public IP address** |   |
    | Public IP address | Select **Use existing**. |
    | Choose public IP address | Select **myStandardPublicIP-1**. </br> Alternatively, select your public IP address. |
    | Add a public IPv6 address | Leave the default of **No**. |

6. Select the **Review + create** tab, or select the blue **Review + create** button. 

7. Select **Create**.

> [!NOTE]
> This is a simple deployment of a load balancer. For advanced configuration and setup, see [Quickstart: Create a public load balancer to load balance VMs using the Azure portal](../load-balancer/quickstart-load-balancer-standard-public-portal.md)
>
> For more information on Azure Load Balancer, see [What is Azure Load Balancer?](../load-balancer/load-balancer-overview.md)

## Change or remove public IP address

In this section, you'll sign in to the Azure portal and change the IP address of the load balancer. 

An Azure Load Balancer must have an IP address associated with a frontend. 

To change the IP, you'll associate a new public IP address previously created with the load balancer frontend.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**.

3. In the search results, select **Load balancers**.

4. In **Load Balancers**, select **myLoadBalancer** or the load balancer you wish to change.

5. In settings of **myLoadBalancer**, select **Frontend IP configuration**.

6. In **Frontend IP configuration**, select **LoadBalancerFrontend** or your load balancer frontend.

7. In the load balancer frontend configuration, select **myStandardPublicIP-2** in **Public IP address**.  Alternatively, select your public IP address.

8. Select **Save**.

9. Verify the load balancer frontend displays the new IP address named **myStandardPublicIP-2**.

    > [!NOTE]
    > These procedures are valid for a cross-region load balancer. For more information on cross-region load balancer, see **[Cross-region load balancer](../load-balancer/cross-region-overview.md)**.


## Add public IP prefix

In this section, you'll change the frontend configuration used for outbound connections to use a public IP prefix.

> [!IMPORTANT]
> To complete this section, you must have a load balancer with an outbound frontend configuration and outbound rules deployed. For more information on creating a load balancer outbound configuration, see **[Create outbound rule configuration](../load-balancer/quickstart-load-balancer-standard-public-portal.md?tabs=option-1-create-load-balancer-standard#create-outbound-rule-configuration)**.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**.

3. In the search results, select **Load balancers**.

4. In **Load Balancers**, select **myLoadBalancer** or the load balancer you wish to change.

5. In settings of **myLoadBalancer**, select **Frontend IP configuration**.

6. In **Frontend IP configuration**, select **LoadBalancerFrontendOutbound** or your load balancer outbound frontend.

7. For **IP type**, select **Public IP prefix**.

8. In **Public IP prefix**, select the public IP prefix you created previously **myPublicIPPrefixOutbound**.

9. Select **Save**.

10. In **Frontend IP configuration**, confirm the IP prefix was added to the outbound frontend configuration.

## Delete public IP address

In this section, you'll delete the IP address you replaced in the previous section. Public IPs must be removed from resources before they can be deleted.

1. In the search box at the top of the portal, enter **Public IP**.

2. In the search results, select **Public IP addresses**.

3. In **Public IP addresses**, select **myPublicIP** or your public IP address you want to remove.

4. In the overview of **myPublic**, select **Delete**.

5. Select **Yes** in **Delete public IP address**.

## Next steps

In this article, you learned how to create a load balancer and use an existing public IP. You replaced the IP address in a load balancer frontend configuration. Finally, you changed an outbound frontend configuration to use a public IP prefix and learned how to clean up an IP address no longer needed.

- For more information about Azure Load Balancer, see [What is Azure Load Balancer?](../load-balancer/load-balancer-overview.md)
- To learn more about public IP addresses in Azure, see [Public IP addresses](public-ip-addresses.md).
