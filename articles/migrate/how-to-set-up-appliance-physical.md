---
title: Set up an Azure Migrate appliance for physical servers
description: Learn how to set up an Azure Migrate appliance for physical server discovery and assessment.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: how-to
ms.date: 03/13/2021
---


# Set up an appliance for physical servers

This article describes how to set up the Azure Migrate appliance if you're assessing physical servers with the Azure Migrate: Discovery and assessment tool.

The Azure Migrate appliance is a lightweight appliance, used by Azure Migrate: Discovery and assessment to do the following:

- Discover on-premises servers.
- Send metadata and performance data for discovered servers to Azure Migrate: Discovery and assessment.

[Learn more](migrate-appliance.md) about the Azure Migrate appliance.


## Appliance deployment steps

To set up the appliance you:

1. Provide an appliance name and generate a project key in the portal.
2. Download a zipped file with Azure Migrate installer script from the Azure portal.
3. Extract the contents from the zipped file. Launch the PowerShell console with administrative privileges.
4. Execute the PowerShell script to launch the appliance configuration manager.
5. Configure the appliance for the first time, and register it with the project using the project key.

### Generate the project key

1. In **Migration Goals** > **Windows, Linux and SQL Servers** > **Azure Migrate: Discovery and assessment**, select **Discover**.
2. In **Discover servers** > **Are your servers virtualized?**, select **Physical or other (AWS, GCP, Xen, etc.)**.
3. In **1:Generate project key**, provide a name for the Azure Migrate appliance that you will set up for discovery of physical or virtual servers. The name should be alphanumeric with 14 characters or fewer.
1. Click on **Generate key** to start the creation of the required Azure resources. Do not close the Discover servers page during the creation of resources.
1. After the successful creation of the Azure resources, a **project key** is generated.
1. Copy the key as you will need it to complete the registration of the appliance during its configuration.

   ![Selections for Generate Key](./media/tutorial-assess-physical/generate-key-physical-1.png)

### Download the installer script

In **2: Download Azure Migrate appliance**, click on **Download**.

### Verify security

Check that the zipped file is secure, before you deploy it.

1. On the server to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the zipped file:
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example usage: ```C:\>CertUtil -HashFile C:\Users\administrator\Desktop\AzureMigrateInstaller.zip SHA256 ```
3.  Verify the latest appliance version and hash value:

    **Download** | **Hash value**
    --- | ---
    [Latest version](https://go.microsoft.com/fwlink/?linkid=2140334) | 15a94b637a39c53ac91a2d8b21cc3cca8905187e4d9fb4d895f4fa6fd2f30b9f

> [!NOTE]
> The same script can be used to set up Physical appliance for either Azure public or Azure Government cloud with public or private endpoint connectivity.

### Run the Azure Migrate installer script

1. Extract the zipped file to a folder on the server that will host the appliance.  Make sure you don't run the script on a server with an existing Azure Migrate appliance.
2. Launch PowerShell on the above server with administrative (elevated) privilege.
3. Change the PowerShell directory to the folder where the contents have been extracted from the downloaded zipped file.
4. Run the script named **AzureMigrateInstaller.ps1** by running the following command:

    
    ``` PS C:\Users\administrator\Desktop\AzureMigrateInstaller> .\AzureMigrateInstaller.ps1 ```

5. Select from the scenario, cloud and connectivity options to deploy an appliance with the desired configuration. For instance, the selection shown below sets up an appliance to discover and assess **physical servers** _(or servers running on other clouds like AWS, GCP, Xen etc.)_ to an Azure Migrate project with **default _(public endpoint)_ connectivity** on **Azure public cloud**.

    :::image type="content" source="./media/tutorial-discover-physical/script-physical-default-1.png" alt-text="Screenshot that shows how to set up appliance with desired configuration.":::

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

### Verify appliance access to Azure

Make sure that the appliance can connect to Azure URLs for [public](migrate-appliance.md#public-cloud-urls) and [government](migrate-appliance.md#government-cloud-urls) clouds.

### Configure the appliance

Set up the appliance for the first time.

1. Open a browser on any machine that can connect to the appliance, and open the URL of the appliance web app: **https://*appliance name or IP address*: 44368**.

   Alternately, you can open the app from the desktop by clicking the app shortcut.
2. Accept the **license terms**, and read the third-party information.
1. In the web app > **Set up prerequisites**, do the following:
    - **Connectivity**: The app checks that the server has internet access. If the server uses a proxy:
        - Click on **Setup proxy** to and specify the proxy address (in the form http://ProxyIPAddress or http://ProxyFQDN) and listening port.
        - Specify credentials if the proxy needs authentication.
        - Only HTTP proxy is supported.
        - If you have added proxy details or disabled the proxy and/or authentication, click on **Save** to trigger connectivity check again.
    - **Time sync**: Time is verified. The time on the appliance should be in sync with internet time for server discovery to work properly.
    - **Install updates**: Azure Migrate: Discovery and assessment checks that the appliance has the latest updates installed. After the check completes, you can click on **View appliance services** to see the status and versions of the components running on the appliance.

### Register the appliance with Azure Migrate

1. Paste the **project key** copied from the portal. If you do not have the key, go to **Azure Migrate: Discovery and assessment> Discover> Manage existing appliances**, select the appliance name you provided at the time of key generation and copy the corresponding key.
1. You will need a device code to authenticate with Azure. Clicking on **Login** will open a modal with the device code as shown below.

    ![Modal showing the device code](./media/tutorial-discover-vmware/device-code.png)

1. Click on **Copy code & Login** to copy the device code and open an Azure Login prompt in a new browser tab. If it doesn't appear, make sure you've disabled the pop-up blocker in the browser.
1. On the new tab, paste the device code and sign-in by using your Azure username and password.
   
   Sign-in with a PIN isn't supported.
3. In case you close the login tab accidentally without logging in, you need to refresh the browser tab of the appliance configuration manager to enable the Login button again.
1. After you successfully logged in, go back to the previous tab with the appliance configuration manager.
4. If the Azure user account used for logging has the right [permissions](./tutorial-discover-physical.md) on the Azure resources created during key generation, the appliance registration will be initiated.
1. After appliance is successfully registered, you can see the registration details by clicking on **View details**.


## Start continuous discovery

Now, connect from the appliance to the physical servers to be discovered, and start the discovery.

1. In **Step 1: Provide credentials for discovery of Windows and Linux physical or virtual servers​**, click on **Add credentials**.
1. For Windows server, select the source type as **Windows Server**, specify a friendly name for credentials, add the username and password. Click on **Save**.
1. If you are using password-based authentication for Linux server, select the source type as **Linux Server (Password-based)**, specify a friendly name for credentials, add the username and password. Click on **Save**.
1. If you are using SSH key-based authentication for Linux server, you can select source type as **Linux Server (SSH key-based)**, specify a friendly name for credentials, add the username, browse, and select the SSH private key file. Click on **Save**.

    - Azure Migrate supports the SSH private key generated by ssh-keygen command using RSA, DSA, ECDSA, and ed25519 algorithms.
    - Currently Azure Migrate does not support passphrase-based SSH key. Use an SSH key without a passphrase.
    - Currently Azure Migrate does not support SSH private key file generated by PuTTY.
    - Azure Migrate supports OpenSSH format of the SSH private key file as shown below:
    
    ![SSH private key supported format](./media/tutorial-discover-physical/key-format.png)
1. If you want to add multiple credentials at once, click on **Add more** to save and add more credentials. Multiple credentials are supported for physical servers discovery.
1. In **Step 2:Provide physical or virtual server details​**, click on **Add discovery source** to specify the server **IP address/FQDN** and the friendly name for credentials to connect to the server.
1. You can either **Add single item** at a time or **Add multiple items** in one go. There is also an option to provide server details through **Import CSV**.

    ![Selections for adding discovery source](./media/tutorial-assess-physical/add-discovery-source-physical.png)

    - If you choose **Add single item**, you can choose the OS type, specify friendly name for credentials, add server **IP address/FQDN** and click on **Save**.
    - If you choose **Add multiple items**, you can add multiple records at once by specifying server **IP address/FQDN** with the friendly name for credentials in the text box. Verify** the added records and click on **Save**.
    - If you choose **Import CSV** _(selected by default)_, you can download a CSV template file, populate the file with the server **IP address/FQDN** and friendly name for credentials. You then import the file into the appliance, **verify** the records in the file and click on **Save**.

1. On clicking Save, appliance will try validating the connection to the servers added and show the **Validation status** in the table against each server.
    - If validation fails for a server, review the error by clicking on **Validation failed** in the Status column of the table. Fix the issue, and validate again.
    - To remove a server, click on **Delete**.
1. You can **revalidate** the connectivity to servers anytime before starting the discovery.
1. Click on **Start discovery**, to kick off discovery of the successfully validated servers. After the discovery has been successfully initiated, you can check the discovery status against each server in the table.


This starts discovery. It takes approximately 2 minutes per server for metadata of discovered server to appear in the Azure portal.

## Verify servers in the portal

After discovery finishes, you can verify that the servers appear in the portal.

1. Open the Azure Migrate dashboard.
2. In **Azure Migrate - Windows, Linux and SQL Servers** > **Azure Migrate: Discovery and assessment** page, click the icon that displays the count for **Discovered servers**.


## Next steps

Try out [assessment of physical servers](tutorial-assess-physical.md) with Azure Migrate: Discovery and assessment.
