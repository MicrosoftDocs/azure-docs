---
title: Get started with Azure Application Consistent Snapshot tool for Azure NetApp Files | Microsoft Docs
description: Provides a guide for installing the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: Phil-Jensen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 04/21/2021
ms.author: phjensen
---

# Get started with Azure Application Consistent Snapshot tool

This article provides a guide for installing the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files.

## Getting the snapshot tools

It is recommended customers get the most recent version of the [AzAcSnap Installer](https://aka.ms/azacsnapdownload) from Microsoft.

The self-installation file has an associated [AzAcSnap Installer signature file](https://aka.ms/azacsnapdownloadsignature) which is signed with Microsoft's public key to allow for GPG verification of the downloaded installer.

Once these downloads are completed, then follow the steps in this guide to install.

### Verifying the download

The installer, which is downloadable per above, has an associated PGP signature file with an `.asc`
filename extension. This file can be used to ensure the installer downloaded is a verified
Microsoft provided file. The Microsoft PGP Public Key used for signing Linux packages is available here
(<https://packages.microsoft.com/keys/microsoft.asc>) and has been used to sign the signature file.

The Microsoft PGP Public Key can be imported to a user's local as follows:

```bash
wget https://packages.microsoft.com/keys/microsoft.asc
gpg --import microsoft.asc
```

The following commands trust the Microsoft PGP Public Key:

1. List the keys in the store.
2. Edit the Microsoft key.
3. Check the fingerprint with `fpr`
4. Sign the key to trust it.

```bash
gpg --list-keys
```

Listed keys:
```output
----<snip>----
pub rsa2048 2015- 10 - 28 [SC]
BC528686B50D79E339D3721CEB3E94ADBE1229CF
uid [ unknown] Microsoft (Release signing) gpgsecurity@microsoft.com
```

```bash
gpg --edit-key gpgsecurity@microsoft.com
```

Output from interactive `gpg` session signing Microsoft public key:
```output
gpg (GnuPG) 2.1.18; Copyright (C) 2017 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
pub rsa2048/EB3E94ADBE1229CF
created: 2015- 10 - 28 expires: never usage: SC
trust: unknown validity: unknown
[ unknown] (1). Microsoft (Release signing) <gpgsecurity@microsoft.com>

gpg> fpr
pub rsa2048/EB3E94ADBE1229CF 2015- 10 - 28 Microsoft (Release signing)
<gpgsecurity@microsoft.com>
Primary key fingerprint: BC52 8686 B50D 79E3 39D3 721C EB3E 94AD BE12 29CF

gpg> sign
pub rsa2048/EB3E94ADBE1229CF
created: 2015- 10 - 28 expires: never usage: SC
trust: unknown validity: unknown
Primary key fingerprint: BC52 8686 B50D 79E3 39D3 721C EB3E 94AD BE12 29CF
Microsoft (Release signing) <gpgsecurity@microsoft.com>
Are you sure that you want to sign this key with your
key "XXX XXXX <xxxxxxx@xxxxxxxx.xxx>" (A1A1A1A1A1A1)
Really sign? (y/N) y

gpg> quit
Save changes? (y/N) y
```

The PGP signature file for the installer can be checked as follows:

```bash
gpg --verify azacsnap_installer_v5.0.run.asc azazsnap_installer_v5.0.run
```

```output
gpg: Signature made Sat 13 Apr 2019 07:51:46 AM STD
gpg: using RSA key EB3E94ADBE1229CF
gpg: Good signature from "Microsoft (Release signing)
<gpgsecurity@microsoft.com>" [full]
```

For more details about using GPG, see [The GNU Privacy Handbook](https://www.gnupg.org/gph/en/manual/book1.html).

## Supported scenarios

The snapshot tools can be used in the following scenarios.

- Single SID
- Multiple SID
- HSR
- Scale-out
- MDC (Only single tenant supported)
- Single Container
- SUSE Operating System
- RHEL Operating System
- SKU TYPE I
- SKU TYPE II

See [Supported scenarios for HANA Large Instances](../virtual-machines/workloads/sap/hana-supported-scenario.md)

## Snapshot Support Matrix from SAP

The following matrix is provided as a guideline on which versions of SAP HANA
are supported by SAP for Storage Snapshot Backups.

| Database Versions       |1.0 SPS12|2.0 SPS0|2.0 SPS1|2.0 SPS2|2.0 SPS3|2.0 SPS4|
|-------------------------|---------|--------|--------|--------|--------|--------|
|Single Container Database| √       | √      | -      | -      | -      | -      |
|MDC Single Tenant        | -       | -      | √      | √      | √      | √      |
|MDC Multiple Tenants     | -       | -      | -      | -      | -      | √      |
> √ = <small>supported by SAP for Storage Snapshots</small>

## Important things to remember

- After the setup of the snapshot tools, continuously monitor the storage space available and if
    necessary, delete the old snapshots on a regular basis to avoid storage fill out.
- Always use the latest snapshot tools.
- Use the same version of the snapshot tools across the landscape.
- Test the snapshot tools and get comfortable with the parameters required and output of the
    command before using in the production system.
- When setting up the HANA user for backup (details below in this document), you need to
    set up the user for each HANA instance. Create an SAP HANA user account to access HANA
    instance under the SYSTEMDB (and not in the SID database) for MDC. In the single container
    environment, it can be set up under the tenant database.
- Customers must provide the SSH public key for storage access. This action must be done once per
    node and for each user under which the command is executed.
- The number of snapshots per volume is limited to 250.
- If manually editing the configuration file, always use a Linux text editor such as "vi" and not
    Windows editors like Notepad. Using Windows editor may corrupt the file format.
  - Set up `hdbuserstore` for the SAP HANA user to communicate with SAP HANA.
- For DR: The snapshot tools must be tested on DR node before DR is set up.
- Monitor disk space regularly, automated log deletion is managed with the `--trim` option of the
    `azacsnap -c backup` for SAP HANA 2 and later releases.
- **Risk of snapshots not being taken** - The snapshot tools only interact with the node of the SAP HANA
system specified in the configuration file.  If this node becomes unavailable, there is no mechanism to
automatically start communicating with another node.  
  - For an **SAP HANA Scale-Out with Standby** scenario it is typical to install and configure the snapshot
 tools on the master node. But, if the master node becomes unavailable, the standby node will take over
the master node role. In this case, the implementation team should configure the snapshot tools on both
nodes (Master and Stand-By) to avoid any missed snapshots. In the normal state, the master node will take
HANA snapshots initiated by crontab, but after master node failover those snapshots will have to be
executed from another node such as the new master node (former standby). To achieve this outcome, the standby
node would need the snapshot tool installed, storage communication enabled, hdbuserstore configured,
`azacsnap.json` configured, and crontab commands staged in advance of the failover.
  - For an **SAP HANA HSR HA** scenario, it is recommended to install, configure, and schedule the
snapshot tools on both (Primary and Secondary) nodes. Then, if the Primary node becomes unavailable,
the Secondary node will take over with snapshots being taken on the Secondary. In the normal state, the
Primary node will take HANA snapshots initiated by crontab and the Secondary node would attempt to take
snapshots but fail as the Primary is functioning correctly.  But after Primary node failover, those
snapshots will be executed from the Secondary node. To achieve this outcome, the Secondary node needs the
snapshot tool installed, storage communication enabled, `hdbuserstore` configured, azacsnap.json
configured, and crontab enabled in advance of the failover.

## Guidance provided in this document

The following guidance is provided to illustrate the usage of the snapshot tools.

### Taking snapshot backups

- [What are the prerequisites for the storage snapshot](azacsnap-installation.md#prerequisites-for-installation)
  - [Enable communication with storage](azacsnap-installation.md#enable-communication-with-storage)
  - [Enable communication with SAP HANA](azacsnap-installation.md#enable-communication-with-sap-hana)
- [How to take snapshots manually](azacsnap-tips.md#take-snapshots-manually)
- [How to set up automatic snapshot backup](azacsnap-tips.md#setup-automatic-snapshot-backup)
- [How to monitor the snapshots](azacsnap-tips.md#monitor-the-snapshots)
- [How to delete a snapshot?](azacsnap-tips.md#delete-a-snapshot)
- [How to restore a snapshot](azacsnap-tips.md#restore-a-snapshot)
- [How to restore a `boot` snapshot](azacsnap-tips.md#restore-a-boot-snapshot)
- [What are key facts to know about the snapshots](azacsnap-tips.md#key-facts-to-know-about-snapshots)

> Snapshots are tested for both single SID and multi SID.

### Performing disaster recovery

- [What are the prerequisites for DR setup](azacsnap-disaster-recovery.md#prerequisites-for-disaster-recovery-setup)
- [How to set up a disaster recovery](azacsnap-disaster-recovery.md#set-up-disaster-recovery)
- [How to monitor the data replication from Primary to DR site](azacsnap-disaster-recovery.md#monitor-data-replication-from-primary-to-dr-site)
- [How to perform a failover to DR site?](azacsnap-disaster-recovery.md#perform-a-failover-to-dr-site)

## Next steps

- [Install Azure Application Consistent Snapshot tool](azacsnap-installation.md)
