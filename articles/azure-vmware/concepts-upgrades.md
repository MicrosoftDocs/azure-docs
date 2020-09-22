---
title: Concepts - Private cloud updates and upgrades
description: Learn about the key upgrade processes and features in Azure VMware Solution.
ms.topic: conceptual
ms.date: 09/22/2020
---

# Azure VMware Solution private cloud updates and upgrades

## Overview

One of the key benefits of Azure VMware Solution private clouds is that the platform is maintained for you. Platform maintenance includes automated updates to a VMware validated software bundle, helping to ensure you're using the latest version of the validated Azure VMware Solution private cloud software.

Specifically, an Azure VMware Solution private cloud includes:

- Dedicated bare-metal server nodes provisioned with VMware ESXi hypervisor 
- vCenter server for managing ESXi and vSAN 
- VMware NSX-T software defined networking for vSphere workload VMs  
- VMware vSAN datastore for vSphere workload VMs  
- VMware HCX for workload mobility  

In addition to these components, an Azure VMware Solution private cloud includes resources in the Azure underlay required for connectivity and to operate the private cloud. Azure VMware Solution continuously monitors the health of both the underlay and the VMware components. When Azure VMware Solution detects a failure, it takes action to repair the failed components. 

## What components get updated?   

Azure VMware Solution updates the following VMware components: 

- vCenter Server and ESXi running on the bare-metal server nodes 
- vSAN 
- NSX-T 

Azure VMware Solution also updates the software in the underlay, such as drivers, software on the network switches, and firmware on the bare-metal nodes. 

## Types of updates

Azure VMware Solution applies the following types of updates to VMware components:

- Patches: Security patches and bug fixes released by VMware. 
- Updates: Minor version updates of one or more VMware components. 
- Upgrades: Major version updates of one or more VMware components.

You will be notified before and after patches are applied to your private clouds. We will also work with you to schedule a maintenance window before applying updates or upgrades to your private cloud. 

## VMware appliance backup 

In addition to making updates, Azure VMware Solution takes a configuration backup of these VMware components:

- vCenter Server 
- NSX-T Manager 

At times of failure, Azure VMware Solution can restore these from the configuration backup. 

For more information on VMware software versions, see the [private clouds and clusters concept article](concepts-private-clouds-clusters.md) and the [FAQ](faq.md).

## Next steps

The next step is to [create a private cloud](tutorial-create-private-cloud.md).

<!-- LINKS - external -->

<!-- LINKS - internal -->
