---
title: 'Migrate Azure AD Connect to Azure AD Connect cloud sync| Microsoft Docs'
description: Describes stpes to migrate Azure AD Connect to Azure AD Connect cloud sync.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 01/17/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---


# Migrating from Azure AD Connect to Azure AD Connect cloud sync

Azure AD Connect cloud sync is future for accomplishing your hybrid identity goals for synchronization of users, groups, and contacts to Azure AD.  It accomplishes this by using the Azure AD cloud provisioning agent instead of the Azure AD Connect application.  If you are currently using Azure AD Connect and wish to move to cloud sync, the following document will provide guidance on how to accomplish this.

## Steps for migrating

Before moving to cloud sync, you should verify that cloud sync is currently the best synchronization tool for you.  You can do this by going through the wizard here:  https://aka.ms/M365Wizard
