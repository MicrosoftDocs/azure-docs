---
title: Open source technologies issues for Azure Web Apps FAQ| Microsoft Docs
description: This article lists the frequently asked questions about open Source technologies in Azure Web Apps.
services: app-service\web
documentationcenter: ''
author: simonxjx
manager: cshepard
editor: ''
tags: top-support-issue

ms.assetid: 2fa5ee6b-51a6-4237-805f-518e6c57d11b
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 5/16/2017
ms.author: v-six

---


# Open source technologies issues for Azure Web Apps: Frequently asked questions (FAQs)

This article includes frequently asked questions about open source technologies issues for [Azure Web Apps](https://azure.microsoft.com/services/app-service/web/).

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## My ClearDB database is down
Please contact [ClearDB Support](https://www.cleardb.com/developers/help/support) for any database related issues. Also please refer to the [ClearDB FAQ](https://docs.microsoft.com/azure/store-cleardb-faq/) which answers several questions.

## Why is my ClearDB database not visible in the portal

If you create ClearDB database using the new [Azure portal](http://portal.azure.com/), it will not be visible in the [classic Azure portal](http://manage.windowsazure.com/).

To workaround this, link your database manually to the web app.

Similarly if you create ClearDB database in the [classic Azure portal](http://manage.windowsazure.com/)  you will not be able to see your database in the new [Azure portal](http://portal.azure.com/). There is no workaround for this scenario. For more details, see [FAQ for ClearDB MySql databases with Azure App Service](https://docs.microsoft.com/azure/store-cleardb-faq/).

## Why was my ClearDB database not migrated during subscription migration

When you perform resource migration across subscriptions, some limitations apply.

ClearDB MySQL database is a third party service and hence does not get migrated during Azure subscription migration.

If you do not manage the migration of your MySQL database prior to migrating Azure resources, your ClearDB MySQL databases can be disabled. To avoid this, you need to manually migrate your databases first and then perform Azure subscription migration for your web app.

FAQ for ClearDB MySql databases with Azure App Service can be found [here](https://docs.microsoft.com/azure/store-cleardb-faq/).

## How can I enable PHP logging to troubleshoot PHP issues

1. Log into KUDU website at https://*yourwebsitename*.scm.azurewebsites.net.
2. In the top menu select **Debug Console** | **CMD**.
3. Click on **Site** folder.
4. Click on **wwwroot** folder.
5. Click on + icon and **New File**.
6. Set the file name as **.user.ini**.
7. Click on the pencil icon next to .user.ini.
8. Add this text ```log_errors=on```.
9. Click save button.
10. Next, click on pencil icon next to **wp-config.php**.
11. Change the text as shown below.
   ```
   //Enable WP_DEBUG modedefine('WP_DEBUG', true);//Enable Debug Logging to /wp-content/debug.logdefine('WP_DEBUG_LOG', true);
   //Supress errors and warnings to screendefine('WP_DEBUG_DISPLAY', false);//Supress PHP errors to screenini_set('display_errors', 0);
   ```
12. Restart your web app from the web app menu in Azure Portal.

For more details, see [Enable WordPress Error Logs](https://blogs.msdn.microsoft.com/azureossds/2015/10/09/logging-php-errors-in-wordpress-2/).

## How can I log Python application errors in apps hosted in Azure App Service?

The following are the steps to capture Python application errors:
1. Navigate to your new azure portal and click on settings in your Web App.
2. Click on Application Settings in Settings Tab.
3. Enter below Key/Value pair under App Settings in Application Settings tab:
    * Key : WSGI_LOG
    * Value : D:\home\site\wwwroot\logs.txt (Enter your choice of file name)
4. Now you should be able to see errors in logs.txt file in wwwroot folder.

## How can I change the version of node.js application hosted in Azure App Service?

You can use one of these approaches to change the version of node.js application.

1. Using App Setting.
    * Navigate to your web app in Azure Portal.
    * Click on Application settings in Settings blade.
    * You can include WEBSITE_NODE_DEFAULT_VERSION as key and version of nodejs you want as value in app setting.
    * Navigate to kudu console (http://.scm.azurewebsites.net) and you can check the nodejs version using below command.  
   ```
   node -v
   ```
2. Using iisnode.yml file, changing nodejs version in iisnode.yml file would only set the run-time environment which iisnode uses. Your kudu cmd and others would still use nodejs version set at app settings.
    * Setting iisnode.yml file manually.
    Create a iisnode.yml file in your app root folder and include below line:
   ```
   nodeProcessCommandLine: "D:\Program Files (x86)\nodejs\5.9.1\node.exe"
   ```
3. Setting iisnode.yml file using package.json during source control deployment.
Azure Source Control deployment process would involve below steps:
    * Moves content to azure web app.
    * Creates default deployment script, if there isn’t one(deploy.cmd, .deployment files) in web app root folder.
    * Run’s deployment script where it creates iisnode.yml file if we mention nodejs version in package.json file > engine  `"engines": {"node": "5.9.1","npm": "3.7.3"}`
    * iisnode.yml would have below line of code:
      ```
      nodeProcessCommandLine: "D:\Program Files (x86)\nodejs\5.9.1\node.exe"
      ```

## I am getting 'Error establishing a database connection' in my WordPress app hosted in Azure App Service. How can I troubleshoot it?

If you’re receiving this error in your Azure WordPress Application, please enable php_errors.log and debug.log by following the steps outlined [here](https://blogs.msdn.microsoft.com/azureossds/2015/10/09/logging-php-errors-in-wordpress-2/).

Once the logs are enabled, reproduce the error and check the logs to see if you are running out of connections.
```
[09-Oct-2015 00:03:13 UTC] PHP Warning: mysqli_real_connect(): (HY000/1226): User ‘abcdefghijk79' has exceeded the ‘max_user_connections’ resource (current value: 4) in D:\home\site\wwwroot\wp-includes\wp-db.php on line 1454
```

If you see this error in your debug.log or php_errors.log, then your application is exceeding the number of connections. If you’re hosting on ClearDB, please verify that number of connections available in your [service plan](https://www.cleardb.com/pricing.view).

## How can I debug Node.js app hosted in Azure App Service?

* Navigate to kudu console (https://*Your_Webapp_name*.scm.azurewebsites.net/DebugConsole).
* Browse your Application Logs folder available @ D:\home\LogFiles\Application.
* Check for content in logging_errors.txt file.

## Installing Native Python modules on Azure App service Web Apps or API Apps

Some packages may not install using pip when run on Azure. It may simply be that the package is not available on the Python Package Index. Or it could be that a compiler is required (a compiler is not available on the machine running the web app in Azure App Service). This [blog article](https://blogs.msdn.microsoft.com/azureossds/2015/06/29/install-native-python-modules-on-azure-web-apps-api-apps/) provides guidance on installing native modules on Azure App Service Web Apps and API Apps.

## Deploying Django App to Azure App Services using Git and new version of Python

For guidance on installing Django, see [Deploying Django App to Azure App Services using Git and new version of Python](https://blogs.msdn.microsoft.com/azureossds/2016/08/25/deploying-django-app-to-azure-app-services-using-git-and-new-version-of-python/).

## Where is the location of Tomcat Log files?

* For MarketPlace/Gallery/Custom Deployment:
    * Folder location:
    ```D:\home\site\wwwroot\bin\apache-tomcat-8.0.33\logs```
    * Files of interest
        1. catalina.yyyy-mm-dd.log
        2. host-manager.yyyy-mm-dd.log
        3. localhost.yyyy-mm-dd.log
        4. manager.yyyy-mm-dd.log
        5. site_access_log.yyyy-mm-dd.log
* For Portal AppSetting Deployment:
    * Folder Location
    ```D:\home\LogFiles```
    * Files of Interest
        * catalina.yyyy-mm-dd.log
        * host-manager.yyyy-mm-dd.log
        * localhost.yyyy-mm-dd.log
        * manager.yyyy-mm-dd.log
        * site_access_log.yyyy-mm-dd.log

## How can I troubleshoot JDBC driver connection errors?

If you are observing the following error in the tomcat logs:

```
The web application[ROOT] registered the JDBC driver [com.mysql.jdbc.Driver] but failed to unregister it when the web application was stopped. To prevent a memory leak,the JDBC Driver has been forcibly unregistered
```

Please follow the below steps:
1. Remove the sqljdbc*.jar from your app/lib folder.
2. If you are using the custom tomcat or market tomcat webserver, copy this jar tothe tomcat’s lib folder.
3. If you are enabling the Java from the Azure portal (by choosing the Java 1.8 and then Tomcat server),
copy the sqljdbc.* jar in folder parallel to your app and add the following classpath setting in your web.config:

```
<httpPlatform>
 <environmentVariables>
 <environmentVariablename ="JAVA_OPTS" value=" -Djava.net.preferIPv4Stack=true
 -Xms128M -classpath %CLASSPATH%;[Path to the sqljdbc*.jarfile]" />
 </environmentVariables>
 </httpPlatform>
```

## Why do I see errors when attempting to copy live log files?

When trying to copy live log files for a Java app, e.g. Tomcat, you may run into an FTP error as below:

```
Error transferring file [filename] Copying files from remote side failed.

The process cannot access the file because it is being used by another process.
```

Error might be slightly different depending on FTP client.

All Java apps have this locking issue and only Kudu will allow downloading this file while the app is running.

Stopping the app will allow FTP access to these files.

Another workaround is to write a webjob that runs on a schedule and copies these files to a different directory. You can find a sample project via [here](https://github.com/kamilsykora/CopyLogsJob).

## Where can I find the log files for Jetty?

For **MarketPlace/Gallery/Custom Deployment**, the log file location is D:\home\site\wwwroot\bin\jetty-distribution-9.1.2.v20140210\logs. Please note that the folder location changes with version of Jetty you are using. For example, the path provided above is for Jetty 9.1.2.  Please look for jetty_YYYY_MM_DD.stderrout.log

For **Portal AppSetting Deployment**, the log file location D:\home\LogFiles. Please look for jetty_YYYY_MM_DD.stderrout.log

## How can I send email from Azure web apps?

Azure App Services does not have a built-in email feature. But you can find some good approaches at the StackOverflow discussion at via [here](http://stackoverflow.com/questions/17666161/sending-email-from-azure).

## Why is my WordPress site redirecting to another URL?

If you have recently migrated to Azure, WordPress may redirect to the old domain URL. This is caused by a setting on the MySQL database.

WordPress Buddy+ is a Site Extension on Azure that can be used to update the redirection URL directly on the database. Follow [WordPress Tools and MySQL Migration with WordPress Buddy+](https://blogs.msdn.microsoft.com/azureossds/2016/12/21/wordpress-tools-and-mysql-migration-with-wordpress-buddy/) for more information on using WordPress Buddy+.

Alternatively, if you prefer to do this manually through SQL queries or PHPMyAdmin, follow the instructions [here](https://blogs.msdn.microsoft.com/azureossds/2016/07/12/wordpress-redirecting-to-wrong-url/).

## How do I change my WordPress login password?

If you have forgotten your WordPress login password, WordPress Buddy+ can be used to update it. Install this Site Extension through the Extensions Gallery and follow the steps [here](https://blogs.msdn.microsoft.com/azureossds/2016/12/21/wordpress-tools-and-mysql-migration-with-wordpress-buddy/) for resetting your password.

## Can't login to WordPress?

If you find yourself locked out of WordPress after a recently installed plugin, you may have a bad plugin. WordPress Buddy+ is an Azure Site Extension that can help disable plugins within WordPress. More information on it [here](https://blogs.msdn.microsoft.com/azureossds/2016/12/21/wordpress-tools-and-mysql-migration-with-wordpress-buddy/).

## How do I migrate my WordPress database?

There are multiple ways to migrate the MySQL database connected to your WordPress site.
* For developers: [command line or PHPMyAdmin](https://blogs.msdn.microsoft.com/azureossds/2016/03/02/migrating-data-between-mysql-databases-using-kudu-console-azure-app-service/)
* For non-developers: [using WordPress Buddy+](https://blogs.msdn.microsoft.com/azureossds/2016/12/21/wordpress-tools-and-mysql-migration-with-wordpress-buddy/)

## How do I secure WordPress?

Best Practices for WordPress security can be found here: https://blogs.msdn.microsoft.com/azureossds/2016/12/26/best-practices-for-wordpress-security-on-azure/

## I am trying to use PHPMyAdmin and getting “Access denied” error. How can I resolve it?

You may be running into this issue because MySQL in-App may not be running on this instance yet. Please try accessing your site which will spawn the required processes and also start MySQL in-App process. You can confirm that MySQL in-App is running by looking at Process Explorer and ensuring mysqld.exe is listed in the processes.

Once you ensure MySQL in-App is running, please try using PHPMyAdmin.

## I am unable to import or export MySQL in-App database using PHPMyadmin. I am getting HTTP 403 error. How can I resolve it?

If you are using an older version of Chrome,  you may be running into a known bug. Please upgrade to a newer version to resolve the issue.  You can also try using a different browser like Internet Explorer or Edge where the issue does not occur.
