---
title: Questions about importing data
description: Get answers to common questions about importing RVTools XLSX into Azure migrate
author: habibaum
ms.author: v-uhabiba
ms.topic: concept-article
ms.service: azure-migrate
ms.date: 10/28/2024
# Customer intent: "As a migration specialist, I want to understand the requirements for importing RVTools XLSX data into Azure Migrate, so that I can ensure a successful and accurate import of my VMware servers."
---

# Import VMware servers using RVTools XLSX - Common questions

This article answers common questions about importing servers running in your VMware environment using RVTools XLSX.

### Which sheets and columns are required to import data into Azure Migrate? 

The following sheets and columns are necessary for importing all data: 

**Sheet** | **Columns**
--- | ---
**vInfo** | VM, Powerstate, CPUs, Memory, Provisioned MiB, In use MiB, OS according to the configuration file, VM UUID
**vPartition** | VM, VM UUID, Capacity MiB, Consumed MiB
**vMemory** | VM, VM UUID, Size MiB, Reservation
**vDatastore** | Name, Object ID, Type, Hosts, Capacity MiB, Provisioned MiB, In Use MiB
**vSnapshot** | VM, VM UUID, Powerstate, Size MiB (vmsn), Size MiB (total), Quiesced, Datacenter, Cluster, Host
**vDisk** | VM, VM UUID, Shared Bus, Controller
**vCD** | VM, VM UUID, Powerstate, Device Type, Connected
**vUSB** | VM, VM UUID, Powerstate, Device Type, Connected
**vNetwork** | VM, VM UUID, Switch, Connected
**dvPort** | Object ID, Port, Switch, Type, VLAN, Allow Promiscuous, Mac changes, Forged Transmits
 
### Will the data import fail if I don’t have sheets apart from vInfo? 

- Storage sizing is captured using data from the vPartition and vMemory sheets. If these sheets aren't available, it's taken from the vInfo sheet and this data might not be accurate.
- The other sheets providing readiness information. Without the presence of those files, readiness data might not be accurate.


### My RVTools XLSX import keeps failing. What do I need to do? 

Ensure the following:

- There are no manual edits in the RVTools export file. If there are edits, remove them or export a fresh file for importing into Azure Migrate.

- The imported file is set to be readable. Set the file sensitivity to **General** as file sensitivity labels might prevent Azure Migrate from reading the file successfully.


## Next steps

[Learn more](how-to-create-assessment.md) about creating an assessment.

 
