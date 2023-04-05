---
title: Use Application Live View with Azure Spring Apps Enterprise tier
description: Learn how to use Application Live View for VMware Tanzu.
author: KarlErickson
ms.author: yuwzho
ms.service: spring-apps
ms.topic: how-to
ms.date: 12/01/2022
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# Use Application Live View with Azure Spring Apps Enterprise tier

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to use Application Live View for VMware Tanzu® with Azure Spring Apps Enterprise tier.

[Application Live View for VMware Tanzu](https://docs.vmware.com/en/Application-Live-View-for-VMware-Tanzu/1.2/docs/GUID-index.html) is a lightweight insights and troubleshooting tool that helps app developers and app operators look inside running apps.

Application Live View only supports Spring Boot applications.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Understand and fulfill the [Requirements](how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise Tier in Azure Marketplace](how-to-enterprise-marketplace-offer.md).
- [Azure CLI](/cli/azure/install-azure-cli) with the Azure Spring Apps extension. Use the following command to remove previous versions and install the latest extension. If you previously installed the `spring-cloud` extension, uninstall it to avoid configuration and version mismatches.

  ```azurecli
  az extension remove --name spring
  az extension add --name spring
  az extension remove --name spring-cloud
  ```

## Enable Application Live View

You can enable Application Live View when you provision an Azure Spring Apps Enterprise tier instance. If you already have a provisioned Azure Spring Apps Enterprise resource, see the [Manage Application Live View in existing Enterprise tier instances](#manage-application-live-view-in-existing-enterprise-tier-instances) section of this article.

You can enable Application Live View using the Azure portal or Azure CLI.

### [Azure portal](#tab/Portal)

Use the following steps to enable Application Live View using the Azure portal:

1. Navigate to the [Azure portal](https://portal.azure.com/#create/vmware-inc.azure-spring-cloud-vmware-tanzu-2).
1. On the **Basics** tab, select **Enterprise tier** in pricing, specify other input fields, and then select **Next**.
1. On the **VMware Tanzu settings** tab, select **Enable App Live View**.

   :::image type="content" source="media/how-to-use-application-live-view/create.png" alt-text="Screenshot of the VMware Tanzu settings tab with the Enable App Live View checkbox selected." lightbox="media/how-to-use-application-live-view/create.png":::

1. Specify other settings, and then select **Review and Create**.
1. Make sure that **Enable Application Live View** and **Enable Dev Tools Portal** are set to *Yes* on the **Review and Create** tab, and then select **Create** to create the Enterprise tier instance.

### [Azure CLI](#tab/Azure-CLI)

Use the following steps to provision an Azure Spring Apps service instance using the Azure CLI.

1. Use the following command to sign in to the Azure CLI and specify your active subscription:

   ```azurecli
   az login
   az account list --output table
   az account set --subscription <subscription-ID>
   ```

1. Use the following command to accept the legal terms and privacy statements for the Enterprise tier. This step is necessary only if your subscription has never been used to create an Enterprise tier instance of Azure Spring Apps.

   ```azurecli
   az provider register --namespace Microsoft.SaaS
   az term accept \
       --publisher vmware-inc \
       --product azure-spring-cloud-vmware-tanzu-2 \
       --plan asa-ent-hr-mtr
   ```

1. Select a location. This location must be a location supporting Azure Spring Apps Enterprise tier. For more information, see the [Azure Spring Apps FAQ](faq.md).

1. Use the following command to create a resource group:

   ```azurecli
   az group create \
       --name <resource-group-name> \
       --location <location>
   ```

   For more information about resource groups, see [What is Azure Resource Manager?](../azure-resource-manager/management/overview.md)

1. Prepare a name for your Azure Spring Apps service instance. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.

1. Use the following command to create an Azure Spring Apps service instance:

   ```azurecli
   az spring create \
       --resource-group <resource-group-name> \
       --name <Azure-Spring-Apps-service-instance-name> \
       --sku enterprise \
       --enable-application-live-view
   ```

---

## Monitor Application Live View

Azure Spring Apps runs the Application Live View in connector mode.

| Component                       | Description                                                                                                                                                                                                                                              |
|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Application Live View Server    | The central server component that contains a list of registered apps. Application Live View Server is responsible for proxying the request to fetch the actuator information related to the app.                                                         |
| Application Live View Connector | The component responsible for discovering the running app and registering the instances to the Application Live View Server for it to be observed. The Application Live View Connector is also responsible for proxying the actuator queries to the app. |

After you provision the Azure Spring Apps Enterprise tier instance, you can obtain its running state and resource consumption, or manage Application Live View.

You can monitor Application Live View using the Azure portal or Azure CLI.

### [Azure portal](#tab/Portal)

You can view the state of Application Live View in the Azure portal on the **Overview** tab of the **Developer Tools (Preview)** page.

:::image type="content" source="media/how-to-use-application-live-view/application-live-view-enabled.png" alt-text="Screenshot of the Developer Tools (Preview) page showing the Overview tab." lightbox="media/how-to-use-application-live-view/application-live-view-enabled.png":::

### [Azure CLI](#tab/Azure-CLI)

Use the following command in the Azure CLI to view Application Live View:

```azurecli
az spring application-live-view show \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name>
```

---

## Configure Dev Tools to access Application Live View

To access Application Live View, you need to configure Tanzu Dev Tools. For more information, see [Configure Tanzu Dev Tools in Azure Spring Apps Enterprise tier](./how-to-use-dev-tool-portal.md).

## Use Application Live View to monitor your apps

Application Live View lets you view live metrics for Spring Boot applications and Spring Native applications. The Application Live View is based on the concept of Spring Boot Actuators.

Use the following steps to deploy an app and monitor it in Application Live View:

1. Add the following dependency to your application's *pom.xml* file.

   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
   ```

1. Add the following execution goal to your Maven plugin in the *pom.xml* file to expose build information:

   ```xml
   <plugin>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-maven-plugin</artifactId>
   <executions>
       <execution>
       <goals>
           <goal>build-info</goal>
       </goals>
       <configuration>
           <additionalProperties>
           <spring.boot.version>${project.parent.version}</spring.boot.version>
           </additionalProperties>
       </configuration>
       </execution>
   </executions>
   </plugin>
   ```

1. Enable the actuator endpoint by adding the following configuration in *application.properties*:

   ```properties
   management.endpoints.web.exposure.include=info,health
   ```

1. Use the following command to build your package locally:

   ```bash
   mvn clean package -DskipTests
   ```

1. Use the following command to deploy the binary:

   ```azurecli
   az spring app create \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> \
       --name <app-name>
   az spring app deploy \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> \
       --name <app-name> \
       --artifact-path <jar-file-in-target-folder>
   ```

1. After the app is successfully deployed, you can monitor it using the Application Live View dashboard on Dev Tools Portal. For more information, see [Monitor apps by Application Live View](./monitor-apps-by-application-live-view.md).

   If you've already enabled Dev Tools Portal and exposed a public endpoint, use the following command to get the Dev Tools Portal dashboard URL. Add the suffix `/app-live-view` to compose the endpoint to access Application Live View.

   ```azurecli
   az spring dev-tool show --service <Azure-Spring-Apps-service-instance-name> \
       --resource-group <resource-group-name> \
       --query properties.url \
       --output tsv
   ```

## Manage Application Live View in existing Enterprise tier instances

You can enable Application Live View in an existing Azure Spring Apps Enterprise tier instance using the Azure portal or Azure CLI.

If you have already enabled Dev Tools Portal and exposed a public endpoint, use <kbd>Ctrl</kbd>+<kbd>F5</kbd> to deactivate the browser cache after you enable Application Live View.

### [Azure portal](#tab/Portal)

Use the following steps to manage Application Live View using the Azure portal:

1. Navigate to your service resource, and then select **Developer Tools (Preview)**.
1. Select **Manage tools**.

   :::image type="content" source="media/how-to-use-application-live-view/manage.png" alt-text="Screenshot of the Developer Tools (Preview) page." lightbox="media/how-to-use-application-live-view/manage.png":::

1. Select the **Enable App Live View** checkbox, and then select **Save**.

   :::image type="content" source="media/how-to-use-application-live-view/check-enable.png" alt-text="Screenshot of the Developer Tools section showing the Enable App Live View checkbox." lightbox="media/how-to-use-application-live-view/check-enable.png":::

1. You can then view the state of Application Live View on the **Developer Tools (Preview)**.

   :::image type="content" source="media/how-to-use-application-live-view/check-enable.png" alt-text="Screenshot of the Developer Tools section showing the Enable App Live View checkbox." lightbox="media/how-to-use-application-live-view/check-enable.png":::

### [Azure CLI](#tab/Azure-CLI)

Use the following command to enable Application Live View using the Azure CLI:

```azurecli
az spring application-live-view create \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name>
```

To access the Application Live View dashboard, you must enable Dev Tools Portal and assign a public endpoint. Use the following command to enable Dev Tools Portal and assign a public endpoint:

```azurecli
az spring dev-tool create \
   --resource-group <resource-group-name> \
   --service <Azure-Spring-Apps-service-instance-name> \
   --assign-endpoint
```

---

## Next steps

- [Azure Spring Apps](index.yml)
