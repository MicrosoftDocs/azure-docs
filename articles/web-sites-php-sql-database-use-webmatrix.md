<properties 
	pageTitle="Create and Deploy a PHP-SQL web app in Azure App Servcie using WebMatrix" 
	description="A tutorial that demonstrates how to use the free WebMatrix IDE to create and deploy a PHP web app in Azure App Service that stores data in SQL Database." 
	tags="azure-portal"
	services="app-service\web" 
	documentationCenter="" 
	authors="tfitzmac" 
	manager="wpickett" 
	editor="mollybos"/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="PHP" 
	ms.topic="article" 
	ms.date="04/29/2015" 
	ms.author="tomfitz"/>





# Create and Deploy a PHP-SQL web app in Azure App Service using WebMatrix

This tutorial shows you how to use WebMatrix to develop a PHP application that uses an Azure SQL Database and deploy it to [Azure App Service](http://go.microsoft.com/fwlink/?LinkId=529714) Web Apps. WebMatrix is a free web development tool from Microsoft that includes everything you need for web app development. WebMatrix supports PHP and includes intellisense for PHP development. 

This tutorial assumes you have [SQL Server Express][install-SQLExpress] installed on your computer so that you can test an application locally. However, you can complete the tutorial without having SQL Server Express installed. Instead, you can deploy your application directly to Azure App Service Web Apps.

Upon completing this guide, you will have a PHP-SQL Database web app running in Azure.
 
You will learn:

* How to create a web app in App Service Web Apps and a SQL Database using the [Azure preview portal](http://go.microsoft.com/fwlink/?LinkId=529715). Because PHP is enabled in Web Apps by default, nothing special is required to run your PHP code.
* How to develop a PHP application using WebMatrix.
* How to publish and re-publish your application to Azure using WebMatrix.
 
By following this tutorial, you will build a simple Tasklist web application in PHP. The application will be hosted in App Service Web Apps. A screenshot of the running application is below:

![Azure PHP Web Site][running-app]

[AZURE.INCLUDE [create-account-and-websites-note](../includes/create-account-and-websites-note.md)]

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

##Prerequisites

1. [Download][tasklist-sqlazure-download] the Tasklist application files. The Tasklist application is a simple PHP application that allows you to add, mark complete, and delete items from a task list. Task list items are stored in a SQL Database (SQL Server Express for local testing). The application consists of these files:

	* **index.php**: Displays tasks and provides a form for adding an item to the list.
	* **additem.php**: Adds an item to the list.
	* **getitems.php**: Gets all items in the database.
	* **markitemcomplete.php**: Changes the status of an item to complete.
	* **deleteitem.php**: Deletes an item.
	* **taskmodel.php**: Contains functions that add, get, update, and delete items from the database.
	* **createtable.php**: Creates the SQL Database table for the application. This file will only be called once.

2. Create a SQL Server database called `tasklist`. You can do this from the `sqlcmd` command prompt with these commands:

		>sqlcmd -S <server name>\sqlexpress -U <user name> -P <password>
		1> create database tasklist
		2> GO

	This step is only necessary if you want to test your application locally.

## Create a web app and SQL Database

Follow these steps to create an Azure web app and a SQL Database:

1. Log in to the [Azure preview portal](https://portal.azure.com).

2. Open the Azure Marketplace either by clicking the **Marketplace** icon, or by clicking the **New** icon on the bottom left of the dashboard, selecting **Web + mobile** and then **Azure Marketplace** at the bottom.
	
3. In the Marketplace, select **Web Apps**.

4. Click the **Web app + SQL** icon.

5. After reading the description of the Web app + SQL app, select **Create**.

6. Click on each part (**Resource Group**, **Web App**, **Database**, and **Subscription**) and enter or select values for the required fields:
	
	- Enter a URL name of your choice	
	- Configure database server credentials
	- Select the region closest to you

	![configure your app](./media/web-sites-php-sql-database-use-webmatrix/configure-db-settings.png)

7. When finished defining the web app, click **Create**.

	When the web app has been created, the **Notifications** button will flash a green **SUCCESS** and the resource group blade open to show both the web app and the SQL database in the group.

4. Click the web app's icon in the resource group blade to open the web app's blade.

	![web app's resource group](./media/web-sites-php-sql-database-use-webmatrix/resource-group-blade.png)

##Get SQL Database connection information

To connect to the SQL Database instance that is linked to your web app, your will need the connection information, which you specified when you created the database. To get the SQL Database connection information, follow these steps:

1. Back in the resource group's blade, click the SQL database's icon.

2. In the SQL database's blade, click **Properties**, then click **Show database connection strings**. 

	![View database properties](./media/web-sites-php-sql-database-use-webmatrix/view-database-properties.png)
	
3. From the **PHP** section of the resulting dialog, make note of the values for `Server`, `SQL Database`, and `User Name`. You will use these values later when publishing your PHP web app to Azure App Service.

## Create your application in WebMatrix

In the next few steps you will develop the Tasklist application by adding the files you downloaded earlier and making a few modifications. You could, however, add your own existing files or create new files.

1. Launch [Microsoft WebMatrix](http://www.microsoft.com/web/webmatrix/). If you haven't alreayd installed it yet, do it now.
2. If this is the first time you've used WebMatrix 3, you will be prompted to sign into Azure.  Otherwise, you can click on the **Sign In** button, and choose **Add Account**.  Choose to **Sign in** using your Microsoft Account.

	![Add Account](./media/web-sites-php-sql-database-use-webmatrix/webmatrix-add-account.png)

3. If you have signed up for an Azure account, you may log in using your Microsoft Account:

	![Sign into Azure](./media/web-sites-php-sql-database-use-webmatrix/webmatrix-sign-in.png)

1. On the start screen, click the **New** button, and choose **Template Gallery** to create a new site from the Template Gallery:

	![New site from Template Gallery](./media/web-sites-php-sql-database-use-webmatrix/webmatrix-site-from-template.png)

4. From the available templates, choose **PHP**.

	![Site from template][site-from-template]

5. Select the **Empty Site** template. Provide a name for the site and click **NEXT**.

	![Provide name for site][site-from-template-2]

3. If you are signed into Azure, you now have the option to create an Azure App Service Web Apps instance for your local site. Choose **Skip** for now. 

	![Create site on Azure](./media/web-sites-php-sql-database-use-webmatrix/webmatrix-site-from-template-azure.png)

1. After WebMatrix finishes building the local site, the WebMatrix IDE is displayed. Add your application files by clicking **Add Existing**:

	![WebMatrix - Add existing files][edit_addexisting]

	In the resulting dialog, navigate to the files you downloaded earlier, select all of them, and click Open. When prompted, choose to replace the `index.php` file. 

2. Next, you need to add your local SQL Server database connection information to the `taskmodel.php` file. Open the  `taskmodel.php` file by double clicking it, and update the database connection information in the `connect` function. (**Note**: Jump to [Publish Your Application](#Publish) if you do not want to test your application locally and want to instead publish directly to Azure App Service Web Apps.)

		// DB connection info
		$host = "localhost\sqlexpress";
		$user = "your user name";
		$pwd = "your password";
		$db = "tasklist";

	Save the `taskmodel.php` file.

3. For the application to run, the `items` table needs to be created. Right click the `createtable.php` file and select **Launch in browser**. This will launch `createtable.php` in your browser and execute code that creates the `items` table in the `tasklist` database.

	![WebMatrix - Launch createtable.php in browser][edit_run]

4. Now you can test the application locally. Right click the `index.php` file and select **Launch in browser**. Test the application by adding items, marking them complete, and deleting them.   

<a id="Publish"></a>
## Publish your application

Before publishing your application to App Service Web Apps, the database connection information in `taskmodel.php` needs to be updated with the connection information you obtained earlier (in the [Create a web app and SQL Database](#CreateWebsite) section).

1. Open the `taskmodel.php` file by double clicking it, and update the database connection information in the `connect` function.

		// DB connection info
		$host = "value of $serverName";
		$user = "value of UID";
		$pwd = "the SQL password you created when creating the web app";
		$db = "value of Database";
	
	Save the `taskmodel.php` file.

2. Click **Publish** in WebMatrix.

	![WebMatrix - Publish][edit_publish]

3. Click **Choose an existing site from Microsoft Azure**.

	![](./media/web-sites-php-sql-database-use-webmatrix/webmatrix-publish-existing-site.png)

3. Select the App Service web app you created earlier.

	![](./media/web-sites-php-sql-database-use-webmatrix/webmatrix-publish-existing-site-choose.png)

3. Keep clicking **Continue** until WebMatrix publishes the site to Azure App Service Web Apps.

3. Navigate to http://[your web site name].azurewebsites.net/createtable.php to create the `items` table.

4. Lastly, navigate to http://[your web site name].azurewebsites.net/index.php to launch the application.
	
##Modify and republish your application

You can easily modify your application by editing the local copy of the site and republish or you can make the edit directly in the **Remote** mode. Here, you will make a simple change to the heading in in the `index.php` file and save it directly to the live App Service web app.

1. Click on the **Remote** tab of your site in WebMatrix and select **Open Remote View**. This will open your remote files (hosted on Web Apps) for editing directly.
	 ![WebMatrix - Open Remote View][OpenRemoteView]
 
2. Open the `index.php` file by double-clicking it.
	![WebMatrix - Open index file][Remote_editIndex]

3. Change **My ToDo List** to **My Task List** in the **title** and **h1** tags and save the file.


4. When saving has completed, click the Run button to see the changes on the live App Service web app.
	![WebMatrix - Launch site in Remote][Remote_run]



## Next Steps

You've seen how to create and deploy a web app from WebMatrix to Azure App Service Web Apps. To learn more about WebMatrix, see [WebMatrix web site](http://www.microsoft.com/click/services/Redirect2.ashx?CR_CC=200106398).

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
* For a guide to the change of the portal to the preview portal see: [Reference for navigating the preview portal](http://go.microsoft.com/fwlink/?LinkId=529715)




[install-SQLExpress]: http://www.microsoft.com/download/details.aspx?id=29062
[running-app]: ./media/web-sites-php-sql-database-use-webmatrix/tasklist_app_windows.png
[tasklist-sqlazure-download]: http://go.microsoft.com/fwlink/?LinkId=252504
[NewWebSite1]: ./media/web-sites-php-sql-database-use-webmatrix/NewWebSite1.jpg
[NewWebSite2]: ./media/web-sites-php-sql-database-use-webmatrix/NewWebSite2.png
[NewWebSite3_SQL]: ./media/web-sites-php-sql-database-use-webmatrix/NewWebSite3_SQL.png
[NewWebSite4_SQL]: ./media/web-sites-php-sql-database-use-webmatrix/NewWebSite4_SQL.png

[NewWebSite6_SQL]: ./media/web-sites-php-sql-database-use-webmatrix/NewWebSite6_SQL.png
[NewWebSite7]: ./media/web-sites-php-sql-database-use-webmatrix/NewWebSite7.png

[InstallWebMatrix]: ./media/web-sites-php-sql-database-use-webmatrix/InstallWebMatrix.png
[download-site]: ./media/web-sites-php-sql-database-use-webmatrix/download-site-1.png
[site-from-template]: ./media/web-sites-php-sql-database-use-webmatrix/site-from-template.png
[site-from-template-2]: ./media/web-sites-php-sql-database-use-webmatrix/site-from-template-2.png
[edit_addexisting]: ./media/web-sites-php-sql-database-use-webmatrix/edit_addexisting.png
[edit_run]: ./media/web-sites-php-sql-database-use-webmatrix/edit_run.png
[edit_publish]: ./media/web-sites-php-sql-database-use-webmatrix/edit_publish.png
[OpenRemoteView]: ./media/web-sites-php-sql-database-use-webmatrix/OpenRemoteView.png
[Remote_editIndex]: ./media/web-sites-php-sql-database-use-webmatrix/Remote_editIndex.png
[Remote_run]: ./media/web-sites-php-sql-database-use-webmatrix/Remote_run.png

[preview-portal]: https://manage.windowsazure.com








