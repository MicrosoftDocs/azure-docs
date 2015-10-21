<properties

	pageTitle="Managing security groups in Azure Active Directory | Microsoft Azure"
	description="Covers how to sign up for Azure and first steps you can try with Azure AD."
	services="active-directory"
	documentationCenter=""
	authors="femila"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/21/2015" 
	ms.author="femila"/>


#Managing security groups in Azure Active Directory


##How do I create and manage a security group

**To create a group from the Azure Management Portal**

1. In the Management Portal, click **Active Director**y, and then click on the name of your organization’s directory.
2. Click the **Groups** tab.
3. On the Groups page, click **Add Group**.
4. In the **Add Group** window, specify the name and the description of a group.
5. This task can be completed using either the Office 365 account portal, the Windows Intune account portal or the Azure Management portal, depending on which services your organization has subscribed to. For more information about using portals to manage your Azure Active Directory, see Administering your Azure AD directory.

## How do I assign or remove users in a security group

**To add a member to a group from the Azure Management Portal**

1. In the Management Portal, click Active Directory, and then click on the name of your organization’s directory.
2. Click the **Groups** tab.
3. On the **Groups** page, click on the name of the group that you want to add members to. By default, this displays the **Members** tab of the selected group.
4. On that group’s page, click **Add Members**.
5. On the **Add Members** page, click on the name of the user or a group that you want to add as a member of this group and make sure this name is added to the Selected pane.


**To remove a member from a group from the Azure Management Portal**

1. In the Management Portal, click Active Directory, and then click on the name of your organization’s directory.
2. Click the **Groups** tab.
3. On the Groups page, click on the name of the group that you want to remove members from.
4. On that group’s page, click the **Members** tab.
5. On that group’s page, click on the name of the member that you want to remove from this group and then click **Remove**.
6. Verify that you want to remove this member from the group by clicking **Yes** as the answer to the action verification question.


##How do I use a rule to dynamically manage members of a security group
**To enable dynamic membership for a particular group, perform the following steps:**

1. In the Azure Management Portal, under the **Groups** tab, select the group you want to edit, and then in this group’s **Configure** tab, set the **Enable Dynamic Memberships** switch to **Yes**.
2. You can now set up a simple single rule for the group that will control how dynamic membership for this group functions. Make sure the **Add users where** radio button is checked and then select a user property from the pull-down menu (for example, department, jobTitle, etc.), 
3. Next, select a condition (Not Equals, Equals, Not Starts With, Starts With, Not Contains, Contains, Not Match, Match), and finally specify a value for the selected user property.
4. For example, if a group is assigned to a SaaS application (for more information see Assign access for a group to a SaaS application in Azure AD) and you enable dynamic memberships for this group by setting a rule whereby Add users where is set to the jobTitle that Equals(-eq)Sales Rep, all users within your Azure AD directory whose job titles are set to Sales Rep, will have access to this SaaS application.

Here are some topics that will provide some additional information on Azure Active Directory 

* [Managing access to resources with Azure Active Directory groups](active-directory-manage-groups.md)

* [What is Azure Active Directory?](active-directory-whatis.md)

* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)