<properties 
	pageTitle="Migrate Drupal to Azure App Service" 
	description="Migrate a Drupal PHP site to Azure App Service." 
	services="app-service\web" 
	documentationCenter="php" 
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


# Migrate Drupal to Azure App Service

Because Azure App Service supports both PHP and MySQL, it is relatively straightforward to migrate a Drupal site to Azure App Service Web Apps. And, because Drupal and PHP run on any platform, the process should work for moving Drupal to Azure App Service Web Apps regardless of your current platform. With this said, Drupal installations can vary widely, so there could be some unique migration steps not covered in the following material. Note that the Drush tool is not used, because it is not supported on Azure App Service.

If you are moving a large and complex Drupal application, another option is to consider using Azure Cloud Services. For more information about the differences between App Service and Cloud Services, see <a href="http://go.microsoft.com/fwlink/?LinkId=310123">Azure App Service, Cloud Services, and VMs: When to use which?</a>. For help on moving Drupal to Cloud Services, see <a href="http://blogs.msdn.com/b/brian_swan/archive/2012/03/19/azure-real-world-migrating-drupal-from-lamp-to-windows-azure.aspx">Migrating a Drupal Site from LAMP to Azure</a>.
 
## Create a web app and MySQL database

First, go through the step-by-step tutorial to learn how to create a new web app with MySQL: [Create a PHP-MySQL web app in Azure App Service and deploy using Git][]. If you intend to use Git to publish your Drupal site, then follow the steps in the tutorial that explain how to configure a Git repository. Make sure to follow the instructions in the **Get remote MySQL connection information** section as you will need that information later. You can ignore the remainder of the tutorial for the purposes of deploying your Drupal site, but if you are new to Azure App Service (and to Git), you might find the additional reading informative.

After you setup a new web app with a MySQL database, you now have your MySQL database connection information and an (optional) Git repository. The next step is to copy your database to the web app's MySQL database.

## Copy database to the web app's MySQL database

There are many ways to migrate a database into Azure. One way that works well with MySQL databases is to use the [MySqlDump][] tool. The following command provides and example of how to copy from a local machine to Azure:

    mysqldump -u local_username --password=local_password  drupal | mysql -h remote_host -u remote_username --password=remote_password remote_db_name

You do, of course, have to provide the username and password for your existing Drupal database. You also have to provide the hostname, username, password, and database name for the MySQL database you created in the first step. This information is available in the connection string information that you collected previously. The connection string should have a format similar to the following string:

    Database=remote_db_name;Data Source=remote_host;User Id=remote_username;Password=remote_password

Depending on the size of your database, the copying process could take several minutes.

Now your Drupal database is live in Azure. Before you deploy your Drupal code, you need to modify it so it can connect to the new database.

## Modify database connection info in settings.php

Here, you again need your new database connection information. Open the **/drupal/sites/default/setting.php** file in a text editor, and replace the values of 'database', 'username', 'password', and 'host' in the **$databases** array with the correct values for your new database. When you are finished, you should have something similar to this:

    $databases = array (
       'default' => 
       array (
         'default' => 
         array (
           'database' => 'remote_db_name',
           'username' => 'remote_username',
           'password' => 'remote_password',
           'host' => 'remote_host',
           'port' => '',
           'driver' => 'mysql',
           'prefix' => '',
         ),
       ),
     );

Save the **settings.php** file. Now you are ready to deploy.

## Deploy Drupal code using Git or FTP

The last step is to deploy your code to Web Apps using Git or FTP.

If you are using FTP, get the FTP hostname and username from you web app’s blade in the [Azure preview portal](https://portal.azure.com). Then, use any FTP client to upload the Drupal files to the **/site/wwwroot** folder of the remote site.

If you are using Git, you should have set up a Git repository in the previous steps. You must install Git on your local machine. Then, follow the instructions provided after you created the repository.

> [AZURE.NOTE]
> Depending on your Git settings, you might have to edit your .gitignore file (a hidden file and a sibling to the .git folder created in your local root directory after you executed git commit). This specifies files in your Drupal application that may be ignored. If this contains files that should be deployed, remove those entries so that these files are not ignored.

After you have deployed Drupal to Web Apps, you can continue to deploy updates via Git or FTP.

## Related information

For more information, see the following posts and topics:

- [Azure App Service Web Apps, a PHP Perspective][]
- [Azure App Service, Cloud Services, and VMs: When to use which?][]
- [Configuring PHP in Azure App Service Web Apps with .user.ini Files][]
- [Azure Integration Module](https://drupal.org/project/azure_auth)
- [Azure Blob Storage Module](https://drupal.org/project/azure_blob)

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
* For a guide to the change of the portal to the preview portal see: [Reference for navigating the preview portal](http://go.microsoft.com/fwlink/?LinkId=529715)

  [Create a PHP-MySQL web app in Azure App Service and deploy using Git]: /develop/php/tutorials/website-w-mysql-and-git/
  
  [Azure App Service Web Apps, a PHP Perspective]: http://blogs.msdn.com/b/silverlining/archive/2012/06/12/windows-azure-websites-a-php-perspective.aspx
  [Azure App Service, Cloud Services, and VMs: When to use which?]: http://go.microsoft.com/fwlink/?LinkId=310123
  [Configuring PHP in Azure App Service Web Apps with .user.ini Files]: http://blogs.msdn.com/b/silverlining/archive/2012/07/10/configuring-php-in-windows-azure-websites-with-user-ini-files.aspx
  [Azure Integration Module]: http://drupal.org/project/azure
