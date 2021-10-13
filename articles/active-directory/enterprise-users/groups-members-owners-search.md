---
title: Search and filter groups members and owners (preview) - Azure Active Directory | Microsoft Docs
description: Search and filter groups members and owners in the Azure portal.
services: active-directory
documentationcenter: ''
author: curtand
manager: KarenH444

ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
ms.topic: how-to
ms.date: 10/13/2021
ms.author: curtand
ms.reviewer: jodah

ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Search groups and members in Azure Active Directory

This article tells you how to search for members and owners of a group and how to use search filters the Azure Active Directory (Azure AD) portal. There are lots of improvements in the groups experiences to help you manage your groups, including members and owners, quickly and easily.

Search functions for groups include:

- Groups search capabilities, such as substring search in group names
- Filtering and sorting options on member and owner lists
- Search capabilities for member and owner lists

## Group search and sorting

On the **All groups** page, when you enter a search string, the search automatically perform a `startswith` and substring search on the list of group names. The substring search is performed only on whole words, and doesn't include special characters. Substring search is case-sensitive.

![new substring searches on the All Groups page](./media/groups-members-owners-search/groups-search-preview.png)

For example, a search for “policy” returns both "MDM policy – West" and "Policy group." A group named "New_policy" wouldn't be returned. You can sort the **All groups** list by name in ascending or descending order.

## Group member search and filtering

### Search group member and owner lists

You can search the members or owners of a specific group by name, and when you enter a search string, a `startswith` search is automatically performed. For example, a search for “Scott” returns Scott Wilkinson.

![new substring searches on the group members and owners lists](./media/groups-members-owners-search/members-list.png)

### Filter member and owners list

In addition to search, you can filter the members and owners lists by user type. This information is found in the **User Type** column in the members or owners list. You can filter the list to see only tenant members or guests.

### View and manage membership

In addition to viewing the direct members of a specific group, you can view the list of all members of the group within the **Members** page. The members list includes all the unique members of group including any transitive members.

You can also search and filter the direct members list and the all members list individually. Filtering the all members list does not affect the filters that are applied on the direct members list.

## Improved group member counts

The group **Overview** page provides group member counts for groups of all sizes. You can see the member counts even for groups with more than 1,000 members. You can see the total number of direct members for a group and the total membership count (all the unique members of group including transitive members) on the **Overview** page.

![Higher accuracy in group membership counts](./media/groups-members-owners-search/member-numbers.png)

## Next steps

These articles provide additional information on working with groups in Azure AD.

- [View your groups and members](../fundamentals/active-directory-groups-view-azure-portal.md)
- [Manage group membership](../fundamentals/active-directory-groups-membership-azure-portal.md)
- [Manage dynamic rules for users in a group](groups-create-rule.md)
- [Edit your group settings](../fundamentals/active-directory-groups-settings-azure-portal.md)
- [Manage access to resources using groups](../fundamentals/active-directory-manage-groups.md)
- [Manage access to SaaS apps using groups](groups-saasapps.md)
- [Manage groups using PowerShell commands](../enterprise-users/groups-settings-v2-cmdlets.md)
- [Add an Azure subscription to Azure Active Directory](../fundamentals/active-directory-how-subscriptions-associated-directory.md)
