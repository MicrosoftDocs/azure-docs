---
title: Planning the Azure VMware Solution deployment
description: This article outlines an Azure VMware Solution deployment workflow.  The final result is an environment ready for virtual machine (VM) creation and migration.
ms.topic: tutorial
ms.date: 03/17/2021
---

# Planning the Azure VMware Solution deployment

This article provides you the planning process to identify and collect the information you'll use during the deployment. As you plan your deployment, make sure to document the information you gather for easy reference during the deployment.

The steps outlined in this quick start give you a production-ready environment for creating virtual machines (VMs) and migration. 

>[!IMPORTANT]
>Before you create your Azure VMware Solution resource, follow the [How to enable Azure VMware Solution resource](enable-azure-vmware-solution.md) article to submit a support ticket to have your hosts allocated. Once the support team receives your request, it takes up to five business days to confirm your request and allocate your hosts. If you have an existing Azure VMware Solution private cloud and want more hosts allocated, you'll go through the same process. 

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

## (Optional) Extend your networks

You can extend network segments from on-premises to Azure VMware Solution, and if you do, identify those networks now.  

Keep in mind that:

- If you plan to extend networks from on-premises, those networks must connect to a [vSphere Distributed Switch (vDS)](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.networking.doc/GUID-B15C6A13-797E-4BCB-B9D9-5CBC5A60C3A6.html) in your on-premises VMware environment.  
- If the network(s) you wish to extend live on a [vSphere Standard Switch](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.networking.doc/GUID-350344DE-483A-42ED-B0E2-C811EE927D59.html), then they can't be extended.

>[!NOTE]
>These networks are extended as a final step of the configuration, not during deployment.

## Attach Azure Virtual Network to Azure VMware Solution

To provide connectivity to Azure VMware Solution, an ExpressRoute is built from Azure VMware Solution private cloud to an ExpressRoute virtual network gateway.

You can use an *existing* OR *new* ExpressRoute virtual network gateway.

:::image type="content" source="media/pre-deployment/azure-vmware-solution-expressroute-diagram.png" alt-text="Identity - Azure Virtual Network to attach Azure VMware Solution" border="false":::

### Use an existing ExpressRoute virtual network gateway

If you plan to use an *existing* ExpressRoute virtual network gateway, the Azure VMware Solution ExpressRoute circuit is established as a post-deployment step. In this case, leave the **Virtual Network** field blank.

As a general recommendation, it's acceptable to use an existing ExpressRoute virtual network gateway. For planning purposes, make note of which ExpressRoute virtual network gateway you'll use and then continue to the next step.

### Create a new ExpressRoute virtual network gateway

When you create a *new* ExpressRoute virtual network gateway, you can use an existing Azure Virtual Network or create a new one.  

- For an existing Azure Virtual network:
   1. Identify an Azure Virtual network where there are no pre-existing ExpressRoute virtual network gateways.
   2. Prior to deployment, create a [GatewaySubnet](../expressroute/expressroute-howto-add-gateway-portal-resource-manager.md#create-the-gateway-subnet) in the Azure Virtual Network.

- For a new Azure Virtual Network, you can create it in advance or during deployment. Select the **Create new** link under the **Virtual Network** list.

The below image shows the **Create a private cloud** deployment screen with the **Virtual Network** field highlighted.

:::image type="content" source="media/pre-deployment/azure-vmware-solution-deployment-screen-vnet-circle.png" alt-text="Screenshot of the Azure VMware Solution deployment screen with Virtual Network field highlighted.":::

>[!NOTE]
>Any virtual network that is going to be used or created may be seen by your on-premises environment and Azure VMware Solution, so make sure whatever IP segment you use in this virtual network and subnets do not overlap.

## VMware HCX Network Segments

VMware HCX is a technology bundled in with Azure VMware Solution. The primary use cases for VMware HCX are workload migrations and disaster recovery. If you plan to do either, it's best to plan out the networking now.   Otherwise, you can skip and continue to the next step.

[!INCLUDE [hcx-network-segments](includes/hcx-network-segments.md)]

## Next steps
Now that you've gathered and documented the needed information continue to the next section to create your Azure VMware Solution private cloud.

> [!div class="nextstepaction"]
> [Deploy Azure VMware Solution](deploy-azure-vmware-solution.md)
