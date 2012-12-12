<properties linkid="develop-php-website-with-sql-database-and-git" urlDisplayName="Web w/ SQL + Git" pageTitle="PHP web site with SQL Database and Git - Windows Azure tutorial" metaKeywords="" metaDescription="A tutorial that demonstrates how to create a PHP web site that stores data in SQL Database and use Git deployment to Windows Azure." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />

<div chunk="../chunks/article-left-menu.md" />

#Create a PHP website with a SQL Database and deploy using Git

This tutorial shows you how to create a PHP Windows Azure Website with a Windows Azure SQL Database and how to deploy it using Git. This tutorial assumes you have [PHP][install-php], [SQL Server Express][install-SQLExpress], the [Microsoft Drivers for SQL Server for PHP][install-drivers], a web server, and [Git][install-git] installed on your computer. Upon completing this guide, you will have a PHP-SQL Database website running in Windows Azure.

<div class="dev-callout"> 
<b>Note</b> 
<p>You can install and configure PHP, SQL Server Express, the Microsoft Drivers for SQL Server for PHP, and Internet Information Services (IIS) using the <a href="http://www.microsoft.com/web/downloads/platform.aspx">Microsoft Web Platform Installer</a>.</p> 
</div>


You will learn:

* How to create a Windows Azure Website and a SQL Database using the Preview Management Portal. Because PHP is enabled in Windows Azure Websites by default, nothing special is required to run your PHP code.
* How to publish and re-publish your application to Windows Azure using Git.
 
By following this tutorial, you will build a simple registration web application in PHP. The application will be hosted in a Windows Azure Website. A screenshot of the completed application is below:

![Windows Azure PHP Website][running-app]

<div chunk="../../Shared/Chunks/create-account-and-websites-note.md" />

##Create a Windows Azure Website and set up Git publishing

Follow these steps to create a Windows Azure Website and a SQL Database:

1. Login to the [Preview Management Portal][preview-portal].
2. Click the **+ New** icon on the bottom left of the portal.

	![Create New Windows Azure Website][new-website]

3. Click **WEB SITE**, then **CREATE WITH DATABASE**.

	![Custom Create a new Website][custom-create]

	Enter a value for **URL**, select **Create a New SQL Database** from the **DATABASE** dropdown,  and select the data center for your website in the **REGION** dropdown. Click the arrow at the bottom of the dialog.

	![Fill in Website details][website-details-sqlazure]

4. Enter a value for the **NAME** of your database, select the **EDITION** [(WEB or BUSINESS)][sql-database-editions], select the **MAX SIZE** for your database, choose the **COLLATION**, and select **NEW SQL Database server**. Click the arrow at the bottom of the dialog.

	![Fill in SQL Database settings][database-settings]

5. Enter an administrator name and password (and confirm the password), choose the region in which your new SQL Database server will be created, and check the `Allow Windows Azure Services to access the server` box.

	![Create new SQL Database server][create-server]

	When the website has been created you will see the text **Creation of Web Site ‘[SITENAME]’ completed successfully**. Now, you can enable Git publishing.

6. Click the name of the website displayed in the list of websites to open the website’s Quick Start dashboard.

	![Open website dashboard][go-to-dashboard]


7. At the bottom of the Quick Start page, click **Set up Git publishing**. 

	![Set up Git publishing][setup-git-publishing]

8. To enable Git publishing, you must provide a user name and password. Make a note of the user name and password you create. (If you have set up a Git repository before, this step will be skipped.)

	![Create publishing credentials][credentials]

	It will take a few seconds to set up your repository.

	![Creating Git repository][creating-repo]

9. When your repository is ready, you will see instructions for pushing your application files to the repository. Make note of these instructions - they will be needed later.

	![Git instructions][git-instructions]

##Get SQL Database connection information

To connect to the SQL Database instance that is running in Windows Azure Websites, your will need the connection information. To get SQL Database connection information, follow these steps:

1. From the Preview Management Portal, click **LINKED RESOURCES**, then click the database name.

	![Linked Resources][linked-resources]

2. Click **View connection strings**.

	![Connection string][connection-string]
	
3. From the **PHP** section of the resulting dialog, make note of the values for `SERVER`, `DATABASE`, and `USERNAME`.

##Build and test your application locally

The Registration application is a simple PHP application that allows you to register for an event by providing your name and email address. Information about previous registrants is displayed in a table. Registration information is stored in a SQL Database instance. The application consists of two files (copy/paste code available below):

* **index.php**: Displays a form for registration and a table containing registrant information.
* **createtable.php**: Creates the SQL Database table for the application. This file will only be used once.

To run the application locally, follow the steps below. Note that these steps assume you have PHP, SQL Server Express, and a web server set up on your local machine, and that you have enabled the [PDO extension for SQL Server][pdo-sqlsrv].

1. Create a SQL Server database called `registration`. You can do this from the `sqlcmd` command prompt with these commands:

		>sqlcmd -S localhost\sqlexpress -U <local user name> -P <local password>
		1> create database registration
		2> GO	


2. In your web server's root directory, create a folder called `registration` and create two files in it - one called `createtable.php` and one called `index.php`.

3. Open the `createtable.php` file in a text editor or IDE and add the code below. This code will be used to create the `registration_tbl` table in the `registration` database.

		<?php
		// DB connection info
		$host = "localhost\sqlexpress";
		$user = "user name";
		$pwd = "password";
		$db = "registration";
		try{
			$conn = new PDO( "sqlsrv:Server= $host ; Database = $db ", $user, $pwd);
			$conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
			$sql = "CREATE TABLE registration_tbl(
			id INT NOT NULL IDENTITY(1,1) 
			PRIMARY KEY(id),
			name VARCHAR(30),
			email VARCHAR(30),
			date DATE)";
			$conn->query($sql);
		}
		catch(Exception $e){
			die(print_r($e));
		}
		echo "<h3>Table created.</h3>";
		?>

	<div class="dev-callout"> 
	<b>Note</b> 
	<p>You will need to update the values for <code>$user</code> and <code>$pwd</code> with your local SQL Server user name and password.</p> 
	</div>

4. Open a web browser and browse to [http://localhost/registration/createtable.php][localhost-createtable]. This will create the `registration_tbl` table in the database.

5. Open the **index.php** file in a text editor or IDE and add the basic HTML and CSS code for the page (the PHP code will be added in later steps).

		<html>
		<head>
		<Title>Registration Form</Title>
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
		<h1>Register here!</h1>
		<p>Fill in your name and email address, then click <strong>Submit</strong> to register.</p>
		<form method="post" action="index.php" enctype="multipart/form-data" >
		      Name  <input type="text" name="name" id="name"/></br>
		      Email <input type="text" name="email" id="email"/></br>
		      <input type="submit" name="submit" value="Submit" />
		</form>
		<?php

		?>
		</body>
		</html>

6. Within the PHP tags, add PHP code for connecting to the database.

		// DB connection info
		$host = "localhost\sqlexpress";
		$user = "user name";
		$pwd = "password";
		$db = "registration";
		// Connect to database.
		try {
			$conn = new PDO( "sqlsrv:Server= $host ; Database = $db ", $user, $pwd);
			$conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
		}
		catch(Exception $e){
			die(var_dump($e));
		}

	<div class="dev-callout"> 
	<b>Note</b> 
	<p>Again, you will need to update the values for <code>$user</code> and <code>$pwd</code> with your local MySQL user name and password.</p> 
	</div>

7. Following the database connection code, add code for inserting registration information into the database.

		if(!empty($_POST)) {
		try {
			$name = $_POST['name'];
			$email = $_POST['email'];
			$date = date("Y-m-d");
			// Insert data
			$sql_insert = "INSERT INTO registration_tbl (name, email, date) 
						   VALUES (?,?,?)";
			$stmt = $conn->prepare($sql_insert);
			$stmt->bindValue(1, $name);
			$stmt->bindValue(2, $email);
			$stmt->bindValue(3, $date);
			$stmt->execute();
		}
		catch(Exception $e) {
			die(var_dump($e));
		}
		echo "<h3>Your're registered!</h3>";
		}

8. Finally, following the code above, add code for retrieving data from the database.

		$sql_select = "SELECT * FROM registration_tbl";
		$stmt = $conn->query($sql_select);
		$registrants = $stmt->fetchAll(); 
		if(count($registrants) > 0) {
			echo "<h2>People who are registered:</h2>";
			echo "<table>";
			echo "<tr><th>Name</th>";
			echo "<th>Email</th>";
			echo "<th>Date</th></tr>";
			foreach($registrants as $registrant) {
				echo "<tr><td>".$registrant['name']."</td>";
				echo "<td>".$registrant['email']."</td>";
				echo "<td>".$registrant['date']."</td></tr>";
		    }
		 	echo "</table>";
		} else {
			echo "<h3>No one is currently registered.</h3>";
		}

You can now browse to [http://localhost/registration/index.php][localhost-index] to test the application.

##Publish your application

After you have tested your application locally, you can publish it to your Windows Azure Website using Git. However, you first need to update the database connection information in the application. Using the database connection information you obtained earlier (in the **Get SQL Database connection information** section), update the following information in **both** the `createdatabase.php` and `index.php` files with the appropriate values:

	// DB connection info
	$host = "tcp:<value of SERVER>";
	$user = "<value of USERNAME>@<server ID>";
	$pwd = "<your password>";
	$db = "<value of DATABASE>";

<div class="dev-callout">
<b>Note</b>
<p>In the <code>$host</code>, the value of SERVER must be prepended with <code>tcp:</code>, and the value of <code>$user</code> is the concatenation of the value of USERNAME, '@', and your server ID. Your server ID is the first 10 characters of the value of SERVER.</p>
</div>

Now, you are ready to set up Git publishing and publish the application.

<div class="dev-callout">
<b>Note</b>
<p>These are the same steps noted at the end of the Create a Windows Azure Website and Set up Git Publishing section above.</p>
</div>

1. Open GitBash (or a terminal, if Git is in your `PATH`), change directories to the root directory of your application, and run the following commands:

		git init
		git add .
		git commit -m "initial commit"
		git remote add azure [URL for remote repository]
		git push azure master

	You will be prompted for the password you created earlier.

2. Browse to **http://[site name].azurewebsites.net/createtable.php** to create the MySQL table for the application.
3. Browse to **http://[site name].azurewebsites.net/index.php** to begin using the application.

After you have published your application, you can begin making changes to it and use Git to publish them. 

##Publish changes to your application

To publish changes to application, follow these steps:

1. Make changes to your application locally.
2. Open GitBash (or a terminal, it Git is in your `PATH`), change directories to the root directory of your application, and run the following commands:

		git add .
		git commit -m "comment describing changes"
		git push azure master

	You will be prompted for the password you created earlier.

3. Browse to **http://[site name].azurewebsites.net/index.php** to see your changes.

[install-php]: http://www.php.net/manual/en/install.php
[install-SQLExpress]: http://www.microsoft.com/en-us/download/details.aspx?id=29062
[install-Drivers]: http://www.microsoft.com/en-us/download/details.aspx?id=20098
[install-git]: http://git-scm.com/
[wpi]: http://www.microsoft.com/web/downloads/platform.aspx
[pdo-sqlsrv]: http://php.net/pdo_sqlsrv
[tasklist-sqlazure-download]: http://go.microsoft.com/fwlink/?LinkId=252504
[localhost-createtable]: http://localhost/tasklist/createtable.php
[localhost-index]: http://localhost/tasklist/index.php
[running-app]: ../Media/running_app_3.png
[new-website]: ../../Shared/Media/new_website.jpg
[custom-create]: ../../Shared/Media/custom_create.jpg
[website-details-sqlazure]: ../Media/website_details_sqlazure.jpg
[database-settings]: ../Media/database_settings.jpg
[create-server]: ../Media/create_server.jpg
[go-to-dashboard]: ../../Shared/Media/go_to_dashboard.png
[setup-git-publishing]: ../../Shared/Media/setup_git_publishing.png
[credentials]: ../Media/credentials.jpg
[creating-repo]: ../Media/creating_repo.jpg
[push-files]: ../Media/push_files.jpg
[git-instructions]: ../../Shared/Media/git_instructions.png
[linked-resources]: ../Media/linked_resources.jpg
[connection-string]: ../Media/connection_string.jpg
[preview-portal]: https://manage.windowsazure.com/
[sql-database-editions]: http://msdn.microsoft.com/en-us/library/windowsazure/ee621788.aspx