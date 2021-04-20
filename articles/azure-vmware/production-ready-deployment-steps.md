---
title: Plan the Azure VMware Solution deployment
description: This article outlines an Azure VMware Solution deployment workflow.  The final result is an environment ready for virtual machine (VM) creation and migration.
ms.topic: tutorial
ms.custom: contperf-fy21q4
ms.date: 04/23/2021
---

# Plan the Azure VMware Solution deployment

This quick start provides you with the planning process to identify and collect the information you'll need for your deployment. As you plan your deployment, make sure to document the information you gather for easy reference during the deployment.

The steps outlined give you a production-ready environment for creating virtual machines (VMs) and migration. 

>[!TIP]
>To track the data you'll be collecting, use the [VMware HCX planning checklist](https://www.virtualworkloads.com/2021/04/hcx-planning-checklist/).


## Request a host quota 

It's important to request a host quota early as you prepare to create your Azure VMware Solution resource. You can request a host quota now, so when the planning process is finished, you're ready to deploy the Azure VMware Solution private cloud. After the support team receives your request for a host quota, it takes up to five business days to confirm your request and allocate your hosts. If you have an existing Azure VMware Solution private cloud and want more hosts allocated, you complete the same process. For more information, see the following links, depending on the type of subscription you have:
- [EA customers](enable-azure-vmware-solution.md?tabs=azure-portal#request-host-quota-for-ea-customers)
- [CSP customers](enable-azure-vmware-solution.md?tabs=azure-portal#request-host-quota-for-csp-customers)

## Identify the subscription

Identify the subscription you plan to use to deploy Azure VMware Solution.  You can either create a new subscription or reuse an existing one.

>[!NOTE]
>The subscription must be associated with a Microsoft Enterprise Agreement or a Cloud Solution Provider Azure plan. For more information, see [How to enable Azure VMware Solution resource](enable-azure-vmware-solution.md).

## Identify the resource group

Identify the resource group you want to use for your Azure VMware Solution.  Generally, a resource group is created specifically for Azure VMware Solution, but you can use an existing resource group.

## Identify the region or location

Identify the region you want Azure VMware Solution deployed.  For more information, see the [Azure Products Available By Region Guide](https://azure.microsoft.com/en-us/global-infrastructure/services/?products=azure-vmware).

## Identify the resource name

Define the resource name you'll use during deployment.  The resource name is a friendly and descriptive name in which you title your Azure VMware Solution private cloud.

>[!IMPORTANT]
>The name must not exceed 40 characters. If the name exceeds this limit, you won't be able to create public IP addresses for use with the private cloud. 

## Identify the size hosts

Identify the size hosts that you want to use when deploying Azure VMware Solution.  

[!INCLUDE [disk-capabilities-of-the-host](includes/disk-capabilities-of-the-host.md)]

## Determine the number of clusters and hosts

The first Azure VMware Solution deployment you do consists of a private cloud containing a single cluster. For your deployment, you'll need to define the number of hosts you want to deploy to the first cluster.

[!INCLUDE [hosts-minimum-initial-deployment-statement](includes/hosts-minimum-initial-deployment-statement.md)]

## Define the IP address segment for private cloud management

The first step in planning the deployment is to plan out the IP segmentation. Azure VMware Solution requires a /22 CIDR network. This address space is carved up into smaller network segments (subnets) and used for Azure VMware Solution management segments, including vCenter, VMware HCX, NSX-T, and vMotion functionality. The visualization below highlights where this segment will be used.

This /22 CIDR network address block shouldn't overlap with any existing network segment you already have on-premises or in Azure.

**Example:** 10.0.0.0/22

For a detailed breakdown of how the /22 CIDR network is broken down per private cloud [Network planning checklist](tutorial-network-checklist.md#routing-and-subnet-considerations).

:::image type="content" source="media/pre-deployment/management-vmotion-vsan-network-ip-diagram.png" alt-text="Identify - IP address segment" border="false":::  

## Define the IP address segment for VM workloads

Like with any VMware environment, the VMs must connect to a network segment. In Azure VMware Solution, there are two types of segments, L2 extended segments (discussed later) and NSX-T network segments. As the production deployment of Azure VMware Solution expands, there is often a combination of L2 extended segments from on-premises and local NSX-T network segments. To plan the initial deployment, In Azure VMware Solution, identify a single network segment (IP network). This network must not overlap with any network segments on-premises or within the rest of Azure and must not be within the /22 network segment defined earlier.

This network segment is used primarily for testing purposes during the initial deployment.

>[!NOTE]
>This network or networks will not be needed during the deployment. They get created as a post-deployment step.
  
**Example:** 10.0.4.0/24

:::image type="content" source="media/pre-deployment/nsx-segment-diagram.png" alt-text="Identify - IP address segment for virtual machine workloads" border="false":::     

## Define the virtual network gateway

>[!IMPORTANT]
>You can connect to a virtual network gateway in an Azure Virtual WAN, but it is out of scope for this quick start.

An Azure VMware Solution private cloud requires an Azure Virtual Network and an ExpressRoute circuit.  

Define whether you want to use an *existing* OR *new* ExpressRoute virtual network gateway.  If you decide to use a *new* virtual network gateway, you'll create it after you create your private cloud. It's acceptable to use an existing ExpressRoute virtual network gateway, and for planning purposes, make note of which ExpressRoute virtual network gateway you'll use. 

:::image type="content" source="media/pre-deployment/azure-vmware-solution-expressroute-diagram.png" alt-text="Diagram that shows the Azure Virtual Network attached to Azure VMware Solution" border="false":::



## Define VMware HCX network segments

VMware HCX is a technology that's bundled with Azure VMware Solution. The primary use cases for VMware HCX are workload migrations and disaster recovery. If you plan to do either, it's best to plan out the networking now. Otherwise, you can skip and continue to the next step.

[!INCLUDE [hcx-network-segments](includes/hcx-network-segments.md)]

## Determine whether to extend your networks

Optionally, you can extend network segments from on-premises to Azure VMware Solution. 

If you do extend network segments, identify those networks now following these guidelines:

- Networks must connect to a [vSphere Distributed Switch (vDS)](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.networking.doc/GUID-B15C6A13-797E-4BCB-B9D9-5CBC5A60C3A6.html) in your on-premises VMware environment.  
- Networks that are on a [vSphere Standard Switch](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.networking.doc/GUID-350344DE-483A-42ED-B0E2-C811EE927D59.html) can't be extended.

>[!IMPORTANT]
>These networks are extended as a final step of the configuration, not during deployment.


## Next steps
Now that you've gathered and documented the needed information continue to the next section to create your Azure VMware Solution private cloud.

> [!div class="nextstepaction"]
> [Deploy Azure VMware Solution](deploy-azure-vmware-solution.md)
> 
