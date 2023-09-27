---
title: 'Microsoft Entra Connect Sync: Understanding Users, Groups, and Contacts'
description: Explains users, groups, and contacts in Microsoft Entra Connect Sync.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino

ms.assetid: 8d204647-213a-4519-bd62-49563c421602
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 01/27/2023
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Microsoft Entra Connect Sync: Understanding Users, Groups, and Contacts
There are several different reasons why you would have multiple Active Directory forests and there are several different deployment topologies. Common models include an account-resource deployment and GAL sync’ed forests after a merger & acquisition. But even if there are pure models, hybrid models are common as well. The default configuration in Microsoft Entra Connect Sync doesn't assume any particular model but depending on how user matching was selected in the installation guide, different behaviors can be observed.

In this topic, we go through how the default configuration behaves in certain topologies. We go through the configuration and the Synchronization Rules Editor can be used to look at the configuration.

There are a few general rules the configuration assumes:
* Regardless of which order we import from the source Active Directories, the end result should always be the same.
* An active account will always contribute sign-in information, including **userPrincipalName** and **sourceAnchor**.
* A disabled account contributes userPrincipalName and sourceAnchor, unless it's a linked mailbox, if there's no active account to be found.
* An account with a linked mailbox will never be used for userPrincipalName and sourceAnchor. It's assumed that an active account will be found later.
* A contact object might be provisioned to Microsoft Entra ID as a contact or as a user. You don’t really know until all source Active Directory forests have been processed.

## Groups
> [!NOTE]
> Keep in mind that when you add a user from another forest to the group, there is an anchor created in the Active Directory where the groups exists inside a specific OU. This anchor is a Foreign security principal and is stored inside the OU ‘ForeignSecurityPrincipals’. If you don't synchronize this OU the users where removed from the group membership.
> 
> 

Important points to be aware of when synchronizing groups from Active Directory to Microsoft Entra ID:

* Microsoft Entra Connect excludes built-in security groups from directory synchronization.

* Microsoft Entra Connect doesn't support synchronizing [Primary Group memberships](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc771489(v=ws.11)) to Microsoft Entra ID.

* Microsoft Entra Connect doesn't support synchronizing [Dynamic Distribution Group memberships](/Exchange/recipients/dynamic-distribution-groups/dynamic-distribution-groups) to Microsoft Entra ID.

* To synchronize an Active Directory group to Microsoft Entra ID as a mail-enabled group:

    * If the group's *proxyAddress* attribute is empty, its *mail* attribute must have a value

    * If the group's *proxyAddress* attribute is non-empty, it must contain at least one SMTP proxy address value. Here are some examples:
    
      * An Active Directory group whose proxyAddress attribute has value *{"X500:/0=contoso.com/ou=users/cn=testgroup"}* won't be mail-enabled in Microsoft Entra ID. It doesn't have an SMTP address.
      
      * An Active Directory group whose proxyAddress attribute has values *{"X500:/0=contoso.com/ou=users/cn=testgroup","SMTP:johndoe\@contoso.com"}* will be mail-enabled in Microsoft Entra ID.
      
      * An Active Directory group whose proxyAddress attribute has values *{"X500:/0=contoso.com/ou=users/cn=testgroup", "smtp:johndoe\@contoso.com"}* will also be mail-enabled in Microsoft Entra ID.

## Contacts
Having contacts representing a user in a different forest is common after a merger & acquisition where a GALSync solution is bridging two or more Exchange forests. The contact object is always joining from the connector space to the metaverse using the mail attribute. If there's already a contact object or user object with the same mail address, the objects are joined together. This is configured in the rule **In from AD – Contact Join**. There is also a rule named **In from AD – Contact Common** with an attribute flow to the metaverse attribute **sourceObjectType** with the constant **Contact**. This rule has low precedence so if any user object is joined to the same metaverse object, then the rule **In from AD – User Common** will contribute the value User to this attribute. With this rule, this attribute has the value Contact if no user has been joined and the value User if at least one user has been found.

For provisioning an object to Microsoft Entra ID, the outbound rule **Out to Microsoft Entra ID – Contact Join** will create a contact object if the metaverse attribute **sourceObjectType** is set to **Contact**. If this attribute is set to **User**, then the rule **Out to Microsoft Entra ID – User Join** will create a user object instead.
It is possible that an object is promoted from Contact to User when more source Active Directories are imported and synchronized.

For example, in a GALSync topology we find contact objects for everyone in the second forest when we import the first forest. This stages new contact objects in the Microsoft Entra Connector. When we later import and synchronize the second forest, we find the real users and join them to the existing metaverse objects. We will then delete the contact object in Microsoft Entra ID and create a new user object instead.

If you have a topology where users are represented as contacts, make sure you select to match users on the mail attribute in the installation guide. If you select another option, then you have an order-dependent configuration. Contact objects will always join on the mail attribute, but user objects will only join on the mail attribute if this option was selected in the installation guide. You could then end up with two different objects in the metaverse with the same mail attribute if the contact object was imported before the user object. During export to Microsoft Entra ID, an error is shown. This behavior is by design and would indicate bad data or that the topology was not correctly identified during the installation.

## Disabled accounts
Disabled accounts are synchronized as well to Microsoft Entra ID. Disabled accounts are common to represent resources in Exchange, for example conference rooms. The exception is users with a linked mailbox; as previously mentioned, these will never provision an account to Microsoft Entra ID.

The assumption is that if a disabled user account is found, then we won't find another active account later and the object is provisioned to Microsoft Entra ID with the userPrincipalName and sourceAnchor found. In case another active account join to the same metaverse object, then its userPrincipalName and sourceAnchor will be used.

## Changing sourceAnchor
When an object has been exported to Microsoft Entra ID then it's not allowed to change the sourceAnchor anymore. When the object has been exported the metaverse attribute **cloudSourceAnchor** is set with the **sourceAnchor** value accepted by Microsoft Entra ID. If **sourceAnchor** is changed and not match **cloudSourceAnchor**, the rule **Out to Microsoft Entra ID – User Join** will throw the error **sourceAnchor attribute has changed**. In this case, the configuration or data must be corrected so the same sourceAnchor is present in the metaverse again before the object can be synchronized again.

## Additional Resources
* [Microsoft Entra Connect Sync: Customizing Synchronization options](how-to-connect-sync-whatis.md)
* [Integrating your on-premises identities with Microsoft Entra ID](../whatis-hybrid-identity.md)
