---
title: 'Quickstart: Create a basic public load balancer - Azure portal'
titleSuffix: Azure Load Balancer
description: Learn how to create a public basic SKU Azure Load Balancer in this quickstart. 
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: quickstart
ms.date: 04/10/2023
ms.custom: template-quickstart
---

# Quickstart: Create a basic public load balancer using the Azure portal

Get started with Azure Load Balancer by using the Azure portal to create a basic public load balancer and two virtual machines.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

>[!NOTE]
>Standard SKU load balancer is recommended for production workloads. For more information about SKUs, see **[Azure Load Balancer SKUs](../skus.md)**.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create the virtual network

In this section, you'll create a virtual network and subnet.

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual Networks** in the search results.

2. In **Virtual networks**, select **+ Create**.

3. In **Create virtual network**, enter or select the following information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription                                  |
    | Resource Group   | Select **Create new**. </br> In **Name** enter **CreatePubLBQS-rg**. </br> Select **OK**. |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**                                    |
    | Region           | Select **West US 3** |

4. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

5. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.1.0.0/16** |

6. Under **Subnet name**, select the word **default**.

7. In **Edit subnet**, enter the following information:

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
    | AzureBastionSubnet address space | Enter **10.1.1.0/26** |
    | Public IP Address | Select **Create new**. </br> For **Name**, enter **myBastionIP**. </br> Select **OK**. |


11. Select the **Review + create** tab or select the **Review + create** button.

12. Select **Create**.

> [!IMPORTANT]

> [!INCLUDE [Pricing](../../../includes/bastion-pricing.md)]

>

## Create load balancer

In this section, you create a load balancer that load balances virtual machines.

During the creation of the load balancer, you'll configure:

* Frontend IP address
* Backend pool
* Inbound load-balancing rules

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

2. In the **Load balancer** page, select **+ Create**.

3. In the **Basics** tab of the **Create load balancer** page, enter, or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Project details** |   |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **CreatePubLBQS-rg**. |
    | **Instance details** |   |
    | Name                   | Enter **myLoadBalancer**                                   |
    | Region         | Select **West US 3**.                                        |
    | SKU           | Select **Basic**. |
    | Type          | Select **Public**.                                        |
 
4. Select **Next: Frontend IP configuration** at the bottom of the page.

5. In **Frontend IP configuration**, select **+ Add a frontend IP**.

6. Enter **myFrontend** in **Name**.

7. Select **IPv4** or **IPv6** for the **IP version**.

8. Select **Create new** in **Public IP address**.

9. In **Add a public IP address**, enter **myPublicIP** for **Name**.

10. In **Assignment**, select **Static**.

11. Select **OK**.

12. Select **Add**.

13. Select **Next: Backend pools** at the bottom of the page.

14. In the **Backend pools** tab, select **+ Add a backend pool**.

15. Enter or select the following information in **Add backend pool**.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myBackendPool**. |
    | Virtual network | Select **myVNet (CreatePubLBQS-rg)**. |
    | Associated to | Select **Virtual machines**. |
    | IP version | Select **IPv4** or **IPv6**. |

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

In this section, you'll create two VMs (**myVM1** and **myVM2**).

The two VMs will be added to an availability set named **myAvailabilitySet**.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. In **Virtual machines**, select **+ Create** > **Virtual machine**.
   
3. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **CreatePubLBQS-rg** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM1** |
    | Region | Select **West US 3** |
    | Availability Options | Select **Availability set** |
    | Availability set | Select **Create new**. </br> Enter **myAvailabilitySet** in **Name**. </br> Select **OK** |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2022 Datacenter - Gen2** |
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
    | Configure network security group | Select **Create new**. </br> In the **Create network security group**, enter **myNSG** in **Name**. </br> Under **Inbound rules**, select **+Add an inbound rule**. </br> In **Source port ranges**, enter **80**. </br> In **Service**, select **HTTP**. </br> Under **Priority**, enter **100**. </br> In **Name**, enter **myNSGRule** </br> Select **Add** </br> Select **OK** |
    | **Load balancing**  |  |
    | Place this virtual machine behind an existing load-balancing solution? | Select the box |
    | **Load balancing settings** |  |
    | Load balancing options | Select **Azure Load Balancer**. |
    | Select a load balancer | Select **myLoadBalancer**. |
    | Select a backend pool | Select **myBackendPool**. |

6. Select **Review + create**. 
  
7. Review the settings, and then select **Create**.

8. Follow the steps 1 through 7 to create one more VM with the following values and all the other settings the same as **myVM1**:

    | Setting | VM 2 |
    | ------- | ----- |
    | Name |  **myVM2** |
    | Availability set | Select **myAvailabilitySet** |
    | Network security group | Select the existing **myNSG** |

[!INCLUDE [ephemeral-ip-note.md](../../../includes/ephemeral-ip-note.md)]

## Install IIS

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **myVM1**.

3. On the **Overview** page, select **Connect**, then **Bastion**.

4. Select **Use Bastion**.

5. Enter the username and password entered during VM creation.

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

9. Close the bastion session with **myVM1**.

10. Repeat steps 1 to 9 to install IIS and the updated iisstart.htm file on **myVM2**.

## Test the load balancer

1. In the search box at the top of the page, enter **Load balancer**.  Select **Load balancers** in the search results.

2. Find the public IP address for the load balancer on the **Overview** page under **Public IP address**.

3. Copy the public IP address, and then paste it into the address bar of your browser. The custom VM page of the IIS Web server is displayed in the browser.

## Clean up resources

When no longer needed, delete the resource group, load balancer, and all related resources. To do so, select the resource group **CreatePubLBQS-rg** that contains the resources and then select **Delete**.

## Next steps

In this quickstart, you:

* Created a basic public load balancer.

* Attached 2 VMs to the load balancer.

* Tested the load balancer.

To learn more about Azure Load Balancer, continue to:

> [!div class="nextstepaction"]
> [What is Azure Load Balancer?](../load-balancer-overview.md)
