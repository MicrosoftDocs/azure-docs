---
title: Discover and assess using Azure Private Link
description: Create an Azure Migrate project, set up the Azure Migrate appliance, and use it to discover and assess servers for migration.
author: deseelam
ms.author: deseelam
ms.manager: bsiva
ms.topic: how-to
ms.date: 12/29/2021
---
 
# Discover and assess servers for migration using Private Link

This article describes how to create an Azure Migrate project, set up the Azure Migrate appliance, and use it to discover and assess servers for migration using [Azure Private Link](../private-link/private-endpoint-overview.md).  You can use the [Azure Migrate: Discovery and assessment](migrate-services-overview.md#azure-migrate-discovery-and-assessment-tool) tool to connect privately and securely to Azure Migrate over an Azure ExpressRoute private peering or a site-to-site (S2S) VPN connection by using Private Link.

## Create a project with private endpoint connectivity

To set up a new Azure Migrate project, see [Create and manage projects](./create-manage-projects.md#create-a-project-for-the-first-time).

> [!Note]
> You can't change the connectivity method to private endpoint connectivity for existing Azure Migrate projects.

In the **Advanced** configuration section, provide the following details to create a private endpoint for your Azure Migrate project.
1. In **Connectivity method**, choose **Private endpoint**.
1. In **Disable public endpoint access**, keep the default setting **No**. Some migration tools might not be able to upload usage data to the Azure Migrate project if public network access is disabled. Learn more about [other integrated tools](how-to-use-azure-migrate-with-private-endpoints.md#other-integrated-tools).
1. In **Virtual network subscription**, select the subscription for the private endpoint virtual network.
1. In **Virtual network**, select the virtual network for the private endpoint. The Azure Migrate appliance and other software components that need to connect to the Azure Migrate project must be on this network or a connected virtual network.
1. In **Subnet**, select the subnet for the private endpoint.

   ![Screenshot that shows the Advanced section on the Create project page.](./media/how-to-use-azure-migrate-with-private-endpoints/create-project.png)

1. Select **Create** to create a migration project and attach a private endpoint to it. Wait a few minutes for the Azure Migrate project to deploy. Don't close this page while the project creation is in progress.

> [!Note]
> If you've already created a project, you can use that project to register more appliances to discover and assess more servers. Learn how to [manage projects](create-manage-projects.md#find-a-project). 

## Set up the Azure Migrate appliance

1. In **Discover machines** > **Are your machines virtualized?**, select the virtualization server type.
1. In **Generate Azure Migrate project key**, provide a name for the Azure Migrate appliance.
1. Select **Generate key** to create the required Azure resources.

    > [!Important]
    > Don't close the **Discover machines** page during the creation of resources.
    - At this step, Azure Migrate creates a key vault, a storage account, a Recovery Services vault (only for agentless VMware migrations), and a few internal resources. Azure Migrate attaches a private endpoint to each resource. The private endpoints are created in the virtual network selected during the project creation.
    - After the private endpoints are created, the DNS CNAME resource records for the Azure Migrate resources are updated to an alias in a subdomain with the prefix *privatelink*. By default, Azure Migrate also creates a private DNS zone corresponding to the *privatelink* subdomain for each resource type and inserts DNS A records for the associated private endpoints. This action enables the Azure Migrate appliance and other software components that reside in the source network to reach the Azure Migrate resource endpoints on private IP addresses.
    - Azure Migrate also enables a [managed identity](../active-directory/managed-identities-azure-resources/overview.md) for the migrate project and the Recovery Services vault and grants permissions to the managed identity to securely access the storage account.

1. After the key is successfully generated, copy the key details to configure and register the appliance.

### Download the appliance installer file

Azure Migrate: Discovery and assessment use a lightweight Azure Migrate appliance. The appliance performs server discovery and sends server configuration and performance metadata to Azure Migrate.

> [!Note]
> If you have deployed an appliance using a template (OVA for servers on a VMware environment and VHD for a Hyper-V environment), you can use the same appliance and register it with an Azure Migrate project with private endpoint connectivity.

To set up the appliance:
  1. Download the zipped file that contains the installer script from the portal.
  1. Copy the zipped file on the server that will host the appliance.
  1. After you download the zipped file, verify the file security.
  1. Run the installer script to deploy the appliance.

### Verify security

Check that the zipped file is secure, before you deploy it.

1. On the server to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the zipped file:
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example usage: ```C:\>CertUtil -HashFile C:\Users\administrator\Desktop\AzureMigrateInstaller.zip SHA256 ```
3.  Verify the latest appliance version and hash value:

    **Download** | **Hash value**
    --- | ---
    [Latest version](https://go.microsoft.com/fwlink/?linkid=2160648) | 30d4f4e06813ceb83602a220fc5fe2278fa6aafcbaa36a40a37f3133f882ee8c

> [!NOTE]
> The same script can be used to set up an appliance with private endpoint connectivity for any of the chosen scenarios, such as VMware, Hyper-V, physical or other to deploy an appliance with the desired configuration.

Make sure the server meets the [hardware requirements](./migrate-appliance.md) for the chosen scenario, such as VMware, Hyper-V, physical or other, and can connect to the [required URLs](./migrate-appliance.md#public-cloud-urls-for-private-link-connectivity).

### Run the Azure Migrate installer script

1. Extract the zipped file to a folder on the server that will host the appliance.  Make sure you don't run the script on a server with an existing Azure Migrate appliance.

2. Launch PowerShell on the above server with administrative (elevated) privilege.

3. Change the PowerShell directory to the folder where the contents have been extracted from the downloaded zipped file.

4. Run the script named `AzureMigrateInstaller.ps1` by running the following command:

   `PS C:\Users\administrator\Desktop\AzureMigrateInstaller> .\AzureMigrateInstaller.ps1`

5. Select from the scenario, cloud and connectivity options to deploy an appliance with the desired configuration. For instance, the selection shown below sets up an appliance to discover and assess **servers running in your VMware environment** to an Azure Migrate project with **private endpoint connectivity** on **Azure public cloud**.

   :::image type="content" source="./media/how-to-use-azure-migrate-with-private-endpoints/script-vmware-private-inline.png" alt-text="Screenshot that shows how to set up appliance with desired configuration for private endpoint." lightbox="./media/how-to-use-azure-migrate-with-private-endpoints/script-vmware-private-expanded.png":::

After the script has executed successfully, the appliance configuration manager will be launched automatically.

> [!NOTE]
> If you come across any issues, you can access the script logs at C:\ProgramData\Microsoft Azure\Logs\AzureMigrateScenarioInstaller_<em>Timestamp</em>.log for troubleshooting.

## Configure the appliance and start continuous discovery

Open a browser on any machine that can connect to the appliance server. Open the URL of the appliance configuration manager, `https://appliance name or IP address: 44368`. Or, you can open the configuration manager from the appliance server desktop by selecting the shortcut for the configuration manager.

### Set up prerequisites

1. Read the third-party information, and accept the **license terms**.

1. In the configuration manager under **Set up prerequisites**, do the following:
   - **Connectivity**: The appliance checks for access to the required URLs. If the server uses a proxy:
     - Select **Set up proxy** to specify the proxy address `http://ProxyIPAddress` or `http://ProxyFQDN` and listening port.
     - Specify credentials if the proxy needs authentication. Only HTTP proxy is supported.
     - You can add a list of URLs or IP addresses that should bypass the proxy server.
        ![Adding to bypass proxy list](./media/how-to-use-azure-migrate-with-private-endpoints/bypass-proxy-list.png)
     - Select **Save** to register the configuration if you've updated the proxy server details or added URLs or IP addresses to bypass proxy.

        > [!Note]
        > If you get an error with the aka.ms/* link during the connectivity check and you don't want the appliance to access this URL over the internet, disable the auto-update service on the appliance. Follow the steps in [Turn off auto-update](./migrate-appliance.md#turn-off-auto-update). After you've disabled auto-update, the aka.ms/* URL connectivity check will be skipped.

   - **Time sync**: The time on the appliance should be in sync with internet time for discovery to work properly.
   - **Install updates**: The appliance ensures that the latest updates are installed. After the check completes, select **View appliance services** to see the status and versions of the services running on the appliance server.
        > [!Note]
        > If you disabled auto-update on the appliance, you can update the appliance services manually to get the latest versions of the services. Follow the steps in [Manually update an older version](./migrate-appliance.md#manually-update-an-older-version).
   - **Install VDDK**: _(Needed only for VMware appliance.)_ The appliance checks that the VMware vSphere Virtual Disk Development Kit (VDDK) is installed. If it isn't installed, download VDDK 6.7 from VMware. Extract the downloaded zipped contents to the specified location on the appliance, as provided in the installation instructions.

### Register the appliance and start continuous discovery

After the prerequisites check has completed, follow the steps to register the appliance and start continuous discovery for the respective scenarios:
- [VMware VMs](./tutorial-discover-vmware.md#register-the-appliance-with-azure-migrate)
- [Hyper-V VMs](./tutorial-discover-hyper-v.md#register-the-appliance-with-azure-migrate)
- [Physical servers](./tutorial-discover-physical.md#register-the-appliance-with-azure-migrate)
- [AWS VMs](./tutorial-discover-aws.md#register-the-appliance-with-azure-migrate)
- [GCP VMs](./tutorial-discover-gcp.md#register-the-appliance-with-azure-migrate)

>[!Note]
> If you get DNS resolution issues during appliance registration or at the time of starting discovery, ensure that Azure Migrate resources created during the **Generate key** step in the portal are reachable from the on-premises server that hosts the Azure Migrate appliance. Learn more about how to verify [network connectivity](./troubleshoot-network-connectivity.md).

## Assess your servers for migration to Azure
After the discovery is complete, assess your servers, such as [VMware VMs](./tutorial-assess-vmware-azure-vm.md), [Hyper-V VMs](./tutorial-assess-hyper-v.md), [physical servers](./tutorial-assess-vmware-azure-vm.md), [AWS VMs](./tutorial-assess-aws.md), and [GCP VMs](./tutorial-assess-gcp.md), for migration to Azure VMs or Azure VMware Solution by using the Azure Migrate: Discovery and assessment tool.

You can also [assess your on-premises machines](./tutorial-discover-import.md#prepare-the-csv) with the Azure Migrate: Discovery and assessment tool by using an imported CSV file.

## Next steps

- [Migrate servers to Azure using Private Link](migrate-servers-to-azure-using-private-link.md).