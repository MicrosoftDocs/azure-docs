<properties pageTitle="Add paging to data (Windows Phone) | Mobile Dev Center" metaKeywords="" description="Learn how to use paging to manage the amount of data returned to your Windows Phone app from Mobile Services." metaCanonical="" services="mobile-services" documentationCenter="Mobile" title="Refine Mobile Services queries with paging" authors="glenga" solutions="" manager="dwrede" editor="" />

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-windows-phone" ms.devlang="dotnet" ms.topic="article" ms.date="10/11/2014" ms.author="glenga" />

# Refine Mobile Services queries with paging

[WACOM.INCLUDE [mobile-services-selector-add-paging-data](../includes/mobile-services-selector-add-paging-data.md)]

This topic shows you how to use paging to manage the amount of data returned to your Windows Phone app from Azure Mobile Services. In this tutorial, you will use the **Take** and **Skip** query methods on the client to request specific "pages" of data.

>[AZURE.NOTE]To prevent data overflow in mobile device clients, Mobile Services implements an automatic page limit, which defaults to a maximum of 50 items in a response. By specifying the page size, you can explicitly request up to 1,000 items in the response.

This tutorial builds on the steps and the sample app from the previous tutorial [Add Mobile Services to an existing app](/en-us/documentation/articles/mobile-services-dotnet-backend-windows-phone-get-started-data/). Before you begin this tutorial, you must complete this tutorial. 

##Set the server page size

[WACOM.INCLUDE [mobile-services-windows-dotnet-paging](../includes/mobile-services-windows-dotnet-paging.md)]

## <a name="next-steps"> </a>Next Steps

This concludes the set of tutorials that demonstrate the basics of working with data in Mobile Services. Consider finding out more about the following Mobile Services topics:

* [Get started with authentication]
  <br/>Learn how to authenticate users of your app with Windows Account.

* [Get started with push notifications] 
  <br/>Learn how to send a very basic push notification to your app.

<!-- Anchors. -->

[Next Steps]:#next-steps

<!-- Images. -->


<!-- URLs. -->
[Get started with Mobile Services]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-phone-get-started/
[Get started with data]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-phone-get-started-data/
[Get started with authentication]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-phone-get-started-users/
[Get started with push notifications]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-phone-get-started-push/


[Management Portal]: https://manage.windowsazure.com/
