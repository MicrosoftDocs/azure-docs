---
title: How to configure APM integration and CA certificates
titleSuffix: Azure Spring Apps Enterprise tier
description: How to configure APM integration and CA certificates
author: karlerickson
ms.author: fenzho
ms.service: spring-apps
ms.topic: how-to
ms.date: 01/13/2023
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# How to configure APM integration and CA certificates

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to configure application performance monitor (APM) integration and certificate authority (CA) certificates in Azure Spring Apps Enterprise tier.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise tier instance. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise tier](quickstart-deploy-apps-enterprise.md).

## Supported scenarios - APM and CA certificates integration

Azure Spring Apps Enterprise tier uses buildpack bindings to integrate with [Tanzu Partner Buildpacks](https://docs.pivotal.io/tanzu-buildpacks/partner-integrations/partner-integration-buildpacks.html) and other Cloud Native Buildpack like [ca-certificate buildpack](https://github.com/paketo-buildpacks/ca-certificates).

Currently, the following APM types and CA certificates are supported:

- [ApplicationInsights](#use-application-insights)
- [Dynatrace](#use-dynatrace)
- [AppDynamics](#use-appdynamics)
- [NewRelic](#use-new-relic)
- [ElasticAPM](#use-elasticapm)
- [CA certificates](#use-ca-certificates)

CA Certificates are supported for all language family buildpacks, but not all supported APMs. The following table shows the binding types supported by Tanzu language family buildpacks.

| Buildpack                                             | ApplicationInsights | NewRelic | AppDynamics | Dynatrace | ElasticAPM |
|-------------------------------------------------------|---------------------|----------|-------------|-----------|------------|
| Java                                                  | ✅                  | ✅      | ✅          | ✅       | ✅         |
| Dotnet                                                | ❌                  | ❌      | ❌          | ✅       | ❌         |
| Go                                                    | ❌                  | ❌      | ❌          | ✅       | ❌         |
| Python                                                | ❌                  | ❌      | ❌          | ❌       | ❌         |
| NodeJS                                                | ❌                  | ✅      | ✅          | ✅       | ✅         |
| [WebServers](how-to-enterprise-deploy-static-file.md) | ❌                  | ❌      | ❌          | ✅       | ❌         |

### Use Application Insights

The following languages are supported:

- Java

The following list shows the required environment variables:

- `connection-string`
- `sampling-percentage`

Upper-case keys are allowed, and you can also replace `_` with `-`.

For other supported environment variables, see [Application Insights Overview](../azure-monitor/app/app-insights-overview.md?tabs=net).

### Use Dynatrace

The following languages are supported:

- Java
- .NET
- Go
- Node.js
- WebServers

The following list shows the required environment variables:

- `api-url` or `environment-id` (used in build step)
- `api-token` (used in build step)
- `TENANT`
- `TENANTTOKEN`
- `CONNECTION_POINT`

For other supported environment variables, see [Dynatrace Environment Variables](https://www.dynatrace.com/support/help/shortlink/azure-spring#envvar).

### Use New Relic

The following languages are supported:

- Java
- Node.js

The following list shows the required environment variables:

- `license_key`
- `app_name`

For other supported environment variables, see [New Relic Environment Variables](https://docs.newrelic.com/docs/apm/agents/java-agent/configuration/java-agent-configuration-config-file/#Environment_Variables).

### Use ElasticAPM

The following languages are supported:

- Java
- Node.js

The following list shows the required environment variables:

- `service_name`
- `application_packages`
- `server_url`

For other supported environment variables, see [Elastic Environment Variables](https://www.elastic.co/guide/en/apm/agent/java/master/configuration.html).

### Use AppDynamics

The following languages are supported:

- Java
- Node.js

The following list shows the required environment variables:

- `agent_application_name`
- `agent_tier_name`
- `agent_node_name`
- `agent_account_name`
- `agent_account_access_key`
- `controller_host_name`
- `controller_ssl_enabled`
- `controller_port`

For other supported environment variables, see [AppDynamics Environment Variables](https://docs.appdynamics.com/21.11/en/application-monitoring/install-app-server-agents/java-agent/monitor-azure-spring-cloud-with-java-agent#MonitorAzureSpringCloudwithJavaAgent-ConfigureUsingtheEnvironmentVariablesorSystemProperties).

### Use CA certificates

CA certificates use [ca-certificate buildpack](https://github.com/paketo-buildpacks/ca-certificates) to support providing CA certificates to the system trust store at build and runtime.

In Azure Spring Apps Enterprise tier, the CA certificates will use the **Public Key Certificates** tab on the **TLS/SSL settings** page in the Azure portal, as shown in the following screenshot:

:::image type="content" source="media/how-to-enterprise-build-service/public-key-certificates.png" alt-text="Screenshot of Azure portal showing the public key certificates in SSL/TLS setting page." lightbox="media/how-to-enterprise-build-service/public-key-certificates.png":::

You can configure the CA certificates on the **Edit binding** page. The `succeeded` certificates are shown in the **CA Certificates** list.

:::image type="content" source="media/how-to-enterprise-build-service/ca-certificates-buildpack-binding.png" alt-text="Screenshot of Azure portal showing edit CA Certificates buildpack binding." lightbox="media/how-to-enterprise-build-service/ca-certificates-buildpack-binding.png":::

## Manage APM integration and CA certificates in Azure Spring Apps

In the current context, one buildpack binding means either credential configuration against one APM type, or CA certificates configuration against the CA Certificates type. For APM integration, follow the earlier instructions configure the necessary environment variables or secrets for your APM.

To edit buildpack bindings for the builder, select **Edit**. After a builder is bound to the buildpack bindings, the buildpack bindings are enabled for an app deployed with the builder.

:::image type="content" source="media/how-to-enterprise-build-service/edit-binding.png" alt-text="Screenshot of Azure portal showing the Build Service page with the Edit binding link highlighted." lightbox="media/how-to-enterprise-build-service/edit-binding.png":::

> [!NOTE]
> When configuring environment variables for APM bindings, use key names without a prefix. For example, do not use a `DT_` prefix for a Dynatrace binding or `APPLICATIONINSIGHTS_` for Application Insights. Tanzu APM buildpacks will transform the key name to the original environment variable name with a prefix.

You can manage buildpack bindings with the Azure portal or the Azure CLI.

### [Azure portal](#tab/azure-portal)

### View buildpack bindings using the Azure portal

Follow these steps to view the current buildpack bindings:

1. Open the [Azure portal](https://portal.azure.com/?AppPlatformExtension=entdf#home).
1. Select **Build Service**.
1. Select **Edit** under the **Bindings** column to view the bindings configured under a builder.

:::image type="content" source="media/how-to-enterprise-build-service/edit-binding.png" alt-text="Screenshot of Azure portal showing the Build Service page with the Edit binding link highlighted." lightbox="media/how-to-enterprise-build-service/edit-binding.png":::

:::image type="content" source="media/how-to-enterprise-build-service/show-service-binding.png" alt-text="Screenshot of Azure portal showing the Edit bindings for default builder pane.":::

### Create a buildpack binding

To create a buildpack binding, select **Unbound** on the **Edit Bindings** page, specify the binding properties, and then select **Save**.

### Unbind a buildpack binding

You can unbind a buildpack binding by using the **Unbind binding** command, or by editing the binding properties.

To use the **Unbind binding** command, select the **Bound** hyperlink, and then select **Unbind binding**.

:::image type="content" source="media/how-to-enterprise-build-service/unbind-binding-command.png" alt-text="Screenshot of Azure portal showing the Unbind binding command.":::

To unbind a buildpack binding by editing binding properties, select **Edit Binding**, and then select **Unbind**.

:::image type="content" source="media/how-to-enterprise-build-service/unbind-binding-properties.png" alt-text="Screenshot of Azure portal showing binding properties.":::

When you unbind a binding, the bind status changes from **Bound** to **Unbound**.

### [Azure CLI](#tab/azure-cli)

### View buildpack bindings using the Azure CLI

View the current buildpack bindings by using the following command:

```azurecli
az spring build-service builder buildpack-binding list \
    --resource-group <your-resource-group-name> \
    --service <your-service-instance-name> \
    --builder-name <your-builder-name>
```

### Create a binding

Use this command to change the binding from *Unbound* to *Bound* status:

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

You can view the details of a specific binding by using the following command:

```azurecli
az spring build-service builder buildpack-binding show \
    --resource-group <your-resource-group-name> \
    --service <your-service-instance-name> \
    --name <your-buildpack-binding-name> \
    --builder-name <your-builder-name>
```

### Edit the properties of a binding

You can change a binding's properties by using the following command:

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

Use the following command to change the binding status from *Bound* to *Unbound*.

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