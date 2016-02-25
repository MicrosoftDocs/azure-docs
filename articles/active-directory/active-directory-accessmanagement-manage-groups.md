<properties

	pageTitle="Managing security groups in Azure Active Directory | Microsoft Azure"
	description="How to create and manage security groups to manage Azure resource access using Azure Active Directory."
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
	ms.date="02/24/2016"
	ms.author="curtand"/>


# Managing groups in Azure Active Directory

Within Azure Active Directory (Azure AD), one of the major features is the ability to manage access to resources. These resources can be part of the directory, as in the case of permissions to manage objects through roles in the directory, or resources that are external to the directory, such as SaaS applications, Azure services, and SharePoint sites or on premise resources. A group can be assigned to a resource by the resource owner, and by doing so, granting the members of that group access to the resource. Membership of the group can then be managed by the owner of the group. Effectively, the resource owner delegates the permission to assign users to their resource to the owner of the group.


## How do I create and manage a security group?

**To create a group in the Azure classic portal**

1. In the Azure classic portal, select **Active Directory**, and then select the name of your organization’s directory.

2. Select the **Groups** tab.

3. Select **Add Group**.

4. In the **Add Group** window, specify the name and the description of a group.

5. This task can be completed using either the Office 365 account portal, the Windows Intune account portal or the Azure portal, depending on which services your organization has subscribed to. For more information about using portals to manage your Azure Active Directory, see [Administering your Azure AD directory](active-directory-administer).

## How do I add or remove individual users in a security group?

**To add an individual user to a group in the Azure classic portal**

1. In the Azure classic portal, select **Active Directory**, and then select the name of your organization’s directory.

2. Select the **Groups** tab.

3. Open the group to which you want to add members. By default, this displays the **Members** tab of the selected group.

4. Select **Add Members**.

5. On the **Add Members** page, select the name of the user or a group that you want to add as a member of this group and make sure this name is added to the **Selected** pane.


**To remove an individual user from a group in the Azure classic portal**

1. In the Azure classic portal, select **Active Directory**, and then select the name of your organization’s directory.

2. Select the **Groups** tab.

3. Open the group from which you want to remove members.

4. Select the **Members** tab, select the name of the member that you want to remove from this group, and then click **Remove**.

6. Verify that you want to remove this member from the group by clicking **Yes** as the answer to the action confirmation question.


## How do I manage members of a security group automatically using attribute-based rules?

For example, if a group is assigned to a SaaS application and you enable dynamic memberships for this group by setting a rule whereby Add users where is set to the jobTitle that Equals(-eq)Sales Rep, all users within your Azure AD directory whose job titles are set to Sales Rep, will have access to this SaaS application. For more information, see [Assign access for a group to a SaaS application in Azure AD](active-directory-accessmanagement-group-saasapps.md). To enable dynamic membership for a particular group, perform the following steps:

1. In the Azure classic portal, select **Active Directory**, and then select the name of your organization’s directory.

2. Select the **Groups** tab, and open the group you want to edit.

3. Select **Configure** tab, set the **Enable Dynamic Memberships** switch to **Yes**.

4. Set up a simple single rule for the group that will control how dynamic membership for this group functions. Make sure the **Add users where** option is selected, and then select a user property from the list (for example, department, jobTitle, etc.),

5. Next, select a condition (Not Equals, Equals, Not Starts With, Starts With, Not Contains, Contains, Not Match, Match), and finally specify a value for the selected user property.

> [AZURE.NOTE] You can set up a rule for dynamic membership on security groups or Office 365 groups. Nested group memberships are not supported for group-based assignment to applications at this time.
> Dynamic memberships for groups require that an Azure AD Premium license is assigned to
> - the administrator who manages the rule on a group
>	- all users who are selected by the rule to be a member of the group

To learn about how to use regular expressions to create advanced rules for dynamic group membership, see [Using attributes to create advanced rules](active-directory-accessmanagement-groups-with-advanced-rules.md).

## Additional information

These articles provide additional information on Azure Active Directory.

* [Managing access to resources with Azure Active Directory groups](active-directory-manage-groups.md)

* [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)

* [What is Azure Active Directory?](active-directory-whatis.md)

* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)
