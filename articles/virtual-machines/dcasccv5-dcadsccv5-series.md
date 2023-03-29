---
title: Azure DCas_cc_v5 and DCads_cc_v5-series
description: Specifications for Azure Confidential Computing's Azure DCas_cc_v5 and DCads_cc_v5-series confidential virtual machines. 
author: ananyagarg
ms.author: ananyagarg
ms.reviewer: mimckitt
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual 
ms.date: 03/29/2022

---

# DCas_cc_v5 and DCads_cc_v5-series (Preview)

**Applies to:** :heavy_check_mark: Linux VMs in Azure Kubernetes Service

> [!NOTE]
> Preview Terms - These VM sizes are subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


This family of VMs is the nested confidential VMs. In these VM sizes, customers can allocate private regions of memory, by provisioning confidential nested VMs, giving them more granular protection against processes or administrators with higher privilege levels. This enables customers to protect the confidentiality and integrity of their code and data. Currently, this feature is enabled only through deployments in [Azure Kubernetes Service (AKS)](../../articles/aks/index.yml). If you wish to enable it in regular VM deployments, head to [confidential VMs](../../articles/confidential-computing/confidential-vm-overview.md) or contact [azconfidentialpm@microsoft.com](mailto:azconfidentialpm@microsoft.com).

This series supports Standard SSD, Standard HDD, and Premium SSD disk types. Billing for disk storage and VMs is separate. To estimate your costs, use the [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/).

> [!NOTE]
> There are some [pricing differences based on your encryption settings](../../articles/confidential-computing/confidential-vm-overview.md#encryption-pricing-differences) for nested confidential VMs.


### DCas_cc_v5-series products

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max uncached disk throughput: IOPS/MBps | Max NICs |
|---|---|---|---|---|---|---|
| Standard_DC4as_cc_v5  | 4  | 32  | Remote Storage Only | 8  | 6400/144   | 2 |
| Standard_DC8as_cc_v5  | 8  | 64  | Remote Storage Only | 16 | 12800/200  | 4 |
| Standard_DC16as_cc_v5 | 16 | 128 | Remote Storage Only | 32 | 25600/384  | 4 |
| Standard_DC32as_cc_v5 | 32 | 256 | Remote Storage Only | 32 | 51200/768  | 8 |
| Standard_DC48as_cc_v5 | 48 | 384 | Remote Storage Only | 32 | 76800/1152 | 8 |
| Standard_DC64as_cc_v5 | 64 | 512 | Remote Storage Only | 32 | 80000/1200 | 8 |
| Standard_DC96as_cc_v5 | 96 | 672 | Remote Storage Only | 32 | 80000/1600 | 8 |


### DCads_cc_v5-series products

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max uncached disk throughput: IOPS/MBps | Max NICs |
|---|---|---|---|---|---|---|
| Standard_DC4ads_cc_v5  | 4  | 32  | 150 | 8  | 6400/144   | 2 |
| Standard_DC8ads_cc_v5  | 8  | 64  | 300 | 16 | 12800/200  | 4 |
| Standard_DC16ads_cc_v5 | 16 | 128 | 600 | 32 | 25600/384  | 4 |
| Standard_DC32ads_cc_v5 | 32 | 256 | 1200 | 32 | 51200/768  | 8 |
| Standard_DC48ads_cc_v5 | 48 | 384 | 1800 | 32 | 76800/1152 | 8 |
| Standard_DC64ads_cc_v5 | 64 | 512 | 2400 | 32 | 80000/1200 | 8 |
| Standard_DC96ads_cc_v5 | 96 | 672 | 3600 | 32 | 80000/1600 | 8 |

## Next steps

> [!div class="nextstepaction"]
> [Confidential virtual machine options on AMD processors](../../articles/confidential-computing/confidential-vm-overview.md)
