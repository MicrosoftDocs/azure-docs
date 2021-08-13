---
title: "Quickstart: Create an internal load balancer - Azure portal"
titleSuffix: Azure Load Balancer
description: This quickstart shows how to create an internal load balancer by using the Azure portal.
services: load-balancer
author: asudbring 
ms.service: load-balancer
ms.topic: quickstart
ms.date: 08/09/2021
ms.author: allensu
ms.custom: mvc
# Customer intent: I want to create a internal load balancer so that I can load balance internal traffic to VMs.
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

3. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription                                  |
    | Resource Group   | Select **Create new**. </br> In **Name** enter **CreateIntLBQS-rg**. </br> Select **OK**. |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**                                    |
    | Region           | Select **(Europe) West Europe** |

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

3. In the **Basics** tab of the **Create load balancer** page, enter, or select the following information: 

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

    :::image type="content" source="./media/quickstart-load-balancer-standard-internal-portal/create-standard-internal-load-balancer.png" alt-text="Screenshot of create standard load balancer basics tab." border="true":::

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

13. Enter **myBackendPool** for **Name** in **Add backend pool**.

14. Select **NIC** or **IP Address** for **Backend Pool Configuration**.

15. Select **IPv4** or **IPv6** for **IP version**.

16. Select **Add**.

17. Select the **Next: Inbound rules** button at the bottom of the page.

18. In **Load balancing rule** in the **Inbound rules** tab, select **+ Add a load balancing rule**.

19. In **Add load balancing rule**, enter or select the following information:

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

20. Select **Add**.

21. Select the blue **Review + create** button at the bottom of the page.

22. Select **Create**.

    > [!NOTE]
    > In this example you created a NAT gateway to provide outbound Internet access. The outbound rules tab in the configuration is bypassed and isn't needed with the NAT gateway. For more information on Azure NAT gateway, see [What is Azure Virtual Network NAT?](../virtual-network/nat-gateway/nat-overview.md)
    > For more information about outbound connections in Azure, see [Source Network Address Translation (SNAT) for outbound connections](../load-balancer/load-balancer-outbound-connections.md)

## Create virtual machines

In this section, you'll create three VMs (**myVM1**, **myVM2** and **myVM3**) in three different zones (**Zone 1**, **Zone 2**, and **Zone 3**). 

These VMs are added to the backend pool of the load balancer that was created earlier.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. In **Virtual machines**, select **+ Create** > **Virtual machine**.
   
3. In **Create a virtual machine**, enter or select the values in the **Basics** tab:

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

4. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
5. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | **myVNet** |
    | Subnet | **myBackendSubnet** |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**|
    | Configure network security group | Select **Create new**. </br> In the **Create network security group**, enter **myNSG** in **Name**. </br> Under **Inbound rules**, select **+Add an inbound rule**. </br> Under  **Destination port ranges**, enter **80**. </br> Under **Priority**, enter **100**. </br> In **Name**, enter **myNSGRule** </br> Select **Add** </br> Select **OK** |
    | **Load balancing**  |
    | Place this virtual machine behind an existing load-balancing solution? | Select the box. |
    | **Load balancing settings** |
    | Load-balancing options | Select **Azure load balancing** |
    | Select a load balancer | Select **myLoadBalancer**  |
    | Select a backend pool | Select **myBackendPool** |
   
6. Select **Review + create**. 
  
7. Review the settings, and then select **Create**.

8. Follow the steps 1 through 7 to create two more VMs with the following values and all the other settings the same as **myVM1**:

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

3. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription                                  |
    | Resource Group   | Select **Create new**. </br> In **Name** enter **CreateIntLBQS-rg**. </br> Select **OK**. |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**                                    |
    | Region           | Select **(Europe) West Europe** |

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
    | Subnet address range | Enter **10.1.0.0/27** |

8. Select **Save**.

9. Select the **Security** tab.

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
    | Resource group         | Select **CreateIntLBQS-rg**. |
    | **Instance details** |   |
    | Name                   | Enter **myLoadBalancer**                                   |
    | Region         | Select **(Europe) West Europe**.                                        |
    | Type          | Select **Internal**.                                        |
    | SKU           | Select **Basic**. |

    :::image type="content" source="./media/quickstart-load-balancer-standard-internal-portal/create-basic-internal-load-balancer.png" alt-text="Screenshot of create standard load balancer basics tab." border="true":::

4. Select **Next: Frontend IP configuration** at the bottom of the page.

5. In **Frontend IP configuration**, select **+ Add a frontend IP**.

6. Enter **LoadBalancerFrontend** in **Name**.

7. Select **myBackendSubnet** in **Subnet**.

8. Select **Dynamic** for **Assignment**.

9. Select **Add**.

10. Select **Next: Backend pools** at the bottom of the page.

11. In the **Backend pools** tab, select **+ Add a backend pool**.

12. Enter **myBackendPool** for **Name** in **Add backend pool**.

13. Select **Virtual machines** in **Associated to**.

14. Select **IPv4** or **IPv6** for **IP version**.

15. Select **Add**.

16. Select the **Next: Inbound rules** button at the bottom of the page.

17. In **Load balancing rule** in the **Inbound rules** tab, select **+ Add a load balancing rule**.

18. In **Add load balancing rule**, enter or select the following information:

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
    | Floating IP | Select **Disabled**. |

19. Select **Add**.

20. Select the blue **Review + create** button at the bottom of the page.

21. Select **Create**.

    > [!NOTE]
    > In this example we created a NAT gateway to provide outbound Internet access. The outbound rules tab in the configuration is bypassed and isn't needed with the NAT gateway. For more information on Azure NAT gateway, see [What is Azure Virtual Network NAT?](../virtual-network/nat-gateway/nat-overview.md)
    > For more information about outbound connections in Azure, see [Source Network Address Translation (SNAT) for outbound connections](../load-balancer/load-balancer-outbound-connections.md)

## Create virtual machines

In this section, you'll create three VMs (**myVM1**, **myVM2**, and **myVM3**).

The three VMs will be added to an availability set named **myAvailabilitySet**.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. In **Virtual machines**, select **+ Create** > **Virtual machine**.
   
3. In **Create a virtual machine**, type or select the values in the **Basics** tab:

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

4. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
5. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | Select **myVNet** |
    | Subnet | Select **myBackendSubnet** |
    | Public IP | Select **None** |
    | NIC network security group | Select **Advanced**|
    | Configure network security group | Select **Create new**. </br> In the **Create network security group**, enter **myNSG** in **Name**. </br> Under **Inbound rules**, select **+Add an inbound rule**. </br> Under  **Destination port ranges**, enter **80**. </br> Under **Priority**, enter **100**. </br> In **Name**, enter **myNSGRule** </br> Select **Add** </br> Select **OK** |
    | **Load balancing**  |
    | Place this virtual machine behind an existing load-balancing solution? | Select the box |
    | **Load balancing settings** |   |
    | Load-balancing options | Select **Azure load balancer**. |
    | Select a load balancer | Select **myLoadBalancer**>. |
    | Select a backend pool | Select **myBackendPool**. |
 
6. Select **Review + create**. 
  
7. Review the settings, and then select **Create**.

8. Follow the steps 1 through 7 to create two more VMs with the following values and all the other settings the same as **myVM1**:

    | Setting | VM 2 | VM 3 |
    | ------- | ----- |---|
    | Name |  **myVM2** |**myVM3**|
    | Availability set| Select **myAvailabilitySet** | Select **myAvailabilitySet**|
    | Network security group | Select the existing **myNSG**| Select the existing **myNSG**|

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]
---

## Create test virtual machine

In this section, you'll create a VM named **myTestVM**.  This VM will be used to test the load balancer configuration.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. In **Virtual machines**, select **+ Create** > **Virtual machine**.
   
2. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **CreateIntLBQS-rg** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myTestVM** |
    | Region | Select **(Europe) West Europe** |
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
  
4. In the **Networking** tab, select or enter:

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

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **myVM1**.

3. In the **Overview** page, select **Connect**, then **Bastion**.

4. Select **Use Bastion**. 

5. Enter the username and password entered during VM creation.

6. Select **Connect**.

7. On the server desktop, navigate to **Windows Administrative Tools** > **Windows PowerShell** > **Windows PowerShell**.

8. In the PowerShell Window, execute the following commands to:

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

9. Close the Bastion session with **myVM1**.

10. Repeat steps 1 through 9 to install IIS and the updated iisstart.htm file on **myVM2** and **myVM3**.

## Test the load balancer

In this section, you'll test the load balancer by connecting to the **myTestVM** and verifying the webpage.

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

2. Select **myLoadBalancer**.

3. Make note or copy the address next to **Private IP Address** in the **Overview** of **myLoadBalancer**.

4. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

5. Select **myTestVM**.

6. In the **Overview** page, select **Connect**, then **Bastion**.

7. Select **Use Bastion**.

8. Enter the username and password entered during VM creation.

9. Open **Internet Explorer** on **myTestVM**.

10. Enter the IP address from the previous step into the address bar of the browser. The custom page displaying one of the backend server names is displayed on the browser.

    :::image type="content" source="./media/quickstart-load-balancer-standard-internal-portal/load-balancer-test.png" alt-text="Screenshot shows a browser window displaying the customized page, as expected." border="true":::
   
To see the load balancer distribute traffic across both VMs, you can force-refresh your web browser from the client machine.

## Clean up resources

When no longer needed, delete the resource group, load balancer, and all related resources. To do so, select the resource group **CreateIntLBQS-rg** that contains the resources and then select **Delete**.

## Next steps

In this quickstart, you:

* Created an Azure Standard or Basic Internal Load Balancer
* Attached 3 VMs to the load balancer.
* Configured the load balancer traffic rule, health probe, and then tested the load balancer. 

To learn more about Azure Load Balancer, continue to:
> [!div class="nextstepaction"]
> [What is Azure Load Balancer?](load-balancer-overview.md)