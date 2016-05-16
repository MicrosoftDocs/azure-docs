<properties

	pageTitle="Managing groups in Azure Active Directory | Microsoft Azure"
	description="How to create and manage groups to manage Azure resource access using Azure Active Directory."
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
	ms.date="03/18/2016"
	ms.author="curtand"/>


# Managing groups in Azure Active Directory

One of the major features of Azure Active Directory (Azure AD) is the ability to manage access to resources. These resources can be objects in the directory, or resources that are external to the directory, such as SaaS applications, Azure services, SharePoint sites, or on-premises resources. In addition, a resource owner can assign access to a resource to an Azure AD group. This grants the members of that group access to the resource. Then, the owner of the group manages membership in the group. Effectively, the resource owner delegates to the owner of the group the permission to assign users to their resource.

## How do I create a group?

**To create a group**

This task can be completed using either the Office 365 account portal, the Windows Intune account portal or the Azure portal, depending on the services to which your organization has subscribed. For more information about using portals to manage your Azure Active Directory, see [Administering your Azure AD directory](active-directory-administer.md).

1. In the [Azure classic portal](https://manage.windowsazure.com), select **Active Directory**, and then select the name of your organization’s directory.

2. Select the **Groups** tab.

3. Select **Add Group**.

4. In the **Add Group** window, specify the name and the description of a group.


## How do I add or remove individual users in a security group?

**To add an individual user to a group**

1. In the [Azure classic portal](https://manage.windowsazure.com), select **Active Directory**, and then select the name of your organization’s directory.

2. Select the **Groups** tab.

3. Open the group to which you want to add members. By default, this displays the **Members** tab of the selected group.

4. Select **Add Members**.

5. On the **Add Members** page, select the name of the user or a group that you want to add as a member of this group and make sure this name is added to the **Selected** pane.


**To remove an individual user from a group**

1. In the [Azure classic portal](https://manage.windowsazure.com), select **Active Directory**, and then select the name of your organization’s directory.

2. Select the **Groups** tab.

3. Open the group from which you want to remove members.

4. Select the **Members** tab, select the name of the member that you want to remove from this group, and then click **Remove**.

6. Confirm at the prompt that you want to remove this member from the group.


## How can I manage the membership of a group dynamically?

In Azure AD, you can very easily set up a simple rule (a rule that makes only a single comparison) to determine which users are to be members of the group. For example, if a group is assigned to a SaaS application, and you set up a rule to add users who have a job title of "Sales Rep," all users within your Azure AD directory with that job title will have access to this SaaS application.

> [AZURE.NOTE] You can set up a rule for dynamic membership on security groups or Office 365 groups. Nested group memberships are not supported for group-based assignment to applications at this time.
>
> Dynamic memberships for groups require an Azure AD Premium license to be assigned to
> 
> - The administrator who manages the rule on a group
> - All users who are selected by the rule to be a member of the group

**To enable dynamic membership for a group**

1. In the [Azure classic portal](https://manage.windowsazure.com), select **Active Directory**, and then select the name of your organization’s directory.

2. Select the **Groups** tab, and open the group you want to edit.

3. Select the **Configure** tab, and then set **Enable Dynamic Memberships** to **Yes**.

4. Set up a simple single rule for the group that will control how dynamic membership for this group functions. Make sure the **Add users where** option is selected, and then select a user property from the list (for example, department, jobTitle, etc.),

5. Next, select a condition (Not Equals, Equals, Not Starts With, Starts With, Not Contains, Contains, Not Match, Match), and finally specify a value for the selected user property.

To learn about how to create *advanced* rules (rules that can contain multiple comparisons) for dynamic group membership, see [Using attributes to create advanced rules](active-directory-accessmanagement-groups-with-advanced-rules.md).

## Additional information

These articles provide additional information on Azure Active Directory.

* [Managing access to resources with Azure Active Directory groups](active-directory-manage-groups.md)

* [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)

* [What is Azure Active Directory?](active-directory-whatis.md)

* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)
