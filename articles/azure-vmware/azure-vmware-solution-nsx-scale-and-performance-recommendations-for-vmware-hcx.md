---
title: NSX Scale and Performance Recommendations 
description: Learn about the default NSX Topology in Azure VMware Solution and recommended practices to mitigate performance issues around HCX migration use cases. 
ms.topic: how-to 
ms.service: azure-vmware
ms.date: 3/16/2026
ms.custom: engagement-fy25
# Customer intent: As an IT administrator managing HCX migrations on Azure VMware Solution, I want to optimize NSX Edge performance and mitigate bottlenecks, so that I can ensure efficient data transfer and reliable application performance during migration tasks.
---

# NSX Scale and performance recommendations for VMware HCX

In this article, learn about the default NSX topology in Azure VMware Solution and NSX data path performance characteristics. Learn how to identify NSX data path resource limits. Learn about recommended configurations to help mitigate resource limits and optimize overall data path performance for HCX migrations. 
   
## Azure VMware Solution NSX Default topology

 The Azure VMware Solution NSX default topology has the following configuration:

* Three node NSX Manager cluster.

* NSX Edge and Gateway for North-bound traffic:

     * Two Large Form Factor NSX Edges, deployed in an NSX Edge cluster.

     * A Default NSX Tier-0 Gateway in Active/Active mode.

     * A Default NSX Tier-1 Gateway in Active/Standby mode.

     * A Default HCX-UPLINK segment connected to default Tier-1 Gateway.

Customers typically host their application workloads by creating new NSX segments and attaching them to the default Tier-1 Gateway. Additionally, customers with an HCX migration use case use the default HCX-uplink segment, which is also connected to the default Tier-1 Gateway.    

The default NSX topology for Azure VMware Solution, where all traffic exits through the default Tier-1 Gateway, might not be optimal based on customer traffic flows and throughput requirements.

### Potential Challenge

 See the following potential challenges and recommended configurations to optimize the NSX Edge data path resource.

* All the north-bound network traffic (Migrations, L2 Extensions, VM traffic outbound of Azure VMware Solution) uses the default Tier-1 Gateway, which is in Active/Standby mode.

* In the default Active/Standby mode, the Tier-1 Gateway only uses the Active Edge VM for all north-bound traffic. 

* The second Edge VM, which is standby, isn't used for north-bound traffic.

* Depending on the throughput requirements, and flows, it could potentially create a bottleneck on the Active Edge VM.

### Recommended Practices

It's possible to change the NSX North-bound network connectivity to distribute the traffic evenly to both Edge VMs. Creating another Tier-1 Gateways and distributing the NSX segments across multiple Tier-1 Gateways evenly distributes traffic across the Edge VMs. For an HCX migration use case, the recommendation would be to move HCX Layer 2 (L2) Extension and migration traffic to a newly created Tier-1 Gateway, so it uses the NSX Edge resource optimally.

To make an Active Edge for a given Tier-1 Gateway predictable, the recommendation is to create another Tier-1 Gateway with the High Availability (HA) Mode set to Active/Standby with the Failover mode set to preemptive. That configuration allows you to select a different active Edge VM than the one in use by the default Tier-1 Gateway that naturally splits north-bound traffic across multiple Tier-1 Gateways. The result is both NSX Edges are optimally utilized, thus avoiding a potential bottleneck with the default NSX topology. 

:::image type="content" source="media/nsxt/default-nsx-topology.png" alt-text="Diagram showing the default NSX topology in Azure VMware Solution." border="false" lightbox="media/nsxt/default-nsx-topology.png":::

### NSX Edge performance characteristics

Each of the NSX Edge Virtual machine (EVM) can support up to approximately ~20 Gbps based on the number of flows, packet size, and services enabled on the NSX gateways. Each of the Edge VMs (Large form factors) has four Data Plane Development Kit (DPDK) enabled CPU cores. Each of the DPDK cores can process up to ~5 Gbps traffic, based on flow hashing, packet size, and services enabled on NSX gateway. For more information on NSX Edge performance, see the VMware NSX-T Reference Design Guide section 8.6.2.*

## Monitor, Identify, and Fix potential Edge data path Performance Bottlenecks 

Using the built-in NSX alarm framework is recommended to monitor and identify key NSX Edge performance metrics. 

### How to Monitor and Identify NSX Edge Data Path Resource Constraints

NSX Edge performance can be monitored and identified by using the built-in NSX alarm framework. Customers can use the NSX UI or API to monitor alarms, or utilize Azure VMware Solution Resource Health notifications to alert customers when Edge resource constraint alarms are triggered. More information on the resource health feature is documented [here](resource-health-for-azure-vmware-solution-overview.md). The following critical NSX Edge alarms identify the NSX Edge data path resource constraints. 

1. Edge NIC Out of Transmit/Receive buffer.

2. Edge Datapath CPU high.

3. Edge Datapath NIC throughput high.

:::image type="content" source="media/nsxt/nsx-edge-critical-alerts.png" alt-text="Diagram showing NSX Edge health critical alerts." border="false" lightbox="media/nsxt/nsx-edge-critical-alerts.png":::

## How to fix the NSX Edge resource constraints

To validate the issue, check Historic/Real time traffic throughput at the alarm time for the correlation. 

:::image type="content" source="media/nsxt/nsx-edge-performance-charts.png" alt-text="Diagram showing NSX Edge VM performance charts." border="false" lightbox="media/nsxt/nsx-edge-performance-charts.png":::

To mitigate the issue, consider the following mitigation options: 

Mitigation options:

1. Edge Scale-UP: NSX Edge Scale-UP from Large (four DPDK CPU) to X-Large (eight DPDK CPU) form factor could resolve part of the issue.

     * Edge Scale up provides more CPU and memory for data path packet processing.

     * Edge Scale up might not help if you have one or more heavy flows, for example, HCX Network Extension (NE) to Network Extension (NE) traffic, as this traffic could potentially pin to one of the DPDK CPU cores.

2. NSX Tier-1 Gateway Topology Change: 

     * Set up a new Tier-1 gateway in "Distributed-only" mode and migrate all segments to it to optimize usage of all available Edges through distributed flow based hashing for all north-south traffic. Note the NSX distributed Tier-1 gateway doesn't support gateway services such as Gateway Firewall, VPN, DNS, or DHCP
  
     * If you require NSX gateway services and want to utilize all Edge resources, adjust the Azure VMware Solution NSX default Tier-1 Gateway topology by deploying multiple Tier-1 Gateways. Then, manually assign Edge resources to each Tier-1 and move the segments to the respective Tier-1 Gateways. This approach helps distribute north-south traffic across Edge VMs optimally.
  
     * See more details in the next section with an example of HCX migration use case. 
  
 >[!NOTE]
 > Tier-1 topology change options work for all use case where one of the NSX Edge being over utilized.



3. Edge Scale-OUT: If you have a large number of Hosts in the SDDC and workloads, NSX Edge Scale-OUT (from two Edges to four Edges) could be an option to add more NSX Edge data path resources.

   * Edge Scale-OUT is currently not supported on Azure VMware Solution Stretched Cluster private cloud.

   * NSX Edge Scale-OUT is effective only with a change in the NSX default Tier-1 Gateway topology to distribute the traffic optimally across all four Edge VMs. More details in the next section with an example of HCX migration use case.

### Default and configuration recommendations to the NSX Edge data path performance

The following list shows configuration recommendations to mitigate NSX Edge VMs performance challenges:

1. By default, Edge VMs are part of Azure VMware Solution management resource pool on vCenter. All appliances in the management resource pool have dedicated computing resources assigned.  

2. By default, Edge VMs are hosted on different Hosts with anti-affinity rules applied, to avoid multiple heavy packet processing workloads on same hosts.

3. Disable the Tier-1 Gateway Firewall if it isn't required to get better packet processing power. (By default, the Tier-1 Gateway Firewall is enabled).

4. Verify that NSX Edge VMs and HCX Network Extension (NE) appliances are on separate hosts, to avoid multiple heavy packet processing workloads on same hosts.

5. Verify for HCX migration use case, that the HCX Network Extension (NE) and HCX Interconnect (IX) appliances have the CPU reserved. Reserving the CPU allows HCX to optimally process the HCX migration traffic. (By default, these appliances have no CPU reservations).

6.  Ensure that Cluster-1, which hosts all VCF management appliances and HCX service mesh appliances, has optimal resources with the necessary CPU oversubscription ratio to help with overall performance.

## How to optimize Azure VMware Solution NSX Data Path Performance - HCX Use Case 
 
One of the most frequent scenarios that can potentially reach the NSX Edges data path limit is the HCX migration and network extension use case. The reason being HCX migration and network extension creates heavy flows (single flow between Network Extenders) that is hashed to single edge and single DPDK core within the Edge VM. Based on the flow hashing, it could potentially limit HCX migration and Network extension traffic up to 5 Gbps.

HCX Network extenders have a throughput limit of 4-6 Gbps per appliance. A recommended practice is to deploy multiple HCX NE appliances to distribute the load across them, ensuring reliable performance. When one follows this practice, it allows multiple network flows, improving network hashing across different NSX Edges and cores within an NSX Edge VM.

Given the nature of HCX use case traffic pattern and default Azure VMware Solution topology, here are few recommended practices to mitigate NSX Edge VM bottlenecks.

## Optimizing NSX Edge Performance (Mitigate NSX Edge bottleneck)
     
In general, creating more Tier-1 Gateways and distributing segments across multiple Tier-1 Gateways helps to mitigate potential NSX Edge data path bottleneck. The steps outlined show how to create and move an HCX uplink segment to the new Tier-1 Gateway, which allows you to separate out HCX traffic from workload VM traffic. 
 
:::image type="content" source="media/nsxt/nsx-traffic-flow-additional-tier-1-gateway.png" alt-text="Diagram showing NSX traffic flow in Azure VMware Solution with an additional Tier-1 gateway." border="false" lightbox="media/nsxt/nsx-traffic-flow-additional-tier-1-gateway.png":::

### Detailed Steps (Mitigate Edge VM bottleneck)

The creation of another Tier-1 Gateway can help mitigate potential Edge VM bottlenecks. 

[Create an NSX Tier-1 Gateway](tutorial-nsx-tier-1-gateway.md).

Distributed Only Option: 

1. No Edge Cluster can be selected. 

2. All connected Segments and Service Ports must be advertised.

3. No stateful services are available in the Distributed Only option.
 
:::image type="content" source="media/nsxt/nsx-tier-1-gateway-distributed-only.png" alt-text="Diagram showing NSX Tier-1 gateway distributed only option." border="false" lightbox="media/nsxt/nsx-tier-1-gateway-distributed-only.png":::

>[!IMPORTANT] 
>In a Distributed Only High Availability (HA) Mode, traffic is distributed across all Edge VMs. Workload traffic and Migration traffic can traverse the Active Edge at the same time. 

Active/Standby Option: 

1. Select the **Edge Cluster**.  

2. For Auto Allocate Edges- Select **No** on the radio button.

3. Select the **Edge VM** that isn't currently active as the preferred option.

4. For the **Fail Over** setting, select **Preemptive**. Using the preemptive setting ensures that traffic always failback to the preferred Edge VM selected in Step 3.

5. Select **All Connected Segments and Service Ports** to be advertised.

6. Select **Save**.

An Active/Standby configuration with the preferred Edge VM defined allows you to force traffic the Edge VM that isn't the Active Edge on the Default Tier-1 Gateway. If the Edge cluster is scaled-out to four Edges, creating the new Tier-1 Gateway and selecting Edge VM 03 and Edge VM 04 can be a better option to isolate HCX traffic completely.

:::image type="content" source="media/nsxt/nsx-tier-1-gateway-active-standby.png" alt-text="Diagram showing NSX Tier-1 gateway active standby option." border="false" lightbox="media/nsxt/nsx-tier-1-gateway-active-standby.png":::

>[!NOTE] 
>Microsoft Recommends the Active/Standby HA Mode when more Tier-1 Gateways are created. The Active/Standby HA Mode allows customers to separate Workload and migration traffic across different Edge VMs.  

## Create a new Segment for HCX Uplink and attach to the new Tier-1 Gateway 

For detailed instructions on NSX Segment creation. [NSX Segment Creation](tutorial-nsx-t-network-segment.md)

Select the newly created Tier-1 Gateway when creating your new NSX Segment. 

>[!NOTE]
>Customers can't utilize the Azure VMware Solution reserved IP space, when creating a new NSX Segment.
 
:::image type="content" source="media/nsxt/nsx-segment-creation.png" alt-text="Diagram showing the creation of an NSX segment." border="false" lightbox="media/nsxt/nsx-segment-creation.png":::

## Create an HCX Network Profile 

For detailed steps on how to Create an HCX Network Profile. [HCX Network Profile](configure-vmware-hcx.md#create-network-profiles)

1. Navigate to the HCX Portal select **Interconnect**, and then select **Network Profile**.  

2. Select **Create Network Profile**.

3. Select **NSX Network**, and choose the newly created **HCX Uplink segment**. 

4. Add the desired **IP Pool range**.

5. (Optional) Select **HCX Uplink** as the HCX Traffic Type.

6. Select **Create**.
 
:::image type="content" source="media/hcx/hcx-uplink-network-profile.png" alt-text="Diagram showing the creation of an HCX network profile." border="false" lightbox="media/hcx/hcx-uplink-network-profile.png":::
 
Once the new HCX Uplink Network Profile is created, update the existing Service Mesh and edit the default uplink profile with the newly created Network Profile. 

:::image type="content" source="media/hcx/hcx-service-mesh-edit.png" alt-text="Diagram showing how to edit an existing HCX service mesh." border="false" lightbox="media/hcx/hcx-service-mesh-edit.png":::

7. Select the existing **Service Mesh** and select **Edit**. 
 
8. Edit the default Uplink with the newly created Network Profile. 
        
9. Select **Service Mesh Change**.

:::image type="content" source="media/hcx/hcx-in-service-mode.png" alt-text="Diagram showing how to edit an in service mode on an HCX Network extension appliance." border="false" lightbox="media/hcx/hcx-in-service-mode.png":::
 
>[!Note] 
>In-Service Mode of the HCX Network Extension appliances should be considered to reduce downtime during this Service Mesh edit.   

10. Select **Finish**.

>[!IMPORTANT]
>Downtime varies depending on the Service Mesh change created. The recommendation is to allocate 5 minutes of downtime for these changes to take effect. 

## More information 

[VMware NSX Reference Design Guide](https://blogs.vmware.com/affiliates/nsx-t-reference-design-guide-updated-version-for-nsx-t-3-0)
