---
title: VMware software update frequency
description: Supported VMware software update frequency for Azure VMware Solution.
ms.topic: include
ms.service: azure-vmware
ms.date: 5/25/2024
author: suzizuber
ms.author: v-szuber
ms.custom: engagement-fy23
---

<!-- Used in faq.md and concepts-private-clouds-clusters.md -->

One benefit of Azure VMware Solution private clouds is that the platform is maintained for you. Microsoft is responsible for the lifecycle management of VMware software (ESXi, vCenter Server, and vSAN) and NSX appliances. Microsoft is also responsible for bootstrapping the network configuration, like creating the Tier-0 gateway and enabling North-South routing. You’re responsible for the NSX SDN configuration: network segments, distributed firewall rules, Tier 1 gateways, and load balancers.

> [!NOTE]
> A T0 gateway is created and configured as part of a private cloud deployment. Any modification to that logical router or the NSX edge node VMs could affect connectivity to your private cloud and should be avoided.

Microsoft is responsible for applying any patches, updates, or upgrades to ESXi, vCenter Server, vSAN, and NSX in your private cloud. The impact of patches, updates, and upgrades on ESXi, vCenter Server, and NSX has the following considerations:

- **ESXi** - There's no impact to workloads running in your private cloud. Access to vCenter Server and NSX isn't blocked during this time. During this time, we recommend you don't plan other activities like: scaling up private cloud, scheduling or initiating active HCX migrations, making HCX configuration changes, and so on, in your private cloud.

- **vCenter Server** - There's no impact to workloads running in your private cloud. During this time, vCenter Server is unavailable and you can't manage VMs (stop, start, create, or delete). We recommend you don't plan other activities like scaling up private cloud, creating new networks, and so on, in your private cloud. When you use VMware Site Recovery Manager or vSphere Replication user interfaces, we recommend you don't do either of the  actions: configure vSphere Replication, and configure or execute site recovery plans during the vCenter Server upgrade.

- **NSX** - The workload is impacted. When a particular host is being upgraded, the VMs on that host might lose connectivity from 2 seconds to 1 minute with any of the following symptoms:

   - Ping errors

   - Packet loss

   - Error messages (for example, *Destination Host Unreachable* and *Net unreachable*)

   During this upgrade window, all access to the NSX management plane is blocked. You can't make configuration changes to the NSX environment for the duration.  Your workloads continue to run as normal, subject to the upgrade impact previously detailed.
 
   During the upgrade time, we recommend you don't plan other activities like, scaling up private cloud, and so on, in your private cloud. Other activities can prevent the upgrade from starting or could have adverse impacts on the upgrade and the environment.
 
You're notified through Azure Service Health that includes the timeline of the upgrade. This notification also provides details on the upgraded component, its effect on workloads, private cloud access, and other Azure services. You can reschedule an upgrade as needed.

Software updates include:

- **Patches** - Security patches or bug fixes released by VMware

- **Updates** - Minor version change of a VMware stack component

- **Upgrades** - Major version change of a VMware stack component

>[!NOTE]
> Microsoft tests a critical security patch as soon as it becomes available from VMware.

Documented VMware workarounds are implemented in lieu of installing a corresponding patch until the next scheduled updates are deployed.
