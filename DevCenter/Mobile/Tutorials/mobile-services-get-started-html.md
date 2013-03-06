<properties linkid="develop-mobile-tutorials-get-started" urlDisplayName="Get Started" pageTitle="Get Started with Windows Azure Mobile Services" metaKeywords="" metaDescription="Follow this tutorial to get started using Windows Azure Mobile Services for HTML5 development. " metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu-html.md" />

# <a name="getting-started"> </a>Get started with Mobile Services

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/develop/mobile/tutorials/get-started" title="Windows Store">Windows Store</a><a href="/en-us/develop/mobile/tutorials/get-started-wp8" title="Windows Phone 8">Windows Phone 8</a><a href="/en-us/develop/mobile/tutorials/get-started-ios" title="iOS">iOS</a><a href="/en-us/develop/mobile/tutorials/get-started-android" title="Android">Android</a><a href="/en-us/develop/mobile/tutorials/get-started-html" title="HTML" class="current">HTML</a></div>

This tutorial shows you how to add a cloud-based backend service to an HTML app using Windows Azure Mobile Services. In this tutorial, you will create both a new mobile service and a simple _To do list_ app that stores app data in the new mobile service. 

A screenshot from the completed app is below:

![][0]

Completing this tutorial is a prerequisite for all other Mobile Services tutorials for HTML apps. 

<div class="dev-callout"><strong>Note</strong> <p>To complete this tutorial, you need a Windows Azure account that has the Windows Azure Mobile Services feature enabled.</p> <ul> <li>If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started-html%2F" target="_blank">Windows Azure Free Trial</a>.</li> <li>If you have an existing account but need to enable the Windows Azure Mobile Services preview, see <a href="../create-a-windows-azure-account/#enable" target="_blank">Enable Windows Azure preview features</a>.</li> </ul> </div>

You must also have a web server running on your local computer. The web server and browser must support HTML5.


## <a name="create-new-service"> </a>Create a new mobile service
Follow these steps to create a new mobile service.

1.	Log into the [Management Portal]. 
2.	At the bottom of the navigation pane, click **+NEW**.

	![][1]

3.	Expand **Mobile Service**, then click **Create**.

	![][2]

    This displays the **New Mobile Service** dialog.

4.	In the **Create a mobile service** page, type a subdomain name for the new mobile service in the **URL** textbox and wait for name verification. Once name verification completes, click the right arrow button to go to the next page.	

	![][3]

    This displays the **Specify database settings** page.

    <div class="dev-callout"> 
	<b>Note</b> 
	<p>As part of this tutorial, you create a new SQL Database instance and server. You can reuse this new database and administer it as you would any other SQL Database instance. If you already have a database in the same region as the new mobile service, you can instead choose <strong>Use existing Database</strong> and then select that database. The use of a database in a different region is not recommended because of additional bandwidth costs and higher latencies.</p></div>	

6.	In **Name**, type the name of the new database, then type **Login name**, which is the administrator login name for the new SQL Database server, type and confirm the password, and click the check button to complete the process.

	![][4]

    <div class="dev-callout"> 
	<b>Note</b> 
	<p>When the password that you supply does not meet the minimum requirements or when there is a mismatch, a warning is displayed. <br/>We recommend that you make a note of the administrator login name and password that you specify; you will need this information to reuse the SQL Database instance or the server in the future.</p> 
	</div>

You have now created a new mobile service that can be used by your mobile apps.

## <h2><span class="short-header">Create a new app</span>Create a new HTML app</h2>

Once you have created your mobile service, you can follow an easy quickstart in the Management Portal to either create a new app or modify an existing app to connect to your mobile service. 

In this section you will create a new HTML app that is connected to your mobile service.

1.  In the Management Portal, click **Mobile Services**, and then click the mobile service that you just created.

   
2. In the quickstart tab, click **Windows** under **Choose platform** and expand **Create a new HTML app**.

   ![][6]

   This displays the three easy steps to create and host an HTML app connected to your mobile service.

  ![][7]

4. Click **Create TodoItems table** to create a table to store app data.

5. Under **Download and run application**, click **Download**. 

  This downloads the web site files for the sample _To do list_ application that is connected to your mobile service. Save the compressed file to your local computer, and make a note of where you save it.

## Host and run your HTML app

The final stage of this tutorial is to host and run your new app on your local computer.

1. Browse to the location where you saved the compressed project files, expand the files on your computer, and launch one of the following command files from the **server** subfolder.

	+ **launch-windows.com** (Windows computers) 
	+ **launch-mac.command** (Mac OS X computers)
	+ **launch-linux.sh** (Linux computers)

	This starts a web server on your local computer to host the new app.

2. Open the URL <a href="http://localhost:8000/" target="_blank">http://localhost:8000/</a> in a web browser start the app.

3. In the app, type meaningful text, such as _Complete the tutorial_, in **Enter a new task**, and then click **Add**.

   ![][10]

   This sends a POST request to the new mobile service hosted in Windows Azure. Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile service, and the data is displayed in the second column in the app.

	<div class="dev-callout"> 
	<b>Note</b> 
   	<p>You can review the code that accesses your mobile service to query and insert data, which is found in the app.js file.</p> 
 	</div>

4. Back in the Management Portal, click the **Data** tab and then click the **TodoItems** table.

   ![][11]

   This lets you browse the data inserted by the app into the table.

   ![][12]

## <a name="next-steps"> </a>Next Steps
Now that you have completed the quickstart, learn how to perform additional important tasks in Mobile Services: 

* **[Get started with data]**
  <br/>Learn more about storing and querying data using Mobile Services.

* **[Get started with authentication]**
  <br/>Learn how to authenticate users of your app with an identity provider.

<!-- Anchors. -->
[Getting started with Mobile Services]:#getting-started
[Create a new mobile service]:#create-new-service
[Define the mobile service instance]:#define-mobile-service-instance
[Next Steps]:#next-steps

<!-- Images. -->
[0]: ../Media/mobile-quickstart-completed-html.png
[1]: ../../Shared/Media/plus-new.png
[2]: ../Media/mobile-create.png
[3]: ../Media/mobile-create-page1.png
[4]: ../Media/mobile-create-page2.png
[5]: ../Media/mobile-services-selection.png
[6]: ../Media/mobile-portal-quickstart-html.png
[7]: ../Media/mobile-quickstart-steps-html.png
[8]: ../Media/mobile-web-project.png
[10]: ../Media/mobile-quickstart-startup-html.png
[11]: ../Media/mobile-data-tab.png
[12]: ../Media/mobile-data-browse.png
[13]: ../Media/mobile-services-diagram.png

<!-- URLs. -->
[Get started with data]: ./mobile-services-get-started-with-data-html.md
[Get started with authentication]: ./mobile-services-get-started-with-users-html.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Management Portal]: https://manage.windowsazure.com/