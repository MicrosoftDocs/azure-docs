---
title: Troubleshoot primary refresh token issues on Windows devices
description: Troubleshoot primary refresh token issues during authentication through Azure Active Directory (Azure AD) credentials on Azure AD-joined Windows devices.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: troubleshooting
ms.date: 5/30/2023

ms.author: v-dele
author: DennisLee-DennisLee
editor: v-jsitser
manager: amycolannino
ms.reviewer: azureidcic, gudlapreethi
---
# Troubleshoot primary refresh token issues on Windows devices

This article discusses how to troubleshoot issues that involve the [primary refresh token](/azure/active-directory/devices/concept-primary-refresh-token) (PRT) when you authenticate onto a Microsoft Azure Active Directory (Azure AD)-joined Windows device by using your Azure AD credentials.

On devices that are joined to Microsoft Azure Active Directory (Azure AD) or joined to hybrid Azure AD, the main artifact of authentication is the PRT. You obtain this token by signing in to Windows 10 by using Azure AD credentials on an Azure AD-joined device for the first time. The PRT is cached on that device. For subsequent sign-ins, the cached token is used to let you use the desktop.

Once every four hours, as part of locking and unlocking the device or signing in again to Windows, a background network authentication is tried to refresh the PRT. If there are problems in refreshing the token, the PRT eventually expires. Expiration affects single sign-on (SSO) to Azure AD resources. It also causes sign-in prompts to be shown.

If you suspect that there's a PRT problem, first collect Azure AD logs and follow the steps outlined in the troubleshooting checklist. We recommend that you collect Azure AD logs for any Azure AD client issue first, ideally within a repro session. Complete this process before you contact the PG or file an ICM.

## Troubleshooting checklist

### Step 1: Get the status of the primary refresh token

1. Sign in to Windows under the user account in which you experience PRT issues.

1. On the Windows **Start** menu, search for and select **Command Prompt**.

1. Enter `dsregcmd /status` to run the device registration command ([dsregcmd](./troubleshoot-device-dsregcmd.md)).

1. Locate the [SSO state](./troubleshoot-device-dsregcmd.md#sso-state) section of the device registration command's output. The following text shows an example of this section:

   ```output
   +----------------------------------------------------------------------+
   | SSO State                                                            |
   +----------------------------------------------------------------------+

                   AzureAdPrt : YES
         AzureAdPrtUpdateTime : 2020-07-12 22:57:53.000 UTC
         AzureAdPrtExpiryTime : 2020-07-26 22:58:35.000 UTC
          AzureAdPrtAuthority : https://login.microsoftonline.com/01234567-89ab-cdef-0123-456789abcdef
                EnterprisePrt : YES
      EnterprisePrtUpdateTime : 2020-07-12 22:57:54.000 UTC
      EnterprisePrtExpiryTime : 2020-07-26 22:57:54.000 UTC
       EnterprisePrtAuthority : https://msft.sts.microsoft.com:443/adfs

   +----------------------------------------------------------------------+
   ```

1. Check the value of the `AzureAdPrt` field. If it's set to `NO`, there was an error acquiring the PRT status from Azure AD.

1. Check the value of the `AzureAdPrtUpdateTime` field. If the value of the `AzureAdPrtUpdateTime` field is more than four hours <!-- Is there a missing phrase here? -->, there's probably an issue that's preventing the PRT from refreshing. Lock and unlock the device to force PRT refresh, and then check whether the time is updated.

### Step 2: Get the error code

The next step is to get the error code that causes the PRT error. The quickest way to get the PRT error code is to examine the device registration command output. However, this method requires Windows 10 May 2021 update (version 21H1) or a later version. The other method is to find the error code in Azure AD analytic and operational logs.

#### Method 1: Examine the device registration command output

> [!NOTE]  
> This method is available only if you're using Windows 10 May 2021 update (version 21H1) or a later version of Windows.

To get the PRT error code, run the `dsregcmd` command, and then locate the `SSO State` section. Under the `AzureAdPrt` field, the `Attempt Status` field contains the error code. In the following example, the error code is `0xc000006d`. <!-- The Server Error Description gives an error code name (although it differs from the attempt status) and an error description. Shouldn't we mention that, too? -->

```output
                AzureAdPrt : NO
       AzureAdPrtAuthority : https://login.microsoftonline.com/01234567-89ab-cdef-0123-456789abcdef
     AcquirePrtDiagnostics : PRESENT
      Previous Prt Attempt : 2020-09-18 20:20:09.760 UTC
            Attempt Status : 0xc000006d
             User Identity : user@contoso.com
           Credential Type : Password
            Correlation ID : 12345678-9abc-def0-1234-56789abcdef0
              Endpoint URI : https://login.microsoftonline.com/01234567-89ab-cdef-0123-456789abcdef/oauth2/token
               HTTP Method : POST
                HTTP Error : 0x0
               HTTP status : 400
         Server Error Code : invalid_grant
  Server Error Description : AADSTS50126: Error validating credentials due to invalid username or password.
```

#### Method 2: Use the Event Viewer to examine Azure AD analytic and operational logs

1. On the Windows **Start** menu, search for and select **Event Viewer**.
1. In the **Event Viewer** window, if the console tree isn't showing, select the **Show/Hide Console Tree** icon to make the console tree visible.
1. In the console tree, select **Event Viewer (Local)**. If there aren't child nodes showing underneath that item, double-click your selection to show them.
1. Select the **View** menu. If there isn't a check mark next to **Show Analytic and Debug Logs**, select that menu item to enable that feature.
1. In the console tree, expand **Applications and Services Logs**. Expand **Microsoft**. Expand **Windows**. Expand **AAD**. The **Operational** and **Analytic** child nodes appear. 

   > [!NOTE]  
   > In the Azure AD Cloud Authentication Provider (CloudAP) plug-in, **Error** events are written to the **Operational** event logs, and information events are written to the **Analytic** event logs. You need to examine both the **Operational** and **Analytic** event logs to troubleshoot PRT issues.

1. In the console tree, select the **Analytic** node to view Azure AD-related analytic events.
1. In the list of analytic events, search for Event ID 1006 and 1007. Event ID 1006 denotes the beginning of the PRT acquisition flow, and Event ID 1007 denotes the end of the PRT acquisition flow. All events in the **AAD** logs (both **Analytic** and **Operational**) that occurred between when Event ID 1006 and Event ID 1007 occurred are logged as part of the PRT acquisition flow. The following table shows an example event listing.

   | Level           | Date and Time            | Source  | Event ID | Task Category                  |
   |-----------------|--------------------------|---------|----------|--------------------------------|
   | **Information** | **6/24/2020 3:35:35 AM** | **AAD** | **1006** | **AadCloudAPPlugin Operation** |
   | Information     | 6/24/2020 3:35:35 AM     | AAD     | 1018     | AadCloudAPPlugin Operation     |
   | Information     | 6/24/2020 3:35:35 AM     | AAD     | 1144     | AadCloudAPPlugin Operation     |
   | Information     | 6/24/2020 3:35:35 AM     | AAD     | 1022     | AadCloudAPPlugin Operation     |
   | Error           | 6/24/2020 3:35:35 AM     | AAD     | 1084     | AadCloudAPPlugin Operation     |
   | Error           | 6/24/2020 3:35:35 AM     | AAD     | 1086     | AadCloudAPPlugin Operation     |
   | Error           | 6/24/2020 3:35:35 AM     | AAD     | 1160     | AadCloudAPPlugin Operation     |
   | **Information** | **6/24/2020 3:35:35 AM** | **AAD** | **1007** | **AadCloudAPPlugin Operation** |
   | Information     | 6/24/2020 3:35:35 AM     | AAD     | 1157     | AadCloudAPPlugin Operation     |
   | Information     | 6/24/2020 3:35:35 AM     | AAD     | 1158     | AadCloudAPPlugin Operation     |

1. Double-click the row that has Event ID 1007. The **Event Properties** dialog box for this event appears.
1. In the **General** tab's description box, copy the error code. The error code is a 10-character string that begins with `0x`, followed by an 8-digit hexadecimal number.

### Step 3: Get troubleshooting instructions for certain error codes

#### Status codes ("STATUS_" prefix, codes that begin with "0xc000") <!-- Can probably use a more descriptive name here -->

<details>
<summary>STATUS_LOGON_FAILURE (-1073741715&nbsp;/&nbsp;0xc000006d),<br/>
STATUS_WRONG_PASSWORD (-1073741718&nbsp;/&nbsp;0xc000006a)</summary>

##### Causes

- The device can't connect to the Azure AD authentication service.
- The device received a `400 Bad Request` HTTP error response from one of the following sources:

  - The Azure AD authentication service
  - An endpoint for the [WS-Trust protocol][WS-Trust] (which is required for federated authentication)

##### Solutions

- If the on-premises environment requires an outbound proxy, make sure that the computer account of the device can discover and silently authenticate to the outbound proxy.

- Get the server error code and error description, and then go to the [Common server error codes ("AADSTS" prefix)][server-errors] section to find the cause of that server error code and the solution details.

  In the Azure AD operational logs, Event ID 1081 contains the server error code and error description if the error occurs in the Azure AD authentication service. If the error occurs in a WS-Trust endpoint, the server error code and error description are found in Event ID 1088. In the Azure AD analytic logs, the first instance of Event ID 1022 contains the URL that's being accessed.

  To view Event IDs in the Azure AD operational and analytic logs, refer to the [Method 2: Use the Event Viewer to examine Azure AD analytic and operational logs][view-event-ids] section.
</details>

<details>
<summary>STATUS_REQUEST_NOT_ACCEPTED (-1073741616&nbsp;/&nbsp;0xc00000d0)</summary>

##### Cause

The device received a `400 Bad Request` HTTP error response from one of the following sources:

- The Azure AD authentication service
- An endpoint for the [WS-Trust protocol][WS-Trust] (which is required for federated authentication)

##### Solution

Get the server error code and error description, and then go to the [Common server error codes ("AADSTS" prefix)][server-errors] section to find the cause of that server error code and the solution details.

In the Azure AD operational logs, Event ID 1081 contains the server error code and error description if the error occurs in the Azure AD authentication service. If the error occurs in a WS-Trust endpoint, the server error code and error description are found in Event ID 1088. In the Azure AD analytic logs, the first instance of Event ID 1022 (that precedes operational Event IDs 1081 and 1088) contains the URL that's being accessed.

To view Event IDs in the Azure AD operational and analytic logs, refer to the [Method 2: Use the Event Viewer to examine Azure AD analytic and operational logs][view-event-ids] section.
</details>

<details>
<summary>STATUS_NETWORK_UNREACHABLE (-1073741252&nbsp;/&nbsp;0xc000023c),<br/>
STATUS_BAD_NETWORK_PATH (-1073741634&nbsp;/&nbsp;0xc00000be),<br/>
STATUS_UNEXPECTED_NETWORK_ERROR (-1073741628&nbsp;/&nbsp;0xc00000c4)</summary>

##### Causes

- The device received a `4xx` HTTP error response from one of the following sources:

  - The Azure AD authentication service
  - An endpoint for the [WS-Trust protocol][WS-Trust] (which is required for federated authentication)
- There's a network connectivity issue to a required endpoint.

##### Solutions

- Get the server error code and error description, and then go to the [Common server error codes ("AADSTS" prefix)][server-errors] section to find the cause of that server error code and the solution details.

  In the Azure AD operational logs, Event ID 1081 contains the server error code and error description if the error occurs in the Azure AD authentication service. If the error occurs in a WS-Trust endpoint, the server error code and error description are found in Event ID 1088.

- For a network connectivity issue, get the URL that's being accessed and the suberror code from the network stack. Event ID 1022 in the Azure AD analytic logs contains the URL that's being accessed. Event ID 1084 in the Azure AD operational logs contains the suberror code from the network stack.

To view Event IDs in the Azure AD operational and analytic logs, refer to the [Method 2: Use the Event Viewer to examine Azure AD analytic and operational logs][view-event-ids] section.
</details>

<details>
<summary>STATUS_NO_SUCH_LOGON_SESSION (-1073741729&nbsp;/&nbsp;0xc000005f)</summary>

##### Cause

The user realm discovery failed, because the Azure AD authentication service can't find the user's domain.

##### Solutions

- Add the domain of the user principal name (UPN) of the user as a custom domain in Azure AD. To find the provided UPN, look for Event ID 1144 in the Azure AD analytic logs.

  To view Event IDs in the Azure AD analytic logs, refer to the [Method 2: Use the Event Viewer to examine Azure AD analytic and operational logs][view-event-ids] section.

- If the on-premises domain name can't be routed (for example, if the UPN is something like `jdoe@contoso.local`), [configure the Alternate Login ID][alt-login-id] (AltID). (To view the prerequisites, see [Plan your hybrid Azure Active Directory join implementation][hybrid-azure-ad-join-plan].)
</details>

#### Common CloudAP plug-in error codes ("AAD_CLOUDAP_E_" prefix, codes that begin with "0xc004")

<details>
<summary>AAD_CLOUDAP_E_OAUTH_USERNAME_IS_MALFORMED (-1073445812&nbsp;/&nbsp;0xc004844c)</summary>

##### Cause

The UPN for the user isn't in the expected format. The UPN value varies according to the device type, as shown in the following table.

| Device join type               | UPN value                                                             |
|--------------------------------|-----------------------------------------------------------------------|
| Azure AD-joined devices        | The text that's entered when the user signs in                        |
| Hybrid Azure AD-joined devices | The UPN that the domain controller returns during the sign-in process |

##### Solutions

- Set the UPN of the user to an internet-style sign-in name, based on internet standard [RFC 822](https://www.ietf.org/rfc/rfc0822.txt). To find the current UPN, look for event ID 1144 in the Azure AD analytic logs.

  To view Event IDs in the Azure AD analytic logs, refer to the [Method 2: Use the Event Viewer to examine Azure AD analytic and operational logs][view-event-ids] section.

- For hybrid Azure AD-joined devices, make sure that you configured the domain controller to return the UPN in the correct format. To display the configured UPN in the domain controller, run the following [whoami](/windows-server/administration/windows-commands/whoami) command:

  ```cmd
  whoami /upn
  ```

  If Active Directory is configured with the correct UPN, [collect time travel traces](#time-travel-traces) for the Local Security Authority Subsystem Service (*lsass.exe*).

- If the on-premises domain name can't be routed (for example, if the UPN is something like `jdoe@contoso.local`), [configure the Alternate Login ID][alt-login-id] (AltID). (To view the prerequisites, see [Plan your hybrid Azure Active Directory join implementation][hybrid-azure-ad-join-plan].)
</details>

<details>
<summary>AAD_CLOUDAP_E_OAUTH_USER_SID_IS_EMPTY (-1073445822&nbsp;/&nbsp;0xc0048442)</summary>

##### Cause

The user security identifier (SID) is missing in the ID token that the Azure AD authentication service returns.

##### Solution

Make sure that the network proxy doesn't interfere with or modify the server response.
</details>

<details>
<summary>AAD_CLOUDAP_E_WSTRUST_SAML_TOKENS_ARE_EMPTY (-1073445695&nbsp;/&nbsp;0xc00484c1&nbsp;/&nbsp;0x800484c1)</summary>

##### Cause

You received an error from the [WS-Trust protocol][WS-Trust] endpoint (which is required for federated authentication).

##### Solutions

- Make sure that the network proxy doesn't interfere with or modify the server response.

- Get the server error code and error description from Event ID 1088 in the Azure AD operational logs. Then, go to the [Common server error codes ("AADSTS" prefix)][server-errors] section to find the cause of that server error code and the solution details.

  To view Event IDs in the Azure AD operational logs, refer to the [Method 2: Use the Event Viewer to examine Azure AD analytic and operational logs][view-event-ids] section.
</details>

<details>
<summary>AAD_CLOUDAP_E_HTTP_PASSWORD_URI_IS_EMPTY (-1073445749&nbsp;/&nbsp;0xc004848b)</summary>

##### Cause

The Metadata Exchange (MEX) endpoint is configured incorrectly. The MEX response doesn't contain any password URLs.

##### Solutions

- Make sure that the network proxy doesn't interfere with or modify the server response.

- Fix the MEX configuration to return valid URLs in response.
</details>

<details>
<summary>AAD_CLOUDAP_E_HTTP_CERTIFICATE_URI_IS_EMPTY (-1073445748&nbsp;/&nbsp;0xc004848c)</summary>

##### Cause

The Metadata Exchange (MEX) endpoint is configured incorrectly. The MEX response doesn't contain any certificate endpoint URLs.

##### Solutions

- Make sure that the network proxy doesn't interfere with or modify the server response.

- Fix the MEX configuration in the identity provider to return valid certificate URLs in response.
</details>

#### Common XML error codes (codes that begin with "0xc00c")

<details>
<summary>WC_E_DTDPROHIBITED (-1072894385&nbsp;/&nbsp;0xc00cee4f)</summary>

##### Cause

The XML response from the [WS-Trust protocol][WS-Trust] endpoint (which is required for federated authentication) included a document type definition (DTD). The DTD isn't expected in the XML response, and response parsing fails if the DTD is included.

##### Solutions

- Fix the configuration in the identity provider to avoid sending the DTD in the XML response.

- Get the URL that's being accessed from Event ID 1022 in the Azure AD analytic logs.

  To view Event IDs in the Azure AD analytic logs, refer to the [Method 2: Use the Event Viewer to examine Azure AD analytic and operational logs][view-event-ids] section.
</details>

#### Common server error codes ("AADSTS" prefix)

You can find the full list and description of server error codes in [Azure AD authentication and authorization error codes](../develop/reference-error-codes.md).

<details>
<summary>AADSTS50155: Device authentication failed</summary>

##### Causes

- Azure AD can't authenticate the device to issue a PRT.

- The device might have been deleted or disabled in the Azure portal. (For more information, see [Why do my users see an error message saying "Your organization has deleted the device" or "Your organization has disabled the device" on their Windows 10/11 devices?](./faq.yml#why-do-my-users-see-an-error-message-saying--your-organization-has-deleted-the-device--or--your-organization-has-disabled-the-device--on-their-windows-10-11-devices))

##### Solution

Re-register the device based on the device join type. For instructions, see [I disabled or deleted my device in the Azure portal or by using Windows PowerShell. But the local state on the device says it's still registered. What should I do?](./faq.yml#i-disabled-or-deleted-my-device-in-the-azure-portal-or-by-using-windows-powershell--but-the-local-state-on-the-device-says-it-s-still-registered--what-should-i-do).
</details>

<details>
<summary>AADSTS50034: The user account &lt;Account&gt; does not exist in the &lt;tenant-id&gt; directory</summary>

##### Cause

Azure AD can't find the user account in the tenant.

##### Solutions

- Make sure that the user is entering the correct UPN.
- Make sure that the on-premises user account is being synchronized to Azure AD.
- Get the provided UPN by looking for Event ID 1144 in the Azure AD analytic logs.

  To view Event IDs in the Azure AD analytic logs, refer to the [Method 2: Use the Event Viewer to examine Azure AD analytic and operational logs][view-event-ids] section.
</details>

<details>
<summary>AADSTS50126: Error validating credentials due to invalid username or password</summary>

##### Causes

- The user entered an incorrect user name or password in the sign-in UI.
- The password hasn't been synchronized to Azure AD because of the following scenario:

  - The tenant has enabled [password hash synchronization](../hybrid/connect/whatis-phs.md).
  - The device is a hybrid Azure AD-joined device.
  - The user just changed the password.

##### Solution

To acquire a fresh PRT that has the new credentials, wait for the Azure AD synchronization to complete.
</details>

#### Common network error codes ("ERROR_WINHTTP_" prefix)

You can find the full list and description of network error codes in [Error messages (Winhttp.h)](/windows/win32/winhttp/error-messages).

<details>
<summary>ERROR_WINHTTP_TIMEOUT (12002),<br/>
ERROR_WINHTTP_NAME_NOT_RESOLVED (12007),<br/>
ERROR_WINHTTP_CANNOT_CONNECT (12029),<br/>
ERROR_WINHTTP_CONNECTION_ERROR (12030)</summary>

##### Causes

Common general network-related issues.

##### Solutions

- Get the URL that's being accessed. You can find the URL in Event ID 1084 of the Azure AD operational log or Event ID 1022 of the Azure AD analytic log.

  To view Event IDs in the Azure AD operational and analytic logs, refer to the [Method 2: Use the Event Viewer to examine Azure AD analytic and operational logs][view-event-ids] section.

- If the on-premises environment requires an outbound proxy, make sure that the computer account of the device can discover and silently authenticate to the outbound proxy.

- Collect network traces by taking the following steps:

  > [!IMPORTANT]  
  > Don't use Fiddler during this procedure.

  1. Run the following [netsh trace start](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/jj129382(v=ws.11)#start) command:

     ```cmd
     netsh trace start scenario=InternetClient_dbg capture=yes persistent=yes
     ```

  1. Lock the device.
  1. If the device is a hybrid Azure AD-joined device, wait at least 60 seconds to let the PRT acquisition task complete.
  1. Unlock the device.
  1. Run the following [netsh trace stop](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/jj129382(v=ws.11)#stop) command:

     ```cmd
     netsh trace stop
     ```


</details>

### Step 4: Collect the logs and traces

#### Regular logs

1. Download the [Auth script archive](https://aka.ms/authscripts) and extract the scripts onto a local directory. If necessary, review the usage instructions in [KB4487175](https://aka.ms/howto-authscripts).
1. Open an administrative PowerShell session, and then change the current directory to the directory in which you saved the Auth scripts.
1. Enter the following command to begin the error tracing:

   ```powershell
   .\Start-auth.ps1 -v -acceptEULA
   ```

1. Switch the Windows user account to go to your problem user's session.
1. Lock the device.
1. If the device is a hybrid Azure AD-joined device, wait at least 60 seconds to let the PRT acquisition task complete.
1. Unlock the device.
1. Switch the Windows user account back to your administrative session that's running the tracing.
1. After you reproduce the issue, run the following command to end the tracing:

   ```powershell
   .\stop-auth.ps1
   ```

1. Wait for all tracing to stop completely.

#### Time travel traces

1. On the Windows **Start** menu, search for **Command Prompt**, and then select **Run as administrator**.
1. In the command prompt console, create a temporary directory:

   ```cmd
   mkdir c:\temp
   ```

1. Run the following [tasklist](/windows-server/administration/windows-commands/tasklist) command:

   ```cmd
   tasklist /m lsasrv.dll
   ```

1. In the `tasklist` command output, find the process identifier (`PID`) of the Local Security Authority Subsystem Service (*lsass.exe*).
1. Run the following command to begin a time travel tracing session of the *lsass.exe* process:

   ```cmd
   tttracer.exe -dumpfull -attach <lsass-pid> -out c:\temp
   ```

1. Lock the device that's signed in under the domain account.
1. Unlock the device.
1. Run the following command to end the time travel tracing session:

   ```cmd
   tttracer.exe -stop all
   ```

1. Get the latest *lsass##.run* file.

[WS-Trust]: http://docs.oasis-open.org/ws-sx/ws-trust/v1.4/ws-trust.html
[server-errors]: #common-server-error-codes-aadsts-prefix
[view-event-ids]: #method-2-use-the-event-viewer-to-examine-azure-ad-analytic-and-operational-logs
[alt-login-id]: /windows-server/identity/ad-fs/operations/configuring-alternate-login-id
[hybrid-azure-ad-join-plan]: ./hybrid-azuread-join-plan.md
