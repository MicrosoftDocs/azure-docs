---
title: Configure Linux Java apps - Azure App Service | Microsoft Docs
description: Learn how to configure Java apps running in Azure App Service on Linux.
keywords: azure app service, web app, linux, oss, java, java ee, jee, javaee
services: app-service
author: bmitchell287
manager: douge
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: java
ms.topic: article
ms.date: 06/26/2019
ms.author: brendm
ms.custom: seodec18

---

# Configure a Linux Java app for Azure App Service

Azure App Service on Linux lets Java developers to quickly build, deploy, and scale their Tomcat or Java Standard Edition (SE) packaged web applications on a fully managed Linux-based service. Deploy applications with Maven plugins from the command line or in editors like IntelliJ, Eclipse, or Visual Studio Code.

This guide provides key concepts and instructions for Java developers who use a built-in Linux container in App Service. If you've never used Azure App Service, follow the [Java quickstart](quickstart-java.md) and [Java with PostgreSQL tutorial](tutorial-java-enterprise-postgresql-app.md) first.

## Deploying your app

You can use [Maven Plugin for Azure App Service](/java/api/overview/azure/maven/azure-webapp-maven-plugin/readme) to deploy both .jar and .war files. Deployment with popular IDEs is also supported with [Azure Toolkit for IntelliJ](/java/azure/intellij/azure-toolkit-for-intellij) or [Azure Toolkit for Eclipse](/java/azure/eclipse/azure-toolkit-for-eclipse).

Otherwise, your deployment method will depend on your archive type:

- To deploy .war files to Tomcat, use the `/api/wardeploy/` endpoint to POST your archive file. For more information on this API, please see [this documentation](https://docs.microsoft.com/azure/app-service/deploy-zip#deploy-war-file).
- To deploy .jar files on the Java SE images, use the `/api/zipdeploy/` endpoint of the Kudu site. For more information on this API, please see [this documentation](https://docs.microsoft.com/azure/app-service/deploy-zip#rest).

Do not deploy your .war or .jar using FTP. The FTP tool is designed to upload startup scripts, dependencies, or other runtime files. It is not the optimal choice for deploying web apps.

## Logging and debugging apps

Performance reports, traffic visualizations, and health checkups are available for each app through the Azure portal. For more information, see [Azure App Service diagnostics overview](../overview-diagnostics.md).

### SSH console access

[!INCLUDE [Open SSH session in browser](../../../includes/app-service-web-ssh-connect-builtin-no-h.md)]

### Stream diagnostic logs

[!INCLUDE [Access diagnostic logs](../../../includes/app-service-web-logs-access-no-h.md)]

For more information, see [Streaming logs with the Azure CLI](../troubleshoot-diagnostic-logs.md#streaming-with-azure-cli).

### App logging

Enable [application logging](../troubleshoot-diagnostic-logs.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#enablediag) through the Azure portal or [Azure CLI](/cli/azure/webapp/log#az-webapp-log-config) to configure App Service to write your application's standard console output and standard console error streams to the local filesystem or Azure Blob Storage. Logging to the local App Service filesystem instance is disabled 12 hours after it is configured. If you need longer retention, configure the application to write output to a Blob storage container. Your Java and Tomcat app logs can be found in the */home/LogFiles/Application/* directory.

If your application uses [Logback](https://logback.qos.ch/) or [Log4j](https://logging.apache.org/log4j) for tracing, you can forward these traces for review into Azure Application Insights using the logging framework configuration instructions in [Explore Java trace logs in Application Insights](/azure/application-insights/app-insights-java-trace-logs).

### Troubleshooting tools

The built-in Java images are based on the [Alpine Linux](https://alpine-linux.readthedocs.io/en/latest/getting_started.html) operating system. Use the `apk` package manager to install any troubleshooting tools or commands.

### Flight Recorder

All Linux Java images on App Service have Zulu Flight Recorder installed so you can easily connect to the JVM and start a profiler recording or generate a heap dump.

#### Timed Recording

To get started, SSH into your App Service and run the `jcmd` command to see a list of all the Java processes running. In addition to jcmd itself, you should see your Java application running with a process ID number (pid).

```shell
078990bbcd11:/home# jcmd
Picked up JAVA_TOOL_OPTIONS: -Djava.net.preferIPv4Stack=true
147 sun.tools.jcmd.JCmd
116 /home/site/wwwroot/app.jar
```

Execute the command below to start a 30-second recording of the JVM. This will profile the JVM and create a JFR file named *jfr_example.jfr* in the home directory. (Replace 116 with the pid of your Java app.)

```shell
jcmd 116 JFR.start name=MyRecording settings=profile duration=30s filename="/home/jfr_example.jfr"
```

During the 30 second interval, you can validate the recording is taking place by running `jcmd 116 JFR.check`. This will show all recordings for the given Java process.

#### Continuous Recording

You can use Zulu Flight Recorder to continuously profile your Java application with minimal impact on runtime performance ([source](https://assets.azul.com/files/Zulu-Mission-Control-data-sheet-31-Mar-19.pdf)). To do so, run the following Azure CLI command to create an App Setting named JAVA_OPTS with the necessary configuration. The contents of JAVA_OPTS App Setting are passed to the `java` command when your app is started.

```azurecli
az webapp config appsettings set -g <your_resource_group> -n <your_app_name> --settings JAVA_OPTS=-XX:StartFlightRecording=disk=true,name=continuous_recording,dumponexit=true,maxsize=1024m,maxage=1d
```

For more information, please see the [Jcmd Command Reference](https://docs.oracle.com/javacomponents/jmc-5-5/jfr-runtime-guide/comline.htm#JFRRT190).

### Analyzing Recordings

Use [FTPS](../deploy-ftp.md) to download your JFR file to your local machine. To analyze the JFR file, download and install [Zulu Mission Control](https://www.azul.com/products/zulu-mission-control/). For instructions on Zulu Mission Control, see the [Azul documentation](https://docs.azul.com/zmc/) and the [installation instructions](https://docs.microsoft.com/java/azure/jdk/java-jdk-flight-recorder-and-mission-control).

## Customization and tuning

Azure App Service for Linux supports out of the box tuning and customization through the Azure portal and CLI. Review the following articles for non-Java-specific web app configuration:

- [Configure app settings](../configure-common.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#configure-app-settings)
- [Set up a custom domain](../app-service-web-tutorial-custom-domain.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json)
- [Enable SSL](../app-service-web-tutorial-custom-ssl.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json)
- [Add a CDN](../../cdn/cdn-add-to-web-app.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json)
- [Configure the Kudu site](https://github.com/projectkudu/kudu/wiki/Configurable-settings#linux-on-app-service-settings)

### Set Java runtime options

To set allocated memory or other JVM runtime options in both the Tomcat and Java SE environments, create an [app setting](../configure-common.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#configure-app-settings) named `JAVA_OPTS` with the options. App Service Linux passes this setting as an environment variable to the Java runtime when it starts.

In the Azure portal, under **Application Settings** for the web app, create a new app setting named `JAVA_OPTS` that includes the additional settings, such as `-Xms512m -Xmx1204m`.

To configure the app setting from the Maven plugin, add setting/value tags in the Azure plugin section. The following example sets a specific minimum and maximum Java heap size:

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

If you are deploying a JAR application, it should be named *app.jar* so that the built-in image can correctly identify your app. (The Maven plugin does this renaming automatically.) If you do not wish to rename your JAR to *app.jar*, you can upload a shell script with the command to run your JAR. Then paste the full path to this script in the [Startup File](app-service-linux-faq.md#built-in-images) textbox in the Configuration section of the portal.

### Turn on web sockets

Turn on support for web sockets in the Azure portal in the **Application settings** for the application. You'll need to restart the application for the setting to take effect.

Turn on web socket support using the Azure CLI with the following command:

```azurecli-interactive
az webapp config set --name <app-name> --resource-group <resource-group-name> --web-sockets-enabled true
```

Then restart your application:

```azurecli-interactive
az webapp stop --name <app-name> --resource-group <resource-group-name>
az webapp start --name <app-name> --resource-group <resource-group-name>
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

### Pre-Compile JSP files

To improve performance of Tomcat applications, you can compile your JSP files before deploying to App Service. You can use the [Maven plugin](https://sling.apache.org/components/jspc-maven-plugin/plugin-info.html) provided by Apache Sling, or using this [Ant build file](https://tomcat.apache.org/tomcat-9.0-doc/jasper-howto.html#Web_Application_Compilation).

## Secure applications

Java applications running in App Service for Linux have the same set of [security best practices](/azure/security/security-paas-applications-using-app-services) as other applications.

### Authenticate users

Set up app authentication in the Azure portal with the **Authentication and Authorization** option. From there, you can enable authentication using Azure Active Directory or social logins like Facebook, Google, or GitHub. Azure portal configuration only works when configuring a single authentication provider. For more information, see [Configure your App Service app to use Azure Active Directory login](../configure-authentication-provider-aad.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json) and the related articles for other identity providers. If you need to enable multiple sign-in providers, follow the instructions in the [customize App Service authentication](../app-service-authentication-how-to.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json) article.

#### Tomcat

Your Tomcat application can access the user's claims directly from the Tomcat servlet by casting the Principal object to a Map object. The Map object will map each claim type to a collection of the claims for that type. In the code below, `request` is an instance of `HttpServletRequest`.

```java
Map<String, Collection<String>> map = (Map<String, Collection<String>>) request.getUserPrincipal();
```

Now you can inspect the `Map` object for any specific claim. For example, the following code snippet iterates through all the claim types and prints the contents of each collection.

```java
for (Object key : map.keySet()) {
        Object value = map.get(key);
        if (value != null && value instanceof Collection {
            Collection claims = (Collection) value;
            for (Object claim : claims) {
                System.out.println(claims);
            }
        }
    }
```

To sign users out and perform other actions, please see the documentation on [App Service Authentication and Authorization usage](https://docs.microsoft.com/azure/app-service/app-service-authentication-how-to). There is also official documentation on the Tomcat [HttpServletRequest interface](https://tomcat.apache.org/tomcat-5.5-doc/servletapi/javax/servlet/http/HttpServletRequest.html) and its methods. The following servlet methods are also hydrated based on your App Service configuration:

```java
public boolean isSecure()
public String getRemoteAddr()
public String getRemoteHost()
public String getScheme()
public int getServerPort()
```

To disable this feature, create an Application Setting named `WEBSITE_AUTH_SKIP_PRINCIPAL` with a value of `1`. To disable all servlet filters added by App Service, create a setting named `WEBSITE_SKIP_FILTERS` with a value of `1`.

#### Spring Boot

Spring Boot developers can use the [Azure Active Directory Spring Boot starter](/java/azure/spring-framework/configure-spring-boot-starter-java-app-with-azure-active-directory?view=azure-java-stable) to secure applications using familiar Spring Security annotations and APIs. Be sure to increase the maximum header size in your *application.properties* file. We suggest a value of `16384`.

### Configure TLS/SSL

Follow the instructions in the [Bind an existing custom SSL certificate](../app-service-web-tutorial-custom-ssl.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json) to upload an existing SSL certificate and bind it to your application's domain name. By default your application will still allow HTTP connections-follow the specific steps in the tutorial to enforce SSL and TLS.

### Use KeyVault References

[Azure KeyVault](../../key-vault/key-vault-overview.md) provides centralized secret management with access policies and audit history. You can store secrets (such as passwords or connection strings) in KeyVault and access these secrets in your application through environment variables.

First, follow the instructions for [granting your app access to Key Vault](../app-service-key-vault-references.md#granting-your-app-access-to-key-vault) and [making a KeyVault reference to your secret in an Application Setting](../app-service-key-vault-references.md#reference-syntax). You can validate that the reference resolves to the secret by printing the environment variable while remotely accessing the App Service terminal.

To inject these secrets in your Spring or Tomcat configuration file, use environment variable injection syntax (`${MY_ENV_VAR}`). For Spring configuration files, please see this documentation on [externalized configurations](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html).

## Configure APM platforms

This section shows how to connect Java applications deployed on Azure App Service on Linux with the NewRelic and AppDynamics application performance monitoring (APM) platforms.

[Configure New Relic](#configure-new-relic)
[Configure AppDynamics](#configure-appdynamics)

### Configure New Relic

1. Create a NewRelic account at [NewRelic.com](https://newrelic.com/signup)
2. Download the Java agent from NewRelic, it will have a file name similar to *newrelic-java-x.x.x.zip*.
3. Copy your license key, you'll need it to configure the agent later.
4. [SSH into your App Service instance](app-service-linux-ssh-support.md) and create a new directory */home/site/wwwroot/apm*.
5. Upload the unpacked NewRelic Java agent files into a directory under */home/site/wwwroot/apm*. The files for your agent should be in */home/site/wwwroot/apm/newrelic*.
6. Modify the YAML file at */home/site/wwwroot/apm/newrelic/newrelic.yml* and replace the placeholder license value with your own license key.
7. In the Azure portal, browse to your application in App Service and create a new Application Setting.
    - If your app is using **Java SE**, create an environment variable named `JAVA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/newrelic/newrelic.jar`.
    - If you're using **Tomcat**, create an environment variable named `CATALINA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/newrelic/newrelic.jar`.
    - If you're using **WildFly**, see the New Relic documentation [here](https://docs.newrelic.com/docs/agents/java-agent/additional-installation/wildfly-version-11-installation-java) for guidance about installing the Java agent and JBoss configuration.
    - If you already have an environment variable for `JAVA_OPTS` or `CATALINA_OPTS`, append the `javaagent` option to the end of the current value.

### Configure AppDynamics

1. Create an AppDynamics account at [AppDynamics.com](https://www.appdynamics.com/community/register/)
2. Download the Java agent from the AppDynamics website, the file name will be similar to *AppServerAgent-x.x.x.xxxxx.zip*
3. [SSH into your App Service instance](app-service-linux-ssh-support.md) and create a new directory */home/site/wwwroot/apm*.
4. Upload the Java agent files into a directory under */home/site/wwwroot/apm*. The files for your agent should be in */home/site/wwwroot/apm/appdynamics*.
5. In the Azure portal, browse to your application in App Service and create a new Application Setting.
    - If you're using **Java SE**, create an environment variable named `JAVA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/appdynamics/javaagent.jar -Dappdynamics.agent.applicationName=<app-name>` where `<app-name>` is your App Service name.
    - If you're using **Tomcat**, create an environment variable named `CATALINA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/appdynamics/javaagent.jar -Dappdynamics.agent.applicationName=<app-name>` where `<app-name>` is your App Service name.
    - If you're using **WildFly**, see the AppDynamics documentation [here](https://docs.appdynamics.com/display/PRO45/JBoss+and+Wildfly+Startup+Settings) for guidance about installing the Java agent and JBoss configuration.

## Configure JAR Applications

### Starting JAR Apps

By default, App Service expects your JAR application to be named *app.jar*. If it has this name, it will be run automatically. For Maven users, you can set the JAR name by including `<finalName>app</finalName>` in the `<build>` section of your *pom.xml*. [You can do the same in Gradle](https://docs.gradle.org/current/dsl/org.gradle.api.tasks.bundling.Jar.html#org.gradle.api.tasks.bundling.Jar:archiveFileName) by setting the `archiveFileName` property.

If you want to use a different name for your JAR, you must also provide the [Startup Command](app-service-linux-faq.md#built-in-images) that executes your JAR file. For example, `java -jar my-jar-app.jar`. You can set the value for your Startup Command in the Portal, under Configuration > General Settings, or with an Application Setting named `STARTUP_COMMAND`.

### Server Port

App Service Linux routes incoming requests to port 80, so your application should listen on port 80 as well. You can do this in your application's configuration (such as Spring's *application.properties* file), or in your Startup Command (for example, `java -jar spring-app.jar --server.port=80`). Please see the following documentation for common Java frameworks:

- [Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/html/howto-properties-and-configuration.html#howto-use-short-command-line-arguments)
- [SparkJava](http://sparkjava.com/documentation#embedded-web-server)
- [Micronaut](https://docs.micronaut.io/latest/guide/index.html#runningSpecificPort)
- [Play Framework](https://www.playframework.com/documentation/2.6.x/ConfiguringHttps#Configuring-HTTPS)
- [Vertx](https://vertx.io/docs/vertx-core/java/#_start_the_server_listening)
- [Quarkus](https://quarkus.io/guides/application-configuration-guide)

## Data sources

### Tomcat

These instructions apply to all database connections. You will need to fill placeholders with your chosen database's driver class name and JAR file. Provided is a table with class names and driver downloads for common databases.

| Database   | Driver Class Name                             | JDBC Driver                                                                      |
|------------|-----------------------------------------------|------------------------------------------------------------------------------------------|
| PostgreSQL | `org.postgresql.Driver`                        | [Download](https://jdbc.postgresql.org/download.html)                                    |
| MySQL      | `com.mysql.jdbc.Driver`                        | [Download](https://dev.mysql.com/downloads/connector/j/) (Select "Platform Independent") |
| SQL Server | `com.microsoft.sqlserver.jdbc.SQLServerDriver` | [Download](https://docs.microsoft.com/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server?view=sql-server-2017#available-downloads-of-jdbc-driver-for-sql-server)                                                           |

To configure Tomcat to use Java Database Connectivity (JDBC) or the Java Persistence API (JPA), first customize the `CATALINA_OPTS` environment variable that is read in by Tomcat at start-up. Set these values through an app setting in the [App Service Maven plugin](https://github.com/Microsoft/azure-maven-plugins/blob/develop/azure-webapp-maven-plugin/README.md):

```xml
<appSettings>
    <property>
        <name>CATALINA_OPTS</name>
        <value>"$CATALINA_OPTS -Ddbuser=${DBUSER} -Ddbpassword=${DBPASSWORD} -DconnURL=${CONNURL}"</value>
    </property>
</appSettings>
```

Or set the environment variables in the **Configuration** > **Application Settings** page in the Azure portal.

Next, determine if the data source should be available to one application or to all applications running on the Tomcat servlet.

#### Application-level data sources

1. Create a *context.xml* file in the *META-INF/* directory of your project. Create the *META-INF/* directory if it does not exist.

2. In *context.xml*, add a `Context` element to link the data source to a JNDI address. Replace the `driverClassName` placeholder with your driver's class name from the table above.

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

3. Update your application's *web.xml* to use the data source in your application.

    ```xml
    <resource-env-ref>
        <resource-env-ref-name>jdbc/dbconnection</resource-env-ref-name>
        <resource-env-ref-type>javax.sql.DataSource</resource-env-ref-type>
    </resource-env-ref>
    ```

#### Shared server-level resources

1. Copy the contents of */usr/local/tomcat/conf* into */home/tomcat/conf* on your App Service Linux instance using SSH if you don't have a configuration there already.

    ```bash
    mkdir -p /home/tomcat
    cp -a /usr/local/tomcat/conf /home/tomcat/conf
    ```

2. Add a Context element in your *server.xml* within the `<Server>` element.

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

3. Update your application's *web.xml* to use the data source in your application.

    ```xml
    <resource-env-ref>
        <resource-env-ref-name>jdbc/dbconnection</resource-env-ref-name>
        <resource-env-ref-type>javax.sql.DataSource</resource-env-ref-type>
    </resource-env-ref>
    ```

#### Finalize configuration

Finally, place the driver JARs in the Tomcat classpath and restart your App Service.

1. Ensure that the JDBC driver files are available to the Tomcat classloader by placing them in the */home/tomcat/lib* directory. (Create this directory if it does not already exist.) To upload these files to your App Service instance, perform the following steps:

    1. In the [Cloud Shell](https://shell.azure.com), install the webapp extension:

      ```azurecli-interactive
      az extension add -–name webapp
      ```

    2. Run the following CLI command to create an SSH tunnel from your local system to App Service:

      ```azurecli-interactive
      az webapp remote-connection create --resource-group <resource-group-name> --name <app-name> --port <port-on-local-machine>
      ```

    3. Connect to the local tunneling port with your SFTP client and upload the files to the */home/tomcat/lib* folder.

    Alternatively, you can use an FTP client to upload the JDBC driver. Follow these [instructions for getting your FTP credentials](../deploy-configure-credentials.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json).

2. If you created a server-level data source, restart the App Service Linux application. Tomcat will reset `CATALINA_HOME` to `/home/tomcat/conf` and use the updated configuration.

### Spring Boot

To connect to data sources in Spring Boot applications, we suggest creating connection strings and injecting them into your *application.properties* file.

1. In the "Configuration" section of the App Service page, set a name for the string, paste your JDBC connection string into the value field, and set the type to "Custom". You can optionally set this connection string as slot setting.

    This connection string is accessible to our application as an environment variable named `CUSTOMCONNSTR_<your-string-name>`. For example, the connection string we created above will be named `CUSTOMCONNSTR_exampledb`.

2. In your *application.properties* file, reference this connection string with the environment variable name. For our example, we would use the following.

    ```yml
    app.datasource.url=${CUSTOMCONNSTR_exampledb}
    ```

Please see the [Spring Boot documentation on data access](https://docs.spring.io/spring-boot/docs/current/reference/html/howto-data-access.html) and [externalized configurations](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html) for more information on this topic.

## Configure Java EE (WildFly)

> [!NOTE]
> Java Enterprise Edition on App Service Linux is currently in Preview. This stack is **not** recommended for production-facing work. information on our Java SE and Tomcat stacks.

Azure App Service on Linux lets Java developers to build, deploy, and scale Java Enterprise (Java EE) applications on a fully managed Linux-based service.  The underlying Java Enterprise runtime environment is the open-source [WildFly](https://wildfly.org/) application server.

This section contains the following subsections:

- [Scale with App Service](#scale-with-app-service)
- [Customize application server configuration](#customize-application-server-configuration)
- [Install modules and dependencies](#install-modules-and-dependencies)
- [Configure data sources](#configure-data-sources)
- [Enable messaging providers](#enable-messaging-providers)
- [Configure session management caching](#configure-session-management-caching)

### Scale with App Service

The WildFly application server running in App Service on Linux runs in standalone mode, not in a domain configuration. When you scale out the App Service Plan, each WildFly instance is configured as a standalone server.

Scale your application vertically or horizontally with [scale rules](../../monitoring-and-diagnostics/monitoring-autoscale-get-started.md) and by [increasing your instance count](../web-sites-scale.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json).

### Customize application server configuration

Web App instances are stateless, so each new instance started must be configured on startup to support the WildFly configuration needed by application.
You can write a startup Bash script to call the WildFly CLI to:

- Set up data sources
- Configure messaging providers
- Add other modules and dependencies to the WildFly server configuration.

The script runs when WildFly is up and running, but before the application starts. The script should use the [JBOSS CLI](https://docs.jboss.org/author/display/WFLY/Command+Line+Interface) called from */opt/jboss/wildfly/bin/jboss-cli.sh* to configure the application server with any configuration or changes needed after the server starts.

Do not use the interactive mode of the CLI to configure WildFly. Instead, you can provide a script of commands to the JBoss CLI using the `--file` command, for example:

```bash
/opt/jboss/wildfly/bin/jboss-cli.sh -c --file=/path/to/your/jboss_commands.cli
```

Use FTP to upload the startup script to a location in your App Service instance under your */home* directory, such as */home/site/deployments/tools*. For more info, see [Deploy your app to Azure App Service using FTP/S](https://docs.microsoft.com/azure/app-service/deploy-ftp).

Set the **Startup Script** field in the Azure portal to the location of your startup shell script, for example */home/site/deployments/tools/your-startup-script.sh*.

Supply [app settings](../configure-common.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#configure-app-settings) in the application configuration to pass environment variables for use in the script. Application settings keep connection strings and other secrets needed to configure your application out of version control.

### Install modules and dependencies

To install modules and their dependencies into the WildFly classpath via the JBoss CLI, you will need to create the following files in their own directory. Some modules and dependencies might need additional configuration such as JNDI naming or other API-specific configuration, so this list is a minimum set of what you'll need to configure a dependency in most cases.

- An [XML module descriptor](https://jboss-modules.github.io/jboss-modules/manual/#descriptors). This XML file defines the name, attributes, and dependencies of your module. This [example module.xml file](https://access.redhat.com/documentation/en-us/jboss_enterprise_application_platform/6/html/administration_and_configuration_guide/example_postgresql_xa_datasource) defines a Postgres module, its JAR file JDBC dependency, and other module dependencies required.
- Any necessary JAR file dependencies for your module.
- A script with your JBoss CLI commands to configure the new module. This file will contain your commands to be executed by the JBoss CLI to configure the server to use the dependency. For documentation on the commands to add modules, datasources, and messaging providers, refer to [this document](https://access.redhat.com/documentation/red_hat_jboss_enterprise_application_platform/7.0/html-single/management_cli_guide/#how_to_cli).
- A Bash startup script to call the JBoss CLI and execute the script in the previous step. This file will be executed when your App Service instance is restarted or when new instances are provisioned during a scale-out. This startup script is where you can perform any other configurations for your application as the JBoss commands are passed to the JBoss CLI. At minimum, this file can be a single command to pass your JBoss CLI command script to the JBoss CLI:

```bash
/opt/jboss/wildfly/bin/jboss-cli.sh -c --file=/path/to/your/jboss_commands.cli
```

Once you have the files and content for your module, follow the steps below to add the module to the WildFly application server.

1. Use FTP to upload your files to a location in your App Service instance under your */home* directory, such as */home/site/deployments/tools*. For more info, see [Deploy your app to Azure App Service using FTP/S](../deploy-ftp.md).
2. In the **Configuration** > **General settings** page of the Azure portal, set the **Startup Script** field to the location of your startup shell script, for example */home/site/deployments/tools/startup.sh*.
3. Restart your App Service instance by pressing the **Restart** button in the **Overview** section of the portal or using the Azure CLI.

### Configure data sources

To configure WildFly/JBoss to access a data source, you use the general process outlined above in the "Install modules and dependencies" section. The following section provides specific details on this process for PostgreSQL, MySQL, and SQL Server data sources.

This section assumes you already have an app, an App Service instance, and an Azure Database service instance. The instructions below refer to your App Service name, its resource group, and your database connection info. You can find this information on the Azure portal.

If you prefer to go through the entire process from the beginning using a sample app, see [Tutorial: Build a Java EE and Postgres web app in Azure](tutorial-java-enterprise-postgresql-app.md).

The following steps explain the requirements for connecting your existing App Service and database.

1. Download the JDBC driver for [PostgreSQL](https://jdbc.postgresql.org/download.html), [MySQL](https://dev.mysql.com/downloads/connector/j/), or [SQL Server](https://docs.microsoft.com/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server). Unpack the downloaded archive to get the driver .jar file.

2. Create a file with a name like *module.xml* and add the following markup. Replace the `<module name>` placeholder (including the angle brackets) with `org.postgres` for PostgreSQL, `com.mysql` for MySQL, or `com.microsoft` for SQL Server. Replace `<JDBC .jar file path>` with the name of the .jar file from the previous step, including the full path to the location you will place the file in your App Service instance. This can be any location under the */home* directory.

    ```xml
    <?xml version="1.0" ?>
    <module xmlns="urn:jboss:module:1.1" name="<module name>">
        <resources>
           <resource-root path="<JDBC .jar file path>" />
        </resources>
        <dependencies>
            <module name="javax.api"/>
            <module name="javax.transaction.api"/>
        </dependencies>
    </module>
    ```

3. Create a file with a name like *datasource-commands.cli* and add the following code. Replace `<JDBC .jar file path>` with the value you used in the previous step. Replace `<module file path>` with the file name and App Service path from the previous step, for example */home/module.xml*.

    **PostgreSQL**

    ```console
    module add --name=org.postgres --resources=<JDBC .jar file path> --module-xml=<module file path>

    /subsystem=datasources/jdbc-driver=postgres:add(driver-name=postgres,driver-module-name=org.postgres,driver-class-name=org.postgresql.Driver,driver-xa-datasource-class-name=org.postgresql.xa.PGXADataSource)

    data-source add --name=postgresDS --driver-name=postgres --jndi-name=java:jboss/datasources/postgresDS --connection-url=$DATABASE_CONNECTION_URL --user-name=$DATABASE_SERVER_ADMIN_FULL_NAME --password=$DATABASE_SERVER_ADMIN_PASSWORD --use-ccm=true --max-pool-size=5 --blocking-timeout-wait-millis=5000 --enabled=true --driver-class=org.postgresql.Driver --exception-sorter-class-name=org.jboss.jca.adapters.jdbc.extensions.postgres.PostgreSQLExceptionSorter --jta=true --use-java-context=true --valid-connection-checker-class-name=org.jboss.jca.adapters.jdbc.extensions.postgres.PostgreSQLValidConnectionChecker

    reload --use-current-server-config=true
    ```

    **MySQL**

    ```console
    module add --name=com.mysql --resources=<JDBC .jar file path> --module-xml=<module file path>

    /subsystem=datasources/jdbc-driver=mysql:add(driver-name=mysql,driver-module-name=com.mysql,driver-class-name=com.mysql.cj.jdbc.Driver)

    data-source add --name=mysqlDS --jndi-name=java:jboss/datasources/mysqlDS --connection-url=$DATABASE_CONNECTION_URL --driver-name=mysql --user-name=$DATABASE_SERVER_ADMIN_FULL_NAME --password=$DATABASE_SERVER_ADMIN_PASSWORD --use-ccm=true --max-pool-size=5 --blocking-timeout-wait-millis=5000 --enabled=true --driver-class=com.mysql.cj.jdbc.Driver --jta=true --use-java-context=true --exception-sorter-class-name=com.mysql.cj.jdbc.integration.jboss.ExtendedMysqlExceptionSorter

    reload --use-current-server-config=true
    ```

    **SQL Server**

    ```console
    module add --name=com.microsoft --resources=<JDBC .jar file path> --module-xml=<module file path>

    /subsystem=datasources/jdbc-driver=sqlserver:add(driver-name=sqlserver,driver-module-name=com.microsoft,driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver,driver-datasource-class-name=com.microsoft.sqlserver.jdbc.SQLServerDataSource)

    data-source add --name=sqlDS --jndi-name=java:jboss/datasources/sqlDS --driver-name=sqlserver --connection-url=$DATABASE_CONNECTION_URL --validate-on-match=true --background-validation=false --valid-connection-checker-class-name=org.jboss.jca.adapters.jdbc.extensions.mssql.MSSQLValidConnectionChecker --exception-sorter-class-name=org.jboss.jca.adapters.jdbc.extensions.mssql.MSSQLExceptionSorter

    reload --use-current-server-config=true
    ```

    This file is run by the startup script described in the next step. It installs the JDBC driver as a WildFly module, creates the corresponding WildFly data source, and reloads the server to ensure the changes will take effect.

4. Create a file with a name like *startup.sh* and add the following code. Replace `<JBoss CLI script>` with the name of the file you created in the previous step. Be sure to include the full path to the location you will place the file in your App Service instance, for example */home/datasource-commands.cli*.

    ```bash
    #!/usr/bin/env bash
    /opt/jboss/wildfly/bin/jboss-cli.sh -c --file=<JBoss CLI script>
    ```

5. Use FTP to upload the JDBC .jar file, the module XML file, the JBoss CLI script, and the startup script to your App Service instance. Put these files in the location you specified in the previous steps, such as */home*. For more info on FTP, see [Deploy your app to Azure App Service using FTP/S](https://docs.microsoft.com/azure/app-service/deploy-ftp).

6. Use the Azure CLI to add settings to your App Service that hold your database connection info. Replace `<resource group>` and `<webapp name>` with the values your App Service uses. Replace `<database server name>`, `<database name>`, `<admin name>`, and `<admin password>` with your database connection info. You can get your App Service and database info from the Azure portal.

    **PostgreSQL:**

    ```bash
    az webapp config appsettings set \
        --resource-group <resource group> \
        --name <webapp name> \
        --settings \
            DATABASE_CONNECTION_URL=jdbc:postgresql://<database server name>:5432/<database name>?ssl=true \
            DATABASE_SERVER_ADMIN_FULL_NAME=<admin name> \
            DATABASE_SERVER_ADMIN_PASSWORD=<admin password>
    ```

    **MySQL:**

    ```bash
    az webapp config appsettings set \
        --resource-group <resource group> \
        --name <webapp name> \
        --settings \
            DATABASE_CONNECTION_URL=jdbc:mysql://<database server name>:3306/<database name>?ssl=true\&useLegacyDatetimeCode=false\&serverTimezone=GMT \
            DATABASE_SERVER_ADMIN_FULL_NAME=<admin name> \
            DATABASE_SERVER_ADMIN_PASSWORD=<admin password>
    ```

    **SQL Server:**

    ```bash
    az webapp config appsettings set \
        --resource-group <resource group> \
        --name <webapp name> \
        --settings \
            DATABASE_CONNECTION_URL=jdbc:sqlserver://<database server name>:1433;database=<database name>;user=<admin name>;password=<admin password>;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;
    ```

    The DATABASE_CONNECTION_URL values are different for each database server, and different than the values on the Azure portal. The URL formats shown here (and in the snippets above) are required for use by WildFly:

    * **PostgreSQL:** `jdbc:postgresql://<database server name>:5432/<database name>?ssl=true`
    * **MySQL:** `jdbc:mysql://<database server name>:3306/<database name>?ssl=true\&useLegacyDatetimeCode=false\&serverTimezone=GMT`
    * **SQL Server:** `jdbc:sqlserver://<database server name>:1433;database=<database name>;user=<admin name>;password=<admin password>;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;`

7. In the Azure portal, navigate to your App Service and find the **Configuration** > **General settings** page. Set the **Startup Script** field to the name and location of your startup script, for example */home/startup.sh*.

The next time your App Service restarts, it will run the startup script and perform the necessary configuration steps. To test that this configuration occurs correctly, you can access your App Service using SSH and then run the startup script yourself from the Bash prompt. You can also examine the App Service logs. For more info about these options, see [Logging and debugging apps](#logging-and-debugging-apps).

Next, you will need to update the WildFly configuration for your app and redeploy it. Use the following steps:

1. Open the *src/main/resources/META-INF/persistence.xml* file for your app and find the `<jta-data-source>` element. Replace its contents as shown here:

    **PostgreSQL**

    ```xml
    <jta-data-source>java:jboss/datasources/postgresDS</jta-data-source>
    ```

    **MySQL**

    ```xml
    <jta-data-source>java:jboss/datasources/mysqlDS</jta-data-source>
    ```

    **SQL Server**

    ```xml
    <jta-data-source>java:jboss/datasources/postgresDS</jta-data-source>
    ```

2. Rebuild and redeploy your app using the following command at the Bash prompt:

    ```bash
    mvn package -DskipTests azure-webapp:deploy
    ```

3. Restart your App Service instance by pressing the **Restart** button in the **Overview** section of the Azure portal or by using the Azure CLI.

Your App Service instance is now configured to access your database.

For more info on configuring database connectivity with WildFly, see [PostgreSQL](https://developer.jboss.org/blogs/amartin-blog/2012/02/08/how-to-set-up-a-postgresql-jdbc-driver-on-jboss-7), [MySQL](https://docs.jboss.org/jbossas/docs/Installation_And_Getting_Started_Guide/5/html/Using_other_Databases.html#Using_other_Databases-Using_MySQL_as_the_Default_DataSource), or [SQL Server](https://docs.jboss.org/jbossas/docs/Installation_And_Getting_Started_Guide/5/html/Using_other_Databases.html#d0e3898).

### Enable messaging providers

To enable message driven Beans using Service Bus as the messaging mechanism:

1. Use the [Apache QPId JMS messaging library](https://qpid.apache.org/proton/index.html). Include this dependency in your pom.xml (or other build file) for the application.

2. Create [Service Bus resources](/azure/service-bus-messaging/service-bus-java-how-to-use-jms-api-amqp). Create an Azure Service Bus namespace and queue within that namespace and a Shared Access Policy with send and receive capabilities.

3. Pass the shared access policy key to your code either by URL-encoding the primary key of your policy or [Use the Service Bus SDK](/azure/service-bus-messaging/service-bus-java-how-to-use-jms-api-amqp#setup-jndi-context-and-configure-the-connectionfactory).

4. Follow the steps outlined in the Installing Modules and Dependencies section with your module XML descriptor, .jar dependencies, JBoss CLI commands, and startup script for the JMS provider. In addition to the four files, you will also need to create an XML file that defines the JNDI name for the JMS queue and topic. See [this repository](https://github.com/JasonFreeberg/widlfly-server-configs/tree/master/appconfig) for reference configuration files.

### Configure session management caching

By default App Service on Linux will use session affinity cookies to ensure that client requests with existing sessions are routed the same instance of your application. This default behavior requires no configuration but has some limitations:

- If an application instance is restarted or scaled down, the user session state in the application server will be lost.
- If applications have long session time out settings or a fixed number of users, it can take some time for autoscaled new instances to receive load since only new sessions will be routed to the newly started instances.

You can configure WildFly to use an external session store such as [Azure Cache for Redis](/azure/azure-cache-for-redis/). You will need to [disable the existing ARR Instance Affinity](https://azure.microsoft.com/blog/disabling-arrs-instance-affinity-in-windows-azure-web-sites/) configuration to turn off the session cookie-based routing and allow the configured WildFly session store to operate without interference.

## Docker containers

To use the Azure-supported Zulu JDK in your containers, make sure to pull and use the pre-built images as documented from the [supported Azul Zulu Enterprise for Azure download page](https://www.azul.com/downloads/azure-only/zulu/) or use the `Dockerfile` examples from the [Microsoft Java GitHub repo](https://github.com/Microsoft/java/tree/master/docker).

## Statement of support

### Runtime availability

App Service for Linux supports two runtimes for managed hosting of Java web applications:

- The [Tomcat servlet container](https://tomcat.apache.org/) for running applications packaged as web archive (WAR) files. Supported versions are 8.5 and 9.0.
- Java SE runtime environment for running applications packaged as Java archive (JAR) files. Supported versions are Java 8 and 11.

### JDK versions and maintenance

Azul Zulu Enterprise builds of OpenJDK are a no-cost, multi-platform, production-ready distribution of the OpenJDK for Azure and Azure Stack backed by Microsoft and Azul Systems. They contain all the components for building and running Java SE applications. You can install the JDK from [Java JDK Installation](https://aka.ms/azure-jdks).

Supported JDKs are automatically patched on a quarterly basis in January, April, July, and October of each year.

### Security updates

Patches and fixes for major security vulnerabilities will be released as soon as they become available from Azul Systems. A "major" vulnerability is defined by a base score of 9.0 or higher on the [NIST Common Vulnerability Scoring System, version 2](https://nvd.nist.gov/cvss.cfm).

### Deprecation and retirement

If a supported Java runtime will be retired, Azure developers using the affected runtime will be given a deprecation notice at least six months before the runtime is retired.

## Next steps

Visit the [Azure for Java Developers](/java/azure/) center to find Azure quickstarts, tutorials, and Java reference documentation.

General questions about using App Service for Linux that aren't specific to the Java development are answered in the [App Service Linux FAQ](app-service-linux-faq.md).
