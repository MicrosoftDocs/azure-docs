<properties umbracoNaviHide="0" pageTitle="Create a PHP Website using Windows Azure Storage" metaKeywords="Windows Azure, Windows Azure Websites, PHP, Storage" metaDescription="Learn how to create a PHP website using Windows Azure storage" linkid="dev-php-tutorials-php-site-storage" urlDisplayName="Create a PHP Website using Windows Azure Storage" headerExpose="" footerExpose="" disqusComments="1" />

#Create a PHP Website using Windows Azure Storage

This tutorial shows you how to create a PHP website and use the Windows Azure Tables storage service in the back-end. This tutorial assumes you have [PHP][install-php] and a web server installed on your computer. The instructions in this tutorial can be followed on any operating system, including Windows, Mac, and  Linux. Upon completing this guide, you will have a PHP website running in Windows Azure and accessing the Table storage service.
 
You will learn:

* How to install the Windows Azure client libraries and include them into your application.
* How to use the client libraries for creating tables, creating, querying and deleting table entities.
* How to create a Windows Azure Storage Account and retrieve its credentials.
 
By following this tutorial, you will build a simple Tasklist web application in PHP. A screenshot of the completed application is below:

![Windows Azure PHP Website][ws-storage-app]

##Installing the Windows Azure client libraries

In order to use the Windows Azure storage services, you must first download the client libraries. They are available as a ZIP file, PEAR package, and a Composer package [todo: link to download doc]. Composer provides a way to install the client libraries and all their dependencies in one go and with no prior installation work:

* Create a file named **composer.json** in the root of your project and add the following code to it:
	{
		"require": {
			"microsoft/windowsazure": "1.0"
		}
	}

* Download **composer.phar** in your project root.

* Open a command prompt and execute this in your project root

	php composer.phar install


##Getting strted with the client libraries

There are four basic steps that have to be performed before you can make a call to a Windows Azure API wen using the libraries. You will create an initialization script that will perform these steps.

* Create a file called **init.php** and perform the steps below within it.

* First, include the autoloader script:

	require_once "azure-sdk-for-php/WindowsAzure/WindowsAzure.php"; 
	
* Then request the namespaces yo are going to use.

Since the third step is creating a configuration object containing the account credentials you need to include `Configuration` namespace:

	use WindowsAzure\Common\Configuration;
	
This tutorial uses the Azure Table service. Two namespaces are necessary to create a wrapper around the Table service calls:
	
	use WindowsAzure\Table\TableService;
	use WindowsAzure\Table\TableSettings;

* To create a `Configuration` class pass in your authentication information:

	$config = new Configuration();
	$config->setProperty(TableSettings::ACCOUNT_NAME, '[YOUR_STORAGE_ACCOUNT_NAME]');
	$config->setProperty(TableSettings::ACCOUNT_KEY, '[YOUR_STORAGE_ACCOUNT_KEY]');
	$config->setProperty(TableSettings::URI, 'http://' . '[YOUR_STORAGE_ACCOUNT_NAME]' . '.table.core.windows.net');

* Use the `TableService` factory to instantiate a wrapper around Table service calls.

	$tableRestProxy = TableService::create($config);
	
`$tableRestProxy` contains a method for every REST call available on Azure Tables.

** Creating a Table

Just like in MySQL, before you can store data you first have to create a container for it, called a Table. 

* Create a file named *createtable.php*

* First, include the initialization script you just created. You will be including this script in every file accessing Azure:

	require_once "init.php";

* Then, make a call to createTable passing in the name of the table. Similarly to other NoSQL table stores, no schema is required for Azure Tables.
	
	try	{
		$tableRestProxy->createTable('tasks');
	}
	catch(ServiceException $e){
		$code = $e->getCode();
		$error_message = $e->getMessage();
		// Handle exception based on error codes and messages.
	}

Error codes and message scan be found here: http://msdn.microsoft.com/en-us/library/windowsazure/dd179438.aspx[http://msdn.microsoft.com/en-us/library/windowsazure/dd179438.aspx]

The Tasklist application is a simple PHP application that allows you to add, mark complete, and delete items from a task list. Task list items are stored in Windows Azure Table Storage. The application consists of these files:

* **index.php**: Displays tasks and provides a form for adding an item to the list.
* **additem.php**: Adds an item to the list.
* **getitems.php**: Gets all items in the database.
* **markitemcomplete.php**: Changes the status of an item to complete.
* **deleteitem.php**: Deletes an item.
* **taskmodel.php**: Contains functions that add, get, update, and delete items from the database.
* **createtable.php**: Creates the MySQL table for the application. This file will only be called once.

To run the application locally, follow the steps below. Note that these steps assume you have PHP, MySQL, and a web server set up on your local machine, and that you have enabled the [PDO extension for MySQL][pdo-mysql].

1. Download the application files from Github here: [http://go.microsoft.com/fwlink/?LinkId=252506][tasklist-mysql-download]. Put the files in a folder called `tasklist` in your web server's root directory.
2. Create a MySQL database called `tasklist`. You can do this from the MySQL command prompt with this command:

		mysql> create database tasklist;

3. Open the **taskmodel.php** file in a text editor or IDE and provide the database connection information by providing values for `$host`, `$user`, `$pwd`, and `$db` variables in the `connect` function:

		// DB connection info
		$host = "localhost";
		$user = "your_mysql_user_name";
		$pwd = "mysql_user_password";
		$db = "tasklist";

4. Open a web browser and browse to [http://localhost/tasklist/createtable.php][localhost-createtable]. This will create the `items` table that stores task list work items.

5. Browse to [http://localhost/tasklist/index.php][localhost-index] and begin adding items, marking them complete, and deleting them.

After you have run the application locally, you are ready to create a Windows Azure Website and publish your code using FTP.

##Create a Windows Azure Website and Set up FTP Publishing

Follow these steps to create a Windows Azure Website and a MySQL database:

1. Login to the [Preview Management Portal][preview-portal].
2. Click the **+ New** icon on the bottom left of the portal.

	![Create New Windows Azure Website][new-website]

3. Click **Web Site**, then **Custom Create**.

	![Custom Create a new Website][custom-create]
	
	Enter a value for **URL**, select **Create a New MySQL Database** from the **DATABASE** dropdown,  and select the data center for your website in the **REGION** dropdown. Click the arrow at the bottom of the dialog.

	![Fill in Website details][website-details]

4. Enter a value for the **NAME** of your database, select the data center for your database in the **REGION** dropdown, and check the box that indicates you agree with the legal terms. Click the checkmark at the bottom of the dialog.

	![Create new MySQL database][new-mysql-db]

	When the website has been created you will see the text **Creation of Web Site ‘[SITENAME]’ completed successfully**. Now, you can enable FTP publishing.

5. Click the name of the website displayed in the list of websites to open the website’s **QUICKSTART** dashboard.

	![Open website dashboard][go-to-dashboard]


6. At the bottom of the **QUICKSTART** page, click **Reset deployment credentials**. 

	![Reset deployment credentials][reset-deployment-credentials]

7. To enable FTP publishing, you must provide a user name and password. Make a note of the user name and password you create.

	![Create publishing credentials][credentials]


##Get FTP & MySQL Connection Information

Before publishing the Tasklist application, the database connection information (in the **taskmodel.php** file) must be updated. To get MySQL connection information, follow these steps:

**NOTE:** These steps are only necessary in the Windows Azure Preview.

1. From your website's dashboard, click the **Download publish profile** link at the bottom right corner of the page:

	![Download publish profile][download-publish-profile]

2. Open the `.publishsettings` file in an XML editor. 

3. The `<databases>` element will look similar to this:

		<databases>
			<add name="tasklist" 
				connectionString="Database=tasklist;Data Source=us-mm-azure-ord-01.cleardb.com;User Id=[user_id];Password=[password]" 
				providerName="MySql.Data.MySqlClient" 
				type="MySql"/>
		</databases>
	
Make note of the `connectionString` attribute in the `<add>` element, in particular the values for `Database`, `Data Source`, `User Id`, and `Password`.

4. Open the **taskmodel.php** file in a text editor or IDE and update the database connection information in the `connect` function by copying the appropriate values from the previous step:

		// DB connection info
		$host = "value of Data Source";
		$user = "value of User Id";
		$pwd = "value of Password";
		$db = "value of Database";

3. Find the `<publishProfile >` element with `publishMethod="FTP"` that looks similar to this:

		<publishProfile publishMethod="FTP" publishUrl="ftp://S2.ftp.antdf0.antares-test.windows-int.net/site/wwwroot" ftpPassiveMode="True" userName="[username]" userPWD="[password]" destinationAppUrl="http://[name].antdf0.antares-test.windows-int.net" SQLServerDBConnectionString="" mySQLDBConnectionString="" hostingProviderForumLink="" controlPanelLink="http://windows.azure.com">
			...
		</publishProfile>
	
Make note of the `publishUrl`, `userName`, and `userPWD` attributes.


##Publish Your Application

To publish your application with an FTP client, follow the steps below.

1. Open your FTP client of choice.

2. Enter the host name portion from the `publishUrl` attribute you noted above into your FTP client.

3. Enter the `userName` and `userPWD` attributes you noted above unchanged into your FTP client.

4. Establish a connection.

After you have connected you will be able to upload and download files as needed.
 

[install-php]: http://www.php.net/manual/en/install.php
[install-mysql]: http://dev.mysql.com/doc/refman/5.6/en/installing.html
[pdo-mysql]: http://www.php.net/manual/en/ref.pdo-mysql.php
[tasklist-mysql-download]: http://go.microsoft.com/fwlink/?LinkId=252506
[localhost-createtable]: http://localhost/tasklist/createtable.php
[localhost-index]: http://localhost/tasklist/index.php
[running-app]: ../Media/running_app.jpg
[new-website]: ../../Shared/Media/new_website.jpg
[custom-create]: ../../Shared/Media/custom_create.jpg
[website-details]: ../../Shared/Media/website_details.jpg
[new-mysql-db]: ../../Shared/Media/new_mysql_db.jpg
[go-to-dashboard]: ../../Shared/Media/go_to_dashboard.jpg
[reset-deployment-credentials]: ../Media/reset-deployment-credentials.png
[credentials]: ../Media/credentials.jpg
[creating-repo]: ../Media/creating_repo.jpg
[push-files]: ../Media/push_files.jpg
[download-publish-profile]: ../../Shared/Media/download_publish_profile.jpg
[preview-portal]: https://manage.windowsazure.com