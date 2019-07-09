---
title: Troubleshooting hybrid Azure Active Directory joined Windows 10 and Windows Server 2016 devices| Microsoft Docs
description: Troubleshooting hybrid Azure Active Directory joined Windows 10 and Windows Server 2016 devices.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: troubleshooting
ms.date: 06/28/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: jairoc

#Customer intent: As an IT admin, I want to fix issues with my hybrid Azure AD joined devices so that I can my users can use this feature.

ms.collection: M365-identity-device-management
---
# Troubleshooting hybrid Azure Active Directory joined Windows 10 and Windows Server 2016 devices 

This article is applicable to the following clients:

-	Windows 10
-	Windows Server 2016

For other Windows clients, see [Troubleshooting hybrid Azure Active Directory joined down-level devices](troubleshoot-hybrid-join-windows-legacy.md).

This article assumes that you have [configured hybrid Azure Active Directory joined devices](hybrid-azuread-join-plan.md) to support the following scenarios:

- Device-based Conditional Access
- [Enterprise roaming of settings](../active-directory-windows-enterprise-state-roaming-overview.md)
- [Windows Hello for Business](../active-directory-azureadjoin-passport-deployment.md)

This document provides troubleshooting guidance on how to resolve potential issues. 

For Windows 10 and Windows Server 2016, hybrid Azure Active Directory join supports the Windows 10 November 2015 Update and above. We recommend using the Anniversary update.

## Step 1: Retrieve the join status 

**To retrieve the join status:**

1. Open the command prompt as an administrator

2. Type **dsregcmd /status**

```
+----------------------------------------------------------------------+
| Device State                                                         |
+----------------------------------------------------------------------+

    AzureAdJoined: YES
 EnterpriseJoined: NO
         DeviceId: 5820fbe9-60c8-43b0-bb11-44aee233e4e7
       Thumbprint: B753A6679CE720451921302CA873794D94C6204A
   KeyContainerId: bae6a60b-1d2f-4d2a-a298-33385f6d05e9
      KeyProvider: Microsoft Platform Crypto Provider
     TpmProtected: YES
     KeySignTest: : MUST Run elevated to test.
              Idp: login.windows.net
         TenantId: 72b988bf-86f1-41af-91ab-2d7cd011db47
       TenantName: Contoso
      AuthCodeUrl: https://login.microsoftonline.com/msitsupp.microsoft.com/oauth2/authorize
   AccessTokenUrl: https://login.microsoftonline.com/msitsupp.microsoft.com/oauth2/token
           MdmUrl: https://enrollment.manage-beta.microsoft.com/EnrollmentServer/Discovery.svc
        MdmTouUrl: https://portal.manage-beta.microsoft.com/TermsOfUse.aspx
  dmComplianceUrl: https://portal.manage-beta.microsoft.com/?portalAction=Compliance
      SettingsUrl: eyJVcmlzIjpbImh0dHBzOi8va2FpbGFuaS5vbmUubWljcm9zb2Z0LmNvbS8iLCJodHRwczovL2thaWxhbmkxLm9uZS5taWNyb3NvZnQuY29tLyJdfQ==
   JoinSrvVersion: 1.0
       JoinSrvUrl: https://enterpriseregistration.windows.net/EnrollmentServer/device/
        JoinSrvId: urn:ms-drs:enterpriseregistration.windows.net
    KeySrvVersion: 1.0
        KeySrvUrl: https://enterpriseregistration.windows.net/EnrollmentServer/key/
         KeySrvId: urn:ms-drs:enterpriseregistration.windows.net
     DomainJoined: YES
       DomainName: CONTOSO

+----------------------------------------------------------------------+
| User State                                                           |
+----------------------------------------------------------------------+

             NgcSet: YES
           NgcKeyId: {C7A9AEDC-780E-4FDA-B200-1AE15561A46B}
    WorkplaceJoined: NO
      WamDefaultSet: YES
WamDefaultAuthority: organizations
       WamDefaultId: https://login.microsoft.com
     WamDefaultGUID: {B16898C6-A148-4967-9171-64D755DA8520} (AzureAd)
         AzureAdPrt: YES
```

## Step 2: Evaluate the join status 

Review the following fields and make sure that they have the expected values:

### AzureAdJoined : YES  

This field indicates whether the device is joined with Azure AD. 
If the value is **NO**, the join to Azure AD has not completed yet. 

**Possible causes:**

- Authentication of the computer for a join failed.
- There is an HTTP proxy in the organization that cannot be discovered by the computer
- The computer cannot reach Azure AD to authenticate or Azure DRS for registration
- The computer may not be on the organization’s internal network or on VPN with direct line of sight to an on-premises AD domain controller.
- If the computer has a TPM, it can be in a bad state.
- There might be a misconfiguration in the services noted in the document earlier that you will need to verify again. Common examples are:
   - Your federation server does not have WS-Trust endpoints enabled
   - Your federation server does not allow inbound authentication from computers in your network using Integrated Windows Authentication.
   - There is no Service Connection Point object that points to your verified domain name in Azure AD in the AD forest where the computer belongs to

---

### DomainJoined : YES  

This field indicates whether the device is joined to an on-premises Active Directory or not. If the value is **NO**, the device cannot perform a hybrid Azure AD join.  

---

### WorkplaceJoined : NO  

This field indicates whether the device is registered with Azure AD as a personal device (marked as *Workplace Joined*). This value should be **NO** for a domain-joined computer that is also hybrid Azure AD joined. If the value is **YES**, a work or school account was added prior to the completion of the hybrid Azure AD join. In this case, the account is ignored when using the Anniversary Update version of Windows 10 (1607).

---

### WamDefaultSet : YES and AzureADPrt : YES
  
These fields indicate whether the user has successfully authenticated to Azure AD when signing in to the device. 
If the values are **NO**, it could be due:

- Bad storage key (STK) in TPM associated with the device upon registration (check the KeySignTest while running elevated).
- Alternate Login ID
- HTTP Proxy not found

## Next steps

For questions, see the [device management FAQ](faq.md) 
