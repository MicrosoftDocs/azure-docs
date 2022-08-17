---
title: Mount Azure NetApp Files volumes for virtual machines | Microsoft Docs
description: Learn how to mount an Azure NetApp Files volume for Windows or Linux virtual machines.
author: b-hchen
ms.author: anfdocs
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: how-to
ms.date: 08/16/2022
---
# Mount a volume for Windows or Linux VMs 

You can mount an Azure NetApp Files file for Windows or Linux virtual machines (VMs).  <!-- The mount instructions for Linux virtual machines are available on Azure NetApp Files.  // This article describes how to mount an Azure NetApp Files NFS volume for Linux or Windows virtual machines (VMs). -->

## Requirements 

* You must have at least one export policy to be able to access an NFS volume.
* To mount an NFS volume successfully, ensure that the following NFS ports are open between the client and the NFS volumes:
    * 111 TCP/UDP = `RPCBIND/Portmapper`
    * 635 TCP/UDP = `mountd`
    * 2049 TCP/UDP = `nfs`
    * 4045 TCP/UDP = `nlockmgr` (NFSv3 only)
    * 4046 TCP/UDP = `status` (NFSv3 only)

## Mount NFS volumes on Linux clients

1. Review the [Linux NFS mount options best practices](performance-linux-mount-options.md).
1. Select the **Volumes** pane and then the NFS volume that you want to mount.
1. To mount the NFS volume using a Linux client, select **Mount instructions** from the selected volume. Follow the displayed instructions to mount the volume. 
  * Ensure that you use the vers option in the mount command to specify the NFS protocol version that corresponds to the volume you want to mount. 
  For example, if the NFS version is NFSv4.1: 
  `sudo mount -t nfs -o rw,hard,rsize=65536,wsize=65536,vers=4.1,tcp,sec=sys $MOUNTTARGETIPADDRESS:/$VOLUMENAME $MOUNTPOINT` 
  * If you use NFSv4.1 and your use case involves leveraging VMs with the same host names (for example, in a DR test), see [Configure two VMs with the same hostname to access NFSv4.1 volumes](configure-nfs-clients#configure-two-vms-with-the-same-hostname-to-access-nfsv41-volumes.md).

1. If you want the volume mounted automatically when an Azure VM is started or rebooted, add an entry to the `/etc/fstab` file on the host. 
  For example: `$ANFIP:/$FILEPATH /$MOUNTPOINT nfs bg,rw,hard,noatime,nolock,rsize=65536,wsize=65536,vers=3,tcp,_netdev 0 0`
    * `$ANFIP` is the IP address of the Azure NetApp Files volume found in the volume properties blade
    * `$FILEPATH` is the export path of the Azure NetApp Files volume * `$MOUNTPOINT` is the directory created on the Linux host used to mount the NFS export
1. If you want to mount an NFS Kerberos volume, refer to [Configure NFSv4.1 Kerberos encryption](configure-kerberos-encryption.md) for additional details.


## Steps

1. Click the **Volumes** blade, and then select the volume for which you want to mount. 
2. Click **Mount instructions** from the selected volume, and then follow the instructions to mount the volume. 

    ![Mount instructions NFS](../media/azure-netapp-files/azure-netapp-files-mount-instructions-nfs.png)

    ![Mount instructions SMB](../media/azure-netapp-files/azure-netapp-files-mount-instructions-smb.png)  
    * If you are mounting an NFS volume, ensure that you use the `vers` option in the `mount` command to specify the NFS protocol version that corresponds to the volume you want to mount. 
    * If you are using NFSv4.1, use the following command to mount your file system:  `sudo mount -t nfs -o rw,hard,rsize=65536,wsize=65536,vers=4.1,tcp,sec=sys $MOUNTTARGETIPADDRESS:/$VOLUMENAME $MOUNTPOINT`  
        > [!NOTE]
        > If you use NFSv4.1 and your use case involves leveraging VMs with the same hostnames (for example, in a DR test), see [Configure two VMs with the same hostname to access NFSv4.1 volumes](configure-nfs-clients.md#configure-two-vms-with-the-same-hostname-to-access-nfsv41-volumes).

3. If you want to have an NFS volume automatically mounted when an Azure VM is started or rebooted, add an entry to the `/etc/fstab` file on the host. 

    For example:  `$ANFIP:/$FILEPATH		/$MOUNTPOINT	nfs bg,rw,hard,noatime,nolock,rsize=65536,wsize=65536,vers=3,tcp,_netdev 0 0`

    * `$ANFIP` is the IP address of the Azure NetApp Files volume found in the volume properties blade.
    * `$FILEPATH` is the export path of the Azure NetApp Files volume.
    * `$MOUNTPOINT` is the directory created on the Linux host used to mount the NFS export.

4. If you want to mount the volume to Windows using NFS:

      > [!NOTE]
      > One alternative to mounting an NFS volume on Windows is to [Create a dual-protocol volume for Azure NetApp Files](create-volumes-dual-protocol.md), allowing the native access of SMB for Windows and NFS for Linux. However, if that is not possible, you can mount the NFS volume on Windows using the steps below.

    * Set the permissions to allow the volume to be mounted on Windows
      * Follow the steps to [Configure Unix permissions and change ownership mode for NFS and dual-protocol volumes](configure-unix-permissions-change-ownership-mode.md#unix-permissions) and set the permissions to '777' or '775'.
    * Install NFS client on Windows
      * Open PowerShell
      * type: `Install-WindowsFeature -Name NFS-Client`
    * Mount the volume via the NFS client on Windows
      * Obtain the 'mount path' of the volume
      * Open a Command prompt
      * type: `mount -o anon -o mtype=hard \\$ANFIP\$FILEPATH $DRIVELETTER:\`
         * `$ANFIP` is the IP address of the Azure NetApp Files volume found in the volume properties blade.
         * `$FILEPATH` is the export path of the Azure NetApp Files volume.
         * `$DRIVELETTER` is the drive letter where you would like the volume mounted within Windows.
    
5. If you want to mount an NFS Kerberos volume, see [Configure NFSv4.1 Kerberos encryption](configure-kerberos-encryption.md) for additional details. 
6. You can also access SMB volumes from Unix and Linux clients via NFS by setting the protocol access for the volume to “dual-protocol”. This allows for accessing the volume via NFS (NFSv3 or NFSv4.1) and SMB. See [Create a dual-protocol volume](create-volumes-dual-protocol.md) for details. Take note of the security style mappings table. Mount a dual-protocol volume from Unix and Linux clients using the same procedure as regular NFS volumes. <!-- last sentence -->

## Mount NFS volumes on Windows clients 
Mounting NFSv4.1 volumes on Windows clients is supported. For more information, see [Network File System overview](../windows-server/storage/nfs/nfs-overview). If you want to mount NFSv3 volumes on Windows client using NFS: 

1. Mount the volume onto a Unix or Linux VM first. 
1. Run a `chmod 777` or `chmod 775` command against the volume. 
1. Mount the volume via the NFS client on Windows using the mount option `mtype=hard` to reduce connection issues. 
1. See [Windows command line utility for mounting NFS volumes](../windows-server/administration/windows-commands/mount) for more detail. 
For example: `Mount -o rsize=256 -o wsize=256 -o mtype=hard \\10.x.x.x\testvol X:* `
1. You can also access NFS volumes from Windows clients via SMB by setting the protocol access for the volume to “dual-protocol”. This allows for accessing the volume via SMB and NFS (NFSv3 or NFSv4.1). See [Create a dual-protocol volume](create-volumes-dual-protocol.md) for details, and take note of the security style mappings table. Mount a dual-protocol volume from Windows clients using the same procedure as regular SMB volumes. 

## Next steps

* [Mount SMB volumes for Windows or Linux virtual machines](azure-netapp-files-mount-unmount-volumes-for-virtual-machines-smb.md)
* [Linux NFS mount options best practices](performance-linux-mount-options.md) 
* [Configure NFSv4.1 default domain for Azure NetApp Files](azure-netapp-files-configure-nfsv41-domain.md)
* [NFS FAQs](faq-nfs.md)
* [Network File System overview](/windows-server/storage/nfs/nfs-overview)
* [Mount an NFS Kerberos volume](configure-kerberos-encryption.md#kerberos_mount)
* [Configure two VMs with the same hostname to access NFSv4.1 volumes](configure-nfs-clients.md#configure-two-vms-with-the-same-hostname-to-access-nfsv41-volumes) 
