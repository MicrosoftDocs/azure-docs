---
title: Deploy Azure dedicated hosts using the CLI | Microsoft Docs
description: Deploy VMs to dedicated hosts using the Azure CLI.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: cynthn
manager: jeconnoc
editor: tysonn
tags: azure-resource-manager
ms.service: virtual-machines-linux
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 07/24/2019
ms.author: cynthn

#Customer intent: As an IT administrator, I want to learn about more about using a dedicated host for my Azure virtual machines
---

# Preview: Deploy VMs to dedicated hosts using the Azure CLI
 
Create a dedicated host with the Azure CLI 
 
This article guides you through how to create an infrastructure using Azure dedicated hosts to be later used for virtual machines  
Make sure that you have installed the latest Azure CLI and logged to an Azure account in with az login. 
In the following examples, replace example parameter names with your own values. Example parameter names include myHostGroup, myHost, and myVM. 

## Create resource group 
An Azure resource group is a logical container into which Azure resources are deployed and managed. Create the resource group with az group create. The following example creates a resource group named *myDHResourceGroup* in the *eastus2* location: 

```azurecli-interactive
az group create --name myDHResourceGroup --location eastus2 
```
 
## Create a host group 


A **host group** is a new resource that represents a collection of dedicated hosts. You create a host group in a region and an availability zone, and add hosts to it. When planning for high availability, there are additional options. You can use one or both of the following with your dedicated hosts: 
- Span across multiple availability zones. In this case, you are required to have a host group in each of the zones you wish to use.
- Span across multiple fault domains which are mapped to physical racks. 
 
In either case, you are need to provide the fault domain count for your host group. If you do not want to span fault domains in your group, use a fault domain count of 1. 

You can also decide to use both availability zones and fault domains. In such a case, you are required to provide both when creating the host group.  
 
The following will create a host group in availability zone 1 (and no fault domains).

```azurecli-interactive 
az vm host group create \
   --name myAZHostGroup \
   -g myDHResourceGroup \
   -z 1 \
   --platform-fault-domain-count 1 
```
 
The following will create a host group by using fault domains only (to be used in regions where availability zones are not supported). 

```azurecli-interactive 
az vm host group create \
   --name myFDHostGroup \
   -g myDHResourceGroup \
   --platform-fault-domain-count 2 
```
 
The following will create a host group by using availability zones and fault domains. 

```azurecli-interactive 
az vm host group create \
   --name myHostGroup \
   -g myDHResourceGroup \
   -z 1 \
   --platform-fault-domain-count 2 
``` 
 
## Create a host 

Now let's create a dedicated host in the host group. In addition to a name for the host, you are required to provide the SKU for the host. Host SKU capture the supported VM series as well as the hardware generation for your dedicated host.  

If you set a fault domain count for your host group, you will be asked to specify the fault domain for your host.  

```azurecli-interactive
az vm host create \
   --host-group myHostGroup \
   --name myHost \
   --sku DSv3-Type1 \
   --platform-fault-domain 1 \
   -g myDHResourceGroup
```
 
## Create a virtual machine 
Create a virtual machine within a dedicated host using [az vm create](/cli/azure/vm#az-vm-create). 
In case you have specified an availability zone when creating your host group, you are required to use the same zone when creating the virtual machine. There is no such requirement for fault domains  

```azurecli-interactive 
az vm create \
   -n myVM \
   --image debian \
   --generate-ssh-keys \
   --host-group myHostGroup \
   --host myHost \
   --generate-ssh-keys \
   --size Standard_D4s_v3 \
   -g myDHResourceGroup \
   --zone 1
```
 
In case you are not using availability zones, simply omit the zone parameter from your cli call. 
 
 
## Export as a template 

What if you now want to create an additional development environment with the same parameters, or a production environment that matches it? Resource Manager uses JSON templates that define all the parameters for your environment. You build out entire environments by referencing this JSON template. You can build JSON templates manually or export an existing environment to create the JSON template for you. Use [az group export](/cli/azure/group#az-group-export) to export your resource group.

```azurecli-interactive
az group export --name myDHResourceGroup > myDHResourceGroup.json 
```

This command creates the `myDHResourceGroup.json` file in your current working directory. When you create an environment from this template, you are prompted for all the resource names. You can populate these names in your template file by adding the `--include-parameter-default-value` parameter to the `az group export` command. Edit your JSON template to specify the resource names, or create a parameters.json file that specifies the resource names.
 
To create an environment from your template, use [az group deployment create](/cli/azure/group/deployment#az-group-deployment-create).

```azurecli-interactive
az group deployment create \ 
    --resource-group myNewResourceGroup \ 
    --template-file myDHResourceGroup.json 
```

You might want to read more about how to deploy from templates. Learn about how to incrementally update environments, use the parameters file, and access templates from a single storage location. 


## Cleanup 

You are being charged for your dedicated hosts even when no virtual machines are deployed. You should delete any hosts you are currently not using to save costs.  

You can only delete a host when there are no any longer virtual machines using it. Delete the VMs using [az vm delete](/cli/azure/vm#az-vm-delete).

```azurecli-interactive
az vm delete -n myVM -g myDHResourceGroup
```

After deleting the VMs, you can delete the host using [az vm host delete](/cli/azure/vm#az-vm-host-delete).

```azurecli-interactive 
az vm host delete -g myDHResourceGroup --host-group myHostGroup --name myHost 
```
 
Once you have deleted all of your hosts, you may delete the host group using [az vm host group delete](/cli/azure/vm#az-vm-host-group-delete).  
 
```azurecli-interactive
az vm host group delete -g myDHResourceGroup --host-group myHostGroup  
```
 
You can also delete the entire resource group in a single command. This will delete all resources created in the group, including all of the VMs, hosts and host groups.
 
```azurecli-interactive
az group delete -n myDHResourceGroup 
```

## Next steps

You can also create dedicated hosts using the [Azure portal](dedicated-hosts-portal.md).