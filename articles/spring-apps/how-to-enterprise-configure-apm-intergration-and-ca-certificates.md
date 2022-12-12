---
title: How to configure APM integration and CA certificates
titleSuffix: Azure Spring Apps Enterprise Tier
description: How to configure APM integration and CA certificates
author: karlerickson
ms.author: fenzho
ms.service: spring-apps
ms.topic: how-to
ms.date: 12/23/2022
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# How to configure APM integration and CA certificates

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to configure APM integration and CA certificates in Azure Spring Apps Enterprise tier.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise tier instance. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise tier](quickstart-deploy-apps-enterprise.md).

## Supported Scenarios - APM and CA Certificates Integration
Azure Spring Apps Enterprise tier uses buildpack bindings to integrate with [Tanzu Partner Buildpacks](https://docs.pivotal.io/tanzu-buildpacks/partner-integrations/partner-integration-buildpacks.html) and other Cloud Native Buildpack like [ca-certificate buildpack](https://github.com/paketo-buildpacks/ca-certificates).

Currently, below APM types and CA certificates are supported:
- [ApplicationInsights](#use-application-insights)
- [Dynatrace](#use-dynatrace)
- [AppDynamics](#use-appdynamics)
- [NewRelic](#use-new-relic)
- [ElasticAPM](#use-elasticapm)
- [CACertificates](#use-ca-certificates)

CA Certificates is supported for all language family buildpacks, but not all support APMs. The following table shows the binding types that are supported by Tanzu language family buildpacks.

|Buildpack|ApplicationInsights|NewRelic|AppDynamics|Dynatrace|ElasticAPM|
|---------|-------------------|--------|-----------|---------|----------|
|Java  | ✅|✅|✅|✅|✅|
|Dotnet|❌|❌|❌|✅|❌|
|Go    |❌|❌|❌|✅|❌|
|Python|❌|❌|❌|❌|❌|
|NodeJS|❌|✅|✅|✅|✅|
|[WebServers](how-to-enterprise-deploy-static-file.md)|❌|❌|❌|✅|❌|

### Use Application Insights

| Supported Language | Required environment variables | Other environment variables| 
|-------|------|------|
| Java | 1. connection-string (Upper case key or use "_" to replace "-" is also acceptable) <br> 2. sampling-percentage | [Application Insights Overview](https://learn.microsoft.com/azure/azure-monitor/app/app-insights-overview?tabs=net)

### Use Dynatrace
| Supported Language | Required environment variables | Other environment variables| 
|-------|------|------|
| Java<br> Dotnet<br> Go<br> NodeJS<br> WebServers<br> | 1. api-url OR environment-id (used in build step) <br>  2. api-token (used in build step) <br> 3. TENANT <br> 4. TENANTTOKEN <br> 5. CONNECTION_POINT | [Dynatrace Environment Variables](https://www.dynatrace.com/support/help/shortlink/azure-spring#envvar)
  

### Use New Relic
| Supported Language | Required environment variables | Other environment variables| 
|-------|------|------|
| Java <br> NodeJS<br> | 1. license_key <br> 2. app_name <br>| [New Relic Environment Variables](https://docs.newrelic.com/docs/apm/agents/java-agent/configuration/java-agent-configuration-config-file/#Environment_Variables)

### Use ElasticAPM
| Supported Language | Required environment variables | Other environment variables| 
|-------|------|------|
| Java <br> NodeJS<br> | 1. service_name<br> 2. application_packages <br> 3. server_url | [Elastic Environment Variables](https://www.elastic.co/guide/en/apm/agent/java/master/configuration.html)

### Use AppDynamics
| Supported Language | Required environment variables | Other environment variables| 
|-------|------|------|
| Java <br> NodeJS<br> |1. agent_application_name <br> 2. agent_tier_name <br> 3. agent_node_name <br> 4. agent_account_name <br> 5. agent_account_access_key <br> 6. controller_host_name <br> 7. controller_ssl_enabled <br> 8. controller_port <br> | [AppDynamics Environment Variables](https://docs.appdynamics.com/21.11/en/application-monitoring/install-app-server-agents/java-agent/monitor-azure-spring-cloud-with-java-agent#MonitorAzureSpringCloudwithJavaAgent-ConfigureUsingtheEnvironmentVariablesorSystemProperties)

### Use CA Certificates
CA Certificates uses [ca-certificate buildpack](https://github.com/paketo-buildpacks/ca-certificates) to support providing CA certificates to the system truststore at build and runtime.

In Azure Spring Apps Enterprise tier, the CA certificates will use the `public key certificates` in `TLS/SSL settings`

:::image type="content" source="media/how-to-enterprise-build-service/public-key-certificates.png" alt-text="Screenshot of Azure portal showing the public key certificates in SSL/TLS setting page." lightbox="media/how-to-enterprise-build-service/public-key-certificates.png":::

It can be configured in `Edit binding` page. The `succeeded` certificates are shown in CA Certificates list

:::image type="content" source="media/how-to-enterprise-build-service/ca-certificates-buildpack-binding.png" alt-text="Screenshot of Azure portal showing edit CA Certificates buildpack binding." lightbox="media/how-to-enterprise-build-service/ca-certificates-buildpack-binding.png":::


## Manage APM integration and CA certificates in Azure Spring Apps
In context here, one buildpack binding means either credential configuration against one APM type, or CA certificates configuration against CA Certificates type. For APM integration, please follow above per APM instructions to configure necessary environment variables or secrets.

To edit buildpack bindings for the builder, select **Edit**. After a builder is bound to the buildpack bindings, the buildpack bindings are enabled for an app deployed with the builder.

:::image type="content" source="media/how-to-enterprise-build-service/edit-binding.png" alt-text="Screenshot of Azure portal showing the Build Service page with the Edit binding link highlighted." lightbox="media/how-to-enterprise-build-service/edit-binding.png":::

> [!NOTE]
> When configuring environment variables for APM bindings, use key names without a prefix. For example, do not use a `DT_` prefix for a Dynatrace binding or `APPLICATIONINSIGHTS_` for Application Insights.. Tanzu APM buildpacks will transform the key name to the original environment variable name with a prefix.

You can manage buildpack bindings with the Azure portal or the Azure CLI.

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

For information on the `properties` and `secrets` parameters for your buildpack, see the [Supported Scenarios - APM and CA Certificates Integration](#supported-scenarios---apm-and-ca-certificates-integration) section.

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

For more information on the `properties` and `secrets` parameters for your buildpack, see the [Supported Scenarios - APM and CA Certificates Integration](#supported-scenarios---apm-and-ca-certificates-integration) section.

### Delete a binding

Use the following command to change the binding status from **Bound** to **Unbound**.

```azurecli
az spring build-service builder buildpack-binding delete \
    --resource-group <your-resource-group-name> \
    --service <your-service-instance-name> \
    --name <your-buildpack-binding-name> \
    --builder-name <your-builder-name>
```

## Next steps

- [Azure Spring Apps](index.yml)
