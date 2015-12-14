<properties
 pageTitle="Virtual machine basic tier sizes | Microsoft Azure"
 description="Lists basic tier sizes for virtual machines."
 services="virtual-machines"
 documentationCenter=""
 authors="cynthn"
 manager="timlt"
 editor=""
 tags="azure-resource-manager,azure-service-management"/>

<tags
ms.service="virtual-machines"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="vm-multiple"
 ms.workload="infrastructure-services"
 ms.date="12/11/2015"
 ms.author="cynthn"/>
 
# Basic tier sizes for virtual machines

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

The basic tier sizes are primarily for development workloads and other applications that don't require load balancing, auto-scaling, or memory-intensive virtual machines. For information about VM sizes that are more appropriate for production applications, see (Sizes for virtual machines)[virtual-machines-size-specs.md] and for VM pricing information, see [Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/).


|Size – Size\Name |CPU cores|Memory|NICs (Max)|Max temporary disk size |Max. data disks 1023 GB each)|Max. IOPS (300 per disk)|
|---|---|---|---|---|---|---|
|A0\Basic_A0|1|768 MB|1| 20 GB|1|1x300|
|A1\Basic_A1|1|1.75 GB|1| 40 GB |2|2x300|
|A2\Basic_A2|2|3.5 GB|1| 60 GB|4|4x300|
|A3\Basic_A3|4|7 GB|1| 120 GB |8|8x300|
|A4\Basic_A4|8|14 GB|1| 240 GB |16|16x300|
