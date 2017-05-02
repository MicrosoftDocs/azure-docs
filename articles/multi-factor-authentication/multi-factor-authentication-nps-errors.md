---
title: Troubleshoot error codes for the Azure MFA NPS extension | Microsoft Docs
description: Get help resolving issues with the NPS extension for Azure Multi-Factor Authentication with specific resolutions for common error messages
services: multi-factor-authentication
documentationcenter: ''
author: kgremban
manager: femila
editor: yossib

ms.assetid:
ms.service: multi-factor-authentication
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/28/2017
ms.author: kgremban

---

# Resolve error messages from the NPS extension for Azure Multi-Factor Authentication

If you encounter errors with the NPS extension for Azure Multi-Factor Authentication, use this article to reach a resolution faster. 

## Troubleshooting steps for common errors

| Error code | Troubleshooting steps |
| ---------- | --------------------- |
| **CONTACT_SUPPORT** | [Contact support](#contact-microsoft-support), and mention the list of steps for collecting logs. Provide as much information as you can about what happened before the error, including tenant id, and user principal name (UPN). |
| **CLIENT_CERT_INSTALL_ERROR** | There may be an issue with how the client certificate was installed or associated with your tenant. Follow the instructions in [Troubleshooting the MFA NPS extension](multi-factor-authentication-nps-extension.md#troubleshooting) to investigate client cert problems. |
| **ESTS_TOKEN_ERROR** | Follow the instructions in [Troubleshooting the MFA NPS extension](multi-factor-authentication-nps-extension.md#troubleshooting) to investigate client cert and ADAL token problems. |
| **HTTPS_COMMUNICATION_ERROR** | The NPS server is unable to receive responses from Azure MFA. Verify that your firewalls are open bidirectionally for traffic to and from https://adnotifications.windowsazure.com |
| **HTTP_CONNECT_ERROR** | On the server that runs the NPS extension, verify that you can reach  https://adnotifications.windowsazure.com and https://login.windows.net/. If those sites don't load, troubleshoot connectivity on that server. |
| **REGISTRY_CONFIG_ERROR** | A key is missing in the registry for the application, which may be because the [PowerShell script](multi-factor-authentication-nps-extension.md#install-the-nps-extension) wasn't run after installation. The error message should include the missing key. Make sure you have the key under HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\AzureMfa. |
| **REQUEST_FORMAT_ERROR** <br> Radius Request missing mandatory Radius userName\Identifier attribute.Verify that NPS is receiving RADIUS requests | This error usually reflects an installation issue. The NPS extension must be installed in NPS servers that can receive RADIUS requests. NPS servers that are installed as dependencies for services like RDG and RRAS don't receive radius requests. NPS Extension does not work when installed over such installations and errors out since it cannot read the details from the authentication request. |
| **REQUEST_MISSING_CODE** | If SMS or Oath tokens are used for the secondary authentication method, then the password ecryption protocol between NPS and Nas servers must be PAP. The NPS extension does not support other password encryption methods at this point.|
| **USERNAME_CANONICALIZATION_ERROR** | Verify that the user is present in your on-premises Active Directory instance, and that the NPS Service has permissions to access the directory. If you are using cross-forest trusts, [contact support](#contact-microsoft-support) for further help. |


## Errors your users may encounter

| Error code | Error message | Troubleshooting steps |
| ---------- | ------------- | --------------------- |
| **AccessDenied** | Caller tenant does not have access permissions to do authentication for the user | Check whether the tenant domain and the domain of the user principal name (UPN) are the same. For example, make sure that user@contoso.com is trying to authenticate to the Contoso tenant. The UPN represents a valid user for the tenant in Azure. |
| **AuthenticationMethodNotConfigured** | The specified authentication method was not configured for the user | Have the user add or verify their verification methods according to the instructions in [Manage your settings for two-step verification](./end-user/multi-factor-authentication-end-user-manage-settings.md). |
| **AuthenticationMethodNotSupported** | Specified authentication method is not supported. | Collect all your logs that include this error, and [contact support](#contact-microsoft-support). When you contact support, provide the username and the secondary verification method that triggered the error. |
| **BecAccessDenied** | MSODS Bec call returned access denied, probably the username is not defined in the tenant | The user is present in Active Directory on-premises but is not synced into Azure AD by AD Connect. Or, the user is missing for the tenant. Add the user to Azure AD and have them add their verification methods according to the instructions in [Manage your settings for two-step verification](./end-user/multi-factor-authentication-end-user-manage-settings.md). |
| **InvalidFormat** or **StrongAuthenticationServiceInvalidParameter** | The phone number is in an unrecognizable format | Have the user correct their verification phone numbers. |
| **InvalidSession** | The specified session is invalid or may have expired | The session has taken more than three minutes to complete. Verify that the user is entering the verification code, or responding to the app notification, within three minutes of initiating the authentication request. If that doesn't fix the problem, check that there are no network latencies between client, NAS Server, NPS Server, and the Azure MFA endpoint.  |
| **NoDefaultAuthenticationMethodIsConfigured** | No default authentication method was configured for the user | Have the user add or verify their verification methods according to the instructions in [Manage your settings for two-step verification](./end-user/multi-factor-authentication-end-user-manage-settings.md). Verify that the user has chosen a default authentication method, and configured that method for their account. |
| **OathCodePinIncorrect** | Wrong code and pin entered. | This error is not expected in the NPS extension. If your user encounters this, [contact support](#contact-microsoft-support) for troubleshooting help. |
| **ProofDataNotFound** | Proof data was not configured for the specified authentication method. | Have the user try a different verification method, or add a new verification methods according to the instructions in [Manage your settings for two-step verification](./end-user/multi-factor-authentication-end-user-manage-settings.md). If the user continues to see this error after you confirmed that their verification method is set up correctly, [contact support](#contact-microsoft-support). |
| **SMSAuthFailedWrongCodePinEntered** | Wrong code and pin entered. (OneWaySMS) | This error is not expected in the NPS extension. If your user encounters this, [contact support](#contact-microsoft-support) for troubleshooting help. |
| **TenantIsBlocked** | Tenant is blocked | [Contact support](#contact-microsoft-support) with Directory ID from the Azure AD properties page in the Azure portal. |
| **UserNotFound** | The specified user was not found | The tenant is no longer visible as active in Azure AD. Check that your subscription is active and you have the required first party apps. Also make sure the tenant in the certificate subject is as expected and the cert is still valid and registered under the service principal. |

## Messages your users may encounter that aren't errors

Sometimes, your users may get messages from Multi-Factor Authentication because their authentication request failed. These aren't errors in the product of configuration, but are intentional warnings explaining why an authentication request was denied.

| Error code | Error message | Recommended steps | 
| ---------- | ------------- | ----------------- |
| **OathCodeIncorrect** | Wrong code entered\OATH Code Incorrect | Not an error,User has entered wrong code. | The user entered the wrong code. Have them try again by requesting a new code or signing in again. | 
| **SMSAuthFailedMaxAllowedCodeRetryReached** | Maximum allowed code retry reached | The user failed the verification challenge too many times. Depending on your settings, they may need to be unblocked by an admin now.  |
| **SMSAuthFailedWrongCodeEntered** | Wrong code entered/Text Message OTP Incorrect | The user entered the wrong code. Have them try again by requesting a new code or signing in again. |

## Errors that require support

If you encounter one of these errors, we recommend that you [contact support](#contact-microsoft-support) for diagnostic help. There's no standard set of steps that can address these errors. When you do contact support, be sure to include as much information as possible about the steps that led to an error, and your tenant information.

| Error code | Error message |
| ---------- | ------------- |
| **InvalidParameter** | Request must not be null |
| **InvalidParameter** | ObjectId must not be null or empty for ReplicationScope:{0} |
| **InvalidParameter** | The length of CompanyName \{0}\ is longer than the maximum allowed length {1} |
| **InvalidParameter** | UserPrincipalName must not be null or empty |
| **InvalidParameter** | The provided TenantId is not in correct format |
| **InvalidParameter** | SessionId must not be null or empty |
| **InvalidParameter** | Could not resolve any ProofData from request or Msods. The ProofData is unKnown |
| **InternalError** |  |
| **OathCodePinIncorrect** |  |
| **VersionNotSupported** |  |
| **MFAPinNotSetup** |  |

## Next steps

### Troubleshoot user accounts

If your users are [Having trouble with two-step verification](./end-user/multi-factor-authentication-end-user-troubleshoot.md), help them self-diagnose problems. 

### Contact Microsoft support

If you need additional help, contact a support professional through [Azure Multi-Factor Authentication Server support](https://support.microsoft.com/oas/default.aspx?prid=14947). When contacting us, it's helpful if you can include as much information about your issue as possible. Information you can supply includes the page where you saw the error, the specific error code, the specific session ID, the ID of the user who saw the error, and debug logs.

To collect debug logs for support diagnostics, use the following steps: 

1. Open an Administrator command prompt and run these commands:

   ```
   Mkdir c:\NPS
   Cd NPS
   netsh trace start Scenario=NetConnection capture=yes tracefile=c:\NPS\nettrace.etl
   logman create trace "NPSExtension" -ow -o c:\NPS\NPSExtension.etl -p {7237ED00-E119-430B-AB0F-C63360C8EE81} 0xffffffffffffffff 0xff -nb 16 16 -bs 1024 -mode Circular -f bincirc -max 4096 -ets
   logman update trace "NPSExtension" -p {EC2E6D3A-C958-4C76-8EA4-0262520886FF} 0xffffffffffffffff 0xff -ets
   ```

2. Reproduce the issue

3. Stop the tracing with these commands:

   ```
   logman stop "NPSExtension" -ets
   netsh trace stop
   wevtutil epl AuthNOptCh C:\NPS\%computername%_AuthNOptCh.evtx
   wevtutil epl AuthZOptCh C:\NPS\%computername%_AuthZOptCh.evtx
   wevtutil epl AuthZAdminCh C:\NPS\%computername%_AuthZAdminCh.evtx
   Start .
   ```

4. Zip the contents of the C:\NPS folder and attach the zipped file to the support case.


