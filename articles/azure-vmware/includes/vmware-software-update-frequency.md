---
title: VMware software update frequency
description: Supported VMware software update frequency for Azure VMware Solution.
ms.topic: include
ms.service: azure-vmware
ms.date: 09/17/2022
author: suzizuber
ms.author: v-szuber
---

<!-- Used in faq.md and concepts-private-clouds-clusters.md -->

One benefit of Azure VMware Solution private clouds is the platform is maintained for you.  Microsoft is responsible for the lifecycle management of VMware software (ESXi, vCenter Server, and vSAN). Microsoft is also responsible for the lifecycle management of the NSX-T Data Center appliances, bootstrapping the network configuration, such as creating the Tier-0 gateway and enabling North-South routing. You're responsible for the NSX-T Data Center SDN configuration: network segments, distributed firewall rules, Tier 1 gateways, and load balancers. 

Microsoft is responsible for applying any patches, updates, or upgrades to ESXi, vCenter Server, vSAN, and NSX-T Data Center in your private cloud. The impact of patches, updates, and upgrades on ESXi, vCenter Server, and NSX-T Data Center is different. 

- **ESXi** - There's no impact to workloads running in your private cloud. Access to vCenter Server and NSX-T Data Center isn't blocked during this time.  It's recommended that, during this time, you don't plan any other activities like scaling up private cloud, scheduling or initiating active HCX migrations, making HCX configuration changes and so on, in your private cloud.

- **vCenter Server** - There's no impact to workloads running in your private cloud. During this time, vCenter Server will be unavailable and you won't be able to manage VMs (stop, start, create, or delete). It's recommended that, during this time, you don't plan any other activities like scaling up private cloud, creating new networks, and so on, in your private cloud. If you are using VMware Site Recovery Manager or vSphere Replication user interfaces, it is recommended to not configure vSphere Replication and configure or execute site recovery plans during the vCenter Server upgrade.

- **NSX-T Data Center** - There's workload impact and when a particular host is being upgraded, the VMs on that host might lose connectivity from 2 seconds to maximum 1 minute with any and all of the following symptoms:

   - Ping errors

   - Packet loss

   - Error messages (for example, *Destination Host Unreachable* and *Net unreachable*)

   During this upgrade window, all access to the NSX-T Data Center management plane will be blocked. You can't make configuration changes to the NSX-T Data Center environment for the duration.  However, your workloads will continue to run as normal, subject to the upgrade impact detailed above.
 
   It's recommended that, during the upgrade time, you don't plan any other activities like scaling up private cloud, and so on, in your private cloud. These can prevent the upgrade from starting or could have adverse impacts on the upgrade and the environment.
 
You'll be notified before patches/updates or upgrades are applied to your private clouds. We'll also work with you to schedule a maintenance window before applying updates or upgrades to your private cloud.


Software updates include:

- **Patches** - Security patches or bug fixes released by VMware

- **Updates** - Minor version change of a VMware stack component

- **Upgrades** - Major version change of a VMware stack component

>[!NOTE]
>Microsoft tests a critical security patch as soon as it becomes available from VMware.

Documented VMware workarounds are implemented in lieu of installing a corresponding patch until the next scheduled updates are deployed.
