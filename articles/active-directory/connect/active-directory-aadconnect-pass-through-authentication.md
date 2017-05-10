---
title: 'Azure AD Connect: Pass-through Authentication | Microsoft Docs'
description: This article describes Azure Active Directory (Azure AD) Pass-through Authentication and how it allows Azure AD sign-ins by validating users' passwords against your on-premises Active Directory.
services: active-directory
keywords: what is Azure AD Connect Pass-through Authentication, install Active Directory, required components for Azure AD, SSO, Single Sign-on
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

# Configure user sign-in with Azure Active Directory Pass-through Authentication

## What is Azure Active Directory (Azure AD) Pass-through Authentication?

Allowing your users to use the same credentials (passwords) to sign into both on-premises resources and cloud-based services is benefical to your users and to your organization. Users will have one less password to remember. This provides a better user experience and reduces the chances that users will forget how to sign in. This, in turn, lowers your help desk costs since password-related issues typically consume the most support resources.

Many organizations use [Azure AD password synchronization](active-directory-aadconnectsync-implement-password-synchronization.md), a feature of [Azure AD Connect](active-directory-aadconnect.md) that synchronizes users' password hashes from on-premises Active Directory to Azure AD, as a way to provide users with the same credentials across on-premises resources and cloud-based services. However, other organizations require that passwords, even in a hashed form, do not leave their internal organizational boundaries.

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
>Azure AD Pass-through Authentication is currently in preview. It is a free feature and you don't need any paid editions of Azure AD to use it.

The following scenarios are fully supported during preview:

- All web browser-based applications.
- Office 365 client applications that support [modern authentication](https://aka.ms/modernauthga).

The following scenarios are NOT supported during preview:

- Legacy Office client applications and Exchange ActiveSync (i.e., native email applications on mobile devices).
  - Organizations are encouraged to switch to modern authentication, if possible. This allows for Pass-through Authentication support, but also helps you secure your identities using [conditional access](../active-directory-conditional-access.md) features such as multi-factor authentication.
- Azure AD Join for Windows 10 devices.

>[!IMPORTANT]
>As a workaround for scenarios that the Pass-through Authentication feature doesn't support today (legacy Office client applications, Exchange ActiveSync and Azure AD Join for Window 10 devices), password synchronization is also enabled by default when you enable Pass-through Authentication. Password synchronization acts as a fallback in only these specific scenarios. If you don't need this, you can turn off password synchronization on the [Optional Features](active-directory-aadconnect-get-started-custom.md#optional-features) page on Azure AD Connect wizard.

## How to enable Azure AD Pass-through Authentication?

### Prerequisites

Before you can enable Azure AD Pass-through Authentication, you need to have the following prerequisites in place:

- An Azure AD tenant for which you are a Global Administrator.

>[!NOTE]
>It is highly recommended that the Global Administrator account is a cloud-only account so that you can manage the configuration of your tenant should your on-premises services fail or become unavailable. You can add a cloud-only Global Administrator account as shown [here](../active-directory-users-create-azure-portal.md).

- Azure AD Connect version 1.1.486.0 or higher. It is recommended that you use the [latest version of Azure AD Connect](https://www.microsoft.com/download/details.aspx?id=47594).
- A server running Windows Server 2012 R2 or higher on which to run Azure AD Connect.
  - This server must be a member of the same AD forest as the users whose passwords need to be validated.
  - Note that a Pass-through Authentication connector is installed on the same server as Azure AD Connect. Verify that the connector version is 1.5.58.0 or higher.

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

Azure AD Pass-through Authentication can be enabled via Azure AD Connect.

If you are performing a new installation of Azure AD Connect, choose the [custom installation path](active-directory-aadconnect-get-started-custom.md). At the "User sign-in" page, select "Pass-through authentication". On successful completion, this installs a Pass-through Authentication connector on the same server as Azure AD Connect. In addition, it enables the Pass-through Authentication feature on your tenant.

![Azure AD Connect - User sign-in](./media/active-directory-aadconnect-sso/sso3.png)

If you already have an installation of Azure AD Connect, setup using the [express installation](active-directory-aadconnect-get-started-express.md) or the [custom installation](active-directory-aadconnect-get-started-custom.md) path, choose "Change user sign-in page" on Azure AD Connect and click "Next". Then select "Pass-through authentication" to install a Pass-through Authentication connector on the same server as Azure AD Connect and enable the feature on your tenant.

![Azure AD Connect - Change user sign-in](./media/active-directory-aadconnect-user-signin/changeusersignin.png)

>[!IMPORTANT]
>Azure AD Pass-through Authentication is a tenant-level feature. It affects user sign-in across all managed domains in your tenant. However, users from federated domains will continue to sign in using Active Directory Federation Services (ADFS) or any other federation provider that you have previously configured. If you convert a domain from federated to managed, all users in that domain automatically start signing in using Pass-through Authentication. Cloud-only users are not affected by Pass-through Authentication.

### Ensuring high availability

If you are planning to use Pass-through Authentication in a production deployment, it is highly recommended that you install a second connector on a separate server (other than the one running Azure AD Connect and the first connector) to ensure that you have high availability of sign-in requests. You can install as many additional connectors as you need; this is based on the peak and average number of sign-in requests that your tenant handles.

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

#### Step 2: Register the connector with Azure AD for Pass-through Authentication

In this step, you register the installed connector on your server with our service and make it available to receive sign-in requests.

1.	Open a PowerShell window as an Administrator.
2.	Navigate to **C:\Program Files\Microsoft AAD App Proxy Connector** and run the script as follows:
`.\RegisterConnector.ps1 -modulePath "C:\Program Files\Microsoft AAD App Proxy Connector\Modules\" -moduleName "AppProxyPSModule" -Feature PassthroughAuthentication`
3.	When prompted, enter the credentials of Global Administrator account on your Azure AD tenant.

## How does Azure AD Pass-through Authentication work?

When a user attempts to sign into Azure AD (and if Pass-through Authentication is enabled on the tenant), the following occurs:

1. The user enters their username and password into the Azure AD sign-in page. Our service places the username and password (encrypted using a public key) on a queue for validation.
2. One of the available on-premises connectors makes an outbound call to the queue and retrieves the username and password.
3. The connector then validates the username and password against your Active Directory using standard Windows APIs (a similar mechanism to what is used by ADFS). Note that the username can be either the on-premises default username (usually, "userPrincipalName") or another attribute configured in Azure AD Connect (known as "Alternate ID").
4. The on-premises Domain Contoller then evaluates the request and returns a response (success or failure) to the connector.
5. The connector, in turn, returns this response back to Azure AD.
6. Azure AD then evaluates the response and responds to the user as appropriate. For example, it issues a token back to the application or asks for multi-factor authentication.

The diagram below also illustrates the various steps. Note that all requests and responses are made over the HTTPS channel.

![Pass-through Authentication](./media/active-directory-aadconnect-pass-through-authentication/pta2.png)

### Note about password writeback

In case you have configured [password writeback](../active-directory-passwords-update-your-own-password.md) on your tenant and for a specific user, if the user signs in using Pass-through Authentication, they will be able to change or reset their passwords as before. The passwords will be written back to your on-premises Active Directory as expected.

However, if one of these conditions is not true (password writeback is not configured on your tenant or the user doesn't have a valid Azure AD license assigned to them), then the user will not be allowed to update their passwords in the cloud, including if their password has expired. The user will instead see a message as follows: "Your organization doesn't allow you to update your password on this site. Please update it according to the method recommended by your organization, or ask your admin if you need help.".

## Next steps

- See how to enable the [Azure AD Seamless SSO](active-directory-aadconnect-sso.md) feature on your tenant.
- Read our [troubleshooting guide](active-directory-aadconnect-troubleshoot-pass-through-authentication.md) to learn how to resolve common issues with Azure AD Pass-through Authentication.

## Feedback

Your feedback is important to us. Use the comments section below if you have questions. Use our [UserVoice forum](https://feedback.azure.com/forums/169401-azure-active-directory/category/160611-directory-synchronization-aad-connect) for new feature requests.
