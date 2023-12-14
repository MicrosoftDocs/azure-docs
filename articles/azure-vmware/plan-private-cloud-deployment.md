---
title: Plan the Azure VMware Solution deployment
description: In this tutorial, learn how to plan your Azure VMware Solution deployment for a successful production-ready environment.
ms.topic: tutorial
ms.custom: "contperf-fy21q4, engagement-fy23"
ms.service: azure-vmware
ms.date: 04/11/2023
---

# Plan the Azure VMware Solution deployment

Planning your Azure VMware Solution deployment is crucial for creating a successful production-ready environment for virtual machines (VMs) and migration. During the planning process, you'll identify and gather the necessary information for your deployment. Be sure to document the information you collect for easy reference during the deployment. A successful deployment results in a production-ready environment for creating VMs and migration.

In this tutorial, you'll complete the following tasks:

> [!div class="checklist"]
> * Identify the Azure subscription, resource group, region, and resource name
> * Identify the size hosts and determine the number of clusters and hosts
> * Request a host quota for an eligible Azure plan
> * Identify the /22 CIDR IP segment for private cloud management
> * Identify a single network segment
> * Define the virtual network gateway
> * Define VMware HCX network segments

After you're finished, follow the recommended [Next steps](#next-steps) at the end of this article to continue with this getting started guide.

## Identify the subscription

Identify the subscription you plan to use to deploy Azure VMware Solution. You can create a new subscription or use an existing one.

>[!NOTE]
>The subscription must be associated with a Microsoft Enterprise Agreement (EA), a Cloud Solution Provider (CSP) Azure plan, or a Microsoft Customer Agreement (MCA). For more information, see [Eligibility criteria](request-host-quota-azure-vmware-solution.md#eligibility-criteria).

## Identify the resource group

Identify the resource group you want to use for your Azure VMware Solution. Generally, a resource group is created specifically for Azure VMware Solution, but you can use an existing resource group.

## Identify the region or location

Identify the [region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-vmware) you want Azure VMware Solution deployed.

## Define the resource name

The resource name is a friendly and descriptive name for your Azure VMware Solution private cloud, for example, **MyPrivateCloud**.

>[!IMPORTANT]
>The name must not exceed 40 characters. If the name exceeds this limit, you won't be able to create public IP addresses for use with the private cloud.

## Identify the size hosts

Identify the size hosts that you want to use when deploying Azure VMware Solution.  

[!INCLUDE [disk-capabilities-of-the-host](includes/disk-capabilities-of-the-host.md)]

## Determine the number of clusters and hosts

The first Azure VMware Solution deployment you do consists of a private cloud containing a single cluster. You'll need to define the number of hosts you want to deploy to the first cluster for your deployment.

[!INCLUDE [hosts-minimum-initial-deployment-statement](includes/hosts-minimum-initial-deployment-statement.md)]

>[!NOTE]
>To learn about the limits for the number of hosts per cluster, the number of clusters per private cloud, and the number of hosts per private cloud, check [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-vmware-solution-limits).

## Request a host quota

Request a host quota early in the planning process to ensure a smooth deployment of your Azure VMware Solution private cloud. Before making a request, identify the Azure subscription, resource group, and region. Determine the size of hosts, number of clusters, and hosts you'll need.

The support team takes up to five business days to confirm your request and allocate your hosts.

- [EA customers](request-host-quota-azure-vmware-solution.md#request-host-quota-for-ea-and-mca-customers)
- [CSP customers](request-host-quota-azure-vmware-solution.md#request-host-quota-for-csp-customers)

## Define the IP address segment for private cloud management

Azure VMware Solution requires a /22 CIDR network, such as `10.0.0.0/22`. This address space is divided into smaller network segments (subnets) for Azure VMware Solution management segments including vCenter Server, VMware HCX, NSX-T Data Center, and vMotion functionality. The following diagram shows Azure VMware Solution management IP address segments.

:::image type="content" source="media/pre-deployment/management-vmotion-vsan-network-ip-diagram.png" alt-text="Diagram that shows the management IP address segments in Azure VMware Solution."lightbox="media/pre-deployment/management-vmotion-vsan-network-ip-diagram.png" border="false":::  

> [!IMPORTANT]
> The /22 CIDR network address block shouldn't overlap with any existing network segment you already have on-premises or in Azure. For details of how the /22 CIDR network is broken down per private cloud, see [Routing and subnet considerations](tutorial-network-checklist.md#routing-and-subnet-considerations).

## Define the IP address segment for VM workloads

In a VMware vSphere environment, VMs must connect to a network segment. As Azure VMware Solution production deployment expands, you'll often see a combination of L2 extended segments from on-premises and local NSX-T Data Center network segments.

For the initial deployment, identify a single network segment (IP network), for example, `10.0.4.0/24`. This network segment is used primarily for testing purposes during the initial deployment.  The address block shouldn't overlap with any network segments on-premises or within Azure and shouldn't be within the /22 network segment already defined.
  
:::image type="content" source="media/pre-deployment/nsx-segment-diagram.png" alt-text="Diagram illustrating the IP address segment for virtual machine workloads."lightbox="media/pre-deployment/nsx-segment-diagram.png" border="false":::

## Define the virtual network gateway

Azure VMware Solution requires an Azure Virtual Network and an ExpressRoute circuit. Decide whether to use an *existing* or *new* ExpressRoute virtual network gateway. If you choose a *new* virtual network gateway, create it after creating your private cloud. Using an existing ExpressRoute virtual network gateway is acceptable. For planning purposes, note which ExpressRoute virtual network gateway you'll use.

:::image type="content" source="media/pre-deployment/azure-vmware-solution-expressroute-diagram.png" alt-text="Diagram displaying the Azure Virtual Network attached to Azure VMware Solution."lightbox="media/pre-deployment/azure-vmware-solution-expressroute-diagram.png" border="false":::

>[!IMPORTANT]
>You can connect to a virtual network gateway in an Azure Virtual WAN, but it is out of scope for this quick start.

## Define VMware HCX network segments

VMware HCX is an application mobility platform that simplifies application migration, workload rebalancing, and business continuity across data centers and clouds. You can migrate your VMware vSphere workloads to Azure VMware Solution and other connected sites through various migration types.

VMware HCX Connector deploys a subset of virtual appliances (automated) that require multiple IP segments. When you create your network profiles, you use the IP segments. Identify the following listed items for the VMware HCX deployment, which supports a pilot or small product use case. Modify as necessary based on your migration needs.

- **Management network:** For on-premises VMware HCX deployment, identify a management network for VMware HCX. Typically, it's the same management network used by your on-premises VMware vSphere cluster. At a minimum, identify **two** IPs on this network segment for VMware HCX. You might need larger numbers, depending on the scale of your deployment beyond the pilot or small use case.

  > [!NOTE]
  > For large environments, create a new /26 network and present it as a port group to your on-premises VMware vSphere cluster instead of using the existing management network. You can then create up to 10 service meshes and 60 network extenders (-1 per service mesh). You can stretch **eight** networks per network extender by using Azure VMware Solution private clouds.

- **Uplink network:** For on-premises VMware HCX deployment, identify an Uplink network for VMware HCX. Use the same network you plan to use for the Management network.

- **vMotion network:** For on-premises VMware HCX deployment, identify a vMotion network for VMware HCX.  Typically, it's the same network used for vMotion by your on-premises VMware vSphere cluster.  At a minimum, identify **two** IPs on this network segment for VMware HCX. You might need larger numbers, depending on the scale of your deployment beyond the pilot or small use case.

  You must expose the vMotion network on a distributed virtual switch or vSwitch0. If it's not, modify the environment to accommodate.

  >[!NOTE]
  >Many VMware vSphere environments use non-routed network segments for vMotion, which poses no problems.
  
- **Replication network:** For on-premises VMware HCX deployment, define a replication network. Use the same network you're using for your Management and Uplink networks. If the on-premises cluster hosts use a dedicated Replication VMkernel network, reserve **two** IP addresses in this network segment and use the Replication VMkernel network for the replication network.

## Determine whether to extend your networks

Optionally, you can extend network segments from on-premises to Azure VMware Solution. If you extend network segments, identify those networks now following these guidelines:

- Networks must connect to a [vSphere Distributed Switch (vDS)](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.networking.doc/GUID-B15C6A13-797E-4BCB-B9D9-5CBC5A60C3A6.html) in your on-premises VMware environment.  
- Networks that are on a [vSphere Standard Switch](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.networking.doc/GUID-350344DE-483A-42ED-B0E2-C811EE927D59.html) can't be extended.

>[!IMPORTANT]
>These networks are extended as a final step of the configuration, not during deployment.

## Next steps

Now that you've gathered and documented the necessary information, continue to the next tutorial to create your Azure VMware Solution private cloud.

> [!div class="nextstepaction"]
> [Deploy Azure VMware Solution](deploy-azure-vmware-solution.md)
