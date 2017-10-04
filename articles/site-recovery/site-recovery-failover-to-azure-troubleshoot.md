---
title: Troubleshoot failover to Azure failures | Microsoft Docs
description: This article describes ways to troubleshoot common errors in failing over to Azure
services: site-recovery
documentationcenter: ''
author: prateek9us
manager: gauravd
editor: ''

ms.assetid: 
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 08/24/2017
ms.author: pratshar

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


## Next steps

If you need more help, then post your query on [Site Recovery forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=hypervrecovmgr) or leave a comment at the end of this document. We have an active community that should be able to assist you.