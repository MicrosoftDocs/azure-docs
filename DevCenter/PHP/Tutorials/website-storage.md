<properties linkid="develop-php-website-with-storage" urlDisplayName="Web w/ Storage" pageTitle="PHP web site with table storage - Windows Azure tutorial" metaKeywords="Azure table storage PHP, Azure PHP web site, Azure PHP web site, Azure PHP tutorial, Azure PHP example" metaDescription="This tutorial shows you how to create a PHP web site and use the Windows Azure Tables storage service in the back-end." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu.md" />

#Create a PHP web site using Windows Azure Storage

This tutorial shows you how to create a PHP web site and use the Windows Azure Tables storage service in the back-end. This tutorial assumes you have [PHP][install-php] and a web server installed on your computer. The instructions in this tutorial can be followed on any operating system, including Windows, Mac, and  Linux. Upon completing this guide, you will have a PHP web site running in Windows Azure and accessing the Table storage service.
 
You will learn:

* How to install the Windows Azure client libraries and include them into your application.
* How to use the client libraries for creating tables, and for creating, querying and deleting table entities.
* How to create a Windows Azure Storage Account and set up your application to use it.
* How to create a Windows Azure web site and deploy to it using Git
 
You will build a simple Tasklist web application in PHP. A screenshot of the completed application is below:

![Windows Azure PHP web site][ws-storage-app]

<div chunk="../../Shared/Chunks/create-account-and-websites-note.md" />

##Installing the Windows Azure client libraries

To install the PHP Client Libraries for Windows Azure via Composer, follow these steps:

1. [Install Git][install-git]. 

	<div class="dev-callout"> 
	<b>Note</b> 
	<p>On Windows, you will also need to add the Git executable to your PATH environment variable.</p>
	</div>

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

There are four basic steps that have to be performed before you can make a call to a Windows Azure API wen using the libraries. You will create an initialization script that will perform these steps.

* Create a file called **init.php**.

* First, include the autoloader script:

		require_once 'vendor\autoload.php'; 
	
* Include the namespaces you are going to use.

	To create any Windows Azure service client you need to use the **ServicesBuilder** class:

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

	Error codes and message scan be found here: [http://msdn.microsoft.com/en-us/library/windowsazure/dd179438.aspx][msdn-errors]


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


## Create a Windows Azure Storage Account

To make your application store data into the cloud you need to first create a storage account in Windows Azure and then pass the proper authentication information to the *Configuration* class.

1. Login to the [Preview Management Portal][preview-portal].

2. Click the **+ New** icon on the bottom left of the portal.

	![Create New Windows Azure web site][new-website]

3. Click **Storage**, then **Quick Create**.

	![Custom Create a new web site][storage-quick-create]
	
	Enter a value for **URL** and select the data center for your web site in the **REGION** dropdown. Click the **Create Storage Account** button at the bottom of the dialog.

	![Fill in web site details][storage-quick-create-details]

	When the storage account has been created you will see the text **Creation of Storage Account ‘[NAME]’ completed successfully**.

4. Ensure the **Storage** tab is selected and then select the storage account you just created from the list.

5. Click on **Manage Keys** from the app bar on the bottom.

	![Select Manage Keys][storage-manage-keys]

6. Take note of the name of the storage account you created and of the primary key.

	![Select Manage Keys][storage-access-keys]

7. Open **init.php** and replace `[YOUR_STORAGE_ACCOUNT_NAME]` and `[YOUR_STORAGE_ACCOUNT_KEY]` with the account name and key you took note of in the last step. Save the file.


## Create a Windows Azure Web Site and Set up Git Publishing

Follow these steps to create a Windows Azure web site:

1. Login to the [Preview Management Portal][preview-portal].
2. Click the **+ New** icon on the bottom left of the portal.

	![Create New Windows Azure Web Site][new-website]

3. Click **Web Site**, then **Quick Create**.

	![Custom Create a new web site][website-quick-create]
	
	Enter a value for **URL** and select the data center for your web site in the **REGION** dropdown. Click the **Create New Web Site** button at the bottom of the dialog.

	![Fill in web site details][website-quick-create-details]

	When the web site has been created you will see the text **Creation of Web Site ‘[SITENAME]’ completed successfully**. Now, you can enable Git publishing.

5. Click the name of the web site displayed in the list of web sites to open the web site’s **QUICKSTART** dashboard.

	![Open web site dashboard][go-to-dashboard]


6. At the bottom of the **QUICKSTART** page, click **Set up Git publishing**. 

	![Set up Git publishing][setup-git-publishing]

7. To enable Git publishing, you must provide a user name and password. Make a note of the user name and password you create. (If you have set up a Git repository before, this step will be skipped.)

	![Create publishing credentials][credentials]

	It will take a few seconds to set up your repository.

	![Creating Git repository][creating-repo]

8. When your repository is ready, click **Push my local files to Windows Azure**.

	![Get Git instructions for pushing files][push-files]

	Make note of the instructions on the resulting page - they will be needed later.

	![Git instructions][git-instructions]


##Publish Your Application

To publish your application with Git, follow the steps below.

1. Open the **vendor/microsoft/windowsazure** folder under the root of the application and delete the following files and folders:
	* .git
	* .gitattributes
	* .gitignore
			
	When the Composer package manager downloads the Windows Azure client libraries and their dependencies it does so by cloning the GitHub repository that they reside in. In the next step, the application will be deployed via Git by creating a repository out of the root folder of the application. Git will ignore the sub-repository where the client libraries live unless the repository-specific files are removed.

2. Open GitBash (or a terminal, if Git is in your `PATH`), change directories to the root directory of your application, and run the following commands (**Note:** these are the same steps noted at the end of the **Create a Windows Azure Web Site and Set up Git Publishing** section):

		git init
		git add .
		git commit -m "initial commit"
		git remote add azure [URL for remote repository]
		git push azure master

	You will be prompted for the password you created earlier.

3. Browse to **http://[your web site domain]/createtable.php** to create the table for the application.
4. Browse to **http://[your web site domain]/index.php** to begin using the application.

After you have published your application, you can begin making changes to it and use Git to publish them. 

##Publish Changes to Your Application

To publish changes to application, follow these steps:

1. Make changes to your application locally.
2. Open GitBash (or a terminal, it Git is in your `PATH`), change directories to the root directory of your application, and run the following commands:

		git add .
		git commit -m "comment describing changes"
		git push azure master

	You will be prompted for the password you created earlier.

3. Browse to **http://[your web site domain]/index.php** to see your changes. 

[install-php]: http://www.php.net/manual/en/install.php
[install-pear]: http://pear.php.net/manual/en/installation.getting.php
[install-mysql]: http://dev.mysql.com/doc/refman/5.6/en/installing.html
[install-git]: http://git-scm.com/book/en/Getting-Started-Installing-Git
[composer-phar]: http://getcomposer.org/composer.phar
[pdo-mysql]: http://www.php.net/manual/en/ref.pdo-mysql.php
[msdn-errors]: http://msdn.microsoft.com/en-us/library/windowsazure/dd179438.aspx
[tasklist-mysql-download]: http://go.microsoft.com/fwlink/?LinkId=252506
[localhost-createtable]: http://localhost/tasklist/createtable.php
[localhost-index]: http://localhost/tasklist/index.php
[msdn-table-query-syntax]: http://msdn.microsoft.com/en-us/library/windowsazure/dd894031.aspx
[ws-storage-app]: ../Media/ws-storage-app.png
[preview-portal]: https://manage.windowsazure.com
[new-website]: ../../Shared/Media/new_website.jpg
[download-php-sdk]: /en-us/develop/php/download-php-sdk/
[website-quick-create]: ../../Shared/Media/website-quick-create.png
[website-quick-create-details]: ../../Shared/Media/website-quick-create-details.png
[storage-quick-create]: ../../Shared/Media/storage-quick-create.png
[storage-quick-create-details]: ../../Shared/Media/storage-quick-create-details.png
[storage-manage-keys]: ../../Shared/Media/storage-manage-keys.png
[storage-access-keys]: ../../Shared/Media/storage-access-keys.png
[website-details]: ../../Shared/Media/website_details.jpg
[go-to-dashboard]: ../../Shared/Media/go_to_dashboard.png
[setup-git-publishing]: ../../Shared/Media/setup_git_publishing.png
[credentials]: ../Media/credentials.jpg
[creating-repo]: ../Media/creating_repo.jpg
[push-files]: ../Media/push_files.jpg
[git-instructions]: ../../Shared/Media/git_instructions.png
