---
title: Configure the Azure Application Consistent Snapshot tool for Azure NetApp Files
description: Learn how to run the configure command of the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files. 
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
ms.date: 08/21/2023
ms.author: phjensen
---

# Configure the Azure Application Consistent Snapshot tool

This article shows you how to run the `azacsnap -c configure` command of the Azure Application Consistent Snapshot tool (AzAcSnap) that you can use with Azure NetApp Files.

## Commands for the configuration file

You can create or edit the configuration file for AzAcSnap by using the `azacsnap -c configure` command. The command has the following options:

- `--configuration new` to create a new configuration file

- `--configuration edit` to edit an existing configuration file

- `[--configfile <config filename>]` (optional parameter) to allow for custom configuration file names

By default, the name of the configuration file is *azacsnap.json*. You can use a custom file name with the `--configfile=` parameter (for example, `--configfile=<customname>.json`).

The following example creates a configuration file for an Azure Large Instances configuration:

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

## Required values for the configuration file

The following sections provide detailed guidance on required values for the database section of the configuration file.

# [SAP HANA](#tab/sap-hana)

When you add an *SAP HANA database* to the configuration, the following values are required:

- `HANA Server's Address`: The SAP HANA server's host name or IP address.
- `HANA SID`: The SAP HANA system ID (SID).
- `HANA Instance Number`: The SAP HANA instance number.
- `HANA HDB User Store Key`: The SAP HANA user configured with permissions to run database backups.
- `Do you need AzAcSnap to automatically disable/enable backint during snapshot`: Defaults to `n` (no). You can set it to `y` (yes) to allow AzAcSnap to disable or re-enable the Backint interface. The [Backint coexistence](#backint-coexistence) section in this article explains this option in more detail.
- `Single node`: Host name and IP address of the node.
- `HSR with STONITH`: Host name and IP address of the node.
- `Scale-out (N+N, N+M)`: Current host name and IP address of the master node.
- `HSR without STONITH`: Host name and IP address of the node.
- `Multi SID on Single node`: Host name and IP address of the node that hosts those SIDs.

### Backint coexistence

The [Azure Backup](../backup/index.yml) service provides an alternate backup tool for SAP HANA. You can stream database and log backups into Azure Backup.

Some customers want to combine the streaming Backint-based backups with regular snapshot-based backups. However, Backint-based backups block other backup methods, such as using a files-based backup or a storage snapshot-based backup (for example, AzAcSnap). For more information, see [Run SAP HANA native clients backup on a database with Azure Backup](../backup/backup-azure-sap-hana-database.md#run-sap-hana-native-clients-backup-on-a-database-with-azure-backup).

The process that the Azure Backup documentation describes has been implemented with AzAcSnap to automatically do the following steps:

1. Force a log backup flush to Backint.
1. Wait for running backups to finish.
1. Disable the Backint-based backup.
1. Put SAP HANA into a consistent state for backup.
1. Take a storage snapshot-based backup.
1. Release SAP HANA.
1. Re-enable the Backint-based backup.

By default, this option is disabled. You can enable it by running `azacsnap -c configure –configuration edit` and answering `y` (yes) to the question `Do you need AzAcSnap to automatically disable/enable backint during snapshot? (y/n) [n]`.

Editing the configuration as described sets the `autoDisableEnableBackint` value to `true` in the JSON configuration file (for example, *azacsnap.json*). It's also possible to change this value by editing the configuration file directly.

# [Oracle](#tab/oracle)

When you add an Oracle database to the configuration, the following values are required:

- `Oracle DB Server's Address`: The database server's host name or IP address.
- `SID`: The database system ID.
- `Oracle Connect String`: The string that `sqlplus` uses to connect to Oracle and enable or disable backup mode.

# [IBM Db2](#tab/db2)

When you add a Db2 database to the configuration, the following values are required:

- `Db2 Server's Address`: The database server's host name or IP address.

  If `Db2 Server Address` (`serverAddress`) matches `127.0.0.1` or `localhost`, the snapshot tool runs all `db2` commands locally. Otherwise, the snapshot tool uses `serverAddress` as the host to connect to via Secure Shell (SSH), by using the `Instance User` value as the SSH login name.
  
  You can validate remote access via SSH by using `ssh <instanceUser>@<serverAddress>`. Replace `<instanceUser>` and `<serverAddress>` with the respective values.
- `Instance User`: The instance user for the database system.
- `SID`: The database system ID.

> [!IMPORTANT]
> Setting `Db2 Server Address` (`serverAddress`) aligns directly with the method that's used to communicate with Db2. Ensure that you set it correctly, as described.

---

# [Azure Large Instances (bare metal)](#tab/azure-large-instance)

When you add Azure Large Instances storage to a database section, the following values are required:

- `Storage User Name`: The user name for establishing the SSH connection to the storage.
- `Storage IP Address`: The IP address of the storage system.
- `Storage Volume Name`: The volume name to snapshot. You can determine this value in multiple ways. A simple way is to use the following shell command:

    ```bash
    grep nfs /etc/fstab | cut -f2 -d"/" | sort | uniq
    ```

    ```output
    hana_data_p40_soldub41_mnt00001_t020_vol
    hana_log_backups_p40_soldub41_t020_vol
    hana_log_p40_soldub41_mnt00001_t020_vol
    hana_shared_p40_soldub41_t020_vol
    ```

# [Azure NetApp Files (with a virtual machine)](#tab/azure-netapp-files)

When you add Azure NetApp Files storage to a database section, the following values are required:

- `Service Principal Authentication filename` (JSON field: `authFile`):
  - To use a system-managed identity, leave this field empty with no value, and then select the Enter key to go to the next field.
  
    For an example to set up an Azure system-managed identity, see [Install the Azure Application Consistent Snapshot tool](azacsnap-installation.md).
  - To use a service principal, use the name of the authentication file (for example, *authfile.json*) that's generated in Azure Cloud Shell when you're configuring communication with Azure NetApp Files storage.
  
    For an example to set up a service principal, see [Install the Azure Application Consistent Snapshot tool](azacsnap-installation.md).
- `Full ANF Storage Volume Resource ID` (JSON field: `resourceId`): The full resource ID of the volume that's being snapshot. You can retrieve this string by going to the Azure portal and then selecting **Azure NetApp Files** > **Volume** > **Settings** or **Properties** > **Resource ID**.

---

## Example configuration file

In the following example, *azacsnap.json* is configured with the one SID.

You must set the parameter values to your specific SAP HANA environment.
For an Azure Large Instances system, Microsoft Service Management provides this information as an Excel file during the call for onboarding and handover. Open a service request if you need Microsoft Service Management to send the information again.

The following output is an example configuration file only. It's the content of the file that the configuration example generates. Update all the values accordingly.

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
> For a disaster recovery (DR) scenario where you'll run backups at the DR site, the HANA server name that's configured in the DR configuration file (for example, `DR.json`) at the DR site should be the same as the production server name.
>
> For Azure Large Instances, your storage IP address must be in the same subnet as your server pool. For example, in this case, the server pool subnet is 172.18.18.0/24 and the assigned storage IP address is 172.18.18.11.

## Next steps

- [Test the Azure Application Consistent Snapshot tool](azacsnap-cmd-ref-test.md)
