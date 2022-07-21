---
title: Understand guidelines for Active Directory Domain Services site design and planning
description: Learn about the guidelines for Active Directory Domain Services.
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 11/19/2021
ms.author: anfdocs
---
# Understand guidelines for Active Directory Domain Services site design and planning for Azure NetApp Files

Proper Active Directory Domain Services (AD DS) design and planning are key to solution architectures that use Azure NetApp Files volumes. Azure NetApp Files features such as SMB volumes, dual-protocol volumes, and NFSv4.1 Kerberos volumes are designed to be used with AD DS.  

This article provides recommendations to help you develop an AD DS deployment strategy for Azure NetApp Files. Before reading this article, you need to have a good understanding about how AD DS works on a functional level.  