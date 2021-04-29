---
title: Using external file storage in Lab Services | Microsoft Docs
description: Learn how to set up a lab that uses external file storage in Lab Services. 
author: emaher
ms.topic: article
ms.date: 03/30/2021
ms.author: enewman
---

# Using external file storage in Lab Services

This article will cover some of the options for external file storage when using Azure Lab Services.  [Azure Files](https://azure.microsoft.com/services/storage/files/) offers fully managed file shares in the cloud [accessible via SMB 2.1 and SMB 3.0.](../storage/files/storage-how-to-use-files-windows.md)  An Azure Files share can be connected either publicly or privately within a virtual network.  Also, it can be configured to use student’s AD credentials for connecting to the file share.  Using Azure NetApp Files with NFS volumes for Linux machines is another option for external file storage with Azure Lab Services.  

## Deciding which solution to use

Each solution has different requirements and abilities.  The table below lists important points to consider for each solution.  

|     Solution    |    Important to know    |
| -------------- | ------------------------ |
| [Azure Files share with public endpoint](#azure-files-share) | <ul><li>Everyone has read/write access.</li><li>No vnet peering required.</li><li>Accessible to all VMs, not just lab VMs.</li><li>If using Linux, students will have access to the storage account key.</li></ul> |
| [Azure Files share with private endpoint](#azure-files-share) | <ul><li>Everyone has read/write access.</li><li>Vnet peering required.</li><li>Accessible only to VMs on same network (or peered network) as storage account.</li><li>If using Linux, students will have access to the Storage Account key.</li></ul> |
| [Azure Files with identity-base authorization](#azure-files-with-identity-base-authorization) | <ul><li>Either read or read/write access permissions can be set for folder or file.</li><li>Vnet peering required.</li><li>Storage account must be connected to Active Directory.</li><li>Lab VMs must be domain-joined.</li><li>Storage Account key not used for students to connect to the file share.</li></ul> |
| [NetApp Files with NFS volumes](#netapp-files-with-nfs-volumes) | <ul><li>Either read or read/write access can be set for volumes.</li><li>Permissions are set using student VM’s ip address.</li><li>Vnet peering required.</li><li>May need to register to use NetApp Files service.</li><li>Linux only.</li></ul>

Cost of using external storage is not included in the cost of using Azure Lab Services.  For more information about pricing, see [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/) and [Azure NetApp Files pricing](https://azure.microsoft.com/pricing/details/netapp/).

## Azure Files share

Azure File shares are accessed using a public or private endpoint.  Azure File shares are mounted using the storage account key as the password.  With this approach, everyone has read-write access to the file share.

If using a public endpoint to the Azure Files share, it is important to remember:

- Virtual network for the storage account doesn't have to be peered to the lab account.  The file share can be created anytime before the template VM is published.
- The file share can be accessed from any machine if a user has the storage account key.  
- Linux students can see the storage account key.  Credentials for mounting an Azure Files share are stored in `{file-share-name}.cred` on Linux VMs and readable by sudo.  Since students are given sudo access by default in Azure Lab Service VMs, they can read the storage account key.  If the storage account endpoint is public, students can get access to the file share outside of their student VM.  Consider rotating the storage account key after class has ended and using private file shares.

If using a private endpoint to the Azure Files share, it's important to remember:

- Access is restricted to traffic originating from the private network and can’t be accessed through the public internet.  Only VMs in the private virtual network, VMs in a network peered to the private virtual network or machines connected to a VPN for the private network can access the file share.  
- Linux students can see the storage account key.  Credentials for mounting an Azure Files share are stored in `{file-share-name}.cred` on Linux VMs and readable by sudo.  Since students are given sudo access by default in Azure Lab Service VMs, they can read the storage account key.  Consider rotating the storage account key after class has ended.
- This approach requires the file share virtual network to be peered to the lab account.  The virtual network for the Azure Storage account must be peered to the virtual network for the lab account **before** the lab is created.

> [!NOTE]
> File shares larger than 5TB are only available for [[locally-redundant storage (LRS) accounts]](../storage/files/storage-files-how-to-create-large-file-share.md#restrictions).

Follow these steps to create a VM connected to an Azure File share.

1. Create an [Azure Storage Account](../storage/files/storage-how-to-create-file-share.md). On 'connectivity method' page, choose public endpoint or private endpoint.
2. If using, create a [private endpoint](../private-link/tutorial-private-endpoint-storage-portal.md) in order for the file shares to be accessible from the virtual network.  Create a [private DNS zone](../dns/private-dns-privatednszone.md) or use an existing one. Private Azure DNS zones provide name resolution within a virtual network.
3. Create an [Azure file share](../storage/files/storage-how-to-create-file-share.md). The file share is reachable by the public host name of the storage account.
4. Mount the Azure file share in the template VM:
    - [[Windows]](../storage/files/storage-how-to-use-files-windows.md)
    - [[Linux]](../storage/files/storage-how-to-use-files-linux.md).  See [Using Azure Files with Linux](#using-azure-files-with-linux) to avoid mounting issues on student VMs.
5. [Publish](how-to-create-manage-template.md#publish-the-template-vm) the template VM.

> [!IMPORTANT]
> Make sure Firewall is not blocking outgoing SMB connection through port 445. By default, SMB is allowed for Azure VMs.

### Using Azure Files with Linux

If you use the _default instructions_ to mount an Azure file share, the file share will seem to disappear on student VMs once the template is published.  Below is modified script that addresses this issue.  

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

If the template VM is already published that mounts the Azure File share to the `/mnt` directory, the student can do one of the following.

- Move the instruction to mount `/mnt` to the top of the `/etc/fstab` file.  
- Modify the instruction to mount `/mnt/{file-share-name}` to different directory like `/prm-mnt/{file-share-name}`.

Students should run `mount -a` to remount directories.

For more general information about using file shares with Linux, see [use Azure Files with Linux](../storage/files/storage-how-to-use-files-linux.md).

## Azure Files with identity-base authorization

Azure Files shares can also be accessed using AD authentication if

1. The student VM is domain-joined.
2. AD authentication is [enabled on the Azure Storage Account](../storage/files/storage-files-active-directory-overview.md) that hosts the file share.  

The network drive is mounted on the virtual machine using the user’s identity, not the key to the storage account.  Access to the storage account can use public or private endpoints.

Let’s go over some important points of this approach.

- Permissions can be set on a directory or file level.
- Current user credentials are used to authenticate to the file share.

If using a public endpoint to the Azure Files share, it's important to remember:

- Virtual network for the storage account doesn't have to peer to the lab account.  The file share can be created anytime before the template VM is published.

If using a private endpoint to the Azure Files share, it's important to remember:

- Access is restricted to traffic originating from the private network and can’t be accessed through the public internet.  Only VMs in the private virtual network, VMs in a network peered to the private virtual network or machines connected to a VPN for the private network can access the file share.  
- This approach requires the file share virtual network to be peered to the lab account.  The virtual network for the Azure Storage account must be peered to the virtual network for the lab account **before** the lab is created.

Follow the steps below to create an AD authentication enabled Azure Files share and domain join the lab VMs.

1. Create an [Azure Storage Account](../storage/files/storage-how-to-create-file-share.md).
2. If using, create a [private endpoint](../private-link/tutorial-private-endpoint-storage-portal.md) in order for the file shares to be accessible from the virtual network.  Create a [private DNS zone](../dns/private-dns-privatednszone.md) or use an existing one. Private Azure DNS zones provide name resolution within a virtual network.
3. Create an [Azure file share](../storage/files/storage-how-to-create-file-share.md).
4. Follow steps to enable identity-based authorization.  If using on-prem AD that is synced to Azure AD, follow steps for [on-premises Active Directory Domain Services authentication over SMB for Azure file shares](../storage/files/storage-files-identity-auth-active-directory-enable.md).  If only using Azure AD, follow steps to [enable Azure Active Directory Domain Services authentication on Azure Files](../storage/files/storage-files-identity-auth-active-directory-domain-service-enable.md).
    >[!IMPORTANT]
    >Talk to the team that manages your AD to verify all prerequisites listed in the instructions are met.
5. Assign SMB share permission roles in Azure.  For details about permissions that are granted to each role, see [share-level permissions](../storage/files/storage-files-identity-ad-ds-assign-permissions.md).
    1. ‘Storage File Data SMB Share Elevated Contributor’ role must be assigned to the person or group that will set up permissions for contents of the file share.
    2. ‘Storage File Data SMB Share Contributor’ role should be assigned to students that need to add or edit files on the file share.
    3. ‘Storage File Data SMB Share Reader’ role should be assigned to students that will only need to read the files from the file share.
6. Set up directory/file-level permissions for the file share.  Permissions must set up from a domain-joined machine that has network access to the file share.  **To modify directory/file-level permissions, mount the file share using the storage key, not your AAD credentials.**  [Set-Acl](/powershell/module/microsoft.powershell.security/set-acl) PowerShell command or [icacls](/windows-server/administration/windows-commands/icacls) are the recommend tools to use when assigning permissions.
7. [Peer the virtual network](how-to-connect-peer-virtual-network.md) for the storage account to the lab account.
8. [Create the classroom lab](how-to-manage-classroom-labs.md).
9. Save a script on the template VM that students can run to connect to the network drive.  To get example script:
    1. Open the storage account in the Azure portal.
    1. Select **File Shares** under **File Service** on the menu.
    1. Find the share that you want to connect to, select the ellipses button on the far right, and choose **Connect**.
    1. The **Connect** fly out will open with instructions for Windows, Linux, and macOS.  If using Windows, set the **Authentication method** to **Active Directory**.
    1. Copy the code in the example and save it on the template machine in a `.ps1` file for windows or `.sh` file for Linux.
10. On the template machine, download and run script to [join student machines to the domain](https://github.com/Azure/azure-devtestlab/blob/master/samples/ClassroomLabs/Scripts/ActiveDirectoryJoin/README.md#usage).  The `Join-AzLabADTemplate` script will [publish the template VM](how-to-create-manage-template.md#publish-the-template-vm) automatically.  
    > [!NOTE]
    > The template machine will not be domain-joined. Instructors should assign a published student VM for themselves to view files on the share.
11. Students using windows can connect to the Azure Files share using [File Explorer](../storage/files/storage-how-to-use-files-windows.md) with their credentials once given the path to the file share.  Alternately, students can run the script created above to connect to the network drive.  For students using Linux, run the script created above.

## NetApp Files with NFS volumes

[Azure NetApp Files](https://azure.microsoft.com/services/netapp/) is an enterprise-class, high-performance, metered file storage service.

- Access policies can be set on a per-volume basis.
- Permission policies are IP-based for each volume.
- If students need their own volume that other students don't have access to, permission policies must be assigned after the lab is published.
- In the context of Azure Lab Services, only Linux machines are supported.
- The virtual network for the Azure NetApp Files capacity pool must be peered to the virtual network for the lab account **before** the lab is created.

Follow the steps below to use an Azure NetApp Files share in Azure Lab Services.

1. Onboard to [Azure NetApp Files](https://aka.ms/azurenetappfiles), if needed.
2. To create a NetApp Files capacity pool and NFS volume(s), see [set up Azure NetApp Files and NFS volume](../azure-netapp-files/azure-netapp-files-quickstart-set-up-account-create-volumes.md).  For information about service levels, see [service levels for Azure NetApp Files](../azure-netapp-files/azure-netapp-files-service-levels.md).
3. [Peer the virtual network](how-to-connect-peer-virtual-network.md) for the NetApp Files capacity pool to the lab account.
4. [Create the classroom lab](how-to-manage-classroom-labs.md).
5. On the template VM, install necessary components to use NFS file shares.
    - Ubuntu:

        ```bash
        sudo apt update
        sudo apt install nfs-common
        ```

    - CentOS

        ```bash
        sudo yum install nfs-utils
        ```

6. On the template VM, save script below as `mount_fileshare.sh` to [mount the NetApp Files share](../azure-netapp-files/azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md).  Assign the `capacity_pool_ipaddress` variable the mount target IP address for the capacity pool.  Get the mount instructions for the volume to find the appropriate value.  The script expects the path/name of the NetApp Files volume.  Don’t forget to run `chmod u+x mount_fileshare.sh` to ensure script can be executed by users.

    ```bash
    #!/bin/bash
    
    if [ $# -eq 0 ];  then
        echo "Must provide volume name."
        exit 1
    fi
    
    volume_name=$1
    capacity_pool_ipaddress=0.0.0.0 # IP address of capacity pool
    
    # Do not use 'mnt' for mount directory.
    # Using ‘mnt’ may cause issues on student VMs.
    mount_directory="prm-mnt" 
    
    sudo mkdir -p /$mount_directory
    sudo mkdir /$mount_directory/$folder_name
    
    sudo mount -t nfs -o rw,hard,rsize=65536,wsize=65536,vers=3,tcp $capacity_pool_ipaddress:/$volume_name /$mount_directory/$volume_name
    sudo bash -c "echo ""$capacity_pool_ipaddress:/$volume_name /$mount_directory/$volume_name nfs bg,rw,hard,noatime,nolock,rsize=65536,wsize=65536,vers=3,tcp,_netdev 0 0"" >> /etc/fstab"
    ```

7. If all students are sharing access to the same NetApp Files volume, the `mount_fileshare.sh` script can be run on the template machine before publishing.  If students each get their own volume, save script to be run later by the student.
8. [Publish](how-to-create-manage-template.md#publish-the-template-vm) the template VM.
9. [Configure policy](../azure-netapp-files/azure-netapp-files-configure-export-policy.md) for file share.  Export policy can allow for a single VM or multiple VMs to have access to a volume.  Read only or read/write access can be granted.
10. Students must start their VM and run the script to mount the file share.  They'll only have to run the script once.  The command will look like `./mount_fileshare.sh myvolumename`.

## Next steps

Next steps are common to setting up any lab.

- [Create and manage a template](how-to-create-manage-template.md)
- [Add users](tutorial-setup-classroom-lab.md#add-users-to-the-lab)
- [Set quota](how-to-configure-student-usage.md#set-quotas-for-users)
- [Set a schedule](tutorial-setup-classroom-lab.md#set-a-schedule-for-the-lab)
- [Email registration links to students](how-to-configure-student-usage.md#send-invitations-to-users)