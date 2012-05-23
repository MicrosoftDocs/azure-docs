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

*  Create a file named **composer.json** in the root of your project and add the following code to it:

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


## Creating a Table

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

	Error codes and message scan be found here: [http://msdn.microsoft.com/en-us/library/windowsazure/dd179438.aspx][msdn-errors]



[install-php]: http://www.php.net/manual/en/install.php
[install-mysql]: http://dev.mysql.com/doc/refman/5.6/en/installing.html
[pdo-mysql]: http://www.php.net/manual/en/ref.pdo-mysql.php
[msdn-errors]: http://msdn.microsoft.com/en-us/library/windowsazure/dd179438.aspx
[tasklist-mysql-download]: http://go.microsoft.com/fwlink/?LinkId=252506
[localhost-createtable]: http://localhost/tasklist/createtable.php
[localhost-index]: http://localhost/tasklist/index.php
[ws-storage-app]: ../Media/ws-storage-app.png
[preview-portal]: https://manage.windowsazure.com