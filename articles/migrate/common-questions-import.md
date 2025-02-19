---
title: Questions about importing data
description: Get answers to common questions about importing RVTools XLSX into Azure migrate
author: SnehaSudhirG
ms.author: jobingeorge
ms.topic: conceptual
ms.service: azure-migrate
ms.date: 10/28/2024
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
 
### Will the data import fail if I don’t have vPartition and vMemory sheets? 

Storage sizing is captured using data from the vPartition and vMemory sheets. If these sheets aren't available, it is taken from the vInfo sheet and this data might be inaccurate.  


### My RVTools XLSX import keeps failing. What do I need to do? 

Ensure the following:

- There are no manual edits in the RVTools export file. If there are edits, remove them or export a fresh file for importing into Azure Migrate.

- The imported file is set to be readable. Set the file sensitivity to **General** as file sensitivity labels might prevent Azure Migrate from reading the file successfully.


## Next steps

[Learn more](how-to-create-assessment.md) about creating an assessment.

 