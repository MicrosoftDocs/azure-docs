---
title: Quickstart:Create a public Load Balancer - Azure portal
titleSuffix: Azure Load Balancer
description: This quickstart shows how to create a Load Balancer by using the Azure portal.
services: load-balancer
documentationcenter: na
author: asudbring 
manager: twooley
Customer intent: I want to create a Load Balancer so that I can load balance internet traffic to VMs.
ms.service: load-balancer
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/08/2020
ms.author: allensu
ms.custom: mvc
---

# Quickstart: Create a Load Balancer to load balance VMs using the Azure portal

Load balancing provides a higher level of availability and scale by spreading incoming requests across multiple virtual machines. You can use the Azure portal to create a load balancer to load balance virtual machines (VMs). This quickstart shows you how to load balance VMs using a public Load Balancer.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Create a Load Balancer

In this section, you create a Load Balancer that helps load balance virtual machines. You can create a public Load Balancer or an internal  Load Balancer. When you create a public Load Balancer, you must also create a new Public IP address that is configured as the frontend (named as *LoadBalancerFrontend* by default) for the Load Balancer.

1. On the top left-hand side of the screen, select **Create a resource** > **Networking** > **Load Balancer**.
2. In the **Basics** tab of the **Create load balancer** page, enter or select the following information, accept the defaults for the remaining settings, and then select **Review + create**:

    | Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Subscription               | Select your subscription.    |    
    | Resource group         | Select **Create new** and type *myResourceGroupSLB* in the text box.|
    | Name                   | *myLoadBalancer*                                   |
    | Region         | Select **West Europe**.                                        |
    | Type          | Select **Public**.                                        |
    | SKU           | Select **Standard** or **Basic**. Microsoft recommends Standard for production workloads. |
    | Public IP address | Select **Create new**. If you have an existing Public IP you would like to use, select **Use existing** |
    | Public IP address name              | Type *myPublicIP* in the text box.   Use ```-SKU Basic``` to create a Basic Public IP. Basic Public IPs are not compatible with **Standard** load balancer. Microsoft recommends using **Standard** for production workloads.|
    | Availability zone | Type *Zone-redundant* to create a resilient Load Balancer. To create a zonal Load Balancer, select a specific zone from 1, 2, or 3 |

> [!IMPORTANT]
> The rest of this quickstart assumes that **Standard** SKU is chosen during the SKU selection process above.


3. In the **Review + create** tab, select **Create**.   

    ![Create a Standard Load Balancer](./media/quickstart-load-balancer-standard-public-portal/create-standard-load-balancer.png)

## Create Load Balancer resources

In this section, you configure Load Balancer settings for a backend address pool, a health probe, and specify a balancer rule.

### Create a Backend pool

To distribute traffic to the VMs, a backend address pool contains the IP addresses of the virtual (NICs) connected to the Load Balancer. Create the backend address pool *myBackendPool* to include virtual machines for load-balancing internet traffic.

1. Select **All services** in the left-hand menu, select **All resources**, and then select **myLoadBalancer** from the resources list.
2. Under **Settings**, select **Backend pools**, then select **Add**.
3. On the **Add a backend pool** page, for name, type *myBackendPool*, as the name for your backend pool, and then select **Add**.

### Create a health probe

To allow the Load Balancer to monitor the status of your app, you use a health probe. The health probe dynamically adds or removes VMs from the Load Balancer rotation based on their response to health checks. Create a health probe *myHealthProbe* to monitor the health of the VMs.

1. Select **All services** in the left-hand menu, select **All resources**, and then select **myLoadBalancer** from the resources list.
2. Under **Settings**, select **Health probes**, then select **Add**.
    
    | Setting | Value |
    | ------- | ----- |
    | Name | Enter *myHealthProbe*. |
    | Protocol | Select **HTTP**. |
    | Port | Enter *80*.|
    | Interval | Enter *15* for number of **Interval** in seconds between probe attempts. |
    | Unhealthy threshold | Select **2** for number of **Unhealthy threshold** or consecutive probe failures that must occur before a VM is considered unhealthy.|
    | | |
4. Select **OK**.

### Create a Load Balancer rule
A Load Balancer rule is used to define how traffic is distributed to the VMs. You define the frontend IP configuration for the incoming traffic and the backend IP pool to receive the traffic, along with the required source and destination port. Create a Load Balancer rule *myLoadBalancerRuleWeb* for listening to port 80 in the frontend *FrontendLoadBalancer* and sending load-balanced network traffic to the backend address pool *myBackEndPool* also using port 80. 

1. Select **All services** in the left-hand menu, select **All resources**, and then select **myLoadBalancer** from the resources list.
2. Under **Settings**, select **Load balancing rules**, then select **Add**.
3. Use these values to configure the load balancing rule:
    
    | Setting | Value |
    | ------- | ----- |
    | Name | Enter *myHTTPRule*. |
    | Protocol | Select **TCP**. |
    | Port | Enter *80*.|
    | Backend port | Enter *80*. |
    | Backend pool | Select *myBackendPool*.|
    | Health probe | Select *myHealthProbe*. |
4. Leave the rest of the defaults and then select **OK**.


## Create backend servers

In this section, you create a virtual network, create three virtual machines for the backend pool of the Load Balancer, and then install IIS on the virtual machines to help test the Load Balancer.

## Virtual network and parameters

In this section you'll need to replace the following parameters in the steps with the information below:

| Parameter                   | Value                |
|-----------------------------|----------------------|
| **\<resource-group-name>**  | myResourceGroupSLB |
| **\<virtual-network-name>** | myVNet          |
| **\<region-name>**          | West Europe      |
| **\<IPv4-address-space>**   | 10.1.0.0\16          |
| **\<subnet-name>**          | myBackendSubnet        |
| **\<subnet-address-range>** | 10.1.0.0\24          |

[!INCLUDE [virtual-networks-create-new](../../includes/virtual-networks-create-new.md)]

### Create virtual machines
Public IP SKUs and Load Balancer SKUs must match. For Standard Load Balancer , use VMs with Standard IP addresses in the backend pool. In this section, you will create three VMs (*myVM1*, *myVM2* and *myVM3*) with a Standard public IP address in three different zones (*Zone 1*, *Zone 2*, and *Zone 3*) that are later added to the backend pool of the Load Balancer that was created earlier. If you selected Basic, use VMs with Basic IP addresses.

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Windows Server 2019 Datacenter**. 
   
1. In **Create a virtual machine**, type or select the following values in the **Basics** tab:
   - **Subscription** > **Resource Group**: Select **myResourceGroupSLB**.
   - **Instance Details** > **Virtual machine name**: Type *myVM1*.
   - **Instance Details** > **Region** > select **West Europe**.
   - **Instance Details** > **Availability Options** > Select **Availability zones**. 
   - **Instance Details** > **Availability zone** > Select **1**.
   - **Administrator account**> Enter the **Username**, **Password** and **Confirm password** information.
   - Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
1. In the **Networking** tab make sure the following are selected:
   - **Virtual network**: *myVnet*
   - **Subnet**: *myBackendSubnet*
   - **Public IP** > select **Create new**, and in the **Create public IP address** window, for **SKU**, select **Standard**, and for **Availability zone**, select **Zone-redundant**, and then select **OK**. If you created a Basic Load Balancer, select Basic. Microsoft recommends using Standard SKU for production workloads.
   - To create a new network security group (NSG), a type of firewall, under **Network Security Group**, select **Advanced**. 
       1. In the **Configure network security group** field, select **Create new**. 
       1. Type *myNetworkSecurityGroup*, and select **OK**.
   - To make the VM a part of the Load Balancer's backend pool, complete the following steps:
        - In **Load Balancing**, for **Place this virtual machine behind an existing load balancing solution?**, select **Yes**.
        - In **Load balancing settings**, for **Load balancing options**, select **Azure load balancer**.
        - For **Select a load balancer**, *myLoadBalancer*.
        - Select the **Management** tab, or select **Next** > **Management**.
2. In the **Management** tab, under **Monitoring**, set **Boot diagnostics** to **Off**. 
1. Select **Review + create**.   
1. Review the settings, and then select **Create**.
1. Follow the steps 2 to 6 to create two additional VMs with the following values and all the other settings the same as *myVM1*:

    | Setting | VM 2| VM 3|
    | ------- | ----- |---|
    | Name |  *myVM2* |*myVM3*|
    | Availability zone | 2 |3|
    |Public IP| **Standard** SKU|**Standard** SKU|
    | Public IP - Availability zone| **Zone redundant** |**Zone redundant**|
    | Network security group | Select the existing *myNetworkSecurity Group*| Select the existing *myNetworkSecurity Group*|

 ### Create NSG rule

In this section, you create a network security group rule to allow inbound connections using HTTP.

1. Select **All services** in the left-hand menu, select **All resources**, and then from the resources list select **myNetworkSecurityGroup** that is located in the **myResourceGroupSLB** resource group.
2. Under **Settings**, select **Inbound security rules**, and then select **Add**.
3. Enter these values for the inbound security rule named *myHTTPRule* to allow for an inbound HTTP connections using port 80:
    - **Source**: *Service Tag*
    -  **Source service tag**: *Internet*
    - **Destination port ranges**: *80*
    - **Protocol**: *TCP*
    - **Action**: *Allow*
    - **Priority**: *100*
    - **Name**: *myHTTPRule* 
    - **Description**: "*Allow HTTP* 
4. Select **Add**.
5. Repeat the steps for the inbound RDP rule, if needed, with the following differing values:
   - **Destination port ranges**: Type *3389*.
   - **Priority**: Type *200*. 
   - **Name**: Type *MyRDPRule*. 
   - **Description**: Type *Allow RDP*. 
 
### Install IIS

1. Select **All services** in the left-hand menu, select **All resources**, and then from the resources list, select **myVM1** that is located in the *myResourceGroupSLB* resource group.
2. On the **Overview** page, select **Connect** to RDP into the VM.
5. Log into the VM with the credentials that you provided during the creation of this VM. This launches a remote desktop session with virtual machine - *myVM1*.
6. On the server desktop, navigate to **Windows Administrative Tools**>**Windows PowerShell**.
7. In the PowerShell Window, run the following commands to install the IIS server, remove the  default iisstart.htm file, and then add a new iisstart.htm file that displays the name of the VM:

   ```azurepowershell-interactive
    
    # install IIS server role
    Install-WindowsFeature -name Web-Server -IncludeManagementTools
    
    # remove default htm file
     remove-item  C:\inetpub\wwwroot\iisstart.htm
    
    # Add a new htm file that displays server name
     Add-Content -Path "C:\inetpub\wwwroot\iisstart.htm" -Value $("Hello World from " + $env:computername)
   ```
6. Close the RDP session with *myVM1*.
7. Repeat steps 1 to 6 to install IIS and the updated iisstart.htm file on *myVM2* and *myVM3*.

## Test the Load Balancer
1. Find the public IP address for the Load Balancer on the **Overview** screen. Select **All services** in the left-hand menu, select **All resources**, and then select **myPublicIP**.

2. Copy the public IP address, and then paste it into the address bar of your browser. The default page of IIS Web server is displayed on the browser.

   ![IIS Web server](./media/tutorial-load-balancer-standard-zonal-portal/load-balancer-test.png)

To see the Load Balancer distribute traffic across all three VMs, you can customize the default page of each VM's IIS Web server and then force-refresh your web browser from the client machine.

## Clean up resources

When no longer needed, delete the resource group, Load Balancer, and all related resources. To do so, select the resource group (*myResourceGroupSLB*) that contains the Load Balancer, and then select **Delete**.

## Next steps

In this quickstart, you created a Standard Load Balancer, attached VMs to it, configured the Load Balancer traffic rule, health probe, and then tested the Load Balancer. To learn more about Azure Load Balancer, continue to [Azure Load Balancer tutorials](tutorial-load-balancer-standard-public-zone-redundant-portal.md).

Learn more about [Load Balancer and Availability zones](load-balancer-standard-availability-zones.md).
