---
title: Preview features for Azure Application Consistent Snapshot tool for Azure NetApp Files | Microsoft Docs
description: Provides a guide for using the preview features of the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files. 
services: azure-netapp-files
author: Phil-Jensen
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.custom:
ms.topic: reference
ms.date: 08/21/2023
ms.author: phjensen
---

# Preview features of Azure Application Consistent Snapshot tool

> [!NOTE]
> PREVIEWS ARE PROVIDED "AS-IS," "WITH ALL FAULTS," AND "AS AVAILABLE," AND ARE EXCLUDED FROM THE SERVICE LEVEL AGREEMENTS AND LIMITED WARRANTY
> ref:  <https://azure.microsoft.com/support/legal/preview-supplemental-terms/>

This article provides a guide on set up and usage of the new features in preview for **AzAcSnap**.  This guide should be read along with the main
documentation for AzAcSnap at [aka.ms/azacsnap](./azacsnap-introduction.md).

The preview features provided with **AzAcSnap 9** are:

- Azure NetApp Files Backup.
- Azure Managed Disk.

## Providing feedback

Feedback on AzAcSnap, including this preview, can be provided [online](https://aka.ms/azacsnap-feedback).

## Using AzAcSnap Preview features

AzAcSnap preview features are offered together with generally available features.  Using the preview features requires the use of the `--preview` command line option to enable their usage.  To setup and install AzAcSnap refer to [Get started with Azure Application Consistent Snapshot tool](azacsnap-get-started.md)

Return to this document for details on using the specific preview features.

## Azure NetApp Files Backup

> [!NOTE]
> Support for Azure NetApp Files Backup is a Preview feature.  
> This section's content supplements [Configure Azure Application Consistent Snapshot tool](azacsnap-cmd-ref-configure.md) website page.

When taking snapshots with AzAcSnap on multiple volumes all the snapshots have the same name by default.  Due to the removal of the Volume name from the resource ID hierarchy when the snapshot is archived into Azure NetApp Files Backup it's necessary to ensure the Snapshot name is unique.  AzAcSnap can do this automatically when it creates the Snapshot by appending the Volume name to the normal snapshot name.  For example, for a system with two data volumes (`hanadata01`, `hanadata02`) when doing a `-c backup` with `--prefix daily` the complete snapshot names become `daily__F2AFDF98703__hanadata01` and `daily__F2AFDF98703__hanadata02`.  

This can be enabled in AzAcSnap by setting `"anfBackup": "renameOnly"` in the configuration file, see the following snippet:

```output
"anfStorage": [
  {
    "anfBackup" : "renameOnly",
    "dataVolume": [
```

This can also be done using the `azacsnap -c configure --configuration edit --configfile <configfilename>` and when asked to `Enter new value for 'ANF Backup (none, renameOnly)' (current = 'none'):` enter `renameOnly`.

## Azure Managed Disk

> [!NOTE]
> Support for Azure Managed Disk as a storage back-end is a Preview feature.  
> This section's content supplements [Configure Azure Application Consistent Snapshot tool](azacsnap-cmd-ref-configure.md) website page.

Microsoft provides many storage options for deploying databases such as SAP HANA.  Many of these options are detailed on the 
[Azure Storage types for SAP workload](../virtual-machines/workloads/sap/planning-guide-storage.md) web page.  Additionally there's a 
[Cost conscious solution with Azure premium storage](../virtual-machines/workloads/sap/hana-vm-premium-ssd-v1.md#cost-conscious-solution-with-azure-premium-storage).  

AzAcSnap is able to take application consistent database snapshots when deployed on this type of architecture (that is, a VM with Managed Disks).  However, the set up 
for this platform is slightly more complicated as in this scenario we need to block I/O to the mountpoint (using `xfs_freeze`) before taking a snapshot of the Managed 
Disks in the mounted Logical Volume(s).  

> [!IMPORTANT]
> The Linux system must have `xfs_freeze` available to block disk I/O.

> [!CAUTION]
> Take extra care to configure AzAcSnap with the correct mountpoints (filesystems) because `xfs_freeze` blocks I/O to the device specified by the Azure Managed Disk 
> mount-point.  This could inadvertently block a running application until `azacsnap` finishes running.

Architecture at a high level:
1. Azure Managed Disks attached to the VM using the Azure portal.
1. Logical Volume is created from these Managed Disks.
1. Logical Volume mounted to a Linux directory.
1. Service Principal should be created in the same way as for Azure NetApp Files in [AzAcSnap installation](azacsnap-installation.md?tabs=azure-netapp-files%2Csap-hana#enable-communication-with-storage).
1. Install and Configure AzAcSnap.
   > [!NOTE]
   > The configurator has a new option to define the mountpoint for the Logical Volume.  This parameter gets passed to `xfs_freeze` to block the I/O (this 
   > happens after the database is put into backup mode).  After the I/O cache has been flushed (dependent on Linux kernel parameter `fs.xfs.xfssyncd_centisecs`).  
1. Install and Configure `xfs_freeze` to be run as a non-privileged user: 
   1. Create an executable file called $HOME/bin/xfs_freeze with the following content.
   
      ```bash
      #!/bin/sh
      /usr/bin/sudo /usr/sbin/xfs_freeze $1 $2
      ```
   
   1. Create a sudoers file called `/etc/sudoers.d/azacsnap` to allow the azacsnap user to run `xfs_freeze` with the following content:
   
      ```bash
      #
      # What: azacsnap
      # Why: Allow the azacsnap user to run "specific" commands with elevated privileges.
      #
      # User_Alias = SAP HANA Backup administrator user.
      User_Alias      AZACSNAP = azacsnap
      #
      AZACSNAP ALL=(ALL) NOPASSWD: /usr/sbin/xfs_freeze
      ```
   
   1. Test the azacsnap user can freeze and unfreeze I/O to the target mountpoint by running the following as the azacsnap user.
   
      > [!NOTE]
      > In this example we run each command twice to show it worked the first time as there's no command to confirm if `xfs_freeze` has frozen I/O.
  
      Freeze I/O.
  
      ```bash
      su - azacsnap
      xfs_freeze -f /hana/data
      xfs_freeze -f /hana/data
      ```
      
      ```output
      xfs_freeze: cannot freeze filesystem at /hana/data: Device or resource busy
      ```
  
      Unfreeze I/O.
   
      ```bash
      su - azacsnap
      xfs_freeze -u /hana/data
      xfs_freeze -u /hana/data
      ```
  
      ```output
      xfs_freeze: cannot unfreeze filesystem mounted at /hana/data: Invalid argument
      ```

### Example configuration file

Here's an example config file, note the hierarchy for the dataVolume, mountpoint, azureManagedDisks:

```output
{
  "version": "5.1 Preview",
  "logPath": "./logs",
  "securityPath": "./security",
  "comments": [],
  "database": [
    {
      "hana": {
        "serverAddress": "127.0.0.1",
        "sid": "P40",
        "instanceNumber": "00",
        "hdbUserStoreName": "AZACSNAP",
        "savePointAbortWaitSeconds": 600,
        "autoDisableEnableBackint": false,
        "hliStorage": [],
        "anfStorage": [],
        "amdStorage": [
          {
            "dataVolume": [
              {
                "mountPoint": "/hana/data",
                "azureManagedDisks": [
                  {
                    "resourceId": "/subscriptions/<sub-id>/resourceGroups/<rg-name>/providers/Microsoft.Compute/disks/<disk01>",
                    "authFile": "azureauth.json"
                  },
                  {
                    "resourceId": "/subscriptions/<sub-id>/resourceGroups/<rg-name>/providers/Microsoft.Compute/disks/<disk02>",
                    "authFile": "azureauth.json"
                  }
                ]
              }
            ],
            "otherVolume": []
          }
        ]
      },
      "oracle": null
    }
  ]
}
```

### Virtual machine storage layout

The storage hierarchy looks like the following example for SAP HANA:

- SAP HANA Database data files:
  ```output
  /hana/data/mnt00001
  ```

- Mountpoint:
  ```output
  /dev/mapper/hanadata-hanadata on /hana/data type xfs 
  ```

- Logical Volume
  ```bash
  lvdisplay
  ```
  
  ```output
  --- Logical volume ---
  LV Path                /dev/hanadata/hanadata
  LV Name                hanadata
  VG Name                hanadata
  ```
  
- Volume Group
  ```bash
  vgdisplay
  ```
  
  ```output
  --- Volume group ---
  VG Name               hanadata
  System ID
  Format                lvm2
  Metadata Areas        2
  Metadata Sequence No  2
  VG Access             read/write
  VG Status             resizable
  MAX LV                0
  Cur LV                1
  Open LV               1
  Max PV                0
  Cur PV                2
  Act PV                2
  VG Size               1023.99 GiB
  ```
  
- Physical Volume(s) (attached Azure Managed Disks)
  ```bash
  pvdisplay
  ```
  
  ```output
  --- Physical volume ---
  PV Name               /dev/sdd
  VG Name               hanadata
  PV Size               512.00 GiB / not usable 4.00 MiB
  Allocatable           yes (but full)
  PE Size               4.00 MiB
  Total PE              131071
  Free PE               0
  Allocated PE          131071
  PV UUID               K3yhxN-2713-lk4k-c3Pc-xOJQ-sCkD-8ZE6YX
  --- Physical volume ---
  PV Name               /dev/sdc
  VG Name               hanadata
  PV Size               512.00 GiB / not usable 4.00 MiB
  Allocatable           yes (but full)
  PE Size               4.00 MiB
  Total PE              131071
  Free PE               0
  Allocated PE          131071
  PV UUID               RNCylW-F3OG-G93c-1XL3-W6pw-M0XB-2mYFGV
  ```

Installing and setting up the Azure VM and Azure Managed Disks in this way follows Microsoft guidance to create LVM stripes of the Managed Disks on the VM.  

With the Azure VM set up as prescribed, AzAcSnap can take snapshots of Azure Managed Disks.  The snapshot operations are similar to those for other storage back-ends supported by AzAcSnap (for example, Azure NetApp Files, Azure Large Instance (Bare Metal)).  Because AzAcSnap communicates with the Azure Resource Manager to take snapshots, it also needs a Service Principal with the correct permissions to take managed disk snapshots.

This capability allows customers to test/trial AzAcSnap on a smaller system and scale-up to Azure NetApp Files and/or Azure Large Instance (Bare Metal).

Supported `azacsnap` command functionality with Azure Managed Disks is 'configure', 'test', 'backup', 'delete', 'details', but not yet 'restore'.

### Restore from an Azure Managed Disk snapshot

Although `azacsnap` is currently missing the `-c restore` option for Azure Managed Disks, it’s possible to restore manually as follows:

1.	Creating disks from the snapshots via the Azure portal. 

    > [!NOTE]
    > Be sure to create the disks in the same Availability Zone as the target VM.

1.	Connect the disks to the VM via the Azure portal.
1.	Log in to the VM as the `root` user and scan for the newly attached disks using dmesg or pvscan:
    
    1. Using `dmesg`:
    
       ```bash
       dmesg | tail -n30
       ```
    
       ```output
       [2510054.252801] scsi 5:0:0:2: Direct-Access     Msft     Virtual Disk     1.0  PQ:0 ANSI: 5
       [2510054.262358] scsi 5:0:0:2: Attached scsi generic sg4 type 0
       [2510054.268514] sd 5:0:0:2: [sde] 1073741824 512-byte logical blocks: (550 GB/512 GiB)
       [2510054.272583] sd 5:0:0:2: [sde] 4096-byte physical blocks
       [2510054.275465] sd 5:0:0:2: [sde] Write Protect is off
       [2510054.277915] sd 5:0:0:2: [sde] Mode Sense: 0f 00 10 00
       [2510054.278566] sd 5:0:0:2: [sde] Write cache: disabled, read cache: enabled, supports DPO and FUA
       [2510054.314269] sd 5:0:0:2: [sde] Attached SCSI disk
       [2510054.573135] scsi 5:0:0:3: Direct-Access     Msft     Virtual Disk     1.0  PQ: 0 ANSI: 5
       [2510054.579931] scsi 5:0:0:3: Attached scsi generic sg5 type 0
       [2510054.584505] sd 5:0:0:3: [sdf] 1073741824 512-byte logical blocks: (550 GB/512 GiB)
       [2510054.589293] sd 5:0:0:3: [sdf] 4096-byte physical blocks
       [2510054.592237] sd 5:0:0:3: [sdf] Write Protect is off
       [2510054.594735] sd 5:0:0:3: [sdf] Mode Sense: 0f 00 10 00
       [2510054.594839] sd 5:0:0:3: [sdf] Write cache: disabled, read cache: enabled, supports DPO and FUA
       [2510054.627310] sd 5:0:0:3: [sdf] Attached SCSI disk
       ```
    
    1. Using `pvscan`:
    
       ```bash
       saphana:~ # pvscan
       ```
    
       ```output
       WARNING: scan found duplicate PVID RNCylWF3OGG93c1XL3W6pwM0XB2mYFGV on /dev/sde
       WARNING: scan found duplicate PVID K3yhxN2713lk4kc3PcxOJQsCkD8ZE6YX on /dev/sdf
       WARNING: Not using device /dev/sde for PV RNCylW-F3OG-G93c-1XL3-W6pw-M0XB-2mYFGV.
       WARNING: Not using device /dev/sdf for PV K3yhxN-2713-lk4k-c3Pc-xOJQ-sCkD-8ZE6YX.
       WARNING: PV RNCylW-F3OG-G93c-1XL3-W6pw-M0XB-2mYFGV prefers device /dev/sdc because device is used by LV.
       WARNING: PV K3yhxN-2713-lk4k-c3Pc-xOJQ-sCkD-8ZE6YX prefers device /dev/sdd because device is used by LV.
       PV /dev/sdd   VG hanadata        lvm2 [512.00 GiB / 0    free]
       PV /dev/sdc   VG hanadata        lvm2 [512.00 GiB / 0    free]
       Total: 2 [1023.99 GiB] / in use: 2 [1023.99 GiB] / in no VG: 0 [0   ]
       ```
    
1.	Import a Volume Group Clone from the disks using `vgimportclone` as the `root` user:

    ```bash
    vgimportclone --basevgname hanadata_adhoc /dev/sde /dev/sdf
    ```
    
    ```output
    WARNING: scan found duplicate PVID RNCylWF3OGG93c1XL3W6pwM0XB2mYFGV on /dev/sde
    WARNING: scan found duplicate PVID K3yhxN2713lk4kc3PcxOJQsCkD8ZE6YX on /dev/sdf
    WARNING: Not using device /dev/sde for PV RNCylW-F3OG-G93c-1XL3-W6pw-M0XB-2mYFGV.
    WARNING: Not using device /dev/sdf for PV K3yhxN-2713-lk4k-c3Pc-xOJQ-sCkD-8ZE6YX.
    WARNING: PV RNCylW-F3OG-G93c-1XL3-W6pw-M0XB-2mYFGV prefers device /dev/sdc because device is used by LV.
    WARNING: PV K3yhxN-2713-lk4k-c3Pc-xOJQ-sCkD-8ZE6YX prefers device /dev/sdd because device is used by LV.
    ```
    
1.	Activate the Logical Volume using `pvscan` and `vgchange` as `root` user:

    ```bash
    pvscan --cache
    ```
    
    ```output
    pvscan[23761] PV /dev/sdc online.
    pvscan[23761] PV /dev/sdd online.
    pvscan[23761] PV /dev/sde online.
    pvscan[23761] PV /dev/sdf online.
    ```
    
    ```bash
    vgchange -ay hanadata_adhoc
    ```
    
    ```output
    1 logical volume(s) in volume group "hanadata_adhoc" now active
    ```
    
1.	Mount the logical volume as the `root` user:

    > [!IMPORTANT]
    > Use the `mount -o rw,nouuid` options, otherwise volume mounting will fail due to duplicate UUIDs on the VM.
    
    ```bash
    mount -o rw,nouuid /dev/hanadata_adhoc/hanadata /mnt/hanadata_adhoc
    ```

1.	Then access the data:

    ```bash
    ls /mnt/hanadata_adhoc/
    ```
    
    ```output
    software  write-test.txt
    ```



## Next steps

- [Get started](azacsnap-get-started.md)
- [Test AzAcSnap](azacsnap-cmd-ref-test.md)
- [Back up using AzAcSnap](azacsnap-cmd-ref-backup.md)
