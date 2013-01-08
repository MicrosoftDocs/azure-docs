<properties linkid="develop-php-website-with-mysql-and-webmatrix" urlDisplayName="Web w/ WebMatrix" pageTitle="PHP web site with MySQL and WebMatrix - Windows Azure tutorial" metaKeywords="" metaDescription="A tutorial that demonstrates how to use the free WebMatrix IDE to create and deploy a PHP web site that stores data in MySQL." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />

<div chunk="../chunks/article-left-menu.md" />

#Create and deploy a PHP-MySQL Windows Azure Web Site using WebMatrix

This tutorial shows you how to use WebMatrix to develop and deploy a PHP-MySQL application to a Windows Azure Web Site. WebMatrix is a free web development tool from Microsoft that includes everything you need for web site development. WebMatrix supports PHP and includes intellisense for PHP development.

This tutorial assumes you have [MySQL][install-mysql] installed on your computer so that you can test an application locally. However, you can complete the tutorial without having MySQL installed. Instead, you can deploy your application directly to Windows Azure Web Sites.

Upon completing this guide, you will have a PHP-MySQL web site running in Windows Azure.
 
You will learn:

* How to create a Windows Azure Web Site and a MySQL database using the Preview Management Portal. Because PHP is enabled in Windows Azure Web Sites by default, nothing special is required to run your PHP code.
* How to develop a PHP application using WebMatrix.
* How to publish and re-publish your application to Windows Azure using WebMatrix.
 
By following this tutorial, you will build a simple Tasklist web application in PHP. The application will be hosted in a Windows Azure Web Site. A screenshot of the running application is below:

![Windows Azure PHP Web Site][running-app]

<div chunk="../../Shared/Chunks/create-account-and-websites-note.md" />

##Prerequisites

1. Download the Tasklist application files from here: [http://go.microsoft.com/fwlink/?LinkId=252506][tasklist-mysql-download]. The Tasklist application is a simple PHP application that allows you to add, mark complete, and delete items from a task list. Task list items are stored in a MySQL database. The application consists of these files:

* **index.php**: Displays tasks and provides a form for adding an item to the list.
* **additem.php**: Adds an item to the list.
* **getitems.php**: Gets all items in the database.
* **markitemcomplete.php**: Changes the status of an item to complete.
* **deleteitem.php**: Deletes an item.
* **taskmodel.php**: Contains functions that add, get, update, and delete items from the database.
* **createtable.php**: Creates the MySQL table for the application. This file will only be called once.

2. Create a local MySQL database called `tasklist`. You can do this from the MySQL command prompt with this command:

		mysql> create database tasklist;

	This step is only necessary if you want to test your application locally.

<h2 id="CreateWebsite">Create a Windows Azure Web Site and MySQL database</h2>

1. Login to the [Preview Management Portal][preview-portal].
2. Click the **+ New** icon on the bottom left of the portal.

	![Create New Windows Azure Web Site][new-website]

3. Click **WEB SITE**, then **CREATE WITH DATABASE**.

	![Custom Create a new Web Site][custom-create]

	<div class="dev-callout"> 
	<b>Note</b> 
	<p>In the preview release of Windows Azure Web Sites, you cannot create a MySQL Database for a web site after creating the web site. You must create a web site and a MySQL database as described in the steps below.</p> 
	</div>

4. Enter a value for **URL**, select **Create a New MySQL Database** from the **DATABASE** dropdown,  and select the data center for your web site in the **REGION** dropdown. Click the arrow at the bottom of the dialog.

	![Fill in Web Site details][website-details]

5. Enter a value for the **NAME** of your database, select the data center for your database in the **REGION** dropdown, and check the box that indicates you agree with the legal terms. Click the checkmark at the bottom of the dialog.

	![Create new MySQL database][new-mysql-db]

	When the web site has been created you will see the text **Creation of Web Site ‘[SITENAME]’ completed successfully**.

	Next, you need to get the MySQL connection information.


6. Click the name of the web site displayed in the list of web sites to open the web site’s Quick Start page.

	![Open web site dashboard][go-to-dashboard]

7. Click the **CONFIGURE** tab:

	![Configure tab][configure-tab]

8. Scroll down to the **connection strings** section. The values for `Database`, `Data Source`, `User Id`, and `Password` are (respectively) the database name, server name, user name, and user password. Make note of the database connection information as it will be needed later.

	![Connection string][connection-string]

##Install WebMatrix and develop your application

You can install WebMatrix from the [Preview Management Portal][preview-portal]. 

1. After logging in, navigate to your web site's Quick Start page, and click the WebMatrix icon at the bottom of the page:

	![Install WebMatrix][install-webmatrix]

	Follow the prompts to install WebMatrix.

2. After WebMatrix is installed, it will attempt to open your site as a WebMatrix project. When prompted to download your site, choose **Yes, install from the Template Gallery**.

	![Download web site][download-site]

3. From the available templates, choose **PHP**.

	![Site from template][site-from-template]

4. The **Empty Site** template will be selected by default. Provide a name for the site and click **NEXT**.

	![Provide name for site][site-from-template-2]

	Your site will be opened on WebMatrix with some default files in place.

	In the next few steps you will develop the Tasklist application by adding the files you downloaded earlier and making a few modifications. You could, however, add your own existing files or create new files.

5. With your site open in WebMatrix, click **Files**:

	![WebMatrix - Click files][site-in-webmatrix]

6. Add your application files by clicking **Add Existing**:

	![WebMatrix - Add existing files][add-existing-files]

	In the resulting dialog, navigate to the files you downloaded earlier, select all of them, and click Open. When propted, choose to replace the `index.php` file. 

7. Next, you need to add your local MySQL database connection information to the `taskmodel.php` file. Open the  `taskmodel.php` file by double clicking it, and update the database connection information in the `connect` function. (**Note**: Jump to [Publish Your Application](#Publish) if you do not want to test your application locally and want to instead publish directly to Windows Azure Web Sites.)

		// DB connection info
		$host = "localhost";
		$user = "your user name";
		$pwd = "your password";
		$db = "tasklist";

	Save the `taskmodel.php` file.

8. For the application to run, the `items` table needs to be created. Right click the `createtable.php` file and select **Launch in browser**. This will launch `createtable.php` in your browser and execute code that creates the `items` table in the `tasklist` database.

	![WebMatrix - Launch createtable.php in browser][webmatrix-launchinbrowser]

9. Now you can test the application locally. Right click the `index.php` file and select **Launch in browser**. Test the application by adding items, marking them complete, and deleting them.  


<h2 id="Publish">Publish your application</h2>

Before publishing your application to Windows Azure Web Sites, the database connection information in `taskmodel.php` needs to be updated with the connection information you obtained earlier (in the [Create a Windows Azure Web Site and MySQL Database](#CreateWebsite) section).

1. Open the `taskmodel.php` file by double clicking it, and update the database connection information in the `connect` function.

		// DB connection info
		$host = "value of Data Source";
		$user = "value of User Id";
		$pwd = "value of Password";
		$db = "value of Database";
	
	Save the `taskmodel.php` file.

2. Click **Publish** in WebMatrix, then click **Continue** in the **Publish Preview** dialog.

	![WebMatrix - Publish][publish]

3. Navigate to http://[your web site name].azurewebsites.net/createtable.php to create the `items` table.

4. Lastly, navigate to http://[your web site name].azurewebsites.net/index.php to being using the running application.
	
##Modify and republish your application

You can easily modify and republish your application. Here, you will make a simple change to the heading in in the `index.php` file, and republish the application.

1. Open the `index.php` file by double-clicking it.

2. Change **My ToDo List** to **My Task List** in the **h1** tag and save the file.

3. Click the **Publish** icon, then click **Continue** in the **Publish Preview** dialog.

4. When publishing has completed, navigate to http://[your web site name].azurewebsites.net/index.php to see the published changes.



# Next Steps

You've seen how to create and deploy a web site from WebMatrix to Windows Azure. To learn more about WebMatrix, check out these resources:

* [WebMatrix for Windows Azure](http://go.microsoft.com/fwlink/?LinkID=253622&clcid=0x409)

* [WebMatrix web site](http://www.microsoft.com/click/services/Redirect2.ashx?CR_CC=200106398)





[install-mysql]: http://dev.mysql.com/doc/refman/5.6/en/installing.html
[running-app]: ../Media/tasklist_app_windows.png
[tasklist-mysql-download]: http://go.microsoft.com/fwlink/?LinkId=252506
[install-webmatrix]: ../Media/install-webmatrix.png
[download-publish-profile]: ../../Shared/Media/download_publish_profile.jpg
[webmatrix-templates]: ../../Shared/Media/webmatrix_templates.jpg
[webmatrix-php-template]: ../../Shared/Media/webmatrix_php_template.jpg
[webmatrix-php-emptysite]: ../../Shared/Media/webmatrix_php_emptysite.jpg
[webmatrix-files]: ../../Shared/Media/webmatrix_files.jpg
[webmatrix-delete-indexphp]: ../../Shared/Media/webmatrix_delete_indexphp.jpg
[webmatrix-add-existing]: ../../Shared/Media/webmatrix_add_existing.jpg
[webmatrix-launchinbrowser]: ../Media/launch-in-browser.png
[webmatrix-publish]: ../../Shared/Media/webmatrix_publish.jpg
[webmatrix-import-pub-settings]: ../../Shared/Media/webmatrix_import_pub_settings.jpg
[webmatrix-pubcompat-continue]: ../../Shared/Media/webmatrix_pubcompat_continue.jpg
[webmatirx-pubpreview]: ../../Shared/Media/webmatrix_pubpreview.jpg
[preview-portal]: https://manage.windowsazure.com
[php-site-from-template]: ../../Shared/Media/php_site_from_template.png
[php-empty-site-template-installed]: ../../Shared/Media/php_empty_site_template_installed.png
[new-website]: ../../Shared/Media/new_website.jpg
[custom-create]: ../Media/custom_create.jpg
[website-details]: ../../Shared/Media/website_details.jpg
[new-mysql-db]: ../Media/new_mysql_db.jpg
[go-to-dashboard]: ../Media/go_to_dashboard.png
[download-publish-profile]: ../Media/download-publish-profile.png
[download-site]: ../Media/download-site-1.png
[site-from-template]: ../Media/site-from-template.png
[site-from-template-2]: ../Media/site-from-template-2.png
[site-in-webmatrix]: ../Media/site-in-webmatrix.png
[add-existing-files]: ../Media/add-existing-files.png
[publish]: ../Media/publish.png
[configure-tab]: ../Media/configure-tab.png
[connection-string]: ../Media/connection-string.png