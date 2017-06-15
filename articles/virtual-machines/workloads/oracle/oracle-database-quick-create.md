---
title: Create an Oracle Database 12c database in an Azure virtual machine | Microsoft Docs
description: Quickly get an Oracle Database 12c database up and running in your Azure environment.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: tonyguid
manager: timlt
editor: 
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 04/26/2017
ms.author: rclaus
---

# Create an Oracle Database 12c database in an Azure virtual machine

You can use Azure CLI to create and manage Azure resources at a command prompt or in scripts. In this article, we use scripts in Azure CLI to deploy an Oracle Database 12c database from an Azure Marketplace gallery image.

Before you begin, make sure that Azure CLI is installed. For more information, see [the Azure CLI installation guide](https://docs.microsoft.com/cli/azure/install-azure-cli). 

## Sign in to Azure 

In Azure CLI, to sign in to your Azure subscription, use the [az login](/cli/azure/#login) command. Then, follow the on-screen instructions.

```azurecli
az login
```

## Create a resource group

To create a resource group, use the [az group create](/cli/azure/group#create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named `myResourceGroup` in the `westus` location:

```azurecli
az group create --name myResourceGroup --location westus
```

## Create a VM

To create a virtual machine (VM), use the [az vm create](/cli/azure/vm#create) command. 

The following example creates a VM named `myVM`. It also creates SSH keys, if they do not already exist in a default key location. To use a specific set of keys, use the `--ssh-key-value` option.  

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --image Oracle:Oracle-Database-Ee:12.1.0.2:latest \
    --size Standard_DS2_v2 \
    --admin-username azureuser \
    --generate-ssh-keys
```

After you create the VM, Azure CLI displays information similar to the following example. Note the value for `publicIpAddress`. You use this address to access the VM.

```azurecli
{
  "fqdns": "",
  "id": "/subscriptions/{snip}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
  "location": "westus",
  "macAddress": "00-0D-3A-36-2F-56",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "13.64.104.241",
  "resourceGroup": "myResourceGroup"
}
```

## Connect to the VM

To create an SSH session with the VM, use the following command. Replace the IP address with the `publicIpAddress` value for your VM.

```bash 
ssh azureuser@<publicIpAddress>
```

## Create the database

The Oracle software is already installed on the Marketplace image. Create a sample database as follows. 

1.  Switch to the *oracle* superuser, then initialize the listener for logging:

    ```bash
    sudo su - oracle
    lsnrctl start
    ```

    The output is similar to the following:

    ```bash
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

2.  Create the database:

    ```bash
    dbca -silent \
        -createDatabase \
        -templateName General_Purpose.dbc \
        -gdbname cdb1 \
        -sid cdb1 \
        -responseFile NO_VALUE \
        -characterSet AL32UTF8 \
        -sysPassword OraPasswd1 \
        -systemPassword OraPasswd1 \
        -createAsContainerDatabase true \
        -numberOfPDBs 1 \
        -pdbName pdb1 \
        -pdbAdminPassword OraPasswd1 \
        -databaseType MULTIPURPOSE \
        -automaticMemoryManagement false \
        -storageType FS \
        -ignorePreReqs
    ```

    It takes a few minutes to create the database.

## Prepare for connectivity 
To make sure that the database initialized correctly, test for local connectivity. **Wait, is this step the first of the next H2? That's then to set up ports for something else to connect in, not to test the database is initialized correctly?** The easiest way to do this is to connect with `sqlplus`.  

Before you connect, you need to set two environment variables: *ORACLE_HOME* and *ORACLE_SID*.

```bash
ORACLE_HOME=/u01/app/oracle/product/12.1.0/dbhome_1; export ORACLE_HOME
ORACLE_SID=cdb1; export ORACLE_SID
```

## Oracle EM Express connectivity

For a GUI management tool that you can use to explore the database, set up Oracle EM Express. To connect to Oracle EM Express, you must first set up the port in Oracle. 

1. Connect to your database as follows:

    ```bash
    sqlplus / as sysdba
    ```

2. Once connected, set up the port in Oracle:

    ```bash
    exec DBMS_XDB_CONFIG.SETHTTPSPORT(5502);
    ```

3. Open the container PDB1 if not already opened:

    ```bash
    select con_id, name, open_mode from v$pdbs;
    ```

4. No idea here:

    ```bash
    alter session set container=pdb1;
    ```

5. Whatever this is:

    ```bash
    alter database open;
    ```

6. Now exit I guess:

    ```bash
    exit
    ```

7. Exit the *oracle* user session:

    ```bash
    logout
    ```

## Automate database startup and shutdown

The Oracle database by default doesn't automatically start when you start the VM. To set up the Oracle database to start when you start the VM, first sign in as root. Then, create and update some system files.

1.  Edit the file */etc/oratab* and change the default `N` to `Y`:

    ```bash
    cdb1:/u01/app/oracle/product/12.1.0/dbhome_1:Y
    ```

2.  Create a file named */etc/init.d/dbora* and paste the following contents:

    ```bash
    #!/bin/sh
    # chkconfig: 345 99 10
    # Description: Oracle auto start-stop script.
    #
    # Set ORA_HOME to be equivalent to $ORACLE_HOME.
    ORA_HOME=/u01/app/oracle/product/12.1.0/dbhome_1
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

3.  Change permissions on files with *chmod* as follows:

    ```bash
    sudo chgrp dba /etc/init.d/dbora
    sudo chmod 750 /etc/init.d/dbora
    ```

4.  Create symbolic links for startup and shutdown as follows:

    ```bash
    sudo ln -s /etc/init.d/dbora /etc/rc.d/rc0.d/K01dbora
    sudo ln -s /etc/init.d/dbora /etc/rc.d/rc3.d/S99dbora
    sudo ln -s /etc/init.d/dbora /etc/rc.d/rc5.d/S99dbora
    ```

5.  To test your changes, restart the VM (Really? Reboot?):

    ```bash
    sudo reboot
    ```

## Open ports for connectivity

The final task is to configure some external endpoints. To set up the Azure Network Security Group that protects the VM, first exit your SSH session in the VM (should have been kicked out of SSH when rebooting in previous step). 

1.  To open the endpoint that you use to access the Oracle database remotely, create a Network Security Group rule with [az network nsg rule create](/cli/azure/network/nsg/rule#create) as follows: 

    ```azurecli
    az network nsg rule create \
        --resource-group myResourceGroup\
        --nsg-name myVmNSG \
        --name allow-oracle \
        --protocol tcp \
        --priority 1001 \
        --destination-port-range 1521
    ```

2.  To open the endpoint that you use to access Oracle EM Express remotely, create a Network Security Group rule with [az network nsg rule create](/cli/azure/network/nsg/rule#create) as follows:

    ```azurecli
    az network nsg rule create \
        --resource-group myResourceGroup \
        --nsg-name myVmNSG \
        --name allow-oracle-EM \
        --protocol tcp \
        --priority 1002 \
        --destination-port-range 5502
    ```

3. If needed, obtain the public IP address of your VM again with [az network public-ip show](/cli/azure/network/public-ip#show) as follows:

    ```azurecli
    az network public-ip show \
        --resource-group myResourceGroup \
        --name myVMPublicIP \
        --query [ipAddress] \
        --output tsv
    ```

3.  Connect EM Express from your browser: 

    ```
    https://<VM ip address or hostname>:5502/em
    ```

You can log in by using the *SYS* account, and check the *as sysdba* checkbox. Use the password *OraPasswd1* that you set during installation. **Dude, this requires Flash... But, it does work and I could log in with IE (the only browser that didn't have Flash disabled...)**

![Screenshot of the Oracle OEM Express login page](./media/oracle-quick-start/oracle_oem_express_login.png)

## Delete the VM

When you no longer need the VM, you can use the following command to remove the resource group, VM, and all related resources:

```azurecli
az group delete --name myResourceGroup
```

## Next steps
This should point to actual Oracle docs...

[Tutorial: Create highly available VMs](../../linux/create-cli-complete.md)

[Explore VM deployment Azure CLI samples](../../linux/cli-samples.md)
