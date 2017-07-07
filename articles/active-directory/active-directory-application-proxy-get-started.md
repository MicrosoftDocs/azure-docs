---
title: How to provide secure remote access to on-premises apps
description: Covers how to use Azure AD Application Proxy to provide secure remote access to your on-premises apps.
services: active-directory
documentationcenter: ''
author: kgremban
manager: femila
editor: ''

ms.assetid: d5450da1-9e06-4d08-8146-011c84922ab5
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/25/2017
ms.author: kgremban

---
# How to provide secure remote access to on-premises applications
> [!NOTE]
> Application Proxy is a feature that is available only if you upgraded to the Premium or Basic edition of Azure Active Directory. For more information, see [Azure Active Directory editions](active-directory-editions.md).

Employees today want to be productive at any place, at any time, and from any device. They want to work on their own devices, whether they be tablets, phones, or laptops. And they expect to be able to access all their applications, both SaaS apps in the cloud and corporate apps on-premises. Providing access to on-premises applications has traditionally involved virtual private networks (VPNs), demilitarized zones (DMZs), or on-premises reverse proxies. Not only are these solutions complex and hard to make secure, but they are costly to set up and manage.

There is a better way!

A modern workforce in the mobile-first, cloud-first world needs a modern remote access solution. Azure AD Application Proxy is a feature of the Azure Active Directory Premium offering, and offers remote access as a service. That means it's easy to deploy, use, and manage.

## What is Azure Active Directory Application Proxy?
Azure AD Application Proxy provides single sign-on (SSO) and secure remote access for web applications hosted on-premises. This can include SharePoint sites, Outlook Web Access, or any other LOB web applications you have. These on-premises web applications are integrated with Azure AD, the same identity and control platform that is used by O365. End users can then access your on-premises applications the same way they access O365 and other SaaS apps integrated with Azure AD. You don't need to change the network infrastructure or require VPN to provide this solution for your users.

## Why is Application Proxy a better solution?
Azure AD Application Proxy provides a simple, secure, and cost-effective remote access solution to all your on-premises applications.

Azure AD Application Proxy:  

* Works in the cloud, so you can save time and money. On-premises solutions require you to set up and maintain DMZs, edge servers, or other complex infrastructures.  
* Is easier to set up and secure than on-premises solutions because you don't have to open any inbound connections through your firewall.  
* Offers great security. When you publish your apps using Azure AD Application Proxy, you can take advantage of the rich authorization controls and security analytics in Azure. You get advanced security capabilities for all your existing apps without having to change any app.  
* Gives your users a consistent authentication experience. Single sign-on gives your end users the ease and simplicity of access to all the apps they need to be productive with one password.  

## What kind of applications work with Azure AD Application Proxy?
With Azure AD Application Proxy you can access different types of internal applications:

* Web applications that use Integrated Windows Authentication for authentication  
* Web applications that use form-based access  
* Web APIs that you want to expose to rich applications on different devices  
* Applications hosted behind a Remote Desktop Gateway  

## How does the service work with connectors?
Application Proxy works by installing a slim Windows Server service called a connector inside your network. With the connector, you don't have to open any inbound ports or put anything in the DMZ. If you have high traffic in your apps you can add more connectors, and the service takes care of the load balancing. The connectors are stateless and pull everything from the cloud as necessary.

For information about connectors, see [Understand Azure AD Application Proxy connectors](application-proxy-understand-connectors.md). 

When users access applications remotely, they connect to the published endpoint. Users authenticate in Azure AD and then are routed through the connector to the on-premises application.

 ![AzureAD Application Proxy diagram](./media/active-directory-appssoaccess-whatis/azureappproxxy.png)

1. The user accesses the application through the Application Proxy and is directed to the Azure AD sign-in page to authenticate.
2. After a successful sign-in, a token is generated and sent to the user.
3. The user sends the token to Application Proxy, which retrieves the user principal name (UPN) and security principal name (SPN) from the token, then directs the request to the connector.
4. On behalf of the user, the connector requests a Kerberos ticket that can be used for internal (Windows) authentication. This is known as Kerberos Constrained Delegation.
5. Active Directory retrieves the Kerberos ticket.
6. The ticket is sent to the application server and verified.
7. The response is sent through Application Proxy to the user.

### Single sign-on
Azure AD Application Proxy provides single sign-on (SSO) to applications that use Integrated Windows Authentication (IWA), or claims-aware applications. If your application uses IWA, Application Proxy impersonates the user using Kerberos Constrained Delegation to provide SSO. If you have a claims-aware application that trusts Azure Active Directory, SSO works because the user was already authenticated by Azure AD.

For more information about Kerberos, see [All you want to know about Kerberos Constrained Delegation (KCD)](https://blogs.technet.microsoft.com/applicationproxyblog/2015/09/21/all-you-want-to-know-about-kerberos-constrained-delegation-kcd).

## How to get started
Make sure you have an Azure AD basic or premium subscription and an Azure AD directory for which you are a global administrator. You also need Azure AD basic or premium licenses for the directory administrator and users accessing the apps. For more information, see [Azure Active Directory editions](active-directory-editions.md).

Setting up Application Proxy is accomplished in two steps:

1. [Enable Application Proxy and configure the connector](active-directory-application-proxy-enable.md).    
2. [Publish applications](active-directory-application-proxy-publish.md) - use the quick and easy wizard to get your on-premises apps published and accessible remotely.

## What's next?
There's a lot more you can do with Application Proxy:

* [Publish applications using your own domain name](active-directory-application-proxy-custom-domains.md)
* [Working with existing on-premise Proxy servers](application-proxy-working-with-proxy-servers.md) 
* [Enable single-sign on](active-directory-application-proxy-sso-using-kcd.md)
* [Working with claims aware applications](active-directory-application-proxy-claims-aware-apps.md)
* [Enable conditional access](active-directory-application-proxy-conditional-access.md)

For the latest news and updates, check out the [Application Proxy blog](http://blogs.technet.com/b/applicationproxyblog/)

