---
title: Configure Linux Java apps
description: Learn how to configure a pre-built Java container for your app. This article shows the most common configuration tasks. 
keywords: azure app service, web app, linux, oss, java, java ee, jee, javaee
author: bmitchell287
manager: barbkess

ms.devlang: java
ms.topic: article
ms.date: 11/22/2019
ms.author: brendm
ms.reviewer: cephalin
ms.custom: seodec18
---

# Configure a Linux Java app for Azure App Service

Azure App Service on Linux lets Java developers quickly build, deploy, and scale their Tomcat, or Java Standard Edition (SE) packaged web applications on a fully managed Linux-based service. Deploy applications with Maven plugins from the command line or in editors like IntelliJ, Eclipse, or Visual Studio Code.

This guide provides key concepts and instructions for Java developers who use a built-in Linux container in App Service. If you've never used Azure App Service, follow the [Java quickstart](quickstart-java.md).

## Deploying your app

You can use [Maven Plugin for Azure App Service](/java/api/overview/azure/maven/azure-webapp-maven-plugin/readme) to deploy both .jar and .war files. Deployment with popular IDEs is also supported with [Azure Toolkit for IntelliJ](/azure/developer/java/toolkit-for-intellij/) or [Azure Toolkit for Eclipse](/azure/developer/java/toolkit-for-eclipse).

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

For more information, see [Stream logs in Cloud Shell](../troubleshoot-diagnostic-logs.md#in-cloud-shell).

### App logging

Enable [application logging](../troubleshoot-diagnostic-logs.md?toc=/azure/app-service/containers/toc.json#enable-application-logging-windows) through the Azure portal or [Azure CLI](/cli/azure/webapp/log#az-webapp-log-config) to configure App Service to write your application's standard console output and standard console error streams to the local filesystem or Azure Blob Storage. Logging to the local App Service filesystem instance is disabled 12 hours after it is configured. If you need longer retention, configure the application to write output to a Blob storage container. Your Java and Tomcat app logs can be found in the */home/LogFiles/Application/* directory.

>[!NOTE]
>Logging to the local App Service filesystem becoming disabled after 12 hours only applies to Windows based App Services. Azure Blob Storage logging for Linux based App Services can only be configured using [Azure Monitor (preview)](/azure/app-service/troubleshoot-diagnostic-logs#send-logs-to-azure-monitor-preview) 

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

You can use Zulu Flight Recorder to continuously profile your Java application with minimal impact on runtime performance ([source](https://assets.azul.com/files/Zulu-Mission-Control-data-sheet-31-Mar-19.pdf)). To do so, run the following Azure CLI command to create an App Setting named JAVA_OPTS with the necessary configuration. The contents of the JAVA_OPTS App Setting are passed to the `java` command when your app is started.

```azurecli
az webapp config appsettings set -g <your_resource_group> -n <your_app_name> --settings JAVA_OPTS=-XX:StartFlightRecording=disk=true,name=continuous_recording,dumponexit=true,maxsize=1024m,maxage=1d
```

Once the recording has started, you can dump the current recording data at any time using the `JFR.dump` command.

```shell
jcmd <pid> JFR.dump name=continuous_recording filename="/home/recording1.jfr"
```

For more information, please see the [Jcmd Command Reference](https://docs.oracle.com/javacomponents/jmc-5-5/jfr-runtime-guide/comline.htm#JFRRT190).

### Analyzing Recordings

Use [FTPS](../deploy-ftp.md) to download your JFR file to your local machine. To analyze the JFR file, download and install [Zulu Mission Control](https://www.azul.com/products/zulu-mission-control/). For instructions on Zulu Mission Control, see the [Azul documentation](https://docs.azul.com/zmc/) and the [installation instructions](https://docs.microsoft.com/java/azure/jdk/java-jdk-flight-recorder-and-mission-control).

## Customization and tuning

Azure App Service for Linux supports out of the box tuning and customization through the Azure portal and CLI. Review the following articles for non-Java-specific web app configuration:

- [Configure app settings](../configure-common.md?toc=/azure/app-service/containers/toc.json#configure-app-settings)
- [Set up a custom domain](../app-service-web-tutorial-custom-domain.md?toc=/azure/app-service/containers/toc.json)
- [Configure SSL bindings](../configure-ssl-bindings.md?toc=/azure/app-service/containers/toc.json)
- [Add a CDN](../../cdn/cdn-add-to-web-app.md?toc=/azure/app-service/containers/toc.json)
- [Configure the Kudu site](https://github.com/projectkudu/kudu/wiki/Configurable-settings#linux-on-app-service-settings)

### Set Java runtime options

To set allocated memory or other JVM runtime options in both the Tomcat and Java SE environments, create an [app setting](../configure-common.md?toc=/azure/app-service/containers/toc.json#configure-app-settings) named `JAVA_OPTS` with the options. App Service Linux passes this setting as an environment variable to the Java runtime when it starts.

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

If you are deploying a JAR application, it should be named *app.jar* so that the built-in image can correctly identify your app. (The Maven plugin does this renaming automatically.) If you do not wish to rename your JAR to *app.jar*, you can upload a shell script with the command to run your JAR. Then paste the full path to this script in the [Startup File](app-service-linux-faq.md#built-in-images) textbox in the Configuration section of the portal. The startup script does not run from the directory into which it is placed. Therefore, always use absolute paths to reference files in your startup script (for example: `java -jar /home/myapp/myapp.jar`).

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

### Authenticate users (Easy Auth)

Set up app authentication in the Azure portal with the **Authentication and Authorization** option. From there, you can enable authentication using Azure Active Directory or social logins like Facebook, Google, or GitHub. Azure portal configuration only works when configuring a single authentication provider. For more information, see [Configure your App Service app to use Azure Active Directory login](../configure-authentication-provider-aad.md?toc=/azure/app-service/containers/toc.json) and the related articles for other identity providers. If you need to enable multiple sign-in providers, follow the instructions in the [customize App Service authentication](../app-service-authentication-how-to.md?toc=/azure/app-service/containers/toc.json) article.

#### Tomcat

Your Tomcat application can access the user's claims directly from the servlet by casting the Principal object to a Map object. The Map object will map each claim type to a collection of the claims for that type. In the code below, `request` is an instance of `HttpServletRequest`.

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

To sign users out, use the `/.auth/ext/logout` path. To perform other actions, please see the documentation on [App Service Authentication and Authorization usage](https://docs.microsoft.com/azure/app-service/app-service-authentication-how-to). There is also official documentation on the Tomcat [HttpServletRequest interface](https://tomcat.apache.org/tomcat-5.5-doc/servletapi/javax/servlet/http/HttpServletRequest.html) and its methods. The following servlet methods are also hydrated based on your App Service configuration:

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

Follow the instructions in the [Secure a custom DNS name with an SSL binding in Azure App Service](../configure-ssl-bindings.md?toc=/azure/app-service/containers/toc.json) to upload an existing SSL certificate and bind it to your application's domain name. By default your application will still allow HTTP connections-follow the specific steps in the tutorial to enforce SSL and TLS.

### Use KeyVault References

[Azure KeyVault](../../key-vault/general/overview.md) provides centralized secret management with access policies and audit history. You can store secrets (such as passwords or connection strings) in KeyVault and access these secrets in your application through environment variables.

First, follow the instructions for [granting your app access to Key Vault](../app-service-key-vault-references.md#granting-your-app-access-to-key-vault) and [making a KeyVault reference to your secret in an Application Setting](../app-service-key-vault-references.md#reference-syntax). You can validate that the reference resolves to the secret by printing the environment variable while remotely accessing the App Service terminal.

To inject these secrets in your Spring or Tomcat configuration file, use environment variable injection syntax (`${MY_ENV_VAR}`). For Spring configuration files, please see this documentation on [externalized configurations](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html).

### Using the Java Key Store

By default, any public or private certificates [uploaded to App Service Linux](../configure-ssl-certificate.md) will be loaded into the respective Java Key Stores as the container starts. After uploading your certificate, you will need to restart your App Service for it to be loaded into the Java Key Store. Public certificates are loaded into the Key Store at `$JAVA_HOME/jre/lib/security/cacerts`, and private certificates are stored in `$JAVA_HOME/lib/security/client.jks`.

Additional configuration may be necessary for encrypting your JDBC connection with certificates in the Java Key Store. Please refer to the documentation for your chosen JDBC driver.

- [PostgreSQL](https://jdbc.postgresql.org/documentation/head/ssl-client.html)
- [SQL Server](https://docs.microsoft.com/sql/connect/jdbc/connecting-with-ssl-encryption?view=sql-server-ver15)
- [MySQL](https://dev.mysql.com/doc/connector-j/5.1/en/connector-j-reference-using-ssl.html)
- [MongoDB](https://mongodb.github.io/mongo-java-driver/3.4/driver/tutorials/ssl/)
- [Cassandra](https://docs.datastax.com/en/developer/java-driver/4.3/)

#### Initializing the Java Key Store

To initialize the `import java.security.KeyStore` object, load the keystore file with the password. The default password for both key stores is "changeit".

```java
KeyStore keyStore = KeyStore.getInstance("jks");
keyStore.load(
    new FileInputStream(System.getenv("JAVA_HOME")+"/lib/security/cacets"),
    "changeit".toCharArray());

KeyStore keyStore = KeyStore.getInstance("pkcs12");
keyStore.load(
    new FileInputStream(System.getenv("JAVA_HOME")+"/lib/security/client.jks"),
    "changeit".toCharArray());
```

#### Manually load the key store

You can load certificates manually to the key store. Create an app setting, `SKIP_JAVA_KEYSTORE_LOAD`, with a value of `1` to disable App Service from loading the certificates into the key store automatically. All public certificates uploaded to App Service via the Azure portal are stored under `/var/ssl/certs/`. Private certificates are stored under `/var/ssl/private/`.

You can interact or debug the Java Key Tool by [opening an SSH connection](app-service-linux-ssh-support.md) to your App Service and running the command `keytool`. See the [Key Tool documentation](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html) for a list of commands. For more information on the KeyStore API, please refer to [the official documentation](https://docs.oracle.com/javase/8/docs/api/java/security/KeyStore.html).

## Configure APM platforms

This section shows how to connect Java applications deployed on Azure App Service on Linux with the NewRelic and AppDynamics application performance monitoring (APM) platforms.

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

### Configure AppDynamics

1. Create an AppDynamics account at [AppDynamics.com](https://www.appdynamics.com/community/register/)
2. Download the Java agent from the AppDynamics website, the file name will be similar to *AppServerAgent-x.x.x.xxxxx.zip*
3. [SSH into your App Service instance](app-service-linux-ssh-support.md) and create a new directory */home/site/wwwroot/apm*.
4. Upload the Java agent files into a directory under */home/site/wwwroot/apm*. The files for your agent should be in */home/site/wwwroot/apm/appdynamics*.
5. In the Azure portal, browse to your application in App Service and create a new Application Setting.
    - If you're using **Java SE**, create an environment variable named `JAVA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/appdynamics/javaagent.jar -Dappdynamics.agent.applicationName=<app-name>` where `<app-name>` is your App Service name.
    - If you're using **Tomcat**, create an environment variable named `CATALINA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/appdynamics/javaagent.jar -Dappdynamics.agent.applicationName=<app-name>` where `<app-name>` is your App Service name.

> [!NOTE]
> If you already have an environment variable for `JAVA_OPTS` or `CATALINA_OPTS`, append the `-javaagent:/...` option to the end of the current value.

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
| SQL Server | `com.microsoft.sqlserver.jdbc.SQLServerDriver` | [Download](https://docs.microsoft.com/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server?view=sql-server-2017#download)                                                           |

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

Adding a shared, server-level data source will require you to edit Tomcat's server.xml. First, upload a [startup script](app-service-linux-faq.md#built-in-images) and set the path to the script in **Configuration** > **Startup Command**. You can upload the startup script using [FTP](../deploy-ftp.md).

Your startup script will make an [xsl transform](https://www.w3schools.com/xml/xsl_intro.asp) to the server.xml file and output the resulting xml file to `/usr/local/tomcat/conf/server.xml`. The startup script should install libxslt via apk. Your xsl file and startup script can be uploaded via FTP. Below is an example startup script.

```sh
# Install libxslt. Also copy the transform file to /home/tomcat/conf/
apk add --update libxslt

# Usage: xsltproc --output output.xml style.xsl input.xml
xsltproc --output /home/tomcat/conf/server.xml /home/tomcat/conf/transform.xsl /usr/local/tomcat/conf/server.xml
```

An example xsl file is provided below. The example xsl file adds a new connector node to the Tomcat server.xml.

```xml
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" indent="yes"/>

  <xsl:template match="@* | node()" name="Copy">
    <xsl:copy>
      <xsl:apply-templates select="@* | node()"/>
    </xsl:copy>
  </xsl:template>

  <xsl:template match="@* | node()" mode="insertConnector">
    <xsl:call-template name="Copy" />
  </xsl:template>

  <xsl:template match="comment()[not(../Connector[@scheme = 'https']) and
                                 contains(., '&lt;Connector') and
                                 (contains(., 'scheme=&quot;https&quot;') or
                                  contains(., &quot;scheme='https'&quot;))]">
    <xsl:value-of select="." disable-output-escaping="yes" />
  </xsl:template>

  <xsl:template match="Service[not(Connector[@scheme = 'https'] or
                                   comment()[contains(., '&lt;Connector') and
                                             (contains(., 'scheme=&quot;https&quot;') or
                                              contains(., &quot;scheme='https'&quot;))]
                                  )]
                      ">
    <xsl:copy>
      <xsl:apply-templates select="@* | node()" mode="insertConnector" />
    </xsl:copy>
  </xsl:template>

  <!-- Add the new connector after the last existing Connnector if there is one -->
  <xsl:template match="Connector[last()]" mode="insertConnector">
    <xsl:call-template name="Copy" />

    <xsl:call-template name="AddConnector" />
  </xsl:template>

  <!-- ... or before the first Engine if there is no existing Connector -->
  <xsl:template match="Engine[1][not(preceding-sibling::Connector)]"
                mode="insertConnector">
    <xsl:call-template name="AddConnector" />

    <xsl:call-template name="Copy" />
  </xsl:template>

  <xsl:template name="AddConnector">
    <!-- Add new line -->
    <xsl:text>&#xa;</xsl:text>
    <!-- This is the new connector -->
    <Connector port="8443" protocol="HTTP/1.1" SSLEnabled="true" 
               maxThreads="150" scheme="https" secure="true" 
               keystroreFile="${{user.home}}/.keystore" keystorePass="changeit"
               clientAuth="false" sslProtocol="TLS" />
  </xsl:template>
  
</xsl:stylesheet>
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

    Alternatively, you can use an FTP client to upload the JDBC driver. Follow these [instructions for getting your FTP credentials](../deploy-configure-credentials.md?toc=/azure/app-service/containers/toc.json).

2. If you created a server-level data source, restart the App Service Linux application. Tomcat will reset `CATALINA_BASE` to `/home/tomcat` and use the updated configuration.

### Spring Boot

To connect to data sources in Spring Boot applications, we suggest creating connection strings and injecting them into your *application.properties* file.

1. In the "Configuration" section of the App Service page, set a name for the string, paste your JDBC connection string into the value field, and set the type to "Custom". You can optionally set this connection string as slot setting.

    This connection string is accessible to our application as an environment variable named `CUSTOMCONNSTR_<your-string-name>`. For example, the connection string we created above will be named `CUSTOMCONNSTR_exampledb`.

2. In your *application.properties* file, reference this connection string with the environment variable name. For our example, we would use the following.

    ```yml
    app.datasource.url=${CUSTOMCONNSTR_exampledb}
    ```

Please see the [Spring Boot documentation on data access](https://docs.spring.io/spring-boot/docs/current/reference/html/howto-data-access.html) and [externalized configurations](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html) for more information on this topic.

## Use Redis as a session cache with Tomcat

You can configure Tomcat to use an external session store such as [Azure Cache for Redis](/azure/azure-cache-for-redis/). This enables you to preserve user session state (such as shopping cart data) when a user is transferred to another instance of your app, for example when autoscaling, restart, or failover occurs.

To use Tomcat with Redis, you must configure your app to use a [PersistentManager](https://tomcat.apache.org/tomcat-8.5-doc/config/manager.html) implementation. The following steps explain this process using [Pivotal Session Manager: redis-store](https://github.com/pivotalsoftware/session-managers/tree/master/redis-store) as an example.

1. Open a Bash terminal and use `<variable>=<value>` to set each of the following environment variables.

    | Variable                 | Value                                                                      |
    |--------------------------|----------------------------------------------------------------------------|
    | RESOURCEGROUP_NAME       | The name of the resource group containing your App Service instance.       |
    | WEBAPP_NAME              | The name of your App Service instance.                                     |
    | WEBAPP_PLAN_NAME         | The name of your App Service plan.                                         |
    | REGION                   | The name of the region where your app is hosted.                           |
    | REDIS_CACHE_NAME         | The name of your Azure Cache for Redis instance.                           |
    | REDIS_PORT               | The SSL port that your Redis cache listens on.                             |
    | REDIS_PASSWORD           | The primary access key for your instance.                                  |
    | REDIS_SESSION_KEY_PREFIX | A value that you specify to identify session keys that come from your app. |

    ```bash
    RESOURCEGROUP_NAME=<resource group>
    WEBAPP_NAME=<web app>
    WEBAPP_PLAN_NAME=<App Service plan>
    REGION=<region>
    REDIS_CACHE_NAME=<cache>
    REDIS_PORT=<port>
    REDIS_PASSWORD=<access key>
    REDIS_SESSION_KEY_PREFIX=<prefix>
    ```

    You can find the name, port, and access key information on the Azure portal by looking in the **Properties** or **Access keys** sections of your service instance.

2. Create or update your app's *src/main/webapp/META-INF/context.xml* file with the following content:

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <Context path="">
        <!-- Specify Redis Store -->
        <Valve className="com.gopivotal.manager.SessionFlushValve" />
        <Manager className="org.apache.catalina.session.PersistentManager">
            <Store className="com.gopivotal.manager.redis.RedisStore"
                   connectionPoolSize="20"
                   host="${REDIS_CACHE_NAME}.redis.cache.windows.net"
                   port="${REDIS_PORT}"
                   password="${REDIS_PASSWORD}"
                   sessionKeyPrefix="${REDIS_SESSION_KEY_PREFIX}"
                   timeout="2000"
            />
        </Manager>
    </Context>
    ```

    This file specifies and configures the session manager implementation for your app. It uses the environment variables that you set in the previous step to keep your account information out of your source files.

3. Use FTP to upload the session manager's JAR file to your App Service instance, placing it in the */home/tomcat/lib* directory. For more info, see [Deploy your app to Azure App Service using FTP/S](https://docs.microsoft.com/azure/app-service/deploy-ftp).

4. Disable the [session affinity cookie](https://azure.microsoft.com/blog/disabling-arrs-instance-affinity-in-windows-azure-web-sites/) for your App Service instance. You can do this from the Azure portal by navigating to your app and then setting **Configuration > General settings > ARR affinity** to **Off**. Alternately, you can use the following command:

    ```azurecli
    az webapp update -g <resource group> -n <webapp name> --client-affinity-enabled false
    ```

    By default, App Service will use session affinity cookies to ensure that client requests with existing sessions are routed to the same instance of your application. This default behavior requires no configuration but it can't preserve user session state when your app instance is restarted or when traffic is rerouted to another instance. When you [disable the existing ARR Instance Affinity](https://azure.microsoft.com/blog/disabling-arrs-instance-affinity-in-windows-azure-web-sites/) configuration to turn off the session cookie-based routing, you allow the configured session store to operate without interference.

5. Navigate to the **Properties** section of your App Service instance and find **Additional Outbound IP Addresses**. These represent all possible outbound IP addresses for your app. Copy these for use in the next step.

6. For each IP address, create a firewall rule in your Azure Cache for Redis instance. You can do this on the Azure portal from the **Firewall** section of your   Redis instance. Provide a unique name for each rule, and set the **Start IP address** and **End IP address** values to the same IP address.

7. Navigate to the **Advanced settings** section of your Redis instance and set **Allow access only via SSL** to **No**. This enables your App Service instance to communicate with your Redis cache via the Azure infrastructure.

8. Update the `azure-webapp-maven-plugin` configuration in your app's *pom.xml* file to refer to your Redis account info. This file uses the environment variables you set previously to keep your account information out of your source files.

    If necessary, change `1.9.1` to the current version of the [Maven Plugin for Azure App Service](/java/api/overview/azure/maven/azure-webapp-maven-plugin/readme).

    ```xml
    <plugin>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>azure-webapp-maven-plugin</artifactId>
        <version>1.9.1</version>
        <configuration>            
            <!-- Web App information -->
            <schemaVersion>v2</schemaVersion>
            <resourceGroup>${RESOURCEGROUP_NAME}</resourceGroup>
            <appServicePlanName>${WEBAPP_PLAN_NAME}-${REGION}</appServicePlanName>
            <appName>${WEBAPP_NAME}-${REGION}</appName>
            <region>${REGION}</region>            
            <runtime>
                <os>linux</os>
                <javaVersion>jre8</javaVersion>
                <webContainer>tomcat 9.0</webContainer>
            </runtime>

            <appSettings>
                <property>
                    <name>REDIS_CACHE_NAME</name>
                    <value>${REDIS_CACHE_NAME}</value>
                </property>
                <property>
                    <name>REDIS_PORT</name>
                    <value>${REDIS_PORT}</value>
                </property>
                <property>
                    <name>REDIS_PASSWORD</name>
                    <value>${REDIS_PASSWORD}</value>
                </property>
                <property>
                    <name>REDIS_SESSION_KEY_PREFIX</name>
                    <value>${REDIS_SESSION_KEY_PREFIX}</value>
                </property>
                <property>
                    <name>JAVA_OPTS</name>
                    <value>-Xms2048m -Xmx2048m -DREDIS_CACHE_NAME=${REDIS_CACHE_NAME} -DREDIS_PORT=${REDIS_PORT} -DREDIS_PASSWORD=${REDIS_PASSWORD} IS_SESSION_KEY_PREFIX=${REDIS_SESSION_KEY_PREFIX}</value>
                </property>

            </appSettings>

        </configuration>
    </plugin>
    ```

9. Rebuild and redeploy your app.

    ```bash
    mvn package -DskipTests azure-webapp:deploy
    ```

Your app will now use your Redis cache for session management.

For a sample that you can use to test these instructions, see the [scaling-stateful-java-web-app-on-azure](https://github.com/Azure-Samples/scaling-stateful-java-web-app-on-azure) repo on GitHub.

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

[!INCLUDE [robots933456](../../../includes/app-service-web-configure-robots933456.md)]

## Next steps

Visit the [Azure for Java Developers](/java/azure/) center to find Azure quickstarts, tutorials, and Java reference documentation.

General questions about using App Service for Linux that aren't specific to the Java development are answered in the [App Service Linux FAQ](app-service-linux-faq.md).
