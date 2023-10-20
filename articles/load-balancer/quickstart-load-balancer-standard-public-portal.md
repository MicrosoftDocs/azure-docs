---
title: "Quickstart: Create a public load balancer - Azure portal"
titleSuffix: Azure Load Balancer
description: This quickstart shows how to create a load balancer using the Azure portal.
author: mbender-ms
ms.service: load-balancer
ms.topic: quickstart
ms.date: 06/06/2023
ms.author: mbender
ms.custom: mvc, mode-ui, template-quickstart, engagement-fy23
#Customer intent: I want to create a load balancer so that I can load balance internet traffic to VMs.
---

# Quickstart: Create a public load balancer to load balance VMs using the Azure portal

Get started with Azure Load Balancer by using the Azure portal to create a public load balancer for a backend pool with two virtual machines. Additional resources include Azure Bastion, NAT Gateway, a virtual network, and the required subnets.

:::image type="content" source="media/quickstart-load-balancer-standard-public-portal/public-load-balancer-resources.png" alt-text="Diagram of resources deployed for a standard public load balancer.":::

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create the virtual network

In this section, you'll create a virtual network, subnet, and Azure Bastion host. The virtual network and subnet contains the load balancer and virtual machines. The bastion host is used to securely manage the virtual machines and install IIS to test the load balancer.

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual Networks** in the search results.

1. In **Virtual networks**, select **+ Create**.

1. In **Create virtual network**, enter or select the following information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription                                  |
    | Resource Group   | Select **Create new**. </br> In **Name** enter **CreatePubLBQS-rg**. </br> Select **OK**. |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**                                    |
    | Region           | Select **East US** |

1. Select the **Security** tab.

1. Under **Azure Bastion**, select **Enable Azure Bastion**. Enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Azure Bastion name | Enter **myBastionHost** |
    
    > [!IMPORTANT]
    > [!INCLUDE [Pricing](../../includes/bastion-pricing.md)]

1. Select the **IP addresses** tab or select the **Next: IP addresses** button at the bottom of the page.

1. In the **IP addresses** tab, select **Add an IP address space**, and enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Starting Address | Enter **10.1.0.0** |
    | Address space size | Select **/16** |

1. Select **Add**.
    
1. Select **Add a subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **myBackendSubnet** |
    | Starting address | Enter **10.1.0.0** |
    | Subnet size | Select **/24** |

1. Select **Add**.

1. Select **Add a subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet template  |  Azure Bastion |
    | Starting address | Enter **10.1.1.0** |
    | Subnet size  |  Select **/26** |
    
1. Select **Add**.
    
1. Select the **Review + create** tab or select the **Review + create** button.

1. Select **Create**.
    
    > [!NOTE]
    > The virtual network and subnet are created immediately. The Bastion host creation is submitted as a job and will complete within 10 minutes. You can proceed to the next steps while the Bastion host is created.

## Create load balancer

In this section, you'll create a zone redundant load balancer that load balances virtual machines. With zone-redundancy, one or more availability zones can fail and the data path survives as long as one zone in the region remains healthy.

During the creation of the load balancer, you'll configure:

* Frontend IP address
* Backend pool
* Inbound load-balancing rules
* Health probe

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

1. In the **Load balancer** page, select **+ Create**.

1. In the **Basics** tab of the **Create load balancer** page, enter or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Project details** |   |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **CreatePubLBQS-rg**. |
    | **Instance details** |   |
    | Name                   | Enter **myLoadBalancer**                                   |
    | Region         | Select **East US**.                                        |
    | SKU           | Leave the default **Standard**. |
    | Type          | Select **Public**.                                        |
    | Tier          | Leave the default **Regional**. |

    :::image type="content" source="./media/quickstart-load-balancer-standard-public-portal/create-standard-load-balancer.png" alt-text="Screenshot of create standard load balancer basics tab." border="true":::

1. Select **Next: Frontend IP configuration** at the bottom of the page.

1. In **Frontend IP configuration**, select **+ Add a frontend IP configuration**.

1. Enter **myFrontend** in **Name**.

1. Select **IPv4** for the **IP version**.

1. Select **IP address** for the **IP type**.

    > [!NOTE]
    > For more information on IP prefixes, see [Azure Public IP address prefix](../virtual-network/ip-services/public-ip-address-prefix.md).

1. Select **Create new** in **Public IP address**.

1. In **Add a public IP address**, enter **myPublicIP** for **Name**.

1. Select **Zone-redundant** in **Availability zone**.

    > [!NOTE]
    > In regions with [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones), you have the option to select no-zone (default option), a specific zone, or zone-redundant. The choice will depend on your specific domain failure requirements. In regions without Availability Zones, this field won't appear. </br> For more information on availability zones, see [Availability zones overview](../availability-zones/az-overview.md).

1. Leave the default of **Microsoft Network** for **Routing preference**.

1. Select **OK**.

1. Select **Add**.

1. Select **Next: Backend pools** at the bottom of the page.

1. In the **Backend pools** tab, select **+ Add a backend pool**.

1. Enter **myBackendPool** for **Name** in **Add backend pool**.

1. Select **myVNet** in **Virtual network**.

1. Select **IP Address** for **Backend Pool Configuration**.

1. Select **Save**.

1. Select **Next: Inbound rules** at the bottom of the page.

1. Under **Load balancing rule** in the **Inbound rules** tab, select **+ Add a load balancing rule**.

1. In **Add load balancing rule**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHTTPRule** |
    | IP Version | Select **IPv4** or **IPv6** depending on your requirements. |
    | Frontend IP address | Select **myFrontend (To be created)**. |
    | Backend pool | Select **myBackendPool**. |
    | Protocol | Select **TCP**. |
    | Port | Enter **80**. |
    | Backend port | Enter **80**. |
    | Health probe | Select **Create new**. </br> In **Name**, enter **myHealthProbe**. </br> Select **TCP** in **Protocol**. </br> Leave the rest of the defaults, and select **Save**. |
    | Session persistence | Select **None**. |
    | Idle timeout (minutes) | Enter or select **15**. |
    | TCP reset | Select **Enabled**. |
    | Floating IP | Select **Disabled**. |
    | Outbound source network address translation (SNAT) | Leave the default of **(Recommended) Use outbound rules to provide backend pool members access to the internet.** |

1. Select **Save**.

1. Select the blue **Review + create** button at the bottom of the page.

1. Select **Create**.

    > [!NOTE]
    > In this example we'll create a NAT gateway to provide outbound Internet access. The outbound rules tab in the configuration is bypassed as it's optional and isn't needed with the NAT gateway. For more information on Azure NAT gateway, see [What is Azure Virtual Network NAT?](../virtual-network/nat-gateway/nat-overview.md)
    > For more information about outbound connections in Azure, see [Source Network Address Translation (SNAT) for outbound connections](../load-balancer/load-balancer-outbound-connections.md)

## Create NAT gateway

In this section, you'll create a NAT gateway for outbound internet access for resources in the virtual network. For other options for outbound rules, check out [Network Address Translation (SNAT) for outbound connections](load-balancer-outbound-connections.md).

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. In **NAT gateways**, select **+ Create**.

1. In **Create network address translation (NAT) gateway**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **CreatePubLBQS-rg**. |
    | **Instance details** |    |
    | NAT gateway name | Enter **myNATgateway**. |
    | Region | Select **East US**. |
    | Availability zone | Select **None**. |
    | Idle timeout (minutes) | Enter **15**. |

1. Select the **Outbound IP** tab or select **Next: Outbound IP** at the bottom of the page.

1. In **Outbound IP**, select **Create a new public IP address** next to **Public IP addresses**.

1. Enter **myNATgatewayIP** in **Name**.

1. Select **OK**.

1. Select the **Subnet** tab or select the **Next: Subnet** button at the bottom of the page.

1. In **Virtual network** in the **Subnet** tab, select **myVNet**.

1. Select **myBackendSubnet** under **Subnet name**.

1. Select the blue **Review + create** button at the bottom of the page, or select the **Review + create** tab.

1. Select **Create**.

## Create virtual machines

In this section, you'll create two VMs (**myVM1** and **myVM2**) in two different zones (**Zone 1**, and **Zone 2**). 

These VMs are added to the backend pool of the load balancer that was created earlier.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. In **Virtual machines**, select **+ Create** > **Azure virtual machine**.
   
1. In **Create a virtual machine**, enter or select the following values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **CreatePubLBQS-rg** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM1** |
    | Region | Select **((US) East US)** |
    | Availability Options | Select **Availability zones** |
    | Availability zone | Select **Zone 1** |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2022 Datacenter: Azure Edition - Gen2** |
    | Azure Spot instance | Leave the default of unchecked. |
    | Size | Choose VM size or take default setting |
    | **Administrator account** |  |
    | Username | Enter a username |
    | Password | Enter a password |
    | Confirm password | Reenter password |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None** |

1. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
1. In the Networking tab, select or enter the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |  |
    | Virtual network | Select **myVNet** |
    | Subnet | Select **myBackendSubnet** |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced** |
    | Configure network security group | Skip this setting until the rest of the settings are completed. Complete after **Select a backend pool**.|
    | Delete NIC when VM is deleted | Leave the default of **unselected**. |
    | Accelerated networking | Leave the default of **selected**. |
    | **Load balancing**  |
    | **Load balancing options** |
    | Load-balancing options | Select **Azure load balancer** |
    | Select a load balancer | Select **myLoadBalancer**  |
    | Select a backend pool | Select **myBackendPool** |
    | Configure network security group | Select **Create new**. </br> In the **Create network security group**, enter **myNSG** in **Name**. </br> Under **Inbound rules**, select **+Add an inbound rule**. </br> Under  **Service**, select **HTTP**. </br> Under **Priority**, enter **100**. </br> In **Name**, enter **myNSGRule** </br> Select **Add** </br> Select **OK** |
   
1. Select **Review + create**. 
  
1. Review the settings, and then select **Create**.

1. Follow the steps 1 through 7 to create another VM with the following values and all the other settings the same as **myVM1**:

    | Setting | VM 2 
    | ------- | ----- |
    | Name |  **myVM2** |
    | Availability zone | **Zone 2** |
    | Network security group | Select the existing **myNSG** |

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Install IIS

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **myVM1**.

1. On the **Overview** page, select **Connect**, then **Bastion**.

1. Enter the username and password entered during VM creation.

1. Select **Connect**.

1. On the server desktop, navigate to **Start** > **Windows PowerShell** > **Windows PowerShell**.

1. In the PowerShell Window, run the following commands to:

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

1. Close the Bastion session with **myVM1**.

1. Repeat steps 1 to 8 to install IIS and the updated iisstart.htm file on **myVM2**.

## Test the load balancer

1. In the search box at the top of the page, enter **Public IP**. Select **Public IP addresses** in the search results.

1. In **Public IP addresses**, select **myPublicIP**.

1. Copy the item in **IP address**. Paste the public IP into the address bar of your browser. The custom VM page of the IIS Web server is displayed in the browser.

    :::image type="content" source="./media/quickstart-load-balancer-standard-public-portal/load-balancer-test.png" alt-text="Screenshot of load balancer test":::

## Clean up resources

When no longer needed, delete the resource group, load balancer, and all related resources. To do so, select the resource group **CreatePubLBQS-rg** that contains the resources and then select **Delete**.

## Next steps

In this quickstart, you:

* Created an Azure Load Balancer
* Attached 2 VMs to the load balancer
* Tested the load balancer

To learn more about Azure Load Balancer, continue to:
> [!div class="nextstepaction"]
> [What is Azure Load Balancer?](load-balancer-overview.md)
