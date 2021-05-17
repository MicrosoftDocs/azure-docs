---
title: Use a public IP address with a Azure Application Gateway
titleSuffix: Azure Virtual Network
description: Learn about the ways a public IP address is used with an Azure Application Gateway and how to change the configuration.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to 
ms.date: 05/13/2021
ms.custom: template-how-to 
---

# Use a public IP address with a Azure Application Gateway

A public IP address in Azure is available in standard and basic SKUs. The selection of SKU determines the features of the IP address. The SKU determines the resources that the IP address can be associated with. 

Azure Application Gateway is a web traffic load balancer that enables you to manage traffic to your web applications. Application Gateway can make routing decisions based on additional attributes of an HTTP request, for example URI path or host headers. Application Gateway supports standard SKU public IP addresses. Basic public IPs and public IP prefixes aren't supported.

Examples of resources that support standard SKU public IPs exclusively:

* Cross-region load balancer
* Azure Bastion
* NAT gateway

Application Gateway requires a public IP address for it's configuration. A public IP address is used for the frontend of the Application Gateway. The frontend is the connection point for the applications behind the Application Gateway. A Application Gateway frontend can be a private IP address, public IP address, or both.

In this article, you'll learn how to create a Application Gateway using an existing public IP in your subscription. 

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- Two standard SKU public IP addresses in your subscription. The IP addresses can't be associated with any resources. For more information on creating a standard SKU public IP address, see [Create a public IP - Azure portal](create-public-ip-portal.md).
    - For the purposes of the examples in this article, name the new public IP addresses **myStandardPublicIP-1** and **myStandardPublicIP-2**.

## Create Application Gateway existing public IP

In this section, you'll create a Application Gateway resource. You'll select the IP address you created in the prerequisites as the public IP for the Application Gateway.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Application gateway**.

3. In the search results, select **Application gateways**.

4. Select **+ Create**.

5. In **Create application gateway**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **myResourceGroupAppGW**. </br> Select **OK**. </br> Alternatively, select your resource group. |
    | **Instance details** |   |
    | Application gateway name | Enter **myAppGateway**. |
    | Region | Select **(US) West US 2**. |
    | Tier | Leave the default of **Standard V2**. |
    | Enable autoscaling | Leave the default of **Yes**. |
    | Minium instance count | Leave the default of **0**. |
    | Maximum instance count | Leave the default of **10**. |
    | Availability zone | Leave the default of **None**. |
    | HTTP2 | Leave the default of **Disabled**. |
    | Virtual network | Select **Create new**. </br> In **Create virtual network**, enter **myVNet** for name. </br> Leave the default address space in **ADDRESS SPACE**. </br> In **SUBNETS**, change **default** to **myAGSubnet**. </br> In the second subnet name, enter **myBackendSubnet**. </br> In **Address range**, enter a range within the default address space. </br> Select **OK**. |

6. Select **Next: Frontends**.

7. Select **myStandardPublicIP-1** for **Public IP address** in the **Frontends** tab, or your public IP address.

8. Select **Next: Backends**. 

9. Select **Add a backend pool**.

10. Enter **myBackendPool** for name in **Add a backend pool**.

11. Select **Next: Configuration**.

12. Select **+ Add a routing rule**. Enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Rule name | Enter **myRoutingRule**. |
    | **Listener** |    |
    | Listener name | Enter **myListener**. |
    | Frontend IP | Select **Public**. |
    | Frontend IP Protocol | Leave the default of **HTTP**. |
    | Port | Leave the default of **80**. |
    | **Additional settings** |   |
    | Listener type | Leave the default of **Basic**. |
    | Error page url | Leave the default of **No**. |
    | **Backend targets** |    |
    | Target type | Leave the default of **Backend pool**. |
    | Backend target | Select **myBackendPool**. |
    | HTTP settings | Select **Add new**. </br> Enter **myHTTPsetting** in **Name**. </br> Leave the rest at the defaults and select **Add**. |

13. Select **Add**.

14. Select **Next: Tags**, then **Next: Review + create**.

15. Select **Create**.

> [!NOTE]
> This is a simple deployment of a Application Gateway. For advanced configuration and setup, see [Quickstart: Direct web traffic with Azure Application Gateway - Azure portal](../application-gateway/quick-create-portal.md)
>
> For more information on Azure Application Gateway, see [What is Azure Application Gateway?](../application-gateway/overview.md)

## Change or remove public IP address

Application gateway doesn't support changing the public IP address after creation.

## Next steps

In this article, you learned how to create a Application Gateway and use an existing public IP. 

- For more information about Azure Virtual Network NAT, see [What is Azure Virtual Network NAT?](nat-overview.md)
- To learn more about public IP addresses in Azure, see [Public IP addresses](public-ip-addresses.md).
