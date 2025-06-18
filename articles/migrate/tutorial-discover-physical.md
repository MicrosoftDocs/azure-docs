---
title: Discover physical servers with Azure Migrate discovery and assessment
description: Learn how to discover on-premises physical servers with Azure Migrate discovery and assessment.
author: molishv
ms.author: v-uhabiba
ms.manager: abhemraj
ms.topic: tutorial
ms.date: 02/07/2025
ms.service: azure-migrate
ms.custom: mvc, subject-rbac-steps, engagement-fy24, linux-related-content
#Customer intent: As a server admin I want to discover my on-premises server inventory.
---

# Discover physical servers and servers running in AWS and GCP

This article explains how to set up the Azure Migrate appliance to discover physical servers and servers running in AWS, GCP, or any other cloud.

The Azure Migrate appliance is a lightweight tool that Azure Migrate: Discovery and assessment uses to:

- Discover on-premises servers.
- Send metadata and performance data of the discovered servers to Azure Migrate: Discovery and assessment.

## Prerequisites

Before you set up the appliance, [create an Azure Migrate project](create-project.md) by following these steps.

## Prepare Azure Migrate appliance

- Check the hardware requirements for the [Azure Migrate appliance](migrate-appliance.md).
- Ensure the appliance VM can connect to all the required [endpoints](migrate-appliance.md#url-access).

### Prepare Windows server

To discover Windows servers and enable software inventory and agentless dependency analysis, use a domain account for domain-joined servers or a local account for servers that are not domain-joined.

You can create the local user account in one of two ways:

#### Option 1: Set up a least-privileged Windows user account (recommended)

- Add the user account to these groups: Remote Management Users, Performance Monitor Users, and Performance Log Users.
- If the Remote Management Users group is not available, add the user to the `WinRMRemoteWMIUsers_ group` instead.
- The account needs these permissions so the appliance can create a CIM connection with the server and collect configuration and performance data from the required WMI classes.
- Sometimes, even after adding the account to the right groups, it may not return the needed data because of [UAC](/windows/win32/wmisdk/user-account-control-and-wmi) filtering. To fix this, give the user account the right permissions on the **CIMV2 namespace** and its sub-namespaces on the target server. You can follow these [steps](troubleshoot-appliance.md) to set the required permissions.

>[!Note]
> - For Windows Server 2008 and 2008 R2, ensure that WMF 3.0 is installed on the servers.
> - To discover SQL Server databases on Windows Servers, both Windows and SQL Server authentication are supported. </br> You can enter credentials for both types in the appliance configuration manager. </br> Azure Migrate needs a Windows user account that is part of the `sysadmin` server role.

#### Option 2: Set up administrator account

To set up:

- Create an account with administrator rights on the servers.
- This account helps collect configuration and performance data using a CIM connection.
- It also supports software inventory (finding installed applications) and enables agentless dependency analysis through PowerShell remoting.

### Prepare Linux server

To discover Linux servers, you can create a sudo user account like this:

**Set up Least privileged Linux user accounts** 

- You need a sudo user account on the Linux servers you want to discover.
- This account helps collect configuration and performance data, perform software inventory (find installed applications), and enable agentless dependency analysis using SSH.
- The user account must have sudo access to the required file paths.

```
/usr/sbin/dmidecode -s system-uuid
/usr/sbin/dmidecode -t 1
/usr/sbin/dmidecode -s system-manufacturer
/usr/sbin/fdisk -l
/usr/sbin/fdisk -l
/usr/bin/ls
/usr/bin/netstat
/usr/sbin/lvdisplay   

```
- For example, you can add an entry like this in the `/etc/sudoers` file.

```

    AzMigrateLeastprivuser ALL=(ALL) NOPASSWD: \
    /usr/sbin/dmidecode -s system-uuid, \
    /usr/sbin/dmidecode -t 1, \
    /usr/sbin/dmidecode -s system-manufacturer, \
    /usr/sbin/fdisk -l, \
    /usr/bin/ls -l /proc/*/exe, \
    /usr/bin/netstat -atnp, \
    /usr/sbin/lvdisplay

```

- Ensure that you enable `NOPASSWD` for the account so it can run the required commands without asking for a password each time it uses sudo.
- The list of commands run on the target servers and the information they collect. [Learn more](discovered-metadata.md#linux-server-metadata).
- Below is the list of supported Linux operating system distributions.

| Operating system| Versions |
| --- | --- | 
| Red Hat Enterprise Linux | 5.1, 5.3, 5.11, 6.x, 7.x, 8.x, 9.x, 9.5|
| Ubuntu | 524.04, 22.04, 12.04, 14.04, 16.04, 18.04, 20.04, 22.04|
| Oracle Linux| 6.1, 6.7, 6.8, 6.9, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 8, 8.1, 8.3, 8.5|
| SUSE Linux| 10, 11 SP4, 12 SP1, 12 SP2, 12 SP3, 12 SP4, 15 SP2, 15 SP3|
| Debian | 7, 8, 9, 10, 11|
| Amazon Linux | 2.0.2021|
| CoreOS Container | 2345.3.0|
| Alma Linux | 8.x, 9.x|
| Rocky Linux | 8.x, 9.x|

> [!Note]
> We recommend setting up least-privileged sudo accounts. You can also use any account, like root, that already has all the required permissions for Linux discovery.

## Generate the project key

To generate the project key, follow the steps:

1. In **Servers, databases, and web apps** > **Azure Migrate: Discovery and assessment**, select **Discover**.
1. In **Discover servers** > **Are your servers virtualized?**, select **Physical or other (AWS, GCP, Xen, etc.)**.
1. **Generate project key**, enter a name for the Azure Migrate appliance you want to set up to discover physical or virtual servers. The name should be alphanumeric and 14 characters or fewer.
1. Select **Generate key** to start creating the required Azure resources. Keep the Discover servers page open while the resources are created.
1. After the resources are created successfully, a **project key** is generated.
1. Copy the key as you’ll need it to register the appliance during its setup.

    :::image type="content" source="./media/tutorial-discover-physical/discover-generate-key.png" alt-text="Screenshot that shows how to generate the key." lightbox="./media/tutorial-discover-physical/discover-generate-key.png" :::

## Download the installer script

1. In **Download Azure Migrate appliance**, select **Download**.
1. Verify security: Before you install, check that the zipped file is safe.
    On the server where you downloaded the file, open a command window as an administrator.
1. Run this command to generate the hash for the zipped file: 
    - `C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]`
    - For example: `C:\>CertUtil -HashFile C:\Users\administrator\Desktop\AzureMigrateInstaller.zip SHA256`
1. Verify the latest appliance version and hash value to ensure that they match.

| Download | Hash value | 
| --- | --- |
| [Latest version](https://go.microsoft.com/fwlink/?linkid=2191847)| 07783A31D1E66BE963349B5553DC1F1E94C70AA149E11AC7D8914F4076480731|

>[!Note]
> You can use the same script to set up the physical appliance for both Azure Public and Azure Government cloud.

## Run the Azure Migrate installer script

To run the installer script:

1. Extract the zipped file to a folder on the server where you want to install the appliance. Ensure that you don’t run the script on a server that already has an Azure Migrate appliance.
1. Open PowerShell on that server with administrator (elevated) rights.
1. Go to the folder where you extracted the files from the zipped download.
Run the script named `AzureMigrateInstaller.ps1` using this command: 
    `PS C:\Users\administrator\Desktop\AzureMigrateInstaller> .\AzureMigrateInstaller.ps1`
1. Select from the scenario, cloud, and connectivity options to deploy an appliance with the desired configuration. For instance, the selection shown below sets up an appliance to discover and assess **physical servers** *(or servers running on other clouds like AWS, GCP, Xen, etc.)* to an Azure Migrate project with **default (public endpoint) connectivity** on **Azure public cloud**.
    
    :::image type="content" source="./media/tutorial-discover-physical/set-up-appliance.png" alt-text="Screenshot that shows how to setup appliance." lightbox="./media/tutorial-discover-physical/set-up-appliance.png" :::
  
1. The installer script does the following:
    1. Installs agents and a web application. 
    1. Installs Windows roles like Windows Activation Service, IIS, and PowerShell ISE.
    1. Downloads and installs an IIS rewritable module.
    1. Updates a registry key (HKLM) with Azure Migrate settings.
    1. Creates these files under the path:
        - Config Files: `%Programdata%\Microsoft Azure\Config`
        - Log Files: `%Programdata%\Microsoft Azure\Logs`

After the script runs successfully, it automatically launches the appliance configuration manager.

>[!Note]
> If you face any issues, you can find the script logs at `C:\ProgramData\Microsoft Azure\Logs\AzureMigrateScenarioInstaller_Timestamp.log to troubleshoot`.

## Verify appliance access to Azure

Ensure that the appliance connects to Azure URLs for [public](migrate-appliance.md#public-cloud-urls) and [government clouds](migrate-appliance.md#government-cloud-urls).

### Configure the Appliance

Set up the appliance for the first time:

1. Open a browser on any machine that connects to the appliance. Go to the appliance web app URL:https://[appliance name or IP address]:44368. Or open the app from the desktop by selecting the shortcut.

1. Accept the license terms and read the partner information.

## Set up prerequisites and register the appliance

In the configuration manager, select **Set up prerequisites**, and then follow these steps:

1. **Connectivity**: The appliance checks if the server has internet access. If the server uses a proxy:

    - Select **Setup proxy** and enter the proxy address *(http://ProxyIPAddress or http://ProxyFQDN, where FQDN means fully qualified domain name)* and the listening port.
    - Enter credentials if the proxy needs authentication.
    - If you add or change proxy settings or disable the proxy or authentication, select **Save** to apply the changes and check connectivity again.
    
    > [!Note]
    > Only HTTP proxy is supported.

1. **Time sync**: Check that the appliance time matches internet time. This is needed for discovery to work properly.

1. **Install updates and register appliance**: Follow the steps to run auto-update and register the appliance.

    :::image type="content" source="./media/tutorial-discover-physical/install-updates-register-appliance.png" alt-text="Screenshot that shows to install updates and register the appliance." lightbox="./media/tutorial-discover-physical/install-updates-register-appliance.png" :::

1. To enable automatic updates on the appliance, paste the project key you copied from the portal.
1. If you don't have the key, go to **Azure Migrate**: **Discovery and assessment** > **Overview** > **Manage existing appliances**.
1. Select the appliance name you used when you created the project key, then copy the key shown there.
1. The appliance verifies the key and starts the auto-update service. This service updates all appliance components to their latest versions. After the update finishes, you can select **View appliance services** to see the status and versions of the services running on the appliance server.
1. To register the appliance, select Login. In **Continue with Azure Login** select **Copy code & Login** to copy the device code. You need this code to sign in to Azure. The browser opens a new tab with the Azure sign-in prompt. Make sure you turn off the pop-up blocker to see the prompt.

    :::image type="content" source="./media/tutorial-discover-physical/continue-azure-login.png" alt-text="Screenshot that shows how to continue to azure login." lightbox="./media/tutorial-discover-physical/continue-azure-login.png" :::
   
1. In a new browser tab, paste the device code and sign in using your Azure username and password. You cannot sign in with a PIN.

> [!Note]
> If you close the sign-in tab accidentally without logging in, refresh the browser tab of the appliance configuration manager. It shows the device code and the **Copy code & Login button again**.

1. After you sign in successfully, return to the browser tab that displays the appliance configuration manager.
1. If the Azure account you used has the right permissions for the Azure resources created during key generation, the appliance starts registration.
1. When the appliance registers successfully, select **View details** to see the registration information.
1. You can run the prerequisites again anytime during the appliance setup to check if it meets all the requirements.

### Add credentials 

Now, connect the appliance to the physical servers and start discovery:

1. **Provide credentials for discovery of Windows and Linux physical or virtual servers**, select **Add credentials**.
1. For a Windows server: 
    1. Select the source type as **Windows Server**.
    1. Enter a friendly name for the credentials.
    1. Add the username and password.
    1. Select **Save**.

1. If you use password-based authentication for a Linux server, select the source type as **Linux Server (Password-based)**. 
    1. Enter a friendly name for the credentials.
    1. Add the username and password, and then select **Save**.
1. If you use SSH key-based authentication for a Linux server:
    1. Select the source type as **Linux Server (SSH key-based)**.
    1. Enter a friendly name for the credentials.
    1. Add the username.
    1. Browse and select the SSH private key file. 
    1. Select **Save**.
    > [!Note]
    > - Azure Migrate supports SSH private keys created using the ssh-keygen command with RSA, DSA, ECDSA, and ed25519 algorithms.
    - It does not support SSH keys with a passphrase. Use a key without a passphrase.
    - It does not support SSH private key files created by PuTTY.
    - It supports SSH private key files in OpenSSH format.

1. To add multiple credentials at once, select **Add more** to save and enter more credentials. The appliance supports multiple credentials for physical server discovery.

>[!Note]
> By default, the appliance uses the credentials to collect data about installed applications, roles, and features. It also collects dependency data from Windows and Linux servers, unless you turn off the slider to skip these actions in the last step.

### Add server details 

1. **Provide physical or virtual server** details.
1. Select **Add discovery source** to enter the server IP address or FQDN and the friendly name for the credentials used to connect to the server.
    1. The appliance uses WinRM port 5986 (HTTPS) by default to communicate with Windows servers, and port 22 (TCP) for Linux servers.
    1. If the target Hyper-V servers do not have HTTPS [prerequisites](/troubleshoot/windows-client/system-management-components/configure-winrm-for-https) set up, the appliance switches to WinRM port 5985 (HTTP).
    1. 
    :::image type="content" source="./media/tutorial-discover-physical/physical-virtual-server-details.png" alt-text="Screenshot that shows the physical or virtual server details." lightbox="./media/tutorial-discover-physical/physical-virtual-server-details.png" :::    
   
    1. To use HTTPS communication without fallback, turn on the HTTPS protocol toggle in Appliance Config Manager.
    1. After you turn on the checkbox, ensure that the prerequisites are configured on the target servers. If the servers do not have certificates, discovery fails on both current and newly added servers.
        1. WinRM HTTPS needs a local computer Server Authentication certificate. The certificate must have a CN that matches the hostname. It must not be expired, revoked, or self-signed. [Learn more](/troubleshoot/windows-client/system-management-components/configure-winrm-for-https).
1. You can **Add single item** at a time or **Add multiple items** together. You can also provide server details through **Import a CSV file**. 
    
    :::image type="content" source="./media/tutorial-discover-physical/add-discovery-source.png" alt-text="Screenshot that shows how to add physical discovery source." lightbox="./media/tutorial-discover-physical/add-discovery-source.png" :::  
    
    1. If you choose **Add single item**, select the OS type. 
    1. Enter a friendly name for the credentials, add the server **IP address or FQDN**.
    1. Select **Save**.
    1. If you choose **Add multiple items**, enter multiple records at once by specifying the server **IP address or FQDN**. 
    1. Enter the friendly name for the credentials in the text box. 
    1. Verify the records and then select **Save**.
    1. If you choose **Import CSV** *(this is selected by default)*, download the CSV template file. 
    1. Fill it with the server **IP address or FQDN**.
    1. Enter the friendly name for the credentials. Then import the file into the appliance.
    1. Verify the records, and then select **Save**.

1. When you select **Save**, the appliance validates the connection to the added servers and shows the **Validation status** in the table next to each server. 
    1. If validation fails for a server, you can review the error by selecting **Validation failed** in the Status column. Fix the issue and validate again.
    1. To remove a server, select **Delete**.
1. You can **revalidate** the connectivity to servers any time before you start the discovery. 
1. Before you start discovery, you can turn off the slider to skip software inventory and agentless dependency analysis on the added servers. You can change this option at any time.
1. To discover SQL Server instances and databases, you add extra credentials (Windows domain, non-domain, or SQL authentication). The appliance then tries to automatically map these credentials to the SQL servers. If you add domain credentials, the appliance authenticates them with the domain’s Active Directory to prevent user account lockouts. To check if the domain credentials are valid, follow these steps:
    1. In the configuration manager credentials table, you see the **Validation status** for domain credentials. Only domain credentials are validated.
    1. If you use domain accounts, the username must be in Down-Level format (domain\username). The UPN format (username@domain.com) isn't supported.
    1. If validation fails, you can select the Failed status to view the error. Fix the issue, and then select **Revalidate credentials** to try again.
    
## Start discovery

Select **Start discovery** to begin discovering the validated servers. After discovery starts, you can check each server’s discovery status in the table.

### How discovery works

- It takes about 2 minutes to discover 100 servers and show their metadata in the Azure portal.
- [Software inventory](how-to-discover-applications.md) (installed applications discovery) starts automatically after the server discovery finishes. 
- The time to discover installed applications depends on the number of servers. For 500 servers, it takes about one hour for the inventory to appear in the Azure Migrate project in the portal. 
- The server credentials are checked and validated for agentless dependency analysis during software inventory. After server discovery finishes, you can enable [agentless dependency analysis](how-to-create-group-machine-dependencies-agentless.md) in the portal. You can select only the servers that pass validation.


### Verify servers in the portal

After discovery finishes, you can verify that the servers appear in the portal.
1.	Open the Azure Migrate dashboard.
2.	In **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment** page, select the icon that displays the count for discovered servers.

## View License support status

You get deeper insights into your environment’s support posture from the **Discovered servers** and **Discovered database instances** sections.

The **Operating system license support status** column shows whether the operating system is in mainstream support, extended support, or out of support. When you select the support status, a pane opens on the right and gives clear guidance on what actions you can take to secure servers and databases that are in extended support or out of support.

To view the remaining duration until end of support, select **Columns** > **Support ends in** > **Submit**. The Support ends in column then shows the remaining duration in months.

The **Database instances** section displays the number of instances that Azure Migrate discovers. Select the number to view the database instance details. The **Database instance license support status** shows the support status of each instance. When you select the support status, a pane opens on the right and provides clear guidance on actions you can take to secure servers and databases that are in extended support or out of support.

To see how many months are left until the end of support, select **Columns** > **Support ends in** > **Submit**. The **Support ends in** column then shows the remaining duration in months.

## Delete servers

After discovery starts, you can delete any added server from the appliance configuration manager by searching for the server name in the **Add discovery source** table and selecting **Delete**.

>[!Note]
> If you delete a server after discovery starts, it stops the ongoing discovery and assessment. This action might affect the confidence rating of the assessment that includes the server. [Learn more](common-questions-discovery-assessment.md#why-is-the-confidence-rating-of-my-assessment-low).

## Next steps

Try [assessment of physical servers](tutorial-assess-physical.md) with Azure Migrate: Discovery and assessment.