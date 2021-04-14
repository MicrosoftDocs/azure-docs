---
title: Set up an Azure Migrate appliance with a script
description: Learn how to set up an Azure Migrate appliance with a script
ms.topic: how-to
author: vineetvikram
ms.author: vivikram
ms.manager: abhemraj
ms.date: 03/18/2021
---


# Set up an appliance with a script

Follow this article to create an [Azure Migrate appliance](./migrate-appliance-architecture.md) for the assessment/migration of servers on VMware, and on Hyper-V. You run a script to create an appliance, and verify that it can connect to Azure. 

You can deploy the appliance for servers on VMware and on Hyper-V using a script, or using a template that you download from the Azure portal. Using a script is useful if you're unable to create an appliance using the downloaded template.

- To use a template, follow the tutorials for [VMware](./tutorial-discover-vmware.md) or [Hyper-V](./tutorial-discover-hyper-v.md).
- To set up an appliance for physical servers, you can only use a script. Follow [this article](how-to-set-up-appliance-physical.md).
- To set up an appliance in an Azure Government cloud, follow [this article](deploy-appliance-script-government.md).

## Prerequisites

The script sets up the Azure Migrate appliance on an existing server.

- The server that will act as the appliance must meet the following hardware and OS requirements:

Scenario | Requirements
--- | ---
VMware | Windows Server 2016, with 32 GB of memory, eight vCPUs, around 80 GB of disk storage
Hyper-V | Windows Server 2016, with 16 GB of memory, eight vCPUs, around 80 GB of disk storage

- The server also needs an external virtual switch. It requires a static or dynamic IP address. 
- Before you deploy the appliance, review detailed appliance requirements for [servers on VMware](migrate-appliance.md#appliance---vmware), [on Hyper-V](migrate-appliance.md#appliance---hyper-v).
- Don't run the script on an existing Azure Migrate appliance.

## Set up the appliance for VMware

To set up the appliance for VMware you download the zipped file named AzureMigrateInstaller-Server-Public.zip either from the portal or from [here](https://go.microsoft.com/fwlink/?linkid=2140334), and extract the contents. You run the PowerShell script to launch the appliance web app. You set up the appliance and configure it for the first time. Then, you register the appliance with project.

### Verify file security

Check that the zipped file is secure, before you deploy it.

1. On the server to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the zipped file
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example: ```C:\>CertUtil -HashFile C:\Users\administrator\Desktop\AzureMigrateInstaller-VMware-Public.zip SHA256```
3. Verify the latest appliance version and script for Azure public cloud:

    **Algorithm** | **Download** | **SHA256**
    --- | --- | ---
    VMware (85.8 MB) | [Latest version](https://go.microsoft.com/fwlink/?linkid=2116601) | 85b74d93dfcee43412386141808d82147916330e6669df94c7969fe1b3d0fe72

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

1. Extract the zipped file to a folder on the server that will host the appliance. Make sure you don't run the script on an existing Azure Migrate appliance.
2. Launch PowerShell on the server, with administrator (elevated) privileges.
3. Change the PowerShell directory to the folder containing the contents extracted from the downloaded zipped file.
4. Run the script **AzureMigrateInstaller.ps1**, as follows:

    ``` PS C:\Users\administrator\Desktop\AzureMigrateInstaller-Server-Public> .\AzureMigrateInstaller.ps1 -scenario VMware ```
  
5. After the script runs successfully, it launches the appliance web application so that you can set up the appliance. If you encounter any issues, review the script logs at C:\ProgramData\Microsoft Azure\Logs\AzureMigrateScenarioInstaller_<em>Timestamp</em>.log.

### Verify access

Make sure that the appliance can connect to Azure URLs for the [public](migrate-appliance.md#public-cloud-urls) cloud.

## Set up the appliance for Hyper-V

To set up the appliance for Hyper-V you download the zipped file named AzureMigrateInstaller-Server-Public.zip either from the portal or from [here](https://go.microsoft.com/fwlink/?linkid=2105112), and extract the contents. You run the PowerShell script to launch the appliance web app. You set up the appliance and configure it for the first time. Then, you register the appliance with project.


### Verify file security

Check that the zipped file is secure, before you deploy it.

1. On the server to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the zipped file
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example: ```C:\>CertUtil -HashFile C:\Users\administrator\Desktop\AzureMigrateInstaller-Server-HyperV.zip SHA256```

3. Verify the latest appliance version and script for Azure public cloud:

    **Scenario** | **Download** | **SHA256**
    --- | --- | ---
    Hyper-V (85.8 MB) | [Latest version](https://go.microsoft.com/fwlink/?linkid=2116657) |  9bbef62e2e22481eda4b77c7fdf05db98c3767c20f0a873114fb0dcfa6ed682a

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

1. Extract the zipped file to a folder on the server that will host the appliance. Make sure you don't run the script on an existing Azure Migrate appliance.
2. Launch PowerShell on the server, with administrator (elevated) privileges.
3. Change the PowerShell directory to the folder containing the contents extracted from the downloaded zipped file.
4. Run the script **AzureMigrateInstaller.ps1**, as follows:

    ``` PS C:\Users\administrator\Desktop\AzureMigrateInstaller-Server-Public> .\AzureMigrateInstaller.ps1 -scenario Hyperv ```
   
5. After the script runs successfully, it launches the appliance web application so that you can set up the appliance. If you encounter any issues, review the script logs at C:\ProgramData\Microsoft Azure\Logs\AzureMigrateScenarioInstaller_<em>Timestamp</em>.log.

### Verify access

Make sure that the appliance can connect to Azure URLs for the [public](migrate-appliance.md#public-cloud-urls) cloud.

## Next steps

After deploying the appliance, you need to configure it for the first time, and register it with project.

- Set up the appliance for [VMware](how-to-set-up-appliance-vmware.md#4-configure-the-appliance).
- Set up the appliance for [Hyper-V](how-to-set-up-appliance-hyper-v.md#configure-the-appliance).