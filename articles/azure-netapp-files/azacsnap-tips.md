---
title: Tips and tricks for using Azure Application Consistent Snapshot tool for Azure NetApp Files | Microsoft Docs
description: Provides tips and tricks for using the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: Phil-Jensen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 09/20/2023
ms.author: phjensen
---

# Tips and tricks for using Azure Application Consistent Snapshot tool

This article provides tips and tricks that might be helpful when you use AzAcSnap.

## Global settings to control azacsnap behavior

AzAcSnap 8 introduced a new global settings file (`.azacsnaprc`) which must be located in the same (current working) directory as azacsnap is executed in.  The filename is `.azacsnaprc` and by using the dot '.' character as the start of the filename makes it hidden to standard directory listings.  The file allows global settings controlling the behavior of AzAcSnap to be set.  The format is one entry per line with a supported customizing variable and a new overriding value.

Settings, which can be controlled by adding/editing the global settings file are:

- **MAINLOG_LOCATION** which sets the location of the "main-log" output file, which is called `azacsnap.log` and was introduced in AzAcSnap 8.  Values should be absolute paths, for example:
  - `MAINLOG_LOCATION=/home/azacsnap/bin/logs`

## Main-log parsing

AzAcSnap 8 introduced a new "main-log" to provide simpler parsing of runs of AzAcSnap.  The inspiration for this file is the SAP HANA backup catalog, which shows when AzAcSnap was started, how long it took, and what the snapshot name is.  With AzAcSnap, this idea has been taken further to include information for each of the AzAcSnap commands, specifically the `-c` options, and the file has the following headers:

```output
DATE_TIME,OPERATION_NAME,STATUS,SID,DATABASE_TYPE,DURATION,SNAPSHOT_NAME,AZACSNAP_VERSION,AZACSNAP_CONFIG_FILE,VOLUME
```

When AzAcSnap is run it appends to the log the appropriate information depending on the `-c` command used, examples of output are as follows:

```output
2023-03-29T16:10:57.8643546+13:00,about,started,,,,,8,azacsnap.json,
2023-03-29T16:10:57.8782148+13:00,about,SUCCESS,,,0:00:00.0258013,,8,azacsnap.json,
2023-03-29T16:11:55.7276719+13:00,backup,started,PR1,Hana,,pr1_hourly__F47B181A117,8,PR1.json,(data)HANADATA_P;(data)HANASHARED_P;(data)VGvol01;
2023-03-29T16:13:03.3774633+13:00,backup,SUCCESS,PR1,Hana,0:01:07.7558663,pr1_hourly__F47B181A117,8,PR1.json,(data)HANADATA_P;(data)HANASHARED_P;(data)VGvol01;
2023-03-29T16:13:30.1312963+13:00,details,started,PR1,Hana,,,8,PR1.json,(data)HANADATA_P;(data)HANASHARED_P;(data)VGvol01;(other)HANALOGBACKUP_P;
2023-03-29T16:13:33.1806098+13:00,details,SUCCESS,PR1,Hana,0:00:03.1380686,,8,PR1.json,(data)HANADATA_P;(data)HANASHARED_P;(data)VGvol01;(other)HANALOGBACKUP_P;
```

This format makes the file parse-able with the Linux commands `watch`, `grep`, `head`, `tail`, and `column` to get continuous updates of AzAcSnap backups.  An example combination of these commands in  single shell script to monitor AzAcSnap is as follows:

```bash
#!/bin/bash
#
# mainlog-watcher.sh
# Monitor execution of AzAcSnap backup commands
#
# These values can be modified as appropriate.
# Mainlog header fields:
#       1. DATE_TIME,
#       2. OPERATION_NAME,
#       3. STATUS,
#       4. SID,
#       5. DATABASE_TYPE,
#       6. DURATION,
#       7. SNAPSHOT_NAME,
#       8. AZACSNAP_VERSION,
#       9. AZACSNAP_CONFIG_FILE,
#       10. VOLUME
FIELDS_TO_INCLUDE="1,2,3,5,4,6,7"
SCREEN_REFRESH_SECS=2
#
# Use AzAcSnap global settings file (.azacsnaprc) if available,
# otherwise use the default location of the current working directory.
AZACSNAP_RC=".azacsnaprc"
if [ -f ${AZACSNAP_RC} ]; then
    source ${AZACSNAP_RC} 2> /dev/null
else
    MAINLOG_LOCATION="."
fi
cd ${MAINLOG_LOCATION}
echo "Changing current working directory to ${MAINLOG_LOCATION}"
#
# Default MAINLOG filename.
HOSTNAME=$(hostname)
MAINLOG_FILENAME="azacsnap.log"
#
# High-level explanation of how commands used.
# `watch` - continuously monitoring the command output.
# `grep` - filter only backup runs.
# `head` and `tail` - add/remove column headers.
# `sed` to remove millisecs from date.
# `awk` format output for `column`.
# `column` - provide pretty output.
FIELDS_FOR_AWK=$(echo "${FIELDS_TO_INCLUDE}" | sed 's/^/\\\$/g' | sed 's/,/,\\\$/g')
PRINTOUT="{OFS=\\\",\\\";print ${FIELDS_FOR_AWK}}"
#
echo -n "Parsing '${MAINLOG_FILENAME}' for field #s ${FIELDS_TO_INCLUDE} = "
bash -c "cat ${MAINLOG_FILENAME} | grep -e \"DATE\" | head -n1 -  | awk -F\",\" \"${PRINTOUT}\" "
#
watch -t -n ${SCREEN_REFRESH_SECS} \
  "\
  echo -n \"Monitoring AzAcSnap on '${HOSTNAME}' @ \" ; \
  date ; \
  echo ; \
  cat ${MAINLOG_FILENAME} \
    | grep -e \"DATE\" -e \",backup,\" \
    | ( sleep 1; head -n1 - ; sleep 1; tail -n+2 - | tail -n20 \
      | sed 's/\(:[0-9][0-9]\)\.[0-9]\{7\}/\1/' ; sleep 1 ) \
    | awk -F\",\" \"${PRINTOUT}\" \
    | column -s\",\" -t \
  "
exit 0
```

Produces the following output refreshed every two seconds.

```output
Monitoring AzAcSnap on 'azacsnap' @ Thu Sep 21 11:27:40 NZST 2023

DATE_TIME                  OPERATION_NAME  STATUS   DATABASE_TYPE  SID       DURATION         SNAPSHOT_NAME
2023-09-21T07:00:02+12:00  backup          started  Oracle         ORATEST1                   all-volumes__F6B07A2D77A
2023-09-21T07:02:10+12:00  backup          SUCCESS  Oracle         ORATEST1  0:02:08.0338537  all-volumes__F6B07A2D77A
2023-09-21T08:00:03+12:00  backup          started  Oracle         ORATEST1                   all-volumes__F6B09C83210
2023-09-21T08:02:12+12:00  backup          SUCCESS  Oracle         ORATEST1  0:02:09.9954439  all-volumes__F6B09C83210
2023-09-21T09:00:03+12:00  backup          started  Oracle         ORATEST1                   all-volumes__F6B0BED814B
2023-09-21T09:00:03+12:00  backup          started  Hana           PR1                        pr1_hourly__F6B0BED817F
2023-09-21T09:01:10+12:00  backup          SUCCESS  Hana           PR1       0:01:07.8575664  pr1_hourly__F6B0BED817F
2023-09-21T09:02:12+12:00  backup          SUCCESS  Oracle         ORATEST1  0:02:09.4572157  all-volumes__F6B0BED814B
```


## Limit service principal permissions

It may be necessary to limit the scope of the AzAcSnap service principal.  Review the [Azure RBAC documentation](../role-based-access-control/index.yml) for more details on fine-grained access management of Azure resources.  

The following is an example role definition with the minimum required actions needed for AzAcSnap to function.

```azurecli
az role definition create --role-definition '{ \
  "Name": "Azure Application Consistent Snapshot tool", \
  "IsCustom": "true", \
  "Description": "Perform snapshots on ANF volumes.", \
  "Actions": [ \
    "Microsoft.NetApp/*/read", \
    "Microsoft.NetApp/netAppAccounts/capacityPools/volumes/snapshots/write", \
    "Microsoft.NetApp/netAppAccounts/capacityPools/volumes/snapshots/delete" \
  ], \
  "NotActions": [], \
  "DataActions": [], \
  "NotDataActions": [], \
  "AssignableScopes": ["/subscriptions/<insert your subscription id>"] \
}'
```

For restore options to work successfully, the AzAcSnap service principal also needs to be able to create volumes.  In this case, the role definition needs an extra "Actions" clause added, therefore the complete service principal should look like the following example.

```azurecli
az role definition create --role-definition '{ \
  "Name": "Azure Application Consistent Snapshot tool", \
  "IsCustom": "true", \
  "Description": "Perform snapshots and restores on ANF volumes.", \
  "Actions": [ \
    "Microsoft.NetApp/*/read", \
    "Microsoft.NetApp/netAppAccounts/capacityPools/volumes/snapshots/write", \
    "Microsoft.NetApp/netAppAccounts/capacityPools/volumes/snapshots/delete", \
    "Microsoft.NetApp/netAppAccounts/capacityPools/volumes/write" \
  ], \
  "NotActions": [], \
  "DataActions": [], \
  "NotDataActions": [], \
  "AssignableScopes": ["/subscriptions/<insert your subscription id>"] \
}'
```


## Take snapshots manually

Before executing any backup commands (`azacsnap -c backup`), check the configuration by running the test commands and verify they get executed successfully.  Correct execution of these tests proved `azacsnap` can communicate with the installed SAP HANA database and the underlying storage system of the SAP HANA on **Azure Large Instance** or **Azure NetApp Files** system.

- `azacsnap -c test --test hana`
- `azacsnap -c test --test storage`

Then to take a manual database snapshot backup, run the following command:

```bash
azacsnap -c backup --volume data --prefix hana_TEST --retention=1
```

## Setup automatic snapshot backup

It's common practice on Unix/Linux systems to use `cron` to automate running commands on a
system. The standard practice for the snapshot tools is to set up the user's `crontab`.

An example of a `crontab` for the user `azacsnap` to automate snapshots follows.

```output
MAILTO=""
# =============== TEST snapshot schedule ===============
# Data Volume Snapshots - taken every hour.
@hourly (. /home/azacsnap/.profile ; cd /home/azacsnap/bin ; azacsnap -c backup --volume data --prefix hana_TEST --retention=9)
# Other Volume Snapshots - taken every 5 minutes, excluding the top of the hour when hana snapshots taken
5,10,15,20,25,30,35,40,45,50,55 * * * * (. /home/azacsnap/.profile ; cd /home/azacsnap/bin ; azacsnap -c backup --volume other --prefix logs_TEST --retention=9)
# Other Volume Snapshots - using an alternate config file to snapshot the boot volume daily.
@daily (. /home/azacsnap/.profile ; cd /home/azacsnap/bin ; azacsnap -c backup --volume other --prefix DailyBootVol --retention=7 --configfile boot-vol.json)
```

Explanation of the above crontab.

- `MAILTO=""`: by having an empty value this prevents cron from automatically trying to email the local Linux user when executing the crontab entry.
- Shorthand versions of timing for crontab entries are self-explanatory:
  - `@monthly` = Run once a month, that is, "0 0 1 * *".
  - `@weekly`  = Run once a week, that is,  "0 0 * * 0".
  - `@daily`   = Run once a day, that is,   "0 0 * * *".
  - `@hourly`  = Run once an hour, that is, "0 * * * *".
- The first five columns are used to designate times, refer to the following column examples:
  - `0,15,30,45`: Every 15 minutes
  - `0-23`: Every hour
  - `*` : Every day
  - `*` : Every month
  - `*` : Every day of the week
- Command line to execute included within brackets "()"
  - `. /home/azacsnap/.profile` = pull in the user's .profile to set up their environment, including
        $PATH, etc.
  - `cd /home/azacsnap/bin` = change execution directory to the location "/home/azacsnap/bin" where
        config files are.
  - `azacsnap -c .....` = the full azacsnap command to run, including all the options.

For more information about cron and the format of the crontab file, see [cron](https://wikipedia.org/wiki/Cron).

> [!NOTE]
> Users are responsible for monitoring the cron jobs to ensure snapshots are being
generated successfully.

## Manage AzAcSnap log files

AzAcSnap writes output of its operation to log files to assist with debugging and to validate correct operation. These log files continue to grow unless actively managed. Fortunately UNIX based systems have a tool to manage and archive log files called logrotate.

The following output provides an example configuration for logrotate. This configuration keeps a maximum of 31 logs (approximately one month), and when the log files are larger than 10k it rotates them by renaming with a number added to the filename and compresses them.

```output
# azacsnap logrotate configuration file
compress

~/bin/azacsnap*.log {
    rotate 31
    size 10k
}
```

After the `logrotate.conf` file has been created, the `logrotate` command should be run regularly to archive AzAcSnap log files accordingly. Automating the `logrotate` command can be done using cron. The following output is one line of the azacsnap user's crontab, this example runs logrotate daily using the configuration file `~/logrotate.conf`.

```output
@daily /usr/sbin/logrotate -s ~/logrotate.state ~/logrotate.conf >> ~/logrotate.log
```

> [!NOTE]
> In the example above the logrotate.conf file is in the user's home (~) directory.

After several days, the azacsnap log files should look similar to the following directory listing.

```bash
ls -ltra ~/bin/logs
```

```output
-rw-r--r-- 1 azacsnap users 127431 Mar 14 23:56 azacsnap-backup-azacsnap.log.6.gz
-rw-r--r-- 1 azacsnap users 128379 Mar 15 23:56 azacsnap-backup-azacsnap.log.5.gz
-rw-r--r-- 1 azacsnap users 129272 Mar 16 23:56 azacsnap-backup-azacsnap.log.4.gz
-rw-r--r-- 1 azacsnap users 128010 Mar 17 23:56 azacsnap-backup-azacsnap.log.3.gz
-rw-r--r-- 1 azacsnap users 128947 Mar 18 23:56 azacsnap-backup-azacsnap.log.2.gz
-rw-r--r-- 1 azacsnap users 128971 Mar 19 23:56 azacsnap-backup-azacsnap.log.1.gz
-rw-r--r-- 1 azacsnap users 167921 Mar 20 01:21 azacsnap-backup-azacsnap.log
```


## Monitor the snapshots

The following conditions should be monitored to ensure a healthy system:

1. Available disk space. Snapshots slowly consume disk space based on the block-level change rate, as keeping older disk blocks are retained in the snapshot.
    1. To help automate disk space management, use the `--retention` and `--trim` options to automatically clean up the old snapshots and database log files.
1. Successful execution of the snapshot tools
    1. Check the `*.result` file for the success or failure of the latest running of `azacsnap`.
    1. Check `/var/log/messages` for output from the `azacsnap` command.
1. Consistency of the snapshots by restoring them to another system periodically.

> [!NOTE]
> To list  snapshot details, execute the command `azacsnap -c details`.

## Delete a snapshot

To delete a snapshot, use the command `azacsnap -c delete`. It's not possible to delete snapshots from the OS level. You must use the correct command (`azacsnap -c delete`) to delete the storage snapshots.

> [!IMPORTANT]
> Be vigilant when you delete a snapshot. Once deleted, it is **IMPOSSIBLE** to recover the deleted snapshots.

## Restore a snapshot

A storage volume snapshot can be restored to a new volume (`-c restore --restore snaptovol`).  For Azure Large Instance, the volume can be reverted to a snapshot (`-c restore --restore revertvolume`).

> [!NOTE]
> There is **NO** database recovery command provided.

A snapshot can be copied back to the SAP HANA data area, but SAP HANA must not be running when a
copy is made (`cp /hana/data/H80/mnt00001/.snapshot/hana_hourly.2020-06-17T113043.1586971Z/*`).

For Azure Large Instance, you could contact the Microsoft operations team by opening a service request to restore a desired snapshot from the existing available snapshots. You can open a service request via the [Azure portal](https://portal.azure.com).

If you decide to perform the disaster recovery failover, the `azacsnap -c restore --restore revertvolume` command at the DR site automatically makes available the most recent (`/hana/data` and `/hana/logbackups`) volume snapshots to allow for an SAP HANA recovery. Use this command with caution as it breaks replication between production and DR sites.

## Set up snapshots for 'boot' volumes only

> [!IMPORTANT]
> This operation applies only to Azure Large Instance.

In some cases, customers already have tools to protect SAP HANA and only want to configure 'boot' volume snapshots.  In this case, only the following steps need to be completed.

1. Complete steps 1-4 of the pre-requisites for installation.
1. Enable communication with storage.
1. Download and run the installer to install the snapshot tools.
1. Complete setup of snapshot tools.
1. Get the list of volumes to be added to the azacsnap configuration file, in this example, the Storage User Name is `cl25h50backup` and the Storage IP Address is `10.1.1.10` 
    ```bash
    ssh cl25h50backup@10.1.1.10 "volume show -volume *boot*"
    ```
    ```output
    Last login time: 7/20/2021 23:54:03
    Vserver   Volume       Aggregate    State      Type       Size  Available Used%
    --------- ------------ ------------ ---------- ---- ---------- ---------- -----
    ams07-a700s-saphan-1-01v250-client25-nprod t250_sles_boot_sollabams07v51_vol aggr_n01_ssd online RW 150GB 57.24GB  61%
    ams07-a700s-saphan-1-01v250-client25-nprod t250_sles_boot_sollabams07v52_vol aggr_n01_ssd online RW 150GB 81.06GB  45%
    ams07-a700s-saphan-1-01v250-client25-nprod t250_sles_boot_sollabams07v53_vol aggr_n01_ssd online RW 150GB 79.56GB  46%
    3 entries were displayed.
    ```
    > [!NOTE] 
    > In this example, this host is part of a 3 node Scale-Out system and all 3 boot volumes can be seen from this host.  This means all 3 boot volumes can be snapshot from this host, and all 3 should be added to the configuration file in the next step.

1. Create a new configuration file as follows. The boot volume details must be in the OtherVolume stanza:
    ```bash
    azacsnap -c configure --configuration new --configfile BootVolume.json
    ```
    ```output
    Building new config file
    Add comment to config file (blank entry to exit adding comments): Boot only config file.
    Add comment to config file (blank entry to exit adding comments):
    Add database to config? (y/n) [n]: y
    HANA SID (for example, H80): X
    HANA Instance Number (for example, 00): X
    HANA HDB User Store Key (for example, `hdbuserstore List`): X
    HANA Server's Address (hostname or IP address): X
    Add ANF Storage to database section? (y/n) [n]:
    Add HLI Storage to database section? (y/n) [n]: y
    Add DATA Volume to HLI Storage section of Database section? (y/n) [n]:
    Add OTHER Volume to HLI Storage section of Database section? (y/n) [n]: y
    Storage User Name (for example, clbackup25): cl25h50backup
    Storage IP Address (for example, 192.168.1.30): 10.1.1.10
    Storage Volume Name (for example, hana_data_soldub41_t250_vol): t250_sles_boot_sollabams07v51_vol
    Add OTHER Volume to HLI Storage section of Database section? (y/n) [n]: y
    Storage User Name (for example, clbackup25): cl25h50backup
    Storage IP Address (for example, 192.168.1.30): 10.1.1.10
    Storage Volume Name (for example, hana_data_soldub41_t250_vol): t250_sles_boot_sollabams07v52_vol
    Add OTHER Volume to HLI Storage section of Database section? (y/n) [n]: y
    Storage User Name (for example, clbackup25): cl25h50backup
    Storage IP Address (for example, 192.168.1.30): 10.1.1.10
    Storage Volume Name (for example, hana_data_soldub41_t250_vol): t250_sles_boot_sollabams07v53_vol
    Add OTHER Volume to HLI Storage section of Database section? (y/n) [n]:
    Add HLI Storage to database section? (y/n) [n]:
    Add database to config? (y/n) [n]:

    Editing configuration complete, writing output to 'BootVolume.json'.
    ```
1. Check the config file, refer to the following example:

    Use `cat` command to display the contents of the configuration file:

    ```bash
    cat BootVolume.json
    ```

    ```output
    {
      "version": "5.0",
      "logPath": "./logs",
      "securityPath": "./security",
      "comments": [
        "Boot only config file."
      ],
      "database": [
        {
          "hana": {
            "serverAddress": "X",
            "sid": "X",
            "instanceNumber": "X",
            "hdbUserStoreName": "X",
            "savePointAbortWaitSeconds": 600,
            "hliStorage": [
              {
                "dataVolume": [],
                "otherVolume": [
                  {
                    "backupName": "cl25h50backup",
                    "ipAddress": "10.1.1.10",
                    "volume": "t250_sles_boot_sollabams07v51_vol"
                  },
                  {
                    "backupName": "cl25h50backup",
                    "ipAddress": "10.1.1.10",
                    "volume": "t250_sles_boot_sollabams07v52_vol"
                  },
                  {
                    "backupName": "cl25h50backup",
                    "ipAddress": "10.1.1.10",
                    "volume": "t250_sles_boot_sollabams07v53_vol"
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

1. Test a boot volume backup

    ```bash
    azacsnap -c backup --volume other --prefix TestBootVolume --retention 1 --configfile BootVolume.json
    ```

1. Check it's listed, note the addition of the `--snapshotfilter` option to limit the snapshot list returned.

    ```bash
    azacsnap -c details --snapshotfilter TestBootVolume --configfile BootVolume.json
    ```

    Command output:
    ```output
    List snapshot details called with snapshotFilter 'TestBootVolume'
    #, Volume, Snapshot, Create Time, HANA Backup ID, Snapshot Size
    #1, t250_sles_boot_sollabams07v51_vol, TestBootVolume.2020-07-03T034651.7059085Z, "Fri Jul 03 03:48:24 2020", "otherVolume Backup|azacsnap version: 5.0 (Build: 20210421.6349)", 200KB
    , t250_sles_boot_sollabams07v51_vol, , , Size used by Snapshots, 1.31GB
    #1, t250_sles_boot_sollabams07v52_vol, TestBootVolume.2020-07-03T034651.7059085Z, "Fri Jul 03 03:48:24 2020", "otherVolume Backup|azacsnap version: 5.0 (Build: 20210421.6349)", 200KB
    , t250_sles_boot_sollabams07v52_vol, , , Size used by Snapshots, 1.31GB
    #1, t250_sles_boot_sollabams07v53_vol, TestBootVolume.2020-07-03T034651.7059085Z, "Fri Jul 03 03:48:24 2020", "otherVolume Backup|azacsnap version: 5.0 (Build: 20210421.6349)", 200KB
    , t250_sles_boot_sollabams07v53_vol, , , Size used by Snapshots, 1.31GB
    ```

1. *Optional* Set up automatic snapshot backup with `crontab`, or a suitable scheduler capable of running the `azacsnap` backup commands.

> [!NOTE]
> Setting up communication with SAP HANA is not required.

## Restore a 'boot' snapshot

> [!IMPORTANT]
> This operation is for Azure Large Instance ony.
> The Server will be restored to the point when the Snapshot was taken.

A 'boot' snapshot can be recovered as follows:

1. The customer needs to shut down the server.
1. After the Server is shut down, the customer will need to open a service request that contains the Machine ID and Snapshot to restore.
    > Customers can open a service request via the [Azure portal](https://portal.azure.com).
1. Microsoft restores the Operating System LUN using the specified Machine ID and Snapshot, and then boots the Server.
1. The customer then needs to confirm Server is booted and healthy.

No other steps to be performed after the restore.

## Key facts to know about snapshots

Key attributes of storage volume snapshots:

- **Location of snapshots**: Snapshots can be found in a virtual directory (`.snapshot`) within the
    volume.  See the following examples for **Azure Large Instance**:
  - Database: `/hana/data/<SID>/mnt00001/.snapshot`
  - Shared: `/hana/shared/<SID>/.snapshot`
  - Logs: `/hana/logbackups/<SID>/.snapshot`
  - Boot: boot snapshots for HLI are **not visible** from OS level, but can be listed using `azacsnap -c details`.

  > [!NOTE]
  >  `.snapshot` is a read-only hidden *virtual* folder providing read-only access to the snapshots.

- **Max snapshot:** The hardware can sustain up to 250 snapshots per volume. The snapshot
    command keeps a maximum number of snapshots for the prefix based on the retention
    set on the command line.  Any more snapshots, beyond the retention number with the same prefix, are deleted.
- **Snapshot name:** The snapshot name includes the prefix label provided by the customer.
- **Size of the snapshot:** Depends upon the size/changes on the database level.
- **Log file location:** Log files generated by the commands are output into folders as
    defined in the JSON configuration file, which by default is a subfolder under where the command
    is run (for example, `./logs`).

## Next steps

- [Troubleshoot](azacsnap-troubleshoot.md)
