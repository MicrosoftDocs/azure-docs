---
title: Outbound-only load balancer configuration
titleSuffix: Azure Load Balancer
description: This article provides a step-by-step guide on how to configure an "egress only" setup using Azure Load Balancer with outbound NAT and Azure Bastion. Deploy public and internal load balancers to create outbound connectivity for VMs behind an internal load balancer.
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: how-to
ms.date: 02/26/2026
ms.author: mbender
ms.custom: template-how-to
# Customer intent: As an IT administrator, I want to configure an outbound-only load balancer using internal and public load balancers, so that I can enable secure outbound connectivity for virtual machines without allowing inbound public access.
---

# Outbound-only load balancer configuration

Use a combination of internal and external standard load balancers to create outbound connectivity for VMs behind an internal load balancer. 

This configuration provides outbound NAT for an internal load balancer scenario, producing an "egress only" setup for your backend pool.

> [!NOTE]
> **Azure NAT Gateway** is the recommended configuration for outbound connectivity in production deployments. NAT Gateway is available in two SKUs: **Standard** (zonal) and **StandardV2** (zone-redundant, with IPv6 support, 100 Gbps throughput, and flow logs). For more information about **NAT Gateway**, see **[What is Azure NAT Gateway?](../nat-gateway/nat-overview.md)**
>
> To deploy an outbound only load balancer configuration with Azure NAT Gateway, see [Tutorial: Integrate NAT gateway with an internal load balancer - Azure portal](../nat-gateway/tutorial-nat-gateway-load-balancer-internal-portal.md).
>
> For more information about outbound connections in Azure and default outbound access, see [Source Network Address Translation (SNAT) for outbound connections](load-balancer-outbound-connections.md) and [Default outbound access](../virtual-network/ip-services/default-outbound-access.md).

:::image type="content" source="./media/egress-only/load-balancer-egress-only.png" alt-text="Screenshot of an egress only load balancer configuration." border="true":::

*Figure: Egress only load balancer configuration*

> [!IMPORTANT]
> On March 31, 2026, new virtual networks default to using private subnets, and [default outbound access](../virtual-network/ip-services/default-outbound-access.md) is no longer provided. Use an explicit form of outbound connectivity, such as NAT Gateway. For more information, see the [official announcement](https://azure.microsoft.com/updates?id=default-outbound-access-for-vms-in-azure-will-be-retired-transition-to-a-new-method-of-internet-access).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

## Create a virtual network and bastion host

[!INCLUDE [load-balancer-create-no-gateway](../../includes/load-balancer-create-no-gateway.md)]

## Create internal load balancer

In this section, you create the internal load balancer.

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

1. In the **Load balancer** page, select **Create**.

1. In the **Basics** tab of the **Create load balancer** page, enter, or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Project details** |   |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **load-balancer-rg**. |
    | **Instance details** |   |
    | Name                   | Enter **lb-internal**                                   |
    | Region         | Select **(US) East US**.                                        |
    | SKU           | Leave the default **Standard**. |
    | Type          | Select **Internal**.                                        |
    

1. Select **Next: Frontend IP configuration** at the bottom of the page.

1. In **Frontend IP configuration**, select **+ Add a frontend IP configuration**.

1. Enter **lb-int-frontend** in **Name**.

1. Select **lb-vnet** in **Virtual Network**.

1. Select **backend-subnet** in **Subnet**.

1. Select **Dynamic** for **Assignment**.

1. Select **Zone-redundant** in **Availability zone**.

    > [!NOTE]
    > In regions with [Availability Zones](/azure/reliability/availability-zones-overview?toc=%2fazure%2fvirtual-network%2ftoc.json), you can select no-zone (default option), a specific zone, or zone-redundant. The choice depends on your specific domain failure requirements. In regions without Availability Zones, this field doesn't appear. For more information on availability zones, see [Availability zones overview](/azure/reliability/availability-zones-overview).

1. Select **Add**.

1. Select **Next: Backend pools** at the bottom of the page.

1. In the **Backend pools** tab, select **+ Add a backend pool**.

1. Enter **lb-int-backend-pool** for **Name** in **Add backend pool**.

1. Select **NIC** or **IP Address** for **Backend Pool Configuration**.

1. Select **Save**.

1. Select the blue **Review + create** button at the bottom of the page.

1. Select **Create**.

## Create public load balancer

In this section, you create the public load balancer.

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

1. In the **Load balancer** page, select **Create**.

1. In the **Basics** tab of the **Create load balancer** page, enter, or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Project details** |   |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **load-balancer-rg**. |
    | **Instance details** |   |
    | Name                   | Enter **lb-public**                                   |
    | Region         | Select **(US) East US**.                                        |
    | SKU           | Leave the default **Standard**. |
    | Type          | Select **Public**.                                        |
    | Tier          | Leave the default **Regional**. |

1. Select **Next: Frontend IP configuration** at the bottom of the page.

1. In **Frontend IP configuration**, select **+ Add a frontend IP**.

1. Enter **lb-ext-frontend** in **Name**.

1. Select **IPv4** or **IPv6** for the **IP version**.

    > [!NOTE]
    > IPv6 isn't currently supported with Routing Preference or Cross-region load-balancing (Global Tier).

1. Select **IP address** for the **IP type**.

    > [!NOTE]
    > For more information on IP prefixes, see [Azure Public IP address prefix](../virtual-network/ip-services/public-ip-address-prefix.md).

1. Select **Create new** in **Public IP address**.

1. In **Add a public IP address**, enter **lb-public-ip** for **Name**.

1. Select **Zone-redundant** in **Availability zone**.

    > [!NOTE]
    > In regions with [Availability Zones](/azure/reliability/availability-zones-overview?toc=%2fazure%2fvirtual-network%2ftoc.json), you can select no-zone (default option), a specific zone, or zone-redundant. The choice depends on your specific domain failure requirements. In regions without Availability Zones, this field doesn't appear. For more information on availability zones, see [Availability zones overview](/azure/reliability/availability-zones-overview).

1. Leave the default of **Microsoft Network** for **Routing preference**.

1. Select **OK**.

1. Select **Add**.

1. Select **Next: Backend pools** at the bottom of the page.

1. In the **Backend pools** tab, select **+ Add a backend pool**.

1. Enter **lb-pub-backend-pool** for **Name** in **Add backend pool**.

1. Select **lb-vnet** in **Virtual network**.

1. Select **NIC** or **IP Address** for **Backend Pool Configuration**.

1. Select **Save**.

1. Select the blue **Review + create** button at the bottom of the page.

1. Select **Create**.

## Create virtual machine

Create a virtual machine in this section. During creation, add it to the backend pool of the internal load balancer. After the virtual machine is created, add the virtual machine to the backend pool of the public load balancer.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. In **Virtual machines**, select **+ Create** > **Virtual machine**.
   
1. In **Create a virtual machine**, enter or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **load-balancer-rg** |
    | **Instance details** |  |
    | Virtual machine name | Enter **lb-VM** |
    | Region | Select **(US) East US** |
    | Availability Options | Select **No infrastructure redundancy required** |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2022 Datacenter: Azure Edition - Gen2** |
    | Azure Spot instance | Leave the default of unchecked. |
    | Size | Choose VM size or take default setting |
    | **Administrator account** |  |
    | Username | Enter a username |
    | Password | Enter a password |
    | Confirm password | Reenter password |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None** |

1. Select the **Networking** tab, or select **Next: Disks**, and then **Next: Networking**.
  
1. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | **lb-vnet** |
    | Subnet | **backend-subnet** |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**|
    | Configure network security group | Leave the default of **vm-NSG**. This value might be different if you choose a different name for your VM. |

1. Under **Load balancing**, select the following values:

    | Setting | Value |  
    |-|-|
    | Load-balancing options | Select **Azure load balancing** |
    | Select a load balancer | Select **lb-internal**  |
    | Select a backend pool | Select **lb-int-backend-pool** |
   
1. Select **Review + create**. 
  
1. Review the settings, and then select **Create**.

## Add VM to backend pool of public load balancer

In this section, you add the virtual machine you created previously to the backend pool of the public load balancer.

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

1. Select **lb-public**.

1. Select **Backend pools** in **Settings** in **lb-public**.

1. Select **lb-pub-backend-pool** under **Backend pool** in the **Backend pools** page.

1. In **lb-pub-backend-pool**, select **lb-vnet** in **Virtual network**.

1. In **Virtual machines**, select the blue **+ Add** button.

1. Select the box next to **lb-VM** in **Add virtual machines to backend pool**.

1. Select **Add**.

1. Select **Save**.

## Test connectivity before outbound rule

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **lb-VM**.

1. In the **Overview** page, select **Connect**, and then select **Bastion**.

1. Enter the username and password that you provided during VM creation.

1. Select **Connect**.

1. Open Microsoft Edge browser.

1.  Enter **https://ifconfig.me** in the address bar.

1.  The connection fails. By default, standard public load balancer [doesn't allow outbound traffic without a defined outbound rule](load-balancer-overview.md#securebydefault).
 
## Create a public load balancer outbound rule

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

1. Select **lb-public**.

1. Select **Outbound rules** in **Settings** in **lb-public**.

1. Select **+ Add** in **Outbound rules**.

1. Enter or select the following information to configure the outbound rule.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myOutboundRule**. |
    | Frontend IP address | Select **lb-ext-frontend**.|
    | Protocol | Leave the default of **All**. |
    | Idle timeout (minutes) | Move slider to **15 minutes**.|
    | TCP Reset | Select **Enabled**.|
    | Backend pool | Select **lb-pub-backend-pool**.|
    | **Port allocation** |  |
    | Port allocation | Select **Manually choose number of outbound ports**. |
    | **Outbound ports** |  |
    | Choose by | Select **Ports per instance**. |
    | Ports per instance | Enter **10000**.

1. Select **Add**.

## Test connectivity after outbound rule

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **lb-VM**.

1. On the **Overview** page, select **Connect**, and then select **Bastion**.

1. Enter the username and password that you provided during VM creation.

1. Select **Connect**.

1. Open Microsoft Edge browser.

1. Enter **https://ifconfig.me** in the address bar.

1. The connection succeeds.

1. The IP address displayed is the frontend IP address of **lb-public**.

## Clean up resources

When you no longer need the resources, delete the resource group, load balancers, VM, and all related resources. 

Select the resource group **load-balancer-rg** and then select **Delete**.

## Next steps

In this article, you created an "egress only" configuration by using a combination of public and internal load balancers.  

This configuration balances incoming internal traffic to your backend pool while preventing any public inbound connections.

For more information about Azure Load Balancer and Azure Bastion, see [What is Azure Load Balancer?](load-balancer-overview.md) and [What is Azure Bastion?](../bastion/bastion-overview.md)
