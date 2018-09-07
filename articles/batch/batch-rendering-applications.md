---
title: Batch rendering applications
description: Pre-installed Batch rendering applications
services: batch
author: mscurrell
ms.author: markscu
ms.date: 08/02/2018
ms.topic: conceptual
---

# Pre-installed applications on rendering VM images

It's possible to use any rendering applications with Azure Batch. However, Azure Marketplace VM images are available with common applications pre-installed.

Where applicable, pay-per-use licensing is available for the pre-installed rendering applications. When a Batch pool is created, the required applications can be specified and both the cost of VM and applications will be billed per minute. Application prices are listed on the [Azure Batch pricing page](https://azure.microsoft.com/pricing/details/batch/#graphic-rendering).

Some applications only support Windows, but most are supported on both Windows and Linux.

## Applications on CentOS 7 rendering nodes

* Autodesk Maya I/O 2017 Update 5 (cut 201708032230)
* Autodesk Maya I/O 2018 Update 2 (cut 201711281015)
* Autodesk Arnold for Maya 2017 (Arnold version 5.0.1.1) MtoA-2.0.1.1-2017
* Autodesk Arnold for Maya 2018 (Arnold version 5.0.1.4) MtoA-2.1.0.3-2018
* Chaos Group V-Ray for Maya 2017 (version 3.60.04)
* Chaos Group V-Ray for Maya 2018 (version 3.60.04)
* Blender (2.68)

## Applications on Windows Server 2016 rendering nodes

* Autodesk Maya I/O 2017 Update 5 (version 17.4.5459)
* Autodesk Maya I/O 2018 Update 3 (version 18.3.0.7040)  
* Autodesk 3ds Max I/O 2019 Update 1 (version 21.10.1314)
* Autodesk 3ds Max I/O 2018 Update 4 (version 20.4.0.4254)
* Autodesk Arnold for Maya (Arnold version 5.0.1.1) MtoA-2.0.1.1-2017
* Autodesk Arnold for Maya (Arnold version 5.0.1.4) MtoA-2.0.2.3-2018
* Autodesk Arnold for 3ds Max (Arnold version 5.0.2.4)(version 1.2.926)
* Chaos Group V-Ray for Maya (version 3.52.03)
* Chaos Group V-Ray for 3ds Max (version 3.60.02)
* Blender (2.79)

## Next steps

To use the rendering VM images, they need to be specified in the pool configuration when a pool is created; see the [Batch pool capabilities for rendering](https://docs.microsoft.com/azure/batch/batch-rendering-functionality#batch-pools).