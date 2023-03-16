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

From [Build Service on demand](how-to-enterprise-build-service.md#build-service-on-demand) section, we know that an Enterprise tier service instance can enable or disable build service. Select enable/disable build service tab in below section for more details.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise tier instance. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise tier](quickstart-deploy-apps-enterprise.md).
- [Azure CLI](/cli/azure/install-azure-cli), version 2.45.0 or higher.

## Supported scenarios - APM and CA certificates integration

### [Enable Build Service](#tab/enable-build-service)
Azure Spring Apps Enterprise tier service enabled build service uses buildpack bindings to integrate with [Tanzu Partner Buildpacks](https://docs.pivotal.io/tanzu-buildpacks/partner-integrations/partner-integration-buildpacks.html) and other Cloud Native Buildpack like [ca-certificate buildpack](https://github.com/paketo-buildpacks/ca-certificates).

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

When enable build service, the APM and CA Certificate are integrated with a builder, see below [Manage APM integration and CA certificates in Azure Spring Apps](#manage-apm-integration-and-ca-certificates-in-azure-spring-apps) section.

For build service with **Azure Spring Apps managed container registry**, you can build an app to an image and then only be able to deploy it to current service instance. 
You can use `az spring app deploy --builder <builder-name>` command to integrate APM and CA Certificates into your deployments.
```azurecli
az spring app deploy \
    --name <app-name> \
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
```

For build service with **user managed container registry**, you can build an app into a container image and deploy the image to this or other services.
It separates `build command` and `deploy command`. You can use `build command` to create or update a build with a builder, then use `deploy command` to deploy container image to the service. Please note that: in this case, you need specify APM required environment variables on deployment.
```azurecli
// build an image
az spring build-service build <create|update> \
    --name <app-name> \ 
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>

// deploy with a container image, use --env to configure runtime environment
az spring app deploy \
   --name <your-app-name> \
   --container-image <your-container-image> \
   --container-registry <your-container-registry> \
   --registry-password <your-password> \
   --registry-username <your-username> \
   --env NEW_RELIC_APP_NAME=<your-app-name> NEW_RELIC_LICENSE_KEY=<your-license-key>
```

#### Use Application Insights

The following languages are supported:

- Java

The following list shows the required environment variables for buildpack binding:

- `connection-string`

Upper-case keys are allowed, and you can also replace `_` with `-`.

The following list shows the required environment variables for deploy an app with a custom image:
- `APPLICATIONINSIGHTS_CONNECTION_STRING`

For other supported environment variables, see [Application Insights Overview](../azure-monitor/app/app-insights-overview.md?tabs=net).

#### Use Dynatrace

The following languages are supported:

- Java
- .NET
- Go
- Node.js
- WebServers

The following list shows the required environment for buildpack binding:
- `api-url` or `environment-id` (used in build step)
- `api-token` (used in build step)
- `TENANT`
- `TENANTTOKEN`
- `CONNECTION_POINT`

The following list shows the required environment variables for deploy an app with a custom image:
- `DT_TENANT`
- `DT_TENANTTOKEN`
- `DT_CONNECTION_POINT`

For other supported environment variables, see [Dynatrace Environment Variables](https://www.dynatrace.com/support/help/shortlink/azure-spring#envvar).

#### Use New Relic

The following languages are supported:

- Java
- Node.js

The following list shows the required environment variables for buildpack binding:
- `license_key`
- `app_name`

The following list shows the required environment variables for deploy an app with a custom image:
- `NEW_RELIC_LICENSE_KEY`
- `NEW_RELIC_APP_NAME`

For other supported environment variables, see [New Relic Environment Variables](https://docs.newrelic.com/docs/apm/agents/java-agent/configuration/java-agent-configuration-config-file/#Environment_Variables).

#### Use ElasticAPM

The following languages are supported:

- Java
- Node.js

The following list shows the required environment variables for buildpack binding:
- `service_name`
- `application_packages`
- `server_url`

The following list shows the required environment variables for deploy an app with a custom image:
- `ELASTIC_APM_SERVICE_NAME`
- `ELASTIC_APM_APPLICATION_PACKAGES`
- `ELASTIC_APM_SERVER_URL`

For other supported environment variables, see [Elastic Environment Variables](https://www.elastic.co/guide/en/apm/agent/java/master/configuration.html).

#### Use AppDynamics

The following languages are supported:

- Java
- Node.js

The following list shows the required environment variables for buildpack binding:
- `agent_application_name`
- `agent_tier_name`
- `agent_node_name`
- `agent_account_name`
- `agent_account_access_key`
- `controller_host_name`
- `controller_ssl_enabled`
- `controller_port`

The following list shows the required environment variables for deploy an app with a custom image:
- `APPDYNAMICS_AGENT_APPLICATION_NAME`
- `APPDYNAMICS_AGENT_TIER_NAME`
- `APPDYNAMICS_AGENT_NODE_NAME`
- `APPDYNAMICS_AGENT_ACCOUNT_NAME`
- `APPDYNAMICS_AGENT_ACCOUNT_ACCESS_KEY`
- `APPDYNAMICS_CONTROLLER_HOST_NAME`
- `APPDYNAMICS_CONTROLLER_SSL_ENABLED`
- `APPDYNAMICS_CONTROLLER_PORT`

For other supported environment variables, see [AppDynamics Environment Variables](https://docs.appdynamics.com/21.11/en/application-monitoring/install-app-server-agents/java-agent/monitor-azure-spring-cloud-with-java-agent#MonitorAzureSpringCloudwithJavaAgent-ConfigureUsingtheEnvironmentVariablesorSystemProperties).

#### Use CA certificates

CA certificates use [ca-certificate buildpack](https://github.com/paketo-buildpacks/ca-certificates) to support providing CA certificates to the system trust store at build and runtime.

In Azure Spring Apps Enterprise tier, the CA certificates will use the **Public Key Certificates** tab on the **TLS/SSL settings** page in the Azure portal, as shown in the following screenshot:

:::image type="content" source="media/how-to-enterprise-build-service/public-key-certificates.png" alt-text="Screenshot of Azure portal showing the public key certificates in SSL/TLS setting page." lightbox="media/how-to-enterprise-build-service/public-key-certificates.png":::

You can configure the CA certificates on the **Edit binding** page. The `succeeded` certificates are shown in the **CA Certificates** list.

:::image type="content" source="media/how-to-enterprise-build-service/ca-certificates-buildpack-binding.png" alt-text="Screenshot of Azure portal showing edit CA Certificates buildpack binding." lightbox="media/how-to-enterprise-build-service/ca-certificates-buildpack-binding.png":::

### [Disable Build Service](#tab/disable-build-service)

If the service **disable build service**, then only [deploy an application with a custom image](how-to-deploy-with-custom-container-image.md) is accepted.

From [Build and Deploy polyglot apps](how-to-enterprise-deploy-polyglot-apps.md#build-and-deploy-polyglot-apps), we know that if an Azure Spring Apps enterprise service instance enabled build service with a user container registry, then you can build a container image for an app from source code or artifact and deploy it to other service instances.

This section is suitable for this case: 

1. For one enterprise tier service instance, you enable build service with user container registry and build an artifact-file/source-code with APM or CA certificate into a container image.
2. In current service instance, you hope to deploy an app with the container image in your registry and make the APM or CA certificate work.

Due to it only support custom image, then you should use `--env` to configure runtime environment when deploying it. For example:

```azurecli
az spring app deploy \
   --resource-group <your-resource-group> \
   --name <your-app-name> \
   --container-image <your-container-image> \
   --service <your-service-name> \
   --container-registry <your-container-registry> \
   --registry-password <your-password> \
   --registry-username <your-username> \
   --env NEW_RELIC_APP_NAME=<your-app-name> NEW_RELIC_LICENSE_KEY=<your-license-key>
```

#### Use Application Insights

The following languages are supported:

- Java

The following list shows the required runtime environment variables:

- `APPLICATIONINSIGHTS_CONNECTION_STRING`

For other supported environment variables, see [Application Insights Overview](../azure-monitor/app/app-insights-overview.md?tabs=net).

#### Use Dynatrace

The following languages are supported:

- Java
- .NET
- Go
- Node.js
- WebServers

The following list shows the required runtime environment variables:
- `DT_TENANT`
- `DT_TENANTTOKEN`
- `DT_CONNECTION_POINT`

For other supported environment variables, see [Dynatrace Environment Variables](https://www.dynatrace.com/support/help/shortlink/azure-spring#envvar).

#### Use New Relic

The following languages are supported:

- Java
- Node.js

The following list shows the required runtime environment variables:

- `NEW_RELIC_LICENSE_KEY`
- `NEW_RELIC_APP_NAME`

For other supported environment variables, see [New Relic Environment Variables](https://docs.newrelic.com/docs/apm/agents/java-agent/configuration/java-agent-configuration-config-file/#Environment_Variables).

#### Use ElasticAPM

The following languages are supported:

- Java
- Node.js

The following list shows the required runtime environment variables:

- `ELASTIC_APM_SERVICE_NAME`
- `ELASTIC_APM_APPLICATION_PACKAGES`
- `ELASTIC_APM_SERVER_URL`

For other supported environment variables, see [Elastic Environment Variables](https://www.elastic.co/guide/en/apm/agent/java/master/configuration.html).

#### Use AppDynamics

The following languages are supported:

- Java
- Node.js

The following list shows the required runtime environment variables:

- `APPDYNAMICS_AGENT_APPLICATION_NAME`
- `APPDYNAMICS_AGENT_TIER_NAME`
- `APPDYNAMICS_AGENT_NODE_NAME`
- `APPDYNAMICS_AGENT_ACCOUNT_NAME`
- `APPDYNAMICS_AGENT_ACCOUNT_ACCESS_KEY`
- `APPDYNAMICS_CONTROLLER_HOST_NAME`
- `APPDYNAMICS_CONTROLLER_SSL_ENABLED`
- `APPDYNAMICS_CONTROLLER_PORT`

For other supported environment variables, see [AppDynamics Environment Variables](https://docs.appdynamics.com/21.11/en/application-monitoring/install-app-server-agents/java-agent/monitor-azure-spring-cloud-with-java-agent#MonitorAzureSpringCloudwithJavaAgent-ConfigureUsingtheEnvironmentVariablesorSystemProperties).

---

## Manage APM integration and CA certificates in Azure Spring Apps

This section is only suitable for a service instance enabled build service, if it disables build service, skip it.

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