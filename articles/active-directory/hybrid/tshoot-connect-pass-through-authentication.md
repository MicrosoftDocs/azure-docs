---
title: 'Azure AD Connect: Troubleshoot Pass-through Authentication | Microsoft Docs'
description: This article describes how to troubleshoot Azure Active Directory (Azure AD) Pass-through Authentication.
services: active-directory
keywords: Troubleshoot Azure AD Connect Pass-through Authentication, install Active Directory, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: billmath
manager: mtillman
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/24/2018
ms.component: hybrid
ms.author: billmath
---

# Troubleshoot Azure Active Directory Pass-through Authentication

This article helps you find troubleshooting information about common issues regarding Azure AD Pass-through Authentication.

>[!IMPORTANT]
>If you are facing user sign-in issues with Pass-through Authentication, don't disable the feature or uninstall Pass-through Authentication Agents without having a cloud-only Global Administrator account to fall back on. Learn about [adding a cloud-only Global Administrator account](../active-directory-users-create-azure-portal.md). Doing this step is critical and ensures that you don't get locked out of your tenant.

## General issues

### Check status of the feature and Authentication Agents

Ensure that the Pass-through Authentication feature is still **Enabled** on your tenant and the status of Authentication Agents shows **Active**, and not **Inactive**. You can check status by going to the **Azure AD Connect** blade on the [Azure Active Directory admin center](https://aad.portal.azure.com/).

![Azure Active Directory admin center - Azure AD Connect blade](./media/tshoot-connect-pass-through-authentication/pta7.png)

![Azure Active Directory admin center - Pass-through Authentication blade](./media/tshoot-connect-pass-through-authentication/pta11.png)

### User-facing sign-in error messages

If the user is unable to sign into using Pass-through Authentication, they may see one of the following user-facing errors on the Azure AD sign-in screen: 

|Error|Description|Resolution
| --- | --- | ---
|AADSTS80001|Unable to connect to Active Directory|Ensure that agent servers are members of the same AD forest as the users whose passwords need to be validated and they are able to connect to Active Directory.  
|AADSTS8002|A timeout occurred connecting to Active Directory|Check to ensure that Active Directory is available and is responding to requests from the agents.
|AADSTS80004|The username passed to the agent was not valid|Ensure the user is attempting to sign in with the right username.
|AADSTS80005|Validation encountered unpredictable WebException|A transient error. Retry the request. If it continues to fail, contact Microsoft support.
|AADSTS80007|An error occurred communicating with Active Directory|Check the agent logs for more information and verify that Active Directory is operating as expected.

### Sign-in failure reasons on the Azure Active Directory admin center (needs Premium license)

If your tenant has an Azure AD Premium license associated with it, you can also look at the [sign-in activity report](../reports-monitoring/concept-sign-ins.md) on the [Azure Active Directory admin center](https://aad.portal.azure.com/).

![Azure Active Directory admin center - Sign-ins report](./media/tshoot-connect-pass-through-authentication/pta4.png)

Navigate to **Azure Active Directory** -> **Sign-ins** on the [Azure Active Directory admin center](https://aad.portal.azure.com/) and click a specific user's sign-in activity. Look for the **SIGN-IN ERROR CODE** field. Map the value of that field to a failure reason and resolution using the following table:

|Sign-in error code|Sign-in failure reason|Resolution
| --- | --- | ---
| 50144 | User's Active Directory password has expired. | Reset the user's password in your on-premises Active Directory.
| 80001 | No Authentication Agent available. | Install and register an Authentication Agent.
| 80002	| Authentication Agent's password validation request timed out. | Check if your Active Directory is reachable from the Authentication Agent.
| 80003 | Invalid response received by Authentication Agent. | If the problem is consistently reproducible across multiple users, check your Active Directory configuration.
| 80004 | Incorrect User Principal Name (UPN) used in sign-in request. | Ask the user to sign in with the correct username.
| 80005 | Authentication Agent: Error occurred. | Transient error. Try again later.
| 80007 | Authentication Agent unable to connect to Active Directory. | Check if your Active Directory is reachable from the Authentication Agent.
| 80010 | Authentication Agent unable to decrypt password. | If the problem is consistently reproducible, install and register a new Authentication Agent. And uninstall the current one. 
| 80011 | Authentication Agent unable to retrieve decryption key. | If the problem is consistently reproducible, install and register a new Authentication Agent. And uninstall the current one.

## Authentication Agent installation issues

### An unexpected error occurred

[Collect agent logs](#collecting-pass-through-authentication-agent-logs) from the server and contact Microsoft Support with your issue.

## Authentication Agent registration issues

### Registration of the Authentication Agent failed due to blocked ports

Ensure that the server on which the Authentication Agent has been installed can communicate with our service URLs and ports listed [here](how-to-connect-pta-quick-start.md#step-1-check-the-prerequisites).

### Registration of the Authentication Agent failed due to token or account authorization errors

Ensure that you use a cloud-only Global Administrator account for all Azure AD Connect or standalone Authentication Agent installation and registration operations. There is a known issue with MFA-enabled Global Administrator accounts; turn off MFA temporarily (only to complete the operations) as a workaround.

### An unexpected error occurred

[Collect agent logs](#collecting-pass-through-authentication-agent-logs) from the server and contact Microsoft Support with your issue.

## Authentication Agent uninstallation issues

### Warning message when uninstalling Azure AD Connect

If you have Pass-through Authentication enabled on your tenant and you try to uninstall Azure AD Connect, it shows you the following warning message: "Users will not be able to sign-in to Azure AD unless you have other Pass-through Authentication agents installed on other servers."

Ensure that your setup is [highly available](how-to-connect-pta-quick-start.md#step-4-ensure-high-availability) before you uninstall Azure AD Connect to avoid breaking user sign-in.

## Issues with enabling the feature

### Enabling the feature failed because there were no Authentication Agents available

You need to have at least one active Authentication Agent to enable Pass-through Authentication on your tenant. You can install an Authentication Agent by either installing Azure AD Connect or a standalone Authentication Agent.

### Enabling the feature failed due to blocked ports

Ensure that the server on which Azure AD Connect is installed can communicate with our service URLs and ports listed [here](how-to-connect-pta-quick-start.md#step-1-check-the-prerequisites).

### Enabling the feature failed due to token or account authorization errors

Ensure that you use a cloud-only Global Administrator account when enabling the feature. There is a known issue with multi-factor authentication (MFA)-enabled Global Administrator accounts; turn off MFA temporarily (only to complete the operation) as a workaround.

## Collecting Pass-through Authentication Agent logs

Depending on the type of issue you may have, you need to look in different places for Pass-through Authentication Agent logs.

### Azure AD Connect logs

For errors related to installation, check the Azure AD Connect logs at **%ProgramData%\AADConnect\trace-\*.log**.

### Authentication Agent event logs

For errors related to the Authentication Agent, open up the Event Viewer application on the server and check under **Application and Service Logs\Microsoft\AzureAdConnect\AuthenticationAgent\Admin**.

For detailed analytics, enable the "Session" log. Don't run the Authentication Agent with this log enabled during normal operations; use only for troubleshooting. The log contents are only visible after the log is disabled again.

### Detailed trace logs

To troubleshoot user sign-in failures, look for trace logs at **%ProgramData%\Microsoft\Azure AD Connect Authentication Agent\Trace\\**. These logs include reasons why a specific user sign-in failed using the Pass-through Authentication feature. These errors are also mapped to the sign-in failure reasons shown in the preceding sign-in failure reasons table. Following is an example log entry:

```
	AzureADConnectAuthenticationAgentService.exe Error: 0 : Passthrough Authentication request failed. RequestId: 'df63f4a4-68b9-44ae-8d81-6ad2d844d84e'. Reason: '1328'.
	    ThreadId=5
	    DateTime=xxxx-xx-xxTxx:xx:xx.xxxxxxZ
```

You can get descriptive details of the error ('1328' in the preceding example) by opening up the command prompt and running the following command (Note: Replace '1328' with the actual error number that you see in your logs):

`Net helpmsg 1328`

![Pass-through Authentication](./media/tshoot-connect-pass-through-authentication/pta3.png)

### Domain Controller logs

If audit logging is enabled, additional information can be found in the security logs of your Domain Controllers. A simple way to query sign-in requests sent by Pass-through Authentication Agents is as follows:

```
    <QueryList>
    <Query Id="0" Path="Security">
    <Select Path="Security">*[EventData[Data[@Name='ProcessName'] and (Data='C:\Program Files\Microsoft Azure AD Connect Authentication Agent\AzureADConnectAuthenticationAgentService.exe')]]</Select>
    </Query>
    </QueryList>
```

## Performance Monitor counters

Another way to monitor Authentication Agents is to track specific Performance Monitor counters on each server where the Authentication Agent is installed. Use the following Global counters (**# PTA authentications**, **#PTA failed authentications** and **#PTA successful authentications**) and Error counters (**# PTA authentication errors**):

![Pass-through Authentication Performance Monitor counters](./media/tshoot-connect-pass-through-authentication/pta12.png)

>[!IMPORTANT]
>Pass-through Authentication provides high availability using multiple Authentication Agents, and _not_ load balancing. Depending on your configuration, _not_ all your Authentication Agents receive roughly _equal_ number of requests. It is possible that a specific Authentication Agent receives no traffic at all.
