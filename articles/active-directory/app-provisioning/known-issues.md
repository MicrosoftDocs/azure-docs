---
title: Known issues for application provisioning in Azure Active Directory
description: Learn about known issues when you work with automated application provisioning in Azure Active Directory.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: troubleshooting
ms.date: 10/20/2022
ms.reviewer: arvinh
---

# Known issues for application provisioning in Azure Active Directory
This article discusses known issues to be aware of when you work with app provisioning. To provide feedback about the application provisioning service on UserVoice, see [Azure Active Directory (Azure AD) application provision UserVoice](https://aka.ms/appprovisioningfeaturerequest). We watch UserVoice closely so that we can improve the service.

> [!NOTE]
> This article isn't a comprehensive list of known issues. If you know of an issue that isn't listed, provide feedback at the bottom of the page.

## Authorization 

#### Unable to save

The tenant URL, secret token, and notification email must be filled in to save. You can't provide only one of them. 

#### Unable to change provisioning mode back to manual

After you've configured provisioning for the first time, you'll notice that the provisioning mode has switched from manual to automatic. You can't change it back to manual. But you can turn off provisioning through the UI. Turning off provisioning in the UI effectively does the same as setting the dropdown to manual.

## Attribute mappings 

#### Attribute SamAccountName or userType not available as a source attribute

The attributes **SamAccountName** and **userType** aren't available as a source attribute by default. Extend your schema to add the attributes. You can add the attributes to the list of available source attributes by extending your schema. To learn more, see [Missing source attribute](user-provisioning-sync-attributes-for-mapping.md). 

#### Source attribute dropdown missing for schema extension

Extensions to your schema can sometimes be missing from the source attribute dropdown in the UI. Go into the advanced settings of your attribute mappings and manually add the attributes. To learn more, see [Customize attribute mappings](customize-application-attributes.md).

#### Null attribute can't be provisioned

Azure AD currently can't provision null attributes. If an attribute is null on the user object, it will be skipped. 

#### Maximum characters for attribute-mapping expressions

Attribute-mapping expressions can have a maximum of 10,000 characters. 

#### Unsupported scoping filters

Directory extensions and the **appRoleAssignments**, **userType**, and **accountExpires** attributes aren't supported as scoping filters.

#### Multivalue directory extensions

Multivalue directory extensions can't be used in attribute mappings or scoping filters. 

## Service issues 

#### Unsupported scenarios

- Provisioning passwords isn't supported. 
- Provisioning nested groups isn't supported. 
- Provisioning to B2C tenants isn't supported because of the size of the tenants.
- Not all provisioning apps are available in all clouds. For example, Atlassian isn't yet available in the Government cloud. We're working with app developers to onboard their apps to all clouds.

#### Automatic provisioning isn't available on my OIDC-based application

If you create an app registration, the corresponding service principal in enterprise apps won't be enabled for automatic user provisioning. You'll need to either request the app be added to the gallery, if intended for use by multiple organizations, or create a second non-gallery app for provisioning.

#### The provisioning interval is fixed

The [time](./application-provisioning-when-will-provisioning-finish-specific-user.md#how-long-will-it-take-to-provision-users) between provisioning cycles is currently not configurable. 

#### Changes not moving from target app to Azure AD

The app provisioning service isn't aware of changes made in external apps. So, no action is taken to roll back. The app provisioning service relies on changes made in Azure AD. 

#### Switching from Sync All to Sync Assigned not working

After you change scope from **Sync All** to **Sync Assigned**, make sure to also perform a restart to ensure that the change takes effect. You can do the restart from the UI.

#### Provisioning cycle continues until completion

When you set provisioning to `enabled = off` or select **Stop**, the current provisioning cycle continues running until completion. The service stops executing any future cycles until you turn provisioning on again.

#### Member of group not provisioned

When a group is in scope and a member is out of scope, the group will be provisioned. The out-of-scope user won't be provisioned. If the member comes back into scope, the service won't immediately detect the change. Restarting provisioning addresses the issue. Periodically restart the service to ensure that all users are properly provisioned.

#### Manager isn't provisioned

If a user and their manager are both in scope for provisioning, the service provisions the user and then updates the manager. If on day one the user is in scope and the manager is out of scope, we'll provision the user without the manager reference. When the manager comes into scope, the manager reference won't be updated until you restart provisioning and cause the service to reevaluate all the users again. 

#### Global reader

The global reader role is unable to read the provisioning configuration. Please create a custom role with the `microsoft.directory/applications/synchronization/standard/read` permission in order to read the provisioning configuration from the Azure Portal. 

#### Microsoft Azure Government Cloud
Credentials, including the secret token, notification email, and SSO certificate notification emails together have a 1KB limit in the Microsoft Azure Government Cloud. 

## On-premises application provisioning
The following information is a current list of known limitations with the Azure AD ECMA Connector Host and on-premises application provisioning.

### Application and directories
The following applications and directories aren't yet supported.

#### Active Directory Domain Services (user or group writeback from Azure AD by using the on-premises provisioning preview)
   - When a user is managed by Azure AD Connect, the source of authority is on-premises Azure AD. So, user attributes can't be changed in Azure AD. This preview doesn't change the source of authority for users managed by Azure AD Connect.
   - Attempting to use Azure AD Connect and the on-premises provisioning to provision groups or users into Active Directory Domain Services can lead to creation of a loop, where Azure AD Connect can overwrite a change that was made by the provisioning service in the cloud. Microsoft is working on a dedicated capability for group or user writeback. Upvote the UserVoice feedback on [this website](https://feedback.azure.com/d365community/forum/22920db1-ad25-ec11-b6e6-000d3a4f0789/) to track the status of the preview. Alternatively, you can use [Microsoft Identity Manager](/microsoft-identity-manager/microsoft-identity-manager-2016) for user or group writeback from Azure AD to Active Directory.

#### Connectors other than SQL

   The Azure AD ECMA Connector Host is officially supported for the generic SQL connector. While it's possible to use other connectors such as the web services connector or custom ECMA connectors, it's *not yet supported*.

#### Azure AD

   By using on-premises provisioning, you can take a user already in Azure AD and provision them into a third-party application. *You can't bring a user into the directory from a third-party application.* Customers will need to rely on our native HR integrations, Azure AD Connect, Microsoft Identity Manager, or Microsoft Graph, to bring users into the directory.

### Attributes and objects 
The following attributes and objects aren't supported:
   - Multivalued attributes.
   - Reference attributes (for example, manager).
   - Groups.
   - Complex anchors (for example, ObjectTypeName+UserName).
   - Binary attributes.
   - On-premises applications are sometimes not federated with Azure AD and require local passwords. The on-premises provisioning preview does not support password synchronization. Provisioning initial one-time passwords is supported. Please ensure that you are using the [Redact](./functions-for-customizing-application-data.md#redact) function to redact the passwords from the logs. In the SQL and LDAP connectors, the passwords are not exported on the initial call to the application, but rather a second call with set password.   

#### SSL certificates
   The Azure AD ECMA Connector Host currently requires either an SSL certificate to be trusted by Azure or the provisioning agent to be used. The certificate subject must match the host name the Azure AD ECMA Connector Host is installed on.

#### Anchor attributes
   The Azure AD ECMA Connector Host currently doesn't support anchor attribute changes (renames) or target systems, which require multiple attributes to form an anchor. 

#### Attribute discovery and mapping
   The attributes that the target application supports are discovered and surfaced in the Azure portal in **Attribute Mappings**. Newly added attributes will continue to be discovered. If an attribute type has changed, for example, string to Boolean, and the attribute is part of the mappings, the type won't change automatically in the Azure portal. Customers will need to go into advanced settings in mappings and manually update the attribute type.

#### Provisioning agent
- The agent does not currently support auto update for the on-prem application provisioning scenario. We are actively working to close this gap and ensure that auto update is enabled by default and required for all customers. 
- The same provisioning agent cannot be used for on-prem app provisioning and cloud sync / HR- driven provisioning. 

#### ECMA Host
The ECMA host does not support updating the password in the connectivity page of the wizard. Please create a new connector when changing the password. 

## Next steps
[How provisioning works](how-provisioning-works.md)
