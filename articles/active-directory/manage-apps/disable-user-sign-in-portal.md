---
title: Disable user sign-ins for an enterprise app in Azure Active Directory | Microsoft Docs
description: How to disable an enterprise application so that no users may sign in to it in Azure Active Directory
services: active-directory
documentationcenter: ''
author: msmimart
manager: CelesteDG

ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 04/12/2019
ms.author: mimart
ms.reviewer: asteen
ms.custom: it-pro

ms.collection: M365-identity-device-management
---
# Disable user sign-ins for an enterprise app in Azure Active Directory

It's easy to disable an enterprise application so no users can sign in to it in Azure Active Directory (Azure AD). You need the appropriate permissions to manage the enterprise app. And, you must be global admin for the directory.

## How do I disable user sign-ins?

1. Sign in to the [Azure portal](https://portal.azure.com) with an account that's a global admin for the directory.
1. Select **All services**, enter **Azure Active Directory** in the text box, and then select **Enter**.
1. On the **Azure Active Directory** -  ***directoryname*** pane (that is, the Azure AD pane for the directory you're managing), select **Enterprise applications**.
1. On the **Enterprise applications - All applications** pane, you see a list of the apps you can manage. Select an app.
1. On the ***appname*** pane (that is, the pane with the name of the selected app in the title), select **Properties**.
1. On the ***appname*** - **Properties** pane, select **No** for **Enabled for users to sign-in?**.
1. Select the **Save** command.

## Next steps

* [See all my groups](../fundamentals/active-directory-groups-view-azure-portal.md)
* [Assign a user or group to an enterprise app](assign-user-or-group-access-portal.md)
* [Remove a user or group assignment from an enterprise app](remove-user-or-group-access-portal.md)
* [Change the name or logo of an enterprise app](change-name-or-logo-portal.md)
