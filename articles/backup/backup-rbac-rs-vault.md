---
title: 'Use Role-Based Access Control for Backup Management | Microsoft Docs'
description: Use Role-based Access Control to manage access to backup management operations in recovery Services vault.
services: backup
documentationcenter: ''
author: trinadhk
manager: shreeshd
editor: ''

ms.assetid: 722820dc-b65f-425c-a9e5-c1946e896a87
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 2/3/2017
ms.author: markgal; trinadhk

---

# Use Role-Based Access Control for Backup Management
Azure Role-Based Access Control (RBAC) enables fine-grained access management for Azure.Using RBAC, you can segregate duties within your
team and grant only the amount of access to users that they need to perform their jobs. Azure Backup provides 3 built-in roles to control
backup management operations. Learn more on [Azure RBAC built-in roles]()

* [Backup Contributor](https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-built-in-roles.md#backup-contributor) - This 
role has all permissions to create and manage backup except creating Recovery Services vault and giving access to others.
* [Backup Operator](https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-built-in-roles#backup-operator) - This role
has permissions to everything a contributor does except removing backup and managing backup policies. 
* [Backup Reader]( https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-built-in-roles.md#backup-reader) - This role 
has permissions to view all bacakup management operations. 

If you're looking to define your own roles for even more control, see how to [build Custom roles] in Azure RBAC.
