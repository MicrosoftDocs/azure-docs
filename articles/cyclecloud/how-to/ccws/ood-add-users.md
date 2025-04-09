---
title: Add users for Open OnDemand
description: How to add users for Open OnDemand
author: xpillons
ms.date: 04/08/2025
ms.author: padmalathas
---

# Add users for Open OnDemand
Once authenticated with Entra ID, Open OnDemand will map the user to a local user account managed by CycleCloud. This is done by creating a local cluster user account with the same name as the Entra ID user. The following steps describe how to add cluster users for Open OnDemand.
1. Browse to the CycleCloud web portal, and select the top right geat icon to open the menu. Select the **Users** option.
1. Click on the **Add** button to add a new user. See instructions for more details on user management in CycleCloud. [User Management](../../concepts/user-management.md)
1. Select at least the role **Global Node User** for regular users and **Global Node Admin** for administrators (sudo access)
1. Save
1. Add other users as needed
1. Wait for the users to be created on clusters. This may take a few minutes.

Users can now log in to Open OnDemand using their Entra ID credentials. The first time they log in there may be a consent message that will be displayed, after accepting it, the user will be redirected to the Open OnDemand dashboard.
