---
title: 'Tutorial: Create a load balancer with more than one availability set in the backend pool - Azure portal'
titleSuffix: Azure Load Balancer
description: In this tutorial, deploy an Azure Load Balancer with more than one availability set in the backend pool.
author: asudbring
ms.author: allensu
ms.service: load-balancer
ms.topic: tutorial
ms.date: 04/21/2021
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

7. In the **IP addresses** tab, under **Subnet name** select **default**.

8. In the **Edit subnet** pane, under **Subnet name** enter **myBackendSubnet**.

9. Select **Save**.

10. Select the **Security** tab, or the **Next: Security** button at the bottom of the page.

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

7. Enter **myPublicIP-nat** in **Name**.

8. Select **OK**.

9. Select the **Subnet** tab, or select the **Next: Subnet** button at the bottom of the page.

10. Select **myVNet** in the pull-down menu under **Virtual network**.

11. Select the check box next to **myBackendSubnet**.

12. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

13. Select **Create**.

## Create load balancer

In this section, you'll create a load balancer for the virtual machines.

1. In the search box at the top of the portal, enter **Load balancer**.

2. Select **Load balancers** in the search results.

3. Select **+ Create**.

4. In the **Basics** tab of **Create load balancer**, enter, or select the following information:

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

You'll create a health probe to monitor **HTTP** and **Port 80**. The health probe will monitor the health of the virtual machines in the backend pool. 

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

12. Select **Load-balancing rules**. 

13. Select **+ Add**.

14. Enter or select the following information in **Add load-balancing rule**:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHTTPRule**. |
    | IP Version | Leave the default of **IPv4**. |
    | Frontend IP address | Select **LoadBalancerFrontEnd**. |
    | Protocol | Select the default of **TCP**. |
    | Port | Enter **80**. |
    | Backend port | Enter **80**. |
    | Backend pool | Select **myBackendPool**. |
    | Health probe | Select **myHTTPProbe**. |
    | Session persistence | Leave the default of **None**. |
    | Idle timeout (minutes) | Change the slider to **15**. |
    | TCP reset | Select **Enabled**. |
    | Floating IP | Leave the default of **Disabled**. |
    | Outbound source network address translation (SNAT) | Leave the default of **(Recommended) Use outbound rules to provide backend pool members access to the internet.** |

5. Select **Add**.

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

8. Repeat steps 1 through seven to create the second virtual machine of the set. Replace the settings for the VM with the following information:

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

8. Repeat steps 1 through seven to create the second virtual machine of the set. Replace the settings for the VM with the following information:

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

5. Select **Use Bastion**.

6. Enter the **Username** and **Password** you created when you created the virtual machine.

7. Select **Connect**.

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
8. Close the Bastion session with **myVM1**.

9. Repeat steps 1 through eight for **myVM2**, **myVM3**, and **myVM4**.

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

