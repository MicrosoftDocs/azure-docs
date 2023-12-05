---
title: Troubleshoot Azure Application Consistent Snapshot tool - Azure NetApp Files
description: Troubleshoot communication issues, test failures, and other SAP HANA issues when using the Azure Application Consistent Snapshot (AzAcSnap) tool.
services: azure-netapp-files
documentationcenter: ''
author: Phil-Jensen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: troubleshooting
ms.date: 01/16/2023
ms.author: phjensen
ms.custom: kr2b-contr-experiment
---

# Troubleshoot the Azure Application Consistent Snapshot (AzAcSnap) tool

This article describes how to troubleshoot issues when using the Azure Application Consistent Snapshot (AzAcSnap) tool for Azure NetApp Files and Azure Large Instance.

You might encounter several common issues when running AzAcSnap commands. Follow the instructions to troubleshoot the issues. If you still have issues, open a Service Request for Microsoft Support from the Azure portal and assign the request to the SAP HANA Large Instance queue.

## AzAcSnap command won't run

In some cases AzAcSnap won't start due to the user's environment.

### Failed to create CoreCLR

AzAcSnap is written in .NET and the CoreCLR is an execution engine for .NET apps, performing functions such as IL byte code loading, compilation to machine code and garbage collection.  In this case there is an environmental problem blocking the CoreCLR engine from starting.

A common cause is limited permissions or environmental setup for the AzAcSnap operating system user, usually 'azacsnap'.

The error `Failed to create CoreCLR, HRESULT: 0x80004005` can be caused by lack of write access for the azacsnap user to the system's `TMPDIR`.

> [!NOTE]
> All command lines starting with `#` are commands run as `root`, all command lines starting with `>` are run as `azacsnap` user.

Check the `/tmp` ownership and permissions (note in this example only the `root` user can read and write to `/tmp`):

```bash
# ls -ld /tmp
drwx------ 9 root root 8192 Mar 31 10:50 /tmp
```

A typical `/tmp` has the following permissions, which would allow the azacsnap user to run the azacsnap command: 
```bash
# ls -ld /tmp
drwxrwxrwt 9 root root 8192 Mar 31 10:51 /tmp
```

If it's not possible to change the `/tmp` directory permissions, then create a user specific `TMPDIR`.
 
Make a `TMPDIR` for the `azacsnap` user:

```bash
> mkdir /home/azacsnap/_tmp
> export TMPDIR=/home/azacsnap/_tmp
> azacsnap -c about
```

```output
 
 
                            WKO0XXXXXXXXXXXNW
                           Wk,.,oxxxxxxxxxxx0W
                           0;.'.;dxxxxxxxxxxxKW
                          Xl'''.'cdxxxxxxxxxdkX
                         Wx,''''.,lxxxxdxdddddON
                         0:''''''.;oxdddddddddxKW
                        Xl''''''''':dddddddddddkX
                       Wx,''''''''':ddddddddddddON
                       O:''''''''',xKxddddddoddod0W
                      Xl''''''''''oNW0dooooooooooxX
                     Wx,,,,,,'','c0WWNkoooooooooookN
                    WO:',,,,,,,,;cxxxxooooooooooooo0W
                    Xl,,,,,,,;;;;;;;;;;:llooooooooldX
                   Nx,,,,,,,,,,:c;;;;;;;;coooollllllkN
                  WO:,,,,,,,,,;kXkl:;;;;,;lolllllllloOW
                  Xl,,,,,,,,,,dN WNOl:;;;;:lllllllllldK
                  0c,;;;;,,,;lK     NOo:;;:clllllllllo0W
                  WK000000000N        NK000KKKKKKKKKKXW
 
 
                Azure Application Consistent Snapshot Tool
                       AzAcSnap 7a (Build: 1AA8343)
```

> [!IMPORTANT]
> Changing the user's `TMPDIR` would need to be made permanent by changing the user's profile (e.g. `$HOME/.bashrc` or `$HOME/.bash_profile`).  There would also be a need to clean-up the `TMPDIR` on system reboot, this is typically automatic for `/tmp`.

## Check log files, result files, and syslog

Some of the best sources of information for investigating AzAcSnap issues are the log files, result files, and the system log.

### Log files

The AzAcSnap log files are stored in the directory configured by the `logPath` parameter in the AzAcSnap configuration file. The default configuration filename is *azacsnap.json*, and the default value for `logPath` is *./logs*, which means the log files are written into the *./logs* directory relative to where the `azacsnap` command runs. If you make the `logPath` an absolute location, such as */home/azacsnap/logs*, `azacsnap` always outputs the logs into */home/azacsnap/logs*, regardless of where you run the `azacsnap` command.

The log filename is based on the application name, `azacsnap`, the command run with `-c`, such as `backup`, `test`, or `details`, and the default configuration filename, such as *azacsnap.json*. With the `-c backup` command, a default log filename would be *azacsnap-backup-azacsnap.log*, written into the  directory configured by `logPath`.

This naming convention allows for multiple configuration files, one per database, to help locate the associated log files. If the configuration filename is *SID.json*, then the log filename when using the `azacsnap -c backup --configfile SID.json` option is *azacsnap-backup-SID.log*.

### Result files and syslog

For the `-c backup` command, AzAcSnap writes to a *\*.result* file.  The purpose of the *\*.result* file is to provide high-level confirmation of success/failure.  If the *\*.result* file is empty, then assume failure.  Any output written to the *\*.result* file is also output to the system log (for example, `/var/log/messages`) by using the `logger` command. The *\*.result* filename has the same base name as the log file to allow for matching the result file with the configuration file and the backup log file.  The *\*.result* file goes into the same location as the other log files and is a simple one line output file.

1. Example for successful completion:

   1. Output to *\*.result* file:
   
      ```output
      Database # 1 (PR1) : completed ok
      ```

   1. Output to `/var/log/messages`:

      ```output
      Dec 17 09:01:13 azacsnap-rhel azacsnap: Database # 1 (PR1) : completed ok
      ```

1. Example output where a failure has occured and AzAcSnap captured the failure:

   1. Output to *\*.result* file:
   
      ```output
      Database # 1 (PR1) : failed
      ```

   1. Output to `/var/log/messages`:

      ```output
      Dec 19 09:00:30 azacsnap-rhel azacsnap: Database # 1 (PR1) : failed
      ```

## Troubleshoot failed 'test storage' command

The command `azacsnap -c test --test storage` might not complete successfully.

### Check network firewalls

Communication with Azure NetApp Files might fail or time out. To troubleshoot, make sure firewall rules aren't blocking outbound traffic from the system running AzAcSnap to the following addresses and TCP/IP ports:

- `https://management.azure.com:443`
- `https://login.microsoftonline.com:443`

### Use Cloud Shell to validate configuration files

You can test whether the service principal is configured correctly by using Cloud Shell through the Azure portal. Using Cloud Shell tests for correct configuration, bypassing network controls within a virtual network or virtual machine (VM).

1. In the Azure portal, open a [Cloud Shell](../cloud-shell/overview.md) session.
1. Make a test directory, for example `mkdir azacsnap`.
1. Switch to the *azacsnap* directory, and download the latest version of AzAcSnap.
   
   ```bash
   wget https://aka.ms/azacsnapinstaller
   ```
1. Make the installer executable, for example `chmod +x azacsnapinstaller`.
1. Extract the binary for testing.

   ```bash
   ./azacsnapinstaller -X -d .
   ```
   The results look like the following output:

   ```output
   +-----------------------------------------------------------+
   | Azure Application Consistent Snapshot Tool Installer |
   +-----------------------------------------------------------+
   |-> Installer version '5.0.2_Build_20210827.19086'
   |-> Extracting commands into ..
   |-> Cleaning up .NET extract dir
   ```

1. Use the Cloud Shell Upload/Download icon to upload the service principal file, *azureauth.json*, and the AzAcSnap configuration file, such as *azacsnap.json*, for testing.
1. Run the `storage` test.

   ```bash
   ./azacsnap -c test --test storage
   ```

   > [!NOTE]
   > The test command can take about 90 seconds to complete.

### Failed test on Azure Large Instance

The following error example is from running `azacsnap` on Azure Large Instance:

```bash
azacsnap -c test --test storage
```

```output
The authenticity of host '172.18.18.11 (172.18.18.11)' can't be established.
ECDSA key fingerprint is SHA256:QxamHRn3ZKbJAKnEimQpVVCknDSO9uB4c9Qd8komDec.
Are you sure you want to continue connecting (yes/no)?
```

To troubleshoot this error, don't respond `yes`. Make sure that your storage IP address is correct. You can confirm the storage IP address with the Microsoft operations team.

The error usually appears when the Azure Large Instance storage user doesn't have access to the underlying storage. To determine whether the storage user has access to storage, run the `ssh` command to validate communication with the storage platform.

```bash
ssh <StorageBackupname>@<Storage IP address> "volume show -fields volume"
```

The following example shows the expected output:

```bash
ssh clt1h80backup@10.8.0.16 "volume show -fields volume"
```

```output
vserver volume
--------------------------------- ------------------------------
osa33-hana-c01v250-client25-nprod hana_data_h80_mnt00001_t020_vol
osa33-hana-c01v250-client25-nprod hana_data_h80_mnt00002_t020_vol
```

### Failed test with Azure NetApp Files

The following error example is from running `azacsnap` with Azure NetApp Files:

```bash
azacsnap --configfile azacsnap.json.NOT-WORKING -c test --test storage
```

```output
BEGIN : Test process started for 'storage'
BEGIN : Storage test snapshots on 'data' volumes
BEGIN : 1 task(s) to Test Snapshots for Storage Volume Type 'data'
ERROR: Could not create StorageANF object [authFile = 'azureauth.json']
```

To troubleshoot this error:

1. Check for the existence of the service principal file, *azureauth.json*, as set in the *azacsnap.json* configuration file.
1. Check the log file, for example, *logs/azacsnap-test-azacsnap.log*, to see if the service principal file has the correct content. The following log file output shows that the client secret key is invalid.

   ```output
   [19/Nov/2020:18:39:49 +13:00] DEBUG: [PID:0020080:StorageANF:659] [1] Innerexception: Microsoft.IdentityModel.Clients.ActiveDirectory.AdalServiceException AADSTS7000215: Invalid client secret is provided.
   ```

1. Check the log file to see if the service principal has expired. The following log file example shows that the client secret keys are expired.

   ```output
   [19/Nov/2020:18:41:10 +13:00] DEBUG: [PID:0020257:StorageANF:659] [1] Innerexception: Microsoft.IdentityModel.Clients.ActiveDirectory.AdalServiceException AADSTS7000222: The provided client secret keys are expired. Visit the Azure Portal to create new keys for your app, or consider using certificate credentials for added security: https://learn.microsoft.com/azure/active-directory/develop/active-directory-certificate-credentials
   ```

> [!TIP]
> For more information on generating a new Service Principal, refer to the section [Enable communication with Storage](azacsnap-installation.md?tabs=azure-netapp-files%2Csap-hana#enable-communication-with-storage) in the [Install Azure Application Consistent Snapshot tool](azacsnap-installation.md) guide.

## Troubleshoot failed 'test hana' command

The command `azacsnap -c test --test hana` might not complete successfully.

### Command not found

When setting up communication with SAP HANA, the `hdbuserstore` program is used to create the secure communication settings. AzAcSnap also requires the `hdbsql` program for all communications with SAP HANA. These programs are usually under */usr/sap/\<SID>/SYS/exe/hdb/* or */usr/sap/hdbclient* and must be in the user's `$PATH`.

- In the following example, the `hdbsql` command isn't in the user's `$PATH`.

  ```bash
  hdbsql -n 172.18.18.50 - i 00 -U AZACSNAP "select version from sys.m_database"
  ```

  ```output
  If 'hdbsql' is not a typo you can use command-not-found to lookup the package that contains it, like this:
  cnf hdbsql
  ```

- The following example temporarily adds the `hdbsql` command to the user's `$PATH`, allowing `azacsnap` to run correctly.

  ```bash
  export PATH=$PATH:/hana/shared/H80/exe/linuxx86_64/hdb/
  ```

Make sure the installer added the location of these files to the AzAcSnap user's `$PATH`. 

> [!NOTE]
> To permanently add to the user's `$PATH`, update the user's *$HOME/.profile* file.

### Invalid value for key

This command output shows that the connection key hasn't been set up correctly with the `hdbuserstore Set` command.

```bash
hdbsql -n 172.18.18.50 -i 00 -U AZACSNAP "select version from sys.m_database"
```

```output
* -10104: Invalid value for KEY (AZACSNAP)
```

For more information on setup of the `hdbuserstore`, see [Get started with AzAcSnap](azacsnap-get-started.md).

### Failed test

When validating communication with SAP HANA by running a test with `azacsnap -c test --test hana`, you might get the following error:

```output
> azacsnap -c test --test hana
BEGIN : Test process started for 'hana'
BEGIN : SAP HANA tests
CRITICAL: Command 'test' failed with error:
Cannot get SAP HANA version, exiting with error: 127
```

To troubleshoot this error:

1. Check the configuration file, for example *azacsnap.json*, for each HANA instance, to ensure that the SAP HANA database values are correct.
1. Run the following command to verify that the `hdbsql` command is in the path and that it can connect to the SAP HANA server.

   ```bash
   hdbsql -n 172.18.18.50 - i 00 -d SYSTEMDB -U AZACSNAP "\s"
   ```

   The following example shows the output when the command runs correctly:

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

### Insufficient privilege error

If running `azacsnap` presents an error such as `* 258: insufficient privilege`, check that the user has the appropriate AZACSNAP database user privileges set up per the [installation guide](azacsnap-installation.md#enable-communication-with-the-database). Verify the user's privileges with the following command:

```bash
hdbsql -U AZACSNAP "select GRANTEE,GRANTEE_TYPE,PRIVILEGE,IS_VALID,IS_GRANTABLE from sys.granted_privileges " | grep -i -e GRANTEE -e azacsnap
```

The command should return the following output:

```output
GRANTEE,GRANTEE_TYPE,PRIVILEGE,IS_VALID,IS_GRANTABLE
"AZACSNAP","USER","BACKUP ADMIN","TRUE","FALSE"
"AZACSNAP","USER","CATALOG READ","TRUE","FALSE"
"AZACSNAP","USER","CREATE ANY","TRUE","TRUE"
```

The error might provide further information to help determine the required SAP HANA privileges, such as `Detailed info for this error can be found with guid '99X9999X99X9999X99X99XX999XXX999' SQLSTATE: HY000`. In this case, follow the instructions at [SAP Help Portal - GET_INSUFFICIENT_PRIVILEGE_ERROR_DETAILS](https://help.sap.com/viewer/b3ee5778bc2e4a089d3299b82ec762a7/2.0.05/en-US/9a73c4c017744288b8d6f3b9bc0db043.html), which recommend using the following SQL query to determine the details of the required privilege:

```sql
CALL SYS.GET_INSUFFICIENT_PRIVILEGE_ERROR_DETAILS ('99X9999X99X9999X99X99XX999XXX999', ?)
```

```output
GUID,CREATE_TIME,CONNECTION_ID,SESSION_USER_NAME,CHECKED_USER_NAME,PRIVILEGE,IS_MISSING_ANALYTIC_PRIVILEGE,IS_MISSING_GRANT_OPTION,DATABASE_NAME,SCHEMA_NAME,OBJECT_NAME,OBJECT_TYPE
"99X9999X99X9999X99X99XX999XXX999","2021-01-01 01:00:00.180000000",120212,"AZACSNAP","AZACSNAP","DATABASE ADMIN or DATABASE BACKUP ADMIN","FALSE","FALSE","","","",""
```

In the preceding example, adding the `DATABASE BACKUP ADMIN` privilege to the SYSTEMDB's AZACSNAP user should resolve the insufficient privilege error.

## Next steps

- [Tips and tricks for using AzAcSnap](azacsnap-tips.md)
- [AzAcSnap command reference](azacsnap-cmd-ref-configure.md)


