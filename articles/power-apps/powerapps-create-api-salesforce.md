<properties
	pageTitle="Add Salesforce API in PowerApps| Azure"
	description="Add a new Salesforce API in your organization's App Service Environment"
	services="powerapps"
	documentationCenter="" 
	authors="rajeshramabathiran"
	manager="dwerde"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="11/19/2015"
   ms.author="rajram"/>

#Create a new Salesforce API in your organization's App Service Environment

1. In the Azure portal, click on _Browse_ and select _PowerApps Services_. 

2. In **PowerApps Services**, select **Manage APIs** tile or select it from *Settings*:  
![Browse to registered apis][1]

3. In the **Manage APIs** blade, select **Add** to add a new API
![Add API][2]

4. Enter a descriptive **name** for your API.  
	
5. In **Source**, select **Available APIs** to select a pre-built API. 
	
6. Select **Salesforce** from the marketplace
![select Salesforce api][3]

7. Select *Settings - Configure required settings*
![configure dropbox API settings][7]

8. Enter *App Key* and *App Secret* of your Salesforce application. If you don't already have one, see the section below titled "Register a Salesforce app for use with PowerApps". 
	> Note the _redirect URL_ here before starting to register the Dropbox app

9. Click **OK** to close the configure API blade.

10. Click **OK** to create a new Dropbox API in your ASE.

On successful completion, a new API is added to your ASE.

##Register a Salesforce app for use with PowerApps

1. Open [Salesforce developer homepage][5], and log in with your Salesforce account

2. In the homepage, click on your profile and select _Setup_.
![Salesforce homepage][6]

3. Click on **Create** and select **Apps**. In the _Apps_ page, click on **New** button under _Connected Apps_
![Salesforce create app][7]

4. In the _New Connected App_ page,
	1. Enter the value for **Connected App Name**
	2. Enter the value for **API Name**
	3. Enter the value for **Contact Email**
	4. Under _API (Enable OAuth Settings)_, click on **Enable OAuth Settings** and set the **Callback URL** to the redirect URL obtained from adding a new Dropbox API in Azure Portal.
	5. Under _Selected OAuth scopes_, add the following scopes to the _Selected OAuth Scopes_
		1. **Access and manage your Chatter data (chatter_api)**
		2. **Access and manage your data (api)**
		3. **Allow access to your unique identifier (openid)**
		4. **Perform requests on your behalf at any time (refresh_token, offline_access)**
	5. Click on **Save**
![Salesforce new app][8]

Congratulations! You have now successfully created a Salesforce app that can be used in PowerApps.

<!--References-->
[1]: ./media/powerapps-create-api-salesforce/browse-to-registered-apis.PNG
[2]: ./media/powerapps-create-api-salesforce/add-api.PNG
[3]: ./media/powerapps-create-api-salesforce/select-salesforce-api.PNG
[4]: ./media/powerapps-create-api-salesforce/configure-salesforce-api.PNG
[5]: https://developer.salesforce.com
[6]: ./media/powerapps-create-api-salesforce/salesforce-developer-homepage.PNG
[7]: ./media/powerapps-create-api-salesforce/salesforce-create-app.PNG
[8]: ./media/powerapps-create-api-salesforce/salesforce-new-app.PNG