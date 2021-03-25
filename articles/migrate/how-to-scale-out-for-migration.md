---
title: Set up an Azure Migrate scale-out appliance for agentless VMware migration
description: Learn how to set up an Azure Migrate scale-out appliance to migrate Hyper-V VMs.
author: anvar-ms 
ms.author: anvar
ms.manager: bsiva
ms.topic: how-to
ms.date: 03/02/2021
---


# Scale agentless migration of VMware virtual machines to Azure

This article helps you understand how to use a scale-out appliance to migrate a large number of VMware virtual machines (VMs) to Azure using the Azure Migrate Server Migration tool's agentless method for migration of VMware VMs.

Using the agentless migration method for VMware virtual machines you can:

- Replicate up to 300 VMs from a single vCenter server concurrently using one Azure Migrate appliance.
- Replicate up to 500 VMs from a single vCenter server concurrently by deploying a second scale-out appliance for migration.

In this article, you will learn how to:

- Add a scale-out appliance for agentless migration of VMware virtual machines
- Migrate up to 500 VMs concurrently using the scale-out appliance.

##  Prerequisites

Before you get started, you need to perform the following steps:

- Create the Azure Migrate project.
- Deploy the  Azure Migrate appliance (primary appliance) and complete discovery of VMware virtual machines managed by your vCenter server.
- Configure replication for one or more virtual machines that are to be migrated.
> [!IMPORTANT]
> You'll need to have at least one replicating virtual machine in the project before you can add a scale-out appliance for migration.

To learn how to perform the above, review the tutorial on [migrating VMware virtual machines to Azure with the agentless migration method](./tutorial-migrate-vmware.md).

## Deploy a scale-out appliance

To add a scale-out appliance, follow the steps mentioned below:

1. Click on **Discover** > **Are you machines virtualized?** 
1. Select **Yes, with VMware VSphere Hypervisor.**
1. Select agentless replication in the next step.
1. Select **Scale-out an existing primary appliance** in the select the type of appliance menu.
1. Select the primary appliance (the appliance using which discovery was performed) that you wish to scale-out.

:::image type="content" source="./media/how-to-scale-out-for-migration/add-scale-out.png" alt-text="Discover machines page for scale-out onboarding":::

### 1. Generate the Azure Migrate project key

1. In **Generate Azure Migrate project key**, provide a suffix name for the scale-out appliance. The suffix can contain only alphanumeric characters and has a length limit of 14 characters.
2. Click **Generate key** to start the creation of the required Azure resources. Please do not close the Discover page during the creation of resources.
3. Copy the generated key. You will need the key later to complete the registration of the scale-out appliance.

### 2. Download the installer for the scale-out appliance

In **Download Azure Migrate appliance**, click  **Download**. You need to download the PowerShell installer script to deploy the scale-out appliance on an existing server running Windows Server 2016 and with the required hardware configuration (32-GB RAM, 8 vCPUs, around 80 GB of disk storage and internet access, either directly or through a proxy).
:::image type="content" source="./media/how-to-scale-out-for-migration/download-scale-out.png" alt-text="Download script for scale-out appliance":::

> [!TIP]
> You can validate the checksum of the downloaded zip file using these steps:
>
> 1. Open command prompt as an administrator
> 2. Run the following command to generate the hash for the zipped file:
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example usage for public cloud: ```C:\>CertUtil -HashFile C:\Users\administrator\Desktop\AzureMigrateInstaller.zip SHA256 ```
> 3. Download the latest version of the scale-out appliance installer from the portal if the computed hash value doesnt match this string:
e9c9a1fe4f3ebae81008328e8f3a7933d78ff835ecd871d1b17f367621ce3c74

### 3. Run the Azure Migrate installer script
The installer script does the following:

- Installs gateway agent and appliance configuration manager to perform more concurrent server replications.
- Install Windows roles, including Windows Activation Service, IIS, and PowerShell ISE.
- Download and installs an IIS rewritable module. [Learn more](https://www.microsoft.com/download/details.aspx?id=7435).
- Updates a registry key (HKLM) with persistent setting details for Azure Migrate.
- Creates the following files under the path:
    - **Config Files**: %Programdata%\Microsoft Azure\Config
    - **Log Files**: %Programdata%\Microsoft Azure\Logs

Run the script as follows:

1. Extract the zip file to a folder on the server that will host the scale-out appliance.  Make sure you don't run the script on a server with an existing Azure Migrate appliance.
2. Launch PowerShell on the above server with administrative (elevated) privilege.
3. Change the PowerShell directory to the folder where the contents have been extracted from the downloaded zip file.
4. Run the script named **AzureMigrateInstaller.ps1**  using the following command:

    - For the public cloud: 
    
        ``` PS C:\Users\administrator\Desktop\AzureMigrateInstaller-Server-Public> .\AzureMigrateInstaller.ps1 ```

    The script will launch the appliance configuration manager when it completes the execution.

If you come across any issues, you can access the script logs at: <br/> C:\ProgramData\Microsoft Azure\Logs\AzureMigrateScenarioInstaller_<em>Timestamp</em>.log for troubleshooting.


### 4. Configure the appliance

Before you begin ensure that the [these Azure endpoints](migrate-appliance.md#public-cloud-urls) are accessible from the scale-out appliance.

- Open a browser on any machine that can connect to the scale-out appliance server, and open the URL of the appliance configuration manager: **https://*scale-out appliance name or IP address*: 44368**.

   Alternately, you can open the configuration manager from the scale-out appliance server's desktop using the shortcut to the configuration manager.
- Accept the **license terms**, and read the third-party information.
- In the configuration manager > **Set up prerequisites**, do the following:
   - **Connectivity**: The appliance checks that the server has internet access. If the server uses a proxy:
     1. Click on **Set up proxy** to specify the proxy address (in the form http://ProxyIPAddress or http://ProxyFQDN) and listening port.
     2. Specify credentials if the proxy needs authentication.
     3. Only HTTP proxy is supported.
     4. If you have added proxy details or disabled the proxy and/or authentication, click on **Save** to trigger connectivity check again.
   - **Time sync**: The time on the appliance should be in sync with internet time for discovery to work properly.
   - **Install updates**: The appliance ensures that the latest updates are installed. After the check completes, you can click on **View appliance services** to see the status and versions of the services running on the appliance server.
   - **Install VDDK**: The appliance checks that VMware vSphere Virtual Disk Development Kit (VDDK) is installed. If it isn't installed, download VDDK 6.7 from VMware, and extract the downloaded zip contents to the specified location on the appliance, as provided in the **Installation instructions** on the Appliance Configuration Manager screen.


### Register the appliance with Azure Migrate

1. Paste the **Azure Migrate project key** copied from the portal. If you do not have the key, go to **Server Assessment> Discover> Manage existing appliances**, select the primary appliance name, find the scale-out appliance associated with it and copy the corresponding key.
1. You will need a device code to authenticate with Azure. Clicking on **Login** will open a modal with the device code as shown below.
:::image type="content" source="./media/tutorial-discover-vmware/device-code.png" alt-text="Modal showing the device code":::

1. Click on **Copy code & Login** to copy the device code and open an Azure Login prompt in a new browser tab. If it doesn't appear, make sure you've disabled the pop-up blocker in the browser.
1. On the new tab, paste the device code and sign in by using your Azure username and password.
   
   Sign-in with a PIN isn't supported.
3. In case you close the login tab accidentally without logging in, you need to refresh the browser tab of the appliance configuration manager to enable the Login button again.
1. After you have successfully logged in, go back to the previous tab with the appliance configuration manager.
1. If the Azure user account used for logging has the right permissions on the Azure resources created during key generation, the appliance registration will be initiated.
:::image type="content" source="./media/how-to-scale-out-for-migration/registration-scale-out.png" alt-text="Panel 2 on appliance configuration manager":::

#### Import appliance configuration from primary appliance

To complete the registration of the scale-out appliance, click **import** to get the necessary configuration files from the primary appliance.

1. Clicking **import** opens a pop-up window with instructions on how to import the necessary configuration files from the primary appliance.
:::image type="content" source="./media/how-to-scale-out-for-migration/import-modal-scale-out.png" alt-text="Import configuration modal":::
1. Login (remote desktop) to the primary appliance and execute the following PowerShell commands:

    ``` PS cd 'C:\Program Files\Microsoft Azure Appliance Configuration Manager\Scripts\PowerShell' ```
    
    ``` PS .\ExportConfigFiles.ps1 ```

1. Copy the zip file created by running the above commands to the scale-out appliance. The zip file contains configuration files needed to register the scale-out appliance.
1. In the pop-up window opened in the previous step, select the location of the copied configuration zip file and click **Save**.

Once the files have been successfully imported, the registration of the scale-out appliance will complete and it will show you the timestamp of the last successful import. You can also see the registration details by clicking **View details**.
:::image type="content" source="./media/how-to-scale-out-for-migration/import-success.png" alt-text="Screenshot shows scale-out appliance registration with Azure Migrate project.":::

At this point you should revalidate that the scale-out appliance is able to connect to your vCenter server. Click **revalidate** to validate vCenter Server connectivity from scale-out appliance.
:::image type="content" source="./media/how-to-scale-out-for-migration/view-sources.png" alt-text="Screenshot shows view credentials and discovery sources to be validated.":::

> [!IMPORTANT]
> If you edit the vCenter Server credentials on the primary appliance, ensure that you import the configuration files again to the scale-out appliance to get the latest configuration and continue any ongoing replications.<br/> If you do not need the scale-out appliance any longer, make sure that you disable the scale-out appliance. [**Learn more**](./common-questions-appliance.md) on how to disable the scale-out appliance when not needed.

## Replicate

1. After the scale-out appliance is registered, on the Azure Migrate: Server Migration tile, click **Replicate**.

2.	Follow the steps on the screen to start replicating more virtual machines. 

With the scale-out appliance in place, you can now replicate 500 VMs concurrently. You can also migrate VMs in batches of 200 through the Azure portal.

Azure Migrate Server Migration tool will take care of distributing the virtual machines between the primary and scale-out appliance for replication. Once the replication is done, you can migrate the virtual machines.

> [!TIP]
> We recommend migrating virtual machines in batches of 200 for optimal performance if you want to migrate a large number of virtual machines.
  
## Next steps

In this article, you learned:
- How to configure a scale-out appliance
- How to replicate VMs using a scale-out appliance


[Learn more](./tutorial-migrate-vmware.md) about migrating servers to Azure using Azure Migrate: Server Migration tool.