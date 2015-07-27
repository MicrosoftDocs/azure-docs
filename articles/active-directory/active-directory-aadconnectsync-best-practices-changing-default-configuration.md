<properties
	pageTitle="Best practices for changing the default configuration"
	description="Provides best practices for changing the default configuration of Azure AD Coenncet Sync."
	services="active-directory"
	documentationCenter=""
	authors="markusvi"
	manager="swadhwa"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/28/2015"
	ms.author="markusvi"/>


# Azure AD Connect Sync: Best practices for changing the default configuration

The configuration created by Azure AD Connect works “as is” for the majority of environments that synchronize on-premises Active Directory with Azure AD.<br> 
However, in some cases, it is necessary to apply some changes to a configuration to satisfy a particular need or requirement.

While it is supported to apply changes to your Azure AD configuration, you should apply them with care because Azure AD is supposed to be as close as possible an appliance.

The following is a list of expected behaviors:

- After upgrading Azure AD Connect to a newer version, most settings will be reset back to default.
- Changes to “out-of-box” synchronization rules are lost after an upgrade has been applied.
- Deleted “out-of-box” synchronization rules are recreated during an upgrade to a newer version.
- Custom synchronization rules you have created remain unmodified when an upgrade to a newer version has been applied.



When you need to change the default configuration, do the following:

- When you need to modify an attribute flow of an “out-of-box” synchronization rule, do not change it. Instead, create a new synchronization rule with a higher precedence (lower numeric value) that contains your required attribute flow.
- Export your custom synchronization rules using the Synchronization Rules Editor. This provides you with a PowerShell script you can use to easily recreate them in the case of a disaster recovery scenario.
- If you need to change the scope or the join setting in an “out-of-box” synchronization rule, document this and reapply the change after upgrading to a newer version of Azure AD Sync.



**Other important notes:**

- If you have attribute based filtering and password synchronization configured, make sure that only objects that are synchronized to Azure AD are in the scope of password synchronization. 





## Additional Resources

* [Azure AD Connect Sync: Customizing Synchronization options](active-directory-aadconnectsync-whatis.md)
* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)
 
<!--Image references-->
