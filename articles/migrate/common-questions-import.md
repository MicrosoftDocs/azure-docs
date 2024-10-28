---
title: Questions about importing data
description: Get answers to common questions about importing RVTools XLSX into Azure migrate
author: v-sreedevank
ms.author: jobingeorge
ms.topic: conceptual
ms.service: azure-migrate
ms.date: 08/06/2024
---

# Import VMware servers using RVtools xls - Common questions

This article answers common questions about importing servers running in your VMware environment using RVTools XLSX (preview).

### Which sheets & columns are required for importing data into Azure Migrate? 

The following sheets and columns are necessary for importing all data: 

**Sheet** | **Columns**
--- | ---
**vInfo** | VM, Powerstate, CPUs, Memory, Provisioned MiB, In use MiB, OS according to the configuration file, VM UUID
**vPartition** | VM, VM UUID, Capacity MiB, Consumed MiB
**vMemory** | VM, VM UUID, Size MiB, Reservation
 
### Will the data import fail if I don’t have vPartition & vMemory sheets? 

Storage sizing is captured using data from the vPartition & vMemory sheets. If data is missing in these sheets, storage sizing will be taken from vInfo sheet and this may be inaccurate.  


### My RVTools XLSX import keeps failing. What do I need to do? 

Ensure the following:

- There are no manual edits made to the RVTools export. If there are edits, please remove the manual edits or take a fresh export, for importing into Azure Migrate 

- The file imported is set to be readable. File sensitive labels may hamper Azure migrate from reading the file successfully. Set the file sensitivity to “General”.




 