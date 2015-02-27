<properties 
 pageTitle="How to Enable the Content Delivery Network (CDN) for Azure" 
 description="" 
 services="cdn" 
 documentationCenter=".NET" 
 authors="zhangmanling" 
 manager="dwrede" 
 editor=""/>
<tags 
 ms.service="cdn" 
 ms.workload="media" 
 ms.tgt_pltfrm="na" 
 ms.devlang="dotnet" 
 ms.topic="article" 
 ms.date="11/26/14" 
 ms.author="mazha"/>


#How to Enable the Content Delivery Network (CDN)  for Azure  

Once you enable a CDN endpoint for a storage account or cloud service, all publicly available objects are eligible for CDN edge caching.  

If you modify an object that is currently cached in the CDN, the new content will not be available via the CDN until the CDN refreshes its content when the cached content time-to-live period expires.  

> AZURE.NOTE Note that the CDN has a separate [billing plan](http://azure.microsoft.com/pricing/details/cdn/) from Azure Storage or Azure Cloud Services.  

##To Create a New CDN Endpoint  

1.	Log into the [Azure Management Portal](http://manage.windowsazure.com/).
2.	In the navigation pane, click **CDN**.
3.	On the ribbon, click **New**. In the **New** dialog, select **App Services**, then **CDN**, then **Quick Create**.
4.	In the **Origin Domain** dropdown, select a storage account from the list of your available storage accounts, or select a cloud service from the list of your available cloud services.
5.	Click the **Create** button to create the new endpoint.

> AZURE.WARNING The configuration created for the endpoint will not immediately be available; it can take up to 60 minutes for the registration to propagate through the CDN network. Users who try to use the CDN domain name immediately may receive status code 400 (Bad Request) until the content is available via the CDN.

#See Also
[How to Map Content Delivery Network (CDN) Content to a Custom Domain](./cdn-map-content-to-custom-domain.md
)
