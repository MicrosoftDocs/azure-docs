<properties umbracoNaviHide="0" pageTitle="Create a PHP-MySQL Windows Azure Website and Deploy Using Git" metaKeywords="Windows Azure, Windows Azure Websites, PHP, MySQL, Git" metaDescription="Learn how to create a PHP-MySQL website in Windows Azure, and deploy to it using Git." linkid="dev-php-tutorials-php-mysql-site-git" urlDisplayName="Create a PHP-MySQL Windows Azure Website and Deploy Using Git" headerExpose="" footerExpose="" disqusComments="1" />

#Create a PHP-MySQL Windows Azure Website and Deploy Using Git

This tutorial shows you how to create a PHP-MySQL Windows Azure Website and how to deploy it using Git. This tutorial assumes you have [PHP][install-php], [MySQL][install-mysql], a web server, and [Git][install-git] installed on your computer. The instructions in this tutorial can be followed on any operating system, including Windows, Mac, and  Linux. Upon completing this guide, you will have a PHP/MySQL website running in Windows Azure.
 
You will learn:

* How to create a Windows Azure Website and a MySQL database using the Preview Management Portal. Because PHP is enabled in Windows Azure Websites by default, nothing special is required to run your PHP code.
* How to publish and re-publish your application to Windows Azure using Git.
 
By following this tutorial, you will build a simple Tasklist web application in PHP. The application will be hosted in a Windows Azure Website. A screenshot of the completed application is below:

![Windows Azure PHP Website][running-app]

##Build and Test Your Application Locally

The Tasklist application is a simple PHP application that allows you to add, mark complete, and delete items from a task list. Task list items are stored in a MySQL database. The application consists of these files:

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

After you have run the application locally, you are ready to create a Windows Azure Website and publish your code using Git.

##Create a Windows Azure Website and Set up Git Publishing

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

##Get MySQL Connection Information

Before publishing the Tasklist application, the database connection information (in the **taskmodel.php** file) must be updated. To get MySQL connection information, follow these steps:

**NOTE:** These steps are only necessary in the Windows Azure Preview.

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

4. Open the **taskmodel.php** file in a text editor or IDE and update the database connection information in the `connect` function by copying the appropriate values from the previous step:

		// DB connection info
		$host = "value of Data Source";
		$user = "value of User Id";
		$pwd = "value of Password";
		$db = "value of Database";



##Publish Your Application

To publish your application with Git, follow the steps below.

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

2. Browse to **http://[your website domain]/createtable.php** to create the MySQL table for the application.
3. Browse to **http://[your website domain]/index.php** to begin using the application.

After you have published your application, you can begin making changes to it and use Git to publish them. 

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
[install-mysql]: http://dev.mysql.com/doc/refman/5.6/en/installing.html
[install-git]: http://git-scm.com/
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
[setup-git-publishing]: ../Media/setup_git_publishing.jpg
[credentials]: ../Media/credentials.jpg
[creating-repo]: ../Media/creating_repo.jpg
[push-files]: ../Media/push_files.jpg
[git-instructions]: ../Media/git_instructions.jpg
[download-publish-profile]: ../../Shared/Media/download_publish_profile.jpg
[preview-portal]: https://manage.windowsazure.com