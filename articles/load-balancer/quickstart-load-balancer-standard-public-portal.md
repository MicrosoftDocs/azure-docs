---
title: "Quickstart: Create a public load balancer - Azure portal"
titleSuffix: Azure Load Balancer
description: This quickstart shows how to create a load balancer by using the Azure portal.
services: load-balancer
documentationcenter: na
author: asudbring 
manager: KumudD
# Customer intent: I want to create a load balancer so that I can load balance internet traffic to VMs.
ms.service: load-balancer
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/22/2021
ms.author: allensu
ms.custom: mvc
---

# Quickstart: Create a public load balancer to load balance VMs using the Azure portal

Get started with Azure Load Balancer by using the Azure portal to create a public load balancer and three virtual machines.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

---

# [**Standard SKU**](#tab/option-1-create-load-balancer-standard)

>[!NOTE]
>Standard SKU load balancer is recommended for production workloads.  For more information about SKUs, see **[Azure Load Balancer SKUs](skus.md)**.

:::image type="content" source="./media/quickstart-load-balancer-standard-public-portal/resources-diagram.png" alt-text="Standard load balancer resources created for quickstart." border="false":::

*Figure: Resources created in quickstart.*

In this section, you create a load balancer that load balances virtual machines. 

When you create a public load balancer, you create a new public IP address that is configured as the frontend (named as **LoadBalancerFrontend** by default) for the load balancer.

1. Select **Create a resource**. 
2. In the search box, enter **Load balancer**. Select **Load balancer** in the search results.
3. In the **Load balancer** page, select **Create**.
4. On the **Create load balancer** page enter, or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **Create new** and enter **CreatePubLBQS-rg** in the text box.|
    | Name                   | Enter **myLoadBalancer**                                   |
    | Region         | Select **(Europe) West Europe**.                                        |
    | Type          | Select **Public**.                                        |
    | SKU           | Leave the default **Standard**. |
    | Tier          | Leave the default **Regional**. |
    | Public IP address | Select **Create new**. If you have an existing Public IP you would like to use, select **Use existing**. |
    | Public IP address name | Type **myPublicIP** in the text box.|
    | Availability zone | Select **Zone-redundant** to create a resilient load balancer. To create a zonal load balancer, select a specific zone from 1, 2, or 3 |
    | Add a public IPv6 address | Select **No**. </br> For more information on IPv6 addresses and load balancer, see [What is IPv6 for Azure Virtual Network?](../virtual-network/ipv6-overview.md)  |
    | Routing preference | Leave the default of **Microsoft network**. </br> For more information on routing preference, see [What is routing preference (preview)?](../virtual-network/routing-preference-overview.md). |

5. Accept the defaults for the remaining settings, and then select **Review + create**.

6. In the **Review + create** tab, select **Create**.   
    
    :::image type="content" source="./media/quickstart-load-balancer-standard-public-portal/create-standard-load-balancer.png" alt-text="Create a standard load balancer" border="true":::
 
## Create load balancer resources

In this section, you configure:

* Load balancer settings for a backend address pool.
* A health probe.
* A load balancer rule.

### Create a backend pool

A backend address pool contains the IP addresses of the virtual (NICs) connected to the load balancer. 

Create the backend address pool **myBackendPool** to include virtual machines for load-balancing internet traffic.

1. Select **All services** in the left-hand menu, select **All resources**, and then select **myLoadBalancer** from the resources list.

2. Under **Settings**, select **Backend pools**, then select **Add**.

3. On the **Add a backend pool** page, for name, type **myBackendPool**, as the name for your backend pool, and then select **Add**.

### Create a health probe

The load balancer monitors the status of your app with a health probe. 

The health probe adds or removes VMs from the load balancer based on their response to health checks. 

Create a health probe named **myHealthProbe** to monitor the health of the VMs.

1. Select **All services** in the left-hand menu, select **All resources**, and then select **myLoadBalancer** from the resources list.

2. Under **Settings**, select **Health probes**, then select **Add**.
    
    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHealthProbe**. |
    | Protocol | Select **HTTP**. |
    | Port | Enter **80**.|
    | Interval | Enter **15** for number of **Interval** in seconds between probe attempts. |
    | Unhealthy threshold | Select **2** for number of **Unhealthy threshold** or consecutive probe failures that must occur before a VM is considered unhealthy.|
    | | |

3. Leave the rest the defaults and Select **OK**.

### Create a load balancer rule

A load balancer rule is used to define how traffic is distributed to the VMs. You define the frontend IP configuration for the incoming traffic and the backend IP pool to receive the traffic. The source and destination port are defined in the rule. 

In this section, you'll create a load balancer rule:

* Named **myHTTPRule**.
* In the frontend named **LoadBalancerFrontEnd**.
* Listening on **Port 80**.
* Directs load balanced traffic to the backend named **myBackendPool** on **Port 80**.

1. Select **All services** in the left-hand menu, select **All resources**, and then select **myLoadBalancer** from the resources list.

2. Under **Settings**, select **Load-balancing rules**, then select **Add**.

3. Use these values to configure the load-balancing rule:
    
    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHTTPRule**. |
    | IP Version | Select **IPv4** |
    | Frontend IP address | Select **LoadBalancerFrontEnd** |
    | Protocol | Select **TCP**. |
    | Port | Enter **80**.|
    | Backend port | Enter **80**. |
    | Backend pool | Select **myBackendPool**.|
    | Health probe | Select **myHealthProbe**. |
    | Idle timeout (minutes) | Move the slider to **15** minutes. |
    | TCP reset | Select **Enabled**. |
    | Outbound source network address translation (SNAT) | Select **(Recommended) Use outbound rules to provide backend pool members access to the internet.** |

4. Leave the rest of the defaults and then select **OK**.

## Create backend servers

In this section, you:

* Create a virtual network.
* Create three virtual machines for the backend pool of the load balancer.
* Install IIS on the virtual machines to test the load balancer.

## Create the virtual network

In this section, you'll create a virtual network and subnet.

1. On the upper-left side of the screen, select **Create a resource > Networking > Virtual network** or search for **Virtual network** in the search box.

2. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription                                  |
    | Resource Group   | Select **CreatePubLBQS-rg** |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**                                    |
    | Region           | Select **West Europe** |

3. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

4. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.1.0.0/16** |

5. Under **Subnet name**, select the word **default**.

6. In **Edit subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **myBackendSubnet** |
    | Subnet address range | Enter **10.1.0.0/24** |

7. Select **Save**.

8. Select the **Security** tab.

9. Under **BastionHost**, select **Enable**. Enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Bastion name | Enter **myBastionHost** |
    | AzureBastionSubnet address space | Enter **10.1.1.0/24** |
    | Public IP Address | Select **Create new**. </br> For **Name**, enter **myBastionIP**. </br> Select **OK**. |


8. Select the **Review + create** tab or select the **Review + create** button.

9. Select **Create**.

### Create virtual machines

In this section, you'll create three VMs (**myVM1**, **myVM2** and **myVM3**) in three different zones (**Zone 1**, **Zone 2**, and **Zone 3**). 

These VMs are added to the backend pool of the load balancer that was created earlier.

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Virtual machine**. 
   
2. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **CreatePubLBQS-rg** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM1** |
    | Region | Select **West Europe** |
    | Availability Options | Select **Availability zones** |
    | Availability zone | Select **1** |
    | Image | Select **Windows Server 2019 Datacenter** |
    | Azure Spot instance | Select **No** |
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
    | Configure network security group | Select **Create new**. </br> In the **Create network security group**, enter **myNSG** in **Name**. </br> Under **Inbound rules**, select **+Add an inbound rule**. </br> Under  **Destination port ranges**, enter **80**. </br> Under **Priority**, enter **100**. </br> In **Name**, enter **myHTTPRule** </br> Select **Add** </br> Select **OK** |
    | **Load balancing**  |
    | Place this virtual machine behind an existing load balancing solution? | Select **Yes** |
    | **Load balancing settings** |
    | Load balancing options | Select **Azure load balancing** |
    | Select a load balancer | Select **myLoadBalancer**  |
    | Select a backend pool | Select **myBackendPool** |

5. Select the **Management** tab, or select **Next** > **Management**.

6. In the **Management** tab, select or enter:
    
    | Setting | Value |
    |-|-|
    | **Monitoring** |  |
    | Boot diagnostics | Select **Off** |
   
7. Select **Review + create**. 
  
8. Review the settings, and then select **Create**.

9. Follow the steps 1 to 8 to create two additional VMs with the following values and all the other settings the same as **myVM1**:

    | Setting | VM 2| VM 3|
    | ------- | ----- |---|
    | Name |  **myVM2** |**myVM3**|
    | Availability zone | **2** |**3**|
    | Network security group | Select the existing **myNSG**| Select the existing **myNSG**|

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Create outbound rule configuration
Load balancer outbound rules configure outbound SNAT for VMs in the backend pool. 

For more information on outbound connections, see [Outbound connections in Azure](load-balancer-outbound-connections.md).

### Create outbound rule

1. Select **All services** in the left-hand menu, select **All resources**, and then select **myLoadBalancer** from the resources list.

2. Under **Settings**, select **Outbound rules**, then select **Add**.

3. Use these values to configure the outbound rules:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myOutboundRule**. |
    | Frontend IP address | Select **Create new**. </br> In **Name**, enter **LoadBalancerFrontEndOutbound**. </br> Select **IP address** or **IP prefix**. </br> Select **Create new** under **Public IP address** or **Public IP prefix**. </br> For Name, enter  **myPublicIPOutbound** or **myPublicIPPrefixOutbound**. </br> Select **Add**.|
    | Idle timeout (minutes) | Move slider to **15 minutes**.|
    | TCP Reset | Select **Enabled**.|
    | Backend pool | Select **Create new**. </br> Enter **myBackendPoolOutbound** in **Name**. </br> Select **Add**. |
    | Port allocation -> Port allocation | Select **Manually choose number of outbound ports** |
    | Outbound ports -> Choose by | Select **Ports per instance** |
    | Outbound ports -> Ports per instance | Enter **10000**. |

4. Select **Add**.

### Add virtual machines to outbound pool

1. Select **All services** in the left-hand menu, select **All resources**, and then select **myLoadBalancer** from the resources list.

2. Under **Settings**, select **Backend pools**.

3. Select **myBackendPoolOutbound**.

4. In **Virtual network**, select **myVNet**.

5. In **Virtual machines**, select **+ Add**.

6. Check the boxes next to **myVM1**, **myVM2**, and **myVM3**. 

7. Select **Add**.

8. Select **Save**.

# [**Basic SKU**](#tab/option-1-create-load-balancer-basic)

>[!NOTE]
>Standard SKU load balancer is recommended for production workloads.  For more information about SKUs, see **[Azure Load Balancer SKUs](skus.md)**.

:::image type="content" source="./media/quickstart-load-balancer-standard-public-portal/resources-diagram-basic.png" alt-text="Basic load balancer resources created in quickstart." border="false":::

*Figure: Resources created in quickstart.*

In this section, you create a load balancer that load balances virtual machines. 

When you create a public load balancer, you create a new public IP address that is configured as the frontend (named as **LoadBalancerFrontend** by default) for the load balancer.

1. Select **Create a resource**. 
2. In the search box, enter **Load balancer**. Select **Load balancer** in the search results.
3. In the **Load balancer** page, select **Create**.
4. On the **Create load balancer** page enter, or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **Create new** and type **CreatePubLBQS-rg** in the text box.|
    | Name                   | Enter **myLoadBalancer**                                   |
    | Region         | Select **West Europe**.                                        |
    | Type          | Select **Public**.                                        |
    | SKU           | Select **Basic** |
    | Public IP address | Select **Create new**. If you have an existing Public IP you would like to use, select **Use existing**. |
    | Public IP address name | Type **myPublicIP** in the text box.|
    | Assignment | Select **Dynamic** |
    | Add a public IPv6 address | Select **No**. </br> For more information on IPv6 addresses and load balancer, see [What is IPv6 for Azure Virtual Network?](../virtual-network/ipv6-overview.md)  |

5. Accept the defaults for the remaining settings, and then select **Review + create**.

6. In the **Review + create** tab, select **Create**.   

    :::image type="content" source="./media/quickstart-load-balancer-standard-public-portal/create-basic-load-balancer.png" alt-text="Create a basic load balancer" border="true":::

## Create load balancer resources

In this section, you configure:

* Create a virtual network.
* Load balancer settings for a backend address pool.
* A health probe.
* A load balancer rule.

## Create the virtual network

In this section, you'll create a virtual network and subnet.

1. On the upper-left side of the screen, select **Create a resource > Networking > Virtual network** or search for **Virtual network** in the search box.

2. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription                                  |
    | Resource Group   | Select **CreatePubLBQS-rg** |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**                                    |
    | Region           | Select **West Europe** |

3. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

4. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.1.0.0/16** |

5. Under **Subnet name**, select the word **default**.

6. In **Edit subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **myBackendSubnet** |
    | Subnet address range | Enter **10.1.0.0/24** |

7. Select **Save**.

8. Select the **Security** tab.

9. Under **BastionHost**, select **Enable**. Enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Bastion name | Enter **myBastionHost** |
    | AzureBastionSubnet address space | Enter **10.1.1.0/24** |
    | Public IP Address | Select **Create new**. </br> For **Name**, enter **myBastionIP**. </br> Select **OK**. |


8. Select the **Review + create** tab or select the **Review + create** button.

9. Select **Create**.
### Create a backend pool

A backend address pool contains the IP addresses of the virtual (NICs) connected to the load balancer. 

Create the backend address pool **myBackendPool** to include virtual machines for load-balancing internet traffic.

1. Select **All services** in the left-hand menu, select **All resources**, and then select **myLoadBalancer** from the resources list.

2. Under **Settings**, select **Backend pools**, then select **Add**.

3. In the **Add a backend pool** page, enter, or select:
    
    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myBackendPool**. |
    | Virtual network | Select **myVNet**. |
    | Associated to | Select **Virtual machines** |

### Create a health probe

The load balancer monitors the status of your app with a health probe. 

The health probe adds or removes VMs from the load balancer based on their response to health checks. 

Create a health probe named **myHealthProbe** to monitor the health of the VMs.

1. Select **All services** in the left-hand menu, select **All resources**, and then select **myLoadBalancer** from the resources list.

2. Under **Settings**, select **Health probes**, then select **Add**.
    
    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHealthProbe**. |
    | Protocol | Select **HTTP**. |
    | Port | Enter **80**.|
    | Path | Enter **/** |
    | Interval | Enter **15** for number of **Interval** in seconds between probe attempts. |
    | Unhealthy threshold | Select **2** for number of **Unhealthy threshold** or consecutive probe failures that must occur before a VM is considered unhealthy.|

3. Select **OK**.

### Create a load balancer rule

A load balancer rule is used to define how traffic is distributed to the VMs. You define the frontend IP configuration for the incoming traffic and the backend IP pool to receive the traffic. The source and destination port are defined in the rule. 

In this section, you'll create a load balancer rule:

* Named **myHTTPRule**.
* In the frontend named **LoadBalancerFrontEnd**.
* Listening on **Port 80**.
* Directs load balanced traffic to the backend named **myBackendPool** on **Port 80**.

1. Select **All services** in the left-hand menu, select **All resources**, and then select **myLoadBalancer** from the resources list.

2. Under **Settings**, select **Load balancing rules**, then select **Add**.

3. Use these values to configure the load-balancing rule:
    
    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHTTPRule**. |
    | IP Version | Select **IPv4** |
    | Frontend IP address | Select **LoadBalancerFrontEnd** |
    | Protocol | Select **TCP**. |
    | Port | Enter **80**.|
    | Backend port | Enter **80**. |
    | Backend pool | Select **myBackendPool**.|
    | Health probe | Select **myHealthProbe**. |
    | Idle timeout (minutes) | Move the slider to **15** minutes. |
 
4. Leave the rest of the defaults and then select **OK**.

## Create backend servers

In this section, you:

* Create three virtual machines for the backend pool of the load balancer.
* Create an availability set for the virtual machines.
* Install IIS on the virtual machines to test the load balancer.

### Create virtual machines

In this section, you'll create three VMs (**myVM1**, **myVM2**, and **myVM3**) with a basic public IP address.  

The three VMs will be added to an availability set named **myAvailabilitySet**.

These VMs are added to the backend pool of the load balancer that was created earlier.

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Virtual machine**. 
   
2. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **CreatePubLBQS-rg** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM1** |
    | Region | Select **West Europe** |
    | Availability Options | Select **Availability set** |
    | Availability set | Select **Create new**. </br> Enter **myAvailabilitySet** in **Name**. </br> Select **OK** |
    | Image | **Windows Server 2019 Datacenter** |
    | Azure Spot instance | Select **No** |
    | Size | Choose VM size or take default setting |
    | **Administrator account** |  |
    | Username | Enter a username |
    | Password | Enter a password |
    | Confirm password | Reenter password |

3. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
4. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | Select **myVNet** |
    | Subnet | Select **myBackendSubnet** |
    | Public IP | Select **None** |
    | NIC network security group | Select **Advanced**|
    | Configure network security group | Select **Create new**. </br> In the **Create network security group**, enter **myNSG** in **Name**. </br> Under **Inbound rules**, select **+Add an inbound rule**. </br> Under  **Destination port ranges**, enter **80**. </br> Under **Priority**, enter **100**. </br> In **Name**, enter **myHTTPRule** </br> Select **Add** </br> Select **OK** |
    | **Load balancing**  |
    | Place this virtual machine behind an existing load balancing solution? | Select **No** |
 
5. Select the **Management** tab, or select **Next** > **Management**.

6. In the **Management** tab, select or enter:
    
    | Setting | Value |
    |---|---|
    | **Monitoring** | |
    | Boot diagnostics | Select **Off** |

7. Select **Review + create**. 
  
8. Review the settings, and then select **Create**.

9. Follow the steps 1 to 8 to create two additional VMs with the following values and all the other settings the same as **myVM1**:

    | Setting | VM 2| VM 3|
    | ------- | ----- |---|
    | Name |  **myVM2** |**myVM3**|
    | Availability set| Select **myAvailabilitySet** | Select **myAvailabilitySet**|
    | Network security group | Select the existing **myNSG**| Select the existing **myNSG**|

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

### Add virtual machines to the backend pool

The VMs created in the previous steps must be added to the backend pool of **myLoadBalancer**.

1. Select **All services** in the left-hand menu, select **All resources**, and then select **myLoadBalancer** from the resources list.

2. Under **Settings**, select **Backend pools**, then select **myBackendPool**.

3. Select **Virtual machines** in **Associated to**.

4. In the **Virtual machines** section, select **+ Add**.

5. Select the boxes next to **myVM1**, **myVM2**, and **myVM3**.

6. Select **Add**.

7. Select **Save**.

---

## Install IIS

1. Select **All services** in the left-hand menu, select **All resources**, and then from the resources list, select **myVM1** that is located in the **CreatePubLBQS-rg** resource group.

2. On the **Overview** page, select **Connect**, then **Bastion**.

4. Enter the username and password entered during VM creation.

5. Select **Connect**.

6. On the server desktop, navigate to **Windows Administrative Tools** > **Windows PowerShell**.

7. In the PowerShell Window, run the following commands to:

    * Install the IIS server
    * Remove the default iisstart.htm file
    * Add a new iisstart.htm file that displays the name of the VM:

   ```powershell
    
    # install IIS server role
    Install-WindowsFeature -name Web-Server -IncludeManagementTools
    
    # remove default htm file
     remove-item  C:\inetpub\wwwroot\iisstart.htm
    
    # Add a new htm file that displays server name
     Add-Content -Path "C:\inetpub\wwwroot\iisstart.htm" -Value $("Hello World from " + $env:computername)
   ```
8. Close the Bastion session with **myVM1**.

9. Repeat steps 1 to 6 to install IIS and the updated iisstart.htm file on **myVM2** and **myVM3**.

## Test the load balancer

1. Find the public IP address for the load balancer on the **Overview** screen. Select **All services** in the left-hand menu, select **All resources**, and then select **myPublicIP**.

2. Copy the public IP address, and then paste it into the address bar of your browser. The default page of IIS Web server is displayed on the browser.

   ![IIS Web server](./media/tutorial-load-balancer-standard-zonal-portal/load-balancer-test.png)

To see the load balancer distribute traffic across all three VMs, you can customize the default page of each VM's IIS Web server and then force-refresh your web browser from the client machine.

## Clean up resources

When no longer needed, delete the resource group, load Balancer, and all related resources. To do so, select the resource group **CreatePubLBQS-rg** that contains the resources and then select **Delete**.

## Next steps

In this quickstart, you:

* Created an Azure Standard or Basic Load Balancer
* Attached 3 VMs to the load balancer.
* Configured the load balancer traffic rule, health probe, and then tested the load balancer. 

To learn more about Azure Load Balancer, continue to:
> [!div class="nextstepaction"]
> [What is Azure Load Balancer?](load-balancer-overview.md)