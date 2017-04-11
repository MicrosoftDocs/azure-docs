---
title: Troubleshooting the auto-registration of Azure AD domain joined computers for Windows 10 and Windows Server 2016| Microsoft Docs
description: Troubleshooting the auto-registration of Azure AD domain joined computers for Windows 10 and Windows Server 2016.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila

ms.assetid: cdc25576-37f2-4afb-a786-f59ba4c284c2
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/07/2017
ms.author: markvi

---
# Troubleshooting auto-registration of domain joined computers to Azure AD – Windows 10 and Windows Server 2016

This topic is applicable to the following clients:

-	Windows 10
-	Windows Server 2016

For other Windows clients, see [Troubleshooting auto-registration of domain joined computers to Azure AD for Windows down-level clients](active-directory-device-registration-troubleshoot-windows-legacy.md).

This topic assumes that you have configured auto-registration of domain-joined devices as outlined in described in [How to configure automatic registration of Windows domain-joined devices with Azure Active Directory](active-directory-device-registration-get-started.md) to support the following scenarios:

- [Device-based conditional access](active-directory-conditional-access-automatic-device-registration-setup.md)

- [Enterprise roaming of settings](active-directory-windows-enterprise-state-roaming-overview.md)

- [Windows Hello for Business](active-directory-azureadjoin-passport-deployment.md)


This document provides troubleshooting guidance on how to resolve potential issues. 

The registration is supported in the Windows 10 November 2015 Update and above.  
We recommend using the Anniversary Update for enabling the scenarios above.

## Step 1: Retrieve the registration status 

**To retrieve the registration status:**

1. Open the command prompt as an administrator.

2. Type **dsregcmd /status**



    +----------------------------------------------------------------------+
    | Device State                                                         |
    +----------------------------------------------------------------------+
    
        AzureAdJoined : YES
     EnterpriseJoined : NO
             DeviceId : 5820fbe9-60c8-43b0-bb11-44aee233e4e7
           Thumbprint : B753A6679CE720451921302CA873794D94C6204A
       KeyContainerId : bae6a60b-1d2f-4d2a-a298-33385f6d05e9
          KeyProvider : Microsoft Platform Crypto Provider
         TpmProtected : YES
         KeySignTest: : MUST Run elevated to test.
                  Idp : login.windows.net
             TenantId : 72b988bf-86f1-41af-91ab-2d7cd011db47
           TenantName : Contoso
          AuthCodeUrl : https://login.microsoftonline.com/msitsupp.microsoft.com/oauth2/authorize
       AccessTokenUrl : https://login.microsoftonline.com/msitsupp.microsoft.com/oauth2/token
               MdmUrl : https://enrollment.manage-beta.microsoft.com/EnrollmentServer/Discovery.svc
            MdmTouUrl : https://portal.manage-beta.microsoft.com/TermsOfUse.aspx
      dmComplianceUrl : https://portal.manage-beta.microsoft.com/?portalAction=Compliance
          SettingsUrl : eyJVcmlzIjpbImh0dHBzOi8va2FpbGFuaS5vbmUubWljcm9zb2Z0LmNvbS8iLCJodHRwczovL2thaWxhbmkxLm9uZS5taWNyb3NvZnQuY29tLyJdfQ==
       JoinSrvVersion : 1.0
           JoinSrvUrl : https://enterpriseregistration.windows.net/EnrollmentServer/device/
            JoinSrvId : urn:ms-drs:enterpriseregistration.windows.net
        KeySrvVersion : 1.0
            KeySrvUrl : https://enterpriseregistration.windows.net/EnrollmentServer/key/
             KeySrvId : urn:ms-drs:enterpriseregistration.windows.net
         DomainJoined : YES
           DomainName : CONTOSO
    
    +----------------------------------------------------------------------+
    | User State                                                           |
    +----------------------------------------------------------------------+
    
                 NgcSet : YES
               NgcKeyId : {C7A9AEDC-780E-4FDA-B200-1AE15561A46B}
        WorkplaceJoined : NO
          WamDefaultSet : YES
    WamDefaultAuthority : organizations
           WamDefaultId : https://login.microsoft.com
         WamDefaultGUID : {B16898C6-A148-4967-9171-64D755DA8520} (AzureAd)
             AzureAdPrt : YES



## Step 2: Evaluate the registration status 

Review the following fields and make sure that they have the expected values:

### AzureAdJoined : YES  

This field shows whether the device is registered with Azure AD. 
If the value shows as ‘NO’, registration has not completed. 

**Possible causes:**

- Authentication of the computer for registration failed.

- There is an HTTP proxy in the organization that cannot be discovered by the computer

- The computer cannot reach Azure AD for authentication or Azure DRS for registration

- The computer may not be on the organization’s internal network or on VPN with direct line of sight to an on-premises AD domain controller.

- If the computer has a TPM, it may be in a bad state.

- There may be a misconfiguration in services noted in the document earlier that you will need to verify again. Common examples are:

    - Your federation server does not have WS-Trust endpoints enabled

    - Your federation server may not allow inbound authentication from computers in your network using Integrated Windows Authentication.

    - There is no Service Connection Point object that points to your verified domain name in Azure AD in the AD forest where the computer belongs to

---

### DomainJoined : YES  

This field shows whether the device is joined to an on-premises Active Directory or not. If the value shows as **NO**, the device cannot auto-register with Azure AD. Check first that the device joins to the on-premises Active Directory before it can register with Azure AD. If you are looking for joining the computer to Azure AD directly, please go to Learn about capabilities of Azure Active Directory Join.

---

### WorkplaceJoined : NO  

This field shows whether the device is registered with Azure AD but as a personal device (marked as ‘Workplace Joined’). If this value should show as ‘NO’ for a domain joined computer registered with Azure AD, however if it shows as YES it means that a work or school account was added prior to the computer completing registration. In this case the account will be ignored if using the Anniversary Update version of Windows 10 (1607 when running the WinVer command in the ‘Run’ window or a command prompt window).

---

### WamDefaultSet : YES and AzureADPrt : YES
  
These fields show that the user has successfully authenticated to Azure AD upon signing in to the device. 
If they show ‘NO’ the following are possible causes:

- Bad storage key (STK) in TPM associated with the device upon registration (check the KeySignTest while running elevated).

- Alternate Login ID

- HTTP Proxy not found

## Next steps

For more information, see the [Automatic device registration FAQ](active-directory-device-registration-faq.md) 