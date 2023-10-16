---
title: How to configure APM integration and CA certificates
titleSuffix: Azure Spring Apps Enterprise plan
description: Shows you how to configure APM integration and CA certificates in the Azure Spring Apps Enterprise plan.
author: KarlErickson
ms.author: fenzho
ms.service: spring-apps
ms.topic: how-to
ms.date: 05/25/2023
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, event-tier1-build-2022
---

# How to configure APM integration and CA certificates

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This article shows you how to configure application performance monitor (APM) integration and certificate authority (CA) certificates in the Azure Spring Apps Enterprise plan.

You can enable or disable Tanzu Build Service on an Azure Springs Apps Enterprise plan instance. For more information, see the [Build service on demand](how-to-enterprise-build-service.md#build-service-on-demand) section of [Use Tanzu Build Service](how-to-enterprise-build-service.md).

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise plan instance. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md).
- [Azure CLI](/cli/azure/install-azure-cli) version 2.49.0 or higher. Use the following command to install the Azure Spring Apps extension: `az extension add --name spring`

## Supported scenarios - APM and CA certificates integration

Tanzu Build Service uses buildpack binding to integrate with [Tanzu Partner Buildpacks](https://docs.vmware.com/en/VMware-Tanzu-Buildpacks/services/tanzu-buildpacks/GUID-partner-integrations-partner-integration-buildpacks.html) and other cloud native buildpacks such as the [ca-certificates](https://github.com/paketo-buildpacks/ca-certificates) buildpack on GitHub.

Currently, Azure Spring Apps supports the following APM types:

- ApplicationInsights
- Dynatrace
- AppDynamics
- New Relic
- ElasticAPM

Azure Spring Apps supports CA certificates for all language family buildpacks, but not all supported APMs. The following table shows the binding types supported by Tanzu language family buildpacks.

| Buildpack         | ApplicationInsights | New Relic | AppDynamics | Dynatrace | ElasticAPM |
|-------------------|---------------------|-----------|-------------|-----------|------------|
| Java              | ✔                  | ✔         | ✔          | ✔         | ✔         |
| .NET              |                     | ✔        |             | ✔         |            |
| Go                |                     |           |             | ✔        |            |
| Python            |                     |           |             |           |            |
| NodeJS            |                     | ✔        | ✔           | ✔        | ✔          |
| Web servers       |                     |           |             | ✔        |            |
| Java Native Image |                     |           |             |           |            |
| PHP               |                     | ✔         | ✔          | ✔         |            |

For information about using Web servers, see [Deploy web static files](how-to-enterprise-deploy-static-file.md).

Tanzu Build Service is enabled by default in Azure Spring Apps Enterprise. If you choose to disable the build service, you can deploy applications but only by using a custom container image. This section provides guidance for both build service enabled and disabled scenarios.

#### Supported APM types

This section lists the supported languages and required environment variables for the APMs that you can use for your integrations.

- **Application Insights**

  Supported languages:
  - Java

  Environment variables required for buildpack binding:
  - `connection-string`

  For other supported environment variables, see [Application Insights Overview](../azure-monitor/app/app-insights-overview.md?tabs=java).

- **DynaTrace**

  Supported languages:
  - Java
  - .NET
  - Go
  - Node.js
  - WebServers
  - PHP

  Environment variables required for buildpack binding:
  - `api-url` or `environment-id` (used in build step)
  - `api-token` (used in build step)
  - `TENANT`
  - `TENANTTOKEN`
  - `CONNECTION_POINT`

  For other supported environment variables, see [Dynatrace](https://www.dynatrace.com/support/help/shortlink/azure-spring#envvar)

- **New Relic**

  Supported languages:
  - Java
  - .NET
  - Node.js
  - PHP

  Environment variables required for buildpack binding:
  - `license_key`
  - `app_name`

  For other supported environment variables, see [New Relic](https://docs.newrelic.com/docs/apm/agents/java-agent/configuration/java-agent-configuration-config-file/#Environment_Variables)

- **Elastic**

  Supported languages:
  - Java
  - Node.js
  - PHP

  Environment variables required for buildpack binding:
  - `service_name`
  - `application_packages`
  - `server_url`

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

  For other supported environment variables, see [AppDynamics](https://docs.appdynamics.com/21.11/en/application-monitoring/install-app-server-agents/java-agent/monitor-azure-spring-cloud-with-java-agent#MonitorAzureSpringCloudwithJavaAgent-ConfigureUsingtheEnvironmentVariablesorSystemProperties)

## Bindings in builder is deprecated

> [!NOTE]
> Previously, you would manage APM integration and CA certificates via bindings in the builder. The bindings in builder feature is deprecated and is being removed in the future. We recommend that you migrate the APM configured in bindings. For more information, see the [Migrate the APM configured in bindings](#migrate-the-apm-configured-in-bindings) section.
>
> When you use your own container registry for the build service or disable the build service, the bindings feature in builder is not available.
>
> When you use a managed Azure Container Registry for the build service, the registry is still available for backward compatibility, but is being removed in the future.

When you use the Azure CLI to create a service instance, you might get the error message `Buildpack bindings feature is deprecated, it's not available when your own container registry is used for build service or build service is disabled`. This message indicates that you're using an old version of the Azure CLI. To fix this issue, upgrade the Azure CLI. For more information, see [How to update the Azure CLI](/cli/azure/update-azure-cli).

## Configure APM integration for app builds and deployments

You can configure APM in Azure Spring Apps in the following two ways:

- Manage APM configurations on the service instance level and bind to app builds and deployments by referring to them. This approach is the recommended way to configure APM.

- Manage APM configurations via bindings in the builder and bind to app builds and deployments by referring to the builder.

> [!NOTE]
> This approach is the old way to configure APM, and it's now deprecated. We recommend that you migrate the APM configured in bindings. For more information, see the [Migrate the APM configured in bindings](#migrate-the-apm-configured-in-bindings) section.

You can now configure APM in Azure Spring Apps by managing APM configurations on the service instance level and bind to app builds and deployments by referring to them. This approach is the recommended way to configure APM.

The following sections provide guidance for both of these approaches.

### Manage APMs on the service instance level (recommended)

You can create an APM configuration and bind to app builds and deployments, as explained in the following sections.

#### Manage APM configuration in Azure Spring Apps

You can manage APM integration by configuring properties or secrets in the APM configuration using the Azure portal or the Azure CLI.

> [!NOTE]
> When configuring properties or secrets via APM configurations, use key names without the APM name as prefix. For example, don't use a `DT_` prefix for Dynatrace or `APPLICATIONINSIGHTS_` for Application Insights. Tanzu APM buildpacks transform the key name to the original environment variable name with a prefix.
>
> If you intend to override or configure some properties or secrets, such as app name or app level, you need to set environment variables when deploying an app with the original environment variables with the APM name as prefix.

##### [Azure portal](#tab/azure-portal)

Use the following steps to show, add, edit, or delete an APM configuration:

1. Open the [Azure portal](https://portal.azure.com).
1. In the navigation pane, select **APM**.
1. To create an APM configuration, select **Add**. If you want to enable the APM configuration globally, select **Enable globally**. All the subsequent builds and deployments use the APM configuration automatically.

   :::image type="content" source="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/add-apm.png" alt-text="Screenshot of the Azure portal showing the APM configuration page with the Add button highlighted." lightbox="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/add-apm.png":::

1. To view or edit an APM configuration, select the ellipsis (**...**) button for the configuration, then select **Edit APM**.  

   :::image type="content" source="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/show-apm.png" alt-text="Screenshot of the Azure portal showing the APM configuration page with the Edit APM option selected." lightbox="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/show-apm.png":::

1. To delete an APM configuration, select the ellipsis (**...**) button for the configuration and then select **Delete**. If the APM configuration is used by any build or deployment, you aren't able to delete it.

   :::image type="content" source="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/delete-apm.png" alt-text="Screenshot of the Azure portal showing the APM configuration page with the Delete button highlighted." lightbox="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/delete-apm.png":::

Use the following steps to view the APM configurations bound to the build:

1. Navigate to the **Build Service** page for your Azure Spring Apps instance.

   :::image type="content" source="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/build-service-build.png" alt-text="Screenshot of the Azure portal showing the build service page with the current build in the list." lightbox="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/build-service-build.png":::
   
1. On the navigation pane, in the **Settings** section, select **APM bindings**.
   
1. On the **APM bindings** page, view the APM configurations bound to the build.

   :::image type="content" source="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/build-apm-bindings.png" alt-text="Screenshot of the APM bindings page showing the APM configurations bound to the build." lightbox="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/build-apm-bindings.png":::

Use the following steps to view the APM configurations bound to the deployment:

1. Navigate to your application page.
   
1. On the navigation pane, in the **Settings** section, select **APM bindings**.
   
1. On the **APM bindings** page, view the APM configurations bound to the deployment.

   :::image type="content" source="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/deployment-apm-bindings.png" alt-text="Screenshot of the APM bindings page showing the APM configurations bound to the deployment." lightbox="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/deployment-apm-bindings.png":::

##### [Azure CLI](#tab/azure-cli)

The following list shows you the Azure CLI commands you can use to manage APM configuration:

- Use the following command to list all the APM configurations:

  ```azurecli
  az spring apm list \
      --resource-group <resource-group-name> \
      --service <Azure-Spring-Apps-instance-name> 
  ```

- Use the following command to list all the supported APM types:

  ```azurecli
  az spring apm list-support-types \
      --resource-group <resource-group-name> \
      --service <Azure-Spring-Apps-instance-name>
  ```

- Use the following command to create an APM configuration:

  ```azurecli
  az spring apm create \
      --resource-group <resource-group-name> \
      --service <Azure-Spring-Apps-instance-name> \
      --name <your-APM-name> \
      --type <your-APM-type> \
      --properties a=b c=d \
      --secrets e=f g=h
  ```

- Use the following command to view the details of an APM configuration:

  ```azurecli
  az spring apm show \
      --resource-group <resource-group-name> \
      --service <Azure-Spring-Apps-instance-name> \
      --name <your-APM-name>
  ```

- Use the following command to change an APM's properties:

  ```azurecli
  az spring apm update \
      --resource-group <resource-group-name> \
      --service <Azure-Spring-Apps-instance-name> \
      --name <your-APM-name> \
      --type <your-APM-type> \
      --properties a=b c=d \
      --secrets e=f2 g=h
  ```

- Use the following command to enable an APM configuration globally. When you enable an APM configuration globally, all the subsequent builds and deployments use it automatically.

  ```azurecli
  az spring apm enable-globally \
      --resource-group <resource-group-name> \
      --service <Azure-Spring-Apps-instance-name> \
      --name <your-APM-name> \
  ```

- Use the following command to disable an APM configuration globally. When you disable an APM configuration globally, all the subsequent builds and deployments don't use it.

  ```azurecli
  az spring apm disable-globally \
      --resource-group <resource-group-name> \
      --service <Azure-Spring-Apps-instance-name> \
      --name <your-APM-name> \
  ```

- Use the following command to list all the APM configurations enabled globally:

  ```azurecli
  az spring apm list-enabled-globally \
      --resource-group <resource-group-name> \
      --service <Azure-Spring-Apps-instance-name> 
  ```

- Use the following command to delete an APM configuration.

  ```azurecli
  az spring apm delete \
      --resource-group <resource-group-name> \
      --service <Azure-Spring-Apps-instance-name> \
      --name <your-APM-name> \
  ```
  
---

For more information on the `properties` and `secrets` parameters for your buildpack, see the [Supported Scenarios - APM and CA Certificates Integration](#supported-scenarios---apm-and-ca-certificates-integration) section.

#### Bind to app builds and deployments

For a build service that uses a managed Azure Container Registry, use the following command to integrate APM into your deployments:

```azurecli
az spring app deploy \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <app-name> \
    --builder <builder-name> \
    --apms <APM-name> \
    --artifact-path <path-to-your-JAR-file>
```

When you enable an APM configuration globally, all the subsequent builds and deployments use it automatically, and it's unnecessary to specify the `--apms` parameter. If you want to override the APM configuration enabled globally for a deployment, specify the APM configurations via `--apms` parameter.

For a build service that uses your own container registry, you can build an application into a container image and deploy the image to the current or other Azure Spring Apps Enterprise service instances.

Providing your own container registry separates building from deployment. You can use the build command to create or update a build with a builder, then use the deploy command to deploy the container image to the service.

Use the following command to build an image and configure APM:

```azurecli
az spring build-service build <create|update> \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <app-name> \ 
    --builder <builder-name> \
    --apms <APM-name> \
    --artifact-path <path-to-your-JAR-file>
```

When you enable an APM configuration globally,  all the subsequent builds and deployments use it automatically, and it's unnecessary to specify the `--apms` parameter. If you want to override the APM configuration enabled globally for a build, specify the APM configurations via the `--apms` parameter.

Use the following command to deploy the application with the container image built previously and configure APM. You can use the APM configuration enabled globally or use the `--apms` parameter to specify APM configuration.

```azurecli
az spring app deploy \
   --resource-group <resource-group-name> \
   --service <Azure-Spring-Apps-instance-name> \
   --name <app-name> \
   --container-image <your-container-image> \
   --container-registry <your-container-registry> \
   --registry-password <your-password> \
   --registry-username <your-username> \
   --apms <your-APM>
```

When you disable the build service, you can only deploy an application with a container image. For more information, see [Deploy an application with a custom container image](how-to-deploy-with-custom-container-image.md).

You can use multiple instances of Azure Spring Apps Enterprise, where some instances build and deploy images and others only deploy images. Consider the following scenario:

For one instance, you enable the build service with a user container registry. Then, you build from an artifact file or source code with APM or a CA certificate into a container image. You can then deploy to the current Azure Spring Apps instance or other service instances. For more information, see the [Build and deploy polyglot applications](how-to-enterprise-deploy-polyglot-apps.md#build-and-deploy-polyglot-applications) section of [How to deploy polyglot apps in Azure Spring Apps Enterprise](How-to-enterprise-deploy-polyglot-apps.md).

In another instance with the build service disabled, you deploy an application with the container image in your registry and also make use of APM.

In this scenario, you can use the APM configuration enabled globally or use the `--apms` parameter to specify the APM configuration, as shown in the following example:

```azurecli
az spring app deploy \
   --resource-group <resource-group-name> \
   --service <Azure-Spring-Apps-instance-name> \
   --name <app-name> \
   --container-image <your-container-image> \
   --container-registry <your-container-registry> \
   --registry-password <your-password> \
   --registry-username <your-username> \
   --apms <your-APM>
```

### Manage APMs via bindings in builder (deprecated)

When the build service uses the Azure Spring Apps managed container registry, you can build an application to an image and then deploy it, but only within the current Azure Spring Apps service instance.

#### Manage APM configurations via bindings in builder

You can manage APM configurations via bindings in builder. For more information, see the [Manage bindings in builder in Azure Spring Apps (deprecated)](#manage-bindings-in-builder-in-azure-spring-apps-deprecated) section.

#### Bind to app builds and deployments

Use the following command to integrate APM into your deployments. The APM is configured via bindings in the builder:

```azurecli
az spring app deploy \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <app-name> \
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
```

### Enable Application Insights when creating the service instance

If you enable Application Insights when creating a service instance, the following conditions apply:

- If you use a managed Azure Container Registry for the build service, Application Insights is bound to bindings in the default builder.
- If you use your own container registry for the build service or you disable the build service, a default APM configuration is created for Application Insights. The default APM is enabled globally and all the subsequent builds and deployments use it automatically.

## Configure CA certificates for app builds and deployments

You can configure CA certificates in Azure Spring Apps in the following two ways:

- You can manage public certificates in the TLS/SSL settings and bind to app builds and deployments by referring to them. This approach is the recommended way to configure CA certificates.
- You can manage public certificates in the TLS/SSL settings and bind CA certificates via bindings in the builder. For more information, see the [Manage bindings in builder in Azure Spring Apps (deprecated)](#manage-bindings-in-builder-in-azure-spring-apps-deprecated) section.

> [!NOTE]
> This approach is the old way to configure CA certificates and it has been deprecated. We recommend that you migrate the CA certificate configured in bindings. For more information, see the [Migrate CA certificate configured in bindings](#migrate-ca-certificate-configured-in-bindings) section.

You can now manage public certificates in the TLS/SSL settings and bind to app builds and deployments by referring to them. This approach is the recommended way to configure CA certificates.

To manage public certificates on the service instance level, see the [Import a certificate](how-to-use-tls-certificate.md#import-a-certificate) section of [Use TLS/SSL certificates in your application in Azure Spring Apps](how-to-use-tls-certificate.md). then, follow one of the approaches described in the following sections to bind CA certificates to app builds and deployments.

### Bind CA certificates to app builds and deployments

For information on how to bind CA certificates to deployments, see the [Load a certificate](how-to-use-tls-certificate.md#load-a-certificate) section of [Use TLS/SSL certificates in your application in Azure Spring Apps](how-to-use-tls-certificate.md). Then, use the following instructions to bind to app builds.

When you enable the build service and use a managed Azure Container Registry, use the following command to integrate CA certificates into your deployment:

```azurecli
az spring app deploy \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <app-name> \
    --builder <builder-name> \
    --build-certificates <CA certificate-name> \
    --artifact-path <path-to-your-JAR-file>
 ```

When you use your own container registry for the build service or disable the build service, use the following command to integrate CA certificates into your build:

```azurecli
az spring build-service build <create|update> \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <app-name> \ 
    --builder <builder-name> \
    --certificates <CA certificate-name> \
    --artifact-path <path-to-your-JAR-file>
```

### View CA certificates bound to app builds

Use the following steps to view the CA certificates bound to the build:

1. Navigate to your build page.

   :::image type="content" source="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/build-service-build.png" alt-text="Screenshot of the Azure portal showing the build service page with the current build in the list." lightbox="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/build-service-build.png":::
   
1. On the navigation pane, in the **Settings** section, select **Certificate bindings**.
   
1. On the **Certificate bindings** page, view the CA certificates bound to the build.

   :::image type="content" source="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/build-certificate-bindings.png" alt-text="Screenshot of the certificate bindings page showing CA certificates bound to the build." lightbox="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/build-certificate-bindings.png":::

### Bind CA certificates via bindings in builder (deprecated)

CA certificates use the [ca-certificates](https://github.com/paketo-buildpacks/ca-certificates) buildpack to support providing CA certificates to the system trust store at build and runtime.

In the Azure Spring Apps Enterprise plan, the CA certificates use the **Public Key Certificates** tab on the **TLS/SSL settings** page in the Azure portal, as shown in the following screenshot:

:::image type="content" source="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/public-key-certificates.png" alt-text="Screenshot of the Azure portal showing the Public Key Certificates section of the TLS/SSL settings page." lightbox="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/public-key-certificates.png":::

You can configure the CA certificates on the **Edit binding** page. The `succeeded` certificates are shown in the **CA Certificates** list.

:::image type="content" source="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/ca-certificates-buildpack-binding.png" alt-text="Screenshot of the Azure portal showing the Edit bindings for default builder page with the Edit binding for CA Certificates panel open." lightbox="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/ca-certificates-buildpack-binding.png":::

## Manage bindings in builder in Azure Spring Apps (deprecated)

This section applies only to an Azure Spring Apps Enterprise service instance with the build service enabled. With the build service enabled, one buildpack binding means either credential configuration against one APM type, or CA certificates configuration against the CA certificates type. For APM integration, follow the earlier instructions to configure the necessary environment variables or secrets for your APM.

> [!NOTE]
> When configuring environment variables for APM bindings, use key names without a prefix. For example, do not use a `DT_` prefix for a Dynatrace binding or `APPLICATIONINSIGHTS_` for Application Insights. Tanzu APM buildpacks transform the key name to the original environment variable name with a prefix.

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

:::image type="content" source="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/unbind-binding-command.png" alt-text="Screenshot of the Azure portal showing the Edit bindings for default builder page with the Unbind binding option highlighted for a selected binding type." lightbox="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/unbind-binding-command.png":::

To unbind a buildpack binding by editing binding properties, select **Edit Binding**, and then select **Unbind**.

:::image type="content" source="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/unbind-binding-properties.png" alt-text="Screenshot of Azure portal showing the Edit binding page with the Unbind button highlighted." lightbox="media/how-to-enterprise-configure-apm-integration-and-ca-certificates/unbind-binding-properties.png":::

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

## Migrate APM and CA certificates from bindings in builder

The bindings feature in builder is deprecated and is being removed in the future. We recommend that you migrate bindings in builder.

You can configure APM and CA certificates in bindings and you can migrate them by using the following sections.

### Migrate the APM configured in bindings

In most use cases, there's only one APM configured in bindings in the default builder. You can create a new APM configuration with the same configuration in bindings and enable this APM configuration globally. All the subsequent builds and deployments use this configuration automatically. Use the following steps to migrate:

1. Use the following command to create an APM configuration:

   ```azurecli
   az spring apm create \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-instance-name> \
       --name <your-APM-name> \
       --type <your-APM-type> \
       --properties a=b c=d \
       --secrets e=f g=h
   ```

1. Use the following command to enable the APM configuration globally:

   ```azurecli
   az spring apm enable-globally \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-instance-name> \
       --name <your-APM-name> \
   ```

1. Use the following command to redeploy all the applications to use the new APM configuration enabled globally:

   ```azurecli
   az spring app deploy \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-instance-name> \
       --name <app-name> \
       --builder <builder-name> \
       --artifact-path <path-to-your-JAR-file>
   ```

1. Verify that the new APM configuration works for all the applications. If everything works fine, use the following command to remove the APM bindings in builder:

   ```azurecli
   az spring build-service builder buildpack-binding delete \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-instance-name> \
       --name <your-APM-buildpack-binding-name> \
       --builder-name <your-builder-name>
   ```

If there are several APMs configured in bindings, you can create several APM configurations with the same configuration in bindings and enable the APM configuration globally if it's applicable. Use the `--apms` parameter to specify an APM configuration for a deployment if you want to override the APM enabled globally, as shown in the following command:

```azurecli
az spring app deploy \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <app-name> \
    --builder <builder-name> \
    --apms <APM-name> \
    --artifact-path <path-to-your-JAR-file>
```

During the migration process, APM is configured in both bindings and APM configuration. In this case, the APM configuration takes effect and the binding is ignored.

### Migrate CA certificate configured in bindings

Use the following steps to migrate a CA certificate:

1. For a CA certificate configured in binding, if it's used in runtime, you can load the certificate into your application. For more information, see [Load a certificate](how-to-use-tls-certificate.md#load-a-certificate) section of [Use TLS/SSL certificates in your application in Azure Spring Apps](how-to-use-tls-certificate.md).

1. Use the following command to redeploy all the applications using the CA certificate. If you use the certificate at build time, use the `--build-certificates` parameter to specify the CA certificate to use at build time for a deployment:

   ```azurecli
   az spring app deploy \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-instance-name> \
       --name <app-name> \
       --builder <builder-name> \
       --build-certificates <CA certificate-name> \
       --artifact-path <path-to-your-JAR-file>
   ```

1. Verify if the CA certificate works for all the applications using it. If everything works fine, use the following command to remove the CA certificate bindings in the builder:

   ```azurecli
   az spring build-service builder buildpack-binding delete \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-instance-name> \
       --name <your-CA-certificate-buildpack-binding-name> \
       --builder-name <your-builder-name>
   ```

## Next steps

- [How to deploy polyglot apps in Azure Spring Apps Enterprise](how-to-enterprise-deploy-polyglot-apps.md)
