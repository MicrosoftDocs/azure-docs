---
title: Load balancing on multiple IP configurations | Microsoft Docs
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
ms.author: kumudd
---

# Load balancing on multiple IP configurations using the Azure portal

> [!div class="op_single_selector"]
> * [Portal](load-balancer-multiple-ip.md)
> * [PowerShell](load-balancer-multiple-ip-ps.md)
> * [CLI](load-balancer-multiple-ip-cli.md)

This article describes how to use Azure Load Balancer with multiple IP addresses on a secondary network interface (NIC). The support for multiple IP addresses on a NIC is a feature that is in Preview release, at this time. For more information, see the [Limitations](#limitations) section of this article. The following scenario illustrates how this feature works with Load Balancer.

For this scenario (see Figure 1), we have two VMs running Windows, each with a primary and a secondary NIC. Each of the secondary NICs has two IP configurations. Each VM hosts both websites for contoso.com and fabrikam.com. Each website is bound to one of the IP configurations on the secondary NIC. We use Azure Load Balancer to expose two frontend IP addresses, one for each website, to distribute traffic to the respective IP configuration for the website. This scenario uses the same port number across both frontends, as well as both backend pool IP addresses.

![LB scenario image](./media/load-balancer-multiple-ip/lb-multi-ip.PNG)

**Figure 1**: Load balancing with multiple IP configurations on a secondary NIC
## Limitations

[!INCLUDE [virtual-network-preview](../../includes/virtual-network-preview.md)]

Register for the preview by running the following commands in PowerShell after you log in and select the appropriate subscription:

```
Register-AzureRmProviderFeature -FeatureName AllowMultipleIpConfigurationsPerNic -ProviderNamespace Microsoft.Network

Register-AzureRmProviderFeature -FeatureName AllowLoadBalancingonSecondaryIpconfigs -ProviderNamespace Microsoft.Network

Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Network
```

Do not attempt to complete the remaining steps until you see the following output when you run the ```Get-AzureRmProviderFeature``` command:
		
```powershell
FeatureName                            ProviderName      RegistrationState
-----------                            ------------      -----------------      
AllowLoadBalancingOnSecondaryIpConfigs Microsoft.Network Registered       
AllowMultipleIpConfigurationsPerNic    Microsoft.Network Registered       
```
	
>[!NOTE] 
>This may take a few minutes.

##Prerequisites
This example assumes that you have a virtual network with the following configuration:
 - a virtual network named *myVNet* in the Resource Group named *contosofabrikam* that includes two VMs called *VM1* and *VM2* respectively within the same availability set named *myAvailset*. 
 - Each VM has a primary NIC and a secondary NIC. The primary NICs are named *VM1NIC1* and *VM2NIC1* and the secondary NICs are named *VM1NIC2* and *VM2NIC2*. 
For more information about creating VMs with multiple NICs, see [Create a VM with multiple NICs using PowerShell](../virtual-network/virtual-network-deploy-multinic-arm-ps.md).

# Steps to load balance on multiple IP configurations

Follow the steps below to achieve the scenario outlined in this article:

1. From a browser navigate to the Azure portal: http://portal.azure.com and login with your Azure account.
2. To the secondary NIC of each VM, add an IP configuration as follows:
    1. In the portal, click More services > type network interfaces in the filter box, and then click **Network Interfaces**.
    2. Select the network interface you want to add the IP configuration to.
    3. In the blade that appears for the NIC that you selected, click **IP configurations**. Then click **Add** towards the top of the blade that shows up.
    4. In the **Add IP configurations** blade, add a second IP configuration to the NIC as follows: 
        1. Type a name for your secondary IP configuration (for example, for VM1 and VM2 name the IP configurations as *VM1NIC2-ipconfig2* and *VM2NIC2-ipconfig2* respectively).
        2. For **Private IP address**, for **Allocation**, select **Static**.
        3. Click **OK**.
        4. When the second IP configuration for the secondary NIC is complete, it is displayed in the **IP configurations** settings blade for the given NIC.
3. Create a load balancer as follows:
    1. On the top left-hand side of the screen select New > Networking > Load Balancer.
    2. In the **Create load balancer** blade, type a name for your load balancer. Here it is called *mylb*.
    3. Under Public IP address, create a new public IP called **PublicIP1**.
    4. Under Resource Group, select the existing Resource group of your VMs (for example, *contosofabrikam*). Then, select an appropriate location, and then click **OK**. The load balancer will then start to deploy and will take a few minutes to successfully complete deployment.
    5. Once deployed, the load balancer is displayed as a resource in your Resource Group.
4. Configure the frontend IP pool, Backend pools, Health probes, and load balancing rules for your load balancer as follows:
    1. Configure your frontend IP pool for each website (Contoso and Fabrikam) as follows:
        1. In the portal, click **More services** > type **load balancer** in the filter box, and then click **Load Balancer**.  
        2. Select the load balancer that you want to add the frontend IP pool to.
        3. Under **Settings**, select **Frontend Pools**. Then click **Add** towards the top of the blade that shows up.
        2. Type a name for your frontend IP address (for example, *farbikamfe*).
        3. Click **IP address** and on the **Choose Public IP address** blade, select an IP address for Contoso website's incoming network traffic.
        4. Repeat steps to create the frontend IP address for Fabrikam's website.
        5. When the frontend IP pool configuration is complete, both frontend IP addresses are displayed in the **Front IP Pool** blade of your load balancer. 
    2. Configure the backend address pools for each website (Contoso and Fabrikam) that includes:
        1. In the portal, click More services > type load balancer in the filter box, and then click **Load Balancer**.  
        2. Select the load balancer that you want to add the backend pools to.
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
5. Configure a health probe for your load balancer:
    1. In the portal, click More services > type load balancer in the filter box, and then click **Load Balancer**.  
    2. Select the load balancer that you want to add the backend pools to.
    3. Under **Settings**, select **Health probe**. Then click **Add** towards the top of the blade that shows up.
    4. Type a name for the health probe (for example, HTTP), and click **OK**.
6. Configure load balancing rules for each website (Contoso and Fabrikam) as follows:
    1. Under **Settings**, select **Health probe**. Then click **Add** towards the top of the blade that shows up.
    2. For **Name**, type a name for the load balancing rule (for example, *HTTPc* for Contoso, or *HTTPf* for Fabrikam)
    3. For Frontend IP address, select the the frontend IP address (for example *Contosofe* or *Fabrikamfe*)
    4. For Port and Backend port, keep the default value **80**.
    5. For **Floating IP (direct server return)**, click **Enabled**.
    6. Click **OK**.
    7. When the load balancing rules configuration is complete, the rules for both websites are displayed in the **Load balancing rules** blade of your load balancer.
7. Finally, you must configure DNS resource records to point to the respective frontend IP address of the Load Balancer. You may host your domains in Azure DNS. For more information about using Azure DNS with Load Balancer, see [Using Azure DNS with other Azure services](../dns/dns-for-azure-services.md).
