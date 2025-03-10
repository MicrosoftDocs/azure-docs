---
title: Mount NFS volumes for virtual machines | Microsoft Docs
description: Learn how to mount an NFS volume for Windows or Linux virtual machines.
author: b-hchen
ms.author: anfdocs
ms.service: azure-netapp-files
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 01/28/2025
---
# Mount NFS volumes for Linux or Windows VMs 

You can mount an NFS file on both Linux and Windows virtual machines (VMs). 

## Requirements 

* You must have at least one export policy to be able to access an NFS volume.
* Since NFS is a network attached service, it requires specific network ports to be opened across firewalls to ensure proper functionality. Ensure your configuration aligns:

| Port and description | NFSv3 | NFSv4.x | 
| --- | - | - | 
| **Port 111 TCP/UDP – Portmapper** <br /> _Used to negotiate which ports are used in NFS requests._ | ![White checkmark in green box](../static-web-apps/media/get-started-cli/checkmark-green-circle.png) | N/A* | 
| **Port 635 TCP/UDP – `Mountd`** <br /> *Used to receive incoming mount requests.* | ![White checkmark in green box](../static-web-apps/media/get-started-cli/checkmark-green-circle.png) | N/A* | 
| **Port 2049 TCP/UDP – NFS** <br /> _NFS traffic._ | ![White checkmark in green box](../static-web-apps/media/get-started-cli/checkmark-green-circle.png) | ![White checkmark in green box](../static-web-apps/media/get-started-cli/checkmark-green-circle.png) |
| **Port 4045 TCP/UDP – Network Lock Manager (NLM)** <br /> _Handles lock requests._ | ![White checkmark in green box](../static-web-apps/media/get-started-cli/checkmark-green-circle.png) | N/A* | 
| **Port 4046 TCP/UDP – Network Status Monitor (NSM)** <br /> _Notifies NFS clients about reboots of the server for lock management._ | ![White checkmark in green box](../static-web-apps/media/get-started-cli/checkmark-green-circle.png) | N/A* | 
| **Port 4049 TCP/UDP – `Rquotad`** <br /> _Handles [remote quota](https://linux.die.net/man/8/rpc.rquotad) services (optional)_ | ![White checkmark in green box](../static-web-apps/media/get-started-cli/checkmark-green-circle.png) | N/A* | 

\* Incorporated into the NFSv4.1 standards. All traffic passed over port 2049.

### About outbound client ports

Outbound client port requests leverage a port range for NFS connectivity. The Azure NetApp Files mount port is static at 635. A client can initiate a connection using a dynamic port number in the range of 1 to 1023. For example, while the Azure NetApp Files mount port is 635, the client can use a dynamic port such as 1010. 

Since there are only 1,023 ports in that range, concurrent mount requests should be limited to below that amount. Otherwise, mount attempts fail if no available outgoing ports are free at the time of the request. Mount requests are ephemeral, so once the mount is established, the outbound client mount port frees up the connection.

If mounting using UDP, once the mount request completes, a port isn't freed for up to 60 seconds. If mounting with TCP specified in the mount options, then the mount port is freed upon completion.

Outbound client requests for NFS (directed to port 2049) allow up to 65,534 concurrent client ports per Azure NetApp Files NFS server. Once an NFS request is complete, the port is returned to the pool.

### Network address translation and firewalls

If a network address translation (NAT) or firewall sits between the NFS client and server:

*	NFS maintains a reply cache to keep track of certain operations to make sure that they have completed. This reply cache is based on the source port and source IP address. When NAT is used in NFS operations, the source IP or port might change in flight, which could lead to data resiliency issues. If NAT is used, static entries for the NFS server IP and port should be added to make sure that data remains consistent.
*	In addition, NAT can also cause issues with NFS mounts hanging due to how NAT handles idle sessions. If using NAT, the configuration should take idle sessions into account and leave them open indefinitely to prevent issues. NAT can also create issues with NLM lock reclamation.
*	Some firewalls might drop idle TCP connections after a set amount of time. For example, if a client has an NFS mount connected, but doesn’t use it for a while, it’s deemed idle. When this occurs, client access to mounts can hang because the network connection has been severed by the firewall. `Keepalives` can help prevent this, but it's better to address potential idle clients by configuring firewalls to not actively reject packets from stale sessions.

For more information about NFS locking, see [Understand file locking and lock types in Azure NetApp Files](understand-file-locks.md).

For more information about how NFS operates in Azure NetApp Files, see [Understand NAS protocols in Azure NetApp Files](network-attached-storage-protocols.md#network-file-system-nfs).


## Mount NFS volumes on Linux clients

Before mounting NFS volumes on Linux clients, review the [Linux NFS mount options best practices](performance-linux-mount-options.md).

1. Select the **Volumes** pane and then the NFS volume that you want to mount.
1. To mount the NFS volume using a Linux client, select **Mount instructions** from the selected volume. Follow the displayed instructions to mount the volume. 
  :::image type="content" source="./media/azure-netapp-files-mount-unmount-volumes-for-virtual-machines/azure-netapp-files-mount-instructions-nfs.png" alt-text="Screenshot of Mount instructions." lightbox="./media/azure-netapp-files-mount-unmount-volumes-for-virtual-machines/azure-netapp-files-mount-instructions-nfs.png":::
      * Ensure that you use the `vers` option in the `mount` command to specify the NFS protocol version that corresponds to the volume you want to mount. 
  For example, if the NFS version is NFSv4.1: 
  `sudo mount -t nfs -o rw,hard,rsize=65536,wsize=65536,vers=4.1,tcp,sec=sys $MOUNTTARGETIPADDRESS:/$VOLUMENAME $MOUNTPOINT` 
      * If you use NFSv4.1 and your configuration requires using VMs with the same host names (for example, in a DR test), see [Configure two VMs with the same hostname to access NFSv4.1 volumes](configure-nfs-clients.md#configure-two-vms-with-the-same-hostname-to-access-nfsv41-volumes).
      * In Azure NetApp Files, NFSv4.2 is enabled when NFSv4.1 is used, however NFSv4.2 is officially unsupported. If you don’t specify NFSv4.1 in the client’s mount options (`vers=4.1`), the client may negotiate to the highest allowed NFS version, meaning the mount is out of support compliance.
1. If you want the volume mounted automatically when an Azure VM is started or rebooted, add an entry to the `/etc/fstab` file on the host. 
  For example: `$ANFIP:/$FILEPATH /$MOUNTPOINT nfs bg,rw,hard,noatime,nolock,rsize=65536,wsize=65536,vers=3,tcp,_netdev 0 0`
    * `$ANFIP` is the IP address of the Azure NetApp Files volume found in the volume properties menu
    * `$FILEPATH` is the export path of the Azure NetApp Files volume
    * `$MOUNTPOINT` is the directory created on the Linux host used to mount the NFS export
1. If you want to mount an NFS Kerberos volume, refer to [Configure NFSv4.1 Kerberos encryption](configure-kerberos-encryption.md) for additional details.

>[!NOTE]
>You can also access SMB volumes from Unix and Linux clients via NFS by setting the protocol access for the volume to "dual-protocol." The dual-protocol setting allows for accessing the volume via NFS (NFSv3 or NFSv4.1) and SMB. See [Create a dual-protocol volume](create-volumes-dual-protocol.md) for details. Take note of the security style mappings table. Mounting a dual-protocol volume from Unix and Linux clients relies on the same procedure as regular NFS volumes.

## Mount NFSv3 volumes on Windows clients 

>[!IMPORTANT]
>Mounting NFSv4.1 volumes on Windows clients isn't supported. For more information, see [Network File System overview](/windows-server/storage/nfs/nfs-overview).

To mount NFSv3 volumes on a Windows client using NFS: 

1. [Mount the volume onto a Unix or Linux VM first](#mount-nfs-volumes-on-linux-clients).
1. Run a `chmod 777` or `chmod 775` command against the volume. 
1. Mount the volume via the NFS client on Windows using the mount option `mtype=hard` to reduce connection issues. 
  See [Windows command line utility for mounting NFS volumes](/windows-server/administration/windows-commands/mount) for more detail. 
  For example: `Mount -o rsize=256 -o wsize=256 -o mtype=hard \\10.x.x.x\testvol X:* `

>[!NOTE]
>You can also access NFS volumes from Windows clients via SMB by setting the protocol access for the volume to "dual-protocol." This setting allows access to the volume via SMB and NFS (NFSv3 or NFSv4.1) and results in better performance than using the NFS client on Windows with an NFS volume. See [Create a dual-protocol volume](create-volumes-dual-protocol.md) for details, and take note of the security style mappings table. Mounting a dual-protocol volume from Windows clients using the same procedure as regular SMB volumes. 

## Next steps

* [Mount SMB volumes for Windows or Linux virtual machines](mount-volumes-vms-smb.md)
* [Linux NFS mount options best practices](performance-linux-mount-options.md) 
* [Configure NFSv4.1 default domain for Azure NetApp Files](azure-netapp-files-configure-nfsv41-domain.md)
* [NFS FAQs](faq-nfs.md)
* [Network File System overview](/windows-server/storage/nfs/nfs-overview)
* [Mount an NFS Kerberos volume](configure-kerberos-encryption.md#kerberos_mount)
* [Configure two VMs with the same hostname to access NFSv4.1 volumes](configure-nfs-clients.md#configure-two-vms-with-the-same-hostname-to-access-nfsv41-volumes) 
* [Understand file locking and lock types in Azure NetApp Files](understand-file-locks.md)
* [Understand NAS protocols in Azure NetApp Files](network-attached-storage-protocols.md#network-file-system-nfs)
