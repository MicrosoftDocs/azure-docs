---
title: 'Secure your Azure Active Directory Domain Services managed domain | Microsoft Docs'
description: Secure your managed domain
services: active-directory-ds
documentationcenter: ''
author: iainfoulds
manager: daveba
editor: curtand

ms.assetid: 6b4665b5-4324-42ab-82c5-d36c01192c2a
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/28/2019
ms.author: iainfou

---

# Secure your Azure AD Domain Services managed domain
This article helps you secure your managed domain. You can turn off the usage of weak cipher suites and disable NTLM credential hash synchronization.

## Install the required PowerShell modules

### Install and configure Azure AD PowerShell
Follow the instructions in the article to [install the Azure AD PowerShell module and connect to Azure AD](https://docs.microsoft.com/powershell/azure/active-directory/install-adv2?toc=%2fazure%2factive-directory-domain-services%2ftoc.json).

### Install and configure Azure PowerShell
Follow the instructions in the article to [install the Azure PowerShell module and connect to your Azure subscription](https://docs.microsoft.com/powershell/azure/install-az-ps?toc=%2fazure%2factive-directory-domain-services%2ftoc.json).


## Disable weak cipher suites and NTLM credential hash synchronization
Use the following PowerShell script to:
1. Disable NTLM v1 support on the managed domain.
2. Disable the synchronization of NTLM password hashes from your on-premises AD.
3. Disable TLS v1 on the managed domain.

```powershell
// Login to your Azure AD tenant
Login-AzAccount

// Retrieve the Azure AD Domain Services resource.
$DomainServicesResource = Get-AzResource -ResourceType "Microsoft.AAD/DomainServices"

// 1. Disable NTLM v1 support on the managed domain.
// 2. Disable the synchronization of NTLM password hashes from
//    on-premises AD to Azure AD and Azure AD Domain Services
// 3. Disable TLS v1 on the managed domain.
$securitySettings = @{"DomainSecuritySettings"=@{"NtlmV1"="Disabled";"SyncNtlmPasswords"="Disabled";"TlsV1"="Disabled"}}

// Apply the settings to the managed domain.
Set-AzResource -Id $DomainServicesResource.ResourceId -Properties $securitySettings -Verbose -Force
```

> [!IMPORTANT]
> Users (and service accounts) cannot perform LDAP simple binds if you have disabled NTLM password hash synchronization on your Azure AD Domain Services instance.  For more information on disabling NTLM password hash synchronization, read [Secure your Azure AD DOmain Services managed domain](secure-your-domain.md).
>
>

## Next steps
* [Understand synchronization in Azure AD Domain Services](synchronization.md)
