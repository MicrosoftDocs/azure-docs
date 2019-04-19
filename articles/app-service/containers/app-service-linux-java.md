---
title: Java developer's guide for App Service on Linux - Azure | Microsoft Docs
description: Learn how to configure Java apps running in Azure App Service on Linux.
keywords: azure app service, web app, linux, oss, java
services: app-service
author: rloutlaw
manager: angerobe
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: java
ms.topic: article
ms.date: 12/10/2018
ms.author: routlaw
ms.custom: seodec18

---

# Java developer's guide for App Service on Linux

Azure App Service on Linux lets Java developers to quickly build, deploy, and scale their Tomcat or Java Standard Edition (SE) packaged web applications on a fully managed Linux-based service. Deploy applications with Maven plugins from the command line or in editors like IntelliJ, Eclipse, or Visual Studio Code.

This guide provides key concepts and instructions for Java developers using in App Service for Linux. If you've never used Azure App Service for Linux, you should read through the [Java quickstart](quickstart-java.md) first. General questions about using App Service for Linux that aren't specific to the Java development are answered in the [App Service Linux FAQ](app-service-linux-faq.md).

## Deploying your app

You can use the Maven plugin to deploy both .jar and .war files. Please see [this documentation](https://docs.microsoft.com/java/api/overview/azure/maven/azure-webapp-maven-plugin/readme?view=azure-java-stable) for more information on the Maven plugin.

If you are not using Maven, your deployment method will depend on your archive type:

- To deploy .war files to Tomcat, use the `/api/wardeploy/` endpoint to POST your archive file. For more information on this API, please see [this documentation](https://docs.microsoft.com/azure/app-service/deploy-zip#deploy-war-file).
- To deploy .jar files on the Java SE images, use the `/api/zipdeploy/` endpoint of the Kudu site. For more information on this API, please see [this documentation](https://docs.microsoft.com/azure/app-service/deploy-zip#rest).

Do not deploy your .war or .jar using FTP. The FTP tool is designed to upload startup scripts, dependencies, or other runtime files. It is not the optimal choice for deploying web apps.

## Logging and debugging apps

Performance reports, traffic visualizations, and health checkups are available for each app through the Azure portal. See the [Azure App Service diagnostics overview](/azure/app-service/overview-diagnostics) for more information on how to access and use these diagnostic tools.

## Application performance monitoring

See [Application performance monitoring tools with Java apps on Azure App Service on Linux](how-to-java-apm-monitoring.md) for how-to instructions to configure New Relic and AppDynamics with Java apps running on App Service on Linux.

### SSH console access

SSH connectivity to the Linux environment running your app is available. See [SSH support for Azure App Service on Linux](/azure/app-service/containers/app-service-linux-ssh-support) for full instructions to connect to the Linux system through your web browser or local terminal.

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

For more information, see [Streaming logs with the Azure CLI](../troubleshoot-diagnostic-logs.md#streaming-with-azure-cli).

### App logging

Enable [application logging](/azure/app-service/troubleshoot-diagnostic-logs#enablediag) through the Azure portal or [Azure CLI](/cli/azure/webapp/log#az-webapp-log-config) to configure App Service to write your application's standard console output and standard console error streams to the local filesystem or Azure Blob Storage. Logging to the local App Service filesystem instance is disabled 12 hours after it is configured. If you need longer retention, configure the application to write output to a Blob storage container. Your Java and Tomcat app logs can be found in the `/home/LogFiles/Application/` directory.

If your application uses [Logback](https://logback.qos.ch/) or [Log4j](https://logging.apache.org/log4j) for tracing, you can forward these traces for review into Azure Application Insights using the logging framework configuration instructions in [Explore Java trace logs in Application Insights](/azure/application-insights/app-insights-java-trace-logs).

### Troubleshooting Tools

The built-in Java images are based on the [Alpine Linux](https://alpine-linux.readthedocs.io/en/latest/getting_started.html) operating system. Use the `apk` package manager to install any troubleshooting tools or commands.

## Customization and tuning

Azure App Service for Linux supports out of the box tuning and customization through the Azure Portal and CLI. Review the following articles for non-Java specific web app configuration:

- [Configure App Service settings](/azure/app-service/web-sites-configure?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json)
- [Set up a custom domain](/azure/app-service/app-service-web-tutorial-custom-domain?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json)
- [Enable SSL](/azure/app-service/app-service-web-tutorial-custom-ssl?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json)
- [Add a CDN](/azure/cdn/cdn-add-to-web-app?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json)
- [Configure the Kudu site](https://github.com/projectkudu/kudu/wiki/Configurable-settings#linux-on-app-service-settings)

### Set Java runtime options

To set allocated memory or other JVM runtime options in both the Tomcat and Java SE environments, create an [application setting](/azure/app-service/web-sites-configure#app-settings) named `JAVA_OPTS` with the options. App Service Linux passes this setting as an environment variable to the Java runtime when it starts.

In the Azure portal, under **Application Settings** for the web app, create a new app setting named `JAVA_OPTS` that includes the additional settings, such as `-Xms512m -Xmx1204m`.

To configure the app setting from the Maven plugin, add setting/value tags in the Azure plugin section. The following example sets a specific minimum and maximum Java heapsize:

```xml
<appSettings>
    <property>
        <name>JAVA_OPTS</name>
        <value>-Xms512m -Xmx1204m</value>
    </property>
</appSettings>
```

Developers running a single application with one deployment slot in their App Service plan can use the following options:

- B1 and S1 instances: `-Xms1024m -Xmx1024m`
- B2 and S2 instances: `-Xms3072m -Xmx3072m`
- B3 and S3 instances: `-Xms6144m -Xmx6144m`

When tuning application heap settings, review your App Service plan details and take into account multiple applications and deployment slot needs to find the optimal allocation of memory.

If you are deploying a JAR application, it should be named `app.jar` so that the built-in image can correctly identify your app. (The Maven plugin does this renaming automatically.) If you do not wish to rename your JAR to `app.jar`, you can upload a shell script with the command to run your JAR. Then paste the full path to this script in the [Startup File](https://docs.microsoft.com/en-us/azure/app-service/containers/app-service-linux-faq#startup-file) textbox in the Configuration section of the Portal.

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

In the Azure portal, under **Application Settings** for the web app, create a new app setting named `JAVA_OPTS` with value `-Dfile.encoding=UTF-8`.

Alternatively, you can configure the app setting using the App Service Maven plugin. Add the setting name and value tags in the plugin configuration:

```xml
<appSettings>
    <property>
        <name>JAVA_OPTS</name>
        <value>-Dfile.encoding=UTF-8</value>
    </property>
</appSettings>
```

### Adjust startup timeout

If your Java application is particularly large, you should increase the startup time limit. To do this, create an application setting, `WEBSITES_CONTAINER_START_TIME_LIMIT` and set it to the number of seconds that App Service should wait before timing out. The maximum value is `1800` seconds.

## Secure applications

Java applications running in App Service for Linux have the same set of [security best practices](/azure/security/security-paas-applications-using-app-services) as other applications.

### Authenticate users

Set up app authentication in the Azure Portal with the  **Authentication and Authorization** option. From there, you can enable authentication using Azure Active Directory or social logins like Facebook, Google, or GitHub. Azure portal configuration only works when configuring a single authentication provider.  For more information, see [Configure your App Service app to use Azure Active Directory login](/azure/app-service/configure-authentication-provider-aad) and the related articles for other identity providers.

If you need to enable multiple sign-in providers, follow the instructions in the [customize App Service authentication](https://docs.microsoft.com/azure/app-service/app-service-authentication-how-to) article.

Spring Boot developers can use the [Azure Active Directory Spring Boot starter](/java/azure/spring-framework/configure-spring-boot-starter-java-app-with-azure-active-directory?view=azure-java-stable) to secure applications using familiar Spring Security annotations and APIs. Be sure to increase the maximum header size in your `application.properties` file. We suggest a value of `16384`.

### Configure TLS/SSL

Follow the instructions in the [Bind an existing custom SSL certificate](/azure/app-service/app-service-web-tutorial-custom-ssl) to upload an existing SSL certificate and bind it to your application's domain name. By default your application will still allow HTTP connections-follow the specific steps in the tutorial to enforce SSL and TLS.

### Use KeyVault References

[Azure KeyVault](../../key-vault/key-vault-overview.md) provides centralized secret management with access policies and audit history. You can store secrets (such as passwords or connection strings) in KeyVault and access these secrets in your application through environment variables.

First, follow the instructions for [granting your app access to Key Vault](../app-service-key-vault-references.md#granting-your-app-access-to-key-vault) and [making a KeyVault reference to your secret in an Application Setting](../app-service-key-vault-references.md#reference-syntax). You can validate that the reference resolves to the secret by printing the environment variable while remotely accessing the App Service terminal.

To inject these secrets in your Spring or Tomcat configuration file, use environment variable injection syntax (`${MY_ENV_VAR}`). For Spring configuration files, please see this documentation on [externalized configurations](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html).

## Data sources

### Tomcat

These instructions apply to all database connections. You will need to fill placeholders with your chosen database's driver class name and JAR file. Provided is a table with class names and driver downloads for common databases.

| Database   | Driver Class Name                             | JDBC Driver                                                                      |
|------------|-----------------------------------------------|------------------------------------------------------------------------------------------|
| PostgreSQL | `org.postgresql.Driver`                        | [Download](https://jdbc.postgresql.org/download.html)                                    |
| MySQL      | `com.mysql.jdbc.Driver`                        | [Download](https://dev.mysql.com/downloads/connector/j/) (Select "Platform Independent") |
| SQL Server | `com.microsoft.sqlserver.jdbc.SQLServerDriver` | [Download](https://docs.microsoft.com/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server?view=sql-server-2017#available-downloads-of-jdbc-driver-for-sql-server)                                                           |

To configure Tomcat to use Java Database Connectivity (JDBC) or the Java Persistence API (JPA), first customize the `CATALINA_OPTS` environment variable that is read in by Tomcat at start up. Set these values through an app setting in the [App Service Maven plugin](https://github.com/Microsoft/azure-maven-plugins/blob/develop/azure-webapp-maven-plugin/README.md):

```xml
<appSettings>  
    <property>  
        <name>CATALINA_OPTS</name>  
        <value>"$CATALINA_OPTS -Ddbuser=${DBUSER} -Ddbpassword=${DBPASSWORD} -DconnURL=${CONNURL}"</value>  
    </property>  
</appSettings>  
```

Or set the environment variables in the "Application Settings" blade in the Azure portal.

Next, determine if the data source should be available to one application or to all applications running on the Tomcat servlet.

#### Application-level data sources

1. Create a `context.xml` file in the `META-INF/` directory of your project. Create the `META-INF/` directory if it does not exist.

2. In `context.xml`, add a `Context` element to link the data source to a JNDI address. Replace the `driverClassName` placeholder with your driver's class name from the table above.

    ```xml
    <Context>
        <Resource
            name="jdbc/dbconnection"
            type="javax.sql.DataSource"
            url="${dbuser}"
            driverClassName="<insert your driver class name>"
            username="${dbpassword}"
            password="${connURL}"
        />
    </Context>
    ```

3. Update your application's `web.xml` to use the data source in your application.

    ```xml
    <resource-env-ref>
        <resource-env-ref-name>jdbc/dbconnection</resource-env-ref-name>
        <resource-env-ref-type>javax.sql.DataSource</resource-env-ref-type>
    </resource-env-ref>
    ```

#### Shared, server-level resources

1. Copy the contents of `/usr/local/tomcat/conf` into `/home/tomcat/conf` on your App Service Linux instance using SSH if you don't have a configuration there already.

    ```bash
    mkdir -p /home/tomcat
    cp -a /usr/local/tomcat/conf /home/tomcat/conf
    ```

2. Add a Context element in your `server.xml` within the `<Server>` element.

    ```xml
    <Server>
    ...
    <Context>
        <Resource
            name="jdbc/dbconnection"
            type="javax.sql.DataSource"
            url="${dbuser}"
            driverClassName="<insert your driver class name>"
            username="${dbpassword}"
            password="${connURL}"
        />
    </Context>
    ...
    </Server>
    ```

3. Update your application's `web.xml` to use the data source in your application.

    ```xml
    <resource-env-ref>
        <resource-env-ref-name>jdbc/dbconnection</resource-env-ref-name>
        <resource-env-ref-type>javax.sql.DataSource</resource-env-ref-type>
    </resource-env-ref>
    ```

#### Finally, place the driver JARs in the Tomcat classpath and restart your App Service

1. Ensure that the JDBC driver files are available to the Tomcat classloader by placing them in the `/home/tomcat/lib` directory. (Create this directory if it does not already exist.) To upload these files to your App Service instance, perform the following steps:  
   1. Install the Azure App Service webpp extension:

      ```azurecli-interactive
      az extension add –name webapp
      ```

   1. Run the following CLI command to create a SSH tunnel from your local system to App Service:

      ```azurecli-interactive
      az webapp remote-connection create –g [resource group] -n [app name] -p [local port to open]
      ```

   1. Connect to the local tunneling port with your SFTP client and upload the files to the `/home/tomcat/lib` folder.

      Alternatively, you can use an FTP client to upload the JDBC driver. Follow these [instructions for getting your FTP credentials](https://docs.microsoft.com/azure/app-service/deploy-configure-credentials).

2. If you created a server-level data source, restart the App Service Linux application. Tomcat will reset `CATALINA_HOME` to `/home/tomcat/conf` and use the updated configuration.

### Spring Boot

To connect to data sources in Spring Boot applications, we suggest creating connection strings and injecting them into your `application.properties` file.

1. In the "Application Settings" section of the App Service blade, set a name for the string, paste your JDBC connection string into the value field, and set the type to "Custom". You can optionally set this connection string as slot setting.

    ![Creating a connection string in the Portal.][1]

    This connection string is accessible to our application as an environment variable named `CUSTOMCONNSTR_<your-string-name>`. For example, the connection string we created above will be named `CUSTOMCONNSTR_exampledb`.

2. In your `application.properties` file, reference this connction string with the environment variable name. For our example, we would use the following.

    ```yml
    app.datasource.url=${CUSTOMCONNSTR_exampledb}
    ```

Please see the [Spring Boot documentation on data access](https://docs.spring.io/spring-boot/docs/current/reference/html/howto-data-access.html
) and [externalized configurations](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html) for more information on this topic.

## Docker containers

To use the Azure-supported Zulu JDK in your containers, make sure to pull and use the pre-built images as documented from the [supported Azul Zulu Enterprise for Azure download page](https://www.azul.com/downloads/azure-only/zulu/) or use the `Dockerfile` examples from the [Microsoft Java GitHub repo](https://github.com/Microsoft/java/tree/master/docker).

## Runtime availability and statement of support

App Service for Linux supports two runtimes for managed hosting of Java web applications:

- The [Tomcat servlet container](https://tomcat.apache.org/) for running applications packaged as web archive (WAR) files. Supported versions are 8.5 and 9.0.
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

<!--Image references-->
[1]: ./media/app-service-linux-java/connection-string.png
