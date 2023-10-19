---
title: Troubleshoot Microsoft Entra hybrid joined devices
description: This article helps you troubleshoot Microsoft Entra hybrid joined Windows 10 and Windows Server 2016 devices.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: troubleshooting
ms.date: 08/29/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: jairoc

#Customer intent: As an IT admin, I want to fix issues with my Microsoft Entra hybrid joined devices so that my users can use this feature.

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---
# Troubleshoot Microsoft Entra hybrid joined devices

This article provides troubleshooting guidance to help you resolve potential issues with devices that are running Windows 10 or newer and Windows Server 2016 or newer.

Microsoft Entra hybrid join supports the Windows 10 November 2015 update and later.

To troubleshoot other Windows clients, see [Troubleshoot Microsoft Entra hybrid joined down-level devices](troubleshoot-hybrid-join-windows-legacy.md).

This article assumes that you have [configured Microsoft Entra hybrid joined devices](hybrid-join-plan.md) to support the following scenarios:

- Device-based Conditional Access
- [Enterprise state roaming](./enterprise-state-roaming-enable.md)
- [Windows Hello for Business](/windows/security/identity-protection/hello-for-business/hello-identity-verification)


> [!NOTE] 
> To troubleshoot the common device registration issues, use [Device Registration Troubleshooter Tool](/samples/azure-samples/dsregtool/dsregtool/).


## Troubleshoot join failures

### Step 1: Retrieve the join status

1. Open a Command Prompt window as an administrator.
1. Type `dsregcmd /status`.

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

Review the fields in the following table, and make sure that they have the expected values:

| Field | Expected value | Description |
| --- | --- | --- |
| DomainJoined | YES | This field indicates whether the device is joined to an on-premises Active Directory. <br><br>If the value is *NO*, the device can't do Microsoft Entra hybrid join. |
| WorkplaceJoined | NO | This field indicates whether the device is registered with Microsoft Entra ID as a personal device (marked as *Workplace Joined*). This value should be *NO* for a domain-joined computer that's also Microsoft Entra hybrid joined. <br><br>If the value is *YES*, a work or school account was added before the completion of the Microsoft Entra hybrid join. In this case, the account is ignored when you're using Windows 10 version 1607 or later. |
| AzureAdJoined | YES | This field indicates whether the device is joined. The value will be *YES* if the device is either a Microsoft Entra joined device or a Microsoft Entra hybrid joined device. <br><br>If the value is *NO*, the join to Microsoft Entra ID hasn't finished yet. |
|  |  |

Continue to the next steps for further troubleshooting.

### Step 3: Find the phase in which the join failed, and the error code

**For Windows 10 version 1803 or later**

Look for the "Previous Registration" subsection in the "Diagnostic Data" section of the join status output. This section is displayed only if the device is domain-joined and unable to Microsoft Entra hybrid join.

The "Error Phase" field denotes the phase of the join failure, and "Client ErrorCode" denotes the error code of the join operation.

```
+----------------------------------------------------------------------+
     Previous Registration : 2019-01-31 09:16:43.000 UTC
         Registration Type : sync
               Error Phase : join
          Client ErrorCode : 0x801c03f2
          Server ErrorCode : DirectoryError
            Server Message : The device object by the given id (e92325d0-xxxx-xxxx-xxxx-94ae875d5245) isn't found.
              Https Status : 400
                Request Id : 6bff0bd9-820b-484b-ab20-2a4f7b76c58e
+----------------------------------------------------------------------+
```

**For earlier Windows 10 versions**

Use Event Viewer logs to locate the phase and error code for the join failures.

1. In Event Viewer, open the **User Device Registration** event logs. They're stored under **Applications and Services Log** > **Microsoft** > **Windows** > **User Device Registration**.
1. Look for events with the following event IDs: 304, 305, and 307.

:::image type="content" source="./media/troubleshoot-hybrid-join-windows-current/1.png" alt-text="Screenshot of Event Viewer, with event ID 304 selected, its information displayed, and its error code and phase highlighted." border="false":::

:::image type="content" source="./media/troubleshoot-hybrid-join-windows-current/2.png" alt-text="Screenshot of Event Viewer, with event ID 305 selected, its information displayed, and its error code highlighted." border="false":::

### Step 4: Check for possible causes and resolutions

#### Pre-check phase

Possible reasons for failure:

- The device has no line of sight to the domain controller.
   - The device must be on the organization's internal network or on a virtual private network with a network line of sight to an on-premises Active Directory domain controller.

#### Discover phase

Possible reasons for failure:

-  The service connection point object is misconfigured or can't be read from the domain controller.
   - A valid service connection point object is required in the AD forest, to which the device belongs, that points to a verified domain name in Microsoft Entra ID.
   - For more information, see the "Configure a service connection point" section of [Tutorial: Configure Microsoft Entra hybrid join for federated domains](./how-to-hybrid-join.md).
- Failure to connect to and fetch the discovery metadata from the discovery endpoint.
   - The device should be able to access `https://enterpriseregistration.windows.net`, in the system context, to discover the registration and authorization endpoints.
   - If the on-premises environment requires an outbound proxy, the IT admin must ensure that the computer account of the device can discover and silently authenticate to the outbound proxy.
- Failure to connect to the user realm endpoint and do realm discovery (Windows 10 version 1809 and later only).
   - The device should be able to access `https://login.microsoftonline.com`, in the system context, to do realm discovery for the verified domain and determine the domain type (managed or federated).
   - If the on-premises environment requires an outbound proxy, the IT admin must ensure that the system context on the device can discover and silently authenticate to the outbound proxy.

**Common error codes:**

| Error code | Reason | Resolution |
| --- | --- | --- |
| **DSREG_AUTOJOIN_ADCONFIG_READ_FAILED** (0x801c001d/-2145648611) | Unable to read the service connection point (SCP) object and get the Microsoft Entra tenant information. | Refer to the [Configure a service connection point](hybrid-join-manual.md#configure-a-service-connection-point) section. |
| **DSREG_AUTOJOIN_DISC_FAILED** (0x801c0021/-2145648607) | Generic discovery failure. Failed to get the discovery metadata from the data replication service (DRS). | To investigate further, find the sub-error in the next sections. |
| **DSREG_AUTOJOIN_DISC_WAIT_TIMEOUT**  (0x801c001f/-2145648609) | Operation timed out while performing discovery. | Ensure that `https://enterpriseregistration.windows.net` is accessible in the system context. For more information, see the [Network connectivity requirements](./how-to-hybrid-join.md#prerequisites) section. |
| **DSREG_AUTOJOIN_USERREALM_DISCOVERY_FAILED** (0x801c003d/-2145648579) | Generic realm discovery failure. Failed to determine domain type (managed/federated) from STS. | To investigate further, find the sub-error in the next sections. |
| | |

**Common sub-error codes:**

To find the sub-error code for the discovery error code, use one of the following methods.

##### Windows 10 version 1803 or later

Look for "DRS Discovery Test" in the "Diagnostic Data" section of the join status output. This section is displayed only if the device is domain-joined and unable to Microsoft Entra hybrid join.

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

##### Earlier Windows 10 versions

Use Event Viewer logs to look for the phase and error code for the join failures.

1. In Event Viewer, open the **User Device Registration** event logs. They're stored under **Applications and Services Log** > **Microsoft** > **Windows** > **User Device Registration**.
1. Look for event ID 201.

:::image type="content" source="./media/troubleshoot-hybrid-join-windows-current/5.png" alt-text="Screenshot of Event Viewer, with event ID 201 selected, its information displayed, and its error code highlighted." border="false":::

**Network errors**:

| Error code | Reason | Resolution |
| --- | --- | --- |
| **WININET_E_CANNOT_CONNECT** (0x80072efd/-2147012867) | Connection with the server couldn't be established. | Ensure network connectivity to the required Microsoft resources. For more information, see [Network connectivity requirements](./how-to-hybrid-join.md#prerequisites). |
| **WININET_E_TIMEOUT** (0x80072ee2/-2147012894) | General network timeout. | Ensure network connectivity to the required Microsoft resources. For more information, see [Network connectivity requirements](./how-to-hybrid-join.md#prerequisites). |
| **WININET_E_DECODING_FAILED** (0x80072f8f/-2147012721) | Network stack was unable to decode the response from the server. | Ensure that the network proxy isn't interfering and modifying the server response. |
| | |


**HTTP errors**:

| Error code | Reason | Resolution |
| --- | --- | --- |
| **DSREG_DISCOVERY_TENANT_NOT_FOUND** (0x801c003a/-2145648582) | The service connection point object is configured with the wrong tenant ID, or no active subscriptions were found in the tenant. | Ensure that the service connection point object is configured with the correct Microsoft Entra tenant ID and active subscriptions or that the service is present in the tenant. |
| **DSREG_SERVER_BUSY** (0x801c0025/-2145648603) | HTTP 503 from DRS server. | The server is currently unavailable. Future join attempts will likely succeed after the server is back online. |
| | |


**Other errors**:

| Error code | Reason | Resolution |
| --- | --- | --- |
| **E_INVALIDDATA** (0x8007000d/-2147024883) | The server response JSON couldn't be parsed, likely because the proxy is returning an HTTP 200 with an HTML authorization page. | If the on-premises environment requires an outbound proxy, the IT admin must ensure that the system context on the device can discover and silently authenticate to the outbound proxy. |
| | |


#### Authentication phase

This content applies only to federated domain accounts.

Reasons for failure:

- Unable to get an access token silently for the DRS resource.
   - Windows 10 and Windows 11 devices acquire the authentication token from the Federation Service by using integrated Windows authentication to an active WS-Trust endpoint. For more information, see [Federation Service configuration](hybrid-join-manual.md#set-up-issuance-of-claims).

**Common error codes**:

Use Event Viewer logs to locate the error code, sub-error code, server error code, and server error message.

1. In Event Viewer, open the **User Device Registration** event logs. They're stored under **Applications and Services Log** > **Microsoft** > **Windows** > **User Device Registration**.
1. Look for event ID 305.

:::image type="content" source="./media/troubleshoot-hybrid-join-windows-current/3.png" alt-text="Screenshot of Event Viewer, with event ID 305 selected, its information displayed, and the ADAL error codes and status highlighted." border="false":::

**Configuration errors**:

| Error code | Reason | Resolution |
| --- | --- | --- |
| **ERROR_ADAL_PROTOCOL_NOT_SUPPORTED** (0xcaa90017/-894894057) | The Azure AD Authentication Library (ADAL) authentication protocol isn't WS-Trust. | The on-premises identity provider must support WS-Trust. |
| **ERROR_ADAL_FAILED_TO_PARSE_XML** (0xcaa9002c/-894894036) | The on-premises Federation Service didn't return an XML response. | Ensure that the Metadata Exchange (MEX) endpoint is returning a valid XML. Ensure that the proxy isn't interfering and returning non-xml responses. |
| **ERROR_ADAL_COULDNOT_DISCOVER_USERNAME_PASSWORD_ENDPOINT** (0xcaa90023/-894894045) | Couldn't discover an endpoint for username/password authentication. | Check the on-premises identity provider settings. Ensure that the WS-Trust endpoints are enabled and that the MEX response contains these correct endpoints. |
| | |


**Network errors**:

| Error code | Reason | Resolution |
| --- | --- | --- |
| **ERROR_ADAL_INTERNET_TIMEOUT** (0xcaa82ee2/-894947614) | General network timeout. | Ensure that `https://login.microsoftonline.com` is accessible in the system context. Ensure that the on-premises identity provider is accessible in the system context. For more information, see [Network connectivity requirements](./how-to-hybrid-join.md#prerequisites). |
| **ERROR_ADAL_INTERNET_CONNECTION_ABORTED** (0xcaa82efe/-894947586) | Connection with the authorization endpoint was aborted. | Retry the join after a while, or try joining from another stable network location. |
| **ERROR_ADAL_INTERNET_SECURE_FAILURE** (0xcaa82f8f/-894947441) | The Transport Layer Security (TLS) certificate (previously known as the Secure Sockets Layer [SSL] certificate) sent by the server couldn't be validated. | Check the client time skew. Retry the join after a while, or try joining from another stable network location. |
| **ERROR_ADAL_INTERNET_CANNOT_CONNECT** (0xcaa82efd/-894947587) | The attempt to connect to `https://login.microsoftonline.com` failed. | Check the network connection to `https://login.microsoftonline.com`. |
| | |


**Other errors**:

| Error code | Reason | Resolution |
| --- | --- | --- |
| **ERROR_ADAL_SERVER_ERROR_INVALID_GRANT** (0xcaa20003/-895352829) | The SAML token from the on-premises identity provider wasn't accepted by Microsoft Entra ID. | Check the Federation Server settings. Look for the server error code in the authentication logs. |
| **ERROR_ADAL_WSTRUST_REQUEST_SECURITYTOKEN_FAILED** (0xcaa90014/-894894060) | The Server WS-Trust response reported a fault exception, and it failed to get assertion. | Check the Federation Server settings. Look for the server error code in the authentication logs. |
| **ERROR_ADAL_WSTRUST_TOKEN_REQUEST_FAIL** (0xcaa90006/-894894074) | Received an error when trying to get access token from the token endpoint. | Look for the underlying error in the ADAL log. |
| **ERROR_ADAL_OPERATION_PENDING** (0xcaa1002d/-895418323) | General ADAL failure. | Look for the sub-error code or server error code from the authentication logs. |
| | |


#### Join phase

Reasons for failure:

Look for the registration type and error code from the following tables, depending on the Windows 10 version you're using.

#### Windows 10 version 1803 or later

Look for the "Previous Registration" subsection in the "Diagnostic Data" section of the join status output. This section is displayed only if the device is domain-joined and is unable to Microsoft Entra hybrid join.

The "Registration Type" field denotes the type of join that's done.

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

#### Earlier Windows 10 versions

Use Event Viewer logs to locate the phase and error code for the join failures.

1. In Event Viewer, open the **User Device Registration** event logs. They're stored under **Applications and Services Log** > **Microsoft** > **Windows** > **User Device Registration**.
1. Look for event ID 204.

:::image type="content" source="./media/troubleshoot-hybrid-join-windows-current/4.png" alt-text="Screenshot of Event Viewer, with event ID 204 selected and its error code, H T T P status, and message highlighted." border="false":::

**HTTP errors returned from DRS server**:

| Error code | Reason | Resolution |
| --- | --- | --- |
| **DSREG_E_DIRECTORY_FAILURE** (0x801c03f2/-2145647630) | Received an error response from DRS with ErrorCode: "DirectoryError". | Refer to the server error code for possible reasons and resolutions. |
| **DSREG_E_DEVICE_AUTHENTICATION_ERROR** (0x801c0002/-2145648638) | Received an error response from DRS with ErrorCode: "AuthenticationError" and ErrorSubCode is *not* "DeviceNotFound". | Refer to the server error code for possible reasons and resolutions. |
| **DSREG_E_DEVICE_INTERNALSERVICE_ERROR** (0x801c0006/-2145648634) | Received an error response from DRS with ErrorCode: "DirectoryError". | Refer to the server error code for possible reasons and resolutions. |
| | |


**TPM errors**:

| Error code | Reason | Resolution |
| --- | --- | --- |
| **NTE_BAD_KEYSET** (0x80090016/-2146893802) | The Trusted Platform Module (TPM) operation failed or was invalid. | The failure likely results from a bad sysprep image. Ensure that the machine from which the sysprep image was created isn't Microsoft Entra joined, Microsoft Entra hybrid joined, or Microsoft Entra registered. |
| **TPM_E_PCP_INTERNAL_ERROR** (0x80290407/-2144795641) | Generic TPM error. | Disable TPM on devices with this error. Windows 10 versions 1809 and later automatically detect TPM failures and complete Microsoft Entra hybrid join without using the TPM. |
| **TPM_E_NOTFIPS** (0x80280036/-2144862154) | TPM in FIPS mode isn't currently supported. | Disable TPM on devices with this error. Windows 10 version 1809 automatically detects TPM failures and completes the Microsoft Entra hybrid join without using the TPM. |
| **NTE_AUTHENTICATION_IGNORED** (0x80090031/-2146893775) | TPM is locked out. | Transient error. Wait for the cool-down period. The join attempt should succeed after a while. For more information, see [TPM fundamentals](/windows/security/hardware-security/tpm/tpm-fundamentals#anti-hammering). |
| | |


**Network errors**:

| Error code | Reason | Resolution |
| --- | --- | --- |
| **WININET_E_TIMEOUT** (0x80072ee2/-2147012894) | General network time-out trying to register the device at DRS. | Check network connectivity to `https://enterpriseregistration.windows.net`. |
| **WININET_E_NAME_NOT_RESOLVED** (0x80072ee7/-2147012889) | The server name or address couldn't be resolved. | Check network connectivity to `https://enterpriseregistration.windows.net`. |
| **WININET_E_CONNECTION_ABORTED** (0x80072efe/-2147012866) | The connection with the server was terminated abnormally. | Retry the join after a while, or try joining from another stable network location. |
| | |


**Other errors**:

| Error code | Reason | Resolution |
| --- | --- | --- |
| **DSREG_AUTOJOIN_ADCONFIG_READ_FAILED** (0x801c001d/-2145648611) | Event ID 220 is present in User Device Registration event logs. Windows can't access the computer object in Active Directory. A Windows error code might be included in the event. Error codes ERROR_NO_SUCH_LOGON_SESSION (1312) and ERROR_NO_SUCH_USER (1317) are related to replication issues in on-premises Active Directory. | Troubleshoot replication issues in Active Directory. These replication issues might be transient, and they might go away after a while. |
| | |


**Federated join server errors**:

| Server error code | Server error message | Possible reasons | Resolution |
| --- | --- | --- | --- |
| DirectoryError | Your request is throttled temporarily. Please try after 300 seconds. | This error is expected, possibly because multiple registration requests were made in quick succession. | Retry the join after the cool-down period |
| | |

**Sync-join server errors**:

| Server error code | Server error message | Possible reasons | Resolution |
| --- | --- | --- | --- |
| DirectoryError | AADSTS90002: Tenant `UUID` not found. This error might happen if there are no active subscriptions for the tenant. Check with your subscription administrator. | The tenant ID in the service connection point object is incorrect. | Ensure that the service connection point object is configured with the correct Microsoft Entra tenant ID and active subscriptions or that the service is present in the tenant. |
| DirectoryError | The device object by the given ID isn't found. | This error is expected for sync-join. The device object hasn't synced from AD to Microsoft Entra ID | Wait for the Microsoft Entra Connect Sync to finish, and the next join attempt after sync completion will resolve the issue. |
| AuthenticationError | The verification of the target computer's SID | The certificate on the Microsoft Entra device doesn't match the certificate that's used to sign in the blob during the sync-join. This error ordinarily means that sync hasn't finished yet. |  Wait for the Microsoft Entra Connect Sync to finish, and the next join attempt after the sync completion will resolve the issue. |

### Step 5: Collect logs and contact Microsoft Support

1. [Download the *Auth.zip* file](https://cesdiagtools.blob.core.windows.net/windows/Auth.zip).

1. Extract the files to a folder, such as *c:\temp*, and then go to the folder.
1. From an elevated Azure PowerShell session, run `.\start-auth.ps1 -v -accepteula`.
1. Select **Switch Account** to toggle to another session with the problem user.
1. Reproduce the issue.
1. Select **Switch Account** to toggle back to the admin session that's running the tracing.
1. From the elevated PowerShell session, run `.\stop-auth.ps1`.
1. Zip (compress) and send the folder *Authlogs* from the folder where the scripts were executed.
    
## Troubleshoot post-join authentication issues

### Step 1: Retrieve the PRT status by using `dsregcmd /status`

1. Open a Command Prompt window. 
   > [!NOTE] 
   > To get the Primary Refresh Token (PRT) status, open the Command Prompt window in the context of the logged-in user. 

1. Run `dsregcmd /status`. 

   The "SSO state" section provides the current PRT status. 

   If the AzureAdPrt field is set to *NO*, there was an error acquiring the PRT status from Microsoft Entra ID. 

1. If the AzureAdPrtUpdateTime is more than four hours, there's likely an issue with refreshing the PRT. Lock and unlock the device to force the PRT refresh, and then check to see whether the time has been updated.

```
+----------------------------------------------------------------------+
| SSO State                                                            |
+----------------------------------------------------------------------+

                AzureAdPrt : YES
      AzureAdPrtUpdateTime : 2020-07-12 22:57:53.000 UTC
      AzureAdPrtExpiryTime : 2019-07-26 22:58:35.000 UTC
       AzureAdPrtAuthority : https://login.microsoftonline.com/96fa76d0-xxxx-xxxx-xxxx-eb60cc22xxxx
             EnterprisePrt : YES
   EnterprisePrtUpdateTime : 2020-07-12 22:57:54.000 UTC
   EnterprisePrtExpiryTime : 2020-07-26 22:57:54.000 UTC
    EnterprisePrtAuthority : https://corp.hybridadfs.contoso.com:443/adfs

+----------------------------------------------------------------------+
```

### Step 2: Find the error code 

**From the `dsregcmd` output**

> [!NOTE]
>  The output is available from the Windows 10 May 2021 update (version 21H1).

The "Attempt Status" field under the "AzureAdPrt" field will provide the status of the previous PRT attempt, along with other required debug information. For earlier Windows versions, extract the information from the [Microsoft Entra analytics and operational logs](/troubleshoot/windows-server/networking/diagnostic-logging-troubleshoot-workplace-join-issues#enable-workplace-join-debug-logging-by-using-event-viewer).

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
```

**From the Microsoft Entra analytics and operational logs**

Use Event Viewer to look for the log entries that are logged by the Microsoft Entra CloudAP plug-in during PRT acquisition. 

1. In Event Viewer, open the Microsoft Entra Operational event logs. They're stored under **Applications and Services Log** > **Microsoft** > **Windows** > **Microsoft Entra ID**. 

   > [!NOTE]
   > The CloudAP plug-in logs error events in the operational logs, and it logs the info events in the analytics logs. The analytics and operational log events are both required to troubleshoot issues. 

1. Event 1006 in the analytics logs denotes the start of the PRT acquisition flow, and event 1007 in the analytics logs denotes the end of the PRT acquisition flow. All events in the Microsoft Entra logs (analytics and operational) that are logged between events 1006 and 1007 were logged as part of the PRT acquisition flow.

1. Event 1007 logs the final error code.

:::image type="content" source="./media/troubleshoot-hybrid-join-windows-current/event-viewer-prt-acquire.png" alt-text="Screenshot of Event Viewer, with event IDs 1006 and 1007 selected and the final error code highlighted." border="false":::

### Step 3: Troubleshoot further, based on the found error code

| Error code | Reason | Resolution |
| --- | --- | --- |
| **STATUS_LOGON_FAILURE** (-1073741715/ 0xc000006d)<br>**STATUS_WRONG_PASSWORD** (-1073741718/ 0xc000006a) | <li>The device is unable to connect to the Microsoft Entra authentication service.<li>Received an error response (HTTP 400) from the Microsoft Entra authentication service or WS-Trust endpoint.<br>**Note**: WS-Trust is required for federated authentication. | <li>If the on-premises environment requires an outbound proxy, the IT admin must ensure that the computer account of the device can discover and silently authenticate to the outbound proxy.<li>Events 1081 and 1088 (Microsoft Entra operational logs) would contain the server error code for errors originating from the Microsoft Entra authentication service and error description for errors originating from the WS-Trust endpoint. Common server error codes and their resolutions are listed in the next section. The first instance of event 1022 (Microsoft Entra analytics logs), preceding events 1081 or 1088, will contain the URL that's being accessed. |
| **STATUS_REQUEST_NOT_ACCEPTED** (-1073741616/ 0xc00000d0) | Received an error response (HTTP 400) from the Microsoft Entra authentication service or WS-Trust endpoint.<br>**Note**: WS-Trust is required for federated authentication. | Events 1081 and 1088 (Microsoft Entra operational logs) would contain the server error code and error description for errors originating from Microsoft Entra authentication service and WS-Trust endpoint, respectively. Common server error codes and their resolutions are listed in the next section. The first instance of event 1022 (Microsoft Entra analytics logs), preceding events 1081 or 1088, will contain the URL that's being accessed. |
| **STATUS_NETWORK_UNREACHABLE** (-1073741252/ 0xc000023c)<br>**STATUS_BAD_NETWORK_PATH** (-1073741634/ 0xc00000be)<br>**STATUS_UNEXPECTED_NETWORK_ERROR** (-1073741628/ 0xc00000c4) | <li>Received an error response (HTTP > 400) from the Microsoft Entra authentication service or WS-Trust endpoint.<br>**Note**: WS-Trust is required for federated authentication.<li>Network connectivity issue to a required endpoint. | <li>For server errors, events 1081 and 1088 (Microsoft Entra operational logs) would contain the error code from the Microsoft Entra authentication service and the error description from the WS-Trust endpoint. Common server error codes and their resolutions are listed in the next section.<li>For connectivity issues, event 1022 (Microsoft Entra analytics logs) will contain the URL that's being accessed, and event 1084 (Microsoft Entra operational logs) will contain the sub-error code from the network stack. |
| **STATUS_NO_SUCH_LOGON_SESSION**    (-1073741729/ 0xc000005f) | User realm discovery failed because the Microsoft Entra authentication service was unable to find the user's domain. | <li>The domain of the user's UPN must be added as a custom domain in Microsoft Entra ID. Event 1144 (Microsoft Entra analytics logs) will contain the UPN provided.<li>If the on-premises domain name is non-routable (jdoe@contoso.local), configure an Alternate Login ID (AltID). References: [Prerequisites](hybrid-join-plan.md); [Configure Alternate Login ID](/windows-server/identity/ad-fs/operations/configuring-alternate-login-id). |
| **AAD_CLOUDAP_E_OAUTH_USERNAME_IS_MALFORMED**   (-1073445812/ 0xc004844c) | The user's UPN isn't in the expected format.<br>**Notes**:<li>For Microsoft Entra joined devices, the UPN is the text that's entered by the user in the LoginUI. <li>For Microsoft Entra hybrid joined devices, the UPN is returned from the domain controller during the login process. | <li>User's UPN should be in the internet-style login name, based on the internet standard [RFC 822](https://www.ietf.org/rfc/rfc0822.txt). Event 1144 (Microsoft Entra analytics logs) will contain the UPN provided.<li>For hybrid-joined devices, ensure that the domain controller is configured to return the UPN in the correct format. In the domain controller, `whoami /upn` should display the configured UPN.<li>If the on-premises domain name is non-routable (jdoe@contoso.local), configure Alternate Login ID (AltID). References: [Prerequisites](hybrid-join-plan.md); [Configure Alternate Login ID](/windows-server/identity/ad-fs/operations/configuring-alternate-login-id). |
| **AAD_CLOUDAP_E_OAUTH_USER_SID_IS_EMPTY** (-1073445822/ 0xc0048442) | The user SID is missing in the ID token that's returned by the Microsoft Entra authentication service. | Ensure that the network proxy isn't interfering with and modifying the server response. |
| **AAD_CLOUDAP_E_WSTRUST_SAML_TOKENS_ARE_EMPTY** (--1073445695/ 0xc00484c1) | Received an error from the WS-Trust endpoint.<br>**Note**: WS-Trust is required for federated authentication. | <li>Ensure that the network proxy isn't interfering with and modifying the WS-Trust response.<li>Event 1088 (Microsoft Entra operational logs) would contain the server error code and error description from the WS-Trust endpoint. Common server error codes and their resolutions are listed in the next section. |
| **AAD_CLOUDAP_E_HTTP_PASSWORD_URI_IS_EMPTY** (-1073445749/ 0xc004848b) | The MEX endpoint is incorrectly configured. The MEX response doesn't contain any password URLs. | <li>Ensure that the network proxy isn't interfering with and modifying the server response.<li>Fix the MEX configuration to return valid URLs in response. |
| **AAD_CLOUDAP_E_HTTP_CERTIFICATE_URI_IS_EMPTY** (-1073445748/ 0xc004848C) | The MEX endpoint is incorrectly configured. The MEX response doesn't contain any certificate endpoint URLs. | <li>Ensure that the network proxy isn't interfering with and modifying the server response.<li>Fix the MEX configuration in the identity provider to return valid certificate URLs in response. |
| **WC_E_DTDPROHIBITED** (-1072894385/ 0xc00cee4f) | The XML response, from the WS-Trust endpoint, included a Document Type Definition (DTD). A DTD isn't expected in XML responses, and parsing the response will fail if a DTD is included.<br>**Note**: WS-Trust is required for federated authentication. | <li>Fix the configuration in the identity provider to avoid sending a DTD in the XML response.<li>Event 1022 (Microsoft Entra analytics logs) will contain the URL that's being accessed that's returning an XML response with a DTD. |
| | |


**Common server error codes:**

| Error code | Reason | Resolution |
| --- | --- | --- |
| **AADSTS50155: Device authentication failed** | <li>Microsoft Entra ID is unable to authenticate the device to issue a PRT.<li>Confirm that the device hasn't been deleted or disabled. For more information about this issue, see [Microsoft Entra device management FAQ](faq.yml#why-do-my-users-see-an-error-message-saying--your-organization-has-deleted-the-device--or--your-organization-has-disabled-the-device--on-their-windows-10-11-devices). | Follow the instructions for this issue in [Microsoft Entra device management FAQ](faq.yml#i-disabled-or-deleted-my-device--but-the-local-state-on-the-device-says-it-s-still-registered--what-should-i-do) to re-register the device based on the device join type. |
| **AADSTS50034: The user account `Account` does not exist in the `tenant id` directory** | Microsoft Entra ID is unable to find the user account in the tenant. | <li>Ensure that the user is typing the correct UPN.<li>Ensure that the on-premises user account is being synced with Microsoft Entra ID.<li>Event 1144 (Microsoft Entra analytics logs) will contain the UPN provided. |
| **AADSTS50126: Error validating credentials due to invalid username or password.** | <li>The username and password entered by the user in the Windows LoginUI are incorrect.<li>If the tenant has password hash sync enabled, the device is hybrid-joined, and the user just changed the password, it's likely that the new password hasn't synced with Microsoft Entra ID. | To acquire a fresh PRT with the new credentials, wait for the Microsoft Entra password sync to finish. |
| | |


**Common network error codes**:

| Error code | Reason | Resolution |
| --- | --- | --- |
| **ERROR_WINHTTP_TIMEOUT** (12002)<br>**ERROR_WINHTTP_NAME_NOT_RESOLVED** (12007)<br>**ERROR_WINHTTP_CANNOT_CONNECT** (12029)<br>**ERROR_WINHTTP_CONNECTION_ERROR** (12030) | Common general network-related issues. | <li>Events 1022 (Microsoft Entra analytics logs) and 1084 (Microsoft Entra operational logs) will contain the URL that's being accessed.<li>If the on-premises environment requires an outbound proxy, the IT admin must ensure that the computer account of the device can discover and silently authenticate to the outbound proxy.<br><br>Get more [network error codes](/windows/win32/winhttp/error-messages). |
| | |


### Step 4: Collect logs

**Regular logs**

1. Go to https://aka.ms/icesdptool to automatically download a *.cab* file containing the Diagnostic tool.
1. Run the tool and repro your scenario.
1. For Fiddler traces, accept the certificate requests that pop up.
1. The wizard will prompt you for a password to safeguard your trace files. Provide a password.
1. Finally, open the folder where all the collected logs are stored, such as *%LOCALAPPDATA%\ElevatedDiagnostics\numbers*.
1. Contact Support with contents of the latest *.cab* file.

**Network traces**

> [!NOTE]
> When you're collecting network traces, it's important to *not* use Fiddler during repro.

1. Run `netsh trace start scenario=internetClient_dbg capture=yes persistent=yes`.
1. Lock and unlock the device. For hybrid-joined devices, wait a minute or more to allow the PRT acquisition task to finish.
1. Run `netsh trace stop`.
1. Share the *nettrace.cab* file with Support.

---

## Known issues
- If you're connected to a mobile hotspot or an external Wi-Fi network and you go to **Settings** > **Accounts** > **Access Work or School**, Microsoft Entra hybrid joined devices might show two different accounts, one for Microsoft Entra ID and one for on-premises AD. This UI issue doesn't affect functionality.

## Next steps

- [Troubleshoot devices by using the `dsregcmd` command](troubleshoot-device-dsregcmd.md).
- Go to the [Microsoft Error Lookup Tool](/windows/win32/debug/system-error-code-lookup-tool).
