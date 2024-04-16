---
title: "Tutorial: Protect your public load balancer with Azure DDoS Protection"
titleSuffix: Azure Load Balancer
description: Learn how to set up a public load balancer and protect it with Azure DDoS protection.
author: mbender-ms
ms.service: load-balancer
ms.topic: tutorial
ms.date: 06/06/2023
ms.author: mbender
ms.custom: template-tutorial
---

# Tutorial: Protect your public load balancer with Azure DDoS Protection

Azure DDoS Protection enables enhanced DDoS mitigation capabilities such as adaptive tuning, attack alert notifications, and monitoring to protect your public load balancers from large scale DDoS attacks.

> [!IMPORTANT]
> Azure DDoS Protection incurs a cost when you use the Network Protection SKU. Overages charges only apply if more than 100 public IPs are protected in the tenant. Ensure you delete the resources in this tutorial if you aren't using the resources in the future. For information about pricing, see [Azure DDoS Protection Pricing]( https://azure.microsoft.com/pricing/details/ddos-protection/). For more information about Azure DDoS protection, see [What is Azure DDoS Protection?](../ddos-protection/ddos-protection-overview.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a DDoS Protection plan.
> * Create a virtual network with DDoS Protection and Bastion service enabled.
> * Create a standard SKU public load balancer with frontend IP, health probe, backend configuration, and load-balancing rule.
> * Create a NAT gateway for outbound internet access for the backend pool.
> * Create virtual machine, then install and configure IIS on the VMs to demonstrate the port forwarding and load-balancing rules.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure account with an active subscription.

## Create a DDoS protection plan

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **DDoS protection**. Select **DDoS protection plans** in the search results and then select **+ Create**.

1. In the **Basics** tab of **Create a DDoS protection plan** page, enter or select the following information:

    :::image type="content" source="./media/protect-load-balancer-with-ddos-standard/create-ddos-plan.png" alt-text="Screenshot of creating a DDoS protection plan.":::

    | Setting | Value |
    |--|--|
    | **Project details** |   |
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **Create new**.  </br> Enter **TutorLoadBalancer-rg**. </br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myDDoSProtectionPlan**. |
    | Region | Select **(US) East US**. |

1. Select **Review + create** and then select **Create** to deploy the DDoS protection plan.

## Create the virtual network

In this section, you'll create a virtual network, subnet, Azure Bastion host, and associate the DDoS Protection plan. The virtual network and subnet contains the load balancer and virtual machines. The bastion host is used to securely manage the virtual machines and install IIS to test the load balancer. The DDoS Protection plan will protect all public IP resources in the virtual network.

> [!IMPORTANT]

> [!INCLUDE [Pricing](../../includes/bastion-pricing.md)]

>

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual Networks** in the search results.

2. In **Virtual networks**, select **+ Create**.

3. In **Create virtual network**, enter or select the following information in the **Basics** tab:

    | **Setting** | **Value** |
    |---|---|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **TutorLoadBalancer-rg** |
    | **Instance details** |  |
    | Name | Enter **myVNet** |
    | Region | Select **East US** |

4. Select the **IP Addresses** tab or select **Next: IP Addresses** at the bottom of the page.

5. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.1.0.0/16** |

6. Under **Subnet name**, select the word **default**. If a subnet isn't present, select **+ Add subnet**.

7. In **Edit subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **myBackendSubnet** |
    | Subnet address range | Enter **10.1.0.0/24** |

8. Select **Save** or **Add**.

9. Select the **Security** tab.

10. Under **BastionHost**, select **Enable**. Enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Bastion name | Enter **myBastionHost** |
    | AzureBastionSubnet address space | Enter **10.1.1.0/26** |
    | Public IP Address | Select **Create new**. </br> For **Name**, enter **myBastionIP**. </br> Select **OK**. |

11. Under **DDoS Network Protection**, select **Enable**. Then from the drop-down menu, select **myDDoSProtectionPlan**.

    :::image type="content" source="./media/protect-load-balancer-with-ddos-standard/enable-ddos.png" alt-text="Screenshot of enabling DDoS during virtual network creation.":::

12. Select the **Review + create** tab or select the **Review + create** button.

13. Select **Create**.
    
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

2. In the **Load balancer** page, select **+ Create**.

3. In the **Basics** tab of the **Create load balancer** page, enter or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Project details** |   |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **TutorLoadBalancer-rg**. |
    | **Instance details** |   |
    | Name                   | Enter **myLoadBalancer**                                   |
    | Region         | Select **East US**.                                        |
    | SKU           | Leave the default **Standard**. |
    | Type          | Select **Public**.                                        |
    | Tier          | Leave the default **Regional**. |

    :::image type="content" source="./media/protect-load-balancer-with-ddos-standard/create-standard-load-balancer.png" alt-text="Screenshot of create standard load balancer basics tab." border="true":::

4. Select **Next: Frontend IP configuration** at the bottom of the page.

5. In **Frontend IP configuration**, select **+ Add a frontend IP configuration**.

6. Enter **myFrontend** in **Name**.

7. Select **IPv4** for the **IP version**.

8. Select **IP address** for the **IP type**.

    > [!NOTE]
    > For more information on IP prefixes, see [Azure Public IP address prefix](../virtual-network/ip-services/public-ip-address-prefix.md).

9. Select **Create new** in **Public IP address**.

10. In **Add a public IP address**, enter **myPublicIP** for **Name**.

11. Select **Zone-redundant** in **Availability zone**.

    > [!NOTE]
    > In regions with [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones), you have the option to select no-zone (default option), a specific zone, or zone-redundant. The choice will depend on your specific domain failure requirements. In regions without Availability Zones, this field won't appear. </br> For more information on availability zones, see [Availability zones overview](../availability-zones/az-overview.md).

12. Leave the default of **Microsoft Network** for **Routing preference**.

13. Select **OK**.

14. Select **Add**.

15. Select **Next: Backend pools** at the bottom of the page.

16. In the **Backend pools** tab, select **+ Add a backend pool**.

17. Enter **myBackendPool** for **Name** in **Add backend pool**.

18. Select **myVNet** in **Virtual network**.

19. Select **IP Address** for **Backend Pool Configuration**.

21. Select **Save**.

22. Select **Next: Inbound rules** at the bottom of the page.

23. Under **Load balancing rule** in the **Inbound rules** tab, select **+ Add a load balancing rule**.

24. In **Add load balancing rule**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHTTPRule** |
    | IP Version | Select **IPv4** or **IPv6** depending on your requirements. |
    | Frontend IP address | Select **myFrontend (To be created)**. |
    | Backend pool | Select **myBackendPool**. |
    | Protocol | Select **TCP**. |
    | Port | Enter **80**. |
    | Backend port | Enter **80**. |
    | Health probe | Select **Create new**. </br> In **Name**, enter **myHealthProbe**. </br> Select **TCP** in **Protocol**. </br> Leave the rest of the defaults, and select **OK**. |
    | Session persistence | Select **None**. |
    | Idle timeout (minutes) | Enter or select **15**. |
    | TCP reset | Select **Enabled**. |
    | Floating IP | Select **Disabled**. |
    | Outbound source network address translation (SNAT) | Leave the default of **(Recommended) Use outbound rules to provide backend pool members access to the internet.** |

25. Select **Add**.

26. Select the blue **Review + create** button at the bottom of the page.

27. Select **Create**.

    > [!NOTE]
    > In this example we'll create a NAT gateway to provide outbound Internet access. The outbound rules tab in the configuration is bypassed as it's optional and isn't needed with the NAT gateway. For more information on Azure NAT gateway, see [What is Azure Virtual Network NAT?](../virtual-network/nat-gateway/nat-overview.md)
    > For more information about outbound connections in Azure, see [Source Network Address Translation (SNAT) for outbound connections](../load-balancer/load-balancer-outbound-connections.md)

## Create NAT gateway

In this section, you'll create a NAT gateway for outbound internet access for resources in the virtual network. For other options for outbound rules, check out [Network Address Translation (SNAT) for outbound connections](load-balancer-outbound-connections.md).

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

2. In **NAT gateways**, select **+ Create**.

3. In **Create network address translation (NAT) gateway**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorLoadBalancer-rg**. |
    | **Instance details** |    |
    | NAT gateway name | Enter **myNATgateway**. |
    | Region | Select **East US**. |
    | Availability zone | Select **None**. |
    | Idle timeout (minutes) | Enter **15**. |

4. Select the **Outbound IP** tab or select **Next: Outbound IP** at the bottom of the page.

5. In **Outbound IP**, select **Create a new public IP address** next to **Public IP addresses**.

6. Enter **myNATgatewayIP** in **Name**.

7. Select **OK**.

8. Select the **Subnet** tab or select the **Next: Subnet** button at the bottom of the page.

9. In **Virtual network** in the **Subnet** tab, select **myVNet**.

10. Select **myBackendSubnet** under **Subnet name**.

11. Select the blue **Review + create** button at the bottom of the page, or select the **Review + create** tab.

12. Select **Create**.

## Create virtual machines

In this section, you'll create two VMs (**myVM1** and **myVM2**) in two different zones (**Zone 1**, and **Zone 2**). 

These VMs are added to the backend pool of the load balancer that was created earlier.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. In **Virtual machines**, select **+ Create** > **Azure virtual machine**.
   
3. In **Create a virtual machine**, enter or select the following values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **TutorLoadBalancer-rg** |
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

4. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
5. In the Networking tab, select or enter the following information:

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
   
6. Select **Review + create**. 
  
7. Review the settings, and then select **Create**.

8. Follow the steps 1 through 7 to create another VM with the following values and all the other settings the same as **myVM1**:

    | Setting | VM 2 
    | ------- | ----- |
    | Name |  **myVM2** |
    | Availability zone | **Zone 2** |
    | Network security group | Select the existing **myNSG** |

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Install IIS

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **myVM1**.

3. On the **Overview** page, select **Connect**, then **Bastion**.

4. Enter the username and password entered during VM creation.

5. Select **Connect**.

6. On the server desktop, navigate to **Start** > **Windows PowerShell** > **Windows PowerShell**.

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

8. Close the Bastion session with **myVM1**.

9. Repeat steps 1 to 8 to install IIS and the updated iisstart.htm file on **myVM2**.

## Test the load balancer

1. In the search box at the top of the page, enter **Public IP**. Select **Public IP addresses** in the search results.

2. In **Public IP addresses**, select **myPublicIP**.

3. Copy the item in **IP address**. Paste the public IP into the address bar of your browser. The custom VM page of the IIS Web server is displayed in the browser.

    :::image type="content" source="./media/quickstart-load-balancer-standard-public-portal/load-balancer-test.png" alt-text="Screenshot of load balancer test.":::

## Clean up resources

When no longer needed, delete the resource group, load balancer, and all related resources. To do so, select the resource group **TutorLoadBalancer-rg** that contains the resources and then select **Delete**.

## Next steps

Advance to the next article to learn how to:

> [!div class="nextstepaction"]
> [Create a public load balancer with an IP-based backend](tutorial-load-balancer-ip-backend-portal.md)
