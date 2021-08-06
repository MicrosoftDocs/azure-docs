---
title: Plan the Azure VMware Solution deployment
description: Learn how to plan your Azure VMware Solution deployment.  
ms.topic: tutorial
ms.custom: contperf-fy21q4
ms.date: 07/07/2021
---

# Plan the Azure VMware Solution deployment

Planning your Azure VMware Solution deployment is critical for a successful production-ready environment for creating virtual machines (VMs) and migration.  During the planning process, you'll identify and gather what's needed for your deployment. As you plan, make sure to document the information you gather for easy reference during the deployment. A successful deployment results in a production-ready environment for creating virtual machines (VMs) and migration. 

In this how-to, you'll':

> [!div class="checklist"]
> * Identify the Azure subscription, resource group, region, and resource name
> * Identify the size hosts and determine the number of clusters and hosts
> * Request a host quota for eligible Azure plan
> * Identify the /22 CIDR IP segment for private cloud management
> * Identify a single network segment
> * Define the virtual network gateway
> * Define VMware HCX network segments

After you're finished, follow the recommended next steps at the end to continue with the steps of this getting started guide.


## Identify the subscription

Identify the subscription you plan to use to deploy Azure VMware Solution.  You can create a new subscription or use an existing one.

>[!NOTE]
>The subscription must be associated with a Microsoft Enterprise Agreement (EA) or a Cloud Solution Provider (CSP) Azure plan. For more information, see [Eligibility criteria](request-host-quota-azure-vmware-solution.md#eligibility-criteria).

## Identify the resource group

Identify the resource group you want to use for your Azure VMware Solution.  Generally, a resource group is created specifically for Azure VMware Solution, but you can use an existing resource group.

## Identify the region or location

Identify the [region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-vmware) you want Azure VMware Solution deployed. 

## Define the resource name

The resource name is a friendly and descriptive name in which you title your Azure VMware Solution private cloud, for example, **MyPrivateCloud**.

>[!IMPORTANT]
>The name must not exceed 40 characters. If the name exceeds this limit, you won't be able to create public IP addresses for use with the private cloud. 

## Identify the size hosts

Identify the size hosts that you want to use when deploying Azure VMware Solution.  

[!INCLUDE [disk-capabilities-of-the-host](includes/disk-capabilities-of-the-host.md)]

## Determine the number of clusters and hosts

The first Azure VMware Solution deployment you do consists of a private cloud containing a single cluster. You'll need to define the number of hosts you want to deploy to the first cluster for your deployment.

[!INCLUDE [hosts-minimum-initial-deployment-statement](includes/hosts-minimum-initial-deployment-statement.md)]


## Request a host quota 

It's important to request a host quota early, so after you've finished the planning process, you're ready to deploy your Azure VMware Solution private cloud. 

Before you request a host quota, make sure you've identified the Azure subscription, resource group, and region.  Also make sure you've identified the size hosts and determine the number of clusters and hosts you'll need.  After the support team receives your request for a host quota, it takes up to five business days to confirm your request and allocate your hosts.

- [EA customers](request-host-quota-azure-vmware-solution.md#request-host-quota-for-ea-customers)
- [CSP customers](request-host-quota-azure-vmware-solution.md#request-host-quota-for-csp-customers)


## Define the IP address segment for private cloud management

Azure VMware Solution requires a /22 CIDR network, for example, `10.0.0.0/22`. This address space is carved into smaller network segments (subnets) and used for Azure VMware Solution management segments, including vCenter, VMware HCX, NSX-T, and vMotion functionality. The diagram highlights Azure VMware Solution management IP address segments.

:::image type="content" source="media/pre-deployment/management-vmotion-vsan-network-ip-diagram.png" alt-text="Diagram showing Azure VMware Solution management IP address segments." border="false":::  

>[!IMPORTANT]
>The /22 CIDR network address block shouldn't overlap with any existing network segment you already have on-premises or in Azure. For details of how the /22 CIDR network is broken down per private cloud, see [Routing and subnet considerations](tutorial-network-checklist.md#routing-and-subnet-considerations).



## Define the IP address segment for VM workloads

Like with any VMware environment, the VMs must connect to a network segment.  As the production deployment of Azure VMware Solution expands, there is often a combination of L2 extended segments from on-premises and local NSX-T network segments. 

For the initial deployment, identify a single network segment (IP network), for example, `10.0.4.0/24`. This network segment is used primarily for testing purposes during the initial deployment.  The address block shouldn't overlap with any network segments on-premises or within Azure and shouldn't be within the /22 network segment already defined. 
  
:::image type="content" source="media/pre-deployment/nsx-segment-diagram.png" alt-text="Identify - IP address segment for virtual machine workloads" border="false":::     


## Define the virtual network gateway

Azure VMware Solution requires an Azure Virtual Network and an ExpressRoute circuit.  Define whether you want to use an *existing* OR *new* ExpressRoute virtual network gateway.  If you decide to use a *new* virtual network gateway, you'll create it after you create your private cloud. It's acceptable to use an existing ExpressRoute virtual network gateway, and for planning purposes, make note of which ExpressRoute virtual network gateway you'll use. 

:::image type="content" source="media/pre-deployment/azure-vmware-solution-expressroute-diagram.png" alt-text="Diagram that shows the Azure Virtual Network attached to Azure VMware Solution" border="false":::

>[!IMPORTANT]
>You can connect to a virtual network gateway in an Azure Virtual WAN, but it is out of scope for this quick start.

## Define VMware HCX network segments

VMware HCX is an application mobility platform designed for simplifying application migration, workload rebalancing, and business continuity across data centers and clouds. You can migrate your VMware workloads to Azure VMware Solution and other connected sites through various migration types. 

VMware HCX Connector deploys a subset of virtual appliances (automated) that require multiple IP segments. When you create your network profiles, you use the IP segments. Identify the following for the VMware HCX deployment, which supports a pilot or small product use case.  Depending on the needs of your migration, modify as necessary. 

- **Management network:** When deploying VMware HCX on-premises, you'll need to identify a management network for VMware HCX.  Typically, it's the same management network used by your on-premises VMware cluster.  At a minimum, identify **two** IPs on this network segment for VMware HCX. You might need larger numbers, depending on the scale of your deployment beyond the pilot or small use case.

  >[!NOTE]
  >Preparing for large environments, instead of using the management network used for the on-premises VMware cluster, create a new /26 network and present that network as a port group to your on-premises VMware cluster.  You can then create up to 10 service meshes and 60 network extenders (-1 per service mesh). You can stretch **eight** networks per network extender by using Azure VMware Solution private clouds.

- **Uplink network:** When deploying VMware HCX on-premises, you'll need to identify a Uplink network for VMware HCX. Use the same network which you will be using for the Management network. 

- **vMotion network:** When deploying VMware HCX on-premises, you'll need to identify a vMotion network for VMware HCX.  Typically, it's the same network used for vMotion by your on-premises VMware cluster.  At a minimum, identify **two** IPs on this network segment for VMware HCX. You might need larger numbers, depending on the scale of your deployment beyond the pilot or small use case.

  The vMotion network must be exposed on a distributed virtual switch or vSwitch0. If it's not, modify the environment to accommodate.

  >[!NOTE]
  >Many VMware environments use non-routed network segments for vMotion, which poses no problems.
  
- **Replication network:** When deploying VMware HCX on-premises, you'll need to define a replication network. Use the same network as you are using for your Management and Uplink networks.  If the on-premises cluster hosts use a dedicated Replication VMkernel network, reserve **two** IP addresses in this network segment and use the Replication VMkernel network for the replication network.


## Determine whether to extend your networks

Optionally, you can extend network segments from on-premises to Azure VMware Solution. If you do extend network segments, identify those networks now following these guidelines:

- Networks must connect to a [vSphere Distributed Switch (vDS)](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.networking.doc/GUID-B15C6A13-797E-4BCB-B9D9-5CBC5A60C3A6.html) in your on-premises VMware environment.  
- Networks that are on a [vSphere Standard Switch](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.networking.doc/GUID-350344DE-483A-42ED-B0E2-C811EE927D59.html) can't be extended.

>[!IMPORTANT]
>These networks are extended as a final step of the configuration, not during deployment.


## Next steps
Now that you've gathered and documented the information needed, continue to the next tutorial to create your Azure VMware Solution private cloud.

> [!div class="nextstepaction"]
> [Deploy Azure VMware Solution](deploy-azure-vmware-solution.md)
