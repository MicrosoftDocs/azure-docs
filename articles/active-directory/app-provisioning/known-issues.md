---
title: Known issues for Application Provisioning in Azure Active Directory
description: Learn about known issues when working with automated Application Provisioning in Azure Active Directory.
author: kenwith
ms.author: kenwith
manager: mtillman
services: active-directory
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: troubleshooting
ms.date: 05/28/2021
ms.reviewer: arvinh
---

# Known issues for Application Provisioning in Azure Active Directory
Known issues to be aware of when working with app provisioning. You can provide feedback about the application provisioning service on UserVoice, see [Azure AD Application Provision UserVoice](https://aka.ms/appprovisioningfeaturerequest). We closely watch UserVoice so we can improve the service. 

> [!NOTE]
> This isn’t a comprehensive list of known issues. If you know of an issue that is not listed, provide feedback at the bottom of the page.

## Authorization 

**Unable to save after successful connection test**

If you can successfully test a connection, but can’t save, then you've exceeded the allowable storage limit for credentials. To learn more, see [Problem saving administrator credentials](./user-provisioning.md).

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

**Unsupported scoping filters**

Directory extensions, appRoleAssignments, userType, and accountExpires are not supported as scoping filters.


## Service issues 

**Unsupported scenarios**

- Provisioning passwords isn't supported. 
- Provisioning nested groups isn't supported. 
- Provisioning to B2C tenants isn't supported because of the size of the tenants.
- Not all provisioning apps are available in all clouds. For example, Atlassian is not yet available in the Government Cloud. We are working with app developers to onboard their apps to all clouds.

**Automatic provisioning is not available on my OIDC based application**

If you create an app registration, the corresponding service principal in enterprise apps will not be enabled for automatic user provisioning. You will need to either request the app be added to the gallery, if intended for use by multiple organizations, or create a second non-gallery app for provisioning. 

**The provisioning interval is fixed**

The [time](./application-provisioning-when-will-provisioning-finish-specific-user.md#how-long-will-it-take-to-provision-users) between provisioning cycles is currently not configurable. 

**Changes not moving from target app to Azure AD**

The app provisioning service isn't aware of changes made in external apps. So, no action is taken to roll back. The app provisioning service relies on changes made in Azure AD. 

**Switching from sync all to sync assigned not working**

After changing scope from 'Sync All' to 'Sync Assigned', please make sure to also perform a restart to ensure that the change takes effect. You can do the restart from the UI.

**Provisioning cycle continues until completion**

When setting provisioning `enabled = off`, or hitting stop, the current provisioning cycle will continue running until completion. The service will stop executing any future cycles until you turn provisioning on again.

**Member of group not provisioned**

When a group is in scope and a member is out of scope, the group will be provisioned. The out of scope user won't be provisioned. If the member comes back into scope, the service won’t immediately detect the change. Restarting provisioning will address the issue. We recommend periodically restarting the service to ensure that all users are properly provisioned.  

**Manager is not provisioned**

If a user and their manager are both in scope for provisioning, the service will provision the user and then update the manager. However if on day one the user is in scope and the manager is out of scope, we will provision the user without the manager reference. When the manager comes into scope, the manager reference will not be updated until you restart provisioning and cause the service to re evaluate all the users again. 

## On-premises application provisioning
The following information is a current list of known limitations with the Azure AD ECMA Connector Host and on-prem application provisioning.

### Application and directories
The following applications and directories are not yet supported.

**AD DS - (user / group writeback from Azure AD, using the on-prem provisioning preview)**
   - When a user is managed by Azure AD Connect, the source of authority is on-prem Active Directory. Therefore, user attributes cannot be changed in Azure AD. This preview does not change the source of authority for users managed by Azure AD Connect.
   - Attempting to use Azure AD Connect and the on-prem provisioning to provision groups / users into AD DS can lead to creation of a loop, where Azure AD Connect can overwrite a change that was made by the provisioning service in the cloud. Microsoft is working on a dedicated capability for group / user writeback.  Upvote the  UserVoice feedback [here](https://feedback.azure.com/forums/169401-azure-active-directory/suggestions/16887037-enable-user-writeback-to-on-premise-ad-from-azure) to track the status of the preview. Alternatively, you can use [Microsoft Identity Manager](/microsoft-identity-manager/microsoft-identity-manager-2016) for user / group writeback from Azure AD to AD.

**Connectors other than SQL**
   - The Azure AD ECMA Connector Host is officially supported for generic SQL (GSQL) connector. While it is possible to use other connectors such as the web services connector or custom ECMA connectors, it is **not yet supported**.

**Azure Active Directory**
   - On-prem provisioning allows you to take a user already in Azure AD and provision them into a third-party application. **It does not allow you to bring a user into the directory from a third-party application.** Customers will need to rely on our native HR integrations, Azure AD Connect, MIM, or Microsoft Graph to bring users into the directory.

### Attributes and objects 
The following attributes and objects are not supported:
   - Multi-valued attributes
   - Reference attributes (for example, manager).
   - Groups
   - Complex anchors (for example, ObjectTypeName+UserName).
   - On-premises applications are sometimes not federated with Azure AD and require local passwords. The on-premises provisioning preview **does not support provisioning one-time passwords or synchronizing passwords** between Azure AD and third-party applications.
   - export_password' virtual attribute, SetPassword, and ChangePassword operations are not supported

#### SSL certificates
   - The Azure AD ECMA Connector Host currently requires either SSL certificate to be trusted by Azure or the Provisioning Agent to be used. Certificate subject must match the host name the Azure AD ECMA Connector Host is installed on.

#### Anchor attributes
   - The Azure AD ECMA Connector Host currently does not support anchor attribute changes (renames) or target systems, which require multiple attributes to form an anchor. 

#### Attribute discovery and mapping
   - The attributes that the target application supports are discovered and surfaced in the Azure portal in Attribute Mappings. Newly added attributes will continue to be discovered. However, if an attribute type has changed (for example, string to boolean), and the attribute is part of the mappings, the type will not change automatically in the Azure portal. Customers will need to go into advanced settings in mappings and manually update the attribute type.

## Next steps
- [How provisioning works](how-provisioning-works.md)