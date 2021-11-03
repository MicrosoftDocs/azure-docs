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
ms.devlang: na
ms.topic: reference
ms.date: 04/21/2021
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
Add comment to config file (blank entry to exit adding comments):This is a new config file for `azacsnap`
Add comment to config file (blank entry to exit adding comments):
Add database to config? (y/n) [n]: y
HANA SID (for example, H80): H80
HANA Instance Number (for example, 00): 00
HANA HDB User Store Key (for example, `hdbuserstore List`): AZACSNAP
HANA Server's Address (hostname or IP address): testing01
Add ANF Storage to database section? (y/n) [n]:
Add HLI Storage to database section? (y/n) [n]: y
Add DATA Volume to HLI Storage section of Database section? (y/n) [n]: y
Storage User Name (for example, clbackup25): clt1h80backup
Storage IP Address (for example, 192.168.1.30): 172.18.18.11
Storage Volume Name (for example, hana_data_h80_testing01_mnt00001_t250_vol): hana_data_h80_testing01_mnt00001_t020_vol
Add DATA Volume to HLI Storage section of Database section? (y/n) [n]:
Add OTHER Volume to HLI Storage section of Database section? (y/n) [n]:
Add HLI Storage to database section? (y/n) [n]:
Add database to config? (y/n) [n]:
Editing configuration complete, writing output to 'azacsnap.json'
```

## Details of required values

The following sections provide detailed guidance on the various values required for the configuration file.

### SAP HANA values

When adding a *database* to the configuration, the following values are required:

- **HANA Server's Address** = The SAP HANA server hostname or IP address.
- **HANA SID** = The SAP HANA System ID.
- **HANA Instance Number** = The SAP HANA Instance Number.
- **HANA HDB User Store Key** = The SAP HANA user configured with permissions to run database backups.

- Single node: IP and Hostname of the node
- HSR with STONITH: IP and Hostname of the node
- Scale-out (N+N, N+M): Current master node IP and host name
- HSR without STONITH: IP and Hostname of the node
- Multi SID on Single node: Hostname and IP of the node hosting those SIDs

### Azure Large Instance (HLI) storage values

When adding *HLI Storage* to a database section, the following values are required:

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

### Azure NetApp Files (ANF) storage values

When adding *ANF Storage* to a database section, the following values are required:

- **Service Principal Authentication filename** = this is the `authfile.json` file generated in the Cloud Shell when configuring
    communication with Azure NetApp Files storage.
- **Full ANF Storage Volume Resource ID** = the full Resource ID of the Volume being snapshot.  This can be retrieved from:
    Azure portal –> ANF –> Volume –> Settings/Properties –> Resource ID

## Configuration file overview (`azacsnap.json`)

In the following example, the `azacsnap.json` is configured with the one SID.

The parameter values must be set to the customer's specific SAP HANA environment.
For **Azure Large Instance** system, this information is provided by Microsoft Service Management during the onboarding/handover call, and
is made available in an Excel file that is provided during handover. Open a service request if you
need to be provided this information again.

The following is an example only, update all the values accordingly.

```bash
cat azacsnap.json
```

```output
{
  "version": "5.0",
  "logPath": "./logs",
  "securityPath": "./security",
  "comments": [],
  "database": [
    {
      "hana": {
        "serverAddress": "sapprdhdb80",
        "sid": "H80",
        "instanceNumber": "00",
        "hdbUserStoreName": "SCADMIN",
        "savePointAbortWaitSeconds": 600,
        "hliStorage": [
          {
            "dataVolume": [
              {
                "backupName": "clt1h80backup",
                "ipAddress": "172.18.18.11",
                "volume": "hana_data_h80_azsollabbl20a31_mnt00001_t210_vol"
              },
              {
                "backupName": "clt1h80backup",
                "ipAddress": "172.18.18.11",
                "volume": "hana_shared_h80_azsollabbl20a31_t210_vol"
              }
            ],
            "otherVolume": [
              {
                "backupName": "clt1h80backup",
                "ipAddress": "172.18.18.11",
                "volume": "hana_log_backups_h80_azsollabbl20a31_t210_vol"
              }
            ]
          }
        ],
        "anfStorage": []
      }
    }
  ]
}
```

> [!NOTE]
> For a DR scenario where backups are to be run at the DR site, then the HANA Server Name
configured in the DR configuration file (for example, `DR.json`) at the DR site should be the same as
the production server name.

> [!NOTE]
> For Azure Large Instance your storage IP address must be in the same subnet as your server pool. For example, in
this case, our server pool subnet is 172. 18. 18 .0/24 and our assigned storage IP is 172.18.18.11.

## Next steps

- [Test Azure Application Consistent Snapshot tool](azacsnap-cmd-ref-test.md)
