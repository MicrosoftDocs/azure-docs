#Develop and Deploy a Website with Microsoft WebMatrix

This guide describes how to use Microsoft WebMatrix to create and deploy a web site to Windows Azure.  You will use a sample application from a WebMatrix site template.

You will learn:

* How to set up WebMatrix.
* How to create a new Windows Azure web site.
* How to set up WebMatrix and use it to develop a web site.
* How to deploy a web site directly from WebMatrix to Windows Azure.

### Create a Windows Azure account

<div chunk="../../Shared/Chunks/create-azure-account.md" />

### Enable Windows Azure Web Sites

<div chunk="../../Shared/Chunks/antares-iaas-signup.md" />

## Create a Windows Azure web site

1. Login to the [Windows Azure Portal](http://manage.windowsazure.com).
2. Click the **Create New** icon at the bottom left of the Windows Azure portal.
3. Click the **Web Site** icon, click **Quick Create**, enter a value for **URL** under the **create a new web site** section of this page and then click the checkmark next to **create web site**	at the bottom of this page:

	![Create New website][createnewsite]	

	This will initiate the process for creating the new web site on Windows Azure.
4. Once the web site is created, your browser will display the Web Sites page, listing all of the web sites associated with the currently logged on account. Verify that the web site you just created has a **Status** of **Running** and then open the web site's management pages by clicking the name of the web site displayed in the **Name** column. This will open the **Dashboard** page for the new web site.
5. From the **Dashboard** page click the link to **Download publish profile** and save the publish profile file to the desktop of your development computer.

## Install Microsoft WebMatrix

1. Browse to [http://www.microsoft.com/web/webmatrix/][webmatrix] and click **Install WebMatrix**.  
2. After you click **Install WebMatrix** you are directed to a page with a **Install Now** button. Click **Install Now**.

	![Install Web Platform Installer 3.0][installwebplat3]

2. You will see a prompt at the bottom of the web page to either run or save webmatrix.exe. Click **Run**.

	This will display the dialog box for **Web Platform Installer 3.0**, click **Install**:

	![Install WebMatix][installwebmatrix]

	The Web Platform Installer 3.0 will detect any prerequisites required  for WebMatrix and list all dependencies and software to be installed in the **Web Platform Installation** dialog box:

	![Web Platform Installation][webplatinstall]

3. Click **I Accept** to proceed with installation of all WebMatrix prerequisites and WebMatrix. Upon successfull installation you are presented with a dialog box listing the software that was installed. Click **Finish**.

	![Web Platform Installation Finished][webplatdone]

4. After you click **Finish**, WebMatrix will open. 

## Create, deploy and run the WebMatrix "bakery" sample web site on Windows Azure

7. In WebMatrix, click the button immediately to the left of the **Home** tab in the Ribbon, click **New Site**, click **Site from Template**, select the **Bakery** template, enter a value for **Site Name** and then click **OK** to create the web site and display the web site’s Administration page.
8. Click  **Publish** in the Home ribbon to display **Publish Settings** options for the web site.
9. Click  **Import publish settings** under **Common Tasks**, select the publish profile file that you downloaded from Windows Azure and saved to the desktop. Then click **Open** to display the **Publish Settings** dialog box. 
10. Click the **Validate Connection** button to verify connectivity between the WebMatrix computer and the web site you created earlier. If you receive a certificate error indicating that the security certificate presented by this server was issued to a different server, check the box next to **Save this certificate for future sessions of WebMatrix** and click **Accept Certificate**.

	![WebMatrix Certificate Error][webmatrixcerterror]
11. After you click **Accept Certificate** the **Publish Settings** dialog box will be displayed, click **Validate Connection**.
12. Once the connection is validated, click **Save** to save publish settings for the web site you created in WebMatrix.
13. From the **Publish Settings** dialog box click the dropdown for the Publish button and select Publish. Click **Yes** on the Publish Compatibility dialog box to perform publish compatibility testing and then click **Continue** when publish compatibility tests have completed.
14. Click **Continue** in the Publish Preview dialog box to initiate publication of the site on WebMatrix to Windows Azure.
15. Navigate to the web site on Windows Azure to verify it is deployed correctly and is running. The URL for the web site is displayed at the bottom of the WebMatrix IDE when publishing is complete. 

	![Publishing Complete][publishcomplete]

16. Click on the URL for the web site to open the web site in your brower:

	![Bakery Sample Site][bakerysample]

	The URL for the web site can also be found in the Windows Azure portal by clicking **Web Sites** to display all web sites created by the logged on account. The URL for each web site is displayed in the URL column on the web sites page.

[webmatrix]: http://www.microsoft.com/web/webmatrix/

[installwebplat3]: ../../../Shared/Media/howtoWebPI3installer.png
[runorsavewebmatrix]: ../../../Shared/Media/howtorunorsavewebmatrix.png
[installwebmatrix]: ../../../Shared/media/howtoinstallwebmatrix.png
[webplatinstall]: ../../../Shared/media/howtowebplatforminstallation.png
[webplatdone]: ../../../Shared/media/howtofinish.png
[createnewsite]: ../../../Shared/media/howtocreatenewsite.png
[webmatrixcerterror]: ../../../Shared/media/howtocertificateerror.png
[publishcomplete]: ../../../Shared/media/howtopublished.png
[bakerysample]: ../../../Shared/media/howtobakerysamplesite.png