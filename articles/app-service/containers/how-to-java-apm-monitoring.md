---
title: Configure Java APM and monitoring tools with Azure App Service on Linux
description: Learn how to send logs and metrics for your Java applications running on App Service Linux to NewRelic and App Dynamics APM providers
services: app-service\web
author: rloutlaw
manager: angerobe
ms.service: app-service-web
ms.workload: web
ms.topic: article
ms.date: 11/27/2018
ms.author: astay;routlaw
---

# Use application performance monitoring tools with Java apps on Azure App Service on Linux

This article shows how to connect Java applications deployed on Azure App Service on Linux with the NewRelic and AppDynamics application performance monitoring (APM) platforms.

## Configure New Relic
1. Create a NewRelic account at [NewRelic.com](https://newrelic.com/signup)
1. Download the Java agent from NewRelic, it will have a file name similar to `newrelic-java-x.x.x.zip`.
1. Copy your license key, you'll need it to configure the agent later.
1. [SSH into your App Service instance](/azure/app-service/containers/app-service-linux-ssh-support) and create a new directory  `/home/site/wwwroot/apm`. 
1. Upload the unpacked NewRelic Java agent files into a directory under `/home/site/wwwroot/apm`. The files for your agent should be in `/home/site/wwwroot/apm/newrelic`.
1. Modify the YAML file at `/home/site/wwwroot/apm/newrelic/newrelic.yml` and replace the placeholder license value with your own license key.
1. In the Azure portal, browse to your application in App Service and create a new Application Setting.
    - If your app is using **Java SE**, create an environment variable named `JAVA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/newrelic/newrelic.jar`.
    - If you're using **Tomcat**, create an environment variable named `CATALINA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/newrelic/newrelic.jar`.
    - If you already have an environment variable for `JAVA_OPTS` or `CATALINA_OPTS`, append the `javaagent` option to the end of the current value.

## Configure AppDynamics
1. Create an AppDynamics account at [AppDynamics.com](https://www.appdynamics.com/community/register/)
1. Download the Java agent from the AppDynamics website, the file name will be similar to `AppServerAgent-x.x.x.xxxxx.zip`
1. [SSH into your App Service instance](/azure/app-service/containers/app-service-linux-ssh-support) and create a new directory  `/home/site/wwwroot/apm`. 
1. Upload the Java agent files into a directory under `/home/site/wwwroot/apm`. The files for your agent should be in `/home/site/wwwroot/apm/appdynamics`.
1. IIn the Azure portal, browse to your application in App Service and create a new Application Setting.
    - If you're using **Java SE**, create an environment variable named `JAVA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/appdynamics/javaagent.jar -Dappdynamics.agent.applicationName=<YOUR_SITE_NAME>` where `<YOUR_SITE_NAME>` is your App Service name.
    - If you're using **Tomcat**, create an environment variable named `CATALINA_OPTS` with the value `-javaagent:/home/site/wwwroot/apm/appdynamics/javaagent.jar -Dappdynamics.agent.applicationName=<YOUR_SITE_NAME>` where `<YOUR_SITE_NAME>` is your App Service name.
