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
	 ms.date="06/03/2015" 
	 ms.author="mazha"/>



#How to Enable Content Delivery Network (CDN)  for Azure  

CDN can be enabled for your origin via Azure Management Portal. The current available origin type includes: Web Apps, storage, Cloud Services. You can also enable CDN for your Azure Media Services Streaming endpoint. Once you enable a CDN endpoint for your origin, all publicly available objects are eligible for CDN edge caching.

Note that now you can also create a custom origin and it does not have to be Azure.

##To Create a New CDN Endpoint  

1.	Log into the [Azure Management Portal](http://manage.windowsazure.com/).
2.	In the navigation pane, click **CDN**.
3.	On the ribbon, click **New**. In the **New** dialog, select **APP SERVICES**, then **CDN**, then **QUICK CREATE**.
4.	In the **ORIGIN TYPE** dropdown, select an origin type form the list of available origin type.
	
	The list of available origin URLs will be displayed in the **ORIGIN URL** dropdown list.
	

	![createnew][createnew]

	If you select **Custom Origin**, you can enter a custom origin URL. That does not have to be an Azure origin.

	![customorigin][customorigin]

	>[AZURE.NOTE] Currently only HTTP is supported for origin and you must use the Media Services extension to enable Azure CDN for an Azure Media Services streaming endpoint.
	
5.	Click the **Create** button to create the new endpoint.


>[AZURE.NOTE] The configuration created for the endpoint will not immediately be available; it can take up to 60 minutes for the registration to propagate through the CDN network. Users who try to use the CDN domain name immediately may receive status code 400 (Bad Request) until the content is available via the CDN.

##See Also
[How to Map Content Delivery Network (CDN) Content to a Custom Domain](./cdn-map-content-to-custom-domain.md)

[createnew]: ./media/cdn-create-new/cdn-create-new-account.png

[customorigin]: ./media/cdn-create-new/cdn-custom-origin.png
