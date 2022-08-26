---
title: Use external file storage in Azure Lab Services | Microsoft Docs
description: Learn how to set up a lab that uses external file storage in Lab Services. 
author: emaher
ms.topic: how-to
ms.date: 03/30/2021
ms.author: enewman
---

# Use external file storage in Lab Services

This article covers some of the options for external file storage when you use Azure Lab Services. [Azure Files](https://azure.microsoft.com/services/storage/files/) offers fully managed file shares in the cloud, [accessible via SMB 2.1 and SMB 3.0](../storage/files/storage-how-to-use-files-windows.md). An Azure Files share can be connected either publicly or privately within a virtual network. You can also configure the share to use a student’s Active Directory credentials for connecting to the file share. If you're on a Linux machine, you can also use Azure NetApp Files with NFS volumes for external file storage with Azure Lab Services.  

## Which solution to use

Each solution has different requirements and abilities. The following table lists important points to consider for each solution.  

|     Solution    |    Important to know    |
| -------------- | ------------------------ |
| [Azure Files share with public endpoint](#azure-files-share) | <ul><li>Everyone has read/write access.</li><li>No virtual network peering is required.</li><li>Accessible to all VMs, not just lab VMs.</li><li>If you're using Linux, students will have access to the storage account key.</li></ul> |
| [Azure Files share with private endpoint](#azure-files-share) | <ul><li>Everyone has read/write access.</li><li>Virtual network peering is required.</li><li>Accessible only to VMs on the same network (or a peered network) as the storage account.</li><li>If you're using Linux, students will have access to the storage account key.</li></ul> |
| [Azure Files with identity-based authorization](#azure-files-with-identity-based-authorization) | <ul><li>Either read or read/write access permissions can be set for folder or file.</li><li>Virtual network peering is required.</li><li>Storage account must be connected to Active Directory.</li><li>Lab VMs must be domain-joined.</li><li>Storage account key isn't used for students to connect to the file share.</li></ul> |
| [Azure NetApp Files with NFS volumes](#azure-netapp-files-with-nfs-volumes) | <ul><li>Either read or read/write access can be set for volumes.</li><li>Permissions are set by using a student VM’s IP address.</li><li>Virtual network peering is required.</li><li>You might need to register to use the Azure NetApp Files service.</li><li>Linux only.</li></ul>

The cost of using external storage isn't included in the cost of using Azure Lab Services.  For more information about pricing, see [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/) and [Azure NetApp Files pricing](https://azure.microsoft.com/pricing/details/netapp/).

## Azure Files share

Azure Files shares are accessed by using a public or private endpoint. Mount the shares by using the storage account key as the password. With this approach, everyone has read-write access to the file share.

If you're using a public endpoint to the Azure Files share, it's important to remember the following:

- The virtual network for the storage account doesn't have to be connected to the lab virtual network. You can create the file share anytime before the template VM is published.
- The file share can be accessed from any machine if a user has the storage account key.  
- Linux students can see the storage account key. Credentials for mounting an Azure Files share are stored in `{file-share-name}.cred` on Linux VMs, and are readable by sudo. Because students are given sudo access by default in Azure Lab Services VMs, they can read the storage account key. If the storage account endpoint is public, students can get access to the file share outside of their student VM. Consider rotating the storage account key after class has ended, and using private file shares.

If you're using a private endpoint to the Azure Files share, it's important to remember the following:

- Access is restricted to traffic originating from the private network, and can’t be accessed through the public internet. Only VMs in the private virtual network, VMs in a network peered to the private virtual network, or machines connected to a VPN for the private network, can access the file share.  
- Linux students can see the storage account key. Credentials for mounting an Azure Files share are stored in `{file-share-name}.cred` on Linux VMs, and are readable by sudo. Because students are given sudo access by default in Azure Lab Services VMs, they can read the storage account key. Consider rotating the storage account key after class has ended.
- This approach requires the file share virtual network to be connected to the lab.  To enable advanced networking for labs, see [Connect to your virtual network in Azure Lab Services using vnet injection](how-to-connect-vnet-injection.md).  VNet injection must be done during lab plan creation.

> [!NOTE]
> By default, standard file shares can span up to 5 TiB. See [Create an Azure file share](../storage/files/storage-how-to-create-file-share.md) for information on how to create file shares than span up to 100 TiB.

Follow these steps to create a VM connected to an Azure file share.

1. Create an [Azure Storage account](../storage/files/storage-how-to-create-file-share.md). On the **Connectivity method** page, choose **public endpoint** or **private endpoint**.
2. If you've chosen the private method, create a [private endpoint](../private-link/tutorial-private-endpoint-storage-portal.md) in order for the file shares to be accessible from the virtual network.
3. Create an [Azure file share](../storage/files/storage-how-to-create-file-share.md). The file share is reachable by the public host name of the storage account if using a public endpoint.  The file share is reachable by private IP address if using a private endpoint.  
4. Mount the Azure file share in the template VM:
    - [Windows](../storage/files/storage-how-to-use-files-windows.md)
    - [Linux](../storage/files/storage-how-to-use-files-linux.md). To avoid mounting issues on student VMs, see the [use Azure Files with Linux](#use-azure-files-with-linux) section.
5. [Publish](how-to-create-manage-template.md#publish-the-template-vm) the template VM.

> [!IMPORTANT]
> Make sure Windows Defender Firewall isn't blocking the outgoing SMB connection through port 445. By default, SMB is allowed for Azure VMs.

### Use Azure Files with Linux

If you use the default instructions to mount an Azure Files share, the file share will seem to disappear on student VMs after the template is published. The following modified script addresses this issue.  

For file share with a public endpoint:

```bash
#!/bin/bash

# Assign variables values for your storage account and file share
storage_account_name=""
storage_account_key=""
fileshare_name=""

# Do not use 'mnt' for mount directory.
# Using ‘mnt’ will cause issues on student VMs.
mount_directory="prm-mnt" 

sudo mkdir /$mount_directory/$fileshare_name
if [ ! -d "/etc/smbcredentials" ]; then
    sudo mkdir /etc/smbcredentials
fi
if [ ! -f "/etc/smbcredentials/$storage_account_name.cred" ]; then
    sudo bash -c "echo ""username=$storage_account_name"" >> /etc/smbcredentials/$storage_account_name.cred"
    sudo bash -c "echo ""password=$storage_account_key"" >> /etc/smbcredentials/$storage_account_name.cred"
fi
sudo chmod 600 /etc/smbcredentials/$storage_account_name.cred

sudo bash -c "echo ""//$storage_account_name.file.core.windows.net/$fileshare_name /$mount_directory/$fileshare_name cifs nofail,vers=3.0,credentials=/etc/smbcredentials/$storage_account_name.cred,dir_mode=0777,file_mode=0777,serverino"" >> /etc/fstab"
sudo mount -t cifs //$storage_account_name.file.core.windows.net/$fileshare_name /$mount_directory/$fileshare_name -o vers=3.0,credentials=/etc/smbcredentials/$storage_account_name.cred,dir_mode=0777,file_mode=0777,serverino
```

For file share with a private endpoint:

```bash
#!/bin/bash

# Assign variables values for your storage account and file share
storage_account_name=""
storage_account_ip=""
storage_account_key=""
fileshare_name=""

# Do not use 'mnt' for mount directory.
# Using ‘mnt’ will cause issues on student VMs.
mount_directory="prm-mnt" 

sudo mkdir /$mount_directory/$fileshare_name
if [ ! -d "/etc/smbcredentials" ]; then
    sudo mkdir /etc/smbcredentials
fi
if [ ! -f "/etc/smbcredentials/$storage_account_name.cred" ]; then
    sudo bash -c "echo ""username=$storage_account_name"" >> /etc/smbcredentials/$storage_account_name.cred"
    sudo bash -c "echo ""password=$storage_account_key"" >> /etc/smbcredentials/$storage_account_name.cred"
fi
sudo chmod 600 /etc/smbcredentials/$storage_account_name.cred

sudo bash -c "echo ""//$storage_account_ip/$fileshare_name /$mount_directory/$fileshare_name cifs nofail,vers=3.0,credentials=/etc/smbcredentials/$storage_account_name.cred,dir_mode=0777,file_mode=0777,serverino"" >> /etc/fstab"
sudo mount -t cifs //$storage_account_name.file.core.windows.net/$fileshare_name /$mount_directory/$fileshare_name -o vers=3.0,credentials=/etc/smbcredentials/$storage_account_name.cred,dir_mode=0777,file_mode=0777,serverino
```

If the template VM that mounts the Azure Files share to the `/mnt` directory is already published, the student can either:

- Move the instruction to mount `/mnt` to the top of the `/etc/fstab` file.  
- Modify the instruction to mount `/mnt/{file-share-name}` to a different directory, like `/prm-mnt/{file-share-name}`.

Students should run `mount -a` to remount directories.

For more general information, see [Use Azure Files with Linux](../storage/files/storage-how-to-use-files-linux.md).

## Azure Files with identity-based authorization

Azure Files shares can also be accessed by using Active Directory authentication, if the following are both true:

- The student's VM is domain-joined.
- Active Directory authentication is [enabled on the Azure Storage account](../storage/files/storage-files-active-directory-overview.md) that hosts the file share.  

The network drive is mounted on the virtual machine by using the user’s identity, not the key to the storage account. Public or private endpoints provide access to the storage account.

Keep in mind the following important points:

- You can set permissions on a directory or file level.
- You can use current user credentials to authenticate to the file share.

For a public endpoint, the virtual network for the storage account doesn't have to be connected to the lab virtual network. You can create the file share anytime before the template VM is published.

For a private endpoint:

- Access is restricted to traffic originating from the private network, and can’t be accessed through the public internet. Only VMs in the private virtual network, VMs in a network peered to the private virtual network, or machines connected to a VPN for the private network, can access the file share.  
- This approach requires the file share virtual network to be connected to the lab.  To enable advanced networking for labs, see [Connect to your virtual network in Azure Lab Services using vnet injection](how-to-connect-vnet-injection.md).  VNet injection must be done during lab plan creation.

To create an Azure Files share that's enabled for Active Directory authentication, and to domain-join the lab VMs, follow these steps:

1. Create an [Azure Storage account](../storage/files/storage-how-to-create-file-share.md).
2. If you've chosen the private method, create a [private endpoint](../private-link/tutorial-private-endpoint-storage-portal.md) in order for the file shares to be accessible from the virtual network. Create a [private DNS zone](../dns/private-dns-privatednszone.md), or use an existing one. Private Azure DNS zones provide name resolution within a virtual network.
3. Create an [Azure file share](../storage/files/storage-how-to-create-file-share.md).
4. Follow the steps to enable identity-based authorization. If you're using Active Directory on-premises, and you're synchronizing it with Azure Active Directory (Azure AD), see [On-premises Active Directory Domain Services authentication over SMB for Azure file shares](../storage/files/storage-files-identity-auth-active-directory-enable.md). If you're using only  Azure AD, see [Enable Azure Active Directory Domain Services authentication on Azure Files](../storage/files/storage-files-identity-auth-active-directory-domain-service-enable.md).
    >[!IMPORTANT]
    >Talk to the team that manages your Active Directory instance to verify that all prerequisites listed in the instructions are met.
5. Assign SMB share permission roles in Azure. For details about permissions that are granted to each role, see [share-level permissions](../storage/files/storage-files-identity-ad-ds-assign-permissions.md).
    - **Storage File Data SMB Share Elevated Contributor** role must be assigned to the person or group that will set up permissions for contents of the file share.
    - **Storage File Data SMB Share Contributor** role should be assigned to students who need to add or edit files on the file share.
    - **Storage File Data SMB Share Reader** role should be assigned to students who only need to read the files from the file share.
6. Set up directory-level and/or file-level permissions for the file share. You must set up permissions from a domain-joined machine that has network access to the file share. To modify directory-level and/or file-level permissions, mount the file share by using the storage key, not your Azure AD credentials. To assign permissions, use the [Set-Acl](/powershell/module/microsoft.powershell.security/set-acl) PowerShell command, or [icacls](/windows-server/administration/windows-commands/icacls) in Windows.
7. [Connect to your virtual network in Azure Lab Services](how-to-connect-vnet-injection.md).
8. [Create the lab](how-to-manage-labs.md).
9. Save a script on the template VM that students can run to connect to the network drive. To get example script:
    1. Open the storage account in the Azure portal.
    1. Under **File Service**, select **File Shares**.
    1. Find the share that you want to connect to, select the ellipses button on the far right, and choose **Connect**.
    1. You'll see instructions for Windows, Linux, and macOS. If you're using Windows, set **Authentication method** to **Active Directory**.
    1. Copy the code in the example, and save it on the template machine in a `.ps1` file for Windows, or an `.sh` file for Linux.
10. On the template machine, download and run the script to [join student machines to the domain](https://aka.ms/azlabs/scripts/ActiveDirectoryJoin). The `Join-AzLabADTemplate` script [publishes the template VM](how-to-create-manage-template.md#publish-the-template-vm) automatically.  
    > [!NOTE]
    > The template machine isn't domain-joined. To view files on the share, educators need to use a student VM for themselves.
11. Students using Windows can connect to the Azure Files share by using [File Explorer](../storage/files/storage-how-to-use-files-windows.md) with their credentials, after they've been given the path to the file share. Alternately, students can run the preceding script to connect to the network drive. For students who are using Linux, run the preceding script.

## Azure NetApp Files with NFS volumes

[Azure NetApp Files](https://azure.microsoft.com/services/netapp/) is an enterprise-class, high-performance, metered file storage service.

- Access policies can be set on a per-volume basis.
- Permission policies are IP-based for each volume.
- If students need their own volume that other students don't have access to, permission policies must be assigned after the lab is published.
- In the context of Azure Lab Services, only Linux machines are supported.
- The virtual network for the Azure NetApp Files capacity pool must be connected to the lab.  To enable advanced networking for labs, see [Connect to your virtual network in Azure Lab Services using vnet injection](how-to-connect-vnet-injection.md).  VNet injection must be done during lab plan creation.

To use an Azure NetApp Files share in Azure Lab Services:

1. To create an Azure NetApp Files capacity pool and one or more NFS volumes, see [set up Azure NetApp Files and NFS volume](../azure-netapp-files/azure-netapp-files-quickstart-set-up-account-create-volumes.md). For information about service levels, see [Service levels for Azure NetApp Files](../azure-netapp-files/azure-netapp-files-service-levels.md).
2. [Connect to your virtual network in Azure Lab Services](how-to-connect-vnet-injection.md)
3. [Create the lab](how-to-manage-labs.md).
4. On the template VM, install the components necessary to use NFS file shares.
    - Ubuntu:

        ```bash
        sudo apt update
        sudo apt install nfs-common
        ```

    - CentOS:

        ```bash
        sudo yum install nfs-utils
        ```

5. On the template VM, save the following script as `mount_fileshare.sh` to [mount the Azure NetApp Files share](../azure-netapp-files/azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md). Assign the `capacity_pool_ipaddress` variable the mount target IP address for the capacity pool. Get the mount instructions for the volume to find the appropriate value. The script expects the path name of the Azure NetApp Files volume. To ensure that users can run the script, run `chmod u+x mount_fileshare.sh`.

    ```bash
    #!/bin/bash
    
    if [ $# -eq 0 ];  then
        echo "Must provide volume name."
        exit 1
    fi
    
    volume_name=$1
    capacity_pool_ipaddress=0.0.0.0 # IP address of capacity pool
    
    # Do not use 'mnt' for mount directory.
    # Using ‘mnt’ might cause issues on student VMs.
    mount_directory="prm-mnt" 
    
    sudo mkdir -p /$mount_directory
    sudo mkdir /$mount_directory/$folder_name
    
    sudo mount -t nfs -o rw,hard,rsize=65536,wsize=65536,vers=3,tcp $capacity_pool_ipaddress:/$volume_name /$mount_directory/$volume_name
    sudo bash -c "echo ""$capacity_pool_ipaddress:/$volume_name /$mount_directory/$volume_name nfs bg,rw,hard,noatime,nolock,rsize=65536,wsize=65536,vers=3,tcp,_netdev 0 0"" >> /etc/fstab"
    ```

6. If all students are sharing access to the same Azure NetApp Files volume, you can run the `mount_fileshare.sh` script on the template machine before publishing. If students each get their own volume, save the script to be run later by the student.
7. [Publish](how-to-create-manage-template.md#publish-the-template-vm) the template VM.
8. [Configure the policy](../azure-netapp-files/azure-netapp-files-configure-export-policy.md) for the file share. The export policy can allow for a single VM or multiple VMs to have access to a volume. You can grant read-only or read/write access.
9. Students must start their VM and run the script to mount the file share. They'll only have to run the script once. The command will look like the following: `./mount_fileshare.sh myvolumename`.

## Next steps

These steps are common to setting up any lab.

- [Create and manage a template](how-to-create-manage-template.md)
- [Add users](tutorial-setup-lab.md#add-users-to-the-lab)
- [Set quota](how-to-configure-student-usage.md#set-quotas-for-users)
- [Set a schedule](tutorial-setup-lab.md#set-a-schedule-for-the-lab)
- [Email registration links to students](how-to-configure-student-usage.md#send-invitations-to-users)
