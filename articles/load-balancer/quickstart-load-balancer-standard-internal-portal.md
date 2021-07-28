---
title: "Quickstart: Create an internal load balancer - Azure portal"
titleSuffix: Azure Load Balancer
description: This quickstart shows how to create an internal load balancer by using the Azure portal.
services: load-balancer
documentationcenter: na
author: asudbring 
manager: KumudD
# Customer intent: I want to create a internal load balancer so that I can load balance internal traffic to VMs.
ms.service: load-balancer
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/30/2020
ms.author: allensu
ms.custom: mvc
---

# Quickstart: Create an internal load balancer to load balance VMs using the Azure portal

Get started with Azure Load Balancer by using the Azure portal to create an internal load balancer and three virtual machines.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

---

# [**Standard SKU**](#tab/option-1-create-internal-load-balancer-standard)

>[!NOTE]
>Standard SKU load balancer is recommended for production workloads.  For more information about SKUs, see **[Azure Load Balancer SKUs](skus.md)**.


When you create an internal load balancer, a virtual network is configured as the network for the load balancer. 

A private IP address in the virtual network is configured as the frontend (named as **LoadBalancerFrontend** by default) for the load balancer. 

The frontend IP address can be **Static** or **Dynamic**.

## Create the virtual network

In this section, you'll create a virtual network and subnet.

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual Networks** in the search results.

2. In **Virtual networks**, select **+ Create**.

2. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription                                  |
    | Resource Group   | Select **Create new**. </br> In **Name** enter **CreateIntLBQS-rg**. </br> Select **OK**. |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**                                    |
    | Region           | Select **(Europe) West Europe** |

3. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

4. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.1.0.0/16** |

5. Under **Subnet name**, select the word **default**.

6. In **Edit subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **myBackendSubnet** |
    | Subnet address range | Enter **10.1.0.0/24** |

7. Select **Save**.

8. Select the **Security** tab.

9. Under **BastionHost**, select **Enable**. Enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Bastion name | Enter **myBastionHost** |
    | AzureBastionSubnet address space | Enter **10.1.1.0/27** |
    | Public IP Address | Select **Create new**. </br> For **Name**, enter **myBastionIP**. </br> Select **OK**. |


8. Select the **Review + create** tab or select the **Review + create** button.

9. Select **Create**.

## Create NAT gateway

In this section, you'll create a NAT gateway for outbound internet access for resources in the virtual network. 

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

2. In **NAT gateways**, select **+ Create**.

3. In **Create network address translation (NAT) gateway**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **CreateIntLBQS-rg**. |
    | **Instance details** |    |
    | NAT gateway name | Enter **myNATgateway**. |
    | Availability zone | Select **None**. |
    | Idle timeout (minutes) | Enter **15**. |

4. Select the **Outbound IP** tab or select the **Next: Outbound IP** button at the bottom of the page.

5. In **Outbound IP**, select **Create a new public IP address** next to **Public IP addresses**.

6. Enter **myNATgatewayIP** in **Name** in **Add a public IP address**.

7. Select **OK**.

8. Select the **Subnet** tab or select the **Next: Subnet** button at the bottom of the page.

9. In **Virtual network** in the **Subnet** tab, select **myVNet**.

10. Select **myBackendSubnet** under **Subnet name**.

11. Select the blue **Review + create** button at the bottom of the page, or select the **Review + create** tab.

12. Select **Create**.

## <a name="create-load-balancer-resources"></a> Create load balancer

In this section, you create a load balancer that load balances virtual machines.

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
    | Resource group         | Select **CreateIntLBQS-rg**. |
    | **Instance details** |   |
    | Name                   | Enter **myLoadBalancer**                                   |
    | Region         | Select **(Europe) West Europe**.                                        |
    | Type          | Select **Internal**.                                        |
    | SKU           | Leave the default **Standard**. |

4. Select **Next: Frontend IP configuration** at the bottom of the page.

5. In **Frontend IP configuration**, select **+ Add a frontend IP**.

6. Enter **LoadBalancerFrontend** in **Name**.

7. Select **myBackendSubnet** in **Subnet**.

8. Select **Dynamic** for **Assignment**.

11. Select **Zone-redundant** in **Availability zone**.

    > [!NOTE]
    > In regions with [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones), you have the option to select no-zone (default option), a specific zone, or zone-redundant. The choice will depend on your specific domain failure requirements. In regions without Availability Zones, this field won't appear. </br> For more information on availability zones, see [Availability zones overview](../availability-zones/az-overview.md).

13. Select **Add**.

15. Select **Next: Backend pools** at the bottom of the page.

16. In the **Backend pools** tab, select **+ Add a backend pool**.

17. Enter **myBackendPool** for **Name** in **Add backend pool**.

19. Select **NIC** or **IP Address** for **Backend Pool Configuration**.

20. Select **IPv4** or **IPv6** for **IP version**.

21. Select **Add**.

22. Select the **Next: Inbound rules** button at the bottom of the page.

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
    | Health probe | Select **Create new**. </br> In **Name**, enter **myHTTPProbe**. </br> Select **HTTP** in **Protocol**. </br> Leave the rest of the defaults, and select **OK**. |
    | Session persistence | Select **None**. |
    | Idle timeout (minutes) | Enter or select **15**. |
    | TCP reset | Select **Enabled**. |
    | Floating IP | Select **Disabled**. |

25. Select **Add**.

26. Select the blue **Review + create** button at the bottom of the page.

27. Select **Create**.

    > [!NOTE]
    > In this example we created a NAT gateway to provide outbound Internet access. The outbound rules tab in the configuration is bypassed and isn't needed with the NAT gateway. For more information on Azure NAT gateway, see [What is Azure Virtual Network NAT?](../virtual-network/nat-gateway/nat-overview.md)
    > For more information about outbound connections in Azure, see [Source Network Address Translation (SNAT) for outbound connections](../load-balancer/load-balancer-outbound-connections.md)

## Create virtual machines

In this section, you'll create three VMs (**myVM1**, **myVM2** and **myVM3**) in three different zones (**Zone 1**, **Zone 2**, and **Zone 3**). 

These VMs are added to the backend pool of the load balancer that was created earlier.

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Virtual machine**. 
   
2. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **CreateIntLBQS-rg** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM1** |
    | Region | Select **(Europe) West Europe** |
    | Availability Options | Select **Availability zones** |
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
    | Configure network security group | Select **Create new**. </br> In the **Create network security group**, enter **myNSG** in **Name**. </br> Under **Inbound rules**, select **+Add an inbound rule**. </br> Under  **Destination port ranges**, enter **80**. </br> Under **Priority**, enter **100**. </br> In **Name**, enter **myHTTPRule** </br> Select **Add** </br> Select **OK** |
    | **Load balancing**  |
    | Place this virtual machine behind an existing load balancing solution? | Select the box. |
    | **Load balancing settings** |
    | Load balancing options | Select **Azure load balancing** |
    | Select a load balancer | Select **myLoadBalancer**  |
    | Select a backend pool | Select **myBackendPool** |
   
7. Select **Review + create**. 
  
8. Review the settings, and then select **Create**.

9. Follow the steps 1 to 6 to create two additional VMs with the following values and all the other settings the same as **myVM1**:

    | Setting | VM 2| VM 3|
    | ------- | ----- |---|
    | Name |  **myVM2** |**myVM3**|
    | Availability zone | **2** |**3**|
    | Network security group | Select the existing **myNSG**| Select the existing **myNSG**|

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]


# [**Basic SKU**](#tab/option-2-create-load-balancer-basic)

>[!NOTE]
>Standard SKU load balancer is recommended for production workloads.  For more information about SKUs, see **[Azure Load Balancer SKUs](skus.md)**.

## Create the virtual network

In this section, you'll create a virtual network and subnet.

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual Networks** in the search results.

2. In **Virtual networks**, select **+ Create**.

2. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription                                  |
    | Resource Group   | Select **Create new**. </br> In **Name** enter **CreateIntLBQS-rg**. </br> Select **OK**. |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**                                    |
    | Region           | Select **(Europe) West Europe** |

3. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

4. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.1.0.0/16** |

5. Under **Subnet name**, select the word **default**.

6. In **Edit subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **myBackendSubnet** |
    | Subnet address range | Enter **10.1.0.0/27** |

7. Select **Save**.

8. Select the **Security** tab.

9. Under **BastionHost**, select **Enable**. Enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Bastion name | Enter **myBastionHost** |
    | AzureBastionSubnet address space | Enter **10.1.1.0/24** |
    | Public IP Address | Select **Create new**. </br> For **Name**, enter **myBastionIP**. </br> Select **OK**. |


8. Select the **Review + create** tab or select the **Review + create** button.

9. Select **Create**.

## Create load balancer

In this section, you create a load balancer that load balances virtual machines.

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
    | Resource group         | Select **CreateIntLBQS-rg**. |
    | **Instance details** |   |
    | Name                   | Enter **myLoadBalancer**                                   |
    | Region         | Select **(Europe) West Europe**.                                        |
    | Type          | Select **Internal**.                                        |
    | SKU           | Select **Basic**. |

4. Select **Next: Frontend IP configuration** at the bottom of the page.

5. In **Frontend IP configuration**, select **+ Add a frontend IP**.

6. Enter **LoadBalancerFrontend** in **Name**.

7. Select **myBackendSubnet** in **Subnet**.

8. Select **Dynamic** for **Assignment**.

13. Select **Add**.

15. Select **Next: Backend pools** at the bottom of the page.

16. In the **Backend pools** tab, select **+ Add a backend pool**.

17. Enter **myBackendPool** for **Name** in **Add backend pool**.

18. Select **Virtual machines** in **Associated to**.

20. Select **IPv4** or **IPv6** for **IP version**.

21. Select **Add**.

22. Select the **Next: Inbound rules** button at the bottom of the page.

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
    | Health probe | Select **Create new**. </br> In **Name**, enter **myHTTPProbe**. </br> Select **HTTP** in **Protocol**. </br> Leave the rest of the defaults, and select **OK**. |
    | Session persistence | Select **None**. |
    | Idle timeout (minutes) | Enter or select **15**. |
    | Floating IP | Select **Disabled**. |

25. Select **Add**.

26. Select the blue **Review + create** button at the bottom of the page.

27. Select **Create**.

    > [!NOTE]
    > In this example we created a NAT gateway to provide outbound Internet access. The outbound rules tab in the configuration is bypassed and isn't needed with the NAT gateway. For more information on Azure NAT gateway, see [What is Azure Virtual Network NAT?](../virtual-network/nat-gateway/nat-overview.md)
    > For more information about outbound connections in Azure, see [Source Network Address Translation (SNAT) for outbound connections](../load-balancer/load-balancer-outbound-connections.md)

## Create virtual machines

In this section, you'll create three VMs (**myVM1**, **myVM2**, and **myVM3**).

The three VMs will be added to an availability set named **myAvailabilitySet**.

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Virtual machine**. 
   
2. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **CreateIntLBQS-rg** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM1** |
    | Region | Select **(Europe) West Europe** |
    | Availability Options | Select **Availability set** |
    | Availability set | Select **Create new**. </br> Enter **myAvailabilitySet** in **Name**. </br> Select **OK** |
    | Image | **Windows Server 2019 Datacenter - Gen1** |
    | Azure Spot instance | Leave the default of unchecked. |
    | Size | Choose VM size or take default setting |
    | **Administrator account** |  |
    | Username | Enter a username |
    | Password | Enter a password |
    | Confirm password | Reenter password |
    | **Inbound port rules** |   |
    | Public inbound ports | Select **None**. |

3. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
4. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | Select **myVNet** |
    | Subnet | Select **myBackendSubnet** |
    | Public IP | Select **None** |
    | NIC network security group | Select **Advanced**|
    | Configure network security group | Select **Create new**. </br> In the **Create network security group**, enter **myNSG** in **Name**. </br> Under **Inbound rules**, select **+Add an inbound rule**. </br> Under  **Destination port ranges**, enter **80**. </br> Under **Priority**, enter **100**. </br> In **Name**, enter **myHTTPRule** </br> Select **Add** </br> Select **OK** |
    | **Load balancing**  |
    | Place this virtual machine behind an existing load balancing solution? | Select the box |
    | **Load balancing settings** |   |
    | Load balancing options | Select **Azure load balancer**. |
    | Select a load balancer | Select **myLoadBalancer**>. |
    | Select a backend pool | Select **myBackendPool**. |
 
7. Select **Review + create**. 
  
8. Review the settings, and then select **Create**.

9. Follow the steps 1 to 8 to create two additional VMs with the following values and all the other settings the same as **myVM1**:

    | Setting | VM 2 | VM 3 |
    | ------- | ----- |---|
    | Name |  **myVM2** |**myVM3**|
    | Availability set| Select **myAvailabilitySet** | Select **myAvailabilitySet**|
    | Network security group | Select the existing **myNSG**| Select the existing **myNSG**|

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]
---

## Create test virtual machine

In this section, you'll create a VM named **myTestVM**.  This VM will be used to test the load balancer configuration.

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Virtual machine**. 
   
2. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **CreateIntLBQS-rg** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myTestVM** |
    | Region | Select **(Europ) West Europe** |
    | Availability Options | Select **No infrastructure redundancy required** |
    | Image | Select **Windows Server 2019 Datacenter** |
    | Azure Spot instance | Leave the default of unselected. |
    | Size | Choose VM size or take default setting |
    | **Administrator account** |  |
    | Username | Enter a username |
    | Password | Enter a password |
    | Confirm password | Reenter password |
    | **Inbound port rules** |   |
    | Public inbound ports | Select **None**. |

3. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
4. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | **myVNet** |
    | Subnet | **myBackendSubnet** |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced** |
    | Configure network security group | Select **MyNSG** created in the previous step.|
       
5. Select **Review + create**. 
  
6. Review the settings, and then select **Create**.

## Install IIS

1. Select **All services** in the left-hand menu, select **All resources**, and then from the resources list, select **myVM1** that is located in the **CreateIntLBQS-rg** resource group.

2. On the **Overview** page, select **Connect**, then **Bastion**.

3. Select **Use Bastion**. 

4. Enter the username and password entered during VM creation.

5. Select **Connect**.

6. On the server desktop, navigate to **Windows Administrative Tools** > **Windows PowerShell**.

7. In the PowerShell Window, run the following commands to:

    * Install the IIS server.
    * Remove the default iisstart.htm file.
    * Add a new iisstart.htm file that displays the name of the VM.

   ```powershell
    
    # Install IIS server role
    Install-WindowsFeature -name Web-Server -IncludeManagementTools
    
    # Remove default htm file
    Remove-Item  C:\inetpub\wwwroot\iisstart.htm
    
    # Add a new htm file that displays server name
    Add-Content -Path "C:\inetpub\wwwroot\iisstart.htm" -Value $("Hello World from " + $env:computername)
   ```

8. Close the Bastion session with **myVM1**.

9. Repeat steps 1 to 6 to install IIS and the updated iisstart.htm file on **myVM2** and **myVM3**.


## Test the load balancer

1. Find the private IP address for the load balancer on the **Overview** screen. Select **All services** in the left-hand menu, select **All resources**, and then select **myLoadBalancer**.

2. Make note or copy the address next to **Private IP Address** in the **Overview** of **myLoadBalancer**.

3. Select **All services** in the left-hand menu, select **All resources**, and then from the resources list, select **myTestVM** that is located in the **CreateIntLBQS-rg** resource group.

4. On the **Overview** page, select **Connect**, then **Bastion**.

5. Select **Use Bastion**.

6. Enter the username and password entered during VM creation.

7. Open **Internet Explorer** on **myTestVM**.

8. Enter the IP address from the previous step into the address bar of the browser. The custom page displaying one of the backend server names is displayed on the browser.

    :::image type="content" source="./media/quickstart-load-balancer-standard-internal-portal/load-balancer-test.png" alt-text="Screenshot shows a browser window displaying the default page, as expected." border="true":::
   
To see the load balancer distribute traffic across both VMs, you can force-refresh your web browser from the client machine.

## Clean up resources

When no longer needed, delete the resource group, load balancer, and all related resources. To do so, select the resource group **CreateIntLBQS-rg** that contains the resources and then select **Delete**.

## Next steps

In this quickstart, you:

* Created an Azure standard or basic internal load balancer
* Attached 3 VMs to the load balancer.
* Configured the load balancer traffic rule, health probe, and then tested the load balancer. 

To learn more about Azure Load Balancer, continue to:
> [!div class="nextstepaction"]
> [What is Azure Load Balancer?](load-balancer-overview.md)