<properties
	pageTitle="Create a new SharePoint Server API in your organization's App Service Environment"
	description="Create a new SharePoint Server API in your organization's App Service Environment"
	services=""
    suite="powerapps"
	documentationCenter="" 
	authors="rajram"
	manager="dwrede"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="11/23/2015"
   ms.author="litran"/>

# Create a new SharePoint Server API in your organization's App Service Environment

1. In the Azure portal, open **PowerApps**. In PowerApps, select **Manage APIs** tile or select it from *Settings*:  

![Browse to registered apis][5]

2. In the **Manage APIs** blade, select **Add** to add a new API

![Add API][6]

3. Enter a descriptive **name** for your API
	
4. In **Source**, select **Available APIs** to select a pre-built connector. 

5. Select **SharePoint Server** from the list of available APIs

	a) Select *Settings - Configure required settings*
	
	b) Enter *Client Id* and *App Key* for SharePoint Server AAD app, as well as the *SharePoint URL* and *Resource Id* of the AAD Proxy app. Follow the steps outlined in the following section to configure connectivity to your on-premises SharePoint Server.
		
		Note the *Redirect URL*
	
	c) Click *OK* on *Configure API* blade

5. Click **OK**. SharePoint Server API is now added to the list of **Manage APIs** in your App Service Environment.

## Configure connectivity to an on-premises SharePoint Server

SharePoint Server makes use of AD for user authentication. APIs in ASE are authenticated via AAD. There is a need to exchange the user’s AAD token and convert it to AD token. This AD token can then be used to connect to the service on-premises.

[Azure Application Proxy (AAD Proxy)][2] will be used for this requirement. It is already an Azure Service in GA, and it secures remote access and SSO to on-premises web applications. The steps to enable AAD Proxy is well documented in MSDN. At a high level here are the steps:

- [Enable Application Proxy Services][3] – This includes
	- Enable Application Proxy in Azure AD
	- Install and Register the Azure Application Proxy Connector

- [Publish Applications with Application  Proxy][4] – This includes
	- Publish an Application Proxy app using the wizard
	> Note the external URL of the intranet sharepoint site once the Proxy app has been created
	- Assign users and group to the application
	- Specify advanced configuration like the SPN (Service Principal Name) that is used by the Application Proxy Connector to fetch the Kerberos token on-premises

Once the Proxy app has been created, you have to create another AAD app that delegates to the proxy application. This is required to obtain the access token and refresh token that is required for the consent flow. You can create a new AAD application by following [these instructions](../active-directory-integrating-applications.md).

<!--References-->
[2]: https://msdn.microsoft.com/library/azure/dn768219.aspx
[3]: https://msdn.microsoft.com/library/azure/dn768214.aspx
[4]: https://msdn.microsoft.com/library/azure/dn768220.aspx
[5]: ./media/powerapps-create-api-dropbox/browse-to-registered-apis.PNG
[6]: ./media/powerapps-create-api-dropbox/add-api.PNG

