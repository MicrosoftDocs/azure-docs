---
title: Back up and recover an Oracle Database 12c database on an Azure Linux virtual machine | Microsoft Docs
description: Learn how to back up and recover an Oracle Database 12c database in your Azure environment.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: v-shiuma
manager: timlt
editor: 
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 5/17/2017
ms.author: rclaus
---

# Back up and recover an Oracle Database 12c database on an Azure Linux virtual machine

You can use Azure CLI to create and manage Azure resources at a command prompt, or use scripts. In this article, we use Azure CLI scripts to deploy an Oracle Database 12c database from an Azure Marketplace gallery image.

Before you begin, make sure that Azure CLI is installed. For more information, see [Azure CLI installation guide](https://docs.microsoft.com/cli/azure/install-azure-cli).

## Prepare the environment
### Step 1: Assumptions

*   To perform the backup and recovery process, you need to create a Linux VM with an installed instance of Oracle Database 12c. The Marketplace image you use to create the VMs is called *Oracle:Oracle-Database-Ee:12.1.0.2:latest*.

    For instructions on how to create an Oracle database, see [Oracle database quick create guide](https://docs.microsoft.com/azure/virtual-machines/workloads/oracle/oracle-database-quick-create).


### Step 2: Connect to the VM

*   To create a Secure Shell (SSH) session with the VM, use the following command. Replace the IP address and the host name combination with the `publicIpAddress` value for your VM.

    ```bash 
    ssh <publicIpAddress>
    ```

### Step 3: Prepare the database

1.  This step assumes that you have an Oracle instance (cdb1) that is running on a virtual machine called *myVM*.

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

2.  Make sure the database is in archive log mode (optional step):

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
3.  Create a table to test the commit (optional step):

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
5. Use the Oracle Recovery Manager (RMAN) to back up the database:

    ```bash
    $ rman target /
    RMAN> backup database plus archivelog;
    ```

### Step 4: Use Azure Recovery Services vaults to back up the VM



1.  Sign in to the Azure portal, and then search for a Recovery Services vaults instance.
![Recovery Services vaults page](./media/oracle-backup-recovery/recovery_service_01.png)

2.  To add a new vault, click the **Add** button.
![Recovery Services vaults add page](./media/oracle-backup-recovery/recovery_service_02.png)

3.  To continue, click **myVault**. The detail page appears.
![Recovery Services vaults detail page](./media/oracle-backup-recovery/recovery_service_03.png)

4.  Click the **Backup** button. Next, you add the backup goal, policy, and backup items.
![Recovery Services vaults backup page](./media/oracle-backup-recovery/recovery_service_04.png)

5.  For **Backup goal**, use the default **Azure** and **Virtual machine** values. To continue, click **OK**.
![Recovery Services vaults detail page](./media/oracle-backup-recovery/recovery_service_05.png)

6.  For **Backup policy**, use **DefaultPolicy** or **Create New policy**. To continue, click **OK**.
![Recovery Services vaults backup policy detail page](./media/oracle-backup-recovery/recovery_service_06.png)

7.  Select the **myVM1** check box, click **OK**, and then click **Enable backup**.
![Recovery Services vaults items to backup detail page](./media/oracle-backup-recovery/recovery_service_07.png)

    > [!IMPORTANT]
    > After you click **Enable backup**, the back up process does not start until the scheduled time expires. To set up an immediate backup, complete the next step.

8.  Click **Backup items**, and then below **Backup Item Count**, click the backup item count.

    ![Recovery Services vaults myVault detail page](./media/oracle-backup-recovery/recovery_service_08.png)

9.  On the right side of the page, click the ellipsis (**...**) button, and then click **Backup now**.

    ![Recovery Services vaults backup now command](./media/oracle-backup-recovery/recovery_service_09.png)

10. Click the **Backup** button, wait for completion of the backup process, and then go to "Step 5: Remove the database files."
To view the status of the back up job, click **Jobs**.
![Recovery Services vaults job page](./media/oracle-backup-recovery/recovery_service_10.png)

    The status of the backup job appears in the next image.

    ![Recovery Services vaults job page with status](./media/oracle-backup-recovery/recovery_service_11.png)

### Step 5: Remove the database files 
Later in this article you learn how to test the recovery process. Before you can test the recovery process, you have to remove the database files.

1.  Remove the tablespace and backup files:

    ```bash
    $ sudo su - oracle
    $ cd /u01/app/oracle/oradata/cdb1
    $ rm -f *.dbf
    $ cd /u01/app/oracle/fast_recovery_area/CDB1/backupset
    $ rm -rf *
    ```
    
2.  Shut down the Oracle instance (optional step):

    ```bash
    $ sqlplus / as sysdba
    SQL> shutdown abort
    ORACLE instance shut down.
    ```

## Restore the deleted files from Recovery Services vaults
To restore the deleted files, complete the following procedure:

1. Sign in to the Azure portal, and then search for the *myVault* Recovery Services vaults item. In the upper-right corner, below **Backup items**, click the number of items.
![Recovery Services vaults myVault backup items](./media/oracle-backup-recovery/recovery_service_12.png)

2. Below **Backup Item Count**, click the number of items.
![Recovery Services vaults Azure Virtual Machine backup item count](./media/oracle-backup-recovery/recovery_service_13.png)

3. Click **File Recovery (Preview)**.
![Screenshot of the Recovery Services vaults file recovery page](./media/oracle-backup-recovery/recovery_service_14.png)

4. Click **Download Script**, and then save the download file (.sh) to a folder on your client machine.
![Download script file save options](./media/oracle-backup-recovery/recovery_service_15.png)

5. Copy the .sh file to the VM.

    The next example shows how to use a secure copy (scp) command to move the file to the VM. You can also copy the content to the clipboard, and then paste the content into a new file that is set up on the VM.

    > [!IMPORTANT]
    > In the next example, ensure that you update the IP address and folder values. The values have to map to the folder where the file is saved.

    ```bash
    $ scp Linux_myvm1_xx-xx-2017 xx-xx-xx PM.sh <publicIpAddress>:/<folder>
    ```
6. Change the file so it's owned by the root.

    In the next example, you change the file so it's owned by the root, and then you change permission.

    ```bash 
    $ ssh <publicIpAddress>
    $ sudo su -
    # chown root:root /<folder>/Linux_myvm1_xx-xx-2017 xx-xx-xx PM.sh
    # chmod 755 /<folder>/Linux_myvm1_xx-xx-2017 xx-xx-xx PM.sh
    # /<folder>/Linux_myvm1_xx-xx-2017 xx-xx-xx PM.sh
    ```
    The next example shows what you should see after you run the previous script. When you're prompted to continue, enter **Y**.

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

    ![df -k command](./media/oracle-backup-recovery/recovery_service_16.png)

8. Use the following script to copy the missing files back to the folders.

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

    In the Azure portal, click **Unmount Disks**.

    ![Unmount disks command](./media/oracle-backup-recovery/recovery_service_17.png)

## Restore the entire VM

Instead of restoring the deleted files from Recovery Services vaults, you can restore the entire VM.

### Step 1: Drop the myVM

*   Sign in to the Azure portal, go to the *myVM* vault, and then select **Delete**.

    ![Delete command](./media/oracle-backup-recovery/recover_vm_01.png)

### Step 2: Recover the VM

1.  Go to **Recovery Services vaults**, and then select **myVault**.
![myVault entry that appears in UI](./media/oracle-backup-recovery/recover_vm_02.png)

2.  In the upper-right corner, below **Backup items**, click the number of items.
![myVault back up items](./media/oracle-backup-recovery/recover_vm_03.png)

3.  Below **Backup item count**, click the number of items.
![Recovery VM page](./media/oracle-backup-recovery/recover_vm_04.png)

4.  On the right side of the page, click the ellipsis (**...**) button,  and then click **Restore VM**.
![Restore VM command](./media/oracle-backup-recovery/recover_vm_05.png)

5.  Select the item that you want to restore, and then click **OK**.
![Select the restore point](./media/oracle-backup-recovery/recover_vm_06.png)

6.  Select the **Virtual machine name**, select the **Resource group**, and then click **OK**.
![Restore configuration values](./media/oracle-backup-recovery/recover_vm_07.png)

7.  To restore the VM, in the lower-left corner of the UI (see the previous image), click **Restore**.

8.  To view the status of the restore process, click **Jobs**.
![Backup jobs status command](./media/oracle-backup-recovery/recover_vm_08.png)

    The next image shows the status of the restore process.

    ![Status of the restore process](./media/oracle-backup-recovery/recover_vm_09.png)

### Step 3: Set the public IP address
After the VM is restored, you set up the public IP address.

1.  Use the search box to find **Public IP addresses**.

    ![List of public IP address](./media/oracle-backup-recovery/create_ip_00.png)

2.  In the upper-left corner, click **Add**. For **Name**, select the public IP name, for **Resource group**, select **Use existing**. Click **Create**.

    ![Create IP address](./media/oracle-backup-recovery/create_ip_01.png)

3.  To associate the Public IP address to the NIC interface for the VM,
search for and select **myVMip**, and then click **Associate**.

    ![Associate IP address](./media/oracle-backup-recovery/create_ip_02.png)

4.  For the **Resource type** select **Network Interface**, select the NIC that is used by the myVM instance, and then click **OK**.

    ![Select resource type and NIC values](./media/oracle-backup-recovery/create_ip_03.png)

5.  Search for and open the myVM instance that is ported from the portal. The IP address that is associated with the VM appears in the upper-right corner.

    ![IP address value](./media/oracle-backup-recovery/create_ip_04.png)

### Step 4: Connect to the VM

*   Use the following script to connect:

    ```bash 
    ssh <publicIpAddress>
    ```

### Step 5: Test whether the database is accessible
*   Use the following script to test the accessibility:

    ```bash 
    $ sudo su - oracle
    $ sqlplus / as sysdba
    SQL> startup
    ```

> [!IMPORTANT]
> If the database **startup** command generates an error, to recover the database, see "Step 6: Use RMAN to recover the database."

### Step 6: Use RMAN to recover the database (optional step)
*   Use the following script to recover the database:

    ```bash
    # sudo su - oracle
    $ rman target /
    RMAN> startup mount;
    RMAN> restore database;
    RMAN> recover database;
    RMAN> alter database open resetlogs;
    RMAN> SELECT * FROM scott.scott_table;
    ```

The back up and recovery of the Oracle 12c database on an Azure Linux virtual machine is now complete.
## Delete the VM

When you no longer need the VM, you can use the following command to remove the resource group, the VM, and all of the related resources:

```azurecli
az group delete --name myResourceGroup
```

## Next steps

[Tutorial: Create highly available VMs](../../linux/create-cli-complete.md)

[Explore VM deployment Azure CLI samples](../../linux/cli-samples.md)
