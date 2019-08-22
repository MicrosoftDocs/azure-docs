---
title: Create an Azure HPC Cache 
description: How to create an Azure HPC Cache instance
author: ekpgh
ms.service: hpc-cache
ms.topic: concept
ms.date: 08/30/2019
ms.author: v-erkell
---

# Configure aggregated namespace
<!-- change link in GUI -->

The Azure HPC Cache allows clients to access a variety of storage systems through a virtual namespace that hides the details of the back-end storage system.

When you add a storage target, you set the client-facing filepath. Client machines mount this filepath. You can change the storage target associated with that path, for example to replace a hardware storage system with cloud storage, without needing to rewrite client-facing procedures.

