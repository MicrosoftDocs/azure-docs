---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 05/26/2022
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to deploy to Azure Spring Apps with standard consumption plan.

[!INCLUDE [deploy-event-driven-app-with-standard-consumption-plan](includes/quickstart/deploy-app-with-basic-standard-plan.md)]

-->

[!INCLUDE [prepare-spring-project-event-driven](../../includes/quickstart/prepare-spring-project.md)]

## 3 Provision

Use the following steps to create an Azure Spring Apps service instance.

### 3.1 Sign in to the Azure portal

1. Select **Open Cloudshell** and sign in to your Azure account in [Azure Cloud Shell](../../../cloud-shell/overview.md).

   ```azurecli-interactive
   az account show
   ```

1. Azure Cloud Shell workspaces are temporary. When first started, the shell prompts you to associate an Azure Storage instance with your subscription to persist files across sessions. For more information, see [Introduction to Azure Storage](../../../storage/common/storage-introduction.md).

   :::image type="content" source="../../includes/quickstart/azure-storage-subscription.png" alt-text="Screenshot of an Azure portal alert that no storage is mounted in the Azure Cloud Shell." lightbox="../../media/quickstart/azure-storage-subscription.png":::

1. After you sign in successfully, use the following command to display a list of your subscriptions:

   ```azurecli-interactive
   az account list --output table
   ```

1. Use the following command to set your default subscription:

   ```azurecli-interactive
   az account set --subscription <subscription-ID>
   ```

### 3.2 Provision an instance of Azure Spring Apps

1. Use the following commands to define variables for this quickstart with the names of your resources and desired settings:

   ```azurecli-interactive
   LOCATION="<region>"
   RESOURCE_GROUP="<resource-group-name>"
   MANAGED_ENVIRONMENT="<Azure-Container-Apps-environment-name>"
   SERVICE_NAME="<Azure-Spring-Apps-instance-name>"
   APP_NAME="demo"
   ```

1. Use the following command to create a resource group:

   ```azurecli-interactive
   az group create \
       --resource-group ${RESOURCE_GROUP} \
       --location ${LOCATION}
   ```

1. An Azure Container Apps environment creates a secure boundary around a group of applications. Apps deployed to the same environment are deployed in the same virtual network and write logs to the same log analytics workspace. For more information, see [Log Analytics workspace overview](../../../azure-monitor/logs/log-analytics-workspace-overview.md). Use the following command to create the environment:

   ```azurecli-interactive
   az containerapp env create \
       --resource-group ${RESOURCE_GROUP} \
       --name ${MANAGED_ENVIRONMENT} \
       --location ${LOCATION} \
       --enable-workload-profiles
   ```

1. Use the following command to create a variable to store the environment resource ID:

   ```azurecli-interactive
   MANAGED_ENV_RESOURCE_ID=$(az containerapp env show \
       --resource-group ${RESOURCE_GROUP} \
       --name ${MANAGED_ENVIRONMENT} \
       --query id \
       --output tsv)
   ```

1. Use the following command to create an Azure Spring Apps service instance. An instance of the Azure Spring Apps Standard consumption and dedicated plan is built on top of the Azure Container Apps environment. Create your Azure Spring Apps instance by specifying the resource ID of the environment you created.

   ```azurecli-interactive
   az spring create \
       --resource-group ${RESOURCE_GROUP} \
       --name ${SERVICE_NAME} \
       --managed-environment ${MANAGED_ENV_RESOURCE_ID} \
       --sku standardGen2 \
       --location ${LOCATION}
   ```

### 3.3 Create an app in your Azure Spring Apps instance

An *App* is an abstraction of one business app. For more information, see [App and deployment in Azure Spring Apps](../../concept-understand-app-and-deployment.md). Apps run in an Azure Spring Apps service instance, as shown in the following diagram.

:::image type="content" source="../../media/spring-cloud-app-and-deployment/app-deployment-rev.png" alt-text="Diagram showing the relationship between apps and an Azure Spring Apps service instance." border="false":::

You can create an app in either standard consumption or dedicated workload profiles.

> [!IMPORTANT]
> The consumption workload profile has a pay-as-you-go billing model with no starting cost. You're billed for the dedicated workload profile based on the provisioned resources. For more information, see [Workload profiles in Consumption + Dedicated plan structure environments in Azure Container Apps (preview)](../../../container-apps/workload-profiles-overview.md) and [Azure Spring Apps pricing](https://azure.microsoft.com/pricing/details/spring-apps/).

### 3.2.1 Create an app with consumption workload profile

Use the following command to specify the app name on Azure Spring Apps and to allocate required resources:

```azurecli-interactive
az spring app create \
    --resource-group ${RESOURCE_GROUP} \
    --service ${SERVICE_NAME} \
    --name ${APP_NAME} \
    --cpu 1 \
    --memory 2Gi \
    --runtime-version Java_17 \
    --min-replicas 1 \
    --max-replicas 2 \
    --assign-endpoint true
```

Azure Spring Apps creates an empty welcome application and provides its URL in the field named `properties.url`.

:::image type="content" source="../../media/quickstart/app-welcome-page.png" alt-text="Screenshot of the welcome page for a Spring app in an Azure Spring Apps instance." lightbox="../../media/quickstart/app-welcome-page.png":::

### 3.2.2 Create an app with dedicated workload profile

Dedicated workload profiles support running apps with customized hardware and increased cost predictability.

Use the following command to create a dedicated workload profile:

```azurecli-interactive
az containerapp env workload-profile set \
    --resource-group ${RESOURCE_GROUP} \
    --name ${MANAGED_ENVIRONMENT} \
    --workload-profile-name my-wlp \
    --workload-profile-type D4 \
    --min-nodes 1 \
    --max-nodes 2
```

Then, use the following command to create an app with the dedicated workload profile:

```azurecli-interactive
az spring app create \
   --resource-group ${RESOURCE_GROUP} \
   --service ${SERVICE_NAME} \
   --name ${APP_NAME} \
   --cpu 1 \
   --memory 2Gi \
   --runtime-version Java_17 \
   --min-replicas 1 \
   --max-replicas 2 \
   --assign-endpoint true \
   --workload-profile my-wlp
```

## 4 Deployment

Use the following command to deploy the *.jar* file for the app:

```azurecli-interactive
az spring app deploy \
    --resource-group ${RESOURCE_GROUP} \
    --service ${SERVICE_NAME} \
    --name ${APP_NAME} \
    --artifact-path target/demo-0.0.1-SNAPSHOT.jar
```

Deploying the application can take a few minutes.
