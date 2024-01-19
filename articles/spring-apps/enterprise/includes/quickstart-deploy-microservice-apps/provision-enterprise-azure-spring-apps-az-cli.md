---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 01/19/2023
---

<!-- 
To reuse the Spring Apps instance creation steps in other articles, a separate markdown file is used to describe how to provision enterprise Spring Apps instance with Azure CLI.

[!INCLUDE [provision-enterprise-azure-spring-apps-az-cli](provision-enterprise-azure-spring-apps-az-cli.md)]

-->

### 3.1. Provide names for each resource

Create variables to hold the resource names by using the following commands. Be sure to replace the placeholders with your own values.

```azurecli
export LOCATION=<location>
export RESOURCE_GROUP=myresourcegroup
export SPRING_APPS=myasa
export APPLICATION_INSIGHTS=<application-insights-name>
export SPRING_WORKSPACE=<log-analytics-workspace-name-for-spring-apps>
export INSIGHTS_WORKSPACE=<log-analytics-workspace-name-for-application-insight>
export APP_FRONTEND=frontend
export APP_CUSTOMERS_SERVICE=customers-service
export APP_VETS_SERVICE=vets-service
export APP_VISITS_SERVICE=visits-service
export GIT_CONFIG_REPO=default
```

### 3.2. Sign in to the Azure CLI

1. Use the following command to sign in to the Azure CLI:

   ```azurecli
   az login
   ```

1. Use the following command to list all available subscriptions to determine the subscription ID to use:

   ```azurecli
   az account list --output table
   ```

1. Use the following command to set the default subscription:

   ```azurecli
   az account set --subscription <subscription-ID>
   ```

### 3.3. Create a new resource group

Use the following steps to create a new resource group:

1. Use the following command to set the default location:

   ```azurecli
   az configure --defaults location=${LOCATION}
   ```

1. Use the following command to create a resource group:

   ```azurecli
   az group create --resource-group ${RESOURCE_GROUP}
   ```

1. Use the following command to set the newly created resource group as the default resource group:

   ```azurecli
   az configure --defaults group=${RESOURCE_GROUP}
   ```

### 3.4. Install extension and register namespace

Use the following commands to install the Azure Spring Apps extension for the Azure CLI and register the namespace: `Microsoft.SaaS`:

```azurecli
az extension add --name spring --upgrade
az provider register --namespace Microsoft.SaaS
```

### 3.5. Create an Azure Spring Apps instance

Use the following steps to create the service instance:

1. Use the following command to accept the legal terms and privacy statements for the Enterprise plan:

   > [!NOTE]
   > This step is necessary only if your subscription has never been used to create an Enterprise plan instance of Azure Spring Apps.

   ```azurecli
   az term accept \
       --publisher vmware-inc \
       --product azure-spring-cloud-vmware-tanzu-2 \
       --plan asa-ent-hr-mtr
   ```

1. Use the following command to create an Azure Spring Apps service instance with the necessary Tanzu components:

   ```azurecli
   az spring create \
       --name ${SPRING_APPS} \
       --sku Enterprise \
       --enable-application-configuration-service \
       --enable-service-registry \
       --enable-gateway \
       --enable-application-live-view
   ```

### 3.6. Configure the Azure Spring Apps instance

1. Use the following commands to create Log Analytics Workspace to be used for your Azure Spring Apps service and Application Insights:

   ```azurecli
   az monitor log-analytics workspace create \
       --workspace-name ${SPRING_WORKSPACE}
   az monitor log-analytics workspace create \
       --workspace-name ${INSIGHTS_WORKSPACE}
   ```

1. Use the following command to create Application Insights to be used for your Azure Spring Apps instance:

   ```azurecli
   az monitor app-insights component create \
       --app ${APPLICATION_INSIGHTS} \
       --workspace ${INSIGHTS_WORKSPACE}
   ```

1. Use the following command to configure diagnostic settings for the Azure Spring Apps instance:

```azurecli
   export SPRING_APPS_RESOURCE_ID=$(az spring show --name ${SPRING_APPS} --query id --output tsv)
   az monitor diagnostic-settings create --name logs-and-metrics \
       --resource ${SPRING_APPS_RESOURCE_ID} --workspace ${SPRING_WORKSPACE} \
       --logs '[
         {
           "category": "ApplicationConsole",
           "enabled": true,
           "retentionPolicy": {
             "enabled": false,
             "days": 0
           }
         },
         {
            "category": "SystemLogs",
            "enabled": true,
            "retentionPolicy": {
              "enabled": false,
              "days": 0
            }
         },
         {
            "category": "IngressLogs",
            "enabled": true,
            "retentionPolicy": {
              "enabled": false,
              "days": 0
             }
         }
       ]' \
       --metrics '[
         {
           "category": "AllMetrics",
           "enabled": true,
           "retentionPolicy": {
             "enabled": false,
             "days": 0
           }
         }
       ]'
   ```

1. Use the following commands to create the Application Insights buildpack bindings:

   ```azurecli
   export INSIGHTS_CONNECTION_STRING=$(az monitor app-insights component show \
       --app ${APPLICATION_INSIGHTS} --query connectionString --output tsv)
   az spring build-service builder buildpack-binding set --service ${SPRING_APPS} \
       --name default --builder-name default --type ApplicationInsights \
       --properties sampling-percentage=10 connection-string=${INSIGHTS_CONNECTION_STRING}
   ```

1. Use the following commands to create applications for the Azure Spring Apps instance:

   ```azurecli
   az spring app create --service ${SPRING_APPS} --name ${APP_FRONTEND}
   az spring app create --service ${SPRING_APPS} --name ${APP_CUSTOMERS_SERVICE}
   az spring app create --service ${SPRING_APPS} --name ${APP_VETS_SERVICE}
   az spring app create --service ${SPRING_APPS} --name ${APP_VISITS_SERVICE}
   ```

1. Use the following commands to bind applications for the Service Registry:

   ```azurecli
   az spring service-registry bind --service ${SPRING_APPS} --app ${APP_CUSTOMERS_SERVICE}
   az spring service-registry bind --service ${SPRING_APPS} --app ${APP_VETS_SERVICE}
   az spring service-registry bind --service ${SPRING_APPS} --app ${APP_VISITS_SERVICE}
   ```

1. Use the following command to create a configuration repository for the Application Configuration instance:

   ```azurecli
   az spring application-configuration-service git repo add \
     --service ${SPRING_APPS} \
     --name ${GIT_CONFIG_REPO} \
     --patterns application,api-gateway,customers-service,vets-service,visits-service \
     --uri https://github.com/Azure-Samples/spring-petclinic-microservices-config.git \
     --label master
   ```

1. Use the following commands to bind applications to the Application Configuration Service:

   ```azurecli
   az spring application-configuration-service bind --service ${SPRING_APPS} --app ${APP_CUSTOMERS_SERVICE}
   az spring application-configuration-service bind --service ${SPRING_APPS} --app ${APP_VETS_SERVICE}
   az spring application-configuration-service bind --service ${SPRING_APPS} --app ${APP_VISITS_SERVICE}
   ```

1. Use the following command to assign an endpoint to Spring Cloud Gateway:

   ```azurecli
   az spring gateway update --service ${SPRING_APPS} --assign-endpoint
   ```

1. Use the following command to set routing for the **customers-service** app:

   ```azurecli
   az spring gateway route-config create \
       --name ${APP_CUSTOMERS_SERVICE} --service ${SPRING_APPS} \
       --app-name ${APP_CUSTOMERS_SERVICE} --routes-json '[
         {
           "predicates": [
             "Path=/api/customer/**"
           ],
           "filters": [
             "StripPrefix=2"
           ]
         }
      ]'
   ```

1. Use the following command to set routing for the **vets-service** app:

   ```azurecli
   az spring gateway route-config create \
       --name ${APP_VETS_SERVICE} --service ${SPRING_APPS} \
       --app-name ${APP_VETS_SERVICE} --routes-json '[
         {
           "predicates": [
             "Path=/api/vet/**"
           ],
           "filters": [
             "StripPrefix=2"
           ]
         }
       ]'
   ```

1. Use the following command to set routing for the **visits-service** app:

   ```azurecli
   az spring gateway route-config create \
       --name ${APP_VISITS_SERVICE} --service ${SPRING_APPS} \
       --app-name ${APP_VISITS_SERVICE} --routes-json '[
         {
           "predicates": [
             "Path=/api/visit/**"
           ],
           "filters": [
             "StripPrefix=2"
           ]
         }
       ]'
   ```

1. Use the following command to set routing for the **frontend** app:

   ```azurecli
   az spring gateway route-config create \
       --name ${APP_FRONTEND} --service ${SPRING_APPS} \
       --app-name ${APP_FRONTEND} --routes-json '[
         {
           "predicates": [
             "Path=/**"
           ],
           "filters": [
             "StripPrefix=0"
           ],
           "order": 1000
         }
       ]'
   ```

1. Use the following command to assign an endpoint to Application Live View:

   ```azurecli
   az spring dev-tool update --service ${SPRING_APPS} --assign-endpoint
   ```
