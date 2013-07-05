<properties linkid="develop-mobile-tutorials-get-started" urlDisplayName="Get Started" pageTitle="Get Started with Windows Azure Mobile Services" metaKeywords="" writer="glenga" metaDescription="Follow this tutorial to get started using Windows Azure Mobile Services for HTML5 development. " metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu-html.md" />

# <a name="getting-started"> </a>Get started with Mobile Services

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/develop/mobile/tutorials/get-started" title="Windows Store">Windows Store</a><a href="/en-us/develop/mobile/tutorials/get-started-wp8" title="Windows Phone">Windows Phone</a><a href="/en-us/develop/mobile/tutorials/get-started-ios" title="iOS">iOS</a><a href="/en-us/develop/mobile/tutorials/get-started-android" title="Android">Android</a><a href="/en-us/develop/mobile/tutorials/get-started-html" title="HTML" class="current">HTML</a></div>

<div class="dev-onpage-video-clear clearfix">
<div class="dev-onpage-left-content">
<p>This tutorial shows you how to add a cloud-based backend service to an HTML app using Windows Azure Mobile Services. In this tutorial, you will create both a new mobile service and a simple <em>To do list</em> app that stores app data in the new mobile service. You can view a video version of this tutorial by clicking the clip to the right.</p>
</div>
<div class="dev-onpage-video-wrapper"><a href="http://go.microsoft.com/fwlink/?LinkId=287040" target="_blank" class="label">watch the tutorial</a> <a style="background-image: url('/media/devcenter/mobile/videos/mobile-html-get-started-180x120.png') !important;" href="http://go.microsoft.com/fwlink/?LinkId=287040" target="_blank" class="dev-onpage-video"><span class="icon">Play Video</span></a> <span class="time">3:51</span></div>
</div>
 
A screenshot from the completed app is below:

![][0]

Completing this tutorial is a prerequisite for all other Mobile Services tutorials for HTML apps. 

<div class="dev-callout"><strong>Note</strong> <p>To complete this tutorial, you need a Windows Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started-html%2F" target="_blank">Windows Azure Free Trial</a>.</p></div>

###Additional requirements

+ This tutorial requires that you have one of the following web servers running on your local computer:

	+  **On Windows**: IIS Express. IIS Express is installed by the [Microsoft Web Platform Installer].   
	+  **On MacOS X**: Python, which should already be installed.
	+  **On Linux**: Python. You must install the [latest version of Python]. 
	
	You can use any web server to host the app, but these are the web servers that are supported by the downloaded scripts.  

+ A web browser that supports HTML5.


## <a name="create-new-service"> </a>Create a new mobile service

<div chunk="../chunks/mobile-services-create-new-service.md" />

## <h2><span class="short-header">Create a new app</span>Create a new HTML app</h2>

Once you have created your mobile service, you can follow an easy quickstart in the Management Portal to either create a new app or modify an existing app to connect to your mobile service. 

In this section you will create a new HTML app that is connected to your mobile service.

1.  In the Management Portal, click **Mobile Services**, and then click the mobile service that you just created.

   
2. In the quickstart tab, click **Windows** under **Choose platform** and expand **Create a new HTML app**.

   ![][6]

   This displays the three easy steps to create and host an HTML app connected to your mobile service.

  ![][7]

3. Click **Create TodoItems table** to create a table to store app data.

4. Under **Download and run application**, click **Download**. 

  This downloads the web site files for the sample _To do list_ application that is connected to your mobile service. Save the compressed file to your local computer, and make a note of where you save it.

5. In the **Configure** tab, verify that `localhost` is already listed in the **Allow requests from host names** list under **Cross-Origin Resource Sharing (CORS)**. If it's not, type `localhost` in the **Host name** field and then click **Save**.

  ![][9]

	<div class="dev-callout"><b>Note</b>
		<p>If you deploy the quickstart app to a web server other than localhost, you must add the host name of the web server to the <strong>Allow requests from host names</strong> list. For more information, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/dn155871.aspx" target="_blank">Cross-origin resource sharing</a>.</p>
	</div>

## Host and run your HTML app

The final stage of this tutorial is to host and run your new app on your local computer.

1. Browse to the location where you saved the compressed project files, expand the files on your computer, and launch one of the following command files from the **server** subfolder.

	+ **launch-windows** (Windows computers) 
	+ **launch-mac.command** (Mac OS X computers)
	+ **launch-linux.sh** (Linux computers)

	<div class="dev-callout"><b>Note</b>
		<p>On a Windows computer, type `R` when PowerShell asks you to confirm that you want to run the script. Your web browser might warn you to not run the script because it was downloaded from the internet. When this happens, you must request that the browser proceed to load the script.</p>
	</div>

	This starts a web server on your local computer to host the new app.

2. Open the URL <a href="http://localhost:8000/" target="_blank">http://localhost:8000/</a> in a web browser to start the app.

3. In the app, type meaningful text, such as _Complete the tutorial_, in **Enter new task**, and then click **Add**.

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

* **[Mobile Services HTML/JavaScript How-to Conceptual Reference]**
  <br/>Learn more about how to use Mobile Services with HTML/JavaScript 

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
[9]: ../Media/mobile-services-set-cors-localhost.png
[10]: ../Media/mobile-quickstart-startup-html.png
[11]: ../Media/mobile-data-tab.png
[12]: ../Media/mobile-data-browse.png
[13]: ../Media/mobile-services-diagram.png

<!-- URLs. -->
[Get started with data]: ./mobile-services-get-started-with-data-html.md
[Get started with authentication]: ./mobile-services-get-started-with-users-html.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Management Portal]: https://manage.windowsazure.com/
[Microsoft Web Platform Installer]:  http://go.microsoft.com/fwlink/p/?LinkId=286333
[latest version of Python]: http://go.microsoft.com/fwlink/p/?LinkId=286342
<<<<<<< HEAD
[Mobile Services HTML/JavaScript How-to Conceptual Reference]: ../HowTo/mobile-services-client-html.md
=======
[Cross-origin resource sharing]: http://msdn.microsoft.com/en-us/library/windowsazure/dn155871.aspx
>>>>>>> 4f8b4618039f467065820267dffa2a2610be4508
