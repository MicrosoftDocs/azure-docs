---
title: Set up an Azure Migrate appliance for Hyper-V
description: Learn how to set up an Azure Migrate appliance to assess and migrate servers on Hyper-V.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: how-to
ms.service: azure-migrate
ms.date: 12/12/2022
ms.custom: engagement-fy23
---

# Set up an appliance for servers on Hyper-V

Follow this article to set up the Azure Migrate appliance for discovery and assessment of servers on Hyper-V with the [Azure Migrate: Discovery and assessment](migrate-services-overview.md#azure-migrate-discovery-and-assessment-tool) tool.

The [Azure Migrate appliance](migrate-appliance.md)  is a lightweight appliance used by Azure Migrate: Discovery and assessment/ Migration to discover on-premises servers on Hyper-V, and send server metadata/performance data to Azure.

You can deploy the appliance using a couple of methods:

- Set up on a server on Hyper-V using a downloaded VHD. This method described in the current article.
- Set up on a server on Hyper-V or physical server with a PowerShell installer script. [This method](deploy-appliance-script.md) should be used if you can't set up a server using a VHD, or if you're in Azure Government.

After creating the appliance, you check that it can connect to Azure Migrate: Discovery and assessment, configure it for the first time, and register it with the project.

> [!NOTE]
> If you have already created a project, you can use the same project to register additional appliances to discover and assess more no of servers.[Learn more](create-manage-projects.md#find-a-project)

## Appliance deployment (VHD)

To set up the appliance using a VHD template:

- Provide an appliance name and generate a project key in the portal.
- Download a compressed Hyper-V VHD from the Azure portal.
- Create the appliance, and check that it can connect to Azure Migrate: Discovery and assessment.
- Configure the appliance for the first time, and register it with the project using the project key.

### Generate the project key

1. In **Migration goals** > **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**, select **Discover**.
2. In **Discover servers** > **Are your servers virtualized?**, select **Yes, with Hyper-V**.
3. In **1:Generate project key**, provide a name for the Azure Migrate appliance that you will set up for discovery of servers on Hyper-V. The name should be alphanumeric with 14 characters or fewer.
1. Click on **Generate key** to start the creation of the required Azure resources. Do not close the Discover servers page during the creation of resources.
1. After the successful creation of the Azure resources, a **project key** is generated.
1. Copy the key as you will need it to complete the registration of the appliance during its configuration.

### Download the VHD

In **2: Download Azure Migrate appliance**, select the .VHD file and click on **Download**.

   :::image type="content" source="./media/tutorial-assess-hyper-v/servers-discover.png" alt-text="Screenshot of selections for Discover servers.":::


   :::image type="content" source="./media/tutorial-assess-hyper-v/generate-key-hyper-v-inline-1.png" alt-text="Screenshots of selections for Generate Key." lightbox="./media/tutorial-assess-hyper-v/generate-key-hyper-v-expanded-1.png":::

### Verify security

Check that the zipped file is secure, before you deploy it.

1. On the server to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the VHD
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example usage: ```C:\>Get-FileHash -Path ./AzureMigrateAppliance_v3.20.09.25.zip -Algorithm SHA256```

Verify the latest hash value by comparing the outcome of above command to the value documented [here](./tutorial-discover-hyper-v.md#verify-security)

## Create the appliance

Import the downloaded file, and create an appliance.

1. Extract the zipped VHD file to a folder on the Hyper-V host that will host the appliance. Three folders are extracted.
2. Open Hyper-V Manager. In **Actions**, click **Import Virtual Machine**.

    ![Screenshot of preocedure to Deploy VHD.](./media/how-to-set-up-appliance-hyper-v/deploy-vhd.png)

2. In the Import Virtual Machine Wizard > **Before you begin**, click **Next**.
3. In **Locate Folder**, specify the folder containing the extracted VHD. Then click **Next**.
1. In **Select Virtual Machine**, click **Next**.
2. In **Choose Import Type**, click **Copy the virtual machine (create a new unique ID)**. Then click **Next**.
3. In **Choose Destination**, leave the default setting. Click **Next**.
4. In **Storage Folders**, leave the default setting. Click **Next**.
5. In **Choose Network**, specify the virtual switch that the server will use. The switch needs internet connectivity to send data to Azure.
6. In **Summary**, review the settings. Then click **Finish**.
7. In Hyper-V Manager > **Virtual Machines**, start the VM.

### Verify appliance access to Azure

Make sure that the appliance can connect to Azure URLs for [public](migrate-appliance.md#public-cloud-urls) and [government](migrate-appliance.md#government-cloud-urls) clouds.

### Configure the appliance

Set up the appliance for the first time.

> [!NOTE]
> If you set up the appliance using a [PowerShell script](deploy-appliance-script.md) instead of the downloaded VHD, the first two steps in this procedure aren't relevant.

1. In Hyper-V Manager > **Virtual Machines**, right-click the server > **Connect**.
2. Provide the language, time zone, and password for the appliance.
3. Open a browser on any system that can connect to the appliance, and open the URL of the appliance web app: **https://*appliance name or IP address*: 44368**.

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

Connect from the appliance to Hyper-V hosts or clusters, and start discovery.

### Provide Hyper-V host/cluster details

1. In **Step 1: Provide Hyper-V host credentials**, click on **Add credentials** to  specify a friendly name for credentials, add **Username** and **Password** for a Hyper-V host/cluster that the appliance will use to discover servers. Click on **Save**.
1. If you want to add multiple credentials at once, click on **Add more** to save and add more credentials. Multiple credentials are supported for the discovery of servers on Hyper-V.
1. In **Step 2: Provide Hyper-V host/cluster details**, click on **Add discovery source** to specify the Hyper-V host/cluster **IP address/FQDN** and the friendly name for credentials to connect to the host/cluster.
1. You can either **Add single item** at a time or **Add multiple items** in one go. There is also an option to provide Hyper-V host/cluster details through **Import CSV**.

    ![Screenshot of selections for adding discovery source.](./media/tutorial-assess-hyper-v/add-discovery-source-hyperv.png)

    - If you choose **Add single item**, you need to specify friendly name for credentials and Hyper-V host/cluster **IP address/FQDN** and click on **Save**.
    - If you choose **Add multiple items** _(selected by default)_, you can add multiple records at once by specifying Hyper-V host/cluster **IP address/FQDN** with the friendly name for credentials in the text box. Verify** the added records and click on **Save**.
    - If you choose **Import CSV**, you can download a CSV template file, populate the file with the Hyper-V host/cluster **IP address/FQDN** and friendly name for credentials. You then import the file into the appliance, **verify** the records in the file and click on **Save**.

1. On clicking Save, appliance will try validating the connection to the Hyper-V hosts/clusters added and show the **Validation status** in the table against each host/cluster.
    - For successfully validated hosts/clusters, you can view more details by clicking on their IP address/FQDN.
    - If validation fails for a host, review the error by clicking on **Validation failed** in the Status column of the table. Fix the issue, and validate again.
    - To remove hosts or clusters, click on **Delete**.
    - You can't remove a specific host from a cluster. You can only remove the entire cluster.
    - You can add a cluster, even if there are issues with specific hosts in the cluster.
1. You can **revalidate** the connectivity to hosts/clusters anytime before starting the discovery.

### Provide server credentials

In **Step 3: Provide server credentials to perform software inventory and agentless dependency analysis and to discover SQL Server instances and databases**, you can provide multiple server credentials. If you don't want to use any of these appliance features, you can skip this step and proceed with discovery of servers running on Hyper-V hosts/clusters. You can change this option at any time.

:::image type="content" source="./media/tutorial-discover-hyper-v/appliance-server-credentials-mapping.png" alt-text="Screenshot that shows providing credentials for software inventory and dependency analysis.":::

If you want to use these features, provide server credentials by completing the following steps. The appliance attempts to automatically map the credentials to the servers to perform the discovery features.

To add server credentials:

1. Select **Add Credentials**.
1. In the dropdown menu, select **Credentials type**.
    
    You can provide domain/, Windows(non-domain)/, Linux(non-domain) credentials. Learn how to [provide credentials](add-server-credentials.md) and how we handle them.
1. For each type of credentials, enter:
    * A friendly name.
    * A username.
    * A password.
    Select **Save**.

    If you choose to use domain credentials, you also must enter the FQDN for the domain. The FQDN is required to validate the authenticity of the credentials with the Active Directory instance in that domain.
1. Review the [required permissions](add-server-credentials.md#required-permissions) on the account for discovery of installed applications and agentless dependency analysis.
1. To add multiple credentials at once, select **Add more** to save credentials, and then add more credentials.
    When you select **Save** or **Add more**, the appliance validates the domain credentials with the domain's Active Directory instance for authentication. Validation is made after each addition to avoid account lockouts as during discovery, the appliance iterates to map credentials to respective servers.

To check validation of the domain credentials:

In the configuration manager, in the credentials table, see the **Validation status** for domain credentials. Only domain credentials are validated.

If validation fails, you can select the **Failed** status to see the validation error. Fix the issue, and then select **Revalidate credentials** to reattempt validation of the credentials.

:::image type="content" source="./media/tutorial-discover-hyper-v/add-server-credentials-multiple.png" alt-text="Screenshot that shows providing and validating multiple credentials.":::

### Start discovery

Click on **Start discovery**, to kick off server discovery from the successfully validated host(s)/cluster(s). After the discovery has been successfully initiated, you can check the discovery status against each host/cluster in the table.

## How discovery works

* It takes approximately 2 minutes per host for metadata of discovered servers to appear in the Azure portal.
* If you have provided server credentials, software inventory (discovery of installed applications) is automatically initiated when the discovery of servers running on Hyper-V host(s)/cluster(s) is finished. Software inventory occurs once every 12 hours.
* During software inventory, the added server credentials are iterated against servers and validated for agentless dependency analysis. When the discovery of servers is finished, in the portal, you can enable agentless dependency analysis on the servers. Only the servers on which validation succeeds can be selected to enable [agentless dependency analysis](how-to-create-group-machine-dependencies-agentless.md).

## Verify servers in the portal

After discovery finishes, you can verify that the servers appear in the portal.

1. Open the Azure Migrate dashboard.
2. In **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment** page, click the icon that displays the count for **Discovered servers**.

## Next steps

Try out [Hyper-V assessment](tutorial-assess-hyper-v.md) with Azure Migrate: Discovery and assessment.