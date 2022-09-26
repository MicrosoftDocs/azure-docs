---
title: NV series retirement
description: NV series retirement starting September 1, 2021
author: vikancha-MSFT
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 01/12/2020
ms.author: vikancha
---
# Migrate your NV and NV_Promo series virtual machines by August 31, 2023
Based on feedback we’ve received from customers we’re happy to announce that we are extending the retirement date by 1 year to August 31, 2023, for the Azure NV-Series and NV_Promo Series virtual machine to give you more time to plan  your migration. 

We continue to bring modern and optimized virtual machine (VM) instances to Azure by using the latest innovations in datacenter technologies. As we innovate, we also thoughtfully plan how we retire aging hardware. With this context in mind, we're retiring our NV-series Azure VM sizes on August 31, 2023.

## How does the NV series migration affect me?

After August 31, 2023, any remaining NV and NV_Promo-size VMs remaining in your subscription will be set to a deallocated state. These VMs will be stopped and removed from the host. These VMs will no longer be billed in the deallocated state. 

The current VM size retirement only affects the VM sizes in the [NV series](nv-series.md). This retirement doesn't affect the [NVv3](nvv3-series.md) and [NVv4](nvv4-series.md) series VMs. 

## What actions should I take?

You'll need to resize or deallocate your NV VMs. We recommend moving your GPU visualizations or graphics workloads to another [GPU accelerated VM size](sizes-gpu.md).

[Learn more](nv-series-migration-guide.md) about migrating your workloads to other GPU Azure VM sizes. 

If you have questions, contact us through customer support.
