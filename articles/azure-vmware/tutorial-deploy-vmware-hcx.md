---
title: Tutorial - Deploy and configure VMware HCX
description: Learn how to deploy and configure VMware HCX solution for your Azure VMware Solution private cloud.
ms.topic: tutorial
ms.date: 10/16/2020
---

# Deploy and configure VMware HCX

In this article, we walk through the procedures to deploy and configure the VMware HCX on-premises "Connector" for your Azure VMware Solution private cloud. With VMware HCX, you can migrate your VMware workloads to Azure VMware Solution and other connected sites through various migration types.  Since Azure VMware Solution deploys and configures the "Cloud Manager," you must download, activate, and configure the "Connector" in your on-premises VMware datacenter.  

VMware HCX Advanced Connector, which is pre-deployed in Azure VMware Solution, supports up to three site connections (on-premises to cloud, or cloud to cloud). If you require more than three site connections, submit a [support request](https://rc.portal.azure.com/#create/Microsoft.Support) to enable the [VMware HCX Enterprise](https://cloud.vmware.com/community/2019/08/08/introducing-hcx-enterprise/) add-on (currently in *Preview*).  

>[!NOTE]
>VMware HCX Enterprise Edition (EE) is available with Azure VMware Solution as a *Preview* function/service. While VMware HCX EE for Azure VMware Solution is in *Preview*, it is a free function/service and subject to Preview service terms and conditions. Once the VMware HCX EE service goes GA, you'll get a 30-day notice that billing will switch over. You can also switch off/opt-out of the service.

Before beginning, thoroughly review [Before you begin](#before-you-begin), [Software version requirements](#software-version-requirements), and [Prerequisites](#prerequisites). 

Then, we'll walk through all the necessary procedures to:

> [!div class="checklist"]
> * Deploy the on-premises VMware HCX OVA (HCX Connector)
> * Activate VMware HCX Connector
> * Pair your on-premises HCX Connector with your Azure VMware Solution HCX Cloud Manager
> * Configure the interconnect (network profile, compute profile, and service mesh)
> * Complete setup by checking the appliance status and validating migration is possible

Once finished, you can follow the recommended next steps at the end of this article.  

## Before you begin
   
* Review the basic Azure VMware Solution Software-Defined Datacenter (SDDC) [tutorial series](tutorial-network-checklist.md).
* Review and reference the [VMware HCX documentation](https://docs.vmware.com/en/VMware-HCX/index.html), including the HCX user guide.
* Review VMware docs [Migrating Virtual Machines with VMware HCX](https://docs.vmware.com/en/VMware-HCX/services/user-guide/GUID-D0CD0CC6-3802-42C9-9718-6DA5FEC246C6.html?hWord=N4IghgNiBcIBIGEAaACAtgSwOYCcwBcMB7AOxAF8g).
* Optionally review [VMware HCX Deployment Considerations](https://docs.vmware.com/en/VMware-HCX/services/install-checklist/GUID-C0A0E820-D5D0-4A3D-AD8E-EEAA3229F325.html).
* Optionally review related VMware materials on HCX, such as the VMware vSphere [blog series](https://blogs.vmware.com/vsphere/2019/10/cloud-migration-series-part-2.html) on HCX. 
* Optionally request an Azure VMware Solution HCX Enterprise activation through Azure VMware Solution support channels.
* Optionally [review network ports required for HCX](https://ports.vmware.com/home/VMware-HCX).
* While the Azure VMware Solution HCX Cloud Manager comes preconfigured from the /22 provided for the Azure VMware Solution private cloud, the HCX on-premises Connector requires network ranges to be allocated by the customer from their on-premises network. These  networks and ranges are described further down in the document.

Sizing workloads against compute and storage resources is an essential planning step. Address the sizing step as part of the initial private cloud environment planning. 

You can also size workloads by completing an [Azure VMware Solution Assessment](./migrate/how-to-create-azure-vmware-solution-assessment.md) the Azure Migrate portal.

## Software version requirements

Infrastructure components must be running the required minimum version. 
                                                         
| Component type    | Source environment requirements    | Destination environment requirements   |
| --- | --- | --- |
| vCenter Server   | 5.1<br/><br/>If using 5.5 U1 or earlier, use the standalone HCX user interface for HCX operations.  | 6.0 U2 and above   |
| ESXi   | 5.0    | ESXi 6.0 and above   |
| NSX    | For HCX Network Extension of logical switches at the source: NSXv 6.2+ or NSX-T 2.4+   | NSXv 6.2+ or NSX-T 2.4+<br/><br/>For HCX Proximity Routing: NSXv 6.4+ (Proximity Routing isn't supported with NSX-T) |
| vCloud Director   | Not required - no interoperability with vCloud Director at the source site | When integrating the destination environment with vCloud Director, the minimum is 9.1.0.2.  |

## Prerequisites

### Network and ports

* [ExpressRoute Global Reach](tutorial-expressroute-global-reach-private-cloud.md) configured between on-premises and Azure VMware Solution SDDC ExpressRoute circuits.

* All required ports should be open for communication between on-premises components and on-premises to Azure VMware Solution SDDC (see [VMware HCX documentation](https://docs.vmware.com/en/VMware-HCX/services/user-guide/GUID-E456F078-22BE-494B-8E4B-076EF33A9CF4.html)).


### IP addresses

[!INCLUDE [hcx-network-segments](includes/hcx-network-segments.md)]
   
## Deploy the VMware HCX Connector OVA on-premises

>[!NOTE]
>Before you deploy the virtual appliance to your on-premises vCenter, you'll need to download the VMware HCX Connector OVA. 

1. Open a browser window, sign in to the Azure VMware Solution HCX Manager on `https://x.x.x.9` port 443 with the **cloudadmin** user credentials, and then go to **Support**.

   >[!TIP]
   >Note down the IP of the HCX Cloud Manager in Azure VMware Solution. To identify the IP address of HCX Cloud Manager, in the Azure VMware Solution blade, go to the **Manage** > **Connectivity** and then select the **HCX** tab. 
   >
   >The vCenter password was defined when you set up the private cloud.

1. Select the **download** link to download the VMware HCX Connector OVA file.

1. From your on-premises vCenter, select an OVF template, which is the OVA file you downloaded, to deploy the HCX Connector to your on-premises vCenter.  

   :::image type="content" source="media/tutorial-vmware-hcx/select-ovf-template.png" alt-text="Go to the on-premises vCenter and select an OVF template to deploy to your on-premises vCenter." lightbox="media/tutorial-vmware-hcx/select-ovf-template.png":::


1. Select a name and location, a resource/cluster where you are deploying the HCX Connector, and then review the details and required resources.  

   :::image type="content" source="media/tutorial-vmware-hcx/configure-template.png" alt-text="Select a name and location, a resource/cluster where you are deploying HCX, and then review the details and required resources." lightbox="media/tutorial-vmware-hcx/configure-template.png":::

1. Review license terms, and if you agree, select the required storage and network, and then select **Next**.

1. In **Customize template**, enter all required information. 

   :::image type="content" source="media/tutorial-vmware-hcx/customize-template.png" alt-text="In Customize template, enter all required information" lightbox="media/tutorial-vmware-hcx/customize-template.png":::

1. Select **Next**, verify configuration, and then select **Finish** to deploy HCX Connector OVA.
     
   >[!NOTE]
   >Generally, the VMware HCX Connector that you are deploying now is deployed onto the cluster's management network.  
   
   > [!IMPORTANT]
   > After the deployment completes, you may need to power on the virtual appliance manually.
   > Wait 10-15 minutes after powering on the HCX appliance to move to the next step.

For an end-to-end overview of this step, view the [Azure VMware Solution - VMware HCX Appliance deployment](https://www.youtube.com/embed/BwSnQeefnso) video. 


## Activate VMware HCX

After deploying the VMware HCX Connector OVA on-premises and starting the appliance, you're ready to activate it. First, you need to retrieve a license key from the Azure VMware Solution portal in Azure.

1. In the Azure VMware Solution portal, go to the **Manage** > **Connectivity**, select the **HCX** tab, and then select **Add**.

1. Sign in to the on-premises VMware HCX Manager at `https://HCXManagerIP:9443` and sign in the **admin** user credentials. 

   > [!IMPORTANT]
   > Make sure to include the `9443` port number with the VMware HCX Manager IP address.

1. In **Licensing**, enter your **HCX Advanced Key**.  
   
    > [!NOTE]
    > VMware HCX Manager must have open internet access, or a proxy configured.

1. In **Datacenter Location**, provide the nearest location for installing the VMware HCX Manager on-premises.

1. Modify the **System Name** or accept the default.
   
1. You can either Finish Later or Continue, select the option **Yes, Continue** to continue.
    
1. In **Connect your vCenter**, provide the FQDN or IP address of your vCenter server and the appropriate credentials, and then select **Continue**.
   
1. In **Configure SSO/PSC**, provide the FQDN or IP address of your PSC and then select **Continue**.
   
   >[!NOTE]
   >Typically, the same as your vCenter FQDN/IP.

1. Verify that all the inputs are correct and select **Restart**.
    
   > [!NOTE]
   > You'll experience a delay after restarting before being prompted for the next step.
   >
   >After the services restart, it's critical that you see vCenter showing as green on the screen that appears. Both vCenter and SSO have the appropriate configuration parameters, which should be the same as the previous screen.

   :::image type="content" source="media/tutorial-vmware-hcx/activation-done.png" alt-text="After the services restart, it's critical that you see vCenter showing as green on the screen that appears. Both vCenter and SSO have the appropriate configuration parameters, which should be the same as the previous screen." lightbox="media/tutorial-vmware-hcx/activation-done.png":::  

For an end-to-end overview of this step, view the [Azure VMware Solution - VMware HCX activation](https://www.youtube.com/embed/BkAV_TNYxdE) video.


## Configure VMware HCX Connector

Now you're ready to add a site pairing, create a network and compute profile, and enable services, such as migration, Network Extension, or Disaster Recovery. 

### Add a site pairing

You can connect (pair) the VMware HCX Cloud Manager in Azure VMware Solution with the VMware HCX Connector in your datacenter. 

1. Sign in to your on-premises vCenter, and under **Home**, select **HCX**.

   :::image type="content" source="media/tutorial-vmware-hcx/vcenter-vmware-hcx.png" alt-text="Sign into on-premises vCenter, and under Home, select HCX." lightbox="media/tutorial-vmware-hcx/vcenter-vmware-hcx.png":::

1. Under **Infrastructure**, select **Site Pairing**, and then select the **Connect To Remote Site** option (in middle of screen). 

   :::image type="content" source="media/tutorial-vmware-hcx/connect-remote-site.png" alt-text="Under Infrastructure, select Site Pairing > Add a site pairing." lightbox="media/tutorial-vmware-hcx/connect-remote-site.png":::

1. Enter the **Remote HCX URL or IP address** you noted down earlier, the Azure VMware Solution cloudadmin@vsphere.local username and **password**, and then select **Connect**.

   > [!NOTE]
   > The **Remote HCX URL** is your Azure VMware Solution private cloud HCX Cloud Manager IP, typically the ".9" address of the management network.  For example, if your vCenter is 192.168.4.2, then your HCX URL will be 192.168.4.9.
   >
   > The **password** will be the same password you used to sign in to vCenter. You defined this password on the initial deployment screen.

   You see a screen showing your HCX Cloud Manager in Azure VMware Solution and your HCX Connector on-premises connected (paired).

   :::image type="content" source="media/tutorial-vmware-hcx/site-pairing-complete.png" alt-text="You should now see a screen showing your HCX Manager in Azure VMware Solution and your HCX Manager on-premises connected (paired).":::

For an end-to-end overview of this step, view the [Azure VMware Solution - VMware HCX site pairing](https://www.youtube.com/embed/sKizDCRHOko) video.



### Create network profiles

VMware HCX deploys a subset of virtual appliances (automated) that require multiple IP segments.  When you create your network profiles, you define the IP segments you identified during the [VMware HCX Network Segments pre-deployment preparation and planning stage](production-ready-deployment-steps.md#vmware-hcx-network-segments).

You will create four network profiles:

   - Management
   - vMotion
   - Replication
   - Uplink

1. Under **Infrastructure**, select **Interconnect** > **Multi-Site Service Mesh** > **Network Profiles** > **Create Network Profile**.

   :::image type="content" source="media/tutorial-vmware-hcx/network-profile-start.png" alt-text="Under Infrastructure, select Interconnect > Multi-Site Service Mesh > Network Profiles > Create Network Profile." lightbox="media/tutorial-vmware-hcx/network-profile-start.png":::

1. For each network profile, select the network, port group, provide a name, create the IP pool for that particular segment, and then select **Create**. 

   :::image type="content" source="media/tutorial-vmware-hcx/example-configurations-network-profile.png" alt-text="For the new network profile, enter the VMware HCX IX and NE IP address ranges (a minimum of two IP addresses is required for IX and NE appliances).":::

For an end-to-end overview of this step, view the [Azure VMware Solution - VMware HCX create network profile](https://www.youtube.com/embed/NhyEcLco4JY) video.


### Create a compute profile

1. Select **Compute Profiles** > **Create Compute Profile**.

   :::image type="content" source="media/tutorial-vmware-hcx/compute-profile-create.png" alt-text="Now select Compute Profiles > Create Compute Profile" lightbox="media/tutorial-vmware-hcx/compute-profile-create.png":::

1. Enter a name for the profile and select **Continue**.  

   :::image type="content" source="media/tutorial-vmware-hcx/name-compute-profile.png" alt-text="Enter a compute profile name and select Continue." lightbox="media/tutorial-vmware-hcx/name-compute-profile.png":::

1. Select the services to enable, such as migration, Network Extension, or Disaster Recovery, and then select **Continue**.
  
   > [!NOTE]
   > Generally, nothing changes here.

1. In **Select Service Resources**, select one or more service resources (clusters) to enable the selected VMware HCX services.  

1. When you see the clusters in your on-premises datacenter, select **Continue**.

   :::image type="content" source="media/tutorial-vmware-hcx/select-service-resource.png" alt-text="In Select Service Resources, select one or more service resources for which the selected VMware HCX services should be enabled. Select Continue." lightbox="media/tutorial-vmware-hcx/select-service-resource.png":::

1. From **Select Datastore**, select the datastore storage resource for deploying the VMware HCX Interconnect appliances and then select **Continue**.

   When multiple resources are selected, VMware HCX uses the first resource selected until its capacity is exhausted.   

   :::image type="content" source="media/tutorial-vmware-hcx/deployment-resources-and-reservations.png" alt-text="Select each compute and storage resource for deploying the VMware HCX Interconnect appliances. When multiple resources are selected, VMware HCX uses the first resource selected until its capacity is exhausted." lightbox="media/tutorial-vmware-hcx/deployment-resources-and-reservations.png":::  

1. Select **Management Network Profile**,  the management network profile you created in previous steps, and then select **Continue**.  

   :::image type="content" source="media/tutorial-vmware-hcx/select-management-network-profile.png" alt-text="Select the network profile through which the management interface of vCenter and the ESXi hosts can be reached. If you haven't already defined such a network profile, you can create it here." lightbox="media/tutorial-vmware-hcx/select-management-network-profile.png":::

   > [!NOTE]
   > The management network profile allows the VMware HCX appliance(s) to communicate with vCenter, and the ESXi hosts can be reached.

1. Select **Uplink Network Profile**,  the uplink network profile you created in previous steps, and then select **Continue**.

   :::image type="content" source="media/tutorial-vmware-hcx/select-uplink-network-profile.png" alt-text="Select Network Uplink and select Continue." lightbox="media/tutorial-vmware-hcx/select-uplink-network-profile.png":::

1. Select **vMotion Network Profile**, the vMotion network profile you created in prior steps, and then select **Continue**.

   :::image type="content" source="media/tutorial-vmware-hcx/select-vmotion-network-profile.png" alt-text="Select vMotion Network Profile and select Continue." lightbox="media/tutorial-vmware-hcx/select-vmotion-network-profile.png":::

1. Choose **vSphere Replication Network Profile**, the replication network profile you created in prior steps, and then choose **Continue**.

   In most cases, the replication network profile is the same as the Management Network Profile.  

   :::image type="content" source="media/tutorial-vmware-hcx/select-replication-network-profile.png" alt-text="From Select vSphere Replication Network Profile, select a network profile the vSphere Replication interface of ESXi hosts and then select Continue." lightbox="media/tutorial-vmware-hcx/select-replication-network-profile.png":::

1. Select **Distributed Switches for Network Extensions**, the distributed virtual switches that contain the virtual machines to be migrated to Azure VMware Solution on a layer-2 extended network, and then select **Continue**.

   :::image type=" content" source="media/tutorial-vmware-hcx/select-layer-2-distributed-virtual-switch.png" alt-text=" From Select Distributed Switches for Network Extensions, select the DVS on which you have networks the VMs that will be integrated and are connected.  Select Continue." lightbox="media/tutorial-vmware-hcx/select-layer-2-distributed-virtual-switch.png":::

1. Review the connection rules and select **Continue**.  

   :::image type="content" source="media/tutorial-vmware-hcx/review-connection-rules.png" alt-text="Review the connection rules and select Continue." lightbox="media/tutorial-vmware-hcx/review-connection-rules.png":::

1. Select **Finish** to create the compute profile.

   You see a screen similar to the one shown below.

   :::image type="content" source="media/tutorial-vmware-hcx/compute-profile-done.png" alt-text="You should now see a screen very similar to the one shown below." lightbox="media/tutorial-vmware-hcx/compute-profile-done.png":::

For an end-to-end overview of this step, view the [Azure VMware Solution - VMware HCX create compute profile](https://www.youtube.com/embed/qASXi5xrFzM) video.




### Create service mesh

Now it's time to configure Service Mesh between on-premises and Azure VMware Solution SDDC.

1. Under **Infrastructure**, select **Interconnect** > **Service Mesh** > **Create Service Mesh**.    

   :::image type="content" source="media/tutorial-vmware-hcx/create-service-mesh.png" alt-text="Under Infrastructure, select Interconnect > Service Mesh > Create Service Mesh to configure the network and compute profiles created in previous steps." lightbox="media/tutorial-vmware-hcx/create-service-mesh.png":::

1. Review the sites that are pre-populated, and then select **Continue**. 

   >[!NOTE]
   >If this is your first service mesh configuration, you won't need to modify this screen.  

1. Select the drop-down for the source and remote compute profiles and then select **Continue**.  

   The selections define the resources where VMs can consume VMware HCX services.  

   :::image type="content" source="media/tutorial-vmware-hcx/select-compute-profile-source.png" alt-text="The source selections define the resources, where VMs can consume VMware HCX services." lightbox="media/tutorial-vmware-hcx/select-compute-profile-source.png":::

   :::image type="content" source="media/tutorial-vmware-hcx/select-compute-profile-remote.png" alt-text="The remote selections define the resources, where VMs can consume VMware HCX services." lightbox="media/tutorial-vmware-hcx/select-compute-profile-remote.png":::

1. Review services that will be enabled and then select **Continue**.  

1. In **Advanced Configuration - Override Uplink Network profiles** select **Continue**.  Uplink network profiles connect to the network via which the remote site's interconnect appliances can be reached.  
  
1. In **Advanced Configuration - Network Extension Appliance Scale Out**, review and select **Continue**. 

1. In **Advanced Configuration - Traffic Engineering**, review and make any modifications you feel necessary, and then select **Continue**.

1. Review the topology preview and select **Continue**.

1. Enter a user-friendly name for this service mesh and select **Finish** to complete.  

1. Select **View Tasks** to monitor the deployment. 

   :::image type="content" source="media/tutorial-vmware-hcx/monitor-service-mesh.png" alt-text="Select View Tasks to monitor the deployment.":::

   When the service mesh deployment completes successfully, you'll see the services as green.

   :::image type="content" source="media/tutorial-vmware-hcx/service-mesh-green.png" alt-text="When the Service Mesh deployment is completed successfully, you see a screen similar to this one." lightbox="media/tutorial-vmware-hcx/service-mesh-green.png":::

1. Verify the service mesh's health by checking the appliance status, select **Interconnect** > **Appliances**.

   :::image type="content" source="media/tutorial-vmware-hcx/interconnect-appliance-state.png" alt-text="Check the status of the appliance." lightbox="media/tutorial-vmware-hcx/interconnect-appliance-state.png":::

For an end-to-end overview of this step, view the [Azure VMware Solution - VMware HCX create service mesh](https://www.youtube.com/embed/FyZ0d3P_T24) video.



### (Optional) Create a network extension

If you want to extend any networks from your on-premises environment to Azure VMware Solution, follow these steps to extend those networks.

1. Under **Services**, select **Network Extension**, and then select **Create a Network Extension**.

   :::image type="content" source="media/tutorial-vmware-hcx/create-network-extension.png" alt-text="Under Services choose Network Extension and select Create a Network Extension." lightbox="media/tutorial-vmware-hcx/create-network-extension.png":::

1. Select each of the networks you want to extend to Azure VMware Solution and then select **Next**.

   :::image type="content" source="media/tutorial-vmware-hcx/select-extend-networks.png" alt-text=" Select each of the networks you want to extend to Azure VMware Solution and then select Next.":::

1. Enter the on-premises gateway IP for each of the networks you're extending, and then select **Submit**. 

   :::image type="content" source="media/tutorial-vmware-hcx/extend-networks-gateway.png" alt-text="Enter the on-premises gateway IP for each of the networks you're extending, and then select Submit.":::

   It takes a few minutes for the network extension to complete. When it does, you see the status change to **extension complete**.

   :::image type="content" source="media/tutorial-vmware-hcx/extension-complete.png" alt-text="It takes a few minutes for the network extension to complete. When it does, you see the status change to extension complete." lightbox="media/tutorial-vmware-hcx/extension-complete.png":::

For an end-to-end overview of this step, view the [Azure VMware Solution - VMware HCX network extension](https://www.youtube.com/embed/cNlp0f_tTr0) video.


## Next steps

If you've reached this point and the appliance interconnect Tunnel Status is **UP** and green, you can migrate and protect Azure VMware Solution VMs using VMware HCX.  Azure VMware Solution supports workload migrations (with or with a network extension).  You can still migrate workloads in your vSphere environment on-premises creation of networks and deployment of VMs onto those networks.  For more information on using HCX, go to the VMware technical documentation:

* [VMware HCX documentation](https://docs.vmware.com/en/VMware-HCX/index.html)
* [Migrating Virtual Machines with VMware HCX](https://docs.vmware.com/en/VMware-HCX/services/user-guide/GUID-D0CD0CC6-3802-42C9-9718-6DA5FEC246C6.html?hWord=N4IghgNiBcIBIGEAaACAtgSwOYCcwBcMB7AOxAF8g) 
