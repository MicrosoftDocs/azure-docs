---
title: Federating multiple Microsoft Entra ID with single AD FS
description: In this document, you will learn how to federate multiple Microsoft Entra ID with a single AD FS.
keywords: federate, ADFS, AD FS, multiple tenants, single AD FS, one ADFS, multi-tenant federation, multi-forest adfs, aad connect, federation, cross-tenant federation
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.custom: has-azure-ad-ps-ref
ms.topic: how-to
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Federate multiple instances of Microsoft Entra ID with single instance of AD FS

A single high available AD FS farm can federate multiple forests if they have 2-way trust between them. These multiple forests may or may not correspond to the same Microsoft Entra ID. This article provides instructions on how to configure federation between a single AD FS deployment and multiple instances of Microsoft Entra ID.

![Multi-tenant federation with single AD FS](./media/how-to-connect-fed-single-adfs-multitenant-federation/concept.png)
 
> [!NOTE]
> Device writeback and automatic device join are not supported in this scenario.

> [!NOTE]
> Microsoft Entra Connect cannot be used to configure federation in this scenario as Microsoft Entra Connect can configure federation for domains in a single Microsoft Entra ID.

<a name='steps-for-federating-ad-fs-with-multiple-azure-ad'></a>

## Steps for federating AD FS with multiple Microsoft Entra ID

Consider a domain contoso.com in Microsoft Entra contoso.onmicrosoft.com is already federated with the AD FS on-premises installed in contoso.com on-premises Active Directory environment. Fabrikam.com is a domain in fabrikam.onmicrosoft.com Microsoft Entra ID.

## Step 1: Establish a two-way trust
 
For AD FS in contoso.com to be able to authenticate users in fabrikam.com, a two-way trust is needed between contoso.com and fabrikam.com. Follow the guideline in this [article](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc816590(v=ws.10)) to create the two-way trust.
 
## Step 2: Modify contoso.com federation settings 
 
The default issuer set for a single domain federated to AD FS is "http\://ADFSServiceFQDN/adfs/services/trust", for example, `http://fs.contoso.com/adfs/services/trust`. Microsoft Entra ID requires unique issuer for each federated domain. Because AD FS is going to federate two domains, the issuer value needs to be modified so that it is unique. 
 
On the AD FS server, open Azure AD PowerShell (ensure that the MSOnline module is installed) and do the following steps:
 
Connect to the Microsoft Entra ID that contains the domain contoso.com
    Connect-MsolService
Update the federation settings for contoso.com
    Update-MsolFederatedDomain -DomainName contoso.com –SupportMultipleDomain
 
Issuer in the domain federation setting will be changed to "http\://contoso.com/adfs/services/trust" and an issuance claim rule will be added for the Microsoft Entra ID Relying Party Trust to issue the correct issuerId value based on the UPN suffix.
 
## Step 3: Federate fabrikam.com with AD FS
 
In Azure AD PowerShell session perform the following steps:
Connect to Microsoft Entra ID that contains the domain fabrikam.com

```powershell
Connect-MsolService
```
Convert the fabrikam.com managed domain to federated:

```powershell
Convert-MsolDomainToFederated -DomainName fabrikam.com -Verbose -SupportMultipleDomain
```
 
The above operation will federate the domain fabrikam.com with the same AD FS. You can verify the domain settings by using Get-MsolDomainFederationSettings for both domains.

## Next steps
[Connect Active Directory with Microsoft Entra ID](../whatis-hybrid-identity.md)
