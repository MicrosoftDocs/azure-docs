---
title: Configure Azure Application Consistent Snapshot Tool | Microsoft Docs
description: Provides a guide for running the configure command of the Azure Application Consistent Snapshot Tool that you can use with Azure NetApp Files. 
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
ms.date: 12/14/2020
ms.author: phjensen
---

# Configure Azure Application Consistent Snapshot Tool (preview)

This article provides a guide for running the configure command of the Azure Application Consistent Snapshot Tool that you can use with Azure NetApp Files.

## Introduction

The configuration file can be created or edited by using the `azacsnap -c configure` command.

## Configuration file for snapshot tools

A configuration file can be created by running `azacsnap -c configure --configuration new`.  By default the configuration filename is `azacsnap.json`.  A custom file name can be used with the `--configfile=` parameter (for example, `--configfile=<customname>.json`)
The following example is for Azure Large Instance configuration:

```bash
azacsnap -c configure --configuration new
```

<pre>
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
</pre>

## SAP HANA values

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

## Azure Large Instance (HLI) storage values

When adding *HLI Storage* to a database section, the following values are required:

- **Storage User Name** = This value is the user name used to establish the SSH connection to the Storage.
- **Storage IP Address** = The address of the Storage system.
- **Storage Volume Name** = the volume name to snapshot.  This value can be determined multiple ways, perhaps the
   simplest is to try the following shell command:

    ```bash
    grep nfs /etc/fstab | cut -f2 -d"/" | sort | uniq
    ```

    <pre>
    hana_data_p40_soldub41_mnt00001_t020_vol
    hana_log_backups_p40_soldub41_t020_vol
    hana_log_p40_soldub41_mnt00001_t020_vol
    hana_shared_p40_soldub41_t020_vol
    </pre>

## Azure NetApp Files (ANF) storage values

When adding *ANF Storage* to a database section, the following values are required:

- **Service Principal Authentication filename** = this is the `authfile.json` file generated in the Cloud Shell when configuring
    communication with Azure NetApp Files storage.
- **Full ANF Storage Volume Resource ID** = the full Resource ID of the Volume being snapshot.  This can be retrieved from:
    Azure Portal –> ANF –> Volume –> Settings/Properties –> Resource ID

## Config file `azacsnap.json`

In the following screen, the `azacsnap.json` is configured with the one SID.

The parameter values must be set to the customer's specific SAP HANA environment.
For **Azure Large Instance** system, this information is provided by Microsoft Service Management during the onboarding/handover call, and
is made available in an Excel file that is provided during handover. Open a service request if you
need to be provided this information again.

** The following is an example only, update all the values accordingly.

```bash
cat azacsnap.json
```

<pre>
{
  "version": "5.0 Preview",
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
</pre>

> [!NOTE]
> For a DR scenario where backups are to be run at the DR site, then the HANA Server Name
configured in the DR configuration file (for example, `DR.json`) at the DR site should be the same as
the production server name.

> [!NOTE]
> For Azure Large Instance your storage IP address must be in the same subnet as your server pool. For example, in
this case, our server pool subnet is 172. 18. 18 .0/24 and our assigned storage IP is 172.18.18.11.

## Configure the database

This section explains how to configure the data base.

### SAP HANA Configuration

There are some recommended changes to be applied to SAP HANA to ensure protection of the log
backups and catalog. By default, the `basepath_logbackup` and `basepath_catalogbackup` will output
their files to the `$(DIR_INSTANCE)/backup/log` directory, and it is unlikely this path is on a volume
which `azacsnap` is configured to snapshot these files will not be protected with storage snapshots.

The following `hdbsql` command examples are intended to demonstrate setting the log and catalog
paths to locations which are on storage volumes that can be snapshot by `azacsnap`. Be sure to check the
values on the command line match the local SAP HANA configuration.

### Configure log backup location

In this example, the change is being made to the `basepath_logbackup` parameter.

```bash
hdbsql -jaxC -n <HANA_ip_address>:30013 -i 00 -u SYSTEM -p <SYSTEM_USER_PASSWORD> "ALTER SYSTEM ALTER CONFIGURATION ('global.ini', 'SYSTEM') SET ('persistence', 'basepath_logbackup') = '/hana/logbackups/H80' WITH RECONFIGURE"
```

### Configure catalog backup location

In this example, the change is being made to the `basepath_catalogbackup` parameter.
First, check to ensure the `basepath_catalogbackup` path exists on the filesystem, if not create the path with the same
ownership as the directory.

```bash
ls -ld /hana/logbackups/H80/catalog
```

<pre>
drwxr-x--- 4 h80adm sapsys 4096 Jan 17 06:55 /hana/logbackups/H80/catalog
</pre>

If the path needs to be created, the following example creates the path and sets the correct
ownership and permissions. These commands will need to be run as root.

```bash
mkdir /hana/logbackups/H80/catalog
chown --reference=/hana/shared/H80/HDB00 /hana/logbackups/H80/catalog
chmod --reference=/hana/shared/H80/HDB00 /hana/logbackups/H80/catalog
ls -ld /hana/logbackups/H80/catalog
```

<pre>
drwxr-x--- 4 h80adm sapsys 4096 Jan 17 06:55 /hana/logbackups/H80/catalog
</pre>

The following example will change the SAP HANA setting.

```bash
hdbsql -jaxC -n <HANA_ip_address>:30013 -i 00 -u SYSTEM -p <SYSTEM_USER_PASSWORD> "ALTER SYSTEM ALTER CONFIGURATION ('global.ini', 'SYSTEM') SET ('persistence', 'basepath_catalogbackup') = '/hana/logbackups/H80/catalog' WITH RECONFIGURE"
```

### Check log and catalog backup locations

After making the changes above, confirm that the settings are correct with the following command.
In this example, the settings that have been set following the guidance above will display as
SYSTEM settings.

> This query also returns the DEFAULT settings for comparison.

```bash
hdbsql -jaxC -n <HANA_ip_address> - i 00 -U AZACSNAP "select * from sys.m_inifile_contents where (key = 'basepath_databackup' or key ='basepath_datavolumes' or key = 'basepath_logbackup' or key = 'basepath_logvolumes' or key = 'basepath_catalogbackup')"
```

<pre>
global.ini,DEFAULT,,,persistence,basepath_catalogbackup,$(DIR_INSTANCE)/backup/log
global.ini,DEFAULT,,,persistence,basepath_databackup,$(DIR_INSTANCE)/backup/data
global.ini,DEFAULT,,,persistence,basepath_datavolumes,$(DIR_GLOBAL)/hdb/data
global.ini,DEFAULT,,,persistence,basepath_logbackup,$(DIR_INSTANCE)/backup/log
global.ini,DEFAULT,,,persistence,basepath_logvolumes,$(DIR_GLOBAL)/hdb/log
global.ini,SYSTEM,,,persistence,basepath_catalogbackup,/hana/logbackups/H80/catalog
global.ini,SYSTEM,,,persistence,basepath_datavolumes,/hana/data/H80
global.ini,SYSTEM,,,persistence,basepath_logbackup,/hana/logbackups/H80
global.ini,SYSTEM,,,persistence,basepath_logvolumes,/hana/log/H80
</pre>

### Configure log backup timeout

The default setting for SAP HANA to perform a log backup is 900 seconds (15 minutes). It's
recommended to reduce this value to 300 seconds (that is, 5 minutes).  Then it is possible to run regular
backups (for example, every 10 minutes) by adding the log_backups volume into the OTHER volume section of the
configuration file.

```bash
hdbsql -jaxC -n <HANA_ip_address>:30013 -i 00 -u SYSTEM -p <SYSTEM_USER_PASSWORD> "ALTER SYSTEM ALTER CONFIGURATION ('global.ini', 'SYSTEM') SET ('persistence', 'log_backup_timeout_s') = '300' WITH RECONFIGURE"
```

#### Check log backup timeout

After making the change to the log backup timeout, check to ensure this has been set as follows.
In this example, the settings that have been set will display as the SYSTEM settings, but this
query also returns the DEFAULT settings for comparison.

```bash
hdbsql -jaxC -n <HANA_ip_address> - i 00 -U AZACSNAP "select * from sys.m_inifile_contents where key like '%log_backup_timeout%' "
```

<pre>
global.ini,DEFAULT,,,persistence,log_backup_timeout_s,900
global.ini,SYSTEM,,,persistence,log_backup_timeout_s,300
</pre>

## Next steps

- [Test Azure Application Consistent Snapshot Tool](azacsnap-cmd-ref-test.md)
