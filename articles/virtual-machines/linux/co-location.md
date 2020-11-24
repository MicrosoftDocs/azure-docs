---
title: Co-locate Linux VMs 
description: Learn about how co-locating Azure VM resources for Linux can improve latency.
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 10/30/2019
ms.author: zivr
---

# Co-locate resources for improved latency

When deploying your application in Azure, spreading instances across regions or availability zones creates network latency, which may impact the overall performance of your application. 

## Proximity placement groups

[!INCLUDE [virtual-machines-common-ppg-overview](../../../includes/virtual-machines-common-ppg-overview.md)]

## Next steps

Deploy a VM to a [proximity placement group](proximity-placement-groups.md) using the Azure CLI.

Learn how to [test network latency](../../virtual-network/virtual-network-test-latency.md?toc=%252fazure%252fvirtual-machines%252flinux%252ftoc.json).

Learn how to [optimize network throughput](../../virtual-network/virtual-network-optimize-network-bandwidth.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).  

Learn how to [use proximity placement groups with SAP applications](../workloads/sap/sap-proximity-placement-scenarios.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).