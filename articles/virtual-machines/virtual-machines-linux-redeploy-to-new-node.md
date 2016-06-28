<properties 
	pageTitle="Redeploy Linux Virtual Machines | Microsoft Azure" 
	description="Describes how to redeploy Linux virtual machines to mitigate SSH connection issues." 
	services="virtual-machines-linux" 
	documentationCenter="virtual-machines" 
	authors="iainfoulds" 
	manager="timlt"
	tags="azure-resource-manager,top-support-issue" 
/>
	

<tags 
	ms.service="virtual-machines-linux" 
	ms.devlang="na" 
	ms.topic="support-article" 
	ms.tgt_pltfrm="vm-linux"
	ms.workload="infrastructure" 
	ms.date="6/28/2016" 
	ms.author="iainfou" 
/>

# Redeploy virtual machine to new Azure node

If you have been facing difficulties troubleshooting SSH or application access to an Azure virtual machine (VM), this article will help you mitigate them all by yourself without opening a support request or resizing the VM. When you redeploy a VM, it moves the VM to a new node within the Azure infrastructure and then powers it back on, retaining all your configuration options and associated resources. This article shows you how to redeploy a VM using Azure CLI or the Azure portal.

Please note that after you redeploy a VM, the temporary disk will be lost and dynamic IP addresses associated with virtual network interface will be updated. 


## Using Azure CLI

Make sure you have the [latest Azure CLI installed](../xplat-cli-install.md) on your machine and you are in resource manager mode (`azure config mode arm`).

Use the following Azure CLI command to redeploy your virtual machine:

```bash
azure vm redeploy -resourcegroup <resourcegroup> --vm-name <vmname> 
```

If you list the status of the VM, you will see `PowerState` of the VM go from 'Running' to 'Updating', then 'Starting' and finally 'Running' as it goes through the redeploy process to a new host:

```bash
azure vm list -g <resourcegroup>
```


[AZURE.INCLUDE [virtual-machines-common-redeploy-to-new-node](../../includes/virtual-machines-common-redeploy-to-new-node.md)]


## Next steps