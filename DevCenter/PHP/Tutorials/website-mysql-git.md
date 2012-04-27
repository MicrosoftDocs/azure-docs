#How to Create a Windows Azure Website with MySQL Using Git

This tutorial shows you how to create a Windows Azure Website that has a MySQL database and how to deploy it using Git. This tutorial assumes you have PHP, MySQL, and a web server installed on your computer. Upon completing this guide, you will have an PHP/MySQL website running in Windows Azure.
 
You will learn:
 •How to create a Windows Azure Website and a MySQL database using the Windows Azure Developer Portal.
 •How to publish and re-publish your application to Windows Azure using Git.
 
By following this tutorial, you will build a simple Tasklist web application. The application will be hosted in a Windows Azure Website. A screenshot of the completed application is below:

	**TODO: Insert screenshot**

##Build and Test Your Application Locally
The Tasklist application is a simple example application that allows you to add, mark complete, and delete items from a task list. Task list items are stored in a MySQL database. The application consists of these files:

* **index.php**: Displays tasks and provides a form for adding an item to the list.
* **additem.php**: Adds an item to the list.
* **getitems.php**: Gets all items in the database.
* **markitemcomplete.php**: Changes the status of an item to complete.
* **deleteitem.php**: Deletes an item.
* **taskmodel.php**: Contains functions that add, get, update, and delete items from the database.
* **createtable.php**: Creates the MySQL table for the application. This file will only be called once.

To run the application locally, follow these steps:

1. Download the application files from Github here: [https://github.com/brian-swan/tasklist-mysql][tasklist-mysql-download]
2. Create a MySQL database called `tasklist`.
3. 

##Create a Windows Azure Website and Set up Git Publishing

Follow these steps to create a Windows Azure Website and a MySQL database:

1. Login to the Windows Azure portal. **TODO: provide link**
2. Click the **+ New** icon on the bottom left of the portal.

	**TODO: Insert screenshot**

3. Click **Web Site**, then **Custom Create**. Enter a value for **URL**, select **Create a New MySQL Database** from the **DATABASE** dropdown,  and select the data center for your website in the **REGION** dropdown. Click the arrow at the bottom of the dialog.

	**TODO: Insert screenshot**

4. Enter a value for the **NAME** of your database, select the data center for your database in the **REGION** dropdown, and check the box that indicates you agree with the legal terms. Click the checkmark at the bottom of the dialog.

	**TODO: Insert screenshot**

	When the website has been created you will see the text **Creation of Web Site ‘[SITENAME]’ completed successfuly**. Now, you can enable Git publishing.

5. Click the name of the website displayed in the list of websites to open the website’s Quick Start dashboard.

	**TODO: Insert screenshot**


6. At the bottom of the Quick Start page, click **Set up Git publishing**. 

	**TODO: Insert screenshot**

7. To enable Git publishing, you must provide a user name and password. Make a note of the user name and password you create.

	**TODO: Insert screenshot**

	It will take a few seconds to set up your repository.

	**TODO: Insert screen shot**

	When your repository is ready, click **Push my local files to Windows Azure**.

	**TODO: Insert screen shot**


FTP publishing is set up by default for Windows Azure Web Sites and the FTP Host name is displayed under FTP Hostname on the Quick Start and Dashboard pages. Before publishing with FTP or GIT choose the option to Reset deployment credentials on the Dashboard page. Then specify the new credentials (username and password) to authenticate against the FTP Host or the Git Repository when deploying content to the website.

[tasklist-mysql-download]: https://github.com/brian-swan/tasklist-mysql