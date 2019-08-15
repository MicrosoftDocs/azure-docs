---
title: Back up and recover an Oracle Database 12c database on an Azure Linux virtual machine | Microsoft Docs
description: Learn how to back up and recover an Oracle Database 12c database in your Azure environment.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: romitgirdhar
manager: gwallace
editor: 
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 08/02/2018
ms.author: rogirdh
---

# Back up and recover an Oracle Database 12c database on an Azure Linux virtual machine

You can use Azure CLI to create and manage Azure resources at a command prompt, or use scripts. In this article, we use Azure CLI scripts to deploy an Oracle Database 12c database from an Azure Marketplace gallery image.

Before you begin, make sure that Azure CLI is installed. For more information, see the [Azure CLI installation guide](https://docs.microsoft.com/cli/azure/install-azure-cli).

## Prepare the environment

### Step 1: Prerequisites

*   To perform the backup and recovery process, you must first create a Linux VM that has an installed instance of Oracle Database 12c. The Marketplace image you use to create the VM is named *Oracle:Oracle-Database-Ee:12.1.0.2:latest*.

    To learn how to create an Oracle database, see the [Oracle create database quickstart](https://docs.microsoft.com/azure/virtual-machines/workloads/oracle/oracle-database-quick-create).


### Step 2: Connect to the VM

*   To create a Secure Shell (SSH) session with the VM, use the following command. Replace the IP address and the host name combination with the `publicIpAddress` value for your VM.

    ```bash 
    ssh <publicIpAddress>
    ```

### Step 3: Prepare the database

1.  This step assumes that you have an Oracle instance (cdb1) that is running on a VM named *myVM*.

    Run the *oracle* superuser root, and then initialize the listener:

    ```bash
    $ sudo su - oracle
    $ lsnrctl start
    Copyright (c) 1991, 2014, Oracle.  All rights reserved.

    Starting /u01/app/oracle/product/12.1.0/dbhome_1/bin/tnslsnr: please wait...

    TNSLSNR for Linux: Version 12.1.0.2.0 - Production
    Log messages written to /u01/app/oracle/diag/tnslsnr/myVM/listener/alert/log.xml
    Listening on: (DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=myVM.twltkue3xvsujaz1bvlrhfuiwf.dx.internal.cloudapp.net)(PORT=1521)))

    Connecting to (ADDRESS=(PROTOCOL=tcp)(HOST=)(PORT=1521))
    STATUS of the LISTENER
    ------------------------
    Alias                     LISTENER
    Version                   TNSLSNR for Linux: Version 12.1.0.2.0 - Production
    Start Date                23-MAR-2017 15:32:08
    Uptime                    0 days 0 hr. 0 min. 0 sec
    Trace Level               off
    Security                  ON: Local OS Authentication
    SNMP                      OFF
    Listener Log File         /u01/app/oracle/diag/tnslsnr/myVM/listener/alert/log.xml
    Listening Endpoints Summary...
    (DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=myVM.twltkue3xvsujaz1bvlrhfuiwf.dx.internal.cloudapp.net)(PORT=1521)))
    The listener supports no services
    The command completed successfully
    ```

2.  (Optional) Make sure the database is in archive log mode:

    ```bash
    $ sqlplus / as sysdba
    SQL> SELECT log_mode FROM v$database;

    LOG_MODE
    ------------
    NOARCHIVELOG

    SQL> SHUTDOWN IMMEDIATE;
    SQL> STARTUP MOUNT;
    SQL> ALTER DATABASE ARCHIVELOG;
    SQL> ALTER DATABASE OPEN;
    SQL> ALTER SYSTEM SWITCH LOGFILE;
    ```
3.  (Optional) Create a table to test the commit:

    ```bash
    SQL> alter session set "_ORACLE_SCRIPT"=true ;
    Session altered.
    SQL> create user scott identified by tiger;
    User created.
    SQL> grant create session to scott;
    Grant succeeded.
    SQL> grant create table to scott;
    Grant succeeded.
    SQL> alter user scott quota 100M on users;
    User altered.
    SQL> connect scott/tiger
    SQL> create table scott_table(col1 number, col2 varchar2(50));
    Table created.
    SQL> insert into scott_Table VALUES(1,'Line 1');
    1 row created.
    SQL> commit;
    Commit complete.
    ```
4.  Verify or change the backup file location and size:

    ```bash
    $ sqlplus / as sysdba
    SQL> show parameter db_recovery
    NAME                                 TYPE        VALUE
    ------------------------------------ ----------- ------------------------------
    db_recovery_file_dest                string      /u01/app/oracle/fast_recovery_area
    db_recovery_file_dest_size           big integer 4560M
    ```
5. Use Oracle Recovery Manager (RMAN) to back up the database:

    ```bash
    $ rman target /
    RMAN> backup database plus archivelog;
    ```

### Step 4: Application-consistent backup for Linux VMs

Application-consistent backups is a new feature in Azure Backup. You can create and select scripts to execute before and after the VM snapshot (pre-snapshot and post-snapshot).

1. Download the JSON file.

    Download VMSnapshotScriptPluginConfig.json from https://github.com/MicrosoftAzureBackup/VMSnapshotPluginConfig. The file contents look similar to the following:

    ```azurecli
    {
        "pluginName" : "ScriptRunner",
        "preScriptLocation" : "",
        "postScriptLocation" : "",
        "preScriptParams" : ["", ""],
        "postScriptParams" : ["", ""],
        "preScriptNoOfRetries" : 0,
        "postScriptNoOfRetries" : 0,
        "timeoutInSeconds" : 30,
        "continueBackupOnFailure" : true,
        "fsFreezeEnabled" : true
    }
    ```

2. Create the /etc/azure folder on the VM:

    ```bash
    $ sudo su -
    # mkdir /etc/azure
    # cd /etc/azure
    ```

3. Copy the JSON file.

    Copy VMSnapshotScriptPluginConfig.json to the /etc/azure folder.

4. Edit the JSON file.

    Edit the VMSnapshotScriptPluginConfig.json file to include the `PreScriptLocation` and `PostScriptlocation` parameters. For example:

    ```azurecli
    {
        "pluginName" : "ScriptRunner",
        "preScriptLocation" : "/etc/azure/pre_script.sh",
        "postScriptLocation" : "/etc/azure/post_script.sh",
        "preScriptParams" : ["", ""],
        "postScriptParams" : ["", ""],
        "preScriptNoOfRetries" : 0,
        "postScriptNoOfRetries" : 0,
        "timeoutInSeconds" : 30,
        "continueBackupOnFailure" : true,
        "fsFreezeEnabled" : true
    }
    ```

5. Create the pre-snapshot and post-snapshot script files.

    Here's an example of pre-snapshot and post-snapshot scripts for a "cold backup" (an offline backup, with shutdown and restart):

    For /etc/azure/pre_script.sh:

    ```bash
    v_date=`date +%Y%m%d%H%M`
    ORA_HOME=/u01/app/oracle/product/12.1.0/dbhome_1
    ORA_OWNER=oracle
    su - $ORA_OWNER -c "$ORA_HOME/bin/dbshut $ORA_HOME" > /etc/azure/pre_script_$v_date.log
    ```

    For /etc/azure/post_script.sh:

    ```bash
    v_date=`date +%Y%m%d%H%M`
    ORA_HOME=/u01/app/oracle/product/12.1.0/dbhome_1
    ORA_OWNER=oracle
    su - $ORA_OWNER -c "$ORA_HOME/bin/dbstart $ORA_HOME" > /etc/azure/post_script_$v_date.log
    ```

    Here's an example of pre-snapshot and post-snapshot scripts for a "hot backup" (an online backup):

    ```bash
    v_date=`date +%Y%m%d%H%M`
    ORA_HOME=/u01/app/oracle/product/12.1.0/dbhome_1
    ORA_OWNER=oracle
    su - $ORA_OWNER -c "sqlplus / as sysdba @/etc/azure/pre_script.sql" > /etc/azure/pre_script_$v_date.log
    ```

    For /etc/azure/post_script.sh:

    ```bash
    v_date=`date +%Y%m%d%H%M`
    ORA_HOME=/u01/app/oracle/product/12.1.0/dbhome_1
    ORA_OWNER=oracle
    su - $ORA_OWNER -c "sqlplus / as sysdba @/etc/azure/post_script.sql" > /etc/azure/pre_script_$v_date.log
    ```

    For /etc/azure/pre_script.sql, modify the contents of the file per your requirements:

    ```bash
    alter tablespace SYSTEM begin backup;
    ...
    ...
    alter system switch logfile;
    alter system archive log stop;
    ```

    For /etc/azure/post_script.sql, modify the contents of the file per your requirements:

    ```bash
    alter tablespace SYSTEM end backup;
    ...
    ...
    alter system archive log start;
    ```

6. Change file permissions:

    ```bash
    # chmod 600 /etc/azure/VMSnapshotScriptPluginConfig.json
    # chmod 700 /etc/azure/pre_script.sh
    # chmod 700 /etc/azure/post_script.sh
    ```

7. Test the scripts.

    To test the scripts, first, sign in as root. Then, ensure that there are no errors:

    ```bash
    # /etc/azure/pre_script.sh
    # /etc/azure/post_script.sh
    ```

For more information, see [Application-consistent backup for Linux VMs](https://azure.microsoft.com/blog/announcing-application-consistent-backup-for-linux-vms-using-azure-backup/).


### Step 5: Use Azure Recovery Services vaults to back up the VM

1.  In the Azure portal, search for **Recovery Services vaults**.

    ![Recovery Services vaults page](./media/oracle-backup-recovery/recovery_service_01.png)

2.  On the **Recovery Services vaults** blade, to add a new vault, click **Add**.

    ![Recovery Services vaults add page](./media/oracle-backup-recovery/recovery_service_02.png)

3.  To continue, click **myVault**.

    ![Recovery Services vaults detail page](./media/oracle-backup-recovery/recovery_service_03.png)

4.  On the **myVault** blade, click **Backup**.

    ![Recovery Services vaults backup page](./media/oracle-backup-recovery/recovery_service_04.png)

5.  On the **Backup Goal** blade, use the default values of **Azure** and **Virtual machine**. Click **OK**.

    ![Recovery Services vaults detail page](./media/oracle-backup-recovery/recovery_service_05.png)

6.  For **Backup policy**, use **DefaultPolicy**, or select **Create New policy**. Click **OK**.

    ![Recovery Services vaults backup policy detail page](./media/oracle-backup-recovery/recovery_service_06.png)

7.  On the **Select virtual machines** blade, select the **myVM1** check box, and then click **OK**. Click the **Enable backup** button.

    ![Recovery Services vaults items to the backup detail page](./media/oracle-backup-recovery/recovery_service_07.png)

    > [!IMPORTANT]
    > After you click **Enable backup**, the backup process doesn't start until the scheduled time expires. To set up an immediate backup, complete the next step.

8.  On the **myVault - Backup items** blade, under **BACKUP ITEM COUNT**, select the backup item count.

    ![Recovery Services vaults myVault detail page](./media/oracle-backup-recovery/recovery_service_08.png)

9.  On the **Backup Items (Azure Virtual Machine)** blade, on the right side of the page, click the ellipsis (**...**) button, and then click **Backup now**.

    ![Recovery Services vaults Backup now command](./media/oracle-backup-recovery/recovery_service_09.png)

10. Click the **Backup** button. Wait for the backup process to finish. Then, go to [Step 6: Remove the database files](#step-6-remove-the-database-files).

    To view the status of the backup job, click **Jobs**.

    ![Recovery Services vaults job page](./media/oracle-backup-recovery/recovery_service_10.png)

    The status of the backup job appears in the following image:

    ![Recovery Services vaults job page with status](./media/oracle-backup-recovery/recovery_service_11.png)

11. For an application-consistent backup, address any errors in the log file. The log file is located at /var/log/azure/Microsoft.Azure.RecoveryServices.VMSnapshotLinux/1.0.9114.0.

### Step 6: Remove the database files 
Later in this article, you'll learn how to test the recovery process. Before you can test the recovery process, you have to remove the database files.

1.  Remove the tablespace and backup files:

    ```bash
    $ sudo su - oracle
    $ cd /u01/app/oracle/oradata/cdb1
    $ rm -f *.dbf
    $ cd /u01/app/oracle/fast_recovery_area/CDB1/backupset
    $ rm -rf *
    ```
    
2.  (Optional) Shut down the Oracle instance:

    ```bash
    $ sqlplus / as sysdba
    SQL> shutdown abort
    ORACLE instance shut down.
    ```

## Restore the deleted files from the Recovery Services vaults
To restore the deleted files, complete the following steps:

1. In the Azure portal, search for the *myVault* Recovery Services vaults item. On the **Overview** blade, under **Backup items**, select the number of items.

    ![Recovery Services vaults myVault backup items](./media/oracle-backup-recovery/recovery_service_12.png)

2. Under **BACKUP ITEM COUNT**, select the number of items.

    ![Recovery Services vaults Azure Virtual Machine backup item count](./media/oracle-backup-recovery/recovery_service_13.png)

3. On the **myvm1** blade, click **File Recovery (Preview)**.

    ![Screenshot of the Recovery Services vaults file recovery page](./media/oracle-backup-recovery/recovery_service_14.png)

4. On the **File Recovery (Preview)** pane, click **Download Script**. Then, save the download (.sh) file to a folder on the client computer.

    ![Download script file saves options](./media/oracle-backup-recovery/recovery_service_15.png)

5. Copy the .sh file to the VM.

    The following example shows how you to use a secure copy (scp) command to move the file to the VM. You also can copy the contents to the clipboard, and then paste the contents in a new file that is set up on the VM.

    > [!IMPORTANT]
    > In the following example, ensure that you update the IP address and folder values. The values must map to the folder where the file is saved.

    ```bash
    $ scp Linux_myvm1_xx-xx-2017 xx-xx-xx PM.sh <publicIpAddress>:/<folder>
    ```
6. Change the file, so that it's owned by the root.

    In the following example, change the file so that it's owned by the root. Then, change permissions.

    ```bash 
    $ ssh <publicIpAddress>
    $ sudo su -
    # chown root:root /<folder>/Linux_myvm1_xx-xx-2017 xx-xx-xx PM.sh
    # chmod 755 /<folder>/Linux_myvm1_xx-xx-2017 xx-xx-xx PM.sh
    # /<folder>/Linux_myvm1_xx-xx-2017 xx-xx-xx PM.sh
    ```
    The following example shows what you should see after you run the preceding script. When you're prompted to continue, enter **Y**.

    ```bash
    Microsoft Azure VM Backup - File Recovery
    ______________________________________________
    The script requires 'open-iscsi' and 'lshw' to run.
    Do you want us to install 'open-iscsi' and 'lshw' on this machine?
    Please press 'Y' to continue with installation, 'N' to abort the operation. : Y
    Installing 'open-iscsi'....
    Installing 'lshw'....

    Connecting to recovery point using ISCSI service...

    Connection succeeded!

    Please wait while we attach volumes of the recovery point to this machine...

    ************ Volumes of the recovery point and their mount paths on this machine ************

    Sr.No.  |  Disk  |  Volume  |  MountPath

    1)  | /dev/sde  |  /dev/sde1  |  /root/myVM-20170517093913/Volume1

    2)  | /dev/sde  |  /dev/sde2  |  /root/myVM-20170517093913/Volume2

    ************ Open File Explorer to browse for files. ************

    After recovery, to remove the disks and close the connection to the recovery point, please click 'Unmount Disks' in step 3 of the portal.

    Please enter 'q/Q' to exit...
    ```

7. Access to the mounted volumes is confirmed.

    To exit, enter **q**, and then search for the mounted volumes. To create a list of the added volumes, at a command prompt, enter **df -k**.

    ![The df -k command](./media/oracle-backup-recovery/recovery_service_16.png)

8. Use the following script to copy the missing files back to the folders:

    ```bash
    # cd /root/myVM-2017XXXXXXX/Volume2/u01/app/oracle/fast_recovery_area/CDB1/backupset/2017_xx_xx
    # cp *.bkp /u01/app/oracle/fast_recovery_area/CDB1/backupset/2017_xx_xx
    # cd /u01/app/oracle/fast_recovery_area/CDB1/backupset/2017_xx_xx
    # chown oracle:oinstall *.bkp
    # cd /root/myVM-2017XXXXXXX/Volume2/u01/app/oracle/oradata/cdb1
    # cp *.dbf /u01/app/oracle/oradata/cdb1
    # cd /u01/app/oracle/oradata/cdb1
    # chown oracle:oinstall *.dbf
    ```
9. In the following script, use RMAN to recover the database:

    ```bash
    # sudo su - oracle
    $ rman target /
    RMAN> startup mount;
    RMAN> restore database;
    RMAN> recover database;
    RMAN> alter database open resetlogs;
    RMAN> SELECT * FROM scott.scott_table;
    ```
    
10. Unmount the disk.

    In the Azure portal, on the **File Recovery (Preview)** blade, click **Unmount Disks**.

    ![Unmount disks command](./media/oracle-backup-recovery/recovery_service_17.png)

## Restore the entire VM

Instead of restoring the deleted files from the Recovery Services vaults, you can restore the entire VM.

### Step 1: Delete myVM

*   In the Azure portal, go to the **myVM1** vault, and then select **Delete**.

    ![Vault delete command](./media/oracle-backup-recovery/recover_vm_01.png)

### Step 2: Recover the VM

1.  Go to **Recovery Services vaults**, and then select **myVault**.

    ![myVault entry](./media/oracle-backup-recovery/recover_vm_02.png)

2.  On the **Overview** blade, under **Backup items**, select the number of items.

    ![myVault back up items](./media/oracle-backup-recovery/recover_vm_03.png)

3.  On the **Backup Items (Azure Virtual Machine)** blade, select **myvm1**.

    ![Recovery VM page](./media/oracle-backup-recovery/recover_vm_04.png)

4.  On the **myvm1** blade, click the ellipsis (**...**) button,  and then click **Restore VM**.

    ![Restore VM command](./media/oracle-backup-recovery/recover_vm_05.png)

5.  On the **Select restore point** blade, select the item that you want to restore, and then click **OK**.

    ![Select the restore point](./media/oracle-backup-recovery/recover_vm_06.png)

    If you have enabled application-consistent backup, a vertical blue bar appears.

6.  On the **Restore configuration** blade, select the virtual machine name, select the resource group, and then click **OK**.

    ![Restore configuration values](./media/oracle-backup-recovery/recover_vm_07.png)

7.  To restore the VM, click the **Restore** button.

8.  To view the status of the restore process, click **Jobs**, and then click **Backup Jobs**.

    ![Backup jobs status command](./media/oracle-backup-recovery/recover_vm_08.png)

    The following figure shows the status of the restore process:

    ![Status of the restore process](./media/oracle-backup-recovery/recover_vm_09.png)

### Step 3: Set the public IP address
After the VM is restored, set up the public IP address.

1.  In the search box, enter **public IP address**.

    ![List of public IP addresses](./media/oracle-backup-recovery/create_ip_00.png)

2.  On the **Public IP addresses** blade, click **Add**. On the **Create public IP address** blade, for **Name**, select the public IP name. For **Resource group**, select **Use existing**. Then, click **Create**.

    ![Create IP address](./media/oracle-backup-recovery/create_ip_01.png)

3.  To associate the public IP address with the network interface for the VM,
search for and select **myVMip**. Then, click **Associate**.

    ![Associate IP address](./media/oracle-backup-recovery/create_ip_02.png)

4.  For **Resource type**, select **Network interface**. Select the network interface that is used by the myVM instance, and then click **OK**.

    ![Select resource type and NIC values](./media/oracle-backup-recovery/create_ip_03.png)

5.  Search for and open the instance of myVM that is ported from the portal. The IP address that is associated with the VM appears on the myVM **Overview** blade.

    ![IP address value](./media/oracle-backup-recovery/create_ip_04.png)

### Step 4: Connect to the VM

*   To connect to the VM, use the following script:

    ```bash 
    ssh <publicIpAddress>
    ```

### Step 5: Test whether the database is accessible
*   To test accessibility, use the following script:

    ```bash 
    $ sudo su - oracle
    $ sqlplus / as sysdba
    SQL> startup
    ```

    > [!IMPORTANT]
    > If the database **startup** command generates an error, to recover the database, see [Step 6: Use RMAN to recover the database](#step-6-optional-use-rman-to-recover-the-database).

### Step 6: (Optional) Use RMAN to recover the database
*   To recover the database, use the following script:

    ```bash
    # sudo su - oracle
    $ rman target /
    RMAN> startup mount;
    RMAN> restore database;
    RMAN> recover database;
    RMAN> alter database open resetlogs;
    RMAN> SELECT * FROM scott.scott_table;
    ```

The backup and recovery of the Oracle Database 12c database on an Azure Linux VM is now finished.

## Delete the VM

When you no longer need the VM, you can use the following command to remove the resource group, the VM, and all related resources:

```azurecli
az group delete --name myResourceGroup
```

## Next steps

[Tutorial: Create highly available VMs](../../linux/create-cli-complete.md)

[Explore VM deployment Azure CLI samples](../../linux/cli-samples.md)



