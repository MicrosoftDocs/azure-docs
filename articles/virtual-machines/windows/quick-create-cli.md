---
title: Azure Quick Start - Create Windows VM CLI | Microsoft Docs
description: Quickly learn to create a Windows virtual machines with the Azure CLI.
services: virtual-machines-windows
documentationcenter: virtual-machines
author: neilpeterson
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 04/03/2017
ms.author: nepeters
---

# Create a Windows virtual machine with the Azure CLI

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This guide details using the Azure CLI to deploy a virtual machine running Windows Server 2016. Once deployment is complete, we connect to the server and install IIS.

Before you start, make sure that the Azure CLI has been installed. For more information, see [Azure CLI installation guide](https://docs.microsoft.com/cli/azure/install-azure-cli).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Log in to Azure 

Log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions.

```azurecli
az login
```

## Create a resource group

Create a resource group with [az group create](/cli/azure/group#create). An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named `myResourceGroup` in the `westeurope` location.

```azurecli
az group create --name myResourceGroup --location westeurope
```

## Create virtual machine

Create a VM with [az vm create](/cli/azure/vm#create). 

The following example creates a VM named `myVM`. This example uses `azureuser` for an administrative user name and ` myPassword12` as the password. Update these values to something appropriate to your environment. These values are needed when creating a connection with the virtual machine.

```azurecli
az vm create --resource-group myResourceGroup --name myVM --image win2016datacenter --admin-username azureuser --admin-password myPassword12
```

When the VM has been created, the Azure CLI shows information similar to the following example. Take note of the public IP address. This address is used to access the VM.

```azurecli
{
  "fqdns": "",
  "id": "/subscriptions/d5b9d4b7-6fc1-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
  "location": "westeurope",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "52.174.34.95",
  "resourceGroup": "myResourceGroup"
}
```

## Open port 80 for web traffic 

By default only RDP connections are allowed into Windows virtual machines deployed in Azure. If this VM is going to be a webserver, you need to open port 80 from the Internet.  A single command is required to open the desired port.  
 
 ```azurecli 
az vm open-port --port 80 --resource-group myResourceGroup --name myVM
```


## Connect to virtual machine

Use the following command to create a remote desktop session with the virtual machine. Replace the IP address with the public IP address of your virtual machine. When prompted, enter the credentials used when creating the virtual machine.

```bash 
mstsc /v:<Public IP Address>
```

## Install IIS using PowerShell

Now that you have logged into the Azure VM, you can use a single line of PowerShell to install IIS and enable the local firewall rule to allow web traffic.  Open a PowerShell prompt and run the following command:

```powershell
Install-WindowsFeature -name Web-Server -IncludeManagementTools
```

## View the IIS welcome page

With IIS installed and port 80 now open on your VM from the Internet, you can use a web browser of your choice to view the default IIS welcome page. Be sure to use the `publicIpAddress` you documented above to visit the default page. 

![IIS default site](./media/quick-create-powershell/default-iis-website.png) 
## Delete virtual machine

When no longer needed, the following command can be used to remove the Resource Group, VM, and all related resources.

```azurecli
az group delete --name myResourceGroup
```

## Next steps

[Install a role and configure firewall tutorial](hero-role.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)

[Explore VM deployment CLI samples](cli-samples.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)