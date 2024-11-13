---
title: Launch your first Java microservice applications with managed Java components in Azure Container Apps
description: Learn how to deploy a Java microservice project in Azure Container Apps with managed Java components.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-extended-java
ms.topic: quickstart
ms.date: 11/12/2024
ms.author: cshoe
---

# Tutorial: Launch your first Java microservice applications with managed Java components in Azure Container Apps

In this article, you learn how to deploy an application that uses Java components to handle configuration management, service discovery, and manage health and metrics. The sample application used in this example is the Java PetClinic sample which uses the microservice architecture pattern. The following diagram depicts the architecture of the PetClinic application on Azure Container Apps.

:::image type="content" source="media/java-deploy-war-file/azure-container-apps-petclinic-arch.png" alt-text="Architecture of pet clinic app." lightbox="media/java-deploy-war-file/azure-container-apps-petclinic-arch.png":::

The PetClinic application includes the following features:

* The frontend app is standalone Node.js web application hosted on the API Gateway app.
* Requests to API Gateway routes requests to backend service apps.
* Backend apps are built with Spring Boot.
* Each backend app uses HyperSQL DataBase as the persistent store.
* The apps use managed Java components on Azure Container Apps, including Service Registry, Config Server, and Admin Server.
* The config server reads data from a Git repository.
* Log Analytics workspace is responsible for logging server data.

In this tutorial you:

> [!div class="checklist"]
> * Create Config Server, Eureka Server, Admin and admin components
> * Create a series of microservice applications
> * Bind the server components to your microservices apps
> * Deploy the collection of applications
> * Review the deployed apps

By the end of this article, you deploy one web application and three backend applications that are configured to work with three different Java components. You can then manage each component via the Azure portal.

## Prerequisites

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).<br><br>You need the *Contributor* or *Owner* permission on the Azure subscription to proceed. <br><br>Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml?tabs=current) for details. |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|
| Container Apps CLI extension | Use version `0.3.47` or higher. Use the `az extension add --name containerapp --upgrade --allow-preview` command to install the latest version. |

## Setup

1. Begin by creating variables with your custom values.

    Before you run this command, make sure to replace the placeholder values surrounded by `<>` with your own values.

    ```bash
    export RESOURCE_GROUP=<RESOURCE_GROUP>
    export LOCATION=<LOCATION>
    export CONTAINER_APP_ENVIRONMENT=<CONTAINER_APPS_ENVIRONMENT>
    ```

1. Create variables which hold the settings for your microservices app.

    ```bash
    export CONFIG_SERVER_COMPONENT=configserver
    export ADMIN_SERVER_COMPONENT=admin
    export EUREKA_SERVER_COMPONENT=eureka
    export CONFIG_SERVER_URI=https://github.com/spring-petclinic/spring-petclinic-microservices-config.git
    export CUSTOMERS_SERVICE=customers-service
    export VETS_SERVICE=vets-service
    export VISITS_SERVICE=visits-service
    export API_GATEWAY=api-gateway
    export CUSTOMERS_SERVICE_IMAGE=ghcr.io/azure-samples/javaaccelerator/spring-petclinic-customers-service
    export VETS_SERVICE_IMAGE=ghcr.io/azure-samples/javaaccelerator/spring-petclinic-vets-service
    export VISITS_SERVICE_IMAGE=ghcr.io/azure-samples/javaaccelerator/spring-petclinic-visits-service
    export API_GATEWAY_IMAGE=ghcr.io/azure-samples/javaaccelerator/spring-petclinic-api-gateway
    ```

1. Log in to the Azure CLI and choose your active subscription.

    ```azurecli
    az login
    ```

1. Create a resource group to organize your Azure services.

    ```azurecli
    az group create \
      --name $RESOURCE_GROUP \
      --location $LOCATION
    ```

1. Create your Container Apps environment.

    This environment hosts both the Java components and your container apps.

    ```azurecli
    az containerapp env create \
      --name $CONTAINER_APP_ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --location $LOCATION
    ```

## Create Java components

Next create the different Java components that support your app:

* **Config Server**: Used to manage configuration settings for your microservices apps.
* **Eureka Server**: Used to manage service registry and discovery.
* **Admin**: Used to monitor and manage the health and metrics of your microservices apps.

### [Azure CLI](#tab/azure-cli)

1. Create the Config Server for Java component.

    ```azurecli
    az containerapp env java-component config-server-for-spring create \
      --environment $CONTAINER_APP_ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $CONFIG_SERVER_COMPONENT \
      --configuration spring.cloud.config.server.git.uri=$CONFIG_SERVER_URI
    ```

2. Create the Eureka Server for Java component.

    ```azurecli
    az containerapp env java-component eureka-server-for-spring create \
      --environment $CONTAINER_APP_ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $EUREKA_SERVER_COMPONENT
    ```

3. Create the Admin Server for Java component.

    ```azurecli
    az containerapp env java-component admin-for-spring create \
      --environment $CONTAINER_APP_ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $ADMIN_SERVER_COMPONENT
    ```

### [Azure portal](#tab/azure-portal)

1. Open your Container Apps environment in the Azure portal.

1. From the left menu, expand the *Services* menu and select the **Service**.

    In this section, you create three components in total.

1. Create the Config Server component.

    Select **Configure** and choose **Java component** to create a new Java component.

    Use the following table to add the values in the portal window.

    | Setting | Value | Remarks |
    |---|---|
    | Java component type | Select **Config Server for Spring**. | |
    | Java component name | Enter **configserver**. | This value matches what you defined for the `$CONFIG_SERVER_COMPONENT` variable. |

    In the *Git repositories* section, select **Add**.

    For the *URI* field, enter **https://github.com/spring-petclinic/spring-petclinic-microservices-config.git**

    Select **Add**.

    Select **Next**.

    Select **Configure** to finish the configuration.

1. Create the Eureka Server component.

    Select **Configure** and choose **Java component** to create a new Java component.

    Use the following table to add the values in the portal window.

    | Setting | Value | Remarks |
    |---|---|
    | Java component type | Select **Eureka Server for Spring**. | |
    | Java component name | Enter **eureka**. | This value matches what you defined for the `$EUREKA_SERVER_COMPONENT` variable. |

    Select **Next**.

    Select **Configure** to finish the configuration.

1. Create the Admin Server component.

    Select **Configure** and choose **Java component** to create a new Java component.

    Use the following table to add the values in the portal window.

    | Setting | Value | Remarks |
    |---|---|
    | Java component type | Select **Admin for Spring**. | |
    | Java component name | Enter **admin**. | This value matches what you defined for the `$ADMIN_SERVER_COMPONENT` variable. |

    Select **Next**.

    Select **Configure** to finish the configuration.

---

## Deploy the microservice apps

Deploy the Java microservice apps to Azure Container Apps using the prebuilt container images.

> [!NOTE]
> In this article, you use a series of [built images](https://github.com/orgs/Azure-Samples/packages?tab=packages&q=spring-petclinic) for the [Spring Petclinic microservice apps](https://github.com/spring-petclinic/spring-petclinic-microservices). You also have the option to customize the sample code and use your own images. For more information, see the [GitHub sample repository](https://github.com/Azure-Samples/azure-container-apps-java-samples/tree/main/spring-petclinic-microservices/README.md).

1. Create the customer data app.

    ```azurecli
    az containerapp create \
      --name $CUSTOMERS_SERVICE \
      --resource-group $RESOURCE_GROUP \
      --environment $CONTAINER_APP_ENVIRONMENT \
      --image $CUSTOMERS_SERVICE_IMAGE
    ```

1. Create the vet app.

    ```azurecli
    az containerapp create \
      --name $VETS_SERVICE \
      --resource-group $RESOURCE_GROUP \
      --environment $CONTAINER_APP_ENVIRONMENT \
      --image $VETS_SERVICE_IMAGE
    ```

1. Create the visits app.

    ```azurecli
    az containerapp create \
      --name $VISITS_SERVICE \
      --resource-group $RESOURCE_GROUP \
      --environment $CONTAINER_APP_ENVIRONMENT \
      --image $VISITS_SERVICE_IMAGE
    ```

1. Create the API gateway app.

    ```azurecli
    az containerapp create \
      --name $API_GATEWAY \
      --resource-group $RESOURCE_GROUP \
      --environment $CONTAINER_APP_ENVIRONMENT \
      --image $API_GATEWAY_IMAGE \
      --ingress external \
      --target-port 8080 \
      --query properties.configuration.ingress.fqdn 
    ```

## Bind container apps to Java components

Next, you bind together the Java components to your container apps.

The following commands create bindings which provide the following functionality:

* Injects configuration data into each app from the managed Config Server on startup.

* Registers the app with the managed Eureka Server for service discovery.

* Enables Admin server to monitor the app.

### [Azure CLI](#tab/azure-cli)

The `containerapp update` command creates bindings for each app.

1. Add bindings to the customer data app.

    ```azurecli
    az containerapp update \
      --name $CUSTOMERS_SERVICE \
      --resource-group $RESOURCE_GROUP \
      --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT $ADMIN_SERVER_COMPONENT
    ```

1. Add bindings to the vet service.

    ```azurecli
    az containerapp update \
      --name $VETS_SERVICE \
      --resource-group $RESOURCE_GROUP \
      --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT $ADMIN_SERVER_COMPONENT
    ```

1. Add bindings to the visits service.

    ```azurecli
    az containerapp update \
      --name $VISITS_SERVICE \
      --resource-group $RESOURCE_GROUP \
      --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT $ADMIN_SERVER_COMPONENT
    ```

1. Add bindings to the API gateway.

    This command returns the URL of the front end application. Open this location in your browser.

    ```azurecli
    az containerapp update \
      --name $API_GATEWAY \
      --resource-group $RESOURCE_GROUP \
      --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT $ADMIN_SERVER_COMPONENT \
      --query properties.configuration.ingress.fqdn 
    ```

### [Azure portal](#tab/azure-portal)

1. Open your Container Apps environment in the Azure portal.

1. From the left menu, expand the *Services* menu and select the **Service**.

1. For each of the three components, select the component by name.

1. In the *Bindings* section, add the four apps created in this tutorial.

:::image type="content" source="media/java-deploy-war-file/bind-apps.png" alt-text="Bind apps.":::

---

## Verify app status

1. View the front end application.

    Using the URL returned from the API gateway's `az containerapp update` command, go to the application in your browser.

    The application should resemble the following screenshot.

    :::image type="content" source="media/java-deploy-war-file/azure-container-apps-petclinic-warfile.png" alt-text="Screenshot of pet clinic application." lightbox="media/java-deploy-war-file/azure-container-apps-petclinic-warfile.png":::

1. View the Eureka Server dashboard.

    Run the following command to return the dashboard URL.

    ```azurecli
    az containerapp env java-component eureka-server-for-spring show \
      --environment $CONTAINER_APP_ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $EUREKA_SERVER_COMPONENT \
      --query properties.ingress.fqdn
    ```

    Open the URL in your browser, and you should see an application that resembles the following screenshot.

    :::image type="content" source="media/java-deploy-war-file/azure-container-apps-petclinic-eureka.png" alt-text="Screenshot of pet clinic application Eureka Server." lightbox="media/java-deploy-war-file/azure-container-apps-petclinic-eureka.png":::

1. View the Admin for Spring dashboard.

    Run the following command to return the dashboard URL.

    ```azurecli
    az containerapp env java-component admin-for-spring show \
      --environment $CONTAINER_APP_ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $ADMIN_SERVER_COMPONENT \
      --query properties.ingress.fqdn
    ```

    Open the URL in your browser, and you should see an application that resembles the following screenshot.

    :::image type="content" source="media/java-deploy-war-file/azure-container-apps-petclinic-admin.png" alt-text="Screenshot of pet clinic application Admin." lightbox="media/java-deploy-war-file/azure-container-apps-petclinic-admin.png":::

## Optional: Configure Java components

The Java components created in this tutorial can be configured through the Azure portal. You can go to the **Configurations** section and add or update configurations for your Java components.

:::image type="content" source="media/java-deploy-war-file/java-component-configurations.png" alt-text="Configure Java components.":::

The supported configurations for each Java component are listed in the following links.

* [Config server for Java component](java-config-server-usage.md#configuration-options)

* [Eureka server for Java component](java-eureka-server-usage.md#allowed-configuration-list-for-your-eureka-server-for-spring)

* [Admin for Java component](java-admin-for-spring-usage.md#allowed-configuration-list-for-your-admin-for-spring)

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill. If you aren't going to use these services long-term, run the following command to remove everything created in this tutorial.

```azurecli
az group delete --resource-group $RESOURCE_GROUP
```
