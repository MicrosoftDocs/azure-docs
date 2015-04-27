<properties 
	pageTitle="Managing Azure AD Connect" 
	description="Learn how to extend the default configuration and operational tasks for Azure AD Connect." 
	services="active-directory" 
	documentationCenter="" 
	authors="billmath" 
	manager="terrylan" 
	editor="lisatoft"/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/02/2015" 
	ms.author="billmath"/>

# Managing Azure AD Connect 


<center><div class="dev-center-tutorial-selector sublanding">
<a href="/en-us/documentation/articles/active-directory-aadconnect/" title="What is It?" class="current">What is It?</a>
<a href="/en-us/documentation/articles/active-directory-aadconnect-how-it-works/" title="How it Works">How it Works</a>
<a href="/en-us/documentation/articles/active-directory-aadconnect-get-started/" title="Getting Started">Getting Started</a>
<a href="/en-us/documentation/articles/active-directory-aadconnect-get-manage/" title="Manage">Manage</a></div></center> 


The topics are advanced operational topics that allow you to customize Azure Active Directory Connect to meet your organizations needs and requirements.  

## Changing the default configuration
The default configuration of Azure AD Connect in most instances is sufficient to easily extend your on-premises directories into the cloud.  However there are certain instances when you may need to modify the default and tailor it to your organizations business logic.  In these instances you can modify the default configuration however there are some things you need to be aware of before you do this.

If you are upgrading or moving from Azure AD Sync or DirSync be aware of the following:

- After upgrading Azure AD Sync to a newer version, most settings will be reset back to default.
- Changes to “out-of-box” synchronization rules are lost after an upgrade has been applied.
- Deleted “out-of-box” synchronization rules are recreated during an upgrade to a newer version.
- Custom synchronization rules you have created remain unmodified when an upgrade to a newer version has been applied.

When you need to change the default configuration, do the following:

- When you need to modify an attribute flow of an “out-of-box” synchronization rule, do not change it. Instead, create a new synchronization rule with a higher precedence (lower numeric value) that contains your required attribute flow.
- Export your custom synchronization rules using the Synchronization Rules Editor. This provides you with a PowerShell script you can use to easily recreate them in the case of a disaster recovery scenario.
- If you need to change the scope or the join setting in an “out-of-box” synchronization rule, document this and reapply the change after upgrading to a newer version of Azure AD Connect.






 

## Using the synchronization rules editor

In Azure AD Connect, you can configure and fine-tune the object and attribute flow between Azure AD and your on-premises directories by configuring synchronization rules.  Synchronization rules can be configured using the Synchronization Rules Editor.  The Synchronization Rules Editor is installed when you install Azure AD Connect.  In order to use the Editor you must be a member of the ADSyncAdmins group or the Administrator group you specified during the Azure AD Connect installation. 

In the screen shot below you will see all Synchronization Rules created for your configuration when you install Azure AD Connect using the Express installation. Each line in the table is one Synchronization Rule. To the left under Rule Types the two different types are listed: Inbound and Outbound. Inbound and Outbound is from the view of the metaverse.  That is, we are bringing information from our directories in to the metaverse.  Outbound refers to rules in which we would send information and attributes out to our directories such as our on-premises Active Directory or Azure AD. 

<center>![Synch Rules Editor](./media/active-directory-aadconnect-manage/Synch_Rule.png)
</center>

To create a new rule, you would select Add new rule and then configure the rule.  For example, let's suppose we want to create a join rule where any user in our on-premises directory will join with the metaverse object that has the same phone number.  To do this create the new rule an specify the Connected system, in our case contoso.com, the Connected System Object Type, user, the Metaverse Object Type, person, and the Link Type of Join.

<center>![Create Sync rule](./media/active-directory-aadconnect-manage/synch2.png)
</center>


Then on the Join rules screen specify the telephoneNumber under Source attribute and telephoneNumber under Target attribute.  And that is it.  You have now successfully created a join rule.

<center>![Join Rule](./media/active-directory-aadconnect-manage/synch3.png)
</center>

You can use the Synchronization Rules Editor to apply additional business logic outside the default configuration and tailor it to your organizations needs.  For additional information on the Synchronization Rules Editor see [Understanding the default configuration](https://msdn.microsoft.com/library/azure/dn800963.aspx).


## Using declarative provisioning 
Declarative provisioning is "codeless" provisioning and can be setup and configured using the Synchronization Rules Editor.  The Editor can be used setup and create your own provisioning rules.

An essential part of Declarative Provisioning is the expression language used in attribute flows. The language used is a subset of Microsoft® Visual Basic® for Applications (VBA). This language is used in Microsoft Office and users with experience of VBScript will also recognize it. The Declarative Provisioning Expression Language is only using functions and is not a structured language; there are no methods or statements. Functions will instead be nested to express program flow.

For more information on the expression language see [Understanding Declarative Provisioning Expressions](https://msdn.microsoft.com/library/azure/dn801048.aspx)

## Additional Documentation
Some of the documentation that was created for Azure AD Sync is still relevant and applies to Azure AD Connect.  Although every effort is being made to bring this documentation over to Azure.com, some of this documentation still resides in the MSDN scoped library.  For additional documentation see [Azure AD Connect on MSDN](https://msdn.microsoft.com/library/azure/dn832695.aspx) and [Azure AD Sync on MSDN](https://msdn.microsoft.com/library/azure/dn790204.aspx).

**Additional Resources**

* [Use your on-premises identity infrastructure in the cloud](active-directory-aadconnect-whatis.md)
* [How Azure AD Connect works](active-directory-aadconnect-howitworks.md)
* [Getting started with Azure AD Connect](active-directory-aadconnect-getstarted.md)
* [Manage Azure AD Connect](active-directory-aadconnect-manage.md)
* [Azure AD Connect on MSDN](https://msdn.microsoft.com/library/azure/dn832695.aspx)
