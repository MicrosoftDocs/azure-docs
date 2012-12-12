<properties linkid="web-site-with-webmatrix" urlDisplayName="Web site with WebMatrix" pageTitle="Node.js web site with WebMatrix - Windows Azure tutorial" metaKeywords="" metaDescription="A tutorial that teaches you how to WebMatrix to develop and deploy a Node.js application to a Windows Azure web site." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />


<div chunk="../chunks/article-left-menu.md" />

# Build and deploy a Node.js web site to Windows Azure using WebMatrix

This tutorial shows you how to use WebMatrix to develop and deploy a Node.js application to a Windows Azure Website. WebMatrix is a free web development tool from Microsoft that includes everything you need for website development. WebMatrix includes several features that make it easy to use Node.js including code completion, pre-built templates, and editor support for Jade, LESS, and CoffeeScript. Learn more about [WebMatrix for Windows Azure](http://go.microsoft.com/fwlink/?LinkID=253622&clcid=0x409).

Upon completing this guide, you will have a Node.js web site running in Windows Azure.
 
A screenshot of the completed application is below:

![Windows Azure node Website][webmatrix-node-completed]

<div chunk="../../Shared/Chunks/create-account-and-websites-note.md" />

##Create a Windows Azure Web Site

Follow these steps to create a Windows Azure Web Site.

<div class="dev-callout"><strong>Note</strong>
<p>To complete this tutorial, you need a Windows Azure account that has the Windows Azure Web Sites feature enabled.</p>
<ul>
<li>If you don't have an account, you can create a free trial account  in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A7171371E" target="_blank">Windows Azure Free Trial</a>.</li>
<li>If you have an existing account but need to enable the Windows Azure Web Sites preview, see <a href="../create-a-windows-azure-account/#enable" target="_blank">Enable Windows Azure preview features</a>.</li>
</ul>
</div>
<br />

1. Login to the [Windows Azure Management Portal].

2. Click the **+ NEW** icon on the bottom left of the portal

    ![The Windows Azure Portal with the +NEW link highlighted.][portal-new-website]

3. Click **WEB SITE**, then **QUICK CREATE**. Enter a value for **URL** and select the datacenter for your web site in the **REGION** dropdown. Click the checkmark at the bottom of the dialog.

    ![The Quick Create dialog][portal-quick-create]

4. Once the web site status changes to **Running**, click on the name of the web site to access the **Dashboard**

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

3. Save your changes, and then click the publish icon. Finally, click **Continue** in the **Publish Preview** dialog and wait for the update to be published.

	![publish preview][webmatrix-republish]

4. When publishing has completed, use the link returned when the publish process is complete to see the updated site.

	![Windows Azure node Website][webmatrix-node-completed]




[Windows Azure Management Portal]: http://manage.windowsazure.com
[WebMatrix WebSite]: http://www.microsoft.com/click/services/Redirect2.ashx?CR_CC=200106398
[WebMatrix for Windows Azure]: http://go.microsoft.com/fwlink/?LinkID=253622&clcid=0x409

[Publishing a Windows Azure Web site using Git]: /en-us/develop/nodejs/common-tasks/publishing-with-git/
[for free]: /en-us/pricing/free-trial
[webmatrix-node-completed]: ../Media/webmatrix-node-complete.png
[install-webmatrix]: ../Media/install_webmatrix_from_site_dashboard.png
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