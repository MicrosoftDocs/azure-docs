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

This article shows you how to configure Application Performance Monitor (APM) integration and certificate authority (CA) certificates in Azure Spring Apps Enterprise tier.

You can enable and disable Tanzu Build Service on an Enterprise tier service instance. For more information, see the [Build Service on demand](how-to-enterprise-build-service.md#build-service-on-demand) section of [Use Tanzu Build Service](how-to-enterprise-build-service.md).

Select enable/disable Build Service tab in the following section for more details.

## Prerequisites

- An Azure Spring Apps Enterprise tier instance. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise tier](quickstart-deploy-apps-enterprise.md).
- [Azure CLI](/cli/azure/install-azure-cli), version 2.45.0 or higher.

## Supported scenarios - APM and CA certificates integration

### [Enable Build Service](#tab/enable-build-service)

Tanzu Build Service on the Azure Spring Apps Enterprise tier is enabled by default and uses buildpack binding to integrate with [Tanzu Partner Buildpacks](https://docs.pivotal.io/tanzu-buildpacks/partner-integrations/partner-integration-buildpacks.html) and other cloud native buildpacks such as [ca-certificate buildpack](https://github.com/paketo-buildpacks/ca-certificates).

Currently, the following APM types and CA certificates are supported:

- ApplicationInsights
- Dynatrace
- AppDynamics
- New Relic
- ElasticAPM
- [CA certificates](#use-ca-certificates)

See the section [Supported APM resources with Build Service enabled](#supported-apm-resources-with-build-service-enabled) for support information.

CA Certificates are supported for all language family buildpacks, but not all supported APMs. The following table shows the binding types supported by Tanzu language family buildpacks.

| Buildpack  | ApplicationInsights | New Relic | AppDynamics | Dynatrace | ElasticAPM |
|------------|---------------------|-----------|-------------|-----------|------------|
| Java       | ✔                  | ✔         | ✔          | ✔         | ✔         |
| Dotnet     |                     |           |             | ✔        |            |
| Go         |                     |           |             | ✔        |            |
| Python     |                     |           |             |           |            |
| NodeJS     |                     | ✔        | ✔           | ✔        | ✔          |
| WebServers |                     |           |             | ✔        |            |

For information about using WebServers, see [Deploy web static files](how-to-enterprise-deploy-static-file.md)

When you enable Build Service, the APM and CA Certificate are integrated with a builder, as described in the [Manage APM integration and CA certificates in Azure Spring Apps](#manage-apm-integration-and-ca-certificates-in-azure-spring-apps) section.

For Build Service that uses an Azure Spring Apps managed container registry, you can build an application to an image and then deploy it but only within the current Azure Spring Apps service instance.

Use the following command to integrate APM and CA Certificates into your deployments:

```azurecli
az spring app deploy \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <app-name> \
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
```

If you provide your own container registry to use with Build Service, you can build an application into a container image and deploy the image to the current or other Azure Spring Apps service instances.

Providing your own container registry separates `build command` and `deploy command`. You can use `build command` to create or update a build with a builder, then use `deploy command` to deploy the container image to the service. In this case, you need specify APM required environment variables on deployment.

Use the following command to build an image:

```azurecli
az spring build-service build <create|update> \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <app-name> \ 
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
```

Use the following command to deploy with a container image, using `--env` to configure runtime environment.

```azurelci
az spring app deploy \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <your-app-name> \
    --container-image <your-container-image> \
    --container-registry <your-container-registry> \
    --registry-password <your-password> \
    --registry-username <your-username> \
    --env NEW_RELIC_APP_NAME=<your-app-name> NEW_RELIC_LICENSE_KEY=<your-license-key>
```

#### Supported APM resources with Build Service enabled

This section lists the supported languages and required variables for Application Performance Monitoring that you can use for your integrations. Listed are the supported languages, required environment variables for buildpack binding, required environment variables for deploying an application with a custom image, notes, and links to information on supported variables.

- **Application Insights**

  Supported languages:
  - Java
  
  Environment variables required - buildpack binding:
  - `connection-string`

  Environment variables required - deploying with custom image:
  - `APPLICATIONINSIGHTS_CONNECTION_STRING`
  
  Notes:
  - Upper-case keys are allowed, and you can replace underscores (`_`) with hyphens (`-`).

  More information:
  - [Application Insights Overview](../azure-monitor/app/app-insights-overview.md?tabs=net).

- **DynaTrace**

  Supported languages:
  - Java
  - .NET
  - Go
  - Node.js
  - WebServers
  
  Environment variables required - buildpack binding:
  - `api-url` or `environment-id` (used in build step)
  - `api-token` (used in build step)
  - `TENANT`
  - `TENANTTOKEN`
  - `CONNECTION_POINT`

  Environment variables required - deploying with custom image:
  - `DT_TENANT`
  - `DT_TENANTTOKEN`
  - `DT_CONNECTION_POINT`
  
  More variable information:
  - [Dynatrace Environment Variables](https://www.dynatrace.com/support/help/shortlink/azure-spring#envvar)

- **New Relic**

  Supported languages:
  - Java
  - Node.js
  
  Environment variables required - buildpack binding:
  - `license_key`
  - `app_name`

  Environment variables required - deploying with custom image:
  - `NEW_RELIC_LICENSE_KEY`
  - `NEW_RELIC_APP_NAME`
  
  More variable information:
  - [New Relic Environment Variables](https://docs.newrelic.com/docs/apm/agents/java-agent/configuration/java-agent-configuration-config-file/#Environment_Variables)

- **ElasticAPM**

  Supported languages:
  - Java
  - Node.js
  
  Environment variables required - buildpack binding:
  - `service_name`
  - `application_packages`
  - `server_url`

  Environment variables required - deploying with custom image:
  - `ELASTIC_APM_SERVICE_NAME`
  - `ELASTIC_APM_APPLICATION_PACKAGES`
  - `ELASTIC_APM_SERVER_URL`
  
  More variable information:
  - [Elastic Environment Variables](https://www.elastic.co/guide/en/apm/agent/java/master/configuration.html)

- **AppDynamics**

  Supported languages:
  - Java
  - Node.js
  
  Environment variables required - buildpack binding:
  - `agent_application_name`
  - `agent_tier_name`
  - `agent_node_name`
  - `agent_account_name`
  - `agent_account_access_key`
  - `controller_host_name`
  - `controller_ssl_enabled`
  - `controller_port`

  Environment variables required - deploying with custom image:
  - `APPDYNAMICS_AGENT_APPLICATION_NAME`
  - `APPDYNAMICS_AGENT_TIER_NAME`
  - `APPDYNAMICS_AGENT_NODE_NAME`
  - `APPDYNAMICS_AGENT_ACCOUNT_NAME`
  - `APPDYNAMICS_AGENT_ACCOUNT_ACCESS_KEY`
  - `APPDYNAMICS_CONTROLLER_HOST_NAME`
  - `APPDYNAMICS_CONTROLLER_SSL_ENABLED`
  - `APPDYNAMICS_CONTROLLER_PORT`
  
  More variable information:
- [AppDynamics Environment Variables](https://docs.appdynamics.com/21.11/en/application-monitoring/install-app-server-agents/java-agent/monitor-azure-spring-cloud-with-java-agent#MonitorAzureSpringCloudwithJavaAgent-ConfigureUsingtheEnvironmentVariablesorSystemProperties)

#### Use CA certificates

You can use the [ca-certificate buildpack](https://github.com/paketo-buildpacks/ca-certificates) to support providing CA certificates to the system trust store at build and runtime.

In Azure Spring Apps Enterprise tier, the CA certificates use the **Public Key Certificates** tab on the **TLS/SSL settings** page in the Azure portal, as shown in the following screenshot:

:::image type="content" source=" media/how-to-enterprise-configure-apm-intergration-and-ca-certificates/public-key-certificates.png" alt-text="Screenshot of Azure portal showing the public key certificates in SSL/TLS setting page." lightbox=" media/how-to-enterprise-configure-apm-intergration-and-ca-certificates/public-key-certificates.png":::

You can configure the CA certificates on the Build Service **Edit binding** page. The following screenshot shows selecting a certificate to configure binding from the `succeeded` certificates in the **CA Certificates** list:

:::image type="content" source=" media/how-to-enterprise-configure-apm-intergration-and-ca-certificates/ca-certificates-buildpack-binding.png" alt-text="Screenshot of Azure portal showing edit CA Certificates buildpack binding." lightbox=" media/how-to-enterprise-configure-apm-intergration-and-ca-certificates/ca-certificates-buildpack-binding.png":::

### [Disable Build Service](#tab/disable-build-service)

If Build Service is disabled, you can only deploy an application with an image. For more information, see [Deploy an application with a custom container image](how-to-deploy-with-custom-container-image.md).

If an Azure Spring Apps enterprise service instance has Build Service enabled with a user container registry, then you can build a container image for an application from source code or artifact and deploy it to other service instances. For more information, see, the [Build and Deploy polyglot apps](how-to-enterprise-deploy-polyglot-apps.md#build-and-deploy-polyglot-apps), section of [How to deploy polyglot apps in Azure Spring Apps Enterprise tier](How-to-enterprise-deploy-polyglot-apps.md)

You can implement the following scenario for two Azure Spring Apps Enterprise instances:

- For one instance, you can enable Build Service with a user container registry and build an artifact-file/source-code with APM or CA certificate into a container image.

- In the current instance with Build Service disabled, you can deploy an application with the container image in your registry and make the APM or CA certificate work.

Due to the deployment supporting only a custom image, you must use the `--env` parameter to configure the runtime environment when deploying it. The following command provides an example:

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

### Supported APM resources with Build Service disabled

This section lists the supported languages and required variables for Application Performance Monitoring that you can use for your integrations. Listed are the supported languages, required runtime environment variables and links to information on supported variables.

- **Application Insights**

  Supported languages:
  - Java
  
  Required runtime environment variables:
  - `APPLICATIONINSIGHTS_CONNECTION_STRING`

  More variable information:
  - [Application Insights Overview](../azure-monitor/app/app-insights-overview.md?tabs=net)

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

  More variable information:
  - [Dynatrace Environment Variables](https://www.dynatrace.com/support/help/shortlink/azure-spring#envvar)

- **New Relic**

  Supported languages:
  - Java
  - Node.js
  
  Required runtime environment variables:
  - `NEW_RELIC_LICENSE_KEY`
  - `NEW_RELIC_APP_NAME`
  
  More variable information:
  - [New Relic Environment Variables](https://docs.newrelic.com/docs/apm/agents/java-agent/configuration/java-agent-configuration-config-file/#Environment_Variables)

- **ElasticAPM**

  Supported languages:
  - Java
  - Node.js
  
  Required runtime environment variables:
  - `ELASTIC_APM_SERVICE_NAME`
  - `ELASTIC_APM_APPLICATION_PACKAGES`
  - `ELASTIC_APM_SERVER_URL`
  
  More variable information:
  - [Elastic Environment Variables](https://www.elastic.co/guide/en/apm/agent/java/master/configuration.html)

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
  
  More variable information:
  - [AppDynamics Environment Variables](https://docs.appdynamics.com/21.11/en/application-monitoring/install-app-server-agents/java-agent/monitor-azure-spring-cloud-with-java-agent#MonitorAzureSpringCloudwithJavaAgent-ConfigureUsingtheEnvironmentVariablesorSystemProperties)

---

## Manage APM integration and CA certificates in Azure Spring Apps

This section applies to an Azure Spring Apps Enterprise service instance with Build Service enabled.
With Build Service enabled, one buildpack binding means either credential configuration against one APM type, or CA certificates configuration against the CA Certificates type. For APM integration, follow the earlier instructions configure the necessary environment variables or secrets for your APM.

> [!NOTE]
> When configuring environment variables for APM bindings, use key names without a prefix. For example, do not use a `DT_` prefix for a Dynatrace binding or `APPLICATIONINSIGHTS_` for Application Insights. Tanzu APM buildpacks will transform the key name to the original environment variable name with a prefix.

You can manage buildpack bindings with the Azure portal or the Azure CLI.

### [Azure portal](#tab/azure-portal)

To edit buildpack bindings using the Azure portal, use the following steps:

1. In the Azure portal, go to your Azure Spring Apps Enterprise service instance.
1. In the navigation pane, select **Build Service**.
1. On the **Build Service** page, for **Bindings** select **Edit**.

   After a builder is bound to the buildpack bindings, the buildpack bindings are enabled for an app deployed with the builder.

   :::image type="content" source=" media/how-to-enterprise-configure-apm-intergration-and-ca-certificates/edit-binding.png" alt-text="Screenshot of Azure portal showing the Build Service page with the Bindings Edit option highlighted." lightbox=" media/how-to-enterprise-configure-apm-intergration-and-ca-certificates/edit-binding.png":::

1. The **Edit binding for default builder** page displays.

   :::image type="content" source=" media/how-to-enterprise-configure-apm-intergration-and-ca-certificates/show-service-binding.png" alt-text="Screenshot of Azure portal showing the Edit bindings for default builder page.":::

   You can do the following binding tasks:

   - Create a buildpack binding
     Select a **Binding type** that has a status of **Unbound**, and then select **Edit Binding** from the context menu and specify the binding properties.
   - Unbind a buildpack binding
     Select a **Binding type** that has a status of **Bound** and then select **Unbind binding** from the context menu.

   :::image type="content" source=" media/how-to-enterprise-configure-apm-intergration-and-ca-certificates/unbind-binding-command.png" alt-text="Screenshot of Azure portal showing the Edit bindings for default builder page with the Unbind binding option highlighted.":::

   To unbind a buildpack binding by editing binding properties, select **Edit Binding**, and then select **Unbind**.

   :::image type="content" source=" media/how-to-enterprise-configure-apm-intergration-and-ca-certificates/unbind-binding-properties.png" alt-text="Screenshot of Azure portal showing the Edit binding page with the Unbind button highlighted.":::

When you unbind a binding, the bind status changes from **Bound** to **Unbound**.

### [Azure CLI](#tab/azure-cli)

You can view and edit binding using the Azure CLI.

1. Use the following command to view the current buildpack bindings:

   ```azurecli
   az spring build-service builder buildpack-binding list \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-instance-name> \
       --builder-name <your-builder-name>
   ```

1. Use the following command to change the binding from *Unbound* to *Bound* status:

   ```azurecli
   az spring build-service builder buildpack-binding create \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-instance-name> \
       --name <your-buildpack-binding-name> \
       --builder-name <your-builder-name> \
       --type <your-binding-type> \
       --properties a=b c=d \
       --secrets e=f g=h
   ```

   For information on the `properties` and `secrets` parameters for your buildpack, see the [Supported Scenarios - APM and CA Certificates Integration](#supported-scenarios---apm-and-ca-certificates-integration) section.

1. Use the following command to view the details of a specific binding:

   ```azurecli
   az spring build-service builder buildpack-binding show \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-instance-name> \
       --name <your-buildpack-binding-name> \
       --builder-name <your-builder-name>
   ```

1. Use the following command to change a binding's properties:

   ```azurecli
   az spring build-service builder buildpack-binding set \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-instance-name> \
       --name <your-buildpack-binding-name> \
       --builder-name <your-builder-name> \
       --type <your-binding-type> \
       --properties a=b c=d \
       --secrets e=f2 g=h
   ```

   For more information on the `properties` and `secrets` parameters for your buildpack, see the [Supported Scenarios - APM and CA Certificates Integration](#supported-scenarios---apm-and-ca-certificates-integration) section.

1. Use the following command to change the binding status from *Bound* to *Unbound*.

   ```azurecli
   az spring build-service builder buildpack-binding delete \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-instance-name> \
       --name <your-buildpack-binding-name> \
       --builder-name <your-builder-name>
   ```

---

## Next steps

- [Azure Spring Apps](index.yml)