---
title: Troubleshoot failover to Azure failures | Microsoft Docs
description: This article describes ways to troubleshoot common errors in failing over to Azure
services: site-recovery
documentationcenter: ''
author: ponatara
manager: abhemraj
editor: ''

ms.assetid:
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 07/06/2018
ms.author: ponatara

---
# Troubleshoot errors when failing over a virtual machine to Azure

You may receive one of the following errors while doing failover of a virtual machine to Azure. To troubleshoot, use the described steps for each error condition.

## Failover failed with Error ID 28031

Site Recovery was not able to create a failed over virtual machine in Azure. It could happen because of one of the following reasons:

* There isn't sufficient quota available to create the virtual machine: You can check the available quota by going to Subscription -> Usage + quotas. You can open a [new support request](http://aka.ms/getazuresupport) to increase the quota.

* You are trying to failover virtual machines of different size families in same availability set. Ensure that you choose same size family for all virtual machines in the same availability set. Change size by going to Compute and Network settings of the virtual machine and then retry failover.

* There is a policy on the subscription that prevents creation of a virtual machine. Change the policy to allow creation of a virtual machine and then retry failover.

## Failover failed with Error ID 28092

Site Recovery was not able to create a network interface for the failed over virtual machine. Make sure you have sufficient quota available to create network interfaces in the subscription. You can check the available quota by going to Subscription -> Usage + quotas. You can open a [new support request](http://aka.ms/getazuresupport) to increase the quota. If you have sufficient quota, then this might be an intermittent issue, try the operation again. If the issue persists even after retries, then leave a comment at the end of this document.  

## Failover failed with Error ID 70038

Site Recovery was not able to create a failed over Classic virtual machine in Azure. It could happen because:

* One of the resources such as a virtual network that is required for the virtual machine to be created doesn't exist. Create the virtual network as provided under Compute and Network settings of the virtual machine or modify the setting to a virtual network that already exists and then retry failover.

## Unable to connect/RDP/SSH to the failed over virtual machine due to grayed out Connect button on the virtual machine

If Connect button is grayed out and you are not connected to Azure via an Express Route or Site-to-Site VPN connection, then,

1. Go to **Virtual machine** > **Networking**, click on the name of required network interface.  ![network-interface](media/site-recovery-failover-to-azure-troubleshoot/network-interface.PNG)
1. Navigate to **Ip Configurations**, then click on the name field of required IP configuration. ![IPConfigurations](media/site-recovery-failover-to-azure-troubleshoot/IpConfigurations.png)
1. To enable Public IP address, click on **Enable**. ![Enable IP](media/site-recovery-failover-to-azure-troubleshoot/Enable-Public-IP.png)
1. Click on **Configure required settings** > **Create new**. ![Create new](media/site-recovery-failover-to-azure-troubleshoot/Create-New-Public-IP.png)
1. Enter the name of public address, choose the default options for **SKU** and **assignment**, then click **OK**.
1. Now, to save the changes made, click **Save**.
1. Close the panels and navigate to **Overview** section of virtual machine to connect/RDP.

## Unable to connect/RDP/SSH to the failed over virtual machine even though Connect button is available (not grayed out) on the virtual machine

Check **Boot diagnostics** on your Virtual Machine and check for errors as listed in this article.

1. If the virtual machine has not started, try failing over to an older recovery point.
1. If the application inside the virtual machine is not up, try failing over to an app-consistent recovery point.
1. If the virtual machine is domain joined, then ensure that domain controller is functioning accurately. This can be done by following the below given steps.
    a. create a new virtual machine in the same network

    b.  ensure that it is able to join to the same domain on which the failed over virtual machine is expected to come up.

    c. If the domain controller is **not** functioning accurately, then try logging into the failed over virtual machine using a local administrator account
1. If you are using a custom DNS server, then ensure that it is reachable. This can be done by following the below given steps.
    a. create a new virtual machine in the same network and 
    b. check if the virtual machine is able to do name resolution using the custom DNS Server

>[!Note]
>Enabling any setting other than Boot Diagnostics would require Azure VM Agent to be installed in the virtual machine before the failover

## Next steps

If you need more help, then post your query on [Site Recovery forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=hypervrecovmgr) or leave a comment at the end of this document. We have an active community that should be able to assist you.
