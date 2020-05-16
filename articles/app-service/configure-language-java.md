---
title: Configure Windows Java apps
description: Learn how to configure Java apps to run on the Windows VM instances in Azure App Service. This article shows the most common configuration tasks.
keywords: azure app service, web app, windows, oss, java
author: jasonfreeberg
ms.devlang: java
ms.topic: article
ms.date: 04/12/2019
ms.author: jafreebe
ms.reviewer: cephalin
ms.custom: seodec18

---

# Configure a Windows Java app for Azure App Service

Azure App Service lets Java developers to quickly build, deploy, and scale their Tomcat web applications on a fully managed Windows-based service. Deploy applications with Maven plugins from the command line or in editors like IntelliJ, Eclipse, or Visual Studio Code.

This guide provides key concepts and instructions for Java developers using in App Service. If you've never used Azure App Service, you should read through the [Java quickstart](app-service-web-get-started-java.md) first. General questions about using App Service that aren't specific to the Java development are answered in the [App Service Windows FAQ](faq-configuration-and-management.md).

## Deploying your app

You can use [Azure Web App Plugin for Maven](/java/api/overview/azure/maven/azure-webapp-maven-plugin/readme) to deploy your .war files. Deployment with popular IDEs is also supported with [Azure Toolkit for IntelliJ](/azure/developer/java/toolkit-for-intellij/) or [Azure Toolkit for Eclipse](/azure/developer/java/toolkit-for-eclipse).

Otherwise, your deployment method will depend on your archive type:

- To deploy .war files to Tomcat, use the `/api/wardeploy/` endpoint to POST your archive file. For more information on this API, please see [this documentation](https://docs.microsoft.com/azure/app-service/deploy-zip#deploy-war-file).
- To deploy .jar files to Java SE, use the `/api/zipdeploy/` endpoint of the Kudu site. For more information on this API, please see [this documentation](https://docs.microsoft.com/azure/app-service/deploy-zip#rest).

Do not deploy your .war using FTP. The FTP tool is designed to upload startup scripts, dependencies, or other runtime files. It is not the optimal choice for deploying web apps.

## Logging and debugging apps

Performance reports, traffic visualizations, and health checkups are available for each app through the Azure portal. For more information, see [Azure App Service diagnostics overview](overview-diagnostics.md).

### Use Flight Recorder

All Java runtimes on App Service using the Azul JVMs come with the Zulu Flight Recorder. You can use this to record JVM, system, and Java level events to monitor the behavior and troubleshoot problems in your Java applications.

To take a timed recording you will need the PID (Process ID) of the Java application. To find the PID, open a browser to your web app's SCM site at https://<your-site-name>.scm.azurewebsites.net/ProcessExplorer/. This page shows the running processes in your web app. Find the process named "java" in the table and copy the corresponding PID (Process ID).

Next, open the **Debug Console** in the top toolbar of the SCM site and run the following command. Replace `<pid>` with the process ID you copied earlier. This command will start a 30 second profiler recording of your Java application and generate a file named `timed_recording_example.jfr` in the `D:\home` directory.

```
jcmd <pid> JFR.start name=TimedRecording settings=profile duration=30s filename="D:\home\timed_recording_example.JFR"
```

For more information, please see the [Jcmd Command Reference](https://docs.oracle.com/javacomponents/jmc-5-5/jfr-runtime-guide/comline.htm#JFRRT190).

#### Analyze `.jfr` files

Use [FTPS](deploy-ftp.md) to download your JFR file to your local machine. To analyze the JFR file, download and install [Zulu Mission Control](https://www.azul.com/products/zulu-mission-control/). For instructions on Zulu Mission Control, see the [Azul documentation](https://docs.azul.com/zmc/) and the [installation instructions](https://docs.microsoft.com/java/azure/jdk/java-jdk-flight-recorder-and-mission-control).

### Stream diagnostic logs

[!INCLUDE [Access diagnostic logs](../../includes/app-service-web-logs-access-no-h.md)]

For more information, see [Stream logs in Cloud Shell](troubleshoot-diagnostic-logs.md#in-cloud-shell).

### App logging

Enable [application logging](troubleshoot-diagnostic-logs.md#enable-application-logging-windows) through the Azure portal or [Azure CLI](/cli/azure/webapp/log#az-webapp-log-config) to configure App Service to write your application's standard console output and standard console error streams to the local filesystem or Azure Blob Storage. Logging to the local App Service filesystem instance is disabled 12 hours after it is configured. If you need longer retention, configure the application to write output to a Blob storage container. Your Java and Tomcat app logs can be found in the */LogFiles/Application/* directory.

If your application uses [Logback](https://logback.qos.ch/) or [Log4j](https://logging.apache.org/log4j) for tracing, you can forward these traces for review into Azure Application Insights using the logging framework configuration instructions in [Explore Java trace logs in Application Insights](/azure/application-insights/app-insights-java-trace-logs).


## Customization and tuning

Azure App Service supports out of the box tuning and customization through the Azure portal and CLI. Review the following articles for non-Java-specific web app configuration:

- [Configure app settings](configure-common.md#configure-app-settings)
- [Set up a custom domain](app-service-web-tutorial-custom-domain.md)
- [Configure TLS bindings](configure-ssl-bindings.md)
- [Add a CDN](../cdn/cdn-add-to-web-app.md)
- [Configure the Kudu site](https://github.com/projectkudu/kudu/wiki/Configurable-settings)

### Set Java runtime options

To set allocated memory or other JVM runtime options, create an [app setting](configure-common.md#configure-app-settings) named `JAVA_OPTS` with the options. App Service passes this setting as an environment variable to the Java runtime when it starts.

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

### Pre-Compile JSP files

To improve performance of Tomcat applications, you can compile your JSP files before deploying to App Service. You can use the [Maven plugin](https://sling.apache.org/components/jspc-maven-plugin/plugin-info.html) provided by Apache Sling, or using this [Ant build file](https://tomcat.apache.org/tomcat-9.0-doc/jasper-howto.html#Web_Application_Compilation).

## Secure applications

Java applications running in App Service have the same set of [security best practices](/azure/security/security-paas-applications-using-app-services) as other applications.

### Authenticate users (Easy Auth)

Set up app authentication in the Azure portal with the **Authentication and Authorization** option. From there, you can enable authentication using Azure Active Directory or social logins like Facebook, Google, or GitHub. Azure portal configuration only works when configuring a single authentication provider. For more information, see [Configure your App Service app to use Azure Active Directory login](configure-authentication-provider-aad.md) and the related articles for other identity providers. If you need to enable multiple sign-in providers, follow the instructions in the [customize App Service authentication](app-service-authentication-how-to.md) article.

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

### Configure TLS/SSL

Follow the instructions in the [Secure a custom DNS name with a TLS binding in Azure App Service](configure-ssl-bindings.md) to upload an existing TLS/SSL certificate and bind it to your application's domain name. By default your application will still allow HTTP connections-follow the specific steps in the tutorial to enforce SSL and TLS.

### Use KeyVault References

[Azure KeyVault](../key-vault/general/overview.md) provides centralized secret management with access policies and audit history. You can store secrets (such as passwords or connection strings) in KeyVault and access these secrets in your application through environment variables.

First, follow the instructions for [granting your app access to Key Vault](app-service-key-vault-references.md#granting-your-app-access-to-key-vault) and [making a KeyVault reference to your secret in an Application Setting](app-service-key-vault-references.md#reference-syntax). You can validate that the reference resolves to the secret by printing the environment variable while remotely accessing the App Service terminal.

To inject these secrets in your Spring or Tomcat configuration file, use environment variable injection syntax (`${MY_ENV_VAR}`). For Spring configuration files, please see this documentation on [externalized configurations](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html).


## Configure APM platforms

This section shows how to connect Java applications deployed on Azure App Service on Linux with the NewRelic and AppDynamics application performance monitoring (APM) platforms.

### Configure New Relic

1. Create a New Relic account at [NewRelic.com](https://newrelic.com/signup)
2. Download the Java agent from NewRelic, it will have a file name similar to *newrelic-java-x.x.x.zip*.
3. Copy your license key, you'll need it to configure the agent later.
4. Use the [Kudu console](https://github.com/projectkudu/kudu/wiki/Kudu-console) to create a new directory */home/site/wwwroot/apm*.
5. Upload the unpacked New Relic Java agent files into a directory under */home/site/wwwroot/apm*. The files for your agent should be in */home/site/wwwroot/apm/newrelic*.
6. Modify the YAML file at */home/site/wwwroot/apm/newrelic/newrelic.yml* and replace the placeholder license value with your own license key.
7. In the Azure portal, browse to your application in App Service and create a new Application Setting.
    - If your app is using **Java SE**, create an environment variable named `JAVA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/newrelic/newrelic.jar`.
    - If you're using **Tomcat**, create an environment variable named `CATALINA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/newrelic/newrelic.jar`.

### Configure AppDynamics

1. Create an AppDynamics account at [AppDynamics.com](https://www.appdynamics.com/community/register/)
2. Download the Java agent from the AppDynamics website, the file name will be similar to *AppServerAgent-x.x.x.xxxxx.zip*
3. Use the [Kudu console](https://github.com/projectkudu/kudu/wiki/Kudu-console) to create a new directory */home/site/wwwroot/apm*.
4. Upload the Java agent files into a directory under */home/site/wwwroot/apm*. The files for your agent should be in */home/site/wwwroot/apm/appdynamics*.
5. In the Azure portal, browse to your application in App Service and create a new Application Setting.
    - If you're using **Java SE**, create an environment variable named `JAVA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/appdynamics/javaagent.jar -Dappdynamics.agent.applicationName=<app-name>` where `<app-name>` is your App Service name.
    - If you're using **Tomcat**, create an environment variable named `CATALINA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/appdynamics/javaagent.jar -Dappdynamics.agent.applicationName=<app-name>` where `<app-name>` is your App Service name.

>  If you already have an environment variable for `JAVA_OPTS` or `CATALINA_OPTS`, append the `-javaagent:/...` option to the end of the current value.

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

#### Finalize configuration

Finally, we will place the driver JARs in the Tomcat classpath and restart your App Service. Ensure that the JDBC driver files are available to the Tomcat classloader by placing them in the */home/tomcat/lib* directory. (Create this directory if it does not already exist.) To upload these files to your App Service instance, perform the following steps:

1. In the [Cloud Shell](https://shell.azure.com), install the webapp extension:

    ```azurecli-interactive
    az extension add -–name webapp
    ```

2. Run the following CLI command to create an SSH tunnel from your local system to App Service:

    ```azurecli-interactive
    az webapp remote-connection create --resource-group <resource-group-name> --name <app-name> --port <port-on-local-machine>
    ```

3. Connect to the local tunneling port with your SFTP client and upload the files to the */home/tomcat/lib* folder.

Alternatively, you can use an FTP client to upload the JDBC driver. Follow these [instructions for getting your FTP credentials](deploy-configure-credentials.md).

## Configuring Tomcat

To edit Tomcat's `server.xml` or other configuration files, first take a note of your Tomcat major version in the portal.

1. Find the Tomcat home directory for your version by running the `env` command. Search for the environment variable that begins with `AZURE_TOMCAT`and matches your major version. For example, `AZURE_TOMCAT85_HOME` points to the Tomcat directory for Tomcat 8.5.
1. Once you have identified the Tomcat home directory for your version, copy the configuration directory to `D:\home`. For example, if `AZURE_TOMCAT85_HOME` had a value of `D:\Program Files (x86)\apache-tomcat-8.5.37`, the new path of the copied directory would be `D:\home\apache-tomcat-8.5.37`.

Finally, restart your App Service. Your deployments should go to `D:\home\site\wwwroot\webapps` just as before.

## Configure Java SE

When running a .JAR application on Java SE on Windows, `server.port` is passed as a command line option as your application starts. You can manually resolve the HTTP port from the environment variable, `HTTP_PLATFORM_PORT`. The value of this environment variable will be the HTTP port your application should listen on. 

## Java runtime statement of support

### JDK versions and maintenance

Azure's supported Java Development Kit (JDK) is [Zulu](https://www.azul.com/downloads/azure-only/zulu/) provided through [Azul Systems](https://www.azul.com/).

Major version updates will be provided through new runtime options in Azure App Service for Windows. Customers update to these newer versions of Java by configuring their App Service deployment and are responsible for testing and ensuring the major update meets their needs.

Supported JDKs are automatically patched on a quarterly basis in January, April, July, and October of each year. For more information on Java on Azure, please see [this support document](https://docs.microsoft.com/azure/developer/java/fundamentals/java-jdk-long-term-support).

### Security updates

Patches and fixes for major security vulnerabilities will be released as soon as they become available from Azul Systems. A "major" vulnerability is defined by a base score of 9.0 or higher on the [NIST Common Vulnerability Scoring System, version 2](https://nvd.nist.gov/cvss.cfm).

Tomcat 8.0 has reached [End of Life (EOL) as of September 30, 2018](https://tomcat.apache.org/tomcat-80-eol.html). While the runtime is still avialable on Azure App Service, Azure will not apply security updates to Tomcat 8.0. If possible, migrate your applications to Tomcat 8.5 or 9.0. Both Tomcat 8.5 and 9.0 are available on Azure App Service. See the [official Tomcat site](https://tomcat.apache.org/whichversion.html) for more information. 

### Deprecation and retirement

If a supported Java runtime will be retired, Azure developers using the affected runtime will be given a deprecation notice at least six months before the runtime is retired.

### Local development

Developers can download the Production Edition of Azul Zulu Enterprise JDK for local development from [Azul's download site](https://www.azul.com/downloads/azure-only/zulu/).

### Development support

Product support for the [Azure-supported Azul Zulu JDK](https://www.azul.com/downloads/azure-only/zulu/) is available through Microsoft when developing for Azure or [Azure Stack](https://azure.microsoft.com/overview/azure-stack/) with a [qualified Azure support plan](https://azure.microsoft.com/support/plans/).

### Runtime support

Developers can [open an issue](/azure/azure-portal/supportability/how-to-create-azure-support-request) with the Azul Zulu JDKs through Azure Support if they have a [qualified support plan](https://azure.microsoft.com/support/plans/).

## Next steps

This topic provides the Java Runtime statement of support for Azure App Service on Windows.

- To learn more about hosting web applications with Azure App Service see [App Service overview](overview.md).
- For information about Java on Azure development see [Azure for Java Dev Center](https://docs.microsoft.com/java/azure/?view=azure-java-stable).
