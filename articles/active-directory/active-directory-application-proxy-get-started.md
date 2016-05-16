<properties
	pageTitle="How to provide secure remote access to on-premises apps"
	description="Covers how to use Azure AD Application Proxy to provide secure remote access to your on-premises apps."
	services="active-directory"
	documentationCenter=""
	authors="kgremban"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/16/2016"
	ms.author="kgremban"/>

# How to provide secure remote access to on-premises applications

> [AZURE.NOTE] Application Proxy is a feature that is available only if you upgraded to the Premium or Basic edition of Azure Active Directory. For more information, see [Azure Active Directory editions](active-directory-editions.md).

You want to provide access for remote users who have all kinds of devices – managed, and unmanaged; tablets, smartphones, and laptops. But providing secure access to a myriad of resources can be complex. In recent years, reverse proxies were a popular way to provide secure remote access, but they needed to be behind firewalls which were hard to secure and hard to make highly available.

Employees today want to be productive at any place, at any time, and from any device. They want to work on their own devices, whether they be tablets, phones, or laptops. And they expect to be able to access all their applications: those in the cloud as well as other corporate apps on-premises. Providing access to on-premises applications has traditionally involved virtual private networks (VPNs), demilitarized zones (DMZs), or on-premises reverse proxies. Not only are these solutions complex and hard to make secure, but they are costly to setup and manage.

There is a better way!

A modern workforce in the mobile-first, cloud-first world needs a modern remote access solution. Azure AD Application Proxy is a feature of the Azure Active Directory Premium offering, and offers remote access as a service. That means it's easy to deploy, use, and manage.

## What is Azure Active Directory Application Proxy?
Azure AD Application Proxy provides single sign-on (SSO) and secure remote access for web applications hosted on-premises. This can include SharePoint sites, Outlook Web Access, or any other LOB web application you have. Your on-premises web applications can now be integrated with Azure AD, the same identity and control platform that is used by O365. End users can access your on-premises applications the same way they access O365 and other SaaS apps integrated with Azure AD, without the need for a VPN or changing the network infrastructure.

## Why is this a better solution?
Azure AD App Proxy provides a simple, secure, and cost-effective remote access solution to all your on-premises applications.

- App Proxy works in the cloud, so you can save time and money compared to DMZs or edge servers that require complex on-premises infrastructures.  
- When you publish your apps through Azure AD, they automatically get access to the rich authorization controls and security analytics in Azure. This means  you get advanced security capabilities for all your existing apps without having to change any app.  
- Single sign-on gives your end users the ease and simplicity of access to all the apps they need to be productive.  

## What kind of applications work with Azure AD App Proxy?
With Azure AD app proxy you can access different types of internal applications:

- Web applications that use Integrated Windows Authentication for authentication  
- Web applications that use form-based access  
- Web APIs that you want to expose to rich applications on different devices  
- Applications hosted behind a Remote Desktop Gateway  

## How does it work?
App Proxy works with three basic steps. First, connectors are deployed on the on-premises network. Then, the connector connects to the cloud service.
Finally, the connector and cloud service route user traffic to applications.

 ![AzureAD App Proxy diagram](./media/active-directory-appssoaccess-whatis/azureappproxxy.png)

1. The user accesses the application through the application proxy and will be directed to the Azure AD logon page to authenticate.
2. After a successful logon, a token is generated and sent to the user.
3. The user sends the token to the application proxy which retrieves the user principal name (UPN) and security principal name (SPN) from the token then directs the request to the connector.
4. On behalf of the user, the connector requests a Kerberos ticket that can be used for internal (Windows) authentication. This is known as Kerberos Constrained Delegation.
5. A Kerberos ticket is retrieved from Active Directory.
6. The ticket is sent to the application server and verified.
7. The response is sent through the application proxy to the user.

### Enabling Access
Application Proxy works by installing a slim Windows Server service called the connector inside your network. The connector doesn’t necessitate opening any inbound ports and you don’t have to put anything in the DMZ. If you have a lot of traffic to your apps you can add more connectors, and the service will take care of the load balancing. The connectors are stateless and pull everything from the cloud as necessary.

When a user accesses applications remotely, from any device, he’s authenticated by Azure Active Directory and gets access to the application.

### Single sign-on
Azure AD Application Proxy provides single sign-on to applications that use Integrated Windows Authentication (IWA), or claims-aware applications. If your application uses IWA, Application Proxy impersonates the user using Kerberos Constrained Delegation to provide single sign-on (SSO). If you have a claims-aware application that trusts Azure Active Directory, SSO is achieved because the user was already authenticated by Azure AD.

## How to get started
Make sure you have an Azure AD basic or premium subscription and an Azure AD directory for which you are a global administrator. You also need Azure AD basic or premium licenses for the directory administrator and users accessing the apps. Take a look at [Azure Active Directory editions](active-directory-editions.md) for more information.

### Getting started enabling remote access to on-premises applications
Setting up Application Proxy is accomplished in two steps:

1. [Enable Application Proxy and configure the connector](active-directory-application-proxy-enable.md)  
2. [Publish applications](active-directory-application-proxy-publish.md) - use the quick and easy wizard to get your on-premises apps published and accessible remotely.

## What's next?
There's a lot more you can do with Application Proxy:

- [Publish applications using your own domain name](active-directory-application-proxy-custom-domains.md)
- [Enable single-sign on](active-directory-application-proxy-sso-using-kcd.md)
- [Working with claims aware applications](active-directory-application-proxy-claims-aware-apps.md)
- [Enable conditional access](active-directory-application-proxy-conditional-access.md)


### Learn more about Application Proxy
- [Take a look at our online help](active-directory-application-proxy-enable.md)
- [Check out the Application Proxy blog](http://blogs.technet.com/b/applicationproxyblog/)
- [Watch our videos on Channel 9!](http://channel9.msdn.com/events/Ignite/2015/BRK3864)

## Additional resources
- [Article index for application management in Azure Active Directory](active-directory-apps-index.md)
- [Sign up for Azure as an organization](sign-up-organization.md)
- [Azure Identity](fundamentals-identity.md)
