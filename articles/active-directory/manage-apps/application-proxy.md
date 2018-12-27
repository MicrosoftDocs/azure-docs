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

#  Azure Active Directory's Application Proxy enables remote access to on-premises applications

Azure Active Directory uses its Application Proxy service to provide secure remote access to on-premises web applications. After signing on once to Azure AD, users can access both cloud and on-premises applications through an external URL or an internal application portal. For example, Application Proxy can provide remote access and single sign-on to Remote Desktop, Sharepoint, Teams, Tableau, Qlik, and line of business (LOB) applications. 

Azure AD Application Proxy is:

- **Simple to use**. Users can access your on-premises applications the same way they access O365 and other SaaS apps integrated with Azure AD. You don't need to change or update your applications to work with Application Proxy. 

- **Secure**. On-premises applications can use Azure's authorization controls and security analytics. For example, on-premises applications can use conditional access and two-step verification. Application Proxy doesn't require you to open inbound connections through your firewall.
 
- **Cost-effective**. On-premises solutions typically require you to set up and maintain demilitarized zones (DMVs), edge servers, or other complex infrastructures. Application Proxy runs in the cloud, which makes it easy to use. You don't need to change the network infrastructure or require a virtual private network (VPN) to use Application Proxy.

## When to use Application Proxy
Use Application Proxy to access these different types of internal applications:

* Web applications that use [Integrated Windows Authentication](application-proxy-configure-single-sign-on-with-kcd.md) for authentication  
* Web applications that use form-based or [header-based](application-proxy-configure-single-sign-on-with-ping-access.md) access  
* Web APIs that you want to expose to rich applications on different devices  
* Applications hosted behind a [Remote Desktop Gateway](application-proxy-integrate-with-remote-desktop-services.md)  
* Rich client apps that are integrated with the Active Directory Authentication Library (ADAL)

## Process for remote authentication
The following diagram shows how users authenticate to on-premises applications by using Azure AD and its Application Proxy service. 

![AzureAD Application Proxy diagram](./media/application-proxy/azureappproxxy.png)

1. After the user has accessed the application through an endpoint, the user is directed to the Azure AD sign-in page. 
2. After a successful sign-in, Azure AD sends a token to the user's client device.
3. The client sends the token to the Application Proxy service, which retrieves the user principal name (UPN) and security principal name (SPN) from the token. Application Proxy then sends the request to the Application Proxy connector.
4. If you have configured single sign-on, the connector performs any additional authentication required on behalf of the user.
5. The connector sends the request to the on-premises application.  
6. The response is sent through the connector and Application Proxy service to the user.

| Component | Description |
| --------- | ----------- |
| Endpoint  | The endpoint is a URL or an [end-user portal](end-user-experiences.md). Users can reach applications while outside of your network by accessing an external URL. Users within your network can access the application through a URL or an end-user portal. When users go to one of these endpoints, they authenticate in Azure AD and then are routed through the connector to the on-premises application.|
| Azure AD | Azure AD performs the authentication using the tenant directory stored in the cloud. |
| Application Proxy service | This Application Proxy service runs in the cloud as part of Azure AD. It passes the sign-on token from the user to the Application Proxy Connector.|
| Application Proxy Connector | The connector is a lightweight agent that runs on a Windows Server inside your network. The connector manages communication between the Application Proxy service in the cloud and the on-premises application. The connector only uses outbound connections, so you don't have to open any inbound ports or put anything in the DMZ. The connectors are stateless and pull information from the cloud as necessary. For more information about connectors, like how they load-balance and authenticate, see [Understand Azure AD Application Proxy connectors](application-proxy-connectors.md).|
| Active Directory (AD) | Active Directory runs on-premises to perform authentication for domain accounts. When single sign-on is configured, the connector communicates with AD to perform any additional authentication required.
| On-premises application | Finally, the user is able to access an on-premises application. 


## Next steps
To start using Application Proxy, see [Tutorial: Add an on-premises application for remote access through Application Proxy](application-proxy-add-on-premises-application.md). 

For the latest news and updates, see the [Application Proxy blog](https://blogs.technet.com/b/applicationproxyblog/)


