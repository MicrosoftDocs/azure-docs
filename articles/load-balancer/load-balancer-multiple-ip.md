---
title: Load balancing on multiple IP configurations in Azure| Microsoft Docs
description: Load balancing across primary and secondary IP configurations.
services: load-balancer
documentationcenter: na
author: kumudd
manager: timlt
editor: na
ms.assetid: 244907cd-b275-4494-aaf7-dcfc4d93edfe
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/22/2017
ms.author: kumud
---

# Load balancing on multiple IP configurations using the Azure portal

> [!div class="op_single_selector"]
> * [Portal](load-balancer-multiple-ip.md)
> * [PowerShell](load-balancer-multiple-ip-powershell.md)
> * [CLI](load-balancer-multiple-ip-cli.md)

This article describes how to use Azure Load Balancer with multiple IP addresses on a secondary network interface (NIC).For this scenario, we have two VMs running Windows, each with a primary and a secondary NIC. Each of the secondary NICs have two IP configurations. Each VM hosts both websites contoso.com and fabrikam.com. Each website is bound to one of the IP configurations on the secondary NIC. We use Azure Load Balancer to expose two frontend IP addresses, one for each website, to distribute traffic to the respective IP configuration for the website. This scenario uses the same port number across both frontends, as well as both backend pool IP addresses.

![LB scenario image](./media/load-balancer-multiple-ip/lb-multi-ip.PNG)

##Prerequisites
This example assumes that you have a Resource Group named *contosofabrikam* with the following configuration:
 -  includes a virtual network named *myVNet*, two VMs called *VM1* and *VM2* respectively within the same availability set named *myAvailset*. 
 - each VM has a primary NIC and a secondary NIC. The primary NICs are named *VM1NIC1* and *VM2NIC1* and the secondary NICs are named *VM1NIC2* and *VM2NIC2*. 
For more information about creating VMs with multiple NICs, see [Create a VM with multiple NICs using PowerShell](../virtual-network/virtual-network-deploy-multinic-arm-ps.md).

## Steps to load balance on multiple IP configurations

Follow these steps below to achieve the scenario outlined in this article:

### STEP 1: Configure the secondary NICs for each VM

For each VM in your virtual network, add set IP configuration for the secondary NIC as follows:  

1. From a browser navigate to the Azure portal: http://portal.azure.com and login with your Azure account.
2. On the top left-hand side of the screen, click the Resource Group icon, and then click the resource group the VMs are located in (for example, *contosofabrikam*). The **Resource groups** blade that lists all the resources along with the network interfaces for the VMs is now displayed.
3. To the secondary NIC of each VM, add an IP configuration as follows:
    1. Select the network interface you want to add the IP configuration to.
    2. In the blade that appears for the NIC that you selected, click **IP configurations**. Then click **Add** towards the top of the blade that shows up.
    3. In the **Add IP configurations** blade, add a second IP configuration to the NIC as follows: 
        1. Type a name for your secondary IP configuration (for example, for VM1 and VM2 name the IP configurations as *VM1NIC2-ipconfig2* and *VM2NIC2-ipconfig2* respectively).
        2. For **Private IP address**, for **Allocation**, select **Static**.
        3. Click **OK**.
        4. When the second IP configuration for the secondary NIC is complete, it is displayed in the **IP configurations** settings blade for the given NIC.

### STEP 2: Create a load balancer

Create a load balancer as follows:

1. From a browser navigate to the Azure portal: http://portal.azure.com and login with your Azure account.
2. On the top left-hand side of the screen, click **New** > **Networking** > **Load Balancer**. Next, click **Create**.
3. In the **Create load balancer** blade, type a name for your load balancer. Here it is called *mylb*.
4. Under Public IP address, create a new public IP called **PublicIP1**.
5. Under Resource Group, select the existing Resource group of your VMs (for example, *contosofabrikam*). Then, select an appropriate location, and then click **OK**. The load balancer will then start to deploy and will take a few minutes to successfully complete deployment.
6. Once deployed, the load balancer is displayed as a resource in your Resource Group.

### STEP 3: Configure the frontend IP pool

Configure your frontend IP pool for each website (Contoso and Fabrikam) as follows:

1. In the portal, click **More services** > type **Public IP address** in the filter box, and then click **Public IP addresses**. Click **Add** towards the top of the blade that shows up.
2. Configure two Public IP addresses (*PublicIP1* and *PublicIP2*) for both websites (contoso and fabrikam) as follows:
    1. Type a name for your frontend IP address.
    2. For **Resource Group**, select the existing Resource Group of the VMs (for example, *contosofabrikam*).
    3. For **Location**, select the same location as the VMs.
    4. Click **OK**.
    5. Once the two Public IP addresses are created, they are both displayed in the **Public IP** addresses blade.
3. In the portal, click **More services** > type **load balancer** in the filter box, and then click **Load Balancer**.  
4. Select the load balancer (*mylb*) that you want to add the frontend IP pool to.
5. Under **Settings**, select **Frontend Pools**. Then click **Add** towards the top of the blade that shows up.
6. Type a name for your frontend IP address (*farbikamfe* or **contosofe*).
7. Click **IP address** and on the **Choose Public IP address** blade, select the IP addresses for your frontend (*PublicIP1* or *PublicIP2*).
8. Repeat steps 3 to 7 within this section to create the second frontend IP address.
9. When the frontend IP pool configuration is complete, both frontend IP addresses are displayed in the **Frontend IP Pool** blade of your load balancer. 
    
### STEP 4: Configure the backend pool   
Configure the backend address pools on your load balancer for each website (Contoso and Fabrikam) as follows:
        
1. In the portal, click **More services** > type load balancer in the filter box, and then click **Load Balancer**.  
2. Select the load balancer (*mylb*) that you want to add the backend pools to.
3. Under **Settings**, select **Backend Pools**. Type a name for your backend pool (for example, *contosopool* or *fabrikampool*). Then click the **Add** button toward the top of the blade that shows up. 
4. For **Associated to**, select **Availability set**.
5. For **Availability set**, select **myAvailset**.
6. Add Target network IP configurations, for both VMs as follows (see Figure 2):  
    1. For **Target Virtual machine**, select the VM that you want to add to the backend pool (for example, VM1 or VM2).
    2. For **Network IP configuration**, select the secondary NICs IP configuration for that VM (for example, VM1NIC2-ipconfig2 or VM2NIC2-ipconfig2).
    ![LB scenario image](./media/load-balancer-multiple-ip/lb-backendpool.PNG)
            
        **Figure 2**: Configuring the load balancer with backend pools  
7. Click **OK**.
8. When the backend pool configuration is complete, both backend address pools are displayed in the **Backend pool blade** of your load balancer.

### STEP 5: Configure a health probe for your load balancer
Configure a health probe for your load balancer as follows:
    1. In the portal, click More services > type load balancer in the filter box, and then click **Load Balancer**.  
    2. Select the load balancer that you want to add the backend pools to.
    3. Under **Settings**, select **Health probe**. Then click **Add** towards the top of the blade that shows up.
    4. Type a name for the health probe (for example, HTTP), and click **OK**.

### STEP 6: Configure load balancing rules
Configure load balancing rules (*HTTPc* and *HTTPf*) for each website as follows:
    
1. Under **Settings**, select **Health probe**. Then click **Add** towards the top of the blade that shows up.
2. For **Name**, type a name for the load balancing rule (for example, *HTTPc* for Contoso, or *HTTPf* for Fabrikam)
3. For Frontend IP address, select the the frontend IP address (for example *Contosofe* or *Fabrikamfe*)
4. For **Port** and **Backend port**, keep the default value **80**.
5. For **Floating IP (direct server return)**, click **Enabled**.
6. Click **OK**.
7. Repeat steps 1 to 6 within this section to create the second Load Balancer rule.
8. When the load balancing rules configuration is complete, both rules ((*HTTPc* and *HTTPf*) are displayed in the **Load balancing rules** blade of your load balancer.

### STEP 7: Configure DNS records
Finally, you must configure DNS resource records to point to the respective frontend IP address of the load balancer. You may host your domains in Azure DNS. For more information about using Azure DNS with Load Balancer, see [Using Azure DNS with other Azure services](../dns/dns-for-azure-services.md).

## Next steps
- Learn more about how to combine load balancing services in Azure in [Using load-balancing services in Azure](../traffic-manager/traffic-manager-load-balancing-azure.md).
- Learn how you can use different types of logs in Azure to manage and troubleshoot load balancer in [Log analytics for Azure Load Balancer](../load-balancer/load-balancer-monitor-log.md).
