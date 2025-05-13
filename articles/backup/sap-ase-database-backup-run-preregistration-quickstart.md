---
title: Quickstart - Run the Preregistration Script for SAP ASE backup in Azure Cloud Shell
description: Learn how to run the preregistration script to prepare an SAP ASE (Sybase) database configuration for backup on Azure VMs using Azure Backup.
ms.topic: how-to
ms.date: 05/13/2025
ms.service: azure-backup
ms.custom:
  - ignite-2024
author: jyothisuri
ms.author: jsuri
---

# Quickstart: Run the preregistration script for SAP ASE (Sybase) database backup in Azure Cloud Shell

This quickstart describes how to run the preregistration script to prepare an SAP Adaptive Server Enterprise (ASE) (Sybase) database configuration for backup on Azure VMs using Azure Cloud Shell.

The preregistration script for SAP ASE database backup using Azure Backup ensures the system is properly configured, which includes authentication configuration, network connectivity validation, and necessary packages installation. It also supports private endpoints and prepares the database for seamless backup operations.

Learn about the [supported configurations and scenarios for SAP ASE database backup](sap-ase-backup-support-matrix.md) on Azure VMs.

## Prerequisites

Before you run the preregistration script, ensure that the following prerequisites are met:

- [Download the latest preregistration script](https://aka.ms/preregscriptsapase) for [Multi System Identifier (SID) support](sap-ase-backup-support-matrix.md#support-for-multiple-sap-ase-instances-on-a-single-host).
- Run the SAP ASE backup configuration script on the virtual machine where ASE is installed.
- Check if you're the root user for proper configuration and access.
- Use the `-sn` or `--skip-network-checks` parameter when running the script, if your ASE setup uses Private Endpoints.

## Preregistration script workflow

The preregistration script is a Python script that you run on the VM where the SAP ASE database is installed. The script performs the following tasks:

- Creates the necessary group where the **plugin users** are added.
- Installs and updates required packages such as waagent, Python, curl, unzip, Libicu, and PythonXML.
- Verifies the status of waagent, checks `wireserver` and `IMDS connectivity`, and tests **TCP connectivity** to  Microsoft Entra ID.
- Confirms if the geographic region is supported.
- Checks for available free space for logs, in the `waagent` directory, and `/opt` directory.
- Validates if the Adaptive Server Enterprise (ASE) version is supported.
- Logs in the SAP instance using the provided username and password, enabling dump history, which is necessary for backup and restore operations.
- Ensures that the OS version is supported.
- Installs and updates required Python modules such as requests and cryptography.
- Creates the workload configuration file.
- Sets up the required directories under `/opt` for backup operations.
- Encrypts the password and securely stores it in the virtual machine. 

## Run the preregistration script

After you [download the ASE preregistration script file](https://aka.ms/preregscriptsapase), copy it to the virtual machine (VM).

To execute the preregistration script for SAP ASE database backup, run the following bash commands:

>[!NOTE]
>Replace `<script name>` in the following commands with the name of the script file you downloaded and copied to the VM.
 
1. Convert the script to the Unix format.

   ```bash
    dos2unix <script name>
   ```

1. Change the permission of the script file.

   >[!Note]
   >Before you run the following command, replace `/path/to/script/file` with the actual path of the script file in the VM.

   ```bash
    sudo chmod -R 777 /path/to/script/file
   ```

1. Run the script.

    >[!Note]
    >Before running the following command, provide the required values for the placeholders.

    ```bash
     sudo ./<script name> -aw SAPAse --sid <sid> --sid-user <sid-user> --db-port <db-port> --db-user <db-user> --db-host <private-ip-of-vm> --enable-striping <enable-striping>
    ```

   List of parameters:

   - `<sid>`: Name of the required ASE server (required)
   - `<sid-user>`: OS Username under which ASE System runs (for example, `syb<sid>`) (required)
   - `<db-port>`: The Port Number of the ASE Database server (for example, 4901) (required)
   - `<db-user>`: The ASE Database Username for Open Database Connectivity (ODBC) connection (for example, `sapsa`) (required)
   - `<db-host>`: Private IP address of the VM (required)
   - `<enable-striping>`: Enable striping (choices: [`true`, `false`], required)
   - `<stripes-count>`: Stripes count (default: '4')
   - `<compression-level>`: Compression level (default: '101')

    >[!NOTE]
    >To find the `<private-ip-of-vm>`, open the VM in the Azure portal and check the private IP under the **Networking** section.

1. View details of the parameters.

   ```bash
    sudo ./<script name> -aw SAPAse --help
   ```

   After running the script, you're prompted to provide the database password. Provide the password and press **ENTER** to proceed.

## Next steps

- [Tutorial: Back up SAP ASE (Sybase) database on Azure VM using Azure Backup](sap-ase-database-backup-tutorial.md).
- [Troubleshoot SAP ASE (Sybase) database backup](troubleshoot-sap-ase-sybase-database-backup.md).
