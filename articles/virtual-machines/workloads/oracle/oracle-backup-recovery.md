---
title: Backup and recovery of Oracle 12c database on an Azure Linux virtual machine | Microsoft Docs
description: A quick start guide for backup and recovery of Oracle Database 12c in your Azure environment.
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

# Backup and Recovery of Oracle 12c database on an Azure Linux virtual machine

You can use Azure CLI to create and manage Azure resources at a command prompt or in scripts. In this article, we use scripts in Azure CLI to deploy an Oracle Database 12c database from an Azure Marketplace gallery image.

Before you begin, make sure that Azure CLI is installed. For more information, see [the Azure CLI installation guide](https://docs.microsoft.com/cli/azure/install-azure-cli).

## Prepare the environment
### 1. Assumptions

To perform the backup and recovery, you need to create a Linux VM with Oracle 12c installed. The Marketplace image you use to create the VMs is "Oracle:Oracle-Database-Ee:12.1.0.2:latest".

For instructions of how to create an Oracle database, see [Oracle database quick create guide](https://docs.microsoft.com/azure/virtual-machines/workloads/oracle/oracle-database-quick-create).


### 2. Connect to the VM

To create an SSH session with the VM, use the following command: Replace the IP address/hostname with the `publicIpAddress` value for your VM.

```bash 
ssh <publicIpAddress>
```

### 3. Preparing database

This step assuming you have an Oracle instance (cdb1) running on a virtual machine called myVM.

Run the *oracle* superuser, and then initialize the listener:

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

Make sure the database is in archive log mode (Optional step)

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
Create a table for testing (Optional step)

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
Verify or change backup file location and size

    ```bash
    SQL> show parameter db_recovery
    NAME                                 TYPE        VALUE
    ------------------------------------ ----------- ------------------------------
    db_recovery_file_dest                string      /u01/app/oracle/fast_recovery_area
    db_recovery_file_dest_size           big integer 4560M
    ```
Backup database using RMAN

    ```bash
    $ rman target /
    RMAN> backup database plus archivelog;
    ```

### 4. Backup VM using Azure Recovery Service Vault

> [!NOTE]
> A new feature call [Application consistent backup for Linux VMs](https://azure.microsoft.com/en-us/blog/announcing-application-consistent-backup-for-linux-vms-using-azure-backup/) is just become available.
>

Log on to Azure portal and search for Recovery Service Vaults.
![Screenshot of the Recovery Service Vaults page](./media/oracle-backup-recovery/recovery_service_01.png)

Click the Add button to add new vault.
![Screenshot of the Recovery Service Vaults Add page](./media/oracle-backup-recovery/recovery_service_02.png)

Click myVault to continue, and you should see a page similar to following
![Screenshot of the Recovery Service Vaults Detail page](./media/oracle-backup-recovery/recovery_service_03.png)

Click Backup button.
![Screenshot of the Recovery Service Vaults backup page](./media/oracle-backup-recovery/recovery_service_04.png)

Enter the Backup goal, policy, and items to back up.

Use default Azure and Virtual Machine. Click OK button to continue.
![Screenshot of the Recovery Service Vaults Detail page](./media/oracle-backup-recovery/recovery_service_05.png)

Use default or Create New policy. Click OK button to continue.
![Screenshot of the Recovery Service Vaults Detail page](./media/oracle-backup-recovery/recovery_service_06.png)

Check the box for myVM. Click OK button to continue.
![Screenshot of the Recovery Service Vaults Detail page](./media/oracle-backup-recovery/recovery_service_07.png)

The final step is click the 'Enable Backup' button. However, backup would not be started until the scheduled time is up. So next step is performed a manual backup.

Click the Backup items, then click the number under the Backup item count.

![Screenshot of the Recovery Service Vaults Detail page](./media/oracle-backup-recovery/recovery_service_08.png)

Click the three dots on the right-hand side and select Backup now.

![Screenshot of the Recovery Service Vaults Detail page](./media/oracle-backup-recovery/recovery_service_09.png)

Click the backup button and Wait for the backup to complete before move to the next section.
You can view the status of the backup job from the job screen.
![Screenshot of the Recovery Service Vaults job page](./media/oracle-backup-recovery/recovery_service_10.png)

This screen show the status of the backup job

![Screenshot of the Recovery Service Vaults job page](./media/oracle-backup-recovery/recovery_service_11.png)

### 5. Remove database files (for testing recovery at later section)

Remove tablespace and backup files
```bash
$ sudo su - oracle
$ cd /u01/app/oracle/oradata/cdb1
$ rm -f *.dbf
$ cd /u01/app/oracle/fast_recovery_area/CDB1/backupset
$ rm -rf *
```
Shutdown Oracle (optional step)

```bash
$ sqlplus / as sysdba
SQL> shutdown immediate
ORA-01116: error in opening database file 1
ORA-01110: data file 1: '/u01/app/oracle/oradata/cdb1/system01.dbf'
ORA-27041: unable to open file
Linux-x86_64 Error: 2: No such file or directory
Additional information: 3
```

## Restore deleted files from Recovery Service Vaults

### 1. Log on to Azure portal and search for Recovery Service Vaults 'myVault'. click the number under the Backup items.
![Screenshot of the Recovery Service Vaults page](./media/oracle-backup-recovery/recovery_service_12.png)

### 2. Click the number under the Backup item count
![Screenshot of the Recovery Service Vaults page](./media/oracle-backup-recovery/recovery_service_13.png)

### 3. Click the 'File Recovery (Preview)'
![Screenshot of the Recovery Service Vaults page](./media/oracle-backup-recovery/recovery_service_14.png)

### 4. Click 'Download Script' button, Save the download file (.sh) to a folder on your client machine
![Screenshot of the Recovery Service Vaults page](./media/oracle-backup-recovery/recovery_service_15.png)

### 5. Copy the .sh file to the VM

You can either scp the file to the VM or create a file on the VM by simply copy and paste the content to a new file.

Change the public IP address and folder name to the folder you like to copy to.

```bash
$ scp Linux_myvm1_xx-xx-2017 xx-xx-xx PM.sh <publicIpAddress>:/<folder>
```
### 6. The next step is changed the file to be own by root, change permission, and
execute the script
```bash 
$ ssh <publicIpAddress>
$ sudo su -
# chown root:root /<folder>/Linux_myvm1_xx-xx-2017 xx-xx-xx PM.sh
# chmod 755 /<folder>/Linux_myvm1_xx-xx-2017 xx-xx-xx PM.sh
# /<folder>/Linux_myvm1_xx-xx-2017 xx-xx-xx PM.sh
```
You should get similar outputs as following, enter 'Y' when it asked you to continue.

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

### 7. Access to the mounted volumes

Enter q to exit, then find the mounted volumes. Run df -k command to list the added volumes

![Screenshot of the Recovery Service Vaults page](./media/oracle-backup-recovery/recovery_service_16.png)

### 8. Copy the missing files back to the folders

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
### 9. Recover database using RMAN
```bash
# sudo su - oracle
$ rman target /
RMAN> startup mount;
RMAN> restore database;
RMAN> recover database;
RMAN> alter database open resetlogs;
RMAN> SELECT * FROM scott.scott_table;
```
### 10. Unmount disk

Back to the Azure portal, click the Unmount Disks button
![Screenshot of the Recovery Service Vaults page](./media/oracle-backup-recovery/recovery_service_17.png)

## Restore the entire VM

Alternative, you can restore the entire VM instead of recovery the missing or corrupted files.

### 1. Drop the myVM

Log in to Azure portal, locate myVM and select 'Delete' button

![Screenshot of the Recovery VM page](./media/oracle-backup-recovery/recover_vm_01.png)

### 2. Recover VM

Locate the Recovery Services Vaults, select myVault
![Screenshot of the Recovery VM page](./media/oracle-backup-recovery/recover_vm_02.png)

Click the number under the 'Backup items'
![Screenshot of the Recovery VM page](./media/oracle-backup-recovery/recover_vm_03.png)

Click the number under the 'Backup item count'
![Screenshot of the Recovery VM page](./media/oracle-backup-recovery/recover_vm_04.png)

Click the three dots on the right side and select 'Restore VM'
![Screenshot of the Recovery VM page](./media/oracle-backup-recovery/recover_vm_05.png)

Select the item on the right that you want to restore and click 'OK'
![Screenshot of the Recovery VM page](./media/oracle-backup-recovery/recover_vm_06.png)

Enter the Virtual machine name and select the Resource Group and click 'OK'
![Screenshot of the Recovery VM page](./media/oracle-backup-recovery/recover_vm_07.png)

Click the 'Restore' button to begin restoring the VM

You can check the status of the restore by viewing the job status
![Screenshot of the Recovery VM page](./media/oracle-backup-recovery/recover_vm_08.png)

A restore is 'In Progress' status

![Screenshot of the Recovery VM page](./media/oracle-backup-recovery/recover_vm_09.png)

### 3. Set public IP address
Once the VM is restored, the next step is setup the public IP address.

Search for 'Public IP addresses' in search menu.

![Screenshot of the create ip page](./media/oracle-backup-recovery/create_ip_00.png)

Click Add button, enter the public ip name and select the existing resource group, click Create button.

![Screenshot of the create ip page](./media/oracle-backup-recovery/create_ip_01.png)

The next step is associate the Public IP address to the NIC interface of the VM
Located the myVMip, then click Associate button

![Screenshot of the create ip page](./media/oracle-backup-recovery/create_ip_02.png)

Change the Resource Type to 'Network Interface' and choose the NIC, which is being used by the myVM. Click OK to continue

![Screenshot of the create ip page](./media/oracle-backup-recovery/create_ip_03.png)

Locate the myVM from Portal, you should now see there is an IP address associate with the VM

![Screenshot of the create ip page](./media/oracle-backup-recovery/create_ip_04.png)

### 4. Connect to VM
```bash 
ssh <publicIpAddress>
```
### 5. Test database is accessible
```bash 
$ sudo su - oracle
$ sqlplus / as sysdba
SQL> startup
```
If you get error message when trying to start the database. Follow the next step to recover the database.

### 6. Recover database using RMAN (Optional step)
```bash
# sudo su - oracle
$ rman target /
RMAN> startup mount;
RMAN> restore database;
RMAN> recover database;
RMAN> alter database open resetlogs;
RMAN> SELECT * FROM scott.scott_table;
```

This completed the backup and recovery of Oracle database in Azure linux VM.
## Delete the VM

When you no longer need the VM, you can use the following command to remove the resource group, VM, and all related resources:

```azurecli
az group delete --name myResourceGroup
```

## Next steps

[Tutorial: Create highly available VMs](../../linux/create-cli-complete.md)

[Explore VM deployment Azure CLI samples](../../linux/cli-samples.md)
