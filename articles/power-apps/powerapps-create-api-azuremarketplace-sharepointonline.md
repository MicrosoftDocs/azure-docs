<properties
	pageTitle="Create a new SharePoint Online API"
	description=""
	services="power-apps"
	documentationCenter="" 
	authors="LinhTran"
	manager="gautamt"
	editor=""/>

<tags
   ms.service="power-apps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="" 
   ms.date="11/02/2015"
   ms.author="litran"/>

# Create a new SharePoint Online API from Azure Marketplace

1. Select SharePoint Online from Azure Marketplace
![][1]  
2. Select *Settings - Configure required settings*
3. Enter *App Key* and *App Secret* for SharePoint Online
	- If you don't have a SharePoint Online, go [here]() to obtain one.
![][2]  
4. Click *OK* on *Configure API* blade
5. Click *OK* on *Create API* blade

# Configure SharePoint Online Settings and API Definition
1. Back in your API blade, select **All settings**, and select **General**:  
![][6]  
2. In General settings, set the following properties. Remember, the settings vary depending on the API you're using:  

	Property | Description
--- | ---
URL scheme | Select HTTP or HTTPS. HTTPS is recommended.
Authenticate with backend service | Options include: <ul><li>None: No additional security is enabled when authenticating. This is similar to anonymous authentication.</li><li>Accessible via API management</li><li>HTTP Basic Authentication: Prompts for a username and password. If you choose this option, be sure to choose HTTPS for the URL scheme. Otherwise, the user name and password are passed in clear text.</li></ul> 
OAuth Settings | When using a PaaS (Platform as a Service) API, that service may have additional username and password. Enter this username and password. When you do this, OAuth is enabled and allows the app to automatically authenticate with the PaaS.<br/><br/>Twitter is a great example. Enter your Twitter username and password. This allows the app to automatically authenticate with Twitter with no additional sign-in prompts. 

3. **Save** your changes.

In these Settings, you can also upload a policy file and view the API definition, which is the Swagger file associated with your API. 

[1]: ./media/powerapps-create-new-connector/sharepointonline.png
[2]: ./media/powerapps-create-new-connector/sharepointonlineconfigure.png