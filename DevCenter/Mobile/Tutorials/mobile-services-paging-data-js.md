<properties linkid="develop-mobile-tutorials-add-paging-to-data-js" urlDisplayName="Add Paging to Data" pageTitle="Add paging to data (JavaScript) - Windows Azure Mobile Services" metaKeywords="" metaDescription="Learn how to add paging to your data in Windows Azure Mobile Services." metaCanonical="http://www.windowsazure.com/en-us/develop/mobile/tutorials/add-paging-to-data-dotnet/" disqusComments="1" umbracoNaviHide="1" />


<div chunk="../chunks/article-left-menu-windows-store.md" />

# Refine Mobile Services queries with paging
<div class="dev-center-tutorial-selector"> 
	<a href="/en-us/develop/mobile/tutorials/add-paging-to-data-dotnet" title="Windows Store C#">Windows Store C#</a><a href="/en-us/develop/mobile/tutorials/add-paging-to-data-js" title="Windows Store JavaScript" class="current">Windows Store JavaScript</a><a href="/en-us/develop/mobile/tutorials/add-paging-to-data-wp8" title="Windows Phone 8">Windows Phone 8</a><a href="/en-us/develop/mobile/tutorials/add-paging-to-data-ios" title="iOS">iOS</a>
</div>

This topic shows you how to use paging to manage the amount of data returned to your Windows Store app from Windows Azure Mobile Services. In this tutorial, you will use the **Take** and **Skip** query methods on the client to request specific "pages" of data.

<div class="dev-callout"><b>Note</b>
<p>To prevent data overflow in mobile device clients, Mobile Services implements an automatic page limit, which defaults to a maximum of 50 items in a response. By specifying the page size, you can explicitly request up to 1,000 items in the response.</p>
</div>

This tutorial builds on the steps and the sample app from the previous tutorial [Get started with data]. Before you begin this tutorial, you must complete at least the first tutorial in the working with data series&#151;[Get started with data]. 

1. In Visual Studio 2012 Express for Windows 8, open the project that you modified when you completed the tutorial [Get started with data].

2. Press the **F5** key to run the app, then type text in **Insert a TodoItem** and click **Save**.

3. Repeat the previous step at least three times, so that you have more than three items stored in the TodoItem table. 

2. In the default.js file, replace the **RefreshTodoItems** method with the following code:

        var refreshTodoItems = function () {
            // Define a filtered query that returns the top 3 items.
            todoTable.where({ complete: false })
                .take(3)
                .read()
                .done(function (results) {
                    todoItems = new WinJS.Binding.List(results);
                    listItems.winControl.itemDataSource = todoItems.dataSource;
                });
        };

  This query, when executed during data binding, returns the top three items that are not marked as completed.

3. Press the **F5** key to run the app.

  Notice that only the first three results from the TodoItem table are displayed. 

4. (Optional) View the URI of the request sent to the mobile service by using message inspection software, such as browser developer tools or [Fiddler]. 

   Notice that the **take(3)** method was translated into the query option **$top=3** in the query URI.

5. Update the **RefreshTodoItems** method once more with the following code:
            
        var refreshTodoItems = function () {
            // Define a filtered query that skips the first 3 items and 
            // then returns the next 3 items.
            todoTable.where({ complete: false })
                .skip(3)
                .take(3)
                .read()
                .done(function (results) {
                    todoItems = new WinJS.Binding.List(results);
                    listItems.winControl.itemDataSource = todoItems.dataSource;
                });
        };

   This query skips the first three results and returns the next three after that. This is effectively the second "page" of data, where the page size is three items.

    <div class="dev-callout"><b>Note</b>
    <p>This tutorial uses a simplified scenario by passing hard-coded paging values to the <strong>Take</strong> and <strong>Skip</strong> methods. In a real-world app, you can use queries similar to the above with a pager control or comparable UI to let users navigate to previous and next pages.  You can also call the  <strong>includeTotalCount</strong> method to get the total count of items available on the server, along with the paged data.</p>
    </div>

6. (Optional) Again view the URI of the request sent to the mobile service. 

   Notice that the **skip(3)** method was translated into the query option **$skip=3** in the query URI.

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
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/#create-new-service/
[Get started with data]: ./mobile-services-get-started-with-data-js.md
[Get started with authentication]: ./mobile-services-get-started-with-users-js.md
[Get started with push notifications]: ./mobile-services-get-started-with-push-js.md
[Fiddler]: http://go.microsoft.com/fwlink/?LinkId=262412
[JavaScript and HTML]: mobile-services-win8-javascript/
[WindowsAzure.com]: http://www.windowsazure.com/
[Management Portal]: https://manage.windowsazure.com/