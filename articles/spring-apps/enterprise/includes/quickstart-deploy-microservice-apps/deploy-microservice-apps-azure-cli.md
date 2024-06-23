---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.custom: devx-track-azurecli
ms.topic: include
ms.date: 02/01/2024
---

<!--
To reuse the Spring Apps instance deployment steps in other articles, a separate markdown file is used to describe how to deploy app to Spring Apps instance with Azure CLI.

[!INCLUDE [deploy-microservice-apps-azure-cli](deploy-microservice-apps-azure-cli.md)]

-->

Use the following steps to deploy the apps:

1. Enter the project root directory and use the following command to build and deploy the frontend application:

   ```azurecli
   az spring app deploy \
       --service ${SPRING_APPS} \
       --name ${APP_FRONTEND} \
       --build-env BP_WEB_SERVER=nginx \
       --source-path ./spring-petclinic-frontend
   ```

1. Use the following command to build and deploy the `customers-service` application:

   ```azurecli
   az spring app deploy \
       --service ${SPRING_APPS} \
       --name ${APP_CUSTOMERS_SERVICE} \
       --source-path \
       --config-file-pattern application,customers-service \
       --build-env \
           BP_MAVEN_BUILT_MODULE=spring-petclinic-customers-service \
           BP_JVM_VERSION=17
   ```

1. Use the following command to build and deploy the `vets-service` application:

   ```azurecli
   az spring app deploy \
       --service ${SPRING_APPS} \
       --name ${APP_VETS_SERVICE} \
       --source-path \
       --config-file-pattern application,vets-service \
       --build-env \
           BP_MAVEN_BUILT_MODULE=spring-petclinic-vets-service \
           BP_JVM_VERSION=17
   ```

1. Use the following command to build and deploy the `visits-service` application:

   ```azurecli
   az spring app deploy \
       --service ${SPRING_APPS} \
       --name ${APP_VISITS_SERVICE} \
       --source-path \
       --config-file-pattern application,visits-service \
       --build-env \
           BP_MAVEN_BUILT_MODULE=spring-petclinic-visits-service \
           BP_JVM_VERSION=17
   ```
