---
title: Add users for Open OnDemand
description: How to add users for Open OnDemand
author: xpillons
ms.date: 07/01/2025
ms.author: padmalathas
---

# Add users for Open OnDemand
After users authenticate with Microsoft Entra ID, Open OnDemand maps each user to a local user account that CycleCloud manages. CycleCloud creates the local user account with the same name as the Microsoft Entra ID user. The following steps describe how to add cluster users for Open OnDemand.

1. Browse the CycleCloud web portal and select the gear icon in the upper right corner to open the menu. Select the **Users** option.
1. Select **Add** to add a new user. For more information about user management in CycleCloud, see [User Management](../../concepts/user-management.md).
1. Select at least the **Global Node User** role for regular users and the **Global Node Admin** role for administrators (sudo access).
1. Select **Save**.
1. Add other users as needed.
1. Wait for the users to be created on clusters. This process might take a few minutes.

Users can now sign in to Open OnDemand with their Microsoft Entra ID credentials. A consent message might appear when users try to sign in for the first time. Users should give consent to be redirected to the Open OnDemand dashboard.
