---
title: NCv3 and NC24rs Retirement
description: Migration guide for NC24rs_v3 sizes
author: sherrywangms
ms.author: sherrywang
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 03/19/2024
ms.subservice: sizes
---

# Migrate your Standard_NC24rs_v3 virtual machine size by March 31, 2025 

On March 31, 2025, Microsoft Azure will retire the Standard_NC24rs_v3 virtual machine (VM) size in NCv3-series virtual machines (VMs). To avoid any disruption to your service, we recommend that you change the VM sizing from the Standard_NC24rs_v3 to the newer VM series in the same NC product line.

Microsoft recommends the Azure [NC A100 v4-series](./nc-a100-v4-series.md) VMs, which offer greater GPU memory bandwidth per GPU, improved [Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md) capabilities, larger and faster local solid state drives. Overall the NC A100 v4-series delivers [better cost performance](https://techcommunity.microsoft.com/t5/azure-high-performance-computing/a-quick-start-to-benchmarking-in-azure-nvidia-deep-learning/ba-p/3563884) across midrange AI training and inference workloads. 

## How does the retirement of the Standard_NC24rs_v3 affect me?

After March 31, 2025, any remaining Standard_NC24rs_v3 VM subscriptions will be set to a deallocated state. They'll stop working and no longer incur billing charges. The Standard_NC24rs_v3 VM size will no longer be under SLA or have support included.

Note: This retirement only impacts the virtual machine sizes in the Standard_NC24rs_v3 size in NCv3-series powered by NVIDIA V100 GPUs. See [retirement guide for Standard_NC6s_v3, Standard_NC12s_v3, and Standard_NC24s_v3](https://aka.ms/ncv3nonrdmasizemigration). This retirement announcement doesn't apply to NCasT4 v3, and NC A100 v4 and NCads H100 v5 series virtual machines. 

## What action do I need to take before the retirement date?

You need to resize or deallocate your Standard_NC24rs_v3 VM size. We recommend that you change VM sizes for these workloads, from the original Standard_NC24rs_v3 VM size to the Standard_NC96ads_A100_v4 size (or an alternative).

The Standard_NC96ads_A100_v4 VM size in [NC A100 v4 series](./nc-a100-v4-series.md) is powered by NVIDIA A100 PCIe GPU and third generation AMD EPYC™ 7V13 (Milan) processors. The VMs feature up to 4 NVIDIA A100 PCIe GPUs with 80 GB memory each, up to 96 non-multithreaded AMD EPYC Milan processor cores and 880 GiB of system memory. Check [Azure Regions by Product page](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/) for region availability. Visit the [Azure Virtual Machine pricing page](https://azure.microsoft.com/pricing/details/virtual-machines/) for pricing information.

The [NCads H100 v5-Series](./ncads-h100-v5.md) is another SKU in the same product line powered by NVIDIA H100 NVL GPU. These VMs are targeted for GPU accelerated midrange AI training, batch inferencing, and high performance computing simulation workloads.  

|Current VM Size| Target VM Size | Difference in Specification |
|---|---|---|
| Standard_NC24rs_v3 | Standard_NC96ads_A100_v4 | vCPU: 96 (+18) <br> GPU Count: 4 (Same)<br>Memory: GiB 880 (+432)<br>Temp storage (SSD) GiB: 3916 (+968)<br>Max data disks: 32 (+0)<br>Accelerated networking: Yes(+)<br>Premium storage: Yes |

## Steps to change VM size 

1. Choose a series and size. Refer to the above tables for Microsoft’s recommendation. You can also file a support request if more assistance is needed.
2. [Request quota for the new target VM](../azure-portal/supportability/per-vm-quota-requests.md)).
3. [Resize the virtual machine](resize-vm.md). 

##  Help and support 

If you have a support plan and you need technical help, create a [support request](https://portal.azure.com/). 

1. Under _Issue type_, select **Technical**. 
2. Under _Subscription_, select your subscription. 
3. Under _Service_, click **My services**.  
4. Under _Service type_, select **Virtual Machine running Windows/Linux**.
5. Under _Summary_, enter the summary of your request.
6. Under _Problem type_, select **Assistance with resizing my VM.**
7. Under _Problem subtype_, select the option that applies to you.

