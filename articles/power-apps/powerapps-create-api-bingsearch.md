<properties
	pageTitle="Create a new Bing Search API in your organization's App Service Environment"
	description="Create a new Bing Search API in your organization's App Service Environment"
	services=""
    suite="powerapps"
	documentationCenter="" 
	authors="LinhTran"
	manager="gautamt"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="11/23/2015"
   ms.author="litran"/>

#Create a new Bing Search API in your organization's App Service Environment

1. In the Azure portal, open **PowerApps**. In PowerApps, select **Manage APIs** tile or select it from *Settings*:  

![Browse to registered apis][2]

2. In the **Manage APIs** blade, select **Add** to add a new API

![Add API][3]

3. Enter a descriptive **name** for your API. 

4. In **Source**, select **Available API** to select a pre-built connector. 
	
5. Select **Bing Search** from the list of available APIs

	a) Select *Settings - Configure required settings*
	
	b) Enter *Account Key*
		
	- If you don't have a Bing Search Key, create a free [Bing Search offer][1] to obtain one

	c) Click *OK* on *Configure API* blade

5. Click **OK**. Bing Search API is now added to the list of **Manage APIs** in your App Service Environment. 

<!--References-->
[1]: https://datamarket.azure.com/dataset/bing/search
[2]: ./media/powerapps-create-api-dropbox/browse-to-registered-apis.PNG
[3]: ./media/powerapps-create-api-dropbox/add-api.PNG



