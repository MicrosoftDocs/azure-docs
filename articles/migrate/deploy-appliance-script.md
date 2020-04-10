---
title: Set up an Azure Migrate appliance with a script
description: Learn how to set up an Azure Migrate appliance with a script
ms.topic: article
ms.date: 03/23/2020
---


# Set up an appliance with a script

This article describes how to set up the [Azure Migrate appliance](deploy-appliance.md) using a PowerShell installer script.

The script provides:
- An alternative to setting up the appliance using an OVA template, for assessment and agentless migration of VMware VMs.
- An alternative to setting up the appliance using a VHD template, for assessment and migration of Hyper-V VMs.
- For assessment of physical servers (or VMs that you want to migrate as physical servers), the script is the only method for setting up the appliance.

## Prerequisites

The script sets up the Azure Migrate appliance on an existing physical machine or VM.

- The machine that will act as the appliance must be running Windows Server 2016, with 32 GB of memory, eight vCPUs, around 80 GB of disk storage, and an external virtual switch. It requires a static or dynamic IP address, and access to the internet.
- Before you deploy the appliance, review detailed appliance requirements for [VMware VMs](migrate-appliance.md#appliance---vmware), [Hyper-V VMs](migrate-appliance.md#appliance---hyper-v), and [physical servers](migrate-appliance.md#appliance---physical).
- Don't run the script on an existing Azure Migrate appliance.


## Download the script

1. Locate the machine/VM that will act as the Azure Migrate appliance.
2. On the machine, do the following:

    - To use the appliance with VMware VMs or Hyper-V VMs, [download](https://go.microsoft.com/fwlink/?linkid=2105112) the zipped folder containing the installer script and the MSIs.
    - To use the appliance with physical servers, download the script from the Azure Migrate portal, as described in this [tutorial](tutorial-assess-physical.md#set-up-the-appliance).

## Verify file security

Check that the zipped file is secure, before you deploy it.

1. On the machine to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the zipped file
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example usage: ```C:\>CertUtil -HashFile C:\Users\administrator\Desktop\AzureMigrateInstaller.zip SHA256```

3. Verify that the generated hash values match these settings (for the latest appliance version):

    **Algorithm** | **Hash value**
      --- | ---
      MD5 | 1e92ede3e87c03bd148e56a708cdd33f
      SHA256 | a3fa78edc8ff8aff9ab5ae66be1b64e66de7b9f475b6542beef114b20bfdac3c

## Run the script

Here's what the script does:

- Installs agents and a web application.
- Installs Windows roles, including Windows Activation Service, IIS, and PowerShell ISE.
- Downloads and installs an IIS rewritable module. [Learn more](https://www.microsoft.com/download/details.aspx?id=7435).
- Updates a registry key (HKLM), with persistent settings for Azure Migrate.
- Creates log and configuration files as follows:
    - **Config Files**: %ProgramData%\Microsoft Azure\Config
    - **Log Files**: %ProgramData%\Microsoft Azure\Logs

To run the script:

1. Extract the zipped file to a folder on the machine that will host the appliance.
2. Launch PowerShell on the machine, with administrator (elevated) privileges.
3. Change the PowerShell directory to the folder containing the contents extracted from the downloaded zipped file.
4. Run the script **AzureMigrateInstaller.ps1** as follows:

    - For VMware: 
        ```
        PS C:\Users\administrator\Desktop\AzureMigrateInstaller> AzureMigrateInstaller.ps1 -scenario VMware
        ```
    - For Hyper-V:
        ```
        PS C:\Users\administrator\Desktop\AzureMigrateInstaller> AzureMigrateInstaller.ps1 -scenario Hyperv
        ```
    - For physical servers:
        ```
        PS C:\Users\administrator\Desktop\AzureMigrateInstaller> AzureMigrateInstaller.ps1
        ```      
5. After the script runs successfully, it launches the appliance web application so that you can set up the appliance. If you encounter any issues, you can view the script logs at C:\ProgramData\Microsoft Azure\Logs\AzureMigrateScenarioInstaller_<em>Timestamp</em>.log.

## Next steps

After you've set up the appliance using the script, follow these instructions:

- Set up the appliance for [VMware](how-to-set-up-appliance-vmware.md#configure-the-appliance).
- Set up the appliance for [Hyper-V](how-to-set-up-appliance-hyper-v.md#configure-the-appliance).
- Set up the appliance for [physical servers](how-to-set-up-appliance-physical.md).