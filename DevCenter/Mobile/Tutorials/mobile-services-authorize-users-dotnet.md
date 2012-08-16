<properties linkid="mobile-services-authorize-users-dotnet" urldisplayname="Mobile Services" headerexpose="" pagetitle="Authorize users with Mobile Services" metakeywords="Authorize users with Mobile Services, mobile devices, Windows Azure, mobile, Windows 8, WinRT app, authorization" footerexpose="" metadescription="Authorize users with Windows Azure Mobile Services in your Windows Store apps." umbraconavihide="0" disquscomments="1"></properties>

# Use scripts to authorize users in Mobile Services
Language: **C# and XAML**  

This topic shows you how to use scripts to authorize authenticated users for accessing data in Windows Azure Mobile Services from a Windows 8 app.  In this tutorial, you register service-side scripts to filter queries based on the userId of an authenticated user.  

To be able to authenticate users, you must register your Windows app and configure Mobile Services to integrate with Live Connect. You can do this at the Live Connect Developer Center.

1. Add the following insert script for todoitem. This will ensure that every item is associated with the user that created it.

   function insert(item, user, context) {
    item.userId = user.userId;    
    context.execute();
}

2. Add the following read script for todoitem. This will ensure that each user only sees their own items.

  function read(query, user, context) {
    query.where({ userId: user.userId });    
    context.execute();
}

3. Run the application and sign in. The item list should become empty because you have no data recorded against the current user.
 
4. Add some new items.

5. Browse to the TodoItem data in the portal and you will see that each item has an associated userId.

6. If you have an additional Microsoft Account you can test that users can only see their own data by closing the app (alt+f4) and then running it again. When the login credentials dialog is displayed, enter a different Microsoft account and then verify that the items entered under the previous account are not displayed. This concludes the tutorial.


### Build and test your app

The final stage of this tutorial is to build and run your new Windows 8 app.

1. Browse to the location where you saved the compressed project files, expand the files on your computer, and open the solution file in Visual Studio 2012 Express for Windows 8. 

2. Press the **F5** key to rebuild the project and start the app.

3. In the app, enter text in **Insert a TodoItem** and then click **Save**.

   ![][10]

   This inserts the text in the TodoItem table in the mobile service. Text stored in the table is returned by the service and displayed in the second column.

### <a name="next-steps"> </a>Next Steps

In the next tutorial, Authorize users with scripts, you will take the user ID value and use it to filter the data returned from a table. 

<!-- Anchors. -->

[Next Steps]:#next-steps

<!-- Images. -->


<!-- URLs. -->
[Windows Push Notifications & Live Connect]: http://go.microsoft.com/fwlink/?LinkID=257677
[My Apps dashboard]: http://go.microsoft.com/fwlink/?LinkId=262039
[Get started with Mobile Services]: ./mobile-services-get-started#create-new-service/
[Get started with data]: ./mobile-services-get-started-with-data-dotnet/
[Get started with users]: ./mobile-services-get-started-with-users-dotnet/
[Get started with push notifications]: ./mobile-services-get-started-with-push-dotnet/
[JavaScript and HTML]: mobile-services-win8-javascript/
[WindowsAzure.com]: http://www.windowsazure.com/
[Management Portal preview]: https://manage.windowsazure.com/