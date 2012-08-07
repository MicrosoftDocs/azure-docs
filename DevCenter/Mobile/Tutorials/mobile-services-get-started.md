<properties linkid="mobile-get-started" urldisplayname="Mobile Services" headerexpose="" pagetitle="Get started with Mobile Services in Windows Azure" metakeywords="Get started Windows Azure Mobile Services, mobile devices, Windows Azure, mobile, Windows 8, WinRT app" footerexpose="" metadescription="Get started using Windows Azure Mobile Services in your Windows Store apps." umbraconavihide="0" disquscomments="1"></properties>

# <a name="getting-started"> </a>Get started with Mobile Services
This topic shows you how to create a mobile service for your Windows 8 app using Mobile Services in Windows Azure. Completing this guide is a prerequisite for all other Mobile Services tutorials. This tutorial creates a new mobile service by using default settings.

<div class="dev-callout"> 
	<b>Note</b> 
	<p>update this note Mobile Services is available only in preview. To use this feature and other new Windows Azure capabilities, sign up for the <a href="http://manage.windowsazure.com/?WT.mc_id=IXT001_prelimtext2012preview_MSDNLibrary">free preview</a>.</p> 
	</div>

1.	Log into the [Preview Management Portal][Management Portal preview]. 
2.	At the bottom of the navigation pane, click **+NEW**.

	![][0]

3.	Click **Compute**, **Mobile Service**, and then **Create**.

	![][1]
	
	This displays the **Create a mobile service** page of the **New mobile service** wizard.

4.	In **URL**, type a subdomain name to use in the URL for the mobile service, wait for the name verfication, and then click the right arrow button to go to the next page. 
	
	![][2]

    This displays the **Specify database settings** page.
    
    <div class="dev-callout"> 
	<b>Note</b> 
	<p>When the name that you specify is available, a green check icon is displayed; otherwise, a warning is displayed and you are asked to choose a different name.</p> 
	</div>
	
5.	In **Login name**, type the name that is the login for the new SQL Database server, type and confirm the password for the login, and then click the check button to complete the process.

	![][3]

    You have now created a new mobile service, along with a new SQL Database instance, that can be used by your mobile apps.

    <div class="dev-callout"> 
	<b>Note</b> 
	<p>When the password that you supply does not meet the minimum requirements or when there is a mismatch, a warning is displayed. <br/>Make a note of the the login name and password that you specify.</p> 
	</div>

### <a name="next-steps"> </a>Next Steps
Once you have created the mobile service, there are two ways that you can get stared using the service in a Windows Store app: 
    
* Create a storage table in the new mobile service, and then add Mobile Services support to an existing project in Visual Studio Express 2012 for Windows 8. For more information, see [Get started with data].
* Complete the quickstart in the Management Portal and download the pre-generated ToDo starter Visual Studio Express project. For more information, see 

<!-- Anchors. -->
[Getting started with Mobile Services]:#getting-started
[Define the mobile service instance]:#define-mobile-service-instance
[Next Steps]:#next-steps

<!-- Images. -->
[0]: ../../Shared/Media/plus-new.PNG
[1]: ../Media/mobile-create.png
[2]: ../Media/mobile-create-page1.png
[3]: ../Media/mobile-create-page2.png
[4]: ../Media/mobile-create-page3.png

<!-- URLs. -->
[Get started with data]: ./mobile-services-get-started-with-data-dotnet/
[JavaScript and HTML]: mobile-services-win8-javascript/
[WindowsAzure.com]: http://www.windowsazure.com/
[Management Portal preview]: https://manage.windowsazure.com/