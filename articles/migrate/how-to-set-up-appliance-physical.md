---
title: Set up an Azure Migrate appliance for physical servers
description: Learn how to set up an Azure Migrate appliance for physical server assessment.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: article
ms.date: 11/19/2019
ms.author: raynew
---


# Set up an appliance for physical servers

This article describes how to set up the Azure Migrate appliance if you're assessing physical servers with the Azure Migrate: Server Assessment tool.

> [!NOTE]
> If features are mentioned here that you don't yet see in the Azure Migrate portal, hang on. They will appear over the next week or so.

The Azure Migrate appliance is a lightweight appliance, used by Azure Migrate Server Assessment to do the following:

- Discover on-premises servers.
- Send metadata and performance data for discovered servers to Azure Migrate Server Assessment.

[Learn more](migrate-appliance.md) about the Azure Migrate appliance.


## Appliance deployment steps

To set up the appliance you:
- Download a zipped file with Azure Migrate installer script from the Azure portal.
- Extract the contents from the zipped file. Launch the PowerShell console with administrative privileges.
- Execute the PowerShell script to launch the appliance web application.
- Configure the appliance for the first time, and register it with the Azure Migrate project.

## Download the installer script

Download the zipped file for the appliance.

1. In **Migration Goals** > **Servers** > **Azure Migrate: Server Assessment**, click **Discover**.
2. In **Discover machines** > **Are your machines virtualized?**, click **Not virtualized/Other**.
3. Click **Download** to download the zipped file.

    ![Download VM](./media/how-to-set-up-appliance-hyper-v/download-appliance-hyperv.png)


### Verify security

Check that the zipped file is secure, before you deploy it.

1. On the machine to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the VHD
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example usage: ```C:\>CertUtil -HashFile C:\AzureMigrate\AzureMigrate.ova SHA256```
3.  For the latest appliance version, the generated hash should match these settings.

  **Algorithm** | **Hash value**
  --- | ---
  MD5 | 96fd99581072c400aa605ab036a0a7c0
  SHA256 | f5454beef510c0aa38ac1c6be6346207c351d5361afa0c9cea4772d566fcdc36



## Run the Azure Migrate installer script
=
The installer script does the following:

- Installs agents and a web application for physical server discovery and assessment.
- Install Windows roles, including Windows Activation Service, IIS, and PowerShell ISE.
- Download and installs an IIS rewritable module. [Learn more](https://www.microsoft.com/download/details.aspx?id=7435).
- Updates a registry key (HKLM) with persistent setting details for Azure Migrate.
- Creates the following files under the path:
    - **Config Files**: %Programdata%\Microsoft Azure\Config
    - **Log Files**: %Programdata%\Microsoft Azure\Logs

Run the script as follows:

1. Extract the zipped file to a folder on the server that will host the appliance.
2. Launch PowerShell on the above server with administrative (elevated) privilege.
3. Change the PowerShell directory to the folder where the contents have been extracted from the downloaded zipped file.
4. Run the script by running the following command:
    ```
    AzureMigrateInstaller.ps1
    ```
The script will launch the appliance web application when it finishes successfully.



### Verify appliance access to Azure

Make sure that the appliance VM can connect to the required [Azure URLs](migrate-appliance.md#url-access).

## Configure the appliance

Set up the appliance for the first time.

1. Open a browser on any machine that can connect to the VM, and open the URL of the appliance web app: **https://*appliance name or IP address*: 44368**.

   Alternately, you can open the app from the desktop by clicking the app shortcut.
2. In the web app > **Set up prerequisites**, do the following:
    - **License**: Accept the license terms, and read the third-party information.
    - **Connectivity**: The app checks that the VM has internet access. If the VM uses a proxy:
        - Click **Proxy settings**, and specify the proxy address and listening port, in the form http://ProxyIPAddress or http://ProxyFQDN.
        - Specify credentials if the proxy needs authentication.
        - Only HTTP proxy is supported.
    - **Time sync**: Time is verified. The time on the appliance should be in sync with internet time for VM discovery to work properly.
    - **Install updates**: Azure Migrate Server Assessment checks that the appliance has the latest updates installed.

### Register the appliance with Azure Migrate

1. Click **Log In**. If it doesn't appear, make sure you've disabled the pop-up blocker in the browser.
2. On the new tab, sign in using your Azure credentials.
    - Sign in with your username and password.
    - Sign-in with a PIN isn't supported.
3. After successfully signing in, go back to the web app.
4. Select the subscription in which the Azure Migrate project was created. Then select the project.
5. Specify a name for the appliance. The name should be alphanumeric with 14 characters or less.
6. Click **Register**.


## Start continuous discovery

Connect from the appliance to physical servers, and start the discovery.

1. Click **Add Credentials** to specify the account credentials that the appliance will use to discover servers.  
2. Specify the **Operating System**,  friendly name for the credentials, **Username** and **Password** and click **Add**.
You can add one set of credentials each for Windows and Linux servers.
4. Click **Add server**, and specify server details- FQDN/IP address and friendly name of credentials (one entry per row) to connect to the server.
3. Click **Validate**. After validation, the list of servers that can be discovered is shown.
    - If validation fails for a server, review the error by hovering over the icon in the **Status** column. Fix issues, and validate again.
    - To remove a server, select > **Delete**.
4. After validation, click **Save and start discovery** to start the discovery process.

This starts discovery. It takes around 15 minutes for metadata of discovered VMs to appear in the Azure portal.

## Verify servers in the portal

After discovery finishes, you can verify that the servers appear in the portal.

1. Open the Azure Migrate dashboard.
2. In **Azure Migrate - Servers** > **Azure Migrate: Server Assessment** page, click the icon that displays the count for **Discovered servers**.


## Next steps

Try out [assessment of physical servers](tutorial-assess-physical.md) with Azure Migrate Server Assessment.
