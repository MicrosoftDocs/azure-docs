---
title: 'Azure AD Connect sync: Understanding Users, Groups, and Contacts | Microsoft Docs'
description: Explains users, groups, and contacts in Azure AD Connect sync.
services: active-directory
documentationcenter: ''
author: billmath
manager: daveba

ms.assetid: 8d204647-213a-4519-bd62-49563c421602
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 01/15/2018
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Azure AD Connect sync: Understanding Users, Groups, and Contacts
There are several different reasons why you would have multiple Active Directory forests and there are several different deployment topologies. Common models include an account-resource deployment and GAL sync’ed forests after a merger & acquisition. But even if there are pure models, hybrid models are common as well. The default configuration in Azure AD Connect sync does not assume any particular model but depending on how user matching was selected in the installation guide, different behaviors can be observed.

In this topic, we will go through how the default configuration behaves in certain topologies. We will go through the configuration and the Synchronization Rules Editor can be used to look at the configuration.

There are a few general rules the configuration assumes:
* Regardless of which order we import from the source Active Directories, the end result should always be the same.
* An active account will always contribute sign-in information, including **userPrincipalName** and **sourceAnchor**.
* A disabled account will contribute userPrincipalName and sourceAnchor, unless it is a linked mailbox, if there is no active account to be found.
* An account with a linked mailbox will never be used for userPrincipalName and sourceAnchor. It is assumed that an active account will be found later.
* A contact object might be provisioned to Azure AD as a contact or as a user. You don’t really know until all source Active Directory forests have been processed.

## Groups
Important points to be aware of when synchronizing groups from Active Directory to Azure AD:

* Azure AD Connect excludes built-in security groups from directory synchronization.

* Azure AD Connect does not support synchronizing [Primary Group memberships](https://technet.microsoft.com/library/cc771489(v=ws.11).aspx) to Azure AD.

* Azure AD Connect does not support synchronizing [Dynamic Distribution Group memberships](https://technet.microsoft.com/library/bb123722(v=exchg.160).aspx) to Azure AD.

* To synchronize an Active Directory group to Azure AD as a mail-enabled group:

    * If the group's *proxyAddress* attribute is empty, its *mail* attribute must have a value

    * If the group's *proxyAddress* attribute is non-empty, it must contain at least one SMTP proxy address value. Here are some examples:
    
      * An Active Directory group whose proxyAddress attribute has value *{"X500:/0=contoso.com/ou=users/cn=testgroup"}* will not be mail-enabled in Azure AD. It does not have an SMTP address.
      
      * An Active Directory group whose proxyAddress attribute has values *{"X500:/0=contoso.com/ou=users/cn=testgroup","SMTP:johndoe\@contoso.com"}* will be mail-enabled in Azure AD.
      
      * An Active Directory group whose proxyAddress attribute has values *{"X500:/0=contoso.com/ou=users/cn=testgroup", "smtp:johndoe\@contoso.com"}* will also be mail-enabled in Azure AD.

## Contacts
Having contacts representing a user in a different forest is common after a merger & acquisition where a GALSync solution is bridging two or more Exchange forests. The contact object is always joining from the connector space to the metaverse using the mail attribute. If there is already a contact object or user object with the same mail address, the objects are joined together. This is configured in the rule **In from AD – Contact Join**. There is also a rule named **In from AD – Contact Common** with an attribute flow to the metaverse attribute **sourceObjectType** with the constant **Contact**. This rule has very low precedence so if any user object is joined to the same metaverse object, then the rule **In from AD – User Common** will contribute the value User to this attribute. With this rule, this attribute will have the value Contact if no user has been joined and the value User if at least one user has been found.

For provisioning an object to Azure AD, the outbound rule **Out to AAD – Contact Join** will create a contact object if the metaverse attribute **sourceObjectType** is set to **Contact**. If this attribute is set to **User**, then the rule **Out to AAD – User Join** will create a user object instead.
It is possible that an object is promoted from Contact to User when more source Active Directories are imported and synchronized.

For example, in a GALSync topology we will find contact objects for everyone in the second forest when we import the first forest. This will stage new contact objects in the AAD Connector. When we later import and synchronize the second forest, we will find the real users and join them to the existing metaverse objects. We will then delete the contact object in AAD and create a new user object instead.

If you have a topology where users are represented as contacts, make sure you select to match users on the mail attribute in the installation guide. If you select another option, then you will have an order-dependent configuration. Contact objects will always join on the mail attribute, but user objects will only join on the mail attribute if this option was selected in the installation guide. You could then end up with two different objects in the metaverse with the same mail attribute if the contact object was imported before the user object. During export to Azure AD, an error will be thrown. This behavior is by design and would indicate bad data or that the topology was not correctly identified during the installation.

## Disabled accounts
Disabled accounts are synchronized as well to Azure AD. Disabled accounts are common to represent resources in Exchange, for example conference rooms. The exception is users with a linked mailbox; as previously mentioned, these will never provision an account to Azure AD.

The assumption is that if a disabled user account is found, then we will not find another active account later and the object is provisioned to Azure AD with the userPrincipalName and sourceAnchor found. In case another active account will join to the same metaverse object, then its userPrincipalName and sourceAnchor will be used.

## Changing sourceAnchor
When an object has been exported to Azure AD then it is not allowed to change the sourceAnchor anymore. When the object has been exported the metaverse attribute **cloudSourceAnchor** is set with the **sourceAnchor** value accepted by Azure AD. If **sourceAnchor** is changed and not match **cloudSourceAnchor**, the rule **Out to AAD – User Join** will throw the error **sourceAnchor attribute has changed**. In this case, the configuration or data must be corrected so the same sourceAnchor is present in the metaverse again before the object can be synchronized again.

## Additional Resources
* [Azure AD Connect Sync: Customizing Synchronization options](how-to-connect-sync-whatis.md)
* [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md)

