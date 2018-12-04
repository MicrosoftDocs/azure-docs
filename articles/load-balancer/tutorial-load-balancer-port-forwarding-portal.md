---
title: "Tutorial: Configure port forwarding in Azure Load Balancer using the Azure portal | Microsoft Docs"
description: This tutorial shows how to configure port forwarding using Azure Load Balancer to create connections to VMs in a virtual network.
services: load-balancer
documentationcenter: na
author: KumudD 
manager: jeconnoc
editor: ''
tags: azure-resource-manager
Customer intent: As an IT administrator, I want to configure port forwarding in Azure Load Balancer to remotely connect to VMs in an Azure virtual network.

ms.assetid: 
ms.service: load-balancer
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/03/18
ms.author: kumud
ms.custom: mvc
---

# Tutorial: Configure port forwarding in Azure Load Balancer using the portal

Port forwarding lets you connect to virtual machines (VMs) in an Azure virtual network by using an Azure Load Balancer public IP address and port number. 

In this tutorial, you set up port forwarding on an Azure Load Balancer. You learn how to:

> [!div class="checklist"]
> * Create a virtual network and VMs with network security group (NSG) rules. 
> * Create a load balancer with health probe and traffic rules.
> * Add VMs to the load balancer back-end pool.
> * Create load balancer inbound NAT port-forwarding rules.
> * Install and configure IIS on the VMs to view load balancing and port forwarding in action.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

For all steps in this tutorial, sign in to the Azure portal at [http://portal.azure.com](http://portal.azure.com).

## Create and configure back-end servers

First, create a virtual network with two virtual machines to use for the back-end pool of your load balancer. 

### Create a virtual network

1. On the upper-left side of the portal, select **Create a resource** > **Networking** > **Virtual network**.
   
1. In the **Create virtual network** pane, type or select these values:
   
   - **Name**: Type *MyVNet*.
   - **ResourceGroup**: Select **Create new**, then enter *MyResourceGroupLB*, and select **OK**. 
   - **Subnet** > **Name**: Type *MyBackendSubnet*.
   
1. Select **Create**.

   ![Create a virtual network](./media/load-balancer-standard-public-portal/2-load-balancer-virtual-network.png)

### Create virtual machines

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Windows Server 2016 Datacenter**. 
   
1. In **Create a virtual machine**, type or select the following values in the **Basics** tab:
   - **Subscription** > **Resource Group**: Drop down and select **MyResourceGroupLB**.
   - **Instance Details** > **Virtual machine name**: Type *MyVM1*.
   - **Instance Details** > **Availability Options**: 
     1. Drop down and select **Availability set**. 
     2. Select **Create new**, type *MyAvailabilitySet*, and select **OK**.
   - **Administrator Account** > **Username**: Type *azureuser*.
   - **Administrator Account** > **Password**: Type *Azure1234567*. 
     Retype the password in the **Confirm password** field.
   
1. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**. 
   
   Make sure the following are selected:
   - **Virtual network**: **MyVnet**
   - **Subnet**: **MyBackendSubnet**
   - **Public IP**: **MyVM1-ip**
   
   To create a new network security group (NSG), a type of firewall, under **Network Security Group**, select **Advanced**. 
   1. In the **Configure network security group** field, select **Create new**. 
   1. Type *MyNetworkSecurityGroup*, and select **OK**. 
   
1. Select the **Management** tab, or select **Next** > **Management**. Under **Monitoring**, set **Boot diagnostics** to **Off**.
   
1. Select **Review + create**.
   
1. Review the settings, and then select **Create**. 

1. Follow the steps to create a second VM named *MyVM2*, with all the other settings the same as MyVM1. 

### Create NSG rules for the VMs

Create network security group (NSG) rules for the VMs, to allow inbound internet (HTTP) and remote desktop (RDP) connections.

1. Select **All resources** on the left menu. From the resource list, select **MyNetworkSecurityGroup** in the **MyResourceGroupLB** resource group.
   
1. Under **Settings**, select **Inbound security rules**, and then select **Add**.
   
1. In the **Add inbound security rule** dialog, for the HTTP rule, type or select the following:
   
   - **Source**: Select **Service Tag**.  
   - **Source service tag**: Select **Internet**. 
   - **Destination port ranges**: Type *80*.
   - **Protocol**: Select **TCP**. 
   - **Action**: Select **Allow**.  
   - **Priority**: Type *100*. 
   - **Name**: Type *MyHTTPRule*. 
   - **Description**: Type *Allow HTTP*. 
   
1. Select **Add**. 
   
   ![Create an NSG rule](./media/load-balancer-standard-public-portal/8-load-balancer-nsg-rules.png)
   
1. Repeat the steps for the inbound RDP rule, with the following differing values:
   - **Destination port ranges**: Type *3389*.
   - **Priority**: Type *200*. 
   - **Name**: Type *MyRDPRule*. 
   - **Description**: Type *Allow RDP*. 

## Create a Standard load balancer

In this section, you create a public load balancer that can balance traffic load over VMs. A Standard load balancer supports only a Standard public IP address. When you create a Standard load balancer, you must also create a new Standard public IP address as the load balancer front end (named **LoadBalancerFrontend* by default). 

## Create a Standard load balancer

A Standard load balancer supports only a Standard public IP address. When you create a Standard load balancer, you also create a new Standard public IP address, which is configured as the Standard load balancer front end named **LoadBalancerFrontend** by default. 

**To create a Standard load balancer:**

1. On the upper-left side of the portal, select **Create a resource** > **Networking** > **Load Balancer**.
   
1. In the **Create load balancer** pane, type or select these values:
   
   - **Name**: Type *MyLoadBalancer*.
   - **Type**: Select **Public**. 
   - **SKU**: Select **Standard**.
   - **Virtual network**: Select **Choose a virtual network**, and then select **MyVNet**.
   - **Subnet**: Select **Choose a subnet**, and then select **MyBackendSubnet**.
   - **Public IP address**: Select **Choose a public IP address**, select **Create new**, type *MyPublicIP*, and select **OK**.
   - **ResourceGroup**: Drop down **Select existing** and select **MyResourceGroupLB**. 
   
1. Select **Create**.
   
![Create a load balancer](./media/tutorial-load-balancer-basic-internal-portal/1-load-balancer.png)

## Create Basic load balancer resources

In this section, you configure load balancer settings for a back-end address pool and a health probe, and specify load balancer rules.

### Create a back-end address pool

To distribute traffic to the VMs, the load balancer uses a back-end address pool that contains the IP addresses of the virtual network interfaces (NICs) that are connected to the load balancer. 

**To create a back-end address pool that includes VM1 and VM2:**

1. Select **All resources** on the left menu, and then select **MyLoadBalancer** from the resource list.
   
1. Under **Settings**, select **Backend pools**, and then select **Add**.
   
1. On the **Add a backend pool** page, type or select the following values:
   
   - **Name**: Type *MyBackendPool*.
   - **Associated to**: Drop down and select **Availability set**.
   - **Availability set**: Select **MyAvailabilitySet**.
   
1. Select **Add a target network IP configuration**. 
   1. Add **MyVM1** and **MyVM2** to the back-end pool.
   2. After you add each machine, drop down and select its **Network IP configuration**. 
   
1. Select **OK**.
   
   ![Add the back-end address pool](./media/tutorial-load-balancer-basic-internal-portal/3-load-balancer-backend-02.png)
   
1. On the **Backend pools** page, expand **MyBackendPool** and make sure both **VM1** and **VM2** are listed.

### Create a health probe

To allow the load balancer to monitor VM status, you use a health probe. The health probe dynamically adds or removes VMs from the load balancer rotation based on their response to health checks. 

**To create a health probe to monitor the health of the VMs:**

1. Select **All resources** on the left menu, and then select **MyLoadBalancer** from the resource list.
   
1. Under **Settings**, select **Health probes**, and then select **Add**.
   
1. On the **Add a health probe** page, type or select the following values:
   
   - **Name**: Type *MyHealthProbe*.
   - **Protocol**: Drop down and select **HTTP**. 
   - **Port**: Type *80*. 
   - **Path**: Accept */* for the default URI. You can replace this value with any other URI. 
   - **Interval**: Type *15*. Interval is the number of seconds between probe attempts.
   - **Unhealthy threshold**: Type *2*. This value is the number of consecutive probe failures that occur before a VM is considered unhealthy.
   
1. Select **OK**.
   
   ![Add a probe](./media/tutorial-load-balancer-basic-internal-portal/4-load-balancer-probes.png)

### Create a load balancer rule

A load balancer rule defines how traffic is distributed to the VMs. The rule defines the front-end IP configuration for incoming traffic, the back-end IP pool to receive the traffic, and the required source and destination ports. 

The load balancer rule named **MyLoadBalancerRule** listens to port 80 in the front-end **LoadBalancerFrontEnd**. The rule sends network traffic to the back-end address pool **MyBackendPool**, also on port 80. 

**To create the load balancer rule:**

1. Select **All resources** on the left menu, and then select **MyLoadBalancer** from the resource list.
   
1. Under **Settings**, select **Load balancing rules**, and then select **Add**.
   
1. On the **Add load balancing rule** page, type or select the following values, if not already present:
   
   - **Name**: Type *MyLoadBalancerRule*.
   - **Frontend IP address:** Type *LoadBalancerFrontEnd* if not present.
   - **Protocol**: Select **TCP**.
   - **Port**: Type *80*.
   - **Backend port**: Type *80*.
   - **Backend pool**: Select **MyBackendPool**.
   - **Health probe**: Select **MyHealthProbe**. 
   
1. Select **OK**.
   
  ![Add a load balancer rule](./media/tutorial-load-balancer-basic-internal-portal/5-load-balancing-rules.png)

## Create an inbound NAT rule

You can create a load balancer inbound network address translation (NAT) rule to forward traffic from a specific port of the front-end IP address to a specific port of a back-end VM.

**To create inbound NAT port forwarding rules:**

1. Select **All resources** in the left-hand menu, and then select **MyLoadBalancer** from the resource list.
   
1. Under **Settings**, select **Inbound NAT rules**, and then in the back-end pool list, select **MyBackendPool**.
   
1. On the **Add inbound NAT rule** page, type or select the following values:
   
   - **Name**: Type *MyNATRuleVM1*.
   - **Port**: Type *4221*.
   - **Target virtual machine**: Select **MyVM1** from the drop-down.
    - **Port mapping**: Select **Custom**, and then type *3389* for **Target port**.
   
1. Select **OK**.
   
1. Repeat the steps to add an inbound NAT rule named *MyNATRuleVM2*, using **Port**: *4222* and **Target virtual machine**: **MyVM2**.

## Test the load balancer

Install Internet Information Services (IIS) on the back-end servers, then use the load balancer's public IP address to test it. Each back-end VM serves a different version of the default IIS web page, so you can see the load balancer distribute requests between the two VMs.

In the portal, on the **Overview** page for **MyLoadBalancer**, copy one of its public IP addresses under **Public IP Address**. Hover over the address and select the **Copy** icon to copy it. In this example, it is **10.3.0.7**. 

### Connect to the VMs with RDP

First, connect to both VMs with Remote Desktop (RDP). 

**To remote desktop (RDP) into the VMs:**

1. In the portal, select **All resources** on the left menu. From the resource list, select each VM in the **MyResourceGroupLB** resource group.
   
1. On the **Overview** page, select **Connect**, and then select **Download RDP file**. 
   
1. Open the RDP file you downloaded, and select **Connect**.
   
1. On the Windows Security screen, select **More choices** and then **Use a different account**. 
   
   Enter username *azureuser* and password *Azure1234567*, and select **OK**.
   
1. Respond **Yes** to any certificate prompt. 
   
   The VM desktop opens in a new window. 

### Install IIS and replace the default IIS page on the back-end VMs

On each back-end server, use PowerShell to install IIS and replace the default IIS web page with a page that displays the name of the VM:.

1. On MyVM1 and on MyVM2, launch **Windows PowerShell** from the **Start** menu. 

2. Run the following commands to install IIS and replace the default IIS web page:
   
   ```powershell-interactive
    # Install IIS
      Install-WindowsFeature -name Web-Server -IncludeManagementTools
    
    # Remove default htm file
     remove-item  C:\inetpub\wwwroot\iisstart.htm
    
    #Add custom htm file that displays server name
     Add-Content -Path "C:\inetpub\wwwroot\iisstart.htm" -Value $("Hello World from " + $env:computername)
    ```
1. Close the RDP connections with MyVM1 and MyVM2 by selecting **Disconnect**. Do not shut down the VMs.

### Test the load balancer

Paste or type the load balancer's public IP address (*10.3.0.7*) into the address bar of your internet browser. 

The customized IIS web server default page appears in the browser. The message reads either **Hello World from MyVM1**, or **Hello World from MyVM2**.

Refresh the browser to see the load balancer distribute traffic across VMs. Sometimes the **MyVM1** page appears, and other times the **MyVM2** page appears, as the load balancer distributes the requests to each back-end VM. You may need to clear your browser cache between attempts.

![New IIS default page](./media/tutorial-load-balancer-basic-internal-portal/9-load-balancer-test.png) 

      ![IIS Web server](./media/tutorial-load-balancer-standard-zonal-portal/load-balancer-test.png)

## Test port forwarding

With port forwarding, you can remote desktop to a back-end VM by using the IP address of the load balancer and the front-end port value defined in the NAT rule. 

In the portal, on the **Overview** page for **MyLoadBalancer**, copy one of its public IP addresses under **Public IP Address**. Hover over the address and select the **Copy** icon to copy it. In this example, it is **10.3.0.7**. 

### RDP to the VM

1. Open a command prompt, and use the following command to create a remote desktop session with MyVM2, using the load balancer's public IP address and the front-end port defined in the VM's NAT rule. 
   
   ```
   mstsc /v:<publicIpAddress>:4222
   ```
  
1. Open the downloaded RDP file, and select **Connect**.
   
1. On the Windows Security screen, select **More choices** and then **Use a different account**. 
   
   Enter username *azureuser* and password *Azure1234567*, and select **OK**.
   
1. Respond **Yes** to any certificate prompt. 
   
The RDP connection succeeds, as the inbound NAT rule *MyNATRuleVM2* directs traffic from the load balancer's front-end port *4222* to MyVM2's port 3389 (the RDP port).

## Clean up resources

To delete the load balancer and all related resources when you no longer need them, open the **MyResourceGroupLB** resource group and select **Delete resource group**.

## Next steps

In this tutorial, you created a Standard load balancer. You created and configured network resources, back-end servers, a health probe, and rules for the load balancer. You set up and tested port forwarding from a specified port on the load balancer to a port on a back-end VM. 

To learn more about Azure Load Balancer, continue to more load balancer tutorials.

> [!div class="nextstepaction"]
> [Azure Load Balancer tutorials](tutorial-load-balancer-standard-public-zone-redundant-portal.md)
