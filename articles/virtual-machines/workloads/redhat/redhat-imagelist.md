---
title: Red Hat Enterprise Linux images available in Azure
description: Learn about Red Hat Enterprise Linux images in Microsoft Azure
author: mathapli
ms.service: virtual-machines
ms.subservice: redhat
ms.collection: linux
ms.topic: article
ms.date: 08/01/2022
ms.author: mathapli
---

# Red Hat Enterprise Linux (RHEL) images available in Azure

**Applies to:** :heavy_check_mark: Linux VMs 

Azure offers various RHEL images for different use cases.

> [!NOTE]
> All RHEL images are available in Azure public and Azure Government clouds. They are not available in Microsoft Azure operated by 21Vianet clouds.

## List of RHEL images
This section provides list of RHEL images available in Azure. Unless otherwise stated, all images are LVM-partitioned and attached to regular RHEL repositories (not EUS, not E4S). The following images are currently available for general use:

### RHEL x64 architecture images

Offer| SKU | Partitioning | Provisioning | Notes
:----|:----|:-------------|:-------------|:-----
RHEL          | 7-RAW    | RAW    | Linux Agent | RHEL 7.x family of images. <br> Attached to regular repositories by default (not EUS).
|             | 7-LVM    | LVM    | Linux Agent | RHEL 7.x family of images. <br> Attached to regular repositories by default (not EUS). If you're looking for a standard RHEL image to deploy, use this set of images and/or its Generation 2 counterpart.
|             | 7lvm-gen2| LVM    | Linux Agent | Generation 2, RHEL 7.x family of images. <br> Attached to regular repositories by default (not EUS). If you're looking for a standard RHEL image to deploy, use this set of images and/or its Generation 1 counterpart.
|             | 7-RAW-CI | RAW-CI | cloud-init  | RHEL 7.x family of images. <br> Attached to regular repositories by default (not EUS).
|             | 7.2      | RAW    | Linux Agent |
|             | 7.3      | RAW    | Linux Agent |
|             | 7.4      | RAW    | Linux Agent | Attached to EUS repositories by default as of April 2019.
|             | 74-gen2  | RAW    | Linux Agent | Attached to EUS repositories by default.
|             | 7.5      | RAW    | Linux Agent | Attached to EUS repositories by default as of June 2019.
|             | 75-gen2  | RAW    | Linux Agent | Attached to EUS repositories by default.
|             | 7.6      | RAW    | Linux Agent | Attached to EUS repositories by default as of May 2019.
|             | 76-gen2  | RAW    | Linux Agent | Attached to EUS repositories by default.
|             | 7.7      | LVM    | Linux Agent | Attached to EUS repositories by default.
|             | 77-gen2  | LVM    | Linux Agent | Attached to EUS repositories by default.
|             | 7.8      | LVM    | Linux Agent | Attached to regular repositories (EUS unavailable for RHEL 7.8)
|             | 78-gen2  | LVM    | Linux Agent | Attached to regular repositories (EUS unavailable for RHEL 7.8)
|             | 7.9      | LVM    | Linux Agent | Attached to regular repositories (EUS unavailable for RHEL 7.9)
|             | 79-gen2  | LVM    | Linux Agent | Attached to regular repositories (EUS unavailable for RHEL 7.9)
|             | 8-LVM    | LVM    | Linux Agent | RHEL 8.x family of images. Attached to regular repositories.
|             | 8-lvm-gen2| LVM    | Linux Agent | Hyper-V Generation 2 - RHEL 8.x family of images. Attached to regular repositories.
|             | 8        | LVM    | Linux Agent | RHEL 8.0 images.
|             | 8-gen2   | LVM    | Linux Agent | Hyper-V Generation 2 - RHEL 8.0 images.
|             | 8.1      | LVM    | Linux Agent | Attached to EUS repositories by default.
|             | 81gen2   | LVM    | Linux Agent | Hyper-V Generation 2 -Attached to EUS repositories as of November 2020.
|             | 8.1-ci   | LVM    | Linux Agent | Attached to EUS repositories as of November 2020.
|             | 81-ci-gen2| LVM    | Linux Agent | Hyper-V Generation 2 - Attached to EUS repositories as of November 2020.
|             | 8.2      | LVM    | Linux Agent | Attached to EUS repositories as of November 2020.
|             | 82gen2   | LVM    | Linux Agent | Hyper-V Generation 2 - Attached to EUS repositories as of November 2020.
|             | 8.3      | LVM    | Linux Agent |  Attached to regular repositories (EUS unavailable for RHEL 8.3)
|             | 83-gen2  | LVM    | Linux Agent |Hyper-V Generation 2 -  Attached to regular repositories (EUS unavailable for RHEL 8.3)
|             | 8.4      | LVM    | Linux Agent | Attached to EUS repositories 
|             | 84-gen2  | LVM    | Linux Agent |Hyper-V Generation 2 -  Hyper-V Generation 2 - Attached to EUS repositories
|             | 8.5      | LVM    | Linux Agent |  Attached to regular repositories (EUS unavailable for RHEL 8.5)
|             | 85-gen2  | LVM    | Linux Agent |Hyper-V Generation 2 -  Attached to regular repositories (EUS unavailable for RHEL 8.5)
|             | 8.6      | LVM    | Linux Agent | Attached to EUS repositories 
|             | 86-gen2  | LVM    | Linux Agent |Hyper-V Generation 2 -  Hyper-V Generation 2 - Attached to EUS repositories 
|             | 9.0      | LVM    | Linux Agent | Currently attached to regular repositores. Will be attached to EUS repositories once they become available 
|             | 90-gen2  | LVM    | Linux Agent |Hyper-V Generation 2 - Currently attached to regular repositores. Will be attached to EUS repositories once they become available
RHEL-SAP-APPS | 6.8      | RAW    | Linux Agent | RHEL 6.8 for SAP Business Applications. Outdated in favor of the RHEL-SAP images.
|             | 7.3      | LVM    | Linux Agent | RHEL 7.3 for SAP Business Applications. Outdated in favor of the RHEL-SAP images.
|             | 7.4      | LVM    | Linux Agent | RHEL 7.4 for SAP Business Applications
|             | 7.6      | LVM    | Linux Agent | RHEL 7.6 for SAP Business Applications
|             | 7.7      | LVM    | Linux Agent | RHEL 7.7 for SAP Business Applications
|             | 77-gen2  | LVM    | Linux Agent | RHEL 7.7 for SAP Business Applications. Generation 2 image
|             | 8.1      | LVM    | Linux Agent | RHEL 8.1 for SAP Business Applications
|             | 81-gen2  | LVM    | Linux Agent | RHEL 8.1 for SAP Business Applications. Generation 2 image
|             | 8.2      | LVM    | Linux Agent | RHEL 8.2 for SAP Business Applications
|             | 82-gen2  | LVM    | Linux Agent | RHEL 8.2 for SAP Business Applications. Generation 2 image
|             | 8.4      | LVM    | Linux Agent | RHEL 8.4 for SAP Business Applications
|             | 84-gen2  | LVM    | Linux Agent | RHEL 8.4 for SAP Business Applications. Generation 2 image
|             | 8.6      | LVM    | Linux Agent | RHEL 8.6 for SAP Business Applications 
|             | 86-gen2  | LVM    | Linux Agent | RHEL 8.6 for SAP Business Applications. Generation 2 image 
RHEL-SAP-HA   | 7.4      | LVM    | Linux Agent | RHEL 7.4 for SAP with HA and Update Services. Images are attached to E4S repositories. Will charge a premium for SAP and HA repositories and RHEL, on top of the base compute fees
|             | 74sapha-gen2 | LVM    | Linux Agent | RHEL 7.4 for SAP with HA and Update Services. Generation 2 image Attached to E4S repositories. Will charge a premium for SAP and HA repositories and RHEL, on top of the base compute fees
|             | 7.5      | LVM    | Linux Agent | RHEL 7.5 for SAP with HA and Update Services. Images are attached to E4S repositories. Will charge a premium for SAP and HA repositories and RHEL, on top of the base compute fees
|             | 7.6      | LVM    | Linux Agent | RHEL 7.6 for SAP with HA and Update Services. Images are attached to E4S repositories. Will charge a premium for SAP and HA repositories and RHEL, on top of the base compute fees
|             | 76sapha-gen2 | LVM    | Linux Agent | RHEL 7.6 for SAP with HA and Update Services. Generation 2 image Attached to E4S repositories. Will charge a premium for SAP and HA repositories and RHEL, on top of the base compute fees
|             | 7.7      | LVM    | Linux Agent | RHEL 7.7 for SAP with HA and Update Services. Images are attached to E4S repositories. Will charge a premium for SAP and HA repositories and RHEL, on top of the base compute fees
|             | 77sapha-gen2 | LVM    | Linux Agent | RHEL 7.7 for SAP with HA and Update Services. Generation 2 image Attached to E4S repositories.Will charge a premium for SAP and HA repositories and RHEL, on top of the base compute fees
|             | 8.1      | LVM    | Linux Agent | RHEL 8.1 for SAP with HA and Update Services. Images are attached to E4S repositories. Will charge a premium for SAP and HA repositories and RHEL, on top of the base compute fees
|             | 81sapha-gen2          | LVM    | Linux Agent | RHEL 8.1 for SAP with HA and Update Services. Generation 2 images Attached to E4S repositories. Will charge a premium for SAP and HA repositories and RHEL, on top of the base compute fees
|             | 8.2      | LVM    | Linux Agent | RHEL 8.2 for SAP with HA and Update Services. Will charge a premium for SAP and HA repositories and RHEL, on top of the base compute fees
|             | 82sapha-gen2          | LVM    | Linux Agent | RHEL 8.2 for SAP with HA and Update Services. Generation 2 images Attached to E4S repositories. Will charge a premium for SAP and HA repositories and RHEL, on top of the base compute fees
|             | 8.4      | LVM    | Linux Agent | RHEL 8.4 for SAP with HA and Update Services. Will charge a premium for SAP and HA repositories and RHEL, on top of the base compute fees
|             | 84sapha-gen2          | LVM    | Linux Agent | RHEL 8.4 for SAP with HA and Update Services. Generation 2 images Attached to E4S repositories. Will charge a premium for SAP and HA repositories and RHEL, on top of the base compute fees
|             | 8.6      | LVM    | Linux Agent | RHEL 8.6 for SAP with HA and Update Services. Will charge a premium for SAP and HA repositories and RHEL, on top of the base compute fees 
|             | 86sapha-gen2          | LVM    | Linux Agent | RHEL 8.6 for SAP with HA and Update Services. Generation 2 images Attached to E4S repositories. Will charge a premium for SAP and HA repositories and RHEL, on top of the base compute fees 
rhel-byos     |rhel-lvm74| LVM    | Linux Agent | RHEL 7.4 BYOS images, not attached to any source of updates, won't charge an RHEL premium
|             |rhel-lvm75| LVM    | Linux Agent | RHEL 7.5 BYOS images, not attached to any source of updates, won't charge an RHEL premium
|             |rhel-lvm76| LVM    | Linux Agent | RHEL 7.6 BYOS images, not attached to any source of updates, won't charge an RHEL premium
|             |rhel-lvm76-gen2| LVM    | Linux Agent | RHEL 7.6 Generation 2 BYOS images, not attached to any source of updates, won't charge an RHEL premium
|             |rhel-lvm77| LVM    | Linux Agent | RHEL 7.7 BYOS images, not attached to any source of updates, won't charge an RHEL premium
|             |rhel-lvm77-gen2| LVM    | Linux Agent | RHEL 7.7 Generation 2 BYOS images, not attached to any source of updates, won't charge an RHEL premium
|             |rhel-lvm78| LVM    | Linux Agent | RHEL 7.8 BYOS images, not attached to any source of updates, won't charge an RHEL premium
|             |rhel-lvm78-gen2| LVM    | Linux Agent | RHEL 7.8 Generation 2 BYOS images, not attached to any source of updates, won't charge an RHEL premium
|             |rhel-lvm8 | LVM    | Linux Agent | RHEL 8.0 BYOSimages, not attached to any source of updates, won't charge an RHEL premium
|             |rhel-lvm8-gen2 | LVM    | Linux Agent | RHEL 8.0 Generation 2 BYOSimages, not attached to any source of updates, won't charge an RHEL premium
|             |rhel-lvm81 | LVM    | Linux Agent | RHEL 8.1 BYOSimages, not attached to any source of updates, won't charge an RHEL premium
|             |rhel-lvm81-gen2 | LVM    | Linux Agent | RHEL 8.1 Generation 2 BYOSimages, not attached to any source of updates, won't charge an RHEL premium
|             |rhel-lvm82 | LVM    | Linux Agent | RHEL 8.2 BYOSimages, not attached to any source of updates, won't charge an RHEL premium
|             |rhel-lvm82-gen2 | LVM    | Linux Agent | RHEL 8.2 Generation 2 BYOSimages, not attached to any source of updates, won't charge an RHEL premium
|             |rhel-lvm83 | LVM    | Linux Agent | RHEL 8.3 BYOSimages, not attached to any source of updates, won't charge an RHEL premium
|             |rhel-lvm83-gen2 | LVM    | Linux Agent | RHEL 8.3 Generation 2 BYOSimages, not attached to any source of updates, won't charge an RHEL premium
|             |rhel-lvm84 | LVM    | Linux Agent | RHEL 8.4 BYOSimages, not attached to any source of updates, won't charge an RHEL premium
|             |rhel-lvm84-gen2 | LVM    | Linux Agent | RHEL 8.4 Generation 2 BYOSimages, not attached to any source of updates, won't charge an RHEL premium
|             |rhel-lvm85 | LVM    | Linux Agent | RHEL 8.5 BYOSimages, not attached to any source of updates, won't charge an RHEL premium
|             |rhel-lvm85-gen2 | LVM    | Linux Agent | RHEL 8.5 Generation 2 BYOSimages, not attached to any source of updates, won't charge an RHEL premium
|             |rhel-lvm86 | LVM    | Linux Agent | RHEL 8.6 BYOSimages, not attached to any source of updates, won't charge an RHEL premium
|             |rhel-lvm86-gen2 | LVM    | Linux Agent | RHEL 8.6 Generation 2 BYOSimages, not attached to any source of updates, won't charge an RHEL premium
|             |rhel-lvm90 | LVM    | Linux Agent | RHEL 9.0 BYOSimages, not attached to any source of updates, won't charge an RHEL premium
|             |rhel-lvm90-gen2 | LVM    | Linux Agent | RHEL 9.0 Generation 2 BYOSimages, not attached to any source of updates, won't charge an RHEL premium
RHEL-SAP (out of support)        | 7.4      | LVM    | Linux Agent | RHEL 7.4 for SAP HANA and Business Apps. Images are attached to E4S repositories, will charge a premium for SAP and RHEL and the base compute fee
|             | 74sap-gen2| LVM    | Linux Agent | RHEL 7.4 for SAP HANA and Business Apps. Generation 2 image. Images are attached to E4S repositories, will charge a premium for SAP and RHEL and the base compute fee
|             | 7.5      | LVM    | Linux Agent | RHEL 7.5 for SAP HANA and Business Apps. Images are attached to E4S repositories, will charge a premium for SAP and RHEL and the base compute fee
|             | 75sap-gen2| LVM    | Linux Agent | RHEL 7.5 for SAP HANA and Business Apps. Generation 2 image. Images are attached to E4S repositories, will charge a premium for SAP and RHEL and the base compute fee
|             | 7.6      | LVM    | Linux Agent | RHEL 7.6 for SAP HANA and Business Apps. Images are attached to E4S repositories, will charge a premium for SAP and RHEL and the base compute fee
|             | 76sap-gen2| LVM    | Linux Agent | RHEL 7.6 for SAP HANA and Business Apps. Generation 2 image. Images are attached to E4S repositories, will charge a premium for SAP and RHEL and the base compute fee
|             | 7.7      | LVM    | Linux Agent | RHEL 7.7 for SAP HANA and Business Apps. Images are attached to E4S repositories, will charge a premium for SAP and RHEL and the base compute fee
RHEL-SAP-HANA (out of support) | 6.7       | RAW    | Linux Agent | RHEL 6.7 for SAP HANA. Outdated in favor of the RHEL-SAP images. This image will be removed in November 2020. More details about Red Hat's SAP cloud offerings are available at [SAP offerings on certified cloud providers](https://access.redhat.com/articles/3751271)
|             | 7.2      | LVM    | Linux Agent | RHEL 7.2 for SAP HANA. Outdated in favor of the RHEL-SAP images. This image will be removed in November 2020. More details about Red Hat's SAP cloud offerings are available at [SAP offerings on certified cloud providers](https://access.redhat.com/articles/3751271)
|             | 7.3      | LVM    | Linux Agent | RHEL 7.3 for SAP HANA. Outdated in favor of the RHEL-SAP images. This image will be removed in November 2020. More details about Red Hat's SAP cloud offerings are available at [SAP offerings on certified cloud providers](https://access.redhat.com/articles/3751271)
RHEL-HA (out of support)       | 7.4       | LVM    | Linux Agent | RHEL 7.4 with HA Add-On. Will charge a premium for HA and RHEL on top of the base compute fee. Outdated in favor of the RHEL-SAP-HA images
|             | 7.5      | LVM    | Linux Agent | RHEL 7.5 with HA Add-On. Will charge a premium for HA and RHEL on top of the base compute fee. Outdated in favor of the RHEL-SAP-HA images
|             | 7.6      | LVM    | Linux Agent | RHEL 7.6 with HA Add-On. Will charge a premium for HA and RHEL on top of the base compute fee. Outdated in favor of the RHEL-SAP-HA images

> [!NOTE]
> The RHEL-SAP-HANA product offering is considered end of life by Red Hat. Existing deployments will continue to work normally, but Red Hat recommends that customers migrate from the RHEL-SAP-HANA images to the RHEL-SAP-HA images which includes the SAP HANA repositories and the HA add-on. More details about Red Hat's SAP cloud offerings are available at [SAP offerings on certified cloud providers](https://access.redhat.com/articles/3751271).
>
> RHEL 6.7, 6.8, 6.9, and 6.10 have [Extended Lifecycle Support](redhat-extended-lifecycle-support.md) available.

### RHEL ARM64 architecture images

Offer| SKU | Partitioning | Provisioning | Notes
:----|:----|:-------------|:-------------|:-----
RHEL          | 8_6-arm64      | LVM    | Linux Agent | Hyper-V Generation 2 - Attached to EUS repositories 

## Next steps
* Learn more about the [Red Hat images in Azure](./redhat-images.md).
* Learn more about the [Red Hat Update Infrastructure](./redhat-rhui.md).
* Learn more about the [RHEL BYOS offer](./byos.md).
* Information on Red Hat support policies for all versions of RHEL can be found on the [Red Hat Enterprise Linux Life Cycle](https://access.redhat.com/support/policy/updates/errata) page.
