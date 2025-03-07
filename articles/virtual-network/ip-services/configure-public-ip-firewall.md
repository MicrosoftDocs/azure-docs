---
title: Manage a public IP address by using Azure Firewall
titleSuffix: Azure Virtual Network
description: Learn about the ways a public IP address is used with Azure Firewall and how to change the configuration.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network
ms.subservice: ip-services
ms.topic: how-to 
ms.date: 01/07/2025
---

# Manage a public IP address by using Azure Firewall

In this article, you learn how to manage public IP addresses for Azure Firewall by using the Azure portal. You learn how to create an Azure Firewall by using an existing public IP in your subscription, change the IP configuration, and finally, add an IP configuration to the firewall. 

Azure Firewall is a cloud-based network security service that protects your Azure Virtual Network resources. Azure Firewall requires at least one public static IP address to be configured. This IP or set of IPs is the external connection point to the firewall. 

Azure Firewall supports Standard SKU public IP addresses. Basic SKU public IP address and public IP prefixes aren't supported.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- Three Standard SKU public IP addresses that aren't associated with any resources. For more information on creating a Standard SKU public IP address, see [Quickstart: Create a public IP address by using the Azure portal](./create-public-ip-portal.md).
    - For the purposes of the examples in this article, create three new public IP addresses: **myStandardPublicIP-1**, **myStandardPublicIP-2**, and **myStandardPublicIP-3**.

## Create an Azure firewall with an existing public IP

In this section, you create an Azure firewall. Use the first IP address you created in the prerequisites as the public IP for the firewall.

1. In the [Azure portal](https://portal.azure.com/), search for and select *Firewalls*.

2. On the **Azure Firewalls** page, select **+ Create**. 

3. In **Create firewall**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Create a new resource group named **myResourceGroupFW**. |
    | **Instance details** |   |
    | Name | Enter **myFirewall**. |
    | Region | Select **West US 2**. |
    | Availability zone | Leave the default of **None**. |
    | Firewall SKU  | Select **Standard**. |
    | Firewall management | Leave the default of **Use a Firewall Policy to manage this firewall**.|
    | Firewall policy | Create a new firewall policy named **myFirewallPolicy** in **West US 2**, and set the **Policy tier** to **Standard**. |
    | Choose a virtual network | Leave default of **Create new**. |
    | Virtual network name | Enter **myVNet**. |
    | Address space | Enter **10.0.0.0/16**. |
    | Subnet address space | Enter **10.0.0.0/26**. |
    | Public IP address | Select **myStandardPublicIP-1** or your public IP. |
    | **Firewall Management NIC** |   |
    | Enable Firewall Management NIC | Uncheck the box. |

4. Select **Review + create**.

5. Select **Create**.

The following image shows the **Create firewall** page with the example information.

## Change the public IP address for a firewall

In this section, you change the public IP address associated with the firewall. A firewall must have at least one public IP address associated with its configuration. You can't update the IP address if the firewall's existing IP has any destination network address translation (DNAT) rules associated with it.

1. In the Azure portal, search for and select *Firewalls*.

2. On the **Firewalls** page, select **myFirewall**.

3. On the **myFirewall** page, go to **Settings**, and then select **Public IP configuration**. 

4. In **Public IP configuration**, select **myStandardPublicIP-1**.

5. In the **Edit public IP configuration** window, select **myStandardPublicIP-2** from the dropdown.
6. Select **Save**.

## Add a public IP configuration to a firewall

In this section, you add a public IP configuration to Azure Firewall. For more information about multiple IPs, see [Multiple public IP addresses](../../firewall/features.md#multiple-public-ip-addresses). 

1. In the Azure portal, search for and select *Firewalls*.

2. On the **Firewalls** page, select **myFirewall**.

3. On the **myFirewall** page, go to **Settings**, and then select **Public IP configuration**.

4. Select **Add a public IP configuration**.

5. In the **Add a public IP configuration** window, enter the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Name** | Enter **myNewPublicIPconfig**. |
    | **Public IP address** | Select **myStandardPublicIP-3**. |

6. Select **Add**.

## Advanced configuration

This example is a simple deployment of Azure Firewall. For advanced configuration and setup, see [Tutorial: Deploy and configure Azure Firewall and policy by using the Azure portal](../../firewall/tutorial-firewall-deploy-portal-policy.md). When associated with multiple public IPs, Azure Firewall randomly selects the first source Public IP for outbound connectivity and only uses the next available Public IP after no more connections can be made from the current public IP due to SNAT port exhaustion. You can associate a [network address translation (NAT) gateway](/azure/nat-gateway/nat-overview) to a Firewall subnet to extend the scalability of source network address translation (SNAT). With this configuration, all outbound traffic uses the public IP address or addresses of the NAT gateway. For more information, see [Scale SNAT ports with Azure Virtual Network NAT](../../firewall/integrate-with-nat-gateway.md).

> [!NOTE]
> It's recommended to instead use [NAT Gateway](../../nat-gateway/nat-overview.md) to provide dynamic scalability of your outbound connectivity.
> Protocols other than Transmission Control Protocol (TCP) and User Datagram Protocol (UDP) in network filter rules are unsupported for SNAT to the public IP of the firewall. 
> You can integrate an Azure firewall with the Standard SKU load balancer to protect backend pool resources. If you associate the firewall with a public load balancer, configure ingress traffic to be directed to the firewall public IP address. Configure egress via a user-defined route to the firewall public IP address. For more information and setup instructions, see [Integrate Azure Firewall with Azure Standard Load Balancer](../../firewall/integrate-lb.md). 

## Next steps

In this article, you learned how to create an Azure firewall and use an existing public IP. You changed the public IP of the default IP configuration. Finally, you added a public IP configuration to the firewall.

- To learn more about public IP addresses in Azure, see [Public IP addresses](./public-ip-addresses.md).
- To learn more about Azure Firewall, see [What is Azure Firewall?](../../firewall/overview.md)
