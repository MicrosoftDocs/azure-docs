---
title: Create a public Basic load balancer by using the Azure portal | Microsoft Docs
description: Learn how to create a public Basic load balancer to load balance VMs by using the Azure portal.
services: load-balancer
documentationcenter: na
author: KumudD 
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: aa9d26ca-3d8a-4a99-83b7-c410dd20b9d0
ms.service: load-balancer
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/22/2018
ms.author: kumud
---

# Create a public Basic load balancer by using the Azure portal

Load balancing provides a higher level of availability and scale by spreading incoming requests across multiple virtual machines (VMs). You can use the Azure portal to create a load balancer that will load balance virtual machines. This quickstart shows you how to create network resources, back-end servers, and a load balancer at the Basic pricing tier.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

## Sign in to the Azure portal

For all the tasks in this quickstart, sign in to the [Azure portal](http://portal.azure.com).

## Create a Basic load balancer

In this section, you create a public Basic load balancer by using the  portal. The public IP address is automatically configured as the load balancer's front end when you create the public IP and the load balancer resource by using the portal. The name of the front end is **LoadBalancerFrontend**.

1. On the upper-left side of the portal, select **Create a resource** > **Networking** > **Load Balancer**.
2. In the **Create load balancer** pane, enter these values:
   - **myLoadBalancer** for the name of the load balancer
   - **Public** for the type of the load balancer 
   - **myPublicIP** for the public IP that you must create, with **SKU** set as **Basic** and **Assignment** set as **Dynamic**
   - **myResourceGroupLB** for the name of the new resource group
3. Select **Create**.
   
![Create a load balancer](./media/load-balancer-get-started-internet-portal/1-load-balancer.png)


## Create back-end servers

In this section, you create a virtual network, and you create two virtual machines for the back-end pool of your Basic load balancer. Then you install Internet Information Services (IIS) on the virtual machines to help test the load balancer.

### Create a virtual network
1. On the upper-left side of the portal, select **New** > **Networking** > **Virtual network**.
2. In the **Create virtual network** pane, enter these values, and then select **Create**:
   - **myVnet** for the name of the virtual network
   - **myResourceGroupLB** for the name of the existing resource group
   - **myBackendSubnet** for the subnet name

   ![Create a virtual network](./media/load-balancer-get-started-internet-portal/2-load-balancer-virtual-network.png)

### Create virtual machines

1. On the upper-left side of the portal, select **New** > **Compute** > **Windows Server 2016 Datacenter**. 
2. Enter these values for the virtual machine, and then select **OK**:
   - **myVM1** for the name of the virtual machine.        
   - **azureuser** for the administrator username.    
   - **myResourceGroupLB** for the resource group. (Under **Resource group**, select **Use existing**, and then select **myResourceGroupLB**.)   
3. Select **DS1_V2** for the size of the virtual machine, and click **Select**.
4. Enter these values for the VM settings:
   - **myAvailabilitySet** for the name of the new availability set that you create.
   - **myVNet** for the name of the virtual network. (Ensure that it's selected.)
   - **myBackendSubnet** for the name of the subnet. (Ensure that it's selected.)
   - **myVM1-ip** for the public IP address.
   - **myNetworkSecurityGroup** for the name of the new network security group (NSG, a type of firewall) that you must create.
5. Select **Disabled** to disable boot diagnostics.
6. Select **OK**, review the settings on the summary page, and then select **Create**.
7. By using steps 1 to 6, create a second VM named **VM2**, with:
   - **myAvailabilityset** as the availability set.
   - **myVnet** as the virtual network.
   - **myBackendSubnet** as the subnet.
   - **myNetworkSecurityGroup** as the network security group. 

### Create NSG rules

In this section, you create NSG rules to allow inbound connections that use HTTP and RDP.

1. Select **All resources** on the left menu. From the resource list, select **myNetworkSecurityGroup** in the **myResourceGroupLB** resource group.
2. Under **Settings**, select **Inbound security rules**, and then select **Add**.
3. Enter the following values for the inbound security rule named **myHTTPRule** to allow for inbound HTTP connections that use port 80. Then select **OK**.
   - **Service Tag** for **Source**
   - **Internet** for **Source service tag**
   - **80** for **Destination port ranges**
   - **TCP** for **Protocol**
   - **Allow** for **Action**
   - **100** for **Priority**
   - **myHTTPRule** for **Name**
   - **Allow HTTP** for **Description**
 
   ![Create an NSG rule](./media/load-balancer-get-started-internet-portal/8-load-balancer-nsg-rules.png)
4. Repeat steps 2 and 3 to create another rule named **myRDPRule** to allow for an inbound RDP connection through port 3389. Use the following values:
   - **Service Tag** for **Source**
   - **Internet** for **Source service tag**
   - **3389** for **Destination port ranges**
   - **TCP** for **Protocol**
   - **Allow** for **Action**
   - **200** for **Priority**
   - **myRDPRule** for **Name**
   - **Allow RDP** for **Description**

   

### Install IIS

1. Select **All resources** on the left menu. From the resource list, select **myVM1** in the **myResourceGroupLB** resource group.
2. On the **Overview** page, select **Connect** to RDP into the VM.
3. Sign in to the VM with username **azureuser** and password **Azure123456!**.
4. On the server desktop, browse to **Windows Administrative Tools** > **Server Manager**.
5. In Server Manager, select **Manage**, and then select **Add Roles and features**.
   ![Adding server manager role](./media/load-balancer-get-started-internet-portal/servermanager.png)
6. In the Add Roles and Features Wizard, use the following values:
   - On the **Select installation type** page, select **Role-based or feature-based installation**.
   - On the **Select destination server** page, select **myVM1**.
   - On the **Select server role** page, select **Web Server (IIS)**.
   - Follow the instructions to complete the rest of the wizard. 
7. Repeat steps 1 to 6 for the virtual machine **myVM2**.

## Create resources for the Basic load balancer

In this section, you configure load balancer settings for a back-end address pool and a health probe. You also specify load balancer and NAT rules.


### Create a back-end address pool

To distribute traffic to the VMs, a back-end address pool contains the IP addresses of the virtual NICs that are connected to the load balancer. Create the back-end address pool **myBackendPool** to include **VM1** and **VM2**.

1. Select **All resources** on the left menu, and then select **myLoadBalancer** from the resource list.
2. Under **Settings**, select **Backend pools**, and then select **Add**.
3. On the **Add a backend pool** page, do the following, and then select **OK**:
   - For **Name**, enter **myBackEndPool**.
   - For **Associated to**, from the drop-down menu, select **Availability set**.
   - For **Availability set**, select **myAvailabilitySet**.
   - Select **Add a target network IP configuration** to add each virtual machine (**myVM1** and **myVM2**) that you created to the back-end pool.

   ![Adding to the back-end address pool](./media/load-balancer-get-started-internet-portal/3-load-balancer-backend-02.png)

3. Make sure that your load balancer's back-end pool setting displays both the VMs **VM1** and **VM2**.

### Create a health probe

To allow the Basic load balancer to monitor the status of your app, you use a health probe. The health probe dynamically adds or removes VMs from the load balancer rotation based on their response to health checks. Create a health probe named **myHealthProbe** to monitor the health of the VMs.

1. Select **All resources** on the left menu, and then select **myLoadBalancer** from the resource list.
2. Under **Settings**, select **Health probes**, and then select **Add**.
3. Use these values, and then select **OK**:
   - **myHealthProbe** for the name of the health probe
   - **HTTP** for the protocol type
   - **80** for the port number
   - **15** for **Interval**, the number of seconds between probe attempts
   - **2** for **Unhealthy threshold**, the number of consecutive probe failures that must occur before a VM is considered unhealthy

   ![Adding a probe](./media/load-balancer-get-started-internet-portal/4-load-balancer-probes.png)

### Create a load balancer rule

You use a load balancer rule to define how traffic is distributed to the VMs. You define the front-end IP configuration for the incoming traffic and the back-end IP pool to receive the traffic, along with the required source and destination port. 

Create a load balancer rule named **myLoadBalancerRuleWeb** for listening to port 80 in the front end **LoadBalancerFrontEnd**. The rule is also for sending load-balanced network traffic to the back-end address pool **myBackEndPool**, also by using port 80. 

1. Select **All resources** on the left menu, and then select **myLoadBalancer** from the resource list.
2. Under **Settings**, select **Load balancing rules**, and then select **Add**.
3. Use these values, and then select **OK**:
   - **myHTTPRule** for the name of the load balancer rule
   - **TCP** for the protocol type
   - **80** for the port number
   - **80** for the back-end port
   - **myBackendPool** for the name of the back-end pool
   - **myHealthProbe** for the name of the health probe
    
   ![Adding a load balancer rule](./media/load-balancer-get-started-internet-portal/5-load-balancing-rules.png)

## Test the load balancer
1. Find the public IP address for the load balancer on the **Overview** screen. Select **All resources**, and then select **myPublicIP**.

2. Copy the public IP address, and then paste it into the address bar of your browser. The default page of IIS web server is displayed in the browser.

   ![IIS web server](./media/load-balancer-get-started-internet-portal/9-load-balancer-test.png)

## Clean up resources

You can delete the resource group, load balancer, and all related resources when you no longer need them. Select the resource group that contains the load balancer, and select **Delete**.

## Next steps

In this quickstart, you created a resource group, network resources, and back-end servers. You then used those resources to create a load balancer. To learn more about load balancers and their associated resources, continue to the tutorial articles.---
title: Create a public Basic Load Balancer - Azure portal | Microsoft Docs
description: Learn how to create a public Basic Load Balancer by using the Azure portal.
services: load-balancer
documentationcenter: na
author: KumudD 
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: aa9d26ca-3d8a-4a99-83b7-c410dd20b9d0
ms.service: load-balancer
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/22/2018
ms.author: kumud
---

# Create a public Basic Load Balancer to load balance VMs using the Azure portal

Load balancing provides a higher level of availability and scale by spreading incoming requests across multiple virtual machines. You can use the Azure portal to create a load balancer to load balance virtual machines. This quickstart shows you how to create network resources, backend servers, and a public Basic Load Balancer.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

## Sign in to the Azure portal

Sign in to the Azure portal at [http://portal.azure.com](http://portal.azure.com).

## Create a Basic Load Balancer

In this section, you create a public Basic Load Balancer using the  portal. The public IP address is automatically configured as the Load Balancer's frontend, named, *LoadBalancerFrontend* when you create the public IP when you create the load balancer resource using the portal.

1. On the top left-hand side of the screen, click **Create a resource** > **Networking** > **Load Balancer**.
2. In the **Create a load balancer** page enter these values for the load balancer:
    - *myLoadBalancer* - for the name of the load balancer.
    - **Public** - for the type of the load balancer.
    - *myPublicIP* - for the Public IP that you must create with SKU as **Basic**, and **Assignment** set as **Dynamic**.
    - *myResourceGroupLB* - for the name of the new resource group that you create.
3. Click **Create** to create the load balancer.
   
    ![Create a load balancer](./media/load-balancer-get-started-internet-portal/1-load-balancer.png)


## Create backend servers

In this section, you create a virtual network, create two virtual machines for the backend pool of your Basic Load Balancer, and then install IIS on the virtual machines to help test the load balancer.

### Create a virtual network
1. On the top left-hand side of the screen click **New** > **Networking** > **Virtual network** and enter these values for the virtual network:
    - *myVnet* - for the name of the virtual network.
    - *myResourceGroupLB* - for the name of the existing resource group
    - *myBackendSubnet* - for the subnet name.
2. Click **Create** to create the virtual network.

    ![Create a virtual network](./media/load-balancer-get-started-internet-portal/2-load-balancer-virtual-network.png)

### Create virtual machines

1. On the top left-hand side of the screen, click **New** > **Compute** > **Windows Server 2016 Datacenter** and enter these values for the virtual machine:
    - *myVM1* - for the name of the virtual machine.        
    - *azureuser* - for the administrator user name. -    
    - *myResourceGroupLB* - for **Resource group**, select **Use existing**, and then select *myResourceGroupLB*.
2. Click **OK**.
3. Select **DS1_V2** for the size of the virtual machine, and click **Select**.
4. Enter these values for the VM settings:
    - *myAvailabilitySet* - for the name of the new Availability set that you create.
    -  *myVNet* - ensure it is selected as the virtual network.
    - *myBackendSubnet* - ensure it is selected as the subnet.
    - *myVM1-ip* - for Public IP address.
    - *myNetworkSecurityGroup* - for the name of the new network security group (firewall) that you must create.
5. Click **Disabled** to disable boot diagnostics.
6. Click **OK**, review the settings on the summary page, and then click **Create**.
7. Using steps 1-6, create a second VM, named, *VM2* with *myAvailabilityset* as the Availability set, *myVnet* as the virtual network, *myBackendSubnet* as subnet, and *myNetworkSecurityGroup* as its Network Security Group, . 

### Create NSG rules

In this section, you create NSG rules to allow inbound connections using HTTP and RDP.

1. Click **All resources** in the left-hand menu, and then from the resources list click **myNetworkSecurityGroup** that is located in the **myResourceGroupLB** resource group.
2. Under **Settings**, click **Inbound security rules**, and then click **Add**.
3. Enter these values for the inbound security rule named *myHTTPRule* to allow for an inbound HTTP connections using port 80:
    - *Service Tag* - for **Source**.
    - *Internet* - for **Source service tag**
    - *80* - for **Destination port ranges**
    - *TCP* - for **Protocol**
    - *Allow* - for **Action**
    - *100* for **Priority**
    - *myHTTPRule* for name
    - *Allow HTTP* - for description
4. Click **OK**.
 
 ![Create a virtual network](./media/load-balancer-get-started-internet-portal/8-load-balancer-nsg-rules.png)
5. Repeat steps 2 to 4 to create another rule named *myRDPRule* to allow for an inbound RDP connection using port 3389 with the following values:
    - *Service Tag* - for **Source**.
    - *Internet* - for **Source service tag**
    - *3389* - for **Destination port ranges**
    - *TCP* - for **Protocol**
    - *Allow* - for **Action**
    - *200* for **Priority**
    - *myRDPRule* for name
    - *Allow RDP* - for description

   

### Install IIS

1. Click **All resources** in the left-hand menu, and then from the resources list click **myVM1** that is located in the *myResourceGroupLB* resource group.
2. On the **Overview** page, click **Connect** to RDP into the VM.
3. Log into the VM with username *azureuser* and password *Azure123456!*
4. On the server desktop, navigate to **Windows Administrative Tools**>**Server Manager**.
5. In Server Manager, click Manage, and then, click **Add Roles and features**.
 ![Adding server manager role](./media/load-balancer-get-started-internet-portal/servermanager.png)
6. In the **Add Roles and Features Wizard**, use the following values:
    - In the **Select installation type** page, click **Role-based or feature-based installation**.
    - In the **Select destination server** page, click **myVM1**
    - In the **Select server role** page, click **Web Server (IIS)**
    - Follow instructions to complete the rest of the wizard 
7. Repeat steps 1 to 6 for the virtual machine *myVM2*.

## Create Basic Load Balancer resources

In this section, you  configure load balancer settings for a backend address pool and a health probe, and specify load balancer and NAT rules.


### Create a backend address pool

To distribute traffic to the VMs, a back-end address pool contains the IP addresses of the virtual (NICs) connected to the load balancer. Create the backend address pool *myBackendPool* to include *VM1* and *VM2*.

1. Click **All resources** in the left-hand menu, and then click **myLoadBalancer** from the resources list.
2. Under **Settings**, click **Backend pools**, then click **Add**.
3. On the **Add a backend pool** page, do the following:
    - For name, type *myBackEndPool, as the name for your backend pool.
    - For **Associated to**, from the drop-down menu, click **Availability set**
    - For **Availability set**, click, **myAvailabilitySet**.
    - Click **Add a target network IP configuration** to add each virtual machine (*myVM1* & *myVM2*) that you created to the backend pool.
    - Click **OK**.

    ![Adding to the backend address pool - ](./media/load-balancer-get-started-internet-portal/3-load-balancer-backend-02.png)

3. Check to make sure your load balancer backend pool setting displays both the VMs **VM1** and **VM2**.

### Create a health probe

To allow the Basic Load Balancer to monitor the status of your app, you use a health probe. The health probe dynamically adds or removes VMs from the load balancer rotation based on their response to health checks. Create a health probe *myHealthProbe* to monitor the health of the VMs.

1. Click **All resources** in the left-hand menu, and then click **myLoadBalancer** from the resources list.
2. Under **Settings**, click **Health probes**, then click **Add**.
3. Use these values to create the health probe:
    - *myHealthProbe* - for the name of the health probe.
    - **HTTP** - for the protocol type.
    - *80* - for the port number.
    - *15* - for number of **Interval** in seconds between probe attempts.
    - *2* - for number of **Unhealthy threshold** or consecutive probe failures that must occur before a VM is considered unhealthy.
4. Click **OK**.

   ![Adding a probe](./media/load-balancer-get-started-internet-portal/4-load-balancer-probes.png)

### Create a Load Balancer rule

A Load Balancer rule is used to define how traffic is distributed to the VMs. You define the front-end IP configuration for the incoming traffic and the back-end IP pool to receive the traffic, along with the required source and destination port. Create a Load Balancer rule *myLoadBalancerRuleWeb* for listening to port 80 in the frontend *LoadBalancerFrontEnd* and sending load-balanced network traffic to the backend address pool *myBackEndPool* also using port 80. 

1. Click **All resources** in the left-hand menu, and then click **myLoadBalancer** from the resources list.
2. Under **Settings**, click **Load balancing rules**, then click **Add**.
3. Use these values to configure the load balancing rule:
    - *myHTTPRule* - for the name of the load balancing rule.
    - **TCP** - for the protocol type.
    - *80* - for the port number.
    - *80* - for the backend port.
    - *myBackendPool* - for the name of the backend pool.
    - *myHealthProbe* - for the name of the health probe.
4. Click **OK**.
    
    ![Adding a load balancing rule](./media/load-balancer-get-started-internet-portal/5-load-balancing-rules.png)

## Test the load balancer
1. Find the public IP address for the Load Balancer on the **Overview** screen. Click **All resources** and then click **myPublicIP**.

2. Copy the public IP address, and then paste it into the address bar of your browser. The default page of IIS Web server is displayed on the browser.

  ![IIS Web server](./media/load-balancer-get-started-internet-portal/9-load-balancer-test.png)

## Clean up resources

When no longer needed, delete the resource group, load balancer, and all related resources. To do so, select the resource group that contains the load balancer and click **Delete**.

## Next steps

In this quickstart, you created a resource group, network resources, and backend servers. You then used those resources to create a load balancer. To learn more about load balancers and their associated resources, continue to the tutorial articles.
