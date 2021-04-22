---
title: Concepts - Private cloud updates and upgrades
description: Learn about the key upgrade processes and features in Azure VMware Solution.
ms.topic: conceptual
ms.date: 03/17/2021
---

# Azure VMware Solution private cloud updates and upgrades

One benefit of Azure VMware Solution private clouds is the platform is maintained for you. Maintenance includes automated updates to a VMware validated software bundle to help ensure you're using the latest version of Azure VMware Solution private cloud software.

Specifically, an Azure VMware Solution private cloud includes:

- Dedicated bare-metal server nodes provisioned with VMware ESXi hypervisor 
- vCenter server for managing ESXi and vSAN 
- VMware NSX-T software defined networking for vSphere workload VMs  
- VMware vSAN datastore for vSphere workload VMs  
- VMware HCX for workload mobility  

An Azure VMware Solution private cloud also includes resources in the Azure underlay required for connectivity and to operate the private cloud. Azure VMware Solution continuously monitors the health of both the underlay and the VMware components. When Azure VMware Solution detects a failure, it takes action to repair the failed components. 

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

You'll be notified before and after patches are applied to your private clouds. We'll also work with you to schedule a maintenance window before applying updates or upgrades to your private cloud. 

## VMware appliance backup 

Azure VMware Solution also takes a configuration backup of the following VMware components:

- vCenter Server 
- NSX-T Manager 

At times of failure, Azure VMware Solution can restore these components from the configuration backup. 

## VMware software versions
[!INCLUDE [vmware-software-versions](includes/vmware-software-versions.md)]


## Next steps

Now that you've covered the key upgrade processes and features in Azure VMware Solution, you may want to learn about:

- [How to create a private cloud](tutorial-create-private-cloud.md)
- [How to enable Azure VMware Solution resource](enable-azure-vmware-solution.md)

<!-- LINKS - external -->

<!-- LINKS - internal -->
