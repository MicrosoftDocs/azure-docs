---
title: Configure SAP ASE (Sybase) database backup on Azure VMs using Azure Backup
description: In this article, learn how to configure backup for SAP ASE (Sybase) databases that are running on Azure virtual machines.
ms.topic: how-to
ms.date: 11/12/2024
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Configure SAP ASE (Sybase) database backup on Azure VMs via Azure Backup

This article describes how to configure backup for SAP Adaptive Server Enterprise (ASE) (Sybase) databases that are running on Azure virtual machines (VMs) on the Azure portal.

>[!Note]
>Learn about the [supported configurations and scenarios for SAP ASE database backup](sap-ase-backup-support-matrix.md) on Azure VMs.

## Prerequisites

Before you set up the SAP ASE database for backup, ensure that:
- Identify or create a Recovery Services vault in the same region and subscription as the VM running SAP ASE.
- Allow connectivity from the VM to the internet, so that it can reach Azure.
- The combined length of the SAP ASE Server VM name and the Resource Group name doesn't exceed 84 characters for Azure Resource Manager (ARM_ VMs (and 77 characters for classic VMs). This limitation is because some characters are reserved by the service.
- VM has python >= 3.6.15 (recommended- Python3.10) and python's requests module should be installed. Default sudo python3 should run python 3.6.15 or newer version. Please validate by running python3 and ‘sudo python3’ in your system and check which python version it runs by default. It should run the required version, you can change it by linking python3 to python 3.6.15 or higher.
- Run the SAP ASE backup configuration script (pre-registration script) in the virtual machine where ASE is installed, as the root user. This script gets the ASE system ready for backup. Learn more [about the pre-registration script  workflow](#preregistration-script-workflow).
- Run the pre-registration script with the -sn or --skip-network-checks parameter, if your ASE setup uses Private Endpoints. <hyperlink - https://aka.ms/preregscriptsapase wherever ASE pre-registration script needs to be downloaded>
- Assign the following privileges and settings for the backup operation:
-  
  | Privilege/ Setting | Description |
  | --- | --- |
  | Operator role | Enable this **ASE database role** for the database user to create a custom database user for the backup and restore operations and pass it in the pre-registration script. |
  | **Map external file** privilege | Enable this role to allow database file access. |
  | **Own any database** privilege |Enables  the differential backup  feature for the SAP ASE database. |
  | **Trunc log on chkpt** privilege | Disable this privilege for all databases that you want to protect using the **ASE Backup**. This allows you to back up the database log to recovery services vault.  |

- Use the Azure built-in roles to configure backup- assignment of roles and scope to the resources. The following Contributor role that allows you to run the **Configure Protection** operation on the database VM.

  | Resource (Access control) | Role | User, group, or service principal |
  | --- | --- | --- |
  | Source Azure VM running the ASE database | Virtual Machine Contributor | Allows you to configure the backup operation. |

## Preregistration script workflow

The preregistration script is a Python script that you run on the VM where the SAP ASE database is installed. The script performs the following tasks:

1. Creates the necessary group where the **plugin users** will be added.
2. Installs and updates required packages such as waagent, Python, curl, unzip, Libicu, and PythonXML.
3. Verifies the status of waagent, checks `wireserver` and `IMDS connectivity`, and tests **TCP connectivity** to  Microsoft Entra ID.
4. Confirms if the geographic region is supported.
5. Checks for available free space for logs, in the `waagent` directory, and `/opt` directory.
6. Validates if the Adaptive Server Enterprise (ASE)) version is supported.
7. Logs in the SAP instance using the provided username and password, enabling dump history, which is necessary for backup and restore operations.
8. Ensures that the OS version is supported.
9. Installs and updates required Python modules such as requests and cryptography.
10. Creates the workload configuration file.
11. Sets up the required directories under `/opt` for backup operations.
12. Encrypts the password and securely stores it in the virtual machine. 

## Run the pre-registration script

To execute the pre-registration script for SAP ASE database backup, run the following bash commands:

1. [Download the ASE Pre-Registration Script file](https://aka.ms/preregscriptsapase).
2. Copy the file to the virtual machine (VM).

  
   >[!NOTE]
   >Replace `<script name>` in the following commands with the name of the script file you downloaded and copied to the VM.

3. Convert the script to the Unix format.

   ```bash
    dos2unix <script name>
   ```

4. Change the permission of the script file.

   >[!Note]
   >Before you run the following command, replace `/path/to/script/file` with the actual path of the script file in the VM.

   ```bash
    sudo chmod -R 777 /path/to/script/file
   ```

5. Update the script.

   ```bash
    sudo ./<script name> -us
   ```

6. Run the script.

    >[!Note]
    >Before running the following command, provide the required values for the placeholders.

    ```bash
     sudo ./<script name> -aw SAPAse --sid <sid> --sid-user <sid-user> --db-port <db-port> --db-user <db-user> --db-host <private-ip-of-vm> --enable-striping <enable-striping>
    ```

   List of parameters:

   - `<sid>`: Name of the required ASE server (required)
   - `<sid-user>`: OS Username under which ASE System runs (for example, `syb<sid>`) (required)
   - `<db-port>`: The Port Number of the ASE Database server (for example, 4901) (required)
   - `<db-user>`: The ASE Database Username for ODBC connection (for example, `sapsa`) (required)
   - `<db-host>`: Private IP address of the VM (required)
   - `<enable-striping>`: Enable striping (choices: ['true', 'false'], required)
   - `<stripes-count>`: Stripes count (default: '4')
   - `<compression-level>`: Compression level (default: '101')

    >[!NOTE]
    >To find the `<private-ip-of-vm>`, open the VM in the Azure portal and check the private IP under the **Networking** section.

7. View details of the parameters.

   ```bash
    sudo ./<script name> -aw SAPAse --help
   ```

   After running the script, you're prompted to provide the database password. Provide the password and press **ENTER** to proceed.

## Create a Custom Role for Azure Backup

To Create a Custom Role for Azure Backup, run the following bash commands:

1. Sign in to the database using the SSO role user.

   ```bash
    isql -U sapsso -P <password> -S <sid> -X
   ```

2. Create a new role.

   ```bash
    create role azurebackup_role
   ```

3. Grant operator role to the new role.

   ```bash
    grant role oper_role to azurebackup_role
   ```

4. Enable granular permissions.

   ```bash
    sp_configure 'enable granular permissions', 1
   ```

5. Sign in to the database using the SA role user.

   ```bash
    isql -U sapsa -P <password> -S <sid> -X
   ```

6. Switch to the master database.

   ```bash
    use master
   ```

7. Grant "map external file" privilege to the new role.

   ```bash
    grant map external file to azurebackup_role
   ```

8. Sign in again using the SSO role user.

   ```bash
    isql -U sapsso -P <password> -S <sid> -X
   ```

9. Create a new user.

   ```bash
    sp_addlogin backupuser, <password>
   ```

10. Grant the custom role to the user.

    ```bash
     grant role azurebackup_role to backupuser

    ```
11. Set the custom role as the default for the user.

    ```bash
     sp_modifylogin backupuser, "add default role", azurebackup_role
    ```

12. Grant "own any database" privilege to the custom role as **SA** user.

    ```bash
     grant own any database to azurebackup_role
    ```

13. Sign in to the database as **SA** user again.

    ```bash
     isql -U sapsa -P <password> -S <sid> -X
    ```
14. Enable file access.

    ```bash
     sp_configure "enable file access", 1
    ```

15. Enable differential backup on the database.

    ```bash
     use master
     go
     sp_dboption <database_name>, 'allow incremental dumps', true
     go
    ```

16. Disable **trunc log on chkpt** on the database.

    ```bash
     use master
     go
     sp_dboption <database_name>, 'trunc log on chkpt', false
     go
    ```

>[!Note]
>After each of these commands, ensure that you run the command `go to execute the statements`.




## Next step

- [Run and on-demand backup of SAP ASE database on Azure VMs](sap-ase-database-manage.md#run-an-on-demand-backup)
- [Restore the SAP ASE database on Azure VMs (preview)](sap-ase-database-restore.md)