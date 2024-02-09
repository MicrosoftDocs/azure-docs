---
title: Set up an Azure Migrate appliance in Azure Government
description: Learn how to set up an Azure Migrate appliance in Azure Government
author: vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.service: azure-migrate
ms.topic: how-to
ms.date: 10/23/2023
ms.custom: engagement-fy24
---


# Set up an appliance for Azure Government cloud

Follow this article to deploy an [Azure Migrate appliance](./migrate-appliance-architecture.md) for Azure Government cloud to perform:

- Discovery, assessment and agentless replication of servers running in VMware environment
- Discovery and assessment of servers running in Hyper-V environment
- Discovery and assessment of physical servers or servers running on other clouds like AWS, GCP, Xen etc.

If you want to set up  an appliance in the public cloud, follow [this article](deploy-appliance-script.md).

> [!NOTE]
> The option to deploy an appliance using a template (for servers running in VMware or Hyper-V environment) isn't supported in Azure Government. You need to use the installer script only.

## Prerequisites

You can use the script to deploy the Azure Migrate appliance on an existing physical or a virtualized server.

- The server that will act as the appliance must be running Windows Server 2019 or Windows Server 2022 and meet other requirements for [VMware](migrate-appliance.md#appliance---vmware), [Hyper-V](migrate-appliance.md#appliance---hyper-v), and [physical servers](migrate-appliance.md#appliance---physical).
- If you run the script on a server with Azure Migrate appliance already set up, you can choose to clean up the existing configuration and set up a fresh appliance of the desired configuration. When you execute the script, you will get a notification as shown below:
  
    :::image type="content" source="./media/deploy-appliance-script/script-reconfigure-appliance.png" alt-text="Screenshot that shows how to reconfigure an appliance.":::

## Set up the appliance for VMware

1. To set up the appliance, you download the zipped file named AzureMigrateInstaller.zip either from the portal or from [here](https://go.microsoft.com/fwlink/?linkid=2191847).
1. Extract the contents on the server where you want to deploy the appliance.
1. Execute the PowerShell script to launch the appliance configuration manager.
1. Set up the appliance and configure it for the first time.

### Download the script

1. In **Migration goals** > **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**, click **Discover**.
2. In **Discover server** > **Are your servers virtualized?**, select **Yes, with VMware vSphere hypervisor**.
3. Provide an appliance name and generate a project key in the portal.
3. Click **Download**, to download the zipped file.

### Verify security

Check that the zipped file is secure, before you deploy it.

1. On the server to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the zipped file:
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example usage: ```C:\>CertUtil -HashFile C:\Users\administrator\Desktop\AzureMigrateInstaller.zip SHA256 ```
3.  Verify the latest appliance version and hash value:

    **Download** | **Hash value**
    --- | ---
    [Latest version](https://go.microsoft.com/fwlink/?linkid=2191847) | 7EF01AE30F7BB8F4486EDC1688481DB656FB8ECA7B9EF6363B4DAB1CFCFDA141  


### Run the script

1. Extract the zipped file to a folder on the server that will host the appliance.  Make sure you don't run the script on a server with an existing Azure Migrate appliance.

2. Launch PowerShell on the above server with administrative (elevated) privilege.

3. Change the PowerShell directory to the folder where the contents have been extracted from the downloaded zipped file.

4. Run the script named **AzureMigrateInstaller.ps1** by running the following command:

   `PS C:\Users\administrator\Desktop\AzureMigrateInstaller> .\AzureMigrateInstaller.ps1 `

5. Select from the scenario, cloud and connectivity options to deploy an appliance with the desired configuration. For instance, the selection shown below sets up an appliance to discover, assess and migrate **servers running in your VMware environment** to an Azure Migrate project with **default _(public endpoint)_ connectivity** on **Azure Government cloud**.

   :::image type="content" source="./media/deploy-appliance-script-government/script-vmware-gov-inline.png" alt-text="Screenshot that shows how to set up appliance with desired configuration for VMware." lightbox="./media/deploy-appliance-script-government/script-vmware-gov-expanded.png":::

6. The installer script does the following:

   - Installs agents and a web application.
   - Install Windows roles, including Windows Activation Service, IIS, and PowerShell ISE.
   - Download and installs an IIS rewritable module.
   - Updates a registry key (HKLM) with persistent setting details for Azure Migrate.
   - Creates the following files under the path:
     - **Config Files**: %Programdata%\Microsoft Azure\Config
     - **Log Files**: %Programdata%\Microsoft Azure\Logs

After the script has executed successfully, the appliance configuration manager will be launched automatically.

### Verify access

Make sure that the appliance can connect to Azure URLs for [government clouds](migrate-appliance.md#government-cloud-urls).

## Set up the appliance for Hyper-V

1. To set up the appliance, you download the zipped file named AzureMigrateInstaller.zip either from the portal or from [here](https://go.microsoft.com/fwlink/?linkid=2191847).
1. Extract the contents on the server where you want to deploy the appliance.
1. Execute the PowerShell script to launch the appliance configuration manager.
1. Set up the appliance and configure it for the first time.

### Download the script

1.	In **Migration goals** > **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**, click **Discover**.
2.	In **Discover servers** > **Are your servers virtualized?**, select **Yes, with Hyper-V**.
3. Provide an appliance name and generate a project key in the portal.
3. Click **Download**, to download the zipped file. 

### Verify security

Check that the zipped file is secure, before you deploy it.

1. On the server to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the zipped file:
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example usage: ```C:\>CertUtil -HashFile C:\Users\administrator\Desktop\AzureMigrateInstaller.zip SHA256 ```
3.  Verify the latest appliance version and hash value:

    **Download** | **Hash value**
    --- | ---
    [Latest version](https://go.microsoft.com/fwlink/?linkid=2191847) | 7EF01AE30F7BB8F4486EDC1688481DB656FB8ECA7B9EF6363B4DAB1CFCFDA141 

### Run the script

1. Extract the zipped file to a folder on the server that will host the appliance.  Make sure you don't run the script on a server with an existing Azure Migrate appliance.

2. Launch PowerShell on the above server with administrative (elevated) privilege.

3. Change the PowerShell directory to the folder where the contents have been extracted from the downloaded zipped file.

4. Run the script named **AzureMigrateInstaller.ps1** by running the following command:

   `PS C:\Users\administrator\Desktop\AzureMigrateInstaller> .\AzureMigrateInstaller.ps1`

5. Select from the scenario, cloud and connectivity options to deploy an appliance with the desired configuration. For instance, the selection shown below sets up an appliance to discover and assess **servers running in your Hyper-V environment** to an Azure Migrate project with **default _(public endpoint)_ connectivity** on **Azure Government cloud**.

    :::image type="content" source="./media/deploy-appliance-script-government/script-hyperv-gov-inline.png" alt-text="Screenshot that shows how to set up appliance with desired configuration for Hyper-V." lightbox="./media/deploy-appliance-script-government/script-hyperv-gov-expanded.png":::

6. The installer script does the following:

    - Installs agents and a web application.
    - Install Windows roles, including Windows Activation Service, IIS, and PowerShell ISE.
    - Download and installs an IIS rewritable module.
    - Updates a registry key (HKLM) with persistent setting details for Azure Migrate.
    - Creates the following files under the path:
    - **Config Files**: %Programdata%\Microsoft Azure\Config
    - **Log Files**: %Programdata%\Microsoft Azure\Logs

After the script has executed successfully, the appliance configuration manager will be launched automatically.

### Verify access

Make sure that the appliance can connect to Azure URLs for [government clouds](migrate-appliance.md#government-cloud-urls).


## Set up the appliance for physical servers

1. To set up the appliance, you download the zipped file named AzureMigrateInstaller.zip either from the portal or from [here](https://go.microsoft.com/fwlink/?linkid=2191847).
1. Extract the contents on the server where you want to deploy the appliance.
1. Execute the PowerShell script to launch the appliance configuration manager.
1. Set up the appliance and configure it for the first time.

### Download the script

1. In **Migration goals** > **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**, click **Discover**.
2. In **Discover servers** > **Are your servers virtualized?**, select **Physical or other (AWS, GCP, Xen etc.)**.
3. Click **Download**, to download the zipped file.

### Verify security

Check that the zipped file is secure, before you deploy it.

1. On the server to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the zipped file:
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example usage: ```C:\>CertUtil -HashFile C:\Users\administrator\Desktop\AzureMigrateInstaller.zip SHA256 ```
3.  Verify the latest appliance version and hash value:

    **Download** | **Hash value**
    --- | ---
    [Latest version](https://go.microsoft.com/fwlink/?linkid=2191847) | 7EF01AE30F7BB8F4486EDC1688481DB656FB8ECA7B9EF6363B4DAB1CFCFDA141

> [!NOTE]
> The same script can be used to set up Physical appliance for Azure Government cloud with either public or private endpoint connectivity.

### Run the script

1. Extract the zipped file to a folder on the server that will host the appliance.  Make sure you don't run the script on a server with an existing Azure Migrate appliance.

2. Launch PowerShell on the above server with administrative (elevated) privilege.

3. Change the PowerShell directory to the folder where the contents have been extracted from the downloaded zipped file.

4. Run the script named **AzureMigrateInstaller.ps1** by running the following command:

    `PS C:\Users\administrator\Desktop\AzureMigrateInstaller> .\AzureMigrateInstaller.ps1 `

5. Select from the scenario, cloud and connectivity options to deploy an appliance with the desired configuration. For instance, the selection shown below sets up an appliance to discover and assess **physical servers** _(or servers running on other clouds like AWS, GCP, Xen etc.)_ to an Azure Migrate project with **default _(public endpoint)_ connectivity** on **Azure Government cloud**.

    :::image type="content" source="./media/deploy-appliance-script-government/script-physical-gov-inline.png" alt-text="Screenshot that shows how to set up appliance with desired configuration for Physical servers." lightbox="./media/deploy-appliance-script-government/script-physical-gov-expanded.png":::

6. The installer script does the following:

    - Installs agents and a web application.
    - Install Windows roles, including Windows Activation Service, IIS, and PowerShell ISE.
    - Download and installs an IIS rewritable module.
    - Updates a registry key (HKLM) with persistent setting details for Azure Migrate.
    - Creates the following files under the path:
        - **Config Files**: %Programdata%\Microsoft Azure\Config
        - **Log Files**: %Programdata%\Microsoft Azure\Logs

After the script has executed successfully, the appliance configuration manager will be launched automatically.

> [!NOTE]
> If you come across any issues, you can access the script logs at C:\ProgramData\Microsoft Azure\Logs\AzureMigrateScenarioInstaller_<em>Timestamp</em>.log for troubleshooting.

### Verify access

Make sure that the appliance can connect to Azure URLs for [government clouds](migrate-appliance.md#government-cloud-urls).

## Next steps

After deploying the appliance, you need to configure it for the first time, and register it with the project.

- Set up the appliance for [VMware](how-to-set-up-appliance-vmware.md#4-configure-the-appliance).
- Set up the appliance for [Hyper-V](how-to-set-up-appliance-hyper-v.md#configure-the-appliance).
- Set up the appliance for [physical servers](how-to-set-up-appliance-physical.md).
