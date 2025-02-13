---
title:  "How to Monitor Spring Boot Apps with the AppDynamics Java Agent (Preview)"
titleSuffix: Azure Spring Apps
description: How to use the AppDynamics Java agent to monitor Spring Boot applications in Azure Spring Apps.
author: KarlErickson
ms.author: jiec
ms.service: azure-spring-apps
ms.topic: how-to
ms.date: 04/23/2024
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli
ms.devlang: azurecli
---

# How to monitor Spring Boot apps with the AppDynamics Java Agent

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Standard consumption and dedicated (Preview) ✅ Basic/Standard ❎️ Enterprise

This article explains how to use the AppDynamics Java Agent to monitor Spring Boot applications in Azure Spring Apps.

With the AppDynamics Java Agent, you can:

- Monitor applications
- Configure the AppDynamics Java Agent using environment variables
- Check all monitoring data from the AppDynamics dashboard

The following video introduces the AppDynamics Java in-process agent.

<br>

> [!VIDEO https://www.youtube.com/embed/4dZuRX5bNAs]

## Prerequisites

* [Azure CLI](/cli/azure/install-azure-cli)
* [An AppDynamics account](https://www.appdynamics.com/)

## Activate the AppDynamics Java in-process agent

For the whole workflow, you need to:

* Activate the AppDynamics Java in-process agent in Azure Spring Apps to generate application metrics data.
* Connect the AppDynamics Agent to the AppDynamics Controller to collect and visualize the data in the controller.

:::image type="content" source="media/how-to-appdynamics-java-agent-monitor/appdynamics-activation.jpg" alt-text="Diagram that shows AppDynamics Agent with two-way arrow to Spring Boot Apps in Azure Spring Apps and arrow pointing to AppDynamics Agent." border="false":::

### Activate an application with the AppDynamics Agent using the Azure CLI

To activate an application through the Azure CLI, use the following steps.

1. Create a resource group.
1. Create an instance of Azure Spring Apps.
1. Create an application using the following command. Replace the placeholders `<...>` with your own values.

    ```azurecli
    az spring app create \
        --resource-group "<your-resource-group-name>" \
        --service "<your-Azure-Spring-Apps-instance-name>" \
        --name "<your-app-name>" \
        --is-public true
    ```

1. Create a deployment with the AppDynamics Agent using environment variables.

    ```azurecli
    az spring app deploy \
        --resource-group "<your-resource-group-name>" \
        --service "<your-Azure-Spring-Apps-instance-name>" \
        --name "<your-app-name>" \
        --artifact-path app.jar \
        --jvm-options="-javaagent:/opt/agents/appdynamics/java/javaagent.jar" \
        --env APPDYNAMICS_AGENT_APPLICATION_NAME=<your-app-name> \
              APPDYNAMICS_AGENT_ACCOUNT_ACCESS_KEY=<your-agent-access-key> \
              APPDYNAMICS_AGENT_ACCOUNT_NAME=<your-agent-account-name> \
              APPDYNAMICS_JAVA_AGENT_REUSE_NODE_NAME=true \
              APPDYNAMICS_JAVA_AGENT_REUSE_NODE_NAME_PREFIX=<your-agent-node-name> \
              APPDYNAMICS_AGENT_TIER_NAME=<your-agent-tier-name> \
              APPDYNAMICS_CONTROLLER_HOST_NAME=<your-AppDynamics-controller-host-name> \
              APPDYNAMICS_CONTROLLER_SSL_ENABLED=true \
              APPDYNAMICS_CONTROLLER_PORT=443
    ```

Azure Spring Apps pre-installs the AppDynamics Java agent to the path **/opt/agents/appdynamics/java/javaagent.jar**. You can activate the agent from your applications' JVM options, then configure the agent using environment variables. You can find values for these variables at [Monitor Azure Spring Apps with Java Agent](https://docs.appdynamics.com/appd/24.x/24.3/en/application-monitoring/install-app-server-agents/java-agent/monitor-azure-spring-cloud-with-java-agent). For more information about how these variables help to view and organize reports in the AppDynamics UI, see [Tiers and Nodes](https://docs.appdynamics.com/appd/24.x/24.3/en/application-monitoring/tiers-and-nodes).

### Activate an application with the AppDynamics Agent using the Azure portal

To activate an application through the Azure portal, use the following steps.

1. Navigate to your Azure Spring Apps instance in the Azure portal.

1. Select **Apps** in the **Settings** section of the navigation pane.

   :::image type="content" source="media/how-to-appdynamics-java-agent-monitor/azure-spring-cloud-app-list.png" alt-text="Screenshot of the Azure portal that shows the Apps page for an Azure Spring Apps instance." lightbox="media/how-to-appdynamics-java-agent-monitor/azure-spring-cloud-app-list.png":::

1. Select the app, and then select **Configuration** in the navigation pane.

1. Use the **General settings** tab to update values such as the JVM options.

   :::image type="content" source="media/how-to-appdynamics-java-agent-monitor/azure-spring-cloud-app-configuration-general.png" alt-text="Screenshot of the Azure portal that shows the Configuration page for an app in an Azure Spring Apps instance, with the General settings tab selected." lightbox="media/how-to-appdynamics-java-agent-monitor/azure-spring-cloud-app-configuration-general.png":::

1. Select **Environment variables** to add or update the variables used by your application.

   :::image type="content" source="media/how-to-appdynamics-java-agent-monitor/azure-spring-cloud-app-configuration-env.png" alt-text="Screenshot of the Azure portal that shows the Configuration page with the Environment variables tab selected." lightbox="media/how-to-appdynamics-java-agent-monitor/azure-spring-cloud-app-configuration-env.png":::

## Automate provisioning

You can also run a provisioning automation pipeline using Terraform, Bicep, or Azure Resource Manager template (ARM template). This pipeline can provide a complete hands-off experience to instrument and monitor any new applications that you create and deploy.

### Automate provisioning using Terraform

To configure the environment variables in a Terraform template, add the following code to the template, replacing the `<...>` placeholders with your own values. For more information, see [Manages an Active Azure Spring Apps Deployment](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/spring_cloud_active_deployment).

```terraform
resource "azurerm_spring_cloud_java_deployment" "example" {
  ...
  jvm_options = "-javaagent:/opt/agents/appdynamics/java/javaagent.jar"
  ...
    environment_variables = {
      "APPDYNAMICS_AGENT_APPLICATION_NAME" : "<your-app-name>",
      "APPDYNAMICS_AGENT_ACCOUNT_ACCESS_KEY" : "<your-agent-access-key>",
      "APPDYNAMICS_AGENT_ACCOUNT_NAME" : "<your-agent-account-name>",
      "APPDYNAMICS_JAVA_AGENT_REUSE_NODE_NAME" : "true",
      "APPDYNAMICS_JAVA_AGENT_REUSE_NODE_NAME_PREFIX" : "<your-agent-node-name>",
      "APPDYNAMICS_AGENT_TIER_NAME" : "<your-agent-tier-name>",
      "APPDYNAMICS_CONTROLLER_HOST_NAME" : "<your-AppDynamics-controller-host-name>",
      "APPDYNAMICS_CONTROLLER_SSL_ENABLED" : "true",
      "APPDYNAMICS_CONTROLLER_PORT" : "443"
  }
}
```

### Automate provisioning using Bicep

To configure the environment variables in a Bicep file, add the following code to the file, replacing the `<...>` placeholders with your own values. For more information, see [Microsoft.AppPlatform Spring/apps/deployments](/azure/templates/microsoft.appplatform/spring/apps/deployments?tabs=bicep).

```bicep
deploymentSettings: {
  environmentVariables: {
    APPDYNAMICS_AGENT_APPLICATION_NAME : '<your-app-name>'
    APPDYNAMICS_AGENT_ACCOUNT_ACCESS_KEY : '<your-agent-access-key>'
    APPDYNAMICS_AGENT_ACCOUNT_NAME : '<your-agent-account-name>'
    APPDYNAMICS_JAVA_AGENT_REUSE_NODE_NAME : 'true'
    APPDYNAMICS_JAVA_AGENT_REUSE_NODE_NAME_PREFIX : '<your-agent-node-name>'
    APPDYNAMICS_AGENT_TIER_NAME : '<your-agent-tier-name>'
    APPDYNAMICS_CONTROLLER_HOST_NAME : '<your-AppDynamics-controller-host-name>'
    APPDYNAMICS_CONTROLLER_SSL_ENABLED : 'true'
    APPDYNAMICS_CONTROLLER_PORT : '443'
  }
  jvmOptions: '-javaagent:/opt/agents/appdynamics/java/javaagent.jar'
}
```

### Automate provisioning using an ARM template

To configure the environment variables in an ARM template, add the following code to the template, replacing the `<...>` placeholders with your own values. For more information, see [Microsoft.AppPlatform Spring/apps/deployments](/azure/templates/microsoft.appplatform/spring/apps/deployments?tabs=json).

```JSON
"deploymentSettings": {
  "environmentVariables": {
    "APPDYNAMICS_AGENT_APPLICATION_NAME" : "<your-app-name>",
    "APPDYNAMICS_AGENT_ACCOUNT_ACCESS_KEY" : "<your-agent-access-key>",
    "APPDYNAMICS_AGENT_ACCOUNT_NAME" : "<your-agent-account-name>",
    "APPDYNAMICS_JAVA_AGENT_REUSE_NODE_NAME" : "true",
    "APPDYNAMICS_JAVA_AGENT_REUSE_NODE_NAME_PREFIX" : "<your-agent-node-name>",
    "APPDYNAMICS_AGENT_TIER_NAME" : "<your-agent-tier-name>",
    "APPDYNAMICS_CONTROLLER_HOST_NAME" : "<your-AppDynamics-controller-host-name>",
    "APPDYNAMICS_CONTROLLER_SSL_ENABLED" : "true",
    "APPDYNAMICS_CONTROLLER_PORT" : "443"
  },
  "jvmOptions": "-javaagent:/opt/agents/appdynamics/java/javaagent.jar",
  ...
}
```

## Review reports in the AppDynamics dashboard

This section shows various reports in AppDynamics.

The following screenshot shows an overview of your apps in the AppDynamics dashboard:

:::image type="content" source="media/how-to-appdynamics-java-agent-monitor/appdynamics-dashboard-birds-eye-view-of-apps.jpg" alt-text="Screenshot of AppDynamics that shows the Applications dashboard." lightbox="media/how-to-appdynamics-java-agent-monitor/appdynamics-dashboard-birds-eye-view-of-apps.jpg":::

The **Applications** tab shows the overall information for each of your apps, as shown in the following screenshots using example applications:

- `api-gateway`

   :::image type="content" source="media/how-to-appdynamics-java-agent-monitor/appdynamics-dashboard-api-gateway.jpg" alt-text="Screenshot of AppDynamics that shows the Application dashboard for the example api-gateway app." lightbox="media/how-to-appdynamics-java-agent-monitor/appdynamics-dashboard-api-gateway.jpg":::

- `customers-service`

   :::image type="content" source="media/how-to-appdynamics-java-agent-monitor/appdynamics-dashboard-customers-service.jpg" alt-text="Screenshot of AppDynamics that shows the Application dashboard for the example customers-service app." lightbox="media/how-to-appdynamics-java-agent-monitor/appdynamics-dashboard-customers-service.jpg":::

The following screenshot shows how you can get basic information from the **Database Calls** dashboard.

:::image type="content" source="media/how-to-appdynamics-java-agent-monitor/appdynamics-dashboard-customer-service-db-calls.jpg" alt-text="Screenshot of AppDynamics that shows the Database Calls dashboard." lightbox="media/how-to-appdynamics-java-agent-monitor/appdynamics-dashboard-customer-service-db-calls.jpg":::

You can also get information about the slowest database calls, as shown in these screenshots:

:::image type="content" source="media/how-to-appdynamics-java-agent-monitor/appdynamics-dashboard-slowest-db-calls-from-customers-service.jpg" alt-text="Screenshot of AppDynamics that shows the Slowest Database Calls page." lightbox="media/how-to-appdynamics-java-agent-monitor/appdynamics-dashboard-slowest-db-calls-from-customers-service.jpg":::

:::image type="content" source="media/how-to-appdynamics-java-agent-monitor/appdynamics-dashboard-slowest-db-calls-from-customers-service-2.jpg" alt-text="Screenshot of AppDynamics that shows the Correlated Snapshots page accessed from the Slowest Database Calls page." lightbox="media/how-to-appdynamics-java-agent-monitor/appdynamics-dashboard-slowest-db-calls-from-customers-service-2.jpg":::

The following screenshot shows memory usage analysis in the **Heap** section of the **Memory** page:

:::image type="content" source="media/how-to-appdynamics-java-agent-monitor/appdynamics-dashboard-customers-service-memory-usage.jpg" alt-text="Screenshot of AppDynamics that shows the Heap section of the Memory page." lightbox="media/how-to-appdynamics-java-agent-monitor/appdynamics-dashboard-customers-service-memory-usage.jpg":::

You can also see the garbage collection process, as shown in this screenshot:

:::image type="content" source="media/how-to-appdynamics-java-agent-monitor/appdynamics-dashboard-customers-service-garbage-collection.jpg" alt-text="Screenshot of AppDynamics that shows the Garbage Collection section of the Memory page." lightbox="media/how-to-appdynamics-java-agent-monitor/appdynamics-dashboard-customers-service-garbage-collection.jpg":::

The following screenshot shows the **Slow Transactions** page:

:::image type="content" source="media/how-to-appdynamics-java-agent-monitor/appdynamics-dashboard-customers-service-slowest-transactions.jpg" alt-text="Screenshot of AppDynamics that shows the Slow Transactions page." lightbox="media/how-to-appdynamics-java-agent-monitor/appdynamics-dashboard-customers-service-slowest-transactions.jpg":::

You can define more metrics for the JVM, as shown in this screenshot of the **Metric Browser**:

:::image type="content" source="media/how-to-appdynamics-java-agent-monitor/appdynamics-dashboard-customers-service-jvm-metric-browser.jpg" alt-text="Screenshot of AppDynamics that shows the Metric Browser." lightbox="media/how-to-appdynamics-java-agent-monitor/appdynamics-dashboard-customers-service-jvm-metric-browser.jpg":::

## View AppDynamics Agent logs

By default, Azure Spring Apps prints the *info* level logs of the AppDynamics Agent to `STDOUT`. The logs are mixed with the application logs. You can find the explicit agent version from the application logs.

You can also get the logs of the AppDynamics Agent from the following locations:

* Azure Spring Apps logs
* Azure Spring Apps Application Insights
* Azure Spring Apps LogStream

## Learn about AppDynamics Agent upgrade

The AppDynamics Agent is upgraded regularly with JDK (quarterly). Agent upgrade might affect the following scenarios:

- Existing applications using AppDynamics Agent before upgrade are unchanged, but require restart or redeploy to engage the new version of AppDynamics Agent.
- Applications created after upgrade use the new version of AppDynamics Agent.

## Configure virtual network injection instance outbound traffic

For virtual network injection instances of Azure Spring Apps, make sure the outbound traffic is configured correctly for AppDynamics Agent. For details, see [Cisco AppDynamics SaaS Domains and IP Ranges](https://docs.appdynamics.com/paa/en/cisco-appdynamics-saas-domains-and-ip-ranges) and [Customer responsibilities for running Azure Spring Apps in a virtual network](vnet-customer-responsibilities.md).

## Understand the limitations

To understand the limitations of the AppDynamics Agent, see [Monitor Azure Spring Apps with Java Agent](https://docs.appdynamics.com/appd/24.x/24.3/en/application-monitoring/install-app-server-agents/java-agent/monitor-azure-spring-cloud-with-java-agent).

## Next steps

[Use Application Insights Java In-Process Agent in Azure Spring Apps](how-to-application-insights.md?pivots=sc-standard)
