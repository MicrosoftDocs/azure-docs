---
title: Troubleshoot Azure Application Consistent Snapshot tool for Azure NetApp Files | Microsoft Docs
description: Provides troubleshooting content for using the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: Phil-Jensen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: troubleshooting
ms.date: 04/21/2021
ms.author: phjensen
---

# Troubleshoot Azure Application Consistent Snapshot tool

This article provides troubleshooting content for using the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files.

The following are common issues that you may encounter while running the commands. Follow the resolution instructions mentioned to fix the issue. If you still encounter an issue, open a Service Request from Azure portal and assign the request into the SAP HANA Large Instance queue for Microsoft Support to respond.

## Log files

One of the best sources of information for debugging any errors with AzAcSnap are the log files.  

### Log file location

The log files are stored in the directory configured per the `logPath` parameter in the AzAcSnap configuration file.  The default configuration filename is `azacsnap.json` and the default value for `logPath` is `"./logs"` which means the log files are written into the `./logs` directory relative to where the `azacsnap` command is run.  Making the `logPath` an absolute location (e.g. `/home/azacsnap/logs`) will ensure `azacsnap` outputs the logs into `/home/azacsnap/logs` irrespective of where the `azacsnap` command was run.

### Log file naming

The log filename is based on the application name (e.g. `azacsnap`), the  command option (`-c`) used (e.g. `backup`, `test`, `details`, etc.) and the configuration filename (e.g. default = `azacsnap.json`).  So if using the `-c backup` command, the log  filename by default would be `azacsnap-backup-azacsnap.log` and is written into the  directory configured by `logPath`.  

This naming convention was established to allow for multiple configuration files, one per database, and ensure ease of locating the associated logfiles.  Therefore, if the configuration filename is `SID.json`, then the result filename when using the `azacsnap -c backup --configfile SID.json` options will be `azacsnap-backup-SID.log`.

### Result file and syslog

For the `-c backup` command option AzAcSnap writes out to a `*.result` file and the system log (`/var/log/messages`) using the `logger` command.  The `*.result` filename has the same base name as the [log file](#log-file-naming) and goes into the same [location as the log file](#log-file-location).  It is a simple one line output file per the following examples.

Example output from `*.result` file.
```output
Database # 1 (PR1) : completed ok
```

Example output from `/var/log/messages` file.
```output
Dec 17 09:01:13 azacsnap-rhel azacsnap: Database # 1 (PR1) : completed ok
```

## Failed communication with Azure NetApp Files

When validating communication with Azure NetApp Files, communication might fail or time-out.  Check to ensure firewall rules are not blocking outbound traffic from the system running AzAcSnap to the following addresses and TCP/IP ports:-

- (https://)management.azure.com:443
- (https://)login.microsoftonline.com:443 

## Failed communication with SAP HANA

When validating communication with SAP HANA by running a test with `azacsnap -c test --test hana` and it provides the following error:

```output
> azacsnap -c test --test hana
BEGIN : Test process started for 'hana'
BEGIN : SAP HANA tests
CRITICAL: Command 'test' failed with error:
Cannot get SAP HANA version, exiting with error: 127
```

**Solution:**

1. Check the configuration file (for example, `azacsnap.json`) for each HANA instance to ensure the SAP HANA database values are correct.
1. Try to run the command below to verify if the `hdbsql` command is in the path and it can connect to the SAP HANA Server. The following example shows the correct running of the command and its output.

    ```bash
    hdbsql -n 172.18.18.50 - i 00 -d SYSTEMDB -U AZACSNAP "\s"
    ```

    ```output
    host          : 172.18.18.50
    sid           : H80
    dbname        : SYSTEMDB
    user          : AZACSNAP
    kernel version: 2.00.040.00.1553674765
    SQLDBC version:        libSQLDBCHDB 2.04.126.1551801496
    autocommit    : ON
    locale        : en_US.UTF-8
    input encoding: UTF8
    sql port      : saphana1:30013
    ```

    In this example, the `hdbsql` command isn't in the users `$PATH`.

    ```bash
    hdbsql -n 172.18.18.50 - i 00 -U SCADMIN "select version from sys.m_database"
    ```

    ```output
    If 'hdbsql' is not a typo you can use command-not-found to lookup the package that contains it, like this:
    cnf hdbsql
    ```

    In this example, the `hdbsql` command is temporarily added to the user's `$PATH`, but when run shows the connection key hasn't been set up correctly with the `hdbuserstore Set` command (refer to Getting Started guide for details):

    ```bash
    export PATH=$PATH:/hana/shared/H80/exe/linuxx86_64/hdb/
    ```

    ```bash
    hdbsql -n 172.18.18.50 -i 00 -U SCADMIN "select version from sys.m_database"
    ```

    ```output
    * -10104: Invalid value for KEY (SCADMIN)
    ```

    > [!NOTE]
    > To permanently add to the user's `$PATH`, update the user's `$HOME/.profile` file

## The `hdbuserstore` location

When setting up communication with SAP HANA, the `hdbuserstore` program is used to create the secure communication settings.  The `hdbuserstore` program is usually found under `/usr/sap/<SID>/SYS/exe/hdb/` or `/usr/sap/hdbclient`.  Normally the installer adds the correct location to the `azacsnap` user's `$PATH`.

## Failed test with storage

The command `azacsnap -c test --test storage` does not complete successfully.

### Azure Large Instance

The following example is from running `azacsnap` on SAP HANA on Azure Large Instance:

```bash
azacsnap -c test --test storage
```

```output
The authenticity of host '172.18.18.11 (172.18.18.11)' can't be established.
ECDSA key fingerprint is SHA256:QxamHRn3ZKbJAKnEimQpVVCknDSO9uB4c9Qd8komDec.
Are you sure you want to continue connecting (yes/no)?
```

**Solution:** The above error normally shows up when Azure Large Instance storage user has no access to the underlying storage. To validate access to storage with the provided storage user, run the `ssh`
command to validate communication with the storage platform.

```bash
ssh <StorageBackupname>@<Storage IP address> "volume show -fields volume"
```

An example with expected output:

```bash
ssh clt1h80backup@10.8.0.16 "volume show -fields volume"
```

```output
vserver volume
--------------------------------- ------------------------------
osa33-hana-c01v250-client25-nprod hana_data_h80_mnt00001_t020_vol
osa33-hana-c01v250-client25-nprod hana_data_h80_mnt00002_t020_vol
```

#### The authenticity of host '172.18.18.11 (172.18.18.11)' can't be established

```bash
azacsnap -c test --test storage
```

```output
BEGIN : Test process started for 'storage'
BEGIN : Storage test snapshots on 'data' volumes
BEGIN : 1 task(s) to Test Snapshots for Storage Volume Type 'data'
The authenticity of host '10.3.0.18 (10.3.0.18)' can't be established.
ECDSA key fingerprint is SHA256:cONAr0lpafb7gY4l31AdWTzM3s9LnKDtpMdPA+cxT7Y.
Are you sure you want to continue connecting (yes/no)?
```

**Solution:** Do not select Yes. Ensure that your storage IP address is correct. If there is still an
issue, confirm the storage IP address with Microsoft operations team.

### Azure NetApp Files

The following example is from running `azacsnap` on a VM using Azure NetApp Files:

```bash
azacsnap --configfile azacsnap.json.NOT-WORKING -c test --test storage
```

```output
BEGIN : Test process started for 'storage'
BEGIN : Storage test snapshots on 'data' volumes
BEGIN : 1 task(s) to Test Snapshots for Storage Volume Type 'data'
ERROR: Could not create StorageANF object [authFile = 'azureauth.json']
```

**Solution:**

1. Check for the existence of the Service Principal file, `azureauth.json`, as set in the `azacsnap.json` configuration file.
1. Check the log file (for example, `logs/azacsnap-test-azacsnap.log`) to see if the Service Principal (`azureauth.json`) has the correct content.  Example from log as follows:

      ```output
      [19/Nov/2020:18:39:49 +13:00] DEBUG: [PID:0020080:StorageANF:659] [1] Innerexception: Microsoft.IdentityModel.Clients.ActiveDirectory.AdalServiceException AADSTS7000215: Invalid client secret is provided.
      ```

1. Check the log file (for example, `logs/azacsnap-test-azacsnap.log`) to see if the Service Principal (`azureauth.json`) has expired. Example from log as follows:

      ```output
      [19/Nov/2020:18:41:10 +13:00] DEBUG: [PID:0020257:StorageANF:659] [1] Innerexception: Microsoft.IdentityModel.Clients.ActiveDirectory.AdalServiceException AADSTS7000222: The provided client secret keys are expired. Visit the Azure Portal to create new keys for your app, or consider using certificate credentials for added security: https://docs.microsoft.com/azure/active-directory/develop/active-directory-certificate-credentials
      ```

## Next steps

- [Tips](azacsnap-tips.md)
