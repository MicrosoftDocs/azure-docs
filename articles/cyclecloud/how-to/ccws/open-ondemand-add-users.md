---
title: Add users for Open OnDemand
description: How to add users for Open OnDemand
author: xpillons
ms.date: 05/27/2025
ms.author: padmalathas
---

# Add users for Open OnDemand
Once authenticated with Microsoft Entra ID, Open OnDemand maps the user to a local user account managed by CycleCloud created with the same name as the Microsoft Entra ID user. The following steps describe how to add cluster users for Open OnDemand.
1. Browse the CycleCloud web portal and select the top right gear icon to open the menu. Select the **Users** option.
1. Click on the **Add** button to add a new user. For more details on user management in CycleCloud, see instructions: [User Management](../../concepts/user-management.md)
1. Select at least the role **Global Node User** for regular users and **Global Node Admin** for administrators (sudo access)
1. Save
1. Add other users as needed
1. Wait for the users to be created on clusters. It may take a few minutes.

Users can now log in to Open OnDemand using their Microsoft Entra ID credentials. A consent message may appear upon an initial login attempt: users should affirm consent to be redirected to the Open OnDemand dashboard.
