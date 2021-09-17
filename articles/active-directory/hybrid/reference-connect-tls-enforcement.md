---
title: 'Azure AD Connect: TLS 1.2 enforcement for Azure Active Directory Connect| Microsoft Docs'
description: Learn how to force your Azure AD Connect server to use only Transport Layer Security (TLS) 1.2.
services: active-directory
documentationcenter: ''
author: billmath
manager: daveba
editor: ''
ms.service: active-directory
ms.devlang: na
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 9/14/2021
ms.subservice: hybrid
ms.author: rodejo

ms.collection: M365-identity-device-management
---

# TLS 1.2 enforcement for Azure AD Connect

Transport Layer Security (TLS) protocol version 1.2 is a cryptography protocol that is designed to provide  secure communications. The TLS protocol aims primarily to provide privacy and data integrity. TLS has gone through many iterations, with version 1.2 being defined in [RFC 5246](https://tools.ietf.org/html/rfc5246). Azure Active Directory Connect version 1.2.65.0 and later now fully support using only TLS 1.2 for communications with Azure. This article provides information about how to force your Azure AD Connect server to use only TLS 1.2.

> [!NOTE]
> All versions of Windows Server that are supported for Azure AD Connect V2.0 already default to TLS 1.2. If TLS 1.2 is not enabled on your server you will need to enable this before you can deploy Azure AD Connect V2.0.

## Update the registry
In order to force the Azure AD Connect server to only use TLS 1.2, the registry of the Windows server must be updated. Set the following registry keys on the Azure AD Connect server.

> [!IMPORTANT]
> After you have updated the registry, you must restart the Windows server for the changes to take affect.


### Enable TLS 1.2
- [HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\\.NETFramework\v4.0.30319]
  - "SystemDefaultTlsVersions"=dword:00000001
  - "SchUseStrongCrypto"=dword:0000001
- [HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\\.NETFramework\v4.0.30319]
  - "SystemDefaultTlsVersions"=dword:00000001
  - "SchUseStrongCrypto"=dword:00000001
- [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server]
  - "Enabled"=dword:00000001
- [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server]
  - "DisabledByDefault"=dword:00000000 
- [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client]
  - "Enabled"=dword:00000001
- [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client]
  - "DisabledByDefault"=dword:00000000

### PowerShell cmdlet to check TLS 1.2
You can use the following [Get-ADSyncToolsTls12](reference-connect-adsynctools.md#get-adsynctoolstls12) PowerShell cmdlet to check the current TLS 1.2 settings on your Azure AD Connect server.

```powershell
    Import-module -Name "C:\Program Files\Microsoft Azure Active Directory Connect\Tools\AdSyncTools"
    Get-ADSyncToolsTls12
```

### PowerShell cmdlet to enable TLS 1.2
You can use the following [Set-ADSyncToolsTls12](reference-connect-adsynctools.md#set-adsynctoolstls12) PowerShell cmdlet to enforce TLS 1.2 on your Azure AD Connect server.

```powershell
    Import-module -Name "C:\Program Files\Microsoft Azure Active Directory Connect\Tools\AdSyncTools"
    Set-ADSyncToolsTls12 -Enabled $true
```

### Disable TLS 1.2
- [HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\\.NETFramework\v4.0.30319]
  - "SystemDefaultTlsVersions"=dword:00000000
  - "SchUseStrongCrypto"=dword:0000000
- [HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\\.NETFramework\v4.0.30319]
  - "SystemDefaultTlsVersions"=dword:00000000
  - "SchUseStrongCrypto"=dword:00000000
- [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server]
  - "Enabled"=dword:00000000
- [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server]
  - "DisabledByDefault"=dword:00000001
- [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client]
  - "Enabled"=dword:00000000
- [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client]
  - "DisabledByDefault"=dword:00000001 

### PowerShell script to disable TLS 1.2 (not recommended)
You can use the following [Set-ADSyncToolsTls12](reference-connect-adsynctools.md#set-adsynctoolstls12) PowerShell cmdlet to disable TLS 1.2 on your Azure AD Connect server.

```powershell
    Import-module -Name "C:\Program Files\Microsoft Azure Active Directory Connect\Tools\AdSyncTools"
    Set-ADSyncToolsTls12 -Enabled $false
```

## Next steps
* [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md)
