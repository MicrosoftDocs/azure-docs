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
ms.date: 12/18/2019
ms.author: alsin

---

# Red Hat Enterprise Linux (RHEL) images available in Azure
Azure offers a variety of RHEL images for different use cases.

## List of RHEL images
This is a list of RHEL images available in Azure. Unless otherwise stated, all images are LVM-partitioned and attached to regular RHEL repositories (not EUS, not E4S). The following images are currently available for general use:

Offer| SKU | Partitioning | Provisioning | Notes
:----|:----|:-------------|:-------------|:-----
RHEL          | 6.7      | RAW    | Linux Agent |
|             | 6.8      | RAW    | Linux Agent |
|             | 6.9      | RAW    | Linux Agent |
|             | 6.10     | RAW    | Linux Agent |
|             | 7-RAW    | RAW    | Linux Agent | RHEL 7.x family of images. <br> Attached to regular repositories by default (not EUS).
|             | 7-LVM    | LVM    | Linux Agent | RHEL 7.x family of images. <br> Attached to regular repositories by default (not EUS).
|             | 7-RAW-CI | RAW-CI | cloud-init  | RHEL 7.x family of images. <br> Attached to regular repositories by default (not EUS).
|             | 7.2      | RAW    | Linux Agent |
|             | 7.3      | RAW    | Linux Agent |
|             | 7.4      | RAW    | Linux Agent | Attached to EUS repositories by default as of April 2019.
|             | 7.5      | RAW    | Linux Agent | Attached to EUS repositories by default as of June 2019.
|             | 7.6      | RAW    | Linux Agent | Attached to EUS repositories by default as of May 2019.
|             | 7.7      | LVM    | Linux Agent | Attached to EUS repositories by default.
|             | 8        | LVM    | Linux Agent | RHEL 8.x family of images
|             | 8-gen2   | LVM    | Linux Agent | Hyper-V Generation 2 - RHEL 8.x family of images.
RHEL-SAP      | 7.4      | LVM    | Linux Agent | RHEL 7.4 for SAP HANA and Business Apps. Attached to E4S repositories, will charge a premium for SAP and RHEL as well as the base compute fee.
|             | 7.5      | LVM    | Linux Agent | RHEL 7.5 for SAP HANA and Business Apps. Attached to E4S repositories, will charge a premium for SAP and RHEL as well as the base compute fee.
|             | 7.6      | LVM    | Linux Agent | RHEL 7.5 for SAP HANA and Business Apps. Attached to E4S repositories, will charge a premium for SAP and RHEL as well as the base compute fee.
|             | 7.7      | LVM    | Linux Agent | RHEL 7.5 for SAP HANA and Business Apps. Attached to E4S repositories, will charge a premium for SAP and RHEL as well as the base compute fee.
RHEL-SAP-HANA | 6.7      | RAW    | Linux Agent | RHEL 6.7 for SAP HANA. Outdated in favor of the RHEL-SAP images.
|             | 7.2      | LVM    | Linux Agent | RHEL 7.2 for SAP HANA. Outdated in favor of the RHEL-SAP images.
|             | 7.3      | LVM    | Linux Agent | RHEL 7.3 for SAP HANA. Outdated in favor of the RHEL-SAP images.
RHEL-SAP-APPS | 6.8      | RAW    | Linux Agent | RHEL 6.8 for SAP Business Applications. Outdated in favor of the RHEL-SAP images.
|             | 7.3      | LVM    | Linux Agent | RHEL 7.3 for SAP Business Applications. Outdated in favor of the RHEL-SAP images.
RHEL-HA       | 7.4      | LVM    | Linux Agent | RHEL 7.4 with HA Add-On. Will charge a premium for HA and RHEL on top of the base compute fee.
|             | 7.5      | LVM    | Linux Agent | RHEL 7.5 with HA Add-On. Will charge a premium for HA and RHEL on top of the base compute fee.
|             | 7.6      | LVM    | Linux Agent | RHEL 7.6 with HA Add-On. Will charge a premium for HA and RHEL on top of the base compute fee.
RHEL-SAP-HA   | 7.4      | LVM    | Linux Agent | RHEL 7.4 for SAP with HA Add-On. Attached to E4S repositories. Will charge a premium for SAP and HA repositories as well as RHEL, on top of the base compute fees.
|             | 7.5      | LVM    | Linux Agent | RHEL 7.5 for SAP with HA Add-On. Attached to E4S repositories. Will charge a premium for SAP and HA repositories as well as RHEL, on top of the base compute fees.
|             | 7.6      | LVM    | Linux Agent | RHEL 7.6 for SAP with HA Add-On. Attached to E4S repositories. Will charge a premium for SAP and HA repositories as well as RHEL, on top of the base compute fees.
rhel-byos     |rhel-lvm74| LVM    | Linux Agent | RHEL 7.4 BYOS images, not attached to any source of updates, will not charge a RHEL premium.
|             |rhel-lvm75| LVM    | Linux Agent | RHEL 7.5 BYOS images, not attached to any source of updates, will not charge a RHEL premium.
|             |rhel-lvm76| LVM    | Linux Agent | RHEL 7.6 BYOS images, not attached to any source of updates, will not charge a RHEL premium.
|             |rhel-lvm77| LVM    | Linux Agent | RHEL 7.7 BYOS images, not attached to any source of updates, will not charge a RHEL premium.
|             |rhel-lvm8 | LVM    | Linux Agent | RHEL 8 BYOS images (RHEL minor version is shown in the image version value), not attached to any source of updates, will not charge a RHEL premium.

## Next steps
* Learn more about the [Red Hat images in Azure](./redhat-images.md).
* Learn more about the [Red Hat Update Infrastructure](./redhat-rhui.md).
* Learn more about the [RHEL BYOS offer](./byos.md).
* Information on Red Hat support policies for all versions of RHEL can be found on the [Red Hat Enterprise Linux Life Cycle](https://access.redhat.com/support/policy/updates/errata) page.
