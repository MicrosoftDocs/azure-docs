---
title: Planning the Azure VMware Solution deployment
description: This article outlines an Azure VMware Solution deployment workflow.  The final result is an environment ready for virtual machine (VM) creation and migration.
ms.topic: tutorial
ms.date: 03/17/2021
---

# Planning the Azure VMware Solution deployment

This article provides you the planning process to identify and collect the information you'll use during the deployment. As you plan your deployment, make sure to document the information you gather for easy reference during the deployment.

The steps outlined in this quick start give you a production-ready environment for creating virtual machines (VMs) and migration. 

To track the data you'll be collecting, get the [HCX planning checklist](https://www.virtualworkloads.com/2021/04/hcx-planning-checklist/).

> [!IMPORTANT]
> It's important to request a host quota early as you prepare to create your Azure VMware Solution resource. You can request a host quota now, so when the planning process is finished, you're ready to deploy the Azure VMware Solution private cloud. After the support team receives your request for a host quota, it takes up to five business days to confirm your request and allocate your hosts. If you have an existing Azure VMware Solution private cloud and want more hosts allocated, you complete the same process. For more information, see the following links, depending on the type of subscription you have:
> - [EA customers](enable-azure-vmware-solution.md?tabs=azure-portal#request-host-quota-for-ea-customers)
> - [CSP customers](enable-azure-vmware-solution.md?tabs=azure-portal#request-host-quota-for-csp-customers)

## Subscription

Identify the subscription you plan to use to deploy Azure VMware Solution.  You can either create a new subscription or reuse an existing one.

>[!NOTE]
>The subscription must be associated with a Microsoft Enterprise Agreement or a Cloud Solution Provider Azure plan. For more information, see [How to enable Azure VMware Solution resource](enable-azure-vmware-solution.md).

## Resource group

Identify the resource group you want to use for your Azure VMware Solution.  Generally, a resource group is created specifically for Azure VMware Solution, but you can use an existing resource group.

## Region

Identify the region you want Azure VMware Solution deployed.  For more information, see the [Azure Products Available By Region Guide](https://azure.microsoft.com/en-us/global-infrastructure/services/?products=azure-vmware).

## Resource name

Define the resource name you'll use during deployment.  The resource name is a friendly and descriptive name in which you title your Azure VMware Solution private cloud.

>[!IMPORTANT]
>The name must not exceed 40 characters. If the name exceeds this limit, you won't be able to create public IP addresses for use with the private cloud. 

## Size hosts

Identify the size hosts that you want to use when deploying Azure VMware Solution.  For a complete list, see the [Azure VMware Solution private clouds and clusters](concepts-private-clouds-clusters.md#hosts) documentation.

## Number of clusters and hosts

The first Azure VMware Solution deployment you do will consist of a private cloud containing a single cluster. For your deployment, you'll need to define the number of hosts you want to deploy to the first cluster.

>[!NOTE]
>The minimum number of hosts per cluster is three, and the maximum is 16. The maximum number of clusters per private cloud is four. 

For more information, see the [Azure VMware Solution private cloud and clusters](concepts-private-clouds-clusters.md#clusters) documentation.

>[!TIP]
>You can always extend the cluster and add additional clusters later if you need to go beyond the initial deployment number.

## IP address segment for private cloud management

The first step in planning the deployment is to plan out the IP segmentation. Azure VMware Solution requires a /22 CIDR network. This address space is carved up into smaller network segments (subnets) and used for Azure VMware Solution management segments, including vCenter, VMware HCX, NSX-T, and vMotion functionality. The visualization below highlights where this segment will be used.

This /22 CIDR network address block shouldn't overlap with any existing network segment you already have on-premises or in Azure.

**Example:** 10.0.0.0/22

For a detailed breakdown of how the /22 CIDR network is broken down per private cloud [Network planning checklist](tutorial-network-checklist.md#routing-and-subnet-considerations).

:::image type="content" source="media/pre-deployment/management-vmotion-vsan-network-ip-diagram.png" alt-text="Identify - IP address segment" border="false":::  

## IP address segment for virtual machine workloads

Like with any VMware environment, the virtual machines must connect to a network segment. In Azure VMware Solution, there are two types of segments, L2 extended segments (discussed later) and NSX-T network segments. As the production deployment of Azure VMware Solution expands, there is often a combination of L2 extended segments from on-premises and local NSX-T network segments. To plan the initial deployment, In Azure VMware Solution, identify a single network segment (IP network). This network must not overlap with any network segments on-premises or within the rest of Azure and must not be within the /22 network segment defined earlier.

This network segment is used primarily for testing purposes during the initial deployment.

>[!NOTE]
>This network or networks will not be needed during the deployment. They get created as a post-deployment step.
  
**Example:** 10.0.4.0/24

:::image type="content" source="media/pre-deployment/nsx-segment-diagram.png" alt-text="Identify - IP address segment for virtual machine workloads" border="false":::     

## Attach Azure VMware Solution to an Azure Virtual Network

To provide connectivity to Azure VMware Solution, an ExpressRoute connects from the private cloud to an Azure Virtual Network  gateway.  

Define whether you want to use an *existing* OR *new* ExpressRoute virtual network gateway.

:::image type="content" source="media/pre-deployment/azure-vmware-solution-expressroute-diagram.png" alt-text="Diagram that shows the Azure Virtual Network attached to Azure VMware Solution" border="false":::


## VMware HCX network segments

VMware HCX is a technology that's bundled with Azure VMware Solution. The primary use cases for VMware HCX are workload migrations and disaster recovery. If you plan to do either, it's best to plan out the networking now. Otherwise, you can skip and continue to the next step.

[!INCLUDE [hcx-network-segments](includes/hcx-network-segments.md)]

## Extend your networks

Optionally, you can extend network segments from on-premises to Azure VMware Solution. If you do extend network segments, identify those networks now.  

Here are some factors to consider:

- If you plan to extend networks from on-premises, those networks must connect to a [vSphere Distributed Switch (vDS)](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.networking.doc/GUID-B15C6A13-797E-4BCB-B9D9-5CBC5A60C3A6.html) in your on-premises VMware environment.  
- Networks that are on a [vSphere Standard Switch](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.networking.doc/GUID-350344DE-483A-42ED-B0E2-C811EE927D59.html) can't be extended.

>[!NOTE]
>These networks are extended as a final step of the configuration, not during deployment.
>
## Next steps
Now that you've gathered and documented the needed information continue to the next section to create your Azure VMware Solution private cloud.

> [!div class="nextstepaction"]
> [Deploy Azure VMware Solution](deploy-azure-vmware-solution.md)
> 
