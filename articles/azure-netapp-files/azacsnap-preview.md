---
title: Preview features for the Azure Application Consistent Snapshot tool for Azure NetApp Files
description: Learn about the preview features of the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files.
services: azure-netapp-files
author: Phil-Jensen
ms.service: azure-netapp-files
ms.topic: reference
ms.date: 02/01/2025
ms.author: phjensen
---

# Preview features of the Azure Application Consistent Snapshot tool

This article provides a guide on setup and usage of the new features in preview for the Azure Application Consistent Snapshot tool (AzAcSnap). For basic information about the tool, see [What is the Azure Application Consistent Snapshot tool?](./azacsnap-introduction.md).

The preview features provided with AzAcSnap 11 are:

- Azure NetApp Files backup
- Azure managed disks

> [!NOTE]
> Previews are provided "as is," "with all faults," and "as available," and are excluded from the service-level agreements and may not be covered by customer support.
> Previews are subject to the supplemental terms of use for Microsoft Azure Previews found at https://azure.microsoft.com/support/legal/preview-supplemental-terms/

## Using AzAcSnap preview features

AzAcSnap preview features are offered together with generally available features. Using the preview features requires the use of the `--preview` command-line option. To set up and install AzAcSnap, see [Get started with the Azure Application Consistent Snapshot tool](azacsnap-get-started.md).

## Providing feedback

You can provide feedback on AzAcSnap, including this preview, [online](https://aka.ms/azacsnap-feedback).

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

Microsoft provides many storage options for deploying databases such as SAP HANA. For details about some of these options, see [Azure Storage types for SAP workload](/azure/virtual-machines/workloads/sap/planning-guide-storage). There's also a [cost-conscious solution with Azure premium storage](/azure/virtual-machines/workloads/sap/hana-vm-premium-ssd-v1#cost-conscious-solution-with-azure-premium-storage).

AzAcSnap can take application-consistent database snapshots when you deploy it on this type of architecture (that is, a virtual machine [VM] with managed disks). But the setup for this platform is slightly more complicated because in this scenario AzAcSnap takes an additional step to try and flush all I/O buffers and ensure they are written out to persistent storage.  On Linux AzAcSnap will call the `sync` command to flush file buffers, on Windows it uses the kernel call to FlushFileBuffers, before it takes a snapshot of the managed disks in the mounted logical volumes.

> [!IMPORTANT]
> AzAcSnap will need appropriate operating system permissions for the volume so it can perform the flush.

Here's the architecture at a high level:

1. Attach Azure managed disks to the VM by using the Azure portal.
1. Create a logical volume from these managed disks.
1. Mount the logical volume to a Linux directory.
1. Enable communication in the same way as for Azure NetApp Files in the [AzAcSnap installation](azacsnap-configure-storage.md?tabs=azure-netapp-files#enable-communication-with-storage).
1. Install and configure AzAcSnap.

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
        "storage": [
          {
            "dataVolumes": [
              {
                "mountPoint": "/hana/data",
                "aliStorageResources": [
                "azureManagedDisks": [
                  {
                    "resourceId": "/subscriptions/<sub-id>/resourceGroups/<rg-name>/providers/Microsoft.Compute/disks/<disk01>",
                    "authFile": ""
                  },
                  {
                    "resourceId": "/subscriptions/<sub-id>/resourceGroups/<rg-name>/providers/Microsoft.Compute/disks/<disk02>",
                    "authFile": ""
                  }
                ]
              }
            ]
          }
        ]
      }
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
