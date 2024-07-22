---
title: Configure APM platforms for Tomcat, JBoss, or Java SE apps
description: Learn how to configure APM platforms, such as Application Insights, NewRelic, and AppDynamics, for Tomcat, JBoss, or Java SE app on Azure App Service.
keywords: azure app service, web app, windows, oss, java, tomcat, jboss, spring boot, quarkus
ms.devlang: java
ms.topic: article
ms.date: 07/17/2024
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

## Configure Datadog

# [Windows](#tab/windows)
* The configuration options are different depending on which Datadog site your organization is using. See the official [Datadog Integration for Azure Documentation](https://docs.datadoghq.com/integrations/azure/)

# [Linux](#tab/linux)
* The configuration options are different depending on which Datadog site your organization is using. See the official [Datadog Integration for Azure Documentation](https://docs.datadoghq.com/integrations/azure/)

---

## Configure Dynatrace

# [Windows](#tab/windows)
* Dynatrace provides an [Azure Native Dynatrace Service](https://www.dynatrace.com/monitoring/technologies/azure-monitoring/). To monitor Azure App Services using Dynatrace, see the official [Dynatrace for Azure documentation](https://docs.datadoghq.com/integrations/azure/)

# [Linux](#tab/linux)
* Dynatrace provides an [Azure Native Dynatrace Service](https://www.dynatrace.com/monitoring/technologies/azure-monitoring/). To monitor Azure App Services using Dynatrace, see the official [Dynatrace for Azure documentation](https://docs.datadoghq.com/integrations/azure/)

---

## Next steps

Visit the [Azure for Java Developers](/java/azure/) center to find Azure quickstarts, tutorials, and Java reference documentation.

- [App Service Linux FAQ](faq-app-service-linux.yml)
- [Environment variables and app settings reference](reference-app-settings.md)
