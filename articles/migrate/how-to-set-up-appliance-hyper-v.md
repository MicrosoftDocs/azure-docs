---
title: Set up an Azure Migrate appliance for Hyper-V
description: Learn how to set up an Azure Migrate appliance to assess and migrate Hyper-V VMs.
ms.topic: article
ms.date: 03/23/2020
---


# Set up an appliance for Hyper-V VMs

Follow this article to set up the Azure Migrate appliance for assessment of Hyper-V VMs with the [Azure Migrate:Server Assessment](migrate-services-overview.md#azure-migrate-server-assessment-tool) tool.

The [Azure Migrate appliance](migrate-appliance.md)  is a lightweight appliance used by Azure Migrate:Server Assessment/Migration to discover on-premises Hyper-V VMs, and send VM metadata/performance data to Azure.

You can deploy the appliance using a couple of methods:

- Set up on a Hyper-V VM using a downloaded VHD. This is the method described in this article.
- Set up on a Hyper-V VM or physical machine with a PowerShell installer script. [This method](deploy-appliance-script.md) should be used if you can't set up a VM using a VHD, or if you're in Azure Government.

After creating the appliance, you check that it can connect to Azure Migrate:Server Assessment, configure it for the first time, and register it with the Azure Migrate project.

## Appliance deployment (VHD)

To set up the appliance using a VHD template:

- Provide an appliance name and generate an Azure Migrate project key in the portal.
- Download a compressed Hyper-V VHD from the Azure portal.
- Create the appliance, and check that it can connect to Azure Migrate Server Assessment.
- Configure the appliance for the first time, and register it with the Azure Migrate project using the Azure Migrate project key.

### Generate the Azure Migrate project key

1. In **Migration Goals** > **Servers** > **Azure Migrate: Server Assessment**, select **Discover**.
2. In **Discover machines** > **Are your machines virtualized?**, select **Yes, with Hyper-V**.
3. In **1:Generate Azure Migrate project key**, provide a name for the Azure Migrate appliance that you will set up for discovery of Hyper-V VMs.The name should be alphanumeric with 14 characters or fewer.
1. Click on **Generate key** to start the creation of the required Azure resources. Please do not close the Discover machines page during the creation of resources.
1. After the successful creation of the Azure resources, an **Azure Migrate project key** is generated.
1. Copy the key as you will need it to complete the registration of the appliance during its configuration.

### Download the VHD

In **2: Download Azure Migrate appliance**, select the .VHD file and click on **Download**. 

   ![Selections for Discover machines](./media/tutorial-assess-hyper-v/servers-discover.png)


   ![Selections for Generate Key](./media/tutorial-assess-hyper-v/generate-key-hyperv.png)


### Verify security

Check that the zipped file is secure, before you deploy it.

1. On the machine to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the VHD
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example usage: ```C:\>Get-FileHash -Path ./AzureMigrateAppliance_v3.20.09.25.zip -Algorithm SHA256```





## Create the appliance VM

Import the downloaded file, and create the VM.

1. Extract the zipped VHD file to a folder on the Hyper-V host that will host the appliance VM. Three folders are extracted.
2. Open Hyper-V Manager. In **Actions**, click **Import Virtual Machine**.

    ![Deploy VHD](./media/how-to-set-up-appliance-hyper-v/deploy-vhd.png)

2. In the Import Virtual Machine Wizard > **Before you begin**, click **Next**.
3. In **Locate Folder**, specify the folder containing the extracted VHD. Then click **Next**.
1. In **Select Virtual Machine**, click **Next**.
2. In **Choose Import Type**, click **Copy the virtual machine (create a new unique ID)**. Then click **Next**.
3. In **Choose Destination**, leave the default setting. Click **Next**.
4. In **Storage Folders**, leave the default setting. Click **Next**.
5. In **Choose Network**, specify the virtual switch that the VM will use. The switch needs internet connectivity to send data to Azure.
6. In **Summary**, review the settings. Then click **Finish**.
7. In Hyper-V Manager > **Virtual Machines**, start the VM.


### Verify appliance access to Azure

Make sure that the appliance VM can connect to Azure URLs for [public](migrate-appliance.md#public-cloud-urls) and [government](migrate-appliance.md#government-cloud-urls) clouds.

### Configure the appliance

Set up the appliance for the first time.

> [!NOTE]
> If you set up the appliance using a [PowerShell script](deploy-appliance-script.md) instead of the downloaded VHD, the first two steps in this procedure aren't relevant.

1. In Hyper-V Manager > **Virtual Machines**, right-click the VM > **Connect**.
2. Provide the language, time zone, and password for the appliance.
3. Open a browser on any machine that can connect to the VM, and open the URL of the appliance web app: **https://*appliance name or IP address*: 44368**.

   Alternately, you can open the app from the appliance desktop by clicking the app shortcut.
1. Accept the **license terms**, and read the third-party information.
1. In the web app > **Set up prerequisites**, do the following:
    - **Connectivity**: The app checks that the VM has internet access. If the VM uses a proxy:
      - Click on **Set up proxy** to and specify the proxy address (in the form http://ProxyIPAddress or http://ProxyFQDN) and listening port.
      - Specify credentials if the proxy needs authentication.
      - Only HTTP proxy is supported.
      - If you have added proxy details or disabled the proxy and/or authentication, click on **Save** to trigger connectivity check again.
    - **Time sync**: Time is verified. The time on the appliance should be in sync with internet time for VM discovery to work properly.
    - **Install updates**: Azure Migrate Server Assessment checks that the appliance has the latest updates installed.After the check completes, you can click on **View appliance services** to see the status and versions of the components running on the appliance.

### Register the appliance with Azure Migrate

1. Paste the **Azure Migrate project key** copied from the portal. If you do not have the key, go to **Server Assessment> Discover> Manage existing appliances**, select the appliance name you provided at the time of key generation and copy the corresponding key.
1. Click on **Log in**. It will open an Azure login prompt in a new browser tab. If it doesn't appear, make sure you've disabled the pop-up blocker in the browser.
1. On the new tab, sign in by using your Azure username and password.
   
   Sign-in with a PIN isn't supported.
3. After you successfully logged in, go back to the web app. 
4. If the Azure user account used for logging has the right [permissions](./tutorial-discover-hyper-v.md#prepare-azure) on the Azure resources created during key generation, the appliance registration will be initiated.
1. After appliance is successfully registered, you can see the registration details by clicking on **View details**.



### Delegate credentials for SMB VHDs

If you're running VHDs on SMBs, you must enable delegation of credentials from the appliance to the Hyper-V hosts. To do this from the appliance:

1. On the appliance VM, run this command. HyperVHost1/HyperVHost2 are example host names.

    ```
    Enable-WSManCredSSP -Role Client -DelegateComputer HyperVHost1.contoso.com, HyperVHost2.contoso.com, HyperVHost1, HyperVHost2 -Force
    ```

2. Alternatively, do this in the Local Group Policy Editor on the appliance:
    - In **Local Computer Policy** > **Computer Configuration**, click **Administrative Templates** > **System** > **Credentials Delegation**.
    - Double-click **Allow delegating fresh credentials**, and select **Enabled**.
    - In **Options**, click **Show**, and add each Hyper-V host you want to discover to the list, with **wsman/** as a prefix.
    - In  **Credentials Delegation**, double-click **Allow delegating fresh credentials with NTLM-only server authentication**. Again, add each Hyper-V host you want to discover to the list, with **wsman/** as a prefix.

## Start continuous discovery

Connect from the appliance to Hyper-V hosts or clusters, and start VM discovery.

1. In **Step 1: Provide Hyper-V host credentials**, click on **Add credentials** to  specify a friendly name for credentials, add **Username** and **Password** for a Hyper-V host/cluster that the appliance will use to discover VMs. Click on **Save**.
1. If you want to add multiple credentials at once,click on **Add more** to save and add more credentials. Multiple credentials are supported for Hyper-V VMs discovery.
1. In **Step 2: Provide Hyper-V host/cluster details**, click on **Add discovery source** to specify the Hyper-V host/cluster **IP address/FQDN** and the friendly name for credentials to connect to the host/cluster.
1. You can either **Add single item** at a time or **Add multiple items** in one go. There is also an option to provide Hyper-V host/cluster details through **Import CSV**.

    ![Selections for adding discovery source](./media/tutorial-assess-hyper-v/add-discovery-source-hyperv.png)

    - If you choose **Add single item**, you need to specify friendly name for credentials and Hyper-V host/cluster **IP address/FQDN** and click on **Save**.
    - If you choose **Add multiple items** _(selected by default)_, you can add multiple records at once by specifying Hyper-V host/cluster **IP address/FQDN** with the friendly name for credentials in the text box.**Verify** the added records and click on **Save**.
    - If you choose **Import CSV**, you can download a CSV template file, populate the file with the Hyper-V host/cluster **IP address/FQDN** and friendly name for credentials. You then import the file into the appliance, **verify** the records in the file and click on **Save**.

1. On clicking Save, appliance will try validating the connection to the Hyper-V hosts/clusters added and show the **Validation status** in the table against each host/cluster.
    - For successfully validated hosts/clusters, you can view more details by clicking on their IP address/FQDN.
    - If validation fails for a host, review the error by clicking on **Validation failed** in the Status column of the table. Fix the issue, and validate again.
    - To remove hosts or clusters, click on **Delete**.
    - You can't remove a specific host from a cluster. You can only remove the entire cluster.
    - You can add a cluster, even if there are issues with specific hosts in the cluster.
1. You can **revalidate** the connectivity to hosts/clusters any time before starting the discovery.
1. Click on **Start discovery**, to kick off VM discovery from the successfully validated hosts/clusters. After the discovery has been successfully initiated, you can check the discovery status against each host/cluster in the table.

This starts discovery. It takes approximately 2 minutes per host for metadata of discovered servers to appear in the Azure portal.

## Verify VMs in the portal

After discovery finishes, you can verify that the VMs appear in the portal.

1. Open the Azure Migrate dashboard.
2. In **Azure Migrate - Servers** > **Azure Migrate: Server Assessment** page, click the icon that displays the count for **Discovered servers**.


## Next steps

Try out [Hyper-V assessment](tutorial-assess-hyper-v.md) with Azure Migrate Server Assessment.