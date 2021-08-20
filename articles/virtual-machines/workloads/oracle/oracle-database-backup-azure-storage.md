---
title: Back up an Oracle Database 19c database on an Azure Linux VM with RMAN and Azure Storage
description: Learn how to back up an Oracle Database 19c database to Azure cloud storage.
author: cro27
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: linux
ms.topic: article
ms.date: 01/28/2021
ms.author: cholse
ms.reviewer: dbakevlar 

---

# Back up and recover an Oracle Database 19c database on an Azure Linux VM using Azure Storage

This article demonstrates the use of Azure Storage as a media to back up and restore an Oracle database running on an Azure VM. You will back up the database using Oracle RMAN to Azure File storage mounted to the VM using the SMB protocol. Using Azure storage for backup media is extremely cost effective and performant. However, for very large databases, Azure Backup provides a better solution.

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../../includes/azure-cli-prepare-your-environment.md)]

- To perform the backup and recovery process, you must first create a Linux VM that has an installed instance of Oracle Database 19c. The Marketplace image currently used to create the VM is  **Oracle:oracle-database-19-3:oracle-database-19-0904:latest**. Follow the steps in the [Oracle create database quickstart](./oracle-database-quick-create.md) to create an Oracle database to complete this tutorial.

## Prepare the database environment

1. To create a Secure Shell (SSH) session with the VM, use the following command. Replace the IP address and the host name combination with the `publicIpAddress` value for your VM.
    
   ```bash
   ssh azureuser@<publicIpAddress>
   ```
   
2. Switch to the ***root*** user:
 
   ```bash
   sudo su -
   ```
    
3. Add the oracle user to the ***/etc/sudoers*** file:

   ```bash
   echo "oracle   ALL=(ALL)      NOPASSWD: ALL" >> /etc/sudoers
   ```

4. This step assumes that you have an Oracle instance (test) that is running on a VM named *vmoracle19c*.

   Switch user to the *oracle* user:

   ```bash
   sudo su - oracle
   ```
    
5. Before you connect, you need to set the environment variable ORACLE_SID:
    
    ```bash
    export ORACLE_SID=test;
    ```
   
   You should also add the ORACLE_SID variable to the `oracle` users `.bashrc` file for future sign-ins using the following command:

    ```bash
    echo "export ORACLE_SID=test" >> ~oracle/.bashrc
    ```
    
6. Start the Oracle listener if it is not already running:
    
   ```bash
   $ lsnrctl start
   ```

    The output should look similar to the following example:

    ```bash
    LSNRCTL for Linux: Version 19.0.0.0.0 - Production on 18-SEP-2020 03:23:49

    Copyright (c) 1991, 2019, Oracle.  All rights reserved.

    Starting /u01/app/oracle/product/19.0.0/dbhome_1/bin/tnslsnr: please wait...

    TNSLSNR for Linux: Version 19.0.0.0.0 - Production
    System parameter file is /u01/app/oracle/product/19.0.0/dbhome_1/network/admin/listener.ora
    Log messages written to /u01/app/oracle/diag/tnslsnr/vmoracle19c/listener/alert/log.xml
    Listening on: (DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=vmoracle19c.eastus.cloudapp.azure.com)(PORT=1521)))
    Listening on: (DESCRIPTION=(ADDRESS=(PROTOCOL=ipc)(KEY=EXTPROC1521)))

    Connecting to (DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=vmoracle19c.eastus.cloudapp.azure.com)(PORT=1521)))
    STATUS of the LISTENER
    ------------------------
    Alias                     LISTENER
    Version                   TNSLSNR for Linux: Version 19.0.0.0.0 - Production
    Start Date                18-SEP-2020 03:23:49
    Uptime                    0 days 0 hr. 0 min. 0 sec
    Trace Level               off
    Security                  ON: Local OS Authentication
    SNMP                      OFF
    Listener Parameter File   /u01/app/oracle/product/19.0.0/dbhome_1/network/admin/listener.ora
    Listener Log File         /u01/app/oracle/diag/tnslsnr/vmoracle19c/listener/alert/log.xml
    Listening Endpoints Summary...
     (DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=vmoracle19c.eastus.cloudapp.azure.com)(PORT=1521)))
    (DESCRIPTION=(ADDRESS=(PROTOCOL=ipc)(KEY=EXTPROC1521)))
    The listener supports no services
    The command completed successfully
    ```

7.  Create the Fast Recovery Area (FRA) location:

    ```bash
    mkdir /u02/fast_recovery_area
    ```

8.  Connect to the database:

    ```bash
    sqlplus / as sysdba
    ```

9.  Start the database if it is not already running:

    ```bash
    SQL> startup
    ```

10. Set database environment variables for fast recovery area:

    ```bash
    SQL> alter system set db_recovery_file_dest_size=4096M scope=both;
    SQL> alter system set db_recovery_file_dest='/u02/fast_recovery_area' scope=both;
    ```
    
11. Make sure the database is in archive log mode to enable online backups.
    Check the log archive status first:

    ```bash
    SQL> SELECT log_mode FROM v$database;

    LOG_MODE
    ------------
    NOARCHIVELOG
    ```

    And if in NOARCHIVELOG mode, run the following commands in sqlplus:

    ```bash
    SQL> SHUTDOWN IMMEDIATE;
    SQL> STARTUP MOUNT;
    SQL> ALTER DATABASE ARCHIVELOG;
    SQL> ALTER DATABASE OPEN;
    SQL> ALTER SYSTEM SWITCH LOGFILE;
    ```

12. Create a table to test the backup and restore operations:

    ```bash
    SQL> create user scott identified by tiger quota 100M on users;
    SQL> grant create session, create table to scott;
    SQL> connect scott/tiger
    SQL> create table scott_table(col1 number, col2 varchar2(50));
    SQL> insert into scott_table VALUES(1,'Line 1');
    SQL> commit;
    SQL> quit
    ```

## Back up to Azure Files

To back up to Azure Files, complete these steps:

1. Set up Azure File Storage.
1. Mount the Azure Storage File share to your VM.
1. Back up the database.
1. Restore and recover the database.

### Set up Azure File Storage

In this step, you will back up the Oracle database using Oracle Recovery Manager (RMAN) to Azure Files storage. Azure file shares are fully managed file shares that live in the cloud. They can be accessed using either the Server Message Block (SMB) protocol or the Network File System (NFS) protocol. This step covers creating a file share that uses the SMB protocol to mount to your VM. For information about how to mount using NFS, see [Mount Blob storage by using the NFS 3.0 protocol](../../../storage/blobs/network-file-system-protocol-support-how-to.md).

When mounting the Azure Files, we will use the `cache=none` to disable caching of file share data. And to ensure files created in the share are owned by the oracle user set the `uid=oracle` and `gid=oinstall` options as well. 

# [Portal](#tab/azure-portal)

First, set up your storage account.

1. Configure File Storage in the Azure portal

    In the Azure portal, select ***+ Create a resource*** and search for and select ***Storage Account***
    
    ![Screenshot that shows where to create a resource and select Storage Account.](./media/oracle-backup-recovery/storage-1.png)
    
2. In the Create storage account page, choose your existing resource group ***rg-oracle***, name your storage account ***oracbkup1*** and choose ***Storage V2 (generalpurpose v2)*** for Account Kind. Change Replication to ***Locally-redundant storage (LRS)*** and set Performance to ***Standard***. Ensure that Location is set to the same region as all your other resources in the resource group. 
    
    ![Screenshot that shows where to choose your existing resource group.](./media/oracle-backup-recovery/file-storage-1.png)
   
   
3. Click on the ***Advanced*** tab and under Azure Files set ***Large file shares*** to ***Enabled***. Click on Review + Create and then click Create.
    
    ![Screenshot that shows where to set Large file shares to Enabled.](./media/oracle-backup-recovery/file-storage-2.png)
    
    
4. When the storage account has been created, go to the resource and choose ***File shares***
    
    ![Screenshot that shows where to select File shares.](./media/oracle-backup-recovery/file-storage-3.png)
    
5. Click on ***+ File share*** and in the ***New file share*** blade name your file share ***orabkup1***. Set ***Quota*** to ***10240*** GiB and check ***Transaction optimized*** as the tier. The quota reflects an upper boundary that the file share can grow to. As we are using Standard storage, resources are PAYG and not provisioned so setting it to 10 TiB will not incur costs beyond what you use. If your backup strategy requires more storage, you must set the quota to an appropriate level to hold all backups.   When you have completed the New file share blade, click ***Create***.
    
    ![Screenshot that shows where to add a new file share.](./media/oracle-backup-recovery/file-storage-4.png)
    
    
6. When created, click on ***orabkup1*** in the File share settings page. 
    Click on the ***Connect*** tab to open the Connect blade and then click the ***Linux*** tab. Copy the commands provided to mount the File Share using SMB protocol. 
    
    ![Storage Account add page](./media/oracle-backup-recovery/file-storage-5.png)

# [Azure CLI](#tab/azure-cli)

To set up your storage account and file share run the following commands in Azure CLI.

1. Create the storage account in the same resource group and location as your VM:
   ```azurecli
   az storage account create -n orabackup1 -g rg-oracle -l eastus --sku Standard_LRS --enable-large-file-share
   ```

2. Create file share in the storage account with a quota of 10 TiB:

   ```azurecli
   az storage share create --account-name orabackup1 --name orabackup --quota 10240
   ```

3. Retrieve the storage account primary key (key1) which is needed when mounting the file share to your VM:

   ```azurecli
   az storage account keys list --resource-group rg-oracle --account-name orabackup1
   ```

---

### Mount the Azure Storage file share to your VM

1. Create the mount point:

   ```bash
   sudo mkdir /mnt/orabackup
   ```

2. Set up credentials:

   ```bash
   if [ ! -d "/etc/smbcredentials" ]; then
    sudo mkdir /etc/smbcredentials
   fi
   ```

   Substitute `<Your Storage Account Key1>` for the storage account key retrieved earlier, before running the following command:
   ```bash
   if [ ! -f "/etc/smbcredentials/orabackup1.cred" ]; then
     sudo bash -c 'echo "username=orabackup1" >> /etc/smbcredentials/orabackup1.cred'
     sudo bash -c 'echo "password=<Your Storage Account Key1>" >> /etc/smbcredentials/orabackup1.cred'
   fi
   ```

3. Change permissions on the credentials file:

   ```bash
   sudo chmod 600 /etc/smbcredentials/orabackup1.cred
   ```

4. Add the mount to the /etc/fstab:

   ```bash
   sudo bash -c 'echo "//orabackup1.file.core.windows.net/orabackup /mnt/orabackup cifs nofail,vers=3.0,credentials=/etc/smbcredentials/orabackup1.cred,dir_mode=0777,file_mode=0777,serverino,cache=none,uid=oracle,gid=oinstall" >> /etc/fstab'
   ```

5. Run the commands to mount the Azure Files storage using SMB protocol:

   ```bash
   sudo mount -t cifs //orabackup1.file.core.windows.net/orabackup /mnt/orabackup -o vers=3.0,credentials=/etc/smbcredentials/orabackup1.cred,dir_mode=0777,file_mode=0777,serverino,cache=none,uid=oracle,gid=oinstall
   ```

   If you receive an error similar to:

   ```output
   mount: wrong fs type, bad option, bad superblock on //orabackup1.file.core.windows.net/orabackup 
   ```

   then the CIFS package may not be installed on your Linux host. 
   
   To check if CIS is installed, run the following command:

   ```bash
   sudo rpm -qa|grep cifs-utils
   ```

   If the command returns no output, install CIFS package using the following command:

   ```bash 
   sudo yum install cifs-utils
   ```

   Now rerun the mount command above to mount Azure Files storage.

6. Check the file share is mounted properly with the following command:

   ```bash
   df -h
   ```

   The output should look similar to this:

   ```output
   $ df -h
   Filesystem                                    Size  Used Avail Use% Mounted on
   devtmpfs                                      3.3G     0  3.3G   0% /dev
   tmpfs                                         3.3G     0  3.3G   0% /dev/shm
   tmpfs                                         3.3G   17M  3.3G   1% /run
   tmpfs                                         3.3G     0  3.3G   0% /sys/fs/cgroup
   /dev/sda2                                      30G  9.1G   19G  34% /
   /dev/sdc1                                      59G  2.7G   53G   5% /u02
   /dev/sda1                                     497M  199M  298M  41% /boot
   /dev/sda15                                    495M  9.7M  486M   2% /boot/efi
   tmpfs                                         671M     0  671M   0% /run/user/54321
   /dev/sdb1                                      14G  2.1G   11G  16% /mnt/resource
   tmpfs                                         671M     0  671M   0% /run/user/54322
   //orabackup1.file.core.windows.net/orabackup   10T     0   10T   0% /mnt/orabackup
   ```

### Back up the database

In this section, we will be using Oracle Recovery Manager (RMAN) to take a full backup of the database and archive logs and write the backup as a backup set to the Azure File share mounted earlier. 

1. Configure RMAN to back up to the Azure Files mount point:

    ```bash
    $ rman target /
    RMAN> configure snapshot controlfile name to '/mnt/orabkup/snapcf_ev.f';
    RMAN> configure channel 1 device type disk format '/mnt/orabkup/%d/Full_%d_%U_%T_%s';
    RMAN> configure channel 2 device type disk format '/mnt/orabkup/%d/Full_%d_%U_%T_%s'; 
    ```

2. Because Azure standard file shares have a maximum file size of 1 TiB, we will limit the size of RMAN backup pieces to 1 TiB. (Note that Premium File Shares have a maximum file size limit of 4 TiB. For more information, see [Azure Files Scalability and Performance Targets](../../../storage/files/storage-files-scale-targets.md).)

    ```bash
    RMAN> configure channel device type disk maxpiecesize 1000G;
    ```

3. Confirm the configuration change details:

    ```bash
    RMAN> show all;
    ```

4. Now run the backup. The following command will take a full database backup, including archive logfiles, as a backupset in compressed format:   

    ```bash
    RMAN> backup as compressed backupset database plus archivelog;
    ```

You have now backed up the database online using Oracle RMAN, with the backup located on Azure File storage. This method has the advantage of utilizing the features of RMAN while storing backups in Azure File storage where they can be accessed from other VMs, useful if you need to clone the database.  
    
While using RMAN and Azure File storage for database backup has many advantages, backup and restore time is linked to the size of the database, so for very large databases it can take considerable time for these operations.  An alternative backup mechanism, using Azure Backup application-consistent VM backups, uses snapshot technology to perform backups, which has the advantage of very fast backups irrespective of database size. Integration with Recovery Services Vault provides secure storage of your Oracle Database backups in Azure cloud storage accessible from other VMs and Azure regions. 

### Restore and recover the database

1.  Shut down the Oracle instance:

    ```bash
    sqlplus / as sysdba
    SQL> shutdown abort
    ORACLE instance shut down.
    ```

2.  Remove the database datafiles:

    ```bash
    cd /u02/oradata/TEST
    rm -f *.dbf
    ```

3. The following commands use RMAN to restore the missing datafiles and recover the database:

    ```bash
    rman target /
    RMAN> startup mount;
    RMAN> restore database;
    RMAN> recover database;
    RMAN> alter database open;
    ```
    
4. Check the database content has been fully recovered:

    ```bash
    RMAN> SELECT * FROM scott.scott_table;
    ```


The backup and recovery of the Oracle Database 19c database on an Azure Linux VM is now finished.

## Delete the VM

When you no longer need the VM, you can use the following command to remove the resource group, the VM, and all related resources:

```azurecli
az group delete --name rg-oracle
```

## Next steps

[Tutorial: Create highly available VMs](../../linux/create-cli-complete.md)

[Explore VM deployment Azure CLI samples](https://github.com/Azure-Samples/azure-cli-samples/tree/master/virtual-machine)
