---
title: Planning the Azure VMware Solution deployment
description: This article outlines an Azure VMware Solution deployment workflow.  The final result is an environment ready for virtual machine (VM) creation and migration.
ms.topic: tutorial
ms.date: 10/16/2020
---

# Planning the Azure VMware Solution deployment

In this article, we provide you the planning process to identify and collect data used during the deployment. As you plan your deployment, make sure to document the information you gather for easy reference during the deployment.

The processes of this quick start results in a production-ready environment for creating virtual machines (VMs) and migration. 

>[!IMPORTANT]
>Before you create your Azure VMware Solution resource, follow the [How to enable Azure VMware Solution resource](enable-azure-vmware-solution.md) article to submit a support ticket to have your nodes allocated. Once the support team receives your request, it takes up to five business days to confirm your request and allocate your nodes. If you have an existing Azure VMware Solution private cloud and want more nodes allocated, you'll go through the same process. 


## Subscription

Identify the subscription you plan to use to deploy Azure VMware Solution.  You can either create a new subscription or reuse an existing one.

>[!NOTE]
>The subscription must be associated with a Microsoft Enterprise Agreement.

## Resource group

Identify the resource group you want to use for your Azure VMware Solution.  Generally, a resource group is created specifically for Azure VMware Solution, but you can use an existing resource group.

## Region

Identify the region you want Azure VMware Solution deployed.  For more information, see the [Azure Products Available By Region Guide](https://azure.microsoft.com/en-us/global-infrastructure/services/?products=azure-vmware).

## Resource name

Define the resource name you'll use during deployment.  The resource name is a friendly and descriptive name in which you title your Azure VMware Solution private cloud.

## Size nodes

Identify the size nodes that you want to use when deploying Azure VMware Solution.  For a complete list, see the [Azure VMware Solution private clouds and clusters](concepts-private-clouds-clusters.md#hosts) documentation.

## Number of hosts

Define the number of hosts that you want to deploy into the Azure VMware Solution private cloud.  The minimum node count is three, and the maximum is 16 per cluster.  For more information, see the [Azure VMware Solution private cloud and clusters](concepts-private-clouds-clusters.md#clusters) documentation.

You can always extend the cluster later if you need to go beyond the initial deployment number.

## vCenter admin password
Define the vCenter admin password.  During the deployment, you'll create a vCenter admin password. The password is to the cloudadmin@vsphere.local admin account during the vCenter build. You'll use it to sign in to vCenter.

## NSX-T admin password
Define the NSX-T admin password.  During the deployment, you'll create an NSX-T admin password. The password is assigned to the admin user in the NSX account during the NSX build. You'll use it to log into NSX-T Manager.

## IP address segment

The first step in planning the deployment is to plan out the IP segmentation.  Azure VMware Solution ingests a /22 network that you provide. Then carves it up into smaller segments and then uses those IP segments for vCenter, VMware HCX, NSX-T, and vMotion.

Azure VMware Solution connects to your Microsoft Azure Virtual Network via an internal ExpressRoute circuit. In most cases, it connects to your data center via ExpressRoute Global Reach. 

Azure VMware Solution, your existing Azure environment, and your on-premises environment all exchange routes (typically). That being the case, the /22 CIDR network address block you define in this step shouldn't overlap anything you already have on-premises or Azure.

**Example:** 10.0.0.0/22

For more information, see the [Network planning checklist](tutorial-network-checklist.md#routing-and-subnet-considerations).

:::image type="content" source="media/pre-deployment/management-vmotion-vsan-network-ip-diagram.png" alt-text="Identify - IP address segment" border="false":::  

## IP address segment for virtual machine workloads

Identify an IP segment to create your first network (NSX segment) in your private cloud.  In other words, you want to create a network segment on Azure VMware Solution so you can deploy VMs onto Azure VMware Solution.   

Even if you only plan on extending L2 networks, create a network segment that will be useful for validating the environment.

Remember, any IP segments created must be unique across your Azure and on-premises footprint.  

**Example:** 10.0.4.0/24

:::image type="content" source="media/pre-deployment/nsx-segment-diagram.png" alt-text="Identify - IP address segment for virtual machine workloads" border="false":::     

## (Optional) Extend networks

You can extend network segments from on-premises to Azure VMware Solution, and if you do, identify those networks now.  

Keep in mind that:

- If you plan to extend networks from on-premises, those networks must connect to a [vSphere Distributed Switch (vDS)](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.networking.doc/GUID-B15C6A13-797E-4BCB-B9D9-5CBC5A60C3A6.html) in your on-premises VMware environment.  
- If the network(s) you wish to extend live on a [vSphere Standard Switch](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.networking.doc/GUID-350344DE-483A-42ED-B0E2-C811EE927D59.html), then they can't be extended.

## ExpressRoute Global Reach peering network

Identify a `/29` CIDR network address block, which is required for the ExpressRoute Global Reach peering. Remember, any IP segments created must be unique across your Azure VMware Solution and on-premises footprint. The IPs in this segment are used at each end of the ExpressRoute Global Reach connection to connect the Azure VMware Solution ExpressRoute circuit with the on-premises ExpressRoute circuit. 

**Example:** 10.1.0.0/29

:::image type="content" source="media/pre-deployment/expressroute-global-reach-ip-diagram.png" alt-text="Identify - ExpressRoute Global Reach peering network" border="false":::

## Azure Virtual Network to attach Azure VMware Solution

To access your Azure VMware Solution private cloud, the ExpressRoute circuit, which comes with Azure VMware Solution, must attach to an Azure Virtual Network.  During deployment, you can define a new virtual network or choose an existing one.

The ExpressRoute circuit from Azure VMware Solution connects to an ExpressRoute gateway in the Azure Virtual Network that you define in this step.  

>[!IMPORTANT]
>You can use an existing ExpressRoute Gateway to connect to Azure VMware Solution as long as it does not exceed the limit of four ExpressRoute circuits per virtual network.  However, to access Azure VMware Solution from on-premises through ExpressRoute, you must have ExpressRoute Global Reach since the ExpressRoute gateway does not provide transitive routing between its connected circuits.  

If you want to connect the ExpressRoute circuit from Azure VMware Solution to an existing ExpressRoute gateway, you can do it after deployment.  

So, in summary, do you want to connect Azure VMware Solution to an existing Express Route Gateway?  

* **Yes** = Identify the virtual network that doesn't get used during deployment.
* **No** = Identify an existing virtual network or create a new one during deployment.

Either way, document what you want to do in this step.

>[!NOTE]
>This virtual network is seen by your on-premises environment and Azure VMware Solution, so make sure whatever IP segment you use in this virtual network and subnets do not overlap.

:::image type="content" source="media/pre-deployment/azure-vmware-solution-expressroute-diagram.png" alt-text="Identity - Azure Virtual Network to attach Azure VMware Solution" border="false":::

## VMware HCX Network Segments

VMware HCX is a technology bundled in with Azure VMware Solution. The primary use cases for VMware HCX are workload migrations and disaster recovery. If you plan to do either, it's best to plan out the networking now.   Otherwise, you can skip and continue to the next step.

[!INCLUDE [hcx-network-segments](includes/hcx-network-segments.md)]

## Next steps
Now that you've gathered and documented the needed information, continue to the next section to create your Azure VMware Solution private cloud.

> [!div class="nextstepaction"]
> [Deploy Azure VMware Solution](deploy-azure-vmware-solution.md)
