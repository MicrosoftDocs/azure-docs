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
ms.date: 08/23/2019
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Azure AD Connect - msExchUserHoldPolicies and cloudMsExchUserHoldPolicies
The following reference document describes these attributes used by Exchange and the proper way to edit the default sync rules.

## What are msExchUserHoldPolicies and cloudMsExchUserHoldPolicies?
There are two types of [holds](https://docs.microsoft.com/Exchange/policy-and-compliance/holds/holds?view=exchserver-2019) available for an Exchange Server: Litigation Hold and In-Place Hold. When Litigation Hold is enabled, all mailbox all items are placed on hold.  An In-Place Hold is used to preserve only those items that meet the criteria of a search query that you defined by using the In-Place eDiscovery tool.

The MsExchUserHoldPolcies and cloudMsExchUserHoldPolicies attributes allow on-premises AD and Azure AD to determine which users are under a hold depending on whether they are using on-premises Exchange or Exchange on-line.

## msExchUserHoldPolicies synchronization flow
By default MsExchUserHoldPolcies is synchronized by Azure AD Connect directly to the msExchUserHoldPolicies attribute in the metaverse and then to the msExchUserHoldPolices attribute in Azure AD

The following tables describe the flow:

Inbound from on-premises Active Directory:

|Active Directory attribute|Attribute name|Flow type|Metaverse attribute|Sync Rule|
|-----|-----|-----|-----|-----|
|On-premises Active Directory|msExchUserHoldPolicies|Direct|msExchUserHoldPolices|In from AD - User Exchange|

Outbound to Azure AD:

|Metaverse attribute|Attribute name|Flow type|Azure AD attribute|Sync Rule|
|-----|-----|-----|-----|-----|
|Azure Active Directory|msExchUserHoldPolicies|Direct|msExchUserHoldPolicies|Out to AAD – UserExchangeOnline|

## cloudMsExchUserHoldPolicies synchronization flow
By default cloudMsExchUserHoldPolicies is synchronized by Azure AD Connect directly to the cloudMsExchUserHoldPolicies attribute in the metaverse. Then, if msExchUserHoldPolices is not null in the metaverse, the attribute in flowed out to Active Directory.

The following tables describe the flow:

Inbound from Azure AD:

|Active Directory attribute|Attribute name|Flow type|Metaverse attribute|Sync Rule|
|-----|-----|-----|-----|-----|
|On-premises Active Directory|cloudMsExchUserHoldPolicies|Direct|cloudMsExchUserHoldPolicies|In from AAD - User Exchange|

Outbound to on-premises Active Directory:

|Metaverse attribute|Attribute name|Flow type|Azure AD attribute|Sync Rule|
|-----|-----|-----|-----|-----|
|Azure Active Directory|cloudMsExchUserHoldPolicies|IF(NOT NULL)|msExchUserHoldPolicies|Out to AD – UserExchangeOnline|

## Information on the attribute behavior
The msExchangeUserHoldPolicies is a single authority attribute.  A single authority attribute can be set on an object (in this case, user object) in the on-premises directory or in the cloud directory.  The Start of Authority rules dictate, that if the attribute is synchronized from on-premises, then Azure AD will not be allowed to update this attribute.

To allow users to set a hold policy on a user object in the cloud, the cloudMSExchangeUserHoldPolicies attribute is used. This attribute is used because Azure AD cannot set msExchangeUserHoldPolicies directly based on the rules explained above.  This attribute will then synchronize back to the on-premises directory if, the msExchangeUserHoldPolicies is not null and replace the current value of msExchangeUserHoldPolicies.

Under certain circumstances, for instance, if both were changed on-premises and in Azure at the same time, this could cause some issues.  

## Next steps
Learn more about [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).
