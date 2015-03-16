<properties 
	 pageTitle="How to Enable the Content Delivery Network (CDN) for Azure" 
	 description="This topic shows how to enable the Content Delivery Network (CDN) for Azure." 
	 services="cdn" 
	 documentationCenter="" 
	 authors="zhangmanling" 
	 manager="dwrede" 
	 editor=""/>
<tags 
	 ms.service="cdn" 
	 ms.workload="media" 
	 ms.tgt_pltfrm="na" 
	 ms.devlang="na" 
	 ms.topic="article" 
	 ms.date="03/05/2015" 
	 ms.author="mazha"/>



#How to Enable Content Delivery Network (CDN)  for Azure  

Once you enable a CDN endpoint for your origin such as storage account, cloud service,  all publicly available objects are eligible for CDN edge caching.  


##To Create a New CDN Endpoint  

1.	Log into the [Azure Management Portal](http://manage.windowsazure.com/).
2.	In the navigation pane, click **CDN**.
3.	On the ribbon, click **New**. In the **New** dialog, select **App Services**, then **CDN**, then **Quick Create**.
4.	In the **Origin Domain** dropdown, select your desired destination from the list of available origin type.
5.	Click the **Create** button to create the new endpoint.




> Note: The configuration created for the endpoint will not immediately be available; it can take up to 60 minutes for the registration to propagate through the CDN network. Users who try to use the CDN domain name immediately may receive status code 400 (Bad Request) until the content is available via the CDN.

#See Also
[How to Map Content Delivery Network (CDN) Content to a Custom Domain](./cdn-map-content-to-custom-domain.md
)
