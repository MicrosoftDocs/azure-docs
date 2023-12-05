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

[!INCLUDE [load-balancer-nat-gateway](../../includes/load-balancer-nat-gateway.md)]

[!INCLUDE [load-balancer-create-bastion](../../includes/load-balancer-create-bastion.md)]


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
    | Resource group         | Select **load-balancer-rg**. |
    | **Instance details** |   |
    | Name                   | Enter **load-balancer**                                   |
    | Region         | Select **East US**.                                        |
    | SKU           | Leave the default **Standard**. |
    | Type          | Select **Public**.                                        |
    | Tier          | Leave the default **Regional**. |

    :::image type="content" source="./media/quickstart-load-balancer-standard-public-portal/create-standard-load-balancer.png" alt-text="Screenshot of create standard load balancer basics tab." border="true":::

1. Select **Next: Frontend IP configuration** at the bottom of the page.

1. In **Frontend IP configuration**, select **+ Add a frontend IP configuration**.

1. Enter **lb-frontend** in **Name**.

1. Select **IPv4** for the **IP version**.

1. Select **IP address** for the **IP type**.

    > [!NOTE]
    > For more information on IP prefixes, see [Azure Public IP address prefix](../virtual-network/ip-services/public-ip-address-prefix.md).

1. Select **Create new** in **Public IP address**.

1. In **Add a public IP address**, enter **lb-frontend-ip** for **Name**.

1. Select **Zone-redundant** in **Availability zone**.

    > [!NOTE]
    > In regions with [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones), you have the option to select no-zone (default option), a specific zone, or zone-redundant. The choice will depend on your specific domain failure requirements. In regions without Availability Zones, this field won't appear. </br> For more information on availability zones, see [Availability zones overview](../availability-zones/az-overview.md).

1. Leave the default of **Microsoft Network** for **Routing preference**.

1. Select **OK**.

1. Select **Add**.

1. Select **Next: Backend pools** at the bottom of the page.

1. In the **Backend pools** tab, select **+ Add a backend pool**.

1. Enter **lb-backend-pool** for **Name** in **Add backend pool**.

1. Select **lb-vnet** in **Virtual network**.

1. Select **IP Address** for **Backend Pool Configuration**.

1. Select **Save**.

1. Select **Next: Inbound rules** at the bottom of the page.

1. Under **Load balancing rule** in the **Inbound rules** tab, select **+ Add a load balancing rule**.

1. In **Add load balancing rule**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **lb-HTTP-rule** |
    | IP Version | Select **IPv4** or **IPv6** depending on your requirements. |
    | Frontend IP address | Select **lb-frontend (To be created)**. |
    | Backend pool | Select **lb-backend-pool**. |
    | Protocol | Select **TCP**. |
    | Port | Enter **80**. |
    | Backend port | Enter **80**. |
    | Health probe | Select **Create new**. </br> In **Name**, enter **lb-health-probe**. </br> Select **HTTP** in **Protocol**. </br> Leave the rest of the defaults, and select **Save**. |
    | Session persistence | Select **None**. |
    | Idle timeout (minutes) | Enter or select **15**. |
    | Enable TCP reset | Select checkbox. |
    | Enable Floating IP | Leave unchecked. |
    | Outbound source network address translation (SNAT) | Leave the default of **(Recommended) Use outbound rules to provide backend pool members access to the internet.** |

1. Select **Save**.

1. Select the blue **Review + create** button at the bottom of the page.

1. Select **Create**.

    > [!NOTE]
    > In this example we'll create a NAT gateway to provide outbound Internet access. The outbound rules tab in the configuration is bypassed as it's optional and isn't needed with the NAT gateway. For more information on Azure NAT gateway, see [What is Azure Virtual Network NAT?](../virtual-network/nat-gateway/nat-overview.md)
    > For more information about outbound connections in Azure, see [Source Network Address Translation (SNAT) for outbound connections](../load-balancer/load-balancer-outbound-connections.md)

[!INCLUDE [load-balancer-create-2-virtual-machines](../../includes/load-balancer-create-2-virtual-machines.md)]

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

1. In **Public IP addresses**, select **frontend-ip**.

1. Copy the item in **IP address**. Paste the public IP into the address bar of your browser. The custom VM page of the IIS Web server is displayed in the browser.

    :::image type="content" source="./media/quickstart-load-balancer-standard-public-portal/load-balancer-test.png" alt-text="Screenshot of load balancer test":::

## Clean up resources

When no longer needed, delete the resource group, load balancer, and all related resources. To do so, select the resource group **load-balancer-rg** that contains the resources and then select **Delete**.

## Next steps

In this quickstart, you:

* Created an Azure Load Balancer
* Attached 2 VMs to the load balancer
* Tested the load balancer

To learn more about Azure Load Balancer, continue to:
> [!div class="nextstepaction"]
> [What is Azure Load Balancer?](load-balancer-overview.md)
