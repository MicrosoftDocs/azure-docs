---
title: "Tutorial: Load balance VMs within an availability zone - Azure portal"
titleSuffix: Azure Load Balancer
description: This tutorial demonstrates how to create a Standard Load Balancer with zonal frontend to load balance VMs within an availability zone by using Azure portal.
services: load-balancer
author: mbender-ms
# Customer intent: As an IT administrator, I want to create a load balancer that load balances incoming internet traffic to virtual machines within a specific zone in a region. 
ms.service: load-balancer
ms.topic: tutorial
ms.date: 12/04/2023
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

[!INCLUDE [load-balancer-create-bastion](../../includes/load-balancer-create-bastion.md)]

[!INCLUDE [load-balancer-nat-gateway-subnet-add](../../includes/load-balancer-nat-gateway-subnet-add.md)]

[!INCLUDE [load-balancer-public-create](../../includes/load-balancer-public-create.md)]

## Create virtual machines

In this section, you'll create three VMs (**lb-VM1**, **lb-VM2**, and **lb-VM3**) in one zone (**Zone 1**).

These VMs are added to the backend pool of the load balancer that was created earlier.

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Virtual machine**.

2. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **load-balancer-rg** |
    | **Instance details** |  |
    | Virtual machine name | Enter **lb-VM1** |
    | Region | Select **(US) East US** |
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
    | Virtual network | **lb-vnet** |
    | Subnet | **myBackendSubnet** |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**|
    | Configure network security group | Select **Create new**. </br> In the **Create network security group**, enter **lb-NSG** in **Name**. </br> Under **Inbound rules**, select **+Add an inbound rule**. </br> Under  **Service**, select **HTTP**. </br> Under **Priority**, enter **100**. </br> In **Name**, enter **lb-NSG-Rule** </br> Select **Add** </br> Select **OK** |
    | **Load balancing**  |
    | Place this virtual machine behind an existing load-balancing solution? | Select the check box. |
    | **Load balancing settings** |
    | Load-balancing options | Select **Azure load balancing** |
    | Select a load balancer | Select **load-balancer**  |
    | Select a backend pool | Select **lb-backend-pool** |
   
7. Select **Review + create**. 
  
8. Review the settings, and then select **Create**.

9. Follow the steps 1 to 8 to create two more VMs with the following values and all the other settings the same as **lb-VM1**:

    | Setting | VM 2| VM 3|
    | ------- | ----- |---|
    | Name |  **lb-VM2** |**lb-VM3**|
    | Availability zone | **1** |**1**|
    | Network security group | Select the existing **lb-NSG**| Select the existing **lb-NSG**|

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Install IIS

1. Select **All services** in the left-hand menu, select **All resources**, and then from the resources list, select **lb-VM1** that is located in the **load-balancer-rg** resource group.

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

8. Close the Bastion session with **lb-VM1**.

9. Repeat steps 1 to 8 to install IIS and the updated iisstart.htm file on **lb-VM2** and **lb-VM3**.

## Test the load balancer

1. In the search box at the top of the page, enter **Load balancer**. Select **Load balancers** in the search results.

2. Click the load balancer you created, **myLoadBalancer**. On the **Frontend IP configuration** page for your load balancer, locate the public **IP address**.

3. Copy the public IP address, and then paste it into the address bar of your browser. The custom VM page of the IIS Web server is displayed in the browser.

    :::image type="content" source="./media/tutorial-load-balancer-standard-zonal-portal/load-balancer-test.png" alt-text="Screenshot of load balancer test":::

## Clean up resources

When no longer needed, delete the resource group, load balancer, and all related resources. To do so, select the resource group **load-balancer-rg** that contains the resources and then select **Delete**.

## Next steps

Advance to the next article to learn how to load balance VMs across availability zones:
> [!div class="nextstepaction"]
> [Load balance VMs across availability zones](./quickstart-load-balancer-standard-public-portal.md)
