---
title: 'How to use map UserType with Azure AD Connect cloud sync'
description: This article describes how to use map the UserType attribute with cloud sync.
services: active-directory
author: billmath
manager: mtillman
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 05/04/2021
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Map UserType with cloud sync

Cloud sync supports synchronization of the UserType attribute for User objects. 

By default, the UserType attribute is not enabled for synchronization because there is no corresponding UserType attribute in on-premises Active Directory. You must manually add this mapping for synchronization. Before doing this, you must take note of the following behavior enforced by Azure AD:

- Azure AD only accepts two values for the UserType attribute: Member and Guest.
- If the UserType attribute is not mapped in cloud sync, Azure AD users created through directory synchronization would have the UserType attribute set to Member.

Before adding a mapping for the  UserType attribute, you must first decide how the attribute is derived from on-premises Active Directory. The following are the most common approaches:

 - Designate an unused on-premises AD attribute (such as extensionAttribute1) to be used as the source attribute. The designated on-premises AD attribute should be of the type string, be single-valued, and contain the value Member or Guest.
 - If you choose this approach, you must ensure that the designated attribute is populated with the correct value for all existing user objects in on-premises Active Directory that are synchronized to Azure AD before enabling synchronization of the UserType attribute.

## To add the UserType mapping
To add the UserType mapping, use the following steps.

 1. In the Azure portal, select **Azure Active Directory**
 2. Select **Azure AD Connect**.
 3. Select **Manage cloud sync**.
 4. Under **Configuration**, select your configuration.
 5. Under **Manage attributes**, select **Click to edit mappings**.
  ![Edit the attribute mappings](media/how-to-map-usertype/usertype-1.png) 

 6. Click **Add attribute mapping**.
    ![Add a new attribute mapping](media/how-to-map-usertype/usertype-2.png) 
7. Select the mapping type. You can do the mapping in one of three ways:
 - a direct mapping (ie from an AD attribute)
 - an expression (IIF(InStr([userPrincipalName], "@partners") > 0,"Guest","Member"))
 - a constant (that is, make all user objects as Guest).
  ![Add usertype](media/how-to-map-usertype/usertype-3.png) 
8. In the Target attribute dropdown, select UserType.
9. Click the **Apply** button at the bottom of the page. This will create a mapping for the Azure AD UserType attribute.

## Next steps 

- [Writing expressions for attribute mappings in Azure Active Directory](reference-expressions.md)
- [Cloud sync configuration](how-to-configure.md)
