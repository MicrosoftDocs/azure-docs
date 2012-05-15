<properties umbracoNaviHide="0" pageTitle="PHP-MySQL Windows Azure Website using WebMatrix" metaKeywords="Windows Azure deployment, Azure deployment, Windows Azure Websites, Windows Azure SQL Database, SQL Database, PHP, WebMatrix" metaDescription="Learn how to create and deploy a PHP website and a SQL Database to Windows Azure using WebMatrix." linkid="dev-php-tutorials-sql-database-website-webmatrix" urlDisplayName="Create and Deploy a PHP Website and SQL Database Using WebMatrix" headerExpose="" footerExpose="" disqusComments="1" />

#Create and Deploy a PHP Website and SQL Database Using WebMatrix

This tutorial shows you how to use WebMatrix to develop and deploy a PHP application that uses a Windows Azure SQL Database to a Windows Azure Website. WebMatrix is a free web development tool from Microsoft that includes everything you need for website development. WebMatrix supports PHP and includes intellisense for PHP development. 

This tutorial assumes you have [SQL Server Express][install-SQLExpress] installed on your computer so that you can test an application locally. However, you can complete the tutorial without having SQL Server Express installed. Instead, you can deploy your application directly to Windows Azure Websites.

Upon completing this guide, you will have a PHP-SQL Database website running in Windows Azure.
 
You will learn:

* How to create a Windows Azure Website and a SQL Database using the Preview Management Portal. Because PHP is enabled in Windows Azure Websites by default, nothing special is required to run your PHP code.
* How to develop a PHP application using WebMatrix.
* How to publish and re-publish your application to Windows Azure using WebMatrix.
 
By following this tutorial, you will build a simple Tasklist web application in PHP. The application will be hosted in a Windows Azure Website. A screenshot of the running application is below:

![Windows Azure PHP Website][running-app]

##Prerequisites

1. Download the Tasklist application files from here: [http://go.microsoft.com/fwlink/?LinkId=252504][tasklist-sqlazure-download]. The Tasklist application is a simple PHP application that allows you to add, mark complete, and delete items from a task list. Task list items are stored in a SQL Database (SQL Server Express for local testing). The application consists of these files:

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

<h2 id="CreateWebsite">Create a Windows Azure Website and SQL Database</h2>
Follow these steps to create a Windows Azure Website and a SQL Database:

1. Login to the [Preview Management Portal][preview-portal].
2. Click the **+ New** icon on the bottom left of the portal.

	![Create New Windows Azure Website][new-website]

3. Click **Web Site**, then **Custom Create**. Enter a value for **URL**, select **Create a New SQL Azure Database** from the **DATABASE** dropdown,  and select the data center for your website in the **REGION** dropdown. Click the arrow at the bottom of the dialog.

	![Custom Create a new Website][custom-create]

	![Fill in Website details][website-details-sqlazure]

4. Enter a value for the **NAME** of your database, select the **EDITION** (WEB or BUSINESS), select the **MAX SIZE** for your database, choose the **COLLATION**, and select **NEW SQL Database server**. Click the arrow at the bottom of the dialog.

	![Fill in SQL Database settings][database-settings]

5. Enter an administrator name and password (and confirm the password), choose the region in which your new SQL Database server will be created, and check the `Allow Windows Azure Services to access this server` box.

	![Create new SQL Database server][create-server]

	When the website has been created you will see the text **Creation of Web Site ‘[SITENAME]’ completed successfully**. Next, you will get the database connection information.

1. Click the the website's name, then click **LINKED RESOURCES**, then the database's name.

	![Linked Resources][linked-resources]

2. Click **Connection String**.

	![Connection string][connection-string]
	
From the **PHP** section of the resulting dialog, make note of the values for `UID`, `PWD`, `Database`, and `$serverName`. You will use this information later.

##Install WebMatrix

You can install WebMatrix from the Preview Management Portal. From your website's dashboard, click **QUICKSTART** near the top of the page, then click **Install WebMatrix**.

![Install WebMatrix][install-webmatrix]

Run the downloaded .exe file. This will install the Microsoft Web Platform Installer, launch it, and select WebMatrix for installation. Follow the prompts to complete the installation.

##Develop Your Application

In the next few steps you will develop the Tasklist application by adding the files you downloaded earlier and making a few modifications. You could, however, add your own existing files or create new files.

1. Launch WebMatrix by clicking the Windows **Start** button, then click **All Programs>Microsoft Web Matrix>Microsoft WebMatrix**:

	![Launch Webmatrix][launch-webmatrix]

2. Create a new project by clicking **Templates**, then **PHP** (in the left pane), and finally **Empty Site**. Fill in name of site (tasklist), click **Next**.

	![WebMatrix - Select Templates][webmatrix-templates]

	![WebMatrix - Select PHP Template][webmatrix-php-template]

	![WebMatrix - Select PHP Empty Site][webmatrix-php-emptysite]

3. In the lower left corner, click **Files**, then delete `index.php` from the project.

	![WebMatrix - Select Files][webmatrix-files]

	![WebMatrix - Delete index.php][webmatrix-delete-indexphp]

4. To import the files you downloaded earlier, click **Add Existing**, navigate to the directory where you saved the Tasklist application files, select them, and add them to the project.

	![WebMatrix - Add existing files][webmatrix-add-existing]

5. Next, you need to add your local SQL Express database connection information to the `taskmodel.php` file. Open the  `taskmodel.php` file by double clicking it, and update the database connection information in the `connect` function. (**Note**: Jump [Publish Your Application](#Publish) if you do not want to test your application locally and want to instead publish directly to Windows Azure Websites.)

		// DB connection info
		$host = ".\sqlexpress";
		$user = "your user name";
		$pwd = "your password";
		$db = "tasklist";

	Save the `taskmodel.php` file.

6. For the application to run, the `items` table needs to be created. Right click the `createtable.php` file and select **Launch in browser**. This will launch `createtable.php` in your browser and execute code that creates the `items` table in the `tasklist` database.

	![WebMatrix - Launch createtable.php in browser][webmatrix-launchinbrowser]

7. Now you can test the application locally. Right click the `index.php` file and select **Launch in browser**. Test the application by adding items, marking them complete, and deleting them.  


<h2 id="Publish">Publish Your Application</h2>

Before publishing your application to Windows Azure Websites, the database connection information in `taskmodel.php` needs to be updated with the connection information you obtained earlier (in the [Create a Windows Azure Website and SQL Database](#CreateWebsite) section).

1. Open the `taskmodel.php` file by double clicking it, and update the database connection information in the `connect` function.

		// DB connection info
		$host = "value of $serverName";
		$user = "value of UID";
		$pwd = "the SQL password you created when creating the website";
		$db = "value of Database";
	
	Save the `taskmodel.php` file.

2. Return to the Preview Management Portal and navigate to your website's **DASHBOARD**. Click the **Download publish profile** link at the bottom right corner of the page:

	![Download publish profile][download-publish-profile]

	Make note of where you save this file.

3. In WebMatrix, click the **Publish** icon.

	![WebMatrix - Publish][webmatrix-publish]

4. In the dialog box that opens, click **Import publish settings**.

	![Webmatrix - Import publish settings][webmatrix-import-pub-settings]

	Navigate the the `.publishsettings` file that you saved in the previous step, import it, and click **Save**. You will be asked to allow WebMatrix to upload files to your site for compatibility testing. Choose to allow WebMatrix to do this.

5. Click **Continue** on the **Publish Compatibility** dialog.

	![Webmatrix - Publish Compatability][webmatrix-pubcompat-continue]

6. Click **Continue** on the **Publish Preview** dialog.

	![Webmatrix - Publish Preview][webmatrix-pubpreview]

	When the publishing is complete, you will see **Publishing - Complete** at the bottom of the WebMatrix screen.

7. Navigate to http://[your website name].windows.net/createtable.php to create the `items` table.

8. Lastly, navigate to http://[your website name].windows.net/index.php to being using the running application.
	
##Modify and Republish Your Application

You can easily modify and republish your application. Here, you will make a simple change to the heading in in the `index.php` file, and republish the application.

1. Open the `index.php` file by double-clicking it.

2. Change 'My ToDo List` to `My Task List` in the `h1` tag and save the file.

3. Click the **Publish** icon, the click **Continue** in the **Publish Preview** dialog.

4. When publishing has completed, navigate to http://[your website name].windows.net/index.php to see the published changes.

[install-SQLExpress]: http://www.microsoft.com/en-us/download/details.aspx?id=29062
[running-app]: ../../Shared/Media/running_app.jpg
[tasklist-sqlazure-download]: http://go.microsoft.com/fwlink/?LinkId=252504
[install-webmatrix]: ../../Shared/Media/install_webmatrix_from_site_dashboard.jpg
[launch-webmatrix]: ../../Shared/Media/launch_webmatrix.jpg
[download-publish-profile]: ../../Shared/Media/download_publish_profile.jpg
[new-website]: ../../Shared/Media/new_website.jpg
[custom-create]: ../../Shared/Media/custom_create.jpg
[website-details-sqlazure]: ./Media/website_details_sqlazure.jpg
[database-settings]: ./Media/database_settings.jpg
[create-server]: ./Media/create_server.jpg
[linked-resources]: ./Media/linked_resources.jpg
[connection-string]: ./Media/connection_string.jpg
[install-webmatrix]: ../../Shared/Media/install_webmatrix_from_site_dashboard.jpg
[launch-webmatrix]: ../../Shared/Media/launch_webmatrix.jpg
[download-publish-profile]: ../../Shared/Media/download_publish_profile.jpg
[webmatrix-templates]: ../../Shared/Media/webmatrix_templates.jpg
[webmatrix-php-template]: ../../Shared/Media/webmatrix_php_template.jpg
[webmatrix-php-emptysite]: ../../Shared/Media/webmatrix_php_emptysite.jpg
[webmatrix-files]: ../../Shared/Media/webmatrix_files.jpg
[webmatrix-delete-indexphp]: ../../Shared/Media/webmatrix_files.jpg
[webmatrix-add-existing]: ../../Shared/Media/webmatrix_add_existing.jpg
[webmatrix-launchinbrowser]: ../../Shared/Media/webmatrix_launchinbrowser.jpg
[webmatrix-publish]: ../../Shared/Media/webmatrix_publish.jpg
[webmatrix-import-pub-settings]: ../../Shared/Media/webmatrix_import_pub_settings.jpg
[webmatrix-pubcompat-continue]: ../../Shared/Media/webmatrix_pubcompat_continue.jpg
[webmatirx-pubpreview]: ../../Shared/Media/webmatrix_pubpreview.jpg
[preview-portal]: https://manage.windowsazure.com