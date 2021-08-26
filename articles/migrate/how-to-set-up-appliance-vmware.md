---
title: Set up an Azure Migrate appliance for server assessment in a VMware environment 
description: Learn how to set up an Azure Migrate appliance to assess and migrate servers in VMware environment.
author: vikram1988 
ms.author: vibansa
ms.manager: abhemraj
ms.topic: how-to
ms.date: 07/27/2021
---

# Set up an appliance for servers in a VMware environment

This article describes how to set up the Azure Migrate appliance for assessment by using the [Azure Migrate: Discovery and assessment](migrate-services-overview.md#azure-migrate-discovery-and-assessment-tool) tool.

The [Azure Migrate appliance](migrate-appliance.md) is a lightweight appliance that the Azure Migrate: Discovery and assessment tool uses to discover servers running in vCenter Server and to send server configuration and performance metadata to Azure.

## Set up the appliance

You can deploy the Azure Migration appliance by using a couple of methods:

- Create a server on a vCenter Server VM by using a downloaded OVA template. This method is described in this article.
- Set up the appliance on an existing server by using a PowerShell installer script. You should [run a PowerShell script](deploy-appliance-script.md) if you can't use an OVA template or if you're in Azure Government.

After you create the appliance, you check that the appliance can connect to Azure Migrate: Discovery and assessment, register the appliance with the project, and configure the appliance to start discovery.

### Deploy by using an OVA template

To set up the appliance by using an OVA template, you'll complete these steps, which are described in more detail in this section:

1. Provide an appliance name and generate a project key in the portal.
1. Download an OVA template file, and then import it to vCenter Server. Verify that the OVA is secure.
1. Create the appliance from the OVA file. Verify that the appliance can connect to Azure Migrate.
1. Configure the appliance for the first time. 
1. Register the appliance with the project by using the project key.

#### Generate the project key

1. In **Migration Goals**, select **Servers** > **Azure Migrate: Discovery and assessment** > **Discover**.
1. In **Discover servers**, select **Are your servers virtualized?** > **Yes, with VMware vSphere hypervisor**.
1. In **1:Generate project key**, provide a name for the Azure Migrate appliance that you'll set up to discover servers in your VMware environment. The name should be alphanumeric and 14 characters or fewer.
1. To start creating the required Azure resources, select **Generate key**. Don't close the **Discover** pane while the resources are being created.
1. After the Azure resources are successfully created, a *project key* is generated.
1. Copy the key. You'll use the key to complete registration of the appliance when you configure the appliance.

#### Download the OVA template

In **2: Download Azure Migrate appliance**, select the OVA file, and then select **Download**.

##### Verify security

Before you deploy the OVA file, verify that the file is secure:

1. On the server on which you downloaded the file, open a Command Prompt window by using the **Run as administrator** option.
1. Run the following command to generate the hash for the OVA file:
  
    ```bash
    C:\>CertUtil -HashFile <file_location> <hashing_agorithm>
    ```
   
    Example: `C:\>CertUtil -HashFile C:\Users\Administrator\Desktop\MicrosoftAzureMigration.ova SHA256`

1. Verify the latest appliance versions and hash values for the Azure public cloud:
    
    **Algorithm** | **Download** | **SHA256**
    --- | --- | ---
    VMware (11.9 GB) | [Latest version](https://go.microsoft.com/fwlink/?linkid=2140333) | e9c9a1fe4f3ebae81008328e8f3a7933d78ff835ecd871d1b17f367621ce3c74

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

<a name="4-configure-the-appliance"></a>

### Configure the appliance

To set up the appliance for the first time:

> [!NOTE]
> If you set up the appliance by using a [PowerShell script](deploy-appliance-script.md) instead of a downloaded OVA template, you can skip the first two steps.

1. In vSphere Client, right-click the server, and then select **Open Console**.
1. Select or enter the language, time zone, and password for the appliance.
1. Open a browser on any server that can connect to the appliance server. Then, open the URL of the appliance configuration manager: `https://appliance name or IP address: 44368`.

     Or, you can open the configuration manager from the appliance server desktop by selecting the shortcut for the configuration manager.
1. Accept the license terms and read the third-party information.
1. In the configuration manager, select **Set up prerequisites**, and then complete these steps:
    1. **Connectivity**: The appliance checks that the server has internet access. If the server uses a proxy:
        1. Select **Setup proxy** to specify the proxy address (in the form `http://ProxyIPAddress` or `http://ProxyFQDN`, where *FQDN* refers to a *fully qualified domain name*) and listening port.
        1.  Enter credentials if the proxy needs authentication.
        1. If you have added proxy details or disabled the proxy or authentication, select **Save** to trigger connectivity and check connectivity again.

            Only HTTP proxy is supported.
    1. **Time sync**: Check that the time on the appliance is in sync with internet time for discovery to work properly.
    1. **Install updates**: The appliance ensures that the latest updates are installed. When the check is finished, you can select **View appliance services** to see the status and versions of the services running on the appliance server.
    1. **Install the VDDK**: The appliance checks that VMware vSphere Virtual Disk Development Kit (VDDK) is installed. If the VDDK isn't installed, download VDDK 6.7 from VMware. Extract the downloaded zip file contents to the specified location on the appliance, as indicated in the *Installation instructions*.

        Azure Migrate Server Migration uses the VDDK to replicate servers during migration to Azure. 
1. You can *rerun prerequisites* at any time during appliance configuration to check whether the appliance meets all the prerequisites:

    :::image type="content" source="./media/tutorial-discover-vmware/appliance-prerequisites.png" alt-text="Screenshot that shows setting up the prerequisites in the appliance configuration manager.":::

#### Register the appliance with Azure Migrate

1. Paste the project key that you copied from the portal. If you don't have the key, go to **Discovery and assessment** > **Discover** > **Manage existing appliances**. Select the appliance name you provided when you generated the project key, and then copy the key that's shown.
1. You must have a device code to authenticate with Azure. Select **Login**. In **Continue with Azure Login**,  select **Copy code & Login** to copy the device code and open an Azure Login prompt in a new browser tab. Make sure you've disabled the pop-up blocker in the browser to see the prompt.

    :::image type="content" source="./media/tutorial-discover-vmware/device-code.png" alt-text="Screenshot that shows where to copy the device code and log in.":::

1. In a new tab in your browser, paste the device code and sign-in by using your Azure username and password. Signing in with a PIN isn't supported.

    If you close the login tab accidentally without logging in, refresh the browser tab of the appliance configuration manager to display the device code and **Copy code & Login** button.
1. After you successfully log in, return to the browser tab that displays the appliance configuration manager. If the Azure user account that you used to log in has the required permissions for the Azure resources that were created during key generation, appliance registration starts.
1. After the appliance is successfully registered, to see the registration details, select **View details**.

    :::image type="content" source="./media/tutorial-discover-vmware/appliance-registration.png" alt-text="Screenshot of the Register with Azure Migrate pane showing that the appliance has been successfully registered.":::

## Start continuous discovery

Complete the setup steps in the appliance configuration manager to prepare for and start discovery.

### Provide vCenter Server details

The appliance must connect to vCenter Server to discover the configuration and performance data of the servers:

1. In **Step 1: Provide vCenter Server credentials**, select **Add credentials** to enter a name for the credentials. Add the username and password for the vCenter Server account that the appliance will use to discover servers running on vCenter Server.
    - You should have set up an account with the required permissions as described earlier in this article.
    - If you want to scope discovery to specific VMware objects (vCenter Server datacenters, clusters, hosts, folders of clusters or hosts, or individual servers), review the instructions to [set discovery scope](set-discovery-scope.md) to restrict the account that Azure Migrate uses.
1. In **Step 2: Provide vCenter Server details**, select **Add discovery source** to select the name for the credentials from the dropdown list. Select the IP address or FQDN of the vCenter Server. You can leave the port as the default (443) or specify a custom port on which vCenter Server listens. Select **Save**.
1. The appliance attempts to validate the connection to the server running vCenter Server by using the credentials. It displays the validation status for the vCenter Server IP address or FQDN in the credentials table.
1. You can *revalidate* the connectivity to vCenter Server anytime before starting discovery.

    :::image type="content" source="./media/tutorial-discover-vmware/appliance-manage-sources.png" alt-text="Screenshot that shows managing credentials and discovery sources for vCenter Server in the appliance configuration manager.":::

### Provide server credentials

In **Step 3: Provide server credentials to perform software inventory, agentless dependency analysis, discovery of SQL Server instances and databases and discovery of ASP.NET web apps in your VMware environment.**, you can provide multiple server credentials. If you don't want to use any of these appliance features, you can skip this step and proceed with vCenter Server discovery. You can change this option at any time.

:::image type="content" source="./media/tutorial-discover-vmware/appliance-server-credentials-mapping.png" alt-text="Screenshot that shows providing credentials for software inventory, dependency analysis, and s q l server discovery.":::

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
1. Review the [required permissions](add-server-credentials.md#required-permissions) on the account for Step 3: Provide server credentials to perform software inventory, agentless dependency analysis, discovery of SQL Server instances and databases and discovery of ASP.NET web apps.
1. To add multiple credentials at once, select **Add more** to save credentials, and then add more credentials.
    When you select **Save** or **Add more**, the appliance validates the domain credentials with the domain's Active Directory instance for authentication. Validation is made after each addition to avoid account lockouts as the appliance iterates to map credentials to respective servers.

To check validation of the domain credentials:

In the configuration manager, in the credentials table, see the **Validation status** for domain credentials. Only domain credentials are validated.

If validation fails, you can select a **Failed** status to see the validation error. Fix the issue, and then select **Revalidate credentials** to reattempt validation of the credentials.

:::image type="content" source="./media/tutorial-discover-vmware/add-server-credentials-multiple.png" alt-text="Screenshot that shows providing and validating multiple credentials.":::

### Start discovery

To start vCenter Server discovery, in **Step 3: Provide server credentials to perform software inventory, agentless dependency analysis, discovery of SQL Server instances and databases and discovery of ASP.NET web apps in your VMware environment.**, select **Start discovery**. After the discovery is successfully initiated, you can check the discovery status by looking at the vCenter Server IP address or FQDN in the sources table.

## How discovery works

* It takes approximately 15 minutes for the inventory of discovered servers to appear in the Azure portal.
* If you provided server credentials, software inventory (discovery of installed applications) is automatically initiated when the discovery of servers running vCenter Server is finished. Software inventory occurs once every 12 hours.
* [Software inventory](how-to-discover-applications.md) identifies the SQL Server instances that are running on the servers. Using the information it collects, the appliance attempts to connect to the SQL Server instances through the Windows authentication credentials or the SQL Server authentication credentials that are provided on the appliance. Then, it gathers data on SQL Server databases and their properties. The SQL Server discovery is performed once every 24 hours.
* [Software inventory](how-to-discover-applications.md) identifies the web server role on the servers. Using the information it collects, the appliance attempts to connect to the IIS web server through the Windows authentication credentials that are provided on the appliance. Then, it gathers data on web apps. The web app discovery is performed once every 24 hours.
* Discovery of installed applications might take longer than 15 minutes. The duration depends on the number of discovered servers. For 500 servers, it takes approximately one hour for the discovered inventory to appear in the Azure Migrate project in the portal.
* During software inventory, the added server credentials are iterated against servers and validated for agentless dependency analysis. When the discovery of servers is finished, in the portal, you can enable agentless dependency analysis on the servers. Only the servers on which validation succeeds can be selected to enable agentless dependency analysis.
* SQL Server instances and databases data and web apps data begin to appear in the portal within 24 hours after you start discovery.

## Next steps

Review the [tutorials for VMware assessment](./tutorial-assess-vmware-azure-vm.md) and [tutorials for agentless migration](tutorial-migrate-vmware.md).
