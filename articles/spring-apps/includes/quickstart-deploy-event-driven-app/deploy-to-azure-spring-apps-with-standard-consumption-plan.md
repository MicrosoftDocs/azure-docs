---
author: karlerickson
ms.author: caiqing
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 02/09/2022
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to deploy to Azure Spring Apps with standard consumption plan.

[!INCLUDE [deploy-to-azure-spring-apps-with-standard-consumption-plan](includes/quickstart-deploy-event-driven-app/deploy-to-azure-spring-apps-with-basic-standard-plan.md)]

-->

## 2 Prepare Spring Project

Use the following steps to prepare the sample locally.

1. The sample project is ready on GitHub. Clone sample project by using the following command:

   ```bash
   git clone https://github.com/Azure-Samples/ASA-Samples-Event-Driven-Application.git
   ```

1. Build the sample project by using the following commands:

   ```bash
   cd ASA-Samples-Event-Driven-Application
   ./mvnw clean package -DskipTests
   ```

## 3 Provision

The main resources you need to run this sample is an Azure Spring Apps instance and an Azure Service Bus instance. Use the following steps to create these resources.

### 3.1 Resource naming and command default configuration

1. Use the following commands to create variables for the names of your resources and for other settings as needed. Resource names in Azure must be unique.

   ```azurecli
   RESOURCE_GROUP=<event-driven-app-resource-group-name>
   LOCATION=<desired-region>
   SERVICE_BUS_NAME_SPACE=<event-driven-app-service-bus-namespace>
   AZURE_CONTAINER_APPS_ENVIRONMENT=<Azure-Container-Apps-environment-name>
   AZURE_SPRING_APPS_INSTANCE=<Azure-Spring-Apps-instance-name>
   APP_NAME=<event-driven-app-name>
   ```

2. Use the following command to sign in to Azure:

   ```azurecli
   az login
   ```

1. Use the following command to set the default location:

   ```azurecli
   az configure --defaults location=${LOCATION}
   ```

1. Use the following command to list all available subscriptions, then determine the ID for the subscription you want to use.

   ```azurecli
   az account list --output table
   ```

1. Use the following command to set your default subscription:

   ```azurecli
   az account set --subscription <subscription-ID>
   ```

1. Use the following command to create a resource group:

   ```azurecli
   az group create --resource-group ${RESOURCE_GROUP}
   ```

1. Use the following command to set the newly created resource group as the default resource group.

   ```azurecli
   az configure --defaults group=${RESOURCE_GROUP}
   ```

### 3.2 Create a Service Bus instance

Use the following command to create a Service Bus namespace:

```azurecli
az servicebus namespace create --name ${SERVICE_BUS_NAME_SPACE}
```

### 3.3 Create queues in your Service Bus instance

Use the following commands to create two queues named `lower-case` and `upper-case`:

```azurecli
az servicebus queue create \
    --namespace-name ${SERVICE_BUS_NAME_SPACE} \
    --name lower-case
az servicebus queue create \
    --namespace-name ${SERVICE_BUS_NAME_SPACE} \
    --name upper-case
```

### 3.4 Create an Azure Container Apps environment

The Azure Container Apps environment creates a secure boundary around a group of applications. Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace.

Use the following steps to create the environment:

1. Use the following command to create the environment:

   ```azurecli
   az containerapp env create --name ${AZURE_CONTAINER_APPS_ENVIRONMENT} --enable-workload-profiles
   ```

### 3.5 Create the Azure Spring Apps instance

An Azure Spring Apps service instance hosts the Spring event-driven app. Use the following steps to create the service instance and then create an app inside the instance.

1. Get the Azure Container Apps environment resource ID by using the following command:

   ```azurecli
   MANAGED_ENV_RESOURCE_ID=$(az containerapp env show \
       --name ${AZURE_CONTAINER_APPS_ENVIRONMENT} \
       --query id \
       --output tsv)
   ```

1. Use the following command to create your Azure Spring Apps instance, specifying the resource ID of the Azure Container Apps environment you created.

   ```azurecli
   az spring create \
       --name ${AZURE_SPRING_APPS_INSTANCE} \
       --managed-environment ${MANAGED_ENV_RESOURCE_ID} \
       --sku standardGen2
   ```

### 3.6 Create an app in your Azure Spring Apps instance

The following sections show you how to create an app in either the standard consumption or dedicated workload profiles.

> [!IMPORTANT]
> The Consumption workload profile has a pay-as-you-go billing model, with no starting cost. You're billed for the dedicated workload profile based on the provisioned resources. For more information, see [Workload profiles in Consumption + Dedicated plan structure environments in Azure Container Apps (preview)](../../../container-apps/workload-profiles-overview.md) and [Azure Spring Apps pricing](https://azure.microsoft.com/pricing/details/spring-apps/).

#### 3.6.1 Create an app with the consumption workload profile

Use the following command to create an app in the Azure Spring Apps instance:

```azurecli
az spring app create \
    --service ${AZURE_SPRING_APPS_INSTANCE} \
    --name ${APP_NAME} \
    --cpu 1 \
    --memory 2 \
    --min-replicas 2 \
    --max-replicas 2 \
    --runtime-version Java_17 \
    --assign-endpoint true
```

#### 3.6.2 Create an app with the dedicated workload profile

Dedicated workload profiles support running apps with customized hardware and increased cost predictability.

Use the following command to create a dedicated workload profile:

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
    --min-replicas 2 \
    --max-replicas 2 \
    --runtime-version Java_17 \
    --assign-endpoint true \
    --workload-profile my-wlp
```

### 3.7 Bind the Service Bus to Azure Spring Apps and deploy the app

Now both the Service Bus and the app in Azure Spring Apps have been created, but the app can't connect to the Service Bus. Use the following steps to enable the app to connect to the Service Bus, and then deploy the app.

1. Get the Service Bus's connection string by using the following command:

   ```azurecli
   SERVICE_BUS_CONNECTION_STRING=$(az servicebus namespace authorization-rule keys list \
       --namespace-name ${SERVICE_BUS_NAME_SPACE} \
       --name RootManageSharedAccessKey \
       --query primaryConnectionString \
       --output tsv)
   ```

## 4 Deployment

1. Use the following command to provide the connection string to the app through an environment variable.

   ```azurecli
   az spring app update \
       --service ${AZURE_SPRING_APPS_INSTANCE} \
       --name ${APP_NAME} \
       --env SERVICE-BUS-CONNECTION-STRING=${SERVICE_BUS_CONNECTION_STRING} spring.cloud.azure.keyvault.secret.property-source-enabled=false
   ```

1. Now the cloud environment is ready. Deploy the app by using the following command.

   ```azurecli
   az spring app deploy \
       --service ${AZURE_SPRING_APPS_INSTANCE} \
       --name ${APP_NAME} \
       --artifact-path target/simple-event-driven-app-0.0.1-SNAPSHOT.jar
   ```
