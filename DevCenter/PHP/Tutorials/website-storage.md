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


##Getting started with the client libraries

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

* Then, make a call to **createTable** passing in the name of the table. Similarly to other NoSQL table stores, no schema is required for Azure Tables.
	
		try	{
			$tableRestProxy->createTable('tasks');
		}
		catch(ServiceException $e){
			$code = $e->getCode();
			$error_message = $e->getMessage();
			// Handle exception based on error codes and messages.
		}

	Error codes and message scan be found here: [http://msdn.microsoft.com/en-us/library/windowsazure/dd179438.aspx][msdn-errors]


##Querying a Table

* Create a file named `index.php` and insert the following HTML and PHP code which will form the header of the page:
	
		<html>
		<head>
			<title>Index</title>
		</head>
		<body>
		<h1>My ToDo List <font color="grey" size="5">(powered by PHP and Azure Tables) </font></h1>
		<?php
		require_once "init.php";

* To query Azure Tables for all entities stored in the **tasks** table you call the **queryEntities** method:

		try {
		    $result = $tableRestProxy->queryEntities('tasks');
		}
		catch(ServiceException $e){
		    $code = $e->getCode();
		    $error_message = $e->getMessage();
		    echo $code.": ".$error_message."<br />";
		}
		
* To iterate on the entities in the result set:

		$entities = $result->getEntities();
			
		for ($i = 0; $i < count($entities); $i++) {
			if ($i == 0) {
				echo "<table border='1'>
				<tr>
					<td>Name</td>
					<td>Category</td>
					<td>Date</td>
					<td>Mark Complete?</td>
					<td>Delete?</td>
				</tr>";
			}
			echo "
				<tr>
					<td>".$entities[$i]->getProperty('name')->getValue()."</td>
					<td>".$entities[$i]->getProperty('category')->getValue()."</td>
					<td>".$entities[$i]->getProperty('date')->getValue()."</td>";
					if ($entities[$i]->getProperty('complete')->getValue() == false)
						echo "<td><a href='markitem.php?complete=true&pk=".$entities[$i]->getPartitionKey()."&rk=".$entities[$i]->getRowKey()."'>Mark Complete</a></td>";
					else
						echo "<td><a href='markitem.php?complete=false&pk=".$entities[$i]->getPartitionKey()."&rk=".$entities[$i]->getRowKey()."'>Unmark Complete</a></td>";
					echo "
					<td><a href='deleteitem.php?pk=".$entities[$i]->getPartitionKey()."&rk=".$entities[$i]->getRowKey()."'>Delete</a></td>
				</tr>";
		}
	
		if ($i > 0)
			echo "</table>";
		else
			echo "<h3>No items on list.</h3>";
		?>


## Inserting Entities into a Table

Your application can now read all items stored in the table. Since there won't be any, let's add a function that inserts into the DB.

* Create a file named `additem.php`

* Add the following header to the file:

		<?php
		
		require_once "init.php";
		
		use WindowsAzure\Table\Models\Entity;
		use WindowsAzure\Table\Models\EdmType;
		
* The first step of inserting an entity is instantiating an `Entity` object and setting the properties on it:
		
		$entity = new Entity();
		$entity->setPartitionKey('p1');
		$entity->setRowKey((string) microtime(true));
		$entity->addProperty('name', EdmType::STRING, $_POST['itemname']);
		$entity->addProperty('category', EdmType::STRING, $_POST['category']);
		$entity->addProperty('date', EdmType::STRING, $_POST['date']);
		$entity->addProperty('complete', EdmType::BOOLEAN, false);

* Then you can pass the `$entity` to the `insertEntity` method:

		try{
			$tableRestProxy->insertEntity('tasks', $entity);
		}
		catch(ServiceException $e){
			$code = $e->getCode();
			$error_message = $e->getMessage();
		}

* Last, to make the page return to the home page after inserting the entity:

		header('Location: index.php');
		
		?>
	
## Updating an Entity

* The first step to updating an entity is fetching it from the Table:
		
		<?php
		
		require_once "init.php";
		
		$result = $tableRestProxy->queryEntities(TABLE_NAME, 'PartitionKey eq \''.$_GET['pk'].'\' and RowKey eq \''.$_GET['rk'].'\'');
		
		$entities = $result->getEntities();
		
		$entity = $entities[0];

* Then you can change any properties:

		$entity->setPropertyValue('complete', ($_GET['complete'] == 'true') ? true : false);

* And the `updateEntity` method performs the update:

		try{
			$result = $tableRestProxy->updateEntity(TABLE_NAME, $entity);
		}
		catch(ServiceException $e){
			$code = $e->getCode();
			$error_message = $e->getMessage();
		}

* To make the page return to the home page after inserting the entity:

		header('Location: index.php');
		
		?>


## Deleting an Entity

Deleting an item is accomplished with a single call `deleteItem`. The passed in values are the **PartitionKey** and the **RowKey**, which together make up the primary key of the entity:

		<?php
		
		require_once "init.php";
		
		$tableRestProxy->deleteEntity(TABLE_NAME, $_GET['pk'], $_GET['rk']);
		
		header('Location: index.php');
		
		?>


[install-php]: http://www.php.net/manual/en/install.php
[install-mysql]: http://dev.mysql.com/doc/refman/5.6/en/installing.html
[pdo-mysql]: http://www.php.net/manual/en/ref.pdo-mysql.php
[msdn-errors]: http://msdn.microsoft.com/en-us/library/windowsazure/dd179438.aspx
[tasklist-mysql-download]: http://go.microsoft.com/fwlink/?LinkId=252506
[localhost-createtable]: http://localhost/tasklist/createtable.php
[localhost-index]: http://localhost/tasklist/index.php
[ws-storage-app]: ../Media/ws-storage-app.png
[preview-portal]: https://manage.windowsazure.com