---
title: Outbound-only load balancer configuration
titleSuffix: Azure Load Balancer
description: In this article, learn about how to create an internal load balancer with outbound NAT
author: mbender-ms
ms.custom: seodec18
ms.service: load-balancer
ms.topic: how-to
ms.date: 08/21/2021
ms.author: mbender
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

## Create virtual network and load balancers

In this section, you'll create a virtual network and subnet for the load balancers and the virtual machine.  You'll next create the load balancers.

### Create the virtual network

In this section, you'll create the virtual network and subnets for the virtual machine, load balancer, and bastion host.

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual Networks** in the search results.

2. In **Virtual networks**, select **+ Create**.

3. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription                                  |
    | Resource Group   | Select **Create new**. </br> In **Name** enter **myResourceGroupLB**. </br> Select **OK**. |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**                                    |
    | Region           | Select **(US) East US 2** |

4. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

5. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.1.0.0/16** |

6. Under **Subnet name**, select the word **default**.

7. In **Edit subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **myBackendSubnet** |
    | Subnet address range | Enter **10.1.0.0/24** |

8. Select **Save**.

9. Select the **Security** tab.

10. Under **BastionHost**, select **Enable**. Enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Bastion name | Enter **myBastionHost** |
    | AzureBastionSubnet address space | Enter **10.1.1.0/27** |
    | Public IP Address | Select **Create new**. </br> For **Name**, enter **myBastionIP**. </br> Select **OK**. |

11. Select the **Review + create** tab or select the **Review + create** button.

12. Select **Create**.

### Create internal load balancer

In this section, you'll create the internal load balancer.

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

2. In the **Load balancer** page, select **Create**.

3. In the **Basics** tab of the **Create load balancer** page, enter, or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Project details** |   |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **myResourceGroupLB**. |
    | **Instance details** |   |
    | Name                   | Enter **myInternalLoadBalancer**                                   |
    | Region         | Select **(US) East US 2**.                                        |
    | Type          | Select **Internal**.                                        |
    | SKU           | Leave the default **Standard**. |

4. Select **Next: Frontend IP configuration** at the bottom of the page.

5. In **Frontend IP configuration**, select **+ Add a frontend IP**.

6. Enter **LoadBalancerFrontend** in **Name**.

7. Select **myBackendSubnet** in **Subnet**.

8. Select **Dynamic** for **Assignment**.

9. Select **Zone-redundant** in **Availability zone**.

    > [!NOTE]
    > In regions with [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones), you have the option to select no-zone (default option), a specific zone, or zone-redundant. The choice will depend on your specific domain failure requirements. In regions without Availability Zones, this field won't appear. </br> For more information on availability zones, see [Availability zones overview](../availability-zones/az-overview.md).

10. Select **Add**.

11. Select **Next: Backend pools** at the bottom of the page.

12. In the **Backend pools** tab, select **+ Add a backend pool**.

13. Enter **myInternalBackendPool** for **Name** in **Add backend pool**.

14. Select **NIC** or **IP Address** for **Backend Pool Configuration**.

15. Select **IPv4** or **IPv6** for **IP version**.

16. Select **Add**.

17. Select the blue **Review + create** button at the bottom of the page.

18. Select **Create**.

### Create public load balancer

In this section, you'll create the public load balancer.

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

2. In the **Load balancer** page, select **Create**.

3. In the **Basics** tab of the **Create load balancer** page, enter, or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Project details** |   |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **myResourceGroupLB**. |
    | **Instance details** |   |
    | Name                   | Enter **myPublicLoadBalancer**                                   |
    | Region         | Select **(US) East US 2**.                                        |
    | Type          | Select **Public**.                                        |
    | SKU           | Leave the default **Standard**. |
    | Tier          | Leave the default **Regional**. |

4. Select **Next: Frontend IP configuration** at the bottom of the page.

5. In **Frontend IP configuration**, select **+ Add a frontend IP**.

6. Enter **LoadBalancerFrontend** in **Name**.

7. Select **IPv4** or **IPv6** for the **IP version**.

    > [!NOTE]
    > IPv6 isn't currently supported with Routing Preference or Cross-region load-balancing (Global Tier).

8. Select **IP address** for the **IP type**.

    > [!NOTE]
    > For more information on IP prefixes, see [Azure Public IP address prefix](../virtual-network/ip-services/public-ip-address-prefix.md).

9. Select **Create new** in **Public IP address**.

10. In **Add a public IP address**, enter **myPublicIP** for **Name**.

11. Select **Zone-redundant** in **Availability zone**.

    > [!NOTE]
    > In regions with [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones), you have the option to select no-zone (default option), a specific zone, or zone-redundant. The choice will depend on your specific domain failure requirements. In regions without Availability Zones, this field won't appear. </br> For more information on availability zones, see [Availability zones overview](../availability-zones/az-overview.md).

12. Leave the default of **Microsoft Network** for **Routing preference**.

13. Select **OK**.

14. Select **Add**.

15. Select **Next: Backend pools** at the bottom of the page.

16. In the **Backend pools** tab, select **+ Add a backend pool**.

17. Enter **myPublicBackendPool** for **Name** in **Add backend pool**.

18. Select **myVNet** in **Virtual network**.

19. Select **NIC** or **IP Address** for **Backend Pool Configuration**.

20. Select **IPv4** or **IPv6** for **IP version**.

21. Select **Add**.

22. Select the blue **Review + create** button at the bottom of the page.

23. Select **Create**.

## Create virtual machine

You'll create a virtual machine in this section. During creation, you'll add it to the backend pool of the internal load balancer. After the virtual machine is created, you'll add the virtual machine to the backend pool of the public load balancer.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. In **Virtual machines**, select **+ Create** > **Virtual machine**.
   
3. In **Create a virtual machine**, enter or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **myResourceGroupLB** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM** |
    | Region | Select **(US) East US 2** |
    | Availability Options | Select **No infrastructure redundancy required** |
    | Image | Select **Windows Server 2019 Datacenter - Gen1** |
    | Azure Spot instance | Leave the default of unchecked. |
    | Size | Choose VM size or take default setting |
    | **Administrator account** |  |
    | Username | Enter a username |
    | Password | Enter a password |
    | Confirm password | Reenter password |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None** |

4. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
5. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | **myVNet** |
    | Subnet | **myBackendSubnet** |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**|
    | Configure network security group | Leave the default of **Basic**. |
    | **Load balancing**  |
    | Place this virtual machine behind an existing load-balancing solution? | Select the box. |
    | **Load balancing settings** |
    | Load-balancing options | Select **Azure load balancing** |
    | Select a load balancer | Select **myInternalLoadBalancer**  |
    | Select a backend pool | Select **myInternalBackendPool** |
   
6. Select **Review + create**. 
  
7. Review the settings, and then select **Create**.

### Add VM to backend pool of public load balancer

In this section, you'll add the virtual machine you created previously to the backend pool of the public load balancer.

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

2. Select **myPublicLoadBalancer**.

3. Select **Backend pools** in **Settings** in **myPublicLoadBalancer**.

4. Select **myPublicBackendPool** under **Backend pool** in the **Backend pools** page.

5. In **myPublicBackendPool**, select **myVNet** in **Virtual network**.

6. In **Virtual machines**, select the blue **+ Add** button.

7. Select the box next to **myVM** in **Add virtual machines to backend pool**.

8. Select **Add**.

9. Select **Save**.
## Test connectivity before outbound rule

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **myVM**.

3. In the **Overview** page, select **Connect**, then **Bastion**.

4. Enter the username and password entered during VM creation.

5. Select **Connect**.

6. Open Internet Explorer.

7. Enter **https://whatsmyip.org** in the address bar.

8. The connection should fail. By default, standard public load balancer [doesn't allow outbound traffic without a defined outbound rule](load-balancer-overview.md#securebydefault).
 
## Create a public load balancer outbound rule

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

2. Select **myPublicLoadBalancer**.

3. Select **Outbound rules** in **Settings** in **myPublicLoadBalancer**.

4. Select **+ Add** in **Outbound rules**.

5. Enter or select the following information to configure the outbound rule.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myOutboundRule**. |
    | Frontend IP address | Select **LoadBalancerFrontEnd**.|
    | Protocol | Leave the default of **All**. |
    | Idle timeout (minutes) | Move slider to **15 minutes**.|
    | TCP Reset | Select **Enabled**.|
    | Backend pool | Select **myPublicBackendPool**.|
    | **Port allocation** |  |
    | Port allocation | Select **Manually choose number of outbound ports**. |
    | **Outbound ports** |  |
    | Choose by | Select **Ports per instance**. |
    | Ports per instance | Enter **10000**

6. Select **Add**.

## Test connectivity after outbound rule

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **myVM**.

3. On the **Overview** page, select **Connect**, then **Bastion**.

4. Enter the username and password entered during VM creation.

5. Select **Connect**.

6. Open Internet Explorer.

7. Enter **https://whatsmyip.org** in the address bar.

8. The connection should succeed.

9. The IP address displayed should be the frontend IP address of **myPublicLoadBalancer**.

## Clean up resources

When no longer needed, delete the resource group, load balancers, VM, and all related resources. 

To do so, select the resource group **myResourceGroupLB** and then select **Delete**.

## Next steps

In this article, you created an "egress only" configuration with a combination of public and internal load balancers.  

This configuration allows you to load balance incoming internal traffic to your backend pool while still preventing any public inbound connections.

For more information about Azure Load Balancer and Azure Bastion, see [What is Azure Load Balancer?](load-balancer-overview.md) and [What is Azure Bastion?](../bastion/bastion-overview.md).