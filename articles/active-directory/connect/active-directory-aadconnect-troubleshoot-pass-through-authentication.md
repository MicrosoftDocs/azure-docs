---
title: 'Azure AD Connect: Troubleshoot Pass-through Authentication | Microsoft Docs'
description: This article describes how to troubleshoot Azure Active Directory (Azure AD) Pass-through Authentication.
services: active-directory
keywords: Troubleshoot Azure AD Connect Pass-through Authentication, install Active Directory, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: swkrish
manager: femila
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/09/2017
ms.author: billmath
---

# How to troubleshoot Azure Active Directory Pass-through Authentication

This article will help you find troubleshooting information about common issues during the installation, registration or uninstallation of Pass-through Authentication connectors (either via Azure AD Connect or standalone). And during enabling and operating of the Azure Active Directory (Azure AD) Pass-through Authentication feature on your tenant.

## Issues during installation of connectors (either via Azure AD Connect or standalone)

### An Azure AD Application Proxy connector already exists

A Pass-through Authentication connector cannot be installed on the same server as an [Azure AD Application Proxy](../../active-directory/active-directory-application-proxy-get-started.md) connector. You will need to install the Pass-through Authentication connector on a separate server.

### An unexpected error occured

[Collect connector logs](#collecting-pass-through-authentication-connector-logs) from the server and contact Microsoft Support with your issue.

## Issues during registration of connectors

### Registration of the connecter failed due to blocked port(s)

Ensure that the server on which the connector has been installed can communicate with our service URLs and ports listed [here](active-directory-aadconnect-pass-through-authentication.md#prerequisites).

### Registration of the connector failed due to token or account authorization errors

Ensure that you use a cloud-only Global Administrator account for all Azure AD Connect or standalone connector installation and registration operations. There is a known issue with MFA-enabled Global Administrator accounts; turn off MFA temporarily (only to complete the operations) as a workaround.

### An unexpected error occurred

[Collect connector logs](#collecting-pass-through-authentication-connector-logs) from the server and contact Microsoft Support with your issue.

## Issues during uninstallation of connectors

### Warning message when uninstalling Azure AD Connect

If you have Pass-through Authentication enabled on your tenant and you try to uninstall Azure AD Connect, it will show you the following warning message: "Users will not be able to sign-in to Azure AD unless you have other Pass-through Authentication agents installed on other servers.".

You need to have a [high availability](active-directory-aadconnect-pass-through-authentication.md) setup in place before you uninstall Azure AD Connect to avoid breaking user sign-in.

## Issues with enabling the Pass-through Authentication feature

### The enabling of the feature failed because there were no connectors available

You need to have at least one active connector to enable Pass-through Authentication on your tenant. You can install a connector by either installing Azure AD Connect or a standalone connector.

### The enabling of the feature failed due to blocked port(s)

Ensure that the server on which Azure AD Connect is installed can communicate with our service URLs and ports listed [here](active-directory-aadconnect-pass-through-authentication.md#prerequisites).

### The enabling of the feature failed due to token or account authorization errors

Ensure that you use a cloud-only Global Administrator account when enabling the feature. There is a known issue with multi-factor authentication (MFA)-enabled Global Administrator accounts; turn off MFA temporarily (only to complete the operation) as a workaround.

## Issues while operating the Pass-through Authentication feature

### User-facing sign-in errors

The feature reports the following user-facing errors on the Azure AD sign-in screen. They are detailed below together with their appropriate resolution steps.

|Error|Description|Resolution
| --- | --- | ---
|AADSTS80001|Unable to connect to Active Directory|Ensure that connector servers are members of the same AD forest as the users whose passwords need to be validated and they are able to connect to Active Directory.  
|AADSTS8002|A timeout occurred connecting to Active Directory|Check to ensure that Active Directory is available and is responding to requests from the connectors.
|AADSTS80004|The username passed to the connector was not valid|Ensure the user is attempting to sign in with the right username.
|AADSTS80005|Validation encountered unpredictable WebException|This is likely a transient error. Retry the request. If it continues to fail, contact Microsoft support.
|AADSTS80007|An error occurred communicating with Active Directory|Check the connector logs for more information and verify that Active Directory is operating as expected.

## Collecting Pass-through Authentication connector logs

Depending on the type of issue you may have, you will need to look in different places for Pass-through Authentication connector logs.

### Connector event logs

For errors related to the connector open up the Event Viewer application on the server and check under **Application and Service Logs\Microsoft\AadApplicationProxy\Connector\Admin**.

For detailed analytics and debugging logs you can enable the "Session" log. Don't run the connector with this log enabled during normal operations; only use this for troubleshooting. Note that the log contents are only visible after the log is disabled again.

### Detailed trace logs

To troubleshoot user sign-in failures, look for trace logs at **C:\Programdata\Microsoft\Microsoft AAD Application Proxy Connector\Trace**. These logs include reasons why a specific user sign-in failed using the Pass-through Authentication feature. Given below is an example log entry:

```
	ApplicationProxyConnectorService.exe Error: 0 : Passthrough Authentication request failed. RequestId: 'df63f4a4-68b9-44ae-8d81-6ad2d844d84e'. Reason: '1328'.
	    ThreadId=5
	    DateTime=xxxx-xx-xxTxx:xx:xx.xxxxxxZ
```

You can get descriptive details of the error ('1328' in the above example) by opening up the command prompt and running the following command. Note: You will need to replace '1328' with the actual error number that you see in your logs.

`Net helpmsg 1328`

The result should look something like this:

![Pass-through Authentication](./media/active-directory-aadconnect-pass-through-authentication/pta3.png)

### Domain Controller logs

If audit logging is enabled, additional information can be found in the security logs of your Domain Controllers. A simple way to query sign-in requests sent by Pass-through Authentication connectors is as follows:

```
    <QueryList>
    <Query Id="0" Path="Security">
    <Select Path="Security">*[EventData[Data[@Name='ProcessName'] and (Data='C:\Program Files\Microsoft AAD App Proxy Connector\ApplicationProxyConnectorService.exe')]]</Select>
    </Query>
    </QueryList>
```
