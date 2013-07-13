<properties linkid="develop-php-website-with-mysql-and-ftp" urlDisplayName="Web w/ MySQL + FTP" pageTitle="PHP web site with MySQL and FTP - Windows Azure tutorial" metaKeywords="" metaDescription="A tutorial that demonstrates how to create a PHP web site that stores data in MySQL and use FTP deployment to Windows Azure." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu.md" />

#Create a PHP-MySQL Windows Azure Web Site and Deploy Using FTP

This tutorial shows you how to create a PHP-MySQL Windows Azure Web Site and how to deploy it using FTP. This tutorial assumes you have [PHP][install-php], [MySQL][install-mysql], a web server, and an FTP client installed on your computer. The instructions in this tutorial can be followed on any operating system, including Windows, Mac, and  Linux. Upon completing this guide, you will have a PHP/MySQL web site running in Windows Azure.
 
You will learn:

* How to create a Windows Azure Web Site and a MySQL database using the Windows Azure Management Portal. Because PHP is enabled in Windows Azure Web Sites by default, nothing special is required to run your PHP code.
* How to publish your application to Windows Azure using FTP.
 
By following this tutorial, you will build a simple registration web application in PHP. The application will be hosted in a Windows Azure Web Site. A screenshot of the completed application is below:

![Windows Azure PHP Web Site][running-app]

<div chunk="../../Shared/Chunks/create-account-and-websites-note.md" />

##Create a Windows Azure Web Site and set up FTP publishing

Follow these steps to create a Windows Azure Web Site and a MySQL database:

1. Login to the [Windows Azure Management Portal][management-portal].
2. Click the **+ New** icon on the bottom left of the portal.

	![Create New Windows Azure Web Site][new-website]

3. Click **WEB SITE**, then **CUSTOM CREATE**.

	![Custom Create a new Web Site][custom-create]
	
	Enter a value for **URL**, select **Create a New MySQL Database** from the **DATABASE** dropdown,  and select the data center for your web site in the **REGION** dropdown. Click the arrow at the bottom of the dialog.

	![Fill in Web Site details][website-details]

4. Enter a value for the **NAME** of your database, select the data center for your database in the **REGION** dropdown, and check the box that indicates you agree with the legal terms. Click the checkmark at the bottom of the dialog.

	![Create new MySQL database][new-mysql-db]

	When the web site has been created you will see the text **Creation of Web Site ‘[SITENAME]’ completed successfully**. Now, you can enable FTP publishing.

5. Click the name of the web site displayed in the list of web sites to open the web site’s **QUICKSTART** dashboard.

	![Open web site dashboard][go-to-dashboard]


6. At the bottom of the **QUICKSTART** page, click **Reset deployment credentials**. 

	![Reset deployment credentials][reset-deployment-credentials]

7. To enable FTP publishing, you must provide a user name and password. Make a note of the user name and password you create.

	![Create publishing credentials][portal-git-username-password]

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

##Get MySQL and FTP connection information

To connect to the MySQL database that is running in Windows Azure Web Sites, your will need the connection information. To get MySQL connection information, follow these steps:

1. From your web site's dashboard, click the **View connection strings** link on the right side of the page:

	![Get database connection information][connection-string-info]
	
2. Make note of the values for `Database`, `Data Source`, `User Id`, and `Password`.

3. From your web site's dashboard, click the **Download publish profile** link at the bottom right corner of the page:

	![Download publish profile][download-publish-profile]

4. Open the `.publishsettings` file in an XML editor. 

3. Find the `<publishProfile >` element with `publishMethod="FTP"` that looks similar to this:

		<publishProfile publishMethod="FTP" publishUrl="ftp://[mysite].azurewebsites.net/site/wwwroot" ftpPassiveMode="True" userName="[username]" userPWD="[password]" destinationAppUrl="http://[name].antdf0.antares-test.windows-int.net" 
			...
		</publishProfile>
	
Make note of the `publishUrl`, `userName`, and `userPWD` attributes.

##Publish Your Application

After you have tested your application locally, you can publish it to your Windows Azure Web Site using FTP. However, you first need to update the database connection information in the application. Using the database connection information you obtained earlier (in the **Get MySQL and FTP connection information** section), update the following information in **both** the `createdatabase.php` and `index.php` files with the appropriate values:

	// DB connection info
	$host = "value of Data Source";
	$user = "value of User Id";
	$pwd = "value of Password";
	$db = "value of Database";

Now you are ready to publish your application using FTP.

1. Open your FTP client of choice.

2. Enter the *host name portion* from the `publishUrl` attribute you noted above into your FTP client.

3. Enter the `userName` and `userPWD` attributes you noted above unchanged into your FTP client.

4. Establish a connection.

After you have connected you will be able to upload and download files as needed. Be sure that you are uploading files to the root directory, which is `/site/wwwroot`.

After uploading both `index.php` and `createtable.php`, browse to **http://[site name].azurewebsites.net/createtable.php** to create the MySQL table for the application, then browse to **http://[site name].azurewebsites.net/index.php** to begin using the application.
 

[install-php]: http://www.php.net/manual/en/install.php
[install-mysql]: http://dev.mysql.com/doc/refman/5.6/en/installing.html
[pdo-mysql]: http://www.php.net/manual/en/ref.pdo-mysql.php
[localhost-createtable]: http://localhost/tasklist/createtable.php
[localhost-index]: http://localhost/tasklist/index.php
[running-app]: ../Media/running_app_2.png
[new-website]: ../../Shared/Media/new_website.jpg
[custom-create]: ../../Shared/Media/custom_create.png
[website-details]: ../../Shared/Media/website_details.jpg
[new-mysql-db]: ../../Shared/Media/new_mysql_db.jpg
[go-to-dashboard]: ../../Shared/Media/go_to_dashboard.png
[reset-deployment-credentials]: ../Media/reset-deployment-credentials.png
[portal-git-username-password]: ../../Shared/Media/git-deployment-credentials.png
[creating-repo]: ../Media/creating_repo.jpg
[push-files]: ../Media/push_files.jpg
[connection-string-info]: ../../Shared/Media/connection_string_info.png
[management-portal]: https://manage.windowsazure.com
[download-publish-profile]: ../../Shared/Media/download_publish_profile_2.png