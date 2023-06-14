---
title: 'Tutorial: Add Azure Load Balancer to an existing Virtual Machine Scale Set - Azure portal'
description: In this tutorial, learn how to add a load balancer to existing Virtual Machine Scale Set using the Azure portal. 
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: tutorial
ms.date: 12/29/2022
ms.custom: template-tutorial, engagement-fy23
---

# Tutorial: Add Azure Load Balancer to an existing Virtual Machine Scale Set using the Azure portal

The need may arise when an Azure Load Balancer isn't associated with a Virtual Machine Scale Set. 

You may have an existing Virtual Machine Scale Set deployed with an Azure Load Balancer that requires updating.

The Azure portal can be used to add or update an Azure Load Balancer associated with a Virtual Machine Scale Set.  

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network
> * Create a NAT gateway for outbound connectivity
> * Create a standard SKU Azure Load Balancer
> * Create a virtual machine scale set without a load balancer
> * Add a Azure Load Balancer to virtual machine scale set

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)

## Create a virtual network

In this section, you'll create a virtual network for the scale set and the other resources used in the tutorial.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Virtual network** and select **Virtual networks** from the search results.

1. Select **Create**.

1. In the **Basics** tab of the **Create virtual network**, enter or select the following information:

    | Setting | Value |
    | ------- | ------|
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **myResourceGroup** in **Name**. </br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myVNet**. |
    | Region | Select **(US) West US 2**. |

1. Select the **IP addresses** tab, or the **Next: IP Addresses** button at the bottom of the page.

1. In the **IP addresses** tab, select **default** under **Subnet name**.

1. In the **Edit subnet** pane, enter **myBackendSubnet**  under **Subnet name**.

1. Select **Save**.

1. Select the **Security** tab, or the **Next: Security** button at the bottom of the page.

1. In the **Security** tab, in **BastionHost** select **Enable**.

1. Enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Bastion name | Enter **myBastionHost**. |
    | AzureBastionSubnet address space | Enter **10.1.1.0/26**. |
    | Public IP address | Select **Create new**. </br> Enter **myBastionIP** in **Name**. |

1. Select the **Review + create** tab, or the blue **Review + create** button at the bottom of the page.

1. Select **Create**.

> [!IMPORTANT]

> [!INCLUDE [Pricing](../../includes/bastion-pricing.md)]

>
## Create Virtual Machine Scale Set

In this section, you'll create a Virtual Machine Scale Set that will be attached to a load balancer created later.

1. In the search box at the top of the portal, enter **Virtual machine scale**, and select **Virtual machine scale sets** from the search results.
1. Select **Create**.

1. In the **Basics** tab of **Create a virtual machine scale set**, enter, or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | **Scale set details** |   |
    | Virtual machine scale set name | Enter **myVMScaleSet**. |
    | Region | Select **(US) West US 2**. |
    | Availability zone | Leave the default of **None**. |
    | **Orchestration** |   |
    | Orchestration mode | Leave the default of **Uniform: optimized for large-scale stateless workloads with identical instances**. |
    | Security type | Leave the default of **Standard**
    | **Instance details** |   |
    | Image | Select **Windows Server 2022 Datacenter: Azure Edition - x64 Gen2**. |
    | Azure Spot Instance | Leave the default of the box unchecked. |
    | Size | Select a size. |
    | **Administrator account** |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Confirm password. |

1. Select the **Networking** tab.

1. Enter or select the following information in the **Networking** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Virtual network configuration** |   |
    | Virtual network | Select **myVNet**. |

1. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

1. Select **Create**.

## Create NAT gateway 

In this section, you'll create a NAT gateway for outbound connectivity of the virtual machines.

1. In the search box at the top of the portal, enter **NAT gateway**, and select **NAT gateways** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create network address translation (NAT) gateway** page, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |   |
    | NAT gateway name | Enter **myNATgateway**. |
    | Region | Select **(US) West US 2**. |
    | Availability zone | Select **None**. |
    | Idle timeout (minutes) | Enter **15**. |

1. Select the **Outbound IP** tab, or select the **Next: Outbound IP** button at the bottom of the page.

1. Select **Create a new public IP address** next to **Public IP addresses** in the **Outbound IP** tab.

1. Enter **myPublicIP-nat** in **Name**.

1. Select **OK**.

1. Select the **Subnet** tab, or select the **Next: Subnet** button at the bottom of the page.

1. Select **myVNet** in the pull-down menu under **Virtual network**.

1. Select the check box next to **myBackendSubnet**.

1. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

1. Select **Create**.

## Create load balancer

You'll create a load balancer in this section. The frontend IP, backend pool, load-balancing, and inbound NAT rules are configured as part of the creation.

1. In the search box at the top of the portal, enter **Load balancer**.

1. Select **Load balancers** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create load balancer**, enter, or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |   |
    | Name | Enter **myLoadBalancer**. |
    | Region | Select **(US) West US 2**. |
    | SKU | Leave the default of **Standard**. |
    | Type | Select **Public**. |
    | Tier | Leave the default of **Regional**. |

1. Select **Next: Frontend IP configuration** at the bottom of the page.

1. In **Frontend IP configuration**, select **+ Add a frontend IP**.

1. Enter **myFrontend** in **Name**.

1. Select **IPv4** or **IPv6** for the **IP version**.

    > [!NOTE]
    > IPv6 isn't currently supported with Routing Preference or Cross-region load-balancing (Global Tier).

1. Select **IP address** for the **IP type**.

    > [!NOTE]
    > For more information on IP prefixes, see [Azure Public IP address prefix](../virtual-network/ip-services/public-ip-address-prefix.md).

1. Select **Create new** in **Public IP address**.

1. In **Add a public IP address**, enter **myPublicIP** for **Name**.

1. Select **Zone-redundant** in **Availability zone**.

    > [!NOTE]
    > In regions with [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones), you have the option to select no-zone (default option), a specific zone, or zone-redundant. The choice will depend on your specific domain failure requirements. In regions without Availability Zones, this field won't appear. </br> For more information on availability zones, see [Availability zones overview](../availability-zones/az-overview.md).

1. Select **Add**.

1. Select **Next: Backend pools** at the bottom of the page.

1. In the **Backend pools** tab, select **+ Add a backend pool**.

1. Enter or select the following information in **Add backend pool**.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myBackendPool**. |
    | Virtual network | Select **myVNet (myResourceGroup)**. |
    | Backend Pool Configuration | Select **NIC**. |
    | IP version | Select **IPv4**. 

1. Select **Save**.

1. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

1. Select **Create**.

### Configure load balancer settings

In this section, you'll create a backend pool for **myLoadBalancer**.

You'll create a health probe to monitor **HTTP** and **Port 80**. The health probe will monitor the health of the virtual machines in the backend pool. 

You'll create a load-balancing rule for **Port 80** with outbound SNAT disabled. The NAT gateway you created earlier will handle the outbound connectivity of the virtual machines.

1. In the search box at the top of the portal, enter **Load balancer**.

1. Select **Load balancers** in the search results.

1. Select **myLoadBalancer**.

1. In **myLoadBalancer**, select **Backend pools** in **Settings**.

1. Select **+ Add** in **Backend pools**.

1. In **Add backend pool**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myBackendPool**. |
    | Virtual network | Select **myVNet**. |
    | Backend Pool Configuration | Leave the default of **NIC**. |

1. Select **Save**.

1. Select **Next: Inbound rules**

1. In **Create load balancer** page, select **+ Add a load balancing rule**.

1. Enter or select the following information in **Add load-balancing rule**:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHTTPRule**. |
    | IP Version | Leave the default of **IPv4**. |
    | Frontend IP address | Select **myFrontEnd**. |
    | Backend pool | Select **myBackendPool**. |
    | Protocol | Select the default of **TCP**. |
    | Port | Enter **80**. |
    | Backend port | Enter **80**. |
    | Health probe | Select **Create new**.<br/> Enter **myHTTPProbe** for **Name**.</br><br/>Select **HTTP** for **Protocol**.</br><br/> Select **Ok**.</br>|
    | Session persistence | Leave the default of **None**. |
    | Idle timeout (minutes) | Change the slider to **15**. |
    | TCP reset | Select **Enabled**. |
    | Floating IP | Leave the default of **Disabled**. |
    | Outbound source network address translation (SNAT) | Leave the default of **(Recommended) Use outbound rules to provide backend pool members access to the internet.** |

1. Select **Add**.
1. Select **Review + Create** and **Create**.
## Add load balancer to scale set

In this section, you'll go to the scale set in the Azure portal and add a load balancer to the scale set.

1. In the search box at the top of the portal, enter **Virtual machine scale**.

2. In the search results, select **Virtual machine scale sets**.

3. Select **myVMScaleSet**.

4. In the **Settings** section of **myVMScaleSet**, select **Networking**.

5. Select the **Load balancing** tab in the **Overview** page of the **Networking** settings of **myVMScaleSet**.

    :::image type="content" source="./media/tutorial-add-lb-existing-scale-set-portal/load-balancing-tab.png" alt-text="Select the load balancing tab in networking." border="true":::

6. Select the blue **Add load balancing** button.

7. In **Add load balancing**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Load balancing options | Select **Azure load balancer**. |
    | Select a load balancer | Select **myLoadBalancer**. |
    | Backend pool | Select **Use existing**. |
    | Select a backend pool | Select **myBackendPool**. |

8. Select **Save**.

## Clean up resources

If you're not going to continue to use this application, delete
the load balancer and the supporting resources with the following steps:

1. In the search box at the top of the portal, enter **Resource group**.

2. Select **Resource groups** in the search results.

3. Select **myResourceGroup**.

4. In the overview page of **myResourceGroup**, select **Delete resource group**.

5. Enter **myResourceGroup** in **TYPE THE RESOURCE GROUP NAME**.

6. Select **Delete**.

## Next steps

In this tutorial, you:

* Created a virtual network and Azure Bastion host.
* Created an Azure Standard Load Balancer.
* Created a virtual machine scale set.
* Added load balancer to Virtual Machine Scale Set.

Advance to the next article to learn how to create a cross-region Azure Load Balancer:
> [!div class="nextstepaction"]
> [Create a cross-region load balancer](tutorial-cross-region-portal.md)