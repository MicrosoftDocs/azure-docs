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
- Download an OVA template file, and import it to vCenter Server.
- Create the appliance, and check that it can connect to Azure Migrate Server Assessment.
- Configure the appliance for the first time, and register it with the Azure Migrate project.

## Download the OVA template

1. In **Migration Goals** > **Servers** > **Azure Migrate: Server Assessment**, click **Discover**.
2. In **Discover machines** > **Are your machines virtualized?**, click **Yes, with VMWare vSphere hypervisor**.
3. Click **Download** to download the .OVA template file.

  ![Selections for downloading an OVA file](./media/tutorial-assess-vmware/download-ova.png)

### Verify security

Check that the OVA file is secure, before you deploy it.

1. On the machine to which you downloaded the file, open an administrator command window.
2. Run the following command, to generate the hash for the OVA:
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example usage: ```C:\>CertUtil -HashFile C:\AzureMigrate\AzureMigrate.ova SHA256```
3. For the latest appliance version, the generated hash should match these [settings](https://docs.microsoft.com/azure/migrate/tutorial-assess-vmware#verify-security).



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


## Configure the appliance

Set up the appliance for the first time. If you deploy the appliance using a script instead of an OVA template, the first two steps in the procedure aren't applicable.

1. In the vSphere Client console, right-click the VM > **Open Console**.
2. Provide the language, time zone, and password for the appliance.
3. Open a browser on any machine that can connect to the VM, and open the URL of the appliance web app: **https://*appliance name or IP address*: 44368**.

   Alternately, you can open the app from the appliance desktop by clicking the app shortcut.
4. In the web app > **Set up prerequisites**, do the following:
    - **License**: Accept the license terms, and read the third-party information.
    - **Connectivity**: The app checks that the VM has internet access. If the VM uses a proxy:
        - Click **Proxy settings**, and specify the proxy address and listening port, in the form http://ProxyIPAddress or http://ProxyFQDN.
        - Specify credentials if the proxy needs authentication.
        - Only HTTP proxy is supported.
    - **Time sync**: Time is verified. The time on the appliance should be in sync with internet time for discovery to work properly.
    - **Install updates**: Azure Migrate checks that the latest appliance updates are installed.
    - **Install VDDK**: Azure Migrate checks that the VMWare vSphere Virtual Disk Development Kit (VDDK) is installed.
        - Azure Migrates uses the VDDK to replicate machines during migration to Azure.
        - Download VDDK 6.7 from VMware, and extract the downloaded zip contents to the specified location on the appliance.

## Register the appliance with Azure Migrate

1. Click **Log In**. If it doesn't appear, make sure you've disabled the pop-up blocker in the browser.
2. On the new tab, sign in using your Azure credentials.
    - Sign in with your username and password.
    - Sign in with a PIN isn't supported.
3. After successfully signing in, go back to the web app.
2. Select the subscription in which the Azure Migrate project was created. Then select the project.
3. Specify a name for the appliance. The name should be alphanumeric with 14 characters or less.
4. Click **Register**.


## Start continuous discovery by providing vCenter Server and VM credential

The appliance needs to connect to vCenter Server to discover the configuration and performance data of the VMs.

### Specify vCenter Server details
1. In **Specify vCenter Server details**, specify the name (FQDN) or IP address of the vCenter Server. You can leave the default port, or specify a custom port on which your vCenter Server listens.
2. In **User name** and **Password**, specify the read-only account credentials that the appliance will use to discover VMs on the vCenter server. You can scope the discovery by limiting access to the vCenter account. [Learn more](set-discovery-scope.md).
3. Click **Validate connection** to make sure that the appliance can connect to vCenter Server.

### Specify VM credentials
For discovery of applications, roles and features and visualizing dependencies of the VMs, you can provide a VM credential that has access to the VMware VMs. You can add one credential for Windows VMs and one credential for Linux VMs. [Learn more](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-vmware) about the access privileges needed.

> [!NOTE]
> This input is optional and is needed to enable application discovery and agentless dependency visualization.

1. In **Discover applications and dependencies on VMs**, click **Add credentials**.
2. Select the **Operating System**.
3. Provide a friendly name for the credential.
4. In **Username** and **Password**, specify an account that has at least guest access on the VMs.
5. Click **Add**.

Once you have specified the vCenter Server and VM credentials (optional), click **Save and start discovery** to start discovery of the on-premises environment.

It takes around 15 minutes for metadata of discovered VMs to appear in the portal. Discovery of installed applications, roles, and features takes some time, the duration depends on the number of VMs being discovered. For 500 VMs, it takes approximately 1 hour for the application inventory to appear in the Azure Migrate portal.

## Next steps

Review the tutorials for [VMware assessment](tutorial-assess-vmware.md) and [agentless migration](tutorial-migrate-vmware.md).
