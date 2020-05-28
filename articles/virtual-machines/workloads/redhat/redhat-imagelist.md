---
title: Red Hat Enterprise Linux images in Azure | Microsoft Docs
description: Learn about Red Hat Enterprise Linux images in Microsoft Azure
services: virtual-machines-linux
documentationcenter: ''
author: asinn826
manager: BorisB2015
editor: ''

ms.service: virtual-machines-linux

ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 04/16/2020
ms.author: alsin

---

# Red Hat Enterprise Linux (RHEL) images available in Azure
Azure offers a variety of RHEL images for different use cases.

> [!NOTE]
> All RHEL images are available in Azure public and Azure Government clouds. They are not available in Azure China clouds.

## List of RHEL images
This is a list of RHEL images available in Azure. Unless otherwise stated, all images are LVM-partitioned and attached to regular RHEL repositories (not EUS, not E4S). The following images are currently available for general use:

> [!NOTE]
> RAW images are no longer being produced in favor of LVM-partitioned images. LVM provides several advantages over the older raw (non-LVM) partitioning scheme, including significantly more flexible partition resizing options.

Offer| SKU | Partitioning | Provisioning | Notes
:----|:----|:-------------|:-------------|:-----
RHEL          | 6.7      | RAW    | Linux Agent |
|             | 6.8      | RAW    | Linux Agent |
|             | 6.9      | RAW    | Linux Agent |
|             | 6.10     | RAW    | Linux Agent |
|             | 7-RAW    | RAW    | Linux Agent | RHEL 7.x family of images. <br> Attached to regular repositories by default (not EUS).
|             | 7-LVM    | LVM    | Linux Agent | RHEL 7.x family of images. <br> Attached to regular repositories by default (not EUS). If you are looking for a standard RHEL image to deploy, use this set of images and/or its Generation 2 counterpart.
|             | 7lvm-gen2| LVM    | Linux Agent | Generation 2, RHEL 7.x family of images. <br> Attached to regular repositories by default (not EUS). If you are looking for a standard RHEL image to deploy, use this set of images and/or its Generation 1 counterpart.
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
|             | 8-LVM    | LVM    | Linux Agent | RHEL 8.x family of images. Attached to regular repositories.
|             | 8-lvm-gen2| LVM    | Linux Agent | Hyper-V Generation 2 - RHEL 8.x family of images. Attached to regular repositories.
|             | 8        | LVM    | Linux Agent | RHEL 8.0 images
|             | 8-gen2   | LVM    | Linux Agent | Hyper-V Generation 2 - RHEL 8.0 images.
|             | 8.1      | LVM    | Linux Agent | RHEL 8.1 images. Currently attached to regular repositories.
|             | 81gen2   | LVM    | Linux Agent | Hyper-V Generation 2 - RHEL 8.1 images. Currently attached to regular repositories.
RHEL-SAP      | 7.4      | LVM    | Linux Agent | RHEL 7.4 for SAP HANA and Business Apps. Attached to E4S repositories, will charge a premium for SAP and RHEL as well as the base compute fee.
|             | 74sap-gen2| LVM    | Linux Agent | RHEL 7.4 for SAP HANA and Business Apps. Generation 2 image. Attached to E4S repositories, will charge a premium for SAP and RHEL as well as the base compute fee.
|             | 7.5       | LVM    | Linux Agent | RHEL 7.5 for SAP HANA and Business Apps. Attached to E4S repositories, will charge a premium for SAP and RHEL as well as the base compute fee.
|             | 75sap-gen2| LVM    | Linux Agent | RHEL 7.5 for SAP HANA and Business Apps. Generation 2 image. Attached to E4S repositories, will charge a premium for SAP and RHEL as well as the base compute fee.
|             | 7.6       | LVM    | Linux Agent | RHEL 7.6 for SAP HANA and Business Apps. Attached to E4S repositories, will charge a premium for SAP and RHEL as well as the base compute fee.
|             | 76sap-gen2| LVM    | Linux Agent | RHEL 7.6 for SAP HANA and Business Apps. Generation 2 image. Attached to E4S repositories, will charge a premium for SAP and RHEL as well as the base compute fee.
|             | 7.7       | LVM    | Linux Agent | RHEL 7.7 for SAP HANA and Business Apps. Attached to E4S repositories, will charge a premium for SAP and RHEL as well as the base compute fee.
RHEL-SAP-HANA | 6.7       | RAW    | Linux Agent | RHEL 6.7 for SAP HANA. Outdated in favor of the RHEL-SAP images.
|             | 7.2       | LVM    | Linux Agent | RHEL 7.2 for SAP HANA. Outdated in favor of the RHEL-SAP images.
|             | 7.3       | LVM    | Linux Agent | RHEL 7.3 for SAP HANA. Outdated in favor of the RHEL-SAP images.
RHEL-SAP-APPS | 6.8       | RAW    | Linux Agent | RHEL 6.8 for SAP Business Applications. Outdated in favor of the RHEL-SAP images.
|             | 7.3       | LVM    | Linux Agent | RHEL 7.3 for SAP Business Applications. Outdated in favor of the RHEL-SAP images.
RHEL-HA       | 7.4       | LVM    | Linux Agent | RHEL 7.4 with HA Add-On. Will charge a premium for HA and RHEL on top of the base compute fee.
|             | 7.5       | LVM    | Linux Agent | RHEL 7.5 with HA Add-On. Will charge a premium for HA and RHEL on top of the base compute fee.
|             | 7.6       | LVM    | Linux Agent | RHEL 7.6 with HA Add-On. Will charge a premium for HA and RHEL on top of the base compute fee.
RHEL-SAP-HA   | 7.4          | LVM    | Linux Agent | RHEL 7.4 for SAP with HA and Update Services. Attached to E4S repositories. Will charge a premium for SAP and HA repositories as well as RHEL, on top of the base compute fees.
|             | 74sapha-gen2 | LVM    | Linux Agent | RHEL 7.4 for SAP with HA and Update Services. Generation 2 image. Attached to E4S repositories. Will charge a premium for SAP and HA repositories as well as RHEL, on top of the base compute fees.
|             | 7.5          | LVM    | Linux Agent | RHEL 7.5 for SAP with HA and Update Services. Attached to E4S repositories. Will charge a premium for SAP and HA repositories as well as RHEL, on top of the base compute fees.
|             | 7.6          | LVM    | Linux Agent | RHEL 7.6 for SAP with HA and Update Services. Attached to E4S repositories. Will charge a premium for SAP and HA repositories as well as RHEL, on top of the base compute fees.
|             | 76sapha-gen2 | LVM    | Linux Agent | RHEL 7.6 for SAP with HA and Update Services. Generation 2 image. Attached to E4S repositories. Will charge a premium for SAP and HA repositories as well as RHEL, on top of the base compute fees.
|             | 7.7          | LVM    | Linux Agent | RHEL 7.7 for SAP with HA and Update Services. Attached to E4S repositories. Will charge a premium for SAP and HA repositories as well as RHEL, on top of the base compute fees.
|             | 77sapha-gen2 | LVM    | Linux Agent | RHEL 7.7 for SAP with HA and Update Services. Generation 2 image. Attached to E4S repositories. Will charge a premium for SAP and HA repositories as well as RHEL, on top of the base compute fees.
rhel-byos     |rhel-lvm74| LVM    | Linux Agent | RHEL 7.4 BYOS images, not attached to any source of updates, will not charge a RHEL premium.
|             |rhel-lvm75| LVM    | Linux Agent | RHEL 7.5 BYOS images, not attached to any source of updates, will not charge a RHEL premium.
|             |rhel-lvm76| LVM    | Linux Agent | RHEL 7.6 BYOS images, not attached to any source of updates, will not charge a RHEL premium.
|             |rhel-lvm77| LVM    | Linux Agent | RHEL 7.7 BYOS images, not attached to any source of updates, will not charge a RHEL premium.
|             |rhel-lvm8 | LVM    | Linux Agent | RHEL 8 BYOS images (RHEL minor version is shown in the image version value), not attached to any source of updates, will not charge a RHEL premium.

> [!NOTE]
> The RHEL-SAP-HANA product offering is considered end of life by Red Hat. Existing deployments will continue to work normally, but Red Hat recommends that customers migrate from the RHEL-SAP-HANA images to the RHEL-SAP-HA images which includes the SAP HANA repositories as well as the HA add-on. More details about Red Hat's SAP cloud offerings are available [here](https://access.redhat.com/articles/3751271).

## Next steps
* Learn more about the [Red Hat images in Azure](./redhat-images.md).
* Learn more about the [Red Hat Update Infrastructure](./redhat-rhui.md).
* Learn more about the [RHEL BYOS offer](./byos.md).
* Information on Red Hat support policies for all versions of RHEL can be found on the [Red Hat Enterprise Linux Life Cycle](https://access.redhat.com/support/policy/updates/errata) page.
