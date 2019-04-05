---
title: Java developer's guide for App Service on Windows - Azure | Microsoft Docs
description: Learn how to configure Java apps running in Azure App Service on Windows.
keywords: azure app service, web app, windows, oss, java
services: app-service
author: jafreebe
manager: ccompy
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: java
ms.topic: article
ms.date: 4/4/2019
ms.author: jafreebe
ms.custom: seodec18

---

# Java developer's guide for App Service on Windows

Azure App Service on Windows lets Java developers to quickly build, deploy, and scale their Tomcat or Java Standard Edition (SE) packaged web applications on a fully managed Windows-based service. Deploy applications with Maven plugins from the command line or in editors like IntelliJ, Eclipse, or Visual Studio Code.

This guide provides key concepts and instructions for Java developers using in App Service for Windows. If you've never used Azure App Service for Windows, you should read through the [Java quickstart](app-service-web-get-started-java.md) first. General questions about using App Service for Windows that aren't specific to the Java development are answered in the [App Service Windows FAQ]().

> [!NOTE]
> Can't find what you're looking for? Please see the [Java Developer guide for Linux](containers/app-service-linux-java.md) for more information. This article documents the difference in behavior on the Windows OS.

## Configuring Tomcat

To edit Tomcat's `server.xml` and other configuration files, first identify your Tomcat major version in the portal. 

1. Find the Tomcat home directory for your version. In the App Service console, run the `env` command and find the environment variable that begins with `AZURE_TOMCAT`and matches your major version. For example, `AZURE_TOMCAT85_HOME` points to the Tomcat directory for Tomcat 8.5.
1. Once you have identified the Tomcat home directory for your version, copy the configuration directory to `D:\home`. For example, if `AZURE_TOMCAT85_HOME` had a value of `D:\Program Files (x86)\apache-tomcat-8.5.37`, the full path of the copied configuration directory would be `D:\home\apache-tomcat-8.5.37\conf`.

Finally, restart your App Service. Your deployments should go to `D:\home\site\wwwroot\webapps` just as before.

## Where are the Tomcat log files located?

The log files are located in `D:\home\LogFiles`. There you can find the following files of interest:
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

1. Remove the sqljdbc*.jar file from your `app/lib` folder.
1. Copy the sqljdbc.* jar file in the folder that's parallel to your app. Then, add the following classpath setting to the web.config file:

    ```xml
    <httpPlatform>
    <environmentVariables>
    <environmentVariablename ="JAVA_OPTS" value=" -Djava.net.preferIPv4Stack=true
    -Xms128M -classpath %CLASSPATH%;<Path to the sqljdbc*.jarfile>" />
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

For portal App Setting deployments, the log file is in `D:\home\LogFiles`. Look for `jetty_*YYYY_MM_DD*.stderrout.log`