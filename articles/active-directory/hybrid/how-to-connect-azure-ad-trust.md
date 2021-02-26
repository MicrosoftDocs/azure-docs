---
title: Azure AD Connect - Manage AD FS trust with Azure AD using Azure AD Connect | Microsoft Docs
description: Operational details of Azure AD trust handling by Azure AD connect.
keywords: AD FS, ADFS, AD FS management, AAD Connect, Connect, Azure AD, trust, AAD, claim, claim, claim rules, issuance, transform, rules, backup, restore
services: active-directory
documentationcenter: ''
ms.reviewer: anandyadavmsft
manager: daveba
ms.subservice: hybrid
ms.assetid: 2593b6c6-dc3f-46ef-8e02-a8e2dc4e9fb9
ms.service: active-directory    
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 07/28/2018
ms.author: billmath
author: billmath
ms.custom: 
ms.collection: M365-identity-device-management
---
# Manage AD FS trust with Azure AD using Azure AD Connect

## Overview

Azure AD Connect can manage federation between on-premises Active Directory Federation Service (AD FS) and Azure AD. This article provides an overview of:

* The various settings configured on the trust by Azure AD Connect
* The issuance transform rules (claim rules) set by Azure AD Connect
* How to back-up and restore your claim rules between upgrades and configuration updates. 

## Settings controlled by Azure AD Connect

Azure AD Connect manages **only** settings related to Azure AD trust. Azure AD Connect does not modify any settings on other relying party trusts in AD FS. The following table indicates settings that are controlled by Azure AD Connect.

| Setting | Description |
| :--- | :--- |
| Token signing certificate | Azure AD Connect can be used to reset and recreate the trust with Azure AD. Azure AD Connect does a one-time immediate rollover of token signing certificates for AD FS and updates the Azure AD domain federation settings.|
| Token signing algorithm | Microsoft recommends using SHA-256 as the token signing algorithm. Azure AD Connect can detect if the token signing algorithm is set to a value less secure than SHA-256. It will update the setting to SHA-256 in the next possible configuration operation. Other relying party trust must be updated to use the new token signing certificate. |
| Azure AD trust identifier | Azure AD Connect sets the correct identifier value for the Azure AD trust. AD FS uniquely identifies the Azure AD trust using the identifier value. |
| Azure AD endpoints | Azure AD Connect makes sure that the endpoints configured for the Azure AD trust are always as per the latest recommended values for resiliency and performance. |
| Issuance transform rules | There are numbers of claim rules which are needed for optimal performance of features of Azure AD in a federated setting. Azure AD Connect makes sure that the Azure AD trust is always configured with the right set of recommended claim rules. |
| Alternate-id | If sync is configured to use alternate-id, Azure AD Connect configures AD FS to perform authentication using alternate-id. |
| Automatic metadata update | Trust with Azure AD is configured for automatic metadata update. AD FS periodically checks the metadata of Azure AD trust and keeps it up-to-date in case it changes on the Azure AD side. |
| Integrated Windows Authentication (IWA) | During Hybrid Azure AD join operation, IWA is enabled for device registration to facilitate Hybrid Azure AD join for downlevel devices |

## Execution flows and federation settings configured by Azure AD Connect

Azure AD connect does not update all settings for Azure AD trust during configuration flows. The settings modified depend on which task or execution flow is being executed. The following table lists the settings impacted in different execution flows.

| Execution flow | Settings impacted |
| :--- | :--- |
| First pass installation (express) | None |
| First pass installation (new AD FS farm) | A new AD FS farm is created and a trust with Azure AD is created from scratch. |
| First pass installation (existing AD FS farm, existing Azure AD trust) | Azure AD trust identifier, Issuance transform rules, Azure AD endpoints, Alternate-id (if necessary), automatic metadata update |
| Reset Azure AD trust | Token signing certificate, Token signing algorithm, Azure AD trust identifier, Issuance transform rules, Azure AD endpoints, Alternate-id (if necessary), automatic metadata update |
| Add federation server | None |
| Add WAP server | None |
| Device options | Issuance transform rules, IWA for device registration |
| Add federated domain | If the domain is being added for the first time, that is, the setup is changing from single domain federation to multi-domain federation – Azure AD Connect will recreate the trust from scratch. If the trust with Azure AD is already configured for multiple domains, only Issuance transform rules are modified |
| Update TLS | None |

During all operations, in which, any setting is modified, Azure AD Connect makes a backup of the current trust settings at **%ProgramData%\AADConnect\ADFS**

![Azure AD Connect page showing message about existing Azure AD trust backup](./media/how-to-connect-azure-ad-trust/backup2.png)

> [!NOTE]
> Prior to version 1.1.873.0, the backup consisted of only issuance transform rules and they were backed up in the wizard trace log file.

## Issuance transform rules set by Azure AD Connect

Azure AD Connect makes sure that the Azure AD trust is always configured with the right set of recommended claim rules. Microsoft recommends using Azure AD connect for managing your Azure AD trust. This section lists the issuance transform rules set and their description.

| Rule name | Description |
| --- | --- |
| Issue UPN | This rule queries the value of userprincipalname as from the attribute configured in sync settings for userprincipalname.|
| Query objectguid and msdsconsistencyguid for custom ImmutableId claim | This rule adds a temporary value in the pipeline for objectguid and msdsconsistencyguid value if it exists |
| Check for the existence of msdsconsistencyguid | Based on whether the value for msdsconsistencyguid exists or not, we set a temporary flag to direct what to use as ImmutableId |
| Issue msdsconsistencyguid as Immutable ID if it exists | Issue msdsconsistencyguid as ImmutableId if the value exists |
| Issue objectGuidRule if msdsConsistencyGuid rule does not exist | If the value for msdsconsistencyguid does not exist, the value of objectguid will be issued as ImmutableId |
| Issue nameidentifier | This rule issues value for the nameidentifier claim.|
| Issue accounttype for domain-joined computers | If the entity being authenticated is a domain joined device, this rule issues the account type as DJ signifying a domain joined device |
| Issue AccountType with the value USER when it is not a computer account | If the entity being authenticated is a user, this rule issues the account type as User |
| Issue issuerid when it is not a computer account | This rule issues the issuerId value when the authenticating entity is not a device. The value is created via a regex, which is configured by Azure AD Connect. The regex is created after taking into consideration all the domains federated using Azure AD Connect. |
| Issue issuerid for DJ computer auth | This rule issues the issuerId value when the authenticating entity is a device |
| Issue onpremobjectguid for domain-joined computers | If the entity being authenticated is a domain joined device, this rule issues the on-premises objectguid for the device |
| Pass through primary SID | This rule issues the primary SID of the authenticating entity |
| Pass through claim - insideCorporateNetwork | This rule issues a claim that helps Azure AD know if the authentication is coming from inside corporate network or externally |
| Pass Through Claim – Psso |   |
| Issue Password Expiry Claims | This rule issues three claims for password expiration time, number of days for the password to expire of the entity being authenticated and URL where to route for changing the password.|
| Pass through claim – authnmethodsreferences | The value in the claim issued under this rule indicates what type of authentication was performed for the entity |
| Pass through claim - multifactorauthenticationinstant | The value of this claim specifies the time, in UTC, when the user last performed multiple factor authentication. |
| Pass through claim - AlternateLoginID | This rule issues the AlternateLoginID claim if the authentication was performed using alternate login ID. |

> [!NOTE]
> The claim rules for Issue UPN and ImmutableId will differ if you use non-default choice during Azure AD Connect configuration

## Restore issuance transform rules

Azure AD Connect version 1.1.873.0 or later makes a backup of the Azure AD trust settings whenever an update is made to the Azure AD trust settings. The Azure AD trust settings are backed up at **%ProgramData%\AADConnect\ADFS**. The file name is in the following format AadTrust-&lt;date&gt;-&lt;time&gt;.txt, for example - AadTrust-20180710-150216.txt

![A screenshot of example back up of Azure AD trust](./media/how-to-connect-azure-ad-trust/backup.png)

You can restore the issuance transform rules using the suggested steps below

1. Open the AD FS management UI in Server Manager
2. Open the Azure AD trust properties by going **AD FS &gt; Relying Party Trusts &gt; Microsoft Office 365 Identity Platform &gt; Edit Claims Issuance Policy**
3. Click on **Add rule**
4. In the claim rule template, select Send Claims Using a Custom Rule and click **Next**
5. Copy the name of the claim rule from backup file and paste it in the field **Claim rule name**
6. Copy the claim rule from backup file into the text field for **Custom rule** and click **Finish**

> [!NOTE]
> Make sure that your additional rules do not conflict with the rules configured by Azure AD Connect.

## Next steps
* [Manage and customize Active Directory Federation Services using Azure AD Connect](how-to-connect-fed-management.md)
