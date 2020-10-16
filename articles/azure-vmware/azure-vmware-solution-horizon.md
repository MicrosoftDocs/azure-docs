---
title: Deploy Horizon on Azure VMware Solution
description: Learn how to deploy VMware Horizon on Azure VMware Solution.
ms.topic: how-to
ms.date: 09/29/2020
---


# Deploy Horizon on Azure VMware Solution 

>[!NOTE]
>This document focuses on the VMware Horizon product. This is formerly known as Horizon 7 before the product name change from Horizon 7 to Horizon. Horizon is a different solution than Horizon Cloud on Azure, although there are some shared components. Key advantages of the Azure VMware Solution include both a simpler sizing method and that VMware Cloud Foundation management is integrated into the Azure portal.

[VMware Horizon](https://www.vmware.com/products/horizon.html)® is a virtual desktop and applications platform that runs in the data center and provides IT with simple and centralized management. It delivers virtual desktops and applications to end users on any device, anywhere. Horizon allows you to create and broker connections to Windows virtual desktops, Linux virtual desktops, Remote Desktop Server (RDS) hosted applications, desktops, and physical machines.

Here, we focus specifically on deploying Horizon on Azure VMware Solution. For general information on VMware Horizon, refer to the Horizon production documentation:

* [What is VMware Horizon?](https://www.vmware.com/products/horizon.html)

* [Learn more about VMware Horizon](https://docs.vmware.com/en/VMware-Horizon/index.html)

* [Horizon Reference Architecture](https://techzone.vmware.com/resource/workspace-one-and-horizon-reference-architecture)

With Horizon's introduction on Azure VMware Solution, there are now two Virtual Desktop Infrastructure (VDI) solutions on the Azure platform. The following diagram summarizes the key differences at a high level.

:::image type="content" source="media/horizon/difference-horizon-azure-vmware-solution-horizon-cloud-azure.png" alt-text="The differences between Horizon on Azure VMware Solution and Horizon Cloud on Azure" border="false":::

Horizon 2006 and later versions on the Horizon 8 release line supports both on-premises deployment and Azure VMware Solution deployment. There are a few Horizon features that are supported on-premises but not on Azure VMware Solution. Additional products in the Horizon ecosystem are also supported. For for information, see [feature parity and interoperability](https://kb.vmware.com/s/article/80850).

## Deploy Horizon in a hybrid cloud

You can deploy Horizon in a hybrid cloud environment when you use Horizon Cloud Pod Architecture (CPA) to interconnect on-premises data centers and Azure datacenters. CPA is typically used to scale up your deployment, build a hybrid cloud, and provide redundancy for Business Continuity and Disaster Recovery. For an in-depth discussion of VMware Horizon Business Continuity guidance, see
[Expanding Existing Horizon 7 Environments](https://techzone.vmware.com/resource/business-continuity-vmware-horizon#_Toc41650874).

>[!IMPORTANT]
>CPA is not a stretched deployment; each Horizon pod is distinct, and all Connection Servers that belong to each of the individual pods are required to be located in a single location and run on the same broadcast domain from a network perspective.

Like on-premises or private data center, Horizon can be deployed in an Azure VMware Solution private cloud. We will discuss key differences in deploying Horizon on-premises and on Azure VMware Solution in the following sections.

The Azure private cloud is conceptually the same as the VMware SDDC, a term typically used in Horizon documentation. The remainder of this document will use the terms Azure private cloud and VMware SDDC interchangeable.

The Horizon Cloud Connector is required for Horizon on Azure VMware Solution to manage subscription licenses. Cloud Connector can be deployed in Azure Virtual Network alongside Horizon Connection Servers.

>[!IMPORTANT]
>Horizon Control Plane support for Horizon on Azure VMware Solution is not yet available. Be sure to download the VHD version of Horizon Cloud Connector.

## vCenter Cloud Admin role

Since Azure VMware Solution is an SDDC service and Azure manages the lifecycle of the SDDC on Azure VMware Solution, the vCenter permission model on Azure VMware Solution is limited by design.

Customers are required to use the Cloud Admin role, which has a limited set of vCenter permissions. The Horizon product was modified to work with the Cloud Admin role on Azure VMware Solution, specifically:

* Instant clone provisioning was modified to run on Azure VMware Solution.

* A specific vSAN policy (VMware_Horizon) was created on Azure VMware Solution to work with Horizon, which must be available and used in the SDDCs deployed for Horizon.

* vSphere Content-Based Read Cache (CBRC), also known as View Storage Accelerator, is disabled when running on the Azure VMware Solution.

>[!IMPORTANT]
>CBRC must not be turned back on.

>[!NOTE]
>Azure VMware Solution automatically configures specific Horizon settings as long as you deploy Horizon 2006 (aka Horizon 8) and above on the Horizon 8 branch and select the **Azure** option in the Horizon Connection Server installer.

## Horizon on Azure VMware Solution deployment architecture

A typical Horizon architecture design uses a pod and block strategy. A block is a single vCenter, while multiple blocks combined make a pod. A Horizon pod is a unit of organization determined by Horizon scalability limits. Each Horizon pod has a separate management portal, and therefore a standard design practice is to minimize the number of pods.

Every cloud has its own network connectivity scheme. Combined with VMware SDDC networking / NSX Edge, the Azure VMware Solution network connectivity presents unique requirements for deploying Horizon that is different from on-premises.

Each Azure private cloud / SDDC is capable of handling 4,000 desktop or app sessions, which assume the following:

* The workload traffic aligns with that of the LoginVSI task worker profile.

* Only protocol traffic is considered, no user data.

* NSX Edge is configured to be large.

>[!NOTE]
>Your workload profile and needs may be different, and therefore results may vary based on your use case. User Data volumes may lower scale limits in the context of your workload. Size and plan your deployment accordingly. For more information, see the sizing guidelines in the [Size Azure VMware Solution hosts for Horizon deployments](#size-azure-vmware-solution-hosts-for-horizon-deployments) section.

Given the Azure private cloud / SDDC max limit, we recommend a deployment architecture where the Horizon Connection Servers and VMware Unified Access Gateways (UAGs) are running inside the Azure Virtual Network. This effectively turns each Azure private cloud / SDDC into a block. This, in turn, maximizes the scalability of Horizon running on Azure VMware Solution.

The connection from Azure Virtual Network to the Azure private clouds / SDDCs should be configured with ExpressRoute FastPath. The following diagram shows a basic Horizon pod deployment.

:::image type="content" source="media/horizon/horizon-pod-deployment-expresspath-fast-path.png" alt-text="Typical Horizon pod deployment using ExpressPath Fast Path" border="false":::

## Network connectivity to scale Horizon on Azure VMware Solution

This section lays out network architecture at a high level for scaling Horizon on Azure VMware Solution with some common deployment examples. The focus here is specifically on critical networking elements.

### Single Horizon pod on Azure VMware Solution

:::image type="content" source="media/horizon/single-horizon-pod-azure-vmware-solution.png" alt-text="Single Horizon pod on Azure VMware Solution" border="false":::

A single Horizon pod is the most straight forward deployment scenario. In this example, you decide you want to deploy just one Horizon pod in the US East region. Since each private cloud / SDDC is estimated to approximately handle the traffic of 4,000 desktop sessions, to deploy the maximum Horizon pod size, you can plan the deployment of up to three private clouds / SDDCs.

So, in this example, in combination with the Horizon infrastructure virtual machines (VMs) deployed in Azure Virtual Network, you can reach the 12,000 sessions per Horizon pod based on your workload and data needs. The connection between each private cloud and SDDC to the Azure Virtual Network is ExpressRoute Fast Path, such that no east-west traffic between private clouds is needed.

Key assumptions for this basic deployment example include that:

* You don't have an on-premises Horizon pod that you want to connect to this new pod using Cloud Pod Architecture (CPA).

* End users connect to their virtual desktops via the internet (vs. connecting via an on-premises data center).

In this basic example, you can connect your AD domain controller in Azure Virtual Network with your on-premises Active Directory via VPN or an ExpressRoute circuit.

A variation on the basic example discussed might be to support connectivity for on-premises resources. This might be users accessing desktops and generating virtual desktop application traffic or connecting to an on-premises Horizon pod using CPA.

The diagram below shows how you can do that. To connect your corporate network to the Azure Virtual Network, you will need an ExpressRoute. You will also need to connect your corporate network with each of the private cloud / SDDCs using Global Reach, which allows connectivity from the SDDC to the ExpressRoute and on-premise resources.

:::image type="content" source="media/horizon/connect-corporate-network-azure-virtual-network.png" alt-text="Connect your corporate network to an Azure Virtual Network" border="false":::

### Multiple Horizon pods on Azure VMware Solution across multiple regions

For another Horizon pod example, let's look at an example that shows scaling Horizon across multiple Pods. In this example, you are deploying two Horizon pods in two different regions and federating them using CPA. The network configuration is like the previous example, with some additional cross-regional links. 

You will need to connect the Azure Virtual Network in each region to the private clouds / SDDCs in the other region, allowing Horizon connection servers that are part of the CPA federation to connect to all desktops under management. Adding additional private clouds / SDDCs to this configuration would allow you to scale to 24,000 sessions overall. 

While this example shows multiple regions, the same principle would apply if you want to deploy two Horizon pods in the same region. Note that you would need to make sure that the second Horizon pod is deployed in a *separate Azure Virtual Network*. Finally, just as you would in the previous single Pod example, you can connect your corporate network and on-premises pod to this multi-pod /
region example using customer ExpressRoute and Global Reach.

:::image type="content" source="media/horizon/multiple-horizon-pod-azure-vmware-solution.png" alt-text=" Multiple Horizon pods on Azure VMware Solution across multiple regions" border="false":::

## Size Azure VMware Solution hosts for Horizon deployments 

Horizon's sizing methodology on a host running in Azure VMware Solution is simpler than Horizon on-premises since the Azure VMware Solution host instance is standardized. Accurate host sizing will help determine the number of hosts needed to support your VDI requirements and is central to determining the cost-per-desktop.

### Azure VMware Solution host instance

* PowerEdge R640 Server - DSS RESTRICTED

* 36 cores \@2.3GHz

* 576-GB RAM

* HBA330 12 Gbps SAS HBA Controller (NON-RAID)

* 1.92 TB SSD SATA Mix Use 6 Gbps 512 2.5in Hot-plug AG Drive, 3 DWPD, 10512 TBW

* Intel 1.6 TB, NVMe, Mixed Use Express Flash, 2.5 SFF Drive, U.2, P4600 with
Carrier

* 2 vSAN Disk Groups: 1.6 x 4(1.92 TB)

### Horizon sizing inputs

Find out the following for your planned workload:

* Number of concurrent desktops

* Required vCPU per desktop

* Required vRAM per desktop

* Required storage per desktop

In general, VDI deployments are either CPU or RAM constrained, as those factors will determine the host size. Let's take the following example for a LoginVSI Knowledge Worker type of workload, validated with performance testing:

* 2,000 concurrent desktop deployment

* 2vCPU per desktop.

* 4 GB vRAM per desktop.

* 50 GB of storage per desktop

For this example, the total number of hosts factors out to 18, yielding a VM-per-host density of 111.

>[!IMPORTANT]
>Customer workloads will vary from this example of a LoginVSI Knowledge Worker. As a part of planning your deployment, work with your VMware EUC SEs for your specific sizing and performance needs. Be sure to run your own performance testing using the actual, planned workload before finalizing host sizing and adjust accordingly.

## Horizon on Azure VMware Solution licensing 

There are four components to the overall costs of running Horizon on Azure VMware Solution. 

### Azure VMware Solution Capacity Cost

For information on the pricing, see the [Azure VMware Solution pricing](https://azure.microsoft.com/pricing/details/azure-vmware/) page

### Horizon Licensing Cost

There are two available licenses for use with the Azure VMware Solution, which can be either Concurrent User (CCU) or Named User (NU):

* Horizon Subscription License

* Horizon Universal Subscription License

If only deploying Horizon on Azure VMware Solution for the foreseeable future, then use the Horizon Subscription License as it is a lower cost.

If deploying both Horizon on Azure VMware Solution and on-premises, as with a disaster recovery use case, then choose the Horizon Universal Subscription License. The Universal license is a higher cost because it includes a vSphere license for on-premises deployment.

Work with your VMware EUC sales team to determine the Horizon licensing cost based on your needs.

### Cost of the Horizon infrastructure VMs on Azure Virtual Network

Based on the standard deployment architecture, Horizon infrastructure VMs are made up of Connection Servers, UAGs, App Volume Managers, and are deployed in the customer's Azure Virtual Network. Additional Azure native instances are required to support High Availability (HA), Microsoft SQL, or Microsoft Active Directory (AD) services on Azure. The following is a list of Azure instances based on a 2,000-desktop deployment example. 

>[!NOTE]
>To be able to handle failure, deploy one more server than is required for the number of connections (n+1). The minimum recommended number of instances of the Connection Server, UAG and App Volumes Manager is 2, and the number of required will grow based on the amount of users the environment will support.  A single Connection Server supports a maximum of 4,000 sessions, although 2,000 is recommended as a best practice. Up to seven Connection Servers are supported per pod with a recommendation of 12,000 active sessions in total per pod. For the most current numbers, see the [VMware Knowledge Base article VMware Horizon 7 Sizing Limits and Recommendations](https://kb.vmware.com/s/article/2150348).

| Horizon Infrastructure Component | Azure Instance | Number of Instances Needed (for 2,000-desktops)    | Comment  |
|----------------------------------|----------------|----------------------------------------------------|----------|
| Connection Server                | D4sv3          | 2       | *See Note Above*                         |    
| UAG                              | F2sv2          | 2       | *See Note Above*                         |
| App Volumes Manager              | D4sv3          | 2       | *See Note Above*                         |
| Cloud Connector                  | D4sv3          | 1       |                                          |
| AD Controller                    | D4sv3          | 2       | *Option to use MSFT AD service on Azure* |
| MS-SQL Database                  | D4sv3          | 2       | *Option to use SQL service on Azure*     |
| Windows file share               | D4sv3          |         | *Optional*                               |

The infrastructure VM cost amounts to \$0.36 per user per month for the 2,000-desktop deployment in the example above. Note that this example uses US East Azure instance pricing as of June 2020. Your pricing may vary depending on region, options selected, and timing.
