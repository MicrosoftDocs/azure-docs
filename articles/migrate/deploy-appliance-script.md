---
title: Set up an Azure Migrate appliance with a script
description: Learn how to set up an Azure Migrate appliance with a script
ms.topic: article
ms.date: 04/16/2020
---


# Set up an appliance with a script

Follow this article to create an [Azure Migrate appliance](deploy-appliance.md) for the assessment/migration of VMware VMs, and Hyper-V VMs. You run a script to create an appliance, and verify that it can connect to Azure. 

You can deploy the appliance for VMware and Hyper-V VMs using a script, or using a template that you download from the Azure portal. Using a script is useful if you're unable to create a VM using the downloaded template.

- To use a template, follow the tutorials for [VMware](tutorial-prepare-vmware.md) or [Hyper-V](tutorial-prepare-hyper-v.md).
- To set up an appliance for physical servers, you can only use a script. Follow [this article](how-to-set-up-appliance-physical.md).
- To set up an appliance in an Azure Government cloud, follow [this article](deploy-appliance-script-government.md).

## Prerequisites

The script sets up the Azure Migrate appliance on an existing physical machine or VM.

- The machine that will act as the appliance must be running Windows Server 2016, with 32 GB of memory, eight vCPUs, around 80 GB of disk storage, and an external virtual switch. It requires a static or dynamic IP address, and access to the internet.
- Before you deploy the appliance, review detailed appliance requirements for [VMware VMs](migrate-appliance.md#appliance---vmware), [Hyper-V VMs](migrate-appliance.md#appliance---hyper-v), and [physical servers](migrate-appliance.md#appliance---physical).
- Don't run the script on an existing Azure Migrate appliance.

## Set up the appliance for VMware

To set up the appliance for VMware you download a zipped file from the Azure portal, and extract the contents. You run the PowerShell script to launch the appliance web app. You set up the appliance and configure it for the first time. Then, you register the appliance with the Azure Migrate project.

### Download the script

1.	In **Migration Goals** > **Servers** > **Azure Migrate: Server Assessment**, click **Discover**.
2.	In **Discover machines** > **Are your machines virtualized?**, select **Yes, with VMWare vSphere hypervisor**.
3.	Click **Download**, to download the zipped file. 


### Verify file security

Check that the zipped file is secure, before you deploy it.

1. On the machine to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the zipped file
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example: ```C:\>CertUtil -HashFile C:\Users\administrator\Desktop\AzureMigrateInstaller.zip SHA256```
3. Verify the latest appliance version and script for Azure public cloud:

    **Algorithm** | **Download** | **SHA256**
    --- | --- | ---
    VMware (10.9 GB) | [Latest version](https://aka.ms/migrate/appliance/vmware) | cacbdaef927fe5477fa4e1f494fcb7203cbd6b6ce7402b79f234bc0fe69663dd



### Run the script

Here's what the script does:

- Installs agents and a web application.
- Installs Windows roles, including Windows Activation Service, IIS, and PowerShell ISE.
- Downloads and installs an IIS rewritable module. [Learn more](https://www.microsoft.com/download/details.aspx?id=7435).
- Updates a registry key (HKLM), with persistent settings for Azure Migrate.
- Creates log and configuration files as follows:
    - **Config Files**: %ProgramData%\Microsoft Azure\Config
    - **Log Files**: %ProgramData%\Microsoft Azure\Logs

To run the script:

1. Extract the zipped file to a folder on the machine that will host the appliance. Make sure you don't run the script on a machine on an existing Azure Migrate appliance.
2. Launch PowerShell on the machine, with administrator (elevated) privileges.
3. Change the PowerShell directory to the folder containing the contents extracted from the downloaded zipped file.
4. Run the script **AzureMigrateInstaller.ps1**, as follows:

    ``` PS C:\Users\administrator\Desktop\AzureMigrateInstaller> AzureMigrateInstaller.ps1 -scenario VMware ```
   
5. After the script runs successfully, it launches the appliance web application so that you can set up the appliance. If you encounter any issues, review the script logs at C:\ProgramData\Microsoft Azure\Logs\AzureMigrateScenarioInstaller_<em>Timestamp</em>.log.

### Verify access

Make sure that the appliance can connect to Azure URLs for the [public](migrate-appliance.md#public-cloud-urls) cloud.

## Set up the appliance for Hyper-V

To set up the appliance for Hyper-V you download a zipped file from the Azure portal, and extract the contents. You run the PowerShell script to launch the appliance web app. You set up the appliance and configure it for the first time. Then, you register the appliance with the Azure Migrate project.

### Download the script

1.	In **Migration Goals** > **Servers** > **Azure Migrate: Server Assessment**, click **Discover**.
2.	In **Discover machines** > **Are your machines virtualized?**, select **Yes, with Hyper-V**.
3.	Click **Download**, to download the zipped file. 


### Verify file security

Check that the zipped file is secure, before you deploy it.

1. On the machine to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the zipped file
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example: ```C:\>CertUtil -HashFile C:\Users\administrator\Desktop\AzureMigrateInstaller.zip SHA256```

3. Verify the latest appliance version and script for Azure public cloud:

    **Scenario** | **Download** | **SHA256**
    --- | --- | ---
    Hyper-V (8.93 MB) | [Latest version](https://aka.ms/migrate/appliance/hyperv) |  572be425ea0aca69a9aa8658c950bc319b2bdbeb93b440577264500091c846a1

### Run the script

Here's what the script does:

- Installs agents and a web application.
- Installs Windows roles, including Windows Activation Service, IIS, and PowerShell ISE.
- Downloads and installs an IIS rewritable module. [Learn more](https://www.microsoft.com/download/details.aspx?id=7435).
- Updates a registry key (HKLM), with persistent settings for Azure Migrate.
- Creates log and configuration files as follows:
    - **Config Files**: %ProgramData%\Microsoft Azure\Config
    - **Log Files**: %ProgramData%\Microsoft Azure\Logs

To run the script:

1. Extract the zipped file to a folder on the machine that will host the appliance. Make sure you don't run the script on a machine on an existing Azure Migrate appliance.
2. Launch PowerShell on the machine, with administrator (elevated) privileges.
3. Change the PowerShell directory to the folder containing the contents extracted from the downloaded zipped file.
4. Run the script **AzureMigrateInstaller.ps1**, as follows: ``` PS C:\Users\administrator\Desktop\AzureMigrateInstaller> AzureMigrateInstaller.ps1 -scenario Hyperv ```
   
5. After the script runs successfully, it launches the appliance web application so that you can set up the appliance. If you encounter any issues, review the script logs at C:\ProgramData\Microsoft Azure\Logs\AzureMigrateScenarioInstaller_<em>Timestamp</em>.log.

### Verify access

Make sure that the appliance can connect to Azure URLs for the [public](migrate-appliance.md#public-cloud-urls) cloud.

## Next steps

After deploying the appliance, you need to configure it for the first time, and register it with the Azure Migrate project.

- Set up the appliance for [VMware](how-to-set-up-appliance-vmware.md#configure-the-appliance).
- Set up the appliance for [Hyper-V](how-to-set-up-appliance-hyper-v.md#configure-the-appliance).
