---
title: Preview features for Azure Application Consistent Snapshot tool for Azure NetApp Files | Microsoft Docs
description: Provides a guide for using the preview features of the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: Phil-Jensen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: reference
ms.date: 07/29/2022
ms.author: phjensen
---

# Preview features of Azure Application Consistent Snapshot tool

> [!NOTE]
> PREVIEWS ARE PROVIDED "AS-IS," "WITH ALL FAULTS," AND "AS AVAILABLE," AND ARE EXCLUDED FROM THE SERVICE LEVEL AGREEMENTS AND LIMITED WARRANTY
> ref:  https://azure.microsoft.com/support/legal/preview-supplemental-terms/

This article provides a guide on set up and usage of the new features in preview for **AzAcSnap**.  This guide should be read along with the main
documentation for AzAcSnap at [aka.ms/azacsnap](./azacsnap-introduction.md).

The preview features provided with **AzAcSnap 6** are:
- Azure Managed Disk.
- Azure Key Vault support for storing Service Principal.

## Providing feedback

Feedback on AzAcSnap, including this preview, can be provided [online](https://aka.ms/azacsnap-feedback).

## Getting the AzAcSnap Preview snapshot tools

Refer to [Get started with Azure Application Consistent Snapshot tool](azacsnap-get-started.md)

Return to this document for details on using the preview features.

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



## Azure Key Vault

From AzAcSnap v5.1, it's possible to store the Service Principal securely as a Secret in Azure Key Vault.  Using this feature allows for centralization of Service Principal credentials
where an alternate administrator can set up the Secret for AzAcSnap to use.

The steps to follow to set up Azure Key Vault and store the Service Principal in a Secret are as follows:

1. Within an Azure Cloud Shell session, make sure you're logged on at the subscription where you want to create the Azure Key Vault:

    ```azurecli-interactive
    az account show
    ```

1. If the subscription isn't correct, use the following command to set the Cloud Shell to the correct subscription:

    ```azurecli-interactive
    az account set -s <subscription name or id>
    ```

1. Create Azure Key Vault

    ```azurecli-interactive
    az keyvault create --name "<AzureKeyVaultName>" -g <ResourceGroupName>
    ```

1. Create the trust relationship and assign the policy for virtual machine to get the Secret

   1. Show AzAcSnap virtual machine Identity
      
      If the virtual machine already has an identity created, retrieve it as follows:
      
      ```azurecli-interactive
      az vm identity show --name "<VMName>" --resource-group "<ResourceGroup>"
      ```
      
      The `"principalId"` in the output is used as the `--object-id` value when setting the Policy with `az keyvault set-policy`.
      
      ```output
      {
        "principalId": "99z999zz-99z9-99zz-99zz-9z9zz999zz99",
        "tenantId": "99z999zz-99z9-99zz-99zz-9z9zz999zz99",
        "type": "SystemAssigned, UserAssigned",
        "userAssignedIdentities": { 
          "/subscriptions/99z999zz-99z9-99zz-99zz-9z9zz999zz99/resourceGroups/AzSecPackAutoConfigRG/providers/Microsoft.ManagedIdentity/userAssignedIdentities/AzSecPackAutoConfigUA-eastus2": {
            "clientId": "99z999zz-99z9-99zz-99zz-9z9zz999zz99",
            "principalId": "99z999zz-99z9-99zz-99zz-9z9zz999zz99"
          }
        }
      }
      ```

   1. Set AzAcSnap virtual machine Identity (if necessary)
   
      If the VM doesn't have an identity, create it as follows:
      
      ```azurecli-interactive
      az vm identity assign --name "<VMName>" --resource-group "<ResourceGroup>"
      ```
      
      The `"systemAssignedIdentity"` in the output is used as the `--object-id` value when setting the Policy with `az keyvault set-policy`.
      
      ```output
      {
        "systemAssignedIdentity": "99z999zz-99z9-99zz-99zz-9z9zz999zz99",
        "userAssignedIdentities": {
          "/subscriptions/99z999zz-99z9-99zz-99zz-  9z9zz999zz99/resourceGroups/AzSecPackAutoConfigRG/providers/Microsoft.ManagedIdentity/userAssignedIdentities/AzSecPackAutoConfigUA-eastus2": {
            "clientId": "99z999zz-99z9-99zz-99zz-9z9zz999zz99",
            "principalId": "99z999zz-99z9-99zz-99zz-9z9zz999zz99"
          }
        }
      }
      ```

   1. Assign a suitable policy for the virtual machine to be able to retrieve the Secret from the Key Vault.

      ```azurecli-interactive
      az keyvault set-policy --name "<AzureKeyVaultName>" --object-id "<VMIdentity>" --secret-permissions get
      ```

1. Create Azure Key Vault Secret

   Create the secret, which will store the Service Principal credential information.
   
   It's possible to paste the contents of the Service Principal. In the **Bash** Cloud Shell below a single apostrophe character is put after value then 
   press the `[Enter]` key, then paste the contents of the Service Principal, close the content by adding another single apostrophe and press the `[Enter]` key.  
   This command should create the Secret and store it in Azure Key Vault.
   
   > [!TIP] 
   > If you have a separate Service Principal per installation the `"<NameOfSecret>"` could be the SID, or some other suitable unique identifier.
  
   Following example is for using the **Bash** Cloud Shell:

    ```azurecli-interactive
    az keyvault secret set --name "<NameOfSecret>" --vault-name "<AzureKeyVaultName>" --value '
    {
      "clientId": "99z999zz-99z9-99zz-99zz-9z9zz999zz99",
      "clientSecret": "<ClientSecret>",
      "subscriptionId": "99z999zz-99z9-99zz-99zz-9z9zz999zz99",
      "tenantId": "99z999zz-99z9-99zz-99zz-9z9zz999zz99",
      "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
      "resourceManagerEndpointUrl": "https://management.azure.com/",
      "activeDirectoryGraphResourceId": "https://graph.windows.net/",
      "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
      "galleryEndpointUrl": "https://gallery.azure.com/",
      "managementEndpointUrl": "https://management.core.windows.net/"
    }'
    ```

    Following example is for using the **PowerShell** Cloud Shell:

    > [!WARNING] 
    > In PowerShell the double quotes have to be escaped with an additional double quote, so one double quote (") becomes two double quotes ("").

    ```azurecli-interactive
    az keyvault secret set --name "<NameOfSecret>" --vault-name "<AzureKeyVaultName>" --value '
    {
      ""clientId"": ""99z999zz-99z9-99zz-99zz-9z9zz999zz99"",
      ""clientSecret"": ""<ClientSecret>"",
      ""subscriptionId"": ""99z999zz-99z9-99zz-99zz-9z9zz999zz99"",
      ""tenantId"": ""99z999zz-99z9-99zz-99zz-9z9zz999zz99"",
      ""activeDirectoryEndpointUrl"": ""https://login.microsoftonline.com"",
      ""resourceManagerEndpointUrl"": ""https://management.azure.com/"",
      ""activeDirectoryGraphResourceId"": ""https://graph.windows.net/"",
      ""sqlManagementEndpointUrl"": ""https://management.core.windows.net:8443/"",
      ""galleryEndpointUrl"": ""https://gallery.azure.com/"",
      ""managementEndpointUrl"": ""https://management.core.windows.net/""
    }'
    ```

    The output of the command `az keyvault secret set` will have the URI value to use as `"authFile"` entry in the AzAcSnap JSON configuration file.  The URI is
    the value of the `"id"` below (for example, `"https://<AzureKeyVaultName>.vault.azure.net/secrets/<NameOfSecret>/z9999999z9999999z9999999"`).

    ```output
    {
      "attributes": {
        "created": "2022-02-23T20:21:01+00:00",
        "enabled": true,
        "expires": null,
        "notBefore": null,
        "recoveryLevel": "Recoverable+Purgeable",
        "updated": "2022-02-23T20:21:01+00:00"
      },
      "contentType": null,
      "id": "https://<AzureKeyVaultName>.vault.azure.net/secrets/<NameOfSecret>/z9999999z9999999z9999999",
      "kid": null,
      "managed": null,
      "name": "AzureAuth",
      "tags": {
        "file-encoding": "utf-8"
      },
      "value": "\n{\n  \"clientId\": \"99z999zz-99z9-99zz-99zz-9z9zz999zz99\",\n  \"clientSecret\": \"<ClientSecret>\",\n  \"subscriptionId\": \"99z999zz-99z9-99zz-99zz-9z9zz999zz99\",\n  \"tenantId\": \"99z999zz-99z9-99zz-99zz-9z9zz999zz99\",\n  \"activeDirectoryEndpointUrl\": \"https://login.microsoftonline.com\",\n  \"resourceManagerEndpointUrl\": \"https://management.azure.com/\",\n  \"activeDirectoryGraphResourceId\": \"https://graph.windows.net/\",\n  \"sqlManagementEndpointUrl\": \"https://management.core.windows.net:8443/\",\n  \"galleryEndpointUrl\": \"https://gallery.azure.com/\",\n  \"managementEndpointUrl\": \"https://management.core.windows.net/\"\n}"
    }
    ```

1. Update AzAcSnap JSON configuration file

   Replace the value for the authFile entry with the Secret's ID value.  Making this change can be done by editing the file using a tool like `vi`, or by using the 
   `azacsnap -c configure --configuration edit` option.

    1. Old Value
  
      ```output
      "authFile": "azureauth.json"
      ```
  
    1. New Value
  
      ```output
      "authFile": "https://<AzureKeyVaultName>.vault.azure.net/secrets/<NameOfSecret>/z9999999z9999999z9999999"
      ```


## Next steps

- [Get started](azacsnap-get-started.md)
- [Test AzAcSnap](azacsnap-cmd-ref-test.md)
- [Back up using AzAcSnap](azacsnap-cmd-ref-backup.md)