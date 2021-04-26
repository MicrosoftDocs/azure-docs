---
title: Deploy and configure VMware HCX
description: Learn how to deploy and configure a VMware HCX solution for your Azure VMware Solution private cloud.
ms.topic: tutorial
ms.date: 04/23/2021
---

# Deploy and configure VMware HCX

In this tutorial, you'll deploy and configure the on-premises VMware HCX Connector for your Azure VMware Solution private cloud. With VMware HCX, you can migrate your VMware workloads to Azure VMware Solution and other connected sites through various migration types. Because Azure VMware Solution deploys and configures HCX Cloud Manager, you must download, activate, and configure the HCX Connector in your on-premises VMware datacenter.

VMware HCX Advanced Connector is pre-deployed in Azure VMware Solution. It supports up to three site connections (on-premises to cloud, or cloud to cloud). If you need more than three site connections, use the [VMware HCX Enterprise](https://cloud.vmware.com/community/2019/08/08/introducing-hcx-enterprise/) add-on and then have it enabled through a [support request](https://portal.azure.com/#create/Microsoft.Support). 

>[!IMPORTANT]
>Although the VMware Configuration Maximum tool describes site pairs maximum to be 25 between the on-premises HCX Connector and HCX Cloud Manager, licensing limits this to three for HCX Advanced and 10 for HCX Enterprise Edition.
>
>VMware HCX Enterprise is available with Azure VMware Solution as a preview service. It's free and is subject to terms and conditions for a preview service. After the VMware HCX Enterprise service is generally available, you'll get a 30-day notice that billing will switch over. You'll also have the option to turn off or opt out of the service. Downgrading from HCX Enterprise to HCX Advanced is possible without redeploying, but you'll have to log a support ticket for that action to take place. If planning a downgrade, make sure no migrations are scheduled and features such as RAV, MON are not in use.

First, review [Before you begin](#before-you-begin), [Software version requirements](https://docs.vmware.com/en/VMware-HCX/services/user-guide/GUID-54E5293B-8707-4D29-BFE8-EE63539CC49B.html), and the [Prerequisites](#prerequisites) sections. 

Then, we'll walk through all the necessary procedures to:

> [!div class="checklist"]
> * Download the VMware HCX Connector OVA.
> * Deploy the on-premises VMware HCX OVA (VMware HCX Connector).
> * Activate the VMware HCX Connector.
> * Pair your on-premises VMware HCX Connector with your Azure VMware Solution HCX Cloud Manager.
> * Configure the interconnect (network profile, compute profile, and service mesh).
> * Complete setup by checking the appliance status and validating that migration is possible.

After you're finished, follow the recommended next steps at the end of this article.  

## Before you begin

As you prepare your deployment, we recommend that you review the following VMware documentation:

* [VMware HCX user guide](https://docs.vmware.com/en/VMware-HCX/services/user-guide/GUID-E456F078-22BE-494B-8E4B-076EF33A9CF4.html)
* [Migrating Virtual Machines with VMware HCX](https://docs.vmware.com/en/VMware-HCX/services/user-guide/GUID-D0CD0CC6-3802-42C9-9718-6DA5FEC246C6.html?hWord=N4IghgNiBcIBIGEAaACAtgSwOYCcwBcMB7AOxAF8g)
* [VMware HCX Deployment Considerations](https://docs.vmware.com/en/VMware-HCX/services/install-checklist/GUID-C0A0E820-D5D0-4A3D-AD8E-EEAA3229F325.html)
* [VMware blog series - cloud migration](https://blogs.vmware.com/vsphere/2019/10/cloud-migration-series-part-2.html) 
* [Network ports required for VMware HCX](https://ports.vmware.com/home/VMware-HCX)


## Prerequisites

If you plan to use VMware HCX Enterprise, make sure you've enabled the [VMware HCX Enterprise](https://cloud.vmware.com/community/2019/08/08/introducing-hcx-enterprise/) add-on through a [support request](https://portal.azure.com/#create/Microsoft.Support).

### On-premises vSphere environment

Make sure that your on-premises vSphere environment (source environment) meets the [minimum requirements](https://docs.vmware.com/en/VMware-HCX/services/user-guide/GUID-54E5293B-8707-4D29-BFE8-EE63539CC49B.html). 

### Network and ports

* [Azure ExpressRoute Global Reach](tutorial-expressroute-global-reach-private-cloud.md) is configured between on-premises and Azure VMware Solution private cloud ExpressRoute circuits.

* [All required ports](https://ports.vmware.com/home/VMware-HCX) are open for communication between on-premises components and Azure VMware Solution private.

### IP addresses

[!INCLUDE [hcx-network-segments](includes/hcx-network-segments.md)]
   
## Step 1. Download the VMware HCX Connector OVA

Before you deploy the virtual appliance to your on-premises vCenter, you must download the VMware HCX Connector OVA.  

1. In the Azure portal, select the Azure VMware Solution private cloud. 

1. Select **Manage** > **Connectivity** and select the **HCX** tab to identify the Azure VMware Solution HCX Manager's IP address. 

   :::image type="content" source="media/tutorial-vmware-hcx/find-hcx-ip-address.png" alt-text="Screenshot of the VMware HCX IP address." lightbox="media/tutorial-vmware-hcx/find-hcx-ip-address.png":::

1. Select **Manage** > **Identity**. 

   The URLs and user credentials for private cloud vCenter and NSX-T Manager display.

   > [!TIP]
   > The vCenter password was defined when you set up the private cloud. It's the same password you'll use to sign in to Azure VMware Solution HCX Manager. You can select **Generate a new password** to generate new vCenter and NSX-T passwords.

   :::image type="content" source="media/tutorial-access-private-cloud/ss4-display-identity.png" alt-text="Display private cloud vCenter and NSX Manager URLs and credentials." border="true":::


1. Open a browser window, sign in to the Azure VMware Solution HCX Manager on `https://x.x.x.9` port 443 with the **cloudadmin\@vsphere.local** user credentials

1. Select **Administration** > **System Updates** and then select **Request Download Link**.

1. Select the option of your choice to download the VMware HCX Connector OVA file.

## Step 2. Deploy the VMware HCX Connector OVA on-premises

1. In your on-premises vCenter, select an [OVF template](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.vm_admin.doc/GUID-17BEDA21-43F6-41F4-8FB2-E01D275FE9B4.html) to deploy the VMware HCX Connector to your on-premises vCenter. 

1. Navigate to and select the OVA file that you downloaded and then select **Open**.

   :::image type="content" source="media/tutorial-vmware-hcx/select-ovf-template.png" alt-text="Screenshot of browsing to an OVF template." lightbox="media/tutorial-vmware-hcx/select-ovf-template.png":::


1. Select a name and location, and select a resource or cluster where you're deploying the VMware HCX Connector. Then review the details and required resources and select **Next**.  

1. Review license terms. If you agree, select the required storage and network, and then select **Next**.

1. Select storage and select **Next**.

1. Select the VMware HCX management network segment you previously defined in the [IP addresses prerequisites](#ip-addresses) section.  Then, select **Next**.

1. In **Customize template**, enter all required information and then select **Next**. 

   :::image type="content" source="media/tutorial-vmware-hcx/customize-template.png" alt-text="Screenshot of the boxes for customizing a template." lightbox="media/tutorial-vmware-hcx/customize-template.png":::

1. Verify the configuration, and then select **Finish** to deploy the VMware HCX Connector OVA.
   
   > [!IMPORTANT]
   > You will need to turn on the virtual appliance manually.  After powering on, wait 10-15 minutes before proceeding to the next step.

For an end-to-end overview of this procedure, view the [Azure VMware Solution: HCX Appliance Deployment](https://www.youtube.com/embed/UKmSTYrL6AY) video. 


## Step 3. Activate VMware HCX

After you deploy the VMware HCX Connector OVA on-premises and start the appliance, you're ready to activate. First, you need to get a license key from the Azure VMware Solution portal.

1. In the Azure VMware Solution portal, go to **Manage** > **Connectivity**, select the **HCX** tab, and then select **Add**.

1. Use the **admin** credentials to sign in to the on-premises VMware HCX Manager at `https://HCXManagerIP:9443`.  Make sure to include the `9443` port number with the VMware HCX Manager IP address.

   > [!TIP]
   > You defined the **admin** user password during the VMware HCX Manager OVA file deployment.

1. In **Licensing**, enter your key for **HCX Advanced Key** and select **Activate**.  
   
    > [!IMPORTANT]
    > VMware HCX Manager must have open internet access or a proxy configured.

1. In **Datacenter Location**, provide the nearest location for installing the VMware HCX Manager on-premises. Then select **Continue**.

1. In **System Name**, modify the name or accept the default and select **Continue**.
   
1. Select **Yes, Continue**.

1. In **Connect your vCenter**, provide the FQDN or IP address of your vCenter server and the appropriate credentials, and then select **Continue**.
   
   > [!TIP]
   > The vCenter server is where you deployed the VMware HCX Connector in your datacenter.

1. In **Configure SSO/PSC**, provide the FQDN or IP address of your Platform Services Controller, and then select **Continue**.
   
   > [!NOTE]
   > Typically, it's the same as your vCenter FQDN or IP address.

1. Verify that the information entered is correct and select **Restart**.
    
   > [!NOTE]
   > You'll experience a delay after restarting before being prompted for the next step.

After the services restart, you'll see vCenter showing as green on the screen that appears. Both vCenter and SSO must have the appropriate configuration parameters, which should be the same as the previous screen.

:::image type="content" source="media/tutorial-vmware-hcx/activation-done.png" alt-text="Screenshot of the dashboard with green vCenter status." lightbox="media/tutorial-vmware-hcx/activation-done.png":::  

For an end-to-end overview of this procedure, view the [Azure VMware Solution: Activate HCX](https://www.youtube.com/embed/PnVg6SZkQsY?rel=0&amp;vq=hd720) video.

   > [!IMPORTANT]
   > Whether you're using HCX Advanced or HCX Enterprise, you may need to install the patch from VMware's [KB article 81558](https://kb.vmware.com/s/article/81558). 

## Step 4. Configure the VMware HCX Connector

Now you're ready to add a site pairing, create a network and compute profile, and enable services such as migration, network extension, or disaster recovery. 

### Add a site pairing

You can connect or pair the VMware HCX Cloud Manager in Azure VMware Solution with the VMware HCX Connector in your datacenter. 

1. Sign in to your on-premises vCenter, and under **Home**, select **HCX**.

1. Under **Infrastructure**, select **Site Pairing**, and then select the **Connect To Remote Site** option (in the middle of the screen). 

1. Enter the Azure VMware Solution HCX Cloud Manager URL or IP address that you noted earlier `https://x.x.x.9`, the Azure VMware Solution cloudadmin\@vsphere.local username, and the password. Then select **Connect**.

   > [!NOTE]
   > To successfully establish a site pair:
   > * Your VMware HCX Connector must be able to route to your HCX Cloud Manager IP over port 443.
   >
   > * Use the same password that you used to sign in to vCenter. You defined this password on the initial deployment screen.

   You'll see a screen showing that your VMware HCX Cloud Manager in Azure VMware Solution and your on-premises VMware HCX Connector are connected (paired).

   :::image type="content" source="media/tutorial-vmware-hcx/site-pairing-complete.png" alt-text="Screenshot that shows the pairing of the HCX Manager in Azure VMware Solution and the VMware HCX Connector.":::

For an end-to-end overview of this procedure, view the [Azure VMware Solution: HCX Site Pairing](https://www.youtube.com/embed/jXOmYUnbWZY?rel=0&amp;vq=hd720) video.

### Create network profiles

VMware HCX Connector deploys a subset of virtual appliances (automated) that require multiple IP segments. When you create your network profiles, you use the IP segments you identified during the [VMware HCX Network Segments pre-deployment preparation and planning stage](production-ready-deployment-steps.md#define-vmware-hcx-network-segments).

You'll create four network profiles:

   - Management
   - vMotion
   - Replication
   - Uplink

1. Under **Infrastructure**, select **Interconnect** > **Multi-Site Service Mesh** > **Network Profiles** > **Create Network Profile**.

   :::image type="content" source="media/tutorial-vmware-hcx/network-profile-start.png" alt-text="Screenshot of selections for starting to create a network profile." lightbox="media/tutorial-vmware-hcx/network-profile-start.png":::

1. For each network profile, select the network and port group, provide a name, and create the segment's IP pool. Then select **Create**. 

   :::image type="content" source="media/tutorial-vmware-hcx/example-configurations-network-profile.png" alt-text="Screenshot of details for a new network profile.":::

For an end-to-end overview of this procedure, view the [Azure VMware Solution: HCX Network Profile](https://www.youtube.com/embed/O0rU4jtXUxc) video.


### Create a compute profile

1. Under **Infrastructure**, select **Interconnect** > **Compute Profiles** > **Create Compute Profile**.

   :::image type="content" source="media/tutorial-vmware-hcx/compute-profile-create.png" alt-text="Screenshot that shows the selections for starting to create a compute profile." lightbox="media/tutorial-vmware-hcx/compute-profile-create.png":::

1. Enter a name for the profile and select **Continue**.  

   :::image type="content" source="media/tutorial-vmware-hcx/name-compute-profile.png" alt-text="Screenshot that shows the entry of a compute profile name and the Continue button." lightbox="media/tutorial-vmware-hcx/name-compute-profile.png":::

1. Select the services to enable, such as migration, network extension, or disaster recovery, and then select **Continue**.
  
   > [!NOTE]
   > Generally, nothing changes here.

1. In **Select Service Resources**, select one or more service resources (clusters) to enable the selected VMware HCX services.  

1. When you see the clusters in your on-premises datacenter, select **Continue**.

   :::image type="content" source="media/tutorial-vmware-hcx/select-service-resource.png" alt-text="Screenshot that shows selected service resources and the Continue button." lightbox="media/tutorial-vmware-hcx/select-service-resource.png":::

1. From **Select Datastore**, select the datastore storage resource for deploying the VMware HCX Interconnect appliances. Then select **Continue**.

   When multiple resources are selected, VMware HCX uses the first resource selected until its capacity is exhausted.   

   :::image type="content" source="media/tutorial-vmware-hcx/deployment-resources-and-reservations.png" alt-text="Screenshot that shows a selected data storage resource and the Continue button." lightbox="media/tutorial-vmware-hcx/deployment-resources-and-reservations.png":::  

1. From **Select Management Network Profile**, select the management network profile that you created in previous steps. Then select **Continue**.  

   :::image type="content" source="media/tutorial-vmware-hcx/select-management-network-profile.png" alt-text="Screenshot that shows the selection of a management network profile and the Continue button." lightbox="media/tutorial-vmware-hcx/select-management-network-profile.png":::

1. From **Select Uplink Network Profile**, select the uplink network profile you created in the previous procedure. Then select **Continue**.

   :::image type="content" source="media/tutorial-vmware-hcx/select-uplink-network-profile.png" alt-text="Screenshot that shows the selection of an uplink network profile and the Continue button." lightbox="media/tutorial-vmware-hcx/select-uplink-network-profile.png":::

1. From **Select vMotion Network Profile**, select the vMotion network profile that you created in prior steps. Then select **Continue**.

   :::image type="content" source="media/tutorial-vmware-hcx/select-vmotion-network-profile.png" alt-text="Screenshot that shows the selection of a vMotion network profile and the Continue button." lightbox="media/tutorial-vmware-hcx/select-vmotion-network-profile.png":::

1. From **Select vSphere Replication Network Profile**, select the replication network profile that you created in prior steps. Then select **Continue**.

   :::image type="content" source="media/tutorial-vmware-hcx/select-replication-network-profile.png" alt-text="Screenshot that shows the selection of a replication network profile and the Continue button." lightbox="media/tutorial-vmware-hcx/select-replication-network-profile.png":::

1. From **Select Distributed Switches for Network Extensions**, select the switches that contain the virtual machines to be migrated to Azure VMware Solution on a layer-2 extended network. Then select **Continue**.

   > [!NOTE]
   > If you are not migrating virtual machines on layer-2 (L2) extended networks, you can skip this step.
   
   :::image type=" content" source="media/tutorial-vmware-hcx/select-layer-2-distributed-virtual-switch.png" alt-text="Screenshot that shows the selection of distributed virtual switches and the Continue button." lightbox="media/tutorial-vmware-hcx/select-layer-2-distributed-virtual-switch.png":::

1. Review the connection rules and select **Continue**.  

   :::image type="content" source="media/tutorial-vmware-hcx/review-connection-rules.png" alt-text="Screenshot that shows the connection rules and the Continue button." lightbox="media/tutorial-vmware-hcx/review-connection-rules.png":::

1. Select **Finish** to create the compute profile.


   :::image type="content" source="media/tutorial-vmware-hcx/compute-profile-done.png" alt-text="Screenshot that shows compute profile information." lightbox="media/tutorial-vmware-hcx/compute-profile-done.png":::

For an end-to-end overview of this procedure, view the [Azure VMware Solution: Compute Profile](https://www.youtube.com/embed/e02hsChI3b8) video.

### Create a service mesh

Now it's time to configure a service mesh between on-premises and Azure VMware Solution private cloud.



> [!NOTE]
> To successfully establish a service mesh with Azure VMware Solution:
>
> * Ports UDP 500/4500 are open between your on-premises VMware HCX Connector 'uplink' network profile addresses and the Azure VMware Solution HCX Cloud 'uplink' network profile addresses.
>
> * Be sure to review the [VMware HCX required ports](https://ports.vmware.com/home/VMware-HCX).

1. Under **Infrastructure**, select **Interconnect** > **Service Mesh** > **Create Service Mesh**.    

   :::image type="content" source="media/tutorial-vmware-hcx/create-service-mesh.png" alt-text="Screenshot of selections to start creating a service mesh." lightbox="media/tutorial-vmware-hcx/create-service-mesh.png":::

1. Review the sites that are pre-populated, and then select **Continue**. 

   > [!NOTE]
   > If this is your first service mesh configuration, you won't need to modify this screen.  

1. Select the source and remote compute profiles from the drop-down lists, and then select **Continue**.  

   The selections define the resources where VMs can consume VMware HCX services.  

   :::image type="content" source="media/tutorial-vmware-hcx/select-compute-profile-source.png" alt-text="Screenshot that shows selecting the source compute profile." lightbox="media/tutorial-vmware-hcx/select-compute-profile-source.png":::

   :::image type="content" source="media/tutorial-vmware-hcx/select-compute-profile-remote.png" alt-text="Screenshot that shows selecting the remote compute profile." lightbox="media/tutorial-vmware-hcx/select-compute-profile-remote.png":::

1. Review services that will be enabled, and then select **Continue**.  

1. In **Advanced Configuration - Override Uplink Network profiles**, select **Continue**.  

   Uplink network profiles connect to the network through which the remote site's interconnect appliances can be reached.  
  
1. In **Advanced Configuration - Network Extension Appliance Scale Out**, review and select **Continue**. 

   You can have up to eight VLANs per appliance, but you can deploy another appliance to add another eight VLANs. You must also have IP space to account for the more appliances, and it's one IP per appliance.  For more information, see [VMware HCX Configuration Limits](https://configmax.vmware.com/guest?vmwareproduct=VMware%20HCX&release=VMware%20HCX&categories=41-0,42-0,43-0,44-0,45-0).
   
   :::image type="content" source="media/tutorial-vmware-hcx/extend-networks-increase-vlan.png" alt-text="Screenshot that shows where to increase the VLAN count." lightbox="media/tutorial-vmware-hcx/extend-networks-increase-vlan.png":::

1. In **Advanced Configuration - Traffic Engineering**, review and make any modifications that you feel are necessary, and then select **Continue**.

1. Review the topology preview and select **Continue**.

1. Enter a user-friendly name for this service mesh and select **Finish** to complete.  

1. Select **View Tasks** to monitor the deployment. 

   :::image type="content" source="media/tutorial-vmware-hcx/monitor-service-mesh.png" alt-text="Screenshot that shows the button for viewing tasks.":::

   When the service mesh deployment finishes successfully, you'll see the services as green.

   :::image type="content" source="media/tutorial-vmware-hcx/service-mesh-green.png" alt-text="Screenshot that shows green indicators on services." lightbox="media/tutorial-vmware-hcx/service-mesh-green.png":::

1. Verify the service mesh's health by checking the appliance status. 

1. Select **Interconnect** > **Appliances**.

   :::image type="content" source="media/tutorial-vmware-hcx/interconnect-appliance-state.png" alt-text="Screenshot that shows selections for checking the status of the appliance." lightbox="media/tutorial-vmware-hcx/interconnect-appliance-state.png":::

For an end-to-end overview of this procedure, view the [Azure VMware Solution: Service Mesh](https://www.youtube.com/embed/COY3oIws108) video.

### Step 5. Create a network extension

This is an optional step to extend any networks from your on-premises environment to Azure VMware Solution.

1. Under **Services**, select **Network Extension** > **Create a Network Extension**.

   :::image type="content" source="media/tutorial-vmware-hcx/create-network-extension.png" alt-text="Screenshot that shows selections for starting to create a network extension." lightbox="media/tutorial-vmware-hcx/create-network-extension.png":::

1. Select each of the networks you want to extend to Azure VMware Solution, and then select **Next**.

   :::image type="content" source="media/tutorial-vmware-hcx/select-extend-networks.png" alt-text="Screenshot that shows the selection of a network.":::

1. Enter the on-premises gateway IP for each of the networks you're extending, and then select **Submit**. 

   :::image type="content" source="media/tutorial-vmware-hcx/extend-networks-gateway.png" alt-text="Screenshot that shows the entry of a gateway IP address.":::

   It takes a few minutes for the network extension to finish. When it does, you see the status change to **Extension complete**.

   :::image type="content" source="media/tutorial-vmware-hcx/extension-complete.png" alt-text="Screenshot that shows the status of Extension complete." lightbox="media/tutorial-vmware-hcx/extension-complete.png":::

For an end-to-end overview of this procedure, view the [Azure VMware Solution: Network Extension](https://www.youtube.com/embed/gYR0nftKui0) video.


## Next steps

If the HCX interconnect tunnel status is **UP** and green, you can migrate and protect Azure VMware Solution VMs by using VMware HCX. Azure VMware Solution supports workload migrations (with or without a network extension). You can still migrate workloads in your vSphere environment, along with on-premises creation of networks and deployment of VMs onto those networks.  

For more information on using HCX, go to the VMware technical documentation:

* [VMware HCX Documentation](https://docs.vmware.com/en/VMware-HCX/index.html)
* [Migrating Virtual Machines with VMware HCX](https://docs.vmware.com/en/VMware-HCX/services/user-guide/GUID-D0CD0CC6-3802-42C9-9718-6DA5FEC246C6.html?hWord=N4IghgNiBcIBIGEAaACAtgSwOYCcwBcMB7AOxAF8g)
* [HCX required ports](https://ports.vmware.com/home/VMware-HCX)
* [Set up an HCX proxy server before you approve the license key](https://docs.vmware.com/en/VMware-HCX/services/user-guide/GUID-920242B3-71A3-4B24-9ACF-B20345244AB2.html?hWord=N4IghgNiBcIA4CcD2APAngAgBIGEAaIAvkA)
