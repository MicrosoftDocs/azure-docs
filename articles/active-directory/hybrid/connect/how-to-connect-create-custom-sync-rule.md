---
title: How to customize a synchronization rule in Microsoft Entra Connect'
description: Learn how to use the synchronization rule editor to edit or create a new synchronization rule.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 01/27/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# How to customize a synchronization rule

## **Recommended Steps**

You can use the synchronization rule editor to edit or create a new synchronization rule. You need to be an advanced user to make changes to synchronization rules. Any wrong changes may result in deletion of objects from your target directory. Please review the [Recommended Documents](#recommended-documents) section. To modify a synchronization rule, go through following steps:

* Launch the synchronization editor from the application menu in desktop as shown below:

    ![Synchronization Rule Editor Menu](media/how-to-connect-create-custom-sync-rule/how-to-connect-create-custom-sync-rule/syncruleeditormenu.png)

* In order to customize a default synchronization rule, clone the existing rule by clicking the “Edit” button on the Synchronization Rules Editor, which will create a copy of the standard default rule and disable it. Save the cloned rule with a precedence less than 100.  Precedence determines what rule wins(lower numeric value) a conflict resolution if there's an attribute flow conflict.

    ![Synchronization Rule Editor](media/how-to-connect-create-custom-sync-rule/how-to-connect-create-custom-sync-rule/clonerule.png)

* When modifying a specific attribute, ideally you should only keep the modifying attribute in the cloned rule.  Then enable the default rule so that modified attribute comes from cloned rule and other attributes are picked from default standard rule. 

* In the case where the calculated value of the modified attribute is NULL, in your cloned rule, and isn't NULL in the default standard rule then, the not NULL value will win and will replace the NULL value. If you don’t want a NULL value to be replaced with a not NULL value, then assign AuthoritativeNull in your cloned rule.

* To modify an **Outbound** rule, change filter from the synchronization rule editor.

## **Recommended Documents**
* [Microsoft Entra Connect Sync: Technical Concepts](./how-to-connect-sync-technical-concepts.md)
* [Microsoft Entra Connect Sync: Understanding the architecture](./concept-azure-ad-connect-sync-architecture.md)
* [Microsoft Entra Connect Sync: Understanding Declarative Provisioning](./concept-azure-ad-connect-sync-declarative-provisioning.md)
* [Microsoft Entra Connect Sync: Understanding Declarative Provisioning Expressions](./concept-azure-ad-connect-sync-declarative-provisioning-expressions.md)
* [Microsoft Entra Connect Sync: Understanding the default configuration](./concept-azure-ad-connect-sync-default-configuration.md)
* [Microsoft Entra Connect Sync: Understanding Users, Groups, and Contacts](./concept-azure-ad-connect-sync-user-and-contacts.md)
* [Microsoft Entra Connect Sync: Shadow attributes](./how-to-connect-syncservice-shadow-attributes.md)

## Next Steps
- [Microsoft Entra Connect Sync](how-to-connect-sync-whatis.md).
- [What is hybrid identity?](../whatis-hybrid-identity.md).
