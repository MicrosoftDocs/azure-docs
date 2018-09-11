---
title: Single sign-on with Application Proxy | Microsoft Docs
description: Covers how to provide single sign-on using Azure AD Application Proxy.
services: active-directory
documentationcenter: ''
author: barbkess
manager: mtillman

ms.service: active-directory
ms.component: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/24/2018
ms.author: barbkess
ms.reviewer: harshja
ms.custom: H1Hack27Feb2017, it-pro

---

# Kerberos Constrained Delegation for single sign-on to your apps with Application Proxy

You can provide single sign-on for on-premises applications published through Application Proxy that are secured with Integrated Windows Authentication. These applications require a Kerberos ticket for access. Application Proxy uses Kerberos Constrained Delegation (KCD) to support these applications. 

You can enable single sign-on to your applications using Integrated Windows Authentication (IWA) by giving Application Proxy connectors permission in Active Directory to impersonate users. The connectors use this permission to send and receive tokens on their behalf.

## How single sign-on with KCD works
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

## Prerequisites
Before you get started with single sign-on for IWA applications, make sure your environment is ready with the following settings and configurations:

* Your apps, like SharePoint Web apps, are set to use Integrated Windows Authentication. For more information, see [Enable Support for Kerberos Authentication](https://technet.microsoft.com/library/dd759186.aspx), or for SharePoint see [Plan for Kerberos authentication in SharePoint 2013](https://technet.microsoft.com/library/ee806870.aspx).
* All your apps have [Service Principal Names](https://social.technet.microsoft.com/wiki/contents/articles/717.service-principal-names-spns-setspn-syntax-setspn-exe.aspx).
* The server running the Connector and the server running the app are domain joined and part of the same domain or trusting domains. For more information on domain join, see [Join a Computer to a Domain](https://technet.microsoft.com/library/dd807102.aspx).
* The server running the Connector has access to read the TokenGroupsGlobalAndUniversal attribute for users. This default setting might have been impacted by security hardening the environment.

### Configure Active Directory
The Active Directory configuration varies, depending on whether your Application Proxy connector and the application server are in the same domain or not.

#### Connector and application server in the same domain
1. In Active Directory, go to **Tools** > **Users and Computers**.
2. Select the server running the connector.
3. Right-click and select **Properties** > **Delegation**.
4. Select **Trust this computer for delegation to specified services only**. 
5. Under **Services to which this account can present delegated credentials** add the value for the SPN identity of the application server. This enables the Application Proxy Connector to impersonate users in AD against the applications defined in the list.

   ![Connector-SVR Properties window screenshot](./media/application-proxy-configure-single-sign-on-with-kcd/Properties.jpg)

#### Connector and application server in different domains
1. For a list of prerequisites for working with KCD across domains, see [Kerberos Constrained Delegation across domains](https://technet.microsoft.com/library/hh831477.aspx).
2. Use the `principalsallowedtodelegateto` property on the Connector server to enable the Application Proxy to delegate for the Connector server. The application server is `sharepointserviceaccount` and the delegating server is `connectormachineaccount`. For Windows 2012 R2, use this code as an example:

        $connector= Get-ADComputer -Identity connectormachineaccount -server dc.connectordomain.com

        Set-ADComputer -Identity sharepointserviceaccount -PrincipalsAllowedToDelegateToAccount $connector

        Get-ADComputer sharepointserviceaccount -Properties PrincipalsAllowedToDelegateToAccount

Sharepointserviceaccount can be the SPS machine account or a service account under which the SPS app pool is running.

## Configure single sign-on 
1. Publish your application according to the instructions described in [Publish applications with Application Proxy](application-proxy-publish-azure-portal.md). Make sure to select **Azure Active Directory** as the **Preauthentication Method**.
2. After your application appears in the list of enterprise applications, select it and click **Single sign-on**.
3. Set the single sign-on mode to **Integrated Windows Authentication**.  
4. Enter the **Internal Application SPN** of the application server. In this example, the SPN for our published application is http/www.contoso.com. This SPN needs to be in the list of services to which the connector can present delegated credentials. 
5. Choose the **Delegated Login Identity** for the connector to use on behalf of your users. For more information, see [Working with different on-premises and cloud identities](#Working-with-different-on-premises-and-cloud-identities)

   ![Advanced Application Configuration](./media/application-proxy-configure-single-sign-on-with-kcd/cwap_auth2.png)  


## SSO for non-Windows apps

The Kerberos delegation flow in Azure AD Application Proxy starts when Azure AD authenticates the user in the cloud. Once the request arrives on-premises, the Azure AD Application Proxy connector issues a Kerberos ticket on behalf of the user by interacting with the local Active Directory. This process is referred to as Kerberos Constrained Delegation (KCD). In the next phase, a request is sent to the backend application with this Kerberos ticket. 

There are several protocols that define how to send such requests. Most non-Windows servers expect to negotiate with SPNEGO. This protocol is supported on Azure AD Application Proxy, but is disabled by default. A server can be configured for SPNEGO or standard KCD, but not both.

If you configure a connector machine for SPNEGO, make sure that all other connectors in that Connector group are also configured with SPNEGO. Applications expecting standard KCD should be routed through other connectors that are not configured for SPNEGO.
 

To enable SPNEGO:

1. Open an command prompt that runs as administrator.
2. From the command prompt, run the following commands on the connector servers that need SPNEGO.

    ```
    REG ADD "HKLM\SOFTWARE\Microsoft\Microsoft AAD App Proxy Connector" /v UseSpnegoAuthentication /t REG_DWORD /d 1
    net stop WAPCSvc & net start WAPCSvc
    ```

For more information about Kerberos, see [All you want to know about Kerberos Constrained Delegation (KCD)](https://blogs.technet.microsoft.com/applicationproxyblog/2015/09/21/all-you-want-to-know-about-kerberos-constrained-delegation-kcd).

Non-Windows apps typically user usernames or SAM account names instead of domain email addresses. If that situation applies to your applications, you need to configure the delegated login identity field to connect your cloud identities to your application identities. 

## Working with different on-premises and cloud identities
Application Proxy assumes that users have exactly the same identity in the cloud and on-premises. If that's not the case, you can still use KCD for single sign-on. Configure a **Delegated login identity** for each application to specify which identity should be used when performing single sign-on.  

This capability allows many organizations that have different on-premises and cloud identities to have SSO from the cloud to on-premises apps without requiring the users to enter different usernames and passwords. This includes organizations that:

* Have multiple domains internally (joe@us.contoso.com, joe@eu.contoso.com) and a single domain in the cloud (joe@contoso.com).
* Have non-routable domain name internally (joe@contoso.usa) and a legal one in the cloud.
* Do not use domain names internally (joe)
* Use different aliases on-prem and in the cloud. For example, joe-johns@contoso.com vs. joej@contoso.com  

With Application Proxy, you can select which identity to use to obtain the Kerberos ticket. This setting is per application. Some of these options are suitable for systems that do not accept email address format, others are designed for alternative login.

![Delegated login identity parameter screenshot](./media/application-proxy-configure-single-sign-on-with-kcd/app_proxy_sso_diff_id_upn.png)

If delegated login identity is used, the value might not be unique across all the domains or forests in your organization. You can avoid this issue by publishing these applications twice using two different Connector groups. Since each application has a different user audience, you can join its Connectors to a different domain.

### Configure SSO for different identities
1. Configure Azure AD Connect settings so the main identity is the email address (mail). This is done as part of the customize process, by changing the **User Principal Name** field in the sync settings. These settings also determine how users log in to Office365, Windows10 devices, and other applications that use Azure AD as their identity store.  
   ![Identifying users screenshot - User Principal Name dropdown](./media/application-proxy-configure-single-sign-on-with-kcd/app_proxy_sso_diff_id_connect_settings.png)  
2. In the Application Configuration settings for the application you would like to modify, select the **Delegated Login Identity** to be used:

   * User Principal Name (for example, joe@contoso.com)
   * Alternate User Principal Name (for example, joed@contoso.local)
   * Username part of User Principal Name (for example, joe)
   * Username part of Alternate User Principal Name (for example, joed)
   * On-premises SAM account name (depends on the domain controller configuration)

### Troubleshooting SSO for different identities
If there is an error in the SSO process, it appears in the connector machine event log as explained in [Troubleshooting](application-proxy-back-end-kerberos-constrained-delegation-how-to.md).
But, in some cases, the request is successfully sent to the backend application while this application replies in various other HTTP responses. Troubleshooting these cases should start by examining event number 24029 on the connector machine in the Application Proxy session event log. The user identity that was used for delegation appears in the “user” field within the event details. To turn on session log, select **Show analytic and debug logs** in the event viewer view menu.

## Next steps

* [How to configure an Application Proxy application to use Kerberos Constrained Delegation](application-proxy-back-end-kerberos-constrained-delegation-how-to.md)
* [Troubleshoot issues you're having with Application Proxy](application-proxy-troubleshoot.md)


For the latest news and updates, check out the [Application Proxy blog](http://blogs.technet.com/b/applicationproxyblog/)

