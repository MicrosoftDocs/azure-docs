---
title: Troubleshooting SCVMM to Azure | Microsoft Docs
description: This article describes how to troubleshoot setup, configuration, protection, failover and failback from SCVMM to Azure.
services: site-recovery
documentationcenter: ''
author: ruturaj
manager: gauravd
editor: ''

ms.assetid: af1d9b26-1956-46ef-bd05-c545980b72dc
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 11/29/2016
ms.author: ruturajd

---
# Common issues in Setup and Registration

* Ensure that the server on which you install the **Microsoft Azure Site Recovery Provider** has access to the following url's<br>
	1. *.hypervrecoverymanager.windowsazure.com
	2. *.accesscontrol.windows.net
	3. *.store.core.windows.net

* Ensure that the system clock on the server where you install **Microsoft Azure Site Recovery Provider** has the correct time for the time zone the server is configured for.


* Always choose the 'Connect to Azure Site Recovery using a proxy server' option if you know that the server on which you are installing **Microsoft Azure Site Recovery Provider** is behind a proxy server.<br>
	* This setting can be change at any point of time by running the **DRConfigurator.exe** and re-registering the Microsoft Azure Site Recovery Provider.

## **Recommended  Documents**
[On-premises prerequisites](https://azure.microsoft.com/documentation/articles/site-recovery-vmm-to-vmm/#on-premises-prerequisites)


# Common issues in enabling protection

* Ensure you have used the capacity planning tool to avoid replication misses and not meeting the SLAs

* Ensure that the server that you are trying to protect meets the following requirements
	-	Each disk should be less than 1TB in size
	-	The OS disk should be a basic disk and not dynamic disk
	-	Name of the server should meet requirements of Azure virtual machine name – length should be less than 16 characters and contain Alphanumeric, underscore, and hyphen. For more details, [see this](http://aka.ms/asrstnaming)

* For generation 2/UEFI enabled virtual machines, the operating system family should be Windows and boot disk should be less than 300GB

* Choose a valid storage account. Storage accounts of type RA-GRS and blob type are NOT supported.

* Hyper-V servers should have fixes mentioned in [article 2961977](https://support.microsoft.com/kb/2961977)
 installed.
## **Recommended  Documents**
[VMM to Azure](http://aka.ms/asrste2a)

# Common issues in failover to Azure

## **Unable to connect/RDP/SSH to the failed over virtual machine**

### **Connect button is grayed out on the virtual machine** 
* If the deployment model is Resource Manager <br/>
Add a Public IP on the Network interface of the virtual machine. [See the steps to add a public ip here](https://aka.ms/asr-resourcemanager-vm-connect)


* If the deployment model is Classic <br/>
Add an endpoint on public port 3389 for RDP and on public port 22 for SSH. [See the steps to add an endpoint here](https://aka.ms/asr-classic-vm-connect)

### **Connect button is available on the virtual machine**
* Look at the console screenshot of the virtual machine by going to **Boot diagnostics** in the virtual machine menu.  Boot diagnostics is enabled by default on a Resource Manager virtual machine. You need to manually enable it on a Classic virtual machine. 
	* Note that enabling any setting other than Boot Diagnostics would require Azure VM Agent to be installed in the virtual machine before the failover

* If the virtual machine has not started, try failing over to an older recovery point

* If the application inside the virtual machine is not coming up, try failing over to an app-consistent recovery point

* If the virtual machine is domain joined then ensure that domain controller is correctly functioning. You can do that by creating a new virtual machine in the same network and ensuring that it is able to join to the same domain on which the failed over virtual machine is expected to come up

	* If the domain controller is not functioning correctly try logging in to the failed over virtual machine using a local administrator account
	
	
* If you are using a custom DNS server then ensure that it is reachable. You can do that by creating a new virtual in the same network and checking that it is able to do name resolution using the custom DNS Server


## **Recommended documents**
[Detailed failover documentation](https://azure.microsoft.com/documentation/articles/site-recovery-failover/)

[Troubleshoot RDP connection](https://azure.microsoft.com/documentation/articles/virtual-machines-windows-troubleshoot-rdp-connection/)


# Common issues in failack from azure

