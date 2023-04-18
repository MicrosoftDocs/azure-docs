---
title: Configure Azure Application Consistent Snapshot tool for Azure NetApp Files | Microsoft Docs
description: Provides a guide for running the configure command of the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files. 
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
ms.date: 08/19/2022
ms.author: phjensen
---

# Configure Azure Application Consistent Snapshot tool

This article provides a guide for running the configure command of the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files.

## Introduction

The configuration file can be created or edited by using the `azacsnap -c configure` command.

## Command options

The `-c configure` command has the following options

- `--configuration new` to create a new configuration file.

- `--configuration edit` to edit an existing configuration file.

- `[--configfile <config filename>]` is an optional parameter allowing for custom configuration file names.

## Configuration file for snapshot tools

A configuration file can be created by running `azacsnap -c configure --configuration new`.  By default the configuration filename is `azacsnap.json`.  A custom file name can be used with the `--configfile=` parameter (for example, `--configfile=<customname>.json`)
The following example is for Azure Large Instance configuration:

```bash
azacsnap -c configure --configuration new
```

```output
Building new config file
Add comment to config file (blank entry to exit adding comments): This is a new config file for AzAcSnap 6
Add comment to config file (blank entry to exit adding comments):
Enter the database type to add, 'hana', 'oracle', or 'exit' (for no database): hana

=== Add SAP HANA Database details ===
HANA SID (e.g. H80): H80
HANA Instance Number (e.g. 00): 00
HANA HDB User Store Key (e.g. `hdbuserstore List`): AZACSNAP
HANA Server's Address (hostname or IP address): testing01
Do you need AzAcSnap to automatically disable/enable backint during snapshot? (y/n) [n]:

=== Azure NetApp Files Storage details ===
Are you using Azure NetApp Files for the database? (y/n) [n]:

=== Azure Managed Disk details ===
Are you using Azure Managed Disks for the database? (y/n) [n]:

=== Azure Large Instance (Bare Metal) Storage details ===
Are you using Azure Large Instance (Bare Metal) for the database? (y/n) [n]: y
--- DATA Volumes have the Application put into a consistent state before they are snapshot ---
Add Azure Large Instance (Bare Metal) resource to DATA Volume section of Database configuration? (y/n) [n]: y
Storage User Name (e.g. clbackup25): clt1h80backup
Storage IP Address (e.g. 192.168.1.30): 172.18.18.11
Storage Volume Name (e.g. hana_data_soldub41_t250_vol): hana_data_h80_testing01_mnt00001_t020_vol
Add Azure Large Instance (Bare Metal) resource to DATA Volume section of Database configuration? (y/n) [n]: n
--- OTHER Volumes are snapshot immediately without preparing any application for snapshot ---
Add Azure Large Instance (Bare Metal) resource to OTHER Volume section of Database configuration? (y/n) [n]: n

Enter the database type to add, 'hana', 'oracle', or 'exit' (for no database): exit


Editing configuration complete, writing output to 'azacsnap.json'
```

## Details of required values

The following sections provide detailed guidance on the various values required for the configuration file.

Database section

# [SAP HANA](#tab/sap-hana)

When you add an *SAP HANA database* to the configuration, the following values are required:

- **HANA Server's Address** = The SAP HANA server hostname or IP address.
- **HANA SID** = The SAP HANA System ID.
- **HANA Instance Number** = The SAP HANA Instance Number.
- **HANA HDB User Store Key** = The SAP HANA user configured with permissions to run database backups.
- **Do you need AzAcSnap to automatically disable/enable backint during snapshot** - defaults to NO, can be set to YES to allow AzAcSnap to disable/re-enable the backint interface (see notes on **Backint coexistence**).

- Single node: IP and Hostname of the node
- HSR with STONITH: IP and Hostname of the node
- Scale-out (N+N, N+M): Current master node IP and host name
- HSR without STONITH: IP and Hostname of the node
- Multi SID on Single node: Hostname and IP of the node hosting those SIDs

### Backint coexistence

[Azure Backup](../backup/index.yml) service provides an alternate backup tool for SAP HANA, where database and log backups are streamed into the 
Azure Backup Service.  Some customers would like to combine the streaming backint-based backups with regular snapshot-based backups.  However, backint-based 
backups block other methods of backup, such as using a files-based backup or a storage snapshot-based backup (for example, AzAcSnap).  Guidance is provided on the Azure Backup site on how to [Run SAP HANA native clients backup on a database with Azure Backup enabled](../backup/backup-azure-sap-hana-database.md#run-sap-hana-native-clients-backup-on-a-database-with-azure-backup). 

The process described in the Azure Backup documentation has been implemented with AzAcSnap to automatically do the following steps:

1. force a log backup flush to backint.
1. wait for running backups to complete.
1. disable the backint-based backup.
1. put SAP HANA into a consistent state for backup.
1. take a storage snapshot-based backup.
1. release SAP HANA.
1. re-enable the backint-based backup.

By default this option is disabled, but it can be enabled by running `azacsnap -c configure –configuration edit` and answering ‘y’ (yes) to the question 
“Do you need AzAcSnap to automatically disable/enable backint during snapshot? (y/n) [n]”.  Editing the configuration as described will set the 
autoDisableEnableBackint value to true in the JSON configuration file (for example, `azacsnap.json`).  It's also possible to change this value by editing 
the configuration file directly.

# [Oracle](#tab/oracle)

When you add an *Oracle database* to the configuration, the following values are required:

- **Oracle DB Server's Address** = The database server hostname or IP address.
- **SID** = The database System ID.
- **Oracle Connect String** = The Connect String used by `sqlplus` to connect to Oracle and enable/disable backup mode.

---

# [Azure Large Instance (Bare Metal)](#tab/azure-large-instance)

When you add *HLI Storage* to a database section, the following values are required:

- **Storage User Name** = This value is the user name used to establish the SSH connection to the Storage.
- **Storage IP Address** = The address of the Storage system.
- **Storage Volume Name** = the volume name to snapshot.  This value can be determined multiple ways, perhaps the
   simplest is to try the following shell command:

    ```bash
    grep nfs /etc/fstab | cut -f2 -d"/" | sort | uniq
    ```

    ```output
    hana_data_p40_soldub41_mnt00001_t020_vol
    hana_log_backups_p40_soldub41_t020_vol
    hana_log_p40_soldub41_mnt00001_t020_vol
    hana_shared_p40_soldub41_t020_vol
    ```

# [Azure NetApp Files (with VM)](#tab/azure-netapp-files)

When you add *ANF Storage* to a database section, the following values are required:

- **Service Principal Authentication filename** = the `authfile.json` file generated in the Cloud Shell when configuring
    communication with Azure NetApp Files storage.
- **Full ANF Storage Volume Resource ID** = the full Resource ID of the Volume being snapshot.  This string can be retrieved from:
    Azure portal –> ANF –> Volume –> Settings/Properties –> Resource ID

---

## Configuration file overview (`azacsnap.json`)

In the following example, the `azacsnap.json` is configured with the one SID.

The parameter values must be set to the customer's specific SAP HANA environment.
For **Azure Large Instance** system, this information is provided by Microsoft Service Management during the onboarding/handover call, and
is made available in an Excel file that is provided during handover. Open a service request if you
need to be provided this information again.

The following output is an example configuration file only and is the content of the file as generated by the configuration session above, update all the values accordingly.

```bash
cat azacsnap.json
```

```output
{
  "version": "6",
  "logPath": "./logs",
  "securityPath": "./security",
  "comments": [
    "This is a new config file for AzAcSnap 6"
  ],
  "database": [
    {
      "hana": {
        "serverAddress": "testing01",
        "sid": "H80",
        "instanceNumber": "00",
        "hdbUserStoreName": "AZACSNAP",
        "savePointAbortWaitSeconds": 600,
        "autoDisableEnableBackint": false,
        "hliStorage": [
          {
            "dataVolume": [
              {
                "backupName": "clt1h80backup",
                "ipAddress": "172.18.18.11",
                "volume": "hana_data_h80_testing01_mnt00001_t020_vol"
              }
            ],
            "otherVolume": []
          }
        ],
        "anfStorage": [],
        "amdStorage": []
      },
      "oracle": null
    }
  ]
}
```

> [!NOTE]
> For a DR scenario where backups are to be run at the DR site, then the HANA Server Name configured in the DR configuration file
> (for example, `DR.json`) at the DR site should be the same as the production server name.

> [!NOTE]
> For Azure Large Instance your storage IP address must be in the same subnet as your server pool. For example, in this case, our 
> server pool subnet is 172. 18. 18 .0/24 and our assigned storage IP is 172.18.18.11.

## Next steps

- [Test Azure Application Consistent Snapshot tool](azacsnap-cmd-ref-test.md)
