---
title: How to migrate an Azure Spring Apps Basic or Standard plan instance to the Enterprise plan
titleSuffix: Azure Spring Apps Enterprise plan
description: Shows you how to migrate an Azure Spring Apps Basic or Standard plan instance to Enterprise plan.
author: KarlErickson
ms.author: xiading
ms.service: spring-apps
ms.topic: how-to
ms.date: 6/20/2023
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, event-tier1-build-2022
---

# Migrate an Azure Spring Apps Basic or Standard plan instance to the Enterprise plan

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article shows you how to migrate an existing application in the Basic or Standard plan to the Enterprise plan. When you migrate from the Basic or Standard plan to the Enterprise plan, VMware Tanzu components replace the open-source software (OSS) Spring Cloud components to provide more feature support.

This article uses the Pet Clinic sample apps as examples of how to migrate.

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli) version 2.45.0 or higher.
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]
- [Git](https://git-scm.com/downloads).

## Provision a service instance

In the Azure Spring Apps Enterprise plan, VMware Tanzu components replace the OSS Spring Cloud components to provide more feature support. Tanzu components are enabled on demand according to your needs. You must enable the components you need before creating the Azure Spring Apps service instance.

> [!NOTE]
> To use Tanzu Components, you must enable them when you provision your Azure Spring Apps service instance. You can't enable them after provisioning at this time.

Use the following steps to provision an Azure Spring Apps service instance:

### [Azure portal](#tab/azure-portal)

1. Open the [Azure portal](https://portal.azure.com/).
1. In the top search box, search for *Azure Spring Apps*.
1. Select **Azure Spring Apps** from the results and then select **Create**.
1. On the **Create Azure Spring Apps** page, set your **Subscription**, **Resource group**, and **Name** for the instance.
1. For **Plan** in **Service Details**, select **Change**.

   :::image type="content" source="media/how-to-migrate-standard-tier-to-enterprise-tier/change-plan.png" alt-text="Screenshot of the Azure portal Azure Spring Apps creation page with the Change button highlighted in the plan section." lightbox="media/how-to-migrate-standard-tier-to-enterprise-tier/change-plan.png":::

1. On the **Choose your plan** page, select the **Enterprise** row in the table, and then select **Select**.

   :::image type="content" source="media/how-to-migrate-standard-tier-to-enterprise-tier/choose-enterprise-tier.png" alt-text="Screenshot of the Azure portal Azure Spring Apps creation page with Basics section and 'Choose your pricing tier' pane showing." lightbox="media/how-to-migrate-standard-tier-to-enterprise-tier/choose-enterprise-tier.png":::

1. Back on the **Create Azure Spring Apps** page, select **Terms** to agree to the legal terms and privacy statements of the Enterprise plan offering in the Azure Marketplace.

1. Select **Next: VMware Tanzu settings**.

1. On the **VMWare Tanzu settings** tab, scroll through the list to review the Tanzu components. All components are enabled by default.

   :::image type="content" source="media/how-to-migrate-standard-tier-to-enterprise-tier/create-instance-tanzu-settings-public-preview.png" alt-text="Screenshot of the Azure portal Azure Spring Apps creation page with V M ware Tanzu Settings section showing." lightbox="media/how-to-migrate-standard-tier-to-enterprise-tier/create-instance-tanzu-settings-public-preview.png":::

   > [!NOTE]
   > Carefully consider which Tanzu components you want to use or enable during the provisioning phase. After provisioning the Azure Spring Apps instance, you can't enable or disable Tanzu components.

1. Select the **Application Insights** tab and then select **Enable Application Insights**. Review the following settings:

   - **Enable Application Insights** should be selected.
   - Choose an existing Application Insights instance or create a new Application Insights instance.
   - Enter a **Sampling rate** in the range of 0-100, or use the default value 10.

   You can also enable Application Insights after you provision the Azure Spring Apps instance. For more information about Application Insights pricing, see the [Application Insights billing](../azure-monitor/logs/cost-logs.md#application-insights-billing) section of [Azure Monitor Logs cost calculations and options](../azure-monitor/logs/cost-logs.md).

   > [!NOTE]
   > You'll pay for the usage of Application Insights when integrated with Azure Spring Apps.

1. Select **Review and create** and wait for validation to complete, then select **Create** to start provisioning the service instance.

It takes about 5 minutes to finish the resource provisioning.

### [Azure CLI](#tab/azure-cli)

1. Use the following command to update Azure CLI with the Azure Spring Apps extension:

   ```azurecli
   az extension add --upgrade --name spring
   ```

1. Use the following commands to sign in to the Azure CLI and choose your active subscription:

   ```azurecli
   az login
   az account list --output table
   az account set --subscription <subscription-ID>
   ```

1. Use the following command to accept the legal terms and privacy statements for the Enterprise plan. This step is required only the first time you create an Azure Spring Apps instance on the Enterprise plan.

   ```azurecli
   az provider register --namespace Microsoft.SaaS
   az term accept --publisher vmware-inc --product azure-spring-cloud-vmware-tanzu-2 --plan asa-ent-hr-mtr
   ```

1. Create a name for your Azure Spring Apps service instance. The name must be between 4 and 32 characters long and can  only contain lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.

1. Use the following command to create a resource group and an Azure Spring Apps service instance:

   ```azurecli
   az spring create \
       --resource-group <resource-group-name> \
       --name <Azure-Spring-Apps-service-instance-name> \
       --sku enterprise
   ```

   For more information about resource groups, see [What is Azure Resource Manager?](../azure-resource-manager/management/overview.md).

---

## Create and configure apps

The app creation steps are the same as Standard plan.

1. Use the following command to set Azure CLI defaults. Be sure to replace the placeholders with your own values.

   ```azurecli
   az config set defaults.group=<resource-group-name>
   az config set defaults.spring=<Azure-Spring-Apps-service-instance-name>
   ```

1. Use the following commands to create the two core applications for PetClinic, `api-gateway` and `customers-service`:

   ```azurecli
   az spring app create --name api-gateway --instance-count 1 --memory 2Gi --assign-endpoint
   az spring app create --name customers-service --instance-count 1 --memory 2Gi
   ```

## Use Application Configuration Service for external configuration

For externalized configuration in a distributed system, managed Spring Cloud Config Server (OSS) is available only in the Basic and Standard plans. In the Enterprise plan, Application Configuration Service for Tanzu (ACS) provides similar functions for your apps. The following table describes some differences in usage between the OSS config server and ACS.

| Component                                   | Support plans  | Enabled           | Bind to app | Profile                                                               |
|---------------------------------------------|----------------|-------------------|-------------|-----------------------------------------------------------------------|
| Spring Cloud Config Server                  | Basic/Standard | Always enabled.   | Auto bound  | Configured in app's source code.                                      |
| Application Configuration Service for Tanzu | Enterprise     | Enable on demand. | Manual bind | Provided as `config-file-pattern` in an Azure Spring Apps deployment. |

Unlike the client-server mode in the OSS config server, ACS manages configuration by using the Kubernetes-native `ConfigMap`, which is populated from properties defined in backend Git repositories. ACS can't get the active profile configured in the app's source code to match the right configuration, so the explicit configuration `config-file-pattern` should be specified at the Azure Spring Apps deployment level.

## Configure Application Configuration Service for Tanzu

Follow these steps to use Application Configuration Service for Tanzu as a centralized configuration service.

### [Azure portal](#tab/azure-portal)

1. In your Azure Spring Apps Enterprise instance, select **Application Configuration Service** in the navigation pane. View the running state and resources allocated to Application Configuration Service for Tanzu.

   :::image type="content" source="./media/how-to-migrate-standard-tier-to-enterprise-tier/config-service-overview.png" alt-text="Screenshot of the Azure portal showing the Overview tab of the Application Configuration Service page." lightbox="./media/how-to-migrate-standard-tier-to-enterprise-tier/config-service-overview.png":::

1. Select **Settings** and complete the form in **Repositories** to add a new entry with the following information:

   - Name: `default`
   - Patterns: `api-gateway,customers-service`
   - URI: `https://github.com/Azure-Samples/spring-petclinic-microservices-config`
   - Label: `master`

   :::image type="content" source="./media/how-to-migrate-standard-tier-to-enterprise-tier/config-service-settings.png" alt-text="Screenshot of the Azure portal showing the Settings tab of the Application Configuration Service page." lightbox="./media/how-to-migrate-standard-tier-to-enterprise-tier/config-service-settings.png":::

1. Select **Validate** to validate access to the target URI.

1. After validation completes successfully, select **Apply** to update the configuration settings.

### [Azure CLI](#tab/azure-cli)

Use the following command to set the default repository:

```azurecli
az spring application-configuration-service git repo add \
    --name default \
    --patterns api-gateway,customers-service \
    --uri https://github.com/Azure-Samples/spring-petclinic-microservices-config.git \
    --label master
```

---

## Bind applications to Application Configuration Service for Tanzu

When you use Application Configuration Service for Tanzu with a Git backend, you must bind the app to Application Configuration Service for Tanzu. After binding the app, you'll need to configure which pattern is used by the app. Use the following  steps to bind and configure the pattern for the app.

### [Azure portal](#tab/azure-portal)

Use the following steps to bind apps to Application Configuration Service for VMware Tanzu.

1. In your Azure Spring Apps Enterprise instance, select **Application Configuration Service** in the navigation pane.

1. Select **App binding** and then select **Bind app**.

   :::image type="content" source="./media/how-to-migrate-standard-tier-to-enterprise-tier/config-bind-app.png" alt-text="Screenshot of the Azure portal showing the App binding tab of the Application Configuration Service page and the Bind app dropdown menu showing." lightbox="./media/how-to-migrate-standard-tier-to-enterprise-tier/config-bind-app.png":::

1. Select an app in the dropdown menu and then select **Apply** to bind the application to Application Configuration Service for Tanzu.

### [Azure CLI](#tab/azure-cli)

Use the following commands to bind apps to Application Configuration Service for VMware Tanzu and VMware Tanzu Service Registry:

```azurecli
az spring application-configuration-service bind --app api-gateway
az spring application-configuration-service bind --app customers-service
```

---

For more information, see [Use Application Configuration Service for Tanzu](./how-to-enterprise-application-configuration-service.md).

## Using Service Registry for Tanzu

[Service Registry](https://docs.vmware.com/en/Spring-Cloud-Services-for-VMware-Tanzu/3.1/spring-cloud-services/GUID-service-registry-index.html) is one of the proprietary VMware Tanzu components. It provides your apps with an implementation of the Service Discovery pattern, one of the key concepts of a microservice-based architecture. In the Enterprise plan, Service Registry for Tanzu provides service registry and discover support for your apps. Managed Spring Cloud Eureka is available only in the Basic and Standard plan and isn't available in the Enterprise plan.

| Component        | Standard plan                                                        | Enterprise plan                                                                   |
|------------------|----------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| Service Registry | OSS eureka <br> Auto bound (always injection) <br>Always provisioned | Service Registry for Tanzu <br> Needs manual binding to app <br> Enable on demand |

## Bind an application to Tanzu Service Registry

To bind apps to Application Configuration Service for VMware Tanzu, follow these steps.

### [Azure portal](#tab/azure-portal)

1. In your Azure Spring Apps Enterprise instance, select **Service Registry**.

1. Select **App binding**. Currently bound apps appear under **App name**.

1. Select **Bind app**.

1. Select an app in the dropdown menu and then select **Apply** to bind the application to Tanzu Service Registry.

   :::image type="content" source="media/how-to-migrate-standard-tier-to-enterprise-tier/service-reg-app-bind-dropdown.png" alt-text="Screenshot of the Azure portal Azure Spring Apps with Service Registry page and 'Bind app' dialog showing." lightbox="media/how-to-migrate-standard-tier-to-enterprise-tier/service-reg-app-bind-dropdown.png":::

### [Azure CLI](#tab/azure-cli)

Use the following commands to bind apps to Application Configuration Service for VMware Tanzu and VMware Tanzu Service Registry:

```azurecli
az spring service-registry bind --app api-gateway
az spring service-registry bind --app customers-service
```

---

> [!NOTE]
> When you change the bind/unbind status, you must restart or redeploy the app to make the change take effect.

For more information, see [Use Tanzu Service Registry](./how-to-enterprise-service-registry.md).

## Build and deploy applications

In the Enterprise plan, Tanzu Build Service is used to build apps. It provides more features like polyglot apps to deploy from artifacts such as source code and zip files.

To use Tanzu Build Service, you need to specify a resource for build task and builder to use. You can also specify the `--build-env` parameter to set build environments.

If the app binds with Application Configuration Service for Tanzu, you need specify an extra argument `—config-file-pattern`.

For more information, see [Use Tanzu Build Service](how-to-enterprise-build-service.md).

## Build applications locally

Use the following steps to build locally:

1. Use the following commands to clone the sample app repository in your Azure account, change the directory, and build the project:

   ```bash
   git clone -b enterprise https://github.com/azure-samples/spring-petclinic-microservices
   cd spring-petclinic-microservices
   mvn clean package -DskipTests
   ```

   Compiling the project can take several minutes. When complete, you have individual JAR files for each service in its respective folder.

1. Use the following commands to deploy the JAR files built in the previous step:

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

1. Use the following command to query the application status after deployment:

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

The Azure Spring Apps Enterprise plan uses buildpack bindings to integrate [Application Insights](../azure-monitor/app/app-insights-overview.md) with the type `ApplicationInsights` instead of In-Process Agent. For more information, see [How to configure APM integration and CA certificates](how-to-enterprise-configure-apm-integration-and-ca-certificates.md).

The following table lists the APM providers available the plans.

| Standard plan                                                      | Enterprise plan                                                                    |
|--------------------------------------------------------------------|------------------------------------------------------------------------------------|
| Application insight <br> New Relic <br> Dynatrace <br> AppDynamics | Application insight <br> New Relic <br> Dynatrace <br> AppDynamics <br> ElasticAPM |

### [Azure portal](#tab/azure-portal)

To check or update the current settings in Application Insights, use the following steps:

1. In your Azure Spring Apps Enterprise instance, select **Application Insights**.
1. Enable or disable Application Insights by selecting **Edit binding** or **Unbind binding**.

   :::image type="content" source="media/how-to-migrate-standard-tier-to-enterprise-tier/application-insights-binding-enable.png" alt-text="Screenshot of the Azure portal Application Insights page with the Edit binding option dropdown menu showing." lightbox="media/how-to-migrate-standard-tier-to-enterprise-tier/application-insights-binding-enable.png":::

1. Select **Edit binding**. Edit the binding settings and then select **Save**.

   :::image type="content" source="media/how-to-migrate-standard-tier-to-enterprise-tier/application-insights-edit-binding.png" alt-text="Screenshot of the Azure portal 'Edit binding' pane." lightbox="media/how-to-migrate-standard-tier-to-enterprise-tier/application-insights-edit-binding.png":::

### [Azure CLI](#tab/azure-cli)

The following commands show you how to check or update the current settings in Application Insights.

Use the following command to create an Application Insights buildpack binding:

```azurecli
az spring build-service builder buildpack-binding create \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <your-binding-name> \
    --builder-name <your-builder-name> \
    --type ApplicationInsights \
    --properties sampling-percentage=<your-sampling-percentage> \
                 connection-string=<your-connection-string>
```

Use the following command to list all buildpack bindings, and find Application Insights bindings for the type `ApplicationInsights`:

```azurecli
az spring build-service builder buildpack-binding list \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --builder-name <your-builder-name>
```

Use the following command to replace an Application Insights buildpack binding:

```azurecli
az spring build-service builder buildpack-binding set \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <your-binding-name> \
    --builder-name <your-builder-name> \
    --type ApplicationInsights \
    --properties sampling-percentage=<your-sampling-percentage> \
                 connection-string=<your-connection-string>
```

Use the following command to get an Application Insights buildpack binding:

```azurecli
az spring build-service builder buildpack-binding show \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <your-binding-name> \
    --builder-name <your-builder-name> \
```

Use the following command to delete an Application Insights buildpack binding:

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
- [Use Spring Cloud Gateway](./how-to-use-enterprise-spring-cloud-gateway.md)
