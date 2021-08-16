---
title: Manage a public IP address with Azure Firewall
titleSuffix: Azure Virtual Network
description: Learn about the ways a public IP address is used with Azure Firewall and how to change the configuration.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to 
ms.date: 06/28/2021
ms.custom: template-how-to 
---

# Manage a public IP address with Azure Firewall

Azure Firewall is a cloud-based network security service that protects your Azure Virtual Network resources. Azure Firewall requires at least one public static IP address to be configured. This IP or set of IPs are used as the external connection point to the firewall. Azure Firewall supports standard SKU public IP addresses. Basic SKU public IP address and public IP prefixes aren't supported. 

In this article, you'll learn how to create an Azure Firewall using an existing public IP in your subscription. You'll change the IP configuration of the firewall. Finally, you'll add an IP configuration to the firewall.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- Three standard SKU public IP addresses in your subscription. The IP address can't be associated with any resources. For more information on creating a standard SKU public IP address, see [Create a public IP - Azure portal](create-public-ip-portal.md).
    - For the purposes of the examples in this article, name the new public IP addresses **myStandardPublicIP-1**, **myStandardPublicIP-2**, and **myStandardPublicIP-3**.

## Create Azure Firewall existing public IP

In this section, you'll create an Azure Firewall. You'll select the IP address you created in the prerequisites as the public IP for the firewall.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Firewall**.

3. In the search results, select **Firewalls**.

4. Select **+ Create**.

5. In **Create firewall**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **myResourceGroupFW**. </br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myFirewall**. |
    | Region | Select **West US 2**. |
    | Availability zone | Leave the default of **None**. |
    | Firewall tier  | Leave the default of **Standard**. |
    | Firewall management | Leave the default of **Use a Firewall Policy to manage this firewall**.|
    | Firewall policy | Select **Add new**. </br> Enter **myFirewallPolicy** in **Policy name**. </br> In **Region** select **West US 2**. </br> Select **Yes**. |
    | Virtual network name | Enter **myVNet**. |
    | Address space | Enter **10.0.0.0/16**. |
    | Subnet address space | Enter **10.0.0.0/26**. |
    | Public IP address | Select **myStandardPublicIP-1** or your public IP. |
    | Forced tunneling | Leave the default of **Disabled**. |
    
 
6. Select the **Review + create** tab, or select the blue **Review + create** button.

7. Select **Create**.

> [!NOTE]
> This is a simple deployment of Azure Firewall. For advanced configuration and setup, see [Tutorial: Deploy and configure Azure Firewall and policy using the Azure portal](../firewall/tutorial-firewall-deploy-portal-policy.md).
>
> For more information on Azure Firewall, see [What is Azure Firewall?](../firewall/overview.md).

## Change public IP address

In this section, you'll change the public IP address associated with the firewall. A firewall must have at least one public IP address associated with its configuration. 

1. In the search box at the top of the portal, enter **Firewall**.

2. In the search results, select **Firewalls**.

3. Select **myFirewall** in **Firewalls**.

4. Select **Public IP configuration** in **Settings** in **myFirewall**.

5. In **Public IP configuration**, select **myStandardPublicIP-1** or your IP address.

6. Select **myStandardPublicIP-2** in **Public IP address** of **Edit public IP configuration**.

7. Select **Save**.

## Add public IP configuration

In this section, you'll add a public IP configuration to the Azure Firewall. For more information on multiple IPs, see [Multiple public IP addresses](../firewall/features.md#multiple-public-ip-addresses).  

1. In the search box at the top of the portal, enter **Firewall**.

2. In the search results, select **Firewalls**.

3. Select **myFirewall** in **Firewalls**.

4. Select **Public IP configuration** in **Settings** in **myFirewall**.

5. Select **+ Add public IP configuration**.

6. Enter **myNewPublicIPconfig** in **Name**.

7. Select **myStandardPublicIP-3** in **Public IP address**.

8. Select **Add**.

## More information

* An Azure Firewall can be integrated with a standard SKU load balancer to protect backend pool resources.  If you associate the firewall with a public load balancer, configure ingress traffic to be directed to the firewall public IP address. Configure egress via a user-defined route to the firewall public IP address.  For more information and setup instructions, see [Integrate Azure Firewall with Azure Standard Load Balancer](../firewall/integrate-lb.md). 

* An Azure Firewall can also be associated with a NAT gateway to extend the extensibility of Source Network Address Translation (SNAT). A NAT gateway avoids configurations to permit traffic from a large number of public IPs associated with the firewall. With this configuration, all inbound traffic will use the public IP address or addresses of the NAT gateway. Traffic egresses through the Azure Firewall public IP address or addresses.  For more information, see [Scale SNAT ports with Azure NAT Gateway](../firewall/integrate-with-nat-gateway.md).

## Caveats

* Azure firewall uses standard SKU load balancer. Protocols other than TCP and UDP in network filter rules are unsupported for SNAT to the public IP of the firewall. 
## Next steps

In this article, you learned how to create an Azure Firewall and use an existing public IP. You changed the public IP of the default IP configuration. Finally, you added a public IP configuration to the firewall.

- To learn more about public IP addresses in Azure, see [Public IP addresses](public-ip-addresses.md).
- To learn more about Azure Firewall, see [What is Azure Firewall?](../firewall/overview.md).
