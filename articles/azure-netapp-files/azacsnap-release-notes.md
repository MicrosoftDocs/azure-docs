---
title: Release Notes for Azure Application Consistent Snapshot tool for Azure NetApp Files | Microsoft Docs
description: Provides release notes for the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: Phil-Jensen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 03/22/2021
ms.author: phjensen
---

# Release Notes for Azure Application Consistent Snapshot tool (preview)

The following lists changes made to AzAcSnap to provide new functionality or resolve defects.

## March-2021

### AzAcSnap v5.0 Preview (Build:20210318.30771) released

AzAcSnap v5.0 Preview (Build:20210318.30771) has been released with the following fixes and improvements:

- Removed the need to add the AZACSNAP user into the SAP HANA Tenant DBs.
- Fix to allow doing a [restore](azacsnap-cmd-ref-restore.md) with volume configured with ManualQOS.
- Added mutex control to throttle SSH connections for Azure Large Instance.
- Fix installer for handling path names with spaces, etc.
- In preparation for supporting other database servers, changed the optional parameter '--hanasid' to '--dbsid'.

Download the [latest release](https://aka.ms/azacsnapdownload) of the installer and review how to [get started](azacsnap-get-started.md).

## Next steps

- [Get started with Azure Application Consistent Snapshot tool](azacsnap-get-started.md)
