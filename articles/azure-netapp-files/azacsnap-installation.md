---
title: Install the Azure Application Consistent Snapshot tool for Azure NetApp Files
description: Learn how to install the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: Phil-Jensen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 08/21/2023
ms.author: phjensen
---

# Install the Azure Application Consistent Snapshot tool

This article provides a guide for installation of the Azure Application Consistent Snapshot tool (AzAcSnap) that you can use with Azure NetApp Files or Azure Large Instances.

> [!IMPORTANT]
> Distributed installations are the only option for Azure Large Instances systems, because they're deployed in a private network. You must install AzAcSnap on each system to ensure connectivity.

The downloadable self-installer makes the snapshot tools easy to set up and run with non-root user privileges (for example, `azacsnap`). The installer sets up the user and puts the snapshot tools into the user's `$HOME/bin` subdirectory. The default is `/home/azacsnap/bin`.

The self-installer tries to determine the correct settings and paths for all the files based on the configuration of the user who's performing the installation (for example, root). If the prerequisite steps to enable communication with storage and SAP HANA are run as root, the installation copies the private key and `hdbuserstore` to the backup user's location. A knowledgeable administrator can manually take the steps to enable communication with the storage back end and SAP HANA after the installation.

## Prerequisites for installation

Follow the guidelines to set up and run the snapshots and disaster-recovery commands. We recommend that you complete the following steps as root before you install and use the snapshot tools:

1. Patch the operating system and set up SUSE Subscription Management Tool (SMT). For more information, see [Install and configure SAP HANA (Large Instances) on Azure](../virtual-machines/workloads/sap/hana-installation.md#operating-system).
1. Set up time synchronization. Provide a time server that's compatible with the Network Time Protocol (NTP), and configure the operating system accordingly.
1. Install the database. Follow the instructions for the supported database that you're using.
1. Select the storage back end that you're using for your deployment. For more information, see [Enable communication with storage](#enable-communication-with-storage) later in this article.

    # [Azure NetApp Files](#tab/azure-netapp-files)

    Either set up a system-managed identity or generate the service principal's authentication file.

    When you're validating communication with Azure NetApp Files, communication might fail or time out. Check that firewall rules aren't blocking outbound traffic from the system running AzAcSnap to the following addresses and TCP/IP ports:

    - (https://)management.azure.com:443
    - (https://)login.microsoftonline.com:443

    # [Azure Large Instances (bare metal)](#tab/azure-large-instance)

    Generate a Secure Shell (SSH) private/public key pair. For each node where you'll run the snapshot tools, provide the generated public key to Microsoft Operations so it can install on the storage back end.

    Test connectivity by using SSH to connect to one of the nodes (for example, `ssh -l <Storage Username> <Storage IP Address>`). Enter `exit` to log out of the storage prompt.

    Microsoft Operations provides the storage username and storage IP address at the time of provisioning.

    ---

1. Enable communication with the database. For more information, see [Enable communication with the database](#enable-communication-with-the-database) later in this article.

    # [SAP HANA](#tab/sap-hana)

    Set up an appropriate SAP HANA user by following the instructions in the [Enable communication with the database](#enable-communication-with-the-database) section of this article.

    After setup, you can test the connection from the command line by using the following examples. The following examples are for non-SSL communication to SAP HANA.

    HANA 1.0:

    `hdbsql -n <HANA IP address> -i <HANA instance> -U <HANA user> "\s"`

    HANA 2.0:

    `hdbsql -n <HANA IP address> -i <HANA instance> -d SYSTEMDB -U <HANA user> "\s"`

    # [Oracle](#tab/oracle)

    Set up an appropriate Oracle database and Oracle wallet by following the instructions in the [Enable communication with the database](#enable-communication-with-the-database) section of this article.

    After setup, you can test the connection from the command line by using the following example:

    `sqlplus /@<ORACLE_USER> as SYSBACKUP`

    # [IBM Db2](#tab/db2)

    Set up an appropriate IBM Db2 connection method by following the instructions in the [Enable communication with the database](#enable-communication-with-the-database) section of this article.

    After setup, test the connection from the command line by using the following examples:

    - Install onto the database server, and then complete the setup with [Db2 local connectivity](#db2-local-connectivity):

      `db2 "QUIT"`

    - Install onto a centralized backup system, and then complete the setup with [Db2 remote connectivity](#db2-remote-connectivity):

      `ssh <InstanceUser>@<ServerAddress> 'db2 "QUIT"'`

    The preceding commands should produce the following output:

    ```output
    DB20000I  The QUIT command completed successfully.
    ```

    ---

## Enable communication with storage

This section explains how to enable communication with storage. Use the following tabs to correctly select the storage back end that you're using.

# [Azure NetApp Files (with virtual machine)](#tab/azure-netapp-files)

There are two ways to authenticate to the Azure Resource Manager using either a system-managed identity or a service principal file.  The options are described here.

### Azure system-managed identity

From AzAcSnap 9, it's possible to use a system-managed identity instead of a service principal for operation. Using this feature avoids the need to store service principal credentials on a virtual machine (VM). To set up an Azure managed identity by using Azure Cloud Shell, follow these steps:

1. Within a Cloud Shell session with Bash, use the following example to set the shell variables appropriately and apply them to the subscription where you want to create the Azure managed identity. Set `SUBSCRIPTION`, `VM_NAME`, and `RESOURCE_GROUP` to your site-specific values.

   ```azurecli-interactive
   export SUBSCRIPTION="99z999zz-99z9-99zz-99zz-9z9zz999zz99"
   export VM_NAME="MyVM"
   export RESOURCE_GROUP="MyResourceGroup"
   export ROLE="Contributor"
   export SCOPE="/subscriptions/${SUBSCRIPTION}/resourceGroups/${RESOURCE_GROUP}"
   ```

1. Set Cloud Shell to the correct subscription:

   ```azurecli-interactive
   az account set -s "${SUBSCRIPTION}"
   ```

1. Create the managed identity for the virtual machine. The following command sets (or shows if it's already set) the AzAcSnap VM's managed identity:

   ```azurecli-interactive
   az vm identity assign --name "${VM_NAME}" --resource-group "${RESOURCE_GROUP}"
   ```

1. Get the principal ID for assigning a role:

   ```azurecli-interactive
   PRINCIPAL_ID=$(az resource list -n ${VM_NAME} --query [*].identity.principalId --out tsv)
   ```

1. Assign the Contributor role to the principal ID:

   ```azurecli-interactive
   az role assignment create --assignee "${PRINCIPAL_ID}" --role "${ROLE}" --scope "${SCOPE}"
   ```

#### Optional RBAC

It's possible to limit the permissions for the managed identity by using a custom role definition in role-based access control (RBAC). Create a suitable role definition for the virtual machine to be able to manage snapshots. You can find example permissions settings in [Tips and tricks for using the Azure Application Consistent Snapshot tool](azacsnap-tips.md).

Then assign the role to the Azure VM principal ID (also displayed as `SystemAssignedIdentity`):

```azurecli-interactive
az role assignment create --assignee ${PRINCIPAL_ID} --role "AzAcSnap on ANF" --scope "${SCOPE}"
```

### Generate a service principal file

1. In a Cloud Shell session, make sure you're logged on at the subscription where you want to be associated with the service principal by default:

    ```azurecli-interactive
    az account show
    ```

1. If the subscription isn't correct, use the `az account set` command:

    ```azurecli-interactive
    az account set -s <subscription name or id>
    ```

1. Create a service principal by using the Azure CLI, as shown in this example:

    ```azurecli-interactive
    az ad sp create-for-rbac --name "AzAcSnap" --role Contributor --scopes /subscriptions/{subscription-id} --sdk-auth
    ```

    The command should generate output like this example:

    ```output
    {
      "clientId": "00aa000a-aaaa-0000-00a0-00aa000aaa0a",
      "clientSecret": "00aa000a-aaaa-0000-00a0-00aa000aaa0a",
      "subscriptionId": "00aa000a-aaaa-0000-00a0-00aa000aaa0a",
      "tenantId": "00aa000a-aaaa-0000-00a0-00aa000aaa0a",
      "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
      "resourceManagerEndpointUrl": "https://management.azure.com/",
      "activeDirectoryGraphResourceId": "https://graph.windows.net/",
      "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
      "galleryEndpointUrl": "https://gallery.azure.com/",
      "managementEndpointUrl": "https://management.core.windows.net/"
    }
    ```

    This command automatically assigns the RBAC Contributor role to the service principal at the subscription level. You can narrow down the scope to the specific resource group where your tests will create the resources.

1. Cut and paste the output content into a file called `azureauth.json` that's stored on the same system as the `azacsnap` command. Secure the file with appropriate system permissions.

   Make sure the format of the JSON file is exactly as described in the previous step, with the URLs enclosed in double quotation marks (").

# [Azure Large Instances (bare metal)](#tab/azure-large-instance)

Communication with the storage back end occurs over an encrypted SSH channel. The following example steps provide guidance on setup of SSH for this communication:

1. Modify the `/etc/ssh/ssh_config` file.

    Refer to the following output, which includes the `MACs hmac-sha` line:

    ```output
    # RhostsRSAAuthentication no
    # RSAAuthentication yes
    # PasswordAuthentication yes
    # HostbasedAuthentication no
    # GSSAPIAuthentication no
    # GSSAPIDelegateCredentials no
    # GSSAPIKeyExchange no
    # GSSAPITrustDNS no
    # BatchMode no
    # CheckHostIP yes
    # AddressFamily any
    # ConnectTimeout 0
    # StrictHostKeyChecking ask
    # IdentityFile ~/.ssh/identity
    # IdentityFile ~/.ssh/id_rsa
    # IdentityFile ~/.ssh/id_dsa
    # Port 22
    Protocol 2
    # Cipher 3des
    # Ciphers aes128-ctr,aes192-ctr,aes256-ctr,arcfour256,arcfour128,aes128-cbc,3des-
    cbc
    # MACs hmac-md5,hmac-sha1,umac-64@openssh.com,hmac-ripemd
    MACs hmac-sha
    # EscapeChar ~
    # Tunnel no
    # TunnelDevice any:any
    # PermitLocalCommand no
    # VisualHostKey no
    # ProxyCommand ssh -q -W %h:%p gateway.example.com
    ```

1. Use the following example command to generate a private/public key pair. Don't enter a password when you're generating a key.

    ```bash
    ssh-keygen -t rsa –b 5120 -C ""
    ```

1. The output of the `cat /root/.ssh/id_rsa.pub` command is the public key. Send it to Microsoft Operations, so that the snapshot tools can communicate with the storage subsystem.

    ```bash
    cat /root/.ssh/id_rsa.pub
    ```

    ```output
    ssh-rsa
    AAAAB3NzaC1yc2EAAAADAQABAAABAQDoaRCgwn1Ll31NyDZy0UsOCKcc9nu2qdAPHdCzleiTWISvPW
    FzIFxz8iOaxpeTshH7GRonGs9HNtRkkz6mpK7pCGNJdxS4wJC9MZdXNt+JhuT23NajrTEnt1jXiVFH
    bh3jD7LjJGMb4GNvqeiBExyBDA2pXdlednOaE4dtiZ1N03Bc/J4TNuNhhQbdsIWZsqKt9OPUuTfD
    j0XvwUTLQbR4peGNfN1/cefcLxDlAgI+TmKdfgnLXIsSfbacXoTbqyBRwCi7p+bJnJD07zSc9YCZJa
    wKGAIilSg7s6Bq/2lAPDN1TqwIF8wQhAg2C7yeZHyE/ckaw/eQYuJtN+RNBD
    ```



---

## Enable communication with the database

This section explains how to enable communication with the database. Use the following tabs to correctly select the database that you're using.

# [SAP HANA](#tab/sap-hana)

If you're deploying to a centralized virtual machine, you need to install and set up the SAP HANA client so that the AzAcSnap user can run `hdbsql` and `hdbuserstore` commands. You can download the SAP HANA client from the [SAP Development Tools website](https://tools.hana.ondemand.com/#hanatools).

The snapshot tools communicate with SAP HANA and need a user with appropriate permissions to initiate and release the database save point. The following example shows the setup of the SAP HANA 2.0 user and `hdbuserstore` for communication to the SAP HANA database.

The following example commands set up a user (`AZACSNAP`) in SYSTEMDB on an SAP HANA 2.0 database. Change the IP address, usernames, and passwords as appropriate.

1. Connect to SYSTEMDB:

    ```bash
    hdbsql -n <IP_address_of_host>:30013 -i 00 -u SYSTEM -p <SYSTEM_USER_PASSWORD>
    ```

    ```output
    Welcome to the SAP HANA Database interactive terminal.

    Type: \h for help with commands
    \q to quit

    hdbsql SYSTEMDB=>
    ```

1. Create the user. This example creates the `AZACSNAP` user in SYSTEMDB:

    ```sql
    hdbsql SYSTEMDB=> CREATE USER AZACSNAP PASSWORD <AZACSNAP_PASSWORD_CHANGE_ME> NO FORCE_FIRST_PASSWORD_CHANGE;
    ```

1. Grant the user permissions. This example sets the permission for the `AZACSNAP` user to allow for performing a database-consistent storage snapshot:

    - For SAP HANA releases up to version 2.0 SPS 03:

      ```sql
      hdbsql SYSTEMDB=> GRANT BACKUP ADMIN, CATALOG READ TO AZACSNAP;
      ```

    - For SAP HANA releases from version 2.0 SPS 04, SAP added new fine-grained privileges:

      ```sql
      hdbsql SYSTEMDB=> GRANT BACKUP ADMIN, DATABASE BACKUP ADMIN, CATALOG READ TO AZACSNAP;
      ```

1. *Optional*: Prevent the user's password from expiring.

    > [!NOTE]
    > Check with corporate policy before you make this change.

   The following example disables the password expiration for the `AZACSNAP` user. Without this change, the user's password could expire and prevent snapshots from being taken correctly.

   ```sql
   hdbsql SYSTEMDB=> ALTER USER AZACSNAP DISABLE PASSWORD LIFETIME;
   ```

1. Set up the SAP HANA Secure User Store (change the password). This example uses the `hdbuserstore` command from the Linux shell to set up the SAP HANA Secure User Store:

    ```bash
    hdbuserstore Set AZACSNAP <IP_address_of_host>:30013 AZACSNAP <AZACSNAP_PASSWORD_CHANGE_ME>
    ```

1. Check that you correctly set up the SAP HANA Secure User Store. Use the `hdbuserstore` command to list the output, similar to the following example. More details on using `hdbuserstore` are available on the SAP website.

    ```bash
    hdbuserstore List
    ```

    ```output
    DATA FILE : /home/azacsnap/.hdb/sapprdhdb80/SSFS_HDB.DAT
    KEY FILE : /home/azacsnap/.hdb/sapprdhdb80/SSFS_HDB.KEY

    KEY AZACSNAP
    ENV : <IP_address_of_host>:
    USER: AZACSNAP
    ```

### Using SSL for communication with SAP HANA

AzAcSnap uses SAP HANA's `hdbsql` command to communicate with SAP HANA. Using `hdbsql` allows the use of SSL options to encrypt communication with SAP HANA.

AzAcSnap always uses the following options when you're using the `azacsnap --ssl` option:

- `-e`: Enables TLS/SSL encryption. The server chooses the highest available.
- `-ssltrustcert`: Specifies whether to validate the server's certificate.
- `-sslhostnameincert "*"`: Specifies the host name that verifies the server's identity. When you specify `"*"` as the host name, the server's host name isn't validated.

SSL communication also requires key-store and trust-store files. It's possible for these files to be stored in default locations on a Linux installation. But to ensure that the correct key material is being used for the various SAP HANA systems (for the cases where different key-store and trust-store files are used for each SAP HANA system), AzAcSnap expects the key-store and trust-store files to be stored in the `securityPath` location. The AzAcSnap configuration file specifies this location.

#### Key-store files

If you're using multiple system identifiers (SIDs) with the same key material, it's easier to create links into the `securityPath` location as defined in the AzAcSnap configuration file. Ensure that these values exist for every SID that uses SSL.

- For `openssl`: `ln $HOME/.ssl/key.pem <securityPath>/<SID>_keystore`
- For `commoncrypto`: `ln $SECUDIR/sapcli.pse <securityPath>/<SID>_keystore`

If you're using multiple SIDs with different key material per SID, copy (or move and rename) the files into the `securityPath` location as defined in the SID's AzAcSnap configuration file.

- For `openssl`: `mv key.pem <securityPath>/<SID>_keystore`
- For `commoncrypto`: `mv sapcli.pse <securityPath>/<SID>_keystore`

When AzAcSnap calls `hdbsql`, it adds `-sslkeystore=<securityPath>/<SID>_keystore` to the `hdbsql` command line.

#### Trust-store files

If you're using multiple SIDs with the same key material, create hard links into the `securityPath` location as defined in the AzAcSnap configuration file. Ensure that these values exist for every SID that uses SSL.

- For `openssl`: `ln $HOME/.ssl/trust.pem <securityPath>/<SID>_truststore`
- For `commoncrypto`: `ln $SECUDIR/sapcli.pse <securityPath>/<SID>_truststore`

If you're using multiple SIDs with the different key material per SID, copy (or move and rename) the files into the `securityPath` location as defined in the SID's AzAcSnap configuration file.

- For `openssl`: `mv trust.pem <securityPath>/<SID>_truststore`
- For `commoncrypto`: `mv sapcli.pse <securityPath>/<SID>_truststore`

The `<SID>` component of the file names must be the SAP HANA system identifier in all uppercase (for example, `H80` or `PR1`). When AzAcSnap calls `hdbsql`, it adds `-ssltruststore=<securityPath>/<SID>_truststore` to the command line.

If you run `azacsnap -c test --test hana --ssl openssl`, where `SID` is `H80` in the configuration file, it executes the `hdbsql`connections as follows:

```bash
hdbsql \
    -e \
    -ssltrustcert \
    -sslhostnameincert "*" \
    -sslprovider openssl \
    -sslkeystore ./security/H80_keystore \
    -ssltruststore ./security/H80_truststore
    "sql statement"
```

In the preceding code, the backslash (`\`) character is a command-line line wrap to improve the clarity of the multiple parameters passed on the command line.

# [Oracle](#tab/oracle)

The snapshot tools communicate with the Oracle database and need a user with appropriate permissions to enable and disable backup mode.

After AzAcSnap puts the database in backup mode, AzAcSnap queries the Oracle database to get a list of files that have backup mode as active. This file list is sent into an external file. The external file is in the same location and basename as the log file, but with a `.protected-tables` file name extension. (The AzAcSnap log file details the output file name.)

The following example commands show the setup of the Oracle database user (`AZACSNAP`), the use of `mkstore` to create an Oracle wallet, and the `sqlplus` configuration files that are required for communication to the Oracle database. Change the IP address, usernames, and passwords as appropriate.

1. Connect to the Oracle database:

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

1. Create the user. This example creates the `azacsnap` user:

    ```sql
    SQL> CREATE USER azacsnap IDENTIFIED BY password;
    ```

    ```output
    User created.
    ```

1. Grant the user permissions. This example sets the permission for the `azacsnap` user to allow for putting the database in backup mode:

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

1. *Optional*: Prevent the user's password from expiring. Without this change, the user's password could expire and prevent snapshots from being taken correctly.

   > [!NOTE]
   > Check with corporate policy before you make this change.

   This example gets the password expiration for the `AZACSNAP` user:

   ```sql
   SQL> SELECT username,account_status,expiry_date,profile FROM dba_users WHERE username='AZACSNAP';
   ```

   ```output
   USERNAME              ACCOUNT_STATUS                 EXPIRY_DA PROFILE
   --------------------- ------------------------------ --------- ------------------------------
   AZACSNAP              OPEN                           DD-MMM-YY DEFAULT
   ```

   There are a few methods for disabling password expiration in the Oracle database. Contact your database administrator for guidance. One method is to modify the `DEFAULT` user's profile so that the password lifetime is unlimited:

   ```sql
   SQL> ALTER PROFILE default LIMIT PASSWORD_LIFE_TIME unlimited;
   ```

   After you make this change to the database setting, there should be no password expiration date for users who have the `DEFAULT` profile:

   ```sql
   SQL> SELECT username, account_status,expiry_date,profile FROM dba_users WHERE username='AZACSNAP';
   ```

   ```output
   USERNAME              ACCOUNT_STATUS                 EXPIRY_DA PROFILE
   --------------------- ------------------------------ --------- ------------------------------
   AZACSNAP              OPEN                                     DEFAULT
   ```

1. Set up the Oracle wallet (change the password).

   The Oracle wallet provides a method to manage database credentials across multiple domains. This capability uses a database connection string in the data-source definition, which is resolved with an entry in the wallet. When you use the Oracle wallet correctly, passwords in the data-source configuration are unnecessary.

   This setup makes it possible to use the Oracle Transparent Network Substrate (TNS) administrative file with a connection string alias, which hides details of the database connection string. If the connection information changes, it's a matter of changing the `tnsnames.ora` file instead of (potentially) many data-source definitions.

   Run the following commands on the Oracle database server. This example uses the `mkstore` command from the Linux shell to set up the Oracle wallet. These commands are run on the Oracle database server via unique user credentials to avoid any impact on the running database. This example creates a new user (`azacsnap`) and appropriately configures the environment variables.

   1. Get the Oracle environment variables to be used in setup. Run the following commands as the root user on the Oracle database server:

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

   1. Create the Linux user to generate the Oracle wallet and associated `*.ora` files by using the output from the previous step.

      These examples use the `bash` shell. If you're using a different shell (for example, `csh`), be sure to set environment variables correctly.

      ```bash
      useradd -m azacsnap
      echo "export ORACLE_SID=oratest1" >> /home/azacsnap/.bash_profile
      echo "export ORACLE_HOME=/u01/app/oracle/product/19.0.0/dbhome_1" >> /home/azacsnap/.bash_profile
      echo "export TNS_ADMIN=/home/azacsnap" >> /home/azacsnap/.bash_profile
      echo "export PATH=\$PATH:\$ORACLE_HOME/bin" >> /home/azacsnap/.bash_profile
      ```

   1. As the new Linux user (`azacsnap`), create the wallet and `*.ora` files.

      1. Switch to the user created in the previous step:

         ```bash
         sudo su - azacsnap
         ```

      1. Create the Oracle wallet:

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

      1. Add the connection string credentials to the Oracle wallet. In the following example command, `AZACSNAP` is the connection string that AzAcSnap will use, `azacsnap` is the Oracle database user, and `AzPasswd1` is the Oracle user's database password.

         ```bash
         mkstore -wrl $TNS_ADMIN/.oracle_wallet/ -createCredential AZACSNAP azacsnap AzPasswd1
         ```

         ```output
         Oracle Secret Store Tool Release 19.0.0.0.0 - Production
         Version 19.3.0.0.0
         Copyright (c) 2004, 2019, Oracle and/or its affiliates. All rights reserved.
       
         Enter wallet password: <wallet_password>
         ```

      1. Create the `tnsnames-ora` file. In the following example command, set `HOST` to the IP address of the Oracle database server. Set `SID` to the Oracle database SID.

         ```bash
         echo "# Connection string
         AZACSNAP=\"(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=192.168.1.1)(PORT=1521))(CONNECT_DATA=(SID=oratest1)))\"
         " > $TNS_ADMIN/tnsnames.ora
         ```

      1. Create the `sqlnet.ora` file:

         ```bash
         echo "SQLNET.WALLET_OVERRIDE = TRUE
         WALLET_LOCATION=(
             SOURCE=(METHOD=FILE)
             (METHOD_DATA=(DIRECTORY=\$TNS_ADMIN/.oracle_wallet))
         ) " > $TNS_ADMIN/sqlnet.ora
         ```

      1. Test the Oracle wallet:

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

      1. Create a ZIP file archive of the Oracle wallet and `*.ora` files:

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

      > [!IMPORTANT]
      > If you're deploying to a centralized virtual machine, you need to install and set up Oracle Instant Client on it so that the AzAcSnap user can run `sqlplus` commands. You can download Oracle Instant Client from the [Oracle downloads page](https://www.oracle.com/database/technologies/instant-client/linux-x86-64-downloads.html).
      >
      > For SQL\*Plus to run correctly, download both the required package (for example, Basic Light Package) and the optional SQL\*Plus tools package.

   1. Complete the following steps on the system running AzAcSnap:

      1. Deploy the ZIP file that you copied in the previous step.

         This step assumes that you already created the user running AzAcSnap (by default, `azacsnap`) by using the AzAcSnap installer.

         > [!NOTE]
         > It's possible to use the `TNS_ADMIN` shell variable to allow for multiple Oracle targets by setting the unique shell variable value for each Oracle system as needed.

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

         Check that the files were extracted correctly:

         ```bash
         ls
         ```

         ```output
         sqlnet.ora  tnsnames.ora  wallet.zip
         ```

         Assuming that you completed all the previous steps correctly, it should be possible to connect to the database by using the `/@AZACSNAP` connection string:

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

      1. Test the setup with AzAcSnap

         After you configure AzAcSnap (for example, `azacsnap -c configure --configuration new`) with the Oracle connection string (for example, `/@AZACSNAP`), it should be possible to connect to the Oracle database.

         Check that the `$TNS_ADMIN` variable is set for the correct Oracle target system. The `$TNS_ADMIN` shell variable determines where to locate the Oracle wallet and `*.ora` files, so you must set it before you run the `azacsnap` command.

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

         Run the `azacsnap` test command:

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

         You must set up the `$TNS_ADMIN` variable correctly for `azacsnap` to run correctly. You can either add it to the user's `.bash_profile` file or export it before each run (for example, `export TNS_ADMIN="/home/orasnap/ORACLE19c" ; cd /home/orasnap/bin ; ./azacsnap --configfile ORACLE19c.json -c backup --volume data --prefix hourly-ora19c --retention 12`).

# [IBM Db2](#tab/db2)

The snapshot tools issue commands to the IBM Db2 database by using the command-line processor `db2` to enable and disable backup mode.

After AzAcSnap puts the database in backup mode, it queries the IBM Db2 database to get a list of protected paths, which are part of the database where backup mode is active. This list is sent into an external file, which is in the same location and basename as the log file but has a `.\<DBName>-protected-paths` extension. (The AzAcSnap log file details the output file name.)

AzAcSnap uses the IBM Db2 command-line processor `db2` to issue SQL commands, such as `SET WRITE SUSPEND` or `SET WRITE RESUME`. So you should install AzAcSnap in one of the following ways:

- Install on the database server, and then complete the setup with [Db2 local connectivity](#db2-local-connectivity).
- Install on a centralized backup system, and then complete the setup with [Db2 remote connectivity](#db2-remote-connectivity).

#### Db2 local connectivity

If you installed AzAcSnap on the database server, be sure to add the `azacsnap` user to the correct Linux group and import the Db2 instance user's profile. Use the following example setup.

##### azacsnap user permissions

The `azacsnap` user should belong to the same Db2 group as the database instance user. The following example gets the group membership of the IBM Db2 installation's database instance user `db2tst`:

```bash
id db2tst
```

```output
uid=1101(db2tst) gid=1001(db2iadm1) groups=1001(db2iadm1)
```

From the output, you can confirm the `db2tst` user has been added to the `db2iadm1` group. Add the `azacsnap` user to the group:

```bash
usermod -a -G db2iadm1 azacsnap
```

##### azacsnap user profile

The `azacsnap` user needs to be able to run the `db2` command. By default, the `db2` command isn't in the `azacsnap` user's `$PATH` information.

Add the following code to the user's `.bashrc` file. Use your own IBM Db2 installation value for `INSTHOME`.

```output
# The following four lines have been added to allow this user to run the DB2 command line processor.
INSTHOME="/db2inst/db2tst"
if [ -f ${INSTHOME}/sqllib/db2profile ]; then
    . ${INSTHOME}/sqllib/db2profile
fi
```

Test that the user can run the `db2` command-line processor:

```bash
su - azacsnap
db2
```

```output
(c) Copyright IBM Corporation 1993,2007
Command Line Processor for DB2 Client 11.5.7.0

You can issue database manager commands and SQL statements from the command
prompt. For example:
    db2 => connect to sample
    db2 => bind sample.bnd

For general help, type: ?.
For command help, type: ? command, where command can be
the first few keywords of a database manager command. For example:
 ? CATALOG DATABASE for help on the CATALOG DATABASE command
 ? CATALOG          for help on all of the CATALOG commands.

To exit db2 interactive mode, type QUIT at the command prompt. Outside
interactive mode, all commands must be prefixed with 'db2'.
To list the current command option settings, type LIST COMMAND OPTIONS.

For more detailed help, refer to the Online Reference Manual.
```

```sql
db2 => quit
DB20000I  The QUIT command completed successfully.
```

Now configure `azacsnap` to user `localhost`. After this preliminary test as the `azacsnap` user is working correctly, go on to configure (`azacsnap -c configure`) with `serverAddress=localhost` and test (`azacsnap -c test --test db2`) AzAcSnap database connectivity.

#### Db2 remote connectivity

If you installed AzAcSnap on a centralized backup system, use the following example setup to allow SSH access to the Db2 database instance.

Log in to the AzAcSnap system as the `azacsnap` user and generate a public/private SSH key pair:

```bash
ssh-keygen
```

```output
Generating public/private rsa key pair.
Enter file in which to save the key (/home/azacsnap/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/azacsnap/.ssh/id_rsa.
Your public key has been saved in /home/azacsnap/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:4cr+0yN8/dawBeHtdmlfPnlm1wRMTO/mNYxarwyEFLU azacsnap@db2-02
The key's randomart image is:
+---[RSA 2048]----+
|         ... o.  |
|          . . +. |
|        .. E + o.|
|       ....   B..|
|        S. . o *=|
|     . .  . o o=X|
|      o. . +  .XB|
|     .  + + + +oX|
|      ...+ . =.o+|
+----[SHA256]-----+
```

Get the contents of the public key:

```bash
cat .ssh/id_rsa.pub
```

```output
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCb4HedCPdIeft4DUp7jwSDUNef52zH8xVfu5sSErWUw3hhRQ7KV5sLqtxom7an2a0COeO13gjCiTpwfO7UXH47dUgbz+KfwDaBdQoZdsp8ed1WI6vgCRuY4sb+rY7eiqbJrLnJrmgdwZkV+HSOvZGnKEV4Y837UHn0BYcAckX8DiRl7gkrbZUPcpkQYHGy9bMmXO+tUuxLM0wBrzvGcPPZ azacsnap@db2-02
```

Log in to the IBM Db2 system as the Db2 instance user.

Add the contents of the AzAcSnap user's public key to the Db2 instance user's `authorized_keys` file:

```bash
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCb4HedCPdIeft4DUp7jwSDUNef52zH8xVfu5sSErWUw3hhRQ7KV5sLqtxom7an2a0COeO13gjCiTpwfO7UXH47dUgbz+KfwDaBdQoZdsp8ed1WI6vgCRuY4sb+rY7eiqbJrLnJrmgdwZkV+HSOvZGnKEV4Y837UHn0BYcAckX8DiRl7gkrbZUPcpkQYHGy9bMmXO+tUuxLM0wBrzvGcPPZ azacsnap@db2-02" >> ~/.ssh/authorized_keys
```

Log in to the AzAcSnap system as the `azacsnap` user and test SSH access:

```bash
ssh <InstanceUser>@<ServerAddress>
```

```output
[InstanceUser@ServerName ~]$
```

Test that the user can run the `db2` command-line processor:

```bash
db2
```

```output
(c) Copyright IBM Corporation 1993,2007
Command Line Processor for DB2 Client 11.5.7.0

You can issue database manager commands and SQL statements from the command
prompt. For example:
    db2 => connect to sample
    db2 => bind sample.bnd

For general help, type: ?.
For command help, type: ? command, where command can be
the first few keywords of a database manager command. For example:
 ? CATALOG DATABASE for help on the CATALOG DATABASE command
 ? CATALOG          for help on all of the CATALOG commands.

To exit db2 interactive mode, type QUIT at the command prompt. Outside
interactive mode, all commands must be prefixed with 'db2'.
To list the current command option settings, type LIST COMMAND OPTIONS.

For more detailed help, refer to the Online Reference Manual.
```

```sql
db2 => quit
DB20000I  The QUIT command completed successfully.
```

```bash
[prj@db2-02 ~]$ exit
```

```output
logout
Connection to <serverAddress> closed.
```


---

## Install the snapshot tools

The downloadable self-installer makes the snapshot tools easy to set up and run with non-root user privileges (for example, `azacsnap`). The installer sets up the user and puts the snapshot tools into the user's `$HOME/bin` subdirectory. The default is `/home/azacsnap/bin`.

The self-installer tries to determine the correct settings and paths for all the files based on the configuration of the user performing the installation (for example, root). If the previous setup steps to enable communication with storage and SAP HANA were run as root, the installation copies the private key and `hdbuserstore` to the backup user's location. A knowledgeable administrator can manually take the steps to enable communication with the storage back end and database after the installation.

> [!NOTE]
> For earlier installations of SAP HANA on Azure Large Instances, the directory of preinstalled snapshot tools was `/hana/shared/<SID>/exe/linuxx86_64/hdb`.

With the [prerequisite steps](#prerequisites-for-installation) completed, it's now possible to install the snapshot tools by using the self-installer as follows:

1. Copy the downloaded self-installer to the target system.
1. Run the self-installer as the root user. If necessary, make the file executable by using the `chmod +x *.run` command.

Running the self-installer command without any arguments displays help on using the installer as follows:

```bash
chmod +x azacsnap_installer_v5.0.run
./azacsnap_installer_v5.0.run
```

```output
Usage: ./azacsnap_installer_v5.0.run [-v] -I [-u <HLI Snapshot Command user>]
./azacsnap_installer_v5.0.run [-v] -X [-d <directory>]
./azacsnap_installer_v5.0.run [-h]

Switches enclosed in [] are optional for each command line.
- h prints out this usage.
- v turns on verbose output.
- I starts the installation.
- u is the Linux user to install the scripts into, by default this is
'azacsnap'.
- X will only extract the commands.
- d is the target directory to extract into, by default this is
'./snapshot_cmds'.
Examples of a target directory are ./tmp or /usr/local/bin
```

The self-installer has an option to extract (`-X`) the snapshot tools from the bundle without performing any user creation and setup. An experienced administrator can then complete the setup steps manually or copy the commands to upgrade an existing installation.

### Use the easy installation of snapshot tools (default)

The installer can quickly install the snapshot tools for SAP HANA on Azure. By default, if you run the installer with only the `-I` option, it does the following steps:

1. Create snapshot user `azacsnap`, create the home directory, and set group membership.
1. Configure the `azacsnap` user's login `~/.profile` information.
1. Search the file system for directories to add to `$PATH` for AzAcSnap. This task allows the user who runs AzAcSnap to use SAP HANA commands, such as `hdbsql` and `hdbuserstore`.
1. Search the file system for directories to add to `$LD_LIBRARY_PATH` for AzAcSnap. Many commands require you to set a library path to run them correctly. This task configures it for the installed user.
1. Copy the SSH keys for back-end storage for AzAcSnap from the root user (the user running the installation).

   This task assumes that the root user has already configured connectivity to the storage. For more information, see the earlier section [Enable communication with storage](#enable-communication-with-storage).
1. Copy the SAP HANA connection's secure user store for the target user, `azacsnap`. This task assumes that the root user has already configured the secure user store. For more information, see the earlier section [Enable communication with the database](#enable-communication-with-the-database).
1. The snapshot tools are extracted into `/home/azacsnap/bin/`.
1. The commands in `/home/azacsnap/bin/` have their permissions set, including ownership and executable bit.

The following example shows the correct output of the installer when you run it by using the default installation option:

```bash
./azacsnap_installer_v5.0.run -I
```

```output
+-----------------------------------------------------------+
| Azure Application Consistent Snapshot tool Installer      |
+-----------------------------------------------------------+
|-> Installer version '5.0'
|-> Create Snapshot user 'azacsnap', home directory, and set group membership.
|-> Configure azacsnap .profile
|-> Search filesystem for directories to add to azacsnap's $PATH
|-> Search filesystem for directories to add to azacsnap's $LD_LIBRARY_PATH
|-> Copying SSH keys for back-end storage for azacsnap.
|-> Copying HANA connection keystore for azacsnap.
|-> Extracting commands into /home/azacsnap/bin/.
|-> Making commands in /home/azacsnap/bin/ executable.
|-> Creating symlink for hdbsql command in /home/azacsnap/bin/.
+-----------------------------------------------------------+
| Install complete! Follow the steps below to configure.    |
+-----------------------------------------------------------+
+-----------------------------------------------------------+
|  Install complete!  Follow the steps below to configure.  |
+-----------------------------------------------------------+

1. Change into the snapshot user account.....
     su - azacsnap
2. Set up the HANA Secure User Store..... (command format below)
     hdbuserstore Set <ADMIN_USER> <HOSTNAME>:<PORT> <admin_user> <password>
3. Change to location of commands.....
     cd /home/azacsnap/bin/
4. Configure the customer details file.....
     azacsnap -c configure --configuration new
5. Test the connection to storage.....
     azacsnap -c test --test storage
6. Test the connection to HANA.....
   a. without SSL
     azacsnap -c test --test hana
   b. with SSL,  you will need to choose the correct SSL option
     azacsnap -c test --test hana --ssl=<commoncrypto|openssl>
7. Run your first snapshot backup..... (example below)
     azacsnap -c backup --volume=data --prefix=hana_test --frequency=15min --retention=1
```

### Uninstall the snapshot tools

If you installed the snapshot tools by using the default settings, uninstallation requires only removing the user that you installed the commands for. The default is `azacsnap`.

```bash
userdel -f -r azacsnap
```

### Manually install the snapshot tools

In some cases, it's necessary to install the tools manually. But we recommend that you use the installer's default option to ease this process.

Each line that starts with a pound (`#`) character demonstrates that the root user runs the example commands after the character. The backslash (`\`) at the end of a line is the standard line-continuation character for a shell command.

As the root superuser, you can follow these steps for a manual installation:

1. Get the `sapsys` group ID. In this case, the group ID is `1010`.

    ```bash
    grep sapsys /etc/group
    ```

    ```output
    sapsys:x:1010:
    ```

1. Create snapshot user `azacsnap`, create the home directory, and set group membership by using the group ID from step 1:

    ```bash
    useradd -m -g 1010 -c "Azure SAP HANA Snapshots User" azacsnap
    ```

1. Make sure the login `.profile` information for the `azacsnap` user exists:

    ```bash
    echo "" >> /home/azacsnap/.profile
    ```

1. Search the file system for directories to add to `$PATH` for AzAcSnap. These directories are typically the paths to the SAP HANA tools, such as `hdbsql` and `hdbuserstore`.

    ```bash
    HDBSQL_PATH=`find -L /hana/shared/[A-z0-9][A-z0-9][A-z0-9]/HDB*/exe /usr/sap/hdbclient -name hdbsql -exec dirname {} + 2> /dev/null | sort | uniq | tr '\n' ':'`
    ```

1. Add the updated `$PATH` information to the user's profile:

    ```bash
    echo "export PATH=\"\$PATH:$HDBSQL_PATH\"" >> /home/azacsnap/.profile
    ```

1. Search the file system for directories to add to `$LD_LIBRARY_PATH` for AzAcSnap:

    ```bash
    NEW_LIB_PATH=`find -L /hana/shared/[A-z0-9][A-z0-9][A-z0-9]/HDB*/exe /usr/sap/hdbclient -name "*.so" -exec dirname {} + 2> /dev/null | sort | uniq | tr '\n' ':'`
    ```

1. Add the updated library path to the user's profile:

    ```bash
    echo "export LD_LIBRARY_PATH=\"\$LD_LIBRARY_PATH:$NEW_LIB_PATH\"" >> /home/azacsnap/.profile
    ```

1. Take the following actions, depending on the storage back end:

    # [Azure NetApp Files (with VM)](#tab/azure-netapp-files)

    Configure the user's `DOTNET_BUNDLE_EXTRACT_BASE_DIR` path according to the .NET Core single-file extract guidance.

    Use the following code for SUSE Linux:

    ```bash
    echo "export DOTNET_BUNDLE_EXTRACT_BASE_DIR=\$HOME/.net" >> /home/azacsnap/.profile
    echo "[ -d $DOTNET_BUNDLE_EXTRACT_BASE_DIR] && chmod 700 $DOTNET_BUNDLE_EXTRACT_BASE_DIR" >> /home/azacsnap/.profile
    ```

    Use the following code for RHEL:

    ```bash
    echo "export DOTNET_BUNDLE_EXTRACT_BASE_DIR=\$HOME/.net" >> /home/azacsnap/.bash_profile
    echo "[ -d $DOTNET_BUNDLE_EXTRACT_BASE_DIR] && chmod 700 $DOTNET_BUNDLE_EXTRACT_BASE_DIR" >> /home/azacsnap/.bash_profile
    ```

    # [Azure Large Instances (bare metal)](#tab/azure-large-instance)

    1. Copy the SSH keys for back-end storage for AzAcSnap from the root user (the user running the installation). This step assumes that the root user has already configured connectivity to the storage. For more information, see the earlier section [Enable communication with storage](#enable-communication-with-storage).

        ```bash
        cp -pr ~/.ssh /home/azacsnap/.
        ```

    1. Set the user permissions correctly for the SSH files:

        ```bash
        chown -R azacsnap.sapsys /home/azacsnap/.ssh
        ```

    ---

1. Copy the SAP HANA connection's secure user store for the target user, `azacsnap`. This step assumes that the root user has already configured the secure user store. For more information, see the earlier section [Enable communication with the database](#enable-communication-with-the-database).

    ```bash
    cp -pr ~/.hdb /home/azacsnap/.
    ```

1. Set the user permissions correctly for the `hdbuserstore` files:

    ```bash
    chown -R azacsnap.sapsys /home/azacsnap/.hdb
    ```

1. Extract the snapshot tools into `/home/azacsnap/bin/`:

    ```bash
    ./azacsnap_installer_v5.0.run -X -d /home/azacsnap/bin
    ```

1. Make the commands executable:

    ```bash
    chmod 700 /home/azacsnap/bin/*
    ```

1. Ensure that the correct ownership permissions are set on the user's home directory:

    ```bash
    chown -R azacsnap.sapsys /home/azacsnap/*
    ```

### Complete the setup of snapshot tools

The installer provides steps to complete after you install the snapshot tools.

The following output shows the steps to complete after you run the installer with the default installation options. Follow these steps to configure and test the snapshot tools.

```output
1. Change into the snapshot user account.....
     su - azacsnap
2. Set up the HANA Secure User Store.....
     hdbuserstore Set <ADMIN_USER> <HOSTNAME>:<PORT> <admin_user> <password>
3. Change to location of commands.....
     cd /home/azacsnap/bin/
4. Configure the customer details file.....
     azacsnap -c configure --configuration new
5. Test the connection to storage.....
     azacsnap -c test --test storage
6. Test the connection to HANA.....
   a. without SSL
     azacsnap -c test --test hana
   b. with SSL,  you will need to choose the correct SSL option
     azacsnap -c test --test hana --ssl=<commoncrypto|openssl>
7. Run your first snapshot backup.....
     azacsnap -c backup --volume=data --prefix=hana_test --retention=1
```

Step 2 is necessary if you didn't [enable communication with the database](#enable-communication-with-the-database) before the installation.

If the test commands run correctly, the test is successful. You can then perform the first database-consistent storage snapshot.

## Configure the database

This section explains how to configure the database.

# [SAP HANA](#tab/sap-hana)

### Configure SAP HANA

There are changes that you can apply to SAP HANA to help protect the log backups and catalog. By default, `basepath_logbackup` and `basepath_catalogbackup` are set so that SAP HANA will put related files into the `$(DIR_INSTANCE)/backup/log` directory. It's unlikely that this location is on a volume that AzAcSnap is configured to snapshot, so storage snapshots won't protect these files.

The following `hdbsql` command examples demonstrate setting the log and catalog paths to locations on storage volumes that AzAcSnap can snapshot. Be sure to check that the values on the command line match the local SAP HANA configuration.

### Configure the log backup location

This example shows a change to the `basepath_logbackup` parameter:

```bash
hdbsql -jaxC -n <HANA_ip_address>:30013 -i 00 -u SYSTEM -p <SYSTEM_USER_PASSWORD> "ALTER SYSTEM ALTER CONFIGURATION ('global.ini', 'SYSTEM') SET ('persistence', 'basepath_logbackup') = '/hana/logbackups/H80' WITH RECONFIGURE"
```

### Configure the catalog backup location

This example shows a change to the `basepath_catalogbackup` parameter. First, ensure that the `basepath_catalogbackup` path exists on the file system. If not, create the path with the same ownership as the directory.

```bash
ls -ld /hana/logbackups/H80/catalog
```

```output
drwxr-x--- 4 h80adm sapsys 4096 Jan 17 06:55 /hana/logbackups/H80/catalog
```

If you need to create the path, the following example creates the path and sets the correct ownership and permissions. You need to run these commands as root.

```bash
mkdir /hana/logbackups/H80/catalog
chown --reference=/hana/shared/H80/HDB00 /hana/logbackups/H80/catalog
chmod --reference=/hana/shared/H80/HDB00 /hana/logbackups/H80/catalog
ls -ld /hana/logbackups/H80/catalog
```

```output
drwxr-x--- 4 h80adm sapsys 4096 Jan 17 06:55 /hana/logbackups/H80/catalog
```

The following example changes the SAP HANA setting:

```bash
hdbsql -jaxC -n <HANA_ip_address>:30013 -i 00 -u SYSTEM -p <SYSTEM_USER_PASSWORD> "ALTER SYSTEM ALTER CONFIGURATION ('global.ini', 'SYSTEM') SET ('persistence', 'basepath_catalogbackup') = '/hana/logbackups/H80/catalog' WITH RECONFIGURE"
```

### Check log and catalog backup locations

After you make the changes to the log and catalog backup locations, confirm that the settings are correct by using the following command.

In this example, the settings appear as `SYSTEM` settings. This query also returns the `DEFAULT` settings for comparison.

```bash
hdbsql -jaxC -n <HANA_ip_address> - i 00 -U AZACSNAP "select * from sys.m_inifile_contents where (key = 'basepath_databackup' or key ='basepath_datavolumes' or key = 'basepath_logbackup' or key = 'basepath_logvolumes' or key = 'basepath_catalogbackup')"
```

```output
global.ini,DEFAULT,,,persistence,basepath_catalogbackup,$(DIR_INSTANCE)/backup/log
global.ini,DEFAULT,,,persistence,basepath_databackup,$(DIR_INSTANCE)/backup/data
global.ini,DEFAULT,,,persistence,basepath_datavolumes,$(DIR_GLOBAL)/hdb/data
global.ini,DEFAULT,,,persistence,basepath_logbackup,$(DIR_INSTANCE)/backup/log
global.ini,DEFAULT,,,persistence,basepath_logvolumes,$(DIR_GLOBAL)/hdb/log
global.ini,SYSTEM,,,persistence,basepath_catalogbackup,/hana/logbackups/H80/catalog
global.ini,SYSTEM,,,persistence,basepath_datavolumes,/hana/data/H80
global.ini,SYSTEM,,,persistence,basepath_logbackup,/hana/logbackups/H80
global.ini,SYSTEM,,,persistence,basepath_logvolumes,/hana/log/H80
```

### Configure the log backup timeout

The default setting for SAP HANA to perform a log backup is `900` seconds (15 minutes). We recommend that you reduce this value to `300` seconds (5 minutes). Then it's possible to run regular backups of these files (for example, every 10 minutes). You can take these backups by adding the `log_backup` volumes to the `OTHER` volume section of the
configuration file.

```bash
hdbsql -jaxC -n <HANA_ip_address>:30013 -i 00 -u SYSTEM -p <SYSTEM_USER_PASSWORD> "ALTER SYSTEM ALTER CONFIGURATION ('global.ini', 'SYSTEM') SET ('persistence', 'log_backup_timeout_s') = '300' WITH RECONFIGURE"
```

### Check the log backup timeout

After you make the change to the log backup timeout, ensure that the timeout is set by using the following command.

In this example, the settings are displayed as `SYSTEM` settings. This query also returns the `DEFAULT` settings for comparison.

```bash
hdbsql -jaxC -n <HANA_ip_address> - i 00 -U AZACSNAP "select * from sys.m_inifile_contents where key like '%log_backup_timeout%' "
```

```output
global.ini,DEFAULT,,,persistence,log_backup_timeout_s,900
global.ini,SYSTEM,,,persistence,log_backup_timeout_s,300
```

# [Oracle](#tab/oracle)

Apply the following changes to the Oracle database to allow for monitoring by the database administrator:

1. Set up Oracle alert logging.

   Use the following Oracle SQL commands while you're connected to the database as `SYSDBA` to create a stored procedure under the default Oracle SYSBACKUP database account. These SQL commands allow AzAcSnap to send messages to:

   - Standard output by using the `PUT_LINE` procedure in the `DBMS_OUTPUT` package.
   - The Oracle database `alert.log` file by using the `KSDWRT` procedure in the `DBMS_SYSTEM` package.

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

# [IBM Db2](#tab/db2)

No special database configuration is required for Db2 because you're using the instance user's local operating system environment.

---

## Next steps

- [Configure the Azure Application Consistent Snapshot tool](azacsnap-cmd-ref-configure.md)

