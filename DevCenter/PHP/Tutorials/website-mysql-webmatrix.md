<properties umbracoNaviHide="0" pageTitle="PHP-MySQL Windows Azure Website using WebMatrix" metaKeywords="Windows Azure deployment, Azure deployment, Windows Azure Websites, MySQL, PHP, WebMatrix" metaDescription="Learn how to create and deploy a PHP-MySQL website to Windows Azure using WebMatrix." linkid="dev-php-tutorials-mysql-website-webmatrix" urlDisplayName="Create and Deploy a PHP-MySQL Windows Azure Website Using WebMatrix" headerExpose="" footerExpose="" disqusComments="1" />

#Create and deploy a PHP-MySQL Windows Azure Website using WebMatrix

This tutorial shows you how to use WebMatrix to develop and deploy a PHP-MySQL application to a Windows Azure Website. WebMatrix is a free web development tool from Microsoft that includes everything you need for website development. WebMatrix supports PHP and includes intellisense for PHP development.

This tutorial assumes you have [MySQL][install-mysql] installed on your computer so that you can test an application locally. However, you can complete the tutorial without having MySQL installed. Instead, you can deploy your application directly to Windows Azure Websites.

Upon completing this guide, you will have a PHP-MySQL website running in Windows Azure.
 
You will learn:

* How to create a Windows Azure Website and a MySQL database using the Preview Management Portal. Because PHP is enabled in Windows Azure Websites by default, nothing special is required to run your PHP code.
* How to develop a PHP application using WebMatrix.
* How to publish and re-publish your application to Windows Azure using WebMatrix.
 
By following this tutorial, you will build a simple Tasklist web application in PHP. The application will be hosted in a Windows Azure Website. A screenshot of the running application is below:

![Windows Azure PHP Website][running-app]

##Prerequisites

1. Download the Tasklist application files from here: [http://go.microsoft.com/fwlink/?LinkId=252506][tasklist-mysql-download]. The Tasklist application is a simple PHP application that allows you to add, mark complete, and delete items from a task list. Task list items are stored in a MySQL database. The application consists of these files:

* **index.php**: Displays tasks and provides a form for adding an item to the list.
* **additem.php**: Adds an item to the list.
* **getitems.php**: Gets all items in the database.
* **markitemcomplete.php**: Changes the status of an item to complete.
* **deleteitem.php**: Deletes an item.
* **taskmodel.php**: Contains functions that add, get, update, and delete items from the database.
* **createtable.php**: Creates the MySQL table for the application. This file will only be called once.

2. Create a MySQL database called `tasklist`. You can do this from the MySQL command prompt with this command:

		mysql> create database tasklist;

	This step is only necessary if you want to test your application locally.

<h2 id="CreateWebsite">Create a Windows Azure Website and MySQL database</h2>

### Create a Windows Azure account

<div chunk="../../Shared/Chunks/create-azure-account.md" />

### Enable Windows Azure Web Sites

<div chunk="../../Shared/Chunks/antares-iaas-signup.md" />

Windows Azure Websites allows you to easily create a website and provision a MySQL Database.

<div class="dev-callout"> 
<b>Note</b> 
<p>In the preview release of Windows Azure Websites, you cannot create a MySQL Database for a website *after* creating the website. You must create a website and a MySQL database as described in the steps below.</p> 
</div>


<div chunk="../../Shared/Chunks/website-mysql.md" />

Make note of the database connection information as it will be needed later.

##Install WebMatrix

You can install WebMatrix from the [Preview Management Portal][preview-portal]. After logging in, navigate to your website's **DASHBOARD**,  click the cloud icon near the top of the page, then click **Install WebMatrix**.

![Install WebMatrix][install-webmatrix]

Run the downloaded .exe file. This will install the Microsoft Web Platform Installer, launch it, and select WebMatrix for installation. Follow the prompts to complete the installation.

##Develop your application

In the next few steps you will develop the Tasklist application by adding the files you downloaded earlier and making a few modifications. You could, however, add your own existing files or create new files.

1. Launch WebMatrix by clicking the Windows **Start** button, then click **All Programs>Microsoft WebMatrix>Microsoft WebMatrix**:

	![Launch Webmatrix][launch-webmatrix]

2. Create a new project by clicking **Templates**.

	![WebMatrix - Select Templates][webmatrix-templates]

3. Click **PHP** (in the left pane). 

	![WebMatrix - Select PHP Template][webmatrix-php-template]

4. Click **Empty Site**, fill in name of site (tasklist), and click **Next**.

	![WebMatrix - Select PHP Empty Site][webmatrix-php-emptysite]

5. Click **Accept** to allow WebMatrix to install the Empty Site template.

	![WebMatrix - Download Empty Site template][php-site-from-template]

6. Click **OK** when the template has been installed.

	![WebMatrix - Empty Site template installed][php-empty-site-template-installed]

7. In the lower left corner, click **Files**, then delete `index.php` from the project.

	![WebMatrix - Select Files][webmatrix-files]

	![WebMatrix - Delete index.php][webmatrix-delete-indexphp]

8. To import the files you downloaded earlier, click **Add Existing**, navigate to the directory where you saved the Tasklist application files, select them, and add them to the project.

	![WebMatrix - Add existing files][webmatrix-add-existing]

9. Next, you need to add your local MySQL database connection information to the `taskmodel.php` file. Open the  `taskmodel.php` file by double clicking it, and update the database connection information in the `connect` function. (**Note**: Jump [Publish Your Application](#Publish) if you do not want to test your application locally and want to instead publish directly to Windows Azure Websites.)

		// DB connection info
		$host = "localhost";
		$user = "your user name";
		$pwd = "your password";
		$db = "tasklist";

	Save the `taskmodel.php` file.

10. For the application to run, the `items` table needs to be created. Right click the `createtable.php` file and select **Launch in browser**. This will launch `createtable.php` in your browser and execute code that creates the `items` table in the `tasklist` database.

	![WebMatrix - Launch createtable.php in browser][webmatrix-launchinbrowser]

11. Now you can test the application locally. Right click the `index.php` file and select **Launch in browser**. Test the application by adding items, marking them complete, and deleting them.  


<h2 id="Publish">Publish your application</h2>

Before publishing your application to Windows Azure Websites, the database connection information in `taskmodel.php` needs to be updated with the connection information you obtained earlier (in the [Create a Windows Azure Website and MySQL Database](#CreateWebsite) section).

1. Open the `taskmodel.php` file by double clicking it, and update the database connection information in the `connect` function.

		// DB connection info
		$host = "value of Data Source";
		$user = "value of User Id";
		$pwd = "value of Password";
		$db = "value of Database";
	
	Save the `taskmodel.php` file.

2. Return to the Preview Management Portal and navigate to your website's **DASHBOARD**. Click the **Download publish profile** link at the bottom right corner of the page:

	![Download publish profile][download-publish-profile]

	Make note of where you save this file.

3. In WebMatrix, click the **Publish** icon.

	![WebMatrix - Publish][webmatrix-publish]

4. In the dialog box that opens, click **Import publish settings**.

	![Webmatrix - Import publish settings][webmatrix-import-pub-settings]

	Navigate to the `.publishsettings` file that you saved in the previous step, import it, and click **Save**. You will be asked to allow WebMatrix to upload files to your site for compatibility testing. Choose to allow WebMatrix to do this.

5. Click **Continue** on the **Publish Compatibility** dialog.

	![Webmatrix - Publish Compatability][webmatrix-pubcompat-continue]

6. Click **Continue** on the **Publish Preview** dialog.

	![Webmatrix - Publish Preview][webmatirx-pubpreview]

	When the publishing is complete, you will see **Publishing - Complete** at the bottom of the WebMatrix screen.

7. Navigate to http://[your website name].windows.net/createtable.php to create the `items` table.

8. Lastly, navigate to http://[your website name].windows.net/index.php to being using the running application.
	
##Modify and republish your application

You can easily modify and republish your application. Here, you will make a simple change to the heading in in the `index.php` file, and republish the application.

1. Open the `index.php` file by double-clicking it.

2. Change **My ToDo List** to **My Task List** in the **h1** tag and save the file.

3. Click the **Publish** icon, the click **Continue** in the **Publish Preview** dialog.

4. When publishing has completed, navigate to http://[your website name].windows.net/index.php to see the published changes.



[install-mysql]: http://dev.mysql.com/doc/refman/5.6/en/installing.html
[running-app]: ../Media/tasklist_app_windows.png
[tasklist-mysql-download]: http://go.microsoft.com/fwlink/?LinkId=252506
[install-webmatrix]: ../../Shared/Media/install_webmatrix_from_site_dashboard.jpg
[launch-webmatrix]: ../../Shared/Media/launch_webmatrix.jpg
[download-publish-profile]: ../../Shared/Media/download_publish_profile.jpg
[webmatrix-templates]: ../../Shared/Media/webmatrix_templates.jpg
[webmatrix-php-template]: ../../Shared/Media/webmatrix_php_template.jpg
[webmatrix-php-emptysite]: ../../Shared/Media/webmatrix_php_emptysite.jpg
[webmatrix-files]: ../../Shared/Media/webmatrix_files.jpg
[webmatrix-delete-indexphp]: ../../Shared/Media/webmatrix_delete_indexphp.jpg
[webmatrix-add-existing]: ../../Shared/Media/webmatrix_add_existing.jpg
[webmatrix-launchinbrowser]: ../../Shared/Media/webmatrix_launchinbrowser.jpg
[webmatrix-publish]: ../../Shared/Media/webmatrix_publish.jpg
[webmatrix-import-pub-settings]: ../../Shared/Media/webmatrix_import_pub_settings.jpg
[webmatrix-pubcompat-continue]: ../../Shared/Media/webmatrix_pubcompat_continue.jpg
[webmatirx-pubpreview]: ../../Shared/Media/webmatrix_pubpreview.jpg
[preview-portal]: https://manage.windowsazure.com
[php-site-from-template]: ../../Shared/Media/php_site_from_template.png
[php-empty-site-template-installed]: ../../Shared/Media/php_empty_site_template_installed.png