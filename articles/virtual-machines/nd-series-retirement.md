---
title: ND-series retirement
description: ND-series retirement by August 31, 2023
author: sherrywangms
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 09/01/2021
ms.author: sherrywang
---
# Migrate your ND series virtual machines by August 31, 2023
Based on feedback we’ve received from customers we’re happy to announce that we are extending the retirement date by 1 year to 31 August 2023, for the Azure ND-Series virtual machine to give you more time to plan  your migration. 

As we continue to bring modern and optimized virtual machine instances to Azure leveraging the latest innovations in datacenter technologies, we thoughtfully plan how we retire aging hardware. 
With this in mind, we are retiring our ND GPU VM sizes,  powered by NVIDIA Tesla P40 GPUs on 31 August 2023. 

## How does the ND-series migration affect me?  

After 31 August 2023, any remaining ND size virtual machines remaining in your subscription will be set to a deallocated state. These virtual machines will be stopped and removed from the host. These virtual machines will no longer be billed in the deallocated state. 

This VM size retirement only impacts the VM sizes in the [ND-series](nd-series.md). This does not impact the newer [NCv3](ncv3-series.md), [NC T4 v3](nct4-v3-series.md), and [ND v2](ndv2-series.md) series virtual machines. 

## What actions should I take?  
You will need to resize or deallocate your ND virtual machines. We recommend moving your GPU workloads to another GPU Virtual Machine size. Learn more about migrating your workloads to another [GPU Accelerated Virtual Machine size](sizes-gpu.md).

## Next steps
[Learn more](n-series-migration.md) about migrating your workloads to other GPU Azure Virtual Machine sizes. 

If you have questions, contact us through customer support.
