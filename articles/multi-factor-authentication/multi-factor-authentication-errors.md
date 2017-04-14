---
title: Troubleshoot Azure MFA error codes | Microsoft Docs
description: Get help resolving issues with Multi-Factor Authentication with specific resolutions for common error messages
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
ms.date: 04/13/2017
ms.author: kgremban

---

# Resolve Azure MFA problems according to error messages

If you encounter errors with Azure Multi-Factor Authentication, use this article to reach a resolution faster. 

## Troubleshooting steps for common errors

| Error code | Error message | Troubleshooting steps |
| ---------- | ------------- | --------------------- |
| **AccessDenied** | Caller tenant does not have access permissions to do authentication for the user | Check whether the tenant domain and the domain of the user principal name (UPN) are the same. For example, make sure that user@contoso.com is trying to authenticate to the Contoso tenant. The UPN represents a valid user for the tenant in Azure. |
| **AuthenticationMethodNotConfigured** | The specified authentication method was not configured for the user | Request the user to proof up again. |
| **AuthenticationMethodNotSupported** | Specified authentication method is not supported. | Collect all your logs that include this error, and contact support. When you contact support, provide the username and the secondary verification method that triggered the error. |
| **BecAccessDenied** | MSODS Bec call returned access denied, probably the username is not defined in the tenant | The user is present in Active Directory on-premises but is not synced into Azure AD by AD Connect. Or, the user is missing for the tenant. Add the user to Azure AD and complete proofup. |
| **InvalidFormat** or **StrongAuthenticationServiceInvalidParameter** | The phone number is in an unrecognizable format | Have the user correct their verification phone numbers. |
| **InvalidSession** | The specified session is invalid or may have expired | The session has taken more than three minutes to complete. Verify that the user is entering the verification code, or responding to the app notification, within three minutes of initiating the authentication request. If that doesn't fix the problem, check that there are no network latencies between client, NAS Server, NPS Server, and the Azure MFA endpoint.  |
| **NoDefaultAuthenticationMethodIsConfigured** | No default authentication method was configured for the user | Have the user proof up. If proofup data is already present, verify that the user has chosen a default authentication method, and configured that method for their account. |
| **ProofDataNotFound** | Proof data was not configured for the specified authentication method. | Have the user try a different verification, or proofup again. If proofup data is already present, contact support. |
| **TenantIsBlocked** | Tenant is blocked | Contact support with Directory ID from the Azure AD properties page in the Azure portal. |
| **UserNotFound** | The specified user was not found | The tenant is no longer visible as active in Azure AD. Check that your subscription is active and you have the required first party apps. Also make sure the tenant in the certificate subject is as expected and the cert is still valid and registered under the service principal. |

## Messages your users may encounter that aren't errors

Sometimes, your users may get messages from Multi-Factor Authentication because their authentication request failed. These aren't errors in the product of configuration, but are intentional warnings that account security may be compromised.

| Error code | Error message | Recommended steps | 
| ---------- | ------------- | ----------------- |
| **SMSAuthFailedMaxAllowedCodeRetryReached** | Maximum allowed code retry reached | The user failed the verification challenge too many times. Depending on your settings, they may need to be unblocked by an admin now.  |
| **SMSAuthFailedWrongCodeEntered** | Wrong code entered/Text Message OTP Incorrect | The user has entered the wrong code. Have them retry authentication. |
| **SMSAuthFailedWrongCodePinEntered** | 


