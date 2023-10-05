---
title: Rendering applications
description: It's possible to use any rendering applications with Azure Batch. However, Azure Marketplace VM images are available with common applications pre-installed.
ms.date: 03/12/2021
ms.topic: how-to
---

# Pre-installed applications on Batch rendering VM images

It's possible to use any rendering applications with Azure Batch. However, Azure Marketplace VM images are available with common applications pre-installed.

Where applicable, pay-for-use licensing is available for the pre-installed rendering applications. When a Batch pool is created, the required applications can be specified and both the cost of VM and applications will be billed per minute. Application prices are listed on the [Azure Batch pricing page](https://azure.microsoft.com/pricing/details/batch/#graphic-rendering).

Some applications only support Windows, but most are supported on both Windows and Linux.

> [!WARNING]
> The rendering VM images and pay-for-use licensing have been [deprecated and will be retired on February 29, 2024](https://azure.microsoft.com/updates/azure-batch-rendering-vm-images-licensing-will-be-retired-on-29-february-2024/). To use Batch for rendering, [a custom VM image and standard application licensing should be used.](batch-rendering-functionality.md#batch-pools-using-custom-vm-images-and-standard-application-licensing)

## Applications on latest CentOS 7 rendering image

The following list applies to the CentOS rendering image, version 1.2.0.

* Autodesk Maya I/O 2020 Update 4.6
* Autodesk Arnold for Maya 2020 (Arnold version 6.2.0.0) MtoA-4.2.0-2020
* Chaos Group V-Ray for Maya 2020 (version 5.00.21)
* Blender (2.80)
* AZ 10

## Applications on latest Windows Server rendering image

The following list applies to the Windows Server rendering image, version 1.5.0.

* Autodesk Maya I/O 2020 Update 4.4
* Autodesk 3ds Max I/O 2021 Update 3
* Autodesk Arnold for Maya 2020 (Arnold version 6.1.0.1) MtoA-4.1.1.1-2020
* Autodesk Arnold for 3ds Max 2021 (Arnold version 6.1.0.1) MAXtoA-4.2.2.20-2021
* Chaos Group V-Ray for Maya 2020 (version 5.00.21)
* Chaos Group V-Ray for 3ds Max 2021 (version 5.00.05)
* Blender (2.79)
* Blender (2.80)
* AZ 10

> [!IMPORTANT]
> To run V-Ray with Maya outside of the [Azure Batch extension templates](https://github.com/Azure/batch-extension-templates), start `vrayses.exe` before running the render. To start the vrayses.exe outside of the templates you can use the following command `%MAYA_2020%\vray\bin\vrayses.exe"`.
>
> For an example, see the start task of the [Maya and V-Ray template](https://github.com/Azure/batch-extension-templates/blob/master/templates/maya/render-vray-windows/pool.template.json) on GitHub.

## Applications on previous Windows Server rendering images

The following list applies to Windows Server 2016, version 1.3.8 rendering images.

* Autodesk Maya I/O 2017 Update 5 (version 17.4.5459)
* Autodesk Maya I/O 2018 Update 6 (version 18.4.0.7622)
* Autodesk Maya I/O 2019
* Autodesk 3ds Max I/O 2018 Update 4 (version 20.4.0.4254)
* Autodesk 3ds Max I/O 2019 Update 1 (version 21.2.0.2219)
* Autodesk 3ds Max I/O 2020 Update 2
* Autodesk Arnold for Maya 2017 (Arnold version 5.3.0.2) MtoA-3.2.0.2-2017
* Autodesk Arnold for Maya 2018 (Arnold version 5.3.0.2) MtoA-3.2.0.2-2018
* Autodesk Arnold for Maya 2019 (Arnold version 5.3.0.2) MtoA-3.2.0.2-2019
* Autodesk Arnold for 3ds Max 2018 (Arnold version 5.3.0.2)(version 1.2.926)
* Autodesk Arnold for 3ds Max 2019 (Arnold version 5.3.0.2)(version 1.2.926)
* Autodesk Arnold for 3ds Max 2020 (Arnold version 5.3.0.2)(version 1.2.926)
* Chaos Group V-Ray for Maya 2017 (version 4.12.01)
* Chaos Group V-Ray for Maya 2018 (version 4.12.01)
* Chaos Group V-Ray for Maya 2019 (version 4.04.03)
* Chaos Group V-Ray for 3ds Max 2018 (version 4.20.01)
* Chaos Group V-Ray for 3ds Max 2019 (version 4.20.01)
* Chaos Group V-Ray for 3ds Max 2020 (version 4.20.01)
* Blender (2.79)
* Blender (2.80)
* AZ 10

The following list applies to Windows Server 2016, version 1.3.7 rendering images.

* Autodesk Maya I/O 2017 Update 5 (version 17.4.5459)
* Autodesk Maya I/O 2018 Update 4 (version 18.4.0.7622)
* Autodesk 3ds Max I/O 2019 Update 1 (version 21.2.0.2219)
* Autodesk 3ds Max I/O 2018 Update 4 (version 20.4.0.4254)
* Autodesk Arnold for Maya 2017 (Arnold version 5.2.0.1) MtoA-3.1.0.1-2017
* Autodesk Arnold for Maya 2018 (Arnold version 5.2.0.1) MtoA-3.1.0.1-2018
* Autodesk Arnold for 3ds Max 2018 (Arnold version 5.0.2.4)(version 1.2.926)
* Autodesk Arnold for 3ds Max 2019 (Arnold version 5.0.2.4)(version 1.2.926)
* Chaos Group V-Ray for Maya 2018 (version 3.52.03)
* Chaos Group V-Ray for 3ds Max 2018 (version 3.60.02)
* Chaos Group V-Ray for Maya 2019 (version 3.52.03)
* Chaos Group V-Ray for 3ds Max 2019 (version 4.10.01)
* Blender (2.79)

> [!NOTE]
> Chaos Group V-Ray for 3ds Max 2019 (version 4.10.01) introduces breaking changes to V-ray. To use the previous version (version 3.60.02), use Windows Server 2016, version 1.3.2 rendering nodes.

## Applications on previous CentOS rendering images

The following list applies to CentOS 7.6, version 1.1.6 rendering images.

* Autodesk Maya I/O 2017 Update 5 (cut 201708032230)
* Autodesk Maya I/O 2018 Update 2 (cut 201711281015)
* Autodesk Maya I/O 2019 Update 1
* Autodesk Arnold for Maya 2017 (Arnold version 5.3.1.1) MtoA-3.2.1.1-2017
* Autodesk Arnold for Maya 2018 (Arnold version 5.3.1.1) MtoA-3.2.1.1-2018
* Autodesk Arnold for Maya 2019 (Arnold version 5.3.1.1) MtoA-3.2.1.1-2019
* Chaos Group V-Ray for Maya 2017 (version 3.60.04)
* Chaos Group V-Ray for Maya 2018 (version 3.60.04)
* Blender (2.68)
* Blender (2.8)

## Next steps

To use the rendering VM images, they need to be specified in the pool configuration when a pool is created; see the [Batch pool capabilities for rendering](./batch-rendering-functionality.md).
