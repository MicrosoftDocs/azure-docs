<properties umbracoNaviHide="0" pageTitle="Create a PHP-MySQL Windows Azure Website and Deploy Using Git" metaKeywords="Windows Azure, Windows Azure Websites, PHP, MySQL, Git" metaDescription="Learn how to create a PHP-MySQL website in Windows Azure, and deploy to it using Git." linkid="dev-php-tutorials-php-mysql-site-git" urlDisplayName="Create a PHP-MySQL Windows Azure Website and Deploy Using Git" headerExpose="" footerExpose="" disqusComments="1" />

#Create a PHP-MySQL Windows Azure Website and deploy using Git

This tutorial shows you how to create a PHP-MySQL Windows Azure Website and how to deploy it using Git. This tutorial assumes you have [PHP][install-php], [MySQL][install-mysql], a web server, and [Git][install-git] installed on your computer. The instructions in this tutorial can be followed on any operating system, including Windows, Mac, and  Linux. Upon completing this guide, you will have a PHP/MySQL website running in Windows Azure.
 
You will learn:

* How to create a Windows Azure Website and a MySQL database using the Preview Management Portal. Because PHP is enabled in Windows Azure Websites by default, nothing special is required to run your PHP code.
* How to publish and re-publish your application to Windows Azure using Git.
 
By following this tutorial, you will build a simple registration web application in PHP. The application will be hosted in a Windows Azure Website. A screenshot of the completed application is below: (**TODO: Update screenshot**)

![Windows Azure PHP Website][running-app]

##Create a Windows Azure Website and set up Git publishing

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

	When the website has been created you will see the text **Creation of Web Site ‘[SITENAME]’ completed successfully**. Now, you can enable Git publishing.

5. Click the name of the website displayed in the list of websites to open the website’s **QUICKSTART** dashboard.

	![Open website dashboard][go-to-dashboard]


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

##Get MySQL connection information

To connect to the MySQL database that is running in Windows Azure Websites, your will need the connection information. To get MySQL connection information, follow these steps:

<div class="dev-callout"> 
<b>Note</b> 
<p>These steps are only necessary in the Windows Azure Preview.</p> 
</div>


1. From your website's dashboard, click the **Download publish profile** link at the bottom right corner of the page:

	![Download publish profile][download-publish-profile]

2. Open the `.publishsettings` file in an XML editor. The `<databases>` element will look similar to this:

		<databases>
			<add name="tasklist" 
				connectionString="Database=tasklist;Data Source=us-mm-azure-ord-01.cleardb.com;User Id=e02c62383bffdd;Password=0fc50b7e" 
				providerName="MySql.Data.MySqlClient" 
				type="MySql"/>
		</databases>
	
3. Make note of the `connectionString` attribute in the `<add>` element, in particular the values for `Database`, `Data Source`, `User Id`, and `Password`.

##Build and test your application locally

The Registration application is a simple PHP application that allows you to register for an event by providing your name and email address. Information about previous registrants is displayed in a table. Registration information is stored in a MySQL database. The application consists of two files:

* **index.php**: Displays a form for registration and a table containing registrant information.
* **createtable.php**: Creates the MySQL table for the application. This file will only be used once.

To build and run the application locally, follow the steps below. Note that these steps assume you have PHP, MySQL, and a web server set up on your local machine, and that you have enabled the [PDO extension for MySQL][pdo-mysql].

1. Create a MySQL database called `registration`. You can do this from the MySQL command prompt with this command:

		mysql> create database registration;

2. In your web server's root directory, create a folder called `registration` and create two files in it - one called `createtable.php` and one called `index.php`.

3. Open the `createtable.php` file in a text editor or IDE and add the code below. This code will be used to create the `registration_tbl` table in the `registration` database.

		<?php
		// DB connection info
		$host = "localhost";
		$user = "user name";
		$pwd = "password";
		$db = "registration";
		try{
			$conn = new PDO( "mysql:host=$host;dbname=$db", $user, $pwd);
			$conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
			$sql = "CREATE TABLE registration_tbl(
						id INT NOT NULL AUTO_INCREMENT, 
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
	<p>You will need to update the values for <code>$user</code> and <code>$pwd</code> with your local MySQL user name and password.</p> 
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
			th { font-size: 1.2em; text-align: left; border: none 0px; padding-left: 0; }
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
		$host = "localhost";
		$user = "user name";
		$pwd = "password";
		$db = "registration";
		// Connect to database.
		try {
			$conn = new PDO( "mysql:host=$host;dbname=$db", $user, $pwd);
			$conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
		}
		catch(Exception $e){
			die(var_dump($e));
		}

	<div class="dev-callout"> 
	<b>Note</b> 
	<p>Again, you will need to update the values for <code>$user</code> and <code>$pwd</code> with your local MySQL user name and password.</p> 
	</div>

7. Following the database connection code, add code for adding registration information to the database.

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

After you have tested your application locally, you can publish it to your Windows Azure Website using Git. However, you first need to update the database connection information in the application. Using the database connection information you obtained earlier (in the **Get MySQL connection information** section), update the following information in **both** the `createdatabase.php` and `index.php` files with the appropriate values:

	// DB connection info
	$host = "value of Data Source";
	$user = "value of User Id";
	$pwd = "value of Password";
	$db = "value of Database";

Now, you are ready to set up Git publishing and publish the application.

<div class="dev-callout">
<b>Note</b>
<p>These are the same steps noted at the end of the <b>Create a Windows Azure Website and Set up Git Publishing</b> section.</p>
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
[install-mysql]: http://dev.mysql.com/doc/refman/5.6/en/installing.html
[install-git]: http://git-scm.com/
[pdo-mysql]: http://www.php.net/manual/en/ref.pdo-mysql.php
[localhost-createtable]: http://localhost/registration/createtable.php
[localhost-index]: http://localhost/registration/index.php
[running-app]: ../Media/running_app.jpg
[new-website]: ../../Shared/Media/new_website.jpg
[custom-create]: ../../Shared/Media/custom_create.jpg
[website-details]: ../../Shared/Media/website_details.jpg
[new-mysql-db]: ../../Shared/Media/new_mysql_db.jpg
[go-to-dashboard]: ../../Shared/Media/go_to_dashboard.jpg
[setup-git-publishing]: ../Media/setup_git_publishing.jpg
[credentials]: ../Media/credentials.jpg
[creating-repo]: ../Media/creating_repo.jpg
[push-files]: ../Media/push_files.jpg
[git-instructions]: ../Media/git_instructions.jpg
[download-publish-profile]: ../../Shared/Media/download_publish_profile.jpg
[preview-portal]: https://manage.windowsazure.com