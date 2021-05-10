---
title: "How to monitor with New Relic in-process agent"
titleSuffix: Azure Spring Cloud
description: Learn how to monitor Azure Spring Cloud apps using the New Relic in-process agent.
author: MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: how-to
ms.date: 04/07/2021
ms.custom: devx-track-java
---

# How to monitor with New Relic in-process agent (Preview)

This feature enables monitoring of Azure Spring Cloud apps with the **New Relic** Java in-process agent.

With the **New Relic** Java in-process agent, you can:
* Consume the **New Relic** java in-process agent.
* Configure the **New Relic** java in-process agent using **Environment Variables**.
* Check all monitoring data from the **New Relic** dashboard.

## Prerequisites

* A **New Relic** account.
* The [Azure CLI version, 2.0.67 or later](/cli/azure/install-azure-cli).

## Leverage the New Relic java in process agent

Use the following procedure to access the in-process agent:

1. Create an instance of Azure Spring Cloud.

2. Create an application.

    ```shell
      az spring-cloud app create --name "appName" --is-public true \
      -s "resourceName" -g "resourceGroupName"
    ```

3. Create a deployment with the **New Relic** agent and **Environment Variables**.

    ```shell
    az spring-cloud app deploy --name "appName" --jar-path app.jar \
       -s "resourceName" -g "resourceGroupName" \
       --jvm-options="-javaagent:/opt/agents/newrelic/java/newrelic-agent.jar" \
       --env NEW_RELIC_APP_NAME=appName NEW_RELIC_LICENSE_KEY=newRelicLicenseKey
    ```

  Azure Spring Cloud pre-installs the **New Relic** java agent to the following path. Customers can leverage the agent from applications' **Jvm Options**, as well as configure the agent using the [New Relic java agent environment variables](https://docs.newrelic.com/docs/agents/java-agent/configuration/java-agent-configuration-config-file/#Environment_Variables).

  ```shell
  /opt/agents/newrelic/java/newrelic-agent.jar
  ```

## Portal

You can also leverage this agent from portal with the following procedure. 

1. Find the app from **Settings**/**Apps** in the navigation pane.

   ![Find app to monitor](media/new-relic-monitoring/find-app.png)

2. Click the application to jump to the **Overview** page.

   ![Overview page](media/new-relic-monitoring/overview-page.png)

3. Click **Configuration** in the left navigation pane to add/update/delete the **Environment Variables** of the application.

   ![Update environment](media/new-relic-monitoring/configurations-update-environment.png)

4. Click **General settings** to add/update/delete the `Jvm Option` of the application.

   ![Update Jvm Option](media/new-relic-monitoring/update-jvm-option.png)

5. View the application **Summary** page from the **New Relic** dashboard.

   ![App summary page](media/new-relic-monitoring/app-summary-page.png)

6. View the Java Virtual Machines (JVM) of the application from the **New Relic** dashboard.

   ![Java Virtual Machines dashboard](media/new-relic-monitoring/java-virtual-machines.png)

7. Profile the application from the **New Relic** dashboard.

   ![New Relic dashboard](media/new-relic-monitoring/new-relic-dashboard.png)

## New Relic Java Agent Logging

By default, Azure Spring Cloud will print the logs of the **New Relic** java agent to `STDOUT`. It will be combined with the application logs. You can get the explicit agent version from the application logs.

You can also get the logs of the `New Relic` agent from:

* Azure Spring Cloud Logs.
* Azure Spring Cloud Application Insights.
* Azure Spring Cloud LogStream.

You can leverage some environment variables provided by `New Relic` to configure the logging of the `New Agent`, such as, `NEW_RELIC_LOG_LEVEL` to control the level of logs. For more information, see [New Relic Environment Variables](https://docs.newrelic.com/docs/agents/java-agent/configuration/java-agent-configuration-config-file/#Environment_Variables).

> [!CAUTION]
> We strongly recommend that you *do not* override the logging default behavior provided by Azure Spring Cloud for `New Relic`. If you do, the logging scenarios in above scenarios will be blocked, and the log file(s) may be lost. For example, you should not pass the following environment variables to you applications.
>
> * NEW_RELIC_LOG
> * NEW_RELIC_LOG_FILE_PATH

## New Relic Java Agent update/upgrade

The **New Relic** java agent will update/upgrade the JDK regularly. The agent update/upgrade may impact following scenarios.

* Existing applications with the **New Relic** java agent before update/upgrade will be unchanged.
* New applications created after update/upgrade will take the new version of the **New Relic** java agent.
* Existing applications need to restart or redeploy to engage the new version of the **New Relic** java agent.

## Vnet Injection Instance Outbound Traffic Configuration

For a vnet injection instance of Azure Spring Cloud, you need to make sure the outbound traffic is configured correctly for the **New Relic** java agent. For more information, see [Networks of New Relic](https://docs.newrelic.com/docs/using-new-relic/cross-product-functions/install-configure/networks/#agents).

## Next steps
*  [Distributed tracing and App Insights](href: how-to-distributed-tracing.md)