---
title: "Quickstart: Create a basic internal load balancer - Azure portal"
titleSuffix: Azure Load Balancer
description: This quickstart shows how to create a basic internal load balancer by using the Azure portal.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: quickstart
ms.date: 04/10/2023
ms.author: mbender
ms.custom: mvc, mode-ui
#Customer intent: I want to create a internal load balancer so that I can load balance internal traffic to VMs.
---

# Quickstart: Create a basic internal load balancer to load balance VMs using the Azure portal

Get started with Azure Load Balancer by using the Azure portal to create an internal load balancer and two virtual machines.

>[!NOTE]
>Standard SKU load balancer is recommended for production workloads.  For more information about SKUs, see **[Azure Load Balancer SKUs](../skus.md)**.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create the virtual network

When you create an internal load balancer, a virtual network is configured as the network for the load balancer. 

A private IP address in the virtual network is configured as the frontend for the load balancer. The frontend IP address can be **Static** or **Dynamic**.

An Azure Bastion host is created to securely manage the virtual machines and install IIS.

> [!IMPORTANT]

> [!INCLUDE [Pricing](../../../includes/bastion-pricing.md)]

>

In this section, you'll create a virtual network, subnet, and Azure Bastion host.

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
    | Region           | Select **West US 3** |

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

    > [!NOTE]
    > The virtual network and subnet are created immediately. The Bastion host creation is submitted as a job and will complete within 10 minutes. You can proceed to the next steps while the Bastion host is created.

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
    | Region         | Select **West US 3**.                                        |
    | SKU           | Select **Basic**. |
    | Type          | Select **Internal**.                                        |

4. Select **Next: Frontend IP configuration** at the bottom of the page.

5. In **Frontend IP configuration**, select **+ Add a frontend IP configuration**.

6. Enter **myFrontend** in **Name**.

7. Select **myVNet** in **Virtual network**.

8. Select **myBackendSubnet** in **Subnet**.

9. Select **Dynamic** for **Assignment**.

10. Select **Add**.

11. Select **Next: Backend pools** at the bottom of the page.

12. In the **Backend pools** tab, select **+ Add a backend pool**.

13. Enter **myBackendPool** in **Name**.

14. Select **Virtual machines** in **Associated to**.

15. Select **IPv4** or **IPv6** for **IP version**.

16. Select **Add**.

17. Select the **Next: Inbound rules** button at the bottom of the page.

18. In **Load balancing rule** in the **Inbound rules** tab, select **+ Add a load balancing rule**.

19. In **Add load balancing rule**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHTTPRule** |
    | IP Version | Select **IPv4** or **IPv6** depending on your requirements. |
    | Frontend IP address | Select **myFrontend**. |
    | Backend pool | Select **myBackendPool**. |
    | Protocol | Select **TCP**. |
    | Port | Enter **80**. |
    | Backend port | Enter **80**. |
    | Health probe | Select **Create new**. </br> In **Name**, enter **myHealthProbe**. </br> Select **TCP** in **Protocol**. </br> Leave the rest of the defaults, and select **OK**. |
    | Session persistence | Select **None**. |
    | Idle timeout (minutes) | Enter or select **15**. |
    | Floating IP | Select **Disabled**. |

20. Select **Add**.

21. Select the blue **Review + create** button at the bottom of the page.

22. Select **Create**.

## Create virtual machines

In this section, you'll create two VMs (**myVM1** and **myVM2**) in two different zones (**Zone 1** and **Zone 2**). 

These VMs are added to the backend pool of the load balancer that was created earlier.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. In **Virtual machines**, select **+ Create** > **Azure virtual machine**.
   
3. In **Create a virtual machine**, enter or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **CreateIntLBQS-rg** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM1** |
    | Region | Select **(US) West US 3** |
    | Availability Options | Select **Availability set** |
    | Availability set | Select **Create new**. </br> Enter **myAvailabilitySet** in **Name**. </br> Select **OK** |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2019 Datacenter - Gen2** |
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
    | Configure network security group | Select **Create new**. </br> In the **Create network security group**, enter **myNSG** in **Name**. </br> Under **Inbound rules**, select **+Add an inbound rule**. </br> In **Service**, select **HTTP**. </br> Under **Priority**, enter **100**. </br> In **Name**, enter **myNSGRule** </br> Select **Add** </br> Select **OK** |
    | **Load balancing**  |
    | Place this virtual machine behind an existing load-balancing solution? | Select the box. |
    | **Load balancing settings** |
    | Load-balancing options | Select **Azure load balancing** |
    | Select a load balancer | Select **myLoadBalancer**  |
    | Select a backend pool | Select **myBackendPool** |
   
6. Select **Review + create**. 
  
7. Review the settings, and then select **Create**.

8. Follow the steps 1 through 7 to create one more VM with the following values and all the other settings the same as **myVM1**:

    | Setting | VM 2 |
    | ------- | ----- |
    | Name | **myVM2** |
    | Availability set | Select the existing **myAvailabiltySet** |
    | Network security group | Select the existing **myNSG** |

[!INCLUDE [ephemeral-ip-note.md](../../../includes/ephemeral-ip-note.md)]

## Create test virtual machine

In this section, you'll create a VM named **myTestVM**.  This VM will be used to test the load balancer configuration.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. In **Virtual machines**, select **+ Create** > **Azure virtual machine**.
   
2. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |----------------------- | ---------------------------------- |
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **CreateIntLBQS-rg** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myTestVM** |
    | Region | Select **(US) West US 3** |
    | Availability Options | Select **No infrastructure redundancy required** |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2019 Datacenter - Gen2** |
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

4. Enter the username and password entered during VM creation.

5. Select **Connect**.

6. On the server desktop, navigate to **Windows Administrative Tools** > **Windows PowerShell** > **Windows PowerShell**.

7. In the PowerShell Window, execute the following commands to:

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

9. Repeat steps 1 through 8 to install IIS and the updated iisstart.htm file on **myVM2**.

## Test the load balancer

In this section, you'll test the load balancer by connecting to the **myTestVM** and verifying the webpage.

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

2. Select **myLoadBalancer**.

3. Make note or copy the address next to **Private IP address** in the **Overview** of **myLoadBalancer**. If you can't see the **Private IP address** field, select **See more** in the information window.

4. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

5. Select **myTestVM**.

6. In the **Overview** page, select **Connect**, then **Bastion**.

7. Enter the username and password entered during VM creation.

8. Open **Internet Explorer** on **myTestVM**.

9. Enter the IP address from the previous step into the address bar of the browser. The custom page displaying one of the backend server names is displayed on the browser. In this example, it's **10.1.0.4**.

To see the load balancer distribute traffic across both VMs, you can force-refresh your web browser from the client machine.

## Clean up resources

When no longer needed, delete the resource group, load balancer, and all related resources. To do so, select the resource group **CreateIntLBQS-rg** that contains the resources and then select **Delete**.

## Next steps

In this quickstart, you:

* Created an internal Azure Load Balancer

* Attached 2 VMs to the load balancer

* Configured the load balancer traffic rule, health probe, and then tested the load balancer

To learn more about Azure Load Balancer, continue to:
> [!div class="nextstepaction"]
> [What is Azure Load Balancer?](../load-balancer-overview.md)
