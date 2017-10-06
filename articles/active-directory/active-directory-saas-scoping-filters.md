---
title: Provisioning apps with scoping filters | Microsoft Docs
description: Learn how to use scoping filters to prevent objects in apps that support automated user provisioning from actually being provisioned if an object doesn’t satisfy your business requirements.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila

ms.assetid: bcfbda74-e4d4-4859-83bc-06b104df3918
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/02/2017
ms.author: markvi

ms.custom: H1Hack27Feb2017

---
# Attribute-based application provisioning with scoping filters
The objective of this section is to explain how to use scoping filters to define attribute-based rules that determine which users are provisioned to the application.

## Scoping filter use cases

A scoping filter allows the Azure AD provisioning service to include or exclude any users who have an attribute that matches a specific value. For example, when provisioning users from Azure AD to a SaaS application used by a sales team, you can specify that only users with a "Department" attribute of "Sales" should be in scope for provisioning.

Scoping filters may be used differently depending on the type of provisioning connector:

* **Outbound provisioning from Azure AD to SaaS applications** - When Azure AD is the source system, [user and group assignments](active-directory-coreapps-assign-user-azure-portal.md) are the most common method for determining which users are in scope for provisioning. These assignments are also used for enabling single sign-on and provide a single method to manage access and provisioning. Scoping filters can be used optionally, in addition to assignments or instead of them, to filter users based on attribute values.

>[!TIP]
> You can disable provisioning based on assignments for an enterprise application by settings the **[Scope](active-directory-saas-app-provisioning.md#how-do-i-set-up-automatic-provisioning-to-an-application)** menu under the provisioning settings to **Sync all users and groups**. Using this option plus attribute-based scoping filters offers faster performance than using group-based assignments.  

* **Inbound provisioning from HCM applications to Azure AD and Active Directory** - When an [HCM application such as Workday](active-directory-saas-workday-tutorial.md) is the source system, scoping filters are the primary method for determing which users should be provisioned from the HCM application to Active Directory or Azure Active Directory.

By default, Azure AD provisioning connectors do not have any attribute-based scoping filters configured. 

## Scoping filter construction

A scoping filter consists of one or **clauses**. Clauses determines which users are allowed to pass through the scoping filter by evaluating each user’s attributes. For example, you might have one clause that requires that a user’s "State" attribute equal "New York", so only New York users are provisioned into the application. 

A single clause defines a single condition for a single attribute value. If multiple clauses are created in a single scoping filter, they are evaluated together using "AND" logic. This means all clauses must evaluate to "true" in order for a user to be provisioned.

Finally, multiple scoping filters can be a created for a single application. If multiple scoping filters are present, they are evaluated together using "OR" logic. This means that if all the clauses in any of the configured scoping filters evalutes to "true", then the user is provisioned.

Each user or group processed by the Azure AD provisioning service is always evaluted individually agaist each scoping filter.

For an example, consider the scoping filter below:

![Scoping Filter](./media/active-directory-saas-scoping-filters/scoping-filter.PNG) 

According to this scoping filter, users must satisfy the following criteria, to be provisioned:

1. They must be in New York
2. They must work in the Engineering department
3. Their company employee ID must be between 1000000 and 2000000
4. Their job title must not be null or empty

## Creating scoping filters
Scoping filters are configured as part of the attribute mappings for each Azure AD user provisioning connector. The procedure below assumes you have already set up automatic provisioning for [one of the supported applications](active-directory-saas-tutorial-list.md), and are adding a scoping filter to it.

### To create a scoping filter:
1. In the [Azure portal](https://portal.azure.com), go to the **Azure Active Directory > Enterprise Applications > All applications** section.
2. Select the application for which you have configured automatic provisioning. Example: "ServiceNow"
3. Select the **Provisioning** tab.
4. In the **Mappings** section, select the mapping that you wish to configure a scoping filter for. Example: "Synchronize Azure Active Directory Users to ServiceNow"
5. Select the **Source object scope** menu.
6. Select **Add scoping filter**.
7. Define a clause by selecting a source **Attribute Name**, an **Operator**, and an **Attribute Value** to match against. Below are the supported operators:
   * **EQUALS** - Clause returns "true" if the evaluated attribute matches the input string value exactly (case-sensitive).
   * **NOT EQUALS** - Clause returns "true" if the evaluated attribute does not match the input string value (case-sensitive).
   * **IS TRUE** - Clause returns "true" if the evaluated attribute contains a boolean value of true.
   * **IS FALSE** - Clause returns "true" if the evaluated attribute contains a boolean value of false.
   * **IS NULL** - Clause returns "true" if the evaluated attribute is empty.
   * **IS NOT NULL** - Clause returns "true" if the evaluated attribute is not empty.
   * **REGEX MATCH** - Clause returns "true" if the evaluated attribute matches a regular expression pattern. Example: ([1-9][0-9]) matches  any number between 10 and 99
   * **NOT REGEX MATCH** - Clause returns "true" if the evaluated attribute does not match a regular expression pattern.
8. Select **Add new scoping clause**.
9. Optionally, repeat steps 7-8 to add additional scoping clauses.
10. In **Scoping Filter Title**, add a name for your scoping filter.
11. Select **OK**.
12. Select **OK** again on the Scoping Filters screen (or repeat steps 6-11 to add another scoping filter).
13. Select **Save** on the Attribute Mapping screen. 

>[!IMPORTANT] 
> Saving a new scoping filter triggers a new full sync for the application, where all users in the source system are evaluated again against the new scoping filter. If a user in the application was previously in scope for provisioning, but falls out of scope, then their account will be disabled or deprovisioned in the application.


## Related Articles
* [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
* [Automate User Provisioning and Deprovisioning to SaaS Applications](active-directory-saas-app-provisioning.md)
* [Customizing Attribute Mappings for User Provisioning](active-directory-saas-customizing-attribute-mappings.md)
* [Writing Expressions for Attribute Mappings](active-directory-saas-writing-expressions-for-attribute-mappings.md)
* [Account Provisioning Notifications](active-directory-saas-account-provisioning-notifications.md)
* [Using SCIM to enable automatic provisioning of users and groups from Azure Active Directory to applications](active-directory-scim-provisioning.md)
* [List of Tutorials on How to Integrate SaaS Apps](active-directory-saas-tutorial-list.md)

