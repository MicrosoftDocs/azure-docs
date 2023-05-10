---
title: 'Tutorial: Create a load balancer with more than one availability set in the backend pool - Azure portal'
titleSuffix: Azure Load Balancer
description: In this tutorial, deploy an Azure Load Balancer with more than one availability set in the backend pool.
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: tutorial
ms.date: 05/09/2022
ms.custom: template-tutorial
---

# Tutorial: Create a load balancer with more than one availability set in the backend pool using the Azure portal

As part of a high availability deployment, virtual machines are often grouped into multiple availability sets. 

Load Balancer supports more than one availability set with virtual machines in the backend pool.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network
> * Create a NAT gateway for outbound connectivity
> * Create a standard SKU Azure Load Balancer
> * Create four virtual machines and two availability sets
> * Add virtual machines in availability sets to backend pool of load balancer
> * Test the load balancer

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create a virtual network

In this section, you'll create a virtual network for the load balancer and the other resources used in the tutorial.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Virtual network**.

3. In the search results, select **Virtual networks**.

4. Select **+ Create**.

5. In the **Basics** tab of the **Create virtual network**, enter, or select the following information:

    | Setting | Value |
    | ------- | ------|
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **TutorLBmultiAVS-rg** in **Name**. |
    | **Instance details** |   |
    | Name | Enter **myVNet**. |
    | Region | Select **(US) West US 2**. |

6. Select the **IP addresses** tab, or the **Next: IP Addresses** button at the bottom of the page.

7. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.1.0.0/16** |

8. Select **+ Add subnet**. 

9. In **Add subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **myBackendSubnet** |
    | Subnet address range | Enter **10.1.0.0/24** |

10. Select **Add**.

11. Select the **Security** tab, or the **Next: Security** button at the bottom of the page.

12. In the **Security** tab, in **BastionHost** select **Enable**.

13. Enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Bastion name | Enter **MyBastionHost**. |
    | AzureBastionSubnet address space | Enter **10.1.1.0/27**. |
    | Public IP address | Select **Create new**. </br> Enter **myBastionIP** in **Name**. |

14. Select the **Review + create** tab, or the blue **Review + create** button at the bottom of the page.

15. Select **Create**.

## Create NAT gateway 

In this section, you'll create a NAT gateway for outbound connectivity of the virtual machines.

1. In the search box at the top of the portal, enter **NAT gateway**.

2. Select **NAT gateways** in the search results.

3. Select **+ Create**.

4. In the **Basics** tab of **Create network address translation (NAT) gateway**, enter or select the following information:

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

5. Select the **Outbound IP** tab, or select the **Next: Outbound IP** button at the bottom of the page.

6. Select **Create a new public IP address** next to **Public IP addresses** in the **Outbound IP** tab.

7. Enter **myNATgatewayIP** in **Name**.

8. Select **OK**.

9. Select the **Subnet** tab, or select the **Next: Subnet** button at the bottom of the page.

10. Select **myVNet** in the pull-down menu under **Virtual network**.

11. Select the check box next to **myBackendSubnet**.

12. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

13. Select **Create**.

## Create load balancer

In this section, you'll create a load balancer for the virtual machines.

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

2. In the **Load balancer** page, select **Create**.

3. In the **Basics** tab of the **Create load balancer** page, enter, or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Project details** |   |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **TutorLBmultiAVS-rg**. |
    | **Instance details** |   |
    | Name                   | Enter **myLoadBalancer**                                   |
    | Region         | Select **(US) West US 2**.                                        |
    | Type          | Select **Public**.                                        |
    | SKU           | Leave the default **Standard**. |
    | Tier          | Leave the default **Regional**. |

4. Select the **Frontend IP configuration** tab, or select the **Next: Frontend IP configuration** button at the bottom of the page.

5. In **Frontend IP configuration**, select **+ Add a frontend IP configuration**.

6. Enter **LoadBalancerFrontend** in **Name**.

7. Select **IPv4** or **IPv6** for the **IP version**.

    > [!NOTE]
    > IPv6 isn't currently supported with Routing Preference or Cross-region load-balancing (Global Tier).

8. Select **IP address** for the **IP type**.

    > [!NOTE]
    > For more information on IP prefixes, see [Azure Public IP address prefix](../virtual-network/ip-services/public-ip-address-prefix.md).

9. Select **Create new** in **Public IP address**.

10. In **Add a public IP address**, enter **myPublicIP-lb** for **Name**.

11. Select **Zone-redundant** in **Availability zone**.

    > [!NOTE]
    > In regions with [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones), you have the option to select no zone (default option), a specific zone, or zone-redundant. The choice will depend on your specific domain failure requirements. In regions without Availability Zones, this field won't appear. </br> For more information on availability zones, see [Availability zones overview](../availability-zones/az-overview.md).

12. Leave the default of **Microsoft Network** for **Routing preference**.

13. Select **OK**.

14. Select **Add**.

15. Select the **Backend pools** tab, or select the **Next: Backend pools** button at the bottom of the page.

16. In the **Backend pools** tab, select **+ Add a backend pool**.

17. Enter **myBackendPool** for **Name** in **Add backend pool**.

18. Select **myVNet** in **Virtual network**.

19. Select **NIC** or **IP Address** for **Backend Pool Configuration**.

20. Select **IPv4** or **IPv6** for **IP version**.

21. Select **Add**.

22. Select the **Inbound rules** tab, or select the **Next: Inbound rules** button at the bottom of the page.

23. In **Load balancing rule** in the **Inbound rules** tab, select **+ Add a load balancing rule**.

24. In **Add load balancing rule**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHTTPRule** |
    | IP Version | Select **IPv4** or **IPv6** depending on your requirements. |
    | Frontend IP address | Select **LoadBalancerFrontend**. |
    | Protocol | Select **TCP**. |
    | Port | Enter **80**. |
    | Backend port | Enter **80**. |
    | Backend pool | Select **myBackendPool**. |
    | Health probe | Select **Create new**. </br> In **Name**, enter **myHealthProbe**. </br> Select **HTTP** in **Protocol**. </br> Leave the rest of the defaults, and select **OK**. |
    | Session persistence | Select **None**. |
    | Idle timeout (minutes) | Enter or select **15**. |
    | TCP reset | Select **Enabled**. |
    | Floating IP | Select **Disabled**. |
    | Outbound source network address translation (SNAT) | Leave the default of **(Recommended) Use outbound rules to provide backend pool members access to the internet.** |

25. Select **Add**.

26. Select the blue **Review + create** button at the bottom of the page.

27. Select **Create**.

    > [!NOTE]
    > In this example we created a NAT gateway to provide outbound Internet access. The outbound rules tab in the configuration is bypassed as it's optional and isn't needed with the NAT gateway. For more information on Azure NAT gateway, see [What is Azure Virtual Network NAT?](../virtual-network/nat-gateway/nat-overview.md)
    > For more information about outbound connections in Azure, see [Source Network Address Translation (SNAT) for outbound connections](../load-balancer/load-balancer-outbound-connections.md)

## Create virtual machines

In this section, you'll create two availability groups with two virtual machines per group. These machines will be added to the backend pool of the load balancer during creation. 

### Create first set of VMs

1. Select **+ Create a resource** in the upper left-hand section of the portal.

2. In **New**, select **Compute** > **Virtual machine**.

3. In the **Basics** tab of **Create a virtual machine**, enter, or select the following information:

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

4. Select the **Networking** tab, or select the **Next: Disks**, then **Next: Networking** button at the bottom of the page.

5. In the **Networking** tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **myBackendSubnet**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **Create new**. </br> In **Name**, enter **myNSG**. </br> Select **+Add an inbound rule** in **Inbound rules**. </br> Select **HTTP** for **Service**. </br> Enter **myHTTPrule** for **Name**. </br> Select **Add**. </br> Select **OK**. | 
    | **Load balancing** |   |
    | Place this virtual machine behind an existing load-balancing solution? | Select the check box. |
    | **Load-balancing settings** |   |
    | Load-balancing options | Select **Azure load balancer**. |
    | Select a load balancer | Select **myLoadBalancer**. |
    | Select a backend pool | Select **myBackendPool**. |

6. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

7. Select **Create**.

8. Repeat steps 1 through 7 to create the second virtual machine of the set. Replace the settings for the VM with the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myVM2**. |
    | Availability set | Select **myAvailabilitySet1**. |
    | Virtual Network | Select **myVNet**. |
    | Subnet | Select **myBackendSubnet**. |
    | Public IP | Select **None**. |
    | Network security group | Select **myNSG**. |
    | Load-balancing options | Select **Azure load balancer**. |
    | Select a load balancer | Select **myLoadBalancer**. |
    | Select a backend pool | Select **myBackendPool**. |

### Create second set of VMs

1. Select **+ Create a resource** in the upper left-hand section of the portal.

2. In **New**, select **Compute** > **Virtual machine**.

3. In the **Basics** tab of **Create a virtual machine**, enter, or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription |
    | Resource group | Select **TutorLBmultiAVS-rg**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **myVM3**. |
    | Region | Select **(US) West US 2**. |
    | Availability options | Select **Availability set**. |
    | Availability set | Select **Create new**. </br> Enter **myAvailabilitySet2** in **Name**. </br> Select **OK**. |
    | Image | Select **Windows Server 2019 Datacenter - Gen1**. |
    | Azure Spot instance | Leave the default of unchecked. |
    | Size | Select a size for the virtual machine. |
    | **Administrator account** |   |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | **Inbound port rules** |   |
    | Public inbound ports | Select **None**. |

4. Select the **Networking** tab, or select the **Next: Disks**, then **Next: Networking** button at the bottom of the page.

5. In the **Networking** tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **myBackendSubnet**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **myNSG**. | 
    | **Load balancing** |   |
    | Place this virtual machine behind an existing load-balancing solution? | Select the check box. |
    | **Load-balancing settings** |   |
    | Load-balancing options | Select **Azure load balancer**. |
    | Select a load balancer | Select **myLoadBalancer**. |
    | Select a backend pool | Select **myBackendPool**. |

6. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

7. Select **Create**.

8. Repeat steps 1 through 7 to create the second virtual machine of the set. Replace the settings for the VM with the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myVM4**. |
    | Availability set | Select **myAvailabilitySet2**. |
    | Virtual Network | Select **myVNet**. |
    | Network security group | Select **myNSG**. |
    | Load-balancing options | Select **Azure load balancer**. |
    | Select a load balancer | Select **myLoadBalancer**. |
    | Select a backend pool | Select **myBackendPool**. |

## Install IIS

In this section, you'll use the Azure Bastion host you created previously to connect to the virtual machines and install IIS.

1. In the search box at the top of the portal, enter **Virtual machine**.

2. Select **Virtual machines** in the search results.

3. Select **myVM1**.

4. In the **Overview** page of myVM1, select **Connect** > **Bastion**.

5. Enter the **Username** and **Password** you created when you created the virtual machine.

6. Select **Connect**.

7. On the server desktop, navigate to **Windows Administrative Tools** > **Windows PowerShell**.

8. In the PowerShell Window, run the following commands to:

    * Install the IIS server
    * Remove the default iisstart.htm file
    * Add a new iisstart.htm file that displays the name of the VM:

   ```powershell
    # Install IIS server role
    Install-WindowsFeature -name Web-Server -IncludeManagementTools
    
    # Remove default htm file
    Remove-Item  C:\inetpub\wwwroot\iisstart.htm
    
    # Add a new htm file that displays server name
    Add-Content -Path "C:\inetpub\wwwroot\iisstart.htm" -Value $("Hello World from " + $env:computername)
   ```
9. Close the Bastion session with **myVM1**.

10. Repeat steps 1 through 8 for **myVM2**, **myVM3**, and **myVM4**.

## Test the load balancer

In this section, you'll discover the public IP address of the load balancer. You'll use the IP address to test the operation of the load balancer.

1. In the search box at the top of the portal, enter **Public IP**.

2. Select **Public IP addresses** in the search results.

3. Select **myPublicIP-lb**.

4. Note the public IP address listed in **IP address** in the **Overview** page of **myPublicIP-lb**:

    :::image type="content" source="./media/tutorial-multi-availability-sets-portal/find-public-ip.png" alt-text="Find the public IP address of the load balancer." border="true":::

5. Open a web browser and enter the public IP address in the address bar:

    :::image type="content" source="./media/tutorial-multi-availability-sets-portal/verify-load-balancer.png" alt-text="Test load balancer with web browser." border="true":::

6. Select refresh in the browser to see the traffic balanced to the other virtual machines in the backend pool.

## Clean up resources

If you're not going to continue to use this application, delete
the load balancer and the supporting resources with the following steps:

1. In the search box at the top of the portal, enter **Resource group**.

2. Select **Resource groups** in the search results.

3. Select **TutorLBmultiAVS-rg**.

4. In the overview page of **TutorLBmultiAVS-rg**, select **Delete resource group**.

5. Enter **TutorLBmultiAVS-rg** in **TYPE THE RESOURCE GROUP NAME**.

6. Select **Delete**.

## Next steps

In this tutorial, you:

* Created a virtual network and Azure Bastion host.
* Created an Azure Standard Load Balancer.
* Created two availability sets with two virtual machines per set.
* Installed IIS and tested the load balancer.

Advance to the next article to learn how to create a cross-region Azure Load Balancer:
> [!div class="nextstepaction"]
> [Create a cross-region load balancer](tutorial-cross-region-portal.md)