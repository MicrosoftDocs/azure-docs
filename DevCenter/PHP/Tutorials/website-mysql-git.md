<properties umbracoNaviHide="0" pageTitle="Create a PHP-MySQL Windows Azure web site and Deploy Using Git" metaKeywords="Windows Azure, Windows Azure Web Sites, PHP, MySQL, Git" metaDescription="Learn how to create a PHP-MySQL web site in Windows Azure, and deploy to it using Git." linkid="dev-php-tutorials-php-mysql-site-git" urlDisplayName="Create a PHP-MySQL Windows Azure web site and deploy using Git" headerExpose="" footerExpose="" disqusComments="1" />

#Create a PHP-MySQL Windows Azure web site and deploy using Git

This tutorial shows you how to create a PHP-MySQL Windows Azure web site and how to deploy it using Git. You will use [PHP][install-php], the MySQL Command-Line Tool (part of [MySQL][install-mysql]), a web server, and [Git][install-git] installed on your computer. The instructions in this tutorial can be followed on any operating system, including Windows, Mac, and  Linux. Upon completing this guide, you will have a PHP/MySQL web site running in Windows Azure.
 
You will learn:

* How to create a Windows Azure web site and a MySQL database using the Preview Management Portal. Because PHP is enabled in Windows Azure Web Sites by default, nothing special is required to run your PHP code.
* How to publish and re-publish your application to Windows Azure using Git.
 
By following this tutorial, you will build a simple registration web application in PHP. The application will be hosted in a Windows Azure web site. A screenshot of the completed application is below:

![Windows Azure PHP web site][running-app]

##Set up the development environment

This tutorial assumes you have [PHP][install-php], the MySQL Command-Line Tool (part of [MySQL][install-mysql]), a web server, and [Git][install-git] installed on your computer.

<div class="dev-callout">
<b>Note</b>
<p>If you are performing this tutorial on Windows, you can set up your machine for PHP and automatically configure IIS (the built-in web server in Windows) by installing the <a href="http://www.microsoft.com/web/handlers/webpi.ashx/getinstaller/azurephpsdk.appids">Windows Azure SDK for PHP</a>.</p>
</div>

### Create a Windows Azure account

<div chunk="../../Shared/Chunks/create-azure-account.md" />

### Enable Windows Azure Web Sites

<div chunk="../../Shared/Chunks/antares-iaas-signup.md" />

##Create a Windows Azure web site and set up Git publishing

Follow these steps to create a Windows Azure web site and a MySQL database:

1. Login to the [Preview Management Portal][preview-portal].
2. Click the **+ New** icon on the bottom left of the portal.

	![Create New Windows Azure web site][new-website]

3. Click **WEB SITE**, then **CREATE WITH DATABASE**.

	![Custom Create a new web site][custom-create]
	
	Enter a value for **URL**, select **Create a New MySQL Database** from the **DATABASE** dropdown,  and select the data center for your web site in the **REGION** dropdown. Click the arrow at the bottom of the dialog.

	![Fill in web site details][website-details]

4. Enter a value for the **NAME** of your database, select the data center for your database in the **REGION** dropdown, and check the box that indicates you agree with the legal terms. Click the checkmark at the bottom of the dialog.

	![Create new MySQL database][new-mysql-db]

	When the web site has been created you will see the text **Creation of Web Site ‘[SITENAME]’ completed successfully**. Now, you can enable Git publishing.

6. Click the name of the web site displayed in the list of web sites to open the web site’s **QUICKSTART** dashboard.

	![Open web site dashboard][go-to-dashboard]


7. At the bottom of the **QUICKSTART** page, click **Set up Git publishing**. 

	![Set up Git publishing][setup-git-publishing]

8. To enable Git publishing, you must provide a user name and password. Make a note of the user name and password you create. (If you have set up a Git repository before, this step will be skipped.)

	![Create publishing credentials][credentials]

	It will take a few seconds to set up your repository.

	![Creating Git repository][creating-repo]

9. When your repository is ready, you will see instructions for pushing your application files to the repository. Make note of these instructions - they will be needed later.

	![Git instructions][git-instructions]

##Get remote MySQL connection information

To connect to the MySQL database that is running in Windows Azure Web Sites, your will need the connection information. To get MySQL connection information, follow these steps:

1. From your web site's dashboard, click the **View connection strings** link on the right side of the page:

	![Get database connection information][connection-string-info]
	
2. Make note of the values for `Database`, `Data Source`, `User Id`, and `Password`.

##Build and test your application locally

The Registration application is a simple PHP application that allows you to register for an event by providing your name and email address. Information about previous registrants is displayed in a table. Registration information is stored in a MySQL database. The application consists of one file:

* **index.php**: Displays a form for registration and a table containing registrant information.

To build and run the application locally, follow the steps below. Note that these steps assume you have PHP, the MySQL Command-Line Tool (part of MySQL), and a web server set up on your local machine, and that you have enabled the [PDO extension for MySQL][pdo-mysql].

1. Connect to the remote MySQL server, using the value for `Data Source`, `User Id`, `Password`, and `Database` that you retrieved earlier:

		mysql -h{Data Source] -u[User Id] -p[Password] -D[Database]

2. The MySQL command prompt will appear:

		mysql>

3. Paste in the following `CREATE TABLE` command to create the `registration_tbl` table in your database:

		mysql> CREATE TABLE registration_tbl(id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id), name VARCHAR(30), email VARCHAR(30), date DATE);

4. In your web server's root directory, create a folder called `registration` and create a file in it called `index.php`.

5. Open the **index.php** file in a text editor or IDE and add the following code, and complete the necessary changes marked with `//TODO:` comments.


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
			// DB connection info
			//TODO: Update the values for $host, $user, $pwd, and $db
			//using the values you retrieved earlier from the portal.
			$host = "value of Data Source";
			$user = "value of User Id";
			$pwd = "value of Password";
			$db = "value of Database";
			// Connect to database.
			try {
				$conn = new PDO( "mysql:host=$host;dbname=$db", $user, $pwd);
				$conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
			}
			catch(Exception $e){
				die(var_dump($e));
			}
			// Insert registration info
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
			// Retrieve data
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
		?>
		</body>
		</html>

You can now browse to [http://localhost/registration/index.php][localhost-index] to test the application.


##Publish your application

After you have tested your application locally, you can publish it to your Windows Azure web site using Git. You will initialize your local Git repository and publish the application.

<div class="dev-callout">
<b>Note</b>
<p>These are the same steps shown in the portal at the end of the <b>Create a Windows Azure web site and Set up Git Publishing</b> section.</p>
</div>

1. (Optional)  If you've forgotten or misplaced your Git remote repostitory URL, navigate to the Deployment tab on the portal.
	
	![Get Git URL][git-instructions]

1. Open GitBash (or a terminal, if Git is in your `PATH`), change directories to the root directory of your application, and run the following commands:

		git init
		git add .
		git commit -m "initial commit"
		git remote add azure [URL for remote repository]
		git push azure master

	You will be prompted for the password you created earlier.

2. Browse to **http://[site name].azurewebsites.net/index.php** to begin using the application (this information will be stored on your account dashboard):

	![Windows Azure PHP web site][running-app]

After you have published your application, you can begin making changes to it and use Git to publish them. 

##Publish changes to your application

To publish changes to application, follow these steps:

1. Make changes to your application locally.
2. Open GitBash (or a terminal, it Git is in your `PATH`), change directories to the root directory of your application, and run the following commands:

		git add .
		git commit -m "comment describing changes"
		git push azure master

	You will be prompted for the password you created earlier.

3. Browse to **http://[site name].azurewebsites.net/index.php** to see your application and any changes you may have made:

	![Windows Azure PHP web site][running-app]

[install-php]: http://www.php.net/manual/en/install.php
[install-mysql]: http://dev.mysql.com/doc/refman/5.6/en/installing.html
[install-git]: http://git-scm.com/
[pdo-mysql]: http://www.php.net/manual/en/ref.pdo-mysql.php
[localhost-index]: http://localhost/registration/index.php
[running-app]: ../Media/running_app_2.png
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
[connection-string-info]: ../../Shared/Media/connection_string_info.png
[preview-portal]: https://manage.windowsazure.com