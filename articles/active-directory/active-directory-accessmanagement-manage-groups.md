<properties

	pageTitle="Managing groups in Azure Active Directory | Microsoft Azure"
	description="How to create and manage groups to manage Azure users using Azure Active Directory."
	services="active-directory"
	documentationCenter=""
	authors="curtand"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="06/14/2016"
	ms.author="curtand"/>


# Managing groups in Azure Active Directory

One of the features of Azure Active Directory (Azure AD) user management is the ability to create groups of users. You use a group to perform management tasks such as assigning licenses or permissions to a number of users at once. You can also use groups to assign access permission to

- Resources such as objects in the directory
- Resources external to the directory such as SaaS applications, Azure services, SharePoint sites, or on-premises resources

In addition, a resource owner can also assign access to a resource to an Azure AD group owned by someone else. This assignment grants the members of that group access to the resource. Then, the owner of the group manages membership in the group. Effectively, the resource owner delegates to the owner of the group the permission to assign users to their resource.

## How do I create a group?

Depending on the services to which your organization has subscribed, you can create a group using one of the following:
- the Azure classic portal
- the Office 365 account portal
- the Windows Intune account portal

We'll describe tasks as performed in the Azure classic portal. For more information about using non-Azure portals to manage your Azure AD directory, see [Administering your Azure AD directory](active-directory-administer.md).

1. In the [Azure classic portal](https://manage.windowsazure.com), select **Active Directory**, and then select the name of the directory for your organization.

2. Select the **Groups** tab.

3. Select **Add Group**.

4. In the **Add Group** window, specify the name and the description of a group.


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

* [Managing access to resources with Azure Active Directory groups](active-directory-manage-groups.md)

* [Azure Active Directory cmdlets for configuring group settings](active-directory-accessmanagement-groups-settings-cmdlets.md)

* [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)

* [What is Azure Active Directory?](active-directory-whatis.md)

* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)
