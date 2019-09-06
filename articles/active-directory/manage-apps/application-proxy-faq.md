---
title: Azure AD Application Proxy frequently asked questions | Microsoft Docs
description: Learn answers to frequently asked questions (FAQ) about using Azure AD Application Proxy to publish internal, on-premises applications to remote users.  
services: active-directory
documentationcenter: ''
author: msmimart
manager: CelesteDG

ms.assetid:
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/18/2018
ms.author: mimart
ms.reviewer: japere
---

# Application Proxy frequently asked questions

## Connector configuration

### Can Connector services run in a different user context than the default?

No, this scenario isn't supported. The default settings are:

- Microsoft AAD Application Proxy Connector - WAPCSvc - Network Service
- Microsoft AAD Application Proxy Connector Updater - WAPCUpdaterSvc - NT Authority\System

### Is there a way to force all application requests to come through the same connector the initial request came through, for example, to ensure connector-to-application affinity?

There's no connector-to-application affinity. Consider using a load balancer device that can keep the session based on the X-Forwarded-For header. The connector places the X-Forwarded-For header with the original client IP into the requests sent to the back-end application. For best practices, see [High availability and load balancing of your Application Proxy connectors and applications](application-proxy-high-availability-load-balancing.md). Another possible workaround is to assign a connector group to the published application that has only one connector.

### Can I place a forward proxy device between the connector server(s) and the back-end Application server?

This scenario isn't currently supported. The connector uses the proxy settings for the outbound traffic to Azure.  

### Is SSL termination (SSL/HHTPS inspection or acceleration) on traffic from the connector servers supported?

The App Proxy Connector performs certificate-based authentication to the App Proxy Service. SSL Termination (SSL/HHTPS inspection or acceleration) breaks this authentication and isn't supported. Traffic from the connector must bypass any devices doing SSL Termination.  

### Should I create a dedicated account to register the connector with the Azure AD Application Proxy?

There's no reason to. Any global admin account will work. The credentials entered during installation aren't used after the registration process. Instead, a certificate is issued to the connector, which is used for authentication from that point on. You can see this certificate in the personal store of the computer account.

### How can I monitor the performance of the Azure AD Application Proxy connector?

There are Performance Monitor counters that are installed along with the connector. To view them:  

1. Select **Start**, type "Perfmon" and press Enter.
2. Select **Performance Monitor** and click the green **+** icon.
3. Add the **Microsoft AAD App Proxy Connector** counters you want to monitor.

### Does the Azure AD App Proxy connector have to be on the same subnet as the resource?

The connector isn't required to be on the same subnet. However, it needs name resolution to the resource and the necessary network connectivity (routing to the resource, ports open on the resource, etc.). For best practices, see [Network topology considerations when using Azure Active Directory Application Proxy](application-proxy-network-topology.md).

## Application configuration

### What is the length of the default and "long" backend timeout? Can this timeout be extended?

The default length is 85 seconds. The "long" setting is 180 seconds. Because of possible security risks, the timeout limit can't be extended.

### How do I change the landing page my application loads?

From the Application Registrations page, you can change the homepage URL to the desired external URL of the landing page. This page will load when the application is launched from My Apps.

### Can only IIS-based apps be published? What about web apps running on non-Windows web servers? Does the connector have to be installed on a server with IIS installed?

No, there's no IIS requirement for apps that are published. You can publish web apps running on servers other than Windows Server. However, you might not be able to use pre-authentication with a non-Windows Server, depending on if the web server supports Negotiate (Kerberos authentication). IIS does not have to be installed on the server where the connector is installed.

## Integrated Windows Authentication 

### When should I use the PrincipalsAllowedToDelegateToAccount method when setting up Kerberos Constrained Delegation (KCD)?

The PrincipalsAllowedToDelegateToAccount method is used when connector servers are in a different domain from the web application service account. It requires the use of Resource-based Constrained Delegation.
If the connector servers and the web application service account are in the same domain, you can use the Active Directory Users and Computers to configure the delegation settings on each of the connector machine accounts, allowing them to delegate to the target SPN.
If the connector servers and the web application service account are in different domains, Resource-based delegation is used. The delegation permissions are configured on the target web server and web application service account. This method of Constrained Delegation is relatively new. The method was introduced in Windows Server 2012, which supports cross-domain delegation by allowing the resource (web service) owner to control which machine and service accounts can delegate to it. There's no UI to assist with this configuration, so we need to use PowerShell.
For more information, see the whitepaper [Understanding Kerberos Constrained Delegation with Application Proxy](http://aka.ms/kcdpaper).

## Passthrough authentication

### Can I use multi-factor authentication (MFA) Conditional Access policies for apps published with passthrough authentication?

MFA Conditional Access policies are enforced only for pre-authenticated users. These policies aren't enforced for passthrough authentication. With passthrough authentication, MFA policies must be implemented on the on-premises server, if possible, or by enabling pre-authentication with Azure AD Application Proxy.

### Can I use client certification if used in passthrough?

No, this scenario isn't supported because Application Proxy will terminate TLS traffic.  

## Remote Desktop Gateway publishing 

### How can I publish Remote Desktop Gateway over Azure AD Application Proxy?

Refer to [Publish Remote Desktop with Azure AD Application Proxy](application-proxy-integrate-with-remote-desktop-services.md).

### Can I use Kerberos Constrained Delegation in the Remote Desktop Gateway publishing scenario?

No, this scenario isn't supported.  

### My users don't use Internet Explorer 11 and the pre-authentication scenario doesn’t work for them. Is this expected?

Yes, it’s expected. The pre-authentication scenario requires an ActiveX control, which isn't supported in third-party browsers.

### Is the Remote Desktop Web Client supported?

No, this scenario isn't currently supported. 

### After I configured the pre-authentication scenario, I realized that the user must do the authentication twice. First at the Azure AD logon form and secondly on the RDWEB logon form. Is this expected? How can I reduce the number of logons to one?

Yes, if the user’s computer is Azure AD joined, the user will be logged into Azure AD automatically. The user needs to provide their credentials only on the RDWEB logon form.

## SharePoint publishing

### How can I publish SharePoint over Azure AD Application Proxy?

Refer to [Enable remote access to SharePoint with Azure AD Application Proxy](application-proxy-integrate-with-sharepoint-server.md).

## AD FS publishing 

### Can I use Azure AD Application Proxy as AD FS proxy (like Web Application Proxy)?

No. Azure AD Application Proxy is a reverse proxy solution. It doesn’t fulfill the AD FS proxy requirements.

## WebSocket 

### Does WebSocket support work for other applications than QlikSense?

No. Currently, WebSocket protocol support is still in public preview and it may not work for other applications. It is on the roadmap to broaden its support for more applications.  

## Link Translation

### Is there a performance impact from using Link translation?

Yes. Link translation impacts performance. The Application Proxy service needs to scan the application for hardcoded links and replaces them with their respective, published external URLs before presenting them to the user. For better link translation performance, we recommend using the My Apps Secure Sign in Extension or Edge Browser on mobile. See [Redirect hardcoded links for apps published with Azure AD Application Proxy](application-proxy-configure-hard-coded-link-translation.md) 

## Wildcards

### How do I use wildcards to publish two applications with the same custom domain name but with different protocols (one for HTTP and one for HTTPS)?

This scenario isn't supported directly. Your options for this scenario are:

1. Publish both the HTTP and HTTPS URLs as separate apps with a wildcard, but give each of them a different custom domain. This configuration will work since they have different external URLS.
2. Publish the HTTPS URL through a wildcard app. Publish the HTTP apps separately using Application Proxy PowerShell cmdlets:
   - [Application Proxy Application Management](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0#application_proxy_application_management)
   - [Application Proxy Connector Management](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0#application_proxy_connector_management)