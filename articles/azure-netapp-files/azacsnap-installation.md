---
title: Install the Azure Application Consistent Snapshot tool for Azure NetApp Files | Microsoft Docs
description: Provides a guide for installation of the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files. 
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
ms.date: 11/29/2022
ms.author: phjensen
---

# Install Azure Application Consistent Snapshot tool

This article provides a guide for installation of the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files or Azure Large Instance.

> [!IMPORTANT]
> Distributed installations are the only option for **Azure Large Instance** systems as they are deployed in a private network.  Therefore AzAcSnap installations must be done on each system to ensure connectivity.

## Introduction

The downloadable self-installer is designed to make the snapshot tools easy to set up and run with non-root user privileges (for example, azacsnap). The installer will set up the user and put the snapshot tools into the users `$HOME/bin` subdirectory (default = `/home/azacsnap/bin`).
The self-installer tries to determine the correct settings and paths for all the files based on the configuration of the user performing the installation (for example, root). If the pre-requisite steps (enable communication with storage and SAP HANA) were run as root, then the installation will copy the private key and `hdbuserstore` to the backup user’s location. The steps to enable communication with the storage back-end and SAP HANA can be manually done by a knowledgeable administrator after the installation.

## Prerequisites for installation

Follow the guidelines to set up and execute the snapshots and disaster recovery commands. It
is recommended the following steps are completed as root before installing and using the snapshot
tools.

1. **OS is patched**: See patching and SMT setup in [How to install and configure SAP HANA (Large Instances) on Azure](../virtual-machines/workloads/sap/hana-installation.md#operating-system).
1. **Time Synchronization is set up**. The customer will need to provide an NTP compatible time
    server, and configure the OS accordingly.
1. **HANA is installed** : See HANA installation instructions in [SAP NetWeaver Installation on HANA database](/archive/blogs/saponsqlserver/sap-netweaver-installation-on-hana-database).
1. **[Enable communication with storage](#enable-communication-with-storage)** (for more information, see separate section): Select the storage back-end you're using for your deployment.

   # [Azure NetApp Files](#tab/azure-netapp-files)
    
   1. **For Azure NetApp Files (for more information, see separate section)**: Customer must generate the service principal authentication file.
      
      > [!IMPORTANT]
      > When validating communication with Azure NetApp Files, communication might fail or time-out. Check to ensure firewall rules are not blocking outbound traffic from the system running AzAcSnap to the following addresses and TCP/IP ports:
      > - (https://)management.azure.com:443
      > - (https://)login.microsoftonline.com:443
      
   # [Azure Large Instance (Bare Metal)](#tab/azure-large-instance)
      
   1. **For Azure Large Instance (for more information, see separate section)**: Set up SSH with a
      private/public key pair.  Provide the public key for each node, where the snapshot tools are
      planned to be executed, to Microsoft Operations for setup on the storage back-end.

      Test this by using SSH to connect to one of the nodes (for example, `ssh -l <Storage UserName> <Storage IP Address>`).
      Type `exit` to logout of the storage prompt.

      Microsoft  operations will  provide  the  storage  user  and  storage  IP at  the  time  of provisioning.
      
      ---

1. **[Enable communication with database](#enable-communication-with-database)** (for more information, see separate section): 
   
   # [SAP HANA](#tab/sap-hana)
   
   Set up an appropriate SAP HANA user following the instructions in the Enable communication with database](#enable-communication-with-database) section.

   1. After set up the connection can be tested from the command line as follows using these examples:

      1. HANAv1

            `hdbsql -n <HANA IP address> -i <HANA instance> -U <HANA user> "\s"`

      1. HANAv2

            `hdbsql -n <HANA IP address> -i <HANA instance> -d SYSTEMDB -U <HANA user> "\s"`

      > [!NOTE]
      > These examples are for non-SSL communication to SAP HANA.
 
    # [Oracle](#tab/oracle)
   
   Set up an appropriate Oracle database and Oracle Wallet following the instructions in the Enable communication with database](#enable-communication-with-database) section.

   1. After set up the connection can be tested from the command line as follows using these examples:

      1. `sqlplus /@<ORACLE_USER> as SYSBACKUP`

   ---


## Enable communication with storage

This section explains how to enable communication with storage. Ensure the storage back-end you're using is correctly selected.

# [Azure NetApp Files (with Virtual Machine)](#tab/azure-netapp-files)

Create RBAC Service Principal

1. Within an Azure Cloud Shell session, make sure you're logged on at the subscription where you want
  to be associated with the service principal by default:

    ```azurecli-interactive
    az account show
    ```

1. If the subscription isn't correct, use the following command:

    ```azurecli-interactive
    az account set -s <subscription name or id>
    ```

1. Create a service principal using Azure CLI per the following example:

    ```azurecli-interactive
    az ad sp create-for-rbac --name "AzAcSnap" --role Contributor --scopes /subscriptions/{subscription-id} --sdk-auth
    ```

    1. This should generate an output like the following example:

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

    > This command will automatically assign RBAC contributor role to the service principal at
    subscription level, you can narrow down the scope to the specific resource group where your
    tests will create the resources.

1. Cut and Paste the output content into a file called `azureauth.json` stored on the same system as the `azacsnap`
   command and secure the file with appropriate system permissions.
   
   > [!WARNING]
   > Make sure the format of the JSON file is exactly as described above.  Especially with the URLs enclosed in double quotes (").

# [Azure Large Instance (Bare Metal)](#tab/azure-large-instance)

Communication with the storage back-end executes over an encrypted SSH channel. The following
example steps are to provide guidance on setup of SSH for this communication.

1. Modify the `/etc/ssh/ssh_config` file

    Refer to the following output where the `MACs hmac-sha1` line has been added:

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

1. Create a private/public key pair

    Using the following example command to generate the key pair, do not enter a password when generating a key.

    ```bash
    ssh-keygen -t rsa –b 5120 -C ""
    ```

1. Send the public key to Microsoft Operations

    Send the output of the `cat /root/.ssh/id_rsa.pub` command to Microsoft Operations
    to enable the snapshot tools to communicate with the storage subsystem.

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

## Enable communication with database

This section explains how to enable communication with the database. Ensure the database you're using is correctly selected from the tabs.

# [SAP HANA](#tab/sap-hana)

> [!IMPORTANT]
> If deploying to a centralized virtual machine, then it will need to have the SAP HANA client installed and set up so the AzAcSnap user can run `hdbsql` and `hdbuserstore` commands. The SAP HANA Client can downloaded from https://tools.hana.ondemand.com/#hanatools.

The snapshot tools communicate with SAP HANA and need a user with appropriate permissions to
initiate and release the database save-point. The following example shows the setup of the SAP
HANA v2 user and the `hdbuserstore` for communication to the SAP HANA database.

The following example commands set up a user (AZACSNAP) in the SYSTEMDB on SAP HANA 2.
database, change the IP address, usernames, and passwords as appropriate:

1. Connect to the SYSTEMDB to create the user.

    ```bash
    hdbsql -n <IP_address_of_host>:30013 -i 00 -u SYSTEM -p <SYSTEM_USER_PASSWORD>
    ```

    ```output
    Welcome to the SAP HANA Database interactive terminal.

    Type: \h for help with commands
    \q to quit

    hdbsql SYSTEMDB=>
    ```

1. Create the user.

    This example creates the AZACSNAP user in the SYSTEMDB.

    ```sql
    hdbsql SYSTEMDB=> CREATE USER AZACSNAP PASSWORD <AZACSNAP_PASSWORD_CHANGE_ME> NO FORCE_FIRST_PASSWORD_CHANGE;
    ```

1. Grant the user permissions.

    This example sets the permission for the AZACSNAP user to allow for performing a database
    consistent storage snapshot.
    
    1. For SAP HANA releases up to version 2.0 SPS 03:

       ```sql
       hdbsql SYSTEMDB=> GRANT BACKUP ADMIN, CATALOG READ TO AZACSNAP;
       ```

    1. For SAP HANA releases from version 2.0 SPS 04, SAP added new fine-grained privileges:

       ```sql
       hdbsql SYSTEMDB=> GRANT BACKUP ADMIN, DATABASE BACKUP ADMIN, CATALOG READ TO AZACSNAP;
       ```

1. *OPTIONAL* - Prevent user's password from expiring.

    > [!NOTE]
    > Check with corporate policy before making this change.

   This example disables the password expiration for the AZACSNAP user, without this change the user's password will expire preventing snapshots to be taken correctly.  

   ```sql
   hdbsql SYSTEMDB=> ALTER USER AZACSNAP DISABLE PASSWORD LIFETIME;
   ```

1. Set up the SAP HANA Secure User Store (change the password).
    This example uses the `hdbuserstore` command from the Linux shell to set up the SAP HANA Secure User Store.

    ```bash
    hdbuserstore Set AZACSNAP <IP_address_of_host>:30013 AZACSNAP <AZACSNAP_PASSWORD_CHANGE_ME>
    ```

1. Check the SAP HANA Secure User Store.
    To check if the secure user store is set up correctly, use the `hdbuserstore` command to list the
    output similar to the following example. More details on using `hdbuserstore` are available
    on the SAP website.

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

The `azacsnap` tool utilizes SAP HANA's `hdbsql` command to communicate with SAP HANA. This
includes the use of SSL options when encrypting communication with SAP HANA. `azacsnap` uses
`hdbsql` command's SSL options as follows.

The following are always used when using the `azacsnap --ssl` option:

- `-e` - Enables TLS encryptionTLS/SSL encryption. The server chooses the highest available.
- `-ssltrustcert` - Specifies whether to validate the server's certificate.
- `-sslhostnameincert "*"` - Specifies the host name used to verify server’s identity. By
    specifying `"*"` as the host name, then the server's host name isn't validated.

SSL communication also requires Key Store and Trust Store files.  While it's possible for
these files to be stored in default locations on a Linux installation, to ensure the
correct key material is being used for the various SAP HANA systems (for the cases where
different key-store and trust-store files are used for each SAP HANA system) `azacsnap`
expects the key-store and trust-store files to be stored in the `securityPath` location
as specified in the `azacsnap` configuration file.

#### Key Store files

- If using multiple SIDs with the same key material, it's easier to create links into
    the securityPath location as defined in the `azacsnap` config file.  Ensure these values exist
    for every SID using SSL.
  - For openssl:
    - `ln $HOME/.ssl/key.pem <securityPath>/<SID>_keystore`
  - For commoncrypto:
    - `ln $SECUDIR/sapcli.pse <securityPath>/<SID>_keystore`
- If using multiple SIDs with the different key material per SID, copy (or move and rename)
    the files into the securityPath location as defined in the SIDs `azacsnap` config
    file.
  - For openssl:
    - `mv key.pem <securityPath>/<SID>_keystore`
  - For commoncrypto:
    - `mv sapcli.pse <securityPath>/<SID>_keystore`

When `azacsnap` calls `hdbsql`, it will add `-sslkeystore=<securityPath>/<SID>_keystore`
to the command line.

#### Trust Store files

- If using multiple SIDs with the same key material, create hard-links into the securityPath
    location as defined in the `azacsnap` config file.  Ensure these values exist for every SID
    using SSL.
  - For openssl:
    - `ln $HOME/.ssl/trust.pem <securityPath>/<SID>_truststore`
  - For commoncrypto:
    - `ln $SECUDIR/sapcli.pse <securityPath>/<SID>_truststore`
- If using multiple SIDs with the different key material per SID, copy (or move and rename)
   the files into the securityPath location as defined in the SIDs `azacsnap` config file.
  - For openssl:
    - `mv trust.pem <securityPath>/<SID>_truststore`
  - For commoncrypto:
    - `mv sapcli.pse <securityPath>/<SID>_truststore`

> [!NOTE]
> The `<SID>` component of the file names must be the SAP HANA System Identifier all in upper case (for example, `H80`, `PR1`, etc.)

When `azacsnap` calls `hdbsql`, it will add `-ssltruststore=<securityPath>/<SID>_truststore`
to the command line.

Therefore, running `azacsnap -c test --test hana --ssl openssl` where the `SID` is `H80`
in the config file, it would execute the `hdbsql`connections as follows:

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

> [!NOTE]
> The `\` character is a command line line-wrap to improve clarity of the
multiple parameters passed on the command line.

# [Oracle](#tab/oracle)

The snapshot tools communicate with the Oracle database and need a user with appropriate permissions to enable/disable backup mode.  After putting the database in backup mode, `azacsnap` will query the Oracle database to get a list of files, which have backup-mode as active.  This file list is output into an external file, which is in the same location and basename as the log file, but with a ".protected-tables" extension (output filename detailed in the AzAcSnap log file). 

The following examples show the set up of the Oracle database user, the use of `mkstore` to create an Oracle Wallet, and the `sqlplus` configuration files required for communication to the Oracle database. 

The following example commands set up a user (AZACSNAP) in the Oracle database, change the IP address, usernames, and passwords as appropriate:

1. From the Oracle database installation

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

1. Create the user

    This example creates the AZACSNAP user.

    ```sql
    SQL> CREATE USER azacsnap IDENTIFIED BY password;
    ```

    ```output
    User created.
    ```

1. Grant the user permissions - This example sets the permission for the AZACSNAP user to allow for putting the database in backup mode.

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

1. OPTIONAL - Prevent user's password from expiring

   It may be necessary to disable password expiry for the user, without this change the user's password could expire preventing snapshots to be taken correctly. 
   
   > [!NOTE]
   > Check with corporate policy before making this change.
   
   This example gets the password expiration for the AZACSNAP user:
   
   ```sql
   SQL> SELECT username,account_status,expiry_date,profile FROM dba_users WHERE username='AZACSNAP';
   ```
   
   ```output
   USERNAME              ACCOUNT_STATUS                 EXPIRY_DA PROFILE
   --------------------- ------------------------------ --------- ------------------------------
   AZACSNAP              OPEN                           DD-MMM-YY DEFAULT
   ```
   
   There are a few methods for disabling password expiry in the Oracle database, refer to your database administrator for guidance.  One method is 
   by modifying the DEFAULT user's profile so the password life time is unlimited as follows:
   
   ```sql
   SQL> ALTER PROFILE default LIMIT PASSWORD_LIFE_TIME unlimited;
   ```
   
   After making this change, there should be no password expiry date for user's with the DEFAULT profile.

   ```sql
   SQL> SELECT username, account_status,expiry_date,profile FROM dba_users WHERE username='AZACSNAP';
   ```
   
   ```output
   USERNAME              ACCOUNT_STATUS                 EXPIRY_DA PROFILE
   --------------------- ------------------------------ --------- ------------------------------
   AZACSNAP              OPEN                                     DEFAULT
   ```


1. The Oracle Wallet provides a method to manage database credentials across multiple domains. This capability is accomplished by using a database 
   connection string in the datasource definition, which is resolved by an entry in the wallet. When used correctly, the Oracle Wallet makes having
   passwords in the datasource configuration unnecessary.
   
   This makes it possible to use the Oracle Transparent Network Substrate (TNS) administrative file with a connection string alias, thus hiding 
   details of the database connection string. If the connection information changes, it's a matter of changing the `tnsnames.ora` file instead of 
   potentially many datasource definitions.
   
   Set up the Oracle Wallet (change the password) This example uses the mkstore command from the Linux shell to set up the Oracle wallet. These commands 
   are run on the Oracle database server using unique user credentials to avoid any impact on the running database. In this example a new user (azacsnap) 
   is created, and their environment variables configured appropriately.
   
   > [!IMPORTANT]
   > Be sure to create a unique user to generate the Oracle Wallet to avoid any impact on the running database.
   
   1. Run the following commands on the Oracle Database Server.
      
      1. Get the Oracle environment variables to be used in set up.  Run the following commands as the `root` user on the Oracle Database Server.

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
       
      1. Create the Linux user to generate the Oracle Wallet and associated `*.ora` files using the output from the previous step.

         > [!NOTE]
         > In these examples we are using the `bash` shell.  If you're using a different shell (for example, csh), then ensure environment 
         > variables have been set correctly.

         ```bash
         useradd -m azacsnap
         echo "export ORACLE_SID=oratest1" >> /home/azacsnap/.bash_profile
         echo "export ORACLE_HOME=/u01/app/oracle/product/19.0.0/dbhome_1" >> /home/azacsnap/.bash_profile
         echo "export TNS_ADMIN=/home/azacsnap" >> /home/azacsnap/.bash_profile
         echo "export PATH=\$PATH:\$ORACLE_HOME/bin" >> /home/azacsnap/.bash_profile
         ```

      1. As the new Linux user (`azacsnap`), create the wallet and `*.ora` files.
    
         `su` to the user created in the previous step.
       
         ```bash
         sudo su - azacsnap
         ```
       
         Create the Oracle Wallet.

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
       
         Add the connect string credentials to the Oracle Wallet.  In the following example command: AZACSNAP is the ConnectString to be used by AzAcSnap; azacsnap 
         is the Oracle Database User; AzPasswd1 is the Oracle User's database password.
       
         ```bash
         mkstore -wrl $TNS_ADMIN/.oracle_wallet/ -createCredential AZACSNAP azacsnap AzPasswd1
         ```
       
         ```output
         Oracle Secret Store Tool Release 19.0.0.0.0 - Production
         Version 19.3.0.0.0
         Copyright (c) 2004, 2019, Oracle and/or its affiliates. All rights reserved.
       
         Enter wallet password: <wallet_password>
         ```
       
         Create the `tnsnames-ora` file.  In the following example command: HOST should be set to the IP address of the Oracle Database Server; SID should be 
         set to the Oracle Database SID.
      
         ```bash
         echo "# Connection string
         AZACSNAP=\"(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=192.168.1.1)(PORT=1521))(CONNECT_DATA=(SID=oratest1)))\"
         " > $TNS_ADMIN/tnsnames.ora
         ```
       
         Create the `sqlnet.ora` file.
       
         ```bash
         echo "SQLNET.WALLET_OVERRIDE = TRUE
         WALLET_LOCATION=(
             SOURCE=(METHOD=FILE)
             (METHOD_DATA=(DIRECTORY=\$TNS_ADMIN/.oracle_wallet))
         ) " > $TNS_ADMIN/sqlnet.ora
         ```
       
         Test the Oracle Wallet.
       
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
       
         Create a ZIP file archive of the Oracle Wallet and `*.ora` files.
       
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
         > If deploying to a centralized virtual machine, then it will need to have the Oracle instant client installed and set up so 
         > the AzAcSnap user can run `sqlplus` commands.  
         > The Oracle Instant Client can downloaded from https://www.oracle.com/database/technologies/instant-client/linux-x86-64-downloads.html.
            > In order for SQL\*Plus to run correctly, download both the required package (for example, Basic Light Package) and the optional SQL\*Plus tools package.

      1. Complete the following steps on the system running AzAcSnap.
      
         1. Deploy ZIP file copied from the previous step.
    
            > [!IMPORTANT]
            > This step assumes the user running AzAcSnap, by default `azacsnap`, already has been created using the AzAcSnap installer.
       
            > [!NOTE]
            > It's possible to leverage the `TNS_ADMIN` shell variable to allow for multiple Oracle targets by setting the unique shell variable value
            > for each Oracle system as needed.

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
       
            Check the files have been extracted correctly.
       
            ```bash
            ls
            ```
       
            ```output
            sqlnet.ora  tnsnames.ora  wallet.zip
            ```
       
            Assuming all the previous steps have been completed correctly, then it should be possible to connect to the database using 
            the `/@AZACSNAP` connect string.
       
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
       
            > [!IMPORTANT]
            > The `$TNS_ADMIN` shell variable determines where to locate the Oracle Wallet and `*.ora` files, so it must be set before running `azacsnap` to ensure
            > correct operation.
       
         1. Test the set up with AzAcSnap
       
            After configuring AzAcSnap (for example, `azacsnap -c configure --configuration new`) with the Oracle connect string (for example, `/@AZACSNAP`), 
            it should be possible to connect to the Oracle database.
            
            Check the `$TNS_ADMIN` variable is set for the correct Oracle target system
            
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
            
            Run the `azacsnap` test command
            
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
            
            > [!IMPORTANT]
            > The `$TNS_ADMIN` variable must be set up correctly for `azacsnap` to run correctly, either by adding to the user's `.bash_profile` file, 
            > or by exporting it before each run (for example, `export TNS_ADMIN="/home/orasnap/ORACLE19c" ; cd /home/orasnap/bin ; 
            > ./azacsnap --configfile ORACLE19c.json -c backup --volume data --prefix hourly-ora19c --retention 12`)

---

## Installing the snapshot tools

The downloadable self-installer is designed to make the snapshot tools easy to set up and run with
non-root user privileges (for example, azacsnap). The installer will set up the user and put the snapshot tools
into the users `$HOME/bin` subdirectory (default = `/home/azacsnap/bin`).

The self-installer tries to determine the correct settings and paths for all the files based on the
configuration of the user performing the installation (for example, root). If the previous setup steps (Enable
communication with storage and SAP HANA) were run as root, then the installation will copy the
private key and the `hdbuserstore` to the backup user's location. The steps to enable communication with the storage back-end
and SAP HANA can be manually done by a knowledgeable administrator after the installation.

> [!NOTE]
> For earlier SAP HANA on Azure Large Instance installations, the directory of pre-installed
snapshot tools was `/hana/shared/<SID>/exe/linuxx86_64/hdb`.

With the [pre-requisite steps](#prerequisites-for-installation) completed, it’s now possible to install the snapshot tools using the self-installer as follows:

1. Copy the downloaded self-installer to the target system.
1. Execute the self-installer as the `root` user, see the following example. If necessary, make the
    file executable using the `chmod +x *.run` command.

Running the self-installer command without any arguments will display help on using the installer to
install the snapshot tools as follows:

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

> [!NOTE]
> The self-installer has an option to extract (-X) the snapshot tools from the bundle without
performing any user creation and setup. This allows an experienced administrator to
complete the setup steps manually, or to copy the commands to upgrade an existing
installation.

### Easy installation of snapshot tools (default)

The installer has been designed to quickly install the snapshot tools for SAP HANA on Azure. By default, if the
installer is run with only the -I option, it will do the following steps:

1. Create Snapshot user 'azacsnap', home directory, and set group membership.
1. Configure the azacsnap user's login `~/.profile`.
1. Search filesystem for directories to add to azacsnap's `$PATH`, these are typically the paths to
    the SAP HANA tools, such as `hdbsql` and `hdbuserstore`.
1. Search filesystem for directories to add to azacsnap's `$LD_LIBRARY_PATH`. Many commands
    require a library path to be set in order to execute correctly, this configures it for the
    installed user.
1. Copy the SSH keys for back-end storage for azacsnap from the "root" user (the user running the install). This assumes the "root" user has 
    already configured connectivity to the storage (for more information, see section [Enable communication with storage](#enable-communication-with-storage)).
3. Copy the SAP HANA connection secure user store for the target user, azacsnap. This
    assumes the "root" user has already configured the secure user store (for more information, see section "Enable communication with SAP HANA").
1. The snapshot tools are extracted into `/home/azacsnap/bin/`.
1. The commands in `/home/azacsnap/bin/` have their permissions set (ownership and executable bit, etc.).

The following example shows the correct output of the installer when run with the default
installation option.

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

If the snapshot tools have been installed using the default settings, uninstallation only requires
removing the user the commands have been installed for (default = azacsnap).

```bash
userdel -f -r azacsnap
```

### Manual installation of the snapshot tools

In some cases, it's necessary to install the tools manually, but the recommendation is to use the
installer's default option to ease this process.

Each line starting with a `#` character demonstrates the example commands following the character
are run by the root user. The `\` at the end of a line is the standard line-continuation character for a
shell command.

As the root superuser, a manual installation can be achieved as follows:

1. Get the "sapsys" group ID, in this case the group ID = 1010

    ```bash
    grep sapsys /etc/group
    ```

    ```output
    sapsys:x:1010:
    ```

1. Create Snapshot user 'azacsnap', home directory, and set group membership using the group ID from step 1.

    ```bash
    useradd -m -g 1010 -c "Azure SAP HANA Snapshots User" azacsnap
    ```

1. Make sure the user azacsnap's login `.profile` exists.

    ```bash
    echo "" >> /home/azacsnap/.profile
    ```

1. Search filesystem for directories to add to azacsnap's $PATH, these are typically the paths to
    the SAP HANA tools, such as `hdbsql` and `hdbuserstore`.

    ```bash
    HDBSQL_PATH=`find -L /hana/shared/[A-z0-9][A-z0-9][A-z0-9]/HDB*/exe /usr/sap/hdbclient -name hdbsql -exec dirname {} + 2> /dev/null | sort | uniq | tr '\n' ':'`
    ```

1. Add the updated PATH to the user's profile

    ```bash
    echo "export PATH=\"\$PATH:$HDBSQL_PATH\"" >> /home/azacsnap/.profile
    ```

1. Search filesystem for directories to add to azacsnap's $LD_LIBRARY_PATH.

    ```bash
    NEW_LIB_PATH=`find -L /hana/shared/[A-z0-9][A-z0-9][A-z0-9]/HDB*/exe /usr/sap/hdbclient -name "*.so" -exec dirname {} + 2> /dev/null | sort | uniq | tr '\n' ':'`
    ```

1. Add the updated library path to the user's profile

    ```bash
    echo "export LD_LIBRARY_PATH=\"\$LD_LIBRARY_PATH:$NEW_LIB_PATH\"" >> /home/azacsnap/.profile
    ```
    
1. Actions to take depending on storage back-end:

    # [Azure NetApp Files (with VM)](#tab/azure-netapp-files)

    1. On Azure NetApp Files
        1. Configure the user’s `DOTNET_BUNDLE_EXTRACT_BASE_DIR` path per the .NET Core single-file extract
           guidance.
            1. SUSE Linux

                ```bash
                echo "export DOTNET_BUNDLE_EXTRACT_BASE_DIR=\$HOME/.net" >> /home/azacsnap/.profile
                echo "[ -d $DOTNET_BUNDLE_EXTRACT_BASE_DIR] && chmod 700 $DOTNET_BUNDLE_EXTRACT_BASE_DIR" >> /home/azacsnap/.profile
                ```

            1. RHEL

                ```bash
                echo "export DOTNET_BUNDLE_EXTRACT_BASE_DIR=\$HOME/.net" >> /home/azacsnap/.bash_profile
                echo "[ -d $DOTNET_BUNDLE_EXTRACT_BASE_DIR] && chmod 700 $DOTNET_BUNDLE_EXTRACT_BASE_DIR" >> /home/azacsnap/.bash_profile
                ```

    # [Azure Large Instance (Bare Metal)](#tab/azure-large-instance)

    1. On Azure Large Instances
        1. Copy the SSH keys for back-end storage for azacsnap from the "root" user (the user running
        the install). This assumes the "root" user has already configured connectivity to the storage
           > see section "[Enable communication with storage](#enable-communication-with-storage)".

            ```bash
            cp -pr ~/.ssh /home/azacsnap/.
            ```

        1. Set the user permissions correctly for the SSH files

            ```bash
            chown -R azacsnap.sapsys /home/azacsnap/.ssh
            ```

    ---

1. Copy the SAP HANA connection secure user store for the target user, azacsnap. This
    assumes the "root" user has already configured the secure user store.
    > see section "[Enable communication with database](#enable-communication-with-database)".

    ```bash
    cp -pr ~/.hdb /home/azacsnap/.
    ```

1. Set the user permissions correctly for the `hdbuserstore` files

    ```bash
    chown -R azacsnap.sapsys /home/azacsnap/.hdb
    ```

1. Extract the snapshot tools into /home/azacsnap/bin/.

    ```bash
    ./azacsnap_installer_v5.0.run -X -d /home/azacsnap/bin
    ```

1. Make the commands executable

    ```bash
    chmod 700 /home/azacsnap/bin/*
    ```

1. Ensure the correct ownership permissions are set on the user's home directory

    ```bash
    chown -R azacsnap.sapsys /home/azacsnap/*
    ```

### Complete the setup of snapshot tools

The installer provides steps to complete after the installation of the snapshot tools has been done.
Follow these steps to configure and test the snapshot tools.  After successful testing, then perform the first database
consistent storage snapshot.

The following output shows the steps to complete after running the installer with the default installation options:

1. Change into the snapshot user account
    1. `su - azacsnap`
1. Set up the HANA Secure User Store
   1. `hdbuserstore Set <ADMIN_USER> <HOSTNAME>:<PORT> <admin_user> <password>`
1. Change to location of commands
   1. `cd /home/azacsnap/bin/`
1. Configure the customer details file
   1. `azacsnap -c configure –-configuration new`
1. Test the connection to storage.....
   1. `azacsnap -c test –-test storage`
1. Test the connection to HANA.....
    1. without SSL
       1. `azacsnap -c test –-test hana`
    1. with SSL, you will need to choose the correct SSL option
       1. `azacsnap -c test –-test hana --ssl=<commoncrypto|openssl>`
1. Run your first snapshot backup
    1. `azacsnap -c backup –-volume data--prefix=hana_test --retention=1`

Step 2 will be necessary if "[Enable communication with database](#enable-communication-with-database)" wasn't done before the
installation.

> [!NOTE]
> The test commands should execute correctly. Otherwise, the commands may fail.

## Configuring the database

This section explains how to configure the data base.

# [SAP HANA](#tab/sap-hana)

### SAP HANA Configuration

There are some recommended changes to be applied to SAP HANA to ensure protection of the log backups and catalog. By default, the `basepath_logbackup` and `basepath_catalogbackup` will output their files to the `$(DIR_INSTANCE)/backup/log` directory, and it's unlikely this path is on a volume which `azacsnap` is configured to snapshot these files won't be protected with storage snapshots.

The following `hdbsql` command examples demonstrate setting the log and catalog paths to locations, which are on storage volumes that can be snapshot by `azacsnap`. Be sure to check the values on the command line match the local SAP HANA configuration.

### Configure log backup location

In this example, the change is being made to the `basepath_logbackup` parameter.

```bash
hdbsql -jaxC -n <HANA_ip_address>:30013 -i 00 -u SYSTEM -p <SYSTEM_USER_PASSWORD> "ALTER SYSTEM ALTER CONFIGURATION ('global.ini', 'SYSTEM') SET ('persistence', 'basepath_logbackup') = '/hana/logbackups/H80' WITH RECONFIGURE"
```

### Configure catalog backup location

In this example, the change is being made to the `basepath_catalogbackup` parameter. First, check to ensure the `basepath_catalogbackup` path exists on the filesystem, if not create the path with the same ownership as the directory.

```bash
ls -ld /hana/logbackups/H80/catalog
```

```output
drwxr-x--- 4 h80adm sapsys 4096 Jan 17 06:55 /hana/logbackups/H80/catalog
```

If the path needs to be created, the following example creates the path and sets the correct
ownership and permissions. These commands will need to be run as root.

```bash
mkdir /hana/logbackups/H80/catalog
chown --reference=/hana/shared/H80/HDB00 /hana/logbackups/H80/catalog
chmod --reference=/hana/shared/H80/HDB00 /hana/logbackups/H80/catalog
ls -ld /hana/logbackups/H80/catalog
```

```output
drwxr-x--- 4 h80adm sapsys 4096 Jan 17 06:55 /hana/logbackups/H80/catalog
```

The following example will change the SAP HANA setting.

```bash
hdbsql -jaxC -n <HANA_ip_address>:30013 -i 00 -u SYSTEM -p <SYSTEM_USER_PASSWORD> "ALTER SYSTEM ALTER CONFIGURATION ('global.ini', 'SYSTEM') SET ('persistence', 'basepath_catalogbackup') = '/hana/logbackups/H80/catalog' WITH RECONFIGURE"
```

### Check log and catalog backup locations

After making the changes to the log and catalog backup locations, confirm the settings are correct with the following command.
In this example, the settings that have been set following the example will display as SYSTEM settings.

> This query also returns the DEFAULT settings for comparison.

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

### Configure log backup timeout

The default setting for SAP HANA to perform a log backup is 900 seconds (15 minutes). It's
recommended to reduce this value to 300 seconds (for example, 5 minutes).  Then it's possible to run regular
backups of these files (for example, every 10 minutes).  This is done by adding the log_backups volumes to the OTHER volume section of the
configuration file.

```bash
hdbsql -jaxC -n <HANA_ip_address>:30013 -i 00 -u SYSTEM -p <SYSTEM_USER_PASSWORD> "ALTER SYSTEM ALTER CONFIGURATION ('global.ini', 'SYSTEM') SET ('persistence', 'log_backup_timeout_s') = '300' WITH RECONFIGURE"
```

#### Check log backup timeout

After making the change to the log backup timeout, check to ensure this has been set as follows.
In this example, the settings that have been set will display as the SYSTEM settings, but this
query also returns the DEFAULT settings for comparison.

```bash
hdbsql -jaxC -n <HANA_ip_address> - i 00 -U AZACSNAP "select * from sys.m_inifile_contents where key like '%log_backup_timeout%' "
```

```output
global.ini,DEFAULT,,,persistence,log_backup_timeout_s,900
global.ini,SYSTEM,,,persistence,log_backup_timeout_s,300
```

# [Oracle](#tab/oracle)

The following changes must be applied to the Oracle Database to allow for monitoring by the database administrator. 

1. Set up Oracle alert logging
   
   Use the following Oracle SQL commands while connected to the database as SYSDBA to create a stored procedure under the default Oracle SYSBACKUP database account. 
   These SQL commands allow AzAcSnap to output messages to standard output using the PUT_LINE procedure in the DBMS_OUTPUT package, and also to the Oracle database `alert.log` 
   file (using the KSDWRT procedure in the DBMS_SYSTEM package).
    
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

---

## Next steps

- [Configure Azure Application Consistent Snapshot tool](azacsnap-cmd-ref-configure.md)
