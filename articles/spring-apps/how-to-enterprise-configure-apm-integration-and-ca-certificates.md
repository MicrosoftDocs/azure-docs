---
title: How to configure APM integration and CA certificates
titleSuffix: Azure Spring Apps Enterprise plan
description: Shows you how to configure APM integration and CA certificates in the Azure Spring Apps Enterprise plan.
author: karlerickson
ms.author: fenzho
ms.service: spring-apps
ms.topic: how-to
ms.date: 05/25/2023
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# How to configure APM integration and CA certificates

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This article shows you how to configure application performance monitor (APM) integration and certificate authority (CA) certificates in the Azure Spring Apps Enterprise plan.

You can enable or disable Tanzu Build Service on an Azure Springs Apps Enterprise plan instance. For more information, see the [Build service on demand](how-to-enterprise-build-service.md#build-service-on-demand) section of [Use Tanzu Build Service](how-to-enterprise-build-service.md).

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise plan instance. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md).
- [Azure CLI](/cli/azure/install-azure-cli) version 2.45.0 or higher. Use the following command to install the Azure Spring Apps extension: `az extension add --name spring`

## Supported scenarios - APM and CA certificates integration

Tanzu Build Service is enabled by default in Azure Spring Apps Enterprise. If you choose to disable the build service, you can deploy applications but only by using a custom container image. This section provides guidance for both enabled and disabled scenarios.

### [Build service enabled](#tab/enable-build-service)

Tanzu Build Service uses buildpack binding to integrate with [Tanzu Partner Buildpacks](https://docs.pivotal.io/tanzu-buildpacks/partner-integrations/partner-integration-buildpacks.html) and other cloud native buildpacks such as the [ca-certificates](https://github.com/paketo-buildpacks/ca-certificates) buildpack on GitHub.

Currently, Azure Spring Apps supports the following APM types and CA certificates:

- ApplicationInsights
- Dynatrace
- AppDynamics
- New Relic
- ElasticAPM

Azure Spring Apps supports CA certificates for all language family buildpacks, but not all supported APMs. The following table shows the binding types supported by Tanzu language family buildpacks.

| Buildpack  | ApplicationInsights | New Relic | AppDynamics | Dynatrace | ElasticAPM |
|------------|---------------------|-----------|-------------|-----------|------------|
| Java       | ✔                  | ✔         | ✔          | ✔         | ✔         |
| Dotnet     |                     |           |             | ✔        |            |
| Go         |                     |           |             | ✔        |            |
| Python     |                     |           |             |           |            |
| NodeJS     |                     | ✔        | ✔           | ✔        | ✔          |
| Web servers |                     |           |             | ✔        |            |

For information about using Web servers, see [Deploy web static files](how-to-enterprise-deploy-static-file.md).

When you enable the build service, the APM and CA Certificate are integrated with a builder, as described in the [Manage APM integration and CA certificates in Azure Spring Apps](#manage-apm-integration-and-ca-certificates-in-azure-spring-apps) section.

When the build service uses the Azure Spring Apps managed container registry, you can build an application to an image and then deploy it, but only within the current Azure Spring Apps service instance.

Use the following command to integrate APM and CA certificates into your deployments:

```azurecli
az spring app deploy \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <app-name> \
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
```

If you provide your own container registry to use with the build service, you can build an application into a container image and deploy the image to the current or other Azure Spring Apps Enterprise service instances.

Providing your own container registry separates building from deployment. You can use the build command to create or update a build with a builder, then use the deploy command to deploy the container image to the service. In this scenario, you need to specify the APM-required environment variables on deployment.

Use the following command to build an image:

```azurecli
az spring build-service build <create|update> \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <app-name> \
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
```

Use the following command to deploy with a container image, using the `--env` parameter to configure runtime environment:

```azurecli
az spring app deploy \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <app-name> \
    --container-image <your-container-image> \
    --container-registry <your-container-registry> \
    --registry-password <your-password> \
    --registry-username <your-username> \
    --env NEW_RELIC_APP_NAME=<app-name> \
          NEW_RELIC_LICENSE_KEY=<your-license-key>
```

#### Supported APM resources with the build service enabled

This section lists the supported languages and required environment variables for the APMs that you can use for your integrations.

- **Application Insights**

  Supported languages:
  - Java

  Environment variables required for buildpack binding:
  - `connection-string`

  Environment variables required for deploying an app with a custom image:
  - `APPLICATIONINSIGHTS_CONNECTION_STRING`

    > [!NOTE]
    > Upper-case keys are allowed, and you can replace underscores (`_`) with hyphens (`-`).

  For other supported environment variables, see [Application Insights Overview](../azure-monitor/app/app-insights-overview.md?tabs=java).

- **DynaTrace**

  Supported languages:
  - Java
  - .NET
  - Go
  - Node.js
  - WebServers

  Environment variables required for buildpack binding:
  - `api-url` or `environment-id` (used in build step)
  - `api-token` (used in build step)
  - `TENANT`
  - `TENANTTOKEN`
  - `CONNECTION_POINT`

  Environment variables required for deploying an app with a custom image:
  - `DT_TENANT`
  - `DT_TENANTTOKEN`
  - `DT_CONNECTION_POINT`

  For other supported environment variables, see [Dynatrace](https://www.dynatrace.com/support/help/shortlink/azure-spring#envvar)

- **New Relic**

  Supported languages:
  - Java
  - Node.js

  Environment variables required for buildpack binding:
  - `license_key`
  - `app_name`

  Environment variables required for deploying an app with a custom image:
  - `NEW_RELIC_LICENSE_KEY`
  - `NEW_RELIC_APP_NAME`

  For other supported environment variables, see [New Relic](https://docs.newrelic.com/docs/apm/agents/java-agent/configuration/java-agent-configuration-config-file/#Environment_Variables)

- **Elastic**

  Supported languages:
  - Java
  - Node.js

  Environment variables required for buildpack binding:
  - `service_name`
  - `application_packages`
  - `server_url`

  Environment variables required for deploying an app with a custom image:
  - `ELASTIC_APM_SERVICE_NAME`
  - `ELASTIC_APM_APPLICATION_PACKAGES`
  - `ELASTIC_APM_SERVER_URL`

  For other supported environment variables, see [Elastic](https://www.elastic.co/guide/en/apm/agent/java/master/configuration.html)

- **AppDynamics**

  Supported languages:
  - Java
  - Node.js

  Environment variables required for buildpack binding:
  - `agent_application_name`
  - `agent_tier_name`
  - `agent_node_name`
  - `agent_account_name`
  - `agent_account_access_key`
  - `controller_host_name`
  - `controller_ssl_enabled`
  - `controller_port`

  Environment variables required for deploying an app with a custom image:
  - `APPDYNAMICS_AGENT_APPLICATION_NAME`
  - `APPDYNAMICS_AGENT_TIER_NAME`
  - `APPDYNAMICS_AGENT_NODE_NAME`
  - `APPDYNAMICS_AGENT_ACCOUNT_NAME`
  - `APPDYNAMICS_AGENT_ACCOUNT_ACCESS_KEY`
  - `APPDYNAMICS_CONTROLLER_HOST_NAME`
  - `APPDYNAMICS_CONTROLLER_SSL_ENABLED`
  - `APPDYNAMICS_CONTROLLER_PORT`

  For other supported environment variables, see [AppDynamics](https://docs.appdynamics.com/21.11/en/application-monitoring/install-app-server-agents/java-agent/monitor-azure-spring-cloud-with-java-agent#MonitorAzureSpringCloudwithJavaAgent-ConfigureUsingtheEnvironmentVariablesorSystemProperties)

## Use CA certificates

CA certificates use the [ca-certificates](https://github.com/paketo-buildpacks/ca-certificates) buildpack to support providing CA certificates to the system trust store at build and runtime.

In the Azure Spring Apps Enterprise plan, the CA certificates use the **Public Key Certificates** tab on the **TLS/SSL settings** page in the Azure portal, as shown in the following screenshot:

:::image type="content" source="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/public-key-certificates.png" alt-text="Screenshot of the Azure portal showing the Public Key Certificates section of the TLS/SSL settings page." lightbox="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/public-key-certificates.png":::

You can configure the CA certificates on the **Edit binding** page. The `succeeded` certificates are shown in the **CA Certificates** list.

:::image type="content" source="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/ca-certificates-buildpack-binding.png" alt-text="Screenshot of the Azure portal showing the Edit bindings for default builder page with the Edit binding for CA Certificates panel open." lightbox="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/ca-certificates-buildpack-binding.png":::

### [Build service disabled](#tab/disable-build-service)

If you disable the build service, you can only deploy an application with a container image. For more information, see [Deploy an application with a custom container image](how-to-deploy-with-custom-container-image.md).

You can use multiple instances of Azure Spring Apps Enterprise, where some instances build and deploy images and others only deploy images. Consider the following scenario:

- For one instance, you enable the build service with a user container registry. Then you build from an artifact-file or source-code with APM or CA certificate into a container image and deploy to the current Azure Spring Apps instance or other service instances. For more information, see, the [Build and deploy polyglot applications](how-to-enterprise-deploy-polyglot-apps.md#build-and-deploy-polyglot-applications), section of [How to deploy polyglot apps in Azure Spring Apps Enterprise](How-to-enterprise-deploy-polyglot-apps.md).

- In another instance with the build service disabled, you deploy an application with the container image in your registry and also make use of APM and CA certificates.

Due to the deployment supporting only a custom container image, you must use the `--env` parameter to configure the runtime environment for deployment. The following command provides an example:

```azurecli
az spring app deploy \
   --resource-group <resource-group-name> \
   --service <Azure-Spring-Apps-instance-name> \
   --name <app-name> \
   --container-image <your-container-image> \
   --container-registry <your-container-registry> \
   --registry-password <your-password> \
   --registry-username <your-username> \
   --env NEW_RELIC_APP_NAME=<app-name> NEW_RELIC_LICENSE_KEY=<your-license-key>
```

### Supported APM resources with the build service disabled

This section lists the supported languages and required environment variables for the APMs that you can use for your integrations.

- **Application Insights**

  Supported languages:
  - Java

  Required runtime environment variables:
  - `APPLICATIONINSIGHTS_CONNECTION_STRING`

  For other supported environment variables, see [Application Insights Overview](../azure-monitor/app/app-insights-overview.md?tabs=java)

- **Dynatrace**

  Supported languages:
  - Java
  - .NET
  - Go
  - Node.js
  - WebServers

  Required runtime environment variables:

  - `DT_TENANT`
  - `DT_TENANTTOKEN`
  - `DT_CONNECTION_POINT`

  For other supported environment variables, see [Dynatrace](https://www.dynatrace.com/support/help/shortlink/azure-spring#envvar)

- **New Relic**

  Supported languages:
  - Java
  - Node.js

  Required runtime environment variables:
  - `NEW_RELIC_LICENSE_KEY`
  - `NEW_RELIC_APP_NAME`

  For other supported environment variables, see [New Relic](https://docs.newrelic.com/docs/apm/agents/java-agent/configuration/java-agent-configuration-config-file/#Environment_Variables)

- **ElasticAPM**

  Supported languages:
  - Java
  - Node.js

  Required runtime environment variables:
  - `ELASTIC_APM_SERVICE_NAME`
  - `ELASTIC_APM_APPLICATION_PACKAGES`
  - `ELASTIC_APM_SERVER_URL`

  For other supported environment variables, see [Elastic](https://www.elastic.co/guide/en/apm/agent/java/master/configuration.html)

- **AppDynamics**

  Supported languages:
  - Java
  - Node.js

  Required runtime environment variables:
  - `APPDYNAMICS_AGENT_APPLICATION_NAME`
  - `APPDYNAMICS_AGENT_TIER_NAME`
  - `APPDYNAMICS_AGENT_NODE_NAME`
  - `APPDYNAMICS_AGENT_ACCOUNT_NAME`
  - `APPDYNAMICS_AGENT_ACCOUNT_ACCESS_KEY`
  - `APPDYNAMICS_CONTROLLER_HOST_NAME`
  - `APPDYNAMICS_CONTROLLER_SSL_ENABLED`
  - `APPDYNAMICS_CONTROLLER_PORT`

  For other supported environment variables, see [AppDynamics](https://docs.appdynamics.com/21.11/en/application-monitoring/install-app-server-agents/java-agent/monitor-azure-spring-cloud-with-java-agent#MonitorAzureSpringCloudwithJavaAgent-ConfigureUsingtheEnvironmentVariablesorSystemProperties)

---

## Manage APM integration and CA certificates in Azure Spring Apps

This section applies only to an Azure Spring Apps Enterprise service instance with the build service enabled. With the build service enabled, one buildpack binding means either credential configuration against one APM type, or CA certificates configuration against the CA certificates type. For APM integration, follow the earlier instructions to configure the necessary environment variables or secrets for your APM.

> [!NOTE]
> When configuring environment variables for APM bindings, use key names without a prefix. For example, do not use a `DT_` prefix for a Dynatrace binding or `APPLICATIONINSIGHTS_` for Application Insights. Tanzu APM buildpacks will transform the key name to the original environment variable name with a prefix.

You can manage buildpack bindings with the Azure portal or the Azure CLI.

### [Azure portal](#tab/azure-portal)

Use the following steps to view the buildpack bindings:

1. In the Azure portal, go to your Azure Spring Apps Enterprise service instance.
1. In the navigation pane, select **Build Service**.
1. Select **Edit** under the **Bindings** column to view the bindings configured for a builder.

   :::image type="content" source="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/edit-binding.png" alt-text="Screenshot of Azure portal showing the Build Service page with the Bindings Edit link highlighted for a selected builder." lightbox="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/edit-binding.png":::

1. Review the bindings on the **Edit binding for default builder** page.

   :::image type="content" source="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/show-service-binding.png" alt-text="Screenshot of Azure portal showing the Edit bindings for default builder page with the binding types and their status listed.":::

### Create a buildpack binding

To create a buildpack binding, select **Unbound** on the **Edit Bindings** page, specify the binding properties, and then select **Save**.

### Unbind a buildpack binding

You can unbind a buildpack binding by using the **Unbind binding** command, or by editing the binding properties.

To use the **Unbind binding** command, select the **Bound** hyperlink, and then select **Unbind binding**.

:::image type="content" source="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/unbind-binding-command.png" alt-text="Screenshot of Azure portal showing the Edit bindings for default builder page with the Unbind binding option highlighted for a selected binding type." lightbox="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/unbind-binding-command.png":::

To unbind a buildpack binding by editing binding properties, select **Edit Binding**, and then select **Unbind**.

:::image type="content" source="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/unbind-binding-properties.png" alt-text="Screenshot of Azure portal showing the Edit binding page with the Unbind button highlighted." lightbox="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/unbind-binding-properties.png":::-

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

- [How to deploy polyglot apps in Azure Spring Apps Enterprise](how-to-enterprise-deploy-polyglot-apps.md)
