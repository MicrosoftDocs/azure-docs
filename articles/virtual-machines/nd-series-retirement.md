---
title: ND-series retirement
description: ND-series retirement by September 6, 2023
author: sherrywangms
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 02/27/2023
ms.author: sherrywang
---
# Migrate your ND series virtual machines by September 6, 2023
Based on feedback we’ve received from customers we’re happy to announce that we're extending the retirement date by one year to 6 September 2023, for the Azure ND-Series virtual machine to give you more time to plan  your migration. 

As we continue to bring modern and optimized virtual machine instances to Azure leveraging the latest innovations in datacenter technologies, we thoughtfully plan how we retire aging hardware. 
With this in mind, we're retiring our ND GPU VM sizes,  powered by NVIDIA Tesla P40 GPUs on 6 September 2023. 

## How does the ND-series migration affect me?  

After 6 September 2023, any remaining ND size virtual machines remaining in your subscription will be set to a deallocated state. These virtual machines will be stopped and removed from the host. These virtual machines will no longer be billed in the deallocated state. 

This VM size retirement only impacts the VM sizes in the [ND-series](nd-series.md). This retirement doesn't impact the newer [NCv3](ncv3-series.md), [NC T4 v3](nct4-v3-series.md), and [ND v2](ndv2-series.md) series virtual machines. 

## What actions should I take?  
You'll need to resize or deallocate your ND virtual machines. We recommend moving your GPU workloads to another GPU Virtual Machine size. Learn more about migrating your workloads to another [GPU Accelerated Virtual Machine size](sizes-gpu.md).

## Next steps
[Learn more](n-series-migration.md) about migrating your workloads to other GPU Azure Virtual Machine sizes. 

If you have questions, contact us through customer support.
