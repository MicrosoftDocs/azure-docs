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
ms.date: 06/03/2017
ms.author: billmath
---

# Troubleshoot Azure Active Directory Pass-through Authentication

This article helps you find troubleshooting information about common issues during the installation, registration, or uninstallation of Pass-through Authentication agents (either via Azure AD Connect or standalone). And during enabling and operating of the Azure Active Directory (Azure AD) Pass-through Authentication feature on your tenant.

## Issues during installation of agents (either via Azure AD Connect or standalone)

### An Azure AD Application Proxy agent already exists

A Pass-through Authentication agent cannot be installed on the same server as an [Azure AD Application Proxy](../../active-directory/active-directory-application-proxy-get-started.md) agent. Install the Pass-through Authentication agent on a separate server.

### An unexpected error occurred

[Collect agent logs](#collecting-pass-through-authentication-agent-logs) from the server and contact Microsoft Support with your issue.

## Issues during registration of agents

### Registration of the connecter failed due to blocked ports

Ensure that the server on which the agent has been installed can communicate with our service URLs and ports listed [here](active-directory-aadconnect-pass-through-authentication-quick-start.md#step-1-check-prerequisites).

### Registration of the agent failed due to token or account authorization errors

Ensure that you use a cloud-only Global Administrator account for all Azure AD Connect or standalone agent installation and registration operations. There is a known issue with MFA-enabled Global Administrator accounts; turn off MFA temporarily (only to complete the operations) as a workaround.

### An unexpected error occurred

[Collect agent logs](#collecting-pass-through-authentication-agent-logs) from the server and contact Microsoft Support with your issue.

## Issues during uninstallation of agents

### Warning message when uninstalling Azure AD Connect

If you have Pass-through Authentication enabled on your tenant and you try to uninstall Azure AD Connect, it shows you the following warning message: "Users will not be able to sign-in to Azure AD unless you have other Pass-through Authentication agents installed on other servers."

Ensure that your setup is [high available](active-directory-aadconnect-pass-through-authentication-quick-start.md#step-4-ensure-high-availability) before you uninstall Azure AD Connect to avoid breaking user sign-in.

## Issues with enabling the Pass-through Authentication feature

### The enabling of the feature failed because there were no agents available

You need to have at least one active agent to enable Pass-through Authentication on your tenant. You can install an agent by either installing Azure AD Connect or a standalone agent.

### The enabling of the feature failed due to blocked ports

Ensure that the server on which Azure AD Connect is installed can communicate with our service URLs and ports listed [here](active-directory-aadconnect-pass-through-authentication-quick-start.md#step-1-check-prerequisites).

### The enabling of the feature failed due to token or account authorization errors

Ensure that you use a cloud-only Global Administrator account when enabling the feature. There is a known issue with multi-factor authentication (MFA)-enabled Global Administrator accounts; turn off MFA temporarily (only to complete the operation) as a workaround.

## Issues while operating the Pass-through Authentication feature

### User-facing sign-in errors

The feature reports the following user-facing errors on the Azure AD sign-in screen:

|Error|Description|Resolution
| --- | --- | ---
|AADSTS80001|Unable to connect to Active Directory|Ensure that agent servers are members of the same AD forest as the users whose passwords need to be validated and they are able to connect to Active Directory.  
|AADSTS8002|A timeout occurred connecting to Active Directory|Check to ensure that Active Directory is available and is responding to requests from the agents.
|AADSTS80004|The username passed to the agent was not valid|Ensure the user is attempting to sign in with the right username.
|AADSTS80005|Validation encountered unpredictable WebException|A transient error. Retry the request. If it continues to fail, contact Microsoft support.
|AADSTS80007|An error occurred communicating with Active Directory|Check the agent logs for more information and verify that Active Directory is operating as expected.

## Collecting Pass-through Authentication agent logs

Depending on the type of issue you may have, you need to look in different places for Pass-through Authentication agent logs.

### Agent event logs

For errors related to the agent, open up the Event Viewer application on the server and check under **Application and Service Logs\Microsoft\AadApplicationProxy\agent\Admin**.

For detailed analytics, enable the "Session" log. Don't run the agent with this log enabled during normal operations; use only for troubleshooting. The log contents are only visible after the log is disabled again.

### Detailed trace logs

To troubleshoot user sign-in failures, look for trace logs at **C:\Programdata\Microsoft\Microsoft AAD Application Proxy agent\Trace**. These logs include reasons why a specific user sign-in failed using the Pass-through Authentication feature. Following is an example log entry:

```
	ApplicationProxyagentService.exe Error: 0 : Passthrough Authentication request failed. RequestId: 'df63f4a4-68b9-44ae-8d81-6ad2d844d84e'. Reason: '1328'.
	    ThreadId=5
	    DateTime=xxxx-xx-xxTxx:xx:xx.xxxxxxZ
```

You can get descriptive details of the error ('1328' in the preceding example) by opening up the command prompt and running the following command (Note: Replace '1328' with the actual error number that you see in your logs):

`Net helpmsg 1328`

![Pass-through Authentication](./media/active-directory-aadconnect-pass-through-authentication/pta3.png)

### Domain Controller logs

If audit logging is enabled, additional information can be found in the security logs of your Domain Controllers. A simple way to query sign-in requests sent by Pass-through Authentication agents is as follows:

```
    <QueryList>
    <Query Id="0" Path="Security">
    <Select Path="Security">*[EventData[Data[@Name='ProcessName'] and (Data='C:\Program Files\Microsoft AAD App Proxy agent\ApplicationProxyagentService.exe')]]</Select>
    </Query>
    </QueryList>
```
