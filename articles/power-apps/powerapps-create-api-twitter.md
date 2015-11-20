<properties
	pageTitle="Add Dropbox API in PowerApps| Azure"
	description="Add a new Twitter API in your organization's App Service Environment"
	services="powerapps"
	documentationCenter="" 
	authors="rajeshramabathiran"
	manager="dwrede"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="11/19/2015"
   ms.author="rajram"/>

#Create a new Twitter API in your organization's App Service Environment

1. In the Azure portal, click on _Browse_ and select _PowerApps Services_. 

2. In **PowerApps Services**, select **Manage APIs** tile or select it from *Settings*:  
![Browse to registered apis][1]

3. In the **Manage APIs** blade, select **Add** to add a new API:  
![Add API][2]

4. Enter a descriptive **name** for your API.  
	
5. In **Source**, select **Available APIs** to select a pre-built API. 
	
6. Select **Twitter** from the marketplace:  
![select Twitter api][3]

7. Select *Settings - Configure required settings*:  
![configure Twitter API settings][4]

8. Enter *Consumer Key* and *Consumer Secret* of your Twitter application. If you don't already have one, see the section below titled "Register a Twitter app for use with PowerApps". 
> Note the _redirect URL_ here before starting to register the Twitter app

9. Click **OK** to close the configure API blade.

10. Click **OK** to create a new Twitter API in your ASE.

On successful completion, a new API is added to your ASE.

##Register a Twitter app for use with PowerApps

1. Navigate to [https://apps.twitter.com/](https://apps.twitter.com) and sign in with your twitter account

2. Click on 'Create New App':  
![Twitter apps page][6]

3. In _Create an application_ page:   
	1. Enter a value for **Name**
	2. Enter a value for **Description**
	3. Enter a value for **Website**
	4. Set the **Callback url** to the redirect URL obtained from adding a new Twitter API in Azure Portal.
	5. Agree to the developer agreement and click **Create your Twitter application**
![Twitter app create][7]

4. On successful app creation, you will be redirected to the app page.

Congratulations! You have now successfully created a Twitter app that can be used in PowerApps.


<!--References-->

[1]: ./media/powerapps-create-api-twitter/browse-to-registered-apis.PNG
[2]: ./media/powerapps-create-api-twitter/add-api.PNG
[3]: ./media/powerapps-create-api-twitter/select-twitter-api.PNG
[4]: ./media/powerapps-create-api-twitter/configure-twitter-api.PNG
[6]: ./media/powerapps-create-api-twitter/twitter-apps-page.PNG
[7]: ./media/powerapps-create-api-twitter/twitter-app-create.PNG