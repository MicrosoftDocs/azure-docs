---
title: Deploy Horizon on Azure VMware Solution
description: Learn how to deploy VMware Horizon on Azure VMware Solution.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 04/11/2022
---


# Deploy Horizon on Azure VMware Solution 

>[!NOTE]
>This document focuses on the VMware Horizon product, formerly known as Horizon 7. Horizon is a different solution than Horizon Cloud on Azure, although there are some shared components. Key advantages of the Azure VMware Solution include both a more straightforward sizing method and the integration of VMware Cloud Foundation management into the Azure portal.

[VMware Horizon](https://www.vmware.com/products/horizon.html)®, a virtual desktop and applications platform, runs in the data center and provides simple and centralized management. It delivers virtual desktops and applications on any device, anywhere. Horizon lets you create, and broker connections to Windows and Linux virtual desktops, Remote Desktop Server (RDS) hosted applications, desktops, and physical machines.

Here, we focus specifically on deploying Horizon on Azure VMware Solution. For general information on VMware Horizon, refer to the Horizon production documentation:

* [What is VMware Horizon?](https://www.vmware.com/products/horizon.html)

* [Learn more about VMware Horizon](https://docs.vmware.com/en/VMware-Horizon/index.html)

* [Horizon Reference Architecture](https://techzone.vmware.com/resource/workspace-one-and-horizon-reference-architecture)

With Horizon's introduction on Azure VMware Solution, there are now two Virtual Desktop Infrastructure (VDI) solutions on the Azure platform. The following diagram summarizes the key differences at a high level.

:::image type="content" source="media/vmware-horizon/difference-horizon-azure-vmware-solution-horizon-cloud-azure.png" alt-text="Diagram showing the differences between Horizon on Azure VMware Solution and Horizon Cloud on Azure." border="false":::

Horizon 2006 and later versions on the Horizon 8 release line supports both on-premises and Azure VMware Solution deployment. There are a few Horizon features that are supported on-premises but not on Azure VMware Solution. Other products in the Horizon ecosystem are also supported. For more information, see [feature parity and interoperability](https://kb.vmware.com/s/article/80850).

## Deploy Horizon in a hybrid cloud

You can deploy Horizon in a hybrid cloud environment by using Horizon Cloud Pod Architecture (CPA) to interconnect on-premises and Azure data centers. CPA scales up your deployment, builds a hybrid cloud, and provides redundancy for Business Continuity and Disaster Recovery.  For more information, see [Expanding Existing Horizon 7 Environments](https://techzone.vmware.com/resource/business-continuity-vmware-horizon#_Toc41650874).

>[!IMPORTANT]
>CPA is not a stretched deployment; each Horizon pod is distinct, and all Connection Servers that belong to each of the individual pods are required to be located in a single location and run on the same broadcast domain from a network perspective.

Like on-premises or private data centers, you can deploy Horizon in an Azure VMware Solution private cloud. We'll discuss key differences in deploying Horizon on-premises and Azure VMware Solution in the following sections.

The _Azure private cloud_ is conceptually the same as the _VMware SDDC_, a term typically used in Horizon documentation. The rest of this document uses both terms interchangeably.

The Horizon Cloud Connector is required for Horizon on Azure VMware Solution to manage subscription licenses. You can deploy Cloud Connector in Azure Virtual Network alongside Horizon Connection Servers.

>[!IMPORTANT]
>Horizon Control Plane support for Horizon on Azure VMware Solution is not yet available. Be sure to download the VHD version of Horizon Cloud Connector.

## vCenter Server Cloud Admin role

Since Azure VMware Solution is an SDDC service and Azure manages the lifecycle of the SDDC on Azure VMware Solution, the vCenter Server permission model on Azure VMware Solution is limited by design.

Customers are required to use the Cloud Admin role, which has a limited set of vCenter Server permissions. The Horizon product was modified to work with the Cloud Admin role on Azure VMware Solution, specifically:

* Instant clone provisioning was modified to run on Azure VMware Solution.

* A specific vSAN policy (VMware_Horizon) was created on Azure VMware Solution to work with Horizon, which must be available and used in the SDDCs deployed for Horizon.

* vSphere Content-Based Read Cache (CBRC), also known as View Storage Accelerator, is disabled when running on the Azure VMware Solution.

>[!IMPORTANT]
>CBRC must not be turned back on.

>[!NOTE]
>Azure VMware Solution automatically configures specific Horizon settings as long as you deploy Horizon 2006 (aka Horizon 8) and above on the Horizon 8 branch and select the **Azure** option in the Horizon Connection Server installer.

## Horizon on Azure VMware Solution deployment architecture

A typical Horizon architecture design uses a pod and block strategy. A block is a single vCenter Server, while multiple blocks combined make a pod. A Horizon pod is a unit of organization determined by Horizon scalability limits. Each Horizon pod has a separate management portal, and so a standard design practice is to minimize the number of pods.

Every cloud has its own network connectivity scheme. Combined with VMware SDDC networking / NSX-T Data Center, the Azure VMware Solution network connectivity presents unique requirements for deploying Horizon that is different from on-premises.

Each Azure private cloud and SDDC can handle 4,000 desktop or application sessions, assuming:

* The workload traffic aligns with the LoginVSI task worker profile.

* Only protocol traffic is considered, no user data.

* NSX Edge is configured to be large.

>[!NOTE]
>Your workload profile and needs may be different, and therefore results may vary based on your use case. User Data volumes may lower scale limits in the context of your workload. Size and plan your deployment accordingly. For more information, see the sizing guidelines in the [Size Azure VMware Solution hosts for Horizon deployments](#size-azure-vmware-solution-hosts-for-horizon-deployments) section.

Given the Azure private cloud and SDDC max limit, we recommend a deployment architecture where the Horizon Connection Servers and VMware Unified Access Gateways (UAGs) are running inside the Azure Virtual Network. It effectively turns each Azure private cloud and SDDC into a block. In turn, maximizing the scalability of Horizon running on Azure VMware Solution.

The connection from Azure Virtual Network to the Azure private clouds / SDDCs should be configured with ExpressRoute FastPath. The following diagram shows a basic Horizon pod deployment.

:::image type="content" source="media/vmware-horizon/horizon-pod-deployment-expresspath-fast-path.png" alt-text="Diagram showing the typical Horizon pod deployment using ExpressPath Fast Path." border="false":::

## Network connectivity to scale Horizon on Azure VMware Solution

This section lays out the network architecture at a high level with some common deployment examples to help you scale Horizon on Azure VMware Solution. The focus is specifically on critical networking elements. 

### Single Horizon pod on Azure VMware Solution

:::image type="content" source="media/vmware-horizon/single-horizon-pod-azure-vmware-solution.png" alt-text="Diagram showing a single Horizon pod on Azure VMware Solution." border="false":::

A single Horizon pod is the most straight forward deployment scenario because you deploy just one Horizon pod in the US East region.  Since each private cloud and SDDC is estimated to handle 4,000 desktop sessions, you deploy the maximum Horizon pod size.  You can plan the deployment of up to three private clouds/SDDCs.

With the Horizon infrastructure virtual machines (VMs) deployed in Azure Virtual Network, you can reach the 12,000 sessions per Horizon pod. The connection between each private cloud and SDDC to the Azure Virtual Network is ExpressRoute Fast Path.  No east-west traffic between private clouds is needed. 

Key assumptions for this basic deployment example include that:

* You don't have an on-premises Horizon pod that you want to connect to this new pod using Cloud Pod Architecture (CPA).

* End users connect to their virtual desktops through the internet (vs. connecting via an on-premises datacenter).

You connect your AD domain controller in Azure Virtual Network with your on-premises AD through VPN or ExpressRoute circuit.

A variation on the basic example might be to support connectivity for on-premises resources. For example, users access desktops and generate virtual desktop application traffic or connect to an on-premises Horizon pod using CPA.

The diagram shows how to support connectivity for on-premises resources. To connect to your corporate network to the Azure Virtual Network, you'll need an ExpressRoute circuit. You'll also need to connect your corporate network with each of the private cloud and SDDCs using ExpressRoute Global Reach. It allows the connectivity from the SDDC to the ExpressRoute circuit and on-premises resources. 

:::image type="content" source="media/vmware-horizon/connect-corporate-network-azure-virtual-network.png" alt-text="Diagram showing the connection of a corporate network to an Azure Virtual Network." border="false":::

### Multiple Horizon pods on Azure VMware Solution across multiple regions

Another scenario is scaling Horizon across multiple pods. In this scenario, you deploy two Horizon pods in two different regions and federate them using CPA. It's similar to the network configuration in the previous example, but with some additional cross-regional links. 

You'll connect the Azure Virtual Network in each region to the private clouds/SDDCs in the other region. It allows Horizon connection servers part of the CPA federation to connect to all desktops under management. Adding extra private clouds/SDDCs to this configuration would allow you to scale to 24,000 sessions overall. 

The same principles apply if you deploy two Horizon pods in the same region. Make sure to deploy the second Horizon pod in a *separate Azure Virtual Network*. Just like the single pod example, you can connect your corporate network and on-premises pod to this multi-pod/region example using ExpressRoute and Global Reach. 

:::image type="content" source="media/vmware-horizon/multiple-horizon-pod-azure-vmware-solution.png" alt-text=" Diagram showing multiple Horizon pods on Azure VMware Solution across multiple regions." border="false":::

## Size Azure VMware Solution hosts for Horizon deployments 

Horizon's sizing methodology on a host running in Azure VMware Solution is simpler than Horizon on-premises. That's because the Azure VMware Solution host is standardized. Exact host sizing helps determine the number of hosts needed to support your VDI requirements. It's central to determining the cost-per-desktop.

### Sizing tables

Specific vCPU/vRAM requirements for Horizon virtual desktops depend on the customer’s specific workload profile. Work with your MSFT and VMware sales team to help determine your vCPU/vRAM requirements for your virtual desktops. 

| vCPU per VM | vRAM per VM (GB) | Instance | 100 VMs | 200 VMs | 300 VMs | 400 VMs | 500 VMs | 600 VMs | 700 VMs | 800 VMs | 900 VMs | 1000 VMs | 2000 VMs | 3000 VMs | 4000 VMs | 5000 VMs | 6000 VMs | 6400 VMs |
|:-----------:|:----------------:|:--------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|
|      2      |        3.5       |    AVS   |    3    |    3    |    4    |    4    |    5    |    6    |    6    |    7    |    8    |     9    |    17    |    25    |    33    |    41    |    49    |    53    |
|      2      |         4        |    AVS   |    3    |    3    |    4    |    5    |    6    |    6    |    7    |    8    |    9    |     9    |    18    |    26    |    34    |    42    |    51    |    54    |
|      2      |         6        |    AVS   |    3    |    4    |    5    |    6    |    7    |    9    |    10   |    11   |    12   |    13    |    26    |    38    |    51    |    62    |    75    |    79    |
|      2      |         8        |    AVS   |    3    |    5    |    6    |    8    |    9    |    11   |    12   |    14   |    16   |    18    |    34    |    51    |    67    |    84    |    100   |    106   |
|      2      |        12        |    AVS   |    4    |    6    |    9    |    11   |    13   |    16   |    19   |    21   |    23   |    26    |    51    |    75    |    100   |    124   |    149   |    158   |
|      2      |        16        |    AVS   |    5    |    8    |    11   |    14   |    18   |    21   |    24   |    27   |    30   |    34    |    67    |    100   |    133   |    165   |    198   |    211   |
|      4      |        3.5       |    AVS   |    3    |    3    |    4    |    5    |    6    |    7    |    8    |    9    |    10   |    11    |    22    |    33    |    44    |    55    |    66    |    70    |
|      4      |         4        |    AVS   |    3    |    3    |    4    |    5    |    6    |    7    |    8    |    9    |    10   |    11    |    22    |    33    |    44    |    55    |    66    |    70    |
|      4      |         6        |    AVS   |    3    |    4    |    5    |    6    |    7    |    9    |    10   |    11   |    12   |    13    |    26    |    38    |    51    |    62    |    75    |    79    |
|      4      |         8        |    AVS   |    3    |    5    |    6    |    8    |    9    |    11   |    12   |    14   |    16   |    18    |    34    |    51    |    67    |    84    |    100   |    106   |
|      4      |        12        |    AVS   |    4    |    6    |    9    |    11   |    13   |    16   |    19   |    21   |    23   |    26    |    51    |    75    |    100   |    124   |    149   |    158   |
|      4      |        16        |    AVS   |    5    |    8    |    11   |    14   |    18   |    21   |    24   |    27   |    30   |    34    |    67    |    100   |    133   |    165   |    198   |    211   |
|      6      |        3.5       |    AVS   |    3    |    4    |    5    |    6    |    7    |    9    |    10   |    11   |    13   |    14    |    27    |    41    |    54    |    68    |    81    |    86    |
|      6      |         4        |    AVS   |    3    |    4    |    5    |    6    |    7    |    9    |    10   |    11   |    13   |    14    |    27    |    41    |    54    |    68    |    81    |    86    |
|      6      |         6        |    AVS   |    3    |    4    |    5    |    6    |    7    |    9    |    10   |    11   |    13   |    14    |    27    |    41    |    54    |    68    |    81    |    86    |
|      6      |         8        |    AVS   |    3    |    5    |    6    |    8    |    9    |    11   |    12   |    14   |    16   |    18    |    34    |    51    |    67    |    84    |    100   |    106   |
|      6      |        12        |    AVS   |    4    |    6    |    9    |    11   |    13   |    16   |    19   |    21   |    23   |    26    |    51    |    75    |    100   |    124   |    149   |    158   |
|      6      |        16        |    AVS   |    5    |    8    |    11   |    14   |    18   |    21   |    24   |    27   |    30   |    34    |    67    |    100   |    133   |    165   |    198   |    211   |
|      8      |        3.5       |    AVS   |    3    |    4    |    6    |    7    |    9    |    10   |    12   |    14   |    15   |    17    |    33    |    49    |    66    |    82    |    98    |    105   |
|      8      |         4        |    AVS   |    3    |    4    |    6    |    7    |    9    |    10   |    12   |    14   |    15   |    17    |    33    |    49    |    66    |    82    |    98    |    105   |
|      8      |         6        |    AVS   |    3    |    4    |    6    |    7    |    9    |    10   |    12   |    14   |    15   |    17    |    33    |    49    |    66    |    82    |    98    |    105   |
|      8      |         8        |    AVS   |    3    |    5    |    6    |    8    |    9    |    11   |    12   |    14   |    16   |    18    |    34    |    51    |    67    |    84    |    100   |    106   |
|      8      |        12        |    AVS   |    4    |    6    |    9    |    11   |    13   |    16   |    19   |    21   |    23   |    26    |    51    |    75    |    100   |    124   |    149   |    158   |
|      8      |        16        |    AVS   |    5    |    8    |    11   |    14   |    18   |    21   |    24   |    27   |    30   |    34    |    67    |    100   |    133   |    165   |    198   |    211   |


### Horizon sizing inputs

Here's what you'll need to gather for your planned workload:

* Number of concurrent desktops

* Required vCPU per desktop

* Required vRAM per desktop

* Required storage per desktop

In general, VDI deployments are either CPU or RAM constrained, which determines the host size. Let's take the following example for a LoginVSI Knowledge Worker type of workload, validated with performance testing:

* 2,000 concurrent desktop deployment

* 2vCPU per desktop.

* 4-GB vRAM per desktop.

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

If deployed on Azure VMware Solution and on-premises, choose the Horizon Universal Subscription License as a disaster recovery use case. However, it includes a vSphere license for on-premises deployment, so it has a higher cost.

Work with your VMware EUC sales team to determine the Horizon licensing cost based on your needs.

### Azure Instance Types

To understand the Azure virtual machine sizes that are required for the Horizon Infrastructure, see [Horizon Installation on Azure VMware Solution](https://techzone.vmware.com/resource/horizon-on-azure-vmware-solution-configuration#horizon-installation-on-azure-vmware-solution).

## References
[System Requirements For Horizon Agent for Linux](https://docs.vmware.com/en/VMware-Horizon/2012/linux-desktops-setup/GUID-E268BDBF-1D89-492B-8563-88936FD6607A.html)


## Next steps
To learn more about VMware Horizon on Azure VMware Solution, read the [VMware Horizon FAQ](https://www.vmware.com/content/dam/digitalmarketing/vmware/en/pdf/products/horizon/vmw-horizon-on-microsoft-azure-vmware-solution-faq.pdf).
