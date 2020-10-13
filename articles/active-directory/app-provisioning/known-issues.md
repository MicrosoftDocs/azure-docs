---
title: Known issues for application provisioning in Azure AD
description: Learn about known issues when working with automated application provisioning in Azure AD.
author: kenwith
ms.author: kenwith
manager: celestedg
services: active-directory
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: troubleshooting
ms.date: 09/11/2020
ms.reviewer: arvinh
---

# Known issues: Application provisioning
Known issues to be aware of when working with app provisioning. You can provide feedback about the application provisioning service on UserVoice, see [Azure AD Application Provision UserVoice](https://aka.ms/appprovisioningfeaturerequest). We closely watch UserVoice so we can improve the service. 

> [!NOTE]
> This isn’t a comprehensive list of known issues. If you know of an issue that is not listed, provide feedback at the bottom of the page.

## Authorization 

**Unable to save after successful connection test**

If you can successfully test a connection, but can’t save, then you've exceeded the allowable storage limit for credentials. To learn more, see [Problem saving administrator credentials](application-provisioning-config-problem-storage-limit.md).

**Unable to save**

The tenant URL, secret token, and notification email must be filled in to save. You can't provide just one of them. 

**Unable to change provisioning mode back to manual**

After you have configured provisioning for the first time, you’ll notice that the provisioning mode has switched from manual to automatic. You can't change it back to manual. But you can turn off provisioning through the UI. Turning off provisioning in the UI effectively does the same as setting the dropdown to manual.  


## Attribute mappings 

**Attribute SamAccountName or userType not available as a source attribute**

The attributes SamAccountName and userType aren't available as a source attribute by default. Extend your schema to add the attribute. You can add the attributes to the list of available source attributes by extending your schema. To learn more, see [Missing source attribute](user-provisioning-sync-attributes-for-mapping.md). 

**Source attribute dropdown missing for schema extension**

Extensions to your schema can sometimes be missing from the source attribute dropdown in the UI. Go into the advanced settings of your attribute mappings and manually add the attributes. To learn more, see [Customize attribute mappings](customize-application-attributes.md).

**Null attribute can't be provisioned**

Azure AD currently can't provision null attributes. If an attribute is null on the user object, it will be skipped. 

**Max characters for attribute-mapping expressions**

Attribute-mapping expressions can have a maximum of 10,000 characters. 


## Service issues 

**Unsupported scenarios**

- Provisioning passwords isn't supported. 
- Provisioning nested groups isn't supported. 
- Provisioning to B2C tenants isn't supported because of the size of the tenants. 

**Automatic provisioning is not available on my OIDC based application**

If you create an app registration, the corresponding service principal in enterprise apps will not be enabled for automatic user provisioning. You will need to either request the app be added to the gallery, if intended for use by multiple organizations, or create a second non-gallery app for provisioning. 

**The provisioning interval is fixed**

The [time](https://docs.microsoft.com/azure/active-directory/app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user#how-long-will-it-take-to-provision-users) between provisioning cycles is currently not configurable. 

**Changes not moving from target app to Azure AD**

The app provisioning service isn't aware of changes made in external apps. So, no action is taken to roll back. The app provisioning service relies on changes made in Azure AD. 

**Provisioning cycle continues until completion**

When setting provisioning `enabled = off`, or hitting stop, the current provisioning cycle will continue running until completion. The service will stop executing any future cycles until you turn provisioning on again.

**Member of group not provisioned**

When a group is in scope and a member is out of scope, the group will be provisioned. The out of scope user won't be provisioned. If the member comes back into scope, the service won’t immediately detect the change. Restarting provisioning will address the issue. We recommend periodically restarting the service to ensure that all users are properly provisioned.  


## Next steps
- [How provisioning works](how-provisioning-works.md)
