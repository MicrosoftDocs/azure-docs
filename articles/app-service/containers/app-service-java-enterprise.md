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

Azure App Service on Linux lets Java developers to build, deploy, and scale Java Enterprise (JEE) applications on a fully managed Linux-based service.  The underlying Java Enterprise runtime environment is the open-source [Wildfly](http://wildfly.org/) application server.

This guide provides key concepts and instructions for Java Enterprise developers using in App Service for Linux. If you've never deployed Java applications with Azure App Service for Linux, you should complete the [Java quickstart](quickstart-java.md) first. Questions about App Service for Linux that aren't specific to Java Enterprise are answered in the [Java developer's guide](app-service-linux-java.md) and the [App Service Linux FAQ](app-service-linux-faq.md).

## Scale with App Service 

The WildFly application server running in App Service on Linux runs in standalone mode, not in a domain configuration. When you scale out the App Service Plan, each WildFly instance is configured as a standalone server.

 Scale your application vertically or horizontally with [scale rules](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-autoscale-get-started?toc=%2Fazure%2Fapp-service%2Fcontainers%2Ftoc.json) and by [increasing your instance count](https://docs.microsoft.com/azure/app-service/web-sites-scale?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json). 

## Customize application server configuration

Web App instances are stateless, so each new instance started must be configured on startup to support the Wildfly configuration needed by application.
You can write a startup Bash script to call the WildFly CLI to:

- Set up data sources
- Configure messaging providers
- Add other modules and dependencies to the Wildfly server configuration.

 The script runs when Wildfly is up and running, but before the application starts. The script should use the [JBOSS CLI](https://docs.jboss.org/author/display/WFLY/Command+Line+Interface) called from `/opt/jboss/wildfly/bin/jboss-cli.sh` to configure the application server with any configuration or changes needed after the server starts. 

Do not use the interactive mode of the CLI to configure Wildfly. Instead, you can provide a script of commands to the JBoss CLI using the `--file` command, for example:

```bash
/opt/jboss/wildfly/bin/jboss-cli.sh -c --file=/path/to/your/jboss_commands.cli
```

Upload the startup script to `/home/site/deployments/tools` in your App Service instance. See [this document](/azure/app-service/app-service-deployment-credentials#userscope) for instructions on getting your FTP credentials. 

Set the **Startup Script** field in the Azure portal to the location of your startup shell script, for example `/home/site/deployments/tools/your-startup-script.sh`.

Supply [application settings](/azure/app-service/web-sites-configure#application-settings) in the application configuration to pass environment variables for use in the script. Application settings keep connection strings and other secrets needed to configure your application out of version control.

## Modules and dependencies

To install modules and their dependencies into the Wildfly classpath via the JBoss CLI, you will need to create the following files in their own directory.  Some modules and dependencies might need additional configuration such as JNDI naming or other API-specific configuration, so this list is a minimum set of what you'll need to configure a dependency in most cases.

- An [XML module descriptor](https://jboss-modules.github.io/jboss-modules/manual/#descriptors). This XML file defines the name, attributes, and dependencies of your module. This [example module.xml file](https://access.redhat.com/documentation/en-us/jboss_enterprise_application_platform/6/html/administration_and_configuration_guide/example_postgresql_xa_datasource) defines a Postgres module, its JAR file JDBC dependency, and other module dependencies required.
- Any necessary JAR file dependencies for your module.
- A script with your JBoss CLI commands to configure the new module. This file will contain your commands to be executed by the JBoss CLI to configure the server to use the dependency. For documentation on the commands to add modules, datasources, and messaging providers, refer to [this document](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.0/html-single/management_cli_guide/#how_to_cli).
-  A Bash startup script to call the JBoss CLI and execute the script in the previous step. This file will be executed when your App Service instance is restarted or when new instances are provisioned during a scale-out.  This startup script is where you can perform any other configurations for your application as the JBoss commands are passed to the JBoss CLI. At minimum, this file can be a single command to pass your JBoss CLI command script to the JBoss CLI: 
   
```bash
`/opt/jboss/wildfly/bin/jboss-cli.sh -c --file=/path/to/your/jboss_commands.cli` 
``` 

Once you have the files and content for your module, follow the steps below to add the module to the Wildfly application server. 

1. FTP your files to `/home/site/deployments/tools` in your App Service instance. See this document for instructions on getting your FTP credentials. 
2. In the Application Settings blade of the Azure portal, set the “Startup Script” field to the location of your startup shell script, for example `/home/site/deployments/tools/your-startup-script.sh` .
3. Restart your App Service instance by pressing the **Restart** button in the **Overview** section of the Portal or using the Azure CLI.

## Data sources

To configure Wildfly for a data source connection, follow the same process outlined above in the Installing Modules and Dependencies section. You can follow the same steps for any Azure Database service.

1. Download the JDBC driver for your database flavor. For convenience, here are the drivers for [Postgres](https://jdbc.postgresql.org/download.html) and [MySQL](https://dev.mysql.com/downloads/connector/j/). Unpack the download to get the .jar file.
2. Follow the steps outline in "Modules and Dependencies" to create and upload your XML module descriptor, JBoss CLI script, startup script, and JDBC .jar dependency.


More information on configuring Wildfly with [PostgreSQL](https://developer.jboss.org/blogs/amartin-blog/2012/02/08/how-to-set-up-a-postgresql-jdbc-driver-on-jboss-7) , [MySQL](https://dev.mysql.com/doc/connector-j/5.1/connector-j-usagenotes-jboss.html), and [SQL Database](https://docs.jboss.org/jbossas/docs/Installation_And_Getting_Started_Guide/5/html/Using_other_Databases.html#d0e3898) is available. You can use these customized instructions along with the generalized approach above to add data source definitions to your server.

## Messaging providers

To enable message driven Beans using Service Bus as the messaging mechanism:

1. Use the [Apache QPId JMS messaging library](https://qpid.apache.org/proton/index.html). Include this dependency in your pom.xml (or other build file) for the application.

2.  Create [Service Bus resources](/azure/service-bus-messaging/service-bus-java-how-to-use-jms-api-amqp). Create an Azure Service Bus namespace and queue within that namespace and a Shared Access Policy with send and receive capabilities.

3. Pass the shared access policy key to your code either by URL-encoding the primary key of your policy or [Use the Service Bus SDK](/azure/service-bus-messaging/service-bus-java-how-to-use-jms-api-amqp#setup-jndi-context-and-configure-the-connectionfactory).

4. Follow the steps outlined in the Installing Modules and Dependencies section with your module XML descriptor, .jar dependencies, JBoss CLI commands, and startup script for the JMS provider. In addition to the four files, you will also need to create an XML file that defines the JNDI name for the JMS queue and topic. See [this repository](https://github.com/JasonFreeberg/widlfly-server-configs/tree/master/appconfig) for reference configuration files.


## Configure session management caching

By default App Service on Linux will use session affinity cookies to ensure that client requests with existing sessions are routed the same instance of your application. This default behavior requires no configuration but has some limitations:

- If an application instance is restarted or scaled down, the user session state in the application server will be lost.
- If applications have long session time out settings or a fixed number of users, it can take some time for autoscaled new instances to receive load since only new sessions will be routed to the newly started instances.

You can configure Wildfly to use an external session store such as [Redis Cache](/azure/azure-cache-for-redis/). You will need to [disable the existing ARR Instance Affinity](https://azure.microsoft.com/blog/disabling-arrs-instance-affinity-in-windows-azure-web-sites/) configuration to turn off the session cookie-based routing and allow the configured Wildfly session store to operate without interference.

## Enable web sockets

By default, web sockets are enabled on App Service. To get started with WebSockets in your application,  refer to [this quickstart](https://github.com/wildfly/quickstart/tree/master/websocket-hello).

## Logs and troubleshooting

App Service provides tools to help you troubleshoot problems with your application.

-	Turn on logging by clicking **Diagnostic Logs** in the left-hand navigation pane. Click **File System** to set your storage quota and retention period, and save your changes. You can find these logs under `/home/LogFiles/`.
-	[Use SSH to connect to the application instance](/app-service-linux-ssh-support) to view logs for running applications.
-	Check diagnostic logs in the **Diagnostic Logs** panel of the Portal, or by using the Azure CLI command:
` az webapp log tail --name <your-app-name> --resource-group <your-apps-resource-group> `
