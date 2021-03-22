---
title: Discover servers running in VMware environment with Azure Migrate Discovery and assessment
description: Learn how to discover on-premises servers running in VMware environment with the Azure Migrate Discovery and assessment tool
author: vineetvikram
ms.author: vivikram
ms.manager: abhemraj
ms.topic: tutorial
ms.date: 03/17/2021
ms.custom: mvc
#Customer intent: As an VMware admin, I want to discover my on-premises servers running in VMware environment.
---

# Tutorial: Discover servers running in VMware environment with Azure Migrate: Discovery and assessment

As part of your migration journey to Azure, you discover your on-premises inventory and workloads.

This tutorial shows you how to discover servers running in VMware environment with Azure Migrate: Discovery and assessment tool, using a lightweight Azure Migrate appliance. You deploy the appliance as a server running in your vCenter Server, to continuously discover servers and their performance metadata, applications running on servers, server dependencies and SQL Server instances and databases.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up an Azure account.
> * Prepare the VMware environment for discovery.
> * Create a project.
> * Set up the Azure Migrate appliance.
> * Start continuous discovery.

> [!NOTE]
> Tutorials show the quickest path for trying out a scenario, and use default options where possible.  

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.


## Prerequisites

Before you start this tutorial, check you have these prerequisites in place.


**Requirement** | **Details**
--- | ---
**vCenter Server/ESXi host** | You need a vCenter Server running version 5.5, 6.0, 6.5 or 6.7.<br/><br/> Servers must be hosted on an ESXi host running version 5.5 or later.<br/><br/> On the vCenter Server, allow inbound connections on TCP port 443, so that the appliance can collect the configuration and performance metadata.<br/><br/> The appliance connects to vCenter Server on port 443 by default. If the vCenter Server listens on a different port, you can modify the port when you provide the vCenter Server details on the appliance configuration manager.<br/><br/> On the ESXi hosts, make sure that inbound access is allowed on TCP port 443 to perform discovery of installed applications and agentless dependency analysis on servers.
**Appliance** | vCenter Server needs resources to allocate a server for the Azure Migrate appliance:<br/><br/> - 32 GB of RAM, 8 vCPUs, and around 80 GB of disk storage.<br/><br/> - An external virtual switch, and internet access on the appliance server, directly or via a proxy.
**Servers** | All Windows and Linux OS versions are supported for discovery of configuration and performance metadata. <br/><br/> To perform application discovery on servers, all Windows and Linux OS versions are supported. Check [here](migrate-support-matrix-vmware.md#dependency-analysis-requirements-agentless) for the OS versions supported for agentless dependency analysis.<br/><br/> To perform discovery of installed applications and agentless dependency analysis, VMware Tools (later than 10.2.0) must be installed and running on servers. Windows servers must have PowerShell version 2.0 or later installed.<br/><br/> To discover SQL Server instances and databases, check [here](migrate-support-matrix-vmware.md#requirements-for-discovery-of-sql-server-instances-and-databases) for the supported SQL Server versions and editions, the supported Windows OS versions and authentication mechanisms.

> [!Note]
> Discovery and assessment of SQL Server instances and databases running in your VMware environment is now in preview. To try out this feature, use [**this link**](https://aka.ms/AzureMigrate/SQL) to create a project in **Australia East** region. If you already have a project in Australia East and want to try out this feature, please ensure that you have completed these [**prerequisites**](how-to-discover-sql-existing-project.md) on the portal.

## Prepare an Azure user account

To create a project and register the Azure Migrate appliance, you need an account with:
- Contributor or Owner permissions on the Azure subscription
- Permissions to register Azure Active Directory (AAD) apps
- Owner or Contributor plus User Access Administrator permissions on the Azure subscription to create a Key Vault, used during agentless server migration

If you just created a free Azure account, you're the owner of your subscription. If you're not the subscription owner, work with the owner to assign the permissions as follows:

1. In the Azure portal, search for "subscriptions", and under **Services**, select **Subscriptions**.

    :::image type="content" source="./media/tutorial-discover-vmware/search-subscription.png" alt-text="Search box to search for the Azure subscription":::


2. In the **Subscriptions** page, select the subscription in which you want to create a project.
3. In the subscription, select **Access control (IAM)** > **Check access**.
4. In **Check access**, search for the relevant user account.
5. In **Add a role assignment**, click **Add**.
:::image type="content" source="./media/tutorial-discover-vmware/azure-account-access.png" alt-text="Search for a user account to check access and assign a role":::
    
6. In **Add role assignment**, select the Contributor or Owner role, and select the account (azmigrateuser in our example). Then click **Save**.

    :::image type="content" source="./media/tutorial-discover-vmware/assign-role.png" alt-text="Opens the Add Role assignment page to assign a role to the account":::

1. To register the appliance, your Azure account needs **permissions to register AAD apps.**
1. In Azure portal, navigate to **Azure Active Directory** > **Users** > **User Settings**.
1. In **User settings**, verify that Azure AD users can register applications (set to **Yes** by default).

    :::image type="content" source="./media/tutorial-discover-vmware/register-apps.png" alt-text="Verify in User Settings that users can register Active Directory apps":::

9. In case the 'App registrations' settings is set to 'No', request the tenant/global admin to assign the required permission. Alternately, the tenant/global admin can assign the **Application Developer** role to an account to allow the registration of AAD App. [Learn more](../active-directory/fundamentals/active-directory-users-assign-role-azure-portal.md).

## Prepare VMware

On vCenter Server, check that your account has permissions to create a VM using an OVA file. This is needed when you deploy the Azure Migrate appliance as a VMware VM, using an OVA file.

Azure Migrate needs a vCenter Server read-only account for discovery and assessment of servers running in your VMware environment. If you also want to perform discovery of installed applications and agentless dependency analysis, the account needs privileges enabled for **Virtual Machines > Guest Operations**.

### Create an account to access vCenter

In vSphere Web Client, set up an account as follows:

1. Using an account with admin privileges, in the vSphere Web Client > select **Administration**.
2. **Access**, select **SSO Users and Groups**.
3. In **Users**, add a new user.
4. In **New User**, type in the account details. Then click **OK**.
5. In **Global Permissions**, select the user account, and assign the **Read-only** role to the account. Then click **OK**.
6.  If you also want to perform discovery of installed applications and agentless dependency analysis, go to **Roles** > select the **Read-only** role, and in **Privileges**, select **Guest Operations**. You can propagate the privileges to all objects under the vCenter Server by selecting "Propagate to children" checkbox.

    :::image type="content" source="./media/tutorial-discover-vmware/guest-operations.png" alt-text="Checkbox to allow guest operations on the read-only role":::


> [!NOTE]
> You can limit discovery to specific vCenter Server datacenters, clusters, a folder of clusters, hosts, a folder of hosts, or individual servers by scoping the vCenter Server account. [**Learn more**](set-discovery-scope.md) on how to scope the vCenter Server user account.


### Create an account to access servers

You need a user account with the necessary privileges on the servers to perform discovery of installed applications, agentless dependency analysis, and discovery of SQL Server instances and databases. You can provide the user account on the appliance configuration manager. The appliance does not install any agents on the servers.

1. For Windows servers, create an account (local or domain) with administrative permissions on the servers. To discover SQL Server instances and databases, you need the Windows or SQL Server account to be a member of the sysadmin server role. [Learn more](https://docs.microsoft.com/sql/relational-databases/security/authentication-access/server-level-roles) on how to assign the required role to the user account.
2. For Linux servers, create an account with Root privileges. Alternately, you can create an account with these permissions on /bin/netstat and /bin/ls files: CAP_DAC_READ_SEARCH and CAP_SYS_PTRACE.

> [!NOTE]
> You can now add multiple server credentials on the configuration manager to perform discovery of installed applications, agentless dependency analysis and discovery of SQL Server instances and databases.You can add multiple domain/ Windows(non-domain)/ Linux(non-domain) and/or SQL Server authentication credentials. [**Learn more**](add-server-credentials.md)

## Set up a project

Set up a new project.

1. In the Azure portal > **All services**, search for **Azure Migrate**.
2. Under **Services**, select **Azure Migrate**.
3. In **Overview**, select **Create project**.
5. In **Create project**, select your Azure subscription and resource group. Create a resource group if you don't have one.
6. In **Project Details**, specify the project name and the geography in which you want to create the project. Review supported geographies for [public](migrate-support-matrix.md#supported-geographies-public-cloud) and [government clouds](migrate-support-matrix.md#supported-geographies-azure-government).

    :::image type="content" source="./media/tutorial-discover-vmware/new-project.png" alt-text="Boxes for project name and region":::

7. Select **Create**.
8. Wait a few minutes for the project to deploy. The **Azure Migrate: Discovery and assessment** tool is added by default to the new project.

> [!NOTE]
> If you have already created a project, you can use the same project to register additional appliances to discover and assess more no. of servers.[**Learn more**](create-manage-projects.md#find-a-project)

## Set up the appliance

Azure Migrate: Discovery and assessment use a lightweight Azure Migrate appliance. The appliance performs server discovery and sends server configuration and performance metadata to Azure Migrate. The appliance can be set up by deploying an OVA template that can be downloaded from the project.

> [!NOTE]
> If for some reason you can't set up the appliance using the template, you can set it up using a PowerShell script on an existing Windows Server 2016 server. [**Learn more**](deploy-appliance-script.md#set-up-the-appliance-for-vmware).

### Deploy with OVA

To set up the appliance using an OVA template you:

1. Provide an appliance name and generate a project key in the portal.
1. Download an OVA template file, and import it to vCenter Server. Verify the OVA is secure.
1. Create the appliance from the OVA file, and check that it can connect to Azure Migrate.
1. Configure the appliance for the first time, and register it with the project using the project key.

### 1. Generate the project key

1. In **Migration Goals** > **Windows, Linux and SQL Servers** > **Azure Migrate: Discovery and assessment**, select **Discover**.
2. In **Discover servers** > **Are your servers virtualized?**, select **Yes, with VMware vSphere hypervisor**.
3. In **1:Generate project key**, provide a name for the Azure Migrate appliance that you will set up for discovery of servers in your VMware environment. The name should be alphanumeric with 14 characters or fewer.
1. Click on **Generate key** to start the creation of the required Azure resources. Please do not close the Discover page during the creation of resources.
1. After the successful creation of the Azure resources, a **project key** is generated.
1. Copy the key as you will need it to complete the registration of the appliance during its configuration.

### 2. Download the OVA template

In **2: Download Azure Migrate appliance**, select the .OVA file and click on **Download**.

### Verify security

Check that the OVA file is secure, before you deploy it:

1. On the server to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the OVA file:
  
   ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
   
   Example usage: ```C:\>CertUtil -HashFile C:\Users\Administrator\Desktop\MicrosoftAzureMigration.ova SHA256```

3. Verify the latest appliance versions and hash values:

    - For the Azure public cloud:
    
        **Algorithm** | **Download** | **SHA256**
        --- | --- | ---
        VMware (11.9 GB) | [Latest version](https://go.microsoft.com/fwlink/?linkid=2140333) | e9c9a1fe4f3ebae81008328e8f3a7933d78ff835ecd871d1b17f367621ce3c74

    - For Azure Government:
    
        **Algorithm** | **Download** | **SHA256**
        --- | --- | ---
        VMware (85.8 MB) | [Latest version](https://go.microsoft.com/fwlink/?linkid=2140337) | 2daaa2a59302bf911e8ef195f8add7d7c8352de77a9af0b860e2a627979085ca

### 3. Create the appliance server

Import the downloaded file, and create a server in VMware environment

1. In the vSphere Client console, click **File** > **Deploy OVF Template**.
2. In the Deploy OVF Template Wizard > **Source**, specify the location of the OVA file.
3. In **Name** and **Location**, specify a friendly name for the server. Select the inventory object in which the server will be hosted.
5. In **Host/Cluster**, specify the host or cluster on which the server will run.
6. In **Storage**, specify the storage destination for the server.
7. In **Disk Format**, specify the disk type and size.
8. In **Network Mapping**, specify the network to which the server will connect. The network needs internet connectivity, to send metadata to Azure Migrate.
9. Review and confirm the settings, then click **Finish**.


### Verify appliance access to Azure

Make sure that the appliance server can connect to Azure URLs for [public](migrate-appliance.md#public-cloud-urls) and [government](migrate-appliance.md#government-cloud-urls) clouds.


### 4. Configure the appliance

Set up the appliance for the first time.

> [!NOTE]
> If you set up the appliance using a [**PowerShell script**](deploy-appliance-script.md) instead of the downloaded OVA, the first two steps in this procedure aren't relevant.

1. In the vSphere Client console, right-click the server, and then select **Open Console**.
2. Provide the language, time zone, and password for the appliance.
3. Open a browser on any machine that can connect to the appliance, and open the URL of the appliance configuration manager: `https://appliance name or IP address: 44368`.

   Alternately, you can open the configuration manager from the appliance server desktop by selecting the shortcut for the configuration manager.
1. Accept the **license terms**, and read the third-party information.
1. In the configuration manager > **Set up prerequisites**, do the following:
   - **Connectivity**: The appliance checks that the server has internet access. If the server uses a proxy:
     - Click on **Setup proxy** to specify the proxy address `http://ProxyIPAddress` or `http://ProxyFQDN` and listening port.
     - Specify credentials if the proxy needs authentication.
     - Only HTTP proxy is supported.
     - If you have added proxy details or disabled the proxy and/or authentication, click on **Save** to trigger connectivity check again.
   - **Time sync**: The time on the appliance should be in sync with internet time for discovery to work properly.
   - **Install updates**: The appliance ensures that the latest updates are installed. After the check completes, you can click on **View appliance services** to see the status and versions of the services running on the appliance server.
   - **Install VDDK**: The appliance checks that VMware vSphere Virtual Disk Development Kit (VDDK) is installed. If it isn't installed, download VDDK 6.7 from VMware, and extract the downloaded zip contents to the specified location on the appliance, as provided in the **Installation instructions**.

     Azure Migrate Server Migration uses the VDDK to replicate servers during migration to Azure. 
1. If you want, you can **rerun prerequisites** at any time during appliance configuration to check if the appliance meets all the prerequisites.

    :::image type="content" source="./media/tutorial-discover-vmware/appliance-prerequisites.png" alt-text="Panel 1 on appliance configuration manager":::


### Register the appliance with Azure Migrate

1. Paste the **project key** copied from the portal. If you do not have the key, go to **Azure Migrate: Discovery and assessment> Discover> Manage existing appliances**, select the appliance name you provided at the time of key generation and copy the corresponding key.
1. You will need a device code to authenticate with Azure. Clicking on **Login** will open a modal with the device code as shown below.

    :::image type="content" source="./media/tutorial-discover-vmware/device-code.png" alt-text="Modal showing the device code":::

1. Click on **Copy code & Login** to copy the device code and open an Azure Login prompt in a new browser tab. If it doesn't appear, make sure you've disabled the pop-up blocker in the browser.
1. On the new tab, paste the device code and sign-in by using your Azure username and password.
   
   Sign-in with a PIN isn't supported.
3. In case you close the login tab accidentally without logging in, you need to refresh the browser tab of the appliance configuration manager to enable the Login button again.
1. After you successfully logged in, go back to the previous tab with the appliance configuration manager.
1. If the Azure user account used for logging has the right permissions on the Azure resources created during key generation, the appliance registration will be initiated.
1. After appliance is successfully registered, you can see the registration details by clicking on **View details**.

    :::image type="content" source="./media/tutorial-discover-vmware/appliance-registration.png" alt-text="Panel 2 on appliance configuration manager":::

## Start continuous discovery

### Provide vCenter Server details

The appliance needs to connect to vCenter Server to discover the configuration and performance data of the servers.

1. In **Step 1: Provide vCenter Server credentials**, click on **Add credentials** to  specify a friendly name for credentials, add **Username** and **Password** for the vCenter Server account that the appliance will use to discover servers running on the vCenter Server.
    - You should have set up an account with the required permissions as covered in this article above.
    - If you want to scope discovery to specific VMware objects (vCenter Server datacenters, clusters, a folder of clusters, hosts, a folder of hosts, or individual servers.), review the instructions in [this article](set-discovery-scope.md) to restrict the account used by Azure Migrate.
1. In **Step 2: Provide vCenter Server details**, click on **Add discovery source** to select the friendly name for credentials from the drop-down, specify the **IP address/FQDN** of the vCenter Server. You can leave the **Port** to default (443) or specify a custom port on which vCenter Server listens and click on **Save**.
1. On clicking **Save**, appliance will try validating the connection to the vCenter Server with the credentials provided and show the **Validation status** in the table against the vCenter Server IP address/FQDN.
1. You can **revalidate** the connectivity to vCenter Server anytime before starting the discovery.

    :::image type="content" source="./media/tutorial-discover-vmware/appliance-manage-sources.png" alt-text="Panel 3 on appliance configuration manager for vCenter Server details":::

### Provide server credentials

In **Step 3: Provide server credentials to perform software inventory, agentless dependency analysis and discovery of SQL Server instances and databases**, you can either choose to provide multiple server credentials or if you do not want to use these features, you can choose to skip the step and proceed with vCenter Server discovery. You can change your intent anytime later.

:::image type="content" source="./media/tutorial-discover-vmware/appliance-server-credentials-mapping.png" alt-text="Panel 3 on appliance configuration manager for server details":::

> [!Note]
> Discovery and assessment of SQL Server instances and databases running in your VMware environment is now in preview. To try out this feature, use [**this link**](https://aka.ms/AzureMigrate/SQL) to create a project in **Australia East** region. If you already have a project in Australia East and want to try out this feature, please ensure that you have completed these [**prerequisites**](how-to-discover-sql-existing-project.md) on the portal.

If you want to use these features, you can provide server credentials by following the steps below. The appliance will attempt to automatically map the credentials to the servers to perform the discovery features.

- You can add server credentials by clicking on **Add Credentials** button. This will open a modal where you can choose the **Credentials type** from the drop-down.
- You can provide domain/ Windows(non-domain)/ Linux(non-domain)/ SQL Server authentication credentials. [Learn more](add-server-credentials.md) about how to provide credentials and how we handle them.
- For each type of credentials, you need to specify a friendly name for credentials, add **Username** and **Password** and click on **Save**.
- If you choose domain credentials, you would also need to specify the FQDN for the domain. The FQDN is required to validate the authenticity of the credentials with the Active Directory of that domain.
- Review the [required permissions](add-server-credentials.md#required-permissions) on the account for discovery of installed applications,agentless dependency analysis or for discovery of SQL Server instances and databases.
- If you want to add multiple credentials at once, click on **Add more** to save and add more credentials.
- When you click on **Save** or **Add more**, the appliance validates the domain credentials with the domain's Active Directory for their authenticity. This is done to avoid any account lockouts when appliance does multiple iterations to map credentials to the respective servers.
- You can see the **Validation status** for all the domain credentials in the credentials table. Only domain credentials will be validated.
- If the validation fails, you can click on **Failed** status to see the error encountered and click on **Revalidate credentials** after fixing the issue to validate the failed domain credentials again.


### Start discovery

1. Click on **Start discovery**, to kick off vCenter Server discovery. After the discovery has been successfully initiated, you can check the discovery status against the vCenter Server IP address/FQDN in the sources table.
1. If you have provided server credentials, software inventory (discovery of installed applications) will be automatically initiated after the discovery of vCenter Server has completed. The software inventory is performed once every 12 hours.
1. [Software inventory](how-to-discover-applications.md) identifies the SQL Server instances running on the servers and using the information, appliance attempts to connect to the instances through the Windows authentication or SQL Server authentication credentials provided on the appliance and gather data on SQL Server databases and their properties. The SQL discovery is performed once every 24 hours.
1. During software inventory, the added servers credentials will be iterated against servers and validated for agentless dependency analysis. You can enable agentless dependency analysis for servers from the portal. Only the servers where the validation succeeds can be selected to enable agentless dependency analysis.

> [!Note]
>Azure Migrate will encrypt the communication between Azure Migrate appliance and source SQL Server instances (with Encrypt connection property set to TRUE). These connections are encrypted with [**TrustServerCertificate**](https://docs.microsoft.com/dotnet/api/system.data.sqlclient.sqlconnectionstringbuilder.trustservercertificate) (set to TRUE); the transport layer will use SSL to encrypt the channel and bypass the certificate chain to validate trust. The appliance server must be set up to [**trust the certificate's root authority**](https://docs.microsoft.com/sql/database-engine/configure-windows/enable-encrypted-connections-to-the-database-engine).<br/>
If no certificate has been provisioned on the server when it starts up, SQL Server generates a self-signed certificate which is used to encrypt login packets. [**Learn more**](https://docs.microsoft.com/sql/database-engine/configure-windows/enable-encrypted-connections-to-the-database-engine).

Discovery works as follows:

- It takes around 15 minutes for discovered servers inventory to appear in the portal.
- Discovery of installed applications can take some time. The duration depends on the number of discovered servers. For 500 servers, it takes approximately one hour for the discovered inventory to appear in the Azure Migrate portal.
- After the discovery of servers is complete, you can enable agentless dependency analysis on the servers from the portal.
- SQL Server instances and databases data will start appearing in the portal within 24 hours from the discovery initiation.

## Next steps

- [Assess servers](./tutorial-assess-vmware-azure-vm.md) for migration to Azure VMs.
- [Assess SQL Servers](./tutorial-assess-sql.md) for migration to Azure SQL.
- [Review the data](migrate-appliance.md#collected-data---vmware) that the appliance collects during discovery.