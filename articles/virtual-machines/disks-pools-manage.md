---
title: #Required; page title is displayed in search results. Include the brand.
description: #Required; article description that is displayed in search results. 
author: #Required; your GitHub user alias, with correct capitalization.
ms.author: #Required; microsoft alias of author; optional team alias.
ms.service: #Required; service per approved list. slug assigned by ACOM.
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: #Required; mm/dd/yyyy format.
ms.custom: template-concept #Required; leave this attribute/value as-is.
---

# Manage a disk pool

Once you've deployed a disk pool, there are various management actions available to you. You can:
- Add or remove a disk to or from a disk pool
- Update iSCSI LUN mapping
- Add ACLs (Only applicable if ACL mode is set to Static)


## Add/Remove a disk to/from a pool

Your disk must meet the following requirements in order to be added to the disk pool:
- Must be either a premium SSD or an ultra disk in the same region and availability zone as the disk pool, or use ZRS.
    - Ultra disks must have a disk sector size of 512 bytes.
- Must be a shared disk, with a maxShares value of two or greater.
- Your disk pool resource provider must have the necessary RBAC permissions.


## Enable or disable iSCSI support on a disk

iSCSI support can be disabled or enabled on each individual disk in a disk pool by updating the iSCSI configuration. Before you disable iSCSI support on a disk, confirm there is no outstanding iSCSI connection to the iSCSI lun the disk is exposed as.


## Add ACLs
The default ACL model for disk pools is Dynamic, which doesn't support adding ACLs. If you manually configure your disk pool with the Static ACL mode, you can add ACLs to specify the iSCSI initiator allowed to connect to the iSCSI target exposed on the disk pool.

