---
title: Open-source technologies FAQs
description: Get answers to frequently asked questions about open-source technologies in Azure App Service.
author: genlin
manager: dcscontentpm
tags: top-support-issue

ms.assetid: 2fa5ee6b-51a6-4237-805f-518e6c57d11b
ms.topic: article
ms.date: 10/31/2018
ms.author: genli
ms.custom: seodec18, tracking-python

---


# Open-source technologies FAQs for Web Apps in Azure

This article has answers to frequently asked questions (FAQs) about issues with open-source technologies for the [Web Apps feature of Azure App Service](https://azure.microsoft.com/services/app-service/web/).

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## How do I turn on PHP logging to troubleshoot PHP issues?

To turn on PHP logging:

1. Sign in to your **Kudu website** (`https://*yourwebsitename*.scm.azurewebsites.net`).
2. In the top menu, select **Debug Console** > **CMD**.
3. Select the **Site** folder.
4. Select the **wwwroot** folder.
5. Select the **+** icon, and then select **New File**.
6. Set the file name to **.user.ini**.
7. Select the pencil icon next to **.user.ini**.
8. In the file, add this code: `log_errors=on`
9. Select **Save**.
10. Select the pencil icon next to **wp-config.php**.
11. Change the text to the following code:
    ```php
    //Enable WP_DEBUG modedefine('WP_DEBUG', true);//Enable debug logging to /wp-content/debug.logdefine('WP_DEBUG_LOG', true);
    //Suppress errors and warnings to screendefine('WP_DEBUG_DISPLAY', false);//Suppress PHP errors to screenini_set('display_errors', 0);
    ```
12. In the Azure portal, in the web app menu, restart your web app.

For more information, see [Enable WordPress error logs](https://blogs.msdn.microsoft.com/azureossds/2015/10/09/logging-php-errors-in-wordpress-2/).

## How do I log Python application errors in apps that are hosted in App Service?
[!INCLUDE [web-sites-python-troubleshooting-wsgi-error-log](../../includes/web-sites-python-troubleshooting-wsgi-error-log.md)]

## How do I change the version of the Node.js application that is hosted in App Service?

To change the version of the Node.js application, you can use one of the following options:

* In the Azure portal, use **App settings**.
  1. In the Azure portal, go to your web app.
  2. On the **Settings** blade, select **Application settings**.
  3. In **App settings**, you can include WEBSITE_NODE_DEFAULT_VERSION as the key, and the version of Node.js you want as the value.
  4. Go to your **Kudu console** (`https://*yourwebsitename*.scm.azurewebsites.net`).
  5. To check the Node.js version, enter the following command:  
     ```
     node -v
     ```
* Modify the iisnode.yml file. Changing the Node.js version in the iisnode.yml file only sets the runtime environment that iisnode uses. Your Kudu cmd and others still use the Node.js version that is set in **App settings** in the Azure portal.

  To set the iisnode.yml manually, create an iisnode.yml file in your app root folder. In the file, include the following line:
  ```yml
  nodeProcessCommandLine: "D:\Program Files (x86)\nodejs\5.9.1\node.exe"
  ```
   
* Set the iisnode.yml file by using package.json during source control deployment.
  The Azure source control deployment process involves the following steps:
  1. Moves content to the Azure web app.
  2. Creates a default deployment script, if there isn’t one (deploy.cmd, .deployment files) in the web app root folder.
  3. Runs a deployment script in which it creates an iisnode.yml file if you mention the Node.js version in the package.json file > engine `"engines": {"node": "5.9.1","npm": "3.7.3"}`
  4. The iisnode.yml file has the following line of code:
      ```yml
      nodeProcessCommandLine: "D:\Program Files (x86)\nodejs\5.9.1\node.exe"
      ```

## I see the message "Error establishing a database connection" in my WordPress app that's hosted in App Service. How do I troubleshoot this?

If you see this error in your Azure WordPress app, to enable php_errors.log and debug.log, complete the steps detailed in [Enable WordPress error logs](https://blogs.msdn.microsoft.com/azureossds/2015/10/09/logging-php-errors-in-wordpress-2/).

When the logs are enabled, reproduce the error, and then check the logs to see if you are running out of connections:
```
[09-Oct-2015 00:03:13 UTC] PHP Warning: mysqli_real_connect(): (HY000/1226): User ‘abcdefghijk79' has exceeded the ‘max_user_connections’ resource (current value: 4) in D:\home\site\wwwroot\wp-includes\wp-db.php on line 1454
```

If you see this error in your debug.log or php_errors.log files, your app is exceeding the number of connections. If you’re hosting on ClearDB, verify the number of connections that are available in your [service plan](https://www.cleardb.com/pricing.view).

## How do I debug a Node.js app that's hosted in App Service?

1.  Go to your **Kudu console** (`https://*yourwebsitename*.scm.azurewebsites.net/DebugConsole`).
2.  Go to your application logs folder (D:\home\LogFiles\Application).
3.  In the logging_errors.txt file, check for content.

## How do I install native Python modules in an App Service web app or API app?

Some packages might not install by using pip in Azure. The package might not be available on the Python Package Index, or a compiler might be required (a compiler is not available on the computer that is running the web app in App Service). For information about installing native modules in App Service web apps and API apps, see [Install Python modules in App Service](https://blogs.msdn.microsoft.com/azureossds/2015/06/29/install-native-python-modules-on-azure-web-apps-api-apps/).

## How do I deploy a Django app to App Service by using Git and the new version of Python?

For information about installing Django, see [Deploying a Django app to App Service](https://blogs.msdn.microsoft.com/azureossds/2016/08/25/deploying-django-app-to-azure-app-services-using-git-and-new-version-of-python/).

## Where are the Tomcat log files located?

For Azure Marketplace and custom deployments:

* Folder location: D:\home\site\wwwroot\bin\apache-tomcat-8.0.33\logs
* Files of interest:
    * catalina.*yyyy-mm-dd*.log
    * host-manager.*yyyy-mm-dd*.log
    * localhost.*yyyy-mm-dd*.log
    * manager.*yyyy-mm-dd*.log
    * site_access_log.*yyyy-mm-dd*.log


For portal **App settings** deployments:

* Folder location: D:\home\LogFiles
* Files of interest:
    * catalina.*yyyy-mm-dd*.log
    * host-manager.*yyyy-mm-dd*.log
    * localhost.*yyyy-mm-dd*.log
    * manager.*yyyy-mm-dd*.log
    * site_access_log.*yyyy-mm-dd*.log

## How do I troubleshoot JDBC driver connection errors?

You might see the following message in your Tomcat logs:

```
The web application[ROOT] registered the JDBC driver [com.mysql.jdbc.Driver] but failed to unregister it when the web application was stopped. To prevent a memory leak,the JDBC Driver has been forcibly unregistered
```

To resolve the error:

1. Remove the sqljdbc*.jar file from your app/lib folder.
2. If you are using the custom Tomcat or Azure Marketplace Tomcat web server, copy this .jar file to the Tomcat lib folder.
3. If you are enabling Java from the Azure portal (select **Java 1.8** > **Tomcat server**), copy the sqljdbc.* jar file in the folder that's parallel to your app. Then, add the following classpath setting to the web.config file:

    ```xml
    <httpPlatform>
    <environmentVariables>
    <environmentVariablename ="JAVA_OPTS" value=" -Djava.net.preferIPv4Stack=true
    -Xms128M -classpath %CLASSPATH%;[Path to the sqljdbc*.jarfile]" />
    </environmentVariables>
    </httpPlatform>
    ```

## Why do I see errors when I attempt to copy live log files?

If you try to copy live log files for a Java app (for example, Tomcat), you might see this FTP error:

```
Error transferring file [filename] Copying files from remote side failed.
    
The process cannot access the file because it is being used by another process.
```

The error message might vary, depending on the FTP client.

All Java apps have this locking issue. Only Kudu supports downloading this file while the app is running.

Stopping the app allows FTP access to these files.

Another workaround is to write a WebJob that runs on a schedule and copies these files to a different directory. For a sample project, see the [CopyLogsJob](https://github.com/kamilsykora/CopyLogsJob) project.

## Where do I find the log files for Jetty?

For Marketplace and custom deployments, the log file is in the D:\home\site\wwwroot\bin\jetty-distribution-9.1.2.v20140210\logs folder. Note that the folder location depends on the version of Jetty you are using. For example, the path provided here is for Jetty 9.1.2. Look for jetty_*YYYY_MM_DD*.stderrout.log.

For portal App Setting deployments, the log file is in D:\home\LogFiles. Look for jetty_*YYYY_MM_DD*.stderrout.log

## Can I send email from my Azure web app?

App Service doesn't have a built-in email feature. For some good alternatives for sending email from your app, see this [Stack Overflow discussion](https://stackoverflow.com/questions/17666161/sending-email-from-azure).

## Why does my WordPress site redirect to another URL?

If you have recently migrated to Azure, WordPress might redirect to the old domain URL. This is caused by a setting in the MySQL database.

WordPress Buddy+ is an Azure Site Extension that you can use to update the redirection URL directly in the database. For more information about using WordPress Buddy+, see [WordPress tools and MySQL migration with WordPress Buddy+](https://sharepointforum.org/threads/wordpress-tools-and-mysql-migration-with-wordpress-buddy.82929/).

Alternatively, if you prefer to manually update the redirection URL by using SQL queries or PHPMyAdmin, see [WordPress: Redirecting to wrong URL](https://blogs.msdn.microsoft.com/azureossds/2016/07/12/wordpress-redirecting-to-wrong-url/).

## How do I change my WordPress sign-in password?

If you have forgotten your WordPress sign-in password, you can use WordPress Buddy+ to update it. To reset your password, install the WordPress Buddy+ Azure Site Extension, and then complete the steps described in [WordPress tools and MySQL migration with WordPress Buddy+](https://sharepointforum.org/threads/wordpress-tools-and-mysql-migration-with-wordpress-buddy.82929/).

## I can't sign in to WordPress. How do I resolve this?

If you find yourself locked out of WordPress after recently installing a plugin, you might have a faulty plugin. WordPress Buddy+ is an Azure Site Extension that can help you disable plugins in WordPress. For more information, see [WordPress tools and MySQL migration with WordPress Buddy+](https://sharepointforum.org/threads/wordpress-tools-and-mysql-migration-with-wordpress-buddy.82929/).

## How do I migrate my WordPress database?

You have multiple options for migrating the MySQL database that's connected to your WordPress website:

* Developers: Use the [command prompt or PHPMyAdmin](https://blogs.msdn.microsoft.com/azureossds/2016/03/02/migrating-data-between-mysql-databases-using-kudu-console-azure-app-service/)
* Non-developers: Use [WordPress Buddy+](https://sharepointforum.org/threads/wordpress-tools-and-mysql-migration-with-wordpress-buddy.82929/)

## How do I help make WordPress more secure?

To learn about security best practices for WordPress, see [Best practices for WordPress security in Azure](https://blogs.msdn.microsoft.com/azureossds/2016/12/26/best-practices-for-wordpress-security-on-azure/).

## I am trying to use PHPMyAdmin, and I see the message “Access denied.” How do I resolve this?

You might experience this issue if the MySQL in-app feature isn't running yet in this App Service instance. To resolve the issue, try to access your website. This starts the required processes, including the MySQL in-app process. To verify that MySQL in-app is running, in Process Explorer, ensure that mysqld.exe is listed in the processes.

After you ensure that MySQL in-app is running, try to use PHPMyAdmin.

## I get an HTTP 403 error when I try to import or export my MySQL in-app database by using PHPMyadmin. How do I resolve this?

If you are using an older version of Chrome, you might be experiencing a known bug. To resolve the issue, upgrade to a newer version of Chrome. Also try using a different browser, like Internet Explorer or Microsoft Edge, where the issue does not occur.
