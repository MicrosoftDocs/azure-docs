---
title: Open-source technologies FAQs for Azure web apps | Microsoft Docs
description: Get answers to frequently asked questions about open-source technologies in the Web Apps feature of Azure App Service.
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


# Open-source technologies FAQs for App Service web apps

This article has answers to frequently asked questions (FAQs) about open-source technologies issues for the [Web Apps feature of Azure App Service](https://azure.microsoft.com/services/app-service/web/).

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## My ClearDB database is down. How do I resolve this?

For database-related issues, contact [ClearDB Support](https://www.cleardb.com/developers/help/support). Also, see the [ClearDB FAQ](https://docs.microsoft.com/azure/store-cleardb-faq/). The ClearDB FAQ answers several questions that might be helpful.

## Why is my ClearDB database not visible in the portal?

If you create a ClearDB database by using the new [Azure portal](http://portal.azure.com/), it won't show up in the [classic Azure portal](http://manage.windowsazure.com/).

To work around this, link your database manually to the web app.

Similarly, if you create a ClearDB database in the [classic Azure portal](http://manage.windowsazure.com/),  you won't see your database in the new [Azure portal](http://portal.azure.com/). There is no workaround for this scenario. For more information, see [FAQ for ClearDB MySql databases with Azure App Service](https://docs.microsoft.com/azure/store-cleardb-faq/).

## Why wasn't my ClearDB database migrated during the subscription migration?

When you perform resource migration across subscriptions, some limitations apply.

ClearDB MySQL database is a third-party service and hence does not get migrated during Azure subscription migration.

If you do not manage the migration of your MySQL database prior to migrating Azure resources, your ClearDB MySQL databases can be disabled. To avoid this, you need to manually migrate your databases first and then perform Azure subscription migration for your web app.

For more information, see the [FAQs for ClearDB MySql databases with App Service](https://docs.microsoft.com/azure/store-cleardb-faq/).

## How can I enable PHP logging to troubleshoot PHP issues?

1. Sign in to the [KUDU website](https://*yourwebsitename*.scm.azurewebsites.net).
2. In the top menu, select **Debug Console** > **CMD**.
3. Select the **Site** folder.
4. Select the **wwwroot** folder.
5. Select the **+** icon, and then select **New File**.
6. Set the file name to **.user.ini**.
7. Select the pencil icon next to **.user.ini**.
8. Add this text: ```log_errors=on```.
9. Select **Save**.
10. Select the pencil icon next to **wp-config.php**.
11. Change the text to the following code:

   ```
   //Enable WP_DEBUG modedefine('WP_DEBUG', true);//Enable Debug Logging to /wp-content/debug.logdefine('WP_DEBUG_LOG', true);
   //Supress errors and warnings to screendefine('WP_DEBUG_DISPLAY', false);//Supress PHP errors to screenini_set('display_errors', 0);
   ```
12. In the web app menu in the Azure portal, restart your web app.

For more information, see [Enable WordPress error logs](https://blogs.msdn.microsoft.com/azureossds/2015/10/09/logging-php-errors-in-wordpress-2/).

## How do I log Python application errors in apps that are hosted in App Service?

To capture Python application errors:

1. In the Azure portal, in your web app, select **Settings**.
2. On the **Settings** tab, select **Application Settings**.
3. Under **App Settings**, enter the following Key/Value pair:
    * Key : WSGI_LOG
    * Value : D:\home\site\wwwroot\logs.txt (Enter your choice of file name)
4. You should be able to see errors in the Logs.txt file in the wwwroot folder.

## How do I change the version of the Node.js application that is hosted in App Service?

You can use one of the following options to change the version of the Node.js application.

1. In the Azure portal, by using **App Setting**.
    1. In the Azure portal, go to your web app.
    2. On the **Settings** blade, select **Application settings**.
    3. You can include WEBSITE_NODE_DEFAULT_VERSION as the key, and the version of Node.js you want as the value in **App Setting**.
    4. Go to the [Kudu console](http://.scm.azurewebsites.net).
    5. To check the Nodejs version, enter the following command:  
   ```
   node -v
   ```
2. In the iisnode.yml file. Changing the Node.js version in iisnode.yml file only sets the runtime environment that iisnode uses. Your Kudu cmd and others would still use the Node.js version that is set in **App Settings** in the Azure portal.

To set the iisnode.yml manually, create an iisnode.yml file in your app root folder. In the file, include the following line:
   ```
   nodeProcessCommandLine: "D:\Program Files (x86)\nodejs\5.9.1\node.exe"
   ```
3. Set the iisnode.yml file by using package.json during source control deployment.
The Azure Source Control deployment process involves the following steps:
  1. Moves content to the Azure web app.
  2. Creates a default deployment script, if there isn’t one (deploy.cmd, .deployment files) in the web app root folder.
  3. Run’s deployment script in which it creates an iisnode.yml file if you mention the Node.js version in the package.json file > engine  `"engines": {"node": "5.9.1","npm": "3.7.3"}`
  4. iisnode.yml has the following line of code:
      ```
      nodeProcessCommandLine: "D:\Program Files (x86)\nodejs\5.9.1\node.exe"
      ```

## I am seeing "Error establishing a database connection" in my WordPress app that's hosted in App Service. How do I troubleshoot this?

If you see this error in your Azure WordPress application, follow the steps in [Enable WordPress Error Logs](https://blogs.msdn.microsoft.com/azureossds/2015/10/09/logging-php-errors-in-wordpress-2/) to enable php_errors.log and debug.log.

When the logs are enabled, reproduce the error, and then check the logs to see if you are running out of connections.
```
[09-Oct-2015 00:03:13 UTC] PHP Warning: mysqli_real_connect(): (HY000/1226): User ‘abcdefghijk79' has exceeded the ‘max_user_connections’ resource (current value: 4) in D:\home\site\wwwroot\wp-includes\wp-db.php on line 1454
```

If you see this error in your debug.log or php_errors.log files, your application is exceeding the number of connections. If you’re hosting on ClearDB, verify the number of connections that are available in your [service plan](https://www.cleardb.com/pricing.view).

## How do I debug a Node.js app that's hosted in App Service?

* Go to your Kudu console (https://*Your_Webapp_name*.scm.azurewebsites.net/DebugConsole).
* Go to your Application Logs folder (D:\home\LogFiles\Application).
* Check for content in the logging_errors.txt file.

## How do I install native Python modules in an App Service web app or API app?

Some packages might not install by using pip when run on Azure. It might be that the package is not available on the Python Package Index. Or it might be that a compiler is required (a compiler is not available on the computer that is running the web app in App Service). For guidance on installing native modules in App Service web apps and API apps, see [Install Python modules on Azure App Service](https://blogs.msdn.microsoft.com/azureossds/2015/06/29/install-native-python-modules-on-azure-web-apps-api-apps/).

## How do I deploy a Django app to App Services by using Git and the new version of Python?

For guidance on installing Django, see [Deploying a Django app to Azure App Service](https://blogs.msdn.microsoft.com/azureossds/2016/08/25/deploying-django-app-to-azure-app-services-using-git-and-new-version-of-python/).

## Where are the Tomcat log files located?

For Marketplace, Gallery, and custom deployments:

* Folder location: D:\home\site\wwwroot\bin\apache-tomcat-8.0.33\logs
* Files of interest:
    * catalina.yyyy-mm-dd.log
    * host-manager.yyyy-mm-dd.log
    * localhost.yyyy-mm-dd.log
    * manager.yyyy-mm-dd.log
    * site_access_log.yyyy-mm-dd.log


For portal App Setting deployments:

* Folder location: D:\home\LogFiles
* Files of interest:
    * catalina.yyyy-mm-dd.log
    * host-manager.yyyy-mm-dd.log
    * localhost.yyyy-mm-dd.log
    * manager.yyyy-mm-dd.log
    * site_access_log.yyyy-mm-dd.log

## How can I troubleshoot JDBC driver connection errors?

If you see the following message in the Tomcat logs:

```
The web application[ROOT] registered the JDBC driver [com.mysql.jdbc.Driver] but failed to unregister it when the web application was stopped. To prevent a memory leak,the JDBC Driver has been forcibly unregistered
```

Follow these steps:

1. Remove the sqljdbc*.jar file from your app/lib folder.
2. If you are using the custom Tomcat or Marketplace Tomcat web server, copy this .jar file to the Tomcat lib folder.
3. If you are enabling Java from the Azure portal (by selecting **Java 1.8** and then **Tomcat server**), copy the sqljdbc.* jar file in the folder that's parallel to your app. Then, add the following classpath setting to web.config:

```
<httpPlatform>
 <environmentVariables>
 <environmentVariablename ="JAVA_OPTS" value=" -Djava.net.preferIPv4Stack=true
 -Xms128M -classpath %CLASSPATH%;[Path to the sqljdbc*.jarfile]" />
 </environmentVariables>
 </httpPlatform>
```

## Why do I see errors when I attempt to copy live log files?

When trying to copy live log files for a Java app, e.g. Tomcat, you may run into an FTP error as below:

```
Error transferring file [filename] Copying files from remote side failed.

The process cannot access the file because it is being used by another process.
```

The error message might be vary, depending on the FTP client.

All Java apps have this locking issue. Only Kudu allows downloading this file while the app is running.

Stopping the app allows FTP access to these files.

Another workaround is to write a WebJob that runs on a schedule and copies these files to a different directory. For a sample project, see the [CopyLogsJob](https://github.com/kamilsykora/CopyLogsJob) project.

## Where do I find the log files for Jetty?

For **MarketPlace/Gallery/Custom Deployment**, the log file is located in D:\home\site\wwwroot\bin\jetty-distribution-9.1.2.v20140210\logs. Note that the folder location depends on the version of Jetty you are using. For example, the path provided here is for Jetty 9.1.2. Look for jetty_YYYY_MM_DD.stderrout.log.

For **Portal AppSetting Deployment**, the log file location D:\home\LogFiles. Please look for jetty_YYYY_MM_DD.stderrout.log

## How can I send email from my Azure web app?

App Services doesn't have a built-in email feature. But, you can find some good approaches to sending email from your app in this [StackOverflow discussion](http://stackoverflow.com/questions/17666161/sending-email-from-azure).

## Why is my WordPress site redirecting to another URL?

If you have recently migrated to Azure, WordPress might redirect to the old domain URL. This is caused by a setting on the MySQL database.

WordPress Buddy+ is a Site Extension on Azure that you can use to update the redirection URL directly in the database. For more information about using WordPress Buddy+, follow [WordPress Tools and MySQL Migration with WordPress Buddy+](https://blogs.msdn.microsoft.com/azureossds/2016/12/21/wordpress-tools-and-mysql-migration-with-wordpress-buddy/).

Alternatively, if you prefer to do this manually through SQL queries or PHPMyAdmin, follow the instructions [here](https://blogs.msdn.microsoft.com/azureossds/2016/07/12/wordpress-redirecting-to-wrong-url/).

## How do I change my WordPress login password?

If you have forgotten your WordPress login password, WordPress Buddy+ can be used to update it. Install this Site Extension through the Extensions Gallery and follow the steps [here](https://blogs.msdn.microsoft.com/azureossds/2016/12/21/wordpress-tools-and-mysql-migration-with-wordpress-buddy/) for resetting your password.

## I can't sign in to WordPress. How do I resolve this?

If you find yourself locked out of WordPress after recently installing a plugin, you might have a faulty plugin. WordPress Buddy+ is an Azure Site Extension that can help you disable plugins in WordPress. For more information, see [WordPress Tools and MySQL Migration with WordPress Buddy+](https://blogs.msdn.microsoft.com/azureossds/2016/12/21/wordpress-tools-and-mysql-migration-with-wordpress-buddy/).

## How do I migrate my WordPress database?

There are multiple ways to migrate the MySQL database that's connected to your WordPress website.

* For developers: [Command line or PHPMyAdmin](https://blogs.msdn.microsoft.com/azureossds/2016/03/02/migrating-data-between-mysql-databases-using-kudu-console-azure-app-service/)
* For non-developers: [WordPress Buddy+](https://blogs.msdn.microsoft.com/azureossds/2016/12/21/wordpress-tools-and-mysql-migration-with-wordpress-buddy/)

## How do I help make WordPress more secure?

pTo learn about best practices for WordPress, see [Best Practices for WordPress security in Azure](https://blogs.msdn.microsoft.com/azureossds/2016/12/26/best-practices-for-wordpress-security-on-azure/).

## I am trying to use PHPMyAdmin and seeing an “Access denied” message. How do I resolve this?

You might experience this issue if MySQL in-App isn't running on this App Service instance yet. Try to access your website, which starts the required processes. It also starts the MySQL in-App process. To verify that MySQL in-App is running, in Process Explorer, ensure that mysqld.exe is listed in the processes.

After you ensure that MySQL in-App is running, try to use PHPMyAdmin.

## I get an HTTP 403 error when I try to import or export my MySQL in-App database by using PHPMyadmin. How do I resolve this?

If you are using an older version of Chrome, you might be experiencing a known bug. To resolve the issue, upgrade to a newer version. You can also try using a different browser, like Internet Explorer or Edge, where the issue does not occur.
