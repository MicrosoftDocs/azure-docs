---
title: Set up an Azure Migrate appliance for VMware 
description: Learn how to set up an Azure Migrate appliance to assess and migrate VMware VMs.
ms.topic: article
ms.date: 04/16/2020
---


# Set up an appliance for VMware VMs

Follow this article to set up the Azure Migrate appliance for assessment with the [Azure Migrate:Server Assessment](migrate-services-overview.md#azure-migrate-server-assessment-tool) tool, and for agentless migration using the [Azure Migrate:Server Migration](migrate-services-overview.md#azure-migrate-server-migration-tool) tool.

The [Azure Migrate appliance](migrate-appliance.md) is a lightweight appliance used by Azure Migrate:Server Assessment and Server Migration to discover on-premises VMware VMs, send VM metadata/performance data to Azure, and for replication of VMware VMs during agentless migration.

You can deploy the appliance using a couple of methods:

- Set up on a VMware VM using a downloaded OVA template. This is the method described in this article.
- Set up on a VMware VM or physical machine with a PowerShell installer script. [This method](deploy-appliance-script.md) should be used if you can't set up a VM using an OVA template, or if you're in Azure government.

After creating the appliance, you check that it can connect to Azure Migrate:Server Assessment, configure it for the first time, and register it with the Azure Migrate project.


## Appliance deployment (OVA)

To set up the appliance using an OVA template you:
- Provide an appliance name and generate an Azure Migrate project key in the portal
- Download an OVA template file, and import it to vCenter Server.
- Create the appliance, and check that it can connect to Azure Migrate Server Assessment.
- Configure the appliance for the first time, and register it with the Azure Migrate project using the Azure Migrate project key.

### Generate the Azure Migrate project key

1. In **Migration Goals** > **Servers** > **Azure Migrate: Server Assessment**, select **Discover**.
2. In **Discover machines** > **Are your machines virtualized?**, select **Yes, with VMware vSphere hypervisor**.
3. In **1:Generate Azure Migrate project key**, provide a name for the Azure Migrate appliance that you will set up for discovery of VMware VMs.The name should be alphanumeric with 14 characters or fewer.
1. Click on **Generate key** to start the creation of the required Azure resources. Please do not close the Discover machines page during the creation of resources.
1. After the successful creation of the Azure resources, an **Azure Migrate project key** is generated.
1. Copy the key as you will need it to complete the registration of the appliance during its configuration.

### Download the OVA template
In **2: Download Azure Migrate appliance**, select the .OVA file and click on **Download**. 


   ![Selections for Discover machines](./media/tutorial-assess-vmware/servers-discover.png)


   ![Selections for Generate Key](./media/tutorial-assess-vmware/generate-key-vmware.png)

### Verify security

Check that the OVA file is secure, before you deploy it.

1. On the machine to which you downloaded the file, open an administrator command window.
2. Run the following command, to generate the hash for the OVA:
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example usage: ```C:\>CertUtil -HashFile C:\AzureMigrate\AzureMigrate.ova SHA256```
3. For the latest appliance version, the generated hash should match these [settings](./tutorial-assess-vmware.md#verify-security).



## Create the appliance VM

Import the downloaded file, and create a VM.

1. In the vSphere Client console, click **File** > **Deploy OVF Template**.
![Menu command for deploying an OVF template](./media/tutorial-assess-vmware/deploy-ovf.png)

2. In the Deploy OVF Template Wizard > **Source**, specify the location of the OVA file.
3. In **Name** and **Location**, specify a friendly name for the VM. Select the inventory object in which the VM
will be hosted.
5. In **Host/Cluster**, specify the host or cluster on which the VM will run.
6. In **Storage**, specify the storage destination for the VM.
7. In **Disk Format**, specify the disk type and size.
8. In **Network Mapping**, specify the network to which the  VM will connect. The network needs internet connectivity, to send metadata to Azure Migrate Server Assessment.
9. Review and confirm the settings, then click **Finish**.


## Verify appliance access to Azure

Make sure that the appliance VM can connect to Azure URLs for [public](migrate-appliance.md#public-cloud-urls) and [government](migrate-appliance.md#government-cloud-urls) clouds.


### Configure the appliance

Set up the appliance for the first time.

> [!NOTE]
> If you set up the appliance using a [PowerShell script](deploy-appliance-script.md) instead of the downloaded OVA, the first two steps in this procedure aren't relevant.

1. In the vSphere Client console, right-click the VM, and then select **Open Console**.
2. Provide the language, time zone, and password for the appliance.
3. Open a browser on any machine that can connect to the VM, and open the URL of the appliance web app: **https://*appliance name or IP address*: 44368**.

   Alternately, you can open the app from the appliance desktop by selecting the app shortcut.
1. Accept the **license terms**, and read the third-party information.
1. In the web app > **Set up prerequisites**, do the following:
   - **Connectivity**: The app checks that the VM has internet access. If the VM uses a proxy:
     - Click on **Set up proxy** to specify the proxy address (in the form http://ProxyIPAddress or http://ProxyFQDN) and listening port.
     - Specify credentials if the proxy needs authentication.
     - Only HTTP proxy is supported.
     - If you have added proxy details or disabled the proxy and/or authentication, click on **Save** to trigger connectivity check again.
   - **Time sync**: The time on the appliance should be in sync with internet time for discovery to work properly.
   - **Install updates**: The appliance ensures that the latest updates are installed. After the check completes, you can click on **View appliance services** to see the status and versions of the components running on the appliance.
   - **Install VDDK**: The appliance checks that VMware vSphere Virtual Disk Development Kit (VDDK) is installed. If it isn't installed, download VDDK 6.7 from VMware, and extract the downloaded zip contents to the specified location on the appliance, as provided in the **Installation instructions**.

     Azure Migrate Server Migration uses the VDDK to replicate machines during migration to Azure. 
1. If you want, you can **rerun prerequisites** at any time during appliance configuration to check if the appliance meets all the prerequisites.

### Register the appliance with Azure Migrate

1. Paste the **Azure Migrate project key** copied from the portal. If you do not have the key, go to **Server Assessment> Discover> Manage existing appliances**, select the appliance name you provided at the time of key generation and copy the corresponding key.
1. Click on **Log in**. It will open an Azure login prompt in a new browser tab. If it doesn't appear, make sure you've disabled the pop-up blocker in the browser.
1. On the new tab, sign in by using your Azure username and password.
   
   Sign-in with a PIN isn't supported.
3. After you successfully logged in, go back to the web app. 
4. If the Azure user account used for logging has the right [permissions](tutorial-prepare-vmware.md#prepare-azure) on the Azure resources created during key generation, the appliance registration will be initiated.
1. After appliance is successfully registered, you can see the registration details by clicking on **View details**.


## Start continuous discovery

The appliance needs to connect to vCenter Server to discover the configuration and performance data of the VMs.

1. In **Step 1: Provide vCenter Server credentials**, click on **Add credentials** to  specify a friendly name for credentials, add **Username** and **Password** for the vCenter Server account that the appliance will use to discover VMs on the vCenter Server instance.
    - You should have set up an account with the required permissions in the [previous tutorial](tutorial-prepare-vmware.md#set-up-permissions-for-assessment).
    - If you want to scope discovery to specific VMware objects (vCenter Server datacenters, clusters, a folder of clusters, hosts, a folder of hosts, or individual VMs.), review the instructions in [this article](set-discovery-scope.md) to restrict the account used by Azure Migrate.
1. In **Step 2: Provide vCenter Server details**, click on **Add discovery source** to select the friendly name for credentials from the drop-down, specify the **IP address/FQDN** of the vCenter Server instance. You can leave the **Port** to default (443) or specify a custom port on which vCenter Server listens and click on **Save**.
1. On clicking Save, appliance will try validating the connection to the vCenter Server with the credentials provided and show the **Validation status** in the table against the vCenter Server IP address/FQDN.
1. You can **revalidate** the connectivity to vCenter Server any time before starting the discovery.
1. In **Step 3: Provide VM credentials to discover installed applications and to perform agentless dependency mapping**, click **Add credentials**, and specify the operating system for which the credentials are provided, friendly name for credentials and the **Username** and **Password**. Then click on **Save**.

    - You optionally add credentials here if you've created an account to use for the [application discovery feature](how-to-discover-applications.md), or the [agentless dependency analysis feature](how-to-create-group-machine-dependencies-agentless.md).
    - If you do not want to use these features, you can click on the slider to skip the step. You can reverse the intent any time later.
    - Review the credentials needed for [application discovery](migrate-support-matrix-vmware.md#application-discovery-requirements), or for [agentless dependency analysis](migrate-support-matrix-vmware.md#dependency-analysis-requirements-agentless).

5. Click on **Start discovery**, to kick off VM discovery. After the discovery has been successfully initiated, you can check the discovery status against the vCenter Server IP address/FQDN in the table.

Discovery works as follows:
- It takes around 15 minutes for discovered VM metadata to appear in the portal.
- Discovery of installed applications, roles, and features takes some time. The duration depends on the number of VMs being discovered. For 500 VMs, it takes approximately one hour for the application inventory to appear in the Azure Migrate portal.

## Next steps

Review the tutorials for [VMware assessment](tutorial-assess-vmware.md) and [agentless migration](tutorial-migrate-vmware.md).
