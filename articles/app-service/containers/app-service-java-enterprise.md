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

# Scale with App Service 

Your WildFly application server runs in standalone mode (as opposed to a domain configuration). To scale your application vertically or horizontally to meet demand, [set up scale rules](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-autoscale-get-started?toc=%2Fazure%2Fapp-service%2Fcontainers%2Ftoc.json) or [increase your instance count](https://docs.microsoft.com/azure/app-service/web-sites-scale?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json) in Azure App Service for Linux.

## Customize application server configuration

Developers can write and configure a startup bash script through the Azure Portal to execute additional configuration needed for their application. The script is executed when the application server is started, but before the application starts. You can call the [JBOSS CLI](https://docs.jboss.org/author/display/WFLY/Command+Line+Interface) located at `/opt/jboss/wildfly/bin/jboss-cli.sh` to configure the application server with any configuration or changes needed after the server starts. 

Do not use the interactive mode of the CLI to configure Wildfly. Instead, you can provide a script of commands to the JBoss CLI using the `--file` command, for example:

```bash
/opt/jboss/wildfly/bin/jboss-cli.sh -c --file=/path/to/your/jboss_commands.cli
```

Use [application settings](/azure/app-service/web-sites-configure#application-settings) to set environment variables and values for the application. These settings are made available to the startup script environment and keep connection strings and other key information out of version control.

## Modules and depdencies

To install modules and their dependencies into the Wildfly classpath via the JBoss CLI, you will need to create the following giles. We advise keeping these files in their own directory. Some modules and dependencies might need additional configuration, so refer to any specific documentation for your dependencies before completing this process.

1. Create an XML module descriptor. This XML file defines the name, attributes, and dependencies of your module. See [this example XML file], which defines a Postgres module and its JAR file JDBC dependency. See the Wildfly documentation on XML module descriptors for more information.

2. Download dependencies. Download any necessary JAR file dependencies for your module.
3. Configure the JBoss CLI script. This file will contain your commands to be executed by the JBoss CLI to confgure the server to use the dependency. For documentation on the commands to add modules, datasources, and JMS, please see read refer to this document.
4. Update the Bash startup script for the app in the Azure Portal. This file will be executed when your App Service instance is restarted or when new instances are provisioned during a scale out.  This startup script is where you can perform any other configurations for your application as the JBoss commands are passed to the JBoss CLI. At minimum, this file can be a single command to pass your JBoss CLI command script to the JBoss CLI: 
   
```bash
`/opt/jboss/wildfly/bin/jboss-cli.sh -c --file=/path/to/your/jboss_commands.cli` 
``` 

Once you have the files and content for your module, follow the steps below to add the module to the Wildfly application server. 

1. FTP your files to `/home/site/deployments/tools` in your App Service instance. See this document for instructions on getting your FTP credentials. 
2. In the Application Settings blade of the Azure Portal, set the “Startup Script” field to the location of your startup shell script. This should be `/home/site/deployments/tools/your-startup-script.sh` 
3. Restart your App Service instance by pressing the “Restart” button in the Overview section of the Portal or using the Azure CLI.

## Data sources

To set up data sources in your application server, you'll need to do the following general steps.

1. Download the JDBC driver for the database backing the data source. 
2.  Create an XML file that points to the JDBC driver as a Wildfly module. This XML will also need to point to the dependencies for the JDBC driver if they are not included.
3. Upload the JDBC driver and XML to the App Service instance, adding it to a customized Wildfly configuration hosted in `/home/jobss/wildfly` in persistent application storage.
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

3. Pass the shared access policy key to your code either by URL-encoding the primary key of your policy or [Use the Service Bus SDK](/azure/service-bus-messaging/service-bus-java-how-to-use-jms-api-amqp#setup-jndi-context-and-configure-the-connectionfactory).

4. Create a jndi.properties file in the project, with a JNDI name that references your Service Bus queue 

## Logs and troubleshooting

You can [use SSH to connect to the application instance](/app-service-linux-ssh-support) to view logs for running applications.