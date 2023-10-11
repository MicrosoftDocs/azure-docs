---
title: Preview features for the Azure Application Consistent Snapshot tool for Azure NetApp Files
description: Learn about the preview features of the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files. 
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

# Preview features of the Azure Application Consistent Snapshot tool

This article provides a guide on setup and usage of the new features in preview for the Azure Application Consistent Snapshot tool (AzAcSnap). For basic information about the tool, see [What is the Azure Application Consistent Snapshot tool?](./azacsnap-introduction.md).

The preview features provided with AzAcSnap 9 are:

- Azure NetApp Files backup
- Azure managed disks

> [!NOTE]
> Previews are provided "as is," "with all faults," and "as available." They're excluded from the service-level agreements and limited warranty. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Providing feedback

You can provide feedback on AzAcSnap, including this preview, [online](https://aka.ms/azacsnap-feedback).

## Using AzAcSnap preview features

AzAcSnap preview features are offered together with generally available features. Using the preview features requires the use of the `--preview` command-line option. To set up and install AzAcSnap, see [Get started with the Azure Application Consistent Snapshot tool](azacsnap-get-started.md).

## Azure NetApp Files backup

When you're taking snapshots by using AzAcSnap on multiple volumes, all the snapshots have the same name by default. Due to the removal of the volume name from the resource ID hierarchy when the snapshot is archived into an Azure NetApp Files backup, you must ensure that the snapshot name is unique.

AzAcSnap can automatically ensure the use of a unique name when it creates the snapshot, by appending the volume name to the normal snapshot name. For example, for a system that has two data volumes (`hanadata01`, `hanadata02`) when you're using `-c backup` with `--prefix daily`, the complete snapshot names become `daily__F2AFDF98703__hanadata01` and `daily__F2AFDF98703__hanadata02`.

You can enable this feature in AzAcSnap by setting `"anfBackup": "renameOnly"` in the configuration file, as the following snippet shows:

```output
"anfStorage": [
  {
    "anfBackup" : "renameOnly",
    "dataVolume": [
```

You can also enable this feature by using `azacsnap -c configure --configuration edit --configfile <configfilename>`. For `Enter new value for 'ANF Backup (none, renameOnly)' (current = 'none'):`, enter `renameOnly`.

For more information about this feature, see [Configure the Azure Application Consistent Snapshot tool](azacsnap-cmd-ref-configure.md).

## Azure managed disks

Microsoft provides many storage options for deploying databases such as SAP HANA. For details about some of these options, see [Azure Storage types for SAP workload](../virtual-machines/workloads/sap/planning-guide-storage.md). There's also a [cost-conscious solution with Azure premium storage](../virtual-machines/workloads/sap/hana-vm-premium-ssd-v1.md#cost-conscious-solution-with-azure-premium-storage).

AzAcSnap can take application-consistent database snapshots when you deploy it on this type of architecture (that is, a virtual machine [VM] with managed disks). But the setup for this platform is slightly more complicated because in this scenario, you need to block I/O to the mount point (by using `xfs_freeze`) before you take a snapshot of the managed disks in the mounted logical volumes.

> [!IMPORTANT]
> The Linux system must have `xfs_freeze` available to block disk I/O.

Take extra care to configure AzAcSnap with the correct mount points (file systems), because `xfs_freeze` blocks I/O to the device that the Azure managed disk's mount point specifies. This behavior could inadvertently block a running application until `azacsnap` finishes running.

Here's the architecture at a high level:

1. Attach Azure managed disks to the VM by using the Azure portal.
1. Create a logical volume from these managed disks.
1. Mount the logical volume to a Linux directory.
1. Create the service principal in the same way as for Azure NetApp Files in the [AzAcSnap installation](azacsnap-installation.md?tabs=azure-netapp-files%2Csap-hana#enable-communication-with-storage).
1. Install and configure AzAcSnap.

   The configurator has a new option to define the mount point for the logical volume. After you put the database into backup mode and after the I/O cache is flushed (dependent on Linux kernel parameter `fs.xfs.xfssyncd_centisecs`), this parameter is passed to `xfs_freeze` to block the I/O.
1. Install and configure `xfs_freeze` to be run as a non-privileged user:

   1. Create an executable file called `$HOME/bin/xfs_freeze` with the following content:

      ```bash
      #!/bin/sh
      /usr/bin/sudo /usr/sbin/xfs_freeze $1 $2
      ```

   1. Create a sudoers file called `/etc/sudoers.d/azacsnap` to allow the `azacsnap` user to run `xfs_freeze` with the following content:

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

   1. Test that the `azacsnap` user can freeze and unfreeze I/O to the target mount point by running the following code as the `azacsnap` user.

      This example runs each command twice to show that it worked the first time, because there's no command to confirm if `xfs_freeze` has frozen I/O.
  
      Freeze I/O:
  
      ```bash
      su - azacsnap
      xfs_freeze -f /hana/data
      xfs_freeze -f /hana/data
      ```

      ```output
      xfs_freeze: cannot freeze filesystem at /hana/data: Device or resource busy
      ```
  
      Unfreeze I/O:

      ```bash
      su - azacsnap
      xfs_freeze -u /hana/data
      xfs_freeze -u /hana/data
      ```
  
      ```output
      xfs_freeze: cannot unfreeze filesystem mounted at /hana/data: Invalid argument
      ```

For more information about using Azure managed disks as a storage back end, see [Configure the Azure Application Consistent Snapshot tool](azacsnap-cmd-ref-configure.md).

### Example configuration file

Here's an example configuration file. Note the hierarchy for `dataVolume`, `mountPoint`, and `azureManagedDisks`.

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

- Data files for the SAP HANA database:

  ```output
  /hana/data/mnt00001
  ```

- Mount point:

  ```output
  /dev/mapper/hanadata-hanadata on /hana/data type xfs 
  ```

- Logical volume:

  ```bash
  lvdisplay
  ```
  
  ```output
  --- Logical volume ---
  LV Path                /dev/hanadata/hanadata
  LV Name                hanadata
  VG Name                hanadata
  ```
  
- Volume group:

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
  
- Physical volumes (attached Azure managed disks):

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

Installing and setting up the Azure VM and Azure managed disks in this way follows Microsoft guidance to create Logical Volume Manager (LVM) stripes of the managed disks on the VM.

With the Azure VM set up as prescribed, AzAcSnap can take snapshots of Azure managed disks. The snapshot operations are similar to those for other storage back ends that AzAcSnap supports; for example, Azure NetApp Files or Azure Large Instances (bare metal). Because AzAcSnap communicates with Azure Resource Manager to take snapshots, it also needs a service principal with the correct permissions to take managed disk snapshots.

This capability allows customers to test AzAcSnap on a smaller system and scale up to Azure NetApp Files and/or Azure Large Instances (bare metal).

Supported `azacsnap` command functionality with Azure managed disks is `configure`, `test`, `backup`, `delete`, and `details`, but not yet `restore`.

### Restore from an Azure managed disk snapshot

Although `azacsnap` is currently missing the `-c restore` option for Azure managed disks, it's possible to restore manually as follows:

1. Create disks from the snapshots via the Azure portal.

   Be sure to create the disks in the same availability zone as the target VM.

1. Connect the disks to the VM via the Azure portal.
1. Log in to the VM as the root user and scan for the newly attached disks by using `dmesg` or `pvscan`:

    - Using `dmesg`:

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

    - Using `pvscan`:

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

1. Import a volume group clone from the disks by using `vgimportclone` as the root user:

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

1. Activate the logical volume by using `pvscan` and `vgchange` as the root user:

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

1. Mount the logical volume as the root user.

   Use the `mount -o rw,nouuid` options. Otherwise, volume mounting will fail because of duplicate UUIDs (universally unique identifiers) on the VM.

    ```bash
    mount -o rw,nouuid /dev/hanadata_adhoc/hanadata /mnt/hanadata_adhoc
    ```

1. Access the data:

    ```bash
    ls /mnt/hanadata_adhoc/
    ```

    ```output
    software  write-test.txt
    ```

## Next steps

- [Get started with the Azure Application Consistent Snapshot tool](azacsnap-get-started.md)
- [Test the Azure Application Consistent Snapshot tool](azacsnap-cmd-ref-test.md)
- [Back up using the Azure Application Consistent Snapshot tool](azacsnap-cmd-ref-backup.md)
