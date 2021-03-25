---
title: Set up an Azure Migrate appliance for VMware 
description: Learn how to set up an Azure Migrate appliance to assess and migrate servers in VMware environment.
author: vikram1988 
ms.author: vibansa
ms.manager: abhemraj
ms.topic: how-to
ms.date: 04/16/2020
---

# Set up an appliance for servers in VMware environment

Follow this article to set up the Azure Migrate appliance for assessment with the [Azure Migrate:Discovery and assessment](migrate-services-overview.md#azure-migrate-discovery-and-assessment-tool) tool, and for agentless migration using the [Azure Migrate:Server Migration](migrate-services-overview.md#azure-migrate-server-migration-tool) tool.

The [Azure Migrate appliance](migrate-appliance.md) is a lightweight appliance used by Azure Migrate:Discovery and assessment and Server Migration to discover servers running in vCenter Server, send server configuration and performance metadata to Azure, and for replication of servers using agentless migration.

You can deploy the appliance using a couple of methods:

- Create a server on vCenter Server using a downloaded OVA template. This is the method described in this article.
- Set up the appliance on an existing server using a PowerShell installer script. [This method](deploy-appliance-script.md) should be used if you cannot use OVA template, or if you're in Azure Government.

After creating the appliance, you check that it can connect to Azure Migrate: Discovery and assessment, register it with the project and configure the appliance to initiate discovery.

## Deploy with OVA

To set up the appliance using an OVA template you:

1. Provide an appliance name and generate a project key in the portal.
1. Download an OVA template file, and import it to vCenter Server. Verify the OVA is secure.
1. Create the appliance VM from the OVA file , and check that it can connect to Azure Migrate.
1. Configure the appliance for the first time, and register it with the project using the project key.

### 1. Generate the project key

1. In **Migration Goals** > **Servers** > **Azure Migrate: Discovery and assessment**, select **Discover**.
2. In **Discover servers** > **Are your servers virtualized?**, select **Yes, with VMware vSphere hypervisor**.
3. In **1:Generate project key**, provide a name for the Azure Migrate appliance that you will set up for discovery of servers in your VMware environment. The name should be alphanumeric with 14 characters or fewer.
1. Click on **Generate key** to start the creation of the required Azure resources. Do not close the Discover page during the creation of resources.
1. After the successful creation of the Azure resources, a project key** is generated.
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

Make sure that the appliance server can connect to Azure URLs for [public](migrate-appliance.md#public-cloud-urls) and [Government](migrate-appliance.md#government-cloud-urls) clouds.


### 4. Configure the appliance

Set up the appliance for the first time.

> [!NOTE]
> If you set up the appliance using a [**PowerShell script**](deploy-appliance-script.md) instead of the downloaded OVA, the first two steps in this procedure aren't relevant.

1. In the vSphere Client console, right-click the server, and then select **Open Console**.
2. Provide the language, time zone, and password for the appliance.
3. Open a browser on any server that can connect to the appliance server, and open the URL of the appliance configuration manager: `https://appliance name or IP address: 44368`.

   Alternately, you can open the configuration manager from the appliance server desktop by selecting the shortcut for the configuration manager.
1. Accept the **license terms**, and read the third-party information.
1. In the configuration manager > **Set up prerequisites**, do the following:
   - **Connectivity**: The appliance checks that the server has internet access. If the server uses a proxy:
     - Click on **Setup proxy** to specify the proxy address in the form `http://ProxyIPAddress` or `http://ProxyFQDN` and listening port.
     - Specify credentials if the proxy needs authentication.
     - Only HTTP proxy is supported.
     - If you have added proxy details or disabled the proxy and/or authentication, click on **Save** to trigger connectivity check again.
   - **Time sync**: The time on the appliance should be in sync with internet time for discovery to work properly.
   - **Install updates**: The appliance ensures that the latest updates are installed. After the check completes, you can click on **View appliance services** to see the status and versions of the services running on the appliance server.
   - **Install VDDK**: The appliance checks that VMware vSphere Virtual Disk Development Kit (VDDK) is installed. If it isn't installed, download VDDK 6.7 from VMware, and extract the downloaded zip contents to the specified location on the appliance, as provided in the **Installation instructions**.

     Azure Migrate Server Migration uses the VDDK to replicate servers during migration to Azure. 
1. If you want, you can **rerun prerequisites** at any time during appliance configuration to check if the appliance meets all the prerequisites.

    :::image type="content" source="./media/tutorial-discover-vmware/appliance-prerequisites.png" alt-text="Panel 1 on appliance configuration manager":::


## Register the appliance with Azure Migrate

1. Paste the **project key** copied from the portal. If you do not have the key, go to **Discovery and assessment> Discover> Manage existing appliances**, select the appliance name you provided at the time of key generation and copy the corresponding key.
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

In **Step 3: Provide server credentials to perform software inventory, agentless dependency analysis and discovery of SQL Server instances and databases**, you can either choose to provide multiple server credentials or if you do not want to leverage these features, you can choose to skip the step and proceed with vCenter Server discovery. You can change your intent anytime later.

:::image type="content" source="./media/tutorial-discover-vmware/appliance-server-credentials-mapping.png" alt-text="Panel 3 on appliance configuration manager for server details":::


If you want to leverage these features, you can provide server credentials by following the steps below. The appliance will attempt to automatically map the credentials to the servers to perform the discovery features.

- You can add server credentials by clicking on **Add Credentials** button. This will open a modal where you can choose the **Credentials type** from the drop-down.
- You can provide domain/ Windows(non-domain)/ Linux(non-domain)/ SQL Server authentication credentials. [Learn more](add-server-credentials.md) about how to provide credentials and how we handle them.
- For each type of credentials, you need to specify a friendly name for credentials, add **Username** and **Password** and click on **Save**.
- If you choose domain credentials, you would also need to specify the FQDN for the domain. The FQDN is required to validate the authenticity of the credentials with the Active Directory of that domain.
- Review the [required permissions](add-server-credentials.md#required-permissions) on the account for discovery of installed applications,agentless dependency analysis or for discovery of SQL Server instances and databases.
- If you want to add multiple credentials at once, click on **Add more** to save and add more credentials.
- When you click on **Save** or **Add more**, the appliance validates the domain credentials with the domain's Active Directory for their authenticity. This is done to avoid any account lockouts when appliance does multiple iterations to map credentials to the respective servers.
- You can see the **Validation status** for all the domain credentials in the credentials table. Only domain credentials will be validated.
- If the validation fails, you can click on **Failed** status to see the error encountered and click on **Revalidate credentials** after fixing the issue to validate the failed domain credentials again.
    :::image type="content" source="./media/tutorial-discover-vmware/add-server-credentials-multiple.png" alt-text="Panel 3 on appliance configuration manager with multiple server credentials":::

### Start discovery

1. Click on **Start discovery**, to kick off vCenter Server discovery. After the discovery has been successfully initiated, you can check the discovery status against the vCenter Server IP address/FQDN in the sources table.
1. If you have provided server credentials, software inventory (discovery of installed applications) will be automatically initiated after the discovery of vCenter Server has completed. The software inventory is performed once every 12 hours.
1. [Software inventory](how-to-discover-applications.md) identifies the SQL Server instances running on the servers and using the information, appliance attempts to connect to the instances through the Windows authentication or SQL Server authentication credentials provided on the appliance and gather data on SQL Server databases and their properties. The SQL discovery is performed once every 24 hours.
1. During software inventory, the added servers credentials will be iterated against servers and validated for agentless dependency analysis. You can enable agentless dependency analysis for servers from the portal. Only the servers where the validation succeeds can be selected to enable agentless dependency analysis.

Discovery works as follows:

- It takes around 15 minutes for discovered servers inventory to appear in the portal.
- Discovery of installed applications can take some time. The duration depends on the number of discovered servers. For 500 servers, it takes approximately one hour for the discovered inventory to appear in the Azure Migrate portal.
- After the discovery of servers is complete, you can enable agentless dependency analysis on the servers from the portal.
- SQL Server instances and databases data will start appearing in the portal within 24 hours from the discovery initiation.

## Next steps

Review the tutorials for [VMware assessment](./tutorial-assess-vmware-azure-vm.md) and [agentless migration](tutorial-migrate-vmware.md).
