---
title: Install Hybrid Cloud Extension
description: set up the VMWare Hybrid Cloud Extension (HCX) solution for your Azure VMWare Solution (AVS) private cloud
ms.topic: how-to
ms.date: 05/15/2020
---

# HCX installation

In this article, set up the VMWare Hybrid Cloud Extension (HCX) solution for your Azure VMWare Solution (AVS) private cloud. The HCX solution supports up to three external enterprise sites, where each external site must have its own HCX Enterprise activation (HEA) key in order to migrate to the AVS Private Cloud target. Hot/cold vMotion migrations for VMs to and from on-premises environments and your AVS private cloud are enabled by the solution.


**Before you begin:**
	
* Review the basic AVS Software Defined Datacenter (SDDC) [tutorial series](tutorial-network-checklist.md).
* Related VMware materials on HCX, such as Megie’s VMware vSphere [blog series](https://blogs.vmware.com/vsphere/2019/10/cloud-migration-series-part-1.html) on HCX. 
* Order an AVS HCX Enterprise activation through AVS support channels.

Sizing workloads against compute and storage resources is an essential planning step when preparing to use the AVS Private Cloud HCX solution. This sizing step should be addressed as part of initial private cloud environment planning. 

## Software version requirements
Infrastructure components must be running the required minimum version. 
                                                         
| Component Type                                                          | Source Environment Requirements                                                                   | Destination Environment Requirements                                                                      |
| --- | --- | --- |
| vCenter Server                                                          | 5.1<br/><br/>If using 5.5 U1 or earlier, use the standalone HCX User Interface for HCX operations.         | 6.0 U2 and above                                                                                          |
| ESXi                                                                    | 5.0                                                                                               | ESXi 6.0 and above                                                                                        |
| NSX                                                                     | For HCX Network Extension of Logical Switches at the Source: NSXv 6.2+ or NSX-T 2.4+              | NSXv 6.2+ or NSX-T 2.4+<br/><br/For HCX Proximity Routing: NSXv 6.4+ (Proximity Routing not supported with NSX-T) |
| vCloud Director                                                         | Not required - no interoperability with vCloud Director at the source site | When the destination environment is integrated with vCloud Director, the minimum is 9.1.0.2.              |

## Prerequisites

1.  Global reach should be configured between on-premises and AVS SDDC ER
    circuits.

2.  All required ports should be open between on-premises and AVS SDDC.

3.  One IP address for HCX Manager at on-premises and a minimum of 2 IP addresses
    for Interconnect (IX) and Network Extension (NE) appliance.

4.  On-premises HCX IX and NE appliances should be able to reach vCenter
    and ESXi infrastructure.

## Deploy the VMware HCX OVA

1. Sign in to AVS SDDC vCenter and select **HCX**.

    ![Select HCX in to AVS vCenter](./media/hcx-installation/avs-vsphere-client.png)

1. To download the VMware HCX OVA file, select **Administration** > **System Updates**.

    ![Get System Updates](./media/hcx-installation/administration-updates.png)

1. Select an OVF template to deploy to on-premises vCenter.  
    ![Select OVF template](./media/hcx-installation/select-template.png)

1. Select a name and location, then select a resource/cluster where HCX needs to be deployed then, review details and required resources.  
    ![Review template details](./media/hcx-installation/configure-template.png)

1. Review license terms, and if you agree, select required storage and network. Then select **Next**.

1. In **Customize template**, enter all required information. 
    ![Customize template](./media/hcx-installation/customize-template.png)  

1. Select **Next**, verify configuration, and select **Finish** to deploy HCX
    OVA.

## Activate HCX

After installation, perform the following steps.

1. Open HCX Manager at `https://HCXManagerIP:9443` and sign in with your username
 and your password. 

1. In **Licensing**, enter your **HCX Advanced Key**.  
    ![Enter HCX key](./media/hcx-installation/hcx-key.png)  
    
    > [!NOTE]
    > HCX Manager must have open internet access or a proxy
    configured.

1. Configure vCenter
    ![Configure VCenter](./media/hcx-installation/configure-vcenter.png)

1. In **Datacenter Location**, if needed, edit the datacenter location  
    ![Database location](./media/hcx-installation/system-location.png)

## Configure HCX 

1. Sign into on-premises vCenter, then select **Home** > **HCX**  
    ![HCX in VCenter](./media/hcx-installation/hcx-vcenter.png)

1. Select **Infrastructure** > **Site Pairing** > **Add a site pairing**
    ![Add site pairing](./media/hcx-installation/site-pairing.png)

1. Enter **Remote HCX URL**, **Username**, and **Password**. Then select **Connect**.

   The system shows the connected site  
    ![Site connection](./media/hcx-installation/site-connection.png)

1. Select **Interconnect** > **Multi-Site Service Mesh** > **Network Profiles** > **Create Network Profile**  
    ![Create network profile](./media/hcx-installation/create-network-profile.png)

1. Enter HCX IX and NE IP address ranges (a minimum of 2 IP addresses is
    required for IX and NE appliancees)
  ![Enter IP address ranges](./media/hcx-installation/enter-address-ranges.png)
     > [!NOTE]
     > The network extension appliance (HCX-NE) has a one-to-one
relationship with a distributed virtual switch (DVS).  
1. Now select **Compute profile** > **Create compute profile**.

1. Enter a compute profile name and select **Continue**.  
    ![Create compute profile](./media/hcx-installation/create-compute-profile.png)

1. Select services to enable such as migration, Network Extension, pr Disaster Recovery. Select **Continue**.
    ![Select services](./media/hcx-installation/select-services.png)

1. In **Select Service Resources**, select one or more service resources for
    which the selected HCX services should be enabled. Select **Continue**.
  ![Select service resources](./media/hcx-installation/select-service-resources.png)
    > [!NOTE]
    > Select specific clusters in which source
VMs are targeted for migration using HCX.
1. Select **Datastore** and select **Continue**. 
      
    Select each compute and storage resource for deploying the HCX
    Interconnect appliances. When multiple resources are selected, HCX uses the first resource selected until its capacity is
    exhausted.  
    ![Select deployment resources](./media/hcx-installation/deployment-resources.png)

1. Select the management network profile created in **Network Profiles**
    and select **Continue**.  
      
    Select the network profile through which the management interface of
    vCenter and the ESXi hosts can be reached. If you haven't already
    defined such a network profile, you can create it here.  
    ![Select management network profile](./media/hcx-installation/management-network-profile.png)

1. Select **Network Uplink** and select **Continue**
      
    Select one or more network profiles such that one of the following
    is true:  
    * The Interconnect Appliances on the remote site can be reached via
    this network  
    * The remote-side appliances can reach the local Interconnect
    Appliances via this network.  
    If you have point-to-point networks like Direct Connect which are
    not shared across multiple sites, you can skip this step, since
    compute profiles are shared with multiple sites. In such cases,
    Uplink Network profiles can be overridden and specified during the
    creation of the Interconnect Service mesh.  
    ![Select Uplink Network profile](./media/hcx-installation/uplink-network-profile.png)

1. Select **vMotion Network Profile** and select **Continue**  
      
    Select the network profile via which the vMotion interface of the
    ESXi hosts can be reached. If you haven't already defined such a
    network profile, you can create it here. If you don't have vMotion
    Network, select **Management Network Profile**.  
    ![Select vMotion Network profile](./media/hcx-installation/vmotion-network-profile.png)

1. Select **vSphere Replication Network Profile** and select **Continue**  
      
    Select a Network Profile via which the vSphere Replication
    interface of ESXi Hosts can be reached. In most cases, this profile
    is the same as the Management Network Profile.  
    ![Select vSphere Replication Network profile](./media/hcx-installation/vsphere-replication-network-profile.png)

1. Select **Distributed Switches for Network Extensions** and select
    **Continue**  
      
    Select the Distributed Virtual Switches on which you have networks
    to which the Virtual Machines that will be migrated are connected.

    ![Select Distributed Virtual Switches](./media/hcx-installation/distributed-switches.png)

1. Review connection rules and select **Continue**. Select **Finish** to create the compute profile.  
    ![Create compute profile](./media/hcx-installation/complete-compute-profile.png)

## Configure Network Uplink

Now configure the network profile change in AVS SDDC for Network
Uplink.

1. Sign in to SDDC NSX-T to create a new logical switch, or use an existing
    logical switch which can be used for Network Uplink between
    on-premises and AVS SDDC.

1. Create a network profile for HCX uplink in AVS SDDC which can be
    used for on-premises to AVS SDDC communication.  
    ![Create network profile for uplink](./media/hcx-installation/network-profile-uplink.png)

1. Enter a name for the network profile and atleast 4-5 free IP addresses
    based on the L2 network extension required.  
    ![Configure network profile for uplink](./media/hcx-installation/configure-uplink-profile.png)

1. Select **Create** to complete the AVS SDDC configuration

## Configure Service Mesh

Now configure Service Mesh between on-premises and AVS SDDC.

1. Sign in to AVS SDDC vCenter and select **HCX**.

1. Select **Infrastructure** > **Interconnect** > **Service
    Mesh** > **Create Service Mesh**.  Configure the network and compute profiles
    created in previous steps.    
      
    ![Configure service mesh](./media/hcx-installation/configure-service-mesh.png)

3.  Select **Create Service Mesh** and select **Continue**  
      
    Select paired sites between which to enable hybrid
    mobility.  
    ![Select paired sites](./media/hcx-installation/select-paired-sites.png)

4.  Select **Compute profile** and select **Continue**  
      
    Select one compute profile each in the source and remote sites to
    enable hybridity services. The selections will define the
    resources, where Virtual Machines will be able to consume HCX
    services.  
      
    ![Enable hybridity services](./media/hcx-installation/enable-hybridity.png)

5.  Select services to be enabled for HCX and select **Continue**  
      
    ![Select HCX services](./media/hcx-installation/hcx-services.png)

6.  In **Advanced Configuration - Override Uplink Network profiles** select **Continue**  
      
    Uplink network profiles are used to connect to the network via
    which the remote site’s interconnect appliances can be reached.  
      
    ![Overwride uplink profiles](./media/hcx-installation/override-uplink-profiles.png)

7.  In **Advanced Configuration – Network Extension Appliance Scale Out**, select **Configure the Network Extension Appliance Scale Out**  
      
    ![Network extension scale out](./media/hcx-installation/network-extension-scale-out.png)

8.  Enter the appliance count corresponding to the DVS switch count  
      
    ![Configure appliance count](./media/hcx-installation/appliance-scale.png)

9.  In **Advanced Configuration - Traffic Engineering**, select **Continue**  
      
    ![Configure traffic engineering](./media/hcx-installation/traffic-engineering.png)

10. Review the topology preview and select **Continue**. Then, enter a user-friendly name for this Service Mesh and select
    **Finish** to complete.  
      
    ![Complete Service Mesh](./media/hcx-installation/complete-service-mesh.png)

The Service Mesh is deployed and configured.  
      
![Deployed service mesh](./media/hcx-installation/deployed-service-mesh.png)

## Check appliance status
To check the status of the appliance, select **Interconnect** > **Appliances**. 
      
![Appliance status](./media/hcx-installation/appliance-status.png)



## Next steps

When **Tunnel Status** is **UP** and green, you are ready for
    migration and protecting VMs using HCX Disaster Recovery.