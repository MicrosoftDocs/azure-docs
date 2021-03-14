---
title: Planning the Azure VMware Solution deployment
description: This article outlines an Azure VMware Solution deployment workflow.  The final result is an environment ready for virtual machine (VM) creation and migration.
ms.topic: tutorial
ms.date: 03/13/2021
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

In the Azure VMware Solution, you'll deploy a private cloud and create multiple clusters. For your deployment, you'll need to define the number of clusters and the f hosts that you want to deploy in each cluster. The minimum number of hosts per cluster is three, and the maximum is 16. The maximum number of clusters per private cloud is four. The maximum number of nodes per private cloud is 64.

For more information, see the [Azure VMware Solution private cloud and clusters](concepts-private-clouds-clusters.md#clusters) documentation.

>[!TIP]
>You can always extend the cluster later if you need to go beyond the initial deployment number.

## vCenter admin password
Define the vCenter admin password. During the deployment, you'll create a vCenter admin password. The password is assigned to the cloudadmin@vsphere.local admin account during the vCenter build. You'll use these credentials to sign in to vCenter.

## NSX-T admin password
Define the NSX-T admin password. During the deployment, you'll create an NSX-T admin password. The password is assigned to the admin user in the NSX account during the NSX build. You'll use these credentials to sign in to NSX-T Manager.

## IP address segment for private cloud management

The first step in planning the deployment is to plan out the IP segmentation. Azure VMware Solution requires a /22 CIDR network. This address space carves it up into smaller network segments (subnets) and used for vCenter, VMware HCX, NSX-T, and vMotion functionality.

This /22 CIDR network address block shouldn't overlap with anything existing network segment you already have on-premises or in Azure.

**Example:** 10.0.0.0/22

Azure VMware Solution connects to your Microsoft Azure Virtual Network through an internal ExpressRoute Global Reach circuit (D-MSEE in below visualization). This functionality is part of the Azure VMware Solution service and won't be charged.

For more information, see the [Network planning checklist](tutorial-network-checklist.md#routing-and-subnet-considerations).

:::image type="content" source="media/pre-deployment/management-vmotion-vsan-network-ip-diagram.png" alt-text="Identify - IP address segment" border="false":::  

## IP address segment for virtual machine workloads

Identify an IP segment to create your first network for workloads  (NSX segment) in your private cloud. In other words, you’ll need to create a network segment on Azure VMware Solution so you can deploy VMs in Azure VMware Solution.

Even if you plan to extend networks from on-premises into Azure VMware Solution (L2), you still need to create a network segment that validates the environment.

Remember, any IP segments created must be unique across your Azure and on-premises footprint.
  
**Example:** 10.0.4.0/24

:::image type="content" source="media/pre-deployment/nsx-segment-diagram.png" alt-text="Identify - IP address segment for virtual machine workloads" border="false":::     

## (Optional) Extend networks

You can extend network segments from on-premises to Azure VMware Solution, and if you do, identify those networks now.  

Keep in mind that:

- If you plan to extend networks from on-premises, those networks must connect to a [vSphere Distributed Switch (vDS)](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.networking.doc/GUID-B15C6A13-797E-4BCB-B9D9-5CBC5A60C3A6.html) in your on-premises VMware environment.  
- If the network(s) you wish to extend live on a [vSphere Standard Switch](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.networking.doc/GUID-350344DE-483A-42ED-B0E2-C811EE927D59.html), then they can't be extended.

## Attach Azure Virtual Network to Azure VMware Solution

In this step, you'll identify an ExpressRoute virtual network gateway and the supporting Azure Virtual Network used to connect the Azure VMware Solution ExpressRoute circuit.  The ExpressRoute circuit facilitates connectivity to and from the Azure VMware Solution private cloud to other Azure services, Azure resources, and on-premises environments.

You can use an *existing* OR *new* ExpressRoute virtual network gateway.

:::image type="content" source="media/pre-deployment/azure-vmware-solution-expressroute-diagram.png" alt-text="Identity - Azure Virtual Network to attach Azure VMware Solution" border="false":::

### Use an existing ExpressRoute virtual network gateway

If you use an *existing* ExpressRoute virtual network gateway, the Azure VMware Solution ExpressRoute circuit is established after you deploy the private cloud. In this case, leave the **Virtual Network** field blank.  

Make note of which ExpressRoute virtual network gateway you'll use and continue to the next step.

### Create a new ExpressRoute virtual network gateway

When you create a *new* ExpressRoute virtual network gateway, you can use an existing Azure Virtual Network or create a new one.  

- For an existing Azure Virtual network:
   1. Verify there are no pre-existing ExpressRoute virtual network gateways in the virtual network. 
   1. Select the existing Azure Virtual Network from the **Virtual Network** list.

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
