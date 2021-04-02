---
title: 'Tutorial: Create a public load balancer with an IP-based backend - Azure portal'
titleSuffix: Azure Load Balancer
description: In this tutorial, learn how to create a public load balancer with an IP based backend pool.
author: asudbring
ms.author: allensu
ms.service: load-balancer
ms.topic: tutorial
ms.date: 3/31/2021
ms.custom: template-tutorial
---

# Tutorial: Create a public load balancer with an IP-based backend using the Azure portal

In this tutorial, you'll learn how to create a public load balancer with an IP based backend pool. 

A traditional deployment of Azure Load Balancer uses the network interface of the virtual machines. With an IP-based backend, the virtual machines are added to the backend by IP address.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network
> * Create a NAT gateway for outbound connectivity
> * Create an Azure Load Balancer
> * Create an IP based backend pool
> * Create two virtual machines
> * Test the load balancer
## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create a virtual network

In this section, you'll create a virtual network for the load balancer, NAT gateway, and virtual machines.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the upper-left side of the screen, select **Create a resource > Networking > Virtual network** or search for **Virtual network** in the search box.

2. Select **Create**. 

3. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription                                  |
    | Resource Group   | Select **TutorPubLBIP-rg** |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**                                    |
    | Region           | Select **(US) East US** |

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
## Create NAT gateway

In this section, you'll create a NAT gateway and assign it to the subnet in the virtual network you created previously.

1. On the upper-left side of the screen, select **Create a resource > Networking > NAT gateway** or search for **NAT gateway** in the search box.

2. Select **Create**. 

3. In **Create network address translation (NAT) gateway**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription.                                  |
    | Resource Group   | Select **Create new** and enter **TutorPubLBIP-rg** in the text box. </br> Select **OK**. |
    | **Instance details** |                                                                 |
    | Name             | Enter **myNATgateway**                                    |
    | Region           | Select **(US) East US**  |
    | Availability Zone | Select **None**. |
    | Idle timeout (minutes) | Enter **10**. |

4. Select the **Outbound IP** tab, or select the **Next: Outbound IP** button at the bottom of the page.

5. In the **Outbound IP** tab, enter or select the following information:

    | **Setting** | **Value** |
    | ----------- | --------- |
    | Public IP addresses | Select **Create a new public IP address**. </br> In **Name**, enter **myPublicIP-NAT**. </br> Select **OK**. |

6. Select the **Subnet** tab, or select the **Next: Subnet** button at the bottom of the page.

7. In the **Subnet** tab, select **myVNet** in the **Virtual network** pull-down.

8. Check the box next to **myBackendSubnet**.

9. Select the **Review + create** tab, or select the blue **Review + create** button at the bottom of the page.

10. Select **Create**.
## Create load balancer

In this section, you'll create a Standard Azure Load Balancer. 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **Create a resource**. 
3. In the search box, enter **Load balancer**. Select **Load balancer** in the search results.
4. In the **Load balancer** page, select **Create**.
5. On the **Create load balancer** page enter, or select the following information: 

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | **Project details** |   |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **TutorPubLBIP-rg**.|
    | **Instance details** |   |
    | Name                   | Enter **myLoadBalancer**                                   |
    | Region         | Select **(US) East US**.                                        |
    | Type          | Select **Public**.                                        |
    | SKU           | Leave the default **Standard**. |
    | Tier          | Leave the default **Regional**. |
    | **Public IP address** |   |
    | Public IP address | Select **Create new**. </br> If you have an existing Public IP you would like to use, select **Use existing**. |
    | Public IP address name | Enter **myPublicIP-LB** in the text box.|
    | Availability zone | Select **Zone-redundant** to create a resilient load balancer. To create a zonal load balancer, select a specific zone from 1, 2, or 3 |
    | Add a public IPv6 address | Select **No**. </br> For more information on IPv6 addresses and load balancer, see [What is IPv6 for Azure Virtual Network?](../virtual-network/ipv6-overview.md)  |
    | Routing preference | Leave the default of **Microsoft network**. </br> For more information on routing preference, see [What is routing preference (preview)?](../virtual-network/routing-preference-overview.md). |

6. Accept the defaults for the remaining settings, and then select **Review + create**.

7. In the **Review + create** tab, select **Create**.

## Create load balancer resources

In this section, you configure:

* Load balancer settings for a backend address pool.
* A health probe.
* A load balancer rule.

### Create a backend pool

A backend address pool contains the IP addresses of the virtual (NICs) connected to the load balancer. 

Create the backend address pool **myBackendPool** to include virtual machines for load-balancing internet traffic.

1. Select **All services** in the left-hand menu, select **All resources**, and then select **myLoadBalancer** from the resources list.

2. Under **Settings**, select **Backend pools**, then select **+ Add**.

3. On the **Add a backend pool** page, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myBackendPool**. |
    | Virtual network | Select **myVNet**. |
    | Backend Pool Configuration | Select **IP Address**. |
    | IP Version | Select **IPv4**. |

4. Select **Add**.

### Create a health probe

The load balancer monitors the status of your app with a health probe. 

The health probe adds or removes VMs from the load balancer based on their response to health checks. 

Create a health probe named **myHealthProbe** to monitor the health of the VMs.

1. Select **All services** in the left-hand menu, select **All resources**, and then select **myLoadBalancer** from the resources list.

2. Under **Settings**, select **Health probes**, then select **+ Add**.
    
    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myHealthProbe**. |
    | Protocol | Select **TCP**. |
    | Port | Enter **80**.|
    | Interval | Enter **15** for number of **Interval** in seconds between probe attempts. |
    | Unhealthy threshold | Select **2**. |
   
3. Leave the rest the defaults and Select **Add**.

### Create a load balancer rule

A load balancer rule is used to define how traffic is distributed to the VMs. You define the frontend IP configuration for the incoming traffic and the backend IP pool to receive the traffic. The source and destination port are defined in the rule. 

In this section, you'll create a load balancer rule:

* Named **myHTTPRule**.
* In the frontend named **LoadBalancerFrontEnd**.
* Listening on **Port 80**.
* Directs load balanced traffic to the backend named **myBackendPool** on **Port 80**.

1. Select **All services** in the left-hand menu, select **All resources**, and then select **myLoadBalancer** from the resources list.

2. Under **Settings**, select **Load-balancing rules**, then select **+ Add**.

3. Enter or select the following information for the load balancer rule:
    
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
    | Session persistence | Leave the default of **None**. |
    | Idle timeout (minutes) | Enter **15** minutes. |
    | TCP reset | Select **Enabled**. |
    | Floating IP | Select **Disabled**. |
    | Outbound source network address translation (SNAT) | Select **(Recommended) Use outbound rules to provide backend pool members access to the internet.** |

4. Leave the rest of the defaults and then select **Add**.

## Create virtual machines

In this section, you'll create two VMs (**myVM1** and **myVM2**) in two different zones (**Zone 1** and **Zone 2**).

These VMs are added to the backend pool of the load balancer that was created earlier.

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Virtual machine**. 
   
2. In **Create a virtual machine**, enter or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **TutorPubLBIP-rg** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM1** |
    | Region | Select **(US) East US** |
    | Availability Options | Select **Availability zones** |
    | Availability zone | Select **1** |
    | Image | Select **Windows Server 2019 Datacenter** |
    | Azure Spot instance | Leave the default |
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
    | Configure network security group | Select **Create new**. </br> In the **Create network security group**, enter **myNSG** in **Name**. </br> Within **Inbound rules**, select **+Add an inbound rule**. </br> Under **Service**, select **HTTP**. </br> In **Priority**, enter **100**. </br> Under **Name**, enter **myHTTPRule** </br> Select **Add** </br> Select **OK** |
    | **Load balancing**  |
    | Place this virtual machine behind an existing load-balancing solution? | Select the check box.|
    | **Load balancing settings** |
    | Load balancing options | Select **Azure load balancer** |
    | Select a load balancer | Select **myLoadBalancer**  |
    | Select a backend pool | Select **myBackendPool** |
   
5. Select **Review + create**. 
  
6. Review the settings, and then select **Create**.

7. Follow the steps 1 to 6 to create a VM with the following values and all the other settings the same as **myVM1**:

    | Setting | VM 2 |
    | ------- | ----- |
    | Name |  **myVM2** |
    | Availability zone | **2** |
    | Network security group | Select the existing **myNSG**| 

## Install IIS

1. Select **All services** in the left-hand menu, select **All resources**, and then from the resources list, select **myVM1** that is located in the **TutorPubLBIP-rg** resource group.

2. On the **Overview** page, select **Connect**, then **Bastion**.

3. Select the **Use Bastion** button.

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
    Remove-Item C:\inetpub\wwwroot\iisstart.htm
    
    # Add a new htm file that displays server name
    Add-Content -Path "C:\inetpub\wwwroot\iisstart.htm" -Value $("Hello World from " + $env:computername)
   ```
8. Close the Bastion session with **myVM1**.

9. Repeat steps 1 to 7 to install IIS and the updated iisstart.htm file on **myVM2**.

## Test the load balancer

1. Find the public IP address for the load balancer on the **Overview** screen. Select **All services** in the left-hand menu, select **All resources**, and then select **myPublicIP-LB**.

2. Copy the public IP address, and then paste it into the address bar of your browser. The default page of IIS Web server is displayed on the browser.

   ![IIS Web server](./media/tutorial-load-balancer-standard-zonal-portal/load-balancer-test.png)

To see the load balancer distribute traffic to myVM2, force-refresh your web browser from the client machine.
## Clean up resources

If you're not going to continue to use this application, delete
the virtual network, virtual machine, and NAT gateway with the following steps:

1. From the left-hand menu, select **Resource groups**.

2. Select the **TutorPubLBIP-rg** resource group.

3. Select **Delete resource group**.

4. Enter **TutorPubLBIP-rg** and select **Delete**.

## Next steps

In this tutorial you:

* Created a virtual network
* Created a NAT gateway
* Created a load balancer with an IP-based backend pool
* Tested the load balancer

Advance to the next article to learn how to create a cross-region load balancer:
> [!div class="nextstepaction"]
> [Create a cross-region Azure Load Balancer using the Azure portal](tutorial-cross-region-portal.md)
