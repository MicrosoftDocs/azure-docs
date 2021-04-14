---
title: Set up an Azure Migrate appliance in Azure Government
description: Learn how to set up an Azure Migrate appliance in Azure Government
author: vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: how-to
ms.date: 03/13/2021
---


# Set up an appliance in Azure Government 

Follow this article to deploy an [Azure Migrate appliance](./migrate-appliance-architecture.md) for servers on VMware environment, servers on Hyper-V, and physical servers, in an Azure Government cloud. You run a script to create the appliance, and verify that it can connect to Azure. If you want to set up  an appliance in the public cloud, follow [this article](deploy-appliance-script.md).


> [!NOTE]
> The option to deploy an appliance using a template (for servers on VMware environment and Hyper-V environment) isn't supported in Azure Government.


## Prerequisites

The script sets up the Azure Migrate appliance on an existing physical server or on a virtualized server.

- The server that will act as the appliance must be running Windows Server 2016, with 32 GB of memory, eight vCPUs, around 80 GB of disk storage, and an external virtual switch. It requires a static or dynamic IP address. 
- Before you deploy the appliance, review detailed appliance requirements for [servers on VMware](migrate-appliance.md#appliance---vmware), [on Hyper-V](migrate-appliance.md#appliance---hyper-v), and [physical servers](migrate-appliance.md#appliance---physical).
- Don't run the script on an existing Azure Migrate appliance.

## Set up the appliance for VMware

To set up the appliance for VMware you download a zipped file from the Azure portal, and extract the contents. You run the PowerShell script to launch the appliance web app. You set up the appliance and configure it for the first time. Then, you register the appliance with the project.

### Download the script

1. In **Migration Goals** > **Windows, Linux and SQL Servers** > **Azure Migrate: Discovery and assessment**, click **Discover**.
2. In **Discover server** > **Are your servers virtualized?**, select **Yes, with VMware vSphere hypervisor**.
3. Click **Download**, to download the zipped file.

### Verify file security

Check that the zipped file is secure, before you deploy it.

1. On the server to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the zipped file
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example: ```C:\>CertUtil -HashFile C:\Users\administrator\Desktop\AzureMigrateInstaller-VMWare-USGov.zip SHA256```

3. Verify the latest appliance version and hash value:

    **Algorithm** | **Download** | **SHA256**
    --- | --- | ---
    VMware (85.8 MB) | [Latest version](https://go.microsoft.com/fwlink/?linkid=2140337) | 2daaa2a59302bf911e8ef195f8add7d7c8352de77a9af0b860e2a627979085ca


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

1. Extract the zipped file to a folder on the server that will host the appliance. Make sure you don't run the script on a server with an existing Azure Migrate appliance.
2. Launch PowerShell on the server, with administrator (elevated) privileges.
3. Change the PowerShell directory to the folder containing the contents extracted from the downloaded zipped file.
4. Run the script **AzureMigrateInstaller.ps1**, as follows:
    
    ``` PS C:\Users\Administrators\Desktop\AzureMigrateInstaller-VMWare-USGov>.\AzureMigrateInstaller.ps1 ```
1. After the script runs successfully, it launches the appliance web application so that you can set up the appliance. If you encounter any issues, review the script logs at C:\ProgramData\Microsoft Azure\Logs\AzureMigrateScenarioInstaller_<em>Timestamp</em>.log.

### Verify access

Make sure that the appliance can connect to Azure URLs for [government clouds](migrate-appliance.md#government-cloud-urls).


## Set up the appliance for Hyper-V

To set up the appliance for Hyper-V you download a zipped file from the Azure portal, and extract the contents. You run the PowerShell script to launch the appliance web app. You set up the appliance and configure it for the first time. Then, you register the appliance with the project.

### Download the script

1.	In **Migration Goals** > **Windows, Linux and SQL Servers** > **Azure Migrate: Discovery and assessment**, click **Discover**.
2.	In **Discover servers** > **Are your servers virtualized?**, select **Yes, with Hyper-V**.
3.	Click **Download**, to download the zipped file. 


### Verify file security

Check that the zipped file is secure, before you deploy it.

1. On the server to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the zipped file
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example: ```C:\>CertUtil -HashFile C:\Users\administrator\Desktop\AzureMigrateInstaller-HyperV-USGov.zip SHA256```

3. Verify the latest appliance version and hash value:

    **Scenario** | **Download** | **SHA256**
    --- | --- | ---
    Hyper-V (85.8 MB) | [Latest version](https://go.microsoft.com/fwlink/?linkid=2140424) |  db5311de3d1d4a1167183a94e8347456db9c5749c7332ff2eb4b777798765e48

          

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

1. Extract the zipped file to a folder on the server that will host the appliance. Make sure you don't run the script on a server running an existing Azure Migrate appliance.
2. Launch PowerShell on the server, with administrator (elevated) privileges.
3. Change the PowerShell directory to the folder containing the contents extracted from the downloaded zipped file.
4. Run the script **AzureMigrateInstaller.ps1**, as follows: 

    ``` PS C:\Users\Administrators\Desktop\AzureMigrateInstaller-HyperV-USGov>.\AzureMigrateInstaller.ps1 ``` 
1. After the script runs successfully, it launches the appliance web application so that you can set up the appliance. If you encounter any issues, review the script logs at C:\ProgramData\Microsoft Azure\Logs\AzureMigrateScenarioInstaller_<em>Timestamp</em>.log.

### Verify access

Make sure that the appliance can connect to Azure URLs for [government clouds](migrate-appliance.md#government-cloud-urls).


## Set up the appliance for physical servers

To set up the appliance for VMware you download a zipped file from the Azure portal, and extract the contents. You run the PowerShell script to launch the appliance web app. You set up the appliance and configure it for the first time. Then, you register the appliance with the project.

### Download the script

1. In **Migration Goals** > **Windows, Linux and SQL Servers** > **Azure Migrate: Discovery and assessment**, click **Discover**.
2. In **Discover servers** > **Are your servers virtualized?**, select **Not virtualized/Other**.
3. Click **Download**, to download the zipped file.

### Verify file security

Check that the zipped file is secure, before you deploy it.

1. On the servers to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the zipped file
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example: ```C:\>CertUtil -HashFile C:\Users\administrator\Desktop\AzureMigrateInstaller-Server-USGov.zip SHA256```

3. Verify the latest appliance version and hash value:

    **Scenario** | **Download*** | **Hash value**
    --- | --- | ---
    Physical (85 MB) | [Latest version](https://go.microsoft.com/fwlink/?linkid=2140338) | cfed44bb52c9ab3024a628dc7a5d0df8c624f156ec1ecc3507116bae330b257f
          

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

1. Extract the zipped file to a folder on the server that will host the appliance. Make sure you don't run the script on a server running an existing Azure Migrate appliance.
2. Launch PowerShell on the server, with administrator (elevated) privileges.
3. Change the PowerShell directory to the folder containing the contents extracted from the downloaded zipped file.
4. Run the script **AzureMigrateInstaller.ps1**, as follows:

    ``` PS C:\Users\Administrators\Desktop\AzureMigrateInstaller-Server-USGov>.\AzureMigrateInstaller.ps1 ```
1. After the script runs successfully, it launches the appliance web application so that you can set up the appliance. If you encounter any issues, review the script logs at C:\ProgramData\Microsoft Azure\Logs\AzureMigrateScenarioInstaller_<em>Timestamp</em>.log.

### Verify access

Make sure that the appliance can connect to Azure URLs for [government clouds](migrate-appliance.md#government-cloud-urls).

## Next steps

After deploying the appliance, you need to configure it for the first time, and register it with the project.

- Set up the appliance for [VMware](how-to-set-up-appliance-vmware.md#4-configure-the-appliance).
- Set up the appliance for [Hyper-V](how-to-set-up-appliance-hyper-v.md#configure-the-appliance).
- Set up the appliance for [physical servers](how-to-set-up-appliance-physical.md).
