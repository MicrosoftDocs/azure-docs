---
title: Tutorial - Deploy and configure VMware HCX
description: Learn how to deploy and configure a VMware HCX solution for your Azure VMware Solution private cloud.
ms.topic: tutorial
ms.date: 10/16/2020
---

# Deploy and configure VMware HCX

In this article, we walk through the procedures to deploy and configure the on-premises VMware HCX Connector for your Azure VMware Solution private cloud. With VMware HCX, you can migrate your VMware workloads to 
Azure VMware Solution and other connected sites through various migration types. Because Azure VMware Solution deploys and configures the HCX Cloud Manager, you must download, activate, and configure the HCX Connector in your on-premises VMware datacenter.

VMware HCX Advanced Connector is pre-deployed in Azure VMware Solution. It supports up to three site connections (on-premises to cloud, or cloud to cloud). If you need more than three site connections, submit a [support request](https://rc.portal.azure.com/#create/Microsoft.Support) to enable the [VMware HCX Enterprise](https://cloud.vmware.com/community/2019/08/08/introducing-hcx-enterprise/) add-on. The add-on is currently in preview. 

>[!NOTE]
>VMware HCX Enterprise Edition (EE) is available with Azure VMware Solution as a preview service. It's free and is subject to terms and conditions for a preview service. After the VMware HCX EE service is generally available, you'll get a 30-day notice that billing will switch over. You'll also have the option to turn off or opt out of the service.

First, thoroughly review the [Before you begin](#before-you-begin), [Software version requirements](#software-version-requirements), and [Prerequisites](#prerequisites) sections of this article. 

Then, we'll walk through all the necessary procedures to:

> [!div class="checklist"]
> * Deploy the on-premises VMware HCX OVA (HCX Connector).
> * Activate the VMware HCX Connector.
> * Pair your on-premises HCX Connector with your Azure VMware Solution HCX Cloud Manager.
> * Configure the interconnect (network profile, compute profile, and service mesh).
> * Complete setup by checking the appliance status and validating that migration is possible.

After you're finished, you can follow the recommended next steps at the end of this article.  

## Before you begin
   
* Review the basic Azure VMware Solution Software-Defined Datacenter (SDDC) [tutorial series](tutorial-network-checklist.md).
* Review and reference the [VMware HCX documentation](https://docs.vmware.com/en/VMware-HCX/index.html), including the HCX user guide.
* Review [Migrating Virtual Machines with VMware HCX](https://docs.vmware.com/en/VMware-HCX/services/user-guide/GUID-D0CD0CC6-3802-42C9-9718-6DA5FEC246C6.html?hWord=N4IghgNiBcIBIGEAaACAtgSwOYCcwBcMB7AOxAF8g) on VMware Docs.
* Optionally review [VMware HCX Deployment Considerations](https://docs.vmware.com/en/VMware-HCX/services/install-checklist/GUID-C0A0E820-D5D0-4A3D-AD8E-EEAA3229F325.html).
* Optionally review related VMware materials on HCX, such as the VMware vSphere [blog series](https://blogs.vmware.com/vsphere/2019/10/cloud-migration-series-part-2.html). 
* Optionally request an Azure VMware Solution HCX Enterprise activation through Azure VMware Solution support channels.
* Optionally [review network ports required for HCX](https://ports.vmware.com/home/VMware-HCX).
* Although the Azure VMware Solution HCX Cloud Manager comes preconfigured from the /22 network that's provided for the Azure VMware Solution private cloud, the on-premises HCX Connector requires you to allocate network ranges from your on-premises network. These networks and ranges are described later in this article.

Sizing workloads against compute and storage resources is an essential planning step. Address the sizing step as part of the initial planning for a private cloud environment. 

You can size workloads by completing an [Azure VMware Solution assessment](../migrate/how-to-create-azure-vmware-solution-assessment.md) in the Azure Migrate portal.

## Software version requirements

Infrastructure components must be running the required minimum version. 
                                                         
| Component type    | Source environment requirements    | Destination environment requirements   |
| --- | --- | --- |
| vCenter Server   | 5.1<br/><br/>If you're using 5.5 U1 or earlier, use the standalone HCX user interface for HCX operations.  | 6.0 U2 and later   |
| ESXi   | 5.0    | ESXi 6.0 and later   |
| NSX    | For HCX network extension of logical switches at the source: NSXv 6.2+ or NSX-T 2.4+.   | NSXv 6.2+ or NSX-T 2.4+<br/><br/>For HCX Proximity Routing: NSXv 6.4+. (Proximity Routing is not supported with NSX-T.) |
| vCloud Director   | Not required. There's no interoperability with vCloud Director at the source site. | When you're integrating the destination environment with vCloud Director, the minimum is 9.1.0.2.  |

## Prerequisites

### Network and ports

* Configure [Azure ExpressRoute Global Reach](tutorial-expressroute-global-reach-private-cloud.md) between on-premises and Azure VMware Solution SDDC ExpressRoute circuits.

* All required ports should be open for communication between on-premises components and Azure VMware Solution SDDC. See [VMware HCX documentation](https://docs.vmware.com/en/VMware-HCX/services/user-guide/GUID-E456F078-22BE-494B-8E4B-076EF33A9CF4.html).


### IP addresses

[!INCLUDE [hcx-network-segments](includes/hcx-network-segments.md)]
   
## Deploy the VMware HCX Connector OVA on-premises

>[!NOTE]
>Before you deploy the virtual appliance to your on-premises vCenter, you'll need to download the VMware HCX Connector OVA. 

1. Open a browser window, sign in to the Azure VMware Solution HCX Manager on `https://x.x.x.9` port 443 with the **cloudadmin** user credentials, and then go to **Support**.

   >[!TIP]
   >Note the IP address of the HCX Cloud Manager in Azure VMware Solution. To identify the IP address, on the Azure VMware Solution pane, go to **Manage** > **Connectivity** and then select the **HCX** tab. 
   >
   >The vCenter password was defined when you set up the private cloud.

1. Select the **Download** link to download the VMware HCX Connector OVA file.

1. Go to your on-premises vCenter. Select an OVF template, which is the OVA file that you downloaded, to deploy the HCX Connector to your on-premises vCenter.  

   :::image type="content" source="media/tutorial-vmware-hcx/select-ovf-template.png" alt-text="Screenshot of browsing to an OVF template." lightbox="media/tutorial-vmware-hcx/select-ovf-template.png":::


1. Select a name and location, and select a resource/cluster where you're deploying the HCX Connector. Then review the details and required resources.  

   :::image type="content" source="media/tutorial-vmware-hcx/configure-template.png" alt-text="Screenshot of reviewing details for the template." lightbox="media/tutorial-vmware-hcx/configure-template.png":::

1. Review license terms. If you agree, select the required storage and network, and then select **Next**.

1. In **Customize template**, enter all required information. 

   :::image type="content" source="media/tutorial-vmware-hcx/customize-template.png" alt-text="Screenshot of the boxes for customizing a template." lightbox="media/tutorial-vmware-hcx/customize-template.png":::

1. Select **Next**, verify the configuration, and then select **Finish** to deploy the HCX Connector OVA.
     
   >[!NOTE]
   >Generally, the VMware HCX Connector that you're deploying now is deployed onto the cluster's management network.  
   
   > [!IMPORTANT]
   > After the deployment finishes, you might need to turn on the virtual appliance manually.
   > Wait 10-15 minutes after turning on the HCX appliance to move to the next step.

For an end-to-end overview of this procedure, view the [Azure VMware Solution: HCX Appliance Deployment](https://www.youtube.com/embed/BwSnQeefnso) video. 


## Activate VMware HCX

After you deploy the VMware HCX Connector OVA on-premises and start the appliance, you're ready to activate. First, you need to get a license key from the Azure VMware Solution portal.

1. In the Azure VMware Solution portal, go to **Manage** > **Connectivity**, select the **HCX** tab, and then select **Add**.

1. Sign in to the on-premises VMware HCX Manager at `https://HCXManagerIP:9443` by using the **admin** user credentials. 

   > [!IMPORTANT]
   > Make sure to include the `9443` port number with the VMware HCX Manager IP address.

1. In **Licensing**, enter your key for **HCX Advanced Key**.  
   
    > [!NOTE]
    > VMware HCX Manager must have open internet access, or a proxy configured.

1. In **Datacenter Location**, provide the nearest location for installing the VMware HCX Manager on-premises.

1. In **System Name**, modify the name or accept the default.
   
1. You can either finish later or continue. To continue, select the option **Yes, Continue**.
    
1. In **Connect your vCenter**, provide the FQDN or IP address of your vCenter server and the appropriate credentials, and then select **Continue**.
   
1. In **Configure SSO/PSC**, provide the FQDN or IP address of your Platform Services Controller, and then select **Continue**.
   
   >[!NOTE]
   >Typically, this entry is the same as your vCenter FQDN or IP address.

1. Verify that all the inputs are correct, and select **Restart**.
    
   > [!NOTE]
   > You'll experience a delay after restarting before being prompted for the next step.

After the services restart, it's critical that you see vCenter showing as green on the screen that appears. Both vCenter and SSO must have the appropriate configuration parameters, which should be the same as the previous screen.

:::image type="content" source="media/tutorial-vmware-hcx/activation-done.png" alt-text="Screenshot of the dashboard with green vCenter status." lightbox="media/tutorial-vmware-hcx/activation-done.png":::  

For an end-to-end overview of this procedure, view the [Azure VMware Solution: Activate HCX](https://www.youtube.com/embed/BkAV_TNYxdE) video.


## Configure the VMware HCX Connector

Now you're ready to add a site pairing, create a network and compute profile, and enable services such as migration, network extension, or disaster recovery. 

### Add a site pairing

You can connect (pair) the VMware HCX Cloud Manager in Azure VMware Solution with the VMware HCX Connector in your datacenter. 

1. Sign in to your on-premises vCenter, and under **Home**, select **HCX**.

   :::image type="content" source="media/tutorial-vmware-hcx/vcenter-vmware-hcx.png" alt-text="Screenshot of vCenter Client with HCX selected among shortcuts." lightbox="media/tutorial-vmware-hcx/vcenter-vmware-hcx.png":::

1. Under **Infrastructure**, select **Site Pairing**, and then select the **Connect To Remote Site** option (in the middle of the screen). 

   :::image type="content" source="media/tutorial-vmware-hcx/connect-remote-site.png" alt-text="Screenshot of selections for creating a remote site." lightbox="media/tutorial-vmware-hcx/connect-remote-site.png":::

1. Enter the Remote HCX URL or IP address that you noted earlier, the Azure VMware Solution cloudadmin@vsphere.local username, and the password. Then select **Connect**.

   > [!NOTE]
   > The remote HCX URL is your Azure VMware Solution private cloud's HCX Cloud Manager IP address. Typically, it's the ".9" address of the management network. For example, if your vCenter is 192.168.4.2, then your HCX URL will be 192.168.4.9.
   >
   > The password is the same password that you used to sign in to vCenter. You defined this password on the initial deployment screen.

   You see a screen showing that your HCX Cloud Manager in Azure VMware Solution and your on-premises HCX Connector are connected (paired).

   :::image type="content" source="media/tutorial-vmware-hcx/site-pairing-complete.png" alt-text="Screenshot that shows the pairing of the HCX Manager in Azure VMware Solution and the HCX Connector.":::

For an end-to-end overview of this procedure, view the [Azure VMware Solution: HCX Site Pairing](https://www.youtube.com/embed/sKizDCRHOko) video.



### Create network profiles

VMware HCX deploys a subset of virtual appliances (automated) that require multiple IP segments. When you create your network profiles, you define the IP segments that you identified during the [VMware HCX Network Segments pre-deployment preparation and planning stage](production-ready-deployment-steps.md#vmware-hcx-network-segments).

You'll create four network profiles:

   - Management
   - vMotion
   - Replication
   - Uplink

1. Under **Infrastructure**, select **Interconnect** > **Multi-Site Service Mesh** > **Network Profiles** > **Create Network Profile**.

   :::image type="content" source="media/tutorial-vmware-hcx/network-profile-start.png" alt-text="Screenshot of selections for starting to create a network profile." lightbox="media/tutorial-vmware-hcx/network-profile-start.png":::

1. For each network profile, select the network and port group, provide a name, and create the IP pool for that segment. Then select **Create**. 

   :::image type="content" source="media/tutorial-vmware-hcx/example-configurations-network-profile.png" alt-text="Screenshot of details for a new network profile.":::

For an end-to-end overview of this procedure, view the [Azure VMware Solution: HCX Network Profile](https://www.youtube.com/embed/NhyEcLco4JY) video.


### Create a compute profile

1. Select **Compute Profiles** > **Create Compute Profile**.

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

   > [!NOTE]
   > The management network profile allows the VMware HCX appliances to communicate with vCenter. The ESXi hosts can be reached through this profile.

1. From **Select Uplink Network Profile**, select the uplink network profile that you created in previous steps. Then select **Continue**.

   :::image type="content" source="media/tutorial-vmware-hcx/select-uplink-network-profile.png" alt-text="Screenshot that shows the selection of an uplink network profile and the Continue button." lightbox="media/tutorial-vmware-hcx/select-uplink-network-profile.png":::

1. From **Select vMotion Network Profile**, select the vMotion network profile that you created in prior steps. Then select **Continue**.

   :::image type="content" source="media/tutorial-vmware-hcx/select-vmotion-network-profile.png" alt-text="Screenshot that shows the selection of a vMotion network profile and the Continue button." lightbox="media/tutorial-vmware-hcx/select-vmotion-network-profile.png":::

1. From **Select vSphere Replication Network Profile**, select the replication network profile that you created in prior steps. Then select **Continue**.

   In most cases, the replication network profile is the same as the management network profile.  

   :::image type="content" source="media/tutorial-vmware-hcx/select-replication-network-profile.png" alt-text="Screenshot that shows the selection of a replication network profile and the Continue button." lightbox="media/tutorial-vmware-hcx/select-replication-network-profile.png":::

1. From **Select Distributed Switches for Network Extensions**, select the distributed virtual switches that contain the virtual machines to be migrated to Azure VMware Solution on a layer-2 extended network. Then select **Continue**.

   :::image type=" content" source="media/tutorial-vmware-hcx/select-layer-2-distributed-virtual-switch.png" alt-text="Screenshot that shows the selection of distributed virtual switches and the Continue button." lightbox="media/tutorial-vmware-hcx/select-layer-2-distributed-virtual-switch.png":::

1. Review the connection rules and select **Continue**.  

   :::image type="content" source="media/tutorial-vmware-hcx/review-connection-rules.png" alt-text="Screenshot that shows the connection rules and the Continue button." lightbox="media/tutorial-vmware-hcx/review-connection-rules.png":::

1. Select **Finish** to create the compute profile.

   You see a screen similar to the following one.

   :::image type="content" source="media/tutorial-vmware-hcx/compute-profile-done.png" alt-text="Screenshot that shows compute profile information." lightbox="media/tutorial-vmware-hcx/compute-profile-done.png":::

For an end-to-end overview of this procedure, view the [Azure VMware Solution: Compute Profile](https://www.youtube.com/embed/qASXi5xrFzM) video.




### Create a service mesh

Now it's time to configure a service mesh between on-premises and Azure VMware Solution SDDC.

1. Under **Infrastructure**, select **Interconnect** > **Service Mesh** > **Create Service Mesh**.    

   :::image type="content" source="media/tutorial-vmware-hcx/create-service-mesh.png" alt-text="Screenshot of selections to start creating a service mesh." lightbox="media/tutorial-vmware-hcx/create-service-mesh.png":::

1. Review the sites that are pre-populated, and then select **Continue**. 

   >[!NOTE]
   >If this is your first service mesh configuration, you won't need to modify this screen.  

1. Select the source and remote compute profiles from the drop-down lists, and then select **Continue**.  

   The selections define the resources where VMs can consume VMware HCX services.  

   :::image type="content" source="media/tutorial-vmware-hcx/select-compute-profile-source.png" alt-text="Screenshot that shows selecting the source compute profile." lightbox="media/tutorial-vmware-hcx/select-compute-profile-source.png":::

   :::image type="content" source="media/tutorial-vmware-hcx/select-compute-profile-remote.png" alt-text="Screenshot that shows selecting the remote compute profile." lightbox="media/tutorial-vmware-hcx/select-compute-profile-remote.png":::

1. Review services that will be enabled, and then select **Continue**.  

1. In **Advanced Configuration - Override Uplink Network profiles**, select **Continue**.  Uplink network profiles connect to the network through which the remote site's interconnect appliances can be reached.  
  
1. In **Advanced Configuration - Network Extension Appliance Scale Out**, review and select **Continue**. 

1. In **Advanced Configuration - Traffic Engineering**, review and make any modifications that you feel are necessary, and then select **Continue**.

1. Review the topology preview and select **Continue**.

1. Enter a user-friendly name for this service mesh and select **Finish** to complete.  

1. Select **View Tasks** to monitor the deployment. 

   :::image type="content" source="media/tutorial-vmware-hcx/monitor-service-mesh.png" alt-text="Screenshot that shows the button for viewing tasks.":::

   When the service mesh deployment finishes successfully, you'll see the services as green.

   :::image type="content" source="media/tutorial-vmware-hcx/service-mesh-green.png" alt-text="Screenshot that shows green indicators on services." lightbox="media/tutorial-vmware-hcx/service-mesh-green.png":::

1. Verify the service mesh's health by checking the appliance status. Select **Interconnect** > **Appliances**.

   :::image type="content" source="media/tutorial-vmware-hcx/interconnect-appliance-state.png" alt-text="Screenshot that shows selections for checking the status of the appliance." lightbox="media/tutorial-vmware-hcx/interconnect-appliance-state.png":::

For an end-to-end overview of this procedure, view the [Azure VMware Solution: Service Mesh](https://www.youtube.com/embed/FyZ0d3P_T24) video.



### (Optional) Create a network extension

If you want to extend any networks from your on-premises environment to Azure VMware Solution, follow these steps:

1. Under **Services**, select **Network Extension**, and then select **Create a Network Extension**.

   :::image type="content" source="media/tutorial-vmware-hcx/create-network-extension.png" alt-text="Screenshot that shows selections for starting to create a network extension." lightbox="media/tutorial-vmware-hcx/create-network-extension.png":::

1. Select each of the networks you want to extend to Azure VMware Solution, and then select **Next**.

   :::image type="content" source="media/tutorial-vmware-hcx/select-extend-networks.png" alt-text="Screenshot that shows the selection of a network.":::

1. Enter the on-premises gateway IP for each of the networks you're extending, and then select **Submit**. 

   :::image type="content" source="media/tutorial-vmware-hcx/extend-networks-gateway.png" alt-text="Screenshot that shows the entry of a gateway IP address.":::

   It takes a few minutes for the network extension to finish. When it does, you see the status change to **Extension complete**.

   :::image type="content" source="media/tutorial-vmware-hcx/extension-complete.png" alt-text="Screenshot that shows the status of Extension complete." lightbox="media/tutorial-vmware-hcx/extension-complete.png":::

For an end-to-end overview of this step, view the [Azure VMware Solution: Network Extension](https://www.youtube.com/embed/cNlp0f_tTr0) video.


## Next steps

If you've reached this point and the appliance interconnect tunnel status is **UP** and green, you can migrate and protect Azure VMware Solution VMs by using VMware HCX. Azure VMware Solution supports workload migrations (with or without a network extension). You can still migrate workloads in your vSphere environment, along with on-premises creation of networks and deployment of VMs onto those networks.  

For more information on using HCX, go to the VMware technical documentation:

* [VMware HCX Documentation](https://docs.vmware.com/en/VMware-HCX/index.html)
* [Migrating Virtual Machines with VMware HCX](https://docs.vmware.com/en/VMware-HCX/services/user-guide/GUID-D0CD0CC6-3802-42C9-9718-6DA5FEC246C6.html?hWord=N4IghgNiBcIBIGEAaACAtgSwOYCcwBcMB7AOxAF8g).
