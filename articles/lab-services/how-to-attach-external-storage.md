---
title: Use external file storage
titleSuffix: Azure Lab Services
description: Learn how to set up a lab that uses external file storage in Azure Lab Services.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 04/25/2023
---

# Use external file storage in Azure Lab Services

This article covers some of the options for using external file storage in Azure Lab Services. [Azure Files](https://azure.microsoft.com/services/storage/files/) offers fully managed file shares in the cloud, [accessible via SMB 2.1 and SMB 3.0](/azure/storage/files/storage-how-to-use-files-windows). An Azure Files share can be connected either publicly or privately within a virtual network. You can also configure the share to use a lab user’s Active Directory credentials for connecting to the file share. If you're on a Linux machine, you can also use Azure NetApp Files with NFS volumes for external file storage with Azure Lab Services.

## Which solution to use

The following table lists important considerations for each external storage solution.

|     Solution    |    Important to know    |
| -------------- | ------------------------ |
| [Azure Files share with public endpoint](#azure-files-share) | <ul><li>Everyone has read/write access.</li><li>No virtual network peering is required.</li><li>Accessible to all VMs, not just lab VMs.</li><li>If you're using Linux, lab users have access to the storage account key.</li></ul> |
| [Azure Files share with private endpoint](#azure-files-share) | <ul><li>Everyone has read/write access.</li><li>Virtual network peering is required.</li><li>Accessible only to VMs on the same network (or a peered network) as the storage account.</li><li>If you're using Linux, lab users have access to the storage account key.</li></ul> |
| [Azure NetApp Files with NFS volumes](#azure-netapp-files-with-nfs-volumes) | <ul><li>Either read or read/write access can be set for volumes.</li><li>Permissions are set by using a lab VM’s IP address.</li><li>Virtual network peering is required.</li><li>You might need to register to use the Azure NetApp Files service.</li><li>Linux only.</li></ul>

The cost of using external storage isn't included in the cost of using Azure Lab Services.  For more information about pricing, see [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/) and [Azure NetApp Files pricing](https://azure.microsoft.com/pricing/details/netapp/).

## Azure Files share

Azure Files shares are accessed by using a public or private endpoint. You mount the shares to a virtual machine by using the storage account key as the password. With this approach, everyone has read-write access to the file share.

By default, standard file shares can span up to 5 TiB. See [Create an Azure file share](/azure/storage/files/storage-how-to-create-file-share) for information on how to create file shares that span up to 100 TiB.

### Considerations for using a public endpoint

- The virtual network for the storage account doesn't have to be connected to the lab virtual network. You can create the file share anytime before the template VM is published.
- The file share can be accessed from any machine if a user has the storage account key.
- Linux lab users can see the storage account key. Credentials for mounting an Azure Files share are stored in `{file-share-name}.cred` on Linux VMs, and are readable by *sudo*. Because lab users are given sudo access by default in Azure Lab Services VMs, they can read the storage account key. If the storage account endpoint is public, lab users can get access to the file share outside of their lab VM. Consider rotating the storage account key after class has ended, or using private file shares.

### Considerations for using a private endpoint

- This approach requires the file share virtual network to be connected to the lab.  To enable advanced networking for labs, see [Connect to your virtual network in Azure Lab Services using vnet injection](how-to-connect-vnet-injection.md).  VNet injection must be done during lab plan creation.
- Access is restricted to traffic originating from the private network, and can’t be accessed through the public internet. Only VMs in the private virtual network, VMs in a network peered to the private virtual network, or machines connected to a VPN for the private network, can access the file share.
- Linux lab users can see the storage account key. Credentials for mounting an Azure Files share are stored in `{file-share-name}.cred` on Linux VMs, and are readable by *sudo*. Because lab users are given sudo access by default in Azure Lab Services VMs, they can read the storage account key. Consider rotating the storage account key after class has ended.

### Connect a lab VM to an Azure file share

Follow these steps to create a VM connected to an Azure file share.

1. Create an [Azure Storage account](/azure/storage/files/storage-how-to-create-file-share). On the **Connectivity method** page, choose **public endpoint** or **private endpoint**.

1. If you've chosen the private method, create a [private endpoint](/azure/private-link/tutorial-private-endpoint-storage-portal) in order for the file shares to be accessible from the virtual network.

1. Create an [Azure file share](/azure/storage/files/storage-how-to-create-file-share). The file share is reachable by the public host name of the storage account if using a public endpoint.  The file share is reachable by private IP address if using a private endpoint.

1. Mount the Azure file share in the template VM:

    - [Windows](/azure/storage/files/storage-how-to-use-files-windows)
    - [Linux](/azure/storage/files/storage-how-to-use-files-linux). To avoid mounting issues on lab VMs, see the [use Azure Files with Linux](#use-azure-files-with-linux) section.

1. [Publish](how-to-create-manage-template.md#publish-the-template-vm) the template VM.

> [!IMPORTANT]
> Make sure Windows Defender Firewall isn't blocking the outgoing SMB connection through port 445. By default, SMB is allowed for Azure VMs.

### Use Azure Files with Linux

If you use the default instructions to mount an Azure Files share, the file share will seem to disappear on lab VMs after the template is published. The following modified script addresses this issue.

For file share with a public endpoint:

```bash
#!/bin/bash

# Assign variables values for your storage account and file share
STORAGE_ACCOUNT_NAME=""
STORAGE_ACCOUNT_KEY=""
FILESHARE_NAME=""

# Do not use 'mnt' for mount directory.
# Using ‘mnt’ will cause issues on lab VMs.
MOUNT_DIRECTORY="prm-mnt" 

sudo mkdir /$MOUNT_DIRECTORY/$FILESHARE_NAME
if [ ! -d "/etc/smbcredentials" ]; then
    sudo mkdir /etc/smbcredentials
fi
if [ ! -f "/etc/smbcredentials/$STORAGE_ACCOUNT_NAME.cred" ]; then
    sudo bash -c "echo ""username=$STORAGE_ACCOUNT_NAME"" >> /etc/smbcredentials/$STORAGE_ACCOUNT_NAME.cred"
    sudo bash -c "echo ""password=$STORAGE_ACCOUNT_KEY"" >> /etc/smbcredentials/$STORAGE_ACCOUNT_NAME.cred"
fi
sudo chmod 600 /etc/smbcredentials/$STORAGE_ACCOUNT_NAME.cred

sudo bash -c "echo ""//$STORAGE_ACCOUNT_NAME.file.core.windows.net/$FILESHARE_NAME /$MOUNT_DIRECTORY/$FILESHARE_NAME cifs nofail,vers=3.0,credentials=/etc/smbcredentials/$STORAGE_ACCOUNT_NAME.cred,dir_mode=0777,file_mode=0777,serverino"" >> /etc/fstab"
sudo mount -t cifs //$STORAGE_ACCOUNT_NAME.file.core.windows.net/$FILESHARE_NAME /$MOUNT_DIRECTORY/$FILESHARE_NAME -o vers=3.0,credentials=/etc/smbcredentials/$STORAGE_ACCOUNT_NAME.cred,dir_mode=0777,file_mode=0777,serverino
```

For file share with a private endpoint:

```bash
#!/bin/bash

# Assign variables values for your storage account and file share
STORAGE_ACCOUNT_NAME=""
STORAGE_ACCOUNT_IP=""
STORAGE_ACCOUNT_KEY=""
FILESHARE_NAME=""

# Do not use 'mnt' for mount directory.
# Using ‘mnt’ will cause issues on lab VMs.
MOUNT_DIRECTORY="prm-mnt" 

sudo mkdir /$MOUNT_DIRECTORY/$FILESHARE_NAME
if [ ! -d "/etc/smbcredentials" ]; then
    sudo mkdir /etc/smbcredentials
fi
if [ ! -f "/etc/smbcredentials/$STORAGE_ACCOUNT_NAME.cred" ]; then
    sudo bash -c "echo ""username=$STORAGE_ACCOUNT_NAME"" >> /etc/smbcredentials/$STORAGE_ACCOUNT_NAME.cred"
    sudo bash -c "echo ""password=$STORAGE_ACCOUNT_KEY"" >> /etc/smbcredentials/$STORAGE_ACCOUNT_NAME.cred"
fi
sudo chmod 600 /etc/smbcredentials/$storage_account_name.cred

sudo bash -c "echo ""//$STORAGE_ACCOUNT_IP/$FILESHARE_NAME /$MOUNT_DIRECTORY/$fileshare_name cifs nofail,vers=3.0,credentials=/etc/smbcredentials/$STORAGE_ACCOUNT_NAME.cred,dir_mode=0777,file_mode=0777,serverino"" >> /etc/fstab"
sudo mount -t cifs //$STORAGE_ACCOUNT_NAME.file.core.windows.net/$FILESHARE_NAME /$MOUNT_DIRECTORY/$FILESHARE_NAME -o vers=3.0,credentials=/etc/smbcredentials/$STORAGE_ACCOUNT_NAME.cred,dir_mode=0777,file_mode=0777,serverino
```

If the template VM that mounts the Azure Files share to the `/mnt` directory is already published, the lab user can either:

- Move the instruction to mount `/mnt` to the top of the `/etc/fstab` file.  
- Modify the instruction to mount `/mnt/{file-share-name}` to a different directory, like `/prm-mnt/{file-share-name}`.

Lab users should run `mount -a` to remount directories.

For more general information, see [Use Azure Files with Linux](/azure/storage/files/storage-how-to-use-files-linux).

## Azure NetApp Files with NFS volumes

[Azure NetApp Files](https://azure.microsoft.com/services/netapp/) is an enterprise-class, high-performance, metered file storage service.

- Set access policies on a per-volume basis
- Permission policies are IP-based for each volume
- If lab users need their own volume that other lab users don't have access to, permission policies must be assigned after the lab is published
- Azure Lab Services only supports Linux-based lab virtual machines to connect to Azure NetApp Files
- The virtual network for the Azure NetApp Files capacity pool must be connected to the lab.  To enable advanced networking for labs, see [Connect to your virtual network in Azure Lab Services using vnet injection](how-to-connect-vnet-injection.md).  VNet injection must be done during lab plan creation.

To use an Azure NetApp Files share in Azure Lab Services:

1. Create an Azure NetApp Files capacity pool and one or more NFS volumes by following the steps in [Set up Azure NetApp Files and NFS volume](/azure/azure-netapp-files/azure-netapp-files-quickstart-set-up-account-create-volumes).

    For information about service levels, see [Service levels for Azure NetApp Files](/azure/azure-netapp-files/azure-netapp-files-service-levels).

1. [Connect to your virtual network in Azure Lab Services](how-to-connect-vnet-injection.md)

1. [Create the lab](how-to-manage-labs.md).

1. On the template VM, install the components necessary to use NFS file shares.

    - Ubuntu:

        ```bash
        sudo apt update
        sudo apt install nfs-common
        ```

    - CentOS:

        ```bash
        sudo yum install nfs-utils
        ```

1. On the template VM, save the following script as `mount_fileshare.sh` to [mount the Azure NetApp Files share](/azure/azure-netapp-files/azure-netapp-files-mount-unmount-volumes-for-virtual-machines).

    Assign the `capacity_pool_ipaddress` variable the mount target IP address for the capacity pool. Get the mount instructions for the volume to find the appropriate value. The script expects the path name of the Azure NetApp Files volume.
	
	To ensure that users can run the script, run `chmod u+x mount_fileshare.sh`.

    ```bash
    #!/bin/bash
    
    if [ $# -eq 0 ];  then
        echo "Must provide volume name."
        exit 1
    fi
    
    VOLUME_NAME=$1
    CAPACITY_POOL_IP_ADDR=0.0.0.0 # IP address of capacity pool
    
    # Do not use 'mnt' for mount directory.
    # Using ‘mnt’ might cause issues on lab VMs.
    MOUNT_DIRECTORY="prm-mnt" 
    
    sudo mkdir -p /$MOUNT_DIRECTORY
    sudo mkdir /$MOUNT_DIRECTORY/$FOLDER_NAME
    
    sudo mount -t nfs -o rw,hard,rsize=65536,wsize=65536,vers=3,tcp $CAPACITY_POOL_IP_ADDR:/$VOLUME_NAME /$MOUNT_DIRECTORY/$VOLUME_NAME
    sudo bash -c "echo ""$CAPACITY_POOL_IP_ADDR:/$VOLUME_NAME /$MOUNT_DIRECTORY/$VOLUME_NAME nfs bg,rw,hard,noatime,nolock,rsize=65536,wsize=65536,vers=3,tcp,_netdev 0 0"" >> /etc/fstab"
    ```

1. If all lab users are sharing access to the same Azure NetApp Files volume, you can run the `mount_fileshare.sh` script on the template machine before publishing. If lab users each get their own volume, save the script to be run later by the lab user.

1. [Publish](how-to-create-manage-template.md#publish-the-template-vm) the template VM.

1. [Configure the policy](/azure/azure-netapp-files/azure-netapp-files-configure-export-policy) for the file share. 

    The export policy can allow for a single VM or multiple VMs to have access to a volume. You can grant read-only or read/write access.

1. Lab users must start their VM and run the script to mount the file share. They have to run the script only once.

    The command looks like the following: `./mount_fileshare.sh myvolumename`.

## Next steps

- Learn how to [create a lab for classroom training](./tutorial-setup-lab.md)
- Get started by following the steps in [Quickstart: Create and connect to a lab](./quick-create-connect-lab.md)
- [Create and manage a template](how-to-create-manage-template.md)
