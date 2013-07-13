<properties linkid="migrating-drupal-to-azure-websites" urlDisplayName="Migrating Drupal to Windows Azure Web Sites" pageTitle="Migrating Drupal to Windows Azure Web Sites" metaKeywords="Drupal,PHP,Web Sites" metaDescription="Migrate a Drupal PHP site to Windows Azure Web Sites." umbracoNaviHide="0" disqusComments="1" writer="jroth" editor="mollybos" manager="paulettm" /> 

<div chunk="../chunks/article-left-menu.md" />

# Migrating Drupal to Windows Azure Web Sites

Because Windows Azure Web Sites supports both PHP and MySQL, it is relatively straightforward to migrate a Drupal site to Windows Azure Web Sites. And, because Drupal and PHP run on any platform, the process should work for moving Drupal to Windows Azure Web Sites regardless of your current platform. With this said, Drupal installations can vary widely, so there could be some unique migration steps not covered in the following material. Note that the Drush tool is not used, because it is not supported on Windows Azure Web Sites.

<div class="dev-callout">
    <strong>Note</strong>
    <p>If you are moving a large and complex Drupal application, another option is to consider using Windows Azure Cloud Services. For more information about the differences between Web Sites and Cloud Services, see <a href="http://go.microsoft.com/fwlink/?LinkId=310123">Windows Azure Web Sites, Cloud Services, and VMs: When to use which?</a>. For help on moving Drupal to Cloud Services, see <a href="http://blogs.msdn.com/b/brian_swan/archive/2012/03/19/azure-real-world-migrating-drupal-from-lamp-to-windows-azure.aspx">Migrating a Drupal Site from LAMP to Windows Azure</a>.</p>
    </div>

## Table of Contents

- [Create the Windows Azure Web Site][]
- [Copy the Database][]
- [Modify Settings.php][]
- [Deploy the Drupal Code][]
- [Related information][]
 
<h2><a name="create-siteanddb"></a><span class="short-header">Create a Windows Azure Web Site and MySQL database</span>1. Create a Windows Azure Web Site and MySQL database</h2>

First, go through the step-by-step tutorial to learn how to create a new Web Site with MySQL: [Create a PHP-MySQL Windows Azure web site and deploy using Git][]. If you intend to use Git to publish your Drupal site, then follow the steps in the tutorial that explain how to configure a Git repository. Make sure to follow the instructions in the **Get remote MySQL connection information** section as you will need that information later. You can ignore the remainder of the tutorial for the purposes of deploying your Drupal site, but if you are new to Windows Azure Web Sites (and to Git), you might find the additional reading informative.

After you setup a new Web Site with a MySQL database, you now have your MySQL database connection information and an (optional) Git repository. The next step is to copy your database to MySQL in Windows Azure Web Sites.

<h2><a name="copy-database"></a><span class="short-header">Copy database to MySQL in Windows Azure Web Sites</span>2. Copy database to MySQL in Windows Azure Web Sites</h2>

There are many ways to migrate a database into Windows Azure. One way that works well with MySQL databases is to use the [MySqlDump][] tool. The following command provides and example of how to copy from a local machine to Windows Azure Web Sites:

    mysqldump -u local_username --password=local_password  drupal | mysql -h remote_host -u remote_username --password=remote_password remote_db_name

You do, of course, have to provide the username and password for your existing Drupal database. You also have to provide the hostname, username, password, and database name for the MySQL database you created in the first step. This information is available in the connection string information that you collected previously. The connection string should have a format similar to the following string:

    Database=remote_db_name;Data Source=remote_host;User Id=remote_username;Password=remote_password

Depending on the size of your database, the copying process could take several minutes.

Now your Drupal database is live in Windows Azure Websites. Before you deploy your Drupal code, you need to modify it so it can connect to the new database.

<h2><a name="modify-settingsphp"></a><span class="short-header">Modify database connection info in settings.php</span>3. Modify database connection info in settings.php</h2>

Here, you again need your new database connection information. Open the **/drupal/sites/default/setting.php** file in a text editor, and replace the values of ‘database’, ‘username’, ‘password’, and ‘host’ in the **$databases** array with the correct values for your new database. When you are finished, you should have something similar to this:

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

<h2><a name="deploy-drupalcode"></a><span class="short-header">Deploy Drupal code using Git or FTP</span>4. Deploy Drupal code using Git or FTP</h2>

The last step is to deploy your code to Windows Azure Web Sites using Git or FTP.

If you are using FTP, get the FTP hostname and username from you website’s dashboard. Then, use any FTP client to upload the Drupal files to the **/site/wwwroot** folder of the remote site.

If you are using Git, you should have set up a Git repository in the previous steps. You must install Git on your local machine. Then, follow the instructions provided after you created the repository.

<div class="dev-callout">
    <strong>Note</strong>
    <p>Depending on your Git settings, you might have to edit your .gitignore file (a hidden file and a sibling to the .git folder created in your local root directory after you executed git commit). This specifies files in your Drupal application that may be ignored. If this contains files that should be deployed, remove those entries so that these files are not ignored.</p>
    </div>

After you have deployed Drupal to Windows Azure Web Sites, you can continue to deploy updates via Git or FTP.

<h2><a name="related-information"></a><span class="short-header">Related information</span>Related information</h2>

For more information, see the following posts and topics:

- [Windows Azure Websites, a PHP Perspective][].
- [Windows Azure Web Sites, Cloud Services, and VMs: When to use which?][]
- [Configuring PHP in Windows Azure Websites with .user.ini Files][].
- [Windows Azure Integration Module][] (to store and serve your site's media files).

  [Create the Windows Azure Web Site]: #create-siteanddb
  [Copy the Database]: #copy-database
  [Modify Settings.php]: #modify-settingsphp
  [Deploy the Drupal Code]: #deploy-drupalcode
  [Related information]: #related-information
  [Create a PHP-MySQL Windows Azure web site and deploy using Git]: http://www.windowsazure.com/en-us/develop/php/tutorials/website-w-mysql-and-git/
  [MySqlDump]: http://dev.mysql.com/doc/refman/5.6/en/mysqldump.html
  [Windows Azure Websites, a PHP Perspective]: http://blogs.msdn.com/b/silverlining/archive/2012/06/12/windows-azure-websites-a-php-perspective.aspx
  [Windows Azure Web Sites, Cloud Services, and VMs: When to use which?]: http://go.microsoft.com/fwlink/?LinkId=310123
  [Configuring PHP in Windows Azure Websites with .user.ini Files]: http://blogs.msdn.com/b/silverlining/archive/2012/07/10/configuring-php-in-windows-azure-websites-with-user-ini-files.aspx
  [Windows Azure Integration Module]: http://drupal.org/project/azure