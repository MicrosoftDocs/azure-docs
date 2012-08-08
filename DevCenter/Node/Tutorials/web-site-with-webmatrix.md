<properties linkid="dev-nodejs-website-webmatrix" urldisplayname="Node.js Website with WebMatrix" headerexpose="" pagetitle="Node.js Application using a WebMatrix" metakeywords="Azure Node.js tutorial WebMatrix, Azure Node.js, Azure Node.js tutorial" footerexpose="" metadescription="A tutorial that demonstrates creating and deploying a Node.js application using WebMatrix" umbraconavihide="0" disquscomments="1"></properties>
#Create and deploy a Node.js application to a Windows Azure Web Site using WebMatrix

This tutorial shows you how to use WebMatrix to develop and deploy a Node.js application to a Windows Azure Website. WebMatrix is a free web development tool from Microsoft that includes everything you need for website development. WebMatrix includes several features that make it easy to use Node.js including code completion, pre-built templates, and editor support for Jade, LESS, and CoffeeScript. Learn more about [WebMatrix for Windows Azure](http://go.microsoft.com/fwlink/?LinkID=253622&clcid=0x409).

Upon completing this guide, you will have a node web site running in Windows Azure.
 
You will learn:

* How to create a web site from the Windows Azure Portal.
* How to develop a node application using WebMatrix.
* How to publish and re-publish your application to Windows Azure using WebMatrix.
 
By following this tutorial, you will build a simple node web application. The application will be hosted in a Windows Azure Web Site. A screenshot of the running application is below:

![Windows Azure node Website][webmatrix-node-completed]

<div chunk="../../Shared/Chunks/create-account-and-websites-note.md" />

##Create a Windows Azure Web Site

Follow these steps to create a Windows Azure Web Site.

1. Login to the [Windows Azure Portal].

2. Click the **+ NEW** icon on the bottom left of the portal

    ![The Windows Azure Portal with the +NEW link highlighted.][portal-new-website]

3. Click **WEB SITE**, then **QUICK CREATE**. Enter a value for **URL** and select the datacenter for your web site in the **REGION** dropdown. Click the checkmark at the bottom of the dialog.

    ![The Quick Create dialog][portal-quick-create]

4. Once the web site is created, the portal will display all the web sites associated with your subscription. Verify that the web site you just created has a **Status** of **Running** and then click the web site name to view the **Dashboard** for this web site.

##Import the web site into WebMatrix and apply the Express template

1. From the **Dashboard**, click the WebMatrix icon at the bottom of the page to open the web site in WebMatrix 2.

	![Launch WebMatrix][launch-webmatrix]

2. If WebMatrix 2 is not installed, Web Platform Installer 4.0 will install Microsoft WebMatrix 2 and all necessary prerequisites. WebMatrix will launch and display a dialog indicating **Empty Site Detected**. Click **Yes, install from the Template Gallery** to select a built-in template.

	![empty site detected][empty-site-detected]

3. In the **Site from Template** dialog, select **Node** and then select **Express Site**. Finally, click **Next**. If you are missing any prerequisites for the **Express Site** template, you will be prompted to install them.

	![select express template][webmatrix-templates]

4. After WebMatrix finishes building the web site, the WebMatrix IDE is displayed.

	![webmatrix ide][webmatrix-ide]

##Publish your application to Windows Azure

1. In WebMatrix, click **Publish** from the **Home** ribbon to display the **Publish Preview** dialog box for the web site.

	![publish preview][webmatrix-node-publishpreview]

2. Click **Continue**. When publishing is complete, the URL for the web site on Windows Azure is displayed at the bottom of the WebMatrix IDE

	![publish complete][webmatrix-publish-complete]

3. Click the link to open the web site in your browser.

	![Express website][webmatrix-node-express-site]

##Modify and republish your application

You can easily modify and republish your application. Here, you will make a simple change to the heading in in the **index.jade** file, and republish the application.

1. In WebMatrix, select **Files**, and then expend the **views** folder. Open the **index.jade** file by double-clicking it.

	![webmatrix viewing index.jade][webmatrix-modify-index]

2. Change the second line to the following:

		p Welcome to #{title} with WebMatrix on Windows Azure!

3. Click the save icon, and then click the publish icon.

	![save and publish][webmatrix-publishicon]

3. Click **Continue** in the **Publish Preview** dialog and wait for the update to be published.

	![publish preview][webmatrix-republish]

4. When publishing has completed, use the link returned when the publish process is complete to see the updated site.

	![Windows Azure node Website][webmatrix-node-completed]


# Next Steps

You've seen how to create and deploy a web site from WebMatrix to Windows Azure. To learn more about WebMatrix, check out these resources:

* [WebMatrix for Windows Azure]
* [WebMatrix website]
* [Publishing a Windows Azure Web site using Git]



[Windows Azure Portal]: http://manage.windowsazure.com
[WebMatrix WebSite]: http://www.microsoft.com/click/services/Redirect2.ashx?CR_CC=200106398
[WebMatrix for Windows Azure]: http://go.microsoft.com/fwlink/?LinkID=253622&clcid=0x409

[Publishing a Windows Azure Web site using Git]: /en-us/develop/nodejs/common-tasks/publishing-with-git/
[for free]: /en-us/pricing/free-trial
[webmatrix-node-completed]: ../Media/webmatrix-node-complete.png
[install-webmatrix]: ../../Shared/Media/install_webmatrix_from_site_dashboard.png
[launch-webmatrix]: ../Media/webmatrix-launch-webmatrix.png
[empty-site-detected]: ../Media/webmatrix-download-site.png
[webmatrix-templates]: ../Media/webmatrix-templates.png
[webmatrix-node-express]: ../Media/webmatrix-node-express-template.png
[webmatrix-node-files]: ../Media/webmatrixnodefiles.png
[download-publish-profile]: ../../Shared/Media/download-publishing-profile.png
[webmatrix-run-icon]: ../Media/webmatrix-runicon.png
[webmatrix-publishicon]: ../Media/webmatrix-publishicon.png
[webmatrix-import-settings]: ../Media/webmatrix-publishsettings.png
[webmatrix-node-compatibility]: ../Media/webmatrix-publishcompatibility.png
[webmatrix-node-publishpreview]: ../Media/webmatrix-publishpreview.png
[portal-new-website]: ../../Shared/Media/plus-new.png
[portal-quick-create]: ../../Shared/Media/create-quick-website.png
[howtodownloadsite]: ../../../Shared/media/howtodownloadsite.png
[webmatrix-ide]: ../media/webmatrix-ide.png
[webmatrix-publish-complete]: ../media/webmatrix-publish-complete.png
[webmatrix-node-express-site]: ../media/webmatrix-express-webiste.png
[webmatrix-modify-index]: ../media/webmatrix-node-edit.png
[webmatrix-republish]: ../media/webmatrix-republish.png