<properties
	pageTitle="Attribute-based app provisioning with scoping filters | Microsoft Azure"
	description="Learn how to use scoping filters to prevent objects in apps that support automated user provisioning from actually being provisioned if an object doesn’t satisfy your business requirements."
	services="active-directory"
	documentationCenter=""
	authors="markusvi"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/19/2016"
	ms.author="markusvi"/>


# Attribute-based app provisioning with scoping filters

The objective of this section is to explain how to use scoping filters to define attribute-based rules that will determine which users will be provisioned to the application.





## Clauses and Scope Groups


![Scoping Filter][1] 




Scoping filters are defined by one or more **scope groups**, each of which hold one or more **clauses**. To see the clauses for a particular scope group, expand it by clicking the arrow to the left of the group name.

A **clause** determines which users are allowed to pass through the scoping filter by evaluating each user’s attributes. For example, you might have one clause that requires that a user’s ‘state’ attribute be equal to New York, which means that only your New York users will be provisioned into the application.

![Scoping Group Name][2] 



Each **scope group** starts with one mandatory **clause**, as shown in the screenshot above. This clause simply states that the user must first be assigned to the application before it’s evaluated by your scoping filters. This clause cannot be deleted or modified.

You can add new clauses or new scope groups by pressing the appropriate button. You can give each scope group a name by editing its **Scope Group Name** property.





## How Scoping Filters are Evaluated

During provisioning, we test every assigned user against your scoping filters to determine if that user deserves access to the application. You can think of each clause as being a test that must be passed in order for the user to avoid getting filtered out. 

If you have multiple scope groups defined, each user must pass at least one of them in order to access the application. Within each scope group, however, the user must pass every single clause in order to pass that specific scope group. 

In other words, you can think of scope groups as being OR’d together, and you can think of the clauses within them as being AND’d together.For example, consider the scoping filter below:


![Scoping Group Name][2]  


According to this scoping filter, users must satisfy the following criteria, in order to be provisioned:

1. They must be assigned to the application.

2. They must work in the Engineering department

3. They must be work in either San Francisco or Canada.


##Related Articles

- [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
- [Automate User Provisioning and Deprovisioning to SaaS Applications](active-directory-saas-app-provisioning.md)
- [Customizing Attribute Mappings for User Provisioning](active-directory-saas-customizing-attribute-mappings.md)
- [Writing Expressions for Attribute Mappings](active-directory-saas-writing-expressions-for-attribute-mappings.md)
- [Account Provisioning Notifications](active-directory-saas-account-provisioning-notifications.md)
- [Using SCIM to enable automatic provisioning of users and groups from Azure Active Directory to applications](active-directory-scim-provisioning.md)
- [List of Tutorials on How to Integrate SaaS Apps](active-directory-saas-tutorial-list.md)

<!--Image references-->
[1]: ./media/active-directory-saas-scoping-filters/ic782811.png
[2]: ./media/active-directory-saas-scoping-filters/ic782812.png
[3]: ./active-directory-saas-scoping-filters/ic782813.png
