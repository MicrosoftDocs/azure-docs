---
title: Create a Windows virtual machine on Azure Stack using Azure CLI | Microsoft Docs
description: Learn how to create a Windows VM on Azure Stack using Azure CLI
services: azure-stack
documentationcenter: ''
author: SnehaGunda
manager: byronr
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/25/2017
ms.author: sngun
---

# Create a Windows virtual machine on Azure Stack using Azure CLI

Azure CLI is used to create and manage Azure Stack resources from the command line. This guide details using Azure CLI to create a Windows Server 2016 virtual machine in Azure Stack. Once the virtual machine is created, you will connect with Remote Desktop, Install IIS, then view the default website. 

Before you begin, make sure that your Azure Stack operator has added the “Windows Server 2016” image to the Azure Stack marketplace.  

Azure Stack requires a specific version of Azure CLI to create and manage the resources. If you don't have Azure CLI configured for Azure Stack, follow the steps to [install and configure Azure CLI](azure-stack-connect-cli.md).


## Create a resource group

A resource group is a logical container into which Azure Stack resources are deployed and managed. Use the [az group create](/cli/azure/group#create) command to create a resource group. We have assigned values for all variables in this document, you can use them as is or assign a different value. 
The following example creates a resource group named myResourceGroup in the local location.

```cli
az group create --name myResourceGroup --location local
```

## Create a virtual machine

Create a VM by using the [az vm create](/cli/azure/vm#create) command. The following example creates a VM named myVM. This example uses Demouser for an administrative user name and Demouser@123 as the password. Update these values to something appropriate to your environment. These values are needed when connecting to the virtual machine.

```cli
az vm create \
  --resource-group "myResourceGroup" \
  --name "myVM" \
  --image "Win2016Datacenter" \
  --admin-username "Demouser" \
  --admin-password "Demouser@123" \
  --use-unmanaged-disk \
  --location local
```

When the VM is created, make note of the *PublicIPAddress* parameter that is output, which you will use to access the VM.
 
## Open port 80 for web traffic

By default, only RDP connections are allowed to a Windows virtual machine deployed in Azure Stack. If this VM is going to be a webserver, you need to open port 80 from the Internet. Use the [az vm open-port](/cli/azure/vm#open-port) command to open the desired port.

```cli
az vm open-port --port 80 --resource-group myResourceGroup --name myVM
```

## Connect to virtual machine

Use the following command to create a remote desktop session with the virtual machine. Replace the IP address with the public IP address of your virtual machine. When prompted, enter the credentials used when creating the virtual machine.

```
mstsc /v <Public IP Address>
```

## Install IIS using PowerShell

Now that you have logged in to the Azure VM, you can use a single line of PowerShell to install IIS and enable the local firewall rule to allow web traffic. Open a PowerShell prompt and run the following command:

```powershell
Install-WindowsFeature -name Web-Server -IncludeManagementTools
```

## View the IIS welcome page

With IIS installed and port 80 now open on your VM from the Internet, you can use a web browser of your choice to view the default IIS welcome page. Be sure to use the public IP address you documented above to visit the default page. 

![IIS default site](./media/azure-stack-quick-create-vm-windows-cli/default-iis-website.png) 

## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group#delete) command to remove the resource group, VM, and all related resources.

```cli
az group delete --name myResourceGroup
```

## Next steps

[Create a virtual machine by using password stored in key vault](azure-stack-kv-deploy-vm-with-secret.md)

[To learn about Storage in Azure Stack](azure-stack-storage-overview.md)
