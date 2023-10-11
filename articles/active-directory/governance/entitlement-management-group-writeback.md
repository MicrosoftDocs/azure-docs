---
title: Set up group writeback within entitlement management - Microsoft Entra ID
description: Learn how to set up group writeback in entitlement management.
services: active-directory
documentationCenter: ''
author: owinfreyatl
manager: amycolannino
editor: HANKI
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 08/24/2023
ms.author: owinfrey
ms.reviewer: sponnada
ms.collection: M365-identity-device-management
---

# Setting up group writeback within entitlement management

This article shows you how to set up group writeback in entitlement management. Group writeback is a feature that allows you to write cloud groups back to your on-premises Active Directory instance by using Microsoft Entra Connect Sync.

## Set up group writeback in entitlement management


To set up group writeback for Microsoft 365 groups in access packages, you must complete the following prerequisites:

- Set up group writeback in the Microsoft Entra admin center. 
- The Organizational Unit (OU) that is used to set up group writeback in Microsoft Entra Connect Configuration.
- Complete the [group writeback enablement steps](../hybrid/connect/how-to-connect-group-writeback-enable.md) for Microsoft Entra Connect. 
 
Using group writeback, you can now sync Microsoft 365 groups that are part of access packages to on-premises Active Directory. To sync the groups, follow the steps: 

1. Create a Microsoft Entra Microsoft 365 group.

1. Set the group to be written back to on-premises Active Directory. For instructions, see [Group writeback in the Microsoft Entra admin center](../enterprise-users/groups-write-back-portal.md). 

1. Add the group to an access package as a resource role. See [Create a new access package](entitlement-management-access-package-create.md#select-resource-roles) for guidance. 

1. Assign the user to the access package. See [View, add, and remove assignments for an access package](entitlement-management-access-package-assignments.md#directly-assign-a-user) for instructions to directly assign a user. 

1. After you've assigned a user to the access package, confirm that the user is now a member of the on-premises group once Microsoft Entra Connect Sync cycle completes:
    1. View the member property of the group in the on-premises OU OR 
    1. Review the member Of on the user object. 

> [!NOTE]   
> Microsoft Entra Connect's default sync cycle schedule is every 30 minutes. You may need to wait until the next cycle occurs to see results on-premises or choose to run the sync cycle manually to see results sooner. 

## Next steps

- [Create and manage a catalog of resources in entitlement management](entitlement-management-catalog-create.md)
- [Delegate access governance to access package managers in entitlement management](entitlement-management-delegate-managers.md)
