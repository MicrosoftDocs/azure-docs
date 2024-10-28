---
title: Questions about importing data
description: Get answers to common questions about importing RVTools XLSX into Azure migrate
author: v-sreedevank
ms.author: jobingeorge
ms.topic: conceptual
ms.service: azure-migrate
ms.date: 10/28/2024
---

# Import VMware servers using RVTools xls - Common questions

This article answers common questions about importing servers running in your VMware environment using RVTools XLSX (preview).

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

- There are no manual edits made to the RVTools export. If there are edits, remove them or take a fresh export for importing into Azure Migrate.

- The file imported is set to be readable. File sensitivity labels might hamper Azure Migrate from reading the file successfully. Set the file sensitivity to **General**.


## Next steps

Investigate the [cloud migration journey](/azure/architecture/cloud-adoption/getting-started/migrate) in the Azure Cloud Adoption Framework.

 