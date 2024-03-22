---
title: 'Tutorial: Create a load balancer with more than one availability set in the backend pool - Azure portal'
titleSuffix: Azure Load Balancer
description: Learn to deploy Azure Load Balancer with multiple availability sets and virtual machines in a backend pool using the Azure portal.
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: tutorial
ms.date: 10/24/2023
ms.custom: template-tutorial, engagement-fy24
---

# Tutorial: Create a load balancer with more than one availability set in the backend pool using the Azure portal

As part of a high availability deployment, virtual machines are often grouped into multiple availability sets. 

Load Balancer supports more than one availability set with virtual machines in the backend pool.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a NAT gateway for outbound connectivity
> * Create a virtual network and a network security group
> * Create a standard SKU Azure Load Balancer
> * Create four virtual machines and two availability sets
> * Add virtual machines in availability sets to backend pool of load balancer
> * Test the load balancer

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [load-balancer-nat-gateway](../../includes/load-balancer-nat-gateway.md)]

[!INCLUDE [load-balancer-create-no-bastion](../../includes/load-balancer-create-no-bastion.md)]

[!INCLUDE [load-balancer-nsg-http-rule](../../includes/load-balancer-nsg-http-rule.md)]

[!INCLUDE [load-balancer-public-create](../../includes/load-balancer-public-create.md)]

## Create virtual machines

In this section, you create two availability groups with two virtual machines per group. These machines are added to the backend pool of the load balancer during creation. 

### Create first set of VMs

1. Select **+ Create a resource** in the upper left-hand section of the portal.
1. In **New**, select **Compute** > **Virtual machine**.
1. In the **Basics** tab of **Create a virtual machine**, enter, or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription |
    | Resource group | Select **lb-resource-group**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **lb-VM1**. |
    | Region | Select **(US) East US**. |
    | Availability options | Select **Availability set**. |
    | Availability set | Select **Create new**. </br> Enter **lb-availability-set1** in **Name**. </br> Select **OK**. |
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
    | Virtual network | Select **lb-VNet**. |
    | Subnet | Select **backend-subnet**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Skip this setting until the rest of the settings are completed. Complete after **Select a backend pool**.|
    | **Load balancing** |   |
    | Load-balancing options | Select **Azure load balancer**. |
    | Select a load balancer | Select **load-balancer**. |
    | Select a backend pool | Select **lb-backend-pool**. |
    | Configure network security group | Select **Create new**. </br> In the **Create network security group**, enter **lb-NSG** in **Name**. </br> Under **Inbound rules**, select **+Add an inbound rule**. </br> Under  **Service**, select **HTTP**. </br> Under **Priority**, enter **100**. </br> In **Name**, enter **lb-NSG-rule** </br> Select **Add** </br> Select **OK** |

1. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.
1. Select **Create**.
1. Repeat steps 1 through 7 to create the second virtual machine of the set. Replace the settings for the VM with the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **lb-VM2**. |
    | Availability set | Select **lb-availability-set1**. |
    | Virtual Network | Select **lb-VNet**. |
    | Subnet | Select **backend-subnet**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Skip this setting until the rest of the settings are completed. Complete after **Select a backend pool**.|
    | Load-balancing options | Select **Azure load balancer**. |
    | Select a load balancer | Select **load-balancer**. |
    | Select a backend pool | Select **lb-backend-pool**. |
    | Configure network security group | Select **lb-NSG**. |

### Create second set of VMs

1. Select **+ Create a resource** in the upper left-hand section of the portal.
1. In **New**, select **Compute** > **Virtual machine**.
1. In the **Basics** tab of **Create a virtual machine**, enter, or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription |
    | Resource group | Select **lb-resource-group**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **lb-VM3**. |
    | Region | Select **(US) East US**. |
    | Availability options | Select **Availability set**. |
    | Availability set | Select **Create new**. </br> Enter **lb-availability-set2** in **Name**. </br> Select **OK**. |
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
    | Virtual network | Select **lb-VNet**. |
    | Subnet | Select **backend-subnet**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Skip this setting until the rest of the settings are completed. Complete after **Select a backend pool**.| 
    | **Load balancing** |   |
    | Load-balancing options | Select **Azure load balancer**. |
    | Select a load balancer | Select **load-balancer**. |
    | Select a backend pool | Select **lb-backend-pool**. |
    | Configure network security group | Select **lb-NSG**. |

6. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

7. Select **Create**.

8. Repeat steps 1 through 7 to create the second virtual machine of the set. Replace the settings for the VM with the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **lb-VM4**. |
    | Availability set | Select **lb-availability-set2**. |
    | Virtual Network | Select **lb-VM3**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Skip this setting until the rest of the settings are completed. Complete after **Select a backend pool**.|
    | Load-balancing options | Select **Azure load balancer**. |
    | Select a load balancer | Select **load-balancer**. |
    | Select a backend pool | Select **lb-backend-pool**. |
    | Configure network security group | Select **lb-NSG**. |

## Install IIS

In this section, you use the Azure Bastion host you created previously to connect to the virtual machines and install IIS.

1. In the search box at the top of the portal, enter **Virtual machine**.
1. Select **Virtual machines** in the search results.
1. Select **lb-VM1**.
1. Under **Payload** in the left-side menu, select **Run command > RunPowerShellScript**.
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

1. Repeat steps 1 through 8 for **lb-VM2**, **lb-VM3**, and **lb-VM4**.

## Test the load balancer

In this section, you discover the public IP address of the load balancer. You use the IP address to test the operation of the load balancer.

1. In the search box at the top of the portal, enter **Public IP**.
1. Select **Public IP addresses** in the search results.
1. Select **lb-Public-IP**.
1. Note the public IP address listed in **IP address** in the **Overview** page of **lb-Public-IP**:

    :::image type="content" source="./media/tutorial-multi-availability-sets-portal/find-public-ip.png" alt-text="Find the public IP address of the load balancer." border="true":::

1. Open a web browser and enter the public IP address in the address bar:

    :::image type="content" source="./media/tutorial-multi-availability-sets-portal/verify-load-balancer.png" alt-text="Test load balancer with web browser." border="true":::

1. Select refresh in the browser to see the traffic balanced to the other virtual machines in the backend pool.

## Clean up resources

If you're not going to continue to use this application, delete
the load balancer and the supporting resources with the following steps:

1. In the search box at the top of the portal, enter **Resource group**.
1. Select **Resource groups** in the search results.
1. Select **lb-resource-group**.
1. In the overview page of **lb-resource-group**, select **Delete resource group**.
1. Select **Apply force delete for selected Virtual Machines and Virtual machine scale sets**.
1. Enter **lb-resource-group** in **Enter resource group name to confirm deletion**.
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
