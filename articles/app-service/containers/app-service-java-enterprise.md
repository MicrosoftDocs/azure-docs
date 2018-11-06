---
title:  Java Enterprise support for Azure App Service on Linux | Microsoft Docs
description: Developer's guide to deploying Java Enterprise apps using Wildfly with Azure App Service on Linux.
keywords: azure app service, web app, linux, oss, java, wildfly, enterprise
services: app-service
author: rloutlaw
manager: angerobe
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: java
ms.topic: article
ms.date: 08/29/2018
ms.author: routlaw

---

# Java Enterprise guide for App Service on Linux

Azure App Service on Linux lets Java developers to build, deploy, and scale Jor Java Enterprise (JEE) applications using the [Wildfly application server](http://wildfly.org/) on a fully managed Linux-based service. 

This guide provides key concepts and instructions for Java Enterprise evelopers using in App Service for Linux. If you've never used Java Enterprise with Azure App Service for Linux, you should read through the [Java Enteprise quickstart](quickstart-java.md) first. General questions about using App Service for Linux that aren't specific to the Java Enterprise are answered in the [Java developer's guide for App Service on Linux](app-service-linux-java.md) and the [App Service Linux FAQ](app-service-linux-faq.md).

## Customize application server behavior

Developers can deploy an arbitrary bash script in the Azure Portal or via FTP to execute additional configuration needed for their application. The script is executed when the application is started, and you can use the [Wildfly CLI](https://docs.jboss.org/author/display/WFLY/Command+Line+Interface) to configure the application server with any configuration or changes needed after the server starts.

Use [application settings](/azure/app-service/web-sites-configure#application-settings) to set environment variables and values for the application. These settings are made available to the startup script environment.


## Configure application server start up configuration

To customize the start up configuration of Wildfly application server, you will need to create and maintain a full copy of the Wildfly configuration in the persistent filesystem available to each App Service for Linux app under the `/home` filesystem path. When this path exists and the configuration for the app is set to Java Enteprirse, App Service for Linux will use this Wildfly configuration instead of the defaults provided.

Create a copy of the Wildfly configuration you can customize with the following instructions:

1. Copy the contents of `/usr/local/wildfly` into `/home/wildfly` on your App Service Linux instance using the [available SSH connection](/azure/app-service/containers/app-service-linux-ssh-support).
2. Make any filesystem configuration needed to the new copy in the `/home/wildfly` directory.

This configuration is shared between all instances of your application. You cannot set Wildfly to run in domain mode using this configuration. 

## Cluster mode support

App Service Linux supports standalone mode for Wildfly applications. When running your application on App Service, add additional instances of the application to scale out. App Service on Linux will load balance requests across all available instances of your app.

## Data sources

To set up data sources in your application server, you'll need to do the following general steps.

1. Download the JDBC driver for the database backing the data source. 
2.  Create an XML file that points to the JDBC driver as a Wildfly module. This XML will also need to point to the dependencies for the JDBC driver if they are not included.
3. Upload the JDBC driver and XML to the App Service instance, adding it to a customized Wildfly configuration hosted in `/home/wilfly` in persistent application storage.
4.  Configure a startup script which configures the JDBC driver for the Wildfly server using the JBoss CLI, referencing the XML file created in the previous step.

More information on configuring Wildfly with [PostgreSQL](https://developer.jboss.org/blogs/amartin-blog/2012/02/08/how-to-set-up-a-postgresql-jdbc-driver-on-jboss-7) , [MySQL](https://dev.mysql.com/doc/connector-j/5.1/connector-j-usagenotes-jboss.html), and [SQL Database](https://docs.jboss.org/jbossas/docs/Installation_And_Getting_Started_Guide/5/html/Using_other_Databases.html#d0e3898) is available. You can use these customized instructions along with the generalized approach above to add data source definitions to your server.

## Configure session management caching

By default App Service on Linux will use session affinity cookies to ensure that client requests with existing sessions are routed the same instance of your application. This default behavior requires no configuration but has some limitations:

- If an application instance is restarted or scaled down, the user session state in the application server will be lost.
- If applications have long session timeout settings or a fixed number of users, it can take some time for autoscaled new instances to receive load since only new sessions will be routed to the newly started instances.

You can configure Wildfly to use an external session store such as [Redis Cache](/azure/redis-cache/). You will need to [disable the existing ARR Instance Affinity](https://azure.microsoft.com/en-us/blog/disabling-arrs-instance-affinity-in-windows-azure-web-sites/) configuration to turn off the session cookie based routing and allow the configured Wildfly session store to operate without interference.

## Messaging configuration

To enable message driven Beans using Service Bus as the messaging mechanism:

1. Use a generic JMS provider as a Resource Adapter to Service Bus, we recommend the [Apache QPId messaging library](https://qpid.apache.org/proton/index.html). Include this dependency in their pom.xml (or other build file) for the application. .

2.  Create [Service Bus resources](/azure/service-bus-messaging/service-bus-java-how-to-use-jms-api-amqp). You should create a Service Bus namespace and queue within that namespace and a Shared Access Policy with send and recevie capabilities.

3. Pass the shared access policy key either by URL-encoded the Primary Key of your policy or [Use the Service Bus SDK](/azure/service-bus-messaging/service-bus-java-how-to-use-jms-api-amqp#setup-jndi-context-and-configure-the-connectionfactory).

4. Create a jndi.properties file in the project, with a JNDI name that references your Service Bus queue 

## Logs and troubleshooting

You can [use SSH to connect to the application instance](/app-service-linux-ssh-support) to view logs for running applications.