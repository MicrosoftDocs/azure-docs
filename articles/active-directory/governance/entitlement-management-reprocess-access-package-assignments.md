---
title: Share link to request an access package in Azure AD entitlement management - Azure Active Directory
description: Learn how to share link to request an access package in Azure Active Directory entitlement management.
services: active-directory
documentationCenter: ''
author: ajburnle
manager: daveba
editor: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 06/22/2021
ms.author: ajburnle
ms.reviewer: 
ms.collection: M365-identity-device-management

#Customer intent: As a global administrator or access package manager, I want detailed information about how I can edit an access package so that requestors have the resources they need to perform their job.

---
# Reprocess assignments for an access package in Azure AD entitlement management

As an access package manager, you can automatically reevaluate and enforce users’ original assignments in an access package using the reprocess functionality. Reprocessing eliminates the need for users to repeat the access package request process if their access to resources was impacted by changes outside of Entitlement Management.

For example, a user may have been removed from a group manually, thereby causing that user to lose access to necessary resources. 

Entitlement Management does not block outside updates to the access package’s resources, so the Entitlement Management UI would not accurately display this change. Therefore, the user’s assignment status would be shown as “Delivered” even though the user does not have access to the resources anymore. However, if the user’s assignment is reprocessed, they will be added to the access package’s resources again. Reprocessing ensures that the access package assignments are up to date, that users have access to necessary resources, and that assignments are accurately reflected in the UI.

This article describes how to reprocess assignments in an existing access package.

## Open an existing access package and reprocess user assignments

Prerequisite role: Global administrator, Identity Governance administrator, User administrator, Catalog owner, Access package manager or Access package assignment manager

If you have a set of users whose requests are in various states (Delivered, Partially Delivered, Failed), you will likely need to reprocess some of those requests. Follow these steps to reprocess requests for an existing access package:

1.	In the Azure portal, click Azure Active Directory and then click Identity Governance.

1.	In the left menu, click Access packages and then open the access package.

1.	Underneath Manage on the left side, click Assignments.

1.	Select all users whose assignments you wish to reprocess.

1.	Click Reprocess.

## Next steps