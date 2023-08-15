---
title: "Tutorial: Load balance VMs within an availability zone - Azure portal"
titleSuffix: Azure Load Balancer
description: This tutorial demonstrates how to create a Standard Load Balancer with zonal frontend to load balance VMs within an availability zone by using Azure portal.
services: load-balancer
author: mbender-ms
# Customer intent: As an IT administrator, I want to create a load balancer that load balances incoming internet traffic to virtual machines within a specific zone in a region. 
ms.service: load-balancer
ms.topic: tutorial
ms.date: 12/05/2022
ms.author: mbender
ms.custom: template-tutorial, seodec18
---

# Tutorial: Load balance VMs within an availability zone by using the Azure portal

This tutorial creates a public [load balancer](https://aka.ms/azureloadbalancerstandard) with a zonal IP. In the tutorial, you specify a zone for your frontend and backend instances.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network with an Azure Bastion host for management.
> * Create a NAT gateway for outbound internet access of the resources in the virtual network.
> * Create a load balancer with a health probe and traffic rules.
> * Create zonal virtual machines (VMs) and attach them to a load balancer.
> * Create a basic Internet Information Services (IIS) site.
> * Test the load balancer.

For more information about availability zones and a standard load balancer, see [Standard load balancer and availability zones](load-balancer-standard-availability-zones.md).

## Prerequisites

* An Azure subscription

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create the virtual network

In this section, you'll create a virtual network and subnet.

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual Networks** in the search results.

2. In **Virtual networks**, select **+ Create**.

3. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription                                  |
    | Resource Group   | Select **Create new**. </br> In **Name** enter **CreateZonalLBTutorial-rg**. </br> Select **OK**. |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**                                    |
    | Region           | Select **(Europe) West Europe** |

4. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

5. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.1.0.0/16** |

6. Select **+ Add subnet**.

7. On the **Add subnet** page, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **myBackendSubnet** |
    | Subnet address range | Enter **10.1.0.0/24** |

8. Select **Add**.

9. Select the **Security** tab.

10. Under **BastionHost**, select **Enable**. Enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Bastion name | Enter **myBastionHost** |
    | AzureBastionSubnet address space | Enter **10.1.1.0/26** |
    | Public IP Address | Select **Create new**. </br> For **Name**, enter **myBastionIP**. </br> Select **OK**. |

11. Select the **Review + create** tab or select the **Review + create** button.

12. Select **Create**.

> [!IMPORTANT]

> [!INCLUDE [Pricing](../../includes/bastion-pricing.md)]

>

## Create NAT gateway

In this section, you'll create a NAT gateway for outbound internet access for resources in the virtual network.

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

2. In **NAT gateways**, select **+ Create**.

3. In **Create network address translation (NAT) gateway**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **CreateZonalLBTutorial-rg**. |
    | **Instance details** |    |
    | NAT gateway name | Enter **myNATgateway**. |
    | Availability zone | Select **1**. |
    | Idle timeout (minutes) | Enter **15**. |

4. Select the **Outbound IP** tab or select the **Next: Outbound IP** button at the bottom of the page.

5. In **Outbound IP**, for **Public IP addresses**, select **Create a new public IP address**.

6. On the **Add a public IP address** page, for **Name**, enter **myNATGatewayIP**.

7. Select **OK**.

8. Select the **Subnet** tab or select the **Next: Subnet** button at the bottom of the page.

9. On the **Subnet** page, for **Virtual network**, select **myVNet** from the dropdown.

10. For **Subnet name**, select **myBackendSubnet**.

11. Select the **Review + create** button at the bottom of the page, or select the **Review + create** tab.

12. Select **Create**.

## Create load balancer

In this section, you'll create a zonal load balancer that load balances virtual machines.

During the creation of the load balancer, you'll configure:

* Frontend IP address
* Backend pool
* Inbound load-balancing rules

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

2. In the **Load balancer** page, select **Create**.

3. In the **Basics** tab of the **Create load balancer** page, enter or select the following information:

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Project details** |   |
    | Subscription               | Select your subscription.    |
    | Resource group         | Select **CreateZonalLBTutorial-rg**. |
    | **Instance details** |   |
    | Name                   | Enter **myLoadBalancer**                                   |
    | Region         | Select **(Europe) West Europe**.                                        |
   | SKU           | Leave the default **Standard**. |
    | Type          | Select **Public**.                                        |
     | Tier          | Leave the default **Regional**. |

4. Select **Next: Frontend IP configuration** at the bottom of the page.

5. In **Frontend IP configuration**, select **+ Add a frontend IP configuration**.

6. For **Name**, type **LoadBalancerFrontend**.

7. For **IP version**, select either **IPv4** or **IPv6**.

    > [!NOTE]
    > IPv6 isn't currently supported with Routing Preference or Cross-region load-balancing (Global Tier).

8. For **IP type**, select **IP address**.

    > [!NOTE]
    > For more information on IP prefixes, see [Azure Public IP address prefix](../virtual-network/ip-services/public-ip-address-prefix.md).

9. For **Public IP address**, select **Create new**.

10. On the **Add a public IP address** page, for **Name**, enter **myPublicIP**.

11. For **Availability zone**, select **1** from the dropdown, then click **OK** to close the **Add a public IP address** page.

    > [!NOTE]
    > In regions with [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones), you have the option to select no-zone (default option), a specific zone, or zone-redundant. The choice will depend on your specific domain failure requirements. In regions without Availability Zones, this field won't appear. </br> For more information on availability zones, see [Availability zones overview](../availability-zones/az-overview.md).

12. If you see **Routing preference** settings, leave the default of **Microsoft Network** for **Routing preference**.

13. Select **OK**.

14. Select **Add**.

15. At the bottom of the page, select **Next: Backend pools**.

16. On the **Backend pools** page, select **+ Add a backend pool**.

17. On the **Add backend pool** page, for **Name**, type **myBackendPool**.

18. For **Virtual network**, select **myVNet** from the dropdown.

19. For **Backend Pool Configuration**, select either **NIC** or **IP Address**.

20. Select **Save**.

21. At the bottom of the page, select the **Next: Inbound rules** button.

22. On the **Inbound rules** page, for **Load balancing rule**, select **+ Add a load balancing rule**.

23. On the **Add load balancing rule** page, enter or select the following information:

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
    | Outbound source network address translation (SNAT) | Leave the default of **(Recommended) Use outbound rules to provide backend pool members access to the internet.** |

24. Select **Add**.

25. At the bottom of the page, select the **Review + create** button.

26. Select **Create**.

    > [!NOTE]
    > In this example we created a NAT gateway to provide outbound Internet access. The outbound rules tab in the configuration is bypassed as it's optional isn't needed with the NAT gateway. For more information on Azure NAT gateway, see [What is Azure Virtual Network NAT?](../virtual-network/nat-gateway/nat-overview.md)
    > For more information about outbound connections in Azure, see [Source Network Address Translation (SNAT) for outbound connections](../load-balancer/load-balancer-outbound-connections.md)

## Create virtual machines

In this section, you'll create three VMs (**myVM1**, **myVM2**, and **myVM3**) in one zone (**Zone 1**).

These VMs are added to the backend pool of the load balancer that was created earlier.

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Virtual machine**.

2. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **CreateZonalLBTutorial-rg** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM1** |
    | Region | Select **(Europe) West Europe** |
    | Availability Options | Select **Availability zone** |
    | Availability zone | Select **1** |
    | Image | Select **Windows Server 2019 Datacenter - Gen1** |
    | Azure Spot instance | Leave the default of unchecked. |
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
    | Configure network security group | Select **Create new**. </br> In the **Create network security group**, enter **myNSG** in **Name**. </br> Under **Inbound rules**, select **+Add an inbound rule**. </br> Under  **Service**, select **HTTP**. </br> Under **Priority**, enter **100**. </br> In **Name**, enter **myNSGRule** </br> Select **Add** </br> Select **OK** |
    | **Load balancing**  |
    | Place this virtual machine behind an existing load-balancing solution? | Select the check box. |
    | **Load balancing settings** |
    | Load-balancing options | Select **Azure load balancing** |
    | Select a load balancer | Select **myLoadBalancer**  |
    | Select a backend pool | Select **myBackendPool** |
   
7. Select **Review + create**. 
  
8. Review the settings, and then select **Create**.

9. Follow the steps 1 to 8 to create two more VMs with the following values and all the other settings the same as **myVM1**:

    | Setting | VM 2| VM 3|
    | ------- | ----- |---|
    | Name |  **myVM2** |**myVM3**|
    | Availability zone | **1** |**1**|
    | Network security group | Select the existing **myNSG**| Select the existing **myNSG**|

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Install IIS

1. Select **All services** in the left-hand menu, select **All resources**, and then from the resources list, select **myVM1** that is located in the **CreateZonalLBTutorial-rg** resource group.

2. On the **Overview** page, select **Connect**, then **Bastion**.

3. Select **Use Bastion**.

4. Enter the username and password entered during VM creation.

5. Select **Connect**.

6. On the server desktop, navigate to **Windows Administrative Tools** > **Windows PowerShell**.

7. In the PowerShell Window, run the following commands to:

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

9. Repeat steps 1 to 8 to install IIS and the updated iisstart.htm file on **myVM2** and **myVM3**.

## Test the load balancer

1. In the search box at the top of the page, enter **Load balancer**. Select **Load balancers** in the search results.

2. Click the load balancer you created, **myLoadBalancer**. On the **Frontend IP configuration** page for your load balancer, locate the public **IP address**.

3. Copy the public IP address, and then paste it into the address bar of your browser. The custom VM page of the IIS Web server is displayed in the browser.

    :::image type="content" source="./media/tutorial-load-balancer-standard-zonal-portal/load-balancer-test.png" alt-text="Screenshot of load balancer test":::

## Clean up resources

When no longer needed, delete the resource group, load balancer, and all related resources. To do so, select the resource group **CreateZonalLBTutorial-rg** that contains the resources and then select **Delete**.

## Next steps

Advance to the next article to learn how to load balance VMs across availability zones:
> [!div class="nextstepaction"]
> [Load balance VMs across availability zones](./quickstart-load-balancer-standard-public-portal.md)
