<properties umbracoNaviHide="0" pageTitle="Create a PHP Website with a SQL Database and Deploy Using Git" metaKeywords="Windows Azure, Windows Azure Websites, SQL Database, PHP, Git, Git deploy" metaDescription="Learn how to create a Windows Azure PHP website with a SQL Database and deploy to it using Git." linkid="dev-php-tutorials-php-site-sql-database-git" urlDisplayName="Create a PHP Website with a SQL Database and Deploy Using Git" headerExpose="" footerExpose="" disqusComments="1" />

#Create a PHP Website with a SQL Database and Deploy Using Git

This tutorial shows you how to create a PHP Windows Azure Website with a Windows Azure SQL Database and how to deploy it using Git. This tutorial assumes you have [PHP][install-php], [SQL Server Express][install-SQLExpress], the [Microsoft Drivers for SQL Server for PHP][install-drivers], a web server, and [Git][install-git] installed on your computer. Upon completing this guide, you will have a PHP-SQL Database website running in Windows Azure.

**Note**: You can install and configure PHP, SQL Server Express, the Microsoft Drivers for SQL Server for PHP, and Internet Information Services (IIS) using the [Microsoft Web Platform Installer][wpi].
 
You will learn:

* How to create a Windows Azure Website and a SQL Database using the Preview Management Portal. Because PHP is enabled in Windows Azure Websites by default, nothing special is required to run your PHP code.
* How to publish and re-publish your application to Windows Azure using Git.
 
By following this tutorial, you will build a simple Tasklist web application in PHP. The application will be hosted in a Windows Azure Website. A screenshot of the completed application is below:

![Windows Azure PHP Website][running-app]

##Build and Test Your Application Locally

The Tasklist application is a simple PHP application that allows you to add, mark complete, and delete items from a task list. For testing purposes, task list items are stored locally in a SQL Server Express database. The application consists of these files:

* **index.php**: Displays tasks and provides a form for adding an item to the list.
* **additem.php**: Adds an item to the list.
* **getitems.php**: Gets all items in the database.
* **markitemcomplete.php**: Changes the status of an item to complete.
* **deleteitem.php**: Deletes an item.
* **taskmodel.php**: Contains functions that add, get, update, and delete items from the database.
* **createtable.php**: Creates the SQL Database table for the application. This file will only be called once.

To run the application locally, follow the steps below. Note that these steps assume you have PHP, SQL Server Express, and a web server set up on your local machine, and that you have enabled the [PDO extension for SQL Server][pdo-sqlsrv].

1. Download the application files from Github here: [http://go.microsoft.com/fwlink/?LinkId=252504][tasklist-sqlazure-download]. Put the files in a folder called `tasklist` in your web server's root directory.
2. Create a SQL Server database called `tasklist`. You can do this from the `sqlcmd` command prompt with these commands:

		>sqlcmd -S <server name>\sqlexpress -U <user name> -P <password>
		1> create database tasklist
		2> GO	


3. Open the **taskmodel.php** file in a text editor or IDE and provide the database connection information by providing values for `$host`, `$user`, `$pwd`, and `$db` variables in the `connect` function:

		// DB connection info
		$host = ".\sqlexpress";
		$user = "your_mssql_user_name";
		$pwd = "mssql_user_password";
		$db = "tasklist";

4. Open a web browser and browse to [http://localhost/tasklist/createtable.php][localhost-createtable]. This will create the `items` table that stores task list work items.

5. Browse to [http://localhost/tasklist/index.php][localhost-index] and begin adding items, marking them complete, and deleting them.

After you have run the application locally, you are ready to create a Windows Azure Website and publish your code using Git.

##Create a Windows Azure Website and Set up Git Publishing

Follow these steps to create a Windows Azure Website and a SQL Database:

1. Login to the [Preview Management Portal][preview-portal].
2. Click the **+ New** icon on the bottom left of the portal.

	![Create New Windows Azure Website][new-website]

3. Click **Web Site**, then **Custom Create**.

	![Custom Create a new Website][custom-create]

	Enter a value for **URL**, select **Create a New SQL Database** from the **DATABASE** dropdown,  and select the data center for your website in the **REGION** dropdown. Click the arrow at the bottom of the dialog.

	![Fill in Website details][website-details-sqlazure]

4. Enter a value for the **NAME** of your database, select the **EDITION** [(WEB or BUSINESS)][sql-database-editions], select the **MAX SIZE** for your database, choose the **COLLATION**, and select **NEW SQL Azure server**. Click the arrow at the bottom of the dialog.

	![Fill in SQL Database settings][database-settings]

5. Enter an administrator name and password (and confirm the password), choose the region in which your new SQL Database server will be created, and check the `Allow Windows Azure Services to access this server` box.

	![Create new SQL Database server][create-server]

	When the website has been created you will see the text **Creation of Web Site ‘[SITENAME]’ completed successfully**. Now, you can enable Git publishing.

5. Click the name of the website displayed in the list of websites to open the website’s Quick Start dashboard.

	![Open website dashboard][go-to-dashboard]


6. At the bottom of the Quick Start page, click **Set up Git publishing**. 

	![Set up Git publishing][setup-git-publishing]

7. To enable Git publishing, you must provide a user name and password. Make a note of the user name and password you create. (If you have set up a Git repository before, this step will be skipped.)

	![Create publishing credentials][credentials]

	It will take a few seconds to set up your repository.

	![Creating Git repository][creating-repo]

8. When your repository is ready, click **Push my local files to Windows Azure**.

	![Get Git instructions for pushing files][push-files]

	Make note of the instructions on the resulting page - they will be needed later.

	![Git instructions][git-instructions]

##Get SQL Database Connection Information

Before publishing the Tasklist application, the database connection information (in the **taskmodel.php** file) must be updated. To get SQL Database connection information, follow these steps:

1. From the Preview Management Portal, click **LINKED RESOURCES**.

	![Linked Resources][linked-resources]

2. Click **Connection String**.

	![Connection string][connection-string]
	
3. From the **PHP** section of the resulting dialog, make note of the values for `UID`, `PWD`, `Database`, and `$serverName`.

4. Open the **taskmodel.php** file in a text editor or IDE and update the database connection information in the `connect` function by copying the appropriate values from the previous step:

		// DB connection info
		$host = "value of $serverName";
		$user = "value of UID";
		$pwd = "the SQL password you created earlier";
		$db = "value of Database";

##Publish Your Application

To publish your application with Git, follow the steps below:

<div class="dev-callout">
<b>Note</b>
<p>These are the same steps noted at the end of the <b>Create a Windows Azure Website and Set up Git Publishing</b> section.</p>
</div>

1. Open GitBash (or a terminal, if Git is in your `PATH`), and run the following commands:

		git init
		git add .
		git commit -m "initial commit"
		git remote add azure [URL for remote repository]
		git push azure master

	You will be prompted for the password you created earlier.

2. Browse to **http://[your website domain]/createtable.php** to create the SQL Database table for the application.
3. Browse to **http://[your website domain/index.php** to begin using the application. 

##Publish Changes to Your Application

To publish changes to application, follow these steps:

1. Make changes to your application locally.
2. Open GitBash (or a terminal, it Git is in your `PATH`), change directories to the root directory of your application, and run the following commands:

		git add .
		git commit -m "comment describing changes"
		git push azure master

	You will be prompted for the password you created earlier.

3. Browse to **http://[your website domain]/index.php** to see your changes.


[install-php]: http://www.php.net/manual/en/install.php
[install-SQLExpress]: http://www.microsoft.com/en-us/download/details.aspx?id=29062
[install-Drivers]: http://www.microsoft.com/en-us/download/details.aspx?id=20098
[install-git]: http://git-scm.com/
[wpi]: http://www.microsoft.com/web/downloads/platform.aspx
[pdo-sqlsrv]: http://php.net/pdo_sqlsrv
[tasklist-sqlazure-download]: http://go.microsoft.com/fwlink/?LinkId=252504
[localhost-createtable]: http://localhost/tasklist/createtable.php
[localhost-index]: http://localhost/tasklist/index.php
[running-app]: ../Media/running_app.jpg
[new-website]: ../../Shared/Media/new_website.jpg
[custom-create]: ../../Shared/Media/custom_create.jpg
[website-details-sqlazure]: ../Media/website_details_sqlazure.jpg
[database-settings]: ../Media/database_settings.jpg
[create-server]: ../Media/create_server.jpg
[go-to-dashboard]: ../../Shared/Media/go_to_dashboard.jpg
[setup-git-publishing]: ../Media/setup_git_publishing.jpg
[credentials]: ../Media/credentials.jpg
[creating-repo]: ../Media/creating_repo.jpg
[push-files]: ../Media/push_files.jpg
[git-instructions]: ../Media/git_instructions.jpg
[linked-resources]: ../Media/linked_resources.jpg
[connection-string]: ../Media/connection_string.jpg
[preview-portal]: https://manage.windowsazure.com/
[sql-database-editions]: http://msdn.microsoft.com/en-us/library/windowsazure/ee621788.aspx