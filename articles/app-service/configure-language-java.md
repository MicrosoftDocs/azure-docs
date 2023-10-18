---
title: Configure Java apps
description: Learn how to configure Java apps to run on Azure App Service. This article shows the most common configuration tasks.
keywords: azure app service, web app, windows, oss, java, tomcat, jboss
ms.devlang: java
ms.topic: article
ms.date: 04/12/2019
ms.custom: seodec18, devx-track-java, devx-track-azurecli, devx-track-extended-java
zone_pivot_groups: app-service-platform-windows-linux
adobe-target: true
author: cephalin
ms.author: cephalin
---

# Configure a Java app for Azure App Service

Azure App Service lets Java developers to quickly build, deploy, and scale their Java SE, Tomcat, and JBoss EAP web applications on a fully managed service. Deploy applications with Maven plugins, from the command line, or in editors like IntelliJ, Eclipse, or Visual Studio Code.

This guide provides key concepts and instructions for Java developers using App Service. If you've never used Azure App Service, you should read through the [Java quickstart](quickstart-java.md) first. General questions about using App Service that aren't specific to Java development are answered in the [App Service FAQ](faq-configuration-and-management.yml).

## Show Java version

::: zone pivot="platform-windows"  

To show the current Java version, run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config show --name <app-name> --resource-group <resource-group-name> --query "[javaVersion, javaContainer, javaContainerVersion]"
```

To show all supported Java versions, run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp list-runtimes --os windows | grep java
```

::: zone-end

::: zone pivot="platform-linux"

To show the current Java version, run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config show --resource-group <resource-group-name> --name <app-name> --query linuxFxVersion
```

To show all supported Java versions, run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp list-runtimes --os linux | grep "JAVA\|TOMCAT\|JBOSSEAP"
```

::: zone-end

## Deploying your app

### Build Tools

#### Maven

With the [Maven Plugin for Azure Web Apps](https://github.com/microsoft/azure-maven-plugins/tree/develop/azure-webapp-maven-plugin), you can prepare your Maven Java project for Azure Web App easily with one command in your project root:

```shell
mvn com.microsoft.azure:azure-webapp-maven-plugin:2.11.0:config
```

This command adds a `azure-webapp-maven-plugin` plugin and related configuration by prompting you to select an existing Azure Web App or create a new one. Then you can deploy your Java app to Azure using the following command:

```shell
mvn package azure-webapp:deploy
```

Here's a sample configuration in `pom.xml`:

```xml
<plugin> 
  <groupId>com.microsoft.azure</groupId>  
  <artifactId>azure-webapp-maven-plugin</artifactId>  
  <version>2.11.0</version>  
  <configuration>
    <subscriptionId>111111-11111-11111-1111111</subscriptionId>
    <resourceGroup>spring-boot-xxxxxxxxxx-rg</resourceGroup>
    <appName>spring-boot-xxxxxxxxxx</appName>
    <pricingTier>B2</pricingTier>
    <region>westus</region>
    <runtime>
      <os>Linux</os>      
      <webContainer>Java SE</webContainer>
      <javaVersion>Java 11</javaVersion>
    </runtime>
    <deployment>
      <resources>
        <resource>
          <type>jar</type>
          <directory>${project.basedir}/target</directory>
          <includes>
            <include>*.jar</include>
          </includes>
        </resource>
      </resources>
    </deployment>
  </configuration>
</plugin> 
```

#### Gradle

1. Set up the [Gradle Plugin for Azure Web Apps](https://github.com/microsoft/azure-gradle-plugins/tree/master/azure-webapp-gradle-plugin) by adding the plugin to your `build.gradle`:

    ```groovy
    plugins {
      id "com.microsoft.azure.azurewebapp" version "1.7.1"
    }
    ```

1. Configure your Web App details, corresponding Azure resources will be created if not exist.
Here's a sample configuration, for details, refer to this [document](https://github.com/microsoft/azure-gradle-plugins/wiki/Webapp-Configuration).

    ```groovy
    azurewebapp {
        subscription = '<your subscription id>'
        resourceGroup = '<your resource group>'
        appName = '<your app name>'
        pricingTier = '<price tier like 'P1v2'>'
        region = '<region like 'westus'>'
        runtime {
          os = 'Linux'
          webContainer = 'Tomcat 9.0' // or 'Java SE' if you want to run an executable jar
          javaVersion = 'Java 8'
        }
        appSettings {
            <key> = <value>
        }
        auth {
            type = 'azure_cli' // support azure_cli, oauth2, device_code and service_principal
        }
    }
    ```

1. Deploy with one command.

    ```shell
    gradle azureWebAppDeploy
    ```

### IDEs

Azure provides seamless Java App Service development experience in popular Java IDEs, including:

- *VS Code*: [Java Web Apps with Visual Studio Code](https://code.visualstudio.com/docs/java/java-webapp#_deploy-web-apps-to-the-cloud)
- *IntelliJ IDEA*:[Create a Hello World web app for Azure App Service using IntelliJ](/azure/developer/java/toolkit-for-intellij/create-hello-world-web-app)
- *Eclipse*:[Create a Hello World web app for Azure App Service using Eclipse](/azure/developer/java/toolkit-for-eclipse/create-hello-world-web-app)

### Kudu API

#### Java SE

To deploy .jar files to Java SE, use the `/api/publish/` endpoint of the Kudu site. For more information on this API, see [this documentation](./deploy-zip.md#deploy-warjarear-packages).

> [!NOTE]
> Your .jar application must be named `app.jar` for App Service to identify and run your application. The Maven Plugin (mentioned above) will automatically rename your application for you during deployment. If you don't wish to rename your JAR to *app.jar*, you can upload a shell script with the command to run your .jar app. Paste the absolute path to this script in the [Startup File](./faq-app-service-linux.yml) textbox in the Configuration section of the portal. The startup script doesn't run from the directory into which it's placed. Therefore, always use absolute paths to reference files in your startup script (for example: `java -jar /home/myapp/myapp.jar`).

#### Tomcat

To deploy .war files to Tomcat, use the `/api/wardeploy/` endpoint to POST your archive file. For more information on this API, see [this documentation](./deploy-zip.md#deploy-warjarear-packages).

::: zone pivot="platform-linux"

#### JBoss EAP

To deploy .war files to JBoss, use the `/api/wardeploy/` endpoint to POST your archive file. For more information on this API, see [this documentation](./deploy-zip.md#deploy-warjarear-packages).

To deploy .ear files, [use FTP](deploy-ftp.md). Your .ear application will be deployed to the context root defined in your application's configuration. For example, if the context root of your app is `<context-root>myapp</context-root>`, then you can browse the site at the `/myapp` path: `http://my-app-name.azurewebsites.net/myapp`. If you want your web app to be served in the root path, ensure that your app sets the context root to the root path: `<context-root>/</context-root>`. For more information, see [Setting the context root of a web application](https://docs.jboss.org/jbossas/guides/webguide/r2/en/html/ch06.html).

::: zone-end

Don't deploy your .war or .jar using FTP. The FTP tool is designed to upload startup scripts, dependencies, or other runtime files. It's not the optimal choice for deploying web apps.

## Logging and debugging apps

Performance reports, traffic visualizations, and health checkups are available for each app through the Azure portal. For more information, see [Azure App Service diagnostics overview](overview-diagnostics.md).

### Stream diagnostic logs

::: zone pivot="platform-windows"

[!INCLUDE [Access diagnostic logs](../../includes/app-service-web-logs-access-no-h.md)]

::: zone-end
::: zone pivot="platform-linux"

[!INCLUDE [Access diagnostic logs](../../includes/app-service-web-logs-access-linux-no-h.md)]

::: zone-end

For more information, see [Stream logs in Cloud Shell](troubleshoot-diagnostic-logs.md#in-cloud-shell).

::: zone pivot="platform-linux"

### SSH console access

[!INCLUDE [Open SSH session in browser](../../includes/app-service-web-ssh-connect-builtin-no-h.md)]

### Troubleshooting tools

The built-in Java images are based on the [Alpine Linux](https://alpine-linux.readthedocs.io/en/latest/getting_started.html) operating system. Use the `apk` package manager to install any troubleshooting tools or commands.

::: zone-end

### Java Profiler

All Java runtimes on Azure App Service come with the JDK Flight Recorder for profiling Java workloads. You can use this to record JVM, system, and application events and troubleshoot problems in your applications.

To learn more about the Java Profiler, visit the [Azure Application Insights documentation](/azure/azure-monitor/app/java-standalone-profiler).

### App logging

::: zone pivot="platform-windows"

Enable [application logging](troubleshoot-diagnostic-logs.md#enable-application-logging-windows) through the Azure portal or [Azure CLI](/cli/azure/webapp/log#az-webapp-log-config) to configure App Service to write your application's standard console output and standard console error streams to the local filesystem or Azure Blob Storage. Logging to the local App Service filesystem instance is disabled 12 hours after it's configured. If you need longer retention, configure the application to write output to a Blob storage container. Your Java and Tomcat app logs can be found in the */home/LogFiles/Application/* directory.

::: zone-end
::: zone pivot="platform-linux"

Enable [application logging](troubleshoot-diagnostic-logs.md#enable-application-logging-linuxcontainer) through the Azure portal or [Azure CLI](/cli/azure/webapp/log#az-webapp-log-config) to configure App Service to write your application's standard console output and standard console error streams to the local filesystem or Azure Blob Storage. If you need longer retention, configure the application to write output to a Blob storage container. Your Java and Tomcat app logs can be found in the */home/LogFiles/Application/* directory.

Azure Blob Storage logging for Linux based App Services can only be configured using [Azure Monitor](./troubleshoot-diagnostic-logs.md#send-logs-to-azure-monitor)

::: zone-end

If your application uses [Logback](https://logback.qos.ch/) or [Log4j](https://logging.apache.org/log4j) for tracing, you can forward these traces for review into Azure Application Insights using the logging framework configuration instructions in [Explore Java trace logs in Application Insights](/previous-versions/azure/azure-monitor/app/deprecated-java-2x#explore-java-trace-logs-in-application-insights).

> [!NOTE]
> Due to known vulnerability [CVE-2021-44228](https://logging.apache.org/log4j/2.x/security.html), be sure to use Log4j version 2.16 or later.

## Customization and tuning

Azure App Service supports out of the box tuning and customization through the Azure portal and CLI. Review the following articles for non-Java-specific web app configuration:

- [Configure app settings](configure-common.md#configure-app-settings)
- [Set up a custom domain](app-service-web-tutorial-custom-domain.md)
- [Configure TLS/SSL bindings](configure-ssl-bindings.md)
- [Add a CDN](../cdn/cdn-add-to-web-app.md)
- [Configure the Kudu site](https://github.com/projectkudu/kudu/wiki/Configurable-settings#linux-on-app-service-settings)

### Copy App Content Locally

Set the app setting `JAVA_COPY_ALL` to `true` to copy your app contents to the local worker from the shared file system. This helps address file-locking issues.

### Set Java runtime options

To set allocated memory or other JVM runtime options, create an [app setting](configure-common.md#configure-app-settings) named `JAVA_OPTS` with the options. App Service passes this setting as an environment variable to the Java runtime when it starts.

In the Azure portal, under **Application Settings** for the web app, create a new app setting named `JAVA_OPTS` for Java SE or `CATALINA_OPTS` for Tomcat that includes other settings, such as `-Xms512m -Xmx1204m`.

To configure the app setting from the Maven plugin, add setting/value tags in the Azure plugin section. The following example sets a specific minimum and maximum Java heap size:

```xml
<appSettings>
    <property>
        <name>JAVA_OPTS</name>
        <value>-Xms1024m -Xmx1024m</value>
    </property>
</appSettings>
```

::: zone pivot="platform-windows"

> [!NOTE]
> You don't need to create a web.config file when using Tomcat on Windows App Service.

::: zone-end

Developers running a single application with one deployment slot in their App Service plan can use the following options:

- B1 and S1 instances: `-Xms1024m -Xmx1024m`
- B2 and S2 instances: `-Xms3072m -Xmx3072m`
- B3 and S3 instances: `-Xms6144m -Xmx6144m`
- P1v2 instances: `-Xms3072m -Xmx3072m`
- P2v2 instances: `-Xms6144m -Xmx6144m`
- P3v2 instances: `-Xms12800m -Xmx12800m`
- P1v3 instances: `-Xms6656m -Xmx6656m`
- P2v3 instances: `-Xms14848m -Xmx14848m`
- P3v3 instances: `-Xms30720m -Xmx30720m`
- I1 instances: `-Xms3072m -Xmx3072m`
- I2 instances: `-Xms6144m -Xmx6144m`
- I3 instances: `-Xms12800m -Xmx12800m`
- I1v2 instances: `-Xms6656m -Xmx6656m`
- I2v2 instances: `-Xms14848m -Xmx14848m`
- I3v2 instances: `-Xms30720m -Xmx30720m`

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

Java applications running in App Service have the same set of [security best practices](../security/fundamentals/paas-applications-using-app-services.md) as other applications.

### Authenticate users (Easy Auth)

Set up app authentication in the Azure portal with the **Authentication and Authorization** option. From there, you can enable authentication using Azure Active Directory or social sign-ins like Facebook, Google, or GitHub. Azure portal configuration only works when configuring a single authentication provider. For more information, see [Configure your App Service app to use Azure Active Directory sign-in](configure-authentication-provider-aad.md) and the related articles for other identity providers. If you need to enable multiple sign-in providers, follow the instructions in the [customize sign-ins and sign-outs](configure-authentication-customize-sign-in-out.md) article.

#### Java SE

Spring Boot developers can use the [Azure Active Directory Spring Boot starter](/java/azure/spring-framework/configure-spring-boot-starter-java-app-with-azure-active-directory) to secure applications using familiar Spring Security annotations and APIs. Be sure to increase the maximum header size in your *application.properties* file. We suggest a value of `16384`.

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

To sign out users, use the `/.auth/ext/logout` path. To perform other actions, see the documentation on [Customize sign-ins and sign-outs](configure-authentication-customize-sign-in-out.md). There's also official documentation on the Tomcat [HttpServletRequest interface](https://tomcat.apache.org/tomcat-5.5-doc/servletapi/javax/servlet/http/HttpServletRequest.html) and its methods. The following servlet methods are also hydrated based on your App Service configuration:

```java
public boolean isSecure()
public String getRemoteAddr()
public String getRemoteHost()
public String getScheme()
public int getServerPort()
```

To disable this feature, create an Application Setting named `WEBSITE_AUTH_SKIP_PRINCIPAL` with a value of `1`. To disable all servlet filters added by App Service, create a setting named `WEBSITE_SKIP_FILTERS` with a value of `1`.

### Configure TLS/SSL

Follow the instructions in the [Secure a custom DNS name with an TLS/SSL binding in Azure App Service](configure-ssl-bindings.md) to upload an existing TLS/SSL certificate and bind it to your application's domain name. By default your application will still allow HTTP connections-follow the specific steps in the tutorial to enforce TLS/SSL.

### Use KeyVault References

[Azure KeyVault](../key-vault/general/overview.md) provides centralized secret management with access policies and audit history. You can store secrets (such as passwords or connection strings) in KeyVault and access these secrets in your application through environment variables.

First, follow the instructions for [granting your app access to a key vault](app-service-key-vault-references.md#grant-your-app-access-to-a-key-vault) and [making a KeyVault reference to your secret in an Application Setting](app-service-key-vault-references.md#source-app-settings-from-key-vault). You can validate that the reference resolves to the secret by printing the environment variable while remotely accessing the App Service terminal.

To inject these secrets in your Spring or Tomcat configuration file, use environment variable injection syntax (`${MY_ENV_VAR}`). For Spring configuration files, see this documentation on [externalized configurations](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html).

::: zone pivot="platform-linux"

### Use the Java Key Store

By default, any public or private certificates [uploaded to App Service Linux](configure-ssl-certificate.md) will be loaded into the respective Java Key Stores as the container starts. After uploading your certificate, you'll need to restart your App Service for it to be loaded into the Java Key Store. Public certificates are loaded into the Key Store at `$JRE_HOME/lib/security/cacerts`, and private certificates are stored in `$JRE_HOME/lib/security/client.jks`.

More configuration may be necessary for encrypting your JDBC connection with certificates in the Java Key Store. Refer to the documentation for your chosen JDBC driver.

- [PostgreSQL](https://jdbc.postgresql.org/documentation/ssl/)
- [SQL Server](/sql/connect/jdbc/connecting-with-ssl-encryption)
- [MySQL](https://dev.mysql.com/doc/connector-j/5.1/en/connector-j-reference-using-ssl.html)
- [MongoDB](https://mongodb.github.io/mongo-java-driver/3.4/driver/tutorials/ssl/)
- [Cassandra](https://docs.datastax.com/en/developer/java-driver/4.3/)

#### Initialize the Java Key Store

To initialize the `import java.security.KeyStore` object, load the keystore file with the password. The default password for both key stores is `changeit`.

```java
KeyStore keyStore = KeyStore.getInstance("jks");
keyStore.load(
    new FileInputStream(System.getenv("JRE_HOME")+"/lib/security/cacerts"),
    "changeit".toCharArray());

KeyStore keyStore = KeyStore.getInstance("pkcs12");
keyStore.load(
    new FileInputStream(System.getenv("JRE_HOME")+"/lib/security/client.jks"),
    "changeit".toCharArray());
```

#### Manually load the key store

You can load certificates manually to the key store. Create an app setting, `SKIP_JAVA_KEYSTORE_LOAD`, with a value of `1` to disable App Service from loading the certificates into the key store automatically. All public certificates uploaded to App Service via the Azure portal are stored under `/var/ssl/certs/`. Private certificates are stored under `/var/ssl/private/`.

You can interact or debug the Java Key Tool by [opening an SSH connection](configure-linux-open-ssh-session.md) to your App Service and running the command `keytool`. See the [Key Tool documentation](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html) for a list of commands. For more information on the KeyStore API, see [the official documentation](https://docs.oracle.com/javase/8/docs/api/java/security/KeyStore.html).

::: zone-end

## Configure APM platforms

This section shows how to connect Java applications deployed on Azure App Service with Azure Monitor Application Insights, NewRelic, and AppDynamics application performance monitoring (APM) platforms.

### Configure Application Insights

Azure Monitor Application Insights is a cloud native application monitoring service that enables customers to observe failures, bottlenecks, and usage patterns to improve application performance and reduce mean time to resolution (MTTR). With a few clicks or CLI commands, you can enable monitoring for your Node.js or Java apps, autocollecting logs, metrics, and distributed traces, eliminating the need for including an SDK in your app. For more information about the available app settings for configuring the agent, see the [Application Insights documentation](../azure-monitor/app/java-standalone-config.md).

#### Azure portal

To enable Application Insights from the Azure portal, go to **Application Insights** on the left-side menu and select **Turn on Application Insights**. By default, a new application insights resource of the same name as your Web App will be used. You can choose to use an existing application insights resource, or change the name. Select **Apply** at the bottom

#### Azure CLI

To enable via the Azure CLI, you'll need to create an Application Insights resource and set a couple app settings on the Azure portal to connect Application Insights to your web app.

1. Enable the Applications Insights extension

    ```azurecli
    az extension add -n application-insights
    ```

2. Create an Application Insights resource using the CLI command below. Replace the placeholders with your desired resource name and group.

    ```azurecli
    az monitor app-insights component create --app <resource-name> -g <resource-group> --location westus2  --kind web --application-type web
    ```

    Note the values for `connectionString` and `instrumentationKey`, you'll need these values in the next step.

    > To retrieve a list of other locations, run `az account list-locations`.

::: zone pivot="platform-windows"

3. Set the instrumentation key, connection string, and monitoring agent version as app settings on the web app. Replace `<instrumentationKey>` and `<connectionString>` with the values from the previous step.

    ```azurecli
    az webapp config appsettings set -n <webapp-name> -g <resource-group> --settings "APPINSIGHTS_INSTRUMENTATIONKEY=<instrumentationKey>" "APPLICATIONINSIGHTS_CONNECTION_STRING=<connectionString>" "ApplicationInsightsAgent_EXTENSION_VERSION=~3" "XDT_MicrosoftApplicationInsights_Mode=default" "XDT_MicrosoftApplicationInsights_Java=1"
    ```

::: zone-end
::: zone pivot="platform-linux"

3. Set the instrumentation key, connection string, and monitoring agent version as app settings on the web app. Replace `<instrumentationKey>` and `<connectionString>` with the values from the previous step.

    ```azurecli
    az webapp config appsettings set -n <webapp-name> -g <resource-group> --settings "APPINSIGHTS_INSTRUMENTATIONKEY=<instrumentationKey>" "APPLICATIONINSIGHTS_CONNECTION_STRING=<connectionString>" "ApplicationInsightsAgent_EXTENSION_VERSION=~3" "XDT_MicrosoftApplicationInsights_Mode=default"
    ```

::: zone-end

### Configure New Relic

::: zone pivot="platform-windows"

1. Create a NewRelic account at [NewRelic.com](https://newrelic.com/signup)
2. Download the Java agent from NewRelic, it will have a file name similar to *newrelic-java-x.x.x.zip*.
3. Copy your license key, you'll need it to configure the agent later.
4. [SSH into your App Service instance](configure-linux-open-ssh-session.md) and create a new directory */home/site/wwwroot/apm*.
5. Upload the unpacked NewRelic Java agent files into a directory under */home/site/wwwroot/apm*. The files for your agent should be in */home/site/wwwroot/apm/newrelic*.
6. Modify the YAML file at */home/site/wwwroot/apm/newrelic/newrelic.yml* and replace the placeholder license value with your own license key.
7. In the Azure portal, browse to your application in App Service and create a new Application Setting.

    - For **Java SE** apps, create an environment variable named `JAVA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/newrelic/newrelic.jar`.
    - For **Tomcat**, create an environment variable named `CATALINA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/newrelic/newrelic.jar`.

::: zone-end
::: zone pivot="platform-linux"

1. Create a NewRelic account at [NewRelic.com](https://newrelic.com/signup)
2. Download the Java agent from NewRelic, it will have a file name similar to *newrelic-java-x.x.x.zip*.
3. Copy your license key, you'll need it to configure the agent later.
4. [SSH into your App Service instance](configure-linux-open-ssh-session.md) and create a new directory */home/site/wwwroot/apm*.
5. Upload the unpacked NewRelic Java agent files into a directory under */home/site/wwwroot/apm*. The files for your agent should be in */home/site/wwwroot/apm/newrelic*.
6. Modify the YAML file at */home/site/wwwroot/apm/newrelic/newrelic.yml* and replace the placeholder license value with your own license key.
7. In the Azure portal, browse to your application in App Service and create a new Application Setting.

    - For **Java SE** apps, create an environment variable named `JAVA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/newrelic/newrelic.jar`.
    - For **Tomcat**, create an environment variable named `CATALINA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/newrelic/newrelic.jar`.

::: zone-end

> If you already have an environment variable for `JAVA_OPTS` or `CATALINA_OPTS`, append the `-javaagent:/...` option to the end of the current value.

### Configure AppDynamics

::: zone pivot="platform-windows"

1. Create an AppDynamics account at [AppDynamics.com](https://www.appdynamics.com/community/register/)
2. Download the Java agent from the AppDynamics website, the file name will be similar to *AppServerAgent-x.x.x.xxxxx.zip*
3. Use the [Kudu console](https://github.com/projectkudu/kudu/wiki/Kudu-console) to create a new directory */home/site/wwwroot/apm*.
4. Upload the Java agent files into a directory under */home/site/wwwroot/apm*. The files for your agent should be in */home/site/wwwroot/apm/appdynamics*.
5. In the Azure portal, browse to your application in App Service and create a new Application Setting.

   - For **Java SE** apps, create an environment variable named `JAVA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/appdynamics/javaagent.jar -Dappdynamics.agent.applicationName=<app-name>` where `<app-name>` is your App Service name.
   - For **Tomcat** apps, create an environment variable named `CATALINA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/appdynamics/javaagent.jar -Dappdynamics.agent.applicationName=<app-name>` where `<app-name>` is your App Service name.

::: zone-end
::: zone pivot="platform-linux"

1. Create an AppDynamics account at [AppDynamics.com](https://www.appdynamics.com/community/register/)
2. Download the Java agent from the AppDynamics website, the file name will be similar to *AppServerAgent-x.x.x.xxxxx.zip*
3. [SSH into your App Service instance](configure-linux-open-ssh-session.md) and create a new directory */home/site/wwwroot/apm*.
4. Upload the Java agent files into a directory under */home/site/wwwroot/apm*. The files for your agent should be in */home/site/wwwroot/apm/appdynamics*.
5. In the Azure portal, browse to your application in App Service and create a new Application Setting.

   - For **Java SE** apps, create an environment variable named `JAVA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/appdynamics/javaagent.jar -Dappdynamics.agent.applicationName=<app-name>` where `<app-name>` is your App Service name.
   - For **Tomcat** apps, create an environment variable named `CATALINA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/appdynamics/javaagent.jar -Dappdynamics.agent.applicationName=<app-name>` where `<app-name>` is your App Service name.

::: zone-end

> [!NOTE]
> If you already have an environment variable for `JAVA_OPTS` or `CATALINA_OPTS`, append the `-javaagent:/...` option to the end of the current value.

## Configure data sources

### Java SE

To connect to data sources in Spring Boot applications, we suggest creating connection strings and injecting them into your *application.properties* file.

1. In the "Configuration" section of the App Service page, set a name for the string, paste your JDBC connection string into the value field, and set the type to "Custom". You can optionally set this connection string as slot setting.

    This connection string is accessible to our application as an environment variable named `CUSTOMCONNSTR_<your-string-name>`. For example, the connection string we created above will be named `CUSTOMCONNSTR_exampledb`.

2. In your *application.properties* file, reference this connection string with the environment variable name. For our example, we would use the following.

    ```yml
    app.datasource.url=${CUSTOMCONNSTR_exampledb}
    ```

For more information, see the [Spring Boot documentation on data access](https://docs.spring.io/spring-boot/docs/current/reference/html/howto-data-access.html) and [externalized configurations](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html).

::: zone pivot="platform-windows"

### Tomcat

These instructions apply to all database connections. You'll need to fill placeholders with your chosen database's driver class name and JAR file. Provided is a table with class names and driver downloads for common databases.

| Database   | Driver Class Name                             | JDBC Driver                                                                      |
|------------|-----------------------------------------------|------------------------------------------------------------------------------------------|
| PostgreSQL | `org.postgresql.Driver`                        | [Download](https://jdbc.postgresql.org/download/)                                    |
| MySQL      | `com.mysql.jdbc.Driver`                        | [Download](https://dev.mysql.com/downloads/connector/j/) (Select "Platform Independent") |
| SQL Server | `com.microsoft.sqlserver.jdbc.SQLServerDriver` | [Download](/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server#download)                                                           |

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

1. Create a *context.xml* file in the *META-INF/* directory of your project. Create the *META-INF/* directory if it doesn't exist.

2. In *context.xml*, add a `Context` element to link the data source to a JNDI address. Replace the `driverClassName` placeholder with your driver's class name from the table above.

    ```xml
    <Context>
        <Resource
            name="jdbc/dbconnection"
            type="javax.sql.DataSource"
            url="${connURL}"
            driverClassName="<insert your driver class name>"
            username="${dbuser}"
            password="${dbpassword}"
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

Tomcat installations on App Service on Windows exist in shared space on the App Service Plan. You can't directly modify a Tomcat installation for server-wide configuration. To make server-level configuration changes to your Tomcat installation, you must copy Tomcat to a local folder, in which you can modify Tomcat's configuration.

##### Automate creating custom Tomcat on app start

You can use a startup script to perform actions before a web app starts. The startup script for customizing Tomcat needs to complete the following steps:

1. Check whether Tomcat was already copied and configured locally. If it was, the startup script can end here.
2. Copy Tomcat locally.
3. Make the required configuration changes.
4. Indicate that configuration was successfully completed.

For Windows sites, create a file named `startup.cmd` or `startup.ps1` in the `wwwroot` directory. This will automatically be executed before the Tomcat server starts.

Here's a PowerShell script that completes these steps:

```powershell
    # Check for marker file indicating that config has already been done
    if(Test-Path "$Env:LOCAL_EXPANDED\tomcat\config_done_marker"){
        return 0
    }

    # Delete previous Tomcat directory if it exists
    # In case previous config could not be completed or a new config should be forcefully installed
    if(Test-Path "$Env:LOCAL_EXPANDED\tomcat"){
        Remove-Item "$Env:LOCAL_EXPANDED\tomcat" --recurse
    }

    # Copy Tomcat to local
    # Using the environment variable $AZURE_TOMCAT90_HOME uses the 'default' version of Tomcat
    Copy-Item -Path "$Env:AZURE_TOMCAT90_HOME\*" -Destination "$Env:LOCAL_EXPANDED\tomcat" -Recurse

    # Perform the required customization of Tomcat
    {... customization ...}

    # Mark that the operation was a success
    New-Item -Path "$Env:LOCAL_EXPANDED\tomcat\config_done_marker" -ItemType File
```

##### Transforms

A common use case for customizing a Tomcat version is to modify the `server.xml`, `context.xml`, or `web.xml` Tomcat configuration files. App Service already modifies these files to provide platform features. To continue to use these features, it's important to preserve the content of these files when you make changes to them. To accomplish this, we recommend that you use an [XSL transformation (XSLT)](https://www.w3schools.com/xml/xsl_intro.asp). Use an XSL transform to make changes to the XML files while preserving the original contents of the file.

###### Example XSLT file

This example transform adds a new connector node to `server.xml`. Note the *Identity Transform*, which preserves the original contents of the file.

```xml
    <xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" indent="yes"/>
  
    <!-- Identity transform: this ensures that the original contents of the file are included in the new file -->
    <!-- Ensure that your transform files include this block -->
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
  
    <!-- Add the new connector after the last existing Connnector if there's one -->
    <xsl:template match="Connector[last()]" mode="insertConnector">
      <xsl:call-template name="Copy" />
  
      <xsl:call-template name="AddConnector" />
    </xsl:template>
  
    <!-- ... or before the first Engine if there's no existing Connector -->
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

###### Function for XSL transform

PowerShell has built-in tools for transforming XML files by using XSL transforms. The following script is an example function that you can use in `startup.ps1` to perform the transform:

```powershell
    function TransformXML{
        param ($xml, $xsl, $output)

        if (-not $xml -or -not $xsl -or -not $output)
        {
            return 0
        }

        Try
        {
            $xslt_settings = New-Object System.Xml.Xsl.XsltSettings;
            $XmlUrlResolver = New-Object System.Xml.XmlUrlResolver;
            $xslt_settings.EnableScript = 1;

            $xslt = New-Object System.Xml.Xsl.XslCompiledTransform;
            $xslt.Load($xsl,$xslt_settings,$XmlUrlResolver);
            $xslt.Transform($xml, $output);

        }

        Catch
        {
            $ErrorMessage = $_.Exception.Message
            $FailedItem = $_.Exception.ItemName
            Write-Host  'Error'$ErrorMessage':'$FailedItem':' $_.Exception;
            return 0
        }
        return 1
    }
```

##### App settings

The platform also needs to know where your custom version of Tomcat is installed. You can set the installation's location in the `CATALINA_BASE` app setting.

You can use the Azure CLI to change this setting:

```azurecli
    az webapp config appsettings set -g $MyResourceGroup -n $MyUniqueApp --settings CATALINA_BASE="%LOCAL_EXPANDED%\tomcat"
```

Or, you can manually change the setting in the Azure portal:

1. Go to **Settings** > **Configuration** > **Application settings**.
1. Select **New Application Setting**.
1. Use these values to create the setting:
   1. **Name**: `CATALINA_BASE`
   1. **Value**: `"%LOCAL_EXPANDED%\tomcat"`

##### Example startup.ps1

The following example script copies a custom Tomcat to a local folder, performs an XSL transform, and indicates that the transform was successful:

```powershell
    # Locations of xml and xsl files
    $target_xml="$Env:LOCAL_EXPANDED\tomcat\conf\server.xml"
    $target_xsl="$Env:HOME\site\server.xsl"
    
    # Define the transform function
    # Useful if transforming multiple files
    function TransformXML{
        param ($xml, $xsl, $output)
    
        if (-not $xml -or -not $xsl -or -not $output)
        {
            return 0
        }
    
        Try
        {
            $xslt_settings = New-Object System.Xml.Xsl.XsltSettings;
            $XmlUrlResolver = New-Object System.Xml.XmlUrlResolver;
            $xslt_settings.EnableScript = 1;
    
            $xslt = New-Object System.Xml.Xsl.XslCompiledTransform;
            $xslt.Load($xsl,$xslt_settings,$XmlUrlResolver);
            $xslt.Transform($xml, $output);
        }
    
        Catch
        {
            $ErrorMessage = $_.Exception.Message
            $FailedItem = $_.Exception.ItemName
            echo  'Error'$ErrorMessage':'$FailedItem':' $_.Exception;
            return 0
        }
        return 1
    }
    
    $success = TransformXML -xml $target_xml -xsl $target_xsl -output $target_xml
    
    # Check for marker file indicating that config has already been done
    if(Test-Path "$Env:LOCAL_EXPANDED\tomcat\config_done_marker"){
        return 0
    }
    
    # Delete previous Tomcat directory if it exists
    # In case previous config could not be completed or a new config should be forcefully installed
    if(Test-Path "$Env:LOCAL_EXPANDED\tomcat"){
        Remove-Item "$Env:LOCAL_EXPANDED\tomcat" --recurse
    }
    
    md -Path "$Env:LOCAL_EXPANDED\tomcat"
    
    # Copy Tomcat to local
    # Using the environment variable $AZURE_TOMCAT90_HOME uses the 'default' version of Tomcat
    Copy-Item -Path "$Env:AZURE_TOMCAT90_HOME\*" "$Env:LOCAL_EXPANDED\tomcat" -Recurse
    
    # Perform the required customization of Tomcat
    $success = TransformXML -xml $target_xml -xsl $target_xsl -output $target_xml
    
    # Mark that the operation was a success if successful
    if($success){
        New-Item -Path "$Env:LOCAL_EXPANDED\tomcat\config_done_marker" -ItemType File
    }
```

#### Finalize configuration

Finally, you'll place the driver JARs in the Tomcat classpath and restart your App Service. Ensure that the JDBC driver files are available to the Tomcat classloader by placing them in the */home/tomcat/lib* directory. (Create this directory if it doesn't already exist.) To upload these files to your App Service instance, perform the following steps:

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

---

::: zone-end
::: zone pivot="platform-linux"

### Tomcat

These instructions apply to all database connections. You'll need to fill placeholders with your chosen database's driver class name and JAR file. Provided is a table with class names and driver downloads for common databases.

| Database   | Driver Class Name                             | JDBC Driver                                                                              |
|------------|-----------------------------------------------|------------------------------------------------------------------------------------------|
| PostgreSQL | `org.postgresql.Driver`                        | [Download](https://jdbc.postgresql.org/download/)                                    |
| MySQL      | `com.mysql.jdbc.Driver`                        | [Download](https://dev.mysql.com/downloads/connector/j/) (Select "Platform Independent") |
| SQL Server | `com.microsoft.sqlserver.jdbc.SQLServerDriver` | [Download](/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server#download)     |

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

1. Create a *context.xml* file in the *META-INF/* directory of your project. Create the *META-INF/* directory if it doesn't exist.

2. In *context.xml*, add a `Context` element to link the data source to a JNDI address. Replace the `driverClassName` placeholder with your driver's class name from the table above.

    ```xml
    <Context>
        <Resource
            name="jdbc/dbconnection"
            type="javax.sql.DataSource"
            url="${connURL}"
            driverClassName="<insert your driver class name>"
            username="${dbuser}"
            password="${dbpassword}"
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

Adding a shared, server-level data source will require you to edit Tomcat's server.xml. First, upload a [startup script](./faq-app-service-linux.yml) and set the path to the script in **Configuration** > **Startup Command**. You can upload the startup script using [FTP](deploy-ftp.md).

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

  <!-- Add the new connector after the last existing Connnector if there's one -->
  <xsl:template match="Connector[last()]" mode="insertConnector">
    <xsl:call-template name="Copy" />

    <xsl:call-template name="AddConnector" />
  </xsl:template>

  <!-- ... or before the first Engine if there's no existing Connector -->
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

1. Ensure that the JDBC driver files are available to the Tomcat classloader by placing them in the */home/tomcat/lib* directory. (Create this directory if it doesn't already exist.) To upload these files to your App Service instance, perform the following steps:

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

2. If you created a server-level data source, restart the App Service Linux application. Tomcat will reset `CATALINA_BASE` to `/home/tomcat` and use the updated configuration.

### JBoss EAP Data Sources

There are three core steps when [registering a data source with JBoss EAP](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.0/html/configuration_guide/datasource_management): uploading the JDBC driver, adding the JDBC driver as a module, and registering the module. App Service is a stateless hosting service, so the configuration commands for adding and registering the data source module must be scripted and applied as the container starts.

1. Obtain your database's JDBC driver.
2. Create an XML module definition file for the JDBC driver. The example shown below is a module definition for PostgreSQL.

    ```xml
    <?xml version="1.0" ?>
    <module xmlns="urn:jboss:module:1.1" name="org.postgres">
        <resources>
        <!-- ***** IMPORTANT : REPLACE THIS PLACEHOLDER *******-->
        <resource-root path="/home/site/deployments/tools/postgresql-42.2.12.jar" />
        </resources>
        <dependencies>
            <module name="javax.api"/>
            <module name="javax.transaction.api"/>
        </dependencies>
    </module>
    ```

1. Put your JBoss CLI commands into a file named `jboss-cli-commands.cli`. The JBoss commands must add the module and register it as a data source. The example below shows the JBoss CLI commands for PostgreSQL.

    ```bash
    #!/usr/bin/env bash
    module add --name=org.postgres --resources=/home/site/deployments/tools/postgresql-42.2.12.jar --module-xml=/home/site/deployments/tools/postgres-module.xml

    /subsystem=datasources/jdbc-driver=postgres:add(driver-name="postgres",driver-module-name="org.postgres",driver-class-name=org.postgresql.Driver,driver-xa-datasource-class-name=org.postgresql.xa.PGXADataSource)

    data-source add --name=postgresDS --driver-name=postgres --jndi-name=java:jboss/datasources/postgresDS --connection-url=${POSTGRES_CONNECTION_URL,env.POSTGRES_CONNECTION_URL:jdbc:postgresql://db:5432/postgres} --user-name=${POSTGRES_SERVER_ADMIN_FULL_NAME,env.POSTGRES_SERVER_ADMIN_FULL_NAME:postgres} --password=${POSTGRES_SERVER_ADMIN_PASSWORD,env.POSTGRES_SERVER_ADMIN_PASSWORD:example} --use-ccm=true --max-pool-size=5 --blocking-timeout-wait-millis=5000 --enabled=true --driver-class=org.postgresql.Driver --exception-sorter-class-name=org.jboss.jca.adapters.jdbc.extensions.postgres.PostgreSQLExceptionSorter --jta=true --use-java-context=true --valid-connection-checker-class-name=org.jboss.jca.adapters.jdbc.extensions.postgres.PostgreSQLValidConnectionChecker
    ```

1. Create a startup script, `startup_script.sh` that calls the JBoss CLI commands. The example below shows how to call your `jboss-cli-commands.cli`. Later you'll configure App Service to run this script when the container starts.

    ```bash
    $JBOSS_HOME/bin/jboss-cli.sh --connect --file=/home/site/deployments/tools/jboss-cli-commands.cli
    ```

1. Using an FTP client of your choice, upload your JDBC driver, `jboss-cli-commands.cli`, `startup_script.sh`, and the module definition to `/site/deployments/tools/`.
2. Configure your site to run `startup_script.sh` when the container starts. In the Azure portal, navigate to **Configuration** > **General Settings** > **Startup Command**. Set the startup command field to `/home/site/deployments/tools/startup_script.sh`. **Save** your changes.

To confirm that the datasource was added to the JBoss server, SSH into your webapp and run `$JBOSS_HOME/bin/jboss-cli.sh --connect`. Once you're connected to JBoss run the `/subsystem=datasources:read-resource` to print a list of the data sources.

::: zone-end

[!INCLUDE [robots933456](../../includes/app-service-web-configure-robots933456.md)]

## Choosing a Java runtime version

App Service allows users to choose the major version of the JVM, such as Java 8 or Java 11, and the patch version, such as 1.8.0_232 or 11.0.5. You can also choose to have the patch version automatically updated as new minor versions become available. In most cases, production sites should use pinned patch JVM versions. This will prevent unanticipated outages during a patch version autoupdate. All Java web apps use 64-bit JVMs, this isn't configurable.

If you're using Tomcat, you can choose to pin the patch version of Tomcat. On Windows, you can pin the patch versions of the JVM and Tomcat independently. On Linux, you can pin the patch version of Tomcat; the patch version of the JVM will also be pinned but isn't separately configurable.

If you choose to pin the minor version, you'll need to periodically update the JVM minor version on the site. To ensure that your application runs on the newer minor version, create a staging slot and increment the minor version on the staging site. Once you have confirmed the application runs correctly on the new minor version, you can swap the staging and production slots.

::: zone pivot="platform-linux"

## JBoss EAP

### Clustering in JBoss EAP

App Service supports clustering for JBoss EAP versions 7.4.1 and greater. To enable clustering, your web app must be [integrated with a virtual network](overview-vnet-integration.md). When the web app is integrated with a virtual network, the web app will restart and JBoss EAP will automatically start up with a clustered configuration. The JBoss EAP instances will communicate over the subnet specified in the virtual network integration, using the ports shown in the `WEBSITES_PRIVATE_PORTS` environment variable at runtime. You can disable clustering by creating an app setting named `WEBSITE_DISABLE_CLUSTERING` with any value.

> [!NOTE]
> If you're enabling your virtual network integration with an ARM template, you'll need to manually set the property `vnetPrivatePorts` to a value of `2`. If you enable virtual network integration from the CLI or Portal, this property will be set for you automatically.  

When clustering is enabled, the JBoss EAP instances use the FILE_PING JGroups discovery protocol to discover new instances and persist the cluster information like the cluster members, their identifiers, and their IP addresses. On App Service, these files are under `/home/clusterinfo/`. The first EAP instance to start will obtain read/write permissions on the cluster membership file. Other instances will read the file, find the primary node, and coordinate with that node to be included in the cluster and added to the file.

The Premium V3 and Isolated V2 App Service Plan types can optionally be distributed across Availability Zones to improve resiliency and reliability for your business-critical workloads. This architecture is also known as [zone redundancy](../availability-zones/migrate-app-service.md). The JBoss EAP clustering feature is compatible with the zone redundancy feature. 

#### Autoscale Rules

When configuring autoscale rules for horizontal scaling, it's important to remove instances incrementally (one at a time) to ensure each removed instance can transfer its activity (such as handling a database transaction) to another member of the cluster. When configuring your autoscale rules in the Portal to scale down, use the following options:

- **Operation**: "Decrease count by"
- **Cool down**: "5 minutes" or greater
- **Instance count**: 1

You don't need to incrementally add instances (scaling out), you can add multiple instances to the cluster at a time.

### JBoss EAP App Service Plans

<a id="jboss-eap-hardware-options"></a>

JBoss EAP is only available on the Premium v3 and Isolated v2 App Service Plan types. Customers that created a JBoss EAP site on a different tier during the public preview should scale up to Premium or Isolated hardware tier to avoid unexpected behavior.

::: zone-end

## Java runtime statement of support

### JDK versions and maintenance

Microsoft and Adoptium builds of OpenJDK are provided and supported on App Service for Java 8, 11, and 17. These binaries are provided as a no-cost, multi-platform, production-ready distribution of the OpenJDK for Azure. They contain all the components for building and running Java SE applications. For local development or testing, you can install the Microsoft build of OpenJDK from the [downloads page](/java/openjdk/download). The table below describes the new Java versions included in the January 2022 App Service platform release:

| Java Version | Linux            | Windows              |
|--------------|------------------|----------------------|
| Java 8       | 1.8.0_312 (Adoptium) * | 1.8.0_312 (Adoptium) |
| Java 11      | 11.0.13 (Microsoft)   | 11.0.13 (Microsoft)       |
| Java 17      | 17.0.1 (Microsoft)    | 17.0.1 (Microsoft)        |

\* In following releases, Java 8 on Linux will be distributed from Adoptium builds of the OpenJDK.

If you're [pinned](#choosing-a-java-runtime-version) to an older minor version of Java, your site may be using the deprecated [Azul Zulu for Azure](https://devblogs.microsoft.com/java/end-of-updates-support-and-availability-of-zulu-for-azure/) binaries provided through [Azul Systems](https://www.azul.com/). You can continue to use these binaries for your site, but any security patches or improvements will only be available in new versions of the OpenJDK, so we recommend that you periodically update your Web Apps to a later version of Java.

Major version updates will be provided through new runtime options in Azure App Service. Customers update to these newer versions of Java by configuring their App Service deployment and are responsible for testing and ensuring the major update meets their needs.

Supported JDKs are automatically patched on a quarterly basis in January, April, July, and October of each year. For more information on Java on Azure, see [this support document](/azure/developer/java/fundamentals/java-support-on-azure).

### Security updates

Patches and fixes for major security vulnerabilities will be released as soon as they become available in Microsoft builds of the OpenJDK. A "major" vulnerability is defined by a base score of 9.0 or higher on the [NIST Common Vulnerability Scoring System, version 2](https://nvd.nist.gov/vuln-metrics/cvss).

Tomcat 8.0 has reached [End of Life (EOL) as of September 30, 2018](https://tomcat.apache.org/tomcat-80-eol.html). While the runtime is still available on Azure App Service, Azure will not apply security updates to Tomcat 8.0. If possible, migrate your applications to Tomcat 8.5 or 9.0. Both Tomcat 8.5 and 9.0 are available on Azure App Service. For more information, see the [official Tomcat site](https://tomcat.apache.org/whichversion.html).

Community support for Java 7 will terminate on July 29, 2022 and [Java 7 will be retired from App Service](https://azure.microsoft.com/updates/transition-to-java-11-or-8-by-29-july-2022/) at that time. If you have a web app running on Java 7, please upgrade to Java 8 or 11 before July 29.

### Deprecation and retirement

If a supported Java runtime will be retired, Azure developers using the affected runtime will be given a deprecation notice at least six months before the runtime is retired.

- [Reasons to move to Java 11](/java/openjdk/reasons-to-move-to-java-11?bc=/azure/developer/breadcrumb/toc.json&toc=/azure/developer/java/fundamentals/toc.json)
- [Java 7 migration guide](/java/openjdk/transition-from-java-7-to-java-8?bc=/azure/developer/breadcrumb/toc.json&toc=/azure/developer/java/fundamentals/toc.json)

### Local development

Developers can download the Microsoft Build of OpenJDK for local development from [our download site](/java/openjdk/download).

### Development support

Product support for the [Microsoft Build of OpenJDK](/java/openjdk/download) is available through Microsoft when developing for Azure or [Azure Stack](https://azure.microsoft.com/overview/azure-stack/) with a [qualified Azure support plan](https://azure.microsoft.com/support/plans/).

## Next steps

Visit the [Azure for Java Developers](/java/azure/) center to find Azure quickstarts, tutorials, and Java reference documentation.

- [App Service Linux FAQ](faq-app-service-linux.yml)
- [Environment variables and app settings reference](reference-app-settings.md)
