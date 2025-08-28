---
title: Azure Files NFS Encryption In Transit for SAP on Azure Systems| Microsoft Docs
description: Setup guide for Azure Files NFS Encryption In Transit for SAP on Azure Systems
services: virtual-machines-windows,virtual-network,storage
author: anjanbanerjee
manager: rdeltcheva
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: tutorial
ms.custom: devx-track-azurecli, devx-track-azurepowershell, linux-related-content
ms.date: 08/27/2025
ms.author: anjbanerjee
# Customer intent: As a system administrator, I want to configure encryption in transit on Azure Files using NFS for SAP NetWeaver on Azure VMs, so that I can secure and encrypt the fileshares of SAP applications running on Linux Enterprise Server.
---

# Azure Files NFS Encryption in Transit for SAP on Azure Systems

Azure Files NFS v4.1 volumes support [encryption in-transit](https://aka.ms/nfs/EiT/Announcement)  via TLS providing enterprise-grade security by encrypting all traffic between clients and servers, without compromising performance. With Azure Files NFS, you could encrypt your data end-to-end: at rest, in transit, and across the network.

For more information, refer the following document: [Encryption in transit for NFS Azure file shares](../../storage/files/encryption-in-transit-for-nfs-shares.md)

## Supported Linux releases

For SAP on Azure environment, Azure Files NFS Encryption in Transit (EiT) is available for the following Operating System releases.

- SLES for SAP 15 and higher
- RHEL for SAP 7.9, 8.x, 9.x and higher
Refer to [SAP Note 1928533](https://me.sap.com/notes/1928533) for Operating system supportability for SAP on Azure systems.

If you're using Azure Files NFS Encryption in Transit for High availability setup and pacemaker Resource Agent is managing the NFS Filesystems, then following Operating System releases are supported.

- SLES for SAP 15 SP 4 and higher
- RHEL for SAP 8.8, 8.10, 9.x and higher

## Deploying Encryption in Transit (EiT) for Azure Files NFS Shares

For SAP on Azure environment, mount Azure Files NFS shares from within the VM with two methods.

- File systems configured in /etc/fstab
- File systems configured as pacemaker resource agent

Steps for setting up Azure Files NFS EiT for these two scenarios are described in this document.

## Preparations for Azure Files NFS Encryption in Transit deployment

- Deploy the Azure File NFS storage account. Refer to the standard documentation for creating the Azure Files storage account, file share, and private endpoint for storage account.

    [Create an NFS Azure file share](../../storage/files/storage-files-quick-create-use-linux.md)

> [!NOTE]
> To enforce Encryption in Transit for all the file shares in the Azure Storage account, enable [secure transfer required](../../storage/files/encryption-in-transit-for-nfs-shares.md#enforce-encryption-in-transit) option in the configuration tab of the storage account.

- Deploy the mount helper (AZNFS) package on the Linux VM.

For **SUSE Linux:**

```bash
curl -sSL -O https://packages.microsoft.com/config/$(source /etc/os-release && echo "$ID/${VERSION_ID%%.*}")/packages-microsoft-prod.rpm
sudo rpm -i packages-microsoft-prod.rpm
rm packages-microsoft-prod.rpm
sudo zypper refresh
sudo zypper install aznfs
```

For **RHEL Linux:**

```bash
curl -sSL -O https://packages.microsoft.com/config/$(source /etc/os-release && echo "$ID/${VERSION_ID%%.*}")/packages-microsoft-prod.rpm
sudo rpm -i packages-microsoft-prod.rpm
rm packages-microsoft-prod.rpm
sudo yum update
sudo yum install aznfs
```

Choose `No` to autoupdate the package during installation. You can also turn off/on autoupdate at any time by changing the value of `AUTO_UPDATE_AZNFS` to false/true respectively in the file `/opt/microsoft/aznfs/data/config`.

For more information, see the [package installation section](../../storage/files/encryption-in-transit-for-nfs-shares.md#step-1-check-aznfs-mount-helper-package-installation).

- Create the directories to mount the file shares.

```bash
mkdir -p <full path of the directory>
```

## Mount the NFS File share from /etc/fstab

To mount the file share permanently by adding the mount commands in '/etc/fstab'.

```bash
vi /etc/fstab
sapnfs.file.core.windows.net:/sapnfsafs/sapnw1/sapmntNW1 /sapmnt/NW1  aznfs noresvport,vers=4,minorversion=1,nconnect=4,sec=sys,_netdev  0  0

# Mount the file systems
mount -a
```

For more information, refer to [the section](../../storage/files/encryption-in-transit-for-nfs-shares.md#step-2-mount-the-nfs-file-share) for mounting the Azure Files NFS Encryption in Transit file share in Linux VMs.

- File system mentioned is an example to explain the mount command syntax.
- To use AZNFS mount helper and Encryption in Transit, use the fstype as `aznfs`. You should always add `_netdev` option to their /etc/fstab entries to make sure file shares are mounted on reboot only after the required services are active.
- You can add 'notls' option in the mount command, if you don’t intend to use the Encryption in Transit but just want to use AZNFS mount helper to mount the file system. Also, it isn't recommended to use Encryption in Transit and non-Encryption in Transit methods for mounting different file systems using Azure Files NFS in the same Azure VM. Mount commands might fail to mount the file systems if Encryption in Transit and non-Encryption in Transit methods are used in the same VM.
- Mount helper supports private-endpoint based connections for Azure Files NFS Encryption in Transit.
- If SAP VM is [custom domain joined](/troubleshoot/azure/virtual-machines/linux/custom-dns-configuration-for-azure-linux-vms), then use custom DNS FQDN OR  short names for file share in the '/etc/fstab' as its defined in the DNS. To verify the hostname resolution, check using `nslookup <hostname>` and `getent host <hostname>` commands.

## Mount the NFS File share as pacemaker cluster resource

For high availability setup of SAP on Azure, to use file system as a resource in pacemaker cluster, and it needs to be mounted using pacemaker cluster command. In the pacemaker commands to setup file system as cluster resource, change the mount type to `aznfs` from `nfs`. Also add `_netdev` in the options section.

Example of command for **SUSE Linux:**

```bash
sudo crm configure primitive fs_NW1_ASCS Filesystem device='sapnfs.file.core.windows.net:/sapnfsafs/sapnw1/usrsapNW1ascs' directory='/usr/sap/NW1/ASCS00' fstype='aznfs' options='noresvport,vers=4,minorversion=1,sec=sys,_netdev' \
op start timeout=60s interval=0 \
op stop timeout=60s interval=0 \
op monitor interval=20s timeout=40s
```

Example of command for **RHEL Linux:**

```bash
sudo pcs resource create fs_NW1_ASCS Filesystem device='sapnfs.file.core.windows.net:/sapnfsafs/sapnw1/usrsapNW1ascs' \
directory='/usr/sap/NW1/ASCS00' fstype='aznfs' force_unmount=safe options='noresvport,vers=4,minorversion=1,sec=sys,_netdev' \
fast_stop=no op start interval=0 timeout=60 op stop interval=0 timeout=120 op monitor interval=200 timeout=40 \
--group g-NW1_ASCS
```

## Validation of in-transit data Encryption for Azure Files NFS

Check the mounted file systems in the VM.

```bash
eite10app1:~ # df -Th --type nfs4
Filesystem                                  Type  Size  Used Avail Use% Mounted on
127.0.0.1:/eite10sapinst00/sapinst          nfs4  512G  224G  289G  44% /sapinstall
127.0.0.1:/eite10sapapps00/e10-usrsap-d01   nfs4  256G  7.1G  249G   3% /usr/sap
127.0.0.1:/eite10sapapps00/e10-sapmnt-app   nfs4  1.0T  439G  586G  43% /sapmnt/E10
127.0.0.1:/eite10sapapps00/e10-usrsap-temp  nfs4  2.0T  640G  1.4T  32% /usr/sap/temp
127.0.0.1:/eite10sapapps00/e10-usrsap-trans nfs4  256G  3.0G  254G   2% /usr/sap/trans
eite10app1:~ #

```

These mounting details indicate that the client(VM) is connected through the local port 127.0.0.1, not an external network. The stunnel process listens on 127.0.0.1 (localhost) for incoming NFS traffic from the NFS client (the VM). Stunnel then intercepts this traffic and securely forwards it over TLS to the Azure Files NFS server on Azure.

For more information, refer to the [Verify that the in-transit data encryption succeeded](../../storage/files/encryption-in-transit-for-nfs-shares.md#step-3--verify-that-the-in-transit-data-encryption-succeeded) section for further checks.

## Next Steps

- [Plan and implement an SAP deployment on Azure](/planning-guide.md)
- [Azure Virtual Machines deployment for SAP NetWeaver](/deployment-guide.md)
- [Using Azure Premium Files NFS and SMB for SAP workload](planning-guide-storage-azure-files.md)
- [High-availability architecture and scenarios for SAP NetWeaver](/sap-high-availability-architecture-scenarios.md)
- [High-availability SAP NetWeaver with simple mount and NFS on SLES for SAP Applications VMs](/high-availability-guide-suse-nfs-simple-mount.md)
- [High availability for SAP NetWeaver on VMs on RHEL with NFS on Azure Files](/high-availability-guide-rhel-nfs-azure-files.md)