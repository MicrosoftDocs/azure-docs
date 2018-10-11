---
title: How to provide secure remote access to on-premises apps
description: Covers how to use Azure AD Application Proxy to provide secure remote access to your on-premises apps.
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
ms.date: 01/31/2018
ms.author: barbkess
ms.reviewer: harshja
ms.custom: it-pro

---

# How to provide secure remote access to on-premises applications

Employees today want to be productive at any place, at any time, and from any device. They want to work on their own devices, whether they be tablets, phones, or laptops. And they expect to be able to access all their applications, both SaaS apps in the cloud and corporate apps on-premises. Providing access to on-premises applications has traditionally involved virtual private networks (VPNs) or demilitarized zones (DMZs). Not only are these solutions complex and hard to make secure, but they are costly to set up and manage.

There is a better way!

A modern workforce in the mobile-first, cloud-first world needs a modern remote access solution. Azure AD Application Proxy is a feature of Azure Active Directory that offers remote access as a service. That means it's easy to deploy, use, and manage.

[!INCLUDE [identity](../../../includes/azure-ad-licenses.md)]

## What is Azure Active Directory Application Proxy?
Azure AD Application Proxy provides single sign-on (SSO) and secure remote access for web applications hosted on-premises. Some apps you would want to publish include SharePoint sites, Outlook Web Access, or any other LOB web applications you have. These on-premises web applications are integrated with Azure AD, the same identity and control platform that is used by O365. End users can access your on-premises applications the same way they access O365 and other SaaS apps integrated with Azure AD. You don't need to change the network infrastructure or require VPN to provide this solution for your users.

## Why is Application Proxy a better solution?
Azure AD Application Proxy provides a simple, secure, and cost-effective remote access solution to all your on-premises applications.

Azure AD Application Proxy is:

* **Simple**
   * You don't need to change or update your applications to work with Application Proxy. 
   * Your users get a consistent authentication experience. They can use the MyApps portal to get single sign-on to both SaaS apps in the cloud and your apps on-premises. 
* **Secure**
   * When you publish your apps using Azure AD Application Proxy, you can take advantage of the rich authorization controls and security analytics in Azure. You get cloud-scale security and Azure security features like conditional access and two-step verification.
   * You don't have to open any inbound connections through your firewall to give your users remote access. 
* **Cost-effective**
   * Application Proxy works in the cloud, so you can save time and money. On-premises solutions typically require you to set up and maintain DMZs, edge servers, or other complex infrastructures.  

## What kind of applications work with Application Proxy?
With Azure AD Application Proxy you can access different types of internal applications:

* Web applications that use [Integrated Windows Authentication](application-proxy-configure-single-sign-on-with-kcd.md) for authentication  
* Web applications that use form-based or [header-based](application-proxy-configure-single-sign-on-with-ping-access.md) access  
* Web APIs that you want to expose to rich applications on different devices  
* Applications hosted behind a [Remote Desktop Gateway](application-proxy-integrate-with-remote-desktop-services.md)  
* Rich client apps that are integrated with the Active Directory Authentication Library (ADAL)

## How does Application Proxy work?
There are two components that you need to configure to make Application Proxy work: a connector and an external endpoint. 

The connector is a lightweight agent that sits on a Windows Server inside your network. The connector facilitates the traffic flow from the Application Proxy service in the cloud to your application on-premises. It only uses outbound connections, so you don't have to open any inbound ports or put anything in the DMZ. The connectors are stateless and pull information from the cloud as necessary. For more information about connectors, like how they load-balance and authenticate, see [Understand Azure AD Application Proxy connectors](application-proxy-connectors.md). 

The external endpoint is how your users reach your applications while outside of your network. They can either go directly to an external URL that you determine, or they can access the application through the MyApps portal. When users go to one of these endpoints, they authenticate in Azure AD and then are routed through the connector to the on-premises application.

 ![AzureAD Application Proxy diagram](./media/application-proxy/azureappproxxy.png)

1. The user accesses the application through the Application Proxy service and is directed to the Azure AD sign-in page to authenticate.
2. After a successful sign-in, a token is generated and sent to the client device.
3. The client sends the token to the Application Proxy service, which retrieves the user principal name (UPN) and security principal name (SPN) from the token, then directs the request to the Application Proxy connector.
4. If you have configured single sign-on, the connector performs any additional authentication required on behalf of the user.
5. The connector sends the request to the on-premises application.  
6. The response is sent through Application Proxy service and connector to the user.

### Single sign-on
Azure AD Application Proxy provides single sign-on (SSO) to applications that use Integrated Windows Authentication (IWA), or claims-aware applications. If your application uses IWA, Application Proxy impersonates the user using Kerberos Constrained Delegation to provide SSO. If you have a claims-aware application that trusts Azure Active Directory, SSO works because the user was already authenticated by Azure AD.

For more information about Kerberos, see [All you want to know about Kerberos Constrained Delegation (KCD)](https://blogs.technet.microsoft.com/applicationproxyblog/2015/09/21/all-you-want-to-know-about-kerberos-constrained-delegation-kcd).

### Managing apps
Once your app is published with Application Proxy, you can manage it like any other enterprise app in the Azure portal. You can use Azure Active Directory security features like conditional access and two-step verification, control user permissions, and customize the branding for your app. 

## Get started

Before you configure Application Proxy, make sure you have a supported [Azure Active Directory edition](https://azure.microsoft.com/pricing/details/active-directory/) and an Azure AD directory for which you are a global administrator.

Get started with Application Proxy in two steps:

1. [Enable Application Proxy and configure the connector](application-proxy-enable.md).    
2. [Publish applications](application-proxy-publish-azure-portal.md) - use the quick and easy wizard to get your on-premises apps published and accessible remotely.

## What's next?
Once you publish your first app, there's a lot more you can do with Application Proxy:

* [Enable single-sign on](application-proxy-configure-single-sign-on-with-kcd.md)
* [Publish applications using your own domain name](application-proxy-configure-custom-domain.md)
* [Learn about Azure AD Application Proxy connectors](application-proxy-connectors.md)
* [Working with existing on-premises Proxy servers](application-proxy-configure-connectors-with-proxy-servers.md) 
* [Set a custom home page](application-proxy-configure-custom-home-page.md)

For the latest news and updates, check out the [Application Proxy blog](http://blogs.technet.com/b/applicationproxyblog/)

