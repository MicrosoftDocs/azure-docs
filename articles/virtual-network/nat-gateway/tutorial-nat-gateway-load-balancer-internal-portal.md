---
title: 'Tutorial: Integrate NAT gateway with an internal load balancer - Azure portal'
titleSuffix: Virtual Network NAT
description: In this tutorial, learn how to integrate a Virtual Network NAT gateway with an internal load Balancer using the Azure portal.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: nat
ms.topic: tutorial
ms.date: 05/24/2022
ms.custom: template-tutorial
---

# Tutorial: Integrate a NAT gateway with an internal load balancer using the Azure portal

In this tutorial, you'll learn how to integrate a NAT gateway with an internal load balancer.

By default, an Azure Standard Load Balancer is secure. Outbound connectivity is explicitly defined by enabling outbound SNAT (Source Network Address Translation). 

SNAT is enabled for an internal backend pool via another public load balancer, network routing, or a public IP defined on a virtual machine.

The NAT gateway integration replaces the need for the deployment of a public load balancer, network routing, or a public IP defined on a virtual machine in the backend pool.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Azure Load Balancer
> * Create two virtual machines for the backend pool of the Azure Load Balancer
> * Create a NAT gateway
> * Validate outbound connectivity of the virtual machines in the load balancer backend pool

## Prerequisites

An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create the virtual network

In this section, you'll create a virtual network and subnet.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the upper-left side of the screen, select **Create a resource > Networking > Virtual network** or search for **Virtual network** in the search box.

2. Select **Create**. 

3. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription                                  |
    | Resource Group   | Select **Create new**. Enter **TutorIntLBNAT-rg**. </br> Select **OK**. |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**                                    |
    | Region           | Select **(US) East US** |

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

9. Select the **Security** tab or select the **Next: Security** button at the bottom of the page.

10. Under **BastionHost**, select **Enable**. Enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Bastion name | Enter **myBastionHost** |
    | AzureBastionSubnet address space | Enter **10.1.1.0/24** |
    | Public IP Address | Select **Create new**. </br> For **Name**, enter **myBastionIP**. </br> Select **OK**. |


11. Select the **Review + create** tab or select the **Review + create** button.

12. Select **Create**.

## Create load balancer

In this section, you create a load balancer that load balances virtual machines.

During the creation of the load balancer, you'll configure:

* Frontend IP address
* Backend pool
* Inbound load-balancing rules

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

2. In the **Load balancer** page, select **Create**.

3. In the **Basics** tab of the **Create load balancer** page, enter, or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Project details** |   |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **TutorIntLBNAT-rg**. |
    | **Instance details** |   |
    | Name                   | Enter **myLoadBalancer**                                   |
    | Region         | Select **(US) East US**.                                        |
    | SKU           | Leave the default **Standard**. |
    | Type          | Select **Internal**.                                        |

4. Select **Next: Frontend IP configuration** at the bottom of the page.

5. In **Frontend IP configuration**, select **+ Add a frontend IP configuration**.

6. Enter **LoadBalancerFrontend** in **Name**.

7. Select **myVNet** in **Virtual network**.

8. Select **myBackendSubnet** in **Subnet**.

9. Select **Dynamic** for **Assignment**.

10. Select **Zone-redundant** in **Availability zone**.

    > [!NOTE]
    > In regions with [Availability Zones](../../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones), you have the option to select no-zone (default option), a specific zone, or zone-redundant. The choice will depend on your specific domain failure requirements. In regions without Availability Zones, this field won't appear. </br> For more information on availability zones, see [Availability zones overview](../../availability-zones/az-overview.md).

11. Select **Add**.

12. Select **Next: Backend pools** at the bottom of the page.

13. In the **Backend pools** tab, select **+ Add a backend pool**.

14. Enter **myBackendPool** for **Name** in **Add backend pool**.

15. Select **NIC** or **IP Address** for **Backend Pool Configuration**.

16. Select **IPv4** or **IPv6** for **IP version**.

17. Select **Add**.

18. Select the **Next: Inbound rules** button at the bottom of the page.

19. In **Load balancing rule** in the **Inbound rules** tab, select **+ Add a load balancing rule**.

20. In **Add load balancing rule**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHTTPRule** |
    | IP Version | Select **IPv4** or **IPv6** depending on your requirements. |
    | Frontend IP address | Select **LoadBalancerFrontend**. |
    | Backend pool | Select **myBackendPool**. |
    | Protocol | Select **TCP**. |
    | Port | Enter **80**. |
    | Backend port | Enter **80**. |
    | Health probe | Select **Create new**. </br> In **Name**, enter **myHealthProbe**. </br> Select **HTTP** in **Protocol**. </br> Leave the rest of the defaults, and select **OK**. |
    | Session persistence | Select **None**. |
    | Idle timeout (minutes) | Enter or select **15**. |
    | TCP reset | Select **Enabled**. |
    | Floating IP | Select **Disabled**. |

21. Select **Add**.

22. Select the blue **Review + create** button at the bottom of the page.

23. Select **Create**.

## Create virtual machines

In this section, you'll create two VMs (**myVM1** and **myVM2**) in two different zones (**Zone 1** and **Zone 2**).

These VMs are added to the backend pool of the load balancer that was created earlier.

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Virtual machine**. 
   
2. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **TutorIntLBNAT-rg** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM1** |
    | Region | Select **(US) East US** |
    | Availability Options | Select **Availability zones** |
    | Availability zone | Select **1** |
    | Image | Select **Windows Server 2019 Datacenter** |
    | Azure Spot instance | Leave the default |
    | Size | Choose VM size or take default setting |
    | **Administrator account** |  |
    | Username | Enter a username |
    | Password | Enter a password |
    | Confirm password | Reenter password |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None** |

3. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
4. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | **myVNet** |
    | Subnet | **myBackendSubnet** |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**|
    | Configure network security group | Select **Create new**. </br> In the **Create network security group**, enter **myNSG** in **Name**. </br> Under **Inbound rules**, select **+Add an inbound rule**. </br> Under  **Destination port ranges**, enter **80**. </br> Under **Priority**, enter **100**. </br> In **Name**, enter **myNSGRule** </br> Select **Add** </br> Select **OK** |
    | **Load balancing**  |
    | Place this virtual machine behind an existing load-balancing solution? | Select the check box. |
    | **Load balancing settings** |
    | Load balancing options | Select **Azure load balancer** |
    | Select a load balancer | Select **myLoadBalancer**  |
    | Select a backend pool | Select **myBackendPool** |
   
5. Select **Review + create**. 
  
6. Review the settings, and then select **Create**.

7. Follow the steps 1 to 6 to create a VM with the following values and all the other settings the same as **myVM1**:

    | Setting | VM 2 |
    | ------- | ----- |
    | Name |  **myVM2** |
    | Availability zone | **2** |
    | Network security group | Select the existing **myNSG**| 

## Create NAT gateway

In this section, you'll create a NAT gateway and assign it to the subnet in the virtual network you created previously.

1. On the upper-left side of the screen, select **Create a resource > Networking > NAT gateway** or search for **NAT gateway** in the search box.

2. Select **Create**. 

3. In **Create network address translation (NAT) gateway**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription.                                  |
    | Resource Group   | Select **TutorIntLBNAT-rg**. |
    | **Instance details** |                                                                 |
    | Name             | Enter **myNATGateway**                                    |
    | Region           | Select **(US) East US**  |
    | Availability Zone | Select **None**. |
    | Idle timeout (minutes) | Enter **10**. |

4. Select the **Outbound IP** tab, or select the **Next: Outbound IP** button at the bottom of the page.

5. In the **Outbound IP** tab, enter or select the following information:

    | **Setting** | **Value** |
    | ----------- | --------- |
    | Public IP addresses | Select **Create a new public IP address**. </br> In **Name**, enter **myNATgatewayIP**. </br> Select **OK**. |

6. Select the **Subnet** tab, or select the **Next: Subnet** button at the bottom of the page.

7. In the **Subnet** tab, select **myVNet** in the **Virtual network** pull-down.

8. Check the box next to **myBackendSubnet**.

9. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

10. Select **Create**.

## Test NAT gateway

In this section, we'll test the NAT gateway. We'll first discover the public IP of the NAT gateway. We'll then connect to the test virtual machine and verify the outbound connection through the NAT gateway.
    
1. Select **Resource groups** in the left-hand menu, select the **TutorIntLBNAT-rg** resource group, and then from the resources list, select **myNATgatewayIP**.

2. Make note of the public IP address:

    :::image type="content" source="./media/tutorial-nat-gateway-load-balancer-internal-portal/find-public-ip.png" alt-text="Screenshot of discover public IP address of NAT gateway." border="true":::

3. Select **Resource groups** in the left-hand menu, select the **TutorIntLBNAT-rg** resource group, and then from the resources list, select **myVM1**.

4. On the **Overview** page, select **Connect**, then **Bastion**.

5. Enter the username and password entered during VM creation.

6. Open **Internet Explorer** on **myVM1**.

7. Enter **https://whatsmyip.com** in the address bar.

8. Verify the IP address displayed matches the NAT gateway address you noted in the previous step:

    :::image type="content" source="./media/tutorial-nat-gateway-load-balancer-internal-portal/my-ip.png" alt-text="Screenshot of Internet Explorer showing external outbound IP." border="true":::

## Clean up resources

If you're not going to continue to use this application, delete
the virtual network, virtual machine, and NAT gateway with the following steps:

1. From the left-hand menu, select **Resource groups**.

2. Select the **TutorIntLBNAT-rg** resource group.

3. Select **Delete resource group**.

4. Enter **TutorIntLBNAT-rg** and select **Delete**.

## Next steps

For more information on Azure Virtual Network NAT, see:
> [!div class="nextstepaction"]
> [Virtual Network NAT overview](nat-overview.md)
