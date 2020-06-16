---
title: Set up an Azure Migrate appliance in Azure Government
description: Learn how to set up an Azure Migrate appliance in Azure Government
ms.topic: article
ms.date: 04/16/2020
---


# Set up an appliance in Azure Government 

Follow this article to deploy an [Azure Migrate appliance](deploy-appliance.md) for VMware VMs, Hyper-V VMs, and physical servers, in an Azure Government cloud. You run a script to create the appliance, and verify that it can connect to Azure. If you want to set up  an appliance in the public cloud, follow [this article](deploy-appliance-script.md).


> [!NOTE]
> The option to deploy an appliance using a template (for VMware VMs and Hyper-V VMs) isn't supported in Azure Government.


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
    - Example: ```C:\>CertUtil -HashFile C:\Users\administrator\Desktop\AzureMigrateInstaller-VMWare-USGov.zip MD5```

3. Verify the latest appliance version and hash value:

    **Algorithm** | **Download** | **SHA256**
    --- | --- | ---
    VMware (63.1 MB) | [Latest version](https://go.microsoft.com/fwlink/?linkid=2120300&clcid=0x409 ) | 3d5822038646b81f458d89d706832c0a2c0e827bfa9b0a55cc478eaf2757a4de


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
4. Run the script **AzureMigrateInstaller.ps1**, as follows: ``` PS C:\Users\Administrators\Desktop\AzureMigrateInstaller-VMWare-USGov>AzureMigrateInstaller.ps1 ```
5. After the script runs successfully, it launches the appliance web application so that you can set up the appliance. If you encounter any issues, review the script logs at C:\ProgramData\Microsoft Azure\Logs\AzureMigrateScenarioInstaller_<em>Timestamp</em>.log.

### Verify access

Make sure that the appliance can connect to Azure URLs for [government clouds](migrate-appliance.md#government-cloud-urls).


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
    - Example: ```C:\>CertUtil -HashFile C:\Users\administrator\Desktop\AzureMigrateInstaller-HyperV-USGov.zip MD5```

3. Verify the latest appliance version and hash value:

    **Scenario** | **Download** | **SHA256**
    --- | --- | ---
    Hyper-V (63.1 MB) | [Latest version](https://go.microsoft.com/fwlink/?linkid=2120200&clcid=0x409) |  2c5e73a1e5525d4fae468934408e43ab55ff397b7da200b92121972e683f9aa3

          

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
4. Run the script **AzureMigrateInstaller.ps1**, as follows: ``` PS C:\Users\Administrators\Desktop\AzureMigrateInstaller-HyperV-USGov>AzureMigrateInstaller.ps1 ``` 
5. After the script runs successfully, it launches the appliance web application so that you can set up the appliance. If you encounter any issues, review the script logs at C:\ProgramData\Microsoft Azure\Logs\AzureMigrateScenarioInstaller_<em>Timestamp</em>.log.

### Verify access

Make sure that the appliance can connect to Azure URLs for [government clouds](migrate-appliance.md#government-cloud-urls).


## Set up the appliance for physical servers

To set up the appliance for VMware you download a zipped file from the Azure portal, and extract the contents. You run the PowerShell script to launch the appliance web app. You set up the appliance and configure it for the first time. Then, you register the appliance with the Azure Migrate project.

### Download the script

1.	In **Migration Goals** > **Servers** > **Azure Migrate: Server Assessment**, click **Discover**.
2.	In **Discover machines** > **Are your machines virtualized?**, select **Not virtualized/Other**.
3.	Click **Download**, to download the zipped file. 


### Verify file security

Check that the zipped file is secure, before you deploy it.

1. On the machine to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the zipped file
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example: ```C:\>CertUtil -HashFile C:\Users\administrator\Desktop\AzureMigrateInstaller-Server-USGov.zip MD5```

3. Verify the latest appliance version and hash value:

    **Scenario** | **Download*** | **Hash value**
    --- | --- | ---
    Physical (63.1 MB) | [Latest version](https://go.microsoft.com/fwlink/?linkid=2120100&clcid=0x409) | 93dfef131026e70acdfad2769cd208ff745ab96a96f013cdf3f9e1e61c9b37e1
          

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
4. Run the script **AzureMigrateInstaller.ps1**, as follows: ``` PS C:\Users\Administrators\Desktop\AzureMigrateInstaller-Server-USGov>AzureMigrateInstaller.ps1 ```
5. After the script runs successfully, it launches the appliance web application so that you can set up the appliance. If you encounter any issues, review the script logs at C:\ProgramData\Microsoft Azure\Logs\AzureMigrateScenarioInstaller_<em>Timestamp</em>.log.

### Verify access

Make sure that the appliance can connect to Azure URLs for [government clouds](migrate-appliance.md#government-cloud-urls).

## Next steps

After deploying the appliance, you need to configure it for the first time, and register it with the Azure Migrate project.

- Set up the appliance for [VMware](how-to-set-up-appliance-vmware.md#configure-the-appliance).
- Set up the appliance for [Hyper-V](how-to-set-up-appliance-hyper-v.md#configure-the-appliance).
- Set up the appliance for [physical servers](how-to-set-up-appliance-physical.md).
