---
title: Create an NFS (Network File System) Ubuntu Server for use by pods of Azure Kubernetes Service (AKS)
description: Learn how to manually create an NFS Ubuntu Linux Server volume for use with pods in Azure Kubernetes Service (AKS)
services: container-service
author: ozboms

ms.service: container-service
ms.topic: article
ms.date: 4/25/2019
ms.author: obboms
---

# Manually create and use an NFS (Network File System) Linux Server volume with Azure Kubernetes Service (AKS)
Sharing data between containers is often a necessary component of container-based services and applications. You usually have various pods that need access to the same information on an external persistent volume.    
While Azure files are an option, creating an NFS Server on an Azure VM is another form of persistent shared storage. 

This article will show you how to create an NFS Server on an Ubuntu virtual machine. And also give your AKS containers access to this shared file system.

## Before you begin
This article assumes that you have an existing AKS Cluster. If you need an AKS Cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

Your AKS Cluster will need to live in the same or peered virtual networks as the NFS Server. The cluster must be created in an existing VNET, which can be the same VNET as your VM.

The steps for configuring with an existing VNET are described in the documentation: [creating AKS Cluster in existing VNET][aks-virtual-network] and [connecting virtual networks with VNET peering][peer-virtual-networks]

It also assumes you've created an Ubuntu Linux Virtual Machine (for example, 18.04 LTS). Settings and size can be to your liking and can be deployed through Azure. For Linux quickstart, see [linux VM management][linux-create].

If you deploy your AKS Cluster first, Azure will automatically populate the virtual network field when deploying your Ubuntu machine, making them live within the same VNET. But if you want to work with peered networks instead, consult the documentation above.

## Deploying the NFS Server onto a Virtual Machine
Here is the script to set up an NFS Server within your Ubuntu virtual machine:
```bash
#!/bin/bash

# This script should be executed on Linux Ubuntu Virtual Machine

EXPORT_DIRECTORY=${1:-/export/data}
DATA_DIRECTORY=${2:-/data}
AKS_SUBNET=${3:-*}

echo "Updating packages"
apt-get -y update

echo "Installing NFS kernel server"

apt-get -y install nfs-kernel-server

echo "Making data directory ${DATA_DIRECTORY}"
mkdir -p ${DATA_DIRECTORY}

echo "Making new directory to be exported and linked to data directory: ${EXPORT_DIRECTORY}"
mkdir -p ${EXPORT_DIRECTORY}

echo "Mount binding ${DATA_DIRECTORY} to ${EXPORT_DIRECTORY}"
mount --bind ${DATA_DIRECTORY} ${EXPORT_DIRECTORY}

echo "Giving 777 permissions to ${EXPORT_DIRECTORY} directory"
chmod 777 ${EXPORT_DIRECTORY}

parentdir="$(dirname "$EXPORT_DIRECTORY")"
echo "Giving 777 permissions to parent: ${parentdir} directory"
chmod 777 $parentdir

echo "Appending bound directories into fstab"
echo "${DATA_DIRECTORY}    ${EXPORT_DIRECTORY}   none    bind  0  0" >> /etc/fstab

echo "Appending localhost and Kubernetes subnet address ${AKS_SUBNET} to exports configuration file"
echo "/export        ${AKS_SUBNET}(rw,async,insecure,fsid=0,crossmnt,no_subtree_check)" >> /etc/exports
echo "/export        localhost(rw,async,insecure,fsid=0,crossmnt,no_subtree_check)" >> /etc/exports

nohup service nfs-kernel-server restart
```
The server will restart (because of the script) and you can mount the NFS Server to AKS

>[!IMPORTANT]  
>Make sure to replace the **AKS_SUBNET** with the correct one from your cluster or else "*" will open your NFS Server to all ports and connections.

After you've created your VM, copy the script above into a file. Then, you can move it from your local machine, or wherever the script is, into the VM using: 
```console
scp /path/to/script_file username@vm-ip-address:/home/{username}
```
Once your script is in your VM, you can ssh into the VM and execute it via the command:
```console
sudo ./nfs-server-setup.sh
```
If its execution fails because of a permission denied error, set execution permission via the command:
```console
chmod +x ~/nfs-server-setup.sh
```

## Connecting AKS Cluster to NFS Server
We can connect the NFS Server to our cluster by provisioning a persistent volume and persistent volume claim that specifies how to access the volume.  
Connecting the two services in the same or peered virtual networks is necessary. Instructions for setting up the cluster in the same VNET are here: [creating AKS Cluster in existing VNET][aks-virtual-network]

Once they are in the same virtual network (or peered), you need to provision a persistent volume and a persistent volume claim in your AKS Cluster. The containers can then mount the NFS drive to their local directory.

Here is an example kubernetes definition for the persistent volume (This definition assumes your cluster and VM are in the same VNET):

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: <NFS_NAME>
  labels:
    type: nfs
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteMany
  nfs:
    server: <NFS_INTERNAL_IP>
    path: <NFS_EXPORT_FILE_PATH>
```
Replace **NFS_INTERNAL_IP**, **NFS_NAME** and **NFS_EXPORT_FILE_PATH** with NFS Server information.

You'll also need a persistent volume claim file. Here is an example of what to include:

>[!IMPORTANT]  
>**"storageClassName"** needs to remain an empty string or the claim won't work.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: <NFS_NAME>
spec:
  accessModes:
    - ReadWriteMany
  storageClassName: ""
  resources:
    requests:
      storage: 1Gi
  selector: 
    matchLabels:
      type: nfs
```

## Troubleshooting
If you can't connect to the server from a cluster, an issue might be the exported directory, or its parent, doesn't have sufficient permissions to access the server.

Check that both your export directory and its parent directory have 777 permissions.

You can check permissions by running the command below and the directories should have *'drwxrwxrwx'* permissions:
```console
ls -l
```

## More information
To get a full walkthrough or to help you debug your NFS Server setup, here is an in-depth tutorial:
  - [NFS Tutorial][nfs-tutorial]

## Next steps

For associated best practices, see [Best practices for storage and backups in AKS][operator-best-practices-storage].

<!-- LINKS - external -->
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/volumes/
[linux-create]: https://docs.microsoft.com/azure/virtual-machines/linux/tutorial-manage-vm
[nfs-tutorial]: https://help.ubuntu.com/community/SettingUpNFSHowTo#Pre-Installation_Setup
[aks-virtual-network]: https://docs.microsoft.com/azure/aks/configure-kubenet#create-an-aks-cluster-in-the-virtual-network
[peer-virtual-networks]: https://docs.microsoft.com/azure/virtual-network/tutorial-connect-virtual-networks-portal

<!-- LINKS - internal -->
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[operator-best-practices-storage]: operator-best-practices-storage.md
