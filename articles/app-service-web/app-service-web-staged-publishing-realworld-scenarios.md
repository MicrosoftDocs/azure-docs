---
title: Use DevOps environments effectively for your web app | Microsoft Docs
description: Learn how to use deployment slots to set up and manage multiple development environments for your application
services: app-service\web
documentationcenter: ''
author: sunbuild
manager: yochayk
editor: ''

ms.assetid: 16a594dc-61f5-4984-b5ca-9d5abc39fb1e
ms.service: app-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: web
ms.date: 10/24/2016
ms.author: sumuth

---
# Use DevOps environments effectively for your web apps
This article shows you how to set up and manage web application deployments when multiple versions of your application are in various environments, such as development, staging, quality assurance (QA), and production. Each version of your application can be considered as a development environment for the specific purpose of your deployment process. For example, developers can use the QA environment to test the quality of the application before they push the changes to production.
Multiple development environments can be a challenge because you need to track code, manage resources (compute, web app, database, cache, etc.), and deploy code across environments.

## Set up a non-production environment (stage, dev, QA)
After a production web app is up and running, the next step is to create a non-production environment. To use deployment slots, make sure that you are running in the Standard or Premium Azure App Service plan mode. Deployment slots are live web apps that have their own host names. Web app content and configuration elements can be swapped between two deployment slots, including the production slot. When you deploy your application to a deployment slot, you get the following benefits:

- You can validate changes to a web app in a staging deployment slot before you swap the app with the production slot.
- When you deploy a web app to a slot first and swap it into production, all instances of the slot are warmed up before being swapped into production. This process eliminates downtime when you deploy your web app. The traffic redirection is seamless, and no requests are dropped due to swap operations. To automate this entire workflow, configure [Auto Swap](web-sites-staged-publishing.md#configure-auto-swap) when pre-swap validation is not needed.
- After a swap, the slot that has the previously staged web app now has the previous production web app. If the changes swapped into the production slot are not as you expected, you can perform the same swap immediately to get your "last known good" web app back.

To set up a staging deployment slot, see [Set up staging environments for web apps in Azure App Service](web-sites-staged-publishing.md). Every environment should include its own set of resources. For example, if your web app uses a database, then both production and staging web apps should use different databases. Add staging development environment resources such as database, storage, or cache to set your staging development environment.

## Examples of using multiple development environments
Any project should follow source code management with at least two environments: development and production. If you use content management systems (CMSs), application frameworks, etc., the application might not support this scenario without customization. This eventuality is true for some of the popular frameworks that are discussed in the following sections. Lots of questions come to mind when you work with CMS/frameworks, such as:

- How do you break the content out into different environments?
- What files can you change without affecting framework version updates?
- How do you manage configurations per environment?
- How do you manage version updates for modules, plugins, and the core framework?

There are many ways to set up multiple environments for your project. The following examples show one method for each respective application.

### WordPress
In this section, you will learn how to set up a deployment workflow by using slots for WordPress. WordPress, like most CMS solutions, does not support multiple development environments without customization. The Web Apps feature of Azure App Service has a few features that make it easy to store configuration settings outside your code.

1. Before you create a staging slot, set up your application code to support multiple environments. To support multiple environments in WordPress, you need to edit `wp-config.php` on your local development web app and add the following code at the beginning of the file. This process will enable your application to pick the correct configuration based on the selected environment.

    ```
    // Support multiple environments
    // set the config file based on current environment
    if (strpos($_SERVER['HTTP_HOST'],'localhost') !== false) {
    // local development
     $config_file = 'config/wp-config.local.php';
    }
    elseif ((strpos(getenv('WP_ENV'),'stage') !== false) || (strpos(getenv('WP_ENV'),'prod' )!== false ))
    //single file for all azure development environments
     $config_file = 'config/wp-config.azure.php';
    }
    $path = dirname(__FILE__). '/';
    if (file_exists($path. $config_file)) {
    // include the config file if it exists, otherwise WP is going to fail
    require_once $path. $config_file;
    ```

2. Create a folder under web app root called `config`, and add the `wp-config.azure.php` and `wp-config.local.php` files, which represent your Azure environment and local environment respectively.

3. Copy the following in `wp-config.local.php`:

    ```
    <?php
    // MySQL settings
    /** The name of the database for WordPress */

    define('DB_NAME', 'yourdatabasename');

    /** MySQL database username */
    define('DB_USER', 'yourdbuser');

    /** MySQL database password */
    define('DB_PASSWORD', 'yourpassword');

    /** MySQL hostname */
    define('DB_HOST', 'localhost');
    /**
     * For developers: WordPress debugging mode.
     * * Change this to true to enable the display of notices during development.
     * It is strongly recommended that plugin and theme developers use WP_DEBUG
     * in their development environments.
     */
    define('WP_DEBUG', true);

    //Security key settings
    define('AUTH_KEY', 'put your unique phrase here');
    define('SECURE_AUTH_KEY','put your unique phrase here');
    define('LOGGED_IN_KEY','put your unique phrase here');
    define('NONCE_KEY', 'put your unique phrase here');
    define('AUTH_SALT', 'put your unique phrase here');
    define('SECURE_AUTH_SALT', 'put your unique phrase here');
    define('LOGGED_IN_SALT', 'put your unique phrase here');
    define('NONCE_SALT', 'put your unique phrase here');

    /**
     * WordPress Database Table prefix.
     *
     * You can have multiple installations in one database if you give each a unique
     * prefix. Only numbers, letters, and underscores please!
     */
    $table_prefix = 'wp_';
    ```

    Setting the security keys as illustrated in the previous code can help to prevent your web app from being hacked, so use unique values. If you need to generate the string for security keys mentioned in the code, you can [go to the automatic generator](https://api.wordpress.org/secret-key/1.1/salt) to create new key/value pairs.

4. Copy the following code in `wp-config.azure.php`:

    ```    
    <?php
    // MySQL settings
    /** The name of the database for WordPress */

    define('DB_NAME', getenv('DB_NAME'));

    /** MySQL database username */
    define('DB_USER', getenv('DB_USER'));

    /** MySQL database password */
    define('DB_PASSWORD', getenv('DB_PASSWORD'));

    /** MySQL hostname */
    define('DB_HOST', getenv('DB_HOST'));

    /**
    * For developers: WordPress debugging mode.
    *
    * Change this to true to enable the display of notices during development.
    * It is strongly recommended that plugin and theme developers use WP_DEBUG
    * in their development environments.
    * Turn on debug logging to investigate issues without displaying to end user. For WP_DEBUG_LOG to
    * do anything, WP_DEBUG must be enabled (true). WP_DEBUG_DISPLAY should be used in conjunction
    * with WP_DEBUG_LOG so that errors are not displayed on the page */

    */
    define('WP_DEBUG', getenv('WP_DEBUG'));
    define('WP_DEBUG_LOG', getenv('TURN_ON_DEBUG_LOG'));
    define('WP_DEBUG_DISPLAY',false);

    //Security key settings
    /** If you need to generate the string for security keys mentioned above, you can go the automatic generator to create new keys/values: https://api.wordpress.org/secret-key/1.1/salt **/
    define('AUTH_KEY',getenv('DB_AUTH_KEY'));
    define('SECURE_AUTH_KEY', getenv('DB_SECURE_AUTH_KEY'));
    define('LOGGED_IN_KEY', getenv('DB_LOGGED_IN_KEY'));
    define('NONCE_KEY', getenv('DB_NONCE_KEY'));
    define('AUTH_SALT', getenv('DB_AUTH_SALT'));
    define('SECURE_AUTH_SALT', getenv('DB_SECURE_AUTH_SALT'));
    define('LOGGED_IN_SALT',  getenv('DB_LOGGED_IN_SALT'));
    define('NONCE_SALT',  getenv('DB_NONCE_SALT'));

    /**
    * WordPress Database Table prefix.
    *
    * You can have multiple installations in one database if you give each a unique
    * prefix. Only numbers, letters, and underscores please!
    */
    $table_prefix = getenv('DB_PREFIX');
    ```

#### Use relative paths
One last thing to configure in the WordPress app is relative paths. WordPress stores URL information in the database. This storage makes moving content from one environment to another more difficult. You need to update the database every time you move from local to stage or stage to production environments. To reduce the risk of issues that can be caused with deploying a database every time you deploy from one environment to another, use the [Relative Root links plugin](https://wordpress.org/plugins/root-relative-urls/), which you can install by using the WordPress administrator dashboard.

Add the following entries to your `wp-config.php` file before the `That's all, stop editing!` comment:

```

  define('WP_HOME', 'http://'. filter_input(INPUT_SERVER, 'HTTP_HOST', FILTER_SANITIZE_STRING));
    define('WP_SITEURL', 'http://'. filter_input(INPUT_SERVER, 'HTTP_HOST', FILTER_SANITIZE_STRING));
    define('WP_CONTENT_URL', '/wp-content');
    define('DOMAIN_CURRENT_SITE', filter_input(INPUT_SERVER, 'HTTP_HOST', FILTER_SANITIZE_STRING));
```

Activate the plugin through the `Plugins` menu in WordPress administrator dashboard. Save your permalink settings for WordPress app.

#### The final `wp-config.php` file
Any WordPress core updates will not affect your `wp-config.php`, `wp-config.azure.php`, and `wp-config.local.php` files. Here's a final version of the `wp-config.php` file:

```
<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, and ABSPATH. You can find more information by visiting
 *
 * Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web web app, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// Support multiple environments
// set the config file based on current environment
if (strpos($_SERVER['HTTP_HOST'],'localhost') !== false) { // local development
  $config_file = 'config/wp-config.local.php';
}
elseif ((strpos(getenv('WP_ENV'),'stage') !== false) ||(strpos(getenv('WP_ENV'),'prod' )!== false )){
  $config_file = 'config/wp-config.azure.php';
}


$path = dirname(__FILE__). '/';
if (file_exists($path. $config_file)) {
  // include the config file if it exists, otherwise WP is going to fail
  require_once $path. $config_file;
}

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');


/* That's all, stop editing! Happy blogging. */

define('WP_HOME', 'http://'. $_SERVER['HTTP_HOST']);
define('WP_SITEURL', 'http://'. $_SERVER['HTTP_HOST']);
define('WP_CONTENT_URL', '/wp-content');
define('DOMAIN_CURRENT_SITE', $_SERVER['HTTP_HOST']);

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
    define('ABSPATH', dirname(__FILE__). '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH. 'wp-settings.php');
```

#### Set up a staging environment
1. If you already have a WordPress web app running on your Azure subscription, sign in to the [Azure portal](http://portal.azure.com), and then go to your WordPress web app. If you don't have a WordPress web app, you can create one from the Azure Marketplace. To learn more, see [Create a WordPress web app in Azure App Service](web-sites-php-web-site-gallery.md).
Click **Settings** > **Deployment slots** > **Add** to create a deployment slot with the name *stage*. A deployment slot is another web application that shares the same resources as the primary web app that you created previously.

    ![Create stage deployment slot](./media/app-service-web-staged-publishing-realworld-scenarios/1setupstage.png)

2. Add another MySQL database, say `wordpress-stage-db`, to your resource group, `wordpressapp-group`.

    ![Add MySQL database to resource group](./media/app-service-web-staged-publishing-realworld-scenarios/2addmysql.png)

3. Update the connection strings for your stage deployment slot to point to the new database, `wordpress-stage-db`. Your production web app, `wordpressprodapp`, and staging web app, `wordpressprodapp-stage`, must point to different databases.

#### Configure environment-specific app settings
Developers can store key/value string pairs in Azure as part of the configuration information, called **App Settings**, that's associated with a web app. At runtime, web apps automatically retrieve these values and make them available to code that's running in your web app. From a security perspective, that is a nice side benefit because sensitive information, such as database connection strings that include passwords, never show up as clear text in a file such as `wp-config.php`.

This process, which is explained in the following paragraphs, is useful because it includes both file changes and database changes for the WordPress app:

* WordPress version upgrade
* Add new or edit or upgrade plugins
* Add new or edit or upgrade themes

Configure app settings for:

* Database information
* Turning on/off WordPress logging
* WordPress security settings

![App Settings for Wordpress web app](./media/app-service-web-staged-publishing-realworld-scenarios/3configure.png)

Make sure that you add the following app settings for your production web app and stage slot. Note that the production web app and staging web app use different databases.

1. Clear the **Slot Setting** checkbox for all the settings parameters except WP_ENV. This process will swap the configuration for your web app, file content, and database. If **Slot Setting** is checked, the web app’s app settings and connection string configuration will *not* move across environments when doing a **Swap** operation. Any database changes that are present will not break your production web app.

2. Deploy the local development environment web app to the stage web app and database by using WebMatrix or tools of your choice, such as FTP, Git, or PhpMyAdmin.

    ![Web Matrix Publish dialog for WordPress web app](./media/app-service-web-staged-publishing-realworld-scenarios/4wmpublish.png)

3. Browse and test your staging web app. Considering a scenario where the theme of the web app is to be updated, here is the staging web app.

    ![Browse staging web app before swapping slots](./media/app-service-web-staged-publishing-realworld-scenarios/5wpstage.png)

4. If all looks good, click the **Swap** button on your staging web app to move your content to the production environment. In this case, you swap the web app and the database across environments during every **Swap** operation.

    ![Swap preview changes for WordPress](./media/app-service-web-staged-publishing-realworld-scenarios/6swaps1.png)

    > [!NOTE]
    > If your scenario needs to only push files (no database updates), then check **Slot Setting** for all the database-related *app settings* and *connection strings settings* in the **Web App Settings** blade within the Azure portal before doing the **Swap**. In this case, DB_NAME, DB_HOST, DB_PASSWORD, DB_USER, and default connection string settings should not show up in preview changes when you do a **Swap**. At this time, when you complete the **Swap** operation, the WordPress web app will have the updates files only.
    >
    >

    Before doing a **Swap**, here is the production WordPress web app.
    ![Production web app before swapping slots](./media/app-service-web-staged-publishing-realworld-scenarios/7bfswap.png)

    After the **Swap** operation, the theme has been updated on your production web app.

    ![Production web app after swapping slots](./media/app-service-web-staged-publishing-realworld-scenarios/8afswap.png)

5. When you need to roll back, you can go to the production web **App Settings**, and click the **Swap** button to swap the web app and database from production to staging slot. Remember that if database changes are included with a **Swap** operation, then the next time you deploy to your staging web app, you need to deploy the database changes to the current database for your staging web app. The current database might be the previous production database or the stage database.

#### Summary
Following is a generalized process for any application that has a database:

1. Install the application on your local environment.
2. Include environment-specific configurations (local and Azure Web Apps).
3. Set up your staging and production environments for Web Apps.
4. If you have a production application already running on Azure, sync your production content (files/code and database) to local and staging environments.
5. Develop your application on your local environment.
6. Place your production web app under maintenance or locked mode, and sync database content from production to staging and dev environments.
7. Deploy to the staging environment and test.
8. Deploy to production environment.
9. Repeat steps 4 through 6.

### Umbraco
In this section, you will learn how the Umbraco CMS uses a custom module to deploy across multiple DevOps environments. This example provides a different approach to managing multiple development environments.

[Umbraco CMS](http://umbraco.com/) is a popular .NET CMS solution that's used by many developers. It provides the [Courier2](http://umbraco.com/products/more-add-ons/courier-2) module to deploy from development to staging to production environments. You can easily create a local development environment for an Umbraco CMS web app by using Visual Studio or WebMatrix.

- [Create an Umbraco web app with Visual Studio](https://our.umbraco.org/documentation/Installation/install-umbraco-with-nuget)
- [Create an Umbraco web app with WebMatrix](http://umbraco.tv/videos/umbraco-v7/implementor/fundamentals/installation/creating-umbraco-site-from-webmatrix-web-gallery/)

Always remember to remove the `install` folder under your application, and never upload it to stage or production web apps. This tutorial uses WebMatrix.

#### Set up a staging environment
1. Create a deployment slot as mentioned previously for the Umbraco CMS web app, assuming you already have an Umbraco CMS web app up and running. If you do not, you can create one from the Marketplace.
2. Update the connection string for your stage deployment slot to point to the new **umbraco-stage-db** database. Your production web app (umbraositecms-1) and staging web app (umbracositecms-1-stage) *must* point to different databases.

    ![Update Connection string for staging web app with new staging database](./media/app-service-web-staged-publishing-realworld-scenarios/9umbconnstr.png)

3. Click **Get Publish settings** for the deployment slot **stage**. This process will download a publish settings file that stores all the information that Visual Studio or WebMatrix requires to publish your application from the local development web app to the Azure web app.

    ![Get publish setting of the staging web app](./media/app-service-web-staged-publishing-realworld-scenarios/10getpsetting.png)
4. Open your local development web app in WebMatrix or Visual Studio. This tutorial uses WebMatrix. First, you need to import the publish settings file for your staging web app.

    ![Import Publish settings for Umbraco using Web Matrix](./media/app-service-web-staged-publishing-realworld-scenarios/11import.png)

5. Review changes in the dialog box, and deploy your local web app to your Azure web app, *umbracositecms-1-stage*. When you deploy files directly to your staging web app, you will omit files in the `~/app_data/TEMP/` folder because these files will be regenerated when the stage web app is first started. You should also omit the `~/app_data/umbraco.config` file, which will also be regenerated.

    ![Review Publish changes in web matrix](./media/app-service-web-staged-publishing-realworld-scenarios/12umbpublish.png)

6. After you successfully publish the Umbraco local web app to the staging web app, browse to your staging web app, and run a few tests to rule out any issues.

#### Set up the Courier2 deployment module
With the [Courier2](http://umbraco.com/products/more-add-ons/courier-2) module, you can simply right-click to push content, style sheets, and development modules from a staging web app to a production web app. This process reduces the risk of breaking your production web app when you deploy an update.
Purchase a license for Courier2 for the `*.azurewebsites.net` domain and your custom domain (say http://abc.com). After you purchase the license, place the downloaded license (.LIC file) in the `bin` folder.

![Drop license file under bin folder](./media/app-service-web-staged-publishing-realworld-scenarios/13droplic.png)

1. [Download the Courier2 package](https://our.umbraco.org/projects/umbraco-pro/umbraco-courier-2/). Sign in to your stage web app, say http://umbracocms-site-stage.azurewebsites.net/umbraco, click the **Developer** menu, and then click **Packages** > **Install local package**.

    ![Umbraco Package installer](./media/app-service-web-staged-publishing-realworld-scenarios/14umbpkg.png)

2. Upload the Courier2 package by using the installer.

    ![Upload package for courier module](./media/app-service-web-staged-publishing-realworld-scenarios/15umbloadpkg.png)

3. To configure the package, you need to update the courier.config file under the **Config** folder of your web app.

    ```xml
    <!-- Repository connection settings -->
     <!-- For each site, a custom repository must be configured, so Courier knows how to connect and authenticate-->
     <repositories>
        <!-- If a custom Umbraco Membership provider is used, specify login & password + set the passwordEncoding to clear: -->
        <repository name="production web app" alias="stage" type="CourierWebserviceRepositoryProvider" visible="true">
          <url>http://umbracositecms-1.azurewebsites.net</url>
          <user>0</user>
          <!--<login>user@email.com</login> -->
          <!-- <password>user_password</password>-->
          <!-- <passwordEncoding>Clear</passwordEncoding>-->
          </repository>
     </repositories>
     ```

4. Under `<repositories>`, enter the production site URL and user information.
    If you are using the default Umbraco membership provider, then add the ID for the Administration user in the &lt;user&gt; section.
    If you are using a custom Umbraco membership provider, use `<login>`,`<password>` in the Courier2 module to connect to the production site.
    For more details, [review the documentation for the Courier2 module](http://umbraco.com/help-and-support/customer-area/courier-2-support-and-download/developer-documentation).

5. Similarly, install the Courier2 module on your production site, and configure it to point to the stage web app in its respective courier.config file as shown here.

    ```xml
     <!-- Repository connection settings -->
     <!-- For each site, a custom repository must be configured, so Courier knows how to connect and authenticate-->
     <repositories>
        <!-- If a custom Umbraco Membership provider is used, specify login & password + set the passwordEncoding to clear: -->
        <repository name="Stage web app" alias="stage" type="CourierWebserviceRepositoryProvider" visible="true">
          <url>http://umbracositecms-1-stage.azurewebsites.net</url>
          <user>0</user>
          </repository>
     </repositories>
    ```

6. Click the **Courier2** tab in the Umbraco CMS web app dashboard, and then click **Locations**. You should see the repository name as mentioned in `courier.config`. Do this process on both your production and staging web apps.

    ![View destination web app repository](./media/app-service-web-staged-publishing-realworld-scenarios/16courierloc.png)

7. To deploy content from the staging site to the production site, go to **Content**, and select an existing page or create a new page. I will select an existing page from my web app where the title of the page is **Getting Started – new**, and then click **Save and Publish**.

    ![Change Title of page and publish](./media/app-service-web-staged-publishing-realworld-scenarios/17changepg.png)

8. Right-click the modified page to view all the options. Click **Courier** to open the **Deployment** dialog box. Click **Deploy** to initiate deployment.

    ![Courier module deployment dialog](./media/app-service-web-staged-publishing-realworld-scenarios/18dialog1.png)

9. Review the changes, and then click **Continue**.

    ![Courier module deployment dialog review changes](./media/app-service-web-staged-publishing-realworld-scenarios/19dialog2.png)

    The deployment log shows if the deployment was successful.

     ![View Deployment logs from Courier module](./media/app-service-web-staged-publishing-realworld-scenarios/20successdlg.png)

10. Browse your production web app to see if the changes are reflected.

     ![Browse production web app](./media/app-service-web-staged-publishing-realworld-scenarios/21umbpg.png)

To learn more about how to use Courier, review the documentation.

#### How to upgrade the Umbraco CMS version
Courier will not help you upgrade from one version of Umbraco CMS to another. When you upgrade an Umbraco CMS version, you must check for incompatibilities with your custom modules or modules from partners and the Umbraco Core libraries. Here are best practices:

* Always back up your web app and database before you upgrade. On web apps in Azure, you can set up automatic backups for your websites by using the backup feature and restore your site if needed by using the restore feature. For more details, see [How to back up your web app](web-sites-backup.md) and [How to restore your web app](web-sites-restore.md).
* Check if packages from partners are compatible with the version you're upgrading to. On the package's download page, review the project compatibility with Umbraco CMS version.

For more details about how to upgrade your web app locally, [see the general upgrade guidance](https://our.umbraco.org/documentation/getting-started/setup/upgrading/general).

After your local development site is upgraded, publish the changes to the staging web app. Test your application. If all looks good, use the **Swap** button to swap your staging site to the production web app. When you use the **Swap** operation, you can view the changes that will be affected in your web app's configuration. This **Swap** operation swaps the web apps and databases. After the **Swap**, the production web app will point to the umbraco-stage-db database, and the staging web app will point to umbraco-prod-db database.

![Swap preview for deploying Umbraco CMS](./media/app-service-web-staged-publishing-realworld-scenarios/22umbswap.png)

Here are advantages of swapping both the web app and the database:

* You can roll back to the previous version of your web app with another **Swap** if there are any application issues.
* For an upgrade, you need to deploy files and databases from the staging web app to the production web app and database. Many things can go wrong when you deploy files and databases. By using the **Swap** feature of slots, we can reduce downtime during an upgrade and reduce the risk of failures that can occur when you deploy changes.
* You can do **A/B testing** by using the [Testing in production](https://azure.microsoft.com/documentation/videos/introduction-to-azure-websites-testing-in-production-with-galin-iliev/) feature.

This example shows you the flexibility of the platform where you can build custom modules similar to Umbraco Courier module to manage deployment across environments.

## References
[Agile software development with Azure App Service](app-service-agile-software-development.md)

[Set up staging environments for web apps in Azure App Service](web-sites-staged-publishing.md)

[How to block web access to non-production deployment slots](http://ruslany.net/2014/04/azure-web-sites-block-web-access-to-non-production-deployment-slots/)
