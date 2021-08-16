---
title: Troubleshoot using the dsregcmd command - Azure Active Directory
description: Using the output from dsregcmd to understand the state of devices in Azure AD

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: troubleshooting
ms.date: 11/21/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: spunukol

ms.collection: M365-identity-device-management
---

# Troubleshooting devices using the dsregcmd command

The dsregcmd /status utility must be run as a domain user account.

## Device state

This section lists the device join state parameters. The table below lists the criteria for the device to be in various join states.

| AzureAdJoined | EnterpriseJoined | DomainJoined | Device state |
| ---	| ---	| ---	| ---	|
| YES | NO | NO | Azure AD Joined |
| NO | NO | YES | Domain Joined |
| YES | NO | YES | Hybrid AD Joined |
| NO | YES | YES | On-premises DRS Joined |

> [!NOTE]
> Workplace Join (Azure AD registered) state is displayed in the "User State" section

- **AzureAdJoined:** Set to "YES" if the device is Joined to Azure AD. "NO" otherwise.
- **EnterpriseJoined:** Set to "YES" if the device is Joined to an on-premises DRS. A device cannot be both EnterpriseJoined and AzureAdJoined.
- **DomainJoined:** Set to "YES" if the device is joined to a domain (AD).
- **DomainName:** Set to the name of the domain if the device is joined to a domain.

### Sample device state output

```
+----------------------------------------------------------------------+
| Device State                                                         |
+----------------------------------------------------------------------+
             AzureAdJoined : YES
          EnterpriseJoined : NO
              DomainJoined : YES
                DomainName : HYBRIDADFS
+----------------------------------------------------------------------+
```

## Device details

Displayed only when the device is Azure AD joined or hybrid Azure AD joined (not Azure AD registered). This section lists device identifying details stored in Azure AD.

- **DeviceId:** Unique ID of the device in the Azure AD tenant
- **Thumbprint:** Thumbprint of the device certificate
- **DeviceCertificateValidity:** Validity of the device certificate
- **KeyContainerId:** -	ContainerId of the device private key associated with the device certificate
- **KeyProvider:** KeyProvider (Hardware/Software) used to store the device private key.
- **TpmProtected:** "YES" if the device private key is stored in a Hardware TPM.

> [!NOTE]
> **DeviceAuthStatus** field was added in **Windows 10 May 2021 Update (version 21H1)**.

- **DeviceAuthStatus:** Performs a check to determine device's health in Azure AD.  
"SUCCESS" if the device is present and Enabled in Azure AD.  
"FAILED. Device is either disabled or deleted" if the device is either disabled or deleted, [More Info](faq.yml#why-do-my-users-see-an-error-message-saying--your-organization-has-deleted-the-device--or--your-organization-has-disabled-the-device--on-their-windows-10-devices).  
"FAILED. ERROR" if the test was unable to run. This test requires network connectivity to Azure AD.  

### Sample device details output

```
+----------------------------------------------------------------------+
| Device Details                                                       |
+----------------------------------------------------------------------+

                  DeviceId : e92325d0-xxxx-xxxx-xxxx-94ae875dxxxx
                Thumbprint : D293213EF327483560EED8410CAE36BB67208179
 DeviceCertificateValidity : [ 2019-01-11 21:02:50.000 UTC -- 2029-01-11 21:32:50.000 UTC ]
            KeyContainerId : 13e68a58-xxxx-xxxx-xxxx-a20a2411xxxx
               KeyProvider : Microsoft Software Key Storage Provider
              TpmProtected : NO
          DeviceAuthStatus : SUCCESS
+----------------------------------------------------------------------+
```

## Tenant details

Displayed only when the device is Azure AD joined or hybrid Azure AD joined (not Azure AD registered). This section lists the common tenant details when a device is joined to Azure AD.

> [!NOTE]
> If the MDM URLs in this section are empty, it indicates that the MDM was either not configured or current user is not in scope of MDM enrollment. Check the Mobility settings in Azure AD to review your MDM configuration.

> [!NOTE]
> Even if you see MDM URLs this does not mean that the device is managed by an MDM. The information is displayed if the tenant has MDM configuration for auto-enrollment even if the device itself is not managed.

### Sample tenant details output

```
+----------------------------------------------------------------------+
| Tenant Details                                                       |
+----------------------------------------------------------------------+

                TenantName : HybridADFS
                  TenantId : 96fa76d0-xxxx-xxxx-xxxx-eb60cc22xxxx
                       Idp : login.windows.net
               AuthCodeUrl : https://login.microsoftonline.com/96fa76d0-xxxx-xxxx-xxxx-eb60cc22xxxx/oauth2/authorize
            AccessTokenUrl : https://login.microsoftonline.com/96fa76d0-xxxx-xxxx-xxxx-eb60cc22xxxx/oauth2/token
                    MdmUrl : https://enrollment.manage-beta.microsoft.com/EnrollmentServer/Discovery.svc
                 MdmTouUrl : https://portal.manage-beta.microsoft.com/TermsOfUse.aspx
          MdmComplianceUrl : https://portal.manage-beta.microsoft.com/?portalAction=Compliance
               SettingsUrl : eyJVxxxxIjpbImh0dHBzOi8va2FpbGFuaS5vbmUubWljcm9zb2Z0LmNvbS8iLCJodHRwczovL2thaWxhbmkxLm9uZS5taWNyb3NvZnQuY29tLyxxxx==
            JoinSrvVersion : 1.0
                JoinSrvUrl : https://enterpriseregistration.windows.net/EnrollmentServer/device/
                 JoinSrvId : urn:ms-drs:enterpriseregistration.windows.net
             KeySrvVersion : 1.0
                 KeySrvUrl : https://enterpriseregistration.windows.net/EnrollmentServer/key/
                  KeySrvId : urn:ms-drs:enterpriseregistration.windows.net
        WebAuthNSrvVersion : 1.0
            WebAuthNSrvUrl : https://enterpriseregistration.windows.net/webauthn/96fa76d0-xxxx-xxxx-xxxx-eb60cc22xxxx/
             WebAuthNSrvId : urn:ms-drs:enterpriseregistration.windows.net
    DeviceManagementSrvVer : 1.0
    DeviceManagementSrvUrl : https://enterpriseregistration.windows.net/manage/96fa76d0-xxxx-xxxx-xxxx-eb60cc22xxxx/
     DeviceManagementSrvId : urn:ms-drs:enterpriseregistration.windows.net
+----------------------------------------------------------------------+
```

## User state

This section lists the status of various attributes for the user currently logged into the device.

> [!NOTE]
> The command must run in a user context to retrieve valid status.

- **NgcSet:** Set to "YES" if a Windows Hello key is set for the current logged on user.
- **NgcKeyId:** ID of the Windows Hello key if one is set for the current logged on user.
- **CanReset:** Denotes if the Windows Hello key can be reset by the user.
- **Possible values:** DestructiveOnly, NonDestructiveOnly, DestructiveAndNonDestructive, or Unknown if error.
- **WorkplaceJoined:** Set to "YES" if Azure AD registered accounts have been added to the device in the current NTUSER context.
- **WamDefaultSet:** Set to "YES" if a WAM default WebAccount is created for the logged in user. This field could display an error if dsregcmd /status is run from an elevated command prompt.
- **WamDefaultAuthority:** Set to "organizations" for Azure AD.
- **WamDefaultId:** Always "https://login.microsoft.com" for Azure AD.
- **WamDefaultGUID:** The WAM provider's (Azure AD/Microsoft account) GUID for the default WAM WebAccount.

### Sample user state output

```
+----------------------------------------------------------------------+
| User State                                                           |
+----------------------------------------------------------------------+

                    NgcSet : YES
                  NgcKeyId : {FA0DB076-A5D7-4844-82D8-50A2FB42EC7B}
                  CanReset : DestructiveAndNonDestructive
           WorkplaceJoined : NO
             WamDefaultSet : YES
       WamDefaultAuthority : organizations
              WamDefaultId : https://login.microsoft.com
            WamDefaultGUID : { B16898C6-A148-4967-9171-64D755DA8520 } (AzureAd)

+----------------------------------------------------------------------+
```

## SSO state

This section can be ignored for Azure AD registered devices.

> [!NOTE]
> The command must run in a user context to retrieve valid status for that user.

- **AzureAdPrt:** Set to "YES" if a PRT is present on the device for the logged-on user.
- **AzureAdPrtUpdateTime:** Set to the time in UTC when the PRT was last updated.
- **AzureAdPrtExpiryTime:** Set to the time in UTC when the PRT is going to expire if it is not renewed.
- **AzureAdPrtAuthority:** Azure AD authority URL
- **EnterprisePrt:** Set to "YES" if the device has PRT from on-premises ADFS. For hybrid Azure AD joined devices the device could have PRT from both Azure AD and on-premises AD simultaneously. On-premises joined devices will only have an Enterprise PRT.
- **EnterprisePrtUpdateTime:** Set to the time in UTC when the Enterprise PRT was last updated.
- **EnterprisePrtExpiryTime:** Set to the time in UTC when the PRT is going to expire if it is not renewed.
- **EnterprisePrtAuthority:** ADFS authority URL

>[!NOTE]
> The following PRT diagnostics fields were added in **Windows 10 May 2021 Update (version 21H1)**

>[!NOTE]
> Diagnostic info displayed under **AzureAdPrt** field are for AzureAD PRT acquisition/refresh and diagnostic info displayed under **EnterprisePrt** and for Enterprise PRT acquisition/refresh respectively.

>[!NOTE]
>Diagnostic is info is displayed only if the acquisition/refresh failure happened after the the last successful PRT update time (AzureAdPrtUpdateTime/EnterprisePrtUpdateTime).  
>On a shared device this diagnostic info could be form a different user's logon attempt.

- **AcquirePrtDiagnostics:** Set to "PRESENT" if acquire PRT diagnostic info is present in the logs.  
This field is skipped if no diagnostics info is available.
- **Previous Prt Attempt:** Local time in UTC at which the failed PRT attempt occurred.  
- **Attempt Status:** Client error code returned (HRESULT).
- **User Identity:** UPN of the user for whom the PRT attempt happened.
- **Credential Type:** Credential used to acquire/refresh PRT. Common credential types are Password and NGC (Windows Hello).
- **Correlation ID:** Correlation ID sent by the server for the failed PRT attempt.
- **Endpoint URI:** Last endpoint accessed before the failure.
- **HTTP Method:** HTTP method used to access the endpoint.
- **HTTP Error:** WinHttp transport error code. WinHttp errors can be found [here](/windows/win32/winhttp/error-messages).
- **HTTP Status:** HTTP status returned by the endpoint.
- **Server Error Code:** Error code from server.  
- **Server Error Description:** Error message from server.
- **RefreshPrtDiagnostics:** Set to "PRESENT" if acquire PRT diagnostic info is present in the logs.  
This field is skipped if no diagnostics info is available.
The diagnostic info fields are same as **AcquirePrtDiagnostics**


### Sample SSO state output

```
+----------------------------------------------------------------------+
| SSO State                                                            |
+----------------------------------------------------------------------+

                AzureAdPrt : NO
       AzureAdPrtAuthority : https://login.microsoftonline.com/96fa76d0-xxxx-xxxx-xxxx-eb60cc22xxxx
     AcquirePrtDiagnostics : PRESENT
      Previous Prt Attempt : 2020-07-18 20:10:33.789 UTC
            Attempt Status : 0xc000006d
             User Identity : john@contoso.com
           Credential Type : Password
            Correlation ID : 63648321-fc5c-46eb-996e-ed1f3ba7740f
              Endpoint URI : https://login.microsoftonline.com/96fa76d0-xxxx-xxxx-xxxx-eb60cc22xxxx/oauth2/token/
               HTTP Method : POST
                HTTP Error : 0x0
               HTTP status : 400
         Server Error Code : invalid_grant
  Server Error Description : AADSTS50126: Error validating credentials due to invalid username or password.
             EnterprisePrt : YES
   EnterprisePrtUpdateTime : 2019-01-24 19:15:33.000 UTC
   EnterprisePrtExpiryTime : 2019-02-07 19:15:33.000 UTC
    EnterprisePrtAuthority : https://fs.hybridadfs.nttest.microsoft.com:443/adfs

+----------------------------------------------------------------------+
```

## Diagnostic data

### Pre-join diagnostics

This section is displayed only if the device is domain joined and is unable to hybrid Azure AD join.

This section performs various tests to help diagnose join failures. This section also includes the details of the previous (?). This information includes the error phase, the error code, the server request ID, server response http status, server response error message.

- **User Context:** The context in which the diagnostics are run. Possible values: SYSTEM, UN-ELEVATED User, ELEVATED User.

   > [!NOTE]
   > Since the actual join is performed in SYSTEM context, running the diagnostics in SYSTEM context is closest to the actual join scenario. To run diagnostics in SYSTEM context, the dsregcmd /status command must be run from an elevated command prompt.

- **Client Time:** The system time in UTC.
- **AD Connectivity Test:** Test performs a connectivity test to the domain controller. Error in this test will likely result in Join errors in pre-check phase.
- **AD Configuration Test:** Test reads and verifies whether the SCP object is configured properly in the on-premises AD forest. Errors in this test would likely result in Join errors in the discover phase with the error code 0x801c001d.
- **DRS Discovery Test:** Test gets the DRS endpoints from discovery metadata endpoint and performs a user realm request. Errors in this test would likely result in Join errors in the discover phase.
- **DRS Connectivity Test:** Test performs basic connectivity test to the DRS endpoint.
- **Token acquisition Test:** Test tries to get an Azure AD authentication token if the user tenant is federated. Errors in this test would likely result in Join errors in the auth phase. If auth fails sync join will be attempted as fallback, unless fallback is explicitly disabled with the below registry key settings.

```
Keyname: Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\CDJ
Value: FallbackToSyncJoin
Type:  REG_DWORD
Value: 0x0 -> Disabled
Value: 0x1 -> Enabled
Default (No Key): Enabled
```

- **Fallback to Sync-Join:** Set to "Enabled" if the above registry key, to prevent the fallback to sync join with auth failures, is NOT present. This option is available from Windows 10 1803 and later.
- **Previous Registration:** Time the previous Join attempt occurred. Only failed Join attempts are logged.
- **Error Phase:** The stage of the join in which it was aborted. Possible values are pre-check, discover, auth, join.
- **Client ErrorCode:** Client error code returned (HRESULT).
- **Server ErrorCode:** Server error code if a request was sent to the server and server responded back with an error code.
- **Server Message:** Server message returned along with the error code.
- **Https Status:** Http status returned by the server.
- **Request ID:** The client requestId sent to the server. Useful to correlate with server-side logs.

### Sample pre-join diagnostics output

The following example shows diagnostics test failing with a discovery error.

```
+----------------------------------------------------------------------+
| Diagnostic Data                                                      |
+----------------------------------------------------------------------+

     Diagnostics Reference : www.microsoft.com/aadjerrors
              User Context : SYSTEM
               Client Time : 2019-01-31 09:25:31.000 UTC
      AD Connectivity Test : PASS
     AD Configuration Test : PASS
        DRS Discovery Test : FAIL [0x801c0021/0x801c000c]
     DRS Connectivity Test : SKIPPED
    Token acquisition Test : SKIPPED
     Fallback to Sync-Join : ENABLED

     Previous Registration : 2019-01-31 09:23:30.000 UTC
               Error Phase : discover
          Client ErrorCode : 0x801c0021

+----------------------------------------------------------------------+
```

The following example shows diagnostics tests are passing but the registration attempt failed with a directory error, which is expected for sync join. Once the Azure AD Connect synchronization job completes, the device will be able to join.

```
+----------------------------------------------------------------------+
| Diagnostic Data                                                      |
+----------------------------------------------------------------------+

     Diagnostics Reference : www.microsoft.com/aadjerrors
              User Context : SYSTEM
               Client Time : 2019-01-31 09:16:50.000 UTC
      AD Connectivity Test : PASS
     AD Configuration Test : PASS
        DRS Discovery Test : PASS
     DRS Connectivity Test : PASS
    Token acquisition Test : PASS
     Fallback to Sync-Join : ENABLED

     Previous Registration : 2019-01-31 09:16:43.000 UTC
         Registration Type : sync
               Error Phase : join
          Client ErrorCode : 0x801c03f2
          Server ErrorCode : DirectoryError
            Server Message : The device object by the given id (e92325d0-7ac4-4714-88a1-94ae875d5245) is not found.
              Https Status : 400
                Request Id : 6bff0bd9-820b-484b-ab20-2a4f7b76c58e

+----------------------------------------------------------------------+
```

### Post-join diagnostics

This section displays the output of sanity checks performed on a device joined to the cloud.

- **AadRecoveryEnabled:** If "YES", the keys stored in the device are not usable and the device is marked for recovery. The next sign-in will trigger the recovery flow and re-register the device.
- **KeySignTest:** If "PASSED" the device keys are in good health. If KeySignTest fails, the device will usually be marked for recovery. The next sign-in will trigger the recovery flow and re-register the device. For hybrid Azure AD joined devices the recovery is silent. While Azure AD joined or Azure AD registered, devices will prompt for user authentication to recover and re-register the device if necessary. **The KeySignTest requires elevated privileges.**

#### Sample post-join diagnostics output

```
+----------------------------------------------------------------------+
| Diagnostic Data                                                      |
+----------------------------------------------------------------------+

         AadRecoveryEnabled: NO
               KeySignTest : PASSED
+----------------------------------------------------------------------+
```

## NGC prerequisite check

This section performs the prerequisite checks for the provisioning of Windows Hello for Business (WHFB).

> [!NOTE]
> You may not see NGC prerequisite check details in dsregcmd /status if the user already successfully configured WHFB.

- **IsDeviceJoined:** Set to "YES" if the device is joined to Azure AD.
- **IsUserAzureAD:** Set to "YES" if the logged in user is present in Azure AD.
- **PolicyEnabled:** Set to "YES" if the WHFB policy is enabled on the device.
- **PostLogonEnabled:** Set to "YES" if WHFB enrollment is triggered natively by the platform. If it's set to "NO", it indicates that Windows Hello for Business enrollment is triggered by a custom mechanism
- **DeviceEligible:** Set to "YES" if the device meets the hardware requirement for enrolling with WHFB.
- **SessionIsNotRemote:** Set to "YES" if the current user is logged in directly to the device and not remotely.
- **CertEnrollment:** Specific to WHFB Certificate Trust deployment, indicating the certificate enrollment authority for WHFB. Set to "enrollment authority" if source of WHFB policy is Group Policy, "mobile device management" if source is MDM. "none" otherwise
- **AdfsRefreshToken:** Specific to WHFB Certificate Trust deployment. Only present if CertEnrollment is "enrollment authority". Indicates if the device has an enterprise PRT for the user.
- **AdfsRaIsReady:** Specific to WHFB Certificate Trust deployment.  Only present if CertEnrollment is "enrollment authority". Set to "YES" if ADFS indicated in discovery metadata that it supports WHFB *and* if logon certificate template is available.
- **LogonCertTemplateReady:** Specific to WHFB Certificate Trust deployment. Only present if CertEnrollment is "enrollment authority". Set to "YES" if state of logon certificate template is valid and helps troubleshoot ADFS RA.
- **PreReqResult:** Provides result of all WHFB prerequisite evaluation. Set to "Will Provision" if WHFB enrollment would be launched as a post-logon task when user signs in next time.

### Sample NGC prerequisite check output

```
+----------------------------------------------------------------------+
| Ngc Prerequisite Check                                               |
+----------------------------------------------------------------------+

            IsDeviceJoined : YES
             IsUserAzureAD : YES
             PolicyEnabled : YES
          PostLogonEnabled : YES
            DeviceEligible : YES
        SessionIsNotRemote : YES
            CertEnrollment : enrollment authority
          AdfsRefreshToken : YES
             AdfsRaIsReady : YES
    LogonCertTemplateReady : YES ( StateReady )
              PreReqResult : WillProvision
+----------------------------------------------------------------------+
```

## Next steps

- [The Microsoft Error Lookup Tool](/windows/win32/debug/system-error-code-lookup-tool)
