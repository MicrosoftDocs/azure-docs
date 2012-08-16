<properties linkid="mobile-get-started-with-push-dotnet" urldisplayname="Mobile Services" headerexpose="" pagetitle="Get started with push notifications for Mobile Services in Windows Azure" metakeywords="Get started Windows Azure Mobile Services, mobile devices, push notifications, Windows Azure, mobile, Windows 8, WinRT app" footerexpose="" metadescription="Get started using Windows Azure Mobile Services in your Windows Store apps." umbraconavihide="0" disquscomments="1"></properties>

# Get started with push notifications in Mobile Services
Language: **C# and XAML**  

This topic shows you how to send push notifications from Windows Azure Mobile Services from a Windows app.  
In this tutorial, you add Live Connect authentication to the quickstart project. When successfully authenticated by Live Connect, a logged-in user is welcomed by name and the user ID value is displayed.  

To be able to authenticate users, you must register your Windows app and configure Mobile Services to integrate with Live Connect. You can do this at the Live Connect Developer Center.

1. Download the sample app from here.

1. Follow the steps in the [Get started with Mobile Services] tutorial to create a new mobile service. 

### Build and test your app

The final stage of this tutorial is to build and run your new Windows 8 app.

1. Browse to the location where you saved the compressed project files, expand the files on your computer, and open the solution file in Visual Studio 2012 Express for Windows 8. 

2. Press the **F5** key to rebuild the project and start the app.

3. In the app, enter text in **Insert a TodoItem** and then click **Save**.

   ![][10]

   This inserts the text in the TodoItem table in the mobile service. Text stored in the table is returned by the service and displayed in the second column.

### <a name="next-steps"> </a>Next Steps

Some 

<!-- Anchors. -->

[Next Steps]:#next-steps

<!-- Images. -->


<!-- URLs. -->
[Get started with Mobile Services]: ./mobile-services-get-started#create-new-service/
[Get started with data]: ./mobile-services-get-started-with-data-dotnet/
[Get started with users]: ./mobile-services-get-started-with-users-dotnet/
[Get started with push notifications]: ./mobile-services-get-started-with-push-dotnet/
[JavaScript and HTML]: mobile-services-win8-javascript/
[WindowsAzure.com]: http://www.windowsazure.com/
[Management Portal preview]: https://manage.windowsazure.com/