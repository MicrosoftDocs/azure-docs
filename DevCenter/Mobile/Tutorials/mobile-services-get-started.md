<properties linkid="mobile-get-started" urldisplayname="Mobile Services" headerexpose="" pagetitle="Get started with Mobile Services in Windows Azure" metakeywords="Get started Windows Azure Mobile Services, mobile devices, Windows Azure, mobile, Windows 8, WinRT app" footerexpose="" metadescription="Get started using Windows Azure Mobile Services in your Windows Store apps." umbraconavihide="0" disquscomments="1"></properties>

# <a name="getting-started"> </a>Get started with Mobile Services
This tutorial shows you how to get started with Mobile Services for Windows Azure. In this tutorial, you will create a new mobile service and add a mobile reference to a Windows 8 app. 

A screenshot of the completed Windows 8 quickstart app is below:

![][0]

**Todo: add screen shot**

Completing this guide is a prerequisite for all other Mobile Services tutorials. This tutorial creates a new mobile service .

<div chunk="../../Shared/Chunks/create-account-and-mobile-note.md" />

### Create a new mobile service
Follow these steps to create a new mobile service by using the default settings.

1.	Log into the [Preview Management Portal][Management Portal preview]. 
2.	At the bottom of the navigation pane, click **+NEW**.

	![][1]

3.	Click **Compute**, **Mobile Service**, then **Create**.

	![][2]

4.	In **URL**, type a subdomain name to use in the URL for the mobile service, wait for the name verfication, and then click the right arrow button to go to the next page. 
	
	![][3]

    <div class="dev-callout"> 
	<b>Note</b> 
	<p>URL values in Mobile Services must be globally unique. When the name that you specify is available, a green check icon is displayed; otherwise, a warning is displayed and you are asked to choose a different name.</p> 
	</div>
	
5.	In **Login name**, type the name that is the login for the new SQL Database server, type and confirm the password for the login, and then click the check button to complete the process.

	![][4]

    <div class="dev-callout"> 
	<b>Note</b> 
	<p>When the password that you supply does not meet the minimum requirements or when there is a mismatch, a warning is displayed. <br/>Make a note of the the login name and password that you specify.</p> 
	</div>

You have now created a new mobile service, along with a new SQL Database instance, that can be used by your mobile apps.

### Add Mobile Services to a Windows 8 app

The Mobile Services quickstart makes it easy to use Windows Azure in either a new or an existing Windows 8 app. 

Follow these steps to create a new Windows 8 app.

1.  In the Preview Management Portal, click **Mobile Services**, then click your new mobile service.

    ![][5]

2. In the quickstart tab, expand **Create a new Windows 8 application**.

    ![][6]

3. If you haven't already done so, download and install Visual Studio 2012 Express for Windows 8 and the Mobile Services SDK on your local computer or virtual machine. Download links for both are provided on the quickstart page.

    ![][7]

4. Click **Create ToDoItems table** to create a table to store app data.

    ![][8]

5. Under **Download and run application**, select a language for your app, then click **Download**. Save the compressed project file to your local computer (make a note of where you save it).

   ![][9]

Now, you are ready to run the new app. 

### Build and test your app

The final stage of this tutorial is to build and run your new Windows 8 app.

1. Browse to the location where you saved the compressed project files, expand the files on your computer, and open the solution file in Visual Studio 2012 Express for Windows 8. 

2. Press the **F5** key to rebuild the project and start the app.

### <a name="next-steps"> </a>Next Steps
Once you have either downloaded the pre-generated quickstart project or enabled Mobile Services in an existing Windows 8 app, you can learn how to perform the following key tasks in Mobile Services: 

* [Get started with data]
* [Get started with users]   
* [Get started with push notifications] 

<!-- Anchors. -->
[Getting started with Mobile Services]:#getting-started
[Define the mobile service instance]:#define-mobile-service-instance
[Next Steps]:#next-steps

<!-- Images. -->
[0]: ../Media/mobile-quickstart-completed.png
[1]: ../../Shared/Media/plus-new.png
[2]: ../Media/mobile-create.png
[3]: ../Media/mobile-create-page1.png
[4]: ../Media/mobile-create-page2.png
[5]: ../Media/mobile-services-selection.png
[6]: ../Media/mobile-portal-quickstart.png
[7]: ../Media/mobile-quickstart-get-tools.png
[8]: ../Media/mobile-quickstart-create-table.png
[9]: ../Media/mobile-quickstart-download-app.png

<!-- URLs. -->
[Get started with data]: ./mobile-services-get-started-with-data-dotnet/
[Get started with users]: ./mobile-services-get-started-with-users-dotnet/
[Get started with push notifications]: ./mobile-services-get-started-with-push-dotnet/
[JavaScript and HTML]: mobile-services-win8-javascript/
[WindowsAzure.com]: http://www.windowsazure.com/
[Management Portal preview]: https://manage.windowsazure.com/