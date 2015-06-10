<properties 
	pageTitle="Azure Multi-Factor Authentication Caching" 
	description="This describes how to use the Azure Multi-Factor Authentication feature - caching." 
	services="multi-factor-authentication" 
	documentationCenter="" 
	authors="billmath" 
	manager="terrylan" 
	editor="bryanla"/>

<tags 
	ms.service="multi-factor-authentication" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/02/2015" 
	ms.author="billmath"/>

# Caching in Azure Multi-Factor Authentication

Caching allows you to set a specific time period so that subsequent authentication attempts succeed automatically.  This allows your users to avoid having to wait for phone calls or text if they authenticate within this time period.



## To setup caching in Azure Multi-Factor Authentication
<ol>

1. Log on to http://azure.microsoft.com
2. On the left, select Active Directory.
3. At the top select Multi-Factor Auth Providers. This will bring up a list of your Multi-Factor Auth Providers.
4. If you have more than one Multi-Factor Auth Provider, select the one you wish to enable fraud alerting on and click Manage at the bottom of the page. If you have only one, just click Manage. This will open the Azure Multi-Factor Authentication Management Portal.
5. On the Azure Multi-Factor Authentication Management Portal, on the left, click Caching.
6. On the Configure caching page click New Cache
7. Select the Cache type and the cache seconds.  Click create.


<center>![Cloud](./media/multi-factor-authentication-manage-caching/cache.png)</center>

