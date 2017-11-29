---
title: Use cloud-init to add a user | Microsoft Docs
description: How to use cloud-init to add a user to a Linux VM during creation with the Azure CLI 2.0
services: virtual-machines-linux
documentationcenter: ''
author: rickstercdn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.topic: article
ms.date: 11/29/2017
ms.author: rclaus

---
# Use cloud-init to add a user to a Linux VM in Azure

## Add a user to a VM with cloud-init
One of the first tasks on any new Linux VM is to add a user for yourself to avoid the use of *root*. SSH keys are best practice for security and usability. Keys are added to the *~/.ssh/authorized_keys* file with this cloud-init script.

To add a user to a Linux VM, create a cloud-init file named *cloud_init_add_user.txt* and paste the following configuration. Provide your own public key (such as the contents of *~/.ssh/id_rsa.pub*) for *ssh-authorized-keys*:

```yaml
#cloud-config
users:
  - name: myadminuser
    groups: sudo
    shell: /bin/bash
    sudo: ['ALL=(ALL) NOPASSWD:ALL']
    ssh-authorized-keys:
      - ssh-rsa AAAAB3<snip>
```

Now, create a VM with [az vm create](/cli/azure/vm#create) and specify the cloud-init file with `--custom-data cloud_init_add_user.txt` as follows:

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myVMUser \
    --image UbuntuLTS \
    --admin-username azureuser \
    --generate-ssh-keys \
    --custom-data cloud_init_add_user.txt
```

SSH to the public IP address of your VM shown in the output from the preceding command. Enter your own public IP address as follows:

```bash
ssh myadminuser@publicIpAddress
```

To confirm your user was added to the VM and the specified groups, view the contents of the */etc/group* file as follows:

```bash
cat /etc/group
```

The following example output shows the user from the *cloud_init_add_user.txt* file has been added to the VM and the appropriate group:

```bash
root:x:0:
<snip />
sudo:x:27:myadminuser
<snip />
myadminuser:x:1000:
```