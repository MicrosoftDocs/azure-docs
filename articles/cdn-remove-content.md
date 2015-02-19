<properties 
 pageTitle="How to Remove Content from the Content Delivery Network (CDN)" 
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
 ms.date="08/01/2014" 
 ms.author="mazha"/>



#How to Remove Content from the Content Delivery Network (CDN)

If you no longer wish to cache an object in the Azure Content Delivery Network (CDN), you can take one of the following steps:  

-	For a Azure blob, you can delete the blob from the public container.
-	You can make the container private instead of public. See **Restrict Access to Containers and Blobs** for more information.
-	You can disable or delete the CDN endpoint using the [Azure Management Portal](https://manage.windowsazure.com/).
-	You can modify your hosted service to no longer respond to requests for the object.  
 
An object already cached in the CDN will remain cached until the time-to-live period for the object expires. When the time-to-live period expires, the CDN will check to see whether the CDN endpoint is still valid and the object still anonymously accessible. If it is not, then the object will no longer be cached.   

No explicit "purge" tool is currently available for the Azure CDN.
