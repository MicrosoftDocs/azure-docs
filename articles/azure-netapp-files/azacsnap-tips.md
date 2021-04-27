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
ms.devlang: na
ms.topic: how-to
ms.date: 04/21/2021
ms.author: phjensen
---

# Tips and tricks for using Azure Application Consistent Snapshot tool

This article provides tips and tricks that might be helpful when you use AzAcSnap.

## Limit service principal permissions

It may be necessary to limit the scope of the AzAcSnap service principal.  Review the [Azure RBAC documentation](../role-based-access-control/index.yml) for more details on fine-grained access management of Azure resources.  

The following is an example role definition with the minimum required actions needed for AzAcSnap to function.

```bash
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

For restore options to work successfully, the AzAcSnap service principal also needs to be able to create volumes.  In this case the role definition needs an additional action, therefore the complete service principal should look like the following example.

```bash
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

It is common practice on Unix/Linux systems to use `cron` to automate running commands on a
system. The standard practice for the snapshot tools is to set up the user's `crontab`.

An example of a `crontab` for the user `azacsnap` to automate snapshots is below.

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

- `MAILTO=""`: by having an empty value this prevents cron from automatically trying to email the user when executing the crontab entry as it would likely end up in the local user's mail file.
- Shorthand versions of timing for crontab entries are self-explanatory:
  - `@monthly` = Run once a month, that is, "0 0 1 * *".
  - `@weekly`  = Run once a week, that is,  "0 0 * * 0".
  - `@daily`   = Run once a day, that is,   "0 0 * * *".
  - `@hourly`  = Run once an hour, that is, "0 * * * *".
- The first five columns are used to designate times, refer to column examples below:
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

Further explanation of cron and the format of the crontab file here: <https://en.wikipedia.org/wiki/Cron>

> [!NOTE]
> Users are responsible for monitoring the cron jobs to ensure snapshots are being
generated successfully.

## Monitor the snapshots

The following conditions should be monitored to ensure a healthy system:

1. Available disk space. Snapshots will slowly consume disk space as keeping older disk blocks
    are retained in the snapshot.
    1. To help automate disk space management, use the `--retention` and `--trim` options to automatically clean up the old snapshots and database log files.
1. Successful execution of the snapshot tools
    1. Check the `*.result` file for the success or failure of the latest running of `azacsnap`.
    1. Check `/var/log/messages` for output from the `azacsnap` command.
1. Consistency of the snapshots by restoring them to another system periodically.

> [!NOTE]
> To list  snapshot details, execute the command `azacsnap -c details`.

## Delete a snapshot

To delete a snapshot, execute the command `azacsnap -c delete`. It's not possible to delete
snapshots from the OS level. You must use the correct command (`azacsnap -c delete`) to delete the storage snapshots.

> [!IMPORTANT]
> Be vigilant when you delete a snapshot. Once deleted, it is **IMPOSSIBLE** to recover
the deleted snapshots.

## Restore a snapshot

A storage volume snapshot can be restored to a new volume (`-c restore --restore snaptovol`).  For Azure Large Instance, the volume can be reverted to a snapshot (`-c restore --restore revertvolume`).

> [!NOTE]
> There is **NO** database recovery command provided.

A snapshot can be copied back to the SAP HANA data area, but SAP HANA must not be running when a
copy is made (`cp /hana/data/H80/mnt00001/.snapshot/hana_hourly.2020-06-17T113043.1586971Z/*`).

For Azure Large Instance, you could contact the Microsoft operations team by opening a service request to restore a desired snapshot from the existing available snapshots. You can open a service request from Azure portal: <https://portal.azure.com>

If you decide to perform the disaster recovery failover, the `azacsnap -c restore --restore revertvolume` command at the DR site will automatically make available the most recent (`/hana/data` and `/hana/logbackups`) volume snapshots to allow for an SAP HANA recovery. Use this command with caution as it breaks replication between production and DR sites.

## Set up snapshots for 'boot' volumes only

> [!IMPORTANT]
> This operation applies only to Azure Large Instance.

In some cases, customers already have tools to protect SAP HANA and only want to configure 'boot' volume snapshots.  In this case, the task is simplified and the following steps should be taken.

1. Complete steps 1-4 of the pre-requisites for installation.
1. Enable communication with storage.
1. Download the run the installer to install the snapshot tools.
1. Complete setup of snapshot tools.
1. Create a new configuration file as follows. The boot volume details must be in the OtherVolume     stanza (user entries in <span style="color:red">red</span>):
    ```output
    > <span style="color:red">azacsnap -c configure --configuration new --configfile BootVolume.json</span>
    Building new config file
    Add comment to config file (blank entry to exit adding comments):<span style="color:red">Boot only config file.</span>
    Add comment to config file (blank entry to exit adding comments):
    Add database to config? (y/n) [n]: <span style="color:red">y</span>
    HANA SID (for example, H80): <span style="color:red">X</span>
    HANA Instance Number (for example, 00): <span style="color:red">X</span>
    HANA HDB User Store Key (for example, `hdbuserstore List`): <span style="color:red">X</span>
    HANA Server's Address (hostname or IP address): <span style="color:red">X</span>
    Add ANF Storage to database section? (y/n) [n]:
    Add HLI Storage to database section? (y/n) [n]: <span style="color:red">y</span>
    Add DATA Volume to HLI Storage section of Database section? (y/n) [n]:
    Add OTHER Volume to HLI Storage section of Database section? (y/n) [n]: <span style="color:red">y</span>
    Storage User Name (for example, clbackup25): <span style="color:red">shoasnap</span>
    Storage IP Address (for example, 192.168.1.30): <span style="color:red">10.1.1.10</span>
    Storage Volume Name (for example, hana_data_soldub41_t250_vol): <span style="color:red">t210_sles_boot_azsollabbl20a31_vol</span>
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
                    "backupName": "shoasnap",
                    "ipAddress": "10.1.1.10",
                    "volume": "t210_sles_boot_azsollabbl20a31_vol"
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
    #1, t210_sles_boot_azsollabbl20a31_vol, TestBootVolume.2020-07-03T034651.7059085Z, "Fri Jul 03 03:48:24 2020", "otherVolume Backup|azacsnap version: 5.0 (Build: 20210421.6349)", 200KB
    , t210_sles_boot_azsollabbl20a31_vol, , , Size used by Snapshots, 1.31GB
    ```

1. Set up automatic snapshot backup.

> [!NOTE]
> Setting up communication with SAP HANA is not required.

## Restore a 'boot' snapshot

> [!IMPORTANT]
> This operation is for Azure Large Instance ony.
> The Server will be restored to the point when the Snapshot was taken.

A 'boot' snapshot can be recovered as follows:

1. The customer will need to shut down the server.
1. After the Server is shut down, the customer will need to open a service request that contains the Machine ID and Snapshot to restore.
    > Customers can open a service request from the Azure portal: <https://portal.azure.com>
1. Microsoft will restore the Operating System LUN using the specified Machine ID and Snapshot, and then boot the Server.
1. The customer will then need to confirm Server is booted and healthy.

No additional steps to be performed after the restore.

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
    command will keep a maximum number of snapshots for the prefix based on the retention
    set on the command line, and will delete the oldest snapshot if it goes beyond the
    maximum number to retain.
- **Snapshot name:** The snapshot name includes the prefix label provided by the customer.
- **Size of the snapshot:** Depends upon the size/changes on the database level.
- **Log file location:** Log files generated by the commands are output into folders as
    defined in the JSON configuration file, which by default is a subfolder under where the command
    is run (for example, `./logs`).

## Next steps

- [Troubleshoot](azacsnap-troubleshoot.md)
