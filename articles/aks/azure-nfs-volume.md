---
title: Manually create a Linux NFS Server persistent volume for Azure Kubernetes Service
titleSuffix: Azure Kubernetes Service
description: Learn how to manually create an Ubuntu Linux NFS Server persistent volume for use with pods in Azure Kubernetes Service (AKS)
author: ozboms
ms.topic: article
ms.date: 01/24/2024
ms.subservice: aks-storage
ms.author: obboms
---

# Manually create and use a Linux NFS (Network File System) Server with Azure Kubernetes Service (AKS)

Sharing data between containers is often a necessary component of container-based services and applications. You usually have various pods that need access to the same information on an external persistent volume. While [Azure Files][azure-files-overview] is an option, creating an NFS Server on an Azure VM is another form of persistent shared storage.

This article will show you how to create an NFS Server on an Azure Ubuntu virtual machine, and set up your AKS cluster with access to this shared file system as a persistent volume.

## Before you begin

This article assumes that you have the following to support this configuration:

* An existing AKS cluster. If you don't have an AKS cluster, for guidance on a designing an enterprise-scale implementation of AKS, see [Plan your AKS design][plan-aks-design].
* Your AKS cluster needs to be on the same or peered Azure virtual network (VNet) as the NFS Server. The cluster must be created on an existing VNet, which can be the same VNet as your NFS Server VM. The steps for configuring with an existing VNet are described in the following articles: [creating AKS Cluster in existing VNET][aks-virtual-network] and [connecting virtual networks with VNET peering][peer-virtual-networks].
* An Azure Ubuntu [Linux virtual machine][azure-linux-vm] running version 18.04 or later. To deploy a Linux VM on Azure, see [Create and manage Linux VMs][linux-create].

If you deploy your AKS cluster first, Azure automatically populates the virtual network settings when deploying your Azure Ubuntu VM, associating the Ubuntu VM on the same VNet. If you want to work with peered networks instead, consult the documentation above.

## Deploying the NFS Server onto a virtual machine

1. To deploy an NFS Server on the Azure Ubuntu virtual machine, copy the following Bash script and save it to your local machine. Replace the value for the variable **AKS_SUBNET** with the correct one from your AKS cluster, otherwise the default value specified opens your NFS Server to all ports and connections. In this article, the file is named `nfs-server-setup.sh`.

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

    The script initiates a restart of the NFS Server, and afterwards you can proceed with connecting to the NFS Server from your AKS cluster.

2. After creating your Linux VM, copy the file created in the previous step from your local machine to the VM using the following command:

    ```bash
    scp /path/to/nfs-server-setup.sh username@vm-ip-address:/home/{username}
    ```

3. After the file is copied over, open a secure shell (SSH) connection to the VM and execute the following command:

    ```bash
    sudo ./nfs-server-setup.sh
    ```

    If execution fails because of a permission denied error, set execution permission for all by running the following command:

    ```bash
    chmod +x ~/nfs-server-setup.sh
    ```

## Connecting AKS cluster to NFS Server

You can connect to the NFS Server from your AKS cluster by provisioning a persistent volume and persistent volume claim that specifies how to access the volume. Connecting the two resources in the same or peered virtual networks is necessary. To learn how to set up the cluster in the same VNet, see: [Creating AKS Cluster in existing VNet][aks-virtual-network].

Once both resources are on the same virtual or peered VNet, provision a persistent volume and a persistent volume claim in your AKS Cluster. The containers can then mount the NFS drive to their local directory.

1. Create a YAML manifest named *pv-azurefilesnfs.yaml* with a *PersistentVolume*. For example:

    ```yaml
    apiVersion: v1
    kind: PersistentVolume
    metadata:
      name: NFS_NAME
      labels:
        type: nfs
    spec:
      capacity:
        storage: 1Gi
      accessModes:
        - ReadWriteMany
      nfs:
        server: NFS_INTERNAL_IP
        path: NFS_EXPORT_FILE_PATH
    ```

    Replace the values for **NFS_INTERNAL_IP**, **NFS_NAME** and **NFS_EXPORT_FILE_PATH** with the actual settings from your NFS Server.

2. Create a YAML manifest named *pvc-azurefilesnfs.yaml* with a *PersistentVolumeClaim* that uses the *PersistentVolume*. For example:

    >[!IMPORTANT]  
    >**storageClassName** value needs to remain an empty string or the claim won't work.

    ```yaml
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: NFS_NAME
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

    Replace the value for **NFS_NAME** with the actual setting from your NFS Server.

## Troubleshooting

If you can't connect to the server from your AKS cluster, the issue might be the exported directory or its parent, doesn't have sufficient permissions to access the NFS Server VM.

Check that both your export directory and its parent directory are granted 777 permissions.

You can check permissions by running the following command and the directories should have *'drwxrwxrwx'* permissions:

```bash
ls -l
```

## Next steps

* For associated best practices, see [Best practices for storage and backups in AKS][operator-best-practices-storage].
* To learn more on setting up your NFS Server or to help debug issues, see the following tutorial from the Ubuntu community [NFS Tutorial][nfs-tutorial]

<!-- LINKS - external -->
[nfs-tutorial]: https://help.ubuntu.com/community/SettingUpNFSHowTo#Pre-Installation_Setup

<!-- LINKS - internal -->
[plan-aks-design]: /azure/architecture/reference-architectures/containers/aks-start-here?toc=/azure/aks/toc.json&bc=/azure/aks/breadcrumb/toc.json
[aks-virtual-network]: ./configure-kubenet.md#create-an-aks-cluster-in-the-virtual-network
[peer-virtual-networks]: ../virtual-network/tutorial-connect-virtual-networks-portal.md
[operator-best-practices-storage]: operator-best-practices-storage.md
[azure-linux-vm]: ../virtual-machines/linux/endorsed-distros.md
[linux-create]: ../virtual-machines/linux/tutorial-manage-vm.md
[azure-files-overview]: ../storage/files/storage-files-introduction.md
