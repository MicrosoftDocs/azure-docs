---
title: Back up and recover an Oracle Database on an Azure Linux VM using Azure Backup
description: Learn how to back up and recover an Oracle Database using the Azure Backup service.
author: cro27
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: linux
ms.topic: article
ms.date: 01/28/2021
ms.author: cholse
ms.reviewer: dbakevlar 

---

# Back up and recover an Oracle Database on an Azure Linux VM using Azure Backup

**Applies to:** :heavy_check_mark: Linux VMs 

This article demonstrates the use of Azure Backup to take disk snapshots of the VM disks, which include the database files and fast recovery area. Using Azure Backup you can take full disk snapshots suitable as backups, which are stored in [Recovery Services Vault](../../../backup/backup-azure-recovery-services-vault-overview.md).  Azure Backup also provides application-consistent backups, which ensure additional fixes aren't required to restore the data. Restoring application-consistent data reduces the restoration time, allowing you to quickly return to a running state.

> [!div class="checklist"]
>
> * Back up the database with application-consistent backup
> * Restore and recover the database from a recovery point
> * Restore the VM from from a recovery point

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../../includes/azure-cli-prepare-your-environment.md)]

- To perform the backup and recovery process, you must first create a Linux VM that has an installed instance of Oracle Database 12.1 or higher.

- Follow the steps in the [Oracle create database quickstart](./oracle-database-quick-create.md) to create an Oracle database to complete this tutorial.


## Prepare the environment

To prepare the environment, complete these steps:

1. [Connect to the VM](#connect-to-the-vm).
1. [Set up Azure Files Storage](#set-up-azure-files-storage-for-the-oracle-archived-redo-log-files)
1. [Prepare the database](#prepare-the-databases).

### Connect to the VM

1. To create a Secure Shell (SSH) session with the VM, use the following command. Replace the IP address and the host name combination with the `<publicIpAddress>` value for your VM.
    
   ```bash
   ssh azureuser@<publicIpAddress>
   ```
   
1. Switch to the *root* user:

   ```bash
   sudo su -
   ```
    
1. Add the oracle user to the */etc/sudoers* file:

   ```bash
   echo "oracle   ALL=(ALL)      NOPASSWD: ALL" >> /etc/sudoers
   ```

### Set up Azure Files Storage for the Oracle archived redo log files

The Oracle database archive redo logfiles play a crucial role in database recovery as they store the committed transactions needed to roll forward from a database snapshot taken in the past. When in archivelog mode, the database archives the contents of online redo logfiles when they become full and switch. Together with a backup, they are required to achieve point-in-time recovery when the database has been lost.  
   
Oracle provides the capability to archive redo logfiles to different locations, with industry best practice recommending that at least one of those destinations be on remote storage, so it is separate from the host storage and protected with independent snapshots. Azure Files is a great fit for those requirements.

An Azure Files fileshare is storage which can be attached to a Linux or Windows VM as a regular filesystem component, using SMB or NFS protocols. 
   
To set up an Azure Files fileshare on Linux, using SMB 3.0 protocol, for use as archive log storage, please follow the [Use Azure Files with Linux how-to guide](../../../storage/files/storage-how-to-use-files-linux.md). When you have completed the setup, return to this guide and complete all remaining steps.

### Prepare the databases

This step assumes that you have followed the [Oracle create database quickstart](./oracle-database-quick-create.md) and you have an Oracle instance named `oratest1` that is running on a VM named `vmoracle19c`, and that you are using the standard Oracle “oraenv” script with its dependency on the standard Oracle configuration file “/etc/oratab” to set up environment variables in a shell session.

Perform the following steps for each database on the VM:

1. Switch user to the *oracle* user:
 
   ```bash
    sudo su - oracle
    ```
    
1. Before you connect, you need to set the environment variable ORACLE_SID by running the `oraenv` script which will prompt you to enter the ORACLE_SID name:
    
    ```bash
    $ . oraenv
    ```

1.   Add the Azure Files share as an additional database archive log file destination
     
     This step assumes you have configured and mounted an Azure Files share on the Linux VM, for example under a mount point directory named `/backup`.

     For each database installed on the VM, make a sub-directory named after your database SID using the following as an example.
     
     In this example the mount point name is `/backup` and the SID is `oratest1` so we will create a sub-directory `/backup/oratest1` and change ownership to the oracle user. Please substitute **/backup/SID** for your mount point name and database SID. 

     ```bash
     sudo mkdir /backup/oratest1
     sudo chown oracle:oinstall /backup/oratest1
     ```
    
1. Connect to the database:
    
   ```bash
   sqlplus / as sysdba
   ```

1.  Start the database if it's not already running. 
   
    ```bash
    SQL> startup
    ```
   
1. Set the first archive log destination of the database to the fileshare directory you created earlier:

   ```bash
   SQL> alter system set log_archive_dest_1='LOCATION=/backup/oratest1' scope=both;
   ```

1. Define the recovery point objective (RPO) for the database.

    To achieve a consistent RPO, the frequency at which the online redo log files will be archived must be considered. Archive log generation frequency is controlled by:
	- The size of the online redo logfiles. As an online logfile becomes full it is switched and archived. The larger the online logfile the longer it takes to fill up which decreases the frequency of archive generation.
	- The setting of the ARCHIVE_LAG_TARGET parameter controls the maximum number of seconds permitted before the current online logfile must be switched and archived. 

    To minimize the frequency of switching and archiving, along with the accompanying checkpoint operation, Oracle online redo logfiles generally get sized quite large (1024M, 4096M, 8192M, and so on). In a busy database environment logs are still likely to switch and archive every few seconds or minutes, but in a less active database they might go hours or days before the most recent transactions are archived, which would dramatically decrease archival frequency. Setting ARCHIVE_LAG_TARGET is therefore recommended to ensure a consistent RPO is achieved. A setting of 5 minutes (300 seconds) is a prudent value for ARCHIVE_LAG_TARGET, ensuring that any database recovery operation can recover to within 5 minutes or less of the time of failure.

    To set ARCHIVE_LAG_TARGET:

    ```bash 
    SQL> alter system set archive_lag_target=300 scope=both;
    ```

    To better understand how to deploy highly available Oracle databases in Azure with zero RPO, please see [Reference Architectures for Oracle Database](./oracle-reference-architecture.md).

1.  Make sure the database is in archive log mode to enable online backups.

     Check the log archive status first:

     ```bash
     SQL> SELECT log_mode FROM v$database;

     LOG_MODE
     ------------
     NOARCHIVELOG
     ```

     If it's in NOARCHIVELOG mode, run the following commands:

     ```bash
     SQL> SHUTDOWN IMMEDIATE;
     SQL> STARTUP MOUNT;
     SQL> ALTER DATABASE ARCHIVELOG;
     SQL> ALTER DATABASE OPEN;
     SQL> ALTER SYSTEM SWITCH LOGFILE;
     ```
1. Create a table to test the backup and restore operations:
   ```bash
   SQL> create user scott identified by tiger quota 100M on users;
   SQL> grant create session, create table to scott;
   SQL> connect scott/tiger
   SQL> create table scott_table(col1 number, col2 varchar2(50));
   SQL> insert into scott_table VALUES(1,'Line 1');
   SQL> commit;
   SQL> quit
   ```
## Using Azure Backup 

The Azure Backup service provides simple, secure, and cost-effective solutions to back up your data and recover it from the Microsoft Azure cloud. Azure Backup provides independent and isolated backups to guard against accidental destruction of original data. Backups are stored in a Recovery Services vault with built-in management of recovery points. Configuration and scalability are simple, backups are optimized, and you can easily restore as needed.

Azure Backup service provides a [framework](../../../backup/backup-azure-linux-app-consistent.md) to achieve application consistency during backups of Windows and Linux VMs for various applications like Oracle and MySQL. This involves invoking a pre-script (to quiesce the applications) before taking a snapshot of disks and calling a post-script (to unfreeze the applications) after the snapshot is completed. 

The framework has now been enhanced so that packaged pre-scripts and post-scripts for selected applications like Oracle are provided by the Azure Backup service and are pre-loaded on the Linux image, so there is nothing you need to install. Azure Backup users just need to name the application and then Azure VM backup will automatically invoke the relevant pre and post scripts. The packaged pre-scripts and post-scripts will be maintained by the Azure Backup team and so users can be assured of the support, ownership, and validity of these scripts. 

Currently, the supported applications for the enhanced framework are *Oracle 12.x or higher* and *MySQL*.
Please see the [Support matrix for managed pre-post scripts for Linux databases](../../../backup/backup-support-matrix-iaas.md) for details. 
Customers can author their own scripts for Azure Backup to use with pre-12.x databases. Example scripts can be found [here](https://github.com/Azure/azure-linux-extensions/tree/master/VMBackup/main/workloadPatch/DefaultScripts).


> [!Note]
> The enhanced framework will run the pre and post scripts on all Oracle databases installed on the VM each time a backup is executed. 
>
> The parameter `configuration_path` in the **workload.conf** file points to the location of the Oracle /etc/oratab file (or a user defined file that follows the oratab syntax). See  [Set up application-consistent backups](#set-up-application-consistent-backups) for details. 
> 
> Azure Backup will run the pre and post backup scripts for each database listed in the file pointed to by configuration_path, except those lines that begin with # (treated as comment) or +ASM (Oracle Automatic Storage Management instance).
> 
> The Azure Backup enhanced framework takes online backups of Oracle databases operating in ARCHIVELOG mode. The pre and post scripts use the ALTER DATABASE BEGIN/END BACKUP commands to achieve application consistency. 
>
> Databases in NOARCHIVELOG mode must be shutdown cleanly before the snapshot commences for the database backup to be consistent.


In this section, you will use Azure Backup framework to take application-consistent snapshots of your running VM and Oracle databases. The databases will be placed into backup mode allowing a transactionally consistent online backup to occur while Azure Backup takes a snapshot of the VM disks. The snapshot will be a full copy of the storage and not an incremental or Copy on Write snapshot, so it is an effective medium to restore your database from. The advantage of using Azure Backup application-consistent snapshots is that they are extremely fast to take no matter how large your database is, and a snapshot can be used for restore operations as soon as it is taken without having to wait for it to be transferred to the Recovery Services vault.

To use Azure Backup to back up the database, complete these steps:

1. [Prepare the environment for an application-consistent backup](#prepare-the-environment-for-an-application-consistent-backup).
1. [Set up application-consistent backups](#set-up-application-consistent-backups).
1. [Trigger an application-consistent backup of the VM](#trigger-an-application-consistent-backup-of-the-vm).

### Prepare the environment for an application-consistent backup

> [!Note] 
> The Oracle database employs job role separation to provide separation of duties using least privilege. This is achieved by associating separate operating system groups with separate database administrative roles. Operating system users can then have different database privileges granted to them depending on their membership of operating system groups. 
>
> The `SYSBACKUP` database role, (generic name OSBACKUPDBA), is used to provide limited privileges to perform backup operations in the database, and is required by Azure Backup.
>
> During Oracle installation, the recommended operating system group name to associate with the SYSBACKUP role is `backupdba`, but any name can be used so you need to determine the name of the operating system group representing the Oracle SYSBACKUP role first.

1. Switch to the *oracle* user:
   ```bash
   sudo su - oracle
   ```

1. Set the oracle environment:
   ```bash
   export ORACLE_SID=oratest1
   export ORAENV_ASK=NO
   . oraenv
   ```

1. Determine the name of the operating system group representing the Oracle SYSBACKUP role:
   ```bash
   grep "define SS_BKP" $ORACLE_HOME/rdbms/lib/config.c
   ```
   The output will look similar to this: 
   ```output
   #define SS_BKP_GRP "backupdba"
   ```

   In the output, the value enclosed within double-quotes, in this example `backupdba`, is the name of the Linux operating system group to which the Oracle SYSBACKUP role is externally authenticated. Note down this value.

1. Verify if the operating system group exists by running the following command. Please substitute \<group name\> with the value returned by the previous command (without the quotes):
   ```bash
   grep <group name> /etc/group
   ```
   The output will look similar to this, in our example `backupdba` is used: 
   ```output
   backupdba:x:54324:oracle
   ```

   > [!IMPORTANT] 
   > If the output does not match the Oracle operating system group value retrieved in Step 3 you will need to create the operating system group representing the Oracle SYSBACKUP role. Please substitute `<group name>` for the group name retrieved in step 3 :
   >   ```bash
   >   sudo groupadd <group name>
   >   ```

1. Create a new backup user `azbackup` which belongs to the operating system group you have verified or created in the previous steps. Please substitute \<group name\> for the name of the group verified:

   ```bash
   sudo useradd -g <group name> azbackup
   ```

1. Set up external authentication for the new backup user. 

   The backup user `azbackup` needs to be able to access the database using external authentication, so as not to be challenged by a password. In order to do this you must create a database user that authenticates externally through `azbackup`. The database uses a prefix for the user name which you need to find.
   
   > [!IMPORTANT]
   > Perform the following steps for ***each*** database installed on the VM::
 
   Log in to the database using sqlplus and check the default settings for external authentication:
   
   ```bash
   sqlplus / as sysdba
   SQL> show parameter os_authent_prefix
   SQL> show parameter remote_os_authent
   ```
   
   The output should look like this example which shows `ops$` as the database user name prefix: 

   ```output
   NAME                                 TYPE        VALUE
   ------------------------------------ ----------- ------------------------------
   os_authent_prefix                    string      ops$
   remote_os_authent                    boolean     FALSE
   ```

   Create a database user ***ops$azbackup*** for external authentication to `azbackup` user, and grant sysbackup privileges:
   
   ```bash
   SQL> CREATE USER ops$azbackup IDENTIFIED EXTERNALLY;
   SQL> GRANT CREATE SESSION, ALTER SESSION, SYSBACKUP TO ops$azbackup;
   ```

   > [!IMPORTANT] 
   > If you receive error `ORA-46953: The password file is not in the 12.2 format.`  when you run the `GRANT` statement, follow these steps to migrate the orapwd file to 12.2 format, Note that you will need to perform this for every Oracle database on the VM:
   >
   > 1. Exit sqlplus.
   > 1. Move the password file with the old format to a new name.
   > 1. Migrate the password file.
   > 1. Remove the old file.
   > 1. Run the following commands:
   >
   >    ```bash
   >    mv $ORACLE_HOME/dbs/orapworatest1 $ORACLE_HOME/dbs/orapworatest1.tmp
   >    orapwd file=$ORACLE_HOME/dbs/orapworatest1 input_file=$ORACLE_HOME/dbs/orapworatest1.tmp
   >    rm $ORACLE_HOME/dbs/orapworatest1.tmp
   >    ```
   >
   > 1. Rerun the `GRANT` operation in sqlplus.
   >
   
1. Create a stored procedure to log backup messages to the database alert log:

   > [!IMPORTANT]
   > Perform the following steps for ***each*** database installed on the VM:

   ```bash
   sqlplus / as sysdba
   SQL> GRANT EXECUTE ON DBMS_SYSTEM TO SYSBACKUP;
   SQL> CREATE PROCEDURE sysbackup.azmessage(in_msg IN VARCHAR2)
   AS
     v_timestamp     VARCHAR2(32);
   BEGIN
     SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS')
     INTO v_timestamp FROM DUAL;
     DBMS_OUTPUT.PUT_LINE(v_timestamp || ' - ' || in_msg);
     SYS.DBMS_SYSTEM.KSDWRT(SYS.DBMS_SYSTEM.ALERT_FILE, in_msg);
   END azmessage;
   /
   SQL> SHOW ERRORS
   SQL> QUIT
   ```

### Set up application-consistent backups  

1. Switch to the root user first:
   ```bash
   sudo su -
   ```

1. Check for "/ etc/azure" folder. If that is not present, create the application-consistent backup working directory:

   ```bash
   if [ ! -d "/etc/azure" ]; then
      mkdir /etc/azure
   fi
   ```

1. Check for "workload.conf" within the folder. If that is not present, create a file in the */etc/azure* directory called *workload.conf* with the following contents, which must begin with `[workload]`. If the file is already present, then just edit the fields so that it matches the following content. Otherwise, the following command will create the file and populate the contents:

   ```bash
   echo "[workload]
   workload_name = oracle
   configuration_path = /etc/oratab
   timeout = 90
   linux_user = azbackup" > /etc/azure/workload.conf
   ```

   > [!IMPORTANT]
   > The format used by workload.conf is as follows:
   > * The parameter **workload_name** is used by Azure Backup to determine the database workload type. In this case setting to oracle, allows Azure Backup to run the correct pre and post consistency commands for Oracle databases.
   > * The parameter **timeout** indicates the maximum time in seconds that each database will have to complete storage snapshots.
   > * The parameter **linux_user** indicates the Linux user account that will be used by Azure Backup to run database quiesce operations. You created this user, `azbackup`, previously.
   > * The parameter **configuration_path** indicates the absolute path name for a text file on the VM where each line lists a database instance running on the VM. This will typically be the `/etc/oratab` file which is generated by Oracle during database installation, but it can be any file with any name you choose, it must however follow these format rules:
   >   * A text file with each field delimited with the colon character `:`
   >   * The first field in each line is the name for an ORACLE_SID
   >   * The second field in each line is the absolute path name for the ORACLE_HOME for that ORACLE_SID
   >   * All text following these first two fields will be ignored
   >   * If the line starts with a pound/hash character `#` then the entire line will be ignored as a comment
   >   * If the first field has the value `+ASM` denoting an Automatic Storage Management instance, it is ignored. 


### Trigger an application-consistent backup of the VM

# [Portal](#tab/azure-portal)

1.  In the Azure portal, go to your resource group **rg-oracle** and click on your Virtual Machine **vmoracle19c**.

1.  On the **Backup** blade, create a new **Recovery Services Vault** in the resource group **rg-oracle** with the name **myVault**.
    For **Choose backup policy**, use **(new) DailyPolicy**. If you want to change the backup frequency or retention range select **Create a new policy** instead.

    ![Recovery Services vaults add page](./media/oracle-backup-recovery/recovery-service-01.png)

1.  To continue, click **Enable Backup**.

    > [!IMPORTANT]
    > After you click **Enable backup**, the backup process doesn't start until the scheduled time expires. To set up an immediate backup, complete the next step.

1. From the resource group page, click on your newly created Recovery Services Vault **myVault**. Hint: You may need to refresh the page to see it.

1.  On the **myVault - Backup items** blade, under **BACKUP ITEM COUNT**, select the backup item count.

    ![Recovery Services vaults myVault detail page](./media/oracle-backup-recovery/recovery-service-02.png)

1.  On the **Backup Items (Azure Virtual Machine)** blade, on the right side of the page, click the ellipsis (**...**) button, and then click **Backup now**.

    ![Recovery Services vaults Backup now command](./media/oracle-backup-recovery/recovery-service-03.png)

1.  Accept the default Retain Backup Till value and click the **OK** button. Wait for the backup process to finish. 

    To view the status of the backup job, click **Backup Jobs**.

    ![Recovery Services vaults job page](./media/oracle-backup-recovery/recovery-service-04.png)

    The status of the backup job appears in the following image:

    ![Recovery Services vaults job page with status](./media/oracle-backup-recovery/recovery-service-05.png)
    
    Note that while it only takes seconds to execute the snapshot it can take some time to transfer it to the vault, and the backup job is not completed until the transfer is finished.

1. For an application-consistent backup, address any errors in the log file. The log file is located at /var/log/azure/Microsoft.Azure.RecoveryServices.VMSnapshotLinux/extension.log.

# [Azure CLI](#tab/azure-cli)

1. Create a Recovery services vault:

   ```azurecli
   az backup vault create --location eastus --name myVault --resource-group rg-oracle
   ```

1. Enable backup protection for the VM:

   ```azurecli
   az backup protection enable-for-vm \
      --resource-group rg-oracle \
      --vault-name myVault \
      --vm vmoracle19c \
      --policy-name DefaultPolicy
   ```

1. Trigger a backup to run now rather than waiting for the backup to trigger at the default schedule (5 AM UTC): 

   ```azurecli
   az backup protection backup-now \
      --resource-group rg-oracle \
      --vault-name myVault \
      --backup-management-type AzureIaasVM \
      --container-name vmoracle19c \
      --item-name vmoracle19c 
   ```

   You can monitor the progress of the backup job using `az backup job list` and `az backup job show`.

---


## Restore the VM

Restoring the entire VM allows you to restore the VM and its attached disks to a new VM from a selected restore point. This will restore all databases that run on the VM and each database will need to be recovered afterwards. 

To restore the entire VM, complete these steps:

1. [Stop and delete the VM](#stop-and-delete-the-vm).
1. [Recover the VM](#recover-the-vm).
1. [Set the public IP address](#set-the-public-ip-address).
1. [Perform database recovery](#recovery-after-complete-vm-restore).

### Stop and delete the VM

# [Portal](#tab/azure-portal)

1. In the Azure portal, go to the **vmoracle19c** Virtual Machine, and then select **Stop**.

1. When the Virtual Machine is no longer running, select **Delete** and then **Yes**.

   ![Vault delete command](./media/oracle-backup-recovery/recover-vm-01.png)

# [Azure CLI](#tab/azure-cli)

1. Stop and deallocate the VM:

    ```azurecli
    az vm deallocate --resource-group rg-oracle --name vmoracle19c
    ```

1. Delete the VM. Enter 'y' when prompted:

    ```azurecli
    az vm delete --resource-group rg-oracle --name vmoracle19c
    ```

---

### Recover the VM

# [Portal](#tab/azure-portal)

1. Create a storage account for staging in the Azure portal.

   1. In the Azure portal, select **+ Create a resource** and search for and select **Storage Account**.
    
      ![Screenshot that shows where to create a resource.](./media/oracle-backup-recovery/storage-1.png)
    
    
   1. In the Create storage account page, choose your existing resource group **rg-oracle**, name your storage account **oracrestore** and choose **Storage V2 (generalpurpose v2)** for Account Kind. Change Replication to **Locally-redundant storage (LRS)** and set Performance to **Standard**. Ensure that Location is set to the same region as all your other resources in the resource group. 
    
      ![Storage Account add page](./media/oracle-backup-recovery/recovery-storage-1.png)
   
   1. Click on Review + Create and then click Create.

1. In the Azure portal, search for the *myVault* Recovery Services vaults item and click on it.

    ![Recovery Services vaults myVault backup items](./media/oracle-backup-recovery/recovery-service-06.png)
    
1.  On the **Overview** blade, select **Backup items** and the select **Azure Virtual Machine**, which should have anon-zero Backup Item Count listed.

    ![Recovery Services vaults Azure Virtual Machine backup item count](./media/oracle-backup-recovery/recovery-service-07.png)

1.  On the Backups Items (Azure Virtual Machines), page your VM **vmoracle19c** is listed. Click on the VM name.

    ![Recovery VM page](./media/oracle-backup-recovery/recover-vm-02.png)

1.  On the **vmoracle19c** blade, choose a restore point that has a consistency type of **Application Consistent** and click the ellipsis (**...**) on the right to bring up the menu.  From the menu click **Restore VM**.

    ![Restore VM command](./media/oracle-backup-recovery/recover-vm-03.png)

1.  On the **Restore Virtual Machine** blade, choose **Create New** and **Create New Virtual Machine**. Enter the virtual machine name **vmoracle19c** and choose the VNet **vmoracle19cVNET**, the subnet will be automatically populated for you based on your VNet selection. The restore VM process requires an Azure storage account in the same resource group and region. You can choose the storage account **or a restore** you set up earlier.

    ![Restore configuration values](./media/oracle-backup-recovery/recover-vm-04.png)

1.  To restore the VM, click the **Restore** button.

1.  To view the status of the restore process, click **Jobs**, and then click **Backup Jobs**.

    ![Backup jobs status command](./media/oracle-backup-recovery/recover-vm-05.png)

    Click on the **In Progress** restore operation to show the status of the restore process:

    ![Status of the restore process](./media/oracle-backup-recovery/recover-vm-06.png)

# [Azure CLI](#tab/azure-cli)

To set up your storage account and file share, run the following commands in Azure CLI.

1. Create the storage account in the same resource group and location as your VM:

   ```azurecli
   az storage account create -n orarestore -g rg-oracle -l eastus --sku Standard_LRS
   ```

1. Retrieve the list of recovery points available. 

   ```azurecli
   az backup recoverypoint list \
      --resource-group rg-oracle \
      --vault-name myVault \
      --backup-management-type AzureIaasVM \
      --container-name vmoracle19c \
      --item-name vmoracle19c \
      --query [0].name \
      --output tsv
   ```

1. Restore the recovery point to the storage account. Substitute `<myRecoveryPointName>` with a recovery point from the list generated in the previous step:

   ```azurecli
   az backup restore restore-disks \
      --resource-group rg-oracle \
      --vault-name myVault \
      --container-name vmoracle19c \
      --item-name vmoracle19c \
      --storage-account orarestore \
      --rp-name <myRecoveryPointName> \
      --target-resource-group rg-oracle
   ```

1. Retrieve the restore job details. The following command gets more details for the triggered restored job, including its name, which is needed to retrieve the template URI. 

   ```azurecli
   az backup job list \
       --resource-group rg-oracle \
       --vault-name myVault \
       --output table
   ```

   The output will look similar to this `(Note down the name of the restore job)`:

   ```output
   Name                                  Operation        Status     Item Name    Start Time UTC                    Duration
   ------------------------------------  ---------------  ---------  -----------  --------------------------------  --------------
   c009747a-0d2e-4ac9-9632-f695bf874693  Restore          Completed  vmoracle19c  2021-01-10T21:46:07.506223+00:00  0:03:06.634177
   6b779c98-f57a-4db1-b829-9e8eab454a52  Backup           Completed  vmoracle19c  2021-01-07T10:11:15.784531+00:00  0:21:13.220616
   502bc7ae-d429-4f0f-b78e-51d41b7582fc  ConfigureBackup  Completed  vmoracle19c  2021-01-07T09:43:55.298755+00:00  0:00:30.839674
   ```

1. Retrieve the details of the URI to use for recreating the VM. Substitute the restore job name from the previous step for `<RestoreJobName>`.

    ```azurecli
      az backup job show \
        -v myVault \
        -g rg-oracle \
        -n <RestoreJobName> \
        --query properties.extendedInfo.propertyBag
    ```

   Output is similar to this:

   ```output
   {
   "Config Blob Container Name": "vmoracle19c-75aefd4b34c64dd39fdcd3db579783f2",
   "Config Blob Name": "config-vmoracle19c-c009747a-0d2e-4ac9-9632-f695bf874693.json",
   "Config Blob Uri": "https://orarestore.blob.core.windows.net/vmoracle19c-75aefd4b34c64dd39fdcd3db579783f2/config-vmoracle19c-c009747a-0d2e-4ac9-9632-f695bf874693.json",
   "Job Type": "Recover disks",
   "Recovery point time ": "1/7/2021 10:11:19 AM",
   "Target Storage Account Name": "orarestore",
   "Target resource group": "rg-oracle",
   "Template Blob Uri": "https://orarestore.blob.core.windows.net/vmoracle19c-75aefd4b34c64dd39fdcd3db579783f2/azuredeployc009747a-0d2e-4ac9-9632-f695bf874693.json"
   }
   ```

   The template name, which is at the end of Template Blob Uri, which in this example is `azuredeployc009747a-0d2e-4ac9-9632-f695bf874693.json`, and the Blob container name, which is `vmoracle19c-75aefd4b34c64dd39fdcd3db579783f2` are listed. 

   Use these values in the following command to assign variables in preparation for creating the VM. A SAS key is generated for the storage container with 30-minutes duration.  


   ```azurecli
   expiretime=$(date -u -d "30 minutes" '+%Y-%m-%dT%H:%MZ')
   connection=$(az storage account show-connection-string \
    --resource-group rg-oracle \
    --name orarestore \
    --query connectionString)
   token=$(az storage blob generate-sas \
    --container-name <ContainerName> \
    --name <TemplateName> \
    --expiry $expiretime \
    --permissions r \
    --output tsv \
    --connection-string $connection)
   url=$(az storage blob url \
    --container-name <ContainerName> \
    --name <TemplateName> \
    --connection-string $connection \
    --output tsv)
   ```

   Now deploy the template to create the VM.

   ```azurecli
   az deployment group create \
      --resource-group rg-oracle \
      --template-uri $url?$token
   ```

   You will be prompted to provide a name for the VM.

---

### Set the public IP address

After the VM is restored, you should reassign the original IP address to the new VM.

# [Portal](#tab/azure-portal)

1.  In the Azure portal, go to your Virtual Machine **vmoracle19c**. You will notice it has been assigned a new public IP and NIC similar to vmoracle19c-nic-XXXXXXXXXXXX, but does not have a DNS address. When the original VM was deleted its public IP and NIC are retained and the next steps will reattach them to the new VM.

    ![List of public IP addresses](./media/oracle-backup-recovery/create-ip-01.png)

1.  Stop the VM

    ![Create IP address](./media/oracle-backup-recovery/create-ip-02.png)

1.  Go to **Networking**

    ![Associate IP address](./media/oracle-backup-recovery/create-ip-03.png)

1.  Click on **Attach network interface**, choose the original NIC **vmoracle19cVMNic, which the original public IP address is still associated to, and click **OK**

    ![Select resource type and NIC values](./media/oracle-backup-recovery/create-ip-04.png)

1.  Now you must detach the NIC that was created with the VM restore operation as it is configured as the primary interface. Click on **Detach network interface** and choose the new NIC similar to **vmoracle19c-nic-XXXXXXXXXXXX**, then click **OK**

    ![Screenshot that shows where to select Detach network interface.](./media/oracle-backup-recovery/create-ip-05.png)
    
    Your recreated VM will now have the original NIC, which is associated with the original IP address and Network Security Group rules
    
    ![IP address value](./media/oracle-backup-recovery/create-ip-06.png)
    
1.  Go back to the **Overview** and click **Start** 

# [Azure CLI](#tab/azure-cli)

1. Stop and deallocate the VM:

   ```azurecli
   az vm deallocate --resource-group rg-oracle --name vmoracle19c
   ```

1. List the current, restore generated VM NIC

   ```azurecli
   az vm nic list --resource-group rg-oracle --vm-name vmoracle19c
   ```

   The output will look similar to this, which lists the restore generated NIC name as `vmoracle19cRestoredNICc2e8a8a4fc3f47259719d5523cd32dcf`

   ```output
   {
    "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx/resourceGroups/rg-oracle/providers/Microsoft.Network/networkInterfaces/vmoracle19cRestoredNICc2e8a8a4fc3f47259719d5523cd32dcf",
    "primary": true,
    "resourceGroup": "rg-oracle"
   }
   ```

1. Attach original NIC, which should have a name of `<VMName>VMNic`, in this case `vmoracle19cVMNic`. The original Public IP address is still attached to this NIC and will be restored to the VM when the NIC is reattached. 

   ```azurecli
   az vm nic add --nics vmoracle19cVMNic --resource-group rg-oracle --vm-name vmoracle19c
   ```

1. Detach the restore generated NIC

   ```azurecli
   az vm nic remove --nics vmoracle19cRestoredNICc2e8a8a4fc3f47259719d5523cd32dcf --resource-group rg-oracle --vm-name vmoracle19c
   ```
  
1. Start the VM:

   ```azurecli
   az vm start --resource-group rg-oracle --name vmoracle19c
   ```

---

## Restore an individual database
As multiple Oracle databases can be run on an Azure VM, there may be times when you want to restore and recover an individual database without disrupting the other databases running on the VM. 

To restore an individual database, complete these steps:

1. [Remove the database files](#remove-the-database-files).
1. [Generate a restore script from the Recovery Services vault](#generate-a-restore-script-from-the-recovery-services-vault).
1. [Mount the restore point](#mount-the-restore-point).
1. [Restore the database files](#restore-the-database-files).

### Remove the database files 

Later in this article, you'll learn how to test the recovery process. Before you can test the recovery process, you have to remove the database files.

1.  Switch back to the oracle user:
    ```bash
    su - oracle
    ```

1. Shut down the Oracle instance:

    ```bash
    sqlplus / as sysdba
    SQL> shutdown abort
    ORACLE instance shut down.
    ```

1.  Remove the database datafiles and contolfiles to simulate a failure:

    ```bash
    cd /u02/oradata/ORATEST1
    rm -f *.dbf *.ctl
    ```

### Generate a restore script from the Recovery Services vault

# [Portal](#tab/azure-portal)

1. In the Azure portal, search for the *myVault* Recovery Services vaults item and select it.

    ![Recovery Services vaults myVault backup items](./media/oracle-backup-recovery/recovery-service-06.png)

1. On the **Overview** blade, select **Backup items** and the select **Azure Virtual Machine**, which should have anon-zero Backup Item Count listed.

    ![Recovery Services vaults Azure Virtual Machine backup item count](./media/oracle-backup-recovery/recovery-service-07.png)

1. On the Backups Items (Azure Virtual Machines) page, your VM **vmoracle19c** is listed. Click the ellipsis on the right to bring up the menu and select **File Recovery**.

    ![Screenshot of the Recovery Services vaults file recovery page](./media/oracle-backup-recovery/recovery-service-08.png)

1. On the **File Recovery (Preview)** pane, click **Download Script**. Then, save the download (.py) file to a folder on the client computer. A password is generated to the run the script. Copy the password to a file for use later. 

    ![Download script file saves options](./media/oracle-backup-recovery/recovery-service-09.png)

1. Copy the .py file to the VM.

    The following example shows how you to use a secure copy (scp) command to move the file to the VM. You also can copy the contents to the clipboard, and then paste the contents in a new file that is set up on the VM.

    > [!IMPORTANT]
    > In the following example, ensure that you update the IP address and folder values. The values must map to the folder where the file is saved.
    >

    ```bash
    $ scp vmoracle19c_xxxxxx_xxxxxx_xxxxxx.py azureuser@<publicIpAddress>:/tmp
    ```

# [Azure CLI](#tab/azure-cli)

To list recovery points for your VM, use az backup recovery point list. In this example, we select the most recent recovery point for the VM named vmoracle19c that's protected in the Recovery Services Vault called myVault:

```azurecli
   az backup recoverypoint list \
      --resource-group rg-oracle \
      --vault-name myVault \
      --backup-management-type AzureIaasVM \
      --container-name vmoracle19c \
      --item-name vmoracle19c \
      --query [0].name \
      --output tsv
```

To obtain the script that connects, or mounts, the recovery point to your VM, use az backup restore files mount-rp. The following example obtains the script for the VM named vmoracle19c that's protected in the Recovery Services Vault called myVault.

Replace myRecoveryPointName with the name of the recovery point that you obtained in the preceding command:

```azurecli
   az backup restore files mount-rp \
      --resource-group rg-oracle \
      --vault-name myVault \
      --container-name vmoracle19c \
      --item-name vmoracle19c \
      --rp-name myRecoveryPointName
```

The script is downloaded and a password is displayed, as in the following example:

```bash
   File downloaded: vmoracle19c_eus_4598131610710119312_456133188157_6931c635931f402eb543ee554e1cf06f102c6fc513d933.py. Use password c4487e40c760d29
```

Copy the .py file to the VM.

The following example shows how you to use a secure copy (scp) command to move the file to the VM. You also can copy the contents to the clipboard, and then paste the contents in a new file that is set up on the VM.

> [!IMPORTANT]
> In the following example, ensure that you update the IP address and folder values. The values must map to the folder where the file is saved.
>

```bash
$ scp vmoracle19c_xxxxxx_xxxxxx_xxxxxx.py azureuser@<publicIpAddress>:/tmp
```
---

### Mount the restore point

1. Switch to the root user:
   ```bash
   sudo su -
   ``````
1. Create a restore mount point and copy the script to it.

    In the following example, create a */restore* directory for the snapshot to mount to, move the file to the directory, and change the file so that it's owned by the root user and made executable.

    ```bash 
    mkdir /restore
    chmod 777 /restore
    cd /restore
    cp /tmp/vmoracle19c_xxxxxx_xxxxxx_xxxxxx.py /restore
    chmod 755 /restore/vmoracle19c_xxxxxx_xxxxxx_xxxxxx.py
    ```
    
    Now execute the script to restore the backup. You will be asked to supply the password generated in Azure portal. 
  
   ```bash
    ./vmoracle19c_xxxxxx_xxxxxx_xxxxxx.py
    ```

    The following example shows what you should see after you run the preceding script. When you're prompted to continue, enter **Y**.

    ```output
    Microsoft Azure VM Backup - File Recovery
    ______________________________________________
    Please enter the password as shown on the portal to securely connect to the recovery point. : b1ad68e16dfafc6

    Connecting to recovery point using ISCSI service...

    Connection succeeded!

    Please wait while we attach volumes of the recovery point to this machine...

    ************ Volumes of the recovery point and their mount paths on this machine ************

    Sr.No.  |  Disk  |  Volume  |  MountPath

    1)  | /dev/sdc  |  /dev/sdc1  |  /restore/vmoracle19c-20201215123912/Volume1

    2)  | /dev/sdd  |  /dev/sdd1  |  /restore/vmoracle19c-20201215123912/Volume2

    3)  | /dev/sdd  |  /dev/sdd2  |  /restore/vmoracle19c-20201215123912/Volume3

    4)  | /dev/sdd  |  /dev/sdd15  |  /restore/vmoracle19c-20201215123912/Volume5

    The following partitions failed to mount since the OS couldn't identify the filesystem.

    ************ Volumes from unknown filesystem ************

    Sr.No.  |  Disk  |  Volume  |  Partition Type

    1)  | /dev/sdb  |  /dev/sdb14  |  BIOS Boot partition

    Please refer to '/restore/vmoracle19c-2020XXXXXXXXXX/Scripts/MicrosoftAzureBackupILRLogFile.log' for more details.

    ************ Open File Explorer to browse for files. ************

    After recovery, remove the disks and close the connection to the recovery point by clicking the 'Unmount Disks' button from the portal or by using the relevant unmount command in case of powershell or CLI.

    After unmounting disks, run the script with the parameter 'clean' to remove the mount paths of the recovery point from this machine.

    Please enter 'q/Q' to exit...
    ```

1. Access to the mounted volumes is confirmed.

    To exit, enter **q**, and then search for the mounted volumes. To create a list of the added volumes, at a command prompt, enter **df -h**.
    
    ```
    [root@vmoracle19c restore]# df -h
    Filesystem      Size  Used Avail Use% Mounted on
    devtmpfs        3.8G     0  3.8G   0% /dev
    tmpfs           3.8G     0  3.8G   0% /dev/shm
    tmpfs           3.8G   17M  3.8G   1% /run
    tmpfs           3.8G     0  3.8G   0% /sys/fs/cgroup
    /dev/sdd2        30G  9.6G   18G  36% /
    /dev/sdb1       126G  736M  119G   1% /u02
    /dev/sda1       497M  199M  298M  41% /boot
    /dev/sda15      495M  9.7M  486M   2% /boot/efi
    tmpfs           771M     0  771M   0% /run/user/54322
    /dev/sdc1       126G  2.9G  117G   3% /restore/vmoracle19c-20201215123912/Volume1
    /dev/sdd1       497M  199M  298M  41% /restore/vmoracle19c-20201215123912/Volume2
    /dev/sdd2        30G  9.6G   18G  36% /restore/vmoracle19c-20201215123912/Volume3
    /dev/sdd15      495M  9.7M  486M   2% /restore/vmoracle19c-20201215123912/Volume5
    ```

### Restore The Database Files
Perform the following steps for the database on the VM you want to restore:

1. Restore the missing database files back to their location:

    ```bash
    cd /restore/vmoracle19c-2020XXXXXXXXXX/Volume1/oradata/ORATEST1
    cp * /u02/oradata/ORATEST1
    cd /u02/oradata/ORATEST1
    chown -R oracle:oinstall *
    ```
Now the database has been restored you must recover the database. Please follow the steps in [Database Recovery](#recovery-after-an-individual-database-restore) to complete the recovery. 

## Database Recovery

### Recovery after complete VM restore

1. First reconnect to the VM:
   ```bash
   ssh azureuser@<publicIpAddress>
   ```
   > [!Important]
   > When the whole VM has been restored, it is important to recover each database on the VM by performing the following steps on each:

1. You may find that the instance is running as the auto start has attempted to start the database on VM boot. However the database requires recovery and is likely to be at mount stage only, so a preparatory shutdown is run first followed by starting to mount stage.

    ```bash
    $ sudo su - oracle
    $ sqlplus / as sysdba
    SQL> shutdown immediate
    SQL> startup mount
    ```
   
1. Perform database recovery
   > [!IMPORTANT]
   > Please note that it is important to specify the USING BACKUP CONTROLFILE syntax to inform the RECOVER AUTOMATIC DATABASE command that recovery should not stop at the Oracle system change number (SCN) recorded in the restored database control file. The restored database control file was a snapshot, along with the rest of the database, and the SCN stored within it is from the point-in-time of the snapshot. There may be transactions recorded after this point and we want to recover to the point-in-time of the last transaction committed to the database.
    
    ```bash
    SQL> recover automatic database using backup controlfile until cancel;
    ```
   When the last available archive log file has been applied type `CANCEL` to end recovery.

1. Open the database
   > [!IMPORTANT]
   > The RESETLOGS option is required when the RECOVER command uses the USING BACKUP CONTROLFILE option. RESETLOGS creates a new incarnation of the database by resetting the redo history back to the beginning, because there is no way to determine how much of the previous database incarnation was skipped in the recovery.
   
    ```bash 
    SQL> alter database open resetlogs;
    ```
   

1. Check the database content has been recovered:

    ```bash
    SQL> select * from scott.scott_table;
    ```
### Recovery after an individual database restore

1. Switch back to the oracle user
   ```bash
   sudo su - oracle
   ```
1. Start the database instance and mount the controlfile for reading:
   ```bash
   sqlplus / as sysdba
   SQL> startup mount
   SQL> quit
   ```

1. Connect to the database with sysbackup:
   ```bash
   sqlplus / as sysbackup
   ```
1. Initiate automatic database recovery:

   ```bash
   SQL> recover automatic database until cancel using backup controlfile;
   ```
   > [!IMPORTANT]
   > Please note that it is important to specify the USING BACKUP CONTROLFILE syntax to inform the RECOVER AUTOMATIC DATABASE command that recovery should not stop at the Oracle system change number (SCN) recorded in the restored database control file. The restored database control file was a snapshot, along with the rest of the database, and the SCN stored within it is from the point-in-time of the snapshot. There may be transactions recorded after this point and we want to recover to the point-in-time of the last transaction committed to the database.

   When recovery completes successfully you will see the message `Media recovery complete`. However, when using the BACKUP CONTROLFILE clause the recover command will ignore online log files and it is possible there are changes in the current online redo log required to complete point in time recovery. In this situation you may see messages similar to these:

   ```output
   SQL> recover automatic database until cancel using backup controlfile;
   ORA-00279: change 2172930 generated at 04/08/2021 12:27:06 needed for thread 1
   ORA-00289: suggestion :
   /u02/fast_recovery_area/ORATEST1/archivelog/2021_04_08/o1_mf_1_13_%u_.arc
   ORA-00280: change 2172930 for thread 1 is in sequence #13
   ORA-00278: log file
   '/u02/fast_recovery_area/ORATEST1/archivelog/2021_04_08/o1_mf_1_13_%u_.arc' no
   longer needed for this recovery
   ORA-00308: cannot open archived log
   '/u02/fast_recovery_area/ORATEST1/archivelog/2021_04_08/o1_mf_1_13_%u_.arc'
   ORA-27037: unable to obtain file status
   Linux-x86_64 Error: 2: No such file or directory
   Additional information: 7

   Specify log: {<RET>=suggested | filename | AUTO | CANCEL}
   ```
   
   > [!IMPORTANT]
   > Note that if the current online redo log has been lost or corrupted and cannot be used, you may cancel recovery at this point. 

   To correct this you can identify which is the current online log that has not been archived, and supply the fully qualified filename to the prompt.


   Open a new ssh connection 
   ```bash
   ssh azureuser@<IP Address>
   ```
   Switch to the oracle user and set the Oracle SID
   ```bash
   sudo su - oracle
   export ORACLE_SID=oratest1
   ```
   
   Connect to the database and run the following query to find the online logfile 
   ```bash
   sqlplus / as sysdba
   SQL> column member format a45
   SQL> set linesize 500  
   SQL> select l.SEQUENCE#, to_char(l.FIRST_CHANGE#,'999999999999999') as CHK_CHANGE, l.group#, l.archived, l.status, f.member
   from v$log l, v$logfile f
   where l.group# = f.group#;
   ```

   The output will look similar to this. 
   ```output
   SEQUENCE#  CHK_CHANGE           GROUP# ARC STATUS	        MEMBER
   ---------- ---------------- ---------- --- ---------------- ---------------------------------------------
           13          2172929          1 NO  CURRENT          /u02/oradata/ORATEST1/redo01.log
           12          2151934          3 YES INACTIVE         /u02/oradata/ORATEST1/redo03.log
           11          2071784          2 YES INACTIVE         /u02/oradata/ORATEST1/redo02.log
   ```
   Copy the logfile path and file name for the CURRENT online log, in this example it is `/u02/oradata/ORATEST1/redo01.log`. Switch back to the ssh session running the recover command, input the logfile information and press return:

   ```bash
   Specify log: {<RET>=suggested | filename | AUTO | CANCEL}
   /u02/oradata/ORATEST1/redo01.log
   ```

   You should see the logfile is applied and recovery completes. Enter CANCEL to exit the recover command:
   ```output
   Specify log: {<RET>=suggested | filename | AUTO | CANCEL}
   /u02/oradata/ORATEST1/redo01.log
   Log applied.
   Media recovery complete.
   ```

1. Open the database
   
   > [!IMPORTANT]
   > The RESETLOGS option is required when the RECOVER command uses the USING BACKUP CONTROLFILE option. RESETLOGS creates a new incarnation of the database by resetting the redo history back to the beginning, because there is no way to determine how much of the previous database incarnation was skipped in the recovery.

   ```bash
   SQL> alter database open resetlogs;
   ```

   
1. Check the database content has been fully recovered:

    ```bash
    RMAN> SELECT * FROM scott.scott_table;
    ```

1. Unmount the restore point.

   When all databases on the VM have been successfully recovered you may unmount the restore point. This can be done on the VM using the `unmount` command or in Azure portal from the File Recovery blade. You can also unmount the recovery volumes by running the python script again with the **-clean** option.

   In the VM using unmount:
   ```bash
   sudo umount /restore/vmoracle19c-20210107110037/Volume*
   ```

    In the Azure portal, on the **File Recovery (Preview)** blade, click **Unmount Disks**.

    ![Unmount disks command](./media/oracle-backup-recovery/recovery-service-10.png)
    
The backup and recovery of the Oracle Database on an Azure Linux VM is now finished.

More information about Oracle commands and concepts can be found in the Oracle documentation, including:

   * [Performing Oracle user-managed backups of the entire database](https://docs.oracle.com/en/database/oracle/oracle-database/19/bradv/user-managed-database-backups.html#GUID-65C5E03A-E906-47EB-92AF-6DC273DBD0A8)
   * [Performing complete user-managed database recovery](https://docs.oracle.com/en/database/oracle/oracle-database/19/bradv/user-managed-flashback-dbpitr.html#GUID-66D07694-533F-4E3A-BA83-DD461B68DB56)
   * [Oracle STARTUP command](https://docs.oracle.com/en/database/oracle/oracle-database/19/sqpug/STARTUP.html#GUID-275013B7-CAE2-4619-9A0F-40DB71B61FE8)
   * [Oracle RECOVER command](https://docs.oracle.com/en/database/oracle/oracle-database/19/bradv/user-managed-flashback-dbpitr.html#GUID-54B59888-8683-4CD9-B144-B0BB68887572)
   * [Oracle ALTER DATABASE command](https://docs.oracle.com/en/database/oracle/oracle-database/19/sqlrf/ALTER-DATABASE.html#GUID-8069872F-E680-4511-ADD8-A4E30AF67986)
   * [Oracle LOG_ARCHIVE_DEST_n parameter](https://docs.oracle.com/en/database/oracle/oracle-database/19/refrn/LOG_ARCHIVE_DEST_n.html#GUID-10BD97BF-6295-4E85-A1A3-854E15E05A44)
   * [Oracle ARCHIVE_LAG_TARGET parameter](https://docs.oracle.com/en/database/oracle/oracle-database/19/refrn/ARCHIVE_LAG_TARGET.html#GUID-405D335F-5549-4E02-AFB9-434A24465F0B)




## Delete the VM

When you no longer need the VM, you can use the following commands to remove the resource group, the VM, and all related resources:

1. Disable Soft Delete of backups in the vault

    ```azurecli
    az backup vault backup-properties set --name myVault --resource-group rg-oracle --soft-delete-feature-state disable
    ```

1. Stop protection for the VM and delete backups

    ```azurecli
    az backup protection disable --resource-group rg-oracle --vault-name myVault --container-name vmoracle19c --item-name vmoracle19c --delete-backup-data true --yes
    ```

1. Remove the resource group including all resources

    ```azurecli
    az group delete --name rg-oracle
    ```

## Next steps

[Tutorial: Create highly available VMs](../../linux/create-cli-complete.md)

[Explore VM deployment Azure CLI samples](https://github.com/Azure-Samples/azure-cli-samples/tree/master/virtual-machine)
