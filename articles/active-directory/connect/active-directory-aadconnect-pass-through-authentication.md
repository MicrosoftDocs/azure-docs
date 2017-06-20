---
title: 'Azure AD Connect: Pass-through Authentication | Microsoft Docs'
description: This article describes Azure Active Directory (Azure AD) Pass-through Authentication and how it allows Azure AD sign-ins by validating users' passwords against your on-premises Active Directory.
services: active-directory
keywords: what is Azure AD Connect Pass-through authentication, install Active Directory, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: swkrish
manager: femila
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/24/2017
ms.author: billmath
---

# Configure user sign-in with Azure Active Directory Pass-through Authentication

## What is Azure Active Directory (Azure AD) Pass-through Authentication?

Allowing your users to use the same credentials (passwords) to sign into both on-premises resources and cloud-based services is benefical to your users and to your organization. Users will have one less password to remember. This provides a better user experience and reduces the chances that users will forget how to sign in. This, in turn, lowers your help desk costs since password-related issues typically consume the most support resources.

Many organizations use [Azure AD password synchronization](active-directory-aadconnectsync-implement-password-synchronization.md), a feature of [Azure AD Connect](active-directory-aadconnect.md) that synchronizes users' passwords from on-premises Active Directory to Azure AD, as a way to provide users with the same credentials across on-premises resources and cloud-based services. However, other organizations require that passwords, even in a hashed form, do not leave their internal organizational boundaries.

Azure AD Pass-through Authentication provides a simple solution for these organizations. When users sign in to Azure AD, it ensures that users' passwords are directly validated against your on-premises Active Directory. This feature also provides the following benefits:

- Easy to use
  - Password validation is performed without the need for complex on-premises deployments or network configuration.
  - It only utilizes a lightweight on-premises connector that listens for and responds to password validation requests.
  - The on-premises connector has auto-update capability so it can automatically receive feature improvements and bug fixes.
  - It can be configured along with [Azure AD Connect](active-directory-aadconnect.md). The lightweight on-premises connector is installed on the same server as Azure AD Connect.
- Secure
  - On-premises passwords are never stored in the cloud in any form.
  - The lightweight on-premises connector only makes outbound connections from within your network. Therefore there is no requirement for installing the connector in a DMZ.
  - Pass-through authentication works seamlessly with Azure Multi-Factor Authentication.
- Reliable and scalable
  - Additional lightweight on-premises connectors can be installed on multiple servers to achieve high availability of sign-in requests.

![Azure AD Pass-through Authentication](./media/active-directory-aadconnect-pass-through-authentication/pta1.png)

When combined with the [Seamless Single Sign-on](active-directory-aadconnect-sso.md) feature, your users won't even need to type in their passwords to sign in to Azure AD, when they are on their corporate machines within your corporate network - a truly integrated experience.

## What's available during preview?

>[!NOTE]
>Azure AD pass-through authentication is currently in preview. It is a free feature and you don't need any paid editions of Azure AD to use it.

The following scenarios are fully supported during preview:

- All web browser-based applications.
- Office 365 client applications that support [modern authentication](https://aka.ms/modernauthga).

The following scenarios are NOT supported during preview:

- Legacy Office client applications and Exchange ActiveSync (i.e., native email applications on mobile devices).
  - Organizations are encouraged to switch to modern authentication, if possible. This allows for pass-through authentication support, but also helps you secure your identities using [conditional access](../active-directory-conditional-access.md) features such as multi-factor authentication.
- Azure AD Join for Windows 10 devices.

>[!IMPORTANT]
>As a workaround for scenarios that the pass-through authentication feature doesn't support today (legacy Office client applications, Exchange ActiveSync and Azure AD Join for Window 10 devices), password synchronization is also enabled by default when you enable pass-through authentication. Password synchronization acts as a fallback in only these specific scenarios. If you don't need this, you can turn off password synchronization on the [Optional Features](active-directory-aadconnect-get-started-custom.md#optional-features) page on Azure AD Connect wizard.

## How to enable Azure AD Pass-through Authentication?

### Pre-requisites

Before you can enable Azure AD pass-through authentication, you need to have the following pre-requisites in place:

- An Azure AD tenant for which you are a Global Administrator.

>[!NOTE]
>It is highly recommended that the Global Administrator account is a cloud-only account so that you can manage the configuration of your tenant should your on-premises services fail or become unavailable. You can add a cloud-only Global Administrator account as shown [here](../active-directory-users-create-azure-portal.md).

- Azure AD Connect version 1.1.486.0 or higher. It is recommended that you use the [latest version of Azure AD Connect](https://www.microsoft.com/download/details.aspx?id=47594).
- A server running Windows Server 2012 R2 or higher on which to run Azure AD Connect.
  - This server must be a member of the same AD forest as the users whose passwords need to be validated.
  - Note that a pass-through authentication connector is installed on the same server as Azure AD Connect. Verify that the connector version is 1.5.58.0 or higher.

>[!NOTE]
>Multi-forest environments are supported if there are forest trusts between the AD forests and name suffix routing is correctly configured.

- If you want high availability, you will need additional servers running Windows Server 2012 R2 or higher to install standalone connectors (version needs to be 1.5.58.0 or higher).
- If there is a firewall between any of the connectors and Azure AD, make sure that:
	- If URL filtering is enabled, ensure that the connectors can communicate with the following URLs:
		-  \*.msappproxy.net
		-  \*.servicebus.windows.net
	- The connectors also make direct IP connections to the [Azure data center IP ranges](https://www.microsoft.com/en-us/download/details.aspx?id=41653).
	- Ensure that the firewall does not perform SSL inspection as the connectors use client certificates to communicate with Azure AD.
	- Ensure that the connectors can make outbound requests to Azure AD over ports 80 and 443.
      - If your firewall enforces rules according to originating users, open these ports for traffic coming from Windows services running as a Network Service.
      - The connectors make HTTP requests over port 80 for downloading SSL certificate revocation lists. This is also needed for the auto-update capability to function properly.
      - The connectors make HTTPS requests over port 443 for all other operations such as enabling and disabling the feature, registering connectors, downloading connector updates, and handling all user sign-in requests.

>[!NOTE]
>We have recently made improvements to reduce the number of ports required by the connectors to communicate with our service. If you are running older versions of Azure AD Connect and / or standalone connectors, you should continue to keep those additional ports (5671, 8080, 9090, 9091, 9350, 9352, 10100-10120) open.

### Enabling Azure AD Pass-through Authentication

Azure AD pass-through authentication can be enabled via Azure AD Connect.

If you are performing a new installation of Azure AD Connect, choose the [custom installation path](active-directory-aadconnect-get-started-custom.md). At the "User sign-in" page, select "Pass-through authentication". On successful completion, this installs a pass-through authentication connector on the same server as Azure AD Connect. In addition, it enables the pass-through authentication feature on your tenant.

![Azure AD Connect - User sign-in](./media/active-directory-aadconnect-sso/sso3.png)

If you already have an installation of Azure AD Connect, setup using the [express installation](active-directory-aadconnect-get-started-express.md) or the [custom installation](active-directory-aadconnect-get-started-custom.md) path, choose "Change user sign-in page" on Azure AD Connect and click "Next". Then select "Pass-through authentication" to install a pass-through authentication connector on the same server as Azure AD Connect and enable the feature on your tenant.

![Azure AD Connect - Change user sign-in](./media/active-directory-aadconnect-user-signin/changeusersignin.png)

>[!IMPORTANT]
>Azure AD pass-through authentication is a tenant-level feature. It affects user sign-in across all managed domains in your tenant. However, users from federated domains will continue to sign in using Active Directory Federation Services (ADFS) or any other federation provider that you have previously configured. If you convert a domain from federated to managed, all users in that domain automatically start signing in using pass-through authentication. Cloud-only users are not affected by pass-through authentication.

### Ensuring high availability

If you are planning to use pass-through authentication in a production deployment, it is highly recommended that you install a second connector on a separate server (other than the one running Azure AD Connect and the first connector) to ensure that you have high availability of sign-in requests. You can install as many additional connectors as you need; this is based on the peak and average number of sign-in requests that your tenant handles.

Follow the instructions below to deploy a standalone connector:

#### Step 1: Download and install the connector

In this step, you download and install the connector software on your server.

1.	[Download](https://go.microsoft.com/fwlink/?linkid=837580) the latest connector. Verify that the connector version is 1.5.58.0 or higher.
2.	Open a command prompt as an Administrator.
3.	Run the following command (/q means quiet installation - the installation does not prompt you to accept the End User License Agreement):

`
AADApplicationProxyConnectorInstaller.exe REGISTERCONNECTOR="false" /q
`
>[!NOTE]
>You can only install a single connector per server.

#### Step 2: Register the connector with Azure AD for pass-through authentication

In this step, you register the installed connector on your server with our service and make it available to receive sign-in requests.

1.	Open a PowerShell window as an Administrator.
2.	Navigate to **C:\Program Files\Microsoft AAD App Proxy Connector** and run the script as follows:
`.\RegisterConnector.ps1 -modulePath "C:\Program Files\Microsoft AAD App Proxy Connector\Modules\" -moduleName "AppProxyPSModule" -Feature PassthroughAuthentication`
3.	When prompted, enter the credentials of Global Administrator account on your Azure AD tenant.

## How does Azure AD Pass-through Authentication work?

When a user attempts to sign into Azure AD (and if pass-through authentication is enabled on the tenant), the following occurs:

1. The user enters their username and password into the Azure AD sign-in page. Our service places the username and password (encrypted using a public key) on a queue for validation.
2. One of the available on-premises connectors makes an outbound call to the queue and retrieves the username and password.
3. The connector then validates the username and password against your Active Directory using standard Windows APIs (a similar mechanism to what is used by ADFS). Note that the username can be either the on-premises default username (usually, "userPrincipalName") or another attribute (known as "Alternate ID") configured in Azure AD Connect.
4. The on-premises Domain Contoller then evaluates the request and returns a response (success or failure) to the connector.
5. The connector, in turn, returns this response back to Azure AD.
6. Azure AD then evaluates the response and responds to the user as appropriate. For example, it issues a token back to the application or asks for multi-factor authentication.

The diagram below also illustrates the various steps. Note that all requests and responses are made over the HTTPS channel.

![Pass-through Authentication](./media/active-directory-aadconnect-pass-through-authentication/pta2.png)

### Note about password writeback

In case you have configured [password writeback](../active-directory-passwords-update-your-own-password.md) on your tenant and for a specific user, if the user signs in using pass-through authentication, they will be able to change or reset their passwords as before. The passwords will be written back to your on-premises Active Directory as expected.

However, if one of these conditions is not true (password writeback is not configured on your tenant or the user doesn't have a valid Azure AD license assigned to them), then the user will not be allowed to update their passwords in the cloud, including if their password has expired. The user will instead see a message as follows: "Your organization doesn't allow you to update your password on this site. Please update it according to the method recommended by your organization, or ask your admin if you need help.".

## Troubleshooting Pass-through authentication

This section will help you find troubleshooting information about some of the common issues during the installation, registration or un-installation of pass-through authentication connectors (either via Azure AD Connect or standalone). And during enabling and operating of the feature on your tenant.

### Issues during installation of connectors (either via Azure AD Connect or standalone)

#### An Azure AD Application Proxy connector already exists

A pass-through authentication connector cannot be installed on the same server as an [Azure AD Application Proxy](../../active-directory/active-directory-application-proxy-get-started.md) connector. You will need to install the pass-through authentication connector on a separate server.

#### An unexpected error occured

[Collect connector logs](#collecting-pass-through-authentication-connector-logs) from the server and contact Microsoft Support with your issue.

### Issues during registration of connectors

#### Registration of the connecter failed due to blocked port(s)

Ensure that the server on which the connector has been installed can communicate with our service URLs and ports listed [here](#pre-requisites).

#### Registration of the connector failed due to token or account authorization errors

Ensure that you use a cloud-only Global Administrator account for all Azure AD Connect or standalone connector installation and registration operations. There is a known issue with MFA-enabled Global Administrator accounts; turn off MFA temporarily (only to complete the operations) as a workaround.

#### An unexpected error occurred

[Collect connector logs](#collecting-pass-through-authentication-connector-logs) from the server and contact Microsoft Support with your issue.

### Issues during un-installation of connectors

#### Warning message when un-installing Azure AD Connect

If you have pass-through authentication enabled on your tenant and you try to un-install Azure AD Connect, it will show you the following warning message: "Users will not be able to sign-in to Azure AD unless you have other pass-through authentication agents installed on other servers.".

You need to have a [high availability](#ensuring-high-availability) setup in place before you un-install Azure AD Connect to avoid breaking user sign-in.

### Issues with enabling the pass-through authentication feature

#### The enabling of the feature failed because there were no connectors available

You need to have at least one active connector to enable pass-through authentication on your tenant. You can install a connector by either installing Azure AD Connect or a standalone connector.

#### The enabling of the feature failed due to blocked port(s)

Ensure that the server on which Azure AD Connect is installed can communicate with our service URLs and ports listed [here](#pre-requisites).

#### The enabling of the feature failed due to token or account authorization errors

Ensure that you use a cloud-only Global Administrator account when enabling the feature. There is a known issue with multi-factor authentication (MFA)-enabled Global Administrator accounts; turn off MFA temporarily (only to complete the operation) as a workaround.

### Issues while operating the pass-through authentication feature

#### User-facing sign-in errors

The feature reports the following user-facing errors on the Azure AD sign-in screen. They are detailed below together with their appropriate resolution steps.

|Error|Description|Resolution
| --- | --- | ---
|AADSTS80001|Unable to connect to Active Directory|Ensure that connector servers are members of the same AD forest as the users whose passwords need to be validated and they are able to connect to Active Directory.  
|AADSTS8002|A timeout occurred connecting to Active Directory|Check to ensure that Active Directory is available and is responding to requests from the connectors.
|AADSTS80004|The username passed to the connector was not valid|Ensure the user is attempting to sign in with the right username.
|AADSTS80005|Validation encountered unpredictable WebException|This is likely a transient error. Retry the request. If it continues to fail, contact Microsoft support.
|AADSTS80007|An error occurred communicating with Active Directory|Check the connector logs for more information and verify that Active Directory is operating as expected.

### Collecting pass-through authentication connector logs

Depending on the type of issue you may have, you will need to look in different places for pass-through authentication connector logs.

#### Connector event logs

For errors related to the connector open up the Event Viewer application on the server and check under **Application and Service Logs\Microsoft\AadApplicationProxy\Connector\Admin**.

For detailed analytics and debugging logs you can enable the "Session" log. Don't run the connector with this log enabled during normal operations; only use this for troubleshooting. Note that the log contents are only visible after the log is disabled again.

#### Detailed trace logs

To troubleshoot user sign-in failures, look for trace logs at **C:\Programdata\Microsoft\Microsoft AAD Application Proxy Connector\Trace**. These logs include reasons why a specific user sign-in failed using the pass-through authentication feature. Given below is an example log entry:

```
	ApplicationProxyConnectorService.exe Error: 0 : Passthrough Authentication request failed. RequestId: 'df63f4a4-68b9-44ae-8d81-6ad2d844d84e'. Reason: '1328'.
	    ThreadId=5
	    DateTime=xxxx-xx-xxTxx:xx:xx.xxxxxxZ
```

You can get descriptive details of the error ('1328' in the above example) by opening up the command prompt and running the following command. Note: You will need to replace '1328' with the actual error number that you see in your logs.

`Net helpmsg 1328`

The result should look something like this:

![Pass-through Authentication](./media/active-directory-aadconnect-pass-through-authentication/pta3.png)

#### Domain Controller logs

If audit logging is enabled, additional information can be found in the security logs of your Domain Controllers. A simple way to query sign-in requests sent by pass-through authentication connectors is as follows:

```
    <QueryList>
    <Query Id="0" Path="Security">
    <Select Path="Security">*[EventData[Data[@Name='ProcessName'] and (Data='C:\Program Files\Microsoft AAD App Proxy Connector\ApplicationProxyConnectorService.exe')]]</Select>
    </Query>
    </QueryList>
```

## Feedback

Your feedback is important to us. You can email us at [aadopauthfeedback@microsoft.com](mailto:aadopauthfeedback@microsoft.com). If you have requests for new features, use our [UserVoice forum](https://feedback.azure.com/forums/169401-azure-active-directory/category/160611-directory-synchronization-aad-connect) - we're listening.
