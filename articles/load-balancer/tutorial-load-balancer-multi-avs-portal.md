---
title: 'Tutorial: Create a load balancer with multiple virtual machine availability sets - Azure portal'
titleSuffix: Azure Load Balancer
description: In this tutorial, deploy an Azure Load Balancer with multiple virtual machine availability sets in the backend pool. 
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: nat
ms.topic: tutorial
ms.date: 04/16/2021
ms.custom: template-tutorial
---
# Tutorial: Create a load balancer with multiple virtual machine availability sets using the Azure portal 

As part of a high availability deployment, virtual machines are often grouped into multiple Azure Virtual Machine availability sets. Azure Load Balancer supports multiple groups of virtual machines in availability sets in the backend pool of the load balancer.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network
> * Create a NAT gateway for outbound connectivity
> * Create an standard SKU Azure Load Balancer
> * Create four virtual machines and two availability sets
> * Add virtual machines in availability sets to backend pool of load balancer
> * Test the load balancer

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create a virtual network

In this section, you'll create a virtual network for the load balancer and the other resources used in the tutorial.

1. Sign in to the [Azure portal](url).

2. In the search box at the top of the portal, enter **Virtual network**.

3. In the search results, select **Virtual networks**.

4. Select **+ Create**.

5. In the **Basics** tab of the **Create virtual network**, enter or select the following information:

    | Setting | Value |
    | ------- | ------|
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **TutorLBmultiAVS-rg** in **Name**. |
    | **Instance details** |   |
    | Name | Enter **myVNet**. |
    | Region | Select **(US) West US 2**. |

6. Select the **IP addresses** tab, or the **Next:IP Addresses** button at the bottom of the page.

7. In the **IP addresses** tab, under **Subnet name** select **default**.

8. In the **Edit subnet** pane, under **Subnet name** enter **myBackendSubnet**.

9. Select **Save**.

10. Select the **Security** tab, or the **Next:Security** button at the bottom of the page.

11. In the **Security** tab, in **BastionHost** select **Enable**.

12. Enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Bastion name | Enter **MyBastionHost**. |
    | AzureBastionSubnet address space | Enter **10.1.1.0/27**. |
    | Public IP address | Select **Create new**. </br> Enter **myBastionIP** in **Name**. |

13. Select the **Review + create** tab, or the blue **Review + create** button at the bottom of the page.

14. Select **Create**.

## Create NAT gateway 

In this section, you'll create a NAT gateway for outbound connectivity of the virtual machines that are placed in the virtual and network you created previously.

1. In the search box at the top of the portal, enter **NAT gateway**.

2. Select **NAT gateways** in the search results.

3. Select **+ Create**.

4. In the **Basics** tab of **Create network address translation (NAT) gateway, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorLBmultiAVS-rg**. |
    | **Instance details** |   |
    | NAT gateway name | Enter **myNATgateway**. |
    | Region | Select **(US) West US 2**. |
    | Availability zone | Select **None**. |
    | Idle timeout (minutes) | Enter **15**. |

5. Select the **Outbound IP** tab, or select the **Next:Outbound IP** button at the bottom of the page.

6. Select **Create a new public IP address** next to **Public IP addresses** in the **Outbound IP** tab.

7. Enter **myPublicIP-nat** in **Name**.

8. Select **OK**.

9. Select the **Subnet** tab, or select the **Next:Subnet** button at the bottom of the page.

10. Select **myVNet** in the pull-down menu under **Virtual network**.

11. Select the check box next to **myBackendSubnet**.

12. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

13. Select **Create**.

## Create load balancer

In this section you'll create a load balancer for the virtual machines.

1. In the search box at the top of the portal, enter **Load balancer**.

2. Select **Load balancers** in the search results.

3. Select **+ Create**.

4. In the **Basics** tab of **Create load balancer**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorLBmultiAVS-rg**. |
    | **Instance details** |   |
    | Name | Enter **myLoadBalancer**. |
    | Region | Select **(US) West US 2**. |
    | Type | Leave the default of **Public**. |
    | SKU | Leave the default of **Standard**. |
    | Tier | Leave the default of **Regional**. |
    | **Public IP address** |   |
    | Public IP address | Leave the default of **Create new**. |
    | Public IP address name | Enter **myPublicIP-lb**. |
    | Availability zone | Select **Zone-redundant**. |
    | Add a public IPv6 address | Leave the default of **No**. |
    | Routing preference | Leave the default of **Microsoft network**. |

5. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

6. Select **Create**.

### Configure load balancer settings

In this section, you'll create a backend pool for **myLoadBalancer**.

You'll create a health probe to monitor **HTTP** and **Port 80**. The health probe will monitor the health of the virtual machines in the backend pool. Traffic will be redirected to the healthy virtual machines.

You'll create a load-balancing rule for **Port 80** with outbound SNAT disabled. The NAT gateway you created earlier will handle the outbound connectivity of the virtual machines.

1. In the search box at the top of the portal, enter **Load balancer**.

2. Select **Load balancers** in the search results.

3. Select **myLoadBalancer**.

4. In **myLoadBalancer**, select **Backend pools** in **Settings**.

5. Select **+ Add** in **Backend pools**.

6. In **Add backend pool**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myBackendPool**. |
    | Virtual network | Select **myVNet**. |
    | Backend Pool Configuration | Leave the default of **NIC**. |
    | IP Version | Leave the default of **IPv4**. |

7. Select **Add**.

8. Select **Health probes**.

9. Select **+ Add**.

10. In **Add health probe**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHTTPProbe**. |
    | Protocol | Select **HTTP**. |
    | Port | Leave the default of **80**. |
    | Path | Leave the default of **/**. |
    | Interval | Leave the default of **5** seconds. |
    | Unhealthy threshold | Leave the default of **2** consecutive failures. |

11. Select **Add**.

12. 


## Create virtual machines

In this section you'll create two availability groups with two virtual machines per group. These machines will be added to the backend pool of the load balancer during creation. 

### Create first set of VMs

1. Select **+ Create a resource** in the upper left-hand section of the portal.

2. In **New**, select **Compute** > **Virtual machine**.

3. In the **Basics** tab of **Create a virtual machine**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription |
    | Resource group | Select **TutorLBmultiAVS-rg**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **myVM1**. |
    | Region | Select **(US) West US 2**. |
    | Availability options | Select **Availability set**. |
    | Availability set | Select **Create new**. </br> Enter **myAvailabilitySet1** in **Name**. </br> Select **OK**. |
    | Image | Select **Windows Server 2019 Datacenter - Gen1**. |
    | Azure Spot instance | Leave the default of unchecked. |
    | Size | Select a size for the virtual machine. |
    | **Administrator account** |   |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | **Inbound port rules** |   |
    | Public inbound ports | Select **None**. |

4. Select the **Networking** tab, or select the **Next:Disks**, then **Next:Networking** button at the bottom of the page.

5. In the **Networking** tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **myBackendSubnet**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **Create new**. </br> In **Name** enter **myNSG**. </br> Select **+Add an inbound rule** in **Inbound rules**. </br> Select **HTTP** for **Service**. </br> Enter **myHTTPrule** for **Name**. </br> Select **Add**. </br> Select **OK**. | 
    | **Load balancing** |   |
    | Place this virtual machine behind an existing load balancing solution? | Select the check box. |
    | **Load balancing settings** |   |
    | Load balancing options | Select **Azure load balancer**. |
    | Select a load balancer | 


## Clean up resources

If you're not going to continue to use this application, delete
<resources> with the following steps:

1. From the left-hand menu...
1. ...click Delete, type...and then click Delete

<!-- 7. Next steps
Required: A single link in the blue box format. Point to the next logical tutorial 
in a series, or, if there are no other tutorials, to some other cool thing the 
customer can do. 
-->

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-how-to-mvc-tutorial.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->
