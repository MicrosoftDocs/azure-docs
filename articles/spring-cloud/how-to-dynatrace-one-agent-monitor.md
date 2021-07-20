---
title:  "Dynatrace Java OneAgent to monitor Azure Spring Cloud applications"
description: How to use Dynatrace Java OneAgent to monitor Azure Spring Cloud applications
author:  MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: how-to
ms.date: 05/14/2021
ms.custom: devx-track-java
---

# Dynatrace Spring Cloud OneAgent (Preview)
> [!Note]
> This document is in progress and will undergo further editorial review.

This document explains how to use **Dynatrace OneAgent** to monitor Azure Spring Cloud applications.  With the **Dynatrace OneAgent** you can:

* Monitor apps with the **Dynatrace OneAgent**.
* Configure the **Dynatrace OneAgent** by **Environment Variables**.
* Check all monitoring data from **Dynatrace** dashboard.

## Prerequisite
To monitor your Spring Cloud workloads with Dynatrace, you must integrate OneAgent with your Azure Spring Cloud application. You will need the following to use these features:
* **Dynatrace** account.
* [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).
* Create a [PaaS token](https://www.dynatrace.com/support/help/reference/dynatrace-concepts/access-tokens/).

## Set up integration 

### Prepare your environment in Azure 
1. In the Azure portal, create an instance of Azure Spring Cloud.
1. In the new Azure Spring Cloud instance, create a resource group where Dynatrace will be deployed.
1.  In the new resource group, create an application that you want to report to Dynatrace by running the following command. Replace the placeholders <...> with your own values.
```azurecli
az spring-cloud app create --name <your-application-name> --is-public true -s <your-resource-name> -g <your-resource-group-name>
```
### Determine the values for the required environment variables
To set up OneAgent integration on your Azure Spring Cloud instance, you need to
configure three environment variables, DT_TENANT, DT_TENANTTOKEN, and
DT_CONNECTION_POINT.

To determine the values for **DT_TENANTTOKEN** and **DT_CONNECTION_POINT**, make an
API request as follows:

**For SaaS deployments:**
Replace the placeholders <...> with your own values.
```
curl https://<DT_TENANT>.live.dynatrace.com/api/v1/deployment/installer/agent/connectioninfo?Api-Token=<your_PaaS_token>
```

**For Managed deployments:**
Replace <your-domain> with your Managed deployment domain
and <your-environment-id> with your [Dynatrace environment ID](https://www.dynatrace.com/support/help/reference/dynatrace/concepts/environment-id/).

```
curl https://<your-domain>/e/<your-environment-id>/api/v1/deployment/installer/agent/connectioninfo?Api-Token=<your_PaaS_token>
```

**For environment ActiveGates:**
Replace <your-activegate-domain> with your ActiveGate
domain and <your-environment-id> with your [Dynatrace environment ID](https://www.dynatrace.com/support/help/reference/dynatrace/concepts/environment-id/).

```
curl https://<your-activegate-domain>/e/<your-environment-id>/api/v1/deployment/installer/agent/connectioninfo?Api-Token=<your_PaaS_token>
```

### Add the environment variables to your application
When you have the values for the environment variables required for OneAgent
integration, you can add the respective key/value pairs to your application either on
Azure portal, or in the Azure CLI. See below the instructions for each of these options.

## Azure CLI
Run the command below, replacing the placeholders <...> with your
values determined in the previous steps.
```azurecli
az spring-cloud app deploy --name <your-application-name> --jar-path app.jar \
  -s <your-resource-name> -g <your-resource-group-name> --env DT_TENANT=<your-environment-ID> \
  DT_TENANTTOKEN=<your-tenant-token> DT_CONNECTION_POINT=<your-communication-endpoint>
```

## Portal

* You can configure **OneAgent** from the Azure portal with existing applications.

  ![Existing applications view](media/dynatrace-oneagent/existing-applications.png)

* Click an application to jump to the **Overview** page of the application.

  ![Overview](media/dynatrace-oneagent/overview-application.png)

* Click **Configurations** to add/update/delete the **Environment Variables** of the application.

  ![Configuration](media/dynatrace-oneagent/configuration-application.png)

## View reports in Dynatrace

After you add the environment variables to your application, Dynatrace starts collecting data. To view reports, in the Dynatrace menu
(https://www.dynatrace.com/support/help/get-started/navigation/), go to **Services** and
select your application.

## Dynatrace Dashboard

* **Transactions and services` blade**
  * You can find the **Service flow** from **yourAppName/Details/Service flow**
    ![Service flow](media/dynatrace-oneagent/spring-cloud-dynatrace-app-flow.png)

  * You can find the **Method hotspots** from **yourAppName/Details/Method hotspots**
    ![Method hotspots](media/dynatrace-oneagent/spring-cloud-dynatrace-hotspots.png)

  * You can find the **Database statements** from **yourAppName/Details/Response time anaysis**
    ![Database statements](media/dynatrace-oneagent/spring-cloud-dynatrace-database-contribution.png)

* **Diagnostic tools** blade
  * You can find the **Top database statements** from **Multidimensional analysis/Top database statements**
    ![Top database statements](media/dynatrace-oneagent/spring-cloud-dynatrace-top-database.png)

  * You can find the **Exceptions overview** from **Multidimensional analysis/Exceptions overview**
    ![Exceptions overview](media/dynatrace-oneagent/spring-cloud-dynatrace-exception-analysis.png)

  * You can find the **CPU analysis** from this blade
    ![CPU analysis](media/dynatrace-oneagent/spring-cloud-dynatrace-cpu-analysis.png)

* **Databases** blade
  * You can find **Backtrace** from this blade
    ![Backtrace](media/dynatrace-oneagent/spring-cloud-dynatrace-database-backtrace.png)

## Dynatrace OneAgent Logging

By default, Azure Spring Cloud will print the **info** level logs of the **Dynatrace OneAgent** to `STDOUT`. The logs will be mixed with the application logs. You can find the explicit agent version from the application logs.

You can also get the logs of **Dynatrace** agent from:

* Azure Spring Cloud Logs.
* Azure Spring Cloud Application Insights.
* Azure Spring Cloud LogStream.

You can leverage some environment variables provided by **Dynatrace** to configure logging of the **Dynatrace OneAgent**. For example, `DT_LOGLEVELCON` controls the level of logs. You can find more details from [Dynatrace Environment Variables](https://docs.newrelic.com/docs/agents/java-agent/configuration/java-agent-configuration-config-file/#Environment_Variables).

> [!CAUTION]
>
> We strongly recommend that you _do not_ override the logging default behavior provided by Azure Spring Cloud for Dynatrace. If you do, the logging scenarios above will be blocked, and the log file(s) may be lost. For example, you should not output the following environment variable to you applications.
>
> * DT_LOGLEVELFILE

## Dynatrace OneAgent Update/Upgrade

The **Dynatrace OneAgent** will update/upgrade regularly with JDK (quarterly). Agent update/upgrade may impact the following scenarios.

* Existing applications using **Dynatrace OneAgent** before update/upgrade will be unchanged.
* Existing applications that use **Dynatrace OneAgent** before update/upgrade require restart or redeploy to engage new version of **Dynatrace OneAgent**.
* Applications created after update/upgrade will use the new version of **Dynatrace OneAgent**.

## Vnet Injection Instance Outbound Traffic Configuration

For vnet injection instances of Azure Spring Cloud, you need to make sure the outbound traffic is configured correctly for **Dynatrace OneAgent**. For details see [Communication Endpoints of Dynatrace](https://www.dynatrace.com/support/help/dynatrace-api/environment-api/deployment/oneagent/get-connectivity-info/?response-parameters%3C-%3Ejson-model=json-model).

## See also
* [Use distributed tracing with Azure Spring Cloud](how-to-distributed-tracing.md)