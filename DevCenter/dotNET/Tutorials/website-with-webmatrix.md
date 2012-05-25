#Develop and Deploy a Website with Microsoft WebMatrix

This topic describes how to use Microsoft WebMatrix on a development computer to create and deploy a website to Windows Azure.

###<a name="howtocreateanddeployfromwebmatrix"></a>How to: Create and Deploy a Website from Microsoft WebMatrix to Windows Azure

**Note**<br>
Microsoft WebMatrix must be installed on the development computer to complete the steps in this topic. Complete the steps in the following section to install Microsoft WebMatrix on your development computer.

<h4 id="installwebmatrix">Install Microsoft WebMatrix on your Development Computer</h4>

1. Browse to [http://www.microsoft.com/web/webmatrix/][webmatrix] and click **Install WebMatrix**.  After you click **Install WebMatrix** you are directed to a page with a **Install Now** button, click **Install Now**.

	![Install Web Platform Installer 3.0][installwebplat3]

2. After you click **Install Now**,  you will see a prompt at the bottom of the web page to either run or save webmatrix.exe, click **Run**:

	![Run or Save webmatrix.exe][runorsavewebmatrix]

	This will display the dialog box for **Web Platform Installer 3.0**, click **Install**:

	![Install WebMatix][installwebmatrix]

	The Web Platform Installer 3.0 will detect any prerequisites required  for WebMatrix and list all dependencies and software to be installed in the **Web Platform Installation** dialog box:

	![Web Platform Installation][webplatinstall]

3. Click **I Accept** to proceed with installation of all WebMatrix prerequisites and WebMatrix. Upon successfull installation you are presented with a dialog box listing the software that was installed. Click **Finish**.

	![Web Platform Installation Finished][webplatdone]

4. After you click **Finish**, WebMatrix will open. 

####Create, deploy and run the WebMatrix "bakery" sample website on Windows Azure####

Follow these steps to create, deploy and run the  WebMatrix "bakery" sample website on Windows Azure:

1. Login to the Windows Azure Portal.
2. Click the **Create New** icon at the bottom left of the Windows Azure portal.
3. Click the **Web Site** icon, click **Quick Create**, enter a value for **URL** under the **create a new web site** section of this page and then click the checkmark next to **create web site**	at the bottom of this page:

	![Create New website][createnewsite]	

	This will initiate the process for creating the new website on Windows Azure.
4. Once the website is created your browser will display the websites page, listing all of the websites associated with the currently logged on account. Verify that the website you just created has a **Status** of **Running** and then open the website's management pages by clicking the name of the website displayed in the **Name** column. This will open the **Dashboard** page for the new website.
5. From the **Dashboard** page click the link to **Download publish profile** and save the publish profile file to the desktop of your development computer.
6. Open Microsoft WebMatrix. Click **Start, All Programs, Microsoft WebMatrix and then Microsoft WebMatrix**.
7. Click the button immediately to the left of the **Home** tab in the Ribbon, click **New Site**, click **Site from Template**, select the **Bakery** template, enter a value for **Site Name** and then click **OK** to create the website and display the website’s Administration page.
8. Click  **Publish** in the Home ribbon to display **Publish Settings** options for the website.
9. Click  **Import publish settings** under **Common Tasks**, select the publish profile file that you downloaded from Windows Azure and saved to the desktop. Then click **Open** to display the **Publish Settings** dialog box. 
10. Click the **Validate Connection** button to verify connectivity between the WebMatrix computer and the website you created earlier. If you receive a certificate error indicating that the security certificate presented by this server was issued to a different server, check the box next to **Save this certificate for future sessions of WebMatrix** and click **Accept Certificate**.

	![WebMatrix Certificate Error][webmatrixcerterror]
11. After you click **Accept Certificate** the **Publish Settings** dialog box will be displayed, click **Validate Connection**.
12. Once the connection is validated, click **Save** to save publish settings for the website you created in WebMatrix.
13. From the **Publish Settings** dialog box click the dropdown for the Publish button and select Publish. Click **Yes** on the Publish Compatibility dialog box to perform publish compatibility testing and then click **Continue** when publish compatibility tests have completed.
14. Click **Continue** in the Publish Preview dialog box to initiate publication of the site on WebMatrix to Windows Azure.
15. Navigate to the website on Windows Azure to verify it is deployed correctly and is running. The URL for the website is displayed at the bottom of the WebMatrix IDE when publishing is complete. 

	![Publishing Complete][publishcomplete]

16. Click on the URL for the website to open the website in your brower:

	![Bakery Sample Site][bakerysample]

The URL for the website can also be found in the Windows Azure portal by clicking **Web Sites** to display all websites created by the logged on account. The URL for each website is displayed in the URL column on the web sites page.

If you need to delete the web site to avoid usage charges use the **Delete** icon as described in [Delete a Website in Windows Azure](#deleteawebsite).


[installwebplat3]: ..\Media\howtoWebPI3installer.png
[runorsavewebmatrix]: ..\Media\howtorunorsavewebmatrix.png
[installwebmatrix]: ..\Media\howtoinstallwebmatrix.png
[webplatinstall]: ..\Media\howtowebplatforminstallation.png
[webplatdone]: ..\Media\howtofinish.png
[createnewsite]: ..\Media\howtocreatenewsite.png
[webmatrixcerterror]: ..\Media\howtocertificateerror.png
[publishcomplete]: ..\Media\howtopublished.png
[bakerysample]: ..\Media\howtobakerysamplesite.png