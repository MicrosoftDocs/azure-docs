
<properties
	pageTitle="Troubleshooting dynamic membership for groups| Microsoft Azure"
	description="A topic that lists troubleshooting tips for dynamic membership for groups in Azure AD."
	services="active-directory"
	documentationCenter=""
	authors="curtand"
	manager="stevenpo"
	editor=""
	/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="11/17/2015"
	ms.author="curtand"/>


# Troubleshooting dynamic memberships to groups

| Symptom                                                                        | Action                                                                                                                                                                                                                                                                                                                                                                                                                        |
|--------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| I configured a rule on a group but no memberships get updated in the group     | Verify that the **Enable delegated group management** setting is set to Yes in the Directory Configure tab. You will see this setting only if you are signed in as a user to whom an Azure Active Directory Premium license is assigned.  Verify the values for user attributes on the rule: are there users that satisfy the rule?                                                                               |
| I configured a rule, but now the existing members of the rule are removed      | This is expected behavior. Existing members of the group are removed when a rule is enabled or changed. The users returned from evaluation of the rule are added as members to the group.                                                                                                                                                                                                                                      |
| I don’t see membership changes instantly when I add or change a rule, why not? | Dedicated membership evaluation is done periodically in an asynchronous background process. How long the process takes is determined by the number of users in your directory and the size of the group created as a result of the rule. Typically, directories with small numbers of users will see the group membership changes in less than a few minutes. Directories with a large number of users can take 30 minutes or longer to populate. |

These articles provide additional information on Azure Active Directory.

* [Managing access to resources with Azure Active Directory groups](active-directory-manage-groups.md)
* [What is Azure Active Directory?](active-directory-whatis.md)
* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)
