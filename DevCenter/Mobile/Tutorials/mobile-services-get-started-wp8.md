<properties linkid="mobile-services-get-started" urldisplayname="Mobile Services" headerexpose="" pagetitle="Get started with Mobile Services in Windows Azure" metakeywords="Get started Windows Azure Mobile Services, mobile devices, Windows Azure, mobile, Windows Phone 8, Windows Phone" footerexpose="" metadescription="Get started using Windows Azure Mobile Services in your Windows Phone 8 apps." umbraconavihide="0" disquscomments="1"></properties>
<div class="umbMacroHolder" title="This is rendered content from macro" onresizestart="return false;" umbpageid="14812" ismacro="true" umb_chunkname="MobileArticleLeft" umb_chunkpath="devcenter/Menu" umb_macroalias="AzureChunkDisplayer" umb_hide="0" umbversionid="254ca664-c4f3-4815-8073-c86d43f4aa16" umb_modaltrigger="" umb_chunkurl="" umb_modalpopup="0"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

<!--<div class="dev-center-os-selector">
  <a href="/en-us/develop/mobile/tutorials/get-started/" title="Windows Store version">Windows Store app</a>
  <a href="/en-us/develop/mobile/tutorials/get-started-ios/" title="iOS version" class="current">iOS app</a>
  <span>Tutorial</span>
</div>-->

# <a name="getting-started"> </a>Get started with Mobile Services

<div class="dev-center-tutorial-selector"> 
	<a href="/en-us/develop/mobile/tutorials/get-started" title="Windows Store">Windows Store</a>
	<a href="/en-us/develop/mobile/tutorials/get-started-wp8" title="Windows Phone 8" class="current">Windows Phone 8</a> 
	<a href="/en-us/develop/mobile/tutorials/get-started-ios" title="iOS">iOS</a> 
</div>


This tutorial shows you how to add a cloud-based backend service to a Windows Phone 8 app using Windows Azure Mobile Services. In this tutorial, you will create both a new mobile service and a simple _To do list_ app that stores app data in the new mobile service. 

A screenshot from the completed app is below:

![][0]

<div class="dev-callout"><strong>Note</strong> <p>To complete this tutorial, you need a Windows Azure account that has the Windows Azure Mobile Services feature enabled.</p> <ul> <li>If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A0E0E5C02" target="_blank">Windows Azure Free Trial</a>.</li> <li>If you have an existing account but need to enable the Windows Azure Mobile Services preview, see <a href="../create-a-windows-azure-account/#enable" target="_blank">Enable Windows Azure preview features</a>.</li> </ul> </div>

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

## <h2><span class="short-header">Create a new app</span>Create a new Windows Phone app</h2>

Once you have created your mobile service, you can follow an easy quickstart in the Management Portal to either create a new app or modify an existing app to connect to your mobile service. 

In this section you will create a new Windows Phone 8 app that is connected to your mobile service.

1.  In the Management Portal, click **Mobile Services**, and then click the mobile service that you just created.

2. In the quickstart tab, click **Windows Phone 8** under **Choose platform** and expand **Create a new Windows Phone 8 app**.

   ![][6]

   This displays the three easy steps to create a Windows Phone app connected to your mobile service.

  ![][7]

3. If you haven't already done so, download and install [Visual Studio 2012 Express for Windows Phone] and the [Mobile Services SDK] on your local computer or virtual machine.

4. Click **Create TodoItems table** to create a table to store app data.

5. Under **Download and run app**, click **Download**. 

  This downloads the project for the sample _To do list_ application that is connected to your mobile service. Save the compressed project file to your local computer, and make a note of where you save it.

## Run your Windows Phone app

The final stage of this tutorial is to build and run your new app.

1. Browse to the location where you saved the compressed project files, expand the files on your computer, and open the solution file in Visual Studio 2012 Express for Windows Phone.

   ![][8]

2. Press the **F5** key to rebuild the project and start the app.

3. In the app, type meaningful text, such as _Complete the tutorial_ and then click **Save**.

   ![][10]

   This sends a POST request to the new mobile service hosted in Windows Azure. Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile service, and the data is displayed in the list.

	<div class="dev-callout"> 
	<b>Note</b> 
   	<p>You can review the code that accesses your mobile service to query and insert data, which is found in the MainPage.xaml.cs file.</p> 
 	</div>

4. Back in the Management Portal, click the **Data** tab and then click the **TodoItems** table.

   ![][11]

   This lets you browse the data inserted by the app into the table.

   ![][12]

## <a name="next-steps"> </a>Next Steps
Now that you have completed the quickstart, learn how to perform additional important tasks in Mobile Services: 

* [Get started with data]
  <br/>Learn more about storing and querying data using Mobile Services.

* [Get started with authentication]
  <br/>Learn how to authenticate users of your app with an identity provider.

* [Get started with push notifications] 
  <br/>Learn how to send a very basic push notification to your app.

<!-- Anchors. -->
[Getting started with Mobile Services]:#getting-started
[Create a new mobile service]:#create-new-service
[Define the mobile service instance]:#define-mobile-service-instance
[Next Steps]:#next-steps

<!-- Images. -->
[0]: ../Media/mobile-quickstart-completed-wp8.png
[1]: ../../Shared/Media/plus-new.png
[2]: ../Media/mobile-create.png
[3]: ../Media/mobile-create-page1.png
[4]: ../Media/mobile-create-page2.png
[5]: ../Media/mobile-services-selection.png
[6]: ../Media/mobile-portal-quickstart-wp8.png
[7]: ../Media/mobile-quickstart-steps-wp8.png
[8]: ../Media/mobile-vs-project-wp8.png
[9]: ../Media/mobile-quickstart-download-app.png
[10]: ../Media/mobile-quickstart-startup-wp8.png
[11]: ../Media/mobile-data-tab.png
[12]: ../Media/mobile-data-browse.png
[13]: ../Media/mobile-services-diagram.png

<!-- URLs. -->
[Get started with data]: ./mobile-services-get-started-with-data-wp8.md
[Get started with authentication]: ./mobile-services-get-started-with-users-wp8.md
[Get started with push notifications]: ./mobile-services-get-started-with-push-wp8.md
[Visual Studio 2012 Express for Windows Phone]: https://go.microsoft.com/fwLink/p/?LinkID=268374
[Mobile Services SDK]: https://go.microsoft.com/fwLink/p/?LinkID=268375
[WindowsAzure.com]: http://www.windowsazure.com/
[Management Portal]: https://manage.windowsazure.com/