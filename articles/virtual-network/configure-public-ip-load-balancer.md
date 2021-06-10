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

A public Azure Load Balancer is a lightweight Layer 4 solution for distributing TCP and UDP traffic to a backend pool. There are basic and standard SKUs for the load balancer. These SKUs correspond to the basic and standard SKU public IP address types. 

A public IP associated with a load balancer serves as an Internet-facing frontend IP configuration. This frontend is used by customers to access the components in the backend pool, or for members of the backend pool to egress to the Internet. 

A basic SKU Azure Load Balancer is limited in availability options and feature sets. A standard SKU load balancer and IP address combination is the recommended deployment for production workloads. Standard SKU IP addresses support availability zones in supported regions. 

In this article, you'll learn how to create a load balancer with an existing public IP address in your subscription. 

You'll learn how to change the current public IP associated to a load balancer. 

You'll learn how to change the frontend configuration of an outbound backend pool to a public IP prefix.  

Finally, the article reviews some unique aspects of utilizing public IPs and public IP prefixes with a load balancer. 

> [!NOTE]
> Standard SKU load balancer and public IP are used for the examples in this article. For basic SKU load balancers, the procedures are the same except for the selection of SKU upon creation of the load balancer and public IP resource. Basic load balancers don't support outbound rules or public IP prefixes. 

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

An Azure Load Balancer must have an IP address associated with a frontend. A separate public IP address can be utilized as a frontend for ingress and egress traffic. 

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

Standard load balancer supports outbound rules for Source Network Address Translation (SNAT) of outbound connections from the backend pool of the load balancer. Public IP prefixes extend the scalability of SNAT by allowing multiple IP addresses for outbound connections. 

Multiple IPs avoid SNAT port exhaustion. Each Frontend IP provides 64,000 ephemeral ports that the load balancer can use.  See [Outbound Rules](../load-balancer/outbound-rules.md) for more information. 

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

## More information

* Cross-region load balancers are a special type of standard public load balancer that can span multiple regions. The frontend of a cross-region load balancer can only be used with the global tier option of standard SKU public IPs.  Traffic sent to the frontend IP of a cross-region load balancer is distributed across the regional standard public load balancer frontend IPs. The regional frontend IPs comprise the backend pool of the cross-region load balancer. See Cross-Region Load Balancer for more information. 

* By default, a public load balancer will not allow you to utilize multiple load balancing rules with the same backend port.  If this is required for a particular scenario, then the Floating IP option must be enabled for a load balancing rule.  This setting overwrites the destination IP address of the traffic sent to the backend pool—without Floating IP enabled the destination will be the backend pool private IP; with Floating IP enabled the destination IP will be the load balancer Frontend public IP.  The backend instance would need to have this public IP configured in its network stack to correctly receive this traffic (by using a loopback interface with the Frontend IP address in the instance).  See Floating IP for more information. 

* With a load balancer setup, members of backend pool can often also be assigned instance-level public IPs.  If this architecture is utilized, please note that sending traffic directly to these IPs bypasses the load balancer. 

* Both Standard public load balancers and public IP addresses can have a TCP timeout value assigned for how long to keep a connection open before hearing keepalives.  If a public IP is assigned as a load balancer Frontend, the timeout value on the IP takes precedence.  Note this setting applies to inbound connections to the load balancer only.  See Load Balancer TCP Reset for more information. 

## Caveats

* Standard public load balancers can use IPv6 addresses as their Frontend public IPs or public IP Prefixes.  Note that every deployment must be dual-stack (with both IPv4 and IPv6 Frontends) and no NAT64 translation is available.  See IPv6 on Standard Load Balancer for more information. 

* When multiple frontends are assigned to a public load balancer, please note that there is no method to assign flows from particular backend instances to egress on a specific IP.  Please see Multiple Frontends for more information. 
## Next steps

In this article, you learned how to create a load balancer and use an existing public IP. You replaced the IP address in a load balancer frontend configuration. Finally, you changed an outbound frontend configuration to use a public IP prefix and learned how to clean up an IP address no longer needed.

- For more information about Azure Load Balancer, see [What is Azure Load Balancer?](../load-balancer/load-balancer-overview.md)
- To learn more about public IP addresses in Azure, see [Public IP addresses](public-ip-addresses.md).
