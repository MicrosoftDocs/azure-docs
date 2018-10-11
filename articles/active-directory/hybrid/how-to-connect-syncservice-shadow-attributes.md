---
title: Azure AD Connect sync service shadow attributes | Microsoft Docs
description: Describes how shadow attributes work in Azure AD Connect sync service.
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
editor: ''

ms.assetid:
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/13/2017
ms.component: hybrid
ms.author: billmath

---
# Azure AD Connect sync service shadow attributes
Most attributes are represented the same way in Azure AD as they are in your on-premises Active Directory. But some attributes have some special handling and the attribute value in Azure AD might be different than what Azure AD Connect synchronizes.

## Introducing shadow attributes
Some attributes have two representations in Azure AD. Both the on-premises value and a calculated value are stored. These extra attributes are called shadow attributes. The two most common attributes where you see this behavior are **userPrincipalName** and **proxyAddress**. The change in attribute values happens when there are values in these attributes representing non-verified domains. But the sync engine in Connect reads the value in the shadow attribute so from its perspective, the attribute has been confirmed by Azure AD.

You cannot see the shadow attributes using the Azure portal or with PowerShell. But understanding the concept helps you to troubleshoot certain scenarios where the attribute has different values on-premises and in the cloud.

To better understand the behavior, look at this example from Fabrikam:  
![Domains](./media/how-to-connect-syncservice-shadow-attributes/domains.png)  
They have multiple UPN suffixes in their on-premises Active Directory, but they have only verified one.

### userPrincipalName
A user has the following attribute values in a non-verified domain:

| Attribute | Value |
| --- | --- |
| on-premises userPrincipalName | lee.sperry@fabrikam.com |
| Azure AD shadowUserPrincipalName | lee.sperry@fabrikam.com |
| Azure AD userPrincipalName | lee.sperry@fabrikam.onmicrosoft.com |

The userPrincipalName attribute is the value you see when using PowerShell.

Since the real on-premises attribute value is stored in Azure AD, when you verify the fabrikam.com domain, Azure AD updates the userPrincipalName attribute with the value from the shadowUserPrincipalName. You do not have to synchronize any changes from Azure AD Connect for these values to be updated.

### proxyAddresses
The same process for only including verified domains also occurs for proxyAddresses, but with some additional logic. The check for verified domains only happens for mailbox users. A mail-enabled user or contact represent a user in another Exchange organization and you can add any values in proxyAddresses to these objects.

For a mailbox user, either on-premises or in Exchange Online, only values for verified domains appear. It could look like this:

| Attribute | Value |
| --- | --- |
| on-premises proxyAddresses | SMTP:abbie.spencer@fabrikamonline.com</br>smtp:abbie.spencer@fabrikam.com</br>smtp:abbie@fabrikamonline.com |
| Exchange Online proxyAddresses | SMTP:abbie.spencer@fabrikamonline.com</br>smtp:abbie@fabrikamonline.com</br>SIP:abbie.spencer@fabrikamonline.com |

In this case **smtp:abbie.spencer@fabrikam.com** was removed since that domain has not been verified. But Exchange also added **SIP:abbie.spencer@fabrikamonline.com**. Fabrikam has not used Lync/Skype on-premises, but Azure AD and Exchange Online prepare for it.

This logic for proxyAddresses is referred to as **ProxyCalc**. ProxyCalc is invoked with every change on a user when:

- The user has been assigned a service plan that includes Exchange Online even if the user was not licensed for Exchange. For example, if the user is assigned the Office E3 SKU, but only was assigned SharePoint Online. This is true even if your mailbox is still on-premises.
- The attribute msExchRecipientTypeDetails has a value.
- You make a change to proxyAddresses or userPrincipalName.

ProxyCalc might take some time to process a change on a user and is not synchronous with the Azure AD Connect export process.

> [!NOTE]
> The ProxyCalc logic has some additional behaviors for advanced scenarios not documented in this topic. This topic is provided for you to understand the behavior and not document all internal logic.

### Quarantined attribute values
Shadow attributes are also used when there are duplicate attribute values. For more information, see [duplicate attribute resiliency](how-to-connect-syncservice-duplicate-attribute-resiliency.md).

## See also
* [Azure AD Connect sync](how-to-connect-sync-whatis.md)
* [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).
