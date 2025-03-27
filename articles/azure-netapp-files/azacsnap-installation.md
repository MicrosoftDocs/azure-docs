---
title: Install the Azure Application Consistent Snapshot tool for Azure NetApp Files
description: Learn how to install the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files.
services: azure-netapp-files
author: Phil-Jensen
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 05/15/2024
ms.author: phjensen
---

# Install the Azure Application Consistent Snapshot tool

This article provides a guide for installation of the Azure Application Consistent Snapshot tool (AzAcSnap) that you can use with Azure NetApp Files or Azure Large Instances.

> [!IMPORTANT]
> Distributed installations are the only option for Azure Large Instances systems, because they're deployed in a private network. You must install AzAcSnap on each system to ensure connectivity.

AzAcSnap 10 supports more databases and operating systems, therefore a self-installer is no longer available.

## Download AzAcSnap

First, download the AzAcSnap executable file to any directory on your computer. AzAcSnap is provided as an executable file, so there's nothing to install.

- [Linux x86-64](https://aka.ms/azacsnap-linux) (binary)
  - The Linux binary has an associated [Linux signature file](https://aka.ms/azacsnap-linux-signature). This file is signed with Microsoft's public key to allow for GPG verification of the downloaded installer.

  > [!IMPORTANT]
  > The installer is no longer available for Linux. Please follow the [guidelines here](azacsnap-installation.md) to set up the user's profile to run AzAcSnap and its dependencies.

- [Windows 64-bit](https://aka.ms/azacsnap-windows) (executable)
  - The Windows binary is signed by Microsoft.

Once these downloads are completed, then [Install Azure Application Consistent Snapshot tool](azacsnap-installation.md).


## Prerequisites for installation

Follow the guidelines to set up and run the snapshots and disaster-recovery commands. We recommend that you complete the following steps as root before you install and use the snapshot tools:

1. Patch the operating system
   1. For SUSE on Azure Large Instances, set up SUSE Subscription Management Tool (SMT). For more information, see [Install and configure SAP HANA (Large Instances) on Azure](/azure/virtual-machines/workloads/sap/hana-installation#operating-system).
1. Set up time synchronization. Provide a time server that's compatible with the Network Time Protocol (NTP), and configure the operating system accordingly.
1. Install the database. Follow the instructions for the supported database that you're using.
1. Select the storage back end that you're using for your deployment. For more information, see [Enable communication with storage](azacsnap-configure-storage.md#enable-communication-with-storage) later in this article.

1. Enable communication with the database. For more information, see [Enable communication with the database](azacsnap-configure-database.md#enable-communication-with-the-database) later in this article.

    # [SAP HANA](#tab/sap-hana)

    Set up an appropriate SAP HANA user by following the instructions in the section to [enable communication with the database](azacsnap-configure-database.md#enable-communication-with-the-database) in the database configuration document.

    After setup, you can test the connection from the command line by using the following examples. The following examples are for non-SSL communication to SAP HANA.

    HANA 1.0:

    `hdbsql -n <HANA IP address> -i <HANA instance> -U <HANA user> "\s"`

    HANA 2.0:

    `hdbsql -n <HANA IP address> -i <HANA instance> -d SYSTEMDB -U <HANA user> "\s"`

    # [Oracle](#tab/oracle)

    Set up an appropriate Oracle database and Oracle wallet by following the instructions in the section to [enable communication with the database](azacsnap-configure-database.md#enable-communication-with-the-database) in the database configuration document.

    After setup, you can test the connection from the command line by using the following example:

    `sqlplus /@<ORACLE_USER> as SYSBACKUP`

    # [IBM Db2](#tab/db2)

    Set up an appropriate IBM Db2 connection method by following the instructions in the section to [enable communication with the database](azacsnap-configure-database.md#enable-communication-with-the-database) in the database configuration document.

    After setup, test the connection from the command line by using the following examples:

    - Install onto the database server, and then complete the setup with [Db2 local connectivity](azacsnap-configure-database.md#db2-local-connectivity):

      `db2 "QUIT"`

    - Install onto a centralized backup system, and then complete the setup with [Db2 remote connectivity](azacsnap-configure-database.md#db2-remote-connectivity):

      `ssh <InstanceUser>@<ServerAddress> 'db2 "QUIT"'`

    The preceding commands should produce the following output:

    ```output
    DB20000I  The QUIT command completed successfully.
    ```

    # [Microsoft SQL Server](#tab/mssql)

    There are no specific database connection requirements for MS SQL Server as AzAcSnap has built-in connectivity to MS SQL Server.
   
    ---
## Install the snapshot tools

With the [prerequisite steps](#prerequisites-for-installation) completed, the steps to install AzAcSnap are as follows:

1. Create snapshot user `azacsnap`, create the home directory, and set group membership.
1. Configure the `azacsnap` user's login `~/.profile` information.
1. Search the file system for directories to add to `$PATH` (Linux) or `%PATH%` (Windows) for AzAcSnap. This task allows the user who runs AzAcSnap to use database specific commands, such as `hdbsql` and `hdbuserstore`.
1. Search the file system for directories to add to `$LD_LIBRARY_PATH` (Linux) for AzAcSnap. Many commands require you to set a library path to run them correctly.
1. Copy AzAcSnap binary into a location on the user's `$PATH` (Linux) or `%PATH%` (Windows).
1. On Linux it may be necessary to set the `azacsnap` binary permissions set correctly, including ownership and executable bit.

Performing the following steps to get azacsnap running:

- For Linux via a shell session:
  1. As the root superuser, create a Linux User
     1. `useradd -m azacsnap`
  1. Log in as the user
     1. `su – azacsnap`
     1. `cd $HOME/bin`
  1. Download [azacsnap](https://aka.ms/azacsnap-linux)
     1. `wget -O azacsnap https://aka.ms/azacsnap-linux`
  1. Run azacsnap
     1. `azacsnap -c about`

- For Windows via a GUI:
  1. Create a Windows User
  1. Log in as the user
  1. Download [`azacsnap.exe`](https://aka.ms/azacsnap-windows)
  1. Open a terminal session and run azacsnap
     1. `azacsnap.exe -c about`


## Update user profile

The user running AzAcSnap needs to have any environment variables updated to ensure AzAcSnap can run the database specific commands without needing the command's full path. This method allows for overriding the database commands if needed for special purposes.

- SAP HANA requires `hdbuserstore` and `hdbsql`.
- OracleDB requires `sqlplus`.
- IBM Db2 requires `db2` and `ssh` (for remote access to Db2 when doing a centralized installation).

### Linux

On Linux setup of the user's `$PATH` is typically done by updating the users `$HOME/.profile` with the appropriate `$PATH` information for locating binaries, and potentially the `LD_LIBRARY_PATH` variable to ensure availability of shared objects for the Linux binaries.

1. Search the file system for directories to add to `$PATH` for AzAcSnap. 

   For example:

    ```bash
    # find the path for the hdbsql command
    export DBCMD="hdbsql"
    find / -name ${DBCMD} -exec dirname {} + 2> /dev/null | sort | uniq | tr '\n' ':'
    /hana/shared/PR1/exe/linuxx86_64/HDB_2.00.040.00.1553674765_c8210ee40a82860643f1874a2bf4ffb67a7b2add
    #
    # add the output to the user's profile
    echo "export PATH=\"\$PATH:/hana/shared/PR1/exe/linuxx86_64/HDB_2.00.040.00.1553674765_c8210ee40a82860643f1874a2bf4ffb67a7b2add\"" >> /home/azacsnap/.profile
    #
    # add any shared objects to the $LD_LIBRARY_PATH
    export SHARED_OBJECTS='*.so'
    NEW_LIB_PATH=`find -L /hana/shared/[A-z0-9][A-z0-9][A-z0-9]/HDB*/exe /usr/sap/hdbclient -name "*.so" -exec dirname {} + 2> /dev/null | sort | uniq | tr '\n' ':'`
    #
    # add the output to the user's profile
    echo "export LD_LIBRARY_PATH=\"\$LD_LIBRARY_PATH:$NEW_LIB_PATH\"" >> /home/azacsnap/.profile
    ```
    
### Windows

Use the Windows specific tools to find the location of the commands and add their directories to the users profile.


1. Take the following actions, depending on the storage back end:

    # [Azure NetApp Files (with VM)](#tab/azure-netapp-files)

    No special actions for Azure NetApp Files.

    # [Azure Large Instances (bare metal)](#tab/azure-large-instance)

    1. Make sure the PKCS12 certificate file is available for the AzAcSnap user to read. This step assumes connectivity to the storage is already configured. For more information, see the earlier section [Enable communication with storage](azacsnap-configure-storage.md#enable-communication-with-storage).

    ---


### Uninstall the snapshot tools

If you installed the snapshot tools by using the default settings, uninstallation requires only removing the user that you installed the commands for and deleting the AzAcSnap binary.

### Complete the setup of snapshot tools

These steps can be followed to configure and test the snapshot tools.

1. Log in to the AzAcSnap user account.
   a. For Linux, `su - azacsnap`.
   a. For Windows, log in as the AzAcSnap user.
1. If you have added the AzAcSnap binary to the user's `$PATH` (Linux) or `%PATH%` (Windows), then run AzAcSnap with `azacsnap`, or you need to add the full path to the AzAcSnap binary (for example. `/home/azacsnap/bin/azacsnap` (Linux) or `C:\Users\AzAcSnap\azacsnap.exe` (Windows)).
1. Configure the customer details file.
     `azacsnap -c configure --configuration new`
1. Test the connection to storage.
     `azacsnap -c test --test storage`
1. Test the connection to the database.
   a. SAP HANA
     `azacsnap -c test --test hana`
   a. Oracle DB
     `azacsnap -c test --test oracle`
   a. IBM Db2
     `azacsnap -c test --test db2`

If the test commands run correctly, the test is successful. You can then perform the first database-consistent storage snapshot.

- `azacsnap -c backup --volume data --prefix adhoc_test --retention 1`


## Next steps

- [Configure the database for Azure Application Consistent Snapshot tool](azacsnap-configure-database.md)
