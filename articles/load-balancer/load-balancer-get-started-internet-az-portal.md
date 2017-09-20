---
title: Create a zone redundant Internet-facing basic load balancer with the Azure portal | Microsoft Docs
description: Learn how to create an Internet-facing basic load balancer using the Azure portal
services: load-balancer
documentationcenter: na
author: KumudD
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/20/2017
ms.author: kumud
---

#  Create a zone-redundant Internet-facing basic load balancer with the Azure portal

This article steps through creating a Public Load Balancer Standard with a zone-redundant frontend IP address. An availability zone (../availability-zones/az-overview.md) is a physically separate zone in an Azure region.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## What is required to create an zone-redundant Public Load Balancer Standard?

You need to create and configure the following objects to deploy a load balancer.

* Front-end IP configuration - contains public IP addresses for incoming network traffic. In this example, you will create a zone-redundant Public IP Standard.
* Back-end address pool - contains network interfaces (NICs) for the virtual machines to receive network traffic from the load balancer.
* Load balancing rules - contains rules mapping a public port on the load balancer to port in the back-end address pool.
* Probes - contains health probes used to check availability of virtual machines instances in the back-end address pool.

## Register for Availability Zones, Load Balancer Standard, and Public IP Standard Preview

Availability zones are currently in preview release. Before selecting a zone or zone-redundant option for the frontend Public IP Address for the Load Balancer, you must first complete the steps in [register for the availability zones preview](https://review.docs.microsoft.com/en-us/azure/availability-zones/az-overview?toc=%2fazure%2fvirtual-network%2ftoc.json&branch=release-ignite-az#get-started-with-the-availability-zones-preview).
 
The Standard SKU is in preview release. Before creating a Standard SKU public IP address, you must first complete the steps in [register for the standard SKU preview](https://review.docs.microsoft.com/en-us/azure/virtual-network/virtual-network-public-ip-address?branch=pr-en-us-23006#register-for-the-standard-sku-preview) and create the public IP address in a supported location (region). For a list of supported locations, see [Region availability](https://review.docs.microsoft.com/en-us/azure/load-balancer/load-balancer-standard-overview?toc=%2fazure%2fvirtual-network%2ftoc.json) and monitor the [Azure Virtual Network](https://azure.microsoft.com/en-us/updates/?product=virtual-network) updates page for additional region support 

## Log in to Azure 

Log in to the Azure portal at https://portal.azure.com.

## Create two virtual machines in different availability zones

1. Click the **New** button found on the upper left-hand corner of the Azure portal.

2. Select **Compute**, and then select **Windows Server 2016 Datacenter**. 

3. Enter the virtual machine information. The user name and password entered here is used to log in to the virtual machine. When complete, click **OK**.

4. Select a size for the VM. To see more sizes, select **View all** or change the **Supported disk type** filter. Take care to select one of the sizes supported in the availability zones preview, such as *DS1_v2 Standard*. 

5. For Under **Settings** > **High availability**, select **2** from the **Availability zone** dropdown. For**Public IP address**, click **None** and keep the remaining defaults, and click **OK**. 

6. On the summary page, click **Purchase** to start the virtual machine deployment.

7. The VM will be pinned to the Azure portal dashboard. Once the deployment has completed, the VM summary automatically opens.
8. Repeat steps 1 to 7, and create a virtual machine named **MyVM2** in the **West Europe** location  in availability zone **3**.

## Set up a load balancer in Azure portal

1. From a browser navigate to the Azure portal: [http://portal.azure.com](http://portal.azure.com) and login with your Azure account.
2. On the top left-hand side of the screen select **New** > **Networking** > **Load Balancer.**
3. In the **Create load balancer** , type a name for your load balancer called **myPublicLB**.
4. Under **Type**, select **Public**.
5. Under SKU, select **Standard**.
6. Under **Public IP address**, create a new public IP called **myLBPIP** and for Availability zone (Preview), select **Zone-redundant**.
7. Under Resource Group, select the same resource group (**myResourceGroup**) that you used for creating the virtual machines (*myResourceGroup*) in the preceeding section. Then select the same **Location** as the virtual machines (**West Europe**), and then click **OK**. The load balancer then starts to deploy and takes a few minutes to successfully complete deployment.

## Create a backend address pool

1. Once your load balancer has successfully deployed, select it from within your resources. Under settings, select **Backend Pools**. Type a name for your backend pool (**LB-BE-Pool**). Then click on the **Add** button toward the top of the blade that shows up.
2. Under **Virtual network**, from the drop-down menu, click the resource group that contains the two virtual machines that you created earlier for load balancing. Click **Add backend resource** and select the VM and their respective IP addresses, and then click **Add** to add both virtual machines to the backend pool.  
3. Check to make sure your notifications drop down list has an update regarding saving the load balancer backend pool in addition to updating the network interface for both the VMs **myVM1** and **myVM2**.

## Create a probe, LB rule, and NAT rules

1. Create a health probe.

    Under **Settings** of your load balancer, select **Probes**. Then click **Add** located at the top of the blade.

    There are two ways to configure a probe: HTTP or TCP. This example shows HTTP, but TCP can be configured in a similar manner.
    Update the necessary information. As mentioned, **myPublicLB** will load balance traffic on Port 80. The path selected is HealthProbe.aspx, Interval is 15 seconds, and Unhealthy threshold is 2. Once finished, click **OK** to create the probe.

    Hover your pointer over the 'i' icon to learn more about these individual configurations and how they can be changed to cater to your requirements.

   
2. Create a load balancer rule.

    Click on Load balancing rules in the **Settings** section of your load balancer. In the new blade, click **Add**. Name your rule. Here, it is HTTP. Choose the frontend port and Backend port. Here, 80 is chosen for both. Choose **LB-backend** as your Backend pool and the previously created **HealthProbe** as the Probe. Other configurations can be set according to your requirements. Then click OK to save the load balancing rule.

    ![Adding a load balancing rule](./media/load-balancer-get-started-internet-portal/5-load-balancing-rules.png)

3. Create inbound NAT rules

    Click on Inbound NAT rules under the settings section of your load balancer. In the new blade that, click **Add**. Then name your inbound NAT rule. Here it is called **inboundNATrule1**. The destination should be the Public IP previously created. Select Custom under Service and select the protocol you would like to use. Here TCP is selected. Enter the port, 3441, and the Target port, in this case, 3389. then click OK to save this rule.

    Once the first rule is created, repeat this step for the second inbound NAT rule called inboundNATrule2 from port 3442 to Target port 3389.

    ![Adding an inbound NAT rule](./media/load-balancer-get-started-internet-portal/6-load-balancer-inbound-nat-rules.png)

## Remove a Load Balancer

To delete a load balancer, select the load balancer you want to remove. In the *Load Balancer* blade, click on **Delete** located at the top of the blade. Then select **Yes** when prompted.

## Next steps

[Get started configuring an internal load balancer](load-balancer-get-started-ilb-arm-cli.md)

[Configure a load balancer distribution mode](load-balancer-distribution-mode.md)

[Configure idle TCP timeout settings for your load balancer](load-balancer-tcp-idle-timeout.md)
