---
title: Customizing Azure AD Attribute Mappings | Microsoft Docs
description: Learn what attribute mappings for SaaS apps in Azure Active Directory are how you can modify them to address your business needs.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila
editor: ''

ms.assetid: 549e0b8c-87ce-4c9b-b487-b7bf0155dc77
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/17/2017
ms.author: markvi

ms.custom: H1Hack27Feb2017

---
# Customizing User Provisioning Attribute Mappings for SaaS Applications in Azure Active Directory
Microsoft Azure AD provides support for user provisioning to third-party SaaS applications such as Salesforce, Google Apps and others. If you have user provisioning for a third-party SaaS application enabled, the Azure Management Portal controls its attribute values in form of a configuration called “attribute mapping.”

There is a preconfigured set of attribute mappings between Azure AD user objects and each SaaS app’s user objects. Some apps manage other types of objects, such as Groups or Contacts. <br> 
 You can customize the default attribute mappings according to your business needs. This means, you can change or delete existing attribute mappings or create new attribute mappings.

In the Azure AD portal, you can access this feature by clicking a **Mappings** configuration under **Provisioning** in the **Manage** section of an **Enterprise application**.


![Salesforce][5] 

Clicking a **Mappings** configuration, opens the related **Attribute Mapping** blade.  
There are attribute mappings that are required by a SaaS application to function correctly. For required attributes, the **Delete** feature is unavailable.


![Salesforce][6]  

In the example above, you can see that the **Username** attribute of a managed object in Salesforce is populated with the **userPrincipalName** value of the linked Azure Active Directory Object.

You can customize existing **Attribute Mappings** by clicking a mapping. This opens the **Edit Attribute** blade.

![Salesforce][7]  


  

## Understanding attribute mapping types
With attribute mappings, you control how attributes are populated in a third-party SaaS application. 
There are four different mapping types supported:

* **Direct** – the target attribute is populated with the value of an attribute of the linked object in Azure AD.
* **Constant** – the target attribute is populated with a specific string you have specified.
* **Expression** - the target attribute is populated based on the result of a script-like expression. 
  For more information, see [Writing Expressions for Attribute Mappings in Azure Active Directory](active-directory-saas-writing-expressions-for-attribute-mappings.md).
* **None** - the target attribute is left unmodified. However, if the target attribute is ever empty, it is populated with the Default value that you specify.

In addition to these four basic attribute mapping types, custom attribute mappings support the concept of an optional **default** value assignment. The default value assignment ensures that a target attribute is populated with a value if there is neither a value in Azure AD nor on the target object. The most common configuration is to leave this blank.


## Understanding attribute mapping properties

In the previous section, you have already been introduced to the attribute mapping type property.
In addition to this property, attribute mappings do also support the following attributes:

- **Source attribute** - The user attribute from the source system (e.g.: Azure Active Directory).
- **Target attribute** – The user attribute in the target system (e.g.: ServiceNow).
- **Match objects using this attribute** – Whether or not this mapping should be used to uniquely identify users between the source and target systems. This is typically set on the userPrincipalName or mail attribute in Azure AD, which is typically mapped to a username field in a target application.
- **Matching precedence** – Multiple matching attributes can be set. When there are multiple, they are evaluated in the order defined by this field. As soon as a match is found, no further matching attributes are evaluated.
- **Apply this mapping**
    - **Always** – Apply this mapping on both user creation and update actions
    - **Only during creation** - Apply this mapping only on user creation actions


## What you should know

Microsoft Azure AD provides an efficient implementation of a synchronization process. 
In an initialized environment, only objects requiring updates are processed during a synchronization cycle. 
Updating attribute mappings has an impact on the performance of a synchronization cycle. 
An update to the attribute mapping configuration requires all managed objects to be reevaluated. 
It is a recommended best practice to keep the number of consecutive changes to your attribute mappings at a minimum.

## Next steps

* [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
* [Automate User Provisioning/Deprovisioning to SaaS Apps](active-directory-saas-app-provisioning.md)
* [Writing Expressions for Attribute Mappings](active-directory-saas-writing-expressions-for-attribute-mappings.md)
* [Scoping Filters for User Provisioning](active-directory-saas-scoping-filters.md)
* [Using SCIM to enable automatic provisioning of users and groups from Azure Active Directory to applications](active-directory-scim-provisioning.md)
* [Account Provisioning Notifications](active-directory-saas-account-provisioning-notifications.md)
* [List of Tutorials on How to Integrate SaaS Apps](active-directory-saas-tutorial-list.md)

<!--Image references-->
[1]: ./media/active-directory-saas-customizing-attribute-mappings/ic765497.png
[2]: ./media/active-directory-saas-customizing-attribute-mappings/ic775419.png
[3]: ./media/active-directory-saas-customizing-attribute-mappings/ic775420.png
[4]: ./media/active-directory-saas-customizing-attribute-mappings/ic775421.png
[5]: ./media/active-directory-saas-customizing-attribute-mappings/21.png
[6]: ./media/active-directory-saas-customizing-attribute-mappings/22.png
[7]: ./media/active-directory-saas-customizing-attribute-mappings/23.png

