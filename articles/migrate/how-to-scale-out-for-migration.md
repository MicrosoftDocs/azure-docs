---
title: Set up an Azure Migrate scale-out appliance for agentless VMware migration
description: Learn how to set up an Azure Migrate scale-out appliance to migrate Hyper-V VMs.
author: ajaypartha95
ms.author: ajaypar
ms.manager: roopesh.nair
ms.service: azure-migrate
ms.topic: how-to
ms.date: 09/15/2023
ms.custom: engagement-fy23
---


# Scale agentless migration of VMware virtual machines to Azure

This article helps you understand how to use a scale-out appliance to migrate a large number of VMware virtual machines (VMs) to Azure using the Migration and modernization tool's agentless method for migration of VMware VMs.

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

1. Click on **Discover** > **Are your machines virtualized?** 
1. Select **Yes, with VMware vSphere Hypervisor.**
1. Select agentless replication in the next step.
1. Select **Scale-out an existing primary appliance** in the select the type of appliance menu.
1. Select the primary appliance (the appliance using which discovery was performed) that you wish to scale out.

    :::image type="content" source="./media/how-to-scale-out-for-migration/add-scale-out.png" alt-text="Screenshot of Discover machines page for scale-out onboarding.":::

### 1. Generate the Azure Migrate project key

1. In **Generate Azure Migrate project key**, provide a suffix name for the scale-out appliance. The suffix can contain only alphanumeric characters and has a length limit of 14 characters.
2. Click **Generate key** to start the creation of the required Azure resources. Do not close the Discover page during the creation of resources.
3. Copy the generated key. You will need the key later to complete the registration of the scale-out appliance.

### 2. Download the installer for the scale-out appliance

In **Download Azure Migrate appliance**, click  **Download**. You need to download the PowerShell installer script to deploy the scale-out appliance on an existing server running Windows Server 2022 and with the required hardware configuration (32-GB RAM, 8 vCPUs, around 80 GB of disk storage and internet access, either directly or through a proxy).

:::image type="content" source="./media/how-to-scale-out-for-migration/download-scale-out.png" alt-text="Download script for scale-out appliance":::

> [!TIP]
> You can validate the checksum of the downloaded zip file using these steps:
>
> 1. On the server to which you downloaded the file, open an administrator command window.
> 2. Run the following command to generate the hash for the zipped file:
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example usage: ```C:\>CertUtil -HashFile C:\Users\administrator\Desktop\AzureMigrateInstaller.zip SHA256 ```
> 3. Download the [latest version](https://go.microsoft.com/fwlink/?linkid=2191847) of the scale-out appliance installer from the portal if the computed hash value doesn't match this string:
7EF01AE30F7BB8F4486EDC1688481DB656FB8ECA7B9EF6363B4DAB1CFCFDA141

### 3. Run the Azure Migrate installer script

1. Extract the zipped file to a folder on the server that will host the appliance.  Make sure you don't run the script on a server with an existing Azure Migrate appliance.

2. Launch PowerShell on the above server with administrative (elevated) privilege.

3. Change the PowerShell directory to the folder where the contents have been extracted from the downloaded zipped file.

4. Run the script named `AzureMigrateInstaller.ps1` by running the following command:

      `PS C:\Users\administrator\Desktop\AzureMigrateInstaller> .\AzureMigrateInstaller.ps1 `

5. Select from the scenario, cloud, configuration and connectivity options to deploy the desired appliance. For instance, the selection shown below sets up a **scale-out appliance** to initiate concurrent replications on servers running in your VMware environment to an Azure Migrate project with **default _(public endpoint)_ connectivity** on **Azure public cloud**.

    :::image type="content" source="./media/how-to-scale-out-for-migration/script-vmware-scaleout-inline.png" alt-text="Screenshot that shows how to set up scale-out appliance." lightbox="./media/how-to-scale-out-for-migration/script-vmware-scaleout-expanded.png":::

6. The installer script does the following:

    - Installs gateway agent and appliance configuration manager to perform more concurrent server replications.
    - Install Windows roles, including Windows Activation Service, IIS, and PowerShell ISE.
    - Download and installs an IIS rewritable module.
    - Updates a registry key (HKLM) with persistent setting details for Azure Migrate.
    - Creates the following files under the path:
        - **Config Files**: %Programdata%\Microsoft Azure\Config
        - **Log Files**: %Programdata%\Microsoft Azure\Logs

After the script has executed successfully, the appliance configuration manager will be launched automatically.

> [!NOTE]
> If you come across any issues, you can access the script logs at C:\ProgramData\Microsoft Azure\Logs\AzureMigrateScenarioInstaller_<em>Timestamp</em>.log for troubleshooting.


### 4. Configure the appliance

Before you begin, ensure that the [these Azure endpoints](migrate-appliance.md#public-cloud-urls) are accessible from the scale-out appliance.

- Open a browser on any machine that can connect to the scale-out appliance server, and open the URL of the appliance configuration manager: **https://*scale-out appliance name or IP address*: 44368**.

   Alternately, you can open the configuration manager from the scale-out appliance server's desktop using the shortcut to the configuration manager.
- Accept the **license terms**, and read the third-party information.

#### Set up prerequisites and register the appliance

In the configuration manager, select **Set up prerequisites**, and then complete these steps:
1. **Connectivity**: The appliance checks that the server has internet access. If the server uses a proxy:
    - Select **Setup proxy** to specify the proxy address (in the form `http://ProxyIPAddress` or `http://ProxyFQDN`, where *FQDN* refers to a *fully qualified domain name*) and listening port.
    - Enter credentials if the proxy needs authentication.
    - If you have added proxy details or disabled the proxy or authentication, select **Save** to trigger connectivity and check connectivity again.
    
        Only HTTP proxy is supported.
1. **Time sync**: Check that the time on the appliance is in sync with internet time for discovery to work properly.
1. **Install updates and register appliance**: To run auto-update and register the appliance, follow these steps:

    :::image type="content" source="./media/tutorial-discover-vmware/prerequisites.png" alt-text="Screenshot that shows setting up the prerequisites in the appliance configuration manager.":::

    > [!NOTE]
    > This is a new user experience in Azure Migrate appliance which is available only if you have set up an appliance using the latest OVA/Installer script downloaded from the portal. The appliances which have already been registered will continue seeing the older version of the user experience and will continue to work without any issues.

    1. For the appliance to run auto-update, paste the project key that you copied from the portal. If you don't have the key, go to **Azure Migrate: Discovery and assessment** > **Overview** > **Manage existing appliances**. Select the appliance name you provided when you generated the project key, and then copy the key that's shown.
	2. The appliance will verify the key and start the auto-update service, which updates all the services on the appliance to their latest versions. When the auto-update has run, you can select **View appliance services** to see the status and versions of the services running on the appliance server.
    3. To register the appliance, you need to select **Login**. In **Continue with Azure Login**, select **Copy code & Login** to copy the device code (you must have a device code to authenticate with Azure) and open an Azure Login prompt in a new browser tab. Make sure you've disabled the pop-up blocker in the browser to see the prompt.
    
        :::image type="content" source="./media/tutorial-discover-vmware/device-code.png" alt-text="Screenshot that shows where to copy the device code and log in.":::
    4. In a new tab in your browser, paste the device code and sign in by using your Azure username and password. Signing in with a PIN isn't supported.
	    > [!NOTE]
        > If you close the login tab accidentally without logging in, refresh the browser tab of the appliance configuration manager to display the device code and Copy code & Login button.
	5. After you successfully log in, return to the browser tab that displays the appliance configuration manager. If the Azure user account that you used to log in has the required permissions for the Azure resources that were created during key generation, appliance registration starts.

        After the appliance is successfully registered, to see the registration details, select **View details**.

         #### Import appliance configuration from primary appliance

         To complete the registration of the scale-out appliance, click **import** to get the necessary configuration files from the primary appliance.

         1. Clicking **import** opens a pop-up window with instructions on how to import the necessary configuration files from the primary appliance.

            :::image type="content" source="./media/how-to-scale-out-for-migration/import-modal-scale-out.png" alt-text="Screenshot of the Import Configuration files modal.":::

         1. Login (remote desktop) to the primary appliance and execute the following PowerShell commands:

            `PS cd 'C:\Program Files\Microsoft Azure Appliance Configuration Manager\Scripts\PowerShell' `
    
            `PS .\ExportConfigFiles.ps1 `

         1. Copy the zip file created by running the above commands to the scale-out appliance. The zip file contains configuration files needed to register the scale-out appliance.

         1. In the pop-up window opened in the previous step, select the location of the copied configuration zip file and click **Save**.

         Once the files have been successfully imported, the registration of the scale-out appliance will complete and it will show you the timestamp of the last successful import. You can also see the registration details by clicking **View details**.
1. **Install the VDDK**: The appliance checks that VMware vSphere Virtual Disk Development Kit (VDDK) is installed. If the VDDK isn't installed, download VDDK 6.7 from VMware. Extract the downloaded zip file contents to the specified location on the appliance, as indicated in the *Installation instructions*.

    The Migration and modernization tool uses the VDDK to replicate servers during migration to Azure.

You can *rerun prerequisites* at any time during appliance configuration to check whether the appliance meets all the prerequisites.

At this point, you should revalidate that the scale-out appliance is able to connect to your vCenter server. Click **revalidate** to validate vCenter Server connectivity from scale-out appliance.
:::image type="content" source="./media/how-to-scale-out-for-migration/view-sources.png" alt-text="Screenshot shows view credentials and discovery sources to be validated.":::

> [!IMPORTANT]
> If you edit the vCenter Server credentials on the primary appliance, ensure that you import the configuration files again to the scale-out appliance to get the latest configuration and continue any ongoing replications.<br/> If you do not need the scale-out appliance any longer, make sure that you disable the scale-out appliance. [**Learn more**](./common-questions-appliance.md) on how to disable the scale-out appliance when not needed.

## Replicate

1. After the scale-out appliance is registered, on the Migration and modernization tile, select **Replicate**.

2.	Follow the steps on the screen to start replicating more virtual machines. 

With the scale-out appliance in place, you can now replicate 500 VMs concurrently. You can also migrate VMs in batches of 200 through the Azure portal.

The Migration and modernization tool will take care of distributing the virtual machines between the primary and scale-out appliance for replication. Once the replication is done, you can migrate the virtual machines.

> [!TIP]
> We recommend migrating virtual machines in batches of 200 for optimal performance if you want to migrate a large number of virtual machines.
  
## Next steps

In this article, you learned:
- How to configure a scale-out appliance
- How to replicate VMs using a scale-out appliance


[Learn more](./tutorial-migrate-vmware.md) about migrating servers to Azure using the Migration and modernization tool.
