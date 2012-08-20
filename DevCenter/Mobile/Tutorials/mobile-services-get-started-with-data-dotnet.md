<properties linkid="mobile-services-get-started-with-data-dotnet" urldisplayname="Mobile Services" headerexpose="" pagetitle="Get started with data in Windows Azure Mobile Services" metakeywords="access and change data, Windows Azure Mobile Services, mobile devices, Windows Azure, mobile, Windows 8, WinRT app" footerexpose="" metadescription="More in-depth review of how to access and change in your Windows 8 app using Windows Azure Mobile Services." umbraconavihide="0" disquscomments="1"></properties>

# Get started with data in Mobile Services
Language: **C# and XAML**  

This topic shows you how to use Windows Azure Mobile Services to leverage data in a Windows Store app. In this tutorial, you will download a Windows Store app, create a new mobile service without using the Mobile Services quickstart, integrate the mobile service with the app, and then login to the Windows Azure Management Portal to view changes to data made when running the app.

<div class="dev-callout"><b>Note</b>
<p>This tutorial is intended to help you better understand how Mobile Services enables you to use Windows Azure to store and retrieve data from a Windows Store app. As such, this topic walks you through many of the steps that are completed for you in the Mobile Services quickstart. If this is your first experience with Mobile Services, consider first completing the tutorial [Get started with Mobile Services].</p>
</div>


This tutorial walks you through these basic steps:

1. [Get the Windows Store app] 
2. [Create the mobile service]
3. [Add authentication to the app]
4. [Next steps]

This tutorial requires the [Mobile Services SDK]. 

### <a name="download-app"></a>Get the Windows Store app

This tutorial is based on a *sample app*. The first thing that you need to do is to download this sample application.

1. Download the sample app from here. Explain the serverless Win8 app  in short. Task is to create a backend for the app

1. Follow the steps in the [Get started with Mobile Services] tutorial to create a new mobile service. 

0. Create a Mobile Service without quick start

2. Create table from the portal without going through quick start
	
  View that table is empty and that there are no rows or columns

3. Change in-memory-collection insert and query to go against Mobile Service

4. Run the app and add data through client UI
	
  Call out auto-generated ID

5. Go to portal and browse data 
	
   Show types of columns

6. Make an update and show it through client UI

7. Go to portal and browse modified data

8. Change query to also show completed todo items

9. Change update operations to go against Mobile Service

10. View changes in client UI

11. View changes in the portal

### <a name="next-steps"> </a>Next Steps

Some 

<!-- Anchors. -->

[Get the Windows Store app]: #download-app
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
[Mobile Services SDK]: http://go.microsoft.com/fwlink/?LinkId=257545
