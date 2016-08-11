<properties
	pageTitle="View all existing groups in Azure Active Directory | Microsoft Azure"
	description="How to view the groups that have already been created in Azure Active Directory."
	services="active-directory"
	documentationCenter=""
	authors="curtand"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/11/2016"
	ms.author="curtand"/>


# View all existing groups in Azure Active Directory

This article explains how to view all groups in Azure Active Directory (Azure AD). One of the features of Azure Active Directory (Azure AD) user management is the ability to create groups that you can populate with your users. You use a group to perform management tasks such as assigning licenses or permissions to a number of users at once.

## How do I see all the groups?

1.  Sign in to the [Azure portal](https://portal.azure.com) with an account that's a global admin for the directory.

2.  Select **Browse**, enter User Management in the text box, and then select **Enter**.

    ![Opening user management](./media/active-directory-groups-view-azure-portal/search-user-management.png)

3.  On the **User Management** blade, select **Groups**.

    ![Opening the groups blade](./media/active-directory-groups-view-azure-portal/view-groups-blade.png)

4. On the **User Management - Groups** blade, you can add or remove display columns, filter the list to search for a group, or make changes to groups that you have sufficient permissions to change.


## How do I add or remove individual users in a security group?

**To add an individual user to a group**

1. In the [Azure classic portal](https://manage.windowsazure.com), select **Active Directory**, and then select the name of the directory for your organization.

2. Select the **Groups** tab.

3. Open the group to which you want to add members. Open the **Members** tab of the selected group if it not already displaying.

4. Select **Add Members**.

5. On the **Add Members** page, select the name of the user or a group that you want to add as a member of this group. Make sure that this name is added to the **Selected** pane.


**To remove an individual user from a group**

1. In the [Azure classic portal](https://manage.windowsazure.com), select **Active Directory**, and then select the name of the directory for your organization.

2. Select the **Groups** tab.

3. Open the group from which you want to remove members.

4. Select the **Members** tab, select the name of the member that you want to remove from this group, and then click **Remove**.

6. Confirm at the prompt that you want to remove this member from the group.


## How can I manage the membership of a group dynamically?

In Azure AD, you can very easily set up a simple rule to determine which users are to be members of the group. A simple rule is one that makes only a single comparison. For example, if a group is assigned to a SaaS application, you can set up a rule to add users who have a job title of "Sales Rep." This rule then grants access to this SaaS application to all users with that job title in your directory.

> [AZURE.NOTE] You can set up a rule for dynamic membership on security groups or Office 365 groups. Nested group memberships aren't currently supported for group-based assignment to applications.
>
> Dynamic memberships for groups require an Azure AD Premium license to be assigned to
>
> - The administrator who manages the rule on a group
> - All members of the group

**To enable dynamic membership for a group**

1. In the [Azure classic portal](https://manage.windowsazure.com), select **Active Directory**, and then select the name of the directory for your organization.

2. Select the **Groups** tab, and open the group you want to edit.

3. Select the **Configure** tab, and then set **Enable Dynamic Memberships** to **Yes**.

4. Set up a simple single rule for the group to control how dynamic membership for this group functions. Make sure the **Add users where** option is selected, and then select a user property from the list (for example, department, jobTitle, etc.),

5. Next, select a condition (Not Equals, Equals, Not Starts With, Starts With, Not Contains, Contains, Not Match, Match).

6. Specify a comparison value for the selected user property.

To learn about how to create *advanced* rules (rules that can contain multiple comparisons) for dynamic group membership, see [Using attributes to create advanced rules](active-directory-accessmanagement-groups-with-advanced-rules.md).

## Additional information

These articles provide additional information on Azure Active Directory.

* [See existing groups](active-directory-groups-view-azure-portal.md)
* [Create a new group and adding members](active-directory-groups-create-azure-portal.md)
* [Manage settings of a group](active-directory-groups-settings-azure-portal.md)
* [Manage members of a group](active-directory-groups-members-azure-portal.md)
* [Manage memberships of a group](active-directory-groups-membership-azure-portal.md)
* [Manage dynamic rules for users in a group](active-directory-groups-dynamic-users-azure-portal.md)
* [Manage dynamic rules for devices in a group](active-directory-groups-dynamic-devices-azure-portal.md)
