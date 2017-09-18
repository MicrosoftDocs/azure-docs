---
title: Manage programs and controls for Azure AD access reviews| Microsoft Docs
description: You can create additional programs for each governance, risk management and compliance initiative in your organization to collect and organize Azure Active Directory access reviews as controls.
services: active-directory
documentationcenter: ''
author: mwahl
manager: femila
editor: ''
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/14/2017
ms.author: billmath
---

# Manage programs and their controls 

Azure AD includes access reviews of group members and application access, which are examples of controls ensuring oversight for who has access. These controls enable organizations to efficiently address their governance, risk management and compliance requirements.  

## How to manage programs and their controls
You can simplify tracking and collecting access reviews for different purposes by organizing them into programs.  Each access review can be linked to a program, so that when preparing reports for an auditor, only those access reviews in scope for a particular initiative are visible.

To see a list of programs, go to the [access reviews page](https://portal.azure.com/#blade/Microsoft_AAD_ERM/DashboardBlade/) and change to the **Programs** tab.

There is one program, "Default Program", always present.  If you are in a global administrator role, you may create additional programs.  For example, you may choose to have one program for each compliance initiative or business goal.

If you no longer need a program, and it does not have any controls linked to it, you can delete it.

## Next steps

- [Create an access review for members of a group or access to an application](active-directory-azure-ad-controls-create-an-access-review.md)

