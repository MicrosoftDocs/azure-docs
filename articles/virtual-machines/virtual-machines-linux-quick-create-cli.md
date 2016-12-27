---
title: Create a Linux VM using the Azure CLI 2.0 (Preview) | Microsoft Azure
description: Create a Linux VM using the Azure CLI 2.0 (Preview).
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
ms.date: 09/26/2016
ms.author: rasquill

---

# Create a Linux VM using the Azure CLI 2.0 (Preview)
This article shows how to quickly deploy a Linux virtual machine (VM) on Azure by using the [az vm create](/cli/azure/vm#create) command using the Azure CLI 2.0 (Preview). 

> [!NOTE] 
> The Azure CLI 2.0 Preview is our next generation multi-platform CLI. Try it out and let us know what you think on the [GitHub project page](https://github.com/Azure/azure-cli).
>
> The rest of our docs use the existing Azure CLI. To create a VM using the existing Azure CLI and not the CLI 2.0 Preview, see [Create a VM with the Azure CLI](virtual-machines-linux-quick-create-cli-nodejs.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

To create a VM, you need: 

* an Azure account ([get a free trial](https://azure.microsoft.com/pricing/free-trial/))
* the [Azure CLI v. 2.0 (Preview)](https://github.com/Azure/azure-cli#installation) installed
* to be logged in to your Azure account (type [az login](/cli/azure/#login))

(You can also quickly deploy a Linux VM by using the [Azure portal](virtual-machines-linux-quick-create-portal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).)

The following example shows how to deploy a Debian VM and attach your Secure Shell (SSH) key (your arguments might be different; if you want a different image, you [can search for one](virtual-machines-linux-cli-ps-findimage.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)).

## Create a resource group

First, type [az group create](/cli/azure/group#create) to create your resource group that contains all deployed resources:

```azurecli
az group create -n myResourceGroup -l westus
```

The output looks like the following (you can choose a different `--output` option if you wish):

```json
{
  "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup",
  "location": "westus",
  "name": "myResourceGroup",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null
}
```

## Create your VM using the latest Debian image

Now you can create your VM and its environment. Remember to replace the `----public-ip-address-dns-name` value with a unique one; the one below may already be taken.

```azurecli
az vm create \
--image credativ:Debian:8:latest \
--admin-username ops \
--ssh-key-value ~/.ssh/id_rsa.pub \
--public-ip-address-dns-name mydns \
--resource-group myResourceGroup \
--location westus \
--name myVM
```


The output looks like the following. Note either the `publicIpAddress` or the `fqdn` value to **ssh** into your VM.


```json
{
  "fqdn": "mydns.westus.cloudapp.azure.com",
  "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
  "macAddress": "00-0D-3A-32-05-07",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "40.112.217.29",
  "resourceGroup": "myResourceGroup"
}
```

Log in to your VM by using the public IP address listed in the output. You can also use the fully qualified domain name (FQDN) that's listed.

```bash
ssh ops@mydns.westus.cloudapp.azure.com
```

You should expect to see something like the following output, depending on the distribution you chose:

```
The authenticity of host 'mydns.westus.cloudapp.azure.com (40.112.217.29)' can't be established.
RSA key fingerprint is SHA256:xbVC//lciRvKild64lvup2qIRimr/GB8C43j0tSHWnY.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'mydns.westus.cloudapp.azure.com,40.112.217.29' (RSA) to the list of known hosts.

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
ops@mynewvm:~$ ls /
bin  boot  dev  etc  home  initrd.img  lib  lib64  lost+found  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var  vmlinuz
```

## Next steps
The `az vm create` command is the way to quickly deploy a VM so you can log in to a bash shell and get working. However, using `az vm create` does not give you extensive control nor does it enable you to create a more complex environment.  To deploy a Linux VM that's customized for your infrastructure, you can follow any of these articles:

* [Use an Azure Resource Manager template to create a specific deployment](virtual-machines-linux-cli-deploy-templates.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Create your own custom environment for a Linux VM using Azure CLI commands directly](virtual-machines-linux-create-cli-complete.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Create an SSH Secured Linux VM on Azure using templates](virtual-machines-linux-create-ssh-secured-vm-from-template.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

You can also [use the `docker-machine` Azure driver with various commands to quickly create a Linux VM as a docker host](virtual-machines-linux-docker-machine.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) as well, and if you're using Java, try the [create()](/java/api/com.microsoft.azure.management.compute._virtual_machine) method.

