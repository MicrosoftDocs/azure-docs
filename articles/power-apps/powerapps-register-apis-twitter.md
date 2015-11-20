<properties
	pageTitle="Register your organization's Twitter API"
	description="IT Doc: Register your organization's Twitter API"
	services="powerapps"
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
   ms.date="11/03/2015"
   ms.author="rajram"/>

# Register Twitter API in App Service Environment

Twitter is an online social networking service that enables users to send and receive short messages called "tweets". Connect to Twitter to manage your tweets. You can perform various actions such as send tweet, search, view followers, etc.

Following steps are required to register a Twitter API for your organization's App Service Environment(ASE).

- Register a new app in Twitter
- Add Twitter API in your organization's ASE

## Obtain callback url
- Navigate to [Azure portal][4]
- Click on 'Browse' and select 'PowerApps Services'
- Click on 'Settings'
- Click on 'App Service Environment'
- Click on 'Managed APIs' card
- Click on 'Add' in the command bar at the top
- Provide the following settings
	- **Name**: Name of your API
	- **Source**: Leave it to 'Marketplace' (default)
	- **API**: Click on API and in the 'Select from Marketplace' blade that opens up select _Twitter_
	- **Settings**: Copy the 'Redirect URL' value

## Register a new app in Twitter
> This step requires a Twitter account. If you don't already have one, you can [sign up for a free Twitter account][1].


1. Navigate to [https://apps.twitter.com/][2] and sign in with your twitter account:  
![Twitter apps page][3]
2. Click on 'Create New App'
3. Provide the following information
	- **Name**: Your application name. This is used to attribute the source of a tweet and in user-facing authorization screens. 32 characters max.
	- **Description**: Your application description, which will be shown in user-facing authorization screens. Between 10 and 200 characters max.
	- **Website**: Your application's publicly accessible home page, where users can go to download, make use of, or find out more information about your application. This fully-qualified URL is used in the source attribution for tweets created by your application and will be shown in user-facing authorization screens. (If you don't have a URL yet, just put a placeholder here but remember to change it later.)
	- **Callback url**: Where should we return after successfully authenticating? OAuth 1.0a applications should explicitly specify their oauth_callback URL on the request token step, regardless of the value given here. To restrict your application from using callbacks, leave this field blank.
	> Note: Provide the callback url copied as part of the previous step
	- Agree to the developer agreement and click 'Create your Twitter application'
4. On successful app creation, you will be redirected to the app page
5. Navigate to 'Keys and Access Tokens' tab, and copy the following values
	- Consumer Key (API Key)
	- Consumer Secret (API Secret)
	> Note: Leave the access level to 'Read and write'

##Register Twitter API in App Service Environment
- Navigate to [Azure portal][4]
- Click on 'Browse' and select 'PowerApps Services'
- Click on 'Settings'
- Click on 'App Service Environment'
- Click on 'Managed APIs' card
- Click on 'Add' in the command bar at the top
- Provide the following settings
	- **Name**: Name of your API
	- **Source**: Leave it to 'Marketplace' (default)
	- **API**: Click on API and in the 'Select from Marketplace' blade that opens up select _Twitter_
	- **Settings**: Provide the consumer id and consumer secret values obtained from the previous step.  
	![Configure twitter api][5]
- Click on OK to complete the Twitter API configuration
- Click on OK to create the Twitter API

On successful completion of these steps, a new Twitter API will be registered in your App Service Environment.

<!--References-->
[1]: https://twitter.com/signup
[2]: https://apps.twitter.com/
[3]: ./media/powerapps-register-apis-twitter/twitter-apps.PNG
[4]: https://portal.azure.com
[5]: ./media/powerapps-register-apis-twitter/configure-twitter-api.PNG