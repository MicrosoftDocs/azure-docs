---
title: Troubleshooting hybrid Azure Active Directory joined devices
description: Troubleshooting hybrid Azure Active Directory joined Windows 10 and Windows Server 2016 devices.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: troubleshooting
ms.date: 11/21/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: jairoc

#Customer intent: As an IT admin, I want to fix issues with my hybrid Azure AD joined devices so that my users can use this feature.

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---
# Troubleshooting hybrid Azure Active Directory joined devices

The content of this article is applicable to devices running Windows 10 or Windows Server 2016.

For other Windows clients, see the article [Troubleshooting hybrid Azure Active Directory joined down-level devices](troubleshoot-hybrid-join-windows-legacy.md).

This article assumes that you have [configured hybrid Azure Active Directory joined devices](hybrid-azuread-join-plan.md) to support the following scenarios:

- Device-based Conditional Access
- [Enterprise roaming of settings](../active-directory-windows-enterprise-state-roaming-overview.md)
- [Windows Hello for Business](../active-directory-azureadjoin-passport-deployment.md)

This document provides troubleshooting guidance to resolve potential issues.

For Windows 10 and Windows Server 2016, hybrid Azure Active Directory join supports the Windows 10 November 2015 Update and above.

## Troubleshoot join failures

### Step 1: Retrieve the join status

**To retrieve the join status:**

1. Open a command prompt as an administrator
2. Type `dsregcmd /status`

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
         TenantId: 72b988bf-xxxx-xxxx-xxxx-2d7cd011xxxx
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

### Step 2: Evaluate the join status

Review the following fields and make sure that they have the expected values:

#### DomainJoined : YES

This field indicates whether the device is joined to an on-premises Active Directory or not. If the value is **NO**, the device cannot perform a hybrid Azure AD join.

#### WorkplaceJoined : NO

This field indicates whether the device is registered with Azure AD as a personal device (marked as *Workplace Joined*). This value should be **NO** for a domain-joined computer that is also hybrid Azure AD joined. If the value is **YES**, a work or school account was added prior to the completion of the hybrid Azure AD join. In this case, the account is ignored when using the Anniversary Update version of Windows 10 (1607).

#### AzureAdJoined : YES

This field indicates whether the device is joined. The value will be **YES** if the device is either an Azure AD joined device or a hybrid Azure AD joined device.
If the value is **NO**, the join to Azure AD has not completed yet.

Proceed to next steps for further troubleshooting.

### Step 3: Find the phase in which join failed and the errorcode

#### Windows 10 1803 and above

Look for 'Previous Registration' subsection in the 'Diagnostic Data' section of the join status output. This section is displayed only if the device is domain joined and is unable to hybrid Azure AD join.
The 'Error Phase' field denotes the phase of the join failure while 'Client ErrorCode' denotes the error code of the Join operation.

```
+----------------------------------------------------------------------+
     Previous Registration : 2019-01-31 09:16:43.000 UTC
         Registration Type : sync
               Error Phase : join
          Client ErrorCode : 0x801c03f2
          Server ErrorCode : DirectoryError
            Server Message : The device object by the given id (e92325d0-xxxx-xxxx-xxxx-94ae875d5245) is not found.
              Https Status : 400
                Request Id : 6bff0bd9-820b-484b-ab20-2a4f7b76c58e
+----------------------------------------------------------------------+
```

#### Older Windows 10 versions

Use Event Viewer logs to locate the phase and error code for the join failures.

1. Open the **User Device Registration** event logs in event viewer. Located under **Applications and Services Log** > **Microsoft** > **Windows** > **User Device Registration**
2. Look for events with the following eventIDs 304, 305, 307.

![Failure Log Event](./media/troubleshoot-hybrid-join-windows-current/1.png)

![Failure Log Event](./media/troubleshoot-hybrid-join-windows-current/2.png)

### Step 4: Check for possible causes and resolutions from the lists below

#### Pre-check phase

Possible reasons for failure:

- Device has no line of sight to the Domain controller.
   - The device must be on the organization’s internal network or on VPN with network line of sight to an on-premises Active Directory (AD) domain controller.

#### Discover phase

Possible reasons for failure:

- Service Connection Point (SCP) object misconfigured/unable to read SCP object from DC.
   - A valid SCP object is required in the AD forest, to which the device belongs, that points to a verified domain name in Azure AD.
   - Details can be found in the section [Configure a Service Connection Point](hybrid-azuread-join-federated-domains.md#configure-hybrid-azure-ad-join).
- Failure to connect and fetch the discovery metadata from the discovery endpoint.
   - The device should be able to access `https://enterpriseregistration.windows.net`, in the SYSTEM context, to discover the registration and authorization endpoints.
   - If the on-premises environment requires an outbound proxy, the IT admin must ensure that the computer account of the device is able to discover and silently authenticate to the outbound proxy.
- Failure to connect to user realm endpoint and perform realm discovery. (Windows 10 version 1809 and later only)
   - The device should be able to access `https://login.microsoftonline.com`, in the SYSTEM context, to perform realm discovery for the verified domain and determine the domain type (managed/federated).
   - If the on-premises environment requires an outbound proxy, the IT admin must ensure that the SYSTEM context on the device is able to discover and silently authenticate to the outbound proxy.

**Common error codes:**

- **DSREG_AUTOJOIN_ADCONFIG_READ_FAILED** (0x801c001d/-2145648611)
   - Reason: Unable to read the SCP object and get the Azure AD tenant information.
   - Resolution: Refer to the section [Configure a Service Connection Point](hybrid-azuread-join-federated-domains.md#configure-hybrid-azure-ad-join).
- **DSREG_AUTOJOIN_DISC_FAILED** (0x801c0021/-2145648607)
   - Reason: Generic Discovery failure. Failed to get the discovery metadata from DRS.
   - Resolution: Find the suberror below to investigate further.
- **DSREG_AUTOJOIN_DISC_WAIT_TIMEOUT**  (0x801c001f/-2145648609)
   - Reason: Operation timed out while performing Discovery.
   - Resolution: Ensure that `https://enterpriseregistration.windows.net` is accessible in the SYSTEM context. For more information, see the section [Network connectivity requirements](hybrid-azuread-join-managed-domains.md#prerequisites).
- **DSREG_AUTOJOIN_USERREALM_DISCOVERY_FAILED** (0x801c0021/-2145648611)
   - Reason: Generic Realm Discovery failure. Failed to determine domain type (managed/federated) from STS.
   - Resolution: Find the suberror below to investigate further.

**Common suberror codes:**

To find the suberror code for the discovery error code, use one of the following methods.

##### Windows 10 1803 and above

Look for 'DRS Discovery Test' in the 'Diagnostic Data' section of the join status output. This section is displayed only if the device is domain joined and is unable to hybrid Azure AD join.

```
+----------------------------------------------------------------------+
| Diagnostic Data                                                      |
+----------------------------------------------------------------------+

     Diagnostics Reference : www.microsoft.com/aadjerrors
              User Context : UN-ELEVATED User
               Client Time : 2019-06-05 08:25:29.000 UTC
      AD Connectivity Test : PASS
     AD Configuration Test : PASS
        DRS Discovery Test : FAIL [0x801c0021/0x80072ee2]
     DRS Connectivity Test : SKIPPED
    Token acquisition Test : SKIPPED
     Fallback to Sync-Join : ENABLED

+----------------------------------------------------------------------+
```

##### Older Windows 10 versions

Use Event Viewer logs to locate the phase and errorcode for the join failures.

1. Open the **User Device Registration** event logs in event viewer. Located under **Applications and Services Log** > **Microsoft** > **Windows** > **User Device Registration**
2. Look for events with the following eventIDs 201

![Failure Log Event](./media/troubleshoot-hybrid-join-windows-current/5.png)

###### Network errors

- **WININET_E_CANNOT_CONNECT** (0x80072efd/-2147012867)
   - Reason: Connection with the server could not be established
   - Resolution: Ensure network connectivity to the required Microsoft resources. For more information, see [Network connectivity requirements](hybrid-azuread-join-managed-domains.md#prerequisites).
- **WININET_E_TIMEOUT** (0x80072ee2/-2147012894)
   - Reason: General network timeout.
   - Resolution: Ensure network connectivity to the required Microsoft resources. For more information, see [Network connectivity requirements](hybrid-azuread-join-managed-domains.md#prerequisites).
- **WININET_E_DECODING_FAILED** (0x80072f8f/-2147012721)
   - Reason: Network stack was unable to decode the response from the server.
   - Resolution: Ensure that network proxy is not interfering and modifying the server response.

###### HTTP errors

- **DSREG_DISCOVERY_TENANT_NOT_FOUND** (0x801c003a/-2145648582)
   - Reason: SCP object configured with wrong tenant ID. Or no active subscriptions were found in the tenant.
   - Resolution: Ensure SCP object is configured with the correct Azure AD tenant ID and active subscriptions or present in the tenant.
- **DSREG_SERVER_BUSY** (0x801c0025/-2145648603)
   - Reason: HTTP 503 from DRS server.
   - Resolution: Server is currently unavailable. future join attempts will likely succeed once server is back online.

###### Other errors

- **E_INVALIDDATA** (0x8007000d/-2147024883)
   - Reason: Server response JSON couldn't be parsed. Likely due to proxy returning HTTP 200 with an HTML auth page.
   - Resolution: If the on-premises environment requires an outbound proxy, the IT admin must ensure that the SYSTEM context on the device is able to discover and silently authenticate to the outbound proxy.

#### Authentication phase

Applicable only for federated domain accounts.

Reasons for failure:

- Unable to get an Access token silently for DRS resource.
   - Windows 10 devices acquire auth token from the federation service using Integrated Windows Authentication to an active WS-Trust endpoint. Details: [Federation Service Configuration](hybrid-azuread-join-manual.md#set-up-issuance-of-claims)

**Common error codes:**

Use Event Viewer logs to locate the error code, suberror code, server error code, and server error message.

1. Open the **User Device Registration** event logs in event viewer. Located under **Applications and Services Log** > **Microsoft** > **Windows** > **User Device Registration**
2. Look for events with the following eventID 305

![Failure Log Event](./media/troubleshoot-hybrid-join-windows-current/3.png)

##### Configuration errors

- **ERROR_ADAL_PROTOCOL_NOT_SUPPORTED** (0xcaa90017/-894894057)
   - Reason: Authentication protocol is not WS-Trust.
   - Resolution: The on-premises identity provider must support WS-Trust
- **ERROR_ADAL_FAILED_TO_PARSE_XML** (0xcaa9002c/-894894036)
   - Reason: On-premises federation service did not return an XML response.
   - Resolution: Ensure MEX endpoint is returning a valid XML. Ensure proxy is not interfering and returning non-xml responses.
- **ERROR_ADAL_COULDNOT_DISCOVER_USERNAME_PASSWORD_ENDPOINT** (0xcaa90023/-894894045)
   - Reason: Could not discover endpoint for username/password authentication.
   - Resolution: Check the on-premises identity provider settings. Ensure that the WS-Trust endpoints are enabled and ensure the MEX response contains these correct endpoints.

##### Network errors

- **ERROR_ADAL_INTERNET_TIMEOUT** (0xcaa82ee2/-894947614)
   - Reason: General network timeout.
   - Resolution: Ensure that `https://login.microsoftonline.com` is accessible in the SYSTEM context. Ensure the on-premises identity provider is accessible in the SYSTEM context. For more information, see [Network connectivity requirements](hybrid-azuread-join-managed-domains.md#prerequisites).
- **ERROR_ADAL_INTERNET_CONNECTION_ABORTED** (0xcaa82efe/-894947586)
   - Reason: Connection with the auth endpoint was aborted.
   - Resolution: Retry after sometime or try joining from an alternate stable network location.
- **ERROR_ADAL_INTERNET_SECURE_FAILURE** (0xcaa82f8f/-894947441)
   - Reason: The Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL), certificate sent by the server could not be validated.
   - Resolution: Check the client time skew. Retry after sometime or try joining from an alternate stable network location.
- **ERROR_ADAL_INTERNET_CANNOT_CONNECT** (0xcaa82efd/-894947587)
   - Reason: The attempt to connect to `https://login.microsoftonline.com` failed.
   - Resolution: Check network connection to `https://login.microsoftonline.com`.

##### Other errors

- **ERROR_ADAL_SERVER_ERROR_INVALID_GRANT** (0xcaa20003/-895352829)
   - Reason: SAML token from the on-premises identity provider was not accepted by Azure AD.
   - Resolution: Check the federation server settings. Look for the server error code in the authentication logs.
- **ERROR_ADAL_WSTRUST_REQUEST_SECURITYTOKEN_FAILED** (0xcaa90014/-894894060)
   - Reason: Server WS-Trust response reported fault exception and it failed to get assertion
   - Resolution: Check the federation server settings. Look for the server error code in the authentication logs.
- **ERROR_ADAL_WSTRUST_TOKEN_REQUEST_FAIL** (0xcaa90006/-894894074)
   - Reason: Received an error when trying to get access token from the token endpoint.
   - Resolution: Look for the underlying error in the ADAL log.
- **ERROR_ADAL_OPERATION_PENDING** (0xcaa1002d/-895418323)
   - Reason: General ADAL failure
   - Resolution: Look for the suberror code or server error code from the authentication logs.

#### Join Phase

Reasons for failure:

Find the registration type and look for the error code from the list below.

#### Windows 10 1803 and above

Look for 'Previous Registration' subsection in the 'Diagnostic Data' section of the join status output. This section is displayed only if the device is domain joined and is unable to hybrid Azure AD join.
'Registration Type' field denotes the type of join performed.

```
+----------------------------------------------------------------------+
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

#### Older Windows 10 versions

Use Event Viewer logs to locate the phase and errorcode for the join failures.

1. Open the **User Device Registration** event logs in event viewer. Located under **Applications and Services Log** > **Microsoft** > **Windows** > **User Device Registration**
2. Look for events with the following eventIDs 204

![Failure Log Event](./media/troubleshoot-hybrid-join-windows-current/4.png)

##### HTTP errors returned from DRS server

- **DSREG_E_DIRECTORY_FAILURE** (0x801c03f2/-2145647630)
   - Reason: Received an error response from DRS with ErrorCode: "DirectoryError"
   - Resolution: Refer to the server error code for possible reasons and resolutions.
- **DSREG_E_DEVICE_AUTHENTICATION_ERROR** (0x801c0002/-2145648638)
   - Reason: Received an error response from DRS with ErrorCode: "AuthenticationError" and ErrorSubCode is NOT "DeviceNotFound".
   - Resolution: Refer to the server error code for possible reasons and resolutions.
- **DSREG_E_DEVICE_INTERNALSERVICE_ERROR** (0x801c0006/-2145648634)
   - Reason: Received an error response from DRS with ErrorCode: "DirectoryError"
   - Resolution: Refer to the server error code for possible reasons and resolutions.

##### TPM errors

- **NTE_BAD_KEYSET** (0x80090016/-2146893802)
   - Reason: TPM operation failed or was invalid
   - Resolution: Likely due to a bad sysprep image. Ensure the machine from which the sysprep image was created is not Azure AD joined, hybrid Azure AD joined, or Azure AD registered.
- **TPM_E_PCP_INTERNAL_ERROR** (0x80290407/-2144795641)
   - Reason: Generic TPM error.
   - Resolution: Disable TPM on devices with this error. Windows 10 version 1809 and higher automatically detects TPM failures and completes hybrid Azure AD join without using the TPM.
- **TPM_E_NOTFIPS** (0x80280036/-2144862154)
   - Reason: TPM in FIPS mode not currently supported.
   - Resolution: Disable TPM on devices with this error. Windows 1809 automatically detects TPM failures and completes hybrid Azure AD join without using the TPM.
- **NTE_AUTHENTICATION_IGNORED** (0x80090031/-2146893775)
   - Reason: TPM locked out.
   - Resolution: Transient error. Wait for the cooldown period. Join attempt after some time should succeed. More Information can be found in the article [TPM fundamentals](/windows/security/information-protection/tpm/tpm-fundamentals#anti-hammering)

##### Network Errors

- **WININET_E_TIMEOUT** (0x80072ee2/-2147012894)
   - Reason: General network time out trying to register the device at DRS
   - Resolution: Check network connectivity to `https://enterpriseregistration.windows.net`.
- **WININET_E_NAME_NOT_RESOLVED** (0x80072ee7/-2147012889)
   - Reason: The server name or address could not be resolved.
   - Resolution: Check network connectivity to `https://enterpriseregistration.windows.net`. Ensure DNS resolution for the hostname is accurate in the n/w and on the device.
- **WININET_E_CONNECTION_ABORTED** (0x80072efe/-2147012866)
   - Reason: The connection with the server was terminated abnormally.
   - Resolution: Retry after sometime or try joining from an alternate stable network location.

##### Federated join server Errors

| Server error code | Server error message | Possible reasons | Resolution |
| --- | --- | --- | --- |
| DirectoryError | Your request is throttled temporarily. Please try after 300 seconds. | Expected error. Possibly due to making multiple registration requests in quick succession. | Retry join after the cooldown period |

##### Sync join server Errors

| Server error code | Server error message | Possible reasons | Resolution |
| --- | --- | --- | --- |
| DirectoryError | AADSTS90002: Tenant <UUID> not found. This error may happen if there are no active subscriptions for the tenant. Check with your subscription administrator. | Tenant ID in SCP object is incorrect | Ensure SCP object is configured with the correct Azure AD tenant ID and active subscriptions and present in the tenant. |
| DirectoryError | The device object by the given ID is not found. | Expected error for sync join. The device object has not synced from AD to Azure AD | Wait for the Azure AD Connect sync to complete and the next join attempt after sync completion will resolve the issue |
| AuthenticationError | The verification of the target computer's SID | The certificate on the Azure AD device doesn't match the certificate used to sign the blob during the sync join. This error typically means sync hasn’t completed yet. |  Wait for the Azure AD Connect sync to complete and the next join attempt after sync completion will resolve the issue |

### Step 5: Collect logs and contact Microsoft Support

Download the file Auth.zip from [https://github.com/CSS-Windows/WindowsDiag/tree/master/ADS/AUTH](https://github.com/CSS-Windows/WindowsDiag/tree/master/ADS/AUTH)

1. Unzip the files and rename the included files **start-auth.txt** and **stop-auth.txt** to **start-auth.cmd** and **stop-auth.cmd**.
1. From an elevated command prompt, run **start-auth.cmd**.
1. Use Switch Account to toggle to another session with the problem user.
1. Reproduce the issue.
1. Use Switch Account to toggle back to the admin session running the tracing.
1. From an elevated command prompt, run **stop-auth.cmd**.
1. Zip and send the folder **Authlogs** from the folder where the scripts were executed from.

## Troubleshoot Post-Join issues

### Retrieve the join status

#### WamDefaultSet: YES and AzureADPrt: YES

These fields indicate whether the user has successfully authenticated to Azure AD when signing in to the device.
If the values are **NO**, it could be due:

- Bad storage key in the TPM associated with the device upon registration (check the KeySignTest while running elevated).
- Alternate Login ID
- HTTP Proxy not found

## Known issues
- Under Settings -> Accounts -> Access Work or School, Hybrid Azure AD joined devices may show two different accounts, one for Azure AD and one for on-premises AD, when connected to mobile hotspots or external WiFi networks. This is only a UI issue and does not have any impact on functionality.

## Next steps

Continue [troubleshooting devices using the dsregcmd command](troubleshoot-device-dsregcmd.md)

For questions, see the [device management FAQ](faq.md)
