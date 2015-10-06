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

#Enabling hybrid access with App Proxy
With Microsoft Azure AD Application Proxy, you can publish applications that are running inside your private network so they can be accessed securely, on any device, from outside your network.
Azure AD App Proxy can be used to publish applications inside your private on premise or cloud network. It can be configured as an out of the box service within Azure AD and only requires you to install an Application Proxy connector on a server within your environment. 

##How it works

The following steps list how applications can be published in a hybrid environment.
 
1.	Connectors are deployed on corpnet. (Multiple connectors can be deployed for redundancy and scale.)
2.	The connector autoconnects to the cloud service.
3.	User connects to the cloud service that routes their traffic to the resources via the connectors.

The following diagram provides more details on of how Application Proxy works:

 ![How AzureAD App Proxy works](./media/active-directory-appssoaccess-whatis/azureappproxxy.png)

 
1.	User accesses the Application through the Application Proxy and will be directed to the Azure AD logon page to authenticate.
2.	After a successful logon, a token is generated and send to the user.
3.	The user will now send the token to the Application Proxy which will retrieve the user principal name (UPN) and security principal name (SPN) out of the token and direct the request to the connector.
4.	The connector impersonates the user to request a Kerberos ticket which can be used for internal (Windows) authentication. (Kerberos Constrained Delegation)
5.	 A Kerberos ticket is retrieved from Active Directory.
6.	The retrieved ticket is sent to the application server where it is being verified.
7.	 The response will be sent through the Application Proxy to the end user.
There is only one requirement for publishing a web application: The web application in your private network must be accessible by the server where the connector is being installed. In other words, you can either install the connector on the application servers itself or on any other server within your environment. It’s all fine as long the connector is able to access the web application.

##How to integrate on premise applications through Azure AD Application Proxy
The Access Panel in Azure AD lets you publish your on-premises applications to Azure AD. The following steps are what you need to follow:

1. Enable Application Proxy in Azure AD and install and register the connector. For detailed instructions see, [Enabling Azure AD Application Proxy](active-directory-application-proxy-enable/#step-1-enable-application-proxy-in-azure-ad.md).
2. Publish applications using Azure AD Application Proxy- For detailed instructions see, [Publish applications through Azure AD App Proxy](active-directory-application-proxy-publish.md).

