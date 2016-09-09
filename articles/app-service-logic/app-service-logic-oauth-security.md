<properties
	pageTitle="OAUTH Security in SaaS Connectors and API Apps | Azure"
	description="Read about OAUTH security in the Connectors and API Apps in Azure App Service; microservices architecture; saas"
	services="logic-apps"
	documentationCenter=""
	authors="MandiOhlinger"
	manager="dwrede"
	editor="cgronlun"/>

<tags
	ms.service="logic-apps"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/10/2016"
	ms.author="mandia"/>


# Learn about OAUTH Security in SaaS connectors

>[AZURE.NOTE] This version of the article applies to logic apps 2014-12-01-preview schema version.

Many of the Software as a Service (SaaS) connectors like Facebook, Twitter, DropBox, and so on require users to authenticate using the OAUTH protocol.  When you use these SaaS connectors from Logic Apps, we provide a simplified user experience where you click "Authorize" in the Logic Apps designer. When you **Authorize**, you are asked to sign in (if not already) and provide consent to connect to the SaaS service on your behalf. After you do provide consent and authorize, your Logic Apps can then access these SaaS services.

## Create your own SaaS app
This simplified experience is possible because we previously created and registered our application in these SaaS services.  In certain cases, you may want to register and use your own application.  This is necessary, for instance, when you want to use these SaaS connectors in your custom applications. This example uses the DropBox connector, but the process is the same for all connectors that rely on OAUTH.

Even in the context of Logic Apps, you can use your own application instead of using the default application that we provide. If the "Authorize" button fails to connect, you can try creating your own app. The following lists these steps for the Twitter connector:

1. Open your Twitter connector in the Azure preview portal. Go to **Browse** > **API Apps**. Select your Twitter connector:  
	![][1]

2. Select **Settings** > **Authentication**:  
	![][2]

3. Copy the **Redirect URI** value:  
	![][3]

4. Go to [Twitter](http://apps.twitter.com) and **Create a New App**. In the **Callback URL** property, paste the **Redirect URI** value copied from  your Twitter connector:
	![][4]  
5. When your Twitter app is created, select **Key and Access Tokens**. Copy these values.
6. In your Twitter connector authentication settings, paste these values in the **Client ID** and **Client Secret** properties:   
	![][5]  
7. Save your connector settings.  

Now, you should be able to use your connector from Logic Apps. When you use this connector from Logic Apps, it uses your application instead of the default application.  

> [AZURE.NOTE] If you have authorized an app previously, you may have to reauthorize the app.


<!--Image references-->
[1]: ./media/app-service-logic-oauth-security/TwitterConnector.png
[2]: ./media/app-service-logic-oauth-security/Authentication.png
[3]: ./media/app-service-logic-oauth-security/RedirectURI.png
[4]: ./media/app-service-logic-oauth-security/TwitterApp.png
[5]: ./media/app-service-logic-oauth-security/TwitterKeys.png
