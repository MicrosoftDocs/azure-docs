---
title: 'Azure AD Connect: msExchUserHoldPolicies and cloudMsExchUserHoldPolicies | Microsoft Docs'
description: This topic describes attribute behavior of the msExchUserHoldPolicies and cloudMsExchUserHoldPolicies attributes
services: active-directory
documentationcenter: ''
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: reference
ms.date: 07/18/2019
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Azure AD Connect - msExchUserHoldPolicies and cloudMsExchUserHoldPolicies
The following reference document describes these attributes used by Exchange and the proper way to edit the default sync rules.

## What is msExchUserHoldPolicies and cloudMsExchUserHoldPolicies
There are two types of [holds](https://docs.microsoft.com/en-us/Exchange/policy-and-compliance/holds/holds?view=exchserver-2019) available for an Exchange Server: Litigation Hold and In-Place Hold. When Litigation Hold is enabled, all mailbox all items are placed on hold.  An In-Place Hold is used to preserve only those items that meet the criteria of a search query that you defined by using the In-Place eDiscovery tool.

The MsExchUserHoldPolcies and cloudMsExchUserHoldPolicies attributes allow on-premises AD and Azure AD to determine which users are under a hold depending on whether they are using on-premises Exchange or Exchange on-line.

## msExchUserHoldPolicies synchronization flow
By default MsExchUserHoldPolcies is sychronized by Azure AD Connect directly to the msExchUserHoldPolicies attribute in the metaverse and then to the msExchUserHoldPolices attribute in Azure AD

The following tables describe the flow:

Inbound from on-premises Active Directory:
|Active Directory attribute|Attribute name|Flow type|Metaverse attribute|Sync Rule
|-----|-----|-----|-----|-----|
|On-premises Active Directory|msExchUserHoldPolicies|Direct|msExchUserHoldPolices|In from AD - User Exchange|

Outbound to Azure AD:
|Metaverse attribute|Attribute name|Flow type|Azure AD attribute|Sync Rule
|-----|-----|-----|-----|-----|
|Azure Active Directory|msExchUserHoldPolicies|Direct|msExchUserHoldPolicies|Out to AAD – UserExchangeOnline|

## cloudMsExchUserHoldPolicies synchronization flow
By default cloudMsExchUserHoldPolicies is sychronized by Azure AD Connect directly to the cloudMsExchUserHoldPolicies attribute in the metaverse. Then, if msExchUserHoldPolices is not null in the metaverse, the attribute in flowed out to Active Directory.

The following tables describe the flow:

Inbound from on-premises Active Directory:
|Active Directory attribute|Attribute name|Flow type|Metaverse attribute|Sync Rule
|-----|-----|-----|-----|-----|
|On-premises Active Directory|cloudMsExchUserHoldPolicies|Direct|cloudMsExchUserHoldPolicies|In from AAD - User Exchange|

Outbound to Azure AD:
|Metaverse attribute|Attribute name|Flow type|Azure AD attribute|Sync Rule
|-----|-----|-----|-----|-----|
|Azure Active Directory|cloudMsExchUserHoldPolicies|IF(NOT NULL)|msExchUserHoldPolicies|Out to AD – UserExchangeOnline|

## Information on the attribute behavior
The msExchangeUserHoldPolicies is a single authority attribute.  A single authority attribute can be set on an object (in this case, user object) in the on-premises directory or in the cloud directory.  The Start of Authority rules dictate that if the attribute is synchronized from on-premises, then Azure AD will not be allowed to update this attribute.

To allow users to set hold policies on a user object in the cloud, the cloudMSExchangeUserHoldPolicies attribute is used, because the Azure AD cannot set msExchangeUserHoldPolicies directly.  This will then synchronize back to the on-premises directory if, the msExchangeUserHoldPolicies is not null.

Under certain circumstances, for instance, if both were changed on-premise and in Azure at the same time, this could cause some issues.  

The following are important things to remember:

- Any value set in Azure AD (except NULL) will always flow down and overwrite the on-premises (AD) value.  If you always edit the value for a particular User in Azure then you should be fine.

- A value set in Active Directory (on-premises) **MAY** flow to the cloud assuming some cloud value has not already been set.  If you always edit the value for a particular User in Active Directory then you should be fine.

Problems can arise if changes are made both on-premises and in the cloud.

To work around this, you can disable the cloudMSExchangeUserHoldPolicies to msExchUserHoldPolicies in the **Out to AD – UserExchangeOnline** synchronization rule. See [Changes to Synchronization rules](how-to-connect-sync-best-practices-changing-default-configuration.md#changes-to-synchronization-rules)

## Next steps
Learn more about [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).
