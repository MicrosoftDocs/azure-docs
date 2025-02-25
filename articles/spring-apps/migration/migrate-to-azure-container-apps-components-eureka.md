---
title: Migrate Eureka Server to Eureka Server for Spring in Azure Container Apps
description: Describes how to migrate Eureka Server to Eureka Server for Spring in Azure Container Apps.
author: KarlErickson
ms.author: dixue
ms.service: azure-spring-apps
ms.topic: upgrade-and-migration-article
ms.date: 01/29/2025
ms.custom: devx-track-java, devx-track-extended-java
---

# Migrate Eureka Server or Tanzu Service Registry to managed Eureka Server for Spring in Azure Container Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Basic/Standard ✅ Enterprise

This article describes how to migrate Eureka Server to Eureka Server for Spring in Azure Container Apps.

Azure Container Apps' managed Eureka Server for Spring offers a similar experience to Azure Spring Apps. It enables you to deploy existing Spring applications without modifying their source code and register them with the managed Eureka Server.

## Prerequisites

- An existing Azure Spring Apps Enterprise plan instance with the Tanzu Service Registry enabled.
- An existing Azure container app environment used to deploy applications. For more information, see [Provision Azure Container Apps](migrate-to-azure-container-apps-provision.md).
- A container image of the application acting as a Eureka client. If necessary, you can use the sample image `mcr.microsoft.com/javacomponents/samples/sample-service-eureka-client:latest`.
- [Azure CLI](/cli/azure/install-azure-cli).

## Provision managed Eureka Server for Spring

To use the Managed Eureka Server for Spring, you first need to create the Eureka Server component within your Azure Container Apps environment.

To create the managed Eureka Server for Spring, use the following steps:

#### [Azure CLI](#tab/Azure-CLI)

1. To create the Eureka Server for Spring Java component, use the following command:

   ```azurecli
   az containerapp env java-component eureka-server-for-spring create \
       --resource-group $RESOURCE_GROUP \
       --name $EUREKA_COMPONENT_NAME \
       --environment $ENVIRONMENT
   ```

1. (Optional) To update the Eureka Server for Spring Java component configuration, use the following command:

   ```azurecli
   az containerapp env java-component eureka-server-for-spring update \
       --resource-group $RESOURCE_GROUP \
       --name $EUREKA_COMPONENT_NAME \
       --environment $ENVIRONMENT \
       --configuration eureka.server.renewal-percent-threshold=0.85 eureka.server.eviction-interval-timer-in-ms=10000
   ```

#### [Azure portal](#tab/Azure-portal)

1. Go to your container app environment in the Azure portal.

1. On the service menu, under **Services**, select **Services**.

1. Select the **Configure** dropdown, then select **Java component**.

1. On the **Configure Java component** pane, enter the following values:

   | Property            | Value                                |
   | :------------------ | :----------------------------------- |
   | Java component type | Select **Eureka Server for Spring**. |
   | Java component name | Enter **eureka**.                    |

1. Select **Next**.

1. On the **Review** tab, select **Configure**.

---

When you delete the managed Eureka Server through the Azure portal, Azure Container Apps automatically unbinds all container apps registered with it and deletes the managed Eureka Server. This behavior differs from the Azure Spring Apps Enterprise Plan, where you must manually unbind services before deleting the Tanzu Service Registry.

### Resource allocation and pricing

The container resource allocation for the managed Eureka Server in Azure Container Apps is fixed to the following values:

- **CPU**: 0.5 vCPU
- **Memory**: 1 Gi
- **Replicas**: 1 - not scalable

In comparison, the Azure Spring Apps Enterprise Plan Service Registry also provisions fixed resources but includes two replicas, each with 0.5 vCPU and 1 Gi memory.

Unlike the Basic/Standard plans in Azure Spring Apps, which aren't charged, the managed Eureka Server for Spring in Azure Container Apps operates under consumption-based pricing. This pricing is similar to the pricing of the Azure Spring Apps Enterprise Plan.

For more information, see the [Considerations](../../container-apps/java-eureka-server.md#considerations) section of [Tutorial: Connect to a managed Eureka Server for Spring in Azure Container Apps](../../container-apps/java-eureka-server.md).

## Deploy and bind an application

After you provision the managed Eureka Server for Spring, you can deploy your Spring application to Azure Container Apps and bind it to the Eureka Server. This process is similar to how the Enterprise Plan works in Azure Spring Apps. Specifically, you need to bind your application to the Eureka Server, which is different from the Azure Spring Apps Basic/Standard Plan where no binding is required.

> [!NOTE]
> If you aren't using the sample image `mcr.microsoft.com/javacomponents/samples/sample-service-eureka-client:latest` to deploy an application, you might need to do some configuration to enable Azure Container Apps to pull images from your container registry. For example, to prepare the necessary permissions to pull images from Azure Container Registry (ACR), see the [Create an Azure Container Registry](../../container-apps/tutorial-code-to-cloud.md#create-an-azure-container-registry) section of [Tutorial: Build and deploy your app to Azure Container Apps](../../container-apps/tutorial-code-to-cloud.md).

### Deploy the application

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to create a container application:

```azurecli
az containerapp create \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --environment $ENVIRONMENT \
    --image $IMAGE \
    --min-replicas 1 \
    --max-replicas 1 \
    --ingress external \
    --target-port 8080 \
    --query properties.configuration.ingress.fqdn
```

#### [Azure portal](#tab/Azure-portal)

Use the following steps to create a container app via the Azure portal:

1. In the search bar, search for **Container Apps**.

1. In the search results, select **Container Apps**.

1. Select **Create**.

1. In the **Basics** tab, fill in values for **subscription**, **resource group**, and **container app name**. For **deployment source**, keep the default value **Container image**.

1. Select the **Container** tab and configure your container image settings.

1. Select **Review and create**.

   If no errors are found, the **Create** button is enabled.

   If there are errors, any tab containing errors is marked with a red dot. Navigate to the appropriate tab. Fields containing an error are highlighted in red. After you fix all errors, select **Review and create** again.

1. Select **Create**

---

### Bind the application

After you successfully create the application, you can bind the application to the managed Eureka Server.

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to bind the created application to the Eureka Server:

```azurecli
az containerapp update \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --bind $EUREKA_COMPONENT_NAME \
    --query properties.configuration.ingress.fqdn
```

#### [Azure portal](#tab/Azure-portal)

Use the following steps to bind the created application to the Eureka Server via the Azure portal:

1. In the Azure portal, go to your container app environment.
1. On the service menu, under **Services**, select **Services**.
1. From the list, select **eureka**.
1. Under **bindings**, select the **App name** dropdown, and then select your target container app.
1. Select the **Review** tab.
1. Select **Configure**.

---

The binding injects several configurations into the application as environment variables, primarily the `eureka.client.service-url.defaultZone` property. This property indicates the internal endpoint of the Eureka Server Java component. For more information about other properties, see the [Bind your container app to the Eureka Server for Spring Java component](../../container-apps/java-eureka-server.md?tabs=azure-cli#bind-your-container-app-to-the-eureka-server-for-spring-java-component) section of [Connect to a managed Eureka Server for Spring in Azure Container Apps](../../container-apps/java-eureka-server.md?tabs=azure-cli).

If you need to unbind your application from Eureka Server, see the [Unbind your container app from the Eureka Server for Spring Java component](../../container-apps/java-eureka-server.md?tabs=azure-portal#optional-unbind-your-container-app-from-the-eureka-server-for-spring-java-component) section of [Connect to a managed Eureka Server for Spring in Azure Container Apps](../../container-apps/java-eureka-server.md).

### View the registered applications with a dashboard

After you successfully create your application and bind it to the Eureka Server, you can view the registered applications through a management dashboard. For more information, see the [View the application through a dashboard](../../container-apps/java-eureka-server.md#view-the-application-through-a-dashboard) section of [Connect to a managed Eureka Server for Spring in Azure Container Apps](../../container-apps/java-eureka-server.md).

The following screenshot shows an example of what the Eureka Server dashboard looks like:

:::image type="content" source="media/migrate-to-azure-container-apps-components-eureka/azure-container-apps-eureka-server-dashboard.png" alt-text="Screenshot of Eureka Server dashboard." lightbox="media/migrate-to-azure-container-apps-components-eureka/azure-container-apps-eureka-server-dashboard.png":::

## Troubleshooting

You can view logs for the managed Eureka Server for Spring in Azure Container Apps using **Log Analytics**, which works similarly to the logging mechanism in Azure Spring Apps.

To view managed Eureka Server for Spring logs in Azure Container Apps, use the following steps:

1. Go to the **Container App Environment** page.
1. Go to **Monitoring** > **Logging options**, and, under **Logs Destination**, ensure **Azure Log Analytics** is selected.
1. Go to **Monitoring** > **Logs**.
1. (Optional) If the Log analytics scope doesn't match the one configured in **Logging options**, select **Select scope** to choose the correct log analytics workspace.
1. Enter your query into the query editor to view logs from the **ContainerAppSystemLogs_CL** table, as shown in the following example:

   ```kusto
   ContainerAppSystemLogs_CL
   | where ComponentType_s == "SpringCloudEureka"
   | project Time=TimeGenerated, ComponentName=ComponentName_s, Message=Log_s
   | take 100
   ```

   :::image type="content" source="media/migrate-to-azure-container-apps-components-eureka/azure-container-apps-eureka-log-analytics.png" alt-text="Screenshot of querying log analytics for Eureka Server." lightbox="media/migrate-to-azure-container-apps-components-eureka/azure-container-apps-eureka-log-analytics.png":::

For more information on querying logs using the Azure CLI, see [Monitor logs in Azure Container Apps with Log Analytics](../../container-apps/log-monitoring.md?tabs=bash).

## Known limitations

- External access: The managed Eureka Server for Spring in Azure Container Apps can't be accessed externally.
- Revision traffic: In Azure Container Apps' multiple revision mode, all replicas of the application registered in Eureka receive traffic.

## More resources

For more information on managing Eureka Server in Azure Container Apps, see [Tutorial: Connect to a managed Eureka Server for Spring in Azure Container Apps](../../container-apps/java-eureka-server.md?tabs=azure-cli).
