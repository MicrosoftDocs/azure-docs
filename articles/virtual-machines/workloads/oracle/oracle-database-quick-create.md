---
title: Create an Oracle database in an Azure VM | Microsoft Docs
description: Quickly get an Oracle Database 12c database up and running in your Azure environment.
author: dbakevlar
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: linux
ms.topic: quickstart
ms.date: 10/05/2020
ms.author: kegorman

---

# Create an Oracle Database in an Azure VM

This guide details using the Azure CLI to deploy an Azure virtual machine from the [Oracle marketplace gallery image](https://azuremarketplace.microsoft.com/marketplace/apps/Oracle.OracleDatabase12102EnterpriseEdition?tab=Overview) in order to create an Oracle 19c database. Once the server is deployed, you will connect via SSH in order to configure the Oracle database. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named *rg-oracle* in the *eastus* location.

```azurecli-interactive
az group create --name rg-oracle --location eastus
```

## Create virtual machine

To create a virtual machine (VM), use the [az vm create](/cli/azure/vm) command. 

The following example creates a VM named `vmoracle19c`. It also creates SSH keys, if they do not already exist in a default key location. To use a specific set of keys, use the `--ssh-key-value` option.  

```azurecli-interactive 
az vm create ^
    --resource-group rg-oracle ^
    --name vmoracle19c ^
    --image Oracle:oracle-database-19-3:oracle-database-19-0904:latest ^
    --size Standard_DS2_v2 ^
    --admin-username azureuser ^
    --generate-ssh-keys ^
    --public-ip-address-allocation static ^
    --public-ip-address-dns-name vmoracle19c

```

After you create the VM, Azure CLI displays information similar to the following example. Note the value for `publicIpAddress`. You use this address to access the VM.

```output
{
  "fqdns": "",
  "id": "/subscriptions/{snip}/resourceGroups/rg-oracle/providers/Microsoft.Compute/virtualMachines/vmoracle19c",
  "location": "eastus",
  "macAddress": "00-0D-3A-36-2F-56",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "13.64.104.241",
  "resourceGroup": "rg-oracle"
}
```
## Create and attach a new disk for Oracle datafiles and FRA

```bash
az vm disk attach --name oradata01 --new --resource-group rg-oracle --size-gb 128 --sku StandardSSD_LRS --vm-name vmoracle19c
```

## Open ports for connectivity
In this task you must configure some external endpoints for the database listener and EM Express to use by setting up the Azure Network Security Group that protects the VM. 

1. To open the endpoint that you use to access the Oracle database remotely, create a Network Security Group rule as follows:
   ```bash
   az network nsg rule create ^
       --resource-group rg-oracle ^
       --nsg-name vmoracle19cNSG ^
       --name allow-oracle ^
       --protocol tcp ^
       --priority 1001 ^
       --destination-port-range 1521
   ```
2. To open the endpoint that you use to access Oracle EM Express remotely, create a Network Security Group rule with az network nsg rule create as follows:
   ```bash
   az network nsg rule create ^
       --resource-group rg-oracle ^
       --nsg-name vmoracle19cNSG ^
       --name allow-oracle-EM ^
       --protocol tcp ^
       --priority 1002 ^
       --destination-port-range 5502
   ```
3. If needed, obtain the public IP address of your VM again with az network public-ip show as follows:

   ```bash
   az network public-ip show ^
       --resource-group rg-oracle ^
       --name vmoracle19cPublicIP ^
       --query [ipAddress] ^
       --output tsv
   ```

## Prepare the VM environment

1. Connect to the VM

   To create an SSH session with the VM, use the following command. Replace the IP address with the `publicIpAddress` value for your VM.

   ```bash
   ssh azureuser@<publicIpAddress>
   ```

2. Switch to the root user

   ```bash
   sudo su -
   ```

3. Check for last created disk device that we will format for use holding Oracle datafiles

   ```bash
   ls -alt /dev/sd*|head -1
   ```

   The output will be similar to this:
   ```output
   brw-rw----. 1 root disk 8, 16 Dec  8 22:57 /dev/sdc
   ```

4. Format the device. 
   As root user run parted on the device 
   
   First create a disk label:
   ```bash
   parted /dev/sdc mklabel gpt
   ```
   Then create a primary partition spanning the whole disk:
   ```bash
   parted -a optimal /dev/sdc mkpart primary 0GB 64GB	
   ```
   Finally check the device details by printing its metadata:
   ```bash
   parted /dev/sdc print
   ```
   The output should look similar to this:
   ```bash
   # parted /dev/sdc print
   Model: Msft Virtual Disk (scsi)
   Disk /dev/sdc: 68.7GB
   Sector size (logical/physical): 512B/4096B
   Partition Table: gpt
   Disk Flags:
   Number  Start   End     Size    File system  Name     Flags
    1      1049kB  64.0GB  64.0GB  ext4         primary
   ```

5. Create a filesystem on the device partition

   ```bash
   mkfs -t ext4 /dev/sdc1
   ```

6. Create a mount point
   ```bash
   mkdir /u02
   ```

7. Mount the disk

   ```bash
   mount /dev/sdc1 /u02
   ```

8. Change permissions on the mount point

   ```bash
   chmod 777 /u02
   ```

9. Add the mount to the /etc/fstab file. 

   ```bash
   echo "/dev/sdc1               /u02                    ext4    defaults        0 0" >> /etc/fstab
   ```
   
10. Update the ***/etc/hosts*** file with the public IP and hostname.

    Change the ***Public IP and VMname*** to reflect your actual values:
  
    ```bash
    echo "<Public IP> <VMname>.eastus.cloudapp.azure.com <VMname>" >> /etc/hosts
    ```
11. Update the hostname file
    
    Use the following command to add the domain name of the VM to the **/etc/hostname** file. This assumes you have created your resource group and VM in the **eastus** region:
    
    ```bash
    sed -i 's/$/\.eastus\.cloudapp\.azure\.com &/' /etc/hostname
    ```

12. Open firewall ports
    
    As SELinux is enabled by default on the Marketplace image we need to open the firewall to traffic for the database listening port 1521, and Enterprise Manager Express port 5502. Run the following commands as root user:

    ```bash
    firewall-cmd --zone=public --add-port=1521/tcp --permanent
    firewall-cmd --zone=public --add-port=5502/tcp --permanent
    firewall-cmd --reload
    ```
   

## Create the database

The Oracle software is already installed on the Marketplace image. Create a sample database as follows. 

1.  Switch to the **oracle** user:

    ```bash
    sudo su - oracle
    ```
2. Start the database listener

   ```bash
   lsnrctl start
   ```
   The output is similar to the following:
  
   ```output
   LSNRCTL for Linux: Version 19.0.0.0.0 - Production on 20-OCT-2020 01:58:18

   Copyright (c) 1991, 2019, Oracle.  All rights reserved.

   Starting /u01/app/oracle/product/19.0.0/dbhome_1/bin/tnslsnr: please wait...

   TNSLSNR for Linux: Version 19.0.0.0.0 - Production
   Log messages written to /u01/app/oracle/diag/tnslsnr/vmoracle19c/listener/alert/log.xml
   Listening on: (DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=vmoracle19c.eastus.cloudapp.azure.com)(PORT=1521)))

   Connecting to (ADDRESS=(PROTOCOL=tcp)(HOST=)(PORT=1521))
   STATUS of the LISTENER
   ------------------------
   Alias                     LISTENER
   Version                   TNSLSNR for Linux: Version 19.0.0.0.0 - Production
   Start Date                20-OCT-2020 01:58:18
   Uptime                    0 days 0 hr. 0 min. 0 sec
   Trace Level               off
   Security                  ON: Local OS Authentication
   SNMP                      OFF
   Listener Log File         /u01/app/oracle/diag/tnslsnr/vmoracle19c/listener/alert/log.xml
   Listening Endpoints Summary...
     (DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=vmoracle19c.eastus.cloudapp.azure.com)(PORT=1521)))
   The listener supports no services
   The command completed successfully
   ```
3. Create a data directory for the Oracle data files:

   ```bash
   mkdir /u02/oradata
   ```
    

3.  Run the Database Creation Assistant:

    ```bash
    dbca -silent \
       -createDatabase \
       -templateName General_Purpose.dbc \
       -gdbname test \
       -sid test \
       -responseFile NO_VALUE \
       -characterSet AL32UTF8 \
       -sysPassword OraPasswd1 \
       -systemPassword OraPasswd1 \
       -createAsContainerDatabase false \
       -databaseType MULTIPURPOSE \
       -automaticMemoryManagement false \
       -storageType FS \
       -datafileDestination "/u02/oradata/" \
       -ignorePreReqs
    ```

    It takes a few minutes to create the database.

    You will see output that looks similar to the following:

    ```output
        Prepare for db operation
       10% complete
       Copying database files
       40% complete
       Creating and starting Oracle instance
       42% complete
       46% complete
       50% complete
       54% complete
       60% complete
       Completing Database Creation
       66% complete
       69% complete
       70% complete
       Executing Post Configuration Actions
       100% complete
       Database creation complete. For details check the logfiles at: /u01/app/oracle/cfgtoollogs/dbca/test.
       Database Information:
       Global Database Name:test
       System Identifier(SID):test
       Look at the log file "/u01/app/oracle/cfgtoollogs/dbca/test/test.log" for further details.
    ```

4. Set Oracle variables

    Before you connect, you need to set the environment variable *ORACLE_SID*:

    ```bash
        export ORACLE_SID=test
    ```

    You should also add the ORACLE_SID variable to the `oracle` users `.bashrc` file for future sign-ins using the following command:

    ```bash
    echo "export ORACLE_SID=test" >> ~oracle/.bashrc
    ```

## Oracle EM Express connectivity

For a GUI management tool that you can use to explore the database, set up Oracle EM Express. To connect to Oracle EM Express, you must first set up the port in Oracle. 

1. Connect to your database using sqlplus:

    ```bash
    sqlplus sys as sysdba
    ```

2. Once connected, set the port 5502 for EM Express

    ```bash
    exec DBMS_XDB_CONFIG.SETHTTPSPORT(5502);
    ```

3.  Connect EM Express from your browser. Make sure your browser is compatible with EM Express (Flash install is required): 

    ```https
    https://<VM ip address or hostname>:5502/em
    ```

    You can log in by using the **SYS** account, and check the **as sysdba** checkbox. Use the password **OraPasswd1** that you set during installation. 

    ![Screenshot of the Oracle OEM Express login page](./media/oracle-quick-start/oracle_oem_express_login.png)

## Automate database startup and shutdown

The Oracle database by default doesn't automatically start when you restart the VM. To set up the Oracle database to start automatically, first sign in as root. Then, create and update some system files.

1. Sign on as root

    ```bash
    sudo su -
    ```

2.  Run the following command to change the automated startup flag from `N` to `Y` in the `/etc/oratab` file:

    ```bash
    sed -i 's/:N/:Y/' /etc/oratab
    ```

3.  Create a file named `/etc/init.d/dbora` and paste the following contents:

    ```bash
    #!/bin/sh
    # chkconfig: 345 99 10
    # Description: Oracle auto start-stop script.
    #
    # Set ORA_HOME to be equivalent to $ORACLE_HOME.
    ORA_HOME=/u01/app/oracle/product/19.0.0/dbhome_1
    ORA_OWNER=oracle

    case "$1" in
    'start')
        # Start the Oracle databases:
        # The following command assumes that the Oracle sign-in
        # will not prompt the user for any values.
        # Remove "&" if you don't want startup as a background process.
        su - $ORA_OWNER -c "$ORA_HOME/bin/dbstart $ORA_HOME" &
        touch /var/lock/subsys/dbora
        ;;

    'stop')
        # Stop the Oracle databases:
        # The following command assumes that the Oracle sign-in
        # will not prompt the user for any values.
        su - $ORA_OWNER -c "$ORA_HOME/bin/dbshut $ORA_HOME" &
        rm -f /var/lock/subsys/dbora
        ;;
    esac
    ```

4.  Change permissions on files with *chmod* as follows:

    ```bash
    chgrp dba /etc/init.d/dbora
    chmod 750 /etc/init.d/dbora
    ```

5.  Create symbolic links for startup and shutdown as follows:

    ```bash
    ln -s /etc/init.d/dbora /etc/rc.d/rc0.d/K01dbora
    ln -s /etc/init.d/dbora /etc/rc.d/rc3.d/S99dbora
    ln -s /etc/init.d/dbora /etc/rc.d/rc5.d/S99dbora
    ```

6.  To test your changes, restart the VM:

    ```bash
    reboot
    ```

## Clean up resources

Once you have finished exploring your first Oracle database on Azure and the VM is no longer needed, you can use the [az group delete](/cli/azure/group) command to remove the resource group, VM, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

Understand how to protect your database in Azure with [Oracle Backup Strategies](./oracle-database-backup-strategies.md)

Learn about other [Oracle solutions on Azure](./oracle-overview.md). 

Try the [Installing and Configuring Oracle Automated Storage Management](configure-oracle-asm.md) tutorial.
