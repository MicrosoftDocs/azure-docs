<properties 
	pageTitle="Migrating Drupal to Azure Websites" 
	description="Migrate a Drupal PHP site to Azure Websites." 
	services="web-sites" 
	documentationCenter="php" 
	authors="tfitzmac" 
	manager="wpickett" 
	editor="mollybos"/>

<tags 
	ms.service="web-sites" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="PHP" 
	ms.topic="article" 
	ms.date="11/11/2014" 
	ms.author="tomfitz"/>


# Migrating Drupal to Azure Websites

Because Azure Websites supports both PHP and MySQL, it is relatively straightforward to migrate a Drupal site to Azure Websites. And, because Drupal and PHP run on any platform, the process should work for moving Drupal to Azure Websites regardless of your current platform. With this said, Drupal installations can vary widely, so there could be some unique migration steps not covered in the following material. Note that the Drush tool is not used, because it is not supported on Azure Websites.

> [AZURE.NOTE]
> If you are moving a large and complex Drupal application, another option is to consider using Azure Cloud Services. For more information about the differences between Websites and Cloud Services, see <a href="http://go.microsoft.com/fwlink/?LinkId=310123">Azure Websites, Cloud Services, and VMs: When to use which?</a>. For help on moving Drupal to Cloud Services, see <a href="http://blogs.msdn.com/b/brian_swan/archive/2012/03/19/azure-real-world-migrating-drupal-from-lamp-to-windows-azure.aspx">Migrating a Drupal Site from LAMP to Windows Azure</a>.

## Table of Contents

- [Create the Azure Web Site][]
- [Copy the Database][]
- [Modify Settings.php][]
- [Deploy the Drupal Code][]
- [Related information][]
 
##<a name="create-siteanddb"></a>1. Create an Azure Website and MySQL database

First, go through the step-by-step tutorial to learn how to create a new Website with MySQL: [Create a PHP-MySQL Azure web site and deploy using Git][]. If you intend to use Git to publish your Drupal site, then follow the steps in the tutorial that explain how to configure a Git repository. Make sure to follow the instructions in the **Get remote MySQL connection information** section as you will need that information later. You can ignore the remainder of the tutorial for the purposes of deploying your Drupal site, but if you are new to Azure Websites (and to Git), you might find the additional reading informative.

After you setup a new Website with a MySQL database, you now have your MySQL database connection information and an (optional) Git repository. The next step is to copy your database to MySQL in Azure Websites.

##<a name="copy-database"></a>2. Copy database to MySQL in Azure Websites

There are many ways to migrate a database into Azure. One way that works well with MySQL databases is to use the [MySqlDump][] tool. The following command provides and example of how to copy from a local machine to Azure Websites:

    mysqldump -u local_username --password=local_password  drupal | mysql -h remote_host -u remote_username --password=remote_password remote_db_name

You do, of course, have to provide the username and password for your existing Drupal database. You also have to provide the hostname, username, password, and database name for the MySQL database you created in the first step. This information is available in the connection string information that you collected previously. The connection string should have a format similar to the following string:

    Database=remote_db_name;Data Source=remote_host;User Id=remote_username;Password=remote_password

Depending on the size of your database, the copying process could take several minutes.

Now your Drupal database is live in Azure Websites. Before you deploy your Drupal code, you need to modify it so it can connect to the new database.

##<a name="modify-settingsphp"></a>3. Modify database connection info in settings.php

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

##<a name="deploy-drupalcode"></a>4. Deploy Drupal code using Git or FTP

The last step is to deploy your code to Azure Websites using Git or FTP.

If you are using FTP, get the FTP hostname and username from you website’s dashboard. Then, use any FTP client to upload the Drupal files to the **/site/wwwroot** folder of the remote site.

If you are using Git, you should have set up a Git repository in the previous steps. You must install Git on your local machine. Then, follow the instructions provided after you created the repository.

> [AZURE.NOTE]
> Depending on your Git settings, you might have to edit your .gitignore file (a hidden file and a sibling to the .git folder created in your local root directory after you executed git commit). This specifies files in your Drupal application that may be ignored. If this contains files that should be deployed, remove those entries so that these files are not ignored.

After you have deployed Drupal to Azure Websites, you can continue to deploy updates via Git or FTP.

##<a name="related-information"></a>Related information

For more information, see the following posts and topics:

- [Azure Websites, a PHP Perspective][]
- [Azure Web Sites, Cloud Services, and VMs: When to use which?][]
- [Configuring PHP in Azure Websites with .user.ini Files][]
- [Azure Integration Module](https://drupal.org/project/azure_auth)
- [Azure Blob Storage Module](https://drupal.org/project/azure_blob)

  [Create the Azure Web Site]: #create-siteanddb
  [Copy the Database]: #copy-database
  [Modify Settings.php]: #modify-settingsphp
  [Deploy the Drupal Code]: #deploy-drupalcode
  [Related information]: #related-information
  [Create a PHP-MySQL Azure web site and deploy using Git]: http://www.windowsazure.com/en-us/develop/php/tutorials/website-w-mysql-and-git/
  
  [Azure Websites, a PHP Perspective]: http://blogs.msdn.com/b/silverlining/archive/2012/06/12/windows-azure-websites-a-php-perspective.aspx
  [Azure Web Sites, Cloud Services, and VMs: When to use which?]: http://go.microsoft.com/fwlink/?LinkId=310123
  [Configuring PHP in Azure Websites with .user.ini Files]: http://blogs.msdn.com/b/silverlining/archive/2012/07/10/configuring-php-in-windows-azure-websites-with-user-ini-files.aspx
  [Azure Integration Module]: http://drupal.org/project/azure
