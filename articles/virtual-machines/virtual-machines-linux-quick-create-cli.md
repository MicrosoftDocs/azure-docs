---
title: Create a Linux VM using the Azure CLI 2.0 | Microsoft Azure
description: Create a Linux VM using the Azure CLI 2.0.
services: virtual-machines-linux
documentationcenter: 
author: squillace
manager: timlt
editor: 

ms.assetid: 82005a05-053d-4f52-b0c2-9ae2e51f7a7e
ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: hero-article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 01/13/2016
ms.author: rasquill

---

# Create a Linux VM using the Azure CLI 2.0
This article shows how to quickly deploy a Linux virtual machine (VM) on Azure by using the [az vm create](/cli/azure/vm#create) command using the Azure CLI 2.0 using both managed disks as well as disks in native storage accounts. You can also perform these steps with the [Azure CLI 1.0](virtual-machines-linux-quick-create-cli-nodejs.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

To create a VM, you need: 

* an Azure account ([get a free trial](https://azure.microsoft.com/pricing/free-trial/))
* the [Azure CLI 2.0](/cli/azure/install-az-cli2) installed
* to be logged in to your Azure account (type [az login](/cli/azure/#login))

(You can also deploy a Linux VM using the [Azure portal](virtual-machines-linux-quick-create-portal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).)

The following example shows how to deploy a Debian VM and connect to it using Secure Shell (SSH) key. Your arguments might be different; if you want a different image, you [can search for one](virtual-machines-linux-cli-ps-findimage.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

## Using Managed disks

To use Azure managed disks, you must use a region that supports them. First, type [az group create](/cli/azure/group#create) to create your resource group that contains all deployed resources:

```azurecli
 az group create -n myResourceGroup -l westus
```

The output looks like the following (you can specify a different `--output` option if you wish to see a different format):

```json
{
  "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup",
  "location": "westus",
  "managedBy": null,
  "name": "myResourceGroup",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null
}
```
### Create your VM 
Now you can create your VM and its environment. Remember to replace the `--public-ip-address-dns-name` value with a unique one; the one below may already be taken.

```azurecli
az vm create \
--image credativ:Debian:8:latest \
--admin-username azureuser \
--ssh-key-value ~/.ssh/id_rsa.pub \
--public-ip-address-dns-name manageddisks \
--resource-group myResourceGroup \
--location westus \
--name myVM
```


The output looks like the following. Note either the `publicIpAddress` or the `fqdn` value to **ssh** into your VM.


```json
{
  "fqdn": "manageddisks.westus.cloudapp.azure.com",
  "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
  "macAddress": "00-0D-3A-32-E9-41",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "104.42.127.53",
  "resourceGroup": "myResourceGroup"
}
```

Log in to your VM by using either the public IP address or the fully qualified domain name (FQDN) listed in the output.

```bash
ssh ops@manageddisks.westus.cloudapp.azure.com
```

You should expect to see something like the following output, depending on the distribution you chose:

```bash
The authenticity of host 'manageddisks.westus.cloudapp.azure.com (134.42.127.53)' can't be established.
RSA key fingerprint is c9:93:f5:21:9e:33:78:d0:15:5c:b2:1a:23:fa:85:ba.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'manageddisks.westus.cloudapp.azure.com' (RSA) to the list of known hosts.
Enter passphrase for key '/home/ops/.ssh/id_rsa':

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Fri Jan 13 14:44:21 2017 from net-37-117-240-123.cust.vodafonedsl.it
ops@myVM:~$ 
```

See [Next Steps](#next-steps) for other things you can do with your new VM using managed disks.

## Using unmanaged disks 

VMs that use unmanaged storage disks have unmanaged storage accounts and First, type [az group create](/cli/azure/group#create) to create your resource group to contain all deployed resources:

```azurecli
az group create --name nativedisks --location westus
```

The output looks like the following (you can choose a different `--output` option if you wish):

```json
{
  "id": "/subscriptions/<guid>/resourceGroups/nativedisks",
  "location": "westus",
  "managedBy": null,
  "name": "nativedisks",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null
}
```

### Create your VM 

Now you can create your VM and its environment. Remember to replace the `--public-ip-address-dns-name` value with a unique one; the one below may already be taken.

```azurecli
az vm create \
--image credativ:Debian:8:latest \
--admin-username azureuser \
--ssh-key-value ~/.ssh/id_rsa.pub \
--public-ip-address-dns-name nativedisks \
--resource-group nativedisks \
--location westus \
--name myVM \
--use-native-disk
```

The output looks like the following. Note either the `publicIpAddress` or the `fqdn` value to **ssh** into your VM.

```json
{
  "fqdn": "nativedisks.westus.cloudapp.azure.com",
  "id": "/subscriptions/<guid>/resourceGroups/nativedisks/providers/Microsoft.Compute/virtualMachines/myVM",
  "macAddress": "00-0D-3A-33-24-3C",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "13.91.91.195",
  "resourceGroup": "nativedisks"
}
```

Log in to your VM by using the public IP address or the fully qualified domain name (FQDN)both of which are listed in the output above.

```bash
ssh ops@nativedisks.westus.cloudapp.azure.com
```

You should expect to see something like the following output, depending on the distribution you chose:

```
The authenticity of host 'nativedisks.westus.cloudapp.azure.com (13.91.93.195)' can't be established.
RSA key fingerprint is 3f:65:22:b9:07:c9:ef:7f:8c:1b:be:65:1e:86:94:a2.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'nativedisks.westus.cloudapp.azure.com,13.91.93.195' (RSA) to the list of known hosts.
Enter passphrase for key '/home/ops/.ssh/id_rsa':

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
ops@myVM:~$ ls /
bin  boot  dev  etc  home  initrd.img  lib  lib64  lost+found  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var  vmlinuz
```

## Next steps
The `az vm create` command is the way to quickly deploy a VM so you can log in to a bash shell and get working. However, using `az vm create` does not give you extensive control nor does it enable you to create a more complex environment.  To deploy a Linux VM that's customized for your infrastructure, you can follow any of these articles:

* [Use an Azure Resource Manager template to create a specific deployment](virtual-machines-linux-cli-deploy-templates.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Create your own custom environment for a Linux VM using Azure CLI commands directly](virtual-machines-linux-create-cli-complete.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Create an SSH Secured Linux VM on Azure using templates](virtual-machines-linux-create-ssh-secured-vm-from-template.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

You can also [use the `docker-machine` Azure driver with various commands to quickly create a Linux VM as a docker host](virtual-machines-linux-docker-machine.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) as well, and if you're using Java, try the [create()](/java/api/com.microsoft.azure.management.compute._virtual_machine) method.

