<properties 
	pageTitle="Create a PHP web app in Azure App Service using Azure Storage" 
	description="This tutorial shows you how to create a PHP web app in Azure App Service and use the Azure Tables storage service in the back-end." 
	services="app-service\web, storage" 
	documentationCenter="php" 
	authors="tfitzmac" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="PHP" 
	ms.topic="article" 
	ms.date="04/07/2015" 
	ms.author="tomfitz"/>

# Create a PHP web app in Azure App Service using Azure Storage

This tutorial shows you how to create a PHP web app in [Azure App Service](http://go.microsoft.com/fwlink/?LinkId=529714) and use the Azure Tables storage service in the back-end. This tutorial assumes you have [PHP][install-php] and a web server installed on your computer. The instructions in this tutorial can be followed on any operating system, including Windows, Mac, and  Linux. Upon completing this guide, you will have a PHP web app running in Azure and accessing the Table storage service.
 
You will learn:

* How to install the Azure client libraries and include them into your application.
* How to use the client libraries for creating tables, and for creating, querying and deleting table entities.
* How to create an Azure Storage Account and set up your application to use it.
* How to create an Azure web app and deploy to it using Git
 
You will build a simple Tasklist web application in PHP. A screenshot of the completed application is below:

![Azure PHP web app][ws-storage-app]

[AZURE.INCLUDE [create-account-and-websites-note](../includes/create-account-and-websites-note.md)]

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

##Installing the Azure client libraries

To install the PHP Client Libraries for Azure via Composer, follow these steps:

1. [Install Git][install-git]

	> [AZURE.NOTE]
	> On Windows, you will also need to add the Git executable to your PATH environment variable.

2. Create a file named **composer.json** in the root of your project and add the following code to it:

		{
			"require": {
				"microsoft/windowsazure": "*"
			},			
			"repositories": [
				{
					"type": "pear",
					"url": "http://pear.php.net"
				}
			],
			"minimum-stability": "dev"
		}

3. Download **[composer.phar][composer-phar]** in your project root.

4. Open a command prompt and execute this in your project root

		php composer.phar install

##Getting started with the client libraries

There are four basic steps that have to be performed before you can make a call to an Azure API wen using the libraries. You will create an initialization script that will perform these steps.

* Create a file called **init.php**.

* First, include the autoloader script:

		require_once 'vendor\autoload.php'; 
	
* Include the namespaces you are going to use.

	To create any Azure service client you need to use the **ServicesBuilder** class:

		use WindowsAzure\Common\ServicesBuilder;

	To catch exceptions produced by any API call you need the **ServiceException** class:

		use WindowsAzure\Common\ServiceException;
	
* To instantiate the service client you will also need a valid connection string. The format for the table service connection strings is:

	For accessing a live service:
	
		DefaultEndpointsProtocol=[http|https];AccountName=[yourAccount];AccountKey=[yourKey]
	
	For accessing the emulator storage:
	
		UseDevelopmentStorage=true

* Use the `ServicesBuilder::createTableService` factory method to instantiate a wrapper around Table service calls.

		$tableRestProxy = ServicesBuilder::getInstance()->createTableService($connectionString);
	
	`$tableRestProxy` contains a method for every REST call available on Azure Tables.


## Creating a Table

Before you can store data you first have to create a container for it, the Table. 

* Create a file named **createtable.php**.

* First, include the initialization script you just created. You will be including this script in every file accessing Azure:

		<?php
		require_once "init.php";

* Then, make a call to *createTable* passing in the name of the table. Similarly to other NoSQL table stores, no schema is required for Azure Tables.
	
		try	{
			$tableRestProxy->createTable('tasks');
		}
		catch(ServiceException $e){
			$code = $e->getCode();
			$error_message = $e->getMessage();
		    echo $code.": ".$error_message."<br />";
		}
		?>

	Error codes and message scan be found here: [http://msdn.microsoft.com/library/windowsazure/dd179438.aspx][msdn-errors]


##Querying a Table

The home page of the Tasklist application should list all existing tasks and allow the insertion of new ones.

* Create a file named **index.php** and insert the following HTML and PHP code which will form the header of the page:
	
		<html>
		<head>
			<title>Index</title>
			<style type="text/css">
			    body { background-color: #fff; border-top: solid 10px #000;
			        color: #333; font-size: .85em; margin: 20; padding: 20;
			        font-family: "Segoe UI", Verdana, Helvetica, Sans-Serif;
			    }
			    h1, h2, h3,{ color: #000; margin-bottom: 0; padding-bottom: 0; }
			    h1 { font-size: 2em; }
			    h2 { font-size: 1.75em; }
			    h3 { font-size: 1.2em; }
			    table { margin-top: 0.75em; }
			    th { font-size: 1.2em; text-align: left; border: none; padding-left: 0; }
			    td { padding: 0.25em 2em 0.25em 0em; border: 0 none; }
			</style>
		</head>
		<body>
		<h1>My ToDo List <font color="grey" size="5">(powered by PHP and Azure Tables) </font></h1>
		<?php		
		require_once "init.php";

* To query Azure Tables for **all entities** stored in the *tasks* table you call the *queryEntities* method passing only the name of the table. In the **Updating an Entity** section below you will also see how to pass a filter querying for a specific entity.

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

* Once you get an `Entity`, the model for reading data is `Entity->getPropertyValue('[name]')`:

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
					<td>".$entities[$i]->getPropertyValue('name')."</td>
					<td>".$entities[$i]->getPropertyValue('category')."</td>
					<td>".$entities[$i]->getPropertyValue('date')."</td>";
					if ($entities[$i]->getPropertyValue('complete') == false)
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

* Last, you must insert the form that feeds data into the task insertion script and complete the HTML:

			<hr/>
			<form action="additem.php" method="post">
				<table border="1">
					<tr>
						<td>Item Name: </td>
						<td><input name="itemname" type="textbox"/></td>
					</tr>
					<tr>
						<td>Category: </td>
						<td><input name="category" type="textbox"/></td>
					</tr>
					<tr>
						<td>Date: </td>
						<td><input name="date" type="textbox"/></td>
					</tr>
				</table>
				<input type="submit" value="Add item"/>
			</form>
		</body>
		</html>

## Inserting Entities into a Table

Your application can now read all items stored in the table. Since there won't be any at fist, let's add a function that writes data into the database.

* Create a file named **additem.php**.

* Add the following to the file:

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

* Then you can pass the `$entity` you just created to the `insertEntity` method:

		try{
			$tableRestProxy->insertEntity('tasks', $entity);
		}
		catch(ServiceException $e){
			$code = $e->getCode();
			$error_message = $e->getMessage();
		    echo $code.": ".$error_message."<br />";
		}

* Last, to make the page return to the home page after inserting the entity:

		header('Location: index.php');		
		?>
	
## Updating an Entity

The task list app has the ability to mark an item as complete as well as to unmark it. The home page passes in the *RowKey* and *PartitionKey* of an entity and the target state (marked==1, unmarked==0).

* Create a file called **markitem.php** and add the initialization part:

		<?php		
		require_once "init.php";
		

* The first step to updating an entity is fetching it from the Table:
		
		$result = $tableRestProxy->queryEntities('tasks', 'PartitionKey eq \''.$_GET['pk'].'\' and RowKey eq \''.$_GET['rk'].'\'');		
		$entities = $result->getEntities();		
		$entity = $entities[0];

	As you can see the passed in query filter is of the form `Key eq 'Value'`. A full description of the query syntax is available [here][msdn-table-query-syntax].

* Then you can change any properties:

		$entity->setPropertyValue('complete', ($_GET['complete'] == 'true') ? true : false);

* And the `updateEntity` method performs the update:

		try{
			$result = $tableRestProxy->updateEntity('tasks', $entity);
		}
		catch(ServiceException $e){
			$code = $e->getCode();
			$error_message = $e->getMessage();
		    echo $code.": ".$error_message."<br />";
		}

* To make the page return to the home page after inserting the entity:

		header('Location: index.php');		
		?>


## Deleting an Entity

Deleting an item is accomplished with a single call to `deleteItem`. The passed in values are the **PartitionKey** and the **RowKey**, which together make up the primary key of the entity. Create a file called **deleteitem.php** and insert the following code:

		<?php
		
		require_once "init.php";		
		$tableRestProxy->deleteEntity('tasks', $_GET['pk'], $_GET['rk']);		
		header('Location: index.php');
		
		?>


## Create an Azure storage account

To make your application store data into the cloud you need to first create a storage account in Azure and then pass the proper authentication information to the *Configuration* class.

1. Login to the [Azure Portal][management-portal].

2. Click the **New** icon on the bottom left of the portal, then click **Data + Storage** > **Storage**. Give the storage account a unique name and create a new [resource group](resource-group-overview.md) for it.

	![Create a new storage account][storage-quick-create]
	
	When the storage account has been created, the **Notifications** button will flash a green **SUCCESS** and the storage account's blade is open to show that it belongs to the new resource group you created.

5. Click the **Settings** part in the storage account's blade. Take note of the account name and the primary key.

	![Select Manage Keys][storage-access-keys]

7. Open **init.php** and replace `[YOUR_STORAGE_ACCOUNT_NAME]` and `[YOUR_STORAGE_ACCOUNT_KEY]` with the account name and key you took note of in the last step. Save the file.

## Create an Azure web app and set up Git publishing

Follow these steps to create an Azure web app:

1. Login to the [Azure Portal][management-portal].

2. Create an empty web app with the instructions at [How to: Create a web app Using the Azure Portal](web-sites-create-deploy.md#createawebsiteportal). Be sure to create a new [App Service plan](azure-web-sites-web-hosting-plans-in-depth-overview) and select the resource group you created previously for the storage account.

	When the web app has been created, the **Notifications** button will flash a green **SUCCESS** and the web app's blade is open to show that it belongs to the new resource group you created.

6. In the web app's blade, click **Set up continuous deployment**, and choose **Local Git Repository**. Click **OK**.

	![Set up Git publishing][setup-git-publishing]

7. Before you can deploy your local Git repository to Azure, you must also set up deployment credentials. In the web app's blade, click **All Settings** > **Deployment credentials** to configure the credentials. Click **Save** when you're done.

	![Create publishing credentials][credentials]

	It will take a few seconds to set up your repository.

8. Once the Git repository is ready, you now push your changes to it. You can find the repo URL by clicking the same deployment part in the web app's blade. 

	![Git deployment instructions returned after creating a repository for the web app.][git-instructions]

	Note the instructions, as these will be used in the next section to publish the application.

##Publish Your Application

To publish your application with Git, follow the steps below.

1. Open the **vendor/microsoft/windowsazure** folder under the root of the application and delete the following files and folders:
	* .git
	* .gitattributes
	* .gitignore
			
	When the Composer package manager downloads the Azure client libraries and their dependencies it does so by cloning the GitHub repository that they reside in. In the next step, the application will be deployed via Git by creating a repository out of the root folder of the application. Git will ignore the sub-repository where the client libraries live unless the repository-specific files are removed.

2. Open GitBash (or a terminal, if Git is in your `PATH`), change directories to the root directory of your application, and run the following commands:

		git init
		git add .
		git commit -m "initial commit"
		git remote add azure [URL for remote repository]
		git push azure master

	You will be prompted for the password you created earlier.

3. Browse to **http://[your web app domain]/createtable.php** to create the table for the application.
4. Browse to **http://[your web app domain]/index.php** to begin using the application.

After you have published your application, you can begin making changes to it and use Git to publish them. 

##Publish Changes to Your Application

To publish changes to application, follow these steps:

1. Make changes to your application locally.
2. Open GitBash (or a terminal, it Git is in your `PATH`), change directories to the root directory of your application, and run the following commands:

		git add .
		git commit -m "comment describing changes"
		git push azure master

	You will be prompted for the password you created earlier.

3. Browse to **http://[your web app domain]/index.php** to see your changes. 

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
* For a guide to the change of the old portal to the new portal see: [Reference for navigating the portal](http://go.microsoft.com/fwlink/?LinkId=529715)




[install-php]: http://www.php.net/manual/en/install.php
[install-git]: http://git-scm.com/book/en/Getting-Started-Installing-Git
[composer-phar]: http://getcomposer.org/composer.phar
[msdn-errors]: http://msdn.microsoft.com/library/windowsazure/dd179438.aspx

[msdn-table-query-syntax]: http://msdn.microsoft.com/library/windowsazure/dd894031.aspx
[ws-storage-app]: ./media/web-sites-php-storage/ws-storage-app.png
[management-portal]: https://portal.azure.com

[storage-quick-create]: ./media/web-sites-php-storage/createstorage.png
[storage-access-keys]: ./media/web-sites-php-storage/keydetails.png

[setup-git-publishing]: ./media/web-sites-php-storage/setup_git_publishing.png
[credentials]: ./media/web-sites-php-storage/git-deployment-credentials.png

[git-instructions]: ./media/web-sites-php-storage/git-instructions.png
