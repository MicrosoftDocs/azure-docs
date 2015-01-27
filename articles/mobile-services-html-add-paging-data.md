<properties 
	pageTitle="Add paging to data (HTML 5) | Mobile Dev Center" 
	description="Learn how to use paging to manage the amount of data returned to your HTML app from Mobile Services." 
	services="mobile-services" 
	documentationCenter="" 
	authors="ggailey777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-html" 
	ms.devlang="javascript" 
	ms.topic="article" 
	ms.date="09/24/2014" 
	ms.author="glenga"/>

# Refine Mobile Services queries with paging

[AZURE.INCLUDE [mobile-services-selector-add-paging-data](../includes/mobile-services-selector-add-paging-data.md)]

This topic shows you how to use paging to manage the amount of data returned to your HTML app from Azure Mobile Services. In this tutorial, you will use the **Take** and **Skip** query methods on the client to request specific "pages" of data.

> [AZURE.NOTE] To prevent data overflow in mobile device clients, Mobile Services implements an automatic page limit, which defaults to a maximum of 50 items in a response. By specifying the page size, you can explicitly request up to 1,000 items in the response.

This tutorial builds on the steps and the sample app from the previous tutorial [Get started with data]. Before you begin this tutorial, you must complete at least the first tutorial in the working with data series, [Get started with data]. 

1. Run one of the following command files from the **server** subfolder of the project that you modified when you completed the tutorial [Get started with data].

	+ **launch-windows** (Windows computers) 
	+ **launch-mac.command** (Mac OS X computers)
	+ **launch-linux.sh** (Linux computers)

	> [AZURE.NOTE] On a Windows computer, type `R` when PowerShell asks you to confirm that you want to run the script. Your web browser might warn you to not run the script because it was downloaded from the internet. When this happens, you must request that the browser proceed to load the script.

	This starts a web server on your local computer to host the app.

1. In a web browser, navigate to <a href="http://localhost:8000/" target="_blank">http://localhost:8000/</a>, then type text in **Add new task** and click **Add**.

3. Repeat the previous step at least three times, so that you have more than three items stored in the TodoItem table. 

2. In the app.js file, replace the definitoin of the `query` variable in the **refreshTodoItems** method with the following line code:

       
        var query = todoItemTable.where({ complete: false }).take(3);

  	This query, when executed, returns the top three items that are not marked as completed.

3. Go back to the web browser and reload the page.

  	Notice that only the first three results from the TodoItem table are displayed. 

4. (Optional) View the URI of the request sent to the mobile service by using message inspection software, such as browser developer tools or [Fiddler]. 

   	Notice that the **take(3)** method was translated into the query option **$top=3** in the query URI.

5. Update the query once more with the following code:
            
        var query = todoItemTable.where({ complete: false }).skip(3).take(3);

3. Go back to the web browser and reload the page.

   	This query skips the first three results and returns the next three after that. This is effectively the second "page" of data, where the page size is three items.

    > [AZURE.NOTE] This tutorial uses a simplified scenario by passing hard-coded paging values to the **Take** and **Skip** methods. In a real-world app, you can use queries similar to the above with a pager control or comparable UI to let users navigate to previous and next pages.  You can also call the  **includeTotalCount** method to get the total count of items available on the server, along with the paged data.

6. (Optional) Again view the URI of the request sent to the mobile service. 

   	Notice that the **skip(3)** method was translated into the query option **$skip=3** in the query URI.

## <a name="next-steps"> </a>Next Steps

This concludes the set of tutorials that demonstrate the basics of working with data in Mobile Services. Next, Learn how to authenticate users of your app in [Get started with authentication]. Learn more about how to use Mobile Services with HTML/JavaScript in [Mobile Services HTML/JavaScript How-to Conceptual Reference]

<!-- Anchors. -->

[Next Steps]:#next-steps

<!-- Images. -->


<!-- URLs. -->
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started-html
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-html
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-html


[Management Portal]: https://manage.windowsazure.com/
[Mobile Services HTML/JavaScript How-to Conceptual Reference]: /en-us/develop/mobile/how-to-guides/work-with-html-js-client

