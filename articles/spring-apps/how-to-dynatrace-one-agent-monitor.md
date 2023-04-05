---
title:  "How to monitor Spring Boot apps with Dynatrace Java OneAgent"
description: How to use Dynatrace Java OneAgent to monitor Spring Boot applications in Azure Spring Apps
author:  karlerickson
ms.author: karler
ms.service: spring-apps
ms.topic: how-to
ms.date: 06/07/2022
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
ms.devlang: azurecli
---

# How to monitor Spring Boot apps with Dynatrace Java OneAgent

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Standard consumption (Preview) ✔️ Basic/Standard tier ❌️ Enterprise tier

This article shows you how to use Dynatrace OneAgent to monitor Spring Boot applications in Azure Spring Apps.

With the Dynatrace OneAgent, you can:

* Monitor apps with the Dynatrace OneAgent.
* Configure the Dynatrace OneAgent by using environment variables.
* Check all monitoring data from Dynatrace dashboard.

The following video introduces Dynatrace OneAgent.

<br>

> [!VIDEO https://www.youtube.com/embed/PF0_SxuiZ2w]

## Prerequisites

* [Azure CLI](/cli/azure/install-azure-cli)
* [A Dynatrace account](https://www.dynatrace.com/)
* [A Dynatrace PaaS token and tenant token](https://www.dynatrace.com/support/help/reference/dynatrace-concepts/access-tokens/)

## Activate Dynatrace OneAgent

The following sections describe how to activate Dynatrace OneAgent.

### Prepare your Azure Spring Apps environment

1. Create an instance of Azure Spring Apps.
1. Create an application that you want to report to Dynatrace by running the following command. Replace the placeholders *\<...>* with your own values.
   ```azurecli
   az spring app create \
       --resource-group <your-resource-group-name> \
       --service <your-Azure-Spring-Apps-name> \
       --name <your-application-name> \
       --is-public true
   ```

### Determine the values for the required environment variables

To activate Dynatrace OneAgent on your Azure Spring Apps instance, you need to configure four environment variables: `DT_TENANT`, `DT_TENANTTOKEN`, `DT_CONNECTION_POINT`, and `DT_CLUSTER_ID`. For more information, see [Integrate OneAgent with Azure Spring Apps](https://www.dynatrace.com/support/help/shortlink/azure-spring).

For applications with multiple instances, Dynatrace has several ways to group them. `DT_CLUSTER_ID` is one of the ways. For more information, see [Process group detection](https://www.dynatrace.com/support/help/how-to-use-dynatrace/process-groups/configuration/pg-detection).

### Add the environment variables to your application

You can add the environment variable key/value pairs to your application using either the Azure portal or the Azure CLI.

#### Option 1: Azure CLI

To add the key/value pairs using the Azure CLI, run the following command, replacing the placeholders *\<...>* with the values determined in the previous steps.

```azurecli
az spring app deploy \
    --resource-group <your-resource-group-name> \
    --service <your-Azure-Spring-Apps-name> \
    --name <your-application-name> \
    --jar-path app.jar \
    --env \
        DT_TENANT=<your-environment-ID> \
        DT_TENANTTOKEN=<your-tenant-token> \
        DT_CONNECTION_POINT=<your-communication-endpoint>
```

#### Option 2: Azure portal

To add the key/value pairs using the Azure portal, use the following steps:

1. In your Azure Spring Apps instance, select **Apps** in the navigation pane.

   :::image type="content" source="media/dynatrace-oneagent/existing-applications.png" alt-text="Screenshot of the Azure portal showing the Apps page for an Azure Spring Apps instance." lightbox="media/dynatrace-oneagent/existing-applications.png":::

1. Select the application from the list, and then select **Configuration** in the navigation pane.

1. Use the **Environmental variables** tab to add or update the variables used by your application.

   :::image type="content" source="media/dynatrace-oneagent/configuration-application.png" alt-text="Screenshot of the Azure portal showing the Configuration page for an app in an Azure Spring Apps instance, with the Environmental variables tab selected." lightbox="media/dynatrace-oneagent/configuration-application.png":::

## Automate provisioning

Using Terraform, Bicep, or Azure Resource Manager template (ARM template), you can also run a provisioning automation pipeline. This pipeline can provide a complete hands-off experience to instrument and monitor any new applications that you create and deploy.

### Automate provisioning using Terraform

To configure the environment variables in a Terraform template, add the following code to the template, replacing the *\<...>* placeholders with your own values. For more information, see [Manages an Active Azure Spring Apps Deployment](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/spring_cloud_active_deployment).

```terraform
environment_variables = {
  "DT_TENANT": "<your-environment-ID>",
  "DT_TENANTTOKEN": "<your-tenant-token>",
  "DT_CONNECTION_POINT": "<your-communication-endpoint>",
  "DT_CLUSTER_ID": "<your-cluster-ID>"
}
```

### Automate provisioning using a Bicep file

To configure the environment variables in a Bicep file, add the following code to the file, replacing the *\<...>* placeholders with your own values. For more information, see [Microsoft.AppPlatform Spring/apps/deployments](/azure/templates/microsoft.appplatform/spring/apps/deployments?tabs=bicep).

```bicep
environmentVariables: {
  DT_TENANT: '<your-environment-ID>'
  DT_TENANTTOKEN: '<your-tenant-token>'
  DT_CONNECTION_POINT: '<your-communication-endpoint>'
  DT_CLUSTER_ID: '<your-cluster-ID>'
}
```

### Automate provisioning using an ARM template

To configure the environment variables in an ARM template, add the following code to the template, replacing the *\<...>* placeholders with your own values. For more information, see [Microsoft.AppPlatform Spring/apps/deployments](/azure/templates/microsoft.appplatform/spring/apps/deployments?tabs=json).

```json
"environmentVariables": {
  "DT_TENANT": "<your-environment-ID>",
  "DT_TENANTTOKEN": "<your-tenant-token>",
  "DT_CONNECTION_POINT": "<your-communication-endpoint>",
  "DT_CLUSTER_ID": "<your-cluster-ID>"
}
```

## View reports in Dynatrace

This section describes how to find various reports in Dynatrace.

> [!NOTE]
> The Dynatrace menu and user interface will evolve gradually. For this reason, the dashboard may be moved to other sections in the Dynatrace website, and the following screenshots may not reflect the current version of the user interface.

After you add the environment variables to your application, Dynatrace starts collecting data. To view reports, use the [Dynatrace menu](https://www.dynatrace.com/support/help/get-started/navigation/), go to **Services**, and then select your application.

You can find the **Service flow** from **\<your-app-name>/Details/Service flow**:

:::image type="content" source="media/dynatrace-oneagent/spring-cloud-dynatrace-app-flow.png" alt-text="Screenshot of the Dynatrace 'Service flow' report." lightbox="media/dynatrace-oneagent/spring-cloud-dynatrace-app-flow.png":::

You can find the **Method hotspots** from **\<your-app-name>/Details/Method hotspots**:

:::image type="content" source="media/dynatrace-oneagent/spring-cloud-dynatrace-hotspots.png" alt-text="Screenshot of the 'Method hotspots' report." lightbox="media/dynatrace-oneagent/spring-cloud-dynatrace-hotspots.png":::

You can find the **Database statements** from **\<your-app-name>/Details/Response time analysis**:

:::image type="content" source="media/dynatrace-oneagent/spring-cloud-dynatrace-database-contribution.png" alt-text="Screenshot of the 'Response time analysis' report and the 'Database statements' section." lightbox="media/dynatrace-oneagent/spring-cloud-dynatrace-database-contribution.png":::

Next, go to the **Multidimensional analysis** section.

You can find the **Top database statements** from **Multidimensional analysis/Top database statements**:

:::image type="content" source="media/dynatrace-oneagent/spring-cloud-dynatrace-top-database.png" alt-text="Screenshot of the 'Top database statements' report." lightbox="media/dynatrace-oneagent/spring-cloud-dynatrace-top-database.png":::

You can find the **Exceptions overview** from **Multidimensional analysis/Exceptions overview**:

:::image type="content" source="media/dynatrace-oneagent/spring-cloud-dynatrace-exception-analysis.png" alt-text="Screenshot of the 'Exceptions overview' report." lightbox="media/dynatrace-oneagent/spring-cloud-dynatrace-exception-analysis.png":::

Next, go to the **Profiling and optimization** section.

You can find the **CPU analysis** from **Profiling and optimization/CPU analysis**:

:::image type="content" source="media/dynatrace-oneagent/spring-cloud-dynatrace-cpu-analysis.png" alt-text="Screenshot of the 'C P U analysis' report." lightbox="media/dynatrace-oneagent/spring-cloud-dynatrace-cpu-analysis.png":::

Next, go to the **Databases** section.

You can find **Backtrace** from **Databases/Details/Backtrace**:

:::image type="content" source="media/dynatrace-oneagent/spring-cloud-dynatrace-database-backtrace.png" alt-text="Screenshot of the Backtrace report." lightbox="media/dynatrace-oneagent/spring-cloud-dynatrace-database-backtrace.png":::

## View Dynatrace OneAgent logs

By default, Azure Spring Apps will print the *info* level logs of the Dynatrace OneAgent to `STDOUT`. The logs will be mixed with the application logs. You can find the explicit agent version from the application logs.

You can also get the logs of the Dynatrace agent from the following locations:

* Azure Spring Apps logs
* Azure Spring Apps Application Insights
* Azure Spring Apps LogStream

You can apply some environment variables provided by Dynatrace to configure logging for the Dynatrace OneAgent. For example, `DT_LOGLEVELCON` controls the level of logs.

> [!CAUTION]
> We strongly recommend that you do not override the default logging behavior provided by Azure Spring Apps for Dynatrace. If you do, the logging scenarios above will be blocked, and the log file(s) may be lost. For example, you should not output the `DT_LOGLEVELFILE` environment variable to your applications.

## Dynatrace OneAgent upgrade

The Dynatrace OneAgent auto-upgrade is disabled and will be upgraded quarterly with the JDK. Agent upgrade may affect the following scenarios:

* Existing applications using Dynatrace OneAgent before upgrade will be unchanged, but will require restart or redeploy to engage the new version of Dynatrace OneAgent.
* Applications created after upgrade will use the new version of Dynatrace OneAgent.

## Virtual network injection instance outbound traffic configuration

For a virtual network injection instance of Azure Spring Apps, you need to make sure the outbound traffic for Dynatrace communication endpoints is configured correctly for Dynatrace OneAgent. For information about how to get `communicationEndpoints`, see [Deployment API - GET connectivity information for OneAgent](https://www.dynatrace.com/support/help/dynatrace-api/environment-api/deployment/oneagent/get-connectivity-info/). For more information, see [Customer responsibilities for running Azure Spring Apps in a virtual network](vnet-customer-responsibilities.md).

## Dynatrace support model

For information about limitations when deploying Dynatrace OneAgent in application-only mode, see the [Cloud application platforms](https://www.dynatrace.com/support/help/technology-support/oneagent-platform-and-capability-support-matrix/#cloud-application-platforms) section of [OneAgent platform and capability support matrix](https://www.dynatrace.com/support/help/technology-support/oneagent-platform-and-capability-support-matrix).

## Next steps

* [Use distributed tracing with Azure Spring Apps](how-to-distributed-tracing.md)
