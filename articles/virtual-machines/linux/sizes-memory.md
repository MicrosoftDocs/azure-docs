---
title: Linux Azure VM sizes - Memory | Microsoft Docs
description: Lists the different memory optimized sizes available for Linux virtual machines in Azure. Lists information about the number of vCPUs, data disks and NICs as well as storage throughput and network bandwidth for sizes in this series.
services: virtual-machines-linux
documentationcenter: ''
author: jonbeck7
manager: jeconnoc
editor: ''
tags: azure-resource-manager,azure-service-management
keywords: VM isolation,isolated VM,isolation,isolated

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 05/15/2019
ms.author: jonbeck

---

# Memory optimized virtual machine sizes


[!INCLUDE [virtual-machines-common-sizes-memory](../../../includes/virtual-machines-common-sizes-memory.md)]

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../../includes/virtual-machines-common-sizes-table-defs.md)]

## Find a SUSE image

To select an appropriate SUSE image in the Azure Portal: 

1. In the Azure Portal, select **Create a resource** 
1. Search for “SUSE SAP” 
1. SLES for SAP Generation 2 images are available as either pay-as-you-go, or bring your own subscription (BYOS). In the search results, expand the desired image category:

    * SUSE Linux Enterprise Server (SLES) for SAP
    * SUSE Linux Enterprise Server (SLES) for SAP (BYOS)
    
1. SUSE images compatible with the Mv2-series are prefixed with the name `GEN2:`. The following SUSE images are available for Mv2-series VMs:

    * GEN2: SUSE Linux Enterprise Server (SLES) 12 SP4 for SAP Applications
    * GEN2: SUSE Linux Enterprise Server (SLES) 15 for SAP Applications
    * GEN2: SUSE Linux Enterprise Server (SLES) 12 SP4 for SAP Applications (BYOS)
    * GEN2: SUSE Linux Enterprise Server (SLES) 15 for SAP Applications (BYOS)

### Select a SUSE image via Azure CLI

To see a list of the currently available SLES for SAP image for Mv2-series VMs, use the following [`az vm image list`](https://docs.microsoft.com/cli/azure/vm/image?view=azure-cli-latest#az-vm-image-list) command:

```azurecli
az vm image list --output table --publisher SUSE --sku gen2 --all
```

The command outputs the currently available Generation 2 VMs available from SUSE for Mv2-series VMs. 

Example output:

```
Offer          Publisher  Sku          Urn                                        Version
-------------  ---------  -----------  -----------------------------------------  ----------
SLES-SAP       SUSE       gen2-12-sp4  SUSE:SLES-SAP:gen2-12-sp4:2019.05.13       2019.05.13
SLES-SAP       SUSE       gen2-15      SUSE:SLES-SAP:gen2-15:2019.05.13           2019.05.13
SLES-SAP-BYOS  SUSE       gen2-12-sp4  SUSE:SLES-SAP-BYOS:gen2-12-sp4:2019.05.13  2019.05.13
SLES-SAP-BYOS  SUSE       gen2-15      SUSE:SLES-SAP-BYOS:gen2-15:2019.05.13      2019.05.13
```

## Other sizes
- [General purpose](sizes-general.md)
- [Compute optimized](sizes-compute.md)
- [Storage optimized](sizes-storage.md)
- [GPU](../windows/sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

* Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.

* Learn how to [Create and Manage Linux VMs with the Azure CLI](tutorial-manage-vm.md)