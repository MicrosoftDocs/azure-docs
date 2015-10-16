<properties
	pageTitle="Enabling hybrid access with App Proxy| Microsoft Azure"
	description="Enable access to apps that are running inside your private network from outside your network though Azure Active Directory."
	services="active-directory"
	documentationCenter=""
	authors="femila"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/06/2015"
	ms.author="femila"/>

# Enabling hybrid access with App Proxy
With Microsoft Azure AD Application Proxy, you can provide access to applications located inside your private network securely, from anywhere and on any device. After you have installed an application proxy connector within your environment, it can be easily configured with Azure AD.

There is only one requirement for enabling access to a web application: the web application must be accessible to the server where the connector is installed. In other words, you can either install the connector on the application server itself or on any other server within your environment as long the connector is able to access the web application.

##How it works
### A quick overview
1. Connectors are deployed on the on-premises network. (Multiple connectors can be deployed for redundancy and scale.)
2. The connector connects to the cloud service.
3. The connector and cloud service route user traffic to applications.

 ![AzureAD App Proxy diagram](./media/active-directory-appssoaccess-whatis/azureappproxxy.png)

### A closer look
1. The user accesses the application through the application proxy and will be directed to the Azure AD logon page to authenticate.
2. After a successful logon, a token is generated and sent to the user.
3. The user sends the token to the application proxy which retrieves the user principal name (UPN) and security principal name (SPN) from the token then directs the request to the connector.
4. On behalf of the user, the connector requests a Kerberos ticket that can be used for internal (Windows) authentication. This is known as Kerberos Constrained Delegation.
5. A Kerberos ticket is retrieved from Active Directory.
6. The ticket is sent to the application server and verified.
7. The response is sent through the application proxy to the user.

## Related articles
- [Enabling Azure AD Application Proxy](active-directory-application-proxy-enable/#step-1-enable-application-proxy-in-azure-ad.md)
- [Publishing applications through Azure AD App Proxy](active-directory-application-proxy-publish.md)
