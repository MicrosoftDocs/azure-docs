---
title: "Quickstart: Create an internal load balancer - Azure portal"
titleSuffix: Azure Load Balancer
description: Learn to create an internal Azure Load Balancer and test it with two virtual machines. Learn how to configure traffic rules and health probes to distribute traffic across multiple VMs.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: quickstart
ms.date: 10/19/2023
ms.author: mbender
ms.custom: mvc, mode-ui, template-quickstart, engagement-fy24
#Customer intent: I want to create a internal load balancer so that I can load balance internal traffic to VMs.
---

# Quickstart: Create an internal load balancer to load balance VMs using the Azure portal

Get started with Azure Load Balancer by using the Azure portal to create an internal load balancer for a backend pool with two virtual machines. Other resources include Azure Bastion, NAT Gateway, a virtual network, and the required subnets.

:::image type="content" source="media/quickstart-load-balancer-standard-internal-portal/internal-load-balancer-resources.png" alt-text="Diagram of resources deployed for internal load balancer.":::

> [!NOTE]
> In this example you'll create a NAT gateway to provide outbound Internet access. The outbound rules tab in the configuration is bypassed and isn't needed with the NAT gateway. For more information on Azure NAT gateway, see [What is Azure Virtual Network NAT?](../virtual-network/nat-gateway/nat-overview.md)
> For more information about outbound connections in Azure, see [Source Network Address Translation (SNAT) for outbound connections](../load-balancer/load-balancer-outbound-connections.md)
## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

[!INCLUDE [load-balancer-nat-gateway](../../includes/load-balancer-nat-gateway.md)]


[!INCLUDE [load-balancer-create-bastion](../../includes/load-balancer-create-bastion.md)]

## Create load balancer

In this section, you create a load balancer that load balances virtual machines.

During the creation of the load balancer, you configure:

- Frontend IP address
- Backend pool
- Inbound load-balancing rules

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

1. In the **Load balancer** page, select **Create**.

1. In the **Basics** tab of the **Create load balancer** page, enter, or select the following information: 

    | Setting                 | Value   |
    | ---                     | ---     |
    | **Project details** |   |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **load-balancer-rg**. |
    | **Instance details** |   |
    | Name                   | Enter **load-balancer** |
    | Region         | Select **East US**. |
    | SKU           | Leave the default **Standard**. |
    | Type          | Select **Internal**. |
    | Tier | Leave the default of **Regional**. |
    
    :::image type="content" source="./media/quickstart-load-balancer-standard-internal-portal/create-standard-internal-load-balancer.png" alt-text="Screenshot of create standard load balancer basics tab." border="true":::

1. Select **Next: Frontend IP configuration** at the bottom of the page.

1. In **Frontend IP configuration**, select **+ Add a frontend IP configuration**, then enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **lb-frontend** |
    | Private IP address version | Select **IPv4** or **IPv6** depending on your requirements. |

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **lb-frontend** |
    | Virtual network | Select **lb-vnet** |
    | Subnet | Select **backend-subnet** |
    | Assignment | Select **Dynamic** |
    | Availability zone | Select **Zone-redundant** |

1. Select **Add**.
1. Select **Next: Backend pools** at the bottom of the page.
1. In the **Backend pools** tab, select **+ Add a backend pool**.
1. Enter **lb-backend-pool** for **Name** in **Add backend pool**.
1. Select **IP Address** for **Backend Pool Configuration**.
1. Select **Save**.
1. Select the **Next: Inbound rules** button at the bottom of the page.
1. In **Load balancing rule** in the **Inbound rules** tab, select **+ Add a load balancing rule**.
1. In **Add load balancing rule**, enter or select the following information:

    | **Setting** | **Value** |
    | ----------- | --------- |
    | Name | Enter **lb-HTTP-rule** |
    | IP Version | Select **IPv4** or **IPv6** depending on your requirements. |
    | Frontend IP address | Select **lb-frontend**. |
    | Backend pool | Select **lb-backend-pool**. |
    | Protocol | Select **TCP**. |
    | Port | Enter **80**. |
    | Backend port | Enter **80**. |
    | Health probe | Select **Create new**. </br> In **Name**, enter **lb-health-probe**. </br> Select **TCP** in **Protocol**. </br> Leave the rest of the defaults, and select **OK**. |
    | Session persistence | Select **None**. |
    | Idle timeout (minutes) | Enter or select **15**. |
    | Enable TCP reset | Select **checkbox** . |
    | Enable Floating IP | Leave the default of unselected. |

1. Select **Save**.

1. Select the blue **Review + create** button at the bottom of the page.

1. Select **Create**.

[!INCLUDE [load-balancer-create-2-virtual-machines](../../includes/load-balancer-create-2-virtual-machines.md)]

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Create test virtual machine

In this section, you create a VM named **lb-TestVM**.  This VM is used to test the load balancer configuration.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. In **Virtual machines**, select **+ Create** > **Azure virtual machine**.
   
2. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |----------------------- | ---------------------------------- |
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **load-balancer-rg** |
    | **Instance details** |  |
    | Virtual machine name | Enter **lb-TestVM** |
    | Region | Select **(US) East US** |
    | Availability Options | Select **No infrastructure redundancy required** |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2022 Datacenter - x64 Gen2** |
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
    | Virtual network | **lb-vnet** |
    | Subnet | **backend-subnet** |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced** |
    | Configure network security group | Select **lb-NSG** created in the previous step.|
       
5. Select **Review + create**. 
  
6. Review the settings, and then select **Create**.

## Install IIS

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **lb-vm1**.

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

8. Close the Bastion session with **lb-vm1**.

9. Repeat steps 1 through 8 to install IIS and the updated iisstart.htm file on **lb-VM2**.

## Test the load balancer

In this section, you test the load balancer by connecting to the **lb-TestVM** and verifying the webpage.

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

2. Select **load-balancer**.

3. Make note or copy the address next to **Private IP address** in the **Overview** of **load-balancer**. If you can't see the **Private IP address** field, select **See more** in the information window.

4. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

5. Select **lb-TestVM**.

6. In the **Overview** page, select **Connect**, then **Bastion**.

7. Enter the username and password entered during VM creation.

8. Open **Microsoft Edge** on **lb-TestVM**.

9. Enter the IP address from the previous step into the address bar of the browser. The custom page displaying one of the backend server names is displayed on the browser. In this example, it's **10.1.0.4**.

    :::image type="content" source="./media/quickstart-load-balancer-standard-internal-portal/load-balancer-test.png" alt-text="Screenshot shows a browser window displaying the customized page, as expected." border="true":::
   
1. To see the load balancer distribute traffic across both VMs, navigate to the VM shown in the browser message, and stop the VM.
1. Refresh the browser window. The page should still display the customized page. The load balancer is now only sending traffic to the remaining VM.

## Clean up resources

When no longer needed, delete the resource group, load balancer, and all related resources. To do so, select the resource group **load-balancer-rg** that contains the resources and then select **Delete**.

## Next steps

In this quickstart, you:

- Created an internal Azure Load Balancer

- Attached 2 VMs to the load balancer

- Configured the load balancer traffic rule, health probe, and then tested the load balancer

To learn more about Azure Load Balancer, continue to:
> [!div class="nextstepaction"]
> [What is Azure Load Balancer?](load-balancer-overview.md)
