<properties
	pageTitle="Creating a simple rule to configure dynamic memberships for a group| Microsoft Azure"
	description="Explains how to create a simple rule to configure dynamic memberships for a group."
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
	ms.topic="article"
	ms.date="02/25/2016"
	ms.author="curtand"/>


# Creating a simple rule to configure dynamic memberships for a group

To enable dynamic membership for a particular group, perform the following steps:

1. In the Azure classic portal, click **Active Directory**, and then click the name of your organization’s directory.

2. Select the **Groups** tab, and then open the group you want to edit.

3. Select the **Configure** tab, sand then set the **Enable Dynamic Memberships** switch to **Yes**.

4. Set up a simple single rule for the group that will control how dynamic membership for this group functions. Make sure the **Add users where** option is selected, and then select a user property from the list (for example, department, jobTitle, etc.),

5. Next, select a condition (Not Equals, Equals, Not Starts With, Starts With, Not Contains, Contains, Not Match, Match), and finally specify a value for the selected user property. For example, if a group is assigned to a SaaS application and you enable dynamic memberships for this group by setting a rule whereby **Add users where** is set to the jobTitle that Equals(-eq)Sales Rep, all users within your Azure AD directory whose job titles are set to Sales Rep will have access to this SaaS application.

6. Note that you can set up a rule for dynamic membership on security groups or Office 365 groups.  Dynamic memberships for groups require that an Azure AD Premium license is assigned to
 	- the administrator who manages the rule on a group
	- all users who are selected by the rule to be a member of the group

To learn about how to use regular expressions to create more complex rules for dynamic group membership:

- [Using attributes to create advanced rules](active-directory-accessmanagement-groups-with-advanced-rules.md)

These articles provide additional information on Azure Active Directory.

- [Managing access to resources with Azure Active Directory groups](active-directory-manage-groups.md)
- [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
- [What is Azure Active Directory?](active-directory-whatis.md)
- [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)
