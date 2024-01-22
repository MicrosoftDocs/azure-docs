---
title: 'Working remotely: Network Virtual Appliance (NVA) considerations for remote work'
titleSuffix: Azure VPN Gateway
description: Learn about the things that you should take into consideration working with Network Virtual Appliances (NVAs) in Azure during the COVID-19 pandemic.
author: KumudD
ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 05/05/2023
ms.author: kumud

---

# Working remotely: Network Virtual Appliance (NVA) considerations for remote work

Some Azure customers utilize third-party Network Virtual Appliances (NVAs) from Azure Marketplace to provide critical services such as Point-to-site VPN for their employees who are working from home during the COVID-19 epidemic. This article outlines some high-level guidance to take into consideration when leveraging NVAs in Azure to provide remote access solutions.

## NVA performance considerations

All major NVA vendors in Azure Marketplace should have recommendations on the VM Size and number of instances to use when deploying their solutions.  While nearly all NVA vendors will let you choose any size that is available to you in a given Region, it's very important that you follow the vendors recommendations for Azure VM instance sizes, as these recommendations are the VM sizes the vendor has done performance testing with in Azure.  

### Consider the following

- **Capacity and number of concurrent users** -  This number is particularly important for Point-to-Site VPN users as each connected user will create one encrypted (IPSec or SSL VPN) tunnel.  
- **Aggregate throughput** - What is the aggregate bandwidth you will need to accommodate the number of users you need to which you will need to provide remote access.
- **The VM size you will need** - You should always use VM sizes recommended by the NVA vendor.  For point-to-site VPN, if you will have a lot concurrent user connections, you should be using larger VM sizes such as [Dv2 and DSv2 series](../virtual-machines/dv2-dsv2-series.md "Dv2 and Dsv2 Series") VMs. These VMs tend to have more vCPUs and can handle more concurrent VPN sessions.  In addition to having more virtual cores, larger VM sizes in Azure have more aggregate bandwidth capacity than smaller VM sizes.
    > **Important:** Each vendor utilizes resources differently.  If it's not clear what instance sizes you should use to accommodate your estimated user load, you should contact the software vendor directly and ask them for a recommendation.
- **Number of instances** - If you expect to have a large number of users and connections, there are limits to what scaling up your NVA instance sizes can achieve.  Consider deploying multiple VM instances.
- **IPSec VPN vs SSL VPN** - In general IPSec VPN implementations perform better than SSL VPN implementations.  
- **Licensing** - Make sure that the software licenses you have purchased for the NVA solution will cover the sudden growth you may experience during the COVID-19 epidemic.  Many NVA licensing programs limit the number of connections or bandwidth the solution is capable of.
- **Accelerated Networking** - Consider an NVA solution that has support for Accelerated Networking.  Accelerated networking enables single root I/O virtualization (SR-IOV) to a VM, greatly improving its networking performance. This high-performance path bypasses the host from the data path, reducing latency, jitter, and CPU utilization for use with the most demanding network workloads on supported VM types. Accelerated networking is supported on most general purpose and compute-optimized instance sizes with two or more vCPUs.

## Monitoring resources

Each NVA solution has its own tools and resources for monitoring the performance of their NVA.  Consult your vendors documentation to make sure you understand the performance limitations and can detect when your NVA is near or reaching capacity.  In addition to this you can look at Azure Monitor Network Insights and see basic performance information about your Network Virtual Appliances such as:

- CPU Utilization
- Network In
- Network Out
- Inbound Flows
- Outbound Flows

## Next Steps

Most major NVA partners have posted guidance around scaling for sudden, unexpected growth during COVID-19. Here are a few useful links to partner resources.

[Barracuda Enable Work from home while securing your data during COVID-19](https://www.barracuda.com/covid-19/work-from-home "Enable Work from home while securing your data during COVID-19")

[Check Point Secure Remote Workforce During Coronavirus](https://www.checkpoint.com/solutions/secure-remote-workforce-during-coronavirus/ "Secure Remote Workforce During Coronavirus")

[Cisco AnyConnect Implementation and Performance/Scaling Reference for COVID-19 Preparation](https://www.cisco.com/c/en/us/support/docs/security/anyconnect-secure-mobility-client/215331-anyconnect-implementation-and-performanc.html "Cisco AnyConnect Implementation and Performance/Scaling Reference for COVID-19 Preparation")

[Citrix COVID-19 Response Support Center](https://www.citrix.com/support/covid-19-coronavirus.html "Citrix COVID-19 Response Support Center")

[F5 Guidance to Address the Dramatic Increase in Remote Workers](https://www.f5.com/business-continuity "F5 Guidance to Address the Dramatic Increase in Remote Workers")

[Fortinet COVID-19 Updates for Customers and Partners](https://www.fortinet.com/covid-19.html "COVID-19 Updates for Customers and Partners")

[Palo Alto Networks COVID-19 Response Center](https://live.paloaltonetworks.com/t5/COVID-19-Response-Center/ct-p/COVID-19_Response_Center "Palo Alto Networks COVID-19 Response Center")

[Kemp Enable Remote Work and Always-On App Experience for Business Continuity](https://kemptechnologies.com/remote-work-always-on-application-experience-business-continuity/ "Kemp Enable Remote Work and Always-On App Experience for Business Continuity")

