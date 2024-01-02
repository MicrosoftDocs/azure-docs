---
title: Set up an Azure Migrate appliance for physical servers
description: Learn how to set up an Azure Migrate appliance for physical server discovery and assessment.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: how-to
ms.service: azure-migrate
ms.date: 09/15/2023
ms.custom: engagement-fy23
---


# Set up an appliance for physical servers

This article describes how to set up the Azure Migrate appliance if you're assessing physical servers with the Azure Migrate: Discovery and assessment tool.

The Azure Migrate appliance is a lightweight appliance, used by Azure Migrate: Discovery and assessment to do the following:

- Discover on-premises servers.
- Send metadata and performance data for discovered servers to Azure Migrate: Discovery and assessment.

[Learn more](migrate-appliance.md) about the Azure Migrate appliance.

After creating the appliance, you check that it can connect to Azure Migrate: Discovery and assessment, configure it for the first time, and register it with the project.

> [!NOTE]
> If you have already created a project, you can use the same project to register additional appliances to discover and assess more no of servers.[Learn more](create-manage-projects.md#find-a-project)

## Appliance deployment steps

To set up the appliance you:

1. Provide an appliance name and generate a project key in the portal.
2. Download a zipped file with Azure Migrate installer script from the Azure portal.
3. Extract the contents from the zipped file. Launch the PowerShell console with administrative privileges.
4. Execute the PowerShell script to launch the appliance configuration manager.
5. Configure the appliance for the first time, and register it with the project using the project key.

### Generate the project key

1. In **Migration goals** > **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**, select **Discover**.
2. In **Discover servers** > **Are your servers virtualized?**, select **Physical or other (AWS, GCP, Xen, etc.)**.
3. In **1:Generate project key**, provide a name for the Azure Migrate appliance that you will set up for discovery of physical or virtual servers. The name should be alphanumeric with 14 characters or fewer.
1. Click on **Generate key** to start the creation of the required Azure resources. Do not close the Discover servers page during the creation of resources.
1. After the successful creation of the Azure resources, a **project key** is generated.
1. Copy the key as you will need it to complete the registration of the appliance during its configuration.

    :::image type="content" source="./media/tutorial-assess-physical/generate-key-physical-1-inline.png" alt-text="Screenshots of selections for Generate Key." lightbox="./media/tutorial-assess-physical/generate-key-physical-1-expanded.png":::

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
    [Latest version](https://go.microsoft.com/fwlink/?linkid=2191847) | 7EF01AE30F7BB8F4486EDC1688481DB656FB8ECA7B9EF6363B4DAB1CFCFDA141

> [!NOTE]
> The same script can be used to set up Physical appliance for either Azure public or Azure Government cloud.

### Run the Azure Migrate installer script

1. Extract the zipped file to a folder on the server that will host the appliance.  Make sure you don't run the script on a server with an existing Azure Migrate appliance.
2. Launch PowerShell on the above server with administrative (elevated) privilege.
3. Change the PowerShell directory to the folder where the contents have been extracted from the downloaded zipped file.
4. Run the script named **AzureMigrateInstaller.ps1** by running the following command:

   `PS C:\Users\administrator\Desktop\AzureMigrateInstaller> .\AzureMigrateInstaller.ps1`

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

You can *rerun prerequisites* at any time during appliance configuration to check whether the appliance meets all the prerequisites.

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
    
    ![Screenshot of SSH private key supported format.](./media/tutorial-discover-physical/key-format.png)
1. If you want to add multiple credentials at once, click on **Add more** to save and add more credentials. Multiple credentials are supported for physical servers discovery.
   > [!Note]
   > By default, the credentials will be used to gather data about the installed applications, roles, and features, and also to collect dependency data from Windows and Linux servers, unless you disable the slider to not perform these features (as instructed in the last step).
1. In **Step 2:Provide physical or virtual server details​**, click on **Add discovery source** to specify the server **IP address/FQDN** and the friendly name for credentials to connect to the server.
1. You can either **Add single item** at a time or **Add multiple items** in one go. There is also an option to provide server details through **Import CSV**.

    ![Screenshot of selections for adding discovery source.](./media/tutorial-assess-physical/add-discovery-source-physical.png)

    - If you choose **Add single item**, you can choose the OS type, specify friendly name for credentials, add server **IP address/FQDN** and click on **Save**.
    - If you choose **Add multiple items**, you can add multiple records at once by specifying server **IP address/FQDN** with the friendly name for credentials in the text box. Verify** the added records and click on **Save**.
    - If you choose **Import CSV** _(selected by default)_, you can download a CSV template file, populate the file with the server **IP address/FQDN** and friendly name for credentials. You then import the file into the appliance, **verify** the records in the file and click on **Save**.

1. On clicking Save, appliance will try validating the connection to the servers added and show the **Validation status** in the table against each server.
    - If validation fails for a server, review the error by clicking on **Validation failed** in the Status column of the table. Fix the issue, and validate again.
    - To remove a server, click on **Delete**.
1. You can **revalidate** the connectivity to servers anytime before starting the discovery.
1. Before initiating discovery, you can choose to disable the slider to not perform software inventory and agentless dependency analysis on the added servers. You can change this option at any time.

   :::image type="content" source="./media/tutorial-discover-physical/disable-slider.png" alt-text="Screenshot that shows where to disable the slider.":::
1. To perform discovery of SQL Server instances and databases, you can add additional credentials (Windows domain/non-domain, SQL authentication credentials) and the appliance will attempt to automatically map the credentials to the SQL servers. If you add domain credentials, the appliance will authenticate the credentials against Active Directory of the domain to prevent any user accounts from locking out. To check validation of the domain credentials, follow these steps:
  - In the configuration manager credentials table, see **Validation status** for domain credentials. Only the domain credentials are validated.
  - If validation fails, you can select a Failed status to see the validation error. Fix the issue, and then select **Revalidate credentials** to reattempt validation of the credentials.

### Start discovery

Click on **Start discovery**, to kick off discovery of the successfully validated servers. After the discovery has been successfully initiated, you can check the discovery status against each server in the table.

## How discovery works

* It takes approximately 2 minutes to complete discovery of 100 servers and their metadata to appear in the Azure portal.
* [Software inventory](how-to-discover-applications.md) (discovery of installed applications) is automatically initiated when the discovery of servers is finished.
* The time taken for discovery of installed applications depends on the number of discovered servers. For 500 servers, it takes approximately one hour for the discovered inventory to appear in the Azure Migrate project in the portal.
* During software inventory, the added server credentials are iterated against servers and validated for agentless dependency analysis. When the discovery of servers is finished, in the portal, you can enable agentless dependency analysis on the servers. Only the servers on which validation succeeds can be selected to enable [agentless dependency analysis](how-to-create-group-machine-dependencies-agentless.md).

## Verify servers in the portal

After discovery finishes, you can verify that the servers appear in the portal.

1. Open the Azure Migrate dashboard.
2. In **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment** page, click the icon that displays the count for **Discovered servers**.


## Next steps

Try out [assessment of physical servers](tutorial-assess-physical.md) with Azure Migrate: Discovery and assessment.
