---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.custom: event-tier1-build-2022, devx-track-azurecli
ms.topic: include
ms.date: 07/19/2023
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to deploy to Azure Spring Apps with standard consumption plan.

[!INCLUDE [deploy-event-driven-app-with-standard-consumption-plan](includes/quickstart-deploy-event-driven-app/deploy-event-driven-app-basic-standard-plan.md)]

-->

## 2. Prepare the Spring project

Use the following steps to prepare the sample locally.

[!INCLUDE [prepare-spring-project-event-driven](../../includes/quickstart-deploy-event-driven-app/prepare-spring-project-git-event-driven.md)]

## 3. Prepare the cloud environment

The main resources you need to run this sample are an Azure Spring Apps instance and an Azure Service Bus instance. Use the following steps to create these resources.

### 3.1. Provide names for each resource

Create variables to hold the resource names by using the following commands. Be sure to replace the placeholders with your own values.

```azurecli
export RESOURCE_GROUP=<event-driven-app-resource-group-name>
export LOCATION=<desired-region>
export SERVICE_BUS_NAME_SPACE=<event-driven-app-service-bus-namespace>
export AZURE_CONTAINER_APPS_ENVIRONMENT=<Azure-Container-Apps-environment-name>
export AZURE_SPRING_APPS_INSTANCE=<Azure-Spring-Apps-instance-name>
export APP_NAME=<event-driven-app-name>
```

### 3.2. Create a new resource group

Use the following steps to create a new resource group:

1. Use the following command to sign in to the Azure CLI:

   ```azurecli
   az login
   ```

1. Use the following command to set the default location:

   ```azurecli
   az configure --defaults location=${LOCATION}
   ```

1. Use the following command to list all available subscriptions to determine the subscription ID to use:

   ```azurecli
   az account list --output table
   ```

1. Use the following command to set the default subscription:

   ```azurecli
   az account set --subscription <subscription-ID>
   ```

1. Use the following command to create a resource group:

   ```azurecli
   az group create --resource-group ${RESOURCE_GROUP}
   ```

1. Use the following command to set the newly created resource group as the default resource group:

   ```azurecli
   az configure --defaults group=${RESOURCE_GROUP}
   ```

### 3.3. Install extensions and register namespaces

Use the following commands to install the Azure Container Apps extension for the Azure CLI and register these namespaces: `Microsoft.App`, `Microsoft.OperationalInsights`, and `Microsoft.AppPlatform`:

```azurecli
az extension add --name spring --upgrade
az extension add --name containerapp --upgrade
az provider register --namespace Microsoft.App
az provider register --namespace Microsoft.OperationalInsights
az provider register --namespace Microsoft.AppPlatform
```

### 3.4. Create an Azure Container Apps environment instance

The Azure Container Apps environment creates a secure boundary around a group of applications. Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace.

Use the following command to create the environment:

```azurecli
az containerapp env create \
    --name ${AZURE_CONTAINER_APPS_ENVIRONMENT} \
    --enable-workload-profiles
```

### 3.5. Create an Azure Spring Apps instance

An Azure Spring Apps service instance hosts the Spring event-driven app. Use the following steps to create the service instance and then create an app inside the instance:

1. Get the Azure Container Apps environment resource ID by using the following command:

   ```azurecli
   export MANAGED_ENV_RESOURCE_ID=$(az containerapp env show \
       --name ${AZURE_CONTAINER_APPS_ENVIRONMENT} \
       --query id \
       --output tsv)
   ```

1. Use the following command to create your Azure Spring Apps instance, specifying the resource ID of the Azure Container Apps environment you created:

   ```azurecli
   az spring create \
       --name ${AZURE_SPRING_APPS_INSTANCE} \
       --managed-environment ${MANAGED_ENV_RESOURCE_ID} \
       --sku standardGen2
   ```

### 3.6. Create an app in your Azure Spring Apps instance

The following sections show you how to create an app in either the standard consumption or dedicated workload profiles.

> [!IMPORTANT]
> The consumption workload profile has a pay-as-you-go billing model, with no starting cost. You're billed for the dedicated workload profile based on the provisioned resources. For more information, see [Workload profiles in Consumption + Dedicated plan structure environments in Azure Container Apps (preview)](../../../container-apps/workload-profiles-overview.md) and [Azure Spring Apps pricing](https://azure.microsoft.com/pricing/details/spring-apps/).

#### 3.6.1. Create an app with the consumption workload profile

Use the following command to create an app in the Azure Spring Apps instance:

```azurecli
az spring app create \
    --service ${AZURE_SPRING_APPS_INSTANCE} \
    --name ${APP_NAME} \
    --cpu 1 \
    --memory 2Gi \
    --min-replicas 1 \
    --max-replicas 2 \
    --runtime-version Java_17
```

#### 3.6.2. (Optional) Create an app with the dedicated workload profile

>[!NOTE]
> This step is optional. Use this step only if you wish to create apps in the dedicated workload profile.

Dedicated workload profiles support running apps with customized hardware and increased cost predictability. Use the following command to create a dedicated workload profile:

```azurecli
az containerapp env workload-profile set \
    --name ${AZURE_CONTAINER_APPS_ENVIRONMENT} \
    --workload-profile-name my-wlp \
    --workload-profile-type D4 \
    --min-nodes 1 \
    --max-nodes 2
```

Then, use the following command to create an app with the dedicated workload profile:

```azurecli
az spring app create \
    --service ${AZURE_SPRING_APPS_INSTANCE} \
    --name ${APP_NAME} \
    --cpu 1 \
    --memory 2Gi \
    --min-replicas 1 \
    --max-replicas 2 \
    --runtime-version Java_17 \
    --assign-endpoint true \
    --workload-profile my-wlp
```

### 3.7. Create a Service Bus instance

Use the following command to create a Service Bus namespace:

```azurecli
az servicebus namespace create --name ${SERVICE_BUS_NAME_SPACE}
```

Then, use the following commands to create two queues named `lower-case` and `upper-case`:

```azurecli
az servicebus queue create \
    --namespace-name ${SERVICE_BUS_NAME_SPACE} \
    --name lower-case
az servicebus queue create \
    --namespace-name ${SERVICE_BUS_NAME_SPACE} \
    --name upper-case
```

### 3.8. Connect app instance to Service Bus instance

Now, both the Service Bus and the app in Azure Spring Apps have been created, but the app can't connect to the Service Bus. Use the following steps to enable the app to connect to the Service Bus:

1. Get the Service Bus's connection string by using the following command:

   ```azurecli
   export SERVICE_BUS_CONNECTION_STRING=$( \
       az servicebus namespace authorization-rule keys list \
           --namespace-name ${SERVICE_BUS_NAME_SPACE} \
           --name RootManageSharedAccessKey \
           --query primaryConnectionString \
           --output tsv)
   ```

1. Use the following command to provide the connection string to the app through an environment variable:

   ```azurecli
   az spring app update \
       --service ${AZURE_SPRING_APPS_INSTANCE} \
       --name ${APP_NAME} \
       --env SPRING_CLOUD_AZURE_SERVICEBUS_CONNECTIONSTRING=${SERVICE_BUS_CONNECTION_STRING} \
             SPRING_CLOUD_AZURE_KEYVAULT_SECRET_PROPERTYSOURCEENABLED=false
   ```

## 4. Deploy the app to Azure Spring Apps

Now the cloud environment is ready. Deploy the app by using the following command:

```azurecli
az spring app deploy \
    --service ${AZURE_SPRING_APPS_INSTANCE} \
    --name ${APP_NAME} \
    --artifact-path target/simple-event-driven-app-0.0.1-SNAPSHOT.jar
```
