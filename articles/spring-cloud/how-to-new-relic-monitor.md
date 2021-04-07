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

This feature enables monitoring Azure Spring Cloud apps with the **New Relic** Java in-process agent.

You can:
* Consume the `New Relic` java in-process agent.
* Configure the `New Relic` java in-process agent using **Environment Variables**.
* Check all monitoring data from `New Relic` dashboard.

## Prerequisite

* A **New Relic** account.
* The [Azure CLI version 2.0.67 or later](/cli/azure/install-azure-cli).

## Leverage `New Relic` java in process agent

Use the following procedure

1. Create an instance of Azure Spring Cloud.

1. Create an application.

  ```shell
  az spring-cloud app create --name "appName" --is-public true \
      -s "resourceName" -g "resourceGroupName"
  ```

1. Create a deployment with **New Relic** agent and **Environment Variables**.

  ```shell
  az spring-cloud app deploy --name "appName" --jar-path app.jar \
     -s "resourceName" -g "resourceGroupName" \
     --jvm-options="-javaagent:/opt/agents/newrelic/java/newrelic-agent.jar" \
     --env NEW_RELIC_APP_NAME=appName NEW_RELIC_LICENSE_KEY=newRelicLicenseKey
  ```

  Azure Spring Cloud pre-installs the **New Relic** java agent to following path. Customers can leverage the agent from applications' **Jvm Options**, as well as configure the agent using the [New Relic java agent environment variables](https://docs.newrelic.com/docs/agents/java-agent/configuration/java-agent-configuration-config-file/#Environment_Variables).

  ```
  /opt/agents/newrelic/java/newrelic-agent.jar
  ```

## Portal

You can also leverage this agent from portal with the following procedure. 

1. Find the app from **Settings**/**Apps** in the navigation pane.
   ![Find app to monitor](media/new-relic-monitoring/find-app.png)

2. Click the applications to jump to the **Overview** page.

   ![Overview page](media/new-relic-monitoring/overview-page.png)

3. Click **Configurations** to add/update/delete the **Environment Variables** of the application.

   ![Update environment](media/new-relic-monitoring/configurations-update-environment.png)

4. Click **General settings** to add/update/delete the `Jvm Option` of the application.

   ![Update Jvm Option](media/new-relic-monitoring/upsdate-jvm-option.png)

5. View the application **Summary** page from the **New Relic** dashboard.

   ![App summary page](media/new-relic-monitoring/app-summary-page.png)

6. View the Java Virtual Machines (JVM) of the application from **New Relic** dashboard.

   ![Java Virtual Machines dashboard](media/new-relic-monitoring/java-virtual-machines.png)

7. Profile the application from the **New Relic** dashboard.

   ![New Relic dashboard](media/new-relic-monitoring/new-relic-dashboard.png)

## `New Relic` Java Agent Logging

By default, Azure Spring Cloud will print the logs of `New Relic` java agent to `STDOUT`. It will mixed with the application logs. You can find the explicit agent version from the application logs.

## `New Relic` Java Agent Update/Upgrade

The `New Relic` java agent will update/upgrade regularly with JDK, there agent update/upgrade may impact below scenarios.

* Your existed applications with `New Relic` java agent before update/upgrade will be unchanged.
* Your new created applications after update/upgrade will take the new version of `New Relic` java agent.
* Your existed applications need to restart or redeploy to take the new version of `New Relic` java agent.

## Vnet Injection Instance Outbound Traffic Configuration

For vnet injection instance of Azure Spring Cloud, you need to make sure the outbound traffic is configured correctly for `New Relic` java agent. Please reference the doc of [Networks of New Relic](https://docs.newrelic.com/docs/using-new-relic/cross-product-functions/install-configure/networks/#agents).

## Next steps