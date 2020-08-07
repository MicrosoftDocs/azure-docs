---
title: Azure AD Application Proxy frequently asked questions | Microsoft Docs
description: Learn answers to frequently asked questions (FAQ) about using Azure AD Application Proxy to publish internal, on-premises applications to remote users.  
services: active-directory
documentationcenter: ''
author: kenwith
manager: celestedg
ms.assetid:
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: reference
ms.date: 10/03/2019
ms.author: kenwith
ms.reviewer: japere
---

# Active Directory (Azure AD) Application Proxy frequently asked questions

This page answers frequently asked questions about Azure Active Directory (Azure AD) Application Proxy.

## Enabling Azure AD Application Proxy

### What license is required to use Azure AD Application Proxy?

To use Azure AD Application Proxy, you must have an Azure AD Premium P1 or P2 license. For more information about licensing, see [Azure Active Directory Pricing](https://azure.microsoft.com/pricing/details/active-directory/)

### Why is the "Enable Application Proxy button grayed out?

Make sure you have at least an Azure AD Premium P1 or P2 license and an Azure AD Application Proxy Connector installed. After you successfully install your first connector, the Azure AD Application Proxy service will be enabled automatically.

## Connector configuration

### Can Application Proxy Connector services run in a different user context than the default?

No, this scenario isn't supported. The default settings are:

- Microsoft AAD Application Proxy Connector - WAPCSvc - Network Service
- Microsoft AAD Application Proxy Connector Updater - WAPCUpdaterSvc - NT Authority\System

### My back-end application is hosted on multiple web servers and requires user session persistence (stickiness). How can I achieve session persistence? 

For recommendations, see [High availability and load balancing of your Application Proxy connectors and applications](application-proxy-high-availability-load-balancing.md).

### Is TLS termination (TLS/HTTPS inspection or acceleration) on traffic from the connector servers to Azure supported?

The Application Proxy Connector performs certificate-based authentication to Azure. TLS Termination (TLS/HTTPS inspection or acceleration) breaks this authentication method and isn't supported. Traffic from the connector to Azure must bypass any devices that are performing TLS Termination.  

### Can I place a forward proxy device between the connector server(s) and the back-end application server?
Yes, this scenario is supported starting from the connector version 1.5.1526.0. See [Work with existing on-premises proxy servers](application-proxy-configure-connectors-with-proxy-servers.md).

### Should I create a dedicated account to register the connector with Azure AD Application Proxy?

There's no reason to. Any global admin or application administrator account will work. The credentials entered during installation aren't used after the registration process. Instead, a certificate is issued to the connector, which is used for authentication from that point on.

### How can I monitor the performance of the Azure AD Application Proxy connector?

There are Performance Monitor counters that are installed along with the connector. To view them:  

1. Select **Start**, type "Perfmon", and press ENTER.
2. Select **Performance Monitor** and click the green **+** icon.
3. Add the **Microsoft AAD Application Proxy Connector** counters you want to monitor.

### Does the Azure AD Application Proxy connector have to be on the same subnet as the resource?

The connector isn't required to be on the same subnet. However, it needs name resolution (DNS, hosts file) to the resource and the necessary network connectivity (routing to the resource, ports open on the resource, etc.). For recommendations, see [Network topology considerations when using Azure Active Directory Application Proxy](application-proxy-network-topology.md).

### What versions of Windows Server can I install a connector on?
Application Proxy requires Windows Server 2012 R2 or later. There is currently a limitation on HTTP2 for Windows Server 2019. In order to successfully use the connector on Windows Server 2019, you will need to add the following registry key and restart the server:
	```
	HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Internet Settings\WinHttp\EnableDefaultHttp2 (DWORD) Value: 0 
	```


## Application configuration

### What is the length of the default and "long" back-end timeout? Can the timeout be extended?

The default length is 85 seconds. The "long" setting is 180 seconds. The timeout limit can't be extended.

### How do I change the landing page my application loads?

From the Application Registrations page, you can change the homepage URL to the desired external URL of the landing page. The specified page will load when the application is launched from My Apps or the Office 365 Portal. For configuration steps, see [Set a custom home page for published apps by using Azure AD Application Proxy](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-configure-custom-home-page)

### Can only IIS-based applications be published? What about web applications running on non-Windows web servers? Does the connector have to be installed on a server with IIS installed?

No, there's no IIS requirement for applications that are published. You can publish web applications running on servers other than Windows Server. However, you might not be able to use pre-authentication with a non-Windows Server, depending on if the web server supports Negotiate (Kerberos authentication). IIS isn't required on the server where the connector is installed.

## Integrated Windows Authentication

### When should I use the PrincipalsAllowedToDelegateToAccount method when setting up Kerberos Constrained Delegation (KCD)?

The PrincipalsAllowedToDelegateToAccount method is used when connector servers are in a different domain from the web application service account. It requires the use of Resource-based Constrained Delegation.
If the connector servers and the web application service account are in the same domain, you can use Active Directory Users and Computers to configure the delegation settings on each of the connector machine accounts, allowing them to delegate to the target SPN.

If the connector servers and the web application service account are in different domains, Resource-based delegation is used. The delegation permissions are configured on the target web server and web application service account. This method of Constrained Delegation is relatively new. The method was introduced in Windows Server 2012, which supports cross-domain delegation by allowing the resource (web service) owner to control which machine and service accounts can delegate to it. There's no UI to assist with this configuration, so you'll need to use PowerShell.
For more information, see the whitepaper [Understanding Kerberos Constrained Delegation with Application Proxy](https://aka.ms/kcdpaper).

### Does NTLM authentication work with Azure AD Application Proxy?

NTLM authentication can’t be used as a pre-authentication or single sign-on method. NTLM authentication can be used only when it can be negotiated directly between the client and the published web application. Using NTLM authentication usually causes a sign-in prompt to appear in the browser.

## Pass-through authentication

### Can I use Conditional Access Policies for applications published with pass-through authentication?

Conditional Access Policies are only enforced for successfully pre-authenticated users in Azure AD. Pass-through authentication doesn’t trigger Azure AD authentication, so Conditional Access Policies can't be enforced. With pass-through authentication, MFA policies must be implemented on the on-premises server, if possible, or by enabling pre-authentication with Azure AD Application Proxy.

### Can I publish a web application with client certificate authentication requirement?

No, this scenario isn't supported because Application Proxy will terminate TLS traffic.  

## Remote Desktop Gateway publishing

### How can I publish Remote Desktop Gateway over Azure AD Application Proxy?

Refer to [Publish Remote Desktop with Azure AD Application Proxy](application-proxy-integrate-with-remote-desktop-services.md).

### Can I use Kerberos Constrained Delegation (Single Sign-On - Windows Integrated Authentication) in the Remote Desktop Gateway publishing scenario?

No, this scenario isn't supported.  

### My users don't use Internet Explorer 11 and the pre-authentication scenario doesn’t work for them. Is this expected?

Yes, it’s expected. The pre-authentication scenario requires an ActiveX control, which isn't supported in third-party browsers.

### Is the Remote Desktop Web Client (HTML5) supported?

No, this scenario isn't currently supported. Follow our [UserVoice](https://aka.ms/aadapuservoice) feedback forum for updates on this feature.

### After I configured the pre-authentication scenario, I realized that the user has to authenticate twice: first on the Azure AD sign-in form, and then on the RDWeb sign-in form. Is this expected? How can I reduce this to one sign-in?

Yes, it's expected. If the user’s computer is Azure AD joined, the user signs in to Azure AD automatically. The user needs to provide their credentials only on the RDWeb sign-in form.

## SharePoint publishing

### How can I publish SharePoint over Azure AD Application Proxy?

Refer to [Enable remote access to SharePoint with Azure AD Application Proxy](application-proxy-integrate-with-sharepoint-server.md).

### Can I use the SharePoint mobile app (iOS/ Android) to access a published SharePoint server?

The [SharePoint mobile app](https://docs.microsoft.com/sharepoint/administration/supporting-the-sharepoint-mobile-apps-online-and-on-premises) does not support Azure Active Directory pre-authentication currently.

## Active Directory Federation Services (AD FS) publishing 

### Can I use Azure AD Application Proxy as AD FS proxy (like Web Application Proxy)?

No. Azure AD Application Proxy is designed to work with Azure AD and doesn’t fulfill the requirements to act as an AD FS proxy.

## WebSocket

### Does WebSocket support work for applications other than QlikSense?

Currently, WebSocket protocol support is still in public preview and it may not work for other applications. Some customers have had mixed success using WebSocket protocol with other applications. If you test such scenarios, we would love to hear your results. Please send us your feedback at aadapfeedback@microsoft.com.

Features (Eventlogs, PowerShell and Remote Desktop Services) in Windows Admin Center (WAC) or Remote Desktop Web Client (HTML5) do not work through Azure AD Application Proxy presently.

## Link translation

### Does using Link translation affect performance?

Yes. Link translation affects performance. The Application Proxy service scans the application for hardcoded links and replaces them with their respective, published external URLs before presenting them to the user. 

For best performance, we recommend using identical internal and external URLs by configuring [custom domains](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-configure-custom-domain). If using custom domains isn't possible, you can improve link translation performance by using the My Apps Secure Sign in Extension or Microsoft Edge Browser on mobile. See [Redirect hardcoded links for apps published with Azure AD Application Proxy](application-proxy-configure-hard-coded-link-translation.md).

## Wildcards

### How do I use wildcards to publish two applications with the same custom domain name but with different protocols, one for HTTP and one for HTTPS?

This scenario isn't supported directly. Your options for this scenario are:

1. Publish both the HTTP and HTTPS URLs as separate applications with a wildcard, but give each of them a different custom domain. This configuration will work since they have different external URLS.

2. Publish the HTTPS URL through a wildcard application. Publish the HTTP applications separately using these Application Proxy PowerShell cmdlets:
   - [Application Proxy Application Management](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0#application_proxy_application_management)
   - [Application Proxy Connector Management](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0#application_proxy_connector_management)
