---
title: How to migrate an Azure Spring Apps Basic or Standard tier instance to Enterprise tier
titleSuffix: Azure Spring Apps Enterprise tier
description: How to migrate an Azure Spring Apps Basic or Standard tier instance to Enterprise tier
author: karlerickson
ms.author: xiading
ms.service: spring-apps
ms.topic: how-to
ms.date: 05/09/2022
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# Migrate an Azure Spring Apps Basic or Standard tier instance to Enterprise tier

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to migrate an existing application in Basic or Standard tier to Enterprise tier. When you migrate from Basic or Standard tier to Enterprise tier, VMware Tanzu components will replace the open-source software (OSS) Spring Cloud components to provide more feature support.

This article will use the Pet Clinic sample apps as examples of how to migrate.

## Prerequisites

- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]

## Provision a service instance

In Enterprise Tier, VMware Tanzu components will replace the OSS Spring Cloud components to provide more feature support. Tanzu components are enabled on demand according to your needs. You can select the components you need before creating the service instance.

> [!NOTE]
> To use Tanzu Components, you must enable them when you provision your Azure Spring Apps service instance. You can't enable them after provisioning at this time.

Use the following steps to provision an Azure Spring Apps service instance:

### [Portal](#tab/azure-portal)

1. Open the [Azure portal](https://portal.azure.com/).

1. In the top search box, search for *Azure Spring Apps*.

1. Select **Azure Spring Apps** from the results, then select **Create**.

1. Select **Change** next to the **Pricing** option, then select **Enterprise**.

   :::image type="content" source="media/how-to-migrate-standard-tier-to-enterprise-tier/choose-enterprise-tier.png" alt-text="Screenshot of Azure portal Azure Spring Apps creation page with Basics section and 'Choose your pricing tier' pane showing." lightbox="media/how-to-migrate-standard-tier-to-enterprise-tier/choose-enterprise-tier.png":::

   Select the **Terms** checkbox to agree to the legal terms and privacy statements of the Enterprise tier offering in the Azure Marketplace.

1. To configure VMware Tanzu components, select **Next: VMware Tanzu settings**.

   > [!NOTE]
   > All Tanzu components are enabled by default. Carefully consider which Tanzu components you want to use or enable during the provisioning phase. After provisioning the Azure Spring Apps instance, you can't enable or disable Tanzu components.

   :::image type="content" source="media/how-to-migrate-standard-tier-to-enterprise-tier/create-instance-tanzu-settings-public-preview.png" alt-text="Screenshot of Azure portal Azure Spring Apps creation page with V M ware Tanzu Settings section showing." lightbox="media/how-to-migrate-standard-tier-to-enterprise-tier/create-instance-tanzu-settings-public-preview.png":::

1. Select the **Application Insights** section, then select **Enable Application Insights**. You can also enable Application Insights after you provision the Azure Spring Apps instance.

   - Choose an existing Application Insights instance or create a new Application Insights instance.
   - Enter a **Sampling Rate** in the range of 0-100, or use the default value 10.

   > [!NOTE]
   > You'll pay for the usage of Application Insights when integrated with Azure Spring Apps. For more information about Application Insights pricing, see [Application Insights billing](../azure-monitor/logs/cost-logs.md#application-insights-billing).

1. Select **Review and create** and wait for validation to complete, then select **Create** to start provisioning the service instance.

It takes about 5 minutes to finish the resource provisioning.

### [Azure CLI](#tab/azure-cli)

1. Update Azure CLI with the Azure Spring Apps extension by using the following command:

   ```azurecli
   az extension add --upgrade --name spring
   ```

1. Sign in to the Azure CLI and choose your active subscription by using the following command:

   ```azurecli
   az login
   az account list --output table
   az account set --subscription <subscription-ID>
   ```

1. Use the following command to accept the legal terms and privacy statements for the Enterprise tier. This step is only necessary if your subscription has never been used to create an Enterprise tier instance of Azure Spring Apps before.

   ```azurecli
   az provider register --namespace Microsoft.SaaS
   az term accept --publisher vmware-inc --product azure-spring-cloud-vmware-tanzu-2 --plan asa-ent-hr-mtr
   ```

1. Enter a name for your Azure Spring Apps service instance. The name must be between 4 and 32 characters long and can  only contain lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.

1. Create a resource group and an Azure Spring Apps service instance using the following the command:

   ```azurecli
   az group create --name <resource-group-name>
   az spring create \
       --resource-group <resource-group-name> \
       --name <service-instance-name> \
       --sku enterprise
   ```

   For more information about resource groups, see [What is Azure Resource Manager?](../azure-resource-manager/management/overview.md).

1. Set your default resource group name and Spring Cloud service name using the following command:

   ```azurecli
   az config set defaults.group=<resource-group-name> defaults.spring=<service-instance-name>
   ```

---

## Create and configure apps

The app creation steps are the same as Standard Tier.

1. To set the CLI defaults, use the following commands. Be sure to replace the placeholders with your own values.

   ```azurecli
   az account set --subscription=<your-subscription-id>
   az configure --defaults group=<your-resource-group-name> spring=<your-service-name>
   ```

1. To create the two core applications for PetClinic, `api-gateway` and `customers-service`, use the following commands:

   ```azurecli
   az spring app create --name api-gateway --instance-count 1 --memory 2Gi --assign-endpoint
   az spring app create --name customers-service --instance-count 1 --memory 2Gi
   ```

## Use Application Configuration Service for external configuration

For externalized configuration in a distributed system, managed Spring Cloud Config Server is only available in Basic and Standard tiers. In Enterprise tier, Application Configuration Service for Tanzu (ACS) provides similar functions for your apps. The following table describes some differences in usage between the OSS config server and ACS.

| Component                                   | Support tiers  | Enabled           | Bind to app | Profile                                                               |
|---------------------------------------------|----------------|-------------------|-------------|-----------------------------------------------------------------------|
| Spring Cloud Config Server                  | Basic/Standard | Always enabled.   | Auto bound  | Configured in app's source code.                                      |
| Application Configuration Service for Tanzu | Enterprise     | Enable on demand. | Manual bind | Provided as `config-file-pattern` in an Azure Spring Apps deployment. |

Unlike the client-server mode in the OSS config server, ACS manages configuration by using the Kubernetes-native `ConfigMap`, which is populated from properties defined in backend Git repositories. ACS can't get the active profile configured in the app's source code to match the right configuration, so the explicit configuration `config-file-pattern` should be specified at the Azure Spring Apps deployment level.

## Configure Application Configuration Service for Tanzu settings

Follow these steps to use Application Configuration Service for Tanzu as a centralized configuration service.

### [Portal](#tab/azure-portal)

1. Select **Application Configuration Service**.
1. Select **Overview** to view the running state and resources allocated to Application Configuration Service for Tanzu.

   :::image type="content" source="./media/how-to-migrate-standard-tier-to-enterprise-tier/config-service-overview.png" alt-text="Screenshot of Azure portal Azure Spring Apps with Application Configuration Service page and Overview section showing." lightbox="./media/how-to-migrate-standard-tier-to-enterprise-tier/config-service-overview.png":::

1. Select **Settings**, then add a new entry in the **Repositories** section with the following information:

   - Name: `default`
   - Patterns: `api-gateway,customers-service`
   - URI: `https://github.com/Azure-Samples/spring-petclinic-microservices-config`
   - Label: `master`

1. Select **Validate** to validate access to the target URI.

1. After validation completes successfully, select **Apply** to update the configuration settings.

   :::image type="content" source="./media/how-to-migrate-standard-tier-to-enterprise-tier/config-service-settings.png" alt-text="Screenshot of Azure portal Azure Spring Apps with Application Configuration Service page and Settings section showing." lightbox="./media/how-to-migrate-standard-tier-to-enterprise-tier/config-service-settings.png":::

### [Azure CLI](#tab/azure-cli)

To set the default repository, use the following command:

```azurecli
az spring application-configuration-service git repo add \
    --name default \
    --patterns api-gateway,customers-service \
    --uri https://github.com/Azure-Samples/spring-petclinic-microservices-config.git \
    --label master
```

---

## Bind application to Application Configuration Service for Tanzu

When you use Application Configuration Service for Tanzu with a Git backend, you must bind the app to Application Configuration Service for Tanzu. After binding the app, you'll need to configure which pattern will be used by the app. Follow these steps to bind and configure the pattern for the app.

### [Portal](#tab/azure-portal)

To bind apps to Application Configuration Service for VMware Tanzu®, follow these steps.

1. Select **Application Configuration Service**.

1. Select **App binding**, then select **Bind app**.

1. Choose one app in the dropdown, then select **Apply** to bind the application to Application Configuration Service for Tanzu.

The list under **App name** will show the apps bound with Application Configuration Service for Tanzu.

### [Azure CLI](#tab/azure-cli)

To bind apps to Application Configuration Service for VMware Tanzu® and VMware Tanzu® Service Registry, use the following commands:

```azurecli
az spring application-configuration-service bind --app api-gateway
az spring application-configuration-service bind --app customers-service
```

---

For more information, see [Use Application Configuration Service for Tanzu](./how-to-enterprise-application-configuration-service.md).

## Using Service Registry for Tanzu

[Service Registry](https://docs.pivotal.io/spring-cloud-services/2-1/common/service-registry/index.html) is one of the proprietary VMware Tanzu components. It provides your apps with an implementation of the Service Discovery pattern, one of the key concepts of a microservice-based architecture. In Enterprise tier, Service Registry for Tanzu provides service registry and discover support for your apps. Managed Spring Cloud Eureka is only available in Basic and Standard tiers and isn't available in Enterprise tier.

| Component        | Standard Tier                                                        | Enterprise Tier                                                                   |
|------------------|----------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| Service Registry | OSS eureka <br> Auto bound (always injection) <br>Always provisioned | Service Registry for Tanzu <br> Needs manual binding to app <br> Enable on demand |

## Bind an application to Tanzu Service Registry

### [Portal](#tab/azure-portal)

To bind apps to Application Configuration Service for VMware Tanzu®, follow these steps.

1. In the Azure portal, Select **Service Registry**.

1. Select **App binding**, then select **Bind app**.

1. Choose one app in the dropdown, and then select **Apply** to bind the application to Tanzu Service Registry.

   :::image type="content" source="media/how-to-migrate-standard-tier-to-enterprise-tier/service-reg-app-bind-dropdown.png" alt-text="Screenshot of Azure portal Azure Spring Apps with Service Registry page and 'Bind app' dialog showing." lightbox="media/how-to-migrate-standard-tier-to-enterprise-tier/service-reg-app-bind-dropdown.png":::

The list under **App name** shows the apps bound with Tanzu Service Registry.

### [Azure CLI](#tab/azure-cli)

To bind apps to Application Configuration Service for VMware Tanzu® and VMware Tanzu® Service Registry, use the following commands:

```azurecli
az spring service-registry bind --app api-gateway
az spring service-registry bind --app customers-service
```

---

   > [!NOTE]
   > When you change the bind/unbind status, you must restart or redeploy the app to make the change take effect.

For more information, see [Use Tanzu Service Registry](./how-to-enterprise-service-registry.md).

## Build and deploy applications

In Enterprise tier, Tanzu Build Service is used to build apps. It provides more features like polyglot apps to deploy from artifacts such as source code and zip files.

To use Tanzu Build Service, you need to specify a resource for build task and builder to use. You can also specify the `--build-env` parameter to set build environments.

If the app binds with ACS, you need specify an extra argument `—config-file-pattern`.

The following sections show how to build and deploy applications.

## Build the applications locally

To build locally, use the following steps:

1. Clone the sample app repository in your Azure account, change the directory, and build the project using the following commands:

   ```bash
   git clone -b enterprise https://github.com/azure-samples/spring-petclinic-microservices
   cd spring-petclinic-microservices
   mvn clean package -DskipTests
   ```

   Compiling the project can take several minutes. Once complete, you'll have individual JAR files for each service in its respective folder.

1. Deploy the JAR files built in the previous step using the following commands:

   ```azurecli
   az spring app deploy \
       --name api-gateway \
       --artifact-path spring-petclinic-api-gateway/target/spring-petclinic-api-gateway-2.3.6.jar \
       --config-file-patterns api-gateway
   az spring app deploy \
       --name customers-service \
       --artifact-path spring-petclinic-customers-service/target/spring-petclinic-customers-service-2.3.6.jar \
       --config-file-patterns customers-service
   ```

1. Query the application status after deployment by using the following command:

   ```azurecli
   az spring app list --output table
   ```

   This command produces output similar to the following example:

   ```output
   Name                  Location    ResourceGroup       Public Url                                                 Production Deployment    Provisioning State    CPU    Memory    Running Instance    Registered Instance    Persistent Storage    Bind Service Registry    Bind Application Configuration Service
   --------------------  ----------  ---------------  ---------------------------------------------------------  -----------------------  --------------------  -----  --------  ------------------  ---------------------  --------------------  -----------------------  ----------------------------------------
   api-gateway           eastus      <resource group>   https://<service_name>-api-gateway.asc-test.net                    default                  Succeeded             1      2Gi       1/1                1/1                    -                     True                     True
   customers-service     eastus      <resource group>                                                                      default                  Succeeded             1      2Gi       1/1                1/1                    -                     True                     True
   ```

## Use Application Insights

Azure Spring Apps Enterprise tier uses buildpack bindings to integrate [Application Insights](../azure-monitor/app/app-insights-overview.md) with the type `ApplicationInsights` instead of In-Process Agent. For more information, see [How to configure APM integration and CA certificates](how-to-enterprise-configure-apm-intergration-and-ca-certificates.md).

| Standard Tier                                                      | Enterprise Tier                                                                    |
|--------------------------------------------------------------------|------------------------------------------------------------------------------------|
| Application insight <br> New Relic <br> Dynatrace <br> AppDynamics | Application insight <br> New Relic <br> Dynatrace <br> AppDynamics <br> ElasticAPM |

To check or update the current settings in Application Insights, use the following steps:

### [Portal](#tab/azure-portal)

1. Select **Application Insights**.
1. Enable Application Insights by selecting **Edit binding**, or the **Unbound** hyperlink.

   :::image type="content" source="media/how-to-migrate-standard-tier-to-enterprise-tier/application-insights-binding-enable.png" alt-text="Screenshot of Azure portal Azure Spring Apps instance with Application Insights page showing and drop-down menu visible with 'Edit binding' option.":::

1. Edit the binding settings, then select **Save**.

   :::image type="content" source="media/how-to-migrate-standard-tier-to-enterprise-tier/application-insights-edit-binding.png" alt-text="Screenshot of Azure portal 'Edit binding' pane." lightbox="media/how-to-migrate-standard-tier-to-enterprise-tier/application-insights-edit-binding.png":::

### [Azure CLI](#tab/azure-cli)

To create an Application Insights buildpack binding, use the following command:

```azurecli
az spring build-service builder buildpack-binding create \
    --resource-group <your-resource-group-name> \
    --service <your-service-instance-name> \
    --name <your-binding-name> \
    --builder-name <your-builder-name> \
    --type ApplicationInsights \
    --properties sampling-percentage=<your-sampling-percentage> \
                 connection-string=<your-connection-string>
```

To list all buildpack bindings, and find Application Insights bindings for the type `ApplicationInsights`, use the following command:

```azurecli
az spring build-service builder buildpack-binding list \
    --resource-group <your-resource-group-name> \
    --service <your-service-resource-name> \
    --builder-name <your-builder-name>
```

To replace an Application Insights buildpack binding, use the following command:

```azurecli
az spring build-service builder buildpack-binding set \
    --resource-group <your-resource-group-name> \
    --service <your-service-instance-name> \
    --name <your-binding-name> \
    --builder-name <your-builder-name> \
    --type ApplicationInsights \
    --properties sampling-percentage=<your-sampling-percentage> \
                 connection-string=<your-connection-string>
```

To get an Application Insights buildpack binding, use the following command:

```azurecli
az spring build-service builder buildpack-binding show \
    --resource-group <your-resource-group-name> \
    --service <your-service-instance-name> \
    --name <your-binding-name> \
    --builder-name <your-builder-name> \
```

To delete an Application Insights buildpack binding, use the following command:

```azurecli
az spring build-service builder buildpack-binding delete \
    --resource-group <your-resource-group-name> \
    --service <your-service-instance-name> \
    --name <your-binding-name> \
    --builder-name <your-builder-name> \
```

For more information, see [Use Application Insights Java In-Process Agent in Azure Spring Apps](./how-to-application-insights.md).

---

## Next steps

- [Azure Spring Apps](index.yml)
- [Use API portal for VMware Tanzu](./how-to-use-enterprise-api-portal.md)
- [Use Spring Cloud Gateway for Tanzu](./how-to-use-enterprise-spring-cloud-gateway.md)
