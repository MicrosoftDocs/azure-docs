---
title: Create an Oracle database in an Azure VM
description: Learn how to quickly configure and deploy an Oracle Database 12c database in your Azure environment by using Azure Cloud Shell or the Azure CLI.
author: jjaygbay1
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: linux
ms.topic: quickstart
ms.date: 04/20/2023
ms.author: jacobjaygbay
ms.custom: mode-other, devx-track-azurecli, devx-track-java, devx-track-javaee
ms.devlang: azurecli
---

# Create an Oracle Database in an Azure VM

**Applies to:** :heavy_check_mark: Linux VMs 

This article describes how to use the Azure CLI to deploy an Azure virtual machine (VM) from the [Oracle marketplace gallery image](https://azuremarketplace.microsoft.com/marketplace/apps/Oracle.OracleDatabase12102EnterpriseEdition?tab=Overview) to create an Oracle Database 19c database. After you deploy the server, you connect the server via SSH to configure the Oracle database. 

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

- Azure Cloud Shell or the Azure CLI.

   You can run the Azure CLI commands in this quickstart interactively in Azure Cloud Shell. To run the commands in Cloud Shell, select **Open Cloudshell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also [run Cloud Shell from within the Azure portal](https://shell.azure.com). Cloud Shell always uses the latest version of the Azure CLI.

   Alternatively, you can [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. The steps in this article require the Azure CLI version 2.0.4 or later. Run [az version](/cli/azure/reference-index?#az-version) to see your installed version and dependent libraries, and run [az upgrade](/cli/azure/reference-index?#az-upgrade) to upgrade. If you use a local installation, sign in to Azure by using the [az login](/cli/azure/reference-index#az-login) command.

## Create resource group

Create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named **rg-oracle** in the **eastus** location.

```azurecli-interactive
az group create --name rg-oracle --location eastus
```

> [!Note]
> This quickstart creates a Standard_DS2_v2 SKU VM in the East US region. To view the list of supported SKUs by region, use the [az vm list-skus](/cli/azure/vm#az-vm-list-skus) command.

## Create virtual machine

Create a virtual machine (VM) with the [az vm create](/cli/azure/vm) command. 

The following example creates a VM named **vmoracle19c**. It also creates SSH keys, if they don't already exist in a default key location. To use a specific set of keys, you can use the `--ssh-key-value` option with the command.  

```azurecli-interactive 
az vm create \
    --name vmoracle19c \
    --resource-group rg-oracle \
    --image Oracle:oracle-database-19-3:oracle-database-19-0904:latest \
    --size Standard_DS2_v2 \
    --admin-username azureuser \
    --generate-ssh-keys \
    --public-ip-address-allocation static \
    --public-ip-address-dns-name vmoracle19c
```

After you create the VM, Azure CLI displays information similar to the following example. Note the value for the `publicIpAddress` property. You use this IP address to access the VM.

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

## Create disk for Oracle data files

Create and attach a new disk for Oracle data files and a fast recovery area (FRA) with the [az vm disk attach](/cli/azure/vm/disk#az-vm-disk-attach) command. 

The following example creates a disk named **oradata01**.

```azurecli-interactive
az vm disk attach \
    --name oradata01 --new \
    --resource-group rg-oracle \
    --size-gb 64 --sku StandardSSD_LRS \
    --vm-name vmoracle19c

```

## Open ports for connectivity

In this task, you must configure some external endpoints for the database listener to use by setting up the Azure network security group (NSG) that protects the VM. 

1. Create the NSG for the VM with the [az network nsg create](/cli/azure/network/nsg#az-network-nsg-create) command. This command creates the **vmoracle19cNSG** NSG for rules to control access to the VM:

   ```azurecli-interactive
   az network nsg create --resource-group rg-oracle --name vmoracle19cNSG
   ```

1. Create an NSG rule with the [az network nsg rule create](/cli/azure/network/nsg/rule#az-network-nsg-rule-create) command. This command creates the **allow-oracle** NSG rule to open the endpoint for remote access to the Oracle database:

   ```azurecli-interactive
   az network nsg rule create \
       --resource-group rg-oracle \
       --nsg-name vmoracle19cNSG \
       --name allow-oracle \
       --protocol tcp \
       --priority 1001 \
       --destination-port-range 1521
   ```

1. Create a second NSG rule to open the endpoint for remote access to Oracle. This command creates the **allow-oracle-EM** NSG rule:

   ```azurecli-interactive
   az network nsg rule create \
       --resource-group rg-oracle \
       --nsg-name vmoracle19cNSG \
       --name allow-oracle-EM \
       --protocol tcp \
       --priority 1002 \
       --destination-port-range 5502
   ```

1. As needed, use the [az network public-ip show](/cli/azure/network/public-ip#az-network-public-ip-show) command to get the public IP address of your VM:

   ```azurecli-interactive
   az network public-ip show \
       --resource-group rg-oracle \
       --name vmoracle19cPublicIP \
       --query "ipAddress" \
       --output tsv
   ```

## Prepare VM environment

1. Create an SSH session with the VM. Replace the `<publicIPAddress>` portion with the public IP address value for your VM, such as `10.200.300.4`:

   ```bash
   ssh azureuser@<publicIPAddress>
   ```

1. Switch to the root user:

   ```bash
   sudo su -
   ```

1. Locate the most recently created disk device that you want to format to hold Oracle data files:

   ```bash
   ls -alt /dev/sd*|head -1
   ```

   The output is similar to this example:

   ```output
   brw-rw----. 1 root disk 8, 16 Dec  8 22:57 /dev/sdc
   ```

1. As the root user, use the `parted` command to format the device.
   
   1. First, create a disk label:
   
      ```bash
      parted /dev/sdc mklabel gpt
      ```

   1. Next, create a primary partition that spans the entire disk:

      ```bash
      parted -a optimal /dev/sdc mkpart primary 0GB 64GB	
      ```

   1. Finally, check the device details by printing its metadata:

      ```bash
      parted /dev/sdc print
      ```

      The output is similar to this example:
   
      ```bash
      Model: Msft Virtual Disk (scsi)
      Disk /dev/sdc: 68.7GB
      Sector size (logical/physical): 512B/4096B
      Partition Table: gpt
      Disk Flags:
      Number   Start    End      Size     File system   Name     Flags
      1        1049kB   64.0GB   64.0GB   ext4          primary
      ```

1. Create a filesystem on the device partition:

   ```bash
   mkfs -t ext4 /dev/sdc1
   ```

   The output is similar to this example:
   
   ```bash
   mke2fs 1.42.9 (28-Dec-2013)
   Discarding device blocks: done                            
   Filesystem label=
   OS type: Linux
   Block size=4096 (log=2)
   Fragment size=4096 (log=2)
   Stride=0 blocks, Stripe width=0 blocks
   3907584 inodes, 15624704 blocks
   781235 blocks (5.00%) reserved for the super user
   First data block=0
   Maximum filesystem blocks=2164260864
   477 block groups
   32768 blocks per group, 32768 fragments per group
   8192 inodes per group
   Superblock backups stored on blocks: 
        32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208, 
        4096000, 7962624, 11239424
    Allocating group tables: done                            
    Writing inode tables: done                            
    Creating journal (32768 blocks): done
    Writing superblocks and filesystem accounting information: done   
    ```

1. Create a mount point:

   ```bash
   mkdir /u02
   ```

1. Mount the disk:

   ```bash
   mount /dev/sdc1 /u02
   ```

1. Change permissions on the mount point:

   ```bash
   chmod 777 /u02
   ```

1. Add the mount to the **/etc/fstab** file: 

   ```bash
   echo "/dev/sdc1               /u02                    ext4    defaults        0 0" >> /etc/fstab
   ```
   
   > [!Important]
   > This command mounts the /etc/fstab file without a specific UUID, which can prevent successful reboot of the disk. Before you attempt to reboot the disk, update the /etc/fstab entry to include a UUID for the mount point.

1. Update the **/etc/hosts** file with the public IP address and address hostname. Change the `<Public IP>` and two `<VMname>` portions to reflect your actual values:
  
   ```bash
   echo "<Public IP> <VMname>.eastus.cloudapp.azure.com <VMname>" >> /etc/hosts
   ```

1. Add the domain name of the VM to the **/etc/hostname** file. The following command assumes the resource group and VM are created in the **eastus** region:
    
   ```bash
   sed -i 's/$/\.eastus\.cloudapp\.azure\.com &/' /etc/hostname
   ```

1. Open firewall ports.
    
   Because SELinux is enabled by default on the Marketplace image, we need to open the firewall to traffic for the database listening port 1521, and Enterprise Manager Express port 5502. Run the following commands as root user:

   ```bash
   firewall-cmd --zone=public --add-port=1521/tcp --permanent
   firewall-cmd --zone=public --add-port=5502/tcp --permanent
   firewall-cmd --reload
   ```

## Create the database

The Oracle software is already installed on the Marketplace image. Create a sample database as follows. 

1. Switch to the **oracle** user:

   ```bash
   sudo su - oracle
   ```

1. Start the database listener:

   ```bash
   lsnrctl start
   ```
   
   The output is similar to the following example:
  
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

1. Create a data directory for the Oracle data files:

   ```bash
   mkdir /u02/oradata
   ```

1. Run the Database Creation Assistant:

   ```bash
   dbca -silent \
       -createDatabase \
       -templateName General_Purpose.dbc \
       -gdbname oratest1 \
       -sid oratest1 \
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

   The output is similar to the following example:

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
       Database creation complete. For details check the logfiles at: /u01/app/oracle/cfgtoollogs/dbca/oratest1.
       Database Information:
       Global Database Name:oratest1
       System Identifier(SID):oratest1
       Look at the log file "/u01/app/oracle/cfgtoollogs/dbca/oratest1/oratest1.log" for further details.
   ```

1. Set Oracle variables:

   Before you connect, you need to set the environment variable `ORACLE_SID`:

   ```bash
   export ORACLE_SID=oratest1
   ```

   You should also add the `ORACLE_SID` variable to the `oracle` users **.bashrc** file for future sign-ins by using the following command:

   ```bash
   echo "export ORACLE_SID=oratest1" >> ~oracle/.bashrc
   ```

## Automate database startup and shutdown

The Oracle database by default doesn't automatically start when you restart the VM. To set up the Oracle database to start automatically, first sign in as root. Then, create and update some system files.

1. Sign on as the root user:

   ```bash
   sudo su -
   ```

1. Change the automated startup flag from `N` to `Y` in the /etc/oratab file:

   ```bash
   sed -i 's/:N/:Y/' /etc/oratab
   ```

1. Create a file named **/etc/init.d/dbora** and add the following bash command to the file:

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

1. Change permissions on files with the `chmod` command:

   ```bash
   chgrp dba /etc/init.d/dbora
   chmod 750 /etc/init.d/dbora
   ```

1. Create symbolic links for startup and shutdown:

   ```bash
   ln -s /etc/init.d/dbora /etc/rc.d/rc0.d/K01dbora
   ln -s /etc/init.d/dbora /etc/rc.d/rc3.d/S99dbora
   ln -s /etc/init.d/dbora /etc/rc.d/rc5.d/S99dbora
   ```

1. To test your changes, restart the VM:

   ```bash
   reboot
   ```

## Clean up resources

After you finish exploring your first Oracle database on Azure and the VM is no longer needed, you can use the [az group delete](/cli/azure/group) command to remove the resource group, VM, and all related resources.

```azurecli-interactive
az group delete --name rg-oracle
```

## Next steps

- Protect your database in Azure with [Oracle backup strategies](/azure/virtual-machines/workloads/oracle/oracle-database-backup-strategies)
- Explore [Oracle solutions on Azure](/azure/virtual-machines/workloads/oracle/oracle-overview) 
- [Install and configure Oracle Automated Storage Management](/azure/virtual-machines/workloads/oracle/configure-oracle-asm)
