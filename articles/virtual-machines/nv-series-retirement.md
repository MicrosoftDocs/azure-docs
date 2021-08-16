---
title: NV-series retirement
description: NV-series retirement starting September 1, 2021
author: vikancha-MSFT
ms.service: virtual-machines
ms.subservice: vm-sizes-gpu
ms.topic: conceptual
ms.date: 01/12/2020
ms.author: vikancha
---
# Migrate your NV and NV_Promo series virtual machines by August 31, 2022
As we continue to bring modern and optimized virtual machine instances to Azure using the latest innovations in datacenter technologies, we thoughtfully plan how we retire aging hardware.
With this in mind, we are retiring our NV-series Azure Virtual Machine sizes on September 01, 2022.

## How does the NV-series migration affect me?  

After September 01, 2022, any remaining NV and NV_Promo size virtual machines remaining in your subscription will be set to a deallocated state. These virtual machines will be stopped and removed from the host. These virtual machines will no longer be billed in the deallocated state. 

The current VM size retirement only impacts the VM sizes in the [NV-series](nv-series.md). This does not impact the [NVv3](nvv3-series.md) and [NVv4](nvv4-series.md) series virtual machines. 

## What actions should I take?  

You will need to resize or deallocate your NV virtual machines. We recommend moving your GPU visualization/graphics workloads to another [GPU Accelerated Virtual Machine size](sizes-gpu.md).

[Learn more](nv-series-migration-guide.md) about migrating your workloads to other GPU Azure Virtual Machine sizes. 

If you have questions, contact us through cusotmer support.
