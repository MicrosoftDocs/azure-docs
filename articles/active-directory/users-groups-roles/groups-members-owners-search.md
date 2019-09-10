---
title: Search and filter groups members and owners (preview) - Azure Active Directory | Microsoft Docs
description: Search and filter groups members and owners in the Azure portal.
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 08/27/2019
ms.author: curtand
ms.reviewer: krbain

ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Search group members and owners (preview) in Azure Active Directory
This article tells you how to search for members and owners of a group and how to use search filters as part of the enhanced groups experience preview in the Azure Active Directory (Azure AD) portal. There are lots of improvements in the groups experiences to help you manage your groups, including members and owners, quickly and easily.

Key changes

- New search capabilities, such as substring search in groups lists
- New filtering and sorting options on member and owner lists
- More accurate group counts for large groups

## Enabling and managing the preview

We’ve made it easy to join the preview:

  1. Sign in to the [Azure AD portal](https://portal.azure.com), and select **Groups**.
  2. From the Groups – All groups page, select the banner at the top of the page to join the preview.

You can also check out the the latest features and improvements by selecting **Preview info** on the **All groups*** page. After you join the preview, you can see the preview tag on the groups pages that have improvements and are part of the preview. Not all groups pages have been updated as part of this preview.

•	If you are having any issues, you can switch back the legacy experience by clicking on the banner at the top of the Groups – All groups page. Please provide feedback so we can improve our experience.

Advanced group list search and sorting
The groups list search has been enhanced so now you can enter a search string, and the list of group names will automatically perform a startswith and substring search. NOTE: The substring search is only performed on whole words, and does not include special characters.

For example, a search for “policy” will now return both MDM policy – West and Policy group. However, New_policy, would not be returned.

•	You can perform the same search on the Group memberships list as well.
•	In addition to the search improvements, you can now sort the groups list by name. Simply, click on the arrows to the right of the name column to sort the list by ascending or descending order.

 
Search members and owner lists
•	You can now search the members of a specific group by name. In the new experience, if you enter a string in the search box, a startswith search will automatically performed. 

For example, a search for “Scott” will return Scott Wilkinson.

•	You can perform the same search on the owner list of a specific group as well.
 

Filter member and owners list
In addition to search, now you can filter the member and owner lists by user type. This is the information found in the User Type column of the list. So, you can filter the list by members and guests to determine if there are any guests in the group.

View and manage membership
•	In addition to viewing the direct members of a specific group, you can now view the list of all members of the group within the Members page. The all members list includes all the unique members of group including transitive members.
•	You can also search and filter both the direct members and all member lists individually. So, filtering the all members list, will not affect the filters that are applied on the direct members list.

Improved group member counts
•	We’ve improved the group Overview page to provide group member counts for groups of all sizes. Now, you will see the member counts even for groups with more than 1,000 members.
•	You can now see the total number of direct members for a group on the Overview page.
•	We’ve also added the total membership count to the Overview page, so you can get the total of all the unique members of group including transitive members.


 






## Next steps

These articles provide additional information on working with groups in Azure AD.

* For a reference to dynamic group rules, see [Dynamic membership rule syntax](groups-dynamic-membership.md).
* [Manage a group and add members in PowerShell](groups-settings-v2-cmdlets.md).
