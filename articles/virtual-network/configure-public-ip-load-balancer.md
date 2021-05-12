---
title: Use a public IP address with a load balancer
titleSuffix: Azure Virtual Network
description: Learn about the ways a public IP address is used with an Azure Load Balancer and how to change the configuration.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to 
ms.date: 05/20/2021
ms.custom: template-how-to 
---

# Use a public IP address with a load balancer

Sometimes it's necessary within a deployment to update or change a public IP address associated with a resource. 

You'll learn how to change a public IP address assigned to an Azure Load Balancer. 

You'll learn how to delete an IP address after it's removed from the load balancer.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- A public SKU Azure Load Balancer deployed in your subscription. For more information, see [Quickstart: Create a public load balancer - Azure portal](./load-balancer/quickstart-load-balancer-standard-public-portal.md)

## Change or remove public IP address

In this section, you'll sign in to the Azure portal and change the IP address of the load balancer. 

An Azure Load Balancer must have an IP address associated with a frontend. 

To change the IP, we'll create a new IP address and associate it with the load balancer frontend.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Load balancer**.

3. In the search results, select **Load balancers**.

4. In **Load Balancers**, select **myLoadBalancer** or the load balancer you wish to change.

5. In settings of **myLoadBalancer**, select **Frontend IP configuration**.

6. In **Frontend IP configuration**, select **LoadBalancerFrontend** or your load balancer frontend.

7. In the load balancer frontend configuration, select **Create new** in **Public IP address**.

8. Enter **myNewPublicIP** in **Name** and select **OK**.

9. Select **Save**.

10. Verify the load balancer frontend displays the new IP address named **myNewPublicIP**.

    :::image type="content" source="./media/configure-public-ip-load-balancer/verify-new-ip.png" alt-text="Verify new public IP address in frontend configuration" border="true":::

## Delete public IP address

In this section, you'll delete the IP address you replaced in the previous section. Public IPs must be removed from resources before they can be deleted.

1. In the search box at the top of the portal, enter **Public IP**.

2. In the search results, select **Public IP addresses**.

3. In **Public IP addresses**, select **myPublicIP-lb** or your public IP address.

4. In the overview of **myPublicIP-lb**, select **Delete**.

5. Select **Yes** in **Delete public IP address**.

## Next steps

In this article, you learned how to create and associate a new public IP address with a load balancer. 

- For more information about Azure Load Balancer, see [What is Azure Load Balancer?](./load-balancer/overview.md)
- To learn more about public IP addresses in Azure, see [Public IP addresses](public-ip-addresses.md).
