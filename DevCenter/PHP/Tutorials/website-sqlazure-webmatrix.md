<properties linkid="develop-php-website-with-sql-database-and-webmatrix" urlDisplayName="Web w/ SQL + WebMatrix" pageTitle="PHP web site with SQL Database and WebMatrix - Windows Azure" metaKeywords="" metaDescription="A tutorial that demonstrates how to use the free WebMatrix IDE to create and deploy a PHP web site that stores data in SQL Database." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu.md" />

#Create and Deploy a PHP Web Site and SQL Database using WebMatrix

This tutorial shows you how to use WebMatrix to develop and deploy a PHP application that uses a Windows Azure SQL Database to a Windows Azure web site. WebMatrix is a free web development tool from Microsoft that includes everything you need for web site development. WebMatrix supports PHP and includes intellisense for PHP development. 

This tutorial assumes you have [SQL Server Express][install-SQLExpress] installed on your computer so that you can test an application locally. However, you can complete the tutorial without having SQL Server Express installed. Instead, you can deploy your application directly to Windows Azure web sites.

Upon completing this guide, you will have a PHP-SQL Database web site running in Windows Azure.
 
You will learn:

* How to create a Windows Azure Web Site and a SQL Database using the Management Portal. Because PHP is enabled in Windows Azure Web Sites by default, nothing special is required to run your PHP code.
* How to develop a PHP application using WebMatrix.
* How to publish and re-publish your application to Windows Azure using WebMatrix.
 
By following this tutorial, you will build a simple Tasklist web application in PHP. The application will be hosted in a Windows Azure web site. A screenshot of the running application is below:

![Windows Azure PHP Web Site][running-app]

<div chunk="../../Shared/Chunks/create-account-and-websites-note.md" />

##Prerequisites

1. [Download][tasklist-sqlazure-download] the Tasklist application files. The Tasklist application is a simple PHP application that allows you to add, mark complete, and delete items from a task list. Task list items are stored in a SQL Database (SQL Server Express for local testing). The application consists of these files:

* **index.php**: Displays tasks and provides a form for adding an item to the list.
* **additem.php**: Adds an item to the list.
* **getitems.php**: Gets all items in the database.
* **markitemcomplete.php**: Changes the status of an item to complete.
* **deleteitem.php**: Deletes an item.
* **taskmodel.php**: Contains functions that add, get, update, and delete items from the database.
* **createtable.php**: Creates the SQL Database table for the application. This file will only be called once.

2. Create a SQL Server database called `tasklist`. You can do this from the `sqlcmd` command prompt with these commands:

		>sqlcmd -S <server name>\sqlexpress -U <user name> -P <password>
		1> create database tasklist
		2> GO

	This step is only necessary if you want to test your application locally.

## Create a web site and SQL Database

1. Login to the [Management Portal][preview-portal].
2. Click the **+ New** icon on the bottom left of the portal.

	![Create New Windows Azure Web Site][NewWebSite1]

3. Click **WEB SITE**, then **CUSTOM CREATE**.

	![Custom Create a new Web Site][NewWebSite2]

	Enter a value for **URL**, select **Create a New SQL Database** from the **DATABASE** dropdown,  and select the data center for your web site in the **REGION** dropdown. Click the arrow at the bottom of the dialog.

	![Fill in web site details][NewWebSite3_SQL]

4. Enter a value for the **NAME** of your database and select **NEW SQL Database server**. Enter a server login name and password (and confirm the password).Choose the region in which your new SQL Database server will be created.

	![Fill in SQL Database settings][NewWebSite4_SQL]

	When the web site has been created you will see the text **Creating Web Site ‘[SITENAME]’ succeeded**. Next, you will get the database connection information.

5. Click **LINKED RESOURCES**, then the database's name.

	![Linked Resources][NewWebSite6_SQL]

6. Click **View connection strings**.

	![Connection string][NewWebSite7]
	
From the **PHP** section of the resulting dialog, make note of the values for `UID`, `PWD`, `Database`, and `$serverName`. You will use this information later.

##Install WebMatrix

You can install WebMatrix from the [Management Portal][preview-portal]. 

1. After logging in, navigate to your web site's Quick Start page, and click the WebMatrix icon at the bottom of the page:

	![Install WebMatrix][InstallWebMatrix]

	Follow the prompts to install WebMatrix.

2. After WebMatrix is installed, it will attempt to open your site as a WebMatrix project. You can choose to edit your live site directly or download a local copy. For this tutorial, select 'Edit local copy'. 

3. When prompted to download your site, choose **Yes, install from the Template Gallery**.

	![Download web site][download-site]

4. From the available templates, choose **PHP**.

	![Site from template][site-from-template]

5. Select the **Empty Site** template. Provide a name for the site and click **NEXT**.

	![Provide name for site][site-from-template-2]

Your site will be opened on WebMatrix with some default files in place.

##Develop your application

In the next few steps you will develop the Tasklist application by adding the files you downloaded earlier and making a few modifications. You could, however, add your own existing files or create new files.

1. With your site open in WebMatrix, add your application files by clicking **Add Existing**:

	![WebMatrix - Add existing files][edit_addexisting]

	In the resulting dialog, navigate to the files you downloaded earlier, select all of them, and click Open. When prompted, choose to replace the `index.php` file. 

2. Next, you need to add your local SQL Server database connection information to the `taskmodel.php` file. Open the  `taskmodel.php` file by double clicking it, and update the database connection information in the `connect` function. (**Note**: Jump to [Publish Your Application](#Publish) if you do not want to test your application locally and want to instead publish directly to Windows Azure Web Sites.)

		// DB connection info
		$host = "localhost\sqlexpress";
		$user = "your user name";
		$pwd = "your password";
		$db = "tasklist";

	Save the `taskmodel.php` file.

3. For the application to run, the `items` table needs to be created. Right click the `createtable.php` file and select **Launch in browser**. This will launch `createtable.php` in your browser and execute code that creates the `items` table in the `tasklist` database.

	![WebMatrix - Launch createtable.php in browser][edit_run]

4. Now you can test the application locally. Right click the `index.php` file and select **Launch in browser**. Test the application by adding items, marking them complete, and deleting them.   


<h2><a id="Publish"></a>Publish your application</h2>

Before publishing your application to Windows Azure Web Sites, the database connection information in `taskmodel.php` needs to be updated with the connection information you obtained earlier (in the [Create a Windows Azure Web Site and SQL Database](#CreateWebsite) section).

1. Open the `taskmodel.php` file by double clicking it, and update the database connection information in the `connect` function.

		// DB connection info
		$host = "value of $serverName";
		$user = "value of UID";
		$pwd = "the SQL password you created when creating the web site";
		$db = "value of Database";
	
	Save the `taskmodel.php` file.

2. Click **Publish** in WebMatrix, then click **Continue** in the **Publish Preview** dialog.

	![WebMatrix - Publish][edit_publish]

3. Navigate to http://[your web site name].azurewebsites.net/createtable.php to create the `items` table.

4. Lastly, navigate to http://[your web site name].azurewebsites.net/index.php to launch the application.
	
##Modify and republish your application

You can easily modify your application by editing the local copy of the site you downloaded earlier and republish or you can make the edit directly in the Remote mode. Here, you will make a simple change to the heading in in the `index.php` file and save it directly to the live site.

1. Click on the Remote tab of your site in WebMatrix and select **Open Remote View**. This will open your remote site for editing directly.
	 ![WebMatrix - Open Remote View][OpenRemoteView]
 
2. Open the `index.php` file by double-clicking it.
	![WebMatrix - Open index file][Remote_editIndex]

3. Change **My ToDo List** to **My Task List** in the **title** and **h1** tags and save the file.


4. When saving has completed, click the Run button to see the changes on the live site.
	![WebMatrix - Launch site in Remote][Remote_run]



## Next Steps

You've seen how to create and deploy a web site from WebMatrix to Windows Azure. To learn more about WebMatrix, check out these resources:

* [WebMatrix for Windows Azure](http://go.microsoft.com/fwlink/?LinkID=253622&clcid=0x409)

* [WebMatrix web site](http://www.microsoft.com/click/services/Redirect2.ashx?CR_CC=200106398)





[install-SQLExpress]: http://www.microsoft.com/en-us/download/details.aspx?id=29062
[running-app]: ../Media/tasklist_app_windows.png
[tasklist-sqlazure-download]: http://go.microsoft.com/fwlink/?LinkId=252504
[NewWebSite1]: ../Media/NewWebSite1.jpg
[NewWebSite2]: ../Media/NewWebSite2.png
[NewWebSite3_SQL]: ../Media/NewWebSite3_SQL.png
[NewWebSite4_SQL]: ../Media/NewWebSite4_SQL.png
[NewWebSite5]: ../Media/NewWebSite5.png
[NewWebSite6_SQL]: ../Media/NewWebSite6_SQL.png
[NewWebSite7]: ../Media/NewWebSite7.png
[ConnectionString]: ../Media/ConnectionString.png
[InstallWebMatrix]: ../Media/InstallWebMatrix.png
[download-site]: ../Media/download-site-1.png
[site-from-template]: ../Media/site-from-template.png
[site-from-template-2]: ../Media/site-from-template-2.png
[edit_addexisting]: ../Media/edit_addexisting.png
[edit_run]: ../Media/edit_run.png
[edit_publish]: ../Media/edit_publish.png
[OpenRemoteView]: ../Media/OpenRemoteView.png
[Remote_editIndex]: ../Media/Remote_editIndex.png
[Remote_run]: ../Media/Remote_run.png
[install-webmatrix]: ../Media/install-webmatrix.png
[download-publish-profile]: ../../Shared/Media/download_publish_profile.jpg
[new-website]: ../../Shared/Media/new_website.jpg
[custom-create]: ../../Shared/Media/custom_create.jpg
[website-details-sqlazure]: ../Media/website_details_sqlazure.jpg
[database-settings]: ../Media/database_settings.jpg
[create-server]: ../Media/create_server.jpg
[linked-resources]: ../Media/linked_resources.jpg
[connection-string]: ../Media/connection_string.jpg
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
[sql-database-editions]: http://msdn.microsoft.com/en-us/library/windowsazure/ee621788.aspx
[php-site-from-template]: ../../Shared/Media/php_site_from_template.png
[php-empty-site-template-installed]: ../../Shared/Media/php_empty_site_template_installed.png
[go-to-dashboard]: ../Media/go_to_dashboard.png
[download-publish-profile]: ../Media/download-publish-profile.png
[site-in-webmatrix]: ../Media/site-in-webmatrix.png
[add-existing-files]: ../Media/add-existing-files.png
[publish]: ../Media/publish.png