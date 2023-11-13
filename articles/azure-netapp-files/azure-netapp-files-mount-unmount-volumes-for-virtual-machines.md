---
title: Mount NFS volumes for virtual machines | Microsoft Docs
description: Learn how to mount an NFS volume for Windows or Linux virtual machines.
author: b-hchen
ms.author: anfdocs
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: how-to
ms.date: 09/07/2022
---
# Mount NFS volumes for Linux or Windows VMs 

You can mount an NFS file for Windows or Linux virtual machines (VMs). 

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
2. Select the **Volumes** pane and then the NFS volume that you want to mount.
3. To mount the NFS volume using a Linux client, select **Mount instructions** from the selected volume. Follow the displayed instructions to mount the volume. 
  :::image type="content" source="../media/azure-netapp-files/azure-netapp-files-mount-instructions-nfs.png" alt-text="Screenshot of Mount instructions." lightbox="../media/azure-netapp-files/azure-netapp-files-mount-instructions-nfs.png":::
      * Ensure that you use the `vers` option in the `mount` command to specify the NFS protocol version that corresponds to the volume you want to mount. 
  For example, if the NFS version is NFSv4.1: 
  `sudo mount -t nfs -o rw,hard,rsize=65536,wsize=65536,vers=4.1,tcp,sec=sys $MOUNTTARGETIPADDRESS:/$VOLUMENAME $MOUNTPOINT` 
      * If you use NFSv4.1 and your configuration requires using VMs with the same host names (for example, in a DR test), refer to [Configure two VMs with the same hostname to access NFSv4.1 volumes](configure-nfs-clients.md#configure-two-vms-with-the-same-hostname-to-access-nfsv41-volumes).
      * In Azure NetApp Files, NFSv4.2 is enabled when NFSv4.1 is used, however NFSv4.2 is officially unsupported. If you don’t specify NFSv4.1 in the client’s mount options (`vers=4.1`), the client may negotiate to the highest allowed NFS version, meaning the mount is out of support compliance.
4. If you want the volume mounted automatically when an Azure VM is started or rebooted, add an entry to the `/etc/fstab` file on the host. 
  For example: `$ANFIP:/$FILEPATH /$MOUNTPOINT nfs bg,rw,hard,noatime,nolock,rsize=65536,wsize=65536,vers=3,tcp,_netdev 0 0`
    * `$ANFIP` is the IP address of the Azure NetApp Files volume found in the volume properties menu
    * `$FILEPATH` is the export path of the Azure NetApp Files volume
    * `$MOUNTPOINT` is the directory created on the Linux host used to mount the NFS export
5. If you want to mount an NFS Kerberos volume, refer to [Configure NFSv4.1 Kerberos encryption](configure-kerberos-encryption.md) for additional details.
6. You can also access SMB volumes from Unix and Linux clients via NFS by setting the protocol access for the volume to “dual-protocol”. This allows for accessing the volume via NFS (NFSv3 or NFSv4.1) and SMB. See [Create a dual-protocol volume](create-volumes-dual-protocol.md) for details. Take note of the security style mappings table. Mounting a dual-protocol volume from Unix and Linux clients relies on the same procedure as regular NFS volumes.

## Mount NFS volumes on Windows clients 

Mounting NFSv4.1 volumes on Windows clients is not supported. For more information, see [Network File System overview](/windows-server/storage/nfs/nfs-overview).

If you want to mount NFSv3 volumes on a Windows client using NFS: 

1. [Mount the volume onto a Unix or Linux VM first](#mount-nfs-volumes-on-linux-clients).
1. Run a `chmod 777` or `chmod 775` command against the volume. 
1. Mount the volume via the NFS client on Windows using the mount option `mtype=hard` to reduce connection issues. 
  See [Windows command line utility for mounting NFS volumes](/windows-server/administration/windows-commands/mount) for more detail. 
  For example: `Mount -o rsize=256 -o wsize=256 -o mtype=hard \\10.x.x.x\testvol X:* `
1. You can also access NFS volumes from Windows clients via SMB by setting the protocol access for the volume to “dual-protocol”. This setting allows access to the volume via SMB and NFS (NFSv3 or NFSv4.1) and will result in better performance than using the NFS client on Windows with an NFS volume. See [Create a dual-protocol volume](create-volumes-dual-protocol.md) for details, and take note of the security style mappings table. Mounting a dual-protocol volume from Windows clients using the same procedure as regular SMB volumes. 

## Next steps

* [Mount SMB volumes for Windows or Linux virtual machines](mount-volumes-vms-smb.md)
* [Linux NFS mount options best practices](performance-linux-mount-options.md) 
* [Configure NFSv4.1 default domain for Azure NetApp Files](azure-netapp-files-configure-nfsv41-domain.md)
* [NFS FAQs](faq-nfs.md)
* [Network File System overview](/windows-server/storage/nfs/nfs-overview)
* [Mount an NFS Kerberos volume](configure-kerberos-encryption.md#kerberos_mount)
* [Configure two VMs with the same hostname to access NFSv4.1 volumes](configure-nfs-clients.md#configure-two-vms-with-the-same-hostname-to-access-nfsv41-volumes) 
