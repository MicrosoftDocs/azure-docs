---
title: Create an Azure HPC Cache 
description: How to create an Azure HPC Cache instance
author: ekpgh
ms.service: hpc-cache
ms.topic: conceptual
ms.date: 08/30/2019
ms.author: v-erkell
---

# Configure aggregated namespace
<!-- change link in GUI -->

Azure HPC Cache allows clients to access a variety of storage systems through a virtual namespace that hides the details of the back-end storage system.

When you add a storage target, you set the client-facing filepath. Client machines mount this filepath. You can change the storage target associated with that path, for example to replace a hardware storage system with cloud storage, without needing to rewrite client-facing procedures.

## Next steps

After you have decided how to set up your virtual filesystem, [create storage targets](hpc-cache-add-storage) to map your back-end storage to your client-facing virtual filepaths.