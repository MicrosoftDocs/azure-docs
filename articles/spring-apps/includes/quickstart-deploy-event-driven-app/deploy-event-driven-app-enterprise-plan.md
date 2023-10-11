---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.custom: event-tier1-build-2022, devx-track-azurecli
ms.topic: include
ms.date: 07/19/2023
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to deploy to Azure Spring Apps with Enterprise plan.

[!INCLUDE [deploy-event-driven-app-with-enterprise-plan](includes/quickstart-deploy-event-driven-app/deploy-event-driven-app-enterprise-plan.md)]

-->

## 2. Prepare the Spring project

Use the following steps to prepare the sample locally.

### [Azure portal](#tab/Azure-portal-ent)

The **Deploy to Azure** button in the next section launches an Azure portal experience that downloads a JAR package from the [ASA-Samples-Web-Application releases](https://github.com/Azure-Samples/ASA-Samples-Web-Application/releases) page on GitHub. No local preparation steps are needed.

### [Azure CLI](#tab/Azure-CLI)

[!INCLUDE [prepare-spring-project-git-event-driven](prepare-spring-project-git-event-driven.md)]

---

## 3. Prepare the cloud environment

The main resources you need to run this sample are an Azure Spring Apps instance and an Azure Service Bus instance. Use the following steps to create these resources.

### [Azure portal](#tab/Azure-portal-ent)

[!INCLUDE [prepare-cloud-environment-on-azure-portal](event-driven-prepare-cloud-env-enterprise-azure-portal.md)]

### [Azure CLI](#tab/Azure-CLI)

### 3.1. Provide names for each resource

Create variables to hold the resource names by using the following commands. Be sure to replace the placeholders with your own values.

```azurecli
export RESOURCE_GROUP=<event-driven-app-resource-group-name>
export LOCATION=<desired-region>
export SERVICE_BUS_NAME_SPACE=<event-driven-app-service-bus-namespace>
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

### 3.3. Install extension and register namespace

Use the following commands to install the Azure Spring Apps extension for the Azure CLI and register the `Microsoft.SaaS` namespace:

```azurecli
az extension add --name spring --upgrade
az provider register --namespace Microsoft.SaaS
```

### 3.4. Create an Azure Spring Apps instance

Use the following command to create your Azure Spring Apps instance:

```azurecli
az spring create \
    --name ${AZURE_SPRING_APPS_INSTANCE} \
    --sku Enterprise
```

Then, use the following command to create an app in the Azure Spring Apps instance:

```azurecli
az spring app create \
    --service ${AZURE_SPRING_APPS_INSTANCE} \
    --name ${APP_NAME}
```

### 3.5. Create a Service Bus instance

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

### 3.6. Connect app instance to Service Bus instance

Now, both the Service Bus and the app in Azure Spring Apps have been created, but the app can't connect to the Service Bus. Use the following steps to enable the app to connect to the Service Bus, and then deploy the app:

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

---

## 4. Deploy the app to Azure Spring Apps

Now the cloud environment is ready. Deploy the app by using the following command:

### [Azure portal](#tab/Azure-portal-ent)

The **Deploy to Azure** button in the previous section launches an Azure portal experience that includes application deployment, so nothing else is needed.

### [Azure CLI](#tab/Azure-CLI)

```azurecli
az spring app deploy \
    --service ${AZURE_SPRING_APPS_INSTANCE} \
    --name ${APP_NAME} \
    --artifact-path target/simple-event-driven-app-0.0.2-SNAPSHOT.jar
```

---
