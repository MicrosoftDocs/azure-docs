<properties linkid="dev-nodejs-website-webmatrix" urldisplayname="Node.js Website with WebMatrix" headerexpose="" pagetitle="Node.js Application using a WebMatrix" metakeywords="Azure Node.js tutorial WebMatrix, Azure Node.js, Azure Node.js tutorial" footerexpose="" metadescription="A tutorial that demonstrates creating and deploying a Node.js application using WebMatrix" umbraconavihide="0" disquscomments="1"></properties>
#Create and deploy a Node.js Windows Azure Website using WebMatrix

This tutorial shows you how to use WebMatrix to develop and deploy a node application to a Windows Azure Web Site. WebMatrix is a free web development tool from Microsoft that includes everything you need for web site development. WebMatrix supports node and includes code completion for node development.

Upon completing this guide, you will have a node web site running in Windows Azure.
 
You will learn:

* How to develop a node application using WebMatrix.
* How to publish and re-publish your application to Windows Azure using WebMatrix.
 
By following this tutorial, you will build a simple node web application. The application will be hosted in a Windows Azure Web Site. A screenshot of the running application is below:

![Windows Azure node Website][webmatrix-node-completed]

##Set up your development environment
The steps in this section will walk you through enabling the new Windows Azure Web Site feature, creating a blank web site, and installing WebMatrix 2.

###Enable the Windows Azure Web Site feature

If you do not already have a Windows Azure subscription, you can sign up [for free]. After signing up, follow these steps to enable the Windows Azure Web Site feature.

<div chunk="../../Shared/Chunks/antares-iaas-signup.md"></div>

###Create a Windows Azure Web Site

<div chunk="../../Shared/Chunks/create-website.md" />

###Install WebMatrix

You can install WebMatrix from the [Windows Azure Portal]. From your web site's dashboard, click **QUICKSTART** near the top of the page, then click **Install WebMatrix**.

![Install WebMatrix][install-webmatrix]

Run the downloaded .exe file. This will install the Microsoft Web Platform Installer, launch it, and select WebMatrix for installation. Follow the prompts to complete the installation.

##Develop Your Application

In the next few steps you will develop the application by selecting and modifying a template. You could, however, add your own existing files or create new files.

1. Launch WebMatrix by clicking the Windows **Start** button, then click **All Programs>Microsoft Web Matrix>Microsoft WebMatrix**:

	![Launch Webmatrix][launch-webmatrix]

2. Create a new project by clicking **Templates**, then **Node** (in the left pane), and then **Express Site**. Finally, click **Next**.

	![templates][webmatrix-templates]

	![express site][webmatrix-node-express]

3. In the lower left corner, click **Files**, then expand the **views** folder.

	![files navigation][webmatrix-node-files]

4. In the **views** folder, double-click **index.jade**. When the file opens, change line two to the following:

		p Welcome to {#title} with WebMatrix!

7. Now you can test the application locally. In the ribbon, click **Run**. 

	![run icon][webmatrix-run-icon]

	The browser should open and display 'Welcome to Express created with WebMatrix'.


##Publish Your Application

1. Return to the [Windows Azure Portal] and navigate to your web site's **Dashboard**. Click the **Download publish profile** link at the bottom right corner of the page:

	![Download publish profile][download-publish-profile]

	Make note of where you save this file.

3. In WebMatrix, click the **Publish** icon on the ribbon.

	![publish icon][webmatrix-publishicon]

4. In the dialog box that opens, click **Import publish settings**.

	![import publish settings][webmatrix-import-settings]

	Navigate to the `.publishsettings` file that you saved in the previous step, import it, and click **Save**. You will be asked to allow WebMatrix to upload files to your site for compatibility testing. Choose to allow WebMatrix to do this.

5. Click **Continue** on the **Publish Compatibility** dialog.

	![publish compatibility][webmatrix-node-compatibility]

6. Click **Continue** on the **Publish Preview** dialog.

	![publish preview][webmatrix-node-publishpreview]

	When the publishing is complete, you will see **Publishing - Complete** at the bottom of the WebMatirx screen.

7. Navigate to http://[your web site name].windows.net/ view begin using your web site.
	
##Modify and Republish Your Application

You can easily modify and republish your application. Here, you will make a simple change to the heading in in the **index.jade** file, and republish the application.

1. Open the **index.jade** file by double-clicking it.

2. Change the second line to the following:

		p Welcome to #{title} with WebMatrix on Windows Azure!

3. Click the **Publish** icon, and then click **Continue** in the **Publish Preview** dialog.

4. When publishing has completed, navigate to http://[your web site name].windows.net/ to see the published changes.

##Additional resources

[Publishing a Windows Azure Web site using Git]

[Windows Azure Portal]: http://manage.windowsazure.com
[Publishing a Windows Azure Web site using Git]: /en-us/develop/nodejs/common-tasks/publishing-with-git/
[for free]: /en-us/pricing/free-trial
[webmatrix-node-completed]: ../Media/webmatrix-node-complete.png
[install-webmatrix]: ../../Shared/Media/install_webmatrix_from_site_dashboard.jpg
[launch-webmatrix]: ../../Shared/Media/launch_webmatrix.jpg
[download-publish-profile]: ../Media/download_publish_profile.jpg
[webmatrix-templates]: ../Media/webmatrix-templates.png
[webmatrix-node-express]: ../Media/webmatrix-node-express-template.png
[webmatrix-node-files]: ../Media/webmatrixnodefiles.png
[download-publish-profile]: ../../Shared/Media/download_publish_profile.jpg
[webmatrix-run-icon]: ../Media/webmatrix-runicon.png
[webmatrix-publishicon]: ../Media/webmatrix-publishicon.png
[webmatrix-import-settings]: ../Media/webmatrix-publishsettings.png
[webmatrix-node-compatibility]: ../Media/webmatrix-publishcompatibility.png
[webmatrix-node-publishpreview]: ../Media/webmatrix-publishpreview.png