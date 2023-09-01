---
title: 'Tutorial: Create a load balancer with more than one availability set in the backend pool - Azure portal'
titleSuffix: Azure Load Balancer
description: In this tutorial, deploy an Azure Load Balancer with more than one availability set in the backend pool.
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: tutorial
ms.date: 07/05/2023
ms.custom: template-tutorial, engagement-fy24
---

# Tutorial: Create a load balancer with more than one availability set in the backend pool using the Azure portal

As part of a high availability deployment, virtual machines are often grouped into multiple availability sets. 

Load Balancer supports more than one availability set with virtual machines in the backend pool.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network and a network security group
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

1. In the search box at the top of the portal, enter **Virtual network**.

1. In the search results, select **Virtual networks**.

1. Select **+ Create**.

1. In the **Basics** tab of the **Create virtual network**, enter, or select the following information:

    | Setting | Value |
    | ------- | ------|
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **myResourceGroup** in **Name**. |
    | **Instance details** |   |
    | Name | Enter **myVNet**. |
    | Region | Select **(US) West US 2**. |

1. Select the **IP addresses** tab, or the **Next: Security** and **Next: IP Addresses** buttons at the bottom of the page.

1. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.0.0.0** and choose **/16 (65,536 addresses)** |

1. Select **default** under **Subnets**.
1. Under **Subnet details**, enter **myBackendSubnet** for **Name**.
1. In **Add subnet**, enter this information:

    | Setting           | Value         |
    | ----------------- | ------------- |
    | Subnet address range | Enter **10.1.0.0/24** |

1. Select **Save**.
1. Select the **Review + create** tab, or the blue **Review + create** button at the bottom of the page.
1. Select **Create**.

## Create a network security group

In this section, you'll create a network security group for the virtual machines in the backend pool of the load balancer. The NSG will allow inbound traffic on port 80.

1. In the search box at the top of the portal, enter **Network security group**.
1. Select **Network security groups** in the search results.
1. Select **+ Create** or **Create network security group** button.
1. On the **Basics** tab, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |   |
    | Name | Enter **myNSG**. |
    | Region | Select **(US) West US 2**. |

1. Select *Review + create* tab, or select the blue **Review + create** button at the bottom of the page.
1. Select **Create**.
1. When deployment is complete, select **Go to resource**.
1. In the **Settings** section of the **myNSG** page, select **Inbound security rules**.
1. Select **+ Add**.
1. In the **Add inbound security rule** window, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Source | Select **Any**. |
    | Source port ranges | Enter **\***. |
    | Destination | Select **Any**. |
    | Service | Select **HTTP**. |
    | Action | Select **Allow**. |
    | Priority | Enter **100**. |
    | Name | Enter **allowHTTPrule**. |

1. Select **Add**.
## Create NAT gateway 

In this section, you'll create a NAT gateway for outbound connectivity of the virtual machines.

1. In the search box at the top of the portal, enter **NAT gateway**.
1. Select **NAT gateway** in the search results.
1. Select **+ Create** or **Create NAT Gateway** button.
1. In the **Basics** tab of **Create network address translation (NAT) gateway**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |   |
    | NAT gateway name | Enter **myNATgateway**. |
    | Region | Select **(US) West US 2**. |
    | Availability zone | Select **No Zone**. |
    | Idle timeout (minutes) | Enter **15**. |

1. Select the **Outbound IP** tab, or select the **Next: Outbound IP** button at the bottom of the page.
1. Select **Create a new public IP address** next to **Public IP addresses** in the **Outbound IP** tab.
1. Enter **myNATgatewayIP** in **Name**.
1. Select **OK**.
1. Select the **Subnet** tab, or select the **Next: Subnet** button at the bottom of the page.
1. Select **myVNet** in the pull-down menu under **Virtual network**.
1. Select the check box next to **myBackendSubnet**.
1. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.
1. Select **Create**.

## Create load balancer

In this section, you'll create a load balancer for the virtual machines.

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.
1. In the **Load balancer** page, select **Create** or the **Create load balancer** button.
1. In the **Basics** tab of the **Create load balancer** page, enter, or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Project details** |   |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **myResourceGroup**. |
    | **Instance details** |   |
    | Name                   | Enter **myLoadBalancer**                                   |
    | Region         | Select **(US) West US 2**.  |
    | SKU           | Leave the default **Standard**. |
    | Type          | Select **Public**.                                        |
    | Tier          | Leave the default **Regional**. |

1. Select the **Frontend IP configuration** tab, or select the **Next: Frontend IP configuration** button at the bottom of the page.
1. In **Frontend IP configuration**, select **+ Add a frontend IP configuration**.
1. Enter **myLoadBalancerFrontEnd** in **Name**.
1. Select **IPv4** or **IPv6** for the **IP version**.

    > [!NOTE]
    > IPv6 isn't currently supported with Routing Preference or Cross-region load-balancing (Global Tier).
1. Select **IP address** for the **IP type**.

    > [!NOTE]
    > For more information on IP prefixes, see [Azure Public IP address prefix](../virtual-network/ip-services/public-ip-address-prefix.md).
1. Select **Create new** in **Public IP address**.
1. In **Add a public IP address**, enter **myPublicIP-lb** for **Name**.
1. Select **Zone-redundant** in **Availability zone**.

    > [!NOTE]
    > In regions with [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones), you have the option to select no zone (default option), a specific zone, or zone-redundant. The choice will depend on your specific domain failure requirements. In regions without Availability Zones, this field won't appear. </br> For more information on availability zones, see [Availability zones overview](../availability-zones/az-overview.md).

1. Select **OK**.
1. Select **Add**.
1. Select the **Next: Backend pools>** button at the bottom of the page.
1. In the **Backend pools** tab, select **+ Add a backend pool**.
1. Enter **myBackendPool** for **Name** in **Add backend pool**.
1. Select **myVNet** in **Virtual network**.
1. Select **IP Address** for **Backend Pool Configuration** and select **Save**.
1. Select the **Inbound rules** tab, or select the **Next: Inbound rules** button at the bottom of the page.
1. In **Load balancing rule** in the **Inbound rules** tab, select **+ Add a load balancing rule**.
1. In **Add load balancing rule**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHTTPRule** |
    | IP Version | Select **IPv4** or **IPv6** depending on your requirements. |
    | Frontend IP address | Select **myLoadBalancerFrontEnd**. |
    | Backend pool | Select **myBackendPool**. |
    | Protocol | Select **TCP**. |
    | Port | Enter **80**. |
    | Backend port | Enter **80**. |
    | Health probe | Select **Create new**. </br> In **Name**, enter **myHealthProbe**. </br> Select **HTTP** in **Protocol**. </br> Leave the rest of the defaults, and select **Save**. |
    | Session persistence | Select **None**. |
    | Idle timeout (minutes) | Enter **15**. |
    | Enable TCP reset | Select checkbox. |
    | Enable Floating IP | Select checkbox. |
    | Outbound source network address translation (SNAT) | Leave the default of **(Recommended) Use outbound rules to provide backend pool members access to the internet.** |

1. Select **Save**.
1. Select the blue **Review + create** button at the bottom of the page.
1. Select **Create**.

    > [!NOTE]
    > In this example we created a NAT gateway to provide outbound Internet access. The outbound rules tab in the configuration is bypassed as it's optional and isn't needed with the NAT gateway. For more information on Azure NAT gateway, see [What is Azure Virtual Network NAT?](../virtual-network/nat-gateway/nat-overview.md)
    > For more information about outbound connections in Azure, see [Source Network Address Translation (SNAT) for outbound connections](../load-balancer/load-balancer-outbound-connections.md)

## Create virtual machines

In this section, you'll create two availability groups with two virtual machines per group. These machines will be added to the backend pool of the load balancer during creation. 

### Create first set of VMs

1. Select **+ Create a resource** in the upper left-hand section of the portal.
1. In **New**, select **Compute** > **Virtual machine**.
1. In the **Basics** tab of **Create a virtual machine**, enter, or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **myVM1**. |
    | Region | Select **(US) West US 2**. |
    | Availability options | Select **Availability set**. |
    | Availability set | Select **Create new**. </br> Enter **myAvailabilitySet1** in **Name**. </br> Select **OK**. |
    | Security type | Select **Trusted launch virtual machines**. |
    | Image | Select **Windows Server 2022 Datacenter - x64 Gen2**. |
    | Azure Spot instance | Leave the default of unchecked. |
    | Size | Select a size for the virtual machine. |
    | **Administrator account** |   |
    | Username | Enter a username. |
    | Password | Enter a password. |

1. Select the **Networking** tab, or select the **Next: Disks**, then **Next: Networking** button at the bottom of the page.
1. In the **Networking** tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **myBackendSubnet**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Skip this setting until the rest of the settings are completed. Complete after **Select a backend pool**.|
    | **Load balancing** |   |
    | Load-balancing options | Select **Azure load balancer**. |
    | Select a load balancer | Select **myLoadBalancer**. |
    | Select a backend pool | Select **myBackendPool**. |
    | Configure network security group | Select **Create new**. </br> In the **Create network security group**, enter **myNSG** in **Name**. </br> Under **Inbound rules**, select **+Add an inbound rule**. </br> Under  **Service**, select **HTTP**. </br> Under **Priority**, enter **100**. </br> In **Name**, enter **myNSGRule** </br> Select **Add** </br> Select **OK** |

1. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.
1. Select **Create**.
1. Repeat steps 1 through 7 to create the second virtual machine of the set. Replace the settings for the VM with the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myVM2**. |
    | Availability set | Select **myAvailabilitySet1**. |
    | Virtual Network | Select **myVNet**. |
    | Subnet | Select **myBackendSubnet**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Skip this setting until the rest of the settings are completed. Complete after **Select a backend pool**.|
    | Load-balancing options | Select **Azure load balancer**. |
    | Select a load balancer | Select **myLoadBalancer**. |
    | Select a backend pool | Select **myBackendPool**. |
    | Configure network security group | Select **myNSG**. |

### Create second set of VMs

1. Select **+ Create a resource** in the upper left-hand section of the portal.
1. In **New**, select **Compute** > **Virtual machine**.
1. In the **Basics** tab of **Create a virtual machine**, enter, or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **myVM3**. |
    | Region | Select **(US) West US 2**. |
    | Availability options | Select **Availability set**. |
    | Availability set | Select **Create new**. </br> Enter **myAvailabilitySet2** in **Name**. </br> Select **OK**. |
    | Security type | Select **Trusted launch virtual machines**. |
    | Image | Select **Windows Server 2022 Datacenter - x64 Gen2**. |
    | Azure Spot instance | Leave the default of unchecked. |
    | Size | Select a size for the virtual machine. |
    | **Administrator account** |   |
    | Username | Enter a username. |
    | Password | Enter a password. |

1. Select the **Networking** tab, or select the **Next: Disks**, then **Next: Networking** button at the bottom of the page.
1. In the **Networking** tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **myBackendSubnet**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Skip this setting until the rest of the settings are completed. Complete after **Select a backend pool**.| 
    | **Load balancing** |   |
    | Load-balancing options | Select **Azure load balancer**. |
    | Select a load balancer | Select **myLoadBalancer**. |
    | Select a backend pool | Select **myBackendPool**. |
    | Configure network security group | Select **myNSG**. |

6. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

7. Select **Create**.

8. Repeat steps 1 through 7 to create the second virtual machine of the set. Replace the settings for the VM with the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myVM4**. |
    | Availability set | Select **myAvailabilitySet2**. |
    | Virtual Network | Select **myVM3**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Skip this setting until the rest of the settings are completed. Complete after **Select a backend pool**.|
    | Load-balancing options | Select **Azure load balancer**. |
    | Select a load balancer | Select **myLoadBalancer**. |
    | Select a backend pool | Select **myBackendPool**. |
    | Configure network security group | Select **myNSG**. |

## Install IIS

In this section, you'll use the Azure Bastion host you created previously to connect to the virtual machines and install IIS.

1. In the search box at the top of the portal, enter **Virtual machine**.
1. Select **Virtual machines** in the search results.
1. Select **myVM1**.
1. Under **Operations** in the left-side menu, select **Run command > RunPowerShellScript**.
1. In the PowerShell Script window, add the following commands to:

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
1. Select **Run** and wait for the command to complete.

    :::image type="content" source="media/tutorial-multi-availability-sets-portal/run-command-script.png" alt-text="Screenshot of Run Command Script window with PowerShell code and output.":::

1. Repeat steps 1 through 8 for **myVM2**, **myVM3**, and **myVM4**.

## Test the load balancer

In this section, you'll discover the public IP address of the load balancer. You'll use the IP address to test the operation of the load balancer.

1. In the search box at the top of the portal, enter **Public IP**.
1. Select **Public IP addresses** in the search results.
1. Select **myPublicIP-lb**.
1. Note the public IP address listed in **IP address** in the **Overview** page of **myPublicIP-lb**:

    :::image type="content" source="./media/tutorial-multi-availability-sets-portal/find-public-ip.png" alt-text="Find the public IP address of the load balancer." border="true":::

1. Open a web browser and enter the public IP address in the address bar:

    :::image type="content" source="./media/tutorial-multi-availability-sets-portal/verify-load-balancer.png" alt-text="Test load balancer with web browser." border="true":::

1. Select refresh in the browser to see the traffic balanced to the other virtual machines in the backend pool.

## Clean up resources

If you're not going to continue to use this application, delete
the load balancer and the supporting resources with the following steps:

1. In the search box at the top of the portal, enter **Resource group**.
1. Select **Resource groups** in the search results.
1. Select **myResourceGroup**.
1. In the overview page of **myResourceGroup**, select **Delete resource group**.
1.Select **Apply force delete for selected Virtual Machines and Virtual machine scale sets**.
1. Enter **myResourceGroup** in **Enter resource group name to confirm deletion**.
1. Select **Delete**.

## Next steps

In this tutorial, you:

* Created a virtual network and a network security group.
* Created an Azure Standard Load Balancer.
* Created two availability sets with two virtual machines per set.
* Installed IIS and tested the load balancer.

Advance to the next article to learn how to create a cross-region Azure Load Balancer:
> [!div class="nextstepaction"]
> [Create a cross-region load balancer](tutorial-cross-region-portal.md)
