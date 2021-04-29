---
title: Discover servers on Hyper-V with Azure Migrate Discovery and assessment 
description: Learn how to discover on-premises servers on Hyper-V with the Azure Migrate Discovery and assessment tool.
author: vineetvikram
ms.author: vivikram
ms.manager: abhemraj
ms.topic: tutorial
ms.date: 03/25/2021
ms.custom: mvc
#Customer intent: As a Hyper-V admin, I want to discover my on-premises servers on Hyper-V.
---

# Tutorial: Discover servers running on Hyper-V with Azure Migrate: Discovery and assessment

As part of your migration journey to Azure, you discover your on-premises inventory and workloads.

This tutorial shows you how to discover on-premises servers on Hyper-V hosts with the Azure Migrate: Discovery and assessment tool, using a lightweight Azure Migrate appliance. You deploy the appliance as a server on Hyper-V host, to continuously discover machine and performance metadata.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up an Azure account
> * Prepare the Hyper-V environment for discovery.
> * Create a project.
> * Set up the Azure Migrate appliance.
> * Start continuous discovery.

> [!NOTE]
> Tutorials show the quickest path for trying out a scenario, and use default options.  

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Prerequisites

Before you start this tutorial, check you have these prerequisites in place.

**Requirement** | **Details**
--- | ---
**Hyper-V host** | Hyper-V hosts on which servers are located can be standalone, or in a cluster.<br/><br/> The host must be running Windows Server 2019, Windows Server 2016, or Windows Server 2012 R2.<br/><br/> Verify inbound connections are allowed on WinRM port 5985 (HTTP), so that the appliance can connect to pull server metadata and performance data, using a Common Information Model (CIM) session.
**Appliance deployment** | Hyper-V host needs resources to allocate a server for the appliance:<br/><br/> - 16 GB of RAM, 8 vCPUs, and around 80 GB of disk storage.<br/><br/> - An external virtual switch, and internet access on the appliance, directly or via a proxy.
**Servers** | Servers can be running any Windows or Linux operating system.

## Prepare an Azure user account

To create a project and register the Azure Migrate appliance, you need an account with:
- Contributor or Owner permissions on an Azure subscription.
- Permissions to register Azure Active Directory(AAD) apps.

If you just created a free Azure account, you're the owner of your subscription. If you're not the subscription owner, work with the owner to assign the permissions as follows:

1. In the Azure portal, search for "subscriptions", and under **Services**, select **Subscriptions**.

    ![Search box to search for the Azure subscription](./media/tutorial-discover-hyper-v/search-subscription.png)

2. In the **Subscriptions** page, select the subscription in which you want to create a project.
3. In the subscription, select **Access control (IAM)** > **Check access**.
4. In **Check access**, search for the relevant user account.
5. In **Add a role assignment**, click **Add**.

    ![Search for a user account to check access and assign a role](./media/tutorial-discover-hyper-v/azure-account-access.png)

6. In **Add role assignment**, select the Contributor or Owner role, and select the account (azmigrateuser in our example). Then click **Save**.

    ![Opens the Add Role assignment page to assign a role to the account](./media/tutorial-discover-hyper-v/assign-role.png)

1. To register the appliance, your Azure account needs **permissions to register AAD apps.**
1. In Azure portal, navigate to **Azure Active Directory** > **Users** > **User Settings**.
1. In **User settings**, verify that Azure AD users can register applications (set to **Yes** by default).

    ![Verify in User Settings that users can register Active Directory apps](./media/tutorial-discover-hyper-v/register-apps.png)

9. In case the 'App registrations' settings is set to 'No', request the tenant/global admin to assign the required permission. Alternately, the tenant/global admin can assign the **Application Developer** role to an account to allow the registration of AAD App. [Learn more](../active-directory/fundamentals/active-directory-users-assign-role-azure-portal.md).

## Prepare Hyper-V hosts

You can prepare Hyper-V hosts manually, or using a script. The preparation steps are summarized in the table. The script prepares these automatically.

**Step** | **Script** | **Manual**
--- | --- | ---
Verify host requirements | Checks that the host is running a supported version of Hyper-V, and the Hyper-V role.<br/><br/>Enables the WinRM service, and opens ports 5985 (HTTP) and 5986 (HTTPS) on the host (needed for metadata collection). | The host must be running Windows Server 2019, Windows Server 2016, or Windows Server 2012 R2.<br/><br/> Verify inbound connections are allowed on WinRM port 5985 (HTTP), so that the appliance can connect to pull server metadata and performance data, using a Common Information Model (CIM) session.<br/><br/> The script isn't currently supported on hosts with a non-English locale.  
Verify PowerShell version | Checks that you're running the script on a supported PowerShell version. | Check you're running PowerShell version 4.0 or later on the Hyper-V host.
Create an account | Verifies that you have the correct permissions on the Hyper-V host.<br/><br/> Allows you to create a local user account with the correct permissions. | Option 1: Prepare an account with Administrator access to the Hyper-V host machine.<br/><br/> Option 2: Prepare a Local Admin account, or Domain Admin account, and add the account to these groups: Remote Management Users, Hyper-V Administrators, and Performance Monitor Users.
Enable PowerShell remoting | Enables PowerShell remoting on the host, so that the Azure Migrate appliance can run PowerShell commands on the host, over a WinRM connection. | To set up, on each host, open a PowerShell console as admin, and run this command: ``` powershell Enable-PSRemoting -force ```
Set up Hyper-V integration services | Checks that the Hyper-V Integration Services is enabled on all servers managed by the host. | [Enable Hyper-V Integration Services](/windows-server/virtualization/hyper-v/manage/manage-hyper-v-integration-services) on each server.<br/><br/> If you're running Windows Server 2003, [follow these instructions](prepare-windows-server-2003-migration.md).
Delegate credentials if server disks are located on remote SMB shares | Delegates credentials | Run this command to enable CredSSP to delegate credentials on hosts running servers with disks on SMB shares: ```powershell Enable-WSManCredSSP -Role Server -Force ```<br/><br/> You can run this command remotely on all Hyper-V hosts.<br/><br/> If you add new host nodes on a cluster they're automatically added for discovery, but you need to enable CredSSP manually.<br/><br/> When you set up the appliance, you finish setting up CredSSP by [enabling it on the appliance](#delegate-credentials-for-smb-vhds). 

### Run the script

1. Download the script from the [Microsoft Download Center](https://aka.ms/migrate/script/hyperv). The script is cryptographically signed by Microsoft.
2. Validate the script integrity using either MD5, or SHA256 hash files. Hashtag values are below. Run this command to generate the hash for the script:

    ```powershell
    C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]
    ```
    Example usage:

    ```powershell
    C:\>CertUtil -HashFile C:\Users\Administrators\Desktop\ MicrosoftAzureMigrate-Hyper-V.ps1 SHA256
    ```
3. After validating the script integrity, run the script on each Hyper-V host with this PowerShell command with elevated permissions:

    ```powershell
    PS C:\Users\Administrators\Desktop> MicrosoftAzureMigrate-Hyper-V.ps1
    ```
Hash values are:

**Hash** |  **Value**
--- | ---
MD5 | 0ef418f31915d01f896ac42a80dc414e
SHA256 | 0ad60e7299925eff4d1ae9f1c7db485dc9316ef45b0964148a3c07c80761ade2

## Set up a project

Set up a new project.

1. In the Azure portal > **All services**, search for **Azure Migrate**.
2. Under **Services**, select **Azure Migrate**.
3. In **Overview**, select **Create project**.
5. In **Create project**, select your Azure subscription and resource group. Create a resource group if you don't have one.
6. In **Project Details**, specify the project name and the geography in which you want to create the project. Review supported geographies for [public](migrate-support-matrix.md#supported-geographies-public-cloud) and [government clouds](migrate-support-matrix.md#supported-geographies-azure-government).

   ![Boxes for project name and region](./media/tutorial-discover-hyper-v/new-project.png)

7. Select **Create**.
8. Wait a few minutes for the project to deploy. The **Azure Migrate: Discovery and assessment** tool is added by default to the new project.

![Page showing Azure Migrate: Discovery and assessment tool added by default](./media/tutorial-discover-hyper-v/added-tool.png)

> [!NOTE]
> If you have already created a project, you can use the same project to register additional appliances to discover and assess more no of servers.[Learn more](create-manage-projects.md#find-a-project)

## Set up the appliance

Azure Migrate uses a lightweight Azure Migrate appliance. The appliance performs server discovery and sends server configuration and performance metadata to Azure Migrate. The appliance can be set up by deploying a VHD file that can be downloaded from the project.

> [!NOTE]
> If for some reason you can't set up the appliance using the template, you can set it up using a PowerShell script on an existing Windows Server 2016 server. [Learn more](deploy-appliance-script.md#set-up-the-appliance-for-hyper-v).

This tutorial sets up the appliance on a server running in Hyper-V environment, as follows:

1. Provide an appliance name and generate a project key in the portal.
1. Download a compressed Hyper-V VHD from the Azure portal.
1. Create the appliance, and check that it can connect to Azure Migrate: Discovery and assessment.
1. Configure the appliance for the first time, and register it with the project using the project key.

### 1. Generate the project key

1. In **Migration Goals** > **Servers** > **Azure Migrate: Discovery and assessment**, select **Discover**.
2. In **Discover Servers** > **Are your servers virtualized?**, select **Yes, with Hyper-V**.
3. In **1:Generate project key**, provide a name for the Azure Migrate appliance that you will set up for discovery of servers. The name should be alphanumeric with 14 characters or fewer.
1. Click on **Generate key** to start the creation of the required Azure resources. Please do not close the Discover server page during the creation of resources.
1. After the successful creation of the Azure resources, a **project key** is generated.
1. Copy the key as you will need it to complete the registration of the appliance during its configuration.

### 2. Download the VHD

In **2: Download Azure Migrate appliance**, select the .VHD file and click on **Download**.

### Verify security

Check that the zipped file is secure, before you deploy it.

1. On the machine to which you downloaded the file, open an administrator command window.

2. Run the following PowerShell command to generate the hash for the ZIP file
    - ```C:\>Get-FileHash -Path <file_location> -Algorithm [Hashing Algorithm]```
    - Example usage: ```C:\>Get-FileHash -Path ./AzureMigrateAppliance_v3.20.09.25.zip -Algorithm SHA256```

3.  Verify the latest appliance versions and hash values:

    - For the Azure public cloud:

        **Scenario** | **Download** | **SHA256**
        --- | --- | ---
        Hyper-V (8.91 GB) | [Latest version](https://go.microsoft.com/fwlink/?linkid=2140422) |  79c151588de049cc102f61b910d6136e02324dc8d8a14f47772da351b46d9127

    - For Azure Government:

        **Scenario*** | **Download** | **SHA256**
        --- | --- | ---
        Hyper-V (85.8 MB) | [Latest version](https://go.microsoft.com/fwlink/?linkid=2140424) |  cfed44bb52c9ab3024a628dc7a5d0df8c624f156ec1ecc3507116bae330b257f

### 3. Create an appliance

Import the downloaded file, and create an appliance.

1. Extract the zipped VHD file to a folder on the Hyper-V host that will host the appliance. Three folders are extracted.
2. Open Hyper-V Manager. In **Actions**, click **Import Virtual Machine**.
2. In the Import Virtual Machine Wizard > **Before you begin**, click **Next**.
3. In **Locate Folder**, specify the folder containing the extracted VHD. Then click **Next**.
1. In **Select Virtual Machine**, click **Next**.
2. In **Choose Import Type**, click **Copy the virtual machine (create a new unique ID)**. Then click **Next**.
3. In **Choose Destination**, leave the default setting. Click **Next**.
4. In **Storage Folders**, leave the default setting. Click **Next**.
5. In **Choose Network**, specify the virtual switch that the appliance will use. The switch needs internet connectivity to send data to Azure.
6. In **Summary**, review the settings. Then click **Finish**.
7. In Hyper-V Manager > **Virtual Machines**, start the appliance.

### Verify appliance access to Azure

Make sure that the appliance can connect to Azure URLs for [public](migrate-appliance.md#public-cloud-urls) and [government](migrate-appliance.md#government-cloud-urls) clouds.

### 4. Configure the appliance

Set up the appliance for the first time.

> [!NOTE]
> If you set up the appliance using a [PowerShell script](deploy-appliance-script.md) instead of the downloaded VHD, the first two steps in this procedure aren't relevant.

1. In Hyper-V Manager > **Virtual Machines**, right-click the appliance > **Connect**.
2. Provide the language, time zone, and password for the appliance.
3. Open a browser on any machine that can connect to the appliance, and open the URL of the appliance web app: **https://*appliance name or IP address*: 44368**.

   Alternately, you can open the app from the appliance desktop by clicking the app shortcut.
1. Accept the **license terms**, and read the third-party information.
1. In the web app > **Set up prerequisites**, do the following:
    - **Connectivity**: The app checks that the appliance has internet access. If the appliance uses a proxy:
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
4. If the Azure user account used for logging has the right permissions on the Azure resources created during key generation, the appliance registration will be initiated.
1. After appliance is successfully registered, you can see the registration details by clicking on **View details**.

### Delegate credentials for SMB VHDs

If you're running VHDs on SMBs, you must enable delegation of credentials from the appliance to the Hyper-V hosts. To do this from the appliance:

1. On the appliance, run this command. HyperVHost1/HyperVHost2 are example host names.

    ```
    Enable-WSManCredSSP -Role Client -DelegateComputer HyperVHost1.contoso.com, HyperVHost2.contoso.com, HyperVHost1, HyperVHost2 -Force
    ```

2. Alternatively, do this in the Local Group Policy Editor on the appliance:
    - In **Local Computer Policy** > **Computer Configuration**, click **Administrative Templates** > **System** > **Credentials Delegation**.
    - Double-click **Allow delegating fresh credentials**, and select **Enabled**.
    - In **Options**, click **Show**, and add each Hyper-V host you want to discover to the list, with **wsman/** as a prefix.
    - In  **Credentials Delegation**, double-click **Allow delegating fresh credentials with NTLM-only server authentication**. Again, add each Hyper-V host you want to discover to the list, with **wsman/** as a prefix.

## Start continuous discovery

Connect from the appliance to Hyper-V hosts or clusters, and start server discovery.

1. In **Step 1: Provide Hyper-V host credentials**, click on **Add credentials** to  specify a friendly name for credentials, add **Username** and **Password** for a Hyper-V host/cluster that the appliance will use to discover servers. Click on **Save**.
1. If you want to add multiple credentials at once, click on **Add more** to save and add more credentials. Multiple credentials are supported for discovery of servers in Hyper-V environment.
1. In **Step 2: Provide Hyper-V host/cluster details**, click on **Add discovery source** to specify the Hyper-V host/cluster **IP address/FQDN** and the friendly name for credentials to connect to the host/cluster.
1. You can either **Add single item** at a time or **Add multiple items** in one go. There is also an option to provide Hyper-V host/cluster details through **Import CSV**.

    - If you choose **Add single item**, you need to specify friendly name for credentials and Hyper-V host/cluster **IP address/FQDN** and click on **Save**.
    - If you choose **Add multiple items** _(selected by default)_, you can add multiple records at once by specifying Hyper-V host/cluster **IP address/FQDN** with the friendly name for credentials in the text box. **Verify** the added records and click on **Save**.
    - If you choose **Import CSV**, you can download a CSV template file, populate the file with the Hyper-V host/cluster **IP address/FQDN** and friendly name for credentials. You then import the file into the appliance, **verify** the records in the file and click on **Save**.

1. On clicking Save, appliance will try validating the connection to the Hyper-V hosts/clusters added and show the **Validation status** in the table against each host/cluster.
    - For successfully validated hosts/clusters, you can view more details by clicking on their IP address/FQDN.
    - If validation fails for a host, review the error by clicking on **Validation failed** in the Status column of the table. Fix the issue, and validate again.
    - To remove hosts or clusters, click on **Delete**.
    - You can't remove a specific host from a cluster. You can only remove the entire cluster.
    - You can add a cluster, even if there are issues with specific hosts in the cluster.
1. You can **revalidate** the connectivity to hosts/clusters anytime before starting the discovery.
1. Click on **Start discovery**, to kick off server discovery from the successfully validated hosts/clusters. After the discovery has been successfully initiated, you can check the discovery status against each host/cluster in the table.

This starts discovery. It takes approximately 2 minutes per host for metadata of discovered servers to appear in the Azure portal.

## Verify servers in the portal

After discovery finishes, you can verify that the servers appear in the portal.

1. Open the Azure Migrate dashboard.
2. In **Azure Migrate - Servers** > **Azure Migrate: Discovery and assessment** page, click the icon that displays the count for **Discovered servers**.

## Next steps

- [Assess servers on Hyper-V environment](tutorial-assess-hyper-v.md) for migration to Azure VMs.
- [Review the data](migrate-appliance.md#collected-data---hyper-v) that the appliance collects during discovery.