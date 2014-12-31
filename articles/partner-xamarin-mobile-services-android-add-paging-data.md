<properties urlDisplayName="Add paging to data" pageTitle="Add paging to data (Xamarin Android) | Mobile Dev Center" metaKeywords="" description="Learn how to use paging to manage the amount of data returned to your Xamarin Android app from Mobile Services."  services="mobile-services" metaCanonical="" disqusComments="1" umbracoNaviHide="1" documentationCenter="Mobile" title="Refine Mobile Services queries with paging" authors="donnam" manager="dwrede" />

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-xamarin-android" ms.devlang="dotnet" ms.topic="article" ms.date="09/25/2014" ms.author="donnam" />

# Refine Mobile Services queries with paging

[WACOM.INCLUDE [mobile-services-selector-add-paging-data](../includes/mobile-services-selector-add-paging-data.md)]


This topic shows you how to use paging to manage the amount of data returned to your Xamarin.Android app from Azure Mobile Services. In this tutorial, you will use the **Take** and **Skip** query methods on the client to request specific "pages" of data.

> [AZURE.NOTE] To prevent data overflow in mobile device clients, Mobile Services implements an automatic page limit, which defaults to a maximum of 50 items in a response. By specifying the page size, you can explicitly request up to 1,000 items in the response.

This tutorial builds on the steps and the sample app from the previous tutorial [Get started with data]. Before you begin this tutorial, you must complete at least the first tutorial in the working with data series, [Get started with data]. 

1. In Xamarin Studio, open the project that you created when you completed the tutorial [Get started with data].

2. Click **Run** to start the app, then enter text into the textbox and click the **Add** button.

3. Repeat the previous step at least three times, so that you have more than three items stored in the TodoItem table. 

4. In the **TodoActivity.cs** file, replace the LINQ query in the **RefreshItemsFromTableAsync** method with the following query:

		var list = await todoTable.Where(item => item.Complete == false)
						          .Take(3)
			                      .ToListAsync();

	  This query returns the top three items that are not marked as completed.

5. Rebuild and start the app. 
   
    Notice that only the first three results from the TodoItem table are displayed. 

6. (Optional) View the URI of the request sent to the mobile service by using message inspection software, such as browser developer tools or [Fiddler]. 

   	Notice that the `Take(3)` method was translated into the query option `$top=3` in the query URI.

7. Update the LINQ query in **RefreshItemsFromTableAsync** method once more with the following query:
            
			var list = await todoTable.Where(item => item.Complete == false)
							          .Skip(3)
				                      .Take(3)
                 				      .ToListAsync();

   	This query skips the first three results and returns the next three after that. This is effectively the second "page" of data, where the page size is three items.

    > [AZURE.NOTE] This tutorial uses a simplified scenario by passing hard-coded paging values to the **Take** and **Skip** methods. In a real-world app, you can use queries similar to the above with a pager control or comparable UI to let users navigate to previous and next pages. You can also call the  **IncludeTotalCount** method to get the total count of items available on the server, along with the paged data.

8. (Optional) Again view the URI of the request sent to the mobile service. 

   	Notice that the `Skip(3)` method was translated into the query option `$skip=3` in the query URI.

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
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started-xamarin-android
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-xamarin-android
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-xamarin-android
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-xamarin-android

[Management Portal]: https://manage.windowsazure.com/

