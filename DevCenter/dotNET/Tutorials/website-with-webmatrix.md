#Develop and deploy a web site with Microsoft WebMatrix

This guide describes how to use Microsoft WebMatrix to create and deploy a web site to Windows Azure.  You will use a sample application from a WebMatrix site template.

You will learn:

* How to create a web site from the Windows Azure portal.
* How to import the web site into WebMatrix and customize the web site to use one of the WebMatrix templates.
* How to deploy the customized web site directly from WebMatrix to Windows Azure.

### Create a Windows Azure account

<div chunk="../../Shared/Chunks/create-azure-account.md" />

### Enable Windows Azure Web Sites

<div chunk="../../Shared/Chunks/antares-iaas-signup.md" />

## Create a web site from the Windows Azure portal

1. Login to the [Windows Azure Portal](http://manage.windowsazure.com).
2. Click **New** at the bottom left of the Windows Azure portal.
3. Click  **Web Site**, click **Quick Create**, enter a value for **URL** (e.g. *bakerysample*), select the **Region** that is closest to your intended users (this will ensure best performance) and then click the **Create Web Site** checkmark at the bottom of the page to initiate creation of the web site:

	![Create New website][createnewsite]	

4. Once the web site is created, the portal will display all of the web sites associated with your subscription. Verify that the web site you just created has a **Status** of **Running** and then open the web site's management pages by clicking the name of the web site displayed in the **Name** column to open the web site's **Dashboard** management page.

## Import the web site into WebMatrix and customize the web site using a template

1. From the **Dashboard** page click the WebMatrix icon at the bottom of the page to open the web site in WebMatrix 2.

	![Open web site in WebMatrix 2][opensiteinwebmatrix2]

2. If WebMatrix 2 is not installed, the Web Platform Installer 4.0 will install Microsoft WebMatrix 2 and all necessary prerequisite software and display a dialog box indicating **Empty Site Detected**. Click the option to use a built-in website template:

	![Empty Site Detected][howtodownloadsite]

3. After you click the option to use a built-in website template, select **Bakery** from the list of templates, enter **bakerysample** for the **Site Name**, and click **Next**.

	![Create Site from Template][howtositefromtemplate]

	After WebMatrix finishes building the web site, the WebMatrix IDE is displayed:

	![Web Matrix 2 IDE][howtowebmatrixide] 

## Deploy the customized web site from WebMatrix to Windows Azure

1. In WebMatrix, click  **Publish** from the **Home** ribbon to display the **Publish Preview** dialog box for the web site.

	![WebMatrix Publish Preview][howtopublishpreview]

2. Click to select the checkbox next to bakery.sdf and then click **Continue**.  When publishing is completed the URL for the updated web site on Windows Azure is displayed at the bottom of the WebMatrix IDE.  

	![Publishing Complete][publishcomplete]

4. Click on the link to open the web site in your browser:

	![Bakery Sample Site][bakerysample]

	The URL for the web site can also be found in the Windows Azure portal by clicking **Web Sites** to display all web sites for your subscription. The URL for each web site is displayed in the URL column on the web sites page.



# Next Steps

You've seen how to create and deploy a web site from WebMatrix to Windows Azure. To learn more about WebMatrix, check out these resources:

* [WebMatrix for Windows Azure](http://go.microsoft.com/fwlink/?LinkID=253622&clcid=0x409)

* [WebMatrix website](http://www.microsoft.com/click/services/Redirect2.ashx?CR_CC=200106398)





[createnewsite]: ../../../Shared/media/howtocreatenewsite.png
[opensiteinwebmatrix2]: ../../../Shared/media/howtoopensiteinWebMatrix2a.png
[howtodownloadsite]: ../../../Shared/media/howtodownloadsite.png
[howtositefromtemplate]: ../../../Shared/media/howtositefromtemplate.png
[howtowebmatrixide]: ../../../Shared/media/howtowebmatrixide.png
[howtopublishpreview]: ../../../Shared/media/howtopublishpreview.png
[bakerysampleopeninwebmatrix2]: ../../../Shared/media/howtowebmatrix2ide.png
[publishcomplete]: ../../../Shared/media/howtopublished2.png
[bakerysample]: ../../../Shared/media/howtobakerysamplesite.png
[webmatrix]: http://www.microsoft.com/web/webmatrix/
