---
title: 'Tutorial: Load balance multiple IP configurations - Azure portal'
titleSuffix: Azure Load Balancer
description: In this article, learn about load balancing across primary and secondary NIC configurations using the Azure portal.
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: tutorial
ms.date: 08/08/2021
ms.custom: template-tutorial
---

# Tutorial: Load balance multiple IP configurations using the Azure portal 

To host multiple websites, you can use another network interface associated with a virtual machine. Azure Load Balancer supports deployment of load-balancing to support the high availability of the websites.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create and configure a virtual network, subnet, and NAT gateway.
> * Create two Windows server virtual machines
> * Create a secondary NIC and network configurations for each virtual machine
> * Create two Internet Information Server (IIS) websites on each virtual machine
> * Bind the websites to the network configurations
> * Create and configure an Azure Load Balancer
> * Test the load balancer

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create virtual network

In this section, you'll create a virtual network for the load balancer and virtual machines.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual Networks** in the search results.

3. In **Virtual networks**, select **+ Create**.

4. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription                                  |
    | Resource Group   | Select **Create new**. </br> In **Name** enter **TutorialLBIP-rg**. </br> Select **OK**. |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**                                    |
    | Region           | Select **(Europe) West Europe** |

5. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

6. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.1.0.0/16** |

7. Under **Subnet name**, select the word **default**.

8. In **Edit subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **myBackendSubnet** |
    | Subnet address range | Enter **10.1.0.0/24** |

9. Select **Save**.

10. Select the **Security** tab.

11. Under **BastionHost**, select **Enable**. Enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Bastion name | Enter **myBastionHost** |
    | AzureBastionSubnet address space | Enter **10.1.1.0/27** |
    | Public IP Address | Select **Create new**. </br> For **Name**, enter **myBastionIP**. </br> Select **OK**. |


12. Select the **Review + create** tab or select the **Review + create** button.

13. Select **Create**.

## Create NAT gateway

In this section, you'll create a NAT gateway for outbound internet access for resources in the virtual network. 

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

2. In **NAT gateways**, select **+ Create**.

3. In **Create network address translation (NAT) gateway**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorialLBIP-rg**. |
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

## Create virtual machines

In this section, you'll create two virtual machines to host the IIS websites.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. In **Virtual machines**, select **+ Create** then **+ Virtual machine**.

3. In **Create virtual machine**, enter or select the following information:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **TutorialLBIP-rg** |
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
    | Configure network security group | Select **Create new**. </br> In the **Create network security group**, enter **myNSG** in **Name**. </br> Under **Inbound rules**, select **+Add an inbound rule**. </br> Under  **Service**, select **HTTP**. </br> Under **Priority**, enter **100**. </br> In **Name**, enter **myNSGrule** </br> Select **Add** </br> Select **OK** |
   
7. Select **Review + create**. 
  
8. Review the settings, and then select **Create**.

9. Follow the steps 1 to 8 to create another VM with the following values and all the other settings the same as **myVM1**:

    | Setting | VM 2 |
    | ------- | ---- |
    | Name |  **myVM2** |
    | Availability zone | **2** |
    | Network security group | Select the existing **myNSG** |

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Create secondary network configurations

In this section, you'll change the private IP address of the existing NIC of each virtual machine to **Static**. Next, you'll add a new NIC resource to each virtual machine with a **Static** private IP address configuration.

For more information on configuring floating IP in the virtual machine configuration, see [Floating IP Guest OS configuration](load-balancer-floating-ip.md#floating-ip-guest-os-configuration).

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **myVM1**.

3. If the virtual machine is running, stop the virtual machine. 

4. Select **Networking** in **Settings**.

5. In **Networking**, select the name of the network interface next to **Network interface**. The network interface will begin with the name of the VM and have a random number assigned. In this example, **myVM1266**.

    :::image type="content" source="./media/load-balancer-multiple-ip/myvm1-nic.png" alt-text="Screenshot of myVM1 networking configuration in Azure portal.":::

6. In the network interface page, select **IP configurations** in **Settings**.

7. In **IP configurations**, select **ipconfig1**.

    :::image type="content" source="./media/load-balancer-multiple-ip/myvm1-ipconfig1.png" alt-text="Screenshot of myVM1 network interface configuration.":::

8. Select **Static** in **Assignment** in the **ipconfig1** configuration.

9. Select **Save**.

10. Return to the **Overview** page of **myVM1**.

11. Select **Networking** in **Settings**.

12. In the **Networking** page, select **Attach network interface**.

    :::image type="content" source="./media/load-balancer-multiple-ip/myvm1-attach-nic.png" alt-text="Screenshot of myVM1 attach network interface.":::

13. In **Attach network interface**, select **Create and attach network interface**.

14. In **Create network interface**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Resource group | Select **TutorialLBIP-rg**. |
    | **Network interface** |  |
    | Name | Enter **myVM1NIC2** |
    | Subnet | Select **myBackendSubnet (10.1.0.0/24)**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **myNSG**. |
    | Private IP address assignment | Select **Static**. |
    | Private IP address | Enter **10.1.0.6**. |

15. Select **Create**. 

16. Start the virtual machine.

17. Repeat steps 1 through 16 for **myVM2**, replacing the following information:

    | Setting | myVM2 |
    | ------  | ----- |
    | Name | **myVM2NIC2** |
    | Private IP address | **10.1.0.7** |

## Configure virtual machines

You'll connect to **myVM1** and **myVM2** with Azure Bastion and configure the secondary network configuration in this section. You'll add a route for the gateway for the secondary network configuration. You'll then install IIS on each virtual machine and customize the websites to display the hostname of the virtual machine.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **myVM1**.

3. Start **myVM1**.

4. In **Overview**, select **Connect** then **Bastion**.

5. Select **Use Bastion**.

6. Enter the username and password you entered when you created the virtual machine.

7. Select **Allow** for Bastion to use the clipboard.

8. On the server desktop, navigate to Start > Windows Administrative Tools > Windows PowerShell > Windows PowerShell.

9. In the PowerShell window, execute the `route print` command, which returns output similar to the following output for a virtual machine with two attached network interfaces:

    ```console
    ===========================================================================
    Interface List
      6...00 22 48 86 00 53 ......Microsoft Hyper-V Network Adapter #2
     13...00 22 48 83 0b da ......Microsoft Hyper-V Network Adapter #3
      1...........................Software Loopback Interface 1
    ===========================================================================
    ```
    In this example, **Microsoft Hyper-V Network Adapter #3 (interface 13)** is the secondary network interface that doesn't have a default gateway assigned to it.

10. In the PowerShell window, execute the `ipconfig /all` command to see which IP address is assigned to the secondary network interface. In this example, 10.1.0.6 is assigned to interface 13. No default gateway address is returned for the secondary network interface.

11. To route all traffic for addresses outside the subnet to the gateway, execute the following command:

    ```console
    route -p add 0.0.0.0 MASK 0.0.0.0 10.1.0.1 METRIC 5015 IF 13
    ```

    In this example, **10.1.0.1** is the default gateway for the virtual network you created previously.

12. Execute the following commands in the PowerShell windows to install and configure IIS and the test websites:

    ```powershell
    ## Install IIS and the management tools. ##
    Install-WindowsFeature -Name Web-Server -IncludeManagementTools

    ## Set the binding for the Default website to 10.1.0.4:80. ##
    $para1 = @{
        Name = 'Default Web Site'
        BindingInformation = '10.1.0.4:80:'
        Protocol = 'http'
    }
    New-IISSiteBinding @para1

    ## Remove the default site binding. ##
    $para2 = @{
        Name = 'Default Web Site'
        BindingInformation = '*:80:'
    }
    Remove-IISSiteBinding @para2 -Force

    ## Remove the default htm file. ##
    Remove-Item c:\inetpub\wwwroot\iisstart.htm

    ## Add a new htm file that displays the Contoso website. ##
    $para3 = @{
        Path = 'c:\inetpub\wwwroot\iisstart.htm'
        Value = $("Hello World from www.contoso.com" + "-" + $env:computername)
    }
    Add-Content @para3

    ## Create folder to host website. ##
    $para4 = @{
        Path = 'c:\inetpub\'
        Name = 'fabrikam'
        Type = 'directory'
    }
    New-Item @para4

     ## Create a new website and site binding for the second IP address 10.1.0.6. ##
    $para5 = @{
        Name = 'Fabrikam'
        PhysicalPath = 'c:\inetpub\fabrikam'
        BindingInformation = '10.1.0.6:80:'
    }
    New-IISSite @para5

    ## Add a new htm file that displays the Fabrikam website. ##
    $para6 = @{
        Path = 'C:\inetpub\fabrikam\iisstart.htm'
        Value = $("Hello World from www.fabrikam.com" + "-" + $env:computername)

    }
    Add-Content @para6

    ```
13. Close the Bastion connection to **myVM1**.

14. Repeat steps 1 through 13 for **myVM2**. Use the PowerShell code below for **myVM2** for the IIS install.

    ```powershell
    ## Install IIS and the management tools. ##
    Install-WindowsFeature -Name Web-Server -IncludeManagementTools

    ## Set the binding for the Default website to 10.1.0.5:80. ##
    $para1 = @{
        Name = 'Default Web Site'
        BindingInformation = '10.1.0.5:80:'
        Protocol = 'http'
    }
    New-IISSiteBinding @para1

    ## Remove the default site binding. ##
    $para2 = @{
        Name = 'Default Web Site'
        BindingInformation = '*:80:'
    }
    Remove-IISSiteBinding @para2

    ## Remove the default htm file. ##
    Remove-Item C:\inetpub\wwwroot\iisstart.htm

    ## Add a new htm file that displays the Contoso website. ##
    $para3 = @{
        Path = 'c:\inetpub\wwwroot\iisstart.htm'
        Value = $("Hello World from www.contoso.com" + "-" + $env:computername)
    }
    Add-Content @para3

    ## Create folder to host website. ##
    $para4 = @{
        Path = 'c:\inetpub\'
        Name = 'fabrikam'
        Type = 'directory'
    }
    New-Item @para4

    ## Create a new website and site binding for the second IP address 10.1.0.7. ##
    $para5 = @{
        Name = 'Fabrikam'
        PhysicalPath = 'c:\inetpub\fabrikam'
        BindingInformation = '10.1.0.7:80:'
    }
    New-IISSite @para5

    ## Add a new htm file that displays the Fabrikam website. ##
    $para6 = @{
        Path = 'C:\inetpub\fabrikam\iisstart.htm'
        Value = $("Hello World from www.fabrikam.com" + "-" + $env:computername)
    }
    Add-Content @para6

    ```

## Create load balancer

You'll create a zone redundant load balancer that load balances virtual machines in this section. 

With zone-redundancy, one or more availability zones can fail and the data path survives as long as one zone in the region remains healthy.

During the creation of the load balancer, you'll configure:

* Two frontend IP addresses, one for each website.
* Backend pool
* Inbound load-balancing rules

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

2. In the **Load balancer** page, select **Create**.

3. In the **Basics** tab of the **Create load balancer** page, enter, or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Project details** |   |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **TutorialLBIP-rg**. |
    | **Instance details** |   |
    | Name                   | Enter **myLoadBalancer**                                   |
    | Region         | Select **(Europe) West Europe**.                                        |
    | Type          | Select **Public**.                                        |
    | SKU           | Leave the default **Standard**. |
    | Tier          | Leave the default **Regional**. |

4. Select **Next: Frontend IP configuration** at the bottom of the page.

5. In **Frontend IP configuration**, select **+ Add a frontend IP**.

6. Enter **Frontend-contoso** in **Name**.

7. Select **IPv4** for the **IP version**.

    > [!NOTE]
    > IPv6 isn't currently supported with Routing Preference or Cross-region load-balancing (Global Tier).

8. Select **IP address** for the **IP type**.

    > [!NOTE]
    > For more information on IP prefixes, see [Azure Public IP address prefix](../virtual-network/ip-services/public-ip-address-prefix.md).

9. Select **Create new** in **Public IP address**.

10. In **Add a public IP address**, enter **myPublicIP-contoso** for **Name**.

11. Select **Zone-redundant** in **Availability zone**.

    > [!NOTE]
    > In regions with [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones), you have the option to select no-zone (default option), a specific zone, or zone-redundant. The choice will depend on your specific domain failure requirements. In regions without Availability Zones, this field won't appear. </br> For more information on availability zones, see [Availability zones overview](../availability-zones/az-overview.md).

12. Leave the default of **Microsoft Network** for **Routing preference**.

13. Select **OK**.

14. Select **Add**.

14. Select **+ Add a frontend IP**.

15. Enter **Frontend-fabrikam** in **Name**.

7. Select **IPv4** for the **IP version**.

8. Select **IP address** for the **IP type**.

9. Select **Create new** in **Public IP address**.

10. In **Add a public IP address**, enter **myPublicIP-fabrikam** for **Name**.

11. Select **Zone-redundant** in **Availability zone**.

14. Select **Add**.

15. Select **Next: Backend pools** at the bottom of the page.

16. In the **Backend pools** tab, select **+ Add a backend pool**.

17. Enter **myBackendPool-contoso** for **Name** in **Add backend pool**.

18. Select **myVNet** in **Virtual network**.

19. Select **NIC** for **Backend Pool Configuration**.

20. Select **IPv4** for **IP version**.

21. In **Virtual machines**, select **+ Add**.

22. Select **myVM1** and **myVM2** that correspond with **ipconfig1 (10.1.0.4)** and **ipconfig1 (10.1.0.5)**.

23. Select **Add**.

21. Select **Add**.

22. Select **+ Add a backend pool**.

23. Enter **myBackendPool-fabrikam** for **Name** in **Add backend pool**.

24. Select **myVNet** in **Virtual network**.

19. Select **NIC** for **Backend Pool Configuration**.

20. Select **IPv4** for **IP version**.

21. In **Virtual machines**, select **+ Add**.

22. Select **myVM1** and **myVM2** that correspond with **ipconfig1 (10.1.0.6)** and **ipconfig1 (10.1.0.7)**.

23. Select **Add**.

21. Select **Add**.

22. Select the **Next: Inbound rules** button at the bottom of the page.

23. In **Load balancing rule** in the **Inbound rules** tab, select **+ Add a load balancing rule**.

24. In **Add load balancing rule**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHTTPRule-contoso** |
    | IP Version | Select **IPv4**. |
    | Frontend IP address | Select **Frontend-contoso**. |
    | Protocol | Select **TCP**. |
    | Port | Enter **80**. |
    | Backend port | Enter **80**. |
    | Backend pool | Select **myBackendPool-contoso**. |
    | Health probe | Select **Create new**. </br> In **Name**, enter **myHealthProbe-contoso**. </br> Select **HTTP** in **Protocol**. </br> Leave the rest of the defaults, and select **OK**. |
    | Session persistence | Select **None**. |
    | Idle timeout (minutes) | Enter or select **15**. |
    | TCP reset | Select **Enabled**. |
    | Floating IP | Select **Disabled**. |
    | Outbound source network address translation (SNAT) | Leave the default of **(Recommended) Use outbound rules to provide backend pool members access to the internet.** |

25. Select **Add**.

26. Select **Add a load balancing rule**.

27. In **Add load balancing rule**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHTTPRule-fabrikam** |
    | IP Version | Select **IPv4**. |
    | Frontend IP address | Select **Frontend-fabrikam**. |
    | Protocol | Select **TCP**. |
    | Port | Enter **80**. |
    | Backend port | Enter **80**. |
    | Backend pool | Select **myBackendPool-fabrikam**. |
    | Health probe | Select **Create new**. </br> In **Name**, enter **myHealthProbe-fabrikam**. </br> Select **HTTP** in **Protocol**. </br> Leave the rest of the defaults, and select **OK**. |
    | Session persistence | Select **None**. |
    | Idle timeout (minutes) | Enter or select **15**. |
    | TCP reset | Select **Enabled**. |
    | Floating IP | Select **Disabled**. |
    | Outbound source network address translation (SNAT) | Leave the default of **(Recommended) Use outbound rules to provide backend pool members access to the internet.** |

25. Select **Add**.

26. Select the blue **Review + create** button at the bottom of the page.

27. Select **Create**.

    > [!NOTE]
    > In this example we created a NAT gateway to provide outbound Internet access. The outbound rules tab in the configuration is bypassed as it's optional isn't needed with the NAT gateway. For more information on Azure NAT gateway, see [What is Azure Virtual Network NAT?](../virtual-network/nat-gateway/nat-overview.md)
    > For more information about outbound connections in Azure, see [Source Network Address Translation (SNAT) for outbound connections](../load-balancer/load-balancer-outbound-connections.md)

## Test load balancer

In this section, you'll discover the public IP address for each website. You'll enter the IP into a browser to test the websites you created earlier.

1. In the search box at the top of the portal, enter **Public IP**. Select **Public IP addresses** in the search results.

2. Select **myPublicIP-contoso**.

3. Copy the **IP address** in the overview page of **myPublicIP-contoso**.

    :::image type="content" source="./media/load-balancer-multiple-ip/public-ip-contoso.png" alt-text="Screenshot of myPublicIP-fabrikam public IP address.":::

4. Open a web browser and paste the public IP address into the address bar.

    :::image type="content" source="./media/load-balancer-multiple-ip/test-contoso.png" alt-text="Screenshot of contoso website in web browser.":::

5. Return to **Public IP addresses**. Select **myPublicIP-fabrikam**.

6. Copy the **IP address** in the overview page of **myPublicIP-fabrikam**.

    :::image type="content" source="./media/load-balancer-multiple-ip/public-ip-fabrikam.png" alt-text="Screenshot of myPublicIP-contoso public IP address.":::

7. Open a web browser and paste the public IP address into the address bar.

    :::image type="content" source="./media/load-balancer-multiple-ip/test-fabrikam.png" alt-text="Screenshot of fabrikam website in web browser.":::

8. To test the load balancer, refresh the browser or shut down one of the virtual machines.

## Clean up resources

If you're not going to continue to use this application, delete
the virtual machines and load balancer with the following steps:

1. In the search box at the top of the portal, enter **Resource group**.  Select **Resource groups** in the search results.

2. Select **TutorialLBIP-rg** in **Resource groups**.

3. Select **Delete resource group**.

4. Enter **TutorialLBIP-rg** in **TYPE THE RESOURCE GROUP NAME:**. Select **Delete**.

## Next steps

Advance to the next article to learn how to create a cross-region load balancer:

> [!div class="nextstepaction"]
> [Create a cross-region load balancer using the Azure portal](tutorial-cross-region-portal.md)