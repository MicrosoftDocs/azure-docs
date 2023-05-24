---
title: Troubleshoot primary refresh token issues on Windows devices
description: Troubleshoot primary refresh token issues during authentication through Azure Active Directory (Azure AD) credentials on Azure AD-joined Windows devices.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: troubleshooting
ms.date: 5/24/2023

ms.author: v-dele
author: DennisLee-DennisLee
editor: v-jsitser
manager: amycolannino
ms.reviewer: azureidcic, gudlapreethi
---
# Troubleshoot primary refresh token issues on Windows devices

This article discusses how to troubleshoot issues that involve the [primary refresh token](/azure/active-directory/devices/concept-primary-refresh-token) (PRT) when you authenticate onto a Microsoft Azure Active Directory (Azure AD)-joined Windows device by using your Azure AD credentials.

On devices that are joined to Microsoft Azure Active Directory (Azure AD) or joined to Hybrid Azure AD, the main artifact of authentication is the PRT. You obtain this token by signing in to Windows 10 by using Azure AD credentials on an Azure AD-joined device for the first time. The PRT is cached on that device. For subsequent sign-ins, the cached token is used to let you use the desktop.

Once every four hours, as part of lock and unlock or signing in again to Windows, a background network authentication is tried to refresh the PRT. If there are problems in refreshing the token, the PRT eventually expires. Expiration affects single sign-on (SSO) to Azure AD resources. It also causes sign-in prompts to be shown.

If you suspect that there's a PRT problem, first collect Azure AD logs and follow the steps outlined in the troubleshooting checklist. We recommend that you collect Azure AD logs for any Azure AD client issue first, ideally within a repro session. Complete this process before you contact the PG or file an ICM.

## Troubleshooting checklist

### Step 1: Get the status of the PRT

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

1. Check the value of the `AzureAdPrt` field. If it's set to `NO`, there was an error acquiring the PRT from Azure AD.

1. Check the value of the `AzureAdPrtUpdateTime` field. If the value of the `AzureAdPrtUpdateTime` field is more than four hours <!-- Is there a missing phrase here? -->, there's probably an issue that's preventing the PRT from refreshing. Lock and unlock the device to force PRT refresh, and then check whether the time is updated.

### Step 2: Get the error code

The next step is to get the error code that causes the PRT error. The quickest way to get the PRT error code is to examine the device registration command output. However, this method requires Windows Server 2022. The other method is to find the error code in Azure AD analytic and operational logs.

#### Method 1: Examine the device registration command output (Windows Server 2022 and later versions only)

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
1. In the list of analytic events, search for Event ID 1006 and 1007. Event ID 1006 denotes the beginning of the PRT acquisition flow, and Event ID 1007 denotes the end of the PRT acquisition flow. All events in the **AAD** logs (both **Analytic** and **Operational**) that are logged timewise between Event ID 1006 and Event ID 1007 are logged as part of the PRT acquisition flow. The following table shows an example event listing.

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

<details>
<summary>STATUS_LOGON_FAILURE (-1073741715&nbsp;/&nbsp;0xc000006d),<br/>
STATUS_WRONG_PASSWORD (-1073741718&nbsp;/&nbsp;0xc000006a)</summary>
</details>

<details>
<summary>STATUS_REQUEST_NOT_ACCEPTED (-1073741616&nbsp;/&nbsp;0xc00000d0)</summary>
</details>

<details>
<summary>STATUS_NETWORK_UNREACHABLE (-1073741252&nbsp;/&nbsp;0xc000023c),<br/>
STATUS_BAD_NETWORK_PATH (-1073741634&nbsp;/&nbsp;0xc00000be),<br/>
STATUS_UNEXPECTED_NETWORK_ERROR (-1073741628&nbsp;/&nbsp;0xc00000c4)</summary>
</details>

<details>
<summary>STATUS_NO_SUCH_LOGON_SESSION (-1073741729&nbsp;/&nbsp;0xc000005f)</summary>
</details>

#### Common CloudAP plug-in error codes

<details>
<summary>AAD_CLOUDAP_E_OAUTH_USERNAME_IS_MALFORMED (-1073445812&nbsp;/&nbsp;0xc004844c)</summary>
</details>

<details>
<summary>AAD_CLOUDAP_E_OAUTH_USER_SID_IS_EMPTY (-1073445822&nbsp;/&nbsp;0xc0048442)</summary>
</details>

<details>
<summary>AAD_CLOUDAP_E_WSTRUST_SAML_TOKENS_ARE_EMPTY (-1073445695&nbsp;/&nbsp;0xc00484c1&nbsp;/&nbsp;0x800484c1)</summary>
</details>

<details>
<summary>AAD_CLOUDAP_E_HTTP_PASSWORD_URI_IS_EMPTY (-1073445749&nbsp;/&nbsp;0xc004848b)</summary>
</details>

<details>
<summary>WC_E_DTDPROHIBITED (-1072894385&nbsp;/&nbsp;0xc00cee4f)</summary>
</details>

#### Common server error codes

<details>
<summary>AADSTS50155: Device authentication failed</summary>
</details>

<details>
<summary>AADSTS50034: The user account &lt;Account&gt; does not exist in the &lt;tenant id&gt; directory</summary>
</details>

<details>
<summary>AADSTS50126: Error validating credentials due to invalid username or password</summary>
</details>


#### Common network error codes

<details>
<summary>ERROR_WINHTTP_TIMEOUT (12002),<br/>
ERROR_WINHTTP_NAME_NOT_RESOLVED (12007),<br/>
ERROR_WINHTTP_CANNOT_CONNECT (12029),<br/>
ERROR_WINHTTP_CONNECTION_ERROR (12030)</summary>
</details>

### Step 4: Collect the logs

#### Regular logs

1. Download the [Auth script archive](https://aka.ms/authscripts) and extract the scripts onto a local directory. If necessary, review the usage instructions in [KB4487175](https://aka.ms/howto-authscripts).
1. Open an administrative PowerShell session, and then change the current directory to the directory in which you saved the Auth scripts.
1. Enter the following command to begin the error tracing:

   ```powershell
   .\Start-auth.ps1 -v -acceptEULA
   ```

1. Switch the Windows user account to go to your problem user's session.
1. Lock and unlock the device. For Hybrid-joined devices, wait 60 seconds to let the PRT acquisition task complete.
1. Switch the Windows user account back to your administrative session that's running the tracing.
1. After you reproduce the issue, run the following command to end the tracing:

   ```powershell
   .\stop-auth.ps1
   ```

1. Wait for all tracing to stop completely.

#### TimeTravel Traces (TTT)
