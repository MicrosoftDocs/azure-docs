---
title: 'Microsoft Entra Connect: msExchUserHoldPolicies and cloudMsExchUserHoldPolicies'
description: This topic describes attribute behavior of the msExchUserHoldPolicies and cloudMsExchUserHoldPolicies attributes
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: reference
ms.date: 01/27/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Microsoft Entra Connect - msExchUserHoldPolicies and cloudMsExchUserHoldPolicies
The following reference document describes these attributes used by Exchange and the proper way to edit the default sync rules.

## What are msExchUserHoldPolicies and cloudMsExchUserHoldPolicies?
There are two types of [holds](/Exchange/policy-and-compliance/holds/holds) available for an Exchange Server: Litigation Hold and In-Place Hold. When Litigation Hold is enabled, all mailbox all items are placed on hold.  An In-Place Hold is used to preserve only those items that meet the criteria of a search query that you defined by using the In-Place eDiscovery tool.

The MsExchUserHoldPolcies and cloudMsExchUserHoldPolicies attributes allow on-premises AD and Microsoft Entra ID to determine which users are under a hold depending on whether they're using on-premises Exchange or Exchange on-line.

## msExchUserHoldPolicies synchronization flow
By default MsExchUserHoldPolcies are synchronized by Microsoft Entra Connect directly to the msExchUserHoldPolicies attribute in the metaverse and then to the msExchUserHoldPolicies attribute in Microsoft Entra ID

The following tables describe the flow:

Inbound from on-premises Active Directory:

|Active Directory attribute|Attribute name|Flow type|Metaverse attribute|Sync Rule|
|-----|-----|-----|-----|-----|
|On-premises Active Directory|msExchUserHoldPolicies|Direct|msExchUserHoldPolicies|In from AD - User Exchange|

Outbound to Microsoft Entra ID:

|Metaverse attribute|Attribute name|Flow type|Microsoft Entra attribute|Sync Rule|
|-----|-----|-----|-----|-----|
|Microsoft Entra ID|msExchUserHoldPolicies|Direct|msExchUserHoldPolicies|Out to Microsoft Entra ID – UserExchangeOnline|

## cloudMsExchUserHoldPolicies synchronization flow
By default cloudMsExchUserHoldPolicies are synchronized by Microsoft Entra Connect directly to the cloudMsExchUserHoldPolicies attribute in the metaverse. Then, if msExchUserHoldPolicies isn't null in the metaverse, the attribute in flowed out to Active Directory.

The following tables describe the flow:

Inbound from Microsoft Entra ID:

|Active Directory attribute|Attribute name|Flow type|Metaverse attribute|Sync Rule|
|-----|-----|-----|-----|-----|
|On-premises Active Directory|cloudMsExchUserHoldPolicies|Direct|cloudMsExchUserHoldPolicies|In from Microsoft Entra ID - User Exchange|

Outbound to on-premises Active Directory:

|Metaverse attribute|Attribute name|Flow type|Microsoft Entra attribute|Sync Rule|
|-----|-----|-----|-----|-----|
|Microsoft Entra ID|cloudMsExchUserHoldPolicies|IF(NOT NULL)|msExchUserHoldPolicies|Out to AD – UserExchangeOnline|

## Information on the attribute behavior
The msExchangeUserHoldPolicies are a single authority attribute.  A single authority attribute can be set on an object (in this case, user object) in the on-premises directory or in the cloud directory.  The Start of Authority rules dictate, that if the attribute is synchronized from on-premises, then Microsoft Entra ID won't be allowed to update this attribute.

To allow users to set a hold policy on a user object in the cloud, the cloudMSExchangeUserHoldPolicies attribute is used. This attribute is used because Microsoft Entra ID can't set msExchangeUserHoldPolicies directly based on the rules explained above.  This attribute will then synchronize back to the on-premises directory if, the msExchangeUserHoldPolicies isn't null and replace the current value of msExchangeUserHoldPolicies.

Under certain circumstances, for instance, if both were changed on-premises and in Azure at the same time, this could cause some issues.  

## Next steps
Learn more about [Integrating your on-premises identities with Microsoft Entra ID](../whatis-hybrid-identity.md).
