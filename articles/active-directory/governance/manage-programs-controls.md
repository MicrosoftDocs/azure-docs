---
title: Manage programs and controls for Azure AD access reviews| Microsoft Docs
description: You can create additional programs for each governance, risk management, and compliance initiative in your organization to collect and organize Azure Active Directory access reviews as controls.
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.component: compliance
ms.date: 06/21/2018
ms.author: rolyon
ms.reviewer: mwahl
---

# Manage programs and their controls 

Azure Active Directory (Azure AD) includes access reviews of group members and application access. These examples of controls ensure oversight for who has access to your organization's group memberships and applications. Organizations can use these controls to efficiently address their governance, risk management, and compliance requirements.

## Create and manage programs and their controls
You can simplify how to track and collect access reviews for different purposes by organizing them into programs. Each access review can be linked to a program. Then when you prepare reports for an auditor, you can focus on the access reviews in scope for a particular initiative.  Programs and access review results are visible to users in the Global Administrator, User Account Administrator, Security Administrator, or Security Reader role.

To see a list of programs, go to the [access reviews page](https://portal.azure.com/#blade/Microsoft_AAD_ERM/DashboardBlade/) and select **Programs**.

**Default Program** is always present. If you're in a global administrator or user account administrator role, you can create additional programs. For example, you can choose to have one program for each compliance initiative or business goal.

If you no longer need a program and it doesn't have any controls linked to it, you can delete it.

## Next steps

- [Create an access review for members of a group or access to an application](create-access-review.md)
- [Retrieve the results of an access review](retrieve-access-review.md)
