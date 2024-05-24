---
title: Configure APM platforms for Tomcat, JBoss, or Java SE apps
description: Learn how to configure APM platforms, such as Application Insights, NewRelic, and AppDynamics, for Tomcat, JBoss, or Java SE app on Azure App Service.
keywords: azure app service, web app, windows, oss, java, tomcat, jboss, spring boot, quarkus
ms.devlang: java
ms.topic: article
ms.date: 05/14/2024
ms.custom: devx-track-java, devx-track-azurecli, devx-track-extended-java, linux-related-content
zone_pivot_groups: app-service-java-hosting
adobe-target: true
author: cephalin
ms.author: cephalin
---

# Configure APM platforms for Tomcat, JBoss, or Java SE apps in Azure App Service

This article shows how to connect Java applications deployed on Azure App Service with Azure Monitor Application Insights, NewRelic, and AppDynamics application performance monitoring (APM) platforms.

[!INCLUDE [java-variants](includes/configure-language-java/java-variants.md)]

## Configure Application Insights

Azure Monitor Application Insights is a cloud native application monitoring service that enables customers to observe failures, bottlenecks, and usage patterns to improve application performance and reduce mean time to resolution (MTTR). With a few clicks or CLI commands, you can enable monitoring for your Node.js or Java apps, autocollecting logs, metrics, and distributed traces, eliminating the need for including an SDK in your app. For more information about the available app settings for configuring the agent, see the [Application Insights documentation](../azure-monitor/app/java-standalone-config.md).

# [Azure portal](#tab/portal)

To enable Application Insights from the Azure portal, go to **Application Insights** on the left-side menu and select **Turn on Application Insights**. By default, a new application insights resource of the same name as your web app is used. You can choose to use an existing application insights resource, or change the name. Select **Apply** at the bottom.

# [Azure CLI](#tab/cli)

To enable via the Azure CLI, you need to create an Application Insights resource and set a couple app settings on the Azure portal to connect Application Insights to your web app.

1. Enable the Applications Insights extension

    ```azurecli
    az extension add -n application-insights
    ```

2. Create an Application Insights resource using the following CLI command. Replace the placeholders with your desired resource name and group.

    ```azurecli
    az monitor app-insights component create --app <resource-name> -g <resource-group> --location westus2  --kind web --application-type web
    ```

    Note the values for `connectionString` and `instrumentationKey`, you'll need these values in the next step.

    > [!NOTE]
    > To retrieve a list of other locations, run `az account list-locations`.

3. Set the instrumentation key, connection string, and monitoring agent version as app settings on the web app. Replace `<instrumentationKey>` and `<connectionString>` with the values from the previous step.

    # [Windows](#tab/windows)

    ```azurecli
    az webapp config appsettings set -n <webapp-name> -g <resource-group> --settings "APPINSIGHTS_INSTRUMENTATIONKEY=<instrumentationKey>" "APPLICATIONINSIGHTS_CONNECTION_STRING=<connectionString>" "ApplicationInsightsAgent_EXTENSION_VERSION=~3" "XDT_MicrosoftApplicationInsights_Mode=default" "XDT_MicrosoftApplicationInsights_Java=1"
    ```

    # [Linux](#tab/linux)
    
    ```azurecli
    az webapp config appsettings set -n <webapp-name> -g <resource-group> --settings "APPINSIGHTS_INSTRUMENTATIONKEY=<instrumentationKey>" "APPLICATIONINSIGHTS_CONNECTION_STRING=<connectionString>" "ApplicationInsightsAgent_EXTENSION_VERSION=~3" "XDT_MicrosoftApplicationInsights_Mode=default"
    ```

    ---

---

## Configure New Relic

# [Windows](#tab/windows)

1. Create a NewRelic account at [NewRelic.com](https://newrelic.com/signup)
2. Download the Java agent from NewRelic. It has a file name similar to *newrelic-java-x.x.x.zip*.
3. Copy your license key, you need it to configure the agent later.
4. [SSH into your App Service instance](configure-linux-open-ssh-session.md) and create a new directory */home/site/wwwroot/apm*.
5. Upload the unpacked NewRelic Java agent files into a directory under */home/site/wwwroot/apm*. The files for your agent should be in */home/site/wwwroot/apm/newrelic*.
6. Modify the YAML file at */home/site/wwwroot/apm/newrelic/newrelic.yml* and replace the placeholder license value with your own license key.
7. In the Azure portal, browse to your application in App Service and create a new Application Setting.

    ::: zone pivot="java-javase"
    
    Create an environment variable named `JAVA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/newrelic/newrelic.jar`.

    ::: zone-end

    ::: zone pivot="java-tomcat"

    Create an environment variable named `CATALINA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/newrelic/newrelic.jar`.

    ::: zone-end

    ::: zone pivot="java-jboss"

    For **JBoss EAP**, `[TODO]`.

    ::: zone-end

# [Linux](#tab/linux)

1. Create a NewRelic account at [NewRelic.com](https://newrelic.com/signup)
2. Download the Java agent from NewRelic. It has a file name similar to *newrelic-java-x.x.x.zip*.
3. Copy your license key, you'll need it to configure the agent later.
4. [SSH into your App Service instance](configure-linux-open-ssh-session.md) and create a new directory */home/site/wwwroot/apm*.
5. Upload the unpacked NewRelic Java agent files into a directory under */home/site/wwwroot/apm*. The files for your agent should be in */home/site/wwwroot/apm/newrelic*.
6. Modify the YAML file at */home/site/wwwroot/apm/newrelic/newrelic.yml* and replace the placeholder license value with your own license key.
7. In the Azure portal, browse to your application in App Service and create a new Application Setting.

    ::: zone pivot="java-javase"
    
    Create an environment variable named `JAVA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/newrelic/newrelic.jar`.

    ::: zone-end

    ::: zone pivot="java-tomcat"

    Create an environment variable named `CATALINA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/newrelic/newrelic.jar`.

    ::: zone-end

    ::: zone pivot="java-jboss"

    For **JBoss EAP**, `[TODO]`.

    ::: zone-end

---

> [!NOTE]
> If you already have an environment variable for `JAVA_OPTS` or `CATALINA_OPTS`, append the `-javaagent:/...` option to the end of the current value.

## Configure AppDynamics

# [Windows](#tab/windows)

1. Create an AppDynamics account at [AppDynamics.com](https://www.appdynamics.com/community/register/)
2. Download the Java agent from the AppDynamics website. The file name is similar to *AppServerAgent-x.x.x.xxxxx.zip*
3. Use the [Kudu console](https://github.com/projectkudu/kudu/wiki/Kudu-console) to create a new directory */home/site/wwwroot/apm*.
4. Upload the Java agent files into a directory under */home/site/wwwroot/apm*. The files for your agent should be in */home/site/wwwroot/apm/appdynamics*.
5. In the Azure portal, browse to your application in App Service and create a new Application Setting.

    ::: zone pivot="java-javase"
    
    Create an environment variable named `JAVA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/appdynamics/javaagent.jar -Dappdynamics.agent.applicationName=<app-name>` where `<app-name>` is your App Service name. If you already have an environment variable for `JAVA_OPTS`, append the `-javaagent:/...` option to the end of the current value.

    ::: zone-end

    ::: zone pivot="java-tomcat"

    Create an environment variable named `CATALINA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/appdynamics/javaagent.jar -Dappdynamics.agent.applicationName=<app-name>` where `<app-name>` is your App Service name. If you already have an environment variable for `CATALINA_OPTS`, append the `-javaagent:/...` option to the end of the current value.

    ::: zone-end

    ::: zone pivot="java-jboss"

    For **JBoss EAP**, `[TODO]`.

    ::: zone-end

# [Linux](#tab/linux)

1. Create an AppDynamics account at [AppDynamics.com](https://www.appdynamics.com/community/register/)
2. Download the Java agent from the AppDynamics website. The file name is similar to *AppServerAgent-x.x.x.xxxxx.zip*
3. [SSH into your App Service instance](configure-linux-open-ssh-session.md) and create a new directory */home/site/wwwroot/apm*.
4. Upload the Java agent files into a directory under */home/site/wwwroot/apm*. The files for your agent should be in */home/site/wwwroot/apm/appdynamics*.
5. In the Azure portal, browse to your application in App Service and create a new Application Setting.

    ::: zone pivot="java-javase"

    Create an environment variable named `JAVA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/appdynamics/javaagent.jar -Dappdynamics.agent.applicationName=<app-name>` where `<app-name>` is your App Service name. If you already have an environment variable for `JAVA_OPTS`, append the `-javaagent:/...` option to the end of the current value.

    ::: zone-end

    ::: zone pivot="java-tomcat"

    Create an environment variable named `CATALINA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/appdynamics/javaagent.jar -Dappdynamics.agent.applicationName=<app-name>` where `<app-name>` is your App Service name. If you already have an environment variable for `CATALINA_OPTS`, append the `-javaagent:/...` option to the end of the current value.

    ::: zone-end

    ::: zone pivot="java-jboss"

    For **JBoss EAP**, `[TODO]`.

    ::: zone-end

---

> [!NOTE]
> 

## Choosing a Java runtime version

App Service allows users to choose the major version of the JVM, such as Java 8 or Java 11, and the patch version, such as 1.8.0_232 or 11.0.5. You can also choose to have the patch version automatically updated as new minor versions become available. In most cases, production apps should use pinned patch JVM versions. This prevents unanticipated outages during a patch version autoupdate. All Java web apps use 64-bit JVMs, and it's not configurable.

::: zone pivot="java-jboss"

If you're using Tomcat, you can choose to pin the patch version of Tomcat. On Windows, you can pin the patch versions of the JVM and Tomcat independently. On Linux, you can pin the patch version of Tomcat; the patch version of the JVM is also pinned but isn't separately configurable.

::: zone-end

If you choose to pin the minor version, you need to periodically update the JVM minor version on the app. To ensure that your application runs on the newer minor version, create a staging slot and increment the minor version on the staging slot. Once you confirm the application runs correctly on the new minor version, you can swap the staging and production slots.

::: zone pivot="java-jboss"

## Clustering

App Service supports clustering for JBoss EAP versions 7.4.1 and greater. To enable clustering, your web app must be [integrated with a virtual network](overview-vnet-integration.md). When the web app is integrated with a virtual network, it restarts, and the JBoss EAP installation automatically starts up with a clustered configuration. The JBoss EAP instances communicate over the subnet specified in the virtual network integration, using the ports shown in the `WEBSITES_PRIVATE_PORTS` environment variable at runtime. You can disable clustering by creating an app setting named `WEBSITE_DISABLE_CLUSTERING` with any value.

> [!NOTE]
> If you're enabling your virtual network integration with an ARM template, you need to manually set the property `vnetPrivatePorts` to a value of `2`. If you enable virtual network integration from the CLI or Portal, this property is set for you automatically.  

When clustering is enabled, the JBoss EAP instances use the FILE_PING JGroups discovery protocol to discover new instances and persist the cluster information like the cluster members, their identifiers, and their IP addresses. On App Service, these files are under `/home/clusterinfo/`. The first EAP instance to start obtains read/write permissions on the cluster membership file. Other instances read the file, find the primary node, and coordinate with that node to be included in the cluster and added to the file.

> [!Note]
> You can avoid JBOSS clustering timeouts by [cleaning up obsolete discovery files during your app startup](https://github.com/Azure/app-service-linux-docs/blob/master/HowTo/JBOSS/avoid_timeouts_obsolete_nodes.md)

The Premium V3 and Isolated V2 App Service Plan types can optionally be distributed across Availability Zones to improve resiliency and reliability for your business-critical workloads. This architecture is also known as [zone redundancy](../availability-zones/migrate-app-service.md). The JBoss EAP clustering feature is compatible with the zone redundancy feature.

### Autoscale Rules

When configuring autoscale rules for horizontal scaling, it's important to remove instances incrementally (one at a time) to ensure each removed instance can transfer its activity (such as handling a database transaction) to another member of the cluster. When configuring your autoscale rules in the Portal to scale down, use the following options:

- **Operation**: "Decrease count by"
- **Cool down**: "5 minutes" or greater
- **Instance count**: 1

You don't need to incrementally add instances (scaling out), you can add multiple instances to the cluster at a time.

## App Service plans

<a id="jboss-eap-hardware-options"></a>

JBoss EAP is only available on the Premium v3 and Isolated v2 App Service Plan types. Customers that created a JBoss EAP site on a different tier during the public preview should scale up to Premium or Isolated hardware tier to avoid unexpected behavior.

::: zone-end

::: zone pivot="java-tomcat"

## Tomcat baseline configuration

> [!NOTE]
> This section applies to Linux only.

Java developers can customize the server settings, troubleshoot issues, and deploy applications to Tomcat with confidence if they know about the server.xml file and configuration details of Tomcat. Possible customizations include:

* Customizing Tomcat configuration: By understanding the server.xml file and Tomcat's configuration details, you can fine-tune the server settings to match the needs of their applications.
* Debugging: When an application is deployed on a Tomcat server, developers need to know the server configuration to debug any issues that might arise. This includes checking the server logs, examining the configuration files, and identifying any errors that might be occurring.
* Troubleshooting Tomcat issues: Inevitably, Java developers encounter issues with their Tomcat server, such as performance problems or configuration errors. By understanding the server.xml file and Tomcat's configuration details, developers can quickly diagnose and troubleshoot these issues, which can save time and effort.
* Deploying applications to Tomcat: To deploy a Java web application to Tomcat, developers need to know how to configure the server.xml file and other Tomcat settings. Understanding these details is essential for deploying applications successfully and ensuring that they run smoothly on the server.

When you create an app with built-in Tomcat to host your Java workload (a WAR file or a JAR file), there are certain settings that you get out of the box for Tomcat configuration. You can refer to the [Official Apache Tomcat Documentation](https://tomcat.apache.org/) for detailed information, including the default configuration for Tomcat Web Server.

Additionally, there are certain transformations that are further applied on top of the server.xml for Tomcat distribution upon start. These are transformations to the Connector, Host, and Valve settings.

Note that the latest versions of Tomcat have server.xml (8.5.58 and 9.0.38 onward). Older versions of Tomcat don't use transforms and might have different behavior as a result.

### Connector

```xml 
<Connector port="${port.http}" address="127.0.0.1" maxHttpHeaderSize="16384" compression="on" URIEncoding="UTF-8" connectionTimeout="${site.connectionTimeout}" maxThreads="${catalina.maxThreads}" maxConnections="${catalina.maxConnections}" protocol="HTTP/1.1" redirectPort="8443"/>
 ```
* `maxHttpHeaderSize` is set to `16384`
* `URIEncoding` is set to `UTF-8`
* `conectionTimeout` is set to `WEBSITE_TOMCAT_CONNECTION_TIMEOUT`, which defaults to `240000`
* `maxThreads` is set to `WEBSITE_CATALINA_MAXTHREADS`, which defaults to `200`
* `maxConnections` is set to `WEBSITE_CATALINA_MAXCONNECTIONS`, which defaults to `10000`
 
> [!NOTE]
> The connectionTimeout, maxThreads and maxConnections settings can be tuned with app settings

Following are example CLI commands that you might use to alter the values of conectionTimeout, maxThreads, or maxConnections:

```azurecli-interactive
az webapp config appsettings set --resource-group myResourceGroup --name myApp --settings WEBSITE_TOMCAT_CONNECTION_TIMEOUT=120000
```
```azurecli-interactive
az webapp config appsettings set --resource-group myResourceGroup --name myApp --settings WEBSITE_CATALINA_MAXTHREADS=100
```
```azurecli-interactive
az webapp config appsettings set --resource-group myResourceGroup --name myApp --settings WEBSITE_CATALINA_MAXCONNECTIONS=5000
```
* Connector uses the address of the container instead of 127.0.0.1
 
### Host

```xml
<Host appBase="${site.appbase}" xmlBase="${site.xmlbase}" unpackWARs="${site.unpackwars}" workDir="${site.tempdir}" errorReportValveClass="com.microsoft.azure.appservice.AppServiceErrorReportValve" name="localhost" autoDeploy="true">
```

* `appBase` is set to `AZURE_SITE_APP_BASE`, which defaults to local `WebappsLocalPath`
* `xmlBase` is set to `AZURE_SITE_HOME`, which defaults to `/site/wwwroot`
* `unpackWARs` is set to `AZURE_UNPACK_WARS`, which defaults to `true`
* `workDir` is set to `JAVA_TMP_DIR`, which defaults `TMP`
* `errorReportValveClass` uses our custom error report valve
 
### Valve

```xml
<Valve prefix="site_access_log.${catalina.instance.name}" pattern="%h %l %u %t &quot;%r&quot; %s %b %D %{x-arr-log-id}i" directory="${site.logdir}/http/RawLogs" maxDays="${site.logRetentionDays}" className="org.apache.catalina.valves.AccessLogValve" suffix=".txt"/>
 ```
* `directory` is set to `AZURE_LOGGING_DIR`, which defaults to `home\logFiles`
* `maxDays` is to `WEBSITE_HTTPLOGGING_RETENTION_DAYS`, which defaults to `0` [forever]
 
On Linux, it has all of the same customization, plus:
 
* Adds some error and reporting pages to the valve:

    ```xml
    <xsl:attribute name="appServiceErrorPage">
        <xsl:value-of select="'${appService.valves.appServiceErrorPage}'"/>
    </xsl:attribute>
    
    <xsl:attribute name="showReport">
        <xsl:value-of select="'${catalina.valves.showReport}'"/>
    </xsl:attribute>
    
    <xsl:attribute name="showServerInfo">
        <xsl:value-of select="'${catalina.valves.showServerInfo}'"/>
    </xsl:attribute>
    ```

::: zone-end

## Next steps

Visit the [Azure for Java Developers](/java/azure/) center to find Azure quickstarts, tutorials, and Java reference documentation.

- [App Service Linux FAQ](faq-app-service-linux.yml)
- [Environment variables and app settings reference](reference-app-settings.md)
