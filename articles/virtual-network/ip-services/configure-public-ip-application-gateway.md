---
title: Manage a public IP address with an Azure Application Gateway
titleSuffix: Azure Virtual Network
description: Learn about the ways a public IP address is used with an Azure Application Gateway and how to change and manage the configuration.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network
ms.subservice: ip-services
ms.topic: how-to 
ms.date: 01/07/2025
ms.custom: template-how-to 
---

# Manage a public IP address with an Azure Application Gateway

Azure Application Gateway is a web traffic load balancer that manages traffic to your web applications. Application Gateway makes routing decisions based on attributes of an HTTP request. Examples of attributes such as URI path or host headers. The frontend of an Application Gateway is the connection point for the applications in its backend pool. 

An Application Gateway frontend can be a private IP address, public IP address, or both. The V1 SKU of Application Gateway supports basic dynamic public IPs. The V2 SKU supports standard SKU public IPs that are static only. Application Gateway V2 SKU doesn't support an internal IP address as it's only frontend. For more information, see [Application Gateway frontend IP address configuration](../../application-gateway/configuration-frontend-ip.md). 

In this article, you learn how to create an Application Gateway using an existing public IP in your subscription. 

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- Two standard SKU public IP addresses in your subscription. The IP addresses can't be associated with any resources. For more information on creating a standard SKU public IP address, see [Create a public IP - Azure portal](./create-public-ip-portal.md).
    - For the purposes of the examples in this article, name the new public IP addresses **myStandardPublicIP-1** and **myStandardPublicIP-2**.

## Create Application Gateway existing public IP

In this section, you create an Application Gateway resource. You select the IP address you created in the prerequisites as the public IP for the Application Gateway.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Application gateway**.

3. In the search results, select **Application gateways**.

4. Select **+ Create**.

5. In **Create application gateway**, enter or select the following information.

    | **Setting** | **Value** |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**.</br>Enter **myResourceGroupAppGW**.</br>Select **OK**. |
    | **Instance details** |   |
    | Application gateway name | Enter **myAppGateway**. |
    | Region | Select **(US) West US 2**. |
    | Tier | Leave the default of **Standard V2**. |
    | Enable autoscaling | Leave the default of **Yes**. |
    | Minimum instance count | Leave the default of **0**. |
    | Maximum instance count | Leave the default of **10**. |
    | Availability zone | Leave the default of **Zones 1,2,3**. |
    | IP address type | Select **IPv4 only**. |
    | HTTP2 | Leave the default of **Enabled**. |
    | **Configure virtual network** |   |
    | Virtual network | Select **Create new**.</br>In **Create virtual network**, enter **myVNet** for name.</br>Leave the default address space in **ADDRESS SPACE**.</br>In **SUBNETS**, change **default** to **myAGSubnet**.</br>Select **OK**.|

6. Select **Next: Frontends**.

7. Select **myStandardPublicIP-1** for **Public IP address** in the **Frontends** tab, or your public IP address.

8. Select **Next: Backends**. 

9. Select **Add a backend pool**.

10. Enter **myBackendPool** for name in **Add a backend pool** and select **Add**.

11. Select **Next: Configuration**.

12. Select **+ Add a routing rule**. Enter or select the following information.

    | **Setting** | **Value** |
    | ------- | ----- |
    | Rule name | Enter **myRoutingRule**. |
    | Priority | Enter **1**. |
    | **Listener** tab |    |
    | Listener name | Enter **myListener**. |
    | Frontend IP | Select **Public IPv4**. |
    | Protocol | Leave the default of **HTTP**. |
    | Port | Leave the default of **80**. |
    | Listener type | Leave the default of **Basic**. |
    | **Custom errors pages** |   |
    | Bad Gateway - 502 | Leave empty. |
    | Forbidden - 403 | Leave empty. |    
    | **Backend targets** tab |    |
    | Target type | Leave the default of **Backend pool**. |
    | Backend target | Select **myBackendPool**. |
    | HTTP settings | Select **Add new**.</br>Enter **myHTTPsetting** in **Name**.</br>Leave the other settings at the defaults.</br>Select **Add**.|

13. Select **Add**.

14. Select **Next: Tags**, then **Next: Review + create**.

15. Select **Create**.

> [!NOTE]
> This is a simple deployment of an Application Gateway. For advanced configuration and setup, see [Quickstart: Direct web traffic with Azure Application Gateway - Azure portal](../../application-gateway/quick-create-portal.md)
>
> For more information on Azure Application Gateway, see [What is Azure Application Gateway?](../../application-gateway/overview.md)

## Change or remove public IP address

Application gateway doesn't support changing the public IP address after creation.

> [!NOTE]
> If a dynamic Basic IP is associated with an Application Gateway frontend, it only changes when the gateway is stopped or started. The DNS name associated with an Application Gateway frontend doesn't change. 

## Next steps

In this article, you learned how to create an Application Gateway and use an existing public IP. 

- For more information about Azure Virtual Network NAT, see [What is Azure Virtual Network NAT?](../nat-gateway/nat-overview.md).
- To learn more about public IP addresses in Azure, see [Public IP addresses](./public-ip-addresses.md).
