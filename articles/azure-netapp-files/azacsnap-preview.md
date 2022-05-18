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
ms.date: 03/07/2022
ms.author: phjensen
---

# Preview features of Azure Application Consistent Snapshot tool

> [!NOTE]
> PREVIEWS ARE PROVIDED "AS-IS," "WITH ALL FAULTS," AND "AS AVAILABLE," AND ARE EXCLUDED FROM THE SERVICE LEVEL AGREEMENTS AND LIMITED WARRANTY
> ref:  https://azure.microsoft.com/support/legal/preview-supplemental-terms/

This article provides a guide on set up and usage of the new features in preview for **AzAcSnap v5.1**.  These new features can be used with Azure NetApp Files, Azure BareMetal, and now Azure Managed Disk.  This guide should be read along with the documentation for the generally available version of AzAcSnap at [aka.ms/azacsnap](./azacsnap-introduction.md).

The five new preview features provided with AzAcSnap v5.1 are:
- Oracle Database support.
- Backint coexistence.
- Azure Managed Disk.
- RunBefore and RunAfter capability.
- Azure Key Vault support for storing Service Principal.

Minor addition to `--volume` option:
- All volumes snapshot.

## Providing feedback

Feedback on AzAcSnap, including this preview, can be provided [online](https://aka.ms/azacsnap-feedback).

## Getting the AzAcSnap Preview snapshot tools

Get the most recent version of the Preview [AzAcSnap Preview Installer](https://aka.ms/azacsnap-preview-installer) from Microsoft.

The self-installation file has an associated [MD5 checksum file](https://aka.ms/azacsnap-preview-installer-checksum) to check the download integrity.

First download the installer.  Follow the steps in the main [get started](azacsnap-get-started.md) documentation to complete the install of AzAcSnap.  Return
to this document for details on using the preview features.

## Oracle Database

### Supported platforms and operating systems

> [!NOTE]
> Support for Oracle is Preview feature.  
> This section's content supplements [What is Azure Application Consistent Snapshot tool](azacsnap-introduction.md) website page.

New database platforms and operating systems supported with this preview release.

- **Databases**
  - Oracle Database release 12 or later (refer to [Oracle VM images and their deployment on Microsoft Azure](../virtual-machines/workloads/oracle/oracle-vm-solutions.md) for details)

- **Operating Systems**
  - Oracle Linux 7+


### Enable communication with database

> [!NOTE]
> Support for Oracle is Preview feature.  
> This section's content supplements [Install Azure Application Consistent Snapshot tool](azacsnap-installation.md) website page.

This section explains how to enable communication with storage. Ensure the storage back-end you're using is correctly selected.

# [Oracle](#tab/oracle)

The snapshot tools communicate with the Oracle database and need a user with appropriate permissions to enable/disable backup mode.  After putting the database in backup 
mode, `azacsnap` will query the Oracle database to get a list of files, which have backup-mode as active.  This file list is output into an external file, which is in 
the same location and basename as the log file, but with a ".protected-tables" extension (output filename detailed in the AzAcSnap log file). 

The following examples show the set up of the Oracle database user, the use of `mkstore` to create an Oracle Wallet, and the `sqlplus` configuration files required for 
communication to the Oracle database. 

The following example commands set up a user (AZACSNAP) in the Oracle database, change the IP address, usernames, and passwords as appropriate:

1. From the Oracle database installation

    ```bash
    su – oracle
    sqlplus / AS SYSDBA
    ```

    ```output
    SQL*Plus: Release 12.1.0.2.0 Production on Mon Feb 1 01:34:05 2021
    Copyright (c) 1982, 2014, Oracle. All rights reserved.
    Connected to:
    Oracle Database 12c Standard Edition Release 12.1.0.2.0 - 64bit Production
    SQL>
    ```

1. Create the user

    This example creates the AZACSNAP user.

    ```sql
    SQL> CREATE USER azacsnap IDENTIFIED BY password;
    ```

    ```output
    User created.
    ```

1. Grant the user permissions - This example sets the permission for the AZACSNAP user to allow for putting the database in backup mode.

    ```sql
    SQL> GRANT CREATE SESSION TO azacsnap;
    ```

    ```output
    Grant succeeded.
    ```


    ```sql
    SQL> GRANT SYSBACKUP TO azacsnap;
    ```
    
    ```output
    Grant succeeded.
    ```

    ```sql
    SQL> connect azacsnap/password
    ```

    ```output
    Connected.
    ```

    ```sql
    SQL> quit
    ```

1. OPTIONAL - Prevent user's password from expiring

   It may be necessary to disable password expiry for the user, without this change the user's password could expire preventing snapshots to be taken correctly. 
   
   > [!NOTE]
   > Check with corporate policy before making this change.
   
   This example gets the password expiration for the AZACSNAP user:
   
   ```sql
   SQL> SELECT username, account_status,expiry_date,profile FROM dba_users WHERE username='AZACSNAP';
   ```
   
   ```output
   USERNAME              ACCOUNT_STATUS                 EXPIRY_DA PROFILE
   --------------------- ------------------------------ --------- ------------------------------
   AZACSNAP              OPEN                           DD-MMM-YY DEFAULT
   ```
   
   There are a few methods for disabling password expiry in the Oracle database, refer to your database administrator for guidance.  One example is 
   by modifying the DEFAULT user's profile so the password life time is unlimited as follows:
   
   ```sql
   SQL> ALTER PROFILE default LIMIT PASSWORD_LIFE_TIME unlimited;
   ```
   
   After making this change, there should be no password expiry date for user's with the DEFAULT profile.

   ```sql
   SQL> SELECT username, account_status,expiry_date,profile FROM dba_users WHERE username='AZACSNAP';
   ```
   
   ```output
   USERNAME              ACCOUNT_STATUS                 EXPIRY_DA PROFILE
   --------------------- ------------------------------ --------- ------------------------------
   AZACSNAP              OPEN                                     DEFAULT
   ```


1. The Oracle Wallet provides a method to manage database credentials across multiple domains. This capability is accomplished by using a database connection string in 
   the datasource definition, which is resolved by an entry in the wallet. When used correctly, the Oracle Wallet makes having passwords in the datasource 
   configuration unnecessary.
   
   This makes it possible to use the Oracle Transparent Network Substrate (TNS) administrative file with a connection string alias, thus hiding details of the database 
   connection string. If the connection information changes, it's a matter of changing the `tnsnames.ora` file instead 
   of potentially many datasource definitions.
   
   Set up the Oracle Wallet (change the password) This example uses the mkstore command from the Linux shell to set up the Oracle wallet. These commands 
   are run on the Oracle database server using unique user credentials to avoid any impact on the running database. In this example a new user (azacsnap) 
   is created, and their environment variables configured appropriately.
   
   > [!IMPORTANT]
   > Be sure to create a unique user to generate the Oracle Wallet to avoid any impact on the running database.
   
   1. Run the following commands on the Oracle Database Server.
      
    1. Get the Oracle environment variables to be used in set up.  Run the following commands as the `root` user on the Oracle Database Server.

       ```bash
       su - oracle -c 'echo $ORACLE_SID'
       ```
       
       ```output
       oratest1
       ```
       
       ```bash
       su - oracle -c 'echo $ORACLE_HOME'
       ```
       
       ```output
       /u01/app/oracle/product/19.0.0/dbhome_1
       ```
       
    1. Create the Linux user to generate the Oracle Wallet and associated `*.ora` files using the output from the previous step.

       > [!NOTE]
       > In these examples we are using the `bash` shell.  If you're using a different shell (for example, csh), then ensure environment variables have been set correctly.

       ```bash
       useradd -m azacsnap
       echo "export ORACLE_SID=oratest1" >> /home/azacsnap/.bash_profile
       echo "export ORACLE_HOME=/u01/app/oracle/product/19.0.0/dbhome_1" >> /home/azacsnap/.bash_profile
       echo "export TNS_ADMIN=/home/azacsnap" >> /home/azacsnap/.bash_profile
       echo "export PATH=\$PATH:\$ORACLE_HOME/bin" >> /home/azacsnap/.bash_profile
       ```

    1. As the new Linux user (`azacsnap`), create the wallet and `*.ora` files.
    
       `su` to the user created in the previous step.
       
       ```bash
       sudo su - azacsnap
       ```
       
       Create the Oracle Wallet.

       ```bash
       mkstore -wrl $TNS_ADMIN/.oracle_wallet/ -create
       ```
       
       ```output
       Oracle Secret Store Tool Release 19.0.0.0.0 - Production
       Version 19.3.0.0.0
       Copyright (c) 2004, 2019, Oracle and/or its affiliates. All rights reserved.
       
       Enter password: <wallet_password>
       Enter password again: <wallet_password>
       ```
       
       Add the connect string credentials to the Oracle Wallet.  In the following example command: AZACSNAP is the ConnectString to be used by AzAcSnap; azacsnap 
       is the Oracle Database User; AzPasswd1 is the Oracle User's database password.
       
       ```bash
       mkstore -wrl $TNS_ADMIN/.oracle_wallet/ -createCredential AZACSNAP azacsnap AzPasswd1
       ```
       
       ```output
       Oracle Secret Store Tool Release 19.0.0.0.0 - Production
       Version 19.3.0.0.0
       Copyright (c) 2004, 2019, Oracle and/or its affiliates. All rights reserved.
       
       Enter wallet password: <wallet_password>
       ```
       
       Create the `tnsnames-ora` file.  In the following example command: HOST should be set to the IP address of the Oracle Database Server; SID should be 
       set to the Oracle Database SID.
      
       ```bash
       echo "# Connection string
       AZACSNAP=\"(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=192.168.1.1)(PORT=1521))(CONNECT_DATA=(SID=oratest1)))\"
       " > $TNS_ADMIN/tnsnames.ora
       ```
       
       Create the `sqlnet.ora` file.
       
       ```bash
       echo "SQLNET.WALLET_OVERRIDE = TRUE
       WALLET_LOCATION=(
           SOURCE=(METHOD=FILE)
           (METHOD_DATA=(DIRECTORY=\$TNS_ADMIN/.oracle_wallet))
       ) " > $TNS_ADMIN/sqlnet.ora
       ```
       
       Test the Oracle Wallet.
       
       ```bash
       sqlplus /@AZACSNAP as SYSBACKUP
       ```
       
       ```output
       SQL*Plus: Release 19.0.0.0.0 - Production on Wed Jan 12 00:25:32 2022
       Version 19.3.0.0.0
       
       Copyright (c) 1982, 2019, Oracle.  All rights reserved.
       
       
       Connected to:
       Oracle Database 19c Enterprise Edition Release 19.0.0.0.0 - Production
       Version 19.3.0.0.0
       ```
       
       ```sql
       SELECT MACHINE FROM V$SESSION WHERE SID=1;
       ```
       
       ```output
       MACHINE
       ----------------------------------------------------------------
       oradb-19c
       ```
       
       ```sql
       quit
       ```
       
       ```output
       Disconnected from Oracle Database 19c Enterprise Edition Release 19.0.0.0.0 - Production
       Version 19.3.0.0.0
       ```
       
       Create a ZIP file archive of the Oracle Wallet and `*.ora` files.
       
       ```bash
       cd $TNS_ADMIN
       zip -r wallet.zip sqlnet.ora tnsnames.ora .oracle_wallet
       ```
       
       ```output
         adding: sqlnet.ora (deflated 9%)
         adding: tnsnames.ora (deflated 7%)
         adding: .oracle_wallet/ (stored 0%)
         adding: .oracle_wallet/ewallet.p12.lck (stored 0%)
         adding: .oracle_wallet/ewallet.p12 (deflated 1%)
         adding: .oracle_wallet/cwallet.sso.lck (stored 0%)
         adding: .oracle_wallet/cwallet.sso (deflated 1%)
       ```

    1. Copy the ZIP file to the target system (for example, the centralized virtual machine running AzAcSnap).
    
       > [!NOTE]
       > If deploying to a centralized virtual machine, then it will need to have the Oracle instant client installed and set up so the AzAcSnap user can 
       > run `sqlplus` commands.  The Oracle Instant Client can downloaded from https://www.oracle.com/database/technologies/instant-client/linux-x86-64-downloads.html.
       > In order for SQL\*Plus to run correctly, download both the required package (for example, Basic Light Package) and the optional SQL\*Plus tools package.

   1. Complete the following steps on the system running AzAcSnap.
      
    1. Deploy ZIP file copied from the previous step.
    
       > [!IMPORTANT]
       > This step assumes the user running AzAcSnap, by default `azacsnap`, already has been created using the AzAcSnap installer.
       
       > [!NOTE]
       > It's possible to leverage the `TNS_ADMIN` shell variable to allow for multiple Oracle targets by setting the unique shell variable value
       > for each Oracle system as needed.

       ```bash
       export TNS_ADMIN=$HOME/ORACLE19c
       mkdir $TNS_ADMIN
       cd $TNS_ADMIN
       unzip ~/wallet.zip
       ```
       
       ```output
       Archive:  wallet.zip
         inflating: sqlnet.ora
         inflating: tnsnames.ora
          creating: .oracle_wallet/
        extracting: .oracle_wallet/ewallet.p12.lck
         inflating: .oracle_wallet/ewallet.p12
        extracting: .oracle_wallet/cwallet.sso.lck
         inflating: .oracle_wallet/cwallet.sso
       ```
       
       Check the files have been extracted correctly.
       
       ```bash
       ls
       ```
       
       ```output
       sqlnet.ora  tnsnames.ora  wallet.zip
       ```
       
       Assuming all the previous steps have been completed correctly, then it should be possible to connect to the database using the `/@AZACSNAP` connect string.
       
       ```bash
       sqlplus /@AZACSNAP as SYSBACKUP
       ```
       
       ```output
       SQL*Plus: Release 21.0.0.0.0 - Production on Wed Jan 12 13:39:36 2022
       Version 21.1.0.0.0
       
       Copyright (c) 1982, 2020, Oracle.  All rights reserved.
       
       
       Connected to:
       Oracle Database 19c Enterprise Edition Release 19.0.0.0.0 - Production
       Version 19.3.0.0.0
       
       ```sql
       SQL> quit
       ```
       
       ```output
       Disconnected from Oracle Database 19c Enterprise Edition Release 19.0.0.0.0 - Production
       Version 19.3.0.0.0
       ```
       
       > [!IMPORTANT]
       > The `$TNS_ADMIN` shell variable determines where to locate the Oracle Wallet and `*.ora` files, so it must be set before running `azacsnap` to ensure
       > correct operation.
       
    1. Test the set up with AzAcSnap
       
       After configuring AzAcSnap (for example, `azacsnap -c configure --configuration new`) with the Oracle connect string (for example, `/@AZACSNAP`), it should 
       be possible to connect to the Oracle database.
       
       Check the `$TNS_ADMIN` variable is set for the correct Oracle target system
       
       ```bash
       ls -al $TNS_ADMIN
       ```
       
       ```output
       total 16
       drwxrwxr-x.  3 orasnap orasnap   84 Jan 12 13:39 .
       drwx------. 18 orasnap sapsys  4096 Jan 12 13:39 ..
       drwx------.  2 orasnap orasnap   90 Jan 12 13:23 .oracle_wallet
       -rw-rw-r--.  1 orasnap orasnap  125 Jan 12 13:39 sqlnet.ora
       -rw-rw-r--.  1 orasnap orasnap  128 Jan 12 13:24 tnsnames.ora
       -rw-r--r--.  1 root    root    2569 Jan 12 13:28 wallet.zip
       ```
       
       Run the `azacsnap` test command
       
       ```bash
       cd ~/bin
       azacsnap -c test --test oracle --configfile ORACLE.json
       ```
       
       ```output
       BEGIN : Test process started for 'oracle'
       BEGIN : Oracle DB tests
       PASSED: Successful connectivity to Oracle DB version 1903000000
       END   : Test process complete for 'oracle'
       ```
       
       > [!IMPORTANT]
       > The `$TNS_ADMIN` variable must be set up correctly for `azacsnap` to run correctly, either by adding to the user's `.bash_profile` file, 
       > or by exporting it before each run (for example, `export TNS_ADMIN="/home/orasnap/ORACLE19c" ; cd /home/orasnap/bin ; ./azacsnap --configfile ORACLE19c.json 
       > -c backup --volume data --prefix hourly-ora19c --retention 12`)

---

### Configuring the database

This section explains how to configure the data base.

# [Oracle](#tab/oracle)

The following changes must be applied to the Oracle Database to allow for monitoring by the database administrator. 

1. Set up Oracle alert logging
   
   Use the following Oracle SQL commands while connected to the database as SYSDBA to create a stored procedure under the default Oracle SYSBACKUP database account. 
   These SQL commands allow AzAcSnap to output messages to standard output using the PUT_LINE procedure in the DBMS_OUTPUT package, and also to the Oracle database `alert.log` 
   file (using the KSDWRT procedure in the DBMS_SYSTEM package).
    
   ```bash
   sqlplus / As SYSDBA
   ```
   
   ```sql
   GRANT EXECUTE ON DBMS_SYSTEM TO SYSBACKUP;
   CREATE PROCEDURE sysbackup.azmessage(in_msg IN VARCHAR2)
   AS
       v_timestamp VARCHAR2(32);
   BEGIN
       SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS')
           INTO v_timestamp FROM DUAL;
       SYS.DBMS_SYSTEM.KSDWRT(SYS.DBMS_SYSTEM.ALERT_FILE, in_msg);
   END azmessage;
   /
   SHOW ERRORS
   QUIT
   ```

---

### Configuring AzAcSnap

This section explains how to configure AzAcSnap for the specified database.

> [!NOTE]
> Support for Oracle is Preview feature.  
> This section's content supplements [Configure Azure Application Consistent Snapshot tool](azacsnap-cmd-ref-configure.md) website page.

### Details of required values

The following sections provide detailed guidance on the various values required for the configuration file.

# [Oracle](#tab/oracle)

#### Oracle Database values for configuration

When adding an Oracle database to the configuration, the following values are required:

- **Oracle DB Server's Address** = The database server hostname or IP address.
- **SID** = The database System ID.
- **Oracle Connect String** = The Connect String used by `sqlplus` to connect to Oracle and enable/disable backup mode.

---

## Backint coexistence

> [!NOTE]
> Support for coexistence with SAP HANA's Backint interface is a Preview feature.  
> This section's content supplements [Configure Azure Application Consistent Snapshot tool](azacsnap-cmd-ref-configure.md) website page.

[Azure Backup](/azure/backup/) service provides an alternate backup tool for SAP HANA, where database and log backups are streamed into the 
Azure Backup Service.  Some customers would like to combine the streaming backint-based backups with regular snapshot-based backups.  However, backint-based 
backups block other methods of backup, such as using a files-based backup or a storage snapshot-based backup (for example, AzAcSnap).  Guidance is provided on
the Azure Backup site on how to [Run SAP HANA native client backup to local disk on a database with Azure Backup enabled](/azure/backup/sap-hana-db-manage#run-sap-hana-native-client-backup-to-local-disk-on-a-database-with-azure-backup-enabled).  

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

Refer to this partial snippet of the configuration file to see where this value is placed and the correct format:

```output
  "database": [
    {
      "hana": {
        "serverAddress": "127.0.0.1",
        "sid": "P40",
        "instanceNumber": "00",
        "hdbUserStoreName": "AZACSNAP",
        "savePointAbortWaitSeconds": 600,
        "autoDisableEnableBackint": true,
```

## Azure Managed Disk

> [!NOTE]
> Support for Azure Managed Disk as a storage back-end is a Preview feature.  
> This section's content supplements [Configure Azure Application Consistent Snapshot tool](azacsnap-cmd-ref-configure.md) website page.

Microsoft provides many storage options for deploying databases such as SAP HANA.  Many of these options are detailed on the 
[Azure Storage types for SAP workload](/azure/virtual-machines/workloads/sap/planning-guide-storage) web page.  Additionally there's a 
[Cost conscious solution with Azure premium storage](/azure/virtual-machines/workloads/sap/hana-vm-operations-storage#cost-conscious-solution-with-azure-premium-storage).  

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


## RunBefore and RunAfter capability

> [!NOTE]
> Support for `azacsnap` to run shell commands before and after `azacsnap` executes is a Preview feature.  
> This section's content supplements [What is Azure Application Consistent Snapshot tool](azacsnap-introduction.md) website page.

A new capability for AzAcSnap to execute external commands before or after its main execution.

`--runbefore` will run a shell command before the main execution of azacsnap and provides some of the azacsnap command-line parameters to the shell environment. 
By default, `azacsnap` will wait up to 30 seconds for the external shell command to complete before killing the process and returning to azacsnap normal execution. 
This delay can be overridden by adding a number to wait in seconds after a `%` character (for example, `--runbefore "mycommand.sh%60"` will wait up to 60 seconds for `mycommand.sh` 
to complete).

`--runafter` will run a shell command after the main execution of azacsnap and provides some of the azacsnap command-line parameters to the shell environment. 
By default, `azacsnap` will wait up to 30 seconds for the external shell command to complete before killing the process and returning to azacsnap normal execution. 
This can be overridden by adding a number to wait in seconds after a `%` character (for example, `--runafter "mycommand.sh%60"` will wait for up to 60 seconds for `mycommand.sh` 
to complete).

The following list of environment variables is generated by `azacsnap` and passed to the shell forked to run the commands provided as parameters to `--runbefore` and `--runafter`:

- `$azCommand` = the command option passed to -c (for example, backup, test, etc.).
- `$azConfigFileName` = the configuration filename.
- `$azPrefix` = the --prefix value.
- `$azRetention` = the --retention value.
- `$azSid` = the --dbsid value.
- `$azSnapshotName` = the snapshot name generated by azacsnap.

> [!NOTE]
> There's only a value for `$azSnapshotName` in the `--runafter` option.

### Example usage

An example usage for this new feature is to upload a snapshot to Azure Blob for archival purposes using the azcopy tool ([Copy or move data to Azure Storage by using AzCopy](/azure/storage/common/storage-use-azcopy-v10)).  

The following crontab entry is a single line and runs `azacsnap` at five past midnight.  Note the call to `snapshot-to-blob.sh` passing the snapshot name and snapshot prefix:

```output
5 0 * * *         ( . ~/.bash_profile ; cd /home/azacsnap/bin ; ./azacsnap -c backup --volume data --prefix daily --retention 1 --configfile HANA.json --trim --ssl openssl --runafter 'env ; ./snapshot-to-blob.sh $azSnapshotName $azPrefix')
```

This example shell script has a special stanza at the end to prevent AzAcSnap from killing the external command due to the timeout described earlier.  This allows for 
a long running command, such as uploading large files with azcopy, to be run without being prematurely stopped. 

The snapshots need to be mounted on the system doing the copy, with at a minimum read-only privilege.  The base location of the mount point for the snapshots should
be provided to the `sourceDir` variable in the script.

```bash
cat snapshot-to-blob.sh
```

```output
#!/bin/bash
# Utility to upload-to/list Azure Blob store.
#   If run as snapshot-to-blob.sh will upload a gzipped tarball of the snapshot.
#   If run as list-blobs.sh will list uploaded blobs.
#     e.g. `ln -s snapshot-to-blob.sh list-blobs.sh`


# _START_ Change these
SAS_KEY_FILE="${HOME}/bin/blob-credentials.saskey"
# the snapshots need to be mounted locally for copying, put source directory here
SOURCE_DIR="/mnt/saphana1/hana_data_PR1/.snapshot"
# _END_ Change these


# _START_ AzCopy Settings
#Overrides where the job plan files (used for progress tracking and resuming) are stored, to avoid filling up a disk.
export AZCOPY_JOB_PLAN_LOCATION="${HOME}/.azcopy/plans/"
#Overrides where the log files are stored, to avoid filling up a disk.
export AZCOPY_LOG_LOCATION="${HOME}/.azcopy/logs/"
#If set, to anything, on-screen output will include counts of chunks by state
export AZCOPY_SHOW_PERF_STATES=true
# _END_ AzCopy Settings


# do not change any of the following


# Make sure we got some command line args
if [ "$(basename "$0")" = "snapshot-to-blob.sh" ] && ([ "$1" = "" ] || [ "$2" = "" ]); then
  echo "Usage: $0 <SNAPSHOT_NAME> <PREFIX>"
  exit 1
fi

# Make sure we can read the SAS key credential file.
if [ -r "${SAS_KEY_FILE}" ]; then
  source "${SAS_KEY_FILE}"
else
  echo "Credential file '${SAS_KEY_FILE}' not found, exiting!"
fi


# Assign the rest of the Global variables.
SNAPSHOT_NAME=$1
PREFIX=$2
BLOB_STORE="$(echo "${PORTAL_GENERATED_SAS}" | cut -f1 -d'?')"
BLOB_SAS_KEY="$(echo "${PORTAL_GENERATED_SAS}" | cut -f2 -d'?')"
ARCHIVE_LOG="logs/$(basename "$0").log"

# Archive naming (daily.1, daily.2, etc...)
DAY_OF_WEEK=$(date "+%u")
MONTH_OF_YEAR=$(date "+%m")
ARCHIVE_BLOB_TGZ="${PREFIX}.${DAY_OF_WEEK}.tgz"

#######################################
# Write to the log.
# Globals:
#   None
# Arguments:
#   LOG_MSG
#######################################
write_log(){
  LOG_MSG=$1
  date=$(date "+[%d/%h/%Y:%H:%M:%S %z]")
  echo "$date ${LOG_MSG}" >> "${ARCHIVE_LOG}"
}


#######################################
# Run and Log the command.
# Globals:
#   None
# Arguments:
#   CMD_TO_RUN
#######################################
run_cmd(){
  CMD_TO_RUN="${1}"
  write_log "[RUNCMD] ${CMD_TO_RUN}"
  bash -c "${CMD_TO_RUN}"
}


#######################################
# Check snapshot exists and then background the upload to Blob store.
# Globals:
#   SOURCE_DIR
#   SNAPSHOT_NAME
#   ARCHIVE_LOG
# Arguments:
#   None
#######################################
snapshot_to_blob(){
  # Check SOURCE_DIR and SNAPSHOT_NAME exist
  if [ ! -d "${SOURCE_DIR}/${SNAPSHOT_NAME}" ]; then
    echo "${SOURCE_DIR}/${SNAPSHOT_NAME} not found, exiting!" | tee -a "${ARCHIVE_LOG}"
    exit 1
  fi
  # background ourselves so AzAcSnap exits cleanly
  echo "Backgrounding '$0 $@' to prevent blocking azacsnap"
  echo "write_logging to ${ARCHIVE_LOG}"
  {
    trap '' HUP
    # the script
    upload_to_blob
    list_blob >> "${ARCHIVE_LOG}"
  } < /dev/null > /dev/null 2>&1 &
}


#######################################
# Upload to Blob store.
# Globals:
#   SOURCE_DIR
#   SNAPSHOT_NAME
#   ARCHIVE_BLOB_TGZ
#   BLOB_STORE
#   BLOB_SAS_KEY
#   ARCHIVE_LOG
# Arguments:
#   None
#######################################
upload_to_blob(){
  # Copy snapshot to blob store
  echo "Starting upload of ${SNAPSHOT_NAME} to ${BLOB_STORE}/${ARCHIVE_BLOB_TGZ}" >> "${ARCHIVE_LOG}"
  run_cmd "azcopy env ; cd ${SOURCE_DIR}/${SNAPSHOT_NAME} && tar zcvf - * | azcopy cp \"${BLOB_STORE}/${ARCHIVE_BLOB_TGZ}?${BLOB_SAS_KEY}\" --from-to PipeBlob && cd -"
  echo "Completed upload of ${SNAPSHOT_NAME} ${BLOB_STORE}/${ARCHIVE_BLOB_TGZ}" >> "${ARCHIVE_LOG}"

  # Complete
  echo "Finished ($0 ${SNAPSHOT_NAME} ${PREFIX}) @ $(date "+%d-%h-%Y %H:%M")" >> "${ARCHIVE_LOG}"
  echo "--------------------------------------------------------------------------------" >> "${ARCHIVE_LOG}"
  # col 12345678901234567890123456789012345678901234567890123456789012345678901234567890
}


#######################################
# List contents of Blob store.
# Globals:
#   BLOB_STORE
#   BLOB_SAS_KEY
# Arguments:
#   None
#######################################
list_blob(){
  LOG_MSG="Current list of files stored in ${BLOB_STORE}"
  write_log "${LOG_MSG}"
  echo "${LOG_MSG}"
  run_cmd "azcopy list \"${BLOB_STORE}?${BLOB_SAS_KEY}\"  --properties LastModifiedTime "
}


# Log when script started.
write_log "Started ($0 ${SNAPSHOT_NAME} ${PREFIX}) @ $(date "+%d-%h-%Y %H:%M")"


# Check what this was called as ($0) and run accordingly.
case "$(basename "$0")" in
  "snapshot-to-blob.sh" )
    snapshot_to_blob
    ;;
  "list-blobs.sh" )
    list_blob
    ;;
  *)
    echo "Command '$0' not recognised!"
    ;;
esac
```

The saskeyFile contains the following example SAS Key (content changed for security):

```bash
cat blob-credentials.saskey
```

```output
# we need a generated SAS key, get this from the portal with read,add,create,write,list permissions
PORTAL_GENERATED_SAS="https://<targetstorageaccount>.blob.core.windows.net/<blob-store>?sp=racwl&st=2021-06-10T21:10:38Z&se=2021-06-11T05:10:38Z&spr=https&sv=2020-02-10&sr=c&sig=<key-material>"
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

## All Volumes Snapshot

A new optional value for `--volume` allows for all the volumes to be snapshot as a group.  This option allows for the snapshots to all have the same snapshot 
name, which is useful if doing a `-c restore` to clone or recover a system to specific date/time.

Running the AzAcSnap command `azacsnap -c backup --volume all --retention 5 --prefix all-volumes` will take snapshot backups, with all the snapshots having 
the same name with a prefix of `all-volumes` and a maximum of five snapshots with that prefix per volume.

The processing is handled in the order outlined as follows:

1. **data** Volume Snapshot (same as the normal `--volume data` option)
   1. put the database into *backup-mode*.
   1. take snapshots of the Volume(s) listed in the configuration file's `"dataVolume"` stanza.
   1. take the database out of *backup-mode*.
   1. perform snapshot management.
1. **other** Volume Snapshot (same as the normal `--volume other` option)
   1. take snapshots of the Volume(s) listed in the configuration file's `"otherVolume"` stanza.
   1. perform snapshot management.


## Next steps

- [Get started](azacsnap-get-started.md)
- [Test AzAcSnap](azacsnap-cmd-ref-test.md)
- [Back up using AzAcSnap](azacsnap-cmd-ref-backup.md)
