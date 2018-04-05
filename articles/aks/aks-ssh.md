---
title: SSH into Azure Container Service (AKS) cluster nodes
description: Create an SSH connection with an Azure Container Service (AKS) cluster nodes
services: container-service
author: neilpeterson
manager: timlt

ms.service: container-service
ms.topic: article
ms.date: 04/06/2018
ms.author: nepeters
ms.custom: mvc
---

# SSH into Azure Container Service (AKS) cluster nodes

Occasionally, you may need to access an Azure Container Service (AKS) node for maintenance, log collection, or other troubleshooting operations. Azure Container Service (AKS) nodes are not exposed to the internet. Use the steps detailed in this document to create an SSH connection with an AKS node.

## Get AKS node address

Get the ip address of the AKS cluster nodes using the `az vm list-ip-addresses` command.

```console
$ az vm list-ip-addresses --resource-group MC_myAKSCluster_myAKSCluster_eastus -o table

VirtualMachine            PrivateIPAddresses
------------------------  --------------------
aks-nodepool1-42032720-0  10.240.0.6
aks-nodepool1-42032720-1  10.240.0.5
aks-nodepool1-42032720-2  10.240.0.4
```

## Configure SSH access

Copy your SSH key to the host clip board.

```yaml
$ cat ~/.ssh/id_rsa | pbcopy
```

Run the `aks-ssh` container image, which will create a pod on one of the AKS cluster nodes. The `aks-ssh` image has been created from the debian image and includes vim and an SSH client.

```azurecli-interactive
$ kubectl run -it --rm aks-ssh --image=neilpeterson/aks-ssh
```

Once attached to the running container, create a file named `id_rsa` and copy into it the contents of the clipboard.

```azurecli-interactive
$ vi id_rsa
```

Modify the `id_rsa` file so that it is user read-only.

```console
$ chmod 0600 id_rsa
```

## Create the ssh connection.

Now create an SSH connection to any AKS node. The default user name for an AKS cluster is `azureuser`. If this account was changed at cluster creation time, substitute the proper admin user name.

```azurecli-interactive
$ ssh -i id_rsa azureuser@10.240.0.6

Welcome to Ubuntu 16.04.3 LTS (GNU/Linux 4.11.0-1016-azure x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  Get cloud support with Ubuntu Advantage Cloud Guest:
    http://www.ubuntu.com/business/services/cloud

48 packages can be updated.
0 updates are security updates.


*** System restart required ***
Last login: Tue Feb 27 20:10:38 2018 from 167.220.99.8
To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.

azureuser@aks-nodepool1-42032720-0:~$
```

## Remove SSH access

When done, exit the SSH session and then the interactive container session. This action deletes the SSH pod from the AKS cluster.