---
title: How to Use Tanzu Build Service in Azure Spring Apps Enterprise Tier
titleSuffix: Azure Spring Apps Enterprise Tier
description: Learn how to Use Tanzu Build Service in Azure Spring Apps Enterprise Tier
author: karlerickson
ms.author: fenzho
ms.service: spring-apps
ms.topic: how-to
ms.date: 09/23/2022
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# Use Tanzu Build Service

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article describes the extra configuration and functionality included in VMware Tanzu® Build Service™ with Azure Spring Apps Enterprise Tier.

In Azure Spring Apps, the existing Standard tier already supports compiling user source code into [OCI images](https://opencontainers.org/) through [Kpack](https://github.com/pivotal/kpack). Kpack is a Kubernetes (K8s) implementation of [Cloud Native Buildpacks (CNB)](https://buildpacks.io/) provided by VMware. This article provides details about the extra configurations and functionality exposed in the Azure Spring Apps Enterprise tier.

## Build Agent Pool

Tanzu Build Service in the Enterprise tier is the entry point to containerize user applications from both source code and artifacts. There's a dedicated build agent pool that reserves compute resources for a given number of concurrent build tasks. The build agent pool prevents resource contention with your running apps. You can configure the number of resources given to the build agent pool when you create a new service instance of Azure Spring Apps using the **VMware Tanzu settings**.

:::image type="content" source="media/how-to-enterprise-build-service/agent-pool.png" alt-text="Screenshot of Azure portal showing the Azure Spring Apps Create page with VMware Tanzu settings highlighted and Allocated Resources dropdown showing." lightbox="media/how-to-enterprise-build-service/agent-pool.png":::

The following Build Agent Pool scale set sizes are available:

| Scale Set | CPU/Gi        |
|-----------|---------------|
| S1        | 2 vCPU, 4 Gi  |
| S2        | 3 vCPU, 6 Gi  |
| S3        | 4 vCPU, 8 Gi  |
| S4        | 5 vCPU, 10 Gi |
| S5        | 6 vCPU, 12 Gi |

The following image shows the resources given to the Tanzu Build Service Agent Pool after you've successfully provisioned the service instance. You can also update the configured agent pool size on the **Build Service** page after you've created the service instance.

:::image type="content" source="media/how-to-enterprise-build-service/agent-pool-size.png" alt-text="Screenshot of Azure portal showing the Azure Spring Apps Build Service page with General info highlighted." lightbox="media/how-to-enterprise-build-service/agent-pool-size.png":::

## Default Builder and Tanzu Buildpacks

In the Enterprise Tier, a default builder is provided within Tanzu Build Service with a list of commercial VMware Tanzu® Buildpacks.

Tanzu Buildpacks make it easier to integrate with other software like New Relic. They're configured as optional and will only run with proper configuration. For more information, see the [Buildpack bindings](#buildpack-bindings) section.

The following list shows the Tanzu Buildpacks available in Azure Spring Apps Enterprise edition:

- tanzu-buildpacks/java-azure
- tanzu-buildpacks/dotnet-core
- tanzu-buildpacks/go
- tanzu-buildpacks/nodejs
- tanzu-buildpacks/python

## Build apps using a custom builder

Besides the `default` builder, you can also create custom builders with the provided buildpacks.

All the builders configured in a Spring Cloud Service instance are listed in the **Build Service** section under **VMware Tanzu components**.

:::image type="content" source="media/how-to-enterprise-build-service/builder-list.png" alt-text="Screenshot of Azure portal showing the Build Service page with list of configured builders." lightbox="media/how-to-enterprise-build-service/builder-list.png":::

Select **Add** to create a new builder. The image below shows the resources you should use to create the custom builder.

:::image type="content" source="media/how-to-enterprise-build-service/builder-create.png" alt-text="Screenshot of Azure portal showing the Add Builder pane." lightbox="media/how-to-enterprise-build-service/builder-create.png":::

You can also edit a custom builder when the builder isn't used in a deployment. You can update the buildpacks or the [OS Stack](https://docs.pivotal.io/tanzu-buildpacks/stacks.html), but the builder name is read only.

:::image type="content" source="media/how-to-enterprise-build-service/builder-edit.png" alt-text="Screenshot of Azure portal showing the Build Service page with builders list and context menu showing the Edit Builder command." lightbox="media/how-to-enterprise-build-service/builder-edit.png":::

You can delete any custom builder when the builder isn't used in a deployment, but the `default` builder is read only.

When you deploy an app, you can build the app by specifying a specific builder in the command:

```azurecli
az spring app deploy \
    --name <app-name> \
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
```

If the builder isn't specified, the `default` builder will be used. The builder is a resource that continuously contributes to your deployments. The builder provides the latest runtime images and latest buildpacks, including the latest APM agents and so on. When you use a builder to deploy the app, the builder and the bindings under the builder aren't allowed to edit and delete. To apply changes to a builder, save the configuration as a new builder. To delete a builder, remove the deployments that use the builder first.

You can also configure the build environment and build resources by using the following command:

```azurecli
az spring app deploy \
    --name <app-name> \
    --build-env <key1=value1>, <key2=value2> \
    --build-cpu <build-cpu-size> \
    --build-memory <build-memory-size> \
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
```

If you're using the `tanzu-buildpacks/java-azure` buildpack, we recommend that you set the `BP_JVM_VERSION` environment variable in the `build-env` argument.

When you use a custom builder in an app deployment, the builder can't make edits and deletions. If you want to change the configuration, create a new builder. Use the new builder to deploy the app.

After you deploy the app with the new builder, the deployment is linked to the new builder. You can then migrate the deployments under the previous builder to the new builder, and make edits and deletions.

## Real-time build logs

A build task will be triggered when an app is deployed from an Azure CLI command. Build logs are streamed in real time as part of the CLI command output. For information on using build logs to diagnose problems, see [Analyze logs and metrics with diagnostics settings](./diagnostic-services.md) .

## Buildpack bindings

You can configure Kpack Images with Service Bindings as described in the [Cloud Native Buildpacks Bindings specification](https://github.com/buildpacks/spec/blob/adbc70f5672e474e984b77921c708e1475e163c1/extensions/bindings.md). Azure Spring Apps Enterprise tier uses Service Bindings to integrate with [Tanzu Partner Buildpacks](https://docs.pivotal.io/tanzu-buildpacks/partner-integrations/partner-integration-buildpacks.html). For example, we use Binding to integrate [Azure Application Insights](../azure-monitor/app/app-insights-overview.md) using the [Paketo Azure Application Insights Buildpack](https://github.com/paketo-buildpacks/azure-application-insights).

Currently, buildpack binding only supports binding the buildpacks listed below. Follow the documentation links listed under each type to configure the properties and secrets for buildpack binding.

- ApplicationInsights

  - [Monitor Apps with Application Insights](./how-to-application-insights.md).

- NewRelic

  - [New Relic Partner Buildpack](https://docs.pivotal.io/tanzu-buildpacks/partner-integrations/partner-integration-buildpacks.html#new-relic).
  - [New Relic Environment Variables](https://docs.newrelic.com/docs/apm/agents/java-agent/configuration/java-agent-configuration-config-file/#Environment_Variables).

- Dynatrace

  - [Dynatrace Partner Buildpack](https://docs.pivotal.io/tanzu-buildpacks/partner-integrations/partner-integration-buildpacks.html#dynatrace).
  - [Determine the values for the required environment variables](https://www.dynatrace.com/support/help/shortlink/azure-spring#envvar).

- AppDynamics

  - [AppDynamic Partner Buildpack](https://docs.pivotal.io/tanzu-buildpacks/partner-integrations/partner-integration-buildpacks.html#appdynamics).
  - [Configure Using the Environment Variables](https://docs.appdynamics.com/21.11/en/application-monitoring/install-app-server-agents/java-agent/monitor-azure-spring-cloud-with-java-agent#MonitorAzureSpringCloudwithJavaAgent-ConfigureUsingtheEnvironmentVariablesorSystemProperties).

- ElasticAPM

  - [ElasticAPM Partner Buildpack](https://docs.pivotal.io/tanzu-buildpacks/partner-integrations/partner-integration-buildpacks.html#elastic-apm).
  - [Elastic Configuration](https://www.elastic.co/guide/en/apm/agent/java/master/configuration.html).

Not all Tanzu Buildpacks support all service binding types. The following table shows the binding types that are supported by Tanzu Buildpacks and Tanzu Partner Buildpacks.

|Buildpack|ApplicationInsights|NewRelic|AppDynamics|Dynatrace|ElasticAPM|
|---------|-------------------|--------|-----------|---------|----------|
|Java  |✅|✅|✅|✅|✅|
|Dotnet|❌|❌|❌|✅|❌|
|Go    |❌|❌|❌|✅|❌|
|Python|❌|❌|❌|❌|❌|
|NodeJS|❌|✅|✅|✅|✅|

To edit service bindings for the builder, select **Edit**. After a builder is bound to the service bindings, the service bindings are enabled for an app deployed with the builder.

:::image type="content" source="media/how-to-enterprise-build-service/edit-binding.png" alt-text="Screenshot of Azure portal showing the Build Service page with the Edit binding link highlighted." lightbox="media/how-to-enterprise-build-service/edit-binding.png":::

> [!NOTE]
> When configuring environment variables for APM bindings, use key names without a prefix. For example, do not use a `DT_` prefix for a Dynatrace binding. Tanzu APM buildpacks will transform the key name to the original environment variable name with a prefix.

## Manage buildpack bindings

You can manage buildpack bindings with the Azure portal or the Azure CLI.

> [!NOTE]
> You can only manage buildpack bindings when the parent builder isn't used by any app deployments. To create, update, or delete buildpack bindings of an existing builder, create a new builder and configure new buildpack bindings there.

### [Portal](#tab/azure-portal)

### View buildpack bindings using the Azure portal

Follow these steps to view the current buildpack bindings:

1. Open the [Azure portal](https://portal.azure.com/?AppPlatformExtension=entdf#home).
1. Select **Build Service**.
1. Select **Edit** under the **Bindings** column to view the bindings configured under a builder.
  
:::image type="content" source="media/how-to-enterprise-build-service/edit-binding.png" alt-text="Screenshot of Azure portal showing the Build Service page with the Edit binding link highlighted." lightbox="media/how-to-enterprise-build-service/edit-binding.png":::

:::image type="content" source="media/how-to-enterprise-build-service/show-service-binding.png" alt-text="Screenshot of Azure portal showing the Edit bindings for default builder pane.":::

### Create a buildpack binding

To create a buildpack binding, select **Unbound** on the **Edit Bindings** page, specify binding properties, and then select **Save**.

### Unbind a buildpack binding

You can unbind a buildpack binding by using the **Unbind binding** command, or by editing binding properties.

To use the **Unbind binding** command, select the **Bound** hyperlink, and then select **Unbind binding**.

:::image type="content" source="media/how-to-enterprise-build-service/unbind-binding-command.png" alt-text="Screenshot of Azure portal showing the Unbind binding command.":::

To unbind a buildpack binding by editing binding properties, select **Edit Binding**, and then select **Unbind**.

:::image type="content" source="media/how-to-enterprise-build-service/unbind-binding-properties.png" alt-text="Screenshot of Azure portal showing binding properties.":::

When you unbind a binding, the bind status changes from **Bound** to **Unbound**.

### [Azure CLI](#tab/azure-cli)

### View buildpack bindings using the Azure CLI

View the current buildpack bindings using the following command:

```azurecli
az spring build-service builder buildpack-binding list \
    --resource-group <your-resource-group-name> \
    --service <your-service-instance-name> \
    --builder-name <your-builder-name>
```

### Create a binding

Use this command to change the binding from **Unbound** to **Bound** status:

```azurecli
az spring build-service builder buildpack-binding create \
    --resource-group <your-resource-group-name> \
    --service <your-service-instance-name> \
    --name <your-buildpack-binding-name> \
    --builder-name <your-builder-name> \
    --type <your-binding-type> \
    --properties a=b c=d \
    --secrets e=f g=h
```

For information on the `properties` and `secrets` parameters for your buildpack, see the [Buildpack bindings](#buildpack-bindings) section.

### Show the details for a specific binding

You can view the details of a specific binding using the following command:

```azurecli
az spring build-service builder buildpack-binding show \
    --resource-group <your-resource-group-name> \
    --service <your-service-instance-name> \
    --name <your-buildpack-binding-name> \
    --builder-name <your-builder-name>
```

### Edit the properties of a binding

You can change a binding's properties using the following command:

```azurecli
az spring build-service builder buildpack-binding set \
    --resource-group <your-resource-group-name> \
    --service <your-service-instance-name> \
    --name <your-buildpack-binding-name> \
    --builder-name <your-builder-name> \
    --type <your-binding-type> \
    --properties a=b c=d \
    --secrets e=f2 g=h
```

For more information on the `properties` and `secrets` parameters for your buildpack, see the [Buildpack bindings](#buildpack-bindings) section.

### Delete a binding

Use the following command to change the binding status from **Bound** to **Unbound**.

```azurecli
az spring build-service builder buildpack-binding delete \
    --resource-group <your-resource-group-name> \
    --service <your-service-instance-name> \
    --name <your-buildpack-binding-name> \
    --builder-name <your-builder-name>
```

---

## Next steps

- [Azure Spring Apps](index.yml)
