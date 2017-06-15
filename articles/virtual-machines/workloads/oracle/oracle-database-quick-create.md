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
az vm create --resource-group myResourceGroup \
    --name myVM \
    --image Oracle:Oracle-Database-Ee:12.1.0.2:latest \
    --size Standard_DS2_v2 \
    --generate-ssh-keys
```

After you create the VM, Azure CLI displays information similar to the following example. Note the value for `publicIpAddress`. You use this address to access the VM.

```azurecli
{
  "fqdns": "",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
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
ssh <publicIpAddress>
```

## Create the database

The Oracle software is already installed on the Marketplace image. Next, install the database. 

1.  Run the *oracle* superuser, and then initialize the listener for logging:

    ```bash
    sudo su - oracle
    [oracle@myVM /]$ lsnrctl start
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
    [oracle@myVM /]$ dbca -silent \
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

    Copying database files
    1% complete
    2% complete
    8% complete
    13% complete
    19% complete
    27% complete
    Creating and starting Oracle instance
    29% complete
    32% complete
    33% complete
    34% complete
    38% complete
    42% complete
    43% complete
    45% complete
    Completing Database Creation
    48% complete
    51% complete
    53% complete
    62% complete
    70% complete
    72% complete
    Creating Pluggable Databases
    78% complete
    100% complete
    Look at the log file "/u01/app/oracle/cfgtoollogs/dbca/cdb1/cdb1.log" for further details.
    ```

## Prepare for connectivity 
To make sure that the database initialized correctly, test for local connectivity. The easiest way to do this is to connect with `sqlplus`.  

Before you connect, you need to set two environment variables: ORACLE_HOME and ORACLE_SID.

```bash
ORACLE_HOME=/u01/app/oracle/product/12.1.0/dbhome_1; export ORACLE_HOME

ORACLE_SID=cdb1; export ORACLE_SID
```

You also can add ORACLE_HOME and ORACLE_SID to the .bashrc file. This saves the environment variables for future sign-ins.

```
# Add ORACLE_HOME.
export ORACLE_HOME=/u01/app/oracle/product/12.1.0/dbhome_1

# Add ORACLE_SID.
export ORACLE_SID=cdb1

```

## Oracle EM Express connectivity

For a GUI management tool that you can use to explore the database, set up Oracle EM Express. To connect to Oracle EM Express, you must first set up the port in Oracle:

```bash
$ sudo su - oracle

sqlplus / as sysdba

SQL*Plus: Release 12.1.0.2.0 Production on Fri Apr 7 13:16:30 2017

Copyright (c) 1982, 2014, Oracle.  All rights reserved.


Connected to:
Oracle Database 12c Enterprise Edition Release 12.1.0.2.0 - 64bit Production
With the Partitioning, OLAP, Advanced Analytics and Real Application Testing options

SQL> exec DBMS_XDB_CONFIG.SETHTTPSPORT(5502);

PL/SQL procedure successfully completed.
```
Open the container PDB1 if not already opened.

```bash
SQL> select con_id, name, open_mode from v$pdbs;

    CON_ID NAME                           OPEN_MODE
---------- ------------------------------ ----------
         2 PDB$SEED                       READ ONLY
         3 PDB1                           MOUNT

SQL> alter session set container=pdb1;

Session altered.

SQL> alter database open;

database opened.
```

## Automate database startup and shutdown

The Oracle database by default doesn't automatically start when you start the VM. To set up the Oracle database to start when you start the VM, first sign in as root. Then, create and update some system files.

1.  Sign in as root:

    ```bash
    # sudo su -
    ```

2.  Change the /etc/oratab file from the default `N` to `Y`:

    ```
    cdb1:/u01/app/oracle/product/12.1.0/dbhome_1:Y
    ```

3.  Create the /etc/init.d/dbora file:

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

4.  Change permissions:

    ```bash
    # chgrp dba /etc/init.d/dbora
    # chmod 750 /etc/init.d/dbora
    ```

5.  Create symbolic links for startup and shutdown:

    ```bash
    # ln -s /etc/init.d/dbora /etc/rc.d/rc0.d/K01dbora
    # ln -s /etc/init.d/dbora /etc/rc.d/rc3.d/S99dbora
    # ln -s /etc/init.d/dbora /etc/rc.d/rc5.d/S99dbora
    ```

6.  To test your changes, restart the VM:

    ```bash
    # reboot
    ```

## Open ports for connectivity

The final task is to configure some external endpoints. To set up the Azure Network Security Group that protects the VM, first exit your SSH session in the VM. 

1.  To open the endpoint that you use to access the Oracle database remotely, run the following command: 

    ```azurecli
    az network nsg rule create --resource-group myResourceGroup\
        --nsg-name myVmNSG --name allow-oracle\
        --protocol tcp --direction inbound --priority 999 \
        --source-address-prefix '*' --source-port-range '*' \
        --destination-address-prefix '*' --destination-port-range 1521 --access allow
    ```

    The result should look similar to this example:

    ```
    {
    "access": "Allow",
    "description": null,
    "destinationAddressPrefix": "*",
    "destinationPortRange": "1521",
    "direction": "Inbound",
    "etag": "W/\"bd77dcae-e5fd-4bd6-a632-26045b646414\"",
    "id": "/subscriptions/<subscription-id>/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/myVmNSG/securityRules/allow-oracle",
    "name": "allow-oracle",
    "priority": 999,
    "protocol": "Tcp",
    "provisioningState": "Succeeded",
    "resourceGroup": "myResourceGroup",
    "sourceAddressPrefix": "*",
    "sourcePortRange": "*"
    }
    ```

2.  To open the endpoint that you use to access Oracle EM Express remotely, run the following command:

    ```azurecli
    az network nsg rule create --resource-group myResourceGroup\
        --nsg-name myVmNSG --name allow-oracle-EM\
        --protocol tcp --direction inbound --priority 1001 \
        --source-address-prefix '*' --source-port-range '*' \
        --destination-address-prefix '*' --destination-port-range 5502 --access allow
    ```

    The result should look similar to this example:

    ```azurecli
    {
    "access": "Allow",
    "description": null,
    "destinationAddressPrefix": "*",
    "destinationPortRange": "5502",
    "direction": "Inbound",
    "etag": "W/\"06c68b5e-1b3f-4ae0-bcf6-59b3b981d685\"",
    "id": "/subscriptions/2dad32d6-b188-49e6-9437-ca1d51cec4dd/resourceGroups/kennyRG/providers/Microsoft.Network/networkSecurityGroups/kennyVM1NSG/securityRules/allow-oracle-EM",
    "name": "allow-oracle-EM",
    "priority": 1001,
    "protocol": "Tcp",
    "provisioningState": "Succeeded",
    "resourceGroup": "myResourceGroup",
    "sourceAddressPrefix": "*",
    "sourcePortRange": "*"
    }
    ```

3.  Connect EM Express from your browser: 

    ```
    https://<VM ip address or hostname>:5502/em
    ```

You can log in by using the SYS account, check the 'as sysdba' checkbox. Use the password 'OraPasswd1' that you set during installation.

![Screenshot of the Oracle OEM Express login page](./media/oracle-quick-start/oracle_oem_express_login.png)

## Delete the VM

When you no longer need the VM, you can use the following command to remove the resource group, VM, and all related resources:

```azurecli
az group delete --name myResourceGroup
```

## Next steps

[Tutorial: Create highly available VMs](../../linux/create-cli-complete.md)

[Explore VM deployment Azure CLI samples](../../linux/cli-samples.md)
