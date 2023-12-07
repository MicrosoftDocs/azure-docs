---
title: Outbound-only load balancer configuration
titleSuffix: Azure Load Balancer
description: This article provides a step-by-step guide on how to configure an "egress only" setup using Azure Load Balancer with outbound NAT and Azure Bastion. Deploy public and internal load balancers to create outbound connectivity for VMs behind an internal load balancer.
author: mbender-ms
ms.service: load-balancer
ms.topic: how-to
ms.date: 10/24/2023
ms.author: mbender
ms.custom: template-how-to, seodec18
---

# Outbound-only load balancer configuration

Use a combination of internal and external standard load balancers to create outbound connectivity for VMs behind an internal load balancer. 

This configuration provides outbound NAT for an internal load balancer scenario, producing an "egress only" setup for your backend pool.

> [!NOTE]
> **Azure Virtual Network NAT** is the recommended configuration for outbound connectivity in production deployments. For more information about **Virtual Network NAT** and the **NAT gateway** resource, see **[What is Azure Virtual Network NAT?](../virtual-network/nat-gateway/nat-overview.md)**.
>
> To deploy an outbound only load balancer configuration with Azure Virtual Network NAT and a NAT gateway, see [Tutorial: Integrate NAT gateway with an internal load balancer - Azure portal](../virtual-network/nat-gateway/tutorial-nat-gateway-load-balancer-internal-portal.md).
>
> For more information about outbound connections in Azure and default outbound access, see [Source Network Address Translation (SNAT) for outbound connections](load-balancer-outbound-connections.md) and [Default outbound access](../virtual-network/ip-services/default-outbound-access.md).

:::image type="content" source="./media/egress-only/load-balancer-egress-only.png" alt-text="Figure depicts a egress only load balancer configuration" border="true":::

*Figure: Egress only load balancer configuration*

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [load-balancer-create-bastion](../../includes/load-balancer-create-bastion.md)]

## Create internal load balancer

In this section, you'll create the internal load balancer.

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

1. In the **Load balancer** page, select **Create**.

1. In the **Basics** tab of the **Create load balancer** page, enter, or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Project details** |   |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **lb-resource-group**. |
    | **Instance details** |   |
    | Name                   | Enter **lb-internal**                                   |
    | Region         | Select **(US) East US**.                                        |
    | SKU           | Leave the default **Standard**. |
    | Type          | Select **Internal**.                                        |
    

1. Select **Next: Frontend IP configuration** at the bottom of the page.

1. In **Frontend IP configuration**, select **+ Add a frontend IP**.

1. Enter **lb-int-frontend** in **Name**.

1. Select **backend-subnet** in **Subnet**.

1. Select **Dynamic** for **Assignment**.

1. Select **Zone-redundant** in **Availability zone**.

    > [!NOTE]
    > In regions with [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones), you have the option to select no-zone (default option), a specific zone, or zone-redundant. The choice will depend on your specific domain failure requirements. In regions without Availability Zones, this field won't appear. </br> For more information on availability zones, see [Availability zones overview](../availability-zones/az-overview.md).

1. Select **Add**.

1. Select **Next: Backend pools** at the bottom of the page.

1. In the **Backend pools** tab, select **+ Add a backend pool**.

1. Enter **lb-int-backend-pool** for **Name** in **Add backend pool**.

1. Select **NIC** or **IP Address** for **Backend Pool Configuration**.

1. Select **Save**.

1. Select the blue **Review + create** button at the bottom of the page.

1. Select **Create**.

## Create public load balancer

In this section, you'll create the public load balancer.

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

1. In the **Load balancer** page, select **Create**.

1. In the **Basics** tab of the **Create load balancer** page, enter, or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Project details** |   |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **lb-resource-group**. |
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
    > In regions with [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones), you have the option to select no-zone (default option), a specific zone, or zone-redundant. The choice will depend on your specific domain failure requirements. In regions without Availability Zones, this field won't appear. </br> For more information on availability zones, see [Availability zones overview](../availability-zones/az-overview.md).

1. Leave the default of **Microsoft Network** for **Routing preference**.

1. Select **OK**.

1. Select **Add**.

1. Select **Next: Backend pools** at the bottom of the page.

1. In the **Backend pools** tab, select **+ Add a backend pool**.

1. Enter **lb-pub-backend-pool** for **Name** in **Add backend pool**.

1. Select **lb-VNet** in **Virtual network**.

1. Select **NIC** or **IP Address** for **Backend Pool Configuration**.

1. Select **Save**.

1. Select the blue **Review + create** button at the bottom of the page.

1. Select **Create**.

## Create virtual machine

You'll create a virtual machine in this section. During creation, you'll add it to the backend pool of the internal load balancer. After the virtual machine is created, you'll add the virtual machine to the backend pool of the public load balancer.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. In **Virtual machines**, select **+ Create** > **Virtual machine**.
   
1. In **Create a virtual machine**, enter or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **lb-resource-group** |
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

1. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
1. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | **lb-VNet** |
    | Subnet | **backend-subnet** |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**|
    | Configure network security group | Leave the default of **vm-NSG**. This might be different if you choose a different name for your VM. |

1. Under **Load balancing**, select the following:

    | Setting | Value |  
    |-|-|
    | Load-balancing options | Select **Azure load balancing** |
    | Select a load balancer | Select **lb-internal**  |
    | Select a backend pool | Select **lb-int-backend-pool** |
   
1. Select **Review + create**. 
  
1. Review the settings, and then select **Create**.

## Add VM to backend pool of public load balancer

In this section, you'll add the virtual machine you created previously to the backend pool of the public load balancer.

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

1. Select **lb-public**.

1. Select **Backend pools** in **Settings** in **lb-public**.

1. Select **lb-pub-backend-pool** under **Backend pool** in the **Backend pools** page.

1. In **lb-pub-backend-pool**, select **lb-VNet** in **Virtual network**.

1. In **Virtual machines**, select the blue **+ Add** button.

1. Select the box next to **lb-VM** in **Add virtual machines to backend pool**.

1. Select **Add**.

1. Select **Save**.

## Test connectivity before outbound rule

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **lb-VM**.

1. In the **Overview** page, select **Connect**, then **Bastion**.

1. Enter the username and password entered during VM creation.

1. Select **Connect**.

1. Open Internet Explorer.

1.  Enter **https://whatsmyip.org** in the address bar.

1.  The connection should fail. By default, standard public load balancer [doesn't allow outbound traffic without a defined outbound rule](load-balancer-overview.md#securebydefault).
 
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
    | Ports per instance | Enter **10000**

1. Select **Add**.

## Test connectivity after outbound rule

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **lb-VM**.

1. On the **Overview** page, select **Connect**, then **Bastion**.

1. Enter the username and password entered during VM creation.

1. Select **Connect**.

1. Open Internet Explorer.

1. Enter **https://whatsmyip.org** in the address bar.

1. The connection should succeed.

1. The IP address displayed should be the frontend IP address of **lb-public**.

## Clean up resources

When no longer needed, delete the resource group, load balancers, VM, and all related resources. 

To do so, select the resource group **lb-resource-group** and then select **Delete**.

## Next steps

In this article, you created an "egress only" configuration with a combination of public and internal load balancers.  

This configuration allows you to load balance incoming internal traffic to your backend pool while still preventing any public inbound connections.

For more information about Azure Load Balancer and Azure Bastion, see [What is Azure Load Balancer?](load-balancer-overview.md) and [What is Azure Bastion?](../bastion/bastion-overview.md).
