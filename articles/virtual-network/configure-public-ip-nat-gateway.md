---
title: Use a public IP address with a NAT gateway
titleSuffix: Azure Virtual Network
description: Learn about the ways a public IP address is used with an Azure Virtual Network NAT gateway and how to change the configuration.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to 
ms.date: 05/13/2021
ms.custom: template-how-to 
---

# Use a public IP address with a NAT gateway

A public IP address in Azure is available in standard and basic SKUs. The selection of SKU determines the features of the IP address. The SKU determines the resources that the IP address can be associated with. 

Azure Virtual Network NAT is deployed to enable scalable outbound connectivity in a virtual network. Azure Virtual Network NAT supports standard SKU public IP addresses and public IP prefixes.  Resources deployed in a virtual network, such as load balancers, must also be the standard SKU. Deployment of a NAT gateway to a virtual network with basic SKU resources is unsupported.

Examples of resources that support standard SKU public IPs exclusively:

* Cross-region load balancer
* Azure Bastion

A NAT gateway requires a public IP address or public IP prefix for it's configuration. A combination of public IP and prefix is also supported.

The addition of IP addresses or an IP prefix scales the Source Network Address Translation (SNAT) connections from resources using the NAT gateway.

Examples of resources that support public IP prefixes:

* NAT gateway
* Azure Load Balancer

Sometimes it's necessary within a deployment to update or change a public IP address associated with a resource. In this article, you'll learn how to create a NAT gateway using an existing public IP in your subscription. You'll learn how to change the current public IP associated to a NAT gateway. Finally, you'll change the NAT gateway configuration from a single IP to an IP prefix.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- Two standard SKU public IP addresses in your subscription. The IP addresses can't be associated with any resources. For more information on creating a standard SKU public IP address, see [Create a public IP - Azure portal](create-public-ip-portal.md).
    - For the purposes of the examples in this article, name the new public IP addresses **myStandardPublicIP-1** and **myStandardPublicIP-2**.
- A public IP prefix in your subscription. For more information on creating a public IP prefix, see [Create a public IP address prefix using the Azure portal](create-public-ip-prefix-portal.md).
    - For the purposes of the example in this article, name the new public IP prefix **myPublicIPPrefixNAT**.

## Create NAT gateway existing public IP

In this section, you'll create a NAT gateway resource. You'll select the IP address you created in the prerequisites as the public IP for the NAT gateway.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **NAT gateway**.

3. In the search results, select **NAT gateways**.

4. Select **+ Create**.

5. In **Create network address translation (NAT) gateway**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **myResourceGroupNAT**. </br> Select **OK**. </br> Alternatively, select your resource group. |
    | **Instance details** |   |
    | Name | Enter **myNATgateway**. |
    | Region | Select **(US) West US 2**. |
    | Availability zone | Leave the default of **None**. |
    | Idle timeout | Leave the default of **4**. |

6. Select the **Outbound IP** tab, or select **Next: Outbound IP**.

7. Select **myStandardPublicIP-1** for **Public IP address** in the **Outbound IP** tab.

6. Select the **Review + create** tab, or select the blue **Review + create** button. 

7. Select **Create**.

> [!NOTE]
> This is a simple deployment of a NAT gateway. For advanced configuration and setup, see [Tutorial: Create a NAT gateway using the Azure portal](tutorial-create-nat-gateway-portal.md)
>
> For more information on Azure Virtual Network NAT, see [What is Azure Virtual Network NAT?](nat-overview.md)

## Change or remove public IP address

In this section, you'll sign in to the Azure portal and change the IP address of the NAT gateway. 

To change the IP, you'll associate a new public IP address previously with the NAT gateway.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **NAT gateway**.

3. In the search results, select **NAT gateways**.

4. In **NAT gateways**, select **myNATgateway** or the NAT gateway you wish to change.

5. In settings of **myNATgateway**, select **Outbound IP**.

6. Select **Change** next to **Public IP addresses** in **Outbound IP**.

7. You can choose to replace the current IP address or add the existing address. In **Manage public IP addresses and prefixes** next to **Public IP addresses**, select **myStandardPublicIP-2**.

8. Select **OK**.

9. Verify **myStandardPublicIP-2** was added to the public IP addresses. You can delete the IP address already assigned by selecting the trash can if needed.

10. Select **Save**.

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
