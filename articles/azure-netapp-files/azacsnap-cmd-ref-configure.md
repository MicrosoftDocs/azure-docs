---
title: Configure the Azure Application Consistent Snapshot tool for Azure NetApp Files
description: Learn how to run the configure command of the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files.
services: azure-netapp-files
author: Phil-Jensen
ms.service: azure-netapp-files
ms.topic: reference
ms.date: 04/23/2025
ms.author: phjensen
# Customer intent: "As a database administrator, I want to configure the Azure Application Consistent Snapshot tool for Azure NetApp Files, so that I can ensure consistent snapshots of my databases for backup and recovery purposes."
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

### Example for SAP HANA with Azure NetApp Files storage

```output
+----------------------------------------------------------+
+  For details on configuring AzAcSnap please visit        +
+          https://aka.ms/azacsnap-configure               +
+----------------------------------------------------------+
Building new config file

Q. Add comment #1 to config file (blank entry to exit adding comments)?
A. This is a new config file for AzAcSnap 11 with SAP HANA and Azure NetApp Files

Q. Add comment #2 to config file (blank entry to exit adding comments)?
A.

Q. Enter the database type to add, 'hana', 'oracle', 'db2', 'mssql',
   'exit' (to abort without saving), 'save' (to save and exit)?
A. hana

Checking for SAP HANA external program dependency 'hdbsql'
External dependency 'hdbsql' found.

=== Add SAP HANA details ===

Q. What is the SAP HANA SID (e.g. H80)?
A. H81

Q. What is the SAP HANA Instance Number (e.g. 00)?
A. 00

Q. What is the SAP HANA HDB User Store Key (e.g. `hdbuserstore List`)?
A. AZACSNAP

Q. What is the SAP HANA Server's Address (hostname or IP address)?
A. saphana1

Q. Do you need AzAcSnap to automatically disable/enable backint during snapshot?
   ('y' for yes, 'n' for no) [default='n']
A.

=== Add Hana Storage section ===

Q. Do you want to add Hana database Storage?
   ('y' for yes, 'n' for no)
A. y

--- DATA Volumes are specially prepared before they are snapshot ---

Q. Do you want to add Hana storage + DataVolume #1?
   ('y' for yes, 'n' for no)
A. y

Q. Do you want to add Hana storage + DataVolume #1 + Azure NetApp Files entry #1?
   ('y' for yes, 'n' for no)
A. y

Q. What is the Hana storage + DataVolume #1 + Azure NetApp Files entry #1 + ResourceId?
  (e.g. /subscriptions/.../resourceGroups/.../providers/Microsoft.NetApp/netAppAccounts/.../capacityPools/Premium/volumes/...)?
A. /subscriptions/99999999-9zz9-9z99-z9z9-z999z999zzz9/resourceGroups/saphanasystems/providers/Microsoft.NetApp/netAppAccounts/saphanaanf/capacityPools/Premium/volumes/HANADATA01

Q. What is the Hana storage + DataVolume #1 + Azure NetApp Files entry #1 + Service Principal AuthenticationFile
   (e.g. auth-file.json or <blank> if using Azure Managed ID)?
A.
Hana storage + DataVolume #1 + Azure NetApp Files entry #1 (added)


Q. Do you want to add Hana storage + DataVolume #1 + Azure NetApp Files entry #2?
   ('y' for yes, 'n' for no)
A. n

Q. Do you want to add Hana storage + DataVolume #1 + Azure Large Instance entry #1?
   ('y' for yes, 'n' for no)
A. n

Q. Do you want to add Hana storage + DataVolume #1 + Azure Managed Disk entry #1?
   ('y' for yes, 'n' for no)
A. n

Q. Do you want to add Hana storage + DataVolume #2?
   ('y' for yes, 'n' for no)
A. n

--- OTHER Volumes are snapshot immediately (no special preparation) ---

Q. Do you want to add Hana storage + OtherVolume #1?
   ('y' for yes, 'n' for no)
A. n


Q. Enter the database type to add, 'hana', 'oracle', 'db2', 'mssql',
   'exit' (to abort without saving), 'save' (to save and exit)?
A. save


Editing configuration complete, writing output to 'azacsnap.json'.
```

### Example for SAP HANA with Azure Large Instance storage

```output
+----------------------------------------------------------+
+  For details on configuring AzAcSnap please visit        +
+          https://aka.ms/azacsnap-configure               +
+----------------------------------------------------------+
Building new config file

Q. Add comment #1 to config file (blank entry to exit adding comments)?
A. This is a new config file for AzAcSnap 11

Q. Add comment #2 to config file (blank entry to exit adding comments)?
A.

Q. Enter the database type to add, 'hana', 'oracle', 'db2', 'mssql',
   'exit' (to abort without saving), 'save' (to save and exit)?
A. hana

Checking for SAP HANA external program dependency 'hdbsql'
External dependency 'hdbsql' found.

=== Add SAP HANA details ===

Q. What is the SAP HANA SID (e.g. H80)?
A. H80

Q. What is the SAP HANA Instance Number (e.g. 00)?
A. 00

Q. What is the SAP HANA HDB User Store Key (e.g. `hdbuserstore List`)?
A. AZACSNAP

Q. What is the SAP HANA Server's Address (hostname or IP address)?
A. testing01

Q. Do you need AzAcSnap to automatically disable/enable backint during snapshot?
   ('y' for yes, 'n' for no) [default='n']
A.

=== Add Hana Storage section ===

Q. Do you want to add Hana database Storage?
   ('y' for yes, 'n' for no)
A. y

--- DATA Volumes are specially prepared before they are snapshot ---

Q. Do you want to add Hana storage + DataVolume #1?
   ('y' for yes, 'n' for no)
A. y

Q. Do you want to add Hana storage + DataVolume #1 + Azure NetApp Files entry #1?
   ('y' for yes, 'n' for no)
A. n

Q. Do you want to add Hana storage + DataVolume #1 + Azure Large Instance entry #1?
   ('y' for yes, 'n' for no)
A. y

Q. What is the Hana storage + DataVolume #1 + Azure Large Instance entry #1 + Storage Certificate File
   (e.g. svmadm_cert.p12)?
A. svm01.p12

Q. What is the Hana storage + DataVolume #1 + Azure Large Instance entry #1 + Storage ResourceId
   (e.g. <hostname>/api/storage/volumes/<UUID>)?
A. svm01/api/storage/volumes/0892dcdc-f760-11ee-a301-000c2989d71e

Q. What is the Hana storage + DataVolume #1 + Azure Large Instance entry #1 + Storage Resource Name
   (e.g. volume01)?
A. hana_data_01

Q. What is the Hana storage + DataVolume #1 + Azure Large Instance entry #1 + Storage Resource Type
   (e.g. volumes or consistency-groups)?
A. volumes
Hana storage + DataVolume #1 + Azure Large Instance entry #1 (added)


Q. Do you want to add Hana storage + DataVolume #1 + Azure Large Instance entry #2?
   ('y' for yes, 'n' for no)
A. n

Q. Do you want to add Hana storage + DataVolume #1 + Azure Managed Disk entry #1?
   ('y' for yes, 'n' for no)
A. n

Q. Do you want to add Hana storage + DataVolume #2?
   ('y' for yes, 'n' for no)
A. n

--- OTHER Volumes are snapshot immediately (no special preparation) ---

Q. Do you want to add Hana storage + OtherVolume #1?
   ('y' for yes, 'n' for no)
A. n


Q. Enter the database type to add, 'hana', 'oracle', 'db2', 'mssql',
   'exit' (to abort without saving), 'save' (to save and exit)?
A. save


Editing configuration complete, writing output to 'azacsnap.json'.
```

## Required values for the configuration file

The following sections provide detailed guidance on required values for the database section of the configuration file.

# [SAP HANA](#tab/sap-hana)

When you add an *SAP HANA database* to the configuration, the following values are required:

- `HANA SID` (JSON key: `sid`): The SAP HANA system ID (SID).
- `HANA Instance Number` (JSON key: `instanceNumber`): The SAP HANA instance number.
- `HANA HDB User Store Key` (JSON key: `hdbUserStoreName`): The SAP HANA KEY as shown by the `hdbuserstore List` command which uses the KEY to link the USER with permissions to run database backups to the ENV (hostname and port).  The [Enable communication with database](azacsnap-configure-database.md?tabs=sap-hana#enable-communication-with-the-database) section provides further details and examples.
- `HANA Server's Address` (JSON key: `serverAddress`): The SAP HANA server's host name or IP address.
- `Do you need AzAcSnap to automatically disable/enable backint during snapshot`: Defaults to `n` (no). You can set it to `y` (yes) to allow AzAcSnap to disable or re-enable the Backint interface. The [Backint coexistence](#backint-coexistence) section in this article explains this option in more detail.

- The `HANA Server's Address` should be one of the following:
  - *Single node* : Host name and IP address of the node.
  - *HSR with STONITH* : Host name and IP address of the node.
  - *Scale-out (N+N, N+M)* : Current host name and IP address of the master node.
  - *HSR without STONITH* : Host name and IP address of the node.
  - *Multi SID on Single node* : Host name and IP address of the node that hosts those SIDs.

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

- `Oracle DB Server's Address` (JSON key: `serverAddress`): The database server's host name or IP address.
- `SID` (JSON key: `sid`): The database system ID.
- `Oracle Connect String` (JSON key: `connectString`): The string that `sqlplus` uses to connect to Oracle and enable or disable backup mode.

# [IBM Db2](#tab/db2)

When you add a Db2 database to the configuration, the following values are required:

- `Db2 Server's Address` (JSON key: `serverAddress`): The database server's host name or IP address.

  If `Db2 Server Address` (`serverAddress`) matches `127.0.0.1` or `localhost`, the snapshot tool runs all `db2` commands locally. Otherwise, the snapshot tool uses `serverAddress` as the host to connect to via Secure Shell (SSH), by using the `Instance User` value as the SSH login name.
  
  You can validate remote access via SSH by using `ssh <instanceUser>@<serverAddress>`. Replace `<instanceUser>` and `<serverAddress>` with the respective values.
- `Instance User` (JSON key: `instanceUser`): The instance user for the database system.
- `SID` (JSON key: `sid`): The database system ID.

> [!IMPORTANT]
> Setting `Db2 Server Address` (`serverAddress`) aligns directly with the method that's used to communicate with Db2. Ensure that you set it correctly, as described.

# [Microsoft SQL Server](#tab/mssql)

When adding a Microsoft SQL Server database to the configuration, the following values are required:

- `connectionString` (JSON key: `connectionString`) = The Connection String used to connect to the database.  For a typical AzAcSnap installation on to the system running Microsoft SQL Server where the Database Instance is MSSQL2022 the connection string = "Trusted_Connection=True;Persist Security Info=True;Data Source=MSSQL2022;TrustServerCertificate=true".
- `instanceName` (JSON key: `instanceName`) = The database instance name.
- `metaDataFileLocation` (JSON key: `metaDataFileLocation`) = The location where Microsoft SQL Server will write out the backup meta-data file (for example, "C:\\MSSQL_BKP\\").

---

# [Azure Large Instances (bare metal)](#tab/azure-large-instance)

When you add Azure Large Instances storage to a database section, the following values are required:

- `Storage Certificate File` (JSON key: `certificateFile`): The certificate file used to authenticate to the storage back-end.
- `Storage ResourceId` (JSON key: `resourceUri`): The full URI for the resource, starting with the hostname (for example, `<hostname>/api/storage/volumes/<UUID>`)
- `Storage Resource Name` (JSON key: `resourceName`): The resource 'friendly' name (for example, `vol01`)
- `Storage Resource Type` (JSON key: `resourceType`): The resource type, 'volumes' or 'consistency-groups'.

# [Azure NetApp Files (with a virtual machine)](#tab/azure-netapp-files)

When you add Azure NetApp Files storage to a database section, the following values are required:

- `Service Principal Authentication filename` (JSON key: `authFile`):
  - To use a system-managed identity, leave this field empty with no value, and then select the Enter key to go to the next field.
  
    For an example to set up an Azure system-managed identity, see [Install the Azure Application Consistent Snapshot tool](azacsnap-installation.md).
  - To use a service principal, use the name of the authentication file (for example, *authfile.json*) that's generated in Azure Cloud Shell when you're configuring communication with Azure NetApp Files storage.
  
    For an example to set up a service principal, see [Install the Azure Application Consistent Snapshot tool](azacsnap-installation.md).
- `Full ANF Storage Volume Resource ID` (JSON key: `resourceId`): The full resource ID of the volume that's being snapshot. You can retrieve this string by going to the Azure portal and then selecting **Azure NetApp Files** > **Volume** > **Settings** or **Properties** > **Resource ID**.

---

## Example configuration file

The following output is an example configuration file only, this example is the result of the SAP HANA with Azure NetApp Files storage example.

```bash
cat azacsnap.json
```

```output
{
  "version": "11",
  "logPath": "./logs",
  "securityPath": "./security",
  "comments": [
    "This is a new config file for AzAcSnap 11 with SAP HANA and Azure NetApp Files"
  ],
  "database": [
    {
      "hana": {
        "serverAddress": "saphana1",
        "sid": "H81",
        "instanceNumber": "00",
        "hdbUserStoreName": "AZACSNAP",
        "savePointAbortWaitSeconds": 600,
        "autoDisableEnableBackint": false,
        "storage": [
          {
            "dataVolumes": [
              {
                "anfStorageVolumes": [
                  {
                    "resourceId": "/subscriptions/99999999-9zz9-9z99-z9z9-z999z999zzz9/resourceGroups/saphanasystems/providers/Microsoft.NetApp/netAppAccounts/saphanaanf/capacityPools/Premium/volumes/HANADATA01",
                    "authFile": "",
                    "subscription": "99999999-9zz9-9z99-z9z9-z999z999zzz9",
                    "resourceGroupName": "saphanasystems",
                    "accountName": "saphanaanf",
                    "poolName": "Premium",
                    "volume": "HANADATA01"
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

> [!NOTE]
> For a disaster recovery (DR) scenario where you'll run backups at the DR site, the HANA server name that's configured in the DR configuration file (for example, `DR.json`) at the DR site should be the same as the production server name.

## Next steps

- [Test the Azure Application Consistent Snapshot tool](azacsnap-cmd-ref-test.md)
