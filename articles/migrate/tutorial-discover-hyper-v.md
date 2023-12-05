---
title: Discover servers on Hyper-V with Azure Migrate Discovery and assessment 
description: Learn how to discover on-premises servers on Hyper-V with the Azure Migrate Discovery and assessment tool.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: tutorial
ms.service: azure-migrate
ms.date: 10/25/2023
ms.custom: mvc, subject-rbac-steps, engagement-fy24
#Customer intent: As a Hyper-V admin, I want to discover my on-premises servers on Hyper-V.
---

# Tutorial: Discover servers running on Hyper-V with Azure Migrate: Discovery and assessment

As part of your migration journey to Azure, you discover your on-premises inventory and workloads.

This tutorial shows you how to discover the servers that are running in your Hyper-V environment by using the Azure Migrate: Discovery and assessment tool, a lightweight Azure Migrate appliance. You deploy the appliance as a server on Hyper-V host, to continuously discover servers and their performance metadata, applications that are running on servers, server dependencies, web apps, and SQL Server instances and databases.

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
**Hyper-V host** | Hyper-V hosts on which servers are located can be standalone, or in a cluster.<br/><br/> The host must be running Windows Server 2022, Windows Server 2019, or Windows Server 2016.<br/><br/> Verify inbound connections are allowed on WinRM port 5985 (HTTP), so that the appliance can connect to pull server metadata and performance data, using a Common Information Model (CIM) session.
**Appliance deployment** | Hyper-V host needs resources to allocate a server for the appliance:<br/><br/> - 16 GB of RAM, 8 vCPUs, and around 80 GB of disk storage.<br/><br/> - An external virtual switch, and internet access on the appliance, directly or via a proxy.
**Servers** | All Windows and Linux OS versions are supported for discovery of configuration and performance metadata. <br /><br /> For application discovery on servers, all Windows and Linux OS versions are supported. Check the [OS versions supported for agentless dependency analysis](migrate-support-matrix-hyper-v.md#dependency-analysis-requirements-agentless).<br /><br /> To discover ASP.NET web apps running on IIS web server, check [supported Windows OS and IIS versions](migrate-support-matrix-vmware.md#web-apps-discovery-requirements). For discovery of installed applications and for agentless dependency analysis, Windows servers must have PowerShell version 2.0 or later installed.<br /><br />  To discover Java web apps running on Apache Tomcat web server, check [supported Linux OS and Tomcat versions](migrate-support-matrix-vmware.md#web-apps-discovery-requirements). 
**SQL Server access** | To discover SQL Server instances and databases, the Windows or SQL Server account [requires these permissions](migrate-support-matrix-hyper-v.md#configure-the-custom-login-for-sql-server-discovery) for each SQL Server instance. You can use the [account provisioning utility](least-privilege-credentials.md) to create custom accounts or use any existing account that is a member of the sysadmin server role for simplicity.

## Prepare an Azure user account

To create a project and register the Azure Migrate appliance, you need an account with:
- Contributor or Owner permissions on an Azure subscription.
- Permissions to register Microsoft Entra apps.

If you just created a free Azure account, you're the owner of your subscription. If you're not the subscription owner, work with the owner to assign the permissions as follows:

1. In the Azure portal, search for "subscriptions", and under **Services**, select **Subscriptions**.

    :::image type="content" source="./media/tutorial-discover-hyper-v/search-subscription.png" alt-text="Screenshot of Search box to search for the Azure subscription.":::

1. In the **Subscriptions** page, select the subscription in which you want to create a project.

1. Select **Access control (IAM)**.

1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

    | Setting | Value |
    | --- | --- |
    | Role | Contributor or Owner |
    | Assign access to | User |
    | Members | azmigrateuser |

    :::image type="content" source="../../includes/role-based-access-control/media/add-role-assignment-page.png" alt-text="Screenshot of add role assignment page in Azure portal.":::

1. To register the appliance, your Azure account needs **permissions to register Microsoft Entra apps.**

1. In the portal, go to **Microsoft Entra ID** > **Users**.

1. Request the tenant or global admin to assign the [Application Developer role](../active-directory/roles/permissions-reference.md#application-developer) to the account to allow Microsoft Entra app registration by users. [Learn more](../active-directory/roles/manage-roles-portal.md#assign-a-role).

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
2. Validate the script integrity using SHA256 hash file. Hashtag value is below. Run this command to generate the hash for the script:

    ```powershell
    C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]
    ```
    Example usage:

    ```powershell
    C:\>CertUtil -HashFile C:\Users\Administrators\Desktop\MicrosoftAzureMigrate-Hyper-V.ps1 SHA256
    ```
3. After validating the script integrity, run the script on each Hyper-V host with this PowerShell command with elevated permissions:

    ```powershell
    PS C:\Users\Administrators\Desktop> MicrosoftAzureMigrate-Hyper-V.ps1
    ```
Hash value is:

**Hash** |  **Value**
--- | ---
SHA256 | 0DD9D0E2774BB8B33EB7EF7D97D44A90A7928A4B1A30686C5B01EBD867F3BD68

### Create an account to access servers

The user account on your servers must have the required permissions to initiate discovery of installed applications, agentless dependency analysis, and SQL Server instances and databases. You can provide the user account information in the appliance configuration manager. The appliance doesn't install agents on the servers.

* For **Windows servers**, create an account (local or domain) that has administrator permissions on the servers. To discover SQL Server instances and databases, the Windows or SQL Server account must be a member of the sysadmin server role. Learn how to [assign the required role to the user account](/sql/relational-databases/security/authentication-access/server-level-roles).
* For **Linux servers**, provide a sudo user account with permissions to execute ls and netstat commands or create a user account that has the CAP_DAC_READ_SEARCH and CAP_SYS_PTRACE permissions on /bin/netstat and /bin/ls files. If you're providing a sudo user account, ensure that you have enabled **NOPASSWD** for the account to run the required commands without prompting for a password every time sudo command is invoked.

> [!NOTE]
> You can add multiple server credentials in the Azure Migrate appliance configuration manager to initiate discovery of installed applications, agentless dependency analysis, and SQL Server instances and databases. You can add multiple domain, Windows (non-domain), Linux (non-domain), or SQL Server authentication credentials. Learn how to [add server credentials](add-server-credentials.md).

## Set up a project

Set up a new project.

1. In the Azure portal > **All services**, search for **Azure Migrate**.
2. Under **Services**, select **Azure Migrate**.
3. In **Get started**, select **Create project**.
5. In **Create project**, select your Azure subscription and resource group. Create a resource group if you don't have one.
6. In **Project Details**, specify the project name and the geography in which you want to create the project. Review supported geographies for [public](migrate-support-matrix.md#public-cloud) and [government clouds](migrate-support-matrix.md#azure-government).

   > [!Note]
   > Use the **Advanced** configuration section to create an Azure Migrate project with private endpoint connectivity. [Learn more](discover-and-assess-using-private-endpoints.md#create-a-project-with-private-endpoint-connectivity). 

7. Select **Create**.
8. Wait a few minutes for the project to deploy. The **Azure Migrate: Discovery and assessment** tool is added by default to the new project.

    :::image type="content" source="./media/tutorial-discover-hyper-v/added-tool.png" alt-text="Screenshot showing Azure Migrate: Discovery and assessment tool added by default.":::

> [!NOTE]
> If you have already created a project, you can use the same project to register additional appliances to discover and assess more no of servers. [Learn more](create-manage-projects.md#find-a-project)

## Set up the appliance

Azure Migrate uses a lightweight Azure Migrate appliance. The appliance performs server discovery and sends server configuration and performance metadata to Azure Migrate. The appliance can be set up by deploying a VHD file that can be downloaded from the project.

> [!NOTE]
> - If for some reason you can't set up the appliance using the template, you can set it up using a PowerShell script on an existing Windows Server 2019 or Windows Server 2022. [Learn more](deploy-appliance-script.md#set-up-the-appliance-for-hyper-v).
> - The option to deploy an appliance using a VHD template isn't supported in Azure Government cloud. [Learn more](./deploy-appliance-script-government.md) on how to deploy an appliance for Azure Government cloud.

This tutorial sets up the appliance on a server running in Hyper-V environment, as follows:

1. Provide an appliance name and generate a project key in the portal.
1. Download a compressed Hyper-V VHD from the Azure portal.
1. Create the appliance, and check that it can connect to Azure Migrate: Discovery and assessment.
1. Configure the appliance for the first time, and register it with the project using the project key.

### 1. Generate the project key

1. In **Migration goals** > **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**, select **Discover**.
2. In **Discover Servers** > **Are your servers virtualized?**, select **Yes, with Hyper-V**.
3. In **1:Generate project key**, provide a name for the Azure Migrate appliance that you'll set up for discovery of servers. The name should be alphanumeric with 14 characters or fewer.
1. Select **Generate key** to start the creation of the required Azure resources. Don't close the Discover server page during the creation of resources.
1. After the successful creation of the Azure resources, a **project key** is generated.
1. Copy the key as you'll need it to complete the registration of the appliance during its configuration.

### 2. Download the VHD

In **2: Download Azure Migrate appliance**, select the .VHD file and select **Download**.

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
        Hyper-V (8.91 GB) | [Latest version](https://go.microsoft.com/fwlink/?linkid=2191848) |  AE53454E448064839AEBFDE1EE6DBF63222686CFB37B7E2E125D44A8B24EB504

    - For Azure Government:

        **Scenario*** | **Download** | **SHA256**
        --- | --- | ---
        Hyper-V (85.8 MB) | [Latest version](https://go.microsoft.com/fwlink/?linkid=2191847) | 7EF01AE30F7BB8F4486EDC1688481DB656FB8ECA7B9EF6363B4DAB1CFCFDA141 

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

Make sure that the appliance can connect to Azure URLs [public](migrate-support-matrix.md#public-cloud) and [government](migrate-support-matrix.md#azure-government) clouds.

### 4. Configure the appliance

Set up the appliance for the first time.

> [!NOTE]
> If you set up the appliance using a [PowerShell script](deploy-appliance-script.md) instead of the downloaded VHD, the first two steps in this procedure aren't relevant.

1. In Hyper-V Manager > **Virtual Machines**, right-click the appliance > **Connect**.
2. Provide the language, time zone, and password for the appliance.
3. Open a browser on any machine that can connect to the appliance, and open the URL of the appliance web app: **https://*appliance name or IP address*: 44368**.

   Alternately, you can open the app from the appliance desktop by clicking the app shortcut.
1. Accept the **license terms**, and read the third-party information.

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

### Provide Hyper-V host/cluster details

1. In **Step 1: Provide Hyper-V host credentials**, select **Add credentials** to  specify a friendly name for credentials, add **Username** and **Password** for a Hyper-V host/cluster that the appliance will use to discover servers. select **Save**.
1. If you want to add multiple credentials at once, select **Add more** to save and add more credentials. Multiple credentials are supported for discovery of servers in Hyper-V environment.
1. In **Step 2: Provide Hyper-V host/cluster details**, select **Add discovery source** to specify the Hyper-V host/cluster **IP address/FQDN** and the friendly name for credentials to connect to the host/cluster.
1. You can either **Add single item** at a time or **Add multiple items** in one go. There's also an option to provide Hyper-V host/cluster details through **Import CSV**.

    - If you choose **Add single item**, you need to specify friendly name for credentials and Hyper-V host/cluster **IP address/FQDN**, and select **Save**.
    - If you choose **Add multiple items** _(selected by default)_, you can add multiple records at once by specifying Hyper-V host/cluster **IP address/FQDN** with the friendly name for credentials in the text box. **Verify** the added records and select **Save**.
    - If you choose **Import CSV**, you can download a CSV template file, populate the file with the Hyper-V host/cluster **IP address/FQDN** and friendly name for credentials. You then import the file into the appliance, **verify** the records in the file and select **Save**.

1. On clicking Save, appliance will try validating the connection to the Hyper-V hosts/clusters added and show the **Validation status** in the table against each host/cluster.
    - For successfully validated hosts/clusters, you can view more details by clicking on their IP address/FQDN.
    - If validation fails for a host, review the error by clicking on **Validation failed** in the Status column of the table. Fix the issue, and validate again.
    - To remove hosts or clusters, select **Delete**.
    - You can't remove a specific host from a cluster. You can only remove the entire cluster.
    - You can add a cluster, even if there are issues with specific hosts in the cluster.
1. You can **revalidate** the connectivity to hosts/clusters anytime before starting the discovery.

### Provide server credentials

In **Step 3: Provide server credentials to perform software inventory, agentless dependency analysis, discovery of SQL Server instances and databases in your Microsoft HyperV environment.**, you can provide multiple server credentials. If you don't want to use any of these appliance features,  you can disable the slider and proceed with discovery of servers running on Hyper-V hosts/clusters. You can change this option at any time.

:::image type="content" source="./media/tutorial-discover-hyper-v/appliance-server-credentials-mapping.png" alt-text="Screenshot that shows providing credentials for software inventory and dependency analysis.":::

If you want to use these features, provide server credentials by completing the following steps. The appliance attempts to automatically map the credentials to the servers to perform the discovery features.

To add server credentials:

1. Select **Add Credentials**.
1. In the dropdown menu, select **Credentials type**.
    
    You can provide domain/, Windows(non-domain)/, Linux(non-domain)/, and SQL Server authentication credentials. Learn how to [provide credentials](add-server-credentials.md) and how we handle them.
1. For each type of credentials, enter:
    * A friendly name.
    * A username.
    * A password.
    Select **Save**.

    If you choose to use domain credentials, you also must enter the FQDN for the domain. The FQDN is required to validate the authenticity of the credentials with the Active Directory instance in that domain.
1. Review the [required permissions](add-server-credentials.md#required-permissions) on the account for discovery of installed applications, agentless dependency analysis, and discovery SQL Server instances and databases.
1. To add multiple credentials at once, select **Add more** to save credentials, and then add more credentials.
    When you select **Save** or **Add more**, the appliance validates the domain credentials with the domain's Active Directory instance for authentication. Validation is made after each addition to avoid account lockouts as the appliance iterates to map credentials to respective servers.

To check validation of the domain credentials:

In the configuration manager, in the credentials table, see the **Validation status** for domain credentials. Only domain credentials are validated.

If validation fails, you can select a **Failed** status to see the validation error. Fix the issue, and then select **Revalidate credentials** to reattempt validation of the credentials.

:::image type="content" source="./media/tutorial-discover-hyper-v/add-server-credentials-multiple.png" alt-text="Screenshot that shows providing and validating multiple credentials.":::

### Start discovery

Select **Start discovery**, to kick off server discovery from the successfully validated host(s)/cluster(s). After the discovery has been successfully initiated, you can check the discovery status against each host/cluster in the table.

## How discovery works

* It takes approximately 2 minutes per host for metadata of discovered servers to appear in the Azure portal.
* If you have provided server credentials, [software inventory](how-to-discover-applications.md) (discovery of installed applications) is automatically initiated when the discovery of servers running on Hyper-V host(s)/cluster(s) is finished.
* [Software inventory](how-to-discover-applications.md) identifies the SQL Server instances that are running on the servers. Using the information it collects, the appliance attempts to connect to the SQL Server instances through the Windows authentication credentials or the SQL Server authentication credentials that are provided on the appliance. Then, it gathers data on SQL Server databases and their properties. The SQL Server discovery is performed once every 24 hours.
* Appliance can connect to only those SQL Server instances to which it has network line of sight, whereas software inventory by itself might not need network line of sight.
* The time taken for discovery of installed applications depends on the number of discovered servers. For 500 servers, it takes approximately one hour for the discovered inventory to appear in the Azure Migrate project in the portal.
* [Software inventory](how-to-discover-applications.md) identifies web server role existing on discovered servers. If a server is found to have web server role enabled, Azure Migrate will perform web apps discovery on the server. Web apps configuration data is updated once every 24 hours.
* During software inventory, the added server credentials are iterated against servers and validated for agentless dependency analysis. When the discovery of servers is finished, in the portal, you can enable agentless dependency analysis on the servers. Only the servers on which validation succeeds can be selected to enable [agentless dependency analysis](how-to-create-group-machine-dependencies-agentless.md).
* SQL Server instances and databases data begin to appear in the portal within 24 hours after you start discovery.
* By default, Azure Migrate uses the most secure way of connecting to SQL instances that is, Azure Migrate encrypts communication between the Azure Migrate appliance and the source SQL Server instances by setting the TrustServerCertificate property to `true`. Additionally, the transport layer uses SSL to encrypt the channel and bypass the certificate chain to validate trust. Hence, the appliance server must be set up to trust the certificate's root authority. However, you can modify the connection settings, by selecting **Edit SQL Server connection properties** on the appliance. [Learn more](/sql/database-engine/configure-windows/enable-encrypted-connections-to-the-database-engine) to understand what to choose.

    :::image type="content" source="./media/tutorial-discover-vmware/sql-connection-properties.png" alt-text="Screenshot that shows how to edit SQL Server connection properties.":::

## Verify servers in the portal

After discovery finishes, you can verify that the servers appear in the portal.

1. Open the Azure Migrate dashboard.
2. In **Azure Migrate - Servers** > **Azure Migrate: Discovery and assessment** page, click the icon that displays the count for **Discovered servers**.

#### View support status

You can gain deeper insights into the support posture of your environment from the **Discovered servers** and **Discovered database instances** sections.

The **Operating system license support status** column displays the support status of the Operating system, whether it is in mainstream support, extended support, or out of support. Selecting the support status opens a pane on the right which provides clear guidance regarding actionable steps that can be taken to secure servers and databases in extended support or out of support.

To view the remaining duration until end of support, that is, the number of months for which the license is valid, select **Columns** > **Support ends in** > **Submit**. The **Support ends in** column displays the duration in months.

The **Database instances** displays the number of instances discovered by Azure Migrate. Select the number of instances to view the database instance details. The **Database instance license support status** displays the support status of the database instance. Selecting the support status opens a pane on the right, which provides clear guidance regarding actionable steps that can be taken to secure servers and databases in extended support or out of support.

To view the remaining duration until end of support, that is, the number of months for which the license is valid, select **Columns** > **Support ends in** > **Submit**. The **Support ends in** column displays the duration in months.


## Next steps

- [Assess servers on Hyper-V environment](tutorial-assess-hyper-v.md) for migration to Azure VMs.
- [Review the data](discovered-metadata.md#collected-metadata-for-hyper-v-servers) that the appliance collects during discovery.
