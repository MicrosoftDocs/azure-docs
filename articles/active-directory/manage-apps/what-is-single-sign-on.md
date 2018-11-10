---
title: Single sign-on to applications - Azure Active Directory | Microsoft Docs
description: Learn how to choose a single sign-on method when configuring applications in Azure Active Directory (Azure AD). Use single sign-on so users don't need to remember passwords for every application, and to simplify the administration of account management.
services: active-directory
author: barbkess
manager: mtillman
ms.service: active-directory
ms.component: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 11/09/2018
ms.author: barbkess
ms.reviewer: arvindh

---

# Single sign-on to applications in Azure Active Directory
Learn how to choose the most appropriate single sign-on method when configuring applications in Azure Active Directory (Azure AD). With single sign-on, end-users sign on once and don't need to remember passwords. Administrators can centralize account management, and don't need to manage passwords for each application.

## What is single sign-on for applications?

Single sign-on enables a user to sign in once with a single user account. After signing in, the user can launch applications from the Office 365 portal or the Azure AD MyApps access panel.

- **With single sign-on**, users sign in once with one account to access domain-joined devices, company resources, software as a service (SaaS) applications, and web applications. Administrators can centralize user account management, and automatically add or remove user access to applications based on group membership. 

- **Without single sign-on**, users must remember application-specific passwords and sign in to each application. IT staff needs to create and update user accounts for each application such as Office 365, Box, and Salesforce. Users need to remember their passwords, plus spend the time to sign in to each application.

The remainder of this article describes the single sign-on methods, and helps you choose the best method for your applications.

## Choosing a single sign-on method

There are several ways to configure an application for single sign-on. 

- **We recommend using SAML single sign-on** whenever your cloud application supports one of the SAML-based protocols. This is the most secure method since Azure AD handles the authentication.
- **Single sign-on works for on-premises applications through [Azure AD Application Proxy](application-proxy.md).** Once users authenticate to Azure AD in the cloud, the Application Proxy connector handles the authentication to the on-premises application. The on-premises application can't tell the difference between a remote user signing in through Application Proxy and a user signing in from a domain joined device.

The following flowchart helps you decide which single sign-on method is best for your situation. The on-premises choices work when applications are configured for Application Proxy.

![Choose single sign-on method](./media/what-is-single-sign-on/choose-single-sign-on-method.png)

### Summary of the single sign-on methods


All of the single sign-on methods automatically sign users in to applications without requiring a second sign-on. The difference between approaches is how authentication works.


**SAML (cloud applications)**

SAML single sign-on enables rich and secure authentication to applications using the SAML protocol. We recommend using SAML single sign-on** whenever the application supports one of the SAML-based protocols. For more information, see [SAML SSO](#saml-sso).

**Password-based (cloud and on-premises applications)**

Password-based single sign-on enables secure application password storage and replay using a web browser extension or mobile app. This method uses the existing sign-in process provided by the application, but enables an administrator to manage the passwords. For more information, see [Password-based SSO](#password-based-sso).

**Linked (cloud and on-premises applications)**

Linked sign-on allows you to provide a link to an application in the Azure Active Directory MyApps access panel or the Office 365 application launcher. This option doesn't add single sign-on to the application, however the application may already have single sign-on implemented using another service such as Active Directory Federation Services. For more information, see [Linked sign-on](#linked).

**Integrated Windows Authentication (on-premises applications)**

Azure AD Application Proxy provides single sign-on (SSO) to applications that use [Integrated Windows Authentication (IWA)](/aspnet/web-api/overview/security/integrated-windows-authentication), or claims-aware applications. The Application Proxy connectors use Kerberos constrained delegation to authenticate users to the application. For more information, see [Integrated Windows Authentication (IWA)](#integrated-windows-authentication-iwa).

**Header-based (on-premises applications)**
Using PingAccess for Azure Active Directory, users can single sign-on to applications that use headers for authentication. Application Proxy treats these applications like any other using Azure AD to authenticate access and then passing traffic through the connector service. For more information, see [Header-based SSO](#header-based-sso).

**Disabled (cloud and on-premises applications)**
Disabled means that when a user signs in to the application, that user must manually enter their username and password. Users will need to enter their username and password every time they launch this application. For more information, see [Disabled SSO](#disabled-sso).


## SAML SSO
With **SAML single sign-on**, Azure AD authenticates to the application by using the user's Azure AD account. Azure AD communicates the sign-on information to the application through a connection protocol. With SAML-based single sign-on, you can map users to specific application roles based on rules you define in your SAML claims

SAML-based single sign-on is:

- More secure than password-based single sign-on and all other sign-on methods.
- Our recommended method for single sign-on.

SAML-based single sign-on is supported for applications that use any of these protocols:

- SAML 2.0
- WS-Federation
- OpenID connect

To configure an application for SAML-based single sign-on, see [Configure SAML-based single sign-on](configure-single-sign-on-portal.md). Also, many applications have [application-specific tutorials](../saas-apps/tutorial-list.md) that step you through configuring SAML-based single sign-on for specific applications. 

For more information about how the SAML protocol works, see [Single sign-on SAML protocol](../develop/single-sign-on-saml-protocol.md).

## Password-based SSO
With password-based sign-on, the application authenticates to the application with a username and password. End-users sign in to the application the first time they access it. After the first sign-on, Azure Active Directory supplies the username and password to the application. 

Password-based single sign-on uses the existing authentication process provided by the application. When you enable password single sign-on for an application, Azure AD collects and securely stores user names and passwords for the application. User credentials are stored in an encrypted state in the directory. 

Use password-based single sign-on when:

- An application can't support SAML single sign-on protocol.
- An application authenticates with a username and password instead of access tokens and headers.

Password-based single sign-on is supported for any cloud-based application that has an HTML-based sign-in page. The user can use any of the following browsers:

- Internet Explorer 11 on Windows 7 or later
- Edge on Windows 10 Anniversary Edition or later 
- Chrome on Windows 7 or later, and on MacOS X or later
- Firefox 26.0 or later on Windows XP SP2 or later, and on Mac OS X 10.6 or later

To configure a cloud application for password-based single sign-on, see [Configure the application for password single sign-on](application-sign-in-problem-password-sso-gallery.md#configure-the-application-for-password-single-sign-on).

To configure an on-premises application for single sign-on through Application Proxy, see [Password vaulting for single sign-on with Application Proxy](application-proxy-configure-single-sign-on-password-vaulting.md)

### Managing credentials for password-based SSO

To authenticate a user to an application, Azure AD retrieves the user's credentials from the directory and enters them into the application's sign-in page.  Azure AD securely passes the user credentials via a web browser extension or mobile app. This process enables an administrator to manage user credentials, and doesn't require users to remember their password.

> [!IMPORTANT]
> The credentials are obfuscated from the end user during the automated sign-in process. However, the credentials are discoverable by using web-debugging tools. Users and administrators need to follow the same security policies as if credentials were entered directly by the user.

Passwords for each application can either be managed by the Azure AD administrator or by the users.

When the Azure AD administrator manages the credentials:  

- The user doesn't need to reset or remember the user name and password. The user can access the application by clicking on it in their access panel or via a provided link.
- The administrator can perform management tasks on the credentials. For example, the administrator can update application access according to user group memberships and employee status.
- The administrator can use administrative credentials to provide access to applications shared among many users. For example, the administrator can allow everyone who can access an application to have access to a social media or document sharing application.

When the end user manages the credentials:

- Users can manage their passwords by updating or deleting them as needed. 
- Administrators can still set new credentials for the application at a future date without changing the application access experience of the end user.


## Linked sign-on
Linked sign-on enables Azure AD to provide single sign-on to an application that is already configured for single sign-on in another service. The linked application can appear to end users in the Office 365 portal or Azure AD MyApps portal. For example, a user can launch an application that is configured for single sign-on in Active Directory Federation Services 2.0 (AD FS) from the Office 365 portal. Additional reporting is also available for linked applications that are launched from the Office 365 portal or the Azure AD MyApps portal. 

Use linked single sign-on to:

- Provide a consistent user experience while you migrate applications over a period of time. If you're migrating applications to Azure Active Directory, you can use linked single sign-on to quickly publish links to all the applications you intend to migrate.  Users can find all the links in the [MyApps portal](../user-help/active-directory-saas-access-panel-introduction.md) or the [Office 365 application launcher](https://support.office.com/article/meet-the-office-365-app-launcher-79f12104-6fed-442f-96a0-eb089a3f476a). Users won't know they are accessing a linked application or a migrated application.  

Once a user has authenticated with an application, they also need to have an account record provisioned at the application that tells the application where the permissions and level of access are inside the application. The provisioning of this account record can either occur automatically, or it can occur manually by an administrator before the user is provided single sign-on access.

## Disabled SSO

Disabled single sign-on mode means single sign-on isn't used for the application. When single sign-on is disabled, users might need to authenticate twice. First, users authenticate to Azure AD, and then they sign in to the application. 

Use disabled single sign-on mode:

- If you're not ready to integrate this application with Azure AD single sign-on, or
- If you're testing other aspects of the application, or
- If you have an on-premises application that doesn't require users to authenticate, but you want to add Azure AD as a layer of security for remote access. 

## Integrated Windows Authentication (IWA)

Azure AD Application Proxy provides single sign-on (SSO) to applications that use [Integrated Windows Authentication (IWA)](/aspnet/web-api/overview/security/integrated-windows-authentication), or claims-aware applications. If your application uses IWA, Application Proxy authenticates to the application by using Kerberos Constrained Delegation (KCD). If you have a claims-aware application that trusts Azure Active Directory, SSO works because the user was already authenticated by using Azure AD.

Use Integrated Windows Authentication single sign-on mode:

- To provide single sign-on to an on-premises app that authenticates with IWA. 

To configure an on-premises app for IWA single sign-on with Application Proxy, see [Kerberos Constrained Delegation for single sign-on to your applications with Application Proxy](application-proxy-configure-single-sign-on-with-kcd.md). 

### How single sign-on with KCD works
This diagram explains the flow when a user attempts to access an on-prem application that uses IWA.

![Microsoft AAD authentication flow diagram](./media/application-proxy-configure-single-sign-on-with-kcd/AuthDiagram.png)

1. The user enters the URL to access the on-prem application through Application Proxy.
2. Application Proxy redirects the request to Azure AD authentication services to preauthenticate. At this point, Azure AD applies any applicable authentication and authorization policies, such as multifactor authentication. If the user is validated, Azure AD creates a token and sends it to the user.
3. The user passes the token to Application Proxy.
4. Application Proxy validates the token and retrieves the User Principal Name (UPN) from it, and then sends the request, the UPN, and the Service Principal Name (SPN) to the Connector through a dually authenticated secure channel.
5. The Connector performs Kerberos Constrained Delegation (KCD) negotiation with the on-prem AD, impersonating the user to get a Kerberos token to the application.
6. Active Directory sends the Kerberos token for the application to the Connector.
7. The Connector sends the original request to the application server, using the Kerberos token it received from AD.
8. The application sends the response to the Connector, which is then returned to the Application Proxy service and finally to the user.

## Header-based SSO

Header-based single sign-on works for applications that use HTTP headers for authentication. This sign-on method uses a third-party authentication service called PingAccess. A user only needs to authenticate to Azure AD. After authentication occurs, the PingAccess service translates the Azure AD access token into a header format that is sent to the application.

Use header-based single sign-on when:

- Application Proxy and PingAccess are configured for the application

To configure header-based authentication, see [Header-based authentication for single sign-on with Application Proxy](application-proxy-configure-single-sign-on-with-ping-access.md). 

### What is PingAccess for Azure AD?

Using PingAccess for Azure AD, users can access and single sign-on to applications that use headers for authentication. Application Proxy treats these applications like any other, using Azure AD to authenticate access and then passing traffic through the connector service. PingAccess sits in front of the applications and translates the access token from Azure AD into a header so that the application receives the authentication in the format it can read.

Your users won’t notice anything different when they sign in to use your corporate applications. They can still work from anywhere on any device. 

Since the Application Proxy connectors direct remote traffic to all applications regardless of their authentication type, they’ll continue to load balance automatically, as well.

### How do I get a license for PingAccess?

Since this scenario is offered through a partnership between Azure Active Directory and PingAccess, you need licenses for both services. However, Azure Active Directory Premium subscriptions include a basic PingAccess license that covers up to 20 applications. If you need to publish more than 20 header-based applications, you can purchase an additional license from PingAccess. 

For more information, see [Azure Active Directory editions](../fundamentals/active-directory-whatis.md).

## Related articles
* [Tutorials for integrating SaaS applications with Azure Active Directory](../saas-apps/tutorial-list.md)
* [Tutorial for configuring single sign-on](configure-single-sign-on-portal.md)
* [Introduction to Managing Access to applications](what-is-access-management.md)
* Download link: [Single sign-on deployment plan](http://aka.ms/SSODeploymentPlan).


