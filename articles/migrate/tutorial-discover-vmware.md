---
title: Discover servers running in a VMware environment with Azure Migrate Discovery and assessment
description: Learn how to discover on-premises servers, applications, and dependencies in a VMware environment by using the Azure Migrate Discovery and assessment tool.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: tutorial
ms.date: 10/11/2023
ms.service: azure-migrate
ms.custom: mvc, subject-rbac-steps, engagement-fy24
#Customer intent: As an VMware admin, I want to discover my on-premises servers running in a VMware environment.
---

# Tutorial: Discover servers running in a VMware environment with Azure Migrate

As part of your migration journey to Azure, you discover your on-premises inventory and workloads.

This tutorial shows you how to discover the servers that are running in your VMware environment by using the Azure Migrate: Discovery and assessment tool, a lightweight Azure Migrate appliance. You deploy the appliance as a server running in your vCenter Server instance, to continuously discover servers and their performance metadata, applications that are running on servers, server dependencies, web apps, and SQL Server instances and databases.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up an Azure account.
> * Prepare the VMware environment for discovery.
> * Create a project.
> * Set up the Azure Migrate appliance.
> * Start continuous discovery.

> [!NOTE]
> Tutorials show you the quickest path for trying out a scenario. They use default options where possible.  

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Prerequisites

Before you begin this tutorial, check that you have these prerequisites in place:

Requirement | Details
--- | ---
**vCenter Server/ESXi host** | You need a server running vCenter Server version 7.0, 6.7, 6.5, 6.0, or 5.5.<br /><br /> Servers must be hosted on an ESXi host running version 5.5 or later.<br /><br /> On the vCenter Server, allow inbound connections on TCP port 443 so that the appliance can collect configuration and performance metadata.<br /><br /> The appliance connects to vCenter Server on port 443 by default. If the server running vCenter Server listens on a different port, you can modify the port when you provide the vCenter Server details in the appliance configuration manager.<br /><br /> On the ESXi hosts, make sure that inbound access is allowed on TCP port 443 for discovery of installed applications and for agentless dependency analysis on servers.
**Azure Migrate appliance** | vCenter Server must have these resources to allocate to a server that hosts the Azure Migrate appliance:<br /><br /> - 32 GB of RAM, 8 vCPUs, and approximately 80 GB of disk storage.<br /><br /> - An external virtual switch and internet access on the appliance server, directly or via a proxy.
**Servers** | All Windows and Linux OS versions are supported for discovery of configuration and performance metadata. <br /><br /> For application discovery on servers, all Windows and Linux OS versions are supported. Check the [OS versions supported for agentless dependency analysis](migrate-support-matrix-vmware.md#dependency-analysis-requirements-agentless).<br /><br /> For discovery of installed applications and for agentless dependency analysis, VMware Tools (version 10.2.1 or later) must be installed and running on servers. Windows servers must have PowerShell version 2.0 or later installed.<br /><br /> To discover SQL Server instances and databases, check [supported SQL Server and Windows OS versions and editions](migrate-support-matrix-vmware.md#sql-server-instance-and-database-discovery-requirements) and Windows authentication mechanisms.<br /><br /> To discover ASP.NET web apps running on IIS web server, check [supported Windows OS and IIS versions](migrate-support-matrix-vmware.md#web-apps-discovery-requirements).<br /><br />  To discover Java web apps running on Apache Tomcat web server, check [supported Linux OS and Tomcat versions](migrate-support-matrix-vmware.md#web-apps-discovery-requirements). 
**SQL Server access** | To discover SQL Server instances and databases, the Windows or SQL Server account must be a member of the sysadmin server role or have [these permissions](migrate-support-matrix-vmware.md#configure-the-custom-login-for-sql-server-discovery) for each SQL Server instance.

## Prepare an Azure user account

To create a project and register the Azure Migrate appliance, you must have an Azure account that has these permissions:

- Contributor or Owner permissions in the Azure subscription.
- Permissions to register Microsoft Entra apps.
- Owner or Contributor and User Access Administrator permissions at subscription level to create an instance of Azure Key Vault, which is used during agentless server migration.

If you created a free Azure account, by default, you're the owner of the Azure subscription. If you're not the subscription owner, work with the owner to assign permissions.

To set Contributor or Owner permissions in the Azure subscription:

1. In the Azure portal, search for "subscriptions." Under **Services** in the search results, select **Subscriptions**.

    :::image type="content" source="./media/tutorial-discover-vmware/search-subscription.png" alt-text="Screenshot that shows how to search for an Azure subscription in the search box.":::

1. In **Subscriptions**, select the subscription in which you want to create a project.

1. Select **Access control (IAM)**.

1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

    | Setting | Value |
    | --- | --- |
    | Role | Contributor or Owner |
    | Assign access to | User |
    | Members | azmigrateuser |

    :::image type="content" source="../../includes/role-based-access-control/media/add-role-assignment-page.png" alt-text="Add role assignment page in Azure portal.":::

To give the account the required permissions to register Microsoft Entra apps:

1. In the portal, go to **Microsoft Entra ID** > **Users**.

1. Request the tenant or global admin to assign the [Application Developer role](../active-directory/roles/permissions-reference.md#application-developer) to the account to allow Microsoft Entra app registration by users. [Learn more](../active-directory/roles/manage-roles-portal.md#assign-a-role).

## Prepare VMware

On vCenter Server, check that your account has [permissions](migrate-support-matrix-vmware-migration.md#vmware-vsphere-requirements-agentless) to create a VM by using a VMware Open Virtualization Appliance (OVA) virtual machine (VM) installation file. You must have these [permissions](migrate-support-matrix-vmware-migration.md#vmware-vsphere-requirements-agentless) when you deploy the Azure Migrate appliance as a VMware VM by using an OVA file.

Azure Migrate must have a vCenter Server read-only account to discover and assess servers running in your VMware environment. If you also want to run discovery of installed applications and agentless dependency analysis, the account must have [permissions](migrate-support-matrix-vmware-migration.md#vmware-vsphere-requirements-agentless) enabled in VMware for VM guest operations.

### Create an account to access vCenter Server

In VMware vSphere Web Client, set up a read-only account to use for vCenter Server:

1. From an account that has admin privileges, in vSphere Web Client, on the **Home** menu, select **Administration**.
1. Under **Single Sign-On**, select **Users and Groups**.
1. In **Users**, select **New User**.
1. Enter the account details, and then select **OK**.
1. In the menu under **Administration**, under **Access Control**, select **Global Permissions**.
1. Select the user account, and then select **Read-only** to assign the role to the account. Select **OK**.
1. To be able to start discovery of installed applications and agentless dependency analysis, in the menu under **Access Control**, select **Roles**. In the **Roles** pane, under **Roles**, select **Read-only**. Under **Privileges**, select **Guest operations**. To propagate the privileges to all objects in the vCenter Server instance, select the **Propagate to children** checkbox.

    :::image type="content" source="./media/tutorial-discover-vmware/guest-operations.png" alt-text="Screenshot that shows the v sphere web client and how to create a new account and select user roles and privileges.":::

> [!NOTE]
> - For vCenter Server 7.x and above you must clone the Read Only system role and add the Guest Operations Privilages to the cloned role.  Assign the cloned role to the vCenter Account. Learn how to [create a custom role in VMware vCenter](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.security.doc/GUID-41E5E52E-A95B-4E81-9724-6AD6800BEF78.html). 
> - You can scope the vCenter Server account to limit discovery to specific vCenter Server datacenters, clusters, hosts, folders of clusters or hosts, or individual servers. Learn how to [scope the vCenter Server user account](set-discovery-scope.md).
> - vCenter assets connected via Linked-Mode to the vCenter server specified for discovery will not be discovered by Azure Migrate.

### Create an account to access servers

Your user account on your servers must have the required permissions to initiate discovery of installed applications, agentless dependency analysis, and discovery of web apps, and SQL Server instances and databases. You can provide the user account information in the appliance configuration manager. The appliance doesn't install agents on the servers.

* For **Windows servers** and web apps discovery, create an account (local or domain) that has administrator permissions on the servers. To discover SQL Server instances and databases, the Windows or SQL Server account must be a member of the sysadmin server role. Learn how to [assign the required role to the user account](/sql/relational-databases/security/authentication-access/server-level-roles).
* For **Linux servers**, provide a sudo user account with permissions to execute ls and netstat commands or create a user account that has the CAP_DAC_READ_SEARCH and CAP_SYS_PTRACE permissions on /bin/netstat and /bin/ls files. If you're providing a sudo user account, ensure that you have enabled **NOPASSWD** for the account to run the required commands without prompting for a password every time sudo command is invoked.

> [!NOTE]
> You can add multiple server credentials in the Azure Migrate appliance configuration manager to initiate discovery of installed applications, agentless dependency analysis, and discovery of web apps, and SQL Server instances and databases. You can add multiple domain, Windows (non-domain), Linux (non-domain), or SQL Server authentication credentials. Learn how to [add server credentials](add-server-credentials.md).

## Set up a project

To set up a new project:

1. In the Azure portal, select **All services**, and then search for **Azure Migrate**.
1. Under **Services**, select **Azure Migrate**.
1. In **Get started**,  select one of the following options, depending on your migration goals: **Servers, databases and web apps**, **Databases (only)**, or **Explore more scenarios**.
1. Select **Create project**.
1. In **Create project**, select your Azure subscription and resource group. Create a resource group if you don't have one.
1. In **Project Details**, specify the project name and the geography where you want to create the project. Review [supported geographies for public clouds](migrate-support-matrix.md#public-cloud) and [supported geographies for government clouds](migrate-support-matrix.md#azure-government).

    :::image type="content" source="./media/tutorial-discover-vmware/new-project.png" alt-text="Screenshot that shows how to add project details for a new Azure Migrate project.":::

    > [!Note]
    > Use the **Advanced** configuration section to create an Azure Migrate project with private endpoint connectivity. [Learn more](discover-and-assess-using-private-endpoints.md#create-a-project-with-private-endpoint-connectivity).

1. Select **Create**.
1. Wait a few minutes for the project to deploy. The **Azure Migrate: Discovery and assessment** tool is added by default to the new project.

> [!NOTE]
> If you've already created a project, you can use that project to register more appliances to discover and to assess more servers. Learn how to [manage projects](create-manage-projects.md#find-a-project).

## Set up the appliance

The Azure Migrate: Discovery and assessment tool uses a lightweight Azure Migrate appliance. The appliance completes server discovery and sends server configuration and performance metadata to Azure Migrate. Set up the appliance by deploying an OVA template that can be downloaded from the project.

> [!NOTE]
> If you can't set up the appliance by using the OVA template, you can set it up by running a PowerShell script on an existing server running Windows Server 2016. Learn how to [use PowerShell to set up an Azure Migrate appliance](deploy-appliance-script.md#set-up-the-appliance-for-vmware). <br/>
> The option to deploy an appliance using an OVA template isn't supported in Azure Government cloud. [Learn more](./deploy-appliance-script-government.md) on how to deploy an appliance for Azure Government cloud.

### Deploy by using an OVA template

To set up the appliance by using an OVA template, complete these steps, which are described in more detail in this section:

1. Provide an appliance name and generate a project key in the portal.
1. Download an OVA template file, and then import it to vCenter Server. Verify that the OVA is secure.
1. Create the appliance from the OVA file. Verify that the appliance can connect to Azure Migrate.
1. Configure the appliance for the first time. 
1. Register the appliance with the project by using the project key.

#### Generate the project key

1. In **Migration goals**, select **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment** > **Discover**.
1. In **Discover servers**, select **Are your servers virtualized?** > **Yes, with VMware vSphere hypervisor**.
1. In **1:Generate project key**, provide a name for the Azure Migrate appliance that you'll set up to discover servers in your VMware environment. The name should be alphanumeric and 14 characters or fewer.
1. To start creating the required Azure resources, select **Generate key**. Don't close the **Discover** pane while the resources are being created.
1. After the Azure resources are successfully created, a *project key* is generated.
1. Copy the key. You'll use the key to complete registration of the appliance when you configure the appliance.

#### Download the OVA template

> [!NOTE]
> To make sure you get the latest version of the OVA template refer to the [Azure Migrate appliance requirements](./migrate-appliance.md) under the **Appliance - VMware** section.

In **2: Download Azure Migrate appliance**, select the OVA file, and then select **Download**.

##### Verify security

Before you deploy the OVA file, verify that the file is secure:

1. On the server on which you downloaded the file, open a Command Prompt window by using the **Run as administrator** option.
1. Run the following command to generate the hash for the OVA file:
  
    ```bash
    C:\>CertUtil -HashFile <file_location> <hashing_agorithm>
    ```
   
    Example: `C:\>CertUtil -HashFile C:\Users\Administrator\Desktop\MicrosoftAzureMigration.ova SHA256`

1. Verify the latest appliance versions and hash values:

    - For the Azure public cloud:
    
        **Algorithm** | **Download** | **SHA256**
        --- | --- | ---
        VMware (11.9 GB) | [Latest version](https://go.microsoft.com/fwlink/?linkid=2191954) | 06256F9C6FB3F011152D861DA43FFA1C5C8FF966931D5CE00F1F252D3A2F4723

    - For Azure Government:
    
        **Algorithm** | **Download** | **SHA256**
        --- | --- | ---
        VMware (85.8 MB) | [Latest version](https://go.microsoft.com/fwlink/?linkid=2191847) | 7EF01AE30F7BB8F4486EDC1688481DB656FB8ECA7B9EF6363B4DAB1CFCFDA141

#### Create the appliance server

Import the downloaded file, and then create a server in the VMware environment:

1. In the vSphere Client console, select **File** > **Deploy OVF Template**.
1. In the Deploy OVF Template Wizard, select **Source**, and then enter the location of the OVA file.
1. In **Name**, enter a name for the server. In **Location**, select the inventory object in which the server will be hosted.
1. In **Host/Cluster**, select the host or cluster on which the server will run.
1. In **Storage**, select the storage destination for the server.
1. In **Disk Format**, select the disk type and size.
1. In **Network Mapping**, select the network the server will connect to. The network requires internet connectivity to send metadata to Azure Migrate.
1. Review and confirm the settings, and then select **Finish**.

#### Verify appliance access to Azure

Make sure that the appliance server can connect to Azure URLs for [public clouds](migrate-appliance.md#public-cloud-urls) and [government clouds](migrate-appliance.md#government-cloud-urls).

### Configure the appliance

To set up the appliance for the first time:

> [!NOTE]
> If you set up the appliance by using a [PowerShell script](deploy-appliance-script.md) instead of a downloaded OVA template, you can skip the first two steps.

1. In vSphere Client, right-click the server, and then select **Open Console**.
1. Select or enter the language, time zone, and password for the appliance.
1. Open a browser on any computer that can connect to the appliance. Then, open the URL of the appliance configuration manager: `https://appliance name or IP address: 44368`.

     Or, you can open the configuration manager from the appliance server desktop by selecting the shortcut for the configuration manager.
1. Accept the license terms and read the third-party information.

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
    3. To register the appliance, you need to select **Login**. In **Continue with Azure Login**, select **Copy code & Login** to copy the device code (you must have a device code to authenticate with Azure) and open an Azure sign in prompt in a new browser tab. Make sure you've disabled the pop-up blocker in the browser to see the prompt.
    
        :::image type="content" source="./media/tutorial-discover-vmware/device-code.png" alt-text="Screenshot that shows where to copy the device code and sign in.":::
    4. In a new tab in your browser, paste the device code and sign in by using your Azure username and password. Signing in with a PIN isn't supported.
	    > [!NOTE]
        > If you close the sign in tab accidentally without logging in, refresh the browser tab of the appliance configuration manager to display the device code and Copy code & Login button.
	5. After you successfully sign in, return to the browser tab that displays the appliance configuration manager. If the Azure user account that you used to sign in has the required permissions for the Azure resources that were created during key generation, appliance registration starts.

        After the appliance is successfully registered, to see the registration details, select **View details**.

1. **Install the VDDK**: The appliance checks that VMware vSphere Virtual Disk Development Kit (VDDK) is installed. If the VDDK isn't installed, download VDDK 6.7 from VMware. Extract the downloaded zip file contents to the specified location on the appliance, the default path is *C:\Program Files\VMware\VMware Virtual Disk Development Kit* as indicated in the *Installation instructions*.

   The Migration and modernization tool uses the VDDK to replicate servers during migration to Azure.

You can *rerun prerequisites* at any time during appliance configuration to check whether the appliance meets all the prerequisites.

## Start continuous discovery

Complete the setup steps in the appliance configuration manager to prepare for and start discovery.

### Provide vCenter Server details

The appliance must connect to vCenter Server to discover the configuration and performance data of the servers:

1. In **Step 1: Provide vCenter Server credentials**, select **Add credentials** to enter a name for the credentials. Add the username and password for the vCenter Server account that the appliance will use to discover servers running on vCenter Server.
    - You should have set up an account with the required permissions as described earlier in this article.
    - If you want to scope discovery to specific VMware objects (vCenter Server datacenters, clusters, hosts, folders of clusters or hosts, or individual servers), review the instructions to [set discovery scope](set-discovery-scope.md) to restrict the account that Azure Migrate uses.
    - If you want to add multiple credentials at once, select **Add more** to save and add more credentials. Multiple credentials are supported for discovery of servers across multiple vCenter Servers using a single appliance.
1. In **Step 2: Provide vCenter Server details**, select **Add discovery source** to add the IP address or FQDN of a vCenter Server. You can leave the port as the default (443) or specify a custom port on which vCenter Server listens. Select the friendly name for credentials you would like to map to the vCenter Server and select **Save**.

    Select **Add more** to save the previous details and add more vCenter Server details. **You can add up to 10 vCenter Servers per appliance.**

    :::image type="content" source="./media/tutorial-discover-vmware/add-discovery-source.png" alt-text="Screenshot that allows to add more vCenter Server details.":::

1. The appliance attempts to validate the connection to the vCenter Server(s) added by using the credentials mapped to each vCenter Server. It displays the validation status with the vCenter Server(s) IP address or FQDN in the sources table.
1. You can *revalidate* the connectivity to the vCenter Server(s) anytime before starting discovery.

    :::image type="content" source="./media/tutorial-discover-vmware/appliance-manage-sources.png" alt-text="Screenshot that shows managing credentials and discovery sources for vCenter Server in the appliance configuration manager.":::

### Provide server credentials

In **Step 3: Provide server credentials to perform software inventory, agentless dependency analysis, discovery of SQL Server instances and databases and discovery of web apps in your VMware environment.**, you can provide multiple server credentials. If you don't want to use any of these appliance features, you can skip this step and proceed with vCenter Server discovery. You can change this option at any time.

:::image type="content" source="./media/tutorial-discover-vmware/appliance-server-credentials-mapping.png" alt-text="Screenshot that shows providing credentials for software inventory, dependency analysis, and s q l server discovery.":::

If you want to use these features, provide server credentials by completing the following steps. The appliance attempts to automatically map the credentials to the servers to perform the discovery features.

To add server credentials:

1. Select **Add Credentials**.
1. In the dropdown menu, select **Credentials type**.
    
    You can provide domain, Windows(non-domain), Linux(non-domain), and SQL Server authentication credentials. Learn how to [provide credentials](add-server-credentials.md) and how we handle them.
1. For each type of credentials, enter:
    * A friendly name.
    * A username.
    * A password.
    Select **Save**.

    If you choose to use domain credentials, you also must enter the FQDN for the domain. The FQDN is required to validate the authenticity of the credentials with the Active Directory instance in that domain.
1. Review the [required permissions](add-server-credentials.md#required-permissions) on the account for discovery of installed applications, agentless dependency analysis, and discovery of web apps and SQL Server instances and databases.
1. To add multiple credentials at once, select **Add more** to save credentials, and then add more credentials.
    When you select **Save** or **Add more**, the appliance validates the domain credentials with the domain's Active Directory instance for authentication. Validation is made after each addition to avoid account lockouts as the appliance iterates to map credentials to respective servers.

To check validation of the domain credentials:

In the configuration manager, in the credentials table, see the **Validation status** for domain credentials. Only domain credentials are validated.

If validation fails, you can select a **Failed** status to see the validation error. Fix the issue, and then select **Revalidate credentials** to reattempt validation of the credentials.

:::image type="content" source="./media/tutorial-discover-vmware/add-server-credentials-multiple.png" alt-text="Screenshot that shows providing and validating multiple credentials.":::

### Start discovery

To start vCenter Server discovery, select **Start discovery**. After the discovery is successfully initiated, you can check the discovery status by looking at the vCenter Server IP address or FQDN in the sources table.

## How discovery works

* It takes approximately 20-25 minutes for the discovery of servers across 10 vCenter Servers added to a single appliance.
* If you have provided server credentials, software inventory (discovery of installed applications) is automatically initiated when the discovery of servers running on vCenter Server(s) is finished. Software inventory occurs once every 12 hours.
* [Software inventory](how-to-discover-applications.md) identifies the SQL Server instances that are running on the servers. Using the information it collects, the appliance attempts to connect to the SQL Server instances through the Windows authentication credentials or the SQL Server authentication credentials that are provided on the appliance. Then, it gathers data on SQL Server databases and their properties. The SQL Server discovery is performed once every 24 hours.
* Appliance can connect to only those SQL Server instances to which it has network line of sight, whereas software inventory by itself may not need network line of sight.
* Discovery of installed applications might take longer than 15 minutes. The duration depends on the number of discovered servers. For 500 servers, it takes approximately one hour for the discovered inventory to appear in the Azure Migrate project in the portal.
* [Software inventory](how-to-discover-applications.md) identifies web server role existing on discovered servers. If a server is found to have web server role enabled, Azure Migrate will perform web apps discovery on the server. Web apps configuration data is updated once every 24 hours.
* During software inventory, the added server credentials are iterated against servers and validated for agentless dependency analysis. When the discovery of servers is finished, in the portal, you can enable agentless dependency analysis on the servers. Only the servers on which validation succeeds can be selected to enable [agentless dependency analysis](how-to-create-group-machine-dependencies-agentless.md).
* Web apps and SQL Server instances and databases data begin to appear in the portal within 24 hours after you start discovery.
* By default, Azure Migrate uses the most secure way of connecting to SQL instances that is, Azure Migrate encrypts communication between the Azure Migrate appliance and the source SQL Server instances by setting the TrustServerCertificate property to `true`. Additionally, the transport layer uses TLS to encrypt the channel and bypass the certificate chain to validate trust. Hence, the appliance server must be set up to trust the certificate's root authority. However, you can modify the connection settings, by selecting **Edit SQL Server connection properties** on the appliance. [Learn more](/sql/database-engine/configure-windows/enable-encrypted-connections-to-the-database-engine) to understand what to choose.

    :::image type="content" source="./media/tutorial-discover-vmware/sql-connection-properties.png" alt-text="Screenshot that shows how to edit SQL Server connection properties.":::

To start vCenter Server discovery, select **Start discovery**. After the discovery is successfully initiated, you can check the discovery status by looking at the vCenter Server IP address or FQDN in the sources table.

### View discovered data

1. Return to Azure Migrate in the Azure portal.
1. Select **Refresh** to view discovered data.
1. Select the discovered servers count to review the discovered inventory. You can filter the inventory by selecting the appliance name and selecting one or more vCenter Servers from the **Source** filter.

   :::image type="content" source="./media/tutorial-discover-vmware/discovery-assessment-tile.png" alt-text="Screenshot that shows how to refresh data in discovery and assessment tile.":::

Details such as OS license support status, inventory, database instances, etc are displayed. 

#### View support status

You can gain deeper insights into the support posture of your environment from the **Discovered servers** and **Discovered database instances** sections.

The **Operating system license support status** column displays the support status of the Operating system, whether it is in mainstream support, extended support, or out of support. Selecting the support status opens a pane on the right which provides clear guidance regarding actionable steps that can be taken to secure servers and databases in extended support or out of support.

To view the remaining duration until end of support, that is, the number of months for which the license is valid, select **Columns** > **Support ends in** > **Submit**. The **Support ends in** column displays the duration in months.

The **Database instances** displays the number of instances discovered by Azure Migrate. Select the number of instances to view the database instance details. The **Database instance license support status** displays the support status of the database instance. Selecting the support status opens a pane on the right which provides clear guidance regarding actionable steps that can be taken to secure servers and databases in extended support or out of support.

To view the remaining duration until end of support, that is, the number of months for which the license is valid, select **Columns** > **Support ends in** > **Submit**. The **Support ends in** column displays the duration in months.
 

## Next steps

- Learn how to [assess servers to migrate to Azure VMs](./tutorial-assess-vmware-azure-vm.md).
- Learn how to [assess servers running SQL Server to migrate to Azure SQL](./tutorial-assess-sql.md).
- Learn how to [assess web apps to migrate to Azure App Service](./tutorial-assess-webapps.md).
- Review [data the Azure Migrate appliance collects](discovered-metadata.md#collected-metadata-for-vmware-servers) during discovery.
