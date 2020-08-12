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
ms.date: 08/12/2020
ms.reviewer: arvinh
---

# Known issues: application provisioning
This documents outlines things you should be aware of when working with the Azure AD provisioning service. You can provide feedback about the application provisioning service on UserVoice, see [Azure AD Application Provision UserVoice](#). We closely watch UserVoice so we can prioritize improvements to the service. 

> [!NOTE]
> This isn’t a comprehensive list of known issues. If you know of an issue that is not listed, provide feedback at the bottom of the page.

## Authorization 

**Unable to save after successful connection test**
You may run into an issue where you’re able to successfully test connection, but can’t save. This generally happens when you have exceeded the allowable storage limit for credentials. Learn more.  

**Unable to save**
When making a change to the tenant URL, secret token, and / or notification email, all the details need to be provided together in order to save. You cannot provide just one of them. 

**Unable to change provisioning mode back to manual**
After you have configured provisioning for the first time, you’ll notice that the provisioning mode has switched from manual to automatic. You cannot change it back to manual, but you can turn off provisioning through the UI, which effectively does the same as setting the dropdown to manual.  


## Attribute mappings 

**Attribute SamAccountName or userType not available as a source attribute**
The attribute SamAccountName is not available as a source attribute out of the box. You must extend your schema to add the attribute. The attribute userType also isn’t available out of the box. You can add the attributes to the list of available source attributes by extending your schema as described here.   

**Source attribute dropdown missing for schema extension**
Extensions to your schema can sometimes be missing from the source attribute dropdown in the UI. You can go into the advanced settings of your attribute mappings and manually add the attributes as described here. 

**Null attribute cannot be provisioned**
Azure AD currently cannot provision null attributes. If an attribute is null on the user object, it will be skipped. 

**Max characters for attribute mapping expressions**
Attribute mapping expressions can have a maximum of 10,000 characters. 


## Service issues 

**Unsupported scenarios**
Provisioning passwords is not supported. 

Provisioning nested groups is not supported. 

Provisioning to B2C tenants is not supported due to the size of the tenants. 

**Changes not moving from target app to Azure AD**
When a change is made to a user directly in the target app, without originating in Azure AD, our service is not aware of it and does not take any action to roll the change back. Our service relies primarily on changes made in Azure AD.  

**Provisioning cycle continues until completion**
When setting provisioning enabled = off or hitting stop, the current provisioning cycle will continue running until completion. The service will stop executing any future cycles until you turn provisioning on again.

**Member of group not provisioned**
In the scenario where a group is in scope and a member is out of scope, we will provision the group and not the member as expected. However, if the member comes back into scope, our service won’t immediately detect the change. Restarting provisioning will address the issue and we recommend periodically restarting the service to ensure that all users are properly provisioned.  


## Next steps
- [How provisioning works](how-provisioning-works.md)
