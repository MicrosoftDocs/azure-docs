
<properties 
	pageTitle="Troubleshooting dynamic membership for groups| Microsoft Azure" 
	description="A topic that lists troubleshooting tips for dynamic membership for groups in Azure AD." 
	services="active-directory" 
	documentationCenter="" 
	authors="femila" 
	manager="swadhwa" 
	editor="Curtis"
	tags="azure-classic-portal"/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/13/2015" 
	ms.author="femila"/>


# Troubleshooting dynamic memberships to groups

| Symptom                                                                        | Action                                                                                                                                                                                                                                                                                                                                                                                                                        |
|--------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| I configured a rule on a group but no memberships get updated in the group     | Verify the Enable delegated group management setting is set to Yes in the Directory Configure tab. Note that you will only see this setting if you are signed in with an account that has an Azure Active Directory Premium license assigned to it.  Verify the values for user attributes on the rule – are there users that satisfy the rule?                                                                               |
| I configured a rule, but now the existing members of the rule are removed      | This is expected – existing members of the group are removed when a rule is enabled or changed. The resulting set of users from evaluation of the rule is added as members to the group.                                                                                                                                                                                                                                      |
| I don’t see membership changes instantly when I add or change a rule, why not? | Dedicated membership evaluation is done periodically in an asynchronous background process. The number of users in your tenant, and the size of the group created as a result of the rule play a factor in how long it takes. Typically tenants with small numbers of users will see the group membership changes in less than a few minutes. Tenants with a large number of users can take 30 minutes or longer to populate. |

Here are some topics that will provide some additional information on Azure Active Directory 

* [Managing access to resources with Azure Active Directory groups](active-directory-manage-groups.md)

* [What is Azure Active Directory?](active-directory-whatis.md)

* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)


