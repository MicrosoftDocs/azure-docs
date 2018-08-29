---
title: Java language support for Azure App Service on Linux | Microsoft Docs
description: Developer's guide to deploying Java apps with Azure App Service on Linux.
keywords: azure app service, web app, linux, oss, java
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

# Java developer's guide for App Service on Linux

Azure App Service on Linux lets Java developers to quickly build, deploy, and scale their Tomcat or Java Standard Edition (SE) packaged web applications on a fully managed Linux-based service. Deploy applications with Maven plugins from the command line or in editors like IntelliJ, Eclipse, or Visual Studio Code.

This guide provides key concepts and instructions for Java developers using in App Service for Linux. If you've never used Azure App Service for Linux, you should read through the [Java quickstart](quickstart-java.md) first. General questions about using App Service for Linux that aren't specific to the Java development are answered in the [App Service Linux FAQ](app-service-linux-faq.md).

## Java runtime support

App Service for Linux supports two runtimes for managed hosting of Java web applications:

- The [Tomcat servlet container](http://tomcat.apache.org/) for running applications packaged as web archive (WAR) files. Supported versions are 8.5 and 9.0.
- Java SE runtime environment for running applications packaged as Java archive (JAR) files. The only supported version is Java 8.

Unless otherwise stated in this guide, the operations, commands, and concepts presented work the same for applications regardless of runtime.

### JDK versions and maintenance

 Azure's supported Java Development Kit (JDK) is [Zulu](https://www.azul.com/products/zulu-and-zulu-enterprise/) provided through [Azul Systems](https://www.azul.com/), built against the Oracle [OpenJDK](http://openjdk.java.net/). 

Supported JDKs get minor version updates on a quarterly basis in January, April, July, and October.  Major version upgrades will be provided through new runtime options in Azure App Service for Linux. Customers update to these JDKs by configuring their App Service deployment and are responsible for testing and ensuring the major update meets their needs.

### Supported container images

Deploy containerized Java applications to Azure using [App Service for Containers](https://azure.microsoft.com/en-us/services/app-service/containers/). To use the Azure-supported Zulu JDK in your containers, make sure your application's `Dockerfile` contains:

```Dockerfile
FROM zulu-openjdk:8u181-8.31.0.1
```

### Security updates

Any major bug fixes or patches will be released as soon as they become available from Azul Systems. A "major" bugfix is defined by a high score on the [NIST Common Vulnerability Scoring System](https://nvd.nist.gov/cvss.cfm). 

### Local development support

Developers can download the Azure-supported JDK for local development, but are only eligible for support if they are developing for Azure or [Azure Stack](https://azure.microsoft.com/overview/azure-stack/) with a qualified Azure support plan.


### Runtime deprecation

If a supported Java runtime will be retired, Azure developers using the affected runtime will be given at least six months notice.

### Getting runtime support

Developers can open an issue with the App Service Linux Java runtime through Azure Support if they have a qualified support plan.

## Debug apps

### SSH console access 

SSH connectivity to the Linux environment running your app is supported. See [SSH support for Azure App Service on Linux](/azure/app-service/containers/app-service-linux-ssh-support) for full instructions to connect via web browser or local terminal.

### Stream HTTP logs

For quick development debugging and testing, you can stream HTTP traffic logs to your console using the Azure CLI. Basic log filtering and support are included.

```azurecli-interactive
az webapp log tail --name webappname --resource-group myResourceGroup
```

For more information, see [Streaming logs with the Azure CLI](/azure/app-service/web-sites-enable-diagnostic-log#streaming-with-azure-command-line-interface).

### View application output

Enable [application logging](/azure/app-service/web-sites-enable-diagnostic-log#enablediag) through the Azure portal or [Azure CLI](/cli/azure/webapp/log#az-webapp-log-config) to configure App Service to write your application's standard console output and standard console error streams to the local filesystem or Azure Blob Storage. A restart of the application is required for the setting to take effect. Logging to the local App Service filesystem instance is disabled 12 hours after it is configured. If you need longer retention, you will need to configure the setting to write to Blob storage.

If your application uses Logback or Log4j for tracing, you can forward these traces for review into Azure Application Insights using the logging framework configuration instructions in [Explore Java trace logs in Application Insights](/azure/application-insights/app-insights-java-trace-logs).


## Runtime tuning and customization

### Set JVM runtime options

To set allocated memory or other JVM runtime options in both the Tomcat and Java SE environments, set the JAVA_OPTS as shown below as an [application setting](/azure/app-service/web-sites-configure#app-settings). App Service Linux passes this setting as an environment variable to the Java runtime when it starts.

In the Azure portal, under **Application Settings** for the web app, create a new app setting named `JAVA_OPTS` that includes the additional settings, such as `$JAVA_OPTS -Xms512m -Xmx1204m`.

To configure the app setting from the Azure App Service Linux Maven plugin, add setting/value tags in the Azure plugin section: 

```xml
<appSettings> 
    <property> 
        <name>JAVA_OPTS</name> 
        <value>$JAVA_OPTS -Xms512m -Xmx1204m</value> 
    </property> 
</appSettings> 
```

Developers should check their app service configuration and plan tier to find the optimal allocation of memory for their Java applications. Weigh the service plan against the number of applications instances and deployment slots when making your calculations.

Azure does not allow customers to set per-instance runtime memory limits directly in their app settings. Allocate more memory to your runtime instances by subscribing to a larger App Service Plan and then customizing the Java runtime using the steps above to use the additional memory. 

### Customizing startup

Developers can specify an optional startup file to configure your runtime when it starts. The file can be specified in the Azure portal under **Application Settings** for the deployed app. 

### Enabling web sockets

Enable web socket support through the Azure portal from the **General settings** section in **Application settings** for the application. Restart the application for the setting to take effect.

Turn on web socket support using the Azure CLI with the following command:

```azurecli-interactive
az webapp config set -n ${WEBAPP_NAME} -g ${WEBAPP_RESOURCEGROUP_NAME} --web-sockets-enabled true 
```

Then restart your application:

```azurecli-interactive
az webapp stop -n ${WEBAPP_NAME} -g ${WEBAPP_RESOURCEGROUP_NAME} 
az webapp start -n ${WEBAPP_NAME} -g ${WEBAPP_RESOURCEGROUP_NAME}  
```

### Set UTF-8 character encoding 

In the Azure portal, under **Application Settings** for the web app, create a new app setting named `JAVA_OPTS` with value `$JAVA_OPTS -Dfile.encoding=UTF-8`.

Using the Maven plugin, add name/value tags in the Azure plugin section: 

```xml
<appSettings> 
    <property> 
        <name>JAVA_OPTS</name> 
        <value>$JAVA_OPTS -Dfile.encoding=UTF-8</value> 
    </property> 
</appSettings> 
```

## Tomcat customization

### Configure data sources

>[!NOTE]
> If your application uses the Spring Framework or Spring Boot, you can set database connection information for Spring Data JPA as environment variables in your application properties file. Then use [app settings](/azure/app-service/web-sites-configure#app-settings) to define these values for your application in the Azure portal or CLI.

To configure your apps running on Tomcat to use managed connections to databases using Java Database Connectivity (JDBC) or the Java Persistence API (JPA), first determine if the data source needs to be made available just to one application or to all of the applications running on the App Service plan.

For application-level data sources: 

1. Add a `context.xml` file if it does not exist to your web application and make sure it is added to the META-INF directory of your WAR file when the project is built.
2. In this file, add a Context path entry to link the data source to a JNDI address:
```xml
<Context>
    <Resource
        name="jdbc/sqldb" type="javax.sql.DataSource"
        url="jdbc:sqlserver://localhost:1433;databaseName=AdventureWorks"
        driverClassName="com.microsoft.sqlserver.jdbc.SQLServerDriver"
        username="yourname" password="yourpass"
    />
</Context>
```
3. Update your application's `web.xml` to use the resource in your application.

```xml
<resource-env-ref>
    <resource-env-ref-name>jdbc/sqldb</resource-env-ref-name>
    <resource-env-ref-type>javax.sql.DataSource</resource-env-ref-type>
</resource-env-ref>
```