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

## Logging and debugging apps

Performance reports, traffic visualizations, and health checkups are available for eeach app through the Azure portal. See the [Azure App Service diagnostics overview](/azure/app-service/app-service-diagnostics) for more information on how to access and use these diagnostic tools.

### SSH console access 

SSH connectivity to the Linux environment running your app is avaialble. See [SSH support for Azure App Service on Linux](/azure/app-service/containers/app-service-linux-ssh-support) for full instructions to connect to the Linux system through your web browser or local terminal.

### Streaming logs

For quick debugging and troubleshooting, you can stream logs to your console using the Azure CLI. Configure the CLI with the `az webapp log config` to enable logging:

```azurecli-interactive
az webapp log config --name ${WEBAPP_NAME} \
 --resource-group ${RESOURCEGROUP_NAME} \
 --web-server-logging filesystem
```

Then stream logs to your console using `az webapp log tail`:

```azurecli-interactive
az webapp log tail --name webappname --resource-group myResourceGroup
```

For more information, see [Streaming logs with the Azure CLI](/azure/app-service/web-sites-enable-diagnostic-log#streaming-with-azure-command-line-interface).

### App logging

Enable [application logging](/azure/app-service/web-sites-enable-diagnostic-log#enablediag) through the Azure portal or [Azure CLI](/cli/azure/webapp/log#az-webapp-log-config) to configure App Service to write your application's standard console output and standard console error streams to the local filesystem or Azure Blob Storage. Logging to the local App Service filesystem instance is disabled 12 hours after it is configured. If you need longer retention, configure the application to write output to a Blob storage container.

If your application uses [Logback](https://logback.qos.ch/) or [Log4j](https://logging.apache.org/log4j) for tracing, you can forward these traces for review into Azure Application Insights using the logging framework configuration instructions in [Explore Java trace logs in Application Insights](/azure/application-insights/app-insights-java-trace-logs). 

## Customization and tuning

Azure App Service for Linux supports out of the box tuning and customization through the Azure Portal and CLI. Review the following articles for non-Java specific web app configuration:

- [Configure App Service settings](/azure/app-service/web-sites-configure?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json)
- [Set up a custom domain](/azure/app-service/app-service-web-tutorial-custom-domain?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json)
- [Enable SSL](/azure/app-service/app-service-web-tutorial-custom-ssl?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json)
- [Add a CDN](/azure/cdn/cdn-add-to-web-app?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json)

### Set Java runtime options

To set allocated memory or other JVM runtime options in both the Tomcat and Java SE environments, set the JAVA_OPTS as shown below as an [application setting](/azure/app-service/web-sites-configure#app-settings). App Service Linux passes this setting as an environment variable to the Java runtime when it starts.

In the Azure portal, under **Application Settings** for the web app, create a new app setting named `JAVA_OPTS` that includes the additional settings, such as `$JAVA_OPTS -Xms512m -Xmx1204m`.

To configure the app setting from the Azure App Service Linux Maven plugin, add setting/value tags in the Azure plugin section. The following example sets a specific minimum and maximum Java heapsize:

```xml
<appSettings> 
    <property> 
        <name>JAVA_OPTS</name> 
        <value>$JAVA_OPTS -Xms512m -Xmx1204m</value> 
    </property> 
</appSettings> 
```

Developers running a single application with one deployment slot in their App Service plan can use the following options:

- B1 and S1 instances: -Xms1024m -Xmx1024m
- B2 and S2 instances: -Xms3072m -Xmx3072m
- B3 and S3 instances: -Xms6144m -Xmx6144m


When tuning application heap settings, review your App Service plan details and take into account multiple applications and deployment slot needs to find the optimal allocation of memory.

### Turn on web sockets

Turn on support for web sockets in the Azure portal in the **Application settings** for the application. You'll need to restart the application for the setting to take effect.

Turn on web socket support using the Azure CLI with the following command:

```azurecli-interactive
az webapp config set -n ${WEBAPP_NAME} -g ${WEBAPP_RESOURCEGROUP_NAME} --web-sockets-enabled true 
```

Then restart your application:

```azurecli-interactive
az webapp stop -n ${WEBAPP_NAME} -g ${WEBAPP_RESOURCEGROUP_NAME} 
az webapp start -n ${WEBAPP_NAME} -g ${WEBAPP_RESOURCEGROUP_NAME}  
```

### Set default character encoding 

In the Azure portal, under **Application Settings** for the web app, create a new app setting named `JAVA_OPTS` with value `$JAVA_OPTS -Dfile.encoding=UTF-8`.

Alternatively, you can configure the app setting using the App Service Maven plugin. Add the setting name and value tags in the plugin configuration: 

```xml
<appSettings> 
    <property> 
        <name>JAVA_OPTS</name> 
        <value>$JAVA_OPTS -Dfile.encoding=UTF-8</value> 
    </property> 
</appSettings> 
```

## Secure application

Java applications running in App Service for Linux have the same set of [security best practices](/azure/security/security-paas-applications-using-app-services) as other applications. 

### Authenticate users

Set up app authentication in the Azure Portal with the  **Authentication and Authorization** option. From there, you can enable authentication using Azure Active Directory or social logins like Facebook, Google, or GitHub. Azure portal configuration only works when configuring a single authentication provider.  For more information, see [Configure your App Service app to use Azure Active Directory login](/azure/app-service/app-service-mobile-how-to-configure-active-directory-authentication) and the related articles for other identity providers.

If you need to enable multiple sign-in providers, follow the instructions in the [customize App Service authentication](https://docs.microsoft.com/azure/app-service/app-service-authentication-how-to) article.

 Spring Boot developers can use the [Azure Active Directory Spring Boot starter](/java/azure/spring-framework/configure-spring-boot-starter-java-app-with-azure-active-directory?view=azure-java-stable) to secure applications using familiar Spring Security annotations and APIs.

### Configure TLS/SSL

Follow the instructions in the [Bind an existing custom SSL certificate](/azure/app-service/app-service-web-tutorial-custom-ssl) to upload an existing SSL certificate and bind it to your application's domain name. By default your application will still allow HTTP connections-follow the specific steps in the tutorial to enforce SSL and TLS.

## Tomcat 

### Connecting to data sources

>[!NOTE]
> If your application uses the Spring Framework or Spring Boot, you can set database connection information for Spring Data JPA as environment variables [in your application properties file]. Then use [app settings](/azure/app-service/web-sites-configure#app-settings) to define these values for your application in the Azure portal or CLI.

To configure Tomcat to use managed connections to databases using Java Database Connectivity (JDBC) or the Java Persistence API (JPA), first 
customize the CATALINA_OPTS environment variable read in by Tomcat at start up. Set these values through an app setting in App Service Maven plugin:

```xml
<appSettings> 
    <property> 
        <name>CATALINA_OPTS</name> 
        <value>"$CATALINA_OPTS -Dmysqluser=${mysqluser} -Dmysqlpass=${mysqlpass} -DmysqlURL=${mysqlURL}"</value> 
    </property> 
</appSettings> 
```

Or an equivalent App Service setting from the Azure portal.

Next, determine if the data source needs to be made available just to one application or to all of the applications running on the App Service plan.

For application-level data sources: 

1. Add a `context.xml` file if it does not exist to your web application and add it the `META-INF` directory of your WAR file when the project is built.

2. In this file, add a `Context` path entry to link the data source to a JNDI address. The

    ```xml
    <Context>
        <Resource
            name="jdbc/mysqldb" type="javax.sql.DataSource"
            url="${mysqlURL}"
            driverClassName="com.mysql.jdbc.Driver"
            username="${mysqluser}" password="${mysqlpass}"
        />
    </Context>
    ```

3. Update your application's `web.xml` to use the data source in your application.

    ```xml
    <resource-env-ref>
        <resource-env-ref-name>jdbc/mysqldb</resource-env-ref-name>
        <resource-env-ref-type>javax.sql.DataSource</resource-env-ref-type>
    </resource-env-ref>
    ```

For shared server-level resources:

1. Copy the contents of `/usr/local/tomcat/conf` into `/home/tomcat` on your App Service Linux instance using SSH if you don't have a configuration there already.

2. Add the context to your `server.xml`

    ```xml
    <Context>
        <Resource
            name="jdbc/mysqldb" type="javax.sql.DataSource"
            url="${mysqlURL}"
            driverClassName="com.mysql.jdbc.Driver"
            username="${mysqluser}" password="${mysqlpass}"
        />
    </Context>
    ```

3. Update your application's `web.xml` to use the data source in your application.

    ```xml
    <resource-env-ref>
        <resource-env-ref-name>jdbc/mysqldb</resource-env-ref-name>
        <resource-env-ref-type>javax.sql.DataSource</resource-env-ref-type>
    </resource-env-ref>
    ```

4. Ensure that the JDBC driver files are available to the Tomcat classloader by placing them in the `/home/tomcat/lib` directory. To upload these files to your App Service instance, perform the following steps:  
    1. Install the Azure App Service webpp extension:

      ```azurecli-interactive
      az extension add –name webapp
      ```

    2. Run the following CLI command to create a SSH tunnel from your local system to App Service:

      ```azurecli-interactive
      az webapp remote-connection create –g [resource group] -n [app name] -p [local port to open]
      ```

    3. Connect to the local tunneling port with your SFTP client and upload the files to the `/home/tomcat/lib` folder.

5. Restart the App Service Linux application. Tomcat will reset `CATALINA_HOME` to `/home/tomcat` and use the updated configuration and classes.

## Docker containers

To use the Azure-supported Zulu JDK in your containers, make sure to pull and use the pre-built images listed on [Azul's download page](https://www.azul.com/downloads/azure-only/zulu/#docker) or use the `Dockerfile` examples from the [Microsoft Java GitHub repo](https://github.com/Microsoft/java/tree/master/docker).

## Runtime availability and statement of support

App Service for Linux supports two runtimes for managed hosting of Java web applications:

- The [Tomcat servlet container](http://tomcat.apache.org/) for running applications packaged as web archive (WAR) files. Supported versions are 8.5 and 9.0.
- Java SE runtime environment for running applications packaged as Java archive (JAR) files. The only supported major version is Java 8.

## Java runtime statement of support 

### JDK versions and maintenance

Azure's supported Java Development Kit (JDK) is [Zulu](https://www.azul.com/downloads/azure-only/zulu/) provided through [Azul Systems](https://www.azul.com/).

Major version updates will be provided through new runtime options in Azure App Service for Linux. Customers update to these newer versions of Java by configuring their App Service deployment and are responsible for testing and ensuring the major update meets their needs.

Supported JDKs are automatically patched on a quarterly basis in January, April, July, and October of each year.

### Security updates

Patches and fixes for major security vulnerabilities will be released as soon as they become available from Azul Systems. A "major" vulnerability is defined by a base score of 9.0 or higher on the [NIST Common Vulnerability Scoring System, version 2](https://nvd.nist.gov/cvss.cfm).

### Deprecation and retirement

If a supported Java runtime will be retired, Azure developers using the affected runtime will be given a deprecation notice at least six months before the runtime is retired.

### Local development

Developers can download the Production Edition of Azul Zulu Enterprise JDK for local development from [Azul's download site](https://www.azul.com/downloads/azure-only/zulu/).

### Development support

Product support for the [Azure-supported Azul Zulu JDK](https://www.azul.com/downloads/azure-only/zulu/) is available through when developing for Azure or [Azure Stack](https://azure.microsoft.com/overview/azure-stack/) with a [qualified Azure support plan](https://azure.microsoft.com/support/plans/).

### Runtime support

Developers can [open an issue](/azure/azure-supportability/how-to-create-azure-support-request) with the Azul Zulu JDKs through Azure Support if they have a [qualified support plan](https://azure.microsoft.com/support/plans/).

## Next steps

Visit the [Azure for Java Developers](/java/azure/) center to find Azure quickstarts, tutorials, and Java reference documentation.
