---
title: Co-locate Windows Azure VMs 
description: Learn about how co-locating Azure VM resources can improve latency.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: gwallace
ms.service: virtual-machines-windows

ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 10/30/2019
ms.author: zivr
---

# Co-locate resource for improved latency

When deploying your application in Azure, spreading instances across regions or availability zones creates network latency, which may impact the overall performance of your application. 


## Proximity placement groups 

[!INCLUDE [virtual-machines-common-ppg-overview](../../../includes/virtual-machines-common-ppg-overview.md)]

## Next steps

Deploy a VM to a [proximity placement group](proximity-placement-groups.md) using Azure PowerShell.

Learn how to [test network latency](https://aka.ms/TestNetworkLatency?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

Learn how to [optimize network throughput](https://docs.microsoft.com/azure/virtual-network/virtual-network-optimize-network-bandwidth?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).  

Learn how to [use proximity placement groups with SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-proximity-placement-scenarios?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).