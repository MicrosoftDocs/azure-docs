<properties
	pageTitle="Customizing Attribute Mappings | Microsoft Azure"
	description="Learn what attribute mappings for SaaS apps in Azure Active Directory are how you can modify them to address your business needs."
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


# Customizing Attribute Mappings


Microsoft Azure AD provides support for user provisioning to third-party SaaS applications such as Salesforce, Google Apps and others. If you have user provisioning for a third party SaaS application enabled, the Azure Management Portal controls its attribute values in form of a configuration called “attribute mapping”.

There is a preconfigured set of attribute mappings between Azure AD user objects and each SaaS app’s user objects. Some apps manage other types of objects, such as Groups or Contacts. <br> 
 You can customize the default attribute mappings according to your business needs. This means, you can change or delete existing attribute mappings or create new attribute mappings.

In the Azure AD portal, you can access this feature by clicking Attributes in the toolbar of a SaaS application.

> [AZURE.NOTE] The **Attributes** link is only available if you have user provisioning enabled for a SaaS application. 


![Salesforce][1] 


When you click Attributes in the toolbar, the list of current mappings that are configured for a SaaS application.

The following screenshot shows an example for this:



![Salesforce][2]  


In the example above, you can see that the **firstName** attribute of a managed object in Salesforce is populated with the **givenName** value of the linked Azure AD object.

If you either want to customize your attribute mappings or if you want to revert customized settings back to the default configuration, you can do this by clicking the related button in the toolbar on the bottom of an application.


![Salesforce][3]  


There are attribute mappings that are required by a SaaS application to function correctly. 
 In the attributes table, the related attribute mappings have **Yes** as value for the **Required** attribute. If an attribute mapping is required, you cannot delete it. In this case, **Delete** feature is unavailable.

To modify an existing attribute mapping, just select the mapping, and then click **Edit**. This brings up a dialog page that enables you to modify the selected attribute mapping.


![Edit Attribute Mapping][4]  



## Understanding Attribute Mapping Types


With attribute mappings, you control how attributes are populated in a third party SaaS application. 
There are four different mapping types supported:

- **Direct** – the target attribute is populated with the value of an attribute of the linked object in Azure AD.


- **Constant** – the target attribute is populated with a specific string you have specified.


- **Expression** - the target attribute is populated based on the result of a script-like expression. 
For more details, see [Writing Expressions for Attribute Mappings in Azure Active Directory](active-directory-saas-writing-expressions-for-attribute-mappings.md).


- **None** - the target attribute is left unmodified. However, if the target attribute is ever empty, it will be populated with the Default value that you specify.



In addition to these four basic attribute mapping types, custom attribute mappings support the concept of a **default** value assignment. The default value assignment ensures that a target attribute is populated with a value if there is neither a value in Azure AD nor on the target object.

Microsoft Azure AD provides a very efficient implementation of a synchronization process. 
 In an initialized environment, only objects requiring updates are processed during a synchronization cycle. 
 Updating attribute mappings has an impact on the performance of a synchronization cycle. 
 This is because an update to the attribute mapping configuration requires all managed objects to be reevaluated. 
 Because of this, it is a recommended best practice to keep the number of consecutive changes to your attribute mappings at a minimum.


##Related Articles

- [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
- [Automate User Provisioning/Deprovisioning to SaaS Apps](active-directory-saas-app-provisioning.md)
- [Writing Expressions for Attribute Mappings](active-directory-saas-writing-expressions-for-attribute-mappings.md)
- [Scoping Filters for User Provisioning](active-directory-saas-scoping-filters.md)
- [Using SCIM to enable automatic provisioning of users and groups from Azure Active Directory to applications](active-directory-scim-provisioning.md)
- [Account Provisioning Notifications](active-directory-saas-account-provisioning-notifications.md)
- [List of Tutorials on How to Integrate SaaS Apps](active-directory-saas-tutorial-list.md)


<!--Image references-->
[1]: ./media/active-directory-saas-customizing-attribute-mappings/ic765497.png
[2]: ./media/active-directory-saas-customizing-attribute-mappings/ic775419.png
[3]: ./media/active-directory-saas-customizing-attribute-mappings/ic775420.png
[4]: ./media/active-directory-saas-customizing-attribute-mappings/ic775421.png
