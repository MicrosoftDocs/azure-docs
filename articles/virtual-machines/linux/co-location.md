---
title: Co-locate Linux Azure VMs | Microsoft Docs
description: Learn about how co-locating Azure VM resources can improve latency.
services: virtual-machines-linux
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''

ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 06/28/2019
ms.author: cynthn
---

# Co-locate resources for improved latency

When deploying your application in Azure, spreading instances across regions or availability zones creates network latency, which may impact the overall performance of your application. 

## Preview: Proximity placement groups

[!INCLUDE [virtual-machines-common-ppg-overview](../../../includes/virtual-machines-common-ppg-overview.md)]

## Next steps

Deploy a VM to a [proximity placement group](proximity-placement-groups.md) using the Azure CLI.

