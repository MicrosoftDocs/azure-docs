---
title: Troubleshoot failures during failback to on-premises from Azure and reprotect to Azure afterwards | Microsoft Docs
description: This article describes ways to troubleshoot common errors in failing back to on-premises from Azure and during reprotect    
services: site-recovery
documentationcenter: ''
author: rajani-janaki-ram
manager: gauravd
editor: ''

ms.assetid: 
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 12/19/2017
ms.author: rajanaki
 
---
# Troubleshoot errors when reprotecting a virtual machine back to on-premises, after failover
You may receive one of the following errors while performing reprotect of a virtual machine to Azure. To troubleshoot, use the described steps for each error condition.


## Error code 95226

*Reprotect failed as the Azure virtual machine was not able to reach the on-premises configuration server.*

This happens when 
1. The Azure virtual machine could not reach the on-premises configuration server and hence could not be discovered and registered to the configuration server. 
2. The InMage Scout Application service on the Azure virtual machine that needs to be running to communicate to the on-premises configuration server might not be running post failover.

To resolve this issue
1. You need to ensure that the network of the Azure virtual machine is configured such that the virtual machine can communicate with the on-premises configuration server. To do this, either set up a Site to Site VPN back to your on-premises datacenter or configure an ExpressRoute connection with private peering on the virtual network of the Azure virtual machine. 
2. If you already have a network configured such that the Azure virtual machine can communicate with the on-premises configuration server, then log into the virtual machine and check the 'InMage Scout Application Service'. If you observe that the InMage Scout Application Service is not running then start the service manually and ensure that the service start type is set to Automatic.

## Error code 78052
Reprotect fails with the error message: *Protection couldn't be completed for the virtual machine.*

This can happen due to two reasons
1. The virtual machine you are reprotecting is a Windows Server 2016. Curently this operating system is not supported for failback, but will be supported very soon.
2. There already exists a virtual machine with the same name on the Master target server you are failing back to.

To resolve this issue you can select a different master target server on a different host, so that the reprotect will create the machine on a different host, where the names do not collide. You can also vMotion the master target to a different host where the name collision will not happen. If the existing virtual machine is a stray machine, you can just rename it so that the new virtual machine can get created on the same ESXi host.

## Error code 78093

*The VM is not running, in a hung state or not accessible.*

To reprotect a failed over virtual machine back to on-premises, you need the Azure virtual machine running. This is so that the mobility service registers with the configuration server on-premises and can start replicating by communicating with the process server. If the machine is on an incorrect network or in not running (hung state or shutdown), then the configuration server cannot reach the mobility service in the virtual machine to begin the reprotect. You can restart the virtual machine so that it can start communicating back on-premises. Restart the reprotect job after starting the Azure virtual machine

## Error code 8061

*The datastore is not accessible from ESXi host.*

Refer to the [master target pre-requisites](site-recovery-how-to-reprotect.md#common-things-to-check-after-completing-installation-of-the-master-target-server) and the [support datastores](site-recovery-how-to-reprotect.md#what-datastore-types-are-supported-on-the-on-premises-esxi-host-during-failback) for failback


# Troubleshoot errors when performing a failback of an Azure virtual machine back to on-premises
You may receive one of the following errors while performing failback of an Azure virtual machine back to on-premises. To troubleshoot, use the described steps for each error condition.

## Error code 8038

*Failed to bring up the on-premises virtual machine due to the error*

This happens when the on-premises virtual machine is brought up on a host that does not have enough Memory provisioned.

To resolve this issue

1. You can provision more memory on the ESXi host.
1. vMotion the VM to another ESXi host that has enough memory to boot the virtual machine.