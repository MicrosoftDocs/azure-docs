---
title: Azure File Sync release notes | Microsoft Docs
description: Azure File Sync release notes
services: storage
documentationcenter: ''
author: wmgries
manager: klaasl
editor: tamram

ms.assetid: 
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 10/09/2017
ms.author: wgries
---

# Azure File Sync release notes

## Initial preview release (version 1709)
> Applies to Azure File Sync agent version 1.1.* and Azure File Sync API version 2017-09-xx 

### Server configuration and agent installation
- Run the agent installer from an elevated (admin) command prompt
- Supported only on Windows Server 2016 and 2012 R2
- Not supported on Windows Server Core or Nano
- Requires at least 2GB of physical memory
- Create an NTFS data volume - not compatible with system volumes, boot volumes, ReFS or FAT
- Failover clustering is supported with clustered disks only, not Cluster Shared Volumes (CSV)
- Do not store a paging file on the data volume (see end of this page for instructions on configuring a paging file)

### Interoperability
- Anti-virus, backup and other applications that access tiered files will cause undesirable recall unless they respect the offline attribute and skip reading the content of those files – consult the troubleshooting guide for more details
- Do not use File Server Resource Manager (or other) file screens - sync of screened files to that server will be blocked, but will retry endlessly
- Duplication of a Registered Server (including VM cloning) could lead to unexpected results (in particular, sync may never converge)
- Data Deduplication and cloud tiering are not supported on the same volume

