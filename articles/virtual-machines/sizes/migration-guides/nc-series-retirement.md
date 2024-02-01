---
title: NC-series retirement
description: NC-series retirement by September 6, 2023
author: sherrywangms
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 12/20/2022
ms.author: sherrywang
---
# Migrate your NC and NC_Promo series virtual machines by September 6, 2023
Based on feedback we’ve received from customers we’re happy to announce that we're extending the retirement date by 1 year to 6 September 2023, for the Azure NC-Series virtual machine to give you more time to plan your migration. 

As we continue to bring modern and optimized virtual machine instances to Azure using the latest innovations in datacenter technologies, we thoughtfully plan how we retire aging hardware. 
With this in mind, we're retiring our NC (v1) GPU VM sizes, powered by NVIDIA Tesla K80 GPUs on 6 September 2023.

## How does the NC-series migration affect me?  

After 6 September 2023, any remaining NC size virtual machines remaining in your subscription will be set to a deallocated state. These virtual machines will be stopped and removed from the host. These virtual machines will no longer be billed in the deallocated state. 

This VM size retirement only impacts the VM sizes in the [NC-series](nc-series.md). This does not impact the newer [NCv3](ncv3-series.md), [NCasT4 v3](nct4-v3-series.md), and [NC A100 v4](nc-a100-v4-series.md) series virtual machines. 


## What actions should I take?  
You need to resize or deallocate your NC virtual machines. We recommend moving your GPU workloads to another GPU Virtual Machine size. Learn more about migrating your workloads to another [GPU Accelerated Virtual Machine size](sizes-gpu.md).

## Help and support

If you have questions, ask community experts in [Microsoft Q&A](/answers/topics/azure-virtual-machines.html). If you have a support plan and need technical help, create a support request:

1. In the [Help + support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) page, select **Create a support request**. Follow the **New support request** page instructions. Use the following values:
   * For **Issue type**, select **Technical**.
   * For **Service**, select **My services**.
   * For **Service type**, select **Virtual Machine running Windows/Linux**.
   * For **Resource**, select your VM.
   * For **Problem type**, select **Assistance with resizing my VM**.
   * For **Problem subtype**, select the option that applies to you.

1. Follow instructions in the **Solutions** and **Details** tabs, as applicable, and then **Review + create**.

## Next steps

[Learn more](n-series-migration.md) about migrating your workloads to other GPU Azure Virtual Machine sizes. 

If you have questions, contact us through customer support.
