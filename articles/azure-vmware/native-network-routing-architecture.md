---
title: Route architecture for Azure VMware Solution Gen 2
description: Learn about the route architecture and limitations for Azure VMware Solution Generation 2 (Gen 2) private clouds, including NSX segments, HCX routes, and prefix scale considerations.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 8/25/2025
ms.custom: engagement-fy25
#customer intent: As a cloud administrator, I want to understand the route architecture and limitations in Azure VMware Solution Gen 2 private clouds so that I can plan my networking and stay within supported limits.
# Customer intent: "As a cloud administrator, I want to understand the route limits and behaviors in Azure VMware Solution Gen 2 private clouds so that I can design and operate my environment within Azure-supported networking scale."
---

# Route architecture for Azure VMware Solution Gen 2  

Azure VMware Solution Generation 2 (Gen 2) private clouds use the virtual network for connectivity.  
There are limitations due to how virtual network advertisements from NSX are programmed into the virtual network.  

When NSX segments are created, two operations take place:  
- Each advertisement is added to the virtual network address space as it is received from NSX.  
- Each advertisement is broken down into `/28` CIDRs, and each `/28` is assigned to an NSX T0 uplink interface.  

---

## Route limitations for Gen 2  

Azure VMware Solution Gen 2 imposes the following limits in terms of route scale:  

- **Maximum of 1000 prefixes** on the virtual network address space, which includes all prefixes, such as 
  - NSX Segment prefixes (`/29` to `/16`)  
  - NSX Service routes (for example, DNS, VPN GW, DNAT) `/32`  
  - HCX MON routes `/32`  

- **1024 prefix limitation per T0 NIC** for NSX segment prefixes only.  

### NSX segment prefix examples  

- `1 x /24` prefix = 16 `/28`s programmed on the T0 NIC  
- `1 x /22` prefix = 64 `/28`s programmed on the T0 NIC  
- `1 x /16` prefix = 4096 `/28`s programmed across multiple T0 NICs  

### Capacity by cluster size  

- **3-node private cloud**: supports `4096 x /28s` (equivalent to 256 x /24s)  
- **4-node private cloud**: supports `6144 x /28s` (equivalent to 384 x /24s)  

---

## Route limitations for HCX  

Given the above-mentioned limitations:  

- Advertising `/32` MON host routes: up to 999 total (assuming the virtual network only has the private cloud address configured).  
- When **HCX migration (without MON)** is configured from on-premises to cloud:  
  - NSX segment prefixes count toward both the virtual network and T0 NIC limits.  
  - They are only programmed after the gateway fails over to the cloud side.  
- When **HCX migration with Mobility Optimized Networking (MON)** is configured:  
  - Route summarization prefers summarized NSX segment routes while removing specific host routes.  
  - Up to 30 seconds of route convergence may occur during failover.  
- If MON is not disabled for extended network segments, `/32` routes continue to consume route limits and reduce private cloud scale.  

### HCX MON compatibility  

- Not supported between Azure VMware Solution Gen 2 private clouds (because peered VNets cannot have overlapping address space).  
- Supported between Azure VMware Solution Gen 1 and Gen 2 private clouds.  

---

## Route limitations for NSX segments  

- Each NSX segment counts as one entry toward the 1000 virtual network limit.  
  - Since the Gen 2 private cloud address space itself consumes one entry, 999 remain available.  
- Each NSX segment advertisement is broken into `/28s`, which consume the 1024 per T0 NIC limit.  

### Allowed and not allowed  

- Customers cannot have 1000 x `/24s` (1000 × 16 = 16,000 prefixes).  
- Customers can have 1000 x `/28s`.  
- Customers can have 1 x `/16` (in a 4 node or larger private cloud).  
- Customers cannot have 256 x `/23s` (256 × 32 = 8192 prefixes).  

---

## How to stay within the limit  

To avoid hitting the 1000 route limit:  

- Plan segment routes carefully to stay within cluster prefix limits:  
  - `4096 x /28s` for a 3 node private cloud  
  - `6144 x /28s` for a 4 node private cloud  
- Keep combined prefix and host routes under 1000.  
- Summarize routes where possible (for example, advertise `/24s` instead of `/32s`).  
- Use fewer, larger prefixes.  
- Increase cluster size to a minimum of 4 hosts to expand Gen 2 internal prefix limits.  

---

## Example scenario  

This example shows how customers can balance MON and workload routes within Azure’s 1000-route limit:  

- 800 `/32` MON routes  
- 20 `/28` workload prefixes  
- 10 `/27`, 5 `/26`, 2 `/24`, 1 `/22`  

### Prefix calculation table  

| Prefix | Virtual Network Entries per Prefix | NIC Entries per Prefix | Example Count | Total Virtual Network Usage | Total NIC Usage |
|--------|-------------------------------------|-------------------------|---------------|-----------------------------|-----------------|
| /32    | 1                                   | N/A                     | 800           | 800                         | N/A             |
| /30    | 1                                   | N/A                     | 0             | 0                           | N/A             |
| /28    | 1                                   | 1                       | 20            | 20                          | 20              |
| /27    | 1                                   | 2                       | 10            | 10                          | 20              |
| /26    | 1                                   | 4                       | 5             | 5                           | 20              |
| /24    | 1                                   | 16                      | 2             | 2                           | 32              |
| /23    | 1                                   | 32                      | 0             | 0                           | 0               |
| /22    | 1                                   | 64                      | 1             | 1                           | 64              |

**Totals:**  
- 838 total virtual network entries  
- 156 total NIC entries  

---

## Recommendation  

It is recommended that customers perform a similar calculation for their private cloud deployment to ensure they remain within Azure VMware Solution Gen 2 route limits.  

---

## Related topics  

- [Connectivity to an Azure Virtual Network](native-network-connectivity.md)  
- [Internet connectivity options](native-internet-connectivity-design-considerations.md)  
- [Connect multiple Gen 2 private clouds](native-connect-multiple-private-clouds.md)  
- [Connect Gen 2 private clouds and Gen 1 private clouds](native-connect-private-cloud-previous-edition.md)  
- [Public and Private DNS forward lookup zone configuration](native-dns-forward-lookup-zone.md)  
